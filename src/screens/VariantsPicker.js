import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';

import screensId from '../navigation/screensId';

import ScreenWrapper from '../components/ScreenWrapper';
import VariantPickerList from '../components/lists/variantPickerList';

@inject('navigationStore')
@observer
class VariantsPickerScreen extends Component {
  static options() {
    return {
      id: screensId.VARIANTS_PICKER,
      topBar: {
        visible: true,
      },
    };
  }

  handleVariantPress = pickerVariant => {
    const {navigationStore, successCallback} = this.props;
    navigationStore.popScreen();
    successCallback(pickerVariant);
  };

  render() {
    const {pickerData} = this.props;

    return (
      <ScreenWrapper>
        <VariantPickerList
          onVariantPress={this.handleVariantPress}
          data={pickerData}
        />
      </ScreenWrapper>
    );
  }
}

export default VariantsPickerScreen;
