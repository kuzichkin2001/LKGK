import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {action, observable} from 'mobx';

import screensId from '../navigation/screensId';
import locale from 'locale';
import requests from '../network/requests';

import CatalogOfficesList from '../components/lists/catalogOfficesList';
import ScreenWrapper from '../components/ScreenWrapper';

@inject()
@observer
class CatalogOfficesScreen extends Component {
  static options() {
    return {
      id: screensId.CATALOG_OFFICES,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.catalog_company_offices,
        },
      },
    };
  }

  @observable
  officesList = [];

  @observable
  officesActivity = false;

  @action
  getOffices = async () => {
    if (!this.officesActivity) {
      try {
        this.officesActivity = true;
        const response = await requests.officesList();
        if (response.data.result) {
          this.officesList = response.data.data;
        }
        this.officesActivity = false;
      } catch (e) {
        this.officesActivity = false;
        console.log(e.response || e);
      }
    }
  };

  componentDidMount() {
    this.getOffices();
  }

  render() {
    return (
      <ScreenWrapper>
        <CatalogOfficesList
          data={this.officesList}
          refreshing={this.officesActivity}
          onRefresh={this.getOffices}
        />
      </ScreenWrapper>
    );
  }
}

export default CatalogOfficesScreen;
