import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Smartphone, Trophy, Check, X } from 'lucide-react-native';
import { brand, dark, light, colors, darkColors, fonts, fontFamily, spacing, radius } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import { calculateMultiplayerXP, saveGameResult, updateUserXPAndStreak } from '../../lib/xp';
import { supabase } from '../../lib/supabase';
import { getGamePlayers, type Player } from '../../lib/playersPool';
import PrimaryButton from '../../screens/components/ui/PrimaryButton';
import GhostButton from '../../screens/components/ui/GhostButton';
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';
import type { Tab } from '../components/ui/BottomNav';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface Athlete {
  name: string;
  team: string;
  position: string;
  keyStat: string;
}

const FETCH_COUNT = 20;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DEFAULT_PLAYERS = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
const TURN_SECONDS = 60;

type Phase = 'countdown' | 'active' | 'turnEnd' | 'gameEnd';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Simple circular timer — border color changes when time is low. */
function TimerRing({ timeLeft }: { timeLeft: number }) {
  const isLow = timeLeft <= 10;
  const borderColor = isLow ? colors.accentRed : colors.brand;
  const textColor = isLow ? colors.accentRed : colors.white;
  return (
    <View style={[timerStyles.ring, { borderColor }]}>
      <Text style={[timerStyles.num, { color: textColor }]}>{timeLeft}</Text>
      <Text style={[timerStyles.label, { color: borderColor }]}>SEC</Text>
    </View>
  );
}

const timerStyles = StyleSheet.create({
  ring: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  num: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 48,
    lineHeight: 52,
  },
  label: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2,
    marginTop: -4,
  },
});

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface Props {
  onBack: () => void;
  onNavigate: (tab: Tab) => void;
}

export default function WhoAmIScreen({ onBack }: Props) {
  const { isDark } = useTheme();
  // ── Data ──
  const [selectedLeague, setSelectedLeague] = useState('NBA');

  function loadAthletes(league: string) {
    getGamePlayers(league).then((players) => {
      setFetchedAthletes([...players].sort(() => Math.random() - 0.5).slice(0, FETCH_COUNT).map((p) => ({
        name: p.name,
        team: p.team,
        position: p.position,
        keyStat: '',
      })));
    });
  }

  const [fetchedAthletes, setFetchedAthletes] = useState<Athlete[]>([]);

  useEffect(() => { loadAthletes('NBA'); }, []);

  const handleLeagueChange = useCallback((league: string) => {
    setSelectedLeague(league);
    loadAthletes(league);
  }, []);

  const [phase, setPhase] = useState<Phase>('countdown');
  const [players] = useState<string[]>([...DEFAULT_PLAYERS]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TURN_SECONDS);
  const [deck, setDeck] = useState<Athlete[]>([]);
  const [athleteIndex, setAthleteIndex] = useState(0);
  const [turnScore, setTurnScore] = useState(0);
  const [turnCorrect, setTurnCorrect] = useState<string[]>([]);
  const [allScores, setAllScores] = useState<number[]>([]);
  const [flashColor, setFlashColor] = useState<string | null>(null);
  const [flashLabel, setFlashLabel] = useState<string>('');
  const [xpEarned, setXpEarned] = useState<number | null>(null);

  // When fetched athletes arrive, shuffle them into the deck
  useEffect(() => {
    if (fetchedAthletes.length > 0) {
      setDeck(shuffle(fetchedAthletes));
      setAthleteIndex(0);
    }
  }, [fetchedAthletes]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tiltLocked = useRef(false); // debounce tilt so one tilt = one action

  // ── Helpers ───────────────────────────────────────────────────────────────

  const currentPlayer = players[currentPlayerIndex] ?? `Player ${currentPlayerIndex + 1}`;
  const fallbackAthlete: Athlete = { name: '...', team: '', position: '', keyStat: '' };
  const currentAthlete = deck.length > 0 ? (deck[athleteIndex % deck.length] ?? fallbackAthlete) : fallbackAthlete;

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const endTurn = useCallback(
    (finalScore: number, finalCorrect: string[]) => {
      stopTimer();
      setTurnScore(finalScore);
      setTurnCorrect(finalCorrect);
      setPhase('turnEnd');
    },
    [stopTimer],
  );

  // ── Timer ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase !== 'active') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Use a timeout so we don't call setState/endTurn inside this setState
          setTimeout(() => endTurn(turnScore, turnCorrect), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return stopTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── Tilt detection (expo-sensors — graceful fallback if not installed) ────
  useEffect(() => {
    if (phase !== 'active') return;
    let subscription: { remove: () => void } | null = null;
    try {
      // Tilt controls require: npx expo install expo-sensors --legacy-peer-deps
      // Currently using button fallbacks — tilt can be enabled after EAS build
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { DeviceMotion } = require('expo-sensors');
      DeviceMotion.setUpdateInterval(150);
      subscription = DeviceMotion.addListener(
        ({ rotation }: { rotation: { beta: number } }) => {
          const beta = (rotation.beta * 180) / Math.PI; // radians → degrees
          if (!tiltLocked.current) {
            if (beta > 45) handleCorrect();
            else if (beta < -45) handlePass();
          }
        },
      );
    } catch {
      // expo-sensors not installed — fallback buttons are shown instead
    }
    return () => {
      subscription?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── Action handlers ───────────────────────────────────────────────────────

  function handleCorrect() {
    if (phase !== 'active' || tiltLocked.current) return;
    tiltLocked.current = true;
    setTimeout(() => { tiltLocked.current = false; }, 600);

    setTurnCorrect((prev) => {
      const updated = [...prev, currentAthlete.name];
      setTurnScore(updated.length);
      return updated;
    });
    setAthleteIndex((i) => i + 1);
    setFlashColor(colors.accentGreen);
    setFlashLabel('✓ CORRECT');
    setTimeout(() => setFlashColor(null), 450);
  }

  function handlePass() {
    if (phase !== 'active' || tiltLocked.current) return;
    tiltLocked.current = true;
    setTimeout(() => { tiltLocked.current = false; }, 600);

    setAthleteIndex((i) => i + 1);
    setFlashColor(colors.accentRed);
    setFlashLabel('✗ PASSED');
    setTimeout(() => setFlashColor(null), 450);
  }

  // ── Phase transitions ─────────────────────────────────────────────────────

  function startTurn() {
    tiltLocked.current = false;
    setTimeLeft(TURN_SECONDS);
    setTurnScore(0);
    setTurnCorrect([]);
    setFlashColor(null);
    setPhase('active');
  }

  function handleNextPlayer() {
    const updatedScores = [...allScores, turnScore];
    setAllScores(updatedScores);

    const nextIndex = currentPlayerIndex + 1;
    if (nextIndex >= players.length) {
      const totalCorrect = updatedScores.reduce((a, b) => a + b, 0);
      const xp = calculateMultiplayerXP(totalCorrect);
      setXpEarned(xp);
      void (async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await saveGameResult(user.id, 'who-am-i', xp, totalCorrect);
          await updateUserXPAndStreak(user.id, xp, false);
        }
      })();
      setPhase('gameEnd');
    } else {
      setCurrentPlayerIndex(nextIndex);
      setAthleteIndex((i) => i); // keep deck position, don't replay
      setPhase('countdown');
    }
  }

  function handlePlayAgain() {
    setAthleteIndex(0);
    setCurrentPlayerIndex(0);
    setAllScores([]);
    setTurnScore(0);
    setTurnCorrect([]);
    setXpEarned(null);
    setPhase('countdown');
    loadAthletes(selectedLeague);
  }

  // =========================================================================
  // Renders
  // =========================================================================

  // ── ACTIVE TURN (full screen, no zone split) ──────────────────────────────
  if (phase === 'active') {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={activeStyles.root}>
        {/* Flash overlay */}
        {flashColor && (
          <View style={[activeStyles.flash, { backgroundColor: flashColor }]}>
            <Text style={activeStyles.flashLabel}>{flashLabel}</Text>
          </View>
        )}

        {/* Top row: timer + score */}
        <View style={activeStyles.topRow}>
          <TimerRing timeLeft={timeLeft} />
          <View style={activeStyles.scoreBox}>
            <Text style={activeStyles.scoreNum}>{turnScore}</Text>
            <Text style={activeStyles.scoreLabel}>CORRECT</Text>
          </View>
        </View>

        {/* Player name */}
        <Text style={activeStyles.playerTag}>{currentPlayer.toUpperCase()}</Text>

        {/* Athlete card */}
        <View style={activeStyles.athleteCard}>
          <Text style={activeStyles.athleteName}>{currentAthlete.name}</Text>
          <Text style={activeStyles.athleteSub}>
            {currentAthlete.team} · {currentAthlete.position}
          </Text>
          <Text style={activeStyles.athleteStat}>{currentAthlete.keyStat}</Text>
        </View>

        {/* Fallback action buttons */}
        <View style={activeStyles.actionRow}>
          <Pressable
            style={[activeStyles.actionBtn, activeStyles.passBtn]}
            onPress={handlePass}
          >
            <X size={28} color={colors.white} strokeWidth={3} />
            <Text style={activeStyles.actionBtnText}>PASS</Text>
          </Pressable>
          <Pressable
            style={[activeStyles.actionBtn, activeStyles.correctBtn]}
            onPress={handleCorrect}
          >
            <Check size={28} color={colors.white} strokeWidth={3} />
            <Text style={activeStyles.actionBtnText}>GOT IT</Text>
          </Pressable>
        </View>

        <Text style={activeStyles.tiltHint}>
          Tilt DOWN = Got it · Tilt UP = Pass
        </Text>
      </SafeAreaView>
    );
  }

  // ── GAME END ──────────────────────────────────────────────────────────────
  if (phase === 'gameEnd') {
    const finalScores = [...allScores];
    const totalScores = players.map((name, i) => ({ name, score: finalScores[i] ?? 0 }));
    const sorted = [...totalScores].sort((a, b) => b.score - a.score);
    const winner = sorted[0];

    return (
      <SafeAreaView edges={['top']} style={styles.root}>
        <View style={styles.zone1}>
          <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
            <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.zone1Title}>WHO AM I?</Text>
          <Text style={styles.zone1Sub}>FINAL SCORES</Text>
        </View>

        <ScrollView style={styles.zone2} contentContainerStyle={styles.zone2Content} showsVerticalScrollIndicator={false}>
          {/* Winner banner */}
          <View style={styles.winnerBanner}>
            <Trophy size={28} color={colors.brand} strokeWidth={2} />
            <View style={{ flex: 1 }}>
              <Text style={styles.winnerLabel}>WINNER</Text>
              <Text style={styles.winnerName}>{winner.name}</Text>
            </View>
            <Text style={styles.winnerScore}>{winner.score}</Text>
          </View>

          {/* Leaderboard */}
          <View style={styles.card}>
            {sorted.map((entry, i) => (
              <View
                key={entry.name}
                style={[styles.leaderRow, i < sorted.length - 1 && styles.leaderRowBorder]}
              >
                <View style={[styles.rankBadge, i === 0 && styles.rankBadgeFirst]}>
                  <Text style={[styles.rankText, i === 0 && styles.rankTextFirst]}>
                    {i + 1}
                  </Text>
                </View>
                <Text style={styles.leaderName}>{entry.name}</Text>
                <Text style={[styles.leaderScore, i === 0 && styles.leaderScoreFirst]}>
                  {entry.score}
                </Text>
              </View>
            ))}
          </View>

          {xpEarned !== null && (
            <View style={styles.xpCard}>
              <Text style={styles.xpCardLabel}>XP EARNED</Text>
              <Text style={styles.xpCardTotal}>+{xpEarned}</Text>
              <Text style={styles.xpCardBreakdown}>Multiplayer Bonus: {xpEarned} XP</Text>
            </View>
          )}

          <PrimaryButton label="PLAY AGAIN" onPress={handlePlayAgain} />
          <GhostButton label="BACK TO GAMES" onPress={onBack} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── TURN END ──────────────────────────────────────────────────────────────
  if (phase === 'turnEnd') {
    return (
      <SafeAreaView edges={['top']} style={styles.root}>
        <View style={styles.zone1}>
          <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
            <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.zone1Title}>WHO AM I?</Text>
          <Text style={styles.zone1Sub}>{currentPlayer.toUpperCase()}'S TURN</Text>
        </View>

        <ScrollView style={styles.zone2} contentContainerStyle={styles.zone2Content} showsVerticalScrollIndicator={false}>
          {/* Score card */}
          <View style={[styles.card, styles.cardCenter]}>
            <Text style={styles.turnScoreNum}>{turnScore}</Text>
            <Text style={styles.turnScoreLabel}>
              {turnScore === 1 ? 'ATHLETE GUESSED' : 'ATHLETES GUESSED'}
            </Text>
          </View>

          {/* Correct athletes */}
          {turnCorrect.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>CORRECT ✓</Text>
              {turnCorrect.map((name) => (
                <View key={name} style={styles.correctRow}>
                  <View style={styles.correctDot} />
                  <Text style={styles.correctName}>{name}</Text>
                </View>
              ))}
            </View>
          )}

          <PrimaryButton
            label={
              currentPlayerIndex + 1 >= players.length
                ? 'SEE FINAL SCORES'
                : `NEXT: ${players[currentPlayerIndex + 1]?.toUpperCase() ?? ''}`
            }
            onPress={handleNextPlayer}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── COUNTDOWN ─────────────────────────────────────────────────────────────
  if (phase === 'countdown') {
    return (
      <SafeAreaView edges={['top']} style={styles.root}>
        <View style={styles.zone1}>
          <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
            <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.zone1Title}>WHO AM I?</Text>
          <Text style={styles.zone1Sub}>
            ROUND {currentPlayerIndex + 1} OF {players.length}
          </Text>
        </View>

        <View style={[styles.zone2, { flex: 1 }]}>
          <View style={styles.countdownContent}>
            {/* Phone-to-forehead illustration */}
            <Text style={styles.illustrationArrowText}>↑ FOREHEAD</Text>
            <View style={styles.illustrationBox}>
              <Smartphone size={64} color={colors.brand} strokeWidth={1.5} />
            </View>

            <View style={styles.passBlock}>
              <Text style={styles.passTo}>PASS TO</Text>
              <Text style={styles.passName}>{currentPlayer}</Text>
            </View>

            <Text style={styles.countdownInstruction}>
              Hold the phone to your forehead with the screen facing outward. Others will see the athlete — give verbal clues without saying the name.
            </Text>

            <Text style={styles.countdownHint}>
              Tilt DOWN = Got it · Tilt UP = Pass
            </Text>

            {currentPlayerIndex === 0 && (
              <View style={{ width: '100%' }}>
                <LeagueSwitcher selected={selectedLeague} onChange={handleLeagueChange} />
              </View>
            )}

            <View style={{ width: '100%' }}>
              <PrimaryButton label="READY — START TURN" onPress={startTurn} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// Styles — active turn (full screen)
// ---------------------------------------------------------------------------

const activeStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  flash: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashLabel: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 40,
    color: colors.white,
    letterSpacing: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  scoreBox: {
    alignItems: 'center',
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: radius.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
  },
  scoreNum: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 48,
    color: colors.accentGreen,
    lineHeight: 52,
  },
  scoreLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2,
    color: darkColors.textSecondary,
  },
  playerTag: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  athleteCard: {
    flex: 1,
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: radius.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['2xl'],
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: spacing.xl,
  },
  athleteName: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 42,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 48,
  },
  athleteSub: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 18,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  athleteStat: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 26,
    color: colors.brand,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginTop: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    height: 64,
    borderRadius: radius.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  passBtn: {
    backgroundColor: colors.accentRed,
    shadowColor: colors.accentRed,
  },
  correctBtn: {
    backgroundColor: colors.accentGreen,
    shadowColor: colors.accentGreen,
  },
  actionBtnText: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 1.5,
    color: colors.white,
  },
  tiltHint: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    letterSpacing: 1,
  },
});

// ---------------------------------------------------------------------------
// Styles — all other phases (two-zone layout)
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // ── Zone 1 ──────────────────────────────────────────────────────────────
  zone1: {
    backgroundColor: colors.brand,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
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
    fontSize: 28,
    letterSpacing: 3,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  zone1Sub: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.7)',
  },

  // ── Zone 2 ──────────────────────────────────────────────────────────────
  zone2: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    zIndex: 1,
  },
  zone2Content: {
    paddingTop: spacing['2xl'],
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
    gap: spacing.lg,
  },

  // ── Cards ────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: radius.primary,
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
  cardCenter: {
    alignItems: 'center',
  },

  // ── Countdown ─────────────────────────────────────────────────────────────
  countdownContent: {
    flex: 1,
    paddingTop: spacing['4xl'],
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
    alignItems: 'center',
    gap: spacing.lg,
  },
  illustrationBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(252,52,92,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(252,52,92,0.25)',
  },
  illustrationArrowText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.brand,
  },
  passBlock: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  passTo: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.45)',
  },
  passName: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 32,
    color: darkColors.text,
    letterSpacing: 0.5,
  },
  countdownInstruction: {
    fontFamily: fontFamily.regular,
    fontWeight: '700',
    fontSize: 15,
    color: darkColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  countdownHint: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 1,
  },

  // ── Turn end ──────────────────────────────────────────────────────────────
  turnScoreNum: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 72,
    color: colors.brand,
    lineHeight: 72,
  },
  turnScoreLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 2,
    color: darkColors.textSecondary,
  },
  sectionLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2,
    color: colors.accentGreen,
    marginBottom: spacing.xs,
  },
  correctRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 4,
  },
  correctDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accentGreen,
  },
  correctName: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 15,
    color: darkColors.text,
  },

  // ── Game end / leaderboard ────────────────────────────────────────────────
  winnerBanner: {
    backgroundColor: 'rgba(252,52,92,0.12)',
    borderRadius: radius.primary,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.4)',
  },
  winnerLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2,
    color: colors.brand,
  },
  winnerName: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 22,
    color: darkColors.text,
  },
  winnerScore: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 40,
    color: colors.brand,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  leaderRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: darkColors.border,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: darkColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  rankBadgeFirst: {
    backgroundColor: colors.brandAlpha15,
    borderColor: colors.brand,
  },
  rankText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 14,
    color: darkColors.textSecondary,
  },
  rankTextFirst: {
    color: colors.brand,
  },
  leaderName: {
    flex: 1,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    color: darkColors.text,
  },
  leaderScore: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 22,
    color: darkColors.textSecondary,
  },
  leaderScoreFirst: {
    color: colors.brand,
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

