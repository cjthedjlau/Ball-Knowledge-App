import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';

// Block render until Inter is ready
const { fontFamily: inter } = loadFont('normal', {
  weights: ['400', '600', '700', '900'],
  subsets: ['latin'],
});

// ── BK Design Tokens (inline — no RN imports in Remotion) ─────────────────────
const BRAND       = '#FC345C';
const BRAND_MID   = '#FD8FAA';
const WHITE       = '#FFFFFF';
const DARK_BG     = '#0F0F0F';
const DARK_SURF   = '#1E1E1E';
const DARK_ELEV   = '#2A2A2A';
const SUCCESS     = '#00C897';
const CHARCOAL    = '#1A1A2E';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

// ── Sample data ───────────────────────────────────────────────────────────────
const QUESTION = 'Name an NBA Most Valuable Player from the last 5 years';

const ANSWERS = [
  { text: 'Nikola Jokić',           points: 38 },
  { text: 'Giannis Antetokounmpo',  points: 31 },
  { text: 'LeBron James',           points: 16 },
  { text: 'Joel Embiid',            points: 10 },
  { text: 'Luka Dončić',            points: 5  },
];

// ── Scene 1 — Brand Burst (frames 0-80) ───────────────────────────────────────
function BrandBurst() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background circle pulse then vanish
  const circleSp   = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 28 });
  const circleSize = interpolate(circleSp, [0, 1], [0, 14]);
  const circleAlpha = interpolate(frame, [28, 48], [1, 0], clamp);

  // Zap icon springs in
  const zapSp    = spring({ frame: frame - 8, fps, config: { damping: 12, stiffness: 220 } });
  const zapScale = interpolate(zapSp, [0, 1], [0, 1]);

  // Title springs up from below
  const titleSp = spring({ frame: frame - 18, fps, config: { damping: 16, stiffness: 170 } });
  const titleY  = interpolate(titleSp, [0, 1], [110, 0]);
  const titleAlpha = interpolate(frame, [18, 36], [0, 1], clamp);

  // Tagline fades in
  const tagAlpha = interpolate(frame, [50, 68], [0, 1], clamp);
  const tagY     = interpolate(frame, [50, 68], [24, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Brand burst circle */}
      <div
        style={{
          position: 'absolute',
          width: 120,
          height: 120,
          borderRadius: '50%',
          backgroundColor: BRAND,
          transform: `scale(${circleSize})`,
          opacity: interpolate(circleSp, [0, 0.15, 1], [0, 0.95, circleAlpha]),
        }}
      />

      {/* Zap icon */}
      <div
        style={{
          fontSize: 140,
          transform: `scale(${zapScale})`,
          filter: 'drop-shadow(0 0 50px rgba(252,52,92,0.85))',
          marginBottom: 20,
          zIndex: 2,
          lineHeight: 1,
        }}
      >
        ⚡
      </div>

      {/* POWER PLAY title */}
      <div
        style={{
          fontFamily: inter,
          fontSize: 92,
          fontWeight: '900',
          color: WHITE,
          letterSpacing: 10,
          textAlign: 'center',
          transform: `translateY(${titleY}px)`,
          opacity: titleAlpha,
          zIndex: 2,
        }}
      >
        POWER PLAY
      </div>

      {/* Tagline */}
      <div
        style={{
          fontFamily: inter,
          fontSize: 30,
          fontWeight: '400',
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: 5,
          marginTop: 28,
          textAlign: 'center',
          transform: `translateY(${tagY}px)`,
          opacity: tagAlpha,
          zIndex: 2,
        }}
      >
        45 SECONDS · 5 QUESTIONS · NO MERCY
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 2 — Game Mockup (frames 70-220) ─────────────────────────────────────
function GameMockup() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card slides up from bottom
  const cardSp = spring({ frame, fps, config: { damping: 22, stiffness: 180 } });
  const cardY  = interpolate(cardSp, [0, 1], [260, 0]);

  // Typewriter: question chars, starts at local frame 18
  const charCount = Math.floor(
    interpolate(frame, [18, 58], [0, QUESTION.length], clamp),
  );
  const visibleQ = QUESTION.slice(0, charCount);
  const showCursor = charCount < QUESTION.length && frame % 16 < 9;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 72px',
      }}
    >
      <div style={{ width: '100%', transform: `translateY(${cardY}px)` }}>
        {/* League + game label row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <div
            style={{
              backgroundColor: BRAND,
              borderRadius: 10,
              padding: '8px 22px',
              fontFamily: inter,
              fontSize: 26,
              fontWeight: '700',
              color: WHITE,
              letterSpacing: 3,
            }}
          >
            NBA
          </div>
          <div
            style={{
              fontFamily: inter,
              fontSize: 26,
              fontWeight: '600',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: 2,
            }}
          >
            POWER PLAY
          </div>

          {/* Timer pill */}
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: 'rgba(252,52,92,0.15)',
              border: `1.5px solid ${BRAND}`,
              borderRadius: 50,
              padding: '8px 20px',
            }}
          >
            <div style={{ fontSize: 28 }}>⚡</div>
            <div
              style={{
                fontFamily: inter,
                fontSize: 28,
                fontWeight: '700',
                color: BRAND,
              }}
            >
              45s
            </div>
          </div>
        </div>

        {/* Question card */}
        <div
          style={{
            backgroundColor: DARK_SURF,
            borderRadius: 22,
            padding: '44px 48px',
            marginBottom: 28,
            border: `1.5px solid rgba(252,52,92,0.25)`,
          }}
        >
          <div
            style={{
              fontFamily: inter,
              fontSize: 18,
              fontWeight: '700',
              color: BRAND,
              letterSpacing: 4,
              marginBottom: 18,
            }}
          >
            QUESTION 2 OF 5
          </div>
          <div
            style={{
              fontFamily: inter,
              fontSize: 44,
              fontWeight: '700',
              color: WHITE,
              lineHeight: '1.35',
              minHeight: 120,
            }}
          >
            {visibleQ}
            {showCursor && (
              <span style={{ color: BRAND }}>|</span>
            )}
          </div>
        </div>

        {/* Answer rows — stagger every 14 frames starting at frame 65 */}
        {ANSWERS.map((answer, i) => {
          const start  = 65 + i * 14;
          const aSp    = spring({ frame: frame - start, fps, config: { damping: 20, stiffness: 200 } });
          const aOpacity = interpolate(frame, [start, start + 10], [0, 1], clamp);
          const aX     = interpolate(aSp, [0, 1], [-70, 0]);
          const ptColor =
            answer.points >= 30 ? BRAND :
            answer.points >= 15 ? BRAND_MID :
            'rgba(255,255,255,0.5)';

          return (
            <div
              key={answer.text}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: DARK_ELEV,
                borderRadius: 16,
                padding: '24px 32px',
                marginBottom: 14,
                opacity: aOpacity,
                transform: `translateX(${aX}px)`,
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div
                style={{
                  fontFamily: inter,
                  fontSize: 34,
                  fontWeight: '600',
                  color: WHITE,
                  flex: 1,
                }}
              >
                {answer.text}
              </div>
              <div style={{ fontFamily: inter, fontSize: 38, fontWeight: '900', color: ptColor }}>
                {answer.points}
              </div>
              <div
                style={{
                  fontFamily: inter,
                  fontSize: 20,
                  color: 'rgba(255,255,255,0.35)',
                  marginLeft: 8,
                }}
              >
                pts
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 3 — Timer Urgency (frames 205-270) ──────────────────────────────────
function UrgencyScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const timerPct  = interpolate(frame, [0, 60], [1, 0.06], clamp);
  const timeLeft  = Math.round(interpolate(frame, [0, 60], [45, 5], clamp));
  const pulse     = interpolate(frame % 16, [0, 8, 16], [0.55, 1, 0.55]);
  const scoreNum  = Math.round(interpolate(frame, [8, 60], [62, 87], clamp));
  const scoreSp   = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });
  const scoreScale = interpolate(scoreSp, [0, 1], [0.7, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 80px',
      }}
    >
      {/* "TIME RUNNING OUT" */}
      <div
        style={{
          fontFamily: inter,
          fontSize: 28,
          fontWeight: '700',
          color: BRAND,
          letterSpacing: 5,
          marginBottom: 24,
          opacity: pulse,
        }}
      >
        TIME RUNNING OUT
      </div>

      {/* Timer bar track */}
      <div
        style={{
          width: '100%',
          height: 18,
          backgroundColor: DARK_ELEV,
          borderRadius: 9,
          overflow: 'hidden',
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: `${timerPct * 100}%`,
            height: '100%',
            backgroundColor: BRAND,
            borderRadius: 9,
            boxShadow: `0 0 20px rgba(252,52,92,0.6)`,
          }}
        />
      </div>

      {/* Countdown number */}
      <div
        style={{
          fontFamily: inter,
          fontSize: 140,
          fontWeight: '900',
          color: timerPct < 0.2 ? BRAND : WHITE,
          letterSpacing: -6,
          opacity: pulse,
          lineHeight: 1,
        }}
      >
        {timeLeft}s
      </div>

      {/* Running score */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 48,
          transform: `scale(${scoreScale})`,
        }}
      >
        <div
          style={{
            fontFamily: inter,
            fontSize: 24,
            fontWeight: '600',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: 4,
            marginBottom: 8,
          }}
        >
          SCORE
        </div>
        <div
          style={{
            fontFamily: inter,
            fontSize: 108,
            fontWeight: '900',
            color: SUCCESS,
            lineHeight: 1,
          }}
        >
          {scoreNum}
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 4 — Results + CTA (frames 258-330) ─────────────────────────────────
function ResultsScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 18], [0, 1], clamp);

  // Score burst
  const scoreSp    = spring({ frame: frame - 8, fps, config: { damping: 10, stiffness: 260 } });
  const scoreScale = interpolate(scoreSp, [0, 0.65, 1], [0, 1.2, 1]);

  // XP badge slides up
  const xpSp    = spring({ frame: frame - 30, fps, config: { damping: 20, stiffness: 160 } });
  const xpY     = interpolate(xpSp, [0, 1], [60, 0]);
  const xpAlpha = interpolate(frame, [30, 44], [0, 1], clamp);

  // CTA springs in
  const ctaSp    = spring({ frame: frame - 52, fps, config: { damping: 18, stiffness: 160 } });
  const ctaY     = interpolate(ctaSp, [0, 1], [50, 0]);
  const ctaAlpha = interpolate(frame, [52, 66], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeIn,
      }}
    >
      {/* Final score burst */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `scale(${scoreScale})`,
        }}
      >
        <div
          style={{
            fontFamily: inter,
            fontSize: 28,
            fontWeight: '700',
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: 6,
            marginBottom: 8,
          }}
        >
          FINAL SCORE
        </div>
        <div
          style={{
            fontFamily: inter,
            fontSize: 180,
            fontWeight: '900',
            color: SUCCESS,
            lineHeight: 1,
            filter: `drop-shadow(0 0 40px rgba(0,200,151,0.5))`,
          }}
        >
          87
        </div>
        <div
          style={{
            fontFamily: inter,
            fontSize: 32,
            fontWeight: '500',
            color: 'rgba(255,255,255,0.35)',
          }}
        >
          out of 100
        </div>
      </div>

      {/* XP badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          backgroundColor: 'rgba(0,200,151,0.12)',
          border: `2px solid ${SUCCESS}`,
          borderRadius: 60,
          padding: '18px 48px',
          marginTop: 44,
          transform: `translateY(${xpY}px)`,
          opacity: xpAlpha,
        }}
      >
        <div
          style={{
            fontFamily: inter,
            fontSize: 40,
            fontWeight: '900',
            color: SUCCESS,
          }}
        >
          +935 XP
        </div>
        <div
          style={{
            fontFamily: inter,
            fontSize: 26,
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          EARNED
        </div>
      </div>

      {/* CTA button */}
      <div
        style={{
          marginTop: 72,
          transform: `translateY(${ctaY}px)`,
          opacity: ctaAlpha,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            backgroundColor: BRAND,
            borderRadius: 22,
            padding: '32px 80px',
            fontFamily: inter,
            fontSize: 38,
            fontWeight: '900',
            color: WHITE,
            letterSpacing: 4,
            boxShadow: `0 8px 48px rgba(252,52,92,0.55)`,
          }}
        >
          PLAY NOW
        </div>
        <div
          style={{
            fontFamily: inter,
            fontSize: 24,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: 3,
          }}
        >
          Daily · Free · All Leagues
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ── Cross-fade overlay between scenes ────────────────────────────────────────
function SceneFade({ from, to }: { from: number; to: number }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [from, to], [0, 1], clamp);
  return (
    <AbsoluteFill
      style={{ backgroundColor: DARK_BG, opacity, pointerEvents: 'none' }}
    />
  );
}

// ── Main Composition ──────────────────────────────────────────────────────────
export function PowerPlayPreview() {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      {/* Scene 1: Brand Burst — frames 0-80 */}
      <Sequence from={0} durationInFrames={80} premountFor={fps}>
        <BrandBurst />
      </Sequence>

      {/* Fade out Scene 1 — frames 68-82 */}
      <Sequence from={68} durationInFrames={14} premountFor={fps}>
        <SceneFade from={0} to={14} />
      </Sequence>

      {/* Scene 2: Game Mockup — frames 72-222 */}
      <Sequence from={72} durationInFrames={150} premountFor={fps}>
        <GameMockup />
      </Sequence>

      {/* Fade out Scene 2 — frames 208-222 */}
      <Sequence from={208} durationInFrames={14} premountFor={fps}>
        <SceneFade from={0} to={14} />
      </Sequence>

      {/* Scene 3: Timer Urgency — frames 212-274 */}
      <Sequence from={212} durationInFrames={62} premountFor={fps}>
        <UrgencyScene />
      </Sequence>

      {/* Fade out Scene 3 — frames 260-274 */}
      <Sequence from={260} durationInFrames={14} premountFor={fps}>
        <SceneFade from={0} to={14} />
      </Sequence>

      {/* Scene 4: Results — frames 264-330 */}
      <Sequence from={264} durationInFrames={66} premountFor={fps}>
        <ResultsScene />
      </Sequence>
    </AbsoluteFill>
  );
}
