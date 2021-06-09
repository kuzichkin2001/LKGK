import React, {PureComponent} from 'react';
import {View, Text} from 'react-native';
import CommonFlatList from '../commonFlatList';
import CommonTouchable from '../../buttons/commonTouchable';

import locale from '../../../locale';
import formatDate from '../../../utils/formatDate';
import commonStyles from '../../../styles';
import IconText from '../../iconText';

class InquiriesList extends PureComponent {

  renderItem = ({item}) => {
    if (!item) {
      console.log('item is empty');
      return null;
    }
    const {onPress} = this.props;
    const {
      theme,
      planned_date,
      status: {text: status_text, color: status_color},
    } = item;
    console.log({...item});
    console.log(status_text, status_color);
    return (
      <CommonTouchable
        style={[
          commonStyles.common.listItem,
          commonStyles.common.mediumBottomOffset,
        ]}
        onPress={() => onPress(item)}>
        <Text style={commonStyles.texts.infoRowTitle}>{theme}</Text>
        <View
          style={[
            commonStyles.common.rowCenterSpace,
            commonStyles.common.infoRowOffset,
          ]}>
          <View style={commonStyles.common.rowCenter}>
            {!!planned_date && (
              <IconText
                wrapperStyle={commonStyles.common.titledTextRightOffset}
                color={commonStyles.colors.gray}
                icon={require('images/clock.png')}
                value={formatDate(planned_date, 'DD.MM.YY') || ''}
              />
            )}
            <IconText
              color={status_color || commonStyles.colors.gray}
              icon={require('images/complete.png')}
              value={status_text}
            />
          </View>
        </View>
      </CommonTouchable>
    );
  };

  render() {
    const {onCreatePress, activity, ...otherProps} = this.props;
    return (
      <CommonFlatList
        emptyListTitle={locale.ru.empty_list_inquiries}
        renderItem={this.renderItem}
        {...otherProps}
      />
    );
  }
}

export default InquiriesList;
