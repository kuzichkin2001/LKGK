import React from 'react';
import {filterContactName} from '../utils/contacts';
import {FlatList, StyleSheet, View} from 'react-native';
import ContactListItem from '../components/listsItems/contact';
import commonStyles from '../styles';

const renderFilteredContactItem = (item, onPressContactItemToResolve) => {
  const visitor = filterContactName(item);
  const phone = item.phoneNumbers[0].number;
  if (!phone) {
    return null;
  }
  return (
    <View style={styles.suggestedContactItem}>
      <ContactListItem
        name={visitor}
        phone={phone}
        onPress={() => onPressContactItemToResolve(item)}
        key={item.recordID}
      />
    </View>
  );
};

const FilteredContacts = ({contacts, onPressContactItemToResolve}) => {
  return (
    <FlatList
      scrollEnabled={true}
      data={contacts}
      keyExtractor={({recordID}) => recordID}
      renderItem={({item}) =>
        renderFilteredContactItem(item, onPressContactItemToResolve)
      }
    />
  );
};

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

export default FilteredContacts;
