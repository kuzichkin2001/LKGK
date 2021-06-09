import React, {PureComponent} from 'react';
import {TouchableHighlight} from 'react-native';

import commonStyles from 'styles';

class CommonTouchable extends PureComponent {
  render() {
    const {children, ...otherProps} = this.props;
    return (
      <TouchableHighlight
        underlayColor={commonStyles.colors.touchHighlight}
        {...otherProps}>
        <>{children}</>
      </TouchableHighlight>
    );
  }
}

export default CommonTouchable;
