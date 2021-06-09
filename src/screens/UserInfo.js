import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

import screensId from '../navigation/screensId';
import locale from '../locale';

import UserInfoList from '../components/lists/userInfoList';
import ScreenWrapper from '../components/ScreenWrapper';

@inject('profileStore')
@observer
class UserInfoScreen extends Component {
  static options() {
    return {
      id: screensId.USER_INFO,
      topBar: {
        title: {
          text: locale.ru.title_user_info,
        },
      },
    };
  }

  fields = [
    {
      title: locale.ru.employee_unit,
      field: 'unit',
    },
    {
      title: locale.ru.office_address,
      field: 'office_address',
    },
    {
      title: locale.ru.cabinet,
      field: 'office_cabinet',
    },
    {
      title: locale.ru.work_phone,
      field: 'phone_work',
      // linking: 'phone',
    },
    {
      title: locale.ru.mobile_phone,
      field: 'phone_mobile',
      linking: 'phone',
    },
    {
      title: locale.ru.holidays_amount,
      field: 'amount_holiday_days',
    },
    {
      title: locale.ru.schedule,
      field: 'schedule',
    },
    {
      title: locale.ru.status,
      field: 'status',
    },
  ];

  render() {
    const {userData} = this.props.profileStore;

    return (
      <ScreenWrapper>
        <UserInfoList userData={userData} fields={this.fields} />
      </ScreenWrapper>
    );
  }
}

export default UserInfoScreen;
