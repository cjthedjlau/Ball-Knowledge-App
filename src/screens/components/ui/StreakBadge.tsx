import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Flame } from 'lucide-react-native';
import { brand, dark, light, fonts, colors } from '../../../styles/theme';
import { useTheme } from '../../../hooks/useTheme';

const useNative = Platform.OS !== 'web';

interface StreakBadgeProps {
  count: number;
  atRisk?: boolean;
}

export default function StreakBadge({ count, atRisk = false }: StreakBadgeProps) {
  const { isDark } = useTheme();
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
    <View
      style={[
        styles.pill,
        {
          backgroundColor: isDark
            ? 'rgba(255,255,255,0.08)'
            : 'rgba(0,0,0,0.06)',
        },
      ]}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}>
        <Flame color={colors.white} fill={colors.white} size={22} />
      </Animated.View>
      <Text
        style={[
          styles.count,
          { color: colors.white },
          atRisk && styles.countAtRisk,
        ]}
      >
        {count}
      </Text>
      <Text
        style={[
          styles.daysLabel,
          { color: 'rgba(255,255,255,0.7)' },
        ]}
      >
        Days
      </Text>

      {atRisk && <View style={styles.warningDot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  count: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 34,
    letterSpacing: 1,
  },
  countAtRisk: {
    color: colors.accentRed,
  },
  daysLabel: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 16,
    marginTop: 4,
  },
  warningDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentRed,
  },
});
