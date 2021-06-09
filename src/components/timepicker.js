import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {action, observable} from 'mobx';

import WheelTimePicker from './wheelTimePicker';

@observer
class TimePicker extends Component {
  _pickerResolver = null;

  @observable
  isDatePickerVisible = false;

  @observable
  datePickerOptions = null;

  @action
  _resolvePicker = value => {
    if (this._pickerResolver) {
      this.isDatePickerVisible = false;
      this._pickerResolver(value);
    }
  };

  @action
  pickDate = async datePickerOptions => {
    if (!this.isDatePickerVisible) {
      return new Promise(resolve => {
        this.datePickerOptions = datePickerOptions;
        this._pickerResolver = resolve;
        this.isDatePickerVisible = true;
      });
    }
  };

  handlePickerCancel = () => {
    this._resolvePicker(null);
  };

  handlePickerSubmit = date => {
    this._resolvePicker(date);
  };

  render() {
    const {...otherProps} = this.props;
    return (
      <WheelTimePicker
        {...otherProps}
        {...this.datePickerOptions}
        isVisible={this.isDatePickerVisible}
        onConfirm={this.handlePickerSubmit}
        onCancel={this.handlePickerCancel}
      />
    );
  }
}

export default TimePicker;
