import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('atlas-ai', {
      name: 'Atlas AI',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#38BDF8',
    });
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  await AsyncStorage.setItem('atlas_push_token', token);
  return token;
}

export async function schedulePostReadyNotification(pillar) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Atlas AI — Post Ready 📸',
      body: `Your ${pillar} content is ready to build. Tap to open the Post Editor.`,
      data: { screen: 'PostEditor' },
      sound: true,
    },
    trigger: { seconds: 2 },
  });
}

export async function scheduleAISuggestionNotification(pillar, photoCount) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${photoCount} new ${pillar} photos detected`,
      body: 'Atlas AI found content worth posting. Tap to curate your next post.',
      data: { screen: 'Library' },
      sound: true,
    },
    trigger: { seconds: 1 },
  });
}

export async function scheduleDailySuggestion() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Atlas AI — Daily Check In',
      body: 'Have you posted today? Your audience is waiting.',
      data: { screen: 'Home' },
      sound: true,
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });
}
