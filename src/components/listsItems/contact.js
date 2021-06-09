import React from 'react';
import {Text, StyleSheet} from 'react-native';

import commonStyles from 'styles';
import CommonTouchable from '../buttons/commonTouchable';

const ContactListItem = ({name, phone, onPress}) => (
  <CommonTouchable style={styles.wrapper} onPress={onPress}>
    <Text style={commonStyles.texts.commonLarge}>{name}</Text>
    <Text style={[commonStyles.texts.common, commonStyles.common.topOffset]}>
      {phone}
    </Text>
  </CommonTouchable>
);

const styles = StyleSheet.create({
  wrapper: {
    ...commonStyles.common.bottomBorder,
    minHeight: 50,
    paddingHorizontal: commonStyles.spaces.xl,
    paddingVertical: commonStyles.spaces.m,
  },
});

export default ContactListItem;
