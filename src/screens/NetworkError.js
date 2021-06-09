import React, {Component} from 'react';
import {action, observable} from 'mobx';
import {observer, inject} from 'mobx-react';
import {View, StyleSheet, Image, Text} from 'react-native';

import commonStyles from 'styles';
import screensId from '../navigation/screensId';
import locale from 'locale';

import LoginSubmitButton from '../components/buttons/loginSubmitButton';
import App from '../index';

@inject()
@observer
class NetworkErrorScreen extends Component {
  static options() {
    return {
      id: screensId.NETWORK_ERROR,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.title_network_connection_error,
        },
      },
    };
  }

  @observable
  checkingActivity = false;

  @action
  handleButtonPress = async () => {
    if (!this.checkingActivity) {
      try {
        this.checkingActivity = true;
        await App.startApp();
        this.checkingActivity = false;
      } catch (e) {
        this.checkingActivity = false;
        console.log(e);
      }
    }
  };

  render() {
    const {errorTitle} = this.props;
    return (
      <View style={[commonStyles.common.screenWrapper, styles.wrapper]}>
        <Image
          resizeMode={'contain'}
          source={require('images/network-error.png')}
          style={styles.image}
        />
        <Text style={styles.title}>{locale.ru.error}</Text>
        <Text style={commonStyles.texts.commonLarge}>
          {errorTitle || locale.ru.error_network_connection}
        </Text>
        <LoginSubmitButton
          onPress={this.handleButtonPress}
          isSubmitting={this.checkingActivity}
          wrapperStyle={commonStyles.common.topOffsetXL}
          title={locale.ru.check}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: commonStyles.spaces.xl,
  },
  title: {
    ...commonStyles.common.topOffsetXL,
    ...commonStyles.texts.titleBig,
    fontSize: 18,
  },
  image: {
    height: 100,
    width: 100,
    tintColor: commonStyles.colors.red,
    marginRight: 7,
  },
});

export default NetworkErrorScreen;
