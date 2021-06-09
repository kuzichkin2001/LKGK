import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {observable, action} from 'mobx';
import {ActivityIndicator} from 'react-native';

import commonStyles from 'styles';
import screensId from '../navigation/screensId';
import requests from '../network/requests';
import locale from 'locale';
import {showMessage} from '../utils/showMessage';

import ApprovingTaskInfo from '../components/approvingTaskInfo';
import ScreenWrapper from '../components/ScreenWrapper';

@inject('navigationStore')
@observer
class ApprovingTaskInfoScreen extends Component {
  static options() {
    return {
      id: screensId.APPROVING_TASK_INFO,
      topBar: {
        visible: true,
        title: {
          text: '',
        },
      },
    };
  }

  @observable
  approvingTaskInfo = null;

  @observable
  approvingTaskActivity = false;

  @action
  getApprovingTaskInfo = async () => {
    if (!this.approvingTaskActivity) {
      let result = false;
      try {
        this.approvingTaskActivity = true;
        const response = await requests.approvingTaskInfo(
          (this.props.taskData && this.props.taskData.id) ||
            this.props.notificationApiId,
        );
        if (response.data.result) {
          this.approvingTaskInfo = response.data.data;
        } else {
          showMessage(locale.ru.error, locale.ru.couldnt_load_task_info);
        }
        this.approvingTaskActivity = false;
        console.log(response.data.data);
      } catch (e) {
        this.approvingTaskActivity = false;
        showMessage(locale.ru.error, locale.ru.error_network);
        console.log(e);
        console.log(e.response);
      }
      return result;
    }
  };

  handleInitiatorPress = () => {
    if (!!this.approvingTaskInfo && this.approvingTaskInfo.initiator) {
      this.props.navigationStore.pushScreen(screensId.CATALOG_EMPLOYEE_INFO, {
        employeeData: this.approvingTaskInfo.initiator,
      });
    }
  };

  handleFactExecutorPress = () => {
    if (!!this.approvingTaskInfo && this.approvingTaskInfo.fact_executor) {
      this.props.navigationStore.pushScreen(screensId.CATALOG_EMPLOYEE_INFO, {
        employeeData: this.approvingTaskInfo.fact_executor,
      });
    }
  };

  handleEmployeePress = employeeData => {
    if (!employeeData) {
      return;
    }
    this.props.navigationStore.pushScreen(screensId.CATALOG_EMPLOYEE_INFO, {
      employeeData,
    });
  };

  componentDidMount() {
    this.getApprovingTaskInfo();
  }

  handleDecisionPress = buttonData => {
    try {
      this.props.navigationStore.pushScreen(
        screensId.APPROVING_TASK_DECISION,
        {
          taskData: this.approvingTaskInfo,
          decisionData: buttonData,
          taskDecisionCallback: this.props.taskDecisionCallback,
        },
        {
          topBar: {
            title: {
              text: this.approvingTaskInfo.name,
            },
          },
        },
      );
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <ScreenWrapper>
        {this.approvingTaskInfo ? (
          <ApprovingTaskInfo
            onEmployeePress={this.handleEmployeePress}
            onInitiatorPress={this.handleInitiatorPress}
            onFactExecutorPress={this.handleFactExecutorPress}
            onDecisionPress={this.handleDecisionPress}
            taskData={this.approvingTaskInfo}
          />
        ) : (
          !!this.approvingTaskActivity && (
            <ActivityIndicator
              color={commonStyles.colors.label}
              size={'large'}
              style={commonStyles.common.topOffsetXL}
            />
          )
        )}
      </ScreenWrapper>
    );
  }
}

export default ApprovingTaskInfoScreen;
