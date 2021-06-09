import React, {PureComponent} from 'react';
import {Formik} from 'formik';
import * as yup from 'yup';

import locale from 'locale';
import inputTypes from './inputTypes';
import schemas from './schemas';
import commonStyles from 'styles';

import FormSpaceBetween from '../components/formSpaceBetween';
import MultipleSubmitButtons from '../components/multipleSubmitButtons';
import MainInput from '../components/inputs/MainInput';

class AddCommentForm extends PureComponent {
  renderTop = formik => (
    <MainInput
      icon={require('images/rows.png')}
      wrapperStyle={commonStyles.common.zeroTopOffset}
      multiline={true}
      onChangeText={formik.handleChange(inputTypes.comment)}
      error={formik.errors[inputTypes.comment]}
      value={formik.values[inputTypes.comment]}
      title={locale.ru.comment}
      placeholder={locale.ru.enter_your_comment_here}
    />
  );

  renderBottom = formik => (
    <MultipleSubmitButtons
      buttons={[
        {
          caption: locale.ru.add,
          onPress: formik.handleSubmit,
          isSubmitting: this.props.isSubmitting,
        },
      ]}
    />
  );

  render() {
    const {onSubmit} = this.props;
    return (
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={yup.object().shape({
          [inputTypes.comment]: schemas.comment,
        })}
        onSubmit={onSubmit}>
        {formik => (
          <FormSpaceBetween
            Bottom={this.renderBottom(formik)}
            Top={this.renderTop(formik)}
          />
        )}
      </Formik>
    );
  }
}

export default AddCommentForm;
