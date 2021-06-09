import React, {Component} from 'react';
import {ActivityIndicator, ScrollView} from 'react-native';
import {inject, observer} from 'mobx-react';
import {action, observable} from 'mobx';

import navigationStore from '../stores/navigationStore';
import ScreenWrapper from '../components/ScreenWrapper';

import screensId from '../navigation/screensId';
import {requestDocumentsTypes} from '../constants';
import locale from '../locale';
import commonStyles from '../styles';
import requests from '../network/requests';
import {showMessage} from '../utils/showMessage';
import RequestDocumentInfo from '../components/requestDocumentInfo';

@inject()
@observer
class RequestsDocumentsInfoScreen extends Component {
  static options() {
    return {
      id: screensId.REQUESTS_DOCUMENTS_INFO,
      topBar: {
        visible: true,
      },
    };
  }

  @observable
  requestData = null;

  @observable
  getDocumentActivity = false;

  @action
  getDocument = async () => {
    if (!this.getDocumentActivity) {
      try {
        this.getDocumentActivity = true;
        const response = await requests.documentRequestsInfo(
          this.props.id || this.props.notificationApiId,
        );
        if (response.status === 200 && response.data) {
          let requestData = response.data.data;
          const document_type = requestData.type_int;
          requestData = {
            ...requestData,
            author: {
              ...requestData.author,
              full_name: requestData.author.fio,
            },
          };
          if (
            document_type != requestDocumentsTypes.document_type_Letter_Number
          ) {
            requestData = {
              ...requestData,
              participants: requestData.participants.map(participant => ({
                ...participant,
                full_name: participant.fio,
              })),
              coordinating: {
                ...requestData.coordinating,
                full_name: requestData.coordinating.fio,
              },
              executor: {
                ...requestData.executor,
                full_name: requestData.executor.fio,
              },
            };
          }
          navigationStore.setScreenTitle(requestData.name);
          this.requestData = requestData;
        } else {
          showMessage(locale.ru.error, locale.ru.couldnt_load_task_info);
          this.requestData = undefined;
        }
      } catch (e) {
        showMessage(locale.ru.error, locale.ru.error_network);
        console.log('error:');
        console.log(e);
        console.log(e.response);
      } finally {
        this.getDocumentActivity = false;
      }
      return true;
    }
  };

  @action
  componentDidMount() {
    try {
      this.getDocument();
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <ScreenWrapper>
        {this.requestData ? (
          <ScrollView>
            <RequestDocumentInfo
              requestData={this.requestData}
              onEmployeePress={this.props.onEmployeePress}
            />
          </ScrollView>
        ) : (
          <ActivityIndicator
            color={commonStyles.colors.label}
            size={'large'}
            style={commonStyles.common.topOffsetXL}
          />
        )}
      </ScreenWrapper>
    );
  }
}

export default RequestsDocumentsInfoScreen;
