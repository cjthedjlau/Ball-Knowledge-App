import React, { useRef, useCallback } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Platform,
  GestureResponderEvent,
} from 'react-native';
import { colors } from '../styles/theme';

const useNative = Platform.OS !== 'web';

const PARTICLE_COUNT = 12;
const PARTICLE_DURATION = 600;

interface Particle {
  translateX: Animated.Value;
  translateY: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
}

interface ParticleBurstProps {
  children: React.ReactNode;
}

export default function ParticleBurst({ children }: ParticleBurstProps) {
  const particlesRef = useRef<Particle[]>(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0),
    })),
  );
  const originRef = useRef({ x: 0, y: 0 });

  const burst = useCallback((x: number, y: number) => {
    originRef.current = { x, y };

    const animations = particlesRef.current.map((p, i) => {
      // Reset
      p.translateX.setValue(0);
      p.translateY.setValue(0);
      p.opacity.setValue(1);
      p.scale.setValue(1);

      // Random angle spread in a full circle
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const distance = 30 + Math.random() * 50;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;

      return Animated.parallel([
        Animated.timing(p.translateX, {
          toValue: targetX,
          duration: PARTICLE_DURATION,
          useNativeDriver: useNative,
        }),
        Animated.timing(p.translateY, {
          toValue: targetY,
          duration: PARTICLE_DURATION,
          useNativeDriver: useNative,
        }),
        Animated.timing(p.opacity, {
          toValue: 0,
          duration: PARTICLE_DURATION,
          useNativeDriver: useNative,
        }),
        Animated.timing(p.scale, {
          toValue: 0.2,
          duration: PARTICLE_DURATION,
          useNativeDriver: useNative,
        }),
      ]);
    });

    Animated.parallel(animations).start();
  }, []);

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      const { locationX, locationY } = e.nativeEvent;
      burst(locationX, locationY);
    },
    [burst],
  );

  // Alternate between white and brand-light particle colors
  const particleColors = [
    colors.white,
    colors.brandLight,
    colors.white,
    colors.brandMid,
  ];

  return (
    <View
      style={styles.wrapper}
      onStartShouldSetResponder={() => true}
      onResponderGrant={handlePress}
    >
      {children}

      {/* Particle layer — sits above children, pointerEvents none so taps pass through */}
      <View style={styles.particleLayer} pointerEvents="none">
        {particlesRef.current.map((p, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: originRef.current.x,
                top: originRef.current.y,
                backgroundColor: particleColors[i % particleColors.length],
                opacity: p.opacity,
                transform: [
                  { translateX: p.translateX },
                  { translateY: p.translateY },
                  { scale: p.scale },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  particleLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: -3,
    marginTop: -3,
  },
});
