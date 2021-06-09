import React from 'react';
import {Text, StyleSheet} from 'react-native';

import commonStyles from 'styles';

const ListEmptyView = ({title}) => <Text style={styles.title}>{title}</Text>;

const styles = StyleSheet.create({
  title: {
    ...commonStyles.texts.titleBig,
    alignSelf: 'center',
    padding: commonStyles.spaces.xl,
  },
});

export default ListEmptyView;
