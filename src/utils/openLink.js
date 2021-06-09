import {Linking} from 'react-native';

const openLink = link => {
  try {
    Linking.openURL(link);
  } catch (e) {
    console.log(e);
  }
};

export default openLink;
