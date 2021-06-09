import {Alert} from 'react-native';

import locale from 'locale';

export const showMessage = (title, message, callback) => {
  try {
    Alert.alert(title, message, [
      {text: 'OK', onPress: () => (callback ? callback() : {})},
    ]);
  } catch (e) {
    Alert.alert(locale.ru.error, locale.ru.unknown_error_occurred, [
      {text: 'OK', onPress: () => (callback ? callback() : {})},
    ]);
    console.log(e);
  }
};

export const showMessageAsync = async (title, message, callback) => {
  try {
    return new Promise(resolve => {
      Alert.alert(title, message, [
        {
          text: 'OK',
          onPress: async () => {
            if (callback) {
              const cb = await callback();
              return resolve(cb);
            }
            return resolve(() => {});
          },
        },
      ]);
    });
  } catch (e) {
    Alert.alert(locale.ru.error, locale.ru.unknown_error_occurred, [
      {text: 'OK', onPress: async () => (callback ? await callback() : {})},
    ]);
  }
};
