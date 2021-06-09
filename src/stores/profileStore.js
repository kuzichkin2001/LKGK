import {Platform} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {observable, action} from 'mobx';

import requests from '../network/requests';
import {showMessage} from '../utils/showMessage';
import locale from '../locale';

class ProfileStore {
  @observable
  userData = null;

  @observable
  badges = null;

  @action
  updateUserData = async () => {
    let result = false;
    await requests
      .userProfile()
      .then(response => {
        console.log('update user data response:');
        console.log(response);
        if (response.data.result === true) {
          result = true;
          this.userData = response.data.data;
        }
      })
      .catch(error => {
        showMessage(locale.ru.error, locale.ru.error_network);
        console.log('update user data error:');
        console.log(error);
        console.log(error.response);
      });
    return result;
  };

  @action
  clearUserData = () => {
    this.userData = null;
    this.badges = null;
  };

  @action
  updateBadges = async () => {
    try {
      console.log('update badges');
      const response = await requests.badges();
      if (response.data.result) {
        this.badges = response.data.data;
        if (Platform.OS === 'ios') {
          PushNotificationIOS.checkPermissions(async permissions => {
            if (!permissions.badge) {
              try {
                await PushNotificationIOS.requestPermissions();
              } catch (err) {
                console.log(err);
              }
            }
            PushNotificationIOS.setApplicationIconBadgeNumber(
              this.badges.approval || 0,
            );
          });
        }
      }
      console.log(response);
    } catch (e) {
      console.log(e);
      console.log(e.response);
    }
  };
}

export default new ProfileStore();
