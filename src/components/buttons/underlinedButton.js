import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

import commonStyles from 'styles';

const UnderlinedButton = ({title, onPress, wrapperStyle}) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, wrapperStyle]}>
    <Text style={styles.title}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'flex-end',
    padding: commonStyles.spaces.s,
    paddingTop: commonStyles.spaces.m,
  },
  title: {
    ...commonStyles.texts.commonSmall,
    color: commonStyles.colors.red,
    borderBottomWidth: 0.5,
    borderBottomColor: commonStyles.colors.red,
  },
});

export default UnderlinedButton;
