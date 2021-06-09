import React from 'react';

import locale from 'locale';

import CommonFlatList from './commonFlatList';
import ReportListItem from '../listsItems/reportsListItem';

const ReportsList = props => (
  <CommonFlatList
    emptyListTitle={locale.ru.empty_list_reports}
    ItemComponent={ReportListItem}
    {...props}
  />
);

export default ReportsList;
