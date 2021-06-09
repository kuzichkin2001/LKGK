import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';

import ProfileButtonsList from '../components/lists/profileButtonsList';
import ScreenWrapper from '../components/ScreenWrapper';

import screensId from '../navigation/screensId';
import {requestDocumentsTypes} from '../constants';
import locale from '../locale';

@inject('navigationStore')
@observer
class RequestsMemorandums extends Component {
  static options() {
    return {
      id: screensId.REQUESTS_MEMORANDUMS,
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
      title: locale.ru.documents_request_type1_plural,
      passProps: {
        requestType: requestDocumentsTypes.document_type_Letter_Number,
      },
      dividerTitle: locale.ru.documents,
    },
    {
      title: locale.ru.documents_request_type2_plural,
      passProps: {
        requestType: requestDocumentsTypes.document_type_Memorandum,
      },
    },
  ];

  handleButtonPress = ({_, passProps, title: text}) => {
    this.props.navigationStore.pushScreen(
      screensId.REQUESTS_DOCUMENTS,
      {
        ...passProps,
        createScreenTitle:
          locale.ru[
            `documents_request_type${passProps.requestType}_form_title`
          ],
      },
      {
        topBar: {
          title: {
            text,
          },
        },
      },
    );
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

export default RequestsMemorandums;
