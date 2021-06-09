import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {View, FlatList, StyleSheet, Platform} from 'react-native';
import {observable, action, toJS} from 'mobx';

import screensId from '../navigation/screensId';
import commonStyles from 'styles';
import locale from '../locale';

import SideMenuButton from '../components/buttons/sideMenuButton';
import UserLogoInfo from '../components/userLogoInfo';
import TopBar from '../components/topBar';
import MainScreen from './MainScreen';

@inject('profileStore', 'authStore', 'navigationStore')
@observer
class SideMenu extends Component {
  static options() {
    return {
      id: screensId.SIDE_MENU,
    };
  }

  buttons = [
    ...MainScreen.buttons.map(button => ({
      ...button,
      iconStyle: {
        tintColor: commonStyles.colors.blue,
      },
    })),
    {
      title: locale.ru.logout,
      image: require('assets/images/mainMenu/logout.png'),
    },
  ];

  @observable
  logoutActivity = false;

  @action
  handleButtonPress = async data => {
    if (data.title === locale.ru.logout) {
      this.logoutActivity = true;
      await this.props.authStore.logout();
      this.logoutActivity = false;
      return;
    }
    this.props.navigationStore.pushScreen(data.screenId);
    setTimeout(
      () => {
        this.props.navigationStore.setLeftMenuVisibility(false);
      },
      Platform.select({
        ios: 250,
        android: 0,
      }),
    );
  };

  renderButton = ({item}) => {
    const badges = toJS(this.props.profileStore.badges);
    return (
      <SideMenuButton
        badge={!!badges && badges[item.badgeId]}
        activity={item.title === locale.ru.logout ? this.logoutActivity : false}
        onPress={() => this.handleButtonPress(item)}
        icon={item.image}
        title={item.title}
        {...item}
      />
    );
  };

  toProfile = () => {
    this.props.navigationStore.pushScreen(screensId.PROFILE);
    setTimeout(
      () => {
        this.props.navigationStore.setLeftMenuVisibility(false);
      },
      Platform.select({
        ios: 250,
        android: 0,
      }),
    );
  };

  render() {
    const {userData} = this.props.profileStore;

    return (
      <View style={[styles.wrapper, commonStyles.common.sideMenu]}>
        <TopBar title={locale.ru.menu} />
        <FlatList
          extraData={
            this.logoutActivity || toJS(this.props.profileStore.badges)
          }
          keyExtractor={item => item.title}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <UserLogoInfo
              isAchieve={!!userData && userData.achive_show}
              isOnline={userData ? userData.in_office : false}
              onPress={this.toProfile}
              title={
                userData ? (userData.name ? userData.name.full_name : '') : ''
              }
              avatarSettings={userData ? userData.avatar : null}
              subtitle={locale.ru.title_profile}
            />
          }
          data={this.buttons}
          renderItem={this.renderButton}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menuHeader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    backgroundColor: commonStyles.colors.white,
    flex: 1,
  },
});

export default SideMenu;
