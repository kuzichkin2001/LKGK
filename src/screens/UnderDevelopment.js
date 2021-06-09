import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {View, Image, Text, StyleSheet} from 'react-native';

import screensId from '../navigation/screensId';
import locale from 'locale';
import commonStyles from 'styles';

import ScreenNetworkConnectionIndicator from '../components/screenNetworkConnectionIndicator';
import LargeSubmitButton from '../components/buttons/largeSubmitButton';

@inject('navigationStore')
@observer
class UnderDevelopmentScreen extends Component {
  static options() {
    return {
      id: screensId.UNDER_DEVELOPMENT,
      topBar: {
        title: {
          text: locale.ru.title_under_development,
        },
      },
    };
  }

  handleBackPress = () => {
    this.props.navigationStore.popScreen();
  };

  render() {
    return (
      <View style={styles.screenWrapper}>
        <ScreenNetworkConnectionIndicator />
        <View style={styles.infoWrapper}>
          <Image
            source={require('assets/images/under_development_image.png')}
            resizeMode={'contain'}
            style={styles.image}
          />
          <Text style={styles.title}>{locale.ru.section_in_development}</Text>
          <Text style={styles.message}>
            {locale.ru.section_in_development_message}
          </Text>
        </View>
        <LargeSubmitButton
          onPress={this.handleBackPress}
          title={locale.ru.navigation_back}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    padding: commonStyles.spaces.xl,
    backgroundColor: commonStyles.colors.white,
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  infoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '70%',
  },
  image: {
    height: 100,
    width: 100,
  },
  title: {
    ...commonStyles.texts.mediumExtraLarge,
    marginTop: commonStyles.spaces.xl,
    textAlign: 'center',
  },
  message: {
    ...commonStyles.texts.common,
    color: commonStyles.colors.gray,
    marginTop: commonStyles.spaces.m,
    textAlign: 'center',
  },
});

export default UnderDevelopmentScreen;
