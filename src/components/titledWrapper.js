import React from 'react';
import {Text, View} from 'react-native';

import commonStyles from 'styles';

const TitledWrapper = ({title, wrapperStyle, children, titleStyle, error}) => (
  <View style={wrapperStyle}>
    <Text
      style={[
        commonStyles.texts.label,
        !!error && commonStyles.texts.inputError,
        titleStyle,
      ]}>
      {error || title}
    </Text>
    {children}
  </View>
);

export default TitledWrapper;
