import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import locale from '../locale';
import commonStyle from '../styles';

const Remark = ({text}) => (
  <View style={styles.wrapper}>
    <Text style={styles.text}>
      <Text style={styles.remark}>{`${locale.ru.remark}: `}</Text>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    height: 'auto',
    marginVertical: 12,
    marginHorizontal: 16,
  },
  remark: {
    fontWeight: 'bold',
    color: commonStyle.colors.blue,
  },
  text: {
    ...commonStyle.texts.infoRowTitle,
    color: commonStyle.colors.label,
    textAlign: 'justify',
  },
});

export default Remark;
