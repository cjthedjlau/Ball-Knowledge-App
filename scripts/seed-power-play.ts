// Seed power_play column in daily_games for all 4 leagues — 30 days each (120 total)
// Each question set has 5 questions, answers sum to 100 pts each → 500 max per day
//
// Run with:
// SUPABASE_SERVICE_ROLE_KEY=your-key npx ts-node --project scripts/tsconfig.json scripts/seed-power-play.ts

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://scloxktkudutupiyqvbx.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY env var is required')
  console.error('Usage: SUPABASE_SERVICE_ROLE_KEY=your-key npx ts-node ...')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

interface Answer { text: string; points: number; aliases?: string[] }
interface Question { text: string; answers: Answer[] }

// ── NBA Questions (30 days) ──
const NBA_DAYS: Question[][] = [
  // Day 1
  [
    { text: "Name an NBA team in Texas", answers: [
      { text: "Rockets", points: 38, aliases: ["houston", "houston rockets"] },
      { text: "Spurs", points: 28, aliases: ["san antonio", "san antonio spurs"] },
      { text: "Mavericks", points: 20, aliases: ["mavs", "dallas", "dallas mavericks"] },
      { text: "Stars", points: 8, aliases: ["texas stars"] },
      { text: "Legends", points: 6, aliases: ["texas legends"] },
    ]},
    { text: "Name a reason a player gets a technical foul", answers: [
      { text: "Arguing with ref", points: 40, aliases: ["arguing", "yelling at ref", "complaining"] },
      { text: "Taunting", points: 25, aliases: ["trash talk", "trash talking", "taunt"] },
      { text: "Hanging on rim", points: 18, aliases: ["rim hang", "hanging on the rim"] },
      { text: "Flopping", points: 10, aliases: ["flop", "diving", "fake foul"] },
      { text: "Delay of game", points: 7, aliases: ["delay", "kicking ball", "kick ball"] },
    ]},
    { text: "Name a position in basketball", answers: [
      { text: "Point guard", points: 36, aliases: ["pg", "point"] },
      { text: "Center", points: 26, aliases: ["c", "the five", "five"] },
      { text: "Shooting guard", points: 20, aliases: ["sg", "two guard", "the two"] },
      { text: "Small forward", points: 12, aliases: ["sf", "the three", "three"] },
      { text: "Power forward", points: 6, aliases: ["pf", "the four", "four"] },
    ]},
    { text: "Name something you see on an NBA court", answers: [
      { text: "Hoop", points: 38, aliases: ["basket", "rim", "backboard", "net"] },
      { text: "Three-point line", points: 26, aliases: ["three point line", "arc", "3 point line"] },
      { text: "Free throw line", points: 18, aliases: ["foul line", "charity stripe"] },
      { text: "Center court logo", points: 12, aliases: ["logo", "half court logo", "midcourt"] },
      { text: "Scoreboard", points: 6, aliases: ["jumbotron", "shot clock", "clock"] },
    ]},
    { text: "Name an NBA player known for dunking", answers: [
      { text: "LeBron James", points: 36, aliases: ["lebron", "james", "bron"] },
      { text: "Michael Jordan", points: 28, aliases: ["jordan", "mj", "mike"] },
      { text: "Vince Carter", points: 18, aliases: ["carter", "vinsanity", "vince"] },
      { text: "Shaq", points: 12, aliases: ["shaquille", "shaquille oneal", "oneal", "o'neal"] },
      { text: "Ja Morant", points: 6, aliases: ["ja", "morant"] },
    ]},
  ],

  // Day 2
  [
    { text: "Name a stat tracked in basketball", answers: [
      { text: "Points", points: 40, aliases: ["scoring", "pts", "ppg"] },
      { text: "Rebounds", points: 26, aliases: ["boards", "rebs", "rpg"] },
      { text: "Assists", points: 18, aliases: ["dimes", "apg"] },
      { text: "Steals", points: 10, aliases: ["spg", "steal"] },
      { text: "Blocks", points: 6, aliases: ["bpg", "block", "swats"] },
    ]},
    { text: "Name a city with two NBA teams", answers: [
      { text: "Los Angeles", points: 44, aliases: ["la", "l.a."] },
      { text: "New York", points: 28, aliases: ["ny", "nyc", "new york city"] },
      { text: "Chicago", points: 14, aliases: ["chi"] },
      { text: "San Francisco", points: 8, aliases: ["sf", "bay area", "golden state"] },
      { text: "Dallas", points: 6, aliases: ["dfw"] },
    ]},
    { text: "Name something fans chant at an NBA game", answers: [
      { text: "Defense", points: 42, aliases: ["dee-fense", "d-fense"] },
      { text: "MVP", points: 26, aliases: ["m-v-p"] },
      { text: "Ref you suck", points: 16, aliases: ["refs suck", "ref sucks"] },
      { text: "Let's go", points: 10, aliases: ["lets go team"] },
      { text: "Airball", points: 6, aliases: ["air ball"] },
    ]},
    { text: "Name an NBA team with an animal mascot", answers: [
      { text: "Bulls", points: 36, aliases: ["chicago", "chicago bulls"] },
      { text: "Raptors", points: 26, aliases: ["toronto", "toronto raptors"] },
      { text: "Hawks", points: 18, aliases: ["atlanta", "atlanta hawks"] },
      { text: "Timberwolves", points: 12, aliases: ["wolves", "minnesota", "twolves"] },
      { text: "Grizzlies", points: 8, aliases: ["grizz", "memphis", "memphis grizzlies"] },
    ]},
    { text: "Name a type of foul in basketball", answers: [
      { text: "Personal foul", points: 38, aliases: ["personal", "regular foul"] },
      { text: "Flagrant foul", points: 26, aliases: ["flagrant", "flagrant 1", "flagrant 2"] },
      { text: "Technical foul", points: 20, aliases: ["technical", "tech"] },
      { text: "Charging", points: 10, aliases: ["charge", "offensive foul"] },
      { text: "Intentional foul", points: 6, aliases: ["intentional", "hack"] },
    ]},
  ],

  // Day 3
  [
    { text: "Name an NBA team that has won the most championships", answers: [
      { text: "Celtics", points: 38, aliases: ["boston", "boston celtics"] },
      { text: "Lakers", points: 30, aliases: ["la lakers", "los angeles lakers"] },
      { text: "Bulls", points: 16, aliases: ["chicago", "chicago bulls"] },
      { text: "Warriors", points: 10, aliases: ["golden state", "gsw"] },
      { text: "Spurs", points: 6, aliases: ["san antonio", "san antonio spurs"] },
    ]},
    { text: "Name something a player does at halftime", answers: [
      { text: "Rest", points: 36, aliases: ["sit down", "relax", "recover"] },
      { text: "Watch film", points: 26, aliases: ["film", "review plays", "tape"] },
      { text: "Get treatment", points: 18, aliases: ["ice", "trainer", "tape up", "treatment"] },
      { text: "Eat a snack", points: 12, aliases: ["snack", "eat", "orange slices", "fruit"] },
      { text: "Shoot around", points: 8, aliases: ["warmup", "practice shots", "shoot"] },
    ]},
    { text: "Name a famous NBA arena", answers: [
      { text: "Madison Square Garden", points: 42, aliases: ["msg", "the garden", "madison square"] },
      { text: "Staples Center", points: 26, aliases: ["staples", "crypto.com", "crypto arena"] },
      { text: "United Center", points: 16, aliases: ["united", "chicago arena"] },
      { text: "TD Garden", points: 10, aliases: ["td", "boston garden"] },
      { text: "Chase Center", points: 6, aliases: ["chase", "warriors arena"] },
    ]},
    { text: "Name a basketball shoe brand", answers: [
      { text: "Nike", points: 42, aliases: ["nike basketball"] },
      { text: "Jordan", points: 28, aliases: ["air jordan", "jordan brand"] },
      { text: "Adidas", points: 16, aliases: ["adidas basketball"] },
      { text: "New Balance", points: 8, aliases: ["nb", "new balance basketball"] },
      { text: "Puma", points: 6, aliases: ["puma basketball", "puma hoops"] },
    ]},
    { text: "Name a penalty for a violation in basketball", answers: [
      { text: "Turnover", points: 38, aliases: ["loss of possession", "give up ball"] },
      { text: "Free throws", points: 28, aliases: ["foul shots", "free throw"] },
      { text: "Jump ball", points: 16, aliases: ["held ball"] },
      { text: "Shot clock reset", points: 12, aliases: ["reset clock", "shot clock"] },
      { text: "Ejection", points: 6, aliases: ["ejected", "tossed", "thrown out"] },
    ]},
  ],

  // Day 4
  [
    { text: "Name an NBA player who wore number 23", answers: [
      { text: "Michael Jordan", points: 44, aliases: ["jordan", "mj", "mike jordan"] },
      { text: "LeBron James", points: 28, aliases: ["lebron", "bron"] },
      { text: "Jimmy Butler", points: 14, aliases: ["butler", "jimmy"] },
      { text: "Blake Griffin", points: 8, aliases: ["griffin", "blake"] },
      { text: "Draymond Green", points: 6, aliases: ["draymond", "green"] },
    ]},
    { text: "Name something that happens at the NBA Draft", answers: [
      { text: "First pick announced", points: 38, aliases: ["number one pick", "first overall", "top pick"] },
      { text: "Trades", points: 26, aliases: ["trade", "draft day trade", "player traded"] },
      { text: "Handshake with commissioner", points: 18, aliases: ["handshake", "shaking hands", "commissioner"] },
      { text: "Wearing a suit", points: 12, aliases: ["suit", "suits", "dressed up"] },
      { text: "Booing", points: 6, aliases: ["boos", "fans booing", "crowd boos"] },
    ]},
    { text: "Name a common basketball injury", answers: [
      { text: "ACL tear", points: 38, aliases: ["acl", "torn acl", "knee ligament"] },
      { text: "Ankle sprain", points: 28, aliases: ["sprained ankle", "rolled ankle", "ankle"] },
      { text: "Hamstring", points: 16, aliases: ["hamstring strain", "pulled hamstring", "hammy"] },
      { text: "Concussion", points: 12, aliases: ["head injury"] },
      { text: "Broken finger", points: 6, aliases: ["finger", "jammed finger", "fractured finger"] },
    ]},
    { text: "Name an NBA team from Florida", answers: [
      { text: "Heat", points: 44, aliases: ["miami", "miami heat"] },
      { text: "Magic", points: 32, aliases: ["orlando", "orlando magic"] },
      { text: "Jaguars", points: 12, aliases: ["jacksonville"] },
      { text: "Buccaneers", points: 7, aliases: ["tampa", "bucs"] },
      { text: "Panthers", points: 5, aliases: ["florida panthers"] },
    ]},
    { text: "Name something sold at an NBA concession stand", answers: [
      { text: "Hot dog", points: 36, aliases: ["hotdog", "hot dogs", "hotdogs"] },
      { text: "Beer", points: 28, aliases: ["beers", "alcohol", "drink"] },
      { text: "Nachos", points: 18, aliases: ["nacho", "chips and cheese"] },
      { text: "Popcorn", points: 12, aliases: ["pop corn"] },
      { text: "Soda", points: 6, aliases: ["pop", "coke", "soft drink", "pepsi"] },
    ]},
  ],

  // Day 5
  [
    { text: "Name a country that produces NBA players", answers: [
      { text: "USA", points: 38, aliases: ["united states", "america", "us"] },
      { text: "Canada", points: 24, aliases: ["canadian"] },
      { text: "France", points: 18, aliases: ["french"] },
      { text: "Serbia", points: 12, aliases: ["serbian"] },
      { text: "Nigeria", points: 8, aliases: ["nigerian"] },
    ]},
    { text: "Name something an NBA coach draws up during a timeout", answers: [
      { text: "Play", points: 42, aliases: ["a play", "set play", "offensive play"] },
      { text: "Screen", points: 24, aliases: ["pick", "pick and roll", "screen play"] },
      { text: "Inbounds play", points: 16, aliases: ["inbound", "inbound play"] },
      { text: "Defense", points: 12, aliases: ["defensive scheme", "defensive play"] },
      { text: "Last shot", points: 6, aliases: ["game winner", "final play", "buzzer beater play"] },
    ]},
    { text: "Name a player who played for the Lakers", answers: [
      { text: "Kobe Bryant", points: 40, aliases: ["kobe", "bryant", "mamba"] },
      { text: "LeBron James", points: 26, aliases: ["lebron", "bron"] },
      { text: "Shaq", points: 18, aliases: ["shaquille", "shaquille oneal", "o'neal"] },
      { text: "Magic Johnson", points: 10, aliases: ["magic", "johnson"] },
      { text: "Kareem Abdul-Jabbar", points: 6, aliases: ["kareem", "abdul jabbar", "jabbar"] },
    ]},
    { text: "Name a type of pass in basketball", answers: [
      { text: "Chest pass", points: 36, aliases: ["chest"] },
      { text: "Bounce pass", points: 28, aliases: ["bounce"] },
      { text: "Behind the back", points: 18, aliases: ["behind back", "btb pass"] },
      { text: "Alley-oop", points: 12, aliases: ["alley oop", "oop", "lob"] },
      { text: "No-look pass", points: 6, aliases: ["no look", "blind pass"] },
    ]},
    { text: "Name something that happens in overtime", answers: [
      { text: "Jump ball", points: 36, aliases: ["tip off", "tipoff"] },
      { text: "Fouling out", points: 26, aliases: ["foul out", "fouls out", "disqualified"] },
      { text: "Buzzer beater", points: 20, aliases: ["game winner", "last second shot"] },
      { text: "Exhaustion", points: 12, aliases: ["tired", "fatigue", "gassed"] },
      { text: "Free throws", points: 6, aliases: ["foul shots", "charity stripe"] },
    ]},
  ],

  // Day 6
  [
    { text: "Name an NBA player nicknamed after an animal", answers: [
      { text: "Black Mamba", points: 40, aliases: ["mamba", "kobe", "kobe bryant"] },
      { text: "The Spider", points: 22, aliases: ["spider", "donovan mitchell", "mitchell"] },
      { text: "Ant", points: 18, aliases: ["ant man", "anthony edwards", "edwards"] },
      { text: "The Claw", points: 12, aliases: ["claw", "kawhi", "kawhi leonard"] },
      { text: "The Hawk", points: 8, aliases: ["hawk", "dominique wilkins", "dominique"] },
    ]},
    { text: "Name a type of defense in basketball", answers: [
      { text: "Man-to-man", points: 40, aliases: ["man to man", "man", "man defense"] },
      { text: "Zone", points: 28, aliases: ["zone defense", "2-3 zone", "3-2 zone"] },
      { text: "Full court press", points: 16, aliases: ["press", "full court", "pressing"] },
      { text: "Box-and-one", points: 10, aliases: ["box and one", "box and 1"] },
      { text: "Trap", points: 6, aliases: ["trapping", "double team", "trap defense"] },
    ]},
    { text: "Name something refs use during an NBA game", answers: [
      { text: "Whistle", points: 44, aliases: ["whistles"] },
      { text: "Replay monitor", points: 24, aliases: ["replay", "monitor", "video review", "instant replay"] },
      { text: "Hand signals", points: 16, aliases: ["signals", "hand signal"] },
      { text: "Scorebook", points: 10, aliases: ["book", "foul tracking"] },
      { text: "Microphone", points: 6, aliases: ["mic", "announcement"] },
    ]},
    { text: "Name a famous NBA rivalry", answers: [
      { text: "Lakers vs Celtics", points: 42, aliases: ["celtics lakers", "lakers celtics", "boston la"] },
      { text: "Bulls vs Pistons", points: 22, aliases: ["pistons bulls", "chicago detroit"] },
      { text: "Heat vs Knicks", points: 16, aliases: ["knicks heat", "miami new york"] },
      { text: "Warriors vs Cavs", points: 12, aliases: ["cavs warriors", "golden state cleveland"] },
      { text: "Suns vs Spurs", points: 8, aliases: ["spurs suns", "phoenix san antonio"] },
    ]},
    { text: "Name an NBA All-Star Weekend event", answers: [
      { text: "Dunk Contest", points: 40, aliases: ["slam dunk", "dunk competition", "dunking contest"] },
      { text: "Three-Point Contest", points: 28, aliases: ["3 point contest", "three point shootout", "3pt contest"] },
      { text: "Skills Challenge", points: 16, aliases: ["skills competition", "skills"] },
      { text: "Celebrity Game", points: 10, aliases: ["celeb game", "celebrity"] },
      { text: "Rising Stars", points: 6, aliases: ["rookie game", "rising stars game"] },
    ]},
  ],

  // Day 7
  [
    { text: "Name a player who played for the Warriors", answers: [
      { text: "Steph Curry", points: 44, aliases: ["curry", "stephen curry", "steph"] },
      { text: "Klay Thompson", points: 24, aliases: ["klay", "thompson"] },
      { text: "Kevin Durant", points: 16, aliases: ["kd", "durant"] },
      { text: "Draymond Green", points: 10, aliases: ["draymond", "green"] },
      { text: "Andre Iguodala", points: 6, aliases: ["iguodala", "iggy", "andre"] },
    ]},
    { text: "Name something a player does before a free throw", answers: [
      { text: "Dribble", points: 38, aliases: ["bounces ball", "dribbles", "bounce"] },
      { text: "Deep breath", points: 24, aliases: ["breathe", "breathing", "exhale"] },
      { text: "Spin the ball", points: 18, aliases: ["spinning", "spin"] },
      { text: "Wipe hands", points: 12, aliases: ["wipe sweat", "wipes hands", "dry hands"] },
      { text: "Talk to himself", points: 8, aliases: ["self talk", "whisper", "focus"] },
    ]},
    { text: "Name a basketball movie", answers: [
      { text: "Space Jam", points: 40, aliases: ["space jam 1", "space jam 2"] },
      { text: "Hoosiers", points: 24, aliases: ["hoosier"] },
      { text: "White Men Can't Jump", points: 16, aliases: ["white men cant jump"] },
      { text: "He Got Game", points: 12, aliases: ["he got game"] },
      { text: "Coach Carter", points: 8, aliases: ["coach carter"] },
    ]},
    { text: "Name a way a possession ends in basketball", answers: [
      { text: "Made shot", points: 36, aliases: ["basket", "score", "bucket", "field goal"] },
      { text: "Turnover", points: 26, aliases: ["steal", "lost ball", "bad pass"] },
      { text: "Foul", points: 18, aliases: ["fouled", "shooting foul"] },
      { text: "Shot clock violation", points: 12, aliases: ["shot clock", "24 seconds"] },
      { text: "Out of bounds", points: 8, aliases: ["ball out", "sideline"] },
    ]},
    { text: "Name something a coach yells from the sideline", answers: [
      { text: "Defense", points: 38, aliases: ["get back", "play defense", "d up"] },
      { text: "Timeout", points: 24, aliases: ["time", "time out"] },
      { text: "Pass the ball", points: 18, aliases: ["pass", "move the ball", "swing it"] },
      { text: "Foul", points: 12, aliases: ["foul him", "grab him"] },
      { text: "Box out", points: 8, aliases: ["rebound", "boards", "hit the glass"] },
    ]},
  ],

  // Day 8
  [
    { text: "Name an NBA team with a color in its name", answers: [
      { text: "Celtics", points: 36, aliases: ["boston", "boston celtics", "green"] },
      { text: "Nets", points: 24, aliases: ["brooklyn", "brooklyn nets"] },
      { text: "Blues", points: 18, aliases: ["st louis blues"] },
      { text: "Suns", points: 14, aliases: ["phoenix", "phoenix suns"] },
      { text: "Reds", points: 8, aliases: ["cincinnati reds"] },
    ]},
    { text: "Name a famous NBA coach", answers: [
      { text: "Phil Jackson", points: 38, aliases: ["phil", "jackson", "zen master"] },
      { text: "Gregg Popovich", points: 26, aliases: ["pop", "popovich", "gregg"] },
      { text: "Pat Riley", points: 18, aliases: ["riley", "pat"] },
      { text: "Red Auerbach", points: 12, aliases: ["red", "auerbach"] },
      { text: "Steve Kerr", points: 6, aliases: ["kerr", "steve"] },
    ]},
    { text: "Name something players wear on the court", answers: [
      { text: "Jersey", points: 38, aliases: ["uniform", "shirt"] },
      { text: "Sneakers", points: 26, aliases: ["shoes", "basketball shoes", "kicks"] },
      { text: "Headband", points: 18, aliases: ["head band"] },
      { text: "Sleeve", points: 12, aliases: ["arm sleeve", "leg sleeve", "compression sleeve"] },
      { text: "Mouthguard", points: 6, aliases: ["mouth guard", "mouthpiece"] },
    ]},
    { text: "Name a player famous for three-point shooting", answers: [
      { text: "Steph Curry", points: 44, aliases: ["curry", "stephen curry", "steph"] },
      { text: "Ray Allen", points: 24, aliases: ["ray", "allen"] },
      { text: "Reggie Miller", points: 16, aliases: ["reggie", "miller"] },
      { text: "Klay Thompson", points: 10, aliases: ["klay", "thompson"] },
      { text: "Larry Bird", points: 6, aliases: ["bird", "larry"] },
    ]},
    { text: "Name a way to score in basketball", answers: [
      { text: "Three pointer", points: 36, aliases: ["three", "3 pointer", "from deep", "3pt"] },
      { text: "Layup", points: 26, aliases: ["lay up", "finger roll"] },
      { text: "Dunk", points: 20, aliases: ["slam dunk", "jam", "slam"] },
      { text: "Free throw", points: 12, aliases: ["foul shot", "charity stripe"] },
      { text: "Mid-range", points: 6, aliases: ["jumper", "pull up", "mid range"] },
    ]},
  ],

  // Day 9
  [
    { text: "Name an NBA team from California", answers: [
      { text: "Lakers", points: 38, aliases: ["la lakers", "los angeles lakers"] },
      { text: "Warriors", points: 28, aliases: ["golden state", "gsw", "golden state warriors"] },
      { text: "Clippers", points: 18, aliases: ["la clippers", "los angeles clippers"] },
      { text: "Kings", points: 10, aliases: ["sacramento", "sacramento kings"] },
      { text: "Suns", points: 6, aliases: ["phoenix", "phoenix suns"] },
    ]},
    { text: "Name a basketball term for scoring easily", answers: [
      { text: "Layup", points: 38, aliases: ["lay up", "easy layup"] },
      { text: "Fast break", points: 26, aliases: ["fastbreak", "transition"] },
      { text: "And-one", points: 18, aliases: ["and one", "and 1"] },
      { text: "Open shot", points: 12, aliases: ["wide open", "uncontested"] },
      { text: "Putback", points: 6, aliases: ["put back", "tip in", "offensive rebound"] },
    ]},
    { text: "Name a player who played for the Celtics", answers: [
      { text: "Larry Bird", points: 36, aliases: ["bird", "larry"] },
      { text: "Paul Pierce", points: 26, aliases: ["pierce", "the truth", "paul"] },
      { text: "Bill Russell", points: 18, aliases: ["russell", "bill"] },
      { text: "Kevin Garnett", points: 12, aliases: ["kg", "garnett", "kevin"] },
      { text: "Jayson Tatum", points: 8, aliases: ["tatum", "jayson"] },
    ]},
    { text: "Name something that happens during a timeout", answers: [
      { text: "Huddle", points: 38, aliases: ["team huddle", "gather around coach"] },
      { text: "Substitution", points: 24, aliases: ["sub", "player change", "subs"] },
      { text: "Replay on screen", points: 18, aliases: ["replay", "jumbotron replay"] },
      { text: "Cheerleaders perform", points: 12, aliases: ["cheerleaders", "dance team", "dancers"] },
      { text: "T-shirt cannon", points: 8, aliases: ["tshirt cannon", "shirt toss", "giveaway"] },
    ]},
    { text: "Name a word that means a basketball rebound", answers: [
      { text: "Board", points: 40, aliases: ["boards", "glass"] },
      { text: "Carrom", points: 22, aliases: ["carom", "bounce"] },
      { text: "Crash", points: 18, aliases: ["crashing", "crash the boards"] },
      { text: "Snag", points: 12, aliases: ["grabbed", "snagged"] },
      { text: "Tip", points: 8, aliases: ["tip out", "tip in"] },
    ]},
  ],

  // Day 10
  [
    { text: "Name an NBA player with a famous nickname", answers: [
      { text: "King James", points: 38, aliases: ["king", "lebron", "lebron james"] },
      { text: "The Answer", points: 24, aliases: ["ai", "allen iverson", "iverson"] },
      { text: "Black Mamba", points: 18, aliases: ["mamba", "kobe", "kobe bryant"] },
      { text: "The Big Fundamental", points: 12, aliases: ["tim duncan", "duncan", "timmy"] },
      { text: "Greek Freak", points: 8, aliases: ["giannis", "giannis antetokounmpo", "antetokounmpo"] },
    ]},
    { text: "Name something thrown onto the court by fans", answers: [
      { text: "Beer", points: 36, aliases: ["drink", "cup", "alcohol"] },
      { text: "Popcorn", points: 26, aliases: ["food", "popcorn bucket"] },
      { text: "Phone", points: 18, aliases: ["cell phone", "cellphone"] },
      { text: "Shirt", points: 12, aliases: ["jersey", "clothing", "hat"] },
      { text: "Water bottle", points: 8, aliases: ["water", "bottle"] },
    ]},
    { text: "Name a college known for producing NBA players", answers: [
      { text: "Duke", points: 38, aliases: ["duke university", "blue devils"] },
      { text: "Kentucky", points: 28, aliases: ["uk", "wildcats", "university of kentucky"] },
      { text: "North Carolina", points: 18, aliases: ["unc", "tar heels", "carolina"] },
      { text: "UCLA", points: 10, aliases: ["bruins"] },
      { text: "Kansas", points: 6, aliases: ["ku", "jayhawks"] },
    ]},
    { text: "Name a reason a player gets ejected", answers: [
      { text: "Two technicals", points: 40, aliases: ["double technical", "two techs", "2 techs"] },
      { text: "Flagrant 2", points: 26, aliases: ["flagrant foul", "flagrant two"] },
      { text: "Fighting", points: 18, aliases: ["fight", "punching", "brawl"] },
      { text: "Ref abuse", points: 10, aliases: ["cursing at ref", "threatening ref"] },
      { text: "Throwing ball", points: 6, aliases: ["threw ball", "throwing object"] },
    ]},
    { text: "Name a basketball video game", answers: [
      { text: "NBA 2K", points: 48, aliases: ["2k", "2k25", "2k24", "nba2k"] },
      { text: "NBA Live", points: 22, aliases: ["live", "ea nba"] },
      { text: "NBA Jam", points: 16, aliases: ["jam", "nba jam"] },
      { text: "NBA Street", points: 8, aliases: ["street", "nba street vol 2"] },
      { text: "NBA Playgrounds", points: 6, aliases: ["playgrounds"] },
    ]},
  ],

  // Day 11
  [
    { text: "Name a team LeBron James played for", answers: [
      { text: "Cavaliers", points: 36, aliases: ["cavs", "cleveland", "cleveland cavaliers"] },
      { text: "Heat", points: 28, aliases: ["miami", "miami heat"] },
      { text: "Lakers", points: 22, aliases: ["la lakers", "los angeles lakers"] },
      { text: "Suns", points: 8, aliases: ["phoenix", "phoenix suns"] },
      { text: "Bulls", points: 6, aliases: ["chicago"] },
    ]},
    { text: "Name something on a basketball scoreboard", answers: [
      { text: "Score", points: 38, aliases: ["points", "team score"] },
      { text: "Time", points: 26, aliases: ["clock", "game clock", "timer"] },
      { text: "Quarter", points: 16, aliases: ["period", "half"] },
      { text: "Fouls", points: 12, aliases: ["team fouls", "foul count"] },
      { text: "Shot clock", points: 8, aliases: ["24 second clock", "24 seconds"] },
    ]},
    { text: "Name an NBA expansion or relocated team", answers: [
      { text: "Thunder", points: 36, aliases: ["okc", "oklahoma city", "sonics to okc"] },
      { text: "Pelicans", points: 24, aliases: ["new orleans", "new orleans pelicans"] },
      { text: "Nets", points: 18, aliases: ["brooklyn", "new jersey nets"] },
      { text: "Grizzlies", points: 14, aliases: ["memphis", "vancouver grizzlies"] },
      { text: "Hornets", points: 8, aliases: ["charlotte", "bobcats"] },
    ]},
    { text: "Name a basketball surface or court type", answers: [
      { text: "Hardwood", points: 42, aliases: ["wood", "maple", "wooden"] },
      { text: "Concrete", points: 26, aliases: ["cement", "outdoor", "blacktop"] },
      { text: "Rubber", points: 16, aliases: ["sport court", "rubber court"] },
      { text: "Asphalt", points: 10, aliases: ["pavement", "street"] },
      { text: "Gym floor", points: 6, aliases: ["gym", "school gym", "indoor"] },
    ]},
    { text: "Name a player famous for passing", answers: [
      { text: "Magic Johnson", points: 38, aliases: ["magic", "johnson"] },
      { text: "John Stockton", points: 24, aliases: ["stockton", "john"] },
      { text: "Chris Paul", points: 18, aliases: ["cp3", "paul", "chris"] },
      { text: "Steve Nash", points: 12, aliases: ["nash", "steve"] },
      { text: "Jason Kidd", points: 8, aliases: ["kidd", "j kidd", "jason"] },
    ]},
  ],

  // Day 12
  [
    { text: "Name a basketball drill kids do at practice", answers: [
      { text: "Layups", points: 38, aliases: ["layup line", "layup drill"] },
      { text: "Free throws", points: 26, aliases: ["foul shots", "shooting free throws"] },
      { text: "Dribbling", points: 18, aliases: ["ball handling", "dribble drills"] },
      { text: "Suicides", points: 12, aliases: ["sprints", "running", "line drills"] },
      { text: "Passing", points: 6, aliases: ["passing drills", "chest pass drill"] },
    ]},
    { text: "Name something a player does after getting dunked on", answers: [
      { text: "Walks away", points: 38, aliases: ["walk away", "leave", "jog back"] },
      { text: "Argues foul", points: 24, aliases: ["calls foul", "complains", "says he was fouled"] },
      { text: "Shakes head", points: 18, aliases: ["head shake", "shakes it off"] },
      { text: "Gets revenge", points: 12, aliases: ["dunks back", "payback", "retaliates"] },
      { text: "Laughs", points: 8, aliases: ["laugh", "smiles", "laughs it off"] },
    ]},
    { text: "Name an NBA team from the Midwest", answers: [
      { text: "Bulls", points: 36, aliases: ["chicago", "chicago bulls"] },
      { text: "Bucks", points: 26, aliases: ["milwaukee", "milwaukee bucks"] },
      { text: "Pacers", points: 18, aliases: ["indiana", "indiana pacers"] },
      { text: "Cavaliers", points: 12, aliases: ["cavs", "cleveland", "cleveland cavaliers"] },
      { text: "Pistons", points: 8, aliases: ["detroit", "detroit pistons"] },
    ]},
    { text: "Name a famous dunk contest participant", answers: [
      { text: "Michael Jordan", points: 36, aliases: ["jordan", "mj"] },
      { text: "Vince Carter", points: 28, aliases: ["vince", "carter", "vinsanity"] },
      { text: "Zach LaVine", points: 16, aliases: ["lavine", "zach"] },
      { text: "Dwight Howard", points: 12, aliases: ["dwight", "howard"] },
      { text: "Dominique Wilkins", points: 8, aliases: ["dominique", "wilkins", "nique"] },
    ]},
    { text: "Name something that makes an arena loud", answers: [
      { text: "Dunk", points: 38, aliases: ["big dunk", "slam", "poster"] },
      { text: "Buzzer beater", points: 26, aliases: ["game winner", "last second shot"] },
      { text: "Block", points: 16, aliases: ["big block", "rejection", "swat"] },
      { text: "And-one", points: 12, aliases: ["and one", "and 1", "foul and score"] },
      { text: "Fight", points: 8, aliases: ["scuffle", "altercation", "brawl"] },
    ]},
  ],

  // Day 13
  [
    { text: "Name a player who played for the Bulls", answers: [
      { text: "Michael Jordan", points: 44, aliases: ["jordan", "mj", "mike"] },
      { text: "Scottie Pippen", points: 24, aliases: ["pippen", "scottie"] },
      { text: "Dennis Rodman", points: 16, aliases: ["rodman", "dennis"] },
      { text: "Derrick Rose", points: 10, aliases: ["d rose", "rose", "derrick"] },
      { text: "DeMar DeRozan", points: 6, aliases: ["demar", "derozan"] },
    ]},
    { text: "Name a basketball play or set", answers: [
      { text: "Pick and roll", points: 40, aliases: ["pick & roll", "screen and roll", "pnr"] },
      { text: "Isolation", points: 24, aliases: ["iso", "iso play"] },
      { text: "Fast break", points: 18, aliases: ["fastbreak", "transition", "run"] },
      { text: "Alley-oop", points: 12, aliases: ["alley oop", "oop", "lob play"] },
      { text: "Post up", points: 6, aliases: ["post", "back down", "low post"] },
    ]},
    { text: "Name an NBA award", answers: [
      { text: "MVP", points: 42, aliases: ["most valuable player"] },
      { text: "Rookie of the Year", points: 24, aliases: ["roy", "roty", "rookie award"] },
      { text: "Defensive Player of the Year", points: 16, aliases: ["dpoy", "defensive player"] },
      { text: "Sixth Man", points: 12, aliases: ["6th man", "sixth man of the year", "6moy"] },
      { text: "Most Improved", points: 6, aliases: ["mip", "most improved player"] },
    ]},
    { text: "Name a way a game can be delayed", answers: [
      { text: "Replay review", points: 38, aliases: ["review", "replay", "challenge", "instant replay"] },
      { text: "Injury", points: 26, aliases: ["player hurt", "player down", "medical"] },
      { text: "Fight", points: 16, aliases: ["altercation", "brawl", "scuffle"] },
      { text: "Wet floor", points: 12, aliases: ["slippery floor", "leak", "sweat on floor"] },
      { text: "Fan on court", points: 8, aliases: ["court invasion", "streaker", "fan runs"] },
    ]},
    { text: "Name something NBA players do in the offseason", answers: [
      { text: "Train", points: 38, aliases: ["work out", "workout", "practice", "gym"] },
      { text: "Vacation", points: 26, aliases: ["travel", "beach", "trip"] },
      { text: "Play pickup", points: 16, aliases: ["pickup games", "run", "open gym"] },
      { text: "Film commercials", points: 12, aliases: ["endorsements", "commercials", "ads"] },
      { text: "Host camps", points: 8, aliases: ["basketball camp", "youth camp", "camp"] },
    ]},
  ],

  // Day 14
  [
    { text: "Name an NBA team named after something in nature", answers: [
      { text: "Thunder", points: 36, aliases: ["okc", "oklahoma city thunder"] },
      { text: "Heat", points: 26, aliases: ["miami", "miami heat"] },
      { text: "Suns", points: 18, aliases: ["phoenix", "phoenix suns"] },
      { text: "Nuggets", points: 12, aliases: ["denver", "denver nuggets"] },
      { text: "Avalanche", points: 8, aliases: ["colorado avalanche"] },
    ]},
    { text: "Name a player who changed teams in a famous trade", answers: [
      { text: "James Harden", points: 36, aliases: ["harden", "james"] },
      { text: "Kevin Garnett", points: 24, aliases: ["kg", "garnett"] },
      { text: "Kawhi Leonard", points: 18, aliases: ["kawhi", "leonard", "the claw"] },
      { text: "Charles Barkley", points: 14, aliases: ["barkley", "charles", "chuck"] },
      { text: "Wilt Chamberlain", points: 8, aliases: ["wilt", "chamberlain"] },
    ]},
    { text: "Name a basketball league besides the NBA", answers: [
      { text: "NCAA", points: 38, aliases: ["college", "college basketball", "march madness"] },
      { text: "EuroLeague", points: 24, aliases: ["euro league", "european league", "europe"] },
      { text: "WNBA", points: 20, aliases: ["womens nba", "women's basketball"] },
      { text: "G League", points: 12, aliases: ["nba g league", "d league", "gleague"] },
      { text: "Big3", points: 6, aliases: ["big 3", "3 on 3", "ice cube league"] },
    ]},
    { text: "Name something a rookie struggles with in the NBA", answers: [
      { text: "Speed of game", points: 40, aliases: ["pace", "quickness", "tempo"] },
      { text: "Physicality", points: 24, aliases: ["strength", "size", "body"] },
      { text: "Travel schedule", points: 16, aliases: ["traveling", "road trips", "jet lag"] },
      { text: "Media attention", points: 12, aliases: ["press", "media", "spotlight"] },
      { text: "Money management", points: 8, aliases: ["finances", "spending", "money"] },
    ]},
    { text: "Name a way the NBA has changed over the years", answers: [
      { text: "More threes", points: 40, aliases: ["three pointers", "3 point shooting", "outside shooting"] },
      { text: "Analytics", points: 22, aliases: ["stats", "data", "numbers"] },
      { text: "Load management", points: 18, aliases: ["rest", "sitting out"] },
      { text: "Smaller lineups", points: 12, aliases: ["small ball", "positionless"] },
      { text: "Social media", points: 8, aliases: ["twitter", "instagram", "online"] },
    ]},
  ],

  // Day 15
  [
    { text: "Name a player famous for blocking shots", answers: [
      { text: "Hakeem Olajuwon", points: 36, aliases: ["hakeem", "olajuwon", "the dream"] },
      { text: "Dikembe Mutombo", points: 28, aliases: ["mutombo", "dikembe"] },
      { text: "Bill Russell", points: 16, aliases: ["russell", "bill"] },
      { text: "Rudy Gobert", points: 12, aliases: ["gobert", "rudy", "stifle tower"] },
      { text: "Dwight Howard", points: 8, aliases: ["dwight", "howard"] },
    ]},
    { text: "Name something at the NBA Finals", answers: [
      { text: "Trophy", points: 38, aliases: ["larry obrien", "championship trophy", "larry o'brien"] },
      { text: "Finals MVP", points: 24, aliases: ["mvp award", "fmvp"] },
      { text: "Confetti", points: 18, aliases: ["confetti drop", "celebration"] },
      { text: "Celebrities", points: 12, aliases: ["famous people", "celebs", "courtside celebs"] },
      { text: "Champagne", points: 8, aliases: ["champagne spray", "locker room champagne"] },
    ]},
    { text: "Name a basketball-related injury body part", answers: [
      { text: "Knee", points: 38, aliases: ["knees", "acl", "mcl"] },
      { text: "Ankle", points: 28, aliases: ["ankles"] },
      { text: "Shoulder", points: 16, aliases: ["shoulders", "rotator cuff"] },
      { text: "Back", points: 12, aliases: ["lower back", "spine"] },
      { text: "Wrist", points: 6, aliases: ["hand", "finger", "fingers"] },
    ]},
    { text: "Name a basketball TV analyst or commentator", answers: [
      { text: "Charles Barkley", points: 38, aliases: ["barkley", "charles", "chuck"] },
      { text: "Shaq", points: 26, aliases: ["shaquille", "shaquille oneal", "o'neal"] },
      { text: "Mike Breen", points: 16, aliases: ["breen", "mike"] },
      { text: "Jeff Van Gundy", points: 12, aliases: ["van gundy", "jeff"] },
      { text: "Kenny Smith", points: 8, aliases: ["kenny", "the jet", "smith"] },
    ]},
    { text: "Name a city that hosted the NBA All-Star Game recently", answers: [
      { text: "Indianapolis", points: 36, aliases: ["indy", "indiana"] },
      { text: "Salt Lake City", points: 24, aliases: ["slc", "utah", "salt lake"] },
      { text: "Cleveland", points: 18, aliases: ["cle"] },
      { text: "Atlanta", points: 14, aliases: ["atl"] },
      { text: "Chicago", points: 8, aliases: ["chi"] },
    ]},
  ],

  // Day 16
  [
    { text: "Name a player who scored 50+ in an NBA game", answers: [
      { text: "Wilt Chamberlain", points: 36, aliases: ["wilt", "chamberlain"] },
      { text: "Kobe Bryant", points: 28, aliases: ["kobe", "bryant", "mamba"] },
      { text: "Michael Jordan", points: 18, aliases: ["jordan", "mj"] },
      { text: "James Harden", points: 10, aliases: ["harden", "james"] },
      { text: "Devin Booker", points: 8, aliases: ["booker", "devin", "book"] },
    ]},
    { text: "Name an NBA conference", answers: [
      { text: "Eastern", points: 44, aliases: ["east", "eastern conference"] },
      { text: "Western", points: 44, aliases: ["west", "western conference"] },
      { text: "Atlantic", points: 6, aliases: ["atlantic division"] },
      { text: "Pacific", points: 3, aliases: ["pacific division"] },
      { text: "Central", points: 3, aliases: ["central division"] },
    ]},
    { text: "Name a tall NBA center over 7 feet", answers: [
      { text: "Yao Ming", points: 38, aliases: ["yao", "ming"] },
      { text: "Shaq", points: 26, aliases: ["shaquille", "shaquille oneal", "o'neal"] },
      { text: "Kareem Abdul-Jabbar", points: 16, aliases: ["kareem", "jabbar", "abdul jabbar"] },
      { text: "Wilt Chamberlain", points: 12, aliases: ["wilt", "chamberlain"] },
      { text: "Rudy Gobert", points: 8, aliases: ["gobert", "rudy"] },
    ]},
    { text: "Name something fans buy at the team store", answers: [
      { text: "Jersey", points: 42, aliases: ["jerseys", "player jersey"] },
      { text: "Hat", points: 24, aliases: ["cap", "snapback", "fitted"] },
      { text: "T-shirt", points: 16, aliases: ["shirt", "tee", "tshirt"] },
      { text: "Hoodie", points: 10, aliases: ["sweatshirt", "pullover"] },
      { text: "Basketball", points: 8, aliases: ["ball", "game ball", "mini ball"] },
    ]},
    { text: "Name a team in the Pacific Division", answers: [
      { text: "Lakers", points: 36, aliases: ["la lakers", "los angeles lakers"] },
      { text: "Warriors", points: 26, aliases: ["golden state", "gsw"] },
      { text: "Clippers", points: 18, aliases: ["la clippers", "los angeles clippers"] },
      { text: "Suns", points: 12, aliases: ["phoenix", "phoenix suns"] },
      { text: "Kings", points: 8, aliases: ["sacramento", "sacramento kings"] },
    ]},
  ],

  // Day 17
  [
    { text: "Name a player who wore number 24", answers: [
      { text: "Kobe Bryant", points: 48, aliases: ["kobe", "bryant", "mamba"] },
      { text: "Rick Barry", points: 18, aliases: ["barry", "rick"] },
      { text: "Reggie Miller", points: 16, aliases: ["reggie", "miller"] },
      { text: "Buddy Hield", points: 10, aliases: ["hield", "buddy"] },
      { text: "Lauri Markkanen", points: 8, aliases: ["markkanen", "lauri"] },
    ]},
    { text: "Name something that makes a playoff series a classic", answers: [
      { text: "Game 7", points: 40, aliases: ["seven games", "goes to 7", "game seven"] },
      { text: "Buzzer beater", points: 26, aliases: ["game winner", "last second"] },
      { text: "Overtime", points: 16, aliases: ["ot", "multiple overtimes"] },
      { text: "Rivalry", points: 10, aliases: ["bitter rivals", "heated"] },
      { text: "Comeback", points: 8, aliases: ["down 3-1", "big comeback", "rally"] },
    ]},
    { text: "Name a basketball term related to defense", answers: [
      { text: "Steal", points: 36, aliases: ["steals", "pick pocket"] },
      { text: "Block", points: 28, aliases: ["blocks", "rejection", "swat"] },
      { text: "Charge", points: 18, aliases: ["drawn charge", "taking a charge"] },
      { text: "Closeout", points: 10, aliases: ["close out", "contest"] },
      { text: "Help defense", points: 8, aliases: ["help side", "rotation", "help"] },
    ]},
    { text: "Name a player who went straight from high school to NBA", answers: [
      { text: "LeBron James", points: 40, aliases: ["lebron", "bron"] },
      { text: "Kobe Bryant", points: 28, aliases: ["kobe", "bryant"] },
      { text: "Kevin Garnett", points: 14, aliases: ["kg", "garnett"] },
      { text: "Dwight Howard", points: 10, aliases: ["dwight", "howard"] },
      { text: "Tracy McGrady", points: 8, aliases: ["tmac", "mcgrady", "tracy"] },
    ]},
    { text: "Name something associated with the NBA logo", answers: [
      { text: "Jerry West", points: 44, aliases: ["west", "jerry", "the logo"] },
      { text: "Dribbling", points: 22, aliases: ["dribble", "ball handling"] },
      { text: "Silhouette", points: 16, aliases: ["outline", "shadow"] },
      { text: "Red white blue", points: 12, aliases: ["colors", "red blue", "patriotic"] },
      { text: "Basketball", points: 6, aliases: ["ball"] },
    ]},
  ],

  // Day 18
  [
    { text: "Name a famous NBA Christmas Day matchup team", answers: [
      { text: "Lakers", points: 36, aliases: ["la lakers", "los angeles lakers"] },
      { text: "Knicks", points: 26, aliases: ["new york", "new york knicks"] },
      { text: "Celtics", points: 18, aliases: ["boston", "boston celtics"] },
      { text: "Warriors", points: 12, aliases: ["golden state", "gsw"] },
      { text: "Heat", points: 8, aliases: ["miami", "miami heat"] },
    ]},
    { text: "Name a basketball move to get past a defender", answers: [
      { text: "Crossover", points: 40, aliases: ["cross", "cross over", "ankle breaker"] },
      { text: "Step back", points: 24, aliases: ["stepback", "step-back"] },
      { text: "Spin move", points: 18, aliases: ["spin", "euro step"] },
      { text: "Pump fake", points: 12, aliases: ["fake", "shot fake", "pump"] },
      { text: "Jab step", points: 6, aliases: ["jab", "triple threat"] },
    ]},
    { text: "Name a team that tanked for a draft pick", answers: [
      { text: "76ers", points: 40, aliases: ["sixers", "philadelphia", "philly", "trust the process"] },
      { text: "Thunder", points: 22, aliases: ["okc", "oklahoma city"] },
      { text: "Spurs", points: 18, aliases: ["san antonio", "san antonio spurs"] },
      { text: "Rockets", points: 12, aliases: ["houston", "houston rockets"] },
      { text: "Pistons", points: 8, aliases: ["detroit", "detroit pistons"] },
    ]},
    { text: "Name something a point guard must be good at", answers: [
      { text: "Passing", points: 38, aliases: ["passing the ball", "assists", "dishing"] },
      { text: "Ball handling", points: 26, aliases: ["dribbling", "handles"] },
      { text: "Court vision", points: 18, aliases: ["vision", "seeing the floor"] },
      { text: "Leadership", points: 12, aliases: ["leading", "vocal leader"] },
      { text: "Shooting", points: 6, aliases: ["scoring", "three pointers"] },
    ]},
    { text: "Name a way fans show team spirit", answers: [
      { text: "Wear jersey", points: 40, aliases: ["jersey", "team jersey", "wearing jersey"] },
      { text: "Face paint", points: 22, aliases: ["paint face", "body paint"] },
      { text: "Foam finger", points: 18, aliases: ["number one finger", "#1 finger"] },
      { text: "Chanting", points: 12, aliases: ["chant", "cheer", "cheering"] },
      { text: "Signs", points: 8, aliases: ["poster", "banner", "holding signs"] },
    ]},
  ],

  // Day 19
  [
    { text: "Name an NBA team that relocated", answers: [
      { text: "Sonics", points: 40, aliases: ["supersonics", "seattle", "seattle supersonics"] },
      { text: "Nets", points: 22, aliases: ["new jersey nets", "brooklyn nets"] },
      { text: "Grizzlies", points: 18, aliases: ["vancouver grizzlies", "memphis grizzlies"] },
      { text: "Kings", points: 12, aliases: ["kansas city kings", "sacramento kings"] },
      { text: "Hawks", points: 8, aliases: ["st louis hawks", "atlanta hawks"] },
    ]},
    { text: "Name a type of shot in basketball", answers: [
      { text: "Three pointer", points: 36, aliases: ["three", "3 pointer", "from deep"] },
      { text: "Layup", points: 26, aliases: ["lay up"] },
      { text: "Hook shot", points: 18, aliases: ["hook", "sky hook", "baby hook"] },
      { text: "Floater", points: 12, aliases: ["teardrop", "runner", "float"] },
      { text: "Fadeaway", points: 8, aliases: ["fade away", "fade", "fallaway"] },
    ]},
    { text: "Name something associated with Michael Jordan", answers: [
      { text: "Bulls", points: 36, aliases: ["chicago", "chicago bulls"] },
      { text: "Air Jordan", points: 26, aliases: ["jordan shoes", "jordans", "nike"] },
      { text: "Six rings", points: 18, aliases: ["6 rings", "championships", "titles"] },
      { text: "Tongue out", points: 12, aliases: ["tongue", "sticking tongue out"] },
      { text: "Space Jam", points: 8, aliases: ["movie", "looney tunes"] },
    ]},
    { text: "Name a basketball training tool", answers: [
      { text: "Cones", points: 36, aliases: ["cone", "training cones"] },
      { text: "Dribble goggles", points: 22, aliases: ["goggles", "blinders"] },
      { text: "Resistance band", points: 18, aliases: ["bands", "elastic band"] },
      { text: "Weighted ball", points: 14, aliases: ["heavy ball", "medicine ball"] },
      { text: "Agility ladder", points: 10, aliases: ["ladder", "speed ladder"] },
    ]},
    { text: "Name a player known for clutch shots", answers: [
      { text: "Michael Jordan", points: 38, aliases: ["jordan", "mj"] },
      { text: "Kobe Bryant", points: 26, aliases: ["kobe", "mamba"] },
      { text: "Ray Allen", points: 16, aliases: ["ray", "allen"] },
      { text: "Kyrie Irving", points: 12, aliases: ["kyrie", "irving"] },
      { text: "Robert Horry", points: 8, aliases: ["horry", "big shot rob"] },
    ]},
  ],

  // Day 20
  [
    { text: "Name a number retired by many NBA teams", answers: [
      { text: "23", points: 38, aliases: ["twenty three", "number 23"] },
      { text: "32", points: 24, aliases: ["thirty two", "number 32"] },
      { text: "33", points: 18, aliases: ["thirty three", "number 33"] },
      { text: "34", points: 12, aliases: ["thirty four", "number 34"] },
      { text: "6", points: 8, aliases: ["six", "number 6"] },
    ]},
    { text: "Name a basketball hall of famer", answers: [
      { text: "Michael Jordan", points: 40, aliases: ["jordan", "mj"] },
      { text: "Magic Johnson", points: 24, aliases: ["magic", "johnson"] },
      { text: "Larry Bird", points: 18, aliases: ["bird", "larry"] },
      { text: "Kareem Abdul-Jabbar", points: 10, aliases: ["kareem", "jabbar"] },
      { text: "Shaq", points: 8, aliases: ["shaquille", "shaquille oneal", "o'neal"] },
    ]},
    { text: "Name something that can cause a turnover", answers: [
      { text: "Bad pass", points: 38, aliases: ["errant pass", "pass stolen", "passing error"] },
      { text: "Travel", points: 26, aliases: ["traveling", "walked"] },
      { text: "Double dribble", points: 16, aliases: ["carry", "carrying"] },
      { text: "Steal", points: 12, aliases: ["picked off", "stolen ball"] },
      { text: "Backcourt violation", points: 8, aliases: ["backcourt", "over and back"] },
    ]},
    { text: "Name a state with multiple NBA teams", answers: [
      { text: "California", points: 40, aliases: ["cali", "ca"] },
      { text: "Texas", points: 26, aliases: ["tx"] },
      { text: "New York", points: 18, aliases: ["ny"] },
      { text: "Florida", points: 10, aliases: ["fl"] },
      { text: "Ohio", points: 6, aliases: ["oh"] },
    ]},
    { text: "Name a player famous for post moves", answers: [
      { text: "Hakeem Olajuwon", points: 40, aliases: ["hakeem", "olajuwon", "the dream"] },
      { text: "Shaq", points: 24, aliases: ["shaquille", "shaquille oneal"] },
      { text: "Tim Duncan", points: 16, aliases: ["duncan", "timmy"] },
      { text: "Kevin McHale", points: 12, aliases: ["mchale", "kevin"] },
      { text: "Kareem Abdul-Jabbar", points: 8, aliases: ["kareem", "jabbar"] },
    ]},
  ],

  // Day 21
  [
    { text: "Name a team in the Atlantic Division", answers: [
      { text: "Celtics", points: 36, aliases: ["boston", "boston celtics"] },
      { text: "Knicks", points: 28, aliases: ["new york", "new york knicks"] },
      { text: "76ers", points: 18, aliases: ["sixers", "philadelphia", "philly"] },
      { text: "Nets", points: 12, aliases: ["brooklyn", "brooklyn nets"] },
      { text: "Raptors", points: 6, aliases: ["toronto", "toronto raptors"] },
    ]},
    { text: "Name a basketball announcer catchphrase", answers: [
      { text: "Bang!", points: 40, aliases: ["bang", "mike breen bang"] },
      { text: "Is it the shoes?", points: 22, aliases: ["the shoes", "shoes"] },
      { text: "Mama there goes that man", points: 16, aliases: ["mama", "mark jackson"] },
      { text: "Hand down man down", points: 14, aliases: ["hand down"] },
      { text: "Facial!", points: 8, aliases: ["facial", "posterized"] },
    ]},
    { text: "Name something a center does", answers: [
      { text: "Rebound", points: 38, aliases: ["rebounds", "boards", "grab boards"] },
      { text: "Block shots", points: 26, aliases: ["block", "blocks", "rim protection"] },
      { text: "Set screens", points: 16, aliases: ["screen", "pick", "screens"] },
      { text: "Score inside", points: 12, aliases: ["post up", "dunk", "paint scoring"] },
      { text: "Tip off", points: 8, aliases: ["jump ball", "tip", "opening tip"] },
    ]},
    { text: "Name an NBA player born outside the USA", answers: [
      { text: "Giannis", points: 38, aliases: ["giannis antetokounmpo", "antetokounmpo", "greek freak"] },
      { text: "Luka Doncic", points: 26, aliases: ["luka", "doncic"] },
      { text: "Nikola Jokic", points: 18, aliases: ["jokic", "nikola", "joker"] },
      { text: "Dirk Nowitzki", points: 12, aliases: ["dirk", "nowitzki"] },
      { text: "Yao Ming", points: 6, aliases: ["yao", "ming"] },
    ]},
    { text: "Name something on a player's scouting report", answers: [
      { text: "Shooting", points: 36, aliases: ["shot", "three point shooting", "scoring"] },
      { text: "Speed", points: 24, aliases: ["quickness", "athleticism", "fast"] },
      { text: "Height", points: 18, aliases: ["size", "wingspan", "length"] },
      { text: "Defense", points: 14, aliases: ["defensive ability", "on ball defense"] },
      { text: "Basketball IQ", points: 8, aliases: ["iq", "bbiq", "court vision"] },
    ]},
  ],

  // Day 22
  [
    { text: "Name a player who played for the Spurs", answers: [
      { text: "Tim Duncan", points: 40, aliases: ["duncan", "timmy"] },
      { text: "Tony Parker", points: 22, aliases: ["parker", "tony"] },
      { text: "Manu Ginobili", points: 18, aliases: ["manu", "ginobili"] },
      { text: "David Robinson", points: 12, aliases: ["robinson", "the admiral", "david"] },
      { text: "Kawhi Leonard", points: 8, aliases: ["kawhi", "leonard"] },
    ]},
    { text: "Name a basketball term that starts with 'D'", answers: [
      { text: "Dunk", points: 38, aliases: ["dunking", "slam dunk"] },
      { text: "Dribble", points: 26, aliases: ["dribbling"] },
      { text: "Defense", points: 18, aliases: ["defending"] },
      { text: "Double team", points: 12, aliases: ["double", "doubling"] },
      { text: "Draft", points: 6, aliases: ["nba draft"] },
    ]},
    { text: "Name a reason a game goes to overtime", answers: [
      { text: "Tied score", points: 44, aliases: ["tie", "tied", "score tied"] },
      { text: "Buzzer beater", points: 22, aliases: ["last second shot", "tying shot"] },
      { text: "Comeback", points: 16, aliases: ["big comeback", "rally"] },
      { text: "Free throws", points: 10, aliases: ["clutch free throws", "tying free throw"] },
      { text: "Missed shot", points: 8, aliases: ["missed game winner", "bricked it"] },
    ]},
    { text: "Name something NBA players endorse", answers: [
      { text: "Shoes", points: 42, aliases: ["sneakers", "shoe deal", "basketball shoes"] },
      { text: "Gatorade", points: 22, aliases: ["sports drink", "drinks"] },
      { text: "Fast food", points: 16, aliases: ["mcdonalds", "subway", "food"] },
      { text: "Cars", points: 12, aliases: ["car brand", "kia", "auto"] },
      { text: "Deodorant", points: 8, aliases: ["old spice", "hygiene", "body spray"] },
    ]},
    { text: "Name an NBA team that has never won a championship", answers: [
      { text: "Suns", points: 34, aliases: ["phoenix", "phoenix suns"] },
      { text: "Jazz", points: 24, aliases: ["utah", "utah jazz"] },
      { text: "Pacers", points: 18, aliases: ["indiana", "indiana pacers"] },
      { text: "Nuggets", points: 14, aliases: ["denver", "denver nuggets"] },
      { text: "Hornets", points: 10, aliases: ["charlotte", "charlotte hornets"] },
    ]},
  ],

  // Day 23
  [
    { text: "Name a signature celebration in basketball", answers: [
      { text: "Finger wag", points: 36, aliases: ["mutombo", "wag", "no no no"] },
      { text: "Shimmy", points: 26, aliases: ["steph shimmy", "curry shimmy"] },
      { text: "Big balls dance", points: 18, aliases: ["big balls", "sam cassell"] },
      { text: "Silencer", points: 12, aliases: ["quiet down", "shh", "damian lillard"] },
      { text: "Too small", points: 8, aliases: ["too little", "measuring", "short"] },
    ]},
    { text: "Name an NBA player who also acted in movies", answers: [
      { text: "Shaq", points: 38, aliases: ["shaquille", "shaquille oneal", "o'neal"] },
      { text: "Michael Jordan", points: 28, aliases: ["jordan", "mj"] },
      { text: "LeBron James", points: 18, aliases: ["lebron", "bron"] },
      { text: "Ray Allen", points: 10, aliases: ["ray", "allen"] },
      { text: "Kareem Abdul-Jabbar", points: 6, aliases: ["kareem", "jabbar"] },
    ]},
    { text: "Name a division in the Eastern Conference", answers: [
      { text: "Atlantic", points: 38, aliases: ["atlantic division"] },
      { text: "Central", points: 28, aliases: ["central division"] },
      { text: "Southeast", points: 18, aliases: ["southeast division"] },
      { text: "Northeast", points: 10, aliases: ["northeast division"] },
      { text: "Midwest", points: 6, aliases: ["midwest division"] },
    ]},
    { text: "Name something that happens at a draft lottery", answers: [
      { text: "Ping pong balls", points: 40, aliases: ["lottery balls", "balls drawn", "ping pong"] },
      { text: "First pick revealed", points: 24, aliases: ["number one pick", "top pick"] },
      { text: "Team reps react", points: 16, aliases: ["reactions", "celebrating", "disappointment"] },
      { text: "Envelope opened", points: 12, aliases: ["envelope", "card revealed"] },
      { text: "Conspiracy talk", points: 8, aliases: ["rigged", "conspiracy", "fixed"] },
    ]},
    { text: "Name a basketball court marking", answers: [
      { text: "Three-point line", points: 36, aliases: ["three point arc", "arc", "3pt line"] },
      { text: "Free throw line", points: 26, aliases: ["foul line", "charity stripe"] },
      { text: "Half court line", points: 18, aliases: ["midcourt", "center line", "half court"] },
      { text: "Paint", points: 12, aliases: ["key", "lane", "the paint"] },
      { text: "Baseline", points: 8, aliases: ["end line", "out of bounds line"] },
    ]},
  ],

  // Day 24
  [
    { text: "Name an NBA team with a one-word city name", answers: [
      { text: "Boston", points: 36, aliases: ["celtics", "boston celtics"] },
      { text: "Chicago", points: 26, aliases: ["bulls", "chicago bulls"] },
      { text: "Miami", points: 18, aliases: ["heat", "miami heat"] },
      { text: "Dallas", points: 12, aliases: ["mavericks", "mavs", "dallas mavericks"] },
      { text: "Denver", points: 8, aliases: ["nuggets", "denver nuggets"] },
    ]},
    { text: "Name a player who won MVP multiple times", answers: [
      { text: "LeBron James", points: 36, aliases: ["lebron", "bron"] },
      { text: "Michael Jordan", points: 28, aliases: ["jordan", "mj"] },
      { text: "Kareem Abdul-Jabbar", points: 16, aliases: ["kareem", "jabbar"] },
      { text: "Steph Curry", points: 12, aliases: ["curry", "stephen curry", "steph"] },
      { text: "Giannis", points: 8, aliases: ["giannis antetokounmpo", "greek freak"] },
    ]},
    { text: "Name something players argue about with refs", answers: [
      { text: "Foul call", points: 42, aliases: ["foul", "bad call", "no foul"] },
      { text: "Out of bounds", points: 24, aliases: ["whose ball", "last touch"] },
      { text: "Goaltending", points: 16, aliases: ["goaltend", "interference"] },
      { text: "Travel", points: 12, aliases: ["traveling", "walked"] },
      { text: "Shot clock", points: 6, aliases: ["clock violation", "time"] },
    ]},
    { text: "Name a way to watch an NBA game", answers: [
      { text: "TV", points: 40, aliases: ["television", "cable", "broadcast"] },
      { text: "Streaming", points: 24, aliases: ["stream", "league pass", "nba app"] },
      { text: "In person", points: 18, aliases: ["arena", "live", "at the game"] },
      { text: "Phone", points: 10, aliases: ["mobile", "cell phone", "tablet"] },
      { text: "Bar", points: 8, aliases: ["sports bar", "restaurant", "pub"] },
    ]},
    { text: "Name a player famous for rebounds", answers: [
      { text: "Dennis Rodman", points: 38, aliases: ["rodman", "dennis"] },
      { text: "Wilt Chamberlain", points: 24, aliases: ["wilt", "chamberlain"] },
      { text: "Bill Russell", points: 16, aliases: ["russell", "bill"] },
      { text: "Charles Barkley", points: 14, aliases: ["barkley", "charles", "chuck"] },
      { text: "Moses Malone", points: 8, aliases: ["moses", "malone"] },
    ]},
  ],

  // Day 25
  [
    { text: "Name an NBA team from New York", answers: [
      { text: "Knicks", points: 48, aliases: ["new york knicks", "ny knicks"] },
      { text: "Nets", points: 36, aliases: ["brooklyn nets", "brooklyn"] },
      { text: "Liberty", points: 8, aliases: ["new york liberty"] },
      { text: "Islanders", points: 4, aliases: ["new york islanders"] },
      { text: "Rangers", points: 4, aliases: ["new york rangers"] },
    ]},
    { text: "Name something a player does during warmups", answers: [
      { text: "Shoot", points: 40, aliases: ["shooting", "shoots around", "takes shots"] },
      { text: "Stretch", points: 26, aliases: ["stretching", "warmup stretch"] },
      { text: "Dribble", points: 16, aliases: ["dribbling", "ball handling"] },
      { text: "Dunk", points: 12, aliases: ["dunking", "warmup dunks"] },
      { text: "Listen to music", points: 6, aliases: ["music", "headphones", "earbuds"] },
    ]},
    { text: "Name a basketball term for a bad play", answers: [
      { text: "Turnover", points: 40, aliases: ["to", "giving it away"] },
      { text: "Airball", points: 26, aliases: ["air ball", "brick"] },
      { text: "Travel", points: 16, aliases: ["traveling", "walked"] },
      { text: "Shot clock violation", points: 10, aliases: ["24 second", "shot clock"] },
      { text: "Foul", points: 8, aliases: ["unnecessary foul", "dumb foul"] },
    ]},
    { text: "Name a player drafted first overall", answers: [
      { text: "LeBron James", points: 40, aliases: ["lebron", "bron"] },
      { text: "Shaq", points: 22, aliases: ["shaquille", "shaquille oneal"] },
      { text: "Allen Iverson", points: 16, aliases: ["iverson", "ai"] },
      { text: "Anthony Davis", points: 12, aliases: ["ad", "davis", "anthony"] },
      { text: "Zion Williamson", points: 10, aliases: ["zion", "williamson"] },
    ]},
    { text: "Name something in an NBA locker room", answers: [
      { text: "Lockers", points: 36, aliases: ["locker", "cubbies"] },
      { text: "Whiteboard", points: 24, aliases: ["board", "playboard", "tactics board"] },
      { text: "Ice bath", points: 18, aliases: ["cold tub", "ice tub"] },
      { text: "TV", points: 14, aliases: ["television", "screen", "monitor"] },
      { text: "Training table", points: 8, aliases: ["food", "snacks", "fuel station"] },
    ]},
  ],

  // Day 26
  [
    { text: "Name a player who played for the Heat", answers: [
      { text: "Dwyane Wade", points: 40, aliases: ["wade", "dwyane", "d wade"] },
      { text: "LeBron James", points: 26, aliases: ["lebron", "bron"] },
      { text: "Shaq", points: 14, aliases: ["shaquille", "shaquille oneal"] },
      { text: "Jimmy Butler", points: 12, aliases: ["butler", "jimmy"] },
      { text: "Chris Bosh", points: 8, aliases: ["bosh", "chris"] },
    ]},
    { text: "Name an NBA rule change in recent years", answers: [
      { text: "Challenge", points: 36, aliases: ["coaches challenge", "coach challenge"] },
      { text: "Play-in", points: 26, aliases: ["play in tournament", "play-in game"] },
      { text: "No rip-through", points: 16, aliases: ["rip through", "non shooting foul"] },
      { text: "In-season tournament", points: 14, aliases: ["cup", "nba cup", "ist"] },
      { text: "Load management fines", points: 8, aliases: ["rest fines", "sitting out fine"] },
    ]},
    { text: "Name a basketball surface feature", answers: [
      { text: "Hardwood", points: 38, aliases: ["wood floor", "maple"] },
      { text: "Logo", points: 24, aliases: ["center court logo", "midcourt logo"] },
      { text: "Painted lines", points: 18, aliases: ["lines", "court lines"] },
      { text: "Stanchion", points: 12, aliases: ["basket support", "pole", "base"] },
      { text: "Scorer's table", points: 8, aliases: ["scorers table", "press table"] },
    ]},
    { text: "Name a famous NBA number one draft bust", answers: [
      { text: "Anthony Bennett", points: 38, aliases: ["bennett", "anthony"] },
      { text: "Kwame Brown", points: 26, aliases: ["kwame", "brown"] },
      { text: "Greg Oden", points: 18, aliases: ["oden", "greg"] },
      { text: "Markelle Fultz", points: 10, aliases: ["fultz", "markelle"] },
      { text: "Andrea Bargnani", points: 8, aliases: ["bargnani", "andrea"] },
    ]},
    { text: "Name something that happens on draft night", answers: [
      { text: "Trades", points: 38, aliases: ["trade", "draft trade", "player traded"] },
      { text: "Picks announced", points: 26, aliases: ["pick", "selection", "name called"] },
      { text: "Hugging family", points: 16, aliases: ["hug", "family hug", "crying"] },
      { text: "Putting on hat", points: 12, aliases: ["hat", "team hat", "cap"] },
      { text: "Booing", points: 8, aliases: ["boos", "fans boo"] },
    ]},
  ],

  // Day 27
  [
    { text: "Name an NBA team from the Southeast Division", answers: [
      { text: "Heat", points: 36, aliases: ["miami", "miami heat"] },
      { text: "Hawks", points: 24, aliases: ["atlanta", "atlanta hawks"] },
      { text: "Magic", points: 18, aliases: ["orlando", "orlando magic"] },
      { text: "Hornets", points: 14, aliases: ["charlotte", "charlotte hornets"] },
      { text: "Wizards", points: 8, aliases: ["washington", "washington wizards"] },
    ]},
    { text: "Name a player known for his defense", answers: [
      { text: "Kawhi Leonard", points: 36, aliases: ["kawhi", "leonard", "the claw"] },
      { text: "Gary Payton", points: 22, aliases: ["payton", "the glove", "gary"] },
      { text: "Scottie Pippen", points: 18, aliases: ["pippen", "scottie"] },
      { text: "Ben Wallace", points: 14, aliases: ["wallace", "big ben"] },
      { text: "Dennis Rodman", points: 10, aliases: ["rodman", "dennis"] },
    ]},
    { text: "Name something you hear during an NBA broadcast", answers: [
      { text: "Buzzer", points: 36, aliases: ["horn", "shot clock buzzer"] },
      { text: "Sneaker squeaks", points: 24, aliases: ["shoes squeaking", "squeaking"] },
      { text: "Whistle", points: 18, aliases: ["ref whistle", "foul whistle"] },
      { text: "Crowd roar", points: 14, aliases: ["cheering", "crowd noise", "fans"] },
      { text: "Music", points: 8, aliases: ["pa music", "organ", "arena music"] },
    ]},
    { text: "Name a basketball position group", answers: [
      { text: "Guards", points: 38, aliases: ["guard", "backcourt"] },
      { text: "Forwards", points: 28, aliases: ["forward", "frontcourt", "wing"] },
      { text: "Centers", points: 20, aliases: ["center", "big man", "bigs"] },
      { text: "Wings", points: 8, aliases: ["wing player", "swingman"] },
      { text: "Point", points: 6, aliases: ["ball handler", "floor general"] },
    ]},
    { text: "Name a player who played 20+ NBA seasons", answers: [
      { text: "LeBron James", points: 38, aliases: ["lebron", "bron"] },
      { text: "Vince Carter", points: 24, aliases: ["vince", "carter"] },
      { text: "Kareem Abdul-Jabbar", points: 18, aliases: ["kareem", "jabbar"] },
      { text: "Dirk Nowitzki", points: 12, aliases: ["dirk", "nowitzki"] },
      { text: "Robert Parish", points: 8, aliases: ["parish", "chief", "robert"] },
    ]},
  ],

  // Day 28
  [
    { text: "Name a basketball-related fitness exercise", answers: [
      { text: "Sprints", points: 36, aliases: ["running", "suicides", "wind sprints"] },
      { text: "Squats", points: 24, aliases: ["squat", "leg press"] },
      { text: "Jumping", points: 18, aliases: ["jump training", "plyometrics", "box jumps"] },
      { text: "Push-ups", points: 14, aliases: ["pushups", "push ups"] },
      { text: "Lunges", points: 8, aliases: ["lunge", "walking lunges"] },
    ]},
    { text: "Name a team in the Northwest Division", answers: [
      { text: "Nuggets", points: 34, aliases: ["denver", "denver nuggets"] },
      { text: "Thunder", points: 26, aliases: ["okc", "oklahoma city"] },
      { text: "Trail Blazers", points: 18, aliases: ["blazers", "portland", "portland trail blazers"] },
      { text: "Jazz", points: 14, aliases: ["utah", "utah jazz"] },
      { text: "Timberwolves", points: 8, aliases: ["wolves", "minnesota", "twolves"] },
    ]},
    { text: "Name something a basketball player eats before a game", answers: [
      { text: "Chicken", points: 36, aliases: ["grilled chicken", "chicken breast"] },
      { text: "Pasta", points: 26, aliases: ["spaghetti", "noodles", "carbs"] },
      { text: "Rice", points: 18, aliases: ["rice and chicken", "white rice"] },
      { text: "Banana", points: 12, aliases: ["fruit", "bananas"] },
      { text: "Peanut butter", points: 8, aliases: ["pb", "pb&j", "pbj", "peanut butter jelly"] },
    ]},
    { text: "Name a player who won Finals MVP", answers: [
      { text: "LeBron James", points: 36, aliases: ["lebron", "bron"] },
      { text: "Michael Jordan", points: 28, aliases: ["jordan", "mj"] },
      { text: "Kobe Bryant", points: 16, aliases: ["kobe", "mamba"] },
      { text: "Tim Duncan", points: 12, aliases: ["duncan", "timmy"] },
      { text: "Kevin Durant", points: 8, aliases: ["kd", "durant"] },
    ]},
    { text: "Name a word associated with a fast-paced game", answers: [
      { text: "Run", points: 38, aliases: ["running", "run and gun"] },
      { text: "Fast break", points: 26, aliases: ["fastbreak", "transition"] },
      { text: "Tempo", points: 16, aliases: ["pace", "uptempo"] },
      { text: "Push", points: 12, aliases: ["pushing pace", "push the ball"] },
      { text: "Outlet", points: 8, aliases: ["outlet pass", "long pass"] },
    ]},
  ],

  // Day 29
  [
    { text: "Name a team Shaq played for", answers: [
      { text: "Lakers", points: 38, aliases: ["la lakers", "los angeles lakers"] },
      { text: "Heat", points: 26, aliases: ["miami", "miami heat"] },
      { text: "Magic", points: 16, aliases: ["orlando", "orlando magic"] },
      { text: "Suns", points: 12, aliases: ["phoenix", "phoenix suns"] },
      { text: "Celtics", points: 8, aliases: ["boston", "boston celtics"] },
    ]},
    { text: "Name a way a player fouls out", answers: [
      { text: "Six fouls", points: 44, aliases: ["6 fouls", "too many fouls", "foul limit"] },
      { text: "Two technicals", points: 26, aliases: ["double tech", "2 techs", "ejected"] },
      { text: "Flagrant 2", points: 16, aliases: ["flagrant foul", "flagrant two"] },
      { text: "Fighting", points: 8, aliases: ["fight", "brawl"] },
      { text: "Leaving bench", points: 6, aliases: ["left bench area", "bench violation"] },
    ]},
    { text: "Name a basketball term for missing a shot badly", answers: [
      { text: "Brick", points: 42, aliases: ["bricked", "bricking"] },
      { text: "Airball", points: 30, aliases: ["air ball", "air balled"] },
      { text: "Clank", points: 14, aliases: ["clanked", "off the rim"] },
      { text: "Shank", points: 8, aliases: ["shanked"] },
      { text: "Swatted", points: 6, aliases: ["blocked", "rejected"] },
    ]},
    { text: "Name a player who wore number 3", answers: [
      { text: "Allen Iverson", points: 40, aliases: ["iverson", "ai", "the answer"] },
      { text: "Dwyane Wade", points: 26, aliases: ["wade", "d wade"] },
      { text: "Chris Paul", points: 16, aliases: ["cp3", "paul"] },
      { text: "Ben Wallace", points: 10, aliases: ["wallace", "big ben"] },
      { text: "Bradley Beal", points: 8, aliases: ["beal", "bradley"] },
    ]},
    { text: "Name something that makes a rivalry game special", answers: [
      { text: "Sellout crowd", points: 36, aliases: ["packed arena", "full house", "sold out"] },
      { text: "Trash talk", points: 26, aliases: ["talking trash", "chirping"] },
      { text: "Physicality", points: 18, aliases: ["physical play", "hard fouls"] },
      { text: "History", points: 12, aliases: ["tradition", "past matchups"] },
      { text: "Playoff seeding", points: 8, aliases: ["standings", "seed", "implications"] },
    ]},
  ],

  // Day 30
  [
    { text: "Name a player who played for the Knicks", answers: [
      { text: "Patrick Ewing", points: 38, aliases: ["ewing", "patrick"] },
      { text: "Carmelo Anthony", points: 26, aliases: ["melo", "carmelo", "anthony"] },
      { text: "Walt Frazier", points: 16, aliases: ["frazier", "clyde", "walt"] },
      { text: "Willis Reed", points: 12, aliases: ["reed", "willis"] },
      { text: "Jalen Brunson", points: 8, aliases: ["brunson", "jalen"] },
    ]},
    { text: "Name a basketball slang term", answers: [
      { text: "Bucket", points: 38, aliases: ["buckets", "get buckets"] },
      { text: "Swish", points: 24, aliases: ["nothing but net", "splash"] },
      { text: "Ankle breaker", points: 18, aliases: ["broke ankles", "crossed up"] },
      { text: "Poster", points: 12, aliases: ["posterized", "on a poster"] },
      { text: "Heat check", points: 8, aliases: ["heat check shot", "feeling it"] },
    ]},
    { text: "Name a team in the Southwest Division", answers: [
      { text: "Spurs", points: 34, aliases: ["san antonio", "san antonio spurs"] },
      { text: "Mavericks", points: 26, aliases: ["mavs", "dallas", "dallas mavericks"] },
      { text: "Rockets", points: 18, aliases: ["houston", "houston rockets"] },
      { text: "Pelicans", points: 14, aliases: ["new orleans", "new orleans pelicans"] },
      { text: "Grizzlies", points: 8, aliases: ["memphis", "memphis grizzlies"] },
    ]},
    { text: "Name something a coach does during a game", answers: [
      { text: "Calls timeout", points: 38, aliases: ["timeout", "calls time"] },
      { text: "Substitutes", points: 24, aliases: ["subs", "makes substitution", "player change"] },
      { text: "Draws plays", points: 18, aliases: ["clipboard", "draws up play"] },
      { text: "Argues with refs", points: 12, aliases: ["yells at refs", "complains to ref"] },
      { text: "Paces sideline", points: 8, aliases: ["pacing", "walks sideline"] },
    ]},
    { text: "Name something that happens at the end of an NBA season", answers: [
      { text: "Playoffs", points: 40, aliases: ["playoff", "postseason"] },
      { text: "Awards", points: 24, aliases: ["mvp award", "award voting"] },
      { text: "Free agency", points: 18, aliases: ["free agents", "offseason signings"] },
      { text: "Draft lottery", points: 10, aliases: ["lottery", "ping pong balls"] },
      { text: "Exit interviews", points: 8, aliases: ["exit interview", "locker cleanout"] },
    ]},
  ],
]


// ── NFL Questions (30 days) ──
const NFL_DAYS: Question[][] = [
  // Day 1
  [
    { text: "Name a famous NFL quarterback", answers: [
      { text: "Tom Brady", points: 40, aliases: ["brady", "tb12", "tb"] },
      { text: "Patrick Mahomes", points: 26, aliases: ["mahomes", "pat mahomes"] },
      { text: "Peyton Manning", points: 18, aliases: ["manning", "peyton"] },
      { text: "Joe Montana", points: 10, aliases: ["montana", "joe cool"] },
      { text: "Aaron Rodgers", points: 6, aliases: ["rodgers", "a rod", "a-rod"] },
    ]},
    { text: "Name an NFL team based in California", answers: [
      { text: "49ers", points: 38, aliases: ["san francisco", "sf", "niners", "san francisco 49ers"] },
      { text: "Rams", points: 26, aliases: ["la rams", "los angeles rams"] },
      { text: "Chargers", points: 20, aliases: ["la chargers", "los angeles chargers"] },
      { text: "Raiders", points: 10, aliases: ["las vegas raiders", "oakland raiders", "oakland"] },
      { text: "Seahawks", points: 6, aliases: ["seattle", "seattle seahawks"] },
    ]},
    { text: "Name a position on the NFL offensive line", answers: [
      { text: "Left Tackle", points: 36, aliases: ["lt", "tackle"] },
      { text: "Center", points: 26, aliases: ["c"] },
      { text: "Guard", points: 20, aliases: ["left guard", "right guard", "lg", "rg"] },
      { text: "Right Tackle", points: 12, aliases: ["rt"] },
      { text: "Tight End", points: 6, aliases: ["te"] },
    ]},
    { text: "Name something fans bring to an NFL tailgate", answers: [
      { text: "Grill", points: 38, aliases: ["bbq", "barbecue", "charcoal grill", "grills"] },
      { text: "Beer", points: 28, aliases: ["alcohol", "drinks", "booze", "beers"] },
      { text: "Football", points: 18, aliases: ["footballs", "pigskin"] },
      { text: "Chairs", points: 10, aliases: ["lawn chairs", "folding chairs", "camp chairs"] },
      { text: "Tent", points: 6, aliases: ["canopy", "ez up", "pop up tent"] },
    ]},
    { text: "Name an NFL team with a cat mascot", answers: [
      { text: "Panthers", points: 36, aliases: ["carolina", "carolina panthers"] },
      { text: "Bengals", points: 26, aliases: ["cincinnati", "cincinnati bengals"] },
      { text: "Lions", points: 20, aliases: ["detroit", "detroit lions"] },
      { text: "Jaguars", points: 12, aliases: ["jacksonville", "jacksonville jaguars", "jags"] },
      { text: "Cardinals", points: 6, aliases: ["arizona", "arizona cardinals"] },
    ]},
  ],

  // Day 2
  [
    { text: "Name a penalty in football", answers: [
      { text: "Holding", points: 38, aliases: ["offensive holding", "defensive holding"] },
      { text: "Pass Interference", points: 26, aliases: ["pi", "dpi", "interference"] },
      { text: "Offsides", points: 18, aliases: ["offside", "off sides"] },
      { text: "False Start", points: 12, aliases: ["false-start"] },
      { text: "Roughing the Passer", points: 6, aliases: ["roughing", "rtp"] },
    ]},
    { text: "Name a famous NFL wide receiver", answers: [
      { text: "Jerry Rice", points: 38, aliases: ["rice", "jerry"] },
      { text: "Randy Moss", points: 24, aliases: ["moss"] },
      { text: "Tyreek Hill", points: 18, aliases: ["hill", "tyreek", "cheetah"] },
      { text: "Calvin Johnson", points: 12, aliases: ["megatron", "calvin"] },
      { text: "Davante Adams", points: 8, aliases: ["adams", "davante"] },
    ]},
    { text: "Name something people eat at a Super Bowl party", answers: [
      { text: "Wings", points: 40, aliases: ["chicken wings", "buffalo wings", "hot wings"] },
      { text: "Pizza", points: 24, aliases: ["pizzas"] },
      { text: "Nachos", points: 18, aliases: ["chips and dip", "nacho"] },
      { text: "Burgers", points: 12, aliases: ["hamburgers", "burger", "cheeseburgers"] },
      { text: "Sliders", points: 6, aliases: ["mini burgers"] },
    ]},
    { text: "Name an NFL team in the NFC East", answers: [
      { text: "Cowboys", points: 36, aliases: ["dallas", "dallas cowboys", "boys"] },
      { text: "Eagles", points: 28, aliases: ["philadelphia", "philly", "philadelphia eagles"] },
      { text: "Giants", points: 18, aliases: ["new york giants", "ny giants", "nyg"] },
      { text: "Commanders", points: 12, aliases: ["washington", "washington commanders", "skins", "redskins"] },
      { text: "Redskins", points: 6, aliases: ["old washington", "washington redskins"] },
    ]},
    { text: "Name a reason a coach gets fired", answers: [
      { text: "Losing Record", points: 40, aliases: ["losing", "too many losses", "bad record", "losses"] },
      { text: "Missed Playoffs", points: 24, aliases: ["no playoffs", "missing playoffs"] },
      { text: "Locker Room Issues", points: 18, aliases: ["lost the locker room", "team chemistry", "locker room"] },
      { text: "Bad Play Calling", points: 12, aliases: ["play calling", "bad calls", "playcalling"] },
      { text: "Off-Field Scandal", points: 6, aliases: ["scandal", "controversy"] },
    ]},
  ],

  // Day 3
  [
    { text: "Name a famous NFL running back", answers: [
      { text: "Barry Sanders", points: 36, aliases: ["barry", "sanders"] },
      { text: "Walter Payton", points: 26, aliases: ["payton", "sweetness"] },
      { text: "Emmitt Smith", points: 18, aliases: ["emmitt", "smith"] },
      { text: "Adrian Peterson", points: 12, aliases: ["ap", "peterson", "adrian"] },
      { text: "Jim Brown", points: 8, aliases: ["brown", "jim"] },
    ]},
    { text: "Name something a quarterback yells at the line", answers: [
      { text: "Omaha", points: 40, aliases: ["omaha omaha"] },
      { text: "Hut", points: 24, aliases: ["hut hut", "hike"] },
      { text: "Blue 42", points: 18, aliases: ["blue forty two"] },
      { text: "Kill Kill", points: 12, aliases: ["kill", "kill kill kill"] },
      { text: "Set", points: 6, aliases: ["set hut", "ready set"] },
    ]},
    { text: "Name a stat used to measure a quarterback", answers: [
      { text: "Touchdowns", points: 38, aliases: ["tds", "td", "touchdown"] },
      { text: "Passing Yards", points: 24, aliases: ["yards", "pass yards", "yardage"] },
      { text: "Passer Rating", points: 18, aliases: ["qb rating", "rating", "qbr"] },
      { text: "Interceptions", points: 12, aliases: ["ints", "int", "picks"] },
      { text: "Completion Pct", points: 8, aliases: ["comp pct", "completion pct", "comp %", "accuracy"] },
    ]},
    { text: "Name an NFL team with a bird mascot", answers: [
      { text: "Eagles", points: 36, aliases: ["philadelphia", "philly", "philadelphia eagles"] },
      { text: "Ravens", points: 26, aliases: ["baltimore", "baltimore ravens"] },
      { text: "Falcons", points: 20, aliases: ["atlanta", "atlanta falcons"] },
      { text: "Cardinals", points: 12, aliases: ["arizona", "arizona cardinals"] },
      { text: "Seahawks", points: 6, aliases: ["seattle", "seattle seahawks"] },
    ]},
    { text: "Name a type of NFL kick", answers: [
      { text: "Field Goal", points: 38, aliases: ["fg", "field goals"] },
      { text: "Punt", points: 26, aliases: ["punts", "punting"] },
      { text: "Kickoff", points: 18, aliases: ["kick off", "kick-off"] },
      { text: "Extra Point", points: 12, aliases: ["pat", "point after", "xp", "extra points"] },
      { text: "Onside Kick", points: 6, aliases: ["onside", "on-side kick"] },
    ]},
  ],

  // Day 4
  [
    { text: "Name a piece of football equipment", answers: [
      { text: "Helmet", points: 40, aliases: ["helmets"] },
      { text: "Shoulder Pads", points: 24, aliases: ["pads", "shoulder pad"] },
      { text: "Cleats", points: 18, aliases: ["shoes", "cleat", "football cleats"] },
      { text: "Mouthguard", points: 12, aliases: ["mouth guard", "mouth piece", "mouthpiece"] },
      { text: "Gloves", points: 6, aliases: ["receiver gloves", "football gloves"] },
    ]},
    { text: "Name an NFL team that has won multiple Super Bowls", answers: [
      { text: "Patriots", points: 38, aliases: ["new england", "pats", "new england patriots"] },
      { text: "Steelers", points: 26, aliases: ["pittsburgh", "pittsburgh steelers"] },
      { text: "Cowboys", points: 18, aliases: ["dallas", "dallas cowboys"] },
      { text: "49ers", points: 12, aliases: ["san francisco", "niners", "sf"] },
      { text: "Giants", points: 6, aliases: ["new york giants", "ny giants"] },
    ]},
    { text: "Name something that happens at halftime", answers: [
      { text: "Halftime Show", points: 38, aliases: ["performance", "show", "concert"] },
      { text: "Bathroom Break", points: 24, aliases: ["bathroom", "restroom"] },
      { text: "Get Food", points: 18, aliases: ["food", "snacks", "eat", "concessions"] },
      { text: "Check Phone", points: 12, aliases: ["phone", "check scores", "fantasy"] },
      { text: "Analysis", points: 8, aliases: ["highlights", "commentary", "halftime report"] },
    ]},
    { text: "Name an NFL defensive position", answers: [
      { text: "Linebacker", points: 36, aliases: ["lb", "linebackers", "backer"] },
      { text: "Cornerback", points: 26, aliases: ["cb", "corner"] },
      { text: "Safety", points: 18, aliases: ["s", "free safety", "strong safety", "fs", "ss"] },
      { text: "Defensive End", points: 12, aliases: ["de", "end", "edge"] },
      { text: "Defensive Tackle", points: 8, aliases: ["dt", "nose tackle", "tackle"] },
    ]},
    { text: "Name a city that has hosted the Super Bowl", answers: [
      { text: "Miami", points: 38, aliases: ["miami gardens", "south florida"] },
      { text: "New Orleans", points: 26, aliases: ["nola"] },
      { text: "Los Angeles", points: 18, aliases: ["la", "inglewood"] },
      { text: "Tampa", points: 12, aliases: ["tampa bay"] },
      { text: "Phoenix", points: 6, aliases: ["glendale", "arizona", "scottsdale"] },
    ]},
  ],

  // Day 5
  [
    { text: "Name a famous NFL coach", answers: [
      { text: "Bill Belichick", points: 40, aliases: ["belichick", "bill"] },
      { text: "Vince Lombardi", points: 24, aliases: ["lombardi"] },
      { text: "Andy Reid", points: 18, aliases: ["reid", "andy", "big red"] },
      { text: "Mike Ditka", points: 12, aliases: ["ditka"] },
      { text: "Bill Walsh", points: 6, aliases: ["walsh"] },
    ]},
    { text: "Name an NFL team that wears orange", answers: [
      { text: "Broncos", points: 38, aliases: ["denver", "denver broncos"] },
      { text: "Bengals", points: 26, aliases: ["cincinnati", "cincinnati bengals"] },
      { text: "Bears", points: 18, aliases: ["chicago", "chicago bears"] },
      { text: "Browns", points: 12, aliases: ["cleveland", "cleveland browns"] },
      { text: "Dolphins", points: 6, aliases: ["miami", "miami dolphins"] },
    ]},
    { text: "Name a way to score in football", answers: [
      { text: "Touchdown", points: 40, aliases: ["td", "touchdowns"] },
      { text: "Field Goal", points: 26, aliases: ["fg", "field goals", "kick"] },
      { text: "Extra Point", points: 16, aliases: ["pat", "point after", "xp"] },
      { text: "Two-Point Conversion", points: 10, aliases: ["two point", "2 point", "2pt conversion"] },
      { text: "Safety", points: 8, aliases: ["safeties"] },
    ]},
    { text: "Name a famous NFL linebacker", answers: [
      { text: "Lawrence Taylor", points: 38, aliases: ["lt", "taylor", "lawrence"] },
      { text: "Ray Lewis", points: 26, aliases: ["lewis", "ray"] },
      { text: "Dick Butkus", points: 16, aliases: ["butkus"] },
      { text: "Patrick Willis", points: 12, aliases: ["willis", "patrick"] },
      { text: "Luke Kuechly", points: 8, aliases: ["kuechly", "luke"] },
    ]},
    { text: "Name a common football injury", answers: [
      { text: "ACL Tear", points: 40, aliases: ["acl", "torn acl", "knee"] },
      { text: "Concussion", points: 24, aliases: ["head injury", "concussions"] },
      { text: "Hamstring", points: 18, aliases: ["hamstring pull", "hammy", "hamstring strain"] },
      { text: "Ankle Sprain", points: 12, aliases: ["ankle", "sprained ankle", "twisted ankle"] },
      { text: "Broken Collarbone", points: 6, aliases: ["collarbone", "clavicle", "broken clavicle"] },
    ]},
  ],

  // Day 6
  [
    { text: "Name an NFL team in the AFC North", answers: [
      { text: "Steelers", points: 34, aliases: ["pittsburgh", "pittsburgh steelers"] },
      { text: "Ravens", points: 28, aliases: ["baltimore", "baltimore ravens"] },
      { text: "Bengals", points: 20, aliases: ["cincinnati", "cincinnati bengals", "cincy"] },
      { text: "Browns", points: 12, aliases: ["cleveland", "cleveland browns"] },
      { text: "Titans", points: 6, aliases: ["tennessee", "tennessee titans"] },
    ]},
    { text: "Name a famous NFL rivalry", answers: [
      { text: "Cowboys vs Eagles", points: 36, aliases: ["cowboys eagles", "eagles cowboys", "dallas philly"] },
      { text: "Packers vs Bears", points: 26, aliases: ["packers bears", "bears packers", "green bay chicago"] },
      { text: "Steelers vs Ravens", points: 18, aliases: ["steelers ravens", "ravens steelers", "pittsburgh baltimore"] },
      { text: "49ers vs Cowboys", points: 12, aliases: ["49ers cowboys", "cowboys 49ers", "sf dallas"] },
      { text: "Chiefs vs Raiders", points: 8, aliases: ["chiefs raiders", "raiders chiefs"] },
    ]},
    { text: "Name something a player does after scoring a touchdown", answers: [
      { text: "Spike the Ball", points: 36, aliases: ["spike", "ball spike", "spikes"] },
      { text: "Dance", points: 26, aliases: ["celebration dance", "td dance", "end zone dance"] },
      { text: "Chest Bump", points: 18, aliases: ["chest bumps", "bump"] },
      { text: "Point to Sky", points: 12, aliases: ["points up", "looks up", "point up"] },
      { text: "Flex", points: 8, aliases: ["flexes", "flexing", "muscles"] },
    ]},
    { text: "Name a network that broadcasts NFL games", answers: [
      { text: "ESPN", points: 36, aliases: ["espn+"] },
      { text: "Fox", points: 26, aliases: ["fox sports"] },
      { text: "CBS", points: 18, aliases: [] },
      { text: "NBC", points: 12, aliases: ["nbc sports", "peacock"] },
      { text: "Amazon", points: 8, aliases: ["prime", "amazon prime", "prime video", "thursday night football"] },
    ]},
    { text: "Name a famous NFL play everyone remembers", answers: [
      { text: "Immaculate Reception", points: 36, aliases: ["immaculate", "franco harris"] },
      { text: "The Catch", points: 26, aliases: ["dwight clark", "clark catch"] },
      { text: "Helmet Catch", points: 18, aliases: ["tyree", "david tyree"] },
      { text: "Philly Special", points: 12, aliases: ["philly", "foles catch"] },
      { text: "Music City Miracle", points: 8, aliases: ["titans lateral", "music city"] },
    ]},
  ],

  // Day 7
  [
    { text: "Name a famous NFL tight end", answers: [
      { text: "Travis Kelce", points: 40, aliases: ["kelce", "travis"] },
      { text: "Rob Gronkowski", points: 26, aliases: ["gronk", "gronkowski"] },
      { text: "Tony Gonzalez", points: 16, aliases: ["gonzalez", "tony g"] },
      { text: "Shannon Sharpe", points: 10, aliases: ["sharpe", "shannon"] },
      { text: "George Kittle", points: 8, aliases: ["kittle"] },
    ]},
    { text: "Name an NFL team with a blue uniform", answers: [
      { text: "Cowboys", points: 36, aliases: ["dallas", "dallas cowboys"] },
      { text: "Colts", points: 26, aliases: ["indianapolis", "indy", "indianapolis colts"] },
      { text: "Bills", points: 18, aliases: ["buffalo", "buffalo bills"] },
      { text: "Titans", points: 12, aliases: ["tennessee", "tennessee titans"] },
      { text: "Chargers", points: 8, aliases: ["la chargers", "los angeles chargers"] },
    ]},
    { text: "Name a reason a kicker gets booed", answers: [
      { text: "Missed Field Goal", points: 42, aliases: ["missed kick", "missed fg", "miss"] },
      { text: "Missed Extra Point", points: 24, aliases: ["missed pat", "missed xp"] },
      { text: "Short Kickoff", points: 16, aliases: ["bad kickoff", "short kick"] },
      { text: "Hit the Upright", points: 12, aliases: ["upright", "doink", "hit the post"] },
      { text: "Lost the Game", points: 6, aliases: ["cost the game", "blew it"] },
    ]},
    { text: "Name a type of pass route", answers: [
      { text: "Slant", points: 36, aliases: ["slant route", "slants"] },
      { text: "Go Route", points: 26, aliases: ["fly", "fly route", "streak", "go"] },
      { text: "Out Route", points: 18, aliases: ["out", "comeback"] },
      { text: "Post", points: 12, aliases: ["post route"] },
      { text: "Curl", points: 8, aliases: ["curl route", "hook", "hitch"] },
    ]},
    { text: "Name an NFL stadium everyone knows", answers: [
      { text: "Lambeau Field", points: 38, aliases: ["lambeau", "frozen tundra", "green bay"] },
      { text: "SoFi Stadium", points: 24, aliases: ["sofi", "la stadium"] },
      { text: "AT&T Stadium", points: 18, aliases: ["att", "jerry world", "dallas stadium"] },
      { text: "Arrowhead", points: 12, aliases: ["arrowhead stadium", "kansas city"] },
      { text: "MetLife Stadium", points: 8, aliases: ["metlife", "met life", "east rutherford"] },
    ]},
  ],

  // Day 8
  [
    { text: "Name a famous NFL number 12", answers: [
      { text: "Tom Brady", points: 40, aliases: ["brady", "tb12", "tb"] },
      { text: "Aaron Rodgers", points: 26, aliases: ["rodgers"] },
      { text: "Terry Bradshaw", points: 16, aliases: ["bradshaw", "terry"] },
      { text: "Joe Namath", points: 10, aliases: ["namath", "broadway joe"] },
      { text: "Roger Staubach", points: 8, aliases: ["staubach", "roger"] },
    ]},
    { text: "Name a famous NFL commentator", answers: [
      { text: "Tony Romo", points: 38, aliases: ["romo", "tony"] },
      { text: "Troy Aikman", points: 24, aliases: ["aikman", "troy"] },
      { text: "Al Michaels", points: 18, aliases: ["michaels", "al"] },
      { text: "Terry Bradshaw", points: 12, aliases: ["bradshaw", "terry"] },
      { text: "Pat McAfee", points: 8, aliases: ["mcafee", "pat"] },
    ]},
    { text: "Name a famous NFL draft bust", answers: [
      { text: "Ryan Leaf", points: 40, aliases: ["leaf", "ryan"] },
      { text: "JaMarcus Russell", points: 24, aliases: ["jamarcus", "russell"] },
      { text: "Johnny Manziel", points: 18, aliases: ["manziel", "johnny football", "johnny"] },
      { text: "Trent Richardson", points: 10, aliases: ["richardson", "trent"] },
      { text: "Tim Couch", points: 8, aliases: ["couch", "tim"] },
    ]},
    { text: "Name a college that produces NFL players", answers: [
      { text: "Alabama", points: 40, aliases: ["bama", "roll tide", "crimson tide"] },
      { text: "Ohio State", points: 24, aliases: ["osu", "buckeyes"] },
      { text: "LSU", points: 18, aliases: ["tigers", "louisiana state"] },
      { text: "Georgia", points: 12, aliases: ["bulldogs", "uga"] },
      { text: "Clemson", points: 6, aliases: ["clemson tigers"] },
    ]},
    { text: "Name something referees use during a game", answers: [
      { text: "Flag", points: 40, aliases: ["penalty flag", "yellow flag", "flags"] },
      { text: "Whistle", points: 26, aliases: ["whistles"] },
      { text: "Replay Monitor", points: 16, aliases: ["replay", "monitor", "tv", "review"] },
      { text: "Chains", points: 10, aliases: ["chain gang", "first down marker", "sticks"] },
      { text: "Coin", points: 8, aliases: ["coin toss", "coin flip"] },
    ]},
  ],

  // Day 9
  [
    { text: "Name a famous NFL defensive player", answers: [
      { text: "Lawrence Taylor", points: 36, aliases: ["lt", "taylor"] },
      { text: "Deion Sanders", points: 26, aliases: ["deion", "sanders", "prime time", "primetime"] },
      { text: "J.J. Watt", points: 18, aliases: ["jj watt", "watt", "jj"] },
      { text: "Ed Reed", points: 12, aliases: ["reed", "ed"] },
      { text: "Aaron Donald", points: 8, aliases: ["donald", "aaron"] },
    ]},
    { text: "Name an NFL team that plays in a dome", answers: [
      { text: "Cowboys", points: 36, aliases: ["dallas", "dallas cowboys"] },
      { text: "Falcons", points: 26, aliases: ["atlanta", "atlanta falcons"] },
      { text: "Saints", points: 18, aliases: ["new orleans", "new orleans saints"] },
      { text: "Lions", points: 12, aliases: ["detroit", "detroit lions"] },
      { text: "Cardinals", points: 8, aliases: ["arizona", "arizona cardinals"] },
    ]},
    { text: "Name something on an NFL scoreboard", answers: [
      { text: "Score", points: 38, aliases: ["points", "numbers"] },
      { text: "Time", points: 26, aliases: ["clock", "game clock", "time remaining"] },
      { text: "Down and Distance", points: 18, aliases: ["down", "distance", "downs"] },
      { text: "Quarter", points: 12, aliases: ["period", "qtr"] },
      { text: "Timeouts", points: 6, aliases: ["timeout", "timeouts remaining"] },
    ]},
    { text: "Name a Heisman winner who played in the NFL", answers: [
      { text: "Barry Sanders", points: 36, aliases: ["barry", "sanders"] },
      { text: "Bo Jackson", points: 26, aliases: ["bo", "jackson"] },
      { text: "Tim Tebow", points: 18, aliases: ["tebow", "tim"] },
      { text: "Lamar Jackson", points: 12, aliases: ["lamar"] },
      { text: "Cam Newton", points: 8, aliases: ["cam", "newton"] },
    ]},
    { text: "Name an NFL team in the NFC North", answers: [
      { text: "Packers", points: 36, aliases: ["green bay", "green bay packers", "gb"] },
      { text: "Bears", points: 26, aliases: ["chicago", "chicago bears", "da bears"] },
      { text: "Vikings", points: 18, aliases: ["minnesota", "minnesota vikings"] },
      { text: "Lions", points: 12, aliases: ["detroit", "detroit lions"] },
      { text: "Buccaneers", points: 8, aliases: ["bucs", "tampa", "tampa bay"] },
    ]},
  ],

  // Day 10
  [
    { text: "Name an NFL team that has never won a Super Bowl", answers: [
      { text: "Bills", points: 36, aliases: ["buffalo", "buffalo bills"] },
      { text: "Vikings", points: 26, aliases: ["minnesota", "minnesota vikings"] },
      { text: "Bengals", points: 18, aliases: ["cincinnati", "cincinnati bengals"] },
      { text: "Browns", points: 12, aliases: ["cleveland", "cleveland browns"] },
      { text: "Lions", points: 8, aliases: ["detroit", "detroit lions"] },
    ]},
    { text: "Name a weather condition that affects a game", answers: [
      { text: "Snow", points: 40, aliases: ["snowstorm", "blizzard", "snowing"] },
      { text: "Rain", points: 26, aliases: ["rainstorm", "downpour", "raining"] },
      { text: "Wind", points: 18, aliases: ["windy", "gusts", "high winds"] },
      { text: "Cold", points: 10, aliases: ["freezing", "ice", "frigid"] },
      { text: "Heat", points: 6, aliases: ["hot", "humidity", "humid"] },
    ]},
    { text: "Name a famous Super Bowl moment", answers: [
      { text: "Malcolm Butler INT", points: 36, aliases: ["butler interception", "butler pick", "malcolm butler"] },
      { text: "Helmet Catch", points: 26, aliases: ["tyree", "david tyree"] },
      { text: "28-3 Comeback", points: 18, aliases: ["28-3", "falcons collapse", "patriots comeback"] },
      { text: "Philly Special", points: 12, aliases: ["philly", "foles td"] },
      { text: "The Strip Sack", points: 8, aliases: ["von miller", "strip sack", "cam newton"] },
    ]},
    { text: "Name a famous Monday Night Football QB", answers: [
      { text: "Tom Brady", points: 38, aliases: ["brady", "tb12"] },
      { text: "Brett Favre", points: 26, aliases: ["favre", "brett"] },
      { text: "Peyton Manning", points: 18, aliases: ["manning", "peyton"] },
      { text: "Dan Marino", points: 10, aliases: ["marino", "dan"] },
      { text: "Joe Montana", points: 8, aliases: ["montana", "joe cool"] },
    ]},
    { text: "Name a position a rookie often starts at", answers: [
      { text: "Quarterback", points: 38, aliases: ["qb"] },
      { text: "Wide Receiver", points: 24, aliases: ["wr", "receiver", "wideout"] },
      { text: "Cornerback", points: 18, aliases: ["cb", "corner"] },
      { text: "Running Back", points: 12, aliases: ["rb", "halfback"] },
      { text: "Offensive Tackle", points: 8, aliases: ["tackle", "ot", "lt", "rt"] },
    ]},
  ],

  // Day 11
  [
    { text: "Name an NFL team with red in their colors", answers: [
      { text: "Chiefs", points: 36, aliases: ["kansas city", "kc", "kansas city chiefs"] },
      { text: "49ers", points: 26, aliases: ["san francisco", "niners", "sf"] },
      { text: "Cardinals", points: 18, aliases: ["arizona", "arizona cardinals"] },
      { text: "Buccaneers", points: 12, aliases: ["bucs", "tampa", "tampa bay"] },
      { text: "Falcons", points: 8, aliases: ["atlanta", "atlanta falcons"] },
    ]},
    { text: "Name a stat tracked for wide receivers", answers: [
      { text: "Receiving Yards", points: 38, aliases: ["yards", "yardage", "rec yards"] },
      { text: "Touchdowns", points: 26, aliases: ["tds", "td", "receiving tds"] },
      { text: "Receptions", points: 18, aliases: ["catches", "catch", "rec"] },
      { text: "Targets", points: 12, aliases: ["target"] },
      { text: "Yards After Catch", points: 6, aliases: ["yac"] },
    ]},
    { text: "Name an NFL Hall of Famer", answers: [
      { text: "Jerry Rice", points: 38, aliases: ["rice", "jerry"] },
      { text: "Jim Brown", points: 24, aliases: ["brown", "jim"] },
      { text: "Joe Montana", points: 18, aliases: ["montana"] },
      { text: "Walter Payton", points: 12, aliases: ["payton", "sweetness"] },
      { text: "Deion Sanders", points: 8, aliases: ["deion", "sanders", "prime time"] },
    ]},
    { text: "Name an NFL cold weather game", answers: [
      { text: "Ice Bowl", points: 40, aliases: ["ice bowl 1967", "1967 championship"] },
      { text: "Tuck Rule Game", points: 24, aliases: ["tuck rule", "snow bowl"] },
      { text: "Freezer Bowl", points: 18, aliases: ["freezer bowl 1982"] },
      { text: "Snow Plow Game", points: 12, aliases: ["snow plow", "snowplow"] },
      { text: "Snow Game 2013", points: 6, aliases: ["eagles lions snow", "snowmageddon"] },
    ]},
    { text: "Name a reason a player holds out", answers: [
      { text: "New Contract", points: 44, aliases: ["money", "contract", "pay raise", "more money"] },
      { text: "Trade Request", points: 24, aliases: ["trade", "wants trade", "wants out"] },
      { text: "Guaranteed Money", points: 16, aliases: ["guarantees", "guaranteed"] },
      { text: "Respect", points: 10, aliases: ["disrespected", "not valued"] },
      { text: "Injury Concern", points: 6, aliases: ["injury", "health", "staying healthy"] },
    ]},
  ],

  // Day 12
  [
    { text: "Name an NFL team in the AFC West", answers: [
      { text: "Chiefs", points: 36, aliases: ["kansas city", "kc", "kansas city chiefs"] },
      { text: "Raiders", points: 26, aliases: ["las vegas", "lv", "las vegas raiders"] },
      { text: "Broncos", points: 18, aliases: ["denver", "denver broncos"] },
      { text: "Chargers", points: 12, aliases: ["la chargers", "los angeles chargers"] },
      { text: "Seahawks", points: 8, aliases: ["seattle", "seattle seahawks"] },
    ]},
    { text: "Name something fans yell at the TV", answers: [
      { text: "Catch It", points: 36, aliases: ["catch the ball", "catch"] },
      { text: "Run It", points: 26, aliases: ["run", "run the ball"] },
      { text: "Throw It", points: 18, aliases: ["throw", "throw the ball", "pass it"] },
      { text: "Come On", points: 12, aliases: ["come on man", "cmon", "lets go"] },
      { text: "Are You Blind", points: 8, aliases: ["ref blind", "open your eyes", "are you kidding"] },
    ]},
    { text: "Name a famous kick return specialist", answers: [
      { text: "Devin Hester", points: 42, aliases: ["hester", "devin"] },
      { text: "Deion Sanders", points: 24, aliases: ["deion", "sanders", "prime time"] },
      { text: "Tyreek Hill", points: 16, aliases: ["hill", "tyreek", "cheetah"] },
      { text: "Dante Hall", points: 10, aliases: ["hall", "dante", "human joystick"] },
      { text: "Josh Cribbs", points: 8, aliases: ["cribbs", "josh"] },
    ]},
    { text: "Name a famous NFL pass rusher", answers: [
      { text: "Reggie White", points: 36, aliases: ["white", "reggie", "minister of defense"] },
      { text: "Bruce Smith", points: 24, aliases: ["smith", "bruce"] },
      { text: "Von Miller", points: 18, aliases: ["miller", "von"] },
      { text: "Michael Strahan", points: 14, aliases: ["strahan", "michael"] },
      { text: "Myles Garrett", points: 8, aliases: ["garrett", "myles"] },
    ]},
    { text: "Name an NFL team that changed cities", answers: [
      { text: "Raiders", points: 38, aliases: ["oakland raiders", "las vegas raiders", "la raiders"] },
      { text: "Rams", points: 26, aliases: ["st louis rams", "la rams", "los angeles rams"] },
      { text: "Chargers", points: 18, aliases: ["san diego chargers", "la chargers"] },
      { text: "Colts", points: 12, aliases: ["baltimore colts", "indianapolis colts"] },
      { text: "Browns/Ravens", points: 6, aliases: ["browns", "ravens", "cleveland to baltimore"] },
    ]},
  ],

  // Day 13
  [
    { text: "Name a type of defensive formation", answers: [
      { text: "4-3", points: 36, aliases: ["four three", "4 3", "43"] },
      { text: "3-4", points: 28, aliases: ["three four", "3 4", "34"] },
      { text: "Nickel", points: 18, aliases: ["nickel package", "nickel defense"] },
      { text: "Dime", points: 12, aliases: ["dime package", "dime defense"] },
      { text: "Goal Line", points: 6, aliases: ["goal line defense", "short yardage"] },
    ]},
    { text: "Name an NFL team with green in their uniform", answers: [
      { text: "Packers", points: 38, aliases: ["green bay", "green bay packers"] },
      { text: "Eagles", points: 26, aliases: ["philadelphia", "philly"] },
      { text: "Jets", points: 18, aliases: ["new york jets", "ny jets"] },
      { text: "Seahawks", points: 12, aliases: ["seattle", "seattle seahawks"] },
      { text: "Dolphins", points: 6, aliases: ["miami", "miami dolphins"] },
    ]},
    { text: "Name a franchise QB of the 2000s", answers: [
      { text: "Tom Brady", points: 40, aliases: ["brady", "tb12"] },
      { text: "Peyton Manning", points: 26, aliases: ["manning", "peyton"] },
      { text: "Drew Brees", points: 16, aliases: ["brees", "drew"] },
      { text: "Ben Roethlisberger", points: 10, aliases: ["big ben", "roethlisberger", "ben"] },
      { text: "Eli Manning", points: 8, aliases: ["eli", "manning"] },
    ]},
    { text: "Name a type of offensive play", answers: [
      { text: "Run Play", points: 36, aliases: ["run", "rushing", "handoff", "hand off"] },
      { text: "Pass Play", points: 26, aliases: ["pass", "passing", "throw"] },
      { text: "Screen", points: 18, aliases: ["screen pass", "bubble screen"] },
      { text: "Play Action", points: 12, aliases: ["play action pass", "pa", "fake handoff"] },
      { text: "Draw", points: 8, aliases: ["draw play", "delayed run"] },
    ]},
    { text: "Name a famous NFL sideline moment", answers: [
      { text: "Gatorade Shower", points: 38, aliases: ["gatorade bath", "gatorade dump", "dumping gatorade"] },
      { text: "Belichick Hoodie", points: 24, aliases: ["hoodie", "cut sleeves"] },
      { text: "Clipboard Throw", points: 18, aliases: ["clipboard", "throwing clipboard"] },
      { text: "Headset Smash", points: 12, aliases: ["headset", "breaking headset"] },
      { text: "Tears", points: 8, aliases: ["crying", "emotional"] },
    ]},
  ],

  // Day 14
  [
    { text: "Name a QB who changed teams and won a Super Bowl", answers: [
      { text: "Tom Brady", points: 40, aliases: ["brady", "tb12"] },
      { text: "Peyton Manning", points: 26, aliases: ["manning", "peyton"] },
      { text: "Drew Brees", points: 16, aliases: ["brees", "drew"] },
      { text: "Kurt Warner", points: 10, aliases: ["warner", "kurt"] },
      { text: "Russell Wilson", points: 8, aliases: ["wilson", "russ"] },
    ]},
    { text: "Name a famous 4th down play in NFL history", answers: [
      { text: "Philly Special", points: 40, aliases: ["foles td", "philly", "super bowl lii"] },
      { text: "4th and 26", points: 24, aliases: ["freddie mitchell", "eagles packers"] },
      { text: "Dez Caught It", points: 18, aliases: ["dez bryant", "dez", "no catch"] },
      { text: "The Drive", points: 10, aliases: ["elway drive", "john elway"] },
      { text: "River City Relay", points: 8, aliases: ["saints jaguars"] },
    ]},
    { text: "Name a superstition NFL fans have", answers: [
      { text: "Lucky Jersey", points: 40, aliases: ["jersey", "wear same jersey", "lucky shirt"] },
      { text: "Lucky Seat", points: 22, aliases: ["same seat", "lucky spot", "seat"] },
      { text: "Rally Cap", points: 16, aliases: ["hat", "lucky hat", "cap"] },
      { text: "Don't Jinx It", points: 14, aliases: ["jinx", "don't say it", "quiet"] },
      { text: "Same Routine", points: 8, aliases: ["routine", "ritual", "same bar"] },
    ]},
    { text: "Name a famous NFL sack leader", answers: [
      { text: "Bruce Smith", points: 36, aliases: ["smith", "bruce"] },
      { text: "Reggie White", points: 26, aliases: ["white", "reggie"] },
      { text: "Michael Strahan", points: 18, aliases: ["strahan", "michael"] },
      { text: "T.J. Watt", points: 12, aliases: ["tj watt", "watt", "tj"] },
      { text: "Kevin Greene", points: 8, aliases: ["greene", "kevin"] },
    ]},
    { text: "Name a round in the NFL Draft fans care about", answers: [
      { text: "First Round", points: 44, aliases: ["round 1", "1st round", "first"] },
      { text: "Second Round", points: 24, aliases: ["round 2", "2nd round", "second"] },
      { text: "Third Round", points: 16, aliases: ["round 3", "3rd round", "third"] },
      { text: "Undrafted", points: 10, aliases: ["udfa", "undrafted free agent"] },
      { text: "Seventh Round", points: 6, aliases: ["round 7", "7th round", "last round", "mr irrelevant"] },
    ]},
  ],

  // Day 15
  [
    { text: "Name something that happens in NFL overtime", answers: [
      { text: "Coin Toss", points: 38, aliases: ["coin flip", "toss", "coin"] },
      { text: "Touchdown Wins", points: 26, aliases: ["td wins", "touchdown", "score td"] },
      { text: "Field Goal", points: 18, aliases: ["fg", "kick"] },
      { text: "Turnover", points: 12, aliases: ["interception", "fumble", "pick"] },
      { text: "Tie", points: 6, aliases: ["draw", "tie game"] },
    ]},
    { text: "Name a famous NFL wide receiver route runner", answers: [
      { text: "Jerry Rice", points: 38, aliases: ["rice", "jerry"] },
      { text: "Davante Adams", points: 24, aliases: ["adams", "davante"] },
      { text: "Keenan Allen", points: 16, aliases: ["allen", "keenan"] },
      { text: "Stefon Diggs", points: 12, aliases: ["diggs", "stefon"] },
      { text: "Antonio Brown", points: 10, aliases: ["ab", "antonio", "brown"] },
    ]},
    { text: "Name a famous NFL offensive lineman", answers: [
      { text: "Anthony Munoz", points: 36, aliases: ["munoz", "anthony"] },
      { text: "Joe Thomas", points: 24, aliases: ["thomas", "joe"] },
      { text: "Jason Kelce", points: 20, aliases: ["kelce", "jason"] },
      { text: "Quenton Nelson", points: 12, aliases: ["nelson", "quenton", "big q"] },
      { text: "Larry Allen", points: 8, aliases: ["allen", "larry"] },
    ]},
    { text: "Name a famous NFL comeback", answers: [
      { text: "28-3", points: 42, aliases: ["patriots falcons", "super bowl li", "super bowl 51"] },
      { text: "The Comeback", points: 22, aliases: ["bills oilers", "1993 bills", "32 point comeback"] },
      { text: "The Drive", points: 18, aliases: ["john elway", "elway drive", "87 afc championship"] },
      { text: "Music City Miracle", points: 12, aliases: ["titans bills", "lateral", "music city"] },
      { text: "Minneapolis Miracle", points: 6, aliases: ["diggs", "stefon diggs", "vikings saints"] },
    ]},
    { text: "Name an injury that ends an NFL season", answers: [
      { text: "ACL Tear", points: 42, aliases: ["acl", "torn acl"] },
      { text: "Achilles Tear", points: 24, aliases: ["achilles", "torn achilles"] },
      { text: "Broken Leg", points: 16, aliases: ["leg break", "fractured leg", "broken tibia"] },
      { text: "Torn Pec", points: 10, aliases: ["pec tear", "pectoral", "torn pectoral"] },
      { text: "Broken Collarbone", points: 8, aliases: ["collarbone", "clavicle"] },
    ]},
  ],

  // Day 16
  [
    { text: "Name an NFL team known for loud crowd noise", answers: [
      { text: "Seahawks", points: 40, aliases: ["seattle", "12th man", "century link"] },
      { text: "Chiefs", points: 26, aliases: ["kansas city", "arrowhead", "kc"] },
      { text: "Saints", points: 16, aliases: ["new orleans", "superdome", "who dat"] },
      { text: "Bills", points: 12, aliases: ["buffalo", "bills mafia"] },
      { text: "Packers", points: 6, aliases: ["green bay", "lambeau"] },
    ]},
    { text: "Name a famous NFL interception", answers: [
      { text: "Malcolm Butler", points: 40, aliases: ["butler", "super bowl xlix", "goal line pick"] },
      { text: "Immaculate Reception", points: 24, aliases: ["franco harris", "immaculate"] },
      { text: "Marlin Jackson", points: 16, aliases: ["jackson", "colts super bowl"] },
      { text: "Tracy Porter", points: 12, aliases: ["porter", "saints super bowl"] },
      { text: "James Harrison", points: 8, aliases: ["harrison", "100 yard pick six"] },
    ]},
    { text: "Name a penalty that gives an automatic first down", answers: [
      { text: "Pass Interference", points: 40, aliases: ["pi", "dpi", "interference"] },
      { text: "Roughing the Passer", points: 26, aliases: ["roughing", "rtp"] },
      { text: "Face Mask", points: 18, aliases: ["facemask", "face mask penalty"] },
      { text: "Roughing the Kicker", points: 10, aliases: ["roughing kicker", "rtk"] },
      { text: "Illegal Contact", points: 6, aliases: ["illegal contact downfield"] },
    ]},
    { text: "Name an NFL reality show or documentary", answers: [
      { text: "Hard Knocks", points: 44, aliases: ["hardknocks", "hbo hard knocks"] },
      { text: "All or Nothing", points: 22, aliases: ["amazon all or nothing"] },
      { text: "A Football Life", points: 16, aliases: ["football life"] },
      { text: "Quarterback", points: 10, aliases: ["netflix quarterback"] },
      { text: "America's Game", points: 8, aliases: ["americas game"] },
    ]},
    { text: "Name a type of snap in football", answers: [
      { text: "Shotgun", points: 40, aliases: ["shotgun snap", "gun"] },
      { text: "Under Center", points: 26, aliases: ["under center snap", "center snap"] },
      { text: "Pistol", points: 16, aliases: ["pistol formation"] },
      { text: "Long Snap", points: 10, aliases: ["punt snap", "long snapper"] },
      { text: "Quick Snap", points: 8, aliases: ["hurry up", "no huddle"] },
    ]},
  ],

  // Day 17
  [
    { text: "Name a famous NFL trash talker", answers: [
      { text: "Richard Sherman", points: 38, aliases: ["sherman", "richard", "sherm"] },
      { text: "Deion Sanders", points: 24, aliases: ["deion", "sanders", "prime time"] },
      { text: "Jalen Ramsey", points: 18, aliases: ["ramsey", "jalen"] },
      { text: "Shannon Sharpe", points: 12, aliases: ["sharpe", "shannon"] },
      { text: "Terrell Owens", points: 8, aliases: ["to", "owens", "terrell"] },
    ]},
    { text: "Name a famous NFL punter", answers: [
      { text: "Pat McAfee", points: 40, aliases: ["mcafee", "pat"] },
      { text: "Ray Guy", points: 24, aliases: ["guy", "ray"] },
      { text: "Michael Dickson", points: 16, aliases: ["dickson", "michael"] },
      { text: "Shane Lechler", points: 12, aliases: ["lechler", "shane"] },
      { text: "Johnny Hekker", points: 8, aliases: ["hekker", "johnny"] },
    ]},
    { text: "Name an NFL team with an animal name", answers: [
      { text: "Bears", points: 36, aliases: ["chicago", "chicago bears"] },
      { text: "Eagles", points: 26, aliases: ["philadelphia", "philly", "philadelphia eagles"] },
      { text: "Dolphins", points: 18, aliases: ["miami", "miami dolphins"] },
      { text: "Rams", points: 12, aliases: ["la rams", "los angeles rams"] },
      { text: "Broncos", points: 8, aliases: ["denver", "denver broncos"] },
    ]},
    { text: "Name something that creates QB pressure", answers: [
      { text: "Blitz", points: 40, aliases: ["blitzing", "pass rush blitz"] },
      { text: "Pass Rush", points: 24, aliases: ["rush", "d-line", "defensive line"] },
      { text: "Crowd Noise", points: 16, aliases: ["noise", "crowd", "loud stadium"] },
      { text: "Coverage", points: 12, aliases: ["tight coverage", "good coverage"] },
      { text: "Clock", points: 8, aliases: ["time running out", "game clock", "play clock"] },
    ]},
    { text: "Name a player known for the stiff arm", answers: [
      { text: "Derrick Henry", points: 44, aliases: ["henry", "derrick", "king henry"] },
      { text: "Marshawn Lynch", points: 24, aliases: ["lynch", "marshawn", "beast mode"] },
      { text: "Earl Campbell", points: 14, aliases: ["campbell", "earl"] },
      { text: "Adrian Peterson", points: 10, aliases: ["ap", "peterson"] },
      { text: "Jerome Bettis", points: 8, aliases: ["bettis", "the bus", "bus"] },
    ]},
  ],

  // Day 18
  [
    { text: "Name a famous NFL Comeback Player of the Year", answers: [
      { text: "Adrian Peterson", points: 38, aliases: ["ap", "peterson", "adrian"] },
      { text: "Alex Smith", points: 24, aliases: ["smith", "alex"] },
      { text: "Joe Flacco", points: 16, aliases: ["flacco", "joe"] },
      { text: "Damar Hamlin", points: 12, aliases: ["hamlin", "damar"] },
      { text: "Eric Berry", points: 10, aliases: ["berry", "eric"] },
    ]},
    { text: "Name a popular NFL stadium food", answers: [
      { text: "Hot Dog", points: 40, aliases: ["hotdog", "hot dogs", "dogs"] },
      { text: "Nachos", points: 24, aliases: ["nacho", "chips"] },
      { text: "Burger", points: 18, aliases: ["hamburger", "cheeseburger", "burgers"] },
      { text: "Pretzel", points: 12, aliases: ["pretzels", "soft pretzel"] },
      { text: "Chicken Tenders", points: 6, aliases: ["tenders", "chicken fingers", "chicken strips"] },
    ]},
    { text: "Name an NFL play that was overturned on review", answers: [
      { text: "Dez Caught It", points: 40, aliases: ["dez", "dez bryant", "no catch"] },
      { text: "Tuck Rule", points: 24, aliases: ["tuck rule game", "brady fumble"] },
      { text: "Calvin Johnson Rule", points: 18, aliases: ["megatron catch", "calvin johnson"] },
      { text: "Jesse James Catch", points: 10, aliases: ["jesse james", "steelers catch"] },
      { text: "Bert Emanuel", points: 8, aliases: ["emanuel", "bucs catch"] },
    ]},
    { text: "Name a famous NFL free safety", answers: [
      { text: "Ed Reed", points: 38, aliases: ["reed", "ed"] },
      { text: "Earl Thomas", points: 24, aliases: ["thomas", "earl", "et3"] },
      { text: "Brian Dawkins", points: 18, aliases: ["dawkins", "b-dawk", "weapon x"] },
      { text: "Ronnie Lott", points: 12, aliases: ["lott", "ronnie"] },
      { text: "Paul Krause", points: 8, aliases: ["krause", "paul"] },
    ]},
    { text: "Name a way to get a first down", answers: [
      { text: "Run", points: 38, aliases: ["rushing", "run play", "rush"] },
      { text: "Pass", points: 26, aliases: ["passing", "throw", "catch"] },
      { text: "Penalty", points: 18, aliases: ["flag", "defensive penalty"] },
      { text: "Scramble", points: 12, aliases: ["qb run", "qb scramble", "quarterback run"] },
      { text: "Draw Play", points: 6, aliases: ["draw", "delayed run"] },
    ]},
  ],

  // Day 19
  [
    { text: "Name a famous NFL social media moment", answers: [
      { text: "Antonio Brown Exit", points: 38, aliases: ["ab quits", "antonio brown", "ab leaves field"] },
      { text: "Odell Catch", points: 24, aliases: ["obj catch", "one hand catch", "odell beckham"] },
      { text: "Sherman Rant", points: 18, aliases: ["richard sherman", "dont you ever", "crabtree rant"] },
      { text: "Kelce Speech", points: 12, aliases: ["travis kelce", "parade speech"] },
      { text: "McAfee Show", points: 8, aliases: ["pat mcafee", "mcafee"] },
    ]},
    { text: "Name a famous NFL trick play", answers: [
      { text: "Philly Special", points: 42, aliases: ["philly", "foles td", "foles catch"] },
      { text: "Fake Punt", points: 22, aliases: ["fake punt run", "punter run"] },
      { text: "Flea Flicker", points: 18, aliases: ["flea flicker pass"] },
      { text: "Hook and Lateral", points: 10, aliases: ["hook and ladder", "lateral"] },
      { text: "Fumblerooski", points: 8, aliases: ["fumble rooski"] },
    ]},
    { text: "Name a famous dual-threat quarterback", answers: [
      { text: "Lamar Jackson", points: 38, aliases: ["lamar", "jackson"] },
      { text: "Michael Vick", points: 26, aliases: ["vick", "michael"] },
      { text: "Josh Allen", points: 16, aliases: ["allen", "josh"] },
      { text: "Cam Newton", points: 12, aliases: ["cam", "newton", "superman"] },
      { text: "Russell Wilson", points: 8, aliases: ["wilson", "russ"] },
    ]},
    { text: "Name something a player says in a post-game interview", answers: [
      { text: "Gave 110%", points: 36, aliases: ["110 percent", "gave it all", "left it all"] },
      { text: "Team Win", points: 26, aliases: ["team effort", "we played together"] },
      { text: "God is Good", points: 18, aliases: ["thank god", "blessed", "glory to god"] },
      { text: "On to Next Week", points: 12, aliases: ["next game", "one game at a time"] },
      { text: "Great Fans", points: 8, aliases: ["fans were great", "thank the fans", "12th man"] },
    ]},
    { text: "Name an NFL team known for great chemistry", answers: [
      { text: "Patriots", points: 38, aliases: ["new england", "pats", "belichick patriots"] },
      { text: "Steelers", points: 24, aliases: ["pittsburgh", "pittsburgh steelers"] },
      { text: "Chiefs", points: 18, aliases: ["kansas city", "kc"] },
      { text: "Seahawks", points: 12, aliases: ["seattle", "legion of boom"] },
      { text: "Ravens", points: 8, aliases: ["baltimore", "baltimore ravens"] },
    ]},
  ],

  // Day 20
  [
    { text: "Name a famous NFL audible call", answers: [
      { text: "Omaha", points: 44, aliases: ["peyton omaha", "omaha omaha"] },
      { text: "Kill Kill", points: 22, aliases: ["kill", "kill call"] },
      { text: "Blue 80", points: 16, aliases: ["blue eighty"] },
      { text: "Green 19", points: 10, aliases: ["green nineteen", "aaron rodgers"] },
      { text: "Spider 2 Y Banana", points: 8, aliases: ["spider 2", "gruden"] },
    ]},
    { text: "Name a famous NFL fan chant", answers: [
      { text: "Who Dat", points: 38, aliases: ["who dat nation", "saints chant"] },
      { text: "Skol", points: 24, aliases: ["skol chant", "vikings skol"] },
      { text: "Here We Go", points: 16, aliases: ["here we go steelers", "steelers chant"] },
      { text: "J-E-T-S", points: 12, aliases: ["jets jets jets", "jets chant"] },
      { text: "Fly Eagles Fly", points: 10, aliases: ["eagles fight song", "fly eagles"] },
    ]},
    { text: "Name an injury that changed NFL history", answers: [
      { text: "Joe Theismann Leg", points: 38, aliases: ["theismann", "theismann broken leg"] },
      { text: "Bo Jackson Hip", points: 24, aliases: ["bo jackson", "bo hip injury"] },
      { text: "Peyton Manning Neck", points: 16, aliases: ["manning neck", "peyton neck"] },
      { text: "RG3 Knee", points: 12, aliases: ["rg3", "robert griffin", "griffin knee"] },
      { text: "Damar Hamlin", points: 10, aliases: ["hamlin", "cardiac arrest", "damar"] },
    ]},
    { text: "Name a famous NFL contract holdout", answers: [
      { text: "Le'Veon Bell", points: 38, aliases: ["bell", "leveon", "le'veon"] },
      { text: "Emmitt Smith", points: 22, aliases: ["emmitt", "smith"] },
      { text: "Ezekiel Elliott", points: 18, aliases: ["zeke", "elliott", "ezekiel"] },
      { text: "Tyreek Hill", points: 12, aliases: ["hill", "tyreek"] },
      { text: "Joey Bosa", points: 10, aliases: ["bosa", "joey"] },
    ]},
    { text: "Name a way a game-winning TD gets scored", answers: [
      { text: "Hail Mary", points: 38, aliases: ["hail mary pass", "deep throw"] },
      { text: "Rushing TD", points: 24, aliases: ["run", "run it in", "goal line run"] },
      { text: "Fade Route", points: 16, aliases: ["fade", "corner fade", "end zone fade"] },
      { text: "Pick Six", points: 12, aliases: ["interception td", "pick 6", "defensive td"] },
      { text: "Fumble Recovery", points: 10, aliases: ["scoop and score", "fumble td"] },
    ]},
  ],

  // Day 21
  [
    { text: "Name a famous NFL mock draft analyst", answers: [
      { text: "Mel Kiper", points: 42, aliases: ["kiper", "mel kiper jr", "mel"] },
      { text: "Todd McShay", points: 24, aliases: ["mcshay", "todd"] },
      { text: "Daniel Jeremiah", points: 16, aliases: ["jeremiah", "daniel", "dj"] },
      { text: "Peter King", points: 10, aliases: ["king", "peter"] },
      { text: "Chris Simms", points: 8, aliases: ["simms", "chris"] },
    ]},
    { text: "Name a famous special teams play", answers: [
      { text: "Hester Return", points: 38, aliases: ["hester", "devin hester", "super bowl return"] },
      { text: "Music City Miracle", points: 26, aliases: ["music city", "titans lateral"] },
      { text: "Blocked Punt", points: 16, aliases: ["block punt", "punt block", "blocked kick"] },
      { text: "Fake Field Goal", points: 12, aliases: ["fake fg", "fake kick"] },
      { text: "Onside Kick", points: 8, aliases: ["onside", "surprise onside"] },
    ]},
    { text: "Name a famous NFL run stuffer", answers: [
      { text: "Aaron Donald", points: 38, aliases: ["donald", "aaron"] },
      { text: "Vince Wilfork", points: 24, aliases: ["wilfork", "vince", "big vince"] },
      { text: "Haloti Ngata", points: 16, aliases: ["ngata", "haloti"] },
      { text: "Ndamukong Suh", points: 12, aliases: ["suh", "ndamukong"] },
      { text: "Casey Hampton", points: 10, aliases: ["hampton", "casey", "big snack"] },
    ]},
    { text: "Name a controversial NFL replay review", answers: [
      { text: "Tuck Rule", points: 40, aliases: ["tuck rule game", "brady fumble"] },
      { text: "Dez Caught It", points: 26, aliases: ["dez", "dez bryant", "cowboys packers"] },
      { text: "Saints No-Call", points: 16, aliases: ["rams saints", "nfc championship no call", "no call pi"] },
      { text: "Calvin Johnson Rule", points: 10, aliases: ["megatron catch", "calvin johnson"] },
      { text: "Fail Mary", points: 8, aliases: ["replacement refs", "packers seahawks"] },
    ]},
    { text: "Name something a dejected fan does leaving the stadium", answers: [
      { text: "Takes Off Jersey", points: 36, aliases: ["removes jersey", "jersey off"] },
      { text: "Silence", points: 26, aliases: ["quiet", "says nothing", "walks silently"] },
      { text: "Fire the Coach", points: 18, aliases: ["fire him", "calls for firing"] },
      { text: "Throws Gear", points: 12, aliases: ["throws hat", "throws stuff"] },
      { text: "Never Coming Back", points: 8, aliases: ["done with this team", "vows not to return"] },
    ]},
  ],

  // Day 22
  [
    { text: "Name a famous NFL offensive coordinator", answers: [
      { text: "Kyle Shanahan", points: 36, aliases: ["shanahan", "kyle"] },
      { text: "Sean McVay", points: 26, aliases: ["mcvay", "sean"] },
      { text: "Mike McDaniel", points: 16, aliases: ["mcdaniel", "mike"] },
      { text: "Josh McDaniels", points: 12, aliases: ["mcdaniels", "josh"] },
      { text: "Brian Daboll", points: 10, aliases: ["daboll", "brian"] },
    ]},
    { text: "Name something a Super Bowl ring represents", answers: [
      { text: "Championship", points: 40, aliases: ["winning", "champion", "title"] },
      { text: "Legacy", points: 24, aliases: ["greatness", "legend"] },
      { text: "Teamwork", points: 16, aliases: ["team", "together"] },
      { text: "Hard Work", points: 12, aliases: ["dedication", "sacrifice"] },
      { text: "Money", points: 8, aliases: ["wealth", "value", "expensive"] },
    ]},
    { text: "Name an NFL team with a patriotic name", answers: [
      { text: "Patriots", points: 42, aliases: ["new england", "pats", "new england patriots"] },
      { text: "Cowboys", points: 22, aliases: ["dallas", "dallas cowboys", "americas team"] },
      { text: "Eagles", points: 18, aliases: ["philadelphia", "philly"] },
      { text: "Commanders", points: 12, aliases: ["washington", "washington commanders"] },
      { text: "Texans", points: 6, aliases: ["houston", "houston texans"] },
    ]},
    { text: "Name a famous franchise tag player", answers: [
      { text: "Kirk Cousins", points: 38, aliases: ["cousins", "kirk"] },
      { text: "Dak Prescott", points: 24, aliases: ["dak", "prescott"] },
      { text: "Le'Veon Bell", points: 18, aliases: ["bell", "leveon"] },
      { text: "Davante Adams", points: 12, aliases: ["adams", "davante"] },
      { text: "Lamar Jackson", points: 8, aliases: ["lamar", "jackson"] },
    ]},
    { text: "Name a famous two-point conversion", answers: [
      { text: "Philly Special", points: 38, aliases: ["philly", "super bowl lii", "foles"] },
      { text: "28-3 Comeback", points: 26, aliases: ["patriots falcons", "white catch"] },
      { text: "Ravens 49ers SB", points: 16, aliases: ["super bowl xlvii", "flacco"] },
      { text: "Steelers Conversion", points: 12, aliases: ["steelers", "santonio holmes"] },
      { text: "Chiefs Comeback", points: 8, aliases: ["mahomes", "chiefs super bowl"] },
    ]},
  ],

  // Day 23
  [
    { text: "Name an NFL player known for mic'd up", answers: [
      { text: "Patrick Mahomes", points: 36, aliases: ["mahomes", "pat"] },
      { text: "Larry Fitzgerald", points: 24, aliases: ["fitz", "larry", "fitzgerald"] },
      { text: "Travis Kelce", points: 18, aliases: ["kelce", "travis"] },
      { text: "Peyton Manning", points: 12, aliases: ["manning", "peyton"] },
      { text: "Ray Lewis", points: 10, aliases: ["lewis", "ray"] },
    ]},
    { text: "Name a famous NFL cornerback", answers: [
      { text: "Deion Sanders", points: 40, aliases: ["deion", "sanders", "prime time"] },
      { text: "Darrelle Revis", points: 22, aliases: ["revis", "revis island"] },
      { text: "Richard Sherman", points: 18, aliases: ["sherman", "richard"] },
      { text: "Charles Woodson", points: 12, aliases: ["woodson", "charles"] },
      { text: "Jalen Ramsey", points: 8, aliases: ["ramsey", "jalen"] },
    ]},
    { text: "Name a famous TD celebration", answers: [
      { text: "Lambeau Leap", points: 38, aliases: ["lambeau", "leap", "jump into crowd"] },
      { text: "Gronk Spike", points: 24, aliases: ["gronk", "spike", "gronkowski"] },
      { text: "Dirty Bird", points: 16, aliases: ["dirty bird dance", "falcons dance"] },
      { text: "Ickey Shuffle", points: 12, aliases: ["ickey", "shuffle", "ickey woods"] },
      { text: "Mile High Salute", points: 10, aliases: ["salute", "mile high", "broncos salute"] },
    ]},
    { text: "Name a famous NFL veteran leader", answers: [
      { text: "Tom Brady", points: 40, aliases: ["brady", "tb12"] },
      { text: "Ray Lewis", points: 24, aliases: ["lewis", "ray"] },
      { text: "Peyton Manning", points: 18, aliases: ["manning", "peyton"] },
      { text: "Aaron Rodgers", points: 12, aliases: ["rodgers"] },
      { text: "Drew Brees", points: 6, aliases: ["brees", "drew"] },
    ]},
    { text: "Name a type of crowd noise at a game", answers: [
      { text: "Boo", points: 36, aliases: ["booing", "boos"] },
      { text: "Cheer", points: 26, aliases: ["cheering", "cheers", "roar"] },
      { text: "Defense Chant", points: 18, aliases: ["defense", "d-fence", "d fence"] },
      { text: "Wave", points: 12, aliases: ["the wave", "doing the wave"] },
      { text: "MVP Chant", points: 8, aliases: ["mvp", "mvp mvp"] },
    ]},
  ],

  // Day 24
  [
    { text: "Name a famous last-second field goal kicker", answers: [
      { text: "Adam Vinatieri", points: 42, aliases: ["vinatieri", "adam", "snow bowl kick"] },
      { text: "Justin Tucker", points: 24, aliases: ["tucker", "66 yard", "record kick"] },
      { text: "Scott Norwood", points: 16, aliases: ["norwood", "wide right"] },
      { text: "Matt Bryant", points: 10, aliases: ["bryant", "matt"] },
      { text: "Harrison Butker", points: 8, aliases: ["butker", "harrison"] },
    ]},
    { text: "Name something that kills a team's momentum", answers: [
      { text: "Turnover", points: 40, aliases: ["fumble", "interception", "pick"] },
      { text: "Penalty", points: 24, aliases: ["flag", "holding", "false start"] },
      { text: "Injury", points: 18, aliases: ["hurt player", "star injured"] },
      { text: "Three and Out", points: 12, aliases: ["3 and out", "punt"] },
      { text: "Timeout", points: 6, aliases: ["bad timeout", "wasted timeout"] },
    ]},
    { text: "Name something fans argue about after the Draft", answers: [
      { text: "Draft Grade", points: 38, aliases: ["grade", "grades", "rating"] },
      { text: "Reach Pick", points: 24, aliases: ["reach", "overdrafted", "too high"] },
      { text: "Steal", points: 18, aliases: ["value pick", "great value", "bargain"] },
      { text: "Wrong Position", points: 12, aliases: ["should have picked", "needed qb", "wrong need"] },
      { text: "Trade Up", points: 8, aliases: ["traded up", "gave up too much"] },
    ]},
    { text: "Name a situation where a QB feels the most pressure", answers: [
      { text: "4th Quarter", points: 36, aliases: ["late game", "end of game", "final drive"] },
      { text: "Playoff Game", points: 26, aliases: ["playoffs", "postseason"] },
      { text: "Red Zone", points: 18, aliases: ["inside the 20", "goal line"] },
      { text: "3rd and Long", points: 12, aliases: ["third and long", "3rd down"] },
      { text: "Two Minute Drill", points: 8, aliases: ["2 minute drill", "two minute warning"] },
    ]},
    { text: "Name an NFL game fans still talk about", answers: [
      { text: "Super Bowl LI", points: 38, aliases: ["28-3", "patriots falcons", "51"] },
      { text: "Ice Bowl", points: 22, aliases: ["1967 ice bowl", "packers cowboys"] },
      { text: "Helmet Catch SB", points: 18, aliases: ["super bowl xlii", "giants patriots", "42"] },
      { text: "The Catch", points: 14, aliases: ["49ers cowboys", "dwight clark", "1982 nfc"] },
      { text: "Minneapolis Miracle", points: 8, aliases: ["diggs", "stefon diggs", "vikings saints"] },
    ]},
  ],

  // Day 25
  [
    { text: "Name a type of zone defense", answers: [
      { text: "Cover 2", points: 38, aliases: ["cover two", "tampa 2", "tampa two"] },
      { text: "Cover 3", points: 26, aliases: ["cover three"] },
      { text: "Cover 4", points: 18, aliases: ["cover four", "quarters"] },
      { text: "Cover 6", points: 10, aliases: ["cover six"] },
      { text: "Prevent", points: 8, aliases: ["prevent defense", "prevent zone"] },
    ]},
    { text: "Name a famous bad NFL trade", answers: [
      { text: "Herschel Walker", points: 40, aliases: ["walker trade", "herschel", "vikings cowboys"] },
      { text: "Ricky Williams", points: 22, aliases: ["ricky", "williams", "saints trade"] },
      { text: "Trent Richardson", points: 16, aliases: ["richardson", "trent", "colts browns"] },
      { text: "Jay Cutler", points: 12, aliases: ["cutler", "jay", "broncos bears"] },
      { text: "Sam Bradford", points: 10, aliases: ["bradford", "sam", "eagles trade"] },
    ]},
    { text: "Name a QB known for the deep ball", answers: [
      { text: "Patrick Mahomes", points: 38, aliases: ["mahomes", "pat"] },
      { text: "Josh Allen", points: 24, aliases: ["allen", "josh"] },
      { text: "Dan Marino", points: 16, aliases: ["marino", "dan"] },
      { text: "Brett Favre", points: 12, aliases: ["favre", "brett"] },
      { text: "Aaron Rodgers", points: 10, aliases: ["rodgers", "a rod"] },
    ]},
    { text: "Name a famous NFL sideline reporter", answers: [
      { text: "Erin Andrews", points: 40, aliases: ["andrews", "erin"] },
      { text: "Lisa Salters", points: 22, aliases: ["salters", "lisa"] },
      { text: "Suzy Kolber", points: 16, aliases: ["kolber", "suzy"] },
      { text: "Michele Tafoya", points: 12, aliases: ["tafoya", "michele"] },
      { text: "Pam Oliver", points: 10, aliases: ["oliver", "pam"] },
    ]},
    { text: "Name a halftime defensive adjustment", answers: [
      { text: "More Blitzing", points: 36, aliases: ["blitz more", "send pressure", "blitz"] },
      { text: "Switch to Zone", points: 26, aliases: ["zone", "zone defense", "play zone"] },
      { text: "Double Team Star", points: 18, aliases: ["double team", "bracket", "double cover"] },
      { text: "Change Coverage", points: 12, aliases: ["adjust coverage", "new scheme"] },
      { text: "Sub Players", points: 8, aliases: ["substitution", "new players", "fresh legs"] },
    ]},
  ],

  // Day 26
  [
    { text: "Name a reason coaches settle for a field goal", answers: [
      { text: "Playing it Safe", points: 38, aliases: ["safe", "conservative", "take the points"] },
      { text: "Close Game", points: 24, aliases: ["tight game", "one score game"] },
      { text: "Bad Offense", points: 16, aliases: ["struggling offense", "cant score"] },
      { text: "End of Half", points: 12, aliases: ["clock running", "halftime", "time"] },
      { text: "Trust the Kicker", points: 10, aliases: ["good kicker", "reliable kicker"] },
    ]},
    { text: "Name a time a lineman scored a touchdown", answers: [
      { text: "The Fridge", points: 40, aliases: ["refrigerator perry", "fridge", "william perry"] },
      { text: "Eligible Receiver", points: 22, aliases: ["big man td", "eligible"] },
      { text: "Fumble Recovery", points: 18, aliases: ["scoop and score", "fumble td"] },
      { text: "Trick Play", points: 12, aliases: ["tackle eligible", "tackle catch"] },
      { text: "Goal Line Push", points: 8, aliases: ["push", "goal line"] },
    ]},
    { text: "Name something that gets a fan banned from a stadium", answers: [
      { text: "Fighting", points: 40, aliases: ["fight", "punching", "brawl"] },
      { text: "Running on Field", points: 24, aliases: ["field runner", "streaking", "on the field"] },
      { text: "Throwing Objects", points: 18, aliases: ["throwing things", "throwing beer", "throwing stuff"] },
      { text: "Drunk and Disorderly", points: 10, aliases: ["too drunk", "drunk", "intoxicated"] },
      { text: "Verbal Abuse", points: 8, aliases: ["threats", "harassment", "threatening"] },
    ]},
    { text: "Name an NFL team that uses a RB committee", answers: [
      { text: "Patriots", points: 36, aliases: ["new england", "pats"] },
      { text: "49ers", points: 26, aliases: ["san francisco", "niners", "sf"] },
      { text: "Ravens", points: 18, aliases: ["baltimore", "baltimore ravens"] },
      { text: "Dolphins", points: 12, aliases: ["miami", "miami dolphins"] },
      { text: "Broncos", points: 8, aliases: ["denver", "denver broncos"] },
    ]},
    { text: "Name a famous NFL rushing touchdown", answers: [
      { text: "Beast Quake", points: 42, aliases: ["beastquake", "marshawn lynch", "beast mode run"] },
      { text: "Emmitt Smith Record", points: 22, aliases: ["emmitt smith", "rushing record"] },
      { text: "Walter Payton Run", points: 16, aliases: ["sweetness", "payton td"] },
      { text: "Derrick Henry Run", points: 12, aliases: ["henry", "king henry run"] },
      { text: "Barry Sanders Juke", points: 8, aliases: ["barry", "sanders run"] },
    ]},
  ],

  // Day 27
  [
    { text: "Name an NFL team's worst loss ever", answers: [
      { text: "28-3", points: 40, aliases: ["falcons super bowl", "falcons collapse"] },
      { text: "Wide Right", points: 22, aliases: ["norwood miss", "bills super bowl"] },
      { text: "Double Doink", points: 18, aliases: ["bears double doink", "cody parkey"] },
      { text: "Fail Mary", points: 12, aliases: ["packers seahawks", "replacement refs"] },
      { text: "Butt Fumble", points: 8, aliases: ["jets butt fumble", "mark sanchez"] },
    ]},
    { text: "Name an NFL team that plays on Thanksgiving", answers: [
      { text: "Cowboys", points: 44, aliases: ["dallas", "dallas cowboys"] },
      { text: "Lions", points: 28, aliases: ["detroit", "detroit lions"] },
      { text: "Bears", points: 12, aliases: ["chicago", "chicago bears"] },
      { text: "Packers", points: 10, aliases: ["green bay", "green bay packers"] },
      { text: "Vikings", points: 6, aliases: ["minnesota", "minnesota vikings"] },
    ]},
    { text: "Name a famous final drive quarterback", answers: [
      { text: "Tom Brady", points: 40, aliases: ["brady", "tb12"] },
      { text: "John Elway", points: 24, aliases: ["elway", "john"] },
      { text: "Joe Montana", points: 18, aliases: ["montana", "joe cool"] },
      { text: "Patrick Mahomes", points: 10, aliases: ["mahomes", "pat"] },
      { text: "Aaron Rodgers", points: 8, aliases: ["rodgers"] },
    ]},
    { text: "Name an NFL dynasty team", answers: [
      { text: "Patriots", points: 42, aliases: ["new england", "pats", "brady belichick"] },
      { text: "Steelers 70s", points: 22, aliases: ["70s steelers", "steel curtain", "pittsburgh steelers"] },
      { text: "49ers 80s", points: 16, aliases: ["80s 49ers", "walsh montana", "san francisco"] },
      { text: "Cowboys 90s", points: 12, aliases: ["90s cowboys", "aikman smith irvin", "dallas"] },
      { text: "Chiefs", points: 8, aliases: ["kansas city", "kc", "mahomes chiefs"] },
    ]},
    { text: "Name an NFL team record that's hard to break", answers: [
      { text: "Undefeated Season", points: 40, aliases: ["perfect season", "17-0", "dolphins 72"] },
      { text: "Most Wins", points: 24, aliases: ["win streak", "consecutive wins"] },
      { text: "Points Scored", points: 18, aliases: ["most points", "scoring record"] },
      { text: "Rushing Record", points: 12, aliases: ["rushing yards", "most rushing"] },
      { text: "Sack Record", points: 6, aliases: ["most sacks", "sacks in season"] },
    ]},
  ],

  // Day 28
  [
    { text: "Name something families do on NFL Sundays", answers: [
      { text: "Watch the Game", points: 40, aliases: ["watch", "watch football", "tv"] },
      { text: "Eat Food", points: 24, aliases: ["cook", "cookout", "snacks", "eat"] },
      { text: "Wear Jerseys", points: 16, aliases: ["jersey", "team gear", "matching jerseys"] },
      { text: "Fantasy Football", points: 12, aliases: ["fantasy", "check fantasy", "set lineup"] },
      { text: "Argue", points: 8, aliases: ["fight", "trash talk", "debate"] },
    ]},
    { text: "Name an all-time NFL legend", answers: [
      { text: "Walter Payton", points: 36, aliases: ["payton", "sweetness"] },
      { text: "Jim Brown", points: 26, aliases: ["brown", "jim"] },
      { text: "Jerry Rice", points: 18, aliases: ["rice", "jerry"] },
      { text: "Tom Brady", points: 12, aliases: ["brady", "tb12"] },
      { text: "Johnny Unitas", points: 8, aliases: ["unitas", "johnny u", "johnny"] },
    ]},
    { text: "Name a valuable NFL Draft trade asset", answers: [
      { text: "First Round Pick", points: 42, aliases: ["first rounder", "1st round", "first round"] },
      { text: "Second Round Pick", points: 24, aliases: ["second rounder", "2nd round"] },
      { text: "Star Player", points: 16, aliases: ["franchise player", "player"] },
      { text: "Future Picks", points: 10, aliases: ["future first", "future draft picks"] },
      { text: "Third Round Pick", points: 8, aliases: ["third rounder", "3rd round"] },
    ]},
    { text: "Name a famous NFL pregame speech", answers: [
      { text: "Any Given Sunday", points: 38, aliases: ["al pacino", "inches speech"] },
      { text: "Win for the Gipper", points: 24, aliases: ["gipper", "knute rockne"] },
      { text: "Ray Lewis Dance", points: 18, aliases: ["ray lewis", "squirrel dance"] },
      { text: "Remember the Titans", points: 12, aliases: ["titans speech", "denzel"] },
      { text: "Mic'd Up", points: 8, aliases: ["micd up", "mic'd up moments"] },
    ]},
    { text: "Name a controversial catch ruling", answers: [
      { text: "Dez Caught It", points: 40, aliases: ["dez", "dez bryant", "dallas catch"] },
      { text: "Calvin Johnson Rule", points: 24, aliases: ["megatron", "calvin johnson"] },
      { text: "Jesse James", points: 16, aliases: ["steelers catch", "james catch"] },
      { text: "Tuck Rule", points: 12, aliases: ["brady fumble", "tuck rule game"] },
      { text: "Bert Emanuel", points: 8, aliases: ["emanuel", "bucs"] },
    ]},
  ],

  // Day 29
  [
    { text: "Name a reason a player goes on Injured Reserve", answers: [
      { text: "ACL Tear", points: 40, aliases: ["acl", "torn acl", "knee injury"] },
      { text: "Broken Bone", points: 24, aliases: ["fracture", "broken leg", "broken arm"] },
      { text: "Concussion", points: 16, aliases: ["head injury", "multiple concussions"] },
      { text: "Achilles", points: 12, aliases: ["achilles tear", "torn achilles"] },
      { text: "Shoulder Surgery", points: 8, aliases: ["shoulder", "torn labrum", "labrum"] },
    ]},
    { text: "Name a famous NFL prediction that was wrong", answers: [
      { text: "0-16 Lions", points: 36, aliases: ["2008 lions", "lions winless", "detroit 0-16"] },
      { text: "Brady Bust", points: 26, aliases: ["tom brady bust", "6th round bust"] },
      { text: "Mahomes Bust", points: 18, aliases: ["mahomes cant play", "mahomes wont work"] },
      { text: "Jets Back", points: 12, aliases: ["jets contender", "jets playoff"] },
      { text: "Browns Year", points: 8, aliases: ["this is the year", "browns playoff"] },
    ]},
    { text: "Name a type of first play in a game", answers: [
      { text: "Run Play", points: 38, aliases: ["run", "handoff", "rush"] },
      { text: "Short Pass", points: 26, aliases: ["short throw", "quick pass", "screen"] },
      { text: "Play Action", points: 18, aliases: ["play action pass", "pa"] },
      { text: "Deep Ball", points: 10, aliases: ["deep pass", "bomb", "long pass"] },
      { text: "Trick Play", points: 8, aliases: ["trick", "flea flicker", "reverse"] },
    ]},
    { text: "Name something you read from body language", answers: [
      { text: "Frustration", points: 38, aliases: ["frustrated", "angry", "mad"] },
      { text: "Confidence", points: 24, aliases: ["swagger", "confident"] },
      { text: "Fatigue", points: 18, aliases: ["tired", "exhausted", "gassed"] },
      { text: "Pain", points: 12, aliases: ["hurt", "limping", "injured"] },
      { text: "Quitting", points: 8, aliases: ["gave up", "checked out", "done"] },
    ]},
    { text: "Name a tough position over the middle", answers: [
      { text: "Wide Receiver", points: 38, aliases: ["wr", "receiver", "slot receiver"] },
      { text: "Tight End", points: 26, aliases: ["te"] },
      { text: "Linebacker", points: 18, aliases: ["lb", "mike linebacker", "middle linebacker"] },
      { text: "Safety", points: 12, aliases: ["s", "strong safety", "ss"] },
      { text: "Running Back", points: 6, aliases: ["rb", "halfback"] },
    ]},
  ],

  // Day 30
  [
    { text: "Name a famous NFL goal line stand", answers: [
      { text: "Super Bowl XXXIV", points: 38, aliases: ["rams titans", "one yard short", "1999 super bowl"] },
      { text: "Super Bowl XLIX", points: 26, aliases: ["butler interception", "seahawks patriots"] },
      { text: "Super Bowl XVI", points: 16, aliases: ["49ers bengals", "goal line stand"] },
      { text: "2014 NFC Championship", points: 12, aliases: ["seahawks 49ers", "tip play"] },
      { text: "Beastquake", points: 8, aliases: ["marshawn lynch", "beast mode"] },
    ]},
    { text: "Name an NFL color rush uniform fans love", answers: [
      { text: "Seahawks", points: 36, aliases: ["seattle", "green seahawks"] },
      { text: "Bills", points: 26, aliases: ["buffalo", "red bills"] },
      { text: "Panthers", points: 18, aliases: ["carolina", "blue panthers"] },
      { text: "Rams", points: 12, aliases: ["la rams", "yellow rams"] },
      { text: "Chargers", points: 8, aliases: ["la chargers", "powder blue"] },
    ]},
    { text: "Name a famous NFL night game type", answers: [
      { text: "Super Bowl", points: 40, aliases: ["superbowl", "the super bowl"] },
      { text: "Monday Night Football", points: 24, aliases: ["mnf", "monday night"] },
      { text: "Sunday Night Football", points: 18, aliases: ["snf", "sunday night"] },
      { text: "Thursday Night Football", points: 12, aliases: ["tnf", "thursday night"] },
      { text: "Playoff Game", points: 6, aliases: ["playoffs", "wild card", "divisional"] },
    ]},
    { text: "Name a famous NFL team nickname", answers: [
      { text: "America's Team", points: 38, aliases: ["americas team", "cowboys"] },
      { text: "Steel Curtain", points: 26, aliases: ["steelers", "pittsburgh"] },
      { text: "Purple People Eaters", points: 16, aliases: ["vikings", "purple people"] },
      { text: "Monsters of the Midway", points: 12, aliases: ["bears", "chicago"] },
      { text: "Legion of Boom", points: 8, aliases: ["seahawks", "seattle"] },
    ]},
    { text: "Name a position that touches the ball every play", answers: [
      { text: "Quarterback", points: 42, aliases: ["qb"] },
      { text: "Center", points: 28, aliases: ["c"] },
      { text: "Running Back", points: 14, aliases: ["rb", "halfback", "hb"] },
      { text: "Holder", points: 10, aliases: [] },
      { text: "Long Snapper", points: 6, aliases: ["snapper", "ls"] },
    ]},
  ],
]

// ── MLB Questions (30 days) ──
const MLB_DAYS: Question[][] = [
  // Day 1
  [
    { text: "Name a pitch type in baseball", answers: [
      { text: "Fastball", points: 38, aliases: ["fast ball", "heater", "fb", "four seam", "4 seam"] },
      { text: "Curveball", points: 26, aliases: ["curve", "curve ball", "yakker", "12-6"] },
      { text: "Slider", points: 18, aliases: ["slide piece", "slurve"] },
      { text: "Changeup", points: 12, aliases: ["change up", "change", "offspeed"] },
      { text: "Knuckleball", points: 6, aliases: ["knuckle ball", "knuckler"] },
    ]},
    { text: "Name a position on a baseball field", answers: [
      { text: "Pitcher", points: 36, aliases: ["p", "pitching"] },
      { text: "Shortstop", points: 26, aliases: ["ss", "short stop", "short"] },
      { text: "Catcher", points: 20, aliases: ["c", "backstop"] },
      { text: "First Base", points: 12, aliases: ["1b", "first baseman", "first"] },
      { text: "Center Field", points: 6, aliases: ["cf", "centerfield", "center fielder"] },
    ]},
    { text: "Name a famous MLB ballpark", answers: [
      { text: "Fenway Park", points: 40, aliases: ["fenway", "the fens"] },
      { text: "Wrigley Field", points: 28, aliases: ["wrigley", "the friendly confines"] },
      { text: "Yankee Stadium", points: 18, aliases: ["yankee", "the bronx"] },
      { text: "Dodger Stadium", points: 8, aliases: ["dodger", "chavez ravine"] },
      { text: "Camden Yards", points: 6, aliases: ["camden", "oriole park"] },
    ]},
    { text: "Name a food you buy at a baseball game", answers: [
      { text: "Hot Dog", points: 42, aliases: ["hotdog", "dog", "frank", "frankfurter"] },
      { text: "Nachos", points: 24, aliases: ["nacho", "chips and cheese"] },
      { text: "Peanuts", points: 18, aliases: ["peanut", "nuts"] },
      { text: "Cracker Jack", points: 10, aliases: ["cracker jacks", "crackerjack"] },
      { text: "Beer", points: 6, aliases: ["beers", "brew", "cold one"] },
    ]},
    { text: "Name an MLB team from New York", answers: [
      { text: "Yankees", points: 44, aliases: ["new york yankees", "nyy", "bronx bombers", "yanks"] },
      { text: "Mets", points: 32, aliases: ["new york mets", "nym", "amazins"] },
      { text: "Brooklyn Dodgers", points: 14, aliases: ["dodgers", "brooklyn"] },
      { text: "New York Giants", points: 6, aliases: ["giants", "ny giants baseball"] },
      { text: "Buffalo Bisons", points: 4, aliases: ["bisons", "buffalo"] },
    ]},
  ],
  // Day 2
  [
    { text: "Name a baseball stat every fan knows", answers: [
      { text: "Batting Average", points: 38, aliases: ["avg", "ba", "average"] },
      { text: "Home Runs", points: 28, aliases: ["hr", "homers", "dingers"] },
      { text: "ERA", points: 18, aliases: ["earned run average"] },
      { text: "RBI", points: 10, aliases: ["runs batted in", "rbis", "ribbies"] },
      { text: "Strikeouts", points: 6, aliases: ["k", "ks", "so", "whiffs"] },
    ]},
    { text: "Name something a batter wears", answers: [
      { text: "Helmet", points: 40, aliases: ["batting helmet", "hard hat"] },
      { text: "Gloves", points: 26, aliases: ["batting gloves", "glove"] },
      { text: "Cleats", points: 18, aliases: ["spikes", "shoes"] },
      { text: "Elbow Guard", points: 10, aliases: ["elbow pad", "arm guard", "arm pad"] },
      { text: "Eye Black", points: 6, aliases: ["eyeblack", "face paint"] },
    ]},
    { text: "Name an MLB team with an animal nickname", answers: [
      { text: "Cardinals", points: 36, aliases: ["st louis cardinals", "cards", "stl"] },
      { text: "Blue Jays", points: 26, aliases: ["toronto blue jays", "jays", "tor"] },
      { text: "Orioles", points: 18, aliases: ["baltimore orioles", "os", "birds"] },
      { text: "Cubs", points: 12, aliases: ["chicago cubs", "cubbies"] },
      { text: "Marlins", points: 8, aliases: ["miami marlins", "fish"] },
    ]},
    { text: "Name a way a runner can reach base", answers: [
      { text: "Hit", points: 38, aliases: ["single", "base hit", "getting a hit"] },
      { text: "Walk", points: 28, aliases: ["base on balls", "bb", "free pass"] },
      { text: "Error", points: 18, aliases: ["fielding error", "e"] },
      { text: "Hit By Pitch", points: 10, aliases: ["hbp", "plunked", "beaned"] },
      { text: "Dropped Third Strike", points: 6, aliases: ["dropped strike 3", "passed ball k"] },
    ]},
    { text: "Name a famous MLB manager", answers: [
      { text: "Joe Torre", points: 36, aliases: ["torre"] },
      { text: "Tony La Russa", points: 26, aliases: ["la russa", "larussa"] },
      { text: "Bobby Cox", points: 18, aliases: ["cox"] },
      { text: "Tommy Lasorda", points: 12, aliases: ["lasorda"] },
      { text: "Dusty Baker", points: 8, aliases: ["baker", "dusty"] },
    ]},
  ],
  // Day 3
  [
    { text: "Name an MLB team from California", answers: [
      { text: "Dodgers", points: 38, aliases: ["los angeles dodgers", "la dodgers", "lad"] },
      { text: "Giants", points: 24, aliases: ["san francisco giants", "sf giants", "sf"] },
      { text: "Angels", points: 18, aliases: ["los angeles angels", "la angels", "laa", "anaheim"] },
      { text: "Padres", points: 12, aliases: ["san diego padres", "sd", "friars"] },
      { text: "Athletics", points: 8, aliases: ["oakland athletics", "oakland as", "as", "a's"] },
    ]},
    { text: "Name something that happens after a World Series win", answers: [
      { text: "Trophy Ceremony", points: 36, aliases: ["trophy", "commissioners trophy", "celebration"] },
      { text: "Champagne", points: 26, aliases: ["champagne spray", "bubbly", "champagne celebration"] },
      { text: "MVP Award", points: 18, aliases: ["mvp", "series mvp", "world series mvp"] },
      { text: "Parade", points: 12, aliases: ["victory parade", "championship parade"] },
      { text: "Dog Pile", points: 8, aliases: ["dogpile", "pile on", "mound pile"] },
    ]},
    { text: "Name a type of hit in baseball", answers: [
      { text: "Home Run", points: 40, aliases: ["homer", "hr", "dinger", "bomb", "jack"] },
      { text: "Single", points: 26, aliases: ["base hit"] },
      { text: "Double", points: 18, aliases: ["two bagger", "2b"] },
      { text: "Triple", points: 10, aliases: ["three bagger", "3b"] },
      { text: "Bunt", points: 6, aliases: ["bunt hit", "bunt single", "drag bunt"] },
    ]},
    { text: "Name a famous baseball rivalry", answers: [
      { text: "Yankees-Red Sox", points: 42, aliases: ["yankees red sox", "nyy bos", "sox yanks"] },
      { text: "Dodgers-Giants", points: 26, aliases: ["dodgers giants", "la sf"] },
      { text: "Cubs-Cardinals", points: 18, aliases: ["cubs cardinals", "cubs cards"] },
      { text: "Mets-Yankees", points: 8, aliases: ["subway series", "mets yanks"] },
      { text: "Braves-Phillies", points: 6, aliases: ["braves phillies", "atl phi"] },
    ]},
    { text: "Name something an umpire does", answers: [
      { text: "Calls Strikes", points: 38, aliases: ["strike call", "strike three", "calls balls and strikes"] },
      { text: "Ejects Players", points: 24, aliases: ["ejection", "tosses players", "throws out"] },
      { text: "Signals Safe", points: 18, aliases: ["safe call", "calls safe"] },
      { text: "Reviews Plays", points: 12, aliases: ["replay review", "video review", "checks replay"] },
      { text: "Brushes Plate", points: 8, aliases: ["cleans plate", "dusts plate", "sweeps plate"] },
    ]},
  ],
  // Day 4
  [
    { text: "Name a baseball award given each season", answers: [
      { text: "MVP", points: 40, aliases: ["most valuable player", "mvp award"] },
      { text: "Cy Young", points: 28, aliases: ["cy young award", "cy"] },
      { text: "Gold Glove", points: 16, aliases: ["gold glove award", "golden glove"] },
      { text: "Rookie of the Year", points: 10, aliases: ["roy", "rookie award"] },
      { text: "Silver Slugger", points: 6, aliases: ["silver slugger award"] },
    ]},
    { text: "Name something a pitcher does on the mound", answers: [
      { text: "Throws Pitches", points: 38, aliases: ["pitches", "throws", "delivers"] },
      { text: "Rubs Ball", points: 24, aliases: ["rubs the ball", "grips ball", "rubbing ball"] },
      { text: "Shakes Off Signs", points: 18, aliases: ["shakes off", "shakes head", "waves off"] },
      { text: "Adjusts Cap", points: 12, aliases: ["fixes hat", "touches hat", "tips cap"] },
      { text: "Uses Rosin Bag", points: 8, aliases: ["rosin", "rosin bag", "chalk bag"] },
    ]},
    { text: "Name a country that produces great MLB players", answers: [
      { text: "Dominican Republic", points: 40, aliases: ["dr", "dominican", "dominicana"] },
      { text: "Venezuela", points: 24, aliases: ["venezuelan"] },
      { text: "Cuba", points: 18, aliases: ["cuban"] },
      { text: "Japan", points: 12, aliases: ["japanese", "nippon"] },
      { text: "Puerto Rico", points: 6, aliases: ["pr", "puerto rican"] },
    ]},
    { text: "Name something found on a baseball diamond", answers: [
      { text: "Bases", points: 38, aliases: ["base", "first base", "the bags"] },
      { text: "Pitcher's Mound", points: 26, aliases: ["mound", "the hill", "the rubber"] },
      { text: "Home Plate", points: 18, aliases: ["plate", "home", "the dish"] },
      { text: "Foul Poles", points: 10, aliases: ["foul pole", "fair pole"] },
      { text: "On-Deck Circle", points: 8, aliases: ["on deck", "on deck circle", "ondeck"] },
    ]},
    { text: "Name a famous left-handed pitcher", answers: [
      { text: "Sandy Koufax", points: 38, aliases: ["koufax"] },
      { text: "Randy Johnson", points: 26, aliases: ["johnson", "big unit", "the big unit"] },
      { text: "Clayton Kershaw", points: 18, aliases: ["kershaw"] },
      { text: "CC Sabathia", points: 10, aliases: ["sabathia", "cc"] },
      { text: "Whitey Ford", points: 8, aliases: ["ford", "whitey"] },
    ]},
  ],
  // Day 5
  [
    { text: "Name a Statcast metric fans talk about", answers: [
      { text: "Exit Velocity", points: 38, aliases: ["exit velo", "ev", "barrel speed"] },
      { text: "Spin Rate", points: 26, aliases: ["rpm", "spin"] },
      { text: "Launch Angle", points: 18, aliases: ["launch", "la"] },
      { text: "Sprint Speed", points: 12, aliases: ["speed", "baserunning speed"] },
      { text: "Barrel Rate", points: 6, aliases: ["barrel pct", "barrels", "barrel percentage"] },
    ]},
    { text: "Name an exciting play in baseball", answers: [
      { text: "Home Run", points: 38, aliases: ["homer", "hr", "dinger", "bomb"] },
      { text: "Steal of Home", points: 24, aliases: ["stealing home", "home steal"] },
      { text: "Triple Play", points: 18, aliases: ["triple play", "tp"] },
      { text: "Diving Catch", points: 12, aliases: ["diving grab", "robbery", "web gem"] },
      { text: "Inside the Park HR", points: 8, aliases: ["inside the park", "inside the park home run"] },
    ]},
    { text: "Name something fans wear to a baseball game", answers: [
      { text: "Team Jersey", points: 40, aliases: ["jersey", "uniform", "team shirt"] },
      { text: "Baseball Cap", points: 28, aliases: ["cap", "hat", "team hat"] },
      { text: "Rally Cap", points: 16, aliases: ["rally hat", "inside out hat"] },
      { text: "Face Paint", points: 10, aliases: ["face painting", "painted face"] },
      { text: "Foam Finger", points: 6, aliases: ["number one finger", "#1 finger"] },
    ]},
    { text: "Name a famous MLB closer", answers: [
      { text: "Mariano Rivera", points: 42, aliases: ["rivera", "mo", "the sandman"] },
      { text: "Trevor Hoffman", points: 24, aliases: ["hoffman"] },
      { text: "Dennis Eckersley", points: 16, aliases: ["eckersley", "eck"] },
      { text: "Kenley Jansen", points: 10, aliases: ["jansen"] },
      { text: "Craig Kimbrel", points: 8, aliases: ["kimbrel"] },
    ]},
    { text: "Name something that can delay a baseball game", answers: [
      { text: "Rain", points: 42, aliases: ["rain delay", "weather", "storm"] },
      { text: "Replay Review", points: 24, aliases: ["video review", "challenge", "replay"] },
      { text: "Injury", points: 16, aliases: ["player injury", "hurt player"] },
      { text: "Fight", points: 10, aliases: ["brawl", "bench clearing", "bench clearing brawl"] },
      { text: "Pitch Clock Violation", points: 8, aliases: ["clock violation", "pitch clock"] },
    ]},
  ],
  // Day 6
  [
    { text: "Name a song played at baseball games", answers: [
      { text: "Take Me Out", points: 40, aliases: ["take me out to the ball game", "ball game song"] },
      { text: "Sweet Caroline", points: 26, aliases: ["sweet caroline neil diamond", "neil diamond"] },
      { text: "Centerfield", points: 16, aliases: ["centerfield fogerty", "john fogerty"] },
      { text: "God Bless America", points: 12, aliases: ["god bless"] },
      { text: "Enter Sandman", points: 6, aliases: ["sandman", "metallica"] },
    ]},
    { text: "Name an MLB team in the AL East", answers: [
      { text: "Yankees", points: 38, aliases: ["new york yankees", "nyy", "yanks"] },
      { text: "Red Sox", points: 28, aliases: ["boston red sox", "boston", "bos", "sox"] },
      { text: "Blue Jays", points: 16, aliases: ["toronto blue jays", "toronto", "jays", "tor"] },
      { text: "Orioles", points: 10, aliases: ["baltimore orioles", "baltimore", "os", "bal"] },
      { text: "Rays", points: 8, aliases: ["tampa bay rays", "tampa bay", "tampa", "tb"] },
    ]},
    { text: "Name something a base coach signals", answers: [
      { text: "Stop", points: 36, aliases: ["hold", "hold up", "stay"] },
      { text: "Go", points: 28, aliases: ["run", "keep going", "send him"] },
      { text: "Slide", points: 18, aliases: ["get down", "hit the dirt"] },
      { text: "Steal", points: 12, aliases: ["go on next pitch", "steal sign", "green light"] },
      { text: "Tag Up", points: 6, aliases: ["tag", "go back"] },
    ]},
    { text: "Name a baseball term for a strikeout", answers: [
      { text: "K", points: 40, aliases: ["strikeout", "punch out"] },
      { text: "Whiff", points: 26, aliases: ["swing and miss"] },
      { text: "Punchout", points: 16, aliases: ["punch out", "rung up"] },
      { text: "Backwards K", points: 12, aliases: ["called strike three", "called third strike", "looking"] },
      { text: "Golden Sombrero", points: 6, aliases: ["sombrero", "four strikeouts"] },
    ]},
    { text: "Name an MLB team in Texas", answers: [
      { text: "Rangers", points: 44, aliases: ["texas rangers", "tex", "arlington"] },
      { text: "Astros", points: 36, aliases: ["houston astros", "houston", "hou", "stros"] },
      { text: "Express", points: 10, aliases: ["round rock express", "round rock"] },
      { text: "Missions", points: 6, aliases: ["san antonio missions", "san antonio"] },
      { text: "Space Cowboys", points: 4, aliases: ["sugar land space cowboys", "sugar land"] },
    ]},
  ],
  // Day 7
  [
    { text: "Name something a catcher wears", answers: [
      { text: "Mask", points: 38, aliases: ["face mask", "catchers mask", "helmet"] },
      { text: "Chest Protector", points: 26, aliases: ["chest pad", "body armor"] },
      { text: "Shin Guards", points: 18, aliases: ["leg guards", "leg pads", "shin pads"] },
      { text: "Mitt", points: 12, aliases: ["glove", "catchers mitt"] },
      { text: "Cup", points: 6, aliases: ["protective cup", "jock", "athletic cup"] },
    ]},
    { text: "Name a famous home run record holder", answers: [
      { text: "Barry Bonds", points: 38, aliases: ["bonds", "barry"] },
      { text: "Hank Aaron", points: 28, aliases: ["aaron", "hammerin hank", "hammer"] },
      { text: "Babe Ruth", points: 18, aliases: ["ruth", "the babe", "bambino", "sultan of swat"] },
      { text: "Mark McGwire", points: 10, aliases: ["mcgwire", "big mac"] },
      { text: "Sammy Sosa", points: 6, aliases: ["sosa", "sammy"] },
    ]},
    { text: "Name a reason a game goes to extra innings", answers: [
      { text: "Tied Score", points: 44, aliases: ["tie", "tied", "tie game", "even score"] },
      { text: "Late Comeback", points: 24, aliases: ["rally", "comeback", "late rally"] },
      { text: "Blown Save", points: 16, aliases: ["closer blew it", "bullpen collapse"] },
      { text: "Tying Homer", points: 10, aliases: ["tying home run", "solo homer"] },
      { text: "Wild Pitch", points: 6, aliases: ["passed ball", "error"] },
    ]},
    { text: "Name something fans yell at an umpire", answers: [
      { text: "You're Blind", points: 40, aliases: ["are you blind", "blind", "open your eyes"] },
      { text: "Get Glasses", points: 24, aliases: ["get some glasses", "need glasses", "glasses"] },
      { text: "That Was a Ball", points: 18, aliases: ["ball", "thats a ball", "off the plate"] },
      { text: "You're Terrible", points: 12, aliases: ["terrible", "you stink", "you suck"] },
      { text: "Blue", points: 6, aliases: ["hey blue", "come on blue"] },
    ]},
    { text: "Name an MLB team with a color in its name", answers: [
      { text: "Red Sox", points: 38, aliases: ["boston red sox", "boston", "sox"] },
      { text: "White Sox", points: 26, aliases: ["chicago white sox", "chisox", "pale hose"] },
      { text: "Reds", points: 18, aliases: ["cincinnati reds", "cincy", "big red machine"] },
      { text: "Blue Jays", points: 12, aliases: ["toronto blue jays", "jays"] },
      { text: "Cardinals", points: 6, aliases: ["st louis cardinals", "cards", "redbirds"] },
    ]},
  ],
  // Day 8
  [
    { text: "Name something a pitcher checks before throwing", answers: [
      { text: "Runners", points: 38, aliases: ["base runners", "runner on base", "check runners"] },
      { text: "Catcher's Sign", points: 26, aliases: ["sign", "signs", "signals", "the sign"] },
      { text: "Grip", points: 18, aliases: ["ball grip", "finger placement"] },
      { text: "Count", points: 12, aliases: ["pitch count", "balls and strikes"] },
      { text: "Defense", points: 6, aliases: ["fielders", "positioning", "alignment"] },
    ]},
    { text: "Name a famous World Series moment", answers: [
      { text: "Kirk Gibson Homer", points: 36, aliases: ["gibson", "gibson home run", "88 world series"] },
      { text: "Buckner Error", points: 26, aliases: ["buckner", "through the legs", "86 mets", "bill buckner"] },
      { text: "Cubs Win 2016", points: 18, aliases: ["cubs world series", "cubs 2016", "108 years"] },
      { text: "Joe Carter Walk-Off", points: 12, aliases: ["carter", "touch em all", "93 blue jays"] },
      { text: "Mazeroski Homer", points: 8, aliases: ["mazeroski", "maz", "1960 pirates"] },
    ]},
    { text: "Name a type of baseball glove", answers: [
      { text: "Outfield Glove", points: 36, aliases: ["outfielder glove", "outfield", "of glove"] },
      { text: "Catcher's Mitt", points: 28, aliases: ["catchers mitt", "mitt"] },
      { text: "Infield Glove", points: 18, aliases: ["infielder glove", "infield", "if glove"] },
      { text: "First Base Mitt", points: 12, aliases: ["first baseman mitt", "1b mitt"] },
      { text: "Pitcher's Glove", points: 6, aliases: ["pitching glove", "pitcher glove"] },
    ]},
    { text: "Name something unique about baseball vs other sports", answers: [
      { text: "No Clock", points: 42, aliases: ["no time limit", "no timer", "untimed"] },
      { text: "Different Parks", points: 24, aliases: ["different stadiums", "unique dimensions", "different fields"] },
      { text: "162 Games", points: 18, aliases: ["long season", "162 game season"] },
      { text: "Defense Has Ball", points: 10, aliases: ["defense controls ball", "fielding team has ball"] },
      { text: "Seventh Inning Stretch", points: 6, aliases: ["7th inning stretch", "stretch"] },
    ]},
    { text: "Name an MLB team in the NL West", answers: [
      { text: "Dodgers", points: 40, aliases: ["los angeles dodgers", "la dodgers", "lad"] },
      { text: "Padres", points: 24, aliases: ["san diego padres", "san diego", "sd"] },
      { text: "Giants", points: 18, aliases: ["san francisco giants", "sf giants", "sf"] },
      { text: "Diamondbacks", points: 10, aliases: ["arizona diamondbacks", "dbacks", "ari", "snakes"] },
      { text: "Rockies", points: 8, aliases: ["colorado rockies", "colorado", "col"] },
    ]},
  ],
  // Day 9
  [
    { text: "Name a famous switch hitter", answers: [
      { text: "Mickey Mantle", points: 40, aliases: ["mantle", "the mick"] },
      { text: "Pete Rose", points: 26, aliases: ["rose", "charlie hustle"] },
      { text: "Chipper Jones", points: 16, aliases: ["chipper", "jones", "larry jones"] },
      { text: "Eddie Murray", points: 10, aliases: ["murray", "steady eddie"] },
      { text: "Bernie Williams", points: 8, aliases: ["bernie", "williams"] },
    ]},
    { text: "Name a way a pitcher can balk", answers: [
      { text: "Fake Throw", points: 38, aliases: ["fake to first", "deceptive move", "faking"] },
      { text: "Not Stopping", points: 26, aliases: ["no pause", "quick pitch", "no stop"] },
      { text: "Dropping Ball", points: 18, aliases: ["drops ball", "ball falls", "drop"] },
      { text: "Wrong Foot", points: 12, aliases: ["foot off rubber", "steps wrong"] },
      { text: "Double Set", points: 6, aliases: ["starts twice", "two motions", "hitch"] },
    ]},
    { text: "Name a Hall of Fame outfielder", answers: [
      { text: "Willie Mays", points: 38, aliases: ["mays", "say hey kid", "the say hey kid"] },
      { text: "Ted Williams", points: 24, aliases: ["williams", "teddy ballgame", "splendid splinter"] },
      { text: "Ken Griffey Jr", points: 18, aliases: ["griffey", "junior", "the kid", "griffey jr"] },
      { text: "Roberto Clemente", points: 12, aliases: ["clemente"] },
      { text: "Hank Aaron", points: 8, aliases: ["aaron", "hammerin hank", "hammer"] },
    ]},
    { text: "Name something fans do during the seventh-inning stretch", answers: [
      { text: "Sing", points: 42, aliases: ["sing along", "take me out", "take me out to the ball game"] },
      { text: "Stand Up", points: 26, aliases: ["stretch", "get up", "stand"] },
      { text: "Get Food", points: 16, aliases: ["concessions", "buy food", "snacks"] },
      { text: "Bathroom", points: 10, aliases: ["restroom", "use bathroom", "go to bathroom"] },
      { text: "Buy Beer", points: 6, aliases: ["get a beer", "beer run", "drinks"] },
    ]},
    { text: "Name a famous retired jersey number in baseball", answers: [
      { text: "42", points: 40, aliases: ["jackie robinson", "robinson"] },
      { text: "3", points: 24, aliases: ["babe ruth", "ruth"] },
      { text: "24", points: 16, aliases: ["willie mays", "griffey"] },
      { text: "21", points: 12, aliases: ["clemente", "roberto clemente"] },
      { text: "7", points: 8, aliases: ["mantle", "mickey mantle"] },
    ]},
  ],
  // Day 10
  [
    { text: "Name a reason a pitcher gets ejected", answers: [
      { text: "Throwing At Batter", points: 40, aliases: ["hitting batter", "headhunting", "intentional hbp", "beaning"] },
      { text: "Arguing Calls", points: 26, aliases: ["arguing with ump", "yelling at umpire", "arguing"] },
      { text: "Foreign Substance", points: 16, aliases: ["sticky stuff", "pine tar", "spider tack"] },
      { text: "Fighting", points: 10, aliases: ["brawl", "bench clearing", "throwing punches"] },
      { text: "Profanity", points: 8, aliases: ["cursing", "swearing", "language"] },
    ]},
    { text: "Name a baseball slang term for a home run", answers: [
      { text: "Dinger", points: 36, aliases: ["ding", "dingers"] },
      { text: "Bomb", points: 26, aliases: ["moonshot", "blast"] },
      { text: "Jack", points: 18, aliases: ["jacked", "going yard"] },
      { text: "Tater", points: 12, aliases: ["tater tot", "long ball"] },
      { text: "Big Fly", points: 8, aliases: ["fly", "deep fly"] },
    ]},
    { text: "Name an MLB team in the NL Central", answers: [
      { text: "Cardinals", points: 36, aliases: ["st louis cardinals", "stl", "cards"] },
      { text: "Cubs", points: 28, aliases: ["chicago cubs", "cubbies", "chc"] },
      { text: "Brewers", points: 18, aliases: ["milwaukee brewers", "milwaukee", "mil", "brew crew"] },
      { text: "Reds", points: 10, aliases: ["cincinnati reds", "cincy", "cin"] },
      { text: "Pirates", points: 8, aliases: ["pittsburgh pirates", "pittsburgh", "pit", "buccos"] },
    ]},
    { text: "Name a unique ballpark feature", answers: [
      { text: "Green Monster", points: 38, aliases: ["the wall", "monster", "fenway wall"] },
      { text: "Ivy Walls", points: 24, aliases: ["wrigley ivy", "ivy", "outfield ivy"] },
      { text: "Swimming Pool", points: 18, aliases: ["pool", "chase field pool", "arizona pool"] },
      { text: "Train", points: 12, aliases: ["houston train", "minute maid train"] },
      { text: "Hill", points: 8, aliases: ["tals hill", "center field hill"] },
    ]},
    { text: "Name a type of double play", answers: [
      { text: "6-4-3", points: 40, aliases: ["shortstop to second to first", "ss 2b 1b"] },
      { text: "4-6-3", points: 26, aliases: ["second to short to first", "2b ss 1b"] },
      { text: "5-4-3", points: 16, aliases: ["third to second to first", "3b 2b 1b"] },
      { text: "1-6-3", points: 10, aliases: ["pitcher to short to first"] },
      { text: "Line Drive DP", points: 8, aliases: ["liner double play", "unassisted", "line out dp"] },
    ]},
  ],
  // Day 11
  [
    { text: "Name a baseball superstition", answers: [
      { text: "Don't Step on Line", points: 40, aliases: ["foul line", "avoid the line", "step over line"] },
      { text: "Rally Cap", points: 24, aliases: ["inside out hat", "rally hat"] },
      { text: "Same Routine", points: 18, aliases: ["same ritual", "pre game routine", "superstitious routine"] },
      { text: "Lucky Socks", points: 12, aliases: ["same socks", "lucky underwear", "same underwear"] },
      { text: "No No-Hitter Talk", points: 6, aliases: ["dont mention it", "jinx", "dont say no hitter"] },
    ]},
    { text: "Name a famous MLB franchise", answers: [
      { text: "Yankees", points: 42, aliases: ["new york yankees", "nyy", "bronx bombers"] },
      { text: "Dodgers", points: 26, aliases: ["los angeles dodgers", "la dodgers", "brooklyn dodgers"] },
      { text: "Red Sox", points: 16, aliases: ["boston red sox", "boston", "sox"] },
      { text: "Cardinals", points: 10, aliases: ["st louis cardinals", "stl", "cards"] },
      { text: "Giants", points: 6, aliases: ["san francisco giants", "sf", "new york giants"] },
    ]},
    { text: "Name something found in a dugout", answers: [
      { text: "Sunflower Seeds", points: 38, aliases: ["seeds", "sunflower", "spitting seeds"] },
      { text: "Bats", points: 26, aliases: ["bat rack", "baseball bats", "lumber"] },
      { text: "Gatorade", points: 18, aliases: ["water cooler", "drinks", "water"] },
      { text: "Helmets", points: 12, aliases: ["batting helmets", "helmet rack"] },
      { text: "Bubble Gum", points: 6, aliases: ["gum", "big league chew", "dubble bubble"] },
    ]},
    { text: "Name a baseball position group", answers: [
      { text: "Infield", points: 38, aliases: ["infielders", "if"] },
      { text: "Outfield", points: 28, aliases: ["outfielders", "of"] },
      { text: "Battery", points: 16, aliases: ["pitcher and catcher", "pitcher catcher"] },
      { text: "Bullpen", points: 12, aliases: ["relievers", "relief pitchers", "pen"] },
      { text: "Rotation", points: 6, aliases: ["starting rotation", "starters", "starting pitchers"] },
    ]},
    { text: "Name a famous baseball movie", answers: [
      { text: "Field of Dreams", points: 38, aliases: ["field", "if you build it"] },
      { text: "The Sandlot", points: 26, aliases: ["sandlot"] },
      { text: "A League of Their Own", points: 18, aliases: ["league of their own", "no crying in baseball"] },
      { text: "Major League", points: 12, aliases: ["wild thing"] },
      { text: "Moneyball", points: 6, aliases: ["money ball"] },
    ]},
  ],
  // Day 12
  [
    { text: "Name an advanced baseball stat", answers: [
      { text: "WAR", points: 38, aliases: ["wins above replacement"] },
      { text: "OPS", points: 26, aliases: ["on base plus slugging", "ops+"] },
      { text: "FIP", points: 16, aliases: ["fielding independent pitching"] },
      { text: "BABIP", points: 12, aliases: ["batting average balls in play"] },
      { text: "wRC+", points: 8, aliases: ["wrc plus", "weighted runs created"] },
    ]},
    { text: "Name a way to get an out in baseball", answers: [
      { text: "Strikeout", points: 38, aliases: ["k", "strike out", "punch out"] },
      { text: "Fly Out", points: 26, aliases: ["flyout", "pop up", "fly ball out"] },
      { text: "Ground Out", points: 18, aliases: ["groundout", "grounder"] },
      { text: "Tag Out", points: 10, aliases: ["tagged out", "tag"] },
      { text: "Force Out", points: 8, aliases: ["forceout", "force play"] },
    ]},
    { text: "Name a famous Fenway Park feature", answers: [
      { text: "Green Monster", points: 44, aliases: ["monster", "the wall", "left field wall"] },
      { text: "Pesky Pole", points: 22, aliases: ["pesky", "right field pole"] },
      { text: "Monster Seats", points: 16, aliases: ["green monster seats", "seats on monster"] },
      { text: "Citgo Sign", points: 10, aliases: ["citgo", "neon sign"] },
      { text: "Triangle", points: 8, aliases: ["center field triangle", "deep center"] },
    ]},
    { text: "Name an MLB team in the AL Central", answers: [
      { text: "Guardians", points: 36, aliases: ["cleveland guardians", "cleveland", "cle", "tribe"] },
      { text: "Twins", points: 26, aliases: ["minnesota twins", "minnesota", "min"] },
      { text: "White Sox", points: 18, aliases: ["chicago white sox", "chisox", "cws"] },
      { text: "Royals", points: 12, aliases: ["kansas city royals", "kc", "kansas city"] },
      { text: "Tigers", points: 8, aliases: ["detroit tigers", "detroit", "det"] },
    ]},
    { text: "Name something a batter does in the box", answers: [
      { text: "Swings", points: 40, aliases: ["swing", "takes a swing", "hacks"] },
      { text: "Taps Plate", points: 24, aliases: ["tap plate", "touches plate"] },
      { text: "Adjusts Gloves", points: 18, aliases: ["fixes gloves", "batting gloves", "velcro"] },
      { text: "Digs In", points: 10, aliases: ["digs hole", "plants feet"] },
      { text: "Calls Time", points: 8, aliases: ["time out", "steps out"] },
    ]},
  ],
  // Day 13
  [
    { text: "Name a baseball celebration", answers: [
      { text: "Bat Flip", points: 38, aliases: ["bat toss", "flipping bat"] },
      { text: "Dog Pile", points: 24, aliases: ["dogpile", "pile on", "mob"] },
      { text: "Gatorade Shower", points: 18, aliases: ["gatorade bath", "water dump", "cooler dump"] },
      { text: "Curtain Call", points: 12, aliases: ["tip cap", "wave to crowd"] },
      { text: "Fist Pump", points: 8, aliases: ["pumping fist", "arm pump"] },
    ]},
    { text: "Name a famous MLB catcher", answers: [
      { text: "Yogi Berra", points: 38, aliases: ["berra", "yogi"] },
      { text: "Johnny Bench", points: 26, aliases: ["bench"] },
      { text: "Mike Piazza", points: 18, aliases: ["piazza"] },
      { text: "Ivan Rodriguez", points: 10, aliases: ["pudge", "rodriguez", "i-rod"] },
      { text: "Carlton Fisk", points: 8, aliases: ["fisk", "pudge fisk"] },
    ]},
    { text: "Name a reason a manager gets ejected", answers: [
      { text: "Arguing Balls and Strikes", points: 42, aliases: ["arguing strike zone", "arguing calls"] },
      { text: "Defending Player", points: 24, aliases: ["protecting player", "sticking up"] },
      { text: "Kicking Dirt", points: 16, aliases: ["dirt on ump", "kicks dirt"] },
      { text: "Bad Language", points: 10, aliases: ["cursing", "profanity", "swearing"] },
      { text: "Throwing Base", points: 8, aliases: ["throws base", "tossing base", "throwing equipment"] },
    ]},
    { text: "Name a famous baseball nickname", answers: [
      { text: "The Bambino", points: 36, aliases: ["bambino", "babe ruth", "sultan of swat"] },
      { text: "The Kid", points: 26, aliases: ["kid", "griffey", "ken griffey"] },
      { text: "Big Papi", points: 18, aliases: ["papi", "david ortiz", "ortiz"] },
      { text: "Mr. October", points: 12, aliases: ["mr october", "reggie jackson", "jackson"] },
      { text: "The Say Hey Kid", points: 8, aliases: ["say hey kid", "willie mays", "mays"] },
    ]},
    { text: "Name an MLB team from the Midwest", answers: [
      { text: "Cubs", points: 36, aliases: ["chicago cubs", "cubbies", "chc"] },
      { text: "Cardinals", points: 26, aliases: ["st louis cardinals", "stl", "cards"] },
      { text: "Twins", points: 18, aliases: ["minnesota twins", "minnesota", "min"] },
      { text: "Royals", points: 12, aliases: ["kansas city royals", "kc", "kansas city"] },
      { text: "Brewers", points: 8, aliases: ["milwaukee brewers", "milwaukee", "mil"] },
    ]},
  ],
  // Day 14
  [
    { text: "Name a thing on a baseball scoreboard", answers: [
      { text: "Score", points: 40, aliases: ["runs", "the score", "run total"] },
      { text: "Inning", points: 24, aliases: ["innings", "inning number", "what inning"] },
      { text: "Outs", points: 18, aliases: ["out count", "number of outs"] },
      { text: "Pitch Count", points: 10, aliases: ["pitches", "pitch speed", "mph"] },
      { text: "Count", points: 8, aliases: ["balls and strikes", "ball strike count"] },
    ]},
    { text: "Name a famous MLB shortstop", answers: [
      { text: "Derek Jeter", points: 42, aliases: ["jeter", "dj", "the captain"] },
      { text: "Cal Ripken Jr", points: 24, aliases: ["ripken", "cal", "iron man"] },
      { text: "Alex Rodriguez", points: 16, aliases: ["a-rod", "arod", "rodriguez"] },
      { text: "Ozzie Smith", points: 10, aliases: ["ozzie", "the wizard", "wizard of oz"] },
      { text: "Ernie Banks", points: 8, aliases: ["banks", "mr cub", "mr. cub"] },
    ]},
    { text: "Name something that ends a no-hitter bid", answers: [
      { text: "Base Hit", points: 42, aliases: ["hit", "single", "clean hit"] },
      { text: "Bloop Single", points: 24, aliases: ["bloop", "blooper", "bloop hit"] },
      { text: "Infield Hit", points: 16, aliases: ["infield single", "chopper", "dribbler"] },
      { text: "Bunt Hit", points: 10, aliases: ["bunt single", "drag bunt"] },
      { text: "Home Run", points: 8, aliases: ["homer", "hr", "dinger"] },
    ]},
    { text: "Name a way a team celebrates clinching the playoffs", answers: [
      { text: "Champagne", points: 40, aliases: ["champagne spray", "champagne celebration", "bubbly"] },
      { text: "Dog Pile", points: 24, aliases: ["dogpile", "pile on", "mob on field"] },
      { text: "Goggles", points: 18, aliases: ["safety goggles", "ski goggles", "celebration goggles"] },
      { text: "Beer Shower", points: 10, aliases: ["beer spray", "beer", "spraying beer"] },
      { text: "T-Shirts", points: 8, aliases: ["championship shirts", "division champs shirt", "hats and shirts"] },
    ]},
    { text: "Name something a relief pitcher brings to the game", answers: [
      { text: "Fresh Arm", points: 38, aliases: ["rested arm", "new arm", "velocity"] },
      { text: "Entrance Song", points: 26, aliases: ["walk up song", "music", "theme song"] },
      { text: "Slider", points: 16, aliases: ["breaking ball", "nasty pitch", "out pitch"] },
      { text: "Energy", points: 12, aliases: ["intensity", "fire", "adrenaline"] },
      { text: "Nerves", points: 8, aliases: ["pressure", "anxiety", "butterflies"] },
    ]},
  ],
  // Day 15
  [
    { text: "Name a famous baseball quote or phrase", answers: [
      { text: "It Ain't Over", points: 38, aliases: ["it aint over til its over", "yogi berra", "not over"] },
      { text: "Say Hey", points: 24, aliases: ["say hey kid", "willie mays"] },
      { text: "No Crying", points: 18, aliases: ["no crying in baseball", "theres no crying"] },
      { text: "Play Ball", points: 12, aliases: ["lets play ball"] },
      { text: "Touch Em All", points: 8, aliases: ["touch them all", "touch em all joe"] },
    ]},
    { text: "Name a baseball penalty or violation", answers: [
      { text: "Balk", points: 38, aliases: ["baulk"] },
      { text: "Interference", points: 24, aliases: ["runner interference", "catcher interference"] },
      { text: "Clock Violation", points: 18, aliases: ["pitch clock", "pitch clock violation"] },
      { text: "Pine Tar", points: 12, aliases: ["foreign substance", "sticky stuff"] },
      { text: "Obstruction", points: 8, aliases: ["fielder obstruction"] },
    ]},
    { text: "Name a famous MLB first baseman", answers: [
      { text: "Lou Gehrig", points: 38, aliases: ["gehrig", "iron horse", "the iron horse"] },
      { text: "Albert Pujols", points: 26, aliases: ["pujols", "the machine"] },
      { text: "Freddie Freeman", points: 16, aliases: ["freeman", "freddie"] },
      { text: "Jeff Bagwell", points: 12, aliases: ["bagwell", "baggy"] },
      { text: "Eddie Murray", points: 8, aliases: ["murray", "steady eddie"] },
    ]},
    { text: "Name something that happens on Opening Day", answers: [
      { text: "First Pitch", points: 40, aliases: ["ceremonial first pitch", "throwing first pitch"] },
      { text: "Sellout Crowd", points: 24, aliases: ["packed stadium", "full house", "sold out"] },
      { text: "Introductions", points: 18, aliases: ["player intros", "lineup announced"] },
      { text: "National Anthem", points: 10, aliases: ["anthem", "star spangled banner"] },
      { text: "Flyover", points: 8, aliases: ["military flyover", "jet flyover", "planes"] },
    ]},
    { text: "Name an MLB team from Florida", answers: [
      { text: "Marlins", points: 40, aliases: ["miami marlins", "miami", "mia", "fish"] },
      { text: "Rays", points: 36, aliases: ["tampa bay rays", "tampa bay", "tampa", "tb"] },
      { text: "Grapefruit League", points: 12, aliases: ["spring training", "grapefruit"] },
      { text: "Dunedin Jays", points: 6, aliases: ["dunedin", "jays spring"] },
      { text: "Jupiter Hammerheads", points: 6, aliases: ["jupiter", "hammerheads"] },
    ]},
  ],
  // Day 16
  [
    { text: "Name a thing fans bring to a ballgame", answers: [
      { text: "Glove", points: 40, aliases: ["baseball glove", "mitt", "catching glove"] },
      { text: "Sign", points: 24, aliases: ["poster", "banner", "homemade sign"] },
      { text: "Sunscreen", points: 16, aliases: ["sunblock", "spf"] },
      { text: "Blanket", points: 12, aliases: ["towel", "rally towel"] },
      { text: "Scorebook", points: 8, aliases: ["scorecard", "pencil", "keeping score"] },
    ]},
    { text: "Name a famous MLB second baseman", answers: [
      { text: "Jackie Robinson", points: 40, aliases: ["robinson", "jackie", "42"] },
      { text: "Joe Morgan", points: 22, aliases: ["morgan"] },
      { text: "Roberto Alomar", points: 18, aliases: ["alomar", "robbie alomar"] },
      { text: "Rogers Hornsby", points: 12, aliases: ["hornsby"] },
      { text: "Craig Biggio", points: 8, aliases: ["biggio"] },
    ]},
    { text: "Name a type of relief pitcher", answers: [
      { text: "Closer", points: 42, aliases: ["close", "save guy", "ninth inning"] },
      { text: "Setup Man", points: 24, aliases: ["setup", "eighth inning", "8th inning guy"] },
      { text: "Long Reliever", points: 16, aliases: ["long man", "long relief"] },
      { text: "LOOGY", points: 10, aliases: ["lefty specialist", "left handed specialist"] },
      { text: "Opener", points: 8, aliases: ["opening pitcher", "bulk guy"] },
    ]},
    { text: "Name a baseball term for running", answers: [
      { text: "Stealing", points: 40, aliases: ["steal", "stolen base", "stealing base"] },
      { text: "Tagging Up", points: 24, aliases: ["tag up", "tagging"] },
      { text: "Hit and Run", points: 16, aliases: ["hit n run", "running on contact"] },
      { text: "Rounding Bases", points: 12, aliases: ["rounding", "touching bases"] },
      { text: "Caught Stealing", points: 8, aliases: ["cs", "thrown out", "picked off"] },
    ]},
    { text: "Name an MLB team from the Southeast", answers: [
      { text: "Braves", points: 40, aliases: ["atlanta braves", "atlanta", "atl"] },
      { text: "Nationals", points: 24, aliases: ["washington nationals", "washington", "nats", "wsh"] },
      { text: "Marlins", points: 18, aliases: ["miami marlins", "miami", "mia"] },
      { text: "Rays", points: 10, aliases: ["tampa bay rays", "tampa bay", "tb"] },
      { text: "Orioles", points: 8, aliases: ["baltimore orioles", "baltimore", "bal"] },
    ]},
  ],
  // Day 17
  [
    { text: "Name a modern baseball rule change", answers: [
      { text: "Pitch Clock", points: 40, aliases: ["timer", "pitch timer", "clock"] },
      { text: "Ghost Runner", points: 24, aliases: ["runner on second", "extra innings runner", "manfred runner"] },
      { text: "Shift Ban", points: 16, aliases: ["no shift", "banning shift", "infield positioning"] },
      { text: "Universal DH", points: 12, aliases: ["dh in both leagues", "designated hitter"] },
      { text: "Bigger Bases", points: 8, aliases: ["larger bases", "bigger bags"] },
    ]},
    { text: "Name a famous MLB third baseman", answers: [
      { text: "Mike Schmidt", points: 36, aliases: ["schmidt", "schmidty"] },
      { text: "Brooks Robinson", points: 24, aliases: ["brooks", "mr hoover", "human vacuum"] },
      { text: "Chipper Jones", points: 18, aliases: ["chipper", "jones", "larry"] },
      { text: "George Brett", points: 12, aliases: ["brett"] },
      { text: "Adrian Beltre", points: 10, aliases: ["beltre"] },
    ]},
    { text: "Name a way a baseball game can end", answers: [
      { text: "Walk-Off Homer", points: 38, aliases: ["walk off home run", "walkoff hr"] },
      { text: "Final Out", points: 26, aliases: ["last out", "third out", "27th out"] },
      { text: "Walk-Off Walk", points: 16, aliases: ["walkoff walk", "bases loaded walk"] },
      { text: "Walk-Off Hit", points: 12, aliases: ["walkoff single", "walk off hit"] },
      { text: "Mercy Rule", points: 8, aliases: ["run rule", "10 run rule"] },
    ]},
    { text: "Name something a pitcher puts on his hand", answers: [
      { text: "Rosin", points: 40, aliases: ["rosin bag", "rosin powder"] },
      { text: "Pine Tar", points: 26, aliases: ["tar", "sticky stuff"] },
      { text: "Dirt", points: 16, aliases: ["mound dirt", "rubbing dirt"] },
      { text: "Sunscreen", points: 10, aliases: ["sunblock", "spf"] },
      { text: "Sweat", points: 8, aliases: ["perspiration", "wiping sweat"] },
    ]},
    { text: "Name a famous MLB rivalry city", answers: [
      { text: "New York", points: 38, aliases: ["nyc", "ny", "bronx", "queens"] },
      { text: "Boston", points: 26, aliases: ["bos", "beantown"] },
      { text: "Chicago", points: 18, aliases: ["chi", "chi town", "windy city"] },
      { text: "Los Angeles", points: 10, aliases: ["la", "socal"] },
      { text: "St. Louis", points: 8, aliases: ["stl", "st louis", "saint louis"] },
    ]},
  ],
  // Day 18
  [
    { text: "Name a baseball training tool", answers: [
      { text: "Batting Cage", points: 40, aliases: ["cage", "bp cage", "batting cages"] },
      { text: "Pitching Machine", points: 26, aliases: ["machine", "jugs machine", "iron mike"] },
      { text: "Tee", points: 16, aliases: ["batting tee", "hitting tee"] },
      { text: "Weighted Bat", points: 10, aliases: ["donut", "bat weight", "bat donut"] },
      { text: "Radar Gun", points: 8, aliases: ["speed gun", "gun", "stalker gun"] },
    ]},
    { text: "Name an MLB team that moved cities", answers: [
      { text: "Dodgers", points: 38, aliases: ["brooklyn to la", "brooklyn dodgers", "la dodgers"] },
      { text: "Giants", points: 24, aliases: ["new york to sf", "ny giants", "sf giants"] },
      { text: "Braves", points: 16, aliases: ["boston to milwaukee to atlanta", "milwaukee braves"] },
      { text: "Athletics", points: 12, aliases: ["philly to kc to oakland", "oakland as", "as"] },
      { text: "Expos", points: 10, aliases: ["montreal to washington", "montreal expos", "nationals"] },
    ]},
    { text: "Name a famous stolen base king", answers: [
      { text: "Rickey Henderson", points: 42, aliases: ["rickey", "henderson", "man of steal"] },
      { text: "Lou Brock", points: 22, aliases: ["brock"] },
      { text: "Ty Cobb", points: 16, aliases: ["cobb", "georgia peach"] },
      { text: "Tim Raines", points: 12, aliases: ["raines", "rock"] },
      { text: "Vince Coleman", points: 8, aliases: ["coleman"] },
    ]},
    { text: "Name something fans throw on the field", answers: [
      { text: "Hats", points: 38, aliases: ["hat", "caps", "hat trick"] },
      { text: "Beach Ball", points: 24, aliases: ["beach balls", "ball"] },
      { text: "Home Run Ball", points: 18, aliases: ["opposing homer", "throw it back"] },
      { text: "Cups", points: 12, aliases: ["beer cups", "drinks", "trash"] },
      { text: "Octopus", points: 8, aliases: ["rally animal", "catfish", "fish"] },
    ]},
    { text: "Name a baseball umpire hand signal", answers: [
      { text: "Strike", points: 40, aliases: ["punch out", "ring up", "called strike"] },
      { text: "Safe", points: 26, aliases: ["safe sign", "arms out"] },
      { text: "Out", points: 16, aliases: ["out call", "fist pump out"] },
      { text: "Fair Ball", points: 10, aliases: ["fair", "points fair"] },
      { text: "Time", points: 8, aliases: ["time out", "dead ball", "hands up"] },
    ]},
  ],
  // Day 19
  [
    { text: "Name a famous MLB pitcher", answers: [
      { text: "Nolan Ryan", points: 38, aliases: ["ryan", "the ryan express"] },
      { text: "Sandy Koufax", points: 24, aliases: ["koufax"] },
      { text: "Pedro Martinez", points: 16, aliases: ["pedro", "martinez"] },
      { text: "Greg Maddux", points: 12, aliases: ["maddux", "mad dog"] },
      { text: "Roger Clemens", points: 10, aliases: ["clemens", "rocket", "the rocket"] },
    ]},
    { text: "Name something on a baseball card", answers: [
      { text: "Player Photo", points: 38, aliases: ["photo", "picture", "image"] },
      { text: "Stats", points: 26, aliases: ["statistics", "numbers", "career stats"] },
      { text: "Team Logo", points: 18, aliases: ["logo", "team name"] },
      { text: "Position", points: 10, aliases: ["pos", "player position"] },
      { text: "Card Number", points: 8, aliases: ["number", "serial number"] },
    ]},
    { text: "Name a baseball term for a bad pitch", answers: [
      { text: "Ball", points: 36, aliases: ["ball four", "outside"] },
      { text: "Wild Pitch", points: 26, aliases: ["wild one", "wp"] },
      { text: "Meatball", points: 18, aliases: ["hanger", "hanging pitch", "cookie"] },
      { text: "Beanball", points: 12, aliases: ["bean ball", "head hunter"] },
      { text: "Eephus", points: 8, aliases: ["blooper pitch", "slow pitch", "lob"] },
    ]},
    { text: "Name an MLB team in the AL West", answers: [
      { text: "Astros", points: 38, aliases: ["houston astros", "houston", "hou"] },
      { text: "Rangers", points: 24, aliases: ["texas rangers", "texas", "tex"] },
      { text: "Mariners", points: 18, aliases: ["seattle mariners", "seattle", "sea", "ms"] },
      { text: "Angels", points: 12, aliases: ["los angeles angels", "la angels", "laa", "anaheim"] },
      { text: "Athletics", points: 8, aliases: ["oakland athletics", "oakland as", "as", "a's"] },
    ]},
    { text: "Name a type of baseball bat material", answers: [
      { text: "Ash", points: 36, aliases: ["ash wood", "white ash"] },
      { text: "Maple", points: 28, aliases: ["maple wood", "hard maple"] },
      { text: "Birch", points: 16, aliases: ["birch wood", "yellow birch"] },
      { text: "Aluminum", points: 12, aliases: ["metal", "alloy", "metal bat"] },
      { text: "Composite", points: 8, aliases: ["carbon fiber", "composite bat"] },
    ]},
  ],
  // Day 20
  [
    { text: "Name a famous baseball broadcaster", answers: [
      { text: "Vin Scully", points: 40, aliases: ["scully", "vin"] },
      { text: "Joe Buck", points: 24, aliases: ["buck"] },
      { text: "Harry Caray", points: 16, aliases: ["caray", "holy cow"] },
      { text: "Bob Costas", points: 12, aliases: ["costas"] },
      { text: "Jon Miller", points: 8, aliases: ["miller"] },
    ]},
    { text: "Name a defensive gem in baseball", answers: [
      { text: "Diving Catch", points: 40, aliases: ["diving grab", "layout catch", "dive"] },
      { text: "Wall Catch", points: 24, aliases: ["climbing wall", "robbing homer", "over the wall"] },
      { text: "Bare Hand Play", points: 16, aliases: ["bare hand", "no glove", "barehanded"] },
      { text: "Double Play", points: 12, aliases: ["dp", "twin killing", "turning two"] },
      { text: "Throw From Knees", points: 8, aliases: ["throwing from knees", "on knees throw"] },
    ]},
    { text: "Name a baseball league besides MLB", answers: [
      { text: "Minor Leagues", points: 38, aliases: ["milb", "minors", "minor league", "aaa"] },
      { text: "NPB", points: 22, aliases: ["japan", "nippon", "japanese baseball"] },
      { text: "KBO", points: 18, aliases: ["korea", "korean baseball"] },
      { text: "College", points: 14, aliases: ["ncaa", "college baseball", "cws"] },
      { text: "Little League", points: 8, aliases: ["youth", "llws", "williamsport"] },
    ]},
    { text: "Name a thing that happens in spring training", answers: [
      { text: "Roster Cuts", points: 36, aliases: ["cuts", "sent down", "reassigned"] },
      { text: "Position Battles", points: 26, aliases: ["competition", "job battles", "roster battles"] },
      { text: "Autographs", points: 18, aliases: ["signing", "fan autographs", "meeting players"] },
      { text: "Injury Reports", points: 12, aliases: ["injuries", "setbacks", "someone gets hurt"] },
      { text: "Split Squad", points: 8, aliases: ["split squad games", "b games", "minor league games"] },
    ]},
    { text: "Name a thing batters do after a home run", answers: [
      { text: "Bat Flip", points: 38, aliases: ["flip bat", "bat toss", "pimp it"] },
      { text: "Trot Bases", points: 24, aliases: ["jog bases", "home run trot", "round the bases"] },
      { text: "Point to Sky", points: 18, aliases: ["point up", "points up", "looks up"] },
      { text: "High Fives", points: 12, aliases: ["fist bumps", "dap", "handshakes"] },
      { text: "Watch It Fly", points: 8, aliases: ["admire it", "stands and watches", "pimps it"] },
    ]},
  ],
  // Day 21
  [
    { text: "Name a baseball Hall of Fame city or location", answers: [
      { text: "Cooperstown", points: 44, aliases: ["cooperstown ny", "the hall"] },
      { text: "Omaha", points: 22, aliases: ["college world series", "cws", "omaha nebraska"] },
      { text: "Williamsport", points: 16, aliases: ["little league", "llws", "little league world series"] },
      { text: "Dyersville", points: 10, aliases: ["field of dreams", "iowa", "field of dreams game"] },
      { text: "Louisville", points: 8, aliases: ["louisville slugger", "bat factory", "slugger museum"] },
    ]},
    { text: "Name a famous MLB DH or designated hitter", answers: [
      { text: "David Ortiz", points: 40, aliases: ["ortiz", "big papi", "papi"] },
      { text: "Edgar Martinez", points: 24, aliases: ["edgar", "martinez"] },
      { text: "Frank Thomas", points: 16, aliases: ["thomas", "big hurt", "the big hurt"] },
      { text: "Harold Baines", points: 12, aliases: ["baines"] },
      { text: "Shohei Ohtani", points: 8, aliases: ["ohtani", "shohei", "sho time", "shotime"] },
    ]},
    { text: "Name a baseball slang term", answers: [
      { text: "Dinger", points: 36, aliases: ["dingers", "tater"] },
      { text: "Can of Corn", points: 24, aliases: ["can o corn", "easy fly ball"] },
      { text: "Cheese", points: 18, aliases: ["cheddar", "gas", "heat"] },
      { text: "Ribbie", points: 12, aliases: ["ribbies", "rbi"] },
      { text: "Frozen Rope", points: 10, aliases: ["rope", "line drive", "laser"] },
    ]},
    { text: "Name a famous baseball chant or song at the stadium", answers: [
      { text: "Charge", points: 38, aliases: ["charge chant", "da da da da da da"] },
      { text: "Let's Go", points: 26, aliases: ["lets go team", "clap clap clapclapclap"] },
      { text: "MVP", points: 16, aliases: ["mvp chant", "m-v-p"] },
      { text: "Na Na Goodbye", points: 12, aliases: ["hey hey hey goodbye", "nananana", "steam"] },
      { text: "Wave", points: 8, aliases: ["the wave", "doing the wave"] },
    ]},
    { text: "Name an MLB team with a bird mascot or name", answers: [
      { text: "Cardinals", points: 38, aliases: ["st louis cardinals", "cards", "stl"] },
      { text: "Blue Jays", points: 26, aliases: ["toronto blue jays", "jays", "tor"] },
      { text: "Orioles", points: 20, aliases: ["baltimore orioles", "os", "bal"] },
      { text: "Eagles", points: 8, aliases: ["eagles baseball"] },
      { text: "Robins", points: 8, aliases: ["brooklyn robins"] },
    ]},
  ],
  // Day 22
  [
    { text: "Name something sold by vendors at a ballgame", answers: [
      { text: "Beer", points: 38, aliases: ["beers", "cold beer", "brew"] },
      { text: "Hot Dogs", points: 26, aliases: ["hot dog", "dogs", "franks"] },
      { text: "Peanuts", points: 16, aliases: ["peanut", "bags of peanuts"] },
      { text: "Cotton Candy", points: 12, aliases: ["candy", "cotton"] },
      { text: "Popcorn", points: 8, aliases: ["pop corn"] },
    ]},
    { text: "Name a famous Cubs player", answers: [
      { text: "Ernie Banks", points: 36, aliases: ["banks", "mr cub", "mr. cub"] },
      { text: "Ryne Sandberg", points: 24, aliases: ["sandberg", "ryno"] },
      { text: "Sammy Sosa", points: 18, aliases: ["sosa", "sammy"] },
      { text: "Kris Bryant", points: 12, aliases: ["bryant", "kb"] },
      { text: "Ron Santo", points: 10, aliases: ["santo", "ronnie"] },
    ]},
    { text: "Name a thing that makes a pitcher an ace", answers: [
      { text: "Strikeouts", points: 38, aliases: ["high k rate", "ks", "whiffs"] },
      { text: "Low ERA", points: 26, aliases: ["era", "runs against", "earned run average"] },
      { text: "Wins", points: 16, aliases: ["winning", "win total"] },
      { text: "Command", points: 12, aliases: ["control", "accuracy", "painting corners"] },
      { text: "Durability", points: 8, aliases: ["innings pitched", "staying healthy", "200 innings"] },
    ]},
    { text: "Name a reason fans do the wave", answers: [
      { text: "Boredom", points: 42, aliases: ["bored", "boring game", "blowout"] },
      { text: "Tradition", points: 24, aliases: ["its a tradition", "always do it"] },
      { text: "Fun", points: 16, aliases: ["for fun", "entertainment", "good time"] },
      { text: "Someone Started It", points: 10, aliases: ["started", "one fan started"] },
      { text: "Winning Big", points: 8, aliases: ["blowout win", "up big", "celebrating lead"] },
    ]},
    { text: "Name a famous Yankees player", answers: [
      { text: "Babe Ruth", points: 36, aliases: ["ruth", "the babe", "bambino"] },
      { text: "Derek Jeter", points: 26, aliases: ["jeter", "dj", "captain"] },
      { text: "Mickey Mantle", points: 18, aliases: ["mantle", "the mick"] },
      { text: "Joe DiMaggio", points: 12, aliases: ["dimaggio", "joltin joe", "yankee clipper"] },
      { text: "Lou Gehrig", points: 8, aliases: ["gehrig", "iron horse"] },
    ]},
  ],
  // Day 23
  [
    { text: "Name a batting order spot by its nickname", answers: [
      { text: "Leadoff", points: 38, aliases: ["leadoff hitter", "first", "one hole"] },
      { text: "Cleanup", points: 28, aliases: ["cleanup hitter", "four hole", "4th"] },
      { text: "Three Hole", points: 16, aliases: ["third", "3 hole", "three spot"] },
      { text: "Two Hole", points: 10, aliases: ["second", "2 hole", "two spot"] },
      { text: "Nine Hole", points: 8, aliases: ["last spot", "pitcher spot", "bottom of order"] },
    ]},
    { text: "Name a famous Red Sox player", answers: [
      { text: "Ted Williams", points: 36, aliases: ["williams", "teddy ballgame", "splendid splinter"] },
      { text: "David Ortiz", points: 26, aliases: ["ortiz", "big papi", "papi"] },
      { text: "Pedro Martinez", points: 16, aliases: ["pedro", "martinez"] },
      { text: "Carl Yastrzemski", points: 12, aliases: ["yaz", "yastrzemski"] },
      { text: "Manny Ramirez", points: 10, aliases: ["manny", "ramirez", "manny being manny"] },
    ]},
    { text: "Name a baseball term for a fast runner", answers: [
      { text: "Burner", points: 36, aliases: ["speed burner", "blazer"] },
      { text: "Wheels", points: 26, aliases: ["has wheels", "got wheels"] },
      { text: "Jackrabbit", points: 16, aliases: ["rabbit", "jack rabbit"] },
      { text: "Speedster", points: 14, aliases: ["speed demon", "speed guy"] },
      { text: "Track Star", points: 8, aliases: ["track", "sprinter", "jets"] },
    ]},
    { text: "Name something that happens in a bench-clearing brawl", answers: [
      { text: "Ejections", points: 38, aliases: ["ejected", "tossed", "thrown out"] },
      { text: "Pushing", points: 24, aliases: ["shoving", "push", "shove"] },
      { text: "Suspensions", points: 18, aliases: ["suspended", "suspension"] },
      { text: "Fines", points: 12, aliases: ["fine", "fined", "money"] },
      { text: "Bull Pen Runs In", points: 8, aliases: ["bullpen empties", "bullpen runs out", "relievers run in"] },
    ]},
    { text: "Name a famous Dodgers player", answers: [
      { text: "Jackie Robinson", points: 36, aliases: ["robinson", "jackie", "42"] },
      { text: "Sandy Koufax", points: 24, aliases: ["koufax"] },
      { text: "Clayton Kershaw", points: 18, aliases: ["kershaw"] },
      { text: "Fernando Valenzuela", points: 12, aliases: ["fernando", "valenzuela", "fernandomania"] },
      { text: "Kirk Gibson", points: 10, aliases: ["gibson", "gibby"] },
    ]},
  ],
  // Day 24
  [
    { text: "Name a minor league level", answers: [
      { text: "Triple-A", points: 40, aliases: ["aaa", "triple a", "AAA"] },
      { text: "Double-A", points: 26, aliases: ["aa", "double a", "AA"] },
      { text: "Single-A", points: 16, aliases: ["a", "single a", "low a", "high a"] },
      { text: "Rookie Ball", points: 10, aliases: ["rookie", "rookie league", "complex league"] },
      { text: "Fall League", points: 8, aliases: ["arizona fall league", "afl", "instructional"] },
    ]},
    { text: "Name a reason fans boo at a game", answers: [
      { text: "Bad Call", points: 40, aliases: ["umpire call", "blown call", "missed call"] },
      { text: "Opposing Team", points: 24, aliases: ["visitors", "away team", "rival"] },
      { text: "Strikeout", points: 16, aliases: ["struck out", "whiffed", "k"] },
      { text: "Error", points: 12, aliases: ["fielding error", "booted it", "e"] },
      { text: "Pitching Change", points: 8, aliases: ["pulling pitcher", "slow change", "mound visit"] },
    ]},
    { text: "Name a famous Astros player", answers: [
      { text: "Nolan Ryan", points: 34, aliases: ["ryan", "the ryan express"] },
      { text: "Jeff Bagwell", points: 24, aliases: ["bagwell", "bags"] },
      { text: "Craig Biggio", points: 18, aliases: ["biggio"] },
      { text: "Jose Altuve", points: 14, aliases: ["altuve"] },
      { text: "Roger Clemens", points: 10, aliases: ["clemens", "rocket"] },
    ]},
    { text: "Name something a manager writes on a lineup card", answers: [
      { text: "Batting Order", points: 40, aliases: ["order", "lineup", "who bats where"] },
      { text: "Positions", points: 24, aliases: ["position", "fielding spots"] },
      { text: "Player Names", points: 18, aliases: ["names", "starters"] },
      { text: "Starting Pitcher", points: 10, aliases: ["sp", "starter", "who pitches"] },
      { text: "Jersey Numbers", points: 8, aliases: ["numbers", "uniform numbers"] },
    ]},
    { text: "Name a baseball term for a weak hit", answers: [
      { text: "Bloop", points: 36, aliases: ["blooper", "bloop hit", "bloop single"] },
      { text: "Dribbler", points: 24, aliases: ["roller", "slow roller", "tapper"] },
      { text: "Nubber", points: 18, aliases: ["nub", "swinging bunt"] },
      { text: "Duck Snort", points: 12, aliases: ["duck fart", "flare"] },
      { text: "Dying Quail", points: 10, aliases: ["quail", "texas leaguer"] },
    ]},
  ],
  // Day 25
  [
    { text: "Name a type of baseball tournament", answers: [
      { text: "World Series", points: 40, aliases: ["ws", "fall classic", "the series"] },
      { text: "World Baseball Classic", points: 22, aliases: ["wbc", "classic"] },
      { text: "College World Series", points: 18, aliases: ["cws", "omaha"] },
      { text: "Little League World Series", points: 12, aliases: ["llws", "williamsport"] },
      { text: "All-Star Game", points: 8, aliases: ["asg", "midsummer classic", "all star"] },
    ]},
    { text: "Name a famous Cardinals player", answers: [
      { text: "Stan Musial", points: 36, aliases: ["musial", "stan the man"] },
      { text: "Ozzie Smith", points: 24, aliases: ["ozzie", "the wizard"] },
      { text: "Bob Gibson", points: 16, aliases: ["gibson", "gibby", "hoot"] },
      { text: "Albert Pujols", points: 14, aliases: ["pujols", "the machine"] },
      { text: "Yadier Molina", points: 10, aliases: ["molina", "yadi"] },
    ]},
    { text: "Name something that makes a ballpark smell great", answers: [
      { text: "Hot Dogs", points: 38, aliases: ["hot dog", "grilled dogs"] },
      { text: "Popcorn", points: 24, aliases: ["pop corn", "fresh popcorn"] },
      { text: "Fresh Grass", points: 18, aliases: ["grass", "cut grass", "the field"] },
      { text: "Peanuts", points: 12, aliases: ["roasted peanuts", "peanut"] },
      { text: "Garlic Fries", points: 8, aliases: ["fries", "garlic", "french fries"] },
    ]},
    { text: "Name a thing pitchers hate", answers: [
      { text: "Home Runs", points: 38, aliases: ["giving up homers", "long balls", "dingers"] },
      { text: "Walks", points: 24, aliases: ["base on balls", "free passes", "bb"] },
      { text: "Errors", points: 16, aliases: ["fielding errors", "bad defense", "booted balls"] },
      { text: "Blisters", points: 12, aliases: ["finger blister", "blister on finger"] },
      { text: "Rain Delays", points: 10, aliases: ["rain", "delay", "weather delays"] },
    ]},
    { text: "Name a way to describe a powerful hitter", answers: [
      { text: "Slugger", points: 40, aliases: ["power hitter", "masher"] },
      { text: "Big Bat", points: 24, aliases: ["big stick", "lumber"] },
      { text: "Crusher", points: 16, aliases: ["mashes", "bombs"] },
      { text: "Run Producer", points: 12, aliases: ["rbi guy", "run driver"] },
      { text: "Thumper", points: 8, aliases: ["basher", "bopper"] },
    ]},
  ],
  // Day 26
  [
    { text: "Name a thing associated with spring training", answers: [
      { text: "Florida", points: 36, aliases: ["grapefruit league", "fl"] },
      { text: "Arizona", points: 26, aliases: ["cactus league", "az"] },
      { text: "Warm Weather", points: 18, aliases: ["sunshine", "sun", "nice weather"] },
      { text: "Prospects", points: 12, aliases: ["young players", "rookies", "minor leaguers"] },
      { text: "Exhibition Games", points: 8, aliases: ["preseason", "tuneup games", "practice games"] },
    ]},
    { text: "Name a famous Braves player", answers: [
      { text: "Hank Aaron", points: 40, aliases: ["aaron", "hammerin hank", "hammer"] },
      { text: "Chipper Jones", points: 24, aliases: ["chipper", "jones", "larry"] },
      { text: "Greg Maddux", points: 16, aliases: ["maddux", "mad dog", "the professor"] },
      { text: "Tom Glavine", points: 10, aliases: ["glavine"] },
      { text: "John Smoltz", points: 10, aliases: ["smoltz", "smoltzy"] },
    ]},
    { text: "Name a baseball term for a ground ball", answers: [
      { text: "Grounder", points: 38, aliases: ["ground ball", "roller"] },
      { text: "Chopper", points: 24, aliases: ["chop", "high chopper", "bouncer"] },
      { text: "Worm Burner", points: 18, aliases: ["worm killer", "hot shot"] },
      { text: "Slow Roller", points: 12, aliases: ["dribbler", "tapper", "nubber"] },
      { text: "Smash", points: 8, aliases: ["shot", "rocket", "screamer"] },
    ]},
    { text: "Name a position that requires a strong arm", answers: [
      { text: "Pitcher", points: 36, aliases: ["p", "throwing arm", "pitching arm"] },
      { text: "Catcher", points: 28, aliases: ["c", "backstop"] },
      { text: "Shortstop", points: 18, aliases: ["ss", "short"] },
      { text: "Right Field", points: 10, aliases: ["rf", "right fielder"] },
      { text: "Third Base", points: 8, aliases: ["3b", "hot corner", "third baseman"] },
    ]},
    { text: "Name a famous Giants player", answers: [
      { text: "Willie Mays", points: 40, aliases: ["mays", "say hey kid"] },
      { text: "Barry Bonds", points: 26, aliases: ["bonds", "barry"] },
      { text: "Buster Posey", points: 16, aliases: ["posey", "buster"] },
      { text: "Juan Marichal", points: 10, aliases: ["marichal"] },
      { text: "Willie McCovey", points: 8, aliases: ["mccovey", "stretch"] },
    ]},
  ],
  // Day 27
  [
    { text: "Name something a team does at the trade deadline", answers: [
      { text: "Trades", points: 42, aliases: ["makes a trade", "acquires player", "makes deals"] },
      { text: "Buys", points: 22, aliases: ["adds players", "buyers", "goes all in"] },
      { text: "Sells", points: 18, aliases: ["sells players", "sellers", "rebuilds"] },
      { text: "Nothing", points: 10, aliases: ["stands pat", "does nothing", "no moves"] },
      { text: "Waiver Claims", points: 8, aliases: ["waivers", "claims player", "waiver wire"] },
    ]},
    { text: "Name a baseball-themed candy or snack", answers: [
      { text: "Cracker Jack", points: 40, aliases: ["cracker jacks", "crackerjack"] },
      { text: "Big League Chew", points: 28, aliases: ["big league", "shredded gum"] },
      { text: "Sunflower Seeds", points: 16, aliases: ["seeds", "sunflower", "davids seeds"] },
      { text: "Cotton Candy", points: 10, aliases: ["cotton", "candy"] },
      { text: "Dippin Dots", points: 6, aliases: ["dippin dots", "ice cream dots", "dots"] },
    ]},
    { text: "Name a famous baseball scandal", answers: [
      { text: "Steroids", points: 38, aliases: ["steroid era", "peds", "juicing", "performance enhancing"] },
      { text: "Black Sox", points: 24, aliases: ["1919", "1919 world series", "shoeless joe"] },
      { text: "Astros Sign Stealing", points: 18, aliases: ["trash can", "houston cheating", "bang scheme"] },
      { text: "Pete Rose Gambling", points: 12, aliases: ["pete rose", "rose ban", "gambling"] },
      { text: "Corked Bats", points: 8, aliases: ["corked bat", "sammy sosa bat", "illegal bat"] },
    ]},
    { text: "Name a famous Mets player", answers: [
      { text: "Tom Seaver", points: 36, aliases: ["seaver", "tom terrific", "the franchise"] },
      { text: "Mike Piazza", points: 26, aliases: ["piazza"] },
      { text: "David Wright", points: 16, aliases: ["wright", "captain america"] },
      { text: "Doc Gooden", points: 12, aliases: ["gooden", "dwight gooden", "dr k"] },
      { text: "Darryl Strawberry", points: 10, aliases: ["strawberry", "straw"] },
    ]},
    { text: "Name something pitchers study before a game", answers: [
      { text: "Scouting Reports", points: 38, aliases: ["reports", "scouting", "tendencies"] },
      { text: "Video", points: 26, aliases: ["film", "tape", "game film"] },
      { text: "Lineup", points: 18, aliases: ["batting order", "opposing lineup"] },
      { text: "Hot Zones", points: 10, aliases: ["zone charts", "spray charts", "heat maps"] },
      { text: "Pitch Sequences", points: 8, aliases: ["sequences", "patterns", "pitch plans"] },
    ]},
  ],
  // Day 28
  [
    { text: "Name a baseball injury", answers: [
      { text: "Tommy John", points: 40, aliases: ["ucl", "elbow surgery", "tj", "tommy john surgery"] },
      { text: "Hamstring", points: 22, aliases: ["pulled hamstring", "hammy", "hamstring pull"] },
      { text: "Oblique", points: 16, aliases: ["oblique strain", "side strain", "core"] },
      { text: "Rotator Cuff", points: 12, aliases: ["shoulder", "rotator", "shoulder injury"] },
      { text: "Blister", points: 10, aliases: ["finger blister", "pitching blister"] },
    ]},
    { text: "Name a famous baseball stadium that no longer exists", answers: [
      { text: "Old Yankee Stadium", points: 36, aliases: ["old yankee", "the house that ruth built", "original yankee"] },
      { text: "Ebbets Field", points: 26, aliases: ["ebbets", "brooklyn", "dodgers ebbets"] },
      { text: "Tiger Stadium", points: 16, aliases: ["detroit tiger stadium", "the corner"] },
      { text: "The Polo Grounds", points: 12, aliases: ["polo grounds"] },
      { text: "Shea Stadium", points: 10, aliases: ["shea", "mets shea"] },
    ]},
    { text: "Name a thing catchers are known for", answers: [
      { text: "Calling Games", points: 36, aliases: ["game calling", "calling pitches", "pitch calling"] },
      { text: "Blocking", points: 26, aliases: ["blocking balls", "blocking pitches", "in the dirt"] },
      { text: "Framing", points: 18, aliases: ["pitch framing", "framing pitches", "stealing strikes"] },
      { text: "Throwing Out Runners", points: 12, aliases: ["throwing out", "arm", "strong arm"] },
      { text: "Getting Hit", points: 8, aliases: ["foul tips", "taking a beating", "bruises"] },
    ]},
    { text: "Name an MLB team from the Pacific Northwest or Canada", answers: [
      { text: "Mariners", points: 40, aliases: ["seattle mariners", "seattle", "sea", "ms"] },
      { text: "Blue Jays", points: 32, aliases: ["toronto blue jays", "toronto", "jays", "tor"] },
      { text: "Expos", points: 14, aliases: ["montreal expos", "montreal", "les expos"] },
      { text: "Vancouver Canadians", points: 8, aliases: ["vancouver", "canadians"] },
      { text: "Tacoma Rainiers", points: 6, aliases: ["tacoma", "rainiers"] },
    ]},
    { text: "Name a famous baseball walk-off type", answers: [
      { text: "Walk-Off Homer", points: 42, aliases: ["walkoff home run", "walkoff hr", "walk off homer"] },
      { text: "Walk-Off Single", points: 24, aliases: ["walkoff hit", "walk off single", "walkoff single"] },
      { text: "Walk-Off Walk", points: 16, aliases: ["walkoff walk", "walk off walk", "bases loaded walk"] },
      { text: "Walk-Off Error", points: 10, aliases: ["walkoff error", "walk off error", "error walk off"] },
      { text: "Walk-Off Balk", points: 8, aliases: ["walkoff balk", "walk off balk", "balk walk off"] },
    ]},
  ],
  // Day 29
  [
    { text: "Name something associated with the All-Star Game", answers: [
      { text: "Home Run Derby", points: 42, aliases: ["derby", "hr derby", "home run contest"] },
      { text: "Fan Voting", points: 22, aliases: ["voting", "vote", "all star vote"] },
      { text: "MVP Award", points: 16, aliases: ["asg mvp", "all star mvp", "mvp"] },
      { text: "Celebrity Game", points: 12, aliases: ["celebrity softball", "celeb game"] },
      { text: "Futures Game", points: 8, aliases: ["prospects game", "future stars", "futures"] },
    ]},
    { text: "Name a thing that makes a pitcher dominant", answers: [
      { text: "Velocity", points: 38, aliases: ["speed", "fast", "throws hard", "gas"] },
      { text: "Movement", points: 24, aliases: ["break", "pitch movement", "nasty stuff"] },
      { text: "Command", points: 18, aliases: ["control", "location", "hitting spots"] },
      { text: "Deception", points: 12, aliases: ["hides ball", "deceptive delivery"] },
      { text: "Composure", points: 8, aliases: ["mental toughness", "cool under pressure", "calm"] },
    ]},
    { text: "Name a famous baseball trade", answers: [
      { text: "Babe Ruth Sale", points: 40, aliases: ["ruth to yankees", "curse of the bambino", "selling babe"] },
      { text: "Manny Ramirez", points: 22, aliases: ["manny trade", "manny to dodgers"] },
      { text: "A-Rod Trade", points: 16, aliases: ["alex rodriguez", "arod to yankees"] },
      { text: "Herschel Walker", points: 12, aliases: ["walker trade"] },
      { text: "Jeff Bagwell", points: 10, aliases: ["bagwell trade", "red sox to astros"] },
    ]},
    { text: "Name a famous Tigers or Reds player", answers: [
      { text: "Ty Cobb", points: 36, aliases: ["cobb", "georgia peach"] },
      { text: "Pete Rose", points: 26, aliases: ["rose", "charlie hustle"] },
      { text: "Al Kaline", points: 16, aliases: ["kaline", "mr tiger"] },
      { text: "Johnny Bench", points: 12, aliases: ["bench"] },
      { text: "Miguel Cabrera", points: 10, aliases: ["cabrera", "miggy"] },
    ]},
    { text: "Name a thing that ends a perfect game bid", answers: [
      { text: "Hit", points: 40, aliases: ["base hit", "single", "clean hit"] },
      { text: "Walk", points: 26, aliases: ["base on balls", "bb", "free pass"] },
      { text: "Error", points: 16, aliases: ["fielding error", "booted ball"] },
      { text: "Hit By Pitch", points: 10, aliases: ["hbp", "plunked", "beaned"] },
      { text: "Catcher Interference", points: 8, aliases: ["interference", "catchers interference"] },
    ]},
  ],
  // Day 30
  [
    { text: "Name a thing a team retires for a legendary player", answers: [
      { text: "Jersey Number", points: 44, aliases: ["number", "retired number", "jersey"] },
      { text: "Statue", points: 24, aliases: ["bronze statue", "monument", "sculpture"] },
      { text: "Ring of Honor", points: 14, aliases: ["hall of fame", "team hall", "ring"] },
      { text: "Banner", points: 10, aliases: ["retired banner", "flag", "pennant"] },
      { text: "Plaque", points: 8, aliases: ["monument park", "memorial plaque"] },
    ]},
    { text: "Name a famous Phillies player", answers: [
      { text: "Mike Schmidt", points: 38, aliases: ["schmidt", "schmidty"] },
      { text: "Steve Carlton", points: 22, aliases: ["carlton", "lefty"] },
      { text: "Chase Utley", points: 18, aliases: ["utley"] },
      { text: "Ryan Howard", points: 12, aliases: ["howard", "big piece", "the big piece"] },
      { text: "Bryce Harper", points: 10, aliases: ["harper", "bryce"] },
    ]},
    { text: "Name a type of count in an at-bat", answers: [
      { text: "Full Count", points: 40, aliases: ["3-2", "three two", "three and two"] },
      { text: "0-2", points: 22, aliases: ["oh two", "two strikes", "pitchers count"] },
      { text: "3-0", points: 18, aliases: ["three oh", "hitters count", "three balls"] },
      { text: "2-2", points: 12, aliases: ["two two", "even count"] },
      { text: "1-0", points: 8, aliases: ["one oh", "first pitch ball"] },
    ]},
    { text: "Name a famous thing about Wrigley Field", answers: [
      { text: "Ivy Walls", points: 38, aliases: ["ivy", "outfield ivy", "ivy covered walls"] },
      { text: "Rooftop Seats", points: 22, aliases: ["rooftops", "buildings across street", "rooftop views"] },
      { text: "Marquee Sign", points: 16, aliases: ["marquee", "wrigley sign", "entrance sign"] },
      { text: "Throw Back HR", points: 14, aliases: ["throwing back", "opposing homer thrown back"] },
      { text: "Manual Scoreboard", points: 10, aliases: ["hand operated", "old scoreboard", "scoreboard"] },
    ]},
    { text: "Name a reason a player gets called up from the minors", answers: [
      { text: "Hot Streak", points: 38, aliases: ["playing well", "mashing", "tearing it up"] },
      { text: "Injury Call-Up", points: 26, aliases: ["replacing injured player", "injury replacement"] },
      { text: "September Roster", points: 16, aliases: ["expanded roster", "september callup", "rosters expand"] },
      { text: "Need Help", points: 12, aliases: ["team struggling", "team needs him"] },
      { text: "Top Prospect", points: 8, aliases: ["prospect ready", "number one prospect", "highly ranked"] },
    ]},
  ],
]

// ── NHL Questions (30 days) ──
const NHL_DAYS: Question[][] = [
  // Day 1
  [
    {
      text: "Name a famous NHL goalie",
      answers: [
        { text: "Patrick Roy", points: 36, aliases: ["roy", "saint patrick"] },
        { text: "Martin Brodeur", points: 26, aliases: ["brodeur", "marty"] },
        { text: "Carey Price", points: 18, aliases: ["price"] },
        { text: "Henrik Lundqvist", points: 12, aliases: ["lundqvist", "hank", "king henrik"] },
        { text: "Dominik Hasek", points: 8, aliases: ["hasek", "the dominator"] },
      ],
    },
    {
      text: "Name an Original Six NHL team",
      answers: [
        { text: "Canadiens", points: 36, aliases: ["montreal", "habs", "montreal canadiens"] },
        { text: "Bruins", points: 24, aliases: ["boston", "boston bruins"] },
        { text: "Rangers", points: 18, aliases: ["new york", "new york rangers", "nyr"] },
        { text: "Red Wings", points: 12, aliases: ["detroit", "detroit red wings", "wings"] },
        { text: "Blackhawks", points: 10, aliases: ["chicago", "chicago blackhawks", "hawks"] },
      ],
    },
    {
      text: "Name a hockey penalty",
      answers: [
        { text: "Tripping", points: 36, aliases: ["trip"] },
        { text: "Hooking", points: 26, aliases: ["hook"] },
        { text: "High-Sticking", points: 20, aliases: ["high stick", "high sticking"] },
        { text: "Interference", points: 12, aliases: ["interfere"] },
        { text: "Slashing", points: 6, aliases: ["slash"] },
      ],
    },
    {
      text: "Name a Canadian NHL city",
      answers: [
        { text: "Toronto", points: 36, aliases: ["leafs", "maple leafs"] },
        { text: "Montreal", points: 28, aliases: ["canadiens", "habs"] },
        { text: "Vancouver", points: 18, aliases: ["canucks"] },
        { text: "Edmonton", points: 12, aliases: ["oilers"] },
        { text: "Calgary", points: 6, aliases: ["flames"] },
      ],
    },
    {
      text: "Name a position in hockey",
      answers: [
        { text: "Center", points: 34, aliases: ["c", "centre"] },
        { text: "Goalie", points: 28, aliases: ["goaltender", "keeper", "netminder", "g"] },
        { text: "Defenseman", points: 20, aliases: ["defense", "d", "defenceman"] },
        { text: "Left Wing", points: 10, aliases: ["lw", "left winger"] },
        { text: "Right Wing", points: 8, aliases: ["rw", "right winger"] },
      ],
    },
  ],

  // Day 2
  [
    {
      text: "Name something thrown on NHL ice by fans",
      answers: [
        { text: "Hats", points: 40, aliases: ["hat", "cap", "caps"] },
        { text: "Octopus", points: 28, aliases: ["octopi", "octopuses"] },
        { text: "Beer", points: 16, aliases: ["beer can", "drink", "drinks"] },
        { text: "Rats", points: 10, aliases: ["rat", "plastic rat", "plastic rats"] },
        { text: "Catfish", points: 6, aliases: ["fish"] },
      ],
    },
    {
      text: "Name a country that produces NHL players",
      answers: [
        { text: "Canada", points: 40, aliases: ["canadian"] },
        { text: "USA", points: 24, aliases: ["united states", "america", "american", "us"] },
        { text: "Sweden", points: 16, aliases: ["swedish"] },
        { text: "Russia", points: 12, aliases: ["russian"] },
        { text: "Finland", points: 8, aliases: ["finnish"] },
      ],
    },
    {
      text: "Name a piece of hockey equipment",
      answers: [
        { text: "Stick", points: 36, aliases: ["hockey stick"] },
        { text: "Skates", points: 26, aliases: ["skate"] },
        { text: "Helmet", points: 18, aliases: ["bucket", "lid"] },
        { text: "Gloves", points: 12, aliases: ["glove", "mitts"] },
        { text: "Pads", points: 8, aliases: ["shin pads", "leg pads", "pad"] },
      ],
    },
    {
      text: "Name an NHL team with an animal mascot or name",
      answers: [
        { text: "Penguins", points: 36, aliases: ["pittsburgh", "pens", "pittsburgh penguins"] },
        { text: "Bruins", points: 24, aliases: ["boston", "boston bruins", "bears"] },
        { text: "Panthers", points: 18, aliases: ["florida", "florida panthers", "cats"] },
        { text: "Sharks", points: 14, aliases: ["san jose", "san jose sharks"] },
        { text: "Ducks", points: 8, aliases: ["anaheim", "anaheim ducks"] },
      ],
    },
    {
      text: "Name a type of hockey shot",
      answers: [
        { text: "Slap Shot", points: 38, aliases: ["slapshot", "slapper", "slap"] },
        { text: "Wrist Shot", points: 28, aliases: ["wrister", "wrist"] },
        { text: "Snapshot", points: 16, aliases: ["snap shot", "snap"] },
        { text: "Backhand", points: 12, aliases: ["backhand shot", "backhander"] },
        { text: "One-Timer", points: 6, aliases: ["one timer", "onetimer"] },
      ],
    },
  ],

  // Day 3
  [
    {
      text: "Name a famous NHL rivalry team pairing",
      answers: [
        { text: "Bruins-Canadiens", points: 36, aliases: ["boston montreal", "canadiens bruins", "habs bruins"] },
        { text: "Penguins-Flyers", points: 24, aliases: ["pittsburgh philly", "flyers penguins", "pens flyers"] },
        { text: "Rangers-Islanders", points: 18, aliases: ["islanders rangers", "nyr nyi"] },
        { text: "Red Wings-Avalanche", points: 14, aliases: ["avalanche red wings", "detroit colorado"] },
        { text: "Oilers-Flames", points: 8, aliases: ["flames oilers", "battle of alberta", "edmonton calgary"] },
      ],
    },
    {
      text: "Name an NHL trophy or award",
      answers: [
        { text: "Stanley Cup", points: 44, aliases: ["the cup", "cup", "lord stanley"] },
        { text: "Hart Trophy", points: 22, aliases: ["hart", "mvp"] },
        { text: "Conn Smythe", points: 16, aliases: ["conn smythe trophy", "playoff mvp"] },
        { text: "Vezina", points: 10, aliases: ["vezina trophy", "best goalie"] },
        { text: "Norris", points: 8, aliases: ["norris trophy", "best defenseman"] },
      ],
    },
    {
      text: "Name something a hockey player loses during a game",
      answers: [
        { text: "Teeth", points: 40, aliases: ["tooth", "front teeth"] },
        { text: "Gloves", points: 24, aliases: ["glove", "mitts"] },
        { text: "Helmet", points: 18, aliases: ["bucket", "lid"] },
        { text: "Stick", points: 12, aliases: ["hockey stick"] },
        { text: "Blood", points: 6, aliases: ["bleed", "bleeding"] },
      ],
    },
    {
      text: "Name a reason a goal gets called back",
      answers: [
        { text: "Offside", points: 38, aliases: ["offsides", "off side"] },
        { text: "Goalie Interference", points: 26, aliases: ["goaltender interference", "crease violation"] },
        { text: "High Stick", points: 18, aliases: ["high sticking", "high-stick"] },
        { text: "Hand Pass", points: 10, aliases: ["handpass"] },
        { text: "Kicked In", points: 8, aliases: ["kick", "kicking motion", "kicked"] },
      ],
    },
    {
      text: "Name an NHL team from a warm-weather state",
      answers: [
        { text: "Panthers", points: 36, aliases: ["florida", "florida panthers"] },
        { text: "Lightning", points: 26, aliases: ["tampa", "tampa bay", "tampa bay lightning", "bolts"] },
        { text: "Stars", points: 18, aliases: ["dallas", "dallas stars"] },
        { text: "Ducks", points: 12, aliases: ["anaheim", "anaheim ducks"] },
        { text: "Coyotes", points: 8, aliases: ["arizona", "arizona coyotes", "yotes"] },
      ],
    },
  ],

  // Day 4
  [
    {
      text: "Name a famous NHL enforcer",
      answers: [
        { text: "Bob Probert", points: 36, aliases: ["probert"] },
        { text: "Tie Domi", points: 26, aliases: ["domi"] },
        { text: "Derek Boogaard", points: 18, aliases: ["boogaard", "boogeyman"] },
        { text: "George Parros", points: 12, aliases: ["parros"] },
        { text: "Chris Nilan", points: 8, aliases: ["nilan", "knuckles"] },
      ],
    },
    {
      text: "Name a hockey term a non-fan wouldn't know",
      answers: [
        { text: "Deke", points: 36, aliases: ["dangle", "dangles", "deking"] },
        { text: "Biscuit", points: 24, aliases: ["the biscuit"] },
        { text: "Five Hole", points: 20, aliases: ["5 hole", "fivehole"] },
        { text: "Bar Down", points: 12, aliases: ["bardown", "bar downski"] },
        { text: "Celly", points: 8, aliases: ["cellys", "celebration"] },
      ],
    },
    {
      text: "Name a common hockey injury",
      answers: [
        { text: "Concussion", points: 36, aliases: ["concussions", "head injury"] },
        { text: "Lost Teeth", points: 26, aliases: ["missing teeth", "broken tooth", "teeth"] },
        { text: "Broken Nose", points: 18, aliases: ["nose", "nose break"] },
        { text: "Shoulder Injury", points: 12, aliases: ["separated shoulder", "shoulder"] },
        { text: "Knee Injury", points: 8, aliases: ["torn acl", "knee", "mcl", "acl"] },
      ],
    },
    {
      text: "Name a way a hockey game can end",
      answers: [
        { text: "Regulation", points: 34, aliases: ["regular time", "60 minutes"] },
        { text: "Overtime", points: 28, aliases: ["ot", "extra time"] },
        { text: "Shootout", points: 22, aliases: ["so", "shoot out"] },
        { text: "Forfeit", points: 10, aliases: ["default"] },
        { text: "Tie", points: 6, aliases: ["draw", "tied"] },
      ],
    },
    {
      text: "Name an NHL player known for fighting",
      answers: [
        { text: "Bob Probert", points: 36, aliases: ["probert"] },
        { text: "Tie Domi", points: 28, aliases: ["domi"] },
        { text: "Milan Lucic", points: 18, aliases: ["lucic"] },
        { text: "Ryan Reaves", points: 12, aliases: ["reaves", "reavo"] },
        { text: "Tom Wilson", points: 6, aliases: ["wilson", "willy"] },
      ],
    },
  ],

  // Day 5
  [
    {
      text: "Name an NHL team that has won the Stanley Cup",
      answers: [
        { text: "Canadiens", points: 38, aliases: ["montreal", "habs", "montreal canadiens"] },
        { text: "Red Wings", points: 24, aliases: ["detroit", "detroit red wings"] },
        { text: "Penguins", points: 18, aliases: ["pittsburgh", "pens", "pittsburgh penguins"] },
        { text: "Oilers", points: 12, aliases: ["edmonton", "edmonton oilers"] },
        { text: "Blackhawks", points: 8, aliases: ["chicago", "chicago blackhawks", "hawks"] },
      ],
    },
    {
      text: "Name a hockey arena snack or food",
      answers: [
        { text: "Hot Dog", points: 36, aliases: ["hotdog", "hot dogs", "dogs"] },
        { text: "Nachos", points: 26, aliases: ["nacho", "nachos and cheese"] },
        { text: "Pizza", points: 18, aliases: ["slice", "pizza slice"] },
        { text: "Popcorn", points: 12, aliases: ["pop corn"] },
        { text: "Pretzel", points: 8, aliases: ["pretzels", "soft pretzel"] },
      ],
    },
    {
      text: "Name a number retired by multiple NHL teams",
      answers: [
        { text: "99", points: 42, aliases: ["ninety nine", "gretzky"] },
        { text: "9", points: 22, aliases: ["nine"] },
        { text: "7", points: 16, aliases: ["seven"] },
        { text: "4", points: 12, aliases: ["four"] },
        { text: "1", points: 8, aliases: ["one"] },
      ],
    },
    {
      text: "Name a surface in a hockey rink",
      answers: [
        { text: "Ice", points: 38, aliases: ["the ice"] },
        { text: "Boards", points: 26, aliases: ["board", "the boards"] },
        { text: "Glass", points: 18, aliases: ["the glass", "plexiglass"] },
        { text: "Bench", points: 10, aliases: ["the bench", "players bench"] },
        { text: "Crease", points: 8, aliases: ["the crease", "goalie crease"] },
      ],
    },
    {
      text: "Name an NHL city in the Northeast US",
      answers: [
        { text: "New York", points: 36, aliases: ["rangers", "islanders", "nyr", "nyi"] },
        { text: "Boston", points: 28, aliases: ["bruins"] },
        { text: "Pittsburgh", points: 18, aliases: ["penguins", "pens"] },
        { text: "Philadelphia", points: 12, aliases: ["philly", "flyers"] },
        { text: "Buffalo", points: 6, aliases: ["sabres"] },
      ],
    },
  ],

  // Day 6
  [
    {
      text: "Name an NHL player who wore number 99",
      answers: [
        { text: "Wayne Gretzky", points: 90, aliases: ["gretzky", "the great one", "wayne"] },
        { text: "Wilf Paiement", points: 4, aliases: ["paiement"] },
        { text: "Rick Dudley", points: 2, aliases: ["dudley"] },
        { text: "Brian Lawton", points: 2, aliases: ["lawton"] },
        { text: "Joe Juneau", points: 2, aliases: ["juneau"] },
      ],
    },
    {
      text: "Name a goalie mask design theme",
      answers: [
        { text: "Team Logo", points: 36, aliases: ["logo", "team crest"] },
        { text: "Skull", points: 24, aliases: ["skulls", "skeleton"] },
        { text: "Flag", points: 18, aliases: ["flags", "country flag", "national flag"] },
        { text: "Animal", points: 14, aliases: ["animals", "beast", "creature"] },
        { text: "Fire", points: 8, aliases: ["flames", "flame"] },
      ],
    },
    {
      text: "Name a reason a goalie gets pulled",
      answers: [
        { text: "Too Many Goals", points: 40, aliases: ["giving up goals", "bad goals", "scored on"] },
        { text: "Injury", points: 24, aliases: ["injured", "hurt"] },
        { text: "Extra Attacker", points: 18, aliases: ["empty net", "extra skater", "6 on 5"] },
        { text: "Bad Night", points: 12, aliases: ["off night", "playing bad", "struggling"] },
        { text: "Scheduled Rest", points: 6, aliases: ["rest", "planned", "back to back"] },
      ],
    },
    {
      text: "Name an NHL expansion team from the 2000s",
      answers: [
        { text: "Golden Knights", points: 40, aliases: ["vegas", "vgk", "vegas golden knights"] },
        { text: "Kraken", points: 26, aliases: ["seattle", "seattle kraken"] },
        { text: "Blue Jackets", points: 16, aliases: ["columbus", "cbj", "columbus blue jackets"] },
        { text: "Wild", points: 12, aliases: ["minnesota", "minnesota wild"] },
        { text: "Thrashers", points: 6, aliases: ["atlanta", "atlanta thrashers"] },
      ],
    },
    {
      text: "Name something that happens after a playoff series win",
      answers: [
        { text: "Handshake Line", points: 40, aliases: ["handshakes", "shake hands", "handshake"] },
        { text: "Celebration", points: 24, aliases: ["celebrate", "celebrating"] },
        { text: "Hat Throw", points: 16, aliases: ["hats", "hat toss"] },
        { text: "Dogpile", points: 12, aliases: ["dog pile", "pile on", "pile up"] },
        { text: "Cup Lift", points: 8, aliases: ["raise the cup", "lifting the cup", "hoist the cup"] },
      ],
    },
  ],

  // Day 7
  [
    {
      text: "Name a famous Wayne Gretzky record category",
      answers: [
        { text: "Goals", points: 36, aliases: ["most goals", "career goals", "goal"] },
        { text: "Assists", points: 28, aliases: ["most assists", "career assists", "assist"] },
        { text: "Points", points: 20, aliases: ["most points", "career points", "total points"] },
        { text: "Hat Tricks", points: 10, aliases: ["hat trick", "most hat tricks"] },
        { text: "Scoring Titles", points: 6, aliases: ["art ross", "scoring title"] },
      ],
    },
    {
      text: "Name an NHL team with a color in its name",
      answers: [
        { text: "Red Wings", points: 36, aliases: ["detroit", "detroit red wings"] },
        { text: "Blue Jackets", points: 24, aliases: ["columbus", "columbus blue jackets", "cbj"] },
        { text: "Blues", points: 20, aliases: ["st louis", "st louis blues", "saint louis"] },
        { text: "Golden Knights", points: 12, aliases: ["vegas", "vegas golden knights", "vgk"] },
        { text: "Blackhawks", points: 8, aliases: ["chicago", "chicago blackhawks"] },
      ],
    },
    {
      text: "Name a line marking on a hockey rink",
      answers: [
        { text: "Blue Line", points: 38, aliases: ["blueline", "blue lines"] },
        { text: "Red Line", points: 28, aliases: ["center line", "centre line", "redline"] },
        { text: "Goal Line", points: 18, aliases: ["goal lines"] },
        { text: "Face-off Circle", points: 10, aliases: ["faceoff circle", "face off circle", "circles", "dots"] },
        { text: "Crease", points: 6, aliases: ["goalie crease", "the crease"] },
      ],
    },
    {
      text: "Name a famous hockey movie",
      answers: [
        { text: "Slap Shot", points: 38, aliases: ["slapshot"] },
        { text: "Miracle", points: 28, aliases: ["miracle on ice movie"] },
        { text: "Mighty Ducks", points: 18, aliases: ["the mighty ducks", "d2", "d3"] },
        { text: "Goon", points: 10, aliases: ["goon last of the enforcers"] },
        { text: "Youngblood", points: 6, aliases: ["young blood"] },
      ],
    },
    {
      text: "Name something found in a hockey locker room",
      answers: [
        { text: "Sticks", points: 36, aliases: ["stick", "hockey sticks"] },
        { text: "Skates", points: 26, aliases: ["skate"] },
        { text: "Jerseys", points: 18, aliases: ["jersey", "sweater", "sweaters"] },
        { text: "Tape", points: 12, aliases: ["hockey tape", "stick tape"] },
        { text: "Smelling Salts", points: 8, aliases: ["salts", "smelling salt"] },
      ],
    },
  ],

  // Day 8
  [
    {
      text: "Name an NHL team from the Pacific Division",
      answers: [
        { text: "Golden Knights", points: 34, aliases: ["vegas", "vgk", "vegas golden knights"] },
        { text: "Kings", points: 24, aliases: ["la kings", "los angeles", "los angeles kings"] },
        { text: "Kraken", points: 20, aliases: ["seattle", "seattle kraken"] },
        { text: "Oilers", points: 14, aliases: ["edmonton", "edmonton oilers"] },
        { text: "Canucks", points: 8, aliases: ["vancouver", "vancouver canucks"] },
      ],
    },
    {
      text: "Name a famous NHL defenseman",
      answers: [
        { text: "Bobby Orr", points: 38, aliases: ["orr", "bobby"] },
        { text: "Nicklas Lidstrom", points: 24, aliases: ["lidstrom", "the perfect human"] },
        { text: "Ray Bourque", points: 18, aliases: ["bourque"] },
        { text: "Chris Pronger", points: 12, aliases: ["pronger"] },
        { text: "Scott Niedermayer", points: 8, aliases: ["niedermayer"] },
      ],
    },
    {
      text: "Name a hockey superstition",
      answers: [
        { text: "Playoff Beard", points: 40, aliases: ["beard", "beards", "playoff beards", "not shaving"] },
        { text: "Same Routine", points: 22, aliases: ["routine", "pregame routine", "rituals"] },
        { text: "Tap Goalie Pads", points: 18, aliases: ["tap pads", "pad tap", "goalie tap"] },
        { text: "Lucky Stick", points: 12, aliases: ["same stick", "stick"] },
        { text: "Last Off Ice", points: 8, aliases: ["last on ice", "first off", "first on"] },
      ],
    },
    {
      text: "Name a drink associated with hockey fans",
      answers: [
        { text: "Beer", points: 44, aliases: ["beers", "brew", "brews"] },
        { text: "Whiskey", points: 22, aliases: ["whisky", "bourbon", "rye"] },
        { text: "Coffee", points: 16, aliases: ["tim hortons", "tims", "double double"] },
        { text: "Hot Chocolate", points: 10, aliases: ["cocoa", "hot cocoa"] },
        { text: "Molson", points: 8, aliases: ["molson canadian", "canadian"] },
      ],
    },
    {
      text: "Name a reason for an icing call",
      answers: [
        { text: "Clearing the Zone", points: 40, aliases: ["clearing", "dump out", "clear"] },
        { text: "Desperation", points: 24, aliases: ["desperate", "under pressure"] },
        { text: "Bad Pass", points: 18, aliases: ["errant pass", "missed pass"] },
        { text: "Line Change", points: 12, aliases: ["changing lines", "change"] },
        { text: "Mistake", points: 6, aliases: ["error", "turnover"] },
      ],
    },
  ],

  // Day 9
  [
    {
      text: "Name a famous NHL captain",
      answers: [
        { text: "Sidney Crosby", points: 36, aliases: ["crosby", "sid", "sid the kid"] },
        { text: "Steve Yzerman", points: 24, aliases: ["yzerman", "stevie y"] },
        { text: "Mark Messier", points: 18, aliases: ["messier", "the moose"] },
        { text: "Connor McDavid", points: 14, aliases: ["mcdavid"] },
        { text: "Jonathan Toews", points: 8, aliases: ["toews", "captain serious"] },
      ],
    },
    {
      text: "Name a penalty that results in a penalty shot",
      answers: [
        { text: "Tripping on Breakaway", points: 38, aliases: ["trip breakaway", "tripping", "trip"] },
        { text: "Covering Puck in Crease", points: 24, aliases: ["covering puck", "hand on puck", "closing hand"] },
        { text: "Hooking on Breakaway", points: 18, aliases: ["hook breakaway", "hooking"] },
        { text: "Slash on Breakaway", points: 12, aliases: ["slashing breakaway", "slash"] },
        { text: "Net Off Deliberately", points: 8, aliases: ["dislodging net", "net off", "pulling net"] },
      ],
    },
    {
      text: "Name a famous NHL moment",
      answers: [
        { text: "Miracle on Ice", points: 40, aliases: ["miracle", "1980 usa", "usa 1980"] },
        { text: "Gretzky Trade", points: 22, aliases: ["gretzky traded", "the trade"] },
        { text: "Bobby Orr Flying Goal", points: 18, aliases: ["orr goal", "the goal", "orr flying"] },
        { text: "Crosby Golden Goal", points: 12, aliases: ["golden goal", "2010 olympics", "crosby goal"] },
        { text: "Henderson Goal", points: 8, aliases: ["paul henderson", "1972 summit", "summit series"] },
      ],
    },
    {
      text: "Name a type of save a goalie makes",
      answers: [
        { text: "Glove Save", points: 38, aliases: ["glove", "catch", "glove hand"] },
        { text: "Pad Save", points: 26, aliases: ["leg save", "pad", "leg pad"] },
        { text: "Blocker Save", points: 18, aliases: ["blocker"] },
        { text: "Poke Check", points: 10, aliases: ["poke", "stick save"] },
        { text: "Stacked Pads", points: 8, aliases: ["stack the pads", "butterfly"] },
      ],
    },
    {
      text: "Name a famous NHL arena",
      answers: [
        { text: "Madison Square Garden", points: 38, aliases: ["msg", "the garden"] },
        { text: "Bell Centre", points: 24, aliases: ["bell center", "the bell centre"] },
        { text: "Scotiabank Arena", points: 18, aliases: ["scotiabank", "acc", "air canada centre"] },
        { text: "United Center", points: 12, aliases: ["united centre", "the madhouse"] },
        { text: "TD Garden", points: 8, aliases: ["td", "boston garden"] },
      ],
    },
  ],

  // Day 10
  [
    {
      text: "Name an NHL team that relocated",
      answers: [
        { text: "Thrashers", points: 36, aliases: ["atlanta", "atlanta thrashers", "jets"] },
        { text: "Nordiques", points: 24, aliases: ["quebec", "quebec nordiques"] },
        { text: "Whalers", points: 18, aliases: ["hartford", "hartford whalers"] },
        { text: "North Stars", points: 14, aliases: ["minnesota north stars"] },
        { text: "Scouts", points: 8, aliases: ["kansas city", "kansas city scouts"] },
      ],
    },
    {
      text: "Name a famous Conn Smythe winner",
      answers: [
        { text: "Sidney Crosby", points: 36, aliases: ["crosby", "sid"] },
        { text: "Patrick Roy", points: 24, aliases: ["roy"] },
        { text: "Mario Lemieux", points: 18, aliases: ["lemieux", "mario", "super mario"] },
        { text: "Jonathan Toews", points: 14, aliases: ["toews"] },
        { text: "Wayne Gretzky", points: 8, aliases: ["gretzky"] },
      ],
    },
    {
      text: "Name a type of hockey pass",
      answers: [
        { text: "Saucer Pass", points: 36, aliases: ["saucer", "sauce"] },
        { text: "Drop Pass", points: 26, aliases: ["drop"] },
        { text: "Cross-Ice Pass", points: 18, aliases: ["cross ice", "cross-ice"] },
        { text: "Bank Pass", points: 12, aliases: ["bank", "off the boards"] },
        { text: "No-Look Pass", points: 8, aliases: ["no look", "blind pass"] },
      ],
    },
    {
      text: "Name an NHL team from the Central Division",
      answers: [
        { text: "Avalanche", points: 34, aliases: ["colorado", "avs", "colorado avalanche"] },
        { text: "Stars", points: 24, aliases: ["dallas", "dallas stars"] },
        { text: "Jets", points: 20, aliases: ["winnipeg", "winnipeg jets"] },
        { text: "Predators", points: 14, aliases: ["nashville", "preds", "nashville predators"] },
        { text: "Wild", points: 8, aliases: ["minnesota", "minnesota wild"] },
      ],
    },
    {
      text: "Name something a zamboni does",
      answers: [
        { text: "Resurfaces Ice", points: 42, aliases: ["smooth ice", "fix ice", "clean ice", "resurface"] },
        { text: "Scrapes Ice", points: 24, aliases: ["scrape", "shave ice"] },
        { text: "Lays Water", points: 16, aliases: ["water", "flood", "floods ice"] },
        { text: "Collects Snow", points: 12, aliases: ["picks up snow", "snow"] },
        { text: "Drives Around", points: 6, aliases: ["circles", "drives"] },
      ],
    },
  ],

  // Day 11
  [
    {
      text: "Name a famous NHL goal celebration",
      answers: [
        { text: "Fist Pump", points: 36, aliases: ["fist", "pump", "pumping fist"] },
        { text: "Knee Slide", points: 26, aliases: ["slide", "sliding"] },
        { text: "Jumping Into Glass", points: 18, aliases: ["glass jump", "into glass", "boards"] },
        { text: "Stick Salute", points: 12, aliases: ["stick raise", "raise stick"] },
        { text: "Bow and Arrow", points: 8, aliases: ["archer", "ovechkin", "ovi"] },
      ],
    },
    {
      text: "Name a hockey league besides the NHL",
      answers: [
        { text: "AHL", points: 36, aliases: ["american hockey league"] },
        { text: "KHL", points: 24, aliases: ["kontinental hockey league"] },
        { text: "OHL", points: 18, aliases: ["ontario hockey league"] },
        { text: "SHL", points: 14, aliases: ["swedish hockey league"] },
        { text: "ECHL", points: 8, aliases: ["east coast hockey league"] },
      ],
    },
    {
      text: "Name a color commonly used on NHL jerseys",
      answers: [
        { text: "Red", points: 36, aliases: ["reds"] },
        { text: "Blue", points: 28, aliases: ["blues"] },
        { text: "Black", points: 18, aliases: ["blacks"] },
        { text: "White", points: 12, aliases: ["whites"] },
        { text: "Gold", points: 6, aliases: ["yellow", "golds"] },
      ],
    },
    {
      text: "Name a famous NHL center",
      answers: [
        { text: "Wayne Gretzky", points: 38, aliases: ["gretzky", "the great one", "99"] },
        { text: "Sidney Crosby", points: 26, aliases: ["crosby", "sid", "sid the kid"] },
        { text: "Connor McDavid", points: 18, aliases: ["mcdavid"] },
        { text: "Mario Lemieux", points: 12, aliases: ["lemieux", "super mario"] },
        { text: "Mark Messier", points: 6, aliases: ["messier"] },
      ],
    },
    {
      text: "Name a hockey broadcast phrase",
      answers: [
        { text: "He Scores", points: 38, aliases: ["scores", "he shoots he scores"] },
        { text: "Save", points: 24, aliases: ["great save", "what a save"] },
        { text: "Icing", points: 18, aliases: ["icing the puck", "icing call"] },
        { text: "Top Shelf", points: 12, aliases: ["top corner", "upper corner"] },
        { text: "Hat Trick", points: 8, aliases: ["hats on the ice"] },
      ],
    },
  ],

  // Day 12
  [
    {
      text: "Name a famous NHL Russian player",
      answers: [
        { text: "Alex Ovechkin", points: 40, aliases: ["ovechkin", "ovi", "the great 8"] },
        { text: "Pavel Bure", points: 22, aliases: ["bure", "russian rocket"] },
        { text: "Evgeni Malkin", points: 18, aliases: ["malkin", "geno"] },
        { text: "Sergei Fedorov", points: 12, aliases: ["fedorov"] },
        { text: "Andrei Vasilevskiy", points: 8, aliases: ["vasilevskiy", "vasy"] },
      ],
    },
    {
      text: "Name something on a hockey scoreboard",
      answers: [
        { text: "Score", points: 36, aliases: ["goals", "points"] },
        { text: "Time", points: 26, aliases: ["clock", "game clock", "period time"] },
        { text: "Period", points: 18, aliases: ["periods", "1st 2nd 3rd"] },
        { text: "Penalties", points: 12, aliases: ["penalty", "penalty time"] },
        { text: "Shots", points: 8, aliases: ["shots on goal", "sog"] },
      ],
    },
    {
      text: "Name an NHL team with 'City' or 'State' in its full name",
      answers: [
        { text: "New York Rangers", points: 34, aliases: ["rangers", "nyr"] },
        { text: "New York Islanders", points: 24, aliases: ["islanders", "nyi", "isles"] },
        { text: "New Jersey Devils", points: 20, aliases: ["devils", "jersey", "nj"] },
        { text: "Carolina Hurricanes", points: 14, aliases: ["hurricanes", "canes", "carolina"] },
        { text: "Colorado Avalanche", points: 8, aliases: ["avalanche", "avs", "colorado"] },
      ],
    },
    {
      text: "Name something found at center ice",
      answers: [
        { text: "Team Logo", points: 40, aliases: ["logo", "crest"] },
        { text: "Red Line", points: 24, aliases: ["center line", "centre line"] },
        { text: "Face-off Dot", points: 18, aliases: ["dot", "faceoff dot", "center dot"] },
        { text: "Circle", points: 12, aliases: ["center circle", "centre circle", "face-off circle"] },
        { text: "Advertisements", points: 6, aliases: ["ads", "sponsor", "sponsors"] },
      ],
    },
    {
      text: "Name a famous Swedish NHL player",
      answers: [
        { text: "Henrik Lundqvist", points: 34, aliases: ["lundqvist", "hank", "king henrik"] },
        { text: "Nicklas Lidstrom", points: 26, aliases: ["lidstrom"] },
        { text: "Peter Forsberg", points: 18, aliases: ["forsberg", "foppa"] },
        { text: "Daniel Sedin", points: 14, aliases: ["sedin", "sedins", "henrik sedin"] },
        { text: "Mats Sundin", points: 8, aliases: ["sundin"] },
      ],
    },
  ],

  // Day 13
  [
    {
      text: "Name a famous NHL playoff beard",
      answers: [
        { text: "Brent Burns", points: 36, aliases: ["burns"] },
        { text: "Joe Thornton", points: 24, aliases: ["thornton", "jumbo joe", "jumbo"] },
        { text: "Zdeno Chara", points: 18, aliases: ["chara"] },
        { text: "George Parros", points: 14, aliases: ["parros"] },
        { text: "Patrick Kane", points: 8, aliases: ["kane", "kaner"] },
      ],
    },
    {
      text: "Name something a hockey ref signals",
      answers: [
        { text: "Penalty", points: 38, aliases: ["arm up", "whistle"] },
        { text: "Goal", points: 26, aliases: ["point to net", "good goal"] },
        { text: "Offside", points: 18, aliases: ["offsides"] },
        { text: "Icing", points: 12, aliases: ["icing call"] },
        { text: "No Goal", points: 6, aliases: ["wave off", "waved off"] },
      ],
    },
    {
      text: "Name an NHL team from the Atlantic Division",
      answers: [
        { text: "Maple Leafs", points: 34, aliases: ["toronto", "leafs", "toronto maple leafs"] },
        { text: "Bruins", points: 24, aliases: ["boston", "boston bruins"] },
        { text: "Lightning", points: 18, aliases: ["tampa", "tampa bay", "bolts", "tampa bay lightning"] },
        { text: "Panthers", points: 14, aliases: ["florida", "florida panthers"] },
        { text: "Canadiens", points: 10, aliases: ["montreal", "habs", "montreal canadiens"] },
      ],
    },
    {
      text: "Name a hockey skill competition event",
      answers: [
        { text: "Hardest Shot", points: 38, aliases: ["fastest shot", "slap shot contest"] },
        { text: "Fastest Skater", points: 26, aliases: ["speed", "skating race"] },
        { text: "Accuracy Shooting", points: 18, aliases: ["accuracy", "target shooting"] },
        { text: "Shootout", points: 10, aliases: ["breakaway challenge"] },
        { text: "Puck Control", points: 8, aliases: ["obstacle course", "puck handling"] },
      ],
    },
    {
      text: "Name a famous NHL number besides 99",
      answers: [
        { text: "66", points: 38, aliases: ["sixty six", "lemieux"] },
        { text: "87", points: 24, aliases: ["eighty seven", "crosby"] },
        { text: "9", points: 18, aliases: ["nine", "gordie howe", "howe"] },
        { text: "4", points: 12, aliases: ["four", "bobby orr", "orr"] },
        { text: "33", points: 8, aliases: ["thirty three", "patrick roy", "roy"] },
      ],
    },
  ],

  // Day 14
  [
    {
      text: "Name a famous NHL Finnish player",
      answers: [
        { text: "Teemu Selanne", points: 38, aliases: ["selanne", "finnish flash"] },
        { text: "Jari Kurri", points: 24, aliases: ["kurri"] },
        { text: "Mikko Rantanen", points: 16, aliases: ["rantanen"] },
        { text: "Aleksander Barkov", points: 12, aliases: ["barkov", "sasha"] },
        { text: "Tuukka Rask", points: 10, aliases: ["rask"] },
      ],
    },
    {
      text: "Name a penalty box duration in minutes",
      answers: [
        { text: "2 Minutes", points: 44, aliases: ["2", "two", "minor"] },
        { text: "5 Minutes", points: 24, aliases: ["5", "five", "major"] },
        { text: "10 Minutes", points: 16, aliases: ["10", "ten", "misconduct"] },
        { text: "4 Minutes", points: 10, aliases: ["4", "four", "double minor"] },
        { text: "Game Misconduct", points: 6, aliases: ["ejection", "game", "kicked out"] },
      ],
    },
    {
      text: "Name an NHL team that plays outdoors at the Winter Classic",
      answers: [
        { text: "Blackhawks", points: 34, aliases: ["chicago", "hawks", "chicago blackhawks"] },
        { text: "Red Wings", points: 24, aliases: ["detroit", "detroit red wings"] },
        { text: "Bruins", points: 18, aliases: ["boston", "boston bruins"] },
        { text: "Penguins", points: 14, aliases: ["pittsburgh", "pens"] },
        { text: "Rangers", points: 10, aliases: ["new york", "nyr", "new york rangers"] },
      ],
    },
    {
      text: "Name a term for scoring in hockey",
      answers: [
        { text: "Goal", points: 38, aliases: ["goals", "score"] },
        { text: "Snipe", points: 24, aliases: ["sniper", "sniped"] },
        { text: "Tally", points: 16, aliases: ["tallied"] },
        { text: "Light the Lamp", points: 14, aliases: ["lamp", "lit the lamp"] },
        { text: "Bar Down", points: 8, aliases: ["bardown", "bar downski", "biscuit top shelf"] },
      ],
    },
    {
      text: "Name an NHL arena food city is known for",
      answers: [
        { text: "Philly Cheesesteak", points: 36, aliases: ["cheesesteak", "philly steak"] },
        { text: "Poutine", points: 26, aliases: ["montreal poutine", "fries and gravy"] },
        { text: "Deep Dish Pizza", points: 18, aliases: ["chicago pizza", "deep dish"] },
        { text: "Perogies", points: 12, aliases: ["pierogies", "pittsburgh perogies", "pierogi"] },
        { text: "Lobster Roll", points: 8, aliases: ["lobster", "boston lobster"] },
      ],
    },
  ],

  // Day 15
  [
    {
      text: "Name a famous NHL coach",
      answers: [
        { text: "Scotty Bowman", points: 38, aliases: ["bowman"] },
        { text: "Mike Babcock", points: 22, aliases: ["babcock"] },
        { text: "Joel Quenneville", points: 18, aliases: ["quenneville", "coach q"] },
        { text: "Pat Burns", points: 14, aliases: ["burns"] },
        { text: "Jon Cooper", points: 8, aliases: ["cooper"] },
      ],
    },
    {
      text: "Name an NHL team with a weather-related name",
      answers: [
        { text: "Lightning", points: 36, aliases: ["tampa", "tampa bay", "bolts", "tampa bay lightning"] },
        { text: "Avalanche", points: 26, aliases: ["colorado", "avs", "colorado avalanche"] },
        { text: "Hurricanes", points: 20, aliases: ["carolina", "canes", "carolina hurricanes"] },
        { text: "Flames", points: 12, aliases: ["calgary", "calgary flames"] },
        { text: "Thunder", points: 6, aliases: ["thunderbolts"] },
      ],
    },
    {
      text: "Name something fans chant at a hockey game",
      answers: [
        { text: "Go Team Go", points: 36, aliases: ["lets go", "go go go"] },
        { text: "Defense", points: 24, aliases: ["dee-fense", "d-fense"] },
        { text: "Ref You Suck", points: 20, aliases: ["ref sucks", "you suck ref"] },
        { text: "Goalie Name", points: 12, aliases: ["goalie chant", "name chant"] },
        { text: "Ole Ole Ole", points: 8, aliases: ["ole", "olé"] },
      ],
    },
    {
      text: "Name a type of faceoff location",
      answers: [
        { text: "Center Ice", points: 40, aliases: ["center", "centre ice", "centre"] },
        { text: "Defensive Zone", points: 24, aliases: ["own zone", "d zone"] },
        { text: "Offensive Zone", points: 18, aliases: ["attacking zone", "o zone"] },
        { text: "Neutral Zone", points: 12, aliases: ["neutral", "between blue lines"] },
        { text: "End Zone Dot", points: 6, aliases: ["end zone", "circle dot"] },
      ],
    },
    {
      text: "Name a famous NHL hat trick scorer",
      answers: [
        { text: "Wayne Gretzky", points: 36, aliases: ["gretzky", "the great one"] },
        { text: "Alex Ovechkin", points: 26, aliases: ["ovechkin", "ovi"] },
        { text: "Mario Lemieux", points: 18, aliases: ["lemieux", "super mario"] },
        { text: "Mike Bossy", points: 12, aliases: ["bossy"] },
        { text: "Brett Hull", points: 8, aliases: ["hull", "the golden brett"] },
      ],
    },
  ],

  // Day 16
  [
    {
      text: "Name an NHL team that had a dynasty era",
      answers: [
        { text: "Canadiens", points: 36, aliases: ["montreal", "habs"] },
        { text: "Oilers", points: 26, aliases: ["edmonton", "80s oilers"] },
        { text: "Islanders", points: 18, aliases: ["new york islanders", "isles"] },
        { text: "Red Wings", points: 12, aliases: ["detroit", "90s red wings"] },
        { text: "Blackhawks", points: 8, aliases: ["chicago", "2010s hawks"] },
      ],
    },
    {
      text: "Name a famous NHL winger",
      answers: [
        { text: "Alex Ovechkin", points: 36, aliases: ["ovechkin", "ovi"] },
        { text: "Gordie Howe", points: 24, aliases: ["howe", "mr hockey"] },
        { text: "Maurice Richard", points: 18, aliases: ["richard", "rocket richard", "the rocket"] },
        { text: "Jaromir Jagr", points: 14, aliases: ["jagr"] },
        { text: "Guy Lafleur", points: 8, aliases: ["lafleur", "the flower"] },
      ],
    },
    {
      text: "Name something on a hockey jersey",
      answers: [
        { text: "Number", points: 36, aliases: ["jersey number", "numbers"] },
        { text: "Team Logo", points: 26, aliases: ["logo", "crest"] },
        { text: "Name", points: 18, aliases: ["last name", "player name", "nameplate"] },
        { text: "Captain C", points: 12, aliases: ["c", "captain letter", "a", "alternate"] },
        { text: "Sponsor Patch", points: 8, aliases: ["patch", "ad", "advertisement", "sponsor"] },
      ],
    },
    {
      text: "Name a Florida-based NHL team",
      answers: [
        { text: "Panthers", points: 40, aliases: ["florida", "florida panthers"] },
        { text: "Lightning", points: 36, aliases: ["tampa", "tampa bay", "bolts"] },
        { text: "Thrashers", points: 12, aliases: ["atlanta"] },
        { text: "Sun Bears", points: 6, aliases: [] },
        { text: "Everblades", points: 6, aliases: ["florida everblades", "echl"] },
      ],
    },
    {
      text: "Name an NHL stat category",
      answers: [
        { text: "Goals", points: 36, aliases: ["goal", "g"] },
        { text: "Assists", points: 26, aliases: ["assist", "a", "apples"] },
        { text: "Points", points: 18, aliases: ["point", "pts", "p"] },
        { text: "Plus/Minus", points: 12, aliases: ["+/-", "plus minus"] },
        { text: "Penalty Minutes", points: 8, aliases: ["pim", "pims", "penalty mins"] },
      ],
    },
  ],

  // Day 17
  [
    {
      text: "Name a famous NHL trade",
      answers: [
        { text: "Gretzky to LA", points: 44, aliases: ["gretzky trade", "gretzky kings", "wayne to la"] },
        { text: "Lindros to Philly", points: 22, aliases: ["lindros trade", "eric lindros"] },
        { text: "Roy to Colorado", points: 16, aliases: ["patrick roy trade", "roy trade"] },
        { text: "Weber-Subban", points: 10, aliases: ["subban weber", "subban trade", "weber trade"] },
        { text: "Pronger Trade", points: 8, aliases: ["chris pronger"] },
      ],
    },
    {
      text: "Name something a hockey player puts on before a game",
      answers: [
        { text: "Skates", points: 36, aliases: ["skate"] },
        { text: "Helmet", points: 24, aliases: ["bucket", "lid"] },
        { text: "Pads", points: 18, aliases: ["shin pads", "shoulder pads", "elbow pads"] },
        { text: "Gloves", points: 14, aliases: ["glove", "mitts"] },
        { text: "Jersey", points: 8, aliases: ["sweater"] },
      ],
    },
    {
      text: "Name a reason for a power play",
      answers: [
        { text: "Tripping", points: 34, aliases: ["trip"] },
        { text: "Hooking", points: 26, aliases: ["hook"] },
        { text: "Slashing", points: 18, aliases: ["slash"] },
        { text: "Cross-Checking", points: 14, aliases: ["crosscheck", "cross check", "crosschecking"] },
        { text: "Holding", points: 8, aliases: ["hold"] },
      ],
    },
    {
      text: "Name a famous NHL draft pick number 1 overall",
      answers: [
        { text: "Connor McDavid", points: 36, aliases: ["mcdavid"] },
        { text: "Sidney Crosby", points: 28, aliases: ["crosby", "sid"] },
        { text: "Alex Ovechkin", points: 18, aliases: ["ovechkin", "ovi"] },
        { text: "Patrick Kane", points: 10, aliases: ["kane", "kaner"] },
        { text: "Mario Lemieux", points: 8, aliases: ["lemieux", "super mario"] },
      ],
    },
    {
      text: "Name an NHL All-Star Game event",
      answers: [
        { text: "Skills Competition", points: 36, aliases: ["skills", "skills comp"] },
        { text: "Hardest Shot", points: 26, aliases: ["fastest shot"] },
        { text: "Fastest Skater", points: 18, aliases: ["speed skating", "skating"] },
        { text: "3-on-3 Tournament", points: 12, aliases: ["3 on 3", "tournament", "mini games"] },
        { text: "Accuracy Shooting", points: 8, aliases: ["accuracy", "targets"] },
      ],
    },
  ],

  // Day 18
  [
    {
      text: "Name a famous NHL fight",
      answers: [
        { text: "Probert vs Domi", points: 36, aliases: ["domi probert", "bob probert tie domi"] },
        { text: "Roy vs Vernon", points: 24, aliases: ["vernon roy", "goalie fight"] },
        { text: "McSorley vs Probert", points: 18, aliases: ["probert mcsorley", "marty mcsorley"] },
        { text: "Lucic vs Komisarek", points: 12, aliases: ["komisarek lucic"] },
        { text: "Cloutier vs Salo", points: 10, aliases: ["dan cloutier"] },
      ],
    },
    {
      text: "Name an NHL team that plays at altitude",
      answers: [
        { text: "Avalanche", points: 52, aliases: ["colorado", "avs", "colorado avalanche"] },
        { text: "Coyotes", points: 20, aliases: ["arizona", "arizona coyotes"] },
        { text: "Stars", points: 12, aliases: ["dallas", "dallas stars"] },
        { text: "Predators", points: 10, aliases: ["nashville", "preds"] },
        { text: "Blues", points: 6, aliases: ["st louis", "saint louis"] },
      ],
    },
    {
      text: "Name a famous hockey family",
      answers: [
        { text: "Gretzky", points: 36, aliases: ["gretzkys", "wayne gretzky"] },
        { text: "Howe", points: 24, aliases: ["howes", "gordie howe"] },
        { text: "Sutter", points: 18, aliases: ["sutters", "sutter brothers"] },
        { text: "Hull", points: 14, aliases: ["hulls", "bobby hull", "brett hull"] },
        { text: "Staal", points: 8, aliases: ["staals", "staal brothers"] },
      ],
    },
    {
      text: "Name a hockey stick brand",
      answers: [
        { text: "Bauer", points: 38, aliases: ["bauer hockey"] },
        { text: "CCM", points: 28, aliases: ["ccm hockey"] },
        { text: "Warrior", points: 16, aliases: ["warrior hockey"] },
        { text: "Easton", points: 10, aliases: ["easton hockey"] },
        { text: "True", points: 8, aliases: ["true hockey", "true temper"] },
      ],
    },
    {
      text: "Name a way to describe a hard check",
      answers: [
        { text: "Crushing", points: 36, aliases: ["crush", "crushed"] },
        { text: "Bone-Rattling", points: 24, aliases: ["bone rattling", "rattled"] },
        { text: "Devastating", points: 18, aliases: ["devastating hit"] },
        { text: "Thunderous", points: 14, aliases: ["thunder"] },
        { text: "Punishing", points: 8, aliases: ["punishment", "punished"] },
      ],
    },
  ],

  // Day 19
  [
    {
      text: "Name a famous NHL team captain from the 2010s",
      answers: [
        { text: "Sidney Crosby", points: 36, aliases: ["crosby", "sid"] },
        { text: "Jonathan Toews", points: 24, aliases: ["toews", "captain serious"] },
        { text: "Steven Stamkos", points: 18, aliases: ["stamkos", "stammer"] },
        { text: "Alex Ovechkin", points: 14, aliases: ["ovechkin", "ovi"] },
        { text: "Jamie Benn", points: 8, aliases: ["benn"] },
      ],
    },
    {
      text: "Name a reason fans buy a hockey jersey",
      answers: [
        { text: "Favorite Player", points: 40, aliases: ["player name", "player", "star player"] },
        { text: "Team Pride", points: 24, aliases: ["support team", "team fan", "rep team"] },
        { text: "Cool Design", points: 16, aliases: ["looks good", "design", "style"] },
        { text: "Gift", points: 12, aliases: ["present", "birthday"] },
        { text: "Game Day", points: 8, aliases: ["wear to game", "arena", "attending game"] },
      ],
    },
    {
      text: "Name an NHL team named after a person or people",
      answers: [
        { text: "Canadiens", points: 36, aliases: ["montreal", "habs"] },
        { text: "Senators", points: 24, aliases: ["ottawa", "sens", "ottawa senators"] },
        { text: "Rangers", points: 18, aliases: ["new york rangers", "nyr"] },
        { text: "Islanders", points: 14, aliases: ["new york islanders", "isles"] },
        { text: "Canucks", points: 8, aliases: ["vancouver", "vancouver canucks"] },
      ],
    },
    {
      text: "Name a famous NHL playoff overtime hero",
      answers: [
        { text: "Bobby Orr", points: 36, aliases: ["orr"] },
        { text: "Patrick Kane", points: 24, aliases: ["kane", "kaner"] },
        { text: "Alec Martinez", points: 16, aliases: ["martinez"] },
        { text: "Brett Hull", points: 14, aliases: ["hull"] },
        { text: "Brent May", points: 10, aliases: ["brad may", "may day"] },
      ],
    },
    {
      text: "Name a hockey rink zone",
      answers: [
        { text: "Offensive Zone", points: 34, aliases: ["o zone", "attacking zone", "attack zone"] },
        { text: "Defensive Zone", points: 28, aliases: ["d zone", "own zone"] },
        { text: "Neutral Zone", points: 22, aliases: ["neutral", "center ice area"] },
        { text: "Crease", points: 10, aliases: ["goalie crease", "blue paint"] },
        { text: "Slot", points: 6, aliases: ["the slot", "high slot"] },
      ],
    },
  ],

  // Day 20
  [
    {
      text: "Name a famous retired NHL jersey number",
      answers: [
        { text: "99 Gretzky", points: 44, aliases: ["99", "gretzky", "wayne gretzky"] },
        { text: "66 Lemieux", points: 22, aliases: ["66", "lemieux", "mario lemieux"] },
        { text: "4 Orr", points: 16, aliases: ["4", "orr", "bobby orr"] },
        { text: "9 Howe", points: 10, aliases: ["9", "howe", "gordie howe"] },
        { text: "33 Roy", points: 8, aliases: ["33", "roy", "patrick roy"] },
      ],
    },
    {
      text: "Name a hockey intermission activity",
      answers: [
        { text: "Zamboni", points: 38, aliases: ["ice resurfacing", "resurface"] },
        { text: "Get Food", points: 24, aliases: ["food", "concessions", "eat"] },
        { text: "Bathroom", points: 18, aliases: ["restroom", "washroom"] },
        { text: "Highlights", points: 12, aliases: ["replays", "watch replays"] },
        { text: "Fan Contest", points: 8, aliases: ["contest", "chuck a puck", "t-shirt toss"] },
      ],
    },
    {
      text: "Name an NHL team from the Metropolitan Division",
      answers: [
        { text: "Rangers", points: 34, aliases: ["new york", "nyr", "new york rangers"] },
        { text: "Penguins", points: 24, aliases: ["pittsburgh", "pens"] },
        { text: "Capitals", points: 18, aliases: ["washington", "caps", "washington capitals"] },
        { text: "Devils", points: 14, aliases: ["new jersey", "nj", "new jersey devils"] },
        { text: "Hurricanes", points: 10, aliases: ["carolina", "canes"] },
      ],
    },
    {
      text: "Name a famous Gordie Howe stat line component",
      answers: [
        { text: "Goal", points: 38, aliases: ["goals", "score"] },
        { text: "Assist", points: 28, aliases: ["assists", "helper"] },
        { text: "Fight", points: 22, aliases: ["fighting", "fights", "scrap"] },
        { text: "Hit", points: 8, aliases: ["hits", "check"] },
        { text: "Penalty", points: 4, aliases: ["penalties", "pim"] },
      ],
    },
    {
      text: "Name a hockey-playing US state",
      answers: [
        { text: "Minnesota", points: 38, aliases: ["mn", "state of hockey"] },
        { text: "Michigan", points: 24, aliases: ["mi"] },
        { text: "Massachusetts", points: 18, aliases: ["mass", "ma", "boston"] },
        { text: "New York", points: 12, aliases: ["ny"] },
        { text: "Wisconsin", points: 8, aliases: ["wi"] },
      ],
    },
  ],

  // Day 21
  [
    {
      text: "Name a famous NHL goalie mask",
      answers: [
        { text: "Gerry Cheevers", points: 36, aliases: ["cheevers", "stitch mask", "stitches"] },
        { text: "Ken Dryden", points: 24, aliases: ["dryden"] },
        { text: "Ed Belfour", points: 18, aliases: ["belfour", "eagle"] },
        { text: "Curtis Joseph", points: 14, aliases: ["cujo", "joseph"] },
        { text: "Carey Price", points: 8, aliases: ["price"] },
      ],
    },
    {
      text: "Name an NHL outdoor game event",
      answers: [
        { text: "Winter Classic", points: 42, aliases: ["classic"] },
        { text: "Stadium Series", points: 24, aliases: ["stadium"] },
        { text: "Heritage Classic", points: 16, aliases: ["heritage"] },
        { text: "Global Series", points: 10, aliases: ["overseas game", "europe game"] },
        { text: "Centennial Classic", points: 8, aliases: ["centennial"] },
      ],
    },
    {
      text: "Name something that happens during a bench-clearing brawl",
      answers: [
        { text: "Fighting", points: 40, aliases: ["fights", "punches", "fists"] },
        { text: "Ejections", points: 24, aliases: ["ejected", "thrown out", "kicked out"] },
        { text: "Penalties", points: 18, aliases: ["penalty", "penalty minutes"] },
        { text: "Suspensions", points: 12, aliases: ["suspended", "suspension"] },
        { text: "Fines", points: 6, aliases: ["fine", "fined"] },
      ],
    },
    {
      text: "Name a famous Montreal Canadiens player",
      answers: [
        { text: "Maurice Richard", points: 34, aliases: ["richard", "rocket richard", "the rocket"] },
        { text: "Jean Beliveau", points: 24, aliases: ["beliveau"] },
        { text: "Guy Lafleur", points: 18, aliases: ["lafleur", "the flower"] },
        { text: "Patrick Roy", points: 14, aliases: ["roy"] },
        { text: "Carey Price", points: 10, aliases: ["price"] },
      ],
    },
    {
      text: "Name a way the puck crosses the goal line",
      answers: [
        { text: "Shot", points: 38, aliases: ["shooting", "wrist shot", "slap shot"] },
        { text: "Deflection", points: 24, aliases: ["deflected", "tip", "redirect"] },
        { text: "Rebound", points: 18, aliases: ["rebounds", "rebound goal"] },
        { text: "Own Goal", points: 12, aliases: ["own net", "into own net", "self goal"] },
        { text: "Empty Net", points: 8, aliases: ["empty netter", "en"] },
      ],
    },
  ],

  // Day 22
  [
    {
      text: "Name a famous Toronto Maple Leafs player",
      answers: [
        { text: "Auston Matthews", points: 36, aliases: ["matthews", "auston", "papi"] },
        { text: "Mats Sundin", points: 22, aliases: ["sundin"] },
        { text: "Darryl Sittler", points: 18, aliases: ["sittler"] },
        { text: "Doug Gilmour", points: 14, aliases: ["gilmour", "killer"] },
        { text: "Borje Salming", points: 10, aliases: ["salming"] },
      ],
    },
    {
      text: "Name a reason a coach challenges a goal",
      answers: [
        { text: "Offside", points: 38, aliases: ["offsides", "off side"] },
        { text: "Goalie Interference", points: 28, aliases: ["goaltender interference"] },
        { text: "High Stick", points: 16, aliases: ["high sticking", "high-stick"] },
        { text: "Hand Pass", points: 10, aliases: ["handpass"] },
        { text: "Kicked In", points: 8, aliases: ["kick", "kicking motion"] },
      ],
    },
    {
      text: "Name a type of hockey league format",
      answers: [
        { text: "Regular Season", points: 38, aliases: ["season", "82 games"] },
        { text: "Playoffs", points: 28, aliases: ["postseason", "playoff"] },
        { text: "All-Star Game", points: 16, aliases: ["all star", "all-star"] },
        { text: "Preseason", points: 10, aliases: ["exhibition", "pre-season"] },
        { text: "Draft", points: 8, aliases: ["entry draft", "nhl draft"] },
      ],
    },
    {
      text: "Name an NHL team with a bird name",
      answers: [
        { text: "Penguins", points: 38, aliases: ["pittsburgh", "pens"] },
        { text: "Ducks", points: 26, aliases: ["anaheim", "anaheim ducks"] },
        { text: "Blackhawks", points: 18, aliases: ["chicago", "hawks"] },
        { text: "Thrashers", points: 10, aliases: ["atlanta"] },
        { text: "Canucks", points: 8, aliases: ["vancouver", "johnny canuck"] },
      ],
    },
    {
      text: "Name something about the Stanley Cup trophy",
      answers: [
        { text: "Names Engraved", points: 38, aliases: ["names", "engraved", "player names"] },
        { text: "Silver", points: 22, aliases: ["silver cup", "silver bowl"] },
        { text: "Oldest Trophy", points: 18, aliases: ["old", "oldest", "historic"] },
        { text: "Bands", points: 14, aliases: ["rings", "layers", "tiers"] },
        { text: "Heavy", points: 8, aliases: ["35 pounds", "weight"] },
      ],
    },
  ],

  // Day 23
  [
    {
      text: "Name a famous Boston Bruins player",
      answers: [
        { text: "Bobby Orr", points: 38, aliases: ["orr"] },
        { text: "Ray Bourque", points: 24, aliases: ["bourque"] },
        { text: "Patrice Bergeron", points: 18, aliases: ["bergeron", "bergy"] },
        { text: "Brad Marchand", points: 12, aliases: ["marchand", "marchy", "the rat"] },
        { text: "Cam Neely", points: 8, aliases: ["neely"] },
      ],
    },
    {
      text: "Name a hockey stoppage of play reason",
      answers: [
        { text: "Icing", points: 34, aliases: ["icing call"] },
        { text: "Offside", points: 26, aliases: ["offsides"] },
        { text: "Penalty", points: 20, aliases: ["foul", "infraction"] },
        { text: "Goal", points: 12, aliases: ["scored", "goal scored"] },
        { text: "Puck Out of Play", points: 8, aliases: ["puck over glass", "out of bounds", "dead puck"] },
      ],
    },
    {
      text: "Name an NHL team with a cat-related name",
      answers: [
        { text: "Panthers", points: 42, aliases: ["florida", "florida panthers"] },
        { text: "Wild", points: 24, aliases: ["minnesota", "wildcat"] },
        { text: "Predators", points: 18, aliases: ["nashville", "preds"] },
        { text: "Sabercats", points: 8, aliases: [] },
        { text: "Lynx", points: 8, aliases: [] },
      ],
    },
    {
      text: "Name a type of hockey formation",
      answers: [
        { text: "Power Play", points: 38, aliases: ["pp", "man advantage", "5 on 4"] },
        { text: "Penalty Kill", points: 26, aliases: ["pk", "shorthanded", "4 on 5"] },
        { text: "Even Strength", points: 18, aliases: ["5 on 5", "full strength"] },
        { text: "Empty Net", points: 10, aliases: ["6 on 5", "extra attacker"] },
        { text: "4 on 4", points: 8, aliases: ["four on four", "coincidental"] },
      ],
    },
    {
      text: "Name a famous Pittsburgh Penguins player",
      answers: [
        { text: "Sidney Crosby", points: 38, aliases: ["crosby", "sid", "sid the kid"] },
        { text: "Mario Lemieux", points: 28, aliases: ["lemieux", "super mario"] },
        { text: "Evgeni Malkin", points: 16, aliases: ["malkin", "geno"] },
        { text: "Jaromir Jagr", points: 12, aliases: ["jagr"] },
        { text: "Marc-Andre Fleury", points: 6, aliases: ["fleury", "flower", "maf"] },
      ],
    },
  ],

  // Day 24
  [
    {
      text: "Name a famous Edmonton Oilers player",
      answers: [
        { text: "Wayne Gretzky", points: 42, aliases: ["gretzky", "the great one"] },
        { text: "Connor McDavid", points: 24, aliases: ["mcdavid"] },
        { text: "Mark Messier", points: 16, aliases: ["messier", "the moose"] },
        { text: "Grant Fuhr", points: 10, aliases: ["fuhr"] },
        { text: "Leon Draisaitl", points: 8, aliases: ["draisaitl", "drai"] },
      ],
    },
    {
      text: "Name a hockey surface condition players complain about",
      answers: [
        { text: "Soft Ice", points: 36, aliases: ["melting", "slushy", "slush"] },
        { text: "Choppy Ice", points: 26, aliases: ["choppy", "rough ice", "bumpy"] },
        { text: "Snow", points: 18, aliases: ["snow buildup", "too much snow"] },
        { text: "Ruts", points: 12, aliases: ["grooves", "divots"] },
        { text: "Boards", points: 8, aliases: ["bad boards", "dead boards", "lively boards"] },
      ],
    },
    {
      text: "Name a famous NHL goal scorer of all time",
      answers: [
        { text: "Wayne Gretzky", points: 36, aliases: ["gretzky", "the great one"] },
        { text: "Alex Ovechkin", points: 26, aliases: ["ovechkin", "ovi"] },
        { text: "Gordie Howe", points: 18, aliases: ["howe", "mr hockey"] },
        { text: "Jaromir Jagr", points: 12, aliases: ["jagr"] },
        { text: "Brett Hull", points: 8, aliases: ["hull", "the golden brett"] },
      ],
    },
    {
      text: "Name a hockey broadcast network",
      answers: [
        { text: "ESPN", points: 36, aliases: ["espn+", "espn plus"] },
        { text: "TNT", points: 24, aliases: ["tnt sports", "tbs"] },
        { text: "TSN", points: 18, aliases: ["the sports network"] },
        { text: "Sportsnet", points: 14, aliases: ["sportsnet one", "sn"] },
        { text: "NBC", points: 8, aliases: ["nbcsn", "nbc sports"] },
      ],
    },
    {
      text: "Name a type of goalie style",
      answers: [
        { text: "Butterfly", points: 44, aliases: ["butterfly style"] },
        { text: "Hybrid", points: 22, aliases: ["hybrid style"] },
        { text: "Stand-Up", points: 16, aliases: ["standup", "stand up"] },
        { text: "Aggressive", points: 10, aliases: ["challenging", "playing out"] },
        { text: "Deep in Net", points: 8, aliases: ["deep", "playing deep"] },
      ],
    },
  ],

  // Day 25
  [
    {
      text: "Name a famous Detroit Red Wings player",
      answers: [
        { text: "Gordie Howe", points: 38, aliases: ["howe", "mr hockey"] },
        { text: "Steve Yzerman", points: 26, aliases: ["yzerman", "stevie y"] },
        { text: "Nicklas Lidstrom", points: 18, aliases: ["lidstrom"] },
        { text: "Pavel Datsyuk", points: 12, aliases: ["datsyuk", "the magic man"] },
        { text: "Ted Lindsay", points: 6, aliases: ["lindsay", "terrible ted"] },
      ],
    },
    {
      text: "Name something a hockey player tapes",
      answers: [
        { text: "Stick Blade", points: 38, aliases: ["blade", "stick", "stick blade"] },
        { text: "Stick Handle", points: 24, aliases: ["handle", "knob", "grip"] },
        { text: "Shin Pads", points: 18, aliases: ["socks", "shins", "shin guards"] },
        { text: "Wrists", points: 12, aliases: ["wrist"] },
        { text: "Ankles", points: 8, aliases: ["ankle"] },
      ],
    },
    {
      text: "Name a famous Chicago Blackhawks player",
      answers: [
        { text: "Patrick Kane", points: 34, aliases: ["kane", "kaner"] },
        { text: "Jonathan Toews", points: 26, aliases: ["toews", "captain serious"] },
        { text: "Bobby Hull", points: 18, aliases: ["hull", "golden jet"] },
        { text: "Stan Mikita", points: 14, aliases: ["mikita"] },
        { text: "Denis Savard", points: 8, aliases: ["savard"] },
      ],
    },
    {
      text: "Name a way to get a game misconduct",
      answers: [
        { text: "Fighting", points: 36, aliases: ["fight", "third man in"] },
        { text: "Instigating", points: 24, aliases: ["instigator", "starting fight"] },
        { text: "Abuse of Officials", points: 18, aliases: ["ref abuse", "yelling at ref"] },
        { text: "Spearing", points: 14, aliases: ["spear"] },
        { text: "Leaving Bench", points: 8, aliases: ["leaving the bench", "bench clearing"] },
      ],
    },
    {
      text: "Name a hockey term for a goal",
      answers: [
        { text: "Tally", points: 34, aliases: ["tallied"] },
        { text: "Snipe", points: 26, aliases: ["sniper", "sniped"] },
        { text: "Lamp Lighter", points: 18, aliases: ["light the lamp", "lit the lamp"] },
        { text: "Biscuit in Basket", points: 14, aliases: ["biscuit", "basket"] },
        { text: "Bar Down", points: 8, aliases: ["bardown", "bar downski"] },
      ],
    },
  ],

  // Day 26
  [
    {
      text: "Name a famous Colorado Avalanche player",
      answers: [
        { text: "Joe Sakic", points: 34, aliases: ["sakic", "burnaby joe"] },
        { text: "Peter Forsberg", points: 24, aliases: ["forsberg", "foppa"] },
        { text: "Patrick Roy", points: 18, aliases: ["roy"] },
        { text: "Nathan MacKinnon", points: 14, aliases: ["mackinnon", "nate", "nate mack"] },
        { text: "Rob Blake", points: 10, aliases: ["blake"] },
      ],
    },
    {
      text: "Name a reason a player gets suspended",
      answers: [
        { text: "Dirty Hit", points: 38, aliases: ["cheap shot", "illegal hit", "headshot"] },
        { text: "Fighting", points: 22, aliases: ["fight"] },
        { text: "Slew-Foot", points: 18, aliases: ["slew foot", "slewfoot"] },
        { text: "Spearing", points: 14, aliases: ["spear"] },
        { text: "Abuse of Official", points: 8, aliases: ["ref contact", "touching ref"] },
      ],
    },
    {
      text: "Name a type of NHL draft",
      answers: [
        { text: "Entry Draft", points: 42, aliases: ["nhl draft", "amateur draft", "draft"] },
        { text: "Expansion Draft", points: 26, aliases: ["expansion"] },
        { text: "Supplemental Draft", points: 14, aliases: ["supplemental"] },
        { text: "Fantasy Draft", points: 10, aliases: ["fantasy"] },
        { text: "Dispersal Draft", points: 8, aliases: ["dispersal"] },
      ],
    },
    {
      text: "Name a famous NHL broadcaster",
      answers: [
        { text: "Don Cherry", points: 38, aliases: ["cherry", "grapes"] },
        { text: "Bob Cole", points: 22, aliases: ["cole"] },
        { text: "Mike Emrick", points: 18, aliases: ["emrick", "doc emrick", "doc"] },
        { text: "Pierre McGuire", points: 14, aliases: ["mcguire", "pierre"] },
        { text: "Ron MacLean", points: 8, aliases: ["maclean"] },
      ],
    },
    {
      text: "Name a way a team builds through the draft",
      answers: [
        { text: "First Overall Pick", points: 38, aliases: ["first pick", "1st pick", "number 1"] },
        { text: "Trading Up", points: 24, aliases: ["trade up", "move up"] },
        { text: "Tanking", points: 18, aliases: ["tank", "lose on purpose"] },
        { text: "Late Round Steals", points: 12, aliases: ["late round", "steal", "sleeper"] },
        { text: "Lottery", points: 8, aliases: ["draft lottery", "lottery pick"] },
      ],
    },
  ],

  // Day 27
  [
    {
      text: "Name a famous Washington Capitals player",
      answers: [
        { text: "Alex Ovechkin", points: 44, aliases: ["ovechkin", "ovi", "the great 8"] },
        { text: "Nicklas Backstrom", points: 22, aliases: ["backstrom"] },
        { text: "Peter Bondra", points: 14, aliases: ["bondra"] },
        { text: "Rod Langway", points: 12, aliases: ["langway"] },
        { text: "Braden Holtby", points: 8, aliases: ["holtby"] },
      ],
    },
    {
      text: "Name a Canadian junior hockey league",
      answers: [
        { text: "OHL", points: 36, aliases: ["ontario hockey league"] },
        { text: "WHL", points: 26, aliases: ["western hockey league"] },
        { text: "QMJHL", points: 20, aliases: ["quebec major junior", "q league", "lhjmq"] },
        { text: "CHL", points: 10, aliases: ["canadian hockey league"] },
        { text: "USHL", points: 8, aliases: ["us hockey league"] },
      ],
    },
    {
      text: "Name a famous NHL playoff choke",
      answers: [
        { text: "Maple Leafs", points: 40, aliases: ["toronto", "leafs"] },
        { text: "Sharks", points: 22, aliases: ["san jose", "san jose sharks"] },
        { text: "Capitals", points: 18, aliases: ["washington", "caps"] },
        { text: "Canucks", points: 12, aliases: ["vancouver", "2011 canucks"] },
        { text: "Blues", points: 8, aliases: ["st louis", "saint louis"] },
      ],
    },
    {
      text: "Name a hockey playing surface type",
      answers: [
        { text: "Indoor Rink", points: 36, aliases: ["indoor", "arena", "rink"] },
        { text: "Outdoor Pond", points: 26, aliases: ["pond", "pond hockey", "frozen pond"] },
        { text: "Roller", points: 18, aliases: ["inline", "street", "roller hockey"] },
        { text: "Stadium", points: 12, aliases: ["outdoor stadium", "football stadium"] },
        { text: "Backyard Rink", points: 8, aliases: ["backyard", "home rink"] },
      ],
    },
    {
      text: "Name a common hockey nickname suffix",
      answers: [
        { text: "-ie / -y", points: 38, aliases: ["ie", "y", "adding y"] },
        { text: "-er", points: 24, aliases: ["er"] },
        { text: "-sy", points: 18, aliases: ["sy"] },
        { text: "-o", points: 12, aliases: ["o"] },
        { text: "First Initial + Last Name", points: 8, aliases: ["initial", "short form"] },
      ],
    },
  ],

  // Day 28
  [
    {
      text: "Name a famous Tampa Bay Lightning player",
      answers: [
        { text: "Steven Stamkos", points: 34, aliases: ["stamkos", "stammer"] },
        { text: "Nikita Kucherov", points: 24, aliases: ["kucherov", "kuch"] },
        { text: "Martin St. Louis", points: 18, aliases: ["st louis", "st. louis", "marty"] },
        { text: "Victor Hedman", points: 14, aliases: ["hedman"] },
        { text: "Andrei Vasilevskiy", points: 10, aliases: ["vasilevskiy", "vasy"] },
      ],
    },
    {
      text: "Name a playoff round in the NHL",
      answers: [
        { text: "Stanley Cup Final", points: 38, aliases: ["finals", "cup final", "championship"] },
        { text: "Conference Final", points: 26, aliases: ["conference finals", "semi final"] },
        { text: "Second Round", points: 16, aliases: ["round 2", "divisional"] },
        { text: "First Round", points: 14, aliases: ["round 1", "opening round"] },
        { text: "Play-In", points: 6, aliases: ["qualifying round", "play in", "bubble"] },
      ],
    },
    {
      text: "Name a hockey coach instruction",
      answers: [
        { text: "Shoot", points: 36, aliases: ["shoot the puck", "get shots"] },
        { text: "Dump It", points: 24, aliases: ["dump and chase", "dump in", "dump"] },
        { text: "Backcheck", points: 18, aliases: ["back check", "get back"] },
        { text: "Forecheck", points: 14, aliases: ["fore check", "pressure"] },
        { text: "Cycle", points: 8, aliases: ["cycle the puck", "work it low"] },
      ],
    },
    {
      text: "Name a famous NHL record holder",
      answers: [
        { text: "Wayne Gretzky", points: 44, aliases: ["gretzky", "the great one"] },
        { text: "Martin Brodeur", points: 22, aliases: ["brodeur"] },
        { text: "Alex Ovechkin", points: 16, aliases: ["ovechkin", "ovi"] },
        { text: "Gordie Howe", points: 10, aliases: ["howe"] },
        { text: "Patrick Roy", points: 8, aliases: ["roy"] },
      ],
    },
    {
      text: "Name a famous hockey announcer call",
      answers: [
        { text: "He Shoots He Scores", points: 40, aliases: ["shoots scores", "he scores"] },
        { text: "Save by Price", points: 20, aliases: ["save by", "what a save"] },
        { text: "Scooores", points: 18, aliases: ["scoore", "elongated score call"] },
        { text: "Do You Believe in Miracles", points: 14, aliases: ["miracles", "al michaels"] },
        { text: "Holy Cow", points: 8, aliases: ["holy mackinaw", "mackinaw"] },
      ],
    },
  ],

  // Day 29
  [
    {
      text: "Name a famous NHL player from the 1990s",
      answers: [
        { text: "Mario Lemieux", points: 34, aliases: ["lemieux", "super mario"] },
        { text: "Patrick Roy", points: 24, aliases: ["roy"] },
        { text: "Steve Yzerman", points: 18, aliases: ["yzerman", "stevie y"] },
        { text: "Mark Messier", points: 14, aliases: ["messier"] },
        { text: "Eric Lindros", points: 10, aliases: ["lindros", "the big e"] },
      ],
    },
    {
      text: "Name a hockey training exercise",
      answers: [
        { text: "Skating Drills", points: 38, aliases: ["skating", "laps", "sprints"] },
        { text: "Shooting Practice", points: 24, aliases: ["shooting", "target practice"] },
        { text: "Scrimmage", points: 18, aliases: ["game simulation", "practice game"] },
        { text: "Bag Skate", points: 12, aliases: ["conditioning", "punishment skate"] },
        { text: "Puck Handling", points: 8, aliases: ["stickhandling", "deke drills"] },
      ],
    },
    {
      text: "Name a famous Vancouver Canucks player",
      answers: [
        { text: "Henrik Sedin", points: 34, aliases: ["sedin", "sedins", "daniel sedin"] },
        { text: "Pavel Bure", points: 26, aliases: ["bure", "russian rocket"] },
        { text: "Roberto Luongo", points: 18, aliases: ["luongo", "lu"] },
        { text: "Trevor Linden", points: 14, aliases: ["linden", "captain canuck"] },
        { text: "Markus Naslund", points: 8, aliases: ["naslund", "nazzy"] },
      ],
    },
    {
      text: "Name an NHL team's animal mascot character",
      answers: [
        { text: "Gritty", points: 40, aliases: ["flyers mascot", "philadelphia"] },
        { text: "Carlton", points: 22, aliases: ["leafs bear", "toronto bear"] },
        { text: "S.J. Sharkie", points: 16, aliases: ["sharkie", "sharks mascot"] },
        { text: "Iceburgh", points: 12, aliases: ["penguins mascot", "ice burgh"] },
        { text: "Youppi", points: 10, aliases: ["canadiens mascot", "habs mascot"] },
      ],
    },
    {
      text: "Name a type of hockey league playoff format",
      answers: [
        { text: "Best of 7", points: 44, aliases: ["best of seven", "7 games", "seven games"] },
        { text: "Best of 5", points: 22, aliases: ["best of five", "5 games"] },
        { text: "Single Elimination", points: 16, aliases: ["single game", "one game"] },
        { text: "Round Robin", points: 10, aliases: ["round-robin"] },
        { text: "Double Elimination", points: 8, aliases: ["double elim"] },
      ],
    },
  ],

  // Day 30
  [
    {
      text: "Name a famous NHL player with a nickname",
      answers: [
        { text: "The Great One", points: 40, aliases: ["gretzky", "wayne gretzky", "great one"] },
        { text: "Super Mario", points: 24, aliases: ["lemieux", "mario lemieux"] },
        { text: "Sid the Kid", points: 16, aliases: ["crosby", "sidney crosby", "sid"] },
        { text: "Mr. Hockey", points: 12, aliases: ["gordie howe", "howe", "mr hockey"] },
        { text: "The Russian Rocket", points: 8, aliases: ["bure", "pavel bure", "russian rocket"] },
      ],
    },
    {
      text: "Name a famous NHL franchise original to 1967 expansion",
      answers: [
        { text: "Flyers", points: 34, aliases: ["philadelphia", "philly", "philadelphia flyers"] },
        { text: "Kings", points: 24, aliases: ["la", "los angeles", "la kings"] },
        { text: "Blues", points: 18, aliases: ["st louis", "saint louis", "st louis blues"] },
        { text: "Penguins", points: 14, aliases: ["pittsburgh", "pens"] },
        { text: "North Stars", points: 10, aliases: ["minnesota north stars", "stars"] },
      ],
    },
    {
      text: "Name a word that describes playoff hockey",
      answers: [
        { text: "Intense", points: 38, aliases: ["intensity"] },
        { text: "Physical", points: 26, aliases: ["rough", "tough"] },
        { text: "Electric", points: 18, aliases: ["electrifying"] },
        { text: "Brutal", points: 12, aliases: ["grueling"] },
        { text: "Unpredictable", points: 6, aliases: ["chaotic", "wild"] },
      ],
    },
    {
      text: "Name a famous hockey country rivalry",
      answers: [
        { text: "Canada vs USA", points: 40, aliases: ["usa canada", "canada usa", "canada vs us"] },
        { text: "Canada vs Russia", points: 26, aliases: ["russia canada", "canada vs soviet", "summit series"] },
        { text: "Sweden vs Finland", points: 16, aliases: ["finland sweden"] },
        { text: "Czech vs Slovakia", points: 10, aliases: ["slovakia czech", "czechoslovakia"] },
        { text: "USA vs Russia", points: 8, aliases: ["russia usa", "miracle on ice"] },
      ],
    },
    {
      text: "Name something every Stanley Cup winner does",
      answers: [
        { text: "Lift the Cup", points: 40, aliases: ["raise the cup", "hoist the cup", "hold the cup"] },
        { text: "Skate with It", points: 22, aliases: ["skate around", "lap"] },
        { text: "Drink from It", points: 18, aliases: ["champagne", "drink", "beer from cup"] },
        { text: "Day with Cup", points: 12, aliases: ["take it home", "cup day", "hometown"] },
        { text: "Parade", points: 8, aliases: ["championship parade", "victory parade"] },
      ],
    },
  ],
]

async function seed() {
  const startDate = new Date()
  let success = 0
  let failed = 0

  for (let day = 0; day < 30; day++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + day)
    const dateStr = date.toISOString().split('T')[0]

    const datasets = [
      { league: 'NBA', questions: NBA_DAYS[day] },
      { league: 'NFL', questions: NFL_DAYS[day] },
      { league: 'MLB', questions: MLB_DAYS[day] },
      { league: 'NHL', questions: NHL_DAYS[day] },
    ]

    for (const { league, questions } of datasets) {
      if (!questions) {
        console.error('⚠ Missing questions for day ' + day + ' ' + league)
        failed++
        continue
      }
      const { error } = await supabase
        .from('daily_games')
        .upsert(
          { date: dateStr, league, power_play: { league, questions } },
          { onConflict: 'date,league' }
        )
      if (error) {
        console.error('✗ ' + dateStr + ' ' + league + ':', error.message)
        failed++
      } else {
        console.log('✓ ' + dateStr + ' ' + league)
        success++
      }
    }
  }

  console.log('\nDone. ' + success + ' seeded, ' + failed + ' failed.')
}

seed().catch(console.error)
