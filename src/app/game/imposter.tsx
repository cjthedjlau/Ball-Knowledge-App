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
import { colors, darkColors, fontFamily, spacing } from '../../styles/theme';
import { calculateMultiplayerXP, saveGameResult, updateUserXPAndStreak } from '../../lib/xp';
import { supabase } from '../../lib/supabase';
import { getGamePlayers, type Player } from '../../lib/playersPool';
import PrimaryButton from '../../screens/components/ui/PrimaryButton';
import GhostButton from '../../screens/components/ui/GhostButton';

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
  type GameType,
} from '../../lib/multiplayer';
import { useLobby, type PresencePlayer } from '../../hooks/useLobby';
import { ModeToggle } from '../../components/multiplayer/ModeToggle';
import { JoinLobby } from '../../components/multiplayer/JoinLobby';
import { LobbyScreen } from '../../components/multiplayer/LobbyScreen';

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = 'setup' | 'reveal' | 'discussion' | 'results';
type LeagueOption = 'ALL' | 'NBA' | 'NFL' | 'MLB' | 'NHL';
type Difficulty = 'Normal' | 'Legends' | 'Ball Knowledge';

interface Athlete {
  name: string;
  team: string;
  league: Exclude<LeagueOption, 'ALL'>;
  difficulty: Difficulty;
}

// ─── Athlete Pool — now fetched from players_pool table ──────────────────────

const DEFAULT_PLAYER_COUNT = 4;

function makeDefaultNames(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `Player ${i + 1}`);
}

function pickRandom<T>(arr: T[]): { item: T; index: number } {
  const index = Math.floor(Math.random() * arr.length);
  return { item: arr[index], index };
}

function pickUniqueIndices(count: number, max: number): number[] {
  const indices = new Set<number>();
  while (indices.size < Math.min(count, max)) {
    indices.add(Math.floor(Math.random() * max));
  }
  return Array.from(indices);
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ImposterScreen({ onBack }: Props) {
  const insets = useSafeAreaInsets();

  // ── Setup state ──
  const [playerNames, setPlayerNames] = useState<string[]>(
    makeDefaultNames(DEFAULT_PLAYER_COUNT)
  );
  const [imposterCount, setImposterCount] = useState<1 | 2>(1);
  const [selectedLeague, setSelectedLeague] = useState<LeagueOption>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Normal');

  // ── Game state ──
  const [phase, setPhase] = useState<Phase>('setup');
  const [athlete, setAthlete] = useState<Athlete>({ name: '...', team: '', league: 'NBA', difficulty: 'Normal' });
  const [imposterIndices, setImposterIndices] = useState<number[]>([0]);


  // ── Reveal state ──
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);

  // ── Online mode state ──
  const [mode, setMode] = useState<'local' | 'online'>('local');
  const [onlinePhase, setOnlinePhase] = useState<'choose' | 'join' | 'lobby' | 'playing'>('choose');
  const [lobbyCode, setLobbyCode] = useState<string | null>(null);
  const [lobbyId, setLobbyId] = useState<string | null>(null);
  const [myPlayerIndex, setMyPlayerIndex] = useState(0);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [lobby, setLobby] = useState<GameLobby | null>(null);
  const [lobbyPlayers, setLobbyPlayers] = useState<LobbyPlayer[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [myRole, setMyRole] = useState<'detective' | 'imposter' | null>(null);
  const [onlineLoading, setOnlineLoading] = useState(false);

  // ── Auth state for online mode ──
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');

  // Get user info on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        setDisplayName(user.user_metadata?.display_name || user.email?.split('@')[0] || 'Player');
      }
    });
  }, []);

  // ── useLobby hook for realtime ──
  const { presencePlayers, isConnected, broadcast, onEvent } = useLobby({
    code: lobbyCode,
    displayName,
    userId,
    playerIndex: myPlayerIndex,
  });

  // ── Online event listeners ──
  useEffect(() => {
    if (mode !== 'online' || !lobbyCode) return;

    const unsubRoles = onEvent('game:roles', (payload: any) => {
      const myData = payload[myPlayerIndex];
      if (myData) {
        setMyRole(myData.role);
        if (myData.athlete) {
          setAthlete(myData.athlete);
        }
        setPhase('reveal');
      }
    });

    const unsubReveal = onEvent('game:reveal', () => {
      setPhase('results');
    });

    const unsubSettings = onEvent('lobby:settings', (payload: any) => {
      if (payload.settings) {
        setLobby(prev => prev ? { ...prev, settings: payload.settings } : prev);
        if (payload.settings.league) setSelectedLeague(payload.settings.league);
        if (payload.settings.difficulty) setSelectedDifficulty(payload.settings.difficulty);
        if (payload.settings.imposterCount) setImposterCount(payload.settings.imposterCount);
      }
    });

    return () => { unsubRoles(); unsubReveal(); unsubSettings(); };
  }, [mode, lobbyCode, myPlayerIndex, onEvent]);

  // ─────────────────────────────────────────────────────────────────────────────
  // SETUP HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────

  const handleSetCount = useCallback((count: number) => {
    setPlayerNames((prev) => {
      if (count > prev.length) {
        return [...prev, ...makeDefaultNames(count).slice(prev.length)];
      }
      return prev.slice(0, count);
    });
  }, []);

  const handleAddPlayer = useCallback(() => {
    if (playerNames.length < 8) {
      setPlayerNames((prev) => [...prev, `Player ${prev.length + 1}`]);
    }
  }, [playerNames.length]);

  const handleRemovePlayer = useCallback(() => {
    if (playerNames.length > 3) {
      setPlayerNames((prev) => prev.slice(0, -1));
    }
  }, [playerNames.length]);

  const handleStartGame = useCallback(async () => {
    const league = selectedLeague === 'ALL' ? 'NBA' : selectedLeague;
    const pool = await getGamePlayers(league);
    const fetched = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : null;
    if (!fetched) return;
    const chosenAthlete: Athlete = {
      name: fetched.name,
      team: fetched.team,
      league: (fetched.league as Exclude<LeagueOption, 'ALL'>) || 'NBA',
      difficulty: selectedDifficulty,
    };
    const chosenImposters = pickUniqueIndices(imposterCount, playerNames.length);
    setAthlete(chosenAthlete);
    setImposterIndices(chosenImposters);
    setCurrentRevealIndex(0);
    setCardFlipped(false);
    setPhase('reveal');
  }, [playerNames, imposterCount, selectedLeague, selectedDifficulty]);

  const handleResetGame = useCallback(() => {
    setPhase('setup');
    setCardFlipped(false);
    setXpEarned(null);
  }, []);

  const handleShowResults = useCallback(() => {
    const xp = calculateMultiplayerXP(1);
    setXpEarned(xp);
    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await saveGameResult(user.id, 'imposter', xp, 1);
        await updateUserXPAndStreak(user.id, xp, false);
      }
    })();
    setPhase('results');
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // ONLINE HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────

  const handleCreateGame = useCallback(async () => {
    if (!userId) return;
    setOnlineLoading(true);
    try {
      const { code, lobbyId: id } = await createLobby('imposter', userId, displayName);
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
        game_type: 'imposter',
        host_user_id: userId,
        status: 'waiting',
        settings: {},
        game_state: {},
      });
    } catch (e: any) {
      console.error('Create lobby failed:', e.message);
    } finally {
      setOnlineLoading(false);
    }
  }, [userId, displayName]);

  const handleJoinSuccess = useCallback(async (joinedLobbyId: string, joinedPlayerIndex: number) => {
    setLobbyId(joinedLobbyId);
    setMyPlayerIndex(joinedPlayerIndex);
    setOnlinePhase('lobby');
    const players = await getLobbyPlayers(joinedLobbyId);
    setLobbyPlayers(players);
    const me = players.find(p => p.player_index === joinedPlayerIndex);
    setMyPlayerId(me?.id || null);
    // Find the lobby code from the first player's lobby_id
    if (players.length > 0) {
      const lobbyRow = players[0];
      setLobby({
        id: joinedLobbyId,
        code: lobbyCode || '',
        game_type: 'imposter',
        host_user_id: '',
        status: 'waiting',
        settings: {},
        game_state: {},
      });
    }
  }, [lobbyCode]);

  const handleToggleReady = useCallback(async () => {
    if (!myPlayerId) return;
    const newReady = !isReady;
    setIsReady(newReady);
    await togglePlayerReady(myPlayerId, newReady);
    broadcast('player:ready', { playerIndex: myPlayerIndex, isReady: newReady });
    if (lobbyId) {
      const players = await getLobbyPlayers(lobbyId);
      setLobbyPlayers(players);
    }
  }, [myPlayerId, isReady, myPlayerIndex, broadcast, lobbyId]);

  const handleOnlineStart = useCallback(async () => {
    if (!isHost || !lobbyId) return;
    const league = selectedLeague === 'ALL' ? 'NBA' : selectedLeague;
    const pool = await getGamePlayers(league);
    const fetched = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : null;
    if (!fetched) return;
    const chosenAthlete: Athlete = {
      name: fetched.name,
      team: fetched.team,
      league: (fetched.league as Exclude<LeagueOption, 'ALL'>) || 'NBA',
      difficulty: selectedDifficulty,
    };
    const chosenImposters = pickUniqueIndices(imposterCount, lobbyPlayers.length);

    setAthlete(chosenAthlete);
    setImposterIndices(chosenImposters);

    // Build roles map: { [playerIndex]: { role, athlete? } }
    const roles: Record<number, { role: string; athlete?: Athlete }> = {};
    lobbyPlayers.forEach(p => {
      if (chosenImposters.includes(p.player_index)) {
        roles[p.player_index] = { role: 'imposter' };
      } else {
        roles[p.player_index] = { role: 'detective', athlete: chosenAthlete };
      }
    });

    await updateLobbyStatus(lobbyId, 'playing');
    broadcast('game:roles', roles);

    // Host also sets own role
    const myData = roles[myPlayerIndex];
    setMyRole(myData.role as 'detective' | 'imposter');
    setPhase('reveal');
  }, [isHost, lobbyId, selectedLeague, selectedDifficulty, imposterCount, lobbyPlayers, broadcast, myPlayerIndex]);

  const handleOnlineReveal = useCallback(() => {
    broadcast('game:reveal', {});
    const xp = calculateMultiplayerXP(1);
    setXpEarned(xp);
    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await saveGameResult(user.id, 'imposter', xp, 1);
        await updateUserXPAndStreak(user.id, xp, false);
      }
    })();
    setPhase('results');
  }, [broadcast]);

  const handleLeaveOnline = useCallback(async () => {
    if (lobbyId && myPlayerId) {
      await leaveLobby(lobbyId, myPlayerId);
    }
    // Reset online state
    setLobbyCode(null);
    setLobbyId(null);
    setMyPlayerId(null);
    setLobby(null);
    setLobbyPlayers([]);
    setIsHost(false);
    setIsReady(false);
    setMyRole(null);
    setOnlinePhase('choose');
    setPhase('setup');
  }, [lobbyId, myPlayerId]);

  const handleUpdateSettings = useCallback(async (settings: Record<string, unknown>) => {
    if (!lobbyId) return;
    await updateLobbySettings(lobbyId, settings);
    broadcast('lobby:settings', { settings });
  }, [lobbyId, broadcast]);

  // ─────────────────────────────────────────────────────────────────────────────
  // REVEAL HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────

  const handleFlipCard = useCallback(() => {
    if (!cardFlipped) setCardFlipped(true);
  }, [cardFlipped]);

  const handleRevealDone = useCallback(() => {
    const nextIndex = currentRevealIndex + 1;
    if (nextIndex >= playerNames.length) {
      setPhase('discussion');
    } else {
      setCurrentRevealIndex(nextIndex);
      setCardFlipped(false);
    }
  }, [currentRevealIndex, playerNames.length]);

  // ─────────────────────────────────────────────────────────────────────────────
  // SHARED LAYOUT HELPERS
  // ─────────────────────────────────────────────────────────────────────────────

  function Zone1({ children }: { children: React.ReactNode }) {
    return (
      <View style={styles.zone1}>
        <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
          <ArrowLeft size={22} color={colors.white} strokeWidth={2} />
        </Pressable>
        <Text style={styles.gameTitle}>SPORTS IMPOSTER</Text>
        {children}
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PHASE: SETUP
  // ─────────────────────────────────────────────────────────────────────────────

  if (phase === 'setup') {
    // ── Online mode: choose, join, or lobby sub-phases ──
    if (mode === 'online') {
      if (onlinePhase === 'join') {
        return (
          <SafeAreaView style={styles.root}>
            <JoinLobby
              onJoin={(joinedLobbyId, joinedPlayerIndex) => {
                handleJoinSuccess(joinedLobbyId, joinedPlayerIndex);
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
                  <Text style={styles.sectionLabel}>LEAGUE</Text>
                  <View style={styles.pillRow}>
                    {(['ALL', 'NBA', 'NFL', 'MLB', 'NHL'] as LeagueOption[]).map((lg) => (
                      <Pressable
                        key={lg}
                        style={[styles.settingPill, selectedLeague === lg && styles.settingPillActive]}
                        onPress={() => {
                          if (!isHostView) return;
                          setSelectedLeague(lg);
                          handleUpdateSettings({ ...settings, league: lg });
                        }}
                        disabled={!isHostView}
                      >
                        <Text style={[styles.settingPillText, selectedLeague === lg && styles.settingPillTextActive]}>
                          {lg}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  {/* Difficulty */}
                  <Text style={styles.sectionLabel}>DIFFICULTY</Text>
                  <View style={styles.pillRow}>
                    {(['Normal', 'Legends', 'Ball Knowledge'] as Difficulty[]).map((d) => (
                      <Pressable
                        key={d}
                        style={[styles.settingPill, selectedDifficulty === d && styles.settingPillActive]}
                        onPress={() => {
                          if (!isHostView) return;
                          setSelectedDifficulty(d);
                          handleUpdateSettings({ ...settings, difficulty: d });
                        }}
                        disabled={!isHostView}
                      >
                        <Text style={[styles.settingPillText, selectedDifficulty === d && styles.settingPillTextActive]}>
                          {d}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  {/* Imposter count */}
                  <Text style={styles.sectionLabel}>IMPOSTERS</Text>
                  <View style={styles.pillRow}>
                    {([1, 2] as const).map((n) => (
                      <Pressable
                        key={n}
                        style={[styles.settingPill, imposterCount === n && styles.settingPillActive]}
                        onPress={() => {
                          if (!isHostView) return;
                          setImposterCount(n);
                          handleUpdateSettings({ ...settings, imposterCount: n });
                        }}
                        disabled={!isHostView}
                      >
                        <Text style={[styles.settingPillText, imposterCount === n && styles.settingPillTextActive]}>
                          {n} {n === 1 ? 'Imposter' : 'Imposters'}
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
          <Zone1>
            <Text style={styles.zone1Sub}>ONLINE</Text>
          </Zone1>
          <View style={[styles.zone2, styles.zone2Center, { paddingBottom: insets.bottom + 24 }]}>
            <ModeToggle mode={mode} onModeChange={(m) => { setMode(m); setOnlinePhase('choose'); }} />
            <View style={{ height: 32 }} />
            <PrimaryButton label="CREATE GAME" onPress={handleCreateGame} disabled={!userId || onlineLoading} />
            <View style={{ height: 12 }} />
            <GhostButton label="JOIN GAME" onPress={() => setOnlinePhase('join')} />
            {!userId && (
              <Text style={styles.onlineSignInHint}>
                Sign in to create a game. You can still join as a guest.
              </Text>
            )}
          </View>
        </SafeAreaView>
      );
    }

    // ── LOCAL MODE — existing code unchanged ──
    const canStart = playerNames.length >= 3 && playerNames.every((n) => n.trim().length > 0);

    return (
      <SafeAreaView style={styles.root}>
        <Zone1>
          <Text style={styles.zone1Sub}>SETUP</Text>
        </Zone1>

        <ScrollView
          style={styles.zone2}
          contentContainerStyle={[styles.zone2Content, { paddingBottom: insets.bottom + 24 }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Mode Toggle */}
          <ModeToggle mode={mode} onModeChange={(m) => { setMode(m); setOnlinePhase('choose'); }} />
          <View style={{ height: 16 }} />

          {/* PLAYERS */}
          <View style={styles.playerListHeader}>
            <Text style={styles.sectionLabel}>PLAYERS</Text>
            <View style={styles.addRemoveRow}>
              <Pressable
                style={[styles.smallBtn, playerNames.length <= 3 && styles.smallBtnDisabled]}
                onPress={handleRemovePlayer}
                disabled={playerNames.length <= 3}
              >
                <Text style={styles.smallBtnText}>−</Text>
              </Pressable>
              <Pressable
                style={[styles.smallBtn, playerNames.length >= 8 && styles.smallBtnDisabled]}
                onPress={handleAddPlayer}
                disabled={playerNames.length >= 8}
              >
                <Text style={styles.smallBtnText}>+</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.countRow}>
            {[3, 4, 5, 6, 7, 8].map((n) => (
              <Pressable
                key={n}
                style={[styles.countBtn, playerNames.length === n && styles.countBtnSelected]}
                onPress={() => handleSetCount(n)}
              >
                <Text style={[styles.countBtnText, playerNames.length === n && styles.countBtnTextSelected]}>
                  {n}
                </Text>
              </Pressable>
            ))}
          </View>

          {playerNames.map((name, idx) => (
            <View key={idx} style={styles.playerInputRow}>
              <View style={styles.playerBadge}>
                <Text style={styles.playerBadgeText}>{idx + 1}</Text>
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
            </View>
          ))}

          {/* IMPOSTERS */}
          <View style={styles.setupSectionSpacer} />
          <Text style={styles.sectionLabel}>IMPOSTERS</Text>
          <View style={styles.pillRow}>
            {([1, 2] as const).map((n) => (
              <Pressable
                key={n}
                style={[styles.settingPill, imposterCount === n && styles.settingPillActive]}
                onPress={() => setImposterCount(n)}
              >
                <Text style={[styles.settingPillText, imposterCount === n && styles.settingPillTextActive]}>
                  {n} {n === 1 ? 'Imposter' : 'Imposters'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* LEAGUE */}
          <View style={styles.setupSectionSpacer} />
          <Text style={styles.sectionLabel}>LEAGUE</Text>
          <View style={styles.pillRow}>
            {(['ALL', 'NBA', 'NFL', 'MLB', 'NHL'] as LeagueOption[]).map((lg) => (
              <Pressable
                key={lg}
                style={[styles.settingPill, selectedLeague === lg && styles.settingPillActive]}
                onPress={() => setSelectedLeague(lg)}
              >
                <Text style={[styles.settingPillText, selectedLeague === lg && styles.settingPillTextActive]}>
                  {lg}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* DIFFICULTY */}
          <View style={styles.setupSectionSpacer} />
          <Text style={styles.sectionLabel}>DIFFICULTY</Text>
          <View style={styles.pillColumn}>
            {(['Normal', 'Legends', 'Ball Knowledge'] as Difficulty[]).map((d) => (
              <Pressable
                key={d}
                style={[styles.settingPill, selectedDifficulty === d && styles.settingPillActive]}
                onPress={() => setSelectedDifficulty(d)}
              >
                <Text style={[styles.settingPillText, selectedDifficulty === d && styles.settingPillTextActive]}>
                  {d}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={{ height: 24 }} />
          <PrimaryButton label="START GAME" onPress={handleStartGame} disabled={!canStart} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PHASE: REVEAL
  // ─────────────────────────────────────────────────────────────────────────────

  if (phase === 'reveal') {
    // ── Online mode: show only this player's role card directly ──
    if (mode === 'online') {
      return (
        <SafeAreaView style={styles.root}>
          <Zone1>
            <Text style={styles.zone1Sub}>YOUR ROLE</Text>
          </Zone1>
          <View style={[styles.zone2, styles.zone2Center, { paddingBottom: insets.bottom + 20 }]}>
            {myRole === 'imposter' ? (
              <View style={[styles.flipCard, styles.flipCardImposter]}>
                <Text style={styles.flipCardRoleEmoji}>😈</Text>
                <Text style={styles.flipCardRoleImposter}>IMPOSTER</Text>
                <Text style={styles.flipCardAthleteUnknown}>You don't know who the athlete is!</Text>
                <View style={styles.flipCardDivider} />
                <Text style={styles.flipCardHint}>Listen carefully. Bluff convincingly.</Text>
              </View>
            ) : (
              <View style={[styles.flipCard, styles.flipCardDetective]}>
                <Text style={styles.flipCardRoleEmoji}>🕵️</Text>
                <Text style={styles.flipCardRoleDetective}>DETECTIVE</Text>
                <Text style={styles.flipCardAthleteName}>{athlete.name}</Text>
                <Text style={styles.flipCardAthleteTeam}>{athlete.team}</Text>
                <View style={styles.flipCardDivider} />
                <Text style={styles.flipCardHint}>Give clues without being too obvious!</Text>
              </View>
            )}
            <View style={{ height: 20 }} />
            <GhostButton label="READY — START DISCUSSION" onPress={() => setPhase('discussion')} />
          </View>
        </SafeAreaView>
      );
    }

    // ── Local mode: pass-the-phone reveal flow ──
    const currentPlayer = playerNames[currentRevealIndex];
    const isImposter = imposterIndices.includes(currentRevealIndex);

    return (
      <SafeAreaView style={styles.root}>
        <Zone1>
          <Text style={styles.revealPassInstruction}>
            PASS THE PHONE TO{'\n'}{currentPlayer.toUpperCase()}
          </Text>
          <Text style={styles.revealPassHint}>Don't show anyone else your screen</Text>
        </Zone1>

        <View style={[styles.zone2, styles.zone2Center, { paddingBottom: insets.bottom + 20 }]}>
          {/* Flip card */}
          <Pressable onPress={handleFlipCard} activeOpacity={0.9} style={styles.flipCardWrapper}>
            {!cardFlipped ? (
              // Front face
              <View style={[styles.flipCard, styles.flipCardFront]}>
                <Text style={styles.flipCardEmoji}>❓</Text>
                <Text style={styles.flipCardFrontLabel}>TAP TO REVEAL YOUR ROLE</Text>
              </View>
            ) : isImposter ? (
              // Imposter back
              <View style={[styles.flipCard, styles.flipCardImposter]}>
                <Text style={styles.flipCardRoleEmoji}>😈</Text>
                <Text style={styles.flipCardRoleImposter}>IMPOSTER</Text>
                <Text style={styles.flipCardAthleteUnknown}>You don't know who the athlete is!</Text>
                <View style={styles.flipCardDivider} />
                <Text style={styles.flipCardHint}>
                  Listen carefully to others' clues. Bluff your own clue convincingly. Avoid being voted out!
                </Text>
              </View>
            ) : (
              // Detective back
              <View style={[styles.flipCard, styles.flipCardDetective]}>
                <Text style={styles.flipCardRoleEmoji}>🕵️</Text>
                <Text style={styles.flipCardRoleDetective}>DETECTIVE</Text>
                <Text style={styles.flipCardAthleteName}>{athlete.name}</Text>
                <Text style={styles.flipCardAthleteTeam}>{athlete.team}</Text>
                <View style={styles.flipCardDivider} />
                <Text style={styles.flipCardHint}>
                  Give ONE clue out loud. Don't make it too obvious!
                </Text>
              </View>
            )}
          </Pressable>

          {/* Done button — only after flip */}
          {cardFlipped && (
            <View style={styles.revealDoneWrapper}>
              <GhostButton label="DONE — PASS THE PHONE" onPress={handleRevealDone} />
            </View>
          )}

          {/* Progress */}
          <Text style={styles.revealProgress}>
            {currentRevealIndex} OF {playerNames.length} PLAYERS HAVE SEEN THEIR ROLE
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PHASE: CLUES
  // ─────────────────────────────────────────────────────────────────────────────

  // ─────────────────────────────────────────────────────────────────────────────
  // PHASE: DISCUSSION
  // ─────────────────────────────────────────────────────────────────────────────

  if (phase === 'discussion') {
    return (
      <SafeAreaView style={styles.root}>
        <Zone1>
          <Text style={styles.zone1Sub}>DISCUSS</Text>
        </Zone1>

        <View style={[styles.zone2, styles.zone2Center, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.discussCard}>
            <Text style={styles.discussEmoji}>🗣️</Text>
            <Text style={styles.discussTitle}>WHO IS THE IMPOSTER?</Text>
            <Text style={styles.discussBody}>
              Debate your clues. Point fingers. Make your case. When the group has decided, reveal the truth.
            </Text>
          </View>

          <View style={styles.discussBtnWrapper}>
            {mode === 'online' && isHost ? (
              <PrimaryButton label="REVEAL THE IMPOSTER" onPress={handleOnlineReveal} />
            ) : mode === 'online' && !isHost ? (
              <Text style={styles.onlineWaitingHint}>Waiting for the host to reveal...</Text>
            ) : (
              <PrimaryButton label="REVEAL THE IMPOSTER" onPress={handleShowResults} />
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PHASE: RESULTS
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.root}>
      <Zone1>
        <Text style={styles.zone1Sub}>THE REVEAL</Text>
      </Zone1>

      <ScrollView
        style={styles.zone2}
        contentContainerStyle={[styles.zone2Content, { paddingBottom: insets.bottom + 24 }]}
      >
        {/* Imposter reveal */}
        <View style={styles.imposterRevealCard}>
          <Text style={styles.revealCardLabel}>
            {imposterIndices.length > 1 ? 'THE IMPOSTERS WERE' : 'THE IMPOSTER WAS'}
          </Text>
          <Text style={styles.imposterRevealEmoji}>😈</Text>
          <Text style={styles.imposterRevealName}>
            {mode === 'online'
              ? imposterIndices.map((i) => {
                  const p = lobbyPlayers.find(lp => lp.player_index === i);
                  return p?.display_name ?? `Player ${i + 1}`;
                }).join(' & ')
              : imposterIndices.map((i) => playerNames[i]).join(' & ')
            }
          </Text>
        </View>

        {/* Athlete reveal */}
        <View style={styles.athleteRevealCard}>
          <Text style={styles.revealCardLabel}>THE SECRET ATHLETE WAS</Text>
          <Text style={styles.athleteRevealName}>{athlete.name}</Text>
          <Text style={styles.athleteRevealTeam}>{athlete.team}</Text>
        </View>

        <View style={{ height: 20 }} />
        {xpEarned !== null && (
          <View style={styles.xpCard}>
            <Text style={styles.xpCardLabel}>⭐ XP EARNED</Text>
            <Text style={styles.xpCardTotal}>+{xpEarned}</Text>
            <Text style={styles.xpCardBreakdown}>Multiplayer Bonus: {xpEarned} XP</Text>
          </View>
        )}
        <View style={{ height: 20 }} />
        {mode === 'online' ? (
          <>
            <GhostButton label="LEAVE LOBBY" onPress={handleLeaveOnline} />
          </>
        ) : (
          <>
            <PrimaryButton label="PLAY AGAIN" onPress={handleStartGame} />
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

  // ── Zone 1 ──
  zone1: {
    backgroundColor: colors.brand,
    paddingTop: spacing['3xl'],
    paddingBottom: 24,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: spacing['3xl'],
    left: spacing.lg,
    padding: spacing.sm,
    zIndex: 10,
  },
  gameTitle: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 2.5,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 8,
  },
  zone1Sub: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 20,
    color: colors.white,
    letterSpacing: 1,
    textAlign: 'center',
  },

  // ── Zone 2 ──
  zone2: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
  },
  zone2Content: {
    paddingTop: 28,
    paddingHorizontal: spacing.lg,
    gap: 10,
  },
  zone2Center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 32,
  },

  // ── Section label ──
  sectionLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2.5,
    color: darkColors.textSecondary,
    marginBottom: 4,
    marginTop: 4,
  },

  // ── Setup: count selector ──
  countRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  countBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(59,130,246,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(59,130,246,0.2)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.3)',
  },
  countBtnSelected: {
    backgroundColor: colors.accentBlue,
    borderBottomColor: 'rgba(30,80,200,0.6)',
  },
  countBtnText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    color: colors.accentBlue,
  },
  countBtnTextSelected: {
    color: colors.white,
  },

  // ── Setup: section spacing + setting pills ──
  setupSectionSpacer: {
    height: 20,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  pillColumn: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 8,
  },
  settingPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: darkColors.surfaceElevated,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  settingPillActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  settingPillText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 14,
    color: darkColors.textSecondary,
  },
  settingPillTextActive: {
    color: colors.white,
  },

  // ── Setup: player inputs ──
  playerListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  addRemoveRow: {
    flexDirection: 'row',
    gap: 8,
  },
  smallBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.brandAlpha15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallBtnDisabled: {
    opacity: 0.3,
  },
  smallBtnText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 20,
    color: colors.brand,
    lineHeight: 24,
    includeFontPadding: false,
  },
  playerInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  playerBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.brandAlpha15,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  playerBadgeText: {
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

  // ── Reveal ──
  revealPassInstruction: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 22,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 28,
  },
  revealPassHint: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginTop: 6,
  },
  flipCardWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  flipCard: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 14,
  },
  flipCardFront: {
    backgroundColor: darkColors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: 'rgba(252,52,92,0.4)',
    borderStyle: 'dashed',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.5)',
  },
  flipCardEmoji: {
    fontSize: 48,
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  flipCardFrontLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
    color: colors.brand,
    textAlign: 'center',
  },
  flipCardDetective: {
    backgroundColor: '#0E0E0E',
    borderTopWidth: 3,
    borderTopColor: colors.accentGreen,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.6)',
    borderColor: 'transparent',
  },
  flipCardImposter: {
    backgroundColor: '#0E0E0E',
    borderTopWidth: 3,
    borderTopColor: colors.brand,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.6)',
    borderColor: 'transparent',
  },
  flipCardRoleEmoji: {
    fontSize: 28,
  },
  flipCardRoleDetective: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 20,
    color: colors.accentGreen,
    letterSpacing: 1,
  },
  flipCardRoleImposter: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 20,
    color: colors.brand,
    letterSpacing: 1,
  },
  flipCardAthleteName: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 28,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  flipCardAthleteTeam: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: darkColors.textSecondary,
    textAlign: 'center',
  },
  flipCardAthleteUnknown: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 18,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 24,
  },
  flipCardDivider: {
    width: '80%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 4,
    borderStyle: 'dashed',
  },
  flipCardHint: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: darkColors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  revealDoneWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  revealProgress: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: darkColors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },

  // ── Discussion ──
  discussCard: {
    width: '100%',
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 14,
    marginBottom: 8,
  },
  discussEmoji: {
    fontSize: 52,
  },
  discussTitle: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 26,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  discussBody: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: darkColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  discussBtnWrapper: {
    width: '100%',
    marginTop: 12,
  },

  // ── Results: reveal cards ──
  revealCardLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2.5,
    color: darkColors.textSecondary,
    marginBottom: 4,
  },
  imposterRevealCard: {
    backgroundColor: 'rgba(252,52,92,0.12)',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: colors.brand,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  imposterRevealEmoji: {
    fontSize: 44,
  },
  imposterRevealName: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 34,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  athleteRevealCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  athleteRevealName: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 30,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  athleteRevealTeam: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: darkColors.textSecondary,
    textAlign: 'center',
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
    width: '100%',
  },
  xpCardLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1,
    color: '#9A9A9A',
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
    color: '#9A9A9A',
  },

  // ── Online mode ──
  onlineSignInHint: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: darkColors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
  onlineWaitingHint: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: darkColors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
