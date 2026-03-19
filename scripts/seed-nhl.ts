// No schema changes needed — mystery_player is stored as jsonb
// Run with:
// SUPABASE_SERVICE_ROLE_KEY=your-key npx ts-node --project scripts/tsconfig.json scripts/seed-nhl.ts

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://scloxktkudutupiyqvbx.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY env var is required')
  console.error('Usage: SUPABASE_SERVICE_ROLE_KEY=your-key npx ts-node --project scripts/tsconfig.json scripts/seed-nhl.ts')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

const games = [
  // ─── 2026-03-15 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-15', league: 'NHL',
    mystery_player: { name: 'Connor McDavid', team: 'Edmonton Oilers', position: 'C', height: "6'1\"", jerseyNumber: 97, conference: 'Western', country: 'Canada', age: 28, stats: { goals: 52, assists: 88, points: 140, plus_minus: 30 } },
    showdown_player_a: { name: 'Wayne Gretzky', team: 'Edmonton Oilers', stats: { career_pts: 2857, career_goals: 894, career_assists: 1963 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Connor McDavid', team: 'Edmonton Oilers', stats: { pts_per_game: 1.74, hart_trophies: 4, scoring_titles: 6 }, statLabel: 'Career thru 2024-25' },
    showdown_category: 'WHO IS THE GREATEST OILER EVER?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Gretzky is the greatest hockey player of all time — 2,857 career points, 4 Stanley Cups, and records so dominant they may never be broken.',
    blind_rank_players: [
      { name: 'Connor McDavid', team: 'Edmonton Oilers', rankingStat: 140, statLabel: 'Points (2024-25)' },
      { name: 'Nathan MacKinnon', team: 'Colorado Avalanche', rankingStat: 132, statLabel: 'Points (2024-25)' },
      { name: 'Nikita Kucherov', team: 'Tampa Bay Lightning', rankingStat: 118, statLabel: 'Points (2024-25)' },
      { name: 'Leon Draisaitl', team: 'Edmonton Oilers', rankingStat: 124, statLabel: 'Points (2024-25)' },
      { name: 'David Pastrnak', team: 'Boston Bruins', rankingStat: 104, statLabel: 'Points (2024-25)' },
    ],
    blind_rank_category: 'RANK BY OVERALL GREATNESS',
    trivia_questions: [
      { question: 'Connor McDavid won his first Stanley Cup in which year?', options: ['2022', '2023', '2024', '2025'], correctIndex: 2, explanation: 'McDavid finally won the Stanley Cup in 2024, leading Edmonton to the championship and winning the Conn Smythe Trophy as playoff MVP.' },
      { question: 'McDavid was the first overall pick in which NHL Draft?', options: ['2013', '2014', '2015', '2016'], correctIndex: 2, explanation: 'McDavid was the consensus #1 pick in the 2015 NHL Draft, taken by Edmonton after they won the lottery.' },
      { question: 'How many Art Ross Trophies (scoring titles) had McDavid won through the 2024-25 season?', options: ['4', '5', '6', '7'], correctIndex: 2, explanation: 'McDavid has won 6 Art Ross Trophies, cementing himself as the most dominant offensive player of his era.' },
    ],
  },
  // ─── 2026-03-16 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-16', league: 'NHL',
    mystery_player: { name: 'Wayne Gretzky', team: 'Edmonton Oilers', position: 'C', height: "6'0\"", jerseyNumber: 99, conference: 'Western', country: 'Canada', age: 64, stats: { goals: 52, assists: 163, points: 215, plus_minus: 71 } },
    showdown_player_a: { name: 'Sidney Crosby', team: 'Pittsburgh Penguins', stats: { career_pts: 1960, stanley_cups: 3, hart_trophies: 2 }, statLabel: 'Career thru 2024-25' },
    showdown_player_b: { name: 'Alex Ovechkin', team: 'Washington Capitals', stats: { career_goals: 900, stanley_cups: 1, rocket_richard: 9 }, statLabel: 'Career thru 2024-25' },
    showdown_category: 'CROSBY VS OVECHKIN: GREATER CAREER?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Crosby has 3 Stanley Cups, 2 Hart Trophies, and is a more complete two-way player — Ovechkin owns the goals record but Crosby wins the legacy debate.',
    blind_rank_players: [
      { name: 'Wayne Gretzky', team: 'Edmonton Oilers', rankingStat: 2857, statLabel: 'Career Points (all-time)' },
      { name: 'Jaromir Jagr', team: 'Pittsburgh Penguins', rankingStat: 1921, statLabel: 'Career Points' },
      { name: 'Mark Messier', team: 'Edmonton Oilers', rankingStat: 1887, statLabel: 'Career Points' },
      { name: 'Gordie Howe', team: 'Detroit Red Wings', rankingStat: 1850, statLabel: 'Career Points' },
      { name: 'Mario Lemieux', team: 'Pittsburgh Penguins', rankingStat: 1723, statLabel: 'Career Points' },
    ],
    blind_rank_category: 'WHO WAS THE MOST DOMINANT PLAYER?',
    trivia_questions: [
      { question: 'Wayne Gretzky\'s assist total alone (1,963) exceeds the career point totals of every other player in NHL history. True or False?', options: ['True', 'False'], correctIndex: 0, explanation: 'Gretzky finished with 1,963 assists — more than the combined points of any other player. His assists alone are more than Jagr\'s 1,921 career points (2nd all-time).' },
      { question: 'Gretzky was traded from Edmonton to Los Angeles in which year, shocking the hockey world?', options: ['1986', '1987', '1988', '1989'], correctIndex: 2, explanation: 'Gretzky was traded to the LA Kings on August 9, 1988, in a deal described as the biggest trade in sports history at the time.' },
      { question: 'Wayne Gretzky\'s jersey #99 was retired across the entire NHL — the only player to have this honor. True or False?', options: ['True', 'False'], correctIndex: 0, explanation: 'On February 6, 1999, Commissioner Gary Bettman retired #99 league-wide, ensuring no player would ever wear Gretzky\'s number again.' },
    ],
  },
  // ─── 2026-03-17 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-17', league: 'NHL',
    mystery_player: { name: 'Alex Ovechkin', team: 'Washington Capitals', position: 'LW', height: "6'3\"", jerseyNumber: 8, conference: 'Eastern', country: 'Russia', age: 39, stats: { goals: 31, assists: 25, points: 56, plus_minus: -2 } },
    showdown_player_a: { name: 'Connor McDavid', team: 'Edmonton Oilers', stats: { pts: 140, pts_per_game: 1.74 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Nathan MacKinnon', team: 'Colorado Avalanche', stats: { pts: 132, hart_trophies: 2 }, statLabel: '2024-25 Season' },
    showdown_category: 'WHO IS THE BETTER CURRENT SUPERSTAR?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'McDavid\'s 140-point pace and 2024 Conn Smythe win keep him ahead of MacKinnon as the undisputed best player in the world right now.',
    blind_rank_players: [
      { name: 'Alex Ovechkin', team: 'Washington Capitals', rankingStat: 900, statLabel: 'Career Goals (thru 2024-25)' },
      { name: 'Wayne Gretzky', team: 'Edmonton Oilers', rankingStat: 894, statLabel: 'Career Goals (record he broke)' },
      { name: 'Gordie Howe', team: 'Detroit Red Wings', rankingStat: 801, statLabel: 'Career Goals (NHL only)' },
      { name: 'Jaromir Jagr', team: 'Pittsburgh Penguins', rankingStat: 766, statLabel: 'Career Goals' },
      { name: 'Brett Hull', team: 'St. Louis Blues', rankingStat: 741, statLabel: 'Career Goals' },
    ],
    blind_rank_category: 'RANK BY PURE SKILL',
    trivia_questions: [
      { question: 'Alex Ovechkin broke Wayne Gretzky\'s all-time goals record in which season?', options: ['2022-23', '2023-24', '2024-25', '2025-26'], correctIndex: 2, explanation: 'Ovechkin surpassed Gretzky\'s 894 career goals during the 2024-25 season, becoming the all-time leading goal scorer in NHL history.' },
      { question: 'Ovechkin won his only Stanley Cup in which year?', options: ['2016', '2017', '2018', '2019'], correctIndex: 2, explanation: 'Ovechkin finally won the Stanley Cup in 2018, defeating the Vegas Golden Knights — his first and most emotionally significant championship.' },
      { question: 'How many Rocket Richard Trophies (goal-scoring titles) did Ovechkin win through the 2024-25 season?', options: ['7', '8', '9', '10'], correctIndex: 2, explanation: 'Ovechkin won 9 Rocket Richard Trophies, far more than any other player in NHL history.' },
    ],
  },
  // ─── 2026-03-18 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-18', league: 'NHL',
    mystery_player: { name: 'Nathan MacKinnon', team: 'Colorado Avalanche', position: 'C', height: "6'0\"", jerseyNumber: 29, conference: 'Western', country: 'Canada', age: 29, stats: { goals: 40, assists: 75, points: 115, plus_minus: 18 } },
    showdown_player_a: { name: 'Wayne Gretzky', team: 'Edmonton Oilers', stats: { career_pts: 2857, pts_per_game: 1.92 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Mario Lemieux', team: 'Pittsburgh Penguins', stats: { career_pts: 1723, pts_per_game: 1.88 }, statLabel: 'Career (915 games)' },
    showdown_category: 'WHO HAD THE BETTER PTS/GAME RATE?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Gretzky averaged 1.92 pts/game over 1,487 games — more total production AND a higher rate than Lemieux\'s incredible 1.88 pts/game.',
    blind_rank_players: [
      { name: 'Nathan MacKinnon', team: 'Colorado Avalanche', rankingStat: 132, statLabel: 'Points (2024-25)' },
      { name: 'Connor McDavid', team: 'Edmonton Oilers', rankingStat: 140, statLabel: 'Points (2024-25)' },
      { name: 'Leon Draisaitl', team: 'Edmonton Oilers', rankingStat: 124, statLabel: 'Points (2024-25)' },
      { name: 'Nikita Kucherov', team: 'Tampa Bay Lightning', rankingStat: 118, statLabel: 'Points (2024-25)' },
      { name: 'Auston Matthews', team: 'Toronto Maple Leafs', rankingStat: 98, statLabel: 'Points (2024-25)' },
    ],
    blind_rank_category: 'WHO CHANGED THE GAME?',
    trivia_questions: [
      { question: 'Nathan MacKinnon won his first Stanley Cup with Colorado in which year?', options: ['2020', '2021', '2022', '2023'], correctIndex: 2, explanation: 'MacKinnon won the Cup in 2022, finally capturing the title after years as the best player without a championship.' },
      { question: 'MacKinnon won back-to-back Hart Trophies in which years?', options: ['2019 and 2020', '2021 and 2022', '2023 and 2024', '2022 and 2023'], correctIndex: 2, explanation: 'MacKinnon won the Hart Trophy as NHL MVP in 2023 and 2024, becoming one of only a handful of players to win consecutive MVP awards.' },
      { question: 'MacKinnon was the 1st overall pick in 2013, selected ahead of which player who went 2nd overall?', options: ['Aaron Ekblad', 'Seth Jones', 'Aleksander Barkov', 'Jonathan Drouin'], correctIndex: 1, explanation: 'Seth Jones went 2nd overall in 2013 — a draft class that also included Brendan Gallagher and Valeri Nichushkin in the later rounds.' },
    ],
  },
  // ─── 2026-03-19 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-19', league: 'NHL',
    mystery_player: { name: 'Mario Lemieux', team: 'Pittsburgh Penguins', position: 'C', height: "6'4\"", jerseyNumber: 66, conference: 'Eastern', country: 'Canada', age: 59, stats: { goals: 85, assists: 114, points: 199, plus_minus: 41 } },
    showdown_player_a: { name: 'Cale Makar', team: 'Colorado Avalanche', stats: { g: 28, a: 68, pts: 96, norris_trophies: 2 }, statLabel: '2024-25 Season / Career' },
    showdown_player_b: { name: 'Quinn Hughes', team: 'Vancouver Canucks', stats: { g: 22, a: 72, pts: 94, norris_trophies: 1 }, statLabel: '2024-25 Season / Career' },
    showdown_category: 'BETTER MODERN DEFENSEMAN?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Makar\'s 2 Norris Trophies, Conn Smythe win, and Stanley Cup give him the edge — he is widely considered the best defenseman of this generation.',
    blind_rank_players: [
      { name: 'Mario Lemieux', team: 'Pittsburgh Penguins', rankingStat: 1.88, statLabel: 'Career Pts/Game (2nd all-time)' },
      { name: 'Wayne Gretzky', team: 'Edmonton Oilers', rankingStat: 1.92, statLabel: 'Career Pts/Game (all-time)' },
      { name: 'Mike Bossy', team: 'New York Islanders', rankingStat: 0.762, statLabel: 'Career Goals/Game' },
      { name: 'Cy Denneny', team: 'Ottawa Senators', rankingStat: 0.754, statLabel: 'Career Goals/Game (1920s)' },
      { name: 'Babe Dye', team: 'Toronto St. Pats', rankingStat: 0.714, statLabel: 'Career Goals/Game (1920s)' },
    ],
    blind_rank_category: 'RANK BY LEGACY',
    trivia_questions: [
      { question: 'Mario Lemieux was diagnosed with Hodgkin\'s lymphoma during which season and still won the scoring title?', options: ['1991-92', '1992-93', '1993-94', '1994-95'], correctIndex: 1, explanation: 'Lemieux was diagnosed with Hodgkin\'s lymphoma in January 1993 and missed 24 games for radiation treatments, yet still won the scoring title with 160 points in 60 games.' },
      { question: 'Mario Lemieux is the only player to score a goal in how many different ways in a single game?', options: ['3', '4', '5', '6'], correctIndex: 2, explanation: 'On December 31, 1988, Lemieux scored 5 goals — at even strength, on a power play, shorthanded, on a penalty shot, and into an empty net.' },
      { question: 'Lemieux purchased the Pittsburgh Penguins to save them from bankruptcy in which year?', options: ['1997', '1999', '2000', '2001'], correctIndex: 1, explanation: 'Lemieux converted the money owed to him by the bankrupt franchise into equity in 1999, becoming a player-owner and saving the Penguins for Pittsburgh.' },
    ],
  },
  // ─── 2026-03-20 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-20', league: 'NHL',
    mystery_player: { name: 'Leon Draisaitl', team: 'Edmonton Oilers', position: 'C', height: "6'1\"", jerseyNumber: 29, conference: 'Western', country: 'Germany', age: 29, stats: { goals: 36, assists: 67, points: 103, plus_minus: 15 } },
    showdown_player_a: { name: 'Bobby Orr', team: 'Boston Bruins', stats: { career_pts: 915, norris_trophies: 8, calder_trophy: true }, statLabel: 'Career (657 games)' },
    showdown_player_b: { name: 'Cale Makar', team: 'Colorado Avalanche', stats: { norris_trophies: 2, conn_smythe: true, pts_per_game: 1.10 }, statLabel: 'Career thru 2024-25' },
    showdown_category: 'GREATEST OFFENSIVE DEFENSEMAN EVER?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Bobby Orr revolutionized the defenseman position — 8 Norris Trophies, 2 Stanley Cups, and the only defenseman ever to lead the NHL in scoring.',
    blind_rank_players: [
      { name: 'Leon Draisaitl', team: 'Edmonton Oilers', rankingStat: 52, statLabel: 'Goals (2024-25)' },
      { name: 'Auston Matthews', team: 'Toronto Maple Leafs', rankingStat: 47, statLabel: 'Goals (2024-25)' },
      { name: 'Alex Ovechkin', team: 'Washington Capitals', rankingStat: 38, statLabel: 'Goals (2024-25)' },
      { name: 'David Pastrnak', team: 'Boston Bruins', rankingStat: 46, statLabel: 'Goals (2024-25)' },
      { name: 'Connor McDavid', team: 'Edmonton Oilers', rankingStat: 52, statLabel: 'Goals (2024-25)' },
    ],
    blind_rank_category: 'WHO WOULD YOU BUILD A TEAM AROUND?',
    trivia_questions: [
      { question: 'Leon Draisaitl won the Hart Trophy (NHL MVP) in which season?', options: ['2019-20', '2020-21', '2021-22', '2022-23'], correctIndex: 0, explanation: 'Draisaitl won the Hart Trophy in 2019-20 with 110 points in 71 games — one of the best seasons by a non-McDavid player that decade.' },
      { question: 'Draisaitl is from which country — making him the first player from that nation to win the Hart Trophy?', options: ['Austria', 'Switzerland', 'Germany', 'Sweden'], correctIndex: 2, explanation: 'Draisaitl is German — born in Cologne — and his Hart Trophy win in 2020 was the first ever by a German-born player.' },
      { question: 'Bobby Orr won the Norris Trophy as best defenseman how many consecutive times?', options: ['6', '7', '8', '9'], correctIndex: 2, explanation: 'Orr won 8 consecutive Norris Trophies from 1967-68 through 1974-75 — a run of dominance that no defenseman has come close to matching.' },
    ],
  },
  // ─── 2026-03-21 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-21', league: 'NHL',
    mystery_player: { name: 'Bobby Orr', team: 'Boston Bruins', position: 'D', height: "6'0\"", jerseyNumber: 4, conference: 'Eastern', country: 'Canada', age: 77, stats: { goals: 37, assists: 102, points: 139, plus_minus: 124 } },
    showdown_player_a: { name: 'Auston Matthews', team: 'Toronto Maple Leafs', stats: { g: 47, career_goals: 340, rocket_richard: 4 }, statLabel: '2024-25 Season / Career' },
    showdown_player_b: { name: 'David Pastrnak', team: 'Boston Bruins', stats: { g: 46, career_goals: 390, nhl_seasons: 11 }, statLabel: '2024-25 Season / Career' },
    showdown_category: 'BETTER ELITE GOAL SCORER?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Pastrnak has more career goals at comparable ages and has been more consistent across more seasons, giving him the slight edge in pure goal-scoring output.',
    blind_rank_players: [
      { name: 'Bobby Orr', team: 'Boston Bruins', rankingStat: 8, statLabel: 'Norris Trophies (all-time record)' },
      { name: 'Doug Harvey', team: 'Montreal Canadiens', rankingStat: 7, statLabel: 'Norris Trophies' },
      { name: 'Nicklas Lidstrom', team: 'Detroit Red Wings', rankingStat: 7, statLabel: 'Norris Trophies' },
      { name: 'Cale Makar', team: 'Colorado Avalanche', rankingStat: 2, statLabel: 'Norris Trophies (thru 2024-25)' },
      { name: 'Chris Chelios', team: 'Montreal Canadiens', rankingStat: 3, statLabel: 'Norris Trophies' },
    ],
    blind_rank_category: 'RANK BY CLUTCH FACTOR',
    trivia_questions: [
      { question: 'Bobby Orr scored the Stanley Cup-winning goal in 1970 and was famously photographed flying through the air. Who tripped him?', options: ['Tony Esposito', 'Glenn Hall', 'Gerry Cheevers', 'Noel Picard'], correctIndex: 3, explanation: 'Noel Picard of the Blues tripped Orr as he scored in overtime of Game 4, creating the iconic photo of Orr flying horizontal through the air.' },
      { question: 'Bobby Orr\'s career was shortened by what injury?', options: ['Shoulder injuries', 'Knee injuries (multiple surgeries)', 'Hip problems', 'Back problems'], correctIndex: 1, explanation: 'Orr had 6 knee surgeries during his career, limiting him to only 657 games. Many believe he would have dominated for another decade with healthy knees.' },
      { question: 'Auston Matthews became the first Maple Leaf to win the Rocket Richard Trophy in which year?', options: ['2019', '2020', '2021', '2022'], correctIndex: 2, explanation: 'Matthews won his first Rocket Richard Trophy in 2020-21 with 41 goals in 52 games, then won it again in 2022, 2023, and 2024.' },
    ],
  },
  // ─── 2026-03-22 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-22', league: 'NHL',
    mystery_player: { name: 'Auston Matthews', team: 'Toronto Maple Leafs', position: 'C', height: "6'3\"", jerseyNumber: 34, conference: 'Eastern', country: 'USA', age: 27, stats: { goals: 35, assists: 30, points: 65, plus_minus: 4 } },
    showdown_player_a: { name: 'Martin Brodeur', team: 'New Jersey Devils', stats: { career_wins: 691, shutouts: 125, stanley_cups: 3 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Patrick Roy', team: 'Montreal Canadiens', stats: { career_wins: 551, conn_smythe: 3, stanley_cups: 4 }, statLabel: 'Career' },
    showdown_category: 'GREATEST GOALIE OF ALL TIME?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Brodeur holds the all-time records for wins (691), shutouts (125), and games played by a goalie — his longevity and consistency are unmatched.',
    blind_rank_players: [
      { name: 'Auston Matthews', team: 'Toronto Maple Leafs', rankingStat: 4, statLabel: 'Rocket Richard Trophies (goal-scoring titles)' },
      { name: 'Alex Ovechkin', team: 'Washington Capitals', rankingStat: 9, statLabel: 'Rocket Richard Trophies' },
      { name: 'Brett Hull', team: 'St. Louis Blues', rankingStat: 3, statLabel: 'Rocket Richard era scoring titles' },
      { name: 'Wayne Gretzky', team: 'Edmonton Oilers', rankingStat: 5, statLabel: 'Scoring Titles (Art Ross)' },
      { name: 'Gordie Howe', team: 'Detroit Red Wings', rankingStat: 6, statLabel: 'Art Ross Trophies' },
    ],
    blind_rank_category: 'RANK BY OVERALL GREATNESS',
    trivia_questions: [
      { question: 'Auston Matthews was born and raised in which US city before moving to Switzerland as a teenager to develop?', options: ['Boston', 'Detroit', 'Scottsdale, Arizona', 'Chicago'], correctIndex: 2, explanation: 'Matthews grew up in Scottsdale, Arizona — an unusual hockey background that led him to play in Switzerland\'s top league before being drafted #1 overall.' },
      { question: 'Martin Brodeur won 3 Stanley Cups with which franchise?', options: ['New York Rangers', 'New Jersey Devils', 'Detroit Red Wings', 'Colorado Avalanche'], correctIndex: 1, explanation: 'Brodeur won all 3 of his Stanley Cups with the New Jersey Devils — in 1995, 2000, and 2003.' },
      { question: 'Patrick Roy was traded mid-game after a blowout loss, refusing to be pulled. What was that game called?', options: ['The Incident', 'The Trade Game', 'The 11-1 Game', 'The Detroit Disaster'], correctIndex: 2, explanation: 'Roy let in 9 goals against Detroit on December 2, 1995 before being pulled — he then told team president Ronald Corey it was his last game in Montreal, leading to the trade to Colorado.' },
    ],
  },
  // ─── 2026-03-23 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-23', league: 'NHL',
    mystery_player: { name: 'Sidney Crosby', team: 'Pittsburgh Penguins', position: 'C', height: "5'11\"", jerseyNumber: 87, conference: 'Eastern', country: 'Canada', age: 37, stats: { goals: 28, assists: 56, points: 84, plus_minus: 12 } },
    showdown_player_a: { name: 'Gordie Howe', team: 'Detroit Red Wings', stats: { career_goals: 801, seasons_played: 26, stanley_cups: 4 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Mark Messier', team: 'Edmonton Oilers', stats: { career_pts: 1887, stanley_cups: 6, teams_captained_to_cup: 2 }, statLabel: 'Career' },
    showdown_category: 'GREATER NHL LEGEND: HOWE OR MESSIER?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Messier won 6 Stanley Cups, captained two different franchises to championships, and his 1994 guarantee game is the most iconic leadership moment in NHL history.',
    blind_rank_players: [
      { name: 'Sidney Crosby', team: 'Pittsburgh Penguins', rankingStat: 3, statLabel: 'Stanley Cups' },
      { name: 'Connor McDavid', team: 'Edmonton Oilers', rankingStat: 1, statLabel: 'Stanley Cups' },
      { name: 'Alex Ovechkin', team: 'Washington Capitals', rankingStat: 1, statLabel: 'Stanley Cups' },
      { name: 'Nathan MacKinnon', team: 'Colorado Avalanche', rankingStat: 1, statLabel: 'Stanley Cups' },
      { name: 'Wayne Gretzky', team: 'Edmonton Oilers', rankingStat: 4, statLabel: 'Stanley Cups' },
    ],
    blind_rank_category: 'WHO WAS THE MOST DOMINANT PLAYER?',
    trivia_questions: [
      { question: 'Sidney Crosby won the Conn Smythe Trophy (playoff MVP) in how many Stanley Cup wins?', options: ['1', '2', '3', 'All 3 Cups'], correctIndex: 1, explanation: 'Crosby won the Conn Smythe in 2016 and 2017 — two consecutive playoff MVP awards in back-to-back championships with Pittsburgh.' },
      { question: 'Gordie Howe scored at least 1 point in the NHL in 5 different decades (1940s through 1980s). True or False?', options: ['True', 'False'], correctIndex: 0, explanation: 'Howe scored in the 1940s, 50s, 60s, 70s (with the WHA), and came back to play one NHL game in 1980 at age 52, scoring a point.' },
      { question: 'Mark Messier\'s "guarantee" came before Game 6 of the 1994 conference finals. What did he guarantee?', options: ['A win', 'A hat trick', 'That the Rangers would win the series', 'A shutout from Mike Richter'], correctIndex: 0, explanation: 'Before Game 6 against New Jersey, facing elimination, Messier publicly guaranteed a Rangers win — then scored a hat trick in the third period to back it up.' },
    ],
  },
  // ─── 2026-03-24 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-24', league: 'NHL',
    mystery_player: { name: 'Mark Messier', team: 'Edmonton Oilers', position: 'C', height: "6'1\"", jerseyNumber: 11, conference: 'Western', country: 'Canada', age: 64, stats: { goals: 45, assists: 84, points: 129, plus_minus: 14 } },
    showdown_player_a: { name: 'Nikita Kucherov', team: 'Tampa Bay Lightning', stats: { pts: 118, hart_trophies: 2, stanley_cups: 2 }, statLabel: '2024-25 Season / Career' },
    showdown_player_b: { name: 'David Pastrnak', team: 'Boston Bruins', stats: { pts: 104, career_goals: 390, nhl_seasons: 11 }, statLabel: '2024-25 Season / Career' },
    showdown_category: 'BETTER EUROPEAN SUPERSTAR?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Kucherov has 2 Hart Trophies, 2 Stanley Cups, and his 2023-24 playoff performance (32 pts in 23 games) is historic — he edges Pastrnak at this stage.',
    blind_rank_players: [
      { name: 'Mark Messier', team: 'Edmonton Oilers', rankingStat: 6, statLabel: 'Stanley Cups' },
      { name: 'Henri Richard', team: 'Montreal Canadiens', rankingStat: 11, statLabel: 'Stanley Cups (all-time record)' },
      { name: 'Jean Beliveau', team: 'Montreal Canadiens', rankingStat: 10, statLabel: 'Stanley Cups' },
      { name: 'Yvan Cournoyer', team: 'Montreal Canadiens', rankingStat: 10, statLabel: 'Stanley Cups' },
      { name: 'Claude Provost', team: 'Montreal Canadiens', rankingStat: 9, statLabel: 'Stanley Cups' },
    ],
    blind_rank_category: 'RANK BY PURE SKILL',
    trivia_questions: [
      { question: 'Mark Messier captained which two different franchises to Stanley Cup championships?', options: ['Oilers and Rangers', 'Oilers and Canucks', 'Rangers and Bruins', 'Oilers and Bruins'], correctIndex: 0, explanation: 'Messier won 5 Cups as captain of the Edmonton Oilers (1990) and then captained the New York Rangers to their 1994 championship after a 54-year drought.' },
      { question: 'Nikita Kucherov\'s 128-point 2018-19 season won him the Hart Trophy. What was his plus/minus that year?', options: ['+18', '+27', '+35', '+41'], correctIndex: 2, explanation: 'Kucherov posted a remarkable +35 along with 128 points in 2018-19, winning the Hart Trophy and cementing his status as the league\'s best player that season.' },
      { question: 'David Pastrnak won the 2024 World Championship gold medal with which country?', options: ['Canada', 'Sweden', 'Czech Republic', 'Russia'], correctIndex: 2, explanation: 'Pastrnak is Czech and has represented the Czech Republic at multiple World Championships, winning gold in 2024.' },
    ],
  },
  // ─── 2026-03-25 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-25', league: 'NHL',
    mystery_player: { name: 'Nikita Kucherov', team: 'Tampa Bay Lightning', position: 'RW', height: "5'11\"", jerseyNumber: 86, conference: 'Eastern', country: 'Russia', age: 31, stats: { goals: 30, assists: 72, points: 102, plus_minus: 10 } },
    showdown_player_a: { name: 'Wayne Gretzky', team: 'Edmonton Oilers', stats: { career_pts: 2857, best_season_pts: 215, art_ross: 10 }, statLabel: 'Career / Best Season' },
    showdown_player_b: { name: 'Mario Lemieux', team: 'Pittsburgh Penguins', stats: { career_pts: 1723, pts_per_game: 1.88, conn_smythe: 2 }, statLabel: 'Career' },
    showdown_category: 'GRETZKY VS LEMIEUX: WHO WAS BETTER?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Gretzky wins every statistical argument — more points, more goals, more assists, more titles, and greater era-adjusted dominance over 20 seasons.',
    blind_rank_players: [
      { name: 'Nikita Kucherov', team: 'Tampa Bay Lightning', rankingStat: 2, statLabel: 'Hart Trophies' },
      { name: 'Connor McDavid', team: 'Edmonton Oilers', rankingStat: 4, statLabel: 'Hart Trophies' },
      { name: 'Nathan MacKinnon', team: 'Colorado Avalanche', rankingStat: 2, statLabel: 'Hart Trophies' },
      { name: 'Sidney Crosby', team: 'Pittsburgh Penguins', rankingStat: 2, statLabel: 'Hart Trophies' },
      { name: 'Leon Draisaitl', team: 'Edmonton Oilers', rankingStat: 1, statLabel: 'Hart Trophies' },
    ],
    blind_rank_category: 'WHO CHANGED THE GAME?',
    trivia_questions: [
      { question: 'Nikita Kucherov played through a serious injury and did not appear in the 2021 regular season, yet was eligible for the playoffs. What happened?', options: ['He was on LTIR (long-term injury reserve), freeing salary cap space', 'He was suspended for the regular season', 'He played only in European leagues', 'He recovered and was activated in February'], correctIndex: 0, explanation: 'Kucherov spent the entire 2020-21 regular season on LTIR with a hip injury, freeing the Lightning cap space — then returned for the playoffs and won the Conn Smythe.' },
      { question: 'Wayne Gretzky scored 92 goals in a single season. What year was this?', options: ['1980-81', '1981-82', '1982-83', '1983-84'], correctIndex: 1, explanation: 'Gretzky scored a record 92 goals in the 1981-82 season — a record that has never been approached, with most experts believing it will never be broken.' },
      { question: 'Mario Lemieux set a career-high with 199 points in which NHL season?', options: ['1984-85', '1985-86', '1987-88', '1988-89'], correctIndex: 3, explanation: 'Lemieux scored 85 goals and 114 assists for 199 points in 1988-89 — the second-highest single-season point total in NHL history behind Gretzky\'s 215.' },
    ],
  },
  // ─── 2026-03-26 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-26', league: 'NHL',
    mystery_player: { name: 'Brett Hull', team: 'St. Louis Blues', position: 'RW', height: "5'10\"", jerseyNumber: 16, conference: 'Western', country: 'Canada', age: 60, stats: { goals: 86, assists: 45, points: 131, plus_minus: 23 } },
    showdown_player_a: { name: 'Connor McDavid', team: 'Edmonton Oilers', stats: { g: 52, a: 88, pts: 140, speed_mph: 25.4 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Leon Draisaitl', team: 'Edmonton Oilers', stats: { g: 52, a: 72, pts: 124, career_goals: 380 }, statLabel: '2024-25 Season / Career' },
    showdown_category: 'BETTER OILER IN 2024-25?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'McDavid leads in both points (140 vs 124) and assists — and his Hart Trophy pedigree and skating ability keep him a clear step above his teammate.',
    blind_rank_players: [
      { name: 'Brett Hull', team: 'St. Louis Blues', rankingStat: 741, statLabel: 'Career Goals' },
      { name: 'Marcel Dionne', team: 'Los Angeles Kings', rankingStat: 731, statLabel: 'Career Goals' },
      { name: 'Phil Esposito', team: 'Boston Bruins', rankingStat: 717, statLabel: 'Career Goals' },
      { name: 'Mike Gartner', team: 'Washington Capitals', rankingStat: 708, statLabel: 'Career Goals' },
      { name: 'Mark Messier', team: 'Edmonton Oilers', rankingStat: 694, statLabel: 'Career Goals' },
    ],
    blind_rank_category: 'RANK BY LEGACY',
    trivia_questions: [
      { question: 'Brett Hull\'s Stanley Cup-winning goal in 1999 was controversial. Why?', options: ['He was offside', 'He was in the crease, violating the rules at the time', 'He used an illegal stick', 'Time had expired'], correctIndex: 1, explanation: 'Hull\'s foot was in the crease when he scored the Cup-winning goal, which normally would have been disallowed — the NHL ruled he had possession and control of the puck, letting it stand.' },
      { question: 'Brett Hull\'s father Bobby Hull was also a prolific goal scorer. What was Bobby\'s nickname?', options: ['The Black Hawk', 'The Golden Jet', 'The Rocket', 'The Blonde Bullet'], correctIndex: 1, explanation: 'Bobby Hull was known as "The Golden Jet" for his blonde hair, blazing speed, and powerful slapshot that revolutionized goal scoring in the 1960s.' },
      { question: 'Brett Hull scored 86 goals in a single season (1990-91). Who held the record he was chasing?', options: ['Phil Esposito (76)', 'Jari Kurri (71)', 'Marcel Dionne (72)', 'Wayne Gretzky (92)'], correctIndex: 3, explanation: 'Hull\'s 86 goals in 1990-91 is the 2nd most in a single season — only Gretzky\'s 92 in 1981-82 tops it.' },
    ],
  },
  // ─── 2026-03-27 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-27', league: 'NHL',
    mystery_player: { name: 'Cale Makar', team: 'Colorado Avalanche', position: 'D', height: "5'11\"", jerseyNumber: 8, conference: 'Western', country: 'Canada', age: 26, stats: { goals: 20, assists: 58, points: 78, plus_minus: 16 } },
    showdown_player_a: { name: 'Jaromir Jagr', team: 'Pittsburgh Penguins', stats: { career_pts: 1921, career_goals: 766, nhl_seasons: 24 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Steve Yzerman', team: 'Detroit Red Wings', stats: { career_pts: 1755, career_goals: 692, stanley_cups: 3 }, statLabel: 'Career' },
    showdown_category: 'GREATER FRANCHISE ICON?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Yzerman captained Detroit to 3 Stanley Cups with pure leadership and two-way excellence — his legacy as a franchise cornerstone surpasses Jagr\'s individual brilliance.',
    blind_rank_players: [
      { name: 'Cale Makar', team: 'Colorado Avalanche', rankingStat: 96, statLabel: 'Points (2024-25, defenseman)' },
      { name: 'Quinn Hughes', team: 'Vancouver Canucks', rankingStat: 94, statLabel: 'Points (2024-25, defenseman)' },
      { name: 'Bobby Orr', team: 'Boston Bruins', rankingStat: 102, statLabel: 'Points (1970-71, best D season ever)' },
      { name: 'Paul Coffey', team: 'Edmonton Oilers', rankingStat: 138, statLabel: 'Points (1985-86, 2nd most by a D)' },
      { name: 'Al MacInnis', team: 'St. Louis Blues', rankingStat: 75, statLabel: 'Points (1993-94)' },
    ],
    blind_rank_category: 'WHO WOULD YOU BUILD A TEAM AROUND?',
    trivia_questions: [
      { question: 'Cale Makar won the Calder Trophy as best rookie in which season?', options: ['2018-19', '2019-20', '2020-21', '2021-22'], correctIndex: 1, explanation: 'Makar won the Calder Trophy in 2019-20, then followed it up with a Norris Trophy two seasons later as Colorado\'s championship run began.' },
      { question: 'Jaromir Jagr wore #68 as a tribute to what historical event?', options: ['His birth year', 'The 1968 Prague Spring Soviet invasion of Czechoslovakia', 'His points total in junior hockey', 'His father\'s jersey number'], correctIndex: 1, explanation: 'Jagr wore #68 to honor the year of the Soviet invasion of Czechoslovakia — a silent protest against communist rule that defined his identity as a player.' },
      { question: 'Steve Yzerman won his first Stanley Cup in which year, ending a long drought for Detroit?', options: ['1994', '1996', '1997', '1998'], correctIndex: 2, explanation: 'Yzerman and the Red Wings won the Cup in 1997, ending a 42-year championship drought in Detroit — Yzerman was named Conn Smythe MVP.' },
    ],
  },
  // ─── 2026-03-28 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-28', league: 'NHL',
    mystery_player: { name: 'Steve Yzerman', team: 'Detroit Red Wings', position: 'C', height: "5'11\"", jerseyNumber: 19, conference: 'Eastern', country: 'Canada', age: 60, stats: { goals: 65, assists: 90, points: 155, plus_minus: 57 } },
    showdown_player_a: { name: 'Patrick Roy', team: 'Colorado Avalanche', stats: { career_wins: 551, conn_smythe: 3, career_sv_pct: .910 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Martin Brodeur', team: 'New Jersey Devils', stats: { career_wins: 691, shutouts: 125, career_gaa: 2.24 }, statLabel: 'Career' },
    showdown_category: 'BETTER GOALIE STATISTICALLY?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Brodeur owns every major goalie record — 691 wins, 125 shutouts, and 2.24 career GAA — making him the most accomplished netminder by the numbers.',
    blind_rank_players: [
      { name: 'Steve Yzerman', team: 'Detroit Red Wings', rankingStat: 692, statLabel: 'Career Goals' },
      { name: 'Brett Hull', team: 'St. Louis Blues', rankingStat: 741, statLabel: 'Career Goals' },
      { name: 'Marcel Dionne', team: 'Los Angeles Kings', rankingStat: 731, statLabel: 'Career Goals' },
      { name: 'Gordie Howe', team: 'Detroit Red Wings', rankingStat: 801, statLabel: 'Career Goals (NHL only)' },
      { name: 'Mike Gartner', team: 'Washington Capitals', rankingStat: 708, statLabel: 'Career Goals' },
    ],
    blind_rank_category: 'RANK BY CLUTCH FACTOR',
    trivia_questions: [
      { question: 'Steve Yzerman served as the general manager of which team before returning to run the Detroit Red Wings?', options: ['Tampa Bay Lightning', 'Columbus Blue Jackets', 'Florida Panthers', 'Ottawa Senators'], correctIndex: 0, explanation: 'Yzerman built the Tampa Bay Lightning roster as GM from 2010-2019, winning the Cup there in 2020 and 2021 after returning to Detroit as GM.' },
      { question: 'Patrick Roy won the Conn Smythe Trophy how many times — more than any other player?', options: ['2', '3', '4', '5'], correctIndex: 1, explanation: 'Roy won 3 Conn Smythe trophies (1986, 1993 with Montreal and 2001 with Colorado) — the only player to win it with two different franchises.' },
      { question: 'Martin Brodeur\'s 691 career wins — how many more wins does he have than the second-place goalie (Patrick Roy)?', options: ['100', '120', '140', '160'], correctIndex: 2, explanation: 'Brodeur has 691 wins to Roy\'s 551 — a gap of 140 wins that makes his record one of the most dominant in team sports.' },
    ],
  },
  // ─── 2026-03-29 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-29', league: 'NHL',
    mystery_player: { name: 'David Pastrnak', team: 'Boston Bruins', position: 'RW', height: "6'0\"", jerseyNumber: 88, conference: 'Eastern', country: 'Czech Republic', age: 28, stats: { goals: 33, assists: 45, points: 78, plus_minus: 8 } },
    showdown_player_a: { name: 'Sidney Crosby', team: 'Pittsburgh Penguins', stats: { career_pts: 1960, career_goals: 620, stanley_cups: 3 }, statLabel: 'Career thru 2024-25' },
    showdown_player_b: { name: 'Alex Ovechkin', team: 'Washington Capitals', stats: { career_goals: 900, rocket_richard: 9, stanley_cups: 1 }, statLabel: 'Career thru 2024-25' },
    showdown_category: 'CROSBY OR OVI: WHO IS THE GREATER PLAYER?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Crosby\'s 3 Stanley Cups, superior two-way play, and all-around skill make him the consensus choice as the better complete player of their generation.',
    blind_rank_players: [
      { name: 'David Pastrnak', team: 'Boston Bruins', rankingStat: 46, statLabel: 'Goals (2024-25)' },
      { name: 'Auston Matthews', team: 'Toronto Maple Leafs', rankingStat: 47, statLabel: 'Goals (2024-25)' },
      { name: 'Leon Draisaitl', team: 'Edmonton Oilers', rankingStat: 52, statLabel: 'Goals (2024-25)' },
      { name: 'Connor McDavid', team: 'Edmonton Oilers', rankingStat: 52, statLabel: 'Goals (2024-25)' },
      { name: 'Alex Ovechkin', team: 'Washington Capitals', rankingStat: 38, statLabel: 'Goals (2024-25)' },
    ],
    blind_rank_category: 'RANK BY OVERALL GREATNESS',
    trivia_questions: [
      { question: 'David Pastrnak\'s nickname is "Pasta." He wears #88 as a tribute to which legend?', options: ['Eric Lindros', 'Eric Kariya', 'Jaromir Jagr', 'Peter Forsberg'], correctIndex: 2, explanation: 'Pastrnak wore #88 in honor of Jaromir Jagr, who famously wore #68 — Pastrnak flipped it to 88 as a nod to his Czech hockey idol.' },
      { question: 'Sidney Crosby won his first Olympic gold medal with Team Canada in which year?', options: ['2006', '2010', '2014', '2018'], correctIndex: 1, explanation: 'Crosby scored the overtime gold medal goal against the USA at the 2010 Vancouver Olympics — the most watched hockey game in Canadian history.' },
      { question: 'Alex Ovechkin has played his entire NHL career with one franchise. How many teams has he played for?', options: ['1', '2', '3', 'He played in Russia briefly'], correctIndex: 0, explanation: 'Ovechkin has played every NHL game of his career with the Washington Capitals since being drafted #1 overall in 2004 — one of the most loyal franchise players in league history.' },
    ],
  },
  // ─── 2026-03-30 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-30', league: 'NHL',
    mystery_player: { name: 'Gordie Howe', team: 'Detroit Red Wings', position: 'RW', height: "6'0\"", jerseyNumber: 9, conference: 'Eastern', country: 'Canada', age: 96, stats: { goals: 49, assists: 46, points: 95, plus_minus: 0 } },
    showdown_player_a: { name: 'Cale Makar', team: 'Colorado Avalanche', stats: { g: 28, a: 68, pts: 96, plus_minus: 22 }, statLabel: '2024-25 Season' },
    showdown_player_b: { name: 'Quinn Hughes', team: 'Vancouver Canucks', stats: { g: 22, a: 72, pts: 94, norris_trophies: 1 }, statLabel: '2024-25 Season / Career' },
    showdown_category: 'MAKAR VS HUGHES: BETTER DEFENSEMAN?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Makar\'s 2 Norris Trophies, Conn Smythe, and Stanley Cup ring give him the definitive edge over Hughes as the best defenseman of this generation.',
    blind_rank_players: [
      { name: 'Gordie Howe', team: 'Detroit Red Wings', rankingStat: 801, statLabel: 'Career Goals (NHL only)' },
      { name: 'Wayne Gretzky', team: 'Edmonton Oilers', rankingStat: 894, statLabel: 'Career Goals' },
      { name: 'Alex Ovechkin', team: 'Washington Capitals', rankingStat: 900, statLabel: 'Career Goals (thru 2024-25)' },
      { name: 'Brett Hull', team: 'St. Louis Blues', rankingStat: 741, statLabel: 'Career Goals' },
      { name: 'Marcel Dionne', team: 'Los Angeles Kings', rankingStat: 731, statLabel: 'Career Goals' },
    ],
    blind_rank_category: 'WHO WAS THE MOST DOMINANT PLAYER?',
    trivia_questions: [
      { question: 'Gordie Howe scored a goal in NHL games in 5 different decades. What decades were these?', options: ['1940s through 1980s', '1940s through 1970s (NHL only)', '1950s through 1980s', '1940s through 1970s'], correctIndex: 0, explanation: 'Howe scored in the 1940s, 50s, 60s, and 70s in the NHL, plus the WHA in the 1970s, and came back for one NHL game in 1979-80 at age 52.' },
      { question: 'Quinn Hughes won the Norris Trophy in which season?', options: ['2021-22', '2022-23', '2023-24', '2024-25'], correctIndex: 2, explanation: 'Hughes won the Norris Trophy in 2023-24, when he set a franchise record for points by a Canucks defenseman and led Vancouver to the Pacific Division title.' },
      { question: 'The term "Gordie Howe Hat Trick" means scoring a goal, an assist, AND doing what in one game?', options: ['Winning a fight', 'Scoring a short-handed goal', 'Getting a penalty shot', 'Drawing a penalty in overtime'], correctIndex: 0, explanation: 'A "Gordie Howe Hat Trick" means a player scores a goal, records an assist, and gets into a fight all in the same game — reflecting the physical, skilled style Howe embodied.' },
    ],
  },
  // ─── 2026-03-31 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-31', league: 'NHL',
    mystery_player: { name: 'Quinn Hughes', team: 'Vancouver Canucks', position: 'D', height: "5'10\"", jerseyNumber: 43, conference: 'Western', country: 'USA', age: 25, stats: { goals: 15, assists: 55, points: 70, plus_minus: 10 } },
    showdown_player_a: { name: 'Wayne Gretzky', team: 'Edmonton Oilers', stats: { best_season_pts: 215, season_assists: 163, career_pts: 2857 }, statLabel: 'Career / Best Season' },
    showdown_player_b: { name: 'Bobby Orr', team: 'Boston Bruins', stats: { pts_as_defenseman: 915, plus_minus_record: 124, norris_trophies: 8 }, statLabel: 'Career' },
    showdown_category: 'MOST DOMINANT PLAYER RELATIVE TO POSITION?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Orr redefined what a defenseman could be — the only defenseman to lead the NHL in scoring, win multiple Hart and Norris Trophies, and transform the role of his position forever.',
    blind_rank_players: [
      { name: 'Quinn Hughes', team: 'Vancouver Canucks', rankingStat: 94, statLabel: 'Points (2024-25, defenseman)' },
      { name: 'Cale Makar', team: 'Colorado Avalanche', rankingStat: 96, statLabel: 'Points (2024-25, defenseman)' },
      { name: 'Roman Josi', team: 'Nashville Predators', rankingStat: 72, statLabel: 'Points (2024-25)' },
      { name: 'Brent Burns', team: 'San Jose Sharks', rankingStat: 83, statLabel: 'Points (best season, 2016-17)' },
      { name: 'Erik Karlsson', team: 'Pittsburgh Penguins', rankingStat: 100, statLabel: 'Points (best season, 2022-23)' },
    ],
    blind_rank_category: 'RANK BY PURE SKILL',
    trivia_questions: [
      { question: 'Quinn Hughes is the brother of which other current NHL defenseman?', options: ['Owen Hughes', 'Jack Hughes (forward) and Luke Hughes (defenseman)', 'Luke Hughes only', 'Jack Hughes only'], correctIndex: 1, explanation: 'Quinn\'s brothers Jack (NJ Devils, center) and Luke (NJ Devils, defenseman) are all in the NHL — the most accomplished sibling group in modern hockey history.' },
      { question: 'Wayne Gretzky\'s single-season record of 215 points came in which year?', options: ['1981-82', '1983-84', '1984-85', '1985-86'], correctIndex: 3, explanation: 'Gretzky scored 52 goals and 163 assists for 215 points in 1985-86 — the all-time single-season points record that has never been approached.' },
      { question: 'Bobby Orr\'s single-season plus/minus record of +124 was set in which year and has never been broken?', options: ['1969-70', '1970-71', '1971-72', '1972-73'], correctIndex: 1, explanation: 'Orr posted a +124 plus/minus in 1970-71 — the greatest single-season differential ever recorded, a record that still stands over 50 years later.' },
    ],
  },
  // ─── 2026-04-01 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-01', league: 'NHL',
    mystery_player: { name: 'Martin Brodeur', team: 'New Jersey Devils', position: 'G', height: "6'2\"", jerseyNumber: 30, conference: 'Eastern', country: 'Canada', age: 52, stats: { wins: 41, gaa: 2.02, save_pct: .914, shutouts: 9 } },
    showdown_player_a: { name: 'Connor McDavid', team: 'Edmonton Oilers', stats: { pts: 140, stanley_cups: 1, hart_trophies: 4 }, statLabel: '2024-25 Season / Career' },
    showdown_player_b: { name: 'Sidney Crosby', team: 'Pittsburgh Penguins', stats: { career_pts: 1960, stanley_cups: 3, olympic_gold: 2 }, statLabel: 'Career thru 2024-25' },
    showdown_category: 'McDaVID VS CROSBY: WHO WILL HAVE THE BETTER CAREER?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'McDavid is on pace to break Gretzky\'s scoring records if healthy — his 1.74 pts/game rate surpasses even Crosby\'s pace at comparable ages.',
    blind_rank_players: [
      { name: 'Martin Brodeur', team: 'New Jersey Devils', rankingStat: 691, statLabel: 'Career Wins (all-time record)' },
      { name: 'Patrick Roy', team: 'Colorado Avalanche', rankingStat: 551, statLabel: 'Career Wins' },
      { name: 'Ed Belfour', team: 'Dallas Stars', rankingStat: 484, statLabel: 'Career Wins' },
      { name: 'Curtis Joseph', team: 'Edmonton Oilers', rankingStat: 454, statLabel: 'Career Wins' },
      { name: 'Henrik Lundqvist', team: 'New York Rangers', rankingStat: 459, statLabel: 'Career Wins' },
    ],
    blind_rank_category: 'WHO CHANGED THE GAME?',
    trivia_questions: [
      { question: 'Martin Brodeur holds the record for most career goals scored by an NHL goalie. How many did he score in total (regular season + playoffs)?', options: ['1', '2', '3', '4'], correctIndex: 2, explanation: 'Brodeur scored 3 career goals total — 2 in the regular season and 1 in the playoffs — making him the highest-scoring goalie in NHL history.' },
      { question: 'Sidney Crosby was selected #1 overall in the "Sidney Crosby Sweepstakes" draft lottery of which year?', options: ['2003', '2004', '2005', '2006'], correctIndex: 2, explanation: 'Crosby was drafted #1 overall in 2005 after the entire 2004-05 season was cancelled due to the lockout — Pittsburgh won the lottery and selected him.' },
      { question: 'Connor McDavid has won the Hart Trophy as NHL MVP how many times through 2024-25?', options: ['3', '4', '5', '6'], correctIndex: 1, explanation: 'McDavid has won 4 Hart Trophies through 2024-25, making him the most decorated MVP winner of his era.' },
    ],
  },
  // ─── 2026-04-02 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-02', league: 'NHL',
    mystery_player: { name: 'Patrick Roy', team: 'Colorado Avalanche', position: 'G', height: "6'2\"", jerseyNumber: 33, conference: 'Western', country: 'Canada', age: 59, stats: { wins: 37, gaa: 2.50, save_pct: .920, shutouts: 7 } },
    showdown_player_a: { name: 'Nathan MacKinnon', team: 'Colorado Avalanche', stats: { pts: 132, hart_trophies: 2, stanley_cups: 1 }, statLabel: '2024-25 Season / Career' },
    showdown_player_b: { name: 'Nikita Kucherov', team: 'Tampa Bay Lightning', stats: { pts: 118, hart_trophies: 2, stanley_cups: 2 }, statLabel: '2024-25 Season / Career' },
    showdown_category: 'MORE VALUABLE TO THEIR FRANCHISE?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'MacKinnon is the face of the Avalanche dynasty — his 132 points in 2024-25 anchor Colorado just as Kucherov anchors Tampa, but MacKinnon edges him in pure offensive output.',
    blind_rank_players: [
      { name: 'Patrick Roy', team: 'Colorado Avalanche', rankingStat: 3, statLabel: 'Conn Smythe Trophies (most ever)' },
      { name: 'Mario Lemieux', team: 'Pittsburgh Penguins', rankingStat: 2, statLabel: 'Conn Smythe Trophies' },
      { name: 'Sidney Crosby', team: 'Pittsburgh Penguins', rankingStat: 2, statLabel: 'Conn Smythe Trophies' },
      { name: 'Bobby Orr', team: 'Boston Bruins', rankingStat: 2, statLabel: 'Conn Smythe Trophies' },
      { name: 'Connor McDavid', team: 'Edmonton Oilers', rankingStat: 1, statLabel: 'Conn Smythe Trophies' },
    ],
    blind_rank_category: 'RANK BY LEGACY',
    trivia_questions: [
      { question: 'Patrick Roy popularized which goaltending style that is now standard?', options: ['Stand-up style', 'Butterfly style', 'Hybrid style', 'Aggressive angle-cutting style'], correctIndex: 1, explanation: 'Roy popularized the butterfly style — dropping to both knees to cover the lower portion of the net — which is now taught to virtually every goaltender in modern hockey.' },
      { question: 'Nathan MacKinnon has been a finalist for the Hart Trophy how many times (through 2024-25)?', options: ['4', '5', '6', '7'], correctIndex: 2, explanation: 'MacKinnon has been named a Hart Trophy finalist 6 times through 2024-25, with 2 wins (2023, 2024) and 4 runner-up finishes.' },
      { question: 'Nikita Kucherov was the only player to score 100+ points in the 2018-19 season. Who was runner-up?', options: ['Connor McDavid', 'Patrick Kane', 'Nathan MacKinnon', 'Leon Draisaitl'], correctIndex: 0, explanation: 'McDavid finished second with 116 points to Kucherov\'s 128 in 2018-19 — one of the few seasons where someone other than McDavid led the league in scoring.' },
    ],
  },
  // ─── 2026-04-03 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-03', league: 'NHL',
    mystery_player: { name: 'Jaromir Jagr', team: 'Pittsburgh Penguins', position: 'RW', height: "6'3\"", jerseyNumber: 68, conference: 'Eastern', country: 'Czech Republic', age: 53, stats: { goals: 62, assists: 87, points: 149, plus_minus: 31 } },
    showdown_player_a: { name: 'Gordie Howe', team: 'Detroit Red Wings', stats: { career_goals: 801, seasons: 26, nickname: 'Mr. Hockey' }, statLabel: 'Career' },
    showdown_player_b: { name: 'Bobby Orr', team: 'Boston Bruins', stats: { career_pts: 915, norris: 8, revolutionized_position: true }, statLabel: 'Career' },
    showdown_category: 'GREATER ALL-TIME LEGEND: HOWE OR ORR?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Orr transformed the game of hockey more profoundly than any other player — no other individual changed what a position could be as dramatically as Orr changed the role of defenseman.',
    blind_rank_players: [
      { name: 'Jaromir Jagr', team: 'Pittsburgh Penguins', rankingStat: 766, statLabel: 'Career Goals (2nd among European-born)' },
      { name: 'Steve Yzerman', team: 'Detroit Red Wings', rankingStat: 692, statLabel: 'Career Goals' },
      { name: 'Mark Messier', team: 'Edmonton Oilers', rankingStat: 694, statLabel: 'Career Goals' },
      { name: 'Wayne Gretzky', team: 'Edmonton Oilers', rankingStat: 894, statLabel: 'Career Goals' },
      { name: 'Alex Ovechkin', team: 'Washington Capitals', rankingStat: 900, statLabel: 'Career Goals' },
    ],
    blind_rank_category: 'WHO WOULD YOU BUILD A TEAM AROUND?',
    trivia_questions: [
      { question: 'Jaromir Jagr played his final NHL season at age 45. What year was this?', options: ['2015-16', '2016-17', '2017-18', '2018-19'], correctIndex: 2, explanation: 'Jagr played for the New Jersey Devils in 2017-18 at age 45 — making him one of the oldest players to appear in an NHL regular season game.' },
      { question: 'Gordie Howe\'s four children — were any of them also professional hockey players?', options: ['No', 'Yes, Mark and Marty played with him in the WHA', 'Yes, one son played in the NHL', 'Yes, all four played professionally'], correctIndex: 1, explanation: 'Howe played alongside his sons Mark and Marty on the Houston Aeros and Hartford Whalers in the WHA — one of the most unique family achievements in sports history.' },
      { question: 'Bobby Orr won the Hart Trophy (NHL MVP) how many times?', options: ['2', '3', '4', '5'], correctIndex: 1, explanation: 'Orr won 3 Hart Trophies (1970, 1971, 1972) — a remarkable achievement for a defenseman, as the award almost always goes to high-scoring forwards.' },
    ],
  },
  // ─── 2026-04-04 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-04', league: 'NHL',
    mystery_player: { name: 'Connor McDavid', team: 'Edmonton Oilers', position: 'C', height: "6'1\"", jerseyNumber: 97, conference: 'Western', country: 'Canada', age: 28, stats: { goals: 52, assists: 88, points: 140, plus_minus: 30 } },
    showdown_player_a: { name: 'Alex Ovechkin', team: 'Washington Capitals', stats: { career_goals: 900, consecutive_scoring_seasons: 20 }, statLabel: 'Career thru 2024-25' },
    showdown_player_b: { name: 'Brett Hull', team: 'St. Louis Blues', stats: { career_goals: 741, goals_in_3_seasons: 228 }, statLabel: 'Career / Peak 1989-92' },
    showdown_category: 'GREATER PURE GOAL SCORER: OVI OR HULL?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Ovechkin\'s 900+ goals with 9 Rocket Richard Trophies represent a sustained excellence that Hull\'s peak (86 goals in one season) cannot match over a full career.',
    blind_rank_players: [
      { name: 'Connor McDavid', team: 'Edmonton Oilers', rankingStat: 1050, statLabel: 'Career Points (thru 2024-25)' },
      { name: 'Sidney Crosby', team: 'Pittsburgh Penguins', rankingStat: 1960, statLabel: 'Career Points (thru 2024-25)' },
      { name: 'Alex Ovechkin', team: 'Washington Capitals', rankingStat: 1400, statLabel: 'Career Points (thru 2024-25)' },
      { name: 'Nathan MacKinnon', team: 'Colorado Avalanche', rankingStat: 950, statLabel: 'Career Points (thru 2024-25)' },
      { name: 'Nikita Kucherov', team: 'Tampa Bay Lightning', rankingStat: 900, statLabel: 'Career Points (thru 2024-25)' },
    ],
    blind_rank_category: 'RANK BY CLUTCH FACTOR',
    trivia_questions: [
      { question: 'Connor McDavid won the 2024 Stanley Cup Conn Smythe despite his team ultimately winning. True — and what was his playoff point total?', options: ['34 pts in 25 games', '38 pts in 25 games', '42 pts in 22 games', '29 pts in 25 games'], correctIndex: 1, explanation: 'McDavid had 38 points (14G, 24A) in 25 playoff games in 2024, winning the Conn Smythe as the Oilers won the Stanley Cup.' },
      { question: 'Alex Ovechkin grew up idolizing which NHL player and modeled his power-play goal scoring after them?', options: ['Brendan Shanahan', 'Pavel Bure', 'Steve Yzerman', 'Sergei Fedorov'], correctIndex: 1, explanation: 'Ovechkin grew up idolizing Pavel Bure and modeled much of his speed and goal-scoring mentality after "The Russian Rocket."' },
      { question: 'Brett Hull\'s 86-goal season in 1990-91 — how many of those goals came on the power play?', options: ['29', '31', '37', '41'], correctIndex: 2, explanation: 'Hull scored 37 power-play goals in 1990-91 — a single-season record at the time that demonstrated how devastating he was on the man advantage.' },
    ],
  },
  // ─── 2026-04-05 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-05', league: 'NHL',
    mystery_player: { name: 'Wayne Gretzky', team: 'Los Angeles Kings', position: 'C', height: "6'0\"", jerseyNumber: 99, conference: 'Western', country: 'Canada', age: 64, stats: { goals: 52, assists: 163, points: 215, plus_minus: 71 } },
    showdown_player_a: { name: 'Cale Makar', team: 'Colorado Avalanche', stats: { g: 28, pts: 96, norris: 2, stanley_cup: 1 }, statLabel: '2024-25 Season / Career' },
    showdown_player_b: { name: 'Quinn Hughes', team: 'Vancouver Canucks', stats: { g: 22, pts: 94, norris: 1, assists: 72 }, statLabel: '2024-25 Season / Career' },
    showdown_category: 'WHO WILL HAVE THE BETTER CAREER?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Makar has already won a Stanley Cup, 2 Norris Trophies, and a Conn Smythe — Hughes is elite but Makar\'s trajectory and hardware give him the edge.',
    blind_rank_players: [
      { name: 'Wayne Gretzky', team: 'Edmonton Oilers', rankingStat: 10, statLabel: 'Art Ross Trophies (scoring titles)' },
      { name: 'Gordie Howe', team: 'Detroit Red Wings', rankingStat: 6, statLabel: 'Art Ross Trophies' },
      { name: 'Mario Lemieux', team: 'Pittsburgh Penguins', rankingStat: 6, statLabel: 'Art Ross Trophies' },
      { name: 'Phil Esposito', team: 'Boston Bruins', rankingStat: 5, statLabel: 'Art Ross Trophies' },
      { name: 'Connor McDavid', team: 'Edmonton Oilers', rankingStat: 6, statLabel: 'Art Ross Trophies (thru 2024-25)' },
    ],
    blind_rank_category: 'RANK BY OVERALL GREATNESS',
    trivia_questions: [
      { question: 'Wayne Gretzky holds the record for most assists in a single season (163). Who holds the record for most goals in a game?', options: ['Joe Malone (7 goals)', 'Wayne Gretzky (7 goals)', 'Cy Denneny (6 goals)', 'Newsy Lalonde (6 goals)'], correctIndex: 0, explanation: 'Joe Malone scored 7 goals in a single game on January 31, 1920 for the Quebec Bulldogs — a record that has stood for over 100 years.' },
      { question: 'Cale Makar won the Conn Smythe Trophy in which year when Colorado won the Stanley Cup?', options: ['2020', '2021', '2022', '2023'], correctIndex: 2, explanation: 'Makar won the Conn Smythe in 2022, when he led all skaters with 29 points in 20 playoff games as the Avalanche swept their way to the championship.' },
      { question: 'Quinn Hughes is the highest-scoring American-born defenseman in NHL history as of 2025. True or False?', options: ['True', 'False'], correctIndex: 0, explanation: 'Hughes surpassed Brian Leetch\'s record for career points by an American-born defenseman during the 2024-25 season, cementing his place in US hockey history.' },
    ],
  },
  // ─── 2026-04-06 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-06', league: 'NHL',
    mystery_player: { name: 'Nathan MacKinnon', team: 'Colorado Avalanche', position: 'C', height: "6'0\"", jerseyNumber: 29, conference: 'Western', country: 'Canada', age: 29, stats: { goals: 40, assists: 75, points: 115, plus_minus: 18 } },
    showdown_player_a: { name: 'Martin Brodeur', team: 'New Jersey Devils', stats: { career_wins: 691, career_gaa: 2.24, shutouts: 125 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Patrick Roy', team: 'Montreal Canadiens', stats: { career_wins: 551, conn_smythe: 3, clutch_record: 'legendary' }, statLabel: 'Career' },
    showdown_category: 'WHO WAS THE BETTER BIG-GAME GOALIE?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Roy\'s 3 Conn Smythe awards and 4 Stanley Cups — including his legendary performance as a 19-year-old rookie in 1986 — define playoff clutch goaltending.',
    blind_rank_players: [
      { name: 'Nathan MacKinnon', team: 'Colorado Avalanche', rankingStat: 2, statLabel: 'Hart Trophies' },
      { name: 'Wayne Gretzky', team: 'Edmonton Oilers', rankingStat: 9, statLabel: 'Hart Trophies (all-time)' },
      { name: 'Gordie Howe', team: 'Detroit Red Wings', rankingStat: 6, statLabel: 'Hart Trophies' },
      { name: 'Mario Lemieux', team: 'Pittsburgh Penguins', rankingStat: 3, statLabel: 'Hart Trophies' },
      { name: 'Bobby Orr', team: 'Boston Bruins', rankingStat: 3, statLabel: 'Hart Trophies' },
    ],
    blind_rank_category: 'WHO WAS THE MOST DOMINANT PLAYER?',
    trivia_questions: [
      { question: 'Nathan MacKinnon was teammates with Sidney Crosby on what junior team that dominated the QMJHL?', options: ['Quebec Remparts', 'Halifax Mooseheads', 'Cape Breton Screaming Eagles', 'Rimouski Oceanic'], correctIndex: 1, explanation: 'MacKinnon and Jonathan Drouin played for the Halifax Mooseheads and won the Memorial Cup in 2013 — MacKinnon won the tournament MVP.' },
      { question: 'Patrick Roy\'s nickname "Saint Patrick" was earned after which legendary performance?', options: ['His 1986 rookie Cup run', 'A shutout in Game 7 against Detroit', 'His 1993 Cup run with 10 overtime wins', 'Both his 1986 and 1993 Cup runs'], correctIndex: 3, explanation: 'Roy earned "Saint Patrick" through multiple legendary runs — winning the Cup as a 19-year-old in 1986 and again in 1993 when he won 10 overtime games.' },
      { question: 'Martin Brodeur played how many career NHL regular season games — the record for a goaltender?', options: ['1,200', '1,259', '1,266', '1,291'], correctIndex: 2, explanation: 'Brodeur played 1,266 career regular season games — the most of any goaltender in NHL history.' },
    ],
  },
  // ─── 2026-04-07 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-07', league: 'NHL',
    mystery_player: { name: 'Alex Ovechkin', team: 'Washington Capitals', position: 'LW', height: "6'3\"", jerseyNumber: 8, conference: 'Eastern', country: 'Russia', age: 39, stats: { goals: 31, assists: 25, points: 56, plus_minus: -2 } },
    showdown_player_a: { name: 'Leon Draisaitl', team: 'Edmonton Oilers', stats: { g: 52, pts: 124, career_goals: 380 }, statLabel: '2024-25 Season / Career' },
    showdown_player_b: { name: 'Auston Matthews', team: 'Toronto Maple Leafs', stats: { g: 47, pts: 98, career_goals: 340 }, statLabel: '2024-25 Season / Career' },
    showdown_category: 'BETTER PURE GOAL SCORER: DRAISAITL OR MATTHEWS?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Matthews has 4 Rocket Richard Trophies as the NHL\'s top goal scorer and holds the Maple Leafs single-season record — he is the more prolific pure finisher.',
    blind_rank_players: [
      { name: 'Alex Ovechkin', team: 'Washington Capitals', rankingStat: 900, statLabel: 'Career Goals (thru 2024-25)' },
      { name: 'Wayne Gretzky', team: 'Edmonton Oilers', rankingStat: 894, statLabel: 'Career Goals (former record)' },
      { name: 'Gordie Howe', team: 'Detroit Red Wings', rankingStat: 801, statLabel: 'Career Goals (NHL)' },
      { name: 'Jaromir Jagr', team: 'Pittsburgh Penguins', rankingStat: 766, statLabel: 'Career Goals' },
      { name: 'Brett Hull', team: 'St. Louis Blues', rankingStat: 741, statLabel: 'Career Goals' },
    ],
    blind_rank_category: 'RANK BY PURE SKILL',
    trivia_questions: [
      { question: 'Alex Ovechkin scored his record-breaking goal #895 against which team?', options: ['Pittsburgh Penguins', 'New York Rangers', 'Toronto Maple Leafs', 'Boston Bruins'], correctIndex: 0, explanation: 'Ovechkin broke the record against the Pittsburgh Penguins — his greatest rival — making the moment even more dramatic for Capitals and Penguins fans alike.' },
      { question: 'Auston Matthews scored 69 goals in the 2023-24 season. How many regular season goals is this?', options: ['67', '68', '69', '70'], correctIndex: 2, explanation: 'Matthews scored exactly 69 goals in 2023-24, the most by any player since Brett Hull scored 72 in 1990-91 and the most by a Maple Leaf in franchise history.' },
      { question: 'Leon Draisaitl grew up as the son of which former NHL player?', options: ['Peter Draisaitl (NHL journeyman)', 'Ulf Draisaitl (Swedish player)', 'No — his father did not play professionally', 'Peter Draisaitl, who played for the Oilers'], correctIndex: 0, explanation: 'Leon\'s father Peter Draisaitl played professional hockey in Germany and had a brief NHL career, giving Leon his foundation in the game from an early age.' },
    ],
  },
  // ─── 2026-04-08 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-08', league: 'NHL',
    mystery_player: { name: 'Leon Draisaitl', team: 'Edmonton Oilers', position: 'C', height: "6'1\"", jerseyNumber: 29, conference: 'Western', country: 'Germany', age: 29, stats: { goals: 36, assists: 67, points: 103, plus_minus: 15 } },
    showdown_player_a: { name: 'Bobby Orr', team: 'Boston Bruins', stats: { pts: 102, norris: 8, seasons_at_peak: 7 }, statLabel: 'Career Highlights' },
    showdown_player_b: { name: 'Nicklas Lidstrom', team: 'Detroit Red Wings', stats: { norris: 7, stanley_cups: 4, seasons: 20 }, statLabel: 'Career' },
    showdown_category: 'ORRD VS LIDSTROM: BETTER ALL-AROUND DEFENSEMAN?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Orr changed the game entirely — he led the league in scoring as a defenseman, something Lidstrom never did. His transformative impact puts him above any other blue-liner.',
    blind_rank_players: [
      { name: 'Leon Draisaitl', team: 'Edmonton Oilers', rankingStat: 900, statLabel: 'Career Points (thru 2024-25)' },
      { name: 'Auston Matthews', team: 'Toronto Maple Leafs', rankingStat: 700, statLabel: 'Career Points (thru 2024-25)' },
      { name: 'David Pastrnak', team: 'Boston Bruins', rankingStat: 750, statLabel: 'Career Points (thru 2024-25)' },
      { name: 'Nikita Kucherov', team: 'Tampa Bay Lightning', rankingStat: 900, statLabel: 'Career Points (thru 2024-25)' },
      { name: 'Nathan MacKinnon', team: 'Colorado Avalanche', rankingStat: 950, statLabel: 'Career Points (thru 2024-25)' },
    ],
    blind_rank_category: 'WHO CHANGED THE GAME?',
    trivia_questions: [
      { question: 'Leon Draisaitl won the Hart Trophy in 2020 despite his teammate Connor McDavid also having a dominant season. What was the vote margin?', options: ['It was very close — Draisaitl won by 1 first-place vote', 'Draisaitl won decisively with 22 of 30 first-place votes', 'McDavid won — Draisaitl won the Ted Lindsay Award instead', 'Draisaitl won with 15 first-place votes to McDavid\'s 14'], correctIndex: 1, explanation: 'Draisaitl won the Hart Trophy decisively in 2020 with a 110-point season — a testament to his elite play even on a team with McDavid.' },
      { question: 'Nicklas Lidstrom won 7 Norris Trophies — second only to Bobby Orr. In which city did he play his entire career?', options: ['Boston', 'Detroit', 'Pittsburgh', 'New York'], correctIndex: 1, explanation: 'Lidstrom played all 20 of his NHL seasons with the Detroit Red Wings, winning 4 Stanley Cups and 7 Norris Trophies as the franchise\'s greatest defenseman.' },
      { question: 'Bobby Orr won the Norris Trophy in each of his first 8 full NHL seasons — how old was he when he won his last Norris?', options: ['25', '27', '29', '31'], correctIndex: 1, explanation: 'Orr won his final Norris in 1974-75 at age 27 — knee injuries robbed him of what should have been another decade of dominance.' },
    ],
  },
  // ─── 2026-04-09 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-09', league: 'NHL',
    mystery_player: { name: 'Sidney Crosby', team: 'Pittsburgh Penguins', position: 'C', height: "5'11\"", jerseyNumber: 87, conference: 'Eastern', country: 'Canada', age: 37, stats: { goals: 28, assists: 56, points: 84, plus_minus: 12 } },
    showdown_player_a: { name: 'Wayne Gretzky', team: 'Edmonton Oilers', stats: { stanley_cups: 4, art_ross: 10, career_pts: 2857 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Gordie Howe', team: 'Detroit Red Wings', stats: { stanley_cups: 4, seasons: 26, career_goals: 801 }, statLabel: 'Career' },
    showdown_category: 'GRETZKY VS HOWE: WHO IS TRULY THE GREATEST EVER?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Gretzky\'s numbers are so far beyond any other player that the answer is unambiguous — 2,857 points, records that may never be threatened, and 4 Stanley Cups.',
    blind_rank_players: [
      { name: 'Sidney Crosby', team: 'Pittsburgh Penguins', rankingStat: 109, statLabel: 'Points (2024-25 Season)' },
      { name: 'Connor McDavid', team: 'Edmonton Oilers', rankingStat: 140, statLabel: 'Points (2024-25 Season)' },
      { name: 'Nathan MacKinnon', team: 'Colorado Avalanche', rankingStat: 132, statLabel: 'Points (2024-25 Season)' },
      { name: 'Nikita Kucherov', team: 'Tampa Bay Lightning', rankingStat: 118, statLabel: 'Points (2024-25 Season)' },
      { name: 'Leon Draisaitl', team: 'Edmonton Oilers', rankingStat: 124, statLabel: 'Points (2024-25 Season)' },
    ],
    blind_rank_category: 'RANK BY LEGACY',
    trivia_questions: [
      { question: 'Sidney Crosby scored the goal that ended the 2010 Olympic gold medal game. Who was the assist on that goal?', options: ['Ryan Getzlaf', 'Joe Thornton', 'Jarome Iginla', 'Scott Niedermayer'], correctIndex: 2, explanation: 'Jarome Iginla passed to a charging Crosby who scored the overtime winner against the USA — one of the most iconic moments in hockey history.' },
      { question: 'Wayne Gretzky played for 4 different NHL teams. Which was his last?', options: ['Los Angeles Kings', 'St. Louis Blues', 'New York Rangers', 'San Jose Sharks'], correctIndex: 2, explanation: 'Gretzky finished his career with the New York Rangers (1996-1999), retiring after the 1998-99 season at Madison Square Garden.' },
      { question: 'Gordie Howe was nicknamed "Mr. Hockey." His wife Colleen was nicknamed what, reflecting her importance to his career?', options: ['Mrs. Hockey', 'The First Lady of Hockey', 'Iron Lady', 'The Power Behind the Throne'], correctIndex: 0, explanation: 'Colleen Howe was literally nicknamed "Mrs. Hockey" — she was her husband\'s lifelong agent and advocate at a time when players had virtually no representation.' },
    ],
  },
  // ─── 2026-04-10 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-10', league: 'NHL',
    mystery_player: { name: 'Auston Matthews', team: 'Toronto Maple Leafs', position: 'C', height: "6'3\"", jerseyNumber: 34, conference: 'Eastern', country: 'USA', age: 27, stats: { goals: 35, assists: 30, points: 65, plus_minus: 4 } },
    showdown_player_a: { name: 'Mark Messier', team: 'New York Rangers', stats: { career_pts: 1887, stanley_cups: 6, guarantee_game_hattrick: true }, statLabel: 'Career Highlights' },
    showdown_player_b: { name: 'Steve Yzerman', team: 'Detroit Red Wings', stats: { career_pts: 1755, stanley_cups: 3, conn_smythe: 1 }, statLabel: 'Career' },
    showdown_category: 'GREATER CAPTAIN: MESSIER OR YZERMAN?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Messier captained TWO franchises to championships — only he can claim that. His 1994 guarantee game is the single most iconic act of leadership in NHL history.',
    blind_rank_players: [
      { name: 'Auston Matthews', team: 'Toronto Maple Leafs', rankingStat: 69, statLabel: 'Goals in a Single Season (2023-24)' },
      { name: 'Wayne Gretzky', team: 'Edmonton Oilers', rankingStat: 92, statLabel: 'Goals in a Single Season (1981-82, all-time)' },
      { name: 'Brett Hull', team: 'St. Louis Blues', rankingStat: 86, statLabel: 'Goals in a Single Season (1990-91)' },
      { name: 'Phil Esposito', team: 'Boston Bruins', rankingStat: 76, statLabel: 'Goals in a Single Season (1970-71)' },
      { name: 'Teemu Selanne', team: 'Winnipeg Jets', rankingStat: 76, statLabel: 'Goals in a Single Season (1992-93, rookie record)' },
    ],
    blind_rank_category: 'WHO WOULD YOU BUILD A TEAM AROUND?',
    trivia_questions: [
      { question: 'Auston Matthews scored 4 goals in his very first NHL game. How many players had done that before him?', options: ['0', '1', '2', '3'], correctIndex: 0, explanation: 'Matthews became the first player in NHL history to score 4 goals in his debut game on October 12, 2016 against Ottawa — an unprecedented debut.' },
      { question: 'Mark Messier won the Stanley Cup with the Rangers after how many years of drought in New York?', options: ['40 years', '47 years', '51 years', '54 years'], correctIndex: 3, explanation: 'The Rangers had not won the Cup since 1940 — a 54-year drought that made the 1994 championship under Messier one of the most emotionally charged in NHL history.' },
      { question: 'Steve Yzerman served as GM and built the Tampa Bay Lightning into a dynasty. How many Cups did they win while he was building the team (even after he left)?', options: ['1', '2', '3', '4'], correctIndex: 1, explanation: 'Yzerman drafted and developed the core of the Lightning roster that won the Stanley Cup in 2020 and 2021 — two championships built on his foundation as GM.' },
    ],
  },
  // ─── 2026-04-11 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-11', league: 'NHL',
    mystery_player: { name: 'Mario Lemieux', team: 'Pittsburgh Penguins', position: 'C', height: "6'4\"", jerseyNumber: 66, conference: 'Eastern', country: 'Canada', age: 59, stats: { goals: 85, assists: 114, points: 199, plus_minus: 41 } },
    showdown_player_a: { name: 'Jaromir Jagr', team: 'Pittsburgh Penguins', stats: { career_pts: 1921, nhl_seasons: 24, career_goals: 766 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Mark Messier', team: 'Edmonton Oilers', stats: { career_pts: 1887, stanley_cups: 6, leadership_legacy: 'greatest captain' }, statLabel: 'Career' },
    showdown_category: 'MORE IMPACTFUL CAREER: JAGR OR MESSIER?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Messier\'s 6 Stanley Cups and leadership of two different franchises to championships gives him more total impact than Jagr\'s brilliant but less decorated individual career.',
    blind_rank_players: [
      { name: 'Mario Lemieux', team: 'Pittsburgh Penguins', rankingStat: 690, statLabel: 'Career Goals' },
      { name: 'Steve Yzerman', team: 'Detroit Red Wings', rankingStat: 692, statLabel: 'Career Goals' },
      { name: 'Mark Messier', team: 'Edmonton Oilers', rankingStat: 694, statLabel: 'Career Goals' },
      { name: 'Brett Hull', team: 'St. Louis Blues', rankingStat: 741, statLabel: 'Career Goals' },
      { name: 'Jaromir Jagr', team: 'Pittsburgh Penguins', rankingStat: 766, statLabel: 'Career Goals' },
    ],
    blind_rank_category: 'RANK BY CLUTCH FACTOR',
    trivia_questions: [
      { question: 'Mario Lemieux had to interrupt his 1992-93 season for cancer treatment, then came back and still won the scoring title. What type of cancer?', options: ['Leukemia', 'Hodgkin\'s lymphoma', 'Prostate cancer', 'Skin cancer'], correctIndex: 1, explanation: 'Lemieux was diagnosed with Hodgkin\'s lymphoma in January 1993. He received his last radiation treatment in the morning and played that evening — then went on to win the scoring title.' },
      { question: 'Jaromir Jagr wore #68 to honor the year of the Prague Spring. After defecting, which country did he play for in international competition?', options: ['Canada', 'Czech Republic', 'Slovakia', 'He never played internationally after defecting'], correctIndex: 1, explanation: 'Jagr represented the Czech Republic (and previously Czechoslovakia) throughout his international career, including winning gold at the 1998 Nagano Olympics.' },
      { question: 'Mark Messier and Wayne Gretzky won how many Stanley Cups together in Edmonton?', options: ['3', '4', '5', '6'], correctIndex: 1, explanation: 'Gretzky and Messier won 4 Stanley Cups together with the Edmonton Oilers (1984, 1985, 1987, 1988) before Gretzky was traded to Los Angeles.' },
    ],
  },
  // ─── 2026-04-12 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-12', league: 'NHL',
    mystery_player: { name: 'Nikita Kucherov', team: 'Tampa Bay Lightning', position: 'RW', height: "5'11\"", jerseyNumber: 86, conference: 'Eastern', country: 'Russia', age: 31, stats: { goals: 30, assists: 72, points: 102, plus_minus: 10 } },
    showdown_player_a: { name: 'Wayne Gretzky', team: 'Edmonton Oilers', stats: { career_pts: 2857, career_goals: 894, art_ross: 10 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Sidney Crosby', team: 'Pittsburgh Penguins', stats: { career_pts: 1960, stanley_cups: 3, olympic_gold: 2 }, statLabel: 'Career thru 2024-25' },
    showdown_category: 'GRETZKY VS CROSBY: GREATEST CANADIAN PLAYER?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Gretzky is not just the greatest Canadian player — he is the greatest player of any nationality in hockey history by every conceivable metric.',
    blind_rank_players: [
      { name: 'Nikita Kucherov', team: 'Tampa Bay Lightning', rankingStat: 2, statLabel: 'Stanley Cups' },
      { name: 'Connor McDavid', team: 'Edmonton Oilers', rankingStat: 1, statLabel: 'Stanley Cups' },
      { name: 'Nathan MacKinnon', team: 'Colorado Avalanche', rankingStat: 1, statLabel: 'Stanley Cups' },
      { name: 'Sidney Crosby', team: 'Pittsburgh Penguins', rankingStat: 3, statLabel: 'Stanley Cups' },
      { name: 'Alex Ovechkin', team: 'Washington Capitals', rankingStat: 1, statLabel: 'Stanley Cups' },
    ],
    blind_rank_category: 'RANK BY OVERALL GREATNESS',
    trivia_questions: [
      { question: 'Nikita Kucherov won the Conn Smythe Trophy in which year after playing the entire regular season on LTIR?', options: ['2019', '2020', '2021', '2022'], correctIndex: 2, explanation: 'Kucherov won the 2021 Conn Smythe after Tampa\'s back-to-back Cup run — he had not played in the regular season due to injury but came back for the playoffs and dominated.' },
      { question: 'Wayne Gretzky was inducted into the Hockey Hall of Fame with the waiting period waived. True or False?', options: ['True', 'False'], correctIndex: 0, explanation: 'Gretzky was inducted in 1999, the same year he retired, with the normal 3-year waiting period waived — a one-time honor recognizing his unprecedented impact on the game.' },
      { question: 'Sidney Crosby\'s career began with Pittsburgh after the lockout. Who did Crosby play his first game against?', options: ['Philadelphia Flyers', 'New Jersey Devils', 'New York Rangers', 'Buffalo Sabres'], correctIndex: 0, explanation: 'Crosby played his first NHL game on October 5, 2005 against the Philadelphia Flyers, recording an assist in Pittsburgh\'s 5-1 win.' },
    ],
  },
  // ─── 2026-04-13 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-13', league: 'NHL',
    mystery_player: { name: 'Cale Makar', team: 'Colorado Avalanche', position: 'D', height: "5'11\"", jerseyNumber: 8, conference: 'Western', country: 'Canada', age: 26, stats: { goals: 20, assists: 58, points: 78, plus_minus: 16 } },
    showdown_player_a: { name: 'Connor McDavid', team: 'Edmonton Oilers', stats: { pts: 140, hart: 4, cups: 1 }, statLabel: '2024-25 Season / Career' },
    showdown_player_b: { name: 'Nathan MacKinnon', team: 'Colorado Avalanche', stats: { pts: 132, hart: 2, cups: 1 }, statLabel: '2024-25 Season / Career' },
    showdown_category: 'WHO WILL FINISH WITH THE BETTER NHL CAREER?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'McDavid\'s 1.74 pts/game rate and 4 Hart Trophies at a younger age project to a career that could challenge Gretzky\'s records — no other active player is on that trajectory.',
    blind_rank_players: [
      { name: 'Cale Makar', team: 'Colorado Avalanche', rankingStat: 500, statLabel: 'Career Points (thru 2024-25, defenseman)' },
      { name: 'Quinn Hughes', team: 'Vancouver Canucks', rankingStat: 480, statLabel: 'Career Points (thru 2024-25, defenseman)' },
      { name: 'Bobby Orr', team: 'Boston Bruins', rankingStat: 915, statLabel: 'Career Points (in only 657 games)' },
      { name: 'Paul Coffey', team: 'Edmonton Oilers', rankingStat: 1531, statLabel: 'Career Points (defenseman record)' },
      { name: 'Ray Bourque', team: 'Boston Bruins', rankingStat: 1579, statLabel: 'Career Points (2nd among defensemen)' },
    ],
    blind_rank_category: 'WHO WAS THE MOST DOMINANT PLAYER?',
    trivia_questions: [
      { question: 'Cale Makar became the first defenseman to win the Conn Smythe since which player won it in 2001?', options: ['Chris Chelios', 'Scott Stevens', 'Nicklas Lidstrom', 'Rob Blake'], correctIndex: 1, explanation: 'Scott Stevens won the 2000 Conn Smythe — Makar won it in 2022, becoming the first defenseman in over 20 years to be named playoff MVP.' },
      { question: 'Connor McDavid won the 2024 Stanley Cup in how many games against the Florida Panthers?', options: ['4', '5', '6', '7'], correctIndex: 3, explanation: 'The Oilers won the 2024 Stanley Cup in 7 games over the Florida Panthers after trailing 3-0 in the series — one of the greatest comebacks in Cup Final history.' },
      { question: 'Nathan MacKinnon and Sidney Crosby are both from the same small town in Nova Scotia. What town?', options: ['Dartmouth', 'Cole Harbour', 'Truro', 'New Glasgow'], correctIndex: 1, explanation: 'Both MacKinnon and Crosby are from Cole Harbour, Nova Scotia — a town of roughly 25,000 people that produced two of the greatest centers in NHL history.' },
    ],
  },
]

async function seed() {
  console.log(`Seeding ${games.length} NHL daily games...`)

  for (const game of games) {
    const { error } = await supabase
      .from('daily_games')
      .upsert(game, { onConflict: 'date,league' })

    if (error) {
      console.error(`Error seeding ${game.date} ${game.league}:`, error.message)
    } else {
      console.log(`✓ ${game.date} NHL`)
    }
  }

  console.log('Done!')
}

seed()
