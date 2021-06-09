import React, {Component} from 'react';
import {observable, action} from 'mobx';
import {observer, inject} from 'mobx-react';

import screensId from '../navigation/screensId';
import locale from 'locale';
import requests from '../network/requests';

import ReportsList from '../components/lists/reportsList';
import ScreenWrapper from '../components/ScreenWrapper';

@inject('navigationStore')
@observer
class ReportsScreen extends Component {
  static options() {
    return {
      id: screensId.REPORTS,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.reports,
        },
      },
    };
  }

  @observable
  reportsList = [];

  @observable
  reportsListActivity = false;

  @action
  getReports = async () => {
    if (!this.reportsListActivity) {
      try {
        this.reportsListActivity = true;
        const response = await requests.tableReports();
        console.log(response);
        if (response.data.result) {
          this.reportsList = response.data.data;
        }
        this.reportsListActivity = false;
      } catch (e) {
        this.reportsListActivity = false;
        console.log(e.response || e);
      }
    }
  };

  handleReportPress = reportData => {
    this.props.navigationStore.pushScreen(
      screensId.WEBVIEW_TABLEAU,
      {
        reportData,
      },
      {
        topBar: {
          title: {
            text: reportData.title,
          },
        },
      },
    );
  };

  componentDidMount() {
    this.getReports();
  }

  render() {
    return (
      <ScreenWrapper>
        <ReportsList
          onItemPress={this.handleReportPress}
          data={this.reportsList}
          onRefresh={this.getReports}
          refreshing={this.reportsListActivity}
        />
      </ScreenWrapper>
    );
  }
}

export default ReportsScreen;
