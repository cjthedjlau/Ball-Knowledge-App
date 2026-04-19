import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { brand, dark, light, fonts, fontFamily, spacing, radius } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import onThisDayData from '../../data/on-this-day.json';

const LEAGUE_COLORS: Record<string, string> = {
  NFL: '#013369',
  NBA: '#C9082A',
  MLB: '#002D72',
  NHL: '#000000',
};

export default function OnThisDay() {
  const { isDark } = useTheme();

  const fact = useMemo(() => {
    const now = new Date();
    const key = `${now.getMonth() + 1}-${now.getDate()}`;
    return (onThisDayData as Record<string, { year: number; league: string; description: string }>)[key] ?? null;
  }, []);

  if (!fact) return null;

  const t = isDark ? dark : light;
  const leagueColor = LEAGUE_COLORS[fact.league] ?? brand.primary;

  return (
    <View style={[styles.card, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
      <View style={styles.header}>
        <View style={[styles.leagueBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }]}>
          <Text style={[styles.leagueText, { color: leagueColor }]}>{fact.league}</Text>
        </View>
        <Text style={[styles.yearText, { color: t.textSecondary }]}>{fact.year}</Text>
      </View>
      <Text style={[styles.title, { color: t.textPrimary }]}>This Day in Sports History</Text>
      <Text style={[styles.description, { color: t.textSecondary }]}>{fact.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.cardPadding,
    marginHorizontal: spacing.screenHorizontal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  leagueBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.chip,
  },
  leagueText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 1.5,
  },
  yearText: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
});
