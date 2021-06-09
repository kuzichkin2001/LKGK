import React, {PureComponent} from 'react';
import {FlatList, View, StyleSheet, Text} from 'react-native';

import commonStyles from 'styles';

import SessionListItem from '../listsItems/sessionListItem';
import TextButton from '../buttons/TextButton';

class ActiveSessionsList extends PureComponent {
  renderHeader = () => {
    const {
      currentSession,
      sessionsCleanActivity,
      onSessionsCleanPress,
    } = this.props;
    if (currentSession) {
      return (
        <View style={styles.headerWrapper}>
          <Text style={styles.headerTitle}>Текущий сеанс: </Text>
          <SessionListItem
            data={currentSession}
            wrapperStyle={styles.currentSession}
          />
          {this.props.data.length > 1 && (
            <TextButton
              wrapperStyle={styles.headerButtonWrapper}
              activity={sessionsCleanActivity}
              onPress={onSessionsCleanPress}
              titleStyle={styles.headerButtonTitle}
              title={'Завершить другие сессии'}
            />
          )}
        </View>
      );
    } else {
      return null;
    }
  };

  renderItem = ({item}) => {
    const {onSessionPress, sessionsRemoveActivities} = this.props;
    if (!item || item.current) {
      return null;
    } else {
      return (
        <SessionListItem
          activity={!!sessionsRemoveActivities[item.id]}
          data={item}
          onPress={() => onSessionPress(item)}
        />
      );
    }
  };

  keyExtractor = item => item.id;

  render() {
    const {data, refreshing, sessionsRemoveActivities, onRefresh} = this.props;
    return (
      <FlatList
        stickyHeaderIndices={[0]}
        extraData={sessionsRemoveActivities}
        ListHeaderComponent={this.renderHeader}
        renderItem={this.renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={data}
        keyExtractor={this.keyExtractor}
      />
    );
  }
}

const styles = StyleSheet.create({
  headerWrapper: {
    ...commonStyles.common.bottomBorder,
    backgroundColor: commonStyles.colors.white,
  },
  headerButtonWrapper: {
    paddingBottom: commonStyles.spaces.l,
  },
  headerButtonTitle: {
    alignSelf: 'center',
  },
  headerTitle: {
    ...commonStyles.texts.title,
    padding: commonStyles.spaces.xl,
    paddingTop: commonStyles.spaces.l,
    paddingBottom: 0,
  },
  currentSession: {
    borderBottomWidth: 0,
  },
});

export default ActiveSessionsList;
