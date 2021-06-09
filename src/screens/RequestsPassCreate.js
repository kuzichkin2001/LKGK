import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {action, computed, observable} from 'mobx';

import screensId from '../navigation/screensId';
import locale from '../locale';
import requests from '../network/requests';
import inputTypes from '../forms/inputTypes';
import {showMessage} from '../utils/showMessage';
import confirmPick from '../utils/confirmPicker';
import multipleSmsSend from '../utils/multipleSmsSend';

import PassRequestForm from '../forms/passRequestForm';
import ScreenWrapper from '../components/ScreenWrapper';
import {DEFAULT_OFFICE} from '../constants';

@inject('contactsStore', 'infoStore', 'navigationStore', 'profileStore')
@observer
class RequestsPassCreateScreen extends Component {
  static options() {
    return {
      id: screensId.REQUESTS_PASS_CREATE,
      topBar: {
        visible: true,
      },
    };
  }

  static passRequestTypes = [
    'Переговоры',
    'Встреча',
    'Совещание',
    'Отдел кадров',
    'Подписание договора',
    'Рабочая встреча',
    'Рабочее совещание',
    'Доставка',
  ];

  @observable
  isFormSubmitting = false;

  @computed
  get offices() {
    let {officesList} = this.props.infoStore;
    let defaultOffice;
    if (officesList) {
      officesList = officesList.map(office => {
        if (office.name === DEFAULT_OFFICE) {
          defaultOffice = [office.name];
          return '';
        } else {
          return office.name;
        }
      });
      officesList = [...(defaultOffice ? defaultOffice : []), ...officesList];
    }
    return officesList;
  }

  @action
  handleSubmit = async values => {
    if (!this.isFormSubmitting) {
      try {
        this.isFormSubmitting = true;
        const office = this.props.infoStore.officesList.find(
          officeData => officeData.name === values.office,
        );
        const requestData = {
          visitors: values[inputTypes.visitors],
          phones: values[inputTypes.phones],
          office_id: office.id,
          type: values[inputTypes.passRequestType],
          comment: values[inputTypes.comment],
          date: values[inputTypes.date],
        };
        const response = await requests.passRequestCreate(requestData);
        if (response.data.result) {
          this.props.successCreateCallback &&
            this.props.successCreateCallback();
          this.props.navigationStore.popScreen();
          if (
            values.phones &&
            values.phones.length &&
            values[inputTypes.shouldShare]
          ) {
            confirmPick({
              title: locale.ru.chose_variant,
              subtitle: locale.ru.should_send_invitation_via_sms,
              onConfirm: () => {
                try {
                  const {userData} = this.props.profileStore;
                  const initiatorMessage =
                    (userData &&
                      userData.name &&
                      userData.name.full_name &&
                      `Организатор встречи: ${userData.name.full_name}.`) ||
                    '';
                  multipleSmsSend(
                    values.phones,
                    `Приглашаю Вас в офис ГК Основа по адресу: ${
                      values.office
                    }. Пропуск для Вас заказан. ${initiatorMessage}`,
                  );
                } catch (e) {
                  console.log(e);
                }
              },
            });
          }
        } else {
          showMessage(locale.ru.error, locale.ru.couldnt_create_pass_request);
        }
        this.isFormSubmitting = false;
      } catch (e) {
        if (e.response) {
          showMessage(locale.ru.error, locale.ru.couldnt_create_pass_request);
        } else {
          showMessage(locale.ru.error, locale.ru.error_network);
        }
        this.isFormSubmitting = false;
      }
    }
  };

  componentDidMount() {
    if (!this.props.infoStore.officesList) {
      this.props.infoStore.updateOfficesList();
    }
    if (!this.props.contactsStore.contacts.length) {
      this.props.contactsStore.readContacts('');
    }
  }

  getVariantFromPickerPicker = async pickerData => {
    return await new Promise(resolve => {
      try {
        this.props.navigationStore.pushScreen(screensId.VARIANTS_PICKER, {
          successCallback: pickedVariant => {
            resolve(pickedVariant);
          },
          pickerData,
        });
      } catch (e) {
        resolve(null);
        console.log(e);
      }
    });
  };

  render() {
    return (
      <ScreenWrapper>
        <PassRequestForm
          passRequestTypes={RequestsPassCreateScreen.passRequestTypes}
          onOfficePress={() => this.getVariantFromPickerPicker(this.offices)}
          onPassRequestTypeChange={() =>
            this.getVariantFromPickerPicker(
              RequestsPassCreateScreen.passRequestTypes,
            )
          }
          isSubmitting={this.isFormSubmitting}
          handleSubmit={this.handleSubmit}
          offices={this.offices}
        />
      </ScreenWrapper>
    );
  }
}

export default RequestsPassCreateScreen;
