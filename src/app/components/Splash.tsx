import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { darkColors, fontFamily } from '../../styles/theme';

const TARGET_TEXT = 'BALL KNOWLEDGE';
const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const SCRAMBLE_COLORS = ['#FC345C', '#07bccc', '#e601c0', '#f40468'];
const DURATION = 800;

const getRandomChar = () => ALPHABETS[Math.floor(Math.random() * ALPHABETS.length)];

interface SplashProps {
  onFinish?: () => void;
}

export default function Splash({ onFinish }: SplashProps) {
  const [displayText, setDisplayText] = useState<string[]>(() =>
    TARGET_TEXT.split('').map(ch => (ch === ' ' ? ' ' : getRandomChar()))
  );
  const [lockedMask, setLockedMask] = useState<boolean[]>(() =>
    TARGET_TEXT.split('').map(() => false)
  );

  const [scrambleColors, setScrambleColors] = useState<string[]>(() =>
    TARGET_TEXT.split('').map((_, i) => SCRAMBLE_COLORS[i % SCRAMBLE_COLORS.length])
  );

  const iterationsRef = useRef(0);
  const colorTickRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const intervalDelay = DURATION / (TARGET_TEXT.length * 10);

    intervalRef.current = setInterval(() => {
      iterationsRef.current += 0.1;
      colorTickRef.current += 1;
      const current = iterationsRef.current;
      const tick = colorTickRef.current;

      setDisplayText(
        TARGET_TEXT.split('').map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i <= current) return ch;
          return getRandomChar();
        })
      );

      setLockedMask(
        TARGET_TEXT.split('').map((_, i) => i <= current)
      );

      // Cycle each unlocked letter through SCRAMBLE_COLORS offset by letter index
      setScrambleColors(
        TARGET_TEXT.split('').map((_, i) =>
          SCRAMBLE_COLORS[(tick + i) % SCRAMBLE_COLORS.length]
        )
      );

      // All letters locked — stop scrambling
      if (current >= TARGET_TEXT.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);

        navTimerRef.current = setTimeout(() => {
          onFinish?.();
        }, 1000);
      }
    }, intervalDelay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        {displayText.map((char, i) => (
          <Text
            key={i}
            style={[
              styles.letter,
              { color: lockedMask[i] ? '#FFFFFF' : scrambleColors[i] },
            ]}
          >
            {char}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Platform.OS === 'web' ? ('100vh' as any) : undefined,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 52,
    fontStyle: 'italic',
    letterSpacing: 4,
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
