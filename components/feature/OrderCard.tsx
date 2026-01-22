import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../constants/theme';
import { Order } from '../../services/mockData';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
  isDarkMode: boolean;
  showActions?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onComplete?: () => void;
}

export function OrderCard({
  order,
  onPress,
  isDarkMode,
  showActions,
  onAccept,
  onReject,
  onComplete,
}: OrderCardProps) {
  const surface = isDarkMode ? colors.surfaceDark : colors.surface;
  const text = isDarkMode ? colors.textDark : colors.text;
  const textSecondary = isDarkMode ? colors.textSecondaryDark : colors.textSecondary;

  const getStatusText = () => {
    switch (order.status) {
      case 'accepted':
        return 'Tasdiqlash jarayonida...';
      case 'approved':
        return 'Tasdiqlandi';
      case 'completed':
        return 'Bajarildi';
      default:
        return 'Yangi';
    }
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'accepted':
        return colors.warning;
      case 'approved':
        return colors.success;
      case 'completed':
        return colors.info;
      default:
        return colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {order.images.length > 0 && (
        <Image source={{ uri: order.images[0] }} style={styles.image} />
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
          <View style={styles.categoryBadge}>
            <MaterialIcons name="category" size={14} color={textSecondary} />
            <Text style={[styles.categoryText, { color: textSecondary }]}>
              {order.categoryName}
            </Text>
          </View>
        </View>

        <View style={styles.location}>
          <MaterialIcons name="location-on" size={18} color={colors.error} />
          <Text style={[styles.locationText, { color: text }]} numberOfLines={1}>
            {order.location}
          </Text>
        </View>

        <Text style={[styles.description, { color: textSecondary }]} numberOfLines={2}>
          {order.description}
        </Text>

        {order.clientPhone && (
          <View style={styles.clientInfo}>
            <MaterialIcons name="phone" size={16} color={colors.success} />
            <Text style={[styles.clientPhone, { color: text }]}>{order.clientPhone}</Text>
          </View>
        )}

        {showActions && order.status === 'pending' && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.error }]}
              onPress={onReject}
            >
              <Text style={styles.actionButtonText}>Rad etish</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.success, flex: 1 }]}
              onPress={onAccept}
            >
              <Text style={styles.actionButtonText}>Qabul qilish</Text>
            </TouchableOpacity>
          </View>
        )}

        {order.status === 'approved' && onComplete && (
          <TouchableOpacity
            style={[styles.completeButton, { backgroundColor: colors.primary }]}
            onPress={onComplete}
          >
            <Text style={styles.actionButtonText}>Ishni tugatdim</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: colors.border,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.sm,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  clientPhone: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    padding: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  completeButton: {
    padding: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.md,
  },
});
