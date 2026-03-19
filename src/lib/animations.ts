import { Animated, Easing } from 'react-native';

// ---------------------------------------------------------------------------
// Durations
// ---------------------------------------------------------------------------

export const DURATIONS = {
  fast: 200,
  normal: 350,
  cinematic: 500,
  slow: 700,
};

// ---------------------------------------------------------------------------
// Easing curves
// ---------------------------------------------------------------------------

export const EASING = {
  smooth: Easing.bezier(0.25, 0.1, 0.25, 1),
  enter: Easing.bezier(0.0, 0.0, 0.2, 1),
  exit: Easing.bezier(0.4, 0.0, 1, 1),
  spring: Easing.bezier(0.34, 1.56, 0.64, 1),
};

// ---------------------------------------------------------------------------
// Fade + slide-up entrance
// ---------------------------------------------------------------------------

export function entranceAnim(
  opacity: Animated.Value,
  translateY: Animated.Value,
  delay = 0,
  duration = DURATIONS.cinematic,
) {
  return Animated.parallel([
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      easing: EASING.enter,
      useNativeDriver: true,
    }),
    Animated.timing(translateY, {
      toValue: 0,
      duration,
      delay,
      easing: EASING.enter,
      useNativeDriver: true,
    }),
  ]);
}

// ---------------------------------------------------------------------------
// Fade + slide-down exit
// ---------------------------------------------------------------------------

export function exitAnim(
  opacity: Animated.Value,
  translateY: Animated.Value,
  duration = DURATIONS.normal,
) {
  return Animated.parallel([
    Animated.timing(opacity, {
      toValue: 0,
      duration,
      easing: EASING.exit,
      useNativeDriver: true,
    }),
    Animated.timing(translateY, {
      toValue: 20,
      duration,
      easing: EASING.exit,
      useNativeDriver: true,
    }),
  ]);
}

// ---------------------------------------------------------------------------
// Staggered children entrance
// ---------------------------------------------------------------------------

export function staggerEntrance(
  anims: { opacity: Animated.Value; translateY: Animated.Value }[],
  staggerDelay = 80,
  baseDuration = DURATIONS.cinematic,
) {
  return Animated.stagger(
    staggerDelay,
    anims.map(({ opacity, translateY }) =>
      entranceAnim(opacity, translateY, 0, baseDuration),
    ),
  );
}
