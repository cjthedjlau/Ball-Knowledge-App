// No schema changes needed — mystery_player is stored as jsonb
// Run with:
// SUPABASE_SERVICE_ROLE_KEY=your-key npx ts-node --project scripts/tsconfig.json scripts/seed-mlb.ts

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://scloxktkudutupiyqvbx.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY env var is required')
  console.error('Usage: SUPABASE_SERVICE_ROLE_KEY=your-key npx ts-node --project scripts/tsconfig.json scripts/seed-mlb.ts')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

const games = [
  // ─── 2026-03-15 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-15', league: 'MLB',
    mystery_player: { name: 'Shohei Ohtani', team: 'Los Angeles Dodgers', position: 'DH', division: 'NL West', battingHand: 'L', throwingHand: 'R', country: 'Japan', age: 30, stats: { avg: .310, hr: 54, rbi: 130 } },
    showdown_player_a: { name: 'Marcell Ozuna', team: 'Atlanta Braves', stats: { avg: .302, hr: 39, rbi: 104, ops: .924 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Juan Soto', team: 'New York Mets', stats: { avg: .288, hr: 41, rbi: 109, ops: .989 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER HITTER IN 2024?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Ozuna hit .302 with 39 HR — a top-5 offensive season that flew under the radar next to Soto\'s free agency buzz. Ozuna led in average while Soto edged him in power, but the stats are closer than anyone expected.',
    blind_rank_players: [
      { name: 'Aaron Judge', team: 'New York Yankees', rankingStat: 58, statLabel: 'Home Runs (2024)' },
      { name: 'Shohei Ohtani', team: 'Los Angeles Dodgers', rankingStat: 54, statLabel: 'Home Runs (2024)' },
      { name: 'Yordan Alvarez', team: 'Houston Astros', rankingStat: 35, statLabel: 'Home Runs (2024)' },
      { name: 'Juan Soto', team: 'New York Mets', rankingStat: 41, statLabel: 'Home Runs (2024)' },
      { name: 'Vladimir Guerrero Jr', team: 'Toronto Blue Jays', rankingStat: 30, statLabel: 'Home Runs (2024)' },
    ],
    blind_rank_category: 'RANK BY OVERALL GREATNESS',
    trivia_questions: [
      { question: 'Shohei Ohtani became the first player in MLB history to do what in 2024?', options: ['Hit .300 with 50 HRs', 'Steal 50 bases AND hit 50 HRs in one season', 'Win MVP and Cy Young in the same year', 'Hit 4 HRs in a World Series game'], correctIndex: 1, explanation: 'Ohtani\'s 54 HR and 59 SB in 2024 made him the first 50-50 player in MLB history — one of the most historic individual seasons ever.' },
      { question: 'Aaron Judge\'s 58 HRs in 2024 set the American League record. He also held the previous AL record set in which year?', options: ['2017', '2020', '2022', '2021'], correctIndex: 2, explanation: 'Judge hit 62 HRs in 2022 to break Roger Maris\' AL record of 61 (1961), then hit 58 more in 2024.' },
      { question: 'Shohei Ohtani signed with the Dodgers for the largest contract in North American sports history — how much?', options: ['$500 million', '$600 million', '$700 million', '$800 million'], correctIndex: 2, explanation: 'Ohtani signed a 10-year, $700 million deal with the Dodgers in December 2023, the richest contract in North American sports history.' },
    ],
  },
  // ─── 2026-03-16 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-16', league: 'MLB',
    mystery_player: { name: 'Aaron Judge', team: 'New York Yankees', position: 'RF', division: 'AL East', battingHand: 'R', throwingHand: 'R', country: 'USA', age: 32, stats: { avg: .322, hr: 58, rbi: 144 } },
    showdown_player_a: { name: 'Bobby Witt Jr', team: 'Kansas City Royals', stats: { avg: .332, hr: 32, sb: 31, ops: .956 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Shohei Ohtani', team: 'Los Angeles Dodgers', stats: { avg: .310, hr: 54, sb: 59, ops: 1.036 }, statLabel: '2024 Season' },
    showdown_category: 'WHO HAD THE BETTER ALL-AROUND 2024?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Witt led the AL in batting average (.332) and was a 30-30 player with Gold Glove defense — all at age 24. While Ohtani had the flashier power numbers, Witt\'s contact rate and defensive value made it closer than people think.',
    blind_rank_players: [
      { name: 'Aaron Judge', team: 'New York Yankees', rankingStat: 144, statLabel: 'RBI (2024)' },
      { name: 'Shohei Ohtani', team: 'Los Angeles Dodgers', rankingStat: 130, statLabel: 'RBI (2024)' },
      { name: 'Yordan Alvarez', team: 'Houston Astros', rankingStat: 88, statLabel: 'RBI (2024)' },
      { name: 'Vladimir Guerrero Jr', team: 'Toronto Blue Jays', rankingStat: 103, statLabel: 'RBI (2024)' },
      { name: 'Juan Soto', team: 'New York Mets', rankingStat: 109, statLabel: 'RBI (2024)' },
    ],
    blind_rank_category: 'WHO WAS THE MOST FEARED HITTER?',
    trivia_questions: [
      { question: 'Aaron Judge wears #99 — what is the significance of that number?', options: ['His favorite movie was 99 Problems', 'He wanted the last two-digit number', 'His idol wore it in the minors', 'He was 99th overall pick'], correctIndex: 1, explanation: 'Judge chose #99 because he wanted the highest two-digit number available, making him instantly recognizable on the field.' },
      { question: 'Hank Aaron broke Babe Ruth\'s all-time HR record on April 8, 1974 against which pitcher?', options: ['Tom Seaver', 'Steve Carlton', 'Al Downing', 'Don Sutton'], correctIndex: 2, explanation: 'Aaron hit his 715th HR off Al Downing of the Dodgers in Atlanta, breaking Ruth\'s record amid death threats and enormous pressure.' },
      { question: 'Babe Ruth\'s career OPS of 1.164 is the highest in MLB history. What does OPS stand for?', options: ['Overall Power Score', 'On-base Plus Slugging', 'On-base and Performance Stat', 'Overall Performance Score'], correctIndex: 1, explanation: 'OPS (On-base Plus Slugging) combines OBP and SLG into one number — Ruth\'s 1.164 is 170+ points above the all-time average.' },
    ],
  },
  // ─── 2026-03-17 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-17', league: 'MLB',
    mystery_player: { name: 'Juan Soto', team: 'New York Mets', position: 'RF', division: 'NL East', battingHand: 'L', throwingHand: 'L', country: 'Dominican Republic', age: 26, stats: { avg: .288, hr: 41, rbi: 109 } },
    showdown_player_a: { name: 'Ketel Marte', team: 'Arizona Diamondbacks', stats: { avg: .292, hr: 36, rbi: 95, ops: .908 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Freddie Freeman', team: 'Los Angeles Dodgers', stats: { avg: .282, hr: 22, rbi: 89, ops: .854 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER FIRST BASEMAN IN 2024?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Marte crushed Freeman in every major offensive category — 36 HR to 22, .292 to .282 avg, .908 to .854 OPS — yet Freeman got all the spotlight from his World Series heroics. Marte was the better hitter all year.',
    blind_rank_players: [
      { name: 'Juan Soto', team: 'New York Mets', rankingStat: .419, statLabel: 'On-Base Pct (2024)' },
      { name: 'Aaron Judge', team: 'New York Yankees', rankingStat: .458, statLabel: 'On-Base Pct (2024)' },
      { name: 'Shohei Ohtani', team: 'Los Angeles Dodgers', rankingStat: .390, statLabel: 'On-Base Pct (2024)' },
      { name: 'Vladimir Guerrero Jr', team: 'Toronto Blue Jays', rankingStat: .378, statLabel: 'On-Base Pct (2024)' },
      { name: 'Freddie Freeman', team: 'Los Angeles Dodgers', rankingStat: .360, statLabel: 'On-Base Pct (2024)' },
    ],
    blind_rank_category: 'RANK BY PURE TALENT',
    trivia_questions: [
      { question: 'Ted Williams famously hit .406 in which year — the last player to bat .400 or better?', options: ['1939', '1940', '1941', '1942'], correctIndex: 2, explanation: 'Williams hit .406 in 1941 and refused to sit out the final day to protect the average, going 6-8 to finish at .406.' },
      { question: 'Willie Mays\' famous over-the-shoulder catch in the 1954 World Series is called "The Catch." Which player hit the ball?', options: ['Duke Snider', 'Vic Wertz', 'Larry Doby', 'Bob Lemon'], correctIndex: 1, explanation: 'Vic Wertz of the Cleveland Indians hit a 460-foot drive to center field that Mays tracked down with his back to the plate in the Polo Grounds.' },
      { question: 'Juan Soto was traded from the Washington Nationals at age 23 after rejecting a $440 million contract extension. True or False?', options: ['True', 'False'], correctIndex: 0, explanation: 'Soto turned down a $440 million, 15-year offer from Washington before being traded to San Diego in August 2022 for a package including Fernando Tatis Jr was NOT involved — it was 5 players including MacKenzie Gore.' },
    ],
  },
  // ─── 2026-03-18 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-18', league: 'MLB',
    mystery_player: { name: 'Mookie Betts', team: 'Los Angeles Dodgers', position: 'SS', division: 'NL West', battingHand: 'R', throwingHand: 'R', country: 'USA', age: 32, stats: { avg: .289, hr: 19, rbi: 75 } },
    showdown_player_a: { name: 'Chris Sale', team: 'Atlanta Braves', stats: { era: 2.38, wins: 18, k: 225, whip: 0.92 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Gerrit Cole', team: 'New York Yankees', stats: { era: 3.41, wins: 8, k: 99, whip: 1.07 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER PITCHER IN 2024?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Sale\'s renaissance season in Atlanta was staggering — a 2.38 ERA, 225 K, and NL Cy Young award. Cole missed half the year and posted a 3.41 ERA, yet Sale barely got national attention compared to Cole\'s Yankee spotlight.',
    blind_rank_players: [
      { name: 'Mookie Betts', team: 'Los Angeles Dodgers', rankingStat: 19, statLabel: 'Home Runs (2024)' },
      { name: 'Trea Turner', team: 'Philadelphia Phillies', rankingStat: 26, statLabel: 'Home Runs (2024)' },
      { name: 'Fernando Tatis Jr', team: 'San Diego Padres', rankingStat: 31, statLabel: 'Home Runs (2024)' },
      { name: 'Freddie Freeman', team: 'Los Angeles Dodgers', rankingStat: 22, statLabel: 'Home Runs (2024)' },
      { name: 'Vladimir Guerrero Jr', team: 'Toronto Blue Jays', rankingStat: 30, statLabel: 'Home Runs (2024)' },
    ],
    blind_rank_category: 'WHO HAD THE BEST CAREER?',
    trivia_questions: [
      { question: 'Sandy Koufax retired at age 30 due to what condition?', options: ['Shoulder injury', 'Elbow arthritis', 'Back problems', 'Rotator cuff tear'], correctIndex: 1, explanation: 'Koufax retired after the 1966 season at age 30 due to severe arthritis in his left elbow — walking away at the peak of his powers.' },
      { question: 'Nolan Ryan\'s 7th no-hitter came at age 44 against which team?', options: ['Oakland A\'s', 'Toronto Blue Jays', 'Detroit Tigers', 'Minnesota Twins'], correctIndex: 0, explanation: 'Ryan threw his 7th no-hitter on May 1, 1991, at age 44, against the Oakland A\'s — making him the oldest pitcher to throw a no-hitter.' },
      { question: 'Mookie Betts switched from center field to shortstop with the Dodgers in which year?', options: ['2022', '2023', '2024', '2025'], correctIndex: 1, explanation: 'Betts transitioned to shortstop in 2023, adding Gold Glove-caliber defense at a new position while maintaining elite offensive production.' },
    ],
  },
  // ─── 2026-03-19 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-19', league: 'MLB',
    mystery_player: { name: 'Freddie Freeman', team: 'Los Angeles Dodgers', position: '1B', division: 'NL West', battingHand: 'L', throwingHand: 'R', country: 'USA', age: 35, stats: { avg: .282, hr: 22, rbi: 89 } },
    showdown_player_a: { name: 'Tarik Skubal', team: 'Detroit Tigers', stats: { era: 2.39, wins: 18, k: 228, whip: 0.92 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Corbin Burnes', team: 'Arizona Diamondbacks', stats: { era: 2.92, wins: 15, k: 181, whip: 1.10 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER AL ACE IN 2024?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Skubal won the AL Cy Young with a 2.39 ERA and 228 K for a rebuilding Tigers team. He dominated in ERA, strikeouts, and WHIP over Burnes — yet Burnes was the bigger name entering the year after his $210M contract.',
    blind_rank_players: [
      { name: 'Freddie Freeman', team: 'Los Angeles Dodgers', rankingStat: 22, statLabel: 'Home Runs (2024)' },
      { name: 'Mookie Betts', team: 'Los Angeles Dodgers', rankingStat: 19, statLabel: 'Home Runs (2024)' },
      { name: 'Yordan Alvarez', team: 'Houston Astros', rankingStat: 35, statLabel: 'Home Runs (2024)' },
      { name: 'Trea Turner', team: 'Philadelphia Phillies', rankingStat: 26, statLabel: 'Home Runs (2024)' },
      { name: 'Juan Soto', team: 'New York Mets', rankingStat: 41, statLabel: 'Home Runs (2024)' },
    ],
    blind_rank_category: 'RANK BY IMPACT ON BASEBALL',
    trivia_questions: [
      { question: 'Freddie Freeman\'s walk-off grand slam in Game 1 of the 2024 World Series — who did he hit it against?', options: ['New York Yankees', 'Cleveland Guardians', 'Philadelphia Phillies', 'Houston Astros'], correctIndex: 0, explanation: 'Freeman\'s 10th-inning walk-off grand slam off Yankees closer Clay Holmes in Game 1 of the 2024 World Series was an instant classic.' },
      { question: 'Cal Ripken Jr. broke Lou Gehrig\'s consecutive games record of 2,130 on September 6, 1995. What did he do to celebrate?', options: ['Hit a home run', 'Took a curtain call for 22 minutes', 'Jogged around the field', 'All of the above'], correctIndex: 3, explanation: 'When the game became official in the 5th inning, Ripken hit a HR, took multiple curtain calls, then jogged around the entire stadium greeting fans for 22 minutes.' },
      { question: 'Derek Jeter won the World Series MVP in which year?', options: ['1998', '1999', '2000', '2001'], correctIndex: 2, explanation: 'Jeter won World Series MVP in 2000 after the Yankees defeated the Mets in the Subway Series, hitting .409 with 2 HRs.' },
    ],
  },
  // ─── 2026-03-20 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-20', league: 'MLB',
    mystery_player: { name: 'Vladimir Guerrero Jr', team: 'Toronto Blue Jays', position: '1B', division: 'AL East', battingHand: 'R', throwingHand: 'R', country: 'Dominican Republic', age: 26, stats: { avg: .323, hr: 30, rbi: 103 } },
    showdown_player_a: { name: 'Trea Turner', team: 'Philadelphia Phillies', stats: { avg: .283, hr: 21, sb: 30, ops: .779 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Willy Adames', team: 'San Francisco Giants', stats: { avg: .251, hr: 32, rbi: 112, ops: .794 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER SHORTSTOP IN 2024?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Adames quietly posted 32 HR and 112 RBI for Milwaukee — outpacing Turner in power and run production by a wide margin. Turner led in average and speed, but Adames was the more impactful bat from the SS position.',
    blind_rank_players: [
      { name: 'Vladimir Guerrero Jr', team: 'Toronto Blue Jays', rankingStat: .323, statLabel: 'Batting Average (2024)' },
      { name: 'Aaron Judge', team: 'New York Yankees', rankingStat: .322, statLabel: 'Batting Average (2024)' },
      { name: 'Shohei Ohtani', team: 'Los Angeles Dodgers', rankingStat: .310, statLabel: 'Batting Average (2024)' },
      { name: 'Mookie Betts', team: 'Los Angeles Dodgers', rankingStat: .289, statLabel: 'Batting Average (2024)' },
      { name: 'Freddie Freeman', team: 'Los Angeles Dodgers', rankingStat: .282, statLabel: 'Batting Average (2024)' },
    ],
    blind_rank_category: 'WHO WOULD YOU WANT AT BAT?',
    trivia_questions: [
      { question: 'Mickey Mantle won the Triple Crown (BA, HR, RBI) in which year?', options: ['1954', '1956', '1958', '1961'], correctIndex: 1, explanation: 'Mantle won the Triple Crown in 1956 (.353 BA, 52 HR, 130 RBI), one of the rarest achievements in baseball history.' },
      { question: 'Vladimir Guerrero Jr\'s father, Vladimir Guerrero Sr., was a Hall of Famer for which team?', options: ['Los Angeles Dodgers', 'Anaheim Angels', 'Montreal Expos (and Anaheim)', 'Toronto Blue Jays'], correctIndex: 2, explanation: 'Vlad Sr. was a star for the Expos and Angels, winning the 2004 AL MVP — his son Vlad Jr. is now following in his footsteps.' },
      { question: 'Willie Mays played most of his career in which two cities?', options: ['New York and San Francisco', 'Chicago and San Francisco', 'New York and Los Angeles', 'San Francisco and Oakland'], correctIndex: 0, explanation: 'Mays played for the New York Giants (1951-1957, 1972-1973 with Mets) and San Francisco Giants (1958-1972).' },
    ],
  },
  // ─── 2026-03-21 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-21', league: 'MLB',
    mystery_player: { name: 'Yordan Alvarez', team: 'Houston Astros', position: 'DH', division: 'AL West', battingHand: 'L', throwingHand: 'R', country: 'Cuba', age: 27, stats: { avg: .289, hr: 35, rbi: 88 } },
    showdown_player_a: { name: 'Seth Lugo', team: 'Kansas City Royals', stats: { era: 3.00, wins: 16, k: 185, whip: 1.09 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Zack Wheeler', team: 'Philadelphia Phillies', stats: { era: 2.57, wins: 16, k: 224, whip: 1.04 }, statLabel: '2024 Season' },
    showdown_category: 'WHO HAD THE BETTER 2024 ON THE MOUND?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Lugo\'s breakout as a starter — 3.00 ERA and 16 wins for the surprising Royals — was one of the best stories in baseball. Wheeler had the better raw numbers, but Lugo matched his wins while carrying a smaller-market team to the playoffs.',
    blind_rank_players: [
      { name: 'Yordan Alvarez', team: 'Houston Astros', rankingStat: .568, statLabel: 'Slugging Pct (2024)' },
      { name: 'Aaron Judge', team: 'New York Yankees', rankingStat: .701, statLabel: 'Slugging Pct (2024)' },
      { name: 'Shohei Ohtani', team: 'Los Angeles Dodgers', rankingStat: .646, statLabel: 'Slugging Pct (2024)' },
      { name: 'Juan Soto', team: 'New York Mets', rankingStat: .569, statLabel: 'Slugging Pct (2024)' },
      { name: 'Fernando Tatis Jr', team: 'San Diego Padres', rankingStat: .502, statLabel: 'Slugging Pct (2024)' },
    ],
    blind_rank_category: 'RANK BY CONSISTENCY',
    trivia_questions: [
      { question: 'Yordan Alvarez defected from Cuba and entered the US at what age?', options: ['16', '18', '20', '21'], correctIndex: 1, explanation: 'Alvarez defected from Cuba at age 18, eventually signing with the Astros as a 19-year-old international free agent in 2016.' },
      { question: 'Greg Maddux won 4 consecutive Cy Young Awards from 1992-1995. In those 4 years, his combined ERA was under what figure?', options: ['1.80', '1.99', '2.15', '2.34'], correctIndex: 1, explanation: 'Maddux averaged 1.99 ERA across his 4 consecutive Cy Young seasons — a run of pitching efficiency never seen before or since.' },
      { question: 'Sandy Koufax\'s career was shortened by elbow arthritis. How many consecutive years did he lead the NL in ERA?', options: ['2', '3', '4', '5'], correctIndex: 3, explanation: 'Koufax led the NL in ERA every year from 1962-1966 — 5 consecutive seasons — while also throwing 4 no-hitters in that span.' },
    ],
  },
  // ─── 2026-03-22 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-22', league: 'MLB',
    mystery_player: { name: 'Fernando Tatis Jr', team: 'San Diego Padres', position: 'RF', division: 'NL West', battingHand: 'R', throwingHand: 'R', country: 'Dominican Republic', age: 26, stats: { avg: .262, hr: 21, rbi: 69 } },
    showdown_player_a: { name: 'Willie Mays', team: 'San Francisco Giants', stats: { career_hr: 660, career_avg: .302, career_sb: 338, gold_gloves: 12 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Mickey Mantle', team: 'New York Yankees', stats: { career_hr: 536, career_ops: .977, career_avg: .298, mvps: 3 }, statLabel: 'Career' },
    showdown_category: 'WHO WAS THE GREATER CENTER FIELDER?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Mays leads in career HR (660 vs 536), stolen bases (338 vs 153), Gold Gloves (12 vs 0), and longevity. Mantle had the higher peak OPS, but Mays was the more complete five-tool player across a longer career.',
    blind_rank_players: [
      { name: 'Fernando Tatis Jr', team: 'San Diego Padres', rankingStat: 31, statLabel: 'Home Runs (2024)' },
      { name: 'Shohei Ohtani', team: 'Los Angeles Dodgers', rankingStat: 54, statLabel: 'Home Runs (2024)' },
      { name: 'Aaron Judge', team: 'New York Yankees', rankingStat: 58, statLabel: 'Home Runs (2024)' },
      { name: 'Juan Soto', team: 'New York Mets', rankingStat: 41, statLabel: 'Home Runs (2024)' },
      { name: 'Yordan Alvarez', team: 'Houston Astros', rankingStat: 35, statLabel: 'Home Runs (2024)' },
    ],
    blind_rank_category: 'RANK BY OVERALL GREATNESS',
    trivia_questions: [
      { question: 'Fernando Tatis Jr was suspended for 80 games in 2022 for violating which MLB policy?', options: ['Gambling', 'PED use (Clostebol)', 'Substance abuse program', 'Pine tar violation'], correctIndex: 1, explanation: 'Tatis received an 80-game suspension in 2022 for testing positive for Clostebol, a performance-enhancing substance.' },
      { question: 'Ken Griffey Jr elected to be inducted into the Hall of Fame wearing which team\'s cap?', options: ['Seattle Mariners', 'Cincinnati Reds', 'Neither — blank cap', 'Both on display'], correctIndex: 0, explanation: 'Griffey chose to be inducted as a Mariner despite playing in Cincinnati — honoring the city and fans that made him an icon.' },
      { question: 'Hank Aaron\'s #44 is retired by which two teams?', options: ['Braves and Brewers', 'Braves and Orioles', 'Braves only (as a baseball first)', 'Braves and Cubs'], correctIndex: 0, explanation: 'Both the Atlanta Braves and Milwaukee Brewers retired #44 for Aaron, who played for both franchises during his career.' },
    ],
  },
  // ─── 2026-03-23 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-23', league: 'MLB',
    mystery_player: { name: 'Trea Turner', team: 'Philadelphia Phillies', position: 'SS', division: 'NL East', battingHand: 'R', throwingHand: 'R', country: 'USA', age: 31, stats: { avg: .283, hr: 21, rbi: 62 } },
    showdown_player_a: { name: 'Elly De La Cruz', team: 'Cincinnati Reds', stats: { avg: .244, hr: 25, sb: 67, ops: .761 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Bobby Witt Jr', team: 'Kansas City Royals', stats: { avg: .332, hr: 32, sb: 31, ops: .956 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER YOUNG SHORTSTOP IN 2024?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Witt dominated in average (.332 vs .244) and OPS (.956 vs .761) while De La Cruz led only in stolen bases. Witt was the complete package; De La Cruz had the highlight reel speed but far less consistency at the plate.',
    blind_rank_players: [
      { name: 'Trea Turner', team: 'Philadelphia Phillies', rankingStat: 30, statLabel: 'Stolen Bases (2024)' },
      { name: 'Shohei Ohtani', team: 'Los Angeles Dodgers', rankingStat: 59, statLabel: 'Stolen Bases (2024)' },
      { name: 'Ronald Acuna Jr', team: 'Atlanta Braves', rankingStat: 7, statLabel: 'Stolen Bases (2024 — injury)' },
      { name: 'Mookie Betts', team: 'Los Angeles Dodgers', rankingStat: 12, statLabel: 'Stolen Bases (2024)' },
      { name: 'Fernando Tatis Jr', team: 'San Diego Padres', rankingStat: 29, statLabel: 'Stolen Bases (2024)' },
    ],
    blind_rank_category: 'WHO WAS THE MOST FEARED HITTER?',
    trivia_questions: [
      { question: 'Trea Turner won a World Series ring with which team?', options: ['Washington Nationals', 'Los Angeles Dodgers', 'Both teams he played on won', 'Neither — hasn\'t won yet'], correctIndex: 0, explanation: 'Turner won the World Series with Washington in 2019, then was traded to LA where the Dodgers also won in 2020 — he was traded after the 2019 postseason.' },
      { question: 'Babe Ruth started his career as a pitcher for the Boston Red Sox. What was his career pitching ERA?', options: ['1.62', '2.28', '2.87', '3.14'], correctIndex: 2, explanation: 'Ruth posted a career 2.28 ERA as a pitcher — good enough for Cooperstown on pitching alone before he became the greatest slugger ever.' },
      { question: 'Willie Mays\' career was interrupted by 2 years of military service. Which war?', options: ['World War II', 'Korean War', 'Vietnam War', 'Gulf War'], correctIndex: 1, explanation: 'Mays served in the US Army during the Korean War in 1952-1953, missing two full seasons at the peak of his early career.' },
    ],
  },
  // ─── 2026-03-24 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-24', league: 'MLB',
    mystery_player: { name: 'Ronald Acuna Jr', team: 'Atlanta Braves', position: 'RF', division: 'NL East', battingHand: 'R', throwingHand: 'R', country: 'Venezuela', age: 27, stats: { avg: .104, hr: 0, rbi: 2 } },
    showdown_player_a: { name: 'Sandy Koufax', team: 'Los Angeles Dodgers', stats: { peak_era: 1.86, career_k: 2396, no_hitters: 4, cy_youngs: 3 }, statLabel: 'Career (1955-1966)' },
    showdown_player_b: { name: 'Pedro Martinez', team: 'Boston Red Sox', stats: { career_era: 2.93, career_k: 3154, cy_youngs: 3, era_plus: 154 }, statLabel: 'Career (1992-2009)' },
    showdown_category: 'WHO HAD THE MORE DOMINANT PEAK?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Pedro\'s 1999-2000 seasons (2.07 ERA in the steroid era, 154 career ERA+) are considered the most dominant pitching stretch relative to era. Koufax had more no-hitters, but Pedro did it against juiced lineups in a hitter-friendly division.',
    blind_rank_players: [
      { name: 'Ronald Acuna Jr', team: 'Atlanta Braves', rankingStat: 29, statLabel: 'Games Played (2024 — injury)' },
      { name: 'Mike Trout', team: 'Los Angeles Angels', rankingStat: 29, statLabel: 'Games Played (2024 — injury)' },
      { name: 'Mookie Betts', team: 'Los Angeles Dodgers', rankingStat: 116, statLabel: 'Games Played (2024)' },
      { name: 'Gerrit Cole', team: 'New York Yankees', rankingStat: 17, statLabel: 'Games Started (2024)' },
      { name: 'Fernando Tatis Jr', team: 'San Diego Padres', rankingStat: 144, statLabel: 'Games Played (2024)' },
    ],
    blind_rank_category: 'RANK BY PURE TALENT',
    trivia_questions: [
      { question: 'Ronald Acuna Jr became the first player to hit how many HRs and steal how many bases in the same season (2023)?', options: ['30 HR / 60 SB', '40 HR / 70 SB', '41 HR / 73 SB', '35 HR / 50 SB'], correctIndex: 2, explanation: 'In 2023, Acuna posted 41 HR and 73 SB — the first 40-70 season in MLB history before tearing his ACL in June 2024.' },
      { question: 'Mickey Mantle played his entire career at which position?', options: ['First Base', 'Left Field', 'Center Field', 'Third Base'], correctIndex: 2, explanation: 'Mantle was a center fielder his entire career — widely considered one of the greatest defensive center fielders ever despite his knee injuries.' },
      { question: 'Derek Jeter\'s famous "Flip Play" in the 2001 ALDS preserved a win against which team?', options: ['Seattle Mariners', 'Oakland Athletics', 'Boston Red Sox', 'Toronto Blue Jays'], correctIndex: 1, explanation: 'Jeter\'s improbable relay flip to Jorge Posada tagged out Jeremy Giambi of the Oakland A\'s in one of the most clutch defensive plays in postseason history.' },
    ],
  },
  // ─── 2026-03-25 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-25', league: 'MLB',
    mystery_player: { name: 'Mike Trout', team: 'Los Angeles Angels', position: 'CF', division: 'AL West', battingHand: 'R', throwingHand: 'R', country: 'USA', age: 33, stats: { avg: .220, hr: 10, rbi: 14 } },
    showdown_player_a: { name: 'Bryan Reynolds', team: 'Pittsburgh Pirates', stats: { avg: .275, hr: 24, rbi: 80, ops: .830 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Fernando Tatis Jr', team: 'San Diego Padres', stats: { avg: .262, hr: 21, rbi: 69, ops: .782 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER OUTFIELDER IN 2024?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Reynolds outperformed Tatis in every major stat — .275 vs .262 avg, 24 vs 21 HR, .830 vs .782 OPS — on a fraction of the salary. Reynolds was the better hitter on a team with zero national spotlight.',
    blind_rank_players: [
      { name: 'Mike Trout', team: 'Los Angeles Angels', rankingStat: 85.2, statLabel: 'Career WAR (thru 2024)' },
      { name: 'Babe Ruth', team: 'New York Yankees', rankingStat: 183.1, statLabel: 'Career WAR (historical)' },
      { name: 'Willie Mays', team: 'San Francisco Giants', rankingStat: 156.2, statLabel: 'Career WAR (historical)' },
      { name: 'Hank Aaron', team: 'Atlanta Braves', rankingStat: 143.1, statLabel: 'Career WAR (historical)' },
      { name: 'Shohei Ohtani', team: 'Los Angeles Dodgers', rankingStat: 64.5, statLabel: 'Career WAR (thru 2024)' },
    ],
    blind_rank_category: 'WHO HAD THE BEST CAREER?',
    trivia_questions: [
      { question: 'Mike Trout has won how many AL MVP awards — the most by any AL player in the last 15 years?', options: ['2', '3', '4', '5'], correctIndex: 1, explanation: 'Trout won 3 AL MVP awards (2014, 2016, 2019) — and finished as a Top 3 MVP finalist 9 times in his first 12 seasons.' },
      { question: 'How many seasons has Mike Trout missed primarily due to injury in his career through 2024?', options: ['1', '2', '3', '4'], correctIndex: 2, explanation: 'Trout has missed significant time in 2021 (calf), 2023 (wrist), and 2024 (knee), limiting what could have been the greatest statistical career ever.' },
      { question: 'Shohei Ohtani won the 2021 AL MVP unanimously. How many home runs did he hit that season while also pitching?', options: ['38', '42', '46', '50'], correctIndex: 2, explanation: 'Ohtani hit .257 with 46 HRs while also going 9-2 with a 3.18 ERA on the mound in 2021 — the greatest two-way season in modern baseball history.' },
    ],
  },
  // ─── 2026-03-26 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-26', league: 'MLB',
    mystery_player: { name: 'Gerrit Cole', team: 'New York Yankees', position: 'SP', division: 'AL East', battingHand: 'R', throwingHand: 'R', country: 'USA', age: 34, stats: { era: 3.41, wins: 8, k: 99 } },
    showdown_player_a: { name: 'Logan Webb', team: 'San Francisco Giants', stats: { era: 3.54, wins: 11, ip: 214, whip: 1.18 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Reynaldo Lopez', team: 'Atlanta Braves', stats: { era: 1.99, wins: 8, ip: 113, whip: 0.86 }, statLabel: '2024 Season' },
    showdown_category: 'WHO HAD THE MORE DOMINANT 2024 SEASON?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Lopez posted a stunning 1.99 ERA and 0.86 WHIP as a setup man turned All-Star. Webb logged more innings and wins, but Lopez\'s rate stats were elite — a reliever who outperformed most starters on a per-inning basis.',
    blind_rank_players: [
      { name: 'Gerrit Cole', team: 'New York Yankees', rankingStat: 3.41, statLabel: 'ERA (2024)' },
      { name: 'Sandy Koufax', team: 'Los Angeles Dodgers', rankingStat: 1.73, statLabel: 'Career ERA Best Season (1966)' },
      { name: 'Clayton Kershaw', team: 'Los Angeles Dodgers', rankingStat: 2.48, statLabel: 'Career ERA (thru 2024)' },
      { name: 'Greg Maddux', team: 'Atlanta Braves', rankingStat: 3.16, statLabel: 'Career ERA' },
      { name: 'Nolan Ryan', team: 'Houston Astros', rankingStat: 3.19, statLabel: 'Career ERA' },
    ],
    blind_rank_category: 'RANK BY IMPACT ON BASEBALL',
    trivia_questions: [
      { question: 'Gerrit Cole signed the largest contract for a pitcher in MLB history with the Yankees. How much?', options: ['$270 million', '$300 million', '$324 million', '$350 million'], correctIndex: 2, explanation: 'Cole signed a 9-year, $324 million deal with the Yankees in December 2019, the largest contract ever for a pitcher at the time.' },
      { question: 'Pete Rose is ineligible for the Hall of Fame due to gambling. His manager career was with which team when the ban occurred?', options: ['Philadelphia Phillies', 'Cincinnati Reds', 'Montreal Expos', 'Chicago Cubs'], correctIndex: 1, explanation: 'Rose was managing the Reds in 1989 when he was permanently banned for betting on baseball games — including Reds games.' },
      { question: 'Ted Williams lost how many prime seasons to military service (WWII and Korea)?', options: ['3', '4', '5', '6'], correctIndex: 2, explanation: 'Williams missed 5 seasons (1943-45 for WWII, 1952-53 for Korea), potentially costing him ~250 additional HRs based on his career pace.' },
    ],
  },
  // ─── 2026-03-27 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-27', league: 'MLB',
    mystery_player: { name: 'Sandy Koufax', team: 'Los Angeles Dodgers', position: 'SP', division: 'NL West', battingHand: 'R', throwingHand: 'L', country: 'USA', age: 89, stats: { era: 2.76, wins: 165, k: 2396 } },
    showdown_player_a: { name: 'Babe Ruth', team: 'New York Yankees', stats: { career_avg: .342, career_hr: 714, career_ops: 1.164 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Ted Williams', team: 'Boston Red Sox', stats: { career_avg: .344, career_hr: 521, career_obp: .482 }, statLabel: 'Career' },
    showdown_category: 'WHO WAS THE GREATEST HITTER OF ALL TIME?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Williams edges Ruth in career average (.344 to .342) and holds the all-time OBP record (.482). Ruth leads in HR and OPS, but Williams lost 5 prime years to military service. As a pure hitter, The Splendid Splinter has the edge.',
    blind_rank_players: [
      { name: 'Sandy Koufax', team: 'Los Angeles Dodgers', rankingStat: 4, statLabel: 'Career No-Hitters' },
      { name: 'Nolan Ryan', team: 'Houston Astros', rankingStat: 7, statLabel: 'Career No-Hitters' },
      { name: 'Bob Feller', team: 'Cleveland Indians', rankingStat: 3, statLabel: 'Career No-Hitters' },
      { name: 'Cy Young', team: 'Boston Americans', rankingStat: 3, statLabel: 'Career No-Hitters' },
      { name: 'Larry Corcoran', team: 'Chicago White Stockings', rankingStat: 3, statLabel: 'Career No-Hitters (1880s)' },
    ],
    blind_rank_category: 'WHO WOULD YOU WANT AT BAT?',
    trivia_questions: [
      { question: 'Sandy Koufax was Jewish and famously refused to pitch Game 1 of the 1965 World Series because it fell on which holiday?', options: ['Passover', 'Rosh Hashanah', 'Yom Kippur', 'Hanukkah'], correctIndex: 2, explanation: 'Koufax sat out Game 1 (Yom Kippur) and pitched Games 5 and 7 instead, winning both to lead the Dodgers to the title.' },
      { question: 'Babe Ruth\'s pitching career ERA in World Series play was remarkably low. What was it?', options: ['0.27', '0.54', '0.87', '1.06'], correctIndex: 2, explanation: 'Ruth went 3-0 in World Series play with a 0.87 ERA — including 29.2 consecutive scoreless innings, a record that stood for decades.' },
      { question: 'Shohei Ohtani\'s first MLB hit was a home run. What team was he playing for at the time?', options: ['Los Angeles Dodgers', 'Los Angeles Angels', 'Seattle Mariners', 'San Diego Padres'], correctIndex: 1, explanation: 'Ohtani hit his first MLB HR in his first at-bat on April 1, 2018 as a member of the Los Angeles Angels.' },
    ],
  },
  // ─── 2026-03-28 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-28', league: 'MLB',
    mystery_player: { name: 'Babe Ruth', team: 'New York Yankees', position: 'RF', division: 'AL East', battingHand: 'L', throwingHand: 'L', country: 'USA', age: 130, stats: { avg: .342, hr: 714, rbi: 2214 } },
    showdown_player_a: { name: 'Emmanuel Clase', team: 'Cleveland Guardians', stats: { era: 0.61, saves: 47, whip: 0.73, k: 74 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Ryan Helsley', team: 'St. Louis Cardinals', stats: { era: 2.04, saves: 49, whip: 0.89, k: 84 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER CLOSER IN 2024?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Clase posted a historically low 0.61 ERA and 0.73 WHIP — one of the most dominant closer seasons ever. Helsley had more saves and strikeouts, but Clase\'s rate stats were otherworldly and he led Cleveland deep into October.',
    blind_rank_players: [
      { name: 'Babe Ruth', team: 'New York Yankees', rankingStat: 714, statLabel: 'Career Home Runs (historical)' },
      { name: 'Hank Aaron', team: 'Atlanta Braves', rankingStat: 755, statLabel: 'Career Home Runs (historical)' },
      { name: 'Willie Mays', team: 'San Francisco Giants', rankingStat: 660, statLabel: 'Career Home Runs (historical)' },
      { name: 'Barry Bonds', team: 'San Francisco Giants', rankingStat: 762, statLabel: 'Career Home Runs (official)' },
      { name: 'Ken Griffey Jr', team: 'Seattle Mariners', rankingStat: 630, statLabel: 'Career Home Runs (historical)' },
    ],
    blind_rank_category: 'RANK BY CONSISTENCY',
    trivia_questions: [
      { question: 'Babe Ruth\'s jersey #3 was the first number retired in Yankees history. In which year?', options: ['1932', '1934', '1948', '1939'], correctIndex: 3, explanation: 'The Yankees retired #3 on June 13, 1948 — a year before Ruth\'s death — in a ceremony at Yankee Stadium.' },
      { question: 'Cal Ripken Jr played how many positions during his Orioles career?', options: ['1 (shortstop only)', '2 (SS and 3B)', '3', '4'], correctIndex: 1, explanation: 'Ripken started at shortstop (his primary position) and moved to third base in 1997 for his final 6 seasons before retirement.' },
      { question: 'Derek Jeter\'s walk-off single in his final home game came against which team?', options: ['Boston Red Sox', 'Tampa Bay Rays', 'Baltimore Orioles', 'Kansas City Royals'], correctIndex: 1, explanation: 'In his final home game at Yankee Stadium (Sept 25, 2014), Jeter singled off David Price of the Rays to walk off with a 6-5 win in the bottom of the 9th.' },
    ],
  },
  // ─── 2026-03-29 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-29', league: 'MLB',
    mystery_player: { name: 'Hank Aaron', team: 'Atlanta Braves', position: 'RF', division: 'NL East', battingHand: 'R', throwingHand: 'R', country: 'USA', age: 91, stats: { avg: .305, hr: 755, rbi: 2297 } },
    showdown_player_a: { name: 'Aaron Judge', team: 'New York Yankees', stats: { avg: .322, hr: 58, rbi: 144, ops: 1.159 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Shohei Ohtani', team: 'Los Angeles Dodgers', stats: { avg: .310, hr: 54, sb: 59, ops: 1.036 }, statLabel: '2024 Season' },
    showdown_category: 'WHO DESERVED THE 2024 MVP MORE?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Judge led in average (.322 vs .310), HR (58 vs 54), RBI (144 vs 130), and OPS (1.159 vs 1.036). Ohtani made history with the 50-50, but Judge\'s raw production was statistically superior in almost every batting category.',
    blind_rank_players: [
      { name: 'Hank Aaron', team: 'Atlanta Braves', rankingStat: 2297, statLabel: 'Career RBI (all-time record)' },
      { name: 'Babe Ruth', team: 'New York Yankees', rankingStat: 2213, statLabel: 'Career RBI' },
      { name: 'Cap Anson', team: 'Chicago White Stockings', rankingStat: 2075, statLabel: 'Career RBI (19th century)' },
      { name: 'Lou Gehrig', team: 'New York Yankees', rankingStat: 1995, statLabel: 'Career RBI' },
      { name: 'Stan Musial', team: 'St. Louis Cardinals', rankingStat: 1951, statLabel: 'Career RBI' },
    ],
    blind_rank_category: 'RANK BY OVERALL GREATNESS',
    trivia_questions: [
      { question: 'Hank Aaron hit home runs off how many Hall of Fame pitchers during his career?', options: ['9', '12', '15', 'None of the above'], correctIndex: 0, explanation: 'Aaron hit home runs off 9 Hall of Fame pitchers — a testament to his longevity and consistency against the game\'s very best.' },
      { question: 'Nolan Ryan was the first pitcher to throw how many strikeouts in a career?', options: ['3,000', '4,000', '5,000', 'All three milestones'], correctIndex: 3, explanation: 'Ryan was the first to reach 3,000, 4,000, and 5,000 career strikeouts — the only pitcher to achieve all three milestones.' },
      { question: 'Randy Johnson\'s perfect game came against which team in 2004?', options: ['Atlanta Braves', 'San Francisco Giants', 'Los Angeles Dodgers', 'Florida Marlins'], correctIndex: 0, explanation: 'Johnson threw a perfect game against the Atlanta Braves on May 18, 2004 at age 40 — one of the oldest pitchers to accomplish the feat.' },
    ],
  },
  // ─── 2026-03-30 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-30', league: 'MLB',
    mystery_player: { name: 'Willie Mays', team: 'San Francisco Giants', position: 'CF', division: 'NL West', battingHand: 'R', throwingHand: 'R', country: 'USA', age: 94, stats: { avg: .302, hr: 660, rbi: 1903 } },
    showdown_player_a: { name: 'William Contreras', team: 'Milwaukee Brewers', stats: { avg: .281, hr: 23, rbi: 89, ops: .825 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Salvador Perez', team: 'Kansas City Royals', stats: { avg: .271, hr: 27, rbi: 104, ops: .800 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER CATCHER IN 2024?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Contreras posted a higher average (.281 vs .271) and OPS (.825 vs .800) while Perez led in HR and RBI. Both were All-Stars, but Contreras\'s bat-to-ball skills gave him the edge in overall offensive value — yet Perez got far more media attention.',
    blind_rank_players: [
      { name: 'Willie Mays', team: 'San Francisco Giants', rankingStat: 338, statLabel: 'Career Stolen Bases' },
      { name: 'Hank Aaron', team: 'Atlanta Braves', rankingStat: 240, statLabel: 'Career Stolen Bases' },
      { name: 'Mickey Mantle', team: 'New York Yankees', rankingStat: 153, statLabel: 'Career Stolen Bases' },
      { name: 'Derek Jeter', team: 'New York Yankees', rankingStat: 358, statLabel: 'Career Stolen Bases' },
      { name: 'Ken Griffey Jr', team: 'Seattle Mariners', rankingStat: 184, statLabel: 'Career Stolen Bases' },
    ],
    blind_rank_category: 'WHO WAS THE MOST FEARED HITTER?',
    trivia_questions: [
      { question: 'Willie Mays made "The Catch" in the 1954 World Series while playing for which team in which stadium?', options: ['Giants at Yankee Stadium', 'Giants at the Polo Grounds', 'Giants at Candlestick Park', 'Giants at Shea Stadium'], correctIndex: 1, explanation: 'The Catch was made at the Polo Grounds in New York City in Game 1 of the 1954 World Series — the last World Series the Giants played in New York.' },
      { question: 'Aaron Judge set the AL single-season HR record with his 62nd HR against which pitcher?', options: ['Nathan Eovaldi', 'Glenn Otto', 'Jon Gray', 'Martín Pérez'], correctIndex: 1, explanation: 'Judge hit his record-breaking 62nd HR off Glenn Otto of the Texas Rangers on October 4, 2022.' },
      { question: 'Vladimir Guerrero Jr\'s father was a Hall of Famer who famously hit a HR off a pitch in the dirt. True or False?', options: ['True', 'False'], correctIndex: 0, explanation: 'Vlad Sr. was famous for his ability to hit pitches literally in the dirt — his hand-eye coordination and bat speed were supernatural.' },
    ],
  },
  // ─── 2026-03-31 ───────────────────────────────────────────────────────────
  {
    date: '2026-03-31', league: 'MLB',
    mystery_player: { name: 'Derek Jeter', team: 'New York Yankees', position: 'SS', division: 'AL East', battingHand: 'R', throwingHand: 'R', country: 'USA', age: 50, stats: { avg: .310, hr: 260, rbi: 1311 } },
    showdown_player_a: { name: 'Hank Aaron', team: 'Atlanta Braves', stats: { career_hr: 755, career_rbi: 2297, career_avg: .305, mvps: 1 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Barry Bonds', team: 'San Francisco Giants', stats: { career_hr: 762, career_obp: .444, career_ops: 1.051, mvps: 7 }, statLabel: 'Career' },
    showdown_category: 'WHO HAD THE GREATER CAREER?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Aaron leads in RBI (2297 vs 1996), batting average (.305 vs .298), and did it cleanly across 23 seasons. Bonds has the HR record and more MVPs, but the PED cloud means Aaron\'s legacy carries more weight in baseball history.',
    blind_rank_players: [
      { name: 'Derek Jeter', team: 'New York Yankees', rankingStat: 3465, statLabel: 'Career Hits' },
      { name: 'Pete Rose', team: 'Cincinnati Reds', rankingStat: 4256, statLabel: 'Career Hits (all-time)' },
      { name: 'Ty Cobb', team: 'Detroit Tigers', rankingStat: 4189, statLabel: 'Career Hits (historical)' },
      { name: 'Hank Aaron', team: 'Atlanta Braves', rankingStat: 3771, statLabel: 'Career Hits' },
      { name: 'Stan Musial', team: 'St. Louis Cardinals', rankingStat: 3630, statLabel: 'Career Hits' },
    ],
    blind_rank_category: 'RANK BY PURE TALENT',
    trivia_questions: [
      { question: 'Derek Jeter won the Roberto Clemente Award in 2009. What does this award recognize?', options: ['Best defensive shortstop', 'Player who best represents baseball through sportsmanship and community involvement', 'Highest batting average in the AL', 'Most clutch performer of the year'], correctIndex: 1, explanation: 'The Roberto Clemente Award honors the MLB player who best represents the game through extraordinary character, community involvement, and positive contributions.' },
      { question: 'Freddie Freeman won the 2020 NL MVP with which team?', options: ['Los Angeles Dodgers', 'Atlanta Braves', 'Boston Red Sox', 'Philadelphia Phillies'], correctIndex: 1, explanation: 'Freeman won the NL MVP in the shortened 2020 season while still with Atlanta, hitting .341 with 13 HRs in 60 games.' },
      { question: 'Trea Turner set a World Series record for hits in a single World Series. Which year?', options: ['2019', '2020', '2021', '2022'], correctIndex: 2, explanation: 'Turner hit .478 (11-for-23) in the 2021 World Series with the Dodgers, setting the record for most hits in a single World Series.' },
    ],
  },
  // ─── 2026-04-01 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-01', league: 'MLB',
    mystery_player: { name: 'Mickey Mantle', team: 'New York Yankees', position: 'CF', division: 'AL East', battingHand: 'S', throwingHand: 'R', country: 'USA', age: 93, stats: { avg: .298, hr: 536, rbi: 1509 } },
    showdown_player_a: { name: 'Jose Ramirez', team: 'Cleveland Guardians', stats: { avg: .279, hr: 39, rbi: 118, sb: 23 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Manny Machado', team: 'San Diego Padres', stats: { avg: .275, hr: 28, rbi: 105, ops: .813 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER THIRD BASEMAN IN 2024?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Ramirez outpaced Machado in HR (39 vs 28), RBI (118 vs 105), and added 23 stolen bases. Despite Machado\'s $350M contract and bigger market, Ramirez was the more productive player at the hot corner in 2024.',
    blind_rank_players: [
      { name: 'Mickey Mantle', team: 'New York Yankees', rankingStat: 536, statLabel: 'Career Home Runs' },
      { name: 'Willie Mays', team: 'San Francisco Giants', rankingStat: 660, statLabel: 'Career Home Runs' },
      { name: 'Hank Aaron', team: 'Atlanta Braves', rankingStat: 755, statLabel: 'Career Home Runs' },
      { name: 'Babe Ruth', team: 'New York Yankees', rankingStat: 714, statLabel: 'Career Home Runs' },
      { name: 'Ted Williams', team: 'Boston Red Sox', rankingStat: 521, statLabel: 'Career Home Runs' },
    ],
    blind_rank_category: 'WHO HAD THE BEST CAREER?',
    trivia_questions: [
      { question: 'Mickey Mantle was a switch-hitter. Which side was his stronger hitting side?', options: ['Left-handed', 'Right-handed', 'Both equal', 'He batted left-handed exclusively vs lefties'], correctIndex: 0, explanation: 'Mantle hit more HRs and had a higher OPS batting left-handed — his left-handed swing was generally considered his more natural and powerful side.' },
      { question: 'Mookie Betts was traded from Boston to Los Angeles in a blockbuster deal. What did the Dodgers give up?', options: ['Alex Verdugo and two prospects', 'Alex Verdugo, Jeter Downs, and Connor Wong', 'Julio Urias and money', 'Three top prospects'], correctIndex: 1, explanation: 'The Dodgers traded Alex Verdugo, Jeter Downs, and Connor Wong to get Betts and David Price from the Red Sox in February 2020.' },
      { question: 'Juan Soto grew up in which country and signed his first MLB contract at age 16?', options: ['Cuba', 'Venezuela', 'Dominican Republic', 'Panama'], correctIndex: 2, explanation: 'Soto is from Santo Domingo, Dominican Republic, where he signed with the Nationals as a 16-year-old international prospect for just $1.5 million.' },
    ],
  },
  // ─── 2026-04-02 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-02', league: 'MLB',
    mystery_player: { name: 'Ted Williams', team: 'Boston Red Sox', position: 'LF', division: 'AL East', battingHand: 'L', throwingHand: 'R', country: 'USA', age: 106, stats: { avg: .344, hr: 521, rbi: 1839 } },
    showdown_player_a: { name: 'Nolan Ryan', team: 'Texas Rangers', stats: { career_k: 5714, career_wins: 324, no_hitters: 7, career_era: 3.19 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Randy Johnson', team: 'Arizona Diamondbacks', stats: { career_k: 4875, career_wins: 303, cy_youngs: 5, career_era: 3.29 }, statLabel: 'Career' },
    showdown_category: 'WHO WAS THE MORE DOMINANT POWER PITCHER?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Johnson won 5 Cy Youngs to Ryan\'s 0, had a World Series MVP, and a lower K/BB ratio. Ryan leads in raw strikeouts (5714 vs 4875) and no-hitters (7 vs 1), but Johnson was more efficient and won more hardware.',
    blind_rank_players: [
      { name: 'Ted Williams', team: 'Boston Red Sox', rankingStat: .344, statLabel: 'Career Batting Average' },
      { name: 'Ty Cobb', team: 'Detroit Tigers', rankingStat: .366, statLabel: 'Career Batting Average (all-time)' },
      { name: 'Rogers Hornsby', team: 'St. Louis Cardinals', rankingStat: .358, statLabel: 'Career Batting Average' },
      { name: 'Babe Ruth', team: 'New York Yankees', rankingStat: .342, statLabel: 'Career Batting Average' },
      { name: 'Willie Keeler', team: 'Brooklyn Superbas', rankingStat: .341, statLabel: 'Career Batting Average (19th century)' },
    ],
    blind_rank_category: 'RANK BY IMPACT ON BASEBALL',
    trivia_questions: [
      { question: 'Ted Williams hit .406 in 1941. In the final day of the season, manager Joe Cronin offered to sit him to protect the average. What did Williams do?', options: ['Sat out', 'Played and went 0-for-2', 'Played a doubleheader and went 6-for-8', 'Played one game and went 4-for-5'], correctIndex: 2, explanation: 'Williams refused to sit and played both games of a doubleheader on the final day, going 6-for-8 to finish at .406 — a legendary act of competitive pride.' },
      { question: 'Yordan Alvarez had an iconic moment in the 2022 ALCS. What was it?', options: ['A walk-off HR in Game 6', 'A 3-run HR off Framber Valdez', 'A walkoff grand slam to eliminate the Yankees in Game 4', 'A 2-run HR in the 9th to tie Game 7'], correctIndex: 2, explanation: 'Alvarez hit a walk-off grand slam in Game 4 of the 2022 ALCS to eliminate the Yankees — one of the most iconic plays in recent Astros history.' },
      { question: 'Freddie Freeman won the 2021 World Series with which team — not the Dodgers?', options: ['Atlanta Braves', 'Boston Red Sox', 'Houston Astros', 'Tampa Bay Rays'], correctIndex: 0, explanation: 'Freeman won the 2021 World Series with the Atlanta Braves before signing with the Dodgers as a free agent in 2022.' },
    ],
  },
  // ─── 2026-04-03 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-03', league: 'MLB',
    mystery_player: { name: 'Cal Ripken Jr', team: 'Baltimore Orioles', position: 'SS', division: 'AL East', battingHand: 'R', throwingHand: 'R', country: 'USA', age: 64, stats: { avg: .276, hr: 431, rbi: 1695 } },
    showdown_player_a: { name: 'Ozzie Albies', team: 'Atlanta Braves', stats: { avg: .251, hr: 19, rbi: 65, sb: 12 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Marcus Semien', team: 'Texas Rangers', stats: { avg: .265, hr: 23, rbi: 72, sb: 16 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER SECOND BASEMAN IN 2024?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Semien outperformed Albies across the board — .265 vs .251 avg, 23 vs 19 HR, 72 vs 65 RBI, and 16 vs 12 SB. While Albies is the bigger name from the Braves dynasty, Semien was the quietly better player in 2024.',
    blind_rank_players: [
      { name: 'Cal Ripken Jr', team: 'Baltimore Orioles', rankingStat: 2632, statLabel: 'Consecutive Games Played (record)' },
      { name: 'Lou Gehrig', team: 'New York Yankees', rankingStat: 2130, statLabel: 'Previous Consecutive Games Record' },
      { name: 'Everett Scott', team: 'New York Yankees', rankingStat: 1307, statLabel: 'Consecutive Games (pre-Gehrig record)' },
      { name: 'Steve Garvey', team: 'San Diego Padres', rankingStat: 1207, statLabel: 'Consecutive Games (NL Record)' },
      { name: 'Joe Sewell', team: 'Cleveland Indians', rankingStat: 1103, statLabel: 'Consecutive Games' },
    ],
    blind_rank_category: 'WHO WOULD YOU WANT AT BAT?',
    trivia_questions: [
      { question: 'Cal Ripken Jr\'s consecutive games streak began in which year?', options: ['1979', '1981', '1982', '1983'], correctIndex: 2, explanation: 'Ripken\'s streak began on May 30, 1982 and ended on September 20, 1998 — 16 years and 2,632 games of not missing a single contest.' },
      { question: 'Shohei Ohtani\'s interpreter Ippei Mizuhara was charged with stealing money from Ohtani to cover gambling debts. How much was stolen?', options: ['$7.8 million', '$12 million', '$17 million', '$22 million'], correctIndex: 3, explanation: 'Mizuhara stole approximately $17 million from Ohtani\'s bank account to cover gambling debts — a scandal that shocked the baseball world in 2024.' },
      { question: 'Mike Trout was drafted by the Angels in which round of the 2009 MLB Draft?', options: ['1st round, 12th pick', '1st round, 25th pick', '2nd round, 58th pick', 'Supplemental 1st round'], correctIndex: 1, explanation: 'Trout was selected 25th overall by the Angels in the first round of the 2009 Draft — one of the best value picks in draft history.' },
    ],
  },
  // ─── 2026-04-04 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-04', league: 'MLB',
    mystery_player: { name: 'Nolan Ryan', team: 'Texas Rangers', position: 'SP', division: 'AL West', battingHand: 'R', throwingHand: 'R', country: 'USA', age: 78, stats: { era: 3.19, wins: 324, k: 5714 } },
    showdown_player_a: { name: 'Tyler Glasnow', team: 'Los Angeles Dodgers', stats: { era: 3.49, k: 168, k_per_9: 11.6, whip: 1.05 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Cole Ragans', team: 'Kansas City Royals', stats: { era: 3.14, k: 223, k_per_9: 11.2, whip: 1.15 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER STRIKEOUT PITCHER IN 2024?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Ragans racked up 223 K with a 3.14 ERA for the Royals, topping Glasnow in strikeouts and ERA. Glasnow had the Dodgers hype and a higher K rate, but Ragans was the unheralded workhorse who quietly became an ace.',
    blind_rank_players: [
      { name: 'Nolan Ryan', team: 'Texas Rangers', rankingStat: 5714, statLabel: 'Career Strikeouts (all-time)' },
      { name: 'Randy Johnson', team: 'Arizona Diamondbacks', rankingStat: 4875, statLabel: 'Career Strikeouts' },
      { name: 'Roger Clemens', team: 'Boston Red Sox', rankingStat: 4672, statLabel: 'Career Strikeouts' },
      { name: 'Steve Carlton', team: 'Philadelphia Phillies', rankingStat: 4136, statLabel: 'Career Strikeouts' },
      { name: 'Bert Blyleven', team: 'Minnesota Twins', rankingStat: 3701, statLabel: 'Career Strikeouts' },
    ],
    blind_rank_category: 'RANK BY CONSISTENCY',
    trivia_questions: [
      { question: 'Nolan Ryan threw his final no-hitter at age 44. Who did he notoriously punch before that season started?', options: ['Robin Ventura', 'Dave Winfield', 'Roger Clemens', 'Bo Jackson'], correctIndex: 0, explanation: 'After Robin Ventura charged the mound in 1993, Ryan — then 46 — put him in a headlock and punched him repeatedly in one of baseball\'s most memorable brawls.' },
      { question: 'Ted Williams\' .406 average in 1941 — what round number does this round to?', options: ['.406', '.407', '.406 (exact)', 'It rounds to .406 — he hit exactly .4057'], correctIndex: 3, explanation: 'Williams actually finished at .4057 — which rounds to .406. He famously went 6-for-8 on the final day to ensure it cleared the .400 mark.' },
      { question: 'Nolan Ryan played for 4 different teams. Which franchise was he with when he became the all-time strikeout leader?', options: ['New York Mets', 'California Angels', 'Houston Astros', 'Texas Rangers'], correctIndex: 2, explanation: 'Ryan broke Walter Johnson\'s all-time strikeout record while pitching for Houston in 1983, surpassing Johnson\'s 3,508 career Ks.' },
    ],
  },
  // ─── 2026-04-05 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-05', league: 'MLB',
    mystery_player: { name: 'Ken Griffey Jr', team: 'Seattle Mariners', position: 'CF', division: 'AL West', battingHand: 'L', throwingHand: 'L', country: 'USA', age: 55, stats: { avg: .284, hr: 630, rbi: 1836 } },
    showdown_player_a: { name: 'Greg Maddux', team: 'Atlanta Braves', stats: { career_era: 3.16, career_wins: 355, cy_youngs: 4, career_whip: 1.14 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Tom Glavine', team: 'Atlanta Braves', stats: { career_era: 3.54, career_wins: 305, cy_youngs: 2, career_whip: 1.31 }, statLabel: 'Career' },
    showdown_category: 'WHO WAS THE BETTER BRAVES ACE?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Maddux leads in ERA (3.16 vs 3.54), wins (355 vs 305), Cy Youngs (4 vs 2), and WHIP (1.14 vs 1.31). Glavine was a Hall of Famer too, but Maddux was the superior pitcher by every measurable standard — the best control artist ever.',
    blind_rank_players: [
      { name: 'Ken Griffey Jr', team: 'Seattle Mariners', rankingStat: 630, statLabel: 'Career Home Runs' },
      { name: 'Mike Trout', team: 'Los Angeles Angels', rankingStat: 368, statLabel: 'Career Home Runs (thru 2024)' },
      { name: 'Albert Pujols', team: 'St. Louis Cardinals', rankingStat: 700, statLabel: 'Career Home Runs' },
      { name: 'Frank Thomas', team: 'Chicago White Sox', rankingStat: 521, statLabel: 'Career Home Runs' },
      { name: 'Reggie Jackson', team: 'New York Yankees', rankingStat: 563, statLabel: 'Career Home Runs' },
    ],
    blind_rank_category: 'RANK BY OVERALL GREATNESS',
    trivia_questions: [
      { question: 'Ken Griffey Jr\'s iconic backward cap became a fashion trend in the 1990s. At which All-Star Game did he wear it?', options: ['1989', '1990', '1991', '1992'], correctIndex: 0, explanation: 'Griffey wore his cap backward during batting practice at the 1989 All-Star Game, sparking a nationwide trend among young baseball fans.' },
      { question: 'Juan Soto signed a record 15-year, $765 million contract with which team before the 2025 season?', options: ['New York Yankees', 'New York Mets', 'Los Angeles Dodgers', 'Philadelphia Phillies'], correctIndex: 1, explanation: 'Soto signed a 15-year, $765 million deal with the Mets after the 2024 season — the largest contract in North American sports history at the time.' },
      { question: 'Mookie Betts was a top amateur bowler as a teenager. What level of competition did he reach?', options: ['State champion', 'National tournament qualifier', 'PBA Tour consideration', 'All three'], correctIndex: 3, explanation: 'Betts bowled 11 perfect games (300) as a teenager, won a youth state championship, and qualified for national tournaments — he was legitimately elite at bowling.' },
    ],
  },
  // ─── 2026-04-06 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-06', league: 'MLB',
    mystery_player: { name: 'Albert Pujols', team: 'St. Louis Cardinals', position: '1B', division: 'NL Central', battingHand: 'R', throwingHand: 'R', country: 'Dominican Republic', age: 45, stats: { avg: .296, hr: 703, rbi: 2218 } },
    showdown_player_a: { name: 'Jarren Duran', team: 'Boston Red Sox', stats: { avg: .285, hr: 21, sb: 29, ops: .823 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Kyle Tucker', team: 'Chicago Cubs', stats: { avg: .289, hr: 19, rbi: 40, ops: .871 }, statLabel: '2024 Season (Injury-Limited)' },
    showdown_category: 'WHO HAD THE BIGGER 2024 BREAKOUT?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Duran earned All-Star MVP honors and posted a full season of .285/21/29 SB for the surging Red Sox. Tucker was hurt, playing just 78 games. Duran had the edge in counting stats and availability — the best ability — while Tucker had the better rate stats in limited action.',
    blind_rank_players: [
      { name: 'Albert Pujols', team: 'St. Louis Cardinals', rankingStat: 700, statLabel: 'Career Home Runs' },
      { name: 'Babe Ruth', team: 'New York Yankees', rankingStat: 714, statLabel: 'Career Home Runs' },
      { name: 'Barry Bonds', team: 'San Francisco Giants', rankingStat: 762, statLabel: 'Career Home Runs (official)' },
      { name: 'Hank Aaron', team: 'Atlanta Braves', rankingStat: 755, statLabel: 'Career Home Runs' },
      { name: 'Ken Griffey Jr', team: 'Seattle Mariners', rankingStat: 630, statLabel: 'Career Home Runs' },
    ],
    blind_rank_category: 'WHO WAS THE MOST FEARED HITTER?',
    trivia_questions: [
      { question: 'Albert Pujols became just the 4th player to hit 700 career HRs. Who was the player he passed (at #4) when he reached 700?', options: ['Babe Ruth', 'Willie Mays', 'Ken Griffey Jr', 'Jim Thome'], correctIndex: 1, explanation: 'Pujols passed Willie Mays (660 HRs) to reach 700 — he finished his career with exactly 700 after the 2022 season.' },
      { question: 'Clayton Kershaw threw a no-hitter in 2014 against which team, then gave up his first hit that same game — false, but what was remarkable?', options: ['He struck out 15 in a no-hitter', 'He almost threw a perfect game but walked one batter', 'He threw a 7-inning no-hitter that doesn\'t count officially', 'He gave up a hit and still won the Cy Young'], correctIndex: 0, explanation: 'Kershaw struck out 15 batters in his June 18, 2014 no-hitter against Colorado — the most strikeouts in a no-hitter since 1968.' },
      { question: 'Albert Pujols won 3 NL MVP awards. In which years?', options: ['2001, 2005, 2008', '2001, 2002, 2003', '2003, 2005, 2008', '2001, 2003, 2008'], correctIndex: 0, explanation: 'Pujols won MVPs in 2001, 2005, and 2008 — three awards in his first decade, establishing him as one of the greatest first basemen ever.' },
    ],
  },
  // ─── 2026-04-07 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-07', league: 'MLB',
    mystery_player: { name: 'Randy Johnson', team: 'Arizona Diamondbacks', position: 'SP', division: 'NL West', battingHand: 'R', throwingHand: 'L', country: 'USA', age: 61, stats: { era: 3.29, wins: 303, k: 4875 } },
    showdown_player_a: { name: 'Derek Jeter', team: 'New York Yankees', stats: { career_hits: 3465, career_avg: .310, ws_rings: 5 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Alex Rodriguez', team: 'New York Yankees', stats: { career_hr: 696, career_rbi: 2086, career_avg: .295 }, statLabel: 'Career' },
    showdown_category: 'WHO WAS THE BETTER YANKEES SHORTSTOP?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'A-Rod leads massively in HR (696 vs 260) and RBI (2086 vs 1311), making him the statistically superior player. Jeter has the rings (5 vs 1) and the clean legacy, but Rodriguez was the better raw talent despite the PED controversy.',
    blind_rank_players: [
      { name: 'Randy Johnson', team: 'Arizona Diamondbacks', rankingStat: 4875, statLabel: 'Career Strikeouts' },
      { name: 'Roger Clemens', team: 'Houston Astros', rankingStat: 4672, statLabel: 'Career Strikeouts' },
      { name: 'Steve Carlton', team: 'Philadelphia Phillies', rankingStat: 4136, statLabel: 'Career Strikeouts' },
      { name: 'Greg Maddux', team: 'Atlanta Braves', rankingStat: 3371, statLabel: 'Career Strikeouts' },
      { name: 'Nolan Ryan', team: 'Texas Rangers', rankingStat: 5714, statLabel: 'Career Strikeouts' },
    ],
    blind_rank_category: 'RANK BY PURE TALENT',
    trivia_questions: [
      { question: 'Randy Johnson hit a bird with a pitch in a spring training game. What year?', options: ['1999', '2000', '2001', '2002'], correctIndex: 2, explanation: 'On March 24, 2001, Johnson\'s fastball struck and exploded a dove mid-pitch during a spring training game — one of baseball\'s most bizarre moments.' },
      { question: 'Fernando Tatis Jr. was drafted by the White Sox and then traded for which veteran pitcher?', options: ['James Shields', 'Chris Sale', 'Jose Quintana', 'David Robertson'], correctIndex: 0, explanation: 'The White Sox traded Tatis Jr. to San Diego in a package for James Shields in 2016 — widely considered one of the worst trades in baseball history.' },
      { question: 'Yordan Alvarez won the 2022 ALCS MVP. How many of the Astros\' wins did he directly impact with homers or clutch hits?', options: ['He had key hits in all 4 wins', 'He hit the walk-off grand slam in Game 4', 'He hit 2 HRs to close out the series', 'He had the walk-off grand slam in Game 4 — the other 3 wins he went combined 0-for-8'], correctIndex: 1, explanation: 'Alvarez\'s walk-off grand slam in Game 4 at Yankee Stadium remains one of the most iconic HR moments of the 2022 postseason.' },
    ],
  },
  // ─── 2026-04-08 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-08', league: 'MLB',
    mystery_player: { name: 'Greg Maddux', team: 'Atlanta Braves', position: 'SP', division: 'NL East', battingHand: 'R', throwingHand: 'R', country: 'USA', age: 59, stats: { era: 3.16, wins: 355, k: 3371 } },
    showdown_player_a: { name: 'Cal Ripken Jr', team: 'Baltimore Orioles', stats: { career_hr: 431, career_avg: .276, career_war: 95.9 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Derek Jeter', team: 'New York Yankees', stats: { career_hr: 260, career_avg: .310, career_war: 72.4 }, statLabel: 'Career' },
    showdown_category: 'WHO WAS THE BETTER ALL-TIME SHORTSTOP?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Ripken leads in HR (431 vs 260), WAR (95.9 vs 72.4), and 2 MVPs vs Jeter\'s 0. Jeter has the rings and the brand, but Ripken was the statistically superior player at the position. It\'s not as close as the narrative suggests.',
    blind_rank_players: [
      { name: 'Greg Maddux', team: 'Atlanta Braves', rankingStat: 18, statLabel: 'Career Gold Gloves (pitcher record)' },
      { name: 'Jim Kaat', team: 'Minnesota Twins', rankingStat: 16, statLabel: 'Career Gold Gloves (pitcher)' },
      { name: 'Bob Gibson', team: 'St. Louis Cardinals', rankingStat: 9, statLabel: 'Career Gold Gloves (pitcher)' },
      { name: 'Sandy Koufax', team: 'Los Angeles Dodgers', rankingStat: 0, statLabel: 'Gold Gloves (focused on pitching)' },
      { name: 'Clayton Kershaw', team: 'Los Angeles Dodgers', rankingStat: 4, statLabel: 'Career Gold Gloves' },
    ],
    blind_rank_category: 'WHO HAD THE BEST CAREER?',
    trivia_questions: [
      { question: 'Greg Maddux won 4 consecutive Cy Young Awards with which two teams?', options: ['Cubs and Braves', 'Braves (all 4)', 'Cubs then Braves', 'Braves then Dodgers'], correctIndex: 2, explanation: 'Maddux won his first Cy Young with the Cubs in 1992, then three more with Atlanta in 1993, 1994, and 1995.' },
      { question: 'Aaron Judge\'s nickname "Judge" — what additional nickname did Yankees fans give him related to his role as a designated HR threat?', options: ['The Gavel', 'All Rise', 'The Verdict', 'Judge Dredd'], correctIndex: 1, explanation: '"All Rise" became the fan chant when Judge came to bat — often displayed on signs and chanted when he approached the plate at Yankee Stadium.' },
      { question: 'Ken Griffey Jr\'s father Ken Griffey Sr. played for the same team at the same time — which team was this?', options: ['Cincinnati Reds', 'Seattle Mariners', 'New York Yankees', 'Atlanta Braves'], correctIndex: 1, explanation: 'Ken Griffey Sr. and Jr. played together for the Seattle Mariners in 1990, becoming the only father-son duo to play for the same team simultaneously.' },
    ],
  },
  // ─── 2026-04-09 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-09', league: 'MLB',
    mystery_player: { name: 'Clayton Kershaw', team: 'Los Angeles Dodgers', position: 'SP', division: 'NL West', battingHand: 'L', throwingHand: 'L', country: 'USA', age: 37, stats: { era: 2.48, wins: 210, k: 2807 } },
    showdown_player_a: { name: 'Gunnar Henderson', team: 'Baltimore Orioles', stats: { avg: .281, hr: 37, rbi: 92, ops: .888 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Corey Seager', team: 'Texas Rangers', stats: { avg: .274, hr: 34, rbi: 103, ops: .852 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER SHORTSTOP IN 2024?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Henderson led in avg (.281 vs .274), HR (37 vs 34), and OPS (.888 vs .852) at age 23 — an emerging superstar who outperformed a $325M World Series MVP. Seager led only in RBI, but Henderson was the better overall bat.',
    blind_rank_players: [
      { name: 'Clayton Kershaw', team: 'Los Angeles Dodgers', rankingStat: 2.48, statLabel: 'Career ERA (thru 2024)' },
      { name: 'Mariano Rivera', team: 'New York Yankees', rankingStat: 2.21, statLabel: 'Career ERA (closer)' },
      { name: 'Sandy Koufax', team: 'Los Angeles Dodgers', rankingStat: 2.76, statLabel: 'Career ERA' },
      { name: 'Whitey Ford', team: 'New York Yankees', rankingStat: 2.75, statLabel: 'Career ERA' },
      { name: 'Greg Maddux', team: 'Atlanta Braves', rankingStat: 3.16, statLabel: 'Career ERA' },
    ],
    blind_rank_category: 'RANK BY IMPACT ON BASEBALL',
    trivia_questions: [
      { question: 'Clayton Kershaw won the NL MVP AND Cy Young in which year — a rare double?', options: ['2011', '2012', '2013', '2014'], correctIndex: 2, explanation: 'Kershaw won both the NL MVP and Cy Young in 2014, one of only 4 pitchers to win both in the same season in modern baseball history.' },
      { question: 'Ronald Acuna Jr\'s 2023 season (41 HR, 73 SB) was the first 40-70 season in MLB history. He was also unanimous NL MVP. True or False?', options: ['True', 'False'], correctIndex: 0, explanation: 'Acuna was indeed the unanimous NL MVP in 2023 — all 30 first-place votes — the first unanimous MVP in NL history since 2014 (Clayton Kershaw).' },
      { question: 'Shohei Ohtani has won how many MVP awards across his career (both leagues) through 2024?', options: ['2', '3', '4', '5'], correctIndex: 1, explanation: 'Ohtani won the AL MVP in 2021 and 2023, then the NL MVP in 2024 — 3 awards in 4 years across both leagues.' },
    ],
  },
  // ─── 2026-04-10 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-10', league: 'MLB',
    mystery_player: { name: 'Pete Rose', team: 'Cincinnati Reds', position: '1B', division: 'NL Central', battingHand: 'S', throwingHand: 'R', country: 'USA', age: 84, stats: { avg: .303, hr: 160, rbi: 1314 } },
    showdown_player_a: { name: 'Yordan Alvarez', team: 'Houston Astros', stats: { avg: .289, hr: 35, rbi: 88, ops: .961 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Vladimir Guerrero Jr', team: 'Toronto Blue Jays', stats: { avg: .323, hr: 30, rbi: 103, ops: .940 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE BETTER HITTER IN 2024?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Vlad Jr led the AL in batting average (.323 vs .289) and had more RBI (103 vs 88). Alvarez had more HR and a higher OPS, but Guerrero\'s average dominance and run production on a weaker Blue Jays team was more impressive.',
    blind_rank_players: [
      { name: 'Pete Rose', team: 'Cincinnati Reds', rankingStat: 4256, statLabel: 'Career Hits (all-time record)' },
      { name: 'Ty Cobb', team: 'Detroit Tigers', rankingStat: 4189, statLabel: 'Career Hits (2nd all-time)' },
      { name: 'Hank Aaron', team: 'Atlanta Braves', rankingStat: 3771, statLabel: 'Career Hits' },
      { name: 'Stan Musial', team: 'St. Louis Cardinals', rankingStat: 3630, statLabel: 'Career Hits' },
      { name: 'Tris Speaker', team: 'Boston Red Sox', rankingStat: 3514, statLabel: 'Career Hits' },
    ],
    blind_rank_category: 'WHO WOULD YOU WANT AT BAT?',
    trivia_questions: [
      { question: 'Pete Rose set the all-time hits record with hit #4,192 against which pitcher?', options: ['Nolan Ryan', 'Eric Show', 'Tom Seaver', 'Mike Scott'], correctIndex: 1, explanation: 'Rose singled off Eric Show of the San Diego Padres on September 11, 1985 to break Ty Cobb\'s record — he broke down crying at first base.' },
      { question: 'Mookie Betts switched from 2B to OF early in his career. What position did he play at originally?', options: ['Third base', 'Shortstop', 'Catcher', 'Second base'], correctIndex: 3, explanation: 'Betts was a second baseman in the minors before the Red Sox moved him to right field, where he became a Gold Glove outfielder.' },
      { question: 'Trea Turner won the World Series with which team in 2019?', options: ['Los Angeles Dodgers', 'Washington Nationals', 'Both (he was traded mid-series)', 'Houston Astros'], correctIndex: 1, explanation: 'Turner was with the Washington Nationals for the 2019 World Series win, though he was later traded to the Dodgers along with Max Scherzer.' },
    ],
  },
  // ─── 2026-04-11 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-11', league: 'MLB',
    mystery_player: { name: 'Mike Schmidt', team: 'Philadelphia Phillies', position: '3B', division: 'NL East', battingHand: 'R', throwingHand: 'R', country: 'USA', age: 75, stats: { avg: .267, hr: 548, rbi: 1595 } },
    showdown_player_a: { name: 'Ken Griffey Jr', team: 'Seattle Mariners', stats: { career_hr: 630, career_avg: .284, gold_gloves: 10 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Albert Pujols', team: 'St. Louis Cardinals', stats: { career_hr: 703, career_avg: .296, mvps: 3 }, statLabel: 'Career' },
    showdown_category: 'WHO HAD THE BETTER CAREER?',
    showdown_correct_answer: 'b',
    showdown_correct_reason: 'Pujols leads in career HR (703 vs 630), batting average (.296 vs .284), and MVPs (3 vs 1). Griffey had the more iconic swing and more Gold Gloves (10 vs 0), but Pujols was the more productive hitter over their respective careers.',
    blind_rank_players: [
      { name: 'Mike Schmidt', team: 'Philadelphia Phillies', rankingStat: 548, statLabel: 'Career Home Runs' },
      { name: 'Harmon Killebrew', team: 'Minnesota Twins', rankingStat: 573, statLabel: 'Career Home Runs' },
      { name: 'Frank Robinson', team: 'Baltimore Orioles', rankingStat: 586, statLabel: 'Career Home Runs' },
      { name: 'Reggie Jackson', team: 'New York Yankees', rankingStat: 563, statLabel: 'Career Home Runs' },
      { name: 'Jim Thome', team: 'Cleveland Indians', rankingStat: 612, statLabel: 'Career Home Runs' },
    ],
    blind_rank_category: 'RANK BY CONSISTENCY',
    trivia_questions: [
      { question: 'Mike Schmidt won the World Series MVP in which year with the Phillies?', options: ['1978', '1980', '1983', '1985'], correctIndex: 1, explanation: 'Schmidt was named World Series MVP in 1980 as the Phillies defeated the Kansas City Royals — it remains the only WS championship in Phillies history.' },
      { question: 'Aaron Judge led the AL in HRs in 2024 with 58. How many times had an AL player hit 58 or more HRs before this?', options: ['Never', 'Once (Maris in 1961 with 61)', 'Twice', 'Three times'], correctIndex: 1, explanation: 'Before Judge\'s 2022 record-breaking season, only Roger Maris (61 in 1961) had hit 58+ HRs in the AL — Judge did it twice in 2022 and 2024.' },
      { question: 'Shohei Ohtani finished 2024 as the first 50-50 player. How many stolen bases did he actually have?', options: ['50', '54', '59', '61'], correctIndex: 2, explanation: 'Ohtani stole 59 bases in 2024 alongside his 54 HRs — a 54-59 season that shattered the previous records for a 50-50 attempt.' },
    ],
  },
  // ─── 2026-04-12 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-12', league: 'MLB',
    mystery_player: { name: 'David Ortiz', team: 'Boston Red Sox', position: 'DH', division: 'AL East', battingHand: 'L', throwingHand: 'L', country: 'Dominican Republic', age: 49, stats: { avg: .286, hr: 541, rbi: 1768 } },
    showdown_player_a: { name: 'Ryan Mountcastle', team: 'Baltimore Orioles', stats: { avg: .271, hr: 23, rbi: 83, ops: .790 }, statLabel: '2024 Season' },
    showdown_player_b: { name: 'Pete Alonso', team: 'New York Mets', stats: { avg: .240, hr: 34, rbi: 88, ops: .788 }, statLabel: '2024 Season' },
    showdown_category: 'WHO WAS THE MORE PRODUCTIVE FIRST BASEMAN IN 2024?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Mountcastle hit .271 vs Alonso\'s .240, with nearly identical OPS (.790 vs .788). Alonso hit more homers but was far less consistent at the plate. Mountcastle matched his production at a fraction of the name recognition — the Polar Bear\'s power wasn\'t enough to offset his average.',
    blind_rank_players: [
      { name: 'David Ortiz', team: 'Boston Red Sox', rankingStat: 541, statLabel: 'Career Home Runs' },
      { name: 'Frank Thomas', team: 'Chicago White Sox', rankingStat: 521, statLabel: 'Career Home Runs' },
      { name: 'Ted Williams', team: 'Boston Red Sox', rankingStat: 521, statLabel: 'Career Home Runs' },
      { name: 'Albert Pujols', team: 'St. Louis Cardinals', rankingStat: 700, statLabel: 'Career Home Runs' },
      { name: 'Carlos Delgado', team: 'Toronto Blue Jays', rankingStat: 473, statLabel: 'Career Home Runs' },
    ],
    blind_rank_category: 'RANK BY OVERALL GREATNESS',
    trivia_questions: [
      { question: 'David Ortiz\'s most iconic postseason moment came in the 2004 ALCS. What happened?', options: ['He hit a walk-off HR to end the series against the Yankees', 'He had walk-off hits in consecutive games to spark the comeback from 3-0', 'He hit 2 grand slams in the same game', 'He hit a 3-run HR in the 9th of Game 7'], correctIndex: 1, explanation: 'Ortiz had walk-off singles/HRs in Games 4 and 5 as the Red Sox became the first team to overcome a 3-0 series deficit, then swept the Cardinals in the World Series.' },
      { question: 'Sandy Koufax\'s 4 no-hitters — how many were perfect games?', options: ['0', '1', '2', '3'], correctIndex: 1, explanation: 'Koufax threw a perfect game on September 9, 1965 against the Cubs — striking out 14 batters. It was his 4th and final no-hitter.' },
      { question: 'Randy Johnson famously struck out whom to win the 2001 World Series for Arizona?', options: ['Derek Jeter', 'Scott Brosius', 'Jorge Posada', 'Luis Sojo hit a single; Johnson did not get the final out'], correctIndex: 3, explanation: 'Mariano Rivera gave up a bloop single to Luis Gonzalez in Game 7 — Johnson won Games 3 and 6 but did not get the final out of the Series.' },
    ],
  },
  // ─── 2026-04-13 ───────────────────────────────────────────────────────────
  {
    date: '2026-04-13', league: 'MLB',
    mystery_player: { name: 'Frank Thomas', team: 'Chicago White Sox', position: '1B', division: 'AL Central', battingHand: 'R', throwingHand: 'R', country: 'USA', age: 57, stats: { avg: .301, hr: 521, rbi: 1704 } },
    showdown_player_a: { name: 'Clayton Kershaw', team: 'Los Angeles Dodgers', stats: { career_era: 2.48, career_wins: 210, cy_youngs: 3, career_whip: 1.00 }, statLabel: 'Career' },
    showdown_player_b: { name: 'Justin Verlander', team: 'Houston Astros', stats: { career_era: 3.30, career_wins: 262, cy_youngs: 3, career_k: 3416 }, statLabel: 'Career' },
    showdown_category: 'WHO IS THE BETTER PITCHER OF THEIR GENERATION?',
    showdown_correct_answer: 'a',
    showdown_correct_reason: 'Kershaw has a vastly better career ERA (2.48 vs 3.30) and WHIP (1.00 vs 1.18). Verlander leads in wins (262 vs 210) and strikeouts (3416 vs 2807) due to longevity and health. Peak for peak, Kershaw was more dominant; career for career, Verlander was more durable.',
    blind_rank_players: [
      { name: 'Frank Thomas', team: 'Chicago White Sox', rankingStat: .419, statLabel: 'Career On-Base Pct' },
      { name: 'Ted Williams', team: 'Boston Red Sox', rankingStat: .482, statLabel: 'Career On-Base Pct (all-time)' },
      { name: 'Babe Ruth', team: 'New York Yankees', rankingStat: .474, statLabel: 'Career On-Base Pct' },
      { name: 'John McGraw', team: 'Baltimore Orioles', rankingStat: .466, statLabel: 'Career On-Base Pct (19th century)' },
      { name: 'Billy Hamilton', team: 'Cincinnati Reds', rankingStat: .455, statLabel: 'Career On-Base Pct (19th century)' },
    ],
    blind_rank_category: 'WHO WAS THE MOST FEARED HITTER?',
    trivia_questions: [
      { question: 'Frank Thomas won back-to-back AL MVPs in which years — making him one of three players to do it?', options: ['1992 and 1993', '1993 and 1994', '1994 and 1995', '1995 and 1996'], correctIndex: 1, explanation: 'Thomas won consecutive AL MVPs in 1993 and 1994, joining Jimmie Foxx and Mickey Mantle as the only AL players to win back-to-back MVP awards.' },
      { question: 'Shohei Ohtani\'s 54 HR / 59 SB season in 2024 — what was the previous single-season record for stolen bases AND home runs in the same season?', options: ['Barry Bonds 45 HR / 40 SB (2004)', 'Rickey Henderson 28 HR / 66 SB (1986)', 'Ronald Acuna Jr 41 HR / 73 SB (2023)', 'Alfonso Soriano 46 HR / 41 SB (2006)'], correctIndex: 2, explanation: 'Acuna\'s 2023 season (41 HR / 73 SB) was the previous benchmark, though the official 50-50 milestone had never been reached before Ohtani in 2024.' },
      { question: 'Babe Ruth\'s record of 60 HRs in a season (1927) stood for how many years?', options: ['27', '34', '42', '52'], correctIndex: 1, explanation: 'Ruth\'s 60 HR record stood from 1927 to 1961 — 34 years — when Roger Maris broke it with 61 HRs in a 162-game season.' },
    ],
  },
]

async function seed() {
  console.log(`Seeding ${games.length} MLB daily games...`)

  for (const game of games) {
    const { error } = await supabase
      .from('daily_games')
      .upsert(game, { onConflict: 'date,league' })

    if (error) {
      console.error(`Error seeding ${game.date} ${game.league}:`, error.message)
    } else {
      console.log(`✓ ${game.date} MLB`)
    }
  }

  console.log('Done!')
}

seed()
