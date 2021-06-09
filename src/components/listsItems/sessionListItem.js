import React, {PureComponent} from 'react';
import {Text, StyleSheet, View} from 'react-native';

import commonStyles from 'styles';
import formatDate from '../../utils/formatDate';

import CommonActivityIndicator from '../commonActivityIndicator';
import IconText from '../iconText';
import CommonTouchable from '../buttons/commonTouchable';

class SessionListItem extends PureComponent {
  render() {
    const {activity, onPress, data, wrapperStyle} = this.props;
    if (!data) {
      return null;
    }
    const {ip_address, user_agent, updated_at} = data;
    return (
      <CommonTouchable
        style={[styles.wrapper, wrapperStyle]}
        onPress={onPress}
        disabled={activity || !onPress}>
        <Text style={commonStyles.texts.infoRowTitle}>{user_agent}</Text>
        <View
          style={[
            commonStyles.common.rowCenterSpace,
            commonStyles.common.smallTopOffset,
          ]}>
          <IconText
            color={commonStyles.colors.label}
            icon={require('images/clock.png')}
            value={formatDate(updated_at, 'DD.MM.YY')}
          />
          <Text style={styles.ipAddress}>{ip_address}</Text>
        </View>
        {!!activity && (
          <CommonActivityIndicator isAbsoluteCenter={true} size={'small'} />
        )}
      </CommonTouchable>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    ...commonStyles.common.bottomBorder,
    paddingHorizontal: commonStyles.spaces.xl,
    paddingVertical: commonStyles.spaces.m,
    backgroundColor: commonStyles.colors.white,
  },
  mainInfoWrapper: {
    flex: 12,
    paddingRight: commonStyles.spaces.m,
  },
  sideInfoWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  ipAddress: {
    ...commonStyles.texts.labelSmall,
    fontSize: 13,
  },
});

export default SessionListItem;
