import React from 'react';
import {Text, View, StyleSheet, Platform, Image} from 'react-native';
import FastImage from 'react-native-fast-image';

import commonStyles from 'styles';

const AvatarImageComponent = ({style, ...props}) =>
  Platform.select({
    ios: <Image {...props} style={style} />,
    android: (
      <FastImage {...props} style={[style, styles.avatarImageAndroid7Fix]} />
    ),
  });

const Avatar = ({
  name,
  background,
  color,
  image,
  isSmall,
  isOnline,
  isAchieve,
  wrapperStyle,
  isBig,
  isMedium,
}) => {
  const avatarBackgroundStyle = {
    backgroundColor: background || commonStyles.colors.avatarBlue,
  };

  const avatarNameStyle = {
    color: color || commonStyles.colors.white,
  };

  return (
    <View
      style={[
        styles.logo,
        avatarBackgroundStyle,
        !!isSmall && styles.smallLogo,
        !!isBig && styles.bigLogo,
        !!isMedium && styles.mediumLogo,
        wrapperStyle,
      ]}>
      <Text
        style={[
          styles.avatarStr,
          avatarNameStyle,
          !!isSmall && styles.smallAvatarStr,
          !!isBig && styles.bigAvatarStr,
        ]}>
        {name || ''}
      </Text>
      {!!image && (
        <AvatarImageComponent
          source={{uri: image}}
          resizeMode={'cover'}
          style={[
            styles.avatarImage,
            !!isSmall && styles.smallLogo,
            !!isBig && styles.bigLogo,
            !!isMedium && styles.mediumLogo,
          ]}
        />
      )}
      {!isSmall && !!isAchieve && !isMedium && (
        <Image
          style={[styles.bestEmployee, !!isBig && styles.bigAvatar]}
          resizeMode={'contain'}
          source={require('../assets/images/best-employee.png')}
        />
      )}
      {!isSmall && !!isOnline && (
        <View
          style={[styles.onlineIndicator, !!isBig && styles.onlineIndicatorBig]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 52,
    width: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: commonStyles.colors.blue,
  },
  smallLogo: {
    height: 25,
    width: 25,
    borderRadius: 12.5,
  },
  bigLogo: {
    height: 83.2,
    width: 83.2,
    borderRadius: 83.2 / 2,
  },
  mediumLogo: {
    height: 35.13,
    width: 35.13,
    borderRadius: 35.13 / 2,
  },
  avatarStr: {
    ...commonStyles.texts.common,
    fontSize: 22,
    color: commonStyles.colors.white,
  },
  smallAvatarStr: {
    fontSize: 12,
  },
  bigAvatarStr: {
    fontSize: 30,
  },
  avatarImage: {
    height: 52,
    width: 52,
    borderRadius: 26,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  avatarImageAndroid7Fix: {
    top: 1,
    transform: [{translateY: -1}],
  },
  bestEmployee: {
    position: 'absolute',
    bottom: -15,
    left: -7,
    width: 60,
    height: 60,
  },
  bigAvatar: {
    width: 90,
    height: 90,
    bottom: -20,
  },
  onlineIndicator: {
    height: 14,
    width: 14,
    borderWidth: 2,
    borderColor: commonStyles.colors.white,
    borderRadius: 7,
    backgroundColor: commonStyles.colors.onlineStatus,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  onlineIndicatorBig: {
    right: 5,
    bottom: 5,
    borderColor: commonStyles.colors.blue,
  },
});

export default Avatar;
