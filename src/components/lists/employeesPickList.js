import React, {PureComponent} from 'react';
import {FlatList} from 'react-native';

import ListAddHeader from '../listAddHeader';
import EmployeePickListItem from '../listsItems/employeePickListItem';
import Divider from '../divider';

class EmployeesPickList extends PureComponent {
  renderItem = ({item}) => {
    const {onRemove, onEmployeePress} = this.props;
    const removeHandler = onRemove ? () => onRemove(item) : null;
    const pressHandler = onEmployeePress ? () => onEmployeePress(item) : null;
    return (
      <EmployeePickListItem
        removeBottomOffset={true}
        onPress={pressHandler}
        employeeData={item}
        onRemove={removeHandler}
      />
    );
  };

  renderHeader = () => {
    const {onAddPress, title, dividerTitle} = this.props;
    if (onAddPress) {
      return (
        <ListAddHeader
          dividerTitle={dividerTitle}
          onAddPress={onAddPress}
          title={title}
          removeBottomOffset={true}
          showIconAndTitle
        />
      );
    } else {
      return <Divider title={dividerTitle || title} />;
    }
  };

  render() {
    const {
      title,
      data,
      hideIfEmpty,
      onAddPress,
      wrapperStyle,
      ...otherProps
    } = this.props;
    if (data === null || data === undefined || (hideIfEmpty && !data.length)) {
      return null;
    }
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        scrollEnabled={false}
        contentContainerStyle={wrapperStyle}
        ListHeaderComponent={this.renderHeader}
        renderItem={this.renderItem}
        {...otherProps}
      />
    );
  }
}

export default EmployeesPickList;
