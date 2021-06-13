import React, {PureComponent} from 'react';
import {StyleSheet, FlatList, View} from 'react-native';
import ScreenWrapper from '../ScreenWrapper';

import {inject} from 'mobx-react';
import ChatMessagesListItem from '../listsItems/chatMessagesListItem';

class ChatMessagesList extends React.Component {
  keyExtractor = item => item.messageId;

  renderMessage = ({item}) => {
    return <ChatMessagesListItem message={item} />;
  };

  render() {
    const {data} = this.props;
    return (
      <ScreenWrapper>
        <FlatList
          data={data}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderMessage}
        />
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({});

export default ChatMessagesList;
