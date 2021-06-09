import {Dimensions, Platform} from 'react-native';
import commonStyles from 'styles';

const screenWidth = Dimensions.get('screen').width;

export default {
  animations: {
    push: {
      enabled: 'true',
      topBar: {
        x: {
          from: screenWidth,
          to: 0,
        },
        alpha: {
          from: 0,
          to: 1,
        },
      },
      bottomTabs: {
        x: {
          from: screenWidth,
          to: 0,
        },
        alpha: {
          from: 0,
          to: 1,
        },
      },
      content: {
        x: {
          from: screenWidth,
          to: 0,
        },
        alpha: {
          from: 0,
          to: 1,
        },
      },
    },
    pop: {
      enabled: 'true', // Optional, used to enable/disable the animation
      topBar: {
        alpha: {
          from: 1,
          to: 0,
        },
        x: {
          duration: 200,
          from: screenWidth * 4,
          to: 0,
        },
      },
      bottomTabs: {
        alpha: {
          from: 1,
          to: 0,
        },
        x: {
          from: 0,
          to: screenWidth * 4,
          duration: 200,
        },
      },
      content: {
        alpha: {
          from: 1,
          to: 0,
        },
        x: {
          from: 0,
          duration: 200,
          to: screenWidth * 4,
        },
      },
    },
  },
  statusBar: {
    visible: true,
    style: 'light',
    //android
    backgroundColor: 'rgba(0, 32, 91, 0.75)',
    drawBehind: false,
  },
  layout: {
    orientation: ['portrait'],
  },
  topBar: {
    borderHeight: 0,
    elevation: 0,
    noBorder: true,
    visible: true,
    animate: Platform.select({
      ios: true,
      android: false,
    }),
    leftButtonColor: commonStyles.colors.white,
    rightButtonColor: commonStyles.colors.white,
    drawBehind: false,
    title: {
      fontSize: 18,
      color: commonStyles.colors.white,
      fontFamily: commonStyles.fonts.CeraProBold,
      alignment: 'center',
    },
    backButton: {
      icon: require('assets/images/navBarIcons/arrow-back.png'),
      //ios
      showTitle: false,
    },
    background: {
      color: commonStyles.colors.blue,
      //ios
      translucent: false,
      blur: false,
    },
  },
  sideMenu: {
    left: commonStyles.common.sideMenu,
  },
};
