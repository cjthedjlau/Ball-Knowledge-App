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
import { Swords } from 'lucide-react-native';
import { brand, dark, light, fonts, colors, darkColors, fontFamily, spacing, radius } from '../../styles/theme';

const { width: W } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

// Mock stats for the two hidden players (NFL QBs)
const PLAYER_A = {
  stats: [
    { label: 'PASS YDS', value: '4,183' },
    { label: 'TOUCHDOWNS', value: '38' },
    { label: 'INTERCEPTIONS', value: '12' },
    { label: 'QBR', value: '112.0' },
  ],
};
const PLAYER_B = {
  stats: [
    { label: 'PASS YDS', value: '3,731' },
    { label: 'TOUCHDOWNS', value: '32' },
    { label: 'INTERCEPTIONS', value: '9' },
    { label: 'QBR', value: '101.3' },
  ],
};

// Reveal names for scene 3
const REVEAL_A = { name: 'Patrick\nMahomes', team: 'KC', pct: 61 };
const REVEAL_B = { name: 'Josh\nAllen', team: 'BUF', pct: 39 };

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

      {/* VS icon */}
      <Animated.View style={{ transform: [{ scale: iconScale }], marginBottom: 16, alignItems: 'center' }}>
        <Swords size={60} color={colors.brand} strokeWidth={1.5} />
      </Animated.View>

      <Animated.Text
        style={[styles.titleText, { opacity: titleOpacity, transform: [{ translateY: titleY }] }]}
      >
        BLIND SHOWDOWN
      </Animated.Text>

      <Animated.Text style={[styles.taglineText, { opacity: tagOpacity }]}>
        NO NAMES · JUST STATS · PICK YOUR WINNER
      </Animated.Text>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 2 — Game Mockup (two hidden stat cards)
// ─────────────────────────────────────────────────────────────────────────────
function Scene2({ opacity }: { opacity: Animated.Value }) {
  const cardAX    = useRef(new Animated.Value(-(W / 2))).current;
  const cardBX    = useRef(new Animated.Value(W / 2)).current;
  const cardsAlpha = useRef(new Animated.Value(0)).current;
  const vsScale   = useRef(new Animated.Value(0)).current;

  // Stat rows stagger in on each card
  const sa0 = useRef(new Animated.Value(0)).current;
  const sa1 = useRef(new Animated.Value(0)).current;
  const sa2 = useRef(new Animated.Value(0)).current;
  const sa3 = useRef(new Animated.Value(0)).current;
  const sb0 = useRef(new Animated.Value(0)).current;
  const sb1 = useRef(new Animated.Value(0)).current;
  const sb2 = useRef(new Animated.Value(0)).current;
  const sb3 = useRef(new Animated.Value(0)).current;

  const statAOps = [sa0, sa1, sa2, sa3];
  const statBOps = [sb0, sb1, sb2, sb3];

  useEffect(() => {
    // Cards slide in from sides
    Animated.parallel([
      Animated.timing(cardsAlpha, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.spring(cardAX, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 160 }),
      Animated.spring(cardBX, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 160 }),
    ]).start();

    // VS badge springs in after cards land
    setTimeout(() => {
      Animated.spring(vsScale, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 240 }).start();
    }, 350);

    // Stat rows stagger in on both cards simultaneously
    [...statAOps, ...statBOps].forEach((op, i) => {
      const idx = i % 4;
      setTimeout(() => {
        Animated.timing(op, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      }, 500 + idx * 180);
    });
  }, []);

  const CARD_W = (W - 48 - 16) / 2; // two cards + gap + padding

  function StatCard({
    anim,
    statOps,
    label,
  }: {
    anim: Animated.Value;
    statOps: Animated.Value[];
    label: string;
    stats: typeof PLAYER_A.stats;
  }) {
    const statsData = label === 'A' ? PLAYER_A.stats : PLAYER_B.stats;
    return (
      <Animated.View style={[styles.statCard, { width: CARD_W, transform: [{ translateX: anim }] }]}>
        {/* Silhouette header */}
        <View style={styles.silhouetteBlock}>
          <Text style={styles.silhouetteLabel}>PLAYER {label}</Text>
          <View style={styles.silhouetteFigure} />
          <Text style={styles.silhouetteHidden}>HIDDEN</Text>
        </View>

        {/* Stats */}
        {statsData.map((s, i) => (
          <Animated.View key={s.label} style={[styles.statRow, { opacity: statOps[i] }]}>
            <Text style={styles.statLabel}>{s.label}</Text>
            <Text style={styles.statValue}>{s.value}</Text>
          </Animated.View>
        ))}
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.scene2, { opacity }]}>
      {/* Header */}
      <View style={styles.badgeRow}>
        <View style={styles.leagueBadge}>
          <Text style={styles.leagueBadgeText}>NFL</Text>
        </View>
        <Text style={styles.gameLabelText}>BLIND SHOWDOWN</Text>
        <Text style={styles.positionLabel}>QB STATS</Text>
      </View>

      {/* Cards + VS */}
      <Animated.View style={[styles.cardsRow, { opacity: cardsAlpha }]}>
        <StatCard anim={cardAX} statOps={statAOps} label="A" stats={PLAYER_A.stats} />

        {/* VS badge */}
        <Animated.View style={[styles.vsBadge, { transform: [{ scale: vsScale }] }]}>
          <Text style={styles.vsText}>VS</Text>
        </Animated.View>

        <StatCard anim={cardBX} statOps={statBOps} label="B" stats={PLAYER_B.stats} />
      </Animated.View>

      <Text style={styles.pickInstruction}>TAP A CARD TO PICK THE BETTER PLAYER</Text>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 3 — Reveal
// ─────────────────────────────────────────────────────────────────────────────
function Scene3({ opacity }: { opacity: Animated.Value }) {
  const nameAScale   = useRef(new Animated.Value(0)).current;
  const nameAOpacity = useRef(new Animated.Value(0)).current;
  const nameBScale   = useRef(new Animated.Value(0)).current;
  const nameBOpacity = useRef(new Animated.Value(0)).current;

  const pctAOp = useRef(new Animated.Value(0)).current;
  const pctBOp = useRef(new Animated.Value(0)).current;

  const barAWidth = useRef(new Animated.Value(0)).current;
  const barBWidth = useRef(new Animated.Value(0)).current;

  const xpOpacity  = useRef(new Animated.Value(0)).current;
  const xpY        = useRef(new Animated.Value(24)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const ctaY       = useRef(new Animated.Value(20)).current;

  const MAX_BAR = W - 64;

  useEffect(() => {
    // Player A name flips in
    Animated.parallel([
      Animated.spring(nameAScale, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 200 }),
      Animated.timing(nameAOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();

    // Player B name flips in with slight delay
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(nameBScale, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 200 }),
        Animated.timing(nameBOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    }, 200);

    // Vote bars animate at 700ms
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(pctAOp, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(pctBOp, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(barAWidth, {
          toValue: MAX_BAR * (REVEAL_A.pct / 100),
          duration: 700,
          useNativeDriver: false,
        }),
        Animated.timing(barBWidth, {
          toValue: MAX_BAR * (REVEAL_B.pct / 100),
          duration: 700,
          useNativeDriver: false,
        }),
      ]).start();
    }, 700);

    // XP badge at 1400ms
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(xpOpacity, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.spring(xpY, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 200 }),
      ]).start();
    }, 1400);

    // CTA at 1800ms
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(ctaOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(ctaY, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 180 }),
      ]).start();
    }, 1800);
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.scene3, { opacity }]}>
      <Text style={styles.revealLabel}>REVEALED</Text>

      {/* Player A */}
      <Animated.View
        style={[
          styles.revealCard,
          styles.revealCardWinner,
          { opacity: nameAOpacity, transform: [{ scale: nameAScale }] },
        ]}
      >
        <View style={styles.revealCardHeader}>
          <Text style={styles.revealPlayerLabel}>PLAYER A</Text>
          <View style={styles.winnerBadge}>
            <Text style={styles.winnerBadgeText}>YOU PICKED</Text>
          </View>
        </View>
        <Text style={styles.revealPlayerName}>{REVEAL_A.name}</Text>
        <Text style={styles.revealTeam}>{REVEAL_A.team}</Text>
      </Animated.View>

      {/* Vote bar A */}
      <Animated.View style={[styles.voteRow, { opacity: pctAOp }]}>
        <Text style={styles.votePct}>{REVEAL_A.pct}%</Text>
        <View style={styles.voteBarTrack}>
          <Animated.View style={[styles.voteBarFillBrand, { width: barAWidth }]} />
        </View>
      </Animated.View>

      {/* VS divider */}
      <Text style={styles.vsDivider}>VS</Text>

      {/* Vote bar B */}
      <Animated.View style={[styles.voteRow, { opacity: pctBOp }]}>
        <Text style={styles.votePct}>{REVEAL_B.pct}%</Text>
        <View style={styles.voteBarTrack}>
          <Animated.View style={[styles.voteBarFillDim, { width: barBWidth }]} />
        </View>
      </Animated.View>

      {/* Player B */}
      <Animated.View
        style={[
          styles.revealCard,
          { opacity: nameBOpacity, transform: [{ scale: nameBScale }] },
        ]}
      >
        <Text style={styles.revealPlayerLabel}>PLAYER B</Text>
        <Text style={[styles.revealPlayerName, styles.revealPlayerNameDim]}>{REVEAL_B.name}</Text>
        <Text style={[styles.revealTeam, { color: dark.textMuted }]}>{REVEAL_B.team}</Text>
      </Animated.View>

      {/* XP */}
      <Animated.View style={[styles.xpBadge, { opacity: xpOpacity, transform: [{ translateY: xpY }] }]}>
        <Text style={styles.xpText}>+185 XP</Text>
        <Text style={styles.xpEarned}>EARNED</Text>
      </Animated.View>

      {/* CTA */}
      <Animated.View style={[styles.ctaWrap, { opacity: ctaOpacity, transform: [{ translateY: ctaY }] }]}>
        <View style={styles.ctaButton}>
          <Swords size={22} color={colors.white} strokeWidth={1.5} />
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
export default function BlindShowdownIntro({ onFinish }: Props) {
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
    backgroundColor: dark.background,
  },

  // ── Scene 1 ──────────────────────────────────────────────────────────────
  scene1: {
    backgroundColor: dark.background,
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
    fontSize: 36,
    color: colors.white,
    letterSpacing: 4,
    textAlign: 'center',
    marginTop: 4,
  },
  taglineText: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 11,
    color: dark.textSecondary,
    letterSpacing: 3,
    textAlign: 'center',
    marginTop: 20,
  },

  // ── Scene 2 ──────────────────────────────────────────────────────────────
  scene2: {
    backgroundColor: dark.background,
    paddingHorizontal: 16,
    paddingTop: 72,
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    width: '100%',
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
    color: dark.textMuted,
    letterSpacing: 2,
    flex: 1,
  },
  positionLabel: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 12,
    color: dark.textMuted,
    letterSpacing: 1,
  },
  cardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  statCard: {
    backgroundColor: dark.card,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: dark.cardBorder,
  },
  silhouetteBlock: {
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: dark.cardBorder,
  },
  silhouetteLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 10,
    color: colors.brand,
    letterSpacing: 2,
    marginBottom: 8,
  },
  silhouetteFigure: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: dark.surface,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: dark.cardBorder,
  },
  silhouetteHidden: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 9,
    color: dark.textDisabled,
    letterSpacing: 2,
  },
  statRow: {
    marginBottom: 10,
  },
  statLabel: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 9,
    color: dark.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  statValue: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 16,
    color: colors.white,
  },
  vsBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  vsText: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 13,
    color: colors.white,
    letterSpacing: 1,
  },
  pickInstruction: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    color: dark.textMuted,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 20,
  },

  // ── Scene 3 ──────────────────────────────────────────────────────────────
  scene3: {
    backgroundColor: dark.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  revealLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: dark.textMuted,
    letterSpacing: 4,
    marginBottom: 20,
  },
  revealCard: {
    width: '100%',
    backgroundColor: dark.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: dark.cardBorder,
    marginBottom: 8,
  },
  revealCardWinner: {
    borderColor: colors.brand,
    backgroundColor: colors.brandAlpha15,
  },
  revealCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  revealPlayerLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    color: colors.brand,
    letterSpacing: 2,
  },
  winnerBadge: {
    backgroundColor: colors.brand,
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  winnerBadgeText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 9,
    color: colors.white,
    letterSpacing: 1,
  },
  revealPlayerName: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 24,
    color: colors.white,
    lineHeight: 28,
  },
  revealPlayerNameDim: {
    color: dark.textSecondary,
  },
  revealTeam: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 14,
    color: dark.textSecondary,
    marginTop: 4,
  },
  voteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    marginBottom: 4,
  },
  votePct: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 16,
    color: colors.white,
    width: 44,
    textAlign: 'right',
  },
  voteBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: dark.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  voteBarFillBrand: {
    height: '100%',
    backgroundColor: colors.brand,
    borderRadius: 3,
  },
  voteBarFillDim: {
    height: '100%',
    backgroundColor: dark.surface,
    borderRadius: 3,
  },
  vsDivider: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 14,
    color: dark.textDisabled,
    letterSpacing: 3,
    marginVertical: 4,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: darkColors.successBg,
    borderWidth: 1.5,
    borderColor: colors.accentGreen,
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginTop: 20,
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
    color: dark.textMuted,
  },
  ctaWrap: {
    alignItems: 'center',
    marginTop: 28,
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
    color: dark.textMuted,
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
    backgroundColor: dark.tagBg,
  },
  skipText: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 12,
    color: dark.textSecondary,
    letterSpacing: 2,
  },
});
