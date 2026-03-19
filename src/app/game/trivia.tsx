import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Check, X } from 'lucide-react-native';
import MidnightCountdown from '../../components/MidnightCountdown';
import { colors, darkColors, fontFamily, spacing } from '../../styles/theme';
import RoundProgressDots from '../../screens/components/ui/RoundProgressDots';
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';
import PrimaryButton from '../../screens/components/ui/PrimaryButton';
import GhostButton from '../../screens/components/ui/GhostButton';
import { type Tab } from '../components/ui/BottomNav';
import { calculateDailyGameXP, saveGameResult, updateUserXPAndStreak } from '../../lib/xp';
import { supabase } from '../../lib/supabase';
import { getTodaysDailyGame, getArchiveGame } from '../../lib/dailyGames';
import { saveGameResult as saveCompletionResult, getGameResultToday } from '../../lib/gameResults';
import { updatePlayHour } from '../../lib/notifications';

// ── Types ────────────────────────────────────────────────────────────────────

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface Props {
  onBack: () => void;
  onNavigate: (tab: Tab) => void;
  archiveDate?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const DIFFICULTY_MAP: Question['difficulty'][] = ['Easy', 'Medium', 'Hard'];

interface RawTriviaQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  difficulty?: string;
}

function buildQuestionsFromSupabase(raw: RawTriviaQuestion[]): Question[] {
  return raw.map((q, i) => ({
    question: q.question,
    options: q.options,
    correctIndex: q.correctIndex,
    difficulty: DIFFICULTY_MAP[i] ?? 'Hard',
  }));
}

function performanceLabel(score: number, total: number): string {
  const pct = total > 0 ? score / total : 0;
  if (pct === 1) return 'Perfect! 🔥';
  if (pct >= 0.8) return 'Nice!';
  if (pct >= 0.4) return 'Keep Practicing';
  return 'Rough One…';
}

function difficultyColor(d: Question['difficulty']): string {
  if (d === 'Easy') return colors.accentGreen;
  if (d === 'Medium') return colors.accentCyan;
  return colors.brand;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function TriviaScreen({ onBack, archiveDate }: Props) {
  const isArchive = !!archiveDate;
  const [selectedLeague, setSelectedLeague] = useState('NBA');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);
  const [playedTodayCache, setPlayedTodayCache] = useState<Record<string, { score: number; xp: number } | null>>({});

  useEffect(() => {
    setIsLoading(true);
    setLoadError(false);
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setGameComplete(false);
    setXpEarned(null);
    const fetchGame = isArchive
      ? getArchiveGame(selectedLeague, archiveDate!)
      : getTodaysDailyGame(selectedLeague);
    const checkCompletion = isArchive
      ? Promise.resolve(null)
      : getGameResultToday(selectedLeague, 'trivia');

    void Promise.all([fetchGame, checkCompletion]).then(([data, priorResult]) => {
      setIsLoading(false);
      if (priorResult !== null) {
        setPlayedTodayCache(prev => ({ ...prev, [selectedLeague]: priorResult }));
      }
      if (!data?.trivia_questions) { setLoadError(true); return; }
      setQuestions(buildQuestionsFromSupabase(data.trivia_questions));
    });
  }, [selectedLeague]);

  const q = questions[currentQuestion];
  const answered = selectedAnswer !== null;

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
    if (index === q.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion >= questions.length - 1) {
      const finalScore = score + (selectedAnswer === q.correctIndex ? 1 : 0);
      const xp = calculateDailyGameXP('trivia', { correctAnswers: finalScore });
      setXpEarned(xp);
      setGameComplete(true);
      if (!isArchive) {
        void (async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await saveGameResult(user.id, 'trivia', xp, finalScore);
            await updateUserXPAndStreak(user.id, xp, true);
          }
        })();
        void saveCompletionResult(selectedLeague, 'trivia', finalScore, xp);
        void updatePlayHour();
      }
    } else {
      setCurrentQuestion(i => i + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePlayAgain = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setGameComplete(false);
    setXpEarned(null);
  };

  // ── Option state helpers ─────────────────────────────────────────────────

  const optionBg = (index: number): string => {
    if (!answered) return darkColors.surfaceElevated;
    if (index === q.correctIndex) return colors.accentGreen;
    if (index === selectedAnswer) return colors.accentRed;
    return darkColors.surfaceElevated;
  };

  const optionBorderLeft = (index: number): string => {
    if (!answered) return 'transparent';
    if (index === q.correctIndex) return colors.accentGreen;
    if (index === selectedAnswer) return colors.accentRed;
    return 'transparent';
  };

  const renderOptionIcon = (index: number) => {
    if (!answered) return null;
    if (index === q.correctIndex) {
      return (
        <View style={[styles.optionIcon, styles.optionIconCorrect]}>
          <Check size={12} color={colors.white} strokeWidth={3} />
        </View>
      );
    }
    if (index === selectedAnswer) {
      return (
        <View style={[styles.optionIcon, styles.optionIconWrong]}>
          <X size={12} color={colors.white} strokeWidth={3} />
        </View>
      );
    }
    return null;
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* ── Zone 1 ── */}
      <View style={styles.zone1}>
        <View style={styles.zone1TopRow}>
          <Pressable onPress={onBack} hitSlop={8} style={styles.backBtn}>
            <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
          </Pressable>

          {/* Live score (top right) */}
          {!gameComplete && questions.length > 0 && (
            <View style={styles.liveScore}>
              <Text style={styles.liveScoreNum}>{score}</Text>
              <Text style={styles.liveScoreSep}>/</Text>
              <Text style={styles.liveScoreTotal}>{questions.length}</Text>
              <Text style={styles.liveScoreLabel}> CORRECT</Text>
            </View>
          )}
        </View>

        <View style={styles.zone1Center}>
          <Text style={styles.zone1Title}>TRIVIA</Text>
          {!gameComplete && questions.length > 0 && (
            <>
              <Text style={styles.zone1Counter}>
                QUESTION {currentQuestion + 1} OF {questions.length}
              </Text>
              <View style={styles.dotsRow}>
                <RoundProgressDots total={questions.length} current={currentQuestion + 1} />
              </View>
            </>
          )}
        </View>

        {isArchive ? (
          <View style={styles.archiveBanner}>
            <Text style={styles.archiveBannerText}>ARCHIVE — {archiveDate}</Text>
          </View>
        ) : (
          <View style={styles.switcherRow}>
            <LeagueSwitcher selected={selectedLeague} onChange={setSelectedLeague} />
          </View>
        )}

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={styles.zone1Gradient}
          pointerEvents="none"
        />
      </View>

      {/* ── Zone 2 ── */}
      <ScrollView
        style={styles.zone2}
        contentContainerStyle={styles.zone2Content}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#FC345C" />
          </View>
        ) : (loadError || questions.length === 0) ? (
          <View style={styles.centerState}>
            <Text style={styles.errorText}>No game available today</Text>
          </View>
        ) : (!isArchive && playedTodayCache[selectedLeague] && !gameComplete) ? (
          <View style={styles.alreadyPlayedCard}>
            <Text style={styles.alreadyPlayedBadge}>ALREADY PLAYED TODAY</Text>
            <Text style={styles.alreadyPlayedScore}>{playedTodayCache[selectedLeague]!.score}/{questions.length || 3}</Text>
            <View style={styles.alreadyPlayedXpRow}>
              <Text style={styles.alreadyPlayedXpLabel}>XP EARNED</Text>
              <Text style={styles.alreadyPlayedXp}>+{playedTodayCache[selectedLeague]!.xp}</Text>
            </View>
            {/* Difficulty breakdown */}
            <View style={styles.diffRow}>
              <View style={[styles.diffPill, { backgroundColor: colors.accentGreen + '22' }]}>
                <Text style={[styles.diffPillText, { color: colors.accentGreen }]}>EASY</Text>
              </View>
              <View style={[styles.diffPill, { backgroundColor: colors.accentCyan + '22' }]}>
                <Text style={[styles.diffPillText, { color: colors.accentCyan }]}>MEDIUM</Text>
              </View>
              <View style={[styles.diffPill, { backgroundColor: colors.brand + '22' }]}>
                <Text style={[styles.diffPillText, { color: colors.brand }]}>HARD</Text>
              </View>
            </View>

            <View style={styles.alreadyPlayedDivider} />
            <Text style={styles.alreadyPlayedCta}>COME BACK TOMORROW</Text>
            <Text style={styles.alreadyPlayedSub}>New questions drop every day. Switch leagues to play more.</Text>
            <MidnightCountdown />
            <GhostButton label="VIEW ARCHIVE" onPress={() => onNavigate('archive' as Tab)} />
          </View>
        ) : gameComplete ? (
          /* ── Results ── */
          <View style={styles.resultsCard}>
            <Text style={styles.resultsTitle}>GAME OVER</Text>

            <View style={styles.resultsScoreRow}>
              <Text style={styles.resultsScoreNum}>{score}</Text>
              <Text style={styles.resultsScoreSep}> / </Text>
              <Text style={styles.resultsScoreTotal}>{questions.length}</Text>
            </View>

            <Text style={styles.resultsPerf}>{performanceLabel(score, questions.length)}</Text>

            {!isArchive && xpEarned !== null && (
              <View style={styles.xpCard}>
                <Text style={styles.xpCardLabel}>⭐ XP EARNED</Text>
                <Text style={styles.xpCardTotal}>+{xpEarned}</Text>
                <Text style={styles.xpCardBreakdown}>
                  Base: 500 XP + Bonus: {xpEarned - 500} XP
                </Text>
              </View>
            )}

            {isArchive && (
              <Text style={styles.archiveNotice}>ARCHIVE MODE — Results not saved</Text>
            )}

            {!isArchive && <MidnightCountdown />}

            <View style={styles.resultsButtons}>
              {isArchive && (
                <PrimaryButton label="Play Again" onPress={handlePlayAgain} />
              )}
              <PrimaryButton label="Back to Games" onPress={onBack} />
              {!isArchive && (
                <GhostButton label="PLAY ARCHIVE" onPress={() => onNavigate('archive' as Tab)} />
              )}
            </View>
          </View>
        ) : (
          /* ── Question + options ── */
          <>
            {/* Difficulty badge + question card */}
            <View style={styles.questionCard}>
              <View style={[styles.diffBadge, { backgroundColor: difficultyColor(q.difficulty) + '22' }]}>
                <Text style={[styles.diffBadgeText, { color: difficultyColor(q.difficulty) }]}>
                  {q.difficulty.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.questionText}>{q.question}</Text>
            </View>

            {/* Answer options */}
            <View style={styles.optionsBlock}>
              {q.options.map((option, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleAnswer(index)}
                  disabled={answered}
                  style={({ pressed }) => [
                    styles.option,
                    { backgroundColor: optionBg(index) },
                    { borderLeftColor: optionBorderLeft(index) },
                    answered && index !== q.correctIndex && index !== selectedAnswer && styles.optionDimmed,
                    pressed && !answered && styles.optionPressed,
                  ]}
                >
                  <View style={styles.optionIndexBadge}>
                    <Text style={styles.optionIndex}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  <Text style={styles.optionText} numberOfLines={2}>{option}</Text>
                  {renderOptionIcon(index)}
                </Pressable>
              ))}
            </View>

            {/* Next button (appears after answering) */}
            {answered && (
              <View style={styles.nextRow}>
                <PrimaryButton
                  label={currentQuestion < questions.length - 1 ? 'NEXT QUESTION' : 'SEE RESULTS'}
                  onPress={handleNext}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // Zone 1 ─────────────────────────────────────────────────────────────────
  zone1: {
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['4xl'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  zone1TopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  backBtn: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
  },
  liveScore: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  liveScoreNum: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 18,
    color: colors.white,
  },
  liveScoreSep: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    marginHorizontal: 2,
  },
  liveScoreTotal: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
  },
  liveScoreLabel: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1,
  },
  zone1Center: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  zone1Title: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 28,
    color: colors.white,
    letterSpacing: 4,
    textAlign: 'center',
  },
  switcherRow: {
    marginTop: spacing.md,
  },
  // Loading / error
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  errorText: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 15,
    color: '#9A9A9A',
    textAlign: 'center',
  },

  zone1Counter: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 1,
    marginTop: 4,
    textAlign: 'center',
  },
  dotsRow: {
    marginTop: spacing.md,
  },
  zone1Gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  // Zone 2 ─────────────────────────────────────────────────────────────────
  zone2: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.10)',
  },
  zone2Content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing['4xl'],
    gap: spacing.md,
  },

  // Question card ───────────────────────────────────────────────────────────
  questionCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    padding: spacing['2xl'],
    alignItems: 'center',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  diffBadge: {
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  diffBadgeText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 9,
    letterSpacing: 1.5,
  },
  questionText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 18,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 26,
  },

  // Options ─────────────────────────────────────────────────────────────────
  optionsBlock: {
    gap: spacing.sm,
  },
  option: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  optionPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.985 }],
  },
  optionDimmed: {
    opacity: 0.4,
  },
  optionIndexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  optionIndex: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 12,
    color: colors.white,
  },
  optionText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 15,
    color: colors.white,
    flex: 1,
    lineHeight: 21,
  },
  optionIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  optionIconCorrect: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  optionIconWrong: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },

  // Next button
  nextRow: {
    marginTop: spacing.xs,
  },

  // Results ─────────────────────────────────────────────────────────────────
  resultsCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 24,
    padding: spacing['3xl'],
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  resultsTitle: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 22,
    color: colors.white,
    letterSpacing: 3,
    textAlign: 'center',
  },
  resultsScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.lg,
  },
  resultsScoreNum: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 72,
    color: colors.brand,
    lineHeight: 78,
  },
  resultsScoreSep: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 28,
    color: 'rgba(255,255,255,0.35)',
  },
  resultsScoreTotal: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 40,
    color: 'rgba(255,255,255,0.45)',
  },
  resultsPerf: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 18,
    color: '#9A9A9A',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  xpCard: {
    width: '100%',
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing['2xl'],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  xpCardLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: '#9A9A9A',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  xpCardTotal: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 48,
    color: colors.brand,
    lineHeight: 54,
  },
  xpCardBreakdown: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 13,
    color: '#9A9A9A',
    marginTop: spacing.xs,
  },
  resultsButtons: {
    width: '100%',
    gap: spacing.md,
  },

  // Difficulty breakdown row (already played)
  diffRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  diffPill: {
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  diffPillText: {
    fontFamily: fontFamily.bold,
    fontSize: 9,
    letterSpacing: 1.5,
  },

  // Already played today
  alreadyPlayedCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 24,
    padding: spacing['3xl'],
    alignItems: 'center',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  alreadyPlayedBadge: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 2,
    color: colors.brand,
    textAlign: 'center',
  },
  alreadyPlayedScore: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 56,
    color: colors.white,
    lineHeight: 62,
  },
  alreadyPlayedXpRow: {
    alignItems: 'center',
  },
  alreadyPlayedXpLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 2,
    color: '#9A9A9A',
  },
  alreadyPlayedXp: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 32,
    color: colors.brand,
    lineHeight: 38,
  },
  alreadyPlayedDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: spacing.xs,
  },
  alreadyPlayedCta: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 18,
    color: colors.white,
    letterSpacing: 2,
    textAlign: 'center',
  },
  alreadyPlayedSub: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 13,
    color: '#9A9A9A',
    textAlign: 'center',
    lineHeight: 20,
  },

  // ── Archive ──────────────────────────────────────────────────────────────
  archiveBanner: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  archiveBannerText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  archiveNotice: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 12,
    color: '#9A9A9A',
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
});
