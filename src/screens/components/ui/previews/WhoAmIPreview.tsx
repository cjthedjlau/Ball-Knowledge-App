import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import { brand, dark, light, fonts, colors } from '../../../../styles/theme';

interface Props {
  isDark: boolean;
}

const WhoAmIPreview: React.FC<Props> = ({ isDark }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const run = () => {
      progress.setValue(0);
      animRef.current = Animated.loop(
        Animated.sequence([
          // 0-800ms: ? pulses
          Animated.timing(progress, {
            toValue: 0.24, // 800/3300
            duration: 800,
            useNativeDriver: true,
          }),
          // 800-1000ms: settle
          Animated.timing(progress, {
            toValue: 0.30, // 1000/3300
            duration: 200,
            useNativeDriver: true,
          }),
          // 1000-1500ms: YES highlights
          Animated.timing(progress, {
            toValue: 0.45, // 1500/3300
            duration: 500,
            useNativeDriver: true,
          }),
          // 1500-2000ms: NO highlights
          Animated.timing(progress, {
            toValue: 0.61, // 2000/3300
            duration: 500,
            useNativeDriver: true,
          }),
          // 2000-2800ms: ? crossfades to card
          Animated.timing(progress, {
            toValue: 0.85, // 2800/3300
            duration: 800,
            useNativeDriver: true,
          }),
          // 2800-3300ms: pause + reset
          Animated.timing(progress, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      );
      animRef.current.start();
    };
    run();
    return () => {
      animRef.current?.stop();
    };
  }, [progress]);

  // ? pulse scale: 1 -> 1.15 -> 1 during 0-0.24
  const questionScale = progress.interpolate({
    inputRange: [0, 0.12, 0.24, 1],
    outputRange: [1, 1.15, 1, 1],
  });

  // ? opacity: visible until crossfade at 0.61, fades out by 0.7
  const questionOpacity = progress.interpolate({
    inputRange: [0, 0.61, 0.7, 0.85, 1],
    outputRange: [1, 1, 0, 0, 1],
  });

  // Hint text opacity: fades in at 0.24-0.30 (before YES highlights)
  const hintOpacity = progress.interpolate({
    inputRange: [0, 0.23, 0.30, 0.61, 0.7, 0.85, 1],
    outputRange: [0, 0, 1, 1, 0, 0, 0],
  });

  // Card opacity: appears at 0.61, visible until 0.85, fades out
  const cardOpacity = progress.interpolate({
    inputRange: [0, 0.61, 0.7, 0.85, 0.92, 1],
    outputRange: [0, 0, 1, 1, 0, 0],
  });

  // YES button bg opacity: highlights at 0.30-0.45
  const yesBgOpacity = progress.interpolate({
    inputRange: [0, 0.29, 0.35, 0.44, 0.46, 1],
    outputRange: [0, 0, 1, 1, 0, 0],
  });

  // NO button bg opacity: highlights at 0.45-0.61
  const noBgOpacity = progress.interpolate({
    inputRange: [0, 0.44, 0.50, 0.60, 0.62, 1],
    outputRange: [0, 0, 1, 1, 0, 0],
  });

  const textPrimary = isDark ? dark.textPrimary : light.textPrimary;
  const mutedColor = isDark ? dark.textMuted : light.textMuted;
  const surfaceColor = isDark ? dark.surface : light.surface;

  return (
    <View style={styles.container}>
      {/* Hint question */}
      <Animated.Text
        style={[
          styles.hintText,
          {
            fontFamily: fonts.bodySemiBold,
            color: mutedColor,
            opacity: hintOpacity,
          },
        ]}
      >
        AM I A GUARD?
      </Animated.Text>

      <View style={styles.centerArea}>
        {/* Question mark */}
        <Animated.Text
          style={[
            styles.question,
            {
              fontFamily: fonts.display,
              color: textPrimary,
              opacity: questionOpacity,
              transform: [{ scale: questionScale }],
            },
          ]}
        >
          ?
        </Animated.Text>

        {/* Revealed card (crossfade) */}
        <Animated.View
          style={[
            styles.revealCard,
            {
              backgroundColor: surfaceColor,
              opacity: cardOpacity,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <Text style={[styles.revealName, { fontFamily: fonts.display, color: brand.primary }]}>
            MICHAEL JORDAN
          </Text>
        </Animated.View>
      </View>

      {/* YES / NO buttons */}
      <View style={styles.buttonRow}>
        <View style={styles.btnWrapper}>
          <Animated.View
            style={[
              styles.btnBg,
              {
                backgroundColor: colors.accentGreen,
                opacity: yesBgOpacity,
              },
            ]}
          />
          <Text style={[styles.btnText, { fontFamily: fonts.bodySemiBold, color: textPrimary }]}>
            YES
          </Text>
        </View>
        <View style={styles.btnWrapper}>
          <Animated.View
            style={[
              styles.btnBg,
              {
                backgroundColor: brand.primary,
                opacity: noBgOpacity,
              },
            ]}
          />
          <Text style={[styles.btnText, { fontFamily: fonts.bodySemiBold, color: textPrimary }]}>
            NO
          </Text>
        </View>
      </View>

      <Text style={[styles.label, { color: mutedColor, fontFamily: fonts.bodySemiBold }]}>
        WHO AM I
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerArea: {
    width: 60,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  question: {
    fontSize: 28,
    position: 'absolute',
  },
  revealCard: {
    position: 'absolute',
    width: 56,
    height: 36,
    borderRadius: 6,
  },
  revealName: {
    fontSize: 11,
    textAlign: 'center',
  },
  hintText: {
    fontSize: 7,
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  btnWrapper: {
    width: 40,
    height: 20,
    borderRadius: 4,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 4,
  },
  btnText: {
    fontSize: 8,
    letterSpacing: 1,
  },
  label: {
    fontSize: 8,
    letterSpacing: 1.5,
    marginTop: 8,
  },
});

export default WhoAmIPreview;
