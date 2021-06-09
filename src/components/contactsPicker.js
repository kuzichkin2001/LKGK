import React, {Component} from 'react';
import {observable, action} from 'mobx';
import {inject, observer} from 'mobx-react';
import {Modal, AppState} from 'react-native';

import permissions from '../utils/permissions';
import locale from 'locale';

import TopBar from './topBar';
import ContactsList from './lists/contactsList';
import SearchInput from './inputs/searchInput';

@inject('contactsStore')
@observer
class ContactsPicker extends Component {
  _promiseResolve = null;
  _pickingField = null;

  @observable
  visibilityStatus = false;

  @action
  pickContact = async ({field, searchValue}) => {
    return new Promise(async resolve => {
      this._promiseResolve = resolve;
      this._pickingField = field;
      this.visibilityStatus = true;
      if (await permissions.getContactsPermission()) {
        await this.props.contactsStore.readContacts(searchValue);
      }
    });
  };

  @action
  resolvePicker = value => {
    try {
      if (this._promiseResolve) {
        if (value) {
          const name = value.givenName || value.middleName || value.company;
          const phone = value.phoneNumbers[0].number;
          switch (this._pickingField) {
            case 'phone':
              this._promiseResolve(phone);
              break;
            default:
              this._promiseResolve({
                name,
                phone,
              });
          }
        } else {
          this._promiseResolve(value);
        }
        this.visibilityStatus = false;
        this._pickingField = null;
      }
    } catch (e) {
      console.log(e);
    }
  };

  state = {
    appState: AppState.currentState,
  };

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = async nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active' &&
      this.props.contactsStore.permissionsGranted
    ) {
      await this.props.contactsStore.readContacts(
        this.props.contactsStore.searchValue,
      );
    }
    this.setState({appState: nextAppState});
  };

  handleContactPress = contact => {
    this.resolvePicker(contact);
  };

  handleCloseRequest = () => {
    this.resolvePicker(null);
  };

  render() {
    return (
      <Modal
        onRequestClose={this.handleCloseRequest}
        visible={this.visibilityStatus}>
        <TopBar
          leftButton={{
            source: require('images/navBarIcons/arrow-back.png'),
            onPress: this.handleCloseRequest,
          }}
          title={locale.ru.contacts}
        />
        <SearchInput
          value={this.props.contactsStore.searchValue}
          onChangeText={this.props.contactsStore.setSearchValue}
          autoCorrect={false}
        />
        <ContactsList
          onPress={this.handleContactPress}
          data={this.props.contactsStore.contactsList}
        />
      </Modal>
    );
  }
}

export default ContactsPicker;
