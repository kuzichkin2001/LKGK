import React, {PureComponent} from 'react';
import {View, FlatList} from 'react-native';

import TitledInfoRow from '../titledInfoRow';

class InfoRowsList extends PureComponent {
  renderItem = ({item}) => {
    const {onPress, userData} = this.props;
    const pressHandler = item.onPress
      ? () => item.onPress(item)
      : onPress
      ? () => onPress(item)
      : null;
    return (
      <TitledInfoRow
        onPress={pressHandler}
        title={item.title}
        value={item.value || (userData && userData[item.field])}
        icon={item.icon}
      />
    );
  };

  keyExtractor = item => `inforowitem-${Date.now()}-${item.title}`;

  render() {
    const {data, ...otherProps} = this.props;
    return (
      <View>
        <FlatList
          data={data}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          {...otherProps}
        />
      </View>
    );
  }
}

export default InfoRowsList;
