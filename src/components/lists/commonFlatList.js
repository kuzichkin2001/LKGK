import React, {PureComponent} from 'react';
import {FlatList} from 'react-native';

import ListEmptyView from '../listEmptyView';

class CommonFlatList extends PureComponent {
  renderItem = ({item}) => {
    const {onItemPress, ItemComponent, itemProps} = this.props;
    const handleItemPress = onItemPress ? () => onItemPress(item) : null;
    return (
      <ItemComponent {...itemProps} data={item} onPress={handleItemPress} />
    );
  };

  keyExtractor = item => (item && item.id) || undefined;

  renderEmptyListComponent = () => {
    const {emptyListTitle} = this.props;
    if (emptyListTitle) {
      return <ListEmptyView title={emptyListTitle} />;
    }
    return null;
  };

  render() {
    return (
      <FlatList
        ListEmptyComponent={this.renderEmptyListComponent}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        {...this.props}
      />
    );
  }
}

export default CommonFlatList;
