import React, {PureComponent} from 'react';
import {FlatList, View} from 'react-native';

import ProfileButton from '../buttons/profileButton';

class ProfileButtonsList extends PureComponent {
  renderButton = ({item}) => {
    const {userData, onPress} = this.props;
    const title = item.title || (userData && userData[item.field]);
    if (!title) {
      return null;
    }
    const pressHandler = item.disabled
      ? null
      : item.onPress
      ? () => item.onPress(item)
      : onPress
      ? () => onPress(item)
      : null;
    return <ProfileButton {...item} title={title} onPress={pressHandler} />;
  };

  keyExtractor = item => item.title;

  render() {
    const {data, ...otherProps} = this.props;
    return (
      <View>
        <FlatList
          data={data}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderButton}
          {...otherProps}
        />
      </View>
    );
  }
}

export default ProfileButtonsList;
