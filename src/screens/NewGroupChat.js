import React, {Component} from 'react';
import {Switch, StyleSheet, View, Text} from 'react-native';

import screensId from '../navigation/screensId';
import locale from '../locale';
import {mockChats} from '../constants';

import {action, observable} from 'mobx';
import {observer, inject} from 'mobx-react';
import topBarButtons from '../navigation/topBarButtons';

@inject('profileStore')
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
        rightButtons: [topBarButtons.createTextButton],
      },
    };
  }
  @observable
  isEnabledClosedChat = false;

  @observable
  isEnabledReadOnly = false;

  @observable
  isEnabledEncrypted = false;

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
    this.props.navigationStore.pushScreen(screensId.CURRENT_CHAT, {
      userData: this.props.profileStore.userData,
      mockChats,
    });
  }

  render() {
    return (
      <>
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
      </>
    );
  }
}

const styles_add = StyleSheet.create({
  titleNewGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  NameNewGroupTextTag: {
    color: '#7C8598',
    fontSize: 15,
    paddingLeft: 15,
    fontFamily: 'din-pro',
  },
  InputNameGroupChat: {
    paddingLeft: 59,
    fontFamily: 'din-pro',
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
    fontFamily: 'din-pro',
  },
  SettingsNewGroupChat: {
    paddingTop: 24,
  },
});

export default NewGroupChatScreen;
