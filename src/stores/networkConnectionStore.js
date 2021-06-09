import {observable, action} from 'mobx';
import NetInfo from '@react-native-community/netinfo';

import requests from '../network/requests';
import {showMessage} from '../utils/showMessage';

class NetworkConnectionStore {
  constructor() {
    NetInfo.addEventListener(this.connectionStateListener);
  }

  @observable
  connectionStatus = false;

  @action
  connectionStateListener = connectionState => {
    console.log('connection state listener');
    console.log(connectionState);
    try {
      this.connectionStatus = !!connectionState.isConnected;
    } catch (e) {
      console.log(e);
    }
  };

  checkConnectionStatus = async () => {
    let result = false;
    try {
      const connectionState = await NetInfo.fetch();
      result = !!connectionState.isConnected;
    } catch (e) {
      console.log(e);
    }
    return result;
  };

  checkServerWorkingStatus = async () => {
    let result = false;
    try {
      await requests.officesList();
      result = true;
    } catch (e) {
      console.log(e);
      try {
        if (e.response.code !== 500) {
          if (e.response.code === 404) {
            showMessage('Ошибка', 'Данный функционал временно недоступен');
          }
          result = true;
        }
      } catch (error) {
        console.log(error);
      }
    }
    return result;
  };
}

export default new NetworkConnectionStore();
