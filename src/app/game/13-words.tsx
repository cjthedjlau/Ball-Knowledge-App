import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Check } from 'lucide-react-native';
import { brand, dark, light, colors, darkColors, fonts, fontFamily, spacing } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import { calculateMultiplayerXP, saveGameResult, updateUserXPAndStreak } from '../../lib/xp';
import { supabase } from '../../lib/supabase';
import { getNormalPlayers, type Player } from '../../lib/playersPool';
import PrimaryButton from '../../screens/components/ui/PrimaryButton';
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';

const TOTAL_WORDS = 13;
const FETCH_COUNT = 7;

interface Athlete {
  name: string;
  team: string;
}

interface Props {
  onBack: () => void;
}

export default function ThirteenWordsScreen({ onBack }: Props) {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  // ── Data ──
  const [selectedLeague, setSelectedLeague] = useState('NBA');
  const [athletes, setAthletes] = useState<Athlete[]>([]);

  useEffect(() => {
    getNormalPlayers('NBA').then((players) => {
      setAthletes([...players].sort(() => Math.random() - 0.5).slice(0, FETCH_COUNT).map((p) => ({ name: p.name, team: p.team })));
    });
  }, []);

  const refreshPlayers = useCallback((league: string) => {
    getNormalPlayers(league).then((players) => {
      setAthletes([...players].sort(() => Math.random() - 0.5).slice(0, FETCH_COUNT).map((p) => ({ name: p.name, team: p.team })));
    });
  }, []);

  const handleLeagueChange = useCallback((league: string) => {
    setSelectedLeague(league);
    refreshPlayers(league);
    setAssignments([]);
    setCompleted(new Set());
    setXpEarned(null);
  }, [refreshPlayers]);

  // words assigned per athlete index
  const [assignments, setAssignments] = useState<number[]>([]);
  // set of athlete indices marked as correctly guessed
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [xpEarned, setXpEarned] = useState<number | null>(null);

  // Reset assignments when athletes change
  useEffect(() => {
    if (athletes.length > 0) {
      setAssignments(Array(athletes.length).fill(0));
      setCompleted(new Set());
    }
  }, [athletes]);

  const totalUsed = assignments.reduce((sum, n) => sum + n, 0);
  const budget = TOTAL_WORDS - totalUsed;
  const allDone = athletes.length > 0 && completed.size === athletes.length;

  const budgetCritical = budget <= 3 && !allDone;

  const handleIncrement = useCallback((idx: number) => {
    if (budget <= 0) return;
    setAssignments((prev) => {
      const next = [...prev];
      next[idx] = next[idx] + 1;
      return next;
    });
  }, [budget]);

  const handleDecrement = useCallback((idx: number) => {
    setAssignments((prev) => {
      const next = [...prev];
      next[idx] = Math.max(0, next[idx] - 1);
      return next;
    });
  }, []);

  const handleToggleComplete = useCallback((idx: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }, []);

  const handleNewGame = useCallback(() => {
    setXpEarned(null);
    refreshPlayers(selectedLeague);
  }, [selectedLeague, refreshPlayers]);

  useEffect(() => {
    if (allDone && xpEarned === null) {
      const xp = calculateMultiplayerXP(completed.size);
      setXpEarned(xp);
      void (async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await saveGameResult(user.id, '13-words', xp, completed.size);
          await updateUserXPAndStreak(user.id, xp, false);
        }
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone]);

  const progressFraction = Math.min(totalUsed / TOTAL_WORDS, 1);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        style={styles.zone2}
        contentContainerStyle={[
          styles.zone2Content,
          { paddingBottom: 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
      {/* ── Zone 1 ── */}
      <View style={[styles.zone1, { borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }]}>
        <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
          <ArrowLeft size={22} color={colors.white} strokeWidth={2} />
        </Pressable>
        <Text style={styles.gameTitle}>13 WORDS OR LESS</Text>
        <Text
          style={[
            styles.budgetNumber,
            budgetCritical && styles.budgetCritical,
            allDone && styles.budgetDone,
          ]}
        >
          {budget}
        </Text>
        <Text style={styles.budgetLabel}>WORDS REMAINING</Text>
      </View>
        {/* League Switcher */}
        <LeagueSwitcher selected={selectedLeague} onChange={handleLeagueChange} />

        {athletes.map((athlete, idx) => {
          const words = assignments[idx];
          const isDone = completed.has(idx);
          const hasWords = words > 0;

          return (
            <View
              key={idx}
              style={[
                styles.card,
                hasWords && !isDone && styles.cardActive,
                isDone && styles.cardDone,
              ]}
            >
              {/* Left: athlete info */}
              <Pressable
                style={styles.cardLeft}
                onPress={() => handleToggleComplete(idx)}
                hitSlop={4}
              >
                <View style={styles.checkCircle}>
                  {isDone && <Check size={14} color={colors.white} strokeWidth={3} />}
                </View>
                <View style={styles.athleteText}>
                  <Text
                    style={[styles.athleteName, isDone && styles.athleteNameDone]}
                    numberOfLines={1}
                  >
                    {athlete.name}
                  </Text>
                  <Text style={styles.athleteTeam} numberOfLines={1}>
                    {athlete.team}
                  </Text>
                </View>
              </Pressable>

              {/* Right: word stepper */}
              <View style={styles.stepper}>
                <Pressable
                  onPress={() => handleDecrement(idx)}
                  style={[styles.stepBtn, words === 0 && styles.stepBtnDisabled]}
                  hitSlop={8}
                  disabled={words === 0}
                >
                  <Text style={[styles.stepBtnText, words === 0 && styles.stepBtnTextDisabled]}>
                    −
                  </Text>
                </Pressable>
                <Text style={[styles.stepCount, hasWords && styles.stepCountActive]}>
                  {words}
                </Text>
                <Pressable
                  onPress={() => handleIncrement(idx)}
                  style={[styles.stepBtn, budget === 0 && styles.stepBtnDisabled]}
                  hitSlop={8}
                  disabled={budget === 0}
                >
                  <Text style={[styles.stepBtnText, budget === 0 && styles.stepBtnTextDisabled]}>
                    +
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}

        {/* ── Progress bar ── */}
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>
            {totalUsed} OF {TOTAL_WORDS} WORDS USED
          </Text>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressFraction * 100}%` as any },
                progressFraction >= 1 && styles.progressFillFull,
              ]}
            />
          </View>
        </View>

        {/* ── XP Card (shown when all done) ── */}
        {allDone && xpEarned !== null && (
          <View style={styles.xpCard}>
            <Text style={styles.xpCardLabel}>XP EARNED</Text>
            <Text style={styles.xpCardTotal}>+{xpEarned}</Text>
            <Text style={styles.xpCardBreakdown}>Multiplayer Bonus: {xpEarned} XP</Text>
          </View>
        )}

        {/* ── New Game ── */}
        <PrimaryButton label="NEW GAME" onPress={handleNewGame} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // ── Zone 1 ──
  zone1: {
    backgroundColor: colors.brand,
    paddingTop: spacing['3xl'],
    paddingBottom: 140,
    paddingHorizontal: spacing.lg,
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: spacing['3xl'],
    left: spacing.lg,
    padding: spacing.sm,
    zIndex: 10,
  },
  gameTitle: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 2.5,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 4,
  },
  budgetNumber: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 52,
    color: colors.white,
    lineHeight: 56,
    letterSpacing: -1,
  },
  budgetCritical: {
    color: colors.accentRed,
  },
  budgetDone: {
    color: colors.accentGreen,
  },
  budgetLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },

  // ── Zone 2 ──
  zone2: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  zone2Content: {
    paddingTop: 24,
    paddingHorizontal: spacing.lg,
    gap: 10,
  },

  // ── Athlete card ──
  card: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.45)',
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardActive: {
    borderLeftColor: colors.brand,
  },
  cardDone: {
    borderLeftColor: colors.accentGreen,
  },

  // ── Card left ──
  cardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingRight: 8,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    flexShrink: 0,
  },
  athleteText: {
    flex: 1,
  },
  athleteName: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 18,
    color: darkColors.text,
    letterSpacing: 0.2,
  },
  athleteNameDone: {
    textDecorationLine: 'line-through',
    color: darkColors.textSecondary,
  },
  athleteTeam: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: darkColors.textSecondary,
    marginTop: 2,
  },

  // ── Stepper ──
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flexShrink: 0,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.brandAlpha15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    opacity: 0.3,
  },
  stepBtnText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 20,
    color: colors.brand,
    lineHeight: 24,
    includeFontPadding: false,
  },
  stepBtnTextDisabled: {
    color: darkColors.textSecondary,
  },
  stepCount: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 20,
    color: darkColors.textSecondary,
    minWidth: 28,
    textAlign: 'center',
    lineHeight: 24,
  },
  stepCountActive: {
    color: colors.brand,
  },

  // ── Progress ──
  progressSection: {
    marginTop: 8,
    gap: 8,
  },
  progressLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2,
    color: darkColors.textSecondary,
    textAlign: 'center',
  },
  progressTrack: {
    height: 6,
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.brand,
    borderRadius: 999,
  },
  progressFillFull: {
    backgroundColor: colors.accentRed,
  },

  // ── XP Card ──────────────────────────────────────────────────────────────
  xpCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
  },
  xpCardLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1,
    color: darkColors.textSecondary,
  },
  xpCardTotal: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 48,
    color: colors.brand,
    lineHeight: 52,
  },
  xpCardBreakdown: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: darkColors.textSecondary,
  },

});
