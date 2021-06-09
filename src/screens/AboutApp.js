import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {View} from 'react-native';

import commonStyles from 'styles';
import screensId from '../navigation/screensId';
import locale from 'locale';

import AboutAppInfo from '../components/aboutAppInfo';
import LoginSubmitButton from '../components/buttons/loginSubmitButton';
import ScreenNetworkConnectionIndicator from '../components/screenNetworkConnectionIndicator';

@inject('navigationStore')
@observer
class AboutAppScreen extends Component {
  static options() {
    return {
      id: screensId.ABOUT_APP,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.title_about_app,
        },
      },
    };
  }

  handleBackPress = () => {
    this.props.navigationStore.popScreen();
  };

  render() {
    return (
      <View
        style={[
          commonStyles.common.screenWrapper,
          commonStyles.common.screenOffset,
        ]}>
        <ScreenNetworkConnectionIndicator />
        <AboutAppInfo />
        <LoginSubmitButton
          onPress={this.handleBackPress}
          title={locale.ru.navigation_back}
        />
      </View>
    );
  }
}

export default AboutAppScreen;
