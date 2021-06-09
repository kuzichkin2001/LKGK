import React, {PureComponent} from 'react';

import TitledTextSingleRow from '../titledTextSingleRow';
import {Text, StyleSheet} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import commonStyles from '../../styles';

class TitledValuePickerButton extends PureComponent {
  pickerRef = null;

  render() {
    const {title, value, onChange, ...otherProps} = this.props;
    return (
      <>
        <TitledTextSingleRow title={title} wrapperStyle={styles.wrapper}>
          <>
            <RNPickerSelect
              placeholder={{}}
              onValueChange={z => onChange(z)}
              ref={ref => (this.pickerRef = ref)}
              pickerProps={{
                hitSlop: {top: 10, bottom: 10, left: 15, right: 15},
              }}
              value={value}
              {...otherProps}>
              <Text style={[commonStyles.texts.infoRowTitle, styles.valueText]}>
                {value || ' '}
              </Text>
            </RNPickerSelect>
          </>
        </TitledTextSingleRow>
      </>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: 0,
    paddingVertical: 3,
    paddingRight: 1,
    marginRight: 0,
  },
  valueText: {
    color: commonStyles.colors.valueGray,
    marginLeft: 0,
    marginRight: 0,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignSelf: 'flex-end',
  },
});

export default TitledValuePickerButton;
