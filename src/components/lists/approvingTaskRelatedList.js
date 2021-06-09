import React, {PureComponent} from 'react';
import {FlatList} from 'react-native';

import commonStyles from 'styles';

import ApprovingTaskRelatedListItem from '../listsItems/approvingTaskRelated';

class ApprovingTaskRelatedList extends PureComponent {
  renderItem = ({item}) => (
    <ApprovingTaskRelatedListItem
      onPress={() => this.props.onPress(item.user)}
      data={item}
    />
  );

  render() {
    const {data, ...otherProps} = this.props;
    if (!data || !data.length) {
      return null;
    }
    return (
      <FlatList
        contentContainerStyle={commonStyles.common.whiteBackground}
        scrollEnabled={false}
        data={data}
        keyExtractor={(item, index) => index}
        renderItem={this.renderItem}
        {...otherProps}
      />
    );
  }
}

export default ApprovingTaskRelatedList;
