import React, {PureComponent, Fragment} from 'react';
import {View, StyleSheet, Animated, Text, TouchableOpacity} from 'react-native';

import commonStyles from 'styles';
import locale from 'locale';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(
  TouchableOpacity,
);

class TitledCell extends PureComponent {
  render() {
    const {title, value, wrapperStyle} = this.props;
    return (
      <View style={[wrapperStyle]}>
        <Text style={commonStyles.texts.visitsStatisticCellLabel}>{title}</Text>
        <Text
          style={[
            commonStyles.texts.visitsStatisticCellValue,
            commonStyles.common.smallTopOffset,
          ]}>
          {value}
        </Text>
      </View>
    );
  }
}

class StatisticVisitsRow extends PureComponent {
  constructor(props) {
    super(props);
    this.isEmptyDay = props.data.empty || props.data.holiday;
  }

  wrapperAnimatedValue = new Animated.Value(0);

  isOpened = false;

  toggleOpenStatus = () => {
    this.isOpened = !this.isOpened;
    Animated.timing(this.wrapperAnimatedValue, {
      toValue: this.isOpened ? 1 : 0,
      duration: 300,
    }).start();
  };

  render() {
    const hiddenRowsWrapperInterpolation = {
      paddingVertical: this.wrapperAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, commonStyles.spaces.l],
      }),
      opacity: this.wrapperAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      maxHeight: this.wrapperAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 222],
      }),
    };

    const arrowInterpolation = [
      {translateY: 5},
      {
        rotate: this.wrapperAnimatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-180deg'],
        }),
      },
    ];

    return (
      <Animated.View style={styles.wrapper}>
        <AnimatedTouchableOpacity
          activeOpacity={1}
          onPress={this.toggleOpenStatus}
          disabled={!!this.isEmptyDay}
          style={[
            styles.infoRow,
            styles.rowWrapper,
            commonStyles.common.bottomBorder,
          ]}>
          {this.isEmptyDay ? (
            <View style={styles.infoRow}>
              <TitledCell
                wrapperOffsetDisabled={true}
                value={this.props.data.date}
                wrapperStyle={styles.dateStyle}
                title={locale.ru.date}
              />
              <TitledCell
                wrapperStyle={styles.cellSize}
                title={locale.ru.absence_reason}
                value={
                  this.props.data.empty
                    ? locale.ru.holiday
                    : this.props.data.status || locale.ru.unknown_reason
                }
              />
              {this.props.data.doc_num ? (
                <TitledCell
                  wrapperStyle={styles.cellSize}
                  title={locale.ru.document_number}
                  value={this.props.data.doc_num}
                />
              ) : null}
            </View>
          ) : (
            <Fragment>
              <TitledCell
                value={this.props.data.date}
                wrapperStyle={styles.dateStyle}
                title={locale.ru.date}
              />
              <TitledCell
                wrapperOffsetDisabled={true}
                value={
                  this.isEmptyDay ? '-' : this.props.data.enter_time || '-'
                }
                wrapperStyle={styles.cellSize}
                title={locale.ru.enter}
              />
              <TitledCell
                wrapperOffsetDisabled={true}
                value={this.isEmptyDay ? '-' : this.props.data.exit_time || '-'}
                wrapperStyle={styles.halfFlex}
                title={locale.ru.office_left}
              />
              <View style={styles.cellSize}>
                <Animated.Image
                  style={[styles.arrowIcon, {transform: arrowInterpolation}]}
                  source={require('images/arrow-down.png')}
                />
              </View>
            </Fragment>
          )}
        </AnimatedTouchableOpacity>
        {this.isEmptyDay ? null : (
          <Animated.View
            style={[
              styles.rowWrapper,
              styles.hiddenRowsWrapper,
              hiddenRowsWrapperInterpolation,
            ]}>
            <View style={styles.infoRow}>
              <TitledCell
                wrapperOffsetDisabled={true}
                value={
                  this.props.data.is_late ? this.props.data.enter_time : '-'
                }
                wrapperStyle={styles.cellSize}
                title={locale.ru.come_late}
              />
              <TitledCell
                wrapperOffsetDisabled={true}
                value={
                  this.props.data.is_earlier ? this.props.data.exit_time : '-'
                }
                wrapperStyle={styles.secondHiddenTableCell}
                title={locale.ru.quit_early}
              />
            </View>
            <View style={[styles.infoRow, styles.secondHiddenRowOffset]}>
              <TitledCell
                wrapperOffsetDisabled={true}
                value={this.props.data.territory_time}
                wrapperStyle={styles.cellSize}
                title={locale.ru.on_territory}
              />
              <TitledCell
                wrapperOffsetDisabled={true}
                value={this.props.data.idle_time}
                wrapperStyle={styles.secondHiddenTableCell}
                title={locale.ru.outside_territory}
              />
            </View>
          </Animated.View>
        )}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    backgroundColor: commonStyles.colors.white,
  },
  rowWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hiddenRowsWrapper: {
    ...commonStyles.common.bottomBorder,
  },
  cellSize: {
    flex: 1,
  },
  secondHiddenRowOffset: {
    marginTop: commonStyles.spaces.l,
  },
  secondHiddenTableCell: {
    flex: 0.82,
  },
  halfFlex: {
    flex: 0.5,
  },
  dateStyle: {
    width: 100,
  },
  arrowIcon: {
    height: 30,
    width: 30,
    alignSelf: 'flex-end',
  },
});

export default StatisticVisitsRow;
