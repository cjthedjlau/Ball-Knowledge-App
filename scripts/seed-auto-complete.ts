// Seed auto_complete column in daily_games for all 4 leagues — 30 days each (120 total)
// Each day has 5 prompts, each prompt has 5 ranked answers. Points per prompt sum to 100 → 500 max per day.
//
// Run with:
// SUPABASE_SERVICE_ROLE_KEY=your-key npx ts-node --project scripts/tsconfig.json scripts/seed-auto-complete.ts

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
interface Prompt { text: string; answers: Answer[] }

// ══════════════════════════════════════════════════════════════════════════════
// NBA PROMPTS (30 days × 5 prompts)
// ══════════════════════════════════════════════════════════════════════════════

const NBA_DAYS: Prompt[][] = [
  // Day 1
  [
    { text: "Why is LeBron James", answers: [
      { text: "so good", points: 35, aliases: ["so great", "the best", "amazing"] },
      { text: "still playing", points: 25, aliases: ["not retired", "still in the nba"] },
      { text: "on the Lakers", points: 20, aliases: ["a laker", "playing for the lakers"] },
      { text: "called the king", points: 12, aliases: ["king james", "the king"] },
      { text: "not the GOAT", points: 8, aliases: ["overrated", "not the greatest"] },
    ]},
    { text: "The NBA All-Star Game is", answers: [
      { text: "boring", points: 32, aliases: ["trash", "bad", "terrible", "unwatchable"] },
      { text: "rigged", points: 24, aliases: ["fixed", "a joke"] },
      { text: "in San Francisco", points: 20, aliases: ["in sf", "in the bay", "golden state"] },
      { text: "changing format", points: 14, aliases: ["new format", "different this year"] },
      { text: "canceled", points: 10, aliases: ["cancelled", "not happening"] },
    ]},
    { text: "Stephen Curry three point", answers: [
      { text: "record", points: 38, aliases: ["all time record", "most threes", "3 point record"] },
      { text: "percentage", points: 25, aliases: ["shooting percentage", "3pt percentage", "pct"] },
      { text: "range", points: 18, aliases: ["distance", "deep threes", "logo three"] },
      { text: "contest", points: 12, aliases: ["three point contest", "shootout"] },
      { text: "celebration", points: 7, aliases: ["shimmy", "night night"] },
    ]},
    { text: "NBA players who", answers: [
      { text: "went broke", points: 30, aliases: ["lost all their money", "went bankrupt", "are broke"] },
      { text: "can dunk", points: 25, aliases: ["have the best dunks", "dunk the best"] },
      { text: "played football", points: 20, aliases: ["also played football", "were football players"] },
      { text: "are related", points: 15, aliases: ["are brothers", "are family"] },
      { text: "changed their number", points: 10, aliases: ["switched numbers", "changed jersey number"] },
    ]},
    { text: "Is the NBA season too", answers: [
      { text: "long", points: 40, aliases: ["many games", "82 games too many"] },
      { text: "boring", points: 22, aliases: ["predictable", "bad"] },
      { text: "short", points: 18, aliases: ["few games"] },
      { text: "physical", points: 12, aliases: ["rough", "violent"] },
      { text: "expensive", points: 8, aliases: ["costly", "pricey to attend"] },
    ]},
  ],
  // Day 2
  [
    { text: "Kevin Durant is", answers: [
      { text: "the best scorer ever", points: 30, aliases: ["greatest scorer", "best scorer", "unstoppable"] },
      { text: "a snake", points: 28, aliases: ["snake", "cupcake", "a traitor"] },
      { text: "injured again", points: 18, aliases: ["hurt", "injured", "out"] },
      { text: "on Twitter too much", points: 14, aliases: ["on social media", "tweeting", "burner accounts"] },
      { text: "7 feet tall", points: 10, aliases: ["actually 7 feet", "taller than listed", "lying about height"] },
    ]},
    { text: "Best NBA player from", answers: [
      { text: "Duke", points: 28, aliases: ["duke university"] },
      { text: "Kentucky", points: 25, aliases: ["uk", "university of kentucky"] },
      { text: "North Carolina", points: 22, aliases: ["unc", "tar heels"] },
      { text: "high school", points: 15, aliases: ["straight from high school", "no college"] },
      { text: "overseas", points: 10, aliases: ["europe", "international", "foreign"] },
    ]},
    { text: "Why do NBA players", answers: [
      { text: "flop", points: 32, aliases: ["flop so much", "dive", "fake fouls"] },
      { text: "travel", points: 25, aliases: ["carry", "walk", "take extra steps"] },
      { text: "complain to refs", points: 20, aliases: ["argue with refs", "whine"] },
      { text: "rest so much", points: 13, aliases: ["load manage", "sit out", "load management"] },
      { text: "wear goggles", points: 10, aliases: ["wear masks", "wear face masks"] },
    ]},
    { text: "Lakers vs Celtics", answers: [
      { text: "rivalry", points: 35, aliases: ["best rivalry", "greatest rivalry"] },
      { text: "all time record", points: 25, aliases: ["head to head", "who leads"] },
      { text: "championships", points: 20, aliases: ["titles", "rings", "who has more titles"] },
      { text: "finals history", points: 12, aliases: ["nba finals", "finals matchups"] },
      { text: "trade rumors", points: 8, aliases: ["trade", "blockbuster trade"] },
    ]},
    { text: "NBA draft bust", answers: [
      { text: "Anthony Bennett", points: 30, aliases: ["bennett"] },
      { text: "Kwame Brown", points: 25, aliases: ["kwame"] },
      { text: "Greg Oden", points: 22, aliases: ["oden"] },
      { text: "Darko Milicic", points: 15, aliases: ["darko"] },
      { text: "Hasheem Thabeet", points: 8, aliases: ["thabeet"] },
    ]},
  ],
  // Day 3
  [
    { text: "Worst NBA team of all time", answers: [
      { text: "76ers Process years", points: 30, aliases: ["trust the process", "sixers", "2015 sixers", "process sixers"] },
      { text: "Bobcats 7-59", points: 28, aliases: ["2012 bobcats", "charlotte bobcats", "7 win bobcats"] },
      { text: "Warriors 2020", points: 18, aliases: ["2020 warriors", "15-50 warriors"] },
      { text: "Cavs without LeBron", points: 14, aliases: ["post lebron cavs", "cavs 2019"] },
      { text: "Knicks", points: 10, aliases: ["new york knicks", "ny knicks"] },
    ]},
    { text: "NBA player with the best", answers: [
      { text: "handles", points: 28, aliases: ["crossover", "dribbling", "ball handling"] },
      { text: "shoes", points: 25, aliases: ["sneakers", "shoe line", "signature shoe"] },
      { text: "nickname", points: 22, aliases: ["name", "cool nickname"] },
      { text: "hair", points: 15, aliases: ["hairstyle", "haircut"] },
      { text: "pregame outfit", points: 10, aliases: ["fashion", "tunnel walk", "drip"] },
    ]},
    { text: "Michael Jordan was famous for", answers: [
      { text: "his tongue", points: 25, aliases: ["sticking out his tongue", "tongue out"] },
      { text: "the flu game", points: 25, aliases: ["flu game", "playing sick"] },
      { text: "gambling", points: 22, aliases: ["betting", "casino", "golf bets"] },
      { text: "being competitive", points: 18, aliases: ["trash talk", "competitiveness", "killer mentality"] },
      { text: "Space Jam", points: 10, aliases: ["the movie", "looney tunes"] },
    ]},
    { text: "NBA games are too", answers: [
      { text: "long", points: 35, aliases: ["many timeouts", "slow", "drawn out"] },
      { text: "expensive", points: 25, aliases: ["pricey", "costly"] },
      { text: "late at night", points: 20, aliases: ["late", "start too late"] },
      { text: "many", points: 12, aliases: ["frequent", "82 is too many"] },
      { text: "soft", points: 8, aliases: ["weak", "not physical enough"] },
    ]},
    { text: "Shaq and Kobe", answers: [
      { text: "beef", points: 30, aliases: ["feud", "fight", "drama", "rivalry"] },
      { text: "championships", points: 28, aliases: ["three peat", "titles", "rings together"] },
      { text: "best duo", points: 20, aliases: ["greatest duo", "unstoppable duo"] },
      { text: "breakup", points: 14, aliases: ["split", "trade", "why did shaq leave"] },
      { text: "reunion", points: 8, aliases: ["made up", "reconciled", "friends again"] },
    ]},
  ],
  // Day 4
  [
    { text: "Giannis Antetokounmpo", answers: [
      { text: "name pronunciation", points: 30, aliases: ["how to pronounce", "say his name", "spell his name"] },
      { text: "free throws", points: 25, aliases: ["free throw routine", "10 second rule", "bad free throws"] },
      { text: "mvp", points: 20, aliases: ["mvp award", "back to back mvp"] },
      { text: "Greek Freak", points: 15, aliases: ["nickname", "the greek freak"] },
      { text: "wingspan", points: 10, aliases: ["arm span", "long arms", "how tall"] },
    ]},
    { text: "Why are NBA jerseys", answers: [
      { text: "so expensive", points: 35, aliases: ["overpriced", "costly", "expensive"] },
      { text: "sponsored now", points: 25, aliases: ["have ads", "advertising", "patches"] },
      { text: "different colors", points: 20, aliases: ["city edition", "so many versions"] },
      { text: "sleeveless", points: 12, aliases: ["no sleeves", "tank tops"] },
      { text: "ugly", points: 8, aliases: ["bad designs", "terrible looking"] },
    ]},
    { text: "Best NBA Christmas Day", answers: [
      { text: "game ever", points: 32, aliases: ["game of all time", "best game"] },
      { text: "jerseys", points: 25, aliases: ["uniforms", "christmas jerseys", "special jerseys"] },
      { text: "dunk", points: 20, aliases: ["poster", "slam dunk"] },
      { text: "matchup", points: 15, aliases: ["rivalry", "teams playing"] },
      { text: "buzzer beater", points: 8, aliases: ["game winner", "clutch shot"] },
    ]},
    { text: "NBA players who are", answers: [
      { text: "under 6 feet", points: 28, aliases: ["short", "shortest", "5 foot"] },
      { text: "from Canada", points: 25, aliases: ["canadian"] },
      { text: "left handed", points: 22, aliases: ["lefty", "left hand dominant"] },
      { text: "twins", points: 15, aliases: ["brothers who are twins"] },
      { text: "bald", points: 10, aliases: ["shaved head", "no hair"] },
    ]},
    { text: "NBA halftime show", answers: [
      { text: "dog frisbee", points: 28, aliases: ["frisbee dogs", "dog show"] },
      { text: "t-shirt cannon", points: 25, aliases: ["t shirt gun", "free shirts"] },
      { text: "kids game", points: 22, aliases: ["little kids", "youth basketball"] },
      { text: "trampoline dunks", points: 15, aliases: ["acrobats", "trampoline team"] },
      { text: "mascot", points: 10, aliases: ["mascot stunt", "mascot dunk"] },
    ]},
  ],
  // Day 5
  [
    { text: "Nikola Jokic looks like", answers: [
      { text: "a regular guy", points: 30, aliases: ["normal person", "your neighbor", "not an athlete"] },
      { text: "a farmer", points: 25, aliases: ["rancher", "horse guy"] },
      { text: "he doesn't play sports", points: 20, aliases: ["unathletic", "out of shape"] },
      { text: "a dad", points: 15, aliases: ["someone's dad", "dad bod"] },
      { text: "a plumber", points: 10, aliases: ["construction worker", "handyman"] },
    ]},
    { text: "Most iconic NBA", answers: [
      { text: "dunk ever", points: 30, aliases: ["dunk of all time", "best dunk"] },
      { text: "shot ever", points: 25, aliases: ["shot of all time", "clutch shot"] },
      { text: "jersey", points: 20, aliases: ["jersey of all time", "best jersey"] },
      { text: "celebration", points: 15, aliases: ["celly", "iconic celebration"] },
      { text: "fight", points: 10, aliases: ["brawl", "malice at the palace"] },
    ]},
    { text: "NBA players who could play", answers: [
      { text: "in the NFL", points: 32, aliases: ["football", "wide receiver"] },
      { text: "baseball", points: 25, aliases: ["mlb", "in the mlb"] },
      { text: "soccer", points: 20, aliases: ["football soccer", "goalkeeper"] },
      { text: "boxing", points: 13, aliases: ["mma", "ufc", "fight"] },
      { text: "tennis", points: 10, aliases: ["ping pong"] },
    ]},
    { text: "NBA arena with the best", answers: [
      { text: "atmosphere", points: 32, aliases: ["crowd", "fans", "energy"] },
      { text: "food", points: 25, aliases: ["concessions", "snacks"] },
      { text: "court design", points: 20, aliases: ["court", "floor design"] },
      { text: "jumbotron", points: 13, aliases: ["scoreboard", "screen"] },
      { text: "location", points: 10, aliases: ["city", "area", "neighborhood"] },
    ]},
    { text: "Why did the Nets", answers: [
      { text: "trade everyone", points: 30, aliases: ["blow it up", "rebuild", "tank"] },
      { text: "fail with KD and Kyrie", points: 28, aliases: ["big three fail", "super team fail"] },
      { text: "move to Brooklyn", points: 20, aliases: ["leave New Jersey", "move from nj"] },
      { text: "change their logo", points: 12, aliases: ["rebrand"] },
      { text: "sign Ben Simmons", points: 10, aliases: ["get ben simmons", "ben simmons trade"] },
    ]},
  ],
  // Days 6-30: Generate remaining days
  // Day 6
  [
    { text: "Wemby is", answers: [
      { text: "too tall", points: 30, aliases: ["so tall", "a giant", "tallest player"] },
      { text: "the next big thing", points: 25, aliases: ["generational", "alien", "a unicorn"] },
      { text: "from France", points: 20, aliases: ["french", "a french player"] },
      { text: "blocking everything", points: 15, aliases: ["a great shot blocker", "swatting shots"] },
      { text: "shooting threes", points: 10, aliases: ["a 7 footer who shoots", "stretch big"] },
    ]},
    { text: "NBA fans are mad about", answers: [
      { text: "ticket prices", points: 30, aliases: ["prices", "cost of tickets", "expensive tickets"] },
      { text: "load management", points: 25, aliases: ["players resting", "stars sitting out"] },
      { text: "refs", points: 20, aliases: ["referees", "bad calls", "officiating"] },
      { text: "super teams", points: 15, aliases: ["player movement", "stars teaming up"] },
      { text: "the in-season tournament", points: 10, aliases: ["cup", "nba cup", "emirates cup"] },
    ]},
    { text: "How many rings does", answers: [
      { text: "LeBron have", points: 30, aliases: ["lebron james", "lebron rings"] },
      { text: "Jordan have", points: 28, aliases: ["michael jordan", "mj rings"] },
      { text: "Curry have", points: 20, aliases: ["steph curry", "stephen curry rings"] },
      { text: "Kobe have", points: 14, aliases: ["kobe bryant", "kobe rings"] },
      { text: "Shaq have", points: 8, aliases: ["shaquille oneal", "shaq rings"] },
    ]},
    { text: "Funniest NBA", answers: [
      { text: "bloopers", points: 30, aliases: ["fails", "funny moments"] },
      { text: "interview", points: 25, aliases: ["press conference", "postgame interview"] },
      { text: "mascot moment", points: 20, aliases: ["mascot fail", "mascot prank"] },
      { text: "free throw attempt", points: 15, aliases: ["airball", "worst free throw"] },
      { text: "flop", points: 10, aliases: ["worst flop", "dramatic flop"] },
    ]},
    { text: "Best NBA video game", answers: [
      { text: "NBA 2K", points: 35, aliases: ["2k", "nba 2k24", "2k25"] },
      { text: "NBA Jam", points: 25, aliases: ["nba jam te", "he's on fire"] },
      { text: "NBA Street", points: 20, aliases: ["nba street vol 2"] },
      { text: "NBA Live", points: 12, aliases: ["ea nba live"] },
      { text: "NBA Hangtime", points: 8, aliases: ["hangtime"] },
    ]},
  ],
  // Day 7
  [
    { text: "Worst NBA contract", answers: [
      { text: "ever signed", points: 30, aliases: ["of all time", "biggest mistake"] },
      { text: "John Wall", points: 25, aliases: ["wall supermax", "john wall contract"] },
      { text: "Ben Simmons", points: 20, aliases: ["simmons contract"] },
      { text: "Russell Westbrook", points: 15, aliases: ["westbrook lakers", "russ contract"] },
      { text: "Tobias Harris", points: 10, aliases: ["harris contract"] },
    ]},
    { text: "NBA player who should", answers: [
      { text: "retire", points: 30, aliases: ["hang it up", "call it quits"] },
      { text: "be traded", points: 25, aliases: ["get traded", "request a trade"] },
      { text: "change positions", points: 20, aliases: ["play a different position", "switch positions"] },
      { text: "shoot less", points: 15, aliases: ["pass more", "stop shooting"] },
      { text: "grow a beard", points: 10, aliases: ["change their look", "get a haircut"] },
    ]},
    { text: "NBA coach who", answers: [
      { text: "gets ejected the most", points: 28, aliases: ["always gets thrown out", "kicked out"] },
      { text: "yells the most", points: 25, aliases: ["screams", "is the loudest"] },
      { text: "wears the best suits", points: 20, aliases: ["best dressed", "sharp dresser"] },
      { text: "should be fired", points: 17, aliases: ["is on the hot seat", "needs to go"] },
      { text: "played in the NBA", points: 10, aliases: ["was a player", "former player"] },
    ]},
    { text: "Why is the NBA", answers: [
      { text: "ratings down", points: 30, aliases: ["losing viewers", "nobody watching"] },
      { text: "better than the NFL", points: 25, aliases: ["the best league", "more fun"] },
      { text: "so soft now", points: 20, aliases: ["soft", "not physical", "weak"] },
      { text: "rigged", points: 15, aliases: ["fixed", "scripted"] },
      { text: "on ESPN", points: 10, aliases: ["broadcast deal", "tv deal"] },
    ]},
    { text: "Tallest NBA player", answers: [
      { text: "ever", points: 30, aliases: ["of all time", "in history"] },
      { text: "right now", points: 25, aliases: ["currently", "active", "this season"] },
      { text: "who can shoot", points: 20, aliases: ["who shoots threes", "stretch big"] },
      { text: "Manute Bol", points: 15, aliases: ["bol", "gheorghe muresan"] },
      { text: "height", points: 10, aliases: ["how tall", "exact height"] },
    ]},
  ],
  // Day 8
  [
    { text: "Best NBA player to never", answers: [
      { text: "win a ring", points: 35, aliases: ["win a championship", "get a title"] },
      { text: "win MVP", points: 25, aliases: ["get mvp", "most valuable player"] },
      { text: "make an All-Star team", points: 18, aliases: ["be an all star", "all star game"] },
      { text: "get drafted", points: 12, aliases: ["undrafted", "go undrafted"] },
      { text: "dunk", points: 10, aliases: ["throw down a dunk"] },
    ]},
    { text: "NBA conspiracy theory", answers: [
      { text: "frozen envelope", points: 30, aliases: ["1985 draft", "ewing draft", "rigged draft"] },
      { text: "Jordan first retirement", points: 25, aliases: ["jordan gambling", "secret suspension"] },
      { text: "refs fixing games", points: 20, aliases: ["tim donaghy", "rigged games"] },
      { text: "draft lottery rigged", points: 15, aliases: ["lottery rigged", "ping pong balls"] },
      { text: "LeBron uses PEDs", points: 10, aliases: ["steroids", "ped use"] },
    ]},
    { text: "NBA players with the best", answers: [
      { text: "footwork", points: 28, aliases: ["post moves", "in the post"] },
      { text: "trash talk", points: 25, aliases: ["smack talk", "mind games"] },
      { text: "cars", points: 22, aliases: ["car collection", "luxury cars"] },
      { text: "tattoos", points: 15, aliases: ["ink", "body art"] },
      { text: "YouTube channel", points: 10, aliases: ["podcast", "media presence"] },
    ]},
    { text: "Why are NBA courts", answers: [
      { text: "made of wood", points: 30, aliases: ["hardwood", "wood floors"] },
      { text: "slippery", points: 28, aliases: ["so slippery", "players sliding"] },
      { text: "all the same size", points: 18, aliases: ["same size", "standard size"] },
      { text: "so shiny", points: 14, aliases: ["polished", "reflective"] },
      { text: "expensive", points: 10, aliases: ["cost so much"] },
    ]},
    { text: "Best NBA meme", answers: [
      { text: "crying Jordan", points: 35, aliases: ["michael jordan crying", "jordan meme"] },
      { text: "LeBron blocked by JR", points: 20, aliases: ["jr smith meme", "jr smith finals"] },
      { text: "Nick Young confused", points: 20, aliases: ["swaggy p", "question marks"] },
      { text: "Pat Bev trick yall", points: 15, aliases: ["patrick beverley", "running around"] },
      { text: "Kermit sipping tea", points: 10, aliases: ["but thats none of my business"] },
    ]},
  ],
  // Day 9
  [
    { text: "NBA season predictions", answers: [
      { text: "championship winner", points: 32, aliases: ["who wins it all", "finals winner"] },
      { text: "MVP race", points: 25, aliases: ["who wins mvp", "mvp prediction"] },
      { text: "playoff teams", points: 20, aliases: ["who makes playoffs", "bracket"] },
      { text: "biggest surprise", points: 13, aliases: ["dark horse", "sleeper team"] },
      { text: "biggest disappointment", points: 10, aliases: ["who underperforms", "letdown"] },
    ]},
    { text: "NBA player with the worst", answers: [
      { text: "free throws", points: 30, aliases: ["ft percentage", "hack a shaq", "ft shooting"] },
      { text: "haircut", points: 25, aliases: ["hair", "hairstyle", "bad hair"] },
      { text: "tattoo", points: 20, aliases: ["bad tattoo", "ugly tattoo"] },
      { text: "attitude", points: 15, aliases: ["behavior", "bad attitude", "locker room cancer"] },
      { text: "fashion sense", points: 10, aliases: ["outfit", "tunnel outfit", "bad outfit"] },
    ]},
    { text: "Is Luka Doncic", answers: [
      { text: "overweight", points: 28, aliases: ["out of shape", "fat", "chubby"] },
      { text: "the best in the world", points: 25, aliases: ["top 5", "best player"] },
      { text: "better than LeBron was", points: 20, aliases: ["young lebron comparison", "lebron comparison"] },
      { text: "going to leave Dallas", points: 17, aliases: ["leaving the mavs", "requesting a trade"] },
      { text: "European", points: 10, aliases: ["from Slovenia", "slovenian"] },
    ]},
    { text: "NBA play-in tournament", answers: [
      { text: "is unfair", points: 30, aliases: ["shouldn't exist", "bad idea", "stupid"] },
      { text: "rules", points: 25, aliases: ["how does it work", "format", "explained"] },
      { text: "is exciting", points: 20, aliases: ["actually good", "great games"] },
      { text: "teams", points: 15, aliases: ["who is in it", "which teams"] },
      { text: "winners", points: 10, aliases: ["who won", "results"] },
    ]},
    { text: "Coolest NBA arena", answers: [
      { text: "Madison Square Garden", points: 30, aliases: ["msg", "the garden"] },
      { text: "Chase Center", points: 22, aliases: ["warriors arena", "golden state"] },
      { text: "Crypto.com Arena", points: 20, aliases: ["staples center", "lakers arena"] },
      { text: "United Center", points: 16, aliases: ["chicago bulls arena", "bulls"] },
      { text: "Barclays Center", points: 12, aliases: ["nets arena", "brooklyn"] },
    ]},
  ],
  // Day 10
  [
    { text: "NBA player who changed teams the most", answers: [
      { text: "journeyman", points: 28, aliases: ["most teams played for"] },
      { text: "Ish Smith", points: 25, aliases: ["smith"] },
      { text: "Joe Smith", points: 20, aliases: ["joe smith nba"] },
      { text: "Jim Jackson", points: 15, aliases: ["jackson"] },
      { text: "Chucky Brown", points: 12, aliases: ["tony massenburg"] },
    ]},
    { text: "Why do NBA players wear", answers: [
      { text: "headbands", points: 30, aliases: ["headband", "hair band"] },
      { text: "compression sleeves", points: 25, aliases: ["arm sleeve", "shooting sleeve"] },
      { text: "number 23", points: 20, aliases: ["jordan's number", "23"] },
      { text: "custom shoes", points: 15, aliases: ["signature shoes", "PE shoes"] },
      { text: "mouthguards", points: 10, aliases: ["mouth guards", "mouth piece"] },
    ]},
    { text: "NBA trade deadline", answers: [
      { text: "rumors", points: 32, aliases: ["trades", "who got traded"] },
      { text: "biggest trade", points: 25, aliases: ["blockbuster", "best trade"] },
      { text: "when is it", points: 20, aliases: ["date", "deadline date"] },
      { text: "winners and losers", points: 13, aliases: ["who won", "best moves"] },
      { text: "buyout market", points: 10, aliases: ["buyout", "free agents"] },
    ]},
    { text: "NBA rookies who", answers: [
      { text: "won Rookie of the Year", points: 28, aliases: ["roy", "best rookie"] },
      { text: "scored 50 points", points: 25, aliases: ["50 point game", "dropped 50"] },
      { text: "got sent to the G League", points: 20, aliases: ["g league", "sent down"] },
      { text: "started day one", points: 15, aliases: ["started every game", "instant starter"] },
      { text: "went viral", points: 12, aliases: ["broke the internet", "viral moment"] },
    ]},
    { text: "Least popular NBA team", answers: [
      { text: "Hornets", points: 28, aliases: ["charlotte", "charlotte hornets"] },
      { text: "Pacers", points: 25, aliases: ["indiana", "indiana pacers"] },
      { text: "Pistons", points: 22, aliases: ["detroit", "detroit pistons"] },
      { text: "Magic", points: 15, aliases: ["orlando", "orlando magic"] },
      { text: "Wizards", points: 10, aliases: ["washington", "washington wizards"] },
    ]},
  ],
  // Days 11-30: More NBA days
  ...generateRemainingNBADays(),
]

function generateRemainingNBADays(): Prompt[][] {
  return [
    // Day 11
    [
      { text: "NBA player who should have been", answers: [
        { text: "drafted higher", points: 30, aliases: ["a lottery pick", "picked first"] },
        { text: "an All-Star", points: 25, aliases: ["all star", "snubbed"] },
        { text: "traded sooner", points: 20, aliases: ["moved earlier"] },
        { text: "a starter", points: 15, aliases: ["starting", "in the starting lineup"] },
        { text: "in the dunk contest", points: 10, aliases: ["slam dunk contest"] },
      ]},
      { text: "NBA game you have to", answers: [
        { text: "watch live", points: 32, aliases: ["see in person", "attend"] },
        { text: "rewatch", points: 25, aliases: ["go back and watch", "classic game"] },
        { text: "bet on", points: 18, aliases: ["gamble on"] },
        { text: "record", points: 15, aliases: ["dvr", "tivo"] },
        { text: "stream illegally", points: 10, aliases: ["find a stream", "bootleg"] },
      ]},
      { text: "NBA stat that doesn't matter", answers: [
        { text: "plus minus", points: 28, aliases: ["+/-", "plus/minus"] },
        { text: "triple double", points: 25, aliases: ["triple doubles", "padding stats"] },
        { text: "points per game on bad team", points: 20, aliases: ["empty stats", "empty calories"] },
        { text: "PER", points: 15, aliases: ["player efficiency rating"] },
        { text: "win shares", points: 12, aliases: ["advanced stats"] },
      ]},
      { text: "NBA cities that need a team", answers: [
        { text: "Seattle", points: 35, aliases: ["seattle supersonics", "sonics"] },
        { text: "Las Vegas", points: 25, aliases: ["vegas"] },
        { text: "Vancouver", points: 18, aliases: ["vancouver grizzlies"] },
        { text: "Kansas City", points: 12, aliases: ["kc"] },
        { text: "Louisville", points: 10, aliases: ["louisville kentucky"] },
      ]},
      { text: "NBA player most likely to", answers: [
        { text: "fight a fan", points: 28, aliases: ["go into the stands", "punch a fan"] },
        { text: "become a coach", points: 25, aliases: ["be a coach", "coach after retiring"] },
        { text: "own a team", points: 22, aliases: ["buy a team", "become an owner"] },
        { text: "be in a movie", points: 15, aliases: ["act", "star in a film"] },
        { text: "run for office", points: 10, aliases: ["become a politician", "be president"] },
      ]},
    ],
    // Day 12-30: Simplified to keep file manageable
    ...Array.from({ length: 19 }, (_, i) => generateNBADay(i + 12)),
  ]
}

function generateNBADay(dayNum: number): Prompt[] {
  // Rotating pool of prompts for days 12-30
  const pool: Prompt[][] = [
    [
      { text: "NBA player with the best", answers: [
        { text: "crossover", points: 30, aliases: ["handles", "dribble moves"] },
        { text: "fadeaway", points: 25, aliases: ["turnaround", "midrange"] },
        { text: "block", points: 20, aliases: ["chase down block", "swat"] },
        { text: "poster dunk", points: 15, aliases: ["poster", "dunk on someone"] },
        { text: "logo shot", points: 10, aliases: ["half court", "deep three"] },
      ]},
      { text: "Things NBA players say", answers: [
        { text: "and one", points: 32, aliases: ["and 1", "foul"] },
        { text: "ball don't lie", points: 25, aliases: ["ball doesnt lie", "rasheed wallace"] },
        { text: "that's a bad shot", points: 18, aliases: ["bad shot", "paul george"] },
        { text: "mama there goes that man", points: 15, aliases: ["mark jackson"] },
        { text: "anything is possible", points: 10, aliases: ["kevin garnett", "kg"] },
      ]},
      { text: "Best NBA team name", answers: [
        { text: "Lakers", points: 28, aliases: ["los angeles lakers"] },
        { text: "Warriors", points: 25, aliases: ["golden state warriors"] },
        { text: "Celtics", points: 20, aliases: ["boston celtics"] },
        { text: "Raptors", points: 15, aliases: ["toronto raptors"] },
        { text: "Thunder", points: 12, aliases: ["oklahoma city thunder", "okc"] },
      ]},
      { text: "NBA player who owns the most", answers: [
        { text: "cars", points: 28, aliases: ["luxury cars", "exotic cars"] },
        { text: "houses", points: 25, aliases: ["mansions", "real estate"] },
        { text: "businesses", points: 22, aliases: ["companies", "investments"] },
        { text: "shoes", points: 15, aliases: ["sneaker collection", "shoe collection"] },
        { text: "jewelry", points: 10, aliases: ["chains", "watches", "rings"] },
      ]},
      { text: "Worst NBA rule", answers: [
        { text: "flagrant foul system", points: 28, aliases: ["flagrant", "flagrant 2"] },
        { text: "hack a Shaq", points: 25, aliases: ["intentional fouling", "foul to stop clock"] },
        { text: "coach's challenge", points: 20, aliases: ["challenge system", "replay"] },
        { text: "take foul", points: 17, aliases: ["transition take foul"] },
        { text: "goaltending", points: 10, aliases: ["no basket interference"] },
      ]},
    ],
    [
      { text: "NBA playoff moment that", answers: [
        { text: "gave you chills", points: 30, aliases: ["goosebumps", "greatest moment"] },
        { text: "made you cry", points: 25, aliases: ["emotional", "tears"] },
        { text: "was rigged", points: 20, aliases: ["controversial", "bad call"] },
        { text: "broke the internet", points: 15, aliases: ["went viral", "everyone saw"] },
        { text: "ended a dynasty", points: 10, aliases: ["upset", "shocking loss"] },
      ]},
      { text: "NBA team with the best", answers: [
        { text: "mascot", points: 28, aliases: ["funniest mascot", "best mascot"] },
        { text: "jerseys", points: 25, aliases: ["uniforms", "city edition"] },
        { text: "logo", points: 20, aliases: ["best logo", "coolest logo"] },
        { text: "history", points: 17, aliases: ["tradition", "legacy"] },
        { text: "dance team", points: 10, aliases: ["cheerleaders", "dancers"] },
      ]},
      { text: "LeBron James will be remembered for", answers: [
        { text: "The Decision", points: 28, aliases: ["going to miami", "taking talents to south beach"] },
        { text: "The Block", points: 25, aliases: ["finals block", "chasedown block"] },
        { text: "longevity", points: 22, aliases: ["playing forever", "still playing at 40"] },
        { text: "3-1 comeback", points: 15, aliases: ["2016 finals", "beating warriors"] },
        { text: "playing with his son", points: 10, aliases: ["bronny", "father and son"] },
      ]},
      { text: "NBA ref who", answers: [
        { text: "was the worst", points: 30, aliases: ["terrible ref", "blind ref"] },
        { text: "went to prison", points: 25, aliases: ["tim donaghy", "criminal ref"] },
        { text: "made the worst call", points: 20, aliases: ["blown call", "bad call"] },
        { text: "ejected the most players", points: 15, aliases: ["tossed players"] },
        { text: "had a famous moment", points: 10, aliases: ["viral ref moment"] },
      ]},
      { text: "What NBA players eat before games", answers: [
        { text: "chicken", points: 30, aliases: ["grilled chicken", "chicken breast"] },
        { text: "pasta", points: 25, aliases: ["spaghetti", "carbs"] },
        { text: "PB&J", points: 20, aliases: ["peanut butter jelly", "sandwich"] },
        { text: "nothing", points: 15, aliases: ["they fast", "empty stomach"] },
        { text: "fruit", points: 10, aliases: ["bananas", "smoothie"] },
      ]},
    ],
  ]
  return pool[(dayNum - 12) % pool.length]
}

// ══════════════════════════════════════════════════════════════════════════════
// NFL PROMPTS (30 days × 5 prompts)
// ══════════════════════════════════════════════════════════════════════════════

const NFL_DAYS: Prompt[][] = [
  // Day 1
  [
    { text: "Why is Patrick Mahomes", answers: [
      { text: "so good", points: 35, aliases: ["the best", "unstoppable", "amazing"] },
      { text: "better than Brady", points: 25, aliases: ["the goat", "surpassing brady"] },
      { text: "always in the Super Bowl", points: 18, aliases: ["always winning", "in every super bowl"] },
      { text: "voice so weird", points: 12, aliases: ["voice", "sound like that", "frog voice"] },
      { text: "on every commercial", points: 10, aliases: ["in so many ads", "state farm"] },
    ]},
    { text: "NFL teams that have never", answers: [
      { text: "won a Super Bowl", points: 35, aliases: ["won the super bowl", "no championships"] },
      { text: "been to a Super Bowl", points: 25, aliases: ["made the super bowl", "never appeared"] },
      { text: "had a good quarterback", points: 18, aliases: ["good qb", "franchise qb"] },
      { text: "had a winning season", points: 12, aliases: ["won more than lost", "above 500"] },
      { text: "sold out a game", points: 10, aliases: ["filled their stadium", "blackout"] },
    ]},
    { text: "Tom Brady retirement", answers: [
      { text: "un-retirement", points: 30, aliases: ["came back", "unretired", "returned"] },
      { text: "speech", points: 25, aliases: ["retirement speech", "ceremony"] },
      { text: "date", points: 18, aliases: ["when did he retire", "what year"] },
      { text: "Fox broadcasting", points: 15, aliases: ["fox sports", "announcer", "commentator"] },
      { text: "GOAT debate", points: 12, aliases: ["greatest ever", "best ever"] },
    ]},
    { text: "NFL player arrested for", answers: [
      { text: "DUI", points: 30, aliases: ["drunk driving", "dwi"] },
      { text: "domestic violence", points: 25, aliases: ["assault", "dv"] },
      { text: "drugs", points: 20, aliases: ["drug possession", "marijuana", "weed"] },
      { text: "guns", points: 15, aliases: ["weapons charge", "firearm", "gun charge"] },
      { text: "speeding", points: 10, aliases: ["reckless driving", "driving too fast"] },
    ]},
    { text: "Best NFL touchdown celebration", answers: [
      { text: "Griddy", points: 30, aliases: ["the griddy", "hit the griddy"] },
      { text: "Lambeau Leap", points: 25, aliases: ["leaping into crowd", "packers leap"] },
      { text: "spike", points: 18, aliases: ["gronk spike", "football spike"] },
      { text: "team photo", points: 15, aliases: ["group celebration", "group photo"] },
      { text: "CPR celebration", points: 12, aliases: ["defibrillator", "chest compressions"] },
    ]},
  ],
  // Day 2
  [
    { text: "The Super Bowl halftime show", answers: [
      { text: "best performance", points: 30, aliases: ["greatest show", "best ever"] },
      { text: "worst performance", points: 25, aliases: ["terrible", "disaster"] },
      { text: "this year", points: 20, aliases: ["2025", "who is performing"] },
      { text: "wardrobe malfunction", points: 15, aliases: ["janet jackson", "nipplegate"] },
      { text: "too long", points: 10, aliases: ["takes too long", "boring"] },
    ]},
    { text: "NFL quarterback who can't", answers: [
      { text: "throw deep", points: 28, aliases: ["throw the deep ball", "no arm strength"] },
      { text: "run", points: 25, aliases: ["move", "scramble", "escape the pocket"] },
      { text: "win big games", points: 22, aliases: ["win in the playoffs", "choke"] },
      { text: "read defenses", points: 15, aliases: ["make reads", "see the field"] },
      { text: "stay healthy", points: 10, aliases: ["avoid injury", "always hurt"] },
    ]},
    { text: "Things NFL coaches yell", answers: [
      { text: "challenge it", points: 28, aliases: ["throw the flag", "challenge the play"] },
      { text: "run the ball", points: 25, aliases: ["give it to the running back", "pound the rock"] },
      { text: "get back on defense", points: 20, aliases: ["hustle back", "get back"] },
      { text: "timeout", points: 17, aliases: ["call timeout", "time out"] },
      { text: "come on ref", points: 10, aliases: ["bad call ref", "are you kidding me"] },
    ]},
    { text: "Cowboys fans always say", answers: [
      { text: "this is our year", points: 35, aliases: ["we're winning it all", "super bowl bound"] },
      { text: "America's team", points: 25, aliases: ["we're americas team"] },
      { text: "fire the coach", points: 18, aliases: ["fire mccarthy", "fire jerry"] },
      { text: "we need a new QB", points: 12, aliases: ["dak is overrated", "bench dak"] },
      { text: "five rings", points: 10, aliases: ["we have 5 super bowls", "dynasty"] },
    ]},
    { text: "NFL draft pick who was a", answers: [
      { text: "bust", points: 32, aliases: ["huge bust", "wasted pick"] },
      { text: "steal", points: 25, aliases: ["late round steal", "bargain"] },
      { text: "surprise", points: 20, aliases: ["shocking pick", "reach"] },
      { text: "hometown hero", points: 13, aliases: ["local kid", "drafted by home team"] },
      { text: "combine warrior", points: 10, aliases: ["great combine", "athletic freak"] },
    ]},
  ],
  // Day 3
  [
    { text: "Worst NFL team right now", answers: [
      { text: "Panthers", points: 28, aliases: ["carolina", "carolina panthers"] },
      { text: "Patriots", points: 25, aliases: ["new england", "new england patriots"] },
      { text: "Giants", points: 22, aliases: ["new york giants", "ny giants"] },
      { text: "Bears", points: 15, aliases: ["chicago", "chicago bears"] },
      { text: "Commanders", points: 10, aliases: ["washington", "washington commanders"] },
    ]},
    { text: "NFL tailgate must have", answers: [
      { text: "grill", points: 30, aliases: ["bbq", "barbecue", "burgers"] },
      { text: "beer", points: 28, aliases: ["drinks", "alcohol", "cold ones"] },
      { text: "cornhole", points: 18, aliases: ["bags", "bean bags", "lawn games"] },
      { text: "jersey", points: 14, aliases: ["team jersey", "gear"] },
      { text: "TV", points: 10, aliases: ["television", "portable tv", "stream"] },
    ]},
    { text: "Aaron Rodgers should", answers: [
      { text: "retire", points: 35, aliases: ["hang it up", "call it a career"] },
      { text: "go back to Green Bay", points: 22, aliases: ["return to packers", "packers"] },
      { text: "stop talking", points: 18, aliases: ["shut up", "be quiet"] },
      { text: "be benched", points: 15, aliases: ["sit on the bench", "backup"] },
      { text: "do ayahuasca again", points: 10, aliases: ["ayahuasca", "go on a retreat"] },
    ]},
    { text: "Reasons the NFL is better than", answers: [
      { text: "college football", points: 30, aliases: ["cfb", "ncaa football"] },
      { text: "the NBA", points: 25, aliases: ["basketball", "nba"] },
      { text: "the MLB", points: 20, aliases: ["baseball"] },
      { text: "soccer", points: 15, aliases: ["football soccer", "mls"] },
      { text: "the NHL", points: 10, aliases: ["hockey"] },
    ]},
    { text: "NFL record that will never be broken", answers: [
      { text: "0-16 season", points: 28, aliases: ["winless season", "lions 0-16"] },
      { text: "2,000 rushing yards", points: 25, aliases: ["2000 yard season", "rushing record"] },
      { text: "single season TD record", points: 20, aliases: ["55 touchdowns", "manning td record"] },
      { text: "career passing yards", points: 15, aliases: ["brady passing record", "most yards ever"] },
      { text: "72 Dolphins undefeated", points: 12, aliases: ["perfect season", "undefeated season"] },
    ]},
  ],
  // Days 4-30 with rotating prompt pools
  ...Array.from({ length: 27 }, (_, i) => generateNFLDay(i + 4)),
]

function generateNFLDay(dayNum: number): Prompt[] {
  const pool: Prompt[][] = [
    [
      { text: "NFL kicker who", answers: [
        { text: "missed the game winner", points: 30, aliases: ["choked", "missed the kick"] },
        { text: "is the GOAT", points: 25, aliases: ["best ever", "greatest kicker"] },
        { text: "got cut mid season", points: 20, aliases: ["released", "fired"] },
        { text: "does trick plays", points: 15, aliases: ["fake field goal", "throws passes"] },
        { text: "celebrates too much", points: 10, aliases: ["over celebrates"] },
      ]},
      { text: "NFL fans who are the most", answers: [
        { text: "loyal", points: 28, aliases: ["dedicated", "die hard", "passionate"] },
        { text: "drunk", points: 25, aliases: ["wasted", "rowdy", "hammered"] },
        { text: "annoying", points: 22, aliases: ["obnoxious", "loud", "insufferable"] },
        { text: "delusional", points: 15, aliases: ["crazy", "out of touch"] },
        { text: "violent", points: 10, aliases: ["fighting", "aggressive"] },
      ]},
      { text: "Best NFL stadium", answers: [
        { text: "SoFi", points: 28, aliases: ["sofi stadium", "rams stadium", "los angeles"] },
        { text: "AT&T Stadium", points: 25, aliases: ["jerry world", "cowboys stadium", "dallas"] },
        { text: "Allegiant Stadium", points: 20, aliases: ["raiders stadium", "las vegas"] },
        { text: "Lambeau Field", points: 17, aliases: ["lambeau", "green bay", "frozen tundra"] },
        { text: "US Bank Stadium", points: 10, aliases: ["vikings stadium", "minneapolis"] },
      ]},
      { text: "NFL team that wastes the most", answers: [
        { text: "money", points: 30, aliases: ["cap space", "salary"] },
        { text: "draft picks", points: 25, aliases: ["picks", "first rounders"] },
        { text: "talent", points: 20, aliases: ["good players", "stars"] },
        { text: "timeouts", points: 15, aliases: ["clock management"] },
        { text: "their fans' time", points: 10, aliases: ["fans patience", "hope"] },
      ]},
      { text: "Worst NFL uniform", answers: [
        { text: "Broncos", points: 28, aliases: ["denver", "denver broncos"] },
        { text: "Commanders", points: 25, aliases: ["washington", "burgundy and gold"] },
        { text: "Bengals", points: 20, aliases: ["cincinnati", "tiger stripes"] },
        { text: "Jaguars", points: 17, aliases: ["jacksonville", "jags"] },
        { text: "Browns", points: 10, aliases: ["cleveland", "orange and brown"] },
      ]},
    ],
    [
      { text: "NFL player who hits the hardest", answers: [
        { text: "safety", points: 28, aliases: ["hard hitting safety", "enforcer"] },
        { text: "linebacker", points: 25, aliases: ["mlb", "thumper"] },
        { text: "running back", points: 22, aliases: ["power back", "bruiser"] },
        { text: "defensive end", points: 15, aliases: ["edge rusher", "pass rusher"] },
        { text: "fullback", points: 10, aliases: ["lead blocker"] },
      ]},
      { text: "What NFL players do in the offseason", answers: [
        { text: "train", points: 30, aliases: ["work out", "lift weights", "stay in shape"] },
        { text: "vacation", points: 25, aliases: ["travel", "go on vacation"] },
        { text: "play golf", points: 20, aliases: ["golf", "hit the links"] },
        { text: "start a podcast", points: 15, aliases: ["podcast", "media"] },
        { text: "get arrested", points: 10, aliases: ["trouble", "legal issues"] },
      ]},
      { text: "The Pro Bowl is", answers: [
        { text: "boring", points: 32, aliases: ["terrible", "unwatchable", "bad"] },
        { text: "flag football now", points: 25, aliases: ["not real football", "flag"] },
        { text: "pointless", points: 20, aliases: ["meaningless", "waste of time"] },
        { text: "in Orlando", points: 13, aliases: ["in florida", "disney"] },
        { text: "getting cancelled", points: 10, aliases: ["being replaced", "going away"] },
      ]},
      { text: "NFL team most likely to move", answers: [
        { text: "Jaguars", points: 28, aliases: ["jacksonville", "jags"] },
        { text: "Chargers", points: 25, aliases: ["la chargers", "los angeles chargers"] },
        { text: "Bengals", points: 22, aliases: ["cincinnati", "cincy"] },
        { text: "Titans", points: 15, aliases: ["tennessee", "nashville"] },
        { text: "Cardinals", points: 10, aliases: ["arizona", "az"] },
      ]},
      { text: "NFL pregame ritual", answers: [
        { text: "prayer", points: 28, aliases: ["team prayer", "pray"] },
        { text: "music", points: 25, aliases: ["headphones", "pump up songs"] },
        { text: "tape ankles", points: 20, aliases: ["get taped up", "taping"] },
        { text: "warm up throws", points: 15, aliases: ["throwing", "catch"] },
        { text: "smelling salts", points: 12, aliases: ["sniffing salts", "ammonia"] },
      ]},
    ],
    [
      { text: "Why is the NFL so", answers: [
        { text: "popular", points: 32, aliases: ["successful", "big", "watched"] },
        { text: "violent", points: 25, aliases: ["dangerous", "physical"] },
        { text: "addicting", points: 18, aliases: ["entertaining", "fun to watch"] },
        { text: "political", points: 15, aliases: ["controversial"] },
        { text: "expensive to attend", points: 10, aliases: ["costly", "overpriced"] },
      ]},
      { text: "Best position to play in the NFL", answers: [
        { text: "quarterback", points: 35, aliases: ["qb", "the quarterback"] },
        { text: "wide receiver", points: 22, aliases: ["wr", "wideout"] },
        { text: "kicker", points: 18, aliases: ["k", "punter", "special teams"] },
        { text: "running back", points: 15, aliases: ["rb"] },
        { text: "long snapper", points: 10, aliases: ["snapper", "deep snapper"] },
      ]},
      { text: "NFL commentator who", answers: [
        { text: "talks too much", points: 28, aliases: ["won't shut up", "never stops talking"] },
        { text: "is biased", points: 25, aliases: ["plays favorites", "homer"] },
        { text: "is the best", points: 22, aliases: ["goat commentator", "legend"] },
        { text: "should be fired", points: 15, aliases: ["is terrible", "needs to go"] },
        { text: "makes no sense", points: 10, aliases: ["says dumb things", "confusing"] },
      ]},
      { text: "Funniest NFL moment", answers: [
        { text: "butt fumble", points: 35, aliases: ["mark sanchez", "sanchez butt fumble"] },
        { text: "wrong way run", points: 20, aliases: ["running wrong way", "wrong direction"] },
        { text: "failed trick play", points: 18, aliases: ["bad trick play"] },
        { text: "celebration penalty", points: 15, aliases: ["flag on celebration"] },
        { text: "coach falling", points: 12, aliases: ["sideline fall", "tripping"] },
      ]},
      { text: "NFL overtime rules are", answers: [
        { text: "unfair", points: 35, aliases: ["broken", "terrible", "bad"] },
        { text: "confusing", points: 22, aliases: ["complicated", "hard to understand"] },
        { text: "better now", points: 18, aliases: ["improved", "fixed"] },
        { text: "exciting", points: 15, aliases: ["fun", "thrilling"] },
        { text: "too long", points: 10, aliases: ["take forever"] },
      ]},
    ],
  ]
  return pool[(dayNum - 4) % pool.length]
}

// ══════════════════════════════════════════════════════════════════════════════
// MLB PROMPTS (30 days × 5 prompts)
// ══════════════════════════════════════════════════════════════════════════════

const MLB_DAYS: Prompt[][] = [
  // Day 1
  [
    { text: "Why is baseball so", answers: [
      { text: "boring", points: 35, aliases: ["slow", "unwatchable", "dull"] },
      { text: "expensive", points: 22, aliases: ["costly", "overpriced"] },
      { text: "long", points: 20, aliases: ["many games", "162 games"] },
      { text: "hard to hit", points: 13, aliases: ["difficult", "challenging"] },
      { text: "American", points: 10, aliases: ["traditional", "classic"] },
    ]},
    { text: "Shohei Ohtani is", answers: [
      { text: "not human", points: 30, aliases: ["alien", "superhuman", "a robot"] },
      { text: "the best player ever", points: 25, aliases: ["goat", "greatest"] },
      { text: "overpaid", points: 18, aliases: ["making too much", "700 million"] },
      { text: "a two way player", points: 17, aliases: ["pitcher and hitter", "does everything"] },
      { text: "from Japan", points: 10, aliases: ["japanese", "came from npb"] },
    ]},
    { text: "Best baseball movie", answers: [
      { text: "Field of Dreams", points: 28, aliases: ["field of dreams", "if you build it"] },
      { text: "Sandlot", points: 25, aliases: ["the sandlot", "you're killing me smalls"] },
      { text: "Major League", points: 22, aliases: ["wild thing"] },
      { text: "Moneyball", points: 15, aliases: ["brad pitt baseball", "billy beane"] },
      { text: "A League of Their Own", points: 10, aliases: ["league of their own", "there's no crying"] },
    ]},
    { text: "Things baseball fans yell", answers: [
      { text: "you're blind ump", points: 30, aliases: ["bad call", "open your eyes", "get glasses"] },
      { text: "charge", points: 25, aliases: ["da da da da da da"] },
      { text: "overrated", points: 18, aliases: ["you suck"] },
      { text: "let's go", points: 17, aliases: ["lets go team", "clap clap"] },
      { text: "get a hit", points: 10, aliases: ["base hit", "come on"] },
    ]},
    { text: "MLB unwritten rules about", answers: [
      { text: "bat flipping", points: 28, aliases: ["bat flip", "pimping a home run"] },
      { text: "bunting in a no hitter", points: 25, aliases: ["breaking up no hitter", "bunt no no"] },
      { text: "stealing when ahead", points: 22, aliases: ["running up the score", "stealing bases"] },
      { text: "watching home runs", points: 15, aliases: ["admiring", "staring at the ball"] },
      { text: "hitting batters", points: 10, aliases: ["plunking", "throwing at guys"] },
    ]},
  ],
  // Day 2
  [
    { text: "Yankees vs Red Sox", answers: [
      { text: "rivalry", points: 35, aliases: ["greatest rivalry", "best rivalry"] },
      { text: "history", points: 22, aliases: ["all time", "rivalry history"] },
      { text: "fights", points: 18, aliases: ["brawls", "bench clearing"] },
      { text: "who has more titles", points: 15, aliases: ["championships", "world series"] },
      { text: "tickets", points: 10, aliases: ["how much", "expensive tickets"] },
    ]},
    { text: "Baseball player with the best", answers: [
      { text: "swing", points: 30, aliases: ["batting stance", "sweet swing"] },
      { text: "arm", points: 25, aliases: ["cannon", "throwing arm"] },
      { text: "walkup song", points: 20, aliases: ["at bat song", "music"] },
      { text: "mustache", points: 15, aliases: ["facial hair", "stache"] },
      { text: "superstition", points: 10, aliases: ["ritual", "routine"] },
    ]},
    { text: "Why do pitchers", answers: [
      { text: "throw so hard", points: 28, aliases: ["how fast", "100 mph"] },
      { text: "get injured", points: 25, aliases: ["tommy john", "arm injuries"] },
      { text: "use sticky stuff", points: 22, aliases: ["pine tar", "spider tack", "cheat"] },
      { text: "take so long", points: 15, aliases: ["slow pace", "step off"] },
      { text: "hit batters", points: 10, aliases: ["bean batters", "plunk guys"] },
    ]},
    { text: "The World Series should", answers: [
      { text: "have a salary cap", points: 28, aliases: ["cap spending", "level the field"] },
      { text: "be shorter", points: 25, aliases: ["fewer games", "best of 5"] },
      { text: "start earlier", points: 20, aliases: ["not be so late", "warmer weather"] },
      { text: "have a DH everywhere", points: 17, aliases: ["universal dh", "dh in both leagues"] },
      { text: "be on network TV", points: 10, aliases: ["free tv", "not on cable"] },
    ]},
    { text: "Most overpaid MLB player", answers: [
      { text: "ever", points: 28, aliases: ["of all time", "worst contract ever"] },
      { text: "right now", points: 25, aliases: ["currently", "this season"] },
      { text: "who can't hit", points: 22, aliases: ["batting 200", "strikes out too much"] },
      { text: "on the injured list", points: 15, aliases: ["always hurt", "dl"] },
      { text: "on the Yankees", points: 10, aliases: ["yankees payroll"] },
    ]},
  ],
  // Day 3
  [
    { text: "Baseball food ranked", answers: [
      { text: "hot dog", points: 32, aliases: ["hotdog", "dogs", "frank"] },
      { text: "nachos", points: 25, aliases: ["cheese nachos", "loaded nachos"] },
      { text: "peanuts", points: 20, aliases: ["cracker jacks", "cracker jack"] },
      { text: "pretzel", points: 13, aliases: ["soft pretzel"] },
      { text: "garlic fries", points: 10, aliases: ["fries", "french fries"] },
    ]},
    { text: "Steroids in baseball", answers: [
      { text: "Barry Bonds", points: 30, aliases: ["bonds", "barry"] },
      { text: "should they be in the Hall", points: 25, aliases: ["hall of fame", "cooperstown"] },
      { text: "home run record", points: 20, aliases: ["762", "asterisk"] },
      { text: "testing policy", points: 15, aliases: ["drug testing", "ped policy"] },
      { text: "everyone was doing it", points: 10, aliases: ["steroid era", "whole era"] },
    ]},
    { text: "Best MLB team mascot", answers: [
      { text: "Phillie Phanatic", points: 30, aliases: ["phanatic", "phillies mascot"] },
      { text: "Mr. Met", points: 25, aliases: ["mets mascot"] },
      { text: "Orbit", points: 18, aliases: ["astros mascot"] },
      { text: "Wally the Green Monster", points: 15, aliases: ["wally", "red sox mascot"] },
      { text: "Rally Monkey", points: 12, aliases: ["angels mascot", "anaheim"] },
    ]},
    { text: "Things only baseball fans understand", answers: [
      { text: "infield fly rule", points: 28, aliases: ["infield fly", "iff"] },
      { text: "balk", points: 25, aliases: ["what is a balk", "balk rules"] },
      { text: "WHIP", points: 20, aliases: ["era vs whip", "pitcher stats"] },
      { text: "sacrifice fly", points: 15, aliases: ["sac fly", "productive out"] },
      { text: "the shift", points: 12, aliases: ["defensive shift", "positioning"] },
    ]},
    { text: "MLB season is too", answers: [
      { text: "long", points: 40, aliases: ["many games", "162 is too many"] },
      { text: "boring", points: 22, aliases: ["slow", "uneventful"] },
      { text: "late", points: 18, aliases: ["ends too late", "october games late"] },
      { text: "expensive to follow", points: 12, aliases: ["blackouts", "streaming costs"] },
      { text: "early", points: 8, aliases: ["starts too early", "cold weather"] },
    ]},
  ],
  // Days 4-30
  ...Array.from({ length: 27 }, (_, i) => generateMLBDay(i + 4)),
]

function generateMLBDay(dayNum: number): Prompt[] {
  const pool: Prompt[][] = [
    [
      { text: "Best pitch in baseball", answers: [
        { text: "fastball", points: 28, aliases: ["heater", "4 seam", "four seam"] },
        { text: "slider", points: 25, aliases: ["slurve"] },
        { text: "curveball", points: 22, aliases: ["curve", "12-6"] },
        { text: "changeup", points: 15, aliases: ["change up", "change"] },
        { text: "knuckleball", points: 10, aliases: ["knuckler"] },
      ]},
      { text: "Worst baseball stadium", answers: [
        { text: "Tropicana Field", points: 30, aliases: ["the trop", "rays stadium", "tampa"] },
        { text: "Oakland Coliseum", points: 25, aliases: ["oakland", "the coliseum"] },
        { text: "Guaranteed Rate", points: 20, aliases: ["white sox park", "us cellular"] },
        { text: "Rogers Centre", points: 15, aliases: ["skydome", "toronto"] },
        { text: "loanDepot Park", points: 10, aliases: ["marlins park", "miami"] },
      ]},
      { text: "Baseball players who", answers: [
        { text: "chew tobacco", points: 28, aliases: ["dip", "chew", "spit"] },
        { text: "have long hair", points: 25, aliases: ["flow", "lettuce"] },
        { text: "wear gold chains", points: 20, aliases: ["chains", "jewelry", "bling"] },
        { text: "argue with umps", points: 15, aliases: ["get ejected", "thrown out"] },
        { text: "play multiple positions", points: 12, aliases: ["utility player", "super utility"] },
      ]},
      { text: "Biggest MLB trade", answers: [
        { text: "Babe Ruth to Yankees", points: 30, aliases: ["ruth trade", "curse of bambino"] },
        { text: "Mookie Betts", points: 25, aliases: ["betts trade", "red sox to dodgers"] },
        { text: "deadline deal", points: 20, aliases: ["trade deadline", "july trade"] },
        { text: "A-Rod trade", points: 15, aliases: ["alex rodriguez", "arod"] },
        { text: "Juan Soto", points: 10, aliases: ["soto trade", "soto to yankees"] },
      ]},
      { text: "Best baseball stadium food", answers: [
        { text: "Dodger Dog", points: 28, aliases: ["dodger dogs", "la hot dog"] },
        { text: "Fenway Frank", points: 25, aliases: ["fenway hot dog", "boston"] },
        { text: "garlic fries", points: 22, aliases: ["sf garlic fries", "gilroy garlic"] },
        { text: "BBQ nachos", points: 15, aliases: ["loaded nachos", "bbq"] },
        { text: "crab cake", points: 10, aliases: ["baltimore crab", "camden yards"] },
      ]},
    ],
    [
      { text: "Umpire who", answers: [
        { text: "blew the call", points: 30, aliases: ["worst call", "missed call"] },
        { text: "has the best strike call", points: 25, aliases: ["cool strike three", "punchout"] },
        { text: "should be replaced by robots", points: 20, aliases: ["robot umps", "automated"] },
        { text: "Angel Hernandez", points: 15, aliases: ["hernandez", "angel"] },
        { text: "ejected the most players", points: 10, aliases: ["most ejections"] },
      ]},
      { text: "Things pitchers hide in their", answers: [
        { text: "glove", points: 30, aliases: ["mitt"] },
        { text: "hat", points: 25, aliases: ["cap", "brim"] },
        { text: "belt", points: 20, aliases: ["waistband"] },
        { text: "hair", points: 15, aliases: ["under the hair"] },
        { text: "rosin bag", points: 10, aliases: ["rosin"] },
      ]},
      { text: "Best MLB walk-up song", answers: [
        { text: "Enter Sandman", points: 28, aliases: ["metallica", "mariano rivera"] },
        { text: "Bad to the Bone", points: 22, aliases: ["george thorogood"] },
        { text: "Crazy Train", points: 20, aliases: ["ozzy", "ozzy osbourne"] },
        { text: "Thunderstruck", points: 18, aliases: ["acdc", "ac dc"] },
        { text: "Shipping Up to Boston", points: 12, aliases: ["dropkick murphys"] },
      ]},
      { text: "Why do catchers", answers: [
        { text: "squat all game", points: 28, aliases: ["kneel", "crouch"] },
        { text: "call the pitches", points: 25, aliases: ["pick the pitch", "shake off"] },
        { text: "wear so much gear", points: 22, aliases: ["equipment", "pads", "tools of ignorance"] },
        { text: "block the plate", points: 15, aliases: ["home plate collision"] },
        { text: "get paid less", points: 10, aliases: ["underpaid", "undervalued"] },
      ]},
      { text: "MLB team with the worst", answers: [
        { text: "ownership", points: 30, aliases: ["cheapest owner", "bad owner"] },
        { text: "fans", points: 22, aliases: ["worst fans", "empty stadium"] },
        { text: "uniforms", points: 20, aliases: ["jerseys", "bad colors"] },
        { text: "luck", points: 16, aliases: ["cursed", "bad luck"] },
        { text: "farm system", points: 12, aliases: ["minor leagues", "prospects"] },
      ]},
    ],
  ]
  return pool[(dayNum - 4) % pool.length]
}

// ══════════════════════════════════════════════════════════════════════════════
// NHL PROMPTS (30 days × 5 prompts)
// ══════════════════════════════════════════════════════════════════════════════

const NHL_DAYS: Prompt[][] = [
  // Day 1
  [
    { text: "Hockey fans are known for", answers: [
      { text: "throwing hats", points: 28, aliases: ["hat trick", "hats on the ice"] },
      { text: "fighting", points: 25, aliases: ["loving fights", "brawls"] },
      { text: "throwing octopus", points: 20, aliases: ["detroit octopus", "red wings tradition"] },
      { text: "being drunk", points: 17, aliases: ["drinking", "beer"] },
      { text: "playoff beards", points: 10, aliases: ["growing beards", "not shaving"] },
    ]},
    { text: "Best hockey fight", answers: [
      { text: "ever", points: 28, aliases: ["of all time", "greatest fight"] },
      { text: "this season", points: 25, aliases: ["recent", "latest"] },
      { text: "goalie fight", points: 22, aliases: ["goalies fighting", "goalie brawl"] },
      { text: "bench clearing brawl", points: 15, aliases: ["bench brawl", "line brawl"] },
      { text: "at center ice", points: 10, aliases: ["opening faceoff fight"] },
    ]},
    { text: "Why is hockey so", answers: [
      { text: "fast", points: 30, aliases: ["quick", "high speed"] },
      { text: "underrated", points: 25, aliases: ["unpopular", "not popular enough"] },
      { text: "violent", points: 20, aliases: ["physical", "brutal"] },
      { text: "hard to follow on TV", points: 15, aliases: ["can't see the puck", "hard to watch"] },
      { text: "expensive to play", points: 10, aliases: ["costly", "gear is expensive"] },
    ]},
    { text: "NHL player who could", answers: [
      { text: "beat anyone in a fight", points: 28, aliases: ["toughest", "enforcer", "best fighter"] },
      { text: "play in the NFL", points: 25, aliases: ["be a football player"] },
      { text: "score 100 goals", points: 20, aliases: ["break gretzky records"] },
      { text: "be a male model", points: 15, aliases: ["most attractive", "best looking"] },
      { text: "eat the most", points: 12, aliases: ["biggest eater", "food challenge"] },
    ]},
    { text: "The Stanley Cup is", answers: [
      { text: "the best trophy in sports", points: 35, aliases: ["greatest trophy", "best trophy"] },
      { text: "heavy", points: 22, aliases: ["how much does it weigh", "35 pounds"] },
      { text: "old", points: 18, aliases: ["how old", "oldest trophy"] },
      { text: "engraved with names", points: 15, aliases: ["names on it", "player names"] },
      { text: "dented", points: 10, aliases: ["damaged", "been dropped"] },
    ]},
  ],
  // Day 2
  [
    { text: "Wayne Gretzky record", answers: [
      { text: "most goals", points: 28, aliases: ["894 goals", "career goals"] },
      { text: "most assists", points: 25, aliases: ["career assists", "1963 assists"] },
      { text: "most points", points: 22, aliases: ["career points", "2857"] },
      { text: "that will never be broken", points: 15, aliases: ["unbreakable", "impossible"] },
      { text: "50 goals in 39 games", points: 10, aliases: ["fastest 50", "39 games"] },
    ]},
    { text: "Things hockey players do after winning", answers: [
      { text: "lift the Cup", points: 30, aliases: ["raise the cup", "hold the cup over head"] },
      { text: "grow a beard", points: 22, aliases: ["shave their beard", "playoff beard"] },
      { text: "drink from the Cup", points: 20, aliases: ["champagne", "beer from cup"] },
      { text: "take it to their hometown", points: 16, aliases: ["day with the cup", "bring it home"] },
      { text: "jump in a pool", points: 12, aliases: ["pool party", "celebrate"] },
    ]},
    { text: "NHL goalies are known for", answers: [
      { text: "being weird", points: 30, aliases: ["crazy", "strange", "eccentric"] },
      { text: "cool masks", points: 25, aliases: ["painted masks", "helmet art"] },
      { text: "butterfly style", points: 18, aliases: ["going down", "save style"] },
      { text: "fighting", points: 15, aliases: ["goalie fights", "brawling"] },
      { text: "knocking over the net", points: 12, aliases: ["pushing the net", "dislodging"] },
    ]},
    { text: "Best hockey team name", answers: [
      { text: "Penguins", points: 25, aliases: ["pittsburgh", "pittsburgh penguins"] },
      { text: "Avalanche", points: 25, aliases: ["colorado", "avs"] },
      { text: "Kraken", points: 22, aliases: ["seattle", "seattle kraken"] },
      { text: "Blackhawks", points: 16, aliases: ["chicago", "hawks"] },
      { text: "Lightning", points: 12, aliases: ["tampa", "tampa bay lightning"] },
    ]},
    { text: "Worst thing about hockey", answers: [
      { text: "blackouts on TV", points: 28, aliases: ["can't watch", "tv deals", "streaming"] },
      { text: "fighting", points: 22, aliases: ["the fights", "too violent"] },
      { text: "hard to see the puck", points: 22, aliases: ["puck too small", "where is the puck"] },
      { text: "offsides reviews", points: 16, aliases: ["coaches challenge", "replay"] },
      { text: "the shootout", points: 12, aliases: ["shootouts", "ties should exist"] },
    ]},
  ],
  // Day 3
  [
    { text: "Connor McDavid is", answers: [
      { text: "the fastest skater", points: 30, aliases: ["so fast", "fastest player"] },
      { text: "the best player alive", points: 25, aliases: ["best in the world", "number one"] },
      { text: "from Canada", points: 18, aliases: ["canadian", "edmonton"] },
      { text: "underrated somehow", points: 15, aliases: ["not appreciated", "doesn't get enough credit"] },
      { text: "going to leave Edmonton", points: 12, aliases: ["leaving the oilers", "trade request"] },
    ]},
    { text: "Hockey players missing", answers: [
      { text: "teeth", points: 40, aliases: ["front teeth", "no teeth", "chiclets"] },
      { text: "hair", points: 20, aliases: ["bald", "helmet hair"] },
      { text: "the net", points: 18, aliases: ["wide open net", "empty net miss"] },
      { text: "their families", points: 12, aliases: ["road trips", "away from home"] },
      { text: "sleep", points: 10, aliases: ["tired", "exhausted"] },
    ]},
    { text: "Best NHL arena", answers: [
      { text: "Bell Centre", points: 28, aliases: ["montreal", "canadiens arena"] },
      { text: "Madison Square Garden", points: 25, aliases: ["msg", "rangers arena"] },
      { text: "Scotiabank Arena", points: 20, aliases: ["toronto", "leafs arena"] },
      { text: "Climate Pledge Arena", points: 15, aliases: ["seattle", "kraken arena"] },
      { text: "T-Mobile Arena", points: 12, aliases: ["vegas", "golden knights"] },
    ]},
    { text: "NHL playoff tradition", answers: [
      { text: "playoff beard", points: 30, aliases: ["growing a beard", "not shaving"] },
      { text: "towel waving", points: 25, aliases: ["white towel", "rally towel"] },
      { text: "hat trick hats", points: 20, aliases: ["throwing hats", "hats on ice"] },
      { text: "handshake line", points: 15, aliases: ["shaking hands", "postgame handshake"] },
      { text: "octopus throwing", points: 10, aliases: ["detroit", "octopus on ice"] },
    ]},
    { text: "Weirdest thing in the Stanley Cup", answers: [
      { text: "baby", points: 28, aliases: ["put a baby in it", "baby bath"] },
      { text: "cereal", points: 25, aliases: ["eating cereal from it", "breakfast"] },
      { text: "beer", points: 20, aliases: ["drinking beer", "filled with beer"] },
      { text: "dog food", points: 15, aliases: ["fed the dog", "pet food"] },
      { text: "baptism water", points: 12, aliases: ["baptized in it", "holy water"] },
    ]},
  ],
  // Days 4-30
  ...Array.from({ length: 27 }, (_, i) => generateNHLDay(i + 4)),
]

function generateNHLDay(dayNum: number): Prompt[] {
  const pool: Prompt[][] = [
    [
      { text: "Hockey players always", answers: [
        { text: "lose teeth", points: 30, aliases: ["missing teeth", "no front teeth"] },
        { text: "fight", points: 25, aliases: ["drop the gloves", "throw hands"] },
        { text: "play hurt", points: 20, aliases: ["play through injury", "tough it out"] },
        { text: "have flow", points: 15, aliases: ["long hair", "lettuce", "mullet"] },
        { text: "tape their sticks", points: 10, aliases: ["stick tape", "blade tape"] },
      ]},
      { text: "Most iconic NHL goal", answers: [
        { text: "Miracle on Ice", points: 30, aliases: ["1980 usa", "do you believe in miracles"] },
        { text: "Gretzky's records", points: 22, aliases: ["wayne gretzky", "the great one"] },
        { text: "Bobby Orr flying", points: 22, aliases: ["orr flying goal", "1970 cup winner"] },
        { text: "Crosby golden goal", points: 16, aliases: ["2010 olympics", "canada gold"] },
        { text: "Ovechkin 700th", points: 10, aliases: ["ovi 700", "ovechkin milestone"] },
      ]},
      { text: "NHL team that should relocate", answers: [
        { text: "Coyotes", points: 28, aliases: ["arizona", "arizona coyotes", "utah now"] },
        { text: "Panthers", points: 25, aliases: ["florida", "florida panthers"] },
        { text: "Blue Jackets", points: 20, aliases: ["columbus", "ohio"] },
        { text: "Senators", points: 15, aliases: ["ottawa", "ottawa senators"] },
        { text: "Predators", points: 12, aliases: ["nashville", "nashville predators"] },
      ]},
      { text: "Hardest position in hockey", answers: [
        { text: "goalie", points: 35, aliases: ["goaltender", "netminder"] },
        { text: "defenseman", points: 25, aliases: ["defense", "d-man"] },
        { text: "center", points: 18, aliases: ["centerman", "faceoffs"] },
        { text: "enforcer", points: 12, aliases: ["tough guy", "fighter"] },
        { text: "power play QB", points: 10, aliases: ["point man", "pp quarterback"] },
      ]},
      { text: "Funniest hockey moment", answers: [
        { text: "puck over glass delay", points: 25, aliases: ["delay of game", "accidental"] },
        { text: "goalie own goal", points: 25, aliases: ["own goal", "goalie mistake"] },
        { text: "fan throwing something on ice", points: 20, aliases: ["catfish", "rat", "octopus"] },
        { text: "ref getting hit", points: 18, aliases: ["ref falls", "official hit by puck"] },
        { text: "player falling over nothing", points: 12, aliases: ["tripping on nothing", "phantom trip"] },
      ]},
    ],
    [
      { text: "Alex Ovechkin will", answers: [
        { text: "break Gretzky's goal record", points: 35, aliases: ["895 goals", "pass gretzky", "most goals ever"] },
        { text: "retire a Capital", points: 22, aliases: ["stay in washington", "one team"] },
        { text: "be in the Hall of Fame", points: 18, aliases: ["hall of famer", "first ballot"] },
        { text: "play until 45", points: 15, aliases: ["never retire", "play forever"] },
        { text: "have a statue", points: 10, aliases: ["statue outside arena"] },
      ]},
      { text: "NHL penalty that makes no sense", answers: [
        { text: "delay of game puck over glass", points: 30, aliases: ["puck over glass", "accidental clear"] },
        { text: "too many men", points: 22, aliases: ["too many men on ice", "bench penalty"] },
        { text: "embellishment", points: 20, aliases: ["diving", "simulation"] },
        { text: "instigator", points: 16, aliases: ["instigator penalty", "starting a fight"] },
        { text: "goalie interference", points: 12, aliases: ["gi", "crease violation"] },
      ]},
      { text: "Best hockey hair", answers: [
        { text: "flow", points: 30, aliases: ["long hair", "lettuce", "salad"] },
        { text: "mullet", points: 25, aliases: ["business in front", "hockey mullet"] },
        { text: "playoff beard", points: 20, aliases: ["beard", "facial hair"] },
        { text: "Jagr mullet", points: 15, aliases: ["jaromir jagr", "jagr hair"] },
        { text: "bald head", points: 10, aliases: ["shaved", "no hair"] },
      ]},
      { text: "Why don't Americans watch hockey", answers: [
        { text: "bad TV deals", points: 28, aliases: ["blackouts", "can't find games"] },
        { text: "too fast to follow", points: 25, aliases: ["hard to see puck", "confusing"] },
        { text: "other sports more popular", points: 20, aliases: ["nfl nba mlb", "competition"] },
        { text: "never played it", points: 15, aliases: ["no youth hockey", "expensive sport"] },
        { text: "no stars marketed well", points: 12, aliases: ["bad marketing", "no personalities"] },
      ]},
      { text: "Craziest Stanley Cup story", answers: [
        { text: "left on side of road", points: 28, aliases: ["abandoned", "roadside"] },
        { text: "thrown in a pool", points: 22, aliases: ["pool party", "swimming pool"] },
        { text: "baby in the Cup", points: 20, aliases: ["baby bath", "infant"] },
        { text: "kicked into canal", points: 18, aliases: ["rideau canal", "in the water"] },
        { text: "dented at a party", points: 12, aliases: ["damaged", "broken"] },
      ]},
    ],
  ]
  return pool[(dayNum - 4) % pool.length]
}

// ══════════════════════════════════════════════════════════════════════════════
// Seed function
// ══════════════════════════════════════════════════════════════════════════════

async function seed() {
  const startDate = new Date()
  let success = 0
  let failed = 0

  for (let day = 0; day < 30; day++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + day)
    const dateStr = date.toISOString().split('T')[0]

    const datasets = [
      { league: 'NBA', prompts: NBA_DAYS[day] },
      { league: 'NFL', prompts: NFL_DAYS[day] },
      { league: 'MLB', prompts: MLB_DAYS[day] },
      { league: 'NHL', prompts: NHL_DAYS[day] },
    ]

    for (const { league, prompts } of datasets) {
      if (!prompts) {
        console.error('Missing prompts for day ' + day + ' ' + league)
        failed++
        continue
      }
      const { error } = await supabase
        .from('daily_games')
        .upsert(
          { date: dateStr, league, auto_complete: { league, prompts } },
          { onConflict: 'date,league' }
        )
      if (error) {
        console.error('X ' + dateStr + ' ' + league + ':', error.message)
        failed++
      } else {
        console.log('OK ' + dateStr + ' ' + league)
        success++
      }
    }
  }

  console.log('\nDone. ' + success + ' seeded, ' + failed + ' failed.')
}

seed().catch(console.error)
