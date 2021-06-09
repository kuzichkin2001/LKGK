import React, {useRef, useState} from 'react';
import {Animated, Dimensions} from 'react-native';

import CollapsibleDivider from './collapsibleDivider';

const CollapsibleView = ({title, children}) => {
  const [isOpened, setIsOpened] = useState(true);
  const [viewHeight, setViewHeight] = useState(Dimensions.get('screen').height);
  const [isViewHeightSetted, setIsViewHeightSetted] = useState(false);

  const animationMax = 100;
  const wrapperAnimatedValue = useRef(new Animated.Value(animationMax)).current;

  const hiddenView = [
    {
      opacity: wrapperAnimatedValue.interpolate({
        inputRange: [0, animationMax],
        outputRange: [0, 1],
      }),
      maxHeight: wrapperAnimatedValue.interpolate({
        inputRange: [0, animationMax],
        outputRange: [0, viewHeight],
      }),
    },
  ];

  const iconInterpolation = [
    {translateY: 5},
    {
      rotate: wrapperAnimatedValue.interpolate({
        inputRange: [0, animationMax],
        outputRange: ['-180deg', '0deg'],
      }),
    },
  ];

  const toggleOpenStatus = () => {
    Animated.timing(wrapperAnimatedValue, {
      toValue: isOpened ? 0 : animationMax,
      duration: isOpened ? 500 : 300,
    }).start(finished => {
      if (finished) {
        setIsOpened(!isOpened);
      }
    });
  };

  return (
    <>
      <CollapsibleDivider
        title={title}
        toggleOpenStatus={toggleOpenStatus}
        isOpened={isOpened}
        iconInterpolation={iconInterpolation}
      />
      <Animated.View
        style={[hiddenView, {overflow: 'hidden'}]}
        onLayout={e => {
          if (!isViewHeightSetted) {
            setViewHeight(e.nativeEvent.layout.height);
            setIsViewHeightSetted(true);
          }
        }}>
        {children}
      </Animated.View>
    </>
  );
};

export default CollapsibleView;
