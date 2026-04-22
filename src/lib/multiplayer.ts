import { RealtimeChannel } from '@supabase/supabase-js'
import { Platform } from 'react-native'
import { supabase } from './supabase'

// Conditionally load SecureStore (native only)
let SecureStore: any = null
if (Platform.OS !== 'web') {
  try { SecureStore = require('expo-secure-store'); } catch (e) {
    console.error('[Multiplayer] SecureStore failed to load:', e);
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface JoinedLobbyInfo {
  lobbyId: string
  playerIndex: number
  code: string
  gameType: string
}

export type GameType = 'imposter' | 'wavelength' | 'draft' | 'hot-take-showdown' | 'hot-take-showdown'
export type LobbyStatus = 'waiting' | 'playing' | 'finished'

export interface GameLobby {
  id: string
  code: string
  game_type: GameType
  host_user_id: string
  status: LobbyStatus
  settings: Record<string, unknown>
  game_state: Record<string, unknown>
}

export interface LobbyPlayer {
  id: string
  lobby_id: string
  user_id: string | null
  display_name: string
  player_index: number
  is_host: boolean
  is_ready: boolean
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const LOBBY_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

/**
 * Generates a unique 6-character lobby code, excluding ambiguous characters
 * (0, O, 1, I, L). Checks the database for collisions and retries up to 5
 * times before throwing.
 */
export async function generateLobbyCode(): Promise<string> {
  const MAX_ATTEMPTS = 5

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += LOBBY_CHARS[Math.floor(Math.random() * LOBBY_CHARS.length)]
    }

    const { data, error } = await supabase
      .from('game_lobbies')
      .select('id')
      .eq('code', code)
      .maybeSingle()

    if (error) {
      throw new Error(`Failed to check lobby code uniqueness: ${error.message}`)
    }

    // No collision — code is available
    if (!data) {
      return code
    }
  }

  throw new Error(
    'Unable to generate a unique lobby code after 5 attempts. Please try again.',
  )
}

// ---------------------------------------------------------------------------
// Lobby CRUD
// ---------------------------------------------------------------------------

/**
 * Creates a new game lobby and inserts the host as the first player.
 * Also cleans up any expired lobbies owned by this host.
 */
export async function createLobby(
  gameType: GameType,
  hostUserId: string,
  hostDisplayName: string,
): Promise<{ code: string; lobbyId: string }> {
  // Clean up expired lobbies owned by this host
  await supabase
    .from('game_lobbies')
    .delete()
    .eq('host_user_id', hostUserId)
    .lt('expires_at', new Date().toISOString())

  const code = await generateLobbyCode()

  const { data: lobby, error: lobbyError } = await supabase
    .from('game_lobbies')
    .insert({
      code,
      game_type: gameType,
      host_user_id: hostUserId,
      status: 'waiting' as LobbyStatus,
      settings: {},
      game_state: {},
    })
    .select()
    .single()

  if (lobbyError || !lobby) {
    throw new Error(
      `Failed to create lobby: ${lobbyError?.message ?? 'Unknown error'}`,
    )
  }

  const { error: playerError } = await supabase.from('lobby_players').insert({
    lobby_id: lobby.id,
    user_id: hostUserId,
    display_name: hostDisplayName,
    player_index: 0,
    is_host: true,
    is_ready: false,
  })

  if (playerError) {
    throw new Error(`Failed to add host to lobby: ${playerError.message}`)
  }

  return { code, lobbyId: lobby.id }
}

/**
 * Joins an existing lobby by its 6-character code.
 * The code is case-insensitive (uppercased before lookup).
 */
export async function joinLobby(
  code: string,
  displayName: string,
  userId?: string,
): Promise<{ lobbyId: string; playerIndex: number; lobby: GameLobby }> {
  const upperCode = code.toUpperCase()

  const { data: lobby, error: lobbyError } = await supabase
    .from('game_lobbies')
    .select('*')
    .eq('code', upperCode)
    .single()

  if (lobbyError || !lobby) {
    throw new Error(
      `Lobby not found for code "${upperCode}": ${lobbyError?.message ?? 'No matching lobby'}`,
    )
  }

  if (lobby.status !== 'waiting') {
    throw new Error(
      `Cannot join lobby — current status is "${lobby.status}". Only lobbies with status "waiting" accept new players.`,
    )
  }

  // Fetch all existing players for cap check and stale row cleanup
  const { data: existingPlayers, error: playersError } = await supabase
    .from('lobby_players')
    .select('id, player_index, user_id')
    .eq('lobby_id', lobby.id)
    .order('player_index', { ascending: false })

  if (playersError) {
    throw new Error(
      `Failed to query existing players: ${playersError.message}`,
    )
  }

  // Max player cap per game type
  const MAX_PLAYERS: Record<string, number> = {
    imposter: 10,
    wavelength: 10,
    draft: 8,
    'hot-take-showdown': 20, // 8 players + audience
  }
  const cap = MAX_PLAYERS[lobby.game_type] ?? 10
  if (existingPlayers && existingPlayers.length >= cap) {
    throw new Error(`Lobby is full (max ${cap} players).`)
  }

  // Clean up stale rows if this user already has one (e.g. from a previous disconnected session)
  if (userId && existingPlayers) {
    const staleRows = existingPlayers.filter(p => p.user_id === userId)
    for (const stale of staleRows) {
      await supabase.from('lobby_players').delete().eq('id', stale.id)
    }
  }

  const nextIndex =
    existingPlayers && existingPlayers.length > 0
      ? existingPlayers[0].player_index + 1
      : 0

  const { data: insertedPlayer, error: insertError } = await supabase
    .from('lobby_players')
    .insert({
      lobby_id: lobby.id,
      user_id: userId ?? null,
      display_name: displayName,
      player_index: nextIndex,
      is_host: false,
      is_ready: false,
    })
    .select('id, session_token')
    .single()

  if (insertError || !insertedPlayer) {
    throw new Error(`Failed to join lobby: ${insertError?.message ?? 'Unknown error'}`)
  }

  // Store session token locally so guest players can toggle ready / leave
  if (!userId && insertedPlayer.session_token && SecureStore) {
    await SecureStore.setItemAsync(
      `lobby_session_${insertedPlayer.id}`,
      insertedPlayer.session_token,
    )
  }

  return {
    lobbyId: lobby.id,
    playerIndex: nextIndex,
    lobby: lobby as GameLobby,
  }
}

/**
 * Leaves a lobby. If the player is the host the entire lobby is deleted
 * (cascade will clean up associated lobby_players rows). Otherwise only the
 * player's own row is removed.
 * Guest players use the RPC function with a session token.
 */
export async function leaveLobby(
  lobbyId: string,
  playerId: string,
): Promise<void> {
  // Check if this player has a stored session token (guest path — native only)
  const sessionToken = SecureStore ? await SecureStore.getItemAsync(`lobby_session_${playerId}`) : null

  if (sessionToken) {
    // Guest path: use RPC with session token verification
    const { error } = await supabase.rpc('guest_leave_lobby', {
      p_player_id: playerId,
      p_session_token: sessionToken,
    })
    if (error) {
      throw new Error(`Failed to leave lobby: ${error.message}`)
    }
    // Clean up stored session token
    if (SecureStore) await SecureStore.deleteItemAsync(`lobby_session_${playerId}`)
    return
  }

  // Authenticated path: direct operations via RLS
  const { data: player, error: fetchError } = await supabase
    .from('lobby_players')
    .select('is_host')
    .eq('id', playerId)
    .single()

  if (fetchError || !player) {
    throw new Error(
      `Failed to look up player: ${fetchError?.message ?? 'Player not found'}`,
    )
  }

  if (player.is_host) {
    const { error: deleteError } = await supabase
      .from('game_lobbies')
      .delete()
      .eq('id', lobbyId)

    if (deleteError) {
      throw new Error(`Failed to delete lobby: ${deleteError.message}`)
    }
  } else {
    const { error: deleteError } = await supabase
      .from('lobby_players')
      .delete()
      .eq('id', playerId)

    if (deleteError) {
      throw new Error(`Failed to remove player from lobby: ${deleteError.message}`)
    }
  }
}

/**
 * Fetches a single game lobby by its code (case-insensitive).
 * Returns null when no lobby matches.
 */
export async function getLobbyByCode(
  code: string,
): Promise<GameLobby | null> {
  const { data, error } = await supabase
    .from('game_lobbies')
    .select('*')
    .eq('code', code.toUpperCase())
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch lobby: ${error.message}`)
  }

  return (data as GameLobby) ?? null
}

/**
 * Fetches all players in a lobby, ordered by their player_index.
 */
export async function getLobbyPlayers(
  lobbyId: string,
): Promise<LobbyPlayer[]> {
  const { data, error } = await supabase
    .from('lobby_players')
    .select('*')
    .eq('lobby_id', lobbyId)
    .order('player_index', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch lobby players: ${error.message}`)
  }

  return (data as LobbyPlayer[]) ?? []
}

// ---------------------------------------------------------------------------
// Lobby mutations
// ---------------------------------------------------------------------------

/**
 * Updates the settings JSON for a lobby.
 */
export async function updateLobbySettings(
  lobbyId: string,
  settings: Record<string, unknown>,
): Promise<void> {
  const { error } = await supabase
    .from('game_lobbies')
    .update({ settings })
    .eq('id', lobbyId)

  if (error) {
    throw new Error(`Failed to update lobby settings: ${error.message}`)
  }
}

/**
 * Updates the status of a lobby (waiting, playing, finished).
 */
export async function updateLobbyStatus(
  lobbyId: string,
  status: LobbyStatus,
): Promise<void> {
  const { error } = await supabase
    .from('game_lobbies')
    .update({ status })
    .eq('id', lobbyId)

  if (error) {
    throw new Error(`Failed to update lobby status: ${error.message}`)
  }
}

/**
 * Updates the game_state JSON for a lobby.
 */
export async function updateLobbyGameState(
  lobbyId: string,
  gameState: Record<string, unknown>,
): Promise<void> {
  const { error } = await supabase
    .from('game_lobbies')
    .update({ game_state: gameState })
    .eq('id', lobbyId)

  if (error) {
    throw new Error(`Failed to update lobby game state: ${error.message}`)
  }
}

/**
 * Toggles the is_ready flag for a specific player.
 * Guest players (no auth session) use the RPC function with a session token.
 */
export async function togglePlayerReady(
  playerId: string,
  isReady: boolean,
): Promise<void> {
  // Check if this player has a stored session token (guest path — native only)
  const sessionToken = SecureStore ? await SecureStore.getItemAsync(`lobby_session_${playerId}`) : null

  if (sessionToken) {
    // Guest path: use RPC with session token verification
    const { error } = await supabase.rpc('guest_toggle_ready', {
      p_player_id: playerId,
      p_session_token: sessionToken,
      p_is_ready: isReady,
    })
    if (error) {
      throw new Error(`Failed to update player ready state: ${error.message}`)
    }
  } else {
    // Authenticated path: direct update via RLS
    const { error } = await supabase
      .from('lobby_players')
      .update({ is_ready: isReady })
      .eq('id', playerId)

    if (error) {
      throw new Error(`Failed to update player ready state: ${error.message}`)
    }
  }
}

// ---------------------------------------------------------------------------
// Realtime
// ---------------------------------------------------------------------------

/**
 * Creates (but does NOT subscribe to) a Supabase Realtime channel for a lobby,
 * configured with Broadcast and Presence capabilities.
 * The caller is responsible for calling `.subscribe()` on the returned channel.
 */
export function subscribeLobby(code: string): RealtimeChannel {
  const channel = supabase.channel(`lobby:${code}`, {
    config: {
      broadcast: { self: true },
      presence: { key: '' },
    },
  })

  return channel
}

/**
 * Sends a broadcast event on a Realtime channel.
 */
export async function broadcastEvent(
  channel: RealtimeChannel,
  event: string,
  payload: unknown,
): Promise<void> {
  await channel.send({
    type: 'broadcast',
    event,
    payload,
  })
}
