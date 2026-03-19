import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { colors, darkColors, fontFamily, spacing } from '../../styles/theme';
import { supabase } from '../../lib/supabase';
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';

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
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Zone 1 */}
      <View style={styles.zone1}>
        <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
          <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
        </Pressable>
        <Text style={styles.zone1Title}>MY STATS</Text>
      </View>

      {/* Zone 2 */}
      <ScrollView
        style={styles.zone2}
        contentContainerStyle={styles.zone2Content}
        showsVerticalScrollIndicator={false}
      >
        <LeagueSwitcher selected={selectedLeague} onChange={setSelectedLeague} />

        {loading ? (
          <ActivityIndicator color={colors.brand} style={{ marginTop: spacing['3xl'] }} />
        ) : !stats || stats.gamesPlayed === 0 ? (
          <Text style={styles.emptyText}>No games played yet for this league</Text>
        ) : (
          <>
            {/* Games Played Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>GAMES PLAYED</Text>
              <Text style={styles.cardHero}>{stats.gamesPlayed}</Text>
              <View style={styles.breakdownRow}>
                <StatPill label="Mystery Player" value={stats.mysteryCount} />
                <StatPill label="Showdown" value={stats.showdownCount} />
              </View>
              <View style={styles.breakdownRow}>
                <StatPill label="Blind Rank 5" value={stats.rank5Count} />
                <StatPill label="Trivia" value={stats.triviaCount} />
              </View>
            </View>

            {/* Performance Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>PERFORMANCE</Text>

              <View style={styles.perfSection}>
                <Text style={styles.perfSectionLabel}>Mystery Player</Text>
                <View style={styles.perfRow}>
                  <PerfItem label="Avg Guesses" value={stats.mysteryAvgGuesses.toString()} />
                  <PerfItem label="Best Solve" value={stats.mysteryBestSolve > 0 ? stats.mysteryBestSolve.toString() : '—'} />
                  <PerfItem label="Wins" value={stats.mysteryWins.toString()} />
                </View>
              </View>

              <View style={styles.perfSection}>
                <Text style={styles.perfSectionLabel}>Trivia</Text>
                <View style={styles.perfRow}>
                  <PerfItem label="Avg Score" value={`${stats.triviaAvgScore}/3`} />
                  <PerfItem label="Perfect (3/3)" value={stats.triviaPerfects.toString()} />
                </View>
              </View>

              <View style={styles.perfSection}>
                <Text style={styles.perfSectionLabel}>Showdown &amp; Blind Rank 5</Text>
                <View style={styles.perfRow}>
                  <PerfItem label="Showdown" value={stats.showdownCompletions.toString()} />
                  <PerfItem label="Rank 5" value={stats.rank5Completions.toString()} />
                </View>
              </View>
            </View>

            {/* XP Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>XP</Text>
              <View style={styles.perfRow}>
                <PerfItem label="Total XP" value={stats.totalXp.toLocaleString()} accent />
                <PerfItem label="Best Game" value={stats.bestSingleXp.toLocaleString()} />
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Small components ──

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statPillValue}>{value}</Text>
      <Text style={styles.statPillLabel}>{label}</Text>
    </View>
  );
}

function PerfItem({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={styles.perfItem}>
      <Text style={[styles.perfValue, accent && { color: colors.brand }]}>{value}</Text>
      <Text style={styles.perfLabel}>{label}</Text>
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
    backgroundColor: colors.brand,
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
    fontSize: 28,
    letterSpacing: 3,
    color: colors.white,
  },
  zone2: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
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
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
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
    color: darkColors.textSecondary,
  },
  cardHero: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 48,
    color: colors.brand,
    lineHeight: 52,
  },
  breakdownRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statPill: {
    flex: 1,
    backgroundColor: darkColors.background,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  statPillValue: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 20,
    color: darkColors.text,
  },
  statPillLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: darkColors.textSecondary,
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
    color: darkColors.text,
    letterSpacing: 0.5,
  },
  perfRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  perfItem: {
    flex: 1,
    backgroundColor: darkColors.background,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  perfValue: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 18,
    color: darkColors.text,
  },
  perfLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 10,
    color: darkColors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
});
