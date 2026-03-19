# Custom Mystery Player — Design Doc

## Overview

A multiplayer pass-and-play version of the Daily Mystery Player game. One player (the setter) picks a mystery player, hands the phone to a friend (the guesser), and the guesser tries to identify them using the same attribute grid logic as the daily game.

## Architecture

Single file: `src/app/game/custom-mystery-player.tsx`
Route ID: `'custom-mystery-player'`
Props: `onBack: () => void`

Three phases managed by `phase: 'setup' | 'handoff' | 'guessing'` state.

## Phase 1 — Setter Setup

- Two-zone layout: Zone 1 brand header ("Custom Mystery" + back arrow), Zone 2 dark content
- `LeagueSwitcher` defaults to NBA, onChange resets selection
- Search input filters `getRandomPlayers(league, 60)` by case-insensitive name substring (min 2 chars, max 6 results)
- Tapping a suggestion locks the mystery player — shows confirmation card with name, team, checkmark
- Manual entry fallback: "Can't find your player? Enter manually" link in accentCyan opens inline form with 8 fields (name, team, position, age, jersey, height, conference/division, college/country)
- `PrimaryButton` "Hand to Guesser" — disabled until player selected, transitions to Phase 2
- `GhostButton` "Change Player" — resets selection

## Phase 2 — Handoff

- Full dark overlay (#0F0F0F)
- Lock icon (Lucide Lock, 64px, brand color), centered title + subtitle
- No back button — guesser cannot see the mystery player
- `PrimaryButton` "I'm Ready to Guess" — transitions to Phase 3

## Phase 3 — Guessing

- Identical attribute grid logic copied from `player-guess.tsx`:
  - `compareTile()` function with green/yellow/gray/arrow states
  - `evaluateGuessForLeague()` per-league evaluation
  - `NBA_ATTRS`, `NFL_ATTRS`, `MLB_ATTRS`, `NHL_ATTRS` hardcoded maps
  - `LEAGUE_COLS` per-league column definitions
- Same `GuessGridTile` component for tile rendering
- 8 max guesses with `RoundProgressDots` (8 dots)
- Autocomplete from `getRandomPlayers(league, 60)`, same pool as setter
- Back arrow triggers confirm alert before abandoning game
- No XP, no streak, no AsyncStorage, no Supabase writes

### Win State
- `ParticleBurst` wrapper fires on correct guess
- Result card: "Got it in X/8 guesses!", mystery player name in brand color
- `PrimaryButton` "Play Again" resets to Phase 1
- `GhostButton` "Back to Games" calls `onBack`

### Loss State
- Result card: "Not quite!", reveals mystery player name in brand color
- Same two buttons as win state

## Integration Points

1. **Games.tsx**: Add `GameCard` in multiplayer section with `UserSearch` icon, title "Custom Mystery", subtitle "Set a player, challenge your friends"
2. **App.tsx**: Add `'custom-mystery-player'` to `GAME_SCREENS` map, import the component

## Decision: Attribute Data Strategy

Copying attribute maps directly from `player-guess.tsx` rather than extracting to a shared module. Rationale: avoids touching the working daily game, ships faster, manual entry fallback covers players not in the pool. Can refactor to shared module later.

## Not Included (YAGNI)

- No sharing/share cards
- No score tracking or history
- No difficulty settings
- No timer
