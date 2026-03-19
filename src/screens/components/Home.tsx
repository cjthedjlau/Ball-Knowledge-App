import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  StyleSheet,
  Animated,
} from 'react-native';
import {
  colors,
  darkColors,
  fontFamily,
  spacing,
} from '../../styles/theme';

import {
  Search,
  ListOrdered,
  Swords,
  Brain,
  Bell,
  Clock,
  Flame,
  Lock,
  Star,
  CheckCircle,
  Zap,
} from 'lucide-react-native';
import useProfile from '../../lib/useProfile';
import useZoneEntrance from '../../hooks/useZoneEntrance';
import { getTodaysCompletedGames } from '../../lib/gameResults';
import { LEVELS } from '../../lib/xp';
import StreakBadge from './ui/StreakBadge';
import DailyProgressBar from './ui/DailyProgressBar';
import InnerAccentCard from './ui/InnerAccentCard';
import GameCard from './ui/GameCard';
import AnimatedCard from '../../components/AnimatedCard';
import BottomNav, { type Tab } from '../../app/components/ui/BottomNav';

interface HomeProps {
  onNavigate: (tab: Tab) => void;
  onGoToGame: (gameId: string) => void;
  onGoToArchive?: () => void;
  refreshTrigger?: number;
}

export default function Home({ onNavigate, onGoToGame, onGoToArchive, refreshTrigger }: HomeProps) {
  const { profile, levelInfo } = useProfile(refreshTrigger);
  const { zone1Style, zone2Style } = useZoneEntrance();
  const [completedGameTypes, setCompletedGameTypes] = useState<Set<string>>(new Set());

  useEffect(() => {
    void getTodaysCompletedGames().then(results => {
      setCompletedGameTypes(new Set(results?.map(r => r.game_type) ?? []));
    });
  }, [refreshTrigger]);

  const streakCount = profile?.streak ?? 0;
  const streakAtRisk = profile?.streak_at_risk ?? false;
  const weeklyXpLabel = profile ? `${profile.weekly_xp} XP` : '0 XP';
  const completedGames = completedGameTypes.size;

  return (
    <View style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── ZONE 1: Brand Header ── */}
        <Animated.View style={[styles.zone1, zone1Style]}>
          {/* Top row: greeting + notification bell */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Hi, {profile?.username ?? 'SportsFan'}</Text>
              <Text style={styles.subGreeting}>Good Morning</Text>
            </View>
            <View style={styles.headerRightRow}>
              <Pressable style={styles.notificationBtn} onPress={onGoToArchive}>
                <Clock color={colors.white} size={20} />
              </Pressable>
              <Pressable style={styles.notificationBtn}>
                <Bell color={colors.white} size={20} />
              </Pressable>
            </View>
          </View>

          {/* Stats row: streak + XP */}
          <View style={styles.statsRow}>
            <StreakBadge count={streakCount} atRisk={streakAtRisk} />
            <View style={styles.xpBlock}>
              <Text style={styles.statLabel}>Weekly XP</Text>
              <Text style={styles.statValue}>{weeklyXpLabel}</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressWrapper}>
            <DailyProgressBar completed={completedGames} total={5} />
          </View>
        </Animated.View>

        {/* ── ZONE 2: Content Area ── */}
        <Animated.View style={[styles.zone2, zone2Style]}>
          {/* Inner Accent Card */}
          <InnerAccentCard
            leftIcon={<Flame color={colors.white} fill={colors.white} size={32} />}
            leftLabel="Current Streak"
            rightRows={[
              { label: 'Weekly XP', value: weeklyXpLabel },
              { label: 'Games Today', value: `${completedGames}/5` },
            ]}
          />

          {/* Daily Games Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Games</Text>
            <View style={styles.gameGrid}>
              <AnimatedCard delay={0} style={styles.gameGridItem}>
                <GameCard
                  title="Mystery Player"
                  subtitle="Guess today's mystery player in 8 tries"
                  icon={<Search color={colors.brand} size={24} />}
                  status={completedGameTypes.has('mystery-player') ? 'completed' : 'unplayed'}
                  onPress={() => onGoToGame('player-guess')}
                />
              </AnimatedCard>
              <AnimatedCard delay={80} style={styles.gameGridItem}>
                <GameCard
                  title="Blind Rank 5"
                  subtitle="Rank 5 hidden players"
                  icon={<ListOrdered color={colors.brand} size={24} />}
                  status={completedGameTypes.has('blind-rank-5') ? 'completed' : 'unplayed'}
                  onPress={() => onGoToGame('blind-rank-5')}
                />
              </AnimatedCard>
              <AnimatedCard delay={160} style={styles.gameGridItem}>
                <GameCard
                  title="Showdown"
                  subtitle="Compare two mystery athletes"
                  icon={<Swords color={colors.brand} size={24} />}
                  status={completedGameTypes.has('showdown') ? 'completed' : 'unplayed'}
                  onPress={() => onGoToGame('blind-showdown')}
                />
              </AnimatedCard>
              <AnimatedCard delay={240} style={styles.gameGridItem}>
                <GameCard
                  title="Trivia Game"
                  subtitle="3 rapid-fire sports questions"
                  icon={<Brain color={colors.brand} size={24} />}
                  status={completedGameTypes.has('trivia') ? 'completed' : 'unplayed'}
                  onPress={() => onGoToGame('trivia')}
                />
              </AnimatedCard>
              <AnimatedCard delay={320} style={styles.gameGridItem}>
                <GameCard
                  title="Power Play"
                  subtitle="Fast Money — hit 125 pts"
                  icon={<Zap color={colors.brand} size={24} />}
                  status={completedGameTypes.has('power-play') ? 'completed' : 'unplayed'}
                  onPress={() => onGoToGame('power-play')}
                />
              </AnimatedCard>
            </View>
          </View>

          {/* Level Progression */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Level</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.achievementRow}
            >
              {LEVELS.map((lvl, i) => {
                const currentLevel = levelInfo?.level ?? 1;
                const isPast = lvl.level < currentLevel;
                const isCurrent = lvl.level === currentLevel;
                const isFuture = lvl.level > currentLevel;

                return (
                  <AnimatedCard key={lvl.level} delay={320 + i * 60}>
                    <View style={[
                      styles.levelTile,
                      isPast && styles.levelTilePast,
                      isCurrent && styles.levelTileCurrent,
                      isFuture && styles.levelTileFuture,
                    ]}>
                      <View style={styles.levelIconWrap}>
                        {isPast ? (
                          <CheckCircle color={colors.white} size={24} strokeWidth={2} />
                        ) : isCurrent ? (
                          <Star color={colors.white} size={24} strokeWidth={2} fill={colors.white} />
                        ) : (
                          <Lock color={colors.white} size={20} strokeWidth={2} />
                        )}
                      </View>
                      <Text style={[
                        styles.levelNumber,
                        isCurrent && styles.levelNumberCurrent,
                      ]}>LVL {lvl.level}</Text>
                      <Text style={[
                        styles.levelName,
                        isCurrent && styles.levelNameCurrent,
                      ]} numberOfLines={1}>{lvl.name}</Text>
                    </View>
                  </AnimatedCard>
                );
              })}
            </ScrollView>
          </View>
        </Animated.View>
      </ScrollView>

      {/* ── Floating Pill Bottom Nav ── */}
      <BottomNav activeTab="home" onNavigate={onNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    height: Platform.OS === 'web' ? '100vh' as any : undefined,
    backgroundColor: 'transparent',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // ── Zone 1: Brand header ──
  zone1: {
    backgroundColor: colors.brand,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: spacing.screenHorizontal + 8,
    paddingTop: 48,
    paddingBottom: 80,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  greeting: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 32,
    letterSpacing: 1,
    color: colors.white,
  },
  subGreeting: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: 'rgba(255,255,255,0.70)',
    marginTop: 2,
  },
  headerRightRow: {
    flexDirection: 'row',
    gap: 8,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
    marginBottom: 24,
  },
  xpBlock: {
    flexDirection: 'column',
  },
  statLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 15,
    color: 'rgba(255,255,255,0.80)',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 34,
    letterSpacing: 1,
    color: colors.white,
  },
  progressWrapper: {
    width: '100%',
  },

  // ── Zone 2: Content area ──
  zone2: {
    backgroundColor: 'transparent',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.10)',
    marginTop: -64,
    paddingHorizontal: spacing.screenHorizontal + 8,
    paddingTop: 32,
    paddingBottom: 32,
    elevation: 20,
  },
  section: {
    marginTop: spacing.sectionGap + 8,
  },
  sectionTitle: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 24,
    letterSpacing: 1,
    color: colors.white,
    marginBottom: 16,
  },
  gameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.cardGap,
  },
  gameGridItem: {
    width: '47%',
  },
  achievementRow: {
    gap: 12,
    paddingBottom: 4,
  },

  // Level tiles
  levelTile: {
    width: 88,
    height: 96,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  levelTilePast: {
    backgroundColor: darkColors.surfaceElevated,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
  },
  levelTileCurrent: {
    backgroundColor: colors.brand,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 12,
  },
  levelTileFuture: {
    backgroundColor: darkColors.surfaceElevated,
    opacity: 0.35,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
  },
  levelIconWrap: {
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelNumber: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 1,
    color: darkColors.textSecondary,
    textAlign: 'center',
  },
  levelNumberCurrent: {
    color: colors.white,
  },
  levelName: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 0.5,
    color: darkColors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  levelNameCurrent: {
    color: colors.white,
  },
});
