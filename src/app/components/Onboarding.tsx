import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Trophy, Share2 } from 'lucide-react-native';
import GhostButton from '../../screens/components/ui/GhostButton';
import GhostWatermark from '../../screens/components/ui/GhostWatermark';
import { brand, dark, light, fonts, fontSizes, colors, darkColors, fontFamily, spacing, radius, layout } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';

const { width: SW } = Dimensions.get('window');

interface OnboardingProps {
  onFinish: () => void;
}

// ── Dot pagination ──────────────────────────────────────────────────────────

function Dots({ active }: { active: number }) {
  const { isDark } = useTheme();
  return (
    <View style={dotStyles.row}>
      {[0, 1, 2].map(i => (
        <View
          key={i}
          style={[
            dotStyles.dot,
            i === active
              ? [dotStyles.dotActive, { backgroundColor: brand.primary }]
              : [dotStyles.dotInactive, { backgroundColor: isDark ? dark.tagBg : light.divider }],
          ]}
        />
      ))}
    </View>
  );
}

/** White dots for the gradient CTA slide */
function DotsCTA({ active }: { active: number }) {
  return (
    <View style={dotStyles.row}>
      {[0, 1, 2].map(i => (
        <View
          key={i}
          style={[
            dotStyles.dot,
            i === active
              ? [dotStyles.dotActive, { backgroundColor: '#FFFFFF' }]
              : [dotStyles.dotInactive, { backgroundColor: 'rgba(255,255,255,0.35)' }],
          ]}
        />
      ))}
    </View>
  );
}

const dotStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  dot: { borderRadius: 999, height: 8 },
  dotActive: { width: 10, height: 10 },
  dotInactive: { width: 6, height: 6 },
});

// ── Component ───────────────────────────────────────────────────────────────

export default function Onboarding({ onFinish }: OnboardingProps) {
  const { isDark } = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const slideIndexRef = useRef(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const textPrimary = isDark ? dark.textPrimary : light.textPrimary;
  const textSecondary = isDark ? dark.textSecondary : light.textSecondary;
  const cardBg = isDark ? dark.card : light.card;
  const cardBorder = isDark ? dark.cardBorder : light.cardBorder;
  const dividerColor = isDark ? dark.divider : light.divider;
  const slideBg = isDark ? dark.background : light.background;
  const watermarkColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(252,52,92,0.05)';

  const updateSlide = (i: number) => {
    slideIndexRef.current = i;
    setSlideIndex(i);
  };

  const advance = () => {
    const current = slideIndexRef.current;
    if (current < 2) {
      const next = current + 1;
      scrollRef.current?.scrollTo({ x: next * SW, animated: true });
      updateSlide(next);
    }
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / SW);
    updateSlide(i);
  };

  // ── COPPA Age Gate ──
  if (!ageConfirmed) {
    return (
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <View style={[styles.slide, { backgroundColor: isDark ? dark.background : light.background }]}>
          <GhostWatermark text="BK" color={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(252,52,92,0.05)'} />
          <View style={styles.contentBlock}>
            <Text style={[styles.headline, { color: isDark ? dark.textPrimary : light.textPrimary }]}>Before We{'\n'}Start</Text>
            <Text style={[styles.body, { color: isDark ? dark.textSecondary : light.textSecondary }]}>
              Ball Knowledge is designed for sports fans ages 13 and older. By continuing, you confirm that you are at least 13 years old.
            </Text>
          </View>
          <View style={styles.bottomBlock}>
            <GhostButton label="I'm 13 or Older" onPress={() => setAgeConfirmed(true)} />
            <Text style={{ fontFamily: fonts.body, fontSize: 12, color: isDark ? dark.textMuted : light.textMuted, textAlign: 'center', marginTop: spacing.md }}>
              If you are under 13, please ask a parent or guardian before using this app.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        scrollEventThrottle={16}
        style={styles.scroll}
      >
        {/* ── Slide 1: XP & Progression ── */}
        <View style={[styles.slide, { backgroundColor: slideBg }]}>
          <GhostWatermark text="BK" color={watermarkColor} />
          <View style={styles.contentBlock}>
            <TrendingUp color={brand.primary} size={64} strokeWidth={1.5} />
            <Text style={[styles.headline, { color: textPrimary }]}>Track Your{'\n'}Growth</Text>
            <Text style={[styles.body, { color: textSecondary }]}>
              Every game you play earns XP. Level up from Rookie all the way to Ball Knowledge — the ultimate rank for the ultimate fan.
            </Text>
            {/* Progress bar visual */}
            <View style={[styles.progressTrack, { backgroundColor: isDark ? dark.card : light.surface }]}>
              <View style={[styles.progressFill, { backgroundColor: brand.primary }]} />
            </View>
            <Text style={[styles.progressLabel, { color: textSecondary }]}>Starter to Rotation Player</Text>
          </View>

          <View style={styles.bottomBlock}>
            <Dots active={slideIndex} />
            <GhostButton label="Next" onPress={advance} />
          </View>
        </View>

        {/* ── Slide 2: Leaderboard ── */}
        <View style={[styles.slide, { backgroundColor: slideBg }]}>
          <GhostWatermark text="BK" color={watermarkColor} />
          <View style={styles.contentBlock}>
            <Trophy color={brand.primary} size={64} strokeWidth={1.5} />
            <Text style={[styles.headline, { color: textPrimary }]}>See Where You{'\n'}Stack Up</Text>
            <Text style={[styles.body, { color: textSecondary }]}>
              Weekly and all-time leaderboards rank the most knowledgeable fans. Can you crack the top 10?
            </Text>
            {/* Fake leaderboard rows */}
            <View style={[styles.fakeLeaderboard, { backgroundColor: cardBg, borderTopColor: dividerColor, borderBottomColor: isDark ? dark.overlay : light.cardBorder }]}>
              <View style={styles.fakeRow}>
                <Text style={[styles.fakeRank, { color: brand.primary }]}>1</Text>
                <Text style={[styles.fakeName, { color: textPrimary }]}>BallKnower42</Text>
                <Text style={[styles.fakeXp, { color: textSecondary }]}>4,820 XP</Text>
              </View>
              <View style={[styles.fakeDivider, { backgroundColor: dividerColor }]} />
              <View style={styles.fakeRow}>
                <Text style={[styles.fakeRank, { color: brand.primary }]}>2</Text>
                <Text style={[styles.fakeName, { color: textPrimary }]}>StreakKing</Text>
                <Text style={[styles.fakeXp, { color: textSecondary }]}>3,650 XP</Text>
              </View>
              <View style={[styles.fakeDivider, { backgroundColor: dividerColor }]} />
              <View style={styles.fakeRow}>
                <Text style={[styles.fakeRank, { color: brand.primary }]}>3</Text>
                <Text style={[styles.fakeName, { color: textPrimary }]}>HoopsFanatic</Text>
                <Text style={[styles.fakeXp, { color: textSecondary }]}>2,900 XP</Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomBlock}>
            <Dots active={slideIndex} />
            <GhostButton label="Next" onPress={advance} />
          </View>
        </View>

        {/* ── Slide 3: CTA — Gradient background ── */}
        <View style={styles.slideWrapper}>
          <LinearGradient
            colors={brand.gradient as unknown as string[]}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.6, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <GhostWatermark text="BK" color="rgba(255,255,255,0.04)" />
          <View style={styles.contentBlock}>
            <Share2 color="#FFFFFF" size={64} strokeWidth={1.5} />
            <Text style={styles.ctaHeadline}>Brag to Your{'\n'}Friends</Text>
            <Text style={styles.ctaBody}>
              Share your daily results, streaks, and rankings. Prove you know ball.
            </Text>
            {/* Fake share card */}
            <View style={styles.ctaShareCard}>
              <Text style={styles.ctaShareCardLabel}>Mystery Player</Text>
              <Text style={styles.ctaShareCardScore}>Solved in 3/6 guesses</Text>
              <Text style={styles.ctaShareCardStreak}>12 Day Streak</Text>
            </View>
          </View>

          <View style={styles.bottomBlock}>
            <DotsCTA active={slideIndex} />
            <View style={styles.ctaBtnWrap}>
              <Pressable onPress={onFinish} style={styles.ctaBtn}>
                <Text style={styles.ctaBtnText}>Create Free Account</Text>
              </Pressable>
            </View>
          </View>
        </View>
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
  scroll: {
    flex: 1,
  },

  // Slide layout
  slide: {
    width: SW,
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 100,
    paddingBottom: 48,
    justifyContent: 'space-between',
  },
  slideWrapper: {
    width: SW,
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 100,
    paddingBottom: 48,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  contentBlock: {
    alignItems: 'center',
    gap: 16,
  },
  bottomBlock: {
    gap: 16,
  },

  // Early slides typography
  headline: {
    fontFamily: fonts.display,
    fontWeight: '400',
    fontSize: 64,
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 66,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 280,
  },

  // Slide 1 — Progress bar
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    width: '60%',
    height: '100%',
    borderRadius: 999,
  },
  progressLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    textAlign: 'center',
  },

  // Slide 2 — Fake leaderboard
  fakeLeaderboard: {
    width: '100%',
    borderRadius: radius.primary,
    padding: spacing.lg,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 2,
  },
  fakeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  fakeRank: {
    fontFamily: fonts.display,
    fontWeight: '400',
    fontSize: 16,
    width: 28,
  },
  fakeName: {
    fontFamily: fonts.bodyMedium,
    fontWeight: '500',
    fontSize: 15,
    flex: 1,
  },
  fakeXp: {
    fontFamily: fonts.body,
    fontSize: 14,
  },
  fakeDivider: {
    height: 1,
  },

  // Slide 3 — CTA gradient slide
  ctaHeadline: {
    fontFamily: fonts.display,
    fontWeight: '400',
    fontSize: 64,
    letterSpacing: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    lineHeight: 66,
  },
  ctaBody: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.65)',
    maxWidth: 280,
  },
  ctaShareCard: {
    width: '100%',
    borderRadius: radius.primary,
    padding: spacing.xl,
    marginTop: spacing.sm,
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  ctaShareCardLabel: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.7)',
  },
  ctaShareCardScore: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 18,
    color: '#FFFFFF',
  },
  ctaShareCardStreak: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  ctaBtnWrap: {
    alignItems: 'center',
  },
  ctaBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingHorizontal: 28,
    paddingVertical: 13,
    height: 'auto' as any,
  },
  ctaBtnText: {
    color: brand.dark,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
});
