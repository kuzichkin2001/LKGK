import React from 'react';
import {View, Text, StyleSheet, Animated, TouchableOpacity} from 'react-native';
import commonStyles from 'styles';
import moment from 'moment';
import locale from '../../locale';

const TimeProgressItem = ({
  title,
  subtitle,
  items,
  wrapperStyle,
  toggleVisibilityCallback,
  isOpened,
}) => {
  const totalTime = items.length
    ? items.reduce((acc, curr) => (acc += curr.value), 0)
    : 0;

  const wrapperAnimatedValue = new Animated.Value(0);

  const arrowInterpolation = [
    {translateY: 5},
    {
      rotate: wrapperAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-180deg'],
      }),
    },
  ];

  const toggleOpenStatus = () => {
    Animated.timing(wrapperAnimatedValue, {
      toValue: isOpened ? 0 : 1,
      duration: isOpened ? 500 : 250,
    }).start(({finished}) => {
      toggleVisibilityCallback();
    });
  };

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      {(title || subtitle) && (
        <TouchableOpacity onPress={toggleOpenStatus}>
          <View style={styles.introWrapper}>
            <Animated.Image
              style={[styles.arrowIcon, {transform: arrowInterpolation}]}
              source={require('../../assets/images/arrow-down.png')}
            />

            <View style={commonStyles.common.flex1}>
              {!!title && <Text style={styles.name}>{title}</Text>}
              {!!subtitle && (
                <Text numberOfLines={1} style={styles.subtitle}>
                  {subtitle}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      )}
      {!!totalTime && isOpened && (
        <View style={{flexDirection: 'row', paddingTop: 10}}>
          {items.map((item, index) => {
            // styles
            let activeStyles = [styles.item, {backgroundColor: item.color}];
            if (index === 0) {
              activeStyles.push(styles.firstItem);
            }
            if (index === items.length - 1) {
              activeStyles.push(styles.lastItem);
            }

            // proportion
            const flex = item.value / totalTime;

            return (
              <View style={{flex: flex < 0.2 ? 0.2 : flex}}>
                <View style={activeStyles} />
                <View>
                  <Text style={{paddingTop: 5}}>
                    {moment
                      .duration(item.value, 'seconds')
                      .format(
                        `H[${locale.ru.hours_min}] mm[${
                          locale.ru.minutes_min
                        }]`,
                      )}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: commonStyles.colors.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  introWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    ...commonStyles.texts.infoRowTitle,
  },
  subtitle: {
    ...commonStyles.texts.mainScreenSubtitle,
    paddingTop: 4,
  },
  firstItem: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  lastItem: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderRightWidth: 0,
  },
  item: {
    height: 6,
    borderRightWidth: 2,
    borderRightColor: '#fff',
  },
  arrowIcon: {
    height: 24,
    width: 24,
    marginRight: 11,
  },
});

export default TimeProgressItem;
