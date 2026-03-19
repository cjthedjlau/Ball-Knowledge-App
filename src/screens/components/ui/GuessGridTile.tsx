import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, darkColors, fontFamily } from '../../../styles/theme';

type TileState = 'empty' | 'correct' | 'close' | 'wrong' | 'higher' | 'lower' | 'close_higher' | 'close_lower';

interface GuessGridTileProps {
  value: string;
  state: TileState;
  flex?: number;
  /** Delay in ms before this tile flips to reveal its result */
  flipDelay?: number;
}

export default function GuessGridTile({ value, state, flex: flexProp, flipDelay = 0 }: GuessGridTileProps) {
  const sizeStyle = flexProp !== undefined ? { flex: flexProp } : undefined;

  if (state === 'empty') {
    return <View style={[styles.tile, sizeStyle, styles.tileEmpty]} />;
  }

  return (
    <FlipTile value={value} state={state} sizeStyle={sizeStyle} flipDelay={flipDelay} />
  );
}

function FlipTile({
  value,
  state,
  sizeStyle,
  flipDelay,
}: {
  value: string;
  state: Exclude<TileState, 'empty'>;
  sizeStyle: any;
  flipDelay: number;
}) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const hasFlipped = useRef(false);

  useEffect(() => {
    if (hasFlipped.current) return;
    hasFlipped.current = true;

    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 400,
      delay: flipDelay,
      useNativeDriver: true,
    }).start();
  }, []);

  // Front face rotation: 0deg -> 90deg (disappears at halfway)
  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '90deg'],
  });

  // Back face rotation: -90deg -> 0deg (appears at halfway)
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['-90deg', '-90deg', '0deg'],
  });

  // Scale pop on landing
  const backScale = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.75, 1],
    outputRange: [1, 1, 1.08, 1],
  });

  const hasArrow = state === 'higher' || state === 'lower' || state === 'close_higher' || state === 'close_lower';
  const arrowDirection = (state === 'higher' || state === 'close_higher') ? '↑' : '↓';
  const isClose = state === 'close' || state === 'close_higher' || state === 'close_lower';

  return (
    <View style={[styles.tile, sizeStyle, { backgroundColor: 'transparent' }]}>
      {/* Front face — dark placeholder */}
      <Animated.View
        style={[
          styles.tile,
          styles.tileFront,
          StyleSheet.absoluteFill,
          { transform: [{ rotateX: frontRotate }] },
        ]}
      />

      {/* Back face — colored result */}
      <Animated.View
        style={[
          styles.tile,
          StyleSheet.absoluteFill,
          backgroundForState[state],
          {
            transform: [{ rotateX: backRotate }, { scale: backScale }],
            backfaceVisibility: 'hidden',
          },
        ]}
      >
        <Text
          style={[styles.value, hasArrow && styles.valueCompact, isClose && styles.valueDark]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.55}
        >
          {value}
        </Text>
        {hasArrow && (
          <Text style={[styles.arrow, (state === 'close_higher' || state === 'close_lower') && styles.arrowDark]}>
            {arrowDirection}
          </Text>
        )}
      </Animated.View>
    </View>
  );
}

const backgroundForState: Record<Exclude<TileState, 'empty'>, { backgroundColor: string }> = {
  correct: { backgroundColor: '#00C897' },
  close: { backgroundColor: '#FFD700' },
  close_higher: { backgroundColor: '#FFD700' },
  close_lower: { backgroundColor: '#FFD700' },
  wrong: { backgroundColor: '#383838' },
  higher: { backgroundColor: '#383838' },
  lower: { backgroundColor: '#383838' },
};

const styles = StyleSheet.create({
  tile: {
    height: 68,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  tileEmpty: {
    backgroundColor: darkColors.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tileFront: {
    backgroundColor: darkColors.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  value: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
  },
  valueCompact: {
    marginTop: 2,
    fontSize: 15,
  },
  valueDark: {
    color: '#1A1A2E',
  },
  arrow: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: colors.white,
    marginTop: -2,
  },
  arrowDark: {
    color: '#1A1A2E',
  },
});
