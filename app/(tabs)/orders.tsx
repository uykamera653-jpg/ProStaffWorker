import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWorker } from '../../hooks/useWorker';
import { colors, spacing, typography } from '../../constants/theme';
import { OrderCard } from '../../components/feature/OrderCard';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { myOrders, isDarkMode, completeOrder } = useWorker();

  const bg = isDarkMode ? colors.backgroundDark : colors.background;
  const text = isDarkMode ? colors.textDark : colors.text;
  const textSecondary = isDarkMode ? colors.textSecondaryDark : colors.textSecondary;

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: text }]}>Mening buyurtmalarim</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {myOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="inbox" size={80} color={textSecondary} />
            <Text style={[styles.emptyText, { color: textSecondary }]}>
              Hozircha buyurtmalar yo'q
            </Text>
          </View>
        ) : (
          myOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={() => router.push(`/order/${order.id}`)}
              isDarkMode={isDarkMode}
              onComplete={() => completeOrder(order.id)}
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
