import React, {PureComponent} from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';

import commonStyles from 'styles';

class SwitchButtons extends PureComponent {
  renderButtons = (buttons = []) =>
    buttons.map(({isSelected, title, onPress}) => (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.button, isSelected && styles.selectedButton]}>
        <Text
          style={[
            commonStyles.texts.switchButtonTitle,
            isSelected && styles.selectedButtonTitle,
          ]}>
          {title}
        </Text>
      </TouchableOpacity>
    ));

  render() {
    const {buttons, wrapperStyle} = this.props;
    if (!buttons || !buttons.length) {
      return null;
    }
    return (
      <View style={[styles.wrapper, wrapperStyle]}>
        {this.renderButtons(buttons)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    ...commonStyles.common.rowCenter,
    minHeight: 34,
    width: '100%',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: commonStyles.colors.blue,
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: commonStyles.colors.blue,
  },
  selectedButton: {
    backgroundColor: commonStyles.colors.white,
  },
  selectedButtonTitle: {
    color: commonStyles.colors.blue,
  },
});

export default SwitchButtons;
