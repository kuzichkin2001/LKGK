import axios from 'axios';
import firebase from 'react-native-firebase';
import publicIP from 'react-native-public-ip';

import inputTypes from '../forms/inputTypes';
import routes from './routes';

const login = async data => {
  console.log('login request: ' + data);
  let ip;
  try {
    ip = await publicIP();
    console.log('IP detected ', ip);
  } catch (error) {
    console.log("couldn't detect your IP");
    console.log(error);
  }
  const fcmToken = await firebase.messaging().getToken();
  console.log('fcmToken: ' + fcmToken);
  return await axios.post(routes.login, {
    email: data[inputTypes.email],
    pin_code: data[inputTypes.password],
    id_device: fcmToken,
    device_ip_address: ip,
  });
};

const tokenRefresh = async refreshToken => {
  console.log('refresh token request: ' + refreshToken);
  return await axios.post(routes.tokenRefresh, {
    refresh_token: refreshToken,
  });
};

const logout = async () => {
  console.log('logout request');
  const fcmToken = await firebase.messaging().getToken();
  return await axios.post(routes.logout, {
    device_id: fcmToken,
  });
};

const userData = async () => {
  console.log('user data request');
  return await axios.post(routes.userInfo);
};

const userProfile = async () => {
  console.log('user profile request');
  return await axios.get(routes.profile);
};

const visitsStatistic = async (previous = null) => {
  console.log('visits statistic request: ' + previous);
  return await axios.get(routes.visitsStatistic, {
    params: {
      previous,
    },
  });
};

const catalogEmployees = async (
  search = null,
  nextPage,
  unitId,
  isSubordinate,
) => {
  console.log('catalog employees request' + search);
  const filter = isSubordinate ? '?my=1' : unitId ? `?dep=${unitId}` : '';
  return await axios.get(`${routes.catalogEmployees}${filter}`, {
    params: {
      search: search,
      page: nextPage,
    },
  });
};

const catalogEmployeesVisitsStatistic = async (tabNumber, previous) => {
  console.log(
    `catalog employee visits statistic requested, id: ${tabNumber},  prev mark: ${previous}`,
  );
  return await axios.get(`${routes.catalogEmployees}/${tabNumber}/visits`, {
    params: {
      previous,
    },
  });
};

const catalogEmployeeData = async tabNumber => {
  console.log('catalog employee info request: ' + tabNumber);
  return await axios.get(`${routes.catalogEmployees}/${tabNumber}`);
};

const approvalsList = async page => {
  console.log('approvals list request');
  return await axios.get(`${routes.approvalsCabinet}?page=${page}`);
};

const approvingTaskInfo = async taskId => {
  console.log('approving task info request');
  return await axios.get(`${routes.approvalsCabinet}/${taskId}`);
};

const approvingTaskDecision = async (taskData, submitData) => {
  return await axios.post(
    `${routes.approvalsCabinet}/${taskData.id}`,
    submitData,
  );
};

const news = async page => {
  console.log('news request');
  return await axios.get(`${routes.news}?page=${page}`);
};

const newsInfo = async newsId => {
  console.log('news info request, id: ' + newsId);
  return await axios.get(`${routes.news}/${newsId}`);
};

const refsInfo = async page => {
  return await axios.get(`${routes.info}?page=${page}`);
};

const refsInfoItem = async refInfoId => {
  return await axios.get(`${routes.info}/${refInfoId}`);
};

const activeSessions = async () => {
  console.log('active sessions request');
  return await axios.get(routes.activeSessions);
};

const activeSessionDelete = async sessionId => {
  console.log('active session delete');
  return await axios.delete(`${routes.activeSessionDelete}/${sessionId}`);
};

const activeSessionsClear = async () => {
  console.log('active sessions clear');
  return await axios.post(routes.activeSessionsClear);
};

const badges = async () => {
  console.log('badges request');
  return await axios.get(routes.badges);
};

const passRequestsList = async page => {
  console.log(`pass requests, page: ${page}`);
  return await axios.get(routes.pass_requests, {
    params: {
      page: page,
    },
  });
};

const passRequestsInfo = async id =>
  await axios.get(`${routes.pass_requests}/${id}`);

const passRequestCreate = async data =>
  await axios.post(routes.pass_requests_create, data);

const documentsRequestsList = async type => {
  return await axios.get(routes.documents_requests, {
    params: {
      type,
    },
  });
};

const documentRequestsInfo = async id =>
  await axios.get(routes.document_requests_info(id));

const officesList = async () => {
  console.log('offices list request');
  return await axios.get(routes.offices_list);
};

const supportRequests = async (page, requestType) => {
  console.log('supports request');
  return await axios.get(routes.support_requests, {
    params: {
      page,
      type_request: requestType,
    },
  });
};

const documentRequestCreate = async data => {
  const form = new FormData();
  Object.keys(data).forEach(key => {
    if (data.hasOwnProperty(key)) {
      if (key !== 'file') {
        form.append(key, data[key]);
      }
    }
  });
  if (data.file && data.file.name) {
    form.append('file', data.file);
  }
  return await axios.post(routes.document_requests_create, form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const supportRequestCreate = async data => {
  const form = new FormData();
  form.append('comment', data[inputTypes.comment]);
  form.append('type_request', data[inputTypes.supportRequestType]);
  if (data.file && data.file.name) {
    form.append('file', data.file);
  }
  return await axios.post(routes.support_requests, form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const supportRequestInfo = async id => {
  console.log('support request info');
  return await axios.get(`${routes.support_requests}/${id}`);
};

const tasks = async type => {
  console.log('tasks lists request');
  return await axios.get(`${routes.tasks}/${type}`);
};

const diary = async (dt, id_phperson) => {
  return await axios.get(`${routes.diary}`, {
    params: {
      dt,
      id_phperson,
    },
  });
};

const taskInfo = async taskId => {
  console.log('task info request');
  return await axios.get(`${routes.tasks}/${taskId}`);
};

const taskCreate = async taskData => {
  return await axios.post(routes.taskCreate, taskData);
};

const taskChangeStatus = async (taskId, status) => {
  return await axios.post(routes.taskChangeStatus(taskId), {
    status,
  });
};

const taskAddComment = async (taskId, comment) => {
  return await axios.post(routes.taskAddComment(taskId), {
    comment,
  });
};

const taskAddAttachment = async (kip_id, comment_id, file) => {
  return await axios.post(routes.taskAddAttachment, {
    kip_id,
    comment_id,
    file,
  });
};

const tableReports = async () => {
  return await axios.get(routes.tableReports);
};

const tableReportUrl = async id => {
  return await axios.get(`${routes.tableReports}/${id}`);
};

const delegations = async (page, toMe) => {
  return await axios.get(routes.delegations, {
    params: {
      page,
      to_me: toMe ? 1 : 0,
    },
  });
};

const delegationData = async id => {
  return await axios.get(`${routes.delegations}/${id}`);
};

const setDelegationActiveStatus = async (id, status) => {
  return await axios.post(`${routes.delegations}/${id}`, {
    is_active: status ? 1 : 0,
  });
};

const createDelegation = async requestData => {
  return await axios.post(routes.delegations, requestData);
};

const vacationRequestsByType = async type => {
  return await axios.get(routes.vacationsByType(type));
};

const vacationRequests = async request_type => {
  return await axios.get(routes.vacations, {
    params: {
      request_type,
    },
  });
};

const vacationRequest = async id => {
  return await axios.get(`${routes.vacations}/${id}`);
};

const vacationCreate = async data => {
  return await axios.post(routes.vacations, data);
};

const vacationsLimit = async () => {
  return await axios.get(routes.vacationsLimit);
};

const vacationRequestEdit = async (id, data) => {
  return await axios.post(`${routes.vacationEdit(id)}`, data);
};

const checkSubscriptionUserEnterOffice = async id => {
  return await axios.get(routes.subscriptionCheck(id));
};

const switchSubscriptionUserEnterOffice = async (id, value) => {
  return await axios.post(
    value
      ? routes.subscriptionSubscribe(id)
      : routes.subscriptionUnsubscribe(id),
  );
};

const settingsNotifications = async () => {
  return await axios.get(routes.settingsNotifications);
};

const settingsNotificationsSave = async settings => {
  return await axios.post(routes.settingsNotificationsSave, settings);
};

const inquiriesList = async type => await axios.get(routes.inquiriesList(type));

const inquiryData = async (type, id) =>
  await axios.get(routes.inquiryData(type, id));

const inquiryCreate = async (type, values) => {
  return await axios.post(routes.inquiryCreate(type), values, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default {
  login,
  tokenRefresh,
  logout,
  userData,
  userProfile,
  visitsStatistic,
  catalogEmployees,
  catalogEmployeeData,
  approvalsList,
  approvingTaskInfo,
  approvingTaskDecision,
  news,
  newsInfo,
  refsInfo,
  refsInfoItem,
  activeSessions,
  activeSessionsClear,
  activeSessionDelete,
  badges,
  passRequestsList,
  passRequestsInfo,
  passRequestCreate,
  documentsRequestsList,
  documentRequestsInfo,
  officesList,
  catalogEmployeesVisitsStatistic,
  supportRequests,
  supportRequestCreate,
  supportRequestInfo,
  documentRequestCreate,
  tasks,
  diary,
  taskInfo,
  taskCreate,
  taskChangeStatus,
  taskAddComment,
  taskAddAttachment,
  tableReports,
  tableReportUrl,
  delegations,
  delegationData,
  setDelegationActiveStatus,
  createDelegation,
  vacationsLimit,
  vacationRequestsByType,
  vacationRequestEdit,
  vacationRequests,
  vacationRequest,
  vacationCreate,
  checkSubscriptionUserEnterOffice,
  switchSubscriptionUserEnterOffice,
  settingsNotifications,
  settingsNotificationsSave,
  inquiriesList,
  inquiryData,
  inquiryCreate,
};
