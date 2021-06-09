import React from 'react';
import {Text, View} from 'react-native';

import commonStyles from 'styles';
import formatDate from '../../utils/formatDate';

import IconText from '../iconText';
import MultipleAvatars from '../multipleUsersRow';
import CommonTouchable from '../buttons/commonTouchable';
import {taskStatus, taskStatusColors} from '../../constants';

const TaskListItem = ({data, onPress, avatarSettings}) => {
  if (!data) {
    return null;
  }
  const avatars = [avatarSettings, ...data.observers, ...data.assistants];
  return (
    <CommonTouchable
      style={[
        commonStyles.common.listItem,
        commonStyles.common.mediumBottomOffset,
      ]}
      onPress={onPress}>
      <Text numberOfLines={2} style={commonStyles.texts.infoRowTitle}>
        {data.theme}
      </Text>
      <View
        style={[
          commonStyles.common.rowCenterSpace,
          commonStyles.common.infoRowOffset,
        ]}>
        <View style={commonStyles.common.rowCenter}>
          {!!data.date_start && (
            <IconText
              wrapperStyle={commonStyles.common.titledTextRightOffset}
              color={commonStyles.colors.gray}
              icon={require('images/clock.png')}
              value={formatDate(data.date_start, 'DD.MM.YY') || ''}
            />
          )}
          {!!taskStatus[data.current_status_id] && (
            <IconText
              color={
                taskStatusColors[data.current_status_id] ||
                commonStyles.colors.gray
              }
              icon={require('images/complete.png')}
              value={taskStatus[data.current_status_id]}
            />
          )}
        </View>
        <MultipleAvatars avatars={avatars} />
      </View>
    </CommonTouchable>
  );
};

export default TaskListItem;
