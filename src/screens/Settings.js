import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {View, StyleSheet} from 'react-native';
import {getBottomSpace} from 'react-native-iphone-x-helper';

import commonStyles from '../styles';
import screensId from '../navigation/screensId';
import locale from '../locale';

import TextButton from '../components/buttons/TextButton';
import ScreenWrapper from '../components/ScreenWrapper';
import ProfileButton from '../components/buttons/profileButton';

@inject('navigationStore')
@observer
class SettingsScreen extends Component {
  static options() {
    return {
      id: screensId.SETTINGS,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.title_settings,
        },
      },
    };
  }

  handleButtonPress = screenId => {
    this.props.navigationStore.pushScreen(screenId);
  };

  render() {
    return (
      <ScreenWrapper wrapperStyle={styles.screenWrapper}>
        <View>
          <ProfileButton
            title={locale.ru.title_active_sessions}
            onPress={() =>
              this.handleButtonPress(screensId.SETTINGS_ACTIVE_SESSIONS)
            }
          />
          <ProfileButton
            title={locale.ru.menu_settings_notifications}
            onPress={() =>
              this.handleButtonPress(screensId.SETTINGS_NOTIFICATIONS)
            }
          />
        </View>
        <TextButton
          titleStyle={styles.aboutAppButtonTitle}
          onPress={() => this.handleButtonPress(screensId.ABOUT_APP)}
          title={locale.ru.title_about_app}
        />
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  screenWrapper: {
    justifyContent: 'space-between',
    paddingBottom: getBottomSpace(),
  },
  aboutAppButtonTitle: {
    ...commonStyles.texts.titleBig,
    paddingVertical: commonStyles.spaces.xl,
    alignSelf: 'center',
  },
});

export default SettingsScreen;
