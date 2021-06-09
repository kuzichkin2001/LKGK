import React, {PureComponent} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';

import CommonTouchable from './commonTouchable';
import chatButtons from '../../navigation/chatButtons';
import commonStyles from '../../styles';

class CreateChatButton extends PureComponent {
  render() {
    const {title, iconType, onPress} = this.props;
    return (
      <>
        <CommonTouchable onPress={onPress} style={styles.buttonLayout}>
          <Image
            style={styles.iconOffset}
            source={chatButtons[iconType].icon}
          />
          <Text
            style={[
              commonStyles.fonts.CeraProRegular,
              commonStyles.texts.grayChatButtonText,
            ]}>
            {title}
          </Text>
        </CommonTouchable>
      </>
    );
  }
}

const styles = StyleSheet.create({
  buttonLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 0.3,
    borderBottomColor: commonStyles.colors.gray,
    backgroundColor: commonStyles.colors.white,
  },
  iconOffset: {
    marginRight: 16,
  },
});

export default CreateChatButton;
