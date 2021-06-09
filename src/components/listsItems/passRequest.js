import React from 'react';
import {Text, View} from 'react-native';

import commonStyles from 'styles';
import formatDate from '../../utils/formatDate';
import locale from 'locale';

import IconText from '../iconText';
import CommonTouchable from '../buttons/commonTouchable';

export const getPassRequestStatusTextDescription = statusCode => {
  switch (statusCode + '') {
    case '0':
      return locale.ru.request_status_new;
    case '1':
      return locale.ru.request_status_approved;
    case '2':
      return locale.ru.other_errors;
    case '3':
      return locale.ru.error;
    default:
      return locale.ru.unknown_status;
  }
};

export const getPassRequestStatusStyle = statusCode => {
  switch (statusCode + '') {
    case '0':
      return commonStyles.colors.orange;
    case '1':
      return commonStyles.colors.green;
    case '2':
    case '3':
      return commonStyles.colors.red;
    default:
      return commonStyles.colors.blue;
  }
};

const PassRequestListItem = ({data, onPress}) => (
  <CommonTouchable
    style={commonStyles.common.listItem}
    disabled={!onPress}
    onPress={onPress}>
    <Text numberOfLines={1} style={commonStyles.texts.infoRowTitle}>
      {data.title}
    </Text>
    <View
      style={[
        commonStyles.common.rowCenter,
        commonStyles.common.infoRowOffset,
      ]}>
      <IconText
        color={commonStyles.colors.gray}
        value={formatDate(data.created_at, 'DD.MM.YY')}
        icon={require('images/clock.png')}
      />
      <IconText
        wrapperStyle={commonStyles.common.titledTextLeftOffset}
        color={getPassRequestStatusStyle(data.status)}
        value={getPassRequestStatusTextDescription(data.status)}
        icon={require('images/complete.png')}
      />
    </View>
  </CommonTouchable>
);

export default PassRequestListItem;
