import React, {Fragment, PureComponent} from 'react';
import {FlatList, StyleSheet} from 'react-native';

import locale from '../../locale';
import commonStyles from 'styles';
import openPhone from '../../utils/openPhone';
import mailTo from '../../utils/mailTo';

import UserLogoInfo from '../userLogoInfo';
import Divider from '../divider';
import UserInfoField from '../listsItems/userInfoField';

class UserInfoList extends PureComponent {
  handleLinking = (value, type) => {
    switch (type) {
      case 'phone':
        openPhone(value);
        break;
      case 'email':
        mailTo(value);
        break;
      default:
        console.log(`unknown linking type: ${type}, with value: ${value}`);
    }
  };

  renderInfoField = ({item}) => {
    const {userData} = this.props;
    if (!item) {
      return null;
    }
    if (item.divider) {
      return <Divider title={item.divider.title} />;
    }
    const value = userData ? userData[item.field] : '';
    const handlePress = item.onPress
      ? item.onPress
      : item.linking
      ? () => this.handleLinking(value, item.linking)
      : null;
    return (
      <UserInfoField onPress={handlePress} title={item.title} value={value} />
    );
  };

  render() {
    const {userData, fields, refreshing, onRefresh, ...otherProps} = this.props;
    if (userData && fields) {
      return (
        <Fragment>
          <UserLogoInfo
            isAchieve={!!userData && userData.achive_show}
            isOnline={userData ? userData.in_office : false}
            title={
              userData ? (userData.name ? userData.name.full_name : '') : ''
            }
            avatarSettings={userData ? userData.avatar : null}
            subtitle={userData ? userData.position : ''}
            subtitleStyle={styles.userType}
          />
          <FlatList
            ListHeaderComponent={<Divider title={locale.ru.main_info} />}
            extraData={!!refreshing}
            keyExtractor={item => item.field}
            data={fields}
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            renderItem={this.renderInfoField}
            {...otherProps}
          />
        </Fragment>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  mainInfoWrapper: {
    backgroundColor: commonStyles.colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: '100%',
  },
  userType: {
    color: commonStyles.colors.green,
  },
  mainInfo: {
    ...commonStyles.texts.common,
  },
});

export default UserInfoList;
