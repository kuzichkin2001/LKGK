import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import commonStyles from 'styles';

const CatalogOfficeListItem = ({data}) => {
  const {name} = data;
  if (!name) {
    return null;
  }
  return (
    <View style={styles.wrapper}>
      <Text style={commonStyles.texts.infoRowTitle}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...commonStyles.common.bottomBorder,
    padding: 16,
    backgroundColor: commonStyles.colors.white,
  },
});

export default CatalogOfficeListItem;
