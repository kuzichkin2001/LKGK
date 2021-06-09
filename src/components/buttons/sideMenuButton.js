import React from 'react';
import {Text, StyleSheet, ActivityIndicator} from 'react-native';

import commonStyles from 'styles';

import BadgeIcon from '../badgeIcon';
import CommonTouchable from './commonTouchable';

const SideMenuButton = ({onPress, title, icon, activity, badge, iconStyle}) => (
  <CommonTouchable style={styles.wrapper} onPress={onPress}>
    {activity ? (
      <ActivityIndicator
        style={commonStyles.common.iconSize}
        size={'small'}
        color={commonStyles.colors.label}
      />
    ) : (
      <BadgeIcon iconStyle={iconStyle} source={icon} badge={badge} />
    )}
    <Text style={styles.title}>{title}</Text>
  </CommonTouchable>
);

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 0.5,
    borderTopColor: commonStyles.colors.lightGray,
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: commonStyles.colors.white,
  },
  title: {
    ...commonStyles.texts.common,
    textAlign: 'center',
    paddingLeft: commonStyles.spaces.xl,
  },
});

export default SideMenuButton;
