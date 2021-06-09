import {Linking} from 'react-native';

const openPhone = phone => {
  try {
    Linking.openURL('tel:' + phone);
  } catch (e) {
    console.log(e);
  }
};

export default openPhone;
