import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';
import { colors, fontFamily } from '../../../styles/theme';

interface DailyProgressBarProps {
  completed: number;
  total?: number;
}

export default function DailyProgressBar({
  completed,
  total = 4,
}: DailyProgressBarProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const fraction = total > 0 ? completed / total : 0;

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: fraction,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [completed, total]);

  const fillWidth = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.title}>Daily Games</Text>
        <Text style={styles.status}>{completed} of {total} Complete</Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: fillWidth,
              backgroundColor: colors.white,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
    color: colors.white,
  },
  status: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 15,
    color: 'rgba(255,255,255,0.70)',
  },
  track: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.20)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: 8,
    borderRadius: 999,
  },
});
