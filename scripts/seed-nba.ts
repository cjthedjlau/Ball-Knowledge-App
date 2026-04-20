// No schema changes needed — mystery_player is stored as jsonb
// Run in Supabase SQL Editor first:
// alter table public.daily_games add column if not exists blind_rank_category text;

// Run with:
// SUPABASE_SERVICE_ROLE_KEY=your-key npx ts-node --project scripts/tsconfig.json scripts/seed-nba.ts

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://scloxktkudutupiyqvbx.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY env var is required')
  console.error('Usage: SUPABASE_SERVICE_ROLE_KEY=your-key npx ts-node --project scripts/tsconfig.json scripts/seed-nba.ts')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

const games = [
  // ─── 2026-03-15 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-15', league: 'NBA',
    mystery_player: { name: 'Victor Wembanyama', team: 'San Antonio Spurs', position: 'C', height: "7'4\"", jerseyNumber: 1, conference: 'Western', college: 'France (international)', age: 21, stats: { ppg: 24.2, apg: 3.8, rpg: 10.4, fg_pct: .467 } },
    showdown_player_a: { name: 'Domantas Sabonis', team: 'Sacramento Kings', stats: { ppg: 20.7, rpg: 13.6, apg: 8.2, fg_pct: .592 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Nikola Jokic', team: 'Denver Nuggets', stats: { ppg: 29.4, rpg: 12.8, apg: 10.2, fg_pct: .582 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO HAD THE BETTER 2024-25 SEASON?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Jokic wins in scoring and assists, but Sabonis actually out-rebounds him (13.6 vs 12.8) and shoots a higher percentage — closer than anyone expects from a "Jokic lite" comparison.',
    blind_rank_players: [
      { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', rankingStat: 28.3, statLabel: 'PPG' },
      { name: 'Shai Gilgeous-Alexander', team: 'OKC Thunder', rankingStat: 32.2, statLabel: 'PPG' },
      { name: 'Jalen Brunson', team: 'New York Knicks', rankingStat: 26.4, statLabel: 'PPG' },
      { name: 'Nikola Jokic', team: 'Denver Nuggets', rankingStat: 29.4, statLabel: 'PPG' },
      { name: 'LeBron James', team: 'Los Angeles Lakers', rankingStat: 23.7, statLabel: 'PPG' },
    ],
    blind_rank_category: 'RANK BY OVERALL GREATNESS',
    trivia_questions: [
      { question: 'What pick was Nikola Jokic selected in the 2014 NBA Draft?', options: ['15th', '27th', '41st', '52nd'], correctIndex: 2, explanation: 'Jokic was a steal at 41st overall — one of the greatest late picks in draft history.' },
      { question: 'Victor Wembanyama was the #1 overall pick in which year?', options: ['2022', '2023', '2024', '2021'], correctIndex: 1, explanation: 'Wembanyama was selected #1 overall by San Antonio in the 2023 NBA Draft.' },
      { question: 'How many MVP awards has Nikola Jokic won as of 2025?', options: ['2', '3', '4', '1'], correctIndex: 1, explanation: 'Jokic won the MVP in 2021, 2022, and 2024 — three awards in four years.' },
    ],
  },
  // ─── 2026-03-16 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-16', league: 'NBA',
    mystery_player: { name: 'Tyrese Haliburton', team: 'Indiana Pacers', position: 'PG', height: "6'5\"", jerseyNumber: 0, conference: 'Eastern', college: 'Iowa State', age: 25, stats: { ppg: 19.4, apg: 10.9, rpg: 4.7, fg_pct: .445 } },
    showdown_player_a: { name: 'Alperen Sengun', team: 'Houston Rockets', stats: { ppg: 21.1, rpg: 9.2, apg: 4.8, fg_pct: .532 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Joel Embiid', team: 'Philadelphia 76ers', stats: { ppg: 26.8, rpg: 11.2, apg: 5.4, fg_pct: .487 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO IS THE MORE EFFICIENT BIG MAN?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Embiid wins on volume scoring and rebounds, but Sengun shoots a significantly higher percentage (.532 vs .487) and nearly matches him in assists — a 22-year-old keeping pace with a former MVP is the real story.',
    blind_rank_players: [
      { name: 'Tyrese Haliburton', team: 'Indiana Pacers', rankingStat: 10.9, statLabel: 'APG' },
      { name: 'Nikola Jokic', team: 'Denver Nuggets', rankingStat: 10.2, statLabel: 'APG' },
      { name: 'Trae Young', team: 'Atlanta Hawks', rankingStat: 11.1, statLabel: 'APG' },
      { name: 'LaMelo Ball', team: 'Charlotte Hornets', rankingStat: 8.2, statLabel: 'APG' },
      { name: 'Cade Cunningham', team: 'Detroit Pistons', rankingStat: 8.1, statLabel: 'APG' },
    ],
    blind_rank_category: 'WHO WOULD YOU BUILD A TEAM AROUND?',
    trivia_questions: [
      { question: 'Giannis Antetokounmpo is from which country?', options: ['Nigeria', 'Greece', 'Cameroon', 'Democratic Republic of Congo'], correctIndex: 1, explanation: 'Giannis was born in Athens, Greece to Nigerian parents and grew up there before being drafted in 2013.' },
      { question: 'Which team did Anthony Davis win his NBA championship with?', options: ['New Orleans Pelicans', 'Boston Celtics', 'Los Angeles Lakers', 'Brooklyn Nets'], correctIndex: 2, explanation: 'Davis won the championship with LeBron James and the Lakers in the 2020 NBA Finals (played in the bubble).' },
      { question: 'What is Giannis Antetokounmpo\'s nickname?', options: ['The King', 'The Greek Freak', 'The Beast', 'The Alphabet'], correctIndex: 1, explanation: 'Giannis is known as "The Greek Freak" for his unique combination of size, speed, and skill.' },
    ],
  },
  // ─── 2026-03-17 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-17', league: 'NBA',
    mystery_player: { name: 'Alperen Sengun', team: 'Houston Rockets', position: 'C', height: "6'9\"", jerseyNumber: 28, conference: 'Western', college: 'Turkey (international)', age: 22, stats: { ppg: 21.1, apg: 4.8, rpg: 9.2, fg_pct: .532 } },
    showdown_player_a: { name: 'Tyrese Maxey', team: 'Philadelphia 76ers', stats: { ppg: 25.9, apg: 6.2, fg_pct: .451, three_pct: .371 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Devin Booker', team: 'Phoenix Suns', stats: { ppg: 25.1, apg: 6.9, fg_pct: .462, three_pct: .365 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO IS THE BETTER SCORING GUARD?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Maxey edges Booker in scoring and three-point shooting while Booker leads in assists and field goal percentage — a closer battle than most fans would expect from a rising star vs. an established All-Star.',
    blind_rank_players: [
      { name: 'Karl-Anthony Towns', team: 'New York Knicks', rankingStat: 13.2, statLabel: 'RPG' },
      { name: 'Nikola Jokic', team: 'Denver Nuggets', rankingStat: 12.8, statLabel: 'RPG' },
      { name: 'Anthony Davis', team: 'Los Angeles Lakers', rankingStat: 12.4, statLabel: 'RPG' },
      { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', rankingStat: 11.6, statLabel: 'RPG' },
      { name: 'Victor Wembanyama', team: 'San Antonio Spurs', rankingStat: 10.4, statLabel: 'RPG' },
    ],
    blind_rank_category: 'RANK BY CULTURAL IMPACT',
    trivia_questions: [
      { question: 'Luka Doncic was traded to the Los Angeles Lakers mid-season in which year?', options: ['2023', '2024', '2025', '2026'], correctIndex: 2, explanation: 'Luka Doncic was traded from the Dallas Mavericks to the Los Angeles Lakers in January 2025.' },
      { question: 'Jayson Tatum played college basketball at which school?', options: ['Kentucky', 'Duke', 'Kansas', 'North Carolina'], correctIndex: 1, explanation: 'Tatum played one season at Duke under Coach K before being drafted 3rd overall by Boston in 2017.' },
      { question: 'Karl-Anthony Towns was selected #1 overall in 2015 — which team drafted him?', options: ['Los Angeles Lakers', 'Philadelphia 76ers', 'Minnesota Timberwolves', 'New York Knicks'], correctIndex: 2, explanation: 'KAT was taken #1 overall by the Minnesota Timberwolves in the 2015 NBA Draft out of the University of Kentucky.' },
    ],
  },
  // ─── 2026-03-18 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-18', league: 'NBA',
    mystery_player: { name: 'Cade Cunningham', team: 'Detroit Pistons', position: 'PG', height: "6'6\"", jerseyNumber: 2, conference: 'Eastern', college: 'Oklahoma State', age: 23, stats: { ppg: 24.5, apg: 8.1, rpg: 4.5, fg_pct: .449 } },
    showdown_player_a: { name: 'Magic Johnson', team: 'Los Angeles Lakers', stats: { career_ppg: 19.5, career_apg: 11.2, championships: 5, mvps: 3 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Isiah Thomas', team: 'Detroit Pistons', stats: { career_ppg: 19.2, career_apg: 9.3, championships: 2, mvps: 0 }, statLabel: 'Career' },
    showdown_category: 'WHO WAS THE GREATER POINT GUARD?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Magic edges Thomas in career assists and has 5 rings to 2, but the debate is closer than most realize — Thomas averaged more steals and was equally dominant in his era.',
    blind_rank_players: [
      { name: 'Cade Cunningham', team: 'Detroit Pistons', rankingStat: 24.5, statLabel: 'PPG' },
      { name: 'Anthony Edwards', team: 'Minnesota Timberwolves', rankingStat: 25.8, statLabel: 'PPG' },
      { name: 'Donovan Mitchell', team: 'Cleveland Cavaliers', rankingStat: 24.7, statLabel: 'PPG' },
      { name: 'Jalen Green', team: 'Houston Rockets', rankingStat: 22.5, statLabel: 'PPG' },
      { name: 'LaMelo Ball', team: 'Charlotte Hornets', rankingStat: 22.9, statLabel: 'PPG' },
    ],
    blind_rank_category: 'WHO WAS THE MOST DOMINANT?',
    trivia_questions: [
      { question: 'LeBron James broke whose all-time NBA scoring record?', options: ['Michael Jordan', 'Kareem Abdul-Jabbar', 'Karl Malone', 'Kobe Bryant'], correctIndex: 1, explanation: 'LeBron surpassed Kareem Abdul-Jabbar\'s record of 38,387 career points in February 2023.' },
      { question: 'How many NBA championships has Stephen Curry won?', options: ['3', '4', '5', '2'], correctIndex: 1, explanation: 'Curry won titles in 2015, 2017, 2018, and 2022 — four championships with Golden State.' },
      { question: 'Cade Cunningham was selected #1 overall in which draft year?', options: ['2019', '2020', '2021', '2022'], correctIndex: 2, explanation: 'Cunningham was taken first overall by Detroit in the 2021 NBA Draft out of Oklahoma State.' },
    ],
  },
  // ─── 2026-03-19 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-19', league: 'NBA',
    mystery_player: { name: 'Evan Mobley', team: 'Cleveland Cavaliers', position: 'C/PF', height: "7'0\"", jerseyNumber: 4, conference: 'Eastern', college: 'USC', age: 23, stats: { ppg: 18.9, apg: 2.8, rpg: 9.3, fg_pct: .558 } },
    showdown_player_a: { name: 'Jalen Williams', team: 'OKC Thunder', stats: { ppg: 21.4, rpg: 5.6, apg: 5.1, spg: 1.6 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Jaylen Brown', team: 'Boston Celtics', stats: { ppg: 23.2, rpg: 5.8, apg: 3.4, spg: 1.1 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO IS THE MORE COMPLETE WING?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Brown edges Williams in scoring, but Williams leads in assists (5.1 vs 3.4), steals (1.6 vs 1.1), and is the second option on the best team in the West — a name most casual fans barely know matching a Finals MVP.',
    blind_rank_players: [
      { name: 'Trae Young', team: 'Atlanta Hawks', rankingStat: 11.1, statLabel: 'APG' },
      { name: 'Tyrese Haliburton', team: 'Indiana Pacers', rankingStat: 10.9, statLabel: 'APG' },
      { name: 'Nikola Jokic', team: 'Denver Nuggets', rankingStat: 10.2, statLabel: 'APG' },
      { name: 'LeBron James', team: 'Los Angeles Lakers', rankingStat: 8.2, statLabel: 'APG' },
      { name: 'LaMelo Ball', team: 'Charlotte Hornets', rankingStat: 8.2, statLabel: 'APG' },
    ],
    blind_rank_category: 'RANK BY CLUTCH FACTOR',
    trivia_questions: [
      { question: 'What college did Trae Young attend before declaring for the NBA Draft?', options: ['Georgia Tech', 'Oklahoma', 'Baylor', 'Texas'], correctIndex: 1, explanation: 'Trae Young was a phenom at the University of Oklahoma, averaging 27.4 PPG and 8.8 APG in his one season.' },
      { question: 'Jalen Brunson was the son of which former NBA player?', options: ['Rick Brunson', 'Bob Brunson', 'John Brunson', 'Mike Brunson'], correctIndex: 0, explanation: 'Jalen\'s father Rick Brunson played nine seasons in the NBA, including stints with multiple teams.' },
      { question: 'Evan Mobley was selected in which position in the 2021 NBA Draft?', options: ['1st', '2nd', '3rd', '4th'], correctIndex: 2, explanation: 'Mobley was taken 3rd overall by Cleveland in 2021, behind Cade Cunningham and Jalen Green.' },
    ],
  },
  // ─── 2026-03-20 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-20', league: 'NBA',
    mystery_player: { name: 'Scottie Barnes', team: 'Toronto Raptors', position: 'SF/PF', height: "6'8\"", jerseyNumber: 4, conference: 'Eastern', college: 'Florida State', age: 23, stats: { ppg: 19.8, apg: 5.2, rpg: 8.1, fg_pct: .474 } },
    showdown_player_a: { name: 'Shai Gilgeous-Alexander', team: 'OKC Thunder', stats: { ppg: 32.2, rpg: 5.1, apg: 6.3, fg_pct: .535 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Nikola Jokic', team: 'Denver Nuggets', stats: { ppg: 29.4, rpg: 12.8, apg: 10.2, fg_pct: .582 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO DESERVES THE 2025 MVP?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'SGA leads in scoring by nearly 3 PPG and anchors the West\'s top seed, but Jokic counters with historically better rebounding, assists, and efficiency — the tightest MVP race in years.',
    blind_rank_players: [
      { name: 'Scottie Barnes', team: 'Toronto Raptors', rankingStat: 19.8, statLabel: 'PPG' },
      { name: 'Paolo Banchero', team: 'Orlando Magic', rankingStat: 21.4, statLabel: 'PPG' },
      { name: 'Franz Wagner', team: 'Orlando Magic', rankingStat: 22.1, statLabel: 'PPG' },
      { name: 'Alperen Sengun', team: 'Houston Rockets', rankingStat: 21.1, statLabel: 'PPG' },
      { name: 'Tyrese Haliburton', team: 'Indiana Pacers', rankingStat: 19.4, statLabel: 'PPG' },
    ],
    blind_rank_category: 'WHO HAD THE BEST PEAK?',
    trivia_questions: [
      { question: 'Joel Embiid is originally from which country?', options: ['Nigeria', 'Cameroon', 'Senegal', 'France'], correctIndex: 1, explanation: 'Embiid was born in Yaoundé, Cameroon, and grew up there before moving to the US to pursue basketball.' },
      { question: 'Victor Wembanyama plays for which NBA team?', options: ['New Orleans Pelicans', 'San Antonio Spurs', 'Utah Jazz', 'Oklahoma City Thunder'], correctIndex: 1, explanation: 'Wembanyama was drafted #1 overall by the San Antonio Spurs in 2023.' },
      { question: 'Scottie Barnes won NBA Rookie of the Year in which season?', options: ['2020-21', '2021-22', '2022-23', '2023-24'], correctIndex: 1, explanation: 'Barnes won Rookie of the Year in 2021-22, his first season with Toronto, averaging 15.3 PPG.' },
    ],
  },
  // ─── 2026-03-21 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-21', league: 'NBA',
    mystery_player: { name: 'Paolo Banchero', team: 'Orlando Magic', position: 'PF', height: "6'10\"", jerseyNumber: 5, conference: 'Eastern', college: 'Duke', age: 22, stats: { ppg: 21.4, apg: 4.8, rpg: 6.9, fg_pct: .463 } },
    showdown_player_a: { name: 'Trae Young', team: 'Atlanta Hawks', stats: { ppg: 22.8, apg: 11.1, three_pct: .337, fg_pct: .432 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Darius Garland', team: 'Cleveland Cavaliers', stats: { ppg: 21.1, apg: 6.8, three_pct: .392, fg_pct: .462 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO IS THE BETTER PLAYMAKER?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Trae dominates in assists, but Garland shoots significantly better from three (.392 vs .337) and from the field (.462 vs .432) while playing on the best team in the East — efficiency vs. volume is the real debate.',
    blind_rank_players: [
      { name: 'Devin Booker', team: 'Phoenix Suns', rankingStat: 25.1, statLabel: 'PPG' },
      { name: 'Damian Lillard', team: 'Milwaukee Bucks', rankingStat: 25.2, statLabel: 'PPG' },
      { name: 'Donovan Mitchell', team: 'Cleveland Cavaliers', rankingStat: 24.7, statLabel: 'PPG' },
      { name: 'De\'Aaron Fox', team: 'San Antonio Spurs', rankingStat: 23.5, statLabel: 'PPG' },
      { name: 'Bam Adebayo', team: 'Miami Heat', rankingStat: 18.7, statLabel: 'PPG' },
    ],
    blind_rank_category: 'RANK BY CONSISTENCY',
    trivia_questions: [
      { question: 'Donovan Mitchell won Rookie of the Year in which season?', options: ['2016-17', '2017-18', '2018-19', '2019-20'], correctIndex: 1, explanation: 'Mitchell won ROY in 2017-18 after a stellar debut season with Utah, where he averaged 20.5 PPG.' },
      { question: 'Devin Booker scored 70 points against Boston on March 24, 2017. How old was he — making him the youngest player ever to score 70 in a game?', options: ['19 years old', '20 years old', '21 years old', '18 years old'], correctIndex: 1, explanation: 'Booker was 20 years old when he dropped 70 points on the Celtics on March 24, 2017, becoming the youngest player in NBA history to score 70 in a single game.' },
      { question: 'Paolo Banchero was the #1 overall pick in which NBA Draft?', options: ['2020', '2021', '2022', '2023'], correctIndex: 2, explanation: 'Banchero was selected #1 overall by Orlando in the 2022 NBA Draft out of Duke.' },
    ],
  },
  // ─── 2026-03-22 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-22', league: 'NBA',
    mystery_player: { name: 'Franz Wagner', team: 'Orlando Magic', position: 'SF', height: "6'10\"", jerseyNumber: 22, conference: 'Eastern', college: 'Michigan', age: 23, stats: { ppg: 22.1, apg: 4.1, rpg: 5.6, fg_pct: .476 } },
    showdown_player_a: { name: 'Shaquille O\'Neal', team: 'Los Angeles Lakers', stats: { career_ppg: 23.7, career_rpg: 10.9, championships: 4, finals_mvps: 3 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Hakeem Olajuwon', team: 'Houston Rockets', stats: { career_ppg: 21.8, career_rpg: 11.1, championships: 2, finals_mvps: 2 }, statLabel: 'Career' },
    showdown_category: 'WHO WAS THE GREATER CENTER?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Shaq has more rings (4 vs 2) and a higher scoring average, but Hakeem leads in rebounds and is the all-time blocks leader — the most debated center comparison in NBA history.',
    blind_rank_players: [
      { name: 'Nikola Jokic', team: 'Denver Nuggets', rankingStat: 10.2, statLabel: 'APG' },
      { name: 'Cade Cunningham', team: 'Detroit Pistons', rankingStat: 8.1, statLabel: 'APG' },
      { name: 'LaMelo Ball', team: 'Charlotte Hornets', rankingStat: 8.2, statLabel: 'APG' },
      { name: 'Jalen Brunson', team: 'New York Knicks', rankingStat: 7.2, statLabel: 'APG' },
      { name: 'De\'Aaron Fox', team: 'San Antonio Spurs', rankingStat: 7.1, statLabel: 'APG' },
    ],
    blind_rank_category: 'RANK BY OVERALL GREATNESS',
    trivia_questions: [
      { question: 'Franz Wagner\'s brother is also an NBA player. What is his name?', options: ['Moritz Wagner', 'Lukas Wagner', 'Hans Wagner', 'Karl Wagner'], correctIndex: 0, explanation: 'Moritz Wagner, a center, plays in the NBA and was actually drafted before his younger brother Franz.' },
      { question: 'Which college did Cade Cunningham attend?', options: ['Ohio State', 'Oklahoma State', 'Kansas', 'Auburn'], correctIndex: 1, explanation: 'Cunningham played one season at Oklahoma State, winning Big 12 Player of the Year before going #1 overall.' },
      { question: 'Tyrese Haliburton was traded to Indiana from which team?', options: ['Philadelphia 76ers', 'Memphis Grizzlies', 'Sacramento Kings', 'New Orleans Pelicans'], correctIndex: 2, explanation: 'Haliburton was traded from Sacramento to Indiana in January 2022 in the Domantas Sabonis deal.' },
    ],
  },
  // ─── 2026-03-23 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-23', league: 'NBA',
    mystery_player: { name: 'Anthony Edwards', team: 'Minnesota Timberwolves', position: 'SG/SF', height: "6'4\"", jerseyNumber: 5, conference: 'Western', college: 'Georgia', age: 23, stats: { ppg: 25.8, apg: 5.1, rpg: 5.2, fg_pct: .462 } },
    showdown_player_a: { name: 'Donovan Mitchell', team: 'Cleveland Cavaliers', stats: { ppg: 24.7, rpg: 4.2, three_pct: .373, fg_pct: .462 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Desmond Bane', team: 'Memphis Grizzlies', stats: { ppg: 22.7, rpg: 4.8, three_pct: .398, fg_pct: .468 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO IS THE BETTER TWO-WAY GUARD?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Mitchell leads in raw scoring, but Bane shoots better from three (.398 vs .373), grabs more boards, and shoots a higher percentage — a Memphis guard quietly outperforming a three-time All-Star in efficiency.',
    blind_rank_players: [
      { name: 'Anthony Davis', team: 'Los Angeles Lakers', rankingStat: 12.4, statLabel: 'RPG' },
      { name: 'Karl-Anthony Towns', team: 'New York Knicks', rankingStat: 13.2, statLabel: 'RPG' },
      { name: 'Bam Adebayo', team: 'Miami Heat', rankingStat: 10.1, statLabel: 'RPG' },
      { name: 'Alperen Sengun', team: 'Houston Rockets', rankingStat: 9.2, statLabel: 'RPG' },
      { name: 'Evan Mobley', team: 'Cleveland Cavaliers', rankingStat: 9.3, statLabel: 'RPG' },
    ],
    blind_rank_category: 'WHO WOULD YOU BUILD A TEAM AROUND?',
    trivia_questions: [
      { question: 'Kevin Durant won the NBA Finals MVP in which year with the Golden State Warriors?', options: ['2016', '2017', '2018', 'Both 2017 and 2018'], correctIndex: 3, explanation: 'Durant won back-to-back Finals MVPs in 2017 and 2018, cementing his legacy with Golden State.' },
      { question: 'Damian Lillard played 11+ seasons for which team before being traded?', options: ['San Antonio Spurs', 'Utah Jazz', 'Portland Trail Blazers', 'Memphis Grizzlies'], correctIndex: 2, explanation: 'Lillard spent his first 11 seasons in Portland, becoming the franchise\'s all-time leading scorer.' },
      { question: 'Anthony Edwards was selected #1 overall in the 2020 NBA Draft by which team?', options: ['Detroit Pistons', 'Charlotte Hornets', 'Houston Rockets', 'Minnesota Timberwolves'], correctIndex: 3, explanation: 'Edwards was the first pick by Minnesota in 2020 and quickly became one of the NBA\'s brightest stars.' },
    ],
  },
  // ─── 2026-03-24 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-24', league: 'NBA',
    mystery_player: { name: 'Jalen Green', team: 'Houston Rockets', position: 'SG', height: "6'4\"", jerseyNumber: 4, conference: 'Western', college: 'G League Ignite', age: 22, stats: { ppg: 22.5, apg: 4.8, rpg: 4.3, fg_pct: .438 } },
    showdown_player_a: { name: 'Damian Lillard', team: 'Milwaukee Bucks', stats: { ppg: 25.2, apg: 7.4, three_pct: .354, fg_pct: .443 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Anfernee Simons', team: 'Portland Trail Blazers', stats: { ppg: 22.6, apg: 5.3, three_pct: .385, fg_pct: .441 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO IS THE BETTER THREE-POINT SHOOTER?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Lillard leads in scoring and assists, but Simons shoots significantly better from three (.385 vs .354) — Portland\'s replacement is actually a more efficient shooter than the franchise legend he replaced.',
    blind_rank_players: [
      { name: 'Shai Gilgeous-Alexander', team: 'OKC Thunder', rankingStat: 32.2, statLabel: 'PPG' },
      { name: 'Nikola Jokic', team: 'Denver Nuggets', rankingStat: 29.4, statLabel: 'PPG' },
      { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', rankingStat: 28.3, statLabel: 'PPG' },
      { name: 'Luka Doncic', team: 'Los Angeles Lakers', rankingStat: 27.8, statLabel: 'PPG' },
      { name: 'Jayson Tatum', team: 'Boston Celtics', rankingStat: 26.5, statLabel: 'PPG' },
    ],
    blind_rank_category: 'RANK BY CULTURAL IMPACT',
    trivia_questions: [
      { question: 'SGA was traded to OKC as part of the Paul George trade from which team?', options: ['Los Angeles Clippers', 'Oklahoma City Thunder', 'San Antonio Spurs', 'Houston Rockets'], correctIndex: 0, explanation: 'SGA was traded from the LA Clippers to OKC in the deal that sent Paul George to LA in 2019.' },
      { question: 'Jalen Green skipped college to play in which development league?', options: ['NBA G League', 'G League Ignite', 'Overtime Elite', 'Euro League'], correctIndex: 1, explanation: 'Green played for G League Ignite in 2020-21 before being drafted 2nd overall by Houston.' },
      { question: 'Which player holds the NBA record for most points scored in a single game?', options: ['Kobe Bryant', 'Wilt Chamberlain', 'Michael Jordan', 'LeBron James'], correctIndex: 1, explanation: 'Wilt Chamberlain scored 100 points for the Philadelphia Warriors against the New York Knicks on March 2, 1962.' },
    ],
  },
  // ─── 2026-03-25 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-25', league: 'NBA',
    mystery_player: { name: 'Damian Lillard', team: 'Milwaukee Bucks', position: 'PG', height: "6'2\"", jerseyNumber: 0, conference: 'Eastern', college: 'Weber State', age: 35, stats: { ppg: 25.2, apg: 7.4, rpg: 4.5, fg_pct: .443 } },
    showdown_player_a: { name: 'Kobe Bryant', team: 'Los Angeles Lakers', stats: { career_ppg: 25.0, championships: 5, all_star: 18, career_spg: 1.4 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Tim Duncan', team: 'San Antonio Spurs', stats: { career_ppg: 19.0, championships: 5, all_star: 15, career_bpg: 2.2 }, statLabel: 'Career' },
    showdown_category: 'WHO HAD THE GREATER CAREER?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Both won 5 rings, but Kobe scored 6 more PPG and made 3 more All-Star teams. Duncan counters with 3 Finals MVPs to Kobe\'s 2 and superior defensive numbers — the ultimate "same era, same rings, different paths" debate.',
    blind_rank_players: [
      { name: 'Jayson Tatum', team: 'Boston Celtics', rankingStat: 26.5, statLabel: 'PPG' },
      { name: 'Kevin Durant', team: 'Phoenix Suns', rankingStat: 25.1, statLabel: 'PPG' },
      { name: 'Anthony Edwards', team: 'Minnesota Timberwolves', rankingStat: 25.8, statLabel: 'PPG' },
      { name: 'Damian Lillard', team: 'Milwaukee Bucks', rankingStat: 25.2, statLabel: 'PPG' },
      { name: 'Devin Booker', team: 'Phoenix Suns', rankingStat: 25.1, statLabel: 'PPG' },
    ],
    blind_rank_category: 'WHO WAS THE MOST DOMINANT?',
    trivia_questions: [
      { question: 'Anthony Edwards goes by which nickname?', options: ['Ant-Man', 'The Ant', 'Ant Hill', 'Antsy'], correctIndex: 0, explanation: 'Edwards earned the nickname "Ant-Man" for his combination of compact explosiveness and Marvel character-like athleticism.' },
      { question: 'LaMelo Ball\'s father Lavar Ball founded which shoe company?', options: ['Ball Brand', 'Big Baller Brand', 'Ball Nation', 'Triple B'], correctIndex: 1, explanation: 'LaVar Ball founded Big Baller Brand, which famously tried to sell LaMelo\'s signature shoe for $395 before he was even drafted.' },
      { question: 'Damian Lillard attended Weber State, which is located in which state?', options: ['Colorado', 'Nevada', 'Utah', 'Idaho'], correctIndex: 2, explanation: 'Weber State is located in Ogden, Utah. Lillard developed into a star there despite going relatively unrecruited.' },
    ],
  },
  // ─── 2026-03-26 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-26', league: 'NBA',
    mystery_player: { name: 'Karl-Anthony Towns', team: 'New York Knicks', position: 'C', height: "7'0\"", jerseyNumber: 32, conference: 'Eastern', college: 'Kentucky', age: 29, stats: { ppg: 24.4, apg: 3.1, rpg: 13.2, fg_pct: .540 } },
    showdown_player_a: { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', stats: { ppg: 28.3, rpg: 11.6, fg_pct: .611, bpg: 1.1 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Joel Embiid', team: 'Philadelphia 76ers', stats: { ppg: 26.8, rpg: 11.2, fg_pct: .487, bpg: 1.7 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO IS THE BETTER FORMER MVP?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Giannis leads in scoring and efficiency (.611 vs .487 FG%), but Embiid edges him in blocks — the two former MVPs remain closer than their team records suggest.',
    blind_rank_players: [
      { name: 'Alperen Sengun', team: 'Houston Rockets', rankingStat: 9.2, statLabel: 'RPG' },
      { name: 'Karl-Anthony Towns', team: 'New York Knicks', rankingStat: 13.2, statLabel: 'RPG' },
      { name: 'Bam Adebayo', team: 'Miami Heat', rankingStat: 10.1, statLabel: 'RPG' },
      { name: 'Victor Wembanyama', team: 'San Antonio Spurs', rankingStat: 10.4, statLabel: 'RPG' },
      { name: 'Nikola Jokic', team: 'Denver Nuggets', rankingStat: 12.8, statLabel: 'RPG' },
    ],
    blind_rank_category: 'RANK BY CLUTCH FACTOR',
    trivia_questions: [
      { question: 'Nikola Jokic\'s 2021-22 MVP season saw him become the first center to win MVP since who?', options: ['Shaquille O\'Neal', 'David Robinson', 'Bob McAdoo', 'Shaquille O\'Neal in 2000'], correctIndex: 3, explanation: 'Shaq was the last center to win MVP (2000) before Jokic won it in 2021, snapping a 21-year drought for the position.' },
      { question: 'Karl-Anthony Towns was the #1 pick in the 2015 NBA Draft. Who had the #2 pick?', options: ['D\'Angelo Russell', 'Jahlil Okafor', 'Emmanuel Mudiay', 'Kristaps Porzingis'], correctIndex: 0, explanation: 'D\'Angelo Russell was selected 2nd overall by the LA Lakers behind KAT in the 2015 draft.' },
      { question: 'Giannis became the first player since LeBron James to win back-to-back MVPs. In which years?', options: ['2018 and 2019', '2019 and 2020', '2020 and 2021', '2021 and 2022'], correctIndex: 1, explanation: 'Giannis won consecutive MVPs in 2019 and 2020, dominating the league before finally winning a title in 2021.' },
    ],
  },
  // ─── 2026-03-27 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-27', league: 'NBA',
    mystery_player: { name: 'Bam Adebayo', team: 'Miami Heat', position: 'C/PF', height: "6'9\"", jerseyNumber: 13, conference: 'Eastern', college: 'Kentucky', age: 27, stats: { ppg: 18.7, apg: 3.6, rpg: 10.1, fg_pct: .520 } },
    showdown_player_a: { name: 'Bam Adebayo', team: 'Miami Heat', stats: { ppg: 18.7, rpg: 10.1, fg_pct: .520, bpg: 0.9 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Ivica Zubac', team: 'LA Clippers', stats: { ppg: 13.1, rpg: 12.3, fg_pct: .625, bpg: 1.2 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO IS THE BETTER REBOUNDER?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Bam leads in scoring and is the more famous name, but Zubac grabs 2+ more rebounds per game (12.3 vs 10.1) and shoots over 10% better from the field — the Clippers\' big man is quietly one of the most efficient centers in the league.',
    blind_rank_players: [
      { name: 'Victor Wembanyama', team: 'San Antonio Spurs', rankingStat: 3.6, statLabel: 'BPG' },
      { name: 'Jaren Jackson Jr.', team: 'Memphis Grizzlies', rankingStat: 2.8, statLabel: 'BPG' },
      { name: 'Anthony Davis', team: 'Los Angeles Lakers', rankingStat: 2.3, statLabel: 'BPG' },
      { name: 'Nikola Jokic', team: 'Denver Nuggets', rankingStat: 0.9, statLabel: 'BPG' },
      { name: 'Bam Adebayo', team: 'Miami Heat', rankingStat: 0.9, statLabel: 'BPG' },
    ],
    blind_rank_category: 'WHO HAD THE BEST PEAK?',
    trivia_questions: [
      { question: 'The Miami Heat famously made the NBA Finals in 2023 as what seed?', options: ['7th seed', '8th seed', '6th seed', '5th seed'], correctIndex: 1, explanation: 'The Heat were the 8th seed — the lowest-seeded team ever to reach the NBA Finals — before losing to Denver in 5 games.' },
      { question: 'Bam Adebayo won a gold medal representing which country at the Olympics?', options: ['United States', 'United Kingdom', 'Jamaica', 'Cuba'], correctIndex: 0, explanation: 'Adebayo represented Team USA at the 2024 Paris Olympics, winning gold.' },
      { question: 'Which player holds the record for most career steals in NBA history?', options: ['Scottie Pippen', 'Michael Jordan', 'John Stockton', 'Alvin Robertson'], correctIndex: 2, explanation: 'John Stockton holds the all-time record for career steals with 3,265, nearly double second place.' },
    ],
  },
  // ─── 2026-03-28 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-28', league: 'NBA',
    mystery_player: { name: 'Trae Young', team: 'Atlanta Hawks', position: 'PG', height: "6'1\"", jerseyNumber: 11, conference: 'Eastern', college: 'Oklahoma', age: 26, stats: { ppg: 22.8, apg: 11.1, rpg: 3.2, fg_pct: .432 } },
    showdown_player_a: { name: 'Luka Doncic', team: 'Los Angeles Lakers', stats: { ppg: 27.8, apg: 8.1, rpg: 8.2, fg_pct: .487 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Cade Cunningham', team: 'Detroit Pistons', stats: { ppg: 24.5, apg: 8.1, rpg: 4.5, fg_pct: .449 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO IS THE BETTER PASSER?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Luka leads in scoring and rebounds, but Cunningham matches him exactly in assists per game (8.1) while leading a rebuilding Pistons team — a breakout star going toe-to-toe with a generational talent.',
    blind_rank_players: [
      { name: 'Luka Doncic', team: 'Los Angeles Lakers', rankingStat: 27.8, statLabel: 'PPG' },
      { name: 'Jayson Tatum', team: 'Boston Celtics', rankingStat: 26.5, statLabel: 'PPG' },
      { name: 'Jalen Brunson', team: 'New York Knicks', rankingStat: 26.4, statLabel: 'PPG' },
      { name: 'Devin Booker', team: 'Phoenix Suns', rankingStat: 25.1, statLabel: 'PPG' },
      { name: 'Trae Young', team: 'Atlanta Hawks', rankingStat: 22.8, statLabel: 'PPG' },
    ],
    blind_rank_category: 'RANK BY CONSISTENCY',
    trivia_questions: [
      { question: 'Jayson Tatum won an NBA Championship in which year?', options: ['2022', '2023', '2024', '2025'], correctIndex: 2, explanation: 'Tatum and the Celtics won the 2024 NBA Championship, defeating the Dallas Mavericks 4-1 in the Finals.' },
      { question: 'Trae Young was traded on draft night in 2018. Which player came to Atlanta in that trade?', options: ['Marcus Smart', 'Luka Doncic', 'Darius Garland', 'De\'Andre Hunter'], correctIndex: 1, explanation: 'Atlanta selected Luka Doncic 3rd overall, then traded him to Dallas for the 5th pick (Trae Young) and a future first.' },
      { question: 'Luka Doncic\'s professional career began with which European team?', options: ['Barcelona', 'Real Madrid', 'CSKA Moscow', 'Fenerbahce'], correctIndex: 1, explanation: 'Doncic played for Real Madrid from age 13, winning the EuroLeague MVP in 2018 before entering the NBA Draft.' },
    ],
  },
  // ─── 2026-03-29 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-29', league: 'NBA',
    mystery_player: { name: 'De\'Aaron Fox', team: 'San Antonio Spurs', position: 'PG', height: "6'3\"", jerseyNumber: 5, conference: 'Western', college: 'Kentucky', age: 27, stats: { ppg: 23.5, apg: 7.1, rpg: 3.9, fg_pct: .468 } },
    showdown_player_a: { name: 'Anthony Edwards', team: 'Minnesota Timberwolves', stats: { ppg: 25.8, rpg: 5.2, apg: 5.1, spg: 1.3 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Ja Morant', team: 'Memphis Grizzlies', stats: { ppg: 21.2, rpg: 4.0, apg: 8.1, spg: 1.0 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO IS THE MORE EXPLOSIVE GUARD?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Edwards leads in scoring, rebounds, and steals, but Morant counters with significantly more assists (8.1 vs 5.1) — two of the league\'s most athletic players on very different trajectories.',
    blind_rank_players: [
      { name: 'Shai Gilgeous-Alexander', team: 'OKC Thunder', rankingStat: 32.2, statLabel: 'PPG' },
      { name: 'Jalen Brunson', team: 'New York Knicks', rankingStat: 26.4, statLabel: 'PPG' },
      { name: 'Nikola Jokic', team: 'Denver Nuggets', rankingStat: 29.4, statLabel: 'PPG' },
      { name: 'Karl-Anthony Towns', team: 'New York Knicks', rankingStat: 24.4, statLabel: 'PPG' },
      { name: 'De\'Aaron Fox', team: 'San Antonio Spurs', rankingStat: 23.5, statLabel: 'PPG' },
    ],
    blind_rank_category: 'RANK BY OVERALL GREATNESS',
    trivia_questions: [
      { question: 'De\'Aaron Fox and Bam Adebayo were teammates at which college?', options: ['Duke', 'Kentucky', 'Kansas', 'North Carolina'], correctIndex: 1, explanation: 'Both Fox and Adebayo played one season together at Kentucky in 2016-17, then were top-10 picks in the same draft.' },
      { question: 'Karl-Anthony Towns was traded to the Knicks in a deal involving which player going to Minnesota?', options: ['Julius Randle', 'Mitchell Robinson', 'Donte DiVincenzo', 'RJ Barrett'], correctIndex: 0, explanation: 'KAT was traded to the Knicks in October 2024 in a deal that sent Julius Randle, Donte DiVincenzo, and picks to Minnesota.' },
      { question: 'Alperen Sengun was drafted out of which Turkish basketball club?', options: ['Galatasaray', 'Fenerbahce', 'Besiktas', 'Bursa'], correctIndex: 1, explanation: 'Sengun was playing for Fenerbahce in Turkey when he was drafted 16th overall by Houston in 2021.' },
    ],
  },
  // ─── 2026-03-30 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-30', league: 'NBA',
    mystery_player: { name: 'Tyler Herro', team: 'Miami Heat', position: 'SG/SF', height: "6'5\"", jerseyNumber: 14, conference: 'Eastern', college: 'Kentucky', age: 25, stats: { ppg: 20.8, apg: 5.6, rpg: 4.1, fg_pct: .449 } },
    showdown_player_a: { name: 'Jrue Holiday', team: 'Boston Celtics', stats: { ppg: 13.4, spg: 1.1, three_pct: .382, bpg: 0.4 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Derrick White', team: 'Boston Celtics', stats: { ppg: 16.2, spg: 1.0, three_pct: .390, bpg: 1.1 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO IS THE BETTER DEFENDER?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Holiday edges White in steals, but White scores more, shoots better from three, and blocks nearly three times as many shots (1.1 vs 0.4) — a guard averaging over 1 block per game is almost unheard of.',
    blind_rank_players: [
      { name: 'Trae Young', team: 'Atlanta Hawks', rankingStat: 11.1, statLabel: 'APG' },
      { name: 'Tyrese Haliburton', team: 'Indiana Pacers', rankingStat: 10.9, statLabel: 'APG' },
      { name: 'Jalen Brunson', team: 'New York Knicks', rankingStat: 7.2, statLabel: 'APG' },
      { name: 'De\'Aaron Fox', team: 'San Antonio Spurs', rankingStat: 7.1, statLabel: 'APG' },
      { name: 'Donovan Mitchell', team: 'Cleveland Cavaliers', rankingStat: 5.1, statLabel: 'APG' },
    ],
    blind_rank_category: 'WHO WOULD YOU BUILD A TEAM AROUND?',
    trivia_questions: [
      { question: 'Tyler Herro won the 2022 NBA Sixth Man of the Year Award. How old was he?', options: ['20', '21', '22', '23'], correctIndex: 2, explanation: 'Herro was 22 years old when he won the award, becoming one of the youngest Sixth Man Award winners ever.' },
      { question: 'Donovan Mitchell\'s nickname is Spida. Where does that nickname come from?', options: ['Spider-Man', 'His quick movements', 'A childhood friend', 'His hand size'], correctIndex: 0, explanation: 'Mitchell\'s nickname "Spida" comes from his love of Spider-Man — he\'s been a fan since childhood and celebrated a big slam with a Spider-Man pose.' },
      { question: 'In which city did the NBA originally play before becoming a modern league?', options: ['New York', 'Boston', 'Philadelphia', 'Chicago'], correctIndex: 2, explanation: 'The BAA (which became the NBA) was founded in 1946 and the Philadelphia Warriors were one of the original franchises.' },
    ],
  },
  // ─── 2026-03-31 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-31', league: 'NBA',
    mystery_player: { name: 'LaMelo Ball', team: 'Charlotte Hornets', position: 'PG', height: "6'7\"", jerseyNumber: 1, conference: 'Eastern', college: 'None (overseas)', age: 23, stats: { ppg: 22.9, apg: 8.2, rpg: 5.8, fg_pct: .435 } },
    showdown_player_a: { name: 'Allen Iverson', team: 'Philadelphia 76ers', stats: { career_ppg: 26.7, career_apg: 6.2, career_spg: 2.2, all_star: 11 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Tracy McGrady', team: 'Orlando Magic', stats: { career_ppg: 19.6, career_apg: 4.4, career_spg: 1.2, all_star: 7 }, statLabel: 'Career' },
    showdown_category: 'WHO HAD THE BETTER CAREER?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'AI dominates in career scoring average, steals, All-Star selections, and led Philly to the Finals. T-Mac had the higher peak scoring titles but fewer accolades — a debate between longevity and peak brilliance.',
    blind_rank_players: [
      { name: 'Stephen Curry', team: 'Golden State Warriors', rankingStat: 23.9, statLabel: 'PPG' },
      { name: 'LeBron James', team: 'Los Angeles Lakers', rankingStat: 23.7, statLabel: 'PPG' },
      { name: 'LaMelo Ball', team: 'Charlotte Hornets', rankingStat: 22.9, statLabel: 'PPG' },
      { name: 'Jaylen Brown', team: 'Boston Celtics', rankingStat: 23.2, statLabel: 'PPG' },
      { name: 'Franz Wagner', team: 'Orlando Magic', rankingStat: 22.1, statLabel: 'PPG' },
    ],
    blind_rank_category: 'RANK BY CULTURAL IMPACT',
    trivia_questions: [
      { question: 'Stephen Curry set the single-season three-point record in 2015-16 with how many threes?', options: ['286', '324', '402', '373'], correctIndex: 2, explanation: 'Curry made 402 three-pointers in the 2015-16 season, shattering his own record of 286 and becoming unanimous MVP.' },
      { question: 'LaMelo Ball became the youngest player in NBA history to record a triple-double. How old was he?', options: ['18 years, 345 days', '19 years, 136 days', '19 years, 14 days', '18 years, 312 days'], correctIndex: 2, explanation: 'Ball was 19 years and 14 days old when he recorded his historic triple-double, becoming the youngest player in NBA history to accomplish the feat.' },
      { question: 'Damian Lillard attended Weber State, which is a Division I school. In what conference do they play?', options: ['WCC', 'Big Sky Conference', 'Mountain West', 'Horizon League'], correctIndex: 1, explanation: 'Weber State competes in the Big Sky Conference, a mid-major conference in the Mountain West region.' },
    ],
  },
  // ─── 2026-04-01 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-01', league: 'NBA',
    mystery_player: { name: 'Jaylen Brown', team: 'Boston Celtics', position: 'SG/SF', height: "6'6\"", jerseyNumber: 7, conference: 'Eastern', college: 'California', age: 28, stats: { ppg: 23.2, apg: 3.4, rpg: 5.8, fg_pct: .497 } },
    showdown_player_a: { name: 'Jayson Tatum', team: 'Boston Celtics', stats: { ppg: 26.5, rpg: 8.3, apg: 4.9, fg_pct: .471 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Luka Doncic', team: 'Los Angeles Lakers', stats: { ppg: 27.8, rpg: 8.2, apg: 8.1, fg_pct: .487 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO IS THE BETTER FRANCHISE CORNERSTONE?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Luka leads in scoring, assists, and efficiency, but Tatum edges him in rebounding and has a championship ring — the ultimate "stats vs. hardware" debate between the two best wing players in basketball.',
    blind_rank_players: [
      { name: 'Nikola Jokic', team: 'Denver Nuggets', rankingStat: 12.8, statLabel: 'RPG' },
      { name: 'Karl-Anthony Towns', team: 'New York Knicks', rankingStat: 13.2, statLabel: 'RPG' },
      { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', rankingStat: 11.6, statLabel: 'RPG' },
      { name: 'Scottie Barnes', team: 'Toronto Raptors', rankingStat: 8.1, statLabel: 'RPG' },
      { name: 'Anthony Davis', team: 'Los Angeles Lakers', rankingStat: 12.4, statLabel: 'RPG' },
    ],
    blind_rank_category: 'WHO WAS THE MOST DOMINANT?',
    trivia_questions: [
      { question: 'LeBron James has won NBA championships with how many different teams?', options: ['1', '2', '3', '4'], correctIndex: 2, explanation: 'LeBron has won titles with the Miami Heat (2012, 2013), Cleveland Cavaliers (2016), and LA Lakers (2020) — three franchises.' },
      { question: 'Jaylen Brown was the #3 overall pick in which draft year?', options: ['2015', '2016', '2017', '2018'], correctIndex: 1, explanation: 'Brown was selected 3rd overall by Boston in 2016, the same draft that included Ben Simmons (#1) and Brandon Ingram (#2).' },
      { question: 'Giannis won the NBA championship in 2021 against which team?', options: ['Los Angeles Lakers', 'Brooklyn Nets', 'Phoenix Suns', 'Denver Nuggets'], correctIndex: 2, explanation: 'The Bucks defeated the Phoenix Suns 4-2 in the 2021 NBA Finals, with Giannis averaging 35.2 PPG and winning Finals MVP.' },
    ],
  },
  // ─── 2026-04-02 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-02', league: 'NBA',
    mystery_player: { name: 'Jaren Jackson Jr.', team: 'Memphis Grizzlies', position: 'PF/C', height: "6'11\"", jerseyNumber: 13, conference: 'Western', college: 'Michigan State', age: 25, stats: { ppg: 20.3, apg: 1.4, rpg: 6.6, fg_pct: .480 } },
    showdown_player_a: { name: 'Jrue Holiday', team: 'Boston Celtics', stats: { ppg: 13.4, spg: 1.1, rpg: 5.4, apg: 4.3 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Dyson Daniels', team: 'Atlanta Hawks', stats: { ppg: 13.4, spg: 3.1, rpg: 5.8, apg: 3.6 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO IS THE BETTER PERIMETER DEFENDER?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Holiday has the bigger name and the championship pedigree, but Daniels averages nearly 3x the steals (3.1 vs 1.1) — a 21-year-old leading the league in steals while matching a future Hall of Famer in every other category.',
    blind_rank_players: [
      { name: 'Jaren Jackson Jr.', team: 'Memphis Grizzlies', rankingStat: 2.8, statLabel: 'BPG' },
      { name: 'Victor Wembanyama', team: 'San Antonio Spurs', rankingStat: 3.6, statLabel: 'BPG' },
      { name: 'Anthony Davis', team: 'Los Angeles Lakers', rankingStat: 2.3, statLabel: 'BPG' },
      { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', rankingStat: 1.1, statLabel: 'BPG' },
      { name: 'Evan Mobley', team: 'Cleveland Cavaliers', rankingStat: 1.9, statLabel: 'BPG' },
    ],
    blind_rank_category: 'RANK BY CLUTCH FACTOR',
    trivia_questions: [
      { question: 'Stephen Curry\'s father Dell Curry played how many seasons in the NBA?', options: ['10', '14', '16', '12'], correctIndex: 2, explanation: 'Dell Curry played 16 seasons in the NBA as a reliable three-point shooter, paving the way for his son\'s even greater career.' },
      { question: 'Jaren Jackson Jr. won the NBA Defensive Player of the Year award in which year?', options: ['2021', '2022', '2023', '2024'], correctIndex: 2, explanation: 'JJJ won the 2023 Defensive Player of the Year award, becoming the first Grizzly to win the award.' },
      { question: 'LeBron James declared for the NBA Draft directly out of which high school?', options: ['Akron East', 'St. Vincent-St. Mary', 'Oak Hill Academy', 'Findlay Prep'], correctIndex: 1, explanation: 'LeBron attended St. Vincent-St. Mary Catholic high school in Akron, Ohio, where he was a nationally hyped prospect.' },
    ],
  },
  // ─── 2026-04-03 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-03', league: 'NBA',
    mystery_player: { name: 'Devin Booker', team: 'Phoenix Suns', position: 'SG', height: "6'5\"", jerseyNumber: 1, conference: 'Western', college: 'Kentucky', age: 28, stats: { ppg: 25.1, apg: 6.4, rpg: 4.7, fg_pct: .491 } },
    showdown_player_a: { name: 'Kevin Garnett', team: 'Minnesota Timberwolves', stats: { career_ppg: 17.8, career_rpg: 10.0, career_bpg: 1.4, mvps: 1 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Dirk Nowitzki', team: 'Dallas Mavericks', stats: { career_ppg: 20.7, career_rpg: 7.5, career_bpg: 0.8, mvps: 1 }, statLabel: 'Career' },
    showdown_category: 'WHO HAD THE GREATER CAREER?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Dirk leads in career scoring by nearly 3 PPG and carried Dallas to a title as the clear #1, but KG grabs 2.5 more boards and blocks nearly twice as many shots — two power forwards who defined an era in completely different ways.',
    blind_rank_players: [
      { name: 'LeBron James', team: 'Los Angeles Lakers', rankingStat: 8.2, statLabel: 'APG' },
      { name: 'LaMelo Ball', team: 'Charlotte Hornets', rankingStat: 8.2, statLabel: 'APG' },
      { name: 'Cade Cunningham', team: 'Detroit Pistons', rankingStat: 8.1, statLabel: 'APG' },
      { name: 'Donovan Mitchell', team: 'Cleveland Cavaliers', rankingStat: 5.1, statLabel: 'APG' },
      { name: 'Anthony Edwards', team: 'Minnesota Timberwolves', rankingStat: 5.1, statLabel: 'APG' },
    ],
    blind_rank_category: 'WHO HAD THE BEST PEAK?',
    trivia_questions: [
      { question: 'Devin Booker scored 70 points against which team in 2017?', options: ['Los Angeles Lakers', 'Philadelphia 76ers', 'Boston Celtics', 'New Orleans Pelicans'], correctIndex: 2, explanation: 'Booker dropped 70 points on the Celtics on March 24, 2017, becoming the youngest player ever to score 70 in a game.' },
      { question: 'De\'Aaron Fox broke the Kings\' postseason drought that lasted how many years?', options: ['13', '15', '16', '17'], correctIndex: 3, explanation: 'Fox led Sacramento to the playoffs in 2023, ending a 17-year drought — the longest active drought in the NBA at the time.' },
      { question: 'Jalen Green was born in which US state?', options: ['California', 'Texas', 'Georgia', 'Florida'], correctIndex: 0, explanation: 'Green was born in Fresno, California, and attended Prolific Prep before joining G League Ignite.' },
    ],
  },
  // ─── 2026-04-04 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-04', league: 'NBA',
    mystery_player: { name: 'Kevin Durant', team: 'Phoenix Suns', position: 'SF/PF', height: "6'10\"", jerseyNumber: 35, conference: 'Western', college: 'Texas', age: 36, stats: { ppg: 25.1, apg: 4.2, rpg: 6.8, fg_pct: .523 } },
    showdown_player_a: { name: 'Devin Booker', team: 'Phoenix Suns', stats: { ppg: 25.1, apg: 6.9, three_pct: .365, fg_pct: .462 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Tyler Herro', team: 'Miami Heat', stats: { ppg: 20.8, apg: 5.6, three_pct: .387, fg_pct: .449 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO IS THE BETTER SHOOTING GUARD?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Booker wins in scoring and assists, but Herro shoots better from three (.387 vs .365) — the former Sixth Man of the Year is quietly a more accurate long-range shooter than a perennial All-Star.',
    blind_rank_players: [
      { name: 'Devin Booker', team: 'Phoenix Suns', rankingStat: 25.1, statLabel: 'PPG' },
      { name: 'Kevin Durant', team: 'Phoenix Suns', rankingStat: 25.1, statLabel: 'PPG' },
      { name: 'Damian Lillard', team: 'Milwaukee Bucks', rankingStat: 25.2, statLabel: 'PPG' },
      { name: 'Anthony Edwards', team: 'Minnesota Timberwolves', rankingStat: 25.8, statLabel: 'PPG' },
      { name: 'Jayson Tatum', team: 'Boston Celtics', rankingStat: 26.5, statLabel: 'PPG' },
    ],
    blind_rank_category: 'RANK BY CONSISTENCY',
    trivia_questions: [
      { question: 'Kevin Durant attended the University of Texas for one season before being drafted. What pick was he?', options: ['1st', '2nd', '3rd', '4th'], correctIndex: 1, explanation: 'Durant was selected 2nd overall by the Seattle SuperSonics (later Oklahoma City Thunder) in the 2007 NBA Draft.' },
      { question: 'Jaylen Brown won the 2024 NBA Finals MVP. Who did Boston defeat in the Finals?', options: ['Miami Heat', 'Milwaukee Bucks', 'Dallas Mavericks', 'Indiana Pacers'], correctIndex: 2, explanation: 'Brown won Finals MVP as the Celtics beat the Dallas Mavericks 4-1 in the 2024 NBA Finals.' },
      { question: 'Kevin Durant scored 54 points in a game on his way to winning the 2014 MVP. His famous speech described his mother as what?', options: ['His inspiration', 'The real MVP', 'His foundation', 'His hero'], correctIndex: 1, explanation: 'Durant\'s emotional MVP speech where he called his mother "the real MVP" became one of the most memorable moments in NBA history.' },
    ],
  },
  // ─── 2026-04-05 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-05', league: 'NBA',
    mystery_player: { name: 'Donovan Mitchell', team: 'Cleveland Cavaliers', position: 'SG', height: "6'1\"", jerseyNumber: 45, conference: 'Eastern', college: 'Louisville', age: 28, stats: { ppg: 24.7, apg: 5.1, rpg: 4.2, fg_pct: .462 } },
    showdown_player_a: { name: 'Anthony Davis', team: 'Los Angeles Lakers', stats: { ppg: 24.1, rpg: 12.4, three_pct: .167, fg_pct: .554 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Karl-Anthony Towns', team: 'New York Knicks', stats: { ppg: 24.4, rpg: 13.2, three_pct: .397, fg_pct: .540 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO IS THE BETTER ALL-AROUND BIG?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'AD edges KAT in field goal percentage, but Towns leads in rebounding and shoots 40% from three vs. Davis\'s 17% — that three-point gap is the most surprising stat split between two franchise centers.',
    blind_rank_players: [
      { name: 'Nikola Jokic', team: 'Denver Nuggets', rankingStat: 10.2, statLabel: 'APG' },
      { name: 'Luka Doncic', team: 'Los Angeles Lakers', rankingStat: 8.1, statLabel: 'APG' },
      { name: 'LeBron James', team: 'Los Angeles Lakers', rankingStat: 8.2, statLabel: 'APG' },
      { name: 'Stephen Curry', team: 'Golden State Warriors', rankingStat: 6.1, statLabel: 'APG' },
      { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', rankingStat: 5.9, statLabel: 'APG' },
    ],
    blind_rank_category: 'RANK BY OVERALL GREATNESS',
    trivia_questions: [
      { question: 'Donovan Mitchell was traded from Utah to Cleveland in which year?', options: ['2021', '2022', '2023', '2024'], correctIndex: 1, explanation: 'Mitchell was traded to the Cavaliers in September 2022 for a package of picks and players including Lauri Markkanen.' },
      { question: 'Nikola Jokic played for which Serbian club before entering the NBA?', options: ['Crvena zvezda', 'Partizan', 'Mega Leks', 'FMP Zeleznik'], correctIndex: 2, explanation: 'Jokic played for Mega Leks (now Mega MIS) in Serbia before being taken 41st overall by Denver in 2014.' },
      { question: 'Karl-Anthony Towns and Joel Embiid attended the same high school in Florida. True or false?', options: ['True', 'False', 'KAT went to high school in Florida but a different school', 'Both went to school in Europe'], correctIndex: 0, explanation: 'Both Towns and Embiid attended The Rock School in Gainesville, Florida — a high school that produced multiple NBA prospects.' },
    ],
  },
  // ─── 2026-04-06 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-06', league: 'NBA',
    mystery_player: { name: 'Anthony Davis', team: 'Los Angeles Lakers', position: 'C/PF', height: "6'10\"", jerseyNumber: 3, conference: 'Western', college: 'Kentucky', age: 32, stats: { ppg: 24.1, apg: 3.5, rpg: 12.4, fg_pct: .554 } },
    showdown_player_a: { name: 'Victor Wembanyama', team: 'San Antonio Spurs', stats: { ppg: 24.2, rpg: 10.4, bpg: 3.6, fg_pct: .467 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Anthony Davis', team: 'Los Angeles Lakers', stats: { ppg: 24.1, rpg: 12.4, bpg: 2.3, fg_pct: .554 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO IS THE BETTER SHOT BLOCKER?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Davis leads in rebounds and efficiency, but Wembanyama blocks 1.3 more shots per game (3.6 vs 2.3) at age 21 while nearly matching AD in scoring — a sophomore outblocking the best rim protector of the last decade.',
    blind_rank_players: [
      { name: 'Anthony Davis', team: 'Los Angeles Lakers', rankingStat: 24.1, statLabel: 'PPG' },
      { name: 'Victor Wembanyama', team: 'San Antonio Spurs', rankingStat: 24.2, statLabel: 'PPG' },
      { name: 'Donovan Mitchell', team: 'Cleveland Cavaliers', rankingStat: 24.7, statLabel: 'PPG' },
      { name: 'Karl-Anthony Towns', team: 'New York Knicks', rankingStat: 24.4, statLabel: 'PPG' },
      { name: 'Cade Cunningham', team: 'Detroit Pistons', rankingStat: 24.5, statLabel: 'PPG' },
    ],
    blind_rank_category: 'WHO WOULD YOU BUILD A TEAM AROUND?',
    trivia_questions: [
      { question: 'Anthony Davis was the #1 overall pick in which year?', options: ['2010', '2011', '2012', '2013'], correctIndex: 2, explanation: 'Davis was taken #1 overall by the New Orleans Hornets (now Pelicans) in the 2012 NBA Draft out of Kentucky.' },
      { question: 'What is Shai Gilgeous-Alexander\'s nationality?', options: ['American', 'Canadian', 'Trinidadian', 'American-Canadian'], correctIndex: 1, explanation: 'SGA was born in Hamilton, Ontario, Canada, and represents Canada internationally in basketball.' },
      { question: 'Which team did LeBron and Luka Doncic share for the first time when Luka was traded?', options: ['Cleveland Cavaliers', 'Boston Celtics', 'Los Angeles Lakers', 'Golden State Warriors'], correctIndex: 2, explanation: 'Luka was traded to the LA Lakers in January 2025, forming one of the most discussed player combinations in NBA history alongside LeBron.' },
    ],
  },
  // ─── 2026-04-07 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-07', league: 'NBA',
    mystery_player: { name: 'Stephen Curry', team: 'Golden State Warriors', position: 'PG', height: "6'2\"", jerseyNumber: 30, conference: 'Western', college: 'Davidson', age: 37, stats: { ppg: 23.9, apg: 6.1, rpg: 4.4, fg_pct: .451 } },
    showdown_player_a: { name: 'Jalen Brunson', team: 'New York Knicks', stats: { ppg: 26.4, apg: 7.2, fg_pct: .479, three_pct: .382 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Damian Lillard', team: 'Milwaukee Bucks', stats: { ppg: 25.2, apg: 7.4, fg_pct: .443, three_pct: .354 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO IS THE BETTER UNDERSIZED GUARD?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Lillard edges Brunson in assists, but Brunson leads in scoring, field goal percentage, and three-point accuracy — the undersized Knick is outplaying a seven-time All-Star in the same role.',
    blind_rank_players: [
      { name: 'Shai Gilgeous-Alexander', team: 'OKC Thunder', rankingStat: 32.2, statLabel: 'PPG' },
      { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', rankingStat: 28.3, statLabel: 'PPG' },
      { name: 'Luka Doncic', team: 'Los Angeles Lakers', rankingStat: 27.8, statLabel: 'PPG' },
      { name: 'Jalen Brunson', team: 'New York Knicks', rankingStat: 26.4, statLabel: 'PPG' },
      { name: 'Anthony Edwards', team: 'Minnesota Timberwolves', rankingStat: 25.8, statLabel: 'PPG' },
    ],
    blind_rank_category: 'RANK BY CULTURAL IMPACT',
    trivia_questions: [
      { question: 'Stephen Curry attended which small college before becoming a global star?', options: ['Gonzaga', 'Butler', 'Davidson', 'San Diego State'], correctIndex: 2, explanation: 'Curry went unrecruited by major programs and attended Davidson College, where he became the NCAA\'s most exciting player.' },
      { question: 'What year did the Golden State Warriors win their first title in the Curry-Kerr era?', options: ['2014', '2015', '2016', '2017'], correctIndex: 1, explanation: 'The Warriors won their first title in 2015, defeating Cleveland 4-2, with Andre Iguodala winning Finals MVP.' },
      { question: 'Anthony Davis was nicknamed "The Brow" for which physical feature?', options: ['His eyebrows', 'His hair', 'His beard', 'His arm length'], correctIndex: 0, explanation: 'Davis is famously known for his prominent unibrow, giving him the nickname "The Brow" or "Unibrow."' },
    ],
  },
  // ─── 2026-04-08 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-08', league: 'NBA',
    mystery_player: { name: 'LeBron James', team: 'Los Angeles Lakers', position: 'SF/PF', height: "6'9\"", jerseyNumber: 23, conference: 'Western', college: 'None (HS)', age: 40, stats: { ppg: 23.7, apg: 8.2, rpg: 7.8, fg_pct: .504 } },
    showdown_player_a: { name: 'LeBron James', team: 'Los Angeles Lakers', stats: { ppg: 23.7, apg: 8.2, rpg: 7.8, fg_pct: .504 }, statLabel: '2024-25 Season (Age 40)' },
    showdown_player_b: { name: 'Stephen Curry', team: 'Golden State Warriors', stats: { ppg: 23.9, apg: 6.1, rpg: 4.4, fg_pct: .451 }, statLabel: '2024-25 Season (Age 37)' },
    showdown_category: 'WHO IS AGING MORE GRACEFULLY?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Curry edges LeBron in scoring, but LeBron leads in assists, rebounds, and shooting efficiency at age 40 — three years older and still the more complete player, which may be the most remarkable stat of his career.',
    blind_rank_players: [
      { name: 'Tyrese Haliburton', team: 'Indiana Pacers', rankingStat: 10.9, statLabel: 'APG' },
      { name: 'Trae Young', team: 'Atlanta Hawks', rankingStat: 11.1, statLabel: 'APG' },
      { name: 'LaMelo Ball', team: 'Charlotte Hornets', rankingStat: 8.2, statLabel: 'APG' },
      { name: 'LeBron James', team: 'Los Angeles Lakers', rankingStat: 8.2, statLabel: 'APG' },
      { name: 'Nikola Jokic', team: 'Denver Nuggets', rankingStat: 10.2, statLabel: 'APG' },
    ],
    blind_rank_category: 'WHO WAS THE MOST DOMINANT?',
    trivia_questions: [
      { question: 'LeBron James announced his NBA commitment at a famous TV special called what?', options: ['The Big Reveal', 'The Decision', 'The Announcement', 'King James Decides'], correctIndex: 1, explanation: '"The Decision" aired on ESPN in July 2010 when LeBron announced he was leaving Cleveland to join the Miami Heat.' },
      { question: 'Tyrese Haliburton was selected in which draft pick position in 2020?', options: ['8th', '12th', '19th', '5th'], correctIndex: 1, explanation: 'Haliburton was selected 12th overall by the Sacramento Kings in 2020 and immediately showed elite playmaking abilities.' },
      { question: 'LaMelo Ball wore which jersey number before switching to #1 in the NBA?', options: ['0', '3', '22', '5'], correctIndex: 2, explanation: 'In overseas leagues and briefly at other stops, Ball wore different numbers before landing on #1 with Charlotte.' },
    ],
  },
  // ─── 2026-04-09 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-09', league: 'NBA',
    mystery_player: { name: 'Jalen Brunson', team: 'New York Knicks', position: 'PG', height: "6'1\"", jerseyNumber: 11, conference: 'Eastern', college: 'Villanova', age: 28, stats: { ppg: 26.4, apg: 7.2, rpg: 3.4, fg_pct: .479 } },
    showdown_player_a: { name: 'Mikal Bridges', team: 'New York Knicks', stats: { ppg: 17.6, rpg: 3.2, spg: 1.0, three_pct: .372 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Kevin Durant', team: 'Phoenix Suns', stats: { ppg: 25.1, rpg: 6.8, spg: 0.8, three_pct: .387 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO IS THE MORE RELIABLE IRON MAN?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Durant dominates in scoring and rebounding, but Bridges has played 300+ consecutive games while KD has missed 100+ games since 2019 — Bridges\'s durability and defensive versatility are the hidden stat line that wins championships.',
    blind_rank_players: [
      { name: 'Paolo Banchero', team: 'Orlando Magic', rankingStat: 21.4, statLabel: 'PPG' },
      { name: 'Franz Wagner', team: 'Orlando Magic', rankingStat: 22.1, statLabel: 'PPG' },
      { name: 'Alperen Sengun', team: 'Houston Rockets', rankingStat: 21.1, statLabel: 'PPG' },
      { name: 'Scottie Barnes', team: 'Toronto Raptors', rankingStat: 19.8, statLabel: 'PPG' },
      { name: 'Tyrese Haliburton', team: 'Indiana Pacers', rankingStat: 19.4, statLabel: 'PPG' },
    ],
    blind_rank_category: 'RANK BY CLUTCH FACTOR',
    trivia_questions: [
      { question: 'Jalen Brunson won two NCAA championships at Villanova in which years?', options: ['2015 and 2017', '2016 and 2018', '2017 and 2018', '2018 and 2019'], correctIndex: 1, explanation: 'Brunson won national championships with Villanova in 2016 and 2018, winning the MOP award in 2018.' },
      { question: 'Which Orlando Magic player was the 2023 NBA Rookie of the Year?', options: ['Franz Wagner', 'Paolo Banchero', 'Markelle Fultz', 'Cole Anthony'], correctIndex: 1, explanation: 'Banchero was the 2022-23 Rookie of the Year in his first season, having been drafted #1 overall in 2022.' },
      { question: 'Victor Wembanyama\'s wingspan is approximately how long?', options: ['7\'0"', '7\'3"', '7\'5"', '8\'0"'], correctIndex: 2, explanation: 'Wembanyama\'s wingspan measures approximately 7\'5", helping make him one of the most versatile defensive players ever.' },
    ],
  },
  // ─── 2026-04-10 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-10', league: 'NBA',
    mystery_player: { name: 'Shai Gilgeous-Alexander', team: 'Oklahoma City Thunder', position: 'PG/SG', height: "6'6\"", jerseyNumber: 2, conference: 'Western', college: 'Kentucky', age: 26, stats: { ppg: 32.2, apg: 6.3, rpg: 5.1, fg_pct: .535 } },
    showdown_player_a: { name: 'Steve Nash', team: 'Phoenix Suns', stats: { career_ppg: 14.3, career_apg: 8.5, career_three_pct: .428, mvps: 2 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Jason Kidd', team: 'New Jersey Nets', stats: { career_ppg: 12.6, career_apg: 8.7, career_three_pct: .349, mvps: 0 }, statLabel: 'Career' },
    showdown_category: 'WHO WAS THE BETTER FLOOR GENERAL?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Nash has 2 MVPs and shot nearly 43% from three, but Kidd edges him in career assists and made 3 Finals appearances to Nash\'s zero — the ultimate passer vs. shooter point guard debate.',
    blind_rank_players: [
      { name: 'Nikola Jokic', team: 'Denver Nuggets', rankingStat: 12.8, statLabel: 'RPG' },
      { name: 'Karl-Anthony Towns', team: 'New York Knicks', rankingStat: 13.2, statLabel: 'RPG' },
      { name: 'Anthony Davis', team: 'Los Angeles Lakers', rankingStat: 12.4, statLabel: 'RPG' },
      { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', rankingStat: 11.6, statLabel: 'RPG' },
      { name: 'Alperen Sengun', team: 'Houston Rockets', rankingStat: 9.2, statLabel: 'RPG' },
    ],
    blind_rank_category: 'WHO HAD THE BEST PEAK?',
    trivia_questions: [
      { question: 'Jayson Tatum has been selected to the All-Star Game how many times through 2025?', options: ['4', '5', '6', '7'], correctIndex: 2, explanation: 'Tatum has been a perennial All-Star since 2020, making 6 appearances through the 2024-25 season.' },
      { question: 'LaMelo Ball played professionally in which country before the NBA?', options: ['France', 'Serbia', 'Australia', 'Lithuania'], correctIndex: 2, explanation: 'Ball played for the Illawarra Hawks in Australia\'s NBL in 2019-20 before being drafted 3rd overall in 2020.' },
      { question: 'Tyrese Haliburton is known for his unorthodox shooting form. What is distinctive about it?', options: ['He shoots underhand', 'He releases far behind his head', 'His elbow flares out sideways', 'He drops the ball lower than most before shooting'], correctIndex: 1, explanation: 'Haliburton\'s release point sits unusually far behind his head — coaches tried to change it, but he kept it and shoots an efficient 40%+ from three.' },
    ],
  },
  // ─── 2026-04-11 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-11', league: 'NBA',
    mystery_player: { name: 'Nikola Jokic', team: 'Denver Nuggets', position: 'C', height: "6'11\"", jerseyNumber: 15, conference: 'Western', college: 'Serbia (international)', age: 30, stats: { ppg: 29.4, apg: 10.2, rpg: 12.8, fg_pct: .582 } },
    showdown_player_a: { name: 'De\'Aaron Fox', team: 'San Antonio Spurs', stats: { ppg: 23.5, apg: 7.1, three_pct: .323, fg_pct: .468 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Immanuel Quickley', team: 'Toronto Raptors', stats: { ppg: 18.6, apg: 6.8, three_pct: .381, fg_pct: .423 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO IS THE BETTER OUTSIDE SHOOTER?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Fox leads in scoring and overall efficiency, but Quickley shoots 6% better from three (.381 vs .323) and nearly matches Fox in assists — a former bench player is a more dangerous shooter than a $245 million franchise cornerstone.',
    blind_rank_players: [
      { name: 'Shai Gilgeous-Alexander', team: 'OKC Thunder', rankingStat: 32.2, statLabel: 'PPG' },
      { name: 'Nikola Jokic', team: 'Denver Nuggets', rankingStat: 29.4, statLabel: 'PPG' },
      { name: 'Jayson Tatum', team: 'Boston Celtics', rankingStat: 26.5, statLabel: 'PPG' },
      { name: 'Jalen Brunson', team: 'New York Knicks', rankingStat: 26.4, statLabel: 'PPG' },
      { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', rankingStat: 28.3, statLabel: 'PPG' },
    ],
    blind_rank_category: 'RANK BY CONSISTENCY',
    trivia_questions: [
      { question: 'What number did Giannis wear when he first entered the league?', options: ['34', '23', '32', 'He always wore 34'], correctIndex: 3, explanation: 'Giannis has worn #34 throughout his entire NBA career with Milwaukee, honoring his late father\'s nickname.' },
      { question: 'Jalen Brunson\'s father Rick Brunson had which NBA coaching role most recently?', options: ['Head Coach', 'Assistant Coach', 'Player Development', 'General Manager'], correctIndex: 1, explanation: 'Rick Brunson worked as an assistant coach in the NBA after retiring as a player, watching his son become a star.' },
      { question: 'Jayson Tatum won gold at the 2024 Paris Olympics representing which country?', options: ['USA', 'Canada', 'France', 'US Virgin Islands'], correctIndex: 0, explanation: 'Tatum was a key member of Team USA that won gold at the 2024 Paris Olympics, defeating France in the final.' },
    ],
  },
  // ─── 2026-04-12 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-12', league: 'NBA',
    mystery_player: { name: 'Luka Doncic', team: 'Los Angeles Lakers', position: 'SF/PG', height: "6'7\"", jerseyNumber: 77, conference: 'Western', college: 'Slovenia (international)', age: 26, stats: { ppg: 27.8, apg: 8.1, rpg: 8.2, fg_pct: .487 } },
    showdown_player_a: { name: 'Larry Bird', team: 'Boston Celtics', stats: { career_ppg: 24.3, career_rpg: 10.0, career_apg: 6.3, mvps: 3 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Julius Erving', team: 'Philadelphia 76ers', stats: { career_ppg: 22.0, career_rpg: 6.7, career_apg: 3.9, mvps: 1 }, statLabel: 'Career' },
    showdown_category: 'WHO WAS THE GREATER FORWARD?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Bird leads in every major stat category and has 3 MVPs to Dr. J\'s 1, but Erving revolutionized the game\'s athleticism and won 3 ABA titles — a debate between dominance and cultural impact.',
    blind_rank_players: [
      { name: 'Donovan Mitchell', team: 'Cleveland Cavaliers', rankingStat: 24.7, statLabel: 'PPG' },
      { name: 'Karl-Anthony Towns', team: 'New York Knicks', rankingStat: 24.4, statLabel: 'PPG' },
      { name: 'Cade Cunningham', team: 'Detroit Pistons', rankingStat: 24.5, statLabel: 'PPG' },
      { name: 'Victor Wembanyama', team: 'San Antonio Spurs', rankingStat: 24.2, statLabel: 'PPG' },
      { name: 'Anthony Davis', team: 'Los Angeles Lakers', rankingStat: 24.1, statLabel: 'PPG' },
    ],
    blind_rank_category: 'RANK BY OVERALL GREATNESS',
    trivia_questions: [
      { question: 'Luka Doncic holds the Mavericks\' record for youngest player to score 30+ points in a playoff game. Who\'s record did he break?', options: ['Dirk Nowitzki', 'Jason Kidd', 'Brad Davis', 'Mark Aguirre'], correctIndex: 0, explanation: 'Doncic broke numerous franchise records held by Nowitzki, the franchise\'s all-time greatest player.' },
      { question: 'Kevin Durant\'s nickname KD comes from his initials. What does the D stand for?', options: ['David', 'Darnell', 'Durant', 'Dennis'], correctIndex: 2, explanation: 'KD simply stands for Kevin Durant — his first initial and last name initial. Simple, but it stuck.' },
      { question: 'Donovan Mitchell wore #45 in Cleveland. Why didn\'t he keep his previous #45 from Utah?', options: ['It was retired', 'Another player had it', 'He changed as a fresh start', 'Both A and B'], correctIndex: 1, explanation: 'Mitchell switched numbers when he arrived in Cleveland because the #45 was worn by another player; he later got it.' },
    ],
  },
  // ─── 2026-04-13 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-13', league: 'NBA',
    mystery_player: { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', position: 'PF/C', height: "6'11\"", jerseyNumber: 34, conference: 'Eastern', college: 'Greece (international)', age: 30, stats: { ppg: 28.3, apg: 5.9, rpg: 11.6, fg_pct: .611 } },
    showdown_player_a: { name: 'Franz Wagner', team: 'Orlando Magic', stats: { ppg: 22.1, rpg: 5.6, apg: 4.1, fg_pct: .476 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Jayson Tatum', team: 'Boston Celtics', stats: { ppg: 26.5, rpg: 8.3, apg: 4.9, fg_pct: .471 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO IS THE MORE EFFICIENT WING?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Tatum leads in raw production across the board, but Wagner shoots a higher percentage (.476 vs .471) while being 4 years younger — Orlando\'s quiet star is building a case that parallels early Tatum.',
    blind_rank_players: [
      { name: 'Shai Gilgeous-Alexander', team: 'OKC Thunder', rankingStat: 32.2, statLabel: 'PPG' },
      { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', rankingStat: 28.3, statLabel: 'PPG' },
      { name: 'Nikola Jokic', team: 'Denver Nuggets', rankingStat: 29.4, statLabel: 'PPG' },
      { name: 'Luka Doncic', team: 'Los Angeles Lakers', rankingStat: 27.8, statLabel: 'PPG' },
      { name: 'Jayson Tatum', team: 'Boston Celtics', rankingStat: 26.5, statLabel: 'PPG' },
    ],
    blind_rank_category: 'WHO WOULD YOU BUILD A TEAM AROUND?',
    trivia_questions: [
      { question: 'Shai Gilgeous-Alexander won an Olympic bronze medal at the 2024 Paris Olympics representing which country?', options: ['United States', 'Canada', 'Jamaica', 'Trinidad and Tobago'], correctIndex: 1, explanation: 'SGA was part of Canada\'s team at the 2024 Paris Olympics, where Canada won their first-ever Olympic basketball medal — a bronze — defeating Serbia in the third-place game.' },
      { question: 'The Oklahoma City Thunder were previously known as which team?', options: ['Vancouver Grizzlies', 'Seattle SuperSonics', 'New Jersey Nets', 'Kansas City Kings'], correctIndex: 1, explanation: 'The Thunder relocated from Seattle, where they were the SuperSonics, after the 2007-08 season.' },
      { question: 'Nikola Jokic became only the second center to win the NBA MVP since Shaquille O\'Neal. What year did Shaq win his last MVP?', options: ['1998', '1999', '2000', '2001'], correctIndex: 2, explanation: 'Shaquille O\'Neal won the MVP award in 2000 with the Los Angeles Lakers, 21 years before Jokic won in 2021.' },
    ],
  },
]

// ─── Seed function ────────────────────────────────────────────────────────────

async function seed() {
  console.log(`Seeding ${games.length} NBA game entries...`)
  let success = 0
  let failed = 0

  for (const game of games) {
    const { error } = await supabase
      .from('daily_games')
      .upsert(game, { onConflict: 'date,league' })

    if (error) {
      console.error(`✗ ${game.date} NBA — ${error.message}`)
      failed++
    } else {
      console.log(`✓ ${game.date} NBA`)
      success++
    }
  }

  console.log(`\nNBA seed complete: ${success} inserted, ${failed} failed`)
}

seed().catch((err) => {
  console.error('Seed script crashed:', err)
  process.exit(1)
})
