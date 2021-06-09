import React from 'react';
import {StyleSheet} from 'react-native';

import commonStyles from 'styles';
import CommonTouchable from './buttons/commonTouchable';

const InputWrapper = ({
  children,
  style,
  removeBottomOffset,
  wrapperStyle,
  onPress,
}) => (
  <CommonTouchable
    onPress={onPress}
    disabled={!onPress}
    style={[
      styles.wrapper,
      !!removeBottomOffset && styles.zeroBottomOffset,
      style,
      wrapperStyle,
    ]}>
    {children}
  </CommonTouchable>
);

const styles = StyleSheet.create({
  wrapper: {
    ...commonStyles.common.bottomBorder,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  zeroBottomOffset: {
    ...commonStyles.common.bottomBorder,
    marginBottom: 0,
  },
});

export default InputWrapper;
