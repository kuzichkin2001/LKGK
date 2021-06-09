import {PermissionsAndroid, Platform} from 'react-native';

const getWriteExternalStoragePermission = async () => {
  if (Platform.OS === 'ios') {
    return true;
  }
  let result = false;
  try {
    if (
      await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      )
    ) {
      result = true;
    } else if (
      (await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      )) === PermissionsAndroid.RESULTS.GRANTED
    ) {
      result = true;
    }
  } catch (e) {
    console.log(e);
  }
  return result;
};

const getContactsPermission = async () => {
  let result = false;
  let permissions;
  try {
    if (Platform.OS === 'ios') {
      result = true;
    } else {
      permissions = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      );
      if (permissions) {
        result = true;
      } else {
        permissions = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        );
        if (permissions === PermissionsAndroid.RESULTS.GRANTED) {
          result = true;
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
  return result;
};

export default {
  getWriteExternalStoragePermission,
  getContactsPermission,
};
