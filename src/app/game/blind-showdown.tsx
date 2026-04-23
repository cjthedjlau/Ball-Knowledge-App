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
import { ArrowLeft, User, Calendar } from 'lucide-react-native';
import MidnightCountdown from '../../components/MidnightCountdown';
import { brand, dark, light, fonts, colors, darkColors, fontFamily, spacing, radius } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';
import GhostButton from '../../screens/components/ui/GhostButton';
import { type Tab } from '../components/ui/BottomNav';
import { calculateDailyGameXP, saveGameResult, updateUserXPAndStreak } from '../../lib/xp';
import { shareShowdown } from '../../lib/shareResults';
import { supabase } from '../../lib/supabase';
import { getTodaysDailyGame, getArchiveGame } from '../../lib/dailyGames';
import { saveGameResult as saveCompletionResult, getGameResultToday, getTodayEST } from '../../lib/gameResults';
import { updatePlayHour } from '../../lib/notifications';
import { useGameAnalytics } from '../../lib/analytics';

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
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const s = createStyles(isDark);
  const { trackGameStart, trackGameComplete, trackGameAbandoned } = useGameAnalytics();
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

  useEffect(() => {
    trackGameStart('blind-showdown', selectedLeague);
  }, [selectedLeague]);

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
      trackGameComplete('blind-showdown', selectedLeague, pickedScore, xp);
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
      const today = getTodayEST();
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
    if (!matchup) return null;
    const player = side === 'A' ? matchup.playerA : matchup.playerB;
    const isSelected = selectedSide === side;
    const votes = communityVotes[selectedLeague];
    const pct = votes ? (side === 'A' ? votes.percentA : votes.percentB) : null;

    const cardStyleList = [
      s.card,
      selectedSide && isSelected && s.cardSelected,
      selectedSide && !isSelected && s.cardDimmed,
    ].filter(Boolean) as object[];

    return (
      <Pressable
        style={({ pressed }) => [
          ...cardStyleList,
          pressed && !selectedSide && s.cardPressed,
        ]}
        onPress={() => handleSelect(side)}
        disabled={!!selectedSide}
      >
        {/* Side label */}
        <Text style={s.cardSideLabel}>PLAYER {side}</Text>

        {/* Silhouette */}
        <View style={s.silhouetteWrapper}>
          <View style={s.silhouette}>
            <User size={36} color={isDark ? dark.textSecondary : light.textSecondary} strokeWidth={1.5} />
          </View>
        </View>

        {/* Player name — hidden until reveal */}
        {isRevealed ? (
          <Text style={s.playerName} numberOfLines={2}>
            {player.name}
          </Text>
        ) : (
          <View style={s.namePlaceholder} />
        )}

        {/* Community vote — shown after reveal */}
        {isRevealed && pct !== null ? (
          <Text style={s.communityPct}>{pct}% picked</Text>
        ) : isRevealed ? (
          <Text style={s.communityPct}>—</Text>
        ) : null}

        {/* Stats — always visible */}
        <View style={s.statsBlock}>
          {player.stats.map(({ label, value }) => (
            <View key={label} style={s.statRow}>
              <Text style={s.statLabel}>{label}</Text>
              <Text style={s.statValue}>{value}</Text>
            </View>
          ))}
        </View>
      </Pressable>
    );
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <View style={s.root}>
      <ScrollView
        contentContainerStyle={[s.zone2Content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
      {/* ── Zone 1 ── */}
      <View style={[s.zone1, { paddingTop: insets.top + 32, marginTop: -(insets.top), marginHorizontal: -1, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }]}>
        <View style={s.zone1TopRow}>
          <Pressable onPress={() => { if (!picks[selectedLeague]) trackGameAbandoned('blind-showdown', selectedLeague); onBack(); }} hitSlop={8} style={s.backBtn}>
            <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
          </Pressable>
        </View>

        <View style={s.zone1Center}>
          <Text style={s.zone1Title}>SHOWDOWN</Text>
          <Text style={s.zone1Sub}>One matchup per league, per day</Text>
        </View>

        {isArchive ? (
          <View style={s.archiveBanner}>
            <Text style={s.archiveBannerText}>ARCHIVE — {archiveDate}</Text>
          </View>
        ) : (
          <View style={s.switcherRow}>
            <LeagueSwitcher selected={selectedLeague} onChange={setSelectedLeague} />
          </View>
        )}
      </View>
        {isLoading ? (
          <View style={s.centerState}>
            <ActivityIndicator size="large" color={brand.primary} />
          </View>
        ) : (loadError || !matchup) ? (
          <View style={s.centerState}>
            <Text style={s.errorText}>No game available today</Text>
          </View>
        ) : (!isArchive && playedTodayCache[selectedLeague]) ? (
          <View style={s.alreadyPlayedCard}>
            <Text style={s.alreadyPlayedBadge}>ALREADY PLAYED TODAY</Text>
            <Text style={s.alreadyPlayedScore}>
            PLAYER {(playedTodayCache[selectedLeague]?.score ?? 0) === 0 ? 'A' : 'B'}
          </Text>
            <View style={s.alreadyPlayedXpRow}>
              <Text style={s.alreadyPlayedXpLabel}>XP EARNED</Text>
              <Text style={s.alreadyPlayedXp}>+{playedTodayCache[selectedLeague]?.xp ?? 0}</Text>
            </View>
            <View style={s.alreadyPlayedDivider} />
            <Text style={s.alreadyPlayedCta}>COME BACK TOMORROW</Text>
            <Text style={s.alreadyPlayedSub}>A new matchup drops every day. Switch leagues to play more.</Text>
            <MidnightCountdown />
            <GhostButton label="VIEW ARCHIVE" onPress={() => onNavigate('archive' as Tab)} />
          </View>
        ) : (<>
        {/* Category label — only shown after reveal to avoid spoiling identities */}
        {isRevealed && matchup.categoryLabel ? (
          <Text style={s.categoryLabel}>{matchup.categoryLabel}</Text>
        ) : null}

        {/* Cards row */}
        <View style={s.cardsRow}>
          {renderCard('A')}

          {/* VS badge */}
          <View style={s.vsBadge}>
            <Text style={s.vsText}>VS</Text>
          </View>

          {renderCard('B')}
        </View>

        {/* Post-reveal area */}
        {isRevealed && (
          <View style={s.revealSection}>
            {/* Community agreement */}
            <Text style={s.communityAgreement}>
              {communityVotes[selectedLeague]
                ? `${selectedSide === 'A' ? (communityVotes[selectedLeague]?.percentA ?? 0) : (communityVotes[selectedLeague]?.percentB ?? 0)}% of fans made the same pick`
                : 'Counting votes...'}
            </Text>

            {/* Share button */}
            <Pressable
              style={({ pressed }) => [
                s.shareBtn,
                pressed && s.shareBtnPressed,
              ]}
              onPress={() => {
                const votes = communityVotes[selectedLeague];
                const votePct = selectedSide === 'A'
                  ? (votes?.percentA ?? 50)
                  : (votes?.percentB ?? 50);
                shareShowdown(selectedLeague, false, votePct);
              }}
            >
              <Text style={s.shareBtnText}>SHARE RESULTS</Text>
            </Pressable>


            {/* XP card */}
            {!isArchive && xpEarnedMap[selectedLeague] !== undefined && (
              <View style={s.xpCard}>
                <Text style={s.xpCardLabel}>XP EARNED</Text>
                <Text style={s.xpCardTotal}>+{xpEarnedMap[selectedLeague]}</Text>
                <Text style={s.xpCardBreakdown}>
                  Base: 500 XP + Bonus: {xpEarnedMap[selectedLeague] - 500} XP
                </Text>
              </View>
            )}
            {isArchive && (
              <Text style={s.archiveNotice}>ARCHIVE MODE — Results not saved</Text>
            )}

            {/* Come back tomorrow card */}
            {!isArchive && (
              <View style={s.tomorrowCard}>
                <View style={s.tomorrowIconRow}>
                  <Calendar size={20} color={colors.brand} strokeWidth={2} />
                </View>
                <Text style={s.tomorrowTitle}>COME BACK TOMORROW</Text>
                <Text style={s.tomorrowSub}>
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
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const CARD_BORDER_RADIUS = 16;

function createStyles(isDark: boolean) {
  const txt = isDark ? dark.textPrimary : light.textPrimary;
  const txtSec = isDark ? dark.textSecondary : light.textSecondary;
  const cardBg = isDark ? dark.card : light.card;
  const surfaceBg = isDark ? dark.surface : light.surface;
  const borderCol = isDark ? dark.cardBorder : light.cardBorder;
  const dividerCol = isDark ? dark.divider : light.divider;

  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: 'transparent',
    },

    // Zone 1
    zone1: {
      backgroundColor: 'transparent',
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
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
      fontFamily: fonts.display,
      fontSize: 24,
      color: '#FFFFFF',
      letterSpacing: 3,
      textAlign: 'center',
    },
    zone1Sub: {
      fontFamily: fonts.bodyMedium,
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
      fontFamily: fonts.bodySemiBold,
      fontSize: 11,
      color: 'rgba(255,255,255,0.80)',
      letterSpacing: 1.5,
    },

    // Zone 2
    zone2: {
      flex: 1,
      backgroundColor: 'transparent',
      
      
    },
    zone2Content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing['2xl'],
      paddingBottom: 0,
    },

    // Loading / error
    centerState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 80,
    },
    errorText: {
      fontFamily: fonts.bodyMedium,
      fontSize: 15,
      color: txtSec,
      textAlign: 'center',
    },

    // Already played today
    alreadyPlayedCard: {
      backgroundColor: cardBg,
      borderRadius: 24,
      padding: spacing['3xl'],
      alignItems: 'center',
      gap: spacing.md,
      borderWidth: 1,
      borderColor: borderCol,
    },
    alreadyPlayedBadge: {
      fontFamily: fonts.bodySemiBold,
      fontSize: 10,
      letterSpacing: 2,
      color: brand.primary,
      textAlign: 'center',
    },
    alreadyPlayedScore: {
      fontFamily: fonts.display,
      fontSize: 32,
      color: txt,
      lineHeight: 40,
      letterSpacing: 2,
    },
    alreadyPlayedXpRow: {
      alignItems: 'center',
    },
    alreadyPlayedXpLabel: {
      fontFamily: fonts.bodySemiBold,
      fontSize: 10,
      letterSpacing: 2,
      color: txtSec,
    },
    alreadyPlayedXp: {
      fontFamily: fonts.display,
      fontSize: 32,
      color: brand.primary,
      lineHeight: 38,
    },
    alreadyPlayedDivider: {
      width: '100%' as any,
      height: 1,
      backgroundColor: dividerCol,
      marginVertical: spacing.xs,
    },
    alreadyPlayedCta: {
      fontFamily: fonts.display,
      fontSize: 18,
      color: txt,
      letterSpacing: 2,
      textAlign: 'center',
    },
    alreadyPlayedSub: {
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      color: txtSec,
      textAlign: 'center',
      lineHeight: 20,
    },

    // Category label
    categoryLabel: {
      fontFamily: fonts.bodySemiBold,
      fontSize: 11,
      color: txtSec,
      letterSpacing: 1,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },

    // Cards row
    cardsRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    // Player card
    card: {
      flex: 1,
      backgroundColor: cardBg,
      borderRadius: CARD_BORDER_RADIUS,
      padding: spacing.lg,
      paddingVertical: spacing.xl,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    cardPressed: {
      opacity: 0.88,
      transform: [{ scale: 0.98 }],
    },
    cardSelected: {
      borderColor: brand.primary,
    },
    cardDimmed: {
      opacity: 0.4,
    },
    // Card internals
    cardSideLabel: {
      fontFamily: fonts.bodySemiBold,
      fontSize: 12,
      letterSpacing: 1.5,
      color: txtSec,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    silhouetteWrapper: {
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    silhouette: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: surfaceBg,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: borderCol,
      alignItems: 'center',
      justifyContent: 'center',
    },
    playerName: {
      fontFamily: fonts.bodySemiBold,
      fontSize: 14,
      color: txt,
      textAlign: 'center',
      lineHeight: 19,
      marginBottom: spacing.sm,
    },
    namePlaceholder: {
      width: '80%' as any,
      height: 10,
      backgroundColor: surfaceBg,
      borderRadius: 4,
      marginBottom: spacing.sm,
    },
    statsBlock: {
      width: '100%',
      gap: 6,
      marginTop: spacing.sm,
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 4,
    },
    statLabel: {
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      color: txtSec,
      letterSpacing: 0.5,
    },
    statValue: {
      fontFamily: fonts.display,
      fontSize: 18,
      color: txt,
    },

    // VS badge
    vsBadge: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: borderCol,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: spacing.sm,
    },
    vsText: {
      fontFamily: fonts.display,
      fontSize: 10,
      color: txtSec,
      letterSpacing: 0.5,
    },

    // Post-reveal section
    revealSection: {
      marginTop: spacing['2xl'],
      alignItems: 'center',
      gap: spacing.lg,
    },
    communityAgreement: {
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      color: txt,
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    communityPct: {
      fontFamily: fonts.display,
      fontSize: 13,
      color: txtSec,
      marginBottom: spacing.xs,
    },

    // XP card
    xpCard: {
      width: '100%' as any,
      backgroundColor: cardBg,
      borderRadius: radius.primary,
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: borderCol,
    },
    xpCardLabel: {
      fontFamily: fonts.bodySemiBold,
      fontSize: 13,
      color: txtSec,
      letterSpacing: 1,
      marginBottom: spacing.xs,
    },
    xpCardTotal: {
      fontFamily: fonts.display,
      fontSize: 48,
      color: brand.primary,
      lineHeight: 54,
    },
    xpCardBreakdown: {
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      color: txtSec,
      marginTop: spacing.xs,
    },

    // Tomorrow card
    tomorrowCard: {
      width: '100%' as any,
      backgroundColor: cardBg,
      borderRadius: 20,
      padding: spacing['2xl'],
      alignItems: 'center',
      borderWidth: 1,
      borderColor: borderCol,
    },
    tomorrowIconRow: {
      marginBottom: spacing.md,
    },
    tomorrowTitle: {
      fontFamily: fonts.display,
      fontSize: 18,
      color: txt,
      letterSpacing: 2,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    tomorrowSub: {
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      color: txtSec,
      textAlign: 'center',
      lineHeight: 20,
    },
    archiveNotice: {
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      color: txtSec,
      textAlign: 'center',
      letterSpacing: 0.5,
    },

    // Share button
    shareBtn: {
      width: '100%' as any,
      height: 56,
      backgroundColor: cardBg,
      borderRadius: radius.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: borderCol,
    },
    shareBtnPressed: {
      opacity: 0.75,
      transform: [{ scale: 0.98 }],
    },
    shareBtnText: {
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      color: txt,
      letterSpacing: 1.5,
    },
  });
}

const styles = createStyles(true);
