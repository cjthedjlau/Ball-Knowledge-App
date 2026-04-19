import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import { brand, dark, light, fonts } from '../../../../styles/theme';

interface Props {
  isDark: boolean;
}

const COUNTS = ['13', '10', '7', '4', '1'];
const LINE_WIDTHS = ['75%', '60%', '85%', '65%'] as const;
const CLUE_TEXTS = ['Greatest scorer', 'Six rings with', 'the Chicago Bulls', 'Number twenty-three'];
const STEP_DELAY = 400;

const ThirteenWordsPreview: React.FC<Props> = ({ isDark }) => {
  const lineOpacities = useRef(LINE_WIDTHS.map(() => new Animated.Value(0))).current;
  const counterOpacity = useRef(new Animated.Value(1)).current;
  const counterPulse = useRef(new Animated.Value(1)).current;
  const [counterText, setCounterText] = useState('13');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const resetAll = useCallback(() => {
    lineOpacities.forEach((op) => op.setValue(0));
    counterOpacity.setValue(1);
    counterPulse.setValue(1);
    setCounterText('13');
  }, [lineOpacities, counterOpacity, counterPulse]);

  useEffect(() => {
    mountedRef.current = true;

    const runLoop = () => {
      if (!mountedRef.current) return;
      resetAll();

      const revealLine = (index: number) => {
        if (!mountedRef.current) return;

        if (index >= LINE_WIDTHS.length) {
          // Counter shows "1", flash pulse
          setCounterText('1');
          Animated.sequence([
            Animated.timing(counterPulse, {
              toValue: 1.2,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(counterPulse, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            // Pause then restart
            timerRef.current = setTimeout(runLoop, 800);
          });
          return;
        }

        // Update counter
        setCounterText(COUNTS[index]);

        // Fade in line
        Animated.timing(lineOpacities[index], {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          timerRef.current = setTimeout(() => revealLine(index + 1), STEP_DELAY);
        });
      };

      // Start after brief pause
      timerRef.current = setTimeout(() => revealLine(0), 400);
    };

    runLoop();

    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [lineOpacities, counterPulse, resetAll]);

  const surfaceColor = isDark ? dark.surface : light.surface;
  const mutedColor = isDark ? dark.textMuted : light.textMuted;

  return (
    <View style={styles.container}>
      {/* Counter */}
      <Animated.Text
        style={[
          styles.counter,
          {
            fontFamily: fonts.display,
            color: brand.primary,
            opacity: counterOpacity,
            transform: [{ scale: counterPulse }],
          },
        ]}
      >
        {counterText}
      </Animated.Text>

      {/* Clue lines */}
      <View style={styles.linesArea}>
        {LINE_WIDTHS.map((width, i) => (
          <Animated.View
            key={i}
            style={[
              styles.line,
              {
                width,
                backgroundColor: surfaceColor,
                opacity: lineOpacities[i],
              },
            ]}
          >
            <Text style={[styles.clueText, { color: mutedColor, fontFamily: fonts.body }]}>
              {CLUE_TEXTS[i]}
            </Text>
          </Animated.View>
        ))}
      </View>

      <Text style={[styles.label, { color: mutedColor, fontFamily: fonts.bodySemiBold }]}>
        13 WORDS
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: {
    fontSize: 18,
  },
  linesArea: {
    marginTop: 8,
    width: '80%',
    gap: 4,
    alignItems: 'flex-start',
  },
  line: {
    height: 12,
    borderRadius: 3,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  clueText: {
    fontSize: 7,
  },
  label: {
    fontSize: 8,
    letterSpacing: 1.5,
    marginTop: 8,
  },
});

export default ThirteenWordsPreview;
