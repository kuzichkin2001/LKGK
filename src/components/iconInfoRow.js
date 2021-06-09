import React, {PureComponent} from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';

import commonStyles from 'styles';

class IconInfoRow extends PureComponent {
  render() {
    const {icon, title, hideBottomBorder} = this.props;
    return (
      <View
        style={[
          styles.wrapper,
          !!hideBottomBorder && styles.hiddenBottomBorder,
        ]}>
        {!!icon && (
          <Image resizeMode={'contain'} source={icon} style={styles.icon} />
        )}
        <Text style={commonStyles.texts.infoRowTitle}>{title}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    ...commonStyles.common.bottomBorder,
    ...commonStyles.common.rowCenter,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flex: 1,
  },
  icon: {
    height: 24,
    width: 24,
    marginRight: 10,
  },
  hiddenBottomBorder: {
    borderBottomWidth: 0,
  },
});

export default IconInfoRow;
