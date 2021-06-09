import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

import DividerTitle from './dividerTitle';

import commonStyles from '../styles';

const Divider = ({title, button, icon, error, style, iconStyle}) => (
  <View style={[styles.divider, !!title && styles.titledDivider, style]}>
    {!!icon && (
      <View
        style={[
          styles.iconBox,
          {
            paddingTop: commonStyles.spaces.l,
            paddingBottom: commonStyles.spaces.s,
          },
        ]}>
        <Image resizeMode={'contain'} source={icon} style={iconStyle} />
      </View>
    )}
    <DividerTitle title={title} error={error} />
    {button}
  </View>
);

const styles = StyleSheet.create({
  divider: {
    ...commonStyles.common.bottomBorder,
    ...commonStyles.common.rowCenterSpace,
    minHeight: commonStyles.spaces.l,
    width: '100%',
    backgroundColor: commonStyles.colors.backgroundGray,
    paddingHorizontal: commonStyles.spaces.xl,
    paddingLeft: 16,
  },
  titledDivider: {
    height: 44,
    alignItems: 'flex-end',
  },
  iconBox: {
    height: 'auto',
    width: 'auto',
  },
});

export default Divider;
