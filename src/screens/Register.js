import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {observable, action} from 'mobx';
import {View} from 'react-native';

import screensId from '../navigation/screensId';
import locale from '../locale';
import requests from '../network/requests';
import {showMessage} from '../utils/showMessage';
import commonStyles from 'styles';

import ScreenNetworkConnectionIndicator from '../components/screenNetworkConnectionIndicator';
import LoginForm from '../forms/loginForm';

@inject('authStore', 'navigationStore')
@observer
class RegisterScreen extends Component {
  static options() {
    return {
      id: screensId.REGISTRATION_SCREEN,
      topBar: {
        visible: false,
      },
    };
  }

  @observable
  activity = false;

  @action
  handleSubmit = data => {
    if (!this.activity) {
      this.activity = true;
      requests
        .login(data)
        .then(async response => {
          if (response.data.result) {
            await this.props.authStore.authorization({
              accessToken: response.data.data.access_token,
              refreshToken: response.data.data.refresh_token,
              expirationDate: response.data.data.refresh_token_expire_at,
            });
            this.activity = false;
          } else {
            showMessage(locale.ru.error, locale.ru.couldnt_log_in);
            this.activity = false;
          }
          console.log(response);
        })
        .catch(error => {
          showMessage(locale.ru.error, locale.ru.couldnt_log_in);
          this.activity = false;
          console.log(error.response || error);
        });
    }
  };

  render() {
    return (
      <View style={commonStyles.common.screenWrapper}>
        <ScreenNetworkConnectionIndicator />
        <LoginForm
          showRegistrationMessage={true}
          activity={this.activity}
          handleSubmit={this.handleSubmit}
        />
      </View>
    );
  }
}

export default RegisterScreen;
