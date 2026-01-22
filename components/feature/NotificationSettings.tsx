import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, Platform, Linking, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { notificationService } from '../../services/notificationService';
import { colors, spacing, typography } from '../../constants/theme';

interface NotificationSettingsProps {
  isDarkMode: boolean;
  language: 'uz' | 'ru';
}

export function NotificationSettings({ isDarkMode, language }: NotificationSettingsProps) {
  const [enabled, setEnabled] = useState(false);
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const surface = isDarkMode ? colors.surfaceDark : colors.surface;
  const text = isDarkMode ? colors.textDark : colors.text;
  const textSecondary = isDarkMode ? colors.textSecondaryDark : colors.textSecondary;

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const hasPermission = await notificationService.requestPermissions();
    setEnabled(hasPermission);
  };

  const handleToggleEnabled = async (value: boolean) => {
    if (value) {
      // Web platformada permission statusini tekshirish
      if (Platform.OS === 'web' && typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'denied') {
          // Agar permission bloklangan bo'lsa - darhol modal ko'rsatish
          setShowPermissionModal(true);
          return;
        }
      }

      const granted = await notificationService.requestPermissions();
      setEnabled(granted);
      if (!granted) {
        // Web platformada custom modal, mobile'da Alert
        if (Platform.OS === 'web') {
          setShowPermissionModal(true);
        } else {
          const title = language === 'uz' ? 'Ruxsat berilmadi' : 'Разрешение не предоставлено';
          const message =
            language === 'uz'
              ? 'Bildirishnomalar uchun ruxsat berilmadi. Sozlamalarga o\'tib ruxsat bering.'
              : 'Разрешение на уведомления не предоставлено. Перейдите в настройки и предоставьте разрешение.';
          const settingsText = language === 'uz' ? 'Sozlamalar' : 'Настройки';
          const cancelText = language === 'uz' ? 'Bekor qilish' : 'Отмена';

          Alert.alert(title, message, [
            { text: cancelText, style: 'cancel' },
            {
              text: settingsText,
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]);
        }
      }
    } else {
      setEnabled(false);
    }
  };

  const handleOpenSettings = () => {
    setShowPermissionModal(false);
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else if (Platform.OS === 'android') {
      Linking.openSettings();
    }
  };

  const handleTestNotification = async () => {
    await notificationService.scheduleOrderNotification(
      language === 'uz' ? 'Test buyurtma' : 'Тестовый заказ',
      language === 'uz' ? 'Toshkent shahar' : 'г. Ташкент'
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: surface }]}>
      <Text style={[styles.title, { color: text }]}>
        {language === 'uz' ? 'Bildirishnomalar' : 'Уведомления'}
      </Text>

      <View style={styles.setting}>
        <View style={styles.settingLeft}>
          <MaterialIcons name="notifications" size={24} color={enabled ? colors.primary : textSecondary} />
          <Text style={[styles.settingText, { color: text }]}>
            {language === 'uz' ? 'Push bildirishnomalar' : 'Push-уведомления'}
          </Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={handleToggleEnabled}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor="#fff"
        />
      </View>

      {enabled && (
        <>
          <View style={styles.setting}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="volume-up" size={24} color={sound ? colors.primary : textSecondary} />
              <Text style={[styles.settingText, { color: text }]}>
                {language === 'uz' ? 'Ovoz' : 'Звук'}
              </Text>
            </View>
            <Switch
              value={sound}
              onValueChange={setSound}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.setting}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="vibration" size={24} color={vibration ? colors.primary : textSecondary} />
              <Text style={[styles.settingText, { color: text }]}>
                {language === 'uz' ? 'Tebranish' : 'Вибрация'}
              </Text>
            </View>
            <Switch
              value={vibration}
              onValueChange={setVibration}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity
            style={[styles.testButton, { backgroundColor: colors.info }]}
            onPress={handleTestNotification}
          >
            <MaterialIcons name="send" size={20} color="#fff" />
            <Text style={styles.testButtonText}>
              {language === 'uz' ? 'Test bildirishnoma' : 'Тестовое уведомление'}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* Web platform uchun permission modal */}
      {Platform.OS === 'web' && (
        <Modal
          visible={showPermissionModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPermissionModal(false)}
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={() => setShowPermissionModal(false)}
          >
            <Pressable style={[styles.modalContent, { backgroundColor: surface }]}>
              <MaterialIcons name="notifications-off" size={48} color={colors.warning} />
              <Text style={[styles.modalTitle, { color: text }]}>
                {language === 'uz' ? 'Ruxsat berilmadi' : 'Разрешение не предоставлено'}
              </Text>
              <Text style={[styles.modalMessage, { color: textSecondary }]}>
                {language === 'uz'
                  ? 'Bildirishnomalar bloklangan. Brauzer URL panelida qulf belgisini bosing va bildirishnomalarni yoqing.'
                  : 'Уведомления заблокированы. Нажмите значок замка в адресной строке браузера и включите уведомления.'}
              </Text>
              <Text style={[styles.modalInstructions, { color: textSecondary }]}>
                {language === 'uz'
                  ? '🔒 Manzil satri → Sozlamalar → Bildirishnomalar → Ruxsat berish'
                  : '🔒 Адресная строка → Настройки → Уведомления → Разрешить'}
              </Text>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={() => setShowPermissionModal(false)}
              >
                <Text style={styles.modalButtonText}>
                  {language === 'uz' ? 'Tushunarli' : 'Понятно'}
                </Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  settingText: {
    fontSize: 16,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalTitle: {
    ...typography.h3,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalInstructions: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontWeight: '500',
  },
  modalButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    minWidth: 120,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
