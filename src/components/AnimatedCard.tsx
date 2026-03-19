import React, { useEffect, useRef } from 'react';
import { Animated, type ViewStyle } from 'react-native';
import { DURATIONS, EASING } from '../lib/animations';

interface Props {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle;
}

export default function AnimatedCard({ children, delay = 0, style }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: DURATIONS.cinematic,
        delay,
        easing: EASING.enter,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: DURATIONS.cinematic,
        delay,
        easing: EASING.enter,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
