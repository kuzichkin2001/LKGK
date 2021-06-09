import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {computed, observable, action} from 'mobx';

import screensId from '../navigation/screensId';
import requests from '../network/requests';
import {showNetworkError} from '../utils/showNetworkError';
import {showMessage} from '../utils/showMessage';
import locale from 'locale';

import TaskInfo from '../components/taskInfo';
import CommonActivityIndicator from '../components/commonActivityIndicator';
import ScreenWrapper from '../components/ScreenWrapper';
import axios from 'axios';
import routes from '../network/routes';

@inject('navigationStore', 'profileStore')
@observer
class TaskInfoScreen extends Component {
  static options() {
    return {
      id: screensId.TASKS_INFO,
      topBar: {
        visible: true,
      },
    };
  }

  @observable
  taskData = null;

  @observable
  taskActivity = false;

  @observable
  actionSubmittingStatus = false;

  @computed
  get isTaskActivityVisible() {
    return !this.taskData && !!this.taskActivity;
  }

  @computed
  get statusActionButtons() {
    let result = [];
    if (!this.taskData || !this.taskData.actions) {
      return result;
    }
    try {
      result = this.taskData.actions.map(button => {
        button.isSubmitting = this.actionSubmittingStatus;
        return button;
      });
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  @action
  getTaskData = async () => {
    try {
      this.taskActivity = true;
      const taskId =
        (this.props.taskData && this.props.taskData.id) ||
        this.props.notificationApiId;
      const response = await requests.taskInfo(taskId);
      console.log(response);
      if (response.data.data) {
        this.taskData = response.data.data;
      }
    } catch (e) {
      const {response} = e;
      console.log(response || e);
    } finally {
      this.taskActivity = false;
    }
  };

  @action
  handleActionButtonPress = async actionButton => {
    if (!this.actionSubmittingStatus && !this.taskActivity && actionButton) {
      try {
        if (actionButton.action == 9 || actionButton.action == 7) {
          const isCommented = this.taskData.comments.find(
            comment =>
              !!comment.user &&
              comment.user.id_phperson ===
                this.props.profileStore.userData.id_phperson,
          );
          if (!isCommented) {
            showMessage(
              locale.ru.task_complete_error,
              locale.ru.task_complete_comment_required,
            );
            return;
          }
        }
        this.actionSubmittingStatus = true;
        const response = await requests.taskChangeStatus(
          this.taskData.id,
          actionButton.action,
        );
        console.log(response);
        if (response.data.result) {
          await this.getTaskData();
          this.actionSubmittingStatus = false;
        } else {
          this.actionSubmittingStatus = false;
        }
      } catch (e) {
        this.actionSubmittingStatus = false;
        console.log(e.response || e);
        showNetworkError(e.response);
      }
    }
  };

  @action
  handleFileUpload = async (file, commentId) => {
    if (file && file.name) {
      this.taskActivity = true;
      try {
        const form = new FormData();
        form.append('kip_id', this.taskData.id);
        if (commentId) {
          form.append('comment_id', commentId);
        }
        const fileForm = {...file};
        if (file && file.name) {
          form.append('file', fileForm);
        }
        const response = await axios.post(routes.taskAddAttachment, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response && response.status && response.status == 200) {
          if (response.data && response.data.result) {
            const {taskData} = this;
            if (commentId) {
              const comments = this.taskData.comments.map(c =>
                c.id == commentId
                  ? {
                      ...c,
                      files: c.files
                        ? [...c.files, response.data.result]
                        : [response.data.result],
                    }
                  : c,
              );
              this.taskData = {
                ...taskData,
                comments,
              };
            } else {
              // append file to task
              const files = taskData.files ? taskData.files : [];
              this.taskData = {
                ...taskData,
                files: [...files, response.data.result],
              };
            }
          }
        }
      } catch (e) {
        console.log('error');
        console.log(e);
        if (e && e.response) {
          showNetworkError(e.response);
        } else {
          showMessage(locale.ru.error, locale.ru.unknown_error_occurred);
        }
      }
      this.taskActivity = false;
    } else {
      showMessage(locale.ru.upload_file_not_selected);
    }
  };

  handleEmployeePress = employeeData => {
    if (employeeData) {
      this.props.navigationStore.pushScreen(screensId.CATALOG_EMPLOYEE_INFO, {
        employeeData,
      });
    }
  };

  handleAddCommentPress = () => {
    this.props.navigationStore.pushScreen(screensId.TASK_ADD_COMMENT, {
      taskData: this.taskData,
      successCallback: () => {
        this.getTaskData();
      },
    });
  };

  componentDidMount() {
    const {taskData} = this.props;
    if (taskData) {
      this.taskData = taskData;
    }
    this.getTaskData();
  }

  render() {
    return (
      <ScreenWrapper>
        {this.taskActivity ? (
          <CommonActivityIndicator />
        ) : (
          <TaskInfo
            onActionButtonPress={this.handleActionButtonPress}
            actionButtons={this.statusActionButtons}
            onAddCommentPress={this.handleAddCommentPress}
            onEmployeePress={this.handleEmployeePress}
            data={this.taskData}
            handleFileUpload={this.handleFileUpload}
          />
        )}
      </ScreenWrapper>
    );
  }
}

export default TaskInfoScreen;
