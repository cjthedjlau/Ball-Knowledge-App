// NBA Power Play Questions — REWRITTEN for short (1-2 word) answers
// Copy this entire NBA_DAYS array and replace the existing one in seed-power-play.ts

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
