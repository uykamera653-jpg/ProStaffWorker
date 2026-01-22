import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants/theme';

interface RatingCardProps {
  rating: number;
  totalJobs: number;
  isDarkMode: boolean;
  language: 'uz' | 'ru';
}

export function RatingCard({ rating, totalJobs, isDarkMode, language }: RatingCardProps) {
  const surface = isDarkMode ? colors.surfaceDark : colors.surface;
  const text = isDarkMode ? colors.textDark : colors.text;
  const textSecondary = isDarkMode ? colors.textSecondaryDark : colors.textSecondary;

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialIcons
          key={i}
          name={i <= rating ? 'star' : 'star-border'}
          size={24}
          color={i <= rating ? colors.warning : textSecondary}
        />
      );
    }
    return stars;
  };

  return (
    <View style={[styles.container, { backgroundColor: surface }]}>
      <View style={styles.header}>
        <MaterialIcons name="verified-user" size={32} color={colors.primary} />
        <Text style={[styles.title, { color: text }]}>
          {language === 'uz' ? 'Ishchi reytingi' : 'Рейтинг работника'}
        </Text>
      </View>
      
      <View style={styles.ratingRow}>
        <View style={styles.stars}>{renderStars()}</View>
        <Text style={[styles.ratingText, { color: text }]}>
          {rating.toFixed(1)}/5.0
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <MaterialIcons name="done-all" size={20} color={colors.success} />
          <Text style={[styles.statValue, { color: text }]}>{totalJobs}</Text>
          <Text style={[styles.statLabel, { color: textSecondary }]}>
            {language === 'uz' ? 'Bajarilgan' : 'Завершено'}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <MaterialIcons name="thumb-up" size={20} color={colors.primary} />
          <Text style={[styles.statValue, { color: text }]}>
            {totalJobs > 0 ? Math.round((rating / 5) * 100) : 0}%
          </Text>
          <Text style={[styles.statLabel, { color: textSecondary }]}>
            {language === 'uz' ? 'Ijobiy' : 'Положительные'}
          </Text>
        </View>
      </View>

      <Text style={[styles.note, { color: textSecondary }]}>
        {language === 'uz' 
          ? '* Mock ma\'lumotlar - haqiqiy reyting backend ulanganida ko\'rinadi'
          : '* Тестовые данные - реальный рейтинг будет после подключения backend'
        }
      </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
  },
  ratingText: {
    fontSize: 24,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  note: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
