import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

import commonStyles from 'styles';

import Avatar from './avatar';

const LabeledPerson = ({onPress, avatarSettings, label, wrapperStyle}) => {
  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={onPress}
      style={[styles.wrapper, wrapperStyle]}>
      <Text style={styles.label}>{label}</Text>
      <Avatar {...avatarSettings} isSmall={true} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    ...commonStyles.texts.inputTitle,
    paddingRight: commonStyles.spaces.m,
  },
});

export default LabeledPerson;
