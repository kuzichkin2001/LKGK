import {Navigation} from 'react-native-navigation';
import topBarButtons from '../navigation/topBarButtons';

const setCommonRoot = (componentId, isTopBarVisible = true, passProps) => {
  Navigation.setRoot({
    root: {
      stack: {
        options: {
          topBar: {
            visible: !!isTopBarVisible,
          },
        },
        children: [
          {
            component: {
              name: componentId,
              passProps,
            },
          },
        ],
      },
    },
  });
};

const setSideMenuRoot = (rootScreen, leftSideMenu) => {
  Navigation.setRoot({
    root: {
      options: {
        topBar: {
          visible: false,
        },
      },
      sideMenu: {
        left: {
          component: {
            name: leftSideMenu,
          },
        },
        center: {
          stack: {
            children: [
              {
                component: {
                  options: {
                    topBar: {
                      visible: false,
                    },
                  },
                  name: rootScreen,
                },
              },
            ],
          },
        },
      },
    },
  });
};

const setTopBarVisibility = (componentId, visibilityStatus) => {
  Navigation.mergeOptions(componentId, {
    topBar: {
      visible: !!visibilityStatus,
    },
  });
};

let pushBlock = false;

const pushScreen = (from, to, passProps, options = {}) => {
  if (!pushBlock) {
    pushBlock = true;
    console.log(from, to, passProps);
    Navigation.push(from, {
      component: {
        name: to,
        passProps,
        options: {
          ...options,
          topBar: {
            ...options.topBar,
            leftButtons: (options.topBar && options.topBar.leftButtons) || [
              topBarButtons.back,
            ],
          },
        },
      },
    });
    setTimeout(() => (pushBlock = false), 300);
  }
};

const setLeftMenuVisibility = (componentId, status) => {
  Navigation.mergeOptions(componentId, {
    sideMenu: {
      left: {
        visible: !!status,
      },
    },
  });
};

const setLeftMenuEnableStatus = (componentId, status) => {
  Navigation.mergeOptions(componentId, {
    sideMenu: {
      left: {
        enabled: !!status,
      },
    },
  });
};

const popScreen = from => {
  Navigation.pop(from);
};

const popToScreen = (screen, options) => {
  Navigation.popTo(screen, options);
};

const setScreenTitle = (screenId, title) => {
  try {
    Navigation.mergeOptions(screenId, {
      topBar: {
        title: {
          text: title,
        },
      },
    });
  } catch (e) {
    console.log(e);
  }
};

const setTopBarButtons = (screenId, {leftButtons, rightButtons}) => {
  try {
    Navigation.mergeOptions(screenId, {
      topBar: {
        leftButtons,
        rightButtons,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

export default {
  setCommonRoot,
  setTopBarVisibility,
  pushScreen,
  popScreen,
  popToScreen,
  setSideMenuRoot,
  setLeftMenuVisibility,
  setLeftMenuEnableStatus,
  setScreenTitle,
  setTopBarButtons,
};
