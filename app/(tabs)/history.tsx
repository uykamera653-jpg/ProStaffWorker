import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWorker } from '../../hooks/useWorker';
import { colors, spacing, typography } from '../../constants/theme';
import { OrderCard } from '../../components/feature/OrderCard';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { completedOrders, isDarkMode } = useWorker();

  const bg = isDarkMode ? colors.backgroundDark : colors.background;
  const surface = isDarkMode ? colors.surfaceDark : colors.surface;
  const text = isDarkMode ? colors.textDark : colors.text;
  const textSecondary = isDarkMode ? colors.textSecondaryDark : colors.textSecondary;

  const totalEarnings = completedOrders.length * 250000;

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: text }]}>Tarix</Text>
      </View>

      {completedOrders.length > 0 && (
        <View style={[styles.statsCard, { backgroundColor: surface }]}>
          <View style={styles.statItem}>
            <MaterialIcons name="done-all" size={24} color={colors.success} />
            <Text style={[styles.statValue, { color: text }]}>{completedOrders.length}</Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>Bajarilgan</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <MaterialIcons name="account-balance-wallet" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: text }]}>
              {totalEarnings.toLocaleString()} so'm
            </Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>Daromad (mock)</Text>
          </View>
        </View>
      )}

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {completedOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="history" size={80} color={textSecondary} />
            <Text style={[styles.emptyText, { color: textSecondary }]}>
              Hozircha tarix bo'sh
            </Text>
          </View>
        ) : (
          completedOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={() => router.push(`/order/${order.id}`)}
              isDarkMode={isDarkMode}
            />
          ))
        )}
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
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    ...typography.h3,
  },
  statLabel: {
    fontSize: 12,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 3,
  },
  emptyText: {
    fontSize: 16,
    marginTop: spacing.md,
  },
});
