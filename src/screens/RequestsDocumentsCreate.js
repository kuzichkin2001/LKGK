import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {action, computed, observable} from 'mobx';

import ScreenWrapper from '../components/ScreenWrapper';
import DocumentRequestForm from '../forms/documentRequestForm';

import screensId from '../navigation/screensId';
import {requestDocumentsTypes} from '../constants';
import locale from '../locale';
import inputTypes from '../forms/inputTypes';
import formatDate from '../utils/formatDate';
import requests from '../network/requests';
import {showNetworkError} from '../utils/showNetworkError';
import {showMessage} from '../utils/showMessage';

@inject('navigationStore')
@observer
class RequestsDocumentsCreateScreen extends Component {
  static options() {
    return {
      id: screensId.REQUESTS_DOCUMENTS_CREATE,
      topBar: {
        visible: true,
      },
    };
  }

  static defaultDocumentsRequestType = 2;

  static documentsRequestTypes = {
    [requestDocumentsTypes.document_type_Letter_Number]:
      locale.ru.documents_request_type1,
    [requestDocumentsTypes.document_type_Memorandum]:
      locale.ru.documents_request_type2,
  };

  @observable
  isFormSubmitting = false;

  @action
  handleSubmit = async values => {
    if (!this.isFormSubmitting) {
      try {
        this.isFormSubmitting = true;
        const {requestType} = this.props;

        const data = {
          [inputTypes.documentRequestType]: requestType,
          [inputTypes.documentTheme]: values[inputTypes.documentTheme],
          [inputTypes.documentText]: values[inputTypes.documentText],
          [inputTypes.documentDate]: formatDate(Date.now(), 'YYYY-MM-DD'),
          [inputTypes.file]: values[inputTypes.file],
        };

        if (requestType !== requestDocumentsTypes.document_type_Letter_Number) {
          data['addresseesUsers[0][id_phperson]'] =
            values[inputTypes.coordinator].id_phperson;
          data['addresseesUsers[0][type]'] = 1;
        }

        if (values[inputTypes.executor]) {
          data['addresseesUsers[1][id_phperson]'] =
            values[inputTypes.executor].id_phperson;
          data['addresseesUsers[1][type]'] = 0;
        }

        const response = await requests.documentRequestCreate({
          ...data,
        });

        this.isFormSubmitting = false;

        if (response.data.result) {
          if (this.props.successCreateCallback) {
            this.props.successCreateCallback();
          }
          this.props.navigationStore.popScreen();
          showMessage(
            locale.ru.successfully,
            locale.ru.create_doc_successfully,
          );
        }
      } catch (e) {
        console.log(e);
        showNetworkError(e.response);
        this.isFormSubmitting = false;
      }
    }
  };

  @computed
  get initialValues() {
    const {requestType} = this.props;
    if (requestType !== undefined) {
      return {
        [inputTypes.documentRequestType]:
          RequestsDocumentsCreateScreen.documentsRequestTypes[requestType],
      };
    } else {
      return {
        [inputTypes.documentRequestType]:
          RequestsDocumentsCreateScreen.documentsRequestTypes[
            RequestsDocumentsCreateScreen.defaultDocumentsRequestType
          ],
      };
    }
  }

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

  handleEmployeePick = async () => {
    const {navigationStore} = this.props;
    return new Promise(resolve => {
      navigationStore.pushScreen(
        screensId.CATALOG_EMPLOYEES,
        {
          onEmployeePress: employeeData => {
            resolve(employeeData);
            if (employeeData) {
              navigationStore.popScreen();
            }
          },
        },
        {
          topBar: {
            title: {
              text: locale.ru.select_employee,
            },
          },
        },
      );
    });
  };

  handleBackPress = () => {
    this.props.navigationStore.popScreen();
  };

  render() {
    return (
      <ScreenWrapper>
        <DocumentRequestForm
          initialValues={this.initialValues}
          isSubmitting={this.isFormSubmitting}
          onSubmit={this.handleSubmit}
          onEmployeePick={this.handleEmployeePick}
          onDocumentTypePress={() =>
            this.getVariantFromPicker(
              Object.values(
                RequestsDocumentsCreateScreen.documentsRequestTypes,
              ),
            )
          }
          documentType={this.props.requestType}
          onCancelPress={this.handleBackPress}
        />
      </ScreenWrapper>
    );
  }
}

export default RequestsDocumentsCreateScreen;
