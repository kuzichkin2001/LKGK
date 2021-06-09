import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';

import commonStyles from 'styles';

import Avatar from './avatar';

class MultipleAvatars extends PureComponent {
  renderAvatars = avatars =>
    avatars.map(avatar => {
      const avatarData = avatar
        ? avatar.avatar
          ? avatar.avatar
          : avatar
        : null;
      if (!avatarData) {
        return null;
      }
      return (
        <Avatar
          wrapperStyle={styles.avatarWrapper}
          isSmall={true}
          {...avatarData}
        />
      );
    });

  render() {
    const {avatars} = this.props;
    if (!avatars || !avatars.length) {
      return null;
    }
    let formattedAvatars = [];
    if (avatars.length <= 3) {
      formattedAvatars = avatars;
    } else {
      formattedAvatars = [
        ...avatars.slice(0, 2),
        {
          name: `+${+avatars.length - 2}`,
        },
      ].reverse();
    }
    return (
      <View style={commonStyles.common.rowCenter}>
        {this.renderAvatars(formattedAvatars)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  avatarWrapper: {
    marginLeft: commonStyles.spaces.s,
  },
});

export default MultipleAvatars;
