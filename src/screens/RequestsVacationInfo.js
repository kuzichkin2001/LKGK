import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {action, observable} from 'mobx';
import {ScrollView} from 'react-native';

import screensId from '../navigation/screensId';
import locale from 'locale';
import requests from '../network/requests';
import {showMessage} from '../utils/showMessage';
import commonStyles from 'styles';
// import formatDate from "../utils/formatDate";

import ScreenWrapper from '../components/ScreenWrapper';
import TitledInfoRow from '../components/titledInfoRow';
import Divider from '../components/divider';
import UserRow from '../components/userRow';
import {taskStatus} from '../constants';
import ApprovingTaskRelatedList from '../components/lists/approvingTaskRelatedList';

@inject('navigationStore')
@observer
class RequestsVacationInfoScreen extends Component {
  static options() {
    return {
      id: screensId.REQUESTS_VACATION_INFO,
      topBar: {
        visible: true,
      },
    };
  }

  @observable
  requestData = null;

  @action
  getRequestData = async () => {
    try {
      const {requestData, notificationApiId} = this.props;
      const requestId = requestData ? requestData.id : notificationApiId;
      const response = await requests.vacationRequest(requestId);
      if (response.status === 200) {
        this.requestData = response.data.data;
      } else {
        const errorMessage = this.requestData
          ? 'Не удалось обновить данные по заявке'
          : 'Не удалось получить данные по заявке ';
        showMessage(locale.ru.error, errorMessage);
      }
    } catch (e) {
      const errorMessage = this.requestData
        ? 'Не удалось обновить данные по заявке'
        : 'Не удалось получить данные по заявке ';
      showMessage(locale.ru.error, errorMessage);
      console.log(e.response || e);
    }
  };

  handleEmployeePress = employeeData => () => {
    this.props.navigationStore.pushScreen(screensId.CATALOG_EMPLOYEE_INFO, {
      employeeData,
    });
  };

  handleApprovingEmployeePress = employeeData => {
    this.handleEmployeePress(employeeData)();
  };

  @action
  componentDidMount() {
    const {requestData} = this.props;
    if (requestData) {
      this.requestData = requestData;
    }
    this.getRequestData();
  }

  render() {
    if (!this.requestData) {
      return <ScreenWrapper />;
    }
    const {initiator_user, related_tasks, delegate_user} = this.requestData;
    return (
      <ScreenWrapper>
        <ScrollView>
          <TitledInfoRow
            icon={require('images/rows.png')}
            value={this.requestData.bp_type_name}
            title={locale.ru.request_title}
          />
          <TitledInfoRow
            icon={require('images/action-dots.png')}
            value={this.requestData.number}
            title={locale.ru.request_number}
          />
          <TitledInfoRow
            icon={require('images/rows.png')}
            value={this.requestData.theme}
            title={locale.ru.vacation_theme}
          />
          <TitledInfoRow
            icon={require('images/rows.png')}
            value={this.requestData.note}
            title={locale.ru.vacation_comment}
          />
          <TitledInfoRow
            icon={require('images/rows.png')}
            value={taskStatus[this.requestData.current_status_id]}
            title={locale.ru.status}
          />

          {!!initiator_user && <Divider title={locale.ru.task_initiator} />}
          <UserRow
            onPress={this.handleEmployeePress(initiator_user)}
            wrapperStyle={[
              commonStyles.common.listItem,
              commonStyles.common.paddingVertical10,
            ]}
            showArrow={true}
            userData={initiator_user}
          />
          {!!delegate_user && <Divider title={locale.ru.delegate_user} />}
          <UserRow
            onPress={this.handleEmployeePress(delegate_user)}
            wrapperStyle={[
              commonStyles.common.listItem,
              commonStyles.common.paddingVertical10,
            ]}
            showArrow={true}
            userData={delegate_user}
          />
          <ApprovingTaskRelatedList
            onPress={this.handleApprovingEmployeePress}
            ListHeaderComponent={
              <Divider title={locale.ru.approving_task_state} />
            }
            data={related_tasks}
          />
        </ScrollView>
      </ScreenWrapper>
    );
  }
}

export default RequestsVacationInfoScreen;
