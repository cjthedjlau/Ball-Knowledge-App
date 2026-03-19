import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { colors, darkColors, fontFamily } from '../../../styles/theme';

const LEAGUES = [
  { key: 'NFL', emoji: '🏈' },
  { key: 'NBA', emoji: '🏀' },
  { key: 'MLB', emoji: '⚾' },
  { key: 'NHL', emoji: '🏒' },
] as const;

interface LeagueSwitcherProps {
  selected: string;
  onChange: (league: string) => void;
}

export default function LeagueSwitcher({ selected, onChange }: LeagueSwitcherProps) {
  return (
    <View style={styles.container}>
      {LEAGUES.map(({ key, emoji }) => {
        const isActive = selected === key;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>
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
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 999,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 999,
    gap: 4,
  },
  tabActive: {
    backgroundColor: colors.brand,
  },
  emoji: {
    fontSize: 14,
  },
  label: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
    color: '#9A9A9A',
  },
  labelActive: {
    color: colors.white,
  },
});
