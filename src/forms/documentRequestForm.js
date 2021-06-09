import React, {PureComponent} from 'react';
import {Keyboard, View, TextInput} from 'react-native';
import {toJS} from 'mobx';
import {Formik} from 'formik';
import * as yup from 'yup';

import Divider from '../components/divider';
import MainInput from '../components/inputs/MainInput';
import EmployeePickButton from '../components/buttons/employeePickButton';
import FormSpaceBetween from '../components/formSpaceBetween';
import MultipleSubmitButtons from '../components/multipleSubmitButtons';

import schemas from './schemas';
import inputTypes from './inputTypes';
import locale from '../locale';
import DocumentPicker from 'react-native-document-picker';

class DocumentRequestForm extends PureComponent {
  formikRef = null;
  inputDummyRef = null;

  handleEmployeePick = async (values, inputType) => {
    try {
      const employee = await toJS(this.props.onEmployeePick());
      if (employee && this.formikRef) {
        let filteredEmployeesFields = this.getFilteredEmployeesFields(
          values,
          employee,
        );
        if (
          inputType === inputTypes.coordinator ||
          inputType === inputTypes.executor
        ) {
          filteredEmployeesFields[inputType] = employee;
        } else {
          filteredEmployeesFields[inputType].push(employee);
        }
        this.formikRef.setFieldValue(
          [inputTypes.coordinator],
          filteredEmployeesFields[inputTypes.coordinator],
        );
        this.formikRef.setFieldValue(
          [inputTypes.participants],
          filteredEmployeesFields[inputTypes.participants],
        );
        this.formikRef.setFieldValue(
          [inputTypes.executor],
          filteredEmployeesFields[inputTypes.executor],
        );
      }
      Keyboard.dismiss();
      this.inputDummyRef.focus();
    } catch (e) {
      console.log(e);
    }
  };

  getFilteredEmployeesFields = (values, pickedEmployee) => {
    const filteredCoordinator =
      values[inputTypes.coordinator] &&
      values[inputTypes.coordinator].id_phperson === pickedEmployee.id_phperson
        ? null
        : values[inputTypes.coordinator];
    const filteredParticipants = values[inputTypes.participants].filter(
      employee => employee.id_phperson !== pickedEmployee.id_phperson,
    );
    const filteredExecutors =
      values[inputTypes.executor] &&
      values[inputTypes.executor].id_phperson === pickedEmployee.id_phperson
        ? null
        : values[inputTypes.executor];
    return {
      [inputTypes.coordinator]: filteredCoordinator,
      [inputTypes.participants]: filteredParticipants,
      [inputTypes.executor]: filteredExecutors,
    };
  };

  handleEmployeeRemove = (values, removedEmployee, inputType) => {
    if (this.formikRef) {
      this.formikRef.setFieldValue(
        inputType,
        values[inputType].filter(
          employee => employee.id_phperson !== removedEmployee.id_phperson,
        ),
      );
    }
  };

  handleSupportAttachmentChange = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (res) {
        await this.formikRef.setFieldValue('file', res);
      }
    } catch (e) {
      console.log(e);
    }
  };

  /*
    addresseesUsers.type
    0 - participants (Array)
    1 - coordinator
  */

  render() {
    const {
      initialValues,
      onCancelPress,
      onSubmit,
      isSubmitting,
      documentType,
    } = this.props;
    return (
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={{
          [inputTypes.participants]: [],
          ...initialValues,
        }}
        ref={ref => (this.formikRef = ref)}
        validationSchema={yup.object().shape({
          [inputTypes.documentTheme]: schemas.documentTheme,
          [inputTypes.documentText]: schemas.documentText,
          [inputTypes.coordinator]:
            documentType === 1 ? null : schemas.documentCoordinating,
          [inputTypes.executor]:
            documentType === 1 ? null : schemas.taskExecutor,
        })}
        onSubmit={onSubmit}>
        {formik => (
          <FormSpaceBetween
            Top={
              <>
                <Divider title={locale.ru.main_info} />
                <MainInput
                  icon={require('images/rows.png')}
                  title={locale.ru.document_theme}
                  placeholder={locale.ru.enter_your_document_theme_here}
                  multiline={true}
                  error={formik.errors[inputTypes.documentTheme]}
                  value={formik.values[inputTypes.documentTheme]}
                  onChangeText={formik.handleChange(inputTypes.documentTheme)}
                />
                <MainInput
                  icon={require('images/rows.png')}
                  title={locale.ru.document_text}
                  placeholder={locale.ru.enter_your_document_text_here}
                  multiline={true}
                  error={formik.errors[inputTypes.documentText]}
                  value={formik.values[inputTypes.documentText]}
                  onChangeText={formik.handleChange(inputTypes.documentText)}
                />
                <View style={{display: 'none'}}>
                  <TextInput
                    style={{display: 'none'}}
                    ref={ref => (this.inputDummyRef = ref)}
                  />
                </View>

                {documentType !== 1 && (
                  <>
                    <EmployeePickButton
                      removeBottomOffset={
                        !!formik.values[inputTypes.coordinator]
                      }
                      onAddPress={() =>
                        this.handleEmployeePick(
                          formik.values,
                          inputTypes.coordinator,
                        )
                      }
                      onRemovePress={() =>
                        this.formikRef.setFieldValue(
                          inputTypes.coordinator,
                          null,
                        )
                      }
                      error={formik.errors[inputTypes.coordinator]}
                      placeholder={locale.ru.select_employee}
                      employeeData={formik.values[inputTypes.coordinator]}
                      dividerTitle={locale.ru.coordinator}
                      title={locale.ru.add_coordinator}
                    />

                    <EmployeePickButton
                      removeBottomOffset={!!formik.values[inputTypes.executor]}
                      onAddPress={() =>
                        this.handleEmployeePick(
                          formik.values,
                          inputTypes.executor,
                        )
                      }
                      onRemovePress={() =>
                        this.formikRef.setFieldValue(inputTypes.executor, null)
                      }
                      error={formik.errors[inputTypes.executor]}
                      placeholder={locale.ru.select_employee}
                      employeeData={formik.values[inputTypes.executor]}
                      dividerTitle={locale.ru.task_executor}
                      title={locale.ru.add_executor}
                    />

                    <Divider title={locale.ru.files} />
                    <MainInput
                      onPress={this.handleSupportAttachmentChange}
                      icon={require('images/attachment.png')}
                      title={locale.ru.support_request_attachment}
                      multiline={false}
                      value={
                        (formik.values.file && formik.values.file.name) || ''
                      }
                      editable={false}
                      showArrow={false}
                    />
                  </>
                )}
              </>
            }
            Bottom={
              <MultipleSubmitButtons
                type={'document_request'}
                buttons={[
                  {
                    caption: locale.ru.cancel,
                    onPress: onCancelPress,
                    isSubmitting,
                    action: 0,
                  },
                  {
                    caption:
                      locale.ru[
                        `documents_request_type${documentType}_form_submit`
                      ] || locale.ru.to_approval,
                    onPress: formik.handleSubmit,
                    isSubmitting,
                    action: 1,
                  },
                ]}
              />
            }
          />
        )}
      </Formik>
    );
  }
}

export default DocumentRequestForm;
