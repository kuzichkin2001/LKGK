import {observable, action} from 'mobx';
import {Keyboard} from 'react-native';
import {Navigation} from 'react-native-navigation';

import navigationUtils from '../utils/navigation';
import defaultConfig from '../navigation/defaultConfig';
import screensId from '../navigation/screensId';
import profileStore from './profileStore';
import topBarButtons from '../navigation/topBarButtons';

class NavigationStore {
  constructor() {
    Navigation.events().registerComponentDidAppearListener(visibleScreen => {
      Keyboard.dismiss();
      console.log('component appear: ' + visibleScreen.componentName);
      if (visibleScreen.componentName !== screensId.SIDE_MENU) {
        if (visibleScreen.componentName === screensId.MAIN_SCREEN) {
          profileStore.updateBadges();
        }
        this.setVisibleScreen(visibleScreen);
        this.appearedScreensId[visibleScreen.componentName] =
          visibleScreen.componentId;
        navigationUtils.setLeftMenuEnableStatus(
          visibleScreen.componentId,
          visibleScreen.componentName === screensId.MAIN_SCREEN,
        );
      }
    });
    Navigation.events().registerNavigationButtonPressedListener(event => {
      try {
        const topBarButtonListener = this.topBarButtonsListeners[
          this.visibleScreen.componentName
        ];
        if (event.buttonId === topBarButtons.back.id) {
          if (!this.topBarPopBlock) {
            this.topBarPopBlock = true;
            this.popScreen();
            this.visibleScreen = this.previousVisibleScreen;
            setTimeout(() => {
              this.topBarPopBlock = false;
            }, 300);
          }
        } else if (topBarButtonListener) {
          topBarButtonListener(event);
        }
      } catch (e) {
        console.log(e);
      }
    });
  }

  topBarPopBlock = false;

  appearedScreensId = {};

  previousVisibleScreen = {};

  @observable
  visibleScreen = {};

  topBarButtonsListeners = {};

  currentRoot = null;

  @action
  setVisibleScreen = visibleScreen => {
    this.previousVisibleScreen = this.visibleScreen;
    this.visibleScreen = visibleScreen;
  };

  addTopBarButtonListener = (componentName, listener) => {
    this.topBarButtonsListeners[componentName] = listener;
    return () => {
      this.topBarButtonsListeners[componentName] = null;
    };
  };

  pushScreen = (to = screensId.UNDER_DEVELOPMENT, passProps, options) => {
    if ([...Object.keys(screensId).find(key => screensId[key] === to)]) {
      navigationUtils.pushScreen(
        this.visibleScreen.componentId,
        to,
        passProps,
        options,
      );
    } else {
      console.log('screen doesnt exists:' + to);
    }
  };

  popScreen = () => {
    Keyboard.dismiss();
    navigationUtils.popScreen(this.visibleScreen.componentId);
  };

  popToScreen = screen => {
    Keyboard.dismiss();
    navigationUtils.popToScreen(screen);
  };

  setLeftMenuVisibility = (visibilityStatus = false) => {
    navigationUtils.setLeftMenuVisibility(
      this.visibleScreen.componentId,
      !!visibilityStatus,
    );
  };

  startNetworkErrorApp(passProps) {
    if (this.currentRoot === screensId.NETWORK_ERROR) {
      return;
    }
    this.currentRoot = screensId.NETWORK_ERROR;
    navigationUtils.setCommonRoot(screensId.NETWORK_ERROR, true, passProps);
  }

  startLoginApp() {
    this.currentRoot = screensId.LOGIN_SCREEN;
    Keyboard.dismiss();
    navigationUtils.setCommonRoot(screensId.LOGIN_SCREEN, false);
  }

  startRegistrationApp() {
    this.currentRoot = screensId.REGISTRATION_SCREEN;
    Keyboard.dismiss();
    navigationUtils.setCommonRoot(screensId.REGISTRATION_SCREEN, false);
  }

  startAuthApp() {
    this.currentRoot = screensId.MAIN_SCREEN;
    Keyboard.dismiss();
    Navigation.setDefaultOptions(defaultConfig);
    navigationUtils.setSideMenuRoot(screensId.MAIN_SCREEN, screensId.SIDE_MENU);
  }

  notificationDataPush = (screenId, notificationApiId, otherProps, options) => {
    if (this.currentRoot === screensId.MAIN_SCREEN) {
      this.pushScreen(
        screenId,
        {
          notificationApiId,
          ...otherProps,
        },
        options,
      );
    }
  };

  setScreenTitle = title => {
    navigationUtils.setScreenTitle(this.visibleScreen.componentId, title);
  };

  setTopBarButtons = buttons => {
    navigationUtils.setTopBarButtons(this.visibleScreen.componentId, buttons);
  };
}

export default new NavigationStore();
