import React from 'react';
import { View, StyleSheet } from 'react-native';
import { brand, dark, light } from '../../../styles/theme';
import { useTheme } from '../../../hooks/useTheme';

interface RoundProgressDotsProps {
  total: number;
  current: number;
}

export default function RoundProgressDots({ total, current }: RoundProgressDotsProps) {
  const { isDark } = useTheme();

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
              { backgroundColor: brand.primary },
              isCurrent && styles.dotCurrent,
              isUpcoming && {
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.15)'
                  : 'rgba(0,0,0,0.12)',
              },
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
  },
  dotCurrent: {
    width: DOT_SIZE * 1.3,
    height: DOT_SIZE * 1.3,
    borderRadius: (DOT_SIZE * 1.3) / 2,
    shadowColor: brand.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },
});
