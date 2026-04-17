import React, { useEffect, useRef, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Platform,
} from 'react-native';
import { brand, dark, light, fonts, colors, fontFamily } from '../../styles/theme';

const { width: W, height: H } = Dimensions.get('window');
const CX = W / 2;
const CY = H / 2;
const MAX_R = Math.sqrt(CX * CX + CY * CY);

const BRAND     = brand.primary;
const BRAND_MID = colors.brandMid;
const CYAN      = brand.teal;
const PINK      = '#e601c0';
const WHITE     = dark.textPrimary;

function seeded(seed: number, offset: number = 0): number {
  const x = Math.sin(seed * 127.1 + offset * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const PARTICLE_COLORS = [WHITE, WHITE, WHITE, BRAND, CYAN, PINK, BRAND_MID];

interface ParticleDef {
  angle:      number;
  speed:      number;
  size:       number;
  color:      string;
  delay:      number;
  maxOpacity: number;
}

const PARTICLES: ParticleDef[] = Array.from({ length: 55 }, (_, i) => ({
  angle:      seeded(i, 0) * Math.PI * 2,
  speed:      0.42 + seeded(i, 1) * 0.58,
  size:       3 + seeded(i, 2) * 7,
  color:      PARTICLE_COLORS[Math.floor(seeded(i, 3) * PARTICLE_COLORS.length)],
  delay:      seeded(i, 4) * 0.14,
  maxOpacity: 0.45 + seeded(i, 5) * 0.55,
}));

// Pre-compute final positions once at module level
const PARTICLE_FINALS = PARTICLES.map(p => ({
  x: Math.cos(p.angle) * p.speed * MAX_R * 0.92,
  y: Math.sin(p.angle) * p.speed * MAX_R * 0.92,
}));

const RINGS = [
  { color: BRAND, startAt: 0,    speedMult: 1.00 },
  { color: CYAN,  startAt: 0.06, speedMult: 0.82 },
  { color: PINK,  startAt: 0.12, speedMult: 0.66 },
];

const DURATION_MS = 2500;

interface ParticleAnims {
  pos:      Animated.Value;
  trailPos: Animated.Value;
  opacity:  Animated.Value;
}

// ── Memoized particle layer — never re-renders after initial mount ─────────────
const ParticlesLayer = memo(function ParticlesLayer({ anims }: { anims: ParticleAnims[] }) {
  return (
    <>
      {PARTICLES.map((p, i) => {
        const { x: finalX, y: finalY } = PARTICLE_FINALS[i];
        const { pos, trailPos, opacity } = anims[i];

        const translateX = pos.interpolate({ inputRange: [0, 1], outputRange: [0, finalX] });
        const translateY = pos.interpolate({ inputRange: [0, 1], outputRange: [0, finalY] });
        const trailTransX = trailPos.interpolate({ inputRange: [0, 1], outputRange: [0, finalX] });
        const trailTransY = trailPos.interpolate({ inputRange: [0, 1], outputRange: [0, finalY] });

        const trailSize = p.size * 0.45;
        const trailOpacity = opacity.interpolate({
          inputRange:  [0, p.maxOpacity],
          outputRange: [0, p.maxOpacity * 0.32],
        });

        return (
          <React.Fragment key={i}>
            <Animated.View
              style={{
                position:        'absolute',
                left:            CX - trailSize / 2,
                top:             CY - trailSize / 2,
                width:           trailSize,
                height:          trailSize,
                borderRadius:    trailSize / 2,
                backgroundColor: p.color,
                opacity:         trailOpacity,
                transform:       [{ translateX: trailTransX }, { translateY: trailTransY }],
              }}
            />
            <Animated.View
              style={{
                position:        'absolute',
                left:            CX - p.size / 2,
                top:             CY - p.size / 2,
                width:           p.size,
                height:          p.size,
                borderRadius:    p.size / 2,
                backgroundColor: p.color,
                opacity:         opacity,
                transform:       [{ translateX }, { translateY }],
              }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
});

// ── Memoized ring layer — all native-driven, zero JS re-renders ───────────────
const RingsLayer = memo(function RingsLayer({ anims }: { anims: { scale: Animated.Value; opacity: Animated.Value }[] }) {
  return (
    <>
      {RINGS.map((ring, i) => {
        const fullRadius = MAX_R * 1.1 * ring.speedMult;
        const fullDiam = fullRadius * 2;
        return (
          <Animated.View
            key={i}
            style={{
              position:     'absolute',
              left:         CX - fullRadius,
              top:          CY - fullRadius,
              width:        fullDiam,
              height:       fullDiam,
              borderRadius: fullRadius,
              borderWidth:  2,
              borderColor:  ring.color,
              opacity:      anims[i].opacity,
              transform:    [{ scale: anims[i].scale }],
            }}
          />
        );
      })}
    </>
  );
});

// ── Component ─────────────────────────────────────────────────────────────────
interface SplashProps {
  onFinish?: () => void;
}

export default function Splash({ onFinish }: SplashProps) {
  // Title (native driver — smooth spring + fade)
  const titleScale    = useRef(new Animated.Value(0)).current;
  const titleAlpha    = useRef(new Animated.Value(0)).current;
  const subtitleAlpha = useRef(new Animated.Value(0)).current;

  // Per-particle animated values — created once, never recreated
  const particleAnims = useRef<ParticleAnims[]>(
    PARTICLES.map(() => ({
      pos:      new Animated.Value(0),
      trailPos: new Animated.Value(0),
      opacity:  new Animated.Value(0),
    }))
  ).current;

  // Per-ring animated values — native-driven scale + opacity (no JS re-renders)
  const ringAnims = useRef(
    RINGS.map(() => ({
      scale:   new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  // Flash animated values — native-driven
  const flashScale   = useRef(new Animated.Value(0)).current;
  const flashOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ── Particles — native thread ─────────────────────────────────────────
    PARTICLES.forEach((p, i) => {
      const delayMs    = p.delay * DURATION_MS;
      const durationMs = DURATION_MS * (1 - p.delay);
      const { pos, trailPos, opacity } = particleAnims[i];

      Animated.timing(pos, {
        toValue: 1, delay: delayMs, duration: durationMs,
        easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }).start();

      Animated.timing(trailPos, {
        toValue: 1, delay: delayMs + 60, duration: durationMs,
        easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }).start();

      Animated.sequence([
        Animated.delay(delayMs),
        Animated.timing(opacity, {
          toValue: p.maxOpacity, duration: durationMs * 0.09,
          easing: Easing.linear, useNativeDriver: true,
        }),
        Animated.delay(durationMs * 0.71),
        Animated.timing(opacity, {
          toValue: 0, duration: durationMs * 0.20,
          easing: Easing.linear, useNativeDriver: true,
        }),
      ]).start();
    });

    // ── Rings — native thread (no RAF loop, no setProgress, no re-renders) ─
    RINGS.forEach((ring, i) => {
      const delayMs    = ring.startAt * DURATION_MS;
      const durationMs = DURATION_MS * (1 - ring.startAt);

      Animated.timing(ringAnims[i].scale, {
        toValue: 1, delay: delayMs, duration: durationMs,
        easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }).start();

      // Opacity: fade in 12% → hold → fade out 28%
      Animated.sequence([
        Animated.delay(delayMs),
        Animated.timing(ringAnims[i].opacity, {
          toValue: 0.75, duration: durationMs * 0.12,
          easing: Easing.linear, useNativeDriver: true,
        }),
        Animated.delay(durationMs * 0.60),
        Animated.timing(ringAnims[i].opacity, {
          toValue: 0, duration: durationMs * 0.28,
          easing: Easing.linear, useNativeDriver: true,
        }),
      ]).start();
    });

    // ── Flash — native thread ─────────────────────────────────────────────
    Animated.sequence([
      Animated.timing(flashScale, {
        toValue: 1, duration: DURATION_MS * 0.12,
        easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }),
      Animated.timing(flashOpacity, {
        toValue: 0, duration: DURATION_MS * 0.26,
        easing: Easing.linear, useNativeDriver: true,
      }),
    ]).start();
    flashOpacity.setValue(0.85);

    // ── Title — delayed native-thread animations (no RAF polling) ─────────
    const titleDelay    = DURATION_MS * 0.32; // 800ms
    const subtitleDelay = DURATION_MS * 0.55; // 1375ms

    setTimeout(() => {
      Animated.parallel([
        Animated.spring(titleScale, {
          toValue: 1, tension: 75, friction: 8, useNativeDriver: true,
        }),
        Animated.timing(titleAlpha, {
          toValue: 1, duration: 280, useNativeDriver: true,
        }),
      ]).start();
    }, titleDelay);

    setTimeout(() => {
      Animated.timing(subtitleAlpha, {
        toValue: 1, duration: 380, useNativeDriver: true,
      }).start();
    }, subtitleDelay);

    // ── Finish callback ───────────────────────────────────────────────────
    const finishTimer = setTimeout(() => onFinish?.(), DURATION_MS + 350);
    return () => clearTimeout(finishTimer);
  }, []);

  const FLASH_SIZE = 280;

  return (
    <View style={styles.container} pointerEvents="none">

      {/* Expanding rings — native thread, zero re-renders */}
      <RingsLayer anims={ringAnims} />

      {/* Particles — native thread, memoized */}
      <ParticlesLayer anims={particleAnims} />

      {/* Center white flash — native thread */}
      <Animated.View
        style={{
          position:        'absolute',
          left:            CX - FLASH_SIZE / 2,
          top:             CY - FLASH_SIZE / 2,
          width:           FLASH_SIZE,
          height:          FLASH_SIZE,
          borderRadius:    FLASH_SIZE / 2,
          backgroundColor: WHITE,
          opacity:         flashOpacity,
          transform:       [{ scale: flashScale }],
        }}
      />

      {/* Title — native thread */}
      <Animated.View
        style={[
          styles.titleWrap,
          { opacity: titleAlpha, transform: [{ scale: titleScale }] },
        ]}
      >
        <Text style={styles.titleLine}>BALL</Text>
        <Text style={styles.titleLine}>KNOWLEDGE</Text>
        <Animated.Text style={[styles.tagline, { opacity: subtitleAlpha }]}>
          KNOW THE GAME
        </Animated.Text>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:   1,
    height: Platform.OS === 'web' ? ('100vh' as any) : undefined,
    backgroundColor: 'transparent',
  },
  titleWrap: {
    position:       'absolute',
    left:           0,
    right:          0,
    top:            0,
    bottom:         0,
    alignItems:     'center',
    justifyContent: 'center',
  },
  titleLine: {
    fontFamily:       fonts.display,
    fontWeight:       '900',
    fontSize:         52,
    fontStyle:        'italic',
    letterSpacing:    5,
    color:            WHITE,
    textAlign:        'center',
    lineHeight:       60,
    textShadowColor:  BRAND,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  tagline: {
    fontFamily:    fonts.bodyMedium,
    fontSize:      15,
    letterSpacing: 8,
    color:         dark.textMuted,
    textAlign:     'center',
    marginTop:     18,
  },
});
