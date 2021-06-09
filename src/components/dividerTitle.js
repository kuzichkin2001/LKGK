import React from 'react';
import {Text, StyleSheet} from 'react-native';
import commonStyles from '../styles';

const DividerTitle = ({title = '', error, style}) => (
  <Text
    style={[
      styles.dividerTitle,
      !!error && {color: commonStyles.colors.red},
      style,
    ]}>
    {error || title.toUpperCase()}
  </Text>
);

const styles = StyleSheet.create({
  dividerTitle: {
    ...commonStyles.texts.label,
    paddingTop: commonStyles.spaces.l,
    paddingBottom: commonStyles.spaces.s,
  },
});

export default DividerTitle;
