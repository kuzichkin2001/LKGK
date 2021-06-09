import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';

import commonStyles from '../styles';

const RewardsByType = type => {
  switch (type.trim()) {
    case '1':
      return require('../assets/images/award_1.png');
    default:
      return require('../assets/images/award_2.png');
  }
};

class Award extends PureComponent {
  render() {
    const {data} = this.props;
    if (!data) {
      return null;
    }
    const {title, description, type} = data;
    if (!title) {
      return null;
    }
    const fixedType = type.trim();
    return (
      <>
        <View style={styles.wrapper}>
          <FastImage
            resizeMode={'contain'}
            style={styles.awardIcon}
            source={RewardsByType(type)}
          />
          <View style={styles.descriptionWrapper}>
            <Text style={commonStyles.texts.label}>{title.trim()}</Text>
            <Text
              style={[
                commonStyles.texts.infoRowTitle,
                commonStyles.common.smallTopOffset,
              ]}>
              {description.trim()}
            </Text>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    ...commonStyles.common.bottomBorder,
    backgroundColor: commonStyles.colors.white,
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 10,
    flexDirection: 'row',
  },
  awardIcon: {
    height: 120,
    width: 93.82,
  },
  descriptionWrapper: {
    paddingLeft: 10,
    paddingTop: Platform.select({
      ios: 12,
      android: 10,
    }),
    flex: 1,
  },
});

export default Award;
