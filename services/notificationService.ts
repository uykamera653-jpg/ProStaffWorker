import * as Notifications from 'expo-notifications';
import { Platform, Vibration } from 'react-native';

// CRITICAL: Notification handler - AVVAL sozlanishi KERAK
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

// Android uchun notification channel yaratish (ovozli + tebranish)
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('order-alerts', {
    name: 'Buyurtma bildirish',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 500, 200, 500],
    sound: 'default',
    enableVibrate: true,
    enableLights: true,
    lightColor: '#2196F3',
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    bypassDnd: true,
    showBadge: true,
  }).catch(error => {
    console.log('Channel creation error:', error);
  });
}

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    // Web platformada native browser API ishlatish
    if (Platform.OS === 'web') {
      if (!('Notification' in window)) {
        console.log('Browser does not support notifications');
        return false;
      }

      // Hozirgi permission holatini tekshirish
      if (Notification.permission === 'granted') {
        return true;
      }

      if (Notification.permission === 'denied') {
        console.log('Notification permission denied');
        return false;
      }

      // Permission so'rash (browser native dialog)
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
      }
    }

    // Mobile platforms (iOS/Android)
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  },

  async scheduleOrderNotification(orderTitle: string, orderLocation: string) {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      console.log('No notification permission');
      return;
    }

    // TEBRANISH - darhol ishga tushirish
    Vibration.vibrate([0, 500, 200, 500, 200, 500]);

    // Notification yuborish
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔔 Yangi buyurtma!',
          body: `${orderTitle}\n📍 ${orderLocation}`,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.MAX,
          badge: 1,
          data: { type: 'order', action: 'new' },
          ...(Platform.OS === 'android' && {
            vibrationPattern: [0, 500, 200, 500],
            channelId: 'order-alerts',
          }),
        },
        trigger: null,
      });
      
      console.log('✅ Notification sent successfully');
    } catch (error) {
      console.error('❌ Notification error:', error);
    }
  },

  async scheduleApprovalNotification(orderTitle: string) {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      console.log('No notification permission');
      return;
    }

    // TEBRANISH - darhol ishga tushirish
    Vibration.vibrate([0, 500, 200, 500, 200, 500]);

    // Notification yuborish
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '✅ Buyurtma tasdiqlandi!',
          body: `${orderTitle} - Buyurtmachi sizni tanladi`,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.MAX,
          badge: 1,
          data: { type: 'order', action: 'approved' },
          ...(Platform.OS === 'android' && {
            vibrationPattern: [0, 500, 200, 500],
            channelId: 'order-alerts',
          }),
        },
        trigger: null,
      });
      
      console.log('✅ Approval notification sent');
    } catch (error) {
      console.error('❌ Notification error:', error);
    }
  },

  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};
