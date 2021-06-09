import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {action, computed, observable} from 'mobx';
import LargeSubmitButton from '../components/buttons/largeSubmitButton';
import {Navigation} from 'react-native-navigation';

import screensId from '../navigation/screensId';
import locale from 'locale';
import requests from '../network/requests';
import {showMessage} from '../utils/showMessage';

import ScreenWrapper from '../components/ScreenWrapper';
import CommonFlatList from '../components/lists/commonFlatList';
import VacationRequestsListItem from '../components/listsItems/vacationRequestsListItem';
import RequestsVacationCreateScreen from './RequestsVacationCreate';
import {vacationRequestStatusEnum} from '../constants';

const VACATION_REQUESTS_INITIAL = [];

@inject('navigationStore')
@observer
class RequestsVacationScreen extends Component {
  static options() {
    return {
      id: screensId.REQUESTS_VACATION,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.title_requests_vacation,
        },
      },
    };
  }

  appearListener;

  @observable
  vacationRequests = VACATION_REQUESTS_INITIAL;

  @observable
  vacationRequestsActivity = false;

  @action
  getVacationRequests = async () => {
    if (!this.vacationRequestsActivity) {
      try {
        this.vacationRequestsActivity = true;
        const {requestType} = this.props;
        const response = await requests.vacationRequests(requestType);
        if (
          response.data.result ||
          (response.data.data && response.data.data.length >= 0)
        ) {
          this.vacationRequests = response.data.data;
        } else {
          showMessage(
            locale.ru.error,
            locale.ru.couldnt_load_vacation_requests,
          );
          this.vacationRequests = VACATION_REQUESTS_INITIAL;
        }
        this.vacationRequestsActivity = false;
      } catch (e) {
        console.log(e.response || e);
        showMessage(locale.ru.error, locale.ru.couldnt_load_vacation_requests);
        this.vacationRequests = VACATION_REQUESTS_INITIAL;
        this.vacationRequestsActivity = false;
      }
    }
  };

  @computed
  get emptyListTitle() {
    return [
      RequestsVacationCreateScreen.vacation_type_Absence_Workers,
      RequestsVacationCreateScreen.vacation_type_Absence_Personal,
    ].includes(this.props.requestType)
      ? locale.ru.empty_list_absence
      : locale.ru.empty_list_vacations;
  }

  handleRequestPress = requestData => {
    if (requestData) {
      // edit draft
      if (requestData.current_status_id === vacationRequestStatusEnum.DRAFT) {
        this.openEditorScreen(requestData);
        return;
      }
      this.props.navigationStore.pushScreen(
        screensId.REQUESTS_VACATION_INFO,
        {
          requestData,
        },
        {
          topBar: {
            title: {
              text: requestData.theme || requestData.note,
            },
          },
        },
      );
    }
  };

  openEditorScreen = (initialData = {}) => {
    const {requestType} = this.props;
    const title =
      locale.ru.request_to +
      ' ' +
      RequestsVacationCreateScreen.vacationRequestTypes[
        requestType
      ].toLowerCase();
    this.props.navigationStore.pushScreen(
      screensId.REQUESTS_VACATION_CREATE,
      {
        requestType,
        initialData,
        successCreateCallback: () => {
          {
            this.props.navigationStore.popScreen();
          }
        },
      },
      {
        topBar: {
          title: {
            text: title,
          },
        },
      },
    );
  };

  handleCreatePress = (initialData = {}) => {
    this.openEditorScreen();
  };

  componentDidMount() {
    this.appearListener = Navigation.events().registerComponentDidAppearListener(
      foo => this.getVacationRequests(true),
    );
  }

  componentWillUnmount() {
    this.appearListener.remove();
  }

  render() {
    const {requestType} = this.props;
    return (
      <ScreenWrapper>
        <CommonFlatList
          onItemPress={this.handleRequestPress}
          ItemComponent={VacationRequestsListItem}
          onRefresh={this.getVacationRequests}
          refreshing={this.vacationRequestsActivity}
          data={this.vacationRequests}
          emptyListTitle={this.emptyListTitle}
        />
        <LargeSubmitButton
          onPress={this.handleCreatePress}
          title={locale.ru.create_request}
        />
      </ScreenWrapper>
    );
  }
}

export default RequestsVacationScreen;
