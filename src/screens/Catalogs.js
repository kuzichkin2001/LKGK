import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';

import screensId from '../navigation/screensId';
import locale from '../locale';

import ProfileButtonsList from '../components/lists/profileButtonsList';
import ScreenWrapper from '../components/ScreenWrapper';

@inject('navigationStore')
@observer
class CatalogsScreen extends Component {
  static options() {
    return {
      id: screensId.CATALOGS,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.catalogs,
        },
      },
    };
  }

  buttons = [
    {
      screenId: screensId.CATALOG_EMPLOYEES,
      title: locale.ru.catalog_employees,
      icon: require('assets/images/people.png'),
    },
    {
      screenId: screensId.CATALOG_OFFICES,
      title: locale.ru.catalog_company_offices,
      icon: require('assets/images/storefront.png'),
    },
    {
      screenId: screensId.CATALOG_REFERENCES_INFORMATION,
      title: locale.ru.catalog_other,
      icon: require('assets/images/bookmark.png'),
    },
  ];

  handleButtonPress = item => {
    this.props.navigationStore.pushScreen(item.screenId);
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

export default CatalogsScreen;
