import {setAuthorizationToken} from '../network/config';
import ProfileStore from './profileStore';
import navigationStore from './navigationStore';
import notificationsStore from './notificationsStore';
import asyncStorage from '../utils/asyncStorage';
import requests from '../network/requests';
import {showMessage} from '../utils/showMessage';
import locale from 'locale';
import screensId from '../navigation/screensId';

class AuthStore {
  credentials = null;

  setCredentials = async credentials => {
    if (!credentials) {
      this.credentials = null;
      setAuthorizationToken(null);
      await asyncStorage.saveKey('credentials', '');
    } else {
      this.credentials = credentials;
      setAuthorizationToken(credentials.accessToken);
      await asyncStorage.saveKey('credentials', JSON.stringify(credentials));
    }
  };

  logout = async () => {
    try {
      const response = await requests.logout();
      console.log(response.data);
      if (response.data.result) {
        this.setCredentials(null);
        ProfileStore.clearUserData();
        notificationsStore.removeListeners();
        navigationStore.startLoginApp();
      } else {
        showMessage(locale.ru.error, locale.ru.couldnt_log_out);
      }
    } catch (e) {
      showMessage(locale.ru.error, locale.ru.error_network);
      console.log(e);
      console.log(e.response);
    }
  };

  refreshTokens = async (credentials = {}) => {
    let updatedCredentials = null;
    try {
      setAuthorizationToken(null);
      const response = await requests.tokenRefresh(credentials.refreshToken);
      console.log('tokens refresh response');
      console.log(response);
      if (response.data.result) {
        updatedCredentials = {
          accessToken: response.data.data.access_token,
          refreshToken: response.data.data.refresh_token,
          expirationDate: response.data.data.refresh_token_expire_at,
        };
        this.setCredentials(updatedCredentials);
      }
    } catch (e) {
      console.log(e);
      console.log(e.response);
    }
    return updatedCredentials;
  };

  authorization = async credentials => {
    this.setCredentials(credentials);
    let result = await ProfileStore.updateUserData();
    console.log('auth result:' + result);
    if (result) {
      await asyncStorage.saveKey('wasRegistred', 'true');
      ProfileStore.updateBadges();
      navigationStore.startAuthApp();
    }
    return result;
  };

  handleApiAuthorizationError = async () => {
    if (this.credentials) {
      const updatedCredentials = await this.refreshTokens(this.credentials);
      if (
        !updatedCredentials &&
        navigationStore.currentRoot === screensId.MAIN_SCREEN
      ) {
        navigationStore.startLoginApp();
        this.setCredentials(null);
      }
    }
  };
}

export default new AuthStore();
