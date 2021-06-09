import React from 'react';
import {FlatList} from 'react-native';

import CollapsibleView from '../collapsibleView';
import Award from '../award';

import locale from '../../locale';

const AwardsList = ({data}) => {
  const renderItem = ({item}) => {
    return <Award data={item} />;
  };

  const keyExtractor = award => award.id;

  if (!data || !data.awards || data.awards.length === 0) {
    return null;
  }

  return (
    <CollapsibleView title={locale.ru.awards}>
      <FlatList
        keyExtractor={keyExtractor}
        data={data.awards}
        renderItem={renderItem}
      />
    </CollapsibleView>
  );
};

export default AwardsList;
