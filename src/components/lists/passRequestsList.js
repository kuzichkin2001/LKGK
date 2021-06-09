import React, {PureComponent} from 'react';
import {FlatList} from 'react-native';

import locale from 'locale';

import PassRequestListItem from '../listsItems/passRequest';
import ListEmptyView from '../listEmptyView';
import LargeSubmitButton from '../buttons/largeSubmitButton';

class PassRequestsList extends PureComponent {
  renderItem = ({item}) => {
    if (!!item && !!this.props.onPress) {
      return (
        <PassRequestListItem
          data={item}
          onPress={() => this.props.onPress(item)}
        />
      );
    } else {
      return null;
    }
  };

  keyExtractor = item => item.id;

  renderHeader = () => {
    const {refreshing} = this.props;
    if (!refreshing) {
      return <ListEmptyView title={locale.ru.empty_list_pass_requests} />;
    }
    return null;
  };

  render() {
    const {
      data,
      refreshing,
      onRefresh,
      isLoadMoreAvailable,
      onEndReached,
      onCreatePress,
    } = this.props;

    return (
      <>
        <FlatList
          ListEmptyComponent={this.renderHeader}
          keyExtractor={this.keyExtractor}
          data={data}
          onRefresh={onRefresh}
          refreshing={refreshing}
          renderItem={this.renderItem}
          onEndReached={() => isLoadMoreAvailable && onEndReached()}
        />
        <LargeSubmitButton
          onPress={onCreatePress}
          title={locale.ru.create_request}
        />
      </>
    );
  }
}

export default PassRequestsList;
