import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer, inject} from 'mobx-react';
import {action, toJS, observable, computed} from 'mobx';

import screensId from '../navigation/screensId';
import locale from '../locale';
import requests from '../network/requests';
import {showMessage} from '../utils/showMessage';

import EmployeesChatList from '../components/lists/employeesChatList';
import CreateChatButton from '../components/buttons/createChatButton';
import commonStyles from '../styles';

@inject('navigationStore', 'profileStore')
@observer
class NewDialogScreen extends Component {
  static options() {
    return {
      id: screensId.NEW_DIALOG,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.chats_new_dialog,
        },
      },
    };
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

  handleEmployeePress = employeeData => {
    console.log(employeeData);
    const {onEmployeePress} = this.props;
    if (onEmployeePress) {
      onEmployeePress(employeeData);
    } else {
      this.props.navigationStore.pushScreen(screensId.CATALOG_EMPLOYEE_INFO, {
        employeeData,
        isSubordinate: !!this.props.isSubordinate,
      });
    }
  };

  handleRefresh = () => {
    if (!this.employeesListActivity) {
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
  }

  componentWillUnmount() {
    const {onEmployeePress} = this.props;
    if (onEmployeePress) {
      onEmployeePress(null);
    }
  }

  render() {
    return (
      <View style={styles.screenBackground}>
        <View style={styles.blockOffset}>
          <CreateChatButton
            onPress={() => this.handleButtonPress(screensId.NEW_GROUP_CHAT)}
            title="Создать новый групповой чат"
            iconType="group"
          />
          <CreateChatButton
            onPress={() =>
              this.handleButtonPress(screensId.CHAT_CHOOSE_OPPONENT)
            }
            title="Написать личное сообщение"
            iconType="direct"
          />
        </View>
        <View style={styles.blockOffset}>
          <EmployeesChatList
            data={this.employeesList}
            refreshing={toJS(this.employeesListActivity)}
            isLoadMoreAvailable={this.isLoadMoreAvailable}
            loadMoreEmployees={this.loadMoreEmployees}
            handleEmployeePress={this.handleEmployeePress}
            onRefresh={this.handleRefresh}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screenBackground: {
    backgroundColor: commonStyles.colors.backgroundGray,
  },
  blockOffset: {
    marginTop: 24,
  },
});

export default NewDialogScreen;
