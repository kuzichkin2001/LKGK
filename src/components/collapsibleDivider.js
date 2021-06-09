import React from 'react';
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';

import DividerTitle from './dividerTitle';

import commonStyles from '../styles';

const CollapsibleDivider = ({
  title,
  style,
  iconInterpolation,
  toggleOpenStatus,
}) => {
  return (
    <View style={[styles.divider, !!title && styles.titledDivider, style]}>
      <TouchableOpacity onPress={toggleOpenStatus}>
        <View style={styles.introWrapper}>
          <Animated.Image
            style={[styles.arrowIcon, {transform: iconInterpolation}]}
            source={require('../assets/images/arrow-down.png')}
          />
          <DividerTitle title={title} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: commonStyles.colors.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  introWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    ...commonStyles.texts.infoRowTitle,
  },

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
  subtitle: {
    ...commonStyles.texts.mainScreenSubtitle,
    paddingTop: 4,
  },
  arrowIcon: {
    height: 24,
    width: 24,
    marginRight: 11,
    alignSelf: 'center',
  },
});

export default CollapsibleDivider;
