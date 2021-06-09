import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {FlatList, View, Text, StyleSheet, Platform} from 'react-native';

import locale from 'locale';
import commonStyles from 'styles';

import CommentListItem from '../listsItems/commentListItem';
import Divider from '../divider';
import InputSideButton from '../buttons/inputSideButton';
import CommonTouchable from '../buttons/commonTouchable';

@observer
class CommentsList extends Component {
  renderItem = ({item}) => {
    const {onEmployeePress} = this.props;
    return (
      <CommentListItem
        data={item}
        onEmployeePress={() => onEmployeePress(item.user)}
        handleFileUpload={this.props.handleFileUpload}
      />
    );
  };

  renderFooter = () => {
    const {onAddCommentPress} = this.props;
    return (
      <CommonTouchable
        disabled={!onAddCommentPress}
        onPress={onAddCommentPress}
        style={styles.addCommentButton}>
        {!!onAddCommentPress && (
          <InputSideButton
            iconStyle={styles.addCommentIcon}
            source={require('images/plus.png')}
          />
        )}
        <Text style={styles.addCommentButtonTitle}>
          {locale.ru.add_comment}
        </Text>
      </CommonTouchable>
    );
  };

  keyExtractor = comment => comment.id;

  render() {
    const {data} = this.props;
    if (!data) {
      return null;
    }
    return (
      <View>
        <View style={styles.headerWrapper}>
          <Divider title={locale.ru.task_comments} />
        </View>
        <FlatList
          ListFooterComponent={this.renderFooter}
          keyExtractor={this.keyExtractor}
          data={data}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listWrapper: {
    overflow: 'hidden',
  },
  addCommentButton: {
    ...commonStyles.common.bottomBorder,
    backgroundColor: commonStyles.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 45,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  addCommentIcon: {
    height: 25,
    width: 25,
    transform: [{translateY: Platform.select({ios: -1, android: 0})}],
  },
  addCommentButtonTitle: {
    ...commonStyles.texts.infoRowTitle,
    paddingLeft: 10,
  },
});

export default CommentsList;
