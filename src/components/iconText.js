import React from 'react';
import {Image, Text, View, StyleSheet} from 'react-native';

import commonStyles from 'styles';

const IconText = ({
  value,
  icon,
  wrapperStyle,
  valueStyle,
  color,
  iconStyle,
}) => {
  const iconColor = {tintColor: color};
  const valueColor = {color: color};
  return (
    <View style={[commonStyles.common.rowCenter, wrapperStyle]}>
      {icon ? (
        <Image
          resizeMode={'contain'}
          style={[styles.icon, iconColor, iconStyle]}
          source={icon}
        />
      ) : (
        <View style={styles.icon} />
      )}
      <Text style={[styles.value, valueColor, valueStyle]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    height: 14,
    width: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    ...commonStyles.texts.common,
    fontSize: 13,
    paddingLeft: 6,
  },
});

export default IconText;
