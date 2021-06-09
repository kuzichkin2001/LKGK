import React, {PureComponent} from 'react';
import {FlatList} from 'react-native';

import locale from 'locale';

import TaskListItem from '../listsItems/taskListItem';
import ListEmptyView from '../listEmptyView';
import SwitchButtonsHeader from '../switchButtonsHeader';
import LargeSubmitButton from '../buttons/largeSubmitButton';

class TasksList extends PureComponent {
  renderItem = ({item}) => {
    if (!item) {
      return null;
    }
    const {type} = this.props;
    const visibleUser = type === 'executor' ? 'initiator' : 'executor';
    const avatarSettings =
      (item[`${visibleUser}_user`] && item[`${visibleUser}_user`].avatar) ||
      null;
    return (
      <TaskListItem
        avatarSettings={avatarSettings}
        data={item}
        onPress={() => this.props.onTaskPress(item)}
      />
    );
  };

  renderHeader = () => {
    const {refreshing} = this.props;
    if (!refreshing) {
      return <ListEmptyView title={locale.ru.empty_list_tasks} />;
    }
    return null;
  };

  keyExtractor = task => task && task.id + '';

  render() {
    const {
      data,
      refreshing,
      onRefresh,
      onTaskTypeChange,
      selectedTaskType,
      onCreatePress,
    } = this.props;
    return (
      <>
        <SwitchButtonsHeader
          buttons={[
            {
              title: locale.ru.tasks_as_initiator,
              isSelected: selectedTaskType === 'initiator',
              onPress: () => onTaskTypeChange('initiator'),
            },
            {
              title: locale.ru.tasks_as_executor,
              isSelected: selectedTaskType === 'executor',
              onPress: () => onTaskTypeChange('executor'),
            },
          ]}
        />
        <FlatList
          ListEmptyComponent={this.renderHeader}
          data={data}
          renderItem={this.renderItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyExtractor={this.keyExtractor}
        />
        <LargeSubmitButton
          title={locale.ru.create_task}
          onPress={onCreatePress}
        />
      </>
    );
  }
}

export default TasksList;
