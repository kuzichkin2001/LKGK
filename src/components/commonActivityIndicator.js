import React from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';

import commonStyles from 'styles';

const CommonActivityIndicator = ({
  wrapperStyle,
  isAbsoluteCenter,
  ...otherProps
}) => (
  <View
    style={[
      styles.wrapper,
      !!isAbsoluteCenter && styles.absoluteCenter,
      wrapperStyle,
    ]}>
    <ActivityIndicator
      size={'large'}
      color={commonStyles.colors.label}
      {...otherProps}
    />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    ...commonStyles.common.topOffsetXL,
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  absoluteCenter: {
    position: 'absolute',
    backgroundColor: commonStyles.colors.white,
    top: '45%',
    left: '52%',
  },
});

export default CommonActivityIndicator;
