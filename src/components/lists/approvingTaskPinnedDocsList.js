import React, {PureComponent} from 'react';
import {FlatList} from 'react-native';

import ApprovingTaskPinnedDoc from '../listsItems/approvingTaskPinnedDoc';

class ApprovingTaskPinnedDocsList extends PureComponent {
  static prefixes = {
    approvalTask: '421412222-',
    tasks: 'sk3d33d3-',
    inquiry: 'f77d50d7-',
    requests: '489065ad-',
  };

  renderDocItem = ({item}) => {
    const {
      downloadRoute,
      filePrefix,
      downloadFileTitle,
      openFileTitle,
    } = this.props;
    return (
      <ApprovingTaskPinnedDoc
        downloadFileTitle={downloadFileTitle}
        openFileTitle={openFileTitle}
        downloadRoute={downloadRoute}
        filePrefix={filePrefix}
        fileData={item}
      />
    );
  };

  keyExtractor = doc => doc.file_id || doc.id + '';

  render() {
    const {data, ...otherProps} = this.props;
    return (
      data &&
      data.length && (
        <FlatList
          scrollEnabled={false}
          renderItem={this.renderDocItem}
          keyExtractor={this.keyExtractor}
          data={data}
          {...otherProps}
        />
      )
    );
  }
}

export default ApprovingTaskPinnedDocsList;
