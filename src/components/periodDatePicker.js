import React, {Component} from 'react';
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import DatePicker from 'react-native-date-picker';

import commonStyles from 'styles';
import locale from 'locale';
import inputTypes from '../forms/inputTypes';
import {showMessage} from '../utils/showMessage';

import TextButton from './buttons/TextButton';
import SwitchButtons from './buttons/switchButtons';

@observer
class PeriodDatePicker extends Component {
  _pickerResolver = null;

  @observable
  period = {
    from: null,
    to: null,
  };

  @observable
  selectedDateType = 'from';

  @observable
  isPickerVisible = false;

  @observable
  minimumDate = null;

  @observable
  maximumDate = null;

  @computed
  get date() {
    return this.period[this.selectedDateType] || new Date();
  }

  @computed
  get typeSwitchButtons() {
    const {isSingleDate} = this.props;
    return isSingleDate ? [] : [
      {
        title: locale.ru.from,
        onPress: () => this.setDateType('from'),
        isSelected: this.selectedDateType === 'from',
      },
      {
        title: locale.ru.to,
        onPress: () => this.setDateType('to'),
        isSelected: this.selectedDateType === 'to',
      },
    ];
  }

  @action
  handleDateChange = date => {
    this.period[this.selectedDateType] = date;
  };

  @action
  setDateType = dateType => {
    this.selectedDateType = dateType;
    const {to, from} = this.period;
    if (dateType === 'from') {
      this.minimumDate = new Date();
      this.maximumDate = to ? to : null;
    } else {
      if (!to) {
        this.period.to = new Date(new Date(from).getTime() + 86400000);
      }
      this.minimumDate = new Date(new Date(from).getTime() + 86400000);
      this.maximumDate = null;
    }
  };

  @action
  pickDate = async period => {
    return await new Promise(resolve => {
      this._pickerResolver = resolve;
      this.period.from = (period && period[inputTypes.dateStart]) || new Date();
      this.period.to = (period && period[inputTypes.dateEnd]) || null;
      this.isPickerVisible = true;
    });
  };

  @action
  handleSubmit = isCancel => {
    const {isSingleDate} = this.props;
    if (this._pickerResolver) {
      if (isCancel) {
        this._pickerResolver(null);
        this.period = {
          from: null,
          to: null,
        };
        this.isPickerVisible = false;
        this._pickerResolver = null;
      } else if (!this.period.from) {
        showMessage(locale.ru.error, locale.ru.select_start_date);
      } else if (!this.period.to && !isSingleDate) {
        showMessage(locale.ru.error, locale.ru.select_end_date);
      } else if (
        new Date(this.period.from).getTime() >=
        new Date(this.period.to).getTime() &&
        !isSingleDate
      ) {
        showMessage(
          locale.ru.error,
          locale.ru.end_date_must_be_longer_start_date,
        );
      } else {
        this._pickerResolver({
          [inputTypes.dateStart]: this.period.from,
          [inputTypes.dateEnd]: this.period.to,
        });
        this.period = {
          from: null,
          to: null,
        };
        this.isPickerVisible = false;
        this._pickerResolver = null;
      }
    }
  };

  render() {
    const {currentDate} = this.props;
    return (
      <Modal
        transparent={true}
        onRequestClose={() => this.handleSubmit(true)}
        animated={true}
        animationType={'fade'}
        visible={this.isPickerVisible}>
        <TouchableWithoutFeedback onPress={() => this.handleSubmit(true)}>
          <View style={styles.wrapper}>
            <TouchableWithoutFeedback>
              <View style={styles.itemsWrapper}>
                <SwitchButtons buttons={this.typeSwitchButtons} />
                <View style={commonStyles.common.rowCenterCenter}>
                  <DatePicker
                    minimumDate={this.minimumDate}
                    maximumDate={this.maximumDate}
                    date={this.date}
                    onDateChange={this.handleDateChange}
                    style={styles.datePicker}
                    mode={'date'}
                    locale={'ru'}
                  />
                  {/*<DatePicker*/}
                  {/*  minimumDate={this.minimumDate}*/}
                  {/*  maximumDate={this.maximumDate}*/}
                  {/*  date={this.date}*/}
                  {/*  onDateChange={this.handleDateChange}*/}
                  {/*  style={styles.timePicker}*/}
                  {/*  mode={'time'}*/}
                  {/*/>*/}
                </View>
                <View style={[styles.submitButtonsWrapper]}>
                  <TextButton
                    onPress={() => this.handleSubmit(true)}
                    title={locale.ru.cancel}
                  />
                  <TextButton
                    onPress={() => this.handleSubmit(false)}
                    titleStyle={{color: commonStyles.colors.blue}}
                    title={locale.ru.ok}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  submitButtonsWrapper: {
    ...commonStyles.common.rowCenterSpace,
    padding: 16,
  },
  wrapper: {
    flex: 1,
    backgroundColor: commonStyles.colors.semiTransparentBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemsWrapper: {
    backgroundColor: commonStyles.colors.white,
    borderRadius: 6,
    maxWidth: '95%',
  },
  titleFrom: {
    ...commonStyles.texts.title,
    ...commonStyles.common.horizontalPadding,
    ...commonStyles.common.topOffset,
  },
  titleTo: {
    ...commonStyles.texts.title,
    ...commonStyles.common.horizontalPadding,
  },
  datePicker: {
    width: Platform.select({
      ios: 250,
      android: 210,
    }),
  },
  timePicker: {
    width: Platform.select({
      android: 120,
      ios: 110,
    }),
  },
});

export default PeriodDatePicker;
