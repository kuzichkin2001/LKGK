import React from 'react';
import {View, StyleSheet} from 'react-native';

import commonStyles from 'styles';
import locale from 'locale';
import formatDate from '../../utils/formatDate';

import MainInput from '../inputs/MainInput';

const mainTextInputConfig = {
  isBottomBorderHidden: true,
  multiline: true,
  wrapperStyle: commonStyles.common.paddingTopOffset,
  editable: false,
};

const ApprovalTaskInfoVisitorListItem = ({data}) => (
  <View style={styles.wrapper}>
    <MainInput
      {...mainTextInputConfig}
      isHidden={!data.visit_point}
      value={data.visit_point}
      title={locale.ru.pass_request_type}
    />
    <MainInput
      {...mainTextInputConfig}
      isHidden={!data.start_date || !data.end_date}
      value={`${locale.ru.from} ${formatDate(data.start_date, 'DD.MM.YY')} ${
        locale.ru.to
      } ${formatDate(data.end_date, 'DD.MM.YY')}`}
      title={locale.ru.available_period}
    />
    <MainInput
      {...mainTextInputConfig}
      isHidden={!data.to_employee}
      value={data.to_employee}
      title={locale.ru.meeting_visitor_employee_name}
    />
    <MainInput
      {...mainTextInputConfig}
      isHidden={!data.visitor}
      value={data.visitor}
      title={locale.ru.visitor_name}
    />
    <MainInput
      {...mainTextInputConfig}
      isHidden={!data.comment}
      value={data.comment}
      title={locale.ru.comment}
    />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 0.7,
    borderBottomColor: commonStyles.colors.lightBlue,
    paddingBottom: commonStyles.spaces.m,
  },
});

export default ApprovalTaskInfoVisitorListItem;
