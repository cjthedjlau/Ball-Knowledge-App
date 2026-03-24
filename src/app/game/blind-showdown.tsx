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
import { ArrowLeft, User, Calendar } from 'lucide-react-native';
import MidnightCountdown from '../../components/MidnightCountdown';
import { colors, darkColors, fontFamily, spacing } from '../../styles/theme';
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';
import GhostButton from '../../screens/components/ui/GhostButton';
import { type Tab } from '../components/ui/BottomNav';
import { calculateDailyGameXP, saveGameResult, updateUserXPAndStreak } from '../../lib/xp';
import { shareShowdown } from '../../lib/shareResults';
import { notifyFriendsOfResult } from '../../lib/friends';
import { supabase } from '../../lib/supabase';
import { getTodaysDailyGame, getArchiveGame } from '../../lib/dailyGames';
import { saveGameResult as saveCompletionResult, getGameResultToday } from '../../lib/gameResults';
import { updatePlayHour } from '../../lib/notifications';

// ── Types ────────────────────────────────────────────────────────────────────

interface ShowdownPlayer {
  name: string;
  team: string;
  stats: { label: string; value: string }[];
}

interface Matchup {
  categoryLabel: string;
  playerA: ShowdownPlayer;
  playerB: ShowdownPlayer;
}

interface Props {
  onBack: () => void;
  onNavigate: (tab: Tab) => void;
  archiveDate?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildMatchupFromData(data: any): Matchup {
  const rawA = data.showdown_player_a ?? {};
  const rawB = data.showdown_player_b ?? {};
  const toStats = (raw: any) =>
    Object.entries(raw.stats ?? {}).map(([k, v]) => ({ label: k.toUpperCase(), value: String(v) }));
  return {
    categoryLabel: data.showdown_category ?? '',
    playerA: { name: rawA.name ?? '', team: rawA.team ?? '', stats: toStats(rawA) },
    playerB: { name: rawB.name ?? '', team: rawB.team ?? '', stats: toStats(rawB) },
  };
}

// ── Component ────────────────────────────────────────────────────────────────

export default function BlindShowdownScreen({ onBack, archiveDate }: Props) {
  const isArchive = !!archiveDate;
  const [selectedLeague, setSelectedLeague] = useState('NBA');
  // Per-league pick: null = not picked, 'A' | 'B' = picked
  const [picks, setPicks] = useState<Record<string, 'A' | 'B'>>({});
  // Per-league reveal status
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  // Per-league XP earned
  const [xpEarnedMap, setXpEarnedMap] = useState<Record<string, number>>({});
  // Fetched matchup cache per league
  const [matchupsCache, setMatchupsCache] = useState<Record<string, Matchup | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [playedTodayCache, setPlayedTodayCache] = useState<Record<string, { score: number; xp: number } | null>>({});
  const [communityVotes, setCommunityVotes] = useState<Record<string, { percentA: number; percentB: number } | null>>({});
  const [notifyState, setNotifyState] = useState<'idle' | 'sending' | 'done'>('idle');

  useEffect(() => {
    setIsLoading(true);
    setLoadError(false);

    const checkCompletion = isArchive
      ? Promise.resolve()
      : getGameResultToday(selectedLeague, 'showdown').then(priorResult => {
          setPlayedTodayCache(prev => ({ ...prev, [selectedLeague]: priorResult }));
        });

    if (matchupsCache[selectedLeague] !== undefined) {
      void checkCompletion.then(() => setIsLoading(false));
      return;
    }

    const fetchGame = isArchive
      ? getArchiveGame(selectedLeague, archiveDate ?? '')
      : getTodaysDailyGame(selectedLeague);

    void Promise.all([
      fetchGame,
      checkCompletion,
    ]).then(([data]) => {
      setIsLoading(false);
      if (!data) {
        setLoadError(true);
        setMatchupsCache(prev => ({ ...prev, [selectedLeague]: null }));
        return;
      }
      setMatchupsCache(prev => ({ ...prev, [selectedLeague]: buildMatchupFromData(data) }));
    });
  }, [selectedLeague]);

  const matchup = matchupsCache[selectedLeague];
  const selectedSide = picks[selectedLeague] ?? null;
  const isRevealed = revealed[selectedLeague] ?? false;

  // Auto-reveal 800ms after selection + fire XP + fetch community votes
  useEffect(() => {
    if (!selectedSide || isRevealed) return;
    const timer = setTimeout(() => {
      setRevealed(prev => ({ ...prev, [selectedLeague]: true }));
      const xp = calculateDailyGameXP('showdown', { correctPick: false });
      setXpEarnedMap(prev => ({ ...prev, [selectedLeague]: xp }));
      const pickedScore = selectedSide === 'A' ? 0 : 1;
      if (!isArchive) {
        void (async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await saveGameResult(user.id, 'showdown', xp, pickedScore);
            await updateUserXPAndStreak(user.id, xp, true);
          }
        })();
        void saveCompletionResult(selectedLeague, 'showdown', pickedScore, xp);
        void updatePlayHour();
      }
      // Fetch community vote split
      const today = new Date().toISOString().split('T')[0];
      void supabase
        .from('user_game_results')
        .select('score')
        .eq('date', today)
        .eq('league', selectedLeague)
        .eq('game_type', 'showdown')
        .then(({ data }) => {
          if (!data || data.length === 0) {
            setCommunityVotes(prev => ({ ...prev, [selectedLeague]: { percentA: 50, percentB: 50 } }));
            return;
          }
          const totalVotes = data.length;
          const votesA = data.filter(r => r.score === 0).length;
          const percentA = Math.round((votesA / totalVotes) * 100);
          const percentB = 100 - percentA;
          setCommunityVotes(prev => ({ ...prev, [selectedLeague]: { percentA, percentB } }));
        });
    }, 800);
    return () => clearTimeout(timer);
  }, [selectedSide, selectedLeague]);

  const handleSelect = (side: 'A' | 'B') => {
    if (selectedSide || isRevealed) return;
    setPicks(prev => ({ ...prev, [selectedLeague]: side }));
  };

  // ── Player card render ──────────────────────────────────────────────────

  const renderCard = (side: 'A' | 'B') => {
    const player = side === 'A' ? matchup.playerA : matchup.playerB;
    const isSelected = selectedSide === side;
    const votes = communityVotes[selectedLeague];
    const pct = votes ? (side === 'A' ? votes.percentA : votes.percentB) : null;

    const cardStyleList = [
      styles.card,
      selectedSide && isSelected && styles.cardSelected,
      selectedSide && !isSelected && styles.cardDimmed,
    ].filter(Boolean) as object[];

    return (
      <Pressable
        style={({ pressed }) => [
          ...cardStyleList,
          pressed && !selectedSide && styles.cardPressed,
        ]}
        onPress={() => handleSelect(side)}
        disabled={!!selectedSide}
      >
        {/* Side label */}
        <Text style={styles.cardSideLabel}>PLAYER {side}</Text>

        {/* Silhouette */}
        <View style={styles.silhouetteWrapper}>
          <View style={styles.silhouette}>
            <User size={28} color='#9A9A9A' strokeWidth={1.5} />
          </View>
        </View>

        {/* Player name — hidden until reveal */}
        {isRevealed ? (
          <Text style={styles.playerName} numberOfLines={2}>
            {player.name}
          </Text>
        ) : (
          <View style={styles.namePlaceholder} />
        )}

        {/* Community vote — shown after reveal */}
        {isRevealed && pct !== null ? (
          <Text style={styles.communityPct}>{pct}% picked</Text>
        ) : isRevealed ? (
          <Text style={styles.communityPct}>—</Text>
        ) : null}

        {/* Stats — always visible */}
        <View style={styles.statsBlock}>
          {player.stats.map(({ label, value }) => (
            <View key={label} style={styles.statRow}>
              <Text style={styles.statLabel}>{label}</Text>
              <Text style={styles.statValue}>{value}</Text>
            </View>
          ))}
        </View>
      </Pressable>
    );
  };

  // ── Render ───────────────────────────────────────────────────────────────

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
          <Text style={styles.zone1Title}>SHOWDOWN</Text>
          <Text style={styles.zone1Sub}>One matchup per league, per day</Text>
        </View>

        {isArchive ? (
          <View style={styles.archiveBanner}>
            <Text style={styles.archiveBannerText}>ARCHIVE — {archiveDate}</Text>
          </View>
        ) : (
          <View style={styles.switcherRow}>
            <LeagueSwitcher selected={selectedLeague} onChange={setSelectedLeague} />
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
            <ActivityIndicator size="large" color="#FC345C" />
          </View>
        ) : (loadError || !matchup) ? (
          <View style={styles.centerState}>
            <Text style={styles.errorText}>No game available today</Text>
          </View>
        ) : (!isArchive && playedTodayCache[selectedLeague]) ? (
          <View style={styles.alreadyPlayedCard}>
            <Text style={styles.alreadyPlayedBadge}>ALREADY PLAYED TODAY</Text>
            <Text style={styles.alreadyPlayedScore}>
            PLAYER {(playedTodayCache[selectedLeague]?.score ?? 0) === 0 ? 'A' : 'B'}
          </Text>
            <View style={styles.alreadyPlayedXpRow}>
              <Text style={styles.alreadyPlayedXpLabel}>XP EARNED</Text>
              <Text style={styles.alreadyPlayedXp}>+{playedTodayCache[selectedLeague]?.xp ?? 0}</Text>
            </View>
            <View style={styles.alreadyPlayedDivider} />
            <Text style={styles.alreadyPlayedCta}>COME BACK TOMORROW</Text>
            <Text style={styles.alreadyPlayedSub}>A new matchup drops every day. Switch leagues to play more.</Text>
            <MidnightCountdown />
            <GhostButton label="VIEW ARCHIVE" onPress={() => onNavigate('archive' as Tab)} />
          </View>
        ) : (<>
        {/* Category label — only shown after reveal to avoid spoiling identities */}
        {isRevealed && matchup.categoryLabel ? (
          <Text style={styles.categoryLabel}>{matchup.categoryLabel}</Text>
        ) : null}

        {/* Cards row */}
        <View style={styles.cardsRow}>
          {renderCard('A')}

          {/* VS badge */}
          <View style={styles.vsBadge}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          {renderCard('B')}
        </View>

        {/* Post-reveal area */}
        {isRevealed && (
          <View style={styles.revealSection}>
            {/* Community agreement */}
            <Text style={styles.communityAgreement}>
              {communityVotes[selectedLeague]
                ? `${selectedSide === 'A' ? (communityVotes[selectedLeague]?.percentA ?? 0) : (communityVotes[selectedLeague]?.percentB ?? 0)}% of fans made the same pick`
                : 'Counting votes...'}
            </Text>

            {/* Share button */}
            <Pressable
              style={({ pressed }) => [
                styles.shareBtn,
                pressed && styles.shareBtnPressed,
              ]}
              onPress={() => {
                const votes = communityVotes[selectedLeague];
                const votePct = selectedSide === 'A'
                  ? (votes?.percentA ?? 50)
                  : (votes?.percentB ?? 50);
                shareShowdown(selectedLeague, false, votePct);
              }}
            >
              <Text style={styles.shareBtnText}>SHARE RESULTS</Text>
            </Pressable>

            {/* Notify Friends button */}
            <Pressable
              style={({ pressed }) => [styles.notifyBtn, pressed && styles.notifyBtnPressed, notifyState === 'done' && styles.notifyBtnDone]}
              onPress={() => { void (async () => {
                if (notifyState !== 'idle') return;
                setNotifyState('sending');
                await notifyFriendsOfResult('Showdown', selectedLeague, selectedSide ? `Picked Player ${selectedSide}` : 'Played');
                setNotifyState('done');
                setTimeout(() => setNotifyState('idle'), 3000);
              })(); }}
              disabled={notifyState === 'sending'}
            >
              <Text style={styles.notifyBtnText}>
                {notifyState === 'sending' ? 'NOTIFYING...' : notifyState === 'done' ? 'FRIENDS NOTIFIED ✓' : 'NOTIFY FRIENDS'}
              </Text>
            </Pressable>

            {/* XP card */}
            {!isArchive && xpEarnedMap[selectedLeague] !== undefined && (
              <View style={styles.xpCard}>
                <Text style={styles.xpCardLabel}>⭐ XP EARNED</Text>
                <Text style={styles.xpCardTotal}>+{xpEarnedMap[selectedLeague]}</Text>
                <Text style={styles.xpCardBreakdown}>
                  Base: 500 XP + Bonus: {xpEarnedMap[selectedLeague] - 500} XP
                </Text>
              </View>
            )}
            {isArchive && (
              <Text style={styles.archiveNotice}>ARCHIVE MODE — Results not saved</Text>
            )}

            {/* Come back tomorrow card */}
            {!isArchive && (
              <View style={styles.tomorrowCard}>
                <View style={styles.tomorrowIconRow}>
                  <Calendar size={20} color={colors.brand} strokeWidth={2} />
                </View>
                <Text style={styles.tomorrowTitle}>COME BACK TOMORROW</Text>
                <Text style={styles.tomorrowSub}>
                  A new matchup drops every day. Switch leagues to play today's other matchups.
                </Text>
                <MidnightCountdown />
              </View>
            )}

            <GhostButton label="Back to Games" onPress={onBack} />
            {!isArchive && (
              <GhostButton label="PLAY ARCHIVE" onPress={() => onNavigate('archive' as Tab)} />
            )}
          </View>
        )}
        </>)}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const CARD_BORDER_RADIUS = 16;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // Zone 1 ─────────────────────────────────────────────────────────────────
  zone1: {
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['4xl'] + 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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
    marginBottom: spacing.lg,
  },
  zone1Title: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 24,
    color: colors.white,
    letterSpacing: 3,
    textAlign: 'center',
  },
  zone1Sub: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 4,
    textAlign: 'center',
  },
  switcherRow: {
    marginTop: spacing.xs,
  },
  archiveBanner: {
    marginTop: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.20)',
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  archiveBannerText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    color: 'rgba(255,255,255,0.80)',
    letterSpacing: 1.5,
  },

  // Zone 2 ─────────────────────────────────────────────────────────────────
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
    fontWeight: '500',
    fontSize: 15,
    color: '#9A9A9A',
    textAlign: 'center',
  },

  // Already played today
  alreadyPlayedCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 24,
    padding: spacing['3xl'],
    alignItems: 'center',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  alreadyPlayedBadge: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 2,
    color: colors.brand,
    textAlign: 'center',
  },
  alreadyPlayedScore: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 32,
    color: colors.white,
    lineHeight: 40,
    letterSpacing: 2,
  },
  alreadyPlayedXpRow: {
    alignItems: 'center',
  },
  alreadyPlayedXpLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 2,
    color: '#9A9A9A',
  },
  alreadyPlayedXp: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 32,
    color: colors.brand,
    lineHeight: 38,
  },
  alreadyPlayedDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: spacing.xs,
  },
  alreadyPlayedCta: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 18,
    color: colors.white,
    letterSpacing: 2,
    textAlign: 'center',
  },
  alreadyPlayedSub: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 13,
    color: '#9A9A9A',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Category label
  categoryLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    color: '#9A9A9A',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },

  // Cards row ───────────────────────────────────────────────────────────────
  cardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Player card
  card: {
    flex: 1,
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: CARD_BORDER_RADIUS,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  cardSelected: {
    borderColor: colors.brand,
    shadowColor: colors.brand,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  cardDimmed: {
    opacity: 0.4,
  },
  // Card internals
  cardSideLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 1,
    color: '#9A9A9A',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  silhouetteWrapper: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  silhouette: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: darkColors.surface,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#4A4A4A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerName: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 15,
    marginBottom: spacing.sm,
  },
  namePlaceholder: {
    width: '80%',
    height: 10,
    backgroundColor: '#383838',
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  statsBlock: {
    width: '100%',
    gap: 4,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  statLabel: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 10,
    color: '#9A9A9A',
    letterSpacing: 0.5,
  },
  statValue: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 14,
    color: colors.white,
  },

  // VS badge
  vsBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: darkColors.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.sm,
  },
  vsText: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 10,
    color: '#9A9A9A',
    letterSpacing: 0.5,
  },

  // Post-reveal section
  revealSection: {
    marginTop: spacing['2xl'],
    alignItems: 'center',
    gap: spacing.lg,
  },
  communityAgreement: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 15,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  communityPct: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 13,
    color: '#9A9A9A',
    marginBottom: spacing.xs,
  },

  // XP card
  xpCard: {
    width: '100%',
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  xpCardLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: '#9A9A9A',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  xpCardTotal: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 48,
    color: colors.brand,
    lineHeight: 54,
  },
  xpCardBreakdown: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 13,
    color: '#9A9A9A',
    marginTop: spacing.xs,
  },

  // Tomorrow card
  tomorrowCard: {
    width: '100%',
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 20,
    padding: spacing['2xl'],
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  tomorrowIconRow: {
    marginBottom: spacing.md,
  },
  tomorrowTitle: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 18,
    color: colors.white,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  tomorrowSub: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 13,
    color: '#9A9A9A',
    textAlign: 'center',
    lineHeight: 20,
  },
  archiveNotice: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 13,
    color: '#9A9A9A',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // Share button
  shareBtn: {
    width: '100%',
    height: 56,
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  shareBtnPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  shareBtnText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 15,
    color: colors.white,
    letterSpacing: 1.5,
  },
  notifyBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: 12,
    width: '100%',
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
