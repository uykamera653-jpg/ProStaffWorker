import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useWorker } from '../../hooks/useWorker';
import { colors, spacing, typography } from '../../constants/theme';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { pendingOrders, myOrders, completedOrders, acceptOrder, rejectOrder, completeOrder, isDarkMode } = useWorker();

  const allOrders = [...pendingOrders, ...myOrders, ...completedOrders];
  const order = allOrders.find(o => o.id === id);

  const bg = isDarkMode ? colors.backgroundDark : colors.background;
  const surface = isDarkMode ? colors.surfaceDark : colors.surface;
  const text = isDarkMode ? colors.textDark : colors.text;
  const textSecondary = isDarkMode ? colors.textSecondaryDark : colors.textSecondary;

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        <Text style={[styles.errorText, { color: text }]}>Buyurtma topilmadi</Text>
      </View>
    );
  }

  const handleAccept = () => {
    acceptOrder(order.id);
    router.back();
  };

  const handleReject = () => {
    rejectOrder(order.id);
    router.back();
  };

  const handleComplete = () => {
    completeOrder(order.id);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageGallery}>
          {order.images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))}
        </View>

        <View style={[styles.infoCard, { backgroundColor: surface }]}>
          <Text style={[styles.category, { color: colors.primary }]}>{order.categoryName}</Text>

          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={20} color={colors.error} />
            <Text style={[styles.location, { color: text }]}>{order.location}</Text>
          </View>

          <Text style={[styles.description, { color: text }]}>{order.description}</Text>

          <View style={styles.divider} />

          <View style={styles.statusRow}>
            <Text style={[styles.label, { color: textSecondary }]}>Holati:</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
            </View>
          </View>

          {order.clientPhone && (
            <>
              <View style={styles.divider} />
              <View style={styles.contactInfo}>
                <Text style={[styles.label, { color: textSecondary }]}>Buyurtmachi:</Text>
                <View style={styles.contactRow}>
                  <MaterialIcons name="person" size={20} color={text} />
                  <Text style={[styles.contactText, { color: text }]}>{order.clientName}</Text>
                </View>
                <View style={styles.contactRow}>
                  <MaterialIcons name="phone" size={20} color={colors.success} />
                  <Text style={[styles.contactText, { color: colors.success }]}>
                    {order.clientPhone}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {order.status === 'pending' && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.error, flex: 1 }]}
              onPress={handleReject}
            >
              <Text style={styles.actionButtonText}>Rad etish</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.success, flex: 2 }]}
              onPress={handleAccept}
            >
              <Text style={styles.actionButtonText}>Qabul qilish</Text>
            </TouchableOpacity>
          </View>
        )}

        {order.status === 'approved' && (
          <TouchableOpacity
            style={[styles.completeButton, { backgroundColor: colors.primary }]}
            onPress={handleComplete}
          >
            <MaterialIcons name="check-circle" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Ishni tugatdim</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

function getStatusText(status: string) {
  switch (status) {
    case 'accepted':
      return 'Tasdiqlash jarayonida';
    case 'approved':
      return 'Tasdiqlandi';
    case 'completed':
      return 'Bajarildi';
    default:
      return 'Yangi';
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'accepted':
      return colors.warning;
    case 'approved':
      return colors.success;
    case 'completed':
      return colors.info;
    default:
      return colors.primary;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  imageGallery: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: colors.border,
  },
  infoCard: {
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  category: {
    ...typography.h3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  location: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  contactInfo: {
    gap: spacing.sm,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  contactText: {
    fontSize: 16,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  actionButton: {
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  completeButton: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  errorText: {
    ...typography.h3,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
