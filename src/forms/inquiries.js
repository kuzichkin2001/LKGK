import React, {PureComponent} from 'react';
import {Formik} from 'formik';
import MainInput from '../components/inputs/MainInput';
import Divider from '../components/divider';
import LargeSubmitButton from '../components/buttons/largeSubmitButton';
import FormSpaceBetween from '../components/formSpaceBetween';
import SingleRowInput from '../components/inputs/SingleRowInput';
import Remark from '../components/remark';
import TitledRowSwitch from '../components/titledRowSwitch';
import TitledTextSingleRow from '../components/titledTextSingleRow';
import TitledValuePickerButton from '../components/buttons/titledValuePickerButton';
import DocumentPicker from 'react-native-document-picker';
import formatDate from '../utils/formatDate';
import DatePicker from '../components/datepicker';

import * as yup from 'yup';
import {currentYear} from '../utils/dates';
import locale from '../locale';
import schemas from './schemas';
import inputTypes from './inputTypes';
import commonStyles from 'styles';

const amountOfCopiesPickerItems = [...Array(5).keys()].map(v => {
  const value = (v + 1).toString();
  return {label: value, value};
});

const userStartWorkYear = date => parseInt(date.substr(0, 4), 10);

const yearsOfWork = ({year_start}) => {
  const startYear = userStartWorkYear(year_start);
  return [...Array(currentYear - startYear + 1).keys()].map(v => {
    const value = (v + startYear).toString();
    return {
      label: value,
      value,
    };
  });
};

const handleAttachmentChange = async formikRef => {
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    });
    if (res) {
      await formikRef.setFieldValue('file', res);
    }
  } catch (e) {
    console.log(e);
  }
};

const FormContent = ({formik, inquiryTypeNumeric, userData, handleDate}) => (
  <>
    <Divider title={locale.ru.main_info} />
    <MainInput
      icon={require('images/rows.png')}
      title={locale.ru.description}
      value={locale.ru[`inquiry_info_type${inquiryTypeNumeric}`]}
      multiline={true}
      editable={false}
    />

    <Divider title={locale.ru.inquiry_fill_form} />
    {inquiryTypeNumeric == 2 && (
      <>
        <TitledValuePickerButton
          title={locale.ru.inquiry_form_year_from}
          value={formik.values[inputTypes.inquiryYearStartWork]}
          onChange={v => {
            console.log('onChange 1', v);
            formik.handleChange(inputTypes.inquiryYearStartWork)(v);
          }}
          items={yearsOfWork(userData)}
          selectedValue={formik.values[inputTypes.inquiryYearStartWork]}
        />
        <TitledValuePickerButton
          title={locale.ru.inquiry_form_year_till}
          value={formik.values[inputTypes.inquiryYearEndWork]}
          onChange={v => {
            formik.handleChange(inputTypes.inquiryYearEndWork)(v);
          }}
          items={yearsOfWork(userData)}
          selectedValue={formik.values[inputTypes.inquiryYearEndWork]}
        />
      </>
    )}
    {inquiryTypeNumeric <= 2 && (
      <TitledValuePickerButton
        title={locale.ru.amount_of_copies}
        value={formik.values[inputTypes.inquiryCopiesAmount]}
        onChange={formik.handleChange(inputTypes.inquiryCopiesAmount)}
        items={amountOfCopiesPickerItems}
      />
    )}
    {inquiryTypeNumeric == 4 && (
      <>
        <TitledRowSwitch
          title={locale.ru.inquiry_specify_salary}
          value={!!formik.values[inputTypes.inquirySpecifySalary]}
          onValueChange={v =>
            formik.handleChange(inputTypes.inquirySpecifySalary)(v * 1)
          }
          rowClickable={true}
        />
        <TitledRowSwitch
          title={locale.ru.inquiry_specify_vacancy_term}
          value={!!formik.values[inputTypes.inquirySpecifyVacancy]}
          onValueChange={v =>
            formik.handleChange(inputTypes.inquirySpecifyVacancy)(v * 1)
          }
          rowClickable={true}
        />
        <TitledRowSwitch
          title={locale.ru.inquiry_specify_english}
          value={!!formik.values[inputTypes.inquirySpecifyEnglish]}
          onValueChange={v =>
            formik.handleChange(inputTypes.inquirySpecifyEnglish)(v * 1)
          }
          rowClickable={true}
        />
      </>
    )}

    {inquiryTypeNumeric > 1 && inquiryTypeNumeric % 2 === 1 && (
      <>
        <SingleRowInput
          placeholder={locale.ru.inquiry_form_child_fullName}
          value={formik.values[inputTypes.inquiryChildFullName]}
          onChangeText={formik.handleChange(inputTypes.inquiryChildFullName)}
          error={formik.errors[inputTypes.inquiryChildFullName]}
        />
        <TitledTextSingleRow
          title={locale.ru.child_birthday}
          onPress={() => handleDate(inputTypes.inquiryChildBirthDate)}
          value={
            formik.values[inputTypes.inquiryChildBirthDate]
              ? formatDate(
                  formik.values[inputTypes.inquiryChildBirthDate],
                  'D MMMM YYYY',
                )
              : ''
          }
        />

        <Divider title={locale.ru.files} />
        <MainInput
          onPress={() => handleAttachmentChange(formik)} // !!!
          icon={require('images/attachment.png')}
          title={locale.ru.inquiry_form_child_birthCertificate}
          multiline={false}
          value={(formik.values.file && formik.values.file.name) || undefined}
          editable={false}
          showArrow={false}
          error={formik.errors[inputTypes.file]}
        />
      </>
    )}

    <Remark
      text={
        locale.ru[
          `inquiry_remark_form${
            inquiryTypeNumeric != 3 && inquiryTypeNumeric != 5 ? '' : '_child'
          }`
        ]
      }
    />
  </>
);

class InquiryForm extends PureComponent {
  formikRef = null;
  datePickerRef = null;

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

  handleDate = async field => {
    try {
      const date = await this.datePickerRef.pickDate();
      if (date) {
        this.formikRef.setFieldValue(field, date);
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const {isSubmitting, inquiryTypeNumeric, userData, onSubmit} = this.props;
    console.log(yearsOfWork(userData));
    return (
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={{
          [inputTypes.inquiryCopiesAmount]: '1',
          ...(inquiryTypeNumeric == 2 && {
            [inputTypes.inquiryYearStartWork]: currentYear.toString(),
            [inputTypes.inquiryYearEndWork]: currentYear.toString(),
          }),
          ...(inquiryTypeNumeric == 4 && {
            [inputTypes.inquirySpecifySalary]: 0,
            [inputTypes.inquirySpecifyVacancy]: 0,
            [inputTypes.inquirySpecifyEnglish]: 0,
          }),
          ...((inquiryTypeNumeric == 3 || inquiryTypeNumeric == 5) && {
            [inputTypes.inquiryChildBirthDate]: new Date(),
          }),
        }}
        ref={ref => (this.formikRef = ref)}
        onSubmit={values => onSubmit(values)}
        validationSchema={yup.object().shape({
          ...((inquiryTypeNumeric == 3 || inquiryTypeNumeric == 5) && {
            [inputTypes.inquiryChildFullName]: schemas.fullName,
            [inputTypes.file]: schemas.file,
          }),
        })}>
        {formik => (
          <FormSpaceBetween
            Top={
              <>
                <FormContent
                  formik={formik}
                  inquiryTypeNumeric={inquiryTypeNumeric}
                  userData={userData}
                  handleDate={this.handleDate}
                />
                <DatePicker
                  date={formik.values[inputTypes.inquiryChildBirthDate]}
                  ref={ref => (this.datePickerRef = ref)}
                />
              </>
            }
            Bottom={
              <LargeSubmitButton
                isSubmitting={isSubmitting}
                onPress={formik.handleSubmit}
                title={locale.ru.create_inquiry} // !!!
                wrapperStyle={commonStyles.common.actionButton}
              />
            }
          />
        )}
      </Formik>
    );
  }
}

export default InquiryForm;
