import React from 'react';
import {View} from 'react-native';

import commonStyles from 'styles';

import ScreenNetworkConnectionIndicator from './screenNetworkConnectionIndicator';

const ChatScreenWrapper = ({
  wrapperStyle,
  children,
  isNetworkIndicatorHidden,
}) => (
  <View style={[commonStyles.common.chatScreenWrapper, wrapperStyle]}>
    {!isNetworkIndicatorHidden && <ScreenNetworkConnectionIndicator />}
    {children}
  </View>
);

export default ChatScreenWrapper;
