import React, {PureComponent} from 'react';
import {StyleSheet, View, Text, Image, Dimensions} from 'react-native';

import {showTime} from '../../utils/formatTime';

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
            <Text style={styles.sendTime}>
              {showTime(message.messageArrivedTime)}
            </Text>
          </View>
          <View style={styles.messageContent}>
            {message.messageAssets && (
              <Image
                style={styles.messageAsset}
                source={message.messageAssets}
              />
            )}
            {message.messageText && (
              <Text style={styles.messageText}>{message.messageText}</Text>
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
  },
});

export default ChatMessagesListItem;
