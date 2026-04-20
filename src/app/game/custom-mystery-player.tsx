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
import { brand, dark, light, colors, darkColors, fonts, fontFamily, spacing } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import { getActivePlayers } from '../../lib/playersPool';
import GuessGridTile from '../../screens/components/ui/GuessGridTile';
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';
import RoundProgressDots from '../../screens/components/ui/RoundProgressDots';
import PrimaryButton from '../../screens/components/ui/PrimaryButton';
import GhostButton from '../../screens/components/ui/GhostButton';
import ParticleBurst from '../../components/ParticleBurst';

// ── Types ────────────────────────────────────────────────────────────────────

type TileState = 'empty' | 'correct' | 'close' | 'wrong' | 'higher' | 'lower' | 'close_higher' | 'close_lower';

interface TileData {
  value: string;
  state: TileState;
}

type League = 'NBA' | 'NFL' | 'MLB' | 'NHL';

// ── Player Pool (autocomplete names from central pool) ──────────────────────

async function getPlayerPool(league: League): Promise<string[]> {
  const players = await getActivePlayers(league);
  return players.map(p => p.name);
}

// ── Player Attributes (full data for every pool player) ──────────────────────

interface NBAAttrs { height: string; jersey: number; team: string; position: string; conference: string; college: string; age: number }
interface NFLAttrs { height: string; jersey: number; team: string; position: string; conference: string; college: string; age: number }
interface MLBAttrs { bat: string; throwing: string; country: string; college?: string; team: string; position: string; division: string; age: number }
interface NHLAttrs { height: string; jersey: number; team: string; position: string; conference: string; country: string; age: number }
type PlayerAttrs = NBAAttrs | NFLAttrs | MLBAttrs | NHLAttrs;

const NBA_ATTRS: Record<string, NBAAttrs> = {
  'LeBron James':             { height: "6'9\"",  jersey: 23, team: 'Los Angeles Lakers',      position: 'SF', conference: 'Western', college: 'None (HS)',    age: 40 },
  'Stephen Curry':            { height: "6'2\"",  jersey: 30, team: 'Golden State Warriors',   position: 'PG', conference: 'Western', college: 'Davidson',     age: 37 },
  'Kevin Durant':             { height: "6'10\"", jersey: 35, team: 'Phoenix Suns',            position: 'SF', conference: 'Western', college: 'Texas',        age: 36 },
  'Giannis Antetokounmpo':   { height: "6'11\"", jersey: 34, team: 'Milwaukee Bucks',         position: 'PF', conference: 'Eastern', college: 'Greece (intl)', age: 30 },
  'Nikola Jokic':             { height: "6'11\"", jersey: 15, team: 'Denver Nuggets',          position: 'C',  conference: 'Western', college: 'Serbia (intl)', age: 30 },
  'Luka Doncic':              { height: "6'7\"",  jersey: 77, team: 'Dallas Mavericks',        position: 'PG', conference: 'Western', college: 'Slovenia (intl)', age: 26 },
  'Joel Embiid':              { height: "7'0\"",  jersey: 21, team: 'Philadelphia 76ers',      position: 'C',  conference: 'Eastern', college: 'Kansas',       age: 31 },
  'Jayson Tatum':             { height: "6'8\"",  jersey: 0,  team: 'Boston Celtics',          position: 'SF', conference: 'Eastern', college: 'Duke',         age: 27 },
  'Damian Lillard':           { height: "6'2\"",  jersey: 0,  team: 'Milwaukee Bucks',         position: 'PG', conference: 'Eastern', college: 'Weber State',  age: 35 },
  'Anthony Davis':            { height: "6'10\"", jersey: 3,  team: 'Los Angeles Lakers',      position: 'PF', conference: 'Western', college: 'Kentucky',     age: 32 },
  'Shai Gilgeous-Alexander':  { height: "6'6\"",  jersey: 2,  team: 'Oklahoma City Thunder',   position: 'SG', conference: 'Western', college: 'Kentucky',     age: 26 },
  'Victor Wembanyama':        { height: "7'4\"",  jersey: 1,  team: 'San Antonio Spurs',       position: 'C',  conference: 'Western', college: 'France (intl)', age: 21 },
  'Anthony Edwards':          { height: "6'4\"",  jersey: 5,  team: 'Minnesota Timberwolves',  position: 'SG', conference: 'Western', college: 'Georgia',      age: 23 },
  'Ja Morant':                { height: "6'3\"",  jersey: 12, team: 'Memphis Grizzlies',       position: 'PG', conference: 'Western', college: 'Murray State', age: 25 },
  'Devin Booker':             { height: "6'5\"",  jersey: 1,  team: 'Phoenix Suns',            position: 'SG', conference: 'Western', college: 'Kentucky',     age: 28 },
  'Karl-Anthony Towns':       { height: "6'11\"", jersey: 32, team: 'New York Knicks',         position: 'C',  conference: 'Eastern', college: 'Kentucky',     age: 29 },
  'Bam Adebayo':              { height: "6'9\"",  jersey: 13, team: 'Miami Heat',              position: 'C',  conference: 'Eastern', college: 'Kentucky',     age: 27 },
  'Jaylen Brown':             { height: "6'6\"",  jersey: 7,  team: 'Boston Celtics',          position: 'SG', conference: 'Eastern', college: 'Cal',          age: 28 },
  'Donovan Mitchell':         { height: "6'1\"",  jersey: 45, team: 'Cleveland Cavaliers',     position: 'SG', conference: 'Eastern', college: 'Louisville',   age: 28 },
  'Trae Young':               { height: "6'1\"",  jersey: 11, team: 'Atlanta Hawks',           position: 'PG', conference: 'Eastern', college: 'Oklahoma',     age: 26 },
  'Tyrese Haliburton':        { height: "6'5\"",  jersey: 0,  team: 'Indiana Pacers',          position: 'PG', conference: 'Eastern', college: 'Iowa State',   age: 25 },
  'Zion Williamson':          { height: "6'6\"",  jersey: 1,  team: 'New Orleans Pelicans',    position: 'PF', conference: 'Western', college: 'Duke',         age: 24 },
  'Paolo Banchero':           { height: "6'10\"", jersey: 5,  team: 'Orlando Magic',           position: 'PF', conference: 'Eastern', college: 'Duke',         age: 22 },
  'Scottie Barnes':           { height: "6'7\"",  jersey: 4,  team: 'Toronto Raptors',         position: 'SF', conference: 'Eastern', college: 'Florida State', age: 23 },
  'Evan Mobley':              { height: "6'11\"", jersey: 4,  team: 'Cleveland Cavaliers',     position: 'PF', conference: 'Eastern', college: 'USC',          age: 23 },
  'Cade Cunningham':          { height: "6'6\"",  jersey: 2,  team: 'Detroit Pistons',         position: 'PG', conference: 'Eastern', college: 'Oklahoma State', age: 23 },
  'Jalen Brunson':            { height: "6'2\"",  jersey: 11, team: 'New York Knicks',         position: 'PG', conference: 'Eastern', college: 'Villanova',    age: 28 },
  'Darius Garland':           { height: "6'1\"",  jersey: 10, team: 'Cleveland Cavaliers',     position: 'PG', conference: 'Eastern', college: 'Vanderbilt',   age: 25 },
  'Jaren Jackson Jr':         { height: "6'11\"", jersey: 13, team: 'Memphis Grizzlies',       position: 'PF', conference: 'Western', college: 'Michigan State', age: 25 },
  "De'Aaron Fox":             { height: "6'3\"",  jersey: 5,  team: 'San Antonio Spurs',        position: 'PG', conference: 'Western', college: 'Kentucky',     age: 27 },
  'Michael Jordan':           { height: "6'6\"",  jersey: 23, team: 'Chicago Bulls',           position: 'SG', conference: 'Eastern', college: 'North Carolina', age: 62 },
  'Kobe Bryant':              { height: "6'6\"",  jersey: 24, team: 'Los Angeles Lakers',      position: 'SG', conference: 'Western', college: 'None (HS)',    age: 46 },
  "Shaquille O'Neal":         { height: "7'1\"",  jersey: 34, team: 'Los Angeles Lakers',      position: 'C',  conference: 'Western', college: 'LSU',          age: 53 },
  'Magic Johnson':            { height: "6'9\"",  jersey: 32, team: 'Los Angeles Lakers',      position: 'PG', conference: 'Western', college: 'Michigan State', age: 65 },
  'Larry Bird':               { height: "6'9\"",  jersey: 33, team: 'Boston Celtics',          position: 'SF', conference: 'Eastern', college: 'Indiana State', age: 68 },
  'Tim Duncan':               { height: "6'11\"", jersey: 21, team: 'San Antonio Spurs',       position: 'PF', conference: 'Western', college: 'Wake Forest',  age: 49 },
  'Dirk Nowitzki':            { height: "7'0\"",  jersey: 41, team: 'Dallas Mavericks',        position: 'PF', conference: 'Western', college: 'Germany (intl)', age: 47 },
  'Allen Iverson':            { height: "6'0\"",  jersey: 3,  team: 'Philadelphia 76ers',      position: 'SG', conference: 'Eastern', college: 'Georgetown',   age: 50 },
  'Charles Barkley':          { height: "6'6\"",  jersey: 34, team: 'Phoenix Suns',            position: 'PF', conference: 'Western', college: 'Auburn',       age: 62 },
  'Hakeem Olajuwon':          { height: "7'0\"",  jersey: 34, team: 'Houston Rockets',         position: 'C',  conference: 'Western', college: 'Houston',      age: 62 },
  'Patrick Ewing':            { height: "7'0\"",  jersey: 33, team: 'New York Knicks',         position: 'C',  conference: 'Eastern', college: 'Georgetown',   age: 62 },
  'Karl Malone':              { height: "6'9\"",  jersey: 32, team: 'Utah Jazz',               position: 'PF', conference: 'Western', college: 'Louisiana Tech', age: 61 },
  'John Stockton':            { height: "6'1\"",  jersey: 12, team: 'Utah Jazz',               position: 'PG', conference: 'Western', college: 'Gonzaga',      age: 63 },
  'Isiah Thomas':             { height: "6'1\"",  jersey: 11, team: 'Detroit Pistons',         position: 'PG', conference: 'Eastern', college: 'Indiana',      age: 64 },
  'Clyde Drexler':            { height: "6'7\"",  jersey: 22, team: 'Portland Trail Blazers',  position: 'SG', conference: 'Western', college: 'Houston',      age: 63 },
  'Scottie Pippen':           { height: "6'8\"",  jersey: 33, team: 'Chicago Bulls',           position: 'SF', conference: 'Eastern', college: 'Central Arkansas', age: 59 },
  'Gary Payton':              { height: "6'4\"",  jersey: 20, team: 'Seattle SuperSonics',     position: 'PG', conference: 'Western', college: 'Oregon State', age: 56 },
  'Ray Allen':                { height: "6'5\"",  jersey: 20, team: 'Miami Heat',              position: 'SG', conference: 'Eastern', college: 'Connecticut',  age: 49 },
  'Paul Pierce':              { height: "6'7\"",  jersey: 34, team: 'Boston Celtics',          position: 'SF', conference: 'Eastern', college: 'Kansas',       age: 47 },
  'Kevin Garnett':            { height: "6'11\"", jersey: 5,  team: 'Minnesota Timberwolves',  position: 'PF', conference: 'Western', college: 'None (HS)',    age: 49 },
};

const NFL_ATTRS: Record<string, NFLAttrs> = {
  'Patrick Mahomes':    { height: "6'3\"",  jersey: 15, team: 'Kansas City Chiefs',      position: 'QB',   conference: 'AFC', college: 'Texas Tech',       age: 29 },
  'Josh Allen':         { height: "6'5\"",  jersey: 17, team: 'Buffalo Bills',           position: 'QB',   conference: 'AFC', college: 'Wyoming',          age: 29 },
  'Lamar Jackson':      { height: "6'2\"",  jersey: 8,  team: 'Baltimore Ravens',        position: 'QB',   conference: 'AFC', college: 'Louisville',       age: 28 },
  'Joe Burrow':         { height: "6'4\"",  jersey: 9,  team: 'Cincinnati Bengals',      position: 'QB',   conference: 'AFC', college: 'LSU',              age: 28 },
  'Jalen Hurts':        { height: "6'1\"",  jersey: 1,  team: 'Philadelphia Eagles',     position: 'QB',   conference: 'NFC', college: 'Oklahoma',         age: 26 },
  'Justin Herbert':     { height: "6'6\"",  jersey: 10, team: 'Los Angeles Chargers',    position: 'QB',   conference: 'AFC', college: 'Oregon',           age: 27 },
  'Dak Prescott':       { height: "6'2\"",  jersey: 4,  team: 'Dallas Cowboys',          position: 'QB',   conference: 'NFC', college: 'Mississippi State', age: 31 },
  'Tua Tagovailoa':     { height: "6'1\"",  jersey: 1,  team: 'Miami Dolphins',          position: 'QB',   conference: 'AFC', college: 'Alabama',          age: 27 },
  'CJ Stroud':          { height: "6'3\"",  jersey: 7,  team: 'Houston Texans',          position: 'QB',   conference: 'AFC', college: 'Ohio State',       age: 23 },
  'Brock Purdy':        { height: "6'1\"",  jersey: 13, team: 'San Francisco 49ers',     position: 'QB',   conference: 'NFC', college: 'Iowa State',       age: 25 },
  'Tyreek Hill':        { height: "5'10\"", jersey: 10, team: 'Dallas Cowboys',          position: 'WR',   conference: 'NFC', college: 'West Alabama',     age: 31 },
  'Davante Adams':      { height: "6'1\"",  jersey: 17, team: 'New York Jets',           position: 'WR',   conference: 'AFC', college: 'Fresno State',     age: 32 },
  'Justin Jefferson':   { height: "6'1\"",  jersey: 18, team: 'Minnesota Vikings',       position: 'WR',   conference: 'NFC', college: 'LSU',              age: 26 },
  "Ja'Marr Chase":      { height: "6'0\"",  jersey: 1,  team: 'Cincinnati Bengals',      position: 'WR',   conference: 'AFC', college: 'LSU',              age: 25 },
  'Travis Kelce':       { height: "6'5\"",  jersey: 87, team: 'Kansas City Chiefs',      position: 'TE',   conference: 'AFC', college: 'Cincinnati',       age: 35 },
  'Stefon Diggs':       { height: "6'0\"",  jersey: 1,  team: 'Houston Texans',          position: 'WR',   conference: 'AFC', college: 'Maryland',         age: 31 },
  'DeAndre Hopkins':    { height: "6'1\"",  jersey: 10, team: 'Tennessee Titans',        position: 'WR',   conference: 'AFC', college: 'Clemson',          age: 33 },
  'Cooper Kupp':        { height: "6'2\"",  jersey: 10, team: 'Los Angeles Rams',        position: 'WR',   conference: 'NFC', college: 'Eastern Washington', age: 31 },
  'Derrick Henry':      { height: "6'3\"",  jersey: 22, team: 'Baltimore Ravens',        position: 'RB',   conference: 'AFC', college: 'Alabama',          age: 31 },
  'Christian McCaffrey': { height: "5'11\"", jersey: 23, team: 'San Francisco 49ers',    position: 'RB',   conference: 'NFC', college: 'Stanford',         age: 29 },
  'Nick Chubb':         { height: "5'11\"", jersey: 24, team: 'Cleveland Browns',        position: 'RB',   conference: 'AFC', college: 'Georgia',          age: 29 },
  'Saquon Barkley':     { height: "6'0\"",  jersey: 26, team: 'Philadelphia Eagles',     position: 'RB',   conference: 'NFC', college: 'Penn State',       age: 28 },
  'Josh Jacobs':        { height: "5'10\"", jersey: 8,  team: 'Green Bay Packers',       position: 'RB',   conference: 'NFC', college: 'Alabama',          age: 27 },
  'Tony Pollard':       { height: "6'0\"",  jersey: 20, team: 'Tennessee Titans',        position: 'RB',   conference: 'AFC', college: 'Memphis',          age: 27 },
  'Aaron Donald':       { height: "6'1\"",  jersey: 99, team: 'Los Angeles Rams',        position: 'DT',   conference: 'NFC', college: 'Pittsburgh',       age: 34 },
  'Micah Parsons':      { height: "6'3\"",  jersey: 11, team: 'Dallas Cowboys',          position: 'EDGE', conference: 'NFC', college: 'Penn State',       age: 25 },
  'Myles Garrett':      { height: "6'4\"",  jersey: 95, team: 'Detroit Lions',           position: 'EDGE', conference: 'NFC', college: 'Texas A&M',        age: 29 },
  'TJ Watt':            { height: "6'4\"",  jersey: 90, team: 'Pittsburgh Steelers',     position: 'EDGE', conference: 'AFC', college: 'Wisconsin',        age: 30 },
  'Tom Brady':          { height: "6'4\"",  jersey: 12, team: 'New England Patriots',    position: 'QB',   conference: 'AFC', college: 'Michigan',         age: 47 },
  'Peyton Manning':     { height: "6'5\"",  jersey: 18, team: 'Indianapolis Colts',      position: 'QB',   conference: 'AFC', college: 'Tennessee',        age: 49 },
  'Drew Brees':         { height: "6'0\"",  jersey: 9,  team: 'New Orleans Saints',      position: 'QB',   conference: 'NFC', college: 'Purdue',           age: 46 },
  'Aaron Rodgers':      { height: "6'2\"",  jersey: 8,  team: 'New York Jets',           position: 'QB',   conference: 'AFC', college: 'Cal',              age: 41 },
  'Brett Favre':        { height: "6'2\"",  jersey: 4,  team: 'Green Bay Packers',       position: 'QB',   conference: 'NFC', college: 'Southern Miss',    age: 55 },
  'Joe Montana':        { height: "6'2\"",  jersey: 16, team: 'San Francisco 49ers',     position: 'QB',   conference: 'NFC', college: 'Notre Dame',       age: 69 },
  'Jerry Rice':         { height: "6'2\"",  jersey: 80, team: 'San Francisco 49ers',     position: 'WR',   conference: 'NFC', college: 'Mississippi Valley State', age: 62 },
  'Randy Moss':         { height: "6'4\"",  jersey: 84, team: 'Minnesota Vikings',       position: 'WR',   conference: 'NFC', college: 'Marshall',         age: 48 },
  'Barry Sanders':      { height: "5'8\"",  jersey: 20, team: 'Detroit Lions',           position: 'RB',   conference: 'NFC', college: 'Oklahoma State',   age: 56 },
  'Emmitt Smith':       { height: "5'9\"",  jersey: 22, team: 'Dallas Cowboys',          position: 'RB',   conference: 'NFC', college: 'Florida',          age: 55 },
  'Lawrence Taylor':    { height: "6'3\"",  jersey: 56, team: 'New York Giants',         position: 'LB',   conference: 'NFC', college: 'North Carolina',   age: 66 },
  'Deion Sanders':      { height: "6'1\"",  jersey: 21, team: 'Dallas Cowboys',          position: 'CB',   conference: 'NFC', college: 'Florida State',    age: 57 },
  'Walter Payton':      { height: "5'10\"", jersey: 34, team: 'Chicago Bears',           position: 'RB',   conference: 'NFC', college: 'Jackson State',    age: 71 },
  'Jim Brown':          { height: "6'2\"",  jersey: 32, team: 'Cleveland Browns',        position: 'RB',   conference: 'AFC', college: 'Syracuse',         age: 89 },
  'Johnny Unitas':      { height: "6'1\"",  jersey: 19, team: 'Baltimore Colts',         position: 'QB',   conference: 'AFC', college: 'Louisville',       age: 92 },
  'Dan Marino':         { height: "6'4\"",  jersey: 13, team: 'Miami Dolphins',          position: 'QB',   conference: 'AFC', college: 'Pittsburgh',       age: 63 },
  'John Elway':         { height: "6'3\"",  jersey: 7,  team: 'Denver Broncos',          position: 'QB',   conference: 'AFC', college: 'Stanford',         age: 65 },
  'Terry Bradshaw':     { height: "6'3\"",  jersey: 12, team: 'Pittsburgh Steelers',     position: 'QB',   conference: 'AFC', college: 'Louisiana Tech',   age: 77 },
  'Troy Aikman':        { height: "6'4\"",  jersey: 8,  team: 'Dallas Cowboys',          position: 'QB',   conference: 'NFC', college: 'UCLA',             age: 58 },
  'Steve Young':        { height: "6'2\"",  jersey: 8,  team: 'San Francisco 49ers',     position: 'QB',   conference: 'NFC', college: 'BYU',              age: 63 },
  'Warren Moon':        { height: "6'3\"",  jersey: 1,  team: 'Houston Oilers',          position: 'QB',   conference: 'AFC', college: 'Washington',       age: 68 },
  'Bruce Smith':        { height: "6'4\"",  jersey: 78, team: 'Buffalo Bills',           position: 'DE',   conference: 'AFC', college: 'Virginia Tech',    age: 61 },
};

const MLB_ATTRS: Record<string, MLBAttrs> = {
  'Shohei Ohtani':       { bat: 'L', throwing: 'R', country: 'Japan',              team: 'Los Angeles Dodgers',  position: 'DH', division: 'NL West',    age: 30 },
  'Mike Trout':          { bat: 'R', throwing: 'R', country: 'USA', college: 'Millville HS',      team: 'Los Angeles Angels',   position: 'CF', division: 'AL West',    age: 33 },
  'Mookie Betts':        { bat: 'R', throwing: 'R', country: 'USA', college: 'None (HS)',         team: 'Los Angeles Dodgers',  position: 'SS', division: 'NL West',    age: 32 },
  'Freddie Freeman':     { bat: 'L', throwing: 'R', country: 'USA', college: 'Cal State Fullerton', team: 'Los Angeles Dodgers', position: '1B', division: 'NL West',    age: 35 },
  'Ronald Acuna Jr':     { bat: 'R', throwing: 'R', country: 'Venezuela',           team: 'Atlanta Braves',       position: 'RF', division: 'NL East',    age: 27 },
  'Juan Soto':           { bat: 'L', throwing: 'L', country: 'Dominican Republic',  team: 'New York Mets',        position: 'RF', division: 'NL East',    age: 26 },
  'Fernando Tatis Jr':   { bat: 'R', throwing: 'R', country: 'Dominican Republic',  team: 'San Diego Padres',     position: 'RF', division: 'NL West',    age: 26 },
  'Vladimir Guerrero Jr': { bat: 'R', throwing: 'R', country: 'Dominican Republic', team: 'Toronto Blue Jays',    position: '1B', division: 'AL East',    age: 26 },
  'Yordan Alvarez':      { bat: 'L', throwing: 'R', country: 'Cuba',               team: 'Houston Astros',       position: 'DH', division: 'AL West',    age: 27 },
  'Trea Turner':         { bat: 'R', throwing: 'R', country: 'USA', college: 'NC State',           team: 'Philadelphia Phillies', position: 'SS', division: 'NL East',    age: 31 },
  'Aaron Judge':         { bat: 'R', throwing: 'R', country: 'USA', college: 'Fresno State',       team: 'New York Yankees',     position: 'RF', division: 'AL East',    age: 33 },
  'Gerrit Cole':         { bat: 'R', throwing: 'R', country: 'USA', college: 'UCLA',               team: 'New York Yankees',     position: 'SP', division: 'AL East',    age: 34 },
  'Max Scherzer':        { bat: 'R', throwing: 'R', country: 'USA', college: 'Missouri',           team: 'Texas Rangers',        position: 'SP', division: 'AL West',    age: 40 },
  'Jacob deGrom':        { bat: 'L', throwing: 'R', country: 'USA', college: 'Stetson',            team: 'Texas Rangers',        position: 'SP', division: 'AL West',    age: 37 },
  'Clayton Kershaw':     { bat: 'L', throwing: 'L', country: 'USA', college: 'None (HS)',          team: 'Los Angeles Dodgers',  position: 'SP', division: 'NL West',    age: 37 },
  'Zack Wheeler':        { bat: 'L', throwing: 'R', country: 'USA', college: 'East Paulding HS',   team: 'Philadelphia Phillies', position: 'SP', division: 'NL East',   age: 35 },
  'Spencer Strider':     { bat: 'R', throwing: 'R', country: 'USA', college: 'Clemson',            team: 'Atlanta Braves',       position: 'SP', division: 'NL East',    age: 26 },
  'Julio Rodriguez':     { bat: 'R', throwing: 'R', country: 'Dominican Republic',  team: 'Seattle Mariners',     position: 'CF', division: 'AL West',    age: 24 },
  'Bobby Witt Jr':       { bat: 'R', throwing: 'R', country: 'USA', college: 'None (HS)',          team: 'Kansas City Royals',   position: 'SS', division: 'AL Central', age: 25 },
  'Gunnar Henderson':    { bat: 'L', throwing: 'R', country: 'USA', college: 'None (HS)',          team: 'Baltimore Orioles',    position: 'SS', division: 'AL East',    age: 24 },
  'Babe Ruth':           { bat: 'L', throwing: 'L', country: 'USA', college: 'None (HS)',          team: 'New York Yankees',     position: 'RF', division: 'AL East',    age: 130 },
  'Hank Aaron':          { bat: 'R', throwing: 'R', country: 'USA', college: 'None (HS)',          team: 'Atlanta Braves',       position: 'RF', division: 'NL East',    age: 91 },
  'Willie Mays':         { bat: 'R', throwing: 'R', country: 'USA', college: 'None (HS)',          team: 'San Francisco Giants', position: 'CF', division: 'NL West',    age: 94 },
  'Ted Williams':        { bat: 'L', throwing: 'R', country: 'USA', college: 'None (HS)',          team: 'Boston Red Sox',       position: 'LF', division: 'AL East',    age: 106 },
  'Mickey Mantle':       { bat: 'S', throwing: 'R', country: 'USA', college: 'None (HS)',          team: 'New York Yankees',     position: 'CF', division: 'AL East',    age: 93 },
  'Derek Jeter':         { bat: 'R', throwing: 'R', country: 'USA', college: 'None (HS)',          team: 'New York Yankees',     position: 'SS', division: 'AL East',    age: 51 },
  'Cal Ripken Jr':       { bat: 'R', throwing: 'R', country: 'USA', college: 'None (HS)',          team: 'Baltimore Orioles',    position: 'SS', division: 'AL East',    age: 64 },
  'Sandy Koufax':        { bat: 'R', throwing: 'L', country: 'USA', college: 'Cincinnati',        team: 'Los Angeles Dodgers',  position: 'SP', division: 'NL West',    age: 89 },
  'Nolan Ryan':          { bat: 'R', throwing: 'R', country: 'USA', college: 'None (HS)',          team: 'Texas Rangers',        position: 'SP', division: 'AL West',    age: 78 },
  'Roger Clemens':       { bat: 'R', throwing: 'R', country: 'USA', college: 'Texas',             team: 'New York Yankees',     position: 'SP', division: 'AL East',    age: 62 },
  'Randy Johnson':       { bat: 'R', throwing: 'L', country: 'USA', college: 'USC',               team: 'Arizona Diamondbacks', position: 'SP', division: 'NL West',    age: 61 },
  'Greg Maddux':         { bat: 'R', throwing: 'R', country: 'USA', college: 'None (HS)',          team: 'Atlanta Braves',       position: 'SP', division: 'NL East',    age: 59 },
  'Tom Seaver':          { bat: 'R', throwing: 'R', country: 'USA', college: 'USC',               team: 'New York Mets',        position: 'SP', division: 'NL East',    age: 80 },
  'Bob Gibson':          { bat: 'R', throwing: 'R', country: 'USA', college: 'Creighton',         team: 'St. Louis Cardinals',  position: 'SP', division: 'NL Central', age: 89 },
  'Cy Young':            { bat: 'R', throwing: 'R', country: 'USA', college: 'None (HS)',          team: 'Cleveland Guardians',  position: 'SP', division: 'AL Central', age: 158 },
  'Lou Gehrig':          { bat: 'L', throwing: 'L', country: 'USA', college: 'Columbia',          team: 'New York Yankees',     position: '1B', division: 'AL East',    age: 122 },
  'Ty Cobb':             { bat: 'L', throwing: 'R', country: 'USA', college: 'None (HS)',          team: 'Detroit Tigers',       position: 'CF', division: 'AL Central', age: 138 },
  'Stan Musial':         { bat: 'L', throwing: 'L', country: 'USA', college: 'None (HS)',          team: 'St. Louis Cardinals',  position: 'LF', division: 'NL Central', age: 104 },
  'Joe DiMaggio':        { bat: 'R', throwing: 'R', country: 'USA', college: 'None (HS)',          team: 'New York Yankees',     position: 'CF', division: 'AL East',    age: 110 },
  'Jackie Robinson':     { bat: 'R', throwing: 'R', country: 'USA', college: 'UCLA',              team: 'Brooklyn Dodgers',     position: '2B', division: 'NL East',    age: 106 },
  'Ken Griffey Jr':      { bat: 'L', throwing: 'L', country: 'USA', college: 'None (HS)',          team: 'Seattle Mariners',     position: 'CF', division: 'AL West',    age: 55 },
  'Barry Bonds':         { bat: 'L', throwing: 'L', country: 'USA', college: 'Arizona State',     team: 'San Francisco Giants', position: 'LF', division: 'NL West',    age: 60 },
  'Alex Rodriguez':      { bat: 'R', throwing: 'R', country: 'USA', college: 'None (HS)',          team: 'New York Yankees',     position: 'SS', division: 'AL East',    age: 49 },
  'Albert Pujols':       { bat: 'R', throwing: 'R', country: 'Dominican Republic',  team: 'St. Louis Cardinals',  position: '1B', division: 'NL Central', age: 45 },
  'David Ortiz':         { bat: 'L', throwing: 'L', country: 'Dominican Republic',  team: 'Boston Red Sox',       position: 'DH', division: 'AL East',    age: 49 },
  'Chipper Jones':       { bat: 'S', throwing: 'R', country: 'USA', college: 'None (HS)',          team: 'Atlanta Braves',       position: '3B', division: 'NL East',    age: 53 },
  'Mike Schmidt':        { bat: 'R', throwing: 'R', country: 'USA', college: 'Ohio',              team: 'Philadelphia Phillies', position: '3B', division: 'NL East',   age: 75 },
  'Reggie Jackson':      { bat: 'L', throwing: 'L', country: 'USA', college: 'Arizona State',     team: 'New York Yankees',     position: 'RF', division: 'AL East',    age: 79 },
  'Pete Rose':           { bat: 'S', throwing: 'R', country: 'USA', college: 'None (HS)',          team: 'Cincinnati Reds',      position: 'LF', division: 'NL Central', age: 84 },
  'Johnny Bench':        { bat: 'R', throwing: 'R', country: 'USA',                team: 'Cincinnati Reds',      position: 'C',  division: 'NL Central', age: 77 },
};

const NHL_ATTRS: Record<string, NHLAttrs> = {
  'Connor McDavid':       { height: "6'1\"",  jersey: 97, team: 'Edmonton Oilers',        position: 'C',  conference: 'Western', country: 'Canada',   age: 28 },
  'Nathan MacKinnon':     { height: "6'0\"",  jersey: 29, team: 'Colorado Avalanche',     position: 'C',  conference: 'Western', country: 'Canada',   age: 29 },
  'Leon Draisaitl':       { height: "6'1\"",  jersey: 29, team: 'Edmonton Oilers',        position: 'C',  conference: 'Western', country: 'Germany',  age: 29 },
  'Auston Matthews':      { height: "6'3\"",  jersey: 34, team: 'Toronto Maple Leafs',    position: 'C',  conference: 'Eastern', country: 'USA',      age: 27 },
  'David Pastrnak':       { height: "6'0\"",  jersey: 88, team: 'Boston Bruins',           position: 'RW', conference: 'Eastern', country: 'Czechia',  age: 28 },
  'Sidney Crosby':        { height: "5'11\"", jersey: 87, team: 'Pittsburgh Penguins',     position: 'C',  conference: 'Eastern', country: 'Canada',   age: 37 },
  'Alex Ovechkin':        { height: "6'3\"",  jersey: 8,  team: 'Washington Capitals',     position: 'LW', conference: 'Eastern', country: 'Russia',   age: 39 },
  'Nikita Kucherov':      { height: "5'11\"", jersey: 86, team: 'Tampa Bay Lightning',     position: 'RW', conference: 'Eastern', country: 'Russia',   age: 31 },
  'Cale Makar':           { height: "5'11\"", jersey: 8,  team: 'Colorado Avalanche',      position: 'D',  conference: 'Western', country: 'Canada',   age: 26 },
  'Quinn Hughes':         { height: "5'10\"", jersey: 43, team: 'Vancouver Canucks',       position: 'D',  conference: 'Western', country: 'USA',      age: 25 },
  'Igor Shesterkin':      { height: "6'2\"",  jersey: 31, team: 'New York Rangers',        position: 'G',  conference: 'Eastern', country: 'Russia',   age: 29 },
  'Andrei Vasilevskiy':   { height: "6'3\"",  jersey: 88, team: 'Tampa Bay Lightning',     position: 'G',  conference: 'Eastern', country: 'Russia',   age: 30 },
  'Artemi Panarin':       { height: "5'11\"", jersey: 10, team: 'New York Rangers',        position: 'LW', conference: 'Eastern', country: 'Russia',   age: 33 },
  'Mitchell Marner':      { height: "6'0\"",  jersey: 16, team: 'Nashville Predators',     position: 'RW', conference: 'Western', country: 'Canada',   age: 28 },
  'Brad Marchand':        { height: "5'9\"",  jersey: 63, team: 'Boston Bruins',           position: 'LW', conference: 'Eastern', country: 'Canada',   age: 36 },
  'Mark Scheifele':       { height: "6'3\"",  jersey: 55, team: 'Winnipeg Jets',           position: 'C',  conference: 'Western', country: 'Canada',   age: 31 },
  'Kyle Connor':          { height: "6'1\"",  jersey: 81, team: 'Winnipeg Jets',           position: 'LW', conference: 'Western', country: 'USA',      age: 28 },
  'Gabriel Landeskog':    { height: "6'1\"",  jersey: 92, team: 'Colorado Avalanche',      position: 'LW', conference: 'Western', country: 'Sweden',   age: 32 },
  'Elias Pettersson':     { height: "6'2\"",  jersey: 40, team: 'Vancouver Canucks',       position: 'C',  conference: 'Western', country: 'Sweden',   age: 26 },
  'Matthew Tkachuk':      { height: "6'2\"",  jersey: 19, team: 'Florida Panthers',        position: 'LW', conference: 'Eastern', country: 'USA',      age: 27 },
  'Wayne Gretzky':        { height: "6'0\"",  jersey: 99, team: 'Edmonton Oilers',         position: 'C',  conference: 'Western', country: 'Canada',   age: 64 },
  'Mario Lemieux':        { height: "6'4\"",  jersey: 66, team: 'Pittsburgh Penguins',     position: 'C',  conference: 'Eastern', country: 'Canada',   age: 59 },
  'Bobby Orr':            { height: "6'0\"",  jersey: 4,  team: 'Boston Bruins',           position: 'D',  conference: 'Eastern', country: 'Canada',   age: 77 },
  'Gordie Howe':          { height: "6'0\"",  jersey: 9,  team: 'Detroit Red Wings',       position: 'RW', conference: 'Eastern', country: 'Canada',   age: 97 },
  'Mark Messier':         { height: "6'1\"",  jersey: 11, team: 'New York Rangers',        position: 'C',  conference: 'Eastern', country: 'Canada',   age: 64 },
  'Steve Yzerman':        { height: "5'11\"", jersey: 19, team: 'Detroit Red Wings',       position: 'C',  conference: 'Eastern', country: 'Canada',   age: 60 },
  'Brett Hull':           { height: "5'11\"", jersey: 16, team: 'St. Louis Blues',         position: 'RW', conference: 'Western', country: 'Canada',   age: 60 },
  'Jaromir Jagr':         { height: "6'3\"",  jersey: 68, team: 'Pittsburgh Penguins',     position: 'RW', conference: 'Eastern', country: 'Czechia',  age: 53 },
  'Mike Modano':          { height: "6'3\"",  jersey: 9,  team: 'Dallas Stars',            position: 'C',  conference: 'Western', country: 'USA',      age: 55 },
  'Brendan Shanahan':     { height: "6'3\"",  jersey: 14, team: 'Detroit Red Wings',       position: 'LW', conference: 'Eastern', country: 'Canada',   age: 56 },
  'Martin Brodeur':       { height: "6'2\"",  jersey: 30, team: 'New Jersey Devils',       position: 'G',  conference: 'Eastern', country: 'Canada',   age: 53 },
  'Patrick Roy':          { height: "6'0\"",  jersey: 33, team: 'Colorado Avalanche',      position: 'G',  conference: 'Western', country: 'Canada',   age: 59 },
  'Dominik Hasek':        { height: "5'11\"", jersey: 39, team: 'Buffalo Sabres',          position: 'G',  conference: 'Eastern', country: 'Czechia',  age: 60 },
  'Grant Fuhr':           { height: "5'10\"", jersey: 31, team: 'Edmonton Oilers',         position: 'G',  conference: 'Western', country: 'Canada',   age: 62 },
  'Ken Dryden':           { height: "6'4\"",  jersey: 29, team: 'Montreal Canadiens',      position: 'G',  conference: 'Eastern', country: 'Canada',   age: 77 },
  'Ray Bourque':          { height: "5'11\"", jersey: 77, team: 'Boston Bruins',           position: 'D',  conference: 'Eastern', country: 'Canada',   age: 64 },
  'Paul Coffey':          { height: "6'0\"",  jersey: 7,  team: 'Edmonton Oilers',         position: 'D',  conference: 'Western', country: 'Canada',   age: 64 },
  'Denis Potvin':         { height: "6'0\"",  jersey: 5,  team: 'New York Islanders',      position: 'D',  conference: 'Eastern', country: 'Canada',   age: 72 },
  'Scott Stevens':        { height: "6'2\"",  jersey: 4,  team: 'New Jersey Devils',       position: 'D',  conference: 'Eastern', country: 'Canada',   age: 61 },
  'Larry Robinson':       { height: "6'4\"",  jersey: 19, team: 'Montreal Canadiens',      position: 'D',  conference: 'Eastern', country: 'Canada',   age: 73 },
  'Guy Lafleur':          { height: "6'0\"",  jersey: 10, team: 'Montreal Canadiens',      position: 'RW', conference: 'Eastern', country: 'Canada',   age: 73 },
  'Marcel Dionne':        { height: "5'9\"",  jersey: 16, team: 'Los Angeles Kings',       position: 'C',  conference: 'Western', country: 'Canada',   age: 73 },
  'Phil Esposito':        { height: "6'1\"",  jersey: 7,  team: 'Boston Bruins',           position: 'C',  conference: 'Eastern', country: 'Canada',   age: 83 },
  'Mike Bossy':           { height: "6'0\"",  jersey: 22, team: 'New York Islanders',      position: 'RW', conference: 'Eastern', country: 'Canada',   age: 68 },
  'Bryan Trottier':       { height: "5'11\"", jersey: 19, team: 'New York Islanders',      position: 'C',  conference: 'Eastern', country: 'Canada',   age: 69 },
  'Peter Forsberg':       { height: "6'0\"",  jersey: 21, team: 'Colorado Avalanche',      position: 'C',  conference: 'Western', country: 'Sweden',   age: 51 },
  'Joe Sakic':            { height: "5'11\"", jersey: 19, team: 'Colorado Avalanche',      position: 'C',  conference: 'Western', country: 'Canada',   age: 56 },
  'Mats Sundin':          { height: "6'5\"",  jersey: 13, team: 'Toronto Maple Leafs',     position: 'C',  conference: 'Eastern', country: 'Sweden',   age: 54 },
  'Eric Lindros':         { height: "6'4\"",  jersey: 88, team: 'Philadelphia Flyers',     position: 'C',  conference: 'Eastern', country: 'Canada',   age: 52 },
  'Pavel Bure':           { height: "5'10\"", jersey: 10, team: 'Vancouver Canucks',       position: 'RW', conference: 'Western', country: 'Russia',   age: 54 },
};

// ── Attribute lookup ─────────────────────────────────────────────────────────

function getPlayerAttrs(name: string, league: League): PlayerAttrs | null {
  if (league === 'NBA') return NBA_ATTRS[name] ?? null;
  if (league === 'NFL') return NFL_ATTRS[name] ?? null;
  if (league === 'MLB') return MLB_ATTRS[name] ?? null;
  if (league === 'NHL') return NHL_ATTRS[name] ?? null;
  return null;
}

// ── Helpers for college/country display ──────────────────────────────────────

function isInternationalNBA(college: string | undefined): boolean {
  return !!college && college.includes('(intl)');
}

function getNBACountry(college: string): string {
  return college.replace(/\s*\(intl\)\s*/, '').trim();
}

function isInternationalMLB(country: string | undefined): boolean {
  return !!country && country !== 'USA';
}

// ── Column definitions per league ────────────────────────────────────────────
// NBA and MLB have a dynamic 7th column (college or country) based on the player

const LEAGUE_COLS: Record<League, string[]> = {
  NBA: ['PLAYER', 'HT', '#', 'TEAM', 'POS', 'CONF', 'ORIGIN', 'AGE'],
  NFL: ['PLAYER', 'HT', '#', 'TEAM', 'POS', 'CONF', 'COLLEGE', 'AGE'],
  MLB: ['PLAYER', 'BAT', 'THR', 'ORIGIN', 'TEAM', 'POS', 'DIV', 'AGE'],
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
  height?: string;
  jersey?: number;
  team: string;
  position: string;
  conference?: string;
  college?: string;
  age?: number;
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
    // MLB: show college for US players, country for international
    const isIntl = isInternationalMLB(g.country);
    const collegeCountryTile: TileData = isIntl
      ? { value: g.country, state: compareTile(g.country, mystery.country, 'country') }
      : { value: g.college ?? 'N/A', state: compareTile(g.college, mystery.college, 'college') };
    return [
      { value: nameDisplay, state: nameState },
      { value: g.bat, state: compareTile(g.bat, mystery.bat, 'bat') },
      { value: g.throwing, state: compareTile(g.throwing, mystery.throwing, 'throwing') },
      collegeCountryTile,
      { value: g.team, state: compareTile(g.team, mystery.team, 'team') },
      { value: g.position, state: compareTile(g.position, mystery.position, 'position') },
      { value: g.division, state: compareTile(g.division, mystery.division, 'division') },
      { value: String(g.age), state: compareTile(g.age, mystery.age, 'age') },
    ];
  }

  const g = guessAttrs as NBAAttrs | NFLAttrs | NHLAttrs;
  const gHeight = parseHeightToInches(g.height);
  const mHeight = mystery.height ? parseHeightToInches(mystery.height) : 0;

  let sixthCol: TileData;
  if (league === 'NHL') {
    sixthCol = { value: (g as NHLAttrs).country, state: compareTile((g as NHLAttrs).country, mystery.country, 'country') };
  } else if (league === 'NBA') {
    // NBA: show country for international players, college for US players
    const nbaCollege = (g as NBAAttrs).college;
    if (isInternationalNBA(nbaCollege)) {
      const guessCountry = getNBACountry(nbaCollege);
      const mysteryCountry = mystery.college ? getNBACountry(mystery.college) : mystery.country;
      sixthCol = { value: guessCountry, state: compareTile(guessCountry, mysteryCountry, 'country') };
    } else {
      // US player — compare college to college (or extract college from mystery if mystery is also US)
      const mysteryCollege = mystery.college && !isInternationalNBA(mystery.college) ? mystery.college : undefined;
      sixthCol = { value: nbaCollege, state: compareTile(nbaCollege, mysteryCollege, 'college') };
    }
  } else {
    // NFL: always college
    sixthCol = { value: (g as NFLAttrs).college, state: compareTile((g as NFLAttrs).college, mystery.college, 'college') };
  }

  const heightState = compareTile(gHeight, mHeight, 'height');

  return [
    { value: nameDisplay, state: nameState },
    { value: formatHeight(gHeight), state: heightState },
    { value: `#${g.jersey}`, state: compareTile(g.jersey, mystery.jersey, 'jersey') },
    { value: g.team, state: compareTile(g.team, mystery.team, 'team') },
    { value: g.position, state: compareTile(g.position, mystery.position, 'position') },
    { value: g.conference, state: compareTile(g.conference, mystery.conference, 'conference') },
    sixthCol,
    { value: String(g.age), state: compareTile(g.age, mystery.age, 'age') },
  ];
}

// ── Component ────────────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
}

export default function CustomMysteryPlayer({ onBack }: Props) {
  const { isDark } = useTheme();
  // Phase state
  const [phase, setPhase] = useState<'setup' | 'handoff' | 'guessing'>('setup');
  const [activeLeague, setActiveLeague] = useState<League>('NBA');

  // Setup state
  const [selectedPlayer, setSelectedPlayer] = useState<MysteryPlayer | null>(null);
  const [searchText, setSearchText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualTeam, setManualTeam] = useState('');
  const [manualPosition, setManualPosition] = useState('');
  const [manualAge, setManualAge] = useState('');
  const [manualJersey, setManualJersey] = useState('');
  const [manualHeight, setManualHeight] = useState('');
  const [manualConference, setManualConference] = useState('');
  const [manualCollege, setManualCollege] = useState('');

  // Guessing state
  const [guesses, setGuesses] = useState<TileData[][]>([]);
  const [guessedNames, setGuessedNames] = useState<Set<string>>(new Set());
  const [guessSearchText, setGuessSearchText] = useState('');
  const [guessShowDropdown, setGuessShowDropdown] = useState(false);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');

  // ── Filtered suggestions ───────────────────────────────────────────────────

  const activeAttrsMap = activeLeague === 'NBA' ? NBA_ATTRS : activeLeague === 'NFL' ? NFL_ATTRS : activeLeague === 'MLB' ? MLB_ATTRS : NHL_ATTRS;
  const attrsNames = Object.keys(activeAttrsMap);

  const setupSuggestions = searchText.length >= 2
    ? attrsNames.filter(n => n.toLowerCase().includes(searchText.toLowerCase())).slice(0, 6)
    : [];

  const guessSuggestions = guessSearchText.length >= 2
    ? attrsNames
        .filter(n => n.toLowerCase().includes(guessSearchText.toLowerCase()) && !guessedNames.has(n))
        .slice(0, 6)
    : [];

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleLeagueChange = useCallback((league: League) => {
    setActiveLeague(league);
    setSelectedPlayer(null);
    setSearchText('');
    setShowDropdown(false);
    setShowManualForm(false);
    resetManualForm();
  }, []);

  function resetManualForm() {
    setManualName('');
    setManualTeam('');
    setManualPosition('');
    setManualAge('');
    setManualJersey('');
    setManualHeight('');
    setManualConference('');
    setManualCollege('');
  }

  function selectFromPool(name: string) {
    const attrs = getPlayerAttrs(name, activeLeague);
    if (!attrs) return;

    let mp: MysteryPlayer;
    if (activeLeague === 'MLB') {
      const a = attrs as MLBAttrs;
      mp = {
        name, team: a.team, position: a.position, age: a.age,
        bat: a.bat, throwing: a.throwing, country: a.country, college: a.college, division: a.division,
      };
    } else if (activeLeague === 'NHL') {
      const a = attrs as NHLAttrs;
      mp = {
        name, team: a.team, position: a.position, age: a.age,
        height: a.height, jersey: a.jersey, conference: a.conference, country: a.country,
      };
    } else {
      const a = attrs as NBAAttrs | NFLAttrs;
      mp = {
        name, team: a.team, position: a.position, age: a.age,
        height: a.height, jersey: a.jersey, conference: a.conference, college: a.college,
      };
    }

    setSelectedPlayer(mp);
    setSearchText(name);
    setShowDropdown(false);
  }

  function buildManualPlayer(): MysteryPlayer | null {
    if (!manualName.trim() || !manualTeam.trim() || !manualPosition.trim()) return null;

    const base: MysteryPlayer = {
      name: manualName.trim(),
      team: manualTeam.trim(),
      position: manualPosition.trim(),
      age: manualAge ? parseInt(manualAge) : undefined,
    };

    if (activeLeague === 'MLB') {
      // For MLB: jersey/height fields repurposed — 7th = division, 8th = country
      base.bat = manualJersey.trim() || undefined;       // reuse jersey field for bat
      base.throwing = manualHeight.trim() || undefined;   // reuse height field for throwing
      base.division = manualConference.trim() || undefined;
      base.country = manualCollege.trim() || undefined;
    } else if (activeLeague === 'NHL') {
      base.height = manualHeight.trim() || undefined;
      base.jersey = manualJersey ? parseInt(manualJersey) : undefined;
      base.conference = manualConference.trim() || undefined;
      base.country = manualCollege.trim() || undefined;
    } else {
      base.height = manualHeight.trim() || undefined;
      base.jersey = manualJersey ? parseInt(manualJersey) : undefined;
      base.conference = manualConference.trim() || undefined;
      base.college = manualCollege.trim() || undefined;
    }

    return base;
  }

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

  function resetGame() {
    setPhase('setup');
    setSelectedPlayer(null);
    setSearchText('');
    setGuesses([]);
    setGuessedNames(new Set());
    setGuessSearchText('');
    setGuessShowDropdown(false);
    setGameState('playing');
    setShowManualForm(false);
    resetManualForm();
  }

  function handleGuessingBack() {
    Alert.alert(
      'End game?',
      'The mystery player will be revealed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End Game', style: 'destructive', onPress: onBack },
      ],
    );
  }

  // ── Manual form field labels per league ────────────────────────────────────

  const manualFields = activeLeague === 'MLB'
    ? [
        { label: 'Player Name *', value: manualName, setter: setManualName, placeholder: 'e.g. Mike Trout' },
        { label: 'Team *', value: manualTeam, setter: setManualTeam, placeholder: 'e.g. Los Angeles Angels' },
        { label: 'Position *', value: manualPosition, setter: setManualPosition, placeholder: 'e.g. CF' },
        { label: 'Age', value: manualAge, setter: setManualAge, placeholder: 'e.g. 33', keyboard: 'numeric' as const },
        { label: 'Bats', value: manualJersey, setter: setManualJersey, placeholder: 'e.g. R, L, or S' },
        { label: 'Throws', value: manualHeight, setter: setManualHeight, placeholder: 'e.g. R or L' },
        { label: 'Division', value: manualConference, setter: setManualConference, placeholder: 'e.g. AL West' },
        { label: 'Country/College', value: manualCollege, setter: setManualCollege, placeholder: 'e.g. USA or Duke' },
      ]
    : activeLeague === 'NHL'
    ? [
        { label: 'Player Name *', value: manualName, setter: setManualName, placeholder: 'e.g. Connor McDavid' },
        { label: 'Team *', value: manualTeam, setter: setManualTeam, placeholder: 'e.g. Edmonton Oilers' },
        { label: 'Position *', value: manualPosition, setter: setManualPosition, placeholder: 'e.g. C' },
        { label: 'Age', value: manualAge, setter: setManualAge, placeholder: 'e.g. 28', keyboard: 'numeric' as const },
        { label: 'Jersey #', value: manualJersey, setter: setManualJersey, placeholder: 'e.g. 97', keyboard: 'numeric' as const },
        { label: 'Height', value: manualHeight, setter: setManualHeight, placeholder: "e.g. 6'1\"" },
        { label: 'Conference', value: manualConference, setter: setManualConference, placeholder: 'e.g. Western' },
        { label: 'Country', value: manualCollege, setter: setManualCollege, placeholder: 'e.g. Canada' },
      ]
    : [
        { label: 'Player Name *', value: manualName, setter: setManualName, placeholder: activeLeague === 'NBA' ? 'e.g. LeBron James' : 'e.g. Patrick Mahomes' },
        { label: 'Team *', value: manualTeam, setter: setManualTeam, placeholder: activeLeague === 'NBA' ? 'e.g. Los Angeles Lakers' : 'e.g. Kansas City Chiefs' },
        { label: 'Position *', value: manualPosition, setter: setManualPosition, placeholder: activeLeague === 'NBA' ? 'e.g. SF' : 'e.g. QB' },
        { label: 'Age', value: manualAge, setter: setManualAge, placeholder: 'e.g. 30', keyboard: 'numeric' as const },
        { label: 'Jersey #', value: manualJersey, setter: setManualJersey, placeholder: 'e.g. 23', keyboard: 'numeric' as const },
        { label: 'Height', value: manualHeight, setter: setManualHeight, placeholder: "e.g. 6'9\"" },
        { label: 'Conference', value: manualConference, setter: setManualConference, placeholder: activeLeague === 'NBA' ? 'e.g. Western' : 'e.g. AFC' },
        { label: activeLeague === 'NBA' ? 'College/Country' : 'College', value: manualCollege, setter: setManualCollege, placeholder: activeLeague === 'NBA' ? 'e.g. Duke or France (intl)' : 'e.g. Duke' },
      ];

  // ── Render Setup Phase ─────────────────────────────────────────────────────

  function renderSetup() {
    return (
      <SafeAreaView style={s.root} edges={['top']}>
        {/* Zone 1 — Brand header */}
        <View style={s.zone1}>
          <View style={s.headerRow}>
            <Pressable style={s.backBtn} onPress={onBack}>
              <ArrowLeft size={20} color={colors.white} strokeWidth={2} />
            </Pressable>
            <Text style={s.title}>Custom Mystery</Text>
          </View>
          <Text style={s.subtitle}>Set your player</Text>
        </View>

        {/* Zone 2 — Content */}
        <KeyboardAvoidingView
          style={s.zone2}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            style={s.zone2}
            contentContainerStyle={s.zone2Content}
            keyboardShouldPersistTaps="handled"
          >
            <LeagueSwitcher activeLeague={activeLeague} onChange={handleLeagueChange} />

            {/* Search input */}
            <View style={s.searchWrap}>
              <Search size={18} color={darkColors.textSecondary} strokeWidth={2} />
              <TextInput
                style={s.searchInput}
                placeholder="Search for a player..."
                placeholderTextColor={darkColors.textSecondary}
                value={searchText}
                onChangeText={t => {
                  setSearchText(t);
                  setShowDropdown(t.length >= 2);
                  if (selectedPlayer) setSelectedPlayer(null);
                }}
                autoCorrect={false}
                autoCapitalize="words"
              />
            </View>

            {/* Autocomplete dropdown */}
            {showDropdown && setupSuggestions.length > 0 && (
              <View style={s.dropdown}>
                {setupSuggestions.map(name => {
                  const attrs = getPlayerAttrs(name, activeLeague);
                  const team = attrs
                    ? activeLeague === 'MLB'
                      ? (attrs as MLBAttrs).team
                      : (attrs as NBAAttrs | NFLAttrs | NHLAttrs).team
                    : '';
                  return (
                    <Pressable
                      key={name}
                      style={s.dropdownItem}
                      onPress={() => selectFromPool(name)}
                    >
                      <Text style={s.dropdownName}>{name}</Text>
                      <Text style={s.dropdownTeam}>{team}</Text>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {/* Confirmation card */}
            {selectedPlayer && (
              <View style={s.confirmCard}>
                <Check size={28} color={colors.accentGreen} strokeWidth={2} />
                <Text style={s.confirmName}>{selectedPlayer.name}</Text>
                <Text style={s.confirmTeam}>{selectedPlayer.team}</Text>
              </View>
            )}

            {/* Action buttons */}
            <View style={s.actionArea}>
              <PrimaryButton
                label="Hand to Guesser"
                onPress={() => setPhase('handoff')}
                disabled={!selectedPlayer}
              />
              {selectedPlayer && (
                <GhostButton
                  label="Change Player"
                  onPress={() => {
                    setSelectedPlayer(null);
                    setSearchText('');
                  }}
                />
              )}
            </View>

            {/* Manual entry link */}
            {!showManualForm && (
              <Pressable onPress={() => setShowManualForm(true)} style={s.manualLink}>
                <UserSearch size={16} color={colors.accentCyan} strokeWidth={2} />
                <Text style={s.manualLinkText}>Can't find your player? Enter manually</Text>
              </Pressable>
            )}

            {/* Manual form */}
            {showManualForm && (
              <View style={s.manualForm}>
                <Text style={s.manualFormTitle}>Enter Player Manually</Text>
                {manualFields.map(f => (
                  <View key={f.label} style={s.manualFieldWrap}>
                    <Text style={s.manualFieldLabel}>{f.label}</Text>
                    <TextInput
                      style={s.manualFieldInput}
                      placeholder={f.placeholder}
                      placeholderTextColor={darkColors.textSecondary}
                      value={f.value}
                      onChangeText={f.setter}
                      keyboardType={(f as any).keyboard ?? 'default'}
                      autoCorrect={false}
                      autoCapitalize="words"
                    />
                  </View>
                ))}
                <PrimaryButton
                  label="Set This Player"
                  onPress={() => {
                    const mp = buildManualPlayer();
                    if (!mp) {
                      Alert.alert('Missing info', 'Name, team, and position are required.');
                      return;
                    }
                    setSelectedPlayer(mp);
                    setShowManualForm(false);
                  }}
                  disabled={!manualName.trim() || !manualTeam.trim() || !manualPosition.trim()}
                />
                <GhostButton
                  label="Cancel"
                  onPress={() => {
                    setShowManualForm(false);
                    resetManualForm();
                  }}
                />
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ── Render Handoff Phase ───────────────────────────────────────────────────

  function renderHandoff() {
    return (
      <SafeAreaView style={s.root} edges={['top']}>
        <View style={s.handoffContainer}>
          <Lock size={64} color={colors.brand} strokeWidth={1.5} />
          <Text style={s.handoffTitle}>Hand the phone to the guesser</Text>
          <Text style={s.handoffSubtitle}>Don't show them the screen!</Text>
          <View style={s.handoffButton}>
            <PrimaryButton label="I'm Ready to Guess" onPress={() => setPhase('guessing')} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── Render Guessing Phase ──────────────────────────────────────────────────

  function renderGuessing() {
    const cols = LEAGUE_COLS[activeLeague];

    return (
      <SafeAreaView style={s.root} edges={['top']}>
        {/* Zone 1 — Brand header */}
        <View style={s.zone1}>
          <View style={s.headerRow}>
            <Pressable style={s.backBtn} onPress={handleGuessingBack}>
              <ArrowLeft size={20} color={colors.white} strokeWidth={2} />
            </Pressable>
            <Text style={s.title}>Custom Mystery</Text>
          </View>
          <RoundProgressDots total={MAX_GUESSES} current={guesses.length + 1} />
        </View>

        {/* Zone 2 — Guess grid */}
        <KeyboardAvoidingView
          style={s.zone2}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            style={s.zone2}
            contentContainerStyle={s.zone2Content}
            keyboardShouldPersistTaps="handled"
          >
            {/* Column headers */}
            <View style={s.colHeaderRow}>
              {cols.map(col => (
                <View key={col} style={s.colHeaderCell}>
                  <Text style={s.colHeaderText}>{col}</Text>
                </View>
              ))}
            </View>

            {/* Guess rows */}
            {guesses.map((row, i) => {
              const isNewest = i === guesses.length - 1;
              return (
                <View key={i} style={s.guessRow}>
                  {row.map((tile, j) => (
                    <GuessGridTile
                      key={j}
                      value={tile.value}
                      state={tile.state}
                      flipDelay={isNewest ? j * 120 : 0}
                    />
                  ))}
                </View>
              );
            })}

            {/* Result card */}
            {gameState === 'won' && selectedPlayer && (
              <ParticleBurst>
                <View style={s.resultCard}>
                  <Text style={s.resultTitle}>
                    Got it in {guesses.length}/{MAX_GUESSES} guesses!
                  </Text>
                  <Text style={s.resultPlayerName}>{selectedPlayer.name}</Text>
                  <View style={s.resultActions}>
                    <PrimaryButton label="Play Again" onPress={resetGame} />
                    <GhostButton label="Back to Games" onPress={onBack} />
                  </View>
                </View>
              </ParticleBurst>
            )}

            {gameState === 'lost' && selectedPlayer && (
              <View style={s.resultCard}>
                <Text style={s.resultTitle}>Not quite!</Text>
                <Text style={s.resultSubtitle}>The player was:</Text>
                <Text style={s.resultPlayerName}>{selectedPlayer.name}</Text>
                <View style={s.resultActions}>
                  <PrimaryButton label="Play Again" onPress={resetGame} />
                  <GhostButton label="Back to Games" onPress={onBack} />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Bottom search bar (hidden when game over) */}
          {gameState === 'playing' && (
            <View style={s.guessInputArea}>
              <View style={s.searchWrap}>
                <Search size={18} color={darkColors.textSecondary} strokeWidth={2} />
                <TextInput
                  style={s.searchInput}
                  placeholder="Guess a player..."
                  placeholderTextColor={darkColors.textSecondary}
                  value={guessSearchText}
                  onChangeText={t => {
                    setGuessSearchText(t);
                    setGuessShowDropdown(t.length >= 2);
                  }}
                  autoCorrect={false}
                  autoCapitalize="words"
                />
              </View>

              {guessShowDropdown && guessSuggestions.length > 0 && (
                <View style={s.guessDropdown}>
                  {guessSuggestions.map(name => {
                    const attrs = getPlayerAttrs(name, activeLeague);
                    const team = attrs
                      ? activeLeague === 'MLB'
                        ? (attrs as MLBAttrs).team
                        : (attrs as NBAAttrs | NFLAttrs | NHLAttrs).team
                      : '';
                    return (
                      <Pressable
                        key={name}
                        style={s.dropdownItem}
                        onPress={() => submitGuess(name)}
                      >
                        <Text style={s.dropdownName}>{name}</Text>
                        <Text style={s.dropdownTeam}>{team}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ── Phase router ───────────────────────────────────────────────────────────

  if (phase === 'setup') return renderSetup();
  if (phase === 'handoff') return renderHandoff();
  return renderGuessing();
}

// ── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: darkColors.background,
  },

  // Zone 1 — Brand header
  zone1: {
    backgroundColor: colors.brand,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 28,
    color: colors.white,
    flex: 1,
  },
  subtitle: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.70)',
    marginBottom: spacing.sm,
  },

  // Zone 2 — Content area
  zone2: {
    flex: 1,
    backgroundColor: darkColors.background,
  },
  zone2Content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'],
    paddingBottom: 120,
  },

  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: darkColors.border,
    marginBottom: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.white,
    marginLeft: spacing.sm,
  },

  // Dropdown
  dropdown: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkColors.border,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: darkColors.border,
  },
  dropdownName: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    color: colors.white,
  },
  dropdownTeam: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: darkColors.textSecondary,
    marginTop: 2,
  },

  // Confirmation card (3D raised)
  confirmCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    padding: spacing['2xl'],
    alignItems: 'center',
    marginVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
  },
  confirmName: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 22,
    color: colors.brand,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  confirmTeam: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: darkColors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },

  // Action buttons
  actionArea: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },

  // Manual entry link
  manualLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  manualLinkText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.accentCyan,
  },

  // Manual form
  manualForm: {
    backgroundColor: darkColors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  manualFormTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  manualFieldWrap: {
    gap: spacing.xs,
  },
  manualFieldLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: darkColors.textSecondary,
  },
  manualFieldInput: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 44,
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.white,
    borderWidth: 1,
    borderColor: darkColors.border,
  },

  // Handoff screen
  handoffContainer: {
    flex: 1,
    backgroundColor: darkColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['3xl'],
    gap: spacing.lg,
  },
  handoffTitle: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 24,
    color: colors.white,
    textAlign: 'center',
  },
  handoffSubtitle: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: darkColors.textSecondary,
    textAlign: 'center',
  },
  handoffButton: {
    width: '100%',
    marginTop: spacing['5xl'],
  },

  // Guessing — column headers
  colHeaderRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: spacing.sm,
  },
  colHeaderCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  colHeaderText: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    color: darkColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Guess rows
  guessRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },

  // Result card (3D raised)
  resultCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    padding: spacing['2xl'],
    alignItems: 'center',
    marginTop: spacing['2xl'],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
  },
  resultTitle: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 28,
    color: colors.white,
    textAlign: 'center',
  },
  resultSubtitle: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: darkColors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  resultPlayerName: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 22,
    color: colors.brand,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  resultActions: {
    width: '100%',
    gap: spacing.md,
    marginTop: spacing['2xl'],
  },

  // Bottom guess input area
  guessInputArea: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
    paddingTop: spacing.sm,
    backgroundColor: darkColors.background,
  },
  guessDropdown: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkColors.border,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
});
