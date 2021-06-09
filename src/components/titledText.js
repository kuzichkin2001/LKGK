import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

import commonStyles from 'styles';

import InputWrapper from './inputWrapper';
import TitledWrapper from './titledWrapper';

const TitledText = ({
  title,
  value,
  error,
  onPress,
  valueStyle,
  removeBottomOffset,
}) => {
  if (!value) {
    return null;
  }
  return (
    <InputWrapper removeBottomOffset={removeBottomOffset}>
      <TouchableOpacity disabled={!onPress} onPress={onPress}>
        <TitledWrapper title={title} error={error}>
          <Text
            style={[
              commonStyles.texts.common,
              commonStyles.common.infoRowOffset,
              valueStyle,
            ]}>
            {value}
          </Text>
        </TitledWrapper>
      </TouchableOpacity>
    </InputWrapper>
  );
};

export default TitledText;
