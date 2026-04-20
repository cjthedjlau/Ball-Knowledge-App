import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { brand, dark, light, colors, darkColors, fonts, fontFamily, spacing } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import { supabase } from '../../lib/supabase';
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';
import HighlightPill from '../../screens/components/ui/HighlightPill';

interface Props {
  onBack: () => void;
}

interface GameRow {
  game_type: string;
  score: number;
  xp_earned: number;
}

interface LeagueStats {
  gamesPlayed: number;
  mysteryCount: number;
  showdownCount: number;
  rank5Count: number;
  triviaCount: number;
  mysteryAvgGuesses: number;
  mysteryBestSolve: number;
  mysteryWins: number;
  triviaAvgScore: number;
  triviaPerfects: number;
  showdownCompletions: number;
  rank5Completions: number;
  totalXp: number;
  bestSingleXp: number;
}

function computeStats(rows: GameRow[]): LeagueStats {
  const mystery = rows.filter(r => r.game_type === 'mystery-player');
  const showdown = rows.filter(r => r.game_type === 'showdown');
  const rank5 = rows.filter(r => r.game_type === 'blind-rank-5');
  const trivia = rows.filter(r => r.game_type === 'trivia');

  const mysteryWins = mystery.filter(r => r.score > 0);
  const mysteryAvg = mysteryWins.length > 0
    ? mysteryWins.reduce((sum, r) => sum + r.score, 0) / mysteryWins.length
    : 0;
  const mysteryBest = mysteryWins.length > 0
    ? Math.min(...mysteryWins.map(r => r.score))
    : 0;

  const triviaTotal = trivia.reduce((sum, r) => sum + r.score, 0);
  const triviaAvg = trivia.length > 0 ? triviaTotal / trivia.length : 0;
  const triviaPerfects = trivia.filter(r => r.score === 3).length;

  const totalXp = rows.reduce((sum, r) => sum + (r.xp_earned ?? 0), 0);
  const bestXp = rows.length > 0 ? Math.max(...rows.map(r => r.xp_earned ?? 0)) : 0;

  return {
    gamesPlayed: rows.length,
    mysteryCount: mystery.length,
    showdownCount: showdown.length,
    rank5Count: rank5.length,
    triviaCount: trivia.length,
    mysteryAvgGuesses: Math.round(mysteryAvg * 10) / 10,
    mysteryBestSolve: mysteryBest,
    mysteryWins: mysteryWins.length,
    triviaAvgScore: Math.round(triviaAvg * 10) / 10,
    triviaPerfects,
    showdownCompletions: showdown.length,
    rank5Completions: rank5.length,
    totalXp,
    bestSingleXp: bestXp,
  };
}

export default function MyStats({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const [selectedLeague, setSelectedLeague] = useState('NBA');
  const [stats, setStats] = useState<LeagueStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) { setLoading(false); return; }

      const { data } = await supabase
        .from('user_game_results')
        .select('game_type, score, xp_earned')
        .eq('user_id', user.id)
        .eq('league', selectedLeague);

      if (!cancelled) {
        setStats(computeStats((data as GameRow[]) ?? []));
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [selectedLeague]);

  return (
    <View style={styles.root}>
      {/* Zone 1 */}
      <View style={[styles.zone1, { backgroundColor: brand.primary, paddingTop: insets.top + spacing.lg }]}>
        <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
          <ArrowLeft size={22} color={dark.textPrimary} strokeWidth={2.5} />
        </Pressable>
        <Text style={styles.zone1Title}>MY STATS</Text>
      </View>

      {/* Zone 2 */}
      <ScrollView
        style={[styles.zone2, { borderTopColor: isDark ? dark.cardBorder : light.cardBorder }]}
        contentContainerStyle={[styles.zone2Content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <LeagueSwitcher selected={selectedLeague} onChange={setSelectedLeague} />

        {loading ? (
          <ActivityIndicator color={colors.brand} style={{ marginTop: spacing['3xl'] }} />
        ) : !stats || stats.gamesPlayed === 0 ? (
          <Text style={[styles.emptyText, { color: isDark ? dark.textSecondary : light.textSecondary }]}>No games played yet for this league</Text>
        ) : (
          <>
            {/* Games Played Card */}
            <View style={[styles.card, {
              backgroundColor: isDark ? dark.card : light.card,
              borderTopColor: isDark ? dark.cardBorder : light.cardBorder,
            }]}>
              <Text style={[styles.cardTitle, { color: isDark ? dark.textSecondary : light.textSecondary }]}>GAMES PLAYED</Text>
              <Text style={[styles.cardHero, { color: brand.primary }]}>{stats.gamesPlayed}</Text>
              <View style={styles.breakdownRow}>
                <StatPill label="Mystery Player" value={stats.mysteryCount} />
                <StatPill label="Showdown" value={stats.showdownCount} />
              </View>
              <View style={styles.breakdownRow}>
                <StatPill label="Blind Rank 5" value={stats.rank5Count} />
                <StatPill label="Trivia" value={stats.triviaCount} />
              </View>
            </View>

            {/* Performance — Timeline Rows */}
            <View style={[styles.card, {
              backgroundColor: isDark ? dark.card : light.card,
              borderTopColor: isDark ? dark.cardBorder : light.cardBorder,
            }]}>
              <Text style={[styles.cardTitle, { color: isDark ? dark.textSecondary : light.textSecondary }]}>PERFORMANCE</Text>

              {/* Mystery Player row */}
              <View style={styles.timelineRow}>
                <Text style={styles.timelineAccent}>{stats.mysteryAvgGuesses.toString()}</Text>
                <View style={styles.timelineRight}>
                  <Text style={[styles.timelineTitle, { color: isDark ? dark.textPrimary : light.textPrimary }]}>Avg Guesses (Mystery Player)</Text>
                  <Text style={[styles.timelineDetail, { color: isDark ? dark.textSecondary : light.textSecondary }]}>
                    Best: {stats.mysteryBestSolve > 0 ? stats.mysteryBestSolve.toString() : '--'}  |  Wins: {stats.mysteryWins}
                  </Text>
                </View>
              </View>

              <View style={[styles.timelineDivider, { backgroundColor: isDark ? dark.divider : light.divider }]} />

              {/* Trivia row */}
              <View style={styles.timelineRow}>
                <Text style={styles.timelineAccent}>{stats.triviaAvgScore}/3</Text>
                <View style={styles.timelineRight}>
                  <Text style={[styles.timelineTitle, { color: isDark ? dark.textPrimary : light.textPrimary }]}>Avg Score (Trivia)</Text>
                  <Text style={[styles.timelineDetail, { color: isDark ? dark.textSecondary : light.textSecondary }]}>
                    Perfect Games: {stats.triviaPerfects}
                  </Text>
                </View>
              </View>

              <View style={[styles.timelineDivider, { backgroundColor: isDark ? dark.divider : light.divider }]} />

              {/* Showdown & Rank 5 row */}
              <View style={styles.timelineRow}>
                <Text style={styles.timelineAccent}>{stats.showdownCompletions + stats.rank5Completions}</Text>
                <View style={styles.timelineRight}>
                  <Text style={[styles.timelineTitle, { color: isDark ? dark.textPrimary : light.textPrimary }]}>Showdown + Rank 5</Text>
                  <Text style={[styles.timelineDetail, { color: isDark ? dark.textSecondary : light.textSecondary }]}>
                    Showdown: {stats.showdownCompletions}  |  Rank 5: {stats.rank5Completions}
                  </Text>
                </View>
              </View>
            </View>

            {/* XP Card */}
            <View style={[styles.card, {
              backgroundColor: isDark ? dark.card : light.card,
              borderTopColor: isDark ? dark.cardBorder : light.cardBorder,
            }]}>
              <Text style={[styles.cardTitle, { color: isDark ? dark.textSecondary : light.textSecondary }]}>XP</Text>
              <View style={styles.perfRow}>
                <PerfItem label="Total XP" value={stats.totalXp.toLocaleString()} accent />
                <PerfItem label="Best Game" value={stats.bestSingleXp.toLocaleString()} />
              </View>
            </View>

            {/* Highlight Pill — personal best */}
            {stats.triviaPerfects > 0 && (
              <HighlightPill text={`PERSONAL BEST: ${stats.triviaPerfects} PERFECT TRIVIA GAME${stats.triviaPerfects > 1 ? 'S' : ''}`} />
            )}
            {stats.triviaPerfects === 0 && stats.mysteryBestSolve > 0 && (
              <HighlightPill text={`PERSONAL BEST: MYSTERY PLAYER SOLVED IN ${stats.mysteryBestSolve}`} />
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

// ── Small components ──

function StatPill({ label, value }: { label: string; value: number }) {
  const { isDark } = useTheme();
  return (
    <View style={[styles.statPill, {
      backgroundColor: isDark ? dark.background : light.surface,
      borderColor: isDark ? dark.cardBorder : light.cardBorder,
    }]}>
      <Text style={[styles.statPillValue, { color: isDark ? dark.textPrimary : light.textPrimary }]}>{value}</Text>
      <Text style={[styles.statPillLabel, { color: isDark ? dark.textSecondary : light.textSecondary }]}>{label}</Text>
    </View>
  );
}

function PerfItem({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  const { isDark } = useTheme();
  return (
    <View style={[styles.perfItem, {
      backgroundColor: isDark ? dark.background : light.surface,
      borderColor: isDark ? dark.cardBorder : light.cardBorder,
    }]}>
      <Text style={[styles.perfValue, { color: isDark ? dark.textPrimary : light.textPrimary }, accent && { color: brand.primary }]}>{value}</Text>
      <Text style={[styles.perfLabel, { color: isDark ? dark.textSecondary : light.textSecondary }]}>{label}</Text>
    </View>
  );
}

// ── Styles ──

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  zone1: {
    paddingTop: spacing.lg,
    paddingBottom: spacing['3xl'] + spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    zIndex: 2,
  },
  backBtn: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    padding: spacing.sm,
    zIndex: 10,
  },
  zone1Title: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 36,
    lineHeight: 38,
    letterSpacing: 3,
    color: dark.textPrimary,
  },
  zone2: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 0,
    borderTopWidth: 1,
    shadowColor: dark.background,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1,
  },
  zone2Content: {
    paddingTop: spacing['4xl'],
    paddingHorizontal: spacing.lg,
    paddingBottom: 48,
    gap: spacing.lg,
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: darkColors.textSecondary,
    textAlign: 'center',
    marginTop: spacing['3xl'],
  },

  // Cards
  card: {
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: dark.background,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardTitle: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2,
  },
  cardHero: {
    fontFamily: fonts.display,
    fontSize: 48,
    lineHeight: 52,
  },
  breakdownRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statPill: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  statPillValue: {
    fontFamily: fonts.display,
    fontSize: 20,
  },
  statPillLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    marginTop: 2,
  },

  // Performance
  perfSection: {
    gap: spacing.xs,
  },
  perfSectionLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  perfRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  perfItem: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  perfValue: {
    fontFamily: fonts.display,
    fontSize: 18,
  },
  perfLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    marginTop: 2,
    textAlign: 'center',
  },

  // Timeline rows
  timelineRow: {
    flexDirection: 'row' as const,
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  timelineAccent: {
    fontFamily: fonts.display,
    fontSize: 26,
    minWidth: 56,
    color: brand.primary,
  },
  timelineRight: {
    flex: 1,
    justifyContent: 'center' as const,
  },
  timelineTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },
  timelineDetail: {
    fontFamily: fonts.body,
    fontSize: 11,
    marginTop: 2,
  },
  timelineDivider: {
    height: 1,
    marginHorizontal: 4,
  },
});
