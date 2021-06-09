import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import {action, computed, observable} from 'mobx';

import locale from 'locale';
import inputTypes from './inputTypes';
import schemas from './schemas';
import styles from '../styles/common';

import FormSpaceBetween from '../components/formSpaceBetween';
import MainInput from '../components/inputs/MainInput';
import LargeSubmitButton from '../components/buttons/largeSubmitButton';
import formatDate from '../utils/formatDate';
import DatePicker from '../components/datepicker';
import TimePicker from '../components/timepicker';
import RequestsVacationCreateScreen from '../screens/RequestsVacationCreate';
import EmployeePickButton from '../components/buttons/employeePickButton';
import {isRequestTypeAbsence, isRequestTypeVacation} from '../utils/vacations';
import TitledInfoRow from '../components/titledInfoRow';
import {showMessage} from '../utils/showMessage';
import {vacationRequestStatusEnum} from '../constants';

// amount of days before selected date of paid vacation start
const DAYS_REQUIRED_TILL_PAID_VACATION_START = 7;

class VacationRequestForm extends Component {
  formikRef = null;
  datePickerAbsenceRef = null;
  datePickerInRef = null;
  datePickerOutRef = null;
  timePickerInRef = null;
  timePickerOutRef = null;

  @observable
  requestType = this.props.requestType;

  @observable
  dateIn = null;

  @observable
  dateOut = null;

  calculateMinimumDate(isDateOut = false) {
    if (this.dateIn && isDateOut) {
      return this.dateIn;
    }
    if (
      this.requestType ===
      RequestsVacationCreateScreen.vacation_type_Vacation_Paid
    ) {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    }
    return new Date();
  }

  calculateDaysDiff(dateStart, dateEnd) {
    return moment(moment(dateEnd).startOf('day')).diff(
      moment(dateStart).startOf('day'),
      'days',
    );
  }

  @computed
  get vacationDaysAmount() {
    const startDate =
      this.dateIn ||
      this.props.initialValues[inputTypes.dateIn] ||
      this.calculateMinimumDate();
    const endDate =
      this.dateOut ||
      this.props.initialValues[inputTypes.dateOut] ||
      this.calculateMinimumDate(true);
    if (!startDate) {
      return locale.ru.vacation_date_in_not_selected;
    }
    if (!endDate) {
      return locale.ru.vacation_date_out_not_selected;
    }
    if (moment(endDate).isBefore(moment(startDate))) {
      return 'Дата начала не может быть позже даты окончания отпуска';
    }
    const daysAmount = 1 + this.calculateDaysDiff(startDate, endDate);
    return daysAmount;
  }

  @computed
  get daysExceeded() {
    return this.vacationDaysAmount - this.props.vacationsLimit.vacation_days;
  }

  @action
  handleVacationTypeChange = async () => {
    try {
      const pickedType = await this.props.onVacationTypePress();
      if (pickedType) {
        const pickedRequestType = RequestsVacationCreateScreen.getApiRequestType(
          pickedType,
        );
        if (pickedRequestType != this.requestType) {
          this.requestType = pickedRequestType;
          this.formikRef.resetForm();
          this.formikRef.setFieldValue(
            inputTypes.vacationRequestType,
            pickedRequestType,
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleDelegateUserPick = async () => {
    const {onEmployeePick} = this.props;
    const pickedEmployee = await onEmployeePick();
    if (pickedEmployee) {
      this.formikRef.setFieldValue(inputTypes.delegateUser, pickedEmployee);
    }
  };

  handleDateAbsence = async () => {
    try {
      const date = await this.datePickerAbsenceRef.pickDate();
      if (date) {
        this.formikRef.setFieldValue(inputTypes.dateAbsence, date);
      }
    } catch (e) {
      console.log(e);
    }
  };

  getMinimumDaysTillMessage(isStart = true) {
    return `Возможная дата ${
      isStart ? 'начала' : 'завершения'
    } отпуска должна быть не ранее чем через ${DAYS_REQUIRED_TILL_PAID_VACATION_START} дней`;
  }

  @action
  handleDateIn = async () => {
    try {
      const date = await this.datePickerInRef.pickDate(
        this.calculateMinimumDate(),
      );
      if (date) {
        if (
          this.requestType ===
            RequestsVacationCreateScreen.vacation_type_Vacation_Paid &&
          this.calculateDaysDiff(Date.now(), date) <
            DAYS_REQUIRED_TILL_PAID_VACATION_START
        ) {
          showMessage(locale.ru.error, this.getMinimumDaysTillMessage());
          return;
        }
        this.dateIn = date;
        this.formikRef.setFieldValue(inputTypes.dateIn, date);
      }
    } catch (e) {
      console.log(e);
    }
  };

  @action
  handleDateOut = async () => {
    try {
      const date = await this.datePickerOutRef.pickDate();
      if (date) {
        if (moment(date).isBefore(moment(this.dateIn))) {
          showMessage(locale.ru.vacation_date_out_early_date_in);
          return;
        }
        this.dateOut = date;
        this.formikRef.setFieldValue(inputTypes.dateOut, date);
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleTimeIn = async () => {
    try {
      const time = await this.timePickerInRef.pickDate();
      if (time) {
        this.formikRef.setFieldValue(inputTypes.timeIn, time);
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleTimeOut = async () => {
    try {
      const time = await this.timePickerOutRef.pickDate();
      if (time) {
        this.formikRef.setFieldValue(inputTypes.timeOut, time);
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const {
      onSubmit,
      initialValues,
      isSubmitting,
      vacationsLimit: {vacation_days},
      requestType,
    } = this.props;
    return (
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        ref={ref => (this.formikRef = ref)}
        initialValues={{
          ...initialValues,
          [inputTypes.dateIn]:
            initialValues[inputTypes.dateIn] || this.calculateMinimumDate(),
          [inputTypes.dateOut]:
            initialValues[inputTypes.dateOut] ||
            this.calculateMinimumDate(true),
        }}
        validationSchema={yup.object().shape({
          [inputTypes.vacationRequestType]: schemas.vacationRequestType,
          [inputTypes.delegateUser]: isRequestTypeVacation(requestType)
            ? schemas.delegateUser
            : null,
        })}
        onSubmit={(values, actions) => {
          let errors = {};
          if (isRequestTypeAbsence(values.vacationRequestType)) {
            // absence type
            if (
              !values[inputTypes.note] ||
              values[inputTypes.note].trim() === ''
            ) {
              errors = {...errors, note: locale.ru.task_note_required};
            }
            if (!values[inputTypes.dateAbsence]) {
              errors = {
                ...errors,
                [inputTypes.dateAbsence]: locale.ru.date_required,
              };
            }
            if (!values[inputTypes.timeIn]) {
              errors = {
                ...errors,
                [inputTypes.timeIn]: locale.ru.time_required,
              };
            }
            if (!values[inputTypes.timeOut]) {
              errors = {
                ...errors,
                [inputTypes.timeOut]: locale.ru.time_required,
              };
            }
          } else if (isRequestTypeVacation(values.vacationRequestType)) {
            // vacation type
            if (!values[inputTypes.dateIn]) {
              errors = {
                ...errors,
                [inputTypes.dateIn]: locale.ru.date_required,
              };
            }
            if (!values[inputTypes.dateOut]) {
              errors = {
                ...errors,
                [inputTypes.dateOut]: locale.ru.date_required,
              };
            }
            if (values[inputTypes.dateIn] > values[inputTypes.dateOut]) {
              errors = {
                ...errors,
                [inputTypes.dateOut]: locale.ru.dateOut_smaller_dateIn,
              };
            }
            if (
              this.requestType ===
              RequestsVacationCreateScreen.vacation_type_Vacation_Paid
            ) {
              const {request_days, vacation_days} = this.props.vacationsLimit;
              if (vacation_days < request_days + this.vacationDaysAmount) {
                showMessage(
                  locale.ru.warning,
                  `Количество запрашиваемых дней отпуска превышает доступное количество на ${request_days +
                    this.vacationDaysAmount -
                    vacation_days} дня(ей)`,
                );
              }
            }
          }
          actions.setErrors(errors);
          values.status = vacationRequestStatusEnum.EXECUTE;
          if (JSON.stringify(errors) == '{}') {
            onSubmit(values);
          }
        }}>
        {formik => (
          <FormSpaceBetween
            Top={
              <>
                <MainInput
                  icon={require('images/rows.png')}
                  title={locale.ru.vacation_request_type}
                  placeholder={locale.ru.select_vacation_request_type}
                  multiline={true}
                  error={formik.errors[inputTypes.vacationRequestType]}
                  value={
                    RequestsVacationCreateScreen.vacationRequestTypes[
                      formik.values[inputTypes.vacationRequestType]
                    ]
                  }
                  isHidden={true}
                  editable={false}
                  showArrow={true}
                />
                {/* ABSENCE */}
                {isRequestTypeAbsence(
                  formik.values[inputTypes.vacationRequestType],
                ) && (
                  <>
                    <MainInput
                      icon={require('images/rows.png')}
                      multiline={true}
                      placeholder={locale.ru.enter_your_rationale}
                      onChangeText={formik.handleChange(inputTypes.note)}
                      error={formik.errors[inputTypes.note]}
                      value={formik.values[inputTypes.note]}
                      title={locale.ru.rationale}
                    />
                    <MainInput
                      showArrow={true}
                      editable={false}
                      icon={require('images/date.png')}
                      title={locale.ru.date_absence}
                      placeholder={locale.ru.select_date}
                      error={formik.errors[inputTypes.dateAbsence]}
                      value={
                        formik.values[inputTypes.dateAbsence]
                          ? formatDate(
                              formik.values[inputTypes.dateAbsence],
                              'DD.MM.YY',
                            )
                          : ''
                      }
                      onPress={this.handleDateAbsence}
                    />

                    <MainInput
                      showArrow={true}
                      editable={false}
                      icon={require('images/clock.png')}
                      title={locale.ru.vacation_time_in}
                      placeholder={locale.ru.select_time}
                      error={formik.errors[inputTypes.timeIn]}
                      value={
                        formik.values[inputTypes.timeIn]
                          ? formatDate(formik.values[inputTypes.timeIn], 'H:mm')
                          : ''
                      }
                      onPress={this.handleTimeIn}
                    />
                    <MainInput
                      showArrow={true}
                      editable={false}
                      icon={require('images/clock.png')}
                      title={locale.ru.vacation_time_out}
                      placeholder={locale.ru.select_time}
                      error={formik.errors[inputTypes.timeOut]}
                      value={
                        formik.values[inputTypes.timeOut]
                          ? formatDate(
                              formik.values[inputTypes.timeOut],
                              'H:mm',
                            )
                          : ''
                      }
                      onPress={this.handleTimeOut}
                    />
                    <DatePicker
                      date={formik.values[inputTypes.dateIn]}
                      minimumDate={new Date()}
                      ref={ref => (this.datePickerAbsenceRef = ref)}
                    />
                    <TimePicker
                      time={formik.values[inputTypes.timeIn]}
                      ref={ref => (this.timePickerInRef = ref)}
                    />
                    <TimePicker
                      time={formik.values[inputTypes.timeOut]}
                      ref={ref => (this.timePickerOutRef = ref)}
                    />
                  </>
                )}

                {this.requestType ===
                  RequestsVacationCreateScreen.vacation_type_Vacation_Paid && (
                  <View
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                    }}>
                    <Text>
                      {`У вас есть ${vacation_days ||
                        '?'} неиспользованных дней отпуска`}
                    </Text>
                  </View>
                )}

                {this.daysExceeded > 0 && (
                  <View
                    style={[
                      styles.formPaddingHorizontal,
                      styles.formPaddingVerticalDefault,
                    ]}>
                    <Text style={{color: 'red'}}>
                      {locale.ru.vacation_requested_term_exceed_days_left}
                    </Text>
                  </View>
                )}

                {/* VACATION */}
                {isRequestTypeVacation(
                  formik.values[inputTypes.vacationRequestType],
                ) && (
                  <>
                    <MainInput
                      showArrow={true}
                      editable={false}
                      icon={require('images/date.png')}
                      title={locale.ru.vacation_date_in}
                      placeholder={locale.ru.select_date}
                      error={formik.errors[inputTypes.dateIn]}
                      value={
                        formik.values[inputTypes.dateIn]
                          ? formatDate(
                              formik.values[inputTypes.dateIn],
                              'DD.MM.YY',
                            )
                          : ''
                      }
                      onPress={this.handleDateIn}
                    />
                    <MainInput
                      showArrow={true}
                      editable={false}
                      icon={require('images/date.png')}
                      title={locale.ru.vacation_date_out}
                      placeholder={locale.ru.select_date}
                      error={formik.errors[inputTypes.dateOut]}
                      value={
                        formik.values[inputTypes.dateOut]
                          ? formatDate(
                              formik.values[inputTypes.dateOut],
                              'DD.MM.YY',
                            )
                          : ''
                      }
                      onPress={this.handleDateOut}
                    />
                    <TitledInfoRow
                      title={locale.ru.vacation_days_amount}
                      value={this.vacationDaysAmount}
                    />

                    <EmployeePickButton
                      removeBottomOffset={
                        !!formik.values[inputTypes.delegateUser]
                      }
                      onAddPress={this.handleDelegateUserPick}
                      onPress={this.handleDelegateUserPick}
                      error={formik.errors[inputTypes.delegateUser]}
                      placeholder={
                        formik.values[inputTypes.delegateUser]
                          ? ''
                          : locale.ru.select_employee
                      }
                      employeeData={formik.values[inputTypes.delegateUser]}
                      title={
                        formik.values[inputTypes.delegateUser]
                          ? ''
                          : locale.ru.select_employee
                      }
                      dividerTitle={locale.ru.delegate_user}
                      icon={
                        formik.values[inputTypes.delegateUser]
                          ? null
                          : require('images/people.png')
                      }
                      showIconAndTitle={!formik.values[inputTypes.delegateUser]}
                    />

                    <DatePicker
                      date={formik.values[inputTypes.dateIn]}
                      minimumDate={this.calculateMinimumDate()}
                      ref={ref => (this.datePickerInRef = ref)}
                    />
                    <DatePicker
                      date={formik.values[inputTypes.dateOut]}
                      minimumDate={this.calculateMinimumDate(true)}
                      ref={ref => (this.datePickerOutRef = ref)}
                    />
                  </>
                )}
              </>
            }
            Bottom={
              <LargeSubmitButton
                isSubmitting={isSubmitting}
                title={locale.ru.start}
                onPress={formik.handleSubmit}
              />
            }
          />
        )}
      </Formik>
    );
  }
}

export default VacationRequestForm;
