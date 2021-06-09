import React, {Component} from 'react';
import {observable, action, computed} from 'mobx';
import {observer} from 'mobx-react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {getBottomSpace} from 'react-native-iphone-x-helper';

import commonStyles from 'styles';
import screensId from '../navigation/screensId';
import locale from 'locale';
import requests from '../network/requests';

import ListEmptyView from '../components/listEmptyView';

@observer
class WebviewTableauScreen extends Component {
  static options() {
    return {
      id: screensId.WEBVIEW_TABLEAU,
      topBar: {
        visible: true,
      },
    };
  }

  @observable
  isLoading = true;

  @observable
  tableUrl = null;

  @computed
  get renderWebview() {
    if (this.isLoading) {
      return (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size={'large'} color={commonStyles.colors.label} />
        </View>
      );
    } else if (this.tableUrl) {
      return (
        <WebView
          style={styles.webview}
          javaScriptEnabled={true}
          source={{uri: this.tableUrl}}
        />
      );
    } else {
      return <ListEmptyView title={locale.ru.unknown_error_occurred} />;
    }
  }

  @action
  getTableUrl = async () => {
    try {
      const {reportData, notificationApiId} = this.props;
      if (reportData) {
        this.isLoading = true;
        const response = await requests.tableReportUrl(
          (reportData && reportData.id) || notificationApiId,
        );
        console.log(response);
        if (response.data.result) {
          this.tableUrl = response.data.data.tableau_url;
        }
      }
      this.isLoading = false;
    } catch (e) {
      this.isLoading = false;
      console.log(e.response || e);
    }
  };

  componentDidMount() {
    this.getTableUrl();
  }

  render() {
    return (
      <View style={commonStyles.common.screenWrapper}>
        {this.renderWebview}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    paddingBottom: getBottomSpace(),
  },
  activityIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: commonStyles.colors.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WebviewTableauScreen;
