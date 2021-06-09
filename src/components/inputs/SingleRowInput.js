import React, {PureComponent} from 'react';
import {TextInput, StyleSheet, Platform, Text, View} from 'react-native';
import {
  formatIncompletePhoneNumber,
  parseIncompletePhoneNumber,
} from 'libphonenumber-js/max';

import commonStyles from 'styles';

import CommonTouchable from '../buttons/commonTouchable';
import TitledTextSingleRow from '../titledTextSingleRow';

class SingleRowInput extends PureComponent {
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
      editable = true,
      value,
      icon,
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
        <TitledTextSingleRow
          showArrow={false}
          onRemovePress={onRemovePress}
          error={error}
          title={title}
          wrapperStyles={{alignItems: 'center'}}>
          <View style={[commonStyles.common.rowCenterSpace]}>
            {!editable && !!value ? (
              <Text numberOfLines={1} style={styles.textInput}>
                {this.formatValue(value)}
              </Text>
            ) : (
              <TextInput
                {...otherProps}
                editable={editable}
                style={styles.textInput}
                autoCapitalize={
                  otherProps.keyboardType === 'email-address' ? 'none' : null
                }
                autoCorrect={
                  otherProps.keyboardType === 'email-address' ? false : null
                }
                value={this.formatValue(value)}
                placeholderTextColor={
                  error
                    ? commonStyles.colors.red
                    : commonStyles.colors.inputPlaceholder
                }
                ref={ref => (this.textInputRef = ref)}
                onChangeText={this.handleChangeText}
              />
            )}
          </View>
          {children || null}
        </TitledTextSingleRow>
      </CommonTouchable>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    ...commonStyles.texts.infoRowTitle,
    flex: 1,
    paddingTop: 0,
    paddingBottom: Platform.select({
      android: 0,
    }),
    paddingLeft: 0,
  },
});

export default SingleRowInput;
