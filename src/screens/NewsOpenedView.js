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
class NewsOpenedViewScreen extends Component {
  static options() {
    return {
      id: screensId.NEWS_OPENED_VIEW,
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
      const response = await requests.newsInfo(newsId);
      console.log(response);
      if (response.data.result) {
        this.newsData = response.data.data;
      } else if (!this.newsData) {
        showMessage(locale.ru.error, locale.ru.couldnt_load_news);
      }
      this.newsDataLoading = false;
    } catch (e) {
      this.newsDataLoading = false;
      console.log('news info request exception');
      console.log(e);
      console.log(e.response);
      if (!this.newsData) {
        showMessage(locale.ru.error, locale.ru.couldnt_load_news);
      }
    }
  };

  @action
  componentDidMount(): void {
    try {
      if (this.props.newsData) {
        this.newsData = this.props.newsData;
        this.getNewsData(this.newsData.id);
      } else if (this.props.notificationApiId) {
        this.getNewsData(this.props.notificationApiId);
      } else {
        showMessage(locale.ru.error, locale.ru.couldnt_load_news);
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

export default NewsOpenedViewScreen;
