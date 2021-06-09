import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {computed} from 'mobx';
import {ScrollView} from 'react-native';

import screensId from '../navigation/screensId';
import locale from '../locale';

import ProfileButtonsList from '../components/lists/profileButtonsList';
import ScreenWrapper from '../components/ScreenWrapper';
import Divider from '../components/divider';
import UserProfileHeader from '../components/userProfileHeader';
import InfoRowsList from '../components/lists/infoRowsList';
import AwardsList from '../components/lists/awardsList';

@inject('profileStore', 'navigationStore')
@observer
class ProfileScreen extends Component {
  static options() {
    return {
      id: screensId.PROFILE,
      topBar: {
        visible: true,
      },
    };
  }

  @computed
  get buttons() {
    let buttons = [
      {
        screenId: screensId.USER_PAYROLL,
        icon: require('assets/images/receipt.png'),
        title: locale.ru.settlement_sheet,
      },
      {
        screenId: screensId.VISITS_STATISTIC,
        icon: require('assets/images/alarm.png'),
        title: locale.ru.title_visits_statistic,
      },
      {
        screenId: screensId.USER_DIARY,
        icon: require('assets/images/date.png'),
        title: locale.ru.title_user_diary,
      },
    ];
    try {
      const vacationDays = {
        title: `${locale.ru.holidays_amount}: ${
          this.props.profileStore.userData.vacation_days
        }`,
        icon: require('images/vacation.png'),
        disabled: true,
      };
      buttons = [buttons[0], vacationDays, ...buttons.slice(1)];
    } catch (e) {
      console.log(e);
    }
    return buttons;
  }

  fields = [
    {
      icon: require('images/action-dots.png'),
      onPress: () => this.handleInfoButtonPress('unit'),
      title: locale.ru.employee_unit,
      field: 'unit',
    },
    {
      onPress: () => this.handleInfoButtonPress('chief_main'),
      title: locale.ru.employee_main_chief,
      field: 'chief_main',
    },
    {
      onPress: () => this.handleInfoButtonPress('chief'),
      title: locale.ru.employee_chief,
      field: 'chief',
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
      title: locale.ru.schedule,
      field: 'schedule',
    },
    {
      title: locale.ru.status,
      field: 'status',
    },
  ];

  contacts = [
    {
      icon: require('images/email.png'),
      field: 'email',
      linking: 'email',
    },
    {
      icon: require('images/phone.png'),
      field: 'phone_mobile',
      linking: 'phone',
    },
    {
      icon: require('images/phone.png'),
      field: 'phone_work',
      // linking: 'phone',
    },
  ];

  handleButtonPress = item => {
    const {userData} = this.props.profileStore;
    let passProps = {};
    let options = {};
    if (item.screenId === screensId.CATALOG_EMPLOYEE_INFO) {
      passProps.employeeData = this.props.profileStore.userData;
      options = {
        topBar: {
          title: {
            text: item.title,
          },
        },
      };
    }
    if (item.screenId === screensId.USER_DIARY) {
      passProps = {
        userData,
      };
    }
    this.props.navigationStore.pushScreen(item.screenId, passProps, options);
  };

  handleInfoButtonPress = field => {
    try {
      const {userData} = this.props.profileStore;
      switch (field) {
        case 'chief':
          this.pushToPerson(userData.chief_id);
          break;
        case 'chief_main':
          this.pushToPerson(userData.chief_main_id);
          break;
        case 'unit':
          this.props.navigationStore.pushScreen(screensId.CATALOG_EMPLOYEES, {
            unitId: userData.department_guid,
          });
          break;
      }
    } catch (e) {
      console.log(e);
    }
  };

  pushToPerson = employeeId => {
    this.props.navigationStore.pushScreen(screensId.CATALOG_EMPLOYEE_INFO, {
      employeeData: {
        id_phperson: employeeId,
      },
    });
  };

  render() {
    const {userData} = this.props.profileStore;

    return (
      <ScreenWrapper>
        <ScrollView
          overScrollMode={'never'}
          bounces={false}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}>
          <UserProfileHeader userData={userData} />
          <AwardsList data={userData} />
          <Divider title={locale.ru.personal_info} />
          <ProfileButtonsList
            scrollEnabled={false}
            onPress={this.handleButtonPress}
            data={this.buttons}
          />
          <Divider title={locale.ru.information} />
          <InfoRowsList userData={userData} data={this.fields} />
          <Divider title={locale.ru.contacts} />
          <ProfileButtonsList
            userData={userData}
            scrollEnabled={false}
            data={this.contacts}
          />
        </ScrollView>
      </ScreenWrapper>
    );
  }
}

export default ProfileScreen;
