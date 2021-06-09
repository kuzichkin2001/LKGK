import React, {PureComponent} from 'react';

import locale from 'locale';

import SupportRequestListItem from '../listsItems/supportRequest';
import CommonFlatList from './commonFlatList';
import LargeSubmitButton from '../buttons/largeSubmitButton';

class SupportRequestsList extends PureComponent {
  render() {
    const {onCreatePress, ...otherProps} = this.props;
    return (
      <>
        <CommonFlatList
          emptyListTitle={locale.ru.empty_list_requests}
          ItemComponent={SupportRequestListItem}
          {...otherProps}
        />
        <LargeSubmitButton
          onPress={onCreatePress}
          title={locale.ru.create_request}
        />
      </>
    );
  }
}

export default SupportRequestsList;
