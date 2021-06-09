import React from 'react';
import {View, TextInput, Image, StyleSheet} from 'react-native';

import commonStyles from 'styles';
import locale from 'locale';

const SearchInput = ({value, onChangeText, ...otherProps}) => (
  <View style={styles.wrapper}>
    <View style={styles.inputWrapper}>
      <Image
        source={require('images/search.png')}
        resizeMode={'contain'}
        style={styles.icon}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={commonStyles.colors.searchInputPlaceholder}
        placeholder={locale.ru.title_search}
        style={styles.input}
        {...otherProps}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: commonStyles.colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  inputWrapper: {
    ...commonStyles.common.rowCenter,
    backgroundColor: commonStyles.colors.searchInputBackground,
    flex: 1,
    height: 36,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  icon: {
    height: 14,
    width: 14,
  },
  input: {
    ...commonStyles.texts.common,
    flex: 1,
    paddingLeft: 7,
    transform: [{translateY: 1}],
    color: commonStyles.colors.white,
  },
});

export default SearchInput;
