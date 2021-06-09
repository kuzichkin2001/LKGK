import React, {PureComponent} from 'react';

import locale from 'locale';
import formatDate from '../../utils/formatDate';
import inputTypes from '../../forms/inputTypes';

import MainInput from '../inputs/MainInput';
import PeriodDatePicker from '../periodDatePicker';

class PeriodDatePickerButton extends PureComponent {
  static getDefaultPeriod() {
    return {
      [inputTypes.dateStart]: new Date(),
      [inputTypes.dateEnd]: new Date(Date.now() + 86400000),
    };
  }

  periodDatePickerRef = null;

  get formattedValue() {
    const {period} = this.props;
    if (period) {
      return `${locale.ru.from} ${formatDate(
        period[inputTypes.dateStart],
        'DD.MM.YY',
      )} ${locale.ru.to} ${formatDate(period[inputTypes.dateEnd], 'DD.MM.YY')}`;
    } else {
      return '';
    }
  }

  handleDatePress = async () => {
    try {
      const {period, onChangePeriod} = this.props;
      const pickedDatePeriod = await this.periodDatePickerRef.pickDate(period);
      if (pickedDatePeriod) {
        onChangePeriod(pickedDatePeriod);
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const {isSingleDate, currentDate} = this.props;
    return (
      <>
        <MainInput
          onPress={this.handleDatePress}
          icon={require('images/date.png')}
          editable={false}
          showArrow={true}
          value={this.formattedValue}
          currentDate={currentDate}
          {...this.props}
        />
        <PeriodDatePicker isSingleDate={isSingleDate} ref={ref => (this.periodDatePickerRef = ref)} />
      </>
    );
  }
}

export default PeriodDatePickerButton;
