import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import commonStyles from 'styles';
import Avatar from './avatar';
import CommonTouchable from './buttons/commonTouchable';

const UserLogoInfo = ({
  title,
  subtitle,
  subtitleStyle,
  onPress,
  avatarSettings,
  isOnline,
  isAchieve,
}) => {
  return (
    <CommonTouchable
      disabled={!onPress}
      onPress={onPress}
      style={styles.wrapper}>
      <Avatar {...avatarSettings} isOnline={isOnline} isAchieve={isAchieve} />
      <View style={styles.infoWrapper}>
        <Text style={commonStyles.texts.commonLarge}>{title}</Text>
        <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
      </View>
    </CommonTouchable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...commonStyles.common.bottomBorder,
    paddingHorizontal: commonStyles.spaces.xl,
    paddingVertical: commonStyles.spaces.l,
    flexDirection: 'row',
    backgroundColor: commonStyles.colors.white,
  },
  infoWrapper: {
    paddingLeft: 20,
    flex: 1,
    justifyContent: 'center',
  },
  subtitle: {
    ...commonStyles.texts.common,
    paddingTop: 2,
    color: commonStyles.colors.gray,
  },
});

export default UserLogoInfo;
