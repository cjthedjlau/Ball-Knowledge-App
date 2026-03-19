import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  PanResponder,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Minus } from 'lucide-react-native';
import { colors, darkColors, fontFamily, spacing, radius } from '../../styles/theme';
import { calculateMultiplayerXP, saveGameResult, updateUserXPAndStreak } from '../../lib/xp';
import { supabase } from '../../lib/supabase';
import { getNormalPlayers, type Player } from '../../lib/playersPool';
import RoundProgressDots from '../../screens/components/ui/RoundProgressDots';
import PrimaryButton from '../../screens/components/ui/PrimaryButton';
import GhostButton from '../../screens/components/ui/GhostButton';
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';
import type { Tab } from '../components/ui/BottomNav';

// ---------------------------------------------------------------------------
// Data & constants
// ---------------------------------------------------------------------------

const NEEDLE_SIZE = 28;
const ROUNDS_PER_GAME = 5;

type Phase = 'lobby' | 'setup' | 'clue' | 'guess' | 'reveal';

interface RoundData {
  leftLabel: string;
  rightLabel: string;
  targetPosition: number; // 0–100
}

// ── League-specific spectrum prompts ──────────────────────────────────────

const SPECTRUM_PROMPTS: Record<string, { left: string; right: string }[]> = {
  NBA: [
    { left: 'Overrated', right: 'Underrated' },
    { left: 'Role Player', right: 'Superstar' },
    { left: 'Regular Season', right: 'Playoff Performer' },
    { left: 'Old Era', right: 'Modern Era' },
    { left: 'Pure Scorer', right: 'Pure Defender' },
    { left: 'Ball Hog', right: 'Team Player' },
    { left: 'Athletic', right: 'Skill-Based' },
    { left: 'Forgotten', right: 'Legendary' },
    { left: 'Bust', right: 'All-Time Great' },
    { left: 'Soft', right: 'Tough' },
  ],
  NFL: [
    { left: 'Overrated', right: 'Underrated' },
    { left: 'System Player', right: 'Elite Talent' },
    { left: 'Regular Season', right: 'Clutch' },
    { left: 'One Hit Wonder', right: 'Consistent' },
    { left: 'Bust', right: 'All-Time Great' },
    { left: 'Offense', right: 'Defense' },
    { left: 'Old School', right: 'Modern Game' },
    { left: 'Forgotten', right: 'Legendary' },
    { left: 'Average', right: 'Dominant' },
    { left: 'Role Player', right: 'Franchise Player' },
  ],
  MLB: [
    { left: 'Overrated', right: 'Underrated' },
    { left: 'Regular Season', right: 'Postseason Hero' },
    { left: 'Power Hitter', right: 'Contact Hitter' },
    { left: 'Bust', right: 'Hall of Famer' },
    { left: 'Forgotten', right: 'Legendary' },
    { left: 'Old Era', right: 'Modern Era' },
    { left: 'One Tool', right: 'Five Tool Player' },
    { left: 'Role Player', right: 'Franchise Cornerstone' },
    { left: 'Streaky', right: 'Consistent' },
    { left: 'Average', right: 'Dominant' },
  ],
  NHL: [
    { left: 'Overrated', right: 'Underrated' },
    { left: 'Enforcer', right: 'Sniper' },
    { left: 'Regular Season', right: 'Playoff Performer' },
    { left: 'Role Player', right: 'Franchise Player' },
    { left: 'Bust', right: 'All-Time Great' },
    { left: 'Forgotten', right: 'Legendary' },
    { left: 'Old School', right: 'Modern Game' },
    { left: 'Average', right: 'Dominant' },
    { left: 'Soft', right: 'Physical' },
    { left: 'One Dimensional', right: 'Complete Player' },
  ],
};

/** Shuffle prompts for the given league, pick 5, assign random targets */
function getRoundPrompts(league: string): RoundData[] {
  const prompts = [...(SPECTRUM_PROMPTS[league] || SPECTRUM_PROMPTS.NBA)];
  // Fisher-Yates shuffle
  for (let i = prompts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [prompts[i], prompts[j]] = [prompts[j], prompts[i]];
  }
  return prompts.slice(0, ROUNDS_PER_GAME).map((p) => ({
    leftLabel: p.left,
    rightLabel: p.right,
    targetPosition: Math.floor(Math.random() * 81) + 10, // 10–90
  }));
}

const DEFAULT_PLAYERS = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function calcScore(guess: number, target: number): number {
  const diff = Math.abs(guess - target);
  if (diff <= 10) return 4;
  if (diff <= 20) return 3;
  if (diff <= 30) return 2;
  return 1;
}

function scoreLabel(score: number): string {
  if (score === 4) return 'BULLSEYE! 🎯';
  if (score === 3) return 'SO CLOSE! 🔥';
  if (score === 2) return 'NOT BAD! 👍';
  return 'KEEP PRACTICING 😅';
}

function totalPerf(score: number): string {
  if (score >= 18) return 'Telepathic';
  if (score >= 14) return 'Dialed In';
  if (score >= 10) return 'Getting Warm';
  return 'Off the Mark';
}

// ---------------------------------------------------------------------------
// Sub-component: Dial slider
// ---------------------------------------------------------------------------

interface DialProps {
  position: number; // 0–100
  targetPosition?: number; // only shown in reveal
  showTarget: boolean;
  interactive: boolean;
  leftLabel: string;
  rightLabel: string;
  onPositionChange?: (p: number) => void;
}

function Dial({
  position,
  targetPosition = 50,
  showTarget,
  interactive,
  leftLabel,
  rightLabel,
  onPositionChange,
}: DialProps) {
  // Refs that stay fresh every render — never captured stale in PanResponder
  const trackRef = useRef<View>(null);
  const interactiveRef = useRef(interactive);
  const onChangeRef = useRef(onPositionChange);
  const layoutRef = useRef({ left: 0, width: 1 }); // filled by measure()

  interactiveRef.current = interactive;
  onChangeRef.current = onPositionChange;

  // Created once; all mutable state accessed only through refs
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => interactiveRef.current,
      onMoveShouldSetPanResponder: () => interactiveRef.current,
      onPanResponderGrant: (e) => {
        if (!interactiveRef.current) return;
        const raw =
          ((e.nativeEvent.pageX - layoutRef.current.left) /
            layoutRef.current.width) *
          100;
        onChangeRef.current?.(Math.min(100, Math.max(0, raw)));
      },
      onPanResponderMove: (_, gs) => {
        if (!interactiveRef.current) return;
        const raw =
          ((gs.moveX - layoutRef.current.left) / layoutRef.current.width) *
          100;
        onChangeRef.current?.(Math.min(100, Math.max(0, raw)));
      },
    }),
  ).current;

  // Measure the track's real screen position after every layout change
  const onLayout = useCallback(() => {
    trackRef.current?.measure((_x, _y, width, _h, pageX) => {
      if (width > 0) {
        layoutRef.current = { left: pageX, width };
      }
    });
  }, []);

  // Percentage-based positions — no hardcoded pixel math needed
  const zoneStart = Math.max(0, targetPosition - 15);
  const zoneEnd = Math.min(100, targetPosition + 15);

  return (
    <View style={dialStyles.wrapper}>
      {/* Track + needle container — PanResponder lives here */}
      <View
        ref={trackRef}
        style={dialStyles.trackContainer}
        onLayout={onLayout}
        {...panResponder.panHandlers}
      >
        {/* Track bar */}
        <View style={dialStyles.track}>
          {/* Brand fill from left edge to needle */}
          <View style={[dialStyles.fill, { width: `${position}%` }]} />

          {/* Target zone (reveal only) */}
          {showTarget && (
            <View
              style={[
                dialStyles.targetZone,
                { left: `${zoneStart}%`, width: `${zoneEnd - zoneStart}%` },
              ]}
            />
          )}
        </View>

        {/* Target center tick — sits above/below the track (reveal only) */}
        {showTarget && (
          <View
            style={[
              dialStyles.targetTick,
              { left: `${targetPosition}%`, transform: [{ translateX: -1.5 }] },
            ]}
          />
        )}

        {/* Target dot on track (reveal only) */}
        {showTarget && (
          <View
            style={[
              dialStyles.targetDot,
              { left: `${targetPosition}%`, transform: [{ translateX: -8 }] },
            ]}
          />
        )}

        {/* Draggable needle */}
        <View
          style={[
            dialStyles.needle,
            { left: `${position}%`, transform: [{ translateX: -NEEDLE_SIZE / 2 }] },
          ]}
        >
          <View style={dialStyles.needleInner} />
        </View>
      </View>

      {/* Spectrum labels */}
      <View style={dialStyles.labelsRow}>
        <Text style={dialStyles.labelLeft} numberOfLines={2}>{leftLabel}</Text>
        <Text style={dialStyles.labelRight} numberOfLines={2}>{rightLabel}</Text>
      </View>
    </View>
  );
}

const dialStyles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: spacing.lg,
  },
  trackContainer: {
    height: 56,        // tall enough for comfortable touch + needle
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    height: 8,
    backgroundColor: '#383838',
    borderRadius: 4,
    overflow: 'visible',
    position: 'relative',
  },
  fill: {
    height: 8,
    backgroundColor: colors.brand,
    borderRadius: 4,
  },
  targetZone: {
    position: 'absolute',
    top: 0,
    height: 8,
    backgroundColor: 'rgba(0,200,151,0.30)',
    borderRadius: 4,
  },
  targetTick: {
    position: 'absolute',
    // vertically centered in trackContainer (56px tall), tick is 32px tall
    top: (56 - 32) / 2,
    width: 3,
    height: 32,
    backgroundColor: colors.accentGreen,
    borderRadius: 2,
  },
  targetDot: {
    position: 'absolute',
    // vertically centered in trackContainer
    top: (56 - 16) / 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accentGreen,
    borderWidth: 2,
    borderColor: darkColors.surfaceElevated,
  },
  needle: {
    position: 'absolute',
    // vertically centered in trackContainer (56px tall)
    top: (56 - NEEDLE_SIZE) / 2,
    width: NEEDLE_SIZE,
    height: NEEDLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  needleInner: {
    width: NEEDLE_SIZE,
    height: NEEDLE_SIZE,
    borderRadius: NEEDLE_SIZE / 2,
    backgroundColor: colors.brand,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.25)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.6)',
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  labelLeft: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: darkColors.textSecondary,
    maxWidth: '40%',
    textAlign: 'left',
  },
  labelRight: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: darkColors.textSecondary,
    maxWidth: '40%',
    textAlign: 'right',
  },
});

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface Props {
  onBack: () => void;
  onNavigate: (tab: Tab) => void;
}

const FETCH_COUNT = 10;

export default function WavelengthScreen({ onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('lobby');
  const [players, setPlayers] = useState<string[]>([...DEFAULT_PLAYERS]);
  const [rounds, setRounds] = useState<RoundData[]>(() => getRoundPrompts('NBA'));
  const [roundIndex, setRoundIndex] = useState(0);
  const [dialPosition, setDialPosition] = useState(50);
  const [clueText, setClueText] = useState('');
  const [roundScores, setRoundScores] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);

  // ── Player names for clue suggestions ──
  const [selectedLeague, setSelectedLeague] = useState('NBA');
  const [clueOptions, setClueOptions] = useState<string[]>([]);

  useEffect(() => {
    getNormalPlayers('NBA').then((players) => {
      setClueOptions([...players].sort(() => Math.random() - 0.5).slice(0, FETCH_COUNT).map((p) => p.name));
    });
  }, []);

  const handleLeagueChange = useCallback((league: string) => {
    setSelectedLeague(league);
    getNormalPlayers(league).then((players) => {
      setClueOptions([...players].sort(() => Math.random() - 0.5).slice(0, FETCH_COUNT).map((p) => p.name));
    });
  }, []);

  const round = rounds[roundIndex];
  const clueGiverIndex = roundIndex % players.length;
  const clueGiverName = players[clueGiverIndex] || `Player ${clueGiverIndex + 1}`;
  const totalScore = roundScores.reduce((a, b) => a + b, 0);
  const currentScore = calcScore(dialPosition, round.targetPosition);

  // ── Lobby handlers ────────────────────────────────────────────────────────

  function updatePlayer(index: number, name: string) {
    setPlayers((prev) => prev.map((p, i) => (i === index ? name : p)));
  }

  function addPlayer() {
    if (players.length >= 6) return;
    setPlayers((prev) => [...prev, `Player ${prev.length + 1}`]);
  }

  function removePlayer() {
    if (players.length <= 2) return;
    setPlayers((prev) => prev.slice(0, -1));
  }

  function startGame() {
    setRounds(getRoundPrompts(selectedLeague));
    setRoundIndex(0);
    setRoundScores([]);
    setGameOver(false);
    setPhase('setup');
  }

  // ── Round handlers ────────────────────────────────────────────────────────

  function handleRevealTarget() {
    setPhase('clue');
  }

  function handleGiveClue() {
    if (!clueText.trim()) return;
    setDialPosition(50);
    setPhase('guess');
  }

  function handleLockGuess() {
    setPhase('reveal');
  }

  function handleNext() {
    const score = calcScore(dialPosition, round.targetPosition);
    const newScores = [...roundScores, score];
    setRoundScores(newScores);

    if (roundIndex >= rounds.length - 1) {
      setGameOver(true);
      const xp = calculateMultiplayerXP(newScores.length);
      setXpEarned(xp);
      void (async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await saveGameResult(user.id, 'wavelength', xp, newScores.reduce((a, b) => a + b, 0));
          await updateUserXPAndStreak(user.id, xp, false);
        }
      })();
    } else {
      setRoundIndex(roundIndex + 1);
      setClueText('');
      setDialPosition(50);
      setPhase('setup');
    }
  }

  function handlePlayAgain() {
    setRounds(getRoundPrompts(selectedLeague));
    setRoundIndex(0);
    setRoundScores([]);
    setClueText('');
    setDialPosition(50);
    setGameOver(false);
    setXpEarned(null);
    setPhase('lobby');
  }

  // ── GAME OVER ─────────────────────────────────────────────────────────────

  if (gameOver) {
    const finalTotal = roundScores.reduce((a, b) => a + b, 0);
    return (
      <SafeAreaView edges={['top']} style={styles.root}>
        <View style={styles.zone1}>
          <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
            <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.zone1Title}>WAVELENGTH</Text>
          <Text style={styles.zone1Sub}>GAME OVER</Text>
        </View>

        <ScrollView style={styles.zone2} contentContainerStyle={styles.zone2Content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.resultScore}>
              {finalTotal}
              <Text style={styles.resultMax}>/20</Text>
            </Text>
            <Text style={styles.resultPerf}>{totalPerf(finalTotal)}</Text>

            {xpEarned !== null && (
              <View style={styles.xpCard}>
                <Text style={styles.xpCardLabel}>⭐ XP EARNED</Text>
                <Text style={styles.xpCardTotal}>+{xpEarned}</Text>
                <Text style={styles.xpCardBreakdown}>Multiplayer Bonus: {xpEarned} XP</Text>
              </View>
            )}

            <View style={styles.divider} />

            {roundScores.map((s, i) => (
              <View key={i} style={styles.resultRow}>
                <View style={styles.resultRowLeft}>
                  <Text style={styles.resultRoundLabel}>Round {i + 1}</Text>
                  <Text style={styles.resultRoundSpec}>
                    {rounds[i].leftLabel} ↔ {rounds[i].rightLabel}
                  </Text>
                </View>
                <View style={[
                  styles.resultScorePill,
                  s === 4 && styles.pillPerfect,
                  s <= 1 && styles.pillLow,
                ]}>
                  <Text style={styles.resultScorePillText}>{s} pt{s !== 1 ? 's' : ''}</Text>
                </View>
              </View>
            ))}

            <View style={styles.divider} />

            <PrimaryButton label="PLAY AGAIN" onPress={handlePlayAgain} />
            <GhostButton label="BACK TO GAMES" onPress={onBack} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── LOBBY ─────────────────────────────────────────────────────────────────

  if (phase === 'lobby') {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView edges={['top']} style={styles.root}>
          <View style={styles.zone1}>
            <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
              <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
            </Pressable>
            <Text style={styles.zone1Title}>WAVELENGTH</Text>
            <Text style={styles.zone1Sub}>WHO'S PLAYING?</Text>
          </View>

          <ScrollView style={styles.zone2} contentContainerStyle={styles.zone2Content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {/* League Switcher */}
            <LeagueSwitcher selected={selectedLeague} onChange={handleLeagueChange} />

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>PLAYERS ({players.length})</Text>
                <View style={styles.countControls}>
                  <Pressable
                    onPress={removePlayer}
                    disabled={players.length <= 2}
                    style={[styles.countBtn, players.length <= 2 && { opacity: 0.3 }]}
                    hitSlop={8}
                  >
                    <Minus size={18} color={darkColors.text} strokeWidth={2.5} />
                  </Pressable>
                  <Pressable
                    onPress={addPlayer}
                    disabled={players.length >= 6}
                    style={[styles.countBtn, players.length >= 6 && { opacity: 0.3 }]}
                    hitSlop={8}
                  >
                    <Plus size={18} color={darkColors.text} strokeWidth={2.5} />
                  </Pressable>
                </View>
              </View>

              {players.map((name, i) => (
                <View key={i} style={styles.playerRow}>
                  <View style={styles.playerBadge}>
                    <Text style={styles.playerBadgeText}>{i + 1}</Text>
                  </View>
                  <TextInput
                    style={styles.playerInput}
                    value={name}
                    onChangeText={(t) => updatePlayer(i, t)}
                    placeholder={`Player ${i + 1}`}
                    placeholderTextColor={darkColors.textSecondary}
                    maxLength={20}
                    returnKeyType="done"
                  />
                </View>
              ))}

              <View style={{ marginTop: spacing.sm }}>
                <PrimaryButton label="START GAME" onPress={startGame} />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

  // ── SETUP — pass device to clue-giver ─────────────────────────────────────

  if (phase === 'setup') {
    return (
      <SafeAreaView edges={['top']} style={styles.root}>
        <View style={styles.zone1}>
          <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
            <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.zone1Title}>WAVELENGTH</Text>
          <Text style={styles.zone1Round}>ROUND {roundIndex + 1} OF {rounds.length}</Text>
          <View style={styles.dotsRow}>
            <RoundProgressDots total={rounds.length} current={roundIndex + 1} />
          </View>
        </View>

        <View style={styles.zone2}>
          <View style={styles.passInterstitial}>
            <View style={styles.passAvatarRing}>
              <Text style={styles.passAvatarInitial}>
                {clueGiverName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.passLabel}>PASS TO</Text>
            <Text style={styles.passName}>{clueGiverName}</Text>
            <Text style={styles.passCaption}>
              Others, look away while the clue-giver sees the target
            </Text>
            <View style={styles.passBtn}>
              <PrimaryButton label="TAP TO REVEAL TARGET" onPress={handleRevealTarget} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── CLUE — clue-giver sees target, types athlete ──────────────────────────

  if (phase === 'clue') {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView edges={['top']} style={styles.root}>
          <View style={styles.zone1}>
            <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
              <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
            </Pressable>
            <Text style={styles.zone1Title}>WAVELENGTH</Text>
            <Text style={styles.zone1Round}>ROUND {roundIndex + 1} OF {rounds.length}</Text>
            <View style={styles.dotsRow}>
              <RoundProgressDots total={rounds.length} current={roundIndex + 1} />
            </View>
          </View>

          <ScrollView style={styles.zone2} contentContainerStyle={styles.zone2Content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.phaseTag}>
              <Text style={styles.phaseTagText}>CLUE-GIVER: {clueGiverName.toUpperCase()}</Text>
            </View>

            <Text style={styles.instruction}>
              The target is highlighted on the spectrum below. Name an athlete who represents that position.
            </Text>

            {/* Dial showing target */}
            <View style={styles.dialCard}>
              <Dial
                position={50}
                targetPosition={round.targetPosition}
                showTarget
                interactive={false}
                leftLabel={round.leftLabel}
                rightLabel={round.rightLabel}
              />
            </View>

            {/* Clue input */}
            <View style={styles.card}>
              <Text style={styles.inputLabel}>YOUR CLUE (athlete name)</Text>
              <TextInput
                style={styles.clueInput}
                value={clueText}
                onChangeText={setClueText}
                placeholder="e.g. LeBron James..."
                placeholderTextColor={darkColors.textSecondary}
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={handleGiveClue}
              />

              {/* Quick-pick athlete chips */}
              {clueOptions.length > 0 && (
                <View style={styles.chipsWrap}>
                  <Text style={styles.inputLabel}>OR TAP A PLAYER</Text>
                  <View style={styles.chipsRow}>
                    {clueOptions.map((name) => (
                      <Pressable
                        key={name}
                        onPress={() => setClueText(name)}
                        style={[
                          styles.chip,
                          clueText === name && styles.chipSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            clueText === name && styles.chipTextSelected,
                          ]}
                          numberOfLines={1}
                        >
                          {name}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

              <PrimaryButton
                label="GIVE CLUE"
                onPress={handleGiveClue}
                disabled={!clueText.trim()}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

  // ── GUESS — guessers interact with dial ───────────────────────────────────

  if (phase === 'guess') {
    return (
      <SafeAreaView edges={['top']} style={styles.root}>
        <View style={styles.zone1}>
          <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
            <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.zone1Title}>WAVELENGTH</Text>
          <Text style={styles.zone1Round}>ROUND {roundIndex + 1} OF {rounds.length}</Text>
          <View style={styles.dotsRow}>
            <RoundProgressDots total={rounds.length} current={roundIndex + 1} />
          </View>
        </View>

        <ScrollView style={styles.zone2} contentContainerStyle={styles.zone2Content} showsVerticalScrollIndicator={false}>
          <View style={styles.phaseTag}>
            <Text style={styles.phaseTagText}>GUESSERS — DISCUSS AND DRAG</Text>
          </View>

          {/* Clue display */}
          <View style={styles.clueDisplay}>
            <Text style={styles.clueDisplayMeta}>THE CLUE</Text>
            <Text style={styles.clueDisplayText}>{clueText}</Text>
          </View>

          {/* Interactive dial */}
          <View style={styles.dialCard}>
            <Dial
              position={dialPosition}
              showTarget={false}
              interactive
              leftLabel={round.leftLabel}
              rightLabel={round.rightLabel}
              onPositionChange={setDialPosition}
            />
          </View>

          <Text style={styles.posDisplay}>{Math.round(dialPosition)}%</Text>

          <View style={styles.actionRow}>
            <PrimaryButton label="LOCK IN GUESS" onPress={handleLockGuess} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── REVEAL ────────────────────────────────────────────────────────────────

  if (phase === 'reveal') {
    const score = calcScore(dialPosition, round.targetPosition);
    return (
      <SafeAreaView edges={['top']} style={styles.root}>
        <View style={styles.zone1}>
          <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
            <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.zone1Title}>WAVELENGTH</Text>
          <Text style={styles.zone1Round}>ROUND {roundIndex + 1} OF {rounds.length}</Text>
          <View style={styles.dotsRow}>
            <RoundProgressDots total={rounds.length} current={roundIndex + 1} />
          </View>
        </View>

        <ScrollView style={styles.zone2} contentContainerStyle={styles.zone2Content} showsVerticalScrollIndicator={false}>
          {/* Score badge */}
          <View style={[
            styles.scoreBadge,
            score === 4 && styles.scoreBadgePerfect,
            score <= 1 && styles.scoreBadgeLow,
          ]}>
            <Text style={[styles.scoreBadgePts, score === 4 && { color: colors.accentGreen }]}>
              +{score} PTS
            </Text>
            <Text style={styles.scoreBadgeLabel}>{scoreLabel(score)}</Text>
          </View>

          {/* Dial with target */}
          <View style={styles.dialCard}>
            <Dial
              position={dialPosition}
              targetPosition={round.targetPosition}
              showTarget
              interactive={false}
              leftLabel={round.leftLabel}
              rightLabel={round.rightLabel}
            />
          </View>

          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.brand }]} />
              <Text style={styles.legendText}>Your guess ({Math.round(dialPosition)})</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.accentGreen }]} />
              <Text style={styles.legendText}>Target ({round.targetPosition})</Text>
            </View>
          </View>

          {/* Running total */}
          <View style={styles.card}>
            <View style={styles.runningTotalRow}>
              <Text style={styles.runningTotalLabel}>RUNNING TOTAL</Text>
              <Text style={styles.runningTotalScore}>
                {totalScore + score}
                <Text style={styles.runningTotalMax}>/20</Text>
              </Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <PrimaryButton
              label={roundIndex >= rounds.length - 1 ? 'SEE RESULTS' : 'NEXT ROUND'}
              onPress={handleNext}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// Styles
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
    paddingBottom: spacing['3xl'] + spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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
  zone1Round: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.md,
  },
  dotsRow: {
    marginTop: spacing.xs,
  },

  // ── Zone 2 ──────────────────────────────────────────────────────────────
  zone2: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    zIndex: 1,
  },
  zone2Content: {
    paddingTop: spacing['4xl'],
    paddingHorizontal: spacing.lg,
    paddingBottom: 48,
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
  dialCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: radius.primary,
    paddingVertical: spacing['2xl'],
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

  // ── Phase tag ────────────────────────────────────────────────────────────
  phaseTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(252,52,92,0.15)',
    borderRadius: radius.chip,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  phaseTagText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.brand,
  },

  instruction: {
    fontFamily: fontFamily.regular,
    fontWeight: '700',
    fontSize: 15,
    color: darkColors.textSecondary,
    lineHeight: 22,
  },

  // ── Inputs ───────────────────────────────────────────────────────────────
  inputLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 1.5,
    color: darkColors.textSecondary,
  },
  clueInput: {
    backgroundColor: darkColors.background,
    borderRadius: radius.secondary,
    borderWidth: 1,
    borderColor: darkColors.border,
    height: 48,
    paddingHorizontal: spacing.lg,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    color: darkColors.text,
  },

  // ── Clue display (guess phase) ────────────────────────────────────────────
  clueDisplay: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: radius.primary,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
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
  clueDisplayMeta: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2,
    color: darkColors.textSecondary,
  },
  clueDisplayText: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 28,
    color: colors.accentCyan,
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  posDisplay: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 40,
    color: colors.brand,
    textAlign: 'center',
    letterSpacing: 1,
    marginVertical: -spacing.sm,
  },

  // ── Lobby ─────────────────────────────────────────────────────────────────
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1.5,
    color: darkColors.textSecondary,
  },
  countControls: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  countBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: darkColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  playerBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.brandAlpha15,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  playerBadgeText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 14,
    color: colors.brand,
  },
  playerInput: {
    flex: 1,
    height: 44,
    backgroundColor: darkColors.background,
    borderRadius: radius.secondary,
    borderWidth: 1,
    borderColor: darkColors.border,
    paddingHorizontal: spacing.md,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 15,
    color: darkColors.text,
  },

  // ── Pass interstitial ────────────────────────────────────────────────────
  passInterstitial: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  passAvatarRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(252,52,92,0.15)',
    borderWidth: 2,
    borderColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passAvatarInitial: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 32,
    color: colors.brand,
  },
  passLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 3,
    color: darkColors.textSecondary,
    marginBottom: -spacing.md,
  },
  passName: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 32,
    color: darkColors.text,
    letterSpacing: 0.5,
  },
  passCaption: {
    fontFamily: fontFamily.regular,
    fontWeight: '700',
    fontSize: 14,
    color: darkColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  passBtn: {
    width: '100%',
    marginTop: spacing.sm,
  },

  // ── Reveal ───────────────────────────────────────────────────────────────
  scoreBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(252,52,92,0.12)',
    borderRadius: radius.primary,
    padding: spacing.lg,
    gap: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.4)',
  },
  scoreBadgePerfect: {
    backgroundColor: 'rgba(0,200,151,0.12)',
  },
  scoreBadgeLow: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  scoreBadgePts: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 40,
    color: colors.brand,
    letterSpacing: 1,
    lineHeight: 44,
  },
  scoreBadgeLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    color: darkColors.text,
    letterSpacing: 0.5,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: darkColors.textSecondary,
  },
  runningTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  runningTotalLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1.5,
    color: darkColors.textSecondary,
  },
  runningTotalScore: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 28,
    color: colors.brand,
  },
  runningTotalMax: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    color: darkColors.textSecondary,
  },

  // ── Results ───────────────────────────────────────────────────────────────
  resultScore: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 72,
    color: colors.brand,
    lineHeight: 72,
    textAlign: 'center',
  },
  resultMax: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 32,
    color: darkColors.textSecondary,
  },
  resultPerf: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 24,
    color: darkColors.text,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: darkColors.border,
    marginVertical: spacing.sm,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  resultRowLeft: {
    flex: 1,
    gap: 2,
    marginRight: spacing.md,
  },
  resultRoundLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: darkColors.text,
  },
  resultRoundSpec: {
    fontFamily: fontFamily.regular,
    fontWeight: '700',
    fontSize: 12,
    color: darkColors.textSecondary,
  },
  resultScorePill: {
    backgroundColor: 'rgba(252,52,92,0.12)',
    borderRadius: radius.chip,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    minWidth: 56,
    alignItems: 'center',
  },
  pillPerfect: {
    backgroundColor: 'rgba(0,200,151,0.15)',
  },
  pillLow: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  resultScorePillText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: darkColors.text,
  },

  actionRow: {
    width: '100%',
  },

  // ── Loading row (lobby) ─────────────────────────────────────────────────
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  loadingRowText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: darkColors.textSecondary,
  },

  // ── Clue chips ──────────────────────────────────────────────────────────
  chipsWrap: {
    gap: spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: darkColors.background,
    borderRadius: radius.chip,
    borderWidth: 1,
    borderColor: darkColors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  chipSelected: {
    backgroundColor: colors.brandAlpha15,
    borderColor: colors.brand,
  },
  chipText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: darkColors.textSecondary,
  },
  chipTextSelected: {
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
    width: '100%',
  },
  xpCardLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1,
    color: '#9A9A9A',
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
    color: '#9A9A9A',
  },
});
