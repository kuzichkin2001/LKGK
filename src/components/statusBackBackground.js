import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';

import commonStyles from 'styles';

const StatusBarBackground = () =>
  Platform.select({
    android: null,
    ios: <View style={styles.statusBar} />,
  });

const styles = StyleSheet.create({
  statusBar: {
    height: getStatusBarHeight(true),
    width: '100%',
    backgroundColor: commonStyles.colors.blue,
  },
});

export default StatusBarBackground;
