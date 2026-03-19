# Draft With Friends Changes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove voting, add league selection, add round count picker, and make draft board cells larger in `src/app/game/draft-with-friends.tsx`.

**Architecture:** All changes are confined to a single file. League data (categories + athlete pools) is added as static mock objects keyed by league. The `LeagueSwitcher` component (already in the codebase) is reused for league selection. Voting phase is deleted entirely.

**Tech Stack:** React Native, TypeScript, existing `LeagueSwitcher` at `src/screens/components/ui/LeagueSwitcher.tsx`

---

### Task 1: Remove voting phase

**Files:**
- Modify: `src/app/game/draft-with-friends.tsx`

**Step 1: Remove VoteRecord type and voting state**

Delete these from the file:
- `interface VoteRecord { ... }` (lines 40–43)
- `votes`, `currentVoterIndex`, `pendingVote` from state declarations
- `getVoteTallies()` function
- `getWinnerIndex()` function
- `handleCastVote` handler
- `handleConfirmVote` handler

**Step 2: Update Phase type**

```tsx
type Phase = 'setup' | 'draft' | 'results';
```

Remove `'voting'` from the union.

**Step 3: Update handleDraftAthlete to skip voting**

Replace the block that transitions to voting with a direct transition to results:

```tsx
if (nextIndex >= totalPicks) {
  setCurrentPickIndex(nextIndex);
  setPhase('results');
} else {
  const nextPlayer = pickOrder[nextIndex];
  setPassTarget(playerNames[nextPlayer]);
  setShowPassScreen(true);
  setCurrentPickIndex(nextIndex);
}
```

**Step 4: Remove the entire voting phase render block**

Delete everything from `// ─── PHASE: VOTING ──` down to its closing brace (the entire `if (phase === 'voting') { ... }` block, including the pass screen branch).

**Step 5: Update results phase**

Replace Zone 1 with a simple "DRAFT COMPLETE" header (no Trophy icon, no winner name, no vote counts):

```tsx
<View style={styles.zone1Results}>
  <Text style={styles.zone1Label}>DRAFT WITH FRIENDS</Text>
  <Text style={styles.resultsHeading}>DRAFT COMPLETE</Text>
  <Text style={styles.draftCategorySmall}>{LEAGUE_DATA[selectedLeague].category}</Text>
</View>
```

Replace Zone 2 results content — remove vote breakdown, show each player's picks as cards sorted by player order (not by votes):

```tsx
{playerNames.map((pName, pIdx) => {
  const playerPicks = board[pIdx];
  return (
    <View key={pIdx} style={styles.resultCard}>
      <Text style={styles.resultPlayerName}>{pName}</Text>
      <View style={styles.resultPickList}>
        {playerPicks.map((aId, rIdx) => {
          const athlete = leagueAthletes.find((a) => a.id === aId);
          return (
            <Text key={rIdx} style={styles.resultPickItem}>
              R{rIdx + 1}: {athlete?.name ?? '—'}
            </Text>
          );
        })}
      </View>
    </View>
  );
})}
```

Remove `winnerName`, `winnerVotes`, `resultCardWinner`, `resultPlayerNameWinner`, `resultVoteCount`, `resultVoteCountWinner`, `votingSubtitle`, `votingHint`, `voteCard`, `voteCardSelf`, `voteCardSelected`, `voteCardHeader`, `voteCardName`, `voteCardNameSelf`, `selfTag`, `voteCheckCircle`, `votePickList`, `votePickItem`, `votePickItemSelf`, `zone1Voting` styles.

Add `resultsHeading` style:
```tsx
resultsHeading: {
  fontFamily: fontFamily.bold,
  fontWeight: '700',
  fontSize: 28,
  color: colors.white,
  letterSpacing: 1,
  marginTop: 4,
},
```

**Step 6: Reset state in "PLAY AGAIN"**

Remove vote-related resets from the play again handler:
```tsx
onPress={() => {
  setPicks([]);
  setCurrentPickIndex(0);
  setShowPassScreen(false);
  setPhase('setup');
}}
```

**Step 7: Commit**
```bash
git add src/app/game/draft-with-friends.tsx
git commit -m "feat: remove voting phase from Draft With Friends"
```

---

### Task 2: Add per-league mock data

**Files:**
- Modify: `src/app/game/draft-with-friends.tsx`

**Step 1: Replace MOCK_CATEGORY and ATHLETES constants**

Delete `const MOCK_CATEGORY` and `const ATHLETES: Athlete[]`. Replace with a `LEAGUE_DATA` record:

```tsx
interface LeagueData {
  category: string;
  athletes: Athlete[];
}

const LEAGUE_DATA: Record<string, LeagueData> = {
  NBA: {
    category: 'Best NBA Shooters of All Time',
    athletes: [
      { id: 'nba1', name: 'Stephen Curry', team: 'Golden State Warriors', era: '2010s–Present', keyStat: '3,747 3PM all-time record' },
      { id: 'nba2', name: 'Ray Allen', team: 'Multiple Teams', era: '1990s–2010s', keyStat: '2,973 3PM former record' },
      { id: 'nba3', name: 'Reggie Miller', team: 'Indiana Pacers', era: '1990s–2000s', keyStat: '2,560 3PM' },
      { id: 'nba4', name: 'Klay Thompson', team: 'Golden State Warriors', era: '2010s–Present', keyStat: '14 3PM single game' },
      { id: 'nba5', name: 'Larry Bird', team: 'Boston Celtics', era: '1980s', keyStat: '3× 3PT Contest champion' },
      { id: 'nba6', name: 'Dirk Nowitzki', team: 'Dallas Mavericks', era: '2000s–2010s', keyStat: '47.1% career 3PT' },
      { id: 'nba7', name: 'Kevin Durant', team: 'Multiple Teams', era: '2010s–Present', keyStat: '38.4% 3PT, elite mid-range' },
      { id: 'nba8', name: 'Damian Lillard', team: 'Multiple Teams', era: '2010s–Present', keyStat: '37.6% 3PT, logo range' },
      { id: 'nba9', name: 'James Harden', team: 'Multiple Teams', era: '2010s–Present', keyStat: '3,342 3PM elite volume' },
      { id: 'nba10', name: 'Kyle Korver', team: 'Multiple Teams', era: '2000s–2010s', keyStat: '43.0% career 3PT' },
      { id: 'nba11', name: 'Steve Nash', team: 'Multiple Teams', era: '2000s', keyStat: '42.8% 3PT, 2× MVP' },
      { id: 'nba12', name: 'JJ Redick', team: 'Multiple Teams', era: '2000s–2010s', keyStat: '41.5% career 3PT' },
      { id: 'nba13', name: 'Buddy Hield', team: 'Multiple Teams', era: '2010s–Present', keyStat: '40.2% career 3PT' },
      { id: 'nba14', name: 'Trae Young', team: 'Atlanta Hawks', era: '2010s–Present', keyStat: 'Elite deep range' },
      { id: 'nba15', name: 'Duncan Robinson', team: 'Miami Heat', era: '2010s–Present', keyStat: '42.3% career 3PT' },
    ],
  },
  NFL: {
    category: 'Greatest NFL Quarterbacks of All Time',
    athletes: [
      { id: 'nfl1', name: 'Tom Brady', team: 'Multiple Teams', era: '2000s–2020s', keyStat: '7× Super Bowl champion' },
      { id: 'nfl2', name: 'Joe Montana', team: 'San Francisco 49ers', era: '1980s–1990s', keyStat: '4× Super Bowl champion, 0 INTs in SB' },
      { id: 'nfl3', name: 'Patrick Mahomes', team: 'Kansas City Chiefs', era: '2010s–Present', keyStat: '3× Super Bowl champion, 2× MVP' },
      { id: 'nfl4', name: 'Aaron Rodgers', team: 'Multiple Teams', era: '2000s–Present', keyStat: '4× NFL MVP' },
      { id: 'nfl5', name: 'Peyton Manning', team: 'Multiple Teams', era: '2000s–2010s', keyStat: '5× NFL MVP' },
      { id: 'nfl6', name: 'Johnny Unitas', team: 'Baltimore Colts', era: '1950s–1970s', keyStat: '47 consecutive TD games' },
      { id: 'nfl7', name: 'Steve Young', team: 'San Francisco 49ers', era: '1980s–1990s', keyStat: '96.8 career passer rating (former record)' },
      { id: 'nfl8', name: 'John Elway', team: 'Denver Broncos', era: '1980s–1990s', keyStat: '2× Super Bowl champion' },
      { id: 'nfl9', name: 'Dan Marino', team: 'Miami Dolphins', era: '1980s–1990s', keyStat: '420 career TDs (retired record)' },
      { id: 'nfl10', name: 'Brett Favre', team: 'Multiple Teams', era: '1990s–2000s', keyStat: '3× NFL MVP' },
      { id: 'nfl11', name: 'Josh Allen', team: 'Buffalo Bills', era: '2010s–Present', keyStat: 'Elite dual-threat, 40+ TD seasons' },
      { id: 'nfl12', name: 'Lamar Jackson', team: 'Baltimore Ravens', era: '2010s–Present', keyStat: '2× NFL MVP' },
      { id: 'nfl13', name: 'Drew Brees', team: 'Multiple Teams', era: '2000s–2020s', keyStat: '80,358 career pass yards (retired record)' },
      { id: 'nfl14', name: 'Roger Staubach', team: 'Dallas Cowboys', era: '1970s', keyStat: '2× Super Bowl champion, 2× SB MVP' },
      { id: 'nfl15', name: 'Troy Aikman', team: 'Dallas Cowboys', era: '1990s', keyStat: '3× Super Bowl champion' },
    ],
  },
  MLB: {
    category: 'Greatest MLB Hitters of All Time',
    athletes: [
      { id: 'mlb1', name: 'Babe Ruth', team: 'New York Yankees', era: '1910s–1930s', keyStat: '.342 avg, 714 HR, 1.164 OPS' },
      { id: 'mlb2', name: 'Ted Williams', team: 'Boston Red Sox', era: '1940s–1960s', keyStat: 'Last .400 season (.406 in 1941)' },
      { id: 'mlb3', name: 'Barry Bonds', team: 'Multiple Teams', era: '1990s–2000s', keyStat: '762 HR all-time record' },
      { id: 'mlb4', name: 'Hank Aaron', team: 'Multiple Teams', era: '1950s–1970s', keyStat: '755 HR, 2,297 RBI' },
      { id: 'mlb5', name: 'Willie Mays', team: 'San Francisco Giants', era: '1950s–1970s', keyStat: '660 HR, .302 avg, The Catch' },
      { id: 'mlb6', name: 'Lou Gehrig', team: 'New York Yankees', era: '1920s–1930s', keyStat: '1.080 career OPS, 2,130 consecutive games' },
      { id: 'mlb7', name: 'Mike Trout', team: 'Los Angeles Angels', era: '2010s–Present', keyStat: '3× AL MVP, highest WAR active' },
      { id: 'mlb8', name: 'Mickey Mantle', team: 'New York Yankees', era: '1950s–1960s', keyStat: 'Triple Crown 1956, 536 HR' },
      { id: 'mlb9', name: 'Joe DiMaggio', team: 'New York Yankees', era: '1930s–1950s', keyStat: '56-game hitting streak' },
      { id: 'mlb10', name: 'Albert Pujols', team: 'Multiple Teams', era: '2000s–2020s', keyStat: '700 HR, 3× NL MVP' },
      { id: 'mlb11', name: 'Alex Rodriguez', team: 'Multiple Teams', era: '1990s–2010s', keyStat: '696 HR, 3× AL MVP' },
      { id: 'mlb12', name: 'Ken Griffey Jr.', team: 'Multiple Teams', era: '1990s–2000s', keyStat: '630 HR, 10× Gold Glove' },
      { id: 'mlb13', name: 'Frank Robinson', team: 'Multiple Teams', era: '1950s–1970s', keyStat: '586 HR, Triple Crown 1966' },
      { id: 'mlb14', name: 'Rogers Hornsby', team: 'Multiple Teams', era: '1910s–1930s', keyStat: '.358 career avg, highest 2B avg ever' },
      { id: 'mlb15', name: 'Shohei Ohtani', team: 'Los Angeles Dodgers', era: '2010s–Present', keyStat: '50+ HR/50+ SB season, 2× MVP' },
    ],
  },
  NHL: {
    category: 'Greatest NHL Players of All Time',
    athletes: [
      { id: 'nhl1', name: 'Wayne Gretzky', team: 'Multiple Teams', era: '1980s–1990s', keyStat: '2,857 career points, "The Great One"' },
      { id: 'nhl2', name: 'Gordie Howe', team: 'Multiple Teams', era: '1950s–1970s', keyStat: '801 goals, 4× Stanley Cup' },
      { id: 'nhl3', name: 'Mario Lemieux', team: 'Pittsburgh Penguins', era: '1980s–2000s', keyStat: '1.88 PPG, 2× Stanley Cup' },
      { id: 'nhl4', name: 'Bobby Orr', team: 'Boston Bruins', era: '1960s–1970s', keyStat: 'Greatest offensive defenseman ever' },
      { id: 'nhl5', name: 'Sidney Crosby', team: 'Pittsburgh Penguins', era: '2000s–Present', keyStat: '3× Stanley Cup, 2× Hart Trophy' },
      { id: 'nhl6', name: 'Maurice Richard', team: 'Montreal Canadiens', era: '1940s–1960s', keyStat: 'First 50-goal season, 8× Stanley Cup' },
      { id: 'nhl7', name: 'Mark Messier', team: 'Multiple Teams', era: '1980s–2000s', keyStat: '6× Stanley Cup, 2× Hart Trophy' },
      { id: 'nhl8', name: 'Jaromir Jagr', team: 'Multiple Teams', era: '1990s–2010s', keyStat: '766 goals, 2× Stanley Cup' },
      { id: 'nhl9', name: 'Phil Esposito', team: 'Multiple Teams', era: '1960s–1980s', keyStat: '717 goals, 2× Hart Trophy' },
      { id: 'nhl10', name: 'Mike Bossy', team: 'New York Islanders', era: '1980s', keyStat: '573 goals, 4× Stanley Cup' },
      { id: 'nhl11', name: 'Steve Yzerman', team: 'Detroit Red Wings', era: '1980s–2000s', keyStat: '3× Stanley Cup, 692 goals' },
      { id: 'nhl12', name: 'Patrick Roy', team: 'Multiple Teams', era: '1980s–2000s', keyStat: '4× Stanley Cup, 3× Conn Smythe' },
      { id: 'nhl13', name: 'Nicklas Lidstrom', team: 'Detroit Red Wings', era: '1990s–2010s', keyStat: '7× Norris Trophy, 4× Stanley Cup' },
      { id: 'nhl14', name: 'Connor McDavid', team: 'Edmonton Oilers', era: '2010s–Present', keyStat: '3× Hart Trophy, 100+ point seasons' },
      { id: 'nhl15', name: 'Brett Hull', team: 'Multiple Teams', era: '1980s–2000s', keyStat: '741 goals, 2× Stanley Cup' },
    ],
  },
};
```

**Step 2: Add selectedLeague state**

```tsx
const [selectedLeague, setSelectedLeague] = useState<string>('NBA');
```

**Step 3: Replace ATHLETES and MOCK_CATEGORY references**

Replace every reference to `ATHLETES` with `LEAGUE_DATA[selectedLeague].athletes` (store in a local const for convenience):

```tsx
const leagueData = LEAGUE_DATA[selectedLeague];
const leagueAthletes = leagueData.athletes;
const leagueCategory = leagueData.category;
```

Replace every `MOCK_CATEGORY` with `leagueCategory`.

**Step 4: Commit**
```bash
git add src/app/game/draft-with-friends.tsx
git commit -m "feat: add per-league mock data to Draft With Friends"
```

---

### Task 3: Add LeagueSwitcher to setup screen

**Files:**
- Modify: `src/app/game/draft-with-friends.tsx`

**Step 1: Import LeagueSwitcher**

```tsx
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';
```

**Step 2: Add LeagueSwitcher to Zone 1 in setup phase**

After the `zone1Category` text in setup Zone 1:

```tsx
<View style={styles.zone1}>
  <Pressable onPress={onBack} style={styles.backBtnZone1} hitSlop={8}>
    <ArrowLeft size={22} color={colors.white} strokeWidth={2} />
  </Pressable>
  <Text style={styles.zone1Label}>DRAFT WITH FRIENDS</Text>
  <Text style={styles.zone1CategoryLabel}>Today's Category</Text>
  <Text style={styles.zone1Category}>{leagueCategory}</Text>
  <View style={styles.zone1SwitcherWrap}>
    <LeagueSwitcher selected={selectedLeague} onChange={setSelectedLeague} />
  </View>
</View>
```

**Step 3: Add zone1SwitcherWrap style**

```tsx
zone1SwitcherWrap: {
  marginTop: 16,
  width: '100%',
},
```

**Step 4: Increase zone1 paddingBottom to accommodate switcher**

```tsx
zone1: {
  ...
  paddingBottom: 56,
  ...
},
```

**Step 5: Reset picks and pickIndex when league changes**

Add a handler for league switching that resets draft state:

```tsx
const handleLeagueChange = useCallback((league: string) => {
  setSelectedLeague(league);
  // no reset needed — league only changeable during setup phase
}, []);
```

Pass `handleLeagueChange` to `LeagueSwitcher`'s `onChange`.

**Step 6: Commit**
```bash
git add src/app/game/draft-with-friends.tsx
git commit -m "feat: add league switcher to Draft With Friends setup"
```

---

### Task 4: Add round number selection

**Files:**
- Modify: `src/app/game/draft-with-friends.tsx`

**Step 1: Replace hardcoded ROUNDS with state**

Remove:
```tsx
const ROUNDS = 3;
```

Add to state:
```tsx
const [rounds, setRounds] = useState<number>(3);
```

**Step 2: Update pickOrder and totalPicks derivations**

These already use `ROUNDS` — update them to use `rounds`:
```tsx
const pickOrder = getPickOrder(playerNames.length, rounds);
```

**Step 3: Add rounds selector UI in setup Zone 2**

Add a "ROUNDS" section after the player list and before the start button:

```tsx
<Text style={styles.sectionTitle}>ROUNDS</Text>
<View style={styles.roundsRow}>
  {[3, 4, 5].map((r) => (
    <Pressable
      key={r}
      style={[styles.roundPill, rounds === r && styles.roundPillActive]}
      onPress={() => setRounds(r)}
    >
      <Text style={[styles.roundPillText, rounds === r && styles.roundPillTextActive]}>
        {r}
      </Text>
    </Pressable>
  ))}
</View>
```

**Step 4: Add round pill styles**

```tsx
roundsRow: {
  flexDirection: 'row',
  gap: 10,
  marginBottom: 24,
},
roundPill: {
  flex: 1,
  height: 44,
  borderRadius: 12,
  backgroundColor: darkColors.surfaceElevated,
  borderWidth: 1,
  borderColor: darkColors.border,
  alignItems: 'center',
  justifyContent: 'center',
},
roundPillActive: {
  backgroundColor: colors.brand,
  borderColor: colors.brand,
},
roundPillText: {
  fontFamily: fontFamily.bold,
  fontWeight: '700',
  fontSize: 17,
  color: darkColors.textSecondary,
},
roundPillTextActive: {
  color: colors.white,
},
```

**Step 5: Update sectionSubtitle**

```tsx
<Text style={styles.sectionSubtitle}>{playerNames.length} players · {rounds} rounds each</Text>
```

**Step 6: Reset rounds on play again**

```tsx
onPress={() => {
  setPicks([]);
  setCurrentPickIndex(0);
  setShowPassScreen(false);
  setRounds(3);
  setPhase('setup');
}}
```

**Step 7: Commit**
```bash
git add src/app/game/draft-with-friends.tsx
git commit -m "feat: add round count selector to Draft With Friends"
```

---

### Task 5: Bigger draft board boxes

**Files:**
- Modify: `src/app/game/draft-with-friends.tsx`

**Step 1: Update boardColumn width**

```tsx
boardColumn: {
  width: 150,  // was 120
  gap: 6,
},
```

**Step 2: Update boardCell minHeight**

```tsx
boardCell: {
  borderRadius: 8,
  padding: 8,
  minHeight: 68,  // was 40
},
```

**Step 3: Update boardCellName fontSize**

```tsx
boardCellName: {
  fontFamily: fontFamily.bold,
  fontWeight: '700',
  fontSize: 13,  // was 11
  color: darkColors.text,
  marginTop: 2,
},
```

**Step 4: Update boardCellRound fontSize**

```tsx
boardCellRound: {
  fontFamily: fontFamily.bold,
  fontSize: 11,  // was 9
  letterSpacing: 0.5,
  color: darkColors.textSecondary,
},
```

**Step 5: Commit**
```bash
git add src/app/game/draft-with-friends.tsx
git commit -m "feat: increase draft board cell size in Draft With Friends"
```

---

### Task 6: Final cleanup

**Step 1: Verify no remaining MOCK_CATEGORY or bare ATHLETES references**

Search for any leftover `MOCK_CATEGORY` or `ATHLETES` (not `leagueAthletes`) references and replace them.

**Step 2: Remove unused state variables and styles**

Confirm all removed vote-related styles are actually deleted from `StyleSheet.create({...})`.

**Step 3: Final commit**
```bash
git add src/app/game/draft-with-friends.tsx
git commit -m "chore: cleanup after Draft With Friends redesign"
```
