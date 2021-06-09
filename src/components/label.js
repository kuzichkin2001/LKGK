import React from 'react';
import {Text, View} from 'react-native';

const Label = ({
  width,
  height,
  radius,
  bg,
  text,
  color,
}) => {
  return (
    <View style={{
      width: radius ? radius : width,
      height: radius ? radius : height,
      backgroundColor: bg,
      borderRadius: radius ? radius/2 : 2,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Text style={{color, fontSize: radius/2.6, fontWeight: '700'}}>{text}</Text>
    </View>
  );
};

export default Label;
