// No schema changes needed — mystery_player is stored as jsonb
// Run with:
// SUPABASE_SERVICE_ROLE_KEY=your-key npx ts-node --project scripts/tsconfig.json scripts/seed-nfl.ts

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://scloxktkudutupiyqvbx.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY env var is required')
  console.error('Usage: SUPABASE_SERVICE_ROLE_KEY=your-key npx ts-node --project scripts/tsconfig.json scripts/seed-nfl.ts')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

const games = [
  // ─── 2026-03-15 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-15', league: 'NFL',
    mystery_player: { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', position: 'QB', height: "6'3\"", jerseyNumber: 15, conference: 'AFC', college: 'Texas Tech', age: 29, stats: { passing_yards: 3928, tds: 26, qbr: 78.7 } },
    showdown_player_a: { name: 'Lamar Jackson', team: 'Baltimore Ravens', stats: { pass_yds: 4172, pass_tds: 41, ints: 4 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Josh Allen', team: 'Buffalo Bills', stats: { pass_yds: 3731, pass_tds: 28, ints: 6 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER QB IN 2024?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Lamar Jackson won his third MVP award in 2024 with 41 TDs and only 4 INTs, posting a 119.6 passer rating — one of the greatest QB seasons ever.',
    blind_rank_players: [
      { name: 'Lamar Jackson', team: 'Baltimore Ravens', rankingStat: 41, statLabel: 'Pass TDs' },
      { name: 'Joe Burrow', team: 'Cincinnati Bengals', rankingStat: 43, statLabel: 'Pass TDs' },
      { name: 'Josh Allen', team: 'Buffalo Bills', rankingStat: 28, statLabel: 'Pass TDs' },
      { name: 'Jalen Hurts', team: 'Philadelphia Eagles', rankingStat: 26, statLabel: 'Pass TDs' },
      { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', rankingStat: 26, statLabel: 'Pass TDs' },
    ],
    blind_rank_category: 'RANK BY OVERALL GREATNESS',
    trivia_questions: [
      { question: 'How many Super Bowls has Patrick Mahomes won as of 2025?', options: ['2', '3', '4', '1'], correctIndex: 1, explanation: 'Mahomes won Super Bowls after the 2019, 2022, and 2023 seasons — three rings in five years.' },
      { question: 'Lamar Jackson won the MVP award in which two seasons before 2024?', options: ['2019 and 2021', '2019 and 2023', '2020 and 2022', '2018 and 2020'], correctIndex: 1, explanation: 'Lamar won MVP in 2019 (unanimous) and 2023, then again in 2024 for his third award.' },
      { question: 'Josh Allen played college football at which school?', options: ['Wyoming', 'Utah', 'Colorado', 'Boise State'], correctIndex: 0, explanation: 'Allen played at the University of Wyoming before being selected 7th overall by Buffalo in 2018.' },
    ],
  },
  // ─── 2026-03-16 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-16', league: 'NFL',
    mystery_player: { name: 'Ja\'Marr Chase', team: 'Cincinnati Bengals', position: 'WR', height: "6'0\"", jerseyNumber: 1, conference: 'AFC', college: 'LSU', age: 25, stats: { receptions: 127, receiving_yards: 1708, tds: 17 } },
    showdown_player_a: { name: 'Justin Jefferson', team: 'Minnesota Vikings', stats: { rec: 103, rec_yds: 1533, rec_tds: 10 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Ja\'Marr Chase', team: 'Cincinnati Bengals', stats: { rec: 127, rec_yds: 1708, rec_tds: 17 }, statLabel: '2024 Season' },
    showdown_category: 'WHO IS THE BEST WR IN THE NFL?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Chase won the 2024 Offensive Player of the Year with 127 catches, 1,708 yards, and 17 TDs — the best WR season in recent memory.',
    blind_rank_players: [
      { name: 'Ja\'Marr Chase', team: 'Cincinnati Bengals', rankingStat: 1708, statLabel: 'Rec Yds' },
      { name: 'Justin Jefferson', team: 'Minnesota Vikings', rankingStat: 1533, statLabel: 'Rec Yds' },
      { name: 'Tyreek Hill', team: 'Miami Dolphins', rankingStat: 1158, statLabel: 'Rec Yds' },
      { name: 'Davante Adams', team: 'New York Jets', rankingStat: 1144, statLabel: 'Rec Yds' },
      { name: 'Travis Kelce', team: 'Kansas City Chiefs', rankingStat: 823, statLabel: 'Rec Yds' },
    ],
    blind_rank_category: 'WHO WOULD YOU WANT IN THE PLAYOFFS?',
    trivia_questions: [
      { question: 'Ja\'Marr Chase and Joe Burrow were teammates at which college?', options: ['Alabama', 'LSU', 'Georgia', 'Ohio State'], correctIndex: 1, explanation: 'Chase and Burrow won the national championship together at LSU in 2019, then reunited in Cincinnati.' },
      { question: 'Justin Jefferson set the NFL record for most receiving yards in how many seasons?', options: ['3', '4', '5', '2'], correctIndex: 0, explanation: 'Jefferson set the record for most receiving yards through 3 seasons (2021-2023), surpassing Jerry Rice.' },
      { question: 'Tyreek Hill was traded to Miami from which team?', options: ['Kansas City Chiefs', 'Green Bay Packers', 'Tennessee Titans', 'Las Vegas Raiders'], correctIndex: 0, explanation: 'Hill was traded from the Chiefs to Miami in 2022 in a blockbuster deal for multiple draft picks.' },
    ],
  },
  // ─── 2026-03-17 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-17', league: 'NFL',
    mystery_player: { name: 'Travis Kelce', team: 'Kansas City Chiefs', position: 'TE', height: "6'5\"", jerseyNumber: 87, conference: 'AFC', college: 'Cincinnati', age: 35, stats: { receptions: 97, receiving_yards: 823, tds: 3 } },
    showdown_player_a: { name: 'Tom Brady', team: 'New England Patriots', stats: { pass_yds: 89214, pass_tds: 649, ints: 211 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Peyton Manning', team: 'Denver Broncos', stats: { pass_yds: 71940, pass_tds: 539, ints: 251 }, statLabel: 'Career' },
    showdown_category: 'GREATEST QB OF ALL TIME?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Brady edges Manning in career stats and championships — 7 Super Bowl rings, the all-time passing leaders, and the most wins in NFL history.',
    blind_rank_players: [
      { name: 'Tom Brady', team: 'Tampa Bay Buccaneers', rankingStat: 7, statLabel: 'Super Bowl Wins' },
      { name: 'Joe Montana', team: 'San Francisco 49ers', rankingStat: 4, statLabel: 'Super Bowl Wins' },
      { name: 'Peyton Manning', team: 'Denver Broncos', rankingStat: 2, statLabel: 'Super Bowl Wins' },
      { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', rankingStat: 3, statLabel: 'Super Bowl Wins' },
      { name: 'John Elway', team: 'Denver Broncos', rankingStat: 2, statLabel: 'Super Bowl Wins' },
    ],
    blind_rank_category: 'RANK BY IMPACT ON THE GAME',
    trivia_questions: [
      { question: 'Tom Brady won his 7th Super Bowl with which team?', options: ['New England Patriots', 'Tampa Bay Buccaneers', 'Los Angeles Rams', 'San Francisco 49ers'], correctIndex: 1, explanation: 'Brady won Super Bowl LV with the Tampa Bay Buccaneers in February 2021, his first year with the team.' },
      { question: 'Peyton Manning set the single-season TD record in 2013 with how many touchdowns?', options: ['49', '52', '55', '58'], correctIndex: 2, explanation: 'Manning threw 55 TDs in 2013 with Denver, breaking Brady\'s record of 50 set in 2007.' },
      { question: 'Travis Kelce has how many consecutive 1,000-yard receiving seasons as of 2024?', options: ['8', '9', '10', '11'], correctIndex: 2, explanation: 'Kelce set the NFL record with 10 consecutive 1,000-yard seasons from 2015-2024, the most ever by a TE.' },
    ],
  },
  // ─── 2026-03-18 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-18', league: 'NFL',
    mystery_player: { name: 'Joe Burrow', team: 'Cincinnati Bengals', position: 'QB', height: "6'4\"", jerseyNumber: 9, conference: 'AFC', college: 'LSU', age: 28, stats: { passing_yards: 4918, tds: 43, qbr: 78.9 } },
    showdown_player_a: { name: 'Jerry Rice', team: 'San Francisco 49ers', stats: { rec: 1549, rec_yds: 22895, rec_tds: 197 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Randy Moss', team: 'Minnesota Vikings', stats: { rec: 982, rec_yds: 15292, rec_tds: 156 }, statLabel: 'Career' },
    showdown_category: 'GREATEST WR OF ALL TIME?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Rice is the undisputed GOAT WR — all-time leader in catches, yards, and TDs by enormous margins across 20 seasons.',
    blind_rank_players: [
      { name: 'Joe Burrow', team: 'Cincinnati Bengals', rankingStat: 4218, statLabel: 'Pass Yds (2024)' },
      { name: 'Lamar Jackson', team: 'Baltimore Ravens', rankingStat: 4172, statLabel: 'Pass Yds (2024)' },
      { name: 'Jalen Hurts', team: 'Philadelphia Eagles', rankingStat: 3903, statLabel: 'Pass Yds (2024)' },
      { name: 'Josh Allen', team: 'Buffalo Bills', rankingStat: 3731, statLabel: 'Pass Yds (2024)' },
      { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', rankingStat: 4183, statLabel: 'Pass Yds (2024)' },
    ],
    blind_rank_category: 'WHO WAS THE HARDEST TO STOP?',
    trivia_questions: [
      { question: 'Jerry Rice won how many Super Bowls?', options: ['2', '3', '4', '1'], correctIndex: 1, explanation: 'Rice won three Super Bowls with the 49ers (XXIII, XXIV, XXIX) and appeared in a fourth.' },
      { question: 'Randy Moss set the single-season TD catch record in 2007 with how many TDs?', options: ['20', '21', '22', '23'], correctIndex: 3, explanation: 'Moss caught 23 touchdown passes in 2007 with the undefeated Patriots, breaking the single-season record.' },
      { question: 'Joe Burrow was the #1 overall pick in which year?', options: ['2018', '2019', '2020', '2021'], correctIndex: 2, explanation: 'Burrow won the Heisman and was selected #1 overall by the Bengals in the 2020 NFL Draft.' },
    ],
  },
  // ─── 2026-03-19 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-19', league: 'NFL',
    mystery_player: { name: 'Jalen Hurts', team: 'Philadelphia Eagles', position: 'QB', height: "6'1\"", jerseyNumber: 1, conference: 'NFC', college: 'Oklahoma', age: 26, stats: { passing_yards: 2903, tds: 18, qbr: 72.4 } },
    showdown_player_a: { name: 'Barry Sanders', team: 'Detroit Lions', stats: { rush_yds: 15269, rush_tds: 99, yards_per_carry: 5.0 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Emmitt Smith', team: 'Dallas Cowboys', stats: { rush_yds: 18355, rush_tds: 164, yards_per_carry: 4.2 }, statLabel: 'Career' },
    showdown_category: 'GREATEST RB OF ALL TIME?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Emmitt Smith is the all-time rushing yards leader with 18,355 yards and 164 TDs, plus 3 Super Bowl rings — the most accomplished RB in history.',
    blind_rank_players: [
      { name: 'Emmitt Smith', team: 'Dallas Cowboys', rankingStat: 18355, statLabel: 'Career Rush Yds' },
      { name: 'Walter Payton', team: 'Chicago Bears', rankingStat: 16726, statLabel: 'Career Rush Yds' },
      { name: 'Barry Sanders', team: 'Detroit Lions', rankingStat: 15269, statLabel: 'Career Rush Yds' },
      { name: 'Frank Gore', team: 'San Francisco 49ers', rankingStat: 16000, statLabel: 'Career Rush Yds' },
      { name: 'LaDainian Tomlinson', team: 'San Diego Chargers', rankingStat: 13684, statLabel: 'Career Rush Yds' },
    ],
    blind_rank_category: 'RANK BY LEGACY',
    trivia_questions: [
      { question: 'Barry Sanders abruptly retired with how many yards from Walter Payton\'s all-time rushing record?', options: ['1,457 yards', '1,222 yards', '1,000 yards', '2,001 yards'], correctIndex: 0, explanation: 'Sanders retired in 1999 just 1,457 yards short of breaking Payton\'s all-time record, shocking the football world.' },
      { question: 'Emmitt Smith won the Super Bowl MVP in which game?', options: ['XXVII', 'XXVIII', 'XXIX', 'XXX'], correctIndex: 1, explanation: 'Smith was MVP of Super Bowl XXVIII (January 1994), rushing for 132 yards and 2 TDs against the Bills.' },
      { question: 'Jalen Hurts set an Eagles QB record with how many rushing TDs in 2024?', options: ['10', '12', '14', '16'], correctIndex: 2, explanation: 'Hurts scored 14 rushing TDs in 2024, making him one of the most dangerous dual-threat QBs in NFL history.' },
    ],
  },
  // ─── 2026-03-20 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-20', league: 'NFL',
    mystery_player: { name: 'Tyreek Hill', team: 'Miami Dolphins', position: 'WR', height: "5'10\"", jerseyNumber: 10, conference: 'AFC', college: 'West Alabama', age: 30, stats: { receptions: 81, receiving_yards: 959, tds: 6 } },
    showdown_player_a: { name: 'Lawrence Taylor', team: 'New York Giants', stats: { sacks: 132.5, forced_fumbles: 33, pro_bowls: 10 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Deion Sanders', team: 'Dallas Cowboys', stats: { ints: 53, int_tds: 9, ret_tds: 19 }, statLabel: 'Career' },
    showdown_category: 'GREATEST DEFENSIVE PLAYER EVER?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'LT revolutionized the linebacker position, winning 2 Defensive Player of the Year awards and a Super Bowl while being named to the All-Time NFL Team.',
    blind_rank_players: [
      { name: 'Tyreek Hill', team: 'Miami Dolphins', rankingStat: 14.3, statLabel: 'Yards/Reception' },
      { name: 'Justin Jefferson', team: 'Minnesota Vikings', rankingStat: 14.9, statLabel: 'Yards/Reception' },
      { name: 'Ja\'Marr Chase', team: 'Cincinnati Bengals', rankingStat: 13.4, statLabel: 'Yards/Reception' },
      { name: 'Davante Adams', team: 'New York Jets', rankingStat: 13.1, statLabel: 'Yards/Reception' },
      { name: 'Travis Kelce', team: 'Kansas City Chiefs', rankingStat: 13.8, statLabel: 'Yards/Reception' },
    ],
    blind_rank_category: 'WHO CHANGED THE POSITION?',
    trivia_questions: [
      { question: 'Lawrence Taylor won how many Super Bowls with the Giants?', options: ['1', '2', '3', '0'], correctIndex: 1, explanation: 'LT won Super Bowls XXI and XXV with the New York Giants under coach Bill Parcells.' },
      { question: 'Deion Sanders played in the World Series AND the Super Bowl. Which teams did he play for?', options: ['Cowboys and Braves', 'Cowboys and Yankees', '49ers and Braves', 'Cowboys and Mets'], correctIndex: 2, explanation: 'Prime Time played in the 1992 World Series with Atlanta and Super Bowl XXIX with the 49ers in 1995.' },
      { question: 'Tyreek Hill\'s nickname is "Cheetah" for what reason?', options: ['He plays in Jacksonville (Jaguars city)', 'His top speed has been clocked near 23 mph', 'He went to Cheyenne High School', 'He\'s from Cheyenne, Wyoming'], correctIndex: 1, explanation: 'Hill has been clocked at nearly 23 mph on the field, making him one of the fastest players in NFL history.' },
    ],
  },
  // ─── 2026-03-21 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-21', league: 'NFL',
    mystery_player: { name: 'Justin Herbert', team: 'Los Angeles Chargers', position: 'QB', height: "6'6\"", jerseyNumber: 10, conference: 'AFC', college: 'Oregon', age: 26, stats: { passing_yards: 3870, tds: 23, qbr: 60.2 } },
    showdown_player_a: { name: 'Joe Montana', team: 'San Francisco 49ers', stats: { pass_yds: 40551, pass_tds: 273, ints: 139, rating: 92.3 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Johnny Unitas', team: 'Baltimore Colts', stats: { pass_yds: 40239, pass_tds: 290, ints: 253, rating: 78.2 }, statLabel: 'Career' },
    showdown_category: 'GREATEST PRE-SALARY CAP QB?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Montana never threw an interception in 4 Super Bowls (122 attempts), went 4-0, and was named MVP three times — a flawless postseason record.',
    blind_rank_players: [
      { name: 'Justin Herbert', team: 'Los Angeles Chargers', rankingStat: 3870, statLabel: 'Pass Yds (2024)' },
      { name: 'CJ Stroud', team: 'Houston Texans', rankingStat: 3727, statLabel: 'Pass Yds (2024)' },
      { name: 'Tua Tagovailoa', team: 'Miami Dolphins', rankingStat: 2165, statLabel: 'Pass Yds (2024)' },
      { name: 'Dak Prescott', team: 'Dallas Cowboys', rankingStat: 3869, statLabel: 'Pass Yds (2024)' },
      { name: 'Brock Purdy', team: 'San Francisco 49ers', rankingStat: 3864, statLabel: 'Pass Yds (2024)' },
    ],
    blind_rank_category: 'RANK BY CLUTCH PERFORMANCE',
    trivia_questions: [
      { question: 'Joe Montana threw zero interceptions across all 4 of his Super Bowl appearances — how many total attempts did he have?', options: ['98', '110', '122', '135'], correctIndex: 2, explanation: 'Montana completed 83 of 122 passes in Super Bowls without a single interception — the definition of clutch.' },
      { question: 'Johnny Unitas holds the record for throwing a TD in how many consecutive games?', options: ['40', '43', '47', '52'], correctIndex: 2, explanation: 'Unitas threw a TD pass in 47 consecutive games from 1956-1960, a record that stood for decades.' },
      { question: 'Justin Herbert won the Offensive Rookie of the Year award in which season?', options: ['2019', '2020', '2021', '2022'], correctIndex: 1, explanation: 'Herbert won the award in 2020 after being thrust into the starting role in week 2 and throwing 31 TDs.' },
    ],
  },
  // ─── 2026-03-22 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-22', league: 'NFL',
    mystery_player: { name: 'Davante Adams', team: 'New York Jets', position: 'WR', height: "6'1\"", jerseyNumber: 17, conference: 'AFC', college: 'Fresno State', age: 32, stats: { receptions: 91, receiving_yards: 1144, tds: 12 } },
    showdown_player_a: { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', stats: { pass_yds: 4183, pass_tds: 26, rating: 95.2 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Brock Purdy', team: 'San Francisco 49ers', stats: { pass_yds: 3864, pass_tds: 20, rating: 93.0 }, statLabel: '2024 Season' },
    showdown_category: 'WHO IS MORE VALUABLE TO THEIR TEAM?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Mahomes is the engine of the dynasty — 3 Super Bowls, 3 MVPs, 2 SB MVPs. Purdy is elite but the system around him is more responsible for the 49ers\' success.',
    blind_rank_players: [
      { name: 'Davante Adams', team: 'New York Jets', rankingStat: 9, statLabel: 'Receiving TDs (2024)' },
      { name: 'Tyreek Hill', team: 'Miami Dolphins', rankingStat: 7, statLabel: 'Receiving TDs (2024)' },
      { name: 'Justin Jefferson', team: 'Minnesota Vikings', rankingStat: 10, statLabel: 'Receiving TDs (2024)' },
      { name: 'Ja\'Marr Chase', team: 'Cincinnati Bengals', rankingStat: 17, statLabel: 'Receiving TDs (2024)' },
      { name: 'Travis Kelce', team: 'Kansas City Chiefs', rankingStat: 11, statLabel: 'Receiving TDs (2024)' },
    ],
    blind_rank_category: 'RANK BY OVERALL GREATNESS',
    trivia_questions: [
      { question: 'Davante Adams was drafted in which round of the 2014 NFL Draft?', options: ['1st', '2nd', '3rd', '4th'], correctIndex: 1, explanation: 'Adams was a 2nd-round pick (53rd overall) by the Packers in 2014 and became one of the best WRs in the NFL.' },
      { question: 'Brock Purdy was known as "Mr. Irrelevant" — what does that mean?', options: ['He was undrafted', 'He was the last pick in the draft', 'He went undrafted then signed as UDFA', 'He was the lowest-rated prospect'], correctIndex: 1, explanation: 'Purdy was the 262nd and final pick of the 2022 NFL Draft, earning the "Mr. Irrelevant" title — then started a Super Bowl run.' },
      { question: 'Patrick Mahomes won his first Super Bowl MVP at what age?', options: ['22', '23', '24', '25'], correctIndex: 2, explanation: 'Mahomes won Super Bowl LIV MVP at age 24, becoming the second-youngest QB to win the award in NFL history.' },
    ],
  },
  // ─── 2026-03-23 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-23', league: 'NFL',
    mystery_player: { name: 'CJ Stroud', team: 'Houston Texans', position: 'QB', height: "6'3\"", jerseyNumber: 7, conference: 'AFC', college: 'Ohio State', age: 23, stats: { passing_yards: 3727, tds: 20, qbr: 49.8 } },
    showdown_player_a: { name: 'Lawrence Taylor', team: 'New York Giants', stats: { sacks: 132.5, pro_bowls: 10, defensive_poy: 2 }, statLabel: 'Career Highlights' },
    showdown_player_b: { name: 'Reggie White', team: 'Philadelphia Eagles', stats: { sacks: 198.0, pro_bowls: 13, defensive_poy: 2 }, statLabel: 'Career Highlights' },
    showdown_category: 'GREATEST PASS RUSHER EVER?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Reggie White is the all-time sack leader with 198 career sacks, a 13-time Pro Bowler, and won a Super Bowl — "The Minister of Defense."',
    blind_rank_players: [
      { name: 'CJ Stroud', team: 'Houston Texans', rankingStat: 23, statLabel: 'Pass TDs (2024)' },
      { name: 'Justin Herbert', team: 'Los Angeles Chargers', rankingStat: 23, statLabel: 'Pass TDs (2024)' },
      { name: 'Brock Purdy', team: 'San Francisco 49ers', rankingStat: 20, statLabel: 'Pass TDs (2024)' },
      { name: 'Tua Tagovailoa', team: 'Miami Dolphins', rankingStat: 16, statLabel: 'Pass TDs (2024)' },
      { name: 'Dak Prescott', team: 'Dallas Cowboys', rankingStat: 22, statLabel: 'Pass TDs (2024)' },
    ],
    blind_rank_category: 'WHO WOULD YOU WANT IN THE PLAYOFFS?',
    trivia_questions: [
      { question: 'CJ Stroud won the NFL Offensive Rookie of the Year award in which season?', options: ['2022', '2023', '2024', '2025'], correctIndex: 1, explanation: 'Stroud had one of the greatest rookie QB seasons ever in 2023 — 4,108 yards, 23 TDs, and a playoff win.' },
      { question: 'Lawrence Taylor was the first player since 1986 to win NFL MVP as a defensive player. Who was the other?', options: ['Ronnie Lott', 'Dick Butkus', 'Alan Page', 'Mike Singletary'], correctIndex: 2, explanation: 'Alan Page won the 1971 NFL MVP — both he and LT are among the very few defensive players to win the award.' },
      { question: 'Reggie White played how many seasons in the NFL before retiring?', options: ['13', '15', '17', '16'], correctIndex: 2, explanation: 'White played 15 NFL seasons (1985-1998, 2000) plus 2 in the USFL, totaling 17 professional seasons.' },
    ],
  },
  // ─── 2026-03-24 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-24', league: 'NFL',
    mystery_player: { name: 'Dak Prescott', team: 'Dallas Cowboys', position: 'QB', height: "6'2\"", jerseyNumber: 4, conference: 'NFC', college: 'Mississippi State', age: 31, stats: { passing_yards: 1978, tds: 11, qbr: 39.7 } },
    showdown_player_a: { name: 'Deion Sanders', team: 'Dallas Cowboys', stats: { ints: 53, int_tds: 9, ret_tds: 19 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Ronnie Lott', team: 'San Francisco 49ers', stats: { ints: 63, defensive_poy: 1, pro_bowls: 10 }, statLabel: 'Career' },
    showdown_category: 'GREATEST DB OF ALL TIME?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Lott had 63 career INTs and won 4 Super Bowls, widely considered the most physically dominant and complete safety ever to play.',
    blind_rank_players: [
      { name: 'Dak Prescott', team: 'Dallas Cowboys', rankingStat: 3869, statLabel: 'Pass Yds (2024)' },
      { name: 'Jalen Hurts', team: 'Philadelphia Eagles', rankingStat: 3903, statLabel: 'Pass Yds (2024)' },
      { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', rankingStat: 4183, statLabel: 'Pass Yds (2024)' },
      { name: 'Joe Burrow', team: 'Cincinnati Bengals', rankingStat: 4218, statLabel: 'Pass Yds (2024)' },
      { name: 'Lamar Jackson', team: 'Baltimore Ravens', rankingStat: 4172, statLabel: 'Pass Yds (2024)' },
    ],
    blind_rank_category: 'RANK BY IMPACT ON THE GAME',
    trivia_questions: [
      { question: 'Deion Sanders played for how many NFL teams during his career?', options: ['3', '4', '5', '6'], correctIndex: 2, explanation: 'Prime Time played for the Falcons, 49ers, Cowboys, Redskins, and Ravens — 5 teams over 14 seasons.' },
      { question: 'Dak Prescott went undrafted — FALSE. What round was he picked?', options: ['3rd round', '4th round', '5th round', '6th round'], correctIndex: 1, explanation: 'Prescott was a 4th-round pick (135th overall) by Dallas in 2016, then won the starting job as a rookie.' },
      { question: 'Ronnie Lott famously amputated the tip of his finger to avoid missing playing time. In which season?', options: ['1982', '1984', '1985', '1986'], correctIndex: 3, explanation: 'In 1986, Lott chose to amputate the tip of his left pinky rather than miss games — the ultimate commitment to the team.' },
    ],
  },
  // ─── 2026-03-25 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-25', league: 'NFL',
    mystery_player: { name: 'Tua Tagovailoa', team: 'Miami Dolphins', position: 'QB', height: "6'1\"", jerseyNumber: 1, conference: 'AFC', college: 'Alabama', age: 27, stats: { passing_yards: 2867, tds: 19, qbr: 52.4 } },
    showdown_player_a: { name: 'Emmitt Smith', team: 'Dallas Cowboys', stats: { rush_yds: 18355, rush_tds: 164, yards_per_carry: 4.2 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Barry Sanders', team: 'Detroit Lions', stats: { rush_yds: 15269, rush_tds: 99, yards_per_carry: 5.0 }, statLabel: 'Career' },
    showdown_category: 'WHO WAS THE MORE EXCITING RB?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Sanders was the most elusive runner of all time — 5.0 YPC career average, countless broken plays, and the most jaw-dropping highlights in RB history.',
    blind_rank_players: [
      { name: 'Tua Tagovailoa', team: 'Miami Dolphins', rankingStat: 16, statLabel: 'Pass TDs (2024)' },
      { name: 'Justin Herbert', team: 'Los Angeles Chargers', rankingStat: 23, statLabel: 'Pass TDs (2024)' },
      { name: 'Dak Prescott', team: 'Dallas Cowboys', rankingStat: 22, statLabel: 'Pass TDs (2024)' },
      { name: 'CJ Stroud', team: 'Houston Texans', rankingStat: 23, statLabel: 'Pass TDs (2024)' },
      { name: 'Brock Purdy', team: 'San Francisco 49ers', rankingStat: 20, statLabel: 'Pass TDs (2024)' },
    ],
    blind_rank_category: 'WHO WAS THE HARDEST TO STOP?',
    trivia_questions: [
      { question: 'Tua Tagovailoa was the starting QB at Alabama when they lost the national title in which year?', options: ['2017', '2018', '2019', '2020'], correctIndex: 1, explanation: 'Tua replaced Jalen Hurts at halftime of the 2018 national championship and led Alabama to victory, then started in 2019.' },
      { question: 'Barry Sanders ran for 2,053 yards in 1997, making him one of few backs to rush for how many yards in a season?', options: ['1,500+', '1,800+', '2,000+', '2,200+'], correctIndex: 2, explanation: 'Sanders is one of only three players ever to rush for 2,000+ yards in a season, joining Eric Dickerson and Jamal Lewis.' },
      { question: 'Which team did Emmitt Smith finish his career with?', options: ['Dallas Cowboys', 'Arizona Cardinals', 'Denver Broncos', 'Green Bay Packers'], correctIndex: 1, explanation: 'Smith played his final two seasons (2003-04) with the Arizona Cardinals before retiring as the all-time rushing leader.' },
    ],
  },
  // ─── 2026-03-26 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-26', league: 'NFL',
    mystery_player: { name: 'Brock Purdy', team: 'San Francisco 49ers', position: 'QB', height: "6'1\"", jerseyNumber: 13, conference: 'NFC', college: 'Iowa State', age: 25, stats: { passing_yards: 3864, tds: 20, qbr: 61.0 } },
    showdown_player_a: { name: 'Randy Moss', team: 'New England Patriots', stats: { rec_tds: 23, rec_yds: 1493 }, statLabel: '2007 Season' },
    showdown_player_b: { name: 'Jerry Rice', team: 'San Francisco 49ers', stats: { rec_tds: 22, rec_yds: 1848 }, statLabel: '1987 Season (16 games)' },
    showdown_category: 'GREATEST SINGLE SEASON BY A WR?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Rice\'s 1987 season is the standard — 22 TDs in just 12 games due to a strike (1848 yards, 16.6 YPC), with a pace that far exceeds Moss\' 2007.',
    blind_rank_players: [
      { name: 'Brock Purdy', team: 'San Francisco 49ers', rankingStat: 93.0, statLabel: 'Passer Rating (2024)' },
      { name: 'Lamar Jackson', team: 'Baltimore Ravens', rankingStat: 119.6, statLabel: 'Passer Rating (2024)' },
      { name: 'Joe Burrow', team: 'Cincinnati Bengals', rankingStat: 106.1, statLabel: 'Passer Rating (2024)' },
      { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', rankingStat: 95.2, statLabel: 'Passer Rating (2024)' },
      { name: 'Tua Tagovailoa', team: 'Miami Dolphins', rankingStat: 92.4, statLabel: 'Passer Rating (2024)' },
    ],
    blind_rank_category: 'RANK BY LEGACY',
    trivia_questions: [
      { question: 'Brock Purdy was selected with which pick number in the 2022 NFL Draft?', options: ['245th', '250th', '259th', '262nd'], correctIndex: 3, explanation: 'Purdy was the 262nd pick — the very last selection in the draft, earning the "Mr. Irrelevant" title.' },
      { question: 'Randy Moss played for how many different NFL teams?', options: ['3', '4', '5', '6'], correctIndex: 2, explanation: 'Moss played for Minnesota, Oakland, New England, Minnesota (again), San Francisco, and Tennessee — 5 different franchises.' },
      { question: 'Jerry Rice won the Super Bowl MVP in which game with a 215-yard, 3-TD performance?', options: ['Super Bowl XIX', 'Super Bowl XXIII', 'Super Bowl XXIX', 'Super Bowl XXIV'], correctIndex: 1, explanation: 'Rice was Super Bowl XXIII MVP with 11 catches for 215 yards, though Joe Montana threw the game-winning TD.' },
    ],
  },
  // ─── 2026-03-27 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-27', league: 'NFL',
    mystery_player: { name: 'Lamar Jackson', team: 'Baltimore Ravens', position: 'QB', height: "6'2\"", jerseyNumber: 8, conference: 'AFC', college: 'Louisville', age: 28, stats: { passing_yards: 4172, tds: 41, qbr: 81.0 } },
    showdown_player_a: { name: 'Ja\'Marr Chase', team: 'Cincinnati Bengals', stats: { rec: 127, rec_yds: 1708, rec_tds: 17 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Justin Jefferson', team: 'Minnesota Vikings', stats: { rec: 103, rec_yds: 1533, rec_tds: 10 }, statLabel: '2024 Season' },
    showdown_category: 'WHO HAD THE BETTER 2024 SEASON?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Chase\'s 2024 season was historically dominant — 127 catches, 1,708 yards, 17 TDs and the Offensive Player of the Year award.',
    blind_rank_players: [
      { name: 'Lamar Jackson', team: 'Baltimore Ravens', rankingStat: 4, statLabel: 'Interceptions (2024)' },
      { name: 'Brock Purdy', team: 'San Francisco 49ers', rankingStat: 12, statLabel: 'Interceptions (2024)' },
      { name: 'Jalen Hurts', team: 'Philadelphia Eagles', rankingStat: 6, statLabel: 'Interceptions (2024)' },
      { name: 'Joe Burrow', team: 'Cincinnati Bengals', rankingStat: 11, statLabel: 'Interceptions (2024)' },
      { name: 'Josh Allen', team: 'Buffalo Bills', rankingStat: 6, statLabel: 'Interceptions (2024)' },
    ],
    blind_rank_category: 'WHO CHANGED THE POSITION?',
    trivia_questions: [
      { question: 'Lamar Jackson\'s 119.6 passer rating in 2024 was the highest single-season rating in NFL history at the time. What was the previous record?', options: ['121.1 by Aaron Rodgers', '112.2 by Nick Foles', '113.3 by Lamar Jackson himself', '110.4 by Tom Brady'], correctIndex: 2, explanation: 'Jackson himself held the previous record from 2019 (113.3 rating), then shattered it with his 119.6 mark in 2024.' },
      { question: 'Ja\'Marr Chase wore what jersey number at LSU?', options: ['1', '4', '7', '17'], correctIndex: 1, explanation: 'Chase wore #4 at LSU during the 2019 national championship season alongside Joe Burrow.' },
      { question: 'Justin Jefferson\'s 1,533 receiving yards in 2024 — how many consecutive 1,000-yard seasons was this for him?', options: ['3', '4', '5', 'All seasons except one with injury'], correctIndex: 3, explanation: 'Jefferson has had 1,000+ yards in every healthy season — he missed most of 2023 with injury but returned strong in 2024.' },
    ],
  },
  // ─── 2026-03-28 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-28', league: 'NFL',
    mystery_player: { name: 'Josh Allen', team: 'Buffalo Bills', position: 'QB', height: "6'5\"", jerseyNumber: 17, conference: 'AFC', college: 'Wyoming', age: 28, stats: { passing_yards: 3731, tds: 28, qbr: 72.8 } },
    showdown_player_a: { name: 'Tom Brady', team: 'New England Patriots', stats: { super_bowls: 7, mvp_awards: 3, pass_rating: 97.0 }, statLabel: 'Career Highlights' },
    showdown_player_b: { name: 'Joe Montana', team: 'San Francisco 49ers', stats: { super_bowls: 4, mvp_awards: 2, pass_rating: 92.3 }, statLabel: 'Career Highlights' },
    showdown_category: 'WHO IS THE NFL\'S ALL-TIME GREATEST QB?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Brady has 7 rings, the all-time passing records, and played at a high level into his mid-40s. His sheer volume of success is unmatched.',
    blind_rank_players: [
      { name: 'Josh Allen', team: 'Buffalo Bills', rankingStat: 12, statLabel: 'Rush TDs (2024)' },
      { name: 'Jalen Hurts', team: 'Philadelphia Eagles', rankingStat: 14, statLabel: 'Rush TDs (2024)' },
      { name: 'Lamar Jackson', team: 'Baltimore Ravens', rankingStat: 4, statLabel: 'Rush TDs (2024)' },
      { name: 'CJ Stroud', team: 'Houston Texans', rankingStat: 2, statLabel: 'Rush TDs (2024)' },
      { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', rankingStat: 4, statLabel: 'Rush TDs (2024)' },
    ],
    blind_rank_category: 'RANK BY CLUTCH PERFORMANCE',
    trivia_questions: [
      { question: 'Josh Allen set the single-season record for rushing TDs by a quarterback with 15 in which year?', options: ['2019', '2020', '2021', '2022'], correctIndex: 1, explanation: 'Allen set the all-time single-season record for rushing TDs by a quarterback with 15 in 2020, cementing his status as the most dangerous rushing QB in the NFL.' },
      { question: 'Tom Brady\'s sixth Super Bowl win came against which team?', options: ['Los Angeles Rams', 'Philadelphia Eagles', 'Kansas City Chiefs', 'San Francisco 49ers'], correctIndex: 0, explanation: 'Brady won Super Bowl LIII against the Rams 13-3, with the defense carrying what was his lowest-scoring championship win.' },
      { question: 'Joe Montana was born and raised in which state?', options: ['California', 'Ohio', 'Pennsylvania', 'Texas'], correctIndex: 2, explanation: 'Montana grew up in Monongahela, Pennsylvania and played at Notre Dame before being drafted by the 49ers in 1979.' },
    ],
  },
  // ─── 2026-03-29 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-29', league: 'NFL',
    mystery_player: { name: 'Peyton Manning', team: 'Indianapolis Colts', position: 'QB', height: "6'5\"", jerseyNumber: 18, conference: 'AFC', college: 'Tennessee', age: 49, stats: { passing_yards: 71940, tds: 539, qbr: 65.3 } },
    showdown_player_a: { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', stats: { age_at_SB_win: 24, super_bowls: 3 }, statLabel: 'Super Bowl Success' },
    showdown_player_b: { name: 'Lamar Jackson', team: 'Baltimore Ravens', stats: { mvp_awards: 3, pass_tds: 41 }, statLabel: '2024 Dominance' },
    showdown_category: 'WHO IS THE BEST ACTIVE QB?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Mahomes has 3 Super Bowl rings and 3 MVPs — championship pedigree puts him ahead of any peer, including the brilliant Jackson.',
    blind_rank_players: [
      { name: 'Peyton Manning', team: 'Indianapolis Colts', rankingStat: 539, statLabel: 'Career Pass TDs' },
      { name: 'Tom Brady', team: 'Tampa Bay Buccaneers', rankingStat: 649, statLabel: 'Career Pass TDs' },
      { name: 'Drew Brees', team: 'New Orleans Saints', rankingStat: 571, statLabel: 'Career Pass TDs' },
      { name: 'Brett Favre', team: 'Green Bay Packers', rankingStat: 508, statLabel: 'Career Pass TDs' },
      { name: 'Philip Rivers', team: 'San Diego Chargers', rankingStat: 421, statLabel: 'Career Pass TDs' },
    ],
    blind_rank_category: 'RANK BY OVERALL GREATNESS',
    trivia_questions: [
      { question: 'Peyton Manning\'s 55 TD season in 2013 broke whose record?', options: ['Dan Marino', 'Tom Brady', 'Brett Favre', 'Steve Young'], correctIndex: 1, explanation: 'Manning broke Brady\'s single-season record of 50 TDs set in 2007, throwing for 55 TDs with 5,477 yards.' },
      { question: 'Peyton Manning was drafted #1 overall in 1998. Who was the controversial runner-up pick for teams that wanted a different QB?', options: ['Ryan Leaf', 'Cade McNown', 'Akili Smith', 'Tim Couch'], correctIndex: 0, explanation: 'San Diego took Ryan Leaf #2 overall in the most lopsided top-2 pick comparison in NFL history.' },
      { question: 'Peyton Manning won Super Bowls with which two franchises?', options: ['Colts and Broncos', 'Colts and Patriots', 'Broncos and Colts (different order)', 'Colts only'], correctIndex: 0, explanation: 'Manning won Super Bowl XLI with the Colts (2006 season) and Super Bowl 50 with Denver (2015 season).' },
    ],
  },
  // ─── 2026-03-30 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-30', league: 'NFL',
    mystery_player: { name: 'Deion Sanders', team: 'Dallas Cowboys', position: 'CB', height: "6'1\"", jerseyNumber: 21, conference: 'NFC', college: 'Florida State', age: 57, stats: { tackles: 512, sacks: 0.0, ints: 53 } },
    showdown_player_a: { name: 'Jerry Rice', team: 'San Francisco 49ers', stats: { rec: 1549, rec_yds: 22895, rec_tds: 197 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Randy Moss', team: 'Minnesota Vikings', stats: { tds_per_catch: 0.159, rec_tds: 156, single_season_tds: 23 }, statLabel: 'Career / Best Season' },
    showdown_category: 'WHO WAS THE MORE DANGEROUS SCORER?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Moss had an elite TD-per-catch rate and his 23-TD season was historic — when healthy, he was the most dangerous red zone threat the league has seen.',
    blind_rank_players: [
      { name: 'Deion Sanders', team: 'Dallas Cowboys', rankingStat: 8, statLabel: 'Pro Bowl Selections' },
      { name: 'Lawrence Taylor', team: 'New York Giants', rankingStat: 10, statLabel: 'Pro Bowl Selections' },
      { name: 'Jerry Rice', team: 'San Francisco 49ers', rankingStat: 13, statLabel: 'Pro Bowl Selections' },
      { name: 'Reggie White', team: 'Green Bay Packers', rankingStat: 13, statLabel: 'Pro Bowl Selections' },
      { name: 'Emmitt Smith', team: 'Dallas Cowboys', rankingStat: 8, statLabel: 'Pro Bowl Selections' },
    ],
    blind_rank_category: 'WHO WOULD YOU WANT IN THE PLAYOFFS?',
    trivia_questions: [
      { question: 'Deion Sanders earned what nickname that became his brand?', options: ['The Shutdown', 'Prime Time', 'Neon Deion', 'Both B and C'], correctIndex: 3, explanation: 'Sanders was known as both "Prime Time" (for his big-game showmanship) and "Neon Deion" (for his flashy personality).' },
      { question: 'Which team did Deion Sanders win his first Super Bowl with?', options: ['Dallas Cowboys', 'San Francisco 49ers', 'Atlanta Falcons', 'Washington Redskins'], correctIndex: 1, explanation: 'Sanders won Super Bowl XXIX with the 49ers in January 1995 before joining Dallas the following season.' },
      { question: 'Randy Moss\' famous one-handed catch in the 2000 Pro Bowl is often cited as one of the most athletic plays ever. Which jersey number did he wear?', options: ['84', '18', '81', '89'], correctIndex: 0, explanation: 'Moss wore #84 with the Vikings, one of the most iconic jersey-number combinations in NFL history.' },
    ],
  },
  // ─── 2026-03-31 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-31', league: 'NFL',
    mystery_player: { name: 'Tom Brady', team: 'Tampa Bay Buccaneers', position: 'QB', height: "6'4\"", jerseyNumber: 12, conference: 'NFC', college: 'Michigan', age: 47, stats: { passing_yards: 89214, tds: 649, qbr: 68.8 } },
    showdown_player_a: { name: 'Lamar Jackson', team: 'Baltimore Ravens', stats: { mvp_count: 3, pass_rating: 119.6 }, statLabel: '2024 MVP Season' },
    showdown_player_b: { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', stats: { super_bowls: 3, playoff_wins: 16 }, statLabel: 'Career Championship Run' },
    showdown_category: 'WHO HAS THE BETTER NFL LEGACY SO FAR?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Mahomes\' championship pedigree — 3 Super Bowls and counting at age 29 — gives him the edge in legacy potential heading into his prime years.',
    blind_rank_players: [
      { name: 'Tom Brady', team: 'New England Patriots', rankingStat: 649, statLabel: 'Career Pass TDs' },
      { name: 'Peyton Manning', team: 'Indianapolis Colts', rankingStat: 539, statLabel: 'Career Pass TDs' },
      { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', rankingStat: 245, statLabel: 'Career Pass TDs (thru 2024)' },
      { name: 'Lamar Jackson', team: 'Baltimore Ravens', rankingStat: 190, statLabel: 'Career Pass TDs (thru 2024)' },
      { name: 'Josh Allen', team: 'Buffalo Bills', rankingStat: 208, statLabel: 'Career Pass TDs (thru 2024)' },
    ],
    blind_rank_category: 'RANK BY IMPACT ON THE GAME',
    trivia_questions: [
      { question: 'Tom Brady\'s career lasted how many NFL seasons?', options: ['20', '21', '22', '23'], correctIndex: 2, explanation: 'Brady played 23 NFL seasons (2000-2022), retiring at age 45 as the all-time leader in virtually every passing category.' },
      { question: 'What round was Tom Brady selected in the 2000 NFL Draft?', options: ['4th', '5th', '6th', '7th'], correctIndex: 2, explanation: 'Brady was the 199th pick in the 6th round — the most famous late-round steal in NFL draft history.' },
      { question: 'In which Super Bowl did Patrick Mahomes overcome a 10-point deficit to lead a championship win over the 49ers?', options: ['LIV', 'LVII', 'LVIII', 'LVI'], correctIndex: 2, explanation: 'Super Bowl LVIII: KC trailed SF 10-3, then Mahomes orchestrated a comeback in overtime for a 25-22 win.' },
    ],
  },
  // ─── 2026-04-01 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-01', league: 'NFL',
    mystery_player: { name: 'Jerry Rice', team: 'San Francisco 49ers', position: 'WR', height: "6'2\"", jerseyNumber: 80, conference: 'NFC', college: 'Mississippi Valley State', age: 62, stats: { receptions: 1549, receiving_yards: 22895, tds: 197 } },
    showdown_player_a: { name: 'Josh Allen', team: 'Buffalo Bills', stats: { pass_tds: 28, rush_tds: 12, total_tds: 40 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Jalen Hurts', team: 'Philadelphia Eagles', stats: { pass_tds: 25, rush_tds: 14, total_tds: 39 }, statLabel: '2024 Season' },
    showdown_category: 'MORE COMPLETE DUAL-THREAT QB IN 2024?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Allen edged Hurts with 40 combined TDs (28+12) to Hurts\' 39 (25+14) — and Allen had fewer turnovers with a higher overall passer rating.',
    blind_rank_players: [
      { name: 'Jerry Rice', team: 'San Francisco 49ers', rankingStat: 197, statLabel: 'Career Receiving TDs' },
      { name: 'Randy Moss', team: 'Minnesota Vikings', rankingStat: 156, statLabel: 'Career Receiving TDs' },
      { name: 'Terrell Owens', team: 'Philadelphia Eagles', rankingStat: 153, statLabel: 'Career Receiving TDs' },
      { name: 'Cris Carter', team: 'Minnesota Vikings', rankingStat: 130, statLabel: 'Career Receiving TDs' },
      { name: 'Marvin Harrison', team: 'Indianapolis Colts', rankingStat: 128, statLabel: 'Career Receiving TDs' },
    ],
    blind_rank_category: 'WHO WAS THE HARDEST TO STOP?',
    trivia_questions: [
      { question: 'Jerry Rice played for a small HBCU. Which school?', options: ['Grambling State', 'Mississippi Valley State', 'Howard', 'Florida A&M'], correctIndex: 1, explanation: 'Rice was discovered at Mississippi Valley State, where he caught 301 passes in 3 years under coach Archie Cooley.' },
      { question: 'Josh Allen was considered a reach at #7 overall by Buffalo — which QB was projected ahead of him?', options: ['Sam Darnold', 'Baker Mayfield', 'Lamar Jackson', 'Both A and B'], correctIndex: 3, explanation: 'Both Darnold (#3) and Mayfield (#1) went ahead of Allen in the famous 2018 QB class that changed the league.' },
      { question: 'Jalen Hurts transferred from Alabama to which school before his senior season?', options: ['Georgia', 'Oklahoma', 'LSU', 'Florida'], correctIndex: 1, explanation: 'After losing his starting job to Tua, Hurts transferred to Oklahoma where he finished 2nd in Heisman voting in 2019.' },
    ],
  },
  // ─── 2026-04-02 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-02', league: 'NFL',
    mystery_player: { name: 'Randy Moss', team: 'Minnesota Vikings', position: 'WR', height: "6'4\"", jerseyNumber: 84, conference: 'NFC', college: 'Marshall', age: 48, stats: { receptions: 982, receiving_yards: 15292, tds: 156 } },
    showdown_player_a: { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', stats: { pass_tds: 26, rating: 95.2, td_int_ratio: 2.36 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Joe Burrow', team: 'Cincinnati Bengals', stats: { pass_tds: 43, rating: 106.1, td_int_ratio: 3.9 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS MORE EFFICIENT IN 2024?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Burrow\'s 43 TDs against just 11 INTs (3.9:1 ratio) with a 106.1 rating makes 2024 one of the most efficient passing seasons ever.',
    blind_rank_players: [
      { name: 'Randy Moss', team: 'Minnesota Vikings', rankingStat: 982, statLabel: 'Career Receptions' },
      { name: 'Jerry Rice', team: 'San Francisco 49ers', rankingStat: 1549, statLabel: 'Career Receptions' },
      { name: 'Terrell Owens', team: 'Philadelphia Eagles', rankingStat: 1078, statLabel: 'Career Receptions' },
      { name: 'Cris Carter', team: 'Minnesota Vikings', rankingStat: 1101, statLabel: 'Career Receptions' },
      { name: 'Larry Fitzgerald', team: 'Arizona Cardinals', rankingStat: 1432, statLabel: 'Career Receptions' },
    ],
    blind_rank_category: 'RANK BY LEGACY',
    trivia_questions: [
      { question: 'Randy Moss originally committed to play football AND basketball at which school before controversy derailed it?', options: ['Notre Dame', 'Florida State', 'Ohio State', 'Michigan'], correctIndex: 1, explanation: 'Moss committed to Florida State before a legal issue caused him to end up at Marshall, where he dominated.' },
      { question: 'Joe Burrow\'s 43 TDs in 2024 set a Bengals single-season record. Who held the previous record?', options: ['Ken Anderson', 'Boomer Esiason', 'Carson Palmer', 'Joe Burrow himself (2021)'], correctIndex: 3, explanation: 'Burrow threw 34 TDs in 2021, then shattered his own record with 43 in 2024 during his return from injury.' },
      { question: 'Patrick Mahomes\' father played how many seasons in Major League Baseball?', options: ['6', '11', '15', '20'], correctIndex: 1, explanation: 'Pat Mahomes Sr. pitched in MLB for 11 seasons (1992-2003) for teams including the Twins, Mets, and Cubs.' },
    ],
  },
  // ─── 2026-04-03 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-03', league: 'NFL',
    mystery_player: { name: 'Barry Sanders', team: 'Detroit Lions', position: 'RB', height: "5'8\"", jerseyNumber: 20, conference: 'NFC', college: 'Oklahoma State', age: 56, stats: { rushing_yards: 15269, tds: 99, ypc: 5.0 } },
    showdown_player_a: { name: 'Lamar Jackson', team: 'Baltimore Ravens', stats: { pass_tds: 41, ints: 4, td_int_ratio: 10.25 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Joe Montana', team: 'San Francisco 49ers', stats: { career_td_int_ratio: 1.96, super_bowl_ints: 0 }, statLabel: 'Career / Postseason' },
    showdown_category: 'MORE ACCURATE QB: PEAK LAMAR OR MONTANA?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Lamar\'s 2024 TD:INT ratio of 10.25:1 is historically unprecedented — even Montana\'s flawless postseason career can\'t touch that single-season dominance.',
    blind_rank_players: [
      { name: 'Barry Sanders', team: 'Detroit Lions', rankingStat: 5.0, statLabel: 'Career Yards/Carry' },
      { name: 'Jim Brown', team: 'Cleveland Browns', rankingStat: 5.2, statLabel: 'Career Yards/Carry' },
      { name: 'Adrian Peterson', team: 'Minnesota Vikings', rankingStat: 4.6, statLabel: 'Career Yards/Carry' },
      { name: 'Marshall Faulk', team: 'St. Louis Rams', rankingStat: 4.3, statLabel: 'Career Yards/Carry' },
      { name: 'Emmitt Smith', team: 'Dallas Cowboys', rankingStat: 4.2, statLabel: 'Career Yards/Carry' },
    ],
    blind_rank_category: 'WHO CHANGED THE POSITION?',
    trivia_questions: [
      { question: 'Barry Sanders won the Heisman Trophy in 1988 while playing for which school?', options: ['Michigan', 'Nebraska', 'Oklahoma State', 'Texas A&M'], correctIndex: 2, explanation: 'Sanders ran for 2,628 yards and 37 TDs in a single season at Oklahoma State — one of the greatest Heisman seasons ever.' },
      { question: 'In which season did Lamar Jackson post his historic 10:1 TD-to-INT ratio?', options: ['2019', '2022', '2023', '2024'], correctIndex: 3, explanation: 'In 2024, Jackson threw 41 TDs and only 4 INTs — a 10.25:1 ratio that shattered all previous records for a QB with 35+ TDs.' },
      { question: 'Joe Montana never threw a single interception in how many Super Bowl games?', options: ['2', '3', '4', '5'], correctIndex: 2, explanation: 'Montana played in 4 Super Bowls, completed 83 of 122 passes with 11 TDs and zero interceptions — a perfect postseason record.' },
    ],
  },
  // ─── 2026-04-04 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-04', league: 'NFL',
    mystery_player: { name: 'Justin Jefferson', team: 'Minnesota Vikings', position: 'WR', height: "6'1\"", jerseyNumber: 18, conference: 'NFC', college: 'LSU', age: 25, stats: { receptions: 103, receiving_yards: 1533, tds: 10 } },
    showdown_player_a: { name: 'Tom Brady', team: 'New England Patriots', stats: { pass_yds: 89214, super_bowls: 7, seasons_played: 23 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Peyton Manning', team: 'Indianapolis Colts', stats: { pass_tds: 539, mvp_awards: 5, regular_season_wins: 186 }, statLabel: 'Career' },
    showdown_category: 'BRADY VS MANNING: WHO WINS?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Brady went 3-2 against Manning in the playoffs including wins when it mattered most — and 7 Super Bowls beats Manning\'s 2 every argument.',
    blind_rank_players: [
      { name: 'Justin Jefferson', team: 'Minnesota Vikings', rankingStat: 14.9, statLabel: 'Yards Per Reception (2024)' },
      { name: 'Randy Moss', team: 'Minnesota Vikings', rankingStat: 15.6, statLabel: 'Career Yards Per Reception' },
      { name: 'Jerry Rice', team: 'San Francisco 49ers', rankingStat: 14.8, statLabel: 'Career Yards Per Reception' },
      { name: 'Davante Adams', team: 'New York Jets', rankingStat: 13.1, statLabel: 'Career Yards Per Reception' },
      { name: 'Tyreek Hill', team: 'Miami Dolphins', rankingStat: 14.3, statLabel: 'Career Yards Per Reception' },
    ],
    blind_rank_category: 'RANK BY CLUTCH PERFORMANCE',
    trivia_questions: [
      { question: 'Justin Jefferson was taken 22nd overall in 2020. Which team passed on him immediately before Minnesota?', options: ['Green Bay Packers', 'Kansas City Chiefs', 'Tampa Bay Buccaneers', 'New Orleans Saints'], correctIndex: 0, explanation: 'The Packers took Jordan Love at #26 — Jefferson went #22, and Packer fans have never let Aaron Rodgers forget it.' },
      { question: 'Peyton Manning won how many NFL MVP awards — the most in NFL history?', options: ['3', '4', '5', '6'], correctIndex: 2, explanation: 'Manning won 5 NFL MVP awards (2003, 2004, 2008, 2009, 2013) — the most of any player in NFL history.' },
      { question: 'Tom Brady won his first Super Bowl against which heavily favored team?', options: ['San Francisco 49ers', 'St. Louis Rams', 'Philadelphia Eagles', 'Pittsburgh Steelers'], correctIndex: 1, explanation: 'Brady upset the "Greatest Show on Turf" St. Louis Rams 20-17 in Super Bowl XXXVI — arguably the biggest upset in Super Bowl history at the time.' },
    ],
  },
  // ─── 2026-04-05 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-05', league: 'NFL',
    mystery_player: { name: 'Emmitt Smith', team: 'Dallas Cowboys', position: 'RB', height: "5'9\"", jerseyNumber: 22, conference: 'NFC', college: 'Florida', age: 55, stats: { rushing_yards: 18355, tds: 164, ypc: 4.2 } },
    showdown_player_a: { name: 'Josh Allen', team: 'Buffalo Bills', stats: { pass_yds: 3731, pass_tds: 28, rush_yds: 531 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', stats: { pass_yds: 4183, pass_tds: 26, super_bowls: 3 }, statLabel: '2024 Season + Legacy' },
    showdown_category: 'WHO WINS SUPER BOWL LIX?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'The Chiefs\' organizational depth, Mahomes\' clutch gene, and Andy Reid\'s scheming have consistently outperformed Buffalo in big moments.',
    blind_rank_players: [
      { name: 'Emmitt Smith', team: 'Dallas Cowboys', rankingStat: 164, statLabel: 'Career Rush TDs' },
      { name: 'LaDainian Tomlinson', team: 'San Diego Chargers', rankingStat: 145, statLabel: 'Career Rush TDs' },
      { name: 'Walter Payton', team: 'Chicago Bears', rankingStat: 110, statLabel: 'Career Rush TDs' },
      { name: 'Marcus Allen', team: 'Los Angeles Raiders', rankingStat: 123, statLabel: 'Career Rush TDs' },
      { name: 'Adrian Peterson', team: 'Minnesota Vikings', rankingStat: 120, statLabel: 'Career Rush TDs' },
    ],
    blind_rank_category: 'RANK BY OVERALL GREATNESS',
    trivia_questions: [
      { question: 'Emmitt Smith played all his Pro Bowl seasons with the Cowboys. How many consecutive 1,000-yard seasons did he have?', options: ['7', '9', '11', '13'], correctIndex: 2, explanation: 'Smith had 11 consecutive 1,000-yard seasons (1991-2001), the most ever by an NFL running back.' },
      { question: 'Josh Allen has appeared in how many AFC Championship Games as of 2025?', options: ['2', '3', '4', '5'], correctIndex: 2, explanation: 'Allen has led Buffalo to 4 AFC Championship appearances but has yet to break through to the Super Bowl.' },
      { question: 'Patrick Mahomes has won how many regular-season MVP awards in addition to his 3 Super Bowls?', options: ['1', '2', '3', '4'], correctIndex: 1, explanation: 'Mahomes has won 2 regular season MVPs (2018, 2022), plus 3 Super Bowl rings and 2 Super Bowl MVPs.' },
    ],
  },
  // ─── 2026-04-06 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-06', league: 'NFL',
    mystery_player: { name: 'Lawrence Taylor', team: 'New York Giants', position: 'LB', height: "6'3\"", jerseyNumber: 56, conference: 'NFC', college: 'North Carolina', age: 66, stats: { tackles: 1088, sacks: 132.5, ints: 9 } },
    showdown_player_a: { name: 'Peyton Manning', team: 'Indianapolis Colts', stats: { td_int_ratio: 2.15, yards_per_attempt: 7.7 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Tom Brady', team: 'New England Patriots', stats: { td_int_ratio: 3.07, yards_per_attempt: 7.4 }, statLabel: 'Career' },
    showdown_category: 'WHO HAD THE BETTER PURE QB STATS?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Brady\'s career TD:INT ratio of 3.07:1 is far superior to Manning\'s 2.15:1, reflecting Brady\'s elite ball security over 23 seasons.',
    blind_rank_players: [
      { name: 'Lawrence Taylor', team: 'New York Giants', rankingStat: 132.5, statLabel: 'Career Sacks' },
      { name: 'Reggie White', team: 'Green Bay Packers', rankingStat: 198.0, statLabel: 'Career Sacks' },
      { name: 'Bruce Smith', team: 'Buffalo Bills', rankingStat: 200.0, statLabel: 'Career Sacks' },
      { name: 'Chris Doleman', team: 'Minnesota Vikings', rankingStat: 150.5, statLabel: 'Career Sacks' },
      { name: 'Kevin Greene', team: 'Pittsburgh Steelers', rankingStat: 160.0, statLabel: 'Career Sacks' },
    ],
    blind_rank_category: 'WHO WOULD YOU WANT IN THE PLAYOFFS?',
    trivia_questions: [
      { question: 'Lawrence Taylor won the NFL MVP award in which year — rare for a defensive player?', options: ['1983', '1984', '1985', '1986'], correctIndex: 3, explanation: 'LT won the 1986 NFL MVP with 20.5 sacks — one of only two defensive players to win the award in NFL history.' },
      { question: 'Tom Brady\'s career TD:INT ratio of ~3:1 is the best all-time for a QB with 500+ TDs. True or False?', options: ['True', 'False'], correctIndex: 0, explanation: 'Brady\'s 3.07:1 ratio with 649 TDs and 211 INTs is unmatched at elite volume — no other QB approaches it at scale.' },
      { question: 'Peyton Manning called audibles at the line using famous code words. What term did he use most famously?', options: ['Blue 42', 'Omaha', 'Red 19', 'Kill Kill'], correctIndex: 1, explanation: '"Omaha!" became Manning\'s signature audible call at the line, used to reset the play before the snap.' },
    ],
  },
  // ─── 2026-04-07 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-07', league: 'NFL',
    mystery_player: { name: 'Joe Montana', team: 'San Francisco 49ers', position: 'QB', height: "6'2\"", jerseyNumber: 16, conference: 'NFC', college: 'Notre Dame', age: 69, stats: { passing_yards: 40551, tds: 273, qbr: 92.3 } },
    showdown_player_a: { name: 'Travis Kelce', team: 'Kansas City Chiefs', stats: { rec: 97, rec_yds: 1338, rec_tds: 11 }, statLabel: '2023 Season' },
    showdown_player_b: { name: 'Jerry Rice', team: 'San Francisco 49ers', stats: { rec: 122, rec_yds: 1848, rec_tds: 22 }, statLabel: '1987 Season (12 games)' },
    showdown_category: 'GREATEST SKILL PLAYER SEASON EVER?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Rice\'s 1987 season — 22 TDs in 12 games during a strike-shortened year — projects to 29+ TDs over 16 games, the most prolific per-game pace in history.',
    blind_rank_players: [
      { name: 'Joe Montana', team: 'San Francisco 49ers', rankingStat: 273, statLabel: 'Career Pass TDs' },
      { name: 'Johnny Unitas', team: 'Baltimore Colts', rankingStat: 290, statLabel: 'Career Pass TDs' },
      { name: 'Fran Tarkenton', team: 'Minnesota Vikings', rankingStat: 342, statLabel: 'Career Pass TDs' },
      { name: 'Dan Marino', team: 'Miami Dolphins', rankingStat: 420, statLabel: 'Career Pass TDs' },
      { name: 'Brett Favre', team: 'Green Bay Packers', rankingStat: 508, statLabel: 'Career Pass TDs' },
    ],
    blind_rank_category: 'RANK BY IMPACT ON THE GAME',
    trivia_questions: [
      { question: 'Joe Montana\'s famous drive to win Super Bowl XXIII — how much time was left when he took over?', options: ['3:10', '3:20', '3:45', '2:55'], correctIndex: 0, explanation: 'With 3:10 left and trailing 16-13, Montana led an 11-play, 92-yard TD drive — ending with a TD pass to John Taylor.' },
      { question: 'Travis Kelce holds the record for consecutive seasons with how many receiving yards as a TE?', options: ['800+', '900+', '1,000+', '1,100+'], correctIndex: 2, explanation: 'Kelce has 10 consecutive 1,000-yard seasons, the most ever by a TE in NFL history.' },
      { question: 'Jerry Rice\'s catching coach at Mississippi Valley State reportedly had him run routes until he could catch ________ without drops?', options: ['50 consecutive', '100 consecutive', '500 consecutive', '100 in a row blindfolded'], correctIndex: 1, explanation: 'Rice was legendary for his work ethic, running precise routes and catching 100 consecutive passes in practice before going full speed.' },
    ],
  },
  // ─── 2026-04-08 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-08', league: 'NFL',
    mystery_player: { name: 'Johnny Unitas', team: 'Baltimore Colts', position: 'QB', height: "6'1\"", jerseyNumber: 19, conference: 'AFC', college: 'Louisville', age: 89, stats: { passing_yards: 40239, tds: 290, qbr: 78.2 } },
    showdown_player_a: { name: 'Lamar Jackson', team: 'Baltimore Ravens', stats: { career_rush_yds: 6100, rushing_TDs: 34 }, statLabel: 'Career thru 2024' },
    showdown_player_b: { name: 'Michael Vick', team: 'Atlanta Falcons', stats: { career_rush_yds: 6109, rushing_TDs: 36 }, statLabel: 'Career' },
    showdown_category: 'GREATEST RUSHING QB EVER?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Jackson combined elite rushing with elite passing — his 6,100+ career rush yards came while also being a 3x MVP passer, something Vick never achieved.',
    blind_rank_players: [
      { name: 'Johnny Unitas', team: 'Baltimore Colts', rankingStat: 47, statLabel: 'Consecutive Games With TD Pass' },
      { name: 'Peyton Manning', team: 'Indianapolis Colts', rankingStat: 51, statLabel: 'Consecutive Games With TD Pass' },
      { name: 'Drew Brees', team: 'New Orleans Saints', rankingStat: 54, statLabel: 'Consecutive Games With TD Pass' },
      { name: 'Tom Brady', team: 'New England Patriots', rankingStat: 52, statLabel: 'Consecutive Games With TD Pass' },
      { name: 'Aaron Rodgers', team: 'Green Bay Packers', rankingStat: 36, statLabel: 'Consecutive Games With TD Pass' },
    ],
    blind_rank_category: 'WHO WAS THE HARDEST TO STOP?',
    trivia_questions: [
      { question: 'Johnny Unitas famously wore flat-top shoes. What were they called?', options: ['High-tops', 'Black high-tops', 'Black cleats', 'Johnny U shoes'], correctIndex: 1, explanation: 'Unitas was known for wearing black high-top cleats — his signature look that became iconic in 1950s football culture.' },
      { question: 'Lamar Jackson set the NFL single-season record for rushing yards by a QB in which year?', options: ['2018', '2019', '2020', '2021'], correctIndex: 1, explanation: 'Jackson rushed for 1,206 yards in 2019, breaking Michael Vick\'s single-season QB rushing record of 1,039 yards.' },
      { question: 'Michael Vick was selected #1 overall in the 2001 NFL Draft. Which team picked him?', options: ['San Diego Chargers', 'San Francisco 49ers', 'Atlanta Falcons', 'Cleveland Browns'], correctIndex: 2, explanation: 'Vick was drafted #1 overall directly by the Atlanta Falcons in 2001, where he played until 2006 before his career hiatus and later revival with the Eagles and other teams.' },
    ],
  },
  // ─── 2026-04-09 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-09', league: 'NFL',
    mystery_player: { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', position: 'QB', height: "6'3\"", jerseyNumber: 15, conference: 'AFC', college: 'Texas Tech', age: 29, stats: { passing_yards: 3928, tds: 26, qbr: 78.7 } },
    showdown_player_a: { name: 'Jalen Hurts', team: 'Philadelphia Eagles', stats: { pass_tds: 25, rush_tds: 14, total_tds: 39 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'CJ Stroud', team: 'Houston Texans', stats: { pass_tds: 23, completion_pct: 65.0, rating: 90.1 }, statLabel: '2024 Season' },
    showdown_category: 'BETTER YOUNG QB IN 2024?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Hurts led Philly to the Super Bowl with a historic dual-threat performance, demonstrating he\'s a step ahead of Stroud at this stage of their careers.',
    blind_rank_players: [
      { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', rankingStat: 3, statLabel: 'Super Bowl Wins (career thru 2025)' },
      { name: 'Tom Brady', team: 'Tampa Bay Buccaneers', rankingStat: 7, statLabel: 'Career Super Bowl Wins' },
      { name: 'Joe Montana', team: 'San Francisco 49ers', rankingStat: 4, statLabel: 'Career Super Bowl Wins' },
      { name: 'Terry Bradshaw', team: 'Pittsburgh Steelers', rankingStat: 4, statLabel: 'Career Super Bowl Wins' },
      { name: 'Troy Aikman', team: 'Dallas Cowboys', rankingStat: 3, statLabel: 'Career Super Bowl Wins' },
    ],
    blind_rank_category: 'RANK BY LEGACY',
    trivia_questions: [
      { question: 'Patrick Mahomes was originally a two-sport prospect — what was his other sport?', options: ['Basketball', 'Baseball', 'Track', 'Soccer'], correctIndex: 1, explanation: 'Mahomes was drafted by the Detroit Tigers in the 2014 MLB Draft before choosing to focus solely on football at Texas Tech.' },
      { question: 'Jalen Hurts won the Super Bowl in the 2024 season, becoming the first Eagles QB to do so since who?', options: ['Ron Jaworski', 'Donovan McNabb', 'Nick Foles', 'No Eagles QB has ever won a Super Bowl'], correctIndex: 2, explanation: 'Nick Foles won Super Bowl LII (2017 season) over the Patriots; Hurts won Super Bowl LIX (2024 season) to give Philly its second ring.' },
      { question: 'CJ Stroud\'s Houston Texans upset which team in his rookie playoff appearance?', options: ['Kansas City Chiefs', 'Baltimore Ravens', 'Buffalo Bills', 'Cleveland Browns'], correctIndex: 3, explanation: 'Stroud\'s Texans upset the Cleveland Browns 45-14 in the 2023 wild card game — the most lopsided upset of that playoff round.' },
    ],
  },
  // ─── 2026-04-10 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-10', league: 'NFL',
    mystery_player: { name: 'Jalen Hurts', team: 'Philadelphia Eagles', position: 'QB', height: "6'1\"", jerseyNumber: 1, conference: 'NFC', college: 'Oklahoma', age: 26, stats: { passing_yards: 2903, tds: 18, qbr: 72.4 } },
    showdown_player_a: { name: 'Barry Sanders', team: 'Detroit Lions', stats: { rush_yds: 2053, year: 1997 }, statLabel: '1997 Season' },
    showdown_player_b: { name: 'Emmitt Smith', team: 'Dallas Cowboys', stats: { rush_yds: 1773, rush_tds: 25, year: 1995 }, statLabel: '1995 Season' },
    showdown_category: 'BETTER SINGLE SEASON: SANDERS \'97 OR SMITH \'95?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Sanders\' 2,053-yard season put him over 2,000 yards for the first time and was arguably more impressive given he was on a much weaker team.',
    blind_rank_players: [
      { name: 'Jalen Hurts', team: 'Philadelphia Eagles', rankingStat: 39, statLabel: 'Total TDs (Pass+Rush, 2024)' },
      { name: 'Josh Allen', team: 'Buffalo Bills', rankingStat: 40, statLabel: 'Total TDs (Pass+Rush, 2024)' },
      { name: 'Lamar Jackson', team: 'Baltimore Ravens', rankingStat: 45, statLabel: 'Total TDs (Pass+Rush, 2024)' },
      { name: 'Joe Burrow', team: 'Cincinnati Bengals', rankingStat: 44, statLabel: 'Total TDs (Pass+Rush, 2024)' },
      { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', rankingStat: 30, statLabel: 'Total TDs (Pass+Rush, 2024)' },
    ],
    blind_rank_category: 'WHO CHANGED THE POSITION?',
    trivia_questions: [
      { question: 'Jalen Hurts became the first QB to rush for how many TDs while also throwing for 20+ in a Super Bowl season?', options: ['12', '13', '14', '15'], correctIndex: 2, explanation: 'Hurts\' 14 rushing TDs alongside 25 passing TDs in 2024 is an unprecedented dual-threat Super Bowl season.' },
      { question: 'Barry Sanders retired abruptly in July 1999 — how did he notify the Lions?', options: ['Press conference', 'Through his agent', 'Fax to a newspaper in England', 'Letter to the team'], correctIndex: 2, explanation: 'Sanders announced his retirement via fax to his hometown paper in Wichita, Kansas — stunning the football world.' },
      { question: 'Emmitt Smith\'s 25 rushing TDs in 1995 was the second-highest single-season mark ever. Who holds the record?', options: ['John Riggins', 'LaDainian Tomlinson', 'Shaun Alexander', 'Jim Brown'], correctIndex: 1, explanation: 'LaDainian Tomlinson set the all-time record with 28 rushing TDs in 2006, breaking Shaun Alexander\'s 2005 mark of 27.' },
    ],
  },
  // ─── 2026-04-11 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-11', league: 'NFL',
    mystery_player: { name: 'Josh Allen', team: 'Buffalo Bills', position: 'QB', height: "6'5\"", jerseyNumber: 17, conference: 'AFC', college: 'Wyoming', age: 28, stats: { passing_yards: 3731, tds: 28, qbr: 72.8 } },
    showdown_player_a: { name: 'Tyreek Hill', team: 'Miami Dolphins', stats: { yards_per_game: 14.3, explosive_plays: 31 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Ja\'Marr Chase', team: 'Cincinnati Bengals', stats: { rec: 127, rec_yds: 1708, rec_tds: 17 }, statLabel: '2024 Season' },
    showdown_category: 'MOST EXPLOSIVE WR IN 2024?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Chase\'s 17 TDs and 1,708 yards — combined with more catches (127 vs Hill\'s 81) — gave him more explosiveness with greater consistency.',
    blind_rank_players: [
      { name: 'Josh Allen', team: 'Buffalo Bills', rankingStat: 531, statLabel: 'Rush Yards (2024)' },
      { name: 'Jalen Hurts', team: 'Philadelphia Eagles', rankingStat: 726, statLabel: 'Rush Yards (2024)' },
      { name: 'Lamar Jackson', team: 'Baltimore Ravens', rankingStat: 915, statLabel: 'Rush Yards (2024)' },
      { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', rankingStat: 287, statLabel: 'Rush Yards (2024)' },
      { name: 'CJ Stroud', team: 'Houston Texans', rankingStat: 142, statLabel: 'Rush Yards (2024)' },
    ],
    blind_rank_category: 'RANK BY CLUTCH PERFORMANCE',
    trivia_questions: [
      { question: 'Josh Allen has thrown for 4,000+ yards in how many consecutive seasons (through 2024)?', options: ['3', '4', '5', '6'], correctIndex: 2, explanation: 'Allen crossed 4,000 yards in 2020, 2021, 2022, 2023, and would have in 2024 had he not been more selective — he had 3,731 in 2024.' },
      { question: 'Tyreek Hill ran the 40-yard dash in what time at the NFL Combine?', options: ['4.28 seconds', '4.29 seconds', '4.31 seconds', '4.35 seconds'], correctIndex: 0, explanation: 'Hill ran a 4.28 40-yard dash at the 2016 Combine, one of the fastest ever recorded — confirming his status as the NFL\'s fastest player.' },
      { question: 'Ja\'Marr Chase opted out of the 2020 college season. In which bowl game did he dominate as part of LSU\'s 2019 national championship run?', options: ['Fiesta Bowl', 'Rose Bowl', 'Peach Bowl', 'CFP National Championship'], correctIndex: 3, explanation: 'Chase had 9 catches for 221 yards and 2 TDs in the CFP National Championship against Clemson in the 2019 season.' },
    ],
  },
  // ─── 2026-04-12 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-12', league: 'NFL',
    mystery_player: { name: 'Tua Tagovailoa', team: 'Miami Dolphins', position: 'QB', height: "6'1\"", jerseyNumber: 1, conference: 'AFC', college: 'Alabama', age: 27, stats: { passing_yards: 2867, tds: 19, qbr: 52.4 } },
    showdown_player_a: { name: 'Johnny Unitas', team: 'Baltimore Colts', stats: { consecutive_td_games: 47, era: '1956-1960' }, statLabel: 'Historic Record' },
    showdown_player_b: { name: 'Drew Brees', team: 'New Orleans Saints', stats: { consecutive_td_games: 54, era: '2009-2012' }, statLabel: 'Modern Era Record' },
    showdown_category: 'MORE IMPRESSIVE CONSECUTIVE TD GAME STREAK?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Unitas\' 47-game streak came in the pre-forward-pass era when defenses were more dominant — setting the bar that others built on for decades.',
    blind_rank_players: [
      { name: 'Tua Tagovailoa', team: 'Miami Dolphins', rankingStat: 92.4, statLabel: 'Passer Rating (2024)' },
      { name: 'Justin Herbert', team: 'Los Angeles Chargers', rankingStat: 91.4, statLabel: 'Passer Rating (2024)' },
      { name: 'Dak Prescott', team: 'Dallas Cowboys', rankingStat: 90.7, statLabel: 'Passer Rating (2024)' },
      { name: 'CJ Stroud', team: 'Houston Texans', rankingStat: 90.1, statLabel: 'Passer Rating (2024)' },
      { name: 'Brock Purdy', team: 'San Francisco 49ers', rankingStat: 93.0, statLabel: 'Passer Rating (2024)' },
    ],
    blind_rank_category: 'RANK BY OVERALL GREATNESS',
    trivia_questions: [
      { question: 'Tua Tagovailoa\'s concussion in a 2022 Thursday Night Football game became an NFL safety scandal. Which team was he playing against?', options: ['New England Patriots', 'Cincinnati Bengals', 'Buffalo Bills', 'New York Jets'], correctIndex: 1, explanation: 'Tua suffered a serious concussion against the Bengals in September 2022, leading to widespread scrutiny of the NFL\'s concussion protocol.' },
      { question: 'Drew Brees\' 54-game TD streak was set while playing for which team?', options: ['San Diego Chargers', 'New Orleans Saints', 'Both teams had stretches', 'New England Patriots'], correctIndex: 1, explanation: 'Brees\' 54-game consecutive TD passing streak ran during his Saints years (2009-2012), set with the help of WRs Marques Colston and Jimmy Graham.' },
      { question: 'Johnny Unitas played most of his career for the Baltimore Colts but finished with which team?', options: ['Los Angeles Rams', 'Miami Dolphins', 'San Diego Chargers', 'Pittsburgh Steelers'], correctIndex: 2, explanation: 'Unitas played his final season (1973) with the San Diego Chargers after 17 legendary years with Baltimore.' },
    ],
  },
  // ─── 2026-04-13 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-13', league: 'NFL',
    mystery_player: { name: 'Dak Prescott', team: 'Dallas Cowboys', position: 'QB', height: "6'2\"", jerseyNumber: 4, conference: 'NFC', college: 'Mississippi State', age: 31, stats: { passing_yards: 1978, tds: 11, qbr: 39.7 } },
    showdown_player_a: { name: 'Tom Brady', team: 'New England Patriots', stats: { career_wins: 251, playoff_record: '35-12' }, statLabel: 'Career' },
    showdown_player_b: { name: 'Peyton Manning', team: 'Indianapolis Colts', stats: { regular_season_wins: 186, playoff_record: '27-13' }, statLabel: 'Career' },
    showdown_category: 'WHO WAS THE BETTER WINNER?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Brady\'s 251 career wins and 35 playoff wins are unmatched — he literally has the most wins in NFL history by any measure.',
    blind_rank_players: [
      { name: 'Dak Prescott', team: 'Dallas Cowboys', rankingStat: 208, statLabel: 'Career Pass TDs (thru 2024)' },
      { name: 'Josh Allen', team: 'Buffalo Bills', rankingStat: 208, statLabel: 'Career Pass TDs (thru 2024)' },
      { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', rankingStat: 245, statLabel: 'Career Pass TDs (thru 2024)' },
      { name: 'Lamar Jackson', team: 'Baltimore Ravens', rankingStat: 190, statLabel: 'Career Pass TDs (thru 2024)' },
      { name: 'Justin Herbert', team: 'Los Angeles Chargers', rankingStat: 152, statLabel: 'Career Pass TDs (thru 2024)' },
    ],
    blind_rank_category: 'WHO WOULD YOU WANT IN THE PLAYOFFS?',
    trivia_questions: [
      { question: 'Dak Prescott signed the largest contract in NFL history at the time of signing in which year?', options: ['2019', '2021', '2023', '2024'], correctIndex: 3, explanation: 'Prescott signed a 4-year, $240 million extension in 2024, making him the highest-paid player in NFL history at signing.' },
      { question: 'Tom Brady\'s perfect single-season record in 2007 — the Patriots went 16-0 — ended in which Super Bowl?', options: ['XLII', 'XLIII', 'XLIV', 'XLV'], correctIndex: 0, explanation: 'The 18-0 Patriots lost Super Bowl XLII to the Giants 17-14 on David Tyree\'s famous helmet catch, completing one of the greatest upsets.' },
      { question: 'Peyton Manning\'s older brother Cooper was also recruited to play what position at Ole Miss before illness ended his career?', options: ['QB', 'WR', 'TE', 'RB'], correctIndex: 1, explanation: 'Cooper Manning was a highly recruited wide receiver who had to retire before college due to spinal stenosis, paving the way for Peyton to take center stage.' },
    ],
  },
]

async function seed() {
  console.log(`Seeding ${games.length} NFL daily games...`)

  for (const game of games) {
    const { error } = await supabase
      .from('daily_games')
      .upsert(game, { onConflict: 'date,league' })

    if (error) {
      console.error(`Error seeding ${game.date} ${game.league}:`, error.message)
    } else {
      console.log(`✓ ${game.date} NFL`)
    }
  }

  console.log('Done!')
}

seed()
