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
import {
  ArrowLeft,
  Trophy,
  Flame,
  Shield,
  Zap,
  Star,
  Search,
  TrendingUp,
  Award,
  Globe,
  Users,
} from 'lucide-react-native';
import { brand, dark, light, colors, darkColors, fonts, fontFamily, spacing } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import { supabase } from '../../lib/supabase';
import AchievementBadge from '../../screens/components/ui/AchievementBadge';

interface Props {
  onBack: () => void;
}

interface UserStats {
  gamesPlayed: number;
  streak: number;
  lifetimeXp: number;
  triviaPerfects: number;
  mysterySolvedIn1: boolean;
  mysteryTotal: number;
  leaguesPlayed: number;
  multiplayerGames: number;
}

interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  condition: (stats: UserStats) => boolean;
}

const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_game',
    title: 'First Whistle',
    description: 'Play your first game',
    icon: <Trophy color={colors.white} size={28} strokeWidth={2} />,
    condition: (s) => s.gamesPlayed >= 1,
  },
  {
    id: 'streak_7',
    title: 'On Fire',
    description: 'Reach a 7-day streak',
    icon: <Flame color={colors.white} size={28} strokeWidth={2} />,
    condition: (s) => s.streak >= 7,
  },
  {
    id: 'streak_30',
    title: 'Ironman',
    description: 'Reach a 30-day streak',
    icon: <Shield color={colors.white} size={28} strokeWidth={2} />,
    condition: (s) => s.streak >= 30,
  },
  {
    id: 'perfect_trivia',
    title: 'Big Brain',
    description: 'Get 3/3 on Trivia',
    icon: <Zap color={colors.white} size={28} strokeWidth={2} />,
    condition: (s) => s.triviaPerfects >= 1,
  },
  {
    id: 'mystery_first_guess',
    title: 'Psychic',
    description: 'Solve Mystery Player in 1 guess',
    icon: <Star color={colors.white} size={28} strokeWidth={2} />,
    condition: (s) => s.mysterySolvedIn1,
  },
  {
    id: 'mystery_100',
    title: 'Scout',
    description: 'Complete 100 Mystery Player games',
    icon: <Search color={colors.white} size={28} strokeWidth={2} />,
    condition: (s) => s.mysteryTotal >= 100,
  },
  {
    id: 'xp_10000',
    title: 'Grinder',
    description: 'Earn 10,000 lifetime XP',
    icon: <TrendingUp color={colors.white} size={28} strokeWidth={2} />,
    condition: (s) => s.lifetimeXp >= 10000,
  },
  {
    id: 'xp_100000',
    title: 'Legend',
    description: 'Earn 100,000 lifetime XP',
    icon: <Award color={colors.white} size={28} strokeWidth={2} />,
    condition: (s) => s.lifetimeXp >= 100000,
  },
  {
    id: 'all_leagues',
    title: 'Omniscient',
    description: 'Play all 4 leagues',
    icon: <Globe color={colors.white} size={28} strokeWidth={2} />,
    condition: (s) => s.leaguesPlayed >= 4,
  },
  {
    id: 'multiplayer_10',
    title: 'Social',
    description: 'Play 10 multiplayer games',
    icon: <Users color={colors.white} size={28} strokeWidth={2} />,
    condition: (s) => s.multiplayerGames >= 10,
  },
];

export default function Achievements({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) { setLoading(false); return; }

      const [profileRes, resultsRes] = await Promise.all([
        supabase.from('profiles').select('lifetime_xp, streak').eq('id', user.id).single(),
        supabase.from('user_game_results').select('game_type, score, league').eq('user_id', user.id),
      ]);

      if (cancelled) return;

      const profile = profileRes.data;
      const results = (resultsRes.data ?? []) as { game_type: string; score: number; league: string }[];

      const mysteryResults = results.filter(r => r.game_type === 'mystery-player');
      const triviaResults = results.filter(r => r.game_type === 'trivia');
      const leagues = new Set(results.map(r => r.league));

      // Multiplayer games are game types not in the standard daily set
      const dailyTypes = new Set(['mystery-player', 'showdown', 'blind-rank-5', 'trivia']);
      const multiplayerGames = results.filter(r => !dailyTypes.has(r.game_type)).length;

      setUserStats({
        gamesPlayed: results.length,
        streak: profile?.streak ?? 0,
        lifetimeXp: profile?.lifetime_xp ?? 0,
        triviaPerfects: triviaResults.filter(r => r.score === 3).length,
        mysterySolvedIn1: mysteryResults.some(r => r.score === 1),
        mysteryTotal: mysteryResults.length,
        leaguesPlayed: leagues.size,
        multiplayerGames,
      });
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <View style={styles.root}>
      {/* Zone 1 */}
      <View style={[styles.zone1, { backgroundColor: brand.primary, paddingTop: insets.top + spacing.lg }]}>
        <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
          <ArrowLeft size={22} color={dark.textPrimary} strokeWidth={2.5} />
        </Pressable>
        <Text style={styles.zone1Title}>ACHIEVEMENTS</Text>
        {!loading && userStats && (
          <Text style={styles.zone1Sub}>
            {ACHIEVEMENTS.filter(a => a.condition(userStats)).length}/{ACHIEVEMENTS.length} UNLOCKED
          </Text>
        )}
      </View>

      {/* Zone 2 */}
      <ScrollView
        style={[styles.zone2, { borderTopColor: isDark ? dark.cardBorder : light.cardBorder }]}
        contentContainerStyle={[styles.zone2Content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator color={colors.brand} style={{ marginTop: spacing['3xl'] }} />
        ) : (
          <View style={styles.timelineList}>
            {ACHIEVEMENTS.map((achievement, index) => {
              const unlocked = userStats ? achievement.condition(userStats) : false;
              const accentNum = String(index + 1).padStart(2, '0');
              return (
                <View key={achievement.id}>
                  {index > 0 && (
                    <View style={[styles.timelineDivider, { backgroundColor: isDark ? dark.divider : light.divider }]} />
                  )}
                  <View style={styles.timelineRow}>
                    <Text style={[
                      styles.timelineAccent,
                      {
                        color: unlocked
                          ? brand.primary
                          : (isDark ? dark.textDisabled : light.textDisabled),
                      },
                    ]}>
                      {accentNum}
                    </Text>
                    <View style={styles.timelineRight}>
                      <Text style={[
                        styles.timelineTitle,
                        {
                          color: unlocked
                            ? (isDark ? dark.textPrimary : light.textPrimary)
                            : (isDark ? dark.textDisabled : light.textDisabled),
                        },
                      ]}>
                        {achievement.title}
                      </Text>
                      <Text style={[
                        styles.timelineDetail,
                        {
                          color: unlocked
                            ? (isDark ? dark.textSecondary : light.textSecondary)
                            : (isDark ? dark.textDisabled : light.textDisabled),
                        },
                      ]}>
                        {achievement.description}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

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
  zone1Sub: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.xs,
  },
  zone2: {
    flex: 1,
    backgroundColor: 'transparent',
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
  },
  timelineList: {
    gap: 0,
  },
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
