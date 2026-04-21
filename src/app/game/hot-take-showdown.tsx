import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Users, Crown, Clock, Send, Check, Eye, Tv, Smartphone } from 'lucide-react-native';
import { brand, dark, light, colors, darkColors, fonts, fontFamily, spacing, radius } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import { supabase } from '../../lib/supabase';
import PrimaryButton from '../../screens/components/ui/PrimaryButton';
import GhostButton from '../../screens/components/ui/GhostButton';
import {
  createLobby,
  joinLobby,
  leaveLobby,
  getLobbyPlayers,
  updateLobbySettings,
  updateLobbyStatus,
  togglePlayerReady,
  type GameLobby,
  type LobbyPlayer,
} from '../../lib/multiplayer';
import { useLobby, type PresencePlayer } from '../../hooks/useLobby';
import { JoinLobby } from '../../components/multiplayer/JoinLobby';
import { LobbyScreen } from '../../components/multiplayer/LobbyScreen';

import promptsData from '../../data/hot-take-prompts.json';

// ─── Types ────────────────────────────────────────────────────────────────────

type LeagueOption = 'NFL' | 'NBA' | 'MLB' | 'NHL';

interface Prompt {
  id: string;
  text: string;
  type: 'funny' | 'debate';
  leagues: string[];
}

interface Matchup {
  promptId: string;
  promptText: string;
  playerA: number; // player index
  playerB: number; // player index
  answerA: string | null;
  answerB: string | null;
  votes: Record<number, 'A' | 'B'>; // voterIndex -> vote
  audienceVotes: { A: number; B: number };
}

interface PlayerPromptAssignment {
  matchupIndex: number;
  side: 'A' | 'B';
  promptText: string;
}

type Phase =
  | 'setup'
  | 'lobby'
  | 'answering'
  | 'voting'
  | 'reveal'
  | 'leaderboard'
  | 'final-answering'
  | 'final-voting'
  | 'final-reveal'
  | 'results';
type Role = 'host-tv' | 'player' | 'audience';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getFilteredPrompts(leagues: LeagueOption[]): Prompt[] {
  return (promptsData as Prompt[]).filter(p =>
    p.leagues.some(l => leagues.includes(l as LeagueOption)) ||
    p.leagues.length === 4 // cross-sport prompts always included
  );
}

/**
 * Build head-to-head matchups for a round.
 * Each player gets exactly 2 prompts. Total matchups = number of players.
 * Each prompt is shared between exactly 2 players (head-to-head).
 * No player matched against themselves; a player's 2 prompts are against 2 different opponents.
 *
 * Algorithm: generate a round-robin-style pairing where each player appears in exactly 2 matchups.
 * We treat player indices as nodes and create a 2-regular graph (each node has degree 2).
 */
function buildMatchups(prompts: Prompt[], players: number[]): Matchup[] {
  const n = players.length;
  if (n < 2) return [];

  // For n players we need exactly n matchups (each player appears in 2).
  // We create a cycle: player[0]->player[1], player[1]->player[2], ... player[n-1]->player[0]
  // That gives n matchups and each player appears exactly twice.
  const shuffledPlayers = shuffleArray(players);
  const matchups: Matchup[] = [];

  for (let i = 0; i < n; i++) {
    const pA = shuffledPlayers[i];
    const pB = shuffledPlayers[(i + 1) % n];
    const prompt = prompts[i % prompts.length];
    matchups.push({
      promptId: prompt.id,
      promptText: prompt.text,
      playerA: pA,
      playerB: pB,
      answerA: null,
      answerB: null,
      votes: {},
      audienceVotes: { A: 0, B: 0 },
    });
  }

  return matchups;
}

/**
 * Get which prompts a specific player needs to answer for a round's matchups.
 * Returns array of { matchupIndex, side, promptText }.
 */
function getPlayerAssignments(matchups: Matchup[], playerIndex: number): PlayerPromptAssignment[] {
  const assignments: PlayerPromptAssignment[] = [];
  matchups.forEach((m, idx) => {
    if (m.playerA === playerIndex) {
      assignments.push({ matchupIndex: idx, side: 'A', promptText: m.promptText });
    } else if (m.playerB === playerIndex) {
      assignments.push({ matchupIndex: idx, side: 'B', promptText: m.promptText });
    }
  });
  return assignments;
}

const ANSWER_TIME = 45; // seconds
const VOTE_TIME = 15; // seconds
const REVEAL_PAUSE = 5; // seconds before auto-advancing to next matchup
const PROMPT_PAUSE = 3; // seconds to show prompt+answers before opening voting

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
  onNavigate: (tab: string) => void;
  archiveDate?: string;
  joinedLobby?: { lobbyId: string; playerIndex: number; code: string; gameType: string };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function HotTakeShowdownScreen({ onBack, onNavigate, joinedLobby }: Props) {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isTVMode = Platform.OS === 'web' && screenWidth > 1024;

  // ── Setup state ──
  const [selectedLeagues, setSelectedLeagues] = useState<LeagueOption[]>(['NFL', 'NBA', 'MLB', 'NHL']);
  const [role, setRole] = useState<Role>(isTVMode ? 'host-tv' : 'player');

  // ── Game state ──
  const [phase, setPhase] = useState<Phase>('setup');
  const [round, setRound] = useState(1); // 1, 2, or 3
  const [currentMatchupIndex, setCurrentMatchupIndex] = useState(0);
  const [roundMatchups, setRoundMatchups] = useState<Matchup[][]>([[], [], []]); // 3 rounds
  const [scores, setScores] = useState<Record<number, number>>({}); // playerIndex -> score
  const [playerNames, setPlayerNames] = useState<Record<number, string>>({}); // playerIndex -> name
  const [timer, setTimer] = useState(ANSWER_TIME);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Player input state (now supports 2 prompts at once) ──
  const [myAnswers, setMyAnswers] = useState<Record<number, string>>({}); // matchupIndex -> answer
  const [myVote, setMyVote] = useState<'A' | 'B' | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // ── Final round state ──
  const [finalPrompt, setFinalPrompt] = useState<Prompt | null>(null);
  const [finalAnswers, setFinalAnswers] = useState<Record<number, string>>({}); // playerIndex -> answer
  const [finalVotes, setFinalVotes] = useState<Record<number, number>>({}); // voterIndex -> answerPlayerIndex
  const [finalAudienceVotes, setFinalAudienceVotes] = useState<Record<number, number>>({}); // answerPlayerIndex -> count
  const [myFinalAnswer, setMyFinalAnswer] = useState('');

  // ── Online state ──
  const [lobbyCode, setLobbyCode] = useState<string | null>(null);
  const [lobbyId, setLobbyId] = useState<string | null>(null);
  const [myPlayerIndex, setMyPlayerIndex] = useState(0);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [lobby, setLobby] = useState<GameLobby | null>(null);
  const [lobbyPlayers, setLobbyPlayers] = useState<LobbyPlayer[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [onlineLoading, setOnlineLoading] = useState(false);
  const [onlineError, setOnlineError] = useState<string | null>(null);
  const [isAudience, setIsAudience] = useState(false);
  const [audienceCount, setAudienceCount] = useState(0);

  // ── Auth state ──
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        setDisplayName(user.user_metadata?.display_name || user.email?.split('@')[0] || 'Player');
      }
    });
  }, []);

  // ── useLobby hook ──
  const { presencePlayers, isConnected, broadcast, onEvent } = useLobby({
    code: lobbyCode,
    displayName,
    userId,
    playerIndex: myPlayerIndex,
  });

  // ── Refresh lobby players when presence changes (new player joins/leaves) ──
  useEffect(() => {
    if (!lobbyId) return;
    getLobbyPlayers(lobbyId).then(players => {
      setLobbyPlayers(players);
    }).catch(() => {});
  }, [presencePlayers.length, lobbyId]);

  // ── Timer logic ──
  const startTimer = useCallback((seconds: number, onExpire: () => void) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(seconds);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearAutoAdvance = useCallback(() => {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, []);

  // ── Lobby creation (host) ──
  const handleCreateLobby = useCallback(async () => {
    if (!userId) return;
    setOnlineLoading(true);
    try {
      const result = await createLobby('hot-take-showdown' as any, userId, displayName);
      setLobbyCode(result.code);
      setLobbyId(result.lobbyId);
      setIsHost(true);
      setMyPlayerIndex(0);
      setPhase('lobby');

      const players = await getLobbyPlayers(result.lobbyId);
      setLobbyPlayers(players);
      const me = players.find(p => p.player_index === 0);
      setMyPlayerId(me?.id || null);
      setLobby({
        id: result.lobbyId,
        code: result.code,
        game_type: 'hot-take-showdown' as any,
        host_user_id: userId,
        status: 'waiting',
        settings: { leagues: selectedLeagues },
        game_state: {},
      });
    } catch (e: any) {
      setOnlineError(e.message || 'Failed to create lobby');
    } finally {
      setOnlineLoading(false);
    }
  }, [userId, displayName, selectedLeagues]);

  // ── Join success handler ──
  const handleJoinSuccess = useCallback(async (joinedLobbyId: string, joinedPlayerIndex: number, joinedCode: string) => {
    setLobbyId(joinedLobbyId);
    setMyPlayerIndex(joinedPlayerIndex);
    setLobbyCode(joinedCode);
    setPhase('lobby');
    try {
      const players = await getLobbyPlayers(joinedLobbyId);
      setLobbyPlayers(players);
      const me = players.find(p => p.player_index === joinedPlayerIndex);
      setMyPlayerId(me?.id || null);
      setLobby({
        id: joinedLobbyId,
        code: joinedCode,
        game_type: 'hot-take-showdown' as any,
        host_user_id: '',
        status: 'waiting',
        settings: {},
        game_state: {},
      });
    } catch (e: any) {
      setOnlineError(e.message || 'Failed to load lobby');
    }
  }, []);

  // ── Toggle ready ──
  const handleToggleReady = useCallback(async () => {
    if (!myPlayerId) return;
    const newReady = !isReady;
    setIsReady(newReady);
    try {
      await togglePlayerReady(myPlayerId, newReady);
      broadcast('player:ready', { playerIndex: myPlayerIndex, isReady: newReady });
      if (lobbyId) {
        const players = await getLobbyPlayers(lobbyId);
        setLobbyPlayers(players);
      }
    } catch (e: any) {
      setIsReady(!newReady);
      setOnlineError(e.message || 'Failed to toggle ready');
    }
  }, [myPlayerId, isReady, myPlayerIndex, broadcast, lobbyId]);

  // ──────────────────────────────────────────────────────────────────────────
  // HOST: Auto-advancing flow for voting → reveal → next matchup
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Called by the host after the answering phase ends.
   * Kicks off the auto-advancing loop:
   *   show prompt+answers (PROMPT_PAUSE) → open voting (VOTE_TIME) → show reveal (REVEAL_PAUSE)
   *   → next matchup or leaderboard
   */
  // Use refs to track flow state so auto-advance timers always have fresh data
  const roundRef = useRef(1);
  const matchupIndexRef = useRef(0);
  const roundMatchupsRef = useRef<Matchup[][]>([[], [], []]);

  // Keep refs in sync with state
  useEffect(() => { roundRef.current = round; }, [round]);
  useEffect(() => { matchupIndexRef.current = currentMatchupIndex; }, [currentMatchupIndex]);
  useEffect(() => { roundMatchupsRef.current = roundMatchups; }, [roundMatchups]);

  const advanceToVoting = useCallback((r: number, mIdx: number) => {
    broadcast('game:phase', { phase: 'voting', round: r, matchupIndex: mIdx });
    setPhase('voting');
    setCurrentMatchupIndex(mIdx);
    setMyVote(null);
    setHasVoted(false);
    setTimer(0);

    // After PROMPT_PAUSE, open voting
    autoAdvanceRef.current = setTimeout(() => {
      broadcast('game:phase', { phase: 'voting', round: r, matchupIndex: mIdx, timer: VOTE_TIME, votingOpen: true });
      setTimer(VOTE_TIME);
      startTimer(VOTE_TIME, () => {
        // Voting closed — show reveal
        advanceToReveal(r, mIdx);
      });
    }, PROMPT_PAUSE * 1000);
  }, [broadcast, startTimer]);

  const advanceToReveal = useCallback((r: number, mIdx: number) => {
    stopTimer();
    broadcast('game:phase', { phase: 'reveal', round: r, matchupIndex: mIdx });
    setPhase('reveal');
    setCurrentMatchupIndex(mIdx);

    // Calculate scores
    broadcast('game:calc_scores', { round: r, matchupIndex: mIdx });

    // Auto-advance after REVEAL_PAUSE
    autoAdvanceRef.current = setTimeout(() => {
      const matchups = roundMatchupsRef.current[r - 1] || [];
      if (mIdx < matchups.length - 1) {
        advanceToVoting(r, mIdx + 1);
      } else {
        broadcast('game:phase', { phase: 'leaderboard', round: r });
        setPhase('leaderboard');
      }
    }, REVEAL_PAUSE * 1000);
  }, [broadcast, stopTimer]);

  // ── Start game (host only) ──
  const handleStartGame = useCallback(async () => {
    if (!isHost || !lobbyId) return;

    // Build player name map — exclude the host (they're on TV, not playing)
    const nameMap: Record<number, string> = {};
    lobbyPlayers.forEach(p => {
      if (p.is_host) return;
      nameMap[p.player_index] = p.display_name;
    });

    const activePlayers = Object.keys(nameMap).map(Number);
    const playerCount = activePlayers.length;
    if (playerCount < 2) {
      setOnlineError('Need at least 2 players (plus the TV host) to start');
      return;
    }

    // Get filtered prompts and generate head-to-head matchups for all 3 rounds
    const filteredPrompts = getFilteredPrompts(selectedLeagues);
    const shuffled = shuffleArray(filteredPrompts);

    // Round 1: N matchups (each player gets 2 prompts)
    const promptsR1 = shuffled.slice(0, playerCount);
    const round1 = buildMatchups(promptsR1, activePlayers);

    // Round 2: N matchups with different shuffling
    const promptsR2 = shuffled.slice(playerCount, playerCount * 2);
    const round2 = buildMatchups(promptsR2, activePlayers);

    // Final round: one prompt for everyone
    const finalIdx = playerCount * 2;
    const finalP = shuffled[finalIdx] || shuffled[0];

    const initScores: Record<number, number> = {};
    activePlayers.forEach(i => { initScores[i] = 0; });
    // Broadcast game start with all matchup data
    broadcast('game:start', {
      round1,
      round2,
      finalPrompt: finalP,
      playerNames: nameMap,
      scores: initScores,
    });

    await updateLobbyStatus(lobbyId, 'playing');

    setRoundMatchups([round1, round2, []]);
    setFinalPrompt(finalP);
    setPlayerNames(nameMap);
    setScores(initScores);
    setRound(1);
    setCurrentMatchupIndex(0);
    setPhase('answering');
    setMyAnswers({});
    setHasSubmitted(false);

    // Start answer timer — all players answer simultaneously
    startTimer(ANSWER_TIME, () => {
      // Timer expired — move to voting flow (auto-advancing per matchup)
      broadcast('game:answers_closed', { round: 1 });
    });
  }, [isHost, lobbyId, lobbyPlayers, selectedLeagues, broadcast, startTimer]);

  // ── Listen for game events ──
  useEffect(() => {
    if (!lobbyCode) return;

    // Refresh player list when someone toggles ready
    const unsubReady = onEvent('player:ready', () => {
      if (lobbyId) {
        getLobbyPlayers(lobbyId).then(players => setLobbyPlayers(players)).catch(() => {});
      }
    });

    const unsubStart = onEvent('game:start', (payload: any) => {
      setRoundMatchups([payload.round1, payload.round2, []]);
      setFinalPrompt(payload.finalPrompt);
      setPlayerNames(payload.playerNames);
      setScores(payload.scores);
      setRound(1);
      setCurrentMatchupIndex(0);
      setPhase('answering');
      setMyAnswers({});
      setHasSubmitted(false);

      startTimer(ANSWER_TIME, () => {});
    });

    // Player submitted an answer for a specific matchup
    const unsubAnswer = onEvent('game:answer', (payload: any) => {
      const { round: r, matchupIndex, playerIndex: pIdx, answer } = payload;
      setRoundMatchups(prev => {
        const updated = [...prev];
        const matchup = { ...updated[r - 1][matchupIndex] };
        if (pIdx === matchup.playerA) matchup.answerA = answer;
        if (pIdx === matchup.playerB) matchup.answerB = answer;
        updated[r - 1] = [...updated[r - 1]];
        updated[r - 1][matchupIndex] = matchup;
        return updated;
      });
    });

    const unsubVote = onEvent('game:vote', (payload: any) => {
      const { round: r, matchupIndex, voterIndex, vote: v, isAudience: isAud } = payload;
      setRoundMatchups(prev => {
        const updated = [...prev];
        const matchup = { ...updated[r - 1][matchupIndex] };
        if (isAud) {
          matchup.audienceVotes = { ...matchup.audienceVotes };
          matchup.audienceVotes[v as 'A' | 'B'] += 1;
        } else {
          matchup.votes = { ...matchup.votes, [voterIndex]: v };
        }
        updated[r - 1] = [...updated[r - 1]];
        updated[r - 1][matchupIndex] = matchup;
        return updated;
      });
    });

    const unsubPhase = onEvent('game:phase', (payload: any) => {
      setPhase(payload.phase);
      if (payload.round) setRound(payload.round);
      if (payload.matchupIndex !== undefined) setCurrentMatchupIndex(payload.matchupIndex);
      if (payload.timer) {
        setTimer(payload.timer);
        startTimer(payload.timer, () => {});
      } else if (payload.phase === 'reveal' || payload.phase === 'leaderboard' || payload.phase === 'final-reveal' || payload.phase === 'results') {
        // No timer for these phases
        setTimer(0);
      }
      // Reset per-phase input state
      if (payload.phase === 'answering' || payload.phase === 'final-answering') {
        setMyAnswers({});
        setMyFinalAnswer('');
        setHasSubmitted(false);
      }
      if (payload.phase === 'voting' || payload.phase === 'final-voting') {
        setMyVote(null);
        setHasVoted(false);
      }
    });

    // Host signals answers are closed — triggers the auto-advancing matchup flow
    const unsubAnswersClosed = onEvent('game:answers_closed', (payload: any) => {
      // Only the host drives the auto-advancing flow
      // Players just respond to phase changes
    });

    const unsubFinalAnswer = onEvent('game:final_answer', (payload: any) => {
      setFinalAnswers(prev => ({ ...prev, [payload.playerIndex]: payload.answer }));
    });

    const unsubFinalVote = onEvent('game:final_vote', (payload: any) => {
      if (payload.isAudience) {
        setFinalAudienceVotes(prev => ({
          ...prev,
          [payload.votedFor]: (prev[payload.votedFor] || 0) + 1,
        }));
      } else {
        setFinalVotes(prev => ({ ...prev, [payload.voterIndex]: payload.votedFor }));
      }
    });

    const unsubScores = onEvent('game:scores', (payload: any) => {
      setScores(payload.scores);
    });

    // Host-only: calculate scores for a matchup during reveal
    const unsubCalcScores = onEvent('game:calc_scores', (payload: any) => {
      // All clients calculate and update scores locally
      const { round: r, matchupIndex: mIdx } = payload;
      setRoundMatchups(prev => {
        const matchup = prev[r - 1]?.[mIdx];
        if (!matchup) return prev;

        const totalVotesA = Object.values(matchup.votes).filter(v => v === 'A').length + matchup.audienceVotes.A;
        const totalVotesB = Object.values(matchup.votes).filter(v => v === 'B').length + matchup.audienceVotes.B;
        const total = totalVotesA + totalVotesB;
        const pctA = total > 0 ? totalVotesA / total : 0.5;
        const pctB = total > 0 ? totalVotesB / total : 0.5;

        const multiplier = r === 1 ? 1000 : r === 2 ? 2000 : 3000;

        setScores(prevScores => {
          const newScores = { ...prevScores };
          newScores[matchup.playerA] = (newScores[matchup.playerA] || 0) + Math.round(pctA * multiplier);
          newScores[matchup.playerB] = (newScores[matchup.playerB] || 0) + Math.round(pctB * multiplier);
          // Host broadcasts the new scores
          if (isHost) {
            broadcast('game:scores', { scores: newScores });
          }
          return newScores;
        });

        return prev;
      });
    });

    return () => {
      unsubReady(); unsubStart(); unsubAnswer(); unsubVote(); unsubPhase();
      unsubAnswersClosed(); unsubFinalAnswer(); unsubFinalVote(); unsubScores(); unsubCalcScores();
    };
  }, [lobbyCode, onEvent, startTimer, isHost, broadcast]);

  // ── Host: when answers_closed fires, kick off the per-matchup auto-advance chain ──
  useEffect(() => {
    if (!lobbyCode || !isHost) return;

    const unsubAnswersClosed = onEvent('game:answers_closed', (payload: any) => {
      const r = payload.round;
      stopTimer();

      if (r <= 2) {
        const matchups = roundMatchups[r - 1] || [];
        if (matchups.length > 0) {
          advanceToVoting(r, 0);
        }
      }
    });

    return () => { unsubAnswersClosed(); };
  }, [lobbyCode, isHost, onEvent, stopTimer, advanceToVoting]);

  // ── Submit answers (player submits both prompts at once) ──
  const handleSubmitAnswers = useCallback(() => {
    if (hasSubmitted) return;

    const matchups = roundMatchups[round - 1] || [];
    const assignments = getPlayerAssignments(matchups, myPlayerIndex);

    // Check all answers are filled
    const allFilled = assignments.every(a => (myAnswers[a.matchupIndex] || '').trim().length > 0);
    if (!allFilled) return;

    setHasSubmitted(true);

    // Broadcast each answer individually
    assignments.forEach(a => {
      broadcast('game:answer', {
        round,
        matchupIndex: a.matchupIndex,
        playerIndex: myPlayerIndex,
        answer: (myAnswers[a.matchupIndex] || '').trim(),
      });
    });
  }, [hasSubmitted, roundMatchups, round, myPlayerIndex, myAnswers, broadcast]);

  // ── Submit final round answer ──
  const handleSubmitFinalAnswer = useCallback(() => {
    if (hasSubmitted || !myFinalAnswer.trim()) return;
    setHasSubmitted(true);
    broadcast('game:final_answer', {
      playerIndex: myPlayerIndex,
      answer: myFinalAnswer.trim(),
    });
  }, [hasSubmitted, myFinalAnswer, myPlayerIndex, broadcast]);

  // ── Submit vote ──
  const handleVote = useCallback((vote: 'A' | 'B') => {
    if (hasVoted) return;
    setMyVote(vote);
    setHasVoted(true);

    broadcast('game:vote', {
      round,
      matchupIndex: currentMatchupIndex,
      voterIndex: myPlayerIndex,
      vote,
      isAudience,
    });
  }, [hasVoted, round, currentMatchupIndex, myPlayerIndex, broadcast, isAudience]);

  // ── Submit final round vote ──
  const handleFinalVote = useCallback((votedForIndex: number) => {
    if (hasVoted) return;
    setHasVoted(true);

    broadcast('game:final_vote', {
      voterIndex: myPlayerIndex,
      votedFor: votedForIndex,
      isAudience,
    });
  }, [hasVoted, myPlayerIndex, broadcast, isAudience]);

  // ── Host: advance phases that require manual click ──
  const handleHostAdvance = useCallback(() => {
    if (!isHost) return;
    stopTimer();
    clearAutoAdvance();

    if (phase === 'answering') {
      // Skip to matchup voting flow early
      broadcast('game:answers_closed', { round });
    } else if (phase === 'leaderboard') {
      if (round < 3) {
        const nextRound = round + 1;
        setRound(nextRound);
        setCurrentMatchupIndex(0);
        if (nextRound === 3) {
          // Final round — everyone answers the same prompt
          broadcast('game:phase', { phase: 'final-answering', round: 3, timer: ANSWER_TIME });
          setPhase('final-answering');
          setMyFinalAnswer('');
          setHasSubmitted(false);
          setFinalAnswers({});
          setFinalVotes({});
          setFinalAudienceVotes({});
          startTimer(ANSWER_TIME, () => {
            // Timer expired — move to final voting
            broadcast('game:phase', { phase: 'final-voting', round: 3, timer: VOTE_TIME });
            setPhase('final-voting');
            setHasVoted(false);
            startTimer(VOTE_TIME, () => {
              // Final voting closed — show reveal
              handleFinalReveal();
            });
          });
        } else {
          broadcast('game:phase', { phase: 'answering', round: nextRound, matchupIndex: 0, timer: ANSWER_TIME });
          setPhase('answering');
          setMyAnswers({});
          setHasSubmitted(false);
          startTimer(ANSWER_TIME, () => {
            broadcast('game:answers_closed', { round: nextRound });
          });
        }
      }
    } else if (phase === 'final-answering') {
      // Skip to final voting
      broadcast('game:phase', { phase: 'final-voting', round: 3, timer: VOTE_TIME });
      setPhase('final-voting');
      setHasVoted(false);
      startTimer(VOTE_TIME, () => {
        handleFinalReveal();
      });
    } else if (phase === 'final-voting') {
      handleFinalReveal();
    } else if (phase === 'results') {
      // Play again — go back to lobby
      broadcast('game:phase', { phase: 'lobby' });
      setPhase('lobby');
      setRound(1);
      setCurrentMatchupIndex(0);
      setScores({});
      setRoundMatchups([[], [], []]);
      setFinalAnswers({});
      setFinalVotes({});
      setFinalAudienceVotes({});
    }
  }, [isHost, phase, round, broadcast, startTimer, stopTimer, clearAutoAdvance]);

  // ── Final reveal + score calculation ──
  const handleFinalReveal = useCallback(() => {
    stopTimer();

    // Calculate final round scores (3x points)
    const newScores = { ...scores };
    const allPlayers = Object.keys(playerNames).map(Number);
    const voteCounts: Record<number, number> = {};
    allPlayers.forEach(p => { voteCounts[p] = 0; });

    Object.values(finalVotes).forEach(votedFor => {
      voteCounts[votedFor] = (voteCounts[votedFor] || 0) + 1;
    });
    Object.entries(finalAudienceVotes).forEach(([pIdx, count]) => {
      voteCounts[Number(pIdx)] = (voteCounts[Number(pIdx)] || 0) + count;
    });

    const totalVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0);
    allPlayers.forEach(p => {
      const pct = totalVotes > 0 ? voteCounts[p] / totalVotes : 0;
      newScores[p] = (newScores[p] || 0) + Math.round(pct * 3000);
    });

    setScores(newScores);
    broadcast('game:scores', { scores: newScores });
    broadcast('game:phase', { phase: 'final-reveal', round: 3 });
    setPhase('final-reveal');

    // Auto-advance to results after REVEAL_PAUSE
    autoAdvanceRef.current = setTimeout(() => {
      broadcast('game:phase', { phase: 'results' });
      setPhase('results');
    }, REVEAL_PAUSE * 1000);
  }, [scores, playerNames, finalVotes, finalAudienceVotes, broadcast, stopTimer]);

  // ── Leave ──
  const handleLeave = useCallback(async () => {
    stopTimer();
    clearAutoAdvance();
    if (lobbyId && myPlayerId) {
      try { await leaveLobby(lobbyId, myPlayerId); } catch {}
    }
    setLobbyCode(null);
    setLobbyId(null);
    setMyPlayerId(null);
    setLobby(null);
    setLobbyPlayers([]);
    setIsHost(false);
    setIsReady(false);
    setPhase('setup');
    setRound(1);
    setCurrentMatchupIndex(0);
    setScores({});
    setRoundMatchups([[], [], []]);
    onBack();
  }, [lobbyId, myPlayerId, stopTimer, clearAutoAdvance, onBack]);

  // ── Derived ──
  const t = isDark ? dark : light;
  const matchups = roundMatchups[round - 1] || [];
  const currentMatchup = matchups[currentMatchupIndex];
  const isMyMatchup = currentMatchup && (currentMatchup.playerA === myPlayerIndex || currentMatchup.playerB === myPlayerIndex);
  const myAssignments = getPlayerAssignments(matchups, myPlayerIndex);
  const sortedScores = Object.entries(scores)
    .map(([idx, score]) => ({ index: Number(idx), name: playerNames[Number(idx)] || `Player ${Number(idx) + 1}`, score }))
    .sort((a, b) => b.score - a.score);

  // Helper for vote percentages in reveal
  const getMatchupVotePcts = (matchup: Matchup) => {
    const totalVotesA = Object.values(matchup.votes).filter(v => v === 'A').length + matchup.audienceVotes.A;
    const totalVotesB = Object.values(matchup.votes).filter(v => v === 'B').length + matchup.audienceVotes.B;
    const total = totalVotesA + totalVotesB;
    const pctA = total > 0 ? Math.round((totalVotesA / total) * 100) : 50;
    const pctB = total > 0 ? Math.round((totalVotesB / total) * 100) : 50;
    return { pctA, pctB, totalVotesA, totalVotesB, total };
  };

  // ─── RENDER: Setup ─────────────────────────────────────────────────────────

  if (phase === 'setup') {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: t.background }]} edges={['top']}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.setupContent} showsVerticalScrollIndicator={false}>
          <Pressable onPress={onBack} style={styles.backBtn} hitSlop={12}>
            <ArrowLeft size={24} color={t.textPrimary} />
          </Pressable>

          <View style={styles.setupHeader}>
            <Tv size={48} color={brand.primary} strokeWidth={1.5} />
            <Text style={[styles.setupTitle, { color: t.textPrimary }]}>Hot Take Showdown</Text>
            <Text style={[styles.setupSubtitle, { color: t.textSecondary }]}>
              Party game for 3-8 players.{'\n'}Display on a TV, play from your phones.
            </Text>
          </View>

          {/* League Selection */}
          <Text style={[styles.sectionLabel, { color: t.textPrimary }]}>Select Leagues</Text>
          <View style={styles.leagueRow}>
            {(['NFL', 'NBA', 'MLB', 'NHL'] as LeagueOption[]).map(league => {
              const selected = selectedLeagues.includes(league);
              return (
                <Pressable
                  key={league}
                  onPress={() => {
                    if (selected && selectedLeagues.length > 1) {
                      setSelectedLeagues(prev => prev.filter(l => l !== league));
                    } else if (!selected) {
                      setSelectedLeagues(prev => [...prev, league]);
                    }
                  }}
                  style={[
                    styles.leagueChip,
                    { borderColor: selected ? brand.primary : t.cardBorder, backgroundColor: selected ? brand.primary : t.card },
                  ]}
                >
                  <Text style={[styles.leagueChipText, { color: selected ? '#FFF' : t.textPrimary }]}>{league}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Role Selection */}
          <Text style={[styles.sectionLabel, { color: t.textPrimary, marginTop: 24 }]}>Your Role</Text>
          <View style={styles.roleRow}>
            <Pressable
              onPress={() => {
                setRole('host-tv');
                // Clear any previous join state
                setLobbyCode(null);
                setLobbyId(null);
                setIsAudience(false);
              }}
              style={[
                styles.roleCard,
                { borderColor: role === 'host-tv' ? brand.primary : t.cardBorder, backgroundColor: t.card },
              ]}
            >
              <Tv size={28} color={role === 'host-tv' ? brand.primary : t.textSecondary} />
              <Text style={[styles.roleLabel, { color: role === 'host-tv' ? brand.primary : t.textPrimary }]}>TV Host</Text>
              <Text style={[styles.roleDesc, { color: t.textSecondary }]}>Display on the big screen</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setRole('player');
                setLobbyCode(null);
                setLobbyId(null);
                setLobby(null);
                setIsHost(false);
                setIsAudience(false);
                // Go directly to code entry
                setPhase('lobby');
              }}
              style={[
                styles.roleCard,
                { borderColor: role === 'player' ? brand.primary : t.cardBorder, backgroundColor: t.card },
              ]}
            >
              <Smartphone size={28} color={role === 'player' ? brand.primary : t.textSecondary} />
              <Text style={[styles.roleLabel, { color: role === 'player' ? brand.primary : t.textPrimary }]}>Player</Text>
              <Text style={[styles.roleDesc, { color: t.textSecondary }]}>Play from your phone</Text>
            </Pressable>
          </View>
          <Pressable
            onPress={() => {
              setRole('audience');
              setLobbyCode(null);
              setLobbyId(null);
              setLobby(null);
              setIsHost(false);
              setIsAudience(true);
              setPhase('lobby');
            }}
            style={[styles.audienceBtn, { borderColor: t.cardBorder }]}
          >
            <Eye size={18} color={t.textSecondary} />
            <Text style={[styles.audienceBtnText, { color: t.textSecondary }]}>Join as Audience (vote only)</Text>
          </Pressable>

          {onlineError && <Text style={styles.errorText}>{onlineError}</Text>}

          <View style={{ marginTop: 32, gap: 12, paddingBottom: 140 }}>
            <PrimaryButton label="CREATE GAME" onPress={handleCreateLobby} loading={onlineLoading} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── RENDER: Join ──────────────────────────────────────────────────────────

  if (phase === 'lobby' && !lobbyCode && (role === 'player' || role === 'audience')) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: t.background }]}>
        <JoinLobby
          onJoin={(joinedLobbyId, joinedPlayerIndex, joinedCode) => {
            handleJoinSuccess(joinedLobbyId, joinedPlayerIndex, joinedCode);
          }}
          onBack={() => { setPhase('setup'); setIsAudience(false); }}
        />
      </SafeAreaView>
    );
  }

  // ─── RENDER: Lobby (host & players) ────────────────────────────────────────

  if (phase === 'lobby' && lobbyCode && lobby) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: t.background }]} edges={['top']}>
        <LobbyScreen
          lobby={lobby}
          players={lobbyPlayers}
          presencePlayers={presencePlayers}
          isHost={isHost}
          isReady={isReady}
          onToggleReady={handleToggleReady}
          onStart={handleStartGame}
          onLeave={handleLeave}
          onUpdateSettings={(settings) => {
            if (settings.leagues) setSelectedLeagues(settings.leagues as LeagueOption[]);
          }}
          renderSettings={(settings, hostFlag) => (
            <View>
              <Text style={[styles.settingsLabel, { color: t.textSecondary }]}>
                Leagues: {selectedLeagues.join(', ')}
              </Text>
              {role === 'host-tv' && (
                <View style={styles.tvBadge}>
                  <Tv size={16} color={brand.primary} />
                  <Text style={[styles.tvBadgeText, { color: brand.primary }]}>TV Mode Active</Text>
                </View>
              )}
            </View>
          )}
        />
      </SafeAreaView>
    );
  }

  // ─── RENDER: TV Host View (web big screen) ─────────────────────────────────

  if (role === 'host-tv') {
    const roundMultiplierLabel = round === 1 ? '1x' : round === 2 ? '2x' : '3x';

    return (
      <View style={[styles.tvRoot, { backgroundColor: '#0F0F0F' }]}>
        {/* Header */}
        <View style={styles.tvHeader}>
          <Text style={styles.tvTitle}>HOT TAKE SHOWDOWN</Text>
          <View style={styles.tvRoundBadge}>
            <Text style={styles.tvRoundText}>
              {phase === 'results' ? 'FINAL RESULTS' : `ROUND ${round} OF 3`}
            </Text>
          </View>
          {round <= 2 && phase !== 'leaderboard' && phase !== 'results' && (
            <View style={styles.tvMultiplierBadge}>
              <Text style={styles.tvMultiplierText}>{roundMultiplierLabel} POINTS</Text>
            </View>
          )}
          {timer > 0 && (phase === 'answering' || phase === 'voting' || phase === 'final-answering' || phase === 'final-voting') && (
            <View style={styles.tvTimerContainer}>
              <Clock size={20} color={timer <= 5 ? brand.primary : '#FFF'} />
              <Text style={[styles.tvTimerText, timer <= 5 && { color: brand.primary }]}>{timer}</Text>
            </View>
          )}
        </View>

        {/* Matchup counter for rounds 1-2 */}
        {round <= 2 && phase !== 'leaderboard' && phase !== 'results' && (
          <View style={styles.tvMatchupCounter}>
            <Text style={styles.tvMatchupCounterText}>
              Matchup {currentMatchupIndex + 1} of {matchups.length}
            </Text>
          </View>
        )}

        {/* Main TV content */}
        <View style={styles.tvContent}>
          {/* Answering Phase — "Players are answering..." */}
          {phase === 'answering' && (
            <View style={styles.tvCenter}>
              <Text style={styles.tvBigIcon}>&#9997;</Text>
              <Text style={styles.tvPrompt}>Players are answering...</Text>
              <Text style={styles.tvInstruction}>
                {matchups.length} matchups this round — each player has 2 prompts
              </Text>
              <View style={styles.tvAnswerStatusGrid}>
                {Object.entries(playerNames).map(([pIdx, name]) => {
                  // Check how many answers this player has submitted
                  const pAssignments = getPlayerAssignments(matchups, Number(pIdx));
                  const answered = pAssignments.filter(a => {
                    const m = matchups[a.matchupIndex];
                    return a.side === 'A' ? m.answerA !== null : m.answerB !== null;
                  }).length;
                  return (
                    <View key={pIdx} style={styles.tvAnswerStatusItem}>
                      <Text style={[styles.tvAnswerStatusName, answered === 2 && { color: colors.accentGreen }]}>
                        {name}
                      </Text>
                      <Text style={[styles.tvAnswerStatusCount, answered === 2 && { color: colors.accentGreen }]}>
                        {answered === 2 ? 'Done' : `${answered}/2`}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Final Answering Phase */}
          {phase === 'final-answering' && (
            <View style={styles.tvCenter}>
              <Text style={styles.tvPromptLabel}>FINAL ROUND — 3x POINTS</Text>
              <Text style={styles.tvPrompt}>{finalPrompt?.text}</Text>
              <Text style={styles.tvVsText}>EVERYONE ANSWERS THE SAME PROMPT</Text>
              <Text style={styles.tvInstruction}>Submit your answer on your phone!</Text>
            </View>
          )}

          {/* Voting Phase — show prompt + both answers anonymously */}
          {phase === 'voting' && currentMatchup && (
            <View style={styles.tvCenter}>
              <Text style={styles.tvPromptLabel}>THE PROMPT</Text>
              <Text style={styles.tvPromptMedium}>{currentMatchup.promptText}</Text>
              <View style={styles.tvAnswerRow}>
                <View style={[styles.tvAnswerCard, { borderColor: brand.primary }]}>
                  <Text style={styles.tvAnswerLabel}>A</Text>
                  <Text style={styles.tvAnswerText}>{currentMatchup.answerA || '(no answer)'}</Text>
                </View>
                <Text style={styles.tvVsIcon}>VS</Text>
                <View style={[styles.tvAnswerCard, { borderColor: brand.teal || '#07BCCC' }]}>
                  <Text style={[styles.tvAnswerLabel, { color: brand.teal || '#07BCCC' }]}>B</Text>
                  <Text style={styles.tvAnswerText}>{currentMatchup.answerB || '(no answer)'}</Text>
                </View>
              </View>
              {timer > 0 ? (
                <Text style={styles.tvInstruction}>VOTE NOW on your phone!</Text>
              ) : (
                <Text style={styles.tvInstruction}>Get ready to vote...</Text>
              )}
            </View>
          )}

          {/* Final Voting */}
          {phase === 'final-voting' && (
            <View style={styles.tvCenter}>
              <Text style={styles.tvPromptLabel}>{finalPrompt?.text}</Text>
              <View style={styles.tvFinalGrid}>
                {Object.entries(finalAnswers).map(([pIdx, answer]) => (
                  <View key={pIdx} style={styles.tvFinalCard}>
                    <Text style={styles.tvFinalAnswer}>{answer}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.tvInstruction}>VOTE for your favorite on your phone!</Text>
            </View>
          )}

          {/* Reveal — show vote split, then reveal names */}
          {phase === 'reveal' && currentMatchup && (() => {
            const { pctA, pctB } = getMatchupVotePcts(currentMatchup);
            const multiplier = round === 1 ? 1000 : 2000;
            const pointsA = Math.round((pctA / 100) * multiplier);
            const pointsB = Math.round((pctB / 100) * multiplier);
            return (
              <View style={styles.tvCenter}>
                <Text style={styles.tvPromptLabel}>{currentMatchup.promptText}</Text>
                {/* Vote percentage bar */}
                <View style={styles.tvVoteBarContainer}>
                  <View style={[styles.tvVoteBarA, { flex: Math.max(pctA, 1) }]}>
                    <Text style={styles.tvVoteBarText}>{pctA}%</Text>
                  </View>
                  <View style={[styles.tvVoteBarB, { flex: Math.max(pctB, 1) }]}>
                    <Text style={styles.tvVoteBarText}>{pctB}%</Text>
                  </View>
                </View>
                <View style={styles.tvAnswerRow}>
                  <View style={[styles.tvRevealCard, pctA >= pctB && styles.tvRevealCardWinner]}>
                    <Text style={styles.tvRevealName}>{playerNames[currentMatchup.playerA]}</Text>
                    <Text style={styles.tvAnswerText}>{currentMatchup.answerA || '(no answer)'}</Text>
                    <Text style={styles.tvRevealPoints}>+{pointsA.toLocaleString()} pts</Text>
                  </View>
                  <View style={[styles.tvRevealCard, pctB > pctA && styles.tvRevealCardWinner]}>
                    <Text style={styles.tvRevealName}>{playerNames[currentMatchup.playerB]}</Text>
                    <Text style={styles.tvAnswerText}>{currentMatchup.answerB || '(no answer)'}</Text>
                    <Text style={styles.tvRevealPoints}>+{pointsB.toLocaleString()} pts</Text>
                  </View>
                </View>
              </View>
            );
          })()}

          {/* Final Reveal */}
          {phase === 'final-reveal' && (
            <View style={styles.tvCenter}>
              <Text style={styles.tvPromptLabel}>{finalPrompt?.text}</Text>
              <Text style={styles.tvDoublePoints}>3x POINTS</Text>
              <View style={styles.tvFinalGrid}>
                {Object.entries(finalAnswers)
                  .sort(([a], [b]) => {
                    const votesA = (Object.values(finalVotes).filter(v => v === Number(a)).length) + (finalAudienceVotes[Number(a)] || 0);
                    const votesB = (Object.values(finalVotes).filter(v => v === Number(b)).length) + (finalAudienceVotes[Number(b)] || 0);
                    return votesB - votesA;
                  })
                  .map(([pIdx, answer]) => {
                    const votes = Object.values(finalVotes).filter(v => v === Number(pIdx)).length + (finalAudienceVotes[Number(pIdx)] || 0);
                    const totalVotes = Object.values(finalVotes).length +
                      Object.values(finalAudienceVotes).reduce((a, b) => a + b, 0);
                    const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                    const pts = Math.round((pct / 100) * 3000);
                    return (
                      <View key={pIdx} style={styles.tvFinalCard}>
                        <Text style={styles.tvFinalName}>{playerNames[Number(pIdx)]}</Text>
                        <Text style={styles.tvFinalAnswer}>{answer}</Text>
                        <Text style={styles.tvVoteCount}>{pct}% — +{pts.toLocaleString()} pts</Text>
                      </View>
                    );
                  })}
              </View>
            </View>
          )}

          {/* Leaderboard */}
          {phase === 'leaderboard' && (
            <View style={styles.tvCenter}>
              <Text style={styles.tvLeaderboardTitle}>
                {round < 3 ? `END OF ROUND ${round}` : 'FINAL STANDINGS'}
              </Text>
              <Text style={styles.tvLeaderboardSubtitle}>
                {round === 1 ? 'Round 2 coming up — 2x points!' : 'Final Round coming up — 3x points!'}
              </Text>
              {sortedScores.map((entry, i) => (
                <View key={entry.index} style={[styles.tvLeaderRow, i === 0 && { borderColor: brand.primary }]}>
                  <Text style={styles.tvLeaderRank}>{i + 1}</Text>
                  <Text style={styles.tvLeaderName}>{entry.name}</Text>
                  <Text style={styles.tvLeaderScore}>{entry.score.toLocaleString()}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Results */}
          {phase === 'results' && (
            <View style={styles.tvCenter}>
              <Crown size={64} color={brand.primary} strokeWidth={1.5} />
              <Text style={styles.tvWinnerLabel}>WINNER</Text>
              <Text style={styles.tvWinnerName}>{sortedScores[0]?.name || 'Nobody'}</Text>
              <Text style={styles.tvWinnerScore}>{sortedScores[0]?.score.toLocaleString() || '0'} pts</Text>
              <View style={{ marginTop: 32, width: '100%', maxWidth: 500 }}>
                {sortedScores.map((entry, i) => (
                  <View key={entry.index} style={styles.tvLeaderRow}>
                    <Text style={styles.tvLeaderRank}>{i + 1}</Text>
                    <Text style={styles.tvLeaderName}>{entry.name}</Text>
                    <Text style={styles.tvLeaderScore}>{entry.score.toLocaleString()}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Host controls (bottom) — only show for phases that need manual advance */}
        {isHost && phase !== 'setup' && phase !== 'lobby' && (
          <View style={styles.tvControls}>
            {/* Answering: allow skip. Voting/Reveal auto-advance. Leaderboard: next round. Results: play again. */}
            {phase === 'answering' && (
              <Pressable onPress={handleHostAdvance} style={styles.tvAdvanceBtn}>
                <Text style={styles.tvAdvanceBtnText}>CLOSE ANSWERS EARLY</Text>
              </Pressable>
            )}
            {phase === 'final-answering' && (
              <Pressable onPress={handleHostAdvance} style={styles.tvAdvanceBtn}>
                <Text style={styles.tvAdvanceBtnText}>CLOSE ANSWERS EARLY</Text>
              </Pressable>
            )}
            {phase === 'leaderboard' && (
              <Pressable onPress={handleHostAdvance} style={styles.tvAdvanceBtn}>
                <Text style={styles.tvAdvanceBtnText}>
                  {round >= 2 ? 'FINAL ROUND' : 'NEXT ROUND'}
                </Text>
              </Pressable>
            )}
            {phase === 'results' && (
              <>
                <Pressable onPress={handleHostAdvance} style={styles.tvAdvanceBtn}>
                  <Text style={styles.tvAdvanceBtnText}>PLAY AGAIN</Text>
                </Pressable>
                <Pressable onPress={handleLeave} style={[styles.tvAdvanceBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#444' }]}>
                  <Text style={[styles.tvAdvanceBtnText, { color: '#AAA' }]}>LEAVE</Text>
                </Pressable>
              </>
            )}
          </View>
        )}
      </View>
    );
  }

  // ─── RENDER: Player Phone View ─────────────────────────────────────────────

  const renderPlayerView = () => {
    // ── Answering phase (rounds 1 & 2) — show BOTH prompts at once ──
    if (phase === 'answering' && round <= 2) {
      if (isAudience) {
        return (
          <View style={styles.phoneCenter}>
            <Eye size={32} color={t.textSecondary} />
            <Text style={[styles.phoneWaitText, { color: t.textSecondary }]}>Players are answering...</Text>
            <Text style={[styles.phoneTimer, { color: brand.primary }]}>{timer}s</Text>
          </View>
        );
      }

      if (myAssignments.length === 0) {
        return (
          <View style={styles.phoneCenter}>
            <Clock size={32} color={t.textSecondary} />
            <Text style={[styles.phoneWaitText, { color: t.textSecondary }]}>Waiting for answers...</Text>
            <Text style={[styles.phoneTimer, { color: brand.primary }]}>{timer}s</Text>
          </View>
        );
      }

      return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.phoneAnswerScrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.phoneRoundLabel, { color: brand.primary }]}>
            Round {round} — {round === 1 ? '1x' : '2x'} Points
          </Text>
          <Text style={[styles.phoneTimer, { color: brand.primary, textAlign: 'center', marginBottom: 16 }]}>{timer}s</Text>
          {myAssignments.map((assignment, aIdx) => (
            <View key={assignment.matchupIndex} style={[styles.phonePromptCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
              <Text style={[styles.phonePromptNumber, { color: t.textSecondary }]}>PROMPT {aIdx + 1}</Text>
              <Text style={[styles.phonePrompt, { color: t.textPrimary }]}>{assignment.promptText}</Text>
              <TextInput
                style={[styles.phoneInput, { backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.textPrimary }]}
                value={myAnswers[assignment.matchupIndex] || ''}
                onChangeText={(text) => {
                  setMyAnswers(prev => ({ ...prev, [assignment.matchupIndex]: text }));
                }}
                placeholder="Type your hot take..."
                placeholderTextColor={t.textMuted}
                maxLength={150}
                multiline
                editable={!hasSubmitted}
              />
              <Text style={[styles.charCount, { color: t.textMuted }]}>
                {(myAnswers[assignment.matchupIndex] || '').length}/150
              </Text>
            </View>
          ))}
          {hasSubmitted ? (
            <View style={styles.submittedBadge}>
              <Check size={20} color={colors.accentGreen} />
              <Text style={[styles.submittedText, { color: colors.accentGreen }]}>Both answers submitted!</Text>
            </View>
          ) : (
            <PrimaryButton
              label="SUBMIT BOTH ANSWERS"
              onPress={handleSubmitAnswers}
              disabled={!myAssignments.every(a => (myAnswers[a.matchupIndex] || '').trim().length > 0)}
            />
          )}
        </ScrollView>
      );
    }

    // ── Final answering (round 3) ──
    if (phase === 'final-answering') {
      if (isAudience) {
        return (
          <View style={styles.phoneCenter}>
            <Eye size={32} color={t.textSecondary} />
            <Text style={[styles.phoneWaitText, { color: t.textSecondary }]}>Players are answering the final prompt...</Text>
          </View>
        );
      }
      return (
        <View style={styles.phoneAnswerContainer}>
          <View style={styles.doublePointsBadge}>
            <Text style={styles.doublePointsText}>FINAL ROUND — 3x POINTS</Text>
          </View>
          <Text style={[styles.phonePrompt, { color: t.textPrimary }]}>{finalPrompt?.text}</Text>
          <Text style={[styles.phoneTimer, { color: brand.primary, textAlign: 'center' }]}>{timer}s</Text>
          <TextInput
            style={[styles.phoneInput, { backgroundColor: t.card, borderColor: t.cardBorder, color: t.textPrimary }]}
            value={myFinalAnswer}
            onChangeText={setMyFinalAnswer}
            placeholder="Give your best answer..."
            placeholderTextColor={t.textMuted}
            maxLength={150}
            multiline
            editable={!hasSubmitted}
          />
          {hasSubmitted ? (
            <View style={styles.submittedBadge}>
              <Check size={20} color={colors.accentGreen} />
              <Text style={[styles.submittedText, { color: colors.accentGreen }]}>Submitted!</Text>
            </View>
          ) : (
            <PrimaryButton label="SUBMIT" onPress={handleSubmitFinalAnswer} disabled={!myFinalAnswer.trim()} />
          )}
        </View>
      );
    }

    // ── Voting phase (rounds 1 & 2) — one matchup at a time ──
    if (phase === 'voting' && currentMatchup) {
      // Authors cannot vote on their own matchup
      if (isMyMatchup && !isAudience) {
        return (
          <View style={styles.phoneCenter}>
            <Text style={[styles.phoneMyMatchupLabel, { color: brand.primary }]}>YOUR MATCHUP</Text>
            <Text style={[styles.phoneWaitText, { color: t.textSecondary }]}>Waiting for votes...</Text>
            {timer > 0 && <Text style={[styles.phoneTimer, { color: brand.primary }]}>{timer}s</Text>}
          </View>
        );
      }

      // Voting not open yet (showing prompt+answers phase)
      if (timer === 0) {
        return (
          <View style={styles.phoneCenter}>
            <Text style={[styles.phoneWaitText, { color: t.textSecondary }]}>Get ready to vote...</Text>
          </View>
        );
      }

      return (
        <View style={styles.phoneVoteContainer}>
          <Text style={[styles.phonePrompt, { color: t.textPrimary }]}>{currentMatchup.promptText}</Text>
          <Text style={[styles.phoneTimer, { color: brand.primary }]}>{timer}s</Text>
          {hasVoted ? (
            <View style={styles.submittedBadge}>
              <Check size={20} color={colors.accentGreen} />
              <Text style={[styles.submittedText, { color: colors.accentGreen }]}>Vote locked!</Text>
            </View>
          ) : (
            <View style={styles.voteButtons}>
              <Pressable onPress={() => handleVote('A')} style={[styles.voteBtn, { borderColor: brand.primary }]}>
                <Text style={[styles.voteBtnLabel, { color: brand.primary }]}>A</Text>
                <Text style={[styles.voteBtnText, { color: t.textPrimary }]} numberOfLines={3}>{currentMatchup.answerA || '(no answer)'}</Text>
              </Pressable>
              <Pressable onPress={() => handleVote('B')} style={[styles.voteBtn, { borderColor: brand.teal || '#07BCCC' }]}>
                <Text style={[styles.voteBtnLabel, { color: brand.teal || '#07BCCC' }]}>B</Text>
                <Text style={[styles.voteBtnText, { color: t.textPrimary }]} numberOfLines={3}>{currentMatchup.answerB || '(no answer)'}</Text>
              </Pressable>
            </View>
          )}
        </View>
      );
    }

    // ── Final voting ──
    if (phase === 'final-voting') {
      return (
        <View style={styles.phoneVoteContainer}>
          <Text style={[styles.phonePrompt, { color: t.textPrimary }]}>{finalPrompt?.text}</Text>
          <Text style={[styles.phoneTimer, { color: brand.primary }]}>{timer}s</Text>
          {hasVoted ? (
            <View style={styles.submittedBadge}>
              <Check size={20} color={colors.accentGreen} />
              <Text style={[styles.submittedText, { color: colors.accentGreen }]}>Vote locked!</Text>
            </View>
          ) : (
            <ScrollView style={{ width: '100%' }}>
              {Object.entries(finalAnswers)
                .filter(([pIdx]) => Number(pIdx) !== myPlayerIndex || isAudience)
                .map(([pIdx, answer]) => (
                  <Pressable
                    key={pIdx}
                    onPress={() => handleFinalVote(Number(pIdx))}
                    style={[styles.finalVoteCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}
                  >
                    <Text style={[styles.finalVoteAnswer, { color: t.textPrimary }]}>{answer}</Text>
                  </Pressable>
                ))}
            </ScrollView>
          )}
        </View>
      );
    }

    // ── Reveal / Final Reveal — look at the TV ──
    if (phase === 'reveal' || phase === 'final-reveal') {
      return (
        <View style={styles.phoneCenter}>
          <Tv size={48} color={brand.primary} />
          <Text style={[styles.phoneWaitText, { color: t.textSecondary }]}>Look at the TV!</Text>
          {phase === 'reveal' && currentMatchup && (() => {
            const { pctA, pctB } = getMatchupVotePcts(currentMatchup);
            return (
              <View style={styles.phoneRevealMini}>
                <Text style={[styles.phoneRevealPct, { color: brand.primary }]}>{pctA}%</Text>
                <Text style={[styles.phoneRevealVs, { color: t.textSecondary }]}>vs</Text>
                <Text style={[styles.phoneRevealPct, { color: brand.teal }]}>{pctB}%</Text>
              </View>
            );
          })()}
        </View>
      );
    }

    // ── Leaderboard ──
    if (phase === 'leaderboard') {
      return (
        <View style={styles.phoneLeaderboard}>
          <Text style={[styles.phoneLeaderTitle, { color: t.textPrimary }]}>
            {round < 3 ? `Round ${round} Complete` : 'Final Standings'}
          </Text>
          {sortedScores.map((entry, i) => (
            <View key={entry.index} style={[styles.phoneLeaderRow, { backgroundColor: t.card, borderColor: entry.index === myPlayerIndex ? brand.primary : t.cardBorder }]}>
              <Text style={[styles.phoneLeaderRank, { color: i === 0 ? brand.primary : t.textSecondary }]}>{i + 1}</Text>
              <Text style={[styles.phoneLeaderName, { color: t.textPrimary }]}>{entry.name}</Text>
              <Text style={[styles.phoneLeaderScore, { color: brand.primary }]}>{entry.score.toLocaleString()}</Text>
            </View>
          ))}
          {round === 1 && (
            <Text style={[styles.phoneLeaderHint, { color: t.textSecondary }]}>Round 2 coming up — 2x points!</Text>
          )}
          {round === 2 && (
            <Text style={[styles.phoneLeaderHint, { color: t.textSecondary }]}>Final Round coming up — 3x points!</Text>
          )}
        </View>
      );
    }

    // ── Results ──
    if (phase === 'results') {
      const myRank = sortedScores.findIndex(s => s.index === myPlayerIndex) + 1;
      return (
        <View style={styles.phoneCenter}>
          <Crown size={48} color={brand.primary} />
          <Text style={[styles.phoneResultTitle, { color: t.textPrimary }]}>
            {myRank === 1 ? 'YOU WON!' : `You placed #${myRank}`}
          </Text>
          <Text style={[styles.phoneResultScore, { color: brand.primary }]}>
            {scores[myPlayerIndex]?.toLocaleString() || '0'} pts
          </Text>
          <View style={{ marginTop: 24 }}>
            <GhostButton label="Back to Games" onPress={handleLeave} />
          </View>
        </View>
      );
    }

    // Fallback — waiting state
    return (
      <View style={styles.phoneCenter}>
        <Clock size={32} color={t.textSecondary} />
        <Text style={[styles.phoneWaitText, { color: t.textSecondary }]}>Waiting...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: t.background }]} edges={['top']}>
      {/* Phone header */}
      <View style={[styles.phoneHeader, { borderBottomColor: t.cardBorder }]}>
        <Text style={[styles.phoneHeaderTitle, { color: t.textPrimary }]}>Hot Take Showdown</Text>
        {phase !== 'results' && (
          <Text style={[styles.phoneHeaderRound, { color: brand.primary }]}>
            Round {round}/3
          </Text>
        )}
      </View>
      <View style={styles.phoneBody}>
        {renderPlayerView()}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },
  backBtn: { marginBottom: 16 },

  // Setup
  setupContent: { padding: spacing.screenHorizontal, paddingTop: 16, paddingBottom: 120 },
  setupHeader: { alignItems: 'center', marginBottom: 32, gap: 8 },
  setupTitle: { fontFamily: fonts.display, fontSize: 36, letterSpacing: 2 },
  setupSubtitle: { fontFamily: fonts.body, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  sectionLabel: { fontFamily: fonts.bodySemiBold, fontSize: 14, letterSpacing: 1, marginBottom: 12 },
  leagueRow: { flexDirection: 'row', gap: 8 },
  leagueChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: radius.pill, borderWidth: 2 },
  leagueChipText: { fontFamily: fonts.bodySemiBold, fontSize: 14, letterSpacing: 1 },
  roleRow: { flexDirection: 'row', gap: 12 },
  roleCard: { flex: 1, alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 2, gap: 4 },
  roleLabel: { fontFamily: fonts.bodySemiBold, fontSize: 14 },
  roleDesc: { fontFamily: fonts.body, fontSize: 11, textAlign: 'center' },
  errorText: { color: brand.primary, fontFamily: fonts.body, fontSize: 13, marginTop: 8, textAlign: 'center' },
  audienceBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, marginTop: 8, borderTopWidth: 1 },
  audienceBtnText: { fontFamily: fonts.body, fontSize: 14 },
  settingsLabel: { fontFamily: fonts.body, fontSize: 13 },
  tvBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  tvBadgeText: { fontFamily: fonts.bodySemiBold, fontSize: 12 },

  // TV host screen
  tvRoot: { flex: 1, justifyContent: 'space-between' },
  tvHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  tvTitle: { fontFamily: fonts.display, fontSize: 42, color: '#FFF', letterSpacing: 3 },
  tvRoundBadge: { backgroundColor: brand.primary, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 },
  tvRoundText: { fontFamily: fonts.bodySemiBold, color: '#FFF', fontSize: 14, letterSpacing: 1 },
  tvMultiplierBadge: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  tvMultiplierText: { fontFamily: fonts.bodySemiBold, color: brand.primary, fontSize: 12, letterSpacing: 1 },
  tvTimerContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tvTimerText: { fontFamily: fonts.display, fontSize: 36, color: '#FFF' },
  tvMatchupCounter: { alignItems: 'center', paddingBottom: 8 },
  tvMatchupCounterText: { fontFamily: fonts.body, fontSize: 14, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 },
  tvContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 48 },
  tvCenter: { alignItems: 'center', width: '100%', maxWidth: 900 },
  tvBigIcon: { fontSize: 48, marginBottom: 16 },
  tvPromptLabel: { fontFamily: fonts.bodySemiBold, fontSize: 16, color: brand.primary, letterSpacing: 2, marginBottom: 12 },
  tvPrompt: { fontFamily: fonts.display, fontSize: 48, color: '#FFF', textAlign: 'center', lineHeight: 56, marginBottom: 16 },
  tvPromptMedium: { fontFamily: fonts.display, fontSize: 40, color: '#FFF', textAlign: 'center', lineHeight: 48, marginBottom: 16 },
  tvVsText: { fontFamily: fonts.bodySemiBold, fontSize: 18, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 },
  tvInstruction: { fontFamily: fonts.body, fontSize: 16, color: 'rgba(255,255,255,0.4)', marginTop: 24 },
  tvAnswerRow: { flexDirection: 'row', gap: 24, marginTop: 24, width: '100%' },
  tvAnswerCard: { flex: 1, borderWidth: 2, borderRadius: 16, padding: 24, alignItems: 'center' },
  tvAnswerLabel: { fontFamily: fonts.display, fontSize: 36, color: brand.primary, marginBottom: 8 },
  tvAnswerText: { fontFamily: fonts.bodyBold, fontSize: 22, color: '#FFF', textAlign: 'center' },
  tvVsIcon: { fontFamily: fonts.display, fontSize: 32, color: 'rgba(255,255,255,0.3)', alignSelf: 'center' },

  // TV answer status grid (during answering phase)
  tvAnswerStatusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 24 },
  tvAnswerStatusItem: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  tvAnswerStatusName: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  tvAnswerStatusCount: { fontFamily: fonts.body, fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 },

  // TV vote percentage bar
  tvVoteBarContainer: { flexDirection: 'row', width: '100%', height: 48, borderRadius: 12, overflow: 'hidden', marginTop: 16, marginBottom: 8 },
  tvVoteBarA: { backgroundColor: brand.primary, justifyContent: 'center', alignItems: 'center' },
  tvVoteBarB: { backgroundColor: brand.teal || '#07BCCC', justifyContent: 'center', alignItems: 'center' },
  tvVoteBarText: { fontFamily: fonts.display, fontSize: 24, color: '#FFF' },

  tvRevealCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24, alignItems: 'center', gap: 8, borderWidth: 2, borderColor: 'transparent' },
  tvRevealCardWinner: { borderColor: brand.primary },
  tvRevealName: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: brand.primary, letterSpacing: 1 },
  tvRevealPoints: { fontFamily: fonts.display, fontSize: 24, color: '#FFF', marginTop: 4 },
  tvVoteCount: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  tvDoublePoints: { fontFamily: fonts.display, fontSize: 24, color: brand.primary, letterSpacing: 3, marginBottom: 16 },
  tvFinalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginTop: 16, width: '100%' },
  tvFinalCard: { width: '45%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, alignItems: 'center', gap: 4 },
  tvFinalName: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: brand.primary, letterSpacing: 1 },
  tvFinalAnswer: { fontFamily: fonts.bodyBold, fontSize: 18, color: '#FFF', textAlign: 'center' },
  tvLeaderboardTitle: { fontFamily: fonts.display, fontSize: 36, color: '#FFF', letterSpacing: 2, marginBottom: 8 },
  tvLeaderboardSubtitle: { fontFamily: fonts.body, fontSize: 16, color: 'rgba(255,255,255,0.4)', marginBottom: 24 },
  tvLeaderRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, marginBottom: 8, width: '100%', maxWidth: 500, borderWidth: 1, borderColor: 'transparent' },
  tvLeaderRank: { fontFamily: fonts.display, fontSize: 28, color: brand.primary, width: 50 },
  tvLeaderName: { fontFamily: fonts.bodySemiBold, fontSize: 18, color: '#FFF', flex: 1 },
  tvLeaderScore: { fontFamily: fonts.display, fontSize: 24, color: brand.primary },
  tvWinnerLabel: { fontFamily: fonts.bodySemiBold, fontSize: 16, color: 'rgba(255,255,255,0.5)', letterSpacing: 3, marginTop: 16 },
  tvWinnerName: { fontFamily: fonts.display, fontSize: 64, color: '#FFF', marginTop: 8 },
  tvWinnerScore: { fontFamily: fonts.display, fontSize: 36, color: brand.primary },
  tvControls: { flexDirection: 'row', justifyContent: 'center', padding: 24, gap: 16 },
  tvAdvanceBtn: { backgroundColor: brand.primary, borderRadius: 12, paddingHorizontal: 32, paddingVertical: 14 },
  tvAdvanceBtnText: { fontFamily: fonts.bodySemiBold, fontSize: 16, color: '#FFF', letterSpacing: 1 },

  // Phone player view
  phoneHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.screenHorizontal, paddingVertical: 12, borderBottomWidth: 1 },
  phoneHeaderTitle: { fontFamily: fonts.bodySemiBold, fontSize: 16 },
  phoneHeaderRound: { fontFamily: fonts.display, fontSize: 20 },
  phoneBody: { flex: 1, padding: spacing.screenHorizontal },
  phoneCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  phoneWaitText: { fontFamily: fonts.body, fontSize: 16, textAlign: 'center' },
  phoneTimer: { fontFamily: fonts.display, fontSize: 48 },
  phonePrompt: { fontFamily: fonts.bodyBold, fontSize: 20, textAlign: 'center', marginBottom: 16, lineHeight: 28 },
  phoneRoundLabel: { fontFamily: fonts.bodySemiBold, fontSize: 14, textAlign: 'center', letterSpacing: 1, marginBottom: 4 },
  phoneMyMatchupLabel: { fontFamily: fonts.bodySemiBold, fontSize: 16, letterSpacing: 2 },

  // Phone answering — dual prompt cards
  phoneAnswerScrollContent: { paddingVertical: 16, paddingBottom: 120, gap: 12 },
  phonePromptCard: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 8 },
  phonePromptNumber: { fontFamily: fonts.bodySemiBold, fontSize: 11, letterSpacing: 2 },
  phoneAnswerContainer: { flex: 1, justifyContent: 'center', gap: 12 },
  phoneInput: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 16, fontFamily: fonts.body, minHeight: 80, textAlignVertical: 'top' },
  charCount: { fontFamily: fonts.body, fontSize: 12, textAlign: 'right' },
  submittedBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  submittedText: { fontFamily: fonts.bodySemiBold, fontSize: 16 },

  // Phone voting
  phoneVoteContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  voteButtons: { width: '100%', gap: 12 },
  voteBtn: { borderWidth: 2, borderRadius: 16, padding: 20, alignItems: 'center' },
  voteBtnLabel: { fontFamily: fonts.display, fontSize: 24, marginBottom: 4 },
  voteBtnText: { fontFamily: fonts.body, fontSize: 15, textAlign: 'center' },
  finalVoteCard: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 8 },
  finalVoteAnswer: { fontFamily: fonts.body, fontSize: 16, textAlign: 'center' },
  doublePointsBadge: { backgroundColor: brand.primary, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, alignSelf: 'center', marginBottom: 12 },
  doublePointsText: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: '#FFF', letterSpacing: 1 },

  // Phone reveal mini display
  phoneRevealMini: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  phoneRevealPct: { fontFamily: fonts.display, fontSize: 36 },
  phoneRevealVs: { fontFamily: fonts.body, fontSize: 14 },

  // Phone leaderboard
  phoneLeaderboard: { flex: 1, paddingTop: 24, gap: 8 },
  phoneLeaderTitle: { fontFamily: fonts.display, fontSize: 24, textAlign: 'center', marginBottom: 16 },
  phoneLeaderRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, padding: 12 },
  phoneLeaderRank: { fontFamily: fonts.display, fontSize: 24, width: 36 },
  phoneLeaderName: { fontFamily: fonts.bodySemiBold, fontSize: 14, flex: 1 },
  phoneLeaderScore: { fontFamily: fonts.display, fontSize: 20 },
  phoneLeaderHint: { fontFamily: fonts.body, fontSize: 13, textAlign: 'center', marginTop: 12 },

  // Phone results
  phoneResultTitle: { fontFamily: fonts.display, fontSize: 32, marginTop: 8 },
  phoneResultScore: { fontFamily: fonts.display, fontSize: 48 },
});
