import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { brand, dark, fonts } from '../../../styles/theme';

interface TeamRow {
  name: string;
  score: string | number;
  isWinner: boolean;
}

interface Props {
  labelText: string;
  teamA: TeamRow;
  teamB: TeamRow;
  badgeText?: string;
}

export default function ScoreboardCard({ labelText, teamA, teamB, badgeText }: Props) {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={[brand.primary, brand.teal]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.accentBar}
      />
      <View style={styles.inner}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionLabel}>{labelText.toUpperCase()}</Text>
          {badgeText ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeText.toUpperCase()}</Text>
            </View>
          ) : null}
        </View>
        <ScoreRow {...teamA} />
        <View style={styles.divider} />
        <ScoreRow {...teamB} />
      </View>
    </View>
  );
}

function ScoreRow({ name, score, isWinner }: TeamRow) {
  const opacity = isWinner ? 1 : 0.25;
  return (
    <View style={styles.scoreRow}>
      <Text style={[styles.teamName, { opacity }]}>{name}</Text>
      <Text style={[styles.teamScore, { opacity }]}>{String(score)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: dark.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: dark.cardBorder,
    overflow: 'hidden',
  },
  accentBar: {
    height: 3,
    width: '100%',
  },
  inner: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 9,
    letterSpacing: 1.5,
    color: dark.textMuted,
  },
  badge: {
    backgroundColor: 'rgba(252,52,92,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(252,52,92,0.3)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 9,
    letterSpacing: 1,
    color: brand.primary,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  teamName: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: dark.textPrimary,
  },
  teamScore: {
    fontFamily: fonts.display,
    fontSize: 52,
    color: dark.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: dark.divider,
  },
});
