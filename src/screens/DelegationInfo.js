import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {action, observable} from 'mobx';

import screensId from '../navigation/screensId';
import locale from 'locale';
import requests from '../network/requests';

import ScreenWrapper from '../components/ScreenWrapper';
import DelegationInfo from '../components/delegationInfo';
import CommonActivityIndicator from '../components/commonActivityIndicator';

@inject('navigationStore')
@observer
class DelegationInfoScreen extends Component {
  static options() {
    return {
      id: screensId.DELEGATION_INFO,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.title_delegation_info,
        },
      },
    };
  }

  @observable
  delegationData = null;

  @observable
  delegationActivity = false;

  @observable
  statusChangeActivity = false;

  @action
  getDelegationInfo = async () => {
    const {delegationData, notificationApiId} = this.props;
    if (!this.delegationActivity) {
      try {
        this.delegationActivity = true;
        const delegationId = notificationApiId || delegationData.id;
        const response = await requests.delegationData(delegationId);
        console.log('delegation info request response');
        console.log(response);
        if (response.data.result) {
          this.delegationData = response.data.data;
        }
        this.delegationActivity = false;
      } catch (e) {
        this.delegationActivity = false;
        console.log(e.response || e);
      }
    }
  };

  @action
  handleStatusChangePress = async () => {
    const {delegationData, notificationApiId, onStatusChange} = this.props;
    if (!this.statusChangeActivity) {
      try {
        this.statusChangeActivity = true;
        const delegationId = notificationApiId || delegationData.id;
        const response = await requests.setDelegationActiveStatus(
          delegationId,
          this.delegationData
            ? !this.delegationData.is_active
            : !delegationData.is_active,
        );
        console.log('delegation status change response');
        console.log(response);
        if (response.data.result) {
          await this.getDelegationInfo();
          onStatusChange && onStatusChange();
        }
        this.statusChangeActivity = false;
      } catch (e) {
        this.statusChangeActivity = false;
        console.log(e.response || e);
      }
    }
  };

  handleEmployeePress = employeeData => {
    console.log(employeeData);
    this.props.navigationStore.pushScreen(screensId.CATALOG_EMPLOYEE_INFO, {
      employeeData,
    });
  };

  @action
  componentDidMount() {
    const {delegationData} = this.props;
    if (delegationData) {
      this.delegationData = delegationData;
    }
    this.getDelegationInfo();
  }

  render() {
    const {isInitiator} = this.props;
    return (
      <ScreenWrapper>
        {!this.delegationData && !!this.delegationActivity ? (
          <CommonActivityIndicator />
        ) : (
          <DelegationInfo
            isInitiator={isInitiator}
            statusChangeActivity={this.statusChangeActivity}
            onStatusChangePress={this.handleStatusChangePress}
            onEmployeePress={this.handleEmployeePress}
            data={this.delegationData}
          />
        )}
      </ScreenWrapper>
    );
  }
}

export default DelegationInfoScreen;
