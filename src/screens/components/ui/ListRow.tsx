import React from 'react';
import { Pressable, View, Text, StyleSheet, type PressableProps } from 'react-native';
import { brand, dark, light, fonts, radius } from '../../../styles/theme';
import { useTheme } from '../../../hooks/useTheme';
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
  const { isDark } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: isDark ? dark.card : light.card,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? dark.divider : light.divider,
        },
        pressed && onPress && styles.pressed,
      ]}
      {...rest}
    >
      <View
        style={
          danger
            ? [styles.iconPillDanger, { backgroundColor: 'rgba(252,52,92,0.15)' }]
            : undefined
        }
      >
        <IconPill icon={icon} size="md" />
      </View>

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.label,
            { color: isDark ? dark.textPrimary : light.textPrimary },
            danger && { color: brand.primary },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
        {subtitle ? (
          <Text
            style={[
              styles.subtitle,
              { color: isDark ? dark.textSecondary : light.textSecondary },
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {value ? (
        <Text
          style={[
            styles.value,
            { color: isDark ? dark.textSecondary : light.textSecondary },
          ]}
        >
          {value}
        </Text>
      ) : onPress ? (
        <Text
          style={[
            styles.chevron,
            { color: isDark ? dark.textSecondary : light.textSecondary },
          ]}
        >
          ›
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    marginTop: 2,
  },
  value: {
    fontFamily: fonts.body,
    fontSize: 15,
  },
  chevron: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 20,
  },
  iconPillDanger: {
    borderRadius: radius.primary,
  },
});
