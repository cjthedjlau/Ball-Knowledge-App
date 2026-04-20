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
    showdown_player_a: { name: 'Baker Mayfield', team: 'Tampa Bay Buccaneers', stats: { pass_yds: 4500, pass_tds: 41, ints: 16, comp_pct: 71.4 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Josh Allen', team: 'Buffalo Bills', stats: { pass_yds: 3731, pass_tds: 28, ints: 6, comp_pct: 63.6 }, statLabel: '2024 Season' },
    showdown_category: 'WHO HAD THE BETTER 2024 PASSING SEASON?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Baker Mayfield threw for more yards AND more touchdowns than Josh Allen in 2024 — a stat that would shock most fans who view Allen as a consensus top-3 QB.',
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
    showdown_player_a: { name: 'Nico Collins', team: 'Houston Texans', stats: { rec_yds: 1211, yds_per_rec: 16.8, rec_tds: 7, rec: 72 }, statLabel: '2024 Season (12 games)' },
    showdown_player_b: { name: 'CeeDee Lamb', team: 'Dallas Cowboys', stats: { rec_yds: 1057, yds_per_rec: 11.5, rec_tds: 6, rec: 92 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE MORE EXPLOSIVE RECEIVER IN 2024?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Nico Collins put up more yards and TDs than CeeDee Lamb while playing FOUR FEWER GAMES. His 16.8 yards per catch dwarfed Lamb\'s 11.5 — and most fans couldn\'t name him before this season.',
    blind_rank_players: [
      { name: 'Ja\'Marr Chase', team: 'Cincinnati Bengals', rankingStat: 1708, statLabel: 'Rec Yds' },
      { name: 'Justin Jefferson', team: 'Minnesota Vikings', rankingStat: 1533, statLabel: 'Rec Yds' },
      { name: 'Tyreek Hill', team: 'Dallas Cowboys', rankingStat: 1158, statLabel: 'Rec Yds' },
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
    showdown_player_a: { name: 'Myles Garrett', team: 'Detroit Lions', stats: { sacks: 14.0, tackles: 42, forced_fumbles: 4, qb_hits: 30 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Trey Hendrickson', team: 'Kansas City Chiefs', stats: { sacks: 17.5, tackles: 51, forced_fumbles: 5, qb_hits: 34 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER PASS RUSHER IN 2024?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Trey Hendrickson led the NFL with 17.5 sacks, outpacing reigning DPOY Myles Garrett in sacks, tackles, forced fumbles, AND QB hits — yet Garrett gets all the headlines.',
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
    showdown_player_a: { name: 'Derrick Henry', team: 'Baltimore Ravens', stats: { rush_yds: 1921, rush_tds: 16, ypc: 5.0, fumbles: 4 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Saquon Barkley', team: 'Philadelphia Eagles', stats: { rush_yds: 2005, rush_tds: 13, ypc: 5.8, fumbles: 2 }, statLabel: '2024 Season' },
    showdown_category: 'WHO HAD THE BETTER 2024 RUSHING SEASON?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Saquon Barkley rushed for 2,005 yards — joining the exclusive 2,000-yard club — with a better YPC and fewer fumbles, while Henry had more TDs. Stats are genuinely split, but Barkley\'s historic yardage total edges it.',
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
    showdown_player_a: { name: 'Jayden Daniels', team: 'Washington Commanders', stats: { pass_yds: 3568, pass_tds: 25, rush_yds: 891, comp_pct: 69.0 }, statLabel: '2024 Season (Rookie)' },
    showdown_player_b: { name: 'Jared Goff', team: 'Detroit Lions', stats: { pass_yds: 4629, pass_tds: 36, rush_yds: 36, comp_pct: 72.4 }, statLabel: '2024 Season' },
    showdown_category: 'WHO HAD THE BETTER 2024 SEASON?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Jayden Daniels combined 3,568 pass yards with 891 rush yards as a ROOKIE, winning OROY and leading Washington to the playoffs. Goff had gaudy passing stats but Daniels\' dual-threat impact was more valuable.',
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
    mystery_player: { name: 'Tyreek Hill', team: 'Dallas Cowboys', position: 'WR', height: "5'10\"", jerseyNumber: 10, conference: 'NFC', college: 'West Alabama', age: 30, stats: { receptions: 81, receiving_yards: 959, tds: 6 } },
    showdown_player_a: { name: 'Zack Baun', team: 'Philadelphia Eagles', stats: { tackles: 151, sacks: 3.5, ints: 3, forced_fumbles: 2 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Roquan Smith', team: 'Baltimore Ravens', stats: { tackles: 129, sacks: 2.0, ints: 1, forced_fumbles: 1 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER LINEBACKER IN 2024?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Zack Baun — a former career backup — exploded into a First-Team All-Pro in 2024, leading the NFL in tackles (151) and outperforming established star Roquan Smith in every major category. Nobody saw this coming.',
    blind_rank_players: [
      { name: 'Tyreek Hill', team: 'Dallas Cowboys', rankingStat: 14.3, statLabel: 'Yards/Reception' },
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
    showdown_player_a: { name: 'Joe Burrow', team: 'Cincinnati Bengals', stats: { pass_yds: 4918, pass_tds: 43, ints: 9, rating: 108.1 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Lamar Jackson', team: 'Baltimore Ravens', stats: { pass_yds: 4172, pass_tds: 41, ints: 4, rating: 119.6 }, statLabel: '2024 Season' },
    showdown_category: 'WHO HAD THE BETTER 2024 MVP-CALIBER SEASON?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Burrow threw for more yards and TDs, but Jackson\'s 4-INT season and 119.6 rating were historically unprecedented. Jackson won his 3rd MVP — the stats are split, but Jackson\'s efficiency was otherworldly.',
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
    showdown_player_a: { name: 'Tyreek Hill', team: 'Dallas Cowboys', stats: { rec: 81, rec_yds: 959, rec_tds: 6, yds_per_rec: 11.8 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Brian Thomas Jr.', team: 'Jacksonville Jaguars', stats: { rec: 87, rec_yds: 1282, rec_tds: 10, yds_per_rec: 14.7 }, statLabel: '2024 Season (Rookie)' },
    showdown_category: 'WHO WAS THE BETTER RECEIVER IN 2024?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'A rookie nobody talks about outproduced Tyreek Hill in every single category — more catches, more yards, more TDs, better yards per catch. Brian Thomas Jr. had a quietly elite season while Hill\'s production cratered.',
    blind_rank_players: [
      { name: 'Davante Adams', team: 'New York Jets', rankingStat: 9, statLabel: 'Receiving TDs (2024)' },
      { name: 'Tyreek Hill', team: 'Dallas Cowboys', rankingStat: 7, statLabel: 'Receiving TDs (2024)' },
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
    showdown_player_a: { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', stats: { pass_yds: 4183, pass_tds: 26, ints: 11, rating: 95.2 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Sam Darnold', team: 'Minnesota Vikings', stats: { pass_yds: 4319, pass_tds: 35, ints: 12, rating: 102.5 }, statLabel: '2024 Season' },
    showdown_category: 'WHO HAD THE BETTER 2024 REGULAR SEASON?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Sam Darnold — yes, THAT Sam Darnold — threw for more yards, more TDs, and had a higher passer rating than Patrick Mahomes in 2024. The biggest redemption arc in recent NFL history.',
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
    showdown_player_a: { name: 'Jahmyr Gibbs', team: 'Detroit Lions', stats: { rush_yds: 1412, total_tds: 16, ypc: 5.6, rec_yds: 517 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Josh Jacobs', team: 'Green Bay Packers', stats: { rush_yds: 1329, total_tds: 15, ypc: 4.4, rec_yds: 342 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER RUNNING BACK IN 2024?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Jahmyr Gibbs outproduced Josh Jacobs in rush yards, receiving yards, YPC, and total TDs while splitting carries with David Montgomery. Imagine his numbers with a full workload.',
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
    showdown_player_a: { name: 'Bijan Robinson', team: 'Atlanta Falcons', stats: { rush_yds: 1456, rush_tds: 11, ypc: 4.7, rec_yds: 232 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Chuba Hubbard', team: 'Carolina Panthers', stats: { rush_yds: 1195, rush_tds: 10, ypc: 4.4, rec_yds: 238 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER VALUE RUNNING BACK IN 2024?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'While Bijan Robinson had better raw stats, Chuba Hubbard produced Pro Bowl numbers on the worst offense in football — a 4th-round pick outperforming expectations on a 2-win team. Robinson had more talent around him and only marginally better numbers.',
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
    showdown_player_a: { name: 'DK Metcalf', team: 'Seattle Seahawks', stats: { rec: 66, rec_yds: 992, rec_tds: 5, yds_per_rec: 15.0 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Ladd McConkey', team: 'Los Angeles Chargers', stats: { rec: 82, rec_yds: 1149, rec_tds: 7, yds_per_rec: 14.0 }, statLabel: '2024 Season (Rookie)' },
    showdown_category: 'WHO WAS THE BETTER DEEP THREAT IN 2024?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'A 2nd-round rookie from Georgia outproduced the 6\'4" athletic freak DK Metcalf in catches, yards, and touchdowns. Ladd McConkey quietly had one of the best rookie WR seasons in years while Metcalf had his worst year.',
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
    showdown_player_a: { name: 'Micah Parsons', team: 'Dallas Cowboys', stats: { sacks: 6.5, tackles: 58, forced_fumbles: 3, qb_hits: 18 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'T.J. Watt', team: 'Pittsburgh Steelers', stats: { sacks: 11.5, tackles: 57, forced_fumbles: 5, qb_hits: 24 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER EDGE RUSHER IN 2024?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'T.J. Watt nearly doubled Parsons\' sack total, had more forced fumbles, and more QB hits. Parsons had one more tackle, but Watt dominated the pass rush categories despite getting less media hype in 2024.',
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
    showdown_player_a: { name: 'Jerry Rice', team: 'San Francisco 49ers', stats: { rec: 1549, rec_yds: 22895, rec_tds: 197, seasons: 20 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Randy Moss', team: 'Minnesota Vikings', stats: { rec: 982, rec_yds: 15292, rec_tds: 156, seasons: 14 }, statLabel: 'Career' },
    showdown_category: 'WHO HAD THE BETTER CAREER: LONGEVITY VS PEAK?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Rice leads in every counting stat by massive margins: +567 catches, +7,603 yards, +41 TDs. Moss had the higher peak talent, but Rice\'s relentless consistency over 20 seasons is untouchable.',
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
    showdown_player_a: { name: 'Bo Nix', team: 'Denver Broncos', stats: { pass_yds: 3775, pass_tds: 29, ints: 12, rush_yds: 430 }, statLabel: '2024 Season (Rookie)' },
    showdown_player_b: { name: 'Dak Prescott', team: 'Dallas Cowboys', stats: { pass_yds: 1978, pass_tds: 11, ints: 9, rush_yds: 57 }, statLabel: '2024 Season' },
    showdown_category: 'WHICH QB WAS THE BIGGER SURPRISE IN 2024?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'A 6th-round rookie outproduced the highest-paid QB in NFL history in every category. Bo Nix threw for nearly double the yards and nearly triple the TDs of Prescott, who signed a $240M deal before the season.',
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
    showdown_player_a: { name: 'Tom Brady', team: 'New England Patriots', stats: { pass_yds: 89214, pass_tds: 649, super_bowls: 7, mvp_awards: 3 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Peyton Manning', team: 'Indianapolis Colts', stats: { pass_yds: 71940, pass_tds: 539, super_bowls: 2, mvp_awards: 5 }, statLabel: 'Career' },
    showdown_category: 'GREATEST QB OF ALL TIME: RINGS VS AWARDS?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Manning won more MVPs (5 vs 3), but Brady leads in yards, TDs, and Super Bowls by enormous margins. The counting stats and championships give Brady the edge in the eternal debate.',
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
    showdown_player_a: { name: 'Xavier Worthy', team: 'Kansas City Chiefs', stats: { rec: 59, rec_yds: 638, rec_tds: 6, rush_tds: 3 }, statLabel: '2024 Season (Rookie)' },
    showdown_player_b: { name: 'Rashee Rice', team: 'Kansas City Chiefs', stats: { rec: 24, rec_yds: 288, rec_tds: 2, games: 4 }, statLabel: '2024 Season (Injured)' },
    showdown_category: 'WHO WAS MORE IMPACTFUL FOR THE CHIEFS IN 2024?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Xavier Worthy filled the speed void as a rookie with 9 total TDs after Rashee Rice went down with a torn ACL in Week 4. A 1st-round rookie stepped up when the Chiefs needed it most.',
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
    showdown_player_a: { name: 'Barry Sanders', team: 'Detroit Lions', stats: { rush_yds: 15269, ypc: 5.0, seasons: 10, pro_bowls: 10 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Emmitt Smith', team: 'Dallas Cowboys', stats: { rush_yds: 18355, ypc: 4.2, seasons: 15, pro_bowls: 8 }, statLabel: 'Career' },
    showdown_category: 'WHO WAS THE GREATER RUNNING BACK?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Smith has 3,000 more rush yards, but Sanders had a full 0.8 higher YPC, made the Pro Bowl every season he played, and did it all on a terrible Lions team. Sanders\' efficiency in just 10 seasons makes the stronger case for greatness.',
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
    showdown_player_a: { name: 'Puka Nacua', team: 'Los Angeles Rams', stats: { rec: 64, rec_yds: 990, rec_tds: 4, yds_per_rec: 15.5 }, statLabel: '2024 Season (Missed 5 Games)' },
    showdown_player_b: { name: 'Davante Adams', team: 'New York Jets', stats: { rec: 91, rec_yds: 1144, rec_tds: 12, yds_per_rec: 12.6 }, statLabel: '2024 Season (Traded Mid-Season)' },
    showdown_category: 'WHO HAD THE MORE IMPRESSIVE 2024 DESPITE ADVERSITY?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Davante Adams was traded mid-season from the Raiders to the Jets, adjusted to a new offense, and STILL put up 1,144 yards and 12 TDs. Nacua had a higher per-catch rate but Adams produced elite numbers through maximum chaos.',
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
    showdown_player_a: { name: 'Justin Jefferson', team: 'Minnesota Vikings', stats: { rec: 103, rec_yds: 1533, rec_tds: 10, targets: 139 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Malik Nabers', team: 'New York Giants', stats: { rec: 109, rec_yds: 1204, rec_tds: 7, targets: 166 }, statLabel: '2024 Season (Rookie)' },
    showdown_category: 'WHO WAS THE BETTER POSSESSION RECEIVER IN 2024?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'A rookie on the worst offense in football had MORE catches than Justin Jefferson while playing with a rotating carousel of terrible QBs. Malik Nabers\' 109 receptions on 166 targets as a rookie is absurd volume — Jefferson had better efficiency but Nabers\' production given context is more impressive.',
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
    showdown_player_a: { name: 'Lawrence Taylor', team: 'New York Giants', stats: { sacks: 132.5, dpoy_awards: 3, mvp_awards: 1, super_bowls: 2 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Reggie White', team: 'Green Bay Packers', stats: { sacks: 198.0, dpoy_awards: 2, mvp_awards: 0, super_bowls: 1 }, statLabel: 'Career' },
    showdown_category: 'WHO WAS THE MORE DOMINANT DEFENSIVE FORCE?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Reggie White has 65.5 MORE career sacks than LT, but Taylor won more DPOY awards, an MVP (as a defender!), and more rings. White wins the sack column decisively; Taylor wins the accolades. A genuinely split debate.',
    blind_rank_players: [
      { name: 'Justin Jefferson', team: 'Minnesota Vikings', rankingStat: 14.9, statLabel: 'Yards Per Reception (2024)' },
      { name: 'Randy Moss', team: 'Minnesota Vikings', rankingStat: 15.6, statLabel: 'Career Yards Per Reception' },
      { name: 'Jerry Rice', team: 'San Francisco 49ers', rankingStat: 14.8, statLabel: 'Career Yards Per Reception' },
      { name: 'Davante Adams', team: 'New York Jets', rankingStat: 13.1, statLabel: 'Career Yards Per Reception' },
      { name: 'Tyreek Hill', team: 'Dallas Cowboys', rankingStat: 14.3, statLabel: 'Career Yards Per Reception' },
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
    showdown_player_a: { name: 'Jalen Hurts', team: 'Philadelphia Eagles', stats: { pass_tds: 18, rush_tds: 14, total_tds: 32, comp_pct: 68.7 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Josh Allen', team: 'Buffalo Bills', stats: { pass_tds: 28, rush_tds: 12, total_tds: 40, comp_pct: 63.6 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER DUAL-THREAT QB IN 2024?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Allen had 8 more total TDs and led the league in that category. Hurts had more rush TDs and a higher comp%, but Allen\'s 40 combined TDs and playoff run give him the edge despite Hurts winning the Super Bowl.',
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
    showdown_player_a: { name: 'Joe Montana', team: 'San Francisco 49ers', stats: { super_bowls: 4, sb_mvps: 3, sb_passer_rating: 127.8, sb_ints: 0 }, statLabel: 'Career Postseason' },
    showdown_player_b: { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', stats: { super_bowls: 3, sb_mvps: 2, sb_passer_rating: 103.4, sb_ints: 3 }, statLabel: 'Career Postseason (thru 2024)' },
    showdown_category: 'WHO IS THE GREATER POSTSEASON QB?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Montana went 4-0 in Super Bowls with 3 MVPs and ZERO interceptions in 122 attempts. Mahomes has 3 rings but also 3 SB interceptions and a lower SB passer rating. Montana\'s postseason perfection still stands alone.',
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
    showdown_player_a: { name: 'Amari Cooper', team: 'Buffalo Bills', stats: { rec: 55, rec_yds: 737, rec_tds: 4, yds_per_rec: 13.4 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Tee Higgins', team: 'Kansas City Chiefs', stats: { rec: 73, rec_yds: 911, rec_tds: 10, yds_per_rec: 12.5 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER #2 RECEIVER IN 2024?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Tee Higgins outproduced Amari Cooper in catches, yards, and TDs while being the clear second option behind Ja\'Marr Chase. Cooper, a former All-Pro, had his worst season in years after being traded to Buffalo.',
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
    showdown_player_a: { name: 'Lamar Jackson', team: 'Baltimore Ravens', stats: { career_rush_yds: 6100, mvp_awards: 3, pass_rating_2024: 119.6, rush_tds: 34 }, statLabel: 'Career thru 2024' },
    showdown_player_b: { name: 'Michael Vick', team: 'Atlanta Falcons', stats: { career_rush_yds: 6109, mvp_awards: 0, best_pass_rating: 104.9, rush_tds: 36 }, statLabel: 'Career' },
    showdown_category: 'WHO IS THE GREATEST RUSHING QUARTERBACK EVER?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Vick has slightly more rush yards and TDs, but Jackson combined elite rushing with 3 MVP awards and historically great passing seasons. Vick never won an MVP or even made an All-Pro team. Jackson redefined the position; Vick was the prototype.',
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
    showdown_player_a: { name: 'Brock Bowers', team: 'Las Vegas Raiders', stats: { rec: 112, rec_yds: 1194, rec_tds: 5, targets: 140 }, statLabel: '2024 Season (Rookie TE)' },
    showdown_player_b: { name: 'Travis Kelce', team: 'Kansas City Chiefs', stats: { rec: 97, rec_yds: 823, rec_tds: 3, targets: 122 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER TIGHT END IN 2024?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'A rookie tight end on the worst team in football outproduced the greatest TE of all time in every category. Brock Bowers had more catches, more yards, and more TDs than Travis Kelce — and set the all-time rookie TE receptions record.',
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
    showdown_player_a: { name: 'Jordan Love', team: 'Green Bay Packers', stats: { pass_yds: 3389, pass_tds: 25, ints: 11, rating: 92.5 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'CJ Stroud', team: 'Houston Texans', stats: { pass_yds: 3727, pass_tds: 20, ints: 12, rating: 84.8 }, statLabel: '2024 Season' },
    showdown_category: 'WHO HAD THE BETTER SOPHOMORE LEAP IN 2024?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Love had more TDs, fewer INTs, and a higher passer rating than the 2023 OROY CJ Stroud. Stroud actually regressed in year 2 while Love quietly established himself — but Stroud gets far more hype.',
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
    showdown_player_a: { name: 'Ja\'Marr Chase', team: 'Cincinnati Bengals', stats: { rec: 127, rec_yds: 1708, rec_tds: 17, yds_per_rec: 13.4 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Jerry Rice', team: 'San Francisco 49ers', stats: { rec: 112, rec_yds: 1499, rec_tds: 13, yds_per_rec: 13.4 }, statLabel: '1995 Season (Age 33)' },
    showdown_category: 'WHOSE SEASON WAS MORE IMPRESSIVE?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Chase had more catches, more yards, and more TDs — but Rice was 33 years old and still put up numbers within range of a 25-year-old in his prime. Chase wins the raw stats but Rice\'s age makes it a genuine debate.',
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
    showdown_player_a: { name: 'Sauce Gardner', team: 'New York Jets', stats: { ints: 2, pass_breakups: 12, passer_rating_allowed: 74.1, yards_allowed_per_game: 41 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Patrick Surtain II', team: 'Denver Broncos', stats: { ints: 4, pass_breakups: 17, passer_rating_allowed: 56.2, yards_allowed_per_game: 32 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER CORNERBACK IN 2024?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Pat Surtain II won DPOY and dominated every coverage metric over Sauce Gardner — more INTs, more pass breakups, lower passer rating allowed, fewer yards per game. PS2 took the crown that Sauce held in 2022-23.',
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
    showdown_player_a: { name: 'Deion Sanders', team: 'Dallas Cowboys', stats: { ints: 53, pick_sixes: 9, all_pro_selections: 8, super_bowls: 2 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Ronnie Lott', team: 'San Francisco 49ers', stats: { ints: 63, pick_sixes: 5, all_pro_selections: 8, super_bowls: 4 }, statLabel: 'Career' },
    showdown_category: 'WHO WAS THE GREATEST DEFENSIVE BACK EVER?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Lott had 10 more career interceptions, 2 more Super Bowl rings, and played both safety and corner at an elite level. Sanders had more pick-sixes and was flashier, but Lott was the more complete player and bigger winner.',
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
