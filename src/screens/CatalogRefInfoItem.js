import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {observable, action} from 'mobx';
import {View, ScrollView, ActivityIndicator} from 'react-native';

import commonStyles from 'styles';
import screensId from '../navigation/screensId';
import {showMessage} from '../utils/showMessage';
import locale from 'locale';
import requests from '../network/requests';

import NewsListItem from '../components/listsItems/news';
import ScreenWrapper from '../components/ScreenWrapper';

@inject('navigationStore')
@observer
class CatalogRefInfoItemScreen extends Component {
  static options() {
    return {
      id: screensId.CATALOG_REFERENCES_INFORMATION_ITEM,
      topBar: {
        visible: true,
      },
    };
  }

  @observable
  newsData = null;

  @observable
  newsDataLoading = false;

  @action
  getNewsData = async newsId => {
    try {
      this.newsDataLoading = true;
      const response = await requests.refsInfoItem(newsId);
      if (response.data.result) {
        this.newsData = response.data.data;
      } else if (!this.newsData) {
        showMessage(locale.ru.error, locale.ru.couldnt_load_refs_info);
      }
      this.newsDataLoading = false;
    } catch (e) {
      this.newsDataLoading = false;
      console.log('ref info request exception');
      console.log(e);
      console.log(e.response);
      if (!this.newsData) {
        showMessage(locale.ru.error, locale.ru.couldnt_load_refs_info);
      }
    }
  };

  @action
  componentDidMount(): void {
    try {
      if (this.props.newsData) {
        this.newsData = this.props.newsData;
        this.getData(this.newsData.id);
      } else if (this.props.notificationApiId) {
        this.getData(this.props.notificationApiId);
      } else {
        showMessage(locale.ru.error, locale.ru.couldnt_load_refs_info);
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    if (!this.newsData) {
      return (
        <View style={commonStyles.common.screenWrapper}>
          <ActivityIndicator
            animating={this.newsDataLoading}
            size={'large'}
            color={commonStyles.colors.label}
          />
        </View>
      );
    }
    return (
      <ScreenWrapper>
        <ScrollView>
          <NewsListItem data={this.newsData} isFullView={true} />
        </ScrollView>
      </ScreenWrapper>
    );
  }
}

export default CatalogRefInfoItemScreen;
