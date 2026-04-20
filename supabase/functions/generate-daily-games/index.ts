/**
 * generate-daily-games Edge Function
 *
 * Generates daily game content for all 4 leagues for a given date.
 * - Called automatically by pg_cron at midnight ET (05:00 UTC) each night (generating tomorrow's games).
 * - Can also be called manually via HTTP POST for backfilling.
 *
 * POST body (optional):
 *   { "date": "2026-03-21" }   — generate for a specific date
 *   {}                          — generate for tomorrow ET (default)
 *
 * Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
 *
 * Idempotent — safe to call multiple times for the same date (skips existing rows).
 * Deterministic — same date + league always produces the same player picks,
 * so every user sees identical games.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ── Supabase client (service role) ────────────────────────────────────────────

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

// ── Date helpers ──────────────────────────────────────────────────────────────

function getDateEST(offsetDays = 0): string {
  const now = new Date()
  now.setDate(now.getDate() + offsetDays)
  const estString = now.toLocaleString('en-US', { timeZone: 'America/New_York' })
  const estDate = new Date(estString)
  const y = estDate.getFullYear()
  const m = String(estDate.getMonth() + 1).padStart(2, '0')
  const d = String(estDate.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// ── Seeded PRNG (mulberry32) — deterministic for same seed ────────────────────

function makePRNG(seed: number) {
  let s = seed
  return function rand(): number {
    s = (s + 0x6D2B79F5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function dateLeagueSeed(date: string, league: string): number {
  const str = date + '|' + league
  let hash = 2166136261
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = (hash * 16777619) >>> 0
  }
  return hash
}

function seededShuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Blind rank categories (cycling) ──────────────────────────────────────────

const BLIND_RANK_CATEGORIES: Record<string, string[]> = {
  NBA: [
    'RANK BY PPG THIS SEASON',
    'RANK BY OVERALL IMPACT',
    'WHO WOULD YOU BUILD AROUND?',
    'RANK BY PLAYOFF PEDIGREE',
    'RANK BY FANTASY VALUE',
    'WHO IS THE BETTER SCORER?',
    'RANK BY TWO-WAY ABILITY',
  ],
  NFL: [
    'RANK BY 2024 SEASON PERFORMANCE',
    'RANK BY OVERALL GREATNESS',
    'WHO WOULD YOU FRANCHISE?',
    'RANK BY SUPER BOWL IMPACT',
    'RANK BY FANTASY VALUE',
    'WHO IS THE BETTER PLAYMAKER?',
  ],
  MLB: [
    'RANK BY 2024 SEASON STATS',
    'RANK BY OVERALL GREATNESS',
    'WHO WOULD YOU BUILD AROUND?',
    'RANK BY POSTSEASON IMPACT',
    'RANK BY FANTASY VALUE',
    'WHO IS THE BETTER HITTER?',
  ],
  NHL: [
    'RANK BY 2024-25 POINTS',
    'RANK BY OVERALL GREATNESS',
    'WHO WOULD YOU BUILD AROUND?',
    'RANK BY PLAYOFF IMPACT',
    'RANK BY FANTASY VALUE',
    'WHO IS THE BETTER TWO-WAY PLAYER?',
  ],
}

const SHOWDOWN_CATEGORIES: Record<string, string[]> = {
  NBA: [
    'WHO IS THE BETTER PLAYER RIGHT NOW?',
    'WHO WOULD YOU WANT IN A MUST-WIN GAME?',
    'WHO HAS THE HIGHER CEILING?',
    'WHO WOULD YOU TAKE FOR THE NEXT 5 YEARS?',
  ],
  NFL: [
    'WHO IS THE BETTER PLAYER RIGHT NOW?',
    'WHO WOULD YOU WANT IN A PLAYOFF GAME?',
    'WHO HAS THE HIGHER CEILING?',
    'WHO WOULD YOU TAKE FOR THE NEXT 3 YEARS?',
  ],
  MLB: [
    'WHO IS THE BETTER PLAYER RIGHT NOW?',
    'WHO WOULD YOU WANT IN THE WORLD SERIES?',
    'WHO HAS THE HIGHER CEILING?',
    'WHO IS THE MORE COMPLETE PLAYER?',
  ],
  NHL: [
    'WHO IS THE BETTER PLAYER RIGHT NOW?',
    'WHO WOULD YOU WANT IN THE PLAYOFFS?',
    'WHO HAS THE HIGHER CEILING?',
    'WHO IS THE MORE COMPLETE PLAYER?',
  ],
}

// ── Trivia question banks ─────────────────────────────────────────────────────

const TRIVIA_BANKS: Record<string, Array<{ question: string; options: string[]; correctIndex: number; explanation: string }>> = {
  NBA: [
    { question: 'How many NBA Championships has LeBron James won?', options: ['2', '3', '4', '5'], correctIndex: 2, explanation: 'LeBron has won 4 championships: 2012, 2013 with Miami, 2016 with Cleveland, and 2020 with the Lakers.' },
    { question: 'Who holds the NBA all-time scoring record?', options: ['Kareem Abdul-Jabbar', 'Karl Malone', 'LeBron James', 'Kobe Bryant'], correctIndex: 2, explanation: 'LeBron James surpassed Kareem Abdul-Jabbar on February 7, 2023 to become the NBA all-time leading scorer.' },
    { question: 'Stephen Curry plays for which NBA team?', options: ['Los Angeles Lakers', 'Golden State Warriors', 'Sacramento Kings', 'Phoenix Suns'], correctIndex: 1, explanation: 'Stephen Curry has spent his entire career with the Golden State Warriors, where he has won four championships.' },
    { question: 'Nikola Jokic was drafted with which overall pick in 2014?', options: ['15th', '27th', '41st', '52nd'], correctIndex: 2, explanation: 'Jokic was a steal at 41st overall — one of the greatest late picks in draft history, winning 3 MVPs.' },
    { question: 'Which team did Kevin Durant NOT play for?', options: ['Oklahoma City Thunder', 'Golden State Warriors', 'Chicago Bulls', 'Brooklyn Nets'], correctIndex: 2, explanation: 'KD played for OKC, Golden State (2 titles), Brooklyn, and Phoenix. He never played for the Bulls.' },
    { question: 'Giannis Antetokounmpo is from which country?', options: ['Nigeria', 'Greece', 'Cameroon', 'DR Congo'], correctIndex: 1, explanation: 'Giannis was born in Athens, Greece to Nigerian parents.' },
    { question: 'Which year did the Golden State Warriors win their first championship of the dynasty era?', options: ['2013', '2014', '2015', '2016'], correctIndex: 2, explanation: 'The Warriors won in 2015, then again in 2017, 2018, and 2022.' },
    { question: 'Victor Wembanyama was selected with which pick in the 2023 NBA Draft?', options: ['1st', '2nd', '3rd', '4th'], correctIndex: 0, explanation: 'Wembanyama was the consensus #1 pick, selected by the San Antonio Spurs.' },
    { question: 'Luka Doncic was traded to which team mid-season in 2025?', options: ['Los Angeles Clippers', 'Los Angeles Lakers', 'Golden State Warriors', 'Miami Heat'], correctIndex: 1, explanation: 'Luka Doncic was traded from the Dallas Mavericks to the Los Angeles Lakers in January 2025.' },
    { question: 'How many MVP awards has Nikola Jokic won as of 2025?', options: ['1', '2', '3', '4'], correctIndex: 2, explanation: 'Jokic won the MVP in 2021, 2022, and 2024 — three in four years.' },
    { question: 'Which player is known as "The Greek Freak"?', options: ['Luka Doncic', 'Nikola Jokic', 'Giannis Antetokounmpo', 'Kristaps Porzingis'], correctIndex: 2, explanation: 'Giannis earned the nickname for his unique combination of size, speed, and ball-handling.' },
    { question: 'Who was selected 1st overall in the 1996 NBA Draft?', options: ['Kobe Bryant', 'Ray Allen', 'Allen Iverson', 'Marcus Camby'], correctIndex: 2, explanation: 'Allen Iverson was selected 1st overall by the Philadelphia 76ers in the 1996 NBA Draft.' },
    { question: 'Jayson Tatum played college basketball at which school?', options: ['Kentucky', 'Duke', 'Kansas', 'North Carolina'], correctIndex: 1, explanation: 'Tatum played one season at Duke under Coach K before being drafted 3rd overall by Boston in 2017.' },
    { question: 'What is the NBA record for most 3-pointers made in a single game?', options: ['11', '12', '14', '13'], correctIndex: 2, explanation: 'Klay Thompson set the record with 14 three-pointers in a single game against the Bulls in 2016.' },
    { question: 'Which NBA player has the most career triple-doubles?', options: ['Magic Johnson', 'Jason Kidd', 'Russell Westbrook', 'Oscar Robertson'], correctIndex: 2, explanation: 'Russell Westbrook holds the all-time triple-double record with 199, surpassing Oscar Robertson\'s long-standing mark.' },
  ],
  NFL: [
    { question: 'How many Super Bowls has Patrick Mahomes won as of 2025?', options: ['1', '2', '3', '4'], correctIndex: 2, explanation: 'Mahomes has won 3 Super Bowls with the Kansas City Chiefs: LIV, LVII, and LVIII.' },
    { question: 'Tom Brady won how many Super Bowl rings in his career?', options: ['5', '6', '7', '8'], correctIndex: 2, explanation: 'Brady won 7 Super Bowls: 6 with the New England Patriots and 1 with the Tampa Bay Buccaneers.' },
    { question: 'Which team did Joe Burrow win a Heisman Trophy with?', options: ['Cincinnati Bengals', 'Ohio State', 'LSU', 'Georgia'], correctIndex: 2, explanation: 'Burrow won the 2019 Heisman Trophy at LSU, setting the single-season TD record in college football.' },
    { question: 'Lamar Jackson plays for which NFL team?', options: ['Cleveland Browns', 'Pittsburgh Steelers', 'Baltimore Ravens', 'Cincinnati Bengals'], correctIndex: 2, explanation: 'Lamar Jackson was drafted by the Baltimore Ravens in 2018 and has been their franchise QB since.' },
    { question: 'Who holds the NFL all-time rushing yards record?', options: ['Emmitt Smith', 'Walter Payton', 'Barry Sanders', 'Frank Gore'], correctIndex: 0, explanation: 'Emmitt Smith retired with 18,355 career rushing yards, a record that still stands.' },
    { question: 'Which wide receiver holds the single-season receiving yards record?', options: ['Jerry Rice', 'Randy Moss', 'Calvin Johnson', 'Julio Jones'], correctIndex: 2, explanation: 'Calvin Johnson ("Megatron") set the single-season receiving yards record with 1,964 yards in 2012.' },
    { question: 'Josh Allen plays for which NFL team?', options: ['Miami Dolphins', 'New England Patriots', 'New York Jets', 'Buffalo Bills'], correctIndex: 3, explanation: 'Josh Allen was drafted 7th overall by the Buffalo Bills in 2018 and has led them to multiple playoff appearances.' },
    { question: 'CeeDee Lamb plays for which NFL team?', options: ['Los Angeles Rams', 'San Francisco 49ers', 'Dallas Cowboys', 'Green Bay Packers'], correctIndex: 2, explanation: 'CeeDee Lamb was drafted 17th overall by the Dallas Cowboys in 2020 and became their top receiver.' },
    { question: 'How many receiving yards did Ja\'Marr Chase record in the 2024 season?', options: ['1,510', '1,612', '1,708', '1,823'], correctIndex: 2, explanation: 'Ja\'Marr Chase had 1,708 receiving yards in 2024, leading the NFL and setting a Cincinnati Bengals franchise record.' },
    { question: 'Which team won Super Bowl LVIII in Las Vegas?', options: ['San Francisco 49ers', 'Kansas City Chiefs', 'Baltimore Ravens', 'Detroit Lions'], correctIndex: 1, explanation: 'The Kansas City Chiefs defeated the San Francisco 49ers 25-22 in overtime in Super Bowl LVIII.' },
    { question: 'Jalen Hurts plays for which NFL team?', options: ['Dallas Cowboys', 'New York Giants', 'Washington Commanders', 'Philadelphia Eagles'], correctIndex: 3, explanation: 'Jalen Hurts was drafted 53rd overall by the Philadelphia Eagles in 2020 and became their starter in 2021.' },
    { question: 'Which quarterback has the most career passing touchdowns?', options: ['Peyton Manning', 'Tom Brady', 'Drew Brees', 'Brett Favre'], correctIndex: 1, explanation: 'Tom Brady holds the record with 649 career passing touchdowns, the most in NFL history.' },
    { question: 'Which college did Justin Jefferson attend?', options: ['Alabama', 'Ohio State', 'LSU', 'Clemson'], correctIndex: 2, explanation: 'Justin Jefferson played at LSU alongside Joe Burrow during their 2019 national championship season.' },
    { question: 'What position does Micah Parsons play?', options: ['Safety', 'Linebacker', 'Cornerback', 'Defensive End'], correctIndex: 1, explanation: 'Micah Parsons is a versatile linebacker for the Dallas Cowboys, known for his elite pass-rushing ability.' },
    { question: 'Which two teams are tied for the most Super Bowl wins in NFL history?', options: ['Cowboys & 49ers', 'Packers & Giants', 'Patriots & Steelers', 'Patriots & Cowboys'], correctIndex: 2, explanation: 'The New England Patriots and Pittsburgh Steelers are tied with 6 Super Bowl wins each, the most in NFL history.' },
  ],
  MLB: [
    { question: 'Shohei Ohtani plays for which MLB team?', options: ['Los Angeles Angels', 'New York Yankees', 'Los Angeles Dodgers', 'Toronto Blue Jays'], correctIndex: 2, explanation: 'Ohtani signed a record $700 million contract with the Dodgers ahead of the 2024 season.' },
    { question: 'How many home runs did Aaron Judge hit in the 2022 regular season?', options: ['54', '57', '60', '62'], correctIndex: 3, explanation: 'Judge hit 62 home runs in 2022, breaking the American League record set by Roger Maris in 1961.' },
    { question: 'Ted Williams famously hit .406 in which year?', options: ['1939', '1940', '1941', '1942'], correctIndex: 2, explanation: 'Williams hit .406 in 1941, the last time any player batted .400 or better in a full season.' },
    { question: 'Which pitcher holds the record for most career strikeouts?', options: ['Randy Johnson', 'Roger Clemens', 'Nolan Ryan', 'Pedro Martinez'], correctIndex: 2, explanation: 'Nolan Ryan struck out 5,714 batters in his career, a record that still stands today.' },
    { question: 'Freddie Freeman plays for which MLB team?', options: ['Atlanta Braves', 'Boston Red Sox', 'Los Angeles Dodgers', 'New York Mets'], correctIndex: 2, explanation: 'Freeman signed with the Dodgers in 2022 and won a World Series with them in 2024.' },
    { question: 'Juan Soto plays for which MLB team?', options: ['Washington Nationals', 'San Diego Padres', 'New York Mets', 'New York Yankees'], correctIndex: 2, explanation: 'Soto signed a record $765 million deal with the New York Mets ahead of the 2025 season.' },
    { question: 'Which team did the Dodgers defeat in the 2024 World Series?', options: ['New York Yankees', 'Houston Astros', 'Philadelphia Phillies', 'San Diego Padres'], correctIndex: 0, explanation: 'The Dodgers beat the Yankees in 5 games, with Freddie Freeman hitting a walk-off grand slam in Game 1.' },
    { question: 'Barry Bonds holds the single-season home run record with how many?', options: ['61', '70', '73', '75'], correctIndex: 2, explanation: 'Barry Bonds hit 73 home runs in the 2001 season, breaking Mark McGwire\'s record of 70 set in 1998.' },
    { question: 'Which pitcher won the 2024 NL Cy Young Award?', options: ['Zack Wheeler', 'Paul Skenes', 'Chris Sale', 'Corbin Burnes'], correctIndex: 2, explanation: 'Chris Sale won the 2024 NL Cy Young Award with the Atlanta Braves, returning to dominance at age 35.' },
    { question: 'Gerrit Cole pitches for which MLB team?', options: ['Pittsburgh Pirates', 'Houston Astros', 'Los Angeles Dodgers', 'New York Yankees'], correctIndex: 3, explanation: 'Cole signed a 9-year, $324 million deal with the Yankees in 2019, the largest ever for a pitcher at the time.' },
    { question: 'Which player won the 2024 World Series MVP?', options: ['Freddie Freeman', 'Mookie Betts', 'Shohei Ohtani', 'Walker Buehler'], correctIndex: 0, explanation: 'Freddie Freeman hit .400 with 4 HR and 12 RBI in the series, including the legendary walk-off grand slam in Game 1.' },
    { question: 'Who holds the record for most career hits in MLB history?', options: ['Ty Cobb', 'Pete Rose', 'Hank Aaron', 'Stan Musial'], correctIndex: 1, explanation: 'Pete Rose had 4,256 career hits, though he was banned from baseball for gambling.' },
    { question: 'Yordan Alvarez plays for which MLB team?', options: ['Miami Marlins', 'Houston Astros', 'Oakland Athletics', 'Texas Rangers'], correctIndex: 1, explanation: 'Yordan Alvarez has been the Astros\' designated hitter/outfielder since 2019 and won the 2022 World Series MVP.' },
    { question: 'Which Braves pitcher struck out 281 batters in 2023 before suffering an elbow injury?', options: ['Spencer Strider', 'Max Fried', 'Charlie Morton', 'Kyle Wright'], correctIndex: 0, explanation: 'Spencer Strider struck out 281 batters in 2023 for the Braves before undergoing UCL surgery in 2024.' },
    { question: 'Which team has won the most World Series titles?', options: ['Boston Red Sox', 'Los Angeles Dodgers', 'New York Yankees', 'Oakland Athletics'], correctIndex: 2, explanation: 'The New York Yankees have won 27 World Series titles, far more than any other franchise.' },
  ],
  NHL: [
    { question: 'Connor McDavid plays for which NHL team?', options: ['Toronto Maple Leafs', 'Calgary Flames', 'Edmonton Oilers', 'Ottawa Senators'], correctIndex: 2, explanation: 'McDavid has played his entire career with the Edmonton Oilers since being drafted 1st overall in 2015.' },
    { question: 'Who holds the NHL record for most career goals?', options: ['Mario Lemieux', 'Jaromir Jagr', 'Wayne Gretzky', 'Brett Hull'], correctIndex: 2, explanation: 'Wayne Gretzky scored 894 career goals, the most in NHL history by a wide margin.' },
    { question: 'Which team won the 2024 Stanley Cup?', options: ['Florida Panthers', 'Edmonton Oilers', 'New York Rangers', 'Vancouver Canucks'], correctIndex: 0, explanation: 'The Florida Panthers defeated the Edmonton Oilers in 7 games to win their first Stanley Cup in franchise history.' },
    { question: 'Nathan MacKinnon plays for which NHL team?', options: ['Montreal Canadiens', 'Minnesota Wild', 'Colorado Avalanche', 'Pittsburgh Penguins'], correctIndex: 2, explanation: 'MacKinnon was drafted 1st overall by Colorado in 2013 and won the Stanley Cup with them in 2022.' },
    { question: 'Which goalie holds the NHL record for career wins?', options: ['Patrick Roy', 'Martin Brodeur', 'Dominik Hasek', 'Henrik Lundqvist'], correctIndex: 1, explanation: 'Martin Brodeur won 691 games in his career, a record that still stands. He won 3 Stanley Cups with New Jersey.' },
    { question: 'Auston Matthews plays for which NHL team?', options: ['Boston Bruins', 'Pittsburgh Penguins', 'Toronto Maple Leafs', 'Detroit Red Wings'], correctIndex: 2, explanation: 'Matthews was drafted 1st overall by Toronto in 2016 and won the Hart Trophy (MVP) in 2022 and 2024.' },
    { question: 'Which country does Nikita Kucherov represent?', options: ['Finland', 'Sweden', 'Czech Republic', 'Russia'], correctIndex: 3, explanation: 'Kucherov is from Russia and has won two Stanley Cups with the Tampa Bay Lightning (2020, 2021).' },
    { question: 'How many points did Wayne Gretzky score in the 1981-82 season?', options: ['192', '199', '212', '215'], correctIndex: 2, explanation: 'Gretzky scored 212 points in 1981-82, a record that will likely never be broken.' },
    { question: 'David Pastrnak plays for which NHL team?', options: ['Pittsburgh Penguins', 'Boston Bruins', 'Colorado Avalanche', 'Tampa Bay Lightning'], correctIndex: 1, explanation: 'Pastrnak has been the Bruins\' top scorer since being drafted 25th overall in 2014.' },
    { question: 'Which NHL team has won the most Stanley Cups?', options: ['Montreal Canadiens', 'Toronto Maple Leafs', 'Detroit Red Wings', 'Boston Bruins'], correctIndex: 0, explanation: 'The Montreal Canadiens have won 24 Stanley Cups, more than any other franchise in NHL history.' },
    { question: 'Cale Makar plays for which NHL team?', options: ['Calgary Flames', 'Colorado Avalanche', 'Nashville Predators', 'Minnesota Wild'], correctIndex: 1, explanation: 'Makar was drafted 4th overall by Colorado in 2019 and won the Norris Trophy (best defenseman) and Conn Smythe in 2022.' },
    { question: 'What is the record for most goals scored by a team in a single NHL season?', options: ['397', '401', '426', '446'], correctIndex: 3, explanation: 'The 1983-84 Edmonton Oilers scored 446 goals in a single season, led by Wayne Gretzky\'s 87 goals.' },
    { question: 'Which position does Quinn Hughes play?', options: ['Center', 'Left Wing', 'Defenseman', 'Goalie'], correctIndex: 2, explanation: 'Quinn Hughes is an offensive defenseman for the Vancouver Canucks, winning the Norris Trophy in 2024.' },
    { question: 'Sidney Crosby has won how many Stanley Cups?', options: ['1', '2', '3', '4'], correctIndex: 2, explanation: 'Crosby won the Cup in 2009, 2016, and 2017 with the Pittsburgh Penguins, earning two Conn Smythe trophies.' },
    { question: 'Which team did the Florida Panthers defeat to win the 2024 Stanley Cup?', options: ['New York Rangers', 'Boston Bruins', 'Edmonton Oilers', 'Vancouver Canucks'], correctIndex: 2, explanation: 'The Panthers defeated the Oilers in 7 games, completing a comeback after being down 3-0 in the series.' },
  ],
}

// ── Main generation function ──────────────────────────────────────────────────

async function generateGameForDate(date: string, league: string): Promise<{ status: string }> {
  // Check if already exists
  const { data: existing } = await supabaseAdmin
    .from('daily_games')
    .select('id')
    .eq('date', date)
    .eq('league', league)
    .maybeSingle()

  if (existing) {
    return { status: 'already_exists' }
  }

  // Fetch player pool — only active players, never retired
  const { data: players, error } = await supabaseAdmin
    .from('players_pool')
    .select('id, name, team, position, tier, status')
    .eq('league', league)
    .eq('status', 'active')
    .in('tier', ['normal', 'ball_knowledge'])

  if (error || !players?.length) {
    console.error(`No players for ${league}:`, error?.message)
    return { status: 'no_players' }
  }

  // Fetch recently used mystery players (last 60 days) to prevent repeats
  const { data: recentGames } = await supabaseAdmin
    .from('daily_games')
    .select('mystery_player')
    .eq('league', league)
    .gte('date', new Date(new Date(date).getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))
    .lt('date', date)

  const recentNames = new Set<string>()
  if (recentGames) {
    for (const g of recentGames) {
      if (g.mystery_player?.name) recentNames.add(g.mystery_player.name)
    }
  }

  const rand = makePRNG(dateLeagueSeed(date, league))
  const shuffled = seededShuffle(players, rand)

  // Filter out recently used players for mystery player selection
  const availableForMystery = shuffled.filter(p => !recentNames.has(p.name))
  const mysteryPool = availableForMystery.length > 0 ? availableForMystery : shuffled

  // Mystery player — first available non-repeat
  const mysteryRaw = mysteryPool[0]
  const mysteryPlayer = {
    name: mysteryRaw.name,
    team: mysteryRaw.team,
    position: mysteryRaw.position,
  }

  // Remaining players for other games (exclude mystery player)
  const remaining = shuffled.filter(p => p.name !== mysteryRaw.name)

  // Blind rank 5 — next 5
  const blindRankPlayers = remaining.slice(0, 5).map(p => ({
    name: p.name,
    team: p.team,
  }))

  // Blind rank category — deterministic pick
  const categories = BLIND_RANK_CATEGORIES[league] ?? ['RANK BY OVERALL GREATNESS']
  const categoryIdx = Math.floor(rand() * categories.length)
  const blindRankCategory = categories[categoryIdx]

  // Showdown — next 2 after rank 5
  const showdownA = remaining[5]
  const showdownB = remaining[6]
  const showCategories = SHOWDOWN_CATEGORIES[league] ?? ['WHO IS THE BETTER PLAYER?']
  const showCategoryIdx = Math.floor(rand() * showCategories.length)

  // Ladder — pick 1 question per tier (5 total), prefer unused questions
  const TIERS = ['100%', '75%', '50%', '25%', '1%']
  const triviaQuestions: any[] = []

  for (const tier of TIERS) {
    // Fetch unused questions for this tier first, fall back to any
    const { data: tierQs } = await supabaseAdmin
      .from('trivia_questions_bank')
      .select('id, question, options, correct_index, answer, explanation, tier')
      .eq('league', league)
      .eq('active', true)
      .eq('tier', tier)
      .is('last_used_date', null)
      .limit(10)

    let pool = tierQs ?? []
    // If no unused questions, get any question for this tier
    if (pool.length === 0) {
      const { data: anyQs } = await supabaseAdmin
        .from('trivia_questions_bank')
        .select('id, question, options, correct_index, answer, explanation, tier')
        .eq('league', league)
        .eq('active', true)
        .eq('tier', tier)
        .order('last_used_date', { ascending: true, nullsFirst: true })
        .limit(10)
      pool = anyQs ?? []
    }

    // Fall back to old-style questions if no tier-specific ones exist
    if (pool.length === 0) {
      const { data: fallbackQs } = await supabaseAdmin
        .from('trivia_questions_bank')
        .select('id, question, options, correct_index, answer, explanation, tier')
        .eq('league', league)
        .eq('active', true)
        .is('last_used_date', null)
        .limit(5)
      pool = fallbackQs ?? []
    }

    const shuffled = seededShuffle(pool, rand)
    if (shuffled.length > 0) {
      const picked = shuffled[0]
      if (tier === '1%') {
        triviaQuestions.push({
          question: picked.question,
          answer: picked.answer ?? '',
          explanation: picked.explanation,
          tier,
        })
      } else {
        triviaQuestions.push({
          question: picked.question,
          options: typeof picked.options === 'string' ? JSON.parse(picked.options) : picked.options,
          correctIndex: picked.correct_index,
          explanation: picked.explanation,
          tier,
        })
      }
      // Mark as used
      await supabaseAdmin
        .from('trivia_questions_bank')
        .update({ last_used_date: date })
        .eq('id', picked.id)
    }
  }

  // Showdown — pick curated matchup from bank
  let showdownPlayerA: any = { name: showdownA.name, team: showdownA.team, stats: {} }
  let showdownPlayerB: any = { name: showdownB.name, team: showdownB.team, stats: {} }
  let showdownCategory = showCategories[showCategoryIdx]

  const { data: sdUnused } = await supabaseAdmin
    .from('showdown_bank')
    .select('id, player_a, player_b, category')
    .eq('league', league)
    .eq('active', true)
    .is('last_used_date', null)
    .limit(20)

  let sdPool = sdUnused ?? []
  if (sdPool.length === 0) {
    const { data: sdAny } = await supabaseAdmin
      .from('showdown_bank')
      .select('id, player_a, player_b, category')
      .eq('league', league)
      .eq('active', true)
      .order('last_used_date', { ascending: true, nullsFirst: true })
      .limit(20)
    sdPool = sdAny ?? []
  }

  if (sdPool.length > 0) {
    const sdShuffled = seededShuffle(sdPool, rand)
    const sdPicked = sdShuffled[0]
    showdownPlayerA = typeof sdPicked.player_a === 'string' ? JSON.parse(sdPicked.player_a) : sdPicked.player_a
    showdownPlayerB = typeof sdPicked.player_b === 'string' ? JSON.parse(sdPicked.player_b) : sdPicked.player_b
    showdownCategory = sdPicked.category
    await supabaseAdmin.from('showdown_bank').update({ last_used_date: date }).eq('id', sdPicked.id)
  }

  // Auto Complete — pick 3 prompts from bank, prefer unused
  let autoComplete: any = null
  const { data: acUnused } = await supabaseAdmin
    .from('auto_complete_bank')
    .select('id, prompt, answers')
    .eq('league', league)
    .eq('active', true)
    .is('last_used_date', null)
    .limit(20)

  let acPool = acUnused ?? []
  if (acPool.length < 3) {
    const { data: acAny } = await supabaseAdmin
      .from('auto_complete_bank')
      .select('id, prompt, answers')
      .eq('league', league)
      .eq('active', true)
      .order('last_used_date', { ascending: true, nullsFirst: true })
      .limit(20)
    acPool = acAny ?? []
  }

  if (acPool.length >= 3) {
    const acShuffled = seededShuffle(acPool, rand)
    const picked3 = acShuffled.slice(0, 3)
    autoComplete = {
      league,
      prompts: picked3.map(p => ({
        text: p.prompt,
        answers: typeof p.answers === 'string' ? JSON.parse(p.answers) : p.answers,
      })),
    }
    for (const p of picked3) {
      await supabaseAdmin.from('auto_complete_bank').update({ last_used_date: date }).eq('id', p.id)
    }
  }

  // Power Play — pick 5 questions from bank, prefer unused
  let powerPlay: any = null
  const { data: ppUnused } = await supabaseAdmin
    .from('power_play_bank')
    .select('id, question_text, answers')
    .eq('league', league)
    .eq('active', true)
    .is('last_used_date', null)
    .limit(20)

  let ppPool = ppUnused ?? []
  if (ppPool.length < 5) {
    const { data: ppAny } = await supabaseAdmin
      .from('power_play_bank')
      .select('id, question_text, answers')
      .eq('league', league)
      .eq('active', true)
      .order('last_used_date', { ascending: true, nullsFirst: true })
      .limit(20)
    ppPool = ppAny ?? []
  }

  if (ppPool.length >= 5) {
    const ppShuffled = seededShuffle(ppPool, rand)
    const picked5 = ppShuffled.slice(0, 5)
    powerPlay = {
      league,
      questions: picked5.map(p => ({
        text: p.question_text,
        answers: typeof p.answers === 'string' ? JSON.parse(p.answers) : p.answers,
      })),
    }
    for (const p of picked5) {
      await supabaseAdmin.from('power_play_bank').update({ last_used_date: date }).eq('id', p.id)
    }
  }

  const game = {
    date,
    league,
    mystery_player: mysteryPlayer,
    blind_rank_players: blindRankPlayers,
    blind_rank_category: blindRankCategory,
    showdown_player_a: showdownPlayerA,
    showdown_player_b: showdownPlayerB,
    showdown_category: showdownCategory,
    showdown_correct_answer: null,
    showdown_correct_reason: null,
    trivia_questions: triviaQuestions,
    auto_complete: autoComplete,
    power_play: powerPlay,
  }

  const { error: insertError } = await supabaseAdmin
    .from('daily_games')
    .insert(game)

  if (insertError) {
    console.error(`Insert error for ${date} ${league}:`, insertError.message)
    return { status: 'error' }
  }

  return { status: 'inserted' }
}

// ── HTTP handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  // Authorization — must be called with service role key or by pg_cron (no auth)
  const authHeader = req.headers.get('Authorization') ?? ''
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  const isPgCron = req.headers.get('x-pg-cron') === '1'

  if (!isPgCron && authHeader !== `Bearer ${serviceKey}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Parse target date — default is tomorrow ET (cron runs at midnight ET (05:00 UTC), generating next day)
  let body: { date?: string; leagues?: string[] } = {}
  try { body = await req.json() } catch { /* no body */ }

  const targetDate = body.date ?? getDateEST(1)
  const leagues = body.leagues ?? ['NBA', 'NFL', 'MLB', 'NHL']

  console.log(`Generating daily games for ${targetDate}, leagues: ${leagues.join(', ')}`)

  const results: Record<string, string> = {}
  for (const league of leagues) {
    const result = await generateGameForDate(targetDate, league)
    results[league] = result.status
    console.log(`  ${league}: ${result.status}`)
  }

  // Send "new content" push notifications (only for cron-triggered runs, not manual backfills)
  const anyInserted = Object.values(results).some(s => s === 'inserted')
  if (isPgCron && anyInserted) {
    try {
      const { data: users } = await supabaseAdmin
        .from('profiles')
        .select('push_token')
        .eq('notify_new_content', true)
        .neq('push_token', null)

      if (users && users.length > 0) {
        const messages = users.map(u => ({
          to: u.push_token,
          title: 'New Daily Games Available!',
          body: 'Fresh games are ready. Play now to keep your streak alive!',
          sound: 'default',
          badge: 1,
        }))

        // Batch send (max 100 per request)
        for (let i = 0; i < messages.length; i += 100) {
          await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messages.slice(i, i + 100)),
          })
        }
        console.log(`Sent new-content push to ${users.length} users`)
      }
    } catch (e) {
      console.error('Failed to send new-content push:', e)
    }
  }

  return new Response(
    JSON.stringify({ success: true, date: targetDate, results }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
