import React, {PureComponent} from 'react';
import {StyleSheet, FlatList} from 'react-native';

import ChatListItem from '../listsItems/chatListItem';
import CommonTouchable from '../buttons/commonTouchable';

class ChatsList extends PureComponent {
  keyExtractor = item => item.messageId;

  renderChatItem = ({item}) => {
    const {handleChatPress} = this.props;
    return (
      <CommonTouchable>
        <ChatListItem onPress={handleChatPress} item={item} />
      </CommonTouchable>
    );
  };

  render() {
    const {data} = this.props;
    return (
      <>
        <FlatList
          data={data}
          renderItem={this.renderChatItem}
          keyExtractor={this.keyExtractor}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({});

export default ChatsList;
