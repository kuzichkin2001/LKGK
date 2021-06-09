import React, {PureComponent} from 'react';
import {FlatList, Text, View} from 'react-native';
import LargeSubmitButton from '../buttons/largeSubmitButton';

import locale from '../../locale';
import DocumentRequestListItem from '../listsItems/documenRequest';
import ListEmptyView from '../listEmptyView';

class DocumentsRequestsList extends PureComponent {
  renderItem = ({item}) => {
    const {onPress, onEmployeePress, requestType} = this.props;
    if (!!item && !!this.props.onPress) {
      return (
        <DocumentRequestListItem
          data={item}
          onPress={() => onPress(item)}
          onEmployeePress={onEmployeePress}
          requestType={requestType}
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
      return <ListEmptyView title={locale.ru.empty_list_documents_requests} />;
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
      requestType,
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
          title={
            locale.ru[`documents_request_type${requestType}_create`] ||
            locale.ru.create
          }
        />
      </>
    );
  }
}

export default DocumentsRequestsList;
