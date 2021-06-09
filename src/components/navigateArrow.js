import React from 'react';
import {Image, StyleSheet} from 'react-native';

import commonStyles from 'styles';

const NavigateArrow = ({style}) => (
  <Image
    resizeMode={'contain'}
    source={require('images/arrow-right.png')}
    style={[styles.iconSize, style]}
  />
);

const styles = StyleSheet.create({
  iconSize: {
    height: 18,
    width: 18,
    alignItems: 'center',
    justifyContent: 'center',
    tintColor: commonStyles.colors.navigateArrow,
  },
});

export default NavigateArrow;
