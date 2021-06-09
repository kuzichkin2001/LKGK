import React, {PureComponent} from 'react';
import {ScrollView, View} from 'react-native';

import locale from 'locale';
import commonStyles from 'styles';
import formatDate from '../utils/formatDate';

import TitledInfoRow from './titledInfoRow';
import TitledUserRow from './titledUserRow';
import LargeSubmitButton from './buttons/largeSubmitButton';

//TODO change date format & move strings to locale
class DelegationInfo extends PureComponent {
  render() {
    const {
      data,
      onEmployeePress,
      onStatusChangePress,
      statusChangeActivity,
      isInitiator,
    } = this.props;
    if (!data) {
      return null;
    }
    const {is_active, from_whom, on_whom, period_start, period_end} = data;

    const textStatus = is_active
      ? locale.ru.delegation_active
      : locale.ru.delegation_inactive;
    const formattedStartDate = period_start
      ? `${locale.ru.from} ${formatDate(period_start, 'DD.MM.YY')} `
      : '';
    const formattedEndDate = period_start
      ? `${locale.ru.to} ${formatDate(period_end, 'DD.MM.YY')}`
      : '';
    return (
      <View style={commonStyles.common.flex1}>
        <ScrollView>
          <TitledInfoRow
            value={textStatus}
            title={locale.ru.status}
            icon={require('images/rows.png')}
          />
          <TitledInfoRow
            value={`${formattedStartDate}${formattedEndDate}`}
            title={locale.ru.delegation_period}
            icon={require('images/date.png')}
          />
          <TitledUserRow
            onPress={() => onEmployeePress(from_whom)}
            userData={from_whom}
            title={locale.ru.delegation_from}
          />
          {!!on_whom && (
            <TitledUserRow
              onPress={() => onEmployeePress(on_whom)}
              userData={on_whom}
              title={locale.ru.delegation_to}
            />
          )}
        </ScrollView>
        {!is_active && (
          <LargeSubmitButton
            isSubmitting={statusChangeActivity}
            title={locale.ru.set_active}
            onPress={onStatusChangePress}
          />
        )}
        {!!is_active && !!isInitiator && (
          <LargeSubmitButton
            isSubmitting={statusChangeActivity}
            title={locale.ru.set_delegation_inactive}
            onPress={onStatusChangePress}
          />
        )}
      </View>
    );
  }
}

export default DelegationInfo;
