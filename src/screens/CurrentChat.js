import React, {Component} from 'react';
import {TextInput, View, StyleSheet, Dimensions, Image, TouchableOpacity, Text} from 'react-native';

import {observable, action, computed} from 'mobx';
import screensId from '../navigation/screensId';
import locale from '../locale';
import topBarButtons from '../navigation/topBarButtons';
import commonStyles from 'styles';

import ChatScreenWrapper from '../components/ChatScreenWrapper';
import ChatMessagesList from '../components/lists/chatMessagesList';
import {MOCK_USERS} from '../constants';

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
  @observable
  value = {
    fromUser: MOCK_USERS[0],
    messageId: 5,
    messageAssets: null,
    messageText: '',
    messageArrivedTime: new Date(),
  };

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
  @action
  addMessage(item) {
    this.listOfMessages.push(item);
    this.value.messageText = '';
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
      <>
        <ChatScreenWrapper>
          <ChatMessagesList data={this.listOfMessages} />
        </ChatScreenWrapper>
        <TouchableOpacity
          onPress={() => {
            this.addMessage(this.value);
          }}>
          <View style={[{backgroundColor: 'rgba(255,0,0,0.2)'}]}>
            <Text>Add Item</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.input}>
          <Image source={require('../assets/images/InputButtons/smile.png')} />
          <TextInput
            placeholder="Введите текст сообщения..."
            placeholderTextColor="#7C8598"
            style={styles.input2}
            defaultValue={this.value.messageText}
          />
          <View style={styles.buttons}>
            <Image source={require('../assets/images/InputButtons/add.png')} />
            <Image
              source={require('../assets/images/InputButtons/add-2.png')}
            />
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: Dimensions.get('screen').width,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: commonStyles.colors.backgroundGray,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('screen').width * 0.2,
  },
  input2: {
    width: Dimensions.get('screen').width * 0.65,
    paddingLeft: Dimensions.get('screen').width * 0.05,
    justifyContent: 'center',
    fontSize: 16,
    alignItems: 'center',
  },
});

export default CurrentChatScreen;
