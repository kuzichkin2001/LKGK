import React, {Component} from 'react';
import {FlatList} from 'react-native';
import {observer} from 'mobx-react';
import {observable, action, toJS} from 'mobx';

import locale from 'locale';
import inputTypes from './inputTypes';
import confirmPick from '../utils/confirmPicker';

import VisitorForm from './visitorForm';
import ContactsPicker from '../components/contactsPicker';
import ListAddHeader from '../components/listAddHeader';
import {filterContactName} from '../utils/contacts';

@observer
class VisitorsForm extends Component {
  contactsPickerRef = null;

  visitorsFormsRefs = {
    '0': null,
  };

  @observable
  fieldsValues = [
    {
      [inputTypes.phone]: '',
      [inputTypes.visitor]: '',
    },
  ];

  @action
  handleVisitorAdd = () => {
    confirmPick({
      title: locale.ru.chose_variant,
      subtitle: locale.ru.should_add_visitor,
      onConfirm: () =>
        this.fieldsValues.push({
          [inputTypes.visitor]: '',
          [inputTypes.phone]: '',
        }),
    });
  };

  @action
  handleVisitorRemove = index => {
    confirmPick({
      title: locale.ru.chose_variant,
      subtitle: locale.ru.should_remove_visitor,
      onConfirm: () => {
        this.fieldsValues = this.fieldsValues.filter((foo, i) => i != index);
      },
    });
  };

  setContactData = (index, contact) => {
    const data = {
      [inputTypes.visitor]: contact.name,
      [inputTypes.phone]: contact.phone,
    };
    this.visitorsFormsRefs[index].wrappedInstance.setFormValues(data);
    this.fieldsValues[index] = data;
  };

  @action
  handleContactPicker = async index => {
    try {
      const currentFieldsValues = this.fieldsValues[index] || {};
      const contact = await this.contactsPickerRef.wrappedInstance.pickContact({
        searchValue: currentFieldsValues[inputTypes.visitor] || '',
      });
      if (contact) {
        this.setContactData(index, contact);
      }
    } catch (e) {
      console.log(e);
    }
  };

  @action
  handleChange = (index, inputType, value) => {
    try {
      this.fieldsValues[index][inputType] = value;
    } catch (e) {
      console.log(e);
    }
  };

  handleResolveContact = (index, contact) => {
    const data = {
      name: filterContactName(contact),
      phone: contact.phoneNumbers[0].number,
    };
    this.setContactData(index, data);
  };

  renderVisitors = ({item, index}) => (
    <VisitorForm
      isFirst={!index}
      onRemovePress={
        this.fieldsValues.length > 1
          ? () => this.handleVisitorRemove(index)
          : null
      }
      onContactsPress={() => this.handleContactPicker(index)}
      onChange={(inputType, item) => this.handleChange(index, inputType, item)}
      ref={ref => {
        this.visitorsFormsRefs[index] = ref;
      }}
      values={item}
      handleContactResolved={contact =>
        this.handleResolveContact(index, contact)
      }
    />
  );

  validate = async () => {
    let result = null;
    try {
      const validationResult = await Promise.all(
        this.fieldsValues.map(async (values, index) =>
          this.visitorsFormsRefs[index].wrappedInstance.validate(),
        ),
      );
      if (validationResult.indexOf(null) === -1) {
        let names = [],
          phones = [];
        this.fieldsValues.forEach(visitor => {
          names.push(visitor[inputTypes.visitor]);
          phones.push(visitor[inputTypes.phone]);
        });
        result = {
          [inputTypes.visitors]: names,
          [inputTypes.phones]: phones,
        };
      }
    } catch (e) {
      console.log(e);
    }
    return result;
  };

  render() {
    return (
      <>
        <ListAddHeader
          dividerTitle={locale.ru.visitors}
          onAddPress={this.handleVisitorAdd}
          title={locale.ru.add_visitor}
        />
        <FlatList
          scrollEnabled={false}
          extraData={toJS(this.fieldsValues)}
          data={this.fieldsValues}
          renderItem={this.renderVisitors}
        />
        <ContactsPicker ref={ref => (this.contactsPickerRef = ref)} />
      </>
    );
  }
}

export default VisitorsForm;
