import React, { useEffect, useRef, useMemo } from 'react';
import { Animated, Platform, View, StyleSheet, Easing } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { brand } from '../styles/theme';

const useNative = Platform.OS !== 'web';

interface StarData {
  id: number;
  xPct: number;
  yPct: number;
  size: number;
  baseOpacity: number;
  colorType: 'white' | 'cyan' | 'brand'; // resolved at render time based on theme
  twinkleDuration: number; // ms per twinkle cycle
  driftX: number; // max drift in % units
  driftY: number;
  driftDuration: number; // ms per drift cycle
}

const COLOR_TYPES: StarData['colorType'][] = [
  'white', 'white', 'white', 'white', 'white',
  'white', 'white', 'cyan', 'cyan', 'brand',
];

function buildStars(count: number): StarData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    xPct: Math.random() * 96 + 2,
    yPct: Math.random() * 96 + 2,
    size: Math.random() * 3.5 + 2,
    baseOpacity: Math.random() * 0.2 + 0.8, // 0.8–1.0 (very bright)
    colorType: COLOR_TYPES[Math.floor(Math.random() * COLOR_TYPES.length)],
    twinkleDuration: 2000 + Math.random() * 4000, // 2–6s
    driftX: (Math.random() - 0.5) * 1.2, // ±0.6% drift
    driftY: (Math.random() - 0.5) * 1.2,
    driftDuration: 6000 + Math.random() * 8000, // 6–14s
  }));
}

const DEFAULT_STARS = buildStars(100);

function resolveColor(colorType: StarData['colorType'], isDark: boolean): string {
  switch (colorType) {
    case 'white':
      return isDark ? 'rgba(255,255,255,0.6)' : 'rgba(252,52,92,0.15)';
    case 'cyan':
      return brand.teal;
    case 'brand':
      return brand.primary;
  }
}

/* ── Animated Star ── */
function AnimatedStar({ star, isDark }: { star: StarData; isDark: boolean }) {
  const opacity = useRef(new Animated.Value(star.baseOpacity)).current;
  const driftX = useRef(new Animated.Value(0)).current;
  const driftY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Twinkle: gentle opacity oscillation
    const twinkle = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: star.baseOpacity * 0.4,
          duration: star.twinkleDuration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: useNative,
        }),
        Animated.timing(opacity, {
          toValue: star.baseOpacity,
          duration: star.twinkleDuration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: useNative,
        }),
      ]),
    );

    // Drift: slow positional wander
    const drift = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(driftX, {
            toValue: star.driftX,
            duration: star.driftDuration / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: useNative,
          }),
          Animated.timing(driftX, {
            toValue: 0,
            duration: star.driftDuration / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: useNative,
          }),
        ]),
        Animated.sequence([
          Animated.timing(driftY, {
            toValue: star.driftY,
            duration: star.driftDuration / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: useNative,
          }),
          Animated.timing(driftY, {
            toValue: 0,
            duration: star.driftDuration / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: useNative,
          }),
        ]),
      ]),
    );

    twinkle.start();
    drift.start();

    return () => {
      twinkle.stop();
      drift.stop();
    };
  }, []);

  // On web we animate marginLeft/marginTop (percentage left/top can't be animated).
  // On native we use translateX/Y.
  const animatedStyle = useNative
    ? {
        opacity,
        transform: [
          { translateX: driftX },
          { translateY: driftY },
        ],
      }
    : {
        opacity,
        marginLeft: driftX,
        marginTop: driftY,
      };

  const color = resolveColor(star.colorType, isDark);

  return (
    <Animated.View
      style={[
        {
          position: 'absolute' as const,
          left: `${star.xPct}%` as any,
          top: `${star.yPct}%` as any,
          width: star.size,
          height: star.size,
          borderRadius: star.size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

/* ── Shooting Star ── */
function ShootingStar({ isDark }: { isDark: boolean }) {
  const posX = useRef(new Animated.Value(0)).current;
  const posY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const starColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(252,52,92,0.15)';

  useEffect(() => {
    function launchStar() {
      // Random start position in top 60% / left 80%
      const startX = Math.random() * 80;
      const startY = Math.random() * 40;
      const travelX = 15 + Math.random() * 20; // 15–35% travel
      const travelY = 10 + Math.random() * 15;
      const duration = 600 + Math.random() * 500; // 600–1100ms

      posX.setValue(startX);
      posY.setValue(startY);

      Animated.parallel([
        Animated.timing(posX, {
          toValue: startX + travelX,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: useNative,
        }),
        Animated.timing(posY, {
          toValue: startY + travelY,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: useNative,
        }),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: duration * 0.15,
            useNativeDriver: useNative,
          }),
          Animated.timing(opacity, {
            toValue: 0.8,
            duration: duration * 0.5,
            useNativeDriver: useNative,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: duration * 0.35,
            useNativeDriver: useNative,
          }),
        ]),
      ]).start(() => {
        // Wait 4–10 seconds before next shooting star
        const delay = 4000 + Math.random() * 6000;
        setTimeout(launchStar, delay);
      });
    }

    // First shooting star after 2–5 seconds
    const initialDelay = setTimeout(launchStar, 2000 + Math.random() * 3000);
    return () => clearTimeout(initialDelay);
  }, []);

  // Shooting star uses left/top percentage on web, translateX/Y on native
  const animatedStyle = useNative
    ? {
        opacity,
        transform: [
          { translateX: posX },
          { translateY: posY },
        ],
      }
    : {
        opacity,
        left: posX.interpolate({
          inputRange: [0, 100],
          outputRange: ['0%' as any, '100%' as any],
        }),
        top: posY.interpolate({
          inputRange: [0, 100],
          outputRange: ['0%' as any, '100%' as any],
        }),
      };

  return (
    <Animated.View
      style={[
        {
          position: 'absolute' as const,
          width: 2,
          height: 2,
          borderRadius: 1,
          backgroundColor: starColor,
          // Tail glow
          shadowColor: starColor,
          shadowOffset: { width: -4, height: -2 },
          shadowOpacity: 0.9,
          shadowRadius: 6,
        },
        animatedStyle,
      ]}
    />
  );
}

/* ── Main Component ── */
interface Props {
  starCount?: number;
}

export default function StarryBackground({ starCount }: Props) {
  const { isDark } = useTheme();

  const stars = useMemo(
    () => (starCount ? buildStars(starCount) : DEFAULT_STARS),
    [starCount],
  );

  return (
    <View
      pointerEvents="none"
      style={
        Platform.OS === 'web'
          ? styles.containerWeb
          : styles.containerNative
      }
    >
      {stars.map(star => (
        <AnimatedStar key={star.id} star={star} isDark={isDark} />
      ))}
      <ShootingStar isDark={isDark} />
      <ShootingStar isDark={isDark} />
    </View>
  );
}

const styles = StyleSheet.create({
  containerWeb: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%' as any,
    height: '100%' as any,
    overflow: 'hidden',
  },
  containerNative: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
});
