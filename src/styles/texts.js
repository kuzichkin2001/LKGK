import {StyleSheet, Platform} from 'react-native';

import fonts from 'styles/fonts';
import colors from 'styles/colors';

const getFontOffset = offset => [
  {translateY: Platform.select({ios: 0, android: 0})},
];

const styles = StyleSheet.create({
  common: {
    fontFamily: fonts.CeraProRegular,
    fontSize: 14,
    color: colors.blue,
    transform: getFontOffset(2.5),
  },
  commonSmall: {
    fontFamily: fonts.CeraProRegular,
    fontSize: 12,
    color: colors.blue,
  },
  commonExtraLarge: {
    color: colors.blue,
    fontSize: 18,
    fontFamily: fonts.CeraProRegular,
    transform: getFontOffset(3),
  },
  commonLarge: {
    fontFamily: fonts.CeraProRegular,
    fontSize: 16,
    color: colors.blue,
    transform: getFontOffset(2),
  },
  medium: {
    fontSize: 14,
    color: colors.blue,
    fontFamily: fonts.CeraProMedium,
    transform: getFontOffset(3),
  },
  mediumExtraLarge: {
    fontSize: 18,
    color: colors.blue,
    fontFamily: fonts.CeraProMedium,
  },
  label: {
    fontFamily: fonts.CeraProRegular,
    fontSize: 15,
    color: colors.label,
    transform: getFontOffset(3),
  },
  grayLabel: {
    fontFamily: fonts.CeraProRegular,
    fontSize: 14,
    color: colors.gray,
    transform: getFontOffset(3),
  },
  labelSmall: {
    fontFamily: fonts.CeraProRegular,
    fontSize: 12,
    color: colors.gray,
  },
  labelLarge: {
    fontFamily: fonts.CeraProRegular,
    fontSize: 16,
    color: colors.gray,
    transform: getFontOffset(3),
  },
  title: {
    fontSize: 14,
    fontFamily: fonts.CeraProBold,
    color: colors.blue,
    transform: getFontOffset(3),
  },
  titleBig: {
    fontSize: 16,
    fontFamily: fonts.CeraProBold,
    color: colors.blue,
    transform: getFontOffset(2),
  },
  badgeTitle: {
    fontSize: 11,
    fontFamily: fonts.CeraProBold,
    color: colors.white,
  },
  inputTitle: {
    fontSize: 15,
    fontFamily: fonts.CeraProRegular,
    color: colors.black,
    transform: getFontOffset(2.5),
  },
  listItemTitle: {
    fontSize: 15,
    fontFamily: fonts.CeraProRegular,
    color: colors.black,
    transform: getFontOffset(2.5),
  },
  inputError: {
    fontSize: 15,
    fontFamily: fonts.CeraProMedium,
    color: colors.red,
    transform: getFontOffset(2.5),
  },
  userProfileHeaderTitle: {
    fontSize: 30,
    color: colors.white,
    fontFamily: fonts.CeraProRegular,
    transform: getFontOffset(5),
    textAlign: 'center',
    letterSpacing: 0.385714,
  },
  userProfileHeaderSubtitle: {
    fontSize: 14,
    color: colors.white,
    fontFamily: fonts.CeraProRegular,
    transform: getFontOffset(3),
    letterSpacing: 0.385714,
    textAlign: 'center',
  },
  infoRowTitle: {
    fontSize: 15,
    color: colors.blue,
    fontFamily: fonts.CeraProRegular,
    transform: getFontOffset(1.6),
  },
  badge: {
    fontFamily: fonts.CeraProMedium,
    fontSize: 10,
    transform: getFontOffset(1.5),
    textAlign: 'center',
    color: '#142654',
  },
  menuButtonTitle: {
    fontSize: 12,
    color: colors.white,
    fontFamily: fonts.CeraProRegular,
    letterSpacing: 0.2,
    transform: getFontOffset(2),
  },
  mainScreenHeader: {
    fontSize: 28,
    letterSpacing: 0.2,
    fontFamily: fonts.CeraProBold,
    color: '#39434C',
    transform: getFontOffset(2),
  },
  switchButtonTitle: {
    color: colors.white,
    fontSize: 15,
    transform: getFontOffset(3),
    fontFamily: fonts.CeraProRegular,
  },
  visitsStatisticCellLabel: {
    color: colors.gray,
    fontSize: 15,
    fontFamily: fonts.CeraProRegular,
    transform: getFontOffset(3),
  },
  visitsStatisticCellValue: {
    color: colors.blue,
    fontSize: 15,
    transform: getFontOffset(3),
    fontFamily: fonts.CeraProRegular,
  },
  smallSubmitButtonTitle: {
    fontSize: 14,
    transform: getFontOffset(3),
    fontFamily: fonts.CeraProRegular,
    color: colors.white,
    textAlign: 'center',
  },
  loginButtonTitle: {
    fontSize: 16,
    color: colors.white,
    transform: getFontOffset(3),
    fontFamily: fonts.CeraProRegular,
  },
  authInput: {
    fontSize: 15,
    color: '#1B2A4A',
    fontFamily: fonts.CeraProRegular,
    transform: getFontOffset(3),
  },
  mainScreenSubtitle: {
    fontSize: 14,
    color: colors.label,
    transform: getFontOffset(2.5),
    fontFamily: fonts.CeraProRegular,
  },
  bottomAppInfo: {
    fontSize: 12,
    color: colors.label,
    fontFamily: fonts.CeraProRegular,
  },
  valueStandard: {
    fontSize: 15,
    fontFamily: fonts.CeraProRegular,
    color: colors.valueBlue,
  },
  grayChatButtonText: {
    fontSize: 16,
    fontFamily: fonts.CeraProRegular,
    color: colors.gray,
  },
  chatMessageSender: {
    fontSize: 16,
    fontFamily: fonts.CeraProMedium,
    color: colors.blue,
  },
  chatMessageText: {
    fontSize: 14,
    fontFamily: fonts.CeraProRegular,
    color: colors.blue,
  },
  chatMessageTime: {
    fontSize: 14,
    fontFamily: fonts.CeraProRegular,
    color: colors.gray,
  },
});

export default styles;
