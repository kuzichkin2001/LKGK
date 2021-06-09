import React, {PureComponent} from 'react';
import {Text, View, StyleSheet} from 'react-native';

import commonStyles from 'styles';
import locale from 'locale';

import UserRow from '../userRow';
import IconText from '../iconText';
import CommonTouchable from '../buttons/commonTouchable';
import NavigateArrow from '../navigateArrow';

class ApprovingTaskRelatedListItem extends PureComponent {
  get statusText() {
    let result = '';
    try {
      switch (this.props.data.status + '') {
        case '0':
          result = locale.ru.approving_task_viewing;
          break;
        case '2':
          result = locale.ru.approving_task_declined;
          break;
        default:
          result = locale.ru.approving_task_accepted;
      }
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  get statusColor() {
    let result = '';
    try {
      switch (this.props.data.status + '') {
        case '0':
          result = commonStyles.colors.label;
          break;
        case '2':
          result = commonStyles.colors.red;
          break;
        default:
          result = commonStyles.colors.green;
      }
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  get statusIcon() {
    let result = null;
    try {
      switch (this.props.data.status + '') {
        case '0':
          result = require('images/clock.png');
          break;
        case '2':
          result = require('images/list-item-delete.png');
          break;
        default:
          result = require('images/complete.png');
      }
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  render() {
    const {data, onPress} = this.props;
    if (!data) {
      return null;
    }
    const {comment, user, status} = data;
    return (
      <View style={styles.wrapper}>
        <CommonTouchable
          onPress={onPress}
          style={[styles.infoRow, commonStyles.common.rowCenter]}>
          <UserRow wrapperStyle={styles.userRow} userData={user} />
          <NavigateArrow style={styles.userArrow} />
        </CommonTouchable>
        <View style={styles.animatedContainer}>
          {!!comment && <Text style={styles.comment}>{comment}</Text>}
          <IconText
            color={this.statusColor}
            wrapperStyle={styles.statusWrapper}
            iconStyle={status == 2 && {transform: [{scale: 1.35}]}}
            icon={this.statusIcon}
            value={this.statusText}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    ...commonStyles.common.bottomBorder,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  name: {
    ...commonStyles.texts.common,
    flex: 1,
  },
  animatedContainer: {
    overflow: 'hidden',
  },
  comment: {
    ...commonStyles.texts.label,
    paddingBottom: 10,
    paddingLeft: 16 + 25 + 10,
    paddingRight: 16,
  },
  statusWrapper: {
    paddingBottom: 10,
    paddingLeft: 16 + 25 + 10,
    paddingRight: 16,
  },
  userRow: {
    flex: 1,
  },
  userArrow: {
    transform: [{translateY: 2.3}],
  },
});

export default ApprovingTaskRelatedListItem;
