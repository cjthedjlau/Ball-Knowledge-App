import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { brand, dark, light, fonts, colors, radius } from '../../../styles/theme';
import { useTheme } from '../../../hooks/useTheme';

type TileState = 'empty' | 'correct' | 'close' | 'wrong' | 'higher' | 'lower' | 'close_higher' | 'close_lower';

interface GuessGridTileProps {
  value: string;
  state: TileState;
  flex?: number;
  /** Delay in ms before this tile flips to reveal its result */
  flipDelay?: number;
}

export default function GuessGridTile({ value, state, flex: flexProp, flipDelay = 0 }: GuessGridTileProps) {
  const { isDark } = useTheme();
  const sizeStyle = flexProp !== undefined ? { flex: flexProp } : undefined;

  if (state === 'empty') {
    return (
      <View
        style={[
          styles.tile,
          sizeStyle,
          {
            backgroundColor: isDark ? dark.surface : light.surface,
            borderWidth: 1,
            borderColor: isDark ? dark.cardBorder : light.cardBorder,
          },
        ]}
      />
    );
  }

  return (
    <FlipTile value={value} state={state} sizeStyle={sizeStyle} flipDelay={flipDelay} isDark={isDark} />
  );
}

function FlipTile({
  value,
  state,
  sizeStyle,
  flipDelay,
  isDark,
}: {
  value: string;
  state: Exclude<TileState, 'empty'>;
  sizeStyle: any;
  flipDelay: number;
  isDark: boolean;
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

  const bgForState: Record<Exclude<TileState, 'empty'>, string> = {
    correct: colors.accentGreen,
    close: colors.warningBg,
    close_higher: colors.warningBg,
    close_lower: colors.warningBg,
    wrong: isDark ? dark.surface : light.surface,
    higher: isDark ? dark.surface : light.surface,
    lower: isDark ? dark.surface : light.surface,
  };

  return (
    <View style={[styles.tile, sizeStyle, { backgroundColor: 'transparent' }]}>
      {/* Front face -- dark placeholder */}
      <Animated.View
        style={[
          styles.tile,
          StyleSheet.absoluteFill,
          {
            backgroundColor: isDark ? dark.surface : light.surface,
            borderWidth: 1,
            borderColor: isDark ? dark.cardBorder : light.cardBorder,
            transform: [{ rotateX: frontRotate }],
          },
        ]}
      />

      {/* Back face -- colored result */}
      <Animated.View
        style={[
          styles.tile,
          StyleSheet.absoluteFill,
          {
            backgroundColor: bgForState[state],
            transform: [{ rotateX: backRotate }, { scale: backScale }],
            backfaceVisibility: 'hidden',
          },
        ]}
      >
        <Text
          style={[
            styles.value,
            { color: isDark ? dark.textPrimary : light.textPrimary },
            hasArrow && styles.valueCompact,
            isClose && { color: light.textPrimary },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.55}
        >
          {value}
        </Text>
        {hasArrow && (
          <Text
            style={[
              styles.arrow,
              { color: isDark ? dark.textPrimary : light.textPrimary },
              (state === 'close_higher' || state === 'close_lower') && { color: light.textPrimary },
            ]}
          >
            {arrowDirection}
          </Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    height: 68,
    borderRadius: radius.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  value: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  valueCompact: {
    marginTop: 2,
    fontSize: 15,
  },
  arrow: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 13,
    marginTop: -2,
  },
});
