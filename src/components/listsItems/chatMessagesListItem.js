import React, {PureComponent} from 'react';
import {StyleSheet, View, Text, Image, Dimensions} from 'react-native';

import {showTime} from '../../utils/formatTime';
import commonStyles from '../../styles';

const width = Dimensions.get('screen').width;

class ChatMessagesListItem extends PureComponent {
  render() {
    const {message} = this.props;
    return (
      <View style={styles.content}>
        <Image source={message.fromUser.icon} />
        <View style={styles.messageLayout}>
          <View style={styles.messageTopRow}>
            <Text style={styles.sender} numberOfLines={1}>
              {message.fromUser.fullName}
            </Text>
            <Text style={commonStyles.texts.chatMessageTime}>
              {showTime(message.messageArrivedTime)}
            </Text>
          </View>
          <View style={styles.messageContent}>
            {message.messageAssets !== null && (
              <Image
                style={styles.messageAsset}
                source={{uri: message.messageAssets}}
              />
            )}
            {message.messageText !== null && (
              <Text style={commonStyles.texts.chatMessageText}>
                {message.messageText}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    width,
    paddingHorizontal: width * 0.03,
    paddingVertical: width * 0.03,
    flexDirection: 'row',
  },
  messageLayout: {
    width: width * 0.8,
    paddingLeft: width * 0.03,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  messageTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sender: {
    width: width * 0.6,
    ...commonStyles.texts.chatMessageSender,
  },
});

export default ChatMessagesListItem;
