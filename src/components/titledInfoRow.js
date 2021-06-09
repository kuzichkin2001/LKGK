import React, {PureComponent} from 'react';
import {Text, Image, StyleSheet, View} from 'react-native';

import commonStyles from 'styles';

import NavigateArrow from './navigateArrow';
import CommonTouchable from './buttons/commonTouchable';

class TitledInfoRow extends PureComponent {
  render() {
    const {
      onPress,
      icon,
      iconPlaceholder = true,
      title,
      error,
      value,
      valueComponent,
      children,
      valueStyle,
      onIconPress,
      onRemovePress,
      showArrow,
      titleStyle,
    } = this.props;
    if (!valueComponent && !children && !value) {
      return null;
    }
    return (
      <CommonTouchable
        style={styles.wrapper}
        disabled={!onPress}
        onPress={onPress}>
        {iconPlaceholder && (
          <CommonTouchable
            onPress={onIconPress}
            disabled={!onIconPress}
            style={styles.iconBox}>
            {!!icon && (
              <Image
                resizeMode={'contain'}
                source={icon}
                style={[styles.iconBox, styles.icon]}
              />
            )}
          </CommonTouchable>
        )}
        <View
          style={[styles.dataWrapper, iconPlaceholder && styles.dataOffset]}>
          <Text
            style={[
              commonStyles.texts.label,
              titleStyle,
              !!error && styles.error,
            ]}>
            {error || title}
          </Text>
          {valueComponent || children ? (
            valueComponent || children
          ) : (
            <Text style={[styles.value, valueStyle]}>{value}</Text>
          )}
        </View>
        {(!!onPress || !!showArrow) && (
          <NavigateArrow style={styles.navigateArrow} />
        )}
        {!!onRemovePress && (
          <CommonTouchable style={styles.closeButton} onPress={onRemovePress}>
            <Image
              resizeMode={'contain'}
              style={styles.closeButtonIcon}
              source={require('images/cross-thin.png')}
            />
          </CommonTouchable>
        )}
      </CommonTouchable>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    ...commonStyles.common.bottomBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: commonStyles.colors.white,
  },
  iconBox: {
    height: 24,
    width: 24,
  },
  icon: {
    alignSelf: 'flex-start',
    tintColor: '#7C8598',
  },
  value: {
    ...commonStyles.texts.infoRowTitle,
    marginTop: 5,
  },
  dataWrapper: {
    flex: 1,
  },
  dataOffset: {
    paddingLeft: 11,
  },
  error: {
    color: commonStyles.colors.red,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 16,
  },
  closeButtonIcon: {
    height: 20,
    width: 20,
    transform: [{scale: 2}],
  },
  navigateArrow: {
    alignSelf: 'center',
  },
});

export default TitledInfoRow;
