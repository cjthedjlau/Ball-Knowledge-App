import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { brand, dark, light, fonts } from '../../../../styles/theme';

interface Props {
  isDark: boolean;
}

const TYPED_TEXT = 'Best NBA Pla...';
const TYPE_INTERVAL = 120;
const RESULT_STAGGER = 400;
const PROGRESS_WIDTHS = ['80%', '60%', '40%'];
const PAUSE_AFTER = 500;
const RESULT_LABELS = [
  'Best NBA Players All Time',
  'Best NBA Player 2024',
  'Best NBA Playoff Runs',
];

const AutoCompletePreview: React.FC<Props> = ({ isDark }) => {
  const cursorOpacity = useRef(new Animated.Value(1)).current;
  const cursorLoop = useRef<Animated.CompositeAnimation | null>(null);
  const resultTranslateY = useRef(
    Array.from({ length: 3 }, () => new Animated.Value(10))
  );
  const resultOpacity = useRef(
    Array.from({ length: 3 }, () => new Animated.Value(0))
  );
  const progressWidth = useRef(
    Array.from({ length: 3 }, () => new Animated.Value(0))
  );
  const [typedCount, setTypedCount] = useState(0);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mountedRef = useRef(true);

  const cardBg = isDark ? dark.card : light.card;
  const inputBg = isDark ? dark.inputBg : light.inputBg;
  const borderColor = isDark ? dark.inputBorder : light.inputBorder;
  const textColor = isDark ? dark.textPrimary : light.textPrimary;
  const mutedColor = isDark ? dark.textMuted : light.textMuted;
  const surfaceBg = isDark ? dark.surface : light.surface;

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
    setTypedCount(0);
    resultTranslateY.current.forEach((a) => a.setValue(10));
    resultOpacity.current.forEach((a) => a.setValue(0));
    progressWidth.current.forEach((a) => a.setValue(0));
  }, []);

  const runSequence = useCallback(() => {
    clearTimers();
    resetAll();

    // Type letters one at a time
    for (let i = 0; i <= TYPED_TEXT.length; i++) {
      addTimer(() => setTypedCount(i), i * TYPE_INTERVAL);
    }

    const afterTyping = TYPED_TEXT.length * TYPE_INTERVAL + 200;

    // Show results one at a time
    for (let i = 0; i < 3; i++) {
      addTimer(() => {
        Animated.parallel([
          Animated.timing(resultTranslateY.current[i], {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(resultOpacity.current[i], {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();

        // Animate progress bar (can't use nativeDriver for width, so use opacity trick)
        Animated.timing(progressWidth.current[i], {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }, afterTyping + i * RESULT_STAGGER);
    }

    const totalDuration = afterTyping + 2 * RESULT_STAGGER + 400 + PAUSE_AFTER + 500;
    addTimer(() => runSequence(), totalDuration);
  }, [clearTimers, resetAll, addTimer]);

  useEffect(() => {
    mountedRef.current = true;

    // Blinking cursor
    cursorLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    cursorLoop.current.start();

    runSequence();

    return () => {
      mountedRef.current = false;
      cursorLoop.current?.stop();
      clearTimers();
    };
  }, [runSequence, clearTimers, cursorOpacity]);

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={[styles.searchBar, { backgroundColor: inputBg, borderColor }]}>
        <Text style={[styles.typedText, { fontFamily: fonts.bodyMedium, color: textColor }]}>
          {TYPED_TEXT.slice(0, typedCount)}
        </Text>
        <Animated.View style={[styles.cursor, { backgroundColor: brand.primary, opacity: cursorOpacity }]} />
      </View>

      {/* Results */}
      <View style={styles.results}>
        {Array.from({ length: 3 }, (_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.resultRow,
              {
                backgroundColor: cardBg,
                borderColor,
                opacity: resultOpacity.current[i],
                transform: [{ translateY: resultTranslateY.current[i] }],
              },
            ]}
          >
            {/* Result text label */}
            <Text
              style={[
                styles.resultLabel,
                { fontFamily: fonts.body, color: isDark ? dark.textPrimary : light.textPrimary },
              ]}
              numberOfLines={1}
            >
              {RESULT_LABELS[i]}
            </Text>
            {/* Progress bar track */}
            <View style={[styles.progressTrack, { backgroundColor: surfaceBg }]}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: brand.teal,
                    width: PROGRESS_WIDTHS[i],
                    opacity: progressWidth.current[i],
                  },
                ]}
              />
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  searchBar: {
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginBottom: 6,
  },
  typedText: {
    fontSize: 9,
  },
  cursor: {
    width: 1,
    height: 10,
    marginLeft: 1,
  },
  results: {
    gap: 4,
  },
  resultRow: {
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 3,
  },
  resultLabel: {
    fontSize: 7,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default AutoCompletePreview;
