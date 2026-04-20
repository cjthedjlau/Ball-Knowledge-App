import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, Trophy, Swords, Eye, Activity, HelpCircle, ChevronRight, Check, X, Search, Star, Users, Hash, Shuffle } from 'lucide-react-native';
import { brand, dark, light, fonts, fontSizes, colors, darkColors, fontFamily, spacing, radius, layout } from '../../styles/theme';

const { width: W, height: H } = Dimensions.get('window');
const CARD_HALF = (W - 48 - 12) / 2;
const TRACK_W   = W - 64;

// ── Timing ──────────────────────────────────────────────────────────────────
const SD = 2600;  // ms per scene
const CF = 200;   // cross-fade ms
// Start time for scene N's internal animations
const ts = (n: number, off = 0) => n * SD + off;

interface Props { onFinish: () => void }

// ─────────────────────────────────────────────────────────────────────────────
// Scene 0 — Welcome
// ─────────────────────────────────────────────────────────────────────────────
function Scene0Welcome({ opacity }: { opacity: Animated.Value }) {
  const circleS  = useRef(new Animated.Value(0)).current;
  const circleO  = useRef(new Animated.Value(0)).current;
  const titleY   = useRef(new Animated.Value(50)).current;
  const titleO   = useRef(new Animated.Value(0)).current;
  const tagO     = useRef(new Animated.Value(0)).current;
  const badgesO  = useRef(new Animated.Value(0)).current;
  const timers   = useRef<ReturnType<typeof setTimeout>[]>([]);
  const t = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    t(() => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(circleO, { toValue: 1, duration: 120, useNativeDriver: true }),
          Animated.timing(circleS, { toValue: 18, duration: 400, useNativeDriver: true }),
        ]),
        Animated.timing(circleO, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
    }, ts(0, 0));
    t(() => Animated.parallel([
      Animated.spring(titleY, { toValue: 0, useNativeDriver: true, damping: 14, stiffness: 200 }),
      Animated.timing(titleO, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start(), ts(0, 200));
    t(() => Animated.timing(tagO, { toValue: 1, duration: 300, useNativeDriver: true }).start(), ts(0, 520));
    t(() => Animated.timing(badgesO, { toValue: 1, duration: 350, useNativeDriver: true }).start(), ts(0, 850));
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const GAMES = ['POWER PLAY', 'BLIND RANK 5', 'BLIND SHOWDOWN', 'IMPOSTER', 'WAVELENGTH', 'WHO AM I', 'PLAYER GUESSER', 'DAILY TRIVIA', 'DRAFT W/ FRIENDS', '13 WORDS', 'MYSTERY PLAYER'];
  return (
    <Animated.View style={[StyleSheet.absoluteFill, sc.center, { opacity }]}>
      <Animated.View style={[sc.burstCircle, { opacity: circleO, transform: [{ scale: circleS }] }]} />
      <Animated.Text style={[sc.welcomeLabel, { opacity: titleO }]}>WELCOME TO</Animated.Text>
      <Animated.Text style={[sc.mainTitle, { opacity: titleO, transform: [{ translateY: titleY }] }]}>
        BALL{'\n'}KNOWLEDGE
      </Animated.Text>
      <Animated.Text style={[sc.tagline, { opacity: tagO }]}>THE ULTIMATE SPORTS IQ TEST</Animated.Text>
      <Animated.View style={[sc.gameBadgeGrid, { opacity: badgesO }]}>
        {GAMES.map(g => (
          <View key={g} style={sc.gameBadge}>
            <Text style={sc.gameBadgeText}>{g}</Text>
          </View>
        ))}
      </Animated.View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 1 — Power Play
// ─────────────────────────────────────────────────────────────────────────────
const PP_ANSWERS = [
  { name: 'Nikola Jokić',          pts: 38 },
  { name: 'Giannis Antetokounmpo', pts: 31 },
  { name: 'LeBron James',          pts: 16 },
  { name: 'Joel Embiid',           pts: 10 },
];

function Scene1PowerPlay({ opacity }: { opacity: Animated.Value }) {
  const badgeO   = useRef(new Animated.Value(0)).current;
  const cardY    = useRef(new Animated.Value(40)).current;
  const cardO    = useRef(new Animated.Value(0)).current;
  const a0O = useRef(new Animated.Value(0)).current; const a0X = useRef(new Animated.Value(-32)).current;
  const a1O = useRef(new Animated.Value(0)).current; const a1X = useRef(new Animated.Value(-32)).current;
  const a2O = useRef(new Animated.Value(0)).current; const a2X = useRef(new Animated.Value(-32)).current;
  const a3O = useRef(new Animated.Value(0)).current; const a3X = useRef(new Animated.Value(-32)).current;
  const aOps = [a0O, a1O, a2O, a3O];
  const aXs  = [a0X, a1X, a2X, a3X];
  const timerW = useRef(new Animated.Value(TRACK_W)).current;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const t = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    t(() => Animated.timing(badgeO, { toValue: 1, duration: 200, useNativeDriver: true }).start(), ts(1, 0));
    t(() => Animated.parallel([
      Animated.spring(cardY, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 260 }),
      Animated.timing(cardO, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start(), ts(1, 150));
    aOps.forEach((op, i) => {
      t(() => Animated.parallel([
        Animated.timing(op,    { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.spring(aXs[i], { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 280 }),
      ]).start(), ts(1, 380 + i * 160));
    });
    t(() => Animated.timing(timerW, {
      toValue: TRACK_W * 0.28,
      duration: 1500,
      useNativeDriver: false,
    }).start(), ts(1, 380 + PP_ANSWERS.length * 160 + 100));
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const ptColor = (p: number) => p >= 30 ? colors.brand : p >= 12 ? colors.brandMid : dark.textMuted;
  return (
    <Animated.View style={[StyleSheet.absoluteFill, sc.sceneCol, { opacity }]}>
      <Animated.View style={[sc.gameTagRow, { opacity: badgeO }]}>
        <Zap size={14} color={colors.brand} fill={colors.brand} strokeWidth={0} />
        <Text style={sc.gameTagLabel}>POWER PLAY</Text>
        <View style={sc.leaguePill}><Text style={sc.leaguePillText}>NBA</Text></View>
        <View style={sc.timerPill}>
          <Text style={sc.timerPillText}>:23</Text>
        </View>
      </Animated.View>

      <Animated.View style={[sc.questionCard, { opacity: cardO, transform: [{ translateY: cardY }] }]}>
        <Text style={sc.questionMeta}>QUESTION 3 OF 5</Text>
        <Text style={sc.questionText}>Name an NBA player who won the MVP award in the last 5 years</Text>
      </Animated.View>

      {PP_ANSWERS.map((a, i) => (
        <Animated.View key={a.name} style={[sc.answerRow, { opacity: aOps[i], transform: [{ translateX: aXs[i] }] }]}>
          <View style={sc.answerRank}><Text style={sc.answerRankText}>{i + 1}</Text></View>
          <Text style={sc.answerName}>{a.name}</Text>
          <Text style={[sc.answerPts, { color: ptColor(a.pts) }]}>{a.pts}</Text>
          <Text style={sc.answerPtsLabel}> pts</Text>
        </Animated.View>
      ))}

      <View style={sc.timerTrack}>
        <Animated.View style={[sc.timerFill, { width: timerW }]} />
      </View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 2 — Blind Rank 5
// ─────────────────────────────────────────────────────────────────────────────
const BR5_LOCKED = [
  { slot: 1, name: 'Patrick Mahomes', team: 'KC' },
  { slot: 2, name: 'Josh Allen',      team: 'BUF' },
  { slot: 3, name: 'Lamar Jackson',   team: 'BAL' },
];

function Scene2BlindRank5({ opacity }: { opacity: Animated.Value }) {
  const badgeO   = useRef(new Animated.Value(0)).current;
  const cardY    = useRef(new Animated.Value(-60)).current;
  const cardO    = useRef(new Animated.Value(0)).current;
  const s0O = useRef(new Animated.Value(0)).current;
  const s1O = useRef(new Animated.Value(0)).current;
  const s2O = useRef(new Animated.Value(0)).current;
  const s3O = useRef(new Animated.Value(0)).current;
  const s4O = useRef(new Animated.Value(0)).current;
  const slotOps = [s0O, s1O, s2O, s3O, s4O];
  const activePulse = useRef(new Animated.Value(0.3)).current;
  const lockScale   = useRef(new Animated.Value(1)).current;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const t = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    t(() => Animated.timing(badgeO, { toValue: 1, duration: 200, useNativeDriver: true }).start(), ts(2, 0));
    t(() => Animated.parallel([
      Animated.spring(cardY, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 240 }),
      Animated.timing(cardO, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start(), ts(2, 120));
    slotOps.forEach((op, i) => {
      t(() => Animated.timing(op, { toValue: 1, duration: 180, useNativeDriver: true }).start(), ts(2, 300 + i * 130));
    });
    t(() => {
      Animated.loop(Animated.sequence([
        Animated.timing(activePulse, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(activePulse, { toValue: 0.3, duration: 420, useNativeDriver: true }),
      ])).start();
    }, ts(2, 300 + 5 * 130 + 100));
    // Lock animation — simulate player tapping slot 4
    t(() => Animated.sequence([
      Animated.timing(lockScale, { toValue: 0.88, duration: 100, useNativeDriver: true }),
      Animated.spring(lockScale, { toValue: 1, useNativeDriver: true, damping: 10, stiffness: 300 }),
    ]).start(), ts(2, 1900));
    return () => timers.current.forEach(clearTimeout);
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, sc.sceneCol, { opacity }]}>
      <Animated.View style={[sc.gameTagRow, { opacity: badgeO }]}>
        <Trophy size={14} color={colors.brand} strokeWidth={2} />
        <Text style={sc.gameTagLabel}>BLIND RANK 5</Text>
        <View style={sc.leaguePill}><Text style={sc.leaguePillText}>NFL</Text></View>
        <Text style={sc.revealProgress}>REVEAL 4 OF 5</Text>
      </Animated.View>

      {/* Current player card */}
      <Animated.View style={[sc.currentRevealCard, { opacity: cardO, transform: [{ translateY: cardY }] }]}>
        <View style={sc.currentRevealLeft}>
          <View style={sc.silhouetteAvatar}><Text style={sc.silhouetteQ}>?</Text></View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={sc.revealPlayerName}>Jalen Hurts</Text>
          <Text style={sc.revealPlayerMeta}>Philadelphia Eagles · QB</Text>
          <Text style={sc.revealPlayerStat}>3,858 YDS · 27 TDs</Text>
        </View>
      </Animated.View>
      <Text style={sc.tapInstruction}>TAP A SLOT TO PLACE</Text>

      {/* 5 slots */}
      {[1, 2, 3, 4, 5].map((slotNum, i) => {
        const locked = BR5_LOCKED.find(l => l.slot === slotNum);
        const isActive = slotNum === 4;
        return (
          <Animated.View
            key={slotNum}
            style={[
              sc.slot,
              locked && sc.slotFilled,
              isActive && sc.slotActive,
              { opacity: isActive ? activePulse : slotOps[i], transform: isActive ? [{ scale: lockScale }] : [] },
            ]}
          >
            <Text style={[sc.slotNum, isActive && { color: colors.brand }]}>{slotNum}</Text>
            {locked
              ? <><Text style={sc.slotName}>{locked.name}</Text><Text style={sc.slotTeam}>{locked.team}</Text></>
              : <Text style={sc.slotEmpty}>{isActive ? 'PLACE HERE' : 'OPEN'}</Text>
            }
          </Animated.View>
        );
      })}
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 3 — Blind Showdown
// ─────────────────────────────────────────────────────────────────────────────
function Scene3BlindShowdown({ opacity }: { opacity: Animated.Value }) {
  const badgeO  = useRef(new Animated.Value(0)).current;
  const cardAX  = useRef(new Animated.Value(-(W / 2))).current;
  const cardBX  = useRef(new Animated.Value(W / 2)).current;
  const cardsO  = useRef(new Animated.Value(0)).current;
  const vsScale = useRef(new Animated.Value(0)).current;
  const sa0 = useRef(new Animated.Value(0)).current; const sb0 = useRef(new Animated.Value(0)).current;
  const sa1 = useRef(new Animated.Value(0)).current; const sb1 = useRef(new Animated.Value(0)).current;
  const sa2 = useRef(new Animated.Value(0)).current; const sb2 = useRef(new Animated.Value(0)).current;
  const statOpsA = [sa0, sa1, sa2]; const statOpsB = [sb0, sb1, sb2];
  // Reveal phase
  const revealO  = useRef(new Animated.Value(0)).current;
  const barAW    = useRef(new Animated.Value(0)).current;
  const barBW    = useRef(new Animated.Value(0)).current;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const t = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));
  const MAX_BAR  = W - 96;

  useEffect(() => {
    t(() => Animated.timing(badgeO, { toValue: 1, duration: 200, useNativeDriver: true }).start(), ts(3, 0));
    t(() => Animated.parallel([
      Animated.timing(cardsO, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.spring(cardAX, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 240 }),
      Animated.spring(cardBX, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 240 }),
    ]).start(), ts(3, 100));
    t(() => Animated.spring(vsScale, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 280 }).start(), ts(3, 280));
    [...statOpsA, ...statOpsB].forEach((op, i) => {
      t(() => Animated.timing(op, { toValue: 1, duration: 160, useNativeDriver: true }).start(), ts(3, 420 + (i % 3) * 130));
    });
    // Reveal at 1.6s into scene
    t(() => Animated.timing(revealO, { toValue: 1, duration: 280, useNativeDriver: true }).start(), ts(3, 1600));
    t(() => Animated.parallel([
      Animated.timing(barAW, { toValue: MAX_BAR * 0.63, duration: 500, useNativeDriver: false }),
      Animated.timing(barBW, { toValue: MAX_BAR * 0.37, duration: 500, useNativeDriver: false }),
    ]).start(), ts(3, 1750));
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const STATS_A = [{ l: 'PPG', v: '34.7' }, { l: 'APG', v: '13.0' }, { l: 'FG%', v: '55.2' }];
  const STATS_B = [{ l: 'PPG', v: '28.9' }, { l: 'APG', v: '8.7'  }, { l: 'FG%', v: '51.8' }];

  return (
    <Animated.View style={[StyleSheet.absoluteFill, sc.sceneCol, { opacity }]}>
      <Animated.View style={[sc.gameTagRow, { opacity: badgeO }]}>
        <Swords size={14} color={colors.brand} strokeWidth={1.8} />
        <Text style={sc.gameTagLabel}>BLIND SHOWDOWN</Text>
        <View style={sc.leaguePill}><Text style={sc.leaguePillText}>NBA</Text></View>
      </Animated.View>

      {/* Two stat cards */}
      <Animated.View style={[sc.twoCardsRow, { opacity: cardsO }]}>
        {/* Card A */}
        <Animated.View style={[sc.showdownCard, { transform: [{ translateX: cardAX }] }]}>
          <Text style={sc.showdownCardLabel}>PLAYER A</Text>
          <View style={sc.silhouetteMd} />
          {STATS_A.map((s, i) => (
            <Animated.View key={s.l} style={[sc.showdownStatRow, { opacity: statOpsA[i] }]}>
              <Text style={sc.showdownStatL}>{s.l}</Text>
              <Text style={sc.showdownStatV}>{s.v}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View style={[sc.vsCircle, { transform: [{ scale: vsScale }] }]}>
          <Text style={sc.vsText}>VS</Text>
        </Animated.View>

        {/* Card B */}
        <Animated.View style={[sc.showdownCard, { transform: [{ translateX: cardBX }] }]}>
          <Text style={sc.showdownCardLabel}>PLAYER B</Text>
          <View style={sc.silhouetteMd} />
          {STATS_B.map((s, i) => (
            <Animated.View key={s.l} style={[sc.showdownStatRow, { opacity: statOpsB[i] }]}>
              <Text style={sc.showdownStatL}>{s.l}</Text>
              <Text style={sc.showdownStatV}>{s.v}</Text>
            </Animated.View>
          ))}
        </Animated.View>
      </Animated.View>

      {/* Reveal overlay */}
      <Animated.View style={[sc.revealOverlay, { opacity: revealO }]}>
        <Text style={sc.revealTitle}>REVEALED</Text>
        <View style={sc.revealRow}>
          <View style={sc.revealNameCard}>
            <Text style={sc.revealName}>Luka Dončić</Text>
            <Text style={sc.revealTeamBadge}>DAL</Text>
          </View>
          <Text style={sc.revealVsSep}>VS</Text>
          <View style={sc.revealNameCard}>
            <Text style={sc.revealName}>Nikola Jokić</Text>
            <Text style={sc.revealTeamBadge}>DEN</Text>
          </View>
        </View>
        <View style={sc.voteBarRow}>
          <Text style={sc.votePct}>63%</Text>
          <View style={sc.voteTrack}>
            <Animated.View style={[sc.voteBarA, { width: barAW }]} />
          </View>
        </View>
        <View style={sc.voteBarRow}>
          <Text style={sc.votePctDim}>37%</Text>
          <View style={sc.voteTrack}>
            <Animated.View style={[sc.voteBarB, { width: barBW }]} />
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 4 — Sports Imposter
// ─────────────────────────────────────────────────────────────────────────────
function Scene4Imposter({ opacity }: { opacity: Animated.Value }) {
  const badgeO   = useRef(new Animated.Value(0)).current;
  const passY    = useRef(new Animated.Value(30)).current;
  const passO    = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.85)).current;
  const cardO     = useRef(new Animated.Value(0)).current;
  const roleO     = useRef(new Animated.Value(0)).current;
  const nameO     = useRef(new Animated.Value(0)).current;
  const hintO     = useRef(new Animated.Value(0)).current;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const t = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    t(() => Animated.timing(badgeO, { toValue: 1, duration: 200, useNativeDriver: true }).start(), ts(4, 0));
    t(() => Animated.parallel([
      Animated.spring(passY, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 220 }),
      Animated.timing(passO, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start(), ts(4, 100));
    // Card flips in
    t(() => Animated.parallel([
      Animated.spring(cardScale, { toValue: 1, useNativeDriver: true, damping: 14, stiffness: 260 }),
      Animated.timing(cardO, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start(), ts(4, 500));
    t(() => Animated.timing(roleO, { toValue: 1, duration: 200, useNativeDriver: true }).start(), ts(4, 820));
    t(() => Animated.timing(nameO, { toValue: 1, duration: 220, useNativeDriver: true }).start(), ts(4, 1050));
    t(() => Animated.timing(hintO, { toValue: 1, duration: 200, useNativeDriver: true }).start(), ts(4, 1300));
    return () => timers.current.forEach(clearTimeout);
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, sc.sceneCol, { opacity }]}>
      <Animated.View style={[sc.gameTagRow, { opacity: badgeO }]}>
        <Eye size={14} color={colors.brand} strokeWidth={2} />
        <Text style={sc.gameTagLabel}>SPORTS IMPOSTER</Text>
        <View style={sc.leaguePill}><Text style={sc.leaguePillText}>NBA</Text></View>
      </Animated.View>

      {/* Pass-to banner */}
      <Animated.View style={[sc.passBanner, { opacity: passO, transform: [{ translateY: passY }] }]}>
        <Text style={sc.passBannerLabel}>PASS THE PHONE TO</Text>
        <Text style={sc.passBannerName}>MARCUS</Text>
      </Animated.View>

      {/* Role reveal card */}
      <Animated.View style={[sc.imposterCard, { opacity: cardO, transform: [{ scale: cardScale }] }]}>
        <Text style={sc.imposterCardEmoji}>🕵️</Text>
        <Animated.Text style={[sc.imposterRoleLabel, { opacity: roleO }]}>DETECTIVE</Animated.Text>
        <View style={sc.imposterDivider} />
        <Animated.View style={[{ alignItems: 'center' }, { opacity: nameO }]}>
          <Text style={sc.imposterAthleteLabel}>THE ATHLETE IS</Text>
          <Text style={sc.imposterAthleteName}>LeBron James</Text>
          <Text style={sc.imposterAthleteTeam}>Los Angeles Lakers</Text>
        </Animated.View>
        <Animated.View style={[sc.imposterHint, { opacity: hintO }]}>
          <Text style={sc.imposterHintLabel}>HINT</Text>
          <Text style={sc.imposterHintText}>4× NBA Champion · 40,000+ career points</Text>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 5 — Wavelength
// ─────────────────────────────────────────────────────────────────────────────
function Scene5Wavelength({ opacity }: { opacity: Animated.Value }) {
  const badgeO   = useRef(new Animated.Value(0)).current;
  const axisO    = useRef(new Animated.Value(0)).current;
  const trackO   = useRef(new Animated.Value(0)).current;
  const clueO    = useRef(new Animated.Value(0)).current;
  const needleX  = useRef(new Animated.Value(0)).current;
  const scoreO   = useRef(new Animated.Value(0)).current;
  const scoreS   = useRef(new Animated.Value(0.5)).current;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const t = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

  const TARGET_X  = TRACK_W * 0.68;  // start of green target zone
  const NEEDLE_END = TRACK_W * 0.72; // where needle lands

  useEffect(() => {
    t(() => Animated.timing(badgeO, { toValue: 1, duration: 200, useNativeDriver: true }).start(), ts(5, 0));
    t(() => Animated.timing(axisO, { toValue: 1, duration: 250, useNativeDriver: true }).start(), ts(5, 100));
    t(() => Animated.timing(trackO, { toValue: 1, duration: 220, useNativeDriver: true }).start(), ts(5, 300));
    t(() => Animated.timing(clueO, { toValue: 1, duration: 250, useNativeDriver: true }).start(), ts(5, 550));
    t(() => Animated.timing(needleX, {
      toValue: NEEDLE_END,
      duration: 750,
      useNativeDriver: true,
    }).start(), ts(5, 800));
    t(() => Animated.parallel([
      Animated.timing(scoreO, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.spring(scoreS, { toValue: 1, useNativeDriver: true, damping: 10, stiffness: 280 }),
    ]).start(), ts(5, 1650));
    return () => timers.current.forEach(clearTimeout);
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, sc.sceneCol, { opacity }]}>
      <Animated.View style={[sc.gameTagRow, { opacity: badgeO }]}>
        <Activity size={14} color={colors.brand} strokeWidth={2} />
        <Text style={sc.gameTagLabel}>WAVELENGTH</Text>
        <View style={sc.leaguePill}><Text style={sc.leaguePillText}>NBA</Text></View>
        <Text style={sc.roundLabel}>ROUND 3 OF 5</Text>
      </Animated.View>

      {/* Axis labels */}
      <Animated.View style={[sc.axisRow, { opacity: axisO }]}>
        <Text style={sc.axisLeft}>← ROLE PLAYER</Text>
        <Text style={sc.axisRight}>FRANCHISE PLAYER →</Text>
      </Animated.View>

      {/* Dial track */}
      <Animated.View style={[sc.dialContainer, { opacity: trackO }]}>
        {/* Background track */}
        <View style={sc.dialTrack}>
          {/* Target zone — green highlight at 65-79% */}
          <View style={[sc.dialTargetZone, { left: TRACK_W * 0.65, width: TRACK_W * 0.14 }]} />
          {/* Needle */}
          <Animated.View style={[sc.dialNeedle, { transform: [{ translateX: needleX }] }]} />
        </View>
        <View style={sc.dialLegend}>
          <View style={sc.legendItem}>
            <View style={[sc.legendDot, { backgroundColor: colors.brand }]} />
            <Text style={sc.legendLabel}>YOUR GUESS</Text>
          </View>
          <View style={sc.legendItem}>
            <View style={[sc.legendDot, { backgroundColor: colors.accentGreen }]} />
            <Text style={sc.legendLabel}>TARGET ZONE</Text>
          </View>
        </View>
      </Animated.View>

      {/* Clue */}
      <Animated.View style={[sc.clueCard, { opacity: clueO }]}>
        <Text style={sc.clueLabel}>CLUE</Text>
        <Text style={sc.clueText}>"Stephen Curry"</Text>
      </Animated.View>

      {/* Score badge */}
      <Animated.View style={[sc.wavScoreBadge, { opacity: scoreO, transform: [{ scale: scoreS }] }]}>
        <Text style={sc.wavScoreText}>+4 PTS</Text>
        <Text style={sc.wavScoreEmoji}>BULLSEYE!</Text>
      </Animated.View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 6 — Who Am I
// ─────────────────────────────────────────────────────────────────────────────
function Scene6WhoAmI({ opacity }: { opacity: Animated.Value }) {
  const badgeO   = useRef(new Animated.Value(0)).current;
  const headerO  = useRef(new Animated.Value(0)).current;
  const cardY    = useRef(new Animated.Value(60)).current;
  const cardO    = useRef(new Animated.Value(0)).current;
  const btnsO    = useRef(new Animated.Value(0)).current;
  const flashO   = useRef(new Animated.Value(0)).current;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const t = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    t(() => Animated.timing(badgeO, { toValue: 1, duration: 200, useNativeDriver: true }).start(), ts(6, 0));
    t(() => Animated.timing(headerO, { toValue: 1, duration: 200, useNativeDriver: true }).start(), ts(6, 150));
    t(() => Animated.parallel([
      Animated.spring(cardY, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 240 }),
      Animated.timing(cardO, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start(), ts(6, 300));
    t(() => Animated.timing(btnsO, { toValue: 1, duration: 200, useNativeDriver: true }).start(), ts(6, 600));
    // Flash CORRECT at 1.5s
    t(() => {
      Animated.sequence([
        Animated.timing(flashO, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.timing(flashO, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    }, ts(6, 1500));
    return () => timers.current.forEach(clearTimeout);
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, sc.sceneWhoAmI, { opacity }]}>
      <Animated.View style={[sc.gameTagRow, { opacity: badgeO }]}>
        <HelpCircle size={14} color={colors.brand} strokeWidth={2} />
        <Text style={sc.gameTagLabel}>WHO AM I?</Text>
        <View style={sc.leaguePill}><Text style={sc.leaguePillText}>NFL</Text></View>
        <Text style={sc.roundLabel}>SARAH'S TURN</Text>
      </Animated.View>

      {/* Timer + player header */}
      <Animated.View style={[sc.whoHeader, { opacity: headerO }]}>
        <View style={sc.timerRing}>
          <Text style={sc.timerRingNum}>34</Text>
          <Text style={sc.timerRingSec}>SEC</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={sc.whoTurnLabel}>SARAH</Text>
          <Text style={sc.whoTurnSub}>holding phone to forehead</Text>
        </View>
        <View style={[sc.timerRing, { opacity: 0 }]} />
      </Animated.View>

      {/* Athlete card — big, for others to see */}
      <Animated.View style={[sc.whoAthleteCard, { opacity: cardO, transform: [{ translateY: cardY }] }]}>
        <Text style={sc.whoAthleteName}>TOM{'\n'}BRADY</Text>
        <Text style={sc.whoAthleteMeta}>Tampa Bay Buccaneers · QB</Text>
        <Text style={sc.whoAthleteStat}>7× Super Bowl Champion</Text>
      </Animated.View>

      {/* Action buttons */}
      <Animated.View style={[sc.whoButtons, { opacity: btnsO }]}>
        <Pressable style={sc.whoPassBtn}>
          <X size={22} color={colors.white} strokeWidth={2.5} />
          <Text style={sc.whoPassLabel}>PASS</Text>
        </Pressable>
        <Pressable style={sc.whoGotItBtn}>
          <Check size={22} color={colors.white} strokeWidth={2.5} />
          <Text style={sc.whoGotItLabel}>GOT IT</Text>
        </Pressable>
      </Animated.View>

      {/* CORRECT flash overlay */}
      <Animated.View
        style={[sc.correctFlash, { opacity: flashO }]}
        pointerEvents="none"
      >
        <Text style={sc.correctFlashText}>✓ CORRECT!</Text>
      </Animated.View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 7 — CTA
// ─────────────────────────────────────────────────────────────────────────────
function Scene7CTA({ opacity }: { opacity: Animated.Value }) {
  const titleY   = useRef(new Animated.Value(50)).current;
  const titleO   = useRef(new Animated.Value(0)).current;
  const gridO    = useRef(new Animated.Value(0)).current;
  const ctaScale = useRef(new Animated.Value(0.8)).current;
  const ctaO     = useRef(new Animated.Value(0)).current;
  const subO     = useRef(new Animated.Value(0)).current;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const t = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    t(() => Animated.parallel([
      Animated.spring(titleY, { toValue: 0, useNativeDriver: true, damping: 14, stiffness: 200 }),
      Animated.timing(titleO, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start(), ts(7, 100));
    t(() => Animated.timing(gridO, { toValue: 1, duration: 320, useNativeDriver: true }).start(), ts(7, 450));
    t(() => Animated.parallel([
      Animated.spring(ctaScale, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 260 }),
      Animated.timing(ctaO, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start(), ts(7, 850));
    t(() => Animated.timing(subO, { toValue: 1, duration: 280, useNativeDriver: true }).start(), ts(7, 1100));
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const GAME_LABELS = [
    { label: 'POWER PLAY',       icon: <Zap size={12} color={colors.brand} fill={colors.brand} strokeWidth={0} /> },
    { label: 'BLIND RANK 5',     icon: <Trophy size={12} color={colors.brand} strokeWidth={2} /> },
    { label: 'BLIND SHOWDOWN',   icon: <Swords size={12} color={colors.brand} strokeWidth={1.8} /> },
    { label: 'IMPOSTER',         icon: <Eye size={12} color={colors.brand} strokeWidth={2} /> },
    { label: 'WAVELENGTH',       icon: <Activity size={12} color={colors.brand} strokeWidth={2} /> },
    { label: 'WHO AM I?',        icon: <HelpCircle size={12} color={colors.brand} strokeWidth={2} /> },
    { label: 'PLAYER GUESSER',   icon: <Search size={12} color={colors.brand} strokeWidth={2} /> },
    { label: 'DAILY TRIVIA',     icon: <Star size={12} color={colors.brand} strokeWidth={2} /> },
    { label: 'DRAFT W/ FRIENDS', icon: <Users size={12} color={colors.brand} strokeWidth={2} /> },
    { label: '13 WORDS',         icon: <Hash size={12} color={colors.brand} strokeWidth={2} /> },
    { label: 'MYSTERY PLAYER',   icon: <Shuffle size={12} color={colors.brand} strokeWidth={2} /> },
  ];

  return (
    <Animated.View style={[StyleSheet.absoluteFill, sc.center, { opacity }]}>
      <Animated.Text style={[sc.ctaTitle, { opacity: titleO, transform: [{ translateY: titleY }] }]}>
        10+ GAMES.{'\n'}ONE APP.
      </Animated.Text>

      <Animated.View style={[sc.ctaGameGrid, { opacity: gridO }]}>
        {GAME_LABELS.map(({ label, icon }) => (
          <View key={label} style={sc.ctaGameChip}>
            {icon}
            <Text style={sc.ctaGameChipText}>{label}</Text>
          </View>
        ))}
      </Animated.View>

      <Animated.View style={[sc.ctaButtonWrap, { opacity: ctaO, transform: [{ scale: ctaScale }] }]}>
        <View style={sc.ctaButton}>
          <Text style={sc.ctaButtonText}>PLAY YOUR FIRST GAME</Text>
          <ChevronRight size={22} color={colors.white} strokeWidth={2.5} />
        </View>
      </Animated.View>

      <Animated.Text style={[sc.ctaSub, { opacity: subO }]}>
        Free · New content daily · All sports
      </Animated.Text>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root — manages cross-fade timeline across all 8 scenes
// ─────────────────────────────────────────────────────────────────────────────
export default function GameIntro({ onFinish }: Props) {
  const op0 = useRef(new Animated.Value(0)).current;
  const op1 = useRef(new Animated.Value(0)).current;
  const op2 = useRef(new Animated.Value(0)).current;
  const op3 = useRef(new Animated.Value(0)).current;
  const op4 = useRef(new Animated.Value(0)).current;
  const op5 = useRef(new Animated.Value(0)).current;
  const op6 = useRef(new Animated.Value(0)).current;
  const op7 = useRef(new Animated.Value(0)).current;
  const ops = [op0, op1, op2, op3, op4, op5, op6, op7];
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const t = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  useEffect(() => {
    // Scene 0 fades in immediately
    Animated.timing(ops[0], { toValue: 1, duration: CF, useNativeDriver: true }).start();

    // Cross-fade each subsequent scene
    for (let i = 0; i < 7; i++) {
      t(() => {
        Animated.parallel([
          Animated.timing(ops[i],     { toValue: 0, duration: CF, useNativeDriver: true }),
          Animated.timing(ops[i + 1], { toValue: 1, duration: CF, useNativeDriver: true }),
        ]).start();
      }, (i + 1) * SD);
    }

    // Auto-finish after all scenes
    t(onFinish, 8 * SD + 500);

    return () => timers.current.forEach(clearTimeout);
  }, []);

  return (
    <View style={sc.root}>
      <Scene0Welcome      opacity={ops[0]} />
      <Scene1PowerPlay    opacity={ops[1]} />
      <Scene2BlindRank5   opacity={ops[2]} />
      <Scene3BlindShowdown opacity={ops[3]} />
      <Scene4Imposter     opacity={ops[4]} />
      <Scene5Wavelength   opacity={ops[5]} />
      <Scene6WhoAmI       opacity={ops[6]} />
      <Scene7CTA          opacity={ops[7]} />

      <SafeAreaView style={sc.skipSafe} edges={['top']} pointerEvents="box-none">
        <Pressable onPress={onFinish} style={sc.skipBtn} hitSlop={12}>
          <Text style={sc.skipText}>SKIP</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const sc = StyleSheet.create({
  root:   { flex: 1, backgroundColor: dark.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  sceneCol: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 72,
    backgroundColor: dark.background,
  },
  sceneWhoAmI: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 72,
    backgroundColor: dark.background,
  },

  // ── Welcome ──────────────────────────────────────────────────────────────
  burstCircle: {
    position: 'absolute',
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: colors.brand,
  },
  welcomeLabel: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 13,
    color: dark.textSecondary,
    letterSpacing: 4,
    marginBottom: 8,
  },
  mainTitle: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 54,
    color: colors.white,
    letterSpacing: 3,
    textAlign: 'center',
    lineHeight: 58,
  },
  tagline: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 12,
    color: dark.textMuted,
    letterSpacing: 3,
    marginTop: 20,
  },
  gameBadgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 24,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  gameBadge: {
    backgroundColor: colors.brandAlpha15,
    borderWidth: 1,
    borderColor: colors.brandAlpha15,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  gameBadgeText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    color: colors.brand,
    letterSpacing: 1.5,
  },

  // ── Shared game tag row ───────────────────────────────────────────────────
  gameTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  gameTagLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: dark.textSecondary,
    letterSpacing: 2,
    flex: 1,
  },
  leaguePill: {
    backgroundColor: colors.brand,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  leaguePillText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    color: colors.white,
    letterSpacing: 1,
  },
  timerPill: {
    backgroundColor: colors.brandAlpha15,
    borderWidth: 1,
    borderColor: colors.brand,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  timerPillText: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 13,
    color: colors.brand,
  },
  revealProgress: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 11,
    color: dark.textMuted,
    letterSpacing: 1,
  },
  roundLabel: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 11,
    color: dark.textMuted,
    letterSpacing: 1,
  },

  // ── Power Play ────────────────────────────────────────────────────────────
  questionCard: {
    backgroundColor: dark.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.brandAlpha15,
  },
  questionMeta: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 10,
    color: colors.brand,
    letterSpacing: 3,
    marginBottom: 6,
  },
  questionText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    color: colors.white,
    lineHeight: 22,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: dark.card,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 7,
    borderWidth: 1,
    borderColor: dark.cardBorder,
  },
  answerRank: {
    width: 22, height: 22, borderRadius: 6,
    backgroundColor: dark.surface,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 10,
  },
  answerRankText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 12,
    color: dark.textMuted,
  },
  answerName: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 14,
    color: colors.white,
    flex: 1,
  },
  answerPts: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 18,
  },
  answerPtsLabel: {
    fontFamily: fontFamily.regular,
    fontWeight: '400',
    fontSize: 11,
    color: dark.textMuted,
  },
  timerTrack: {
    height: 5,
    backgroundColor: dark.surface,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 10,
  },
  timerFill: {
    height: '100%',
    backgroundColor: colors.brand,
    borderRadius: 3,
  },

  // ── Blind Rank 5 ─────────────────────────────────────────────────────────
  currentRevealCard: {
    backgroundColor: dark.surface,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: colors.brandAlpha15,
    gap: 12,
  },
  currentRevealLeft: { alignItems: 'center' },
  silhouetteAvatar: {
    width: 48, height: 48, borderRadius: 10,
    backgroundColor: dark.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  silhouetteQ: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 22,
    color: dark.textDisabled,
  },
  revealPlayerName: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    color: colors.white,
    marginBottom: 2,
  },
  revealPlayerMeta: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 12,
    color: dark.textMuted,
    marginBottom: 3,
  },
  revealPlayerStat: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 12,
    color: colors.brandMid,
  },
  tapInstruction: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 10,
    color: colors.brand,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 10,
  },
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: dark.background,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: dark.cardBorder,
    gap: 12,
  },
  slotFilled: {
    backgroundColor: dark.card,
    borderColor: dark.cardBorder,
  },
  slotActive: {
    borderColor: colors.brand,
    backgroundColor: colors.brandAlpha15,
  },
  slotNum: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 16,
    color: dark.textDisabled,
    width: 20,
    textAlign: 'center',
  },
  slotName: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 14,
    color: colors.white,
    flex: 1,
  },
  slotTeam: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 12,
    color: dark.textMuted,
  },
  slotEmpty: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 11,
    color: dark.textDisabled,
    letterSpacing: 1.5,
  },

  // ── Blind Showdown ────────────────────────────────────────────────────────
  twoCardsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 14,
  },
  showdownCard: {
    flex: 1,
    backgroundColor: dark.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: dark.cardBorder,
    alignItems: 'center',
  },
  showdownCardLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 10,
    color: colors.brand,
    letterSpacing: 2,
    marginBottom: 10,
  },
  silhouetteMd: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: dark.surface,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: dark.cardBorder,
  },
  showdownStatRow: {
    alignItems: 'center',
    marginBottom: 8,
  },
  showdownStatL: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 9,
    color: dark.textMuted,
    letterSpacing: 1,
    marginBottom: 1,
  },
  showdownStatV: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 17,
    color: colors.white,
  },
  vsCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
    flexShrink: 0,
  },
  vsText: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 11,
    color: colors.white,
    letterSpacing: 1,
  },
  revealOverlay: {
    backgroundColor: dark.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.brandAlpha15,
  },
  revealTitle: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 10,
    color: colors.brand,
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 10,
  },
  revealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  revealNameCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  revealName: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
  },
  revealTeamBadge: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 10,
    color: colors.brand,
    letterSpacing: 2,
  },
  revealVsSep: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 12,
    color: dark.textDisabled,
    letterSpacing: 2,
  },
  voteBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
  },
  votePct: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 14,
    color: colors.white,
    width: 40,
    textAlign: 'right',
  },
  votePctDim: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 14,
    color: dark.textMuted,
    width: 40,
    textAlign: 'right',
  },
  voteTrack: {
    flex: 1, height: 5,
    backgroundColor: dark.surface,
    borderRadius: 3, overflow: 'hidden',
  },
  voteBarA: {
    height: '100%',
    backgroundColor: colors.brand,
    borderRadius: 3,
  },
  voteBarB: {
    height: '100%',
    backgroundColor: dark.surface,
    borderRadius: 3,
  },

  // ── Imposter ──────────────────────────────────────────────────────────────
  passBanner: {
    backgroundColor: colors.brand,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  passBannerLabel: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 11,
    color: dark.textSecondary,
    letterSpacing: 3,
    marginBottom: 2,
  },
  passBannerName: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 22,
    color: colors.white,
    letterSpacing: 2,
  },
  imposterCard: {
    backgroundColor: dark.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: dark.inputBorder,
  },
  imposterCardEmoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  imposterRoleLabel: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 28,
    color: colors.white,
    letterSpacing: 4,
    marginBottom: 16,
  },
  imposterDivider: {
    width: '100%',
    height: 1,
    backgroundColor: dark.tagBg,
    marginBottom: 16,
  },
  imposterAthleteLabel: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 10,
    color: dark.textMuted,
    letterSpacing: 3,
    marginBottom: 6,
  },
  imposterAthleteName: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 24,
    color: colors.white,
    marginBottom: 4,
  },
  imposterAthleteTeam: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 14,
    color: dark.textMuted,
  },
  imposterHint: {
    marginTop: 16,
    backgroundColor: colors.brandAlpha15,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.brandAlpha15,
    width: '100%',
  },
  imposterHintLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 9,
    color: colors.brand,
    letterSpacing: 3,
    marginBottom: 3,
  },
  imposterHintText: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 12,
    color: dark.textSecondary,
    textAlign: 'center',
  },

  // ── Wavelength ────────────────────────────────────────────────────────────
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  axisLeft: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 11,
    color: dark.textMuted,
  },
  axisRight: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 11,
    color: dark.textMuted,
  },
  dialContainer: {
    marginBottom: 16,
  },
  dialTrack: {
    height: 44,
    backgroundColor: dark.card,
    borderRadius: 8,
    position: 'relative',
    overflow: 'visible',
    borderWidth: 1,
    borderColor: dark.cardBorder,
  },
  dialTargetZone: {
    position: 'absolute',
    top: 0, bottom: 0,
    backgroundColor: darkColors.successBg,
    borderRadius: 4,
  },
  dialNeedle: {
    position: 'absolute',
    top: 6, bottom: 6,
    width: 4, borderRadius: 2,
    backgroundColor: colors.brand,
  },
  dialLegend: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8, height: 8, borderRadius: 4,
  },
  legendLabel: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 10,
    color: dark.textMuted,
    letterSpacing: 1,
  },
  clueCard: {
    backgroundColor: dark.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: dark.cardBorder,
    marginBottom: 14,
  },
  clueLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 9,
    color: dark.textMuted,
    letterSpacing: 3,
    marginBottom: 4,
  },
  clueText: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 24,
    color: brand.teal,
  },
  wavScoreBadge: {
    alignSelf: 'center',
    backgroundColor: darkColors.successBg,
    borderWidth: 1.5,
    borderColor: colors.accentGreen,
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 28,
    alignItems: 'center',
    gap: 2,
  },
  wavScoreText: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 24,
    color: colors.accentGreen,
  },
  wavScoreEmoji: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: dark.textMuted,
  },

  // ── Who Am I ──────────────────────────────────────────────────────────────
  whoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  timerRing: {
    width: 70, height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerRingNum: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 24,
    color: colors.white,
    lineHeight: 26,
  },
  timerRingSec: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 9,
    color: colors.brand,
    letterSpacing: 1,
  },
  whoTurnLabel: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 20,
    color: colors.white,
    letterSpacing: 2,
  },
  whoTurnSub: {
    fontFamily: fontFamily.regular,
    fontWeight: '400',
    fontSize: 11,
    color: dark.textMuted,
    marginTop: 2,
  },
  whoAthleteCard: {
    flex: 1,
    backgroundColor: dark.card,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: colors.brandAlpha15,
    paddingVertical: 24,
  },
  whoAthleteName: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 52,
    color: colors.white,
    letterSpacing: 3,
    textAlign: 'center',
    lineHeight: 56,
    marginBottom: 16,
  },
  whoAthleteMeta: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    color: dark.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  whoAthleteStat: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 18,
    color: colors.brand,
    textAlign: 'center',
  },
  whoButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  whoPassBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accentRed,
    borderRadius: 14,
    paddingVertical: 16,
  },
  whoPassLabel: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 16,
    color: colors.white,
    letterSpacing: 2,
  },
  whoGotItBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accentGreen,
    borderRadius: 14,
    paddingVertical: 16,
  },
  whoGotItLabel: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 16,
    color: colors.white,
    letterSpacing: 2,
  },
  correctFlash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.accentGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
  },
  correctFlashText: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 48,
    color: colors.white,
    letterSpacing: 2,
  },

  // ── CTA ────────────────────────────────────────────────────────────────────
  ctaTitle: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 52,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 56,
    letterSpacing: 2,
    marginBottom: 32,
  },
  ctaGameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 36,
  },
  ctaGameChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.brandAlpha15,
    borderWidth: 1,
    borderColor: colors.brandAlpha15,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  ctaGameChipText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    color: colors.brand,
    letterSpacing: 1,
  },
  ctaButtonWrap: { width: '100%', marginBottom: 16 },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.brand,
    borderRadius: 16,
    paddingVertical: 20,
  },
  ctaButtonText: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 18,
    color: colors.white,
    letterSpacing: 2,
  },
  ctaSub: {
    fontFamily: fontFamily.regular,
    fontWeight: '400',
    fontSize: 12,
    color: dark.textMuted,
    letterSpacing: 2,
  },

  // ── Skip ──────────────────────────────────────────────────────────────────
  skipSafe: {
    position: 'absolute', top: 0, right: 0, left: 0,
  },
  skipBtn: {
    alignSelf: 'flex-end',
    marginRight: spacing.lg,
    marginTop: spacing.md,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: dark.tagBg,
  },
  skipText: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 12,
    color: dark.textSecondary,
    letterSpacing: 2,
  },
});
