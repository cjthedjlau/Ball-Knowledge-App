import { Platform } from 'react-native'
import { supabase } from './supabase'

let Notifications: any = null
let Device: any = null
try {
  Notifications = require('expo-notifications')
  Device = require('expo-device')
  // Configure notification behavior — must be after successful import
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  })
} catch {
  // Notifications module not available
}

// Request permission and get push token
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Notifications || !Device) return null
  if (!Device.isDevice) return null

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') return null

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    })
  }

  let Constants: any = null;
  try { Constants = require('expo-constants'); } catch {}
  const projectId = Constants?.expoConfig?.extra?.eas?.projectId;
  const token = (await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined)).data
  return token
}

// Save push token to Supabase
export async function savePushToken(token: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('profiles').update({ push_token: token }).eq('id', user.id)
}

// Schedule daily reminder notification
export async function scheduleDailyReminder(hourOfDay: number) {
  if (!Notifications) return
  // Cancel existing daily reminder
  await Notifications.cancelAllScheduledNotificationsAsync()

  // Check if daily reminder is enabled in preferences
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default
    const prefs = await AsyncStorage.getItem('bk_notif_prefs')
    if (prefs) {
      const parsed = JSON.parse(prefs)
      if (parsed.daily === false) return // User disabled daily reminders
    }
  } catch {}

  // Schedule for the same hour tomorrow
  const trigger = {
    hour: hourOfDay,
    minute: 0,
    repeats: true,
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🏀 Ball Knowledge',
      body: 'Your daily games are waiting. Keep the streak alive!',
      sound: true,
    },
    trigger,
  })
}

// Update user's typical play hour and reschedule reminder
export async function updatePlayHour() {
  const currentHour = new Date().getHours()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Update last_play_hour in Supabase
  await supabase.from('profiles').update({ last_play_hour: currentHour }).eq('id', user.id)

  // Reschedule daily reminder for this hour
  await scheduleDailyReminder(currentHour)
}

// Cancel all notifications (on logout)
export async function cancelAllNotifications() {
  if (!Notifications) return
  await Notifications.cancelAllScheduledNotificationsAsync()
}
