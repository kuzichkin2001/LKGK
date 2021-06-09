import React from 'react';
import {Image, TouchableOpacity, StyleSheet} from 'react-native';

const InputSideButton = ({
  wrapperStyle,
  onPress,
  source,
  iconStyle,
  isSmall,
}) => (
  <TouchableOpacity
    disabled={!onPress}
    style={[styles.wrapper, wrapperStyle]}
    onPress={onPress}>
    <Image
      style={[styles.icon, !!isSmall && styles.smallIcon, iconStyle]}
      source={source}
      resizeMode={'contain'}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 40,
    width: 40,
  },
  smallIcon: {
    height: 15,
    width: 15,
  },
});

export default InputSideButton;
