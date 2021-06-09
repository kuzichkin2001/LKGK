import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {View} from 'react-native';

import screensId from '../navigation/screensId';
import {showMessage} from '../utils/showMessage';
import locale from 'locale';
import requests from '../network/requests';
import commonStyles from 'styles';

import LoginForm from '../forms/loginForm';
import StatusBarBackground from '../components/statusBackBackground';
import ScreenNetworkConnectionIndicator from '../components/screenNetworkConnectionIndicator';

@inject('authStore', 'navigationStore')
@observer
class LoginScreen extends Component {
  static options() {
    return {
      id: screensId.LOGIN_SCREEN,
      topBar: {
        drawBehind: false,
        visible: false,
        animate: false,
      },
    };
  }

  state = {
    activity: false,
  };

  handleSubmit = data => {
    if (!this.state.activity) {
      this.setState({activity: true});
      requests
        .login(data)
        .then(async response => {
          if (response.data.result) {
            await this.props.authStore.authorization({
              accessToken: response.data.data.access_token,
              refreshToken: response.data.data.refresh_token,
              expirationDate: response.data.data.refresh_token_expire_at,
            });
            this.setState({activity: false});
          } else {
            showMessage(locale.ru.error, locale.ru.couldnt_log_in);
            this.setState({activity: false});
          }
          console.log(response);
        })
        .catch(error => {
          showMessage(locale.ru.error, locale.ru.couldnt_log_in);
          this.setState({activity: false});
          console.log(error.response || error);
        });
    }
  };

  render() {
    return (
      <View style={commonStyles.common.screenWrapper}>
        <ScreenNetworkConnectionIndicator />
        <StatusBarBackground />
        <LoginForm
          activity={this.state.activity}
          handleSubmit={this.handleSubmit}
        />
      </View>
    );
  }
}

export default LoginScreen;
