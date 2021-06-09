import React from 'react';
import {StyleSheet} from 'react-native';

import commonStyles from 'styles';
import openPhone from '../../utils/openPhone';
import mailTo from '../../utils/mailTo';

import NavigateArrow from '../navigateArrow';
import IconInfoRow from '../iconInfoRow';
import CommonTouchable from './commonTouchable';
import Divider from '../divider';

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

const ProfileButton = ({
  title,
  onPress,
  icon,
  linking,
  style,
  dividerTitle,
  spaceSeparator,
}) => {
  const pressHandler = onPress
    ? onPress
    : linking
    ? () => handleLinking(title, linking)
    : null;
  return (
    <>
      {dividerTitle && <Divider title={dividerTitle} />}
      <CommonTouchable
        disabled={!pressHandler}
        style={[styles.wrapper, style, spaceSeparator && styles.spaceSeparator]}
        onPress={pressHandler}>
        <IconInfoRow hideBottomBorder={true} title={title} icon={icon} />
        {!!pressHandler && <NavigateArrow />}
      </CommonTouchable>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...commonStyles.common.rowCenterSpace,
    ...commonStyles.common.bottomBorder,
    backgroundColor: commonStyles.colors.white,
    paddingRight: 16,
  },
  spaceSeparator: {
    marginTop: 15,
  },
});

export default ProfileButton;
