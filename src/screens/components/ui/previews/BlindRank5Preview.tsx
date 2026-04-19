import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { brand, dark, light, fonts } from '../../../../styles/theme';

interface Props {
  isDark: boolean;
}

const SLOT_COUNT = 5;
const SLOT_HEIGHT = 24;
const DROP_ORDER = [2, 0, 4, 1, 3]; // slots filled in this order (0-indexed)
const CARD_INITIALS = ['LBJ', 'SC', 'MJ', 'KI', 'KD']; // indexed by drop step order
const DROP_INTERVAL = 600;
const DROP_DURATION = 400;
const PAUSE_AFTER = 500;

const BlindRank5Preview: React.FC<Props> = ({ isDark }) => {
  const translateXRefs = useRef(DROP_ORDER.map(() => new Animated.Value(80)));
  const opacityRefs = useRef(DROP_ORDER.map(() => new Animated.Value(0)));
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mountedRef = useRef(true);

  const borderColor = isDark ? dark.cardBorder : light.cardBorder;
  const textColor = isDark ? dark.textMuted : light.textMuted;
  const cardTextColor = isDark ? dark.textPrimary : light.textPrimary;
  const cardBg = isDark ? dark.card : light.card;

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
    translateXRefs.current.forEach((a) => a.setValue(80));
    opacityRefs.current.forEach((a) => a.setValue(0));
  }, []);

  const runSequence = useCallback(() => {
    clearTimers();
    resetAll();

    DROP_ORDER.forEach((_, i) => {
      addTimer(() => {
        Animated.parallel([
          Animated.timing(translateXRefs.current[i], {
            toValue: 0,
            duration: DROP_DURATION,
            useNativeDriver: true,
          }),
          Animated.timing(opacityRefs.current[i], {
            toValue: 1,
            duration: DROP_DURATION,
            useNativeDriver: true,
          }),
        ]).start();
      }, i * DROP_INTERVAL);
    });

    const totalDuration =
      (DROP_ORDER.length - 1) * DROP_INTERVAL + DROP_DURATION + 800 + PAUSE_AFTER;
    addTimer(() => runSequence(), totalDuration);
  }, [clearTimers, resetAll, addTimer]);

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
      <Text style={[styles.header, { color: textColor, fontFamily: fonts.bodySemiBold }]}>
        RANK THESE PLAYERS
      </Text>
      {Array.from({ length: SLOT_COUNT }, (_, slotIndex) => {
        // Find which drop step fills this slot
        const dropStep = DROP_ORDER.indexOf(slotIndex);

        return (
          <View
            key={slotIndex}
            style={[styles.slot, { borderColor }]}
          >
            <Text style={[styles.slotLabel, { color: textColor, fontFamily: fonts.display }]}>
              {slotIndex + 1}
            </Text>

            <Animated.View
              style={[
                styles.card,
                {
                  backgroundColor: cardBg,
                  borderLeftColor: brand.primary,
                  opacity: opacityRefs.current[dropStep],
                  transform: [{ translateX: translateXRefs.current[dropStep] }],
                },
              ]}
            >
              <Text style={[styles.cardInitials, { color: cardTextColor, fontFamily: fonts.display }]}>
                {CARD_INITIALS[dropStep]}
              </Text>
            </Animated.View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
    gap: 4,
  },
  header: {
    fontSize: 6,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 2,
  },
  slot: {
    height: SLOT_HEIGHT,
    borderWidth: 1,
    borderRadius: 4,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  slotLabel: {
    fontSize: 10,
    width: 16,
    textAlign: 'center',
  },
  card: {
    flex: 1,
    height: '100%',
    borderLeftWidth: 3,
    borderRadius: 2,
    justifyContent: 'center',
    paddingLeft: 4,
  },
  cardInitials: {
    fontSize: 9,
  },
});

export default BlindRank5Preview;
