import {Platform} from 'react-native';
import ImagePicker from 'react-native-image-picker';

const pickPhoto = async () => {
  return await new Promise(resolve => {
    ImagePicker.showImagePicker(
      {
        title: 'Выберите изображение',
        cancelButtonTitle: 'Отмена',
        takePhotoButtonTitle: 'Сделать фото',
        chooseFromLibraryButtonTitle: 'Выбрать из Галереи',
        chooseWhichLibraryTitle: 'Выберите Галерею',
        cameraType: 'back',
        mediaType: 'photo',
        quality: 1,
        allowsEditing: false,
        noData: true,
        storageOptions: {
          skipBackup: true,
          cameraRoll: true,
        },
        permissionDenied: {
          title: 'Разрешение отсутсвует',
          text: 'Нет доступа к камере и галерее',
          reTryTitle: 'Повторить',
          okTitle: 'OK',
        },
      },
      response => {
        console.log(response);
        if (!response || response.didCancel) {
          resolve(null);
        } else {
          resolve({
            ...response,
            name: Platform.select({
              android: response.fileName,
              ios: response.uri.split('/')[response.uri.split('/').length - 1],
            }),
            openUrl: response.uri,
            uploadUrl: Platform.select({
              ios: response.uri.replace('file://', ''),
              android: response.uri,
            }),
          });
        }
      },
    );
  });
};

export default pickPhoto;
