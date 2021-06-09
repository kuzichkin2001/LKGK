import React, {PureComponent} from 'react';
import {Formik} from 'formik';
import * as yup from 'yup';
import DocumentPicker from 'react-native-document-picker';

import locale from 'locale';
import inputTypes from './inputTypes';
import schemas from './schemas';

import FormSpaceBetween from '../components/formSpaceBetween';
import MainInput from '../components/inputs/MainInput';
import TextButton from '../components/buttons/TextButton';
import LargeSubmitButton from '../components/buttons/largeSubmitButton';

class SupportRequestForm extends PureComponent {
  formikRef = null;

  handleSupportTypeChange = async () => {
    try {
      const pickedType = await this.props.onSupportTypePress();
      if (pickedType) {
        this.formikRef.setFieldValue(inputTypes.supportRequestType, pickedType);
      }
    } catch (e) {
      console.log(e);
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
  render() {
    const {onSubmit, initialValues, isSubmitting} = this.props;
    return (
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        ref={ref => (this.formikRef = ref)}
        initialValues={{
          [inputTypes.comment]: '',
          [inputTypes.file]: {name: undefined},
          ...initialValues,
        }}
        validationSchema={yup.object().shape({
          [inputTypes.comment]: schemas.comment,
          [inputTypes.supportRequestType]: schemas.supportRequestType,
        })}
        onSubmit={onSubmit}>
        {formik => (
          <FormSpaceBetween
            Top={
              <>
                <MainInput
                  onPress={this.handleSupportTypeChange}
                  icon={require('images/rows.png')}
                  title={locale.ru.support_request_type}
                  placeholder={locale.ru.select_support_request_type}
                  multiline={true}
                  error={formik.errors[inputTypes.supportRequestType]}
                  value={formik.values[inputTypes.supportRequestType]}
                  editable={false}
                  showArrow={true}
                />
                <MainInput
                  icon={require('images/rows.png')}
                  title={locale.ru.comment}
                  placeholder={locale.ru.enter_your_comment_here}
                  multiline={true}
                  error={formik.errors[inputTypes.comment]}
                  value={formik.values[inputTypes.comment]}
                  onChangeText={formik.handleChange(inputTypes.comment)}
                />
                <MainInput
                  onPress={this.handleSupportAttachmentChange}
                  icon={require('images/attachment.png')}
                  title={locale.ru.support_request_attachment}
                  multiline={false}
                  value={formik.values['file'].name || ''}
                  editable={false}
                  showArrow={false}
                />
              </>
            }
            Bottom={
              <LargeSubmitButton
                isSubmitting={isSubmitting}
                title={locale.ru.create_request}
                onPress={formik.handleSubmit}
              />
            }
          />
        )}
      </Formik>
    );
  }
}

export default SupportRequestForm;
