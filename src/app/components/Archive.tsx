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
import { ArrowLeft, Search, Swords, ListOrdered, Brain, Check, Zap, Type } from 'lucide-react-native';
import { brand, dark, light, colors, darkColors, fontFamily, fonts, fontSizes, spacing, radius } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';
import { type Tab } from './ui/BottomNav';
import { getAvailableArchiveDates } from '../../lib/dailyGames';
import { getTodaysCompletedGames } from '../../lib/gameResults';

// ── Types ────────────────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
  onNavigate: (tab: Tab) => void;
  onPlayArchiveGame: (gameId: string, archiveDate: string) => void;
}

interface DateRow {
  date: string;
  label: string;
  subLabel: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function daysAgoLabel(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T12:00:00');
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 1) return 'Yesterday';
  if (diff <= 7) return `${diff} days ago`;
  return formatDateLabel(dateStr);
}

const GAME_TYPES = [
  { id: 'player-guess', gameType: 'mystery-player', label: 'MYSTERY PLAYER', Icon: Search },
  { id: 'blind-showdown', gameType: 'showdown', label: 'SHOWDOWN', Icon: Swords },
  { id: 'blind-rank-5', gameType: 'blind-rank-5', label: 'BLIND RANK 5', Icon: ListOrdered },
  { id: 'trivia', gameType: 'trivia', label: 'TRIVIA', Icon: Brain },
  { id: 'power-play', gameType: 'power-play', label: 'POWER PLAY', Icon: Zap },
  { id: 'auto-complete', gameType: 'auto-complete', label: 'AUTO COMPLETE', Icon: Type },
] as const;

// ── Persist selected league across re-mounts ─────────────────────────────────
// When a user plays a game and comes back to Archive, the league choice is
// preserved so they don't get snapped back to the default.
let _persistedLeague = 'NBA';

// ── Component ────────────────────────────────────────────────────────────────

export default function Archive({ onBack, onPlayArchiveGame }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const t = isDark ? dark : light;
  const [selectedLeague, setSelectedLeague] = useState(_persistedLeague);

  const handleLeagueChange = (league: string) => {
    _persistedLeague = league;
    setSelectedLeague(league);
  };
  const [dates, setDates] = useState<DateRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setExpandedDate(null);
    void getAvailableArchiveDates(selectedLeague).then(rawDates => {
      setDates(
        rawDates.map(d => ({
          date: d,
          label: formatDateLabel(d),
          subLabel: daysAgoLabel(d),
        })),
      );
      setIsLoading(false);
    });
  }, [selectedLeague]);

  const toggleExpand = (date: string) => {
    setExpandedDate(prev => (prev === date ? null : date));
  };

  return (
    <View style={[styles.root, { backgroundColor: t.background }]}>
      {/* ── Zone 1 ── */}
      <View style={[styles.zone1, { backgroundColor: brand.primary, paddingTop: insets.top }]}>
        <View style={styles.zone1TopRow}>
          <Pressable onPress={onBack} hitSlop={8} style={styles.backBtn}>
            <ArrowLeft size={22} color={dark.textPrimary} strokeWidth={2.5} />
          </Pressable>
        </View>

        <View style={styles.zone1Center}>
          <Text style={[styles.zone1Title, { color: dark.textPrimary }]}>ARCHIVE</Text>
          <Text style={[styles.zone1Sub, { color: dark.textSecondary }]}>Play any past day's games</Text>
        </View>

        <View style={styles.switcherRow}>
          <LeagueSwitcher selected={selectedLeague} onChange={handleLeagueChange} />
        </View>
      </View>

      {/* ── Zone 2 ── */}
      <ScrollView
        style={styles.zone2}
        contentContainerStyle={[styles.zone2Content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={brand.primary} />
          </View>
        ) : dates.length === 0 ? (
          <View style={styles.centerState}>
            <Text style={[styles.emptyText, { color: t.textSecondary }]}>No archive games available yet</Text>
          </View>
        ) : (
          dates.map(row => {
            const isExpanded = expandedDate === row.date;
            return (
              <View key={row.date}>
                <Pressable
                  onPress={() => toggleExpand(row.date)}
                  style={({ pressed }) => [
                    styles.dateCard,
                    { backgroundColor: t.surface, borderColor: t.cardBorder },
                    pressed && styles.dateCardPressed,
                    isExpanded && styles.dateCardExpanded,
                  ]}
                >
                  <View style={styles.dateCardLeft}>
                    <Text style={[styles.dateLabel, { color: t.textPrimary }]} numberOfLines={1}>{row.label}</Text>
                    <Text style={[styles.daysAgo, { color: t.textSecondary }]} numberOfLines={1}>{row.subLabel}</Text>
                  </View>

                  <View style={styles.dateCardRight}>
                    {GAME_TYPES.map(g => (
                      <View key={g.id} style={[styles.gameIconDot, { backgroundColor: isDark ? 'rgba(252,52,92,0.12)' : light.tagBg }]}>
                        <g.Icon size={14} color={brand.primary} strokeWidth={2} />
                      </View>
                    ))}
                  </View>
                </Pressable>

                {isExpanded && (
                  <View style={[styles.expandedRow, { backgroundColor: t.surface, borderColor: t.divider }]}>
                    {GAME_TYPES.map(g => (
                      <Pressable
                        key={g.id}
                        onPress={() => onPlayArchiveGame(g.id, row.date)}
                        style={({ pressed }) => [
                          styles.gameBtn,
                          { backgroundColor: t.card, borderColor: t.cardBorder },
                          pressed && styles.gameBtnPressed,
                        ]}
                      >
                        <g.Icon size={16} color={brand.primary} strokeWidth={2} />
                        <Text style={[styles.gameBtnText, { color: t.textPrimary }]}>{g.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  // Zone 1
  zone1: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
    borderBottomLeftRadius: radius.sheet,
    borderBottomRightRadius: radius.sheet,
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
    fontSize: 36,
    lineHeight: 38,
    letterSpacing: 3,
    textAlign: 'center',
  },
  zone1Sub: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.small.fontSize,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  switcherRow: {
    marginTop: spacing.xs,
  },

  // Zone 2
  zone2: {
    flex: 1,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    marginTop: -spacing['3xl'],
  },
  zone2Content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing['4xl'],
    gap: spacing.sm,
  },

  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.body.fontSize,
    textAlign: 'center',
  },

  // Date card
  dateCard: {
    borderRadius: radius.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  dateCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  dateCardExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dateCardLeft: {
    flex: 1,
  },
  dateLabel: {
    fontFamily: fonts.display,
    fontSize: 16,
  },
  daysAgo: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.small.fontSize,
    marginTop: 2,
  },
  dateCardRight: {
    flexDirection: 'row',
    flexShrink: 1,
    gap: spacing.xs,
  },
  gameIconDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Expanded game buttons
  expandedRow: {
    borderBottomLeftRadius: radius.primary,
    borderBottomRightRadius: radius.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderTopWidth: 0,
    marginTop: -1,
  },
  gameBtn: {
    borderRadius: 10,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
  },
  gameBtnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  gameBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.small.fontSize,
    letterSpacing: 1,
  },
});
