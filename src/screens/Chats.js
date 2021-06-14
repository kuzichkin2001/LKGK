import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {View, Platform, StyleSheet} from 'react-native';
import {action, observable} from 'mobx';

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
        rightButtons: [topBarButtons.search, topBarButtons.create],
      },
    };
  }
  @observable
  chats = null;
  @action
  loadChats() {
    this.chats = [];
    mockChats.forEach(item => {
      this.chats.push(item);
    });
  }
  @action.bound
  addNewChat(item) {
    this.chats.push(item);
  }

  @observable
  filter = null;
  @action.bound
  handleChatPress(item) {
    this.props.navigationStore.pushScreen(
      screensId.CURRENT_CHAT,
      {
        data: item.messages,
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
      });
    }
    if (event.buttonId === topBarButtons.search.id) {
      this.props.navigationStore.pushScreen(screensId.CHAT_SEARCH);
    }
  };
  componentDidMount() {
    this.loadChats();
    this.removeTopBarButtonsListener = this.props.navigationStore.addTopBarButtonListener(
      ChatScreen.options().id,
      this.handleTopBarButtonPress,
      this.addNewChat,
    );
  }

  componentWillUnmount() {
    this.chats = null;
    if (this.removeTopBarButtonsListener) {
      this.removeTopBarButtonsListener();
    }
  }
  render() {
    return (
      <View style={commonStyles.common.screenWrapper}>
        <ChatsList data={this.chats} handleChatPress={this.handleChatPress} />
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
