import React from 'react';
import {View, StyleSheet} from 'react-native';

import SmallSubmitButton from './buttons/smallSubmitButton';
import LargeSubmitButton from './buttons/largeSubmitButton';

const buttonColors = {
  tasks: {
    7: 'rgb(20,37,83)',
    2: 'rgb(65, 143, 215)',
    8: 'rgb(203,134,0)',
    9: 'rgb(133,177,0)',
  },
  document_request: {
    0: 'rgba(20,38,84,1)',
    1: 'rgba(133,193,5,0.71)',
  },
};

const MultipleSubmitButtons = ({buttons, onPress, wrapperStyle, type}) => {
  if (!buttons || !buttons.length) {
    return null;
  }
  if (buttons.length === 1) {
    return (
      <LargeSubmitButton
        {...buttons[0]}
        onPress={() => {
          if (buttons[0].onPress) {
            buttons[0].onPress();
          } else {
            onPress && onPress(buttons[0]);
          }
        }}
      />
    );
  }
  return (
    <View
      style={[
        styles.submitButtonsWrapper,
        buttons.length === 1 && styles.singleButtonWrapper,
        wrapperStyle,
      ]}>
      {buttons.map((button, index) => {
        const isGreen = button.action && button.action != 2;
        const isWhite = (index + 1) % 2;
        const theme = isGreen ? 'green' : isWhite ? 'white' : null;
        let backgroundColor =
          buttonColors[type] && buttonColors[type][button.action];
        return (
          <SmallSubmitButton
            key={index}
            isSubmitting={button.isSubmitting}
            onPress={() => {
              if (button.onPress) {
                button.onPress();
              } else {
                onPress(button);
              }
            }}
            wrapperStyle={[
              !!backgroundColor && {backgroundColor: backgroundColor},
            ]}
            theme={!backgroundColor && theme}
            title={button.caption}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  submitButtonsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  singleButtonWrapper: {
    justifyContent: 'flex-end',
  },
});

export default MultipleSubmitButtons;
