import React, { useEffect, useRef } from 'react';
import { Pressable, Text, StyleSheet, Animated, View } from 'react-native';
import { Bell } from 'lucide-react-native';
import { colors, fontFamily, spacing } from '../../styles/theme';

interface Props {
  onPress: () => void;
}

export default function WaitlistPill({ onPress }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.7)).current;
  const shineAnim = useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    // Pulse scale loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.07,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow opacity loop in sync
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.7,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shine sweep loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: 200,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.delay(2400),
        Animated.timing(shineAnim, {
          toValue: -80,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.93 : 1 }] }]}
    >
      <Animated.View
        style={[
          styles.pill,
          {
            transform: [{ scale: pulseAnim }],
            shadowOpacity: glowAnim as unknown as number,
          },
        ]}
      >
        {/* Shine sweep overlay */}
        <View style={styles.shineClip} pointerEvents="none">
          <Animated.View
            style={[
              styles.shine,
              { transform: [{ translateX: shineAnim }, { rotate: '25deg' }] },
            ]}
          />
        </View>

        {/* Top highlight strip for glass effect */}
        <View style={styles.highlight} pointerEvents="none" />

        <Bell size={14} color={colors.white} strokeWidth={2.5} />
        <Text style={styles.label}>Join Waitlist</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    bottom: 84,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    backgroundColor: colors.brand,
    paddingVertical: 11,
    paddingHorizontal: spacing.lg + 2,
    borderRadius: 24,
    // Multi-layer shadow: brand-tinted glow + dark depth
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 14,
    overflow: 'hidden',
    // Inner top border for glass edge
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.35)',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(0,0,0,0.25)',
    zIndex: 200,
  },
  shineClip: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 24,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 60,
    height: '200%',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '48%',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  label: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.6,
    color: colors.white,
  },
});
