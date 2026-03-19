# Draft With Friends Redesign — 2026-03-13

## Summary

Four targeted changes to `src/app/game/draft-with-friends.tsx`.

## Changes

### 1. Remove Voting
- Delete `phase: 'voting'`, `VoteRecord` type, all vote state and handlers.
- After final draft pick, transition directly to `phase: 'results'`.
- Results phase shows draft board summary only — no winner, no vote counts.

### 2. League Selection
- Add `selectedLeague` state (default `'NBA'`).
- Add `LeagueSwitcher` to Zone 1 on setup screen.
- Create per-league mock data: category string + athletes array for NFL, NBA, MLB, NHL.
- League selection updates the displayed category and athlete pool.

### 3. Round Number Selection
- Replace hardcoded `ROUNDS = 3` with `rounds` state (default `3`).
- Add pill buttons for 3 / 4 / 5 in setup Zone 2 under a "ROUNDS" section header.
- Subtitle updates dynamically.

### 4. Bigger Board Boxes
- `boardColumn` width: 120 → 150
- `boardCell` minHeight: 40 → 68
- `boardCellName` fontSize: 11 → 13
- `boardCellRound` fontSize: 9 → 11
