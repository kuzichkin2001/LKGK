import {StyleSheet, Dimensions, Platform} from 'react-native';
import {getBottomSpace} from 'react-native-iphone-x-helper';

import colors from './colors';
import spaces from './spaces';
import texts from './texts';

const FORM_PADDING_HORIZONTAL = 16;

const BORDER_BOTTOM_WIDTH = 0.5;
const BORDER_BOTTOM_COLOR = colors.lightGray;

const styles = StyleSheet.create({
  bottomBorder: {
    borderBottomWidth: BORDER_BOTTOM_WIDTH,
    borderBottomColor: BORDER_BOTTOM_COLOR,
  },
  zeroTopOffset: {
    marginTop: 0,
    paddingTop: 0,
  },
  iconSize: {
    height: 30,
    width: 30,
  },
  iconBox: {
    height: 24,
    width: 24,
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: colors.white,
  },
  grayScreenWrapper: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  sideMenu: {
    width: Dimensions.get('screen').width * 0.8,
  },
  topOffset: {
    marginTop: spaces.m,
  },
  topOffsetXL: {
    marginTop: spaces.xl,
  },
  verticalOffset: {
    marginVertical: spaces.m,
  },
  screenOffset: {
    padding: spaces.xl,
    paddingBottom: spaces.xl + getBottomSpace(),
  },
  screenOffsetMargin: {
    margin: spaces.xl,
    marginBottom: spaces.xl + getBottomSpace(),
  },
  screenOffsetZeroTop: {
    padding: spaces.xl,
    paddingTop: 0,
    paddingBottom: spaces.xl + getBottomSpace(),
  },
  bottomSafe: {
    paddingBottom: getBottomSpace(),
  },
  paddingBottomM: {
    paddingBottom: spaces.m,
  },
  textInputWrapper: {
    paddingTop: spaces.xl,
    paddingBottom: Platform.select({
      ios: spaces.s,
      android: 0,
    }),
  },
  paddingTopOffset: {
    paddingTop: spaces.m,
  },
  requestListItemWrapper: {
    padding: spaces.xl,
    paddingVertical: spaces.m,
    backgroundColor: colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGray,
  },
  requestListItemDescriptionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spaces.m,
  },
  requestListItemDate: {
    ...texts.common,
    color: colors.gray,
    paddingLeft: spaces.m,
  },
  noBorder: {
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  rowCenterSpace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowCenterCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowEnd: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  listItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGray,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 14,
    backgroundColor: colors.white,
  },
  paddingVertical10: {
    paddingVertical: 10,
  },
  selfEnd: {
    alignSelf: 'flex-end',
  },
  horizontalPadding: {
    paddingHorizontal: spaces.xl,
  },
  horizontalMargin: {
    marginHorizontal: spaces.xl,
  },
  whiteBackground: {
    backgroundColor: colors.white,
  },
  whiteBackgroundPadding: {
    paddingHorizontal: spaces.xl,
    backgroundColor: colors.white,
  },
  titledTextLeftOffset: {
    paddingLeft: 9,
  },
  titledTextRightOffset: {
    paddingRight: 9,
  },
  infoRowOffset: {
    paddingTop: spaces.s,
  },
  itemBottomOffset: {
    marginBottom: spaces.m,
  },
  flex1: {
    flex: 1,
  },
  smallTopOffset: {
    paddingTop: 5,
  },
  mediumBottomOffset: {
    paddingBottom: 10,
  },
  centerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  formWrapper: {
    flex: 1,
    paddingBottom: 0,
    marginBottom: 0,
  },
  formContainer: {
    flex: 1,
    paddingBottom: 0,
    marginBottom: 0,
  },
  mediumLeftOffset: {
    paddingLeft: 10,
  },
  row: {
    flexDirection: 'row',
  },
  rowIcon: {
    height: 24,
    width: 24,
    marginRight: 10,
  },
  formPaddingHorizontal: {
    paddingHorizontal: FORM_PADDING_HORIZONTAL,
  },
  formPaddingVerticalDefault: {
    paddingHorizontal: 12,
  },
  activityIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataOffset: {
    paddingLeft: 11,
    flex: 1,
  },
  listWrapper: {
    flexDirection: 'row',
    borderBottomWidth: BORDER_BOTTOM_WIDTH,
    borderBottomColor: BORDER_BOTTOM_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  actionButton: {
    backgroundColor: colors.actionCreate,
  },
});

export default styles;
