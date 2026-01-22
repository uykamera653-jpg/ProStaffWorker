import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants/theme';
import { config } from '../../constants/config';

interface CategorySelectorProps {
  visible: boolean;
  selectedCategories: string[];
  onSelectCategory: (categoryId: string) => void;
  onStart: () => void;
  onClose: () => void;
  isDarkMode: boolean;
}

export function CategorySelector({
  visible,
  selectedCategories,
  onSelectCategory,
  onStart,
  onClose,
  isDarkMode,
}: CategorySelectorProps) {
  const bg = isDarkMode ? colors.backgroundDark : colors.background;
  const surface = isDarkMode ? colors.surfaceDark : colors.surface;
  const text = isDarkMode ? colors.textDark : colors.text;
  const textSecondary = isDarkMode ? colors.textSecondaryDark : colors.textSecondary;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.container, { backgroundColor: surface }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: text }]}>Kategoriyalarni tanlang</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={text} />
            </TouchableOpacity>
          </View>

          <View style={styles.categories}>
            {config.categories.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    {
                      backgroundColor: isSelected ? colors.primary : bg,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => onSelectCategory(category.id)}
                >
                  <MaterialIcons
                    name={category.icon as any}
                    size={32}
                    color={isSelected ? '#fff' : colors.primary}
                  />
                  <Text
                    style={[
                      styles.categoryName,
                      { color: isSelected ? '#fff' : text },
                    ]}
                  >
                    {category.name}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <MaterialIcons name="check-circle" size={20} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[
              styles.startButton,
              {
                backgroundColor: selectedCategories.length > 0 ? colors.primary : colors.border,
              },
            ]}
            onPress={onStart}
            disabled={selectedCategories.length === 0}
          >
            <Text style={styles.startButtonText}>Boshlash</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
  },
  categories: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    gap: spacing.md,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  checkmark: {
    marginLeft: 'auto',
  },
  startButton: {
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
