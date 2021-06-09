import React, {Component} from 'react';
import {action, observable} from 'mobx';
import {observer, inject} from 'mobx-react';

import screensId from '../../navigation/screensId';
import locale from '../../locale';
import requests from '../../network/requests';

import InquiriesList from '../../components/lists/inquiries/inquieries'; // !!!
import ScreenWrapper from '../../components/ScreenWrapper';
import {showMessage} from '../../utils/showMessage';
import {showNetworkError} from '../../utils/showNetworkError';
import commonStyles from '../../styles';
import LargeSubmitButton from '../../components/buttons/largeSubmitButton';

@inject('navigationStore')
@observer
class InquiriesListScreen extends Component {
  static options() {
    return {
      id: screensId.INQUIRIES,
      topBar: {
        visible: true,
      },
    };
  }

  @observable
  inquiriesList = null;

  @observable
  loadActivity = false;

  @observable
  inquiryType;

  @observable
  inquiryTypeNumeric;

  @action
  getInquiries = async type => {
    console.log('getInquiries');
    let response = null;
    let error_network = true;
    if (!this.loadActivity) {
      try {
        this.loadActivity = true;
        response = await requests.inquiriesList(type);
        if (response && response.data.data) {
          this.inquiriesList = response.data.data;
        } else {
          showNetworkError(response);
        }
        error_network = false;
        this.loadActivity = false;
        console.log('list request done successfully');
      } catch (e) {
        console.log('error network = ', error_network);
        if (error_network) {
          if (e && e.response) {
            if (e.response.status !== 422) {
              showNetworkError(e.response);
            }
          } else {
            showMessage(locale.ru.error, locale.ru.error_network);
          }
        } else {
          showMessage(locale.ru.error, locale.ru.error_data_processing);
        }
      } finally {
        this.loadActivity = false;
      }
    }
  };

  handleInquiryPress = data => {
    if (!data) {
      return;
    }
    if (data) {
      const {inquiryType, inquiryTypeNumeric} = this;
      this.props.navigationStore.pushScreen(
        screensId.INQUIRY_INFO,
        {
          id: data.id,
          inquiryType,
          inquiryTypeNumeric,
        },
        {
          topBar: {
            title: {
              text: this.props.screenTitle,
            },
          },
        },
      );
    }
  };

  handleInquiryCreatePress = () => {
    const {inquiryType, inquiryTypeNumeric} = this;
    this.props.navigationStore.pushScreen(
      screensId.INQUIRY_CREATE,
      {
        inquiryType,
        inquiryTypeNumeric,
        successCreateCallback: () => this.getInquiries(inquiryType),
      },
      {
        topBar: {
          title: {
            text: this.props.screenTitle,
          },
        },
      },
    );
  };

  @action
  componentDidMount(): void {
    this.inquiryType = this.props.inquiryType;
    this.inquiryTypeNumeric = this.props.inquiryTypeNumeric;
    this.getInquiries(this.inquiryType);
  }

  // inquiries
  render() {
    return (
      <ScreenWrapper>
        <InquiriesList
          onPress={this.handleInquiryPress}
          data={this.inquiriesList}
          onRefresh={() => this.getInquiries(this.inquiryType)}
          refreshing={this.loadActivity}
        />
        <LargeSubmitButton
          onPress={this.handleInquiryCreatePress}
          title={locale.ru.create_inquiry}
          wrapperStyle={commonStyles.common.actionButton}
        />
      </ScreenWrapper>
    );
  }
}

export default InquiriesListScreen;
