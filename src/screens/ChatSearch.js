import React, {Component} from 'react';
import {
  Switch,
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
} from 'react-native';

import screensId from '../navigation/screensId';
import locale from '../locale';
import {MESSAGE_TYPE} from '../constants';
import EmployeesChatList from '../components/lists/employeesChatList';

import {action, computed, observable, toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {MOCK_USERS} from '../constants';
import topBarButtons from '../navigation/topBarButtons';

@inject('navigationStore', 'profileStore')
@observer
class ChatSearchScreen extends Component {
  static options() {
    return {
      id: screensId.CHAT_SEARCH,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.chats_new_group_chat,
        },
      },
    };
  }
  render() {
    return (
      <View style={styles.block}>
        <Text style={styles.search}>Поиск</Text>
        <TextInput
          placeholder="Введите текст для поиска..."
          placeholderTextColor="#7C8598"
          style={styles.textInput}
        />
        <View style={styles.line} />
        <Text>
          Вы можете использовать регулярные выражения, например
          <Text style={styles.boldText}> /^text$/i</Text>
        </Text>
        <View style={styles.line} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  block: {
    paddingTop: Dimensions.get('screen').height * 0.03,
    paddingLeft: Dimensions.get('screen').width * 0.035,
    justifyContent: 'space-between',
    height: Dimensions.get('screen').height * 0.2,
  },
  line: {
    height: 0,
    borderWidth: 0.5,
    width: Dimensions.get('screen').width * 0.9,
    color: '#C6C6C8',
    opacity: 0.5,
    justifyContent: 'center',
  },
  textInput: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height * 0.03,
    fontSize: 17,
    fontWeight: '400',
  },
  search: {
    fontSize: 16,
    fontWeight: '500',
  },
  boldText: {
    fontWeight: '700',
  },
});

export default ChatSearchScreen;
