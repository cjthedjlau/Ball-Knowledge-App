import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { brand, dark, light, colors, darkColors, fonts, fontFamily, spacing, radius } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import { calculateMultiplayerXP, saveGameResult, updateUserXPAndStreak } from '../../lib/xp';
import { supabase } from '../../lib/supabase';
import { getNormalPlayers, type Player } from '../../lib/playersPool';
import { type Tab } from '../components/ui/BottomNav';
import PrimaryButton from '../../screens/components/ui/PrimaryButton';
import GhostButton from '../../screens/components/ui/GhostButton';
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';

// ── Online multiplayer imports ──
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
import { useLobby } from '../../hooks/useLobby';
import { ModeToggle } from '../../components/multiplayer/ModeToggle';
import { JoinLobby } from '../../components/multiplayer/JoinLobby';
import { LobbyScreen } from '../../components/multiplayer/LobbyScreen';


// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = 'setup' | 'draft' | 'results';

interface Athlete {
  id: string;
  name: string;
  team: string;
  era: string;
  keyStat: string;
}

interface DraftPick {
  athleteId: string;
  playerIndex: number;
  round: number;
}

// ─── Data — now fetched from players_pool table ──────────────────────────────

type LeagueKey = 'NBA' | 'NFL' | 'MLB' | 'NHL';

const FETCH_COUNT = 30;

import draftTopicsData from '../../data/draft-topics.json';

interface DraftTopic { id: string; text: string; type: string; leagues: string[] }

function getRandomCategory(league: LeagueKey): string {
  const topics = (draftTopicsData as DraftTopic[]).filter(
    t => t.leagues.includes(league) || t.leagues.length === 4
  );
  if (topics.length === 0) return `Best ${league} Players of All Time`;
  return topics[Math.floor(Math.random() * topics.length)].text;
}

// Fallback for reverse lookups — kept for online broadcast compatibility
const LEAGUE_CATEGORIES: Record<LeagueKey, string> = {
  NBA: 'Best NBA Players of All Time',
  NFL: 'Greatest NFL Players of All Time',
  MLB: 'Greatest MLB Players of All Time',
  NHL: 'Greatest NHL Players of All Time',
};

const DEFAULT_PLAYERS = ['Player 1', 'Player 2', 'Player 3'];

// ─── Snake Draft Order ────────────────────────────────────────────────────────

function getPickOrder(playerCount: number, rounds: number): number[] {
  const order: number[] = [];
  for (let r = 0; r < rounds; r++) {
    const ascending = r % 2 === 0;
    for (let i = 0; i < playerCount; i++) {
      order.push(ascending ? i : playerCount - 1 - i);
    }
  }
  return order;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AthleteRow({
  athlete,
  drafted,
  draftedBy,
  onSelect,
}: {
  athlete: Athlete;
  drafted: boolean;
  draftedBy?: string;
  onSelect: () => void;
}) {
  return (
    <Pressable
      onPress={drafted ? undefined : onSelect}
      style={[styles.athleteRow, drafted && styles.athleteRowDrafted]}
    >
      <View style={styles.athleteInfo}>
        <Text style={[styles.athleteName, drafted && styles.athleteNameDrafted]}>
          {athlete.name}
        </Text>
        <Text style={[styles.athleteMeta, drafted && styles.athleteMetaDrafted]}>
          {athlete.team} · {athlete.era}
        </Text>
        <Text style={[styles.athleteStat, drafted && styles.athleteStatDrafted]}>
          {athlete.keyStat}
        </Text>
      </View>
      {drafted ? (
        <Text style={styles.draftedTag}>{draftedBy ?? 'Drafted'}</Text>
      ) : (
        <View style={styles.selectBtn}>
          <Text style={styles.selectBtnText}>Draft</Text>
        </View>
      )}
    </Pressable>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
  onNavigate: (tab: Tab) => void;
  joinedLobby?: { lobbyId: string; playerIndex: number; code: string; gameType: string };
}

export default function DraftWithFriendsScreen({ onBack, onNavigate, joinedLobby }: Props) {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  // ── State ──
  const [phase, setPhase] = useState<Phase>('setup');
  const [playerNames, setPlayerNames] = useState<string[]>([...DEFAULT_PLAYERS]);
  const [picks, setPicks] = useState<DraftPick[]>([]);
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [showPassScreen, setShowPassScreen] = useState(false);
  const [passTarget, setPassTarget] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<LeagueKey>('NBA');
  const [rounds, setRounds] = useState<number>(3);
  const [xpEarned, setXpEarned] = useState<number | null>(null);

  // ── Online mode state ──
  const [mode, setMode] = useState<'local' | 'online'>('local');
  const [onlinePhase, setOnlinePhase] = useState<'choose' | 'join' | 'lobby' | 'draft' | 'results'>('choose');
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

  // ── Host disconnect detection ──
  const [hostDisconnected, setHostDisconnected] = useState(false);
  const [hostDisconnectTimer, setHostDisconnectTimer] = useState(60);

  // ── Drafter disconnect detection (host only) ──
  const [drafterDisconnected, setDrafterDisconnected] = useState(false);
  const [drafterDisconnectTimer, setDrafterDisconnectTimer] = useState(30);

  // ── Auth state for online mode ──
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('Player');

  // ── Online draft state ──
  const [onlineDraftStarted, setOnlineDraftStarted] = useState(false);
  const [onlinePickOrder, setOnlinePickOrder] = useState<number[]>([]);
  const [onlineCurrentPickIndex, setOnlineCurrentPickIndex] = useState(0);
  const [onlinePlayerNames, setOnlinePlayerNames] = useState<string[]>([]);

  // ── Player data ──
  function loadAthletes(league: LeagueKey) {
    getNormalPlayers(league).then((players) => {
      setLeagueAthletes([...players].sort(() => Math.random() - 0.5).slice(0, FETCH_COUNT).map((p, i) => ({
        id: p.id || `${league.toLowerCase()}-${i}`,
        name: p.name,
        team: p.team,
        era: '',
        keyStat: '',
      })));
    });
  }

  const [leagueAthletes, setLeagueAthletes] = useState<Athlete[]>([]);

  useEffect(() => { loadAthletes('NBA'); }, []);

  // ── Get user info on mount ──
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        setDisplayName(user.user_metadata?.display_name || user.email?.split('@')[0] || 'Player');
      }
    });
  }, []);

  // ── Auto-join lobby when navigated from Games hub Join Game ──
  useEffect(() => {
    if (!joinedLobby) return;
    setMode('online');
    handleJoinSuccess(joinedLobby.lobbyId, joinedLobby.playerIndex, joinedLobby.code);
  }, [joinedLobby]);

  // ── useLobby hook for realtime ──
  const { presencePlayers, isConnected, broadcast, onEvent } = useLobby({
    code: lobbyCode,
    displayName,
    userId,
    playerIndex: myPlayerIndex,
  });

  // ── Refresh lobby players when presence changes ──
  useEffect(() => {
    if (!lobbyId || onlinePhase !== 'lobby') return;
    getLobbyPlayers(lobbyId).then(players => {
      setLobbyPlayers(players);
    }).catch(() => {});
  }, [presencePlayers.length, lobbyId, onlinePhase]);

  // ── Online event listeners ──
  useEffect(() => {
    if (mode !== 'online' || !lobbyCode) return;

    const unsubReady = onEvent('player:ready', () => {
      if (lobbyId) {
        getLobbyPlayers(lobbyId).then(players => setLobbyPlayers(players)).catch(() => {});
      }
    });

    const unsubDraftStart = onEvent('game:draft_start', (payload: any) => {
      // All clients receive category, draft order, athlete pool, player names, rounds
      if (payload.leagueAthletes) setLeagueAthletes(payload.leagueAthletes);
      if (payload.category) {
        // Find the league from category
        const league = (Object.keys(LEAGUE_CATEGORIES) as LeagueKey[]).find(
          k => LEAGUE_CATEGORIES[k] === payload.category
        );
        if (league) setSelectedLeague(league);
      }
      if (payload.rounds) setRounds(payload.rounds);
      if (payload.draftOrder) setOnlinePickOrder(payload.draftOrder);
      if (payload.playerNames) {
        setOnlinePlayerNames(payload.playerNames);
        setPlayerNames(payload.playerNames);
      }
      setOnlineCurrentPickIndex(0);
      setPicks([]);
      setOnlineDraftStarted(true);
      setOnlinePhase('draft');
      setPhase('draft');
    });

    const unsubPick = onEvent('game:pick', (payload: any) => {
      // All clients receive the pick and update board state
      const { athleteId, playerIndex: pickerIndex, round, nextPickIndex } = payload;
      setPicks(prev => [...prev, { athleteId, playerIndex: pickerIndex, round }]);
      if (typeof nextPickIndex === 'number') {
        setOnlineCurrentPickIndex(nextPickIndex);
      }
    });

    const unsubGameOver = onEvent('game:over', () => {
      setOnlinePhase('results');
      setPhase('results');
      // Use functional updater to guard against duplicate XP awards
      setXpEarned(prev => {
        if (prev !== null) return prev;
        const xp = calculateMultiplayerXP(rounds);
        void (async () => {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await saveGameResult(user.id, 'draft-with-friends', xp, rounds);
              await updateUserXPAndStreak(user.id, xp, false);
            }
          } catch {
            // silently fail - XP is non-critical
          }
        })();
        return xp;
      });
    });

    const unsubSettings = onEvent('lobby:settings', async (payload: any) => {
      if (payload.settings) {
        setLobby(prev => prev ? { ...prev, settings: payload.settings } : prev);
        if (payload.settings.league) setSelectedLeague(payload.settings.league);
        if (payload.settings.rounds) setRounds(payload.settings.rounds);

        // Reload athlete pool when league changes so non-host setup screen stays in sync
        if (payload.settings.league && payload.settings.league !== selectedLeague) {
          const newPlayers = await getNormalPlayers(payload.settings.league);
          const newAthletes = [...newPlayers]
            .sort(() => Math.random() - 0.5)
            .slice(0, FETCH_COUNT)
            .map((p, i) => ({
              id: p.id || `${payload.settings.league.toLowerCase()}-${i}`,
              name: p.name,
              team: p.team,
              era: '',
              keyStat: '',
            }));
          setLeagueAthletes(newAthletes);
        }
      }
    });

    return () => { unsubReady(); unsubDraftStart(); unsubPick(); unsubGameOver(); unsubSettings(); };
  }, [mode, lobbyCode, onEvent, rounds]);

  const [leagueCategory, setLeagueCategory] = useState(() => getRandomCategory(selectedLeague));

  // Pick a new random category when league changes
  useEffect(() => {
    setLeagueCategory(getRandomCategory(selectedLeague));
  }, [selectedLeague]);

  // ── Pick order: use online order when in online mode, local otherwise ──
  const activePlayerNames = mode === 'online' && onlineDraftStarted ? onlinePlayerNames : playerNames;
  const activePickOrder = mode === 'online' && onlineDraftStarted
    ? onlinePickOrder
    : getPickOrder(playerNames.length, rounds);
  const activeTotalPicks = activePickOrder.length;
  const activeCurrentPickIndex = mode === 'online' ? onlineCurrentPickIndex : currentPickIndex;
  const currentPlayerIndex = activeCurrentPickIndex < activeTotalPicks
    ? activePickOrder[activeCurrentPickIndex]
    : 0;
  const currentRound = Math.floor(activeCurrentPickIndex / activePlayerNames.length) + 1;

  // ── Drafted state ──
  const draftedIds = new Set(picks.map((p) => p.athleteId));
  const draftedByMap: Record<string, string> = {};
  for (const p of picks) {
    draftedByMap[p.athleteId] = activePlayerNames[p.playerIndex];
  }

  // ── Draft board: playerIndex → [athleteId, ...] in round order ──
  function getDraftBoard() {
    const board: Record<number, string[]> = {};
    for (let i = 0; i < activePlayerNames.length; i++) board[i] = [];
    for (const p of picks) board[p.playerIndex].push(p.athleteId);
    return board;
  }

  // ── Is it my turn in online mode? ──
  const isMyTurn = mode === 'online' && onlineDraftStarted && currentPlayerIndex === myPlayerIndex;

  // ── Handlers (local mode) ──
  const handleAddPlayer = useCallback(() => {
    if (playerNames.length < 6) {
      setPlayerNames((prev) => [...prev, `Player ${prev.length + 1}`]);
    }
  }, [playerNames.length]);

  const handleRemovePlayer = useCallback((idx: number) => {
    if (playerNames.length > 2) {
      setPlayerNames((prev) => prev.filter((_, i) => i !== idx));
    }
  }, [playerNames.length]);

  const handleStartDraft = useCallback(() => {
    setPhase('draft');
  }, []);

  const handleDraftAthlete = useCallback(
    (athleteId: string) => {
      if (mode === 'online') {
        // Online mode: broadcast pick
        handleOnlinePick(athleteId);
        return;
      }
      // Local mode: unchanged
      setPicks((prev) => [
        ...prev,
        { athleteId, playerIndex: currentPlayerIndex, round: currentRound },
      ]);
      const nextIndex = currentPickIndex + 1;
      if (nextIndex >= activeTotalPicks) {
        setCurrentPickIndex(nextIndex);
        setPhase('results');
        const xp = calculateMultiplayerXP(rounds);
        setXpEarned(xp);
        void (async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await saveGameResult(user.id, 'draft-with-friends', xp, rounds);
            await updateUserXPAndStreak(user.id, xp, false);
          }
        })();
      } else {
        const nextPlayer = activePickOrder[nextIndex];
        setPassTarget(playerNames[nextPlayer]);
        setShowPassScreen(true);
        setCurrentPickIndex(nextIndex);
      }
    },
    [mode, currentPickIndex, currentPlayerIndex, currentRound, activeTotalPicks, activePickOrder, playerNames, rounds]
  );

  const handlePassConfirmed = useCallback(() => {
    setShowPassScreen(false);
  }, []);

  const handleLeagueChange = useCallback((league: string) => {
    setSelectedLeague(league as LeagueKey);
    loadAthletes(league as LeagueKey);
    setPicks([]);
    setCurrentPickIndex(0);
    setShowPassScreen(false);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // ONLINE HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────

  const handleCreateGame = useCallback(async () => {
    if (!userId) return;
    setOnlineLoading(true);
    setOnlineError(null);
    try {
      const { code, lobbyId: id } = await createLobby('draft', userId, displayName);
      setLobbyCode(code);
      setLobbyId(id);
      setMyPlayerIndex(0);
      setIsHost(true);
      setOnlinePhase('lobby');
      const players = await getLobbyPlayers(id);
      setLobbyPlayers(players);
      setMyPlayerId(players[0]?.id || null);
      setLobby({
        id,
        code,
        game_type: 'draft',
        host_user_id: userId,
        status: 'waiting',
        settings: {},
        game_state: {},
      });
    } catch (e: any) {
      console.error('Create lobby failed:', e.message);
      setOnlineError(e.message || 'Failed to create lobby');
    } finally {
      setOnlineLoading(false);
    }
  }, [userId, displayName]);

  const handleJoinSuccess = useCallback(async (joinedLobbyId: string, joinedPlayerIndex: number, joinedCode: string) => {
    setLobbyId(joinedLobbyId);
    setMyPlayerIndex(joinedPlayerIndex);
    setLobbyCode(joinedCode);
    setOnlinePhase('lobby');
    try {
      const players = await getLobbyPlayers(joinedLobbyId);
      setLobbyPlayers(players);
      const me = players.find(p => p.player_index === joinedPlayerIndex);
      setMyPlayerId(me?.id || null);
      setLobby({
        id: joinedLobbyId,
        code: joinedCode,
        game_type: 'draft',
        host_user_id: '',
        status: 'waiting',
        settings: {},
        game_state: {},
      });
    } catch (e: any) {
      setOnlineError(e.message || 'Failed to load lobby players');
    }
  }, []);

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

  const handleOnlineStart = useCallback(async () => {
    if (!isHost || !lobbyId) return;
    try {
      // Generate draft data
      const pNames = lobbyPlayers.map(p => p.display_name);
      const draftOrder = getPickOrder(pNames.length, rounds);

      // Load athletes for the selected league
      const players = await getNormalPlayers(selectedLeague);
      const athletes: Athlete[] = [...players]
        .sort(() => Math.random() - 0.5)
        .slice(0, FETCH_COUNT)
        .map((p, i) => ({
          id: p.id || `${selectedLeague.toLowerCase()}-${i}`,
          name: p.name,
          team: p.team,
          era: '',
          keyStat: '',
        }));

      // Set local state
      setLeagueAthletes(athletes);
      setOnlinePlayerNames(pNames);
      setPlayerNames(pNames);
      setOnlinePickOrder(draftOrder);
      setOnlineCurrentPickIndex(0);
      setPicks([]);
      setOnlineDraftStarted(true);

      // Broadcast to all clients before updating status so clients receive game data first
      broadcast('game:draft_start', {
        category: leagueCategory,
        draftOrder,
        leagueAthletes: athletes,
        rounds,
        playerNames: pNames,
      });

      await updateLobbyStatus(lobbyId, 'playing');

      setOnlinePhase('draft');
      setPhase('draft');
    } catch (e: any) {
      setOnlineError(e.message || 'Failed to start game');
    }
  }, [isHost, lobbyId, lobbyPlayers, rounds, selectedLeague, broadcast]);

  const handleOnlinePick = useCallback((athleteId: string) => {
    if (!isMyTurn) return;

    const nextIndex = onlineCurrentPickIndex + 1;
    const isLastPick = nextIndex >= onlinePickOrder.length;

    // Update local state immediately
    setPicks(prev => [...prev, { athleteId, playerIndex: currentPlayerIndex, round: currentRound }]);
    setOnlineCurrentPickIndex(nextIndex);

    // Broadcast pick to all clients
    broadcast('game:pick', {
      athleteId,
      playerIndex: currentPlayerIndex,
      round: currentRound,
      nextPickIndex: nextIndex,
    });

    // If last pick, broadcast game over (XP is saved via the game:over handler)
    if (isLastPick) {
      broadcast('game:over', {});
      setOnlinePhase('results');
      setPhase('results');
    }
  }, [isMyTurn, onlineCurrentPickIndex, onlinePickOrder.length, currentPlayerIndex, currentRound, broadcast, rounds]);

  const handleLeaveOnline = useCallback(async () => {
    if (lobbyId && myPlayerId) {
      try {
        await leaveLobby(lobbyId, myPlayerId);
      } catch {
        // silently fail - still reset state
      }
    }
    // Reset online state
    setLobbyCode(null);
    setLobbyId(null);
    setMyPlayerId(null);
    setLobby(null);
    setLobbyPlayers([]);
    setIsHost(false);
    setIsReady(false);
    setOnlineDraftStarted(false);
    setOnlinePickOrder([]);
    setOnlineCurrentPickIndex(0);
    setOnlinePlayerNames([]);
    setOnlinePhase('choose');
    setPicks([]);
    setCurrentPickIndex(0);
    setXpEarned(null);
    setPhase('setup');
  }, [lobbyId, myPlayerId]);

  // ── Host disconnect detection ──
  useEffect(() => {
    if (mode !== 'online' || isHost || onlinePhase === 'choose' || onlinePhase === 'join') return;

    const hostPlayer = lobbyPlayers.find(p => p.is_host);
    if (!hostPlayer) return;

    const hostPresent = presencePlayers.some(p => p.playerIndex === hostPlayer.player_index);

    if (!hostPresent && !hostDisconnected) {
      setHostDisconnected(true);
      setHostDisconnectTimer(60);
    } else if (hostPresent && hostDisconnected) {
      setHostDisconnected(false);
    }
  }, [mode, isHost, onlinePhase, presencePlayers, lobbyPlayers, hostDisconnected]);

  // Host disconnect countdown timer
  useEffect(() => {
    if (!hostDisconnected) return;
    if (hostDisconnectTimer <= 0) {
      handleLeaveOnline();
      return;
    }
    const timer = setTimeout(() => setHostDisconnectTimer(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [hostDisconnected, hostDisconnectTimer, handleLeaveOnline]);

  // ── Active drafter disconnect detection (host auto-skips after 30s) ──
  useEffect(() => {
    if (mode !== 'online' || !isHost || !onlineDraftStarted || onlinePhase !== 'draft') return;

    const activeDrafterIndex = activeCurrentPickIndex < activeTotalPicks
      ? activePickOrder[activeCurrentPickIndex]
      : -1;
    if (activeDrafterIndex < 0) return;

    const drafterPresent = presencePlayers.some(p => p.playerIndex === activeDrafterIndex);

    if (!drafterPresent && !drafterDisconnected) {
      setDrafterDisconnected(true);
      setDrafterDisconnectTimer(30);
    } else if (drafterPresent && drafterDisconnected) {
      setDrafterDisconnected(false);
    }
  }, [mode, isHost, onlineDraftStarted, onlinePhase, presencePlayers, activeCurrentPickIndex, activeTotalPicks, activePickOrder, drafterDisconnected]);

  // Drafter disconnect countdown — auto-skip turn when timer expires
  useEffect(() => {
    if (!drafterDisconnected) return;
    if (drafterDisconnectTimer <= 0) {
      // Auto-skip: advance pick index without making a pick
      const nextIndex = onlineCurrentPickIndex + 1;
      const isLastPick = nextIndex >= onlinePickOrder.length;

      setOnlineCurrentPickIndex(nextIndex);
      broadcast('game:pick', {
        athleteId: '__skipped__',
        playerIndex: activePickOrder[onlineCurrentPickIndex] ?? 0,
        nextPickIndex: nextIndex,
        isLastPick,
      });

      if (isLastPick) {
        broadcast('game:over', {});
        setOnlinePhase('results');
        setPhase('results');
      }

      setDrafterDisconnected(false);
      return;
    }
    const timer = setTimeout(() => setDrafterDisconnectTimer(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [drafterDisconnected, drafterDisconnectTimer, onlineCurrentPickIndex, onlinePickOrder, activePickOrder, broadcast, onlinePhase]);

  const handleUpdateSettings = useCallback(async (settings: Record<string, unknown>) => {
    if (!lobbyId) return;
    await updateLobbySettings(lobbyId, settings);
    broadcast('lobby:settings', { settings });
  }, [lobbyId, broadcast]);

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER HELPERS
  // ─────────────────────────────────────────────────────────────────────────────

  function renderPass() {
    return (
      <View style={styles.passOverlay}>
        <View style={styles.passCard}>
          <Text style={styles.passLabel}>PASS PHONE TO</Text>
          <Text style={styles.passName}>{passTarget.toUpperCase()}</Text>
          <Text style={styles.passHint}>Don't show anyone else!</Text>
          <Pressable style={styles.passReadyBtn} onPress={handlePassConfirmed}>
            <Text style={styles.passReadyText}>I'M READY</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ─── HOST DISCONNECT OVERLAY ──────────────────────────────────────────────────

  if (mode === 'online' && hostDisconnected) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={disconnectStyles.overlay}>
          <Text style={disconnectStyles.title}>Host Disconnected</Text>
          <Text style={disconnectStyles.subtitle}>Waiting for reconnect...</Text>
          <Text style={disconnectStyles.timer}>{hostDisconnectTimer}s</Text>
          <Pressable style={disconnectStyles.leaveBtn} onPress={handleLeaveOnline}>
            <Text style={disconnectStyles.leaveBtnText}>LEAVE GAME</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ─── PHASE: SETUP ────────────────────────────────────────────────────────────

  if (phase === 'setup') {
    // ── Online mode: choose, join, or lobby sub-phases ──
    if (mode === 'online') {
      if (onlinePhase === 'join') {
        return (
          <SafeAreaView style={styles.root}>
            <JoinLobby
              onJoin={(joinedLobbyId, joinedPlayerIndex, joinedCode) => {
                handleJoinSuccess(joinedLobbyId, joinedPlayerIndex, joinedCode);
              }}
              onBack={() => setOnlinePhase('choose')}
            />

          </SafeAreaView>
        );
      }

      if (onlinePhase === 'lobby' && lobby) {
        return (
          <SafeAreaView style={styles.root}>
            <LobbyScreen
              lobby={lobby}
              players={lobbyPlayers}
              presencePlayers={presencePlayers}
              isHost={isHost}
              isReady={isReady}
              onToggleReady={handleToggleReady}
              onStart={handleOnlineStart}
              onLeave={handleLeaveOnline}
              onUpdateSettings={handleUpdateSettings}
              renderSettings={(settings, isHostView) => (
                <View style={{ gap: 12 }}>
                  {/* League selector */}
                  <Text style={onlineStyles.settingLabel}>LEAGUE</Text>
                  <View style={onlineStyles.pillRow}>
                    {(['NBA', 'NFL', 'MLB', 'NHL'] as LeagueKey[]).map((lg) => (
                      <Pressable
                        key={lg}
                        style={[onlineStyles.settingPill, selectedLeague === lg && onlineStyles.settingPillActive]}
                        onPress={() => {
                          if (!isHostView) return;
                          setSelectedLeague(lg);
                          loadAthletes(lg);
                          handleUpdateSettings({ ...settings, league: lg });
                        }}
                        disabled={!isHostView}
                      >
                        <Text style={[onlineStyles.settingPillText, selectedLeague === lg && onlineStyles.settingPillTextActive]}>
                          {lg}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  {/* Rounds selector */}
                  <Text style={onlineStyles.settingLabel}>ROUNDS</Text>
                  <View style={onlineStyles.pillRow}>
                    {([3, 4, 5] as number[]).map((r) => (
                      <Pressable
                        key={r}
                        style={[onlineStyles.settingPill, rounds === r && onlineStyles.settingPillActive]}
                        onPress={() => {
                          if (!isHostView) return;
                          setRounds(r);
                          handleUpdateSettings({ ...settings, rounds: r });
                        }}
                        disabled={!isHostView}
                      >
                        <Text style={[onlineStyles.settingPillText, rounds === r && onlineStyles.settingPillTextActive]}>
                          {r} Rounds
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
            />

          </SafeAreaView>
        );
      }

      // onlinePhase === 'choose' — show Create/Join buttons
      return (
        <SafeAreaView style={styles.root}>
          <ScrollView
            style={styles.zone2Scroll}
            contentContainerStyle={[
              styles.zone2Content,
              { paddingBottom: insets.bottom + 120 },
            ]}
            showsVerticalScrollIndicator={false}
          >
          <View style={[styles.zone1, { paddingTop: insets.top + 16, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }]}>
            <Pressable onPress={onBack} style={styles.backBtnZone1} hitSlop={8}>
              <ArrowLeft size={22} color={colors.white} strokeWidth={2} />
            </Pressable>
            <Text style={styles.zone1Label}>DRAFT WITH FRIENDS</Text>
            <Text style={styles.zone1CategoryLabel}>ONLINE</Text>
          </View>
            <ModeToggle mode={mode} onModeChange={(m) => { setMode(m); setOnlinePhase('choose'); }} />
            <View style={{ height: 32 }} />
            <PrimaryButton label="CREATE GAME" onPress={handleCreateGame} disabled={!userId || onlineLoading} />
            <View style={{ height: 12 }} />
            <GhostButton label="JOIN GAME" onPress={() => setOnlinePhase('join')} />
            {!userId && (
              <Text style={onlineStyles.signInHint}>
                Sign in to create a game. You can still join as a guest.
              </Text>
            )}
            {onlineError && (
              <Text style={onlineStyles.errorText}>{onlineError}</Text>
            )}
          </ScrollView>
        </SafeAreaView>
      );
    }

    // ── LOCAL MODE — existing code unchanged ──
    return (
      <SafeAreaView style={styles.root}>
        <ScrollView
          style={styles.zone2Scroll}
          contentContainerStyle={[
            styles.zone2Content,
            { paddingBottom: insets.bottom + 120 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        {/* Zone 1 */}
        <View style={[styles.zone1, { paddingTop: insets.top + 16, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }]}>
          <Pressable onPress={onBack} style={styles.backBtnZone1} hitSlop={8}>
            <ArrowLeft size={22} color={colors.white} strokeWidth={2} />
          </Pressable>
          <Text style={styles.zone1Label}>DRAFT WITH FRIENDS</Text>
          <Text style={styles.zone1CategoryLabel}>Today's Category</Text>
          <Text style={styles.zone1Category}>{leagueCategory}</Text>
        </View>
          {/* Mode Toggle */}
          <ModeToggle mode={mode} onModeChange={(m) => { setMode(m); setOnlinePhase('choose'); }} />
          <View style={{ height: 16 }} />

          <Text style={styles.sectionTitle}>PLAYERS</Text>
          <Text style={styles.sectionSubtitle}>{playerNames.length} players · {rounds} rounds each</Text>

          {playerNames.map((name, idx) => (
            <View key={idx} style={styles.playerInputRow}>
              <View style={styles.playerIndexBadge}>
                <Text style={styles.playerIndexText}>{idx + 1}</Text>
              </View>
              <TextInput
                style={styles.playerInput}
                value={name}
                onChangeText={(val) => {
                  setPlayerNames((prev) => {
                    const next = [...prev];
                    next[idx] = val;
                    return next;
                  });
                }}
                placeholder={`Player ${idx + 1}`}
                placeholderTextColor={darkColors.textSecondary}
                maxLength={20}
                returnKeyType="done"
              />
              {playerNames.length > 2 && (
                <Pressable onPress={() => handleRemovePlayer(idx)} hitSlop={8} style={styles.removeBtn}>
                  <Text style={styles.removeBtnText}>✕</Text>
                </Pressable>
              )}
            </View>
          ))}

          {playerNames.length < 6 && (
            <Pressable style={styles.addPlayerBtn} onPress={handleAddPlayer}>
              <Text style={styles.addPlayerBtnText}>+ Add Player</Text>
            </Pressable>
          )}

          <View style={styles.setupSpacer} />
          <Text style={styles.sectionTitle}>LEAGUE</Text>
          <View style={styles.roundsRow}>
            {(['NBA', 'NFL', 'MLB', 'NHL'] as LeagueKey[]).map((lg) => (
              <Pressable
                key={lg}
                style={[styles.roundPill, selectedLeague === lg && styles.roundPillActive]}
                onPress={() => handleLeagueChange(lg)}
              >
                <Text style={[styles.roundPillText, selectedLeague === lg && styles.roundPillTextActive]}>
                  {lg}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.setupSpacer} />
          <Text style={styles.sectionTitle}>ROUNDS</Text>
          <View style={styles.roundsRow}>
            {([3, 4, 5] as number[]).map((r) => (
              <Pressable
                key={r}
                style={[styles.roundPill, rounds === r && styles.roundPillActive]}
                onPress={() => setRounds(r)}
              >
                <Text style={[styles.roundPillText, rounds === r && styles.roundPillTextActive]}>
                  {r}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={{ height: 24 }} />
          <PrimaryButton label="START DRAFT" onPress={handleStartDraft} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── PHASE: DRAFT ─────────────────────────────────────────────────────────────

  if (phase === 'draft') {
    // Local mode: show pass screen
    if (mode === 'local' && showPassScreen) {
      return (
        <SafeAreaView style={[styles.root, styles.passRoot]}>
          {renderPass()}
        </SafeAreaView>
      );
    }

    const board = getDraftBoard();
    const activePickerName = activePlayerNames[currentPlayerIndex] || 'Unknown';
    const isOnlineAndNotMyTurn = mode === 'online' && !isMyTurn;

    return (
      <SafeAreaView style={styles.root}>
        {/* Scrollable content: zone1 + board strip + athlete list */}
        <ScrollView
          style={styles.draftScroll}
          contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        {/* Zone 1 */}
        <View style={[styles.zone1Draft, { paddingTop: insets.top + 16, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }]}>
          <Text style={styles.zone1Label}>DRAFT WITH FRIENDS</Text>
          <Text style={styles.draftCategorySmall}>{leagueCategory}</Text>
          <View style={styles.currentPickBanner}>
            {mode === 'online' && isMyTurn ? (
              <>
                <Text style={styles.currentPickLabel}>YOUR PICK</Text>
                <Text style={styles.currentPickName}>{displayName.toUpperCase()}</Text>
              </>
            ) : mode === 'online' && !isMyTurn ? (
              <>
                <Text style={styles.currentPickLabel}>WAITING FOR</Text>
                <Text style={styles.currentPickName}>{activePickerName.toUpperCase()}</Text>
              </>
            ) : (
              <>
                <Text style={styles.currentPickLabel}>IT'S</Text>
                <Text style={styles.currentPickName}>{activePickerName.toUpperCase()}'S PICK</Text>
              </>
            )}
            <Text style={styles.roundBadge}>ROUND {currentRound} OF {rounds}</Text>
          </View>
        </View>
          {/* Draft Board Strip */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.boardStrip}
            contentContainerStyle={styles.boardStripContent}
          >
            {activePlayerNames.map((pName, pIdx) => {
              const isActive = pIdx === currentPlayerIndex;
              const playerPicks = board[pIdx] || [];
              return (
                <View
                  key={pIdx}
                  style={[styles.boardColumn, isActive && styles.boardColumnActive]}
                >
                  <Text style={[styles.boardColumnHeader, isActive && styles.boardColumnHeaderActive]}>
                    {pName}
                  </Text>
                  {Array.from({ length: rounds }).map((_, rIdx) => {
                    const athleteId = playerPicks[rIdx];
                    const isSkipped = athleteId === '__skipped__';
                    const athlete = (athleteId && !isSkipped) ? leagueAthletes.find((a) => a.id === athleteId) : null;
                    return (
                      <View
                        key={rIdx}
                        style={[
                          styles.boardCell,
                          (athlete || isSkipped) ? styles.boardCellFilled : styles.boardCellEmpty,
                          isActive && !athlete && !isSkipped && styles.boardCellActiveEmpty,
                        ]}
                      >
                        <Text style={styles.boardCellRound}>{rIdx + 1}</Text>
                        <Text
                          style={[
                            styles.boardCellName,
                            isSkipped && { color: colors.midGray, fontStyle: 'italic' },
                          ]}
                          numberOfLines={2}
                        >
                          {isSkipped ? 'Skipped' : athlete ? athlete.name : '—'}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </ScrollView>

          {/* Online: waiting message for non-active players */}
          {isOnlineAndNotMyTurn && (
            <View style={onlineStyles.waitingContainer}>
              <Text style={onlineStyles.waitingText}>
                Waiting for {activePickerName} to pick...
              </Text>
            </View>
          )}

          {/* Athlete List — only shown when it's your turn (online) or always (local) */}
          {(!isOnlineAndNotMyTurn) && (
            <View style={styles.athleteList}>
              {leagueAthletes.map((item) => (
                <AthleteRow
                  key={item.id}
                  athlete={item}
                  drafted={draftedIds.has(item.id)}
                  draftedBy={draftedByMap[item.id]}
                  onSelect={() => handleDraftAthlete(item.id)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── PHASE: RESULTS ───────────────────────────────────────────────────────────

  const board = getDraftBoard();

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        style={styles.zone2Scroll}
        contentContainerStyle={[styles.zone2Content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
      {/* Zone 1 */}
      <View style={[styles.zone1Results, { paddingTop: insets.top + 16, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }]}>
        <Text style={styles.zone1Label}>DRAFT WITH FRIENDS</Text>
        <Text style={styles.resultsHeading}>DRAFT COMPLETE</Text>
        <Text style={styles.draftCategorySmall}>{leagueCategory}</Text>
      </View>
        {activePlayerNames.map((pName, pIdx) => {
          const playerPicks = board[pIdx] || [];
          return (
            <View key={pIdx} style={styles.resultCard}>
              <Text style={styles.resultPlayerName}>{pName}</Text>
              <View style={styles.resultPickList}>
                {playerPicks.map((aId, rIdx) => {
                  const isSkipped = aId === '__skipped__';
                  const athlete = isSkipped ? null : leagueAthletes.find((a) => a.id === aId);
                  return (
                    <Text
                      key={rIdx}
                      style={[
                        styles.resultPickItem,
                        isSkipped && { color: colors.midGray, fontStyle: 'italic' },
                      ]}
                    >
                      R{rIdx + 1}: {isSkipped ? 'Skipped' : athlete?.name ?? '—'}
                    </Text>
                  );
                })}
              </View>
            </View>
          );
        })}

        <View style={{ height: 16 }} />
        {xpEarned !== null && (
          <View style={styles.xpCard}>
            <Text style={styles.xpCardLabel}>XP EARNED</Text>
            <Text style={styles.xpCardTotal}>+{xpEarned}</Text>
            <Text style={styles.xpCardBreakdown}>Multiplayer Bonus: {xpEarned} XP</Text>
          </View>
        )}
        <View style={{ height: 16 }} />
        {mode === 'online' ? (
          <GhostButton label="LEAVE LOBBY" onPress={handleLeaveOnline} />
        ) : (
          <>
            <PrimaryButton
              label="PLAY AGAIN"
              onPress={() => {
                setPicks([]);
                setCurrentPickIndex(0);
                setShowPassScreen(false);
                setRounds(3);
                setXpEarned(null);
                setPhase('setup');
              }}
            />
            <View style={{ height: 12 }} />
            <GhostButton label="Back to Games" onPress={onBack} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  passRoot: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Zone 1 ──
  zone1: {
    backgroundColor: colors.brand,
    paddingTop: spacing['3xl'],
    paddingBottom: 140,
    paddingHorizontal: spacing.lg,
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    alignItems: 'center',
  },
  zone1Draft: {
    backgroundColor: colors.brand,
    paddingTop: spacing['2xl'],
    paddingBottom: 140,
    paddingHorizontal: spacing.lg,
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    alignItems: 'center',
  },
  zone1Results: {
    backgroundColor: colors.brand,
    paddingTop: spacing['2xl'],
    paddingBottom: 140,
    paddingHorizontal: spacing.lg,
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    alignItems: 'center',
    gap: 4,
  },
  backBtnZone1: {
    position: 'absolute',
    top: spacing['3xl'],
    left: spacing.lg,
    padding: spacing.sm,
    zIndex: 10,
  },
  zone1Label: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  zone1CategoryLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 8,
  },
  zone1Category: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 22,
    color: colors.white,
    textAlign: 'center',
    marginTop: 4,
  },
  zone1SwitcherWrap: {
    marginTop: 16,
    width: '100%',
  },
  draftCategorySmall: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultsHeading: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 28,
    color: colors.white,
    letterSpacing: 1,
    marginTop: 4,
  },

  // ── Current pick banner ──
  currentPickBanner: {
    alignItems: 'center',
  },
  currentPickLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.65)',
  },
  currentPickName: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 28,
    color: colors.white,
    letterSpacing: 0.5,
  },
  roundBadge: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },

  // ── Zone 2 ──
  zone2Scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  zone2Content: {
    paddingTop: 28,
    paddingHorizontal: spacing.lg,
  },

  // ── Section headers ──
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 2,
    color: darkColors.textSecondary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: darkColors.textSecondary,
    marginBottom: 20,
  },

  // ── Setup: player inputs ──
  playerInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  playerIndexBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.brandAlpha15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerIndexText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 14,
    color: colors.brand,
  },
  playerInput: {
    flex: 1,
    height: 44,
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: darkColors.text,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  removeBtn: {
    padding: 6,
  },
  removeBtnText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: darkColors.textSecondary,
  },
  addPlayerBtn: {
    borderWidth: 1,
    borderColor: darkColors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  addPlayerBtnText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 14,
    color: colors.brand,
  },
  setupSpacer: {
    height: 24,
  },
  roundsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  roundPill: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: darkColors.surfaceElevated,
    borderWidth: 1,
    borderColor: darkColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundPillActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  roundPillText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 17,
    color: darkColors.textSecondary,
  },
  roundPillTextActive: {
    color: colors.white,
  },

  // ── Draft board strip ──
  boardStrip: {
    backgroundColor: darkColors.background,
    borderBottomWidth: 1,
    borderBottomColor: darkColors.border,
  },
  boardStripContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: 12,
    paddingBottom: 0,
    gap: 8,
    flexGrow: 1,
    justifyContent: 'center',
  },
  boardColumn: {
    width: 164,
    gap: 6,
  },
  boardColumnActive: {
    opacity: 1,
  },
  boardColumnHeader: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 12,
    color: darkColors.textSecondary,
    letterSpacing: 0.5,
  },
  boardColumnHeaderActive: {
    color: colors.brand,
  },
  boardCell: {
    borderRadius: 8,
    padding: 8,
    minHeight: 68,
  },
  boardCellFilled: {
    backgroundColor: darkColors.surfaceElevated,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.4)',
  },
  boardCellEmpty: {
    backgroundColor: darkColors.background,
    borderWidth: 1,
    borderColor: darkColors.border,
    borderStyle: 'dashed',
  },
  boardCellActiveEmpty: {
    borderColor: colors.brand,
    borderStyle: 'dashed',
  },
  boardCellRound: {
    fontFamily: fontFamily.bold,
    fontSize: 11,
    letterSpacing: 0.5,
    color: darkColors.textSecondary,
  },
  boardCellName: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: darkColors.text,
    marginTop: 2,
  },

  // ── Draft scroll ──
  draftScroll: {
    flex: 1,
    backgroundColor: darkColors.surface,
  },

  // ── Athlete list ──
  athleteList: {
    backgroundColor: darkColors.surface,
  },
  athleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: darkColors.border,
    gap: 12,
  },
  athleteRowDrafted: {
    opacity: 0.45,
  },
  athleteInfo: {
    flex: 1,
  },
  athleteName: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 15,
    color: darkColors.text,
  },
  athleteNameDrafted: {
    color: darkColors.textSecondary,
  },
  athleteMeta: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: darkColors.textSecondary,
    marginTop: 2,
  },
  athleteMetaDrafted: {
    color: darkColors.textSecondary,
  },
  athleteStat: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.brandMid,
    marginTop: 2,
  },
  athleteStatDrafted: {
    color: darkColors.textSecondary,
  },
  draftedTag: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    color: darkColors.textSecondary,
    backgroundColor: darkColors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  selectBtn: {
    backgroundColor: colors.brand,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
  },
  selectBtnText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: colors.white,
  },

  // ── Pass screen ──
  passOverlay: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: darkColors.background,
    paddingHorizontal: spacing.lg,
    paddingBottom: 140,
  },
  passCard: {
    width: '100%',
    backgroundColor: darkColors.surface,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  passLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 3,
    color: darkColors.textSecondary,
    marginBottom: 8,
  },
  passName: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 34,
    color: colors.brand,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 8,
  },
  passHint: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: darkColors.textSecondary,
    marginBottom: 28,
    textAlign: 'center',
  },
  passReadyBtn: {
    backgroundColor: colors.brand,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 999,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.5)',
  },
  passReadyText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1.5,
    color: colors.white,
  },

  // ── Results ──
  resultCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.4)',
  },
  resultPlayerName: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 17,
    color: darkColors.text,
  },
  resultPickList: {
    gap: 3,
  },
  resultPickItem: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: darkColors.textSecondary,
  },

  // ── XP Card ──────────────────────────────────────────────────────────────
  xpCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
  },
  xpCardLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1,
    color: darkColors.textSecondary,
  },
  xpCardTotal: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 48,
    color: colors.brand,
    lineHeight: 52,
  },
  xpCardBreakdown: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: darkColors.textSecondary,
  },
});

// ─── Online-specific styles ──────────────────────────────────────────────────

const onlineStyles = StyleSheet.create({
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  settingLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 2,
    color: darkColors.textSecondary,
  },
  settingPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    backgroundColor: darkColors.background,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  settingPillActive: {
    backgroundColor: colors.brandAlpha15,
    borderColor: colors.brand,
  },
  settingPillText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: darkColors.textSecondary,
  },
  settingPillTextActive: {
    color: colors.brand,
  },
  signInHint: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: darkColors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  errorText: {
    fontFamily: fontFamily.bold,
    fontSize: 13,
    color: colors.brandDark,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  waitingContainer: {
    paddingVertical: 40,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  waitingText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    color: darkColors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

const disconnectStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkColors.background,
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: darkColors.textSecondary,
    marginBottom: spacing['2xl'],
  },
  timer: {
    fontFamily: fontFamily.bold,
    fontSize: 48,
    color: colors.brand,
    marginBottom: spacing['3xl'],
  },
  leaveBtn: {
    backgroundColor: darkColors.surfaceElevated,
    paddingHorizontal: spacing['3xl'],
    paddingVertical: spacing.lg,
    borderRadius: radius.secondary,
  },
  leaveBtnText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.brand,
  },
});
