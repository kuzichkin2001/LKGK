import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {observable, action, computed} from 'mobx';

import screensId from '../navigation/screensId';
import locale from 'locale';
import requests from '../network/requests';
import {showMessage} from '../utils/showMessage';

import NewsList from '../components/lists/newsList';
import ScreenWrapper from '../components/ScreenWrapper';

@inject('navigationStore')
@observer
class NewsScreen extends Component {
  static options() {
    return {
      id: screensId.NEWS,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.news,
        },
      },
    };
  }

  @observable
  refreshing = false;

  @observable
  news = [];

  @observable
  nextPage = 1;

  @computed
  get isLoadMoreAvailable() {
    return !!this.nextPage && !!this.news.length && !this.refreshing;
  }

  @action
  getNews = async refresh => {
    if (!this.refreshing) {
      if (refresh) {
        this.nextPage = 1;
      } else if (!this.nextPage) {
        return;
      }
      try {
        this.refreshing = true;
        const response = await requests.news(this.nextPage);
        if (refresh) {
          this.news = response.data.data;
        } else {
          this.news = [...this.news, ...response.data.data];
        }
        this.nextPage = response.data.links.next ? this.nextPage + 1 : null;
        console.log(response);
        this.refreshing = false;
      } catch (e) {
        showMessage(locale.ru.error, locale.ru.error_network);
        console.log(e);
        console.log(e.response);
        this.refreshing = false;
      }
    }
  };

  componentDidMount() {
    this.getNews();
  }

  handleNewsPress = newsData => {
    this.props.navigationStore.pushScreen(
      screensId.NEWS_OPENED_VIEW,
      {
        newsData,
      },
      {
        topBar: {
          title: {
            text: newsData.title,
          },
        },
      },
    );
  };

  render() {
    return (
      <ScreenWrapper>
        <NewsList
          onLoadMore={() => this.getNews(false)}
          isLoadMoreAvailable={this.isLoadMoreAvailable}
          refreshing={this.refreshing}
          onRefresh={() => this.getNews(true)}
          onPress={this.handleNewsPress}
          data={this.news}
        />
      </ScreenWrapper>
    );
  }
}

export default NewsScreen;
