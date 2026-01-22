import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

interface StatusBadgeProps {
  isOnline: boolean;
  isDarkMode: boolean;
}

export function StatusBadge({ isOnline, isDarkMode }: StatusBadgeProps) {
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? colors.surfaceDark : colors.surface }]}>
      <View style={[styles.dot, { backgroundColor: isOnline ? colors.online : colors.offline }]} />
      <Text style={[styles.text, { color: isDarkMode ? colors.textDark : colors.text }]}>
        {isOnline ? 'Onlayn' : 'Oflayn'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});
