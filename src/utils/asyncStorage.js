import AsyncStorage from '@react-native-community/async-storage';

const saveKey = async (key, value) => {
  let result = false;
  try {
    await AsyncStorage.setItem(key, value);
    result = true;
  } catch (e) {
    console.log(e);
  }
  return result;
};

const getKey = async key => {
  let result = null;
  try {
    result = await AsyncStorage.getItem(key);
  } catch (e) {
    console.log(e);
  }
  return result;
};

export default {
  saveKey,
  getKey,
};
