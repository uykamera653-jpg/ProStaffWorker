import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
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
      const granted = await notificationService.requestPermissions();
      setEnabled(granted);
    } else {
      setEnabled(false);
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
});
