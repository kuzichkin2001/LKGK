import React, {PureComponent} from 'react';
import {Text, View} from 'react-native';

import commonStyles from 'styles';
import formatDate from '../../utils/formatDate';

import CommonTouchable from '../buttons/commonTouchable';
import IconText from '../iconText';
import Avatar from '../avatar';
import {taskStatus, taskStatusColors, taskStatusEnum} from '../../constants';
import {
  isRequestTypeAbsence,
  isRequestTypeVacation,
} from '../../utils/vacations';

class VacationRequestsListItem extends PureComponent {
  createDateOutput(data) {
    if (isRequestTypeAbsence(data.bp_type_alias)) {
      return `${formatDate(data.date_absence, 'DD.MM.YY')} ${data.time_in} - ${
        data.time_out
      }`;
    } else if (isRequestTypeVacation(data.bp_type_alias)) {
      return `${formatDate(data.date_in, 'DD.MM.YY')} - ${formatDate(
        data.date_out,
        'DD.MM.YY',
      )}`;
    }
    return '';
  }

  render() {
    const {data, onPress} = this.props;
    if (!data) {
      return null;
    }
    const title = data.theme || data.note || data.number;
    const date = this.createDateOutput(data);
    const avatar = data.initiator_user && data.initiator_user.avatar;
    return (
      <CommonTouchable onPress={onPress} style={commonStyles.common.listItem}>
        <Text numberOfLines={1} style={commonStyles.texts.infoRowTitle}>
          {title}
        </Text>
        <View
          style={[
            commonStyles.common.infoRowOffset,
            commonStyles.common.rowCenterSpace,
          ]}>
          <View style={commonStyles.common.rowCenter}>
            {!!date && (
              <IconText
                wrapperStyle={commonStyles.common.titledTextRightOffset}
                color={commonStyles.colors.gray}
                icon={require('images/date.png')}
                value={date}
              />
            )}
            {!!taskStatus[data.current_status_id] && (
              <IconText
                color={
                  taskStatusColors[data.current_status_id] ||
                  commonStyles.colors.gray
                }
                // avoiding empty sting image src warning
                {...{
                  icon:
                    data.current_status_id ===
                    taskStatusEnum.TASK_STATUS_COMPLETED
                      ? require('images/complete.png')
                      : undefined,
                }}
                value={taskStatus[data.current_status_id]}
              />
            )}
          </View>

          {!!avatar && <Avatar {...avatar} isSmall={true} />}
        </View>
      </CommonTouchable>
    );
  }
}

export default VacationRequestsListItem;
