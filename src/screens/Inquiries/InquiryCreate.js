import React, {Component} from 'react';
import {observable, action} from 'mobx';
import {observer, inject} from 'mobx-react';

import screensId from '../../navigation/screensId';
import locale from 'locale';

import InquiryCreateForm from '../../forms/inquiries';
import ScreenWrapper from '../../components/ScreenWrapper';
import requests from '../../network/requests';
import {showMessage} from '../../utils/showMessage';
import inputTypes from '../../forms/inputTypes';

@inject('navigationStore', 'profileStore')
@observer
class InquiryCreateScreen extends Component {
  static options() {
    return {
      id: screensId.INQUIRY_CREATE,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.title_inquiry_create_type1,
        },
      },
    };
  }

  @observable
  isFormSubmitting = false;

  @action
  handleSubmit = async data => {
    if (!this.isFormSubmitting) {
      try {
        this.isFormSubmitting = true;
        const {inquiryType, inquiryTypeNumeric} = this.props;
        if (inquiryTypeNumeric == 2 || inquiryTypeNumeric == 4) {
          try {
            data[
              inputTypes.inquiryOrganization
            ] = this.props.profileStore.userData.organisation;
          } catch (e) {
            data[inputTypes.inquiryOrganization] = 'Организация не указана';
          }
        }
        if (inquiryTypeNumeric == 3 || inquiryTypeNumeric == 5) {
          data[inputTypes.inquiryChildBirthDate] = data[
            inputTypes.inquiryChildBirthDate
          ].toString();
        }
        const form = new FormData();
        Object.keys(data).forEach(key => {
          if (data.hasOwnProperty(key)) {
            if (
              key !== 'file' &&
              data[key] !== undefined &&
              data[key] !== null
            ) {
              form.append(key, data[key]);
            } else {
              if (data.file.name) {
                form.append('file', data.file);
              }
            }
          }
        });
        const response = await requests.inquiryCreate(inquiryType, form);
        if (response.data.result) {
          this.props.navigationStore.popScreen();
          this.props.successCreateCallback();
        }
      } catch (e) {
        console.log(e.response || e);
        if (e.response.status && e.response.status === 422) {
          showMessage(locale.ru.error, locale.ru.error_data_processing);
        } else {
          showMessage(locale.ru.error, locale.ru.error_network);
        }
      } finally {
        this.isFormSubmitting = false;
      }
    }

  };

  render() {
    return (
      <ScreenWrapper>
        <InquiryCreateForm
          isSubmitting={this.isFormSubmitting}
          onSubmit={this.handleSubmit}
          onEmployeePick={() => {}} // !!!
          inquiryTypeNumeric={this.props.inquiryTypeNumeric}
          userData={this.props.profileStore.userData}
        />
      </ScreenWrapper>
    );
  }
}

export default InquiryCreateScreen;
