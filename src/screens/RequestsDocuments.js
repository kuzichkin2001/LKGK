import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {action, observable, toJS} from 'mobx';

import ScreenWrapper from '../components/ScreenWrapper';
import DocumentsRequestsList from '../components/lists/documentsRequestsList';

import requests from '../network/requests';
import screensId from '../navigation/screensId';
import locale from '../locale';
import {showNetworkError} from '../utils/showNetworkError';

@inject('navigationStore')
@observer
class RequestsDocumentsScreen extends Component {
  static options() {
    return {
      id: screensId.REQUESTS_DOCUMENTS,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.documents,
        },
      },
    };
  }

  @observable
  documentsRequestsList = [];

  @observable
  activity = false;

  @action
  getDocumentsRequests = async () => {
    if (!this.activity) {
      try {
        this.activity = true;
        const {requestType} = this.props;
        const response = await requests.documentsRequestsList(requestType);
        if (response.data && response.data.data.result) {
          this.documentsRequestsList = response.data.data.result;
        }
        this.activity = false;
      } catch (e) {
        this.activity = false;
        showNetworkError(e.response);
        console.log(e);
      }
    }
  };

  componentDidMount(): void {
    this.getDocumentsRequests();
  }

  handleEmployeePress = employeeData => {
    if (employeeData) {
      this.props.navigationStore.pushScreen(screensId.CATALOG_EMPLOYEE_INFO, {
        employeeData,
      });
    }
  };

  handleRequestPress = requestData => {
    const {id, external_id} = requestData;
    if (requestData && (external_id || id)) {
      this.props.navigationStore.pushScreen(
        screensId.REQUESTS_DOCUMENTS_INFO,
        {
          id: external_id || id,
          requestType: this.props.requestType,
          onEmployeePress: this.handleEmployeePress,
        },
        {
          topBar: {
            title: {
              text: requestData.name,
            },
          },
        },
      );
    }
  };

  handleCreatePress = () => {
    this.props.navigationStore.pushScreen(
      screensId.REQUESTS_DOCUMENTS_CREATE,
      {
        successCreateCallback: () => this.getDocumentsRequests(),
        requestType: this.props.requestType,
      },
      {
        topBar: {
          title: {
            text:
              this.props.createScreenTitle ||
              locale.ru.title_request_document_create,
          },
        },
      },
    );
  };

  render() {
    return (
      <ScreenWrapper>
        <DocumentsRequestsList
          data={toJS(this.documentsRequestsList)}
          refreshing={toJS(this.activity)}
          onRefresh={() => this.getDocumentsRequests(true)}
          onPress={this.handleRequestPress}
          onCreatePress={this.handleCreatePress}
          requestType={this.props.requestType}
        />
      </ScreenWrapper>
    );
  }
}

export default RequestsDocumentsScreen;
