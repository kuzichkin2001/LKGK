import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

import commonStyles from '../styles';

import InputSideButton from './buttons/inputSideButton';
import Divider from './divider';
import CommonTouchable from './buttons/commonTouchable';

const ListAddHeader = ({
  dividerTitle,
  title,
  onAddPress,
  error,
  icon,
  showIconAndTitle,
}) => (
  <View onPress={onAddPress}>
    <Divider error={error} title={dividerTitle || title} />
    {showIconAndTitle && (
      <CommonTouchable
        disabled={!onAddPress}
        onPress={onAddPress}
        style={styles.button}>
        {!!onAddPress && (
          <InputSideButton
            iconStyle={styles.icon}
            source={icon || require('images/plus.png')}
          />
        )}
        <Text style={styles.title}>{title}</Text>
      </CommonTouchable>
    )}
  </View>
);

const styles = StyleSheet.create({
  button: {
    ...commonStyles.common.bottomBorder,
    backgroundColor: commonStyles.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 45,
    paddingHorizontal: 16,
  },
  icon: {
    height: 24,
    width: 24,
  },
  title: {
    ...commonStyles.texts.infoRowTitle,
    paddingLeft: 10,
  },
});

export default ListAddHeader;
