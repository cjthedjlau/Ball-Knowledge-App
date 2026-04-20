import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { brand, dark, light, fonts, radius } from '../../../styles/theme';
import { useTheme } from '../../../hooks/useTheme';

interface LeaderboardRowProps {
  rank: number;
  avatar: string;
  username: string;
  score: string;
  isCurrentUser?: boolean;
}

export default function LeaderboardRow({
  rank,
  avatar,
  username,
  score,
  isCurrentUser = false,
}: LeaderboardRowProps) {
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: isDark ? dark.card : light.card,
          borderColor: isDark ? dark.cardBorder : light.cardBorder,
          ...(isDark
            ? {}
            : {
                shadowColor: '#000',
                shadowOpacity: 0.06,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
              }),
        },
        isCurrentUser && {
          backgroundColor: isDark ? 'rgba(252,52,92,0.08)' : 'rgba(252,52,92,0.05)',
          borderLeftWidth: 3,
          borderLeftColor: brand.primary,
        },
      ]}
    >
      <View
        style={[
          styles.rankCircle,
          { backgroundColor: isDark ? dark.surface : light.surface },
        ]}
      >
        <Text
          style={[
            styles.rankText,
            { color: isDark ? dark.textSecondary : light.textSecondary },
          ]}
        >
          {rank}
        </Text>
      </View>

      <Text style={styles.avatar}>{avatar}</Text>

      <View style={styles.nameContainer}>
        <View style={styles.nameRow}>
          <Text
            style={[
              styles.username,
              { color: isDark ? dark.textPrimary : light.textPrimary },
            ]}
            numberOfLines={1}
          >
            {username}
          </Text>
          {isCurrentUser && (
            <View
              style={[
                styles.youBadge,
                { backgroundColor: isDark ? dark.textPrimary : light.textPrimary },
              ]}
            >
              <Text style={[styles.youText, { color: brand.primary }]}>You</Text>
            </View>
          )}
        </View>
        <Text
          style={[
            styles.rankLabel,
            { color: isDark ? dark.textSecondary : light.textSecondary },
          ]}
        >
          Rank #{rank}
        </Text>
      </View>

      <Text style={styles.score}>{score}</Text>
    </View>
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
    borderRadius: radius.primary,
    borderWidth: 1,
  },
  rankCircle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 15,
  },
  avatar: {
    fontSize: 40,
  },
  nameContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  username: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 1,
    flexShrink: 1,
  },
  youBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  youText: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 11,
  },
  rankLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    marginTop: 2,
  },
  score: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 1,
    color: brand.primary,
  },
});
