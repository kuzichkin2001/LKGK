import React, {PureComponent} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {getBottomSpace} from 'react-native-iphone-x-helper';

import commonStyles from 'styles';

class LargeSubmitButton extends PureComponent {
  render() {
    const {title, caption, onPress, isSubmitting, wrapperStyle} = this.props;
    return (
      <TouchableOpacity
        style={[styles.wrapper, wrapperStyle]}
        onPress={onPress}>
        {isSubmitting ? (
          <ActivityIndicator color={commonStyles.colors.label} size={'large'} />
        ) : (
          <Text style={styles.title}>{caption || title}</Text>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: commonStyles.colors.blue,
    height: 60 + getBottomSpace() / 2,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    ...commonStyles.texts.infoRowTitle,
    color: commonStyles.colors.white,
  },
});

export default LargeSubmitButton;
