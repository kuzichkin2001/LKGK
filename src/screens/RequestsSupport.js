import React, {Component} from 'react';
import {action, observable, toJS} from 'mobx';
import {observer, inject} from 'mobx-react';

import screensId from '../navigation/screensId';
import locale from 'locale';
import requests from '../network/requests';
import {showMessage} from '../utils/showMessage';

import SupportRequestsList from '../components/lists/supportRequestsList';
import ScreenWrapper from '../components/ScreenWrapper';

@inject('navigationStore')
@observer
class RequestsSupportScreen extends Component {
  static options() {
    return {
      id: screensId.REQUESTS_SUPPORT,
      topBar: {
        visible: true,
      },
    };
  }

  static supportRequestTypes = {
    [1]: locale.ru.support_request_type1,
    [2]: locale.ru.support_request_type2,
    [3]: locale.ru.support_request_type3,
  };

  @observable
  nextPage = 1;

  @observable
  supportRequestsLoadingActivity = false;

  @observable
  supportRequestsList = [];

  @action
  getSupportRequests = async refresh => {
    if (!this.supportRequestsLoadingActivity) {
      this.supportRequestsLoadingActivity = true;
      try {
        if (refresh) {
          this.nextPage = 1;
        } else if (!this.nextPage) {
          this.supportRequestsLoadingActivity = false;
          return;
        }
        const response = await requests.supportRequests(
          this.nextPage,
          this.props.requestType,
        );
        console.log(response);
        if (response.data.result) {
          this.supportRequestsList = refresh
            ? response.data.data
            : [...this.supportRequestsList, ...response.data.data];
          if (!!response.data.links && !!response.data.links.next) {
            this.nextPage = this.nextPage + 1;
          } else {
            this.nextPage = null;
          }
        }
        this.supportRequestsLoadingActivity = false;
      } catch (e) {
        showMessage(locale.ru.error, locale.ru.error_network);
        console.log('support requests list error');
        console.log(e.response || e);
        this.supportRequestsLoadingActivity = false;
      }
    }
  };

  handleRequestPress = requestData => {
    this.props.navigationStore.pushScreen(
      screensId.REQUESTS_SUPPORT_INFO,
      {
        requestData,
      },
      {
        topBar: {
          title: {
            text:
              RequestsSupportScreen.supportRequestTypes[this.props.requestType],
          },
        },
      },
    );
  };

  handleCreatePress = () => {
    this.props.navigationStore.pushScreen(
      screensId.REQUESTS_SUPPORT_CREATE,
      {
        requestType: this.props.requestType,
        successCallback: () => {
          this.getSupportRequests(true);
          this.props.navigationStore.popScreen();
        },
      },
      {
        topBar: {
          title: {
            text:
              RequestsSupportScreen.supportRequestTypes[this.props.requestType],
          },
        },
      },
    );
  };

  componentDidMount() {
    this.getSupportRequests(true);
  }

  render() {
    return (
      <ScreenWrapper>
        <SupportRequestsList
          onEndReached={() => this.getSupportRequests(false)}
          onRefresh={() => this.getSupportRequests(true)}
          onItemPress={this.handleRequestPress}
          data={toJS(this.supportRequestsList)}
          refreshing={toJS(this.supportRequestsLoadingActivity)}
          onCreatePress={this.handleCreatePress}
        />
      </ScreenWrapper>
    );
  }
}

export default RequestsSupportScreen;
