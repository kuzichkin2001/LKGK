import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';

import commonStyles from 'styles';

const imageHeight = 150;
const imageWidth = 150;

function ImagesSlider({images}) {
  const [imageLayout, setImageLayout] = useState({
    height: imageHeight,
    width: imageWidth,
  });
  const [swipperLayout, setSwiperLayout] = useState({
    height: imageHeight,
    width: imageWidth,
  });

  const calcHeight = () =>
    swipperLayout.width * (imageLayout.height / imageLayout.width);

  return (
    <Swiper
      onLayout={e => setSwiperLayout(e.nativeEvent.layout)}
      style={{backgroundColor: 'transparent', padding: 0}}
      activeDotColor={commonStyles.colors.blue}
      height={calcHeight()}>
      {images.map(image => (
        <FastImage
          source={{uri: image.path}}
          style={[
            styles.image,
            {
              height: calcHeight(),
            },
          ]}
          resizeMode={FastImage.resizeMode.contain}
          key={`${images.id}_${image.name}`}
          onLoad={e => {
            setImageLayout(e.nativeEvent);
          }}
        />
      ))}
    </Swiper>
  );
}

const styles = StyleSheet.create({
  image: {
    padding: 0,
  },
});

export default ImagesSlider;
