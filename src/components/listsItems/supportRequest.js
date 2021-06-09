import React from 'react';
import {View, Text} from 'react-native';

import commonStyles from 'styles';
import locale from 'locale';
import formatDate from '../../utils/formatDate';

import IconText from '../iconText';
import CommonTouchable from '../buttons/commonTouchable';

export const getSupportRequestStatusTitle = status =>
  status
    ? locale.ru.support_request_status_sent
    : locale.ru.support_request_status_sending;

export const getSupportRequestStatusStyle = status =>
  status ? commonStyles.colors.green : commonStyles.colors.blue;

const SupportRequestListItem = ({onPress, data}) => {
  const statusValue = getSupportRequestStatusTitle(data.is_send);
  const statusValueStyle = getSupportRequestStatusStyle(data.is_send);
  return (
    <CommonTouchable
      style={commonStyles.common.listItem}
      disabled={!onPress}
      onPress={onPress}>
      <Text style={commonStyles.texts.infoRowTitle}>{data.title}</Text>
      <View
        style={[
          commonStyles.common.rowCenter,
          commonStyles.common.infoRowOffset,
        ]}>
        <IconText
          value={formatDate(data.created_at, 'DD.MM.YY')}
          icon={require('images/clock.png')}
          color={commonStyles.colors.gray}
        />
        <IconText
          wrapperStyle={commonStyles.common.titledTextLeftOffset}
          icon={require('images/complete.png')}
          color={statusValueStyle}
          value={statusValue}
        />
      </View>
    </CommonTouchable>
  );
};

export default SupportRequestListItem;
