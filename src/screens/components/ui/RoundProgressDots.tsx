import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

interface RoundProgressDotsProps {
  total: number;
  current: number;
}

export default function RoundProgressDots({ total, current }: RoundProgressDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }, (_, i) => {
        const index = i + 1;
        const isCurrent = index === current;
        const isUpcoming = index > current;

        return (
          <View
            key={i}
            style={[
              styles.dot,
              isCurrent && styles.dotCurrent,
              isUpcoming && styles.dotUpcoming,
            ]}
          />
        );
      })}
    </View>
  );
}

const DOT_SIZE = 10;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.white,
  },
  dotCurrent: {
    width: DOT_SIZE * 1.3,
    height: DOT_SIZE * 1.3,
    borderRadius: (DOT_SIZE * 1.3) / 2,
    shadowColor: colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },
  dotUpcoming: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
});
