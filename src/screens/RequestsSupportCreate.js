import React, {Component} from 'react';
import {action, computed, observable} from 'mobx';
import {observer, inject} from 'mobx-react';

import screensId from '../navigation/screensId';
import locale from 'locale';
import inputTypes from '../forms/inputTypes';
import requests from '../network/requests';

import SupportRequestForm from '../forms/supportRequestForm';
import ScreenWrapper from '../components/ScreenWrapper';

@inject('navigationStore')
@observer
class RequestsSupportCreateScreen extends Component {
  static options() {
    return {
      id: screensId.REQUESTS_SUPPORT_CREATE,
      topBar: {
        visible: true,
      },
    };
  }

  static supportRequestTypes = {
    1: locale.ru.support_request_type1,
    2: locale.ru.support_request_type2,
    3: locale.ru.support_request_type3,
  };

  @observable
  submittingActivity = false;

  @computed
  get initialValues() {
    const {requestType} = this.props;
    if (requestType !== undefined) {
      return {
        [inputTypes.supportRequestType]:
          RequestsSupportCreateScreen.supportRequestTypes[requestType],
      };
    } else {
      return {};
    }
  }

  @action
  handleSubmit = async values => {
    if (!this.submittingActivity) {
      try {
        this.submittingActivity = true;
        const apiRequestType = Object.keys(
          RequestsSupportCreateScreen.supportRequestTypes,
        ).find(
          key =>
            values[inputTypes.supportRequestType] ===
            RequestsSupportCreateScreen.supportRequestTypes[key],
        );
        const response = await requests.supportRequestCreate({
          ...values,
          [inputTypes.supportRequestType]: apiRequestType,
        });
        if (response.data.result) {
          if (this.props.successCallback) {
            this.props.successCallback();
          } else {
            this.props.navigationStore.popScreen();
          }
        }
        this.submittingActivity = false;
        console.log(response);
      } catch (e) {
        this.submittingActivity = false;
        console.log(e);
      }
    }
  };

  getVariantFromPicker = async pickerData => {
    return await new Promise(resolve => {
      this.props.navigationStore.pushScreen(screensId.VARIANTS_PICKER, {
        successCallback: pickedVariant => {
          resolve(pickedVariant);
        },
        pickerData,
      });
    });
  };

  render() {
    return (
      <ScreenWrapper>
        <SupportRequestForm
          onSupportTypePress={() =>
            this.getVariantFromPicker(
              Object.values(RequestsSupportCreateScreen.supportRequestTypes),
            )
          }
          isSubmitting={this.submittingActivity}
          initialValues={this.initialValues}
          onSubmit={this.handleSubmit}
        />
      </ScreenWrapper>
    );
  }
}

export default RequestsSupportCreateScreen;
