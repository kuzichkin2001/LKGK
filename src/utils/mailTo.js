import {Platform} from 'react-native';
import {openComposer} from 'react-native-email-link';
import {sendMail} from 'react-native-send-intent';

import {showMessage} from './showMessage';
import locale from 'locale';

const mailTo = email => {
  try {
    if (Platform.OS === 'ios') {
      openComposer({
        to: email,
        title: locale.ru.select_mail_app,
        message: locale.ru.select_which_app_you_want_to_open,
        cancelLabel: locale.ru.cancel,
      });
    } else {
      sendMail(email, '', '');
    }
  } catch (e) {
    showMessage(locale.ru.error, locale.ru.couldnt_open_email);
    console.log(e);
  }
};

export default mailTo;
