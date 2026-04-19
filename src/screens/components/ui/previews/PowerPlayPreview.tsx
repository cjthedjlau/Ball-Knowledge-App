import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { brand, dark, light, fonts, colors } from '../../../../styles/theme';

interface Props {
  isDark: boolean;
}

const BAR_COUNT = 5;
const FLIP_INTERVAL = 300;
const SCORES = ['0', '25', '50', '75', '100', '125'];
const PAUSE_AFTER_COMPLETE = 500;
const PLAYER_NAMES = ['Michael Jordan', 'Kobe Bryant', 'LeBron James', 'Tim Duncan', "Shaquille O'Neal"];

const PowerPlayPreview: React.FC<Props> = ({ isDark }) => {
  const barOpacity = useRef(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(0))
  );
  const targetFlash = useRef(new Animated.Value(0)).current;
  const [scoreIndex, setScoreIndex] = useState(0);
  const [showTarget, setShowTarget] = useState(false);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mountedRef = useRef(true);

  const cardBg = isDark ? dark.card : light.card;
  const borderColor = isDark ? dark.cardBorder : light.cardBorder;
  const textColor = isDark ? dark.textPrimary : light.textPrimary;
  const mutedColor = isDark ? dark.textMuted : light.textMuted;

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
    barOpacity.current.forEach((a) => a.setValue(0));
    targetFlash.setValue(0);
    setScoreIndex(0);
    setShowTarget(false);
  }, [targetFlash]);

  const runSequence = useCallback(() => {
    clearTimers();
    resetAll();

    // Flip bars one at a time
    for (let i = 0; i < BAR_COUNT; i++) {
      addTimer(() => {
        // Flip bar: fade out then in with color change
        Animated.sequence([
          Animated.timing(barOpacity.current[i], {
            toValue: 0.3,
            duration: FLIP_INTERVAL / 3,
            useNativeDriver: true,
          }),
          Animated.timing(barOpacity.current[i], {
            toValue: 1,
            duration: FLIP_INTERVAL / 3,
            useNativeDriver: true,
          }),
        ]).start();

        setScoreIndex(i + 1);
      }, i * FLIP_INTERVAL);
    }

    // After all bars: show TARGET label
    const afterBars = BAR_COUNT * FLIP_INTERVAL + 200;
    addTimer(() => {
      setShowTarget(true);
      Animated.sequence([
        Animated.timing(targetFlash, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(targetFlash, {
          toValue: 0.6,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(targetFlash, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }, afterBars);

    // Reset
    addTimer(() => runSequence(), afterBars + 800 + PAUSE_AFTER_COMPLETE);
  }, [clearTimers, resetAll, addTimer, targetFlash]);

  useEffect(() => {
    mountedRef.current = true;
    runSequence();
    return () => {
      mountedRef.current = false;
      clearTimers();
    };
  }, [runSequence, clearTimers]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text
          style={[
            styles.headerLabel,
            { fontFamily: fonts.bodySemiBold, color: mutedColor },
          ]}
        >
          TOP 5 ALL TIME
        </Text>
        {/* Score counter */}
        <Text
          style={[
            styles.score,
            { fontFamily: fonts.display, color: textColor },
          ]}
        >
          {SCORES[scoreIndex]}
        </Text>
      </View>

      {/* Answer bars */}
      <View style={styles.bars}>
        {Array.from({ length: BAR_COUNT }, (_, i) => (
          <View key={i} style={[styles.barSlot, { borderColor }]}>
            <Animated.View
              style={[
                styles.barFill,
                {
                  backgroundColor: brand.teal,
                  opacity: barOpacity.current[i],
                },
              ]}
            />
            <Text
              style={[
                styles.barLabel,
                { fontFamily: fonts.bodySemiBold },
              ]}
              numberOfLines={1}
            >
              {PLAYER_NAMES[i]}
            </Text>
          </View>
        ))}
      </View>

      {/* TARGET label */}
      {showTarget && (
        <Animated.Text
          style={[
            styles.targetLabel,
            {
              fontFamily: fonts.bodySemiBold,
              color: brand.primary,
              opacity: targetFlash,
            },
          ]}
        >
          TARGET
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerLabel: {
    fontSize: 6,
    letterSpacing: 1,
  },
  score: {
    fontSize: 12,
  },
  bars: {
    gap: 3,
  },
  barSlot: {
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
    overflow: 'hidden',
  },
  barFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 2,
  },
  barLabel: {
    position: 'absolute',
    left: 4,
    top: 0,
    bottom: 0,
    textAlignVertical: 'center',
    fontSize: 7,
    color: colors.white,
    lineHeight: 14,
  },
  targetLabel: {
    fontSize: 8,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default PowerPlayPreview;
