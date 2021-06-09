import React from 'react';
import {StyleSheet} from 'react-native';

import locale from 'locale';
import commonStyles from 'styles';
import openPhone from '../../utils/openPhone';
import mailTo from '../../utils/mailTo';

import TitledText from '../titledText';
import CommonTouchable from '../buttons/commonTouchable';

const handleLinking = (value, type) => {
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

const UserInfoField = ({title, value, linking, onPress}) => {
  if (!value) {
    return null;
  }
  return (
    <CommonTouchable
      onPress={() => {
        if (onPress) {
          onPress();
        } else {
          handleLinking(value, linking);
        }
      }}
      disabled={!linking && !onPress}
      style={styles.wrapper}>
      <TitledText
        valueStyle={
          value === locale.ru.employee_working && styles.workingStatus
        }
        title={title}
        value={value}
      />
    </CommonTouchable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...commonStyles.common.bottomBorder,
    backgroundColor: commonStyles.colors.white,
  },
  workingStatus: {
    color: commonStyles.colors.green,
  },
});

export default UserInfoField;
