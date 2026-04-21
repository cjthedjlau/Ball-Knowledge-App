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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import MidnightCountdown from '../../components/MidnightCountdown';
import { brand, dark, light, fonts, colors, darkColors, fontFamily, spacing, radius } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import RoundProgressDots from '../../screens/components/ui/RoundProgressDots';
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';
import GhostButton from '../../screens/components/ui/GhostButton';
import { type Tab } from '../components/ui/BottomNav';
import { updateUserXPAndStreak } from '../../lib/xp';
import { supabase } from '../../lib/supabase';
import { getTodaysDailyGame, getArchiveGame } from '../../lib/dailyGames';
import { getGameResultToday, saveGameResult as saveCompletionResult, getTodayEST } from '../../lib/gameResults';
import { updatePlayHour } from '../../lib/notifications';
import { shareRank5 } from '../../lib/shareResults';
import { useGameAnalytics } from '../../lib/analytics';

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
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const s = createStyles(isDark);
  const { trackGameStart, trackGameComplete, trackGameAbandoned } = useGameAnalytics();
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
    trackGameStart('blind-rank-5', selectedLeague);
  }, [selectedLeague]);

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
      // Mark as played immediately so re-mount shows "already played"
      if (!isArchive) {
        setPlayedTodayCache(prev => ({ ...prev, [selectedLeague]: { score: 1, xp: FLAT_XP } }));
        void updatePlayHour();
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // ── Finish game ────────────────────────────────────────────────────────────

  const finishGame = async (finalPlacements: (string | null)[], ld: LeagueData) => {
    const rankingResult = finalPlacements.join(',');
    const today = getTodayEST();
    trackGameComplete('blind-rank-5', selectedLeague, 1, FLAT_XP);

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
            xp_earned: FLAT_XP,
            completed: true,
            ranking_result: rankingResult,
          },
          { onConflict: 'user_id,game_type,league,date' },
        );
        await updateUserXPAndStreak(user.id, FLAT_XP, true);
      }
      // Also save via standard completion path for Home screen detection
      void saveCompletionResult(selectedLeague, 'blind-rank-5', 1, FLAT_XP);
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
    <View style={s.root}>
      <ScrollView
        contentContainerStyle={[s.zone2Content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
      {/* ── Zone 1 ── */}
      <View style={[s.zone1, { paddingTop: insets.top + 16, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }]}>
        <View style={s.zone1TopRow}>
          <Pressable onPress={() => { if (!gameComplete) trackGameAbandoned('blind-rank-5', selectedLeague); onBack(); }} hitSlop={8} style={s.backBtn}>
            <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
          </Pressable>
        </View>

        <View style={s.zone1Center}>
          <Text style={s.zone1Title}>BLIND RANK 5</Text>
          {leagueData && (
            <View style={s.zone1CategoryBanner}>
              <Text style={s.zone1CategoryLabel}>RANK BY</Text>
              <Text style={s.zone1CategoryValue}>{leagueData.categoryPrompt}</Text>
            </View>
          )}
          {!isCompleted && !alreadyPlayedToday && leagueData && (
            <>
              <View style={s.dotsRow}>
                <RoundProgressDots total={TOTAL_PLAYERS} current={currentIndex + 1} />
              </View>
              <Text style={s.zone1Counter}>
                PLAYER {currentIndex + 1} OF {TOTAL_PLAYERS}
              </Text>
            </>
          )}
        </View>

        {isArchive ? (
          <View style={s.archiveBanner}>
            <Text style={s.archiveBannerText}>ARCHIVE — {archiveDate}</Text>
          </View>
        ) : (
          <View style={s.switcherRow}>
            <LeagueSwitcher selected={selectedLeague} onChange={handleLeagueChange} />
          </View>
        )}
      </View>
        {isLoading ? (
          <View style={s.centerState}>
            <ActivityIndicator size="large" color={colors.brand} />
          </View>

        ) : (loadError || !leagueData) ? (
          <View style={s.centerState}>
            <Text style={s.errorText}>No game available today</Text>
          </View>

        ) : (!isArchive && alreadyPlayedToday) ? (
          <View style={s.alreadyPlayedCard}>
            <Text style={s.alreadyPlayedBadge}>ALREADY PLAYED TODAY</Text>
            <Text style={s.alreadyPlayedXp}>+{playedTodayCache[selectedLeague]!.xp} XP</Text>
            <View style={s.alreadyPlayedDivider} />
            <Text style={s.alreadyPlayedCta}>COME BACK TOMORROW</Text>
            <Text style={s.alreadyPlayedSub}>
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
              <View style={s.playerCard}>
                <Text style={s.playerCardName}>{currentPlayer.name}</Text>
                <Text style={s.playerCardHint}>TAP A SLOT TO PLACE</Text>
              </View>
            )}

            {/* 5 slot buttons */}
            <View style={s.slotsContainer}>
              {Array.from({ length: TOTAL_PLAYERS }, (_, i) => {
                const filled = placements[i];
                if (filled) {
                  return (
                    <View key={i} style={[s.slot, s.slotFilled]}>
                      <View style={s.slotRankBadge}>
                        <Text style={s.slotRankNum}>{i + 1}</Text>
                      </View>
                      <View style={s.slotFilledContent}>
                        <Text style={s.slotFilledName} numberOfLines={1}>{filled}</Text>
                        <Text style={s.slotLockedLabel}>LOCKED</Text>
                      </View>
                    </View>
                  );
                }
                return (
                  <Pressable
                    key={i}
                    onPress={() => { void handleSlotTap(i); }}
                    style={({ pressed }) => [
                      s.slot,
                      s.slotEmpty,
                      pressed && s.slotPressed,
                    ]}
                  >
                    <View style={s.slotRankBadgeEmpty}>
                      <Text style={s.slotRankNumEmpty}>{i + 1}</Text>
                    </View>
                    <Text style={s.slotEmptyLabel}>TAP TO PLACE</Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </View>
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
  const { isDark } = useTheme();
  const s = createStyles(isDark);

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
        <View style={s.xpCard}>
          <Text style={s.xpCardLabel}>XP EARNED</Text>
          <Text style={s.xpCardTotal}>+{FLAT_XP}</Text>
        </View>
      )}

      {/* Community comparison */}
      <Text style={s.sectionLabel}>YOUR RANKING</Text>

      {result.placements.map((name, idx) => {
        if (!name) return null;
        const slot = result.communitySlots?.[idx];
        const topEntry = slot?.entries[0];
        const userEntry = slot?.entries.find(e => e.name === name);
        const userPct = userEntry?.pct ?? 0;
        const isTopPick = topEntry?.name === name && (slot?.entries.length ?? 0) > 0;

        return (
          <View key={idx} style={s.resultSlot}>
            <View style={s.resultSlotHeader}>
              <View style={s.resultRankBadge}>
                <Text style={s.resultRankNum}>{idx + 1}</Text>
              </View>
              <View style={s.resultSlotInfo}>
                <Text style={s.resultSlotName} numberOfLines={1}>{name}</Text>
              </View>
              {isTopPick && (
                <View style={s.mostCommonBadge}>
                  <Text style={s.mostCommonText}>MOST COMMON</Text>
                </View>
              )}
            </View>
            <View style={s.resultBarSection}>
              {result.communitySlots === null ? (
                <Text style={s.communityLoading}>Loading community data…</Text>
              ) : (slot?.entries.length ?? 0) > 0 ? (
                <>
                  <View style={s.barBg}>
                    <View style={[s.barFill, { width: `${userPct}%` as any }]} />
                  </View>
                  <Text style={s.barPct}>{userPct}% placed here</Text>
                </>
              ) : (
                <Text style={s.communityLoading}>No community data yet</Text>
              )}
            </View>
          </View>
        );
      })}

      {isArchive && (
        <Text style={s.archiveNotice}>ARCHIVE MODE — Results not saved</Text>
      )}

      {!isArchive && <MidnightCountdown />}

      <View style={s.resultButtons}>
        <Pressable
          onPress={() => { void shareRank5(selectedLeague, matchCount, TOTAL_PLAYERS); }}
          style={({ pressed }) => [s.shareBtn, pressed && s.shareBtnPressed]}
        >
          <Text style={s.shareBtnText}>SHARE RESULTS</Text>
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

function createStyles(isDark: boolean) {
  const txt = isDark ? dark.textPrimary : light.textPrimary;
  const txtSec = isDark ? dark.textSecondary : light.textSecondary;
  const cardBg = isDark ? dark.card : light.card;
  const surfaceBg = isDark ? dark.surface : light.surface;
  const borderCol = isDark ? dark.cardBorder : light.cardBorder;
  const dividerCol = isDark ? dark.divider : light.divider;

  return StyleSheet.create({
    root: { flex: 1, backgroundColor: 'transparent' },

    // Zone 1
    zone1: { backgroundColor: brand.primary, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
    zone1TopRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
    backBtn: { padding: spacing.sm, marginLeft: -spacing.sm },
    zone1Center: { alignItems: 'center', marginTop: spacing.xs },
    zone1Title: { fontFamily: fonts.display, fontSize: 24, color: '#FFFFFF', letterSpacing: 3, textAlign: 'center' },
    zone1CategoryBanner: { backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: radius.primary, paddingVertical: 10, paddingHorizontal: 20, marginTop: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.20)' },
    zone1CategoryLabel: { fontFamily: fonts.bodySemiBold, fontSize: 10, color: 'rgba(255,255,255,0.60)', letterSpacing: 2, marginBottom: 2 },
    zone1CategoryValue: { fontFamily: fonts.display, fontSize: 18, color: '#FFFFFF', letterSpacing: 1, textAlign: 'center' },
    dotsRow: { marginTop: spacing.md },
    zone1Counter: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: 'rgba(255,255,255,0.80)', letterSpacing: 2, marginTop: spacing.xs },
    switcherRow: { marginTop: spacing.lg },

    // Zone 2
    zone2: { flex: 1, backgroundColor: 'transparent' },
    zone2Content: { paddingHorizontal: spacing.lg, paddingTop: spacing['2xl'], paddingBottom: 0, gap: spacing.md },

    centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
    errorText: { fontFamily: fonts.bodyMedium, fontSize: 15, color: txtSec, textAlign: 'center' },

    // Current player card
    playerCard: { backgroundColor: cardBg, borderRadius: radius.primary, paddingVertical: spacing['3xl'], paddingHorizontal: spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: borderCol, marginBottom: 4 },
    playerCardName: { fontFamily: fonts.display, fontSize: 28, color: txt, textAlign: 'center', letterSpacing: 0.5 },
    playerCardHint: { fontFamily: fonts.bodyMedium, fontSize: 11, color: txtSec, letterSpacing: 2, marginTop: spacing.sm },

    // Slot buttons
    slotsContainer: { gap: spacing.sm },
    slot: { borderRadius: radius.primary, flexDirection: 'row', alignItems: 'center', minHeight: 56, paddingVertical: spacing.md, paddingHorizontal: spacing.md, gap: spacing.md },
    slotEmpty: { backgroundColor: cardBg, borderWidth: 1.5, borderStyle: 'dashed', borderColor: isDark ? 'rgba(252,52,92,0.35)' : 'rgba(252,52,92,0.25)' },
    slotFilled: { backgroundColor: cardBg, borderLeftWidth: 3, borderLeftColor: brand.primary, borderWidth: 1, borderColor: borderCol },
    slotPressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
    slotRankBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: brand.primary, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    slotRankNum: { fontFamily: fonts.display, fontSize: 14, color: '#FFFFFF' },
    slotRankBadgeEmpty: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, borderColor: isDark ? 'rgba(252,52,92,0.50)' : 'rgba(252,52,92,0.35)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    slotRankNumEmpty: { fontFamily: fonts.display, fontSize: 14, color: brand.primary },
    slotFilledContent: { flex: 1 },
    slotFilledName: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: txt },
    slotLockedLabel: { fontFamily: fonts.bodyMedium, fontSize: 10, color: txtSec, letterSpacing: 1.5, marginTop: 2 },
    slotEmptyLabel: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: isDark ? 'rgba(252,52,92,0.60)' : 'rgba(252,52,92,0.50)', letterSpacing: 1, flex: 1, textAlign: 'center' },

    // Results
    xpCard: { backgroundColor: cardBg, borderRadius: radius.primary, paddingVertical: spacing.xl, paddingHorizontal: spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: borderCol },
    xpCardLabel: { fontFamily: fonts.bodySemiBold, fontSize: 10, letterSpacing: 2, color: txtSec, marginBottom: spacing.xs },
    xpCardTotal: { fontFamily: fonts.display, fontSize: 48, color: brand.primary, lineHeight: 54 },
    sectionLabel: { fontFamily: fonts.bodySemiBold, fontSize: 10, letterSpacing: 2, color: txtSec, marginTop: spacing.xs, marginBottom: -spacing.xs },
    resultSlot: { backgroundColor: cardBg, borderRadius: radius.primary, overflow: 'hidden', borderLeftWidth: 3, borderLeftColor: brand.primary, borderWidth: 1, borderColor: borderCol },
    resultSlotHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md, gap: spacing.md },
    resultRankBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: brand.primary, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    resultRankNum: { fontFamily: fonts.display, fontSize: 14, color: '#FFFFFF' },
    resultSlotInfo: { flex: 1 },
    resultSlotName: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: txt },
    mostCommonBadge: { backgroundColor: 'rgba(7,188,204,0.15)', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, flexShrink: 0 },
    mostCommonText: { fontFamily: fonts.bodySemiBold, fontSize: 9, color: colors.accentCyan, letterSpacing: 0.8 },
    resultBarSection: { paddingHorizontal: spacing.md, paddingBottom: spacing.md, gap: 6 },
    barBg: { height: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden' },
    barFill: { height: 4, backgroundColor: brand.primary, borderRadius: 2 },
    barPct: { fontFamily: fonts.bodyMedium, fontSize: 11, color: txtSec },
    communityLoading: { fontFamily: fonts.bodyMedium, fontSize: 11, color: txtSec },
    resultButtons: { gap: spacing.md, marginTop: spacing.sm },

    // Already played
    alreadyPlayedCard: { backgroundColor: cardBg, borderRadius: 24, padding: spacing['3xl'], alignItems: 'center', gap: spacing.md, borderWidth: 1, borderColor: borderCol },
    alreadyPlayedBadge: { fontFamily: fonts.bodySemiBold, fontSize: 10, letterSpacing: 2, color: brand.primary, textAlign: 'center' },
    alreadyPlayedXp: { fontFamily: fonts.display, fontSize: 48, color: brand.primary, lineHeight: 54 },
    alreadyPlayedDivider: { width: '100%' as any, height: 1, backgroundColor: dividerCol, marginVertical: spacing.xs },
    alreadyPlayedCta: { fontFamily: fonts.display, fontSize: 18, color: txt, letterSpacing: 2, textAlign: 'center' },
    alreadyPlayedSub: { fontFamily: fonts.bodyMedium, fontSize: 13, color: txtSec, textAlign: 'center', lineHeight: 20 },

    // Archive
    archiveBanner: { backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 8, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, alignSelf: 'center', marginTop: spacing.lg },
    archiveBannerText: { fontFamily: fonts.bodySemiBold, fontSize: 11, color: 'rgba(255,255,255,0.85)', letterSpacing: 1.5, textAlign: 'center' },
    archiveNotice: { fontFamily: fonts.bodyMedium, fontSize: 12, color: txtSec, textAlign: 'center', letterSpacing: 1, marginTop: spacing.sm },

    // Share / notify
    shareBtn: { backgroundColor: cardBg, borderRadius: radius.primary, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center', minHeight: 52, borderWidth: 1, borderColor: borderCol },
    shareBtnPressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
    shareBtnText: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: txt, letterSpacing: 2 },
  });
}

const styles = createStyles(true);
