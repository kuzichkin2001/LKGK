import React, {PureComponent} from 'react';
import {Formik} from 'formik';
import * as yup from 'yup';

import locale from 'locale';
import inputTypes from './inputTypes';

import PeriodDatePickerButton from '../components/buttons/periodDatePickerButton';
import EmployeePickButton from '../components/buttons/employeePickButton';
import schemas from './schemas';
import FormSpaceBetween from '../components/formSpaceBetween';
import LargeSubmitButton from '../components/buttons/largeSubmitButton';
import Divider from '../components/divider';

class DelegationCreateForm extends PureComponent {
  formikRef = null;
  handleExecutorRemove = () => {
    this.formikRef.setFieldValue(inputTypes.executor, null);
  };

  handleExecutorPick = async () => {
    const {onEmployeePick} = this.props;
    const pickedEmployee = await onEmployeePick();
    if (pickedEmployee) {
      this.formikRef.setFieldValue(inputTypes.executor, pickedEmployee);
    }
  };

  render() {
    const {isSubmitting, onSubmit} = this.props;
    return (
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        initialValues={{
          [inputTypes.delegationDatePeriod]: PeriodDatePickerButton.getDefaultPeriod(),
        }}
        validationSchema={yup.object().shape({
          [inputTypes.executor]: schemas.delegationExecutor,
          [inputTypes.delegationDatePeriod]: schemas.delegationPeriod,
        })}
        ref={ref => (this.formikRef = ref)}>
        {formik => (
          <FormSpaceBetween
            Top={
              <>
                <Divider />
                <PeriodDatePickerButton
                  placeholder={locale.ru.select_period}
                  onChangePeriod={formik.handleChange(
                    inputTypes.delegationDatePeriod,
                  )}
                  error={formik.errors[inputTypes.delegationDatePeriod]}
                  period={formik.values[inputTypes.delegationDatePeriod]}
                  title={locale.ru.delegation_period}
                />
                <EmployeePickButton
                  removeBottomOffset={!!formik.values[inputTypes.executor]}
                  onAddPress={this.handleExecutorPick}
                  onRemovePress={this.handleExecutorRemove}
                  error={formik.errors[inputTypes.executor]}
                  placeholder={locale.ru.select_employee}
                  employeeData={formik.values[inputTypes.executor]}
                  title={'Выбрать сотрудника'}
                  dividerTitle={locale.ru.delegation_executor}
                />
              </>
            }
            Bottom={
              <LargeSubmitButton
                isSubmitting={isSubmitting}
                onPress={formik.handleSubmit}
                title={locale.ru.create_delegated_rule}
              />
            }
          />
        )}
      </Formik>
    );
  }
}

export default DelegationCreateForm;
