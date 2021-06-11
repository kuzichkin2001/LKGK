import React, {PureComponent} from 'react';
import {FlatList, Keyboard, Platform, StyleSheet, View} from 'react-native';
import UserLogoInfo from '../userLogoInfo';

import commonStyles from '../../styles';

class EmployeesChatList extends PureComponent {
  renderEmployee = ({item}) => {
    const {handleEmployeePress} = this.props;
    return (
      <UserLogoInfo
        isAchieve={item.achive_show}
        isOnline={item.in_office}
        subtitleStyle={styles.userType}
        onPress={() => {
          item.isTick = true;
        }}
        avatarSettings={item.icon}
        title={item.fullName || (!!item.name && item.name.full_name) || ''}
        isTick={item.isTick}
      />
    );
  };

  handleScrollBeginDrag = () => {
    if (Platform.OS === 'ios') {
      Keyboard.dismiss();
    }
  };

  keyExtractor = item => item.id_phperson;

  render() {
    const {
      data,
      searchInputValue,
      handleSearchChange,
      loadMoreEmployees,
      isLoadMoreAvailable,
      ...otherProps
    } = this.props;
    return (
      <View>
        <FlatList
          onScrollBeginDrag={this.handleScrollBeginDrag}
          onEndReached={() => !!isLoadMoreAvailable && loadMoreEmployees()}
          keyExtractor={this.keyExtractor}
          data={data}
          renderItem={this.renderEmployee}
          {...otherProps}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userType: {
    color: commonStyles.colors.green,
  },
});

export default EmployeesChatList;
