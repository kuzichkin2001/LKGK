import React, {PureComponent} from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import {getBottomSpace} from 'react-native-iphone-x-helper';

import commonStyles from 'styles';

class SmallSubmitButton extends PureComponent {
  render() {
    const {onPress, title, isSubmitting, theme, wrapperStyle} = this.props;
    if (!title) {
      return null;
    }
    return (
      <TouchableOpacity
        disabled={!!isSubmitting}
        onPress={onPress}
        style={[styles.wrapper, styles[`${theme}Wrapper`], wrapperStyle]}>
        {isSubmitting ? (
          <ActivityIndicator size={'large'} color={commonStyles.colors.label} />
        ) : (
          <Text
            style={[
              commonStyles.texts.smallSubmitButtonTitle,
              styles[`${theme}Title`],
              styles.text,
            ]}>
            {title.toUpperCase()}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: commonStyles.colors.blue,
    minHeight: 60 + getBottomSpace() / 2,
    width: '50%',
    paddingHorizontal: 16,
  },
  greenWrapper: {
    backgroundColor: 'rgba(133, 193, 5, 0.71)',
  },
  whiteWrapper: {
    backgroundColor: commonStyles.colors.white,
  },
  whiteTitle: {
    color: commonStyles.colors.blue,
  },
  text: {
    paddingVertical: 0,
  },
});

export default SmallSubmitButton;
