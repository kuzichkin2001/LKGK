import * as yup from 'yup';

import locale from 'locale';

export default {
  passRequestVisitorName: yup
    .string()
    .trim()
    .required(locale.ru.visitor_name_required),
  passRequestVisitorPhone: yup.string().trim(),
  office: yup.string().required(locale.ru.office_required),
  date: yup.string().required(locale.ru.date_required),
  comment: yup
    .string()
    .trim()
    .required(locale.ru.comment_required),
  trim: yup.string().trim(),
  supportRequestType: yup
    .string()
    .trim()
    .required(locale.ru.support_request_type_required),
  vacationRequestType: yup
    .string()
    .trim()
    .required(locale.ru.vacation_request_type_required),
  vacationInitiator: yup
    .mixed()
    .required(locale.ru.vacation_initiator_required),
  delegateUser: yup.mixed().required(locale.ru.vacation_delegate_required),
  taskTheme: yup
    .string()
    .trim()
    .required(locale.ru.task_theme_required),
  taskNote: yup
    .string()
    .trim()
    .required(locale.ru.task_note_required),
  taskDateStart: yup.mixed().required(locale.ru.task_date_start_required),
  taskDateEnd: yup.mixed().required(locale.ru.task_date_end_required),
  taskExecutor: yup.mixed().required(locale.ru.task_executor_required),
  taskStatus: yup
    .string()
    .trim()
    .required(locale.ru.status_required),
  taskDatePeriod: yup.mixed().required(locale.ru.task_period_required),
  delegationPeriod: yup.mixed().required(locale.ru.delegation_period_required),
  delegationExecutor: yup
    .mixed()
    .required(locale.ru.delegation_executor_required),
  documentTheme: yup
    .string()
    .trim()
    .required(locale.ru.document_theme_required),
  documentText: yup
    .string()
    .trim()
    .required(locale.ru.document_text_required),
  documentCoordinating: yup
    .mixed()
    .required(locale.ru.document_coordinating_required),
  fullName: yup
    .string()
    .trim()
    .required(locale.ru.fullName_required),
  file: yup.object().required(locale.ru.upload_file_not_selected),
};
