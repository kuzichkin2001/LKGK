import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import {getVersion} from 'react-native-device-info';

import commonStyles from 'styles';
import locale from 'locale';

const appVersion = getVersion();

const AboutAppInfo = () => (
  <View style={styles.wrapper}>
    <Image
      resizeMode={'contain'}
      source={require('images/under_development_image.png')}
      style={styles.logo}
    />
    <Text
      style={[
        commonStyles.texts.mediumExtraLarge,
        commonStyles.common.topOffsetXL,
      ]}>
      ГК Основа Кабинет Сотрудника
    </Text>
    <Text style={[commonStyles.texts.common, commonStyles.common.topOffset]}>
      {`${locale.ru.app_version}: ${appVersion}`}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: commonStyles.spaces.xl,
  },
  logo: {
    height: 100,
    width: 100,
  },
});

export default AboutAppInfo;
