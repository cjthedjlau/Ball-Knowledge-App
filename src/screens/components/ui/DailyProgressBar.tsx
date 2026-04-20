import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';
import { brand, dark, light, fonts } from '../../../styles/theme';
import { useTheme } from '../../../hooks/useTheme';

interface DailyProgressBarProps {
  completed: number;
  total?: number;
}

export default function DailyProgressBar({
  completed,
  total = 4,
}: DailyProgressBarProps) {
  const { isDark } = useTheme();
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
        <Text
          style={[
            styles.title,
            { color: '#FFFFFF' },
          ]}
        >
          Daily Games
        </Text>
        <Text
          style={[
            styles.status,
            { color: 'rgba(255,255,255,0.7)' },
          ]}
        >
          {completed} of {total} Complete
        </Text>
      </View>
      <View
        style={[
          styles.track,
          {
            backgroundColor: 'rgba(255,255,255,0.2)',
          },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              width: fillWidth,
              backgroundColor: '#FFFFFF',
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
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },
  status: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 15,
  },
  track: {
    width: '100%',
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: 3,
    borderRadius: 2,
  },
});
