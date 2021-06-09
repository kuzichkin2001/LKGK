import axios from 'axios';
import * as RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

import {showMessage} from './showMessage';
import permissions from './permissions';
import locale from '../locale';

export const defaultDownloadPath = RNFS.DocumentDirectoryPath;

export const downloadFile = async (fileData, downloadUrl, filePrefix) => {
  let result = false;
  try {
    if (await permissions.getWriteExternalStoragePermission()) {
      const downloadFilePath = `${defaultDownloadPath}/${filePrefix}${fileData.file_id ||
        fileData.id + ''}`;
      await removeFile(downloadFilePath);
      const downloadFileResult = await RNFS.downloadFile({
        toFile: downloadFilePath,
        fromUrl: downloadUrl,
        connectionTimeout: 60000,
        readTimeout: 60000,
        backgroundTimeout: 60000,
        headers: {
          authorization: axios.defaults.headers.Authorization,
        },
        begin: info => {
          console.log('download begin');
          console.log(info);
          if (info.statusCode === 200) {
            let apiFileName = info.headers['Content-Disposition'];
            if (!fileData.file_ext) {
              const splittedFileName = apiFileName.split('.');
              fileData.file_ext =
                splittedFileName[splittedFileName.length - 1 || 1];
              fileData.file_ext = apiFileName.replace(
                /^.*filename=("?)(.*)\.(.*[^".])"?$/g,
                '$3',
              );
            }
          }
        },
        /*
        progress: progress => {
          console.log(progress);
        },
        */
      }).promise;
      if (
        await moveFile(
          downloadFilePath,
          `${downloadFilePath}.${fileData.file_ext}`,
        )
      ) {
        result = true;
      }
    }
  } catch (e) {
    console.log(e);
  }
  return result;
};

export const moveFile = async (from, to) => {
  console.log(`move file from:${from}, to: ${to}`);
  await removeFile(to);
  let result = false;
  try {
    await RNFS.moveFile(from, to);
    result = true;
  } catch (e) {
    showMessage(locale.ru.error_internal);
    console.log('move file exception');
    console.log(e);
  }
  return result;
};

export const checkFileExists = async filepath => {
  let result = false;
  try {
    console.log('check file exists: ' + filepath);
    result = await RNFS.exists(filepath);
    console.log('check file exists: ' + filepath + '; result: ' + !!result);
  } catch (e) {
    console.log('check file exists exception');
    console.log(e);
  }
  return result;
};

export const removeFile = async filepath => {
  let result = false;
  try {
    console.log('remove file: ' + filepath);
    const isFileExists = await checkFileExists(filepath);
    if (isFileExists) {
      await RNFS.unlink(filepath);
      result = true;
    } else {
      result = true;
    }
  } catch (e) {
    console.log(e);
  }
  return result;
};

export const findFilenameInDir = async (dir, filename, exact = false) => {
  let result = false;
  try {
    console.log(`find file ${filename} in dir ${dir}, exact: ${exact}`);
    const filesList = await RNFS.readdir(dir);
    console.log(`${dir} files list`);
    const file = filesList.find(file => {
      console.log(file);
      if (exact) {
        return file.trim().normalize() === filename.trim().normalize();
      } else {
        return (
          file
            .split('.')[0]
            .normalize()
            .trim() === filename.trim().normalize()
        );
      }
    });
    console.log('founded file: ');
    console.log(file);
    if (file) {
      result = `${dir}/${file}`;
    }
  } catch (e) {
    console.log(e);
  }
  return result;
};

export const viewFile = async filePath => {
  let result = false;
  try {
    console.log(filePath);
    await FileViewer.open(encodeURI(filePath), {
      showOpenWithDialog: true,
      showAppsSuggestions: true,
    });
    console.log('file view success');
    result = true;
  } catch (e) {
    console.log('file open error');
    console.log(filePath);
    if (e.message === 'No app associated with this mime type') {
      showMessage(
        'Ошибка',
        'Не удалось найти приложение, поддерживающее формат файла',
      );
    }
    console.log(e);
  }
  return result;
};
