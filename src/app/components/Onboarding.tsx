import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Trophy, Share2 } from 'lucide-react-native';
import PrimaryButton from '../../screens/components/ui/PrimaryButton';
import GhostButton from '../../screens/components/ui/GhostButton';

const { width: SW } = Dimensions.get('window');

interface OnboardingProps {
  onFinish: () => void;
}

// ── Dot pagination ──────────────────────────────────────────────────────────

function Dots({ active }: { active: number }) {
  return (
    <View style={dotStyles.row}>
      {[0, 1, 2].map(i => (
        <View
          key={i}
          style={[
            dotStyles.dot,
            i === active ? dotStyles.dotActive : dotStyles.dotInactive,
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
    gap: 8,
    marginBottom: 16,
  },
  dot: { borderRadius: 999, height: 8 },
  dotActive: { width: 10, height: 10, backgroundColor: '#FC345C' },
  dotInactive: { width: 6, height: 6, backgroundColor: '#242424' },
});

// ── Component ───────────────────────────────────────────────────────────────

export default function Onboarding({ onFinish }: OnboardingProps) {
  const scrollRef = useRef<ScrollView>(null);
  const slideIndexRef = useRef(0);
  const [slideIndex, setSlideIndex] = useState(0);

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
        <View style={styles.slide}>
          <View style={styles.contentBlock}>
            <TrendingUp color="#FC345C" size={64} strokeWidth={1.5} />
            <Text style={styles.eyebrow}>YOUR KNOWLEDGE</Text>
            <Text style={styles.title}>Track Your Growth</Text>
            <Text style={styles.body}>
              Every game you play earns XP. Level up from Rookie all the way to Ball Knowledge — the ultimate rank for the ultimate fan.
            </Text>
            {/* Progress bar visual */}
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.progressLabel}>Starter → Rotation Player</Text>
          </View>

          <View style={styles.bottomBlock}>
            <Dots active={slideIndex} />
            <GhostButton label="Next" onPress={advance} />
          </View>
        </View>

        {/* ── Slide 2: Leaderboard ── */}
        <View style={styles.slide}>
          <View style={styles.contentBlock}>
            <Trophy color="#FC345C" size={64} strokeWidth={1.5} />
            <Text style={styles.eyebrow}>COMPETE</Text>
            <Text style={styles.title}>See Where You Stack Up</Text>
            <Text style={styles.body}>
              Weekly and all-time leaderboards rank the most knowledgeable fans. Can you crack the top 10?
            </Text>
            {/* Fake leaderboard rows */}
            <View style={styles.fakeLeaderboard}>
              <View style={styles.fakeRow}>
                <Text style={styles.fakeRank}>1</Text>
                <Text style={styles.fakeName}>BallKnower42</Text>
                <Text style={styles.fakeXp}>4,820 XP</Text>
              </View>
              <View style={styles.fakeDivider} />
              <View style={styles.fakeRow}>
                <Text style={styles.fakeRank}>2</Text>
                <Text style={styles.fakeName}>StreakKing</Text>
                <Text style={styles.fakeXp}>3,650 XP</Text>
              </View>
              <View style={styles.fakeDivider} />
              <View style={styles.fakeRow}>
                <Text style={styles.fakeRank}>3</Text>
                <Text style={styles.fakeName}>HoopsFanatic</Text>
                <Text style={styles.fakeXp}>2,900 XP</Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomBlock}>
            <Dots active={slideIndex} />
            <GhostButton label="Next" onPress={advance} />
          </View>
        </View>

        {/* ── Slide 3: Social / Share ── */}
        <View style={styles.slide}>
          <View style={styles.contentBlock}>
            <Share2 color="#FC345C" size={64} strokeWidth={1.5} />
            <Text style={styles.eyebrow}>SHOW OFF</Text>
            <Text style={styles.title}>Brag to Your Friends</Text>
            <Text style={styles.body}>
              Share your daily results, streaks, and rankings. Prove you know ball.
            </Text>
            {/* Fake share card */}
            <View style={styles.fakeShareCard}>
              <Text style={styles.shareCardLabel}>Mystery Player</Text>
              <Text style={styles.shareCardScore}>Solved in 3/6 guesses 🔥</Text>
              <Text style={styles.shareCardStreak}>12 Day Streak</Text>
            </View>
          </View>

          <View style={styles.bottomBlock}>
            <Dots active={slideIndex} />
            <PrimaryButton label="Create Free Account" onPress={onFinish} />
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
  contentBlock: {
    alignItems: 'center',
    gap: 16,
  },
  bottomBlock: {
    gap: 16,
  },

  // Typography
  eyebrow: {
    fontFamily: 'Chillax-Bold',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 3,
    color: '#FC345C',
    textAlign: 'center',
    marginTop: 20,
  },
  title: {
    fontFamily: 'Chillax-Bold',
    fontWeight: '700',
    fontSize: 36,
    letterSpacing: 1,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  body: {
    fontFamily: 'Chillax-Bold',
    fontSize: 16,
    lineHeight: 24,
    color: '#9A9A9A',
    textAlign: 'center',
  },

  // Slide 1 — Progress bar
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#1A1A1A',
    borderRadius: 999,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    width: '60%',
    height: '100%',
    backgroundColor: '#FC345C',
    borderRadius: 999,
  },
  progressLabel: {
    fontFamily: 'Chillax-Bold',
    fontSize: 13,
    color: '#9A9A9A',
    textAlign: 'center',
  },

  // Slide 2 — Fake leaderboard
  fakeLeaderboard: {
    width: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    // 3D raised card effect
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fakeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  fakeRank: {
    fontFamily: 'Chillax-Bold',
    fontWeight: '700',
    fontSize: 16,
    color: '#FC345C',
    width: 28,
  },
  fakeName: {
    fontFamily: 'Chillax-Bold',
    fontWeight: '500',
    fontSize: 15,
    color: '#FFFFFF',
    flex: 1,
  },
  fakeXp: {
    fontFamily: 'Chillax-Bold',
    fontSize: 14,
    color: '#9A9A9A',
  },
  fakeDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },

  // Slide 3 — Fake share card
  fakeShareCard: {
    width: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    alignItems: 'center',
    gap: 8,
    // 3D raised card effect
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  shareCardLabel: {
    fontFamily: 'Chillax-Bold',
    fontWeight: '700',
    fontSize: 12,
    color: '#FC345C',
    letterSpacing: 1,
  },
  shareCardScore: {
    fontFamily: 'Chillax-Bold',
    fontWeight: '600',
    fontSize: 18,
    color: '#FFFFFF',
  },
  shareCardStreak: {
    fontFamily: 'Chillax-Bold',
    fontSize: 14,
    color: '#9A9A9A',
  },
});
