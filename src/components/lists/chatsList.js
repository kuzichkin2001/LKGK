import React, {PureComponent} from 'react';
import {FlatList} from 'react-native';

import ChatListItem from '../listsItems/chatListItem';
import CommonTouchable from '../buttons/commonTouchable';

class ChatsList extends PureComponent {
  keyExtractor = item => item.chatId;

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
          extraData={data}
          renderItem={this.renderChatItem}
          keyExtractor={this.keyExtractor}
        />
      </>
    );
  }
}

export default ChatsList;
