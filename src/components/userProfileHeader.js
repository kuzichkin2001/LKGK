import React, {PureComponent} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import commonStyles from 'styles';

import Avatar from './avatar';

class UserProfileHeader extends PureComponent {
  render() {
    const {userData} = this.props;
    if (!userData) {
      return null;
    }
    const {avatar, unit, position, name, in_office, achive_show} = userData;
    const userName = (name && name.full_name) || '';
    return (
      <View style={styles.wrapper}>
        <Avatar
          isAchieve={achive_show}
          isOnline={in_office}
          isBig={true}
          {...avatar}
        />
        <Text style={styles.title}>{userName}</Text>
        <Text style={styles.subtitle}>{position || unit}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: commonStyles.colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 25,
    paddingHorizontal: 16,
  },
  title: {
    ...commonStyles.texts.userProfileHeaderTitle,
    paddingTop: 10,
  },
  subtitle: {
    ...commonStyles.texts.userProfileHeaderSubtitle,
    paddingTop: 10,
  },
});

export default UserProfileHeader;
