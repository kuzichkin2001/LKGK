import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import CommonTouchable from '../buttons/commonTouchable';
import formatDate from '../../utils/formatDate';
import commonStyles from '../../styles';

const DocumentRequestListItem = ({data, onPress, requestType}) => (
  <>
    <CommonTouchable
      style={commonStyles.common.listItem}
      disabled={!onPress}
      onPress={onPress}>
      <Text numberOfLines={1} style={commonStyles.texts.infoRowTitle}>
        {data.name}
      </Text>
      <View style={[commonStyles.common.infoRowOffset]}>
        {!!data.number && (
          <Text style={[commonStyles.texts.infoRowTitle, styles.textColor]}>
            {data.number}
          </Text>
        )}
        <Text style={[commonStyles.texts.infoRowTitle, styles.textColor]}>
          {data.type}
        </Text>
        {requestType !== 1 && (
          <Text style={[commonStyles.texts.infoRowTitle, styles.textColor]}>
            {data.status}
          </Text>
        )}
        <Text style={[commonStyles.texts.infoRowTitle, styles.textColor]}>
          {formatDate(data.dt_create, 'DD.MM.YYYY')}
        </Text>
      </View>
    </CommonTouchable>
  </>
);

const styles = StyleSheet.create({
  textColor: {
    color: 'black',
  },
});

export default DocumentRequestListItem;
