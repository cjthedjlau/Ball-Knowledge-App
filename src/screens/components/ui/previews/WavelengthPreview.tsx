import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import { brand, dark, light, fonts } from '../../../../styles/theme';

interface Props {
  isDark: boolean;
}

const LOOP_DURATION = 3500;

const WavelengthPreview: React.FC<Props> = ({ isDark }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const run = () => {
      progress.setValue(0);
      animRef.current = Animated.loop(
        Animated.sequence([
          // 0-1500ms: needle sweeps from left to center
          Animated.timing(progress, {
            toValue: 0.43, // 1500/3500
            duration: 1500,
            useNativeDriver: true,
          }),
          // 1500-2000ms: target fades in, +3 pops
          Animated.timing(progress, {
            toValue: 0.57, // 2000/3500
            duration: 500,
            useNativeDriver: true,
          }),
          // 2000-3000ms: pause
          Animated.timing(progress, {
            toValue: 0.86, // 3000/3500
            duration: 1000,
            useNativeDriver: true,
          }),
          // 3000-3500ms: reset
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

  // Needle rotation: -80deg -> 0deg during 0-0.43, stays 0 until 0.86, then back to -80
  const needleRotate = progress.interpolate({
    inputRange: [0, 0.43, 0.86, 1],
    outputRange: ['-80deg', '0deg', '0deg', '-80deg'],
  });

  // Target zone opacity: 0 until 0.43, fades in by 0.57, stays until 0.86, fades out
  const targetOpacity = progress.interpolate({
    inputRange: [0, 0.42, 0.57, 0.86, 0.92, 1],
    outputRange: [0, 0, 0.6, 0.6, 0, 0],
  });

  // "+3" text and player name: appears at 0.57, visible until 0.86, fades out
  const scoreOpacity = progress.interpolate({
    inputRange: [0, 0.56, 0.57, 0.86, 0.92, 1],
    outputRange: [0, 0, 1, 1, 0, 0],
  });

  const scoreTranslateY = progress.interpolate({
    inputRange: [0, 0.56, 0.6, 1],
    outputRange: [8, 8, 0, 0],
  });

  const borderColor = isDark ? dark.cardBorder : light.cardBorder;
  const mutedColor = isDark ? dark.textMuted : light.textMuted;
  const needleColor = isDark ? dark.textPrimary : light.textPrimary;

  return (
    <View style={styles.container}>
      {/* Prompt label */}
      <Text style={[styles.promptLabel, { color: mutedColor, fontFamily: fonts.bodySemiBold }]}>
        CLUTCH ← → CHOKE
      </Text>

      <View style={styles.arcArea}>
        {/* Semicircle arc */}
        <View
          style={[
            styles.arc,
            {
              borderColor: borderColor,
              borderBottomWidth: 0,
            },
          ]}
        />

        {/* Target zone highlight */}
        <Animated.View
          style={[
            styles.targetZone,
            {
              backgroundColor: brand.primary,
              opacity: targetOpacity,
            },
          ]}
        />

        {/* Needle */}
        <Animated.View
          style={[
            styles.needleContainer,
            {
              transform: [{ rotate: needleRotate }],
            },
          ]}
        >
          <View style={[styles.needle, { backgroundColor: needleColor }]} />
        </Animated.View>

        {/* +3 score */}
        <Animated.Text
          style={[
            styles.score,
            {
              color: brand.primary,
              fontFamily: fonts.display,
              opacity: scoreOpacity,
              transform: [{ translateY: scoreTranslateY }],
            },
          ]}
        >
          +3
        </Animated.Text>
      </View>

      {/* Player name reveal */}
      <Animated.Text
        style={[
          styles.playerName,
          {
            color: brand.primary,
            fontFamily: fonts.display,
            opacity: scoreOpacity,
          },
        ]}
      >
        STEPH CURRY
      </Animated.Text>

      <Text style={[styles.label, { color: mutedColor, fontFamily: fonts.bodySemiBold }]}>
        WAVELENGTH
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
  arcArea: {
    width: 100,
    height: 60,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  arc: {
    position: 'absolute',
    top: 0,
    width: 100,
    height: 40,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderWidth: 2,
    borderBottomWidth: 0,
  },
  targetZone: {
    position: 'absolute',
    top: 4,
    width: 20,
    height: 14,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  needleContainer: {
    position: 'absolute',
    bottom: 0,
    width: 2,
    height: 30,
    transformOrigin: 'bottom',
  },
  needle: {
    width: 2,
    height: 30,
    borderRadius: 1,
  },
  score: {
    position: 'absolute',
    top: -4,
    fontSize: 12,
  },
  promptLabel: {
    fontSize: 7,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  playerName: {
    fontSize: 8,
    marginTop: 2,
  },
  label: {
    fontSize: 8,
    letterSpacing: 1.5,
    marginTop: 4,
  },
});

export default WavelengthPreview;
