import React, {PureComponent} from 'react';
import {TextInput, StyleSheet, Platform, Text, View} from 'react-native';
import {
  formatIncompletePhoneNumber,
  parseIncompletePhoneNumber,
} from 'libphonenumber-js/max';

import commonStyles from 'styles';

import TitledInfoRow from '../titledInfoRow';
import CommonTouchable from '../buttons/commonTouchable';

class MainInput extends PureComponent {
  textInputRef = null;

  handlePress = () => {
    const {onPress} = this.props;
    if (onPress) {
      onPress();
    } else if (this.textInputRef) {
      this.textInputRef.focus();
    }
  };

  handleChangeText = value => {
    const {onChangeText, keyboardType} = this.props;
    if (onChangeText) {
      if (keyboardType === 'email-address') {
        onChangeText(value.trim());
      } else if (keyboardType === 'phone-pad') {
        const formattedCurrentValue = parseIncompletePhoneNumber(value);
        if (formattedCurrentValue !== this.props.value) {
          onChangeText(formattedCurrentValue);
        }
      } else {
        onChangeText(value);
      }
    }
  };

  formatValue = value => {
    if (this.props.keyboardType === 'phone-pad') {
      return formatIncompletePhoneNumber(value, 'RU').replace(/[\(\)']+/g, '');
    } else {
      return value;
    }
  };

  render() {
    const {
      title,
      error,
      onPress,
      showArrow,
      editable = true,
      value,
      multiline,
      icon,
      onIconPress,
      onRemovePress,
      isHidden,
      children,
      ...otherProps
    } = this.props;
    if (isHidden) {
      return null;
    }
    return (
      <CommonTouchable
        activeOpacity={onPress ? 0.2 : 1}
        onPress={this.handlePress}>
        <TitledInfoRow
          showArrow={showArrow}
          onRemovePress={onRemovePress}
          onIconPress={onIconPress}
          icon={icon}
          error={error}
          title={title}>
          <View style={commonStyles.common.rowCenterSpace}>
            {!editable && !!value ? (
              <Text
                numberOfLines={multiline ? undefined : 1}
                style={styles.textInput}>
                {this.formatValue(value)}
              </Text>
            ) : (
              <TextInput
                {...otherProps}
                multiline={multiline}
                editable={editable}
                style={styles.textInput}
                autoCapitalize={
                  otherProps.keyboardType === 'email-address' ? 'none' : null
                }
                autoCorrect={
                  otherProps.keyboardType === 'email-address' ? false : null
                }
                value={this.formatValue(value)}
                placeholderTextColor={commonStyles.colors.inputPlaceholder}
                ref={ref => (this.textInputRef = ref)}
                onChangeText={this.handleChangeText}
              />
            )}
          </View>
          {children || null}
        </TitledInfoRow>
      </CommonTouchable>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    ...commonStyles.texts.infoRowTitle,
    flex: 1,
    paddingTop: 5,
    paddingBottom: Platform.select({
      android: 0,
    }),
    paddingLeft: 0,
    textAlignVertical: 'top',
  },
});

export default MainInput;
