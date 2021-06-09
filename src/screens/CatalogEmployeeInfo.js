import React, {Component} from 'react';
import {observable, action, computed} from 'mobx';
import {observer, inject} from 'mobx-react';
import {
  ActivityIndicator,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import locale from 'locale';
import commonStyles from 'styles';
import screensId from '../navigation/screensId';
import requests from '../network/requests';
import {showMessage} from '../utils/showMessage';

import ScreenWrapper from '../components/ScreenWrapper';
import UserProfileHeader from '../components/userProfileHeader';
import Divider from '../components/divider';
import InfoRowsList from '../components/lists/infoRowsList';
import ProfileButtonsList from '../components/lists/profileButtonsList';
import LargeSubmitButton from '../components/buttons/largeSubmitButton';
import AwardsList from '../components/lists/awardsList';
import TitledRowSwitch from '../components/titledRowSwitch';

@inject('navigationStore', 'profileStore')
@observer
class CatalogEmployeeInfoScreen extends Component {
  static options() {
    return {
      id: screensId.CATALOG_EMPLOYEE_INFO,
      topBar: {
        visible: true,
      },
    };
  }

  fieldsFirstPart = [
    {
      icon: require('images/action-dots.png'),
      onPress: () => this.handleButtonPress('unit'),
      title: locale.ru.employee_unit,
      field: 'unit',
    },
    {
      onPress: () => this.handleButtonPress('chief_main'),
      title: locale.ru.employee_main_chief,
      field: 'chief_main',
    },
    {
      onPress: () => this.handleButtonPress('chief'),
      title: locale.ru.employee_chief,
      field: 'chief',
    },
    {
      title: locale.ru.office_address,
      field: 'office_address',
    },
  ];

  fieldsSecondPart = [
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

  @observable
  userData = null;

  @observable
  userDataActivity = false;

  @observable
  subscribedToUser = false;

  @observable
  canBeSubscribed = false;

  @observable
  subscriptionActivity = false;

  @computed
  get isContactsVisible() {
    let result = false;
    if (!this.userData) {
      return result;
    }
    try {
      const {
        userData: {email = null, phone_mobile = null, phone_work = null},
      } = this;
      result = !!email || !!phone_mobile || !!phone_work;
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  @computed
  get isAchievementsVisible() {
    let result = false;
    try {
      result =
        !!this.userData &&
        !!this.userData.achive_show &&
        (!!this.userData.achive_desc || !!this.userData.achive_has);
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  @computed
  get isVisitsStatisticAvailable() {
    let result = false;
    try {
      const {id_phperson} = this.props.profileStore.userData;
      result =
        (!!this.userData && !!this.props.isSubordinate) ||
        (!!this.userData &&
          !!id_phperson &&
          id_phperson === this.userData.chief_main_id) ||
        (!!this.userData &&
          !!id_phperson &&
          id_phperson === this.userData.chief_id);
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  @computed
  get buttons() {
    let buttons = [
      {
        screenId: screensId.USER_DIARY,
        icon: require('assets/images/date.png'),
        title: locale.ru.title_user_diary,
      },
    ];
    return buttons;
  }

  @action
  getUserData = async () => {
    try {
      this.userDataActivity = true;
      let response = await requests.catalogEmployeeData(
        this.props.employeeData.id_phperson || this.props.notificationApiId,
      );
      if (response.data.result) {
        this.userData = response.data.data;
      } else {
        showMessage(locale.ru.error, locale.ru.couldnt_load_employee_info);
      }
      this.userDataActivity = false;
      // check can subscribe to user - can_subscribe
      this.subscriptionActivity = true;
      response = await requests.checkSubscriptionUserEnterOffice(
        this.props.employeeData.id_phperson,
      );
      if (response && response.data && response.data.result) {
        const {can_subscribe, is_subscribed} = response.data.result;
        this.canBeSubscribed = can_subscribe;
        this.subscribedToUser = is_subscribed;
      }
    } catch (e) {
      showMessage(locale.ru.error, locale.ru.error_network);
      console.log(e);
      this.userDataActivity = false;
    }
    this.subscriptionActivity = false;
  };

  handleRefresh = () => {
    if (!this.userDataActivity) {
      this.getUserData();
    }
  };

  componentDidMount() {
    this.getUserData();
  }

  pushToPerson = employeeId => {
    this.props.navigationStore.pushScreen(screensId.CATALOG_EMPLOYEE_INFO, {
      employeeData: {
        id_phperson: employeeId,
      },
    });
  };

  handleNaviButtonPress = item => {
    const passProps = {
      userData: this.userData,
    };
    const options = {};
    this.props.navigationStore.pushScreen(item.screenId, passProps, options);
  };

  handleButtonPress = fieldId => {
    try {
      switch (fieldId) {
        case 'chief':
          this.pushToPerson(this.userData.chief_id);
          break;
        case 'chief_main':
          this.pushToPerson(this.userData.chief_main_id);
          break;
        case 'unit':
          this.props.navigationStore.pushScreen(screensId.CATALOG_EMPLOYEES, {
            unitId: this.userData.department_guid,
          });
          break;
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleVisitsStatisticPress = () => {
    this.props.navigationStore.pushScreen(screensId.VISITS_STATISTIC, {
      userData: this.userData,
      isCatalogStatistic: true,
    });
  };

  handleChangeSubscription = async e => {
    if (e !== this.subscribedToUser && this.canBeSubscribed) {
      this.subscriptionActivity = true;
      try {
        const response = await requests.switchSubscriptionUserEnterOffice(
          this.props.employeeData.id_phperson,
          e,
        );
        if (response && response.data && response.data.result) {
          showMessage(
            locale.ru.successfully,
            `Подписка на событие в${e ? '' : 'ы'}ключена`,
          );
          this.subscribedToUser = e;
        } else {
          showMessage(
            locale.ru.error,
            `Не удалось в${e ? '' : 'ы'}ключить подписку на событие`,
          );
        }
      } catch (e) {
        console.log(e);
        showMessage(locale.ru.error, locale.ru.error_network);
      }
      this.subscriptionActivity = false;
    }
  };

  render() {
    return (
      <ScreenWrapper>
        {!this.userData && !!this.userDataActivity && (
          <ActivityIndicator
            style={commonStyles.common.topOffsetXL}
            size={'large'}
            color={commonStyles.colors.label}
          />
        )}
        <ScrollView
          overScrollMode={'never'}
          bounces={false}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}>
          <UserProfileHeader userData={this.userData} />
          {!!this.userData && (
            <>
              <AwardsList data={this.userData} />
              <Divider title={locale.ru.personal_info} />
              <ProfileButtonsList
                scrollEnabled={false}
                onPress={this.handleNaviButtonPress}
                data={this.buttons}
              />
              <InfoRowsList
                scrollEnabled={false}
                ListHeaderComponent={<Divider title={locale.ru.information} />}
                userData={this.userData}
                data={this.fieldsFirstPart}
              />
            </>
          )}
          {!!(this.userData && this.userData.online_office) && (
            <View style={commonStyles.common.listWrapper}>
              <View style={commonStyles.common.iconBox} />
              <View style={commonStyles.common.dataOffset}>
                <View>
                  <Text style={commonStyles.texts.label}>
                    {locale.ru.online_office}
                  </Text>
                </View>
                <View style={styles.onlineOfficeWrapper}>
                  <View style={styles.textRoundedWrapper}>
                    <View style={styles.filledCircle} />
                    <Text style={styles.onlineOfficeText}>
                      {this.userData.online_office || ''}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
          {!!this.userData && (
            <InfoRowsList
              scrollEnabled={false}
              userData={this.userData}
              data={this.fieldsSecondPart}
            />
          )}
          {!!this.isContactsVisible && (
            <ProfileButtonsList
              ListHeaderComponent={<Divider title={locale.ru.contacts} />}
              userData={this.userData}
              scrollEnabled={false}
              data={this.contacts}
            />
          )}
          {this.canBeSubscribed && (
            <>
              <Divider title={locale.ru.subscriptions} />
              <TitledRowSwitch
                onValueChange={this.handleChangeSubscription}
                value={this.subscribedToUser}
                icon={require('images/share.png')}
                title={locale.ru.enter_to_office}
                activity={this.subscriptionActivity}
              />
            </>
          )}
        </ScrollView>
        {!!this.isVisitsStatisticAvailable && (
          <LargeSubmitButton
            onPress={this.handleVisitsStatisticPress}
            title={locale.ru.title_visits_statistic}
          />
        )}
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  onlineOfficeWrapper: {
    flexDirection: 'row',
    marginTop: 5,
  },
  textRoundedWrapper: {
    height: 25,
    minWidth: 50,
    width: 'auto',
    borderColor: 'green',
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: 'center',
  },
  filledCircle: {
    height: 25,
    width: 25,
    borderRadius: 25,
    position: 'absolute',
    left: -1,
    top: -1,
    color: 'green',
    borderColor: 'green',
    borderWidth: 1,
    backgroundColor: 'green',
  },
  onlineOfficeText: {
    marginLeft: 35,
    marginRight: 20,
    width: 'auto',
  },
});

export default CatalogEmployeeInfoScreen;
