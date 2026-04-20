import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { brand, dark, light, fonts, radius } from '../../../styles/theme';
import { useTheme } from '../../../hooks/useTheme';

const LEAGUES = [
  { key: 'NFL' },
  { key: 'NBA' },
  { key: 'MLB' },
  { key: 'NHL' },
] as const;

interface LeagueSwitcherProps {
  selected: string;
  onChange: (league: string) => void;
}

export default function LeagueSwitcher({ selected, onChange }: LeagueSwitcherProps) {
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? dark.surface : light.surface },
      ]}
    >
      {LEAGUES.map(({ key }) => {
        const isActive = selected === key;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: isActive
                    ? dark.textPrimary
                    : isDark
                      ? dark.textSecondary
                      : light.textSecondary,
                },
              ]}
            >
              {key}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: radius.pill,
    gap: 4,
  },
  tabActive: {
    backgroundColor: brand.primary,
  },
  emoji: {
    fontSize: 14,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 1,
  },
});
