import React, {PureComponent} from 'react';
import {KeyboardAvoidingView, ScrollView, Platform} from 'react-native';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import commonStyles from 'styles';

import LargeSubmitButton from './buttons/largeSubmitButton';

class FormBottomSubmit extends PureComponent {
  render() {
    const {children, submitButtonProps} = this.props;
    if (Platform.OS === 'ios') {
      return (
        <KeyboardAvoidingView
          style={commonStyles.common.formWrapper}
          contentContainerStyle={commonStyles.common.formContainer}
          enabled={true}
          behavior={'padding'}
          keyboardVerticalOffset={50 + getBottomSpace()}>
          <ScrollView keyboardShouldPersistTaps={'always'}>
            {children}
          </ScrollView>
          <LargeSubmitButton {...submitButtonProps} />
        </KeyboardAvoidingView>
      );
    } else {
      return (
        <KeyboardAwareScrollView>
          {children}
          <LargeSubmitButton
            wrapperStyle={commonStyles.common.topOffsetXL}
            {...submitButtonProps}
          />
        </KeyboardAwareScrollView>
      );
    }
  }
}

export default FormBottomSubmit;
