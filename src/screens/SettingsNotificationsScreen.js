import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {action, computed, observable} from 'mobx';

import ScreenWrapper from '../components/ScreenWrapper';
import SettingsNotifications from '../components/setttingsNotifications';

import screensId from '../navigation/screensId';
import locale from '../locale';
import requests from '../network/requests';
import {showMessage} from '../utils/showMessage';
import {showNetworkError} from '../utils/showNetworkError';

@inject('navigationStore')
@observer
class SettingsNotificationsScreen extends Component {
  static options() {
    return {
      id: screensId.SETTINGS_NOTIFICATIONS,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.title_settings_notifications,
        },
      },
    };
  }

  @observable
  dataActivity = false;

  @observable
  isSubmitting = false;

  @computed
  get getNotificationsSettings() {
    return this.notificationsSettings;
  }

  @observable
  notificationsSettings = null;

  @action
  getNotificationSettings = async () => {
    if (!this.dataActivity) {
      try {
        const response = await requests.settingsNotifications();
        if (response && response.data && response.data.data) {
          console.log(response.data.data);
          this.notificationsSettings = response.data.data;
        } else {
          console.log(response);
          showMessage(locale.ru.error_network);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  componentDidMount() {
    this.getNotificationSettings();
  }

  @action
  handleChange = (property, value) => {
    this.notificationsSettings = {
      ...this.notificationsSettings,
      [property]: value,
    };
  };

  handleCancel = () => {
    this.props.navigationStore.popScreen();
  };

  handleSave = async () => {
    if (!this.isSubmitting) {
      try {
        const response = await requests.settingsNotificationsSave(
          this.notificationsSettings,
        );
        console.log({...response.data});
        if (response.data.result === true) {
          this.props.navigationStore.popScreen();
        } else {
          showMessage(locale.ru.error_network);
        }
      } catch (e) {
        console.log(e);
        showNetworkError(e.response);
      }
    }
  };

  render() {
    return (
      <ScreenWrapper>
        <SettingsNotifications
          settings={this.getNotificationsSettings}
          onChange={this.handleChange}
          onSave={this.handleSave}
          onCancel={this.handleCancel}
          isSubmitting={this.isSubmitting}
        />
      </ScreenWrapper>
    );
  }
}

export default SettingsNotificationsScreen;
