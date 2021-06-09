import firebase from 'react-native-firebase';

import navigationStore from './navigationStore';

class NotificationsStore {
  subscriptionsList = [];

  addListener = listener => {
    this.subscriptionsList.push(listener);
  };

  removeListeners = () => {
    try {
      this.subscriptionsList.forEach(subscriptionRemove => {
        subscriptionRemove();
      });
      this.subscriptionsList = [];
    } catch (e) {
      console.log(e);
    }
  };

  addNotificationsListeners = () => {
    this.addListener(
      firebase
        .notifications()
        .onNotificationDisplayed(this.onNotificationDisplayedListener),
    );
    this.addListener(
      firebase.notifications().onNotification(this.onNotificationListener),
    );
    this.addListener(
      firebase
        .notifications()
        .onNotificationOpened(this.onNotificationOpenedListener),
    );
    this.addListener(firebase.messaging().onMessage(this.onMessageListener));
  };

  requestNotificationPermission = async () => {
    let notificationsHasPermission = await firebase.messaging().hasPermission();
    if (!notificationsHasPermission) {
      try {
        await firebase.messaging().requestPermission();
        this.createNotificationsChannel();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.createNotificationsChannel();
    }
  };

  createNotificationsChannel = async () => {
    const channel = new firebase.notifications.Android.Channel(
      'osnova',
      'Основа',
      firebase.notifications.Android.Importance.High,
    ).setDescription('');
    await firebase.notifications().android.createChannel(channel);
  };

  displayNotification = async notification => {
    await firebase.notifications().displayNotification(notification);
  };

  onNotificationDisplayedListener = notification => {
    console.log('notification displayed');
    console.log(notification);
  };

  onNotificationListener = async notification => {
    console.log(notification);
    const {_title, _subtitle, _body, _notificationId, _data} = notification;
    const createdNotif = new firebase.notifications.Notification()
      .setNotificationId(_notificationId || Date.now() + '')
      .setTitle(_title || '')
      .setSubtitle(_subtitle || '')
      .setBody(_body || '')
      .setData(_data)
      .android.setPriority(firebase.notifications.Android.Priority.Default)
      .android.setChannelId('osnova')
      .android.setAutoCancel(true);
    await this.displayNotification(createdNotif);
  };

  onMessageListener = message => {
    console.log('notification message listened: ' + message);
  };

  onNotificationOpenedListener = openedNotification => {
    console.log('notification opened');
    console.log(openedNotification);
    try {
      const notificationData =
        openedNotification.notification.data ||
        openedNotification.notification._data;
      console.log('open notification screen with data');
      console.log(notificationData);
      if (notificationData) {
        const {screen, id, title} = JSON.parse(notificationData.a_data);
        if (screen) {
          navigationStore.notificationDataPush(
            screen,
            id,
            null,
            title
              ? {
                  topBar: {
                    title: {
                      text: title || '',
                    },
                  },
                }
              : {},
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  checkInitialNotification = async () => {
    try {
      const notification = await firebase
        .notifications()
        .getInitialNotification();
      console.log('initial notification');
      console.log(notification);
      if (notification) {
        this.onNotificationOpenedListener(notification);
      }
    } catch (e) {
      console.log(e);
    }
  };
}

export default new NotificationsStore();
