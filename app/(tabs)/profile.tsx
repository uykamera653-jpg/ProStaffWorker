import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useWorker } from '../../hooks/useWorker';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing, typography } from '../../constants/theme';
import { config } from '../../constants/config';
import { RatingCard, PriceRangePicker, NotificationSettings } from '../../components';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signOut } = useAuth();
  const { 
    isDarkMode, 
    setIsDarkMode, 
    language, 
    setLanguage, 
    minPrice, 
    maxPrice,
    setMinPrice,
    setMaxPrice,
    rating,
    completedOrders,
  } = useWorker();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  const bg = isDarkMode ? colors.backgroundDark : colors.background;
  const surface = isDarkMode ? colors.surfaceDark : colors.surface;
  const text = isDarkMode ? colors.textDark : colors.text;
  const textSecondary = isDarkMode ? colors.textSecondaryDark : colors.textSecondary;

  const handleCallCenter = () => {
    Linking.openURL(`tel:${config.callCenter}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: text }]}>
          {language === 'uz' ? 'Profil' : 'Профиль'}
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <RatingCard 
          rating={rating}
          totalJobs={completedOrders.length}
          isDarkMode={isDarkMode}
          language={language}
        />

        <NotificationSettings isDarkMode={isDarkMode} language={language} />

        <PriceRangePicker
          minPrice={minPrice}
          maxPrice={maxPrice}
          onSave={(min, max) => {
            setMinPrice(min);
            setMaxPrice(max);
          }}
          isDarkMode={isDarkMode}
          language={language}
        />

        <View style={[styles.section, { backgroundColor: surface }]}>
          <Text style={[styles.sectionTitle, { color: text }]}>
            {language === 'uz' ? 'Sozlamalar' : 'Настройки'}
          </Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setIsDarkMode(!isDarkMode)}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons
                name={isDarkMode ? 'dark-mode' : 'light-mode'}
                size={24}
                color={text}
              />
              <Text style={[styles.settingText, { color: text }]}>
                {isDarkMode 
                  ? (language === 'uz' ? 'Tungi rejim' : 'Темный режим')
                  : (language === 'uz' ? 'Kunduzgi rejim' : 'Светлый режим')
                }
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setLanguage(language === 'uz' ? 'ru' : 'uz')}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons name="language" size={24} color={text} />
              <Text style={[styles.settingText, { color: text }]}>
                {language === 'uz' ? 'Til' : 'Язык'}: {language === 'uz' ? 'O\'zbekcha' : 'Русский'}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleCallCenter}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="phone" size={24} color={colors.success} />
              <Text style={[styles.settingText, { color: text }]}>Call Center</Text>
            </View>
            <Text style={[styles.phoneNumber, { color: colors.success }]}>
              {config.callCenter}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleSignOut}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="logout" size={24} color={colors.error} />
              <Text style={[styles.settingText, { color: colors.error }]}>
                {language === 'uz' ? 'Chiqish' : 'Выйти'}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: surface }]}>
          <Text style={[styles.sectionTitle, { color: text }]}>
            {language === 'uz' ? "Ma'lumot" : 'Информация'}
          </Text>
          <View style={styles.infoItem}>
            <MaterialIcons name="info-outline" size={20} color={textSecondary} />
            <Text style={[styles.infoText, { color: textSecondary }]}>
              {language === 'uz' 
                ? "Versiya: 1.0.0 (Mock ma'lumotlar)"
                : 'Версия: 1.0.0 (Тестовые данные)'
              }
            </Text>
          </View>
          <Text style={[styles.mockNote, { color: colors.warning }]}>
            {language === 'uz'
              ? "⚠️ Hozirda mock (test) ma'lumotlar ishlatilmoqda. Haqiqiy backend ulanganida real push bildirishnomalar va buyurtmalar keladi."
              : '⚠️ Сейчас используются тестовые данные. После подключения реального backend будут работать настоящие push-уведомления и заказы.'
            }
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.md,
  },
  title: {
    ...typography.h2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    gap: spacing.md,
  },
  section: {
    borderRadius: 12,
    padding: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingText: {
    fontSize: 16,
  },
  phoneNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoText: {
    fontSize: 14,
  },
  mockNote: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderRadius: 8,
  },
});
