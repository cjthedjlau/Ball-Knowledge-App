import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { brand, dark, light, fonts } from '../../../../styles/theme';

interface Props {
  isDark: boolean;
}

const ROWS = 3;
const COLS = 6;
const TILE_SIZE = 16;
const TILE_GAP = 2;
const FLIP_DURATION = 150;
const ROW_DELAY = 1200;
const PAUSE_BEFORE_RESET = 500;

// Color patterns per row: 'gray' | 'teal' | 'green'
const ROW_PATTERNS: Array<Array<'gray' | 'teal' | 'green'>> = [
  ['gray', 'teal', 'gray', 'green', 'gray', 'teal'],
  ['gray', 'gray', 'green', 'green', 'teal', 'gray'],
  ['green', 'green', 'green', 'green', 'green', 'green'],
];

const COLUMN_HEADERS = ['TEAM', 'POS', 'AGE', 'HT', 'COL', 'YRS'];

const MysteryPlayerPreview: React.FC<Props> = ({ isDark }) => {
  const opacityRefs = useRef<Animated.Value[][]>(
    Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => new Animated.Value(1))
    )
  );

  const [revealedColors, setRevealedColors] = useState<(string | null)[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  );

  const solveOpacity = useRef(new Animated.Value(0));

  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mountedRef = useRef(true);

  const defaultBg = isDark ? dark.card : light.card;
  const mutedColor = isDark ? dark.textMuted : light.textMuted;
  const textColor = isDark ? dark.textPrimary : light.textPrimary;

  const getColor = useCallback(
    (type: 'gray' | 'teal' | 'green') => {
      switch (type) {
        case 'gray':
          return isDark ? dark.surface : light.surface;
        case 'teal':
          return brand.teal;
        case 'green':
          return brand.primary;
      }
    },
    [isDark]
  );

  const clearTimers = useCallback(() => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, delay: number) => {
    const t = setTimeout(() => {
      if (mountedRef.current) fn();
    }, delay);
    timerRefs.current.push(t);
  }, []);

  const resetAll = useCallback(() => {
    setRevealedColors(
      Array.from({ length: ROWS }, () => Array(COLS).fill(null))
    );
    opacityRefs.current.forEach((row) =>
      row.forEach((anim) => anim.setValue(1))
    );
    solveOpacity.current.setValue(0);
  }, []);

  const flipTile = useCallback(
    (row: number, col: number, color: string, onDone?: () => void) => {
      const anim = opacityRefs.current[row][col];
      Animated.timing(anim, {
        toValue: 0,
        duration: FLIP_DURATION / 2,
        useNativeDriver: true,
      }).start(() => {
        if (!mountedRef.current) return;
        setRevealedColors((prev) => {
          const next = prev.map((r) => [...r]);
          next[row][col] = color;
          return next;
        });
        Animated.timing(anim, {
          toValue: 1,
          duration: FLIP_DURATION / 2,
          useNativeDriver: true,
        }).start(() => {
          if (onDone && mountedRef.current) onDone();
        });
      });
    },
    []
  );

  const runSequence = useCallback(() => {
    clearTimers();
    resetAll();

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const delay = row * ROW_DELAY + col * FLIP_DURATION;
        const color = getColor(ROW_PATTERNS[row][col]);
        addTimer(() => flipTile(row, col, color), delay);
      }
    }

    // After all rows revealed, fade in the solve name
    const solveDelay = (ROWS - 1) * ROW_DELAY + (COLS - 1) * FLIP_DURATION + FLIP_DURATION + 300;
    addTimer(() => {
      Animated.timing(solveOpacity.current, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, solveDelay);

    const totalDuration =
      (ROWS - 1) * ROW_DELAY + (COLS - 1) * FLIP_DURATION + FLIP_DURATION + 800 + PAUSE_BEFORE_RESET;
    addTimer(() => runSequence(), totalDuration);
  }, [clearTimers, resetAll, getColor, addTimer, flipTile]);

  useEffect(() => {
    mountedRef.current = true;
    runSequence();
    return () => {
      mountedRef.current = false;
      clearTimers();
    };
  }, [runSequence, clearTimers]);

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          { fontFamily: fonts.bodySemiBold, color: mutedColor },
        ]}
      >
        MYSTERY PLAYER
      </Text>
      {/* Column headers */}
      <View style={styles.headerRow}>
        {COLUMN_HEADERS.map((header) => (
          <Text
            key={header}
            style={[
              styles.colHeader,
              { fontFamily: fonts.bodySemiBold, color: mutedColor },
            ]}
          >
            {header}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {opacityRefs.current.map((row, ri) => (
          <View key={ri} style={styles.row}>
            {row.map((anim, ci) => (
              <Animated.View
                key={ci}
                style={[
                  styles.tile,
                  {
                    backgroundColor: revealedColors[ri][ci] ?? defaultBg,
                    opacity: anim,
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
      {/* Solve name */}
      <Animated.Text
        style={[
          styles.solveName,
          {
            fontFamily: fonts.display,
            color: textColor,
            opacity: solveOpacity.current,
          },
        ]}
      >
        LEBRON JAMES
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 8,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  headerRow: {
    flexDirection: 'row',
    gap: TILE_GAP,
    marginBottom: 2,
  },
  colHeader: {
    width: TILE_SIZE,
    fontSize: 6,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  grid: {
    gap: TILE_GAP,
  },
  row: {
    flexDirection: 'row',
    gap: TILE_GAP,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 2,
  },
  solveName: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});

export default MysteryPlayerPreview;
