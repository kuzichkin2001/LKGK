import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {toJS} from 'mobx';
import {
  View,
  FlatList,
  StyleSheet,
  Keyboard,
  Text,
  Platform,
} from 'react-native';
import {getVersion} from 'react-native-device-info';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';

import screensId from '../navigation/screensId';
import locale from '../locale';
import commonStyles from 'styles';
import openLink from '../utils/openLink';

import SquareMenuButton from '../components/buttons/squareMenuButton';
import ScreenNetworkConnectionIndicator from '../components/screenNetworkConnectionIndicator';
import EmployeePickListItem from '../components/listsItems/employeePickListItem';

@inject('profileStore', 'navigationStore', 'notificationsStore')
@observer
class MainScreen extends Component {
  static options() {
    return {
      id: screensId.MAIN_SCREEN,
      topBar: {
        visible: false,
      },
    };
  }

  static buttons = [
    {
      badgeId: 'approval',
      screenId: screensId.APPROVALS_CABINET,
      title: locale.ru.approvals_cabinet,
      image: require('images/mainMenu/main-approves.png'),
    },
    {
      screenId: screensId.TASKS_LIST,
      title: locale.ru.tasks,
      image: require('images/mainMenu/main-tasks.png'),
    },
    {
      screenId: screensId.HEAD_OFFICE,
      title: locale.ru.title_head_office,
      image: require('images/mainMenu/main-cabinet.png'),
    },
    {
      screenId: screensId.REQUESTS,
      title: locale.ru.requests,
      image: require('images/mainMenu/main-requests.png'),
    },
    {
      screenId: screensId.REQUESTS_MEMORANDUMS,
      title: locale.ru.memorandums,
      image: require('images/mainMenu/main-service_note.png'),
    },
    {
      screenId: screensId.REPORTS,
      title: locale.ru.reports,
      image: require('images/mainMenu/main-reports.png'),
    },
    {
      screenId: screensId.NEWS,
      title: locale.ru.news,
      image: require('images/mainMenu/main-news.png'),
    },
    {
      screenId: screensId.CATALOGS,
      title: locale.ru.catalogs,
      image: require('images/mainMenu/main-catalogs.png'),
    },
    {
      screenId: screensId.SETTINGS,
      title: locale.ru.settings,
      image: require('images/mainMenu/main-settings.png'),
    },
    {
      screenId: screensId.CHATS,
      title: locale.ru.chats,
      image: require('images/mainMenu/main-chats.png'),
    },
  ];

  handleButtonPress = item => {
    this.props.navigationStore.pushScreen(item.screenId);
  };

  renderButton = ({item}) => {
    const badges = toJS(this.props.profileStore.badges);
    return (
      <SquareMenuButton
        badge={!!badges && badges[item.badgeId]}
        onPress={() => this.handleButtonPress(item)}
        icon={item.image}
        title={item.title}
      />
    );
  };

  toProfile = () => {
    if (!this.pushBlock) {
      this.pushBlock = true;
      this.props.navigationStore.pushScreen(screensId.PROFILE);
      setTimeout(() => {
        this.pushBlock = false;
      }, 700);
    }
  };

  //TODO add event pressed button id checking
  handleTopBarButtonPress = () => {
    this.props.navigationStore.setLeftMenuVisibility(true);
  };

  componentDidMount() {
    setTimeout(async () => {
      Keyboard.dismiss();
      await this.props.notificationsStore.requestNotificationPermission();
      await this.props.notificationsStore.checkInitialNotification();
      await this.props.notificationsStore.addNotificationsListeners();
    }, 500);
    this.topBarButtonsListenerRemove = this.props.navigationStore.addTopBarButtonListener(
      MainScreen.options().id,
      this.handleTopBarButtonPress,
    );
  }

  componentWillUnmount(): void {
    if (this.topBarButtonsListenerRemove) {
      this.topBarButtonsListenerRemove();
    }
  }

  render() {
    const {userData, badges} = this.props.profileStore;
    return (
      <View style={commonStyles.common.screenWrapper}>
        {Platform.OS === 'ios' && <View style={styles.statusBar} />}
        <ScreenNetworkConnectionIndicator />
        <EmployeePickListItem
          subtitle={true}
          onPress={this.toProfile}
          wrapperStyle={styles.employeeWrapper}
          employeeData={userData}
        />
        <FlatList
          extraData={toJS(badges)}
          contentContainerStyle={styles.buttonsList}
          numColumns={3}
          data={MainScreen.buttons}
          renderItem={this.renderButton}
          keyExtractor={button => button.title}
        />
        <View style={styles.bottomInfoWrapper}>
          <Text style={commonStyles.texts.bottomAppInfo}>
            {`${locale.ru.app_version} ${getVersion()}`}
          </Text>
          <View style={commonStyles.common.rowCenterCenter}>
            <Text style={commonStyles.texts.bottomAppInfo}>
              {locale.ru.all_rights_reserved}
            </Text>
            <Text
              onPress={() => openLink('https://gk-osnova.ru')}
              style={[
                commonStyles.texts.bottomAppInfo,
                commonStyles.common.bottomBorder,
              ]}>
              {' '}
              https://gk-osnova.ru
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonsList: {
    padding: 15,
    justifyContent: 'center',
  },
  employeeWrapper: {
    borderTopWidth: 0.5,
    borderTopColor: commonStyles.colors.lightGray,
    marginTop: 16,
  },
  statusBar: {
    width: '100%',
    height: getStatusBarHeight(true),
    backgroundColor: commonStyles.colors.blue,
  },
  bottomInfoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
});

export default MainScreen;
