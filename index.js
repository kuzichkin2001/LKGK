import {Navigation} from 'react-native-navigation';

import App from './src';

Navigation.events().registerAppLaunchedListener(async () => {
  App.startApp();
});
