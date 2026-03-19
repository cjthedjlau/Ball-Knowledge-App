import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Animated,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import Svg, { Ellipse, Line, Circle, Path, Rect } from 'react-native-svg';

const useNative = Platform.OS !== 'web';

interface Sport {
  id: string;
  render: (size: number) => React.ReactNode;
  size: number;
}

const SPORTS: Sport[] = [
  {
    id: 'football',
    render: (size: number) => (
      <Svg width={size} height={size} viewBox="0 0 60 60">
        <Ellipse cx="30" cy="30" rx="22" ry="13" fill="rgba(255,255,255,0.18)" />
        <Line x1="30" y1="20" x2="30" y2="40" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
        <Line x1="25" y1="24" x2="35" y2="24" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <Line x1="25" y1="28" x2="35" y2="28" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <Line x1="25" y1="32" x2="35" y2="32" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <Line x1="25" y1="36" x2="35" y2="36" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      </Svg>
    ),
    size: 64,
  },
  {
    id: 'basketball',
    render: (size: number) => (
      <Svg width={size} height={size} viewBox="0 0 60 60">
        <Circle cx="30" cy="30" r="26" fill="rgba(255,255,255,0.18)" />
        <Path d="M 4 30 Q 30 10 56 30" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" />
        <Path d="M 4 30 Q 30 50 56 30" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" />
        <Line x1="30" y1="4" x2="30" y2="56" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
      </Svg>
    ),
    size: 60,
  },
  {
    id: 'baseball',
    render: (size: number) => (
      <Svg width={size} height={size} viewBox="0 0 60 60">
        <Circle cx="30" cy="30" r="24" fill="rgba(255,255,255,0.18)" />
        <Path d="M 18 18 Q 14 30 18 42" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" />
        <Path d="M 42 18 Q 46 30 42 42" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" />
        <Line x1="18" y1="22" x2="22" y2="20" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <Line x1="17" y1="28" x2="21" y2="27" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <Line x1="17" y1="34" x2="21" y2="35" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <Line x1="18" y1="40" x2="22" y2="42" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      </Svg>
    ),
    size: 56,
  },
  {
    id: 'hockey',
    render: (size: number) => (
      <Svg width={size} height={size} viewBox="0 0 60 60">
        <Ellipse cx="30" cy="34" rx="22" ry="8" fill="rgba(255,255,255,0.22)" />
        <Rect x="8" y="26" width="44" height="8" fill="rgba(255,255,255,0.15)" />
        <Ellipse cx="30" cy="26" rx="22" ry="8" fill="rgba(255,255,255,0.20)" />
      </Svg>
    ),
    size: 52,
  },
];

const screenWidth = Dimensions.get('window').width;
const ARC_HEIGHT = 30;
const LEFT_EDGE = 0;
const RIGHT_EDGE = screenWidth - 64;
const LEG_DURATION = 5000;
const LEG_PAUSE = 300;
const SPORT_PAUSE = 400;

export default function SportsBallHero() {
  const [sportIndex, setSportIndex] = useState(0);
  const translateX = useRef(new Animated.Value(LEFT_EDGE)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildLeg = (toX: number, spinTo: number) => {
    return Animated.parallel([
      Animated.timing(translateX, {
        toValue: toX,
        duration: LEG_DURATION,
        useNativeDriver: useNative,
      }),
      // Arc: negative Y = upward in RN, so ball rises then falls
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -ARC_HEIGHT,
          duration: LEG_DURATION / 2,
          useNativeDriver: useNative,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: LEG_DURATION / 2,
          useNativeDriver: useNative,
        }),
      ]),
      Animated.timing(spin, {
        toValue: spinTo,
        duration: LEG_DURATION,
        useNativeDriver: useNative,
      }),
    ]);
  };

  const runAnimation = (index: number) => {
    translateX.setValue(LEFT_EDGE);
    translateY.setValue(0);
    opacity.setValue(0);
    spin.setValue(0);

    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: useNative }),
      // Left → Right
      buildLeg(RIGHT_EDGE, 1),
      Animated.delay(LEG_PAUSE),
      // Right → Left
      buildLeg(LEFT_EDGE, 0),
      Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: useNative }),
    ]).start(() => {
      timeoutRef.current = setTimeout(() => {
        const next = (index + 1) % SPORTS.length;
        setSportIndex(next);
        runAnimation(next);
      }, SPORT_PAUSE);
    });
  };

  useEffect(() => {
    runAnimation(0);
    return () => {
      translateX.stopAnimation();
      translateY.stopAnimation();
      opacity.stopAnimation();
      spin.stopAnimation();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const sport = SPORTS[sportIndex];
  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={{
          opacity,
          transform: [
            { translateX },
            { translateY },
            { rotate },
          ],
        }}
      >
        {sport.render(sport.size)}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    height: 70,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
});
