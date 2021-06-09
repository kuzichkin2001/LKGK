import React, {PureComponent} from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
} from 'react-native';

import commonStyles from 'styles';

const buttonSize =
  (Dimensions.get('screen').width - commonStyles.spaces.xl * 2) / 3 - 5;

class SquareMenuButton extends PureComponent {
  wrapperAnimatedValue = new Animated.Value(0);

  handlePressIn = () => {
    Animated.timing(this.wrapperAnimatedValue, {
      duration: 150,
      toValue: 1,
    }).start();
  };

  handlePressOut = () => {
    Animated.timing(this.wrapperAnimatedValue, {
      duration: 150,
      toValue: 0,
    }).start();
  };

  render() {
    const {onPress, title, icon, badge} = this.props;
    const badgeCount = badge ? (badge >= 100 ? '99+' : badge) : '';
    const wrapperScale = {
      transform: [
        {
          scale: this.wrapperAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.88],
          }),
        },
      ],
    };
    return (
      <TouchableWithoutFeedback
        onPressOut={this.handlePressOut}
        onPressIn={this.handlePressIn}
        onPress={onPress}>
        <Animated.View style={[styles.wrapper, wrapperScale]}>
          <View style={styles.container}>
            <View style={styles.circle} />
            <View style={styles.topWrapper}>
              <Image source={icon} resizeMode={'contain'} style={styles.icon} />
              {!!badgeCount && (
                <View style={styles.badgeWrapper}>
                  <Text style={commonStyles.texts.badge}>{badgeCount}</Text>
                </View>
              )}
            </View>
            <Text style={commonStyles.texts.menuButtonTitle}>{title}</Text>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#142654',
    margin: 5,
    height: buttonSize,
    width: buttonSize,
    borderRadius: 15,
    shadowColor: '#142654',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6.68,
    elevation: 8,
  },
  container: {
    flex: 1,
    overflow: 'hidden',
    padding: 6.59,
    paddingLeft: 9,
    paddingBottom: 9,
    borderRadius: 15,
    justifyContent: 'space-between',
  },
  badgeWrapper: {
    height: 16.46,
    width: 16.46,
    backgroundColor: commonStyles.colors.white,
    borderRadius: 16.46 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    ...commonStyles.texts.commonSmall,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 5,
  },
  icon: {
    height: 42,
    width: 42,
    marginTop: 9,
  },
  topWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  circle: {
    height: 75.6,
    width: 75.6,
    borderRadius: 75.6 / 2,
    backgroundColor: commonStyles.colors.mainMenuButtonBackground,
    position: 'absolute',
    bottom: -75.6 / 3,
    right: -75.6 / 3,
  },
});

export default SquareMenuButton;
