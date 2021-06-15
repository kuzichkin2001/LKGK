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
import {MESSAGE_TYPE, MOCK_USERS} from '../constants';
import topBarButtons from '../navigation/topBarButtons';

@inject('navigationStore', 'profileStore')
@observer
class NewGroupChatScreen extends Component {
  static options() {
    return {
      id: screensId.NEW_GROUP_CHAT,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.chats_new_group_chat,
        },
        rightButtons: [topBarButtons.create],
        rightButtonColor: '#85D305',
      },
    };
  }
  @observable
  Users = null;

  @observable
  chatName = '';

  @observable
  isEnabledClosedChat = false;
  
  @observable
  newGroupChat = {
    chatId: Math.round(Math.random() + 4),
    participants: [],
    messageType: MESSAGE_TYPE.GROUP_CHAT,
    chatName: '',
    chatAvatar: require('../assets/images/userProfileAvatars/ava3.png'),
    messages: [
      {
        fromUser: MOCK_USERS[0],
        messageId: 1,
        messageAssets: null,
        messageText: 'It is a message',
        messageArrivedTime: new Date(),
      },
    ],
    currentlyOnline: true,
  };

  @observable
  isEnabledReadOnly = false;

  @observable
  isEnabledEncrypted = false;

  @action
  handleTopBarButtonPress = event => {
    if (event.buttonId === topBarButtons.filter.id) {
      const newGroupChat = {
        chatId: this.props.chats.length + 1,
        participants: this.Users.filter(item => item.isTick),
        messageType: MESSAGE_TYPE.GROUP_CHAT,
        chatName: this.chatName,
        chatAvatar: require('../assets/images/userProfileAvatars/ava2.png'),
        messages: [],
        currentlyOnline: true,
      };
      this.props.addNewChat(newGroupChat);
    }
  };
  @action
  loadUsers() {
    this.Users = [];
    MOCK_USERS.forEach(item => {
      this.Users.push(item);
    });
  }

  @action.bound
  toggleSwitchClosedChat() {
    this.isEnabledClosedChat = !this.isEnabledClosedChat;
  }

  @action.bound
  toggleSwitchReadOnly() {
    this.isEnabledReadOnly = !this.isEnabledReadOnly;
  }

  @action.bound
  toggleSwitchEncrypted() {
    this.isEnabledEncrypted = !this.isEnabledEncrypted;
  }
  @action
  handlePressButton() {
    this.props.addNewChat(this.newGroupChat);
  }
  @action
  handleButtonPress = (id, passProps, options) => {
    this.props.navigationStore.pushScreen(id, passProps, options);
  };
  
  componentDidMount() {
    this.loadUsers();
    this.removeTopBarButtonsListener = this.props.navigationStore.addTopBarButtonListener(
      NewGroupChatScreen.options().id,
      this.handleTopBarButtonPress,
    );
  }
  componentWillUnmount() {
    if (this.removeTopBarButtonsListener) {
      this.removeTopBarButtonsListener();
    }
  }
  render() {
    return (
      <>
        <View style={styles_add.textInput}>
          <View style={styles_add.titleNewGroup}>
            <Text style={styles_add.NameNewGroupTextTag}>Название чата</Text>
          </View>
          <TextInput
            style={styles_add.InputNameGroupChat}
            placeholder="Введите название чата.."
            placeholderTextColor="#7C8598"
            value={this.chatName}
            onChangeText={value => {
              this.chatName = value;
            }}
          />
        </View>
        <View style={styles_add.ClosedChat}>
          <Text style={styles_add.TextClosedChat}>Закрытый чат</Text>
          <Switch
            trackColor={{false: '#E5E5EA', true: '#4CD964'}}
            ios_backgroundColor="#E5E5EA"
            onValueChange={this.toggleSwitchClosedChat}
            value={this.isEnabledClosedChat}
          />
        </View>
        <View style={styles_add.ClosedChat}>
          <Text style={styles_add.TextClosedChat}>Только для чтения</Text>
          <Switch
            trackColor={{false: '#E5E5EA', true: '#4CD964'}}
            ios_backgroundColor="#E5E5EA"
            onValueChange={this.toggleSwitchReadOnly}
            value={this.isEnabledReadOnly}
          />
        </View>
        <View style={styles_add.ClosedChat}>
          <Text style={styles_add.TextClosedChat}>Зашифрованный</Text>
          <Switch
            trackColor={{false: '#E5E5EA', true: '#4CD964'}}
            ios_backgroundColor="#E5E5EA"
            onValueChange={this.toggleSwitchEncrypted}
            value={this.isEnabledEncrypted}
          />
        </View>
        <View style={styles_add.blockOffset}>
          <EmployeesChatList
            data={this.Users}
            handleEmployeePress={this.handleEmployeePress}
          />
        </View>
      </>
    );
  }
}

const styles_add = StyleSheet.create({
  blockOffset: {
    marginTop: 24,
  },
  textInput: {
    paddingLeft: Dimensions.get('screen').width * 0.1,
    paddingTop: Dimensions.get('screen').width * 0.05,
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: 72,
  },
  titleNewGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  NameNewGroupTextTag: {
    color: '#7C8598',
    fontSize: 15,
  },
  ClosedChat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    height: 44,
  },
  TextClosedChat: {
    fontSize: 17,
  },
  SettingsNewGroupChat: {
    paddingTop: 24,
  },
});

export default NewGroupChatScreen;
