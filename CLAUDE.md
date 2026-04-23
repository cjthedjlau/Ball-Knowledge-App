# CLAUDE.md — Ball Knowledge App Development Notes

## Known Pitfalls (prevent recurring bugs)

### 1. Always commit new source files
Every file in `src/` that is imported by committed code MUST be committed.
Builds work locally (files on disk) but fail on Vercel/EAS (files not in repo).
Run `node scripts/health-check.js` before pushing.

### 2. Bottom padding — use useGameLayout hook
Every scrollable game screen needs `paddingBottom: insets.bottom + 120` to
clear the bottom nav bar. Use `useGameLayout()` from `src/hooks/useGameLayout.ts`
instead of hardcoding values. The nav bar is ~90pt (56pt + safe area).

### 3. Coral header must cover status bar
Game screens need a coral fill behind the status bar. Use the
`statusBarFillStyle` from `useGameLayout()` as an absolutely-positioned View.
Zone1 should have `paddingTop: topPadding` from the same hook.

### 4. Never use sed to remove JSX
When removing React components (like the notify button), NEVER use sed/regex.
It leaves orphaned closing tags (`</Text>` without opening `<Text>`) that
crash the web build with "Expected corresponding JSX closing tag" errors.
Always use the Edit tool to remove complete JSX blocks.

### 5. useCallback circular dependencies
When two useCallbacks reference each other (e.g., advanceToVoting ↔
advanceToReveal), use refs to break the cycle. Direct references capture
stale/undefined closures. Pattern:
```typescript
const fnRef = useRef<(...) => void>(() => {});
const fn = useCallback((...) => { ... fnRef.current(...) }, [deps]);
useEffect(() => { fnRef.current = fn; }, [fn]);
```

### 6. Timer callbacks and stale closures
Timer callbacks (setInterval, setTimeout) capture state values at creation
time. Always use refs for values that change during the timer's lifetime:
```typescript
const scoreRef = useRef(0);
useEffect(() => { scoreRef.current = score; }, [score]);
// In timer: use scoreRef.current, not score
```

### 7. Supabase presence heartbeat
Multiplayer games using `useLobby` must refresh presence every 25 seconds.
This is handled in `useLobby.ts` — do not remove the heartbeat interval.
Without it, players get silently dropped after ~60 seconds.

### 8. Ads must be disabled until configured
`ADS_ENABLED` in `src/lib/adConfig.ts` must be `false` until AdMob is
properly configured and the app is approved. Enabling it prematurely
crashes the app on TestFlight when the ad SDK fails to initialize.

### 9. Web vs Native builds
`app.config.js` filters native-only plugins (expo-secure-store, etc.)
when building for web. Never add native plugins directly to `app.json` —
always go through `app.config.js` which handles the filtering.

### 10. Player database
- `playerAttrs.ts` is the local fallback for the Guesser game
- Supabase `players_pool` is the primary source for all games
- Run `scripts/seed-from-attrs.ts` to sync local → Supabase
- NFL positions OT/OG/C/K/P are excluded from the Guesser pool
- No duplicate player names allowed (causes TS build failure)

### 11. Daily game content banks
- Trivia: `trivia_questions_bank` table — needs 600+ quality questions
- Power Play: `power_play_bank` table — needs 300+ survey questions
- Edge function uses 30-day dedup window for both
- Bad content (rules questions) must be purged from the DB, not the code

### 12. Anonymous sign-in
The `handle_new_user` trigger must generate unique usernames for anonymous
users: `'Player_' || substr(new.id::text, 1, 8)`. Using a static 'Player'
string violates the unique constraint.

## Scripts
- `node scripts/health-check.js` — pre-push validation
- `SUPABASE_SERVICE_ROLE_KEY=... npx ts-node scripts/seed-from-attrs.ts` — sync player data
- `npx eas build --platform ios --profile production` — iOS build
- `npx eas submit --platform ios --latest` — submit to TestFlight
- `vercel --prod` — force deploy to web
