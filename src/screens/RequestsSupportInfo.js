import React, {Component} from 'react';
import {observable, action, computed} from 'mobx';
import {observer, inject} from 'mobx-react';
import {View, ScrollView} from 'react-native';

import commonStyles from 'styles';
import screensId from '../navigation/screensId';
import requests from '../network/requests';
import locale from 'locale';
import {showMessage} from '../utils/showMessage';
import {
  getSupportRequestStatusStyle,
  getSupportRequestStatusTitle,
} from '../components/listsItems/supportRequest';
import formatDate from '../utils/formatDate';

import ScreenNetworkConnectionIndicator from '../components/screenNetworkConnectionIndicator';
import CommonActivityIndicator from '../components/commonActivityIndicator';
import RequestsSupportCreateScreen from './RequestsSupportCreate';
import ScreenWrapper from '../components/ScreenWrapper';
import TitledInfoRow from '../components/titledInfoRow';

@inject()
@observer
class RequestsSupportInfoScreen extends Component {
  static options() {
    return {
      id: screensId.REQUESTS_SUPPORT_INFO,
      topBar: {
        visible: true,
      },
    };
  }

  @observable
  requestDataActivity = false;

  @observable
  requestData = null;

  @computed
  get isLoadingVisible() {
    if (this.requestDataActivity && !this.requestData) {
      return true;
    } else {
      return false;
    }
  }

  @action
  getRequestData = async () => {
    if (!this.requestDataActivity) {
      try {
        this.requestDataActivity = true;
        const {requestData, notificationApiId} = this.props;
        const requestId = requestData ? requestData.id : notificationApiId;
        if (!requestId && !this.requestData) {
          showMessage(locale.ru.error, locale.ru.couldnt_get_request_info);
        } else {
          const response = await requests.supportRequestInfo(requestId);
          console.log(response);
          if (response.data.result) {
            this.requestData = response.data.data;
          } else {
            if (!this.requestData) {
              showMessage(locale.ru.error, locale.ru.couldnt_get_request_info);
              return;
            }
          }
        }
        this.requestDataActivity = false;
      } catch (e) {
        this.requestDataActivity = false;
        console.log(e);
      }
    }
  };

  componentDidMount() {
    const {requestData} = this.props;
    if (requestData) {
      this.requestData = requestData;
    }
    this.getRequestData();
  }

  render() {
    if (!this.requestData) {
      return (
        <View
          style={[
            commonStyles.common.screenWrapper,
            commonStyles.common.screenOffset,
          ]}>
          <ScreenNetworkConnectionIndicator />
          {!!this.requestDataActivity && <CommonActivityIndicator />}
        </View>
      );
    }

    const {
      is_send,
      type_request,
      created_at,
      comment,
      files,
    } = this.requestData;

    return (
      <ScreenWrapper>
        <ScrollView>
          <TitledInfoRow
            icon={require('images/rows.png')}
            title={locale.ru.support_request_type}
            value={
              RequestsSupportCreateScreen.supportRequestTypes[type_request]
            }
          />
          <TitledInfoRow
            icon={require('images/rows.png')}
            title={locale.ru.status}
            valueStyle={getSupportRequestStatusStyle(is_send)}
            value={getSupportRequestStatusTitle(is_send)}
          />
          <TitledInfoRow
            icon={require('images/date.png')}
            title={locale.ru.created_at}
            value={formatDate(created_at, 'DD.MM.YY')}
          />
          <TitledInfoRow
            icon={require('images/rows.png')}
            title={locale.ru.comment}
            value={comment}
          />
          {Array.isArray(files) && files.length > 0 && (
            <TitledInfoRow
              icon={require('images/attachment.png')}
              title={locale.ru.files}
              value={files[0].name}
            />
          )}
        </ScrollView>
      </ScreenWrapper>
    );
  }
}

export default RequestsSupportInfoScreen;
