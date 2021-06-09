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
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {getBottomSpace} from 'react-native-iphone-x-helper';

import locale from 'locale';
import commonStyles from 'styles';

@observer
class WheelTimePicker extends Component {
  @observable
  time = new Date();

  @action
  handleTimeChange = time => {
    this.time = time;
    this._isTimeChanged = true;
  };

  handleSubmit = () => {
    const {time} = this.props;
    if (!this._isTimeChanged && time) {
      this.props.onConfirm(time);
    } else {
      this.props.onConfirm(this.time);
    }
  };

  render() {
    const {mode = 'time', isVisible, onCancel, time} = this.props;
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
                    {locale.ru.select_time}
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
                    mode={mode}
                    onDateChange={this.handleTimeChange}
                    minuteInterval={1}
                    locale={'ru'}
                    date={time || this.time}
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
});

export default WheelTimePicker;
