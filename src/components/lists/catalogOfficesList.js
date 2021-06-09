import React, {PureComponent} from 'react';

import CommonFlatList from './commonFlatList';
import CatalogOfficeListItem from '../listsItems/catalogOfficeListItem';

class CatalogOfficesList extends PureComponent {
  render() {
    return (
      <CommonFlatList {...this.props} ItemComponent={CatalogOfficeListItem} />
    );
  }
}

export default CatalogOfficesList;
