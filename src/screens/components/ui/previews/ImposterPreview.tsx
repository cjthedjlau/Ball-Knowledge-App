import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import { brand, dark, light, fonts, colors } from '../../../../styles/theme';

interface Props {
  isDark: boolean;
}

type CardState = '?' | 'CREWMATE' | 'IMPOSTOR';

const LOOP_DURATION = 3200;

const ImposterPreview: React.FC<Props> = ({ isDark }) => {
  const scaleX = useRef(new Animated.Value(1)).current;
  const [cardState, setCardState] = useState<CardState>('?');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const flipTo = useCallback(
    (nextState: CardState, onDone?: () => void) => {
      // Scale down to 0
      Animated.timing(scaleX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        if (!mountedRef.current) return;
        setCardState(nextState);
        // Scale back up
        Animated.timing(scaleX, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          if (mountedRef.current) onDone?.();
        });
      });
    },
    [scaleX],
  );

  useEffect(() => {
    mountedRef.current = true;

    const runLoop = () => {
      if (!mountedRef.current) return;
      setCardState('?');
      scaleX.setValue(1);

      // 500ms: flip to CREWMATE
      timerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        flipTo('CREWMATE', () => {
          // 1500ms: flip to IMPOSTOR
          timerRef.current = setTimeout(() => {
            if (!mountedRef.current) return;
            flipTo('IMPOSTOR', () => {
              // 2500ms: flip back to ?
              timerRef.current = setTimeout(() => {
                if (!mountedRef.current) return;
                flipTo('?', () => {
                  // pause then restart
                  timerRef.current = setTimeout(runLoop, 400);
                });
              }, 600);
            });
          }, 600);
        });
      }, 500);
    };

    runLoop();

    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [flipTo, scaleX]);

  const getTextColor = () => {
    if (cardState === 'CREWMATE') return colors.accentGreen;
    if (cardState === 'IMPOSTOR') return brand.primary;
    return isDark ? dark.textPrimary : light.textPrimary;
  };

  const cardBg = isDark ? dark.surface : light.surface;
  const mutedColor = isDark ? dark.textMuted : light.textMuted;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            transform: [{ scaleX }],
          },
        ]}
      >
        <Text
          style={[
            styles.cardText,
            {
              fontFamily: fonts.display,
              color: getTextColor(),
            },
          ]}
        >
          {cardState}
        </Text>
      </Animated.View>

      <Text style={[styles.label, { color: mutedColor, fontFamily: fonts.bodySemiBold }]}>
        IMPOSTER
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
  card: {
    width: '80%',
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 12,
    letterSpacing: 2,
  },
  label: {
    fontSize: 8,
    letterSpacing: 1.5,
    marginTop: 8,
  },
});

export default ImposterPreview;
