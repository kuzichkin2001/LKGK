import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

import Divider from './divider';
import TitledInfoRow from './titledInfoRow';
import EmployeePickButton from './buttons/employeePickButton';
import IconInfoRow from './iconInfoRow';
import UserRow from './userRow';
import IconText from './iconText';

import commonStyles from 'styles';
import locale from '../locale';

import {requestDocumentsTypes} from '../constants';
import formatDate from '../utils/formatDate';
import ApprovingTaskPinnedDocsList from './lists/approvingTaskPinnedDocsList';
import routes from '../network/routes';

const statusColor = status => {
  let result = '';
  try {
    switch (status + '') {
      case '2':
        result = commonStyles.colors.red;
        break;
      default:
        result = commonStyles.colors.green;
    }
  } catch (e) {
    console.log(e);
  }
  return result;
};

const statusIcon = status => {
  let result = null;
  try {
    switch (status + '') {
      case '2':
        result = require('images/list-item-delete.png');
        break;
      default:
        result = require('images/complete.png');
    }
  } catch (e) {
    console.log(e);
  }
  return result;
};

const ExtraInfo = ({info}) => {
  if (!info) {
    return null;
  }
  const {status_int = undefined, date = undefined, status = undefined} =
    info || {};
  const comment = info.comment
    ? info.comment.replace(/(^.*?[.!?][\s])((?:|$))/, '$2')
    : undefined;
  return (
    <View style={styles.wrapper}>
      <View style={styles.animatedContainer}>
        {comment && (
          <Text
            style={[
              styles.comment,
              {marginBottom: !!status || !!date ? 10 : 0},
            ]}>
            {comment}
          </Text>
        )}
        <View style={styles.statusWrapper}>
          <>
            {status && (
              <IconText
                wrapperStyle={{marginRight: 16}}
                iconStyle={status_int == 2 && {transform: [{scale: 1.35}]}}
                color={statusColor(status_int)}
                icon={statusIcon(status_int)}
                value={status}
              />
            )}
            {date && (
              <IconText
                color={'grey'}
                icon={require('images/clock.png')}
                value={formatDate(date, 'DD.MM.YY HH:mm')}
              />
            )}
          </>
        </View>
      </View>
    </View>
  );
};

const RequestDocumentInfo = ({requestData, onEmployeePress}) => {
  const {
    author,
    type,
    number,
    name,
    description,
    coordinating,
    files,
    executor,
    status,
    type_int,
    dt_create: date,
  } = requestData || {};

  const {document_type_Letter_Number} = requestDocumentsTypes;

  return (
    <View style={commonStyles.common.flex1}>
      <ScrollView>
        <Divider title={locale.ru.main_info} />

        <TitledInfoRow
          icon={require('images/rows.png')}
          title={locale.ru.number}
          value={number}
        />
        <TitledInfoRow
          icon={require('images/rows.png')}
          title={locale.ru.category}
          value={type}
        />
        <TitledInfoRow
          icon={require('images/rows.png')}
          title={locale.ru.theme}
          value={name}
        />
        <TitledInfoRow
          icon={require('images/rows.png')}
          title={locale.ru.text}
          value={description}
        />
        <TitledInfoRow
          icon={require('images/rows.png')}
          title={locale.ru.status}
          value={status}
        />

        {type_int == document_type_Letter_Number ? (
          <EmployeePickButton
            onPress={() => onEmployeePress(author)}
            employeeData={author}
            title={locale.ru.task_initiator}
          />
        ) : (
          <>
            <Divider title={locale.ru.task_initiator} />
            <UserRow
              wrapperStyle={[commonStyles.common.listItem, styles.employee]}
              userData={author}
              onPress={() => onEmployeePress(author)}
            />
            {date && <ExtraInfo info={{date}} />}
          </>
        )}

        {type_int != document_type_Letter_Number && coordinating && (
          <>
            <Divider title={locale.ru.document_coordinating} />
            <UserRow
              wrapperStyle={[commonStyles.common.listItem, styles.employee]}
              userData={coordinating}
              onPress={() => onEmployeePress(coordinating)}
            />
            <ExtraInfo info={coordinating.information} />
          </>
        )}

        {type_int != document_type_Letter_Number && executor && (
          <>
            <Divider title={locale.ru.task_executors} />
            <UserRow
              wrapperStyle={[commonStyles.common.listItem, styles.employee]}
              userData={executor}
              onPress={() => onEmployeePress(executor)}
            />
            <ExtraInfo info={executor.information} />
          </>
        )}

        {Array.isArray(files) && files.length > 0 && (
          <ApprovingTaskPinnedDocsList
            // data={[{...files[0], file_name: files[0].name}]}
            data={files}
            downloadRoute={routes.kipFileDownload}
            filePrefix={ApprovingTaskPinnedDocsList.prefixes.requests}
            ListHeaderComponent={<Divider title={locale.ru.files} />}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  userRow: {
    flex: 1,
  },
  wrapper: {
    ...commonStyles.common.bottomBorder,
    paddingBottom: 10,
    backgroundColor: commonStyles.colors.white,
  },
  animatedContainer: {
    overflow: 'hidden',
    padding: 0,
    margin: 0,
  },
  comment: {
    ...commonStyles.texts.label,
    paddingLeft: 16 + 25 + 10,
    paddingRight: 16,
    marginBottom: 0,
    paddingBottom: 0,
  },
  statusWrapper: {
    flexDirection: 'row',
    paddingLeft: 16 + 25 + 10,
    paddingRight: 16,
    textAlign: 'justify',
    width: 'auto',
  },
  employee: {
    borderBottomWidth: 0,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 0,
  },
});

export default RequestDocumentInfo;
