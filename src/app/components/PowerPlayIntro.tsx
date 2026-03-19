import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap } from 'lucide-react-native';
import { colors, fontFamily, spacing } from '../../styles/theme';

const { width: W } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

// Sample answers matching the Remotion composition
const ANSWERS = [
  { text: 'Nikola Jokić',          points: 38 },
  { text: 'Giannis Antetokounmpo', points: 31 },
  { text: 'LeBron James',          points: 16 },
  { text: 'Joel Embiid',           points: 10 },
  { text: 'Luka Dončić',           points: 5  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Scene 1 — Brand Burst
// ─────────────────────────────────────────────────────────────────────────────
function Scene1({ opacity }: { opacity: Animated.Value }) {
  const circleScale   = useRef(new Animated.Value(0)).current;
  const circleOpacity = useRef(new Animated.Value(0)).current;
  const zapScale      = useRef(new Animated.Value(0)).current;
  const titleY        = useRef(new Animated.Value(70)).current;
  const titleOpacity  = useRef(new Animated.Value(0)).current;
  const tagOpacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Circle burst (0-500ms)
    Animated.sequence([
      Animated.parallel([
        Animated.timing(circleOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.timing(circleScale,   { toValue: 20, duration: 450, useNativeDriver: true }),
      ]),
      Animated.timing(circleOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();

    // Zap icon springs in at 100ms
    setTimeout(() => {
      Animated.spring(zapScale, {
        toValue: 1,
        useNativeDriver: true,
        damping: 11,
        stiffness: 220,
      }).start();
    }, 100);

    // Title springs up at 200ms
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(titleY, { toValue: 0, useNativeDriver: true, damping: 16, stiffness: 170 }),
        Animated.timing(titleOpacity, { toValue: 1, duration: 280, useNativeDriver: true }),
      ]).start();
    }, 200);

    // Tagline fades in at 550ms
    setTimeout(() => {
      Animated.timing(tagOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, 550);
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.scene1, { opacity }]}>
      {/* Circle burst */}
      <Animated.View
        style={[
          styles.circle,
          { opacity: circleOpacity, transform: [{ scale: circleScale }] },
        ]}
      />

      {/* Zap icon */}
      <Animated.View style={{ transform: [{ scale: zapScale }], marginBottom: 16 }}>
        <Zap size={64} color={colors.brand} fill={colors.brand} strokeWidth={0} />
      </Animated.View>

      {/* POWER PLAY */}
      <Animated.Text
        style={[styles.titleText, { opacity: titleOpacity, transform: [{ translateY: titleY }] }]}
      >
        POWER PLAY
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text style={[styles.taglineText, { opacity: tagOpacity }]}>
        45 SECONDS · 5 QUESTIONS · NO MERCY
      </Animated.Text>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 2 — Game Mockup
// ─────────────────────────────────────────────────────────────────────────────
function Scene2({ opacity }: { opacity: Animated.Value }) {
  const cardY    = useRef(new Animated.Value(80)).current;
  const cardAlpha = useRef(new Animated.Value(0)).current;

  // One Animated.Value per answer (no hook inside map)
  const a0Op = useRef(new Animated.Value(0)).current;
  const a1Op = useRef(new Animated.Value(0)).current;
  const a2Op = useRef(new Animated.Value(0)).current;
  const a3Op = useRef(new Animated.Value(0)).current;
  const a4Op = useRef(new Animated.Value(0)).current;
  const a0X  = useRef(new Animated.Value(-48)).current;
  const a1X  = useRef(new Animated.Value(-48)).current;
  const a2X  = useRef(new Animated.Value(-48)).current;
  const a3X  = useRef(new Animated.Value(-48)).current;
  const a4X  = useRef(new Animated.Value(-48)).current;

  const answerOps = [a0Op, a1Op, a2Op, a3Op, a4Op];
  const answerXs  = [a0X,  a1X,  a2X,  a3X,  a4X];

  const timerWidth = useRef(new Animated.Value(W - 64)).current;

  useEffect(() => {
    // Card slides up immediately
    Animated.parallel([
      Animated.spring(cardY, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 160 }),
      Animated.timing(cardAlpha, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    // Answers stagger at 250ms intervals, starting 400ms in
    answerOps.forEach((op, i) => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(op, { toValue: 1, duration: 220, useNativeDriver: true }),
          Animated.spring(answerXs[i], { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 200 }),
        ]).start();
      }, 400 + i * 220);
    });

    // Timer drains after all answers are shown
    setTimeout(() => {
      Animated.timing(timerWidth, { toValue: 10, duration: 1400, useNativeDriver: false }).start();
    }, 400 + ANSWERS.length * 220 + 300);
  }, []);

  const ptColor = (pts: number) =>
    pts >= 30 ? colors.brand : pts >= 15 ? colors.brandMid : 'rgba(255,255,255,0.5)';

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.scene2, { opacity }]}>
      <Animated.View style={[styles.gameCard, { opacity: cardAlpha, transform: [{ translateY: cardY }] }]}>
        {/* League badge row */}
        <View style={styles.badgeRow}>
          <View style={styles.leagueBadge}>
            <Text style={styles.leagueBadgeText}>NBA</Text>
          </View>
          <Text style={styles.gameLabelText}>POWER PLAY</Text>
          <View style={styles.timerPill}>
            <Zap size={14} color={colors.brand} strokeWidth={2.5} />
            <Text style={styles.timerPillText}>45s</Text>
          </View>
        </View>

        {/* Question */}
        <View style={styles.questionCard}>
          <Text style={styles.questionMeta}>QUESTION 2 OF 5</Text>
          <Text style={styles.questionText}>
            Name an NBA Most Valuable Player from the last 5 years
          </Text>
        </View>

        {/* Answers */}
        {ANSWERS.map((answer, i) => (
          <Animated.View
            key={answer.text}
            style={[
              styles.answerRow,
              {
                opacity: answerOps[i],
                transform: [{ translateX: answerXs[i] }],
              },
            ]}
          >
            <Text style={styles.answerText}>{answer.text}</Text>
            <Text style={[styles.answerPoints, { color: ptColor(answer.points) }]}>
              {answer.points}
            </Text>
            <Text style={styles.answerPtsLabel}>pts</Text>
          </Animated.View>
        ))}

        {/* Timer bar */}
        <View style={styles.timerTrack}>
          <Animated.View style={[styles.timerFill, { width: timerWidth }]} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 3 — Results
// ─────────────────────────────────────────────────────────────────────────────
function Scene3({ opacity }: { opacity: Animated.Value }) {
  const scoreScale   = useRef(new Animated.Value(0.3)).current;
  const scoreOpacity = useRef(new Animated.Value(0)).current;
  const xpOpacity    = useRef(new Animated.Value(0)).current;
  const xpY          = useRef(new Animated.Value(36)).current;
  const ctaOpacity   = useRef(new Animated.Value(0)).current;
  const ctaY         = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    // Score explodes in
    Animated.parallel([
      Animated.timing(scoreOpacity, { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.spring(scoreScale, { toValue: 1, useNativeDriver: true, damping: 9, stiffness: 260 }),
    ]).start();

    // XP badge slides up at 400ms
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(xpOpacity, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.spring(xpY, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 200 }),
      ]).start();
    }, 400);

    // CTA at 800ms
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(ctaOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(ctaY, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 180 }),
      ]).start();
    }, 800);
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.scene3, { opacity }]}>
      {/* Score */}
      <Animated.View style={{ alignItems: 'center', transform: [{ scale: scoreScale }], opacity: scoreOpacity }}>
        <Text style={styles.finalLabel}>FINAL SCORE</Text>
        <Text style={styles.finalScore}>87</Text>
        <Text style={styles.finalOutOf}>out of 100</Text>
      </Animated.View>

      {/* XP badge */}
      <Animated.View
        style={[
          styles.xpBadge,
          { opacity: xpOpacity, transform: [{ translateY: xpY }] },
        ]}
      >
        <Text style={styles.xpText}>+935 XP</Text>
        <Text style={styles.xpEarned}>EARNED</Text>
      </Animated.View>

      {/* CTA */}
      <Animated.View
        style={[
          styles.ctaWrap,
          { opacity: ctaOpacity, transform: [{ translateY: ctaY }] },
        ]}
      >
        <View style={styles.ctaButton}>
          <Zap size={22} color={colors.white} fill={colors.white} strokeWidth={0} />
          <Text style={styles.ctaText}>PLAY NOW</Text>
        </View>
        <Text style={styles.ctaSub}>Daily · Free · All Leagues</Text>
      </Animated.View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root — manages scene cross-fades on a timeline
// ─────────────────────────────────────────────────────────────────────────────
export default function PowerPlayIntro({ onFinish }: Props) {
  const scene1Opacity = useRef(new Animated.Value(0)).current;
  const scene2Opacity = useRef(new Animated.Value(0)).current;
  const scene3Opacity = useRef(new Animated.Value(0)).current;

  // Collect timeouts for cleanup
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const t = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  };

  useEffect(() => {
    const CROSS = 320; // cross-fade duration ms

    // ── Scene 1 in (0ms)
    Animated.timing(scene1Opacity, { toValue: 1, duration: CROSS, useNativeDriver: true }).start();

    // ── Scene 1→2 at 2200ms
    t(() => {
      Animated.parallel([
        Animated.timing(scene1Opacity, { toValue: 0, duration: CROSS, useNativeDriver: true }),
        Animated.timing(scene2Opacity, { toValue: 1, duration: CROSS, useNativeDriver: true }),
      ]).start();
    }, 2200);

    // ── Scene 2→3 at 5600ms
    t(() => {
      Animated.parallel([
        Animated.timing(scene2Opacity, { toValue: 0, duration: CROSS, useNativeDriver: true }),
        Animated.timing(scene3Opacity, { toValue: 1, duration: CROSS, useNativeDriver: true }),
      ]).start();
    }, 5600);

    // ── Auto-finish at 8000ms
    t(onFinish, 8000);

    return () => timers.current.forEach(clearTimeout);
  }, []);

  return (
    <View style={styles.root}>
      <Scene1 opacity={scene1Opacity} />
      <Scene2 opacity={scene2Opacity} />
      <Scene3 opacity={scene3Opacity} />

      {/* Skip button — always visible */}
      <SafeAreaView style={styles.skipSafe} edges={['top']} pointerEvents="box-none">
        <Pressable onPress={onFinish} style={styles.skipBtn} hitSlop={12}>
          <Text style={styles.skipText}>SKIP</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },

  // ── Scene 1 ──────────────────────────────────────────────────────────────
  scene1: {
    backgroundColor: '#0F0F0F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.brand,
  },
  titleText: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 44,
    color: colors.white,
    letterSpacing: 6,
    textAlign: 'center',
    marginTop: 4,
  },
  taglineText: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 3,
    textAlign: 'center',
    marginTop: 20,
  },

  // ── Scene 2 ──────────────────────────────────────────────────────────────
  scene2: {
    backgroundColor: '#0F0F0F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  gameCard: {
    width: '100%',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  leagueBadge: {
    backgroundColor: colors.brand,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  leagueBadgeText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: colors.white,
    letterSpacing: 2,
  },
  gameLabelText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2,
    flex: 1,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(252,52,92,0.15)',
    borderWidth: 1,
    borderColor: colors.brand,
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  timerPillText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: colors.brand,
  },
  questionCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(252,52,92,0.2)',
  },
  questionMeta: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 10,
    color: colors.brand,
    letterSpacing: 3,
    marginBottom: 8,
  },
  questionText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 18,
    color: colors.white,
    lineHeight: 26,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  answerText: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 15,
    color: colors.white,
    flex: 1,
  },
  answerPoints: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 18,
  },
  answerPtsLabel: {
    fontFamily: fontFamily.regular,
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    marginLeft: 4,
  },
  timerTrack: {
    height: 6,
    backgroundColor: '#2A2A2A',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 12,
  },
  timerFill: {
    height: '100%',
    backgroundColor: colors.brand,
    borderRadius: 3,
  },

  // ── Scene 3 ──────────────────────────────────────────────────────────────
  scene3: {
    backgroundColor: '#0F0F0F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  finalLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 4,
    marginBottom: 4,
  },
  finalScore: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 96,
    color: colors.accentGreen,
    lineHeight: 96,
  },
  finalOutOf: {
    fontFamily: fontFamily.regular,
    fontWeight: '400',
    fontSize: 14,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 4,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(0,200,151,0.1)',
    borderWidth: 1.5,
    borderColor: colors.accentGreen,
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginTop: 24,
  },
  xpText: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 22,
    color: colors.accentGreen,
  },
  xpEarned: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
  },
  ctaWrap: {
    alignItems: 'center',
    marginTop: 40,
    gap: 12,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.brand,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 48,
  },
  ctaText: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 20,
    color: colors.white,
    letterSpacing: 3,
  },
  ctaSub: {
    fontFamily: fontFamily.regular,
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 2,
  },

  // ── Skip ─────────────────────────────────────────────────────────────────
  skipSafe: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
  },
  skipBtn: {
    alignSelf: 'flex-end',
    marginRight: spacing.lg,
    marginTop: spacing.md,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  skipText: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
  },
});
