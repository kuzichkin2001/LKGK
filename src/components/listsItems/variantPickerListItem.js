import React from 'react';
import {StyleSheet, Text} from 'react-native';

import commonStyles from 'styles';
import CommonTouchable from '../buttons/commonTouchable';

const VariantPickerListItem = ({data, onPress}) => {
  if (!data) {
    return null;
  } else {
    return (
      <CommonTouchable onPress={onPress} style={styles.wrapper}>
        <Text style={commonStyles.texts.commonLarge}>{data.title || data}</Text>
      </CommonTouchable>
    );
  }
};

const styles = StyleSheet.create({
  wrapper: {
    ...commonStyles.common.bottomBorder,
    paddingHorizontal: commonStyles.spaces.xl,
    paddingVertical: commonStyles.spaces.l,
    backgroundColor: commonStyles.colors.white,
  },
});

export default VariantPickerListItem;
