import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {action, computed, observable, reaction, toJS} from 'mobx';

import screensId from '../navigation/screensId';
import requests from '../network/requests';
import topBarButtons from '../navigation/topBarButtons';
import locale from '../locale';

import TasksList from '../components/lists/tasksList';
import ScreenWrapper from '../components/ScreenWrapper';

@inject('navigationStore', 'profileStore')
@observer
class TasksListScreen extends Component {
  static options() {
    return {
      id: screensId.TASKS_LIST,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.tasks,
        },
        rightButtons: [topBarButtons.filter],
      },
    };
  }

  static taskTypes = {
    initiator: 'initiator',
    executor: 'executor',
  };

  @observable
  filter = null;

  @observable
  tasksLists = {
    [TasksListScreen.taskTypes.initiator]: [],
    [TasksListScreen.taskTypes.executor]: [],
  };

  @observable
  activityStatuses = {
    [TasksListScreen.taskTypes.initiator]: false,
    [TasksListScreen.taskTypes.executor]: false,
  };

  @observable
  taskType = TasksListScreen.taskTypes.initiator;

  @computed
  get selectedTasksList() {
    if (!this.filter) {
      return this.tasksLists[this.taskType];
    }
    const currentUserId = this.props.profileStore.userData.id_phperson;
    const currentFilter = this.filter[this.taskType];
    let result = [];
    try {
      result = this.tasksLists[this.taskType].filter(taskData => {
        if (!taskData) {
          return false;
        }
        const {
          executor_user,
          assistants,
          observers,
          current_status_id,
          initiator_user,
        } = taskData;
        if (
          !currentFilter.executor &&
          executor_user &&
          executor_user.id_phperson === currentUserId
        ) {
          return false;
        } else if (
          !currentFilter.initiator &&
          initiator_user &&
          initiator_user.id_phperson === currentUserId
        ) {
          return false;
        } else if (
          !currentFilter.assistants &&
          assistants.length &&
          assistants.find(assistant => assistant.id_phperson === currentUserId)
        ) {
          return false;
        } else if (
          !currentFilter.observers &&
          observers.length &&
          observers.find(
            taskObserver => taskObserver.id_phperson === currentUserId,
          )
        ) {
          return false;
        } else if (
          currentFilter.statuses.find(status => current_status_id == status) ===
          undefined
        ) {
          return false;
        }
        return true;
      });
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  @action
  getTasksList = async () => {
    const requestTaskType = this.taskType;
    if (!this.activityStatuses[requestTaskType]) {
      try {
        this.activityStatuses[requestTaskType] = true;
        const response = await requests.tasks(requestTaskType);
        if (this.taskType === requestTaskType) {
          this.tasksLists[this.taskType] = response.data.data || [];
        }
        console.log(response);
        this.activityStatuses[this.taskType] = false;
      } catch (e) {
        this.activityStatuses[this.taskType] = false;
        console.log(e.response || e);
      }
    }
  };

  @action
  handleTaskTypeChange = taskType => {
    if (taskType !== this.taskType) {
      this.activityStatuses[this.taskType] = false;
      this.taskType = taskType;
    }
  };

  handleTaskPress = taskData => {
    this.props.navigationStore.pushScreen(
      screensId.TASKS_INFO,
      {
        taskData,
      },
      {
        topBar: {
          title: {
            text: taskData.theme,
          },
        },
      },
    );
  };

  @action
  handleTopBarButtonPress = event => {
    if (event.buttonId === topBarButtons.filter.id) {
      this.props.navigationStore.pushScreen(screensId.TASKS_FILTER, {
        filterType: this.taskType,
        filter: toJS(this.filter),
        successCallback: updatedFilter => {
          this.filter = updatedFilter;
          this.getTasksList();
        },
      });
    }
  };

  handleCreatePress = () => {
    this.props.navigationStore.pushScreen(screensId.TASK_CREATE, {
      successCallback: this.getTasksList,
    });
  };

  componentDidMount() {
    this.getTasksList();
    this.removeTopBarButtonsListener = this.props.navigationStore.addTopBarButtonListener(
      TasksListScreen.options().id,
      this.handleTopBarButtonPress,
    );
    this.reactionDisposer = reaction(() => this.taskType, this.getTasksList);
  }

  componentWillUnmount() {
    if (this.removeTopBarButtonsListener) {
      this.removeTopBarButtonsListener();
    }
    if (this.reactionDisposer) {
      this.reactionDisposer();
    }
  }

  render() {
    return (
      <ScreenWrapper>
        <TasksList
          onCreatePress={this.handleCreatePress}
          onTaskTypeChange={this.handleTaskTypeChange}
          selectedTaskType={this.taskType}
          onTaskPress={this.handleTaskPress}
          type={this.taskType}
          data={this.selectedTasksList}
          onRefresh={this.getTasksList}
          refreshing={this.activityStatuses[this.taskType]}
        />
      </ScreenWrapper>
    );
  }
}

export default TasksListScreen;
