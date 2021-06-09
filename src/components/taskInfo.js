import React, {Component} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import locale from 'locale';
import formatDate from '../utils/formatDate';
import routes from '../network/routes';

import EmployeePickButton from './buttons/employeePickButton';
import EmployeesPickList from './lists/employeesPickList';
import CommentsList from './lists/commentsList';
import ApprovingTaskPinnedDocsList from './lists/approvingTaskPinnedDocsList';
import MultipleSubmitButtons from './multipleSubmitButtons';
import Divider from './divider';
import TitledInfoRow from './titledInfoRow';
import {taskStatus} from '../constants';
import MainInput from './inputs/MainInput';
import DocumentPicker from 'react-native-document-picker';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import SmallSubmitButton from './buttons/smallSubmitButton';

@observer
class TaskInfo extends Component {
  @observable
  file;

  formatPeriod = (from, to) => {
    if (from && to) {
      const dateFormat = 'DD.MM.YY HH:mm';
      return `${locale.ru.from} ${formatDate(from, dateFormat)} ${
        locale.ru.to
      } ${formatDate(to, dateFormat)}`;
    }
    return '';
  };

  handleAttachmentPress = async onChoose => {
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

  @action.bound
  onFileChoose(value) {
    this.file = value;
  }

  render() {
    const {
      data,
      onEmployeePress,
      onAddCommentPress,
      actionButtons,
      onActionButtonPress,
    } = this.props;
    if (!data) {
      return null;
    } else {
      const {
        theme,
        priority,
        current_status_id,
        date_start,
        date_end,
        note,
        executor_user,
        initiator_user,
        observers,
        assistants,
        comments,
        files,
      } = data;
      return (
        <>
          <ScrollView contentContainerStyle={styles.wrapper}>
            <Divider title={locale.ru.main_info} />
            <TitledInfoRow
              icon={require('images/rows.png')}
              value={theme}
              title={locale.ru.task_theme}
            />
            <TitledInfoRow
              icon={require('images/rows.png')}
              value={note}
              title={locale.ru.task_note}
            />
            <TitledInfoRow
              icon={require('images/rows.png')}
              title={locale.ru.status}
              value={taskStatus[current_status_id]}
            />
            <TitledInfoRow
              icon={require('images/rows.png')}
              title={locale.ru.task_priority}
              value={priority}
            />
            <TitledInfoRow
              icon={require('images/date.png')}
              title={locale.ru.task_period}
              value={this.formatPeriod(date_start, date_end)}
            />
            <EmployeePickButton
              onPress={() => onEmployeePress(initiator_user)}
              employeeData={initiator_user}
              title={locale.ru.task_initiator}
            />
            <EmployeePickButton
              onPress={() => onEmployeePress(executor_user)}
              employeeData={executor_user}
              title={locale.ru.task_executor}
            />
            <EmployeesPickList
              hideIfEmpty={true}
              onEmployeePress={onEmployeePress}
              data={assistants}
              title={locale.ru.task_assistants}
            />
            <EmployeesPickList
              hideIfEmpty={true}
              onEmployeePress={onEmployeePress}
              data={observers}
              title={locale.ru.task_observers}
            />
            <ApprovingTaskPinnedDocsList
              data={files}
              downloadRoute={routes.kipFileDownload}
              filePrefix={ApprovingTaskPinnedDocsList.prefixes.tasks}
              ListHeaderComponent={<Divider title={locale.ru.files} />}
            />
            <MainInput
              onPress={() => this.handleAttachmentPress(this.onFileChoose)}
              icon={require('images/attachment.png')}
              title={locale.ru.support_request_attachment}
              multiline={false}
              value={this.file ? this.file.name : ''}
              editable={false}
              showArrow={false}>
              {this.file && (
                <View
                  style={[
                    styles.fileUploadContainer,
                  ]}>
                  <SmallSubmitButton
                    title={locale.ru.upload}
                    onPress={() => this.props.handleFileUpload(this.file)}
                    wrapperStyle={styles.fileUploadSubmitWrapper}
                  />
                </View>
              )}
            </MainInput>
            <CommentsList
              onAddCommentPress={onAddCommentPress}
              onEmployeePress={onEmployeePress}
              data={comments}
              handleFileUpload={this.props.handleFileUpload}
            />
          </ScrollView>
          <MultipleSubmitButtons
            bottomOffset={true}
            type={'tasks'}
            onPress={onActionButtonPress}
            buttons={actionButtons}
          />
        </>
      );
    }
  }
}

const styles = StyleSheet.create({
  fileUploadContainer: {
    paddingHorizontal: 0,
    width: 'auto',
    marginTop: 12,
  },
  fileUploadSubmitWrapper: {
    minHeight: 'auto',
    minWidth: 0,
    maxWidth: 'auto',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
});

export default TaskInfo;
