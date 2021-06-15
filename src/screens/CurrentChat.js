import React, {Component} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
} from 'react-native';
import pickPhoto from '../utils/pickPhoto';

import {observable, action, computed, toJS} from 'mobx';
import {observer} from 'mobx-react';
import screensId from '../navigation/screensId';
import locale from '../locale';
import topBarButtons from '../navigation/topBarButtons';
import commonStyles from 'styles';

import CommonTouchable from '../components/buttons/commonTouchable';
import ChatMessagesList from '../components/lists/chatMessagesList';
import {MOCK_USERS} from '../constants';

@observer
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
  messageText = '';

  @observable
  withUser = this.props.participants;

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
    this.listOfMessages = [];
    this.props.data.forEach(item => {
      this.listOfMessages.push(item);
    });
    console.log(this.listOfMessages);
  }
  addMessage = item => {
    this.listOfMessages.push(item);
  };

  @action
  sendMessage() {
    const newMessage = {
      fromUser: MOCK_USERS[3],
      messageId: this.listOfMessages.length + 1,
      messageAssets: null,
      messageText: this.messageText,
      messageArrivedTime: new Date(),
    };
    this.addMessage(newMessage);
    this.messageText = '';
  }

  @action
  async sendAsset() {
    const link = pickPhoto().uploadUrl;
    const newMessage = {
      fromUser: MOCK_USERS[3],
      messageId: this.listOfMessages.length + 1,
      messageAssets: link,
      messageText: null,
      messageArrivedTime: new Date(),
    };
    this.addMessage(newMessage);
    this.messageText = '';
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
      <View style={styles.layout}>
        <View style={[styles.messagesList]}>
          {this.listOfMessages.length === 0 ? (
            <Text>
              {this.withUser.length
                ? `Это ваш диалог с ${this.withUser.fullName}`
                : 'В чате до сих пор нет сообщений...'}
            </Text>
          ) : (
            <ChatMessagesList data={toJS(this.listOfMessages)} />
          )}
        </View>
        <View style={styles.input}>
          <CommonTouchable>
            <Image
              source={require('../assets/images/InputButtons/smile.png')}
            />
          </CommonTouchable>
          <TextInput
            placeholder="Введите текст сообщения..."
            placeholderTextColor="#7C8598"
            style={styles.messageInput}
            value={this.messageText}
            onChangeText={value => {
              this.messageText = value;
            }}
          />
          <View style={styles.buttons}>
            <CommonTouchable onPress={() => this.sendAsset()}>
              <Image
                source={require('../assets/images/InputButtons/add.png')}
              />
            </CommonTouchable>
            <CommonTouchable onPress={() => this.sendMessage()}>
              <Image
                source={require('../assets/images/InputButtons/add-2.png')}
              />
            </CommonTouchable>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
  },
  messagesList: {
    flex: 1,
    flexDirection: 'column-reverse',
  },
  input: {
    width: Dimensions.get('screen').width,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: commonStyles.colors.backgroundGray,
    borderTopWidth: 1,
    borderTopColor: '#DFE1E5',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('screen').width * 0.2,
  },
  messageInput: {
    width: Dimensions.get('screen').width * 0.65,
    paddingLeft: Dimensions.get('screen').width * 0.05,
    justifyContent: 'center',
    fontSize: 16,
    alignItems: 'center',
  },
});

export default CurrentChatScreen;
