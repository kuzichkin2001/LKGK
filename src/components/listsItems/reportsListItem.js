import React from 'react';
import {Text} from 'react-native';

import commonStyles from 'styles';
import formatDate from '../../utils/formatDate';

import IconText from '../iconText';
import CommonTouchable from '../buttons/commonTouchable';

const ReportListItem = ({data, onPress}) => {
  if (!data) {
    return null;
  }
  const {title, created_at, updated_at} = data;
  return (
    <CommonTouchable
      style={commonStyles.common.listItem}
      onPress={onPress}
      disabled={!onPress}>
      <Text style={commonStyles.texts.infoRowTitle}>{title}</Text>
      <IconText
        wrapperStyle={commonStyles.common.infoRowOffset}
        value={formatDate(updated_at || created_at, 'DD.MM.YY HH:mm')}
        icon={require('images/clock.png')}
        color={commonStyles.colors.gray}
      />
    </CommonTouchable>
  );
};

export default ReportListItem;
