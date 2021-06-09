import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {reaction} from 'mobx';
import {Text, StyleSheet, Animated, Dimensions} from 'react-native';

import locale from 'locale';
import commonStyles from 'styles';

@inject('networkConnectionStore')
@observer
class ScreenNetworkConnectionIndicator extends Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(
      this.props.networkConnectionStore.connectionStatus ? 1 : 0,
    );
    this.reactionDisposer = reaction(
      () => this.props.networkConnectionStore.connectionStatus,
      status => {
        Animated.timing(this.animatedValue, {
          toValue: status ? 1 : 0,
          duration: 200,
        }).start();
      },
    );
  }

  componentWillUnmount() {
    this.reactionDisposer();
  }

  render() {
    const wrapperInterpolate = {
      opacity: this.animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
      top: this.animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -100],
      }),
    };

    return (
      <Animated.View
        onStartShouldSetResponder={() => false}
        onStartShouldSetResponderCapture={() => false}
        onMoveShouldSetResponderCapture={() => false}
        removeClippedSubviews={true}
        style={[styles.wrapper, wrapperInterpolate]}>
        <Text style={styles.message}>{locale.ru.error_network_connection}</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: Dimensions.get('screen').width,
    paddingHorizontal: 16,
    paddingVertical: commonStyles.spaces.m,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(200,16,46, 1)',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999,
  },
  message: {
    ...commonStyles.texts.commonLarge,
    color: commonStyles.colors.white,
  },
});

export default ScreenNetworkConnectionIndicator;
