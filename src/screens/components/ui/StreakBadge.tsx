import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Flame } from 'lucide-react-native';
import { colors, fontFamily } from '../../../styles/theme';

const useNative = Platform.OS !== 'web';

interface StreakBadgeProps {
  count: number;
  atRisk?: boolean;
}

export default function StreakBadge({ count, atRisk = false }: StreakBadgeProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    if (count <= 0) return;

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1200,
            useNativeDriver: useNative,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: useNative,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 1000,
            useNativeDriver: useNative,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 1000,
            useNativeDriver: useNative,
          }),
        ]),
      ]),
    );

    pulse.start();
    return () => pulse.stop();
  }, [count]);

  return (
    <View style={styles.pill}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}>
        <Flame color={colors.white} fill={colors.white} size={22} />
      </Animated.View>
      <Text style={[styles.count, atRisk && styles.countAtRisk]}>{count}</Text>
      <Text style={styles.daysLabel}>Days</Text>

      {atRisk && <View style={styles.warningDot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.20)',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
    gap: 6,
  },
  count: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 34,
    letterSpacing: 1,
    color: colors.white,
  },
  countAtRisk: {
    color: colors.accentRed,
  },
  daysLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    color: 'rgba(255,255,255,0.70)',
    marginTop: 4,
  },
  warningDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentRed,
  },
});
