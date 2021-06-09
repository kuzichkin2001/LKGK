import React, {Component} from 'react';
import {observable, action} from 'mobx';
import {observer, inject} from 'mobx-react';

import screensId from '../navigation/screensId';
import locale from 'locale';
import inputTypes from '../forms/inputTypes';
import formatDate from '../utils/formatDate';
import requests from '../network/requests';

import TaskCreateForm from '../forms/taskCreateForm';
import ScreenWrapper from '../components/ScreenWrapper';

@inject('navigationStore', 'profileStore')
@observer
class TaskCreateScreen extends Component {
  static options() {
    return {
      id: screensId.TASK_CREATE,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.title_task_create,
        },
      },
    };
  }

  @observable
  isFormSubmitting = false;

  @action
  handleSubmit = async values => {
    if (!this.isFormSubmitting) {
      try {
        this.isFormSubmitting = true;
        const requestData = {
          theme: values[inputTypes.theme],
          note: values[inputTypes.note],
          date_start: formatDate(
            values.taskDatePeriod[inputTypes.dateStart],
            'YYYY-MM-DD HH:mm:ss',
          ),
          date_end: formatDate(
            values.taskDatePeriod[inputTypes.dateEnd],
            'YYYY-MM-DD HH:mm:ss',
          ),
          initiator_user: this.props.profileStore.userData.id_phperson,
          executor_user: values[inputTypes.executor].id_phperson,
          assistants: values[inputTypes.assistants].map(
            employeeData => employeeData.id_phperson,
          ),
          observers: values[inputTypes.observers].map(
            employeeData => employeeData.id_phperson,
          ),
        };
        const response = await requests.taskCreate(requestData);
        console.log(response);
        if (response.data.result) {
          this.props.navigationStore.popScreen();
          this.props.successCallback();
        }
        this.isFormSubmitting = false;
      } catch (e) {
        this.isFormSubmitting = false;
        console.log(e.response || e);
      }
    }
  };

  handleEmployeePick = async () => {
    const {navigationStore} = this.props;
    return new Promise(resolve => {
      navigationStore.pushScreen(
        screensId.CATALOG_EMPLOYEES,
        {
          onEmployeePress: employeeData => {
            resolve(employeeData);
            if (employeeData) {
              navigationStore.popScreen();
            }
          },
          isSubordinate: true,
        },
        {
          topBar: {
            title: {
              text: locale.ru.select_employee,
            },
          },
        },
      );
    });
  };

  render() {
    return (
      <ScreenWrapper>
        <TaskCreateForm
          isSubmitting={this.isFormSubmitting}
          onSubmit={this.handleSubmit}
          onEmployeePick={this.handleEmployeePick}
        />
      </ScreenWrapper>
    );
  }
}

export default TaskCreateScreen;
