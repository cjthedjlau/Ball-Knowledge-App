# Visual Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Apply a new design system (Bebas Neue + Space Grotesk, warm light/dark tokens, pill buttons, 12px card radius) across every screen and component in the Ball Knowledge app. Zero logic changes.

**Architecture:** Replace all tokens in `src/styles/theme.ts`, install two Google Fonts packages, then sweep every component and screen file to use the new tokens. The existing `useTheme()` hook and `ThemeProvider` context stay unchanged — components already consume `isDark` and switch colors.

**Tech Stack:** `@expo-google-fonts/bebas-neue`, `@expo-google-fonts/space-grotesk`, existing React Native StyleSheet system.

---

## Task 1: Install Fonts

**Files:**
- Modify: `package.json`

**Step 1:** Install font packages

```bash
cd "C:\Users\laucj\Downloads\New folder\Ball Knowledge App"
npx expo install @expo-google-fonts/bebas-neue @expo-google-fonts/space-grotesk expo-font
```

If peer dep conflicts: `npm install @expo-google-fonts/bebas-neue @expo-google-fonts/space-grotesk --legacy-peer-deps`

**Step 2:** Verify packages installed

```bash
ls node_modules/@expo-google-fonts/bebas-neue/index.js && ls node_modules/@expo-google-fonts/space-grotesk/index.js
```

---

## Task 2: Rewrite theme.ts

**Files:**
- Modify: `src/styles/theme.ts` (full rewrite)

Replace the entire file with the new token system. Key changes:
- `brand` object with primary/light/dark/teal/gradient
- `dark` and `light` theme objects
- `fonts` object mapping to Bebas Neue + Space Grotesk
- `fontSizes` presets
- Keep existing `spacing`, `radius`, `layout` exports (update radius values to match spec: primary=12, chip=20, pill=28)
- Export backward-compatible `colors` and `darkColors` aliases that map to the new tokens so existing imports don't break during migration

The full token values are defined in the user's spec (see STEP 2 of the objective). All values must be copied exactly.

**Backward compatibility strategy:** Keep `export const colors = { brand: brand.primary, ... }` and `export const darkColors = { background: dark.background, ... }` so existing `import { colors } from 'theme'` still works. Also keep `export const fontFamily` mapped to new font names. This lets us migrate files incrementally without breaking the build.

---

## Task 3: Update Font Loading in App.tsx

**Files:**
- Modify: `App.tsx` (lines 117-118)

**Step 1:** Add font imports at top of file:

```typescript
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
```

**Step 2:** Replace the useFonts call:

```typescript
const [fontsLoaded] = useFonts({
  BebasNeue_400Regular,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
});
```

Remove the `'Chillax-Bold': require('./assets/fonts/Chillax-Bold.otf')` line.

**Step 3:** Verify build

```bash
npx expo export --platform web --output-dir /tmp/bk-font-test 2>&1 | tail -5
```

---

## Task 4: Update ScreenBase.tsx and StarryBackground.tsx

**Files:**
- Modify: `src/components/ScreenBase.tsx`
- Modify: `src/components/StarryBackground.tsx`

**ScreenBase.tsx:** Replace hardcoded `DARK_BG = '#0F0F0F'` and `LIGHT_BG = '#F5F5F5'` with imports from theme:

```typescript
import { dark, light } from '../styles/theme';
// ...
backgroundColor: isDark ? dark.background : light.background,
```

**StarryBackground.tsx:** Update `resolveColor()` function only (lines 42-51):

```typescript
function resolveColor(colorType: StarData['colorType'], isDark: boolean): string {
  switch (colorType) {
    case 'white':
      return isDark ? 'rgba(255,255,255,0.6)' : 'rgba(252,52,92,0.15)';
    case 'cyan':
      return brand.teal;
    case 'brand':
      return brand.primary;
  }
}
```

Also update `ShootingStar` line 163: `const starColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(252,52,92,0.15)';`

Do NOT touch animation logic, timing, easing, or useNativeDriver.

---

## Task 5: Update Shared UI Components (src/screens/components/ui/)

**Files (14 total):**
- `AchievementBadge.tsx` — card style, locked/unlocked colors
- `DailyProgressBar.tsx` — track/fill colors, height
- `GameCard.tsx` — card bg/border, text colors, border-radius
- `GhostButton.tsx` — border color, text color, border-radius → 28
- `GuessGridTile.tsx` — unselected/correct/incorrect tile colors
- `IconPill.tsx` — tag style (bg, text, radius → 20, ALL CAPS)
- `InnerAccentCard.tsx` — card bg/border
- `LeaderboardRow.tsx` — card style, text colors
- `LeagueSwitcher.tsx` — active/inactive colors
- `ListRow.tsx` — card style, divider color
- `PrimaryButton.tsx` — bg brand.primary, radius → 28, text → bodySemiBold
- `RoundProgressDots.tsx` — active/inactive dot colors
- `SecondaryButton.tsx` — ghost style, radius → 28
- `StreakBadge.tsx` — brand colors

**For each component:**
1. Replace all hardcoded hex colors with theme token imports
2. Use `useTheme()` hook to get `isDark`
3. Switch between `dark.*` and `light.*` tokens based on `isDark`
4. Update fontFamily references from `fontFamily.bold` etc. to appropriate new tokens
5. Update border-radius values per spec (12 cards, 28 buttons, 20 tags)
6. Do NOT change any props, callbacks, onPress handlers, or conditional logic

---

## Task 6: Update BottomNav (src/app/components/ui/)

**Files:**
- `src/app/components/ui/BottomNav.tsx`

Update colors for active/inactive tab states, background, border. Keep all navigation logic intact.

---

## Task 7: Update Tab/Settings Screens

**Files (9 total):**
- `src/screens/components/Home.tsx` — zone colors, card styles, text
- `src/app/components/Games.tsx` — zone colors, section labels, card grid
- `src/app/components/Leaderboard.tsx` — zone colors, podium, list items
- `src/app/components/Profile.tsx` — zone colors, stat strip, menu items
- `src/app/components/Settings.tsx` — list items, toggle colors
- `src/app/components/MyStats.tsx` — stat cards, numbers
- `src/app/components/Achievements.tsx` — badge cards
- `src/app/components/FavoriteTeams.tsx` — team cards, selection state
- `src/app/components/Notifications.tsx` — list items

**Pattern for each:** Import theme tokens, use `useTheme()`, replace hardcoded colors. Zone 1 (red header) stays `brand.primary`. Zone 2 content area uses `dark.background` / `light.background`.

---

## Task 8: Update Auth/Onboarding Screens

**Files (5 total):**
- `src/app/components/Login.tsx`
- `src/app/components/Onboarding.tsx` — also replace all 10 hardcoded `fontFamily: 'Chillax-Bold'`
- `src/app/components/Splash.tsx`
- `src/app/components/GameIntro.tsx` — heavy hardcoded colors (~40+)
- `src/app/components/AuthCallback.tsx`

**Onboarding.tsx specifically:** Replace every `fontFamily: 'Chillax-Bold'` with the appropriate theme font token. Also replace all hardcoded bg/text colors.

**GameIntro.tsx specifically:** This file has the most hardcoded colors in the entire codebase. Replace ALL of them with theme tokens.

---

## Task 9: Update Game Intro Screens

**Files (3 total):**
- `src/app/components/BlindRank5Intro.tsx` — ~15 hardcoded colors
- `src/app/components/BlindShowdownIntro.tsx` — ~15 hardcoded colors
- `src/app/components/PowerPlayIntro.tsx`

Same pattern: theme tokens, useTheme, no logic changes.

---

## Task 10: Update Game Screens (batch 1 — daily games)

**Files (6 total):**
- `src/app/game/player-guess.tsx`
- `src/app/game/blind-rank-5.tsx`
- `src/app/game/blind-showdown.tsx`
- `src/app/game/trivia.tsx`
- `src/app/game/power-play.tsx`
- `src/app/game/auto-complete.tsx`

**For each game screen:**
- Replace hardcoded bg, card, text, border colors with theme tokens
- Replace fontFamily references with new tokens
- Game answer tiles: unselected → theme card, correct → brand.primary bg, incorrect → brandAlpha15 bg
- Score/stat numbers: fonts.display, brand.primary
- Do NOT touch timer logic, scoring, answer validation, round management, useEffect, useCallback

---

## Task 11: Update Game Screens (batch 2 — multiplayer)

**Files (6 total):**
- `src/app/game/wavelength.tsx`
- `src/app/game/imposter.tsx`
- `src/app/game/draft-with-friends.tsx`
- `src/app/game/who-am-i.tsx`
- `src/app/game/13-words.tsx`
- `src/app/game/custom-mystery-player.tsx`

Same pattern as batch 1. Also update multiplayer lobby UI components:
- `src/components/multiplayer/JoinLobby.tsx`
- `src/components/multiplayer/LobbyScreen.tsx`

---

## Task 12: Update Remaining Components

**Files:**
- `src/app/components/Archive.tsx`
- `src/app/components/WaitlistScreen.tsx`
- `src/app/components/WaitlistPill.tsx`
- `src/components/AnimatedCard.tsx` (if it has colors)
- `src/components/qotd/QuestionOfTheDay.tsx`
- Any other component found with hardcoded colors

---

## Task 13: Final Sweep and Verification

**Step 1:** Grep for remaining Chillax references

```bash
grep -r "Chillax" src/
```

Expected: zero results

**Step 2:** Grep for hardcoded hex colors that should be tokens

```bash
grep -rn "#FC345C\|#0F0F0F\|#1A1A1A\|#07bccc\|#9A9A9A\|#F5F5F5\|#2A2A2A" src/ --include="*.tsx" --include="*.ts" | grep -v "theme.ts"
```

Expected: zero results (all routed through theme.ts)

**Step 3:** Verify build

```bash
npx expo export --platform web --output-dir /tmp/bk-redesign-test 2>&1 | tail -10
```

Expected: successful bundle with zero errors

**Step 4:** Manual verification
- Toggle light/dark mode in Settings
- Verify Home, Games, Profile, Leaderboard render correctly in both modes
- Launch at least one daily game and one multiplayer game
- Check Onboarding flow renders correctly
