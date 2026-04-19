import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import { brand, dark, light, fonts, colors } from '../../../../styles/theme';

interface Props {
  isDark: boolean;
}

type AnimState = 'prompt' | 'answerA' | 'answerB' | 'vote' | 'winner';

const ANSWERS = [
  { prompt: 'Best trash talker?', a: 'MJ', b: 'Bird' },
  { prompt: 'Most overpaid?', a: 'Russ', b: 'Ben Simmons' },
  { prompt: 'GOAT debate?', a: 'LeBron', b: 'Jordan' },
];

const HotTakeShowdownPreview: React.FC<Props> = ({ isDark }) => {
  const fadePrompt = useRef(new Animated.Value(0)).current;
  const fadeA = useRef(new Animated.Value(0)).current;
  const fadeB = useRef(new Animated.Value(0)).current;
  const voteBarWidth = useRef(new Animated.Value(0)).current;
  const [state, setState] = useState<AnimState>('prompt');
  const [roundIdx, setRoundIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const round = ANSWERS[roundIdx % ANSWERS.length];

  const runLoop = useCallback(() => {
    if (!mountedRef.current) return;

    // Reset
    fadePrompt.setValue(0);
    fadeA.setValue(0);
    fadeB.setValue(0);
    voteBarWidth.setValue(0);
    setState('prompt');

    // 1. Show prompt
    Animated.timing(fadePrompt, { toValue: 1, duration: 300, useNativeDriver: true }).start(() => {
      if (!mountedRef.current) return;

      // 2. Show answer A
      timerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setState('answerA');
        Animated.timing(fadeA, { toValue: 1, duration: 250, useNativeDriver: true }).start(() => {
          if (!mountedRef.current) return;

          // 3. Show answer B
          timerRef.current = setTimeout(() => {
            if (!mountedRef.current) return;
            setState('answerB');
            Animated.timing(fadeB, { toValue: 1, duration: 250, useNativeDriver: true }).start(() => {
              if (!mountedRef.current) return;

              // 4. Vote animation
              timerRef.current = setTimeout(() => {
                if (!mountedRef.current) return;
                setState('vote');
                Animated.timing(voteBarWidth, { toValue: 1, duration: 600, useNativeDriver: false }).start(() => {
                  if (!mountedRef.current) return;

                  // 5. Winner flash
                  timerRef.current = setTimeout(() => {
                    if (!mountedRef.current) return;
                    setState('winner');

                    // 6. Pause then restart with next round
                    timerRef.current = setTimeout(() => {
                      if (!mountedRef.current) return;
                      setRoundIdx(i => i + 1);
                      runLoop();
                    }, 800);
                  }, 500);
                });
              }, 400);
            });
          }, 400);
        });
      }, 500);
    });
  }, [fadePrompt, fadeA, fadeB, voteBarWidth]);

  useEffect(() => {
    mountedRef.current = true;
    runLoop();
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [runLoop]);

  const t = isDark ? dark : light;
  const mutedColor = isDark ? dark.textMuted : light.textMuted;
  const cardBg = isDark ? dark.surface : light.surface;

  return (
    <View style={styles.container}>
      {/* Prompt */}
      <Animated.Text
        style={[
          styles.prompt,
          { color: isDark ? dark.textPrimary : light.textPrimary, opacity: fadePrompt },
        ]}
        numberOfLines={1}
      >
        {round.prompt}
      </Animated.Text>

      {/* Answer cards */}
      <View style={styles.answersRow}>
        <Animated.View
          style={[
            styles.answerCard,
            {
              backgroundColor: cardBg,
              borderColor: state === 'winner' ? brand.primary : 'transparent',
              borderWidth: state === 'winner' ? 2 : 1,
              opacity: fadeA,
            },
          ]}
        >
          <Text style={[styles.answerLabel, { color: brand.primary }]}>A</Text>
          <Text style={[styles.answerText, { color: isDark ? dark.textPrimary : light.textPrimary }]} numberOfLines={1}>
            {round.a}
          </Text>
        </Animated.View>

        <Text style={[styles.vs, { color: mutedColor }]}>VS</Text>

        <Animated.View
          style={[
            styles.answerCard,
            {
              backgroundColor: cardBg,
              borderColor: 'transparent',
              borderWidth: 1,
              opacity: fadeB,
            },
          ]}
        >
          <Text style={[styles.answerLabel, { color: '#07BCCC' }]}>B</Text>
          <Text style={[styles.answerText, { color: isDark ? dark.textPrimary : light.textPrimary }]} numberOfLines={1}>
            {round.b}
          </Text>
        </Animated.View>
      </View>

      {/* Vote bar */}
      {(state === 'vote' || state === 'winner') && (
        <View style={[styles.voteBar, { backgroundColor: isDark ? dark.surface : light.surface }]}>
          <Animated.View
            style={[
              styles.voteFill,
              {
                backgroundColor: brand.primary,
                width: voteBarWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '64%'],
                }),
              },
            ]}
          />
          {state === 'winner' && (
            <Text style={styles.votePct}>64%</Text>
          )}
        </View>
      )}

      <Text style={[styles.label, { color: mutedColor }]}>HOT TAKE SHOWDOWN</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  prompt: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 10,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  answersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: '90%',
  },
  answerCard: {
    flex: 1,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  answerLabel: {
    fontFamily: fonts.display,
    fontSize: 10,
    letterSpacing: 1,
  },
  answerText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 9,
  },
  vs: {
    fontFamily: fonts.display,
    fontSize: 8,
  },
  voteBar: {
    width: '80%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  voteFill: {
    height: '100%',
    borderRadius: 3,
  },
  votePct: {
    position: 'absolute',
    right: 2,
    top: -10,
    fontFamily: fonts.bodySemiBold,
    fontSize: 8,
    color: brand.primary,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 7,
    letterSpacing: 1.5,
    marginTop: 2,
  },
});

export default HotTakeShowdownPreview;
