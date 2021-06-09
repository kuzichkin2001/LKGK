import React, {PureComponent} from 'react';

import locale from 'locale';

import DelegationListItem from '../listsItems/delegationListItem';
import SwitchButtonsHeader from '../switchButtonsHeader';
import CommonFlatList from './commonFlatList';

class DelegationList extends PureComponent {
  render() {
    const {type, onPress, onDelegationTypePress} = this.props;
    const switchButtons = [
      {
        title: 'Делегированные мне',
        isSelected: type === 'to_me',
        onPress: () => onDelegationTypePress('to_me'),
      },
      {
        title: 'Делегированные мной',
        isSelected: type === 'from_me',
        onPress: () => onDelegationTypePress('from_me'),
      },
    ];

    return (
      <>
        <SwitchButtonsHeader buttons={switchButtons} />
        <CommonFlatList
          {...this.props}
          itemProps={{type}}
          onItemPress={onPress}
          ItemComponent={DelegationListItem}
          emptyListTitle={locale.ru.empty_list_delegation}
        />
      </>
    );
  }
}

export default DelegationList;
