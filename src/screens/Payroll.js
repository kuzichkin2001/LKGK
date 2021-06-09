import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {observable, action, computed} from 'mobx';

import screensId from '../navigation/screensId';
import locale from 'locale';
import formatDate from '../utils/formatDate';
import routes from '../network/routes';

import ScreenWrapper from '../components/ScreenWrapper';
import DatePicker from '../components/datepicker';
import MainInput from '../components/inputs/MainInput';
import ApprovingTaskPinnedDocsList from '../components/lists/approvingTaskPinnedDocsList';

@inject()
@observer
class PayrollScreen extends Component {
  static options() {
    return {
      id: screensId.USER_PAYROLL,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.settlement_sheet,
        },
      },
    };
  }

  datePickerRef = null;

  @observable
  maximumPayrollDate = null;

  @observable
  payrollDate = null;

  @action
  handleDatePicker = async () => {
    try {
      const pickedDate = await this.datePickerRef.pickDate({
        date: new Date(this.payrollDate),
      });
      if (pickedDate) {
        this.payrollDate = pickedDate;
      }
    } catch (e) {
      console.log(e);
    }
  };

  @computed
  get formattedPayrollDate() {
    return formatDate(this.payrollDate, 'YYYY-MM-01');
  }

  @computed
  get payrollDownload() {
    return [
      {
        id: `${this.formattedPayrollDate}-${Date.now()}`,
        file_ext: 'pdf',
        file_name: `${this.formattedPayrollDate}.pdf`,
        downloadUrlBody: `date=${this.formattedPayrollDate}`,
      },
    ];
  }

  @action
  componentDidMount() {
    const prevMonthDate = new Date().setMonth(new Date().getMonth() - 1);
    this.maximumPayrollDate = prevMonthDate;
    this.payrollDate = prevMonthDate;
  }

  render() {
    return (
      <ScreenWrapper>
        <MainInput
          showArrow={true}
          editable={false}
          icon={require('images/date.png')}
          title={locale.ru.payroll_date}
          placeholder={locale.ru.select_date}
          value={formatDate(this.payrollDate, 'MMMM YYYY')}
          onPress={this.handleDatePicker}
        />
        <ApprovingTaskPinnedDocsList
          downloadFileTitle={locale.ru.download}
          openFileTitle={locale.ru.open}
          downloadRoute={routes.payrollDownload}
          filePrefix={'payroll-'}
          data={this.payrollDownload}
        />
        <DatePicker
          maximumDate={new Date(this.maximumPayrollDate)}
          pickerType={'month'}
          ref={ref => (this.datePickerRef = ref)}
        />
      </ScreenWrapper>
    );
  }
}

export default PayrollScreen;
