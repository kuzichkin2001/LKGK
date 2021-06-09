import React from 'react';
import {Image, Text, View, StyleSheet} from 'react-native';

import commonStyles from 'styles';

const BadgeIcon = ({source, badge, iconStyle}) => (
  <View>
    <Image
      resizeMode={'contain'}
      source={source}
      style={[commonStyles.common.iconSize, iconStyle]}
    />
    {!!badge && (
      <View style={styles.badge}>
        <Text style={styles.badgeTitle}>{badge >= 100 ? '99+' : badge}</Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderColor: commonStyles.colors.white,
    backgroundColor: commonStyles.colors.red,
    borderRadius: 999,
    position: 'absolute',
    bottom: -2,
    right: -2,
    paddingHorizontal: 3,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeTitle: {
    ...commonStyles.texts.common,
    color: commonStyles.colors.white,
    fontSize: 11,
    textAlign: 'center',
  },
});

export default BadgeIcon;
