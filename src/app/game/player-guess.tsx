import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Search } from 'lucide-react-native';
import MidnightCountdown from '../../components/MidnightCountdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, darkColors, fontFamily, spacing } from '../../styles/theme';
import { getActivePlayers } from '../../lib/playersPool';
import { NBA_ATTRS, NFL_ATTRS, MLB_ATTRS, NHL_ATTRS, type NBAAttrs, type NFLAttrs, type MLBAttrs, type NHLAttrs, type PlayerAttrs } from '../../lib/playerAttrs';
import GuessGridTile from '../../screens/components/ui/GuessGridTile';
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';
import PrimaryButton from '../../screens/components/ui/PrimaryButton';
import GhostButton from '../../screens/components/ui/GhostButton';
import { type Tab } from '../components/ui/BottomNav';
import { calculateDailyGameXP, saveGameResult, updateUserXPAndStreak } from '../../lib/xp';
import { supabase } from '../../lib/supabase';
import { getTodaysDailyGame, getArchiveGame } from '../../lib/dailyGames';
import { saveGameResult as saveCompletionResult, getGameResultToday } from '../../lib/gameResults';
import { updatePlayHour } from '../../lib/notifications';

// ── Types ────────────────────────────────────────────────────────────────────

type TileState = 'empty' | 'correct' | 'close' | 'wrong' | 'higher' | 'lower' | 'close_higher' | 'close_lower';

interface TileData {
  value: string;
  state: TileState;
}

interface Props {
  onBack: () => void;
  onNavigate: (tab: Tab) => void;
  archiveDate?: string;
}

type League = 'NBA' | 'NFL' | 'MLB' | 'NHL';

// ── Player Pool (only players with complete attribute data) ─────────────────

async function loadPlayerPool(league: League): Promise<string[]> {
  const attrMap = league === 'NBA' ? NBA_ATTRS : league === 'NFL' ? NFL_ATTRS : league === 'MLB' ? MLB_ATTRS : NHL_ATTRS;
  const players = await getActivePlayers(league);
  return players.map(p => p.name).filter(name => name in attrMap);
}


function getPlayerAttrs(name: string, league: League): PlayerAttrs | null {
  if (league === 'NBA') return NBA_ATTRS[name] ?? null;
  if (league === 'NFL') return NFL_ATTRS[name] ?? null;
  if (league === 'MLB') return MLB_ATTRS[name] ?? null;
  if (league === 'NHL') return NHL_ATTRS[name] ?? null;
  return null;
}

// ── NBA team abbreviation → full name ────────────────────────────────────────
// NFL/MLB/NHL playerAttrs already use full names; only NBA uses 3-letter codes.

const NBA_TEAM_NAMES: Record<string, string> = {
  ATL: 'Atlanta Hawks',       BOS: 'Boston Celtics',         BKN: 'Brooklyn Nets',
  CHA: 'Charlotte Hornets',   CHI: 'Chicago Bulls',          CLE: 'Cleveland Cavaliers',
  DAL: 'Dallas Mavericks',    DEN: 'Denver Nuggets',         DET: 'Detroit Pistons',
  GSW: 'Golden State Warriors', HOU: 'Houston Rockets',      IND: 'Indiana Pacers',
  LAC: 'LA Clippers',         LAL: 'Los Angeles Lakers',     MEM: 'Memphis Grizzlies',
  MIA: 'Miami Heat',          MIL: 'Milwaukee Bucks',        MIN: 'Minnesota Timberwolves',
  NOP: 'New Orleans Pelicans', NYK: 'New York Knicks',       OKC: 'Oklahoma City Thunder',
  ORL: 'Orlando Magic',       PHI: 'Philadelphia 76ers',     PHX: 'Phoenix Suns',
  POR: 'Portland Trail Blazers', SAC: 'Sacramento Kings',    SAS: 'San Antonio Spurs',
  TOR: 'Toronto Raptors',     UTA: 'Utah Jazz',              WAS: 'Washington Wizards',
};

function expandNBATeam(t: string): string {
  return NBA_TEAM_NAMES[t] ?? t;
}

// ── Column definitions per league ────────────────────────────────────────────

const LEAGUE_COLS: Record<League, string[]> = {
  NBA: ['PLAYER', 'HT', '#', 'TEAM', 'POS', 'CONF', 'COLLEGE', 'AGE'],
  NFL: ['PLAYER', 'HT', '#', 'TEAM', 'POS', 'CONF', 'COLLEGE', 'AGE'],
  MLB: ['PLAYER', 'BAT', 'THR', 'COUNTRY', 'TEAM', 'POS', 'DIV', 'AGE'],
  NHL: ['PLAYER', 'HT', '#', 'TEAM', 'POS', 'CONF', 'COUNTRY', 'AGE'],
};

// ── Height parsing ───────────────────────────────────────────────────────────

function parseHeightToInches(h: string): number {
  const m = h.match(/(\d+)'(\d+)/);
  return m ? parseInt(m[1]) * 12 + parseInt(m[2]) : 0;
}

function formatHeight(inches: number): string {
  return `${Math.floor(inches / 12)}'${inches % 12}"`;
}

// ── Continent mapping ────────────────────────────────────────────────────────

const CONTINENT_MAP: Record<string, string> = {
  'USA': 'North America', 'Canada': 'North America',
  'Dominican Republic': 'North America', 'Cuba': 'North America', 'Puerto Rico': 'North America',
  'Venezuela': 'South America', 'Colombia': 'South America', 'Brazil': 'South America',
  'Japan': 'Asia', 'South Korea': 'Asia', 'China': 'Asia', 'Taiwan': 'Asia',
  'Germany': 'Europe', 'Russia': 'Europe', 'Sweden': 'Europe', 'Finland': 'Europe',
  'Czechia': 'Europe', 'France': 'Europe', 'Slovenia': 'Europe', 'Serbia': 'Europe',
  'Greece': 'Europe', 'Spain': 'Europe', 'Lithuania': 'Europe', 'Latvia': 'Europe',
  'Croatia': 'Europe', 'Montenegro': 'Europe', 'Turkey': 'Europe', 'Switzerland': 'Europe',
  'Australia': 'Oceania', 'New Zealand': 'Oceania',
  'Cameroon': 'Africa', 'Nigeria': 'Africa', 'Congo': 'Africa', 'Senegal': 'Africa',
  'South Sudan': 'Africa', 'Sudan': 'Africa',
};

function isSameContinent(a: string, b: string): boolean {
  const ca = CONTINENT_MAP[a] ?? a;
  const cb = CONTINENT_MAP[b] ?? b;
  return ca === cb && ca !== a; // only match if actually mapped
}

// ── Comparison logic ─────────────────────────────────────────────────────────

const MAX_GUESSES = 8;

interface MysteryPlayer {
  name: string;
  height?: string;   // "6'3\"" format
  jersey?: number;
  team: string;
  position: string;
  conference?: string;
  college?: string;
  age?: number;
  // MLB-specific
  bat?: string;
  throwing?: string;
  country?: string;
  division?: string;
}

function compareTile(
  guessVal: string | number | undefined,
  mysteryVal: string | number | undefined,
  attribute: string,
): TileState {
  if (guessVal === undefined || mysteryVal === undefined) return 'wrong';
  if (guessVal === mysteryVal) return 'correct';

  if (attribute === 'height') {
    const gIn = typeof guessVal === 'string' ? parseHeightToInches(guessVal) : guessVal as number;
    const mIn = typeof mysteryVal === 'string' ? parseHeightToInches(mysteryVal) : mysteryVal as number;
    if (gIn === mIn) return 'correct';
    const diff = mIn - gIn;
    if (Math.abs(diff) <= 2) return diff > 0 ? 'close_higher' : 'close_lower';
    return diff > 0 ? 'higher' : 'lower';
  }

  if (attribute === 'age') {
    const g = guessVal as number;
    const m = mysteryVal as number;
    const diff = m - g;
    if (Math.abs(diff) <= 2) return 'close';
    return diff > 0 ? 'higher' : 'lower';
  }

  if (attribute === 'jersey') {
    const g = guessVal as number;
    const m = mysteryVal as number;
    const diff = m - g;
    if (Math.abs(diff) <= 5) return 'close';
    return diff > 0 ? 'higher' : 'lower';
  }

  if (attribute === 'conference' || attribute === 'division') {
    // Same sport, different conference/division = close (yellow)
    return 'close';
  }

  if (attribute === 'country') {
    return isSameContinent(guessVal as string, mysteryVal as string) ? 'close' : 'wrong';
  }

  return 'wrong';
}

function evaluateGuessForLeague(
  guessAttrs: PlayerAttrs,
  guessName: string,
  mystery: MysteryPlayer,
  league: League,
): TileData[] {
  const nameState: TileState = guessName === mystery.name ? 'correct' : 'wrong';
  const nameDisplay = guessName.split(' ').slice(-1)[0];

  if (league === 'MLB') {
    const g = guessAttrs as MLBAttrs;
    return [
      { value: nameDisplay, state: nameState },
      { value: g.bat, state: compareTile(g.bat, mystery.bat, 'bat') },
      { value: g.throwing, state: compareTile(g.throwing, mystery.throwing, 'throwing') },
      { value: g.country, state: compareTile(g.country, mystery.country, 'country') },
      { value: g.team, state: compareTile(g.team, mystery.team, 'team') },
      { value: g.position, state: compareTile(g.position, mystery.position, 'position') },
      { value: g.division, state: compareTile(g.division, mystery.division, 'division') },
      { value: String(g.age), state: compareTile(g.age, mystery.age, 'age') },
    ];
  }

  // NBA, NFL, NHL all share: height, jersey, team, position, conference, (college|country), age
  const g = guessAttrs as NBAAttrs | NFLAttrs | NHLAttrs;
  const gHeight = parseHeightToInches(g.height);
  const mHeight = mystery.height ? parseHeightToInches(mystery.height) : 0;
  // NBA uses 3-letter team codes in playerAttrs; expand to full name for comparison
  const gTeam = league === 'NBA' ? expandNBATeam(g.team) : g.team;

  const sixthCol = league === 'NHL'
    ? { value: (g as NHLAttrs).country, state: compareTile((g as NHLAttrs).country, mystery.country, 'country') }
    : { value: (g as NBAAttrs | NFLAttrs).college, state: compareTile((g as NBAAttrs | NFLAttrs).college, mystery.college, 'college') };

  return [
    { value: nameDisplay, state: nameState },
    { value: formatHeight(gHeight), state: compareTile(gHeight, mHeight, 'height') },
    { value: `#${g.jersey}`, state: compareTile(g.jersey, mystery.jersey, 'jersey') },
    { value: gTeam, state: compareTile(gTeam, mystery.team, 'team') },
    { value: g.position, state: compareTile(g.position, mystery.position, 'position') },
    { value: g.conference, state: compareTile(g.conference, mystery.conference, 'conference') },
    sixthCol,
    { value: String(g.age), state: compareTile(g.age, mystery.age, 'age') },
  ];
}

// ── Component ────────────────────────────────────────────────────────────────

export default function PlayerGuessScreen({ onBack, archiveDate }: Props) {
  const isArchive = !!archiveDate;
  const [guesses, setGuesses] = useState<TileData[][]>([]);
  const [guessedNames, setGuessedNames] = useState<Set<string>>(new Set());
  const [searchText, setSearchText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [activeLeague, setActiveLeague] = useState<League>('NBA');
  const [xpEarned, setXpEarned] = useState<number | null>(null);
  const [mystery, setMystery] = useState<MysteryPlayer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [playedTodayCache, setPlayedTodayCache] = useState<Record<string, { score: number; xp: number } | null>>({});
  const [playerPool, setPlayerPool] = useState<string[]>([]);

  useEffect(() => {
    loadPlayerPool(activeLeague).then(setPlayerPool);
  }, [activeLeague]);

  // ── AsyncStorage persistence helpers ──────────────────────────────────────
  const getStorageKey = useCallback((league: League) => {
    const today = new Date().toISOString().split('T')[0];
    return `mystery-player-state-${league}-${today}`;
  }, []);

  const saveGameState = useCallback(
    (league: League, data: { guesses: TileData[][]; guessedNames: string[]; gameState: 'playing' | 'won' | 'lost'; xpEarned: number | null }) => {
      void AsyncStorage.setItem(getStorageKey(league), JSON.stringify(data));
    },
    [getStorageKey],
  );

  useEffect(() => {
    setIsLoading(true);
    setLoadError(false);
    setMystery(null);
    setGuesses([]);
    setGuessedNames(new Set());
    setSearchText('');
    setShowDropdown(false);
    setGameState('playing');
    setXpEarned(null);
    const fetchGame = isArchive
      ? getArchiveGame(activeLeague, archiveDate!)
      : getTodaysDailyGame(activeLeague);
    const fetchResult = isArchive
      ? Promise.resolve(null)
      : getGameResultToday(activeLeague, 'mystery-player');
    void Promise.all([fetchGame, fetchResult]).then(async ([data, priorResult]) => {
      setIsLoading(false);
      if (!isArchive) setPlayedTodayCache(prev => ({ ...prev, [activeLeague]: priorResult }));
      if (!data?.mystery_player) { setLoadError(true); return; }
      const raw = data.mystery_player;

      // Build MysteryPlayer from the raw jsonb data
      const mp: MysteryPlayer = {
        name: raw.name,
        team: raw.team ?? '',
        position: raw.position ?? '',
        height: raw.height,
        jersey: raw.jerseyNumber,
        conference: raw.conference,
        college: raw.college,
        age: raw.age,
        bat: raw.battingHand,
        throwing: raw.throwingHand,
        country: raw.country,
        division: raw.division,
      };
      setMystery(mp);

      // Restore saved game state from AsyncStorage (daily games only)
      if (!isArchive) {
        try {
          const saved = await AsyncStorage.getItem(getStorageKey(activeLeague));
          if (saved) {
            const parsed = JSON.parse(saved) as { guesses: TileData[][]; guessedNames: string[]; gameState: 'playing' | 'won' | 'lost'; xpEarned: number | null };
            if (parsed.guesses?.length > 0) {
              setGuesses(parsed.guesses);
              setGuessedNames(new Set(parsed.guessedNames));
              setGameState(parsed.gameState);
              setXpEarned(parsed.xpEarned);
            }
          }
        } catch (e) {
          // Ignore failed restore
        }
      }
    });
  }, [activeLeague]);

  const cols = LEAGUE_COLS[activeLeague];

  const searchResults =
    searchText.length >= 2
      ? playerPool
          .filter(
            name =>
              name.toLowerCase().includes(searchText.toLowerCase()) &&
              !guessedNames.has(name),
          )
          .slice(0, 8)
      : [];

  const submitGuess = (playerName: string) => {
    if (!mystery) return;
    const attrs = getPlayerAttrs(playerName, activeLeague);
    if (!attrs) return;

    const row = evaluateGuessForLeague(attrs, playerName, mystery, activeLeague);
    const newGuesses = [...guesses, row];
    setGuesses(newGuesses);
    setGuessedNames(prev => new Set(prev).add(playerName));
    setSearchText('');
    setShowDropdown(false);

    const won = row.every(t => t.state === 'correct');
    const lost = !won && newGuesses.length >= MAX_GUESSES;
    const newState = won ? 'won' : lost ? 'lost' : 'playing';

    // Persist game state to AsyncStorage after every guess
    if (!isArchive) {
      const newXp = (won || lost) ? calculateDailyGameXP('mystery-player', { guessesRemaining: won ? MAX_GUESSES - newGuesses.length : 0 }) : null;
      saveGameState(activeLeague, {
        guesses: newGuesses,
        guessedNames: [...new Set([...guessedNames, playerName])],
        gameState: newState,
        xpEarned: newXp,
      });
    }

    if (won || lost) {
      const guessesRemaining = won ? MAX_GUESSES - newGuesses.length : 0;
      const xp = calculateDailyGameXP('mystery-player', { guessesRemaining });
      setXpEarned(xp);
      setGameState(won ? 'won' : 'lost');
      if (!isArchive) {
        void (async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await saveGameResult(user.id, 'mystery-player', xp, won ? newGuesses.length : 0);
            await updateUserXPAndStreak(user.id, xp, true);
          }
        })();
        void saveCompletionResult(activeLeague, 'mystery-player', won ? newGuesses.length : 0, xp);
        void updatePlayHour();
      }
    }
  };

  const canGuess = gameState === 'playing' && searchResults.length > 0 && mystery !== null;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* ── Zone 1 ── */}
        <View style={styles.zone1}>
          {/* Back button row */}
          <View style={styles.zone1TopRow}>
            <Pressable onPress={onBack} hitSlop={8} style={styles.backBtn}>
              <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
            </Pressable>
          </View>

          {/* Title block */}
          <View style={styles.zone1Center}>
            <Text style={styles.zone1Title}>MYSTERY PLAYER</Text>
            <Text style={styles.zone1Sub}>Guess the mystery athlete in {MAX_GUESSES} tries</Text>

            {/* Guess counter */}
            <View style={styles.counterRow}>
              <Text style={styles.counterCurrent}>{guesses.length}</Text>
              <Text style={styles.counterDivider}> / </Text>
              <Text style={styles.counterTotal}>{MAX_GUESSES}</Text>
            </View>
          </View>

          {/* League switcher / Archive banner */}
          {isArchive ? (
            <View style={styles.archiveBanner}>
              <Text style={styles.archiveBannerText}>ARCHIVE — {archiveDate}</Text>
            </View>
          ) : (
            <View style={styles.leagueSwitcherRow}>
              <LeagueSwitcher selected={activeLeague} onChange={l => setActiveLeague(l as League)} />
            </View>
          )}

          {/* Bottom fade overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.zone1Gradient}
            pointerEvents="none"
          />
        </View>

        {/* ── Zone 2 ── */}
        <View style={styles.zone2}>
          {isLoading ? (
            <View style={styles.centerState}>
              <ActivityIndicator size="large" color="#FC345C" />
            </View>
          ) : (loadError || !mystery) ? (
            <View style={styles.centerState}>
              <Text style={styles.errorText}>No game available today</Text>
            </View>
          ) : (!isArchive && playedTodayCache[activeLeague]) ? (
            <View style={styles.alreadyPlayedWrapper}>
              <View style={styles.alreadyPlayedCard}>
                <Text style={styles.alreadyPlayedBadge}>ALREADY PLAYED TODAY</Text>
                <Text style={styles.alreadyPlayedScore}>{playedTodayCache[activeLeague]!.score}</Text>
                <View style={styles.alreadyPlayedXpRow}>
                  <Text style={styles.alreadyPlayedXpLabel}>XP EARNED</Text>
                  <Text style={styles.alreadyPlayedXp}>+{playedTodayCache[activeLeague]!.xp}</Text>
                </View>
                <View style={styles.alreadyPlayedDivider} />
                <Text style={styles.alreadyPlayedCta}>COME BACK TOMORROW</Text>
                <Text style={styles.alreadyPlayedSub}>A new game drops every day. Switch leagues to play more.</Text>
                <MidnightCountdown />
                <GhostButton label="VIEW ARCHIVE" onPress={() => onNavigate('archive' as Tab)} />
              </View>
            </View>
          ) : (
          <ScrollView
            style={styles.gameScrollView}
            contentContainerStyle={styles.gameScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
          {/* Column headers */}
          <View style={styles.headerRow}>
            {cols.map((col, i) => (
              <View key={col} style={[styles.headerCell, { flex: i === 0 ? 2 : 1 }]}>
                <Text style={styles.headerText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{col}</Text>
              </View>
            ))}
          </View>

          {/* Result banner */}
          {gameState === 'won' && (
            <View style={styles.banner}>
              <Text style={styles.bannerText} numberOfLines={2}>You got it! {mystery.name}</Text>
            </View>
          )}
          {gameState === 'lost' && (
            <View style={[styles.banner, styles.bannerLost]}>
              <Text style={styles.bannerText} numberOfLines={2}>The answer was {mystery.name}</Text>
            </View>
          )}

          {/* XP card */}
          {xpEarned !== null && !isArchive && (
            <View style={styles.xpCard}>
              <Text style={styles.xpCardLabel}>XP EARNED</Text>
              <Text style={styles.xpCardTotal}>+{xpEarned}</Text>
              <Text style={styles.xpCardBreakdown}>
                Base: 500 XP + Bonus: {xpEarned - 500} XP
              </Text>
            </View>
          )}
          {isArchive && gameState !== 'playing' && (
            <Text style={styles.archiveNotice}>ARCHIVE MODE — Results not saved</Text>
          )}

          {/* Post-game actions (daily only) */}
          {!isArchive && gameState !== 'playing' && (
            <>
              <MidnightCountdown />
              <View style={styles.postGameActions}>
                <PrimaryButton label="PLAY ANOTHER DAILY GAME" onPress={onBack} />
                <GhostButton label="PLAY ARCHIVE" onPress={() => onNavigate('archive' as Tab)} />
              </View>
            </>
          )}

          {/* Guess grid */}
          <View style={styles.gridContent}>
            {guesses.map((row, i) => {
              const isNewest = i === guesses.length - 1;
              return (
                <View key={i} style={styles.gridRow}>
                  {row.map((tile, j) => (
                    <GuessGridTile
                      key={j}
                      value={tile.value}
                      state={tile.state}
                      flex={j === 0 ? 2 : 1}
                      flipDelay={isNewest ? j * 120 : 0}
                    />
                  ))}
                </View>
              );
            })}
          </View>

          {/* ── Search area ── */}
          {gameState === 'playing' && (
            <View style={styles.searchArea}>
              {/* Dropdown (above search bar) */}
              {showDropdown && searchResults.length > 0 && (
                <View style={styles.dropdown}>
                  {searchResults.map((name, i) => (
                    <Pressable
                      key={name}
                      onPress={() => submitGuess(name)}
                      style={({ pressed }) => [
                        styles.dropdownItem,
                        i < searchResults.length - 1 && styles.dropdownItemBorder,
                        pressed && styles.dropdownItemPressed,
                      ]}
                    >
                      <Text style={styles.dropdownText} numberOfLines={1}>{name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              {/* Search bar */}
              <View style={styles.searchBar}>
                <Search size={18} color="#9A9A9A" strokeWidth={2} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for a player..."
                  placeholderTextColor="#9A9A9A"
                  value={searchText}
                  onChangeText={t => {
                    setSearchText(t);
                    setShowDropdown(t.length >= 2);
                  }}
                  onFocus={() => {
                    if (searchText.length >= 2) setShowDropdown(true);
                  }}
                  autoCapitalize="words"
                  returnKeyType="search"
                />
              </View>

              {/* CTA */}
              <PrimaryButton
                label="MAKE A GUESS"
                onPress={() => {
                  if (searchResults.length > 0) submitGuess(searchResults[0]);
                }}
                disabled={!canGuess}
              />
            </View>
          )}
          </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flex: {
    flex: 1,
  },

  // Zone 1 ─────────────────────────────────────────────────────────────────
  zone1: {
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  zone1TopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  backBtn: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
  },
  zone1Center: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  zone1Title: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 26,
    color: colors.white,
    letterSpacing: 3,
    textAlign: 'center',
  },
  zone1Sub: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 4,
    textAlign: 'center',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.sm,
  },
  counterCurrent: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 36,
    color: colors.white,
    lineHeight: 40,
  },
  counterDivider: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 22,
    color: 'rgba(255,255,255,0.45)',
  },
  counterTotal: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 22,
    color: 'rgba(255,255,255,0.55)',
  },
  leagueSwitcherRow: {
    marginTop: spacing.md,
  },
  archiveBanner: {
    marginTop: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.20)',
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  archiveBannerText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    color: 'rgba(255,255,255,0.80)',
    letterSpacing: 1.5,
  },
  zone1Gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  // Zone 2 ─────────────────────────────────────────────────────────────────
  zone2: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },

  // Column headers
  headerRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    gap: 3,
  },
  headerCell: {
    alignItems: 'center',
  },
  headerText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 8,
    letterSpacing: 0.5,
    color: colors.accentCyan,
    textAlign: 'center',
  },

  // Result banner
  banner: {
    backgroundColor: '#00C897',
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  bannerLost: {
    backgroundColor: colors.accentRed,
  },
  bannerText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 15,
    color: colors.white,
    textAlign: 'center',
  },

  // Outer game scroll
  gameScrollView: {
    flex: 1,
  },
  gameScrollContent: {
    paddingBottom: 100,
  },

  // Grid
  gridContent: {
    gap: spacing.xs,
    paddingBottom: spacing.sm,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 3,
  },

  // Search area
  searchArea: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.sm,
    gap: spacing.md,
  },
  dropdown: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  dropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  dropdownItemPressed: {
    backgroundColor: 'rgba(252,52,92,0.12)',
  },
  dropdownText: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 15,
    color: colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 48,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 15,
    color: colors.white,
    height: '100%' as any,
  },

  // Loading / error
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  errorText: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 15,
    color: '#9A9A9A',
    textAlign: 'center',
  },

  // Already played today
  alreadyPlayedWrapper: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.lg,
  },
  alreadyPlayedCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 24,
    padding: spacing['3xl'],
    alignItems: 'center',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  alreadyPlayedBadge: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 2,
    color: colors.brand,
    textAlign: 'center',
  },
  alreadyPlayedScore: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 72,
    color: colors.white,
    lineHeight: 78,
  },
  alreadyPlayedXpRow: {
    alignItems: 'center',
  },
  alreadyPlayedXpLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 2,
    color: '#9A9A9A',
  },
  alreadyPlayedXp: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 32,
    color: colors.brand,
    lineHeight: 38,
  },
  alreadyPlayedDivider: {
    width: '100%' as any,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: spacing.xs,
  },
  alreadyPlayedCta: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 18,
    color: colors.white,
    letterSpacing: 2,
    textAlign: 'center',
  },
  alreadyPlayedSub: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 13,
    color: '#9A9A9A',
    textAlign: 'center',
    lineHeight: 20,
  },

  // XP card
  xpCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  xpCardLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: '#9A9A9A',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  xpCardTotal: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 48,
    color: colors.brand,
    lineHeight: 54,
  },
  xpCardBreakdown: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 13,
    color: '#9A9A9A',
    marginTop: spacing.xs,
  },
  archiveNotice: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 13,
    color: '#9A9A9A',
    textAlign: 'center',
    marginTop: spacing.md,
    letterSpacing: 0.5,
  },
  postGameActions: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
});
