import React, {Component} from 'react';
import {action, computed, observable, toJS} from 'mobx';
import {observer, inject} from 'mobx-react';

import screensId from '../navigation/screensId';
import locale from '../locale';
import requests from '../network/requests';

import PassRequestsList from '../components/lists/passRequestsList';
import ScreenWrapper from '../components/ScreenWrapper';

@inject('navigationStore')
@observer
class RequestsPassScreen extends Component {
  static options() {
    return {
      id: screensId.REQUESTS_PASS,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.title_pass_requests_list,
        },
      },
    };
  }

  @observable
  passRequestsList = [];

  @observable
  nextPage = 1;

  @observable
  passRequestsActivity = false;

  @computed
  get isLoadMoreAvailable() {
    return (
      !!this.nextPage &&
      !this.passRequestsActivity &&
      this.passRequestsList.length
    );
  }

  @action
  getPassRequests = async refresh => {
    if (!this.passRequestsActivity) {
      try {
        if (refresh) {
          this.nextPage = 1;
        } else if (!this.nextPage) {
          return;
        }
        this.passRequestsActivity = true;
        const response = await requests.passRequestsList(this.nextPage);
        if (response.data.result) {
          if (refresh) {
            this.passRequestsList = response.data.data;
          } else {
            this.passRequestsList = [
              ...this.passRequestsList,
              ...response.data.data,
            ];
          }
          this.nextPage = response.data.links.next ? this.nextPage + 1 : null;
        }
        this.passRequestsActivity = false;
      } catch (e) {
        this.nextPage = null;
        this.passRequestsActivity = false;
        console.log(e);
      }
    }
  };

  handleRequestPress = passRequestData => {
    if (passRequestData) {
      this.props.navigationStore.pushScreen(
        screensId.REQUESTS_PASS_INFO,
        {
          passRequestData,
        },
        {
          topBar: {
            title: {
              text: locale.ru.title_request_pass_create, // passRequestData.name,
            },
          },
        },
      );
    }
  };

  handleCreatePress = () => {
    this.props.navigationStore.pushScreen(
      screensId.REQUESTS_PASS_CREATE,
      {
        successCreateCallback: () => this.getPassRequests(true),
      },
      {
        topBar: {
          title: {
            text: locale.ru.title_request_pass_create,
          },
        },
      });
  };

  componentDidMount(): void {
    this.getPassRequests();
  }

  render() {
    return (
      <ScreenWrapper>
        <PassRequestsList
          onCreatePress={this.handleCreatePress}
          isLoadMoreAvailable={this.isLoadMoreAvailable}
          onEndReached={() => this.getPassRequests(false)}
          onPress={this.handleRequestPress}
          data={this.passRequestsList}
          refreshing={toJS(this.passRequestsActivity)}
          onRefresh={() => this.getPassRequests(true)}
        />
      </ScreenWrapper>
    );
  }
}

export default RequestsPassScreen;
