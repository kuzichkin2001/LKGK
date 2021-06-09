import React, {Component} from 'react';
import {observable, action, computed} from 'mobx';
import {observer, inject} from 'mobx-react';
import {View, ScrollView} from 'react-native';
import {findNumbers, formatIncompletePhoneNumber} from 'libphonenumber-js/max';

import commonStyles from 'styles';
import screensId from '../navigation/screensId';
import requests from '../network/requests';
import {showMessage} from '../utils/showMessage';
import locale from 'locale';
import {
  getPassRequestStatusStyle,
  getPassRequestStatusTextDescription,
} from '../components/listsItems/passRequest';
import formatDate from '../utils/formatDate';
import openPhone from '../utils/openPhone';

import CommonActivityIndicator from '../components/commonActivityIndicator';
import ScreenNetworkConnectionIndicator from '../components/screenNetworkConnectionIndicator';
import ScreenWrapper from '../components/ScreenWrapper';
import TitledInfoRow from '../components/titledInfoRow';

@inject()
@observer
class RequestsPassInfoScreen extends Component {
  static options() {
    return {
      id: screensId.REQUESTS_PASS_INFO,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.title_request_pass_create,
        },
      },
    };
  }

  @observable
  passRequestData = null;

  @observable
  passRequestDataActivity = false;

  @computed
  get phones() {
    let result = [];
    try {
      if (this.passRequestData) {
        const {description, visitors} = this.passRequestData;
        let searchString = '';
        if (description) {
          searchString = searchString + description;
        }
        if (
          !!visitors &&
          visitors.length &&
          visitors[0] &&
          visitors[0].annotation
        ) {
          searchString = searchString + visitors[0].annotation;
        }
        const phonesList = findNumbers(searchString, 'RU');
        phonesList.forEach(phoneData => {
          const formattedPhone = formatIncompletePhoneNumber(
            '+7' + phoneData.phone,
            'RU',
          );
          if (result.indexOf(formattedPhone) === -1) {
            result.push(formattedPhone);
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  @computed
  get visitors() {
    let result = [];
    try {
      if (this.passRequestData) {
        const {visitors} = this.passRequestData;
        if (visitors.length && visitors[0]) {
          const {visitor} = visitors[0];
          if (visitor) {
            result = visitor.split(',');
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  @computed
  get availablePeriod() {
    let result = '';
    try {
      const {date_end, date_start} = this.passRequestData.visitors[0];
      result = `${locale.ru.from} ${formatDate(date_start, 'DD.MM.YY')} ${
        locale.ru.to
      } ${formatDate(date_end, 'DD.MM.YY')}`;
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  @computed
  get visitorsNames() {
    let result = '';
    try {
      result = this.passRequestData.visitors[0].visitor;
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  @computed
  get passRequestType() {
    let result = '';
    try {
      result = this.passRequestData.visitors[0].description;
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  @computed
  get comment() {
    let result = '';
    try {
      const {description} = this.passRequestData;
      result = description.slice(description.indexOf(';') + 1);
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  @action
  componentDidMount() {
    try {
      this.passRequestData = this.props.passRequestData;
      this.getPassRequestData();
    } catch (e) {
      console.log(e);
    }
  }

  getPassRequestData = async () => {
    if (!this.passRequestDataActivity) {
      try {
        this.passRequestDataActivity = true;
        const passRequestDataId = this.passRequestData
          ? this.passRequestData.id
          : this.props.notificationApiId;
        const response = await requests.passRequestsInfo(passRequestDataId);
        console.log(response);
        if (response.data.result) {
          this.passRequestData = response.data.data;
        } else if (!this.passRequestData) {
          showMessage(
            locale.ru.error,
            locale.ru.couldnt_load_pass_request_data,
          );
        }
        this.passRequestDataActivity = false;
      } catch (e) {
        this.passRequestDataActivity = false;
        if (!this.passRequestData) {
          showMessage(
            locale.ru.error,
            locale.ru.couldnt_load_pass_request_data,
          );
        }
        console.log(e);
        console.log(e.response);
      }
    }
  };

  render() {
    if (!this.passRequestData) {
      return (
        <View style={commonStyles.common.screenWrapper}>
          <ScreenNetworkConnectionIndicator />
        </View>
      );
    } else {
      const {office, status} = this.passRequestData;
      return (
        <ScreenWrapper>
          <ScrollView>
            {!!this.passRequestDataActivity && <CommonActivityIndicator />}
            <TitledInfoRow
              icon={require('images/rows.png')}
              title={locale.ru.pass_request_type}
              value={this.passRequestType}
            />
            <TitledInfoRow
              icon={require('images/rows.png')}
              title={locale.ru.office}
              value={office.name || office.code}
            />
            <TitledInfoRow
              icon={require('images/rows.png')}
              valueStyle={getPassRequestStatusStyle(status)}
              title={locale.ru.status}
              value={getPassRequestStatusTextDescription(status)}
            />
            <TitledInfoRow
              icon={require('images/date.png')}
              title={locale.ru.available_period}
              value={this.availablePeriod}
            />
            <TitledInfoRow
              icon={require('images/rows.png')}
              title={locale.ru.visitors_names}
              value={this.visitorsNames}
            />
            {this.phones.map(phone => (
              <TitledInfoRow
                icon={require('images/phone.png')}
                onPress={() => openPhone(phone)}
                value={phone}
                title={locale.ru.visitor_phone}
              />
            ))}
            <TitledInfoRow
              icon={require('images/rows.png')}
              title={locale.ru.comment}
              value={this.comment.trim()}
            />
          </ScrollView>
        </ScreenWrapper>
      );
    }
  }
}

export default RequestsPassInfoScreen;
