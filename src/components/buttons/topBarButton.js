import React from 'react';
import {TouchableOpacity, Image, StyleSheet, Platform} from 'react-native';

const iconSize = Platform.select({ios: 19, android: 23});

const TopBarButton = ({source, onPress}) => (
  <TouchableOpacity onPress={onPress} style={styles.wrapper}>
    <Image style={styles.icon} resizeMode={'contain'} source={source} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 30,
    paddingBottom: Platform.select({
      ios: 3,
      android: -6.2,
    }),
    marginLeft: Platform.select({
      ios: 0,
      android: 3.5,
    }),
  },
  icon: {
    height: iconSize,
    width: iconSize,
  },
});

export default TopBarButton;
