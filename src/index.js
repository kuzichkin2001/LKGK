import {Navigation} from 'react-native-navigation';

import navigationSettings from './navigation';
import asyncStorage from './utils/asyncStorage';
import stores from './stores';
import {setApiAuthResponseErrorHandler} from './network/config';
import authStore from './stores/authStore';
import networkConnectionStore from './stores/networkConnectionStore';
import navigationStore from './stores/navigationStore';
import {showMessage} from './utils/showMessage';
import locale from 'locale';
import 'moment-duration-format';

class App {
  constructor() {
    navigationSettings.registerScreens(stores);
    setApiAuthResponseErrorHandler(authStore.handleApiAuthorizationError);
  }

  networkCheck = async () => {
    const networkConnectionStatus = await networkConnectionStore.checkConnectionStatus();
    const serverConnectionStatus = await networkConnectionStore.checkServerWorkingStatus();
    if (!networkConnectionStatus) {
      navigationStore.startNetworkErrorApp();
    } else if (!serverConnectionStatus) {
      navigationStore.startNetworkErrorApp({
        errorTitle: locale.ru.error_server_connection,
      });
    }
    return networkConnectionStatus && serverConnectionStatus;
  };

  async startApp() {
    Navigation.setDefaultOptions(navigationSettings.defaultConfig);
    const credentials = JSON.parse(await asyncStorage.getKey('credentials'));
    if (credentials) {
      if (credentials.expirationDate * 1000 < Date.now()) {
        await stores.authStore.setCredentials(null);
        stores.navigationStore.startLoginApp();
        setTimeout(() => {
          showMessage(
            locale.ru.couldnt_authorize,
            locale.ru.couldnt_authorize_message,
          );
        }, 1000);
        return;
      }
      const updatedCredentials = await stores.authStore.refreshTokens(
        credentials,
      );
      if (await this.networkCheck()) {
        if (updatedCredentials) {
          let result = await stores.authStore.authorization(updatedCredentials);
          if (await this.networkCheck()) {
            if (!result) {
              let wasRegistred = await asyncStorage.getKey('wasRegistred');
              if (wasRegistred) {
                stores.navigationStore.startLoginApp();
              } else {
                stores.navigationStore.startRegistrationApp();
              }
            }
          }
        } else {
          let wasRegistred = await asyncStorage.getKey('wasRegistred');
          if (wasRegistred) {
            stores.navigationStore.startLoginApp();
          } else {
            stores.navigationStore.startRegistrationApp();
          }
        }
      }
    } else {
      let wasRegistred = await asyncStorage.getKey('wasRegistred');
      if (wasRegistred) {
        stores.navigationStore.startLoginApp();
      } else {
        stores.navigationStore.startRegistrationApp();
      }
    }
  }
}

export default new App();
