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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Search } from 'lucide-react-native';
import MidnightCountdown from '../../components/MidnightCountdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { brand, dark, light, fonts, colors, darkColors, fontFamily, spacing, radius } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import { getActivePlayers } from '../../lib/playersPool';
import { type NBAAttrs, type NFLAttrs, type MLBAttrs, type NHLAttrs, type PlayerAttrs, getLeagueAttrs } from '../../lib/playerAttrsDB';
import { NBA_ATTRS, NFL_ATTRS, MLB_ATTRS, NHL_ATTRS } from '../../lib/playerAttrs';
import GuessGridTile from '../../screens/components/ui/GuessGridTile';
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';
import PrimaryButton from '../../screens/components/ui/PrimaryButton';
import GhostButton from '../../screens/components/ui/GhostButton';
import { type Tab } from '../components/ui/BottomNav';
import { calculateDailyGameXP, saveGameResult, updateUserXPAndStreak } from '../../lib/xp';
import { supabase } from '../../lib/supabase';
import { getTodaysDailyGame, getArchiveGame } from '../../lib/dailyGames';
import { saveGameResult as saveCompletionResult, getGameResultToday, getTodayEST } from '../../lib/gameResults';
import { updatePlayHour } from '../../lib/notifications';
import { shareGuesser } from '../../lib/shareResults';
import { useGameAnalytics } from '../../lib/analytics';

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

// Positions excluded from Guesser — these make poor mystery players because
// fans can't distinguish them by the attributes shown (height/jersey/college/age).
const EXCLUDED_GUESSER_POSITIONS: Partial<Record<League, Set<string>>> = {
  NFL: new Set(['OT', 'OG', 'C', 'K', 'P']),
};

async function loadPlayerPool(league: League): Promise<string[]> {
  const [attrMap, players] = await Promise.all([
    getLeagueAttrs(league),
    getActivePlayers(league),
  ]);
  const excluded = EXCLUDED_GUESSER_POSITIONS[league];
  return players.map(p => p.name).filter(name => {
    if (!(name in attrMap)) return false;
    if (excluded) {
      const pos = (attrMap[name] as any).position;
      if (pos && excluded.has(pos)) return false;
    }
    return true;
  });
}


// Synchronous local-only lookup (used as fallback for mystery player supplementation)
function getPlayerAttrsLocal(name: string, league: League): PlayerAttrs | null {
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

// ── Display abbreviations for mobile tiles ──────────────────────────────────

const COUNTRY_ABBREV: Record<string, string> = {
  'USA': 'USA', 'Canada': 'CAN', 'Cuba': 'CUB', 'Dominican Republic': 'DOM',
  'Puerto Rico': 'PR', 'Venezuela': 'VEN', 'Colombia': 'COL', 'Brazil': 'BRA',
  'Japan': 'JPN', 'South Korea': 'KOR', 'China': 'CHN', 'Taiwan': 'TWN',
  'Germany': 'GER', 'Russia': 'RUS', 'Sweden': 'SWE', 'Finland': 'FIN',
  'Czechia': 'CZE', 'France': 'FRA', 'Slovenia': 'SVN', 'Serbia': 'SRB',
  'Greece': 'GRE', 'Spain': 'ESP', 'Lithuania': 'LTU', 'Latvia': 'LVA',
  'Croatia': 'CRO', 'Montenegro': 'MNE', 'Turkey': 'TUR', 'Switzerland': 'SUI',
  'Australia': 'AUS', 'New Zealand': 'NZL',
  'Cameroon': 'CMR', 'Nigeria': 'NGA', 'Congo': 'COG', 'Senegal': 'SEN',
  'South Sudan': 'SSD', 'Sudan': 'SDN', 'Mexico': 'MEX', 'Panama': 'PAN',
  'Nicaragua': 'NCA', 'Curacao': 'CUW', 'Aruba': 'ABW',
};

function abbreviateCountry(country: string): string {
  return COUNTRY_ABBREV[country] ?? country.slice(0, 3).toUpperCase();
}

function abbreviateHand(hand: string): string {
  if (hand === 'Left') return 'L';
  if (hand === 'Right') return 'R';
  if (hand === 'Switch') return 'S';
  return hand.charAt(0);
}

// Abbreviate MLB team: "Houston Astros" → "HOU"
const MLB_TEAM_ABBREV: Record<string, string> = {
  'Arizona Diamondbacks': 'ARI', 'Atlanta Braves': 'ATL', 'Baltimore Orioles': 'BAL',
  'Boston Red Sox': 'BOS', 'Chicago Cubs': 'CHC', 'Chicago White Sox': 'CWS',
  'Cincinnati Reds': 'CIN', 'Cleveland Guardians': 'CLE', 'Colorado Rockies': 'COL',
  'Detroit Tigers': 'DET', 'Houston Astros': 'HOU', 'Kansas City Royals': 'KC',
  'Los Angeles Angels': 'LAA', 'Los Angeles Dodgers': 'LAD', 'Miami Marlins': 'MIA',
  'Milwaukee Brewers': 'MIL', 'Minnesota Twins': 'MIN', 'New York Mets': 'NYM',
  'New York Yankees': 'NYY', 'Oakland Athletics': 'OAK', 'Philadelphia Phillies': 'PHI',
  'Pittsburgh Pirates': 'PIT', 'San Diego Padres': 'SD', 'San Francisco Giants': 'SF',
  'Seattle Mariners': 'SEA', 'St. Louis Cardinals': 'STL', 'Tampa Bay Rays': 'TB',
  'Texas Rangers': 'TEX', 'Toronto Blue Jays': 'TOR', 'Washington Nationals': 'WSH',
};

// Abbreviate NHL team: "Toronto Maple Leafs" → "TOR"
const NHL_TEAM_ABBREV: Record<string, string> = {
  'Anaheim Ducks': 'ANA', 'Arizona Coyotes': 'ARI', 'Boston Bruins': 'BOS',
  'Buffalo Sabres': 'BUF', 'Calgary Flames': 'CGY', 'Carolina Hurricanes': 'CAR',
  'Chicago Blackhawks': 'CHI', 'Colorado Avalanche': 'COL', 'Columbus Blue Jackets': 'CBJ',
  'Dallas Stars': 'DAL', 'Detroit Red Wings': 'DET', 'Edmonton Oilers': 'EDM',
  'Florida Panthers': 'FLA', 'Los Angeles Kings': 'LAK', 'Minnesota Wild': 'MIN',
  'Montreal Canadiens': 'MTL', 'Nashville Predators': 'NSH', 'New Jersey Devils': 'NJD',
  'New York Islanders': 'NYI', 'New York Rangers': 'NYR', 'Ottawa Senators': 'OTT',
  'Philadelphia Flyers': 'PHI', 'Pittsburgh Penguins': 'PIT', 'San Jose Sharks': 'SJS',
  'Seattle Kraken': 'SEA', 'St. Louis Blues': 'STL', 'Tampa Bay Lightning': 'TBL',
  'Toronto Maple Leafs': 'TOR', 'Utah Hockey Club': 'UTA', 'Vancouver Canucks': 'VAN',
  'Vegas Golden Knights': 'VGK', 'Washington Capitals': 'WSH', 'Winnipeg Jets': 'WPG',
};

// Abbreviate NFL team: "Kansas City Chiefs" → "KC"
const NFL_TEAM_ABBREV: Record<string, string> = {
  'Arizona Cardinals': 'ARI', 'Atlanta Falcons': 'ATL', 'Baltimore Ravens': 'BAL',
  'Buffalo Bills': 'BUF', 'Carolina Panthers': 'CAR', 'Chicago Bears': 'CHI',
  'Cincinnati Bengals': 'CIN', 'Cleveland Browns': 'CLE', 'Dallas Cowboys': 'DAL',
  'Denver Broncos': 'DEN', 'Detroit Lions': 'DET', 'Green Bay Packers': 'GB',
  'Houston Texans': 'HOU', 'Indianapolis Colts': 'IND', 'Jacksonville Jaguars': 'JAX',
  'Kansas City Chiefs': 'KC', 'Las Vegas Raiders': 'LV', 'Los Angeles Chargers': 'LAC',
  'Los Angeles Rams': 'LAR', 'Miami Dolphins': 'MIA', 'Minnesota Vikings': 'MIN',
  'New England Patriots': 'NE', 'New Orleans Saints': 'NO', 'New York Giants': 'NYG',
  'New York Jets': 'NYJ', 'Philadelphia Eagles': 'PHI', 'Pittsburgh Steelers': 'PIT',
  'San Francisco 49ers': 'SF', 'Seattle Seahawks': 'SEA', 'Tampa Bay Buccaneers': 'TB',
  'Tennessee Titans': 'TEN', 'Washington Commanders': 'WSH',
};

function abbreviateTeam(team: string, league: League): string {
  if (league === 'NBA') return team; // NBA already uses 3-letter codes in attrs
  if (league === 'MLB') return MLB_TEAM_ABBREV[team] ?? team;
  if (league === 'NHL') return NHL_TEAM_ABBREV[team] ?? team;
  if (league === 'NFL') return NFL_TEAM_ABBREV[team] ?? team;
  return team;
}

// Division: "AL West" → "AL\nWest", "NL Central" → "NL\nCEN"
function abbreviateDivision(div: string): string {
  const parts = div.split(' ');
  if (parts.length === 2) {
    const league = parts[0]; // AL or NL
    let region = parts[1];
    if (region === 'Central') region = 'CEN';
    return `${league}\n${region}`;
  }
  return div;
}

// Conference: "Western" → "West", "Eastern" → "East"
function abbreviateConference(conf: string): string {
  if (conf === 'Western') return 'West';
  if (conf === 'Eastern') return 'East';
  return conf;
}

function isSameContinent(a: string, b: string): boolean {
  const ca = CONTINENT_MAP[a] ?? a;
  const cb = CONTINENT_MAP[b] ?? b;
  return ca === cb && ca !== a; // only match if actually mapped
}

// ── College → Conference mapping (2024-25 alignments) ───────────────────────

const COLLEGE_CONFERENCE: Record<string, string> = {
  // SEC
  'Alabama': 'SEC', 'Arkansas': 'SEC', 'Auburn': 'SEC', 'Florida': 'SEC',
  'Georgia': 'SEC', 'Kentucky': 'SEC', 'LSU': 'SEC', 'Mississippi': 'SEC',
  'Mississippi State': 'SEC', 'Missouri': 'SEC', 'Oklahoma': 'SEC',
  'South Carolina': 'SEC', 'Tennessee': 'SEC', 'Texas': 'SEC',
  'Texas A&M': 'SEC', 'Vanderbilt': 'SEC',
  // Big Ten
  'Illinois': 'Big Ten', 'Indiana': 'Big Ten', 'Iowa': 'Big Ten',
  'Maryland': 'Big Ten', 'Michigan': 'Big Ten', 'Michigan State': 'Big Ten',
  'Nebraska': 'Big Ten', 'Ohio State': 'Big Ten', 'Oregon': 'Big Ten',
  'Penn State': 'Big Ten', 'Purdue': 'Big Ten', 'Rutgers': 'Big Ten',
  'UCLA': 'Big Ten', 'USC': 'Big Ten', 'Washington': 'Big Ten',
  'Wisconsin': 'Big Ten',
  // ACC
  'Boston College': 'ACC', 'California': 'ACC', 'Clemson': 'ACC',
  'Duke': 'ACC', 'Florida State': 'ACC', 'Louisville': 'ACC',
  'Miami (FL)': 'ACC', 'North Carolina': 'ACC', 'Notre Dame': 'ACC',
  'Pittsburgh': 'ACC', 'SMU': 'ACC', 'Stanford': 'ACC', 'Syracuse': 'ACC',
  'Virginia': 'ACC', 'Wake Forest': 'ACC',
  // Big 12
  'Arizona': 'Big 12', 'Arizona State': 'Big 12', 'Baylor': 'Big 12',
  'BYU': 'Big 12', 'Cincinnati': 'Big 12', 'Colorado': 'Big 12',
  'Houston': 'Big 12', 'Iowa State': 'Big 12', 'Kansas': 'Big 12',
  'Kansas State': 'Big 12', 'Oklahoma State': 'Big 12', 'TCU': 'Big 12',
  'Texas Tech': 'Big 12', 'Utah': 'Big 12', 'West Virginia': 'Big 12',
  // Mountain West
  'Colorado State': 'Mountain West', 'Fresno State': 'Mountain West',
  'San Diego State': 'Mountain West', 'Utah State': 'Mountain West',
  'Wyoming': 'Mountain West',
  // Big East
  'Marquette': 'Big East', 'Villanova': 'Big East',
  // American Athletic
  'East Carolina': 'AAC', 'Memphis': 'AAC', 'Temple': 'AAC',
  'Tulane': 'AAC', 'UTEP': 'AAC', 'Wichita State': 'AAC',
  // West Coast
  'Gonzaga': 'WCC', 'Santa Clara': 'WCC',
  // Missouri Valley / FCS
  'Murray State': 'MVC', 'North Dakota State': 'MVC',
  'South Dakota State': 'MVC',
  // Big Sky
  'Eastern Washington': 'Big Sky', 'Weber State': 'Big Sky',
  // MAC
  'Eastern Michigan': 'MAC', 'Toledo': 'MAC',
  // Sun Belt
  'Arkansas State': 'Sun Belt',
  // Pac-12 (remnant)
  'Oregon State': 'Pac-12', 'Washington State': 'Pac-12',
  // A-10
  'Davidson': 'A-10',
  // Independents / Other
  'Middle Tennessee': 'CUSA', 'Lehigh': 'Patriot',
};

function getCollegeConference(college: string | undefined): string | null {
  if (!college) return null;
  return COLLEGE_CONFERENCE[college] ?? null;
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

  // Coerce numeric comparisons — DB may store numbers as strings
  const numericAttrs = ['age', 'jersey', 'height'];
  if (numericAttrs.includes(attribute) && typeof guessVal === 'number' && typeof mysteryVal === 'string') {
    mysteryVal = Number(mysteryVal);
  } else if (numericAttrs.includes(attribute) && typeof guessVal === 'string' && typeof mysteryVal === 'number') {
    guessVal = Number(guessVal);
  }

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
    if (Math.abs(diff) <= 2) return diff > 0 ? 'close_higher' : 'close_lower';
    return diff > 0 ? 'higher' : 'lower';
  }

  if (attribute === 'jersey') {
    const g = guessVal as number;
    const m = mysteryVal as number;
    const diff = m - g;
    if (Math.abs(diff) <= 5) return 'close';
    return diff > 0 ? 'higher' : 'lower';
  }

  if (attribute === 'conference') {
    return 'close';
  }

  if (attribute === 'division') {
    // Yellow only if same conference (e.g. "NL East" vs "NL West" → yellow, "NL East" vs "AL East" → wrong)
    const guessConf = (guessVal as string).split(' ')[0];
    const mysteryConf = (mysteryVal as string).split(' ')[0];
    return guessConf === mysteryConf ? 'close' : 'wrong';
  }

  if (attribute === 'college') {
    const guessConf = getCollegeConference(guessVal as string);
    const mysteryConf = getCollegeConference(mysteryVal as string);
    if (guessConf && mysteryConf && guessConf === mysteryConf) return 'close';
    return 'wrong';
  }

  if (attribute === 'country') {
    return 'wrong';
  }

  // Position grouping — yellow if same position group, gray if different group
  if (attribute === 'position') {
    const g = String(guessVal);
    const m = String(mysteryVal);
    const group = (pos: string): string => {
      // NFL groups
      if (['CB', 'S'].includes(pos)) return 'DB';
      if (['EDGE', 'DT'].includes(pos)) return 'DL';
      if (['OT', 'OG', 'C'].includes(pos)) return 'OL';
      // NBA groups
      if (['PG', 'SG'].includes(pos)) return 'Guard';
      if (['SF', 'PF'].includes(pos)) return 'Forward';
      // MLB groups
      if (['LF', 'CF', 'RF'].includes(pos)) return 'OF';
      if (['1B', '2B', '3B', 'SS'].includes(pos)) return 'IF';
      if (['SP', 'RP'].includes(pos)) return 'P';
      // NHL groups
      if (['LW', 'RW'].includes(pos)) return 'Wing';
      return pos;
    };
    return group(g) === group(m) ? 'close' : 'wrong';
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
  const suffixes = new Set(['Jr.', 'Sr.', 'II', 'III', 'IV', 'V']);
  const parts = guessName.split(' ');
  const lastPart = parts[parts.length - 1];
  const nameDisplay = parts.length > 1 && suffixes.has(lastPart)
    ? parts.slice(-2).join(' ')
    : lastPart;

  if (league === 'MLB') {
    const g = guessAttrs as MLBAttrs;
    return [
      { value: nameDisplay, state: nameState },
      { value: abbreviateHand(g.bat), state: compareTile(g.bat, mystery.bat, 'bat') },
      { value: abbreviateHand(g.throwing), state: compareTile(g.throwing, mystery.throwing, 'throwing') },
      { value: abbreviateCountry(g.country), state: compareTile(g.country, mystery.country, 'country') },
      { value: abbreviateTeam(g.team, 'MLB'), state: compareTile(g.team, mystery.team, 'team') },
      { value: g.position, state: compareTile(g.position, mystery.position, 'position') },
      { value: abbreviateDivision(g.division), state: compareTile(g.division, mystery.division, 'division') },
      { value: String(g.age), state: compareTile(g.age, mystery.age, 'age') },
    ];
  }

  // NBA, NFL, NHL all share: height, jersey, team, position, conference, (college|country), age
  const g = guessAttrs as NBAAttrs | NFLAttrs | NHLAttrs;
  const gHeight = parseHeightToInches(g.height);
  const mHeight = mystery.height ? parseHeightToInches(mystery.height) : 0;
  // NBA uses 3-letter team codes in playerAttrs; expand to full name for comparison
  const gTeam = league === 'NBA' ? expandNBATeam(g.team) : g.team;
  // Display team as abbreviation
  const gTeamDisplay = league === 'NBA' ? g.team : abbreviateTeam(g.team, league);

  const sixthCol = league === 'NHL'
    ? { value: abbreviateCountry((g as NHLAttrs).country), state: compareTile((g as NHLAttrs).country, mystery.country, 'country') }
    : { value: (g as NBAAttrs | NFLAttrs).college, state: compareTile((g as NBAAttrs | NFLAttrs).college, mystery.college, 'college') };

  return [
    { value: nameDisplay, state: nameState },
    { value: formatHeight(gHeight), state: compareTile(gHeight, mHeight, 'height') },
    { value: `#${g.jersey}`, state: compareTile(g.jersey, mystery.jersey, 'jersey') },
    { value: gTeamDisplay, state: compareTile(gTeam, mystery.team, 'team') },
    { value: g.position, state: compareTile(g.position, mystery.position, 'position') },
    { value: abbreviateConference(g.conference), state: compareTile(g.conference, mystery.conference, 'conference') },
    sixthCol,
    { value: String(g.age), state: compareTile(g.age, mystery.age, 'age') },
  ];
}

// ── Component ────────────────────────────────────────────────────────────────

export default function PlayerGuessScreen({ onBack, archiveDate }: Props) {
  const isArchive = !!archiveDate;
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const s = createStyles(isDark);
  const { trackGameStart, trackGameComplete, trackGameAbandoned } = useGameAnalytics();
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
  const [attrsMap, setAttrsMap] = useState<Record<string, PlayerAttrs>>({});

  useEffect(() => {
    trackGameStart('player-guess', activeLeague);
  }, [activeLeague]);

  useEffect(() => {
    loadPlayerPool(activeLeague).then(setPlayerPool);
    getLeagueAttrs(activeLeague).then(setAttrsMap);
  }, [activeLeague]);

  // ── AsyncStorage persistence helpers ──────────────────────────────────────
  const getStorageKey = useCallback((league: League) => {
    const today = getTodayEST();
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
    let isMounted = true;
    void Promise.all([fetchGame, fetchResult]).then(async ([data, priorResult]) => {
      if (!isMounted) return;
      setIsLoading(false);
      if (!isArchive) setPlayedTodayCache(prev => ({ ...prev, [activeLeague]: priorResult }));
      if (!data?.mystery_player) { setLoadError(true); return; }
      const raw = data.mystery_player;

      // Build MysteryPlayer from the raw jsonb data
      // Normalize single-letter hand codes ('L','R','S') to full words to match MLB_ATTRS format
      const expandHand = (h?: string): string | undefined => {
        if (!h) return undefined;
        if (h === 'L') return 'Left';
        if (h === 'R') return 'Right';
        if (h === 'S') return 'Switch';
        return h; // already full word
      };
      const mp: MysteryPlayer = {
        name: raw.name,
        team: raw.team ?? '',
        position: raw.position ?? '',
        height: raw.height,
        jersey: raw.jerseyNumber,
        conference: raw.conference,
        college: raw.college,
        age: raw.age,
        bat: expandHand(raw.battingHand ?? raw.bat),
        throwing: expandHand(raw.throwingHand ?? raw.throwing),
        country: raw.country,
        division: raw.division,
      };

      // Supplement any missing attrs from the local playerAttrs cache.
      // Auto-generated games may only store name/team/position in the DB;
      // the local tables have full attribute data for all known players.
      const localAttrs = getPlayerAttrsLocal(raw.name, activeLeague);
      if (localAttrs) {
        if (activeLeague === 'MLB') {
          const a = localAttrs as MLBAttrs;
          if (!mp.bat) mp.bat = expandHand(a.bat);
          if (!mp.throwing) mp.throwing = expandHand(a.throwing);
          if (!mp.country) mp.country = a.country;
          if (!mp.division) mp.division = a.division;
          if (!mp.position) mp.position = a.position;
          if (!mp.team) mp.team = a.team;
          if (mp.age == null) mp.age = a.age;
        } else if (activeLeague === 'NBA') {
          const a = localAttrs as NBAAttrs;
          if (!mp.height) mp.height = a.height;
          if (mp.jersey == null) mp.jersey = a.jersey;
          if (!mp.conference) mp.conference = a.conference;
          if (!mp.college) mp.college = a.college;
          if (!mp.position) mp.position = a.position;
          if (!mp.team) mp.team = a.team;
          if (mp.age == null) mp.age = a.age;
        } else if (activeLeague === 'NFL') {
          const a = localAttrs as NFLAttrs;
          if (!mp.height) mp.height = a.height;
          if (mp.jersey == null) mp.jersey = a.jersey;
          if (!mp.conference) mp.conference = a.conference;
          if (!mp.college) mp.college = a.college;
          if (!mp.position) mp.position = a.position;
          if (!mp.team) mp.team = a.team;
          if (mp.age == null) mp.age = a.age;
        } else if (activeLeague === 'NHL') {
          const a = localAttrs as NHLAttrs;
          if (!mp.height) mp.height = a.height;
          if (mp.jersey == null) mp.jersey = a.jersey;
          if (!mp.country) mp.country = a.country;
          if (!mp.conference) mp.conference = a.conference;
          if (!mp.position) mp.position = a.position;
          if (!mp.team) mp.team = a.team;
          if (mp.age == null) mp.age = a.age;
        }
      }

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
    return () => { isMounted = false; };
  }, [activeLeague]);

  const cols = LEAGUE_COLS[activeLeague];

  const [debouncedSearchText, setDebouncedSearchText] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchText(searchText), 200);
    return () => clearTimeout(timer);
  }, [searchText]);

  const searchResults =
    debouncedSearchText.length >= 2
      ? playerPool
          .filter(
            name =>
              name.toLowerCase().includes(debouncedSearchText.toLowerCase()) &&
              !guessedNames.has(name),
          )
          .slice(0, 8)
      : [];

  const submitGuess = (playerName: string) => {
    if (!mystery) return;
    const attrs = attrsMap[playerName] ?? null;
    if (!attrs) return;

    const row = evaluateGuessForLeague(attrs, playerName, mystery, activeLeague);

    // If the player name matches the mystery player, force ALL tiles to 'correct'.
    // This prevents data discrepancies between DB and local attrs from blocking a win.
    const isCorrectPlayer = playerName === mystery.name;
    if (isCorrectPlayer) {
      row.forEach(tile => { tile.state = 'correct'; });
    }

    const newGuesses = [...guesses, row];
    setGuesses(newGuesses);
    setGuessedNames(prev => new Set(prev).add(playerName));
    setSearchText('');
    setShowDropdown(false);

    const won = isCorrectPlayer || row.every(t => t.state === 'correct');
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
      trackGameComplete('player-guess', activeLeague, won ? newGuesses.length : 0, xp);
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
    <View style={s.root}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* ── Zone 1 ── */}
        <View style={[s.zone1, { paddingTop: insets.top + 16, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }]}>
          {/* Back button row */}
          <View style={s.zone1TopRow}>
            <Pressable onPress={() => { if (gameState === 'playing') trackGameAbandoned('player-guess', activeLeague); onBack(); }} hitSlop={8} style={s.backBtn}>
              <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
            </Pressable>
          </View>

          {/* Title block */}
          <View style={s.zone1Center}>
            <Text style={s.zone1Title}>MYSTERY PLAYER</Text>
            <Text style={s.zone1Sub}>Guess the mystery athlete in {MAX_GUESSES} tries</Text>

            {/* Guess counter */}
            <View style={s.counterRow}>
              <Text style={s.counterCurrent}>{guesses.length}</Text>
              <Text style={s.counterDivider}> / </Text>
              <Text style={s.counterTotal}>{MAX_GUESSES}</Text>
            </View>
          </View>

          {/* League switcher / Archive banner */}
          {isArchive ? (
            <View style={s.archiveBanner}>
              <Text style={s.archiveBannerText}>ARCHIVE — {archiveDate}</Text>
            </View>
          ) : (
            <View style={s.leagueSwitcherRow}>
              <LeagueSwitcher selected={activeLeague} onChange={l => setActiveLeague(l as League)} />
            </View>
          )}

          {/* Bottom fade overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={s.zone1Gradient}
            pointerEvents="none"
          />
        </View>

        {/* ── Zone 2 ── */}
        <View style={s.zone2}>
          {isLoading ? (
            <View style={s.centerState}>
              <ActivityIndicator size="large" color={brand.primary} />
            </View>
          ) : (loadError || !mystery) ? (
            <View style={s.centerState}>
              <Text style={s.errorText}>No game available today</Text>
            </View>
          ) : (!isArchive && playedTodayCache[activeLeague]) ? (
            <View style={s.alreadyPlayedWrapper}>
              <View style={s.alreadyPlayedCard}>
                <Text style={s.alreadyPlayedBadge}>ALREADY PLAYED TODAY</Text>
                <Text style={s.alreadyPlayedScore}>{playedTodayCache[activeLeague]!.score}</Text>
                <View style={s.alreadyPlayedXpRow}>
                  <Text style={s.alreadyPlayedXpLabel}>XP EARNED</Text>
                  <Text style={s.alreadyPlayedXp}>+{playedTodayCache[activeLeague]!.xp}</Text>
                </View>
                <View style={s.alreadyPlayedDivider} />
                <Text style={s.alreadyPlayedCta}>COME BACK TOMORROW</Text>
                <Text style={s.alreadyPlayedSub}>A new game drops every day. Switch leagues to play more.</Text>
                <MidnightCountdown />
                <GhostButton label="VIEW ARCHIVE" onPress={() => onNavigate('archive' as Tab)} />
              </View>
            </View>
          ) : (<>
          {/* Column headers */}
          <View style={s.headerRow}>
            {cols.map((col, i) => (
              <View key={col} style={[s.headerCell, { flex: i === 0 ? 2 : 1 }]}>
                <Text style={s.headerText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{col}</Text>
              </View>
            ))}
          </View>

          {/* Result banner */}
          {gameState === 'won' && (
            <View style={s.banner}>
              <Text style={s.bannerText} numberOfLines={2}>You got it! {mystery.name}</Text>
            </View>
          )}
          {gameState === 'lost' && (
            <View style={[s.banner, s.bannerLost]}>
              <Text style={s.bannerText} numberOfLines={2}>The answer was {mystery.name}</Text>
            </View>
          )}

          {/* XP card */}
          {xpEarned !== null && !isArchive && (
            <View style={s.xpCard}>
              <Text style={s.xpCardLabel}>XP EARNED</Text>
              <Text style={s.xpCardTotal}>+{xpEarned}</Text>
              <Text style={s.xpCardBreakdown}>
                Base: 500 XP + Bonus: {xpEarned - 500} XP
              </Text>
            </View>
          )}
          {isArchive && gameState !== 'playing' && (
            <Text style={s.archiveNotice}>ARCHIVE MODE — Results not saved</Text>
          )}

          {/* Post-game actions (daily only) */}
          {!isArchive && gameState !== 'playing' && (
            <>
              <MidnightCountdown />
              <View style={s.postGameActions}>
                <PrimaryButton label="PLAY ANOTHER DAILY GAME" onPress={onBack} />
                <Pressable
                  style={({ pressed }) => [s.shareBtn, pressed && s.shareBtnPressed]}
                  onPress={() => shareGuesser(activeLeague, gameState === 'won', guesses.length, MAX_GUESSES)}
                >
                  <Text style={s.shareBtnText}>SHARE RESULTS</Text>
                </Pressable>
                {/* Notify Friends button */}
                <Pressable
                  onPress={() => { void (async () => {
                    setNotifyState('sending');
                    setNotifyState('done');
                    setTimeout(() => setNotifyState('idle'), 3000);
                  })(); }}
                >
                  </Text>
                </Pressable>
                <GhostButton label="PLAY ARCHIVE" onPress={() => onNavigate('archive' as Tab)} />
              </View>
            </>
          )}

          {/* Guess grid */}
          <View style={s.gridContent}>
            {guesses.map((row, i) => {
              const isNewest = i === guesses.length - 1;
              return (
                <View key={i} style={s.gridRow}>
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
            <View style={s.searchArea}>
              {/* Dropdown (above search bar) */}
              {showDropdown && searchResults.length > 0 && (
                <View style={s.dropdown}>
                  {searchResults.map((name, i) => (
                    <Pressable
                      key={name}
                      onPress={() => submitGuess(name)}
                      style={({ pressed }) => [
                        s.dropdownItem,
                        i < searchResults.length - 1 && s.dropdownItemBorder,
                        pressed && s.dropdownItemPressed,
                      ]}
                    >
                      <Text style={s.dropdownText} numberOfLines={1}>{name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              {/* Search bar */}
              <View style={s.searchBar}>
                <Search size={18} color={isDark ? dark.textSecondary : light.textSecondary} strokeWidth={2} />
                <TextInput
                  style={s.searchInput}
                  placeholder="Search for a player..."
                  placeholderTextColor={isDark ? dark.textSecondary : light.textSecondary}
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
          </>
          )}
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

function createStyles(isDark: boolean) {
  const txt = isDark ? dark.textPrimary : light.textPrimary;
  const txtSec = isDark ? dark.textSecondary : light.textSecondary;
  const cardBg = isDark ? dark.card : light.card;
  const surfaceBg = isDark ? dark.surface : light.surface;
  const borderCol = isDark ? dark.cardBorder : light.cardBorder;
  const dividerCol = isDark ? dark.divider : light.divider;
  const inputBg = isDark ? dark.inputBg : light.inputBg;

  return StyleSheet.create({
    root: { flex: 1, backgroundColor: 'transparent' },
    flex: { flex: 1 },

    // Zone 1
    zone1: { backgroundColor: brand.primary, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
    zone1TopRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
    backBtn: { padding: spacing.sm, marginLeft: -spacing.sm },
    zone1Center: { alignItems: 'center', marginTop: spacing.xs },
    zone1Title: { fontFamily: fonts.display, fontSize: 26, color: '#FFFFFF', letterSpacing: 3, textAlign: 'center' },
    zone1Sub: { fontFamily: fonts.bodyMedium, fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 4, textAlign: 'center' },
    counterRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: spacing.sm },
    counterCurrent: { fontFamily: fonts.display, fontSize: 36, color: '#FFFFFF', lineHeight: 40 },
    counterDivider: { fontFamily: fonts.bodyMedium, fontSize: 22, color: 'rgba(255,255,255,0.45)' },
    counterTotal: { fontFamily: fonts.display, fontSize: 22, color: 'rgba(255,255,255,0.55)' },
    leagueSwitcherRow: { marginTop: spacing.md },
    archiveBanner: { marginTop: spacing.md, backgroundColor: 'rgba(0,0,0,0.20)', borderRadius: 8, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, alignItems: 'center' },
    archiveBannerText: { fontFamily: fonts.bodySemiBold, fontSize: 11, color: 'rgba(255,255,255,0.80)', letterSpacing: 1.5 },
    zone1Gradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 40 },

    // Zone 2
    zone2: { flex: 1, backgroundColor: 'transparent', paddingHorizontal: spacing.sm, paddingTop: spacing.lg },

    // Column headers
    headerRow: { flexDirection: 'row', marginBottom: spacing.sm, gap: 3 },
    headerCell: { alignItems: 'center' },
    headerText: { fontFamily: fonts.bodySemiBold, fontSize: 8, letterSpacing: 0.5, color: colors.accentCyan, textAlign: 'center' },

    // Result banner
    banner: { backgroundColor: colors.accentGreen, borderRadius: radius.primary, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, marginBottom: spacing.md, alignItems: 'center' },
    bannerLost: { backgroundColor: colors.accentRed },
    bannerText: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: '#FFFFFF', textAlign: 'center' },

    // Outer game scroll
    gameScrollView: { flex: 1 },
    gameScrollContent: { paddingBottom: 0 },

    // Grid
    gridContent: { gap: spacing.xs, paddingBottom: spacing.sm },
    gridRow: { flexDirection: 'row', gap: 3 },

    // Search area
    searchArea: { paddingTop: spacing.md, paddingHorizontal: spacing.sm, gap: spacing.md },
    dropdown: { backgroundColor: cardBg, borderRadius: radius.primary, borderWidth: 1, borderColor: borderCol, overflow: 'hidden' },
    dropdownItem: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
    dropdownItemBorder: { borderBottomWidth: 1, borderBottomColor: dividerCol },
    dropdownItemPressed: { backgroundColor: colors.brandAlpha15 },
    dropdownText: { fontFamily: fonts.bodyMedium, fontSize: 15, color: txt },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: inputBg, borderRadius: radius.primary, paddingHorizontal: spacing.md, height: 48, gap: spacing.sm, borderWidth: 1, borderColor: isDark ? dark.inputBorder : light.inputBorder },
    searchInput: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 15, color: txt, height: '100%' as any },

    // Loading / error
    centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
    errorText: { fontFamily: fonts.bodyMedium, fontSize: 15, color: txtSec, textAlign: 'center' },

    // Already played
    alreadyPlayedWrapper: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing['2xl'], paddingBottom: 120 },
    alreadyPlayedCard: { backgroundColor: cardBg, borderRadius: 24, padding: spacing['3xl'], alignItems: 'center', gap: spacing.md, borderWidth: 1, borderColor: borderCol },
    alreadyPlayedBadge: { fontFamily: fonts.bodySemiBold, fontSize: 10, letterSpacing: 2, color: brand.primary, textAlign: 'center' },
    alreadyPlayedScore: { fontFamily: fonts.display, fontSize: 72, color: txt, lineHeight: 78 },
    alreadyPlayedXpRow: { alignItems: 'center' },
    alreadyPlayedXpLabel: { fontFamily: fonts.bodySemiBold, fontSize: 10, letterSpacing: 2, color: txtSec },
    alreadyPlayedXp: { fontFamily: fonts.display, fontSize: 32, color: brand.primary, lineHeight: 38 },
    alreadyPlayedDivider: { width: '100%' as any, height: 1, backgroundColor: dividerCol, marginVertical: spacing.xs },
    alreadyPlayedCta: { fontFamily: fonts.display, fontSize: 18, color: txt, letterSpacing: 2, textAlign: 'center' },
    alreadyPlayedSub: { fontFamily: fonts.bodyMedium, fontSize: 13, color: txtSec, textAlign: 'center', lineHeight: 20 },

    // XP card
    xpCard: { backgroundColor: cardBg, borderRadius: radius.primary, paddingVertical: spacing.xl, paddingHorizontal: spacing.lg, alignItems: 'center', marginBottom: spacing.md, borderWidth: 1, borderColor: borderCol },
    xpCardLabel: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: txtSec, letterSpacing: 1, marginBottom: spacing.xs },
    xpCardTotal: { fontFamily: fonts.display, fontSize: 48, color: brand.primary, lineHeight: 54 },
    xpCardBreakdown: { fontFamily: fonts.bodyMedium, fontSize: 13, color: txtSec, marginTop: spacing.xs },
    archiveNotice: { fontFamily: fonts.bodyMedium, fontSize: 13, color: txtSec, textAlign: 'center', marginTop: spacing.md, letterSpacing: 0.5 },
    postGameActions: { gap: spacing.md, marginBottom: spacing.lg },
    shareBtn: { backgroundColor: cardBg, borderRadius: radius.primary, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center', minHeight: 48, borderWidth: 1, borderColor: borderCol },
    shareBtnPressed: { opacity: 0.7 },
    shareBtnText: { fontFamily: fonts.bodySemiBold, fontSize: 13, letterSpacing: 1.5, color: txt },
  });
}

const styles = createStyles(true);
