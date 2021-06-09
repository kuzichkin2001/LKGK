import React from 'react';
import {View} from 'react-native';

import commonStyles from 'styles';

import ScreenNetworkConnectionIndicator from './screenNetworkConnectionIndicator';

const ScreenWrapper = ({wrapperStyle, children, isNetworkIndicatorHidden}) => (
  <View style={[commonStyles.common.grayScreenWrapper, wrapperStyle]}>
    {!isNetworkIndicatorHidden && <ScreenNetworkConnectionIndicator />}
    {children}
  </View>
);

export default ScreenWrapper;
