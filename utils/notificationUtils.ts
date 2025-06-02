import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { Alert } from "react-native";

// Cấu hình xử lý khi nhận thông báo (tuỳ chọn)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Function to check and request notification permissions if not already granted
export async function checkAndRequestPermission() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== "granted") {
      Alert.alert(
        "Notification",
        "You need to allow notifications to receive daily reminders."
      );
      return false;
    }
  }
  return true;
}

// Function to remove scheduled notification by identifier
export async function cancelScheduledNotification(identifier: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch (error) {
    console.log("error when cancel scheduled notification: ", error);
  }
}

// Function to remove all scheduled notification by identifier
export async function cancelAllScheduledNotification() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.log("error when cancel scheduled notification: ", error);
  }
}

// Function to schedule a daily reminder
export async function scheduleDailyReminder(
  hour: number,
  minute: number,
  title: string,
  body: string
) {
  const hasPermission = await checkAndRequestPermission();
  if (!hasPermission) return null;

  // Schedule a new daily notification
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      sound: true,
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DAILY,
      hour: hour,
      minute: minute,
    },
  });

  return id;
}

export async function storeNotificationId(name: string, id: string) {
  try {
    await AsyncStorage.setItem(name, id);
  } catch (e) {
    console.log("Lỗi khi lưu dữ liệu:", e);
  }
}

export async function getNotificationId(name: string) {
  try {
    const value = await AsyncStorage.getItem(name);
    if (value === null) {
      console.log("Không tìm thấy dữ liệu với key: ", name);
    }
    return value;
  } catch (e) {
    console.log("Lỗi khi lấy dữ liệu:", e);
    return null;
  }
}

export async function removeNotificationId(name: string) {
  try {
    await AsyncStorage.removeItem(name);
  } catch (e) {
    console.log("Lỗi khi xóa dữ liệu:", e);
  }
}
