import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWorker } from '../../hooks/useWorker';
import { colors, spacing, typography } from '../../constants/theme';
import { config } from '../../constants/config';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode, setIsDarkMode, language, setLanguage, minPrice, maxPrice } = useWorker();

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
        <Text style={[styles.title, { color: text }]}>Profil</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={[styles.section, { backgroundColor: surface }]}>
          <Text style={[styles.sectionTitle, { color: text }]}>Sozlamalar</Text>

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
                {isDarkMode ? 'Tungi rejim' : 'Kunduzgi rejim'}
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
                Til: {language === 'uz' ? 'O\'zbekcha' : 'Русский'}
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
        </View>

        <View style={[styles.section, { backgroundColor: surface }]}>
          <Text style={[styles.sectionTitle, { color: text }]}>Narx diapazoni</Text>
          <View style={styles.priceInfo}>
            <Text style={[styles.priceText, { color: text }]}>
              Minimal: {minPrice.toLocaleString()} so'm
            </Text>
            <Text style={[styles.priceText, { color: text }]}>
              Maksimal: {maxPrice.toLocaleString()} so'm
            </Text>
          </View>
          <Text style={[styles.priceNote, { color: textSecondary }]}>
            * Narxni kelgusida o'zgartirish imkoniyati qo'shiladi
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: surface }]}>
          <Text style={[styles.sectionTitle, { color: text }]}>Ma'lumot</Text>
          <View style={styles.infoItem}>
            <MaterialIcons name="info-outline" size={20} color={textSecondary} />
            <Text style={[styles.infoText, { color: textSecondary }]}>
              Versiya: 1.0.0 (Mock ma'lumotlar)
            </Text>
          </View>
          <Text style={[styles.mockNote, { color: colors.warning }]}>
            ⚠️ Hozirda mock (test) ma'lumotlar ishlatilmoqda. Haqiqiy backend ulanganida
            real push bildirishnomalar va buyurtmalar keladi.
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
  priceInfo: {
    gap: spacing.sm,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '500',
  },
  priceNote: {
    fontSize: 12,
    marginTop: spacing.sm,
    fontStyle: 'italic',
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
