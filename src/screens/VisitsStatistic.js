import React, {Component} from 'react';
import {Animated} from 'react-native';
import {observable, action, computed} from 'mobx';
import {observer, inject} from 'mobx-react';

import screensId from '../navigation/screensId';
import locale from '../locale';
import requests from '../network/requests';
import formatDate from '../utils/formatDate';
import {showMessage} from '../utils/showMessage';

import StatisticVisitsRow from '../components/listsItems/statisticVisitsRow';
import ScreenWrapper from '../components/ScreenWrapper';

@inject('profileStore')
@observer
class VisitsStatisticScreen extends Component {
  static options() {
    return {
      id: screensId.VISITS_STATISTIC,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.title_visits_statistic,
        },
      },
    };
  }

  @observable
  visitsStatistic = [];

  @observable
  previousStatisticMark = null;

  @observable
  isVisitsStatisticLoading = false;

  refreshing = false;

  @computed
  get isLoadMoreAvailable() {
    return (
      !!this.visitsStatistic.length &&
      !!this.previousStatisticMark &&
      !this.isVisitsStatisticLoading
    );
  }

  @action
  setVisitsStatisticLoadingStatus = status => {
    this.isVisitsStatisticLoading = !!status;
  };

  @action
  getVisitsStatistic = async (refresh = false) => {
    this.setVisitsStatisticLoadingStatus(true);
    try {
      const response = this.props.isCatalogStatistic
        ? await requests.catalogEmployeesVisitsStatistic(
            this.props.userData.id_phperson,
            this.previousStatisticMark,
          )
        : await requests.visitsStatistic(this.previousStatisticMark);
      console.log(response);
      const days = response.data.data;
      if (response.data.result && days) {
        const formattedData = Object.keys(days).map(day => ({
          ...days[day],
          date: formatDate(day, 'DD.MM.YY'),
        }));
        this.visitsStatistic = refresh
          ? formattedData
          : [...this.visitsStatistic, ...formattedData];
        this.previousStatisticMark = response.data.meta.previous;
      }
      this.setVisitsStatisticLoadingStatus(false);
    } catch (e) {
      showMessage(locale.ru.error, locale.ru.error_network);
      this.setVisitsStatisticLoadingStatus(false);
      console.log(e.response);
    }
  };

  handleRefresh = () => {
    this.previousStatisticMark = null;
    this.getVisitsStatistic(true);
  };

  handleLoadMore = () => {
    if (!this.isVisitsStatisticLoading) {
      this.getVisitsStatistic();
    }
  };

  renderStatisticItem = ({item}) => <StatisticVisitsRow data={item} />;

  componentDidMount() {
    this.getVisitsStatistic();
  }
  render() {
    return (
      <ScreenWrapper>
        <Animated.FlatList
          onRefresh={this.handleRefresh}
          refreshing={this.isVisitsStatisticLoading}
          onEndReached={() => this.isLoadMoreAvailable && this.handleLoadMore()}
          keyExtractor={item => item.date}
          data={this.visitsStatistic}
          renderItem={this.renderStatisticItem}
        />
      </ScreenWrapper>
    );
  }
}

export default VisitsStatisticScreen;
