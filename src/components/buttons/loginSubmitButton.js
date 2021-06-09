import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native';

import commonStyles from 'styles';

const LoginSubmitButton = ({
  hidden,
  title,
  onPress,
  wrapperStyle,
  titleStyle,
  isSubmitting,
  theme,
  isSmallTitle,
}) => {
  if (hidden) {
    return null;
  }
  return (
    <TouchableOpacity
      disabled={isSubmitting}
      style={[styles.button, styles[`${theme}ThemeButton`], wrapperStyle]}
      onPress={() => {
        Keyboard.dismiss();
        if (onPress) {
          onPress();
        }
      }}>
      {isSubmitting ? (
        <ActivityIndicator color={commonStyles.colors.label} />
      ) : (
        <Text
          style={[
            commonStyles.texts.loginButtonTitle,
            isSmallTitle && styles.smallTitle,
            styles[`${theme}ThemeTitle`],
            titleStyle,
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 288,
    backgroundColor: commonStyles.colors.blue,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  whiteThemeTitle: {
    color: commonStyles.colors.red,
  },
  greenThemeTitle: {
    color: commonStyles.colors.green,
  },
  whiteThemeButton: {
    backgroundColor: commonStyles.colors.white,
    borderWidth: 1,
    borderColor: commonStyles.colors.red,
  },
  greenThemeButton: {
    backgroundColor: commonStyles.colors.white,
    borderWidth: 1,
    borderColor: commonStyles.colors.green,
  },
  smallTitle: {
    fontSize: 14,
  },
});

export default LoginSubmitButton;
