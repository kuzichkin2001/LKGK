import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {computed} from 'mobx';

import locale from 'locale';
import screensId from '../navigation/screensId';

import ProfileButtonsList from '../components/lists/profileButtonsList';
import ScreenWrapper from '../components/ScreenWrapper';

@inject('navigationStore', 'profileStore')
@observer
class HeadOfficeScreen extends Component {
  static options() {
    return {
      id: screensId.HEAD_OFFICE,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.title_head_office,
        },
      },
    };
  }

  @computed
  get buttons() {
    return [
      {
        screenId: screensId.DELEGATION_LIST,
        title: locale.ru.title_authority_delegation,
        icon: require('assets/images/split.png'),
      },
      {
        options: {
          topBar: {
            title: {
              text: locale.ru.title_employees_statistic,
            },
          },
        },
        passProps: {
          isSubordinate: true,
        },
        screenId: screensId.CATALOG_EMPLOYEES,
        title: locale.ru.title_employees_statistic,
        icon: require('assets/images/radar.png'),
      },
      {
        title: locale.ru.title_request_approval,
        icon: require('assets/images/vote.png'),
      },
    ];
  }

  @computed
  get isSubordinatesListAvailable() {
    let result = false;
    try {
      result = !!this.props.profileStore.userData.is_chief;
    } catch (e) {
      console.log(e);
    }
    console.log('is subordinate: ' + result);
    return result;
  }

  handleButtonPress = item => {
    this.props.navigationStore.pushScreen(
      item.screenId,
      item.passProps,
      item.options,
    );
  };

  render() {
    return (
      <ScreenWrapper>
        <ProfileButtonsList
          onPress={this.handleButtonPress}
          data={this.buttons}
        />
      </ScreenWrapper>
    );
  }
}

export default HeadOfficeScreen;
