import React from 'react';
import {Text, View, StyleSheet, Platform} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';

import commonStyles from 'styles';

import TopBarButton from './buttons/topBarButton';

const TopBar = ({title, leftButton, rightButton}) => (
  <View style={styles.wrapper}>
    <View style={styles.leftButtonWrapper}>
      {!!leftButton && (
        <TopBarButton onPress={leftButton.onPress} source={leftButton.source} />
      )}
    </View>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.rightButtonWrapper}>
      {!!rightButton && (
        <TopBarButton
          onPress={rightButton.onPress}
          source={rightButton.source}
        />
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: commonStyles.colors.blue,
    height: Platform.select({
      android: 56.5,
      ios: 45 + getStatusBarHeight(true),
    }),
    width: '100%',
    paddingTop: Platform.select({
      ios: getStatusBarHeight(true),
      android: 0,
    }),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: commonStyles.spaces.m,
  },
  title: {
    ...commonStyles.texts.title,
    fontSize: 18,
    color: commonStyles.colors.white,
  },
  leftButtonWrapper: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightButtonWrapper: {
    flex: 1,
    alignItems: 'flex-end',
  },
});

export default TopBar;
