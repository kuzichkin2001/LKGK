import locale from 'locale';

export const vacationRequestStatusEnum = {
  DRAFT: 1,
  EXECUTE: 2,
};

export const taskStatus = {
  1: locale.ru.task_status_draft,
  2: locale.ru.task_status_active,
  6: locale.ru.task_status_new,
  7: locale.ru.task_status_waiting,
  8: locale.ru.task_status_frozen,
  9: locale.ru.task_status_completed,
  10: locale.ru.task_status_in_queue,
};

export const taskStatusEnum = {
  TASK_STATUS_COMPLETED: 9,
};

export const taskStatusColors = {
  2: 'rgb(133,177,0)',
  6: 'rgb(65,143,215)',
  7: 'rgb(65,143,215)',
  8: 'rgb(203, 134, 0)',
  9: 'rgb(203, 57, 197)',
  10: 'rgb(134,142,150)',
};

export const requestDocumentsTypes = {
  document_type_Letter_Number: 1,
  document_type_Memorandum: 2, // Служебная записка
};

const DOC_FLOW = 'DOC_FLOW';
const DOC_HOLDING_MANAGEMENT = 'УХ';

export const tasksBase = {
  DOC_FLOW,
  DOC_HOLDING_MANAGEMENT,
};

export const HTTP_STATUS_UNPROCESSABLE_ENTITY = 422;
export const DEFAULT_OFFICE =
  'БС32/7 - г. Москва, ул. Большая Семеновская , д. 32, стр. 7';

export const DOC_TYPE_MEMORANDUM = 'Служебная записка (Общая)';

export const MESSAGE_TYPE = {
  DIRECT_MESSAGE: 'direct message',
  GROUP_CHAT: 'group char',
};

export const MOCK_USERS = [
  {
    userId: 0,
    fullName: 'Константинопольский Константин Константинович',
    isTick: false,
    icon: require('./assets/images/userProfileAvatars/avaChat.png'),
  },
  {
    userId: 1,
    fullName: 'Печорин Игорь Дмитриевич',
    isTick: false,
    icon: require('./assets/images/userProfileAvatars/avaChat2.png'),
  },
  {
    userId: 2,
    fullName: 'Цыпа Петр Семенович',
    isTick: false,
    icon: require('./assets/images/userProfileAvatars/avaChat3.png'),
  },
  {
    userId: 3,
    fullName: 'Кузичкин Павел Александрович',
    isTick: false,
    icon: require('./assets/images/userProfileAvatars/me.png'),
  },
];

export const mockChats = [
  {
    chatId: 1,
    participants: [MOCK_USERS[0], MOCK_USERS[2], MOCK_USERS[3]],
    messageType: MESSAGE_TYPE.GROUP_CHAT,
    chatName: 'Созданный чат',
    chatAvatar: require('./assets/images/userProfileAvatars/ava2.png'),
    userChatting: [
      'Константинопольский Константин Константинович',
      'Печорин Игорь Петрович',
      'Печенька Семён Игоревич',
    ],
    messages: [
      {
        fromUser: MOCK_USERS[0],
        messageId: 1,
        messageAssets: null,
        messageText: 'It is a message',
        messageArrivedTime: new Date(),
      },
      {
        fromUser: MOCK_USERS[1],
        messageId: 2,
        messageAssets: null,
        messageText: 'It is an another message',
        messageArrivedTime: new Date(),
      },
      {
        fromUser: MOCK_USERS[2],
        messageId: 3,
        messageAssets: null,
        messageText: 'It is an another one',
        messageArrivedTime: new Date(),
      },
    ],
    currentlyOnline: true,
  },
  {
    chatId: 2,
    messageType: MESSAGE_TYPE.DIRECT_MESSAGE,
    fromUser: MOCK_USERS[0],
    userAvatar: require('./assets/images/userProfileAvatars/ava.png'),
    messages: [
      {
        fromUser: MOCK_USERS[3],
        messageId: 1,
        messageAssets: null,
        messageText: 'It is a message',
        messageArrivedTime: new Date(),
      },
      {
        fromUser: MOCK_USERS[0],
        messageId: 2,
        messageAssets: null,
        messageText: 'It is an another message',
        messageArrivedTime: new Date(),
      },
      {
        fromUser: MOCK_USERS[3],
        messageId: 3,
        messageAssets: null,
        messageText: 'It is an another one',
        messageArrivedTime: new Date(),
      },
    ],
    currentlyOnline: false,
  },
  {
    chatId: 3,
    messageType: MESSAGE_TYPE.DIRECT_MESSAGE,
    fromUser: MOCK_USERS[1],
    userAvatar: require('./assets/images/userProfileAvatars/ava3.png'),
    messages: [
      {
        fromUser: MOCK_USERS[3],
        messageId: 1,
        messageAssets: null,
        messageText: 'It is a message',
        messageArrivedTime: new Date(),
      },
      {
        fromUser: MOCK_USERS[1],
        messageId: 2,
        messageAssets: null,
        messageText: 'It is an another message',
        messageArrivedTime: new Date(),
      },
      {
        fromUser: MOCK_USERS[1],
        messageId: 3,
        messageAssets: null,
        messageText: 'It is an another one',
        messageArrivedTime: new Date(),
      },
    ],
    currentlyOnline: true,
  },
  {
    chatId: 4,
    participants: [MOCK_USERS[0], MOCK_USERS[2], MOCK_USERS[3]],
    messageType: MESSAGE_TYPE.GROUP_CHAT,
    chatName: 'Созданный чат #2',
    chatAvatar: require('./assets/images/userProfileAvatars/ava2.png'),
    userChatting: [
      'Константинопольский Константин Константинович',
      'Печорин Игорь Петрович',
      'Печенька Семён Игоревич',
    ],
    messages: [
      {
        fromUser: MOCK_USERS[0],
        messageId: 1,
        messageAssets: null,
        messageText: 'It is a message',
        messageArrivedTime: new Date(),
      },
      {
        fromUser: MOCK_USERS[1],
        messageId: 2,
        messageAssets: null,
        messageText: 'It is an another message',
        messageArrivedTime: new Date(),
      },
      {
        fromUser: MOCK_USERS[2],
        messageId: 3,
        messageAssets: null,
        messageText: 'It is an another one',
        messageArrivedTime: new Date(),
      },
    ],
    currentlyOnline: true,
  },
];
