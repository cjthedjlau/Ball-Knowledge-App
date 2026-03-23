# Multiplayer Lobbies Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add online multiplayer to Imposter, Wavelength, and Draft With Friends via shared lobby system with Supabase Realtime, while keeping local pass-and-play intact.

**Architecture:** Supabase Realtime Channels (Broadcast + Presence) for real-time sync. Two new DB tables (`game_lobbies`, `lobby_players`) for lobby state. A shared `useLobby` hook and `multiplayer.ts` lib provide the networking layer. Each game file gets a `mode` toggle — `'local'` runs existing code unchanged, `'online'` swaps in lobby-based flows.

**Tech Stack:** Supabase Realtime (Broadcast, Presence), PostgreSQL (RLS), React Native, TypeScript

**Design doc:** `docs/plans/2026-03-23-multiplayer-lobbies-design.md`

---

## Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/20260323_multiplayer_lobbies.sql`

**Step 1: Write the migration**

```sql
-- ============================================================
-- Multiplayer lobby system for Imposter, Wavelength, Draft
-- ============================================================

create table public.game_lobbies (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  game_type text not null check (game_type in ('imposter', 'wavelength', 'draft')),
  host_user_id uuid references public.profiles not null,
  status text not null default 'waiting' check (status in ('waiting', 'playing', 'finished')),
  settings jsonb not null default '{}',
  game_state jsonb not null default '{}',
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '2 hours')
);

create table public.lobby_players (
  id uuid primary key default gen_random_uuid(),
  lobby_id uuid references public.game_lobbies on delete cascade not null,
  user_id uuid references auth.users,
  display_name text not null,
  player_index integer not null,
  is_host boolean not null default false,
  is_ready boolean not null default false,
  joined_at timestamptz not null default now(),
  unique(lobby_id, player_index)
);

create index idx_game_lobbies_code on public.game_lobbies(code);
create index idx_lobby_players_lobby on public.lobby_players(lobby_id);

-- RLS
alter table public.game_lobbies enable row level security;
alter table public.lobby_players enable row level security;

-- Anyone can read lobbies (needed to join by code)
create policy "Anyone can read lobbies"
  on public.game_lobbies for select
  using (true);

-- Signed-in users can create lobbies
create policy "Signed-in users can create lobbies"
  on public.game_lobbies for insert
  with check (auth.uid() = host_user_id);

-- Host can update their own lobbies
create policy "Host can update own lobby"
  on public.game_lobbies for update
  using (auth.uid() = host_user_id);

-- Host can delete their own lobbies
create policy "Host can delete own lobby"
  on public.game_lobbies for delete
  using (auth.uid() = host_user_id);

-- Anyone can read lobby players
create policy "Anyone can read lobby players"
  on public.lobby_players for select
  using (true);

-- Anyone can join a lobby (insert themselves)
create policy "Anyone can join lobby"
  on public.lobby_players for insert
  with check (true);

-- Players can update their own row (ready toggle)
create policy "Players can update own row"
  on public.lobby_players for update
  using (auth.uid() = user_id or user_id is null);

-- Players can leave (delete own row)
create policy "Players can leave lobby"
  on public.lobby_players for delete
  using (auth.uid() = user_id or user_id is null);
```

**Step 2: Commit**

```bash
git add supabase/migrations/20260323_multiplayer_lobbies.sql
git commit -m "feat: add game_lobbies and lobby_players tables with RLS"
```

---

## Task 2: Multiplayer Library (`multiplayer.ts`)

**Files:**
- Create: `src/lib/multiplayer.ts`

**Step 1: Write the library**

This file provides all lobby CRUD operations and Realtime channel management. Key functions:

- `generateLobbyCode()` — generates 6-char uppercase code excluding ambiguous chars (0, O, 1, I, L). Retries on collision.
- `createLobby(gameType, hostUserId, hostDisplayName)` — inserts `game_lobbies` row + `lobby_players` host row, returns `{ code, lobbyId }`.
- `joinLobby(code, displayName, userId?)` — looks up lobby by code, validates status is 'waiting', assigns next `player_index`, inserts `lobby_players` row.
- `leaveLobby(lobbyId, playerId)` — deletes `lobby_players` row. If host leaves, deletes entire lobby.
- `updateLobbySettings(lobbyId, settings)` — updates `game_lobbies.settings` jsonb.
- `updateLobbyStatus(lobbyId, status)` — updates status to 'playing' or 'finished'.
- `subscribeLobby(code)` — creates and returns a Supabase Realtime channel `lobby:{code}` with Broadcast and Presence enabled.
- `broadcastEvent(channel, event, payload)` — sends a broadcast message on the channel.

All functions use the existing `supabase` client from `src/lib/supabase.ts`.

**Types to export:**

```typescript
export type GameType = 'imposter' | 'wavelength' | 'draft';
export type LobbyStatus = 'waiting' | 'playing' | 'finished';

export interface GameLobby {
  id: string;
  code: string;
  game_type: GameType;
  host_user_id: string;
  status: LobbyStatus;
  settings: Record<string, unknown>;
  game_state: Record<string, unknown>;
}

export interface LobbyPlayer {
  id: string;
  lobby_id: string;
  user_id: string | null;
  display_name: string;
  player_index: number;
  is_host: boolean;
  is_ready: boolean;
}
```

**Step 2: Commit**

```bash
git add src/lib/multiplayer.ts
git commit -m "feat: add multiplayer.ts lobby CRUD and Realtime helpers"
```

---

## Task 3: `useLobby` Hook

**Files:**
- Create: `src/hooks/useLobby.ts`

**Step 1: Write the hook**

The hook manages the Realtime channel lifecycle for a lobby. It:

1. Subscribes to the `lobby:{code}` channel on mount
2. Tracks Presence (connected players) and exposes `players` array
3. Listens for Broadcast events and dispatches to registered callbacks
4. Provides `broadcast(event, payload)` for sending events
5. Cleans up channel subscription on unmount or when `code` changes

**Interface:**

```typescript
interface UseLobbyOptions {
  code: string | null;
  displayName: string;
  userId: string | null;
  playerIndex: number;
}

interface UseLobbyReturn {
  channel: RealtimeChannel | null;
  players: PresencePlayer[];
  isConnected: boolean;
  broadcast: (event: string, payload: unknown) => void;
  onEvent: (event: string, callback: (payload: unknown) => void) => () => void;
  leave: () => void;
}
```

**Presence payload shape:** Each player tracks `{ displayName, playerIndex, userId }` in their Presence state.

**Event listener pattern:** `onEvent` returns an unsubscribe function. Callbacks are stored in a ref-based map to avoid stale closures.

**Step 2: Commit**

```bash
git add src/hooks/useLobby.ts
git commit -m "feat: add useLobby hook for Realtime channel management"
```

---

## Task 4: Shared UI Components

**Files:**
- Create: `src/components/multiplayer/ModeToggle.tsx`
- Create: `src/components/multiplayer/JoinLobby.tsx`
- Create: `src/components/multiplayer/LobbyScreen.tsx`

### Step 1: ModeToggle

Two-segment toggle: "Play Locally" | "Play Online". Uses BK design tokens. Brand color on active segment, dark surface on inactive. Props: `mode`, `onModeChange`, `disabled`.

### Step 2: JoinLobby

Full-screen component with:
- 6-character code input (auto-uppercase, monospace Chillax-Bold, large 32pt, letter-spaced)
- Display name input (pre-filled from profile `display_name` if available)
- "JOIN GAME" button (brand color, disabled until code is 6 chars + name entered)
- Error text area (invalid code, lobby full, game started)
- Loading state while joining
- Back button

Props: `onJoin(lobbyId, playerIndex)`, `onBack()`.

### Step 3: LobbyScreen

Shared lobby waiting room:
- Large lobby code at top (copyable, tap-to-copy with "Copied!" toast)
- Game type badge (Imposter / Wavelength / Draft)
- Player list: each row shows player name, ready dot (green when ready), host crown icon
- Disconnected players show grayed out with "(disconnected)" label
- **Host view:** settings controls (game-specific, passed as `renderSettings` prop) + "START GAME" button (enabled when ≥2 players, all ready)
- **Player view:** settings shown as read-only + "READY" toggle button
- Player count: "X / Y players"

Props:
```typescript
interface LobbyScreenProps {
  lobby: GameLobby;
  players: LobbyPlayer[];
  presencePlayers: PresencePlayer[];
  isHost: boolean;
  isReady: boolean;
  onToggleReady: () => void;
  onStart: () => void;
  onLeave: () => void;
  onUpdateSettings: (settings: Record<string, unknown>) => void;
  renderSettings?: (settings: Record<string, unknown>, isHost: boolean) => React.ReactNode;
}
```

### Step 4: Commit

```bash
git add src/components/multiplayer/
git commit -m "feat: add ModeToggle, JoinLobby, and LobbyScreen components"
```

---

## Task 5: Imposter Online Mode

**Files:**
- Modify: `src/app/game/imposter.tsx`

### Step 1: Add mode state and toggle

Add `mode: 'local' | 'online'` state (default `'local'`). Add `lobbyCode`, `lobbyId`, `myPlayerIndex` state. Render `ModeToggle` at the top of the setup phase.

When `mode === 'local'`: all existing code runs unchanged.

When `mode === 'online'`:
- Setup phase shows: ModeToggle → "Create Game" / "Join Game" buttons
- "Create Game": calls `createLobby('imposter', userId, displayName)`, stores code, transitions to LobbyScreen
- "Join Game": renders JoinLobby component

### Step 2: Add lobby phase

New phase: `'lobby'`. Renders `LobbyScreen` with Imposter-specific settings (league, difficulty, imposter count). Host configures, broadcasts settings changes. useLobby hook manages presence.

### Step 3: Add online game flow

When host taps "Start":
1. Host picks athlete + imposter indices (same logic as local)
2. Host broadcasts `game:start` with `{ athlete, imposterIndices }` — BUT the athlete data is sent only to non-imposters. Imposters receive `{ role: 'imposter' }`.
   - **Implementation:** Host broadcasts `game:roles` with a map: `{ [playerIndex]: { role, athlete? } }`. Each device reads only their own entry.
3. All devices enter reveal phase — but instead of pass-the-phone, each device shows only that player's role card.
4. Discussion phase: shared timer synced via broadcast. Host controls "Reveal" button.
5. Host broadcasts `game:reveal` → all devices show results simultaneously.

### Step 4: XP saving

Each player saves their own XP locally after the game ends (same as current logic). Only signed-in users earn XP.

### Step 5: Commit

```bash
git add src/app/game/imposter.tsx
git commit -m "feat: add online multiplayer mode to Imposter"
```

---

## Task 6: Wavelength Online Mode

**Files:**
- Modify: `src/app/game/wavelength.tsx`

### Step 1: Add mode state and toggle

Same pattern as Imposter: `mode`, `lobbyCode`, `lobbyId`, `myPlayerIndex` state. ModeToggle in setup. Create/Join flow.

### Step 2: Add lobby phase

LobbyScreen with Wavelength settings (league, round count, mode casual/competitive).

### Step 3: Add online game flow

When host taps "Start":
1. Host generates all round data (axes + target positions) — same as local
2. Host broadcasts `game:config` with round data (targets included — each device needs them for local scoring)
3. **Clue phase:** Only the clue giver's device shows the target. Clue giver types clue → broadcasts `game:clue` with `{ clue, round }`. Other devices show "Waiting for [Name]'s clue..."
4. **Guess phase:** All guessers see axis + clue. Each drags needle, taps Lock In → broadcasts `game:guess` with `{ playerIndex, position }`. Other devices see "[Name] locked in" (no position revealed). Once all guesses received → auto-transition to reveal.
5. **Reveal phase:** Host broadcasts `game:reveal` with `{ allGuesses, targetPosition }`. All devices animate reveal simultaneously.
6. **Score update:** Each device calculates scores locally. Host broadcasts `game:scores` with updated running totals.
7. **Next round:** Host broadcasts `game:next_round`. Clue giver rotates.

### Step 4: Commit

```bash
git add src/app/game/wavelength.tsx
git commit -m "feat: add online multiplayer mode to Wavelength"
```

---

## Task 7: Draft With Friends Online Mode

**Files:**
- Modify: `src/app/game/draft-with-friends.tsx`

### Step 1: Add mode state and toggle

Same pattern: mode toggle, lobby code, Create/Join.

### Step 2: Add lobby phase

LobbyScreen with Draft settings (league, round count).

### Step 3: Add online game flow

When host taps "Start":
1. Host picks category + generates snake draft order — same as local
2. Host broadcasts `game:draft_start` with `{ category, draftOrder, leagueAthletes }`
3. All devices show the draft board. Only the active drafter's device enables the pick input.
4. **Active drafter picks:** broadcasts `game:pick` with `{ playerIndex, athleteName, round }`
5. All devices receive the pick and update their local board state.
6. Turn auto-advances. Non-active devices show "Waiting for [Name] to pick..." with pulse on their column.
7. **Turn timeout:** If active drafter doesn't pick within 30 seconds, host broadcasts `game:skip` and turn advances (the slot stays empty or auto-fills with "—").
8. After final pick → all devices transition to results phase.

### Step 4: Commit

```bash
git add src/app/game/draft-with-friends.tsx
git commit -m "feat: add online multiplayer mode to Draft With Friends"
```

---

## Task 8: Disconnection Handling

**Files:**
- Modify: `src/hooks/useLobby.ts`
- Modify: `src/components/multiplayer/LobbyScreen.tsx`

### Step 1: Presence-based disconnect detection

In `useLobby`, compare Presence state with `lobby_players` list. Players in DB but not in Presence are "disconnected". Expose `disconnectedPlayerIndices: number[]`.

### Step 2: Host disconnect handling

Add a `useEffect` in each game file's online mode: if the host drops from Presence, show a full-screen overlay "Host disconnected — waiting for reconnect..." with a 60-second countdown. If timer expires, game ends and all players return to the games menu.

### Step 3: Player disconnect during Draft turn

In Draft online mode: if the active drafter disconnects, start a 30-second countdown. If they don't reconnect and pick, auto-skip their turn.

### Step 4: Lobby screen disconnect UI

In `LobbyScreen`, disconnected players show with grayed-out text and "(disconnected)" label.

### Step 5: Commit

```bash
git add src/hooks/useLobby.ts src/components/multiplayer/LobbyScreen.tsx src/app/game/imposter.tsx src/app/game/wavelength.tsx src/app/game/draft-with-friends.tsx
git commit -m "feat: add disconnection handling for multiplayer lobbies"
```

---

## Task 9: Final Integration & Cleanup

**Files:**
- Modify: `src/app/components/Games.tsx` (add "Join Game" entry point)

### Step 1: Games Hub "Join Game" button

Add a "Join Game" button/card to the Games screen that opens the JoinLobby component. This provides a universal entry point for joining any game type via code, without needing to navigate to a specific game first.

### Step 2: Lobby cleanup

Add logic in `multiplayer.ts`: when creating a lobby, first delete any expired lobbies owned by the host (`expires_at < now()`). This prevents stale lobby accumulation.

### Step 3: Final commit

```bash
git add -A
git commit -m "feat: add Join Game to Games Hub, lobby cleanup"
```

---

## Execution Notes

- **No tests in this plan** — the project has no test infrastructure set up. Manual testing via the web app and Supabase dashboard.
- **Run the SQL migration** in Supabase SQL Editor before testing any lobby functionality.
- **Supabase Realtime must be enabled** in the Supabase dashboard (it is by default for new projects).
- **All colors use tokens** from `src/styles/theme.ts` — never raw hex.
- **All fonts use `fontFamily`** from theme — the project uses Chillax-Bold exclusively.
- **Local mode must remain 100% unchanged** — wrap all online logic in `if (mode === 'online')` guards.
