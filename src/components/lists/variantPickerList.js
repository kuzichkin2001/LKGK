import React, {PureComponent} from 'react';
import {FlatList} from 'react-native';

import VariantPickerListItem from '../listsItems/variantPickerListItem';

class VariantPickerList extends PureComponent {
  renderItem = ({item}) => (
    <VariantPickerListItem
      data={item}
      onPress={() => this.props.onVariantPress(item)}
    />
  );

  render() {
    const {data} = this.props;
    return <FlatList renderItem={this.renderItem} data={data} />;
  }
}

export default VariantPickerList;
