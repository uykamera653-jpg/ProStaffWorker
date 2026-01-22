import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWorker } from '../../hooks/useWorker';
import { colors, spacing, typography } from '../../constants/theme';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CategorySelector } from '../../components/feature/CategorySelector';
import { OrderCard } from '../../components/feature/OrderCard';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    isOnline,
    setIsOnline,
    selectedCategories,
    setSelectedCategories,
    pendingOrders,
    isDarkMode,
    myOrders,
    acceptOrder,
    rejectOrder,
  } = useWorker();

  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const bg = isDarkMode ? colors.backgroundDark : colors.background;
  const surface = isDarkMode ? colors.surfaceDark : colors.surface;
  const text = isDarkMode ? colors.textDark : colors.text;
  const textSecondary = isDarkMode ? colors.textSecondaryDark : colors.textSecondary;

  const handleAcceptOrders = () => {
    if (myOrders.filter(o => o.status === 'accepted' || o.status === 'approved').length > 0) {
      return;
    }
    setShowCategoryModal(true);
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategories(
      selectedCategories.includes(categoryId)
        ? selectedCategories.filter(id => id !== categoryId)
        : [...selectedCategories, categoryId]
    );
  };

  const handleStart = () => {
    setIsOnline(true);
    setShowCategoryModal(false);
  };

  const handleToggleOnline = () => {
    if (isOnline) {
      setIsOnline(false);
    } else {
      handleAcceptOrders();
    }
  };

  const activeOrder = myOrders.find(o => o.status === 'accepted' || o.status === 'approved');

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      <View style={[styles.header, { backgroundColor: surface }]}>
        <View>
          <Text style={[styles.greeting, { color: text }]}>ProStaff Worker</Text>
          <Text style={[styles.subGreeting, { color: textSecondary }]}>
            Buyurtmalarni qabul qiling
          </Text>
        </View>
        <StatusBadge isOnline={isOnline} isDarkMode={isDarkMode} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {!activeOrder && (
          <View style={styles.centerSection}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="work-outline" size={80} color={colors.primary} />
            </View>

            <TouchableOpacity
              style={[
                styles.mainButton,
                {
                  backgroundColor: isOnline ? colors.offline : colors.primary,
                },
              ]}
              onPress={handleToggleOnline}
            >
              <MaterialIcons name={isOnline ? 'pause' : 'play-arrow'} size={28} color="#fff" />
              <Text style={styles.mainButtonText}>
                {isOnline ? 'To\'xtatish' : 'Buyurtmalarni qabul qilish'}
              </Text>
            </TouchableOpacity>

            {isOnline && selectedCategories.length > 0 && (
              <View style={[styles.activeCategories, { backgroundColor: surface }]}>
                <Text style={[styles.activeCategoriesTitle, { color: text }]}>
                  Faol kategoriyalar:
                </Text>
                <View style={styles.categoryTags}>
                  {selectedCategories.map(catId => {
                    const category = [
                      { id: '1', name: 'Qurilish' },
                      { id: '2', name: 'Universal' },
                      { id: '3', name: 'Buzish' },
                      { id: '4', name: 'Yuk' },
                    ].find(c => c.id === catId);
                    return (
                      <View key={catId} style={styles.categoryTag}>
                        <Text style={styles.categoryTagText}>{category?.name}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        )}

        {activeOrder && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: text }]}>Faol buyurtma</Text>
            <OrderCard
              order={activeOrder}
              onPress={() => router.push(`/order/${activeOrder.id}`)}
              isDarkMode={isDarkMode}
            />
          </View>
        )}

        {pendingOrders.length > 0 && isOnline && !activeOrder && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: text }]}>
              Yangi buyurtmalar ({pendingOrders.length})
            </Text>
            {pendingOrders.slice(0, 3).map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onPress={() => router.push(`/order/${order.id}`)}
                isDarkMode={isDarkMode}
                showActions
                onAccept={() => acceptOrder(order.id)}
                onReject={() => rejectOrder(order.id)}
              />
            ))}
          </View>
        )}

        {pendingOrders.length === 0 && isOnline && !activeOrder && (
          <View style={styles.emptyState}>
            <MaterialIcons name="hourglass-empty" size={64} color={textSecondary} />
            <Text style={[styles.emptyText, { color: textSecondary }]}>
              Yangi buyurtmalar kutilmoqda...
            </Text>
          </View>
        )}
      </ScrollView>

      <CategorySelector
        visible={showCategoryModal}
        selectedCategories={selectedCategories}
        onSelectCategory={handleSelectCategory}
        onStart={handleStart}
        onClose={() => setShowCategoryModal(false)}
        isDarkMode={isDarkMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  greeting: {
    ...typography.h2,
  },
  subGreeting: {
    fontSize: 14,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
  centerSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 16,
    minWidth: 280,
    justifyContent: 'center',
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  activeCategories: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: 12,
    width: '100%',
  },
  activeCategoriesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  categoryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    fontSize: 16,
    marginTop: spacing.md,
  },
});
