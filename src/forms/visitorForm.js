import React from 'react';
import {FlatList, StyleSheet, View, Image} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';

import schemas from './schemas';
import inputTypes from './inputTypes';
import locale from 'locale';
import commonStyles from '../styles';

import MainInput from '../components/inputs/MainInput';
import FilteredContacts from './filteredContacts';
import {inject} from 'mobx-react';
import CommonTouchable from '../components/buttons/commonTouchable';
import {observable, action, computed} from 'mobx';
import {observer} from 'mobx-react';

@inject('contactsStore')
@observer
class VisitorForm extends React.Component {
  formikRef = null;

  @observable
  showAutoCompleteContactButton = false;

  @observable
  showFilteredContacts = false;

  @observable
  filteredContactNames = [];

  validate = async () => {
    let result = null;
    try {
      const validateResult = await this.formikRef.validateForm();
      if (!Object.keys(validateResult).length) {
        result = true;
      }
    } catch (e) {
      console.log(e);
    }
    return result;
  };

  @observable
  filteredContacts = [];

  @action
  setFilteredContacts = (
    filteredContactNames,
    showFilteredContacts = this.showFilteredContacts,
  ) => {
    if (!showFilteredContacts || filteredContactNames.length < 2) {
      return [];
    }
    const contactsList = [...this.props.contactsStore.contactsList].filter(
      entity => {
        const {givenName, familyName, displayName} = entity;
        const includeGivenName = givenName
          ? givenName
              .toLowerCase()
              .includes(filteredContactNames[0].toLowerCase())
          : false;
        const includeFamilyName = familyName
          ? familyName
              .toLowerCase()
              .includes(filteredContactNames[1].toLowerCase())
          : false;
        const indexDisplayName = {
          first: displayName
            ? displayName
                .toLowerCase()
                .indexOf(filteredContactNames[0].toLowerCase())
            : -1,
          second: displayName
            ? displayName
                .toLowerCase()
                .indexOf(filteredContactNames[1].toLowerCase())
            : -1,
        };
        return (
          (includeGivenName && includeFamilyName) ||
          (indexDisplayName.first >= 0 &&
            indexDisplayName.second > indexDisplayName.first)
        );
      },
    );
    this.filteredContacts = Array.isArray(contactsList) ? contactsList : [];
  };

  checkIsContactCouldBeResolved = (contacts = null) => {
    const contactsToCheck = contacts || this.filteredContacts;
    if (contactsToCheck.length === 1 && this.showAutoCompleteContactButton) {
      this.props.handleContactResolved(contactsToCheck[0]);
      this.showAutoCompleteContactButton = false;
      this.showFilteredContacts = false;
      this.filteredContacts = [];
      return true;
    }
  };

  @action.bound
  handleInputChange = (formik, inputType, value) => {
    try {
      formik.setFieldValue(inputType, value);
      this.props.onChange(inputType, value);
      if (inputType != inputTypes.visitor) {
        return;
      }
      if (this.props.contactsStore.permissionsGranted) {
        this.props.contactsStore.setSearchValue('');
        const trimmedValue = value.trim();
        if (trimmedValue) {
          const contactNamesSplitted = value.split(' ');
          if (contactNamesSplitted && contactNamesSplitted.length > 1) {
            const filteredContactNames = contactNamesSplitted.filter(
              n => n.trim().length > 2,
            );
            if (filteredContactNames.length > 1) {
              this.showAutoCompleteContactButton = true;
              this.filteredContactNames = filteredContactNames;
              this.setFilteredContacts(filteredContactNames);
              return;
            }
          }
        }
        this.showAutoCompleteContactButton = false;
        this.showFilteredContacts = false;
        this.filteredContactNames = [];
        this.filteredContacts = [];
      }
    } catch (e) {
      console.log(e);
    }
  };

  @action
  handleShowFilteredContacts = () => {
    this.showFilteredContacts = true;
    this.setFilteredContacts(this.filteredContactNames, true);
    this.checkIsContactCouldBeResolved();
  };

  @action.bound
  onPressContactItemToResolve = item => {
    this.props.handleContactResolved(item);
    this.filteredContacts = [];
    this.showFilteredContacts = false;
    this.showAutoCompleteContactButton = false;
  };

  setFormValues = values => {
    try {
      this.formikRef.setValues(values);
    } catch (e) {
      console.log(e);
    }
  };

  componentDidUpdate(prevProps) {
    try {
      const currentValues = this.props.values;
      const prevValues = prevProps.values;
      if (
        currentValues[inputTypes.visitor] !== prevValues[inputTypes.visitor] ||
        currentValues[inputTypes.phone] !== prevValues[inputTypes.phone]
      ) {
        this.setFormValues(currentValues);
      }
    } catch (e) {
      console.log(e);
    }
  }

  componentDidMount() {
    try {
      if (
        !!this.props.values[inputTypes.phone] ||
        !!this.props.values[inputTypes.visitor]
      ) {
        this.setFormValues(this.props.values);
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const {onContactsPress, onRemovePress} = this.props;
    const {filteredContacts} = this;
    return (
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        ref={ref => (this.formikRef = ref)}
        validationSchema={yup.object().shape({
          [inputTypes.visitor]: schemas.passRequestVisitorName,
          [inputTypes.phone]: schemas.passRequestVisitorPhone,
        })}>
        {formik => (
          <View>
            <MainInput
              icon={require('images/people.png')}
              placeholder={locale.ru.enter_name}
              onChangeText={value => {
                this.handleInputChange(formik, inputTypes.visitor, value);
                this.checkIsContactCouldBeResolved();
              }}
              value={formik.values[inputTypes.visitor]}
              error={formik.errors[inputTypes.visitor]}
              title={locale.ru.visitor_name}
              onIconPress={onContactsPress}
              onRemovePress={onRemovePress}
            />
            {this.showAutoCompleteContactButton && (
              <View style={styles.showSuggestedContactsPane}>
                <CommonTouchable
                  onPress={() => {
                    if (!this.checkIsContactCouldBeResolved()) {
                      this.handleShowFilteredContacts();
                    }
                  }}>
                  <Image
                    style={styles.showSuggestedContactsIcon}
                    source={require('images/search.png')}
                  />
                </CommonTouchable>
              </View>
            )}
            {this.showFilteredContacts && filteredContacts.length > 0 && (
              <FilteredContacts
                contacts={filteredContacts}
                onPressContactItemToResolve={this.onPressContactItemToResolve}
              />
            )}
            <MainInput
              icon={require('images/phone.png')}
              keyboardType={'phone-pad'}
              placeholder={locale.ru.enter_phone}
              onChangeText={value =>
                this.handleInputChange(formik, inputTypes.phone, value)
              }
              value={formik.values[inputTypes.phone]}
              error={formik.errors[inputTypes.phone]}
              title={locale.ru.visitor_phone}
            />
          </View>
        )}
      </Formik>
    );
  }
}

const styles = StyleSheet.create({
  suggestedContactItem: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    paddingLeft: 30,
  },
  showSuggestedContactsPane: {
    width: 24,
    height: 24,
    margin: 5,
    position: 'absolute',
    top: 40,
    left: 15,
    backgroundColor: 'grey',
    zIndex: 5,
  },
  showSuggestedContactsIcon: {
    width: 24,
    height: 24,
    tintColor: commonStyles.colors.label,
    backgroundColor: 'white',
  },
});

export default VisitorForm;
