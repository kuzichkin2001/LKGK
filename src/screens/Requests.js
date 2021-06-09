import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';

import screensId from '../navigation/screensId';
import locale from '../locale';

import ProfileButtonsList from '../components/lists/profileButtonsList';
import ScreenWrapper from '../components/ScreenWrapper';
import RequestsVacationCreateScreen from './RequestsVacationCreate';
import colors from '../styles/colors';

@inject('navigationStore')
@observer
class RequestsScreen extends Component {
  static options() {
    return {
      id: screensId.REQUESTS,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.requests,
        },
      },
    };
  }

  buttons = [
    {
      screenId: screensId.REQUESTS_PASS,
      title: locale.ru.title_pass_requests,
      titlePrefix: locale.ru.requests_to,
    },
    {
      screenId: screensId.REQUESTS_SUPPORT,
      title: locale.ru.support_requests_type1,
      titlePrefix: locale.ru.requests,
      passProps: {
        requestType: 1,
      },
    },
    {
      screenId: screensId.REQUESTS_SUPPORT,
      title: locale.ru.support_requests_type2,
      titlePrefix: locale.ru.requests,
      passProps: {
        requestType: 2,
      },
    },
    {
      screenId: screensId.REQUESTS_SUPPORT,
      title: locale.ru.support_requests_type3,
      titlePrefix: locale.ru.requests,
      passProps: {
        requestType: 3,
      },
    },
    {
      screenId: screensId.REQUESTS_VACATION,
      title: locale.ru.vacation_request_type3,
      titlePrefix: locale.ru.requests_to,
      passProps: {
        requestType: RequestsVacationCreateScreen.vacation_type_Vacation_Paid,
      },
      style: {borderTopWidth: 1, borderTopColor: colors.lightGray},
      dividerTitle: locale.ru.vacation,
    },
    {
      screenId: screensId.REQUESTS_VACATION,
      title: locale.ru.vacation_request_type4,
      titlePrefix: locale.ru.requests_to,
      passProps: {
        requestType:
          RequestsVacationCreateScreen.vacation_type_Vacation_Not_Paid,
      },
    },
    {
      screenId: screensId.REQUESTS_VACATION,
      title: locale.ru.vacation_request_type1,
      titlePrefix: locale.ru.requests_to,
      passProps: {
        requestType:
          RequestsVacationCreateScreen.vacation_type_Absence_Personal,
      },
      style: {borderTopWidth: 1, borderTopColor: colors.lightGray},
      dividerTitle: locale.ru.absence,
    },
    {
      screenId: screensId.REQUESTS_VACATION,
      title: locale.ru.vacation_request_type2,
      titlePrefix: locale.ru.requests_to,
      passProps: {
        requestType: RequestsVacationCreateScreen.vacation_type_Absence_Workers,
      },
    },
    // INQUIRIES:
    {
      dividerTitle: locale.ru.requests_divider_inquiries,
      screenId: screensId.INQUIRIES,
      title: locale.ru.title_inquiry_create_type1,
      titleList: locale.ru.title_inquiry_create_type1,
      passProps: {
        inquiryType: 'copy-tk',
        inquiryTypeNumeric: 1,
        screenTitle: locale.ru.title_inquiry_create_type1,
      },
    },
    {
      screenId: screensId.INQUIRIES,
      title: locale.ru.title_inquiry_create_type2,
      titleList: locale.ru.title_inquiry_create_type2,
      passProps: {
        inquiryType: 'two-ndfl',
        inquiryTypeNumeric: 2,
        screenTitle: locale.ru.title_inquiry_create_type2,
      },
    },
    {
      screenId: screensId.INQUIRIES,
      title: locale.ru.title_inquiry_create_type3,
      titleList: locale.ru.title_inquiry_create_type3,
      passProps: {
        inquiryType: 'no-pension',
        inquiryTypeNumeric: 3,
        screenTitle: locale.ru.title_inquiry_create_type3,
      },
    },
    {
      screenId: screensId.INQUIRIES,
      title: locale.ru.title_inquiry_create_type4,
      titleList: locale.ru.title_inquiry_create_type4,
      passProps: {
        inquiryType: 'from-job',
        inquiryTypeNumeric: 4,
        screenTitle: locale.ru.title_inquiry_create_type4,
      },
    },
    {
      screenId: screensId.INQUIRIES,
      title: locale.ru.title_inquiry_create_type5,
      titleList: locale.ru.title_inquiry_create_type5,
      passProps: {
        inquiryType: 'once-pension',
        inquiryTypeNumeric: 5,
        screenTitle: locale.ru.title_inquiry_create_type5,
      },
    },
  ];

  handleButtonPress = ({
    screenId,
    passProps,
    title,
    titlePrefix,
    titleList,
  }) => {
    this.props.navigationStore.pushScreen(screenId, passProps, {
      topBar: {
        title: {
          text: `${titlePrefix ? titlePrefix + ' ' : ''}`.concat(
            titleList ||
              `${title.substr(0, 1).toLowerCase()}${title.substr(
                1,
                title.length - 1,
              )}`,
          ),
        },
      },
    });
  };

  render() {
    return (
      <ScreenWrapper>
        <ProfileButtonsList
          onPress={this.handleButtonPress}
          data={this.buttons}
        />
      </ScreenWrapper>
    );
  }
}

export default RequestsScreen;
