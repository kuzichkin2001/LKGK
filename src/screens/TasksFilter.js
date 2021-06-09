import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {observable, action, computed} from 'mobx';
import {View, ScrollView} from 'react-native';

import commonStyles from 'styles';
import screensId from '../navigation/screensId';
import locale from 'locale';

import Divider from '../components/divider';
import TitledRowSwitch from '../components/titledRowSwitch';
import TaskInfo from '../components/taskInfo';
import LargeSubmitButton from '../components/buttons/largeSubmitButton';

@inject('navigationStore')
@observer
class TasksFilter extends Component {
  static options() {
    return {
      id: screensId.TASKS_FILTER,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.filter,
        },
      },
    };
  }

  static defaultFilter = {
    initiator: {
      initiator: true,
      observer: true,
      executor: true,
      assistant: true,
      statuses: ['2', '6', '7', '8', '9', '10'],
    },
    executor: {
      executor: true,
      observer: true,
      initiator: true,
      assistant: true,
      statuses: ['2', '6', '7', '8', '9', '10'],
    },
  };

  @observable
  filter = TasksFilter.defaultFilter;

  @action
  setFilter = filter => {
    this.filter = filter;
  };

  @computed
  get statusRows() {
    const {filterType} = this.props;
    let result = [];
    try {
      const statuses = Object.keys(TaskInfo.taskStatus);
      result = statuses.map(status => (
        <TitledRowSwitch
          onValueChange={this.handleStatusChange(status)}
          value={
            !!this.filter[filterType].statuses.find(item => item == status)
          }
          titleColor={TaskInfo.taskStatusColors[status]}
          key={`status-switch-${status}`}
          title={TaskInfo.taskStatus[status]}
        />
      ));
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  @action
  handleRoleChange = role => value => {
    const {filterType} = this.props;
    this.filter[filterType][role] = value;
  };

  @action
  handleStatusChange = status => value => {
    const {filterType} = this.props;
    if (value) {
      this.filter[filterType].statuses.push(status);
    } else {
      this.filter[filterType].statuses = this.filter[
        filterType
      ].statuses.filter(item => item != status);
    }
  };

  handleFilterSubmit = () => {
    const {successCallback, navigationStore} = this.props;
    if (successCallback) {
      successCallback(this.filter);
    }
    navigationStore.popScreen();
  };

  componentDidMount() {
    const {filter} = this.props;
    if (filter) {
      this.setFilter(filter);
    }
  }

  render() {
    const {filterType} = this.props;
    const currentFilter = this.filter[filterType];
    return (
      <View style={commonStyles.common.screenWrapper}>
        <ScrollView>
          {filterType === 'executor' && (
            <>
              <Divider title={locale.ru.filter_by_task_role} />
              <TitledRowSwitch
                onValueChange={this.handleRoleChange('executor')}
                value={currentFilter.executor}
                title={locale.ru.task_executor}
              />
              <TitledRowSwitch
                onValueChange={this.handleRoleChange('assistant')}
                value={currentFilter.assistant}
                title={locale.ru.task_assistants}
              />
              <TitledRowSwitch
                onValueChange={this.handleRoleChange('observer')}
                value={currentFilter.observer}
                title={locale.ru.task_observer}
              />
            </>
          )}
          <Divider title={locale.ru.filter_by_task_status} />
          {this.statusRows}
        </ScrollView>
        <LargeSubmitButton
          onPress={this.handleFilterSubmit}
          title={locale.ru.apply}
        />
      </View>
    );
  }
}

export default TasksFilter;
