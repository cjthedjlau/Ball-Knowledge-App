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
import { ArrowLeft, Search, Swords, ListOrdered, Brain, Check, Zap, Type } from 'lucide-react-native';
import { colors, darkColors, fontFamily, spacing } from '../../styles/theme';
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

// ── Component ────────────────────────────────────────────────────────────────

export default function Archive({ onBack, onPlayArchiveGame }: Props) {
  const [selectedLeague, setSelectedLeague] = useState('NBA');
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
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* ── Zone 1 ── */}
      <View style={styles.zone1}>
        <View style={styles.zone1TopRow}>
          <Pressable onPress={onBack} hitSlop={8} style={styles.backBtn}>
            <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
          </Pressable>
        </View>

        <View style={styles.zone1Center}>
          <Text style={styles.zone1Title}>ARCHIVE</Text>
          <Text style={styles.zone1Sub}>Play any past day's games</Text>
        </View>

        <View style={styles.switcherRow}>
          <LeagueSwitcher selected={selectedLeague} onChange={setSelectedLeague} />
        </View>
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
        ) : dates.length === 0 ? (
          <View style={styles.centerState}>
            <Text style={styles.emptyText}>No archive games available yet</Text>
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
                    pressed && styles.dateCardPressed,
                    isExpanded && styles.dateCardExpanded,
                  ]}
                >
                  <View style={styles.dateCardLeft}>
                    <Text style={styles.dateLabel}>{row.label}</Text>
                    <Text style={styles.daysAgo}>{row.subLabel}</Text>
                  </View>

                  <View style={styles.dateCardRight}>
                    {GAME_TYPES.map(g => (
                      <View key={g.id} style={styles.gameIconDot}>
                        <g.Icon size={14} color={colors.brand} strokeWidth={2} />
                      </View>
                    ))}
                  </View>
                </Pressable>

                {isExpanded && (
                  <View style={styles.expandedRow}>
                    {GAME_TYPES.map(g => (
                      <Pressable
                        key={g.id}
                        onPress={() => onPlayArchiveGame(g.id, row.date)}
                        style={({ pressed }) => [
                          styles.gameBtn,
                          pressed && styles.gameBtnPressed,
                        ]}
                      >
                        <g.Icon size={16} color={colors.brand} strokeWidth={2} />
                        <Text style={styles.gameBtnText}>{g.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // Zone 1
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
    elevation: 12,
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
    color: 'rgba(255,255,255,0.70)',
    marginTop: 4,
    textAlign: 'center',
  },
  switcherRow: {
    marginTop: spacing.xs,
  },

  // Zone 2
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
    gap: spacing.sm,
  },

  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 15,
    color: '#9A9A9A',
    textAlign: 'center',
  },

  // Date card
  dateCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 12,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // 3D raised effect
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.50)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  dateCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  dateCardExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  dateCardLeft: {
    flex: 1,
  },
  dateLabel: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 16,
    color: colors.white,
  },
  daysAgo: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 13,
    color: '#9A9A9A',
    marginTop: 2,
  },
  dateCardRight: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  gameIconDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(252,52,92,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Expanded game buttons
  expandedRow: {
    backgroundColor: darkColors.surfaceElevated,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.50)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.04)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.04)',
    marginTop: -1,
  },
  gameBtn: {
    backgroundColor: darkColors.surface,
    borderRadius: 10,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.30)',
  },
  gameBtnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  gameBtnText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: colors.white,
    letterSpacing: 1,
  },
});
