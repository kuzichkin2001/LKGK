import React, {Component} from 'react';
import {observable, action, computed} from 'mobx';
import {observer} from 'mobx-react';
import {Image, Text, StyleSheet, View, ActivityIndicator} from 'react-native';
import axios from 'axios';

import commonStyles from 'styles';
import * as FileSystem from '../../utils/fileSystem';
import locale from 'locale';
import {showMessage} from '../../utils/showMessage';

import CommonTouchable from '../buttons/commonTouchable';

@observer
class ApprovingTaskPinnedDoc extends Component {
  mounted = false;

  @observable
  initialCheck = false;

  @observable
  filePath = null;

  @observable
  downloadActivity = false;

  @computed
  get fileExtension() {
    let result = '';
    try {
      if (this.filePath) {
        const extension = this.filePath.substr(this.filePath.lastIndexOf('.'));
        if (extension) {
          result = extension;
        }
      }
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  @action
  handlePress = async () => {
    if (this.downloadActivity) {
      return;
    }
    try {
      await this.updateFilePath();
      if (!this.filePath) {
        this.downloadActivity = true;
        const {filePrefix, downloadRoute, fileData} = this.props;
        const downloadURL = `${axios.defaults.baseURL}${downloadRoute}${
          fileData.downloadUrlBody
            ? `?${fileData.downloadUrlBody}`
            : `/${fileData.file_id || fileData.id + ''}`
        }`;
        const downloadResult = await FileSystem.downloadFile(
          fileData,
          downloadURL,
          filePrefix,
        );
        if (downloadResult) {
          this.updateFilePath();
          console.log('downloaded');
        } else if (this.mounted) {
          showMessage(locale.ru.error, locale.ru.couldnt_download_file);
        }
      } else {
        await FileSystem.viewFile(this.filePath);
      }
    } catch (e) {
      console.log(e);
    }
    this.downloadActivity = false;
  };

  @action
  checkFile = async () => {
    let result = '';
    try {
      const {file_id, id} = this.props.fileData;
      result = await FileSystem.findFilenameInDir(
        FileSystem.defaultDownloadPath,
        this.props.filePrefix + (file_id || id + ''),
      );
    } catch (e) {
      console.log(e);
    }
    this.initialCheck = true;
    return result;
  };

  @action
  updateFilePath = async () => {
    const filePath = await this.checkFile();
    if (filePath) {
      this.filePath = filePath;
    }
  };

  componentDidMount() {
    this.updateFilePath();
    this.mounted = true;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fileData.id !== this.props.fileData.id) {
      this.updateFilePath();
    }
  }

  componentWillUnmount(): void {
    this.mounted = false;
  }

  render() {
    const {fileData, downloadFileTitle, openFileTitle} = this.props;
    if (!fileData || !this.initialCheck) {
      return null;
    }
    const {file_name} = fileData;
    const visibleName = this.filePath
      ? openFileTitle || file_name
      : downloadFileTitle || file_name;
    return (
      <CommonTouchable onPress={this.handlePress} style={styles.wrapper}>
        {this.downloadActivity ? (
          <ActivityIndicator
            style={styles.iconSize}
            color={commonStyles.colors.label}
          />
        ) : (
          <View style={!!this.fileExtension && styles.iconWrapper}>
            <Image
              style={styles.iconSize}
              source={
                this.filePath
                  ? require('images/downloaded-file.png')
                  : require('images/attachment.png')
              }
              resizeMode={'contain'}
            />
          </View>
        )}
        <Text style={styles.docName}>{visibleName}</Text>
      </CommonTouchable>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    ...commonStyles.common.bottomBorder,
    backgroundColor: commonStyles.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  docName: {
    ...commonStyles.texts.infoRowTitle,
    paddingLeft: 12,
    flex: 1,
  },
  icon: {
    tintColor: commonStyles.colors.blue,
  },
  extensionText: {
    ...commonStyles.texts.commonSmall,
    maxWidth: 100,
  },
  iconWrapper: {
    alignItems: 'center',
  },
  iconSize: {
    height: 24,
    width: 24,
  },
});

export default ApprovingTaskPinnedDoc;
