import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {observable, action, computed} from 'mobx';

import screensId from '../navigation/screensId';
import locale from '../locale';
import requests from '../network/requests';
import {showMessage} from '../utils/showMessage';

import ApprovalTasksList from '../components/lists/approvalTasksList';
import ScreenWrapper from '../components/ScreenWrapper';
import ProfileStore from '../stores/profileStore';

@inject('navigationStore')
@observer
class ApprovalsCabinetScreen extends Component {
  static options() {
    return {
      id: screensId.APPROVALS_CABINET,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.approvals_cabinet,
        },
      },
    };
  }

  componentDidMount(): void {
    this.getApprovalsList(true);
  }

  tasksNextPage = 1;

  @observable
  approvalsList = [];

  @observable
  taskLoadingStatus = false;

  @computed
  get isLoadMoreAvailable() {
    return (
      !!this.approvalsList.length &&
      !this.taskLoadingStatus &&
      !!this.tasksNextPage
    );
  }

  @action
  setTaskLoadingStatus = status => {
    this.taskLoadingStatus = !!status;
  };

  @action
  getApprovalsList = async refresh => {
    if (!this.taskLoadingStatus) {
      this.setTaskLoadingStatus(true);
      try {
        if (refresh) {
          this.tasksNextPage = 1;
        } else if (!this.tasksNextPage) {
          this.setTaskLoadingStatus(false);
          return;
        }
        const response = await requests.approvalsList(this.tasksNextPage);
        console.log(response);
        if (response.data.result) {
          this.approvalsList = refresh
            ? response.data.data
            : [...this.approvalsList, ...response.data.data];
          if (!!response.data.links && !!response.data.links.next) {
            this.tasksNextPage = this.tasksNextPage + 1;
          } else {
            this.tasksNextPage = null;
          }
        }
        console.log(this.tasksNextPage);
        this.setTaskLoadingStatus(false);
      } catch (e) {
        showMessage(locale.ru.error, locale.ru.error_network);
        console.log('approvals list request error');
        console.log(e);
        console.log(e.response);
        this.setTaskLoadingStatus(false);
      }
    }
  };

  handleTaskPress = taskData => {
    this.props.navigationStore.pushScreen(
      screensId.APPROVING_TASK_INFO,
      {
        taskData: taskData,
        taskDecisionCallback: async () => {
          this.getApprovalsList(true);
          await ProfileStore.updateBadges();
        },
      },
      {
        topBar: {
          title: {
            text: taskData.name,
          },
        },
      },
    );
  };

  render() {
    return (
      <ScreenWrapper>
        <ApprovalTasksList
          onLoadMore={() => this.getApprovalsList(false)}
          isLoadMoreAvailable={this.isLoadMoreAvailable}
          onRefresh={() => this.getApprovalsList(true)}
          refreshing={this.taskLoadingStatus}
          onTaskPress={this.handleTaskPress}
          data={this.approvalsList}
        />
      </ScreenWrapper>
    );
  }
}

export default ApprovalsCabinetScreen;
