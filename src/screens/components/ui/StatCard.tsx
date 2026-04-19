import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { brand, dark, light, fonts } from '../../../styles/theme';
import { useTheme } from '../../../hooks/useTheme';

interface Props {
  value: string;
  label: string;
  valueColor?: string;
  onGradient?: boolean;
}

export default function StatCard({ value, label, valueColor, onGradient }: Props) {
  const { isDark } = useTheme();

  const bg = onGradient
    ? 'rgba(0,0,0,0.2)'
    : isDark ? dark.card : light.card;
  const border = onGradient
    ? 'rgba(255,255,255,0.1)'
    : isDark ? dark.cardBorder : light.cardBorder;
  const labelColor = onGradient
    ? 'rgba(255,255,255,0.4)'
    : isDark ? dark.textMuted : light.textMuted;
  const valColor = valueColor || (onGradient ? '#FFFFFF' : isDark ? dark.textPrimary : light.textPrimary);

  return (
    <View style={[styles.card, { backgroundColor: bg, borderColor: border }]}>
      <Text style={[styles.value, { color: valColor }]}>{value}</Text>
      <Text style={[styles.label, { color: labelColor }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  value: {
    fontFamily: fonts.display,
    fontSize: 34,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 9,
    letterSpacing: 1.5,
    marginTop: 4,
  },
});
