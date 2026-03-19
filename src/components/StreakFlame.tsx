import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../styles/theme';

const useNative = Platform.OS !== 'web';

interface StreakFlameProps {
  streak: number;
}

// Scale the flame based on streak length
function getFlameScale(streak: number): number {
  if (streak <= 0) return 0;
  if (streak <= 2) return 0.8;
  if (streak <= 5) return 1.0;
  if (streak <= 10) return 1.2;
  if (streak <= 25) return 1.4;
  return 1.6;
}

export default function StreakFlame({ streak }: StreakFlameProps) {
  const flickerOpacity = useRef(new Animated.Value(0.7)).current;
  const scalePulse = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;

  const flameScale = getFlameScale(streak);

  useEffect(() => {
    if (streak <= 0) return;

    // Flicker opacity loop
    const flickerAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(flickerOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: useNative,
        }),
        Animated.timing(flickerOpacity, {
          toValue: 0.6,
          duration: 300,
          useNativeDriver: useNative,
        }),
        Animated.timing(flickerOpacity, {
          toValue: 0.9,
          duration: 250,
          useNativeDriver: useNative,
        }),
        Animated.timing(flickerOpacity, {
          toValue: 0.7,
          duration: 350,
          useNativeDriver: useNative,
        }),
      ]),
    );

    // Scale pulse loop
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(scalePulse, {
          toValue: 1.08,
          duration: 600,
          useNativeDriver: useNative,
        }),
        Animated.timing(scalePulse, {
          toValue: 0.95,
          duration: 500,
          useNativeDriver: useNative,
        }),
      ]),
    );

    // Glow pulse loop
    const glowAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.6,
          duration: 700,
          useNativeDriver: useNative,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.2,
          duration: 600,
          useNativeDriver: useNative,
        }),
      ]),
    );

    flickerAnim.start();
    pulseAnim.start();
    glowAnim.start();

    return () => {
      flickerAnim.stop();
      pulseAnim.stop();
      glowAnim.stop();
    };
  }, [streak]);

  if (streak <= 0) return null;

  return (
    <View style={styles.container}>
      {/* Glow layer behind flame */}
      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glowOpacity,
            transform: [{ scale: flameScale * 1.4 }],
          },
        ]}
      />

      {/* Main flame */}
      <Animated.View
        style={{
          opacity: flickerOpacity,
          transform: [
            { scale: Animated.multiply(scalePulse, new Animated.Value(flameScale)) },
          ],
        }}
      >
        <Svg width={40} height={52} viewBox="0 0 40 52">
          {/* Outer flame */}
          <Path
            d="M20 2 C20 2 8 16 8 28 C8 36 13 44 20 48 C27 44 32 36 32 28 C32 16 20 2 20 2Z"
            fill={colors.white}
            fillOpacity={0.9}
          />
          {/* Inner flame */}
          <Path
            d="M20 14 C20 14 14 24 14 32 C14 37 17 42 20 44 C23 42 26 37 26 32 C26 24 20 14 20 14Z"
            fill={colors.brand}
            fillOpacity={0.85}
          />
          {/* Core hotspot */}
          <Path
            d="M20 24 C20 24 17 30 17 34 C17 37 18 40 20 41 C22 40 23 37 23 34 C23 30 20 24 20 24Z"
            fill={colors.white}
            fillOpacity={0.6}
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 64,
  },
  glow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
});
