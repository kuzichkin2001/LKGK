import React, {PureComponent} from 'react';

import EmployeePickListItem from '../listsItems/employeePickListItem';
import ListAddHeader from '../listAddHeader';
import Divider from '../divider';

class EmployeePickButton extends PureComponent {
  render() {
    const {
      onPress,
      title,
      error,
      employeeData,
      onAddPress,
      removeBottomOffset,
      onRemovePress,
      dividerTitle,
      icon,
      showIconAndTitle = true,
      children,
    } = this.props;
    return (
      <>
        {onAddPress ? (
          <ListAddHeader
            dividerTitle={dividerTitle}
            error={error}
            title={title}
            onAddPress={onAddPress}
            removeBottomOffset={removeBottomOffset}
            icon={icon}
            showIconAndTitle={showIconAndTitle}
          />
        ) : (
          <Divider title={title} />
        )}
        <EmployeePickListItem
          onRemove={onRemovePress}
          removeBottomOffset={!onAddPress}
          onPress={onPress}
          employeeData={employeeData}>
          {children}
        </EmployeePickListItem>
      </>
    );
  }
}

export default EmployeePickButton;
