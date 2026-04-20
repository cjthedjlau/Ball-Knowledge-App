// Seed power_play_bank table with 100 survey-style questions (25 per league)
// Family Feud style — users have 60 seconds to name answers
//
// Run with:
// SUPABASE_SERVICE_ROLE_KEY=your-key npx ts-node --project scripts/tsconfig.json scripts/seed-power-play-bank.ts

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://scloxktkudutupiyqvbx.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY env var is required')
  console.error('Usage: SUPABASE_SERVICE_ROLE_KEY=your-key npx ts-node --project scripts/tsconfig.json scripts/seed-power-play-bank.ts')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

interface Answer {
  text: string
  points: number
  aliases?: string[]
}

interface PowerPlayQuestion {
  league: 'NBA' | 'NFL' | 'MLB' | 'NHL'
  question_text: string
  answers: Answer[]
  active: boolean
  last_used_date: null
}

const questions: PowerPlayQuestion[] = [
  // ═══════════════════════════════════════════════════════════════
  // NBA QUESTIONS (25)
  // ═══════════════════════════════════════════════════════════════
  {
    league: 'NBA',
    question_text: 'Name a player who has won NBA Finals MVP',
    answers: [
      { text: 'LeBron James', points: 100, aliases: ['LeBron', 'Bron', 'James'] },
      { text: 'Michael Jordan', points: 80, aliases: ['MJ', 'Jordan', 'Mike'] },
      { text: 'Kevin Durant', points: 60, aliases: ['KD', 'Durant'] },
      { text: 'Kawhi Leonard', points: 40, aliases: ['Kawhi', 'Leonard', 'The Claw'] },
      { text: 'Kobe Bryant', points: 20, aliases: ['Kobe', 'Mamba', 'Black Mamba'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name a player who has scored 50+ points in an NBA game',
    answers: [
      { text: 'Kobe Bryant', points: 100, aliases: ['Kobe', 'Mamba'] },
      { text: 'Michael Jordan', points: 80, aliases: ['MJ', 'Jordan'] },
      { text: 'LeBron James', points: 60, aliases: ['LeBron', 'Bron'] },
      { text: 'James Harden', points: 40, aliases: ['Harden', 'The Beard'] },
      { text: 'Devin Booker', points: 20, aliases: ['Booker', 'Book', 'D Book'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name an NBA team located in California',
    answers: [
      { text: 'Los Angeles Lakers', points: 100, aliases: ['Lakers', 'LA Lakers', 'LAL'] },
      { text: 'Golden State Warriors', points: 80, aliases: ['Warriors', 'GSW', 'Golden State', 'Dubs'] },
      { text: 'Los Angeles Clippers', points: 60, aliases: ['Clippers', 'LA Clippers', 'LAC'] },
      { text: 'Sacramento Kings', points: 40, aliases: ['Kings', 'Sacramento', 'Sac'] },
      { text: 'San Jose Warriors', points: 20, aliases: ['San Jose'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name a player who has won NBA MVP multiple times',
    answers: [
      { text: 'LeBron James', points: 100, aliases: ['LeBron', 'Bron'] },
      { text: 'Michael Jordan', points: 80, aliases: ['MJ', 'Jordan'] },
      { text: 'Stephen Curry', points: 60, aliases: ['Steph', 'Curry', 'Chef Curry'] },
      { text: 'Giannis Antetokounmpo', points: 40, aliases: ['Giannis', 'Greek Freak', 'Antetokounmpo'] },
      { text: 'Nikola Jokic', points: 20, aliases: ['Jokic', 'Joker', 'Big Honey'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name an NBA player known for their three-point shooting',
    answers: [
      { text: 'Stephen Curry', points: 100, aliases: ['Steph', 'Curry', 'Chef Curry'] },
      { text: 'Ray Allen', points: 80, aliases: ['Ray', 'Allen', 'Jesus Shuttlesworth'] },
      { text: 'Klay Thompson', points: 60, aliases: ['Klay', 'Thompson'] },
      { text: 'Reggie Miller', points: 40, aliases: ['Reggie', 'Miller'] },
      { text: 'Damian Lillard', points: 20, aliases: ['Dame', 'Lillard', 'Dame Time'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name a player who played for the Chicago Bulls',
    answers: [
      { text: 'Michael Jordan', points: 100, aliases: ['MJ', 'Jordan'] },
      { text: 'Scottie Pippen', points: 80, aliases: ['Pippen', 'Scottie'] },
      { text: 'Derrick Rose', points: 60, aliases: ['D Rose', 'Rose'] },
      { text: 'Dennis Rodman', points: 40, aliases: ['Rodman', 'The Worm'] },
      { text: 'DeMar DeRozan', points: 20, aliases: ['DeMar', 'DeRozan'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name an NBA player who is 7 feet tall or taller',
    answers: [
      { text: 'Shaquille O\'Neal', points: 100, aliases: ['Shaq', 'O\'Neal', 'Shaquille'] },
      { text: 'Yao Ming', points: 80, aliases: ['Yao', 'Ming'] },
      { text: 'Kevin Durant', points: 60, aliases: ['KD', 'Durant'] },
      { text: 'Victor Wembanyama', points: 40, aliases: ['Wemby', 'Wembanyama', 'Victor'] },
      { text: 'Rudy Gobert', points: 20, aliases: ['Gobert', 'Rudy', 'Gobzilla'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name a player who has led the NBA in scoring',
    answers: [
      { text: 'Michael Jordan', points: 100, aliases: ['MJ', 'Jordan'] },
      { text: 'Kevin Durant', points: 80, aliases: ['KD', 'Durant'] },
      { text: 'LeBron James', points: 60, aliases: ['LeBron', 'Bron'] },
      { text: 'James Harden', points: 40, aliases: ['Harden', 'The Beard'] },
      { text: 'Joel Embiid', points: 20, aliases: ['Embiid', 'Joel', 'The Process'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name an NBA team that has won a championship in the last 20 years',
    answers: [
      { text: 'Golden State Warriors', points: 100, aliases: ['Warriors', 'GSW', 'Dubs'] },
      { text: 'Los Angeles Lakers', points: 80, aliases: ['Lakers', 'LA Lakers'] },
      { text: 'Miami Heat', points: 60, aliases: ['Heat', 'Miami'] },
      { text: 'Cleveland Cavaliers', points: 40, aliases: ['Cavs', 'Cleveland', 'Cavaliers'] },
      { text: 'Denver Nuggets', points: 20, aliases: ['Nuggets', 'Denver'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name a player who has recorded a triple-double in the NBA Finals',
    answers: [
      { text: 'LeBron James', points: 100, aliases: ['LeBron', 'Bron'] },
      { text: 'Magic Johnson', points: 80, aliases: ['Magic', 'Johnson'] },
      { text: 'Nikola Jokic', points: 60, aliases: ['Jokic', 'Joker'] },
      { text: 'Larry Bird', points: 40, aliases: ['Bird', 'Larry'] },
      { text: 'Draymond Green', points: 20, aliases: ['Draymond', 'Green'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name an NBA player with a famous nickname',
    answers: [
      { text: 'Magic Johnson', points: 100, aliases: ['Magic', 'Johnson'] },
      { text: 'Black Mamba (Kobe)', points: 80, aliases: ['Kobe', 'Mamba', 'Black Mamba', 'Kobe Bryant'] },
      { text: 'The King (LeBron)', points: 60, aliases: ['LeBron', 'The King', 'King James'] },
      { text: 'The Answer (Iverson)', points: 40, aliases: ['AI', 'Iverson', 'Allen Iverson', 'The Answer'] },
      { text: 'Greek Freak (Giannis)', points: 20, aliases: ['Giannis', 'Greek Freak', 'Antetokounmpo'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name a point guard who has won an NBA championship',
    answers: [
      { text: 'Stephen Curry', points: 100, aliases: ['Steph', 'Curry'] },
      { text: 'Magic Johnson', points: 80, aliases: ['Magic', 'Johnson'] },
      { text: 'Kyrie Irving', points: 60, aliases: ['Kyrie', 'Irving', 'Uncle Drew'] },
      { text: 'Tony Parker', points: 40, aliases: ['Parker', 'Tony'] },
      { text: 'Isiah Thomas', points: 20, aliases: ['Isiah', 'Thomas', 'Zeke'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name a player drafted #1 overall in the NBA Draft',
    answers: [
      { text: 'LeBron James', points: 100, aliases: ['LeBron', 'Bron'] },
      { text: 'Zion Williamson', points: 80, aliases: ['Zion', 'Williamson'] },
      { text: 'Anthony Davis', points: 60, aliases: ['AD', 'Davis', 'Anthony Davis'] },
      { text: 'Victor Wembanyama', points: 40, aliases: ['Wemby', 'Wembanyama'] },
      { text: 'Allen Iverson', points: 20, aliases: ['AI', 'Iverson'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name an NBA player who played for the same team their entire career',
    answers: [
      { text: 'Kobe Bryant', points: 100, aliases: ['Kobe', 'Mamba'] },
      { text: 'Tim Duncan', points: 80, aliases: ['Duncan', 'Timmy', 'Tim'] },
      { text: 'Dirk Nowitzki', points: 60, aliases: ['Dirk', 'Nowitzki'] },
      { text: 'Stephen Curry', points: 40, aliases: ['Steph', 'Curry'] },
      { text: 'Udonis Haslem', points: 20, aliases: ['Haslem', 'UD'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name a center who dominated the NBA',
    answers: [
      { text: 'Shaquille O\'Neal', points: 100, aliases: ['Shaq', 'Shaquille'] },
      { text: 'Hakeem Olajuwon', points: 80, aliases: ['Hakeem', 'Olajuwon', 'The Dream'] },
      { text: 'Kareem Abdul-Jabbar', points: 60, aliases: ['Kareem', 'Abdul-Jabbar'] },
      { text: 'Wilt Chamberlain', points: 40, aliases: ['Wilt', 'Chamberlain', 'Wilt the Stilt'] },
      { text: 'Patrick Ewing', points: 20, aliases: ['Ewing', 'Patrick'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name an NBA player who came from Duke University',
    answers: [
      { text: 'Kyrie Irving', points: 100, aliases: ['Kyrie', 'Irving'] },
      { text: 'Zion Williamson', points: 80, aliases: ['Zion', 'Williamson'] },
      { text: 'Jayson Tatum', points: 60, aliases: ['Tatum', 'JT', 'Jayson'] },
      { text: 'Grant Hill', points: 40, aliases: ['Grant', 'Hill'] },
      { text: 'Brandon Ingram', points: 20, aliases: ['Ingram', 'BI', 'Brandon'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name an NBA player who has been in a famous dunk contest',
    answers: [
      { text: 'Michael Jordan', points: 100, aliases: ['MJ', 'Jordan'] },
      { text: 'Vince Carter', points: 80, aliases: ['Vince', 'Carter', 'Vinsanity', 'Air Canada'] },
      { text: 'Zach LaVine', points: 60, aliases: ['LaVine', 'Zach'] },
      { text: 'Dominique Wilkins', points: 40, aliases: ['Dominique', 'Wilkins', 'Human Highlight Film'] },
      { text: 'Aaron Gordon', points: 20, aliases: ['Gordon', 'Aaron'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name an NBA team that relocated from another city',
    answers: [
      { text: 'Oklahoma City Thunder', points: 100, aliases: ['Thunder', 'OKC', 'Oklahoma City'] },
      { text: 'Brooklyn Nets', points: 80, aliases: ['Nets', 'Brooklyn'] },
      { text: 'Memphis Grizzlies', points: 60, aliases: ['Grizzlies', 'Memphis', 'Grizz'] },
      { text: 'New Orleans Pelicans', points: 40, aliases: ['Pelicans', 'New Orleans', 'Pels'] },
      { text: 'Sacramento Kings', points: 20, aliases: ['Kings', 'Sacramento'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name an international NBA player (not born in the USA)',
    answers: [
      { text: 'Giannis Antetokounmpo', points: 100, aliases: ['Giannis', 'Greek Freak'] },
      { text: 'Luka Doncic', points: 80, aliases: ['Luka', 'Doncic'] },
      { text: 'Nikola Jokic', points: 60, aliases: ['Jokic', 'Joker'] },
      { text: 'Dirk Nowitzki', points: 40, aliases: ['Dirk', 'Nowitzki'] },
      { text: 'Yao Ming', points: 20, aliases: ['Yao', 'Ming'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name an NBA player who wore jersey number 23',
    answers: [
      { text: 'Michael Jordan', points: 100, aliases: ['MJ', 'Jordan'] },
      { text: 'LeBron James', points: 80, aliases: ['LeBron', 'Bron'] },
      { text: 'Jimmy Butler', points: 60, aliases: ['Jimmy', 'Butler', 'Jimmy Buckets'] },
      { text: 'Anthony Davis', points: 40, aliases: ['AD', 'Davis'] },
      { text: 'Draymond Green', points: 20, aliases: ['Draymond', 'Green'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name a player who has been NBA All-Star Game MVP',
    answers: [
      { text: 'LeBron James', points: 100, aliases: ['LeBron', 'Bron'] },
      { text: 'Kevin Durant', points: 80, aliases: ['KD', 'Durant'] },
      { text: 'Kobe Bryant', points: 60, aliases: ['Kobe', 'Mamba'] },
      { text: 'Anthony Davis', points: 40, aliases: ['AD', 'Davis'] },
      { text: 'Giannis Antetokounmpo', points: 20, aliases: ['Giannis', 'Greek Freak'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name an NBA team with an animal mascot name',
    answers: [
      { text: 'Chicago Bulls', points: 100, aliases: ['Bulls', 'Chicago'] },
      { text: 'Memphis Grizzlies', points: 80, aliases: ['Grizzlies', 'Memphis', 'Grizz'] },
      { text: 'Milwaukee Bucks', points: 60, aliases: ['Bucks', 'Milwaukee'] },
      { text: 'Toronto Raptors', points: 40, aliases: ['Raptors', 'Toronto', 'Raps'] },
      { text: 'Atlanta Hawks', points: 20, aliases: ['Hawks', 'Atlanta'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name a player who has won Defensive Player of the Year',
    answers: [
      { text: 'Rudy Gobert', points: 100, aliases: ['Gobert', 'Rudy'] },
      { text: 'Kawhi Leonard', points: 80, aliases: ['Kawhi', 'The Claw'] },
      { text: 'Dikembe Mutombo', points: 60, aliases: ['Dikembe', 'Mutombo'] },
      { text: 'Ben Wallace', points: 40, aliases: ['Ben', 'Wallace', 'Big Ben'] },
      { text: 'Marcus Smart', points: 20, aliases: ['Smart', 'Marcus'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name an NBA player who played in the 2016 Finals (Cavs vs Warriors)',
    answers: [
      { text: 'LeBron James', points: 100, aliases: ['LeBron', 'Bron'] },
      { text: 'Stephen Curry', points: 80, aliases: ['Steph', 'Curry'] },
      { text: 'Kyrie Irving', points: 60, aliases: ['Kyrie', 'Irving'] },
      { text: 'Klay Thompson', points: 40, aliases: ['Klay', 'Thompson'] },
      { text: 'Draymond Green', points: 20, aliases: ['Draymond', 'Green'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NBA',
    question_text: 'Name a player who has been traded mid-season for a blockbuster deal',
    answers: [
      { text: 'James Harden', points: 100, aliases: ['Harden', 'The Beard'] },
      { text: 'Anthony Davis', points: 80, aliases: ['AD', 'Davis'] },
      { text: 'Kevin Garnett', points: 60, aliases: ['KG', 'Garnett'] },
      { text: 'Paul George', points: 40, aliases: ['PG', 'PG13', 'George'] },
      { text: 'Carmelo Anthony', points: 20, aliases: ['Melo', 'Carmelo'] },
    ],
    active: true,
    last_used_date: null,
  },

  // ═══════════════════════════════════════════════════════════════
  // NFL QUESTIONS (25)
  // ═══════════════════════════════════════════════════════════════
  {
    league: 'NFL',
    question_text: 'Name a quarterback who has won multiple Super Bowls',
    answers: [
      { text: 'Tom Brady', points: 100, aliases: ['Brady', 'TB12', 'Tom'] },
      { text: 'Patrick Mahomes', points: 80, aliases: ['Mahomes', 'Pat', 'Patrick'] },
      { text: 'Peyton Manning', points: 60, aliases: ['Peyton', 'Manning'] },
      { text: 'Eli Manning', points: 40, aliases: ['Eli', 'Manning'] },
      { text: 'Terry Bradshaw', points: 20, aliases: ['Bradshaw', 'Terry'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name an NFL team that has never won a Super Bowl',
    answers: [
      { text: 'Buffalo Bills', points: 100, aliases: ['Bills', 'Buffalo'] },
      { text: 'Minnesota Vikings', points: 80, aliases: ['Vikings', 'Minnesota', 'Vikes'] },
      { text: 'Cincinnati Bengals', points: 60, aliases: ['Bengals', 'Cincinnati', 'Cincy'] },
      { text: 'Cleveland Browns', points: 40, aliases: ['Browns', 'Cleveland'] },
      { text: 'Detroit Lions', points: 20, aliases: ['Lions', 'Detroit'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name a wide receiver who has caught 100+ touchdowns in their career',
    answers: [
      { text: 'Jerry Rice', points: 100, aliases: ['Rice', 'Jerry'] },
      { text: 'Randy Moss', points: 80, aliases: ['Moss', 'Randy'] },
      { text: 'Terrell Owens', points: 60, aliases: ['TO', 'Owens', 'Terrell'] },
      { text: 'Antonio Gates', points: 40, aliases: ['Gates', 'Antonio'] },
      { text: 'Marvin Harrison', points: 20, aliases: ['Harrison', 'Marvin'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name a running back who has rushed for 2,000 yards in a season',
    answers: [
      { text: 'Eric Dickerson', points: 100, aliases: ['Dickerson', 'Eric'] },
      { text: 'Adrian Peterson', points: 80, aliases: ['AP', 'Peterson', 'AD', 'Adrian'] },
      { text: 'Barry Sanders', points: 60, aliases: ['Barry', 'Sanders'] },
      { text: 'Derrick Henry', points: 40, aliases: ['Henry', 'King Henry', 'Derrick'] },
      { text: 'Jamal Lewis', points: 20, aliases: ['Jamal', 'Lewis'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name an NFL player who has won MVP',
    answers: [
      { text: 'Patrick Mahomes', points: 100, aliases: ['Mahomes', 'Pat'] },
      { text: 'Aaron Rodgers', points: 80, aliases: ['Rodgers', 'Aaron', 'A-Rod'] },
      { text: 'Tom Brady', points: 60, aliases: ['Brady', 'TB12'] },
      { text: 'Lamar Jackson', points: 40, aliases: ['Lamar', 'Jackson'] },
      { text: 'Peyton Manning', points: 20, aliases: ['Peyton', 'Manning'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name an NFL team located in the state of Texas',
    answers: [
      { text: 'Dallas Cowboys', points: 100, aliases: ['Cowboys', 'Dallas'] },
      { text: 'Houston Texans', points: 80, aliases: ['Texans', 'Houston'] },
      { text: 'Houston Oilers', points: 60, aliases: ['Oilers', 'Houston Oilers'] },
      { text: 'San Antonio Commanders', points: 40, aliases: ['Commanders', 'San Antonio'] },
      { text: 'Arlington (Cowboys)', points: 20, aliases: ['Arlington'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name a player who has returned a kick or punt for a touchdown in the Super Bowl',
    answers: [
      { text: 'Desmond Howard', points: 100, aliases: ['Howard', 'Desmond'] },
      { text: 'Devin Hester', points: 80, aliases: ['Hester', 'Devin'] },
      { text: 'Jacoby Jones', points: 60, aliases: ['Jacoby', 'Jones'] },
      { text: 'Andre Coleman', points: 40, aliases: ['Coleman', 'Andre'] },
      { text: 'Muhsin Muhammad', points: 20, aliases: ['Muhsin', 'Muhammad', 'Moose'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name a legendary NFL linebacker',
    answers: [
      { text: 'Ray Lewis', points: 100, aliases: ['Ray', 'Lewis'] },
      { text: 'Lawrence Taylor', points: 80, aliases: ['LT', 'Taylor', 'Lawrence'] },
      { text: 'Dick Butkus', points: 60, aliases: ['Butkus', 'Dick'] },
      { text: 'Brian Urlacher', points: 40, aliases: ['Urlacher', 'Brian'] },
      { text: 'Luke Kuechly', points: 20, aliases: ['Kuechly', 'Luke'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name a quarterback who was drafted #1 overall',
    answers: [
      { text: 'Peyton Manning', points: 100, aliases: ['Peyton', 'Manning'] },
      { text: 'Trevor Lawrence', points: 80, aliases: ['Lawrence', 'Trevor'] },
      { text: 'Joe Burrow', points: 60, aliases: ['Burrow', 'Joe', 'Joey B'] },
      { text: 'Matthew Stafford', points: 40, aliases: ['Stafford', 'Matthew', 'Matt'] },
      { text: 'Andrew Luck', points: 20, aliases: ['Luck', 'Andrew'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name an NFL player known for their touchdown celebration',
    answers: [
      { text: 'Terrell Owens', points: 100, aliases: ['TO', 'Owens', 'Terrell'] },
      { text: 'Chad Johnson', points: 80, aliases: ['Ochocinco', 'Chad', 'Johnson'] },
      { text: 'Tyreek Hill', points: 60, aliases: ['Tyreek', 'Hill', 'Cheetah'] },
      { text: 'Gronkowski', points: 40, aliases: ['Gronk', 'Rob Gronkowski', 'Rob'] },
      { text: 'Deion Sanders', points: 20, aliases: ['Deion', 'Sanders', 'Prime Time', 'Neon Deion'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name an NFL team with a bird as their mascot',
    answers: [
      { text: 'Philadelphia Eagles', points: 100, aliases: ['Eagles', 'Philly', 'Philadelphia'] },
      { text: 'Baltimore Ravens', points: 80, aliases: ['Ravens', 'Baltimore'] },
      { text: 'Atlanta Falcons', points: 60, aliases: ['Falcons', 'Atlanta'] },
      { text: 'Seattle Seahawks', points: 40, aliases: ['Seahawks', 'Seattle', 'Hawks'] },
      { text: 'Arizona Cardinals', points: 20, aliases: ['Cardinals', 'Arizona', 'Cards'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name a tight end who is considered one of the best ever',
    answers: [
      { text: 'Rob Gronkowski', points: 100, aliases: ['Gronk', 'Gronkowski', 'Rob'] },
      { text: 'Tony Gonzalez', points: 80, aliases: ['Gonzalez', 'Tony'] },
      { text: 'Travis Kelce', points: 60, aliases: ['Kelce', 'Travis'] },
      { text: 'Antonio Gates', points: 40, aliases: ['Gates', 'Antonio'] },
      { text: 'Jason Witten', points: 20, aliases: ['Witten', 'Jason'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name a player who has thrown for 5,000+ yards in a single season',
    answers: [
      { text: 'Peyton Manning', points: 100, aliases: ['Peyton', 'Manning'] },
      { text: 'Drew Brees', points: 80, aliases: ['Brees', 'Drew'] },
      { text: 'Tom Brady', points: 60, aliases: ['Brady', 'TB12'] },
      { text: 'Patrick Mahomes', points: 40, aliases: ['Mahomes', 'Pat'] },
      { text: 'Dan Marino', points: 20, aliases: ['Marino', 'Dan'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name an NFL team that plays in a dome or indoor stadium',
    answers: [
      { text: 'Dallas Cowboys', points: 100, aliases: ['Cowboys', 'Dallas'] },
      { text: 'Indianapolis Colts', points: 80, aliases: ['Colts', 'Indianapolis', 'Indy'] },
      { text: 'Atlanta Falcons', points: 60, aliases: ['Falcons', 'Atlanta'] },
      { text: 'Las Vegas Raiders', points: 40, aliases: ['Raiders', 'Vegas', 'Las Vegas'] },
      { text: 'Minnesota Vikings', points: 20, aliases: ['Vikings', 'Minnesota'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name a defensive player who has won Super Bowl MVP',
    answers: [
      { text: 'Von Miller', points: 100, aliases: ['Von', 'Miller'] },
      { text: 'Malcolm Smith', points: 80, aliases: ['Malcolm', 'Smith'] },
      { text: 'Ray Lewis', points: 60, aliases: ['Ray', 'Lewis'] },
      { text: 'Dexter Jackson', points: 40, aliases: ['Dexter', 'Jackson'] },
      { text: 'Larry Brown', points: 20, aliases: ['Larry', 'Brown'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name an NFL cornerback or safety known for interceptions',
    answers: [
      { text: 'Ed Reed', points: 100, aliases: ['Reed', 'Ed'] },
      { text: 'Deion Sanders', points: 80, aliases: ['Deion', 'Sanders', 'Prime Time'] },
      { text: 'Charles Woodson', points: 60, aliases: ['Woodson', 'Charles'] },
      { text: 'Rod Woodson', points: 40, aliases: ['Rod', 'Woodson'] },
      { text: 'Darrelle Revis', points: 20, aliases: ['Revis', 'Revis Island'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name a player who has won the Heisman Trophy and had NFL success',
    answers: [
      { text: 'Barry Sanders', points: 100, aliases: ['Barry', 'Sanders'] },
      { text: 'Lamar Jackson', points: 80, aliases: ['Lamar', 'Jackson'] },
      { text: 'Cam Newton', points: 60, aliases: ['Cam', 'Newton'] },
      { text: 'Marcus Mariota', points: 40, aliases: ['Mariota', 'Marcus'] },
      { text: 'Derrick Henry', points: 20, aliases: ['Henry', 'King Henry'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name a city that has hosted the Super Bowl multiple times',
    answers: [
      { text: 'Miami', points: 100, aliases: ['Miami Gardens', 'South Florida'] },
      { text: 'New Orleans', points: 80, aliases: ['NOLA'] },
      { text: 'Los Angeles', points: 60, aliases: ['LA', 'Inglewood'] },
      { text: 'Tampa', points: 40, aliases: ['Tampa Bay'] },
      { text: 'Phoenix', points: 20, aliases: ['Glendale', 'Arizona'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name an NFL player who played in both the Pro Bowl and Super Bowl in the same season',
    answers: [
      { text: 'Patrick Mahomes', points: 100, aliases: ['Mahomes', 'Pat'] },
      { text: 'Tom Brady', points: 80, aliases: ['Brady', 'TB12'] },
      { text: 'Travis Kelce', points: 60, aliases: ['Kelce', 'Travis'] },
      { text: 'Aaron Donald', points: 40, aliases: ['Donald', 'Aaron'] },
      { text: 'Tyreek Hill', points: 20, aliases: ['Tyreek', 'Hill', 'Cheetah'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name an NFL team in the NFC East',
    answers: [
      { text: 'Dallas Cowboys', points: 100, aliases: ['Cowboys', 'Dallas'] },
      { text: 'Philadelphia Eagles', points: 80, aliases: ['Eagles', 'Philly'] },
      { text: 'New York Giants', points: 60, aliases: ['Giants', 'NY Giants', 'New York'] },
      { text: 'Washington Commanders', points: 40, aliases: ['Commanders', 'Washington', 'Skins', 'Redskins'] },
      { text: 'NFC East Complete', points: 20, aliases: [] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name an NFL player who has rushed for a touchdown in the Super Bowl',
    answers: [
      { text: 'Marshawn Lynch', points: 100, aliases: ['Lynch', 'Beast Mode', 'Marshawn'] },
      { text: 'Emmitt Smith', points: 80, aliases: ['Emmitt', 'Smith'] },
      { text: 'Terrell Davis', points: 60, aliases: ['Davis', 'Terrell', 'TD'] },
      { text: 'James White', points: 40, aliases: ['White', 'James'] },
      { text: 'Isiah Pacheco', points: 20, aliases: ['Pacheco', 'Isiah'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name a current NFL team that used to have a different name',
    answers: [
      { text: 'Washington Commanders', points: 100, aliases: ['Commanders', 'Washington'] },
      { text: 'Las Vegas Raiders', points: 80, aliases: ['Raiders', 'Vegas'] },
      { text: 'Tennessee Titans', points: 60, aliases: ['Titans', 'Tennessee'] },
      { text: 'Los Angeles Chargers', points: 40, aliases: ['Chargers', 'LA Chargers'] },
      { text: 'Indianapolis Colts', points: 20, aliases: ['Colts', 'Indy'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name a wide receiver who has had 1,500+ receiving yards in a season',
    answers: [
      { text: 'Calvin Johnson', points: 100, aliases: ['Megatron', 'Calvin', 'Johnson'] },
      { text: 'Julio Jones', points: 80, aliases: ['Julio', 'Jones'] },
      { text: 'Tyreek Hill', points: 60, aliases: ['Tyreek', 'Hill', 'Cheetah'] },
      { text: 'Ja\'Marr Chase', points: 40, aliases: ['Chase', 'Ja\'Marr', 'Jamarr'] },
      { text: 'Antonio Brown', points: 20, aliases: ['AB', 'Brown', 'Antonio'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name an NFL coach who has won a Super Bowl',
    answers: [
      { text: 'Bill Belichick', points: 100, aliases: ['Belichick', 'Bill'] },
      { text: 'Andy Reid', points: 80, aliases: ['Reid', 'Andy', 'Big Red'] },
      { text: 'Mike Tomlin', points: 60, aliases: ['Tomlin', 'Mike'] },
      { text: 'Sean Payton', points: 40, aliases: ['Payton', 'Sean'] },
      { text: 'Pete Carroll', points: 20, aliases: ['Carroll', 'Pete'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NFL',
    question_text: 'Name a famous NFL quarterback who wore number 12',
    answers: [
      { text: 'Tom Brady', points: 100, aliases: ['Brady', 'TB12'] },
      { text: 'Aaron Rodgers', points: 80, aliases: ['Rodgers', 'Aaron'] },
      { text: 'Joe Namath', points: 60, aliases: ['Namath', 'Broadway Joe'] },
      { text: 'Terry Bradshaw', points: 40, aliases: ['Bradshaw', 'Terry'] },
      { text: 'Roger Staubach', points: 20, aliases: ['Staubach', 'Roger'] },
    ],
    active: true,
    last_used_date: null,
  },

  // ═══════════════════════════════════════════════════════════════
  // MLB QUESTIONS (25)
  // ═══════════════════════════════════════════════════════════════
  {
    league: 'MLB',
    question_text: 'Name a pitcher who has thrown a no-hitter',
    answers: [
      { text: 'Nolan Ryan', points: 100, aliases: ['Ryan', 'Nolan'] },
      { text: 'Sandy Koufax', points: 80, aliases: ['Koufax', 'Sandy'] },
      { text: 'Justin Verlander', points: 60, aliases: ['Verlander', 'Justin', 'JV'] },
      { text: 'Clayton Kershaw', points: 40, aliases: ['Kershaw', 'Clayton'] },
      { text: 'Max Scherzer', points: 20, aliases: ['Scherzer', 'Max', 'Mad Max'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name a player in the 500 home run club',
    answers: [
      { text: 'Barry Bonds', points: 100, aliases: ['Bonds', 'Barry'] },
      { text: 'Hank Aaron', points: 80, aliases: ['Aaron', 'Hank', 'Hammerin Hank'] },
      { text: 'Babe Ruth', points: 60, aliases: ['Ruth', 'Babe', 'The Bambino'] },
      { text: 'Alex Rodriguez', points: 40, aliases: ['A-Rod', 'Rodriguez', 'Alex'] },
      { text: 'Albert Pujols', points: 20, aliases: ['Pujols', 'Albert', 'The Machine'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name an MLB team based in New York',
    answers: [
      { text: 'New York Yankees', points: 100, aliases: ['Yankees', 'Yanks', 'NY Yankees'] },
      { text: 'New York Mets', points: 80, aliases: ['Mets', 'NY Mets'] },
      { text: 'Brooklyn Dodgers', points: 60, aliases: ['Dodgers', 'Brooklyn'] },
      { text: 'New York Giants', points: 40, aliases: ['Giants', 'NY Giants'] },
      { text: 'Buffalo Bisons', points: 20, aliases: ['Bisons', 'Buffalo'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name a player who has won the Triple Crown in batting',
    answers: [
      { text: 'Miguel Cabrera', points: 100, aliases: ['Cabrera', 'Miguel', 'Miggy'] },
      { text: 'Ted Williams', points: 80, aliases: ['Williams', 'Ted', 'Teddy Ballgame'] },
      { text: 'Carl Yastrzemski', points: 60, aliases: ['Yaz', 'Yastrzemski', 'Carl'] },
      { text: 'Mickey Mantle', points: 40, aliases: ['Mantle', 'Mickey', 'The Mick'] },
      { text: 'Frank Robinson', points: 20, aliases: ['Robinson', 'Frank'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name a player who has stolen 50+ bases in a season',
    answers: [
      { text: 'Rickey Henderson', points: 100, aliases: ['Rickey', 'Henderson'] },
      { text: 'Lou Brock', points: 80, aliases: ['Brock', 'Lou'] },
      { text: 'Ronald Acuna Jr', points: 60, aliases: ['Acuna', 'Ronald', 'Acuna Jr'] },
      { text: 'Tim Raines', points: 40, aliases: ['Raines', 'Tim', 'Rock'] },
      { text: 'Jose Reyes', points: 20, aliases: ['Reyes', 'Jose'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name a team that has won the World Series in the last 25 years',
    answers: [
      { text: 'Boston Red Sox', points: 100, aliases: ['Red Sox', 'Boston', 'Sox'] },
      { text: 'Chicago Cubs', points: 80, aliases: ['Cubs', 'Chicago'] },
      { text: 'Houston Astros', points: 60, aliases: ['Astros', 'Houston'] },
      { text: 'Los Angeles Dodgers', points: 40, aliases: ['Dodgers', 'LA', 'Los Angeles'] },
      { text: 'Texas Rangers', points: 20, aliases: ['Rangers', 'Texas'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name a famous MLB shortstop',
    answers: [
      { text: 'Derek Jeter', points: 100, aliases: ['Jeter', 'Derek', 'DJ', 'Captain'] },
      { text: 'Cal Ripken Jr', points: 80, aliases: ['Ripken', 'Cal', 'Iron Man'] },
      { text: 'Alex Rodriguez', points: 60, aliases: ['A-Rod', 'Rodriguez'] },
      { text: 'Ozzie Smith', points: 40, aliases: ['Ozzie', 'Smith', 'Wizard of Oz'] },
      { text: 'Trea Turner', points: 20, aliases: ['Turner', 'Trea'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name a pitcher who has won the Cy Young Award multiple times',
    answers: [
      { text: 'Roger Clemens', points: 100, aliases: ['Clemens', 'Roger', 'Rocket'] },
      { text: 'Clayton Kershaw', points: 80, aliases: ['Kershaw', 'Clayton'] },
      { text: 'Randy Johnson', points: 60, aliases: ['Randy', 'Johnson', 'Big Unit'] },
      { text: 'Max Scherzer', points: 40, aliases: ['Scherzer', 'Max', 'Mad Max'] },
      { text: 'Pedro Martinez', points: 20, aliases: ['Pedro', 'Martinez'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name a Japanese player who played in MLB',
    answers: [
      { text: 'Shohei Ohtani', points: 100, aliases: ['Ohtani', 'Shohei', 'Shotime'] },
      { text: 'Ichiro Suzuki', points: 80, aliases: ['Ichiro', 'Suzuki'] },
      { text: 'Hideki Matsui', points: 60, aliases: ['Matsui', 'Hideki', 'Godzilla'] },
      { text: 'Yu Darvish', points: 40, aliases: ['Darvish', 'Yu'] },
      { text: 'Hideo Nomo', points: 20, aliases: ['Nomo', 'Hideo', 'Tornado'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name a player who has hit 40+ home runs in a single season',
    answers: [
      { text: 'Barry Bonds', points: 100, aliases: ['Bonds', 'Barry'] },
      { text: 'Sammy Sosa', points: 80, aliases: ['Sosa', 'Sammy'] },
      { text: 'Mark McGwire', points: 60, aliases: ['McGwire', 'Mark', 'Big Mac'] },
      { text: 'Aaron Judge', points: 40, aliases: ['Judge', 'Aaron', 'All Rise'] },
      { text: 'Shohei Ohtani', points: 20, aliases: ['Ohtani', 'Shohei'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name an MLB team with a color in their name',
    answers: [
      { text: 'Boston Red Sox', points: 100, aliases: ['Red Sox', 'Boston'] },
      { text: 'Chicago White Sox', points: 80, aliases: ['White Sox', 'Chicago', 'Sox'] },
      { text: 'Cincinnati Reds', points: 60, aliases: ['Reds', 'Cincinnati'] },
      { text: 'St. Louis Cardinals', points: 40, aliases: ['Cardinals', 'Cards', 'St Louis'] },
      { text: 'Toronto Blue Jays', points: 20, aliases: ['Blue Jays', 'Jays', 'Toronto'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name a player who has won World Series MVP',
    answers: [
      { text: 'Derek Jeter', points: 100, aliases: ['Jeter', 'Derek'] },
      { text: 'Madison Bumgarner', points: 80, aliases: ['Bumgarner', 'MadBum', 'Madison'] },
      { text: 'David Ortiz', points: 60, aliases: ['Ortiz', 'Big Papi', 'David'] },
      { text: 'Corey Seager', points: 40, aliases: ['Seager', 'Corey'] },
      { text: 'Jorge Soler', points: 20, aliases: ['Soler', 'Jorge'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name a famous catcher in MLB history',
    answers: [
      { text: 'Johnny Bench', points: 100, aliases: ['Bench', 'Johnny'] },
      { text: 'Yogi Berra', points: 80, aliases: ['Yogi', 'Berra'] },
      { text: 'Ivan Rodriguez', points: 60, aliases: ['Pudge', 'Ivan', 'Rodriguez', 'I-Rod'] },
      { text: 'Mike Piazza', points: 40, aliases: ['Piazza', 'Mike'] },
      { text: 'Buster Posey', points: 20, aliases: ['Posey', 'Buster'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name a player who has won the AL or NL MVP award',
    answers: [
      { text: 'Mike Trout', points: 100, aliases: ['Trout', 'Mike', 'Millville Meteor'] },
      { text: 'Shohei Ohtani', points: 80, aliases: ['Ohtani', 'Shohei'] },
      { text: 'Bryce Harper', points: 60, aliases: ['Harper', 'Bryce'] },
      { text: 'Mookie Betts', points: 40, aliases: ['Mookie', 'Betts'] },
      { text: 'Freddie Freeman', points: 20, aliases: ['Freeman', 'Freddie'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name a pitcher who threw a perfect game',
    answers: [
      { text: 'Don Larsen', points: 100, aliases: ['Larsen', 'Don'] },
      { text: 'Roy Halladay', points: 80, aliases: ['Halladay', 'Roy', 'Doc'] },
      { text: 'Felix Hernandez', points: 60, aliases: ['Felix', 'Hernandez', 'King Felix'] },
      { text: 'Randy Johnson', points: 40, aliases: ['Randy', 'Johnson', 'Big Unit'] },
      { text: 'David Cone', points: 20, aliases: ['Cone', 'David'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name an outfielder who has won a Gold Glove Award',
    answers: [
      { text: 'Ken Griffey Jr', points: 100, aliases: ['Griffey', 'Junior', 'Ken Jr', 'The Kid'] },
      { text: 'Roberto Clemente', points: 80, aliases: ['Clemente', 'Roberto'] },
      { text: 'Mike Trout', points: 60, aliases: ['Trout', 'Mike'] },
      { text: 'Andruw Jones', points: 40, aliases: ['Jones', 'Andruw'] },
      { text: 'Mookie Betts', points: 20, aliases: ['Mookie', 'Betts'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name a Dominican Republic-born MLB player',
    answers: [
      { text: 'David Ortiz', points: 100, aliases: ['Ortiz', 'Big Papi', 'David'] },
      { text: 'Pedro Martinez', points: 80, aliases: ['Pedro', 'Martinez'] },
      { text: 'Manny Ramirez', points: 60, aliases: ['Manny', 'Ramirez', 'Manny Being Manny'] },
      { text: 'Vladimir Guerrero', points: 40, aliases: ['Vlad', 'Guerrero', 'Vladimir'] },
      { text: 'Juan Soto', points: 20, aliases: ['Soto', 'Juan', 'Childish Bambino'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name an MLB team in the American League East',
    answers: [
      { text: 'New York Yankees', points: 100, aliases: ['Yankees', 'Yanks'] },
      { text: 'Boston Red Sox', points: 80, aliases: ['Red Sox', 'Boston'] },
      { text: 'Toronto Blue Jays', points: 60, aliases: ['Blue Jays', 'Toronto', 'Jays'] },
      { text: 'Baltimore Orioles', points: 40, aliases: ['Orioles', 'Baltimore', 'O\'s'] },
      { text: 'Tampa Bay Rays', points: 20, aliases: ['Rays', 'Tampa', 'Tampa Bay'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name a player who has hit a walk-off home run in the World Series',
    answers: [
      { text: 'Bill Mazeroski', points: 100, aliases: ['Mazeroski', 'Maz', 'Bill'] },
      { text: 'Kirk Gibson', points: 80, aliases: ['Gibson', 'Kirk'] },
      { text: 'Joe Carter', points: 60, aliases: ['Carter', 'Joe'] },
      { text: 'David Freese', points: 40, aliases: ['Freese', 'David'] },
      { text: 'Edgar Renteria', points: 20, aliases: ['Renteria', 'Edgar'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name a left-handed pitcher who dominated MLB',
    answers: [
      { text: 'Sandy Koufax', points: 100, aliases: ['Koufax', 'Sandy'] },
      { text: 'Clayton Kershaw', points: 80, aliases: ['Kershaw', 'Clayton'] },
      { text: 'Randy Johnson', points: 60, aliases: ['Randy', 'Johnson', 'Big Unit'] },
      { text: 'CC Sabathia', points: 40, aliases: ['CC', 'Sabathia'] },
      { text: 'Madison Bumgarner', points: 20, aliases: ['Bumgarner', 'MadBum'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name a player who played for the New York Yankees',
    answers: [
      { text: 'Derek Jeter', points: 100, aliases: ['Jeter', 'Derek', 'Captain'] },
      { text: 'Babe Ruth', points: 80, aliases: ['Ruth', 'Babe', 'Bambino'] },
      { text: 'Mariano Rivera', points: 60, aliases: ['Mariano', 'Rivera', 'Mo'] },
      { text: 'Aaron Judge', points: 40, aliases: ['Judge', 'Aaron'] },
      { text: 'Mickey Mantle', points: 20, aliases: ['Mantle', 'Mickey', 'The Mick'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name a closer who saved 300+ games in their career',
    answers: [
      { text: 'Mariano Rivera', points: 100, aliases: ['Mariano', 'Rivera', 'Mo', 'Sandman'] },
      { text: 'Trevor Hoffman', points: 80, aliases: ['Hoffman', 'Trevor'] },
      { text: 'Lee Smith', points: 60, aliases: ['Lee', 'Smith'] },
      { text: 'Kenley Jansen', points: 40, aliases: ['Jansen', 'Kenley'] },
      { text: 'Craig Kimbrel', points: 20, aliases: ['Kimbrel', 'Craig'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name a ballpark that is considered iconic or historic',
    answers: [
      { text: 'Fenway Park', points: 100, aliases: ['Fenway', 'Boston'] },
      { text: 'Wrigley Field', points: 80, aliases: ['Wrigley', 'Chicago'] },
      { text: 'Yankee Stadium', points: 60, aliases: ['Yankee', 'Bronx', 'The House That Ruth Built'] },
      { text: 'Dodger Stadium', points: 40, aliases: ['Dodger', 'Chavez Ravine'] },
      { text: 'Camden Yards', points: 20, aliases: ['Camden', 'Oriole Park', 'Baltimore'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'MLB',
    question_text: 'Name a player who hit 30+ home runs AND stole 30+ bases in the same season',
    answers: [
      { text: 'Barry Bonds', points: 100, aliases: ['Bonds', 'Barry'] },
      { text: 'Ronald Acuna Jr', points: 80, aliases: ['Acuna', 'Ronald'] },
      { text: 'Alex Rodriguez', points: 60, aliases: ['A-Rod', 'Rodriguez'] },
      { text: 'Jose Canseco', points: 40, aliases: ['Canseco', 'Jose'] },
      { text: 'Shohei Ohtani', points: 20, aliases: ['Ohtani', 'Shohei'] },
    ],
    active: true,
    last_used_date: null,
  },

  // ═══════════════════════════════════════════════════════════════
  // NHL QUESTIONS (25)
  // ═══════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    question_text: 'Name a player who has won the Hart Trophy (NHL MVP)',
    answers: [
      { text: 'Wayne Gretzky', points: 100, aliases: ['Gretzky', 'Wayne', 'The Great One'] },
      { text: 'Connor McDavid', points: 80, aliases: ['McDavid', 'Connor'] },
      { text: 'Sidney Crosby', points: 60, aliases: ['Crosby', 'Sid', 'Sid the Kid'] },
      { text: 'Alexander Ovechkin', points: 40, aliases: ['Ovechkin', 'Ovi', 'Alex', 'Ovie'] },
      { text: 'Nathan MacKinnon', points: 20, aliases: ['MacKinnon', 'Nathan', 'Nate'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name an NHL team based in Canada',
    answers: [
      { text: 'Toronto Maple Leafs', points: 100, aliases: ['Maple Leafs', 'Leafs', 'Toronto'] },
      { text: 'Montreal Canadiens', points: 80, aliases: ['Canadiens', 'Habs', 'Montreal'] },
      { text: 'Edmonton Oilers', points: 60, aliases: ['Oilers', 'Edmonton'] },
      { text: 'Vancouver Canucks', points: 40, aliases: ['Canucks', 'Vancouver', 'Nucks'] },
      { text: 'Calgary Flames', points: 20, aliases: ['Flames', 'Calgary'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name a player who has scored 50+ goals in an NHL season',
    answers: [
      { text: 'Wayne Gretzky', points: 100, aliases: ['Gretzky', 'Wayne', 'The Great One'] },
      { text: 'Alexander Ovechkin', points: 80, aliases: ['Ovechkin', 'Ovi'] },
      { text: 'Mario Lemieux', points: 60, aliases: ['Lemieux', 'Mario', 'Super Mario'] },
      { text: 'Auston Matthews', points: 40, aliases: ['Matthews', 'Auston'] },
      { text: 'Steven Stamkos', points: 20, aliases: ['Stamkos', 'Steven', 'Stammer'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name an NHL goalie who has won the Vezina Trophy',
    answers: [
      { text: 'Patrick Roy', points: 100, aliases: ['Roy', 'Patrick', 'Saint Patrick'] },
      { text: 'Martin Brodeur', points: 80, aliases: ['Brodeur', 'Martin', 'Marty'] },
      { text: 'Carey Price', points: 60, aliases: ['Price', 'Carey'] },
      { text: 'Andrei Vasilevskiy', points: 40, aliases: ['Vasilevskiy', 'Vasi', 'Andrei'] },
      { text: 'Dominik Hasek', points: 20, aliases: ['Hasek', 'Dominik', 'The Dominator'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name a player who has won the Stanley Cup with the Pittsburgh Penguins',
    answers: [
      { text: 'Sidney Crosby', points: 100, aliases: ['Crosby', 'Sid', 'Sid the Kid'] },
      { text: 'Mario Lemieux', points: 80, aliases: ['Lemieux', 'Mario', 'Super Mario'] },
      { text: 'Evgeni Malkin', points: 60, aliases: ['Malkin', 'Geno', 'Evgeni'] },
      { text: 'Marc-Andre Fleury', points: 40, aliases: ['Fleury', 'Flower', 'Marc-Andre'] },
      { text: 'Phil Kessel', points: 20, aliases: ['Kessel', 'Phil'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name an NHL player born in Russia',
    answers: [
      { text: 'Alexander Ovechkin', points: 100, aliases: ['Ovechkin', 'Ovi', 'Alex'] },
      { text: 'Evgeni Malkin', points: 80, aliases: ['Malkin', 'Geno'] },
      { text: 'Andrei Vasilevskiy', points: 60, aliases: ['Vasilevskiy', 'Vasi'] },
      { text: 'Nikita Kucherov', points: 40, aliases: ['Kucherov', 'Nikita', 'Kuch'] },
      { text: 'Artemi Panarin', points: 20, aliases: ['Panarin', 'Artemi', 'Breadman', 'Bread Man'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name an NHL team that has won the Stanley Cup in the last 15 years',
    answers: [
      { text: 'Tampa Bay Lightning', points: 100, aliases: ['Lightning', 'Tampa', 'Tampa Bay', 'Bolts'] },
      { text: 'Pittsburgh Penguins', points: 80, aliases: ['Penguins', 'Pittsburgh', 'Pens'] },
      { text: 'Chicago Blackhawks', points: 60, aliases: ['Blackhawks', 'Chicago', 'Hawks'] },
      { text: 'Colorado Avalanche', points: 40, aliases: ['Avalanche', 'Colorado', 'Avs'] },
      { text: 'Vegas Golden Knights', points: 20, aliases: ['Golden Knights', 'Vegas', 'VGK', 'Knights'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name a player who has recorded 100+ points in an NHL season',
    answers: [
      { text: 'Wayne Gretzky', points: 100, aliases: ['Gretzky', 'Wayne'] },
      { text: 'Connor McDavid', points: 80, aliases: ['McDavid', 'Connor'] },
      { text: 'Mario Lemieux', points: 60, aliases: ['Lemieux', 'Mario'] },
      { text: 'Nikita Kucherov', points: 40, aliases: ['Kucherov', 'Nikita', 'Kuch'] },
      { text: 'Leon Draisaitl', points: 20, aliases: ['Draisaitl', 'Leon', 'Drai'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name an NHL team located in a warm-weather state',
    answers: [
      { text: 'Tampa Bay Lightning', points: 100, aliases: ['Lightning', 'Tampa', 'Bolts'] },
      { text: 'Florida Panthers', points: 80, aliases: ['Panthers', 'Florida', 'Cats'] },
      { text: 'Vegas Golden Knights', points: 60, aliases: ['Golden Knights', 'Vegas', 'VGK'] },
      { text: 'Arizona Coyotes', points: 40, aliases: ['Coyotes', 'Arizona', 'Yotes'] },
      { text: 'Dallas Stars', points: 20, aliases: ['Stars', 'Dallas'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name a player who has won the Conn Smythe Trophy (Playoff MVP)',
    answers: [
      { text: 'Sidney Crosby', points: 100, aliases: ['Crosby', 'Sid'] },
      { text: 'Patrick Roy', points: 80, aliases: ['Roy', 'Patrick'] },
      { text: 'Andrei Vasilevskiy', points: 60, aliases: ['Vasilevskiy', 'Vasi'] },
      { text: 'Cale Makar', points: 40, aliases: ['Makar', 'Cale'] },
      { text: 'Jonathan Toews', points: 20, aliases: ['Toews', 'Jonathan', 'Captain Serious'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name a defenseman who has won the Norris Trophy',
    answers: [
      { text: 'Bobby Orr', points: 100, aliases: ['Orr', 'Bobby'] },
      { text: 'Cale Makar', points: 80, aliases: ['Makar', 'Cale'] },
      { text: 'Victor Hedman', points: 60, aliases: ['Hedman', 'Victor'] },
      { text: 'Erik Karlsson', points: 40, aliases: ['Karlsson', 'Erik', 'EK65'] },
      { text: 'Nicklas Lidstrom', points: 20, aliases: ['Lidstrom', 'Nicklas', 'Nick', 'The Perfect Human'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name a player who wore number 99 or had their number retired league-wide',
    answers: [
      { text: 'Wayne Gretzky', points: 100, aliases: ['Gretzky', 'Wayne', 'The Great One', '99'] },
      { text: 'Mario Lemieux', points: 80, aliases: ['Lemieux', 'Mario', '66'] },
      { text: 'Bobby Orr', points: 60, aliases: ['Orr', 'Bobby', '4'] },
      { text: 'Gordie Howe', points: 40, aliases: ['Howe', 'Gordie', 'Mr Hockey', '9'] },
      { text: 'Maurice Richard', points: 20, aliases: ['Richard', 'Maurice', 'Rocket'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name an NHL team with a cat-related name',
    answers: [
      { text: 'Florida Panthers', points: 100, aliases: ['Panthers', 'Florida', 'Cats'] },
      { text: 'Nashville Predators', points: 80, aliases: ['Predators', 'Nashville', 'Preds'] },
      { text: 'San Jose Sharks', points: 60, aliases: ['Sharks', 'San Jose'] },
      { text: 'Carolina Hurricanes', points: 40, aliases: ['Hurricanes', 'Carolina', 'Canes'] },
      { text: 'Calgary Flames', points: 20, aliases: ['Flames', 'Calgary'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name a Swedish NHL player',
    answers: [
      { text: 'Henrik Lundqvist', points: 100, aliases: ['Lundqvist', 'Henrik', 'King Henrik', 'The King'] },
      { text: 'Nicklas Lidstrom', points: 80, aliases: ['Lidstrom', 'Nicklas'] },
      { text: 'Erik Karlsson', points: 60, aliases: ['Karlsson', 'Erik'] },
      { text: 'Victor Hedman', points: 40, aliases: ['Hedman', 'Victor'] },
      { text: 'William Nylander', points: 20, aliases: ['Nylander', 'William', 'Willy'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name a team that was part of the Original Six',
    answers: [
      { text: 'Montreal Canadiens', points: 100, aliases: ['Canadiens', 'Habs', 'Montreal'] },
      { text: 'Toronto Maple Leafs', points: 80, aliases: ['Maple Leafs', 'Leafs', 'Toronto'] },
      { text: 'Detroit Red Wings', points: 60, aliases: ['Red Wings', 'Detroit', 'Wings'] },
      { text: 'Boston Bruins', points: 40, aliases: ['Bruins', 'Boston', 'B\'s'] },
      { text: 'Chicago Blackhawks', points: 20, aliases: ['Blackhawks', 'Chicago'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name a player who has scored a hat trick in an NHL playoff game',
    answers: [
      { text: 'Wayne Gretzky', points: 100, aliases: ['Gretzky', 'Wayne'] },
      { text: 'Sidney Crosby', points: 80, aliases: ['Crosby', 'Sid'] },
      { text: 'Patrick Kane', points: 60, aliases: ['Kane', 'Patrick', 'Kaner'] },
      { text: 'Connor McDavid', points: 40, aliases: ['McDavid', 'Connor'] },
      { text: 'Brock Boeser', points: 20, aliases: ['Boeser', 'Brock'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name a goalie who has recorded a shutout in the Stanley Cup Finals',
    answers: [
      { text: 'Martin Brodeur', points: 100, aliases: ['Brodeur', 'Martin', 'Marty'] },
      { text: 'Patrick Roy', points: 80, aliases: ['Roy', 'Patrick'] },
      { text: 'Andrei Vasilevskiy', points: 60, aliases: ['Vasilevskiy', 'Vasi'] },
      { text: 'Marc-Andre Fleury', points: 40, aliases: ['Fleury', 'Flower'] },
      { text: 'Corey Crawford', points: 20, aliases: ['Crawford', 'Corey', 'Crow'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name an NHL player who played 20+ seasons',
    answers: [
      { text: 'Gordie Howe', points: 100, aliases: ['Howe', 'Gordie', 'Mr Hockey'] },
      { text: 'Jaromir Jagr', points: 80, aliases: ['Jagr', 'Jaromir'] },
      { text: 'Mark Messier', points: 60, aliases: ['Messier', 'Mark', 'Moose'] },
      { text: 'Patrick Marleau', points: 40, aliases: ['Marleau', 'Patrick', 'Patty'] },
      { text: 'Joe Thornton', points: 20, aliases: ['Thornton', 'Joe', 'Jumbo', 'Jumbo Joe'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name a famous NHL enforcer or fighter',
    answers: [
      { text: 'Bob Probert', points: 100, aliases: ['Probert', 'Bob'] },
      { text: 'Tie Domi', points: 80, aliases: ['Domi', 'Tie'] },
      { text: 'Georges Laraque', points: 60, aliases: ['Laraque', 'Georges'] },
      { text: 'Derek Boogaard', points: 40, aliases: ['Boogaard', 'Derek', 'Boogeyman'] },
      { text: 'Milan Lucic', points: 20, aliases: ['Lucic', 'Milan', 'Looch'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name an NHL team that joined as an expansion team since 2000',
    answers: [
      { text: 'Vegas Golden Knights', points: 100, aliases: ['Golden Knights', 'Vegas', 'VGK'] },
      { text: 'Seattle Kraken', points: 80, aliases: ['Kraken', 'Seattle'] },
      { text: 'Minnesota Wild', points: 60, aliases: ['Wild', 'Minnesota'] },
      { text: 'Columbus Blue Jackets', points: 40, aliases: ['Blue Jackets', 'Columbus', 'CBJ'] },
      { text: 'Nashville Predators', points: 20, aliases: ['Predators', 'Nashville', 'Preds'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name a player who captained their team to a Stanley Cup',
    answers: [
      { text: 'Sidney Crosby', points: 100, aliases: ['Crosby', 'Sid'] },
      { text: 'Mark Messier', points: 80, aliases: ['Messier', 'Mark'] },
      { text: 'Jonathan Toews', points: 60, aliases: ['Toews', 'Jonathan', 'Captain Serious'] },
      { text: 'Steven Stamkos', points: 40, aliases: ['Stamkos', 'Steven', 'Stammer'] },
      { text: 'Gabriel Landeskog', points: 20, aliases: ['Landeskog', 'Gabriel', 'Gabe'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name an NHL player known for being incredibly fast',
    answers: [
      { text: 'Connor McDavid', points: 100, aliases: ['McDavid', 'Connor'] },
      { text: 'Nathan MacKinnon', points: 80, aliases: ['MacKinnon', 'Nathan', 'Nate'] },
      { text: 'Paul Coffey', points: 60, aliases: ['Coffey', 'Paul'] },
      { text: 'Dylan Larkin', points: 40, aliases: ['Larkin', 'Dylan'] },
      { text: 'Mathew Barzal', points: 20, aliases: ['Barzal', 'Mathew', 'Mat', 'Barzy'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name a player who scored an overtime goal in the Stanley Cup Finals',
    answers: [
      { text: 'Patrick Kane', points: 100, aliases: ['Kane', 'Patrick', 'Kaner'] },
      { text: 'Bobby Orr', points: 80, aliases: ['Orr', 'Bobby'] },
      { text: 'Brett Hull', points: 60, aliases: ['Hull', 'Brett', 'Golden Brett'] },
      { text: 'Alec Martinez', points: 40, aliases: ['Martinez', 'Alec'] },
      { text: 'Jason Arnott', points: 20, aliases: ['Arnott', 'Jason'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name an NHL player who wore the letter C for 10+ years with one team',
    answers: [
      { text: 'Steve Yzerman', points: 100, aliases: ['Yzerman', 'Steve', 'Stevie Y'] },
      { text: 'Sidney Crosby', points: 80, aliases: ['Crosby', 'Sid'] },
      { text: 'Joe Sakic', points: 60, aliases: ['Sakic', 'Joe', 'Burnaby Joe'] },
      { text: 'Nicklas Lidstrom', points: 40, aliases: ['Lidstrom', 'Nicklas', 'Nick'] },
      { text: 'Jonathan Toews', points: 20, aliases: ['Toews', 'Jonathan'] },
    ],
    active: true,
    last_used_date: null,
  },
  {
    league: 'NHL',
    question_text: 'Name a Finnish NHL player',
    answers: [
      { text: 'Teemu Selanne', points: 100, aliases: ['Selanne', 'Teemu', 'Finnish Flash'] },
      { text: 'Mikko Rantanen', points: 80, aliases: ['Rantanen', 'Mikko'] },
      { text: 'Aleksander Barkov', points: 60, aliases: ['Barkov', 'Aleksander', 'Sasha'] },
      { text: 'Patrik Laine', points: 40, aliases: ['Laine', 'Patrik'] },
      { text: 'Tuukka Rask', points: 20, aliases: ['Rask', 'Tuukka'] },
    ],
    active: true,
    last_used_date: null,
  },
]

async function seedPowerPlayBank() {
  console.log(`Seeding ${questions.length} Power Play questions...`)

  const nbaCount = questions.filter(q => q.league === 'NBA').length
  const nflCount = questions.filter(q => q.league === 'NFL').length
  const mlbCount = questions.filter(q => q.league === 'MLB').length
  const nhlCount = questions.filter(q => q.league === 'NHL').length

  console.log(`  NBA: ${nbaCount} questions`)
  console.log(`  NFL: ${nflCount} questions`)
  console.log(`  MLB: ${mlbCount} questions`)
  console.log(`  NHL: ${nhlCount} questions`)

  // Insert in batches of 25
  const batchSize = 25
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize)
    const { error } = await supabase
      .from('power_play_bank')
      .insert(batch)

    if (error) {
      console.error(`Error inserting batch starting at index ${i}:`, error.message)
      process.exit(1)
    }

    console.log(`  Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(questions.length / batchSize)}`)
  }

  console.log('\nDone! All Power Play questions seeded successfully.')
}

seedPowerPlayBank()
