import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

import commonStyles from 'styles';
import formatDate from '../../utils/formatDate';

import IconText from '../iconText';
import EmployeePickListItem from './employeePickListItem';
import MainInput from '../inputs/MainInput';
import locale from '../../locale';
import DocumentPicker from 'react-native-document-picker';
import SmallSubmitButton from '../buttons/smallSubmitButton';
import ApprovingTaskPinnedDocsList from '../lists/approvingTaskPinnedDocsList';
import routes from '../../network/routes';
import Divider from '../divider';

const handleAttachmentPress = async onChoose => {
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    });
    if (res) {
      await onChoose(res);
    }
  } catch (e) {
    console.log(e);
  }
};

function CommentListItem({data, onEmployeePress, handleFileUpload}) {
  const [file, setFile] = useState();
  return (
    <View style={styles.wrapper}>
      <EmployeePickListItem
        wrapperStyle={styles.employeeWrapper}
        employeeData={data.user}
        onPress={onEmployeePress}
      />
      <View style={styles.dataWrapper}>
        <Text style={commonStyles.texts.label}>{data.text}</Text>
        <IconText
          color={commonStyles.colors.label}
          wrapperStyle={styles.dateOffset}
          icon={require('images/clock.png')}
          value={formatDate(data.dt, 'DD.MM.YY HH:mm')}
        />
      </View>
      <View style={styles.dataWrapper}>
        {!!data.files && !!data.files.length && (
          <ApprovingTaskPinnedDocsList
            contentContainerStyle={styles.pinnedDocsWrapper}
            downloadRoute={routes.approvalsCabinetDownload}
            filePrefix={ApprovingTaskPinnedDocsList.prefixes.approvalTask}
            ListHeaderComponent={<Divider title={locale.ru.files} />}
            data={data.files}
          />
        )}
      </View>

      <View style={styles.dataWrapper}>
        <MainInput
          onPress={() => handleAttachmentPress(setFile)}
          icon={require('images/attachment.png')}
          title={locale.ru.support_request_attachment}
          multiline={false}
          value={file ? file.name : ''}
          editable={false}
          showArrow={false}>
          <View style={{paddingHorizontal: 0, width: 'auto'}}>
            <SmallSubmitButton
              title={'Загрузить'}
              onPress={() => {
                handleFileUpload(file, data.id);
              }}
              wrapperStyle={{
                minHeight: 'auto',
                minWidth: 0,
                maxWidth: 'auto',
                paddingVertical: 8,
                paddingHorizontal: 0,
              }}
            />
          </View>
        </MainInput>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...commonStyles.common.bottomBorder,
    paddingBottom: commonStyles.spaces.m,
    backgroundColor: commonStyles.colors.white,
  },
  employeeWrapper: {
    borderBottomWidth: 0,
  },
  comment: {
    ...commonStyles.texts.common,
    paddingTop: commonStyles.spaces.s,
  },
  date: {
    ...commonStyles.texts.label,
    alignSelf: 'flex-end',
    paddingTop: commonStyles.spaces.s,
  },
  dataWrapper: {
    paddingHorizontal: 16,
    paddingLeft: 16 + 10 + 25,
  },
  dateOffset: {
    paddingTop: 5,
  },
});

export default CommentListItem;
