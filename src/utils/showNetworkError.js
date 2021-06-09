import locale from 'locale';
import {showMessage} from './showMessage';

export const showNetworkError = response => {
  if (response) {
    try {
      const {error} = response.data;
      let errorMessage = '';
      if (error.isArray) {
        errorMessage = JSON.stringify(error[0]);
      } else {
        switch (typeof error) {
          case 'string':
            errorMessage = error;
            break;
          case 'object':
            const errorValues = Object.values(error);
            errorMessage = typeof errorValues[0].isArray
              ? errorValues[0][0]
              : JSON.stringify(errorValues[0]);
            break;
          default:
            errorMessage = locale.ru.error_network;
        }
      }
      showMessage(locale.ru.error, errorMessage || locale.ru.error_network);
    } catch (err) {
      showMessage(locale.ru.error, locale.ru.error_network);
      console.log(err);
    }
  } else {
    console.log('response is empty');
    showMessage(locale.ru.error, locale.ru.error_network);
  }
};
