import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Check, X, Film } from 'lucide-react-native';
import MidnightCountdown from '../../components/MidnightCountdown';
import { brand, dark, light, fonts, colors, darkColors, fontFamily, spacing, radius } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';
import PrimaryButton from '../../screens/components/ui/PrimaryButton';
import GhostButton from '../../screens/components/ui/GhostButton';
import { type Tab } from '../components/ui/BottomNav';
import { calculateDailyGameXP, saveGameResult, updateUserXPAndStreak } from '../../lib/xp';
import { shareTrivia } from '../../lib/shareResults';
import { supabase } from '../../lib/supabase';
import { getTodaysDailyGame, getArchiveGame } from '../../lib/dailyGames';
import { saveGameResult as saveCompletionResult, getGameResultToday, getTodayEST } from '../../lib/gameResults';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updatePlayHour } from '../../lib/notifications';
import { useGameAnalytics } from '../../lib/analytics';
import { useRewardedAd } from '../../components/ads/useRewardedAd';

// ── Types ────────────────────────────────────────────────────────────────────

type TierLabel = '100%' | '75%' | '50%' | '25%' | '1%';

interface MultipleChoiceQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  tier: TierLabel;
}

interface FillInQuestion {
  question: string;
  answer: string;
  explanation?: string;
  tier: '1%';
}

type Question = MultipleChoiceQuestion | FillInQuestion;

function isFillIn(q: Question | undefined): q is FillInQuestion {
  return !!q && q.tier === '1%' && 'answer' in q;
}

interface Props {
  onBack: () => void;
  onNavigate: (tab: Tab) => void;
  archiveDate?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const TIER_ORDER: TierLabel[] = ['100%', '75%', '50%', '25%', '1%'];

const TIER_XP: Record<TierLabel, number> = {
  '100%': 50,
  '75%': 100,
  '50%': 200,
  '25%': 400,
  '1%': 800,
};

const ALL_CORRECT_BONUS = 500;
const MAX_XP = 2050; // 50 + 100 + 200 + 400 + 800 + 500

interface RawLadderQuestion {
  question: string;
  options?: string[];
  correctIndex?: number;
  answer?: string;
  explanation?: string;
  tier?: string;
}

function buildQuestionsFromSupabase(raw: RawLadderQuestion[]): Question[] {
  return raw.map((q, i) => {
    const tier = (q.tier as TierLabel) ?? TIER_ORDER[i] ?? '1%';
    if (tier === '1%' && q.answer) {
      return {
        question: q.question,
        answer: q.answer,
        explanation: q.explanation,
        tier: '1%' as const,
      };
    }
    return {
      question: q.question,
      options: q.options ?? [],
      correctIndex: q.correctIndex ?? 0,
      explanation: q.explanation,
      tier,
    } as MultipleChoiceQuestion;
  });
}

function isCorrectFillIn(userAnswer: string, correctAnswer: string): boolean {
  const clean = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '');
  const user = clean(userAnswer);
  const correct = clean(correctAnswer);
  if (user === correct) return true;
  // Check if user typed the last name only
  const parts = correct.split(' ');
  if (parts.length > 1 && user === clean(parts[parts.length - 1])) return true;
  // Check if correct answer contains the user's input (min 4 chars)
  if (user.length >= 4 && correct.includes(user)) return true;
  return false;
}

function performanceLabel(score: number, total: number): string {
  const pct = total > 0 ? score / total : 0;
  if (pct === 1) return 'PERFECT!';
  if (pct >= 0.8) return 'Nice!';
  if (pct >= 0.4) return 'Keep Practicing';
  return 'Rough One\u2026';
}

function tierColor(tier: TierLabel): string {
  if (tier === '100%') return colors.accentGreen;
  if (tier === '75%') return colors.accentCyan;
  if (tier === '50%') return colors.accentCyan;
  if (tier === '25%') return colors.brand;
  return colors.brand;
}

function calculateLadderXP(results: boolean[]): number {
  let total = 0;
  for (let i = 0; i < results.length; i++) {
    if (results[i]) {
      total += TIER_XP[TIER_ORDER[i]] ?? 0;
    }
  }
  if (results.length === 5 && results.every(Boolean)) {
    total += ALL_CORRECT_BONUS;
  }
  return total;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function TriviaScreen({ onBack, onNavigate, archiveDate }: Props) {
  const isArchive = !!archiveDate;
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const s = createStyles(isDark);
  const { trackGameStart, trackGameComplete, trackGameAbandoned } = useGameAnalytics();
  const [selectedLeague, setSelectedLeague] = useState('NBA');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [fillInAnswer, setFillInAnswer] = useState('');
  const [fillInSubmitted, setFillInSubmitted] = useState(false);
  const [fillInCorrect, setFillInCorrect] = useState(false);
  const [correctResults, setCorrectResults] = useState<boolean[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);
  const [playedTodayCache, setPlayedTodayCache] = useState<Record<string, { score: number; xp: number } | null>>({});
  const [hintRevealed, setHintRevealed] = useState(false);
  const { showRewardedAd, isRewardedReady } = useRewardedAd();

  useEffect(() => {
    trackGameStart('trivia', selectedLeague);
  }, [selectedLeague]);

  useEffect(() => {
    setIsLoading(true);
    setLoadError(false);
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setFillInAnswer('');
    setFillInSubmitted(false);
    setFillInCorrect(false);
    setCorrectResults([]);
    setGameComplete(false);
    setXpEarned(null);
    setHintRevealed(false);
    const fetchGame = isArchive
      ? getArchiveGame(selectedLeague, archiveDate!)
      : getTodaysDailyGame(selectedLeague);
    const checkCompletion = isArchive
      ? Promise.resolve(null)
      : getGameResultToday(selectedLeague, 'trivia');

    const localKey = `trivia-done-${getTodayEST()}-${selectedLeague}`;
    const checkLocal = isArchive
      ? Promise.resolve(null)
      : AsyncStorage.getItem(localKey).then(v => v ? JSON.parse(v) : null).catch(() => null);

    void Promise.all([fetchGame, checkCompletion, checkLocal]).then(([data, priorResult, localResult]) => {
      setIsLoading(false);
      const completed = priorResult ?? localResult;
      if (completed !== null) {
        setPlayedTodayCache(prev => ({ ...prev, [selectedLeague]: completed }));
      }
      if (!data?.trivia_questions || !Array.isArray(data.trivia_questions) || data.trivia_questions.length === 0) {
        setLoadError(true);
        return;
      }
      const built = buildQuestionsFromSupabase(data.trivia_questions);
      if (built.length === 0) { setLoadError(true); return; }
      setQuestions(built);
    }).catch((err) => {
      console.error('[Trivia] Failed to load game:', err);
      setIsLoading(false);
      setLoadError(true);
    });
  }, [selectedLeague]);

  const q = questions[currentQuestion] as Question | undefined;
  const answered = q ? (isFillIn(q) ? fillInSubmitted : selectedAnswer !== null) : false;

  // ── Multiple choice answer handler ─────────────────────────────────────
  const handleAnswer = (index: number) => {
    if (answered || !q || isFillIn(q)) return;
    setSelectedAnswer(index);
  };

  // ── Fill-in submit handler ─────────────────────────────────────────────
  const handleFillInSubmit = () => {
    if (fillInSubmitted || !q || !isFillIn(q)) return;
    const correct = isCorrectFillIn(fillInAnswer, q.answer);
    setFillInCorrect(correct);
    setFillInSubmitted(true);
  };

  // ── Next / finish ─────────────────────────────────────────────────────
  const handleNext = () => {
    // Determine if current question was correct
    let isCurrentCorrect = false;
    if (q && isFillIn(q)) {
      isCurrentCorrect = fillInCorrect;
    } else if (q && !isFillIn(q)) {
      isCurrentCorrect = selectedAnswer === (q as MultipleChoiceQuestion).correctIndex;
    }

    const updatedResults = [...correctResults, isCurrentCorrect];

    if (currentQuestion >= questions.length - 1) {
      // Game over
      setCorrectResults(updatedResults);
      const totalXP = calculateLadderXP(updatedResults);
      const finalScore = updatedResults.filter(Boolean).length;
      setXpEarned(totalXP);
      setGameComplete(true);
      trackGameComplete('trivia', selectedLeague, finalScore, totalXP);
      if (!isArchive) {
        // Save locally first — guarantees no replay even for guests/offline
        const localKey = `trivia-done-${getTodayEST()}-${selectedLeague}`;
        void AsyncStorage.setItem(localKey, JSON.stringify({ score: finalScore, xp: totalXP }));

        void (async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await saveGameResult(user.id, 'trivia', totalXP, finalScore);
            await updateUserXPAndStreak(user.id, totalXP, true);
          }
        })();
        void saveCompletionResult(selectedLeague, 'trivia', finalScore, totalXP);
        void updatePlayHour();
      }
    } else {
      setCorrectResults(updatedResults);
      setCurrentQuestion(i => i + 1);
      setSelectedAnswer(null);
      setFillInAnswer('');
      setFillInSubmitted(false);
      setFillInCorrect(false);
    }
  };

  const handlePlayAgain = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setFillInAnswer('');
    setFillInSubmitted(false);
    setFillInCorrect(false);
    setCorrectResults([]);
    setGameComplete(false);
    setXpEarned(null);
  };

  // ── Option state helpers ─────────────────────────────────────────────────

  const cardBg = isDark ? dark.card : light.card;
  const optionBg = (index: number): string => {
    if (!q || isFillIn(q)) return cardBg;
    if (!answered) return cardBg;
    const mcq = q as MultipleChoiceQuestion;
    if (index === mcq.correctIndex) return colors.accentGreen;
    if (index === selectedAnswer) return colors.accentRed;
    return cardBg;
  };

  const optionBorderLeft = (index: number): string => {
    if (!q || isFillIn(q)) return 'transparent';
    if (!answered) return 'transparent';
    const mcq = q as MultipleChoiceQuestion;
    if (index === mcq.correctIndex) return colors.accentGreen;
    if (index === selectedAnswer) return colors.accentRed;
    return 'transparent';
  };

  const renderOptionIcon = (index: number) => {
    if (!q || isFillIn(q)) return null;
    if (!answered) return null;
    const mcq = q as MultipleChoiceQuestion;
    if (index === mcq.correctIndex) {
      return (
        <View style={[s.optionIcon, s.optionIconCorrect]}>
          <Check size={12} color={colors.white} strokeWidth={3} />
        </View>
      );
    }
    if (index === selectedAnswer) {
      return (
        <View style={[s.optionIcon, s.optionIconWrong]}>
          <X size={12} color={colors.white} strokeWidth={3} />
        </View>
      );
    }
    return null;
  };

  // ── Ladder progress indicator ────────────────────────────────────────────
  const renderLadderSteps = () => {
    return (
      <View style={s.ladderRow}>
        {TIER_ORDER.map((tier, i) => {
          const isActive = i === currentQuestion;
          const isCompleted = i < currentQuestion;
          const wasCorrect = correctResults[i];
          return (
            <View key={tier} style={s.ladderStepCol}>
              <View
                style={[
                  s.ladderStep,
                  isActive && s.ladderStepActive,
                  isCompleted && wasCorrect && s.ladderStepCorrect,
                  isCompleted && !wasCorrect && s.ladderStepWrong,
                ]}
              >
                <Text
                  style={[
                    s.ladderStepText,
                    isActive && s.ladderStepTextActive,
                    isCompleted && s.ladderStepTextCompleted,
                  ]}
                >
                  {i + 1}
                </Text>
              </View>
              <Text style={s.ladderTierLabel}>{tier}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const score = correctResults.filter(Boolean).length;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <View style={s.root}>
      {/* Coral fill behind status bar */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top, backgroundColor: brand.primary, zIndex: 0 }} />
      {/* ── Zone 1 ── */}
      <View style={[s.zone1, { paddingTop: insets.top + 16 }]}>
        <View style={s.zone1TopRow}>
          <Pressable onPress={() => { if (!gameComplete) trackGameAbandoned('trivia', selectedLeague); onBack(); }} hitSlop={8} style={s.backBtn}>
            <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
          </Pressable>

          {/* Live score (top right) */}
          {!gameComplete && questions.length > 0 && (
            <View style={s.liveScore}>
              <Text style={s.liveScoreNum}>{score}</Text>
              <Text style={s.liveScoreSep}>/</Text>
              <Text style={s.liveScoreTotal}>{questions.length}</Text>
              <Text style={s.liveScoreLabel}> CORRECT</Text>
            </View>
          )}
        </View>

        <View style={s.zone1Center}>
          <Text style={s.zone1Title}>LADDER</Text>
          {!gameComplete && questions.length > 0 && (
            <>
              <Text style={s.zone1Counter}>
                QUESTION {currentQuestion + 1} OF {questions.length}
              </Text>
              <View style={s.dotsRow}>
                {renderLadderSteps()}
              </View>
            </>
          )}
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

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={s.zone1Gradient}
          pointerEvents="none"
        />
      </View>

      {/* ── Zone 2 ── */}
      <ScrollView
        style={s.zone2}
        contentContainerStyle={[s.zone2Content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={s.centerState}>
            <ActivityIndicator size="large" color={brand.primary} />
          </View>
        ) : (loadError || questions.length === 0) ? (
          <View style={s.centerState}>
            <Text style={s.errorText}>No game available today</Text>
            <Text style={s.errorSubText}>Check back later or try a different league.</Text>
            <Pressable
              style={({ pressed }) => [s.retryBtn, pressed && s.retryBtnPressed]}
              onPress={() => {
                setIsLoading(true);
                setLoadError(false);
                setQuestions([]);
                setCurrentQuestion(0);
                setSelectedAnswer(null);
                setFillInAnswer('');
                setFillInSubmitted(false);
                setFillInCorrect(false);
                setCorrectResults([]);
                setGameComplete(false);
                setXpEarned(null);
                setHintRevealed(false);
                const fetchGame = isArchive
                  ? getArchiveGame(selectedLeague, archiveDate!)
                  : getTodaysDailyGame(selectedLeague);
                void fetchGame.then((data) => {
                  setIsLoading(false);
                  if (!data?.trivia_questions || !Array.isArray(data.trivia_questions) || data.trivia_questions.length === 0) {
                    setLoadError(true);
                    return;
                  }
                  const built = buildQuestionsFromSupabase(data.trivia_questions);
                  if (built.length === 0) { setLoadError(true); return; }
                  setQuestions(built);
                }).catch(() => {
                  setIsLoading(false);
                  setLoadError(true);
                });
              }}
            >
              <Text style={s.retryBtnText}>TRY AGAIN</Text>
            </Pressable>
          </View>
        ) : (!isArchive && playedTodayCache[selectedLeague] && !gameComplete) ? (
          <View style={s.alreadyPlayedCard}>
            <Text style={s.alreadyPlayedBadge}>ALREADY PLAYED TODAY</Text>
            <Text style={s.alreadyPlayedScore}>{playedTodayCache[selectedLeague]!.score}/{questions.length || 5}</Text>
            <View style={s.alreadyPlayedXpRow}>
              <Text style={s.alreadyPlayedXpLabel}>XP EARNED</Text>
              <Text style={s.alreadyPlayedXp}>+{playedTodayCache[selectedLeague]!.xp}</Text>
            </View>
            {/* Tier breakdown */}
            <View style={s.diffRow}>
              {TIER_ORDER.map((tier) => (
                <View key={tier} style={[s.diffPill, { backgroundColor: tierColor(tier) + '22' }]}>
                  <Text style={[s.diffPillText, { color: tierColor(tier) }]}>{tier}</Text>
                </View>
              ))}
            </View>

            <View style={s.alreadyPlayedDivider} />
            <Text style={s.alreadyPlayedCta}>COME BACK TOMORROW</Text>
            <Text style={s.alreadyPlayedSub}>New questions drop every day. Switch leagues to play more.</Text>
            <MidnightCountdown />
            <GhostButton label="VIEW ARCHIVE" onPress={() => onNavigate('archive' as Tab)} />
          </View>
        ) : gameComplete ? (
          /* ── Results ── */
          <View style={s.resultsCard}>
            <Text style={s.resultsTitle}>GAME OVER</Text>

            <View style={s.resultsScoreRow}>
              <Text style={s.resultsScoreNum}>{correctResults.filter(Boolean).length}</Text>
              <Text style={s.resultsScoreSep}> / </Text>
              <Text style={s.resultsScoreTotal}>{questions.length}</Text>
            </View>

            <Text style={s.resultsPerf}>{performanceLabel(correctResults.filter(Boolean).length, questions.length)}</Text>

            {!isArchive && xpEarned !== null && (
              <View style={s.xpCard}>
                <Text style={s.xpCardLabel}>XP EARNED</Text>
                <Text style={s.xpCardTotal}>+{xpEarned}</Text>
                {correctResults.length === 5 && correctResults.every(Boolean) && (
                  <Text style={s.xpCardBreakdown}>
                    Includes +{ALL_CORRECT_BONUS} XP perfect bonus!
                  </Text>
                )}
              </View>
            )}

            {/* Question breakdown */}
            <View style={s.breakdownSection}>
              <Text style={s.breakdownSectionTitle}>LADDER BREAKDOWN</Text>
              {questions.map((question, i) => {
                const wasCorrect = correctResults[i] ?? false;
                const tier = question.tier;
                const xpForTier = TIER_XP[tier] ?? 0;
                return (
                  <View key={`breakdown-${i}`} style={s.breakdownRow}>
                    <View style={s.breakdownRowLeft}>
                      <View style={[s.breakdownDot, { backgroundColor: wasCorrect ? colors.accentGreen : colors.accentRed }]} />
                      <View style={s.breakdownTextCol}>
                        <Text style={s.breakdownQuestion} numberOfLines={1}>
                          Q{i + 1}
                        </Text>
                        <Text style={s.breakdownSub}>
                          {wasCorrect ? `+${xpForTier} XP` : '0 XP'}
                        </Text>
                      </View>
                    </View>
                    <View style={[s.breakdownTierBadge, { backgroundColor: tierColor(tier) + '22' }]}>
                      <Text style={[s.breakdownTierText, { color: tierColor(tier) }]}>
                        {tier}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {isArchive && (
              <Text style={s.archiveNotice}>ARCHIVE MODE — Results not saved</Text>
            )}

            {!isArchive && <MidnightCountdown />}

            <View style={s.resultsButtons}>
              {isArchive && (
                <PrimaryButton label="Play Again" onPress={handlePlayAgain} />
              )}
              <PrimaryButton label="Back to Games" onPress={onBack} />
              <Pressable
                style={({ pressed }) => [s.shareBtn, pressed && s.shareBtnPressed]}
                onPress={() => shareTrivia(selectedLeague, correctResults.filter(Boolean).length, questions.length, 0)}
              >
                <Text style={s.shareBtnText}>SHARE RESULTS</Text>
              </Pressable>
              {!isArchive && (
                <GhostButton label="PLAY ARCHIVE" onPress={() => onNavigate('archive' as Tab)} />
              )}
            </View>
          </View>
        ) : !q ? (
          /* ── Safety fallback if question is somehow undefined ── */
          <View style={s.centerState}>
            <Text style={s.errorText}>Unable to load question</Text>
            <Pressable
              style={({ pressed }) => [s.retryBtn, pressed && s.retryBtnPressed]}
              onPress={onBack}
            >
              <Text style={s.retryBtnText}>GO BACK</Text>
            </Pressable>
          </View>
        ) : (
          /* ── Question + options ── */
          <>
            {/* Tier badge + question card */}
            <View style={s.questionCard}>
              <View style={[s.diffBadge, { backgroundColor: tierColor(q.tier) + '22' }]}>
                <Text style={[s.diffBadgeText, { color: tierColor(q.tier) }]}>
                  {q.tier}
                </Text>
              </View>
              <Text style={s.questionText}>{q.question}</Text>
            </View>

            {isFillIn(q) ? (
              /* ── Fill-in-the-blank (Q5) ── */
              <View style={s.fillInBlock}>
                <TextInput
                  style={[
                    s.fillInInput,
                    fillInSubmitted && fillInCorrect && s.fillInInputCorrect,
                    fillInSubmitted && !fillInCorrect && s.fillInInputWrong,
                  ]}
                  placeholder="Type your answer..."
                  placeholderTextColor={isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'}
                  value={fillInAnswer}
                  onChangeText={setFillInAnswer}
                  editable={!fillInSubmitted}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={() => { if (fillInAnswer.trim().length > 0 && !fillInSubmitted) handleFillInSubmit(); }}
                />
                {!fillInSubmitted && (
                  <View style={{ gap: 8 }}>
                    <PrimaryButton
                      label="SUBMIT ANSWER"
                      onPress={handleFillInSubmit}
                      disabled={fillInAnswer.trim().length === 0}
                    />
                    {!hintRevealed && isRewardedReady && isFillIn(q) && (
                      <Pressable
                        style={s.hintBtn}
                        onPress={() => showRewardedAd(() => setHintRevealed(true))}
                      >
                        <Film size={16} color={colors.brand} strokeWidth={2} />
                        <Text style={s.hintBtnText}>Watch Ad for Hint</Text>
                      </Pressable>
                    )}
                    {hintRevealed && isFillIn(q) && (
                      <View style={s.hintBox}>
                        <Text style={s.hintLabel}>HINT</Text>
                        <Text style={s.hintText}>
                          {q.answer.slice(0, Math.max(3, Math.ceil(q.answer.length * 0.4)))}{'...'}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
                {fillInSubmitted && (
                  <View style={s.fillInResult}>
                    <View style={[s.fillInResultBadge, { backgroundColor: fillInCorrect ? colors.accentGreen : colors.accentRed }]}>
                      {fillInCorrect ? (
                        <Check size={16} color={colors.white} strokeWidth={3} />
                      ) : (
                        <X size={16} color={colors.white} strokeWidth={3} />
                      )}
                    </View>
                    <Text style={[s.fillInResultText, { color: fillInCorrect ? colors.accentGreen : colors.accentRed }]}>
                      {fillInCorrect ? 'CORRECT!' : 'INCORRECT'}
                    </Text>
                    {!fillInCorrect && (
                      <Text style={s.fillInCorrectAnswer}>
                        Answer: {q.answer}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ) : (
              /* ── Multiple choice options (Q1-Q4) ── */
              <View style={s.optionsBlock}>
                {(q as MultipleChoiceQuestion).options.map((option, index) => (
                  <Pressable
                    key={`${q.question}-opt-${index}`}
                    onPress={() => handleAnswer(index)}
                    disabled={answered}
                    style={({ pressed }) => [
                      s.option,
                      { backgroundColor: optionBg(index) },
                      { borderLeftColor: optionBorderLeft(index) },
                      answered && index !== (q as MultipleChoiceQuestion).correctIndex && index !== selectedAnswer && s.optionDimmed,
                      pressed && !answered && s.optionPressed,
                    ]}
                  >
                    <View style={s.optionIndexBadge}>
                      <Text style={s.optionIndex}>
                        {String.fromCharCode(65 + index)}
                      </Text>
                    </View>
                    <Text style={s.optionText} numberOfLines={2}>{option}</Text>
                    {renderOptionIcon(index)}
                  </Pressable>
                ))}
              </View>
            )}

            {/* Next button (appears after answering) */}
            {answered && (
              <View style={s.nextRow}>
                <PrimaryButton
                  label={currentQuestion < questions.length - 1 ? 'NEXT QUESTION' : 'SEE RESULTS'}
                  onPress={handleNext}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

function createStyles(isDark: boolean) {
  const txt = isDark ? dark.textPrimary : light.textPrimary;
  const txtSec = isDark ? dark.textSecondary : light.textSecondary;
  const txtMuted = isDark ? dark.textMuted : light.textMuted;
  const cardBg = isDark ? dark.card : light.card;
  const surfaceBg = isDark ? dark.surface : light.surface;
  const borderCol = isDark ? dark.cardBorder : light.cardBorder;
  const dividerCol = isDark ? dark.divider : light.divider;

  return StyleSheet.create({
    root: { flex: 1, backgroundColor: 'transparent' },

    // Zone 1
    zone1: { backgroundColor: brand.primary, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
    zone1TopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xs },
    backBtn: { padding: spacing.sm, marginLeft: -spacing.sm },
    liveScore: { flexDirection: 'row', alignItems: 'baseline', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
    liveScoreNum: { fontFamily: fonts.display, fontSize: 18, color: '#FFFFFF' },
    liveScoreSep: { fontFamily: fonts.bodyMedium, fontSize: 14, color: 'rgba(255,255,255,0.45)', marginHorizontal: 2 },
    liveScoreTotal: { fontFamily: fonts.display, fontSize: 14, color: 'rgba(255,255,255,0.55)' },
    liveScoreLabel: { fontFamily: fonts.bodyMedium, fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: 1 },
    zone1Center: { alignItems: 'center', marginTop: spacing.xs },
    zone1Title: { fontFamily: fonts.display, fontSize: 28, color: '#FFFFFF', letterSpacing: 4, textAlign: 'center' },
    switcherRow: { marginTop: spacing.md },
    centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
    errorText: { fontFamily: fonts.bodySemiBold, fontSize: 16, color: txt, textAlign: 'center' },
    errorSubText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: txtSec, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.lg },
    retryBtn: { backgroundColor: brand.primary, borderRadius: radius.primary, paddingHorizontal: spacing['2xl'], paddingVertical: spacing.md },
    retryBtnPressed: { opacity: 0.85 },
    retryBtnText: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.white, letterSpacing: 1.5 },
    zone1Counter: { fontFamily: fonts.bodyMedium, fontSize: 11, color: 'rgba(255,255,255,0.65)', letterSpacing: 1, marginTop: 4, textAlign: 'center' },
    dotsRow: { marginTop: spacing.md },
    zone1Gradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 40 },

    // Ladder steps
    ladderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
    ladderStepCol: { alignItems: 'center', gap: 4 },
    ladderStep: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
    ladderStepActive: { backgroundColor: 'rgba(255,255,255,0.35)', borderWidth: 2, borderColor: '#FFFFFF' },
    ladderStepCorrect: { backgroundColor: colors.accentGreen },
    ladderStepWrong: { backgroundColor: colors.accentRed },
    ladderStepText: { fontFamily: fonts.display, fontSize: 13, color: 'rgba(255,255,255,0.6)' },
    ladderStepTextActive: { color: '#FFFFFF' },
    ladderStepTextCompleted: { color: '#FFFFFF' },
    ladderTierLabel: { fontFamily: fonts.bodySemiBold, fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5 },

    // Zone 2
    zone2: { flex: 1, backgroundColor: 'transparent' },
    zone2Content: { paddingHorizontal: spacing.lg, paddingTop: spacing['2xl'], paddingBottom: 0, gap: spacing.md },

    // Question card
    questionCard: { backgroundColor: cardBg, borderRadius: radius.primary, padding: spacing['2xl'], alignItems: 'center', gap: spacing.md, borderWidth: 1, borderColor: borderCol },
    diffBadge: { borderRadius: 6, paddingHorizontal: spacing.sm, paddingVertical: 3 },
    diffBadgeText: { fontFamily: fonts.bodySemiBold, fontSize: 9, letterSpacing: 1.5 },
    questionText: { fontFamily: fonts.bodySemiBold, fontSize: 18, color: txt, textAlign: 'center', lineHeight: 26 },

    // Options
    optionsBlock: { gap: spacing.sm },
    option: { borderRadius: radius.primary, flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.lg, paddingHorizontal: spacing.md, gap: spacing.md, borderWidth: 1, borderColor: borderCol, borderLeftWidth: 3 },
    optionPressed: { opacity: 0.8, transform: [{ scale: 0.985 }] },
    optionDimmed: { opacity: 0.4 },
    optionIndexBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    optionIndex: { fontFamily: fonts.display, fontSize: 12, color: txt },
    optionText: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: txt, flex: 1, lineHeight: 21 },
    optionIcon: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    optionIconCorrect: { backgroundColor: 'rgba(255,255,255,0.25)' },
    optionIconWrong: { backgroundColor: 'rgba(255,255,255,0.25)' },

    // Fill-in-the-blank
    fillInBlock: { gap: spacing.md },
    fillInInput: {
      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
      borderRadius: radius.primary,
      borderWidth: 1,
      borderColor: borderCol,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.lg,
      fontFamily: fonts.bodySemiBold,
      fontSize: 16,
      color: txt,
    },
    fillInInputCorrect: { borderColor: colors.accentGreen, borderWidth: 2 },
    fillInInputWrong: { borderColor: colors.accentRed, borderWidth: 2 },
    hintBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 12,
      borderRadius: radius.primary,
      borderWidth: 1,
      borderColor: colors.brand + '33',
      backgroundColor: colors.brand + '0A',
    },
    hintBtnText: {
      fontFamily: fonts.bodySemiBold,
      fontSize: 14,
      color: colors.brand,
    },
    hintBox: {
      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      borderRadius: radius.secondary,
      paddingVertical: 10,
      paddingHorizontal: 16,
      alignItems: 'center',
      gap: 4,
    },
    hintLabel: {
      fontFamily: fonts.bodyMedium,
      fontSize: 11,
      color: txtSec,
      letterSpacing: 1,
    },
    hintText: {
      fontFamily: fonts.displayBold,
      fontSize: 18,
      color: colors.brand,
      letterSpacing: 1,
    },
    fillInResult: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md },
    fillInResultBadge: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    fillInResultText: { fontFamily: fonts.display, fontSize: 16, letterSpacing: 2 },
    fillInCorrectAnswer: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: txtSec, textAlign: 'center' },

    // Next button
    nextRow: { marginTop: spacing.xs },

    // Results
    resultsCard: { backgroundColor: cardBg, borderRadius: 24, padding: spacing['3xl'], alignItems: 'center', borderWidth: 1, borderColor: borderCol },
    resultsTitle: { fontFamily: fonts.display, fontSize: 22, color: txt, letterSpacing: 3, textAlign: 'center' },
    resultsScoreRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: spacing.lg },
    resultsScoreNum: { fontFamily: fonts.display, fontSize: 72, color: brand.primary, lineHeight: 78 },
    resultsScoreSep: { fontFamily: fonts.bodyMedium, fontSize: 28, color: txtMuted },
    resultsScoreTotal: { fontFamily: fonts.display, fontSize: 40, color: txtMuted },
    resultsPerf: { fontFamily: fonts.bodySemiBold, fontSize: 18, color: txtSec, marginTop: spacing.sm, marginBottom: spacing.lg },
    xpCard: { width: '100%' as any, backgroundColor: cardBg, borderRadius: radius.primary, paddingVertical: spacing.xl, paddingHorizontal: spacing.lg, alignItems: 'center', marginBottom: spacing['2xl'], borderWidth: 1, borderColor: borderCol },
    xpCardLabel: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: txtSec, letterSpacing: 1, marginBottom: spacing.xs },
    xpCardTotal: { fontFamily: fonts.display, fontSize: 48, color: brand.primary, lineHeight: 54 },
    xpCardBreakdown: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.accentGreen, marginTop: spacing.xs },
    resultsButtons: { width: '100%' as any, gap: spacing.md },
    shareBtn: { width: '100%' as any, height: 48, borderRadius: radius.primary, backgroundColor: cardBg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: borderCol },
    shareBtnPressed: { opacity: 0.7 },
    shareBtnText: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: txt, letterSpacing: 1.5 },

    // Tier breakdown pills
    diffRow: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', flexWrap: 'wrap' },
    diffPill: { borderRadius: 6, paddingHorizontal: spacing.sm, paddingVertical: 4 },
    diffPillText: { fontFamily: fonts.bodySemiBold, fontSize: 9, letterSpacing: 1.5 },

    // Already played
    alreadyPlayedCard: { backgroundColor: cardBg, borderRadius: 24, padding: spacing['3xl'], alignItems: 'center', gap: spacing.md, borderWidth: 1, borderColor: borderCol },
    alreadyPlayedBadge: { fontFamily: fonts.bodySemiBold, fontSize: 10, letterSpacing: 2, color: brand.primary, textAlign: 'center' },
    alreadyPlayedScore: { fontFamily: fonts.display, fontSize: 56, color: txt, lineHeight: 62 },
    alreadyPlayedXpRow: { alignItems: 'center' },
    alreadyPlayedXpLabel: { fontFamily: fonts.bodySemiBold, fontSize: 10, letterSpacing: 2, color: txtSec },
    alreadyPlayedXp: { fontFamily: fonts.display, fontSize: 32, color: brand.primary, lineHeight: 38 },
    alreadyPlayedDivider: { width: '100%' as any, height: 1, backgroundColor: dividerCol, marginVertical: spacing.xs },
    alreadyPlayedCta: { fontFamily: fonts.display, fontSize: 18, color: txt, letterSpacing: 2, textAlign: 'center' },
    alreadyPlayedSub: { fontFamily: fonts.bodyMedium, fontSize: 13, color: txtSec, textAlign: 'center', lineHeight: 20 },

    // Archive
    archiveBanner: { backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 8, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, alignSelf: 'center', marginTop: spacing.md },
    archiveBannerText: { fontFamily: fonts.bodySemiBold, fontSize: 11, color: 'rgba(255,255,255,0.85)', letterSpacing: 1.5, textAlign: 'center' },
    archiveNotice: { fontFamily: fonts.bodyMedium, fontSize: 12, color: txtSec, textAlign: 'center', letterSpacing: 1, marginTop: spacing.sm, marginBottom: spacing.lg },

    // Breakdown section (replaces rarity)
    breakdownSection: { width: '100%' as any, marginBottom: spacing['2xl'], gap: spacing.sm },
    breakdownSectionTitle: { fontFamily: fonts.bodySemiBold, fontSize: 11, color: txtSec, letterSpacing: 1.5, marginBottom: spacing.xs },
    breakdownRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: surfaceBg, borderRadius: radius.primary, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderWidth: 1, borderColor: borderCol },
    breakdownRowLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
    breakdownDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
    breakdownTextCol: { flex: 1 },
    breakdownQuestion: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: txt },
    breakdownSub: { fontFamily: fonts.bodyMedium, fontSize: 11, color: txtSec, marginTop: 2 },
    breakdownTierBadge: { borderRadius: 6, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, alignItems: 'center', marginLeft: spacing.sm, flexShrink: 0 },
    breakdownTierText: { fontFamily: fonts.bodySemiBold, fontSize: 10, letterSpacing: 1 },
  });
}

const styles = createStyles(true);
