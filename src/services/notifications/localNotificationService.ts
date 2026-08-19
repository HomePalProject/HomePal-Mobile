import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { Platform } from 'react-native';

// Configure foreground notifications handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX, // MAX is required to show the popup banner
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });
}

/**
 * Requests local notification permissions.
 * Returns true if permissions are granted (or were already granted).
 */
export async function requestPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

/**
 * Retrieves all currently scheduled notification requests on the device.
 */
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.warn('[LocalNotificationService] Error getting scheduled notifications:', error);
    return [];
  }
}

/**
 * Schedules a local push notification.
 * @param id Unique identifier to associate with the notification (e.g. pantry item ID)
 * @param title Alert title
 * @param body Alert content body
 * @param triggerDate Target Date object when the notification should fire
 * @returns The unique identifier of the scheduled notification
 */
export async function scheduleLocalNotification(
  id: string,
  title: string,
  body: string,
  triggerDate: Date
): Promise<string> {
  try {
    return await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title,
        body,
        sound: true,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });
  } catch (error) {
    console.error('[LocalNotificationService] Error scheduling notification:', error);
    throw error;
  }
}

/**
 * Cancels a specific scheduled notification by ID.
 * @param id The unique notification request identifier
 */
export async function cancelNotification(id: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (error) {
    console.warn(`[LocalNotificationService] Error canceling notification with id ${id}:`, error);
  }
}

/**
 * Cancels all scheduled local notifications.
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.warn('[LocalNotificationService] Error canceling all notifications:', error);
  }
}
