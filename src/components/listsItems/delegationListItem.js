import React, {PureComponent} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

import commonStyles from 'styles';
import locale from 'locale';
import formatDate from '../../utils/formatDate';

import CommonTouchable from '../buttons/commonTouchable';
import Avatar from '../avatar';

class DelegationListItem extends PureComponent {
  render() {
    const {onPress, data, type} = this.props;
    if (!data) {
      return null;
    }
    const {from_whom, on_whom, period_start, period_end, is_active} = data;
    const visibleUser =
      type === 'to_me' ? from_whom : on_whom ? on_whom : from_whom;
    const textStatus = is_active ? '' : locale.ru.delegation_inactive;
    const formattedStartDate = period_start
      ? `${locale.ru.from} ${formatDate(period_start, 'DD.MM.YY')} `
      : '';
    const formattedEndDate = period_start
      ? `${locale.ru.to} ${formatDate(period_end, 'DD.MM.YY')}`
      : '';
    const statusIcon = is_active
      ? require('images/complete.png')
      : require('images/list-item-delete.png');
    const statusColor = is_active
      ? commonStyles.colors.green
      : commonStyles.colors.label;
    const iconStyle = {
      tintColor: statusColor,
      transform: [{scale: is_active ? 1 : 1.37}],
    };
    const statusStyle = {color: statusColor};
    return (
      <CommonTouchable
        style={[commonStyles.common.listItem, commonStyles.common.row]}
        disabled={!onPress}
        onPress={onPress}>
        <Avatar {...(visibleUser || {}).avatar} />
        <View style={commonStyles.common.mediumLeftOffset}>
          <Text style={styles.userName}>{(visibleUser || {}).full_name}</Text>
          <View
            style={[
              commonStyles.common.rowEnd,
              commonStyles.common.smallTopOffset,
            ]}>
            <Image
              resizeMode={'contain'}
              source={statusIcon}
              style={[styles.icon, iconStyle]}
            />
            <Text style={[commonStyles.texts.infoRowTitle, statusStyle]}>
              {textStatus}
            </Text>
            {!!is_active && (
              <Text style={[commonStyles.texts.infoRowTitle, statusStyle]}>
                {`${formattedStartDate}${formattedEndDate}`}
              </Text>
            )}
          </View>
        </View>
      </CommonTouchable>
    );
  }
}

const styles = StyleSheet.create({
  userName: {
    ...commonStyles.texts.infoRowTitle,
    fontSize: 15,
  },
  icon: {
    height: 14,
    width: 14,
    marginRight: 5,
    alignSelf: 'center',
  },
});

export default DelegationListItem;
