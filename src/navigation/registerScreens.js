import React from 'react';
import {Provider} from 'mobx-react';
import {Navigation} from 'react-native-navigation';

import screens from '../screens';

const registerScreens = stores => {
  const screensArray = Object.keys(screens);
  screensArray.forEach(screenName => {
    const Screen = screens[screenName];
    Navigation.registerComponent(
      Screen.options().id,
      () =>
        class Wrapper extends React.PureComponent {
          static options = Screen.options;
          render() {
            return (
              <Provider {...stores}>
                <Screen {...this.props} />
              </Provider>
            );
          }
        },
    );
  });
};

export default registerScreens;
