import axios from 'axios';
import DeviceInfo from 'react-native-device-info';

import routes from './routes';

let apiAuthResponseErrorHandler = null;

export const setApiAuthResponseErrorHandler = handler => {
  apiAuthResponseErrorHandler = handler;
};

axios.defaults.baseURL = 'https://mobapp.gk-osnova.ru';
// axios.defaults.headers['X-Callback-Key'] = 'osnova_callback';

axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    try {
      console.log(error.response || error);
      if (
        error.response &&
        error.response.status &&
        error.response.status === 401 &&
        error.response.config.url !==
          axios.defaults.baseURL + routes.tokenRefresh
      ) {
        apiAuthResponseErrorHandler();
      }
    } catch (e) {
      console.log(e);
    }
    return Promise.reject(error);
  },
);

const setUserAgent = async () => {
  let userAgent = '';
  try {
    userAgent = `${await DeviceInfo.getSystemName()}; ${await DeviceInfo.getSystemVersion()}; ${DeviceInfo.getBrand()}; ${await DeviceInfo.getDeviceName()}; ${DeviceInfo.getDeviceType()};${
      (await DeviceInfo.isEmulator()) ? ' Is Emulator; ' : ''
    }App Version: ${DeviceInfo.getVersion()};`;
    axios.defaults.headers['User-Agent'] = userAgent;
    console.log(axios.defaults);
  } catch (e) {
    console.log(e);
  }
  console.log(userAgent);
  return userAgent;
};

setUserAgent();

export const setAuthorizationToken = (accessToken = '') => {
  console.log('set access token: ' + accessToken);
  axios.defaults.headers.Authorization = `Bearer ${accessToken}`;
};
