import React, {PureComponent} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';

import {showTime} from '../../utils/formatTime';

class ChatMessagesListItem extends PureComponent {
  render() {
    const {message} = this.props;
    return (
      <View>
        <Image source={message.icon} />
        <View>
          <View>
            <Text>{message.fromUser.fullName}</Text>
            <Text>{showTime(message.messageArrivedTime)}</Text>
          </View>
          <View>
            {message.messageAssets !== null && (
              <Image source={message.messageAssets} />
            )}
            {message.messageText && <Text>{message.messageText}</Text>}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default ChatMessagesListItem;
