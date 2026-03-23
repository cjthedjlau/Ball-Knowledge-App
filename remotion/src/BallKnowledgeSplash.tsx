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

const { fontFamily: inter } = loadFont('normal', {
  weights: ['400', '500', '600', '700', '900'],
  subsets: ['latin'],
});

// ── BK Design Tokens ──────────────────────────────────────────────────────────
const BRAND     = '#FC345C';
const BRAND_MID = '#FD8FAA';
const WHITE     = '#FFFFFF';
const DARK_BG   = '#0F0F0F';
const DARK_SURF = '#1E1E1E';
const DARK_ELEV = '#2A2A2A';
const SUCCESS   = '#00C897';
const MID_GRAY  = '#6B7280';
const BORDER    = '#333333';

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

// ── Phone Frame ─────────────────────────────────────────────────────────────
// Wraps content in a phone-shaped bezel so it looks like viewing a real screen
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 820,
          height: 1640,
          borderRadius: 60,
          border: `4px solid ${BORDER}`,
          backgroundColor: DARK_BG,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 0 80px rgba(0,0,0,0.8)',
        }}
      >
        {/* Status bar */}
        <div
          style={{
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            fontSize: 18,
            fontFamily: inter,
            fontWeight: '600',
            color: WHITE,
          }}
        >
          <span>9:41</span>
          <span style={{ opacity: 0.5 }}>BK</span>
        </div>
        {children}
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 1: Quick Brand Flash (frames 0-25) ────────────────────────────────
function BrandFlash() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sp = spring({ frame, fps, config: { damping: 12, stiffness: 200 }, durationInFrames: 20 });
  const scale = interpolate(sp, [0, 1], [0.3, 1]);
  const alpha = interpolate(frame, [0, 8, 20, 25], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: alpha,
      }}
    >
      <div
        style={{
          fontFamily: inter,
          fontSize: 88,
          fontWeight: '900',
          color: WHITE,
          letterSpacing: 6,
          textAlign: 'center',
          lineHeight: '1.1',
          transform: `scale(${scale})`,
          fontStyle: 'italic',
        }}
      >
        BALL<br />KNOWLEDGE
      </div>
    </AbsoluteFill>
  );
}

// ── Scene: Showdown Gameplay ─────────────────────────────────────────────────
// Two mystery stat cards side by side, prompt explains the game, user picks, reveals
function ShowdownScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardIn = spring({ frame, fps, config: { damping: 18, stiffness: 180 } });
  const cardY = interpolate(cardIn, [0, 1], [100, 0]);

  // Prompt fades in first, then cards are tappable
  const promptAlpha = interpolate(frame, [4, 14], [0, 1], clamp);

  // "Tap" happens at frame 26 (give time to read the prompt)
  const tapped = frame >= 26;
  const tapScale = tapped
    ? interpolate(frame, [26, 30, 34], [1, 0.95, 1], clamp)
    : 1;

  // Reveal at frame 34
  const revealed = frame >= 34;
  const revealAlpha = interpolate(frame, [34, 40], [0, 1], clamp);

  // Vote bar animation
  const voteWidth = interpolate(frame, [38, 48], [0, 100], clamp);

  const stats = [
    { label: 'PPG', a: '27.4', b: '25.8' },
    { label: 'APG', a: '7.1',  b: '10.3' },
    { label: 'RPG', a: '7.4',  b: '5.2' },
    { label: 'FG%', a: '.530', b: '.488' },
  ];

  return (
    <PhoneFrame>
      <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            backgroundColor: BRAND, borderRadius: 8, padding: '6px 16px',
            fontFamily: inter, fontSize: 18, fontWeight: '700', color: WHITE, letterSpacing: 2,
          }}>NBA</div>
          <div style={{ fontFamily: inter, fontSize: 18, fontWeight: '600', color: MID_GRAY, letterSpacing: 1 }}>
            SHOWDOWN
          </div>
        </div>

        {/* Game prompt — explains what user does */}
        <div style={{
          textAlign: 'center', marginBottom: 16, opacity: promptAlpha,
        }}>
          <div style={{
            fontFamily: inter, fontSize: 20, fontWeight: '700', color: WHITE, marginBottom: 4,
          }}>
            Who had the better season?
          </div>
          <div style={{
            fontFamily: inter, fontSize: 14, fontWeight: '500', color: MID_GRAY,
          }}>
            Pick based on stats alone — identities hidden
          </div>
        </div>

        {/* Two cards */}
        <div style={{
          display: 'flex', gap: 14, transform: `translateY(${cardY}px)`,
          flex: 1, maxHeight: 1050,
        }}>
          {[0, 1].map((side) => (
            <div
              key={side}
              style={{
                flex: 1,
                backgroundColor: DARK_SURF,
                borderRadius: 20,
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: side === 0 && tapped ? `2px solid ${BRAND}` : `1px solid ${BORDER}`,
                transform: side === 0 ? `scale(${tapScale})` : undefined,
              }}
            >
              {/* Player label */}
              <div style={{
                fontFamily: inter, fontSize: 14, fontWeight: '700', color: MID_GRAY,
                letterSpacing: 2, marginBottom: 12,
              }}>PLAYER {side === 0 ? 'A' : 'B'}</div>

              {/* Silhouette or revealed name */}
              <div style={{
                width: 110, height: 110, borderRadius: 55,
                backgroundColor: revealed ? (side === 0 ? BRAND : DARK_ELEV) : DARK_ELEV,
                marginBottom: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: revealed ? 'none' : `2px dashed ${BORDER}`,
              }}>
                {revealed ? (
                  <div style={{
                    fontFamily: inter, fontSize: 36, fontWeight: '900', color: WHITE,
                  }}>
                    {side === 0 ? 'NJ' : 'LJ'}
                  </div>
                ) : (
                  <div style={{
                    fontFamily: inter, fontSize: 44, fontWeight: '900', color: MID_GRAY, opacity: 0.3,
                  }}>?</div>
                )}
              </div>

              {/* Revealed name */}
              {revealed && (
                <div style={{ opacity: revealAlpha, textAlign: 'center', marginBottom: 14 }}>
                  <div style={{
                    fontFamily: inter, fontSize: 20, fontWeight: '700', color: WHITE, marginBottom: 4,
                  }}>
                    {side === 0 ? 'Nikola Jokic' : 'LeBron James'}
                  </div>
                  <div style={{
                    fontFamily: inter, fontSize: 14, fontWeight: '500', color: MID_GRAY,
                  }}>
                    {side === 0 ? 'Denver Nuggets' : 'Los Angeles Lakers'}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {stats.map((s) => (
                  <div key={s.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    backgroundColor: DARK_ELEV, borderRadius: 10, padding: '10px 14px',
                  }}>
                    <span style={{ fontFamily: inter, fontSize: 13, fontWeight: '600', color: MID_GRAY }}>
                      {s.label}
                    </span>
                    <span style={{ fontFamily: inter, fontSize: 20, fontWeight: '900', color: WHITE }}>
                      {side === 0 ? s.a : s.b}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pick label */}
              {side === 0 && tapped && (
                <div style={{
                  marginTop: 14, backgroundColor: BRAND, borderRadius: 10,
                  padding: '8px 22px', fontFamily: inter, fontSize: 15,
                  fontWeight: '700', color: WHITE, letterSpacing: 1,
                  opacity: interpolate(frame, [26, 32], [0, 1], clamp),
                }}>
                  YOUR PICK
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Vote bar */}
        {revealed && (
          <div style={{ marginTop: 16, opacity: revealAlpha }}>
            <div style={{
              fontFamily: inter, fontSize: 13, fontWeight: '600', color: MID_GRAY,
              letterSpacing: 2, marginBottom: 6,
            }}>COMMUNITY VOTE</div>
            <div style={{
              height: 12, backgroundColor: DARK_ELEV, borderRadius: 6, overflow: 'hidden',
              display: 'flex',
            }}>
              <div style={{
                width: `${voteWidth * 0.62}%`, height: '100%', backgroundColor: BRAND,
                borderRadius: 6,
              }} />
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', marginTop: 5,
              fontFamily: inter, fontSize: 13, fontWeight: '700', color: WHITE,
            }}>
              <span>62%</span><span>38%</span>
            </div>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}

// ── Scene: Guesser Gameplay ──────────────────────────────────────────────────
// Sports Wordle — guess the mystery player using color-coded attribute feedback
function GuesserScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({ frame, fps, config: { damping: 20, stiffness: 200 } });
  const contentY = interpolate(slideIn, [0, 1], [60, 0]);

  const cols = ['PLAYER', 'HT', 'TEAM', 'POS', 'CONF', 'ORIGIN', 'AGE'];

  const guesses = [
    { name: 'Curry',   vals: ['6\'2"', 'GSW', 'PG', 'WEST', 'Davidson', '37'], states: ['wrong','wrong','wrong','close','correct','wrong','close'] },
    { name: 'Tatum',   vals: ['6\'8"', 'BOS', 'SF', 'EAST', 'Duke',     '27'], states: ['wrong','close','wrong','wrong','wrong',  'wrong','correct'] },
    { name: 'Edwards', vals: ['6\'4"', 'MIN', 'SG', 'WEST', 'Georgia',  '23'], states: ['wrong','wrong','wrong','close','wrong',  'wrong','wrong'] },
  ];

  const stateColor = (s: string) =>
    s === 'correct' ? SUCCESS : s === 'close' ? '#F59E0B' : DARK_ELEV;

  return (
    <PhoneFrame>
      <div style={{
        padding: '20px 20px', flex: 1, display: 'flex', flexDirection: 'column',
        transform: `translateY(${contentY}px)`,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            backgroundColor: BRAND, borderRadius: 8, padding: '6px 16px',
            fontFamily: inter, fontSize: 18, fontWeight: '700', color: WHITE, letterSpacing: 2,
          }}>NBA</div>
          <div style={{ fontFamily: inter, fontSize: 18, fontWeight: '600', color: MID_GRAY, letterSpacing: 1 }}>
            MYSTERY PLAYER
          </div>
          <div style={{
            marginLeft: 'auto', fontFamily: inter, fontSize: 16, fontWeight: '700', color: BRAND,
          }}>3/8</div>
        </div>

        {/* Mystery player indicator */}
        <div style={{
          backgroundColor: DARK_SURF, borderRadius: 16, padding: '16px 20px',
          marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16,
          border: `1px solid ${BORDER}`,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 28,
            backgroundColor: DARK_ELEV, border: `2px dashed ${BRAND}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: inter, fontSize: 28, fontWeight: '900', color: BRAND }}>?</span>
          </div>
          <div>
            <div style={{ fontFamily: inter, fontSize: 18, fontWeight: '700', color: WHITE }}>
              Who is the mystery player?
            </div>
            <div style={{ fontFamily: inter, fontSize: 13, fontWeight: '500', color: MID_GRAY, marginTop: 2 }}>
              Use clues from each guess to narrow it down
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 12, justifyContent: 'center' }}>
          {[
            { color: SUCCESS, label: 'Match' },
            { color: '#F59E0B', label: 'Close' },
            { color: DARK_ELEV, label: 'Wrong' },
          ].map((l) => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: l.color }} />
              <span style={{ fontFamily: inter, fontSize: 12, fontWeight: '600', color: MID_GRAY }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Column headers */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, padding: '0 4px' }}>
          {cols.map((c) => (
            <div key={c} style={{
              flex: c === 'PLAYER' ? 1.4 : 1,
              fontFamily: inter, fontSize: 11, fontWeight: '700', color: MID_GRAY,
              letterSpacing: 1, textAlign: 'center',
            }}>{c}</div>
          ))}
        </div>

        {/* Guess rows with staggered reveal */}
        {guesses.map((g, i) => {
          const rowStart = 10 + i * 12;
          const rowAlpha = interpolate(frame, [rowStart, rowStart + 8], [0, 1], clamp);
          const rowX = interpolate(frame, [rowStart, rowStart + 8], [-40, 0], clamp);

          return (
            <div
              key={i}
              style={{
                display: 'flex', gap: 6, marginBottom: 8,
                opacity: rowAlpha, transform: `translateX(${rowX}px)`,
              }}
            >
              {/* Player name */}
              <div style={{
                flex: 1.4, backgroundColor: g.states[0] === 'correct' ? SUCCESS : DARK_ELEV,
                borderRadius: 10, padding: '14px 10px', textAlign: 'center',
                fontFamily: inter, fontSize: 16, fontWeight: '700', color: WHITE,
              }}>{g.name}</div>
              {/* Attribute tiles */}
              {g.vals.map((v, j) => (
                <div key={j} style={{
                  flex: 1, backgroundColor: stateColor(g.states[j + 1]),
                  borderRadius: 10, padding: '14px 4px', textAlign: 'center',
                  fontFamily: inter, fontSize: 13, fontWeight: '600', color: WHITE,
                }}>{v}</div>
              ))}
            </div>
          );
        })}

        {/* Typing animation for next guess */}
        {frame >= 40 && (
          <div style={{
            marginTop: 12,
            backgroundColor: DARK_ELEV, borderRadius: 14, height: 56,
            display: 'flex', alignItems: 'center', padding: '0 20px',
            border: `1.5px solid ${BRAND}`,
            opacity: interpolate(frame, [40, 46], [0, 1], clamp),
          }}>
            <span style={{ fontFamily: inter, fontSize: 18, fontWeight: '500', color: WHITE }}>
              {'Anthony Ed'.slice(0, Math.min(10, Math.floor((frame - 40) / 2)))}
              <span style={{ color: BRAND, opacity: frame % 16 < 9 ? 1 : 0 }}>|</span>
            </span>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}

// ── Scene: Power Play Gameplay ───────────────────────────────────────────────
// Timed question with ranked answer slots being filled in
function PowerPlayScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], clamp);

  const question = 'Name an NBA MVP from the last 10 years';
  const answers = [
    { text: 'Nikola Jokic',          points: 38 },
    { text: 'Giannis Antetokounmpo', points: 31 },
    { text: 'LeBron James',          points: 16 },
    { text: 'Joel Embiid',           points: 10 },
    { text: 'Stephen Curry',         points: 5  },
  ];

  // Timer counts down
  const timerSec = Math.max(0, 72 - Math.floor(frame * 1.5));

  // Typing simulation: user types "Jokic" starting at frame 12
  const typed1 = 'Jokic'.slice(0, Math.max(0, Math.floor((frame - 12) / 3)));
  // Answer 1 reveals at frame 26
  const reveal1 = frame >= 26;
  // User types "Giannis" at frame 30
  const typed2 = 'Giannis'.slice(0, Math.max(0, Math.floor((frame - 30) / 3)));
  // Answer 2 reveals at frame 44 (but we only have 50 frames)
  const reveal2 = frame >= 44;

  return (
    <PhoneFrame>
      <div style={{
        padding: '20px 28px', flex: 1, display: 'flex', flexDirection: 'column',
        opacity: fadeIn,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            backgroundColor: BRAND, borderRadius: 8, padding: '6px 16px',
            fontFamily: inter, fontSize: 18, fontWeight: '700', color: WHITE, letterSpacing: 2,
          }}>NBA</div>
          <div style={{ fontFamily: inter, fontSize: 18, fontWeight: '600', color: MID_GRAY, letterSpacing: 1 }}>
            POWER PLAY
          </div>
          {/* Timer pill */}
          <div style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8,
            backgroundColor: 'rgba(252,52,92,0.15)', border: `1.5px solid ${BRAND}`,
            borderRadius: 30, padding: '6px 16px',
          }}>
            <span style={{ fontSize: 20 }}>&#9889;</span>
            <span style={{ fontFamily: inter, fontSize: 20, fontWeight: '700', color: BRAND }}>
              {timerSec}s
            </span>
          </div>
        </div>

        {/* Question counter */}
        <div style={{
          fontFamily: inter, fontSize: 14, fontWeight: '700', color: BRAND,
          letterSpacing: 3, marginBottom: 10,
        }}>
          QUESTION 2 OF 5
        </div>

        {/* Question card */}
        <div style={{
          backgroundColor: DARK_SURF, borderRadius: 20, padding: '28px 24px',
          marginBottom: 20, border: `1px solid rgba(252,52,92,0.2)`,
        }}>
          <div style={{
            fontFamily: inter, fontSize: 28, fontWeight: '700', color: WHITE, lineHeight: '1.35',
          }}>
            {question}
          </div>
        </div>

        {/* Answer board — 5 ranked slots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {answers.map((a, i) => {
            const isRevealed = (i === 0 && reveal1) || (i === 1 && reveal2);
            const revealFrame = i === 0 ? 26 : 44;
            const rowAlpha = isRevealed ? interpolate(frame, [revealFrame, revealFrame + 6], [0, 1], clamp) : 1;

            return (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center',
                  backgroundColor: isRevealed ? 'rgba(0,200,151,0.1)' : DARK_ELEV,
                  borderRadius: 14, padding: '18px 20px',
                  border: isRevealed ? `1.5px solid ${SUCCESS}` : `1px solid ${BORDER}`,
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  backgroundColor: isRevealed ? SUCCESS : DARK_SURF,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: inter, fontSize: 18, fontWeight: '900',
                  color: isRevealed ? WHITE : MID_GRAY,
                  marginRight: 16,
                }}>
                  {i + 1}
                </div>
                {isRevealed ? (
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: rowAlpha }}>
                    <span style={{ fontFamily: inter, fontSize: 20, fontWeight: '600', color: WHITE }}>
                      {a.text}
                    </span>
                    <span style={{ fontFamily: inter, fontSize: 22, fontWeight: '900', color: SUCCESS }}>
                      {a.points}
                    </span>
                  </div>
                ) : (
                  <div style={{
                    flex: 1, height: 16, backgroundColor: DARK_SURF, borderRadius: 8,
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Score row */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12,
          marginBottom: 16,
        }}>
          <span style={{ fontFamily: inter, fontSize: 16, fontWeight: '700', color: MID_GRAY, letterSpacing: 2 }}>
            POINTS
          </span>
          <span style={{ fontFamily: inter, fontSize: 36, fontWeight: '900', color: WHITE }}>
            {reveal2 ? 69 : reveal1 ? 38 : 0}
          </span>
        </div>

        {/* Input field with typing */}
        <div style={{
          backgroundColor: DARK_ELEV, borderRadius: 14, height: 56,
          display: 'flex', alignItems: 'center', padding: '0 20px',
          border: `1.5px solid ${frame >= 12 && !reveal1 ? BRAND : frame >= 30 && !reveal2 ? BRAND : BORDER}`,
        }}>
          <span style={{ fontFamily: inter, fontSize: 18, fontWeight: '500', color: frame >= 12 ? WHITE : MID_GRAY }}>
            {!reveal1 && frame >= 12 ? (
              <>{typed1}<span style={{ color: BRAND, opacity: frame % 16 < 9 ? 1 : 0 }}>|</span></>
            ) : reveal1 && !reveal2 && frame >= 30 ? (
              <>{typed2}<span style={{ color: BRAND, opacity: frame % 16 < 9 ? 1 : 0 }}>|</span></>
            ) : (
              <span style={{ color: MID_GRAY }}>Type your guess...</span>
            )}
          </span>
        </div>
      </div>
    </PhoneFrame>
  );
}

// ── Scene 5: End Card (frames 150-180) ──────────────────────────────────────
function EndCard() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sp = spring({ frame, fps, config: { damping: 14, stiffness: 180 }, durationInFrames: 20 });
  const scale = interpolate(sp, [0, 1], [0.5, 1]);
  const alpha = interpolate(frame, [0, 10], [0, 1], clamp);

  const tagAlpha = interpolate(frame, [12, 22], [0, 1], clamp);
  const tagY = interpolate(frame, [12, 22], [30, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: alpha,
      }}
    >
      <div
        style={{
          fontFamily: inter,
          fontSize: 100,
          fontWeight: '900',
          color: WHITE,
          letterSpacing: 6,
          textAlign: 'center',
          lineHeight: '1.1',
          transform: `scale(${scale})`,
          fontStyle: 'italic',
          filter: `drop-shadow(0 0 40px rgba(252,52,92,0.6))`,
        }}
      >
        BALL<br />KNOWLEDGE
      </div>

      <div
        style={{
          fontFamily: inter,
          fontSize: 28,
          fontWeight: '400',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: 8,
          marginTop: 32,
          transform: `translateY(${tagY}px)`,
          opacity: tagAlpha,
        }}
      >
        KNOW THE GAME
      </div>
    </AbsoluteFill>
  );
}

// ── Crossfade helper ────────────────────────────────────────────────────────
function SceneFade() {
  const frame = useCurrentFrame();
  const alpha = interpolate(frame, [0, 8], [0, 1], clamp);
  return <AbsoluteFill style={{ backgroundColor: DARK_BG, opacity: alpha }} />;
}

// ── Main Composition — 190 frames = ~6.3 seconds at 30fps ──────────────────
export function BallKnowledgeSplash() {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>

      {/* Scene 1: Brand flash — frames 0-25 (0.8s) */}
      <Sequence from={0} durationInFrames={25} premountFor={fps}>
        <BrandFlash />
      </Sequence>

      {/* Scene 2: Power Play gameplay — frames 22-72 (1.7s) */}
      <Sequence from={22} durationInFrames={50} premountFor={fps}>
        <PowerPlayScene />
      </Sequence>

      {/* Fade 1 */}
      <Sequence from={68} durationInFrames={8} premountFor={fps}>
        <SceneFade />
      </Sequence>

      {/* Scene 3: Showdown gameplay — frames 72-122 (1.7s) */}
      <Sequence from={72} durationInFrames={50} premountFor={fps}>
        <ShowdownScene />
      </Sequence>

      {/* Fade 2 */}
      <Sequence from={118} durationInFrames={8} premountFor={fps}>
        <SceneFade />
      </Sequence>

      {/* Scene 4: Guesser gameplay — frames 122-172 (1.7s) */}
      <Sequence from={122} durationInFrames={50} premountFor={fps}>
        <GuesserScene />
      </Sequence>

      {/* Fade 3 */}
      <Sequence from={166} durationInFrames={8} premountFor={fps}>
        <SceneFade />
      </Sequence>

      {/* Scene 5: End card — frames 168-190 (0.7s) */}
      <Sequence from={168} durationInFrames={22} premountFor={fps}>
        <EndCard />
      </Sequence>

    </AbsoluteFill>
  );
}
