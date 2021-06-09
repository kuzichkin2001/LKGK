import React, {Component} from 'react';
import {View} from 'react-native';

import {observable, action, computed} from 'mobx';
import screensId from '../navigation/screensId';
import locale from '../locale';
import topBarButtons from '../navigation/topBarButtons';

import ScreenWrapper from '../components/ScreenWrapper';
import ChatMessagesList from '../components/lists/chatMessagesList';

class CurrentChatScreen extends Component {
  static options() {
    return {
      id: screensId.CURRENT_CHAT,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.chats,
        },
        rightButtons: [topBarButtons.search],
      },
    };
  }

  @observable
  listOfMessages = [];

  @observable
  fromUserId = this.props.fromUserId;

  @observable
  messagesEnded = false;

  @observable
  messagesNextPage = 1;

  @computed
  get isLoadMoreMessagesAvailable() {
    return (
      !this.messagesEnded &&
      !!this.messagesNextPage &&
      this.listOfMessages.length
    );
  }

  @action
  loadListOfMessages() {
    this.props.data.forEach(item => {
      this.listOfMessages.push(item);
    });
  }

  componentDidMount() {
    this.loadListOfMessages();
  }

  componentWillUnmount() {
    const {onMessagePress} = this.props;
    if (onMessagePress) {
      onMessagePress(null);
    }
  }

  render() {
    return (
      <ScreenWrapper>
        <ChatMessagesList data={this.listOfMessages} />
      </ScreenWrapper>
    );
  }
}

export default CurrentChatScreen;
