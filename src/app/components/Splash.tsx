import React, { useEffect, useRef, useState, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Platform,
} from 'react-native';
import { fontFamily } from '../../styles/theme';

const { width: W, height: H } = Dimensions.get('window');
const CX = W / 2;
const CY = H / 2;
const MAX_R = Math.sqrt(CX * CX + CY * CY);

const BRAND     = '#FC345C';
const BRAND_MID = '#FD8FAA';
const CYAN      = '#07bccc';
const PINK      = '#e601c0';
const WHITE     = '#FFFFFF';

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

function easeOutCubic(t: number): number {
  const c = Math.min(Math.max(t, 0), 1);
  return 1 - Math.pow(1 - c, 3);
}

const DURATION_MS = 2500;

interface ParticleAnims {
  pos:      Animated.Value;
  trailPos: Animated.Value;
  opacity:  Animated.Value;
}

// ── Memoized particle layer — never re-renders after initial mount ─────────────
// Particles run on the native/UI thread via useNativeDriver, completely
// decoupled from the JS-thread progress loop that drives rings + flash.
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
        // Trail opacity is 32% of main opacity — interpolate to scale it
        const trailOpacity = opacity.interpolate({
          inputRange:  [0, p.maxOpacity],
          outputRange: [0, p.maxOpacity * 0.32],
        });

        return (
          <React.Fragment key={i}>
            {/* Trail dot */}
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
            {/* Main dot */}
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

// ── Component ─────────────────────────────────────────────────────────────────
interface SplashProps {
  onFinish?: () => void;
}

export default function Splash({ onFinish }: SplashProps) {
  // JS-thread progress: drives only the 3 rings + 1 flash (4 views total)
  const [progress, setProgress] = useState(0);

  // Title (native driver — smooth spring + fade)
  const titleScale    = useRef(new Animated.Value(0)).current;
  const titleAlpha    = useRef(new Animated.Value(0)).current;
  const subtitleAlpha = useRef(new Animated.Value(0)).current;

  const titleStarted    = useRef(false);
  const subtitleStarted = useRef(false);
  const finishFired     = useRef(false);

  // Per-particle animated values — created once, never recreated
  const particleAnims = useRef<ParticleAnims[]>(
    PARTICLES.map(() => ({
      pos:      new Animated.Value(0),
      trailPos: new Animated.Value(0),
      opacity:  new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    // ── Launch all particle animations on native thread ────────────────────
    PARTICLES.forEach((p, i) => {
      const delayMs    = p.delay * DURATION_MS;
      const durationMs = DURATION_MS * (1 - p.delay);
      const { pos, trailPos, opacity } = particleAnims[i];

      // Position: easeOutCubic burst from center
      Animated.timing(pos, {
        toValue:         1,
        delay:           delayMs,
        duration:        durationMs,
        easing:          Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();

      // Trail: same curve but 60ms lag behind main dot
      Animated.timing(trailPos, {
        toValue:         1,
        delay:           delayMs + 60,
        duration:        durationMs,
        easing:          Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();

      // Opacity: fade in (9%) → hold (71%) → fade out (20%)
      Animated.sequence([
        Animated.delay(delayMs),
        Animated.timing(opacity, {
          toValue:         p.maxOpacity,
          duration:        durationMs * 0.09,
          easing:          Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(durationMs * 0.71),
        Animated.timing(opacity, {
          toValue:         0,
          duration:        durationMs * 0.20,
          easing:          Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    });

    // ── RAF loop: drives rings + flash (JS-thread, only 4 views) ──────────
    const startTime = Date.now();
    let raf: number;

    const loop = () => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / DURATION_MS, 1);
      setProgress(p);

      if (p >= 0.32 && !titleStarted.current) {
        titleStarted.current = true;
        Animated.parallel([
          Animated.spring(titleScale, {
            toValue:         1,
            tension:         75,
            friction:        8,
            useNativeDriver: true,
          }),
          Animated.timing(titleAlpha, {
            toValue:         1,
            duration:        280,
            useNativeDriver: true,
          }),
        ]).start();
      }

      if (p >= 0.55 && !subtitleStarted.current) {
        subtitleStarted.current = true;
        Animated.timing(subtitleAlpha, {
          toValue:         1,
          duration:        380,
          useNativeDriver: true,
        }).start();
      }

      if (p >= 1 && !finishFired.current) {
        finishFired.current = true;
        setTimeout(() => onFinish?.(), 350);
        return; // stop loop
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">

      {/* Expanding rings — JS-thread, only 3 views, fast to compute */}
      {RINGS.map((ring, i) => {
        const localP  = Math.max(0, (progress - ring.startAt) / (1 - ring.startAt));
        const easedP  = easeOutCubic(localP);
        const radius  = easedP * MAX_R * 1.1 * ring.speedMult;
        const borderW = Math.max(1, 5 - easedP * 4);
        const alpha   =
          localP < 0.12 ? (localP / 0.12) * 0.75
          : localP > 0.72 ? ((1 - localP) / 0.28) * 0.75
          : 0.75;

        if (radius < 1) return null;

        return (
          <View
            key={i}
            style={{
              position:     'absolute',
              left:         CX - radius,
              top:          CY - radius,
              width:        radius * 2,
              height:       radius * 2,
              borderRadius: radius,
              borderWidth:  borderW,
              borderColor:  ring.color,
              opacity:      alpha,
            }}
          />
        );
      })}

      {/* Particles — native thread, memoized, zero re-renders */}
      <ParticlesLayer anims={particleAnims} />

      {/* Center white flash — JS-thread, 1 view, exits early */}
      {progress < 0.38 && (() => {
        const fp  = Math.min(progress / 0.12, 1);
        const fp2 = Math.max(0, (progress - 0.12) / 0.26);
        const size  = easeOutCubic(fp) * 280;
        const alpha = fp < 1 ? fp * 0.85 : Math.max(0, (1 - fp2) * 0.85);
        if (size < 1 || alpha <= 0) return null;
        return (
          <View
            style={{
              position:        'absolute',
              left:            CX - size / 2,
              top:             CY - size / 2,
              width:           size,
              height:          size,
              borderRadius:    size / 2,
              backgroundColor: WHITE,
              opacity:         alpha,
            }}
          />
        );
      })()}

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
    fontFamily:       fontFamily.black,
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
    fontFamily:    fontFamily.medium,
    fontSize:      15,
    letterSpacing: 8,
    color:         'rgba(255,255,255,0.40)',
    textAlign:     'center',
    marginTop:     18,
  },
});
