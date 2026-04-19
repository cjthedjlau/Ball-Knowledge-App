import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { brand, fonts, colors } from '../styles/theme';

interface OfflineBannerProps {
  visible: boolean;
}

/**
 * Animated banner shown at the top of the screen when the device is offline.
 * Slides down when offline, slides up when back online.
 */
export default function OfflineBanner({ visible }: OfflineBannerProps) {
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -50,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  // Always render (for animation), but clip when hidden
  if (Platform.OS === 'web' && !visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <WifiOff color={colors.white} size={14} strokeWidth={2.5} />
      <Text style={styles.text}>
        No internet connection
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: brand.dark,
    paddingVertical: 6,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    zIndex: 9999,
  },
  text: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.white,
  },
});
