import React, {PureComponent} from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Platform,
} from 'react-native';

import commonStyles from '../../styles';
import {MESSAGE_TYPE} from '../../constants';
import {showTime} from '../../utils/formatTime';
import CommonTouchable from '../buttons/commonTouchable';

const ACTIVITY = {
  INACTIVE: require('../../assets/images/inactive.png'),
  ACTIVE: require('../../assets/images/active.png'),
};

class ChatListItem extends PureComponent {
  render() {
    const {item, onPress} = this.props;
    const showCurrentChat = () => {
      onPress(item);
    };
    return (
      <CommonTouchable onPress={showCurrentChat}>
        <View style={[commonStyles.common.listItem, styles.listItem]}>
          <Image
            source={item.userAvatar || item.chatAvatar}
            style={styles.imageOffset}
          />
          <View style={styles.commonChatInfo}>
            <View style={styles.titleRowContent}>
              <Image
                source={
                  item.currentlyOnline ? ACTIVITY.ACTIVE : ACTIVITY.INACTIVE
                }
                style={styles.activityIconOffset}
              />
              <Text
                numberOfLines={1}
                style={[styles.userNameInfo, commonStyles.texts.titleBig]}>
                {item.messageType === MESSAGE_TYPE.GROUP_CHAT
                  ? item.chatName
                  : item.fromUser.fullName}
              </Text>
            </View>
            <Text style={styles.messageContent} numberOfLines={2}>
              {item.messages.length !== 0
                ? item.messages[item.messages.length - 1].messageText
                : 'Начните диалог!'}
            </Text>
          </View>
          <Text style={[styles.messageTimeOffset, commonStyles.texts.titleBig]}>
            {item.messages.length !== 0
              ? showTime(
                  item.messages[item.messages.length - 1].messageArrivedTime,
                )
              : showTime(new Date())}
          </Text>
        </View>
      </CommonTouchable>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: Dimensions.get('screen').width,
  },
  titleRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commonChatInfo: {
    flexDirection: 'column',
  },
  imageOffset: {
    marginRight: 18,
  },
  activityIconOffset: {
    marginRight: 5,
  },
  userNameInfo: {
    width:
      Dimensions.get('screen').width * (Platform.OS === 'ios' ? 0.6 : 0.55),
  },
  messageTimeOffset: {
    marginRight: 17,
  },
  messageContent: {
    ...commonStyles.texts.grayLabel,
    width:
      Dimensions.get('screen').width * (Platform.OS === 'ios' ? 0.6 : 0.55),
    flexWrap: 'wrap',
  },
});

export default ChatListItem;
