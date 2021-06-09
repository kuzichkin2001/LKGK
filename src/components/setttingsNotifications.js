import React from 'react';

import FormSpaceBetween from './formSpaceBetween';
import TitledRowSwitch from './titledRowSwitch';
import MultipleSubmitButtons from './multipleSubmitButtons';

import locale from '../locale';

const SettingsNotifications = ({
  settings,
  onChange,
  onSave,
  onCancel,
  isSubmitting,
}) => {
  const buttons = [
    {
      caption: locale.ru.save,
      onPress: onSave,
      isSubmitting: isSubmitting,
      action: 1,
    },
    {
      caption: locale.ru.cancel,
      onPress: onCancel,
      isSubmitting: isSubmitting,
    },
  ];

  if (!settings) {
    return null;
  }

  const {
    new_approval_task,
    delegation_rights,
    tableau,
    new_news,
    portal_push,
  } = settings;
  return (
    <FormSpaceBetween
      Top={
        <>
          <TitledRowSwitch
            onValueChange={value => onChange('new_approval_task', value)}
            value={new_approval_task}
            title={locale.ru.settings_notifications_approval_task}
          />
          <TitledRowSwitch
            onValueChange={value => onChange('delegation_rights', value)}
            value={delegation_rights}
            title={locale.ru.settings_notifications_delegation_rights}
          />
          <TitledRowSwitch
            onValueChange={value => onChange('tableau', value)}
            value={tableau}
            title={locale.ru.settings_notifications_tableau}
          />
          <TitledRowSwitch
            onValueChange={value => onChange('new_news', value)}
            value={new_news}
            title={locale.ru.settings_notifications_new_news}
          />
          <TitledRowSwitch
            onValueChange={value => onChange('portal_push', value)}
            value={portal_push}
            title={locale.ru.settings_notifications_portal_push}
          />
        </>
      }
      Bottom={<MultipleSubmitButtons buttons={buttons} />}
    />
  );
};

export default SettingsNotifications;
