import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * Returns animated style objects for Zone 1 and Zone 2 entrance.
 * Zone 1 slides down from -20px, Zone 2 slides up from 30px.
 * Both fade in with cinematic timing.
 */
export default function useZoneEntrance() {
  const zone1Opacity = useRef(new Animated.Value(0)).current;
  const zone1TranslateY = useRef(new Animated.Value(-20)).current;
  const zone2Opacity = useRef(new Animated.Value(0)).current;
  const zone2TranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const easing = Easing.bezier(0.0, 0.0, 0.2, 1);

    Animated.parallel([
      // Zone 1: slide down into place
      Animated.timing(zone1Opacity, {
        toValue: 1,
        duration: 500,
        easing,
        useNativeDriver: true,
      }),
      Animated.timing(zone1TranslateY, {
        toValue: 0,
        duration: 500,
        easing,
        useNativeDriver: true,
      }),
      // Zone 2: slide up into place with slight delay
      Animated.timing(zone2Opacity, {
        toValue: 1,
        duration: 600,
        delay: 100,
        easing,
        useNativeDriver: true,
      }),
      Animated.timing(zone2TranslateY, {
        toValue: 0,
        duration: 600,
        delay: 100,
        easing,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return {
    zone1Style: {
      opacity: zone1Opacity,
      transform: [{ translateY: zone1TranslateY }],
    },
    zone2Style: {
      opacity: zone2Opacity,
      transform: [{ translateY: zone2TranslateY }],
    },
  };
}
