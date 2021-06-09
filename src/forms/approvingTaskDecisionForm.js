import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';

import inputTypes from './inputTypes';
import locale from '../locale';
import commonStyles from 'styles';
import schemas from './schemas';

import MultipleSubmitButtons from '../components/multipleSubmitButtons';
import FormSpaceBetween from '../components/formSpaceBetween';
import TitledInfoRow from '../components/titledInfoRow';

const ApprovingTaskDecisionForm = ({handleSubmit, buttons}) => (
  <Formik
    onSubmit={handleSubmit}
    validateOnBlur={false}
    validateOnChange={false}
    validationSchema={yup.object().shape({
      [inputTypes.comment]: schemas.comment,
    })}>
    {formik => (
      <FormSpaceBetween
        Top={
          <>
            <TitledInfoRow
              error={formik.errors[inputTypes.comment]}
              title={locale.ru.comment}
              icon={require('images/rows.png')}
              valueComponent={
                <TextInput
                  style={styles.commentInput}
                  multiline={true}
                  placeholder={locale.ru.enter_your_comment_here}
                  onChangeText={formik.handleChange(inputTypes.comment)}
                  value={formik.values[inputTypes.comment]}
                />
              }
            />
          </>
        }
        Bottom={
          <MultipleSubmitButtons
            buttons={buttons}
            onPress={formik.handleSubmit}
          />
        }
      />
    )}
  </Formik>
);

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'space-between',
    padding: commonStyles.spaces.xl,
    flex: 1,
  },
  topOffset: {
    marginTop: commonStyles.spaces.l,
  },
  message: {
    ...commonStyles.texts.common,
    color: commonStyles.colors.gray,
    lineHeight: 17,
  },
  commentInputWrapper: {
    borderBottomWidth: 0,
  },
  commentInput: {
    ...commonStyles.texts.infoRowTitle,
    paddingLeft: 0,
    paddingBottom: 0,
  },
});

export default ApprovingTaskDecisionForm;
