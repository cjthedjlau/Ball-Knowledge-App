import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import { brand, dark, light, fonts } from '../../../../styles/theme';

interface Props {
  isDark: boolean;
}

// Snake order: row0 L-R, row1 R-L, row2 L-R
// (col, row) => (0,0),(1,0),(2,0),(2,1),(1,1),(0,1),(0,2),(1,2),(2,2)
const SNAKE_ORDER = [
  [0, 0], [1, 0], [2, 0],
  [2, 1], [1, 1], [0, 1],
  [0, 2], [1, 2], [2, 2],
];

const COL_COLORS = [brand.primary, brand.teal, brand.light];
const CELL_SIZE = 28;
const CELL_HEIGHT = 20;
const GAP = 3;
const FILL_DELAY = 250;

const DraftPreview: React.FC<Props> = ({ isDark }) => {
  const cellOpacities = useRef(SNAKE_ORDER.map(() => new Animated.Value(0))).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const runLoop = () => {
      if (!mountedRef.current) return;

      // Reset all cells
      cellOpacities.forEach((op) => op.setValue(0));

      // Fill cells one at a time
      const fillNext = (index: number) => {
        if (!mountedRef.current) return;
        if (index >= SNAKE_ORDER.length) {
          // All filled, pause then restart
          timerRef.current = setTimeout(runLoop, 500);
          return;
        }
        Animated.timing(cellOpacities[index], {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          timerRef.current = setTimeout(() => fillNext(index + 1), FILL_DELAY);
        });
      };

      fillNext(0);
    };

    runLoop();

    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [cellOpacities]);

  const borderColor = isDark ? dark.cardBorder : light.cardBorder;
  const mutedColor = isDark ? dark.textMuted : light.textMuted;

  // Build grid
  const renderCell = (col: number, row: number) => {
    const snakeIndex = SNAKE_ORDER.findIndex(([c, r]) => c === col && r === row);
    const fillColor = COL_COLORS[col];

    return (
      <View
        key={`${col}-${row}`}
        style={[
          styles.cell,
          {
            borderColor: borderColor,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.cellFill,
            {
              backgroundColor: fillColor,
              opacity: cellOpacities[snakeIndex],
            },
          ]}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Column header dots */}
      <View style={styles.headerRow}>
        {COL_COLORS.map((color, i) => (
          <View key={i} style={[styles.headerDot, { backgroundColor: color }]} />
        ))}
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {[0, 1, 2].map((row) => (
          <View key={row} style={styles.gridRow}>
            {[0, 1, 2].map((col) => renderCell(col, row))}
          </View>
        ))}
      </View>

      <Text style={[styles.label, { color: mutedColor, fontFamily: fonts.bodySemiBold }]}>
        DRAFT
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
  headerRow: {
    flexDirection: 'row',
    gap: GAP + CELL_SIZE - 6,
    marginBottom: 4,
  },
  headerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  grid: {
    gap: GAP,
  },
  gridRow: {
    flexDirection: 'row',
    gap: GAP,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_HEIGHT,
    borderWidth: 1,
    borderRadius: 3,
    overflow: 'hidden',
  },
  cellFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 2,
  },
  label: {
    fontSize: 8,
    letterSpacing: 1.5,
    marginTop: 8,
  },
});

export default DraftPreview;
