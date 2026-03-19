import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, darkColors, fontFamily } from '../../../styles/theme';

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
  return (
    <View style={[styles.row, isCurrentUser && styles.rowCurrentUser]}>
      <View style={styles.rankCircle}>
        <Text style={styles.rankText}>{rank}</Text>
      </View>

      <Text style={styles.avatar}>{avatar}</Text>

      <View style={styles.nameContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.username} numberOfLines={1}>{username}</Text>
          {isCurrentUser && (
            <View style={styles.youBadge}>
              <Text style={styles.youText}>You</Text>
            </View>
          )}
        </View>
        <Text style={styles.rankLabel}>Rank #{rank}</Text>
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
  rowCurrentUser: {
    backgroundColor: 'rgba(252,52,92,0.08)',
    borderLeftWidth: 3,
    borderLeftColor: colors.brand,
  },
  rankCircle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: darkColors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 15,
    color: '#9A9A9A',
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
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
    color: colors.white,
    flexShrink: 1,
  },
  youBadge: {
    backgroundColor: colors.white,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  youText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    color: colors.brand,
  },
  rankLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: '#9A9A9A',
    marginTop: 2,
  },
  score: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
    color: colors.brand,
  },
});
