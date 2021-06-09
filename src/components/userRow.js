import React, {PureComponent} from 'react';
import {Text, StyleSheet} from 'react-native';

import commonStyles from 'styles';

import Avatar from './avatar';
import CommonTouchable from './buttons/commonTouchable';
import NavigateArrow from './navigateArrow';

class UserRow extends PureComponent {
  render() {
    const {userData, wrapperStyle, onPress} = this.props;
    if (!userData) {
      return null;
    }
    const {avatar, full_name} = userData;
    return (
      <CommonTouchable
        disabled={!onPress}
        onPress={onPress}
        style={[commonStyles.common.rowCenter, wrapperStyle]}>
        <Avatar {...avatar} isSmall={true} />
        <Text style={styles.title}>{full_name}</Text>
        {!!onPress && <NavigateArrow />}
      </CommonTouchable>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    flex: 1,
    paddingLeft: 10,
    ...commonStyles.texts.infoRowTitle,
  },
});

export default UserRow;
