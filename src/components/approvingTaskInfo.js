import React, {useState} from 'react';
import {ScrollView, StyleSheet, View, TouchableOpacity} from 'react-native';

import formatDate from '../utils/formatDate';
import locale from 'locale';
import commonStyles from 'styles';
import routes from '../network/routes';

import ApprovingTaskPinnedDocsList from './lists/approvingTaskPinnedDocsList';
import MultipleSubmitButtons from './multipleSubmitButtons';
import ApprovingTaskRelatedList from './lists/approvingTaskRelatedList';
import TitledInfoRow from './titledInfoRow';
import UserRow from './userRow';
import Divider from './divider';
import {DOC_TYPE_MEMORANDUM, tasksBase} from '../constants';
import IconInfoRow from './iconInfoRow';
import Remark from './remark';

const MNThisFundingLookup = MN_this_funding => {
  switch (MN_this_funding) {
    case 'true':
      return locale.ru.true_yes;
    case 'false':
      return locale.ru.false_no;
    default:
      return MN_this_funding;
  }
};

const AccountingAnalyticsBlock = ({
  data: {
    str_number,
    movement_state,
    analytics_1,
    analytics_2,
    analytics_3,
    view_analytics_1,
    view_analytics_2,
    view_analytics_3,
    sum,
    MN_this_funding,
    rate_NDS,
    sum_NDS,
  },
}) => (
  <>
    <TitledInfoRow
      title={locale.ru.accounting_analytics.str_number}
      value={str_number}
    />
    <TitledInfoRow
      title={locale.ru.accounting_analytics.movement_state}
      value={movement_state}
    />
    <TitledInfoRow
      title={locale.ru.accounting_analytics.analytics_1}
      value={analytics_1}
    />
    <TitledInfoRow
      title={locale.ru.accounting_analytics.analytics_2}
      value={analytics_2}
    />
    <TitledInfoRow
      title={locale.ru.accounting_analytics.analytics_3}
      value={analytics_3}
    />
    <TitledInfoRow
      title={locale.ru.accounting_analytics.view_analytics_1}
      value={view_analytics_1}
    />
    <TitledInfoRow
      title={locale.ru.accounting_analytics.view_analytics_2}
      value={view_analytics_2}
    />
    <TitledInfoRow
      title={locale.ru.accounting_analytics.view_analytics_3}
      value={view_analytics_3}
    />
    <TitledInfoRow title={locale.ru.accounting_analytics.sum} value={sum} />
    <TitledInfoRow
      title={locale.ru.accounting_analytics.MN_this_funding}
      value={MNThisFundingLookup(MN_this_funding)}
    />
    <TitledInfoRow
      title={locale.ru.accounting_analytics.rate_NDS}
      value={rate_NDS}
    />
    <TitledInfoRow
      title={locale.ru.accounting_analytics.sum_NDS}
      value={sum_NDS}
    />
  </>
);

const OperationMovementBlock = ({data: {accounting_analytics}}) => (
  <>
    {accounting_analytics.map(accounting_analytic_entry => (
      <AccountingAnalyticsBlock
        data={accounting_analytic_entry}
        key={accounting_analytic_entry.str_number}
      />
    ))}
  </>
);

const ApprovingTaskInfo = ({
  taskData,
  onDecisionPress,
  onInitiatorPress,
  onEmployeePress,
  onFactExecutorPress,
}) => {
  const [operationMovementOpacity, setOperationMovementOpacity] = useState(
    false,
  );
  const toggleOperationMovementOpacity = () =>
    setOperationMovementOpacity(!operationMovementOpacity);

  if (!taskData) {
    return null;
  }
  const {
    name,
    created_at,
    initiator,
    doc_info,
    doc_text,
    related_tasks,
    actions,
    status,
    base,
    fact_executor,
    type_doc,
    type_doc_int = 0,
  } = taskData;
  const {
    cost,
    organization,
    partner,
    files,
    theme,
    project,
    executor,
    fact_executor: fact_executor_doc_info,
  } = doc_info || {};

  return (
    <View style={commonStyles.common.flex1}>
      <ScrollView>
        <Divider title={locale.ru.information} />

        {base === tasksBase.DOC_FLOW ? (
          <TitledInfoRow
            icon={require('images/rows.png')}
            title={locale.ru.task_name}
            value={name}
          />
        ) : (
          <TitledInfoRow title={locale.ru.document_theme} value={theme} />
        )}

        {base === tasksBase.DOC_HOLDING_MANAGEMENT && (
          <TitledInfoRow
            title={locale.ru.operation_type}
            value={doc_info.operation_type}
          />
        )}

        {base === tasksBase.DOC_FLOW && (
          <TitledInfoRow
            icon={require('images/date.png')}
            title={locale.ru.created_at}
            value={formatDate(created_at, 'DD.MM.YYYY')}
          />
        )}

        <TitledInfoRow
          removeBottomOffset={true}
          icon={require('images/rows.png')}
          title={locale.ru.legal_org}
          value={organization}
        />
        <TitledInfoRow
          icon={require('images/rows.png')}
          title={locale.ru.contractor}
          value={partner}
        />
        <TitledInfoRow
          icon={require('images/rows.png')}
          title={locale.ru.sum}
          value={cost}
          valueStyle={styles.highlightedValue}
        />
        {!!initiator && base === tasksBase.DOC_FLOW && (
          <>
            <Divider title={locale.ru.task_initiator} />
            <UserRow
              showArrow={true}
              onPress={onInitiatorPress}
              wrapperStyle={styles.userRow}
              userData={initiator}
            />
          </>
        )}
        {(!!fact_executor || !!fact_executor_doc_info) && (
          <>
            <Divider title={locale.ru.task_executor} />
            <UserRow
              showArrow={true}
              onPress={onFactExecutorPress}
              wrapperStyle={styles.userRow}
              userData={fact_executor || fact_executor_doc_info}
            />
          </>
        )}

        {doc_text && (
          <>
            <Divider title={'Описание'} />
            <IconInfoRow title={`\t\t\t\t\t${doc_text}`} />
          </>
        )}

        {base === tasksBase.DOC_HOLDING_MANAGEMENT && (
          <>
            <TitledInfoRow title={locale.ru.purpose} value={doc_info.purpose} />
            <TitledInfoRow
              title={locale.ru.contract}
              value={doc_info.contract}
            />
            <TitledInfoRow
              title={locale.ru.financial_responsibility_center}
              value={doc_info.financial_responsibility_center}
            />
            <TitledInfoRow title={locale.ru.project} value={project} />
            <TitledInfoRow
              icon={require('images/date.png')}
              title={locale.ru.date}
              value={formatDate(doc_info.date, 'DD.MM.YYYY')}
            />
            <TitledInfoRow title={locale.ru.number} value={doc_info.number} />
            <TitledInfoRow
              icon={require('images/people.png')}
              title={locale.ru.executor}
              value={executor}
            />
            <TitledInfoRow
              icon={require('images/date.png')}
              title={locale.ru.payment_date}
              value={formatDate(doc_info.payment_date, 'DD.MM.YYYY')}
            />
            <TitledInfoRow
              title={locale.ru.document_currency}
              value={doc_info.document_currency}
            />
            <TitledInfoRow
              title={locale.ru.budget_period}
              value={doc_info.operation_movement.budget_period}
            />
            <TitledInfoRow
              icon={require('images/date.png')}
              title={locale.ru.created_at}
              value={formatDate(created_at, 'DD.MM.YYYY')}
            />
          </>
        )}

        {!!files && !!files.length && (
          <>
            <ApprovingTaskPinnedDocsList
              contentContainerStyle={styles.pinnedDocsWrapper}
              downloadRoute={
                tasksBase.DOC_FLOW
                  ? routes.approvalsCabinetDownload
                  : routes.approvalsCabinetDownloadTypeYX
              }
              filePrefix={ApprovingTaskPinnedDocsList.prefixes.approvalTask}
              ListHeaderComponent={<Divider title={locale.ru.files} />}
              data={files}
            />
            {type_doc_int === 2 && (
              <Remark
                text={`${locale.ru.save_file_to_device_head}${
                  actions[0].caption
                }${locale.ru.save_file_to_device_tail}`}
              />
            )}
          </>
        )}

        {base === tasksBase.DOC_HOLDING_MANAGEMENT && (
          <>
            <TouchableOpacity onPress={toggleOperationMovementOpacity}>
              <Divider
                icon={require('images/arrow-down.png')}
                title={locale.ru.operation_movement}
                style={{justifyContent: 'flex-start'}}
                iconStyle={[
                  styles.iconStyle,
                  {
                    transform: operationMovementOpacity
                      ? [{rotate: '180deg'}]
                      : [],
                  },
                ]}
              />
            </TouchableOpacity>
            {operationMovementOpacity && (
              <OperationMovementBlock data={doc_info.operation_movement} />
            )}
          </>
        )}
        {related_tasks && related_tasks.length > 0 && (
          <ApprovingTaskRelatedList
            onPress={onEmployeePress}
            ListHeaderComponent={
              <Divider
                title={
                  type_doc == DOC_TYPE_MEMORANDUM
                    ? locale.ru.resolution
                    : locale.ru.related_tasks
                }
              />
            }
            data={related_tasks}
          />
        )}
      </ScrollView>
      {status == '0' && (
        <MultipleSubmitButtons onPress={onDecisionPress} buttons={actions} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  userRow: {
    ...commonStyles.common.bottomBorder,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: commonStyles.colors.white,
  },
  pinnedDocsWrapper: {
    backgroundColor: commonStyles.colors.white,
  },
  highlightedValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconStyle: {
    height: 24,
    width: 24,
    marginRight: 11,
  },
});

export default ApprovingTaskInfo;
