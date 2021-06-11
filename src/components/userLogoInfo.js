import React, {useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

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
  const [isTick, setIsTick] = useState(false);
  return (
    <CommonTouchable
      disabled={!onPress}
      onPress={() => setIsTick(prev => !prev)}
      style={styles.wrapper}>
      <Avatar {...avatarSettings} isOnline={isOnline} isAchieve={isAchieve} />
      <View style={styles.infoWrapper}>
        <Text style={commonStyles.texts.commonLarge}>{title}</Text>
        <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
      </View>
      {!!isTick && (
        <Image
          style={[styles.isTick]}
          source={require('../assets/images/Tick.png')}
        />
      )}
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
