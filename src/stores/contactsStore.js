import {action, computed, observable} from 'mobx';
import * as Contacts from 'react-native-contacts';
import {showMessage} from '../utils/showMessage';
import locale from 'locale';
import permissions from '../utils/permissions';

class ContactsStore {
  @observable
  searchValue = '';

  @observable
  contacts = [];

  @observable
  permissionsGranted = false;

  filterContacts = filterRaw => {
    const filter = filterRaw.toLowerCase();
    return this.contacts.filter(
      ({company = '', middleName = '', givenName = '', displayName = ''}) => {
        return (
          (company && company.toLowerCase().includes(filter)) ||
          (middleName && middleName.toLowerCase().includes(filter)) ||
          (givenName && givenName.toLowerCase().includes(filter)) ||
          (displayName && displayName.toLowerCase().includes(filter))
        );
      },
    );
  };

  @computed
  get contactsList() {
    if (!this.contacts.length) {
      console.log('contacts is empty');
      return [];
    }
    if (this.searchValue) {
      return this.filterContacts(this.searchValue);
    } else {
      return this.contacts;
    }
  }

  @action
  readContacts = async searchValue => {
    this.permissionsGranted = await permissions.getContactsPermission();
    if (this.permissionsGranted) {
      try {
        Contacts.getAllWithoutPhotos((error, contacts) => {
          if (error) {
            console.log(error);
            showMessage(locale.ru.error, locale.ru.couldnt_get_contacts_list);
          } else {
            this.contacts = contacts.filter(
              contact => contact.phoneNumbers.length,
            );
            this.setSearchValue(searchValue);
          }
        });
      } catch (e) {
        showMessage(locale.ru.error, locale.ru.unknown_error_occurred);
      }
    }
  };

  @action
  setSearchValue = value => {
    this.searchValue = value;
  };
}

export default new ContactsStore();
