import React, {PureComponent} from 'react';
import {FlatList, StyleSheet} from 'react-native';

import commonStyles from 'styles';
import locale from 'locale';

import NewsListItem from '../listsItems/news';
import ListEmptyView from '../listEmptyView';

class NewsList extends PureComponent {
  renderItem = ({item}) => (
    <NewsListItem data={item} onPress={() => this.props.onPress(item)} />
  );

  renderHeader = () => {
    const {refreshing} = this.props;
    if (!refreshing) {
      return <ListEmptyView title={locale.ru.empty_list_news} />;
    }
    return null;
  };

  render() {
    const {
      data,
      isLoadMoreAvailable,
      onLoadMore,
      onRefresh,
      refreshing,
      ...otherProps
    } = this.props;

    return (
      <FlatList
        ListEmptyComponent={this.renderHeader}
        contentContainerStyle={styles.container}
        onRefresh={onRefresh}
        renderItem={this.renderItem}
        keyExtractor={item => item.id.toString()}
        refreshing={refreshing}
        data={data}
        onEndReached={() => !!isLoadMoreAvailable && onLoadMore()}
        {...otherProps}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: commonStyles.spaces.m,
  },
});

export default NewsList;
