# Multiplayer Lobbies for Imposter, Wavelength & Draft With Friends

**Date:** 2026-03-23
**Status:** Approved

## Overview

Add online multiplayer to Imposter, Wavelength, and Draft With Friends via a shared lobby system. Players create or join lobbies using a 6-character code and play on their own devices in real-time. Local pass-and-play remains fully intact as the default mode.

## Decisions

- **Real-time sync** via Supabase Realtime (Broadcast + Presence channels)
- **6-char alphanumeric lobby codes** (manual entry, no deep links or QR)
- **Auth requirements:** Signed-in users can create lobbies. Guests can join but won't earn XP.
- **Local mode preserved:** Each game gets a `mode: 'local' | 'online'` toggle. Local mode is unchanged.

## Database

### `game_lobbies` table

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| code | text unique | 6-char, uppercase, no ambiguous chars (0/O/1/I/L) |
| game_type | text | 'imposter' / 'wavelength' / 'draft' |
| host_user_id | uuid references profiles | |
| status | text | 'waiting' / 'playing' / 'finished' |
| settings | jsonb | Game-specific config (league, rounds, difficulty, etc.) |
| game_state | jsonb | Full game state, broadcast to all players |
| created_at | timestamptz | |
| expires_at | timestamptz | Auto-expire after 2 hours |

### `lobby_players` table

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| lobby_id | uuid references game_lobbies | |
| user_id | uuid nullable | null for guests |
| display_name | text | |
| player_index | int | Position in player list |
| is_host | bool | |
| is_ready | bool | |
| joined_at | timestamptz | |

Unique constraint: `(lobby_id, player_index)`

### RLS Policies

- Anyone can read lobbies by code (needed to join)
- Only host can update lobby settings/status
- Players can insert/delete their own lobby_players row
- Anyone can read lobby_players for a lobby they're in

## Realtime Architecture

- **Channel name:** `lobby:{code}` (e.g., `lobby:BK7X9M`)
- **Presence:** Tracks connected players (join/leave detection)
- **Broadcast events:**
  - `player:ready` — player toggled ready state
  - `game:start` — host started the game
  - `game:state_update` — full game state sync
  - `game:action` — player action (guess, pick, etc.)
  - `game:reveal` — trigger reveal phase
  - `game:end` — game finished

## New Files

```
src/lib/multiplayer.ts              — Lobby CRUD, code generation, channel management
src/hooks/useLobby.ts               — React hook for lobby subscription
src/components/multiplayer/
  LobbyScreen.tsx                    — Shared lobby UI (code, player list, settings)
  JoinLobby.tsx                      — "Enter code" input screen
  ModeToggle.tsx                     — "Play Locally" / "Play Online" toggle
supabase/migrations/
  20260323_multiplayer_lobbies.sql   — Tables + RLS
```

## Modified Files

- `src/app/game/imposter.tsx` — Add mode toggle, online lobby flow, role broadcast
- `src/app/game/wavelength.tsx` — Add mode toggle, online clue/guess/reveal flow
- `src/app/game/draft-with-friends.tsx` — Add mode toggle, online turn-based draft flow

## Game-Specific Flows

### Imposter (Online)

1. Host creates lobby, configures league/difficulty/imposter count
2. Players join via code, appear in player list
3. Host taps "Start" → server picks athlete + imposter indices
4. Each device receives roles privately (detective sees athlete, imposter sees "IMPOSTER")
5. Discussion phase: shared timer, host controls reveal button
6. Reveal: all devices show results simultaneously

**Key change:** No pass-the-phone. Privacy is network-native.

### Wavelength (Online)

1. Host creates lobby, configures league/rounds/mode
2. Host taps "Start" → axes + targets generated, broadcast to all
3. Clue phase: only clue giver sees target, types clue, broadcasts it
4. Guess phase: all guessers see clue, drag needle, lock in simultaneously
5. Once all locked in → reveal with all positions + scoring bands

**Key change:** Guessing happens simultaneously on separate devices.

### Draft With Friends (Online)

1. Host creates lobby, configures league/rounds
2. Host taps "Start" → category + snake draft order broadcast
3. All devices show draft board. Only active drafter can pick.
4. Picks broadcast in real-time, all boards update live
5. Turn auto-advances via snake order

**Key change:** Everyone watches the board fill live. No phone passing.

## Disconnection Handling

- **Presence** auto-detects drops. Disconnected players show grayed out.
- **Host disconnect:** Game pauses with "Host disconnected" message. 60-second timeout before game ends.
- **Player disconnect:** Game continues. If it's their turn (Draft), 30-second auto-skip timer.
- **Lobby expiry:** 2 hours from creation.

## `multiplayer.ts` API

```typescript
createLobby(gameType: string, hostUserId: string): Promise<{ code: string; lobbyId: string }>
joinLobby(code: string, displayName: string, userId?: string): Promise<{ lobbyId: string; playerIndex: number }>
leaveLobby(lobbyId: string, playerId: string): Promise<void>
subscribeLobby(code: string): RealtimeChannel
broadcastAction(channel: RealtimeChannel, event: string, payload: unknown): void
generateLobbyCode(): string  // 6-char, collision-checked
```

## `useLobby` Hook

```typescript
interface UseLobbyReturn {
  channel: RealtimeChannel | null;
  players: LobbyPlayer[];
  isHost: boolean;
  myPlayerIndex: number;
  broadcast: (event: string, payload: unknown) => void;
  onEvent: (event: string, callback: (payload: unknown) => void) => () => void;
  leave: () => void;
}
```

## UI Components

### ModeToggle
Two-segment control at top of each game's setup screen: "Play Locally" (default) | "Play Online". Selecting online shows Create/Join options.

### LobbyScreen
- Large lobby code display (copyable)
- Player list with ready indicators (green dot)
- Host sees settings controls + "Start Game" button (enabled when ≥2 players, all ready)
- Non-hosts see settings as read-only + "Ready" toggle button

### JoinLobby
- 6-character code input (auto-uppercase, large monospace font)
- Display name input (pre-filled from profile if signed in)
- "Join" button
- Error states: invalid code, lobby full, game already started
