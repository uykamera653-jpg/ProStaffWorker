import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants/theme';

interface PriceRangePickerProps {
  minPrice: number;
  maxPrice: number;
  onSave: (min: number, max: number) => void;
  isDarkMode: boolean;
  language: 'uz' | 'ru';
}

export function PriceRangePicker({ minPrice, maxPrice, onSave, isDarkMode, language }: PriceRangePickerProps) {
  const [min, setMin] = useState(minPrice.toString());
  const [max, setMax] = useState(maxPrice.toString());
  const [isEditing, setIsEditing] = useState(false);

  const surface = isDarkMode ? colors.surfaceDark : colors.surface;
  const text = isDarkMode ? colors.textDark : colors.text;
  const textSecondary = isDarkMode ? colors.textSecondaryDark : colors.textSecondary;

  const handleSave = () => {
    const minVal = parseInt(min) || 200000;
    const maxVal = parseInt(max) || 300000;
    
    if (minVal >= maxVal) {
      alert(language === 'uz' ? 'Minimal narx maksimaldan kichik bo\'lishi kerak' : 'Минимальная цена должна быть меньше максимальной');
      return;
    }
    
    onSave(minVal, maxVal);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <View style={[styles.container, { backgroundColor: surface }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: text }]}>
            {language === 'uz' ? 'Narx diapazoni' : 'Диапазон цен'}
          </Text>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <MaterialIcons name="edit" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.priceRow}>
          <View style={styles.priceItem}>
            <Text style={[styles.label, { color: textSecondary }]}>
              {language === 'uz' ? 'Minimal' : 'Минимальная'}
            </Text>
            <Text style={[styles.price, { color: text }]}>
              {minPrice.toLocaleString()} {language === 'uz' ? "so'm" : 'сум'}
            </Text>
          </View>
          <View style={styles.priceItem}>
            <Text style={[styles.label, { color: textSecondary }]}>
              {language === 'uz' ? 'Maksimal' : 'Максимальная'}
            </Text>
            <Text style={[styles.price, { color: text }]}>
              {maxPrice.toLocaleString()} {language === 'uz' ? "so'm" : 'сум'}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: surface }]}>
      <Text style={[styles.title, { color: text }]}>
        {language === 'uz' ? 'Narxni sozlash' : 'Настройка цены'}
      </Text>
      <View style={styles.inputs}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: textSecondary }]}>
            {language === 'uz' ? 'Minimal' : 'Минимальная'}
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: isDarkMode ? colors.backgroundDark : colors.background, color: text }]}
            value={min}
            onChangeText={setMin}
            keyboardType="numeric"
            placeholder="200000"
            placeholderTextColor={textSecondary}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: textSecondary }]}>
            {language === 'uz' ? 'Maksimal' : 'Максимальная'}
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: isDarkMode ? colors.backgroundDark : colors.background, color: text }]}
            value={max}
            onChangeText={setMax}
            keyboardType="numeric"
            placeholder="300000"
            placeholderTextColor={textSecondary}
          />
        </View>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.border }]}
          onPress={() => setIsEditing(false)}
        >
          <Text style={[styles.buttonText, { color: text }]}>
            {language === 'uz' ? 'Bekor qilish' : 'Отмена'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary, flex: 1 }]}
          onPress={handleSave}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>
            {language === 'uz' ? 'Saqlash' : 'Сохранить'}
          </Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
  },
  priceRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  priceItem: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
  },
  inputs: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  inputContainer: {
    gap: spacing.xs,
  },
  input: {
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  button: {
    padding: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
