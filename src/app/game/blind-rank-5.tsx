// NOTE: SQL migration required for ranking_result column:
//   alter table public.user_game_results add column if not exists ranking_result text;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import MidnightCountdown from '../../components/MidnightCountdown';
import { colors, darkColors, fontFamily, spacing } from '../../styles/theme';
import RoundProgressDots from '../../screens/components/ui/RoundProgressDots';
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';
import GhostButton from '../../screens/components/ui/GhostButton';
import { type Tab } from '../components/ui/BottomNav';
import { updateUserXPAndStreak } from '../../lib/xp';
import { supabase } from '../../lib/supabase';
import { getTodaysDailyGame, getArchiveGame } from '../../lib/dailyGames';
import { getGameResultToday } from '../../lib/gameResults';
import { updatePlayHour } from '../../lib/notifications';
import { shareRank5 } from '../../lib/shareResults';
import { notifyFriendsOfResult } from '../../lib/friends';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Player {
  name: string;
}

interface LeagueData {
  categoryPrompt: string;
  players: Player[]; // shuffled reveal order
}

interface CommunitySlot {
  entries: { name: string; pct: number }[];
}

interface CompletedResult {
  // placements[i] = player name placed in rank (i+1), or null if unfilled
  placements: (string | null)[];
  communitySlots: CommunitySlot[] | null;
}

interface Props {
  onBack: () => void;
  onNavigate: (tab: Tab) => void;
  archiveDate?: string;
}

const FLAT_XP = 500;
const TOTAL_PLAYERS = 5;

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildLeagueDataFromSupabase(rawPlayers: any[], categoryPrompt?: string): LeagueData {
  // Preserve the server-defined reveal order — all users must see players in the same sequence
  const players: Player[] = rawPlayers.map(p => ({ name: p.name as string }));
  return {
    categoryPrompt: categoryPrompt ?? rawPlayers[0]?.categoryPrompt ?? 'OVERALL GREATNESS',
    players,
  };
}

function buildCommunitySlots(
  results: { ranking_result: string | null }[],
): CommunitySlot[] {
  const valid = results.filter(r => r.ranking_result);
  const total = valid.length;
  if (total === 0) return Array.from({ length: TOTAL_PLAYERS }, () => ({ entries: [] }));

  const slotCounts: Record<number, Record<string, number>> = {};
  for (let i = 0; i < TOTAL_PLAYERS; i++) slotCounts[i] = {};

  for (const r of valid) {
    const names = (r.ranking_result as string).split(',');
    names.forEach((name, idx) => {
      if (idx < TOTAL_PLAYERS && name) {
        slotCounts[idx][name] = (slotCounts[idx][name] ?? 0) + 1;
      }
    });
  }

  return Array.from({ length: TOTAL_PLAYERS }, (_, i) => ({
    entries: Object.entries(slotCounts[i])
      .map(([name, count]) => ({ name, pct: Math.round((count / total) * 100) }))
      .sort((a, b) => b.pct - a.pct),
  }));
}

function initActiveState(ld: LeagueData) {
  return {
    players: ld.players,
    currentIndex: 0,
    placements: Array<string | null>(TOTAL_PLAYERS).fill(null),
    gameComplete: false,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BlindRank5Screen({ onBack, onNavigate, archiveDate }: Props) {
  const isArchive = !!archiveDate;
  const [selectedLeague, setSelectedLeague] = useState('NBA');

  // Active game state — resets on league switch
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [placements, setPlacements] = useState<(string | null)[]>(Array(TOTAL_PLAYERS).fill(null));
  const [gameComplete, setGameComplete] = useState(false);

  // Per-league results (persisted across league switches in this session)
  const [completedResults, setCompletedResults] = useState<Record<string, CompletedResult>>({});

  // Data cache
  const [leagueDataCache, setLeagueDataCache] = useState<Record<string, LeagueData | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [playedTodayCache, setPlayedTodayCache] = useState<Record<string, { score: number; xp: number } | null>>({});

  useEffect(() => {
    setIsLoading(true);
    setLoadError(false);

    const checkCompletion = isArchive
      ? Promise.resolve()
      : getGameResultToday(selectedLeague, 'blind-rank-5').then(priorResult => {
          setPlayedTodayCache(prev => ({ ...prev, [selectedLeague]: priorResult }));
        });

    if (leagueDataCache[selectedLeague] !== undefined) {
      void checkCompletion.then(() => setIsLoading(false));
      // Restore active state if no prior result
      const cached = leagueDataCache[selectedLeague];
      if (cached && !completedResults[selectedLeague]) {
        const state = initActiveState(cached);
        setPlayers(state.players);
        setCurrentIndex(state.currentIndex);
        setPlacements(state.placements);
        setGameComplete(state.gameComplete);
      }
      return;
    }

    const fetchGame = isArchive
      ? getArchiveGame(selectedLeague, archiveDate!)
      : getTodaysDailyGame(selectedLeague);

    void Promise.all([
      fetchGame,
      checkCompletion,
    ]).then(([data]) => {
      setIsLoading(false);
      if (!data?.blind_rank_players) {
        setLoadError(true);
        setLeagueDataCache(prev => ({ ...prev, [selectedLeague]: null }));
        return;
      }
      const ld = buildLeagueDataFromSupabase(
        data.blind_rank_players,
        data.blind_rank_category as string | undefined,
      );
      setLeagueDataCache(prev => ({ ...prev, [selectedLeague]: ld }));
      if (!completedResults[selectedLeague]) {
        const state = initActiveState(ld);
        setPlayers(state.players);
        setCurrentIndex(state.currentIndex);
        setPlacements(state.placements);
        setGameComplete(state.gameComplete);
      }
    });
  }, [selectedLeague]);

  const leagueData = leagueDataCache[selectedLeague];
  const isCompleted = gameComplete || !!completedResults[selectedLeague];
  const result = completedResults[selectedLeague];
  const alreadyPlayedToday = !!playedTodayCache[selectedLeague] && !gameComplete && !completedResults[selectedLeague];

  const currentPlayer = players[currentIndex] ?? null;

  // ── League switch ──────────────────────────────────────────────────────────

  const handleLeagueChange = (league: string) => {
    if (league === selectedLeague) return;
    setSelectedLeague(league);
    // Active game state reset is handled in the useEffect
  };

  // ── Slot tap ───────────────────────────────────────────────────────────────

  const handleSlotTap = async (slotIndex: number) => {
    if (placements[slotIndex] !== null) return; // slot already filled
    if (gameComplete || !leagueData || !currentPlayer) return;

    const newPlacements = [...placements];
    newPlacements[slotIndex] = currentPlayer.name;
    setPlacements(newPlacements);

    const isLast = currentIndex === TOTAL_PLAYERS - 1;
    if (isLast) {
      setGameComplete(true);
      await finishGame(newPlacements, leagueData);
      if (!isArchive) void updatePlayHour();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // ── Finish game ────────────────────────────────────────────────────────────

  const finishGame = async (finalPlacements: (string | null)[], ld: LeagueData) => {
    const rankingResult = finalPlacements.join(',');
    const today = new Date().toISOString().split('T')[0];

    // Set result immediately with null community while we fetch
    setCompletedResults(prev => ({
      ...prev,
      [selectedLeague]: { placements: finalPlacements, communitySlots: null },
    }));

    // Persist to DB (skip in archive mode)
    if (!isArchive) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('user_game_results').upsert(
          {
            user_id: user.id,
            game_type: 'blind-rank-5',
            league: selectedLeague,
            date: today,
            score: 1,
            xp: FLAT_XP,
            ranking_result: rankingResult,
          },
          { onConflict: 'user_id,game_type,league,date' },
        );
        await updateUserXPAndStreak(user.id, FLAT_XP, true);
      }
    }

    // Fetch community distribution
    const { data: communityRows } = await supabase
      .from('user_game_results')
      .select('ranking_result')
      .eq('date', today)
      .eq('league', selectedLeague)
      .eq('game_type', 'blind-rank-5')
      .not('ranking_result', 'is', null);

    const slots = buildCommunitySlots(
      (communityRows ?? []) as { ranking_result: string | null }[],
    );
    setCompletedResults(prev => ({
      ...prev,
      [selectedLeague]: {
        placements: prev[selectedLeague]?.placements ?? finalPlacements,
        communitySlots: slots,
      },
    }));
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* ── Zone 1 ── */}
      <View style={styles.zone1}>
        <View style={styles.zone1TopRow}>
          <Pressable onPress={onBack} hitSlop={8} style={styles.backBtn}>
            <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
          </Pressable>
        </View>

        <View style={styles.zone1Center}>
          <Text style={styles.zone1Title}>BLIND RANK 5</Text>
          {leagueData && (
            <View style={styles.zone1CategoryBanner}>
              <Text style={styles.zone1CategoryLabel}>RANK BY</Text>
              <Text style={styles.zone1CategoryValue}>{leagueData.categoryPrompt}</Text>
            </View>
          )}
          {!isCompleted && !alreadyPlayedToday && leagueData && (
            <>
              <View style={styles.dotsRow}>
                <RoundProgressDots total={TOTAL_PLAYERS} current={currentIndex + 1} />
              </View>
              <Text style={styles.zone1Counter}>
                PLAYER {currentIndex + 1} OF {TOTAL_PLAYERS}
              </Text>
            </>
          )}
        </View>

        {isArchive ? (
          <View style={styles.archiveBanner}>
            <Text style={styles.archiveBannerText}>ARCHIVE — {archiveDate}</Text>
          </View>
        ) : (
          <View style={styles.switcherRow}>
            <LeagueSwitcher selected={selectedLeague} onChange={handleLeagueChange} />
          </View>
        )}
      </View>

      {/* ── Zone 2 ── */}
      <ScrollView
        style={styles.zone2}
        contentContainerStyle={styles.zone2Content}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={colors.brand} />
          </View>

        ) : (loadError || !leagueData) ? (
          <View style={styles.centerState}>
            <Text style={styles.errorText}>No game available today</Text>
          </View>

        ) : (!isArchive && alreadyPlayedToday) ? (
          <View style={styles.alreadyPlayedCard}>
            <Text style={styles.alreadyPlayedBadge}>ALREADY PLAYED TODAY</Text>
            <Text style={styles.alreadyPlayedXp}>+{playedTodayCache[selectedLeague]!.xp} XP</Text>
            <View style={styles.alreadyPlayedDivider} />
            <Text style={styles.alreadyPlayedCta}>COME BACK TOMORROW</Text>
            <Text style={styles.alreadyPlayedSub}>
              A new ranking drops every day. Switch leagues to play more.
            </Text>
            <MidnightCountdown />
            <GhostButton label="VIEW ARCHIVE" onPress={() => onNavigate('archive' as Tab)} />
          </View>

        ) : (isCompleted && result) ? (
          <ResultsView result={result} onBack={onBack} isArchive={isArchive} onNavigate={onNavigate} selectedLeague={selectedLeague} />

        ) : (
          <>
            {/* Current player card */}
            {currentPlayer && (
              <View style={styles.playerCard}>
                <Text style={styles.playerCardName}>{currentPlayer.name}</Text>
                <Text style={styles.playerCardHint}>TAP A SLOT TO PLACE</Text>
              </View>
            )}

            {/* 5 slot buttons */}
            <View style={styles.slotsContainer}>
              {Array.from({ length: TOTAL_PLAYERS }, (_, i) => {
                const filled = placements[i];
                if (filled) {
                  return (
                    <View key={i} style={[styles.slot, styles.slotFilled]}>
                      <View style={styles.slotRankBadge}>
                        <Text style={styles.slotRankNum}>{i + 1}</Text>
                      </View>
                      <View style={styles.slotFilledContent}>
                        <Text style={styles.slotFilledName} numberOfLines={1}>{filled}</Text>
                        <Text style={styles.slotLockedLabel}>LOCKED</Text>
                      </View>
                    </View>
                  );
                }
                return (
                  <Pressable
                    key={i}
                    onPress={() => { void handleSlotTap(i); }}
                    style={({ pressed }) => [
                      styles.slot,
                      styles.slotEmpty,
                      pressed && styles.slotPressed,
                    ]}
                  >
                    <View style={styles.slotRankBadgeEmpty}>
                      <Text style={styles.slotRankNumEmpty}>{i + 1}</Text>
                    </View>
                    <Text style={styles.slotEmptyLabel}>TAP TO PLACE</Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Results sub-component ─────────────────────────────────────────────────────

function ResultsView({
  result,
  onBack,
  isArchive,
  onNavigate,
  selectedLeague,
}: {
  result: CompletedResult;
  onBack: () => void;
  isArchive: boolean;
  onNavigate: (tab: Tab) => void;
  selectedLeague: string;
}) {
  const [notifyState, setNotifyState] = useState<'idle' | 'sending' | 'done'>('idle');

  const matchCount = result.communitySlots
    ? result.placements.reduce<number>((count, name, idx) => {
        if (!name) return count;
        const topEntry = result.communitySlots![idx]?.entries[0];
        return topEntry?.name === name ? count + 1 : count;
      }, 0)
    : 0;

  return (
    <>
      {/* XP card (hidden in archive) */}
      {!isArchive && (
        <View style={styles.xpCard}>
          <Text style={styles.xpCardLabel}>XP EARNED</Text>
          <Text style={styles.xpCardTotal}>+{FLAT_XP}</Text>
        </View>
      )}

      {/* Community comparison */}
      <Text style={styles.sectionLabel}>YOUR RANKING</Text>

      {result.placements.map((name, idx) => {
        if (!name) return null;
        const slot = result.communitySlots?.[idx];
        const topEntry = slot?.entries[0];
        const userEntry = slot?.entries.find(e => e.name === name);
        const userPct = userEntry?.pct ?? 0;
        const isTopPick = topEntry?.name === name && (slot?.entries.length ?? 0) > 0;

        return (
          <View key={idx} style={styles.resultSlot}>
            <View style={styles.resultSlotHeader}>
              <View style={styles.resultRankBadge}>
                <Text style={styles.resultRankNum}>{idx + 1}</Text>
              </View>
              <View style={styles.resultSlotInfo}>
                <Text style={styles.resultSlotName} numberOfLines={1}>{name}</Text>
              </View>
              {isTopPick && (
                <View style={styles.mostCommonBadge}>
                  <Text style={styles.mostCommonText}>MOST COMMON</Text>
                </View>
              )}
            </View>
            <View style={styles.resultBarSection}>
              {result.communitySlots === null ? (
                <Text style={styles.communityLoading}>Loading community data…</Text>
              ) : (slot?.entries.length ?? 0) > 0 ? (
                <>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${userPct}%` as any }]} />
                  </View>
                  <Text style={styles.barPct}>{userPct}% placed here</Text>
                </>
              ) : (
                <Text style={styles.communityLoading}>No community data yet</Text>
              )}
            </View>
          </View>
        );
      })}

      {isArchive && (
        <Text style={styles.archiveNotice}>ARCHIVE MODE — Results not saved</Text>
      )}

      {!isArchive && <MidnightCountdown />}

      <View style={styles.resultButtons}>
        <Pressable
          onPress={() => { void shareRank5(selectedLeague, matchCount, TOTAL_PLAYERS); }}
          style={({ pressed }) => [styles.shareBtn, pressed && styles.shareBtnPressed]}
        >
          <Text style={styles.shareBtnText}>SHARE RESULTS</Text>
        </Pressable>
        {/* Notify Friends button */}
        <Pressable
          style={({ pressed }) => [styles.notifyBtn, pressed && styles.notifyBtnPressed, notifyState === 'done' && styles.notifyBtnDone]}
          onPress={() => { void (async () => {
            if (notifyState !== 'idle') return;
            setNotifyState('sending');
            await notifyFriendsOfResult('Blind Rank 5', selectedLeague, `${matchCount}/${TOTAL_PLAYERS} crowd matches`);
            setNotifyState('done');
            setTimeout(() => setNotifyState('idle'), 3000);
          })(); }}
          disabled={notifyState === 'sending'}
        >
          <Text style={styles.notifyBtnText}>
            {notifyState === 'sending' ? 'NOTIFYING...' : notifyState === 'done' ? 'FRIENDS NOTIFIED ✓' : 'NOTIFY FRIENDS'}
          </Text>
        </Pressable>
        <GhostButton label="Back to Games" onPress={onBack} />
        {!isArchive && (
          <GhostButton label="PLAY ARCHIVE" onPress={() => onNavigate('archive' as Tab)} />
        )}
      </View>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // ── Zone 1 ────────────────────────────────────────────────────────────────
  zone1: {
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  zone1TopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  backBtn: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
  },
  zone1Center: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  zone1Title: {
    fontFamily: fontFamily.black,
    fontSize: 24,
    color: colors.white,
    letterSpacing: 3,
    textAlign: 'center',
  },
  zone1CategoryBanner: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
  },
  zone1CategoryLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 10,
    color: 'rgba(255,255,255,0.60)',
    letterSpacing: 2,
    marginBottom: 2,
  },
  zone1CategoryValue: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 18,
    color: colors.white,
    letterSpacing: 1,
    textAlign: 'center',
  },
  dotsRow: {
    marginTop: spacing.md,
  },
  zone1Counter: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
    color: 'rgba(255,255,255,0.80)',
    letterSpacing: 2,
    marginTop: spacing.xs,
  },
  switcherRow: {
    marginTop: spacing.lg,
  },

  // ── Zone 2 ────────────────────────────────────────────────────────────────
  zone2: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.10)',
  },
  zone2Content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing['4xl'],
    gap: spacing.md,
  },

  // Loading / error
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  errorText: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: '#9A9A9A',
    textAlign: 'center',
  },

  // ── Current player card ────────────────────────────────────────────────────
  playerCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    paddingVertical: spacing['3xl'],
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    // 3D raised effect
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.70)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.40)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.60,
    shadowRadius: 10,
    elevation: 14,
    marginBottom: 4,
  },
  playerCardName: {
    fontFamily: fontFamily.black,
    fontSize: 28,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  playerCardHint: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.40)',
    letterSpacing: 2,
    marginTop: spacing.sm,
  },

  // ── Slot buttons ───────────────────────────────────────────────────────────
  slotsContainer: {
    gap: spacing.sm,
  },
  slot: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  slotEmpty: {
    backgroundColor: darkColors.surfaceElevated,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(252,52,92,0.35)',
  },
  slotFilled: {
    backgroundColor: darkColors.surfaceElevated,
    borderLeftWidth: 3,
    borderLeftColor: colors.brand,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.50)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  slotPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  slotRankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  slotRankNum: {
    fontFamily: fontFamily.black,
    fontSize: 14,
    color: colors.white,
  },
  slotRankBadgeEmpty: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(252,52,92,0.50)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  slotRankNumEmpty: {
    fontFamily: fontFamily.black,
    fontSize: 14,
    color: colors.brand,
  },
  slotFilledContent: {
    flex: 1,
  },
  slotFilledName: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    color: colors.white,
  },
  slotLockedLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  slotEmptyLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
    color: 'rgba(252,52,92,0.60)',
    letterSpacing: 1,
    flex: 1,
    textAlign: 'center',
  },

  // ── Results ────────────────────────────────────────────────────────────────
  xpCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.50)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.40,
    shadowRadius: 8,
    elevation: 8,
  },
  xpCardLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    letterSpacing: 2,
    color: '#9A9A9A',
    marginBottom: spacing.xs,
  },
  xpCardTotal: {
    fontFamily: fontFamily.black,
    fontSize: 48,
    color: colors.brand,
    lineHeight: 54,
  },
  sectionLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    letterSpacing: 2,
    color: '#9A9A9A',
    marginTop: spacing.xs,
    marginBottom: -spacing.xs,
  },
  resultSlot: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 12,
    overflow: 'hidden',
    borderLeftWidth: 3,
    borderLeftColor: colors.brand,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.50)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  resultSlotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  resultRankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  resultRankNum: {
    fontFamily: fontFamily.black,
    fontSize: 14,
    color: colors.white,
  },
  resultSlotInfo: {
    flex: 1,
  },
  resultSlotName: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    color: colors.white,
  },
  mostCommonBadge: {
    backgroundColor: 'rgba(7,188,204,0.15)',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    flexShrink: 0,
  },
  mostCommonText: {
    fontFamily: fontFamily.bold,
    fontSize: 9,
    color: colors.accentCyan,
    letterSpacing: 0.8,
  },
  resultBarSection: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: 6,
  },
  barBg: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: 4,
    backgroundColor: colors.brand,
    borderRadius: 2,
  },
  barPct: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    color: '#9A9A9A',
  },
  communityLoading: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    color: '#9A9A9A',
  },
  resultButtons: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },

  // ── Already played today ───────────────────────────────────────────────────
  alreadyPlayedCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 24,
    padding: spacing['3xl'],
    alignItems: 'center',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.50)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.50,
    shadowRadius: 16,
    elevation: 12,
  },
  alreadyPlayedBadge: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    letterSpacing: 2,
    color: colors.brand,
    textAlign: 'center',
  },
  alreadyPlayedXp: {
    fontFamily: fontFamily.black,
    fontSize: 48,
    color: colors.brand,
    lineHeight: 54,
  },
  alreadyPlayedDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: spacing.xs,
  },
  alreadyPlayedCta: {
    fontFamily: fontFamily.black,
    fontSize: 18,
    color: colors.white,
    letterSpacing: 2,
    textAlign: 'center',
  },
  alreadyPlayedSub: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: '#9A9A9A',
    textAlign: 'center',
    lineHeight: 20,
  },

  // ── Archive ──────────────────────────────────────────────────────────────
  archiveBanner: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignSelf: 'center',
    marginTop: spacing.lg,
  },
  archiveBannerText: {
    fontFamily: fontFamily.bold,
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  archiveNotice: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: '#9A9A9A',
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: spacing.sm,
  },

  // ── Share button ──────────────────────────────────────────────────────────
  shareBtn: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.10)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.50)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  shareBtnPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  shareBtnText: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.white,
    letterSpacing: 2,
  },
  notifyBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: 12,
  },
  notifyBtnPressed: {
    opacity: 0.7,
  },
  notifyBtnDone: {
    borderColor: 'rgba(0,200,151,0.40)',
    backgroundColor: 'rgba(0,200,151,0.08)',
  },
  notifyBtnText: {
    fontFamily: fontFamily.black,
    fontWeight: '900' as const,
    fontSize: 15,
    color: '#F5F5F5',
    letterSpacing: 2,
  },
});
