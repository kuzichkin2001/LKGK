import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {action, observable, computed, toJS} from 'mobx';

import screensId from '../navigation/screensId';
import locale from 'locale';
import requests from '../network/requests';
import {showMessage} from '../utils/showMessage';
import confirmPick from '../utils/confirmPicker';

import ActiveSessionsList from '../components/lists/activeSessionsList';
import ScreenWrapper from '../components/ScreenWrapper';

@inject()
@observer
class SettingsActiveSessionsScreen extends Component {
  static options() {
    return {
      id: screensId.SETTINGS_ACTIVE_SESSIONS,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.title_active_sessions,
        },
      },
    };
  }

  @observable
  sessionsList = [];

  @observable
  sessionsListActivity = false;

  @observable
  sessionsCleanActivity = false;

  @observable
  sessionsRemoveActivities = {};

  @computed
  get currentSession() {
    return this.sessionsList.find(session => session.current);
  }

  @action
  getSessionsList = async () => {
    try {
      if (!this.sessionsListActivity) {
        this.sessionsListActivity = true;
        const response = await requests.activeSessions();
        if (response.data.result) {
          this.sessionsList = response.data.data;
        }
        this.sessionsListActivity = false;
        console.log(response);
      }
    } catch (e) {
      this.sessionsListActivity = false;
      console.log(e);
      console.log(e.response);
    }
  };

  @action
  removeSessionById = id => {
    this.sessionsList = this.sessionsList.filter(session => session.id !== id);
  };

  handleSessionPress = sessionData => {
    if (!this.sessionsRemoveActivities[sessionData.id]) {
      confirmPick({
        subtitle: locale.ru.session_delete_confirm_message,
        onConfirm: () => this.removeSession(sessionData),
      });
    }
  };

  @action
  removeSession = async sessionData => {
    if (sessionData) {
      const sessionId = sessionData.id;
      if (!this.sessionsRemoveActivities[sessionId]) {
        try {
          this.sessionsRemoveActivities[sessionId] = true;
          const response = await requests.activeSessionDelete(sessionId);
          console.log(response);
          if (response.data.result) {
            this.removeSessionById(sessionId);
          } else {
            showMessage(locale.ru.error, locale.ru.couldnt_remove_session);
          }
          this.sessionsRemoveActivities[sessionId] = false;
        } catch (e) {
          showMessage(locale.ru.error, locale.ru.error_network);
          this.sessionsRemoveActivities[sessionId] = false;
          console.log(e);
          console.log(e.response);
        }
      }
    }
  };

  handleCleanSessionsPress = () => {
    if (!this.sessionsCleanActivity || !this.sessionsListActivity) {
      confirmPick({
        title: locale.ru.chose_variant,
        subtitle: locale.ru.other_sessions_remove_confirm_message,
        onConfirm: this.cleanSessions,
      });
    }
  };

  @action
  cleanSessions = async () => {
    if (!this.sessionsCleanActivity) {
      try {
        this.sessionsCleanActivity = true;
        const response = await requests.activeSessionsClear();
        console.log(response);
        if (response.data.result) {
          await this.getSessionsList();
        } else {
          showMessage(locale.ru.error, locale.ru.couldnt_remove_other_sessions);
        }
        this.sessionsCleanActivity = false;
      } catch (e) {
        showMessage(locale.ru.error, locale.ru.couldnt_remove_other_sessions);
        this.activity = false;
        console.log(e);
        console.log(e.response);
      }
    }
  };

  componentDidMount() {
    this.getSessionsList();
  }

  render() {
    return (
      <ScreenWrapper>
        <ActiveSessionsList
          sessionsCleanActivity={this.sessionsCleanActivity}
          currentSession={this.currentSession}
          sessionsRemoveActivities={toJS(this.sessionsRemoveActivities)}
          data={this.sessionsList}
          onRefresh={this.getSessionsList}
          refreshing={toJS(this.sessionsListActivity)}
          onSessionsCleanPress={this.handleCleanSessionsPress}
          onSessionPress={this.handleSessionPress}
        />
      </ScreenWrapper>
    );
  }
}

export default SettingsActiveSessionsScreen;
