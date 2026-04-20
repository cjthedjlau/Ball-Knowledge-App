# Game Preview Animations Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add animated game previews to every GameCard — on hover (web) or first tap (mobile), the card scales to 1.1x, shifts neighbors, and replaces its content with a 3-5 second looping animation showing what the game looks like to play.

**Architecture:** A `GameCardWithPreview` wrapper component manages hover/tap state and swaps between normal GameCard content and a game-specific preview component. 12 preview components (one per game, skip "Join Game") each use React Native's Animated API for looping sequences. The wrapper uses `Animated.spring` for scale and `LayoutAnimation` for neighbor shifting.

**Tech Stack:** React Native Animated API, LayoutAnimation, Platform.select for web hover detection. No new dependencies.

---

### Task 1: Create GameCardWithPreview wrapper

**Files:**
- Create: `src/screens/components/ui/GameCardWithPreview.tsx`

This component wraps the existing GameCard. It:
- Accepts all GameCard props plus `previewComponent: React.ComponentType`
- Manages `isPreviewing` state
- On web: `onHoverIn` → start preview, `onHoverOut` → stop
- On mobile: first press → start preview, second press → call `onPress`. Tap outside or 5s timeout → stop preview.
- When previewing: scales to 1.1x via `Animated.spring`, sets `zIndex: 10`, replaces card inner content with the preview component
- When not previewing: normal GameCard render
- Uses `LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)` before state changes so neighbors animate

Key implementation details:
- `Animated.Value` for scale (1.0 → 1.1)
- `useRef` for tap count and timeout tracking
- `Platform.OS === 'web'` check for hover events
- Preview component receives `{ isDark: boolean, width: number, height: number }` props so it can size itself
- `onLayout` to measure card dimensions for the preview

---

### Task 2: Create 6 Daily Game Preview Components

**Files:**
- Create: `src/screens/components/ui/previews/MysteryPlayerPreview.tsx`
- Create: `src/screens/components/ui/previews/BlindRank5Preview.tsx`
- Create: `src/screens/components/ui/previews/ShowdownPreview.tsx`
- Create: `src/screens/components/ui/previews/TriviaPreview.tsx`
- Create: `src/screens/components/ui/previews/PowerPlayPreview.tsx`
- Create: `src/screens/components/ui/previews/AutoCompletePreview.tsx`

Each preview:
- Receives `{ isDark: boolean }` props
- Runs a 3-5 second `Animated.loop` sequence on mount
- Cleans up animation on unmount
- Uses `useNativeDriver: true` for all transform/opacity animations
- All colors from theme tokens

**Preview specs:**

**MysteryPlayerPreview:** Miniature guess grid (3 rows of 6 tiles). Tiles start as `dark.card`/`light.card`. Row 1 tiles flip to gray/yellow/gray/green/gray/yellow in sequence (200ms stagger). Row 2 tiles flip similarly. Row 3: all flip green (solved). 500ms pause, reset, loop.

**BlindRank5Preview:** 5 horizontal slot boxes labeled 1-5. A mini player card slides in from the right and drops into slot 3. Then another slides to slot 1. Then slot 5. Cards use `brand.primary` border on placement. 500ms pause, reset, loop.

**ShowdownPreview:** Two side-by-side silhouette boxes (dark rectangles with "?" in center). A "VS" label between them. After 1.5s, both simultaneously fade-reveal to show colored rectangles (one `brand.primary`, one `brand.teal`) representing the reveal. Flash the winner. Reset, loop.

**TriviaPreview:** A question bar at top (small rectangle with wavy line). Below: 4 answer option rectangles stacked. After 1s, option 2 highlights `brand.primary` (selected). After 0.5s, option 3 flashes green (correct), option 2 flashes red. Score "+1" animates up. Reset, loop.

**PowerPlayPreview:** A mini "board" with 5 horizontal answer bars. Bars flip one at a time (0.3s each) from `dark.card` to `brand.teal` (revealed). A score counter at top-right increments with each flip: 0→25→50→75→100→125. "TARGET HIT" flashes at end. Reset, loop.

**AutoCompletePreview:** A search bar at top with cursor blinking. Text types out letter by letter ("Best NBA..."). Below: 3 result rows slide in one at a time. Each shows a mini progress bar filling to different widths. Reset, loop.

---

### Task 3: Create 6 Multiplayer Game Preview Components

**Files:**
- Create: `src/screens/components/ui/previews/WavelengthPreview.tsx`
- Create: `src/screens/components/ui/previews/ImposterPreview.tsx`
- Create: `src/screens/components/ui/previews/DraftPreview.tsx`
- Create: `src/screens/components/ui/previews/WhoAmIPreview.tsx`
- Create: `src/screens/components/ui/previews/ThirteenWordsPreview.tsx`
- Create: `src/screens/components/ui/previews/CustomMysteryPreview.tsx`

**Preview specs:**

**WavelengthPreview:** A semicircle arc (half-circle border) at top. A needle (thin line) sweeps from left to center. After 1.5s, a target zone highlights in `brand.primary` near the needle position. Score "+3" pops up. Reset, loop.

**ImposterPreview:** A card face-down (dark rectangle with "?" pattern). Card flips (opacity crossfade) to show "CREWMATE" in green text. 1s pause. Flips back. Flips again to show "IMPOSTOR" in `brand.primary`. 1s pause. Reset, loop.

**DraftPreview:** A 3-column × 3-row mini grid (draft board). Cells fill one at a time in snake order: col1-row1, col2-row1, col3-row1, col3-row2, col2-row2, col1-row2, col1-row3... Each cell gets a colored rectangle with fade-in. Column headers in `brand.primary`, `brand.teal`, `brand.light`. Reset, loop.

**WhoAmIPreview:** Large "?" in center. Below: two buttons "YES" / "NO". The "?" pulses. After 1s, "YES" button highlights green. After 0.5s, "NO" highlights red. After 0.5s, the "?" crossfades to a small rectangle (representing the reveal). Reset, loop.

**ThirteenWordsPreview:** A counter "13" at top in `brand.primary`. Below: text lines appear one at a time ("word word word...") as the counter decrements: 13→10→7→4→1. Text wraps naturally. When counter hits 1, it flashes `brand.primary`. Reset, loop.

**CustomMysteryPreview:** A 6-character code ("ABCDEF") types out in the center, letter by letter, in `fonts.display`. Below: a "Share" button fades in. The code pulses once. A "copied!" label fades in briefly. Reset, loop.

---

### Task 4: Integrate GameCardWithPreview into Home Screen

**Files:**
- Modify: `src/screens/components/Home.tsx`

Replace each `<GameCard>` in the daily games grid with `<GameCardWithPreview>`, passing the corresponding preview component. The multiplayer "Play with Friends" button is NOT a GameCard, so skip it.

Map:
- "Mystery Player" → MysteryPlayerPreview
- "Blind Rank 5" → BlindRank5Preview
- "Showdown" → ShowdownPreview
- "Trivia Game" → TriviaPreview
- "Power Play" → PowerPlayPreview
- "Auto Complete" → AutoCompletePreview

Import all preview components and GameCardWithPreview at the top. Keep ALL existing props, onPress handlers, status, subtitle, icon, isNew, onArchivePress identical.

---

### Task 5: Integrate GameCardWithPreview into Games Hub

**Files:**
- Modify: `src/app/components/Games.tsx`

Replace each `<GameCard>` (except "Join Game") with `<GameCardWithPreview>`, passing the corresponding preview component.

Map (multiplayer section):
- "Wavelength" → WavelengthPreview
- "Who Am I" → WhoAmIPreview
- "Draft With Friends" → DraftPreview
- "Imposter" → ImposterPreview
- "13 Words or Less" → ThirteenWordsPreview
- "Custom Mystery" → CustomMysteryPreview

Map (daily section — same as Home):
- "Mystery Player" → MysteryPlayerPreview
- "Blind Rank 5" → BlindRank5Preview
- "Showdown" → ShowdownPreview
- "Trivia Game" → TriviaPreview
- "Power Play" → PowerPlayPreview
- "Auto Complete" → AutoCompletePreview

"Join Game" card stays as regular GameCard with no preview.

---

### Task 6: Build Verification

**Step 1:** Verify build
```bash
cd "C:\Users\laucj\Downloads\New folder\Ball Knowledge App" && npx expo export --platform web --output-dir /tmp/bk-preview-test 2>&1 | tail -10
```

**Step 2:** Verify no hardcoded hex colors in new files
```bash
grep -rn "'#" src/screens/components/ui/previews/ src/screens/components/ui/GameCardWithPreview.tsx | grep -v "theme\|import"
```

**Step 3:** Manual test
- Open localhost, hover over game cards on web
- Verify each preview animation plays and loops
- Verify card scales to 1.1x and neighbors shift
- Verify clicking still opens the game
