import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import commonStyles from 'styles';

import Avatar from '../avatar';
import InputSideButton from '../buttons/inputSideButton';
import InputWrapper from '../inputWrapper';
import NavigateArrow from '../navigateArrow';

const EmployeePickListItem = ({
  employeeData,
  onRemove,
  onPress,
  removeBottomOffset,
  wrapperStyle,
  subtitle,
  children,
}) => {
  if (!employeeData) {
    return null;
  }
  return (
    <InputWrapper
      onPress={onPress}
      wrapperStyle={[wrapperStyle, styles.inputWrapper]}
      removeBottomOffset={removeBottomOffset}>
      <View style={styles.wrapper}>
        <View style={styles.employeeDataWrapper}>
          <Avatar
            isSmall={true}
            isMedium={!!subtitle}
            {...employeeData.avatar}
          />
          <View style={commonStyles.common.flex1}>
            <Text style={styles.name}>
              {employeeData.full_name ||
                (employeeData.name && employeeData.name.full_name)}
            </Text>
            {!!subtitle && (
              <Text numberOfLines={1} style={styles.subtitle}>
                {employeeData.unit}
              </Text>
            )}
          </View>
        </View>
        {!!onRemove && (
          <InputSideButton
            onPress={onRemove}
            iconStyle={styles.icon}
            source={require('images/cross-thin.png')}
          />
        )}
        {!onRemove && onPress && <NavigateArrow />}
      </View>
      {children}
    </InputWrapper>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    backgroundColor: commonStyles.colors.white,
    paddingVertical: 10,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    ...commonStyles.texts.infoRowTitle,
    paddingHorizontal: commonStyles.spaces.m,
  },
  subtitle: {
    ...commonStyles.texts.mainScreenSubtitle,
    paddingTop: 2,
    paddingLeft: 10,
  },
  employeeDataWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    height: 30,
    width: 30,
  },
});

export default EmployeePickListItem;
