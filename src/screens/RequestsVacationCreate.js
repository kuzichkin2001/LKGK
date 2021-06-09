import {action, computed, observable} from 'mobx';
import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import moment from 'moment';

import ScreenWrapper from '../components/ScreenWrapper';
import VacationRequestForm from '../forms/vacationRequestForm';

import inputTypes from '../forms/inputTypes';
import screensId from '../navigation/screensId';
import locale from 'locale';
import requests from '../network/requests';
import formatDate from '../utils/formatDate';
import {showMessage} from '../utils/showMessage';
import {
  HTTP_STATUS_UNPROCESSABLE_ENTITY,
  vacationRequestStatusEnum,
} from '../constants';
import {ActivityIndicator, View} from 'react-native';
import commonStyles from '../styles';

const DATE_YYY_MM_DD = 'YYYY-MM-DD';
const TIME_HH_MM = 'HH:mm';

@inject('navigationStore')
@observer
class RequestsVacationCreateScreen extends Component {
  static options() {
    return {
      id: screensId.REQUESTS_VACATION_CREATE,
      topBar: {
        visible: true,
      },
    };
  }

  /*
  request_type
  1: AbsencePersonal - Отсутствие по личным обстоятельствам
  2: AbsenceWorkers - Отсутствие по рабочим обстоятельствам
  3: VacationPaid - Ежегодный оплачиваемый отпуск
  4: VacationNotPaid - Отпуск без сохранения заработной платы
  */

  static vacation_type_Absence_Personal = 'AbsencePersonal';
  static vacation_type_Absence_Workers = 'AbsenceWorkers';
  static vacation_type_Vacation_Paid = 'VacationPaid';
  static vacation_type_Vacation_Not_Paid = 'VacationNotPaid';

  static vacationRequestTypes = {
    [this.vacation_type_Absence_Personal]: locale.ru.vacation_request_type1,
    [this.vacation_type_Absence_Workers]: locale.ru.vacation_request_type2,
    [this.vacation_type_Vacation_Paid]: locale.ru.vacation_request_type3,
    [this.vacation_type_Vacation_Not_Paid]: locale.ru.vacation_request_type4,
  };

  static getApiRequestType(value) {
    const apiRequestType = Object.keys(this.vacationRequestTypes).find(
      key => value === this.vacationRequestTypes[key],
    );
    return apiRequestType;
  }

  @observable
  submittingActivity = false;

  @observable
  vacationRequestsActivity = false;

  @observable
  vacationsLimit = {
    available: true,
    request_days: undefined,
    vacation_days: undefined,
  };

  @observable
  vacationRequestId;

  @computed
  get initialValues() {
    const {requestType} = this.props;
    this.vacationRequestId = this.props.initialData.id;
    const values = {};
    if (JSON.stringify(this.props.initialData) !== '{}') {
      const {initialData} = this.props;
      if (initialData && initialData.id) {
        values[inputTypes.vacationRequestType] = initialData.bp_type_alias;
        values[inputTypes.note] = initialData.note;
        if (initialData[inputTypes.dateIn]) {
          values[inputTypes.dateIn] = formatDate(
            initialData[inputTypes.dateIn],
            DATE_YYY_MM_DD,
          );
        }
        if (initialData[inputTypes.dateOut]) {
          values[inputTypes.dateOut] = formatDate(
            initialData[inputTypes.dateOut],
            DATE_YYY_MM_DD,
          );
        }
        if (initialData[inputTypes.timeIn]) {
          values[inputTypes.timeIn] = moment(
            initialData[inputTypes.timeIn],
            'H:m',
          ).toISOString();
        }
        if (initialData[inputTypes.timeOut]) {
          values[inputTypes.timeOut] = moment(
            initialData[inputTypes.timeOut],
            'H:m',
          ).toISOString();
        }
        if (initialData[inputTypes.dateAbsence]) {
          values[inputTypes.dateAbsence] = initialData[inputTypes.dateAbsence];
        }
        if (initialData[inputTypes.delegateUser]) {
          values[inputTypes.delegateUser] =
            initialData[inputTypes.delegateUser];
        }
      }
    } else {
      if (requestType !== undefined) {
        values[inputTypes.vacationRequestType] = requestType;
      }
    }
    return values;
  }

  @action
  handleSubmit = async values => {
    if (!this.isFormSubmitting) {
      try {
        this.isFormSubmitting = true;
        const request_type = values[inputTypes.vacationRequestType];
        const requestData = {
          request_type,
        };
        if (
          request_type ===
            RequestsVacationCreateScreen.vacation_type_Absence_Workers ||
          request_type ===
            RequestsVacationCreateScreen.vacation_type_Absence_Personal
        ) {
          requestData[inputTypes.note] = values[inputTypes.note];
          requestData[inputTypes.dateAbsence] = formatDate(
            values[inputTypes.dateAbsence],
            DATE_YYY_MM_DD,
          );
          // HH:mm - hours must be with leading zero
          requestData[inputTypes.timeIn] = formatDate(
            values[inputTypes.timeIn],
            TIME_HH_MM,
          );
          requestData[inputTypes.timeOut] = formatDate(
            values[inputTypes.timeOut],
            TIME_HH_MM,
          );
        } else {
          requestData[inputTypes.dateIn] = formatDate(
            values[inputTypes.dateIn],
            DATE_YYY_MM_DD,
          );
          requestData[inputTypes.dateOut] = formatDate(
            values[inputTypes.dateOut],
            DATE_YYY_MM_DD,
          );
          requestData[inputTypes.delegateUser] =
            values[inputTypes.delegateUser].id_phperson;
        }
        requestData.status = values.status;
        let response;
        if (this.vacationRequestId) {
          response = await requests.vacationRequestEdit(
            this.vacationRequestId,
            requestData,
          );
        } else {
          response = await requests.vacationCreate(requestData);
        }
        if (response.data.result) {
          if (values.status === vacationRequestStatusEnum.DRAFT) {
            // save request ID
            this.vacationRequestId =
              response.data.data.id || this.vacationRequestId;
          } else {
            this.vacationRequestId = undefined;
            if (this.props.successCreateCallback) {
              this.props.successCreateCallback();
            } else {
              this.props.navigationStore.popScreen();
            }
          }
        }

        this.isFormSubmitting = false;
      } catch (e) {
        this.isFormSubmitting = false;
        console.log(e.response || e);
        if (e && e.response && e.response.data) {
          const {response} = e;
          const {data} = response;
          if (
            data.error &&
            response.status === HTTP_STATUS_UNPROCESSABLE_ENTITY
          ) {
            showMessage(locale.ru.error, data.error);
          } else {
            showMessage(locale.ru.error, locale.request_create_error);
          }
        } else {
          showMessage(locale.ru.error, locale.request_create_error);
        }
      }
    }
  };

  getVariantFromPicker = async pickerData => {
    return await new Promise(resolve => {
      this.props.navigationStore.pushScreen(screensId.VARIANTS_PICKER, {
        successCallback: pickedVariant => {
          resolve(pickedVariant);
        },
        pickerData,
      });
    });
  };

  handleEmployeePick = async () => {
    const {navigationStore} = this.props;
    return await new Promise(resolve => {
      navigationStore.pushScreen(
        screensId.CATALOG_EMPLOYEES,
        {
          onEmployeePress: employeeData => {
            resolve(employeeData);
            if (employeeData) {
              navigationStore.popScreen();
            }
          },
        },
        {
          topBar: {
            title: {
              text: locale.ru.select_employee,
            },
          },
        },
      );
    });
  };

  @action
  getVacationsLimit = async () => {
    if (!this.vacationRequestsActivity) {
      try {
        this.vacationRequestsActivity = true;
        const response = await requests.vacationsLimit();
        if (response.data && response.data.result) {
          this.vacationsLimit = response.data.data;
          if (response.data.data.available === false) {
            showMessage(locale.ru.warning, locale.ru.vacation_limit_exceed);
          }
        } else {
          showMessage(locale.ru.error, locale.ru.couldnt_load_vacations_limit);
        }
      } catch (e) {
        this.vacationRequestsActivity = false;
        showMessage(locale.ru.error, locale.ru.error_network);
        console.log(e);
        console.log(e.response);
      }
      this.vacationRequestsActivity = false;
    }
  };

  componentDidMount() {
    if (
      this.props.requestType ===
      RequestsVacationCreateScreen.vacation_type_Vacation_Paid
    ) {
      this.getVacationsLimit();
    }
  }

  render() {
    const {requestType} = this.props;
    return (
      <ScreenWrapper>
        {this.vacationRequestsActivity ? (
          <View style={commonStyles.activityIndicator}>
            <ActivityIndicator
              color={commonStyles.colors.label}
              size={'large'}
            />
          </View>
        ) : (
          <VacationRequestForm
            onEmployeePick={this.handleEmployeePick}
            isSubmitting={this.submittingActivity}
            initialValues={this.initialValues}
            onSubmit={this.handleSubmit}
            requestType={requestType}
            vacationsLimit={this.vacationsLimit}
          />
        )}
      </ScreenWrapper>
    );
  }
}

export default RequestsVacationCreateScreen;
