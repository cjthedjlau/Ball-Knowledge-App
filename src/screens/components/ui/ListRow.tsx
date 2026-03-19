import React from 'react';
import { Pressable, View, Text, StyleSheet, type PressableProps } from 'react-native';
import { colors, darkColors, fontFamily } from '../../../styles/theme';
import IconPill from './IconPill';

interface ListRowProps extends Omit<PressableProps, 'children'> {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}

export default function ListRow({
  icon,
  label,
  subtitle,
  value,
  onPress,
  danger = false,
  ...rest
}: ListRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && onPress && styles.pressed,
      ]}
      {...rest}
    >
      <View style={danger ? styles.iconPillDanger : undefined}>
        <IconPill icon={icon} size="md" />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.label, danger && styles.labelDanger]} numberOfLines={1}>
          {label}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        ) : null}
      </View>

      {value ? (
        <Text style={styles.value}>{value}</Text>
      ) : onPress ? (
        <Text style={styles.chevron}>›</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkColors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.white,
  },
  labelDanger: {
    color: colors.brand,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: darkColors.textSecondary,
    marginTop: 2,
  },
  value: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: darkColors.textSecondary,
  },
  chevron: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 20,
    color: darkColors.textSecondary,
  },
  iconPillDanger: {
    opacity: 1,
    // Wraps IconPill; the red tint is applied by overriding the IconPill bg
    // via a wrapper background + borderRadius to match
    backgroundColor: 'rgba(252,52,92,0.15)',
    borderRadius: 14,
  },
});
