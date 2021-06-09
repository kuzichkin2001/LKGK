import React, {PureComponent} from 'react';
import {FlatList} from 'react-native';

import locale from 'locale';

import ApprovalTaskListItem from '../listsItems/approvalTask';
import ListEmptyView from '../listEmptyView';

class ApprovalTasksList extends PureComponent {
  renderApprovalTasksListItem = ({item}) => {
    const {onTaskPress} = this.props;
    return <ApprovalTaskListItem onPress={() => onTaskPress(item)} {...item} />;
  };

  keyExtractor = item => item.id;

  render() {
    const {
      data,
      isLoadMoreAvailable,
      onLoadMore,
      refreshing,
      ...otherProps
    } = this.props;
    return (
      <FlatList
        ListEmptyComponent={
          !refreshing && (
            <ListEmptyView title={locale.ru.empty_list_approval_tasks} />
          )
        }
        onEndReached={() => !!isLoadMoreAvailable && onLoadMore()}
        data={data}
        refreshing={!!refreshing}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderApprovalTasksListItem}
        {...otherProps}
      />
    );
  }
}

export default ApprovalTasksList;
