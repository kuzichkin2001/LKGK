import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import commonStyles from 'styles';
import fonts from '../../styles/fonts';

const TextButton = ({
  onPress,
  title,
  titleStyle,
  wrapperStyle,
  activity,
  ...otherProps
}) => (
  <TouchableOpacity
    disabled={!!activity}
    onPress={onPress}
    style={wrapperStyle}
    {...otherProps}>
    {activity ? (
      <ActivityIndicator size={'small'} color={commonStyles.colors.label} />
    ) : (
      <Text style={[styles.title, titleStyle]}>{title}</Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  title: {
    ...commonStyles.texts.common,
    fontSize: 16,
    fontFamily: fonts.CeraProMedium,
    color: commonStyles.colors.red,
  },
});

export default TextButton;
