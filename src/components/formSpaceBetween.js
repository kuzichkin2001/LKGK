import React, {PureComponent} from 'react';
import {
  View,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {getBottomSpace} from 'react-native-iphone-x-helper';

class FormSpaceBetween extends PureComponent {
  render() {
    const {Top, Bottom, wrapperStyle} = this.props;
    if (Platform.OS === 'ios') {
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            keyboardVerticalOffset={60 + getBottomSpace() / 2}
            style={[styles.wrapper, wrapperStyle]}
            enabled={true}
            behavior={'padding'}>
            <View>{Top}</View>
            {Bottom}
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <View style={[styles.wrapper, wrapperStyle]}>
          <ScrollView keyboardShouldPersistTaps={'always'}>{Top}</ScrollView>
          {Bottom}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 0,
    marginBottom: 0,
  },
});

export default FormSpaceBetween;
