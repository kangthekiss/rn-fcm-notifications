import React, {Component} from 'react';
import {View, Text} from 'react-native';
import firebase, {Notification, NotificationOpen} from 'react-native-firebase';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    this.initNotification();

    // #-----Listen for Notifications
    // IOS Only
    this.removeNotificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed(notification => {
        console.log('1: ', notification);
      });

    // Android
    this.removeNotificationListener = firebase
      .notifications()
      .onNotification(notification => {
        console.log('2: ', notification);
      });
    // -----#

    // #----- Listen for a Notification being opened
    //App in Foreground and background
    this.removeNotificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification = notificationOpen.notification;

        console.log('action: ', action);
        console.log('notification: ', notification);
      });

    // App Closed
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      // App was opened by a notification
      // Get the action triggered by the notification being opened
      const action = notificationOpen.action;
      // Get information about the notification that was opened
      const notification = notificationOpen.notification;

      console.log('app closed');
      console.log('action: ', action);
      console.log('notification: ', notification);
    }
  }

  componentWillUnmount() {
    this.removeNotificationDisplayedListener();
    this.removeNotificationListener();
    this.removeNotificationOpenedListener();
  }

  initNotification = async () => {
    await this.setPermission();
    const fcmToken = await firebase.messaging().getToken();
    console.log('fcmToken', fcmToken);
  };

  setPermission = async () => {
    try {
      const enabled = await firebase.messaging().hasPermission();
      if (!enabled) {
        await firebase.messaging().requestPermission();
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  render() {
    return (
      <View>
        <Text> App </Text>
      </View>
    );
  }
}
