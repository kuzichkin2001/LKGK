import React, {PureComponent} from 'react';
import {FlatList} from 'react-native';

import commonStyles from 'styles';
import locale from 'locale';

import ContactListItem from '../listsItems/contact';
import ListEmptyView from '../listEmptyView';

class ContactsList extends PureComponent {
  renderItem = ({item}) => {
    if (item && item.phoneNumbers && item.phoneNumbers.length) {
      const name =
        item.displayName ||
        item.givenName ||
        item.middleName ||
        item.company ||
        '';
      const phone = item.phoneNumbers[0].number;
      if (!phone) {
        return null;
      }
      return (
        <ContactListItem
          phone={phone}
          name={name}
          onPress={() => this.props.onPress(item)}
        />
      );
    } else {
      return null;
    }
  };

  keyExtractor = item => item.recordID;

  render() {
    const {data} = this.props;
    return (
      <FlatList
        ListEmptyComponent={
          <ListEmptyView title={locale.ru.empty_list_contacts} />
        }
        contentContainerStyle={commonStyles.common.bottomSafe}
        renderItem={this.renderItem}
        data={data}
        keyExtractor={this.keyExtractor}
      />
    );
  }
}

export default ContactsList;
