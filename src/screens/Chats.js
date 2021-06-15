import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {View, StyleSheet, Text} from 'react-native';
import {action, observable, reaction, toJS} from 'mobx';

import screensId from '../navigation/screensId';
import locale from '../locale';
import topBarButtons from '../navigation/topBarButtons';
import ChatsList from '../components/lists/chatsList';

import commonStyles from 'styles';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {mockChats} from '../constants';
import ScreenWrapper from '../components/ScreenWrapper';

@inject('navigationStore')
@observer
class ChatScreen extends Component {
  static options() {
    return {
      id: screensId.CHATS,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.chats_title,
        },
        rightButtons: [topBarButtons.create],
      },
    };
  }
  @observable
  chats = [];

  @action
  loadChats() {
    this.chats = [];
    mockChats.forEach(item => {
      this.chats.push(item);
    });
  }
  addNewChat = item => {
    this.chats.push(item);
  };

  @observable
  filter = null;
  @action.bound
  handleChatPress(item) {
    this.props.navigationStore.pushScreen(
      screensId.CURRENT_CHAT,
      {
        data: item.messages,
        participants: item.participants
          ? [...item.participants]
          : item.fromUser,
      },
      {
        id: screensId.CURRENT_CHAT,
        topBar: {
          visible: true,
          title: {
            text: item.chatName ? item.chatName : item.fromUser.fullName,
          },
          rightButtons: [topBarButtons.search],
        },
      },
    );
  }

  handleTopBarButtonPress = event => {
    if (event.buttonId === topBarButtons.create.id) {
      this.props.navigationStore.pushScreen(screensId.NEW_DIALOG, {
        addNewChat: this.addNewChat,
        chats: this.chats,
      });
    }
  };
  componentDidMount() {
    this.loadChats();
    this.removeTopBarButtonsListener = this.props.navigationStore.addTopBarButtonListener(
      ChatScreen.options().id,
      this.handleTopBarButtonPress,
      this.addNewChat,
    );
    this.reactionDisposer = reaction(() => this.chats, this.loadChats);
  }

  componentWillUnmount() {
    this.chats = null;
    if (this.removeTopBarButtonsListener) {
      this.removeTopBarButtonsListener();
    }
  }
  render() {
    console.log(this.chats);
    return (
      <View style={commonStyles.common.screenWrapper}>
        {this.chats.length === 0 ? (
          <Text>Создайте новый чат, больше друзей - больше веселья!</Text>
        ) : (
          <ChatsList
            data={toJS(this.chats)}
            handleChatPress={this.handleChatPress}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  statusBar: {
    width: '100%',
    height: getStatusBarHeight(true),
    backgroundColor: commonStyles.common.blue,
  },
});

export default ChatScreen;
