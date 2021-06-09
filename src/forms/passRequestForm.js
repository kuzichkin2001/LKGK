import React, {PureComponent} from 'react';
import {Formik} from 'formik';
import * as yup from 'yup';
import {Platform, KeyboardAvoidingView, ScrollView, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {getBottomSpace} from 'react-native-iphone-x-helper';

import locale from 'locale';
import schemas from './schemas';
import inputTypes from './inputTypes';
import formatDate from '../utils/formatDate';
import commonStyles from 'styles';

import DatePicker from '../components/datepicker';
import VisitorsForm from './visitorsForm';
import MainInput from '../components/inputs/MainInput';
import Divider from '../components/divider';
import LargeSubmitButton from '../components/buttons/largeSubmitButton';
import TitledRowSwitch from '../components/titledRowSwitch';
import {DEFAULT_OFFICE} from '../constants';

const DEFAULT_REQUEST_TYPE = 'Переговоры';

const setDefaultOffice = offices =>
  offices && offices[0] === DEFAULT_OFFICE ? DEFAULT_OFFICE : '';

const FormWrapper = ({children, largeSubmitButton}) =>
  Platform.OS === 'ios' ? (
    <>
      <KeyboardAvoidingView
        style={commonStyles.common.formWrapper}
        contentContainerStyle={commonStyles.common.formContainer}
        enabled={true}
        behavior={'padding'}
        keyboardVerticalOffset={50 + getBottomSpace()}>
        <ScrollView keyboardShouldPersistTaps={'always'}>
          <View style={commonStyles.common.flex1}>{children}</View>
        </ScrollView>
        {largeSubmitButton}
      </KeyboardAvoidingView>
    </>
  ) : (
    <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}>
      {children}
      {largeSubmitButton}
    </KeyboardAwareScrollView>
  );

const FormContent = ({
  formik,
  handlePassRequestTypeChange,
  handleDate,
  handleOfficeChange,
  visitorsFormRef,
  datePickerRef,
}) => (
  <>
    <Divider title={locale.ru.information} />
    <MainInput
      icon={require('images/rows.png')}
      onPress={handlePassRequestTypeChange}
      multiline={true}
      error={formik.errors[inputTypes.passRequestType]}
      value={formik.values[inputTypes.passRequestType]}
      title={locale.ru.pass_request_type}
      placeholder={locale.ru.select_pass_request_type}
      editable={false}
      showArrow={true}
    />
    <MainInput
      onPress={handleOfficeChange}
      icon={require('images/rows.png')}
      multiline={true}
      error={formik.errors[inputTypes.office]}
      value={formik.values[inputTypes.office]}
      title={locale.ru.office}
      placeholder={locale.ru.office_select}
      editable={false}
      showArrow={true}
    />
    <MainInput
      showArrow={true}
      editable={false}
      icon={require('images/date.png')}
      title={locale.ru.pass_request_date}
      placeholder={locale.ru.select_date}
      error={formik.errors[inputTypes.date]}
      value={
        formik.values[inputTypes.date]
          ? formatDate(formik.values[inputTypes.date], 'DD.MM.YY')
          : ''
      }
      onPress={handleDate}
    />
    <MainInput
      icon={require('images/rows.png')}
      multiline={true}
      placeholder={locale.ru.enter_your_comment_here}
      onChangeText={formik.handleChange(inputTypes.comment)}
      error={formik.errors[inputTypes.comment]}
      value={formik.values[inputTypes.comment]}
      title={locale.ru.comment}
    />
    <VisitorsForm ref={visitorsFormRef} />
    <TitledRowSwitch
      onValueChange={formik.handleChange(inputTypes.shouldShare)}
      value={formik.values[inputTypes.shouldShare]}
      icon={require('images/share.png')}
      title={locale.ru.send_invite}
    />
    <DatePicker
      date={formik.values[inputTypes.date]}
      minimumDate={new Date()}
      ref={datePickerRef}
    />
  </>
);

class PassRequestForm extends PureComponent {
  datePickerRef = null;
  formikRef = null;
  visitorsFormRef = null;
  formContentRef = null;

  handleSubmit = async values => {
    try {
      const visitors = await this.visitorsFormRef.validate();
      if ((await this.validate()) && visitors) {
        this.props.handleSubmit({
          ...values,
          ...visitors,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  validate = async () => {
    let result = false;
    try {
      const errors = await this.formikRef.validateForm();
      if (!Object.keys(errors).length) {
        result = true;
      }
    } catch (e) {
      console.log(e);
    }
    return result;
  };

  handleDate = async () => {
    try {
      const date = await this.datePickerRef.pickDate();
      if (date) {
        this.formikRef.setFieldValue(inputTypes.date, date);
      }
    } catch (e) {
      console.log(e);
    }
  };

  handlePassRequestTypeChange = async () => {
    try {
      const pickedType = await this.props.onPassRequestTypeChange();
      if (pickedType) {
        this.formikRef.setFieldValue(inputTypes.passRequestType, pickedType);
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleOfficeChange = async () => {
    try {
      const office = await this.props.onOfficePress();
      if (office) {
        this.formikRef.setFieldValue(inputTypes.office, office);
      }
    } catch (e) {
      console.log(e);
    }
  };

  componentDidUpdate(prevProps: Readonly<P>): void {
    if (!prevProps.offices && this.props.offices) {
      this.formikRef.setFieldValue(inputTypes.office, this.props.offices[0]);
    }
  }

  render() {
    const {isSubmitting} = this.props;
    return (
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={{
          [inputTypes.passRequestType]: DEFAULT_REQUEST_TYPE,
          [inputTypes.shouldShare]: true,
          [inputTypes.date]: new Date(),
          [inputTypes.office]: setDefaultOffice(this.props.offices),
        }}
        ref={ref => (this.formikRef = ref)}
        validationSchema={yup.object().shape({
          [inputTypes.office]: schemas.office,
          [inputTypes.date]: schemas.date,
          [inputTypes.passRequestType]: schemas.passRequestType,
          [inputTypes.comment]: schemas.trim,
        })}>
        {formik => (
          <FormWrapper
            largeSubmitButton={
              <LargeSubmitButton
                isSubmitting={isSubmitting}
                onPress={() => this.handleSubmit(formik.values)}
                title={locale.ru.request_pass_create}
              />
            }>
            <FormContent
              formik={formik}
              handleDate={this.handleDate}
              handleOfficeChange={this.handleOfficeChange}
              handlePassRequestTypeChange={this.handlePassRequestTypeChange}
              visitorsFormRef={ref => (this.visitorsFormRef = ref)}
              datePickerRef={ref => (this.datePickerRef = ref)}
            />
          </FormWrapper>
        )}
      </Formik>
    );
  }
}

export default PassRequestForm;
