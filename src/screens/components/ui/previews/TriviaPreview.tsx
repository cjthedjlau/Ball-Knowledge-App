import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { brand, dark, light, fonts, colors } from '../../../../styles/theme';

interface Props {
  isDark: boolean;
}

const TIERS = [
  { label: '100%', xp: '+50', color: '#22C55E' },
  { label: '75%',  xp: '+100', color: '#22C55E' },
  { label: '50%',  xp: '+200', color: '#F59E0B' },
  { label: '25%',  xp: '+400', color: '#EF4444' },
  { label: '1%',   xp: '+800', color: '#EF4444' },
];

const TriviaPreview: React.FC<Props> = ({ isDark }) => {
  const stepOpacity = useRef(TIERS.map(() => new Animated.Value(0.15)));
  const checkOpacity = useRef(TIERS.map(() => new Animated.Value(0)));
  const xpOpacity = useRef(TIERS.map(() => new Animated.Value(0)));
  const glowScale = useRef(TIERS.map(() => new Animated.Value(1)));
  const bonusOpacity = useRef(new Animated.Value(0));
  const bonusScale = useRef(new Animated.Value(0.5));
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mountedRef = useRef(true);

  const cardBg = isDark ? dark.card : light.card;
  const surfaceBg = isDark ? dark.surface : light.surface;
  const textColor = isDark ? dark.textPrimary : light.textPrimary;
  const mutedColor = isDark ? dark.textMuted : light.textMuted;

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
    TIERS.forEach((_, i) => {
      stepOpacity.current[i].setValue(0.15);
      checkOpacity.current[i].setValue(0);
      xpOpacity.current[i].setValue(0);
      glowScale.current[i].setValue(1);
    });
    bonusOpacity.current.setValue(0);
    bonusScale.current.setValue(0.5);
  }, []);

  const runSequence = useCallback(() => {
    clearTimers();
    resetAll();

    // Climb the ladder: light up each step sequentially
    TIERS.forEach((_, i) => {
      const baseDelay = 500 + i * 600;

      // Step lights up (becomes active)
      addTimer(() => {
        Animated.timing(stepOpacity.current[i], {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
        Animated.spring(glowScale.current[i], {
          toValue: 1.03,
          friction: 6,
          useNativeDriver: true,
        }).start();
      }, baseDelay);

      // Checkmark appears + XP floats in
      addTimer(() => {
        Animated.parallel([
          Animated.timing(checkOpacity.current[i], {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(xpOpacity.current[i], {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(glowScale.current[i], {
            toValue: 1,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();
      }, baseDelay + 250);
    });

    // Perfect bonus after all 5
    addTimer(() => {
      Animated.parallel([
        Animated.spring(bonusScale.current, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(bonusOpacity.current, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500 + 5 * 600 + 200);

    // Reset and restart
    addTimer(() => runSequence(), 500 + 5 * 600 + 1200);
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
      {/* Ladder steps — bottom to top (reversed render order) */}
      {[...TIERS].reverse().map((tier, ri) => {
        const i = TIERS.length - 1 - ri; // actual index
        return (
          <Animated.View
            key={tier.label}
            style={[
              styles.step,
              {
                backgroundColor: cardBg,
                borderColor: isDark ? dark.cardBorder : light.cardBorder,
                opacity: stepOpacity.current[i],
                transform: [{ scale: glowScale.current[i] }],
              },
            ]}
          >
            {/* Left: tier badge */}
            <View style={[styles.tierBadge, { backgroundColor: tier.color + '22' }]}>
              <Text style={[styles.tierText, { color: tier.color, fontFamily: fonts.bodyBold }]}>
                {tier.label}
              </Text>
            </View>

            {/* Center: rung line */}
            <View style={[styles.rung, { backgroundColor: tier.color + '33' }]} />

            {/* Right: XP value */}
            <Animated.Text
              style={[
                styles.xpText,
                {
                  color: tier.color,
                  fontFamily: fonts.bodySemiBold,
                  opacity: xpOpacity.current[i],
                },
              ]}
            >
              {tier.xp}
            </Animated.Text>

            {/* Checkmark */}
            <Animated.View
              style={[
                styles.checkCircle,
                {
                  backgroundColor: tier.color,
                  opacity: checkOpacity.current[i],
                },
              ]}
            >
              <Text style={styles.checkMark}>✓</Text>
            </Animated.View>
          </Animated.View>
        );
      })}

      {/* Perfect bonus */}
      <Animated.View
        style={[
          styles.bonusBar,
          {
            backgroundColor: brand.primary + '18',
            opacity: bonusOpacity.current,
            transform: [{ scale: bonusScale.current }],
          },
        ]}
      >
        <Text style={[styles.bonusText, { color: brand.primary, fontFamily: fonts.bodyBold }]}>
          PERFECT +500
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 6,
    gap: 3,
    paddingVertical: 4,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 16,
    borderRadius: 3,
    borderWidth: 0.5,
    paddingHorizontal: 4,
    gap: 3,
  },
  tierBadge: {
    borderRadius: 2,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  tierText: {
    fontSize: 6,
    lineHeight: 8,
  },
  rung: {
    flex: 1,
    height: 1.5,
    borderRadius: 1,
  },
  xpText: {
    fontSize: 6,
    lineHeight: 8,
  },
  checkCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontSize: 5,
    color: '#fff',
    lineHeight: 7,
    marginTop: -0.5,
  },
  bonusBar: {
    height: 14,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: brand.primary + '33',
  },
  bonusText: {
    fontSize: 6,
    letterSpacing: 0.5,
  },
});

export default TriviaPreview;
