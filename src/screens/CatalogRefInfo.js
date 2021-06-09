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
class ReferenceInfoScreen extends Component {
  static options() {
    return {
      id: screensId.CATALOG_REFERENCES_INFORMATION,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.catalog_other,
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
  getRefsInfoList = async refresh => {
    if (!this.refreshing) {
      if (refresh) {
        this.nextPage = 1;
      } else if (!this.nextPage) {
        return;
      }
      try {
        this.refreshing = true;
        const response = await requests.refsInfo(this.nextPage);
        if (refresh) {
          this.news = response.data.data;
        } else {
          this.news = [...this.news, ...response.data.data];
        }
        this.nextPage = response.data.links.next ? this.nextPage + 1 : null;
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
    this.getRefsInfoList();
  }

  handleNewsPress = newsData => {
    this.props.navigationStore.pushScreen(
      screensId.CATALOG_REFERENCES_INFORMATION_ITEM,
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
          onLoadMore={() => this.getRefsInfoList(false)}
          isLoadMoreAvailable={this.isLoadMoreAvailable}
          refreshing={this.refreshing}
          onRefresh={() => this.getRefsInfoList(true)}
          onPress={this.handleNewsPress}
          data={this.news}
        />
      </ScreenWrapper>
    );
  }
}

export default ReferenceInfoScreen;
