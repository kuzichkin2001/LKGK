import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {action, observable} from 'mobx';

import screensId from '../navigation/screensId';
import locale from 'locale';
import requests from '../network/requests';
import inputTypes from '../forms/inputTypes';
import formatDate from '../utils/formatDate';
import {showNetworkError} from '../utils/showNetworkError';

import ScreenWrapper from '../components/ScreenWrapper';
import DelegationCreateForm from '../forms/delegationCreate';

@inject('navigationStore')
@observer
class DelegationCreateScreen extends Component {
  static options() {
    return {
      id: screensId.DELEGATION_CREATE,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.title_delegation_create,
        },
      },
    };
  }

  @observable
  createActivity = false;

  @action
  handleDelegationCreate = async values => {
    if (!this.createActivity) {
      this.createActivity = true;
      try {
        const requestData = {
          on_whom: values[inputTypes.executor].id_phperson,
          period_start: formatDate(
            values[inputTypes.delegationDatePeriod][inputTypes.dateStart],
            'YYYY-MM-DD HH:mm:ss',
          ),
          period_end: formatDate(
            values[inputTypes.delegationDatePeriod][inputTypes.dateEnd],
            'YYYY-MM-DD HH:mm:ss',
          ),
          is_active: 1,
        };
        const response = await requests.createDelegation(requestData);
        console.log(response);
        if (response.data.result) {
          this.props.navigationStore.popScreen();
          this.props.onSuccessCreate();
        } else {
          showNetworkError(response);
        }
        this.createActivity = true;
      } catch (e) {
        this.createActivity = false;
        showNetworkError(e.response);
        console.log(e.response || e);
      }
    }
  };

  handleEmployeePick = async () => {
    const {navigationStore} = this.props;
    return await new Promise(resolve => {
      navigationStore.pushScreen(
        screensId.CATALOG_EMPLOYEES,
        {
          onEmployeePress: employeeData => {
            resolve(employeeData);
            if (employeeData) {
              navigationStore.popScreen();
            }
          },
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
        <DelegationCreateForm
          isSubmitting={this.createActivity}
          onSubmit={this.handleDelegationCreate}
          onEmployeePick={this.handleEmployeePick}
        />
      </ScreenWrapper>
    );
  }
}

export default DelegationCreateScreen;
