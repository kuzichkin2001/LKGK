import React, {Component} from 'react';
import {
  Switch,
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
} from 'react-native';

import screensId from '../navigation/screensId';
import locale from '../locale';
import {mockChats} from '../constants';
import EmployeesChatList from '../components/lists/employeesChatList';

import {action, computed, observable, toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import requests from '../network/requests';
import {showMessage} from '../utils/showMessage';
import {MOCK_USERS} from '../constants';

@inject('profileStore')
@observer
class NewGroupChatScreen extends Component {
  static options() {
    return {
      id: screensId.NEW_GROUP_CHAT,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.chats_new_group_chat,
        },
      },
    };
  }
  @observable
  Users = null;
  @observable
  isEnabledClosedChat = false;

  @observable
  isEnabledReadOnly = false;

  @observable
  isEnabledEncrypted = false;

  @action
  loadUsers() {
    this.Users = [];
    MOCK_USERS.forEach(item => {
      this.Users.push(item);
    });
  }

  @action.bound
  toggleSwitchClosedChat() {
    this.isEnabledClosedChat = !this.isEnabledClosedChat;
  }
  @action.bound
  toggleSwitchReadOnly() {
    this.isEnabledReadOnly = !this.isEnabledReadOnly;
  }
  @action.bound
  toggleSwitchEncrypted() {
    this.isEnabledEncrypted = !this.isEnabledEncrypted;
  }
  @action
  handlePressButton() {
    this.props.navigationStore.pushScreen(screensId.CURRENT_CHAT, {
      userData: this.props.profileStore.userData,
      mockChats,
    });
  }
  @action
  handleButtonPress = (id, passProps, options) => {
    this.props.navigationStore.pushScreen(id, passProps, options);
  };

  @observable
  employeesListActivity = false;

  @observable
  employeesList = [];

  @observable
  searchInputValue = '';

  @observable
  catalogNextPage = 1;

  @observable
  isTick = false;

  @computed
  get isLoadMoreAvailable() {
    return (
      !this.employeesListActivity &&
      !!this.catalogNextPage &&
      this.employeesList.length
    );
  }

  @action
  handleSearchChange = value => {
    clearTimeout(this.searchTimeout);
    this.searchInputValue = value;
    this.searchTimeout = setTimeout(() => {
      this.employeesList = [];
      this.catalogNextPage = 1;
      this.getEmployeesCatalog();
    }, 500);
  };

  @action
  getEmployeesCatalog = async () => {
    try {
      this.employeesListActivity = true;
      const response = await requests.catalogEmployees(
        this.searchInputValue,
        this.catalogNextPage,
        this.props.unitId,
        this.props.isSubordinate,
      );
      if (response.data.result) {
        if (this.props.isSubordinate) {
          this.employeesList = !this.employeesList.length
            ? [this.props.profileStore.userData, ...response.data.data]
            : [...this.employeesList, ...response.data.data];
        } else {
          this.employeesList = [...this.employeesList, ...response.data.data];
        }
      }
      if (response.data.links.next) {
        this.catalogNextPage += 1;
      } else {
        this.catalogNextPage = null;
      }
      console.log(response);
      this.employeesListActivity = false;
    } catch (e) {
      showMessage(locale.ru.error, locale.ru.error_network);
      this.employeesListActivity = false;
      console.log(e);
      console.log(e.response);
    }
  };

  @action.bound
  handleEmployeePress = item => {
    item.isTick = true;
  };

  handleRefresh = () => {
    if (this.Users.isTick) {
      this.catalogNextPage = 1;
      this.employeesList = [];
      this.getEmployeesCatalog();
    }
  };

  @action
  loadMoreEmployees = () => {
    if (!this.employeesListActivity && !!this.catalogNextPage) {
      this.getEmployeesCatalog();
    }
  };

  componentDidMount() {
    this.getEmployeesCatalog();
    this.loadUsers();
  }

  componentWillUnmount() {
    const {onEmployeePress} = this.props;
    if (onEmployeePress) {
      onEmployeePress(null);
    }
  }

  render() {
    return (
      <>
        <View style={styles_add.textInput}>
          <View style={styles_add.titleNewGroup}>
            <Text style={styles_add.NameNewGroupTextTag}>Название чата</Text>
          </View>
          <TextInput
            style={styles_add.InputNameGroupChat}
            placeholder="Введите название чата.."
            placeholderTextColor="#7C8598"
          />
        </View>
        <View style={styles_add.ClosedChat}>
          <Text style={styles_add.TextClosedChat}>Закрытый чат</Text>
          <Switch
            trackColor={{false: '#E5E5EA', true: '#4CD964'}}
            ios_backgroundColor="#E5E5EA"
            onValueChange={this.toggleSwitchClosedChat}
            value={this.isEnabledClosedChat}
          />
        </View>
        <View style={styles_add.ClosedChat}>
          <Text style={styles_add.TextClosedChat}>Только для чтения</Text>
          <Switch
            trackColor={{false: '#E5E5EA', true: '#4CD964'}}
            ios_backgroundColor="#E5E5EA"
            onValueChange={this.toggleSwitchReadOnly}
            value={this.isEnabledReadOnly}
          />
        </View>
        <View style={styles_add.ClosedChat}>
          <Text style={styles_add.TextClosedChat}>Зашифрованный</Text>
          <Switch
            trackColor={{false: '#E5E5EA', true: '#4CD964'}}
            ios_backgroundColor="#E5E5EA"
            onValueChange={this.toggleSwitchEncrypted}
            value={this.isEnabledEncrypted}
          />
        </View>
        <View style={styles_add.blockOffset}>
          <EmployeesChatList
            data={this.Users}
            handleEmployeePress={this.handleEmployeePress}
          />
        </View>
      </>
    );
  }
}

const styles_add = StyleSheet.create({
  blockOffset: {
    marginTop: 24,
  },
  textInput: {
    paddingLeft: Dimensions.get('screen').width * 0.1,
    paddingTop: Dimensions.get('screen').width * 0.05,
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: 72,
  },
  titleNewGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  NameNewGroupTextTag: {
    color: '#7C8598',
    fontSize: 15,
  },
  ClosedChat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    height: 44,
  },
  TextClosedChat: {
    fontSize: 17,
  },
  SettingsNewGroupChat: {
    paddingTop: 24,
  },
});

export default NewGroupChatScreen;
