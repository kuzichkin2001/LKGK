import React, {PureComponent} from 'react';
import {FlatList, Text} from 'react-native';

import locale from 'locale';
import commonStyles from 'styles';

import ApprovalTaskInfoVisitorListItem from '../listsItems/approvalTaskInfoVisitor';
import InputWrapper from '../inputWrapper';

class ApprovalTaskInfoVisitorsList extends PureComponent {
  renderItem = ({item}) => {
    if (!item) {
      return null;
    } else {
      return <ApprovalTaskInfoVisitorListItem data={item} />;
    }
  };

  renderHeader = () => (
    <Text style={commonStyles.texts.common}>{locale.ru.visitors}</Text>
  );

  render() {
    const {data, ...otherProps} = this.props;
    if (!data || !data.length) {
      return null;
    }
    return (
      <InputWrapper>
        <FlatList
          scrollEnabled={false}
          ListHeaderComponent={this.renderHeader}
          renderItem={this.renderItem}
          data={data}
          {...otherProps}
        />
      </InputWrapper>
    );
  }
}

export default ApprovalTaskInfoVisitorsList;
