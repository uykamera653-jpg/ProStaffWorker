import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';

// Android uchun notification channel yaratish (ovozli)
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('order-alerts', {
    name: 'Buyurtma bildirish',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    sound: 'default',
    enableVibrate: true,
    enableLights: true,
    lightColor: '#2196F3',
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    bypassDnd: true,
  });
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
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
    if (!hasPermission) return;

    // Ovozni chiqarish
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/notification.mp3'),
        { shouldPlay: true, volume: 1.0 }
      );
      setTimeout(() => sound.unloadAsync(), 3000);
    } catch (error) {
      console.log('Custom sound failed, using default');
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔔 Yangi buyurtma!',
        body: `${orderTitle}\n📍 ${orderLocation}`,
        sound: Platform.OS === 'android' ? 'default' : true,
        priority: Notifications.AndroidNotificationPriority.MAX,
        vibrate: [0, 250, 250, 250],
        badge: 1,
      },
      trigger: null,
      ...(Platform.OS === 'android' && { 
        identifier: 'order-notification',
        channelId: 'order-alerts' 
      }),
    });
  },

  async scheduleApprovalNotification(orderTitle: string) {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    // Ovozni chiqarish
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/notification.mp3'),
        { shouldPlay: true, volume: 1.0 }
      );
      setTimeout(() => sound.unloadAsync(), 3000);
    } catch (error) {
      console.log('Custom sound failed, using default');
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ Buyurtma tasdiqlandi!',
        body: `${orderTitle} - Buyurtmachi sizni tanladi`,
        sound: Platform.OS === 'android' ? 'default' : true,
        priority: Notifications.AndroidNotificationPriority.MAX,
        vibrate: [0, 250, 250, 250],
        badge: 1,
      },
      trigger: null,
      ...(Platform.OS === 'android' && { 
        identifier: 'approval-notification',
        channelId: 'order-alerts' 
      }),
    });
  },

  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};
