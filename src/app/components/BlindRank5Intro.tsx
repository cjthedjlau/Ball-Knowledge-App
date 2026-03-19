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
import { Trophy } from 'lucide-react-native';
import { colors, fontFamily, spacing } from '../../styles/theme';

const { width: W } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

// Mock locked-in slots (already placed)
const LOCKED = [
  { slot: 1, name: 'Patrick Mahomes', team: 'KC'  },
  { slot: 2, name: 'Josh Allen',      team: 'BUF' },
  { slot: 3, name: 'Lamar Jackson',   team: 'BAL' },
];

// Current player being revealed
const CURRENT = { name: 'Jalen Hurts', team: 'PHI', pos: 'QB', stat: '3,858 YDS · 27 TDs' };

// ─────────────────────────────────────────────────────────────────────────────
// Scene 1 — Brand Burst
// ─────────────────────────────────────────────────────────────────────────────
function Scene1({ opacity }: { opacity: Animated.Value }) {
  const circleScale   = useRef(new Animated.Value(0)).current;
  const circleOpacity = useRef(new Animated.Value(0)).current;
  const iconScale     = useRef(new Animated.Value(0)).current;
  const titleY        = useRef(new Animated.Value(70)).current;
  const titleOpacity  = useRef(new Animated.Value(0)).current;
  const tagOpacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(circleOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.timing(circleScale,   { toValue: 20, duration: 450, useNativeDriver: true }),
      ]),
      Animated.timing(circleOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      Animated.spring(iconScale, {
        toValue: 1,
        useNativeDriver: true,
        damping: 11,
        stiffness: 220,
      }).start();
    }, 100);

    setTimeout(() => {
      Animated.parallel([
        Animated.spring(titleY, { toValue: 0, useNativeDriver: true, damping: 16, stiffness: 170 }),
        Animated.timing(titleOpacity, { toValue: 1, duration: 280, useNativeDriver: true }),
      ]).start();
    }, 200);

    setTimeout(() => {
      Animated.timing(tagOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, 550);
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.scene1, { opacity }]}>
      <Animated.View
        style={[styles.circle, { opacity: circleOpacity, transform: [{ scale: circleScale }] }]}
      />
      {/* Ranking badge */}
      <Animated.View style={{ transform: [{ scale: iconScale }], marginBottom: 16, alignItems: 'center' }}>
        <View style={styles.rankBadgeRow}>
          {['1', '2', '3'].map((n) => (
            <View key={n} style={styles.rankNumBox}>
              <Text style={styles.rankNumText}>{n}</Text>
            </View>
          ))}
        </View>
        <Trophy size={40} color={colors.brand} strokeWidth={2} style={{ marginTop: 10 }} />
      </Animated.View>

      <Animated.Text
        style={[styles.titleText, { opacity: titleOpacity, transform: [{ translateY: titleY }] }]}
      >
        BLIND RANK 5
      </Animated.Text>

      <Animated.Text style={[styles.taglineText, { opacity: tagOpacity }]}>
        5 REVEALS · LOCK IT IN · NO REDO
      </Animated.Text>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 2 — Game Mockup
// ─────────────────────────────────────────────────────────────────────────────
function Scene2({ opacity }: { opacity: Animated.Value }) {
  const cardY     = useRef(new Animated.Value(-80)).current;
  const cardAlpha = useRef(new Animated.Value(0)).current;

  const s0Op = useRef(new Animated.Value(0)).current;
  const s1Op = useRef(new Animated.Value(0)).current;
  const s2Op = useRef(new Animated.Value(0)).current;
  const s3Op = useRef(new Animated.Value(0)).current;
  const s4Op = useRef(new Animated.Value(0)).current;

  const slotOps = [s0Op, s1Op, s2Op, s3Op, s4Op];

  // Slot 4 (index 3) pulse for "pick me" effect
  const slot4Pulse = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    // Current player card drops in from top
    Animated.parallel([
      Animated.spring(cardY, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 150 }),
      Animated.timing(cardAlpha, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    // Slots stagger in
    slotOps.forEach((op, i) => {
      setTimeout(() => {
        Animated.timing(op, { toValue: 1, duration: 220, useNativeDriver: true }).start();
      }, 350 + i * 160);
    });

    // Slot 4 pulses after all slots are shown
    const pulseDelay = 350 + 5 * 160 + 200;
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(slot4Pulse, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(slot4Pulse, { toValue: 0.35, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    }, pulseDelay);
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.scene2, { opacity }]}>
      {/* Header */}
      <View style={styles.badgeRow}>
        <View style={styles.leagueBadge}>
          <Text style={styles.leagueBadgeText}>NFL</Text>
        </View>
        <Text style={styles.gameLabelText}>BLIND RANK 5</Text>
        <View style={styles.revealPill}>
          <Text style={styles.revealPillText}>REVEAL 4 OF 5</Text>
        </View>
      </View>

      {/* Current player card */}
      <Animated.View
        style={[styles.currentPlayerCard, { opacity: cardAlpha, transform: [{ translateY: cardY }] }]}
      >
        <View style={styles.currentPlayerTop}>
          <View style={styles.currentPlayerSilhouette}>
            <Text style={styles.silhouetteQ}>?</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.currentPlayerName}>{CURRENT.name}</Text>
            <Text style={styles.currentPlayerMeta}>{CURRENT.team} · {CURRENT.pos}</Text>
            <Text style={styles.currentPlayerStat}>{CURRENT.stat}</Text>
          </View>
        </View>
        <Text style={styles.instructionText}>TAP A SLOT TO PLACE</Text>
      </Animated.View>

      {/* Slots */}
      <View style={styles.slotsContainer}>
        {[1, 2, 3, 4, 5].map((slotNum, i) => {
          const locked = LOCKED.find(l => l.slot === slotNum);
          const isActive = slotNum === 4;

          if (locked) {
            return (
              <Animated.View key={slotNum} style={[styles.slotFilled, { opacity: slotOps[i] }]}>
                <Text style={styles.slotNumber}>{slotNum}</Text>
                <Text style={styles.slotPlayerName}>{locked.name}</Text>
                <Text style={styles.slotTeam}>{locked.team}</Text>
              </Animated.View>
            );
          }

          return (
            <Animated.View
              key={slotNum}
              style={[
                styles.slotEmpty,
                isActive && styles.slotActive,
                { opacity: isActive ? slot4Pulse : slotOps[i] },
              ]}
            >
              <Text style={[styles.slotNumber, isActive && { color: colors.brand }]}>{slotNum}</Text>
              <Text style={styles.slotEmptyLabel}>OPEN</Text>
            </Animated.View>
          );
        })}
      </View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 3 — Results
// ─────────────────────────────────────────────────────────────────────────────
function Scene3({ opacity }: { opacity: Animated.Value }) {
  const headingOpacity = useRef(new Animated.Value(0)).current;
  const headingY       = useRef(new Animated.Value(-24)).current;

  const r0Op = useRef(new Animated.Value(0)).current;
  const r1Op = useRef(new Animated.Value(0)).current;
  const r2Op = useRef(new Animated.Value(0)).current;
  const r0X  = useRef(new Animated.Value(40)).current;
  const r1X  = useRef(new Animated.Value(40)).current;
  const r2X  = useRef(new Animated.Value(40)).current;

  const xpOpacity = useRef(new Animated.Value(0)).current;
  const xpY       = useRef(new Animated.Value(24)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const ctaY       = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headingOpacity, { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.spring(headingY, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 200 }),
    ]).start();

    [[r0Op, r0X], [r1Op, r1X], [r2Op, r2X]].forEach(([op, x], i) => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(op as Animated.Value, { toValue: 1, duration: 220, useNativeDriver: true }),
          Animated.spring(x as Animated.Value, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 200 }),
        ]).start();
      }, 250 + i * 200);
    });

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(xpOpacity, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.spring(xpY, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 200 }),
      ]).start();
    }, 1100);

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(ctaOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(ctaY, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 180 }),
      ]).start();
    }, 1500);
  }, []);

  const RESULTS = [
    { slot: 1, player: 'Mahomes', pct: 71, tag: 'MAJORITY PICK' },
    { slot: 3, player: 'Lamar Jackson', pct: 58, tag: 'MAJORITY PICK' },
    { slot: 4, player: 'Jalen Hurts', pct: 43, tag: 'AGAINST THE CROWD' },
  ];

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.scene3, { opacity }]}>
      <Animated.View style={{ alignItems: 'center', opacity: headingOpacity, transform: [{ translateY: headingY }] }}>
        <Text style={styles.resultsLabel}>CROWD RESULTS</Text>
        <Text style={styles.resultsScore}>3 / 5</Text>
        <Text style={styles.resultsSubLabel}>slots matched the majority</Text>
      </Animated.View>

      <View style={styles.resultsRows}>
        {RESULTS.map(({ slot, player, pct, tag }, i) => {
          const rowOps = [r0Op, r1Op, r2Op];
          const rowXs  = [r0X,  r1X,  r2X];
          const isMajority = tag === 'MAJORITY PICK';
          return (
            <Animated.View
              key={slot}
              style={[
                styles.resultRow,
                { opacity: rowOps[i], transform: [{ translateX: rowXs[i] }] },
              ]}
            >
              <View style={styles.resultSlotBadge}>
                <Text style={styles.resultSlotNum}>{slot}</Text>
              </View>
              <Text style={styles.resultPlayerName}>{player}</Text>
              <View style={{ flex: 1, alignItems: 'flex-end', gap: 2 }}>
                <Text style={styles.resultPct}>{pct}%</Text>
                <Text style={[styles.resultTag, isMajority ? styles.tagGreen : styles.tagBrand]}>
                  {tag}
                </Text>
              </View>
            </Animated.View>
          );
        })}
      </View>

      <Animated.View style={[styles.xpBadge, { opacity: xpOpacity, transform: [{ translateY: xpY }] }]}>
        <Text style={styles.xpText}>+420 XP</Text>
        <Text style={styles.xpEarned}>EARNED</Text>
      </Animated.View>

      <Animated.View style={[styles.ctaWrap, { opacity: ctaOpacity, transform: [{ translateY: ctaY }] }]}>
        <View style={styles.ctaButton}>
          <Trophy size={22} color={colors.white} strokeWidth={2} />
          <Text style={styles.ctaText}>PLAY NOW</Text>
        </View>
        <Text style={styles.ctaSub}>Daily · Free · All Leagues</Text>
      </Animated.View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────────────────────
export default function BlindRank5Intro({ onFinish }: Props) {
  const scene1Opacity = useRef(new Animated.Value(0)).current;
  const scene2Opacity = useRef(new Animated.Value(0)).current;
  const scene3Opacity = useRef(new Animated.Value(0)).current;

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const t = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  };

  useEffect(() => {
    const CROSS = 320;

    Animated.timing(scene1Opacity, { toValue: 1, duration: CROSS, useNativeDriver: true }).start();

    t(() => {
      Animated.parallel([
        Animated.timing(scene1Opacity, { toValue: 0, duration: CROSS, useNativeDriver: true }),
        Animated.timing(scene2Opacity, { toValue: 1, duration: CROSS, useNativeDriver: true }),
      ]).start();
    }, 2400);

    t(() => {
      Animated.parallel([
        Animated.timing(scene2Opacity, { toValue: 0, duration: CROSS, useNativeDriver: true }),
        Animated.timing(scene3Opacity, { toValue: 1, duration: CROSS, useNativeDriver: true }),
      ]).start();
    }, 5800);

    t(onFinish, 8200);

    return () => timers.current.forEach(clearTimeout);
  }, []);

  return (
    <View style={styles.root}>
      <Scene1 opacity={scene1Opacity} />
      <Scene2 opacity={scene2Opacity} />
      <Scene3 opacity={scene3Opacity} />

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
  rankBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  rankNumBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumText: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 18,
    color: colors.white,
  },
  titleText: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 40,
    color: colors.white,
    letterSpacing: 5,
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
    paddingHorizontal: 16,
    paddingTop: 80,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
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
  revealPill: {
    backgroundColor: 'rgba(252,52,92,0.15)',
    borderWidth: 1,
    borderColor: colors.brand,
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  revealPillText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    color: colors.brand,
    letterSpacing: 1,
  },
  currentPlayerCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(252,52,92,0.4)',
  },
  currentPlayerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentPlayerSilhouette: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  silhouetteQ: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 24,
    color: 'rgba(255,255,255,0.2)',
  },
  currentPlayerName: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 17,
    color: colors.white,
    marginBottom: 3,
  },
  currentPlayerMeta: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 4,
  },
  currentPlayerStat: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 13,
    color: colors.brandMid,
  },
  instructionText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    color: colors.brand,
    letterSpacing: 2,
    textAlign: 'center',
  },
  slotsContainer: {
    gap: 8,
  },
  slotFilled: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 14,
  },
  slotEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    gap: 14,
  },
  slotActive: {
    borderColor: colors.brand,
    backgroundColor: 'rgba(252,52,92,0.08)',
  },
  slotNumber: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 18,
    color: 'rgba(255,255,255,0.25)',
    width: 24,
    textAlign: 'center',
  },
  slotPlayerName: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 15,
    color: colors.white,
    flex: 1,
  },
  slotTeam: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
  },
  slotEmptyLabel: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 12,
    color: 'rgba(255,255,255,0.18)',
    letterSpacing: 2,
  },

  // ── Scene 3 ──────────────────────────────────────────────────────────────
  scene3: {
    backgroundColor: '#0F0F0F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  resultsLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 4,
    marginBottom: 4,
  },
  resultsScore: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 72,
    color: colors.accentGreen,
    lineHeight: 76,
  },
  resultsSubLabel: {
    fontFamily: fontFamily.regular,
    fontWeight: '400',
    fontSize: 13,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 4,
  },
  resultsRows: {
    width: '100%',
    marginTop: 28,
    gap: 10,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  resultSlotBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultSlotNum: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 14,
    color: colors.white,
  },
  resultPlayerName: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 15,
    color: colors.white,
    flex: 1,
  },
  resultPct: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 16,
    color: colors.white,
  },
  resultTag: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 10,
    letterSpacing: 1,
  },
  tagGreen: {
    color: colors.accentGreen,
  },
  tagBrand: {
    color: colors.brandMid,
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
    marginTop: 36,
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
