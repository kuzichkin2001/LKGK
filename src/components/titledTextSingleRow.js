import React, {PureComponent} from 'react';
import {Text, StyleSheet, View} from 'react-native';

import commonStyles from '../styles';
import CommonTouchable from './buttons/commonTouchable';

class TitledTextSingleRow extends PureComponent {
  render() {
    const {
      title,
      value,
      valueComponent,
      valueStyle,
      children,
      showEmpty = false,
      wrapperStyle,
      valueWrapperStyle,
      onPress = () => {},
    } = this.props;
    if (!(!!valueComponent || !!children || !!value) && !showEmpty) {
      return null;
    }
    return (
      <CommonTouchable
        activeOpacity={onPress ? 0.2 : 1}
        onPress={() => onPress()}>
        <View style={[styles.wrapper, wrapperStyle]}>
          <Text
            style={[
              commonStyles.texts.infoRowTitle,
              title && {marginRight: 6},
            ]}>
            {title}
          </Text>
          <View style={[styles.valueWrapper, valueWrapperStyle]}>
            {valueComponent || children ? (
              valueComponent || children
            ) : (
              <Text
                style={[
                  commonStyles.texts.infoRowTitle,
                  styles.valueText,
                  valueStyle,
                ]}>
                {value}
              </Text>
            )}
          </View>
        </View>
      </CommonTouchable>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    ...commonStyles.common.bottomBorder,
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: commonStyles.colors.white,
    justifyContent: 'space-between',
  },
  valueWrapper: {
    flex: 1,
    alignItems: 'flex-end',
  },
  valueText: {
    fontSize: 15,
    fontFamily: commonStyles.fonts.CeraProRegular,
    color: commonStyles.colors.valueGray,
  },
});

export default TitledTextSingleRow;
