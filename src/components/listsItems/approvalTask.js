import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

import commonStyles from 'styles';
import formatDate from '../../utils/formatDate';

import MultipleAvatars from '../multipleUsersRow';
import IconText from '../iconText';
import CommonTouchable from '../buttons/commonTouchable';

const ApprovalTaskListItem = ({
  onPress,
  name,
  status,
  type,
  created_at,
  initiator,
}) => {
  const formattedDate = formatDate(created_at, 'DD.MM.YYYY');
  const {avatar} = initiator || {};
  return (
    <CommonTouchable onPress={onPress} style={styles.wrapper}>
      <Text numberOfLines={2} style={styles.name}>
        {name}
      </Text>
      <View style={styles.infoRow}>
        <View style={commonStyles.common.rowCenter}>
          <IconText
            color={commonStyles.colors.gray}
            icon={require('images/clock.png')}
            value={formattedDate}
          />
          {status != 0 && (
            <IconText
              icon={require('images/complete.png')}
              wrapperStyle={commonStyles.common.titledTextLeftOffset}
              value={type}
              color={commonStyles.colors.green}
            />
          )}
        </View>
        <MultipleAvatars avatars={[avatar]} />
      </View>
    </CommonTouchable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...commonStyles.common.listItem,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  date: {
    ...commonStyles.texts.common,
    color: commonStyles.colors.gray,
    textAlign: 'right',
    alignSelf: 'flex-start',
    paddingRight: commonStyles.spaces.m,
  },
  name: {
    ...commonStyles.texts.infoRowTitle,
    flex: 1,
  },
});

export default ApprovalTaskListItem;
