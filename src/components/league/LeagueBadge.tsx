import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Shield, Star, Award, Trophy, Crown, Zap } from 'lucide-react-native';
import { fonts, fontFamily, spacing } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import { type LeagueTier, LEAGUE_TIER_COLORS } from '../../hooks/useWeeklyLeague';

// ── Tier icon mapping ────────────────────────────────────────────────────────

const TIER_ICONS: Record<LeagueTier, React.ComponentType<any>> = {
  Rookie:     Shield,
  Starter:    Zap,
  Rotation:   Star,
  'All-Star': Award,
  MVP:        Trophy,
  GOAT:       Crown,
};

// ── Props ────────────────────────────────────────────────────────────────────

interface LeagueBadgeProps {
  tier: LeagueTier;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function LeagueBadge({ tier, size = 'md', showLabel = true }: LeagueBadgeProps) {
  const { isDark } = useTheme();
  const color = LEAGUE_TIER_COLORS[tier];
  const Icon = TIER_ICONS[tier];

  const iconSize = size === 'sm' ? 14 : size === 'md' ? 18 : 24;
  const fontSize = size === 'sm' ? 11 : size === 'md' ? 13 : 16;
  const paddingH = size === 'sm' ? 8 : size === 'md' ? 12 : 16;
  const paddingV = size === 'sm' ? 4 : size === 'md' ? 6 : 8;
  const borderRadius = size === 'sm' ? 6 : size === 'md' ? 8 : 12;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: isDark ? `${color}18` : `${color}12`,
          borderColor: `${color}40`,
          paddingHorizontal: paddingH,
          paddingVertical: paddingV,
          borderRadius,
        },
      ]}
    >
      <Icon color={color} size={iconSize} strokeWidth={2} />
      {showLabel && (
        <Text
          style={[
            styles.label,
            { color, fontSize },
          ]}
        >
          {tier}
        </Text>
      )}
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    borderWidth: 1,
  },
  label: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
