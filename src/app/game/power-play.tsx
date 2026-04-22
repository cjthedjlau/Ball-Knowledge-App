import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Zap } from 'lucide-react-native';
import MidnightCountdown from '../../components/MidnightCountdown';
import { brand, dark, light, fonts, colors, darkColors, fontFamily, spacing, radius } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import { type Tab } from '../components/ui/BottomNav';
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';
import { getTodaysDailyGame, getArchiveGame } from '../../lib/dailyGames';
import { saveGameResult as saveXPResult, updateUserXPAndStreak } from '../../lib/xp';
import {
  saveGameResult as saveCompletionResult,
  getGameResultToday,
  getTodayEST,
} from '../../lib/gameResults';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';
import { updatePlayHour } from '../../lib/notifications';
import { sharePowerPlay } from '../../lib/shareResults';
import { useGameAnalytics } from '../../lib/analytics';

// ── Types ──────────────────────────────────────────────────────────────────────

interface PowerPlayAnswer {
  text: string;
  points: number;
  aliases?: string[];
}

interface PowerPlayQuestion {
  text: string;
  answers: PowerPlayAnswer[];
}

interface PowerPlayData {
  league: string;
  questions: PowerPlayQuestion[];
}

interface Props {
  onBack: () => void;
  onNavigate: (tab: Tab) => void;
  archiveDate?: string;
}

type Phase = 'loading' | 'intro' | 'playing' | 'results';

// ── Constants ──────────────────────────────────────────────────────────────────

const TOTAL_TIME = 60;
const WIN_SCORE = 125;
const NUM_QUESTIONS = 5;

// ── Answer matching ────────────────────────────────────────────────────────────

function normalizeText(s: string): string {
  return s.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
}

function matchAnswer(
  userInput: string,
  answers: PowerPlayAnswer[],
): { points: number; matchedAnswer: string } {
  const norm = normalizeText(userInput);
  if (!norm) return { points: 0, matchedAnswer: '' };

  // Score each answer candidate — highest-scoring match wins (avoids short false positives)
  let bestMatch = { points: 0, matchedAnswer: '', quality: 0 };

  for (const answer of answers) {
    const candidates = [answer.text, ...(answer.aliases ?? [])];
    for (const candidate of candidates) {
      const candNorm = normalizeText(candidate);
      let quality = 0;

      // 1. Exact match — best possible
      if (candNorm === norm) {
        quality = 100;
      }
      // 2. Candidate is fully contained in user input or vice versa
      //    The shorter string must be at least 50% the length of the longer one
      //    to prevent "trade" matching "trade deadline drama"
      else if (norm.length >= 3 && candNorm.includes(norm)) {
        const ratio = norm.length / candNorm.length;
        if (ratio >= 0.5) quality = 80 * ratio;
      } else if (candNorm.length >= 3 && norm.includes(candNorm)) {
        const ratio = candNorm.length / norm.length;
        if (ratio >= 0.5) quality = 80 * ratio;
      }

      // 3. Multi-word overlap — user and candidate share most of their meaningful words
      //    (for short 1-2 word answers this is very effective)
      if (quality === 0) {
        const candWords = candNorm.split(' ').filter(w => w.length >= 2);
        const userWords = norm.split(' ').filter(w => w.length >= 2);
        if (candWords.length > 0 && userWords.length > 0) {
          const matchedWords = userWords.filter(uw =>
            candWords.some(cw => cw === uw || (cw.length >= 4 && uw.length >= 4 && (cw.startsWith(uw) || uw.startsWith(cw)))),
          );
          const overlapRatio = matchedWords.length / Math.max(candWords.length, userWords.length);
          // Require at least 50% word overlap and at least one matched word
          if (matchedWords.length >= 1 && overlapRatio >= 0.5) {
            quality = 60 * overlapRatio;
          }
        }
      }

      if (quality > bestMatch.quality) {
        bestMatch = { points: answer.points, matchedAnswer: answer.text, quality };
      }
    }
  }

  // Only accept matches above a minimum quality threshold
  if (bestMatch.quality >= 30) {
    return { points: bestMatch.points, matchedAnswer: bestMatch.matchedAnswer };
  }
  return { points: 0, matchedAnswer: '' };
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function PowerPlayScreen({ onBack, archiveDate }: Props) {
  const isArchive = !!archiveDate;
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const s = createStyles(isDark);
  const { trackGameStart, trackPowerPlayScore, trackGameAbandoned } = useGameAnalytics();
  const [selectedLeague, setSelectedLeague] = useState('NBA');
  const [phase, setPhase] = useState<Phase>('loading');
  const [gameData, setGameData] = useState<PowerPlayData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [alreadyPlayed, setAlreadyPlayed] = useState<{ score: number; xp: number } | null>(null);

  // Playing state
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(['', '', '', '', '']);
  const [lockedIn, setLockedIn] = useState<boolean[]>([false, false, false, false, false]);
  const [passed, setPassed] = useState<boolean[]>([false, false, false, false, false]);
  const [currentInput, setCurrentInput] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Results state
  const [matchResults, setMatchResults] = useState<{ points: number; matchedAnswer: string }[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  // Animations
  const timerBarWidth = useRef(new Animated.Value(1)).current;
  const questionSlide = useRef(new Animated.Value(0)).current;
  const rowFlash = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    trackGameStart('power-play', selectedLeague);
  }, [selectedLeague]);

  // ── Load game data ──────────────────────────────────────────────────────────

  useEffect(() => {
    setPhase('loading');
    setLoadError(false);
    setGameData(null);
    setCurrentQ(0);
    setUserAnswers(['', '', '', '', '']);
    setLockedIn([false, false, false, false, false]);
    setPassed([false, false, false, false, false]);
    setCurrentInput('');
    setTimeRemaining(TOTAL_TIME);
    setMatchResults([]);
    setRevealedCount(0);
    setAlreadyPlayed(null);
    timerBarWidth.setValue(1);

    const fetchGame = isArchive
      ? getArchiveGame(selectedLeague, archiveDate!)
      : getTodaysDailyGame(selectedLeague);

    const checkCompletion = isArchive
      ? Promise.resolve(null)
      : getGameResultToday(selectedLeague, 'power-play');

    // Also check local AsyncStorage (works for guests + offline)
    const localKey = `power-play-done-${getTodayEST()}-${selectedLeague}`;
    const checkLocal = isArchive
      ? Promise.resolve(null)
      : AsyncStorage.getItem(localKey).then(v => v ? JSON.parse(v) : null).catch(() => null);

    void Promise.all([fetchGame, checkCompletion, checkLocal]).then(([data, priorResult, localResult]) => {
      const completed = priorResult ?? localResult;
      if (completed) {
        setAlreadyPlayed(completed);
        setPhase('intro');
        return;
      }
      if (!data?.power_play) {
        setLoadError(true);
        setPhase('intro');
        return;
      }
      setGameData(data.power_play as PowerPlayData);
      setPhase('intro');
    });
  }, [selectedLeague]);

  // ── Timer ───────────────────────────────────────────────────────────────────

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    Animated.timing(timerBarWidth, {
      toValue: 0,
      duration: timeRemaining * 1000,
      useNativeDriver: false,
    }).start();
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [timeRemaining, stopTimer]);

  useEffect(() => {
    if (timeRemaining === 0 && phase === 'playing') {
      handleFinishGame();
    }
  }, [timeRemaining, phase]);

  useEffect(() => {
    return () => stopTimer();
  }, []);

  // ── Game logic ──────────────────────────────────────────────────────────────

  function handleStartGame() {
    setPhase('playing');
    setTimeout(() => {
      startTimer();
      inputRef.current?.focus();
    }, 300);
  }

  function slideToNextQuestion(nextIndex: number) {
    questionSlide.setValue(40);
    Animated.timing(questionSlide, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
    setCurrentQ(nextIndex);
    setCurrentInput('');
    setTimeout(() => inputRef.current?.focus(), 250);
  }

  /** Find the next unlocked question index after `from`. Returns -1 if none remain. */
  function findNextUnlocked(from: number, locked: boolean[]): number {
    // First: look forward from `from + 1`
    for (let i = from + 1; i < NUM_QUESTIONS; i++) {
      if (!locked[i]) return i;
    }
    // Then: wrap around from the start (for passed questions)
    for (let i = 0; i < from; i++) {
      if (!locked[i]) return i;
    }
    return -1;
  }

  function handleLockIn() {
    const answer = currentInput.trim();
    const newAnswers = [...userAnswers];
    newAnswers[currentQ] = answer;
    const newLocked = [...lockedIn];
    newLocked[currentQ] = true;

    setUserAnswers(newAnswers);
    setLockedIn(newLocked);

    const next = findNextUnlocked(currentQ, newLocked);
    if (next === -1) {
      // All questions answered
      stopTimer();
      finishWithAnswers(newAnswers);
    } else {
      slideToNextQuestion(next);
    }
  }

  function handlePass() {
    // Mark as passed (skipped) but NOT locked — we'll come back to it
    const newPassed = [...passed];
    newPassed[currentQ] = true;
    setPassed(newPassed);

    // Look for the next unlocked question that isn't the current one
    const newLocked = [...lockedIn];
    const next = findNextUnlocked(currentQ, newLocked);

    if (next === -1) {
      // Every other question is locked — this passed one is the only one left.
      // Lock it with empty answer and finish.
      const newAnswers = [...userAnswers];
      newAnswers[currentQ] = '';
      newLocked[currentQ] = true;
      setUserAnswers(newAnswers);
      setLockedIn(newLocked);
      stopTimer();
      finishWithAnswers(newAnswers);
    } else {
      slideToNextQuestion(next);
    }
  }

  function handleFinishGame() {
    // Timer ran out — lock any remaining unlocked questions with empty answers
    const finalAnswers = [...userAnswers];
    for (let i = 0; i < NUM_QUESTIONS; i++) {
      if (!lockedIn[i]) finalAnswers[i] = '';
    }
    finishWithAnswers(finalAnswers);
  }

  function finishWithAnswers(answers: string[]) {
    if (!gameData) return;
    stopTimer();

    const results = answers.map((ans, i) =>
      matchAnswer(ans, gameData.questions[i]?.answers ?? []),
    );
    const score = results.reduce((sum, r) => sum + r.points, 0);
    const xp = 500 + score * 5;

    setMatchResults(results);
    setTotalScore(score);
    setXpEarned(xp);
    setPhase('results');
    trackPowerPlayScore(selectedLeague, score, score >= WIN_SCORE);

    // Persist result
    if (!isArchive) {
      // Save locally first — guarantees no replay even for guests/offline
      const localKey = `power-play-done-${getTodayEST()}-${selectedLeague}`;
      void AsyncStorage.setItem(localKey, JSON.stringify({ score, xp }));

      void (async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          await saveXPResult(user.id, 'power-play', xp, score);
          await updateUserXPAndStreak(user.id, xp, true);
        }
      })();
      void saveCompletionResult(selectedLeague, 'power-play', score, xp);
      void updatePlayHour();
    }

    // Sequential reveal animation
    rowFlash.forEach(v => v.setValue(0));
    results.forEach((_, i) => {
      setTimeout(() => {
        setRevealedCount(i + 1);
        Animated.sequence([
          Animated.timing(rowFlash[i], { toValue: 1, duration: 150, useNativeDriver: true }),
          Animated.timing(rowFlash[i], { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start();
      }, i * 700 + 400);
    });
  }

  // ── Render helpers ──────────────────────────────────────────────────────────

  function renderLoading() {
    return (
      <View style={s.centerState}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  function renderIntro() {
    if (alreadyPlayed) {
      return (
        <View style={s.alreadyPlayedCard}>
          <Text style={s.alreadyBadge}>ALREADY PLAYED TODAY</Text>
          <Text style={s.alreadyScore}>{alreadyPlayed.score}</Text>
          <Text style={s.alreadyScoreLabel}>pts scored today</Text>
          <View style={s.alreadyDivider} />
          <View style={s.alreadyXpRow}>
            <Text style={s.alreadyXpLabel}>XP EARNED</Text>
            <Text style={s.alreadyXp}>+{alreadyPlayed.xp}</Text>
          </View>
          <Text style={s.alreadyCta}>COME BACK TOMORROW</Text>
          <Text style={s.alreadySub}>
            A new Power Play drops every day. Switch leagues to keep playing.
          </Text>
          <MidnightCountdown />
        </View>
      );
    }

    if (loadError || !gameData) {
      return (
        <View style={s.centerState}>
          <Text style={s.errorText}>No Power Play available today</Text>
          <Text style={s.errorSub}>Check back tomorrow or switch leagues</Text>
        </View>
      );
    }

    return (
      <View style={s.introCard}>
        <View style={s.introIconWrap}>
          <Zap size={36} color={colors.brand} strokeWidth={2} />
        </View>
        <Text style={s.introTitle}>HOW IT WORKS</Text>
        <View style={s.introRules}>
          <Text style={s.introRule}>• 5 survey-style questions</Text>
          <Text style={s.introRule}>• 60 seconds on the clock</Text>
          <Text style={s.introRule}>• Match the top answers to score points</Text>
          <Text style={s.introRule}>• Each question is worth up to 100 pts</Text>
        </View>
        <Pressable
          style={({ pressed }) => [s.startBtn, pressed && s.startBtnPressed]}
          onPress={handleStartGame}
        >
          <Text style={s.startBtnText}>LET'S PLAY</Text>
        </Pressable>
      </View>
    );
  }

  function renderPlaying() {
    if (!gameData) return null;
    const question = gameData.questions[currentQ];

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={s.playingWrap}
        keyboardVerticalOffset={0}
      >
        {/* Timer bar */}
        <View style={s.timerBarTrack}>
          <Animated.View
            style={[
              s.timerBarFill,
              { flex: timerBarWidth },
            ]}
          />
        </View>

        {/* Timer number + question counter */}
        <View style={s.timerRow}>
          <Text style={s.questionCounter}>
            Q{currentQ + 1} <Text style={s.questionCounterOf}>of {NUM_QUESTIONS}</Text>
          </Text>
          <View
            style={[
              s.timerBadge,
              timeRemaining <= 15 && s.timerBadgeUrgent,
            ]}
          >
            <Text style={[s.timerNum, timeRemaining <= 15 && s.timerNumUrgent]}>
              {timeRemaining}
            </Text>
          </View>
        </View>

        {/* Question */}
        <Animated.View
          style={[
            s.questionWrap,
            { transform: [{ translateY: questionSlide }] },
          ]}
        >
          {passed[currentQ] && (
            <Text style={s.passedBadge}>PASSED — ANSWER NOW</Text>
          )}
          <Text style={s.questionText}>{question?.text ?? ''}</Text>
        </Animated.View>

        {/* Input */}
        <View style={s.inputWrap}>
          <TextInput
            ref={inputRef}
            style={s.answerInput}
            value={currentInput}
            onChangeText={setCurrentInput}
            placeholder="Type your answer..."
            placeholderTextColor={dark.textSecondary}
            returnKeyType="done"
            onSubmitEditing={currentInput.trim() ? handleLockIn : handlePass}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        {/* Buttons */}
        <View style={s.actionRow}>
          <Pressable
            style={({ pressed }) => [s.passBtn, pressed && s.passBtnPressed]}
            onPress={handlePass}
          >
            <Text style={s.passBtnText}>PASS</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              s.lockInBtn,
              !currentInput.trim() && s.lockInBtnDisabled,
              pressed && currentInput.trim() && s.lockInBtnPressed,
            ]}
            onPress={handleLockIn}
            disabled={!currentInput.trim()}
          >
            <Text style={s.lockInBtnText}>LOCK IN</Text>
          </Pressable>
        </View>

        {/* Question dots */}
        <View style={s.dotsRow}>
          {Array.from({ length: NUM_QUESTIONS }).map((_, i) => (
            <View
              key={i}
              style={[
                s.dot,
                i === currentQ && s.dotActive,
                lockedIn[i] && s.dotLocked,
                !lockedIn[i] && passed[i] && s.dotPassed,
              ]}
            />
          ))}
        </View>
      </KeyboardAvoidingView>
    );
  }

  function renderResults() {
    if (!gameData) return null;
    const hitWin = totalScore >= WIN_SCORE;

    return (
      <ScrollView
        style={s.resultsScroll}
        contentContainerStyle={[s.resultsContent, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Score header */}
        <View style={s.scoreHeader}>
          {hitWin && (
            <View style={s.winBanner}>
              <Zap size={16} color={colors.white} strokeWidth={2} fill={colors.white} />
              <Text style={s.winBannerText}>YOU WIN!</Text>
              <Zap size={16} color={colors.white} strokeWidth={2} fill={colors.white} />
            </View>
          )}
          <Text style={s.scoreLabel}>FINAL SCORE</Text>
          <Text style={[s.scoreBig, hitWin && s.scoreBigHit]}>
            {totalScore}
          </Text>
        </View>

        {/* Question results */}
        <View style={s.resultsList}>
          {gameData.questions.map((q, i) => {
            const revealed = i < revealedCount;
            const result = matchResults[i];
            const pts = result?.points ?? 0;
            const matched = result?.matchedAnswer ?? '';

            return (
              <Animated.View
                key={i}
                style={[
                  s.resultRow,
                  revealed && pts > 0 && s.resultRowHit,
                  revealed && pts === 0 && s.resultRowMiss,
                  { opacity: rowFlash[i].interpolate({ inputRange: [0, 1], outputRange: [1, 0.3] }) },
                ]}
              >
                <View style={s.resultLeft}>
                  <Text style={s.resultQNum}>Q{i + 1}</Text>
                  <View style={s.resultTextCol}>
                    <Text style={s.resultQuestion} numberOfLines={1}>{q.text}</Text>
                    {revealed ? (
                      <>
                        <Text style={[s.resultUserAnswer, pts > 0 && s.resultUserAnswerHit]}>
                          {userAnswers[i] || '— no answer —'}
                        </Text>
                        {pts > 0 && matched && (
                          <Text style={s.resultMatchedLabel}>✓ {matched}</Text>
                        )}
                      </>
                    ) : (
                      <View style={s.resultPlaceholder} />
                    )}
                  </View>
                </View>
                {revealed && (
                  <View style={[s.resultPtsBadge, pts > 0 && s.resultPtsBadgeHit]}>
                    <Text style={[s.resultPts, pts > 0 && s.resultPtsHit]}>
                      {pts > 0 ? `+${pts}` : '0'}
                    </Text>
                  </View>
                )}
              </Animated.View>
            );
          })}
        </View>

        {/* Top answers reveal (after all revealed) */}
        {revealedCount === NUM_QUESTIONS && (
          <View style={s.topAnswersSection}>
            <Text style={s.topAnswersTitle}>TOP ANSWERS</Text>
            {gameData.questions.map((q, i) => (
              <View key={i} style={s.topAnswersCard}>
                <Text style={s.topAnswersQText} numberOfLines={2}>{q.text}</Text>
                {q.answers.slice(0, 3).map((ans, j) => (
                  <View key={j} style={s.topAnswerRow}>
                    <Text style={s.topAnswerRank}>{j + 1}</Text>
                    <Text style={s.topAnswerText}>{ans.text}</Text>
                    <Text style={s.topAnswerPts}>{ans.points}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* XP card */}
        {revealedCount === NUM_QUESTIONS && !isArchive && (
          <View style={s.xpCard}>
            <Text style={s.xpCardLabel}>XP EARNED</Text>
            <Text style={s.xpCardTotal}>+{xpEarned}</Text>
            <Text style={s.xpCardBreakdown}>
              500 base + {totalScore} pts × 5
            </Text>
          </View>
        )}

        {isArchive && revealedCount === NUM_QUESTIONS && (
          <Text style={s.archiveNotice}>ARCHIVE MODE — Results not saved</Text>
        )}

        {!isArchive && revealedCount === NUM_QUESTIONS && (
          <MidnightCountdown />
        )}

        {revealedCount === NUM_QUESTIONS && (
          <Pressable
            style={({ pressed }) => [s.shareBtn, pressed && s.shareBtnPressed]}
            onPress={() =>
              sharePowerPlay(
                selectedLeague,
                totalScore,
                WIN_SCORE,
                matchResults.filter(r => r.points > 0).length,
                NUM_QUESTIONS,
              )
            }
          >
            <Text style={s.shareBtnText}>SHARE RESULTS</Text>
          </Pressable>
        )}


        {revealedCount === NUM_QUESTIONS && (
          <Pressable
            style={({ pressed }) => [s.doneBtn, pressed && s.doneBtnPressed]}
            onPress={onBack}
          >
            <Text style={s.doneBtnText}>DONE</Text>
          </Pressable>
        )}
      </ScrollView>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────

  return (
    <View style={s.root}>
      {/* Coral fill behind status bar */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top, backgroundColor: brand.primary, zIndex: 0 }} />
      {/* Zone 1 */}
      <View style={[s.zone1, { paddingTop: insets.top + 16 }]}>
        <View style={s.zone1TopRow}>
          <Pressable onPress={() => { if (phase === 'playing') trackGameAbandoned('power-play', selectedLeague); onBack(); }} hitSlop={8} style={s.backBtn}>
            <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
          </Pressable>
        </View>
        <View style={s.zone1Center}>
          <View style={s.zone1TitleRow}>
            <Zap size={20} color={colors.white} strokeWidth={2} fill={colors.white} />
            <Text style={s.zone1Title}>POWER PLAY</Text>
          </View>
          <Text style={s.zone1Sub}>Fast Money · Score 125+ to win</Text>
        </View>
        {isArchive ? (
          <View style={s.archiveBanner}>
            <Text style={s.archiveBannerText}>ARCHIVE — {archiveDate}</Text>
          </View>
        ) : (
          <View style={s.switcherRow}>
            <LeagueSwitcher selected={selectedLeague} onChange={setSelectedLeague} />
          </View>
        )}
      </View>

      {/* Zone 2 */}
      <View style={s.zone2}>
        {phase === 'loading' && renderLoading()}
        {phase === 'intro' && renderIntro()}
        {phase === 'playing' && renderPlaying()}
        {phase === 'results' && renderResults()}
      </View>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
// Power Play keeps a dramatic dark card style regardless of light/dark mode (game show feel).
// All game-board colors use dark.* tokens directly.

function createStyles(_isDark: boolean) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // Zone 1
  zone1: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  zone1TopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  backBtn: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
  },
  zone1Center: {
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  zone1TitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  zone1Title: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 24,
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  zone1Sub: {
    fontFamily: fonts.bodyMedium,
    fontWeight: '500',
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 4,
  },
  switcherRow: {
    marginTop: spacing.xs,
  },
  archiveBanner: {
    marginTop: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.20)',
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  archiveBannerText: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '700',
    fontSize: 11,
    color: 'rgba(255,255,255,0.80)',
    letterSpacing: 1.5,
  },

  // Zone 2
  zone2: {
    flex: 1,
    
  },

  // Loading / error
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: spacing.lg,
  },
  errorText: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '700',
    fontSize: 16,
    color: darkColors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  errorSub: {
    fontFamily: fonts.bodyMedium,
    fontWeight: '500',
    fontSize: 14,
    color: darkColors.textSecondary,
    textAlign: 'center',
  },

  // Intro
  introCard: {
    flex: 1,
    marginHorizontal: spacing.lg,
    marginTop: spacing['3xl'],
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 24,
    padding: spacing['3xl'],
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
  },
  introIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(252,52,92,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  introTitle: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 13,
    color: brand.primary,
    letterSpacing: 2,
    marginBottom: spacing.lg,
  },
  introRules: {
    width: '100%',
    gap: spacing.md,
    marginBottom: spacing['3xl'],
  },
  introRule: {
    fontFamily: fonts.bodyMedium,
    fontWeight: '500',
    fontSize: 15,
    color: darkColors.text,
    lineHeight: 22,
  },
  startBtn: {
    backgroundColor: brand.primary,
    borderRadius: 16,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['4xl'],
    alignItems: 'center',
  },
  startBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  startBtnText: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: 2,
  },

  // Already played
  alreadyPlayedCard: {
    flex: 1,
    marginHorizontal: spacing.lg,
    marginTop: spacing['3xl'],
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 24,
    padding: spacing['3xl'],
    alignItems: 'center',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
  },
  alreadyBadge: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 2,
    color: brand.primary,
    textAlign: 'center',
  },
  alreadyScore: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 56,
    color: '#FFFFFF',
    lineHeight: 60,
  },
  alreadyScoreLabel: {
    fontFamily: fonts.bodyMedium,
    fontWeight: '500',
    fontSize: 14,
    color: darkColors.textSecondary,
  },
  alreadyDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: spacing.xs,
  },
  alreadyXpRow: {
    alignItems: 'center',
  },
  alreadyXpLabel: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 2,
    color: darkColors.textSecondary,
  },
  alreadyXp: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 32,
    color: brand.primary,
    lineHeight: 38,
  },
  alreadyCta: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 2,
    textAlign: 'center',
  },
  alreadySub: {
    fontFamily: fonts.bodyMedium,
    fontWeight: '500',
    fontSize: 13,
    color: darkColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Playing
  playingWrap: {
    paddingBottom: 120,
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'],
  },
  timerBarTrack: {
    height: 4,
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 2,
    
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  timerBarFill: {
    height: 4,
    backgroundColor: 'transparent',
    borderRadius: 2,
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  questionCounter: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 22,
    color: darkColors.text,
    letterSpacing: 1,
  },
  questionCounterOf: {
    fontFamily: fonts.bodyMedium,
    fontWeight: '500',
    fontSize: 16,
    color: darkColors.textSecondary,
    letterSpacing: 0,
  },
  timerBadge: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    minWidth: 52,
    alignItems: 'center',
  },
  timerBadgeUrgent: {
    backgroundColor: 'rgba(252,52,92,0.15)',
    borderColor: brand.primary,
  },
  timerNum: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 22,
    color: darkColors.text,
  },
  timerNumUrgent: {
    color: brand.primary,
  },
  questionWrap: {
    marginBottom: spacing['2xl'],
    minHeight: 80,
  },
  questionText: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '700',
    fontSize: 20,
    color: darkColors.text,
    lineHeight: 28,
  },
  inputWrap: {
    marginBottom: spacing.lg,
  },
  answerInput: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    fontFamily: fonts.bodySemiBold,
    fontWeight: '700',
    fontSize: 18,
    color: darkColors.text,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  passBtn: {
    flex: 1,
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 14,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  passBtnPressed: {
    opacity: 0.7,
  },
  passBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '700',
    fontSize: 15,
    color: darkColors.textSecondary,
    letterSpacing: 1,
  },
  lockInBtn: {
    flex: 2,
    backgroundColor: 'transparent',
    borderRadius: 14,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  lockInBtnDisabled: {
    opacity: 0.35,
  },
  lockInBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  lockInBtnText: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: darkColors.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  dotActive: {
    backgroundColor: 'transparent',
    borderColor: brand.primary,
  },
  dotLocked: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderColor: 'rgba(255,255,255,0.25)',
  },
  dotPassed: {
    backgroundColor: 'transparent',
    borderColor: brand.primary,
    borderWidth: 2,
  },
  passedBadge: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '700',
    fontSize: 11,
    color: brand.primary,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },

  // Results
  resultsScroll: {
    flex: 1,
  },
  resultsContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['3xl'],
    paddingBottom: 0,
  },
  scoreHeader: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  scoreLabel: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '700',
    fontSize: 11,
    color: darkColors.textSecondary,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  scoreBig: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 72,
    color: darkColors.text,
    lineHeight: 76,
  },
  scoreBigHit: {
    color: brand.primary,
  },
  winBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  winBannerText: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  resultsList: {
    gap: spacing.sm,
    marginBottom: spacing['2xl'],
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  resultRowHit: {
    borderColor: 'rgba(0,200,151,0.30)',
    backgroundColor: 'rgba(0,200,151,0.08)',
  },
  resultRowMiss: {
    borderColor: 'rgba(255,255,255,0.04)',
    opacity: 0.7,
  },
  resultLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  resultQNum: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 13,
    color: brand.primary,
    letterSpacing: 0.5,
    marginTop: 2,
    minWidth: 20,
  },
  resultTextCol: {
    flex: 1,
  },
  resultQuestion: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '700',
    fontSize: 12,
    color: darkColors.textSecondary,
    marginBottom: 2,
    lineHeight: 17,
  },
  resultUserAnswer: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '700',
    fontSize: 15,
    color: darkColors.text,
    lineHeight: 20,
  },
  resultUserAnswerHit: {
    color: colors.accentGreen,
  },
  resultMatchedLabel: {
    fontFamily: fonts.bodyMedium,
    fontWeight: '500',
    fontSize: 12,
    color: colors.accentGreen,
    marginTop: 2,
  },
  resultPlaceholder: {
    height: 16,
    width: '60%',
    backgroundColor: darkColors.surface,
    borderRadius: 4,
    marginTop: 2,
  },
  resultPtsBadge: {
    minWidth: 44,
    height: 36,
    borderRadius: 10,
    backgroundColor: darkColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  resultPtsBadgeHit: {
    backgroundColor: 'rgba(0,200,151,0.15)',
  },
  resultPts: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 17,
    color: darkColors.textSecondary,
  },
  resultPtsHit: {
    color: colors.accentGreen,
  },
  topAnswersSection: {
    marginBottom: spacing['2xl'],
    gap: spacing.md,
  },
  topAnswersTitle: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '700',
    fontSize: 11,
    color: darkColors.textSecondary,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  topAnswersCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 14,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.3)',
  },
  topAnswersQText: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '700',
    fontSize: 13,
    color: darkColors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 19,
  },
  topAnswerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    gap: spacing.md,
  },
  topAnswerRank: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 13,
    color: brand.primary,
    width: 16,
    textAlign: 'center',
  },
  topAnswerText: {
    flex: 1,
    fontFamily: fonts.bodySemiBold,
    fontWeight: '700',
    fontSize: 14,
    color: darkColors.text,
  },
  topAnswerPts: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 14,
    color: darkColors.textSecondary,
  },
  xpCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 20,
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    marginBottom: spacing['2xl'],
  },
  xpCardLabel: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '700',
    fontSize: 13,
    color: darkColors.textSecondary,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  xpCardTotal: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 48,
    color: brand.primary,
    lineHeight: 54,
  },
  xpCardBreakdown: {
    fontFamily: fonts.bodyMedium,
    fontWeight: '500',
    fontSize: 13,
    color: darkColors.textSecondary,
    marginTop: spacing.xs,
  },
  archiveNotice: {
    fontFamily: fonts.bodyMedium,
    fontWeight: '500',
    fontSize: 13,
    color: darkColors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: spacing['2xl'],
  },
  doneBtn: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  doneBtnPressed: {
    opacity: 0.7,
  },
  doneBtnText: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 15,
    color: darkColors.textSecondary,
    letterSpacing: 2,
  },
  shareBtn: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: spacing.md,
  },
  shareBtnPressed: {
    opacity: 0.7,
  },
  shareBtnText: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  });
}

const styles = createStyles(true);
