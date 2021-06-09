import React, {PureComponent} from 'react';
import {
  View,
  Text,
  Switch,
  Image,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import commonStyles from 'styles';

const Wrapper = ({children, rowClickable, onPress}) =>
  rowClickable ? (
    <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
  ) : (
    <>{children}</>
  );

class TitledRowSwitch extends PureComponent {
  render() {
    const {
      title,
      icon,
      value,
      titleColor,
      activity,
      rowClickable,
      ...otherProps
    } = this.props;
    const titleColorStyle = !!titleColor && {color: titleColor};
    return (
      <Wrapper onPress={() => this.props.onValueChange(!this.props.value)} rowClickable={rowClickable}>
        <View
          style={[
            commonStyles.common.listItem,
            commonStyles.common.rowCenterSpace,
          ]}>
          <View style={commonStyles.common.rowCenter}>
            {!!icon && (
              <Image
                style={[commonStyles.common.rowIcon, styles.icon]}
                resizeMode={'contain'}
                source={icon}
              />
            )}
            <Text style={[commonStyles.texts.infoRowTitle, titleColorStyle]}>
              {title}
            </Text>
          </View>
          {!activity ? (
            <Switch
              value={value}
              trackColor={commonStyles.colors.lightBlue}
              thumbColor={Platform.select({
                ios: null,
                android: value
                  ? commonStyles.colors.blue
                  : commonStyles.colors.gray,
              })}
              {...otherProps}
            />
          ) : (
            <ActivityIndicator
              size={'small'}
              color={commonStyles.colors.label}
            />
          )}
        </View>
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    tintColor: commonStyles.colors.label,
    transform: [{scale: 0.88}],
  },
});

export default TitledRowSwitch;
