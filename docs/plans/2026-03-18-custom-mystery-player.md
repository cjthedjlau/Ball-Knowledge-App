# Custom Mystery Player Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a multiplayer pass-and-play mystery player guessing game where one player sets a mystery player and another tries to guess them using attribute grid feedback.

**Architecture:** Single new file `src/app/game/custom-mystery-player.tsx` with 3 phases (setup → handoff → guessing). Attribute data and comparison logic copied from `player-guess.tsx`. Integrated into existing routing via `App.tsx` and `Games.tsx`.

**Tech Stack:** React Native, Expo, TypeScript, Lucide icons, existing BK UI components (PrimaryButton, GhostButton, GuessGridTile, LeagueSwitcher, RoundProgressDots, ParticleBurst)

---

### Task 1: Create the game file with types, data, and comparison logic

**Files:**
- Create: `src/app/game/custom-mystery-player.tsx`

**Step 1: Create the file with all types, attribute data, and comparison functions**

Copy the following from `src/app/game/player-guess.tsx` (lines 31-434):
- `TileState` type (line 31)
- `TileData` interface (lines 33-36)
- `League` type (line 44)
- `PLAYER_POOL` (lines 48-53)
- Attribute interfaces: `NBAAttrs`, `NFLAttrs`, `MLBAttrs`, `NHLAttrs`, `PlayerAttrs` (lines 57-61)
- All 4 attribute maps: `NBA_ATTRS`, `NFL_ATTRS`, `MLB_ATTRS`, `NHL_ATTRS` (lines 63-273)
- `getPlayerAttrs()` (lines 275-281)
- `LEAGUE_COLS` (lines 285-290)
- `parseHeightToInches()`, `formatHeight()` (lines 294-301)
- `CONTINENT_MAP`, `isSameContinent()` (lines 305-323)
- `MAX_GUESSES = 8` (line 327)
- `MysteryPlayer` interface (lines 329-343)
- `compareTile()` (lines 345-388)
- `evaluateGuessForLeague()` (lines 390-434)

Add a stub component export at the bottom:

```tsx
interface Props {
  onBack: () => void;
}

export default function CustomMysteryPlayer({ onBack }: Props) {
  return <View style={{ flex: 1 }}><Text>Custom Mystery Player</Text></View>;
}
```

Imports needed at top:

```tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Lock, UserSearch, Check } from 'lucide-react-native';
import { colors, darkColors, fontFamily, spacing } from '../../styles/theme';
import GuessGridTile from '../../screens/components/ui/GuessGridTile';
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';
import RoundProgressDots from '../../screens/components/ui/RoundProgressDots';
import PrimaryButton from '../../screens/components/ui/PrimaryButton';
import GhostButton from '../../screens/components/ui/GhostButton';
import ParticleBurst from '../../components/ParticleBurst';
```

**Step 2: Verify file compiles**

Run: `npx expo start --web` and confirm no import errors in console.

**Step 3: Commit**

```bash
git add src/app/game/custom-mystery-player.tsx
git commit -m "feat: scaffold custom-mystery-player with copied attribute data and comparison logic"
```

---

### Task 2: Build Phase 1 — Setter Setup Screen

**Files:**
- Modify: `src/app/game/custom-mystery-player.tsx`

**Step 1: Implement the full setup phase**

Replace the stub component with the 3-phase state machine. Phase 1 includes:

```tsx
type Phase = 'setup' | 'handoff' | 'guessing';

export default function CustomMysteryPlayer({ onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('setup');
  const [activeLeague, setActiveLeague] = useState<League>('NBA');
  const [selectedPlayer, setSelectedPlayer] = useState<MysteryPlayer | null>(null);
  const [searchText, setSearchText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  // Manual form fields
  const [manualName, setManualName] = useState('');
  const [manualTeam, setManualTeam] = useState('');
  const [manualPosition, setManualPosition] = useState('');
  const [manualAge, setManualAge] = useState('');
  const [manualJersey, setManualJersey] = useState('');
  const [manualHeight, setManualHeight] = useState('');
  const [manualConference, setManualConference] = useState('');
  const [manualCollege, setManualCollege] = useState('');
```

Phase 1 setup screen layout:
- Zone 1: brand header with "Custom Mystery" title, subtitle "Set your player", back arrow calling `onBack`
- Zone 2 (#0F0F0F):
  - `LeagueSwitcher` — onChange resets selection and clears search
  - `TextInput` — placeholder "Search for a player...", min 2 chars triggers filter
  - Autocomplete dropdown — filters `PLAYER_POOL[activeLeague]` case-insensitive substring, max 6 results
  - Tapping suggestion: look up attrs via `getPlayerAttrs(name, league)`, build `MysteryPlayer` object, set `selectedPlayer`
  - Selected player confirmation card: 3D raised effect (same card styling from other game screens — `darkColors.surfaceElevated` bg, top highlight border, bottom shadow border, 16pt radius), shows checkmark in `colors.accentGreen`, player name in `colors.brand` (Chillax-Bold 22px), team in `darkColors.textSecondary`
  - `PrimaryButton` "Hand to Guesser" — `disabled={!selectedPlayer}`, `onPress={() => setPhase('handoff')}`
  - `GhostButton` "Change Player" — resets `selectedPlayer` to null, clears search
  - "Can't find your player? Enter manually" link in `colors.accentCyan` — toggles `showManualForm`
  - Manual form (when visible): 8 `TextInput` fields for name, team, position, age, jersey, height, conference, college. "Set This Player" PrimaryButton builds a `MysteryPlayer` from the form values.

Key behavior:
- League switch resets: `setSelectedPlayer(null)`, `setSearchText('')`, `setShowManualForm(false)`
- Search filter: `PLAYER_POOL[activeLeague].filter(n => n.toLowerCase().includes(searchText.toLowerCase())).slice(0, 6)`

**Step 2: Verify setup screen renders**

Run the app, navigate to Games, tap Custom Mystery card (not wired yet — test by temporarily setting `phase` initial state or importing directly).

**Step 3: Commit**

```bash
git add src/app/game/custom-mystery-player.tsx
git commit -m "feat: implement Phase 1 setter setup screen with search, autocomplete, and manual entry"
```

---

### Task 3: Build Phase 2 — Handoff Screen

**Files:**
- Modify: `src/app/game/custom-mystery-player.tsx`

**Step 1: Implement the handoff phase**

When `phase === 'handoff'`, render:

```tsx
<SafeAreaView style={styles.root} edges={['top']}>
  <View style={styles.handoffContainer}>
    <Lock color={colors.brand} size={64} strokeWidth={1.5} />
    <Text style={styles.handoffTitle}>Hand the phone to the guesser</Text>
    <Text style={styles.handoffSubtitle}>Don't show them the screen!</Text>
    <View style={styles.handoffButtonWrap}>
      <PrimaryButton label="I'm Ready to Guess" onPress={() => setPhase('guessing')} />
    </View>
  </View>
</SafeAreaView>
```

Styles:
- `handoffContainer`: flex 1, `backgroundColor: darkColors.background`, alignItems center, justifyContent center, paddingHorizontal 32
- `handoffTitle`: Chillax-Bold, 24px, `colors.white`, centered, marginTop 24
- `handoffSubtitle`: Chillax-Bold, 14px, `darkColors.textSecondary`, centered, marginTop 8
- `handoffButtonWrap`: width 100%, marginTop 48

No back button on this screen.

**Step 2: Verify handoff screen**

Set initial phase to 'handoff' temporarily, confirm layout.

**Step 3: Commit**

```bash
git add src/app/game/custom-mystery-player.tsx
git commit -m "feat: implement Phase 2 handoff screen"
```

---

### Task 4: Build Phase 3 — Guessing Screen

**Files:**
- Modify: `src/app/game/custom-mystery-player.tsx`

**Step 1: Implement the guessing phase**

Add guessing state variables (only initialized when entering Phase 3):

```tsx
const [guesses, setGuesses] = useState<TileData[][]>([]);
const [guessedNames, setGuessedNames] = useState<Set<string>>(new Set());
const [guessSearchText, setGuessSearchText] = useState('');
const [guessShowDropdown, setGuessShowDropdown] = useState(false);
const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
```

The guessing screen mirrors `player-guess.tsx` (lines 438-850) with these differences:
- Mystery player comes from `selectedPlayer` state (not Supabase)
- Header shows "Custom Mystery" with back arrow that triggers `Alert.alert('End game?', 'The mystery player will be revealed.', [cancel, confirm → onBack])`
- `RoundProgressDots` with `total={8}` and `current={guesses.length + 1}`
- No XP display, no AsyncStorage, no Supabase writes
- Search/autocomplete uses `PLAYER_POOL[activeLeague]` filtered the same way as `player-guess.tsx`

Submit guess logic (same pattern as player-guess.tsx lines 538-600):

```tsx
function submitGuess(name: string) {
  if (!selectedPlayer || gameState !== 'playing') return;
  const attrs = getPlayerAttrs(name, activeLeague);
  if (!attrs) return;

  const row = evaluateGuessForLeague(attrs, name, selectedPlayer, activeLeague);
  const newGuesses = [...guesses, row];
  setGuesses(newGuesses);
  setGuessedNames(prev => new Set(prev).add(name));
  setGuessSearchText('');
  setGuessShowDropdown(false);

  const won = row.every(t => t.state === 'correct');
  const lost = !won && newGuesses.length >= MAX_GUESSES;
  if (won) setGameState('won');
  else if (lost) setGameState('lost');
}
```

Layout for guessing phase:
- Zone 1: brand header — back arrow, "Custom Mystery" title, `RoundProgressDots`
- Zone 2: ScrollView with:
  - Column headers row (from `LEAGUE_COLS[activeLeague]`)
  - Guess rows rendered with `GuessGridTile` (same grid layout as player-guess.tsx)
  - Win/loss banner when `gameState !== 'playing'`
- Bottom: search input + autocomplete dropdown (hidden when game over)

**Step 2: Implement win/loss result cards**

Win state (wrap in `ParticleBurst`):
```
'Got it in X/8 guesses!' — Chillax-Bold, 28px, white
Mystery player name — Chillax-Bold, 22px, colors.brand
PrimaryButton 'Play Again' → resetGame()
GhostButton 'Back to Games' → onBack()
```

Loss state:
```
'Not quite!' — Chillax-Bold, 28px, white
'The player was:' — Chillax-Bold, 14px, darkColors.textSecondary
Mystery player name — Chillax-Bold, 28px, colors.brand
PrimaryButton 'Play Again' → resetGame()
GhostButton 'Back to Games' → onBack()
```

`resetGame()` function:
```tsx
function resetGame() {
  setPhase('setup');
  setSelectedPlayer(null);
  setSearchText('');
  setGuesses([]);
  setGuessedNames(new Set());
  setGuessSearchText('');
  setGameState('playing');
  setShowManualForm(false);
}
```

**Step 3: Verify full game flow**

Play through: select player → handoff → guess correctly → Play Again. Then: select player → handoff → guess 8 wrong → loss screen.

**Step 4: Commit**

```bash
git add src/app/game/custom-mystery-player.tsx
git commit -m "feat: implement Phase 3 guessing screen with win/loss states"
```

---

### Task 5: Add styles

**Files:**
- Modify: `src/app/game/custom-mystery-player.tsx`

**Step 1: Add complete StyleSheet**

All styles should follow the existing pattern from `player-guess.tsx`. Key styles:

```tsx
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },

  // Zone 1
  zone1: {
    backgroundColor: colors.brand,
    paddingTop: spacing.lg,
    paddingBottom: spacing['2xl'],
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  backBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.30)', alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fontFamily.black, fontWeight: '900', fontSize: 28, color: colors.white, flex: 1 },
  subtitle: { fontFamily: fontFamily.medium, fontSize: 14, color: 'rgba(255,255,255,0.70)', marginBottom: spacing.sm },

  // Zone 2
  zone2: { flex: 1, backgroundColor: 'transparent' },
  zone2Content: { paddingHorizontal: spacing.lg, paddingTop: spacing['2xl'], paddingBottom: 120 },

  // Search
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: darkColors.surfaceElevated, borderRadius: 12, paddingHorizontal: spacing.md, height: 48, borderWidth: 1, borderColor: darkColors.border, marginBottom: spacing.sm },
  searchInput: { flex: 1, fontFamily: fontFamily.medium, fontSize: 15, color: colors.white, marginLeft: spacing.sm },
  dropdown: { backgroundColor: darkColors.surfaceElevated, borderRadius: 12, borderWidth: 1, borderColor: darkColors.border, marginBottom: spacing.lg, overflow: 'hidden' },
  dropdownItem: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: darkColors.border },
  dropdownName: { fontFamily: fontFamily.bold, fontWeight: '700', fontSize: 15, color: colors.white },
  dropdownTeam: { fontFamily: fontFamily.medium, fontSize: 12, color: darkColors.textSecondary, marginTop: 2 },

  // Confirmation card
  confirmCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing['2xl'],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    gap: spacing.sm,
  },
  confirmLabel: { fontFamily: fontFamily.bold, fontWeight: '700', fontSize: 14, color: colors.accentGreen },
  confirmName: { fontFamily: fontFamily.black, fontWeight: '900', fontSize: 22, color: colors.brand },
  confirmTeam: { fontFamily: fontFamily.medium, fontSize: 14, color: darkColors.textSecondary },

  // Manual form
  manualLink: { fontFamily: fontFamily.bold, fontWeight: '700', fontSize: 14, color: colors.accentCyan, textAlign: 'center', marginTop: spacing.lg },
  manualForm: { gap: spacing.md, marginTop: spacing.lg },
  formInput: { backgroundColor: darkColors.surfaceElevated, borderRadius: 12, paddingHorizontal: spacing.lg, height: 48, borderWidth: 1, borderColor: darkColors.border, fontFamily: fontFamily.medium, fontSize: 15, color: colors.white },

  // Handoff
  handoffContainer: { flex: 1, backgroundColor: darkColors.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  handoffTitle: { fontFamily: fontFamily.black, fontWeight: '900', fontSize: 24, color: colors.white, textAlign: 'center', marginTop: spacing['2xl'] },
  handoffSubtitle: { fontFamily: fontFamily.medium, fontSize: 14, color: darkColors.textSecondary, textAlign: 'center', marginTop: spacing.sm },
  handoffButtonWrap: { width: '100%', marginTop: spacing['5xl'] },

  // Guess grid
  colHeaders: { flexDirection: 'row', gap: 4, marginBottom: spacing.sm, paddingHorizontal: 2 },
  colHeader: { fontFamily: fontFamily.bold, fontWeight: '700', fontSize: 9, color: darkColors.textSecondary, textAlign: 'center', letterSpacing: 1 },
  guessRow: { flexDirection: 'row', gap: 4, marginBottom: spacing.sm },

  // Result card
  resultCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    padding: spacing['2xl'],
    marginTop: spacing['2xl'],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    gap: spacing.md,
  },
  resultTitle: { fontFamily: fontFamily.black, fontWeight: '900', fontSize: 28, color: colors.white, textAlign: 'center' },
  resultSubtitle: { fontFamily: fontFamily.medium, fontSize: 14, color: darkColors.textSecondary },
  resultName: { fontFamily: fontFamily.black, fontWeight: '900', fontSize: 22, color: colors.brand },
  buttonGap: { gap: spacing.md, width: '100%', marginTop: spacing.md },
});
```

**Step 2: Commit**

```bash
git add src/app/game/custom-mystery-player.tsx
git commit -m "feat: add complete styles for custom-mystery-player"
```

---

### Task 6: Wire into Games.tsx and App.tsx

**Files:**
- Modify: `App.tsx` (lines 25, 48-58)
- Modify: `src/app/components/Games.tsx` (lines 10, 64-102)

**Step 1: Add to App.tsx**

Add import at line 25 (after ThirteenWordsScreen import):
```tsx
import CustomMysteryPlayerScreen from './src/app/game/custom-mystery-player';
```

Add to `GAME_SCREENS` record (after `'13-words'` entry at line 57):
```tsx
'custom-mystery-player': CustomMysteryPlayerScreen,
```

**Step 2: Add GameCard to Games.tsx**

Add `UserSearch` to the Lucide import (line 10, add to the existing import block):
```tsx
import { Search, ListOrdered, Swords, Brain, Radio, HelpCircle, Users, EyeOff, MessageSquare, Archive, UserSearch } from 'lucide-react-native';
```

Add a new GameCard in the multiplayer section. Insert after the "13 Words or Less" centered card (after line 113), before the Daily Games section:

```tsx
<View style={styles.cardGridItem}>
  <GameCard
    title="Custom Mystery"
    subtitle="Challenge Friends"
    icon={<UserSearch size={24} color={colors.brand} strokeWidth={2} />}
    onPress={() => onGoToGame('custom-mystery-player')}
    status="multiplayer"
  />
</View>
```

Move the "13 Words or Less" card back into the 2x2 grid (out of `cardGridCentered`) and add Custom Mystery as the 6th card — making a 3-row grid of 2. OR keep the current layout and add Custom Mystery into the centered row alongside 13 Words. The simplest approach: add Custom Mystery as a 6th card in the main `cardGrid`, so it becomes a 3×2 grid naturally. Move 13 Words back into `cardGrid` too.

Replace the multiplayer section (lines 64-113) with:
```tsx
<Text style={styles.sectionLabel}>── MULTIPLAYER ──</Text>
<View style={styles.cardGrid}>
  <View style={styles.cardGridItem}>
    <GameCard title="Wavelength" subtitle="Party Mode" icon={<Radio size={24} color={colors.brand} strokeWidth={2} />} onPress={() => onGoToGame('wavelength')} status="multiplayer" />
  </View>
  <View style={styles.cardGridItem}>
    <GameCard title="Who Am I" subtitle="Social Play" icon={<HelpCircle size={24} color={colors.brand} strokeWidth={2} />} onPress={() => onGoToGame('who-am-i')} status="multiplayer" />
  </View>
  <View style={styles.cardGridItem}>
    <GameCard title="Draft With Friends" subtitle="Competitive" icon={<Users size={24} color={colors.brand} strokeWidth={2} />} onPress={() => onGoToGame('draft-with-friends')} status="multiplayer" />
  </View>
  <View style={styles.cardGridItem}>
    <GameCard title="Imposter" subtitle="Deception" icon={<EyeOff size={24} color={colors.brand} strokeWidth={2} />} onPress={() => onGoToGame('imposter')} status="multiplayer" />
  </View>
  <View style={styles.cardGridItem}>
    <GameCard title="13 Words or Less" subtitle="Quick Play" icon={<MessageSquare size={24} color={colors.brand} strokeWidth={2} />} onPress={() => onGoToGame('13-words')} status="multiplayer" />
  </View>
  <View style={styles.cardGridItem}>
    <GameCard title="Custom Mystery" subtitle="Challenge Friends" icon={<UserSearch size={24} color={colors.brand} strokeWidth={2} />} onPress={() => onGoToGame('custom-mystery-player')} status="multiplayer" />
  </View>
</View>
```

Also update the stat strip count from "5 Available" to "6 Available" (line 50).

**Step 3: Verify end-to-end flow**

Run app → Games tab → tap Custom Mystery → setup screen → select player → handoff → guess → win/loss → Play Again / Back to Games.

**Step 4: Commit**

```bash
git add App.tsx src/app/components/Games.tsx
git commit -m "feat: wire custom-mystery-player into Games hub and App routing"
```

---

### Task 7: Final review and cleanup

**Files:**
- Review: `src/app/game/custom-mystery-player.tsx`
- Review: `App.tsx`
- Review: `src/app/components/Games.tsx`

**Step 1: Verify checklist**

- [ ] No hardcoded hex values in component file — all from theme tokens
- [ ] All text uses Chillax-Bold (via `fontFamily.bold`/`fontFamily.black`/`fontFamily.medium`)
- [ ] Uses `Pressable` not `TouchableOpacity`
- [ ] No XP, no streak, no Supabase writes
- [ ] No AsyncStorage persistence
- [ ] Two-zone layout on setup and guessing screens
- [ ] 3D raised card effect on confirmation card and result card
- [ ] ParticleBurst wraps win result
- [ ] Back arrow on guessing screen shows confirm alert
- [ ] Manual entry form builds valid MysteryPlayer object
- [ ] Game resets cleanly on "Play Again"

**Step 2: Commit final state**

```bash
git add -A
git commit -m "feat: complete custom-mystery-player multiplayer game"
```
