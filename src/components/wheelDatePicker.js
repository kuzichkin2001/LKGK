import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {action, observable} from 'mobx';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {getBottomSpace} from 'react-native-iphone-x-helper';

import locale from 'locale';
import commonStyles from 'styles';

@observer
class WheelDatePicker extends Component {
  @observable
  date = new Date();

  @action
  handleDateChange = date => {
    this.date = date;
    this._isDateChanged = true;
  };

  handleSubmit = () => {
    const {date} = this.props;
    if (!this._isDateChanged && date) {
      this.props.onConfirm(date);
    } else {
      this.props.onConfirm(this.date);
    }
  };

  render() {
    const {
      minimumDate,
      maximumDate,
      mode = 'date',
      isVisible,
      onCancel,
      date,
      pickerType,
    } = this.props;
    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={isVisible}
        onRequestClose={onCancel}>
        <TouchableWithoutFeedback onPress={onCancel}>
          <View style={styles.wrapper}>
            <TouchableWithoutFeedback>
              <View style={styles.pickerWrapper}>
                <View style={styles.pickerHeaderWrapper}>
                  <TouchableOpacity style={styles.button} onPress={onCancel}>
                    <Text style={styles.cancelTitle}>{locale.ru.cancel}</Text>
                  </TouchableOpacity>
                  <Text style={styles.pickerTitle}>
                    {locale.ru.select_date}
                  </Text>
                  <TouchableOpacity
                    style={[styles.button, styles.confirmButton]}
                    onPress={this.handleSubmit}>
                    <Text style={commonStyles.texts.commonLarge}>
                      {locale.ru.ok}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <DatePicker
                    style={
                      pickerType === 'month' && {transform: [{translateX: -25}]}
                    }
                    minimumDate={minimumDate}
                    maximumDate={maximumDate}
                    mode={mode}
                    onDateChange={this.handleDateChange}
                    minuteInterval={1}
                    locale={'ru'}
                    date={date || this.date}
                  />
                  {pickerType === 'month' && <View style={styles.dayHide} />}
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
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  pickerWrapper: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: commonStyles.colors.white,
    paddingBottom: getBottomSpace(),
  },
  pickerHeaderWrapper: {
    width: '100%',
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderTopColor: commonStyles.colors.lightGray,
    borderBottomColor: commonStyles.colors.lightGray,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
    minHeight: 40,
  },
  cancelTitle: {
    ...commonStyles.texts.commonLarge,
    color: commonStyles.colors.red,
  },
  pickerTitle: {
    ...commonStyles.texts.titleBig,
    flex: 1,
    textAlign: 'center',
    alignSelf: 'center',
  },
  button: {
    width: 100,
    paddingVertical: commonStyles.spaces.s,
    paddingHorizontal: commonStyles.spaces.l,
  },
  confirmButton: {
    alignItems: 'flex-end',
  },
  dayHide: {
    height: '100%',
    width: Platform.select({ios: 58, android: 65}),
    position: 'absolute',
    top: 0,
    left: -25,
    backgroundColor: 'white',
  },
});

export default WheelDatePicker;
