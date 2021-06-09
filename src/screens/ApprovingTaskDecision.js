import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {observable, action} from 'mobx';

import ApprovingTaskDecisionForm from '../forms/approvingTaskDecisionForm';
import ScreenWrapper from '../components/ScreenWrapper';

import screensId from '../navigation/screensId';
import locale from 'locale';
import inputTypes from '../forms/inputTypes';
import requests from '../network/requests';
import {showMessageAsync} from '../utils/showMessage';

@inject('navigationStore')
@observer
class ApprovingTaskDecisionScreen extends Component {
  static options() {
    return {
      id: screensId.APPROVING_TASK_DECISION,
      topBar: {
        visible: true,
      },
    };
  }

  goBack = () => {
    this.props.navigationStore.popToScreen(
      this.props.navigationStore.appearedScreensId[screensId.APPROVALS_CABINET],
    );
    if (this.props.taskDecisionCallback) {
      this.props.taskDecisionCallback();
    }
  };

  postTaskData = async submitData => {
    let message = '';
    const response = await requests.approvingTaskDecision(
      this.props.taskData,
      submitData,
    );
    if (response !== null && typeof response === 'object') {
      message = `'Код ответа: ${response.status || '?'}\r\n`;
      if (response && response.data) {
        const {result} = response.data;
        if (response.status === 200 && result) {
          // no error
          return undefined;
        } else {
          message += `Тип ошибки: 8.\r\n ${response.data.message ||
            'ответ неизвестен'}`;
        }
      } else {
        message += 'Тип ошибки: 6. Нет данных от сервера.';
      }
    } else {
      message += 'Тип ошибки: 5. Нет ответа сервера.';
    }
    return message;
  };

  @observable
  submittingStatus = false;

  @action
  handleSubmit = async formData => {
    let message;
    if (!this.submittingStatus) {
      this.submittingStatus = true;
      try {
        const submitData = {
          comment: formData[inputTypes.comment],
          status: this.props.decisionData.action,
        };
        message = await this.postTaskData(submitData);
      } catch (e) {
        console.log(e);
        const {response} = e;
        if (response) {
          const {data} = response;
          if (data && typeof data.error === 'string') {
            console.log(response.status);
            message = `Тип ошибки: 2.\r\nКод:${
              response.status
            }\r\nОтвет сервера:\r\n${data.error}`;
          } else {
            message = `Тип ошибки: 3.\r\nКод:${
              response.status
            }\r\nНет текста ошибки.\r\n${locale.ru.error_network}`;
          }
        } else {
          message =
            'Тип ошибки: 1. Нет ответа сервера.' + '\r\n' + e
              ? 'Ошибка не содержит данных\r\n'
              : e.toString();
        }
      } finally {
        // show message ?
        this.submittingStatus = false;
        if (message) {
          await showMessageAsync(locale.ru.error, message);
        }
        this.goBack();
      }
    }
  };

  render() {
    const {taskData, decisionData} = this.props;
    const formButtons = [
      {...decisionData, isSubmitting: this.submittingStatus},
    ];
    return (
      <ScreenWrapper>
        {!!taskData && !!decisionData && (
          <ApprovingTaskDecisionForm
            name={taskData ? taskData.name : ''}
            isSubmitting={this.submittingStatus}
            handleSubmit={this.handleSubmit}
            buttons={formButtons}
          />
        )}
      </ScreenWrapper>
    );
  }
}

export default ApprovingTaskDecisionScreen;
