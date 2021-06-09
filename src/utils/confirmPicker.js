import {Alert} from 'react-native';

import locale from 'locale';

const confirmPick = ({title, subtitle, onCancel, onConfirm}) => {
  try {
    Alert.alert(
      title || locale.ru.chose_variant,
      subtitle,
      [
        {
          text: locale.ru.cancel,
          onPress: onCancel,
        },
        {
          text: 'OK',
          onPress: onConfirm,
        },
      ],
      {cancelable: true},
    );
  } catch (e) {
    console.log(e);
  }
};

export default confirmPick;
