import RNSendSms from 'react-native-sms';
import {sendSms} from 'react-native-send-intent';
import {Platform} from 'react-native';

const multipleSmsSend = (numbersArray, message = '') => {
  try {
    console.log(
      `multiple sms send, numbers: ${JSON.stringify(
        numbersArray,
      )}, message: ${message}`,
    );
    if (Platform.OS === 'ios') {
      RNSendSms.send(
        {
          body: message,
          recipients: numbersArray,
        },
        () => {},
      );
    } else {
      sendSms(numbersArray.join(';'), message);
    }
  } catch (e) {
    console.log(e);
  }
};

export default multipleSmsSend;
