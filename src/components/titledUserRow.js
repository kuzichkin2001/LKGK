import React, {PureComponent} from 'react';
import {StyleSheet} from 'react-native';

import commonStyles from 'styles';

import Divider from './divider';
import UserRow from './userRow';

class TitledUserRow extends PureComponent {
  render() {
    const {userData, onPress, title} = this.props;
    return (
      <>
        <Divider title={title} />
        <UserRow
          wrapperStyle={styles.userRowWrapper}
          onPress={onPress}
          userData={userData}
          showArrow={true}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  userRowWrapper: {
    ...commonStyles.common.bottomBorder,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: commonStyles.colors.white,
  },
});

export default TitledUserRow;
