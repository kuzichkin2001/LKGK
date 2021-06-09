import React from 'react';
import {View, StyleSheet, Image, Platform, TextInput, Text} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
import * as yup from 'yup';
import {getBottomSpace} from 'react-native-iphone-x-helper';

import commonStyles from 'styles';
import locale from 'locale';
import inputTypes from './inputTypes';
import openLink from '../utils/openLink';

import LoginSubmitButton from 'components/buttons/loginSubmitButton';

const LoginForm = ({handleSubmit, activity, showRegistrationMessage}) => (
  <Formik
    onSubmit={handleSubmit}
    validateOnBlur={false}
    validateOnChange={false}
    validationSchema={yup.object().shape({
      [inputTypes.email]: yup
        .string()
        .required(locale.ru.email_required)
        .email(locale.ru.email_invalid),
      [inputTypes.password]: yup.string().required(locale.ru.pin_code_required),
    })}>
    {formik => (
      <View style={styles.wrapper}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={Platform.select({
            ios: 'always',
            android: 'always',
          })}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.wrapperStyle}>
          <Image
            resizeMode={'contain'}
            style={styles.logo}
            source={require('assets/images/logo.png')}
          />
          <View style={styles.emailInputWrapper}>
            <Text style={styles.error}>{formik.errors[inputTypes.email]}</Text>
            <TextInput
              placeholder={locale.ru.enter_email}
              autoCapitalize={'none'}
              keyboardType={'email-address'}
              placeholderTextColor={commonStyles.colors.label}
              autoCorrect={false}
              value={formik.values[inputTypes.email]}
              onChangeText={formik.handleChange(inputTypes.email)}
              style={[styles.input]}
            />
          </View>
          <View style={styles.pinCodeInputWrapper}>
            <Text style={styles.error}>
              {formik.errors[inputTypes.password]}
            </Text>
            <TextInput
              style={styles.input}
              maxLength={4}
              keyboardType={'number-pad'}
              onChangeText={formik.handleChange(inputTypes.password)}
              placeholderTextColor={commonStyles.colors.label}
              value={formik.values[inputTypes.password]}
              secureTextEntry={true}
              placeholder={locale.ru.enter_pin_code}
            />
          </View>
          <View style={styles.submitButtonWrapper}>
            <LoginSubmitButton
              isSubmitting={!!activity}
              onPress={formik.handleSubmit}
              title={locale.ru.sign_in}
            />
          </View>
          {!!showRegistrationMessage && (
            <Text style={styles.registrationMessage}>
              {locale.ru.register_message}
            </Text>
          )}
          {Platform.OS === 'android' && (
            <View style={styles.androidBottomInfoWrapper}>
              <Text style={commonStyles.texts.bottomAppInfo}>
                {locale.ru.gk_osnova}
              </Text>
              <View style={commonStyles.common.rowCenterCenter}>
                <Text style={commonStyles.texts.bottomAppInfo}>
                  {locale.ru.all_rights_reserved}
                </Text>
                <Text
                  onPress={() => openLink('https://gk-osnova.ru')}
                  style={styles.link}>
                  {' '}
                  https://gk-osnova.ru
                </Text>
              </View>
            </View>
          )}
        </KeyboardAwareScrollView>
        {Platform.OS === 'ios' && (
          <View style={commonStyles.common.centerCenter}>
            <Text style={commonStyles.texts.bottomAppInfo}>
              {locale.ru.gk_osnova}
            </Text>
            <View style={commonStyles.common.rowCenterCenter}>
              <Text style={commonStyles.texts.bottomAppInfo}>
                {locale.ru.all_rights_reserved}
              </Text>
              <Text
                onPress={() => openLink('https://gk-osnova.ru')}
                style={styles.link}>
                {' '}
                https://gk-osnova.ru
              </Text>
            </View>
          </View>
        )}
      </View>
    )}
  </Formik>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: getBottomSpace(),
  },
  wrapperStyle: {
    paddingBottom: 15,
  },
  submitButtonWrapper: {
    marginTop: 30,
  },
  logo: {
    height: 168.4,
    width: 162.27,
    alignSelf: 'center',
    marginTop: 50,
  },
  input: {
    ...commonStyles.common.bottomBorder,
    ...commonStyles.texts.authInput,
    marginTop: Platform.select({ios: 5, android: 0}),
    paddingTop: Platform.select({android: 0}),
    marginBottom: Platform.select({android: 5}),
    paddingBottom: 6,
    paddingLeft: 0,
    width: 288,
    alignSelf: 'center',
  },
  registrationMessage: {
    ...commonStyles.texts.label,
    textAlign: 'center',
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  error: {
    ...commonStyles.texts.label,
    color: commonStyles.colors.red,
  },
  pinCodeInputWrapper: {
    width: 288,
    marginTop: Platform.select({ios: 20, android: 0}),
    alignSelf: 'center',
  },
  emailInputWrapper: {
    width: 288,
    marginTop: Platform.select({ios: 40, android: 20}),
    alignSelf: 'center',
  },
  androidBottomInfoWrapper: {
    marginTop: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    ...commonStyles.texts.label,
    ...commonStyles.common.bottomBorder,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 12,
  },
});

export default LoginForm;
