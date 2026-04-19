import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { brand, dark, light, fonts, colors } from '../../../../styles/theme';

interface Props {
  isDark: boolean;
}

const PULSE_DURATION = 750;
const REVEAL_DELAY = 2000;
const REVEAL_FADE = 500;
const WIN_DELAY = 2800;
const PAUSE_BEFORE_RESET = 1000;

// Mock stats shown before reveal (identities hidden, stats visible)
const STATS_A = [
  { label: 'PPG', value: '30.2' },
  { label: 'APG', value: '6.5' },
  { label: 'FG%', value: '49.8' },
];
const STATS_B = [
  { label: 'PPG', value: '28.1' },
  { label: 'APG', value: '5.1' },
  { label: 'FG%', value: '46.1' },
];

const ShowdownPreview: React.FC<Props> = ({ isDark }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const revealOpacity = useRef(new Animated.Value(0)).current;
  const hiddenOpacity = useRef(new Animated.Value(1)).current;
  const winOpacity = useRef(new Animated.Value(0)).current;
  const rightDim = useRef(new Animated.Value(1)).current;
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mountedRef = useRef(true);
  const pulseRef = useRef<Animated.CompositeAnimation | null>(null);

  const cardBg = isDark ? dark.card : light.card;
  const borderColor = isDark ? dark.cardBorder : light.cardBorder;
  const textColor = isDark ? dark.textPrimary : light.textPrimary;
  const mutedColor = isDark ? dark.textMuted : light.textMuted;
  const secondaryColor = isDark ? dark.textSecondary : light.textSecondary;

  const clearTimers = useCallback(() => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, delay: number) => {
    const t = setTimeout(() => {
      if (mountedRef.current) fn();
    }, delay);
    timerRefs.current.push(t);
  }, []);

  const resetAll = useCallback(() => {
    pulseAnim.setValue(1);
    revealOpacity.setValue(0);
    hiddenOpacity.setValue(1);
    winOpacity.setValue(0);
    rightDim.setValue(1);
  }, [pulseAnim, revealOpacity, hiddenOpacity, winOpacity, rightDim]);

  const runSequence = useCallback(() => {
    clearTimers();
    resetAll();

    // Phase 1: Pulse the "?" headers
    pulseRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: PULSE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: PULSE_DURATION,
          useNativeDriver: true,
        }),
      ])
    );
    pulseRef.current.start();

    // Phase 2: Reveal identities
    addTimer(() => {
      pulseRef.current?.stop();
      pulseAnim.setValue(1);

      Animated.parallel([
        Animated.timing(hiddenOpacity, {
          toValue: 0,
          duration: REVEAL_FADE,
          useNativeDriver: true,
        }),
        Animated.timing(revealOpacity, {
          toValue: 1,
          duration: REVEAL_FADE,
          useNativeDriver: true,
        }),
      ]).start();
    }, REVEAL_DELAY);

    // Phase 3: Show winner
    addTimer(() => {
      Animated.parallel([
        Animated.timing(winOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rightDim, {
          toValue: 0.4,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, WIN_DELAY);

    // Phase 4: Reset
    const totalDuration = WIN_DELAY + 300 + PAUSE_BEFORE_RESET;
    addTimer(() => runSequence(), totalDuration);
  }, [
    clearTimers, resetAll, addTimer, pulseAnim, revealOpacity,
    hiddenOpacity, winOpacity, rightDim,
  ]);

  useEffect(() => {
    mountedRef.current = true;
    runSequence();
    return () => {
      mountedRef.current = false;
      pulseRef.current?.stop();
      clearTimers();
    };
  }, [runSequence, clearTimers]);

  const renderStatRows = (stats: typeof STATS_A) => (
    <View style={styles.statList}>
      {stats.map((s) => (
        <View key={s.label} style={styles.statRow}>
          <Text style={[styles.statValue, { fontFamily: fonts.display, color: textColor }]}>
            {s.value}
          </Text>
          <Text style={[styles.statLabel, { fontFamily: fonts.bodySemiBold, color: mutedColor }]}>
            {s.label}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { fontFamily: fonts.bodySemiBold, color: mutedColor }]}>
        WHO'S BETTER?
      </Text>
      <View style={styles.matchup}>
        {/* Left Card */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          {/* Hidden state: ? + stats */}
          <Animated.View
            style={[
              styles.hiddenContent,
              { opacity: hiddenOpacity },
            ]}
          >
            <Animated.Text
              style={[
                styles.questionMark,
                {
                  fontFamily: fonts.display,
                  color: secondaryColor,
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              ?
            </Animated.Text>
            {renderStatRows(STATS_A)}
          </Animated.View>
          {/* Revealed state */}
          <Animated.View
            style={[
              styles.revealOverlay,
              { backgroundColor: brand.primary, opacity: revealOpacity },
            ]}
          >
            <Text style={[styles.revealName, { fontFamily: fonts.display }]}>CURRY</Text>
            <Text style={[styles.revealTeam, { fontFamily: fonts.bodySemiBold }]}>GSW</Text>
            {renderRevealStats(STATS_A)}
            <Animated.Text
              style={[styles.winLabel, { fontFamily: fonts.display, opacity: winOpacity }]}
            >
              WINNER
            </Animated.Text>
          </Animated.View>
        </View>

        {/* VS */}
        <Text style={[styles.vs, { fontFamily: fonts.display, color: brand.primary }]}>
          VS
        </Text>

        {/* Right Card */}
        <Animated.View style={[styles.card, { backgroundColor: cardBg, borderColor, opacity: rightDim }]}>
          {/* Hidden state: ? + stats */}
          <Animated.View
            style={[
              styles.hiddenContent,
              { opacity: hiddenOpacity },
            ]}
          >
            <Animated.Text
              style={[
                styles.questionMark,
                {
                  fontFamily: fonts.display,
                  color: secondaryColor,
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              ?
            </Animated.Text>
            {renderStatRows(STATS_B)}
          </Animated.View>
          {/* Revealed state */}
          <Animated.View
            style={[
              styles.revealOverlay,
              { backgroundColor: brand.teal, opacity: revealOpacity },
            ]}
          >
            <Text style={[styles.revealName, { fontFamily: fonts.display }]}>TATUM</Text>
            <Text style={[styles.revealTeam, { fontFamily: fonts.bodySemiBold }]}>BOS</Text>
            {renderRevealStats(STATS_B)}
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
};

function renderRevealStats(stats: typeof STATS_A) {
  return (
    <View style={styles.revealStatList}>
      {stats.map((s) => (
        <View key={s.label} style={styles.revealStatRow}>
          <Text style={[styles.revealStatValue, { fontFamily: fonts.display }]}>{s.value}</Text>
          <Text style={[styles.revealStatLabel, { fontFamily: fonts.bodySemiBold }]}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 7,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  matchup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    width: '100%',
    paddingHorizontal: 4,
  },
  card: {
    flex: 1,
    borderRadius: 6,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    minHeight: 90,
    overflow: 'hidden',
  },
  hiddenContent: {
    alignItems: 'center',
  },
  questionMark: {
    fontSize: 16,
    marginBottom: 4,
  },
  statList: {
    width: '100%',
    gap: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  statValue: {
    fontSize: 10,
  },
  statLabel: {
    fontSize: 6,
    letterSpacing: 0.5,
  },
  revealOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  revealName: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  revealTeam: {
    fontSize: 7,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
    marginBottom: 4,
  },
  revealStatList: {
    width: '100%',
    gap: 1,
  },
  revealStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  revealStatValue: {
    fontSize: 9,
    color: '#FFFFFF',
  },
  revealStatLabel: {
    fontSize: 6,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
  },
  winLabel: {
    fontSize: 8,
    color: '#FFFFFF',
    letterSpacing: 2,
    marginTop: 2,
  },
  vs: {
    fontSize: 10,
  },
});

export default ShowdownPreview;
