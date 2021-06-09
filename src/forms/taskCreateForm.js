import React, {PureComponent} from 'react';
import {Formik} from 'formik';
import * as yup from 'yup';
import {toJS} from 'mobx';

import commonStyles from 'styles';
import inputTypes from './inputTypes';
import locale from 'locale';
import schemas from './schemas';

import EmployeesPickList from '../components/lists/employeesPickList';
import EmployeePickButton from '../components/buttons/employeePickButton';
import MainInput from '../components/inputs/MainInput';
import Divider from '../components/divider';
import PeriodDatePickerButton from '../components/buttons/periodDatePickerButton';
import FormBottomSubmit from '../components/formBottomSubmit';

class TaskCreateForm extends PureComponent {
  formikRef = null;

  handleEmployeePick = async (values, inputType) => {
    try {
      const employee = await toJS(this.props.onEmployeePick());
      if (employee && this.formikRef) {
        let filteredEmployeesFields = this.getFilteredEmployeesFields(
          values,
          employee,
        );
        console.log(filteredEmployeesFields);
        if (inputType === inputTypes.executor) {
          filteredEmployeesFields[inputType] = employee;
        } else {
          filteredEmployeesFields[inputType].push(employee);
        }
        this.formikRef.setFieldValue(
          [inputTypes.executor],
          filteredEmployeesFields[inputTypes.executor],
        );
        this.formikRef.setFieldValue(
          [inputTypes.observers],
          filteredEmployeesFields[inputTypes.observers],
        );
        this.formikRef.setFieldValue(
          [inputTypes.assistants],
          filteredEmployeesFields[inputTypes.assistants],
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  getFilteredEmployeesFields = (values, pickedEmployee) => {
    const filteredExecutor =
      values[inputTypes.executor] &&
      values[inputTypes.executor].id_phperson === pickedEmployee.id_phperson
        ? null
        : values[inputTypes.executor];
    const filteredObservers = values[inputTypes.observers].filter(
      employee => employee.id_phperson !== pickedEmployee.id_phperson,
    );
    const filteredAssistants = values[inputTypes.assistants].filter(
      employee => employee.id_phperson !== pickedEmployee.id_phperson,
    );
    return {
      [inputTypes.executor]: filteredExecutor,
      [inputTypes.observers]: filteredObservers,
      [inputTypes.assistants]: filteredAssistants,
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

  handleSubmit = values => {
    console.log(values);
    this.props.onSubmit(values);
  };

  render() {
    const {onEmployeePress, isSubmitting} = this.props;
    return (
      <Formik
        isSubmitting={isSubmitting}
        onSubmit={this.handleSubmit}
        validateOnChange={false}
        validateOnBlur={false}
        ref={ref => (this.formikRef = ref)}
        initialValues={{
          [inputTypes.observers]: [],
          [inputTypes.assistants]: [],
          [inputTypes.taskDatePeriod]: PeriodDatePickerButton.getDefaultPeriod(),
        }}
        validationSchema={yup.object().shape({
          [inputTypes.theme]: schemas.taskTheme,
          [inputTypes.note]: schemas.taskNote,
          [inputTypes.taskDatePeriod]: schemas.taskDatePeriod,
          [inputTypes.executor]: schemas.taskExecutor,
        })}>
        {formik => (
          <FormBottomSubmit
            submitButtonProps={{
              isSubmitting: isSubmitting,
              onPress: formik.handleSubmit,
              title: locale.ru.create,
            }}>
            <Divider title={locale.ru.information} />
            <MainInput
              icon={require('images/rows.png')}
              multiline={true}
              value={formik.values[inputTypes.theme]}
              onChangeText={formik.handleChange(inputTypes.theme)}
              error={formik.errors[inputTypes.theme]}
              placeholder={locale.ru.task_enter_theme}
              title={locale.ru.task_theme}
            />
            <MainInput
              icon={require('images/rows.png')}
              multiline={true}
              value={formik.values[inputTypes.note]}
              onChangeText={formik.handleChange(inputTypes.note)}
              error={formik.errors[inputTypes.note]}
              placeholder={locale.ru.task_enter_note}
              title={locale.ru.task_note}
            />
            <PeriodDatePickerButton
              onChangePeriod={formik.handleChange(inputTypes.taskDatePeriod)}
              error={formik.errors[inputTypes.taskDatePeriod]}
              placeholder={locale.ru.set_task_period}
              title={locale.ru.task_period}
              period={formik.values[inputTypes.taskDatePeriod]}
            />
            <EmployeePickButton
              removeBottomOffset={!!formik.values[inputTypes.executor]}
              onAddPress={() =>
                this.handleEmployeePick(formik.values, inputTypes.executor)
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
            <EmployeesPickList
              onAddPress={() =>
                this.handleEmployeePick(formik.values, [inputTypes.assistants])
              }
              onRemove={removedEmployee =>
                this.handleEmployeeRemove(
                  formik.values,
                  removedEmployee,
                  inputTypes.assistants,
                )
              }
              data={toJS(formik.values[inputTypes.assistants])}
              dividerTitle={locale.ru.task_assistants}
              title={locale.ru.add_assistant}
            />
            <EmployeesPickList
              wrapperStyle={commonStyles.common.itemBottomOffset}
              onEmployeePress={onEmployeePress}
              onAddPress={() =>
                this.handleEmployeePick(formik.values, [inputTypes.observers])
              }
              onRemove={removedEmployee =>
                this.handleEmployeeRemove(
                  formik.values,
                  removedEmployee,
                  inputTypes.observers,
                )
              }
              data={toJS(formik.values[inputTypes.observers])}
              dividerTitle={locale.ru.task_observers}
              title={locale.ru.add_observer}
            />
          </FormBottomSubmit>
        )}
      </Formik>
    );
  }
}

export default TaskCreateForm;
