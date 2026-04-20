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
import { ArrowLeft, Type } from 'lucide-react-native';
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
import { shareAutoComplete } from '../../lib/shareResults';

// -- Types --------------------------------------------------------------------

interface AutoCompleteAnswer {
  text: string;
  points: number;
  aliases?: string[];
}

interface AutoCompletePrompt {
  text: string;
  answers: AutoCompleteAnswer[];
}

interface AutoCompleteData {
  league: string;
  prompts: AutoCompletePrompt[];
}

interface Props {
  onBack: () => void;
  onNavigate: (tab: Tab) => void;
  archiveDate?: string;
}

type Phase = 'loading' | 'intro' | 'playing' | 'results';

// -- Constants ----------------------------------------------------------------

const TARGET_SCORE = 300;
const NUM_PROMPTS = 3;
const MAX_STRIKES_PER_PROMPT = 3;
const NUM_ANSWERS_PER_PROMPT = 5;

// -- Answer matching (same as power-play.tsx) ----------------------------------

function normalizeText(s: string): string {
  return s.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
}

function matchAnswer(
  userInput: string,
  answers: AutoCompleteAnswer[],
): { points: number; matchedAnswer: string } {
  const norm = normalizeText(userInput);
  if (!norm) return { points: 0, matchedAnswer: '' };

  let bestMatch = { points: 0, matchedAnswer: '', quality: 0 };

  for (const answer of answers) {
    const candidates = [answer.text, ...(answer.aliases ?? [])];
    for (const candidate of candidates) {
      const candNorm = normalizeText(candidate);
      let quality = 0;

      // 1. Exact match
      if (candNorm === norm) {
        quality = 100;
      }
      // 2. Candidate is fully contained in user input or vice versa
      else if (norm.length >= 3 && candNorm.includes(norm)) {
        const ratio = norm.length / candNorm.length;
        if (ratio >= 0.5) quality = 80 * ratio;
      } else if (candNorm.length >= 3 && norm.includes(candNorm)) {
        const ratio = candNorm.length / norm.length;
        if (ratio >= 0.5) quality = 80 * ratio;
      }

      // 3. Multi-word overlap
      if (quality === 0) {
        const candWords = candNorm.split(' ').filter(w => w.length >= 2);
        const userWords = norm.split(' ').filter(w => w.length >= 2);
        if (candWords.length > 0 && userWords.length > 0) {
          const matchedWords = userWords.filter(uw =>
            candWords.some(cw => cw === uw || (cw.length >= 4 && uw.length >= 4 && (cw.startsWith(uw) || uw.startsWith(cw)))),
          );
          const overlapRatio = matchedWords.length / Math.max(candWords.length, userWords.length);
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

  if (bestMatch.quality >= 30) {
    return { points: bestMatch.points, matchedAnswer: bestMatch.matchedAnswer };
  }
  return { points: 0, matchedAnswer: '' };
}

// -- Component ----------------------------------------------------------------

export default function AutoCompleteScreen({ onBack, archiveDate }: Props) {
  const isArchive = !!archiveDate;
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const s = createStyles(isDark);
  const [selectedLeague, setSelectedLeague] = useState('NBA');
  const [phase, setPhase] = useState<Phase>('loading');
  const [gameData, setGameData] = useState<AutoCompleteData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [alreadyPlayed, setAlreadyPlayed] = useState<{ score: number; xp: number } | null>(null);

  // Playing state
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [strikes, setStrikes] = useState(0);
  // Track which answers have been revealed per prompt: revealedAnswers[promptIdx] = Set of answer texts
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>[]>([]);
  // Points earned per prompt
  const [promptScores, setPromptScores] = useState<number[]>([0, 0, 0]);
  // Whether each prompt is finished (all found, 3 strikes, or passed)
  const [promptFinished, setPromptFinished] = useState<boolean[]>([false, false, false]);
  const inputRef = useRef<TextInput>(null);

  // Results state
  const [totalScore, setTotalScore] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  // Animations
  const promptSlide = useRef(new Animated.Value(0)).current;
  const rowFlash = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const answerFlash = useRef(
    Array.from({ length: NUM_ANSWERS_PER_PROMPT }, () => new Animated.Value(0)),
  ).current;
  const wrongFlash = useRef(new Animated.Value(0)).current;

  // -- Load game data ---------------------------------------------------------

  useEffect(() => {
    setPhase('loading');
    setLoadError(false);
    setGameData(null);
    setCurrentPrompt(0);
    setCurrentInput('');
    setStrikes(0);
    setRevealedAnswers([]);
    setPromptScores([0, 0, 0]);
    setPromptFinished([false, false, false]);
    setRevealedCount(0);
    setAlreadyPlayed(null);

    const fetchGame = isArchive
      ? getArchiveGame(selectedLeague, archiveDate!)
      : getTodaysDailyGame(selectedLeague);

    const checkCompletion = isArchive
      ? Promise.resolve(null)
      : getGameResultToday(selectedLeague, 'auto-complete');

    const localKey = `auto-complete-done-${getTodayEST()}-${selectedLeague}`;
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
      if (!data?.auto_complete) {
        setLoadError(true);
        setPhase('intro');
        return;
      }
      const acData = data.auto_complete as AutoCompleteData;
      // Take only the first NUM_PROMPTS (3) prompts
      const trimmed = { ...acData, prompts: acData.prompts.slice(0, NUM_PROMPTS) };
      setGameData(trimmed);
      setRevealedAnswers(trimmed.prompts.map(() => new Set<string>()));
      setPhase('intro');
    });
  }, [selectedLeague]);

  // -- Game logic -------------------------------------------------------------

  function handleStartGame() {
    setPhase('playing');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  }

  function slideToNextPrompt(nextIndex: number) {
    promptSlide.setValue(40);
    Animated.timing(promptSlide, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
    setCurrentPrompt(nextIndex);
    setCurrentInput('');
    setStrikes(0);
    // Reset answer flash animations for the new prompt
    answerFlash.forEach(v => v.setValue(0));
    setTimeout(() => inputRef.current?.focus(), 250);
  }

  function advanceOrFinish() {
    if (currentPrompt < NUM_PROMPTS - 1) {
      slideToNextPrompt(currentPrompt + 1);
    } else {
      finishGame();
    }
  }

  function handleGuess() {
    if (!gameData) return;
    const input = currentInput.trim();
    if (!input) return;

    const prompt = gameData.prompts[currentPrompt];
    if (!prompt) return;

    // Filter out already-revealed answers so we don't re-match them
    const unrevealed = prompt.answers.filter(
      a => !revealedAnswers[currentPrompt]?.has(a.text),
    );

    const result = matchAnswer(input, unrevealed);

    if (result.points > 0 && result.matchedAnswer) {
      // Correct guess — reveal the answer
      const newRevealed = revealedAnswers.map((s, i) =>
        i === currentPrompt ? new Set(s).add(result.matchedAnswer) : s,
      );
      setRevealedAnswers(newRevealed);

      const newScores = [...promptScores];
      newScores[currentPrompt] += result.points;
      setPromptScores(newScores);

      // Flash the matched answer row
      const matchedIdx = prompt.answers.findIndex(a => a.text === result.matchedAnswer);
      if (matchedIdx >= 0) {
        Animated.sequence([
          Animated.timing(answerFlash[matchedIdx], { toValue: 1, duration: 150, useNativeDriver: true }),
          Animated.timing(answerFlash[matchedIdx], { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start();
      }

      setCurrentInput('');

      // Check if all answers found
      const totalRevealed = newRevealed[currentPrompt].size;
      if (totalRevealed >= prompt.answers.length) {
        // All answers found for this prompt
        const newFinished = [...promptFinished];
        newFinished[currentPrompt] = true;
        setPromptFinished(newFinished);
        setTimeout(() => advanceOrFinish(), 800);
      }
    } else {
      // Wrong guess — add a strike + flash red X
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);
      setCurrentInput('');

      // Big red X flash overlay
      wrongFlash.setValue(0);
      Animated.sequence([
        Animated.timing(wrongFlash, { toValue: 1, duration: 80, useNativeDriver: true }),
        Animated.timing(wrongFlash, { toValue: 0, duration: 380, useNativeDriver: true }),
      ]).start();

      if (newStrikes >= MAX_STRIKES_PER_PROMPT) {
        // Prompt over — reveal remaining answers, wait for user to press NEXT
        const newFinished = [...promptFinished];
        newFinished[currentPrompt] = true;
        setPromptFinished(newFinished);
      }
    }
  }

  function handlePass() {
    const newFinished = [...promptFinished];
    newFinished[currentPrompt] = true;
    setPromptFinished(newFinished);
    // Don't auto-advance — user presses NEXT after seeing answers
  }

  function finishGame() {
    if (!gameData) return;

    const score = promptScores.reduce((sum, s) => sum + s, 0);
    const xp = 500 + score * 5;

    setTotalScore(score);
    setXpEarned(xp);
    setPhase('results');
    // Persist result
    if (!isArchive) {
      // Save locally first — guarantees no replay even for guests/offline
      const localKey = `auto-complete-done-${getTodayEST()}-${selectedLeague}`;
      void AsyncStorage.setItem(localKey, JSON.stringify({ score, xp }));

      void (async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          await saveXPResult(user.id, 'auto-complete', xp, score);
          await updateUserXPAndStreak(user.id, xp, true);
        }
      })();
      void saveCompletionResult(selectedLeague, 'auto-complete', score, xp);
      void updatePlayHour();
    }

    // Sequential reveal animation for results
    rowFlash.forEach(v => v.setValue(0));
    promptScores.forEach((_, i) => {
      setTimeout(() => {
        setRevealedCount(i + 1);
        Animated.sequence([
          Animated.timing(rowFlash[i], { toValue: 1, duration: 150, useNativeDriver: true }),
          Animated.timing(rowFlash[i], { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start();
      }, i * 700 + 400);
    });
  }

  // -- Render helpers ---------------------------------------------------------

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
          <Text style={s.alreadyScoreLabel}>out of {TARGET_SCORE}</Text>
          <View style={s.alreadyDivider} />
          <View style={s.alreadyXpRow}>
            <Text style={s.alreadyXpLabel}>XP EARNED</Text>
            <Text style={s.alreadyXp}>+{alreadyPlayed.xp}</Text>
          </View>
          <Text style={s.alreadyCta}>COME BACK TOMORROW</Text>
          <Text style={s.alreadySub}>
            A new Auto Complete drops every day. Switch leagues to keep playing.
          </Text>
          <MidnightCountdown />
        </View>
      );
    }

    if (loadError || !gameData) {
      return (
        <View style={s.centerState}>
          <Text style={s.errorText}>No Auto Complete available today</Text>
          <Text style={s.errorSub}>Check back tomorrow or switch leagues</Text>
        </View>
      );
    }

    return (
      <View style={s.introCard}>
        <View style={s.introIconWrap}>
          <Type size={36} color={colors.brand} strokeWidth={2} />
        </View>
        <Text style={s.introTitle}>HOW IT WORKS</Text>
        <View style={s.introRules}>
          <Text style={s.introRule}>• 3 search-style prompts</Text>
          <Text style={s.introRule}>• Each prompt has 5 ranked answers</Text>
          <Text style={s.introRule}>• Type guesses to match the top completions</Text>
          <Text style={s.introRule}>• 3 wrong guesses per prompt and it's over</Text>
          <Text style={s.introRule}>• Max score: {TARGET_SCORE} points</Text>
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
    const prompt = gameData.prompts[currentPrompt];
    if (!prompt) return null;

    const isPromptDone = promptFinished[currentPrompt];
    const currentRevealed = revealedAnswers[currentPrompt] ?? new Set<string>();

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={s.playingWrap}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={s.playingScroll}
          contentContainerStyle={s.playingScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* Prompt counter + strikes */}
        <View style={s.topRow}>
          <Text style={s.promptCounter}>
            {currentPrompt + 1} <Text style={s.promptCounterOf}>of {NUM_PROMPTS}</Text>
          </Text>
          <View style={s.strikesRow}>
            {Array.from({ length: MAX_STRIKES_PER_PROMPT }).map((_, i) => (
              <View
                key={i}
                style={[
                  s.strikeBox,
                  i < strikes && s.strikeBoxActive,
                ]}
              >
                <Text
                  style={[
                    s.strikeX,
                    i < strikes && s.strikeXActive,
                  ]}
                >
                  X
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Search bar prompt */}
        <Animated.View
          style={[
            s.searchBarWrap,
            { transform: [{ translateY: promptSlide }] },
          ]}
        >
          <View style={s.searchBar}>
            <Text style={s.searchBarText}>
              {prompt.text}
              <Text style={s.searchBarCursor}> ___</Text>
            </Text>
          </View>
        </Animated.View>

        {/* Answer board — 5 ranked slots */}
        <View style={s.answerBoard}>
          {prompt.answers.map((answer, i) => {
            const isRevealed = currentRevealed.has(answer.text);
            const showUnrevealed = isPromptDone && !isRevealed;

            return (
              <Animated.View
                key={i}
                style={[
                  s.answerSlot,
                  isRevealed && s.answerSlotRevealed,
                  showUnrevealed && s.answerSlotMissed,
                  {
                    opacity: answerFlash[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.3],
                    }),
                  },
                ]}
              >
                <View style={s.answerRankWrap}>
                  <Text style={[s.answerRank, isRevealed && s.answerRankRevealed]}>
                    {i + 1}
                  </Text>
                </View>
                {isRevealed ? (
                  <View style={s.answerContentRow}>
                    <Text style={s.answerText}>{answer.text}</Text>
                    <View style={s.answerPtsBadge}>
                      <Text style={s.answerPtsText}>{answer.points}</Text>
                    </View>
                  </View>
                ) : showUnrevealed ? (
                  <View style={s.answerContentRow}>
                    <Text style={s.answerTextMissed}>{answer.text}</Text>
                    <View style={s.answerPtsBadgeMissed}>
                      <Text style={s.answerPtsTextMissed}>{answer.points}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={s.answerHidden}>
                    <View style={s.answerHiddenBar} />
                  </View>
                )}
              </Animated.View>
            );
          })}
        </View>

        {/* Score for current prompt */}
        <View style={s.promptScoreRow}>
          <Text style={s.promptScoreLabel}>POINTS</Text>
          <Text style={s.promptScoreValue}>{promptScores[currentPrompt]}</Text>
        </View>

        {/* Input + buttons (shown while prompt is active) */}
        {!isPromptDone && (
          <>
            <View style={s.inputWrap}>
              <TextInput
                ref={inputRef}
                style={s.answerInput}
                value={currentInput}
                onChangeText={setCurrentInput}
                placeholder="Type your guess..."
                placeholderTextColor={darkColors.textSecondary}
                returnKeyType="done"
                onSubmitEditing={currentInput.trim() ? handleGuess : undefined}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

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
                onPress={handleGuess}
                disabled={!currentInput.trim()}
              >
                <Text style={s.lockInBtnText}>GUESS</Text>
              </Pressable>
            </View>
          </>
        )}

        {/* NEXT button (shown after 3 strikes or pass — user reviews answers then advances) */}
        {isPromptDone && (
          <Pressable
            style={({ pressed }) => [s.nextPromptBtn, pressed && s.nextPromptBtnPressed]}
            onPress={advanceOrFinish}
          >
            <Text style={s.nextPromptBtnText}>
              {currentPrompt < NUM_PROMPTS - 1 ? 'NEXT' : 'SEE RESULTS'}
            </Text>
          </Pressable>
        )}

        {/* Prompt dots */}
        <View style={s.dotsRow}>
          {Array.from({ length: NUM_PROMPTS }).map((_, i) => (
            <View
              key={i}
              style={[
                s.dot,
                i === currentPrompt && s.dotActive,
                promptFinished[i] && s.dotLocked,
              ]}
            />
          ))}
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  function renderResults() {
    if (!gameData) return null;
    const hitTarget = totalScore >= TARGET_SCORE;

    return (
      <ScrollView
        style={s.resultsScroll}
        contentContainerStyle={s.resultsContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Score header */}
        <View style={s.scoreHeader}>
          <Text style={s.scoreLabel}>FINAL SCORE</Text>
          <Text style={[s.scoreBig, hitTarget && s.scoreBigHit]}>
            {totalScore}
          </Text>
          <Text style={s.scoreTarget}>out of {TARGET_SCORE}</Text>
          {hitTarget && <Text style={s.perfectLabel}>PERFECT GAME!</Text>}
        </View>

        {/* Prompt results */}
        <View style={s.resultsList}>
          {gameData.prompts.map((prompt, i) => {
            const revealed = i < revealedCount;
            const pts = promptScores[i];
            const promptRevealed = revealedAnswers[i] ?? new Set<string>();
            const answersFound = promptRevealed.size;

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
                  <Text style={s.resultQNum}>P{i + 1}</Text>
                  <View style={s.resultTextCol}>
                    <Text style={s.resultQuestion} numberOfLines={2}>{prompt.text}</Text>
                    {revealed ? (
                      <Text style={[s.resultUserAnswer, pts > 0 && s.resultUserAnswerHit]}>
                        {answersFound}/{prompt.answers.length} answers found
                      </Text>
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

        {/* Full answer reveal (after all results revealed) */}
        {revealedCount === NUM_PROMPTS && (
          <View style={s.topAnswersSection}>
            <Text style={s.topAnswersTitle}>ALL ANSWERS</Text>
            {gameData.prompts.map((prompt, i) => {
              const promptRevealed = revealedAnswers[i] ?? new Set<string>();
              return (
                <View key={i} style={s.topAnswersCard}>
                  <Text style={s.topAnswersQText} numberOfLines={2}>{prompt.text}</Text>
                  {prompt.answers.map((ans, j) => {
                    const wasFound = promptRevealed.has(ans.text);
                    return (
                      <View key={j} style={s.topAnswerRow}>
                        <Text style={s.topAnswerRank}>{j + 1}</Text>
                        <Text style={[s.topAnswerText, !wasFound && s.topAnswerTextMissed]}>
                          {ans.text}
                        </Text>
                        <Text style={[s.topAnswerPts, wasFound && s.topAnswerPtsFound]}>
                          {ans.points}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        )}

        {/* XP card */}
        {revealedCount === NUM_PROMPTS && !isArchive && (
          <View style={s.xpCard}>
            <Text style={s.xpCardLabel}>XP EARNED</Text>
            <Text style={s.xpCardTotal}>+{xpEarned}</Text>
            <Text style={s.xpCardBreakdown}>
              500 base + {totalScore} pts x 5
            </Text>
          </View>
        )}

        {isArchive && revealedCount === NUM_PROMPTS && (
          <Text style={s.archiveNotice}>ARCHIVE MODE — Results not saved</Text>
        )}

        {!isArchive && revealedCount === NUM_PROMPTS && (
          <MidnightCountdown />
        )}

        {revealedCount === NUM_PROMPTS && (
          <Pressable
            style={({ pressed }) => [s.shareBtn, pressed && s.shareBtnPressed]}
            onPress={() => {
              const promptsHit = promptScores.filter(s => s > 0).length;
              shareAutoComplete(selectedLeague, totalScore, TARGET_SCORE, promptsHit, NUM_PROMPTS);
            }}
          >
            <Text style={s.shareBtnText}>SHARE RESULTS</Text>
          </Pressable>
        )}

        {/* Notify Friends button */}
        {revealedCount === NUM_PROMPTS && (
          <Pressable
            onPress={() => { void (async () => {
              setNotifyState('sending');
              setNotifyState('done');
              setTimeout(() => setNotifyState('idle'), 3000);
            })(); }}
          >
            </Text>
          </Pressable>
        )}

        {revealedCount === NUM_PROMPTS && (
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

  // -- Main render ------------------------------------------------------------

  return (
    <View style={s.root}>
      {/* Zone 1 */}
      <View style={[s.zone1, { paddingTop: insets.top + 16 }]}>
        <View style={s.zone1TopRow}>
          <Pressable onPress={onBack} hitSlop={8} style={s.backBtn}>
            <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
          </Pressable>
        </View>
        <View style={s.zone1Center}>
          <View style={s.zone1TitleRow}>
            <Type size={20} color={colors.white} strokeWidth={2} />
            <Text style={s.zone1Title}>AUTO COMPLETE</Text>
          </View>
          <Text style={s.zone1Sub}>Sports Google Feud · {TARGET_SCORE} points to win</Text>
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

      {/* Wrong guess overlay — big red X flash */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          s.wrongOverlay,
          { opacity: wrongFlash },
        ]}
      >
        <Text style={s.wrongOverlayX}>✕</Text>
      </Animated.View>
    </View>
  );
}

// -- Styles -------------------------------------------------------------------
// Auto Complete uses a game-show dark style for the board area.

function createStyles(_isDark: boolean) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  wrongOverlay: {
    backgroundColor: 'rgba(220,30,50,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  wrongOverlayX: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 160,
    color: '#FFFFFF',
    lineHeight: 180,
    textAlign: 'center',
  },

  // Zone 1
  zone1: {
    backgroundColor: brand.primary,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
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
    overflow: 'hidden',
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
    flex: 1,
  },
  playingScroll: {
    flex: 1,
  },
  playingScrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'],
    paddingBottom: 120,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  promptCounter: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 22,
    color: darkColors.text,
    letterSpacing: 1,
  },
  promptCounterOf: {
    fontFamily: fonts.bodyMedium,
    fontWeight: '500',
    fontSize: 16,
    color: darkColors.textSecondary,
    letterSpacing: 0,
  },
  strikesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  strikeBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: darkColors.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  strikeBoxActive: {
    backgroundColor: 'rgba(252,52,92,0.15)',
    borderColor: brand.primary,
  },
  strikeX: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 14,
    color: 'rgba(255,255,255,0.15)',
  },
  strikeXActive: {
    color: brand.primary,
  },

  // Search bar prompt
  searchBarWrap: {
    marginBottom: spacing.lg,
  },
  searchBar: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  searchBarText: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '700',
    fontSize: 18,
    color: darkColors.text,
    lineHeight: 26,
  },
  searchBarCursor: {
    color: darkColors.textSecondary,
  },

  // Answer board
  answerBoard: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  answerSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    minHeight: 48,
  },
  answerSlotRevealed: {
    borderColor: 'rgba(0,200,151,0.30)',
    backgroundColor: 'rgba(0,200,151,0.08)',
  },
  answerSlotMissed: {
    borderColor: 'rgba(255,255,255,0.04)',
    opacity: 0.5,
  },
  answerRankWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: darkColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  answerRank: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 13,
    color: darkColors.textSecondary,
  },
  answerRankRevealed: {
    color: colors.accentGreen,
  },
  answerContentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  answerText: {
    flex: 1,
    fontFamily: fonts.bodySemiBold,
    fontWeight: '700',
    fontSize: 15,
    color: darkColors.text,
  },
  answerTextMissed: {
    flex: 1,
    fontFamily: fonts.bodySemiBold,
    fontWeight: '700',
    fontSize: 15,
    color: darkColors.textSecondary,
  },
  answerPtsBadge: {
    minWidth: 40,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(0,200,151,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  answerPtsText: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 14,
    color: colors.accentGreen,
  },
  answerPtsBadgeMissed: {
    minWidth: 40,
    height: 28,
    borderRadius: 8,
    backgroundColor: darkColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  answerPtsTextMissed: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 14,
    color: darkColors.textSecondary,
  },
  answerHidden: {
    flex: 1,
    justifyContent: 'center',
  },
  answerHiddenBar: {
    height: 12,
    borderRadius: 4,
    backgroundColor: darkColors.surface,
    width: '70%',
  },

  // Prompt score
  promptScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  promptScoreLabel: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '700',
    fontSize: 11,
    color: darkColors.textSecondary,
    letterSpacing: 2,
  },
  promptScoreValue: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 20,
    color: darkColors.text,
  },

  // Input
  inputWrap: {
    marginBottom: spacing.md,
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

  // Buttons
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
    backgroundColor: brand.primary,
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

  // Next prompt button (shown after strikes/pass)
  nextPromptBtn: {
    backgroundColor: brand.primary,
    borderRadius: 16,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  nextPromptBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  nextPromptBtnText: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: 2,
  },

  // Dots
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
    backgroundColor: brand.primary,
    borderColor: brand.primary,
  },
  dotLocked: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderColor: 'rgba(255,255,255,0.25)',
  },

  // Results
  resultsScroll: {
    flex: 1,
  },
  resultsContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['3xl'],
    paddingBottom: 120,
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
  scoreTarget: {
    fontFamily: fonts.bodyMedium,
    fontWeight: '500',
    fontSize: 15,
    color: darkColors.textSecondary,
    marginTop: spacing.xs,
  },
  perfectLabel: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 18,
    color: brand.primary,
    letterSpacing: 2,
    marginTop: spacing.md,
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
  topAnswerTextMissed: {
    color: darkColors.textSecondary,
  },
  topAnswerPts: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 14,
    color: darkColors.textSecondary,
  },
  topAnswerPtsFound: {
    color: colors.accentGreen,
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
  shareBtn: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: darkColors.border,
    marginBottom: spacing.md,
  },
  shareBtnPressed: {
    opacity: 0.7,
  },
  shareBtnText: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 15,
    color: darkColors.text,
    letterSpacing: 2,
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
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: 12,
  },
    opacity: 0.7,
  },
    borderColor: 'rgba(0,200,151,0.40)',
    backgroundColor: 'rgba(0,200,151,0.08)',
  },
    fontFamily: fonts.display,
    fontWeight: '900' as const,
    fontSize: 15,
    color: dark.textPrimary,
    letterSpacing: 2,
  },
  });
}

const styles = createStyles(true);
