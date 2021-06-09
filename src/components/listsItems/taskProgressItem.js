import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import commonStyles from 'styles';
import moment from 'moment';
import locale from '../../locale';
import Label from '../../components/label';

const TaskProgressItem = ({
  title,
  subtitle,
  users,
  wrapperStyle,
}) => {

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <View style={styles.flexRow}>
        <View style={commonStyles.common.flex1}>
          <Text style={styles.name}>
            {title}
          </Text>
          <View style={styles.flexRow}>
            <Text numberOfLines={1} style={styles.subtitle}>
              {subtitle}
            </Text>
            {users.length &&
              <View style={{flexDirection: 'row'}}>
                {users.map(user =>
                  <View style={{marginLeft: 5}}>
                    <Label
                      radius={25}
                      bg={user.background}
                      color={user.color}
                      text={user.name}
                    />
                  </View>
                )}
              </View>
            }
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderTopColor: commonStyles.colors.lightGray,
    borderTopWidth: 1,
    backgroundColor: commonStyles.colors.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    ...commonStyles.texts.infoRowTitle,
  },
  subtitle: {
    ...commonStyles.texts.mainScreenSubtitle,
    paddingTop: 4,
  },
  firstItem: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  lastItem: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderRightWidth: 0,
  },
  item: {
    height: 6,
    borderRightWidth: 2,
    borderRightColor: '#fff',
  },
});

export default TaskProgressItem;
