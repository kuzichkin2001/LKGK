import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {action, toJS, observable, computed} from 'mobx';

import screensId from '../navigation/screensId';
import locale from '../locale';

import requests from '../network/requests';
import {showMessage} from '../utils/showMessage';
import ScreenWrapper from '../components/ScreenWrapper';
import EmployeesChatList from '../components/lists/employeesChatList';
import topBarButtons from '../navigation/topBarButtons';
import {MOCK_USERS} from '../constants';

@inject('navigationStore', 'profileStore')
@observer
class ChooseOpponentScreen extends Component {
  static options() {
    return {
      id: screensId.CHAT_CHOOSE_OPPONENT,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.chats_choose_user,
        },
        rightButtons: [topBarButtons.create],
        rightButtonColor: '#85D305',
      },
    };
  }
  @observable
  Users = null;
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
  loadUsers() {
    this.Users = [];
    MOCK_USERS.forEach(item => {
      this.Users.push(item);
    });
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
      <ScreenWrapper>
        <EmployeesChatList
          data={this.Users}
          refreshing={toJS(this.employeesListActivity)}
          searchInputValue={this.searchInputValue}
          isLoadMoreAvailable={this.isLoadMoreAvailable}
          loadMoreEmployees={this.loadMoreEmployees}
          handleSearchChange={this.handleSearchChange}
          handleEmployeePress={this.handleEmployeePress}
          onRefresh={this.handleRefresh}
        />
      </ScreenWrapper>
    );
  }
}

export default ChooseOpponentScreen;
