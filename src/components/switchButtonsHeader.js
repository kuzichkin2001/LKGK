import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';

import commonStyles from 'styles';

import SwitchButtons from './buttons/switchButtons';

class SwitchButtonsHeader extends PureComponent {
  render() {
    const {buttons} = this.props;
    return (
      <View style={styles.headerWrapper}>
        <SwitchButtons
          wrapperStyle={{borderColor: commonStyles.colors.white}}
          buttons={buttons}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: commonStyles.colors.blue,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default SwitchButtonsHeader;
