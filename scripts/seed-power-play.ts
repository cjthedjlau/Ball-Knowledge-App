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
    { text: "Name something a superstar does when he wants out of his city", answers: [
      { text: "Demands a trade", points: 42, aliases: ["trade demand", "requests trade", "asks for trade"] },
      { text: "Stops trying on defense", points: 24, aliases: ["quits on defense", "dogs it", "tanks"] },
      { text: "Goes public with complaints", points: 16, aliases: ["talks to media", "goes to press", "complains publicly"] },
      { text: "Skips games with fake injuries", points: 10, aliases: ["fakes injury", "load management", "sits out"] },
      { text: "Fires his agent", points: 8, aliases: ["changes agents", "gets new agent"] },
    ]},
    { text: "Name something fans boo at an NBA game", answers: [
      { text: "Bad call by the referee", points: 40, aliases: ["bad ref call", "referee", "foul call", "refs"] },
      { text: "The opposing star player", points: 26, aliases: ["visiting star", "opposing player"] },
      { text: "A player who left the team", points: 18, aliases: ["former player", "ex player", "traitor"] },
      { text: "The home team when they're losing", points: 10, aliases: ["own team", "home team"] },
      { text: "A flopper", points: 6, aliases: ["flopping", "diving", "fake foul"] },
    ]},
    { text: "Name a reason a player misses the All-Star game", answers: [
      { text: "Injury", points: 38, aliases: ["hurt", "injured", "health", "sore"] },
      { text: "Load management / rest", points: 28, aliases: ["resting", "load management", "sitting out"] },
      { text: "Poor season stats", points: 18, aliases: ["bad season", "down year", "underperforming"] },
      { text: "Suspension", points: 10, aliases: ["suspended", "banned"] },
      { text: "Personal reasons", points: 6, aliases: ["family", "personal"] },
    ]},
    { text: "Name something that happens when a player wins MVP", answers: [
      { text: "Gets a max contract", points: 36, aliases: ["max deal", "big contract", "gets paid", "contract extension"] },
      { text: "Media tours and interviews", points: 25, aliases: ["press", "interviews", "media attention"] },
      { text: "Jersey sales go up", points: 20, aliases: ["jersey demand", "merch sales"] },
      { text: "Gets endorsement deals", points: 12, aliases: ["sponsorships", "endorsements", "shoe deal"] },
      { text: "City throws a parade", points: 7, aliases: ["parade", "celebration"] },
    ]},
    { text: "Name something a point guard gets blamed for when the team loses", answers: [
      { text: "Too many turnovers", points: 38, aliases: ["turnovers", "giving the ball away"] },
      { text: "Not getting teammates involved", points: 26, aliases: ["ball hogging", "selfish", "not passing"] },
      { text: "Bad shot selection", points: 18, aliases: ["bad shots", "poor shooting", "taking bad shots"] },
      { text: "Not controlling pace", points: 10, aliases: ["pace", "tempo", "rushing"] },
      { text: "Poor late game decisions", points: 8, aliases: ["late game", "clutch decisions"] },
    ]},
  ],

  // Day 2
  [
    { text: "Name something a coach does to slow down a player who is on fire", answers: [
      { text: "Calls a timeout", points: 40, aliases: ["timeout", "calls time"] },
      { text: "Puts a bigger defender on him", points: 28, aliases: ["switches defender", "sends better guard", "better defense"] },
      { text: "Plays zone defense", points: 16, aliases: ["zone", "switches to zone", "zone scheme"] },
      { text: "Doubles the ball handler", points: 10, aliases: ["double team", "doubles him", "traps"] },
      { text: "Complains to the refs", points: 6, aliases: ["argues with refs", "talks to referees"] },
    ]},
    { text: "Name a reason fans hate load management", answers: [
      { text: "Paid for tickets to see the star", points: 38, aliases: ["bought tickets", "paid to see star", "expensive tickets"] },
      { text: "Star looks perfectly healthy", points: 27, aliases: ["player looks fine", "seems healthy", "not injured"] },
      { text: "It's disrespectful to fans", points: 18, aliases: ["disrespects fans", "fans deserve better", "unfair to fans"] },
      { text: "Hurts the team in standings", points: 11, aliases: ["loses games", "costs wins", "standings"] },
      { text: "Other teams don't do it", points: 6, aliases: ["unfair advantage", "other teams play"] },
    ]},
    { text: "Name something a player does after hitting a huge game winner", answers: [
      { text: "Screams or runs across the court", points: 35, aliases: ["screams", "sprints", "runs away", "celebration run"] },
      { text: "Stares down or taunts the defense", points: 28, aliases: ["trash talks", "taunts", "stands over defender"] },
      { text: "Points to the sky", points: 18, aliases: ["looks up", "points up", "thanks God"] },
      { text: "Jumps into the crowd", points: 11, aliases: ["dives into stands", "fan celebration"] },
      { text: "Chest bumps teammates", points: 8, aliases: ["celebrates with team", "teammate celebration"] },
    ]},
    { text: "We asked 100 sports fans: Name a team known for always being in rebuilding mode", answers: [
      { text: "Sacramento Kings", points: 38, aliases: ["Kings", "Sacramento"] },
      { text: "Charlotte Hornets", points: 24, aliases: ["Hornets", "Charlotte"] },
      { text: "Orlando Magic", points: 18, aliases: ["Magic", "Orlando"] },
      { text: "Detroit Pistons", points: 12, aliases: ["Pistons", "Detroit"] },
      { text: "Washington Wizards", points: 8, aliases: ["Wizards", "Washington"] },
    ]},
    { text: "Name something a player does when he gets fouled hard and doesn't get the call", answers: [
      { text: "Stares at the referee", points: 36, aliases: ["looks at ref", "glares at ref", "gives ref a look"] },
      { text: "Throws his arms up in frustration", points: 28, aliases: ["arms up", "throws hands", "throws arms"] },
      { text: "Yells at the ref", points: 20, aliases: ["argues with ref", "curses at ref", "screams at official"] },
      { text: "Shakes his head", points: 10, aliases: ["head shake", "shakes head in disbelief"] },
      { text: "Gets a technical foul", points: 6, aliases: ["technical", "T'd up", "tech foul"] },
    ]},
  ],

  // Day 3
  [
    { text: "Name something that makes an NBA rivalry intense", answers: [
      { text: "Teams meet in the playoffs every year", points: 40, aliases: ["playoff matchups", "recurring playoffs", "annual playoff"] },
      { text: "Star players have personal beef", points: 27, aliases: ["player feuds", "personal conflict", "players hate each other"] },
      { text: "History of dirty plays", points: 18, aliases: ["flagrant fouls", "cheap shots", "bad blood"] },
      { text: "Same city or close geographically", points: 9, aliases: ["geographic rivalry", "same market", "nearby cities"] },
      { text: "Fans are equally passionate", points: 6, aliases: ["both fanbases", "passionate fans"] },
    ]},
    { text: "Name something a team does to attract a superstar in free agency", answers: [
      { text: "Offers max contract money", points: 42, aliases: ["max money", "top dollar", "most money"] },
      { text: "Pairs him with another star", points: 26, aliases: ["adds another star", "builds around him", "superstar teammate"] },
      { text: "Promises a winning culture", points: 16, aliases: ["winning environment", "good culture", "championship vision"] },
      { text: "Offers him a beautiful city to live in", points: 10, aliases: ["great city", "nice weather", "desirable market"] },
      { text: "Gives him creative control", points: 6, aliases: ["front office power", "roster control", "player empowerment"] },
    ]},
    { text: "Name something that happens when a player switches to a bigger market team", answers: [
      { text: "Media coverage explodes", points: 38, aliases: ["more media", "national attention", "press coverage"] },
      { text: "Endorsement deals increase", points: 26, aliases: ["more sponsors", "more commercials", "brand deals"] },
      { text: "Jersey sales spike", points: 18, aliases: ["jersey demand", "merch flies off shelves"] },
      { text: "Gets more All-Star votes", points: 12, aliases: ["fan votes", "more fans vote", "all-star exposure"] },
      { text: "Faces more scrutiny", points: 6, aliases: ["more pressure", "under microscope", "more criticism"] },
    ]},
    { text: "Name something a bench player does to try to make the starting lineup", answers: [
      { text: "Plays with maximum effort every minute", points: 40, aliases: ["gives full effort", "hustles", "goes hard"] },
      { text: "Stays after practice to work on his game", points: 28, aliases: ["extra work", "stays late", "extra practice"] },
      { text: "Talks to the coach about his role", points: 16, aliases: ["lobbies coach", "asks for more time", "meets with coach"] },
      { text: "Makes the most of garbage time", points: 10, aliases: ["shines in garbage time", "puts up stats late"] },
      { text: "Stays ready when teammates get injured", points: 6, aliases: ["capitalizes on injuries", "ready to step in"] },
    ]},
    { text: "Name a reason an NBA coach gets fired mid-season", answers: [
      { text: "Team is losing too many games", points: 44, aliases: ["bad record", "too many losses", "terrible record"] },
      { text: "Lost the locker room", points: 28, aliases: ["players don't respect him", "lost players", "disconnect with team"] },
      { text: "Star player wants him gone", points: 16, aliases: ["superstar demands firing", "player pushes coach out"] },
      { text: "Clashes with the front office", points: 8, aliases: ["management conflict", "owner conflict", "GM conflict"] },
      { text: "Substance or behavior issues", points: 4, aliases: ["personal issues", "misconduct", "behavior"] },
    ]},
  ],

  // Day 4
  [
    { text: "Name something fans do when their team wins a championship", answers: [
      { text: "Go out into the streets to celebrate", points: 40, aliases: ["street party", "riot", "gather outside", "flood streets"] },
      { text: "Buy championship merchandise", points: 26, aliases: ["buy merch", "championship gear", "hats and shirts"] },
      { text: "Watch the parade", points: 18, aliases: ["championship parade", "victory parade"] },
      { text: "Post about it all over social media", points: 10, aliases: ["social media", "posting", "Twitter"] },
      { text: "Throw a party at home", points: 6, aliases: ["house party", "watch party", "party"] },
    ]},
    { text: "Name something a player does in the offseason to come back better", answers: [
      { text: "Works on his weak spots with a trainer", points: 38, aliases: ["skill training", "works on weaknesses", "individual training"] },
      { text: "Loses weight or gets in better shape", points: 26, aliases: ["loses weight", "gets in shape", "body transformation"] },
      { text: "Adds a new shot to his game", points: 18, aliases: ["new move", "expands arsenal", "new skill"] },
      { text: "Studies film", points: 12, aliases: ["watches film", "reviews tape", "film study"] },
      { text: "Changes his diet", points: 6, aliases: ["nutrition change", "eats better", "diet"] },
    ]},
    { text: "Name a sign that a star player is about to demand a trade", answers: [
      { text: "Stops talking to media", points: 36, aliases: ["goes quiet", "avoids press", "no interviews"] },
      { text: "Publicly criticizes teammates", points: 25, aliases: ["calls out teammates", "throws team under bus"] },
      { text: "His agent starts making calls", points: 20, aliases: ["agent is talking", "agent negotiating", "agent rumors"] },
      { text: "Gets hurt a lot conveniently", points: 12, aliases: ["fake injuries", "sits out a lot", "load management"] },
      { text: "Likes trade rumor posts on social media", points: 7, aliases: ["social media likes", "likes tweets", "social media activity"] },
    ]},
    { text: "Name something a home crowd does to try to distract a free throw shooter", answers: [
      { text: "Waves arms and screams", points: 38, aliases: ["wave hands", "yells", "arms waving"] },
      { text: "Holds up signs or distractions behind the basket", points: 28, aliases: ["signs", "props", "distractions behind glass"] },
      { text: "Chants the player's name to mock him", points: 18, aliases: ["chants", "taunting chants", "mocking chants"] },
      { text: "Throws things at the glass", points: 10, aliases: ["throws objects", "cups", "trash"] },
      { text: "Makes noise with their phones", points: 6, aliases: ["phone flashlights", "noisemakers"] },
    ]},
    { text: "Name something that gets debated endlessly about the NBA GOAT conversation", answers: [
      { text: "Number of championships", points: 40, aliases: ["rings", "titles", "championships won"] },
      { text: "Era of competition", points: 26, aliases: ["competition level", "era played", "who they played against"] },
      { text: "Individual stats and records", points: 18, aliases: ["stats", "scoring records", "statistical dominance"] },
      { text: "Impact on the game", points: 10, aliases: ["cultural impact", "changed the game", "influence"] },
      { text: "Playoff performance", points: 6, aliases: ["clutch playoff moments", "finals record", "postseason"] },
    ]},
  ],

  // Day 5
  [
    { text: "Name something a player loses when he signs a huge contract", answers: [
      { text: "Motivation to work hard", points: 36, aliases: ["motivation", "hunger", "drive"] },
      { text: "His starting spot if he underperforms", points: 25, aliases: ["starting position", "starter role", "lineup spot"] },
      { text: "Respect from teammates", points: 20, aliases: ["locker room respect", "teammates lose faith"] },
      { text: "Fan support", points: 13, aliases: ["fan love", "fan approval", "fans turn on him"] },
      { text: "Leverage in future negotiations", points: 6, aliases: ["bargaining power", "future leverage"] },
    ]},
    { text: "Name something that makes a game-winning shot even more memorable", answers: [
      { text: "It's in the playoffs or Finals", points: 42, aliases: ["playoff shot", "Finals buzzer beater", "postseason"] },
      { text: "The shooter was cold all game", points: 28, aliases: ["was struggling", "had a bad game", "missed all night"] },
      { text: "It's against a rival team", points: 16, aliases: ["rival opponent", "against rivals"] },
      { text: "The shot is from very long range", points: 8, aliases: ["half court", "deep three", "logo shot"] },
      { text: "The bench reacts with a wild celebration", points: 6, aliases: ["bench celebration", "teammates rush court"] },
    ]},
    { text: "Name a reason a small-market team can't keep their star player", answers: [
      { text: "Player wants to be in a bigger city", points: 40, aliases: ["wants big market", "wants bigger city", "prefers large market"] },
      { text: "Can't attract other stars to play with him", points: 28, aliases: ["no help coming", "can't recruit", "other stars don't want to come"] },
      { text: "Media exposure is limited", points: 16, aliases: ["less media", "no national spotlight", "off the radar"] },
      { text: "Less endorsement opportunity", points: 10, aliases: ["fewer sponsors", "less marketing value", "fewer endorsements"] },
      { text: "Can't match competing offers in a trade", points: 6, aliases: ["trade assets limited", "can't trade for help"] },
    ]},
    { text: "Name something a player does to intimidate an opponent before the game", answers: [
      { text: "Trash talks during warmups", points: 38, aliases: ["talks trash", "chirps", "jaw jacking"] },
      { text: "Puts up a monster warmup performance", points: 26, aliases: ["impressive warmup", "shows off pregame", "warming up hard"] },
      { text: "Ignores the opponent completely", points: 18, aliases: ["cold shoulder", "acts unbothered", "dismisses opponent"] },
      { text: "Stares them down on the court", points: 12, aliases: ["death stare", "eye contact intimidation"] },
      { text: "Has a loud entrance music", points: 6, aliases: ["player intro song", "entrance music"] },
    ]},
    { text: "Name something coaches argue with referees about most", answers: [
      { text: "Missed foul calls", points: 38, aliases: ["no call", "foul not called", "missed foul"] },
      { text: "Out of bounds calls", points: 26, aliases: ["out of bounds", "who touched it last", "sideline call"] },
      { text: "Goaltending calls", points: 18, aliases: ["goaltending", "interference", "goal tending"] },
      { text: "Flagrant foul grading", points: 12, aliases: ["flagrant one vs two", "flagrant classification"] },
      { text: "Clock management at the end of games", points: 6, aliases: ["clock issues", "time on clock", "buzzer"] },
    ]},
  ],

  // Day 6
  [
    { text: "Name something a player does when he gets hot in the third quarter", answers: [
      { text: "Starts taking more shots", points: 40, aliases: ["shoots more", "forces shots", "takes over"] },
      { text: "Gets more aggressive going to the rim", points: 28, aliases: ["attacks the basket", "drives more", "goes downhill"] },
      { text: "Starts talking trash", points: 16, aliases: ["trash talks", "chirps defenders", "gets mouthy"] },
      { text: "Teammates feed him the ball constantly", points: 10, aliases: ["gets the ball more", "teammates look for him"] },
      { text: "Opponents call timeout", points: 6, aliases: ["forces timeout", "opponent stops him with timeout"] },
    ]},
    { text: "Name a reason a player retires before his time", answers: [
      { text: "Persistent injuries that won't heal", points: 42, aliases: ["career ending injury", "chronic injury", "can't stay healthy"] },
      { text: "Mental health or burnout", points: 26, aliases: ["mental health", "burned out", "mentally exhausted"] },
      { text: "Family comes first", points: 18, aliases: ["family reasons", "wants to be with family", "kids"] },
      { text: "Lost the love of the game", points: 8, aliases: ["doesn't love basketball anymore", "lost passion"] },
      { text: "Business ventures calling", points: 6, aliases: ["business interests", "entrepreneur", "other career"] },
    ]},
    { text: "Name something that happens during a heated playoff series that wouldn't happen in the regular season", answers: [
      { text: "Flagrant fouls and ejections", points: 38, aliases: ["flagrant fouls", "ejections", "hard fouls"] },
      { text: "Players trash talk after every play", points: 26, aliases: ["constant trash talk", "every play chirping"] },
      { text: "Coaches get technical fouls", points: 18, aliases: ["coach T'd up", "coach ejected", "coach technicals"] },
      { text: "Benches clear or altercations", points: 12, aliases: ["bench clears", "near fights", "altercations"] },
      { text: "Crowd is way louder and more hostile", points: 6, aliases: ["loud crowd", "hostile atmosphere", "electric atmosphere"] },
    ]},
    { text: "Name something a big man needs to do to be considered elite", answers: [
      { text: "Dominate in the paint on both ends", points: 38, aliases: ["dominant post player", "dominant on both ends", "paint dominance"] },
      { text: "Be a reliable free throw shooter", points: 24, aliases: ["hit free throws", "good from the line", "free throw percentage"] },
      { text: "Protect the rim and block shots", points: 20, aliases: ["shot blocking", "rim protection", "block shots"] },
      { text: "Have a face-up or mid-range game", points: 12, aliases: ["face up game", "mid range", "perimeter threat"] },
      { text: "Move well in pick and roll", points: 6, aliases: ["pick and roll", "screen and roll", "rolls to basket"] },
    ]},
    { text: "Name something fans complain about at modern NBA games", answers: [
      { text: "Too many fouls and free throws slow the game down", points: 38, aliases: ["too many fouls", "free throws", "foul-fest"] },
      { text: "Ticket prices are too expensive", points: 26, aliases: ["ticket cost", "high prices", "expensive"] },
      { text: "Too much flopping", points: 18, aliases: ["flopping", "players diving", "faking fouls"] },
      { text: "Stars miss games for load management", points: 12, aliases: ["load management", "stars sit out"] },
      { text: "Games go too long", points: 6, aliases: ["game too long", "overtime", "slow pace"] },
    ]},
  ],

  // Day 7
  [
    { text: "Name something a player does during a contract year to maximize his value", answers: [
      { text: "Plays the best basketball of his life", points: 42, aliases: ["career year", "plays great", "elevated performance"] },
      { text: "Stays healthy and available", points: 26, aliases: ["doesn't get hurt", "plays in every game", "stays on court"] },
      { text: "Puts up big individual stats", points: 18, aliases: ["stat padder", "inflates numbers", "big numbers"] },
      { text: "Leads his team to wins", points: 8, aliases: ["wins games", "leads team", "team success"] },
      { text: "Stays out of controversy", points: 6, aliases: ["avoids drama", "stays quiet", "no off-court issues"] },
    ]},
    { text: "Name something that makes a trade rumor go viral", answers: [
      { text: "A superstar's name is involved", points: 42, aliases: ["star player rumored", "superstar trade", "big name"] },
      { text: "A credible insider tweets it", points: 28, aliases: ["Woj", "Shams", "insider reports", "beat reporter tweet"] },
      { text: "Two championship contenders are involved", points: 16, aliases: ["contender trade", "big team trade", "playoff team"] },
      { text: "A player is unhappy and wants out", points: 8, aliases: ["unhappy player", "trade demand", "wants out"] },
      { text: "The rumored package is shocking", points: 6, aliases: ["unexpected pieces", "surprising return", "big package"] },
    ]},
    { text: "Name something a star player does that gets called selfish but is actually good strategy", answers: [
      { text: "Calls for the ball in crunch time every possession", points: 36, aliases: ["demands ball late", "isolation late game", "wants ball to close"] },
      { text: "Takes the long two instead of the three", points: 24, aliases: ["mid range game", "takes long twos", "mid range pull up"] },
      { text: "Doesn't use full energy on defense", points: 20, aliases: ["saves energy on defense", "picks spots on defense", "conserves energy"] },
      { text: "Refuses to run the full court", points: 12, aliases: ["doesn't run back", "walks up court", "slow down court"] },
      { text: "Prioritizes stats over winning plays", points: 8, aliases: ["stat padding", "hero ball", "individual stats"] },
    ]},
    { text: "Name a way NBA players show off their wealth", answers: [
      { text: "Custom jewelry and chains", points: 38, aliases: ["jewelry", "chains", "bling", "ice"] },
      { text: "Expensive cars in the parking lot", points: 26, aliases: ["luxury cars", "Lamborghini", "Rolls Royce", "fancy cars"] },
      { text: "Designer fashion on arrival", points: 20, aliases: ["designer clothes", "tunnel fashion", "fashion outfits"] },
      { text: "Private jets to road games", points: 10, aliases: ["private plane", "private jet", "charter flights"] },
      { text: "Huge mansions and houses", points: 6, aliases: ["mansion", "big house", "real estate"] },
    ]},
    { text: "Name something a team does to stop a dominant center in the paint", answers: [
      { text: "Send double teams when he catches it", points: 40, aliases: ["double team", "trap him", "two-on-one in post"] },
      { text: "Play physical and foul him early", points: 26, aliases: ["hard fouls", "rough him up", "play physical"] },
      { text: "Force him to beat them from outside", points: 18, aliases: ["dare him to shoot", "sag off", "play off him"] },
      { text: "Switch smaller athletic defenders on him", points: 10, aliases: ["small ball switch", "athletic defender", "quicker defender"] },
      { text: "Put him on the foul line with hack-a strategy", points: 6, aliases: ["hack a player", "intentional fouls", "foul him on purpose"] },
    ]},
  ],

  // Day 8
  [
    { text: "Name something that automatically makes you a top-five player all-time", answers: [
      { text: "Multiple championships", points: 40, aliases: ["several rings", "multiple titles", "winning multiple"] },
      { text: "Multiple MVP awards", points: 26, aliases: ["several MVPs", "league MVP multiple times"] },
      { text: "Scoring records", points: 18, aliases: ["all-time scoring", "scoring title", "points record"] },
      { text: "Changing the way the position is played", points: 10, aliases: ["revolutionized position", "changed the game"] },
      { text: "Finals MVP performances", points: 6, aliases: ["Finals MVP", "iconic Finals games"] },
    ]},
    { text: "Name something that makes a player hard to guard one-on-one", answers: [
      { text: "Can score from anywhere on the court", points: 42, aliases: ["versatile scorer", "scores everywhere", "multiple ways to score"] },
      { text: "Quickness that the defender can't match", points: 28, aliases: ["too fast", "speed advantage", "blows by defenders"] },
      { text: "Size that smaller defenders can't handle", points: 16, aliases: ["too big", "size mismatch", "physical advantage"] },
      { text: "Unstoppable post moves", points: 8, aliases: ["post moves", "low post game", "back to basket"] },
      { text: "Elite ball handling and shiftiness", points: 6, aliases: ["handles", "shifty", "ball handling"] },
    ]},
    { text: "Name a reason teams tank for a high draft pick", answers: [
      { text: "Franchise player in the draft class", points: 44, aliases: ["generational prospect", "top prospect", "sure thing in draft"] },
      { text: "Current roster has no future", points: 28, aliases: ["bad roster", "no talent", "rebuilding needed"] },
      { text: "Better odds in the draft lottery", points: 16, aliases: ["lottery odds", "lottery ball", "better draft position"] },
      { text: "Salary cap space to reset", points: 8, aliases: ["shed bad contracts", "cap flexibility", "cap reset"] },
      { text: "Ownership wants to save money short term", points: 4, aliases: ["cheap ownership", "ownership cuts payroll"] },
    ]},
    { text: "Name something a player says in a post-game interview that goes viral", answers: [
      { text: "Calls out a teammate or coach", points: 40, aliases: ["throws teammate under bus", "public call out"] },
      { text: "Says something arrogant or disrespectful", points: 27, aliases: ["talks trash in interview", "arrogant quote", "disrespects opponent"] },
      { text: "Gives an emotional heartfelt moment", points: 18, aliases: ["cries", "emotional answer", "vulnerable moment"] },
      { text: "Has a funny one-liner", points: 9, aliases: ["funny quote", "one liner", "witty response"] },
      { text: "Predicts future success boldly", points: 6, aliases: ["bold prediction", "guarantees win", "championship guarantee"] },
    ]},
    { text: "Name something a team does in the fourth quarter when they're down by ten", answers: [
      { text: "Goes on a run with pressure defense", points: 38, aliases: ["press defense", "defensive run", "trapping defense"] },
      { text: "Feeds the hot hand repeatedly", points: 26, aliases: ["isolates the hot player", "feeds the hot shooter"] },
      { text: "Speeds up the pace of play", points: 18, aliases: ["plays faster", "up-tempo", "pace up"] },
      { text: "Draws fouls to stop the clock", points: 12, aliases: ["intentional fouls", "foul to stop clock", "strategic fouling"] },
      { text: "Calls timeout to draw up a play", points: 6, aliases: ["calls time", "sets up play", "timeout strategy"] },
    ]},
  ],

  // Day 9
  [
    { text: "Name something about NBA draft night that makes it dramatic", answers: [
      { text: "A team trades up for a prospect", points: 38, aliases: ["trade up", "moves up in draft", "trades to get pick"] },
      { text: "A player falls further than expected", points: 28, aliases: ["falls in draft", "slides", "unexpected drop"] },
      { text: "A sleeper pick no one saw coming", points: 18, aliases: ["surprise pick", "unknown player selected", "out of nowhere"] },
      { text: "A player's emotional reaction on stage", points: 10, aliases: ["emotional moment", "cries on stage", "hugs family"] },
      { text: "A team makes a controversial decision", points: 6, aliases: ["controversial pick", "fans shocked", "questionable choice"] },
    ]},
    { text: "Name a way social media has changed how NBA fans follow the league", answers: [
      { text: "Real-time reactions to every play", points: 38, aliases: ["instant reactions", "live tweeting", "social reaction"] },
      { text: "Trade rumors spread instantly", points: 27, aliases: ["instant trade news", "quick rumors", "instant rumors"] },
      { text: "Players interact directly with fans", points: 20, aliases: ["player interaction", "players on Twitter", "player social media"] },
      { text: "Highlight clips spread everywhere", points: 9, aliases: ["clips go viral", "highlights shared", "TikTok highlights"] },
      { text: "Fans debate takes constantly", points: 6, aliases: ["hot takes online", "sports debates online", "social media debates"] },
    ]},
    { text: "Name something a role player does to stay on the roster", answers: [
      { text: "Accepts any role the coach gives him", points: 40, aliases: ["does what coach asks", "plays any role", "buys into role"] },
      { text: "Defends the opponent's best player", points: 28, aliases: ["takes defensive assignment", "guards star player"] },
      { text: "Knocks down open threes consistently", points: 18, aliases: ["hits open shots", "three point specialist", "spot up shooter"] },
      { text: "Sets bone-crushing screens", points: 8, aliases: ["sets screens", "physical screens", "hard screener"] },
      { text: "Brings energy off the bench", points: 6, aliases: ["bench energy", "spark plug", "brings life to bench"] },
    ]},
    { text: "Name something that guarantees an NBA player gets a documentary made about him", answers: [
      { text: "Multiple championships", points: 40, aliases: ["wins titles", "champion multiple times", "rings"] },
      { text: "Overcoming a serious injury", points: 26, aliases: ["comeback from injury", "injury comeback story", "survived injury"] },
      { text: "A controversial career full of drama", points: 18, aliases: ["controversial", "drama filled career", "off court issues"] },
      { text: "Being a generational great", points: 10, aliases: ["all-time great", "GOAT level", "legendary career"] },
      { text: "A rags to riches background story", points: 6, aliases: ["grew up poor", "came from nothing", "underdog story"] },
    ]},
    { text: "Name something a team with a bad record is actually good for", answers: [
      { text: "High lottery draft pick", points: 42, aliases: ["good draft pick", "lottery ball", "top pick"] },
      { text: "Developing young players", points: 26, aliases: ["young player development", "minutes for youth", "player growth"] },
      { text: "Cap space to sign free agents", points: 18, aliases: ["salary cap room", "free agency flexibility"] },
      { text: "Trying out new coaching strategies", points: 8, aliases: ["experimenting", "test different lineups", "new system"] },
      { text: "Building chemistry for the future", points: 6, aliases: ["future chemistry", "growing together", "team building"] },
    ]},
  ],

  // Day 10
  [
    { text: "Name something a player does when he gets his first big shoe deal", answers: [
      { text: "Posts a photo with the shoes on social media", points: 40, aliases: ["Instagram post", "social media reveal", "posts shoes"] },
      { text: "Wears signature colorways in games", points: 26, aliases: ["wears signature shoe", "custom colorway", "own shoe"] },
      { text: "Shows up to the arena with stacks of shoeboxes", points: 18, aliases: ["many shoe boxes", "shoebox gift", "drops shoes at arena"] },
      { text: "Gives pairs out to teammates and friends", points: 10, aliases: ["gives away shoes", "gifts teammates shoes"] },
      { text: "Films a commercial", points: 6, aliases: ["shoe commercial", "advertisement", "ad shoot"] },
    ]},
    { text: "Name something a team's best player does when the team is losing badly", answers: [
      { text: "Goes into hero mode and takes every shot", points: 38, aliases: ["hero ball", "takes everything himself", "forces shots"] },
      { text: "Yells at teammates on the court", points: 26, aliases: ["calls out teammates", "visible frustration", "screams at players"] },
      { text: "Stares at the bench or coaches with frustration", points: 18, aliases: ["stares at bench", "looks at coach", "frustrated look"] },
      { text: "Stops communicating on defense", points: 12, aliases: ["quiet on defense", "checks out defensively", "disengages"] },
      { text: "Gets technical fouls from frustration", points: 6, aliases: ["tech foul", "T'd up", "loses temper"] },
    ]},
    { text: "Name a reason the NBA Finals gets lower TV ratings than expected", answers: [
      { text: "Neither team has a national fanbase", points: 36, aliases: ["small market teams", "bad matchup", "no big market team"] },
      { text: "One team dominates and sweeps", points: 28, aliases: ["series sweep", "blowout series", "not competitive"] },
      { text: "The biggest stars got eliminated early", points: 20, aliases: ["stars knocked out early", "no LeBron or Steph", "stars gone"] },
      { text: "Games played on weeknights with no buzz", points: 10, aliases: ["scheduling", "bad game time", "weeknight games"] },
      { text: "Competing with other sports or events", points: 6, aliases: ["competition from other sports", "World Cup", "NFL draft"] },
    ]},
    { text: "Name something a player does in warm-ups that tells you he's going to have a big game", answers: [
      { text: "Every shot he takes goes in", points: 40, aliases: ["can't miss in warmups", "hitting everything", "shooting lights out"] },
      { text: "He looks locked in and focused", points: 26, aliases: ["zoned in", "intense focus", "locked in mentality"] },
      { text: "He's trash talking from the start", points: 18, aliases: ["talking trash early", "fired up early", "verbal from the jump"] },
      { text: "Teammates seem to defer to him already", points: 10, aliases: ["teammates clear way", "team feeds him", "team looks to him"] },
      { text: "He has a new shot or move in warmups", points: 6, aliases: ["new move previewed", "new shot", "worked on something new"] },
    ]},
    { text: "Name a reason the NBA three-point line has changed the game forever", answers: [
      { text: "Teams shoot more threes than ever before", points: 40, aliases: ["more threes", "three point revolution", "shooting more threes"] },
      { text: "Big men are now expected to shoot threes", points: 28, aliases: ["stretch fours", "bigs shoot threes", "centers shooting threes"] },
      { text: "One shooter can flip a game in seconds", points: 18, aliases: ["one hot shooter", "quick swing", "fast runs"] },
      { text: "Defense has to guard out to the arc", points: 9, aliases: ["defense spread out", "guarding three point line"] },
      { text: "Offenses are more spread out now", points: 5, aliases: ["spacing", "floor spacing", "open lanes"] },
    ]},
  ],

  // Day 11
  [
    { text: "Name something a player does when a referee gives him a technical foul", answers: [
      { text: "Argues even harder and risks another tech", points: 38, aliases: ["doubles down", "keeps arguing", "argues more"] },
      { text: "Walks away shaking his head", points: 28, aliases: ["walks off frustrated", "shakes head", "turns away in disbelief"] },
      { text: "Teammates pull him away", points: 18, aliases: ["coaches restrain him", "teammates hold him back", "pulled away"] },
      { text: "Complains to his coach on the sideline", points: 10, aliases: ["tells coach", "sideline complaint"] },
      { text: "Calms down and focuses on the next play", points: 6, aliases: ["refocuses", "gets back to basketball", "calms himself"] },
    ]},
    { text: "Name something a coaching staff looks for when scouting a college player", answers: [
      { text: "Athleticism and physical tools", points: 40, aliases: ["athleticism", "physical measurables", "size and speed"] },
      { text: "Basketball IQ and court vision", points: 26, aliases: ["IQ", "court vision", "basketball sense", "smart player"] },
      { text: "How he performs under pressure", points: 18, aliases: ["clutch ability", "pressure moments", "big game performance"] },
      { text: "Motor and effort every game", points: 10, aliases: ["hustle", "motor", "effort level", "work rate"] },
      { text: "Character and coachability", points: 6, aliases: ["character", "attitude", "coachable", "locker room guy"] },
    ]},
    { text: "Name a player type that always gets overpaid in free agency", answers: [
      { text: "The one-year wonder coming off a career year", points: 38, aliases: ["contract year guy", "one good year", "career year wonder"] },
      { text: "The veteran big who played on a great team", points: 26, aliases: ["veteran center", "big man on good team", "system big"] },
      { text: "The streaky three-point shooter", points: 18, aliases: ["inconsistent shooter", "streaky shooter", "hot and cold scorer"] },
      { text: "The backup point guard on a title team", points: 12, aliases: ["backup PG", "second string guard", "role player on contender"] },
      { text: "The defensive specialist without offensive skills", points: 6, aliases: ["defensive only player", "no offense", "one-way player"] },
    ]},
    { text: "Name something a team does to prepare for a Game 7", answers: [
      { text: "Watches extra film on the opponent", points: 38, aliases: ["film study", "scouting", "watches film"] },
      { text: "Has an intense practice the day before", points: 26, aliases: ["hard practice", "big practice", "intense session"] },
      { text: "Gives players a team speech or rally", points: 20, aliases: ["motivational speech", "team huddle", "rallying speech"] },
      { text: "Rests and recovers fully", points: 10, aliases: ["rest day", "full recovery", "bodies rest"] },
      { text: "Leans on the home crowd energy", points: 6, aliases: ["home crowd", "uses crowd", "feed off crowd"] },
    ]},
    { text: "Name a way players deal with losing streaks mentally", answers: [
      { text: "Stay locked in at practice and work harder", points: 38, aliases: ["practice harder", "extra work", "stay focused"] },
      { text: "Tune out social media criticism", points: 26, aliases: ["stay off social media", "ignore critics", "avoid Twitter"] },
      { text: "Lean on veteran leadership and experience", points: 18, aliases: ["veteran presence", "veteran leaders guide", "experience helps"] },
      { text: "Have an honest team meeting", points: 12, aliases: ["team meeting", "clear the air", "honest talk"] },
      { text: "Trust the process and stay confident", points: 6, aliases: ["stay confident", "trust the process", "belief in the team"] },
    ]},
  ],

  // Day 12
  [
    { text: "Name something that makes a player's signature move iconic", answers: [
      { text: "It's virtually unguardable", points: 40, aliases: ["impossible to stop", "unguardable", "unstoppable move"] },
      { text: "He hits it in the biggest moments", points: 28, aliases: ["clutch move", "big game move", "does it when it counts"] },
      { text: "Has a cool nickname", points: 18, aliases: ["catchy name", "nickname for the move", "named move"] },
      { text: "Defenders look helpless against it", points: 8, aliases: ["defenders in trouble", "defender looks silly", "defense helpless"] },
      { text: "It becomes copied across the league", points: 6, aliases: ["everyone copies it", "imitated", "spread league-wide"] },
    ]},
    { text: "Name something an NBA city does to welcome a new superstar", answers: [
      { text: "Sells out every game immediately", points: 38, aliases: ["tickets sell out", "packed arenas", "sold out games"] },
      { text: "Puts up billboards and murals around the city", points: 26, aliases: ["murals", "billboards", "city art"] },
      { text: "Gives him the keys to the city", points: 18, aliases: ["city honor", "official ceremony", "city key"] },
      { text: "Media celebrates his arrival nonstop", points: 12, aliases: ["local media frenzy", "press coverage", "endless coverage"] },
      { text: "Restaurants and businesses name things after him", points: 6, aliases: ["named dishes", "businesses named for him", "local tribute"] },
    ]},
    { text: "Name something that happens when two MVP-caliber players team up on the same squad", answers: [
      { text: "The rest of the league calls it unfair", points: 40, aliases: ["league complains", "everyone hates it", "rest of league upset"] },
      { text: "Championship expectations go sky high", points: 28, aliases: ["championship pressure", "must win title", "title or bust"] },
      { text: "Debates about who's the real leader", points: 18, aliases: ["who's in charge", "leadership debate", "ego conflict"] },
      { text: "Other stars try to form their own superteam", points: 8, aliases: ["superteam response", "other stars team up", "copycat teams"] },
      { text: "Ticket prices double overnight", points: 6, aliases: ["tickets get expensive", "price spike", "sold out season"] },
    ]},
    { text: "Name something a player's family member does that becomes a storyline", answers: [
      { text: "Parent gets too vocal in the stands", points: 38, aliases: ["parent causes scene", "outspoken dad or mom", "family drama in stands"] },
      { text: "Spouse or partner gets involved in beef", points: 26, aliases: ["girlfriend drama", "wife involved", "spouse in controversy"] },
      { text: "Agent brother negotiates a bad deal", points: 18, aliases: ["family agent", "bad contract negotiated", "brother agent"] },
      { text: "Father claims son will be the greatest", points: 12, aliases: ["dad bold prediction", "father boasts", "parent overhypes"] },
      { text: "Sibling rivalry with another pro", points: 6, aliases: ["brother vs brother", "sibling matchup", "family rivalry"] },
    ]},
    { text: "Name something a bad offensive team struggles with late in close games", answers: [
      { text: "Creating open shots against set defense", points: 40, aliases: ["can't create shots", "no offensive creation", "can't score in half court"] },
      { text: "Running any play under pressure", points: 26, aliases: ["can't execute plays", "play breakdown", "no play execution"] },
      { text: "Making free throws when it matters", points: 18, aliases: ["missed free throws", "free throw shooting", "free throws in crunch time"] },
      { text: "Getting the ball in-bounds cleanly", points: 10, aliases: ["inbound plays", "inbounding trouble", "turnover on inbounds"] },
      { text: "Holding a lead without turning it over", points: 6, aliases: ["turnovers to end game", "protecting lead", "turnover trouble"] },
    ]},
  ],

  // Day 13
  [
    { text: "Name something NBA players do to take care of their bodies at the highest level", answers: [
      { text: "Cryotherapy and ice baths after games", points: 36, aliases: ["ice bath", "cryotherapy", "cold tub", "cryo"] },
      { text: "Strict diet and nutrition plan", points: 28, aliases: ["strict diet", "nutrition plan", "eating clean", "diet"] },
      { text: "Hours of daily stretching and yoga", points: 18, aliases: ["yoga", "stretching", "flexibility work"] },
      { text: "Private body trainers year-round", points: 12, aliases: ["personal trainer", "private trainer", "year round training"] },
      { text: "Hyperbaric chambers for recovery", points: 6, aliases: ["hyperbaric oxygen", "hyperbaric chamber", "oxygen chamber"] },
    ]},
    { text: "Name a reason fans stop liking a player they used to love", answers: [
      { text: "He left their team for a rival", points: 42, aliases: ["left team", "betrayal", "joined rival", "left in free agency"] },
      { text: "He became too arrogant and unlikeable", points: 26, aliases: ["arrogant", "entitled", "became a jerk"] },
      { text: "He stopped performing and is overpaid", points: 18, aliases: ["bad contract", "not producing", "overpaid and underperforming"] },
      { text: "Off-court controversy or scandal", points: 8, aliases: ["scandal", "off court issues", "controversy"] },
      { text: "He bad-mouthed the city on his way out", points: 6, aliases: ["disrespected city", "talked bad about team", "insulted fans"] },
    ]},
    { text: "Name something a team does at the trade deadline to signal they are going all-in", answers: [
      { text: "Trades draft picks for proven veterans", points: 40, aliases: ["trades picks", "sells draft capital", "mortgages future"] },
      { text: "Acquires a second star player", points: 28, aliases: ["adds another star", "second star acquisition", "big trade"] },
      { text: "Extends a superstar to a long-term deal", points: 18, aliases: ["long-term extension", "locks up star", "max extension"] },
      { text: "Clears the bench of long-term contracts", points: 8, aliases: ["sheds contracts", "clears cap", "dumps bad deals"] },
      { text: "Ownership opens the checkbook", points: 6, aliases: ["owner spends big", "luxury tax commitment", "spends over cap"] },
    ]},
    { text: "Name a sign that a team's dynasty is over", answers: [
      { text: "The superstar leaves in free agency", points: 42, aliases: ["star departs", "superstar leaves", "franchise player gone"] },
      { text: "Key role players age out or retire", points: 26, aliases: ["core ages out", "veterans retire", "supporting cast gone"] },
      { text: "They get bounced in the first round", points: 18, aliases: ["first round exit", "early playoff exit", "upset in round one"] },
      { text: "Younger hungrier teams pass them by", points: 8, aliases: ["new teams rise", "younger rivals", "overtaken"] },
      { text: "Front office makes a series of bad moves", points: 6, aliases: ["bad management", "poor decisions", "bad front office"] },
    ]},
    { text: "Name something a player experiences in his first NBA All-Star game", answers: [
      { text: "Overwhelmed by the star power around him", points: 38, aliases: ["star-struck", "overwhelmed by stars", "surreal experience"] },
      { text: "Tries to make an impression with big plays", points: 26, aliases: ["puts on a show", "shows out", "tries to impress"] },
      { text: "Bonds and parties with other stars", points: 18, aliases: ["parties with players", "socializes", "connects with other stars"] },
      { text: "His family watches from courtside", points: 12, aliases: ["family is there", "family support", "loved ones attend"] },
      { text: "Reflects on how far he has come", points: 6, aliases: ["emotional reflection", "thinks about journey", "grateful moment"] },
    ]},
  ],

  // Day 14
  [
    { text: "Name something that makes a playoff series go to seven games", answers: [
      { text: "Teams are perfectly evenly matched", points: 38, aliases: ["equal teams", "evenly matched", "too close to call"] },
      { text: "Home court advantage keeps flipping", points: 26, aliases: ["home teams keep winning", "home wins every game", "alternating wins"] },
      { text: "Key injuries force adjustments", points: 18, aliases: ["injuries change series", "injury to key player", "hurt player"] },
      { text: "Game-winning shots keep happening", points: 12, aliases: ["buzzer beaters", "walk-off shots", "close finishes"] },
      { text: "Neither team can close it out mentally", points: 6, aliases: ["mental collapses", "can't close out", "chokes on closing"] },
    ]},
    { text: "Name something a young player does that impresses veteran teammates", answers: [
      { text: "Plays fearless on the big stage", points: 40, aliases: ["not intimidated", "fearless", "plays without nerves"] },
      { text: "Works harder than anyone in the gym", points: 26, aliases: ["outworks veterans", "first in last out", "dedicated work ethic"] },
      { text: "Shows up in clutch moments", points: 18, aliases: ["performs in crunch time", "big moments", "clutch plays"] },
      { text: "Listens and learns without ego", points: 10, aliases: ["coachable", "humble", "soaks up knowledge"] },
      { text: "Asks veterans for advice", points: 6, aliases: ["seeks mentorship", "asks for help", "learns from veterans"] },
    ]},
    { text: "Name something fans argue about after an NBA Finals upset", answers: [
      { text: "Whether the winner was a fluke", points: 38, aliases: ["fluke champion", "was it a fluke", "lucky champion"] },
      { text: "Why the favored team choked", points: 26, aliases: ["favorites choked", "why favorite lost", "choke job"] },
      { text: "Who should have been MVP of the series", points: 18, aliases: ["Finals MVP debate", "who deserved MVP", "MVP argument"] },
      { text: "Whether the refs decided the outcome", points: 12, aliases: ["ref conspiracy", "refs decided it", "bad officiating"] },
      { text: "How this changes the GOAT conversation", points: 6, aliases: ["GOAT implications", "affects legacy", "GOAT debate update"] },
    ]},
    { text: "Name something a player's agent does that fans know nothing about", answers: [
      { text: "Negotiates secret extension terms behind the scenes", points: 38, aliases: ["secret negotiations", "behind the scenes deal", "quiet talks"] },
      { text: "Plants trade stories in the media", points: 26, aliases: ["leaks to media", "plants rumors", "media manipulation"] },
      { text: "Has leverage conversations with the GM", points: 18, aliases: ["pressures GM", "leverage talks", "GM negotiations"] },
      { text: "Lines up endorsement deals quietly", points: 12, aliases: ["quiet endorsements", "sponsor deals", "brand negotiations"] },
      { text: "Manages the player's public image", points: 6, aliases: ["PR management", "image control", "public relations"] },
    ]},
    { text: "Name something that happens at the NBA draft combine that changes a player's stock", answers: [
      { text: "He measures taller or longer than expected", points: 38, aliases: ["better measurements", "wingspan surprise", "bigger than thought"] },
      { text: "Interviews well with every front office", points: 26, aliases: ["great interviews", "impresses in meetings", "good character interview"] },
      { text: "Dominates the athletic testing", points: 18, aliases: ["athletic testing", "jumps high", "fast in drills"] },
      { text: "Looks better in scrimmages than on tape", points: 12, aliases: ["scrimmage performance", "live play impresses", "looks great in drills"] },
      { text: "Reveals a hidden skill no one knew about", points: 6, aliases: ["surprise skill", "unexpected ability", "new tool shown"] },
    ]},
  ],

  // Day 15
  [
    { text: "Name something a player does when his team starts the season 0-5", answers: [
      { text: "Calls a team meeting and demands accountability", points: 36, aliases: ["team meeting", "calls meeting", "demands accountability"] },
      { text: "Works harder in individual training", points: 26, aliases: ["extra practice", "personal work", "more gym time"] },
      { text: "Starts to question the organization publicly", points: 20, aliases: ["publicly questions team", "hints at problems", "vague complaints"] },
      { text: "Checks the injury report to explain losses", points: 12, aliases: ["blames injuries", "injury excuse", "points to injuries"] },
      { text: "Posts a motivational message on social media", points: 6, aliases: ["motivational post", "social media message", "Instagram motivation"] },
    ]},
    { text: "Name a reason a player who dominated in college struggles in the NBA", answers: [
      { text: "The athleticism gap is massive", points: 40, aliases: ["everyone is athletic", "too athletic in NBA", "can't match athleticism"] },
      { text: "Defenders are smarter and bigger", points: 28, aliases: ["better defenders", "NBA defenders smarter", "defensive IQ higher"] },
      { text: "The pace and length of the season wears him down", points: 18, aliases: ["82-game grind", "season length", "exhausting schedule"] },
      { text: "His one trick doesn't work anymore", points: 8, aliases: ["limited game exposed", "one-dimensional", "no second skill"] },
      { text: "Mental pressure and expectations overwhelm him", points: 6, aliases: ["pressure too much", "mental struggle", "expectations weigh on him"] },
    ]},
    { text: "Name something a team does when they are eliminated from the playoffs", answers: [
      { text: "Has a season-ending exit interview with coaches", points: 38, aliases: ["exit interviews", "season review meeting", "end of year meetings"] },
      { text: "Stars take vacations immediately", points: 26, aliases: ["players go on vacation", "immediate vacation", "escape the city"] },
      { text: "Front office evaluates the roster for changes", points: 20, aliases: ["roster evaluation", "offseason planning", "front office review"] },
      { text: "Fans call for the coach to be fired", points: 10, aliases: ["fan anger at coach", "calls for coaching change", "fire the coach"] },
      { text: "Players start training for next season early", points: 6, aliases: ["offseason training begins", "early preparation", "gets back to work"] },
    ]},
    { text: "Name something that separates a Hall of Famer from a very good player", answers: [
      { text: "A championship or multiple championships", points: 40, aliases: ["title winner", "won a ring", "champion"] },
      { text: "Consistent dominance over many seasons", points: 28, aliases: ["longevity of greatness", "consistent peak", "year after year excellence"] },
      { text: "Moments that defined an era", points: 18, aliases: ["iconic moments", "defining plays", "era-defining"] },
      { text: "Statistics that stand alone", points: 8, aliases: ["historic stats", "record holder", "statistical greatness"] },
      { text: "Impact beyond just winning games", points: 6, aliases: ["cultural impact", "legacy beyond stats", "changed the game"] },
    ]},
    { text: "Name something a point guard has to do to earn the trust of his veteran teammates", answers: [
      { text: "Make sure they get their shots in rhythm", points: 40, aliases: ["gets them involved", "finds them in rhythm", "feeds veterans"] },
      { text: "Win games and come up big in clutch moments", points: 26, aliases: ["wins close games", "clutch moments", "comes through when it matters"] },
      { text: "Lead by example in practice every day", points: 18, aliases: ["leads in practice", "hard work in practice", "sets example daily"] },
      { text: "Hold teammates accountable", points: 10, aliases: ["calls teammates out", "accountability leadership", "demands standards"] },
      { text: "Command the huddle with confidence", points: 6, aliases: ["runs the huddle", "confident in huddle", "takes charge in huddle"] },
    ]},
  ],

  // Day 16
  [
    { text: "Name something a player does to win over a new fanbase after a trade", answers: [
      { text: "Performs great right away", points: 42, aliases: ["plays well immediately", "instant impact", "big early games"] },
      { text: "Shows respect for the city and team history", points: 26, aliases: ["honors team history", "respects city", "acknowledges legacy"] },
      { text: "Engages with fans on social media", points: 16, aliases: ["fan interaction social", "posts about the city", "social media engagement"] },
      { text: "Does community events in the new city", points: 10, aliases: ["community work", "local events", "charity work"] },
      { text: "Wears the local jersey with pride", points: 6, aliases: ["represents the jersey", "puts on the jersey proudly"] },
    ]},
    { text: "Name a reason a player's legacy gets complicated after he retires", answers: [
      { text: "He never won a championship", points: 38, aliases: ["no ring", "ringless career", "never won a title"] },
      { text: "He left his original team on bad terms", points: 26, aliases: ["ugly exit", "burned bridges", "controversial departure"] },
      { text: "His stats were great but team won nothing", points: 18, aliases: ["stats without winning", "individual stats only", "stats but no rings"] },
      { text: "Younger players surpassed his records", points: 12, aliases: ["records broken", "surpassed by others", "new players passed him"] },
      { text: "Off-court issues overshadow his career", points: 6, aliases: ["controversies", "scandal in retirement", "off court problems"] },
    ]},
    { text: "Name something a team with bad chemistry looks like on the court", answers: [
      { text: "Players don't pass to each other", points: 40, aliases: ["ball hogging", "no ball movement", "not passing"] },
      { text: "No communication on defense", points: 26, aliases: ["defensive breakdowns", "silent defense", "no talking on D"] },
      { text: "Body language is visibly negative", points: 18, aliases: ["bad body language", "heads down", "visible frustration"] },
      { text: "No celebration when teammates score", points: 10, aliases: ["no bench energy", "teammates don't celebrate", "cold reactions"] },
      { text: "Stars ignore each other during plays", points: 6, aliases: ["stars avoid each other", "no interaction between stars"] },
    ]},
    { text: "Name a skill that is undervalued in NBA contract negotiations", answers: [
      { text: "Defensive effort and communication", points: 38, aliases: ["defense", "defensive value", "defensive player"] },
      { text: "Setting screens and off-ball movement", points: 26, aliases: ["screening", "off-ball play", "moving without the ball"] },
      { text: "Veteran leadership and mentoring young players", points: 18, aliases: ["veteran leadership", "mentoring", "locker room leadership"] },
      { text: "Drawing charges and taking hits for the team", points: 12, aliases: ["taking charges", "sacrifice plays", "charge drawing"] },
      { text: "Rebounding without the ball in hand stats", points: 6, aliases: ["hustle rebounds", "boxing out", "rebounding effort"] },
    ]},
    { text: "Name something a player says in a trash talk exchange that really lands", answers: [
      { text: "Mentions his championship rings", points: 38, aliases: ["talks about rings", "rings brag", "ring count"] },
      { text: "Points out the score directly", points: 26, aliases: ["scoreboard check", "what does the score say", "score jab"] },
      { text: "Clowns his shooting percentages", points: 18, aliases: ["makes fun of stats", "shooting percentage joke", "bad stats mockery"] },
      { text: "Calls out how he's guarding him easily", points: 12, aliases: ["makes it look easy", "says he's stopping him", "defensive brag"] },
      { text: "References his last playoff failure", points: 6, aliases: ["brings up playoff loss", "choke reference", "playoffs jab"] },
    ]},
  ],

  // Day 17
  [
    { text: "Name something a star player does that shows he trusts his teammates", answers: [
      { text: "Passes up an open shot to find the better look", points: 40, aliases: ["passes up shot", "unselfish pass", "finds better shot"] },
      { text: "Celebrates loudly when a role player scores", points: 26, aliases: ["celebrates teammate's shot", "energetic bench celebrations", "shows love for teammates"] },
      { text: "Gives the ball to a teammate in crunch time", points: 18, aliases: ["lets teammate close", "defers to teammate", "passes in the clutch"] },
      { text: "Defends a teammate in front of the media", points: 10, aliases: ["defends in press", "has teammate's back publicly"] },
      { text: "Shares credit after big wins", points: 6, aliases: ["gives teammates credit", "deflects praise", "shares spotlight"] },
    ]},
    { text: "Name a reason an NBA team relocates to a new city", answers: [
      { text: "New arena deal falls through in old city", points: 38, aliases: ["arena deal", "no new arena", "arena issues"] },
      { text: "Low attendance and ticket sales", points: 26, aliases: ["bad attendance", "empty arena", "no ticket sales"] },
      { text: "Ownership sells team to new group", points: 18, aliases: ["ownership change", "new owner moves team", "sold to new owners"] },
      { text: "League wants a team in a bigger market", points: 12, aliases: ["bigger market opportunity", "league decision", "expansion market"] },
      { text: "City lacks corporate sponsorship support", points: 6, aliases: ["no sponsors", "corporate support missing", "business community weak"] },
    ]},
    { text: "Name something a player does when he scores 50 points in a game", answers: [
      { text: "Screams or pounds his chest after the game", points: 38, aliases: ["celebrates emotionally", "chest pounding", "emotional outburst"] },
      { text: "Gives a shoutout to his trainers and process", points: 26, aliases: ["credits trainers", "credits the work", "team behind him"] },
      { text: "Dominates social media trending topics", points: 18, aliases: ["goes viral", "Twitter trending", "social media explosion"] },
      { text: "Gets interviewed by every major outlet", points: 12, aliases: ["mass media attention", "interview requests flood in"] },
      { text: "His jersey sells out online overnight", points: 6, aliases: ["jersey sales spike", "merchandise sells out"] },
    ]},
    { text: "Name something a team does when they lose home court advantage", answers: [
      { text: "They get louder and more desperate on offense", points: 36, aliases: ["offense gets more urgent", "more aggressive", "desperate scoring"] },
      { text: "Crowd energy collapses", points: 26, aliases: ["home crowd goes quiet", "arena gets quiet", "fan energy drops"] },
      { text: "Coach makes drastic lineup changes", points: 20, aliases: ["lineup shake up", "changes starters", "different lineup"] },
      { text: "Players start pressing and playing out of control", points: 12, aliases: ["pressing too much", "out of control", "desperate plays"] },
      { text: "Media questions whether they can recover", points: 6, aliases: ["doubts from media", "media writes them off", "questions about recovery"] },
    ]},
    { text: "Name something that happens when an NBA player goes on a 10-game hot streak", answers: [
      { text: "He becomes a national story", points: 40, aliases: ["national coverage", "goes national", "ESPN coverage"] },
      { text: "Opposing coaches game plan specifically for him", points: 26, aliases: ["opponents scheme for him", "gets game planned", "opposing coaches focus on him"] },
      { text: "All-Star votes pour in from fans", points: 18, aliases: ["All-Star buzz", "fan votes increase", "All-Star consideration"] },
      { text: "His contract value goes up dramatically", points: 10, aliases: ["contract boost", "value rises", "gets paid talk"] },
      { text: "His confidence visibly transforms", points: 6, aliases: ["visible confidence", "body language changes", "plays with swagger"] },
    ]},
  ],

  // Day 18
  [
    { text: "Name something a player does when a team wants him but he doesn't want to go there", answers: [
      { text: "Has his agent tell the team he won't re-sign", points: 40, aliases: ["agent sends message", "won't re-sign warning", "agent communicates"] },
      { text: "Publicly names teams he would accept a trade to", points: 26, aliases: ["names destinations", "lists preferred teams", "public trade wish list"] },
      { text: "Refuses to meet with team officials", points: 18, aliases: ["won't meet team", "avoids meetings", "declines introductions"] },
      { text: "Gives a cold one-word answer when asked about the team", points: 10, aliases: ["dismissive answer", "one word response", "brushes off question"] },
      { text: "Starts performing poorly to devalue himself in a trade", points: 6, aliases: ["tanks his value", "plays bad on purpose", "lowers trade value"] },
    ]},
    { text: "Name something that makes an NBA arena one of the hardest to play in", answers: [
      { text: "Crowd is deafeningly loud", points: 42, aliases: ["loud crowd", "deafening noise", "loudest arena"] },
      { text: "Fans know and love the game deeply", points: 26, aliases: ["passionate knowledgeable fans", "fans who know basketball", "educated fanbase"] },
      { text: "Opposing players get heckled relentlessly", points: 18, aliases: ["constant heckling", "fans ride opponents", "merciless heckling"] },
      { text: "Team has a long winning home streak", points: 8, aliases: ["unbeaten at home", "dominant at home", "home winning streak"] },
      { text: "Celebrity fans courtside add pressure", points: 6, aliases: ["celebrity watchers", "famous faces courtside", "star-studded crowd"] },
    ]},
    { text: "Name a reason a team gives up on a high draft pick too early", answers: [
      { text: "He was too raw and needed more development", points: 38, aliases: ["raw prospect traded", "needed more development", "too young too soon"] },
      { text: "Team went into win-now mode and traded him", points: 26, aliases: ["traded for vet", "mortgaged future", "traded pick for win now"] },
      { text: "Injuries slowed his development", points: 18, aliases: ["injured early", "never healthy", "injuries derailed him"] },
      { text: "Coaching staff didn't know how to use him", points: 12, aliases: ["bad fit", "wrong system", "misused by coaches"] },
      { text: "Personal issues off the court", points: 6, aliases: ["off court problems", "personal drama", "character concerns"] },
    ]},
    { text: "Name something a player does to prove doubters wrong", answers: [
      { text: "Has an MVP-level season", points: 40, aliases: ["MVP season", "dominates the year", "best season"] },
      { text: "Carries his team deep into the playoffs", points: 26, aliases: ["playoff run", "deep postseason run", "leads team far"] },
      { text: "Breaks a significant record", points: 18, aliases: ["record broken", "historic achievement", "statistical milestone"] },
      { text: "Wins a championship after being counted out", points: 10, aliases: ["wins title as underdog", "championship against odds"] },
      { text: "Calls out his doubters publicly after success", points: 6, aliases: ["claps back at critics", "calls out doubters", "celebrates proving them wrong"] },
    ]},
    { text: "Name something that happens when a legendary player announces his retirement", answers: [
      { text: "Tributes and highlights flood social media", points: 38, aliases: ["social media tribute", "highlight compilations", "internet reaction"] },
      { text: "Teammates and opponents share emotional reactions", points: 28, aliases: ["players react emotionally", "emotional statements", "colleagues react"] },
      { text: "Hall of Fame conversation starts immediately", points: 18, aliases: ["HOF talk", "Hall of Fame discussion", "legacy debate begins"] },
      { text: "Fans debate whether he should come back", points: 10, aliases: ["unretirement talk", "come back plea", "one more year debate"] },
      { text: "Documentary or memoir deals get announced", points: 6, aliases: ["doc announcement", "book deal", "documentary planned"] },
    ]},
  ],

  // Day 19
  [
    { text: "Name something a player's teammates say about him that gets repeated in every feature story", answers: [
      { text: "He's the hardest worker in the building", points: 40, aliases: ["hardest worker", "works harder than anyone", "first in last out"] },
      { text: "He makes everyone around him better", points: 28, aliases: ["elevates teammates", "makes us all better", "raises the level"] },
      { text: "He leads by example every single day", points: 18, aliases: ["leads by example", "sets the standard", "example every day"] },
      { text: "He wants to win more than anyone", points: 8, aliases: ["most competitive", "hates losing", "most driven to win"] },
      { text: "He treats everyone with respect", points: 6, aliases: ["humble", "treats staff with respect", "equal to everyone"] },
    ]},
    { text: "Name something a team does when they have too many stars and not enough ball", answers: [
      { text: "One star gets traded to fix the balance", points: 38, aliases: ["one gets traded", "stars are split up", "trade one star"] },
      { text: "Someone accepts a lesser role grudgingly", points: 26, aliases: ["one accepts bench role", "takes reduced role", "sacrifices role"] },
      { text: "Chemistry and locker room issues emerge", points: 18, aliases: ["locker room conflict", "chemistry problems", "ego clashes"] },
      { text: "They still manage to win with their talent", points: 12, aliases: ["talent overcomes", "wins despite issues", "talented enough"] },
      { text: "A coach is fired for not managing egos", points: 6, aliases: ["coach fired for egos", "coach blamed for chemistry", "coaching casualty"] },
    ]},
    { text: "Name something that excites a fan about the NBA trade deadline", answers: [
      { text: "A superstar might change teams", points: 42, aliases: ["big name trade possible", "star player moving", "superstar rumors"] },
      { text: "Surprise picks and unexpected deals", points: 26, aliases: ["shocking trades", "unexpected deals", "surprise moves"] },
      { text: "Your team might finally get that missing piece", points: 18, aliases: ["team upgrades", "team gets better", "missing piece acquired"] },
      { text: "Real-time reaction to Woj and Shams tweets", points: 8, aliases: ["trade news updates", "following insiders", "live reaction"] },
      { text: "Seeing who gets bought out and where they land", points: 6, aliases: ["buyout market", "buyout signings", "released players"] },
    ]},
    { text: "Name something a player does to build his personal brand off the court", answers: [
      { text: "Launches a media company or podcast", points: 36, aliases: ["media company", "podcast", "content creator"] },
      { text: "Invests in restaurants or businesses", points: 26, aliases: ["restaurant ownership", "business investments", "entrepreneur"] },
      { text: "Gets his own shoe or clothing line", points: 20, aliases: ["signature shoe", "clothing line", "apparel brand"] },
      { text: "Acts in movies or TV shows", points: 12, aliases: ["acting", "film appearance", "TV shows"] },
      { text: "Launches a foundation or charity", points: 6, aliases: ["charity work", "foundation", "community giving"] },
    ]},
    { text: "Name a way a backup center makes a case to start", answers: [
      { text: "Outperforms the starter in limited minutes", points: 40, aliases: ["better in less time", "outproduces starter", "makes the most of minutes"] },
      { text: "Bigger body matches up better against a specific opponent", points: 26, aliases: ["matchup-based argument", "size matchup", "better matchup"] },
      { text: "Brings better energy and effort", points: 18, aliases: ["more effort", "more energy", "hustle player argument"] },
      { text: "Has been more consistent this stretch", points: 10, aliases: ["recent consistency", "hot streak lately", "consistent recently"] },
      { text: "Shoots from the outside better than the starter", points: 6, aliases: ["shooting advantage", "range over starter", "stretch five argument"] },
    ]},
  ],

  // Day 20
  [
    { text: "Name something a player does after winning a championship that surprises everyone", answers: [
      { text: "Retires immediately at the peak", points: 36, aliases: ["retires after winning", "walks away on top", "surprise retirement"] },
      { text: "Demands a trade to a new team anyway", points: 26, aliases: ["wants out after title", "trade demand post-championship"] },
      { text: "Loses all motivation the next season", points: 20, aliases: ["championship hangover", "drops off after title", "lost drive"] },
      { text: "Goes on a massive spending and partying spree", points: 12, aliases: ["celebrates wildly", "spends big", "party after championship"] },
      { text: "Becomes way more outspoken and controversial", points: 6, aliases: ["more vocal after title", "post-championship boldness", "speaks freely"] },
    ]},
    { text: "Name something about the NBA playoffs that is different from the regular season", answers: [
      { text: "Physicality and intensity are much higher", points: 40, aliases: ["more physical", "more intense", "harder hitting"] },
      { text: "Coaching adjustments happen faster", points: 26, aliases: ["quicker adjustments", "more coaching changes", "faster game plans"] },
      { text: "Every possession feels like life or death", points: 18, aliases: ["every play matters", "high stakes possessions", "nothing is wasted"] },
      { text: "Stars play way more minutes", points: 10, aliases: ["more playing time for stars", "stars stay on longer", "extended star minutes"] },
      { text: "Referees let more contact go", points: 6, aliases: ["refs let it go", "more contact allowed", "softer officiating"] },
    ]},
    { text: "Name a reason a superstar ends up on a bad team late in his career", answers: [
      { text: "He chose loyalty over winning and stayed too long", points: 36, aliases: ["loyal too long", "stayed past prime", "loyalty over winning"] },
      { text: "He chased the money instead of a contender", points: 28, aliases: ["chased money", "took biggest offer", "money over rings"] },
      { text: "His original team fell apart around him", points: 18, aliases: ["team crumbled", "team declined around him", "roster deteriorated"] },
      { text: "Age caught up and no contender wanted him", points: 12, aliases: ["too old for contenders", "declining player", "age limited options"] },
      { text: "Bad front office decisions left him stranded", points: 6, aliases: ["front office failure", "bad management", "organization failed him"] },
    ]},
    { text: "Name something an NBA coach does during a timeout that fans can't hear", answers: [
      { text: "Screams at specific players for mistakes", points: 38, aliases: ["yells at players", "calls out players", "specific player criticism"] },
      { text: "Draws up a play on the whiteboard", points: 28, aliases: ["draws play", "whiteboard diagram", "play design"] },
      { text: "Gives a motivational speech", points: 18, aliases: ["inspirational talk", "pep talk", "fires up the team"] },
      { text: "Points out specific defensive assignments", points: 10, aliases: ["assignments", "defensive breakdowns", "who guards who"] },
      { text: "Settles down a frustrated star", points: 6, aliases: ["calms down the star", "manages star emotions", "player management"] },
    ]},
    { text: "Name something fans do to show they are the most dedicated supporter of their team", answers: [
      { text: "Attend games even when the team is terrible", points: 40, aliases: ["goes to games no matter what", "loyal through bad times", "never misses a game"] },
      { text: "Owns a huge amount of merchandise", points: 26, aliases: ["tons of merch", "lots of gear", "merchandise collection"] },
      { text: "Knows every stat and roster detail", points: 18, aliases: ["stat expert", "knows the roster cold", "deep knowledge of team"] },
      { text: "Travels to away games", points: 10, aliases: ["road trip fan", "follows team on road", "away game attendance"] },
      { text: "Has memorabilia covering the walls at home", points: 6, aliases: ["wall of memorabilia", "fan shrine", "decorated house"] },
    ]},
  ],

  // Day 21
  [
    { text: "Name something an NBA player does that makes the crowd go absolutely silent", answers: [
      { text: "Gets a serious injury on the court", points: 44, aliases: ["gets hurt badly", "serious injury happens", "player down on court"] },
      { text: "Misses a wide open layup to lose the game", points: 28, aliases: ["misses easy shot", "blows layup", "open miss at the buzzer"] },
      { text: "Gets ejected from an important game", points: 16, aliases: ["ejected", "thrown out", "kicked out of game"] },
      { text: "Announces he's leaving the team after the game", points: 8, aliases: ["announces departure", "says he's leaving", "post-game announcement"] },
      { text: "A star fouls out in the fourth quarter", points: 4, aliases: ["fouled out", "six fouls", "foul trouble exit"] },
    ]},
    { text: "Name a reason teams avoid signing older veterans", answers: [
      { text: "Injury risk is too high", points: 40, aliases: ["injury concern", "health risk", "too injury prone"] },
      { text: "Won't accept a bench role gracefully", points: 26, aliases: ["ego issues", "wants to start", "refuses bench"] },
      { text: "Cap space is wasted on declining player", points: 18, aliases: ["cap waste", "overpaying for decline", "money tied up"] },
      { text: "Bad influence on young players", points: 10, aliases: ["bad mentor", "negative locker room presence", "poor influence"] },
      { text: "Can't keep up with modern pace of play", points: 6, aliases: ["too slow", "can't match pace", "pace and space struggle"] },
    ]},
    { text: "Name something a player does after a rival hits a buzzer beater to beat him", answers: [
      { text: "Stands frozen on the court in disbelief", points: 38, aliases: ["stunned on court", "can't move", "frozen in disbelief"] },
      { text: "Puts his head down and walks off quickly", points: 26, aliases: ["head down walks away", "avoids everyone", "silent exit"] },
      { text: "Congratulates the shooter with class", points: 18, aliases: ["shakes hands", "congratulates", "sportsmanship moment"] },
      { text: "Gets visibly emotional or cries", points: 12, aliases: ["cries on court", "emotional reaction", "tears"] },
      { text: "Already thinking about the next game", points: 6, aliases: ["mentally moves on", "refocuses instantly", "next game mindset"] },
    ]},
    { text: "Name something a bench-warming player does to stay mentally ready", answers: [
      { text: "Stays warmed up in the tunnel or sideline", points: 38, aliases: ["stays loose", "keeps body warm", "stays ready physically"] },
      { text: "Watches the game intensely to be prepared", points: 26, aliases: ["studies the game", "pays close attention", "focused watching"] },
      { text: "Talks to coaches frequently to stay in the loop", points: 18, aliases: ["communicates with coaches", "talks strategy", "stays involved with staff"] },
      { text: "Keeps a positive attitude in the locker room", points: 12, aliases: ["stays positive", "good locker room energy", "positive attitude"] },
      { text: "Reminds himself that he is one play away", points: 6, aliases: ["one play away mindset", "stays hungry", "opportunity mindset"] },
    ]},
    { text: "Name something a player does when he is clearly the best player on a bad team", answers: [
      { text: "Carries a huge scoring burden every night", points: 40, aliases: ["carries the team", "scores a ton", "offensive burden"] },
      { text: "Gets frustrated and visible in body language", points: 26, aliases: ["visibly frustrated", "body language issues", "frustration shows"] },
      { text: "Quietly starts asking about trades", points: 18, aliases: ["trade speculation", "asks about exit", "quiet trade questions"] },
      { text: "Puts up video game stats but team loses", points: 10, aliases: ["big stats in losses", "stats in losing effort", "padded stats"] },
      { text: "Gets credited nationally as an underrated superstar", points: 6, aliases: ["underrated recognition", "national notice", "gets recognition despite record"] },
    ]},
  ],

  // Day 22
  [
    { text: "Name something that makes NBA fans think a team has a real shot at the title", answers: [
      { text: "They have a healthy top-five player in the league", points: 40, aliases: ["elite healthy star", "top five player", "generational talent healthy"] },
      { text: "Their defense is elite going into the playoffs", points: 28, aliases: ["defensive unit", "great defense", "lockdown defense"] },
      { text: "They peaked at the right time in the season", points: 18, aliases: ["hot entering playoffs", "timing is right", "peaking late"] },
      { text: "They have proven playoff experience", points: 8, aliases: ["experienced team", "been there before", "knows how to win"] },
      { text: "Their role players are shooting well", points: 6, aliases: ["role players hot", "everyone contributing", "depth is clicking"] },
    ]},
    { text: "Name something a player does in the first quarter to set the tone for a big game", answers: [
      { text: "Hits his first three or four shots", points: 42, aliases: ["makes his first shots", "early scoring burst", "hot start"] },
      { text: "Gets physical early and establishes a presence", points: 26, aliases: ["physical play early", "sets hard screens", "makes his presence felt"] },
      { text: "Makes a statement block or steal", points: 16, aliases: ["early block", "big defensive play", "statement defensive play"] },
      { text: "Gets to the free throw line immediately", points: 10, aliases: ["gets fouled early", "to the line quickly", "draws fouls right away"] },
      { text: "Gets the crowd into it with his energy", points: 6, aliases: ["pumps up crowd", "crowd energy early", "energizes arena"] },
    ]},
    { text: "Name a reason the Eastern Conference is historically considered weaker than the West", answers: [
      { text: "The best teams and players gravitate toward the West", points: 36, aliases: ["top teams in West", "best players out West", "talent concentration"] },
      { text: "Eastern teams lose Finals to Western opponents regularly", points: 28, aliases: ["East loses Finals", "loses to West in Finals", "Western dominance in Finals"] },
      { text: "Elite players choose to go West in free agency", points: 20, aliases: ["stars go West", "free agents prefer West", "player destination preference"] },
      { text: "Weaker eight seeds in the East make playoffs easier", points: 10, aliases: ["easy path East", "weak eight seed", "less competitive bottom"] },
      { text: "Media markets focus more attention on Western stars", points: 6, aliases: ["LA and Golden State coverage", "media bias West", "West gets more attention"] },
    ]},
    { text: "Name something fans debate every year about the MVP race", answers: [
      { text: "Best player vs. most valuable to his team", points: 40, aliases: ["best vs most valuable", "valuable debate", "team dependency"] },
      { text: "Stats vs. wins as criteria", points: 26, aliases: ["stats vs team wins", "record matters", "wins factor"] },
      { text: "Whether a player on a bad team can win", points: 18, aliases: ["bad team MVP", "losing team candidate", "team record matters"] },
      { text: "Whether voters are biased toward big markets", points: 10, aliases: ["media bias", "big market bias", "voter favoritism"] },
      { text: "Second-half performance vs full season", points: 6, aliases: ["second half surge", "full season vs finish", "late season weight"] },
    ]},
    { text: "Name something a player does when he gets the yips at the free throw line", answers: [
      { text: "Steps back and resets his routine", points: 36, aliases: ["takes more time", "resets", "slows down the routine"] },
      { text: "Opponents start intentionally fouling him", points: 28, aliases: ["hack a player", "intentional fouls", "fouled on purpose"] },
      { text: "He starts airballing and short-arming shots", points: 18, aliases: ["airballs", "short arm", "misses badly"] },
      { text: "Coaches hide him late in games", points: 12, aliases: ["kept off court late", "pulled late game", "avoided in crunch time"] },
      { text: "Fans cheer every miss sarcastically", points: 6, aliases: ["fans react to misses", "sarcastic cheering", "crowd response"] },
    ]},
  ],

  // Day 23
  [
    { text: "Name something a player does to celebrate making the Hall of Fame", answers: [
      { text: "Gives an emotional speech thanking his family", points: 40, aliases: ["tearful speech", "emotional induction speech", "thanks family"] },
      { text: "Credits the coaches and teammates who helped him", points: 26, aliases: ["credits teammates", "thanks coaches", "credits support system"] },
      { text: "Hugs his parents or childhood mentor on stage", points: 18, aliases: ["hugs parents", "family moment on stage", "childhood mentor embrace"] },
      { text: "Wears a custom suit for the ceremony", points: 10, aliases: ["custom outfit", "dressed up", "outfit for induction"] },
      { text: "Talks about overcoming doubt and obstacles", points: 6, aliases: ["overcame doubt", "journey narrative", "talks about adversity"] },
    ]},
    { text: "Name a reason a player struggles in his second NBA season", answers: [
      { text: "Opponents figured out how to stop him", points: 42, aliases: ["opponents adjusted", "defenses adjusted", "league figured him out"] },
      { text: "He didn't work on his game in the offseason", points: 26, aliases: ["no offseason work", "didn't improve", "stagnant in offseason"] },
      { text: "Media attention and fame became a distraction", points: 18, aliases: ["fame distraction", "media pressure", "off court distractions"] },
      { text: "He got complacent after his strong rookie year", points: 8, aliases: ["complacency", "rested on rookie success", "lost hunger"] },
      { text: "Injury slowed his sophomore development", points: 6, aliases: ["sophomore injury", "hurt in second year", "health issues second year"] },
    ]},
    { text: "Name something an elite defender does that never shows up in the box score", answers: [
      { text: "Takes away the opponent's best move before it starts", points: 38, aliases: ["takes away first option", "denies best move", "no first option given"] },
      { text: "Communicates and helps teammates before switches", points: 26, aliases: ["defensive communication", "helps teammates", "vocal on defense"] },
      { text: "Gets into the head of a hot shooter", points: 18, aliases: ["mental game on shooter", "gets in his head", "psyches out the shooter"] },
      { text: "Forces the offense into their fourth option", points: 12, aliases: ["makes them go to backups", "limits options", "forces fourth option"] },
      { text: "Stays disciplined and doesn't bite on pump fakes", points: 6, aliases: ["not fooled by fakes", "discipline on pump fake", "doesn't jump on fakes"] },
    ]},
    { text: "Name something that makes an NBA locker room toxic", answers: [
      { text: "Stars who don't like each other personally", points: 40, aliases: ["player conflict", "stars hate each other", "personal beef"] },
      { text: "Players leaking information to the media", points: 26, aliases: ["leaks to press", "media leaks", "player talking to press"] },
      { text: "Role players who feel disrespected by the star", points: 18, aliases: ["role player resentment", "disrespected teammates", "ignored role players"] },
      { text: "Unequal treatment from the coaching staff", points: 10, aliases: ["favoritism from coaches", "unequal treatment", "coach plays favorites"] },
      { text: "Losing breeds negativity and blame", points: 6, aliases: ["losing causes conflict", "blame from losing", "losses create tension"] },
    ]},
    { text: "Name something a team does at the NBA draft to avoid looking bad on camera", answers: [
      { text: "Pretends to love every pick they make", points: 38, aliases: ["fake enthusiasm", "forced celebration", "acts thrilled about pick"] },
      { text: "Has someone ready to hug every selection", points: 26, aliases: ["photo op hugs", "staged celebrations", "celebrating every pick"] },
      { text: "Keeps trade conversations completely secret", points: 18, aliases: ["hides trade talks", "no leaks on draft night", "secretive negotiations"] },
      { text: "Avoids showing any reaction to rivals' picks", points: 12, aliases: ["neutral face for rivals", "hides reaction to others", "poker face for others"] },
      { text: "Dresses the entire front office in matching gear", points: 6, aliases: ["matching outfits", "team colors", "branded wardrobe"] },
    ]},
  ],

  // Day 24
  [
    { text: "Name something that happens when a team fires its coach in the middle of a winning streak", answers: [
      { text: "Players are shocked and confused", points: 38, aliases: ["shocked players", "team is confused", "players don't understand"] },
      { text: "Media calls it a front office power move", points: 26, aliases: ["called a power play", "front office narrative", "power struggle story"] },
      { text: "The team plays inspired ball for the new coach", points: 18, aliases: ["new coach bounce", "responds to new voice", "plays harder for new coach"] },
      { text: "The fired coach gets quickly hired by a rival", points: 12, aliases: ["rival hires him", "snapped up by rival", "hired right away"] },
      { text: "Everyone debates whether it was justified", points: 6, aliases: ["debate ensues", "media debates firing", "was it the right call"] },
    ]},
    { text: "Name something a player does when he's playing against his former team for the first time", answers: [
      { text: "Has a massive game to prove something", points: 42, aliases: ["plays great against them", "statement game", "big game vs ex-team"] },
      { text: "Stays calm and acts like it's any other game", points: 26, aliases: ["acts unbothered", "businesslike", "no emotion shown"] },
      { text: "Gets booed by fans who used to love him", points: 18, aliases: ["booed by his old fans", "former fans boo him", "reception is hostile"] },
      { text: "Hugs his former teammates warmly pregame", points: 8, aliases: ["embraces old teammates", "warm pregame greetings", "catches up with ex-teammates"] },
      { text: "Trash talks and is extra fired up", points: 6, aliases: ["emotional trash talk", "extra intense", "fired up against them"] },
    ]},
    { text: "Name something a team needs to compete for a championship beyond a star player", answers: [
      { text: "A reliable second scorer to share the load", points: 40, aliases: ["second star", "co-star", "reliable second option"] },
      { text: "An elite defensive anchor in the paint", points: 26, aliases: ["defensive anchor", "rim protector", "defensive big man"] },
      { text: "Three-point shooters surrounding the star", points: 18, aliases: ["shooters around star", "floor spacing", "three-point depth"] },
      { text: "A coach who can make adjustments in a series", points: 10, aliases: ["adjusting coach", "smart head coach", "coaching adjustments"] },
      { text: "Depth that doesn't fall off the bench", points: 6, aliases: ["strong bench", "depth pieces", "bench depth"] },
    ]},
    { text: "Name a reason fans respect a player who never won a championship", answers: [
      { text: "He gave everything he had every single night", points: 40, aliases: ["maximum effort always", "never quit", "complete dedication"] },
      { text: "He was loyal to his city or team", points: 26, aliases: ["loyal to one team", "city loyalty", "stayed faithful"] },
      { text: "He had incredible individual statistics", points: 18, aliases: ["great stats", "historical numbers", "individual greatness"] },
      { text: "He led through bad teams with class", points: 10, aliases: ["led bad teams", "carried bad squads", "no complaints about losing teams"] },
      { text: "He was robbed by injuries or circumstance", points: 6, aliases: ["injury robbed him", "bad luck", "injuries took away his chance"] },
    ]},
    { text: "Name something a player does when he feels disrespected by a contract offer", answers: [
      { text: "Rejects it immediately and makes it public", points: 38, aliases: ["publicly rejects offer", "turns it down loudly", "rejects and leaks it"] },
      { text: "Goes out and has a monster season in response", points: 28, aliases: ["motivated by disrespect", "proves them wrong with play", "responds on the court"] },
      { text: "Has his agent demand more money aggressively", points: 18, aliases: ["agent pushes back", "counter-offer demanded", "agent gets aggressive"] },
      { text: "Tests free agency to see his true market value", points: 10, aliases: ["hits open market", "tests market", "becomes free agent"] },
      { text: "Gives a pointed interview about being undervalued", points: 6, aliases: ["interview about respect", "public statement on value", "media comments on contract"] },
    ]},
  ],

  // Day 25
  [
    { text: "Name something that makes a player's post-retirement life difficult", answers: [
      { text: "Adjusting to life without the competition", points: 38, aliases: ["misses competition", "no competitive outlet", "withdrawal from competing"] },
      { text: "Managing his money and long-term finances", points: 26, aliases: ["financial management", "money problems", "managing wealth"] },
      { text: "Staying out of bad business deals", points: 18, aliases: ["bad investments", "scams", "predatory deals"] },
      { text: "Identity crisis without basketball", points: 12, aliases: ["who am I without the game", "identity loss", "basketball was everything"] },
      { text: "People only want him around for his name", points: 6, aliases: ["exploitation after career", "used for fame", "name value exploitation"] },
    ]},
    { text: "Name something an NBA power forward has to do to stay relevant in the modern game", answers: [
      { text: "Develop a reliable three-point shot", points: 42, aliases: ["shoot threes", "three-point ability", "stretch four skills"] },
      { text: "Guard multiple positions on defense", points: 26, aliases: ["positional versatility", "switches on D", "guard all positions"] },
      { text: "Fit into small-ball lineups alongside bigs", points: 16, aliases: ["play in small ball", "versatile enough for small lineup", "fits multiple lineups"] },
      { text: "Contribute in pick and roll at both ends", points: 10, aliases: ["pick and roll offense", "roll man", "pick and roll defense"] },
      { text: "Show the ability to create off the dribble", points: 6, aliases: ["create for himself", "iso ability", "dribble create"] },
    ]},
    { text: "Name something a first-time head coach struggles with in the NBA", answers: [
      { text: "Managing the egos of veteran players", points: 40, aliases: ["veteran egos", "star player management", "managing big names"] },
      { text: "In-game adjustments against elite coaches", points: 26, aliases: ["game time adjustments", "adjusting mid-game", "against veteran coaches"] },
      { text: "Balancing development of youth with winning now", points: 18, aliases: ["youth vs winning", "development vs results", "young players vs wins"] },
      { text: "Dealing with the media after losses", points: 10, aliases: ["media pressure", "press conferences", "media criticism"] },
      { text: "Getting the team to believe in his system", points: 6, aliases: ["system buy-in", "players trust the system", "implementing his system"] },
    ]},
    { text: "Name a reason fans love an NBA player who is not a superstar", answers: [
      { text: "He plays hard every single minute he's on the floor", points: 40, aliases: ["maximum effort", "never stops working", "plays hard always"] },
      { text: "He's authentic and relatable off the court", points: 26, aliases: ["relatable personality", "authentic person", "down to earth"] },
      { text: "He's loyal and hasn't chased big money", points: 18, aliases: ["took less money", "loyal to team", "didn't chase money"] },
      { text: "He does all the dirty work nobody else will", points: 10, aliases: ["dirty work", "does the little things", "grunt work"] },
      { text: "He's funny and entertaining on social media", points: 6, aliases: ["social media personality", "funny player", "entertaining online"] },
    ]},
    { text: "Name something about NBA travel that wears players down", answers: [
      { text: "Multiple time zone changes in a week", points: 38, aliases: ["time zone travel", "coast to coast", "multiple time zones"] },
      { text: "Playing back-to-back games in different cities", points: 28, aliases: ["back-to-backs", "consecutive away games", "back to back travel"] },
      { text: "Late night flights after games", points: 18, aliases: ["flying after games", "night flights", "late travel"] },
      { text: "Living out of a suitcase for stretches", points: 10, aliases: ["road trips", "constant travel", "suitcase life"] },
      { text: "Broken sleep schedules messing with recovery", points: 6, aliases: ["sleep disruption", "bad sleep", "recovery hurt by travel"] },
    ]},
  ],

  // Day 26
  [
    { text: "Name something a player does when he goes on a 40-point scoring outburst", answers: [
      { text: "Takes over completely in the fourth quarter", points: 40, aliases: ["fourth quarter takeover", "closes it out himself", "dominant fourth quarter"] },
      { text: "Hits shots from every area of the floor", points: 28, aliases: ["scores from everywhere", "multiple shot types", "all areas of court"] },
      { text: "Gets to the free throw line ten or more times", points: 18, aliases: ["many free throws", "draws fouls all game", "at the line all night"] },
      { text: "The crowd gives him a standing ovation", points: 8, aliases: ["standing ovation", "crowd rises", "fans on their feet"] },
      { text: "Opponents start sending doubles and triples", points: 6, aliases: ["triple teamed", "extreme double teams", "constant trapping"] },
    ]},
    { text: "Name something that makes a player a fan favorite in every city except his own", answers: [
      { text: "He's entertaining and plays with flair", points: 38, aliases: ["plays with style", "entertaining game", "flair in his game"] },
      { text: "He talks trash but backs it up", points: 26, aliases: ["backs up his talk", "trash talk with production", "talks and delivers"] },
      { text: "He's outspoken and unfiltered in media", points: 18, aliases: ["honest in interviews", "says what he thinks", "unfiltered quotes"] },
      { text: "He disrespected his home team and fans know it", points: 12, aliases: ["burned his city", "fell out with home fans", "disrespected the franchise"] },
      { text: "He's the ultimate villain fans love to hate", points: 6, aliases: ["villain player", "heel character", "lovable villain"] },
    ]},
    { text: "Name something a team does during training camp that signals big changes ahead", answers: [
      { text: "Gives a veteran a reduced role or less reps", points: 36, aliases: ["reduces veteran's role", "veteran demoted", "less time for vet"] },
      { text: "A young player outperforms a starter in every drill", points: 28, aliases: ["young player takes over", "rookie beats vet", "youth surpasses veteran"] },
      { text: "New system installed that didn't exist before", points: 18, aliases: ["new offense or defense", "new system implemented", "different scheme"] },
      { text: "A player reports significantly in better shape", points: 12, aliases: ["player got in shape", "body transformation", "comes in fit"] },
      { text: "A surprise player gets more first-team reps", points: 6, aliases: ["unexpected first team reps", "surprise starter in camp", "camp dark horse"] },
    ]},
    { text: "Name a reason an NBA dynasty ended too soon", answers: [
      { text: "Key players suffered major injuries", points: 40, aliases: ["injuries ended dynasty", "health issues broke it up", "injuries cut it short"] },
      { text: "Salary cap forced them to break apart the core", points: 28, aliases: ["cap issues", "salary cap broke them up", "couldn't afford the core"] },
      { text: "A rival team just got better and surpassed them", points: 18, aliases: ["better team ended run", "rival overtook them", "surpassed by competition"] },
      { text: "Stars left in free agency for new opportunities", points: 8, aliases: ["free agency departures", "stars left", "core left in offseason"] },
      { text: "Front office failed to retool around the window", points: 6, aliases: ["failed to add pieces", "bad management decisions", "front office mismanagement"] },
    ]},
    { text: "Name something NBA players openly admit they hate about the regular season", answers: [
      { text: "The long travel schedule and road trips", points: 38, aliases: ["travel grind", "road trips", "constant traveling"] },
      { text: "Back-to-back games with no rest", points: 28, aliases: ["back-to-backs", "consecutive games", "no recovery time"] },
      { text: "Meaningless games in the middle of January", points: 18, aliases: ["meaningless games", "middle of season games", "boring stretch games"] },
      { text: "Playing when injured through the grind", points: 10, aliases: ["playing hurt", "pushing through injury", "playing banged up"] },
      { text: "Being away from family for weeks at a time", points: 6, aliases: ["missing family", "away from home", "family separation"] },
    ]},
  ],

  // Day 27
  [
    { text: "Name something a player does to gain a mental edge before a huge playoff game", answers: [
      { text: "Watches film obsessively the night before", points: 38, aliases: ["film study", "watches film all night", "prepares by studying"] },
      { text: "Listens to a pump-up playlist before tipoff", points: 26, aliases: ["music ritual", "pre-game playlist", "headphones in tunnel"] },
      { text: "Visualizes success in detail beforehand", points: 18, aliases: ["visualization", "mental rehearsal", "imagines success"] },
      { text: "Talks himself up in the locker room mirror", points: 12, aliases: ["mirror talk", "pep talk to himself", "self motivation"] },
      { text: "Prays or follows a spiritual routine", points: 6, aliases: ["prayer", "spiritual preparation", "religious routine"] },
    ]},
    { text: "Name a reason a player's relationship with his city turns sour", answers: [
      { text: "He demands a trade after years of loyalty", points: 42, aliases: ["betrayal via trade demand", "turns on city", "trade demand ends love"] },
      { text: "He publicly insults the fanbase or city", points: 26, aliases: ["bad-mouths fans", "insults city", "disrespects the fanbase"] },
      { text: "He underperforms big games repeatedly", points: 18, aliases: ["disappears in big moments", "fails the city in big games", "chokes in big games"] },
      { text: "He appears to coast when it matters", points: 8, aliases: ["looks like he doesn't care", "not trying", "appears disinterested"] },
      { text: "He prioritizes personal brand over team success", points: 6, aliases: ["brand over team", "selfish priorities", "image over winning"] },
    ]},
    { text: "Name something that happens the night before a decisive Game 7", answers: [
      { text: "Players barely sleep from nerves or excitement", points: 38, aliases: ["can't sleep", "nerves keep them up", "sleepless night"] },
      { text: "Media hypes it as the most important game of careers", points: 26, aliases: ["career-defining framing", "media builds it up", "massive media narrative"] },
      { text: "Coaches send motivational messages to the group chat", points: 18, aliases: ["team message", "coach texts team", "motivational outreach"] },
      { text: "Arena and city feel electric with anticipation", points: 12, aliases: ["city buzzing", "electric atmosphere building", "arena energy building"] },
      { text: "Players check social media and regret it", points: 6, aliases: ["reads social media", "trolls and fans online", "social media before game"] },
    ]},
    { text: "Name something a veteran player teaches a young teammate that never appears in practice drills", answers: [
      { text: "How to read a defense before the play starts", points: 38, aliases: ["pre-snap reads", "read defense early", "pre-play recognition"] },
      { text: "How to manipulate referees with communication", points: 26, aliases: ["working refs", "talking to officials", "ref management"] },
      { text: "How to manage energy over an 82-game season", points: 18, aliases: ["energy management", "pacing over season", "82-game wisdom"] },
      { text: "How to mentally handle a bad shooting night", points: 12, aliases: ["managing slumps", "bounce back mentally", "staying confident in slumps"] },
      { text: "How to protect your body from the physicality", points: 6, aliases: ["body protection tips", "physical self-preservation", "staying healthy tricks"] },
    ]},
    { text: "Name something a team's city does when they land a marquee free agent", answers: [
      { text: "Immediately sells out the entire season", points: 40, aliases: ["season tickets gone instantly", "sold out season", "ticket demand explodes"] },
      { text: "Puts up billboards and murals welcoming him", points: 26, aliases: ["city puts up art", "murals go up", "billboards of new player"] },
      { text: "Local businesses create promotions around him", points: 18, aliases: ["business promotions", "local deals around his arrival", "restaurants name things after him"] },
      { text: "Mayor gives him a key to the city", points: 10, aliases: ["city key", "mayoral welcome", "official city welcome"] },
      { text: "Social media explodes with celebration", points: 6, aliases: ["fan social media celebration", "city goes crazy online", "internet buzz"] },
    ]},
  ],

  // Day 28
  [
    { text: "Name something a player does to show respect for an older legend he grew up watching", answers: [
      { text: "Name-drops him in interviews as his idol", points: 40, aliases: ["credits as idol", "calls him his role model", "mentions as inspiration"] },
      { text: "Wears his number or jersey as a tribute", points: 26, aliases: ["honors his number", "tribute jersey", "wears old idol's number"] },
      { text: "Seeks him out for advice and mentorship", points: 18, aliases: ["calls for advice", "asks for mentorship", "reaches out for guidance"] },
      { text: "Dedicates a big performance to him", points: 10, aliases: ["dedicates game to him", "tribute performance", "plays for him"] },
      { text: "Posts a heartfelt tribute on social media", points: 6, aliases: ["social media tribute", "heartfelt post", "Instagram tribute"] },
    ]},
    { text: "Name something that happens when two teams keep playing each other in the playoffs year after year", answers: [
      { text: "Personal rivalries and grudges develop between players", points: 40, aliases: ["player feuds", "personal beef grows", "grudge match"] },
      { text: "Every game feels like a war with massive stakes", points: 26, aliases: ["high stakes battle", "intensity grows", "always feels huge"] },
      { text: "Fans on both sides despise each other intensely", points: 18, aliases: ["fan rivalry intense", "fans hate each other", "deep fan animosity"] },
      { text: "The matchup gets its own media identity and name", points: 10, aliases: ["named series", "gets a nickname", "media names the rivalry"] },
      { text: "Both teams study each other better than anyone else", points: 6, aliases: ["know each other cold", "scouting advantage", "opposing team experts"] },
    ]},
    { text: "Name something a team does when their star player is ejected late in a close game", answers: [
      { text: "Everyone else elevates their effort", points: 38, aliases: ["next man up mentality", "teammates step up", "everyone plays harder"] },
      { text: "Coach draws up every play meticulously", points: 26, aliases: ["careful play design", "strategic coaching", "every play is calculated"] },
      { text: "The team still wins on pure heart", points: 18, aliases: ["wins without star", "heart win", "gutsy win"] },
      { text: "They collapse and lose by double digits", points: 12, aliases: ["fall apart without star", "crumbles without him", "lost without star"] },
      { text: "The crowd gets extra loud to help compensate", points: 6, aliases: ["crowd gets louder", "fan energy spikes", "crowd lifts team"] },
    ]},
    { text: "Name something a player does that fans still talk about twenty years later", answers: [
      { text: "A legendary buzzer-beater in a championship game", points: 42, aliases: ["iconic buzzer beater", "championship game winner", "famous last-second shot"] },
      { text: "A jaw-dropping dunk that broke the internet before the internet existed", points: 26, aliases: ["iconic dunk", "famous dunk", "poster dunk for the ages"] },
      { text: "An all-time great performance in a Finals game", points: 18, aliases: ["Finals performance", "iconic Finals game", "greatest Finals moment"] },
      { text: "A rivalry game that defined an era", points: 8, aliases: ["rivalry defining game", "generation-defining game", "era defining game"] },
      { text: "A crossover or move that made a Hall of Famer look foolish", points: 6, aliases: ["ankle breaker moment", "crossover moment", "famous move on star"] },
    ]},
    { text: "Name a reason a player leaves his home country to develop his NBA game", answers: [
      { text: "Better coaching and development infrastructure in the US", points: 40, aliases: ["better development", "US basketball infrastructure", "superior training"] },
      { text: "Exposure to the best competition in the world", points: 28, aliases: ["compete against best", "world class competition", "best level of play"] },
      { text: "NBA scouts watch American college and prep programs most", points: 18, aliases: ["scout visibility", "scouts watching", "better scouting exposure"] },
      { text: "Family sacrifices everything for his chance", points: 8, aliases: ["family sacrifice", "family moves for him", "family supports dream"] },
      { text: "Greater financial opportunity in the American system", points: 6, aliases: ["financial reasons", "money opportunity", "economic opportunity"] },
    ]},
  ],

  // Day 29
  [
    { text: "Name something a player does that makes him impossible to dislike even when he's beating your team", answers: [
      { text: "He compliments opponents genuinely after games", points: 38, aliases: ["praises opponents", "genuine respect", "class after wins"] },
      { text: "He plays joyful and expressive basketball", points: 28, aliases: ["plays with joy", "expressive game", "fun to watch even losing to him"] },
      { text: "He's humble despite being dominant", points: 18, aliases: ["humble superstar", "humility on display", "down to earth despite greatness"] },
      { text: "He's known for his off-court kindness and charity", points: 10, aliases: ["charitable player", "community off court", "good person reputation"] },
      { text: "He acknowledges the crowd even at away games", points: 6, aliases: ["acknowledges away crowd", "wave to opponent fans", "respect for away fans"] },
    ]},
    { text: "Name something that happens in a blowout game that never happens in a tight one", answers: [
      { text: "Stars check out with minutes left on the clock", points: 38, aliases: ["stars sit out end", "resting stars early", "star leaves with time remaining"] },
      { text: "Role players and end-of-bench guys get real minutes", points: 26, aliases: ["garbage time players", "bench warmers get time", "deep bench sees action"] },
      { text: "Fans start leaving early", points: 18, aliases: ["fans head for exits", "early departure", "stadium empties"] },
      { text: "Trash talk becomes more relaxed and playful", points: 12, aliases: ["relaxed trash talk", "lighthearted banter", "not serious anymore"] },
      { text: "The winning coach rests his voice", points: 6, aliases: ["coach relaxes", "coach sits back", "no more instructions needed"] },
    ]},
    { text: "Name something an NBA arena does to hype up the home crowd before a big game", answers: [
      { text: "Plays a thundering hype video on the jumbotron", points: 40, aliases: ["hype video", "jumbotron video", "big screen hype"] },
      { text: "Announcer introduces starters dramatically", points: 26, aliases: ["dramatic introductions", "starting lineup introduction", "player intro ceremony"] },
      { text: "Loud walk-out music for the starters", points: 18, aliases: ["player entrance music", "walkout songs", "intro songs"] },
      { text: "Gives out free noise-maker items to fans", points: 10, aliases: ["free thundersticks", "noisemakers given out", "free rally items"] },
      { text: "Starts the game with a special performance", points: 6, aliases: ["pregame performance", "musical act before game", "entertainment before tip"] },
    ]},
    { text: "Name something a player does to stay motivated when his team has no chance of making the playoffs", answers: [
      { text: "Focuses on personal stats and records", points: 40, aliases: ["chases stats", "personal milestones", "individual record pursuit"] },
      { text: "Plays for his next contract or free agency", points: 26, aliases: ["auditioning", "playing for contract", "free agency motivation"] },
      { text: "Mentors younger players on the roster", points: 18, aliases: ["develops young players", "teaches rookies", "mentoring role"] },
      { text: "Tries out new moves and expands his game", points: 10, aliases: ["experiments offensively", "tries new things", "develops new skill"] },
      { text: "Focuses on enjoying the game and the teammates", points: 6, aliases: ["enjoys the camaraderie", "appreciates teammates", "keeps it fun"] },
    ]},
    { text: "Name something that makes the NBA draft lottery feel dramatic every year", answers: [
      { text: "A team with the worst record doesn't get the top pick", points: 38, aliases: ["bad team doesn't win", "worst team jumps down", "lottery surprise"] },
      { text: "A team jumps from a low seed into the top three", points: 28, aliases: ["unexpected jump", "low probability team rises", "lottery miracle"] },
      { text: "Fans and GM representatives react in real time on camera", points: 18, aliases: ["real-time reactions", "camera reactions", "live GM reactions"] },
      { text: "A generational prospect is on the line", points: 10, aliases: ["once in a generation pick", "elite prospect at stake", "franchise player available"] },
      { text: "Rival teams get separated by only one slot", points: 6, aliases: ["rivals close together", "rivals nearly same spot", "rival narrow difference"] },
    ]},
  ],

  // Day 30
  [
    { text: "Name something a player does in his final NBA game that makes everyone emotional", answers: [
      { text: "He acknowledges the crowd and waves farewell", points: 40, aliases: ["waves goodbye to crowd", "acknowledges arena", "final wave to fans"] },
      { text: "He hugs every teammate one last time", points: 26, aliases: ["hugs teammates", "final embraces", "goodbye to teammates"] },
      { text: "He cries during his post-game interview", points: 18, aliases: ["cries in interview", "emotional interview", "tears in final presser"] },
      { text: "He scores in a meaningful final moment", points: 10, aliases: ["scores in last game", "meaningful final basket", "last points"] },
      { text: "He gives a heartfelt speech after the final buzzer", points: 6, aliases: ["final speech", "post-game farewell speech", "goodbye speech"] },
    ]},
    { text: "Name a reason the NBA is considered the most player-friendly league in sports", answers: [
      { text: "Players have real power in trades and free agency", points: 40, aliases: ["player empowerment", "players control destiny", "player movement power"] },
      { text: "Max contracts reward individual excellence", points: 26, aliases: ["max contracts", "individual salary rewards", "big money for stars"] },
      { text: "Stars can actually recruit each other to team up", points: 18, aliases: ["player recruiting", "stars team up openly", "free agency conversations"] },
      { text: "Smaller roster means every player matters", points: 10, aliases: ["12-man roster", "small roster", "fewer players means more value"] },
      { text: "Coaches and stars negotiate power openly", points: 6, aliases: ["player-coach power balance", "stars influence coaching", "coach player negotiations"] },
    ]},
    { text: "Name something that separates a good NBA team from a great one", answers: [
      { text: "A true closer who takes over in crunch time", points: 40, aliases: ["clutch player", "closer", "go-to in crunch time"] },
      { text: "Elite defense that shows up in the playoffs", points: 28, aliases: ["playoff defense", "defensive excellence", "lockdown defense when it matters"] },
      { text: "Depth that doesn't fall off after the starters", points: 18, aliases: ["deep bench", "bench production", "depth pieces"] },
      { text: "A coaching staff that consistently outsmarts rivals", points: 8, aliases: ["smart coaching", "outcoached rivals", "coaching advantage"] },
      { text: "Chemistry that holds under pressure", points: 6, aliases: ["chemistry under pressure", "team bond in hard moments", "trust in adversity"] },
    ]},
    { text: "Name something fans say every offseason that never actually happens", answers: [
      { text: "This is the year my team finally wins a title", points: 42, aliases: ["my team wins it this year", "this is our year", "championship prediction for own team"] },
      { text: "A player will finally reach his potential", points: 26, aliases: ["this player will break out", "he's about to figure it out", "this is his year"] },
      { text: "A rebuilding team will surprise everyone", points: 16, aliases: ["sleeper team prediction", "dark horse team", "surprise playoff team"] },
      { text: "A rival team's core will fall apart", points: 10, aliases: ["rival will implode", "enemy team breaks up", "rival core falls apart"] },
      { text: "A star player will take less money for a contender", points: 6, aliases: ["star takes discount", "takes a pay cut to win", "discount for championship"] },
    ]},
    { text: "Name something that would make the NBA even more exciting for fans", answers: [
      { text: "Bring back more physical defense", points: 36, aliases: ["more physical play", "let them play", "less foul calling"] },
      { text: "Shorten the regular season significantly", points: 26, aliases: ["fewer games", "shorter season", "reduce regular season"] },
      { text: "Add a mid-season tournament with real stakes", points: 18, aliases: ["mid-season tournament", "in-season tournament", "real cup competition"] },
      { text: "Let players mic'd up every single game", points: 14, aliases: ["mic'd up always", "open mics", "always mic players"] },
      { text: "Remove all load management rules", points: 6, aliases: ["ban load management", "make stars play", "eliminate load management"] },
    ]},
  ],
]

// ── NFL Questions (30 days) ──
const NFL_DAYS: Question[][] = [
  // Day 1 — QB drama / fan reactions / game day / defense / team morale
  [
    {
      text: "Name something that happens right after a quarterback throws an interception",
      answers: [
        { text: "Throws his hands up or helmet", points: 38 },
        { text: "Gets benched", points: 26, aliases: ["pulled from the game"] },
        { text: "Gets yelled at by the coach", points: 18 },
        { text: "Fans start booing", points: 10 },
        { text: "Comes back out and scores", points: 8 },
      ],
    },
    {
      text: "Name something fans do when their team loses by one score",
      answers: [
        { text: "Blame the kicker", points: 38 },
        { text: "Complain about the refs", points: 26 },
        { text: "Blame the head coach", points: 18 },
        { text: "Turn the TV off early", points: 10 },
        { text: "Go on social media and rant", points: 8 },
      ],
    },
    {
      text: "Name a reason fans love watching a really good running back",
      answers: [
        { text: "Breaking through tackles", points: 40 },
        { text: "Explosive speed to the outside", points: 24 },
        { text: "Juking defenders in the open field", points: 18 },
        { text: "Stiff-arming people to the ground", points: 12 },
        { text: "Scoring touchdowns in big moments", points: 6 },
      ],
    },
    {
      text: "Name something a pass rusher does to celebrate a sack",
      answers: [
        { text: "Does a custom dance or celebration", points: 40 },
        { text: "Points to teammates", points: 22 },
        { text: "Flexes at the crowd", points: 18 },
        { text: "Gets in the QB's face", points: 12 },
        { text: "Screams at the sky", points: 8 },
      ],
    },
    {
      text: "Name a sign that a team's season is already falling apart in Week 4",
      answers: [
        { text: "Starting quarterback gets injured", points: 38 },
        { text: "0-4 record already", points: 26 },
        { text: "Locker room leaks to the media", points: 18 },
        { text: "Star player requests a trade", points: 12 },
        { text: "Head coach is on the hot seat", points: 6 },
      ],
    },
  ],

  // Day 2 — Coaching decisions / receivers / Super Bowl culture / officiating / QB moments
  [
    {
      text: "Name something a coach gets criticized for after a loss",
      answers: [
        { text: "Going for it on 4th down and failing", points: 40 },
        { text: "Poor clock management at the end", points: 24 },
        { text: "Wrong challenge flag decision", points: 18 },
        { text: "Sticking with an underperforming QB", points: 12 },
        { text: "Calling a timeout at the wrong time", points: 6 },
      ],
    },
    {
      text: "Name something a wide receiver does when he drops a pass",
      answers: [
        { text: "Puts hands on helmet in disbelief", points: 40 },
        { text: "Looks down at his hands", points: 24 },
        { text: "Gets visibly frustrated with himself", points: 18 },
        { text: "Gets yelled at by the quarterback", points: 10 },
        { text: "Makes a big catch on the next play to make up for it", points: 8 },
      ],
    },
    {
      text: "We asked 100 sports fans: name something people do at a Super Bowl party",
      answers: [
        { text: "Eat a ton of food", points: 38 },
        { text: "Argue about the game", points: 24 },
        { text: "Watch the halftime show", points: 18 },
        { text: "Bet on the outcome", points: 12 },
        { text: "Only care about the commercials", points: 8 },
      ],
    },
    {
      text: "Name a call by referees that makes fans go absolutely crazy",
      answers: [
        { text: "Pass interference not called", points: 38 },
        { text: "Roughing the passer penalty", points: 28 },
        { text: "A reversed touchdown", points: 18 },
        { text: "Taunting penalty on a big play", points: 10 },
        { text: "Holding that only gets called on one team", points: 6 },
      ],
    },
    {
      text: "Name something that makes a quarterback look like a true leader",
      answers: [
        { text: "Winning a game-winning drive in the final two minutes", points: 42 },
        { text: "Staying calm under pressure", points: 24 },
        { text: "Firing up teammates on the sideline", points: 18 },
        { text: "Owning a mistake publicly after the game", points: 10 },
        { text: "Playing through an injury", points: 6 },
      ],
    },
  ],

  // Day 3 — Tailgates / big plays / defense / team drama / records
  [
    {
      text: "Name something you always see at a tailgate before a big game",
      answers: [
        { text: "Grilling food — burgers and hot dogs", points: 40 },
        { text: "People tossing a football around", points: 22 },
        { text: "Team jerseys and face paint everywhere", points: 18 },
        { text: "Loud music and drinking games", points: 12 },
        { text: "Someone's flat screen TV set up outside", points: 8 },
      ],
    },
    {
      text: "Name something fans say when a team scores a pick-six",
      answers: [
        { text: "Explode off the couch screaming", points: 38 },
        { text: "Say the season just turned around", points: 26 },
        { text: "Demand the defense gets more credit", points: 18 },
        { text: "Start trash-talking opposing fans immediately", points: 12 },
        { text: "Claim they knew it was coming", points: 6 },
      ],
    },
    {
      text: "Name a reason a star player's holdout makes fans angry",
      answers: [
        { text: "Team misses him and loses without him", points: 38 },
        { text: "Feels disloyal after years on the team", points: 28 },
        { text: "It distracts from the rest of the team", points: 18 },
        { text: "Training camp gets disrupted", points: 10 },
        { text: "Media talks about it nonstop", points: 6 },
      ],
    },
    {
      text: "Name something a dominant defensive lineman does that terrifies offensive linemen",
      answers: [
        { text: "Beats them off the line before they can react", points: 40 },
        { text: "Hits the quarterback before he can throw", points: 24 },
        { text: "Changes the play call just by lining up", points: 18 },
        { text: "Destroys double teams", points: 12 },
        { text: "Makes the whole offense nervous", points: 6 },
      ],
    },
    {
      text: "Name a record that makes casual fans stop and say 'wow'",
      answers: [
        { text: "Most passing yards in a single season", points: 38 },
        { text: "Most Super Bowl wins", points: 28 },
        { text: "Most career touchdowns", points: 18 },
        { text: "Most rushing yards in a game", points: 10 },
        { text: "Most consecutive games started", points: 6 },
      ],
    },
  ],

  // Day 4 — Fan behavior / QB benching / running game / locker room / officiating
  [
    {
      text: "Name something fans do during a blowout loss at home",
      answers: [
        { text: "Leave before the fourth quarter", points: 40 },
        { text: "Start booing their own team", points: 24 },
        { text: "Call for the backup quarterback", points: 18 },
        { text: "Sit silently in shock", points: 12 },
        { text: "Ask for a refund on the way out", points: 6 },
      ],
    },
    {
      text: "Name a reason a coach decides to bench the starting quarterback mid-game",
      answers: [
        { text: "Multiple turnovers in a row", points: 42 },
        { text: "Zero points and zero momentum", points: 24 },
        { text: "Visible injury that he's hiding", points: 18 },
        { text: "Fans and sideline demanding a change", points: 10 },
        { text: "The backup has been hot in practice", points: 6 },
      ],
    },
    {
      text: "Name something that makes a running back's job harder than people think",
      answers: [
        { text: "The offensive line not opening holes", points: 40 },
        { text: "Getting hit on every single play", points: 26 },
        { text: "Learning complex blocking schemes", points: 18 },
        { text: "Pass blocking against blitzing linebackers", points: 10 },
        { text: "Staying healthy for a 17-game season", points: 6 },
      ],
    },
    {
      text: "Name something that causes a locker room to turn on the coaching staff",
      answers: [
        { text: "Losing games the team was supposed to win", points: 38 },
        { text: "Playing favorites with certain players", points: 26 },
        { text: "Lying to players about roster decisions", points: 18 },
        { text: "Not adjusting the game plan after halftime", points: 12 },
        { text: "Public criticism of players after losses", points: 6 },
      ],
    },
    {
      text: "Name a penalty that almost everyone agrees is called too inconsistently",
      answers: [
        { text: "Holding on the offensive line", points: 40 },
        { text: "Roughing the passer", points: 28 },
        { text: "Pass interference", points: 18 },
        { text: "Unnecessary roughness", points: 8 },
        { text: "Taunting", points: 6 },
      ],
    },
  ],

  // Day 5 — Super Bowl / defense / QB comebacks / game day rituals / skill positions
  [
    {
      text: "We asked 100 sports fans: name the best part of Super Bowl Sunday",
      answers: [
        { text: "The game itself", points: 38 },
        { text: "The halftime show", points: 28 },
        { text: "The commercials", points: 18 },
        { text: "The party and atmosphere", points: 10 },
        { text: "The food", points: 6 },
      ],
    },
    {
      text: "Name something a cornerback does to frustrate a star wide receiver",
      answers: [
        { text: "Jams him at the line of scrimmage", points: 40 },
        { text: "Gets under his skin with trash talk", points: 24 },
        { text: "Follows him everywhere on the field", points: 18 },
        { text: "Breaks up the ball at the last second", points: 12 },
        { text: "Celebrates after every incomplete pass", points: 6 },
      ],
    },
    {
      text: "Name something that makes a fourth-quarter comeback feel legendary",
      answers: [
        { text: "Being down 17 or more points", points: 40 },
        { text: "The quarterback leading it with no timeouts", points: 24 },
        { text: "Scoring the winning points with under a minute left", points: 18 },
        { text: "The crowd being completely silent until the end", points: 12 },
        { text: "The opposing team celebrating too early", points: 6 },
      ],
    },
    {
      text: "Name a game day ritual that serious NFL fans swear actually works",
      answers: [
        { text: "Wearing the lucky jersey", points: 40 },
        { text: "Sitting in the exact same seat", points: 24 },
        { text: "Not watching if the team keeps losing when you do", points: 18 },
        { text: "Eating the same food every game", points: 12 },
        { text: "Turning the TV off then back on after a bad play", points: 6 },
      ],
    },
    {
      text: "Name something fans say when a tight end has a monster game",
      answers: [
        { text: "Why isn't he getting more targets every week", points: 38 },
        { text: "He's the most dangerous player on the field", points: 26 },
        { text: "Defenses just can't cover him", points: 18 },
        { text: "He should be in the MVP conversation", points: 12 },
        { text: "He makes the quarterback look so much better", points: 6 },
      ],
    },
  ],

  // Day 6 — Injuries / fan outrage / offensive line / team identity / playoff pressure
  [
    {
      text: "Name something fans immediately say when the star quarterback gets injured",
      answers: [
        { text: "The season is over", points: 42 },
        { text: "How long is he out", points: 28 },
        { text: "Time to see what the backup can do", points: 16 },
        { text: "We need to make a trade immediately", points: 8 },
        { text: "At least we can tank for a draft pick", points: 6 },
      ],
    },
    {
      text: "Name a reason fans think the offensive line never gets enough credit",
      answers: [
        { text: "The quarterback gets all the praise when they win", points: 40 },
        { text: "Nobody watches them during the play", points: 24 },
        { text: "They don't score touchdowns or make stats", points: 18 },
        { text: "They only get noticed when something goes wrong", points: 12 },
        { text: "Media never interviews them after games", points: 6 },
      ],
    },
    {
      text: "Name something that makes a fanbase feel like their team has a winning culture",
      answers: [
        { text: "Multiple Super Bowl titles in a decade", points: 40 },
        { text: "Always finding a way to win close games", points: 24 },
        { text: "A franchise quarterback who has been there for years", points: 18 },
        { text: "Consistent playoff appearances year after year", points: 12 },
        { text: "Players want to come here in free agency", points: 6 },
      ],
    },
    {
      text: "Name something that adds extra pressure to a playoff game",
      answers: [
        { text: "A veteran star's last chance at a ring", points: 38 },
        { text: "Playing at home with the crowd watching", points: 26 },
        { text: "A rematch of a previous playoff loss", points: 18 },
        { text: "A rookie quarterback in his first playoff start", points: 12 },
        { text: "National media saying one team has no chance", points: 6 },
      ],
    },
    {
      text: "Name something that makes fans turn on a player they used to love",
      answers: [
        { text: "Demanding a trade or forcing his way out", points: 40 },
        { text: "Bad performances in big games", points: 26 },
        { text: "Off-field controversy or behavior", points: 18 },
        { text: "Signing with a hated rival team", points: 10 },
        { text: "Publicly criticizing the coaching staff or teammates", points: 6 },
      ],
    },
  ],

  // Day 7 — Kickers / fan joy / play-calling / scouting / QB stats
  [
    {
      text: "Name a time when a kicker becomes the most important person in the stadium",
      answers: [
        { text: "A game-winning field goal attempt as time expires", points: 42 },
        { text: "A long field goal in cold weather", points: 26 },
        { text: "An extra point after a go-ahead touchdown", points: 16 },
        { text: "A kickoff out of bounds in a close game", points: 10 },
        { text: "An onside kick attempt in the fourth quarter", points: 6 },
      ],
    },
    {
      text: "Name something fans do when their team wins the Super Bowl",
      answers: [
        { text: "Rush into the streets or celebrate in public", points: 38 },
        { text: "Cry tears of joy", points: 26 },
        { text: "Call everyone they know immediately", points: 18 },
        { text: "Post nonstop on social media all night", points: 12 },
        { text: "Plan to buy every piece of championship merch", points: 6 },
      ],
    },
    {
      text: "Name a reason fans criticize an offensive coordinator",
      answers: [
        { text: "Predictable play-calling on third down", points: 40 },
        { text: "Not running the ball when it's working", points: 24 },
        { text: "Calling pass plays when the team should run out the clock", points: 18 },
        { text: "Never using the tight end in the red zone", points: 12 },
        { text: "Ignoring the team's best weapon", points: 6 },
      ],
    },
    {
      text: "Name a stat that NFL fans obsess over when evaluating a quarterback",
      answers: [
        { text: "Touchdown-to-interception ratio", points: 38 },
        { text: "Passer rating", points: 24 },
        { text: "Yards per attempt", points: 18 },
        { text: "Win-loss record as a starter", points: 14 },
        { text: "Fourth-quarter comeback wins", points: 6 },
      ],
    },
    {
      text: "Name something that gets said about a player who busts after being a top draft pick",
      answers: [
        { text: "He never lived up to the hype", points: 40 },
        { text: "The team wasted a first-round pick", points: 26 },
        { text: "He was a product of his college system", points: 18 },
        { text: "The scouts missed badly on that one", points: 10 },
        { text: "He just didn't have the work ethic", points: 6 },
      ],
    },
  ],

  // Day 8 — Home field / fan loyalty / goal-line / broadcast / rivalries
  [
    {
      text: "Name something that makes a home stadium feel intimidating to visiting teams",
      answers: [
        { text: "The crowd noise making it impossible to hear signals", points: 42 },
        { text: "Fans being hostile and loud from kickoff", points: 26 },
        { text: "The team historically dominating at home", points: 16 },
        { text: "The weather conditions unique to that stadium", points: 10 },
        { text: "Opposing players have a history of choking there", points: 6 },
      ],
    },
    {
      text: "Name a reason a fan stays loyal to a team that hasn't won in years",
      answers: [
        { text: "Grew up watching them with family", points: 40 },
        { text: "The city pride and identity tied to the team", points: 26 },
        { text: "Genuine hope that this is finally the year", points: 18 },
        { text: "Too invested after years of suffering to quit now", points: 10 },
        { text: "Still love the players on the roster", points: 6 },
      ],
    },
    {
      text: "Name something coaches argue about when deciding to go for it on the goal line",
      answers: [
        { text: "Whether to run or pass on 4th and 1", points: 38 },
        { text: "Trusting the offensive line to get a push", points: 26 },
        { text: "What the score is and how much time is left", points: 18 },
        { text: "Whether the defense has been stopping short yardage", points: 12 },
        { text: "The quarterback sneaking it himself", points: 6 },
      ],
    },
    {
      text: "Name something NFL broadcast announcers say that makes fans roll their eyes",
      answers: [
        { text: "Talking about a quarterback's leadership and intangibles", points: 40 },
        { text: "Overhyping a player after one good game", points: 24 },
        { text: "Saying a team has all the momentum after a coin flip", points: 18 },
        { text: "Mentioning a totally irrelevant statistic", points: 12 },
        { text: "Praising the losing team for almost winning", points: 6 },
      ],
    },
    {
      text: "Name a reason a rivalry game feels different from any other regular season game",
      answers: [
        { text: "Both fan bases absolutely hate each other", points: 40 },
        { text: "The outcome affects playoff seeding", points: 24 },
        { text: "Players talk trash publicly all week before it", points: 18 },
        { text: "Former teammates face each other", points: 12 },
        { text: "The game usually comes down to the last play", points: 6 },
      ],
    },
  ],

  // Day 9 — Special teams / off-season / QB comparison / fans at road games / big hits
  [
    {
      text: "Name something that makes a special teams play go viral",
      answers: [
        { text: "A trick play touchdown on a fake punt", points: 40 },
        { text: "A kickoff return for a touchdown", points: 26 },
        { text: "A blocked field goal returned for a score", points: 18 },
        { text: "A punt return broken all the way back", points: 10 },
        { text: "A holder throwing for a two-point conversion", points: 6 },
      ],
    },
    {
      text: "Name something fans complain about during the NFL off-season",
      answers: [
        { text: "Their team not signing the right free agents", points: 40 },
        { text: "Draft day trades that make no sense", points: 24 },
        { text: "Too much coverage of one team all the time", points: 18 },
        { text: "Superstar players switching teams", points: 12 },
        { text: "Endless mock drafts that are always wrong", points: 6 },
      ],
    },
    {
      text: "Name something fans bring up in every 'greatest QB ever' debate",
      answers: [
        { text: "Number of Super Bowl rings", points: 40 },
        { text: "Regular season stats over a career", points: 26 },
        { text: "Playoff performance when it mattered most", points: 18 },
        { text: "The quality of teammates and coaches around them", points: 10 },
        { text: "Era and competition level they played in", points: 6 },
      ],
    },
    {
      text: "Name something NFL fans who travel to road games deal with",
      answers: [
        { text: "Rival fans taunting and heckling them", points: 40 },
        { text: "Being massively outnumbered in the stands", points: 26 },
        { text: "Having to tone it down for their own safety", points: 18 },
        { text: "Finding good seats that aren't surrounded by hostility", points: 10 },
        { text: "Expensive travel costs for a potentially bad game", points: 6 },
      ],
    },
    {
      text: "Name a type of hit that makes the crowd gasp and go silent",
      answers: [
        { text: "A blindside hit on a defenseless receiver", points: 40 },
        { text: "A quarterback getting crushed after throwing", points: 26 },
        { text: "A player staying down on the field motionless", points: 18 },
        { text: "A helmet-to-helmet collision at full speed", points: 10 },
        { text: "A running back getting stopped with extreme force at the goal line", points: 6 },
      ],
    },
  ],

  // Day 10 — Preseason / trade deadline / receivers vs DBs / fan arguments / halftime adjustments
  [
    {
      text: "Name a reason NFL fans don't care about preseason games",
      answers: [
        { text: "The starters barely play", points: 42 },
        { text: "The outcomes don't matter at all", points: 28 },
        { text: "Ticket prices are still full price somehow", points: 14 },
        { text: "There's no real intensity or competition", points: 10 },
        { text: "Half the roster playing won't be on the team in a month", points: 6 },
      ],
    },
    {
      text: "Name something that happens at the NFL trade deadline that gets fans excited",
      answers: [
        { text: "A star player getting moved to a contender", points: 40 },
        { text: "A team making a blockbuster move that changes the conference", points: 26 },
        { text: "Your own team making an unexpected acquisition", points: 18 },
        { text: "A disgruntled player finally getting his wish", points: 10 },
        { text: "Draft picks changing hands in a confusing three-team deal", points: 6 },
      ],
    },
    {
      text: "Name something a wide receiver says about a cornerback who holds him every play",
      answers: [
        { text: "The refs let him get away with murder out there", points: 40 },
        { text: "He can't cover me straight up so he has to hold", points: 26 },
        { text: "He knows he'll lose if it's a clean play", points: 18 },
        { text: "He's only good because the refs don't call it", points: 10 },
        { text: "He knows my route before I run it, which is suspicious", points: 6 },
      ],
    },
    {
      text: "Name something fans argue about nonstop in fantasy football",
      answers: [
        { text: "Whether to start a player with a tough matchup", points: 38 },
        { text: "Who the best waiver wire pickup is", points: 26 },
        { text: "Whether running backs are even worth drafting early", points: 18 },
        { text: "Whether a trade offer is fair or highway robbery", points: 12 },
        { text: "Who deserved to win a matchup where the wrong team won", points: 6 },
      ],
    },
    {
      text: "Name a halftime adjustment that actually changes the outcome of a game",
      answers: [
        { text: "Switching to more running plays after getting passed on all half", points: 38 },
        { text: "Double-teaming the opponent's best receiver", points: 26 },
        { text: "Benching a quarterback who has been terrible", points: 18 },
        { text: "Changing the defensive scheme to stop the run", points: 12 },
        { text: "Going no-huddle to speed up the pace", points: 6 },
      ],
    },
  ],

  // Day 11 — Monday Night Football / rookie QBs / red zone / two-minute drill / Hall of Fame
  [
    {
      text: "Name something that makes a Monday Night Football game feel special",
      answers: [
        { text: "The entire country is watching at the same time", points: 40 },
        { text: "Both teams are undefeated or highly ranked", points: 24 },
        { text: "The primetime atmosphere and energy in the stadium", points: 18 },
        { text: "The iconic theme song playing at the start", points: 12 },
        { text: "Players performing like they want the spotlight", points: 6 },
      ],
    },
    {
      text: "Name something fans say when a rookie quarterback has a bad first start",
      answers: [
        { text: "Give him time, he's just a rookie", points: 38 },
        { text: "They threw him out there too soon", points: 26 },
        { text: "One bad game doesn't define him", points: 18 },
        { text: "Maybe the team should have kept the veteran", points: 12 },
        { text: "He's going to be great but needs another year", points: 6 },
      ],
    },
    {
      text: "Name a reason teams struggle in the red zone even when they're moving the ball easily",
      answers: [
        { text: "The field is too compressed for big plays to open up", points: 40 },
        { text: "Defenses bring extra defenders and blitz more", points: 26 },
        { text: "Penalties kill drives at the worst moments", points: 18 },
        { text: "Teams get conservative and predictable near the end zone", points: 10 },
        { text: "Turnovers that happen more under pressure close to the goal line", points: 6 },
      ],
    },
    {
      text: "Name something a great quarterback does in the two-minute drill that average ones can't",
      answers: [
        { text: "Stays ice-cold no matter how much pressure there is", points: 40 },
        { text: "Moves the whole team down the field in under 90 seconds", points: 26 },
        { text: "Makes perfect decisions with the clock running down", points: 18 },
        { text: "Audiables out of bad plays at the line of scrimmage", points: 10 },
        { text: "Converts the big third down when the season is on the line", points: 6 },
      ],
    },
    {
      text: "Name something fans debate when a player is on the Hall of Fame ballot",
      answers: [
        { text: "Whether stats alone are enough without a ring", points: 40 },
        { text: "Whether a single dominant era counts as a full career", points: 24 },
        { text: "Whether off-field issues should affect the vote", points: 18 },
        { text: "Whether advanced stats or eye test matters more", points: 12 },
        { text: "Whether being the best at their position is enough", points: 6 },
      ],
    },
  ],

  // Day 12 — Weather games / contract drama / defensive coordinators / punt decisions / fan predictions
  [
    {
      text: "Name something that changes how a game is played when there's a snowstorm",
      answers: [
        { text: "Teams run the ball way more than they pass", points: 40 },
        { text: "Quarterbacks struggle to grip and throw the ball accurately", points: 26 },
        { text: "Turnovers and fumbles happen much more often", points: 18 },
        { text: "Kicking becomes almost impossible", points: 10 },
        { text: "Players tire faster moving through the snow", points: 6 },
      ],
    },
    {
      text: "Name a reason a franchise player's contract negotiation turns into a drama",
      answers: [
        { text: "The team lowballs him and he leaks it to the media", points: 40 },
        { text: "He skips training camp until he gets paid", points: 26 },
        { text: "A rival team offers him a better deal publicly", points: 18 },
        { text: "His agent makes aggressive demands the team won't meet", points: 10 },
        { text: "Both sides blame the other in press conferences", points: 6 },
      ],
    },
    {
      text: "Name a reason fans appreciate a great defensive coordinator",
      answers: [
        { text: "Creating disguised coverages that confuse even elite quarterbacks", points: 40 },
        { text: "Getting the most out of players who aren't stars", points: 24 },
        { text: "Stopping the opposing offense's best player completely", points: 18 },
        { text: "Winning games when the offense is struggling badly", points: 12 },
        { text: "Having a completely different scheme than anyone expects", points: 6 },
      ],
    },
    {
      text: "Name a reason a coach decides to punt instead of going for it on 4th and short",
      answers: [
        { text: "Playing conservatively to protect a lead", points: 40 },
        { text: "Deep in his own territory and not wanting to give points", points: 26 },
        { text: "Not trusting the offense to convert under pressure", points: 18 },
        { text: "The analytics say field position matters more there", points: 10 },
        { text: "The opponent's offense has been unstoppable all game", points: 6 },
      ],
    },
    {
      text: "Name something fans always predict in August that turns out to be completely wrong",
      answers: [
        { text: "Which team is going to win the Super Bowl", points: 40 },
        { text: "Which quarterback will win MVP", points: 26 },
        { text: "Which team will go from last to first place", points: 18 },
        { text: "Which rookie will be the best player from his draft class", points: 10 },
        { text: "Which team will completely fall apart after a great previous season", points: 6 },
      ],
    },
  ],

  // Day 13 — Blitzing / fan meltdowns / power rankings / color rush uniforms / goal-line stands
  [
    {
      text: "Name a reason a blitz backfires badly on a defense",
      answers: [
        { text: "The quarterback reads it and throws a quick touchdown pass", points: 40 },
        { text: "The running back slips through untouched for a big gain", points: 26 },
        { text: "The receiver runs free behind the vacated coverage", points: 18 },
        { text: "A penalty wipes out the resulting sack or turnover", points: 10 },
        { text: "The quarterback scrambles for a first down", points: 6 },
      ],
    },
    {
      text: "Name something that causes a fan to fully melt down during a game",
      answers: [
        { text: "A turnover right before halftime", points: 38 },
        { text: "Blowing a double-digit fourth-quarter lead", points: 26 },
        { text: "A bad call that directly leads to the other team scoring", points: 18 },
        { text: "The kicker missing an easy field goal to win the game", points: 12 },
        { text: "A hail mary touchdown caught against all odds", points: 6 },
      ],
    },
    {
      text: "Name a reason NFL power rankings cause arguments every Monday",
      answers: [
        { text: "Voters clearly have a bias toward big market teams", points: 38 },
        { text: "A 5-0 team somehow ranked below a 4-1 team", points: 26 },
        { text: "A team gets penalized for a close win over a bad team", points: 18 },
        { text: "The system ignores strength of schedule", points: 12 },
        { text: "Whoever wins on Sunday gets bumped up automatically", points: 6 },
      ],
    },
    {
      text: "Name something fans say about alternate or color rush uniforms",
      answers: [
        { text: "They look amazing and the team should wear them every week", points: 38 },
        { text: "It's so hard to tell the teams apart on TV", points: 28 },
        { text: "The team always seems to win when they wear them", points: 18 },
        { text: "Bring back the classic uniforms instead", points: 10 },
        { text: "The league only does it to sell merchandise", points: 6 },
      ],
    },
    {
      text: "Name a reason a goal-line stand by the defense feels like the best play in football",
      answers: [
        { text: "The crowd goes absolutely insane when it holds", points: 40 },
        { text: "The defense stopping power against power with everything on the line", points: 24 },
        { text: "The momentum swing is immediate and visible", points: 18 },
        { text: "The offensive line can't believe they just got stopped", points: 12 },
        { text: "It can literally change the outcome of the game in one series", points: 6 },
      ],
    },
  ],

  // Day 14 — Night games / franchise QBs / punt returns / sideline moments / playoff atmosphere
  [
    {
      text: "Name something that makes a night game in a packed stadium feel electric",
      answers: [
        { text: "The stadium lights and noise from 70,000 fans", points: 40 },
        { text: "Both teams are playoff contenders with something to prove", points: 26 },
        { text: "A famous halftime or pre-game ceremony", points: 18 },
        { text: "National TV cameras showing celebrity fans in the crowd", points: 10 },
        { text: "A heated rivalry history between the two teams", points: 6 },
      ],
    },
    {
      text: "Name a quality that separates a franchise quarterback from just a good one",
      answers: [
        { text: "The ability to win games the team has no right winning", points: 40 },
        { text: "Making everyone around him dramatically better", points: 26 },
        { text: "Performing best when the stakes are highest", points: 18 },
        { text: "Being the undisputed leader of the whole organization", points: 10 },
        { text: "Staying healthy and consistent over a decade or more", points: 6 },
      ],
    },
    {
      text: "Name something that makes a punt return look impossible until it isn't",
      answers: [
        { text: "The returner navigating through 10 defenders with no lanes", points: 40 },
        { text: "Setting up a block with a subtle cut", points: 24 },
        { text: "Making the last defender miss in the open field", points: 18 },
        { text: "Starting toward the sideline before cutting back up the middle", points: 12 },
        { text: "Somehow outrunning coverage with very average speed", points: 6 },
      ],
    },
    {
      text: "Name something that happens on the sideline that cameras always catch",
      answers: [
        { text: "A coach screaming at an official after a bad call", points: 40 },
        { text: "A quarterback throwing his helmet after being benched", points: 26 },
        { text: "Two teammates arguing visibly after a big mistake", points: 18 },
        { text: "An injured player getting helped off and looking devastated", points: 10 },
        { text: "A star player celebrating a teammate's score from the bench area", points: 6 },
      ],
    },
    {
      text: "Name something that makes a playoff atmosphere different from a regular season game",
      answers: [
        { text: "Every single play feels like a life or death situation", points: 40 },
        { text: "The crowd is louder and more intense than any regular game", points: 26 },
        { text: "Players are visibly more emotional before and after big plays", points: 18 },
        { text: "Injuries and adversity hit differently when there's no next week", points: 10 },
        { text: "Both coaching staffs are clearly game-planning at a different level", points: 6 },
      ],
    },
  ],

  // Day 15 — Franchise QBs leaving / 4th down analytics / fan superstitions / sacks / draft day
  [
    {
      text: "Name a reason fans feel betrayed when a beloved quarterback leaves their team",
      answers: [
        { text: "He won games there that defined the franchise", points: 40 },
        { text: "He publicly said he wanted to stay and then left anyway", points: 26 },
        { text: "He signed with a division rival and immediately beat them", points: 18 },
        { text: "The team moved on from him before they had a real replacement", points: 10 },
        { text: "He seemed to blame the organization publicly when leaving", points: 6 },
      ],
    },
    {
      text: "Name a reason some coaches refuse to use analytics on fourth down decisions",
      answers: [
        { text: "They trust their gut from 30 years of coaching experience", points: 40 },
        { text: "They don't want to look bad if a calculated risk fails", points: 26 },
        { text: "They think football is about emotion not spreadsheets", points: 18 },
        { text: "The players respond better to instinctive bold decisions", points: 10 },
        { text: "The numbers don't account for the specific matchup on that play", points: 6 },
      ],
    },
    {
      text: "Name a fan superstition that people genuinely believe affects the game",
      answers: [
        { text: "Wearing a specific lucky jersey on game day", points: 40 },
        { text: "Sitting in the exact same spot and not moving", points: 24 },
        { text: "Not watching when the team keeps winning without you watching", points: 18 },
        { text: "Turning the TV off during a bad play", points: 12 },
        { text: "Eating the same exact food before every win", points: 6 },
      ],
    },
    {
      text: "Name something that makes a sack more satisfying than any other defensive play",
      answers: [
        { text: "The quarterback losing yards at a crucial down-and-distance", points: 40 },
        { text: "The defender beating a double team to get there", points: 26 },
        { text: "The timing on a third-and-long to force a punt", points: 18 },
        { text: "The whole crowd feeling it simultaneously", points: 10 },
        { text: "The defender had clearly been held all game before finally breaking free", points: 6 },
      ],
    },
    {
      text: "Name something that makes NFL Draft night feel like must-watch TV",
      answers: [
        { text: "Unexpected trades that shake up the whole board", points: 38 },
        { text: "Fans booing a pick they disagree with on live television", points: 26 },
        { text: "Teams trading up and giving away tons of picks for one player", points: 18 },
        { text: "A prospect's emotional reaction when his name is called", points: 12 },
        { text: "A team reaching for a player nobody had ranked that high", points: 6 },
      ],
    },
  ],

  // Day 16 — Overtime / locker room speeches / WR routes / offensive line praise / comebacks
  [
    {
      text: "Name a reason NFL overtime rules create arguments every single time they're used",
      answers: [
        { text: "One team can win without the other team touching the ball", points: 42 },
        { text: "The coin flip feels like it decides the game before a snap", points: 28 },
        { text: "The rules changed recently and fans can't agree on the new version", points: 16 },
        { text: "A great defensive stop still doesn't guarantee you get the ball back", points: 8 },
        { text: "College overtime feels more exciting and fair to many people", points: 6 },
      ],
    },
    {
      text: "Name something a coach says in a halftime locker room speech to change the energy",
      answers: [
        { text: "Reminds the team what they've worked for all season", points: 40 },
        { text: "Calls out specific players for not giving full effort", points: 24 },
        { text: "Tells them the other team is celebrating already and that should make them angry", points: 18 },
        { text: "Gives calm tactical adjustments rather than yelling", points: 12 },
        { text: "Reminds them nobody believed in them all year and they're still here", points: 6 },
      ],
    },
    {
      text: "Name a wide receiver route that fans love watching because it's just effective",
      answers: [
        { text: "A post route splitting the safety for a deep touchdown", points: 40 },
        { text: "A slant where he turns up field immediately for a big gain", points: 24 },
        { text: "A crossing route where he picks up huge yards after the catch", points: 18 },
        { text: "A go route where he just burns a cornerback with pure speed", points: 12 },
        { text: "A back-shoulder throw where the QB and WR are perfectly in sync", points: 6 },
      ],
    },
    {
      text: "Name something fans say when they finally appreciate how good the offensive line is",
      answers: [
        { text: "The quarterback has all day to throw and nobody talks about it", points: 40 },
        { text: "The running back would be nothing without those guys", points: 26 },
        { text: "They dominate physically every single week and get zero credit", points: 18 },
        { text: "You don't realize how good they are until one of them gets hurt", points: 10 },
        { text: "Other teams tried to sign away their linemen all off-season for a reason", points: 6 },
      ],
    },
    {
      text: "Name something about a historic comeback that makes fans still talk about it years later",
      answers: [
        { text: "The magnitude of the deficit made it seem literally impossible", points: 40 },
        { text: "The specific game it happened in — a playoff game or Super Bowl", points: 26 },
        { text: "The opposing team appeared to have already won", points: 18 },
        { text: "One player single-handedly willed his team back into the game", points: 10 },
        { text: "The way the opposing fanbase reacted when it slipped away", points: 6 },
      ],
    },
  ],

  // Day 17 — Injuries (recovery) / crowd noise / DB picks / draft picks traded / flag on the field
  [
    {
      text: "Name something that makes a player's return from a serious injury feel like a movie moment",
      answers: [
        { text: "Making a huge play in the first game back", points: 40 },
        { text: "The crowd giving him a standing ovation on the first play", points: 26 },
        { text: "The emotional reaction from teammates on the sideline", points: 18 },
        { text: "Coming back faster than anyone thought possible", points: 10 },
        { text: "Visibly proving doubters wrong with dominant play right away", points: 6 },
      ],
    },
    {
      text: "Name something home fans do specifically to mess with the opposing offense",
      answers: [
        { text: "Get as loud as possible on every third down play", points: 40 },
        { text: "Cheer when the visiting quarterback starts calling audibles", points: 24 },
        { text: "Start noise right as the play clock hits zero", points: 18 },
        { text: "Wave and distract receivers trying to catch passes near the stands", points: 12 },
        { text: "Keep chanting and making noise even during TV timeouts", points: 6 },
      ],
    },
    {
      text: "Name something a cornerback does to set up an interception",
      answers: [
        { text: "Bites on a route before breaking back on the ball", points: 38 },
        { text: "Lets the receiver think he has the route before undercutting it", points: 26 },
        { text: "Reads the quarterback's eyes the entire time", points: 18 },
        { text: "Disguises his coverage until the ball is in the air", points: 12 },
        { text: "Gets a tip from a teammate's film breakdown before the game", points: 6 },
      ],
    },
    {
      text: "Name a reason trading away future first-round picks makes fans nervous",
      answers: [
        { text: "The team might be bad when those picks become high-value", points: 40 },
        { text: "History shows that trading picks usually hurts long-term", points: 26 },
        { text: "The player acquired in the trade might not even be here that long", points: 18 },
        { text: "First-round picks are how you find franchise players", points: 10 },
        { text: "The team giving the picks usually regrets it in three years", points: 6 },
      ],
    },
    {
      text: "Name something fans yell at the TV when a flag flies on a critical play",
      answers: [
        { text: "That is the worst call I have ever seen in my life", points: 40 },
        { text: "You can't make that call in this situation", points: 26 },
        { text: "That penalty has never been called before in any game ever", points: 18 },
        { text: "The refs have been deciding this game the whole time", points: 10 },
        { text: "That flag is going to cost us the entire season", points: 6 },
      ],
    },
  ],

  // Day 18 — Hard knocks / fan predictions wrong / quick snap / team chemistry / first downs
  [
    {
      text: "Name something Hard Knocks always shows about NFL teams that surprises casual fans",
      answers: [
        { text: "How emotional and human the coaches are behind the scenes", points: 40 },
        { text: "How intense and physical practices actually are", points: 26 },
        { text: "Stars being openly vulnerable about pressure and expectations", points: 18 },
        { text: "The difficulty of roster cuts on players who are genuinely close", points: 10 },
        { text: "How much the players genuinely like each other off the field", points: 6 },
      ],
    },
    {
      text: "Name a bold prediction fans make every year that never comes true",
      answers: [
        { text: "A team with a new quarterback going to the Super Bowl right away", points: 38 },
        { text: "A struggling franchise finally breaking through this year", points: 26 },
        { text: "A highly-paid free agent immediately fixing everything", points: 18 },
        { text: "A rookie receiver becoming the best in the league in year one", points: 12 },
        { text: "A fired head coach doing great with a completely different team", points: 6 },
      ],
    },
    {
      text: "Name a reason a no-huddle offense is so hard to defend in the fourth quarter",
      answers: [
        { text: "The defense can't substitute and gets worn down physically", points: 40 },
        { text: "The offense finds mismatches before the defense can adjust", points: 26 },
        { text: "The hurry-up pace prevents coordinators from calling complex defenses", points: 18 },
        { text: "Defensive linemen are exhausted and can't rush the passer", points: 10 },
        { text: "The quarterback controls the whole tempo and defense can't stop it", points: 6 },
      ],
    },
    {
      text: "Name something that builds genuine team chemistry over a long season",
      answers: [
        { text: "Going through a rough losing streak and fighting through together", points: 40 },
        { text: "Veterans taking care of and mentoring younger players genuinely", points: 24 },
        { text: "A shared belief in the coaching staff and system", points: 18 },
        { text: "Celebrating wins together in genuine rather than forced ways", points: 12 },
        { text: "Handling injuries and adversity with class as a group", points: 6 },
      ],
    },
    {
      text: "Name a reason converting a third-and-long feels bigger than a touchdown sometimes",
      answers: [
        { text: "It keeps a long sustained drive alive when it felt dead", points: 40 },
        { text: "The defense looked like they had stopped the offense cold", points: 26 },
        { text: "The crowd deflates immediately when a team extends a drive that way", points: 18 },
        { text: "It burns clock when the team needs to control the game", points: 10 },
        { text: "The quarterback made it look effortless under intense pressure", points: 6 },
      ],
    },
  ],

  // Day 19 — Trash talk / punters / team names / big game pressure / pass rush stunts
  [
    {
      text: "Name something a defensive player says to trash talk a quarterback before the snap",
      answers: [
        { text: "Tells him he's about to get hurt badly on this play", points: 38 },
        { text: "References a previous interception or bad game", points: 26 },
        { text: "Says his team is going to embarrass him on national TV tonight", points: 18 },
        { text: "Mentions something personal to get under his skin", points: 12 },
        { text: "Tells him his offensive line can't stop what's coming next", points: 6 },
      ],
    },
    {
      text: "Name a reason fans finally respect a punter after years of ignoring the position",
      answers: [
        { text: "He pins the opponent at the one-yard line in a crucial moment", points: 40 },
        { text: "A fake punt he runs himself for a first down changes the game", points: 26 },
        { text: "His consistent directional punting flips field position all season", points: 18 },
        { text: "A long bomb punt in a blizzard that travels 65 yards", points: 10 },
        { text: "He makes a tackle to save a 60-yard return in the Super Bowl", points: 6 },
      ],
    },
    {
      text: "Name something about an NFL team name that fans from other teams always make fun of",
      answers: [
        { text: "The name sounds scary but the team has been terrible for years", points: 38 },
        { text: "The team nickname doesn't make sense for the city it's in", points: 26 },
        { text: "The logo or uniform doesn't match the intimidating name", points: 18 },
        { text: "The name was changed recently and fans still use the old one", points: 12 },
        { text: "The mascot seems completely random and has no connection to anything", points: 6 },
      ],
    },
    {
      text: "Name something a quarterback does when he's not handling the big game moment well",
      answers: [
        { text: "Forces throws into coverage and turns it over", points: 40 },
        { text: "Happy feet in the pocket before receivers are open", points: 26 },
        { text: "Takes unnecessary sacks instead of throwing it away", points: 18 },
        { text: "Visibly frustrated and snapping at teammates on the sideline", points: 10 },
        { text: "Short-arms throws and floats balls to avoid getting hit", points: 6 },
      ],
    },
    {
      text: "Name a reason a pass rush stunt works so much better than a straight rush",
      answers: [
        { text: "The linemen cross and the blocker loses his assignment", points: 40 },
        { text: "It creates confusion between offensive linemen on who picks up who", points: 26 },
        { text: "The twist comes late and the quarterback doesn't have time to step up", points: 18 },
        { text: "Interior linemen can win against slower guards on the inside lane", points: 10 },
        { text: "The quarterback has never seen that stunt from that team before", points: 6 },
      ],
    },
  ],

  // Day 20 — Comeback player of the year / stadium food / no-call plays / safety position / team records
  [
    {
      text: "Name something that qualifies a player for comeback player of the year",
      answers: [
        { text: "Returning from a torn ACL to have the best season of his career", points: 40 },
        { text: "Coming back from a career-threatening injury everyone thought would end him", points: 26 },
        { text: "Posting dominant numbers after missing an entire previous season", points: 18 },
        { text: "Being cut by a team only to star for another one that same year", points: 10 },
        { text: "Proving doctors wrong by playing at a Pro Bowl level again", points: 6 },
      ],
    },
    {
      text: "Name something NFL fans complain about when it comes to stadium food",
      answers: [
        { text: "The prices are outrageously high for average food", points: 42 },
        { text: "The lines are so long you miss actual game action", points: 28 },
        { text: "The food is barely warm by the time you get it back to your seat", points: 14 },
        { text: "Limited options that never change year after year", points: 10 },
        { text: "Beer costs nearly as much as the ticket itself", points: 6 },
      ],
    },
    {
      text: "Name a famous no-call by referees that fans still argue about years later",
      answers: [
        { text: "Pass interference that wasn't called in a late playoff game", points: 40 },
        { text: "A helmet-to-helmet hit on a defenseless receiver that was ignored", points: 26 },
        { text: "A blatant holding that would have stopped a game-winning touchdown drive", points: 18 },
        { text: "A fumble that was wrongly ruled an incomplete pass", points: 10 },
        { text: "A face mask the officials clearly saw but chose not to flag", points: 6 },
      ],
    },
    {
      text: "Name a reason the safety position is one of the most underappreciated in football",
      answers: [
        { text: "He has to play the run and cover the pass at the same time", points: 38 },
        { text: "Everything he does happens in the background of the coverage shell", points: 26 },
        { text: "He prevents big plays that fans never see because they never happen", points: 18 },
        { text: "His mistakes are catastrophic but great plays go unnoticed", points: 12 },
        { text: "He has to master every coverage concept on the field", points: 6 },
      ],
    },
    {
      text: "Name a reason a perfect or historic team record creates massive pressure",
      answers: [
        { text: "Every game becomes a national storyline and distraction", points: 40 },
        { text: "The team is the target every single week and opponents go all out", points: 26 },
        { text: "Any loss at all feels like a catastrophic failure", points: 18 },
        { text: "The media coverage becomes overwhelming by week 12", points: 10 },
        { text: "Players have to pretend the record doesn't matter when it clearly does", points: 6 },
      ],
    },
  ],

  // Day 21 — NFL social media / trick plays / running QB / injured reserve / post-game interviews
  [
    {
      text: "Name something NFL players post on social media that always stirs up drama",
      answers: [
        { text: "Cryptic posts right after a trade rumor drops", points: 40 },
        { text: "Liking tweets that criticize the coaching staff or front office", points: 26 },
        { text: "Celebrating a win in a way that the losing team sees as disrespectful", points: 18 },
        { text: "Posting workout videos while officially listed as injured", points: 10 },
        { text: "Subtweeting a teammate or former coach without naming them", points: 6 },
      ],
    },
    {
      text: "Name a trick play that works because defenses just can't believe the offense is actually running it",
      answers: [
        { text: "The quarterback throwing a pass to the lineman on a tackle-eligible play", points: 38 },
        { text: "A wide receiver throwing a touchdown pass after a jet sweep handoff", points: 26 },
        { text: "A fake punt where the personal protector runs it up the middle", points: 18 },
        { text: "A running back passing out of a direct snap", points: 12 },
        { text: "The center catching a snap and running it himself on a direct snap play", points: 6 },
      ],
    },
    {
      text: "Name something a mobile quarterback does that traditional pocket passers simply cannot",
      answers: [
        { text: "Extends broken plays by scrambling and finding open receivers downfield", points: 40 },
        { text: "Picks up critical first downs with his legs when the play breaks down", points: 26 },
        { text: "Forces the defense to account for him as a run threat on every play", points: 18 },
        { text: "Makes defenders miss in the open field just like a running back", points: 10 },
        { text: "Changes the entire defensive game plan before the snap even happens", points: 6 },
      ],
    },
    {
      text: "Name a reason a team places a key player on injured reserve and immediately regrets it",
      answers: [
        { text: "The team goes on a losing streak the moment he's placed on IR", points: 40 },
        { text: "He heals faster than expected but can't come back until later", points: 26 },
        { text: "His backup is clearly not anywhere near his level", points: 18 },
        { text: "A playoff run ends because the team needed him in a specific game", points: 10 },
        { text: "He comes back and the team immediately starts winning again", points: 6 },
      ],
    },
    {
      text: "Name something quarterbacks say in post-game interviews after a loss that drives fans crazy",
      answers: [
        { text: "We just have to be better across the board", points: 40 },
        { text: "I have full confidence in this team and coaching staff", points: 26 },
        { text: "We just need to execute our game plan", points: 18 },
        { text: "It's a long season and we'll make the corrections", points: 10 },
        { text: "Credit to the other team, they just played better today", points: 6 },
      ],
    },
  ],

  // Day 22 — Offensive coordinators / Super Bowl ring value / fake injury / franchise tags / first play from scrimmage
  [
    {
      text: "Name a reason an offensive coordinator gets poached to become a head coach somewhere",
      answers: [
        { text: "His offense led the league in scoring for multiple years running", points: 40 },
        { text: "He developed a struggling quarterback into an MVP candidate", points: 26 },
        { text: "His creative play-calling gets national media attention every week", points: 18 },
        { text: "He's clearly outthinking defensive coordinators on a nightly basis", points: 10 },
        { text: "Young quarterbacks specifically request to play in his system", points: 6 },
      ],
    },
    {
      text: "Name a reason winning a Super Bowl ring means more to some players than a massive contract",
      answers: [
        { text: "It's the only thing that validates a career in the history books", points: 40 },
        { text: "Teammates who sacrificed alongside you earned it together", points: 24 },
        { text: "You can't put a price on being a champion forever", points: 18 },
        { text: "The legacy and respect from former players changes after winning", points: 12 },
        { text: "It's the one thing no one can ever take away from you", points: 6 },
      ],
    },
    {
      text: "Name a reason fans get furious when a player appears to fake an injury",
      answers: [
        { text: "It slows the game down at the worst possible moment deliberately", points: 40 },
        { text: "It's a tactic to stop a hurry-up offense and feels like cheating", points: 28 },
        { text: "It makes you wonder how many injuries in the past were also faked", points: 16 },
        { text: "Real injuries are painful and serious so mocking them is offensive", points: 10 },
        { text: "The player is always totally fine a few minutes later", points: 6 },
      ],
    },
    {
      text: "Name a reason the franchise tag makes players angry every single year",
      answers: [
        { text: "It prevents them from testing their value on the open market", points: 40 },
        { text: "The one-year deal means zero long-term security", points: 26 },
        { text: "Teams use it to pay market value without committing long-term", points: 18 },
        { text: "Players feel like they're being controlled rather than respected", points: 10 },
        { text: "Some players get tagged multiple years in a row and have no recourse", points: 6 },
      ],
    },
    {
      text: "Name something a team does on the very first play from scrimmage that tells you a lot about their game plan",
      answers: [
        { text: "A deep shot downfield to test the defense early", points: 38 },
        { text: "A run up the middle to establish physical dominance", points: 26 },
        { text: "A screen pass to get their playmaker into space immediately", points: 18 },
        { text: "A jet sweep to use their fastest player in a mismatch", points: 12 },
        { text: "A play-action fake to get a linebacker to commit wrong", points: 6 },
      ],
    },
  ],

  // Day 23 — Two-point conversions / mic'd up moments / receivers going over the middle / defensive backs / end zone celebrations
  [
    {
      text: "Name a reason going for two instead of kicking the extra point changes the feel of a game",
      answers: [
        { text: "The whole crowd holds its breath in a way that kicking never creates", points: 40 },
        { text: "A failed two-pointer can completely deflate the momentum of a team", points: 26 },
        { text: "It forces the other team to adjust their entire strategy immediately", points: 18 },
        { text: "It feels aggressive and bold in a game that had been conservative", points: 10 },
        { text: "The math behind it in certain scores is fascinating to argue about", points: 6 },
      ],
    },
    {
      text: "Name something that comes out of a mic'd up player that makes fans love them even more",
      answers: [
        { text: "Hyping up a teammate genuinely and enthusiastically on the sideline", points: 40 },
        { text: "Trash talking a defender in an absolutely hilarious way", points: 26 },
        { text: "A raw emotional moment after scoring a big touchdown", points: 18 },
        { text: "Coaching and teaching a young player mid-game", points: 10 },
        { text: "Laughing off an insult from an opponent with total confidence", points: 6 },
      ],
    },
    {
      text: "Name a reason a receiver going over the middle of the field takes real courage",
      answers: [
        { text: "A linebacker or safety is waiting to hit him as hard as possible", points: 40 },
        { text: "He has to catch the ball while knowing he's about to get crushed", points: 26 },
        { text: "The hit comes when he's most vulnerable and defenseless", points: 18 },
        { text: "Drops in that area are remembered forever because of the risk taken", points: 10 },
        { text: "The fear of it makes receivers hesitant and that hesitation costs them", points: 6 },
      ],
    },
    {
      text: "Name something that makes a defensive back better than almost every receiver he covers",
      answers: [
        { text: "He knows every route concept and what's coming before the receiver does", points: 40 },
        { text: "Elite straight-line speed that matches or exceeds the wideouts he faces", points: 26 },
        { text: "He can go from backpedaling to full sprint without any wasted motion", points: 18 },
        { text: "His ability to high point the ball and play it at its highest point", points: 10 },
        { text: "Experience playing against the best receivers in the world every week", points: 6 },
      ],
    },
    {
      text: "Name an end zone celebration that makes fans laugh and the other team furious",
      answers: [
        { text: "A full group choreographed dance with five or six teammates", points: 40 },
        { text: "Pretending to be a famous person or character from pop culture", points: 26 },
        { text: "Getting on the ground and doing something the referee eventually flags", points: 18 },
        { text: "Using the ball or the end zone pylon as a prop in an obvious way", points: 10 },
        { text: "Celebrating directly in front of the opposing team's bench", points: 6 },
      ],
    },
  ],

  // Day 24 — Veteran leaders / crowd thirds / last second kicks / losing streaks / body language
  [
    {
      text: "Name something a veteran leader does in the locker room that shows true leadership",
      answers: [
        { text: "Takes the blame for a loss publicly even when it wasn't his fault", points: 40 },
        { text: "Pulls a struggling young player aside and works with him privately", points: 26 },
        { text: "Keeps the energy positive after a devastating loss with no complaints", points: 18 },
        { text: "Calls out bad effort directly in front of the team with no hesitation", points: 10 },
        { text: "Remembers every teammate's name, family, and background personally", points: 6 },
      ],
    },
    {
      text: "Name something that explains why some stadiums are louder than others on third down",
      answers: [
        { text: "The stadium is built to trap and amplify sound naturally", points: 38 },
        { text: "The fanbase has a long tradition of crowd noise efforts", points: 26 },
        { text: "The team has been consistently good so the crowd is invested", points: 18 },
        { text: "The team does specific crowd work to build noise culture actively", points: 12 },
        { text: "The stadium is always sold out with an extremely passionate fanbase", points: 6 },
      ],
    },
    {
      text: "Name something that makes a last-second field goal attempt feel impossible even for a great kicker",
      answers: [
        { text: "The distance is beyond his tested reliable range", points: 38 },
        { text: "The weather conditions are brutal — cold, wind, or rain", points: 26 },
        { text: "The crowd noise makes it impossible to hear the snap count", points: 18 },
        { text: "The entire season is on the line and every person knows it", points: 12 },
        { text: "The snap or hold could be imperfect under extreme pressure", points: 6 },
      ],
    },
    {
      text: "Name something a team does during a long losing streak that makes it worse",
      answers: [
        { text: "Blaming different things each week instead of a clear diagnosis", points: 40 },
        { text: "Making coaching changes mid-season that disrupt the whole routine", points: 26 },
        { text: "Players visibly checking out and going through the motions", points: 18 },
        { text: "Panicking and changing too many things at the same time", points: 10 },
        { text: "Publicly feuding internally while the losses pile up", points: 6 },
      ],
    },
    {
      text: "Name a body language sign that a quarterback is struggling mentally during a game",
      answers: [
        { text: "Staring at the ground between every series on the sideline", points: 38 },
        { text: "Holding the ball too long even when receivers are clearly open", points: 26 },
        { text: "Snapping at teammates instead of being calm and constructive", points: 18 },
        { text: "Pulling his helmet down over his face on the sideline", points: 12 },
        { text: "Not communicating or making eye contact with the head coach", points: 6 },
      ],
    },
  ],

  // Day 25 — Draft grade debates / catch rule / pressure situations / fan memory / zone defense
  [
    {
      text: "Name a reason NFL Draft grades given right after the draft are almost always wrong",
      answers: [
        { text: "Nobody knows how players will develop over three to five years", points: 40 },
        { text: "Analysts grade based on perceived value rather than actual fit", points: 26 },
        { text: "Trades involving future picks aren't accounted for properly", points: 18 },
        { text: "Players people loved in college frequently bust for different reasons", points: 10 },
        { text: "The evaluators are guessing based on limited combine information", points: 6 },
      ],
    },
    {
      text: "Name a reason the NFL catch rule confuses fans and players every single season",
      answers: [
        { text: "The going to the ground exception makes no intuitive sense visually", points: 40 },
        { text: "What looks like a completed catch on the field gets reversed on replay", points: 28 },
        { text: "Different officials call the same exact situation differently each week", points: 18 },
        { text: "The rule has been changed multiple times and nobody tracks the current version", points: 8 },
        { text: "Commentators often disagree with each other on what the rule says", points: 6 },
      ],
    },
    {
      text: "Name something that makes a pressure situation feel different from a normal play",
      answers: [
        { text: "The entire season or game literally depends on the outcome", points: 40 },
        { text: "Every player on the field knows exactly what is at stake before the snap", points: 26 },
        { text: "The crowd either goes completely quiet or completely insane simultaneously", points: 18 },
        { text: "Mistakes that would be recovered from earlier now mean losing everything", points: 10 },
        { text: "Players have been preparing mentally for this moment since training camp", points: 6 },
      ],
    },
    {
      text: "Name a game or play that NFL fans from a specific team will never forget no matter how long they live",
      answers: [
        { text: "A Super Bowl win their team earned after years of heartbreak", points: 38 },
        { text: "A playoff loss that came down to a single heartbreaking play", points: 26 },
        { text: "A comeback that seemed genuinely impossible before it happened", points: 18 },
        { text: "The day a beloved franchise player was traded away unexpectedly", points: 12 },
        { text: "A play so bizarre and unlikely it felt like it wasn't even real", points: 6 },
      ],
    },
    {
      text: "Name a reason zone defense is harder to attack than it looks on TV",
      answers: [
        { text: "Throwing into the soft spots requires perfect timing and placement", points: 40 },
        { text: "Defenders react to the ball rather than the route so breaks are different", points: 26 },
        { text: "The quarterback has to quickly identify which zone concept it is at the line", points: 18 },
        { text: "Routes must be run precisely to the correct depth of the zone window", points: 10 },
        { text: "A patient zone can force a team into checkdowns and slow their rhythm entirely", points: 6 },
      ],
    },
  ],

  // Day 26 — Audibles / fan chants / injuries that changed history / contract holdouts / game-winning TD
  [
    {
      text: "Name a reason a quarterback audibling at the line makes football more exciting to watch",
      answers: [
        { text: "It shows he understands the defense better than they understand themselves", points: 40 },
        { text: "The crowd can sense when something big is about to happen", points: 24 },
        { text: "It creates a genuine chess match visible to everyone in the building", points: 18 },
        { text: "A good audible to the right play often goes for a long gain immediately", points: 12 },
        { text: "It confirms that the most important position in sports actually thinks", points: 6 },
      ],
    },
    {
      text: "Name a crowd chant or tradition at NFL games that became bigger than the team itself",
      answers: [
        { text: "The hometown defense chant that every stadium copies now", points: 38 },
        { text: "A specific song or sound the crowd does during warmups or kickoffs", points: 26 },
        { text: "A player's name being chanted by thousands of fans simultaneously", points: 18 },
        { text: "A team-specific phrase fans scream on every third and long play", points: 12 },
        { text: "The stadium jumping or swaying in unison to a specific beat", points: 6 },
      ],
    },
    {
      text: "Name an injury to a star player that changed the direction of an entire NFL season",
      answers: [
        { text: "A starting quarterback going down in week one of a playoff-bound team", points: 40 },
        { text: "An all-pro defender getting hurt right before the Super Bowl", points: 26 },
        { text: "A skill position player lost for the year on the first play of the game", points: 18 },
        { text: "A dominant offensive lineman whose absence destroyed the run game", points: 10 },
        { text: "A backup quarterback injury that forced a team to sign someone off the street", points: 6 },
      ],
    },
    {
      text: "Name something about a contract holdout that makes it hard to sympathize with either side",
      answers: [
        { text: "The player is already earning many millions while holding out for more", points: 40 },
        { text: "The team knew what he was worth and still low-balled him deliberately", points: 26 },
        { text: "Both sides play hardball through the media instead of just negotiating", points: 18 },
        { text: "The player's agent is clearly making it worse for his own commission reasons", points: 10 },
        { text: "The whole thing could be solved in one honest conversation but never is", points: 6 },
      ],
    },
    {
      text: "Name something about a game-winning touchdown on the last play that fans remember forever",
      answers: [
        { text: "The quarterback standing tall and delivering under ultimate pressure", points: 40 },
        { text: "The receiver making a circus catch that had no right to be completed", points: 26 },
        { text: "The crowd noise going from silence to complete chaos in one second", points: 18 },
        { text: "The opposing defense looking completely shocked it just happened", points: 10 },
        { text: "The quarterback finding his receiver with no timeouts and eight seconds left", points: 6 },
      ],
    },
  ],

  // Day 27 — Mock drafts / big hits on special teams / run stuffers / replay review / fan walks
  [
    {
      text: "Name a reason NFL mock drafts published before the draft are almost entertainment rather than information",
      answers: [
        { text: "No mock drafter has accurate insider knowledge of actual team boards", points: 40 },
        { text: "Trades that happen on the clock change everything instantly", points: 26 },
        { text: "Teams deliberately feed false information to throw evaluators off", points: 18 },
        { text: "A player's medical report or interview can tank or raise him in one day", points: 10 },
        { text: "Everyone is mostly just copying each other's consensus rankings anyway", points: 6 },
      ],
    },
    {
      text: "Name a reason a big hit on a kickoff return still gets the crowd going even without a score",
      answers: [
        { text: "It sets an immediate physical tone for the entire game right away", points: 40 },
        { text: "The returner was clearly about to score before getting demolished", points: 26 },
        { text: "Both sidelines react immediately and the energy is electric", points: 18 },
        { text: "It reminds everyone in the stadium just how physical this sport is", points: 10 },
        { text: "A great hit on special teams fires up the defense on the next series", points: 6 },
      ],
    },
    {
      text: "Name a reason a dominant run-stuffing defensive tackle doesn't get enough love",
      answers: [
        { text: "He takes up double teams so linebackers get free runs at the ball carrier", points: 40 },
        { text: "His tackles for loss never look as dramatic as a sack does on TV", points: 26 },
        { text: "He eliminates entire categories of the offense without a big stat line", points: 18 },
        { text: "Casual fans watch the ball carrier, not the interior linemen at all", points: 10 },
        { text: "He's not marketable the way edge rushers or skill players are", points: 6 },
      ],
    },
    {
      text: "Name a reason instant replay review takes the momentum out of a great play",
      answers: [
        { text: "Fans celebrate a touchdown only to wait two minutes to see if it counts", points: 42 },
        { text: "The review almost always ends inconclusively or goes against your team", points: 26 },
        { text: "The stadium goes from electric to completely deflated during the wait", points: 16 },
        { text: "Referees looking at a screen for three minutes kills all the energy", points: 10 },
        { text: "The final ruling is often still contested even after the review is complete", points: 6 },
      ],
    },
    {
      text: "Name something NFL fans do during the long walk to the stadium that shows their dedication",
      answers: [
        { text: "Wearing full gear in brutal cold or heat without complaining", points: 40 },
        { text: "Walking miles from a distant parking lot just to be there in person", points: 26 },
        { text: "Tailgating for five hours before a noon kickoff on a Sunday", points: 18 },
        { text: "Bringing homemade signs and props to get on the TV broadcast", points: 10 },
        { text: "Face painting and dressing up knowing cameras will find them", points: 6 },
      ],
    },
  ],

  // Day 28 — Red zone touchdowns vs FG / bad trades / deep pass / sideline reporter / defensive adjustments
  [
    {
      text: "Name a reason settling for a field goal in the red zone frustrates fans even when the team is winning",
      answers: [
        { text: "The offense was moving so well that not scoring a TD feels like a failure", points: 40 },
        { text: "A field goal instead of a touchdown changes the math on a comeback later", points: 26 },
        { text: "It shows the offense stalled when it absolutely cannot afford to stall", points: 18 },
        { text: "The home crowd wanted the touchdown and cheering a field goal feels empty", points: 10 },
        { text: "Four downs and seven points available reduced to three feels like a waste", points: 6 },
      ],
    },
    {
      text: "Name a reason a trade that seemed great at the time ends up looking terrible in hindsight",
      answers: [
        { text: "The player acquired underperformed while the picks traded away became stars", points: 40 },
        { text: "The player had a hidden injury that destroyed his production shortly after", points: 26 },
        { text: "The team gave away too much future value for one good season", points: 18 },
        { text: "The player was clearly on his way out the door with attitude issues first", points: 10 },
        { text: "The team's window closed before the trade even made a real difference", points: 6 },
      ],
    },
    {
      text: "Name something that makes a perfectly thrown deep pass almost impossible to defend",
      answers: [
        { text: "It's placed exactly where only the receiver can catch it", points: 40 },
        { text: "The play-action fake froze the safety long enough for the receiver to separate", points: 26 },
        { text: "The receiver's pure straight-line speed simply cannot be covered one-on-one", points: 18 },
        { text: "The quarterback had exactly enough time to let the route fully develop", points: 10 },
        { text: "The cornerback was in press and got beaten off the line immediately", points: 6 },
      ],
    },
    {
      text: "Name something a sideline reporter says that fans don't actually find useful or interesting",
      answers: [
        { text: "A player is listed as questionable but is apparently warming up just fine", points: 40 },
        { text: "The coach said we just need to execute and play our game better", points: 26 },
        { text: "This team has momentum heading into the second half", points: 18 },
        { text: "The crowd is really into it tonight and the atmosphere is electric", points: 10 },
        { text: "The quarterback seems confident and focused heading into this drive", points: 6 },
      ],
    },
    {
      text: "Name something a defense does at halftime to stop an offense that destroyed them in the first half",
      answers: [
        { text: "Changes the coverage shell to two-deep instead of man coverage", points: 38 },
        { text: "Adds a spy on the quarterback to stop the scrambling", points: 26 },
        { text: "Moves the best cornerback to shadow the quarterback's top target", points: 18 },
        { text: "Drops more defenders into coverage to take away the quick passing game", points: 12 },
        { text: "Stops trying to blitz and plays a steady four-man rush", points: 6 },
      ],
    },
  ],

  // Day 29 — Linemen touchdowns / fan walks of shame / stadium bans / running back committees / worst losses
  [
    {
      text: "Name a reason fans go absolutely wild when an offensive lineman scores a touchdown",
      answers: [
        { text: "It almost never happens so it feels completely surreal", points: 40 },
        { text: "He's the least likely person on the field to ever touch the ball", points: 28 },
        { text: "His celebration is always completely genuine and hilarious", points: 16 },
        { text: "Teammates react like nothing has ever made them this happy before", points: 10 },
        { text: "The play was obviously a trick play that somehow worked perfectly", points: 6 },
      ],
    },
    {
      text: "Name something that happens during a fan's long drive home after a brutal loss",
      answers: [
        { text: "Replaying every bad call and mistake in exhausting detail in your head", points: 40 },
        { text: "Turning off sports radio because every host is talking about the loss", points: 26 },
        { text: "Texting friends to vent before you even get to the highway", points: 18 },
        { text: "Vowing to never watch another game even though you'll be back next week", points: 10 },
        { text: "Calling a family member who doesn't care about football to vent anyway", points: 6 },
      ],
    },
    {
      text: "Name a reason a fan getting banned from a stadium generates strong opinions from everyone",
      answers: [
        { text: "Some fans think the ban was completely justified and should have happened sooner", points: 40 },
        { text: "Others think the stadium overreacted to something relatively minor", points: 26 },
        { text: "Questions about whether wealthy fans get treated differently than regular fans", points: 18 },
        { text: "Arguments about what behavior is actually acceptable at a live event", points: 10 },
        { text: "The team's response is seen as corporate overreach by some longtime fans", points: 6 },
      ],
    },
    {
      text: "Name a reason running back by committee is frustrating for fantasy football players",
      answers: [
        { text: "You never know which back is going to get the majority of the carries", points: 42 },
        { text: "One back gets the goal-line work and the other gets the open-field yards", points: 26 },
        { text: "The rotation changes week to week with no consistency or explanation", points: 16 },
        { text: "Injuries completely scramble the intended plan anyway", points: 10 },
        { text: "You draft the best back but the team is already committed to the committee", points: 6 },
      ],
    },
    {
      text: "Name a reason some NFL losses feel worse than others even when the score is similar",
      answers: [
        { text: "You had the lead with two minutes left and completely collapsed", points: 40 },
        { text: "The loss eliminated the team from the playoffs right at that moment", points: 26 },
        { text: "You lost to your most hated rival and have to hear about it all week", points: 18 },
        { text: "The team played their worst game of the year at the worst possible time", points: 10 },
        { text: "A referee decision that was clearly wrong decided the whole thing", points: 6 },
      ],
    },
  ],

  // Day 30 — Season openers / final drives / championships / football and family / legends
  [
    {
      text: "Name a reason the first game of the NFL season feels different from any other game",
      answers: [
        { text: "Every team still has a perfect record and full hope for the year", points: 40 },
        { text: "Months without football makes even a mediocre game feel like a gift", points: 26 },
        { text: "New players and new storylines make everything feel genuinely fresh", points: 18 },
        { text: "The opening night ceremony and pageantry is always memorable", points: 10 },
        { text: "Fantasy football lineups being set for the first time in months", points: 6 },
      ],
    },
    {
      text: "Name something that makes a final drive to win the game feel like the purest version of football",
      answers: [
        { text: "One team against the clock and every play decides everything", points: 40 },
        { text: "The quarterback operating with total calm under maximum pressure", points: 26 },
        { text: "Every player executing their role perfectly because they have to", points: 18 },
        { text: "The crowd divided between belief and dread on every single snap", points: 10 },
        { text: "No timeouts and the clock running as the team moves down the field", points: 6 },
      ],
    },
    {
      text: "Name something that makes winning a championship mean even more years later",
      answers: [
        { text: "You shared it with family and friends who are no longer around", points: 40 },
        { text: "The team overcame something genuinely difficult to get there", points: 26 },
        { text: "A beloved player who deserved it finally got his ring", points: 18 },
        { text: "Nobody thought the team could actually win it before the run started", points: 10 },
        { text: "The whole city came together in a way that never happens otherwise", points: 6 },
      ],
    },
    {
      text: "Name a reason football is a sport that connects generations of families unlike any other",
      answers: [
        { text: "Sunday games become a weekly family gathering tradition for decades", points: 40 },
        { text: "Fathers and sons bond over the same team through childhood and adulthood", points: 26 },
        { text: "The rituals like tailgates and game day food get passed down over years", points: 18 },
        { text: "A kid wearing a jersey of a player their grandparent loved growing up", points: 10 },
        { text: "Rooting for the same team connects you to people you have never even met", points: 6 },
      ],
    },
    {
      text: "Name something about an all-time NFL legend that makes younger fans still talk about him",
      answers: [
        { text: "He did something statistically that may never be matched again", points: 40 },
        { text: "Highlight plays that look as dominant today as they did when they happened", points: 26 },
        { text: "He dominated an entire era while making it look completely effortless", points: 18 },
        { text: "Players today still model their game directly after how he played", points: 10 },
        { text: "The stories about his preparation and dedication became part of football culture", points: 6 },
      ],
    },
  ],
]

// ── MLB Questions (30 days) ──
const MLB_DAYS: Question[][] = [
  // Day 1
  [
    {
      text: "Name something fans do during a pitching change",
      answers: [
        { text: "Check their phones", points: 40 },
        { text: "Get food or drinks", points: 26 },
        { text: "Go to the bathroom", points: 18 },
        { text: "Boo the relieving pitcher", points: 10 },
        { text: "Chant for the starting pitcher", points: 6 },
      ],
    },
    {
      text: "Name a reason a batter steps out of the box",
      answers: [
        { text: "To reset after a bad pitch", points: 38 },
        { text: "To mess with the pitcher's rhythm", points: 26 },
        { text: "Adjusting batting gloves", points: 20 },
        { text: "Something in his eye", points: 10 },
        { text: "Crowd noise distraction", points: 6 },
      ],
    },
    {
      text: "Name something that always slows down a baseball game",
      answers: [
        { text: "Pitching change", points: 38 },
        { text: "Mound visit", points: 26 },
        { text: "Batter stepping out of the box", points: 18 },
        { text: "Manager arguing with the umpire", points: 12 },
        { text: "Video review challenge", points: 6 },
      ],
    },
    {
      text: "Name a superstition baseball players follow",
      answers: [
        { text: "Don't step on the foul line", points: 38 },
        { text: "Same pre-game ritual every day", points: 26 },
        { text: "Don't mention a no-hitter in progress", points: 20 },
        { text: "Wear the same underwear on a winning streak", points: 10 },
        { text: "Don't change seats when the team is scoring", points: 6 },
      ],
    },
    {
      text: "Name something a manager does when arguing with an umpire",
      answers: [
        { text: "Gets in their face", points: 40 },
        { text: "Kicks dirt on the plate", points: 26 },
        { text: "Gets ejected on purpose", points: 18 },
        { text: "Throws a bat or helmet", points: 10 },
        { text: "Waves arms dramatically", points: 6 },
      ],
    },
  ],
  // Day 2
  [
    {
      text: "Name something fans bring to a baseball game that they wouldn't bring anywhere else",
      answers: [
        { text: "A baseball glove", points: 40 },
        { text: "A foam finger", points: 24 },
        { text: "A handmade sign", points: 18 },
        { text: "A rally towel", points: 12 },
        { text: "A transistor radio", points: 6 },
      ],
    },
    {
      text: "Name a reason a pitcher gets pulled before the fifth inning",
      answers: [
        { text: "Too many runs allowed", points: 38 },
        { text: "Command completely off", points: 28 },
        { text: "Injury or discomfort", points: 18 },
        { text: "Too many walks", points: 10 },
        { text: "High pitch count early", points: 6 },
      ],
    },
    {
      text: "We asked 100 sports fans: name a team famous for its passionate home crowd",
      answers: [
        { text: "Boston Red Sox", points: 36 },
        { text: "Chicago Cubs", points: 26 },
        { text: "New York Yankees", points: 20 },
        { text: "San Francisco Giants", points: 10 },
        { text: "St. Louis Cardinals", points: 8 },
      ],
    },
    {
      text: "Name something old-school baseball guys hate about the modern game",
      answers: [
        { text: "Too much analytics and shifting", points: 38 },
        { text: "Bat flips after home runs", points: 26 },
        { text: "The pitch clock", points: 18 },
        { text: "Launch angle obsession", points: 10 },
        { text: "Openers instead of traditional starters", points: 8 },
      ],
    },
    {
      text: "Name something a catcher does besides catching pitches",
      answers: [
        { text: "Calls the game and sets signs", points: 40 },
        { text: "Frames borderline pitches", points: 24 },
        { text: "Blocks balls in the dirt", points: 18 },
        { text: "Chats with batters to distract them", points: 12 },
        { text: "Pops up to throw out base stealers", points: 6 },
      ],
    },
  ],
  // Day 3
  [
    {
      text: "Name a walk-off moment that would make a stadium go crazy",
      answers: [
        { text: "Walk-off home run", points: 42 },
        { text: "Walk-off grand slam", points: 28 },
        { text: "Walk-off hit in the World Series", points: 16 },
        { text: "Walk-off balk or wild pitch", points: 8 },
        { text: "Walk-off hit by pitch", points: 6 },
      ],
    },
    {
      text: "Name something announcers say that baseball fans love to mimic",
      answers: [
        { text: "\"It is gone!\"", points: 38, aliases: ["It is gone", "It's gone"] },
        { text: "\"Touch 'em all!\"", points: 26, aliases: ["Touch em all", "Touch them all"] },
        { text: "\"Back, back, back...\"", points: 20, aliases: ["Back back back"] },
        { text: "\"Holy cow!\"", points: 10 },
        { text: "\"Get up, get up, get outta here!\"", points: 6, aliases: ["Get up get outta here"] },
      ],
    },
    {
      text: "Name a reason fans start doing the wave at a baseball game",
      answers: [
        { text: "Lopsided score and nothing better to do", points: 40 },
        { text: "One fan just starts it and it spreads", points: 26 },
        { text: "Long pitching change", points: 18 },
        { text: "Team is losing and fans want distraction", points: 10 },
        { text: "Old tradition in that stadium", points: 6 },
      ],
    },
    {
      text: "Name something that happens when a pitcher is throwing a no-hitter",
      answers: [
        { text: "Everyone goes silent in the dugout about it", points: 38 },
        { text: "Fans get louder with each out", points: 26 },
        { text: "Announcers tiptoe around saying it", points: 20 },
        { text: "Opposing fans start rooting for a hit", points: 10 },
        { text: "Manager leaves him in no matter the pitch count", points: 6 },
      ],
    },
    {
      text: "Name something baseball fans argue about more than any other sport's fans",
      answers: [
        { text: "Who the GOAT is", points: 36 },
        { text: "Stats vs. the eye test", points: 26 },
        { text: "Whether the DH belongs in both leagues", points: 20 },
        { text: "Hall of Fame worthiness", points: 12 },
        { text: "Steroids era stats", points: 6 },
      ],
    },
  ],
  // Day 4
  [
    {
      text: "Name something a batter does before every single pitch",
      answers: [
        { text: "Adjusts batting gloves", points: 40 },
        { text: "Taps the plate", points: 26 },
        { text: "Stares at the pitcher", points: 18 },
        { text: "Takes a practice swing", points: 10 },
        { text: "Bounces in the box to stay loose", points: 6 },
      ],
    },
    {
      text: "Name a stadium food that is basically a ballpark staple",
      answers: [
        { text: "Hot dog", points: 42 },
        { text: "Nachos", points: 26 },
        { text: "Peanuts", points: 18 },
        { text: "Cracker Jack", points: 10 },
        { text: "Soft pretzel", points: 4 },
      ],
    },
    {
      text: "Name a reason a manager calls a mound visit",
      answers: [
        { text: "To slow down the opposing team's momentum", points: 36 },
        { text: "Pitcher is clearly struggling with command", points: 28 },
        { text: "To discuss strategy with bases loaded", points: 18 },
        { text: "Catcher and pitcher having miscommunication", points: 12 },
        { text: "To give the bullpen more warmup time", points: 6 },
      ],
    },
    {
      text: "Name something a fan catches at a baseball game",
      answers: [
        { text: "A home run ball", points: 44 },
        { text: "A foul ball", points: 32 },
        { text: "A batting practice ball", points: 14 },
        { text: "A t-shirt from the cannon", points: 6 },
        { text: "A player's thrown ball between innings", points: 4 },
      ],
    },
    {
      text: "Name something that makes the Yankees-Red Sox rivalry still feel electric",
      answers: [
        { text: "Decades of playoff showdowns", points: 38 },
        { text: "The Babe Ruth trade history", points: 26 },
        { text: "Both fanbases genuinely hate each other", points: 20 },
        { text: "High payrolls and star players always involved", points: 10 },
        { text: "Media coverage treats every game like a big deal", points: 6 },
      ],
    },
  ],
  // Day 5
  [
    {
      text: "Name something new-school baseball analytics people obsess over",
      answers: [
        { text: "Exit velocity", points: 38 },
        { text: "Spin rate on pitches", points: 28 },
        { text: "Launch angle", points: 18 },
        { text: "WAR (Wins Above Replacement)", points: 10 },
        { text: "Defensive shifting data", points: 6 },
      ],
    },
    {
      text: "Name something that signals a team is in a serious slump",
      answers: [
        { text: "Ten-game losing streak", points: 38 },
        { text: "Manager gets fired", points: 26 },
        { text: "Fans stop showing up", points: 18 },
        { text: "Veterans getting benched for prospects", points: 12 },
        { text: "Clubhouse drama leaks to the press", points: 6 },
      ],
    },
    {
      text: "We asked 100 sports fans: name the most exciting play in baseball",
      answers: [
        { text: "Walk-off home run", points: 40 },
        { text: "Inside-the-park home run", points: 24 },
        { text: "Triple play", points: 18 },
        { text: "Steal of home", points: 12 },
        { text: "Grand slam with two outs", points: 6 },
      ],
    },
    {
      text: "Name something a pitcher does between innings to stay loose",
      answers: [
        { text: "Grabs a jacket and sits in the dugout", points: 38 },
        { text: "Runs in the outfield", points: 26 },
        { text: "Throws with a catcher in the bullpen", points: 20 },
        { text: "Studies hitters on a tablet", points: 10 },
        { text: "Gets a massage or treatment", points: 6 },
      ],
    },
    {
      text: "Name something fans do when their team hits a home run",
      answers: [
        { text: "Jump up and cheer", points: 42 },
        { text: "High-five strangers", points: 28 },
        { text: "Spill their beer", points: 16 },
        { text: "Do a lap around other fans", points: 8 },
        { text: "Chant the player's name", points: 6 },
      ],
    },
  ],
  // Day 6
  [
    {
      text: "Name a chant you hear at almost every MLB stadium",
      answers: [
        { text: "\"Let's go [team name]!\"", points: 42, aliases: ["Lets go team", "Let's go"] },
        { text: "\"MVP! MVP!\"", points: 26 },
        { text: "\"Hey, hey, goodbye\" (Na Na Na Na)", points: 18, aliases: ["Nananana hey hey goodbye"] },
        { text: "\"Charge!\" (after horn)", points: 8 },
        { text: "Player-specific nickname chant", points: 6 },
      ],
    },
    {
      text: "Name something that gets a pitcher booed when he enters",
      answers: [
        { text: "Being the visiting team's closer", points: 36 },
        { text: "He gave up the lead last time", points: 28 },
        { text: "He's a known beaner/headhunter", points: 18 },
        { text: "Blew a save earlier in the series", points: 12 },
        { text: "He left in free agency and came back", points: 6 },
      ],
    },
    {
      text: "Name a reason baseball games go past four hours",
      answers: [
        { text: "Lots of pitching changes", points: 40 },
        { text: "Extra innings", points: 28 },
        { text: "Batters constantly stepping out", points: 16 },
        { text: "Multiple video reviews", points: 10 },
        { text: "Commercial breaks between every half-inning", points: 6 },
      ],
    },
    {
      text: "Name something teams do at the trade deadline that fans hate",
      answers: [
        { text: "Trade away the fan favorite", points: 42 },
        { text: "Do nothing when the team needs help", points: 26 },
        { text: "Sell off veterans for unknown prospects", points: 18 },
        { text: "Trade a prospect that later becomes a star", points: 8 },
        { text: "Wait until after the deadline to make a move", points: 6 },
      ],
    },
    {
      text: "Name something a home run hitter does when he rounds the bases",
      answers: [
        { text: "Bat flip", points: 38 },
        { text: "Takes his time soaking it in", points: 26 },
        { text: "Points to the sky", points: 20 },
        { text: "Stares at the dugout", points: 10 },
        { text: "Does a little shimmy", points: 6 },
      ],
    },
  ],
  // Day 7
  [
    {
      text: "Name something fans do when a pitcher is struggling but the manager won't pull him",
      answers: [
        { text: "Boo loudly", points: 40 },
        { text: "Start yelling at the manager", points: 26 },
        { text: "Bury their face in their hands", points: 18 },
        { text: "Head to the concession stand in frustration", points: 10 },
        { text: "Start trash-talking the pitcher to nearby fans", points: 6 },
      ],
    },
    {
      text: "Name a position old-school fans think modern teams undervalue",
      answers: [
        { text: "The complete-game starter", points: 36 },
        { text: "The pure contact hitter", points: 28 },
        { text: "The speedy leadoff guy", points: 18 },
        { text: "The true closer who pitches two innings", points: 12 },
        { text: "The defensive specialist", points: 6 },
      ],
    },
    {
      text: "Name something fans yell at the umpire",
      answers: [
        { text: "\"Are you blind?!\"", points: 38 },
        { text: "\"That was a strike!\" or \"That was a ball!\"", points: 30, aliases: ["That was a strike", "That was a ball"] },
        { text: "\"Get some glasses!\"", points: 18 },
        { text: "\"Throw him out!\"", points: 8 },
        { text: "The umpire's last name mockingly", points: 6 },
      ],
    },
    {
      text: "Name something a player does after hitting a 500th career home run",
      answers: [
        { text: "Gets a standing ovation from the crowd", points: 40 },
        { text: "Gets mobbed by teammates at home plate", points: 28 },
        { text: "Throws his hands up in celebration", points: 18 },
        { text: "Points to family in the stands", points: 8 },
        { text: "Takes a curtain call", points: 6 },
      ],
    },
    {
      text: "Name something that happens in baseball that feels like it takes forever",
      answers: [
        { text: "A full count at-bat with lots of fouled-off pitches", points: 38 },
        { text: "Instant replay review", points: 28 },
        { text: "Warming up a relief pitcher", points: 18 },
        { text: "Manager arguing a call", points: 10 },
        { text: "Infield throwing the ball around after an out", points: 6 },
      ],
    },
  ],
  // Day 8
  [
    {
      text: "Name something baseball players are surprisingly superstitious about in the dugout",
      answers: [
        { text: "Don't touch certain parts of the bench during a rally", points: 38 },
        { text: "Keeping the same seat the whole game", points: 28 },
        { text: "Eating the same food before games on a winning streak", points: 18 },
        { text: "Never mentioning the no-hitter", points: 10 },
        { text: "Same music in headphones pre-game", points: 6 },
      ],
    },
    {
      text: "Name a reason a batter argues with the umpire after a called third strike",
      answers: [
        { text: "Thought the pitch was outside", points: 40 },
        { text: "Thought the pitch was low", points: 28 },
        { text: "Completely fooled and embarrassed", points: 16 },
        { text: "Trying to send a message for future calls", points: 10 },
        { text: "Frustration from a long slump", points: 6 },
      ],
    },
    {
      text: "We asked 100 sports fans: name something that makes baseball unique compared to other sports",
      answers: [
        { text: "No clock — game ends when it ends", points: 40 },
        { text: "Defense controls the ball", points: 26 },
        { text: "162-game season", points: 18 },
        { text: "Every ballpark is different", points: 10 },
        { text: "The pace — there's time to think", points: 6 },
      ],
    },
    {
      text: "Name something a fan does to try to jinx the opposing team's pitcher during a no-hitter",
      answers: [
        { text: "Shouts \"hit! hit! hit!\" every pitch", points: 38 },
        { text: "Keeps yelling he's about to give one up", points: 26 },
        { text: "Cheers extra loud on every borderline pitch", points: 18 },
        { text: "Celebrates any foul tip like it almost broke it up", points: 12 },
        { text: "Heckles the pitcher to get in his head", points: 6 },
      ],
    },
    {
      text: "Name something that feels different about baseball in October versus July",
      answers: [
        { text: "Every pitch matters more", points: 38 },
        { text: "The atmosphere in the stadium is electric", points: 28 },
        { text: "Even casual fans are watching", points: 18 },
        { text: "Managers get way more conservative", points: 10 },
        { text: "Bullpen usage completely changes", points: 6 },
      ],
    },
  ],
  // Day 9
  [
    {
      text: "Name a baseball rivalry that still gets fans fired up today",
      answers: [
        { text: "Yankees vs. Red Sox", points: 42 },
        { text: "Dodgers vs. Giants", points: 28 },
        { text: "Cubs vs. Cardinals", points: 16 },
        { text: "Mets vs. Yankees", points: 8 },
        { text: "Athletics vs. Giants", points: 6 },
      ],
    },
    {
      text: "Name something pitchers do to mess with a baserunner at first",
      answers: [
        { text: "Throw over repeatedly to keep him close", points: 40 },
        { text: "Give him a long look to freeze him", points: 26 },
        { text: "Vary their timing from the stretch", points: 18 },
        { text: "Step off the rubber to reset", points: 10 },
        { text: "Talk or signal to the first baseman", points: 6 },
      ],
    },
    {
      text: "Name something fans do during the seventh-inning stretch",
      answers: [
        { text: "Sing 'Take Me Out to the Ball Game'", points: 44 },
        { text: "Stand up and stretch", points: 28 },
        { text: "Head to the bathroom", points: 16 },
        { text: "Buy more beer", points: 8 },
        { text: "Take photos of the stadium", points: 4 },
      ],
    },
    {
      text: "Name something baseball fans post on social media during a game",
      answers: [
        { text: "A home run video", points: 40 },
        { text: "A photo of the field and view", points: 26 },
        { text: "A complaint about the umpire", points: 18 },
        { text: "A hot take about the lineup", points: 10 },
        { text: "A photo of their ballpark food", points: 6 },
      ],
    },
    {
      text: "Name a reason a closer blows a save that sends fans into a rage",
      answers: [
        { text: "Walks the bases loaded and gives up a grand slam", points: 38 },
        { text: "Leaves a fastball over the plate and it gets crushed", points: 26 },
        { text: "Wild pitch scores the tying run", points: 18 },
        { text: "Error by the infield extends the inning", points: 12 },
        { text: "Gives up four singles in a row", points: 6 },
      ],
    },
  ],
  // Day 10
  [
    {
      text: "Name something fans do when their team's ace gets knocked out early",
      answers: [
        { text: "Groan loudly and talk about the bullpen situation", points: 38 },
        { text: "Leave early", points: 26 },
        { text: "Start blaming the manager for not warming someone up sooner", points: 20 },
        { text: "Loudly question why he's still in the rotation", points: 10 },
        { text: "Keep the faith and chant anyway", points: 6 },
      ],
    },
    {
      text: "Name a pitcher's ritual on the mound between batters",
      answers: [
        { text: "Rubs the baseball to find grip", points: 38 },
        { text: "Walks behind the mound and resets mentally", points: 28 },
        { text: "Spits on the dirt or glove", points: 18 },
        { text: "Adjusts his hat", points: 10 },
        { text: "Breathes deeply and stares straight ahead", points: 6 },
      ],
    },
    {
      text: "We asked 100 sports fans: name something that makes a ballpark feel historic",
      answers: [
        { text: "The smell of the grass and dirt", points: 38 },
        { text: "Old-school manual scoreboard", points: 26 },
        { text: "Unique quirky dimensions", points: 18 },
        { text: "A famous wall or feature like the Green Monster", points: 12 },
        { text: "Names and years of championships on the facade", points: 6 },
      ],
    },
    {
      text: "Name something that happens when a batter charges the mound",
      answers: [
        { text: "Both benches and bullpens empty", points: 42 },
        { text: "Multiple ejections", points: 28 },
        { text: "Long delay and league investigation after", points: 16 },
        { text: "Pitcher braces or tries to run", points: 8 },
        { text: "Suspensions handed out", points: 6 },
      ],
    },
    {
      text: "Name a reason fans think the Hall of Fame voting is broken",
      answers: [
        { text: "Steroid era players unfairly kept out", points: 40 },
        { text: "Writers holding personal grudges", points: 26 },
        { text: "Stats-based players ignored for intangibles", points: 18 },
        { text: "Guys wait too many years before getting in", points: 10 },
        { text: "Some guys in the Hall clearly don't deserve it", points: 6 },
      ],
    },
  ],
  // Day 11
  [
    {
      text: "Name something that makes a walk-off feel more dramatic",
      answers: [
        { text: "Two outs and two strikes", points: 42 },
        { text: "World Series or playoff setting", points: 26 },
        { text: "Being down multiple runs coming into the inning", points: 18 },
        { text: "The worst hitter in the lineup delivers it", points: 8 },
        { text: "Extra innings after midnight", points: 6 },
      ],
    },
    {
      text: "Name something baseball players say brings bad luck to a team",
      answers: [
        { text: "Mentioning a no-hitter in progress", points: 40 },
        { text: "Saying the team is on a hot streak", points: 26 },
        { text: "Using the word 'shutout' before the game ends", points: 18 },
        { text: "Changing anything during a winning streak", points: 10 },
        { text: "A new player wearing a star's retired number", points: 6 },
      ],
    },
    {
      text: "Name something fans always do at Wrigley Field that feels unique to baseball",
      answers: [
        { text: "Throw back opposing home run balls onto the field", points: 42 },
        { text: "Sing 'Go Cubs Go' after a win", points: 28 },
        { text: "Sit in the bleachers no matter the weather", points: 16 },
        { text: "Get tickets from a rooftop across the street", points: 8 },
        { text: "Stick around for the scoreboard flag signal", points: 6 },
      ],
    },
    {
      text: "Name something a batter does to try to time a fastball pitcher",
      answers: [
        { text: "Gets to the plate early to watch warm-ups", points: 36 },
        { text: "Studies video of the pitcher's mechanics", points: 28 },
        { text: "Looks for his release point in his warm-up pitches", points: 18 },
        { text: "Sits on fastball and adjusts to off-speed", points: 12 },
        { text: "Waits for a two-strike count to shorten his swing", points: 6 },
      ],
    },
    {
      text: "Name something a reliever does before entering a high-leverage situation",
      answers: [
        { text: "Takes a deep breath and resets", points: 36 },
        { text: "Sprints in from the bullpen to an entrance song", points: 28 },
        { text: "Pounds his glove and gets hyped", points: 18 },
        { text: "Stares in at the catcher for a long time", points: 12 },
        { text: "Throws a practice pitch into the dirt to check grip", points: 6 },
      ],
    },
  ],
  // Day 12
  [
    {
      text: "Name a thing fans do when a batter takes a really long time between pitches",
      answers: [
        { text: "Yell at him to get back in the box", points: 38 },
        { text: "Sigh loudly and check the time", points: 26 },
        { text: "Clap sarcastically", points: 18 },
        { text: "Start talking about how the old pitch clock is working", points: 12 },
        { text: "Cheer sarcastically every time he finally steps in", points: 6 },
      ],
    },
    {
      text: "Name a baseball stat that casual fans pretend to understand",
      answers: [
        { text: "WAR (Wins Above Replacement)", points: 40 },
        { text: "OPS+", points: 26 },
        { text: "FIP (Fielding Independent Pitching)", points: 18 },
        { text: "BABIP", points: 10 },
        { text: "wRC+", points: 6 },
      ],
    },
    {
      text: "Name something that makes Fenway Park feel different from other ballparks",
      answers: [
        { text: "The Green Monster in left field", points: 44 },
        { text: "The smallest and most intimate stadium feel", points: 24 },
        { text: "The Pesky Pole in right", points: 16 },
        { text: "The Monster Seats on top of the wall", points: 10 },
        { text: "The oldest park in MLB still in use", points: 6 },
      ],
    },
    {
      text: "Name something players do in the dugout during a long inning",
      answers: [
        { text: "Sunflower seeds", points: 42 },
        { text: "Chewing gum or tobacco", points: 26 },
        { text: "Cheer on teammates loudly", points: 16 },
        { text: "Watch video on a tablet", points: 10 },
        { text: "Goof around or tell jokes", points: 6 },
      ],
    },
    {
      text: "Name a reason fans argue that a player deserves the MVP over another",
      answers: [
        { text: "His team made the playoffs and the other's didn't", points: 38 },
        { text: "Better traditional stats even if WAR is lower", points: 28 },
        { text: "More valuable in the clutch", points: 18 },
        { text: "Carried a weaker lineup longer", points: 10 },
        { text: "Defensive impact isn't reflected in the other guy's numbers", points: 6 },
      ],
    },
  ],
  // Day 13
  [
    {
      text: "Name something that happens when a team goes on a 10-game winning streak",
      answers: [
        { text: "Fans start buying tickets again", points: 38 },
        { text: "Players stop changing anything — routines locked in", points: 26 },
        { text: "Media starts talking about a championship run", points: 20 },
        { text: "Everyone credits the clubhouse chemistry", points: 10 },
        { text: "The manager becomes untouchable", points: 6 },
      ],
    },
    {
      text: "Name something baseball fans do in the off-season to stay connected",
      answers: [
        { text: "Follow trade rumors obsessively", points: 40 },
        { text: "Watch highlights and classic games", points: 26 },
        { text: "Play fantasy baseball drafts", points: 18 },
        { text: "Argue about Hall of Fame ballots", points: 10 },
        { text: "Read beat writers' off-season columns", points: 6 },
      ],
    },
    {
      text: "Name a pitch that batters say is the hardest to hit",
      answers: [
        { text: "A knee-buckling curveball", points: 36 },
        { text: "A mid-90s fastball up in the zone", points: 28 },
        { text: "A late-breaking slider", points: 20 },
        { text: "A changeup that looks like a fastball coming out", points: 10 },
        { text: "A knuckleball on a windy day", points: 6 },
      ],
    },
    {
      text: "Name something fans do when a player they loved leaves for a rival",
      answers: [
        { text: "Boo him every at-bat when he comes back", points: 40 },
        { text: "Burn his jersey", points: 26 },
        { text: "Angrily unfollow him on social media", points: 18 },
        { text: "Secretly still root for him to do well", points: 10 },
        { text: "Buy the rival jersey as a joke to vent", points: 6 },
      ],
    },
    {
      text: "Name a reason fans think analytics have gone too far in baseball",
      answers: [
        { text: "Shifted infield taking away hits that used to be doubles", points: 38 },
        { text: "Openers ruining starting pitching tradition", points: 26 },
        { text: "Platoon matchups making lineups unrecognizable daily", points: 18 },
        { text: "Strike zones dictated by computers, not eyes", points: 12 },
        { text: "Fun stolen base game disappearing", points: 6 },
      ],
    },
  ],
  // Day 14
  [
    {
      text: "Name something a first baseman does besides catch throws",
      answers: [
        { text: "Hold runners on base", points: 38 },
        { text: "Field ground balls hit to his side", points: 28 },
        { text: "Help turn the 3-6-3 double play", points: 18 },
        { text: "Back up throws in the infield", points: 10 },
        { text: "Chat with every batter who reaches first", points: 6 },
      ],
    },
    {
      text: "Name a moment that makes an entire stadium go dead silent",
      answers: [
        { text: "A player going down with an injury", points: 40 },
        { text: "A batter getting hit in the head by a pitch", points: 28 },
        { text: "The opposing team's walk-off home run", points: 18 },
        { text: "An umpire's terrible call at a critical moment", points: 8 },
        { text: "A player's long foul ball almost catching a fan", points: 6 },
      ],
    },
    {
      text: "We asked 100 sports fans: name something that separates baseball from other team sports",
      answers: [
        { text: "There's no clock — defense can always come back", points: 40 },
        { text: "The pitcher controls the game's tempo", points: 24 },
        { text: "Season is 162 games — endurance matters", points: 18 },
        { text: "Every park has different dimensions", points: 12 },
        { text: "Statistics go back over 100 years for comparison", points: 6 },
      ],
    },
    {
      text: "Name something a manager does before the game that fans don't see",
      answers: [
        { text: "Sets lineup based on advanced scouting reports", points: 38 },
        { text: "Meets with pitchers to discuss the opposing lineup", points: 28 },
        { text: "Walks the field to check conditions", points: 16 },
        { text: "Reviews overnight notes from the analytics team", points: 12 },
        { text: "Talks to struggling players privately", points: 6 },
      ],
    },
    {
      text: "Name something that usually happens right before a bench-clearing brawl",
      answers: [
        { text: "A batter gets hit by a pitch after a home run", points: 40 },
        { text: "A pitcher throws at someone clearly on purpose", points: 26 },
        { text: "A hard slide into second breaks up a double play", points: 18 },
        { text: "Someone yells something from the dugout", points: 10 },
        { text: "A stare-down after a strikeout celebration", points: 6 },
      ],
    },
  ],
  // Day 15
  [
    {
      text: "Name something a fan does to prepare for Opening Day",
      answers: [
        { text: "Buys a new jersey or cap", points: 40 },
        { text: "Convinces friends to get tickets", points: 26 },
        { text: "Watches last year's highlights", points: 18 },
        { text: "Makes predictions and bets with friends", points: 10 },
        { text: "Calls it a holiday and takes the day off work", points: 6 },
      ],
    },
    {
      text: "Name a reason a closer has a bad outing despite great stuff",
      answers: [
        { text: "Catcher tipped a pitch without realizing", points: 36 },
        { text: "Command was off by just enough to hurt him", points: 28 },
        { text: "Too amped up — trying too hard", points: 18 },
        { text: "Opponent had scouted him heavily that week", points: 12 },
        { text: "Didn't warm up enough in the bullpen", points: 6 },
      ],
    },
    {
      text: "Name something about the World Series that feels different from the regular season",
      answers: [
        { text: "Every pitch and at-bat is magnified", points: 40 },
        { text: "People who don't watch baseball are watching", points: 26 },
        { text: "Managers get weird with bullpen usage", points: 18 },
        { text: "Players' emotions are right at the surface", points: 10 },
        { text: "The stadium noise level is on another level", points: 6 },
      ],
    },
    {
      text: "Name something a leadoff hitter does that sets the table for the lineup",
      answers: [
        { text: "Works a walk by seeing lots of pitches", points: 38 },
        { text: "Slaps a single and steals second immediately", points: 26 },
        { text: "Makes the pitcher throw 10+ pitches to start the game", points: 20 },
        { text: "Bunts for a hit to beat the shift", points: 10 },
        { text: "Takes the first pitch every time to show patience", points: 6 },
      ],
    },
    {
      text: "Name a player type that old-school fans miss in today's game",
      answers: [
        { text: "The 300-inning workhorse starter", points: 38 },
        { text: "The pure contact bat-control hitter", points: 26 },
        { text: "The stolen base threat who ran every game", points: 20 },
        { text: "The backup catcher who played tough D and knew every pitcher", points: 10 },
        { text: "The utility guy who could play six positions equally well", points: 6 },
      ],
    },
  ],
  // Day 16
  [
    {
      text: "Name something fans complain about at modern MLB stadiums",
      answers: [
        { text: "Ticket prices are too high", points: 40 },
        { text: "Too many strikeouts and not enough action", points: 26 },
        { text: "Games are still too long even with the clock", points: 18 },
        { text: "Corporate crowds that don't create atmosphere", points: 10 },
        { text: "Apps and tech make buying a pretzel a ten-step process", points: 6 },
      ],
    },
    {
      text: "Name a home run that would make fans remember exactly where they were",
      answers: [
        { text: "Series-clinching walk-off blast", points: 40 },
        { text: "500th career home run", points: 26 },
        { text: "A pinch-hit homer in a Game 7", points: 18 },
        { text: "A homer off a Hall of Fame pitcher in his prime", points: 10 },
        { text: "A grand slam that flips a huge deficit", points: 6 },
      ],
    },
    {
      text: "Name something a pitcher does when he throws a complete game",
      answers: [
        { text: "Gets a standing ovation walking off the mound", points: 38 },
        { text: "Earns the absolute respect of old-school fans", points: 26 },
        { text: "Gets featured on every highlight show", points: 18 },
        { text: "Manager just lets him go without a visit", points: 12 },
        { text: "Sets the tone for the whole rotation that week", points: 6 },
      ],
    },
    {
      text: "Name something a catcher does to mess with a batter's head",
      answers: [
        { text: "Small talk to break concentration", points: 38 },
        { text: "Sets up inside then frames a pitch outside", points: 26 },
        { text: "Stands up and moves as if expecting a specific pitch", points: 18 },
        { text: "Hums or says something right as the pitch comes", points: 12 },
        { text: "Delays the sign sequence to disrupt timing", points: 6 },
      ],
    },
    {
      text: "Name a reason fans are excited about a prospect coming up from the minors",
      answers: [
        { text: "He's the number one prospect in all of baseball", points: 40 },
        { text: "He's been putting up insane minor league numbers", points: 26 },
        { text: "The current guy at his position is clearly struggling", points: 18 },
        { text: "He had a spectacular spring training", points: 10 },
        { text: "Local kid who grew up a fan of the team", points: 6 },
      ],
    },
  ],
  // Day 17
  [
    {
      text: "Name something that baseball purists think ruins the game",
      answers: [
        { text: "The universal DH taking pitchers out of the batting lineup", points: 36 },
        { text: "The ghost runner in extra innings", points: 28 },
        { text: "Three-batter minimum for relievers", points: 18 },
        { text: "Shift ban taking away a defensive chess piece", points: 12 },
        { text: "Expanded playoffs diluting the regular season", points: 6 },
      ],
    },
    {
      text: "Name something fans do when they catch a foul ball",
      answers: [
        { text: "Hold it up and look around for acknowledgment", points: 40 },
        { text: "Show it off on camera if they're on the scoreboard", points: 26 },
        { text: "Give it to a kid nearby", points: 18 },
        { text: "Immediately text everyone they know", points: 10 },
        { text: "Check if it's signed or special in any way", points: 6 },
      ],
    },
    {
      text: "Name a team known for its deep-rooted fan traditions",
      answers: [
        { text: "Chicago Cubs (Wrigley rituals, throw-back balls)", points: 36 },
        { text: "Boston Red Sox (Sweet Caroline, Green Monster)", points: 28 },
        { text: "New York Yankees (stadium pomp, Monument Park)", points: 18 },
        { text: "St. Louis Cardinals (self-described best fans in baseball)", points: 12 },
        { text: "San Francisco Giants (splash hits, garlic fries)", points: 6 },
      ],
    },
    {
      text: "Name something a pitcher does after a dominant strikeout performance",
      answers: [
        { text: "Fist pump walking off the mound", points: 38 },
        { text: "Looks into the dugout and points at teammates", points: 26 },
        { text: "Tips his cap to the crowd", points: 18 },
        { text: "Just stays stone-faced and emotionless", points: 12 },
        { text: "Slaps hands down the entire dugout", points: 6 },
      ],
    },
    {
      text: "Name something fans think about when the Yankees come to town",
      answers: [
        { text: "The Yankees have too much money", points: 38 },
        { text: "The stadium will be loud with visiting Yankees fans", points: 26 },
        { text: "An opportunity to beat the best team in baseball", points: 18 },
        { text: "High-leverage pitching matchups", points: 12 },
        { text: "Chance to see some of the biggest names in the sport", points: 6 },
      ],
    },
  ],
  // Day 18
  [
    {
      text: "Name something a batter does when he's deep in a slump",
      answers: [
        { text: "Changes his batting stance or grip", points: 38 },
        { text: "Takes extra BP every day before games", points: 26 },
        { text: "Goes back to basics and stops overtrying", points: 18 },
        { text: "Gets dropped in the lineup", points: 12 },
        { text: "Talks to old coaches or mentors", points: 6 },
      ],
    },
    {
      text: "Name something that happens when a team clinches the division",
      answers: [
        { text: "Champagne and beer all over the clubhouse", points: 44 },
        { text: "Huge on-field celebration", points: 26 },
        { text: "Players bring families onto the field", points: 16 },
        { text: "Manager gets doused with water", points: 8 },
        { text: "T-shirts and hats handed out right there", points: 6 },
      ],
    },
    {
      text: "Name a way the pitch clock has changed the feel of a game",
      answers: [
        { text: "Games are noticeably shorter", points: 40 },
        { text: "Batters can't stall as much anymore", points: 26 },
        { text: "Pitchers can't overthink between pitches", points: 18 },
        { text: "Some batters have had to adjust their whole routine", points: 10 },
        { text: "Fans are actually paying more attention", points: 6 },
      ],
    },
    {
      text: "Name something baseball fans love about the sport that they struggle to explain to non-fans",
      answers: [
        { text: "The beauty in the strategy within each at-bat", points: 38 },
        { text: "The pace — how calm moments make the action more exciting", points: 28 },
        { text: "How stats connect generations of players", points: 18 },
        { text: "The ritual and tradition of the whole thing", points: 10 },
        { text: "How every ballpark feels different", points: 6 },
      ],
    },
    {
      text: "Name something a manager looks at when deciding to pull a starter",
      answers: [
        { text: "Pitch count", points: 40 },
        { text: "How his mechanics look — arm action, stride", points: 26 },
        { text: "Third time through the lineup", points: 18 },
        { text: "Bullpen state — who's hot and rested", points: 10 },
        { text: "Score and game situation", points: 6 },
      ],
    },
  ],
  // Day 19
  [
    {
      text: "Name something fans say when a hitter launches a home run",
      answers: [
        { text: "\"Oh, that's gone!\"", points: 40, aliases: ["That's gone", "Thats gone"] },
        { text: "\"Get outta here!\"", points: 26, aliases: ["Get out of here"] },
        { text: "\"Did you see that?!\"", points: 18 },
        { text: "\"See you later!\"", points: 10 },
        { text: "\"He absolutely murdered that ball\"", points: 6 },
      ],
    },
    {
      text: "Name something a pitcher's superstition involves before a start",
      answers: [
        { text: "Same meal two hours before game time", points: 38 },
        { text: "Runs the outfield for the exact same amount of time", points: 26 },
        { text: "Listens to the same playlist on the way to the park", points: 18 },
        { text: "Touches the mound rubber a specific way on the first warm-up", points: 12 },
        { text: "Wears the same undershirt no matter how worn it is", points: 6 },
      ],
    },
    {
      text: "Name something about Dodger Stadium that fans love",
      answers: [
        { text: "The views of the mountains behind the outfield", points: 38 },
        { text: "The Dodger Dog", points: 28 },
        { text: "The historic feel — it's been there forever", points: 18 },
        { text: "The consistently warm weather", points: 10 },
        { text: "The electric atmosphere during playoff games", points: 6 },
      ],
    },
    {
      text: "Name a reason a pitcher loses a no-hitter in the late innings",
      answers: [
        { text: "A weak infield hit sneaks through", points: 36 },
        { text: "An error by a fielder ruins it", points: 26 },
        { text: "He walks the leadoff man and it unravels", points: 18 },
        { text: "A bloop single falls just out of reach", points: 12 },
        { text: "A pitcher's mistake on a full count 8th inning pitch", points: 8 },
      ],
    },
    {
      text: "Name something players do to celebrate a teammate's home run in the dugout",
      answers: [
        { text: "Full team waiting to mob him at the top of the dugout steps", points: 40 },
        { text: "Elaborate handshake or celebration routine", points: 28 },
        { text: "Fake ignoring him before exploding in celebration", points: 18 },
        { text: "Dump water or Gatorade on him", points: 8 },
        { text: "Make him sit alone as a funny prank, then mob him", points: 6 },
      ],
    },
  ],
  // Day 20
  [
    {
      text: "Name a thing fans do when a player gets plunked by a pitch",
      answers: [
        { text: "Hold their breath while he's checked on", points: 38 },
        { text: "Cheer if it was clearly intentional and their guy didn't react", points: 26 },
        { text: "Boo the pitcher loudly", points: 18 },
        { text: "Start rumors that a brawl is coming", points: 12 },
        { text: "Watch the benches for signs of warnings or ejections", points: 6 },
      ],
    },
    {
      text: "Name something that makes a baseball stadium feel alive even at a meaningless August game",
      answers: [
        { text: "A tight score late in the game", points: 38 },
        { text: "A big promotional night or giveaway", points: 26 },
        { text: "A star player chasing a milestone", points: 18 },
        { text: "Perfect summer weather that brings everyone out", points: 12 },
        { text: "A fun group or section that rallies others around them", points: 6 },
      ],
    },
    {
      text: "Name a reason a player turns down a team's contract offer in free agency",
      answers: [
        { text: "Another team offered significantly more money", points: 40 },
        { text: "Wants to go to a contender, not a rebuilding team", points: 26 },
        { text: "Prefers to live in a certain city", points: 18 },
        { text: "Has concerns about the organization's front office", points: 10 },
        { text: "Wants a shorter deal to hit free agency again soon", points: 6 },
      ],
    },
    {
      text: "Name something that separates an ace pitcher from a number-two starter",
      answers: [
        { text: "Consistency over the full 30+ starts", points: 38 },
        { text: "Dominates in big playoff games, not just regular season", points: 28 },
        { text: "Second and third pitch options as reliable as his first", points: 18 },
        { text: "Ability to escape jams when he's not at his best", points: 10 },
        { text: "Veteran leadership and mentorship in the rotation", points: 6 },
      ],
    },
    {
      text: "Name something fans debate every spring training",
      answers: [
        { text: "Whether the team will contend this year", points: 38 },
        { text: "Who wins the starting rotation battles", points: 26 },
        { text: "If a top prospect is ready for the majors", points: 18 },
        { text: "Whether a veteran will bounce back after an injury", points: 12 },
        { text: "Who's going to be the surprise of the season", points: 6 },
      ],
    },
  ],
  // Day 21
  [
    {
      text: "Name a kind of player that teams always want but rarely find",
      answers: [
        { text: "A true ace starter who can go 200+ innings", points: 36 },
        { text: "A 30-30 guy — 30 homers and 30 stolen bases", points: 26 },
        { text: "A catcher who can hit cleanup AND call a great game", points: 18 },
        { text: "A left-handed closer with swing-and-miss stuff", points: 14 },
        { text: "A shortstop who hits .300 and plays Gold Glove defense", points: 6 },
      ],
    },
    {
      text: "Name something fans chant or do to try to distract the opposing pitcher",
      answers: [
        { text: "Clap and chant to rattle his rhythm", points: 40 },
        { text: "Make noise every time he goes into his windup", points: 26 },
        { text: "Chant his name sarcastically", points: 18 },
        { text: "Flash signs or lights from the stands", points: 10 },
        { text: "Wave arms behind home plate to disrupt his sightline", points: 6 },
      ],
    },
    {
      text: "Name something a manager does that feels old-school but fans still love",
      answers: [
        { text: "Argues a call so hard he gets tossed", points: 40 },
        { text: "Goes out to give his pitcher a slow walk of confidence before pulling him", points: 26 },
        { text: "Writes the same veteran in the lineup no matter what the stats say", points: 18 },
        { text: "Bunts in a close game when analytics say swing away", points: 10 },
        { text: "Holds a team meeting with just the players — no coaches", points: 6 },
      ],
    },
    {
      text: "Name something baseball fans do after their team loses a tough playoff series",
      answers: [
        { text: "Replay every bad decision made all series long", points: 38 },
        { text: "Blame the manager for a specific lineup or bullpen move", points: 28 },
        { text: "Swear off watching for a while, then come back immediately", points: 18 },
        { text: "Turn to the Hot Stove and start projecting next year's roster", points: 10 },
        { text: "Find comfort in blaming injuries or bad luck", points: 6 },
      ],
    },
    {
      text: "Name something that happens when a no-hitter is completed",
      answers: [
        { text: "The whole team runs onto the field and mobs the pitcher", points: 42 },
        { text: "The stadium erupts louder than any regular home run", points: 26 },
        { text: "It leads the national sports news that night", points: 18 },
        { text: "The pitcher cries during the post-game interview", points: 8 },
        { text: "The catcher gets a lot of credit too", points: 6 },
      ],
    },
  ],
  // Day 22
  [
    {
      text: "Name something fans say makes the Cubs-Cardinals rivalry unique",
      answers: [
        { text: "Two huge Midwest fanbases that genuinely can't stand each other", points: 36 },
        { text: "Cardinals fans always thinking they're classier than everyone", points: 26 },
        { text: "Both teams have long storied histories", points: 18 },
        { text: "Regional bragging rights for the whole Midwest", points: 12 },
        { text: "Always in the same division so they play each other constantly", points: 8 },
      ],
    },
    {
      text: "Name something a cleanup hitter is expected to do that others aren't",
      answers: [
        { text: "Drive in runs with men on base, not just solo shots", points: 40 },
        { text: "Hit for power in the biggest spots", points: 26 },
        { text: "Be a threat the other team has to plan around in every inning", points: 18 },
        { text: "Protect the three-hole hitter in front of him", points: 10 },
        { text: "Be the emotional anchor of the lineup", points: 6 },
      ],
    },
    {
      text: "Name something that tells you a player is about to have a big breakout season",
      answers: [
        { text: "Incredible spring training performance", points: 36 },
        { text: "Major offseason mechanical adjustment clicked", points: 26 },
        { text: "Full health for the first time in two years", points: 18 },
        { text: "Beat writers are raving about how different he looks", points: 14 },
        { text: "Former mentor is now his hitting or pitching coach", points: 6 },
      ],
    },
    {
      text: "Name something fans think automatically when they hear 'pinch hitter'",
      answers: [
        { text: "The manager has given up on the starter", points: 36 },
        { text: "High pressure at-bat coming", points: 28 },
        { text: "The veteran backup who lives for these moments", points: 18 },
        { text: "Left-right platoon matchup he's designed for", points: 12 },
        { text: "Last chance for a comeback", points: 6 },
      ],
    },
    {
      text: "Name something that makes watching baseball on TV different from being there",
      answers: [
        { text: "You miss the smell of grass and hot dogs", points: 38 },
        { text: "TV has replays and analysis — the park doesn't", points: 26 },
        { text: "The crowd noise and energy is completely different in person", points: 18 },
        { text: "You can't track every ball off the bat the same way on TV", points: 12 },
        { text: "Commercials during pitching changes are longer on TV", points: 6 },
      ],
    },
  ],
  // Day 23
  [
    {
      text: "Name something that makes a baseball player an instant fan favorite",
      answers: [
        { text: "Hustle on every single play no matter what", points: 40 },
        { text: "Big personality and genuine connection with fans", points: 26 },
        { text: "Homegrown from the team's own farm system", points: 18 },
        { text: "Outperforming expectations after everyone counted him out", points: 10 },
        { text: "Always signing autographs and taking photos after games", points: 6 },
      ],
    },
    {
      text: "Name a reason fans think the steal of home is the greatest play in baseball",
      answers: [
        { text: "It's the boldest moment in a slow, strategic game", points: 38 },
        { text: "Almost never happens so it's shocking every time", points: 28 },
        { text: "It humiliates the pitcher in front of everyone", points: 18 },
        { text: "Requires perfect timing and nerves of steel", points: 10 },
        { text: "Associated with legends like Jackie Robinson and Ty Cobb", points: 6 },
      ],
    },
    {
      text: "Name something every baseball stadium needs to feel like a real ballpark",
      answers: [
        { text: "Real grass on the field", points: 38 },
        { text: "A classic organ playing between innings", points: 26 },
        { text: "A scoreboard that shows the out-of-town scores", points: 18 },
        { text: "Peanuts being sold in the stands", points: 12 },
        { text: "Unique local food that represents the city", points: 6 },
      ],
    },
    {
      text: "Name something that happens when a pitcher hits 100 mph on the radar gun",
      answers: [
        { text: "The stadium scoreboard lights up and fans react", points: 40 },
        { text: "Batters start looking more uncomfortable", points: 26 },
        { text: "Broadcasters make a big deal of it", points: 18 },
        { text: "Social media clips it immediately", points: 10 },
        { text: "The manager starts thinking about how to use him as the closer", points: 6 },
      ],
    },
    {
      text: "Name something baseball insiders say matters more than home runs",
      answers: [
        { text: "On-base percentage", points: 38 },
        { text: "Plate discipline and walk rate", points: 26 },
        { text: "Contact rate and putting the ball in play", points: 18 },
        { text: "Run prevention and defensive positioning", points: 12 },
        { text: "Not giving at-bats away with strikeouts", points: 6 },
      ],
    },
  ],
  // Day 24
  [
    {
      text: "Name something that happens in extra innings that doesn't happen in regulation",
      answers: [
        { text: "Ghost runner placed at second base automatically", points: 40 },
        { text: "Every pitch feels life-or-death", points: 26 },
        { text: "Position players pitching", points: 18 },
        { text: "Managers get more aggressive with bunts and squeeze plays", points: 10 },
        { text: "Fans who were about to leave stay glued to their seats", points: 6 },
      ],
    },
    {
      text: "Name something that makes fans believe a team has real chemistry",
      answers: [
        { text: "Veteran players mentoring younger guys visibly", points: 36 },
        { text: "Wild celebrations for walk-offs and clutch hits", points: 28 },
        { text: "Players genuinely hanging out off the field", points: 18 },
        { text: "Nobody sulking even when they're struggling individually", points: 12 },
        { text: "The whole bench goes crazy on big plays", points: 6 },
      ],
    },
    {
      text: "Name a reason the Dodgers are one of the most discussed teams in baseball",
      answers: [
        { text: "They spend money every off-season on big-name stars", points: 38 },
        { text: "They always contend and reach the playoffs", points: 28 },
        { text: "Their fan base is enormous and national", points: 18 },
        { text: "They develop great pitching consistently", points: 10 },
        { text: "Hollywood connection gives them extra media attention", points: 6 },
      ],
    },
    {
      text: "Name something that happens when a rookie gets his first big-league hit",
      answers: [
        { text: "He keeps the ball as a keepsake", points: 44 },
        { text: "Dugout goes crazy for him", points: 26 },
        { text: "First base coach congratulates him and slaps him on the back", points: 16 },
        { text: "His family in the stands cries", points: 8 },
        { text: "His minor league manager messages him right after", points: 6 },
      ],
    },
    {
      text: "Name a time during a game when a stadium gets completely silent",
      answers: [
        { text: "A player stays down after a scary collision", points: 40 },
        { text: "A pitcher is one out away from completing a no-hitter", points: 28 },
        { text: "A team has the bases loaded with two outs in the ninth", points: 18 },
        { text: "A beloved announcer or former player is honored with a moment of silence", points: 8 },
        { text: "A controversial call is being reviewed and nobody knows the outcome", points: 6 },
      ],
    },
  ],
  // Day 25
  [
    {
      text: "Name something a catcher does that goes completely unnoticed by casual fans",
      answers: [
        { text: "Frames borderline pitches to steal strikes", points: 38 },
        { text: "Sets up in different spots to manipulate batter's eye", points: 26 },
        { text: "Constantly shifts fielders with subtle hand signals", points: 18 },
        { text: "Manages the pitcher's emotions between pitches", points: 12 },
        { text: "Studies hitter tendencies and switches signs mid-game", points: 6 },
      ],
    },
    {
      text: "Name something fans love about a well-executed squeeze bunt",
      answers: [
        { text: "It's the ultimate old-school small-ball move", points: 38 },
        { text: "Everyone in the ballpark sees it coming but can't stop it", points: 26 },
        { text: "Looks effortless when it works perfectly", points: 18 },
        { text: "Drives the opposing pitcher absolutely crazy", points: 12 },
        { text: "Analytics guys hate it, which makes traditional fans love it more", points: 6 },
      ],
    },
    {
      text: "Name something that has changed about baseball that even young fans have noticed",
      answers: [
        { text: "Games are shorter now with the pitch clock", points: 40 },
        { text: "Pitchers don't throw complete games anymore", points: 26 },
        { text: "Shifts are banned so more balls go into play", points: 18 },
        { text: "There are way more strikeouts than ever", points: 10 },
        { text: "The extra-innings ghost runner makes late games weird", points: 6 },
      ],
    },
    {
      text: "Name something a pitcher thinks about when facing the same lineup for the third time",
      answers: [
        { text: "They've already seen all his pitches and timing", points: 40 },
        { text: "Needs to flip the script with a new pitch or sequence", points: 26 },
        { text: "Whether the manager is about to pull him", points: 18 },
        { text: "Fatigue and how his arm feels", points: 10 },
        { text: "Which batters will be sitting on his best pitch", points: 6 },
      ],
    },
    {
      text: "Name something fans say after a tough extra-inning loss",
      answers: [
        { text: "\"We should've scored more when we had the chance\"", points: 38, aliases: ["We should have scored more"] },
        { text: "\"The bullpen gave it away again\"", points: 28, aliases: ["Bullpen gave it away"] },
        { text: "\"Why didn't the manager do X in the seventh?\"", points: 18, aliases: ["Why didn't the manager"] },
        { text: "\"The ghost runner rule is stupid\"", points: 10, aliases: ["Ghost runner is stupid"] },
        { text: "\"We need to win the next two and forget this one\"", points: 6, aliases: ["Forget this one"] },
      ],
    },
  ],
  // Day 26
  [
    {
      text: "Name something about spring training that fans get excited about every year",
      answers: [
        { text: "Seeing prospects who could make the big league roster", points: 38 },
        { text: "The return of baseball after a long winter", points: 28 },
        { text: "Seeing if the big off-season signing lives up to hype", points: 18 },
        { text: "Lower stakes but beautiful weather and great vibes", points: 10 },
        { text: "Players looking healthy after rehab from injury", points: 6 },
      ],
    },
    {
      text: "Name a reason a player doesn't argue when called out on strikes",
      answers: [
        { text: "It was obviously a strike and he knows it", points: 36 },
        { text: "Doesn't want a reputation with umpires as a complainer", points: 28 },
        { text: "His manager told him to stop getting T'd up", points: 18 },
        { text: "He's in a slump and knows emotion won't help", points: 12 },
        { text: "He's a veteran who stays calm as a team leader", points: 6 },
      ],
    },
    {
      text: "Name something people say at a baseball game that they'd never say anywhere else",
      answers: [
        { text: "\"He's painting the corners\"", points: 38 },
        { text: "\"Choke up and put it in play!\"", points: 26 },
        { text: "\"That ball had eyes — it found the hole\"", points: 18 },
        { text: "\"He hung that curve and got punished\"", points: 12 },
        { text: "\"The shift bit them again\"", points: 6 },
      ],
    },
    {
      text: "Name something fans expect from a player who signs a $300 million contract",
      answers: [
        { text: "MVP-level performance every year", points: 40 },
        { text: "To stay healthy for the whole contract", points: 26 },
        { text: "To be the face of the franchise and the city", points: 18 },
        { text: "To win a championship — not just individual stats", points: 10 },
        { text: "To remain focused and not seem distracted by money", points: 6 },
      ],
    },
    {
      text: "Name something a player does during a walk that frustrates the pitcher",
      answers: [
        { text: "Flips his bat casually and strolls to first", points: 40 },
        { text: "Claps his hands and riles up the crowd", points: 26 },
        { text: "Points to his teammates in the dugout", points: 18 },
        { text: "Doesn't even look at the pitcher as he jogs over", points: 10 },
        { text: "Says something quietly to the catcher", points: 6 },
      ],
    },
  ],
  // Day 27
  [
    {
      text: "Name a reason baseball fans consider the 162-game season both great and terrible",
      answers: [
        { text: "Great for stats and patterns — terrible for daily investment", points: 36 },
        { text: "Any team can get hot or cold over a long stretch", points: 26 },
        { text: "By August, meaningless games for bad teams feel endless", points: 18 },
        { text: "Exciting because one losing streak doesn't end your season", points: 14 },
        { text: "Hard to stay emotionally invested every single night", points: 6 },
      ],
    },
    {
      text: "Name something that separates good contact hitters from great ones",
      answers: [
        { text: "Ability to hit the ball where it's pitched", points: 38 },
        { text: "Rarely swings at pitches out of the zone", points: 26 },
        { text: "Can foul off tough pitches and stay alive", points: 18 },
        { text: "Adjusts mid at-bat when the pitcher changes his plan", points: 12 },
        { text: "Produces even against elite pitching, not just average arms", points: 6 },
      ],
    },
    {
      text: "Name something fans say proves a team is a true World Series contender",
      answers: [
        { text: "They have the best rotation in the league", points: 36 },
        { text: "Their bullpen doesn't have a weak link", points: 28 },
        { text: "They win close games consistently", points: 18 },
        { text: "They have multiple MVP-caliber players", points: 12 },
        { text: "They've been through playoff pressure before and know how to handle it", points: 6 },
      ],
    },
    {
      text: "Name something that fans do at a playoff game that they don't do in the regular season",
      answers: [
        { text: "Stay standing for entire key at-bats", points: 38 },
        { text: "Are completely silent on 0-2 counts", points: 26 },
        { text: "Scream and lose their voices by the third inning", points: 18 },
        { text: "Wear full team gear including face paint", points: 12 },
        { text: "Have a full emotional breakdown after close calls", points: 6 },
      ],
    },
    {
      text: "Name something that fans say makes Yankee Stadium feel different from other parks",
      answers: [
        { text: "The history and aura of the pinstripes", points: 38 },
        { text: "Loudest booing of visiting teams in the league", points: 26 },
        { text: "Monument Park honoring legends of the franchise", points: 18 },
        { text: "Visiting players say they feel the pressure just walking in", points: 12 },
        { text: "The media presence is enormous compared to every other city", points: 6 },
      ],
    },
  ],
  // Day 28
  [
    {
      text: "Name something fans think about when a team uses an opener instead of a traditional starter",
      answers: [
        { text: "The manager doesn't trust his rotation", points: 38 },
        { text: "The analytics team is running the game now", points: 26 },
        { text: "Old-school fans are furious about it", points: 18 },
        { text: "There might be a real ace on short rest being saved for later", points: 12 },
        { text: "It's going to be a long game for the bullpen", points: 6 },
      ],
    },
    {
      text: "Name something a baseball player does to get ready for a night game",
      answers: [
        { text: "Takes batting practice in the afternoon", points: 40 },
        { text: "Light stretch and workout in the weight room", points: 26 },
        { text: "Studies video of that night's opposing starter", points: 18 },
        { text: "Takes a short nap before heading to the park", points: 10 },
        { text: "Eats a specific pre-game meal at a specific time", points: 6 },
      ],
    },
    {
      text: "Name a baseball town where fans make the visiting team uncomfortable",
      answers: [
        { text: "Boston — Fenway gets absolutely deafening", points: 38 },
        { text: "New York — Yankees Stadium is intimidating on every pitch", points: 28 },
        { text: "Chicago (Wrigley) — Ivy-wall mystique rattles visitors", points: 18 },
        { text: "Houston — Minute Maid fans know the game deeply", points: 10 },
        { text: "St. Louis — Busch Stadium is always packed and loud", points: 6 },
      ],
    },
    {
      text: "Name something fans believe gives a pitcher a mental edge in a big game",
      answers: [
        { text: "Previous dominant performance against this lineup", points: 36 },
        { text: "Playing in front of a home crowd that believes in him", points: 26 },
        { text: "A great warm-up session that builds his confidence", points: 18 },
        { text: "A catcher he fully trusts to call the game", points: 14 },
        { text: "Nothing to lose — came up as a long shot for the start", points: 6 },
      ],
    },
    {
      text: "Name something a fan does between innings to stay engaged at a slow game",
      answers: [
        { text: "Checks scores from other games on their phone", points: 38 },
        { text: "Grabs another beer or hot dog", points: 26 },
        { text: "Talks strategy and lineup decisions with whoever they're with", points: 18 },
        { text: "Participates in the between-inning trivia or games on the scoreboard", points: 12 },
        { text: "Watches the bullpens to see who's warming up", points: 6 },
      ],
    },
  ],
  // Day 29
  [
    {
      text: "Name a reason fans think bat flips should be fully embraced in baseball",
      answers: [
        { text: "Other sports let players celebrate — why not baseball?", points: 40 },
        { text: "It's a natural emotional reaction to an incredible moment", points: 26 },
        { text: "Makes the game more entertaining for younger fans", points: 18 },
        { text: "The best bat flips become iconic cultural moments", points: 10 },
        { text: "If the pitcher can show emotion, so can the hitter", points: 6 },
      ],
    },
    {
      text: "Name something fans argue about during every Hall of Fame election",
      answers: [
        { text: "Whether steroid-era players should ever get in", points: 40 },
        { text: "Why certain guys with great numbers keep getting overlooked", points: 26 },
        { text: "Whether writers should have this power at all", points: 18 },
        { text: "Peak vs. longevity — short dominance or long consistency", points: 10 },
        { text: "Whether analytics stats should count or just traditional ones", points: 6 },
      ],
    },
    {
      text: "Name something that has made baseball more popular with younger fans recently",
      answers: [
        { text: "Flashy young players with huge personalities", points: 38 },
        { text: "Faster games with the pitch clock", points: 28 },
        { text: "More highlight-worthy moments shared on social media", points: 18 },
        { text: "International players bringing global fanbases", points: 10 },
        { text: "Statcast data making the game feel like a video game", points: 6 },
      ],
    },
    {
      text: "Name something a pitcher hates more than any other batter behavior",
      answers: [
        { text: "A hitter standing and watching a homer for too long", points: 38 },
        { text: "An elaborate bat flip after a cheap home run", points: 28 },
        { text: "A batter who steps out constantly and kills his rhythm", points: 18 },
        { text: "A guy who swings through a fastball then laughs it off", points: 10 },
        { text: "A showboat who points to the dugout after every hit", points: 6 },
      ],
    },
    {
      text: "Name something that makes a game-seven atmosphere unlike anything in sports",
      answers: [
        { text: "Every single pitch could end someone's season", points: 42 },
        { text: "Players visibly showing nerves and emotion", points: 26 },
        { text: "Nobody in the stadium sits down from the first pitch", points: 16 },
        { text: "Managers making decisions they'll be judged forever for", points: 10 },
        { text: "The loser has to watch the winner celebrate on their home field", points: 6 },
      ],
    },
  ],
  // Day 30
  [
    {
      text: "Name something a fan does the morning of a World Series game",
      answers: [
        { text: "Can't eat a full breakfast — too anxious", points: 38 },
        { text: "Texts everyone they know about the game", points: 26 },
        { text: "Puts on all their team gear early in the morning", points: 18 },
        { text: "Calls out sick from work or school", points: 12 },
        { text: "Does every superstition they've been doing all postseason", points: 6 },
      ],
    },
    {
      text: "Name a player type that always becomes a folk hero in baseball",
      answers: [
        { text: "The scrappy utility guy who overachieves", points: 38 },
        { text: "The veteran who waited his whole career for a ring", points: 28 },
        { text: "The unknown reliever who dominates in the playoffs", points: 18 },
        { text: "The young homegrown kid who carries the team", points: 10 },
        { text: "The trade deadline pickup who becomes the missing piece", points: 6 },
      ],
    },
    {
      text: "Name something that feels sacred about the tradition of baseball",
      answers: [
        { text: "The stats connect today's players to players from 100 years ago", points: 40 },
        { text: "Every generation grows up going to games with their parents", points: 26 },
        { text: "The same rules and basic game have barely changed", points: 18 },
        { text: "The ballparks themselves become landmarks of cities", points: 10 },
        { text: "Opening Day feels like a national holiday", points: 6 },
      ],
    },
    {
      text: "Name something fans say right after their team wins the World Series",
      answers: [
        { text: "\"I've been waiting my whole life for this!\"", points: 42, aliases: ["I've been waiting my whole life", "Been waiting my whole life"] },
        { text: "\"We're the greatest fans in baseball!\"", points: 26, aliases: ["Greatest fans in baseball"] },
        { text: "\"We need to run it back next year!\"", points: 18, aliases: ["Run it back"] },
        { text: "\"That was the greatest season I've ever watched\"", points: 8, aliases: ["Greatest season I've ever watched"] },
        { text: "\"I can't believe we actually did it\"", points: 6, aliases: ["Can't believe we did it"] },
      ],
    },
    {
      text: "Name something that makes the Cubs-Cardinals or Yankees-Red Sox rivalry feel bigger than a typical sports rivalry",
      answers: [
        { text: "Generations of families on both sides born into the hatred", points: 40 },
        { text: "It's not just teams — it's entire cities and cultures", points: 26 },
        { text: "The playoff history between the two teams is legendary", points: 18 },
        { text: "Media treats every matchup like a mini World Series", points: 10 },
        { text: "Players on both sides feel it even before they play in it", points: 6 },
      ],
    },
  ],
]

// ── NHL Questions (30 days) ──
const NHL_DAYS: Question[][] = [
  // Day 1
  [
    {
      text: "Name something that starts a fight in a hockey game",
      answers: [
        { text: "A dirty hit", points: 40 },
        { text: "Someone goes after the star player", points: 26 },
        { text: "Trash talking", points: 16 },
        { text: "Running the goalie", points: 10 },
        { text: "A cheap shot after the whistle", points: 8 },
      ],
    },
    {
      text: "Name what fans do when the home team scores",
      answers: [
        { text: "Jump out of their seats", points: 40 },
        { text: "Throw their arms up", points: 26 },
        { text: "High five strangers", points: 18 },
        { text: "Spill their beer", points: 10 },
        { text: "Start chanting", points: 6 },
      ],
    },
    {
      text: "Name something associated with playoff hockey",
      answers: [
        { text: "Playoff beard", points: 38 },
        { text: "More physical play", points: 26 },
        { text: "Packed arenas", points: 18 },
        { text: "More intensity", points: 10 },
        { text: "Overtime games", points: 8 },
      ],
    },
    {
      text: "Name a reason a goalie has a bad game",
      answers: [
        { text: "Screen in front of the net", points: 38 },
        { text: "Deflections he couldn't see", points: 26 },
        { text: "Defense was terrible", points: 20 },
        { text: "Off his game mentally", points: 10 },
        { text: "Previous night's travel", points: 6 },
      ],
    },
    {
      text: "Name something a player does after scoring a hat trick",
      answers: [
        { text: "Fans throw hats on the ice", points: 40 },
        { text: "Takes a bow or celebrates big", points: 26 },
        { text: "Gets a hat from teammates", points: 18 },
        { text: "Posts on social media after the game", points: 10 },
        { text: "Gets a standing ovation", points: 6 },
      ],
    },
  ],

  // Day 2
  [
    {
      text: "Name something a hockey player is known for playing through",
      answers: [
        { text: "Broken bones", points: 40 },
        { text: "Missing teeth", points: 24 },
        { text: "Stitches mid-game", points: 18 },
        { text: "Concussions", points: 10 },
        { text: "A separated shoulder", points: 8 },
      ],
    },
    {
      text: "We asked 100 sports fans: Name something goalies do that looks weird",
      answers: [
        { text: "Talk to the goalposts", points: 38 },
        { text: "Crazy pre-game rituals", points: 27 },
        { text: "Wear a painted mask", points: 18 },
        { text: "Skate out before warm-ups to be alone", points: 10 },
        { text: "Refuse to be touched during warm-ups", points: 7 },
      ],
    },
    {
      text: "Name a team you'd expect to be in the Stanley Cup Finals",
      answers: [
        { text: "Boston Bruins", points: 35 },
        { text: "Tampa Bay Lightning", points: 25 },
        { text: "Colorado Avalanche", points: 17 },
        { text: "Toronto Maple Leafs", points: 13 },
        { text: "Vegas Golden Knights", points: 10 },
      ],
    },
    {
      text: "Name something fans do when their team wins the Stanley Cup",
      answers: [
        { text: "Rush into the streets", points: 42 },
        { text: "Pour drinks on each other", points: 22 },
        { text: "Cry happy tears", points: 18 },
        { text: "Call everyone they know", points: 12 },
        { text: "Buy championship gear immediately", points: 6 },
      ],
    },
    {
      text: "Name something a power play unit absolutely needs to succeed",
      answers: [
        { text: "A sharp shooter at the point", points: 38 },
        { text: "Good puck movement", points: 27 },
        { text: "A net-front presence", points: 18 },
        { text: "Quick passes to confuse the PK", points: 11 },
        { text: "A quarterback on the blue line", points: 6 },
      ],
    },
  ],

  // Day 3
  [
    {
      text: "Name a Canadian city that's absolutely obsessed with hockey",
      answers: [
        { text: "Toronto", points: 40 },
        { text: "Montreal", points: 28 },
        { text: "Edmonton", points: 16 },
        { text: "Calgary", points: 10 },
        { text: "Vancouver", points: 6 },
      ],
    },
    {
      text: "Name something that happens during a bench-clearing brawl",
      answers: [
        { text: "Refs try to break it up", points: 38 },
        { text: "Players pair off across the ice", points: 28 },
        { text: "Coaches scream from the bench", points: 17 },
        { text: "Fans go absolutely wild", points: 11 },
        { text: "Penalties for everyone", points: 6 },
      ],
    },
    {
      text: "Name something a hockey coach does when furious with the referee",
      answers: [
        { text: "Pounds the boards", points: 42 },
        { text: "Yells and gestures wildly", points: 28 },
        { text: "Gets ejected from the bench", points: 16 },
        { text: "Throws something on the ice", points: 8 },
        { text: "Challenges the call", points: 6 },
      ],
    },
    {
      text: "Name something Detroit Red Wings fans are known for",
      answers: [
        { text: "Throwing octopuses on the ice", points: 45 },
        { text: "The Joe Louis Arena legacy", points: 22 },
        { text: "Being a hockey-first city", points: 16 },
        { text: "The Gordie Howe era pride", points: 10 },
        { text: "Hockeytown nickname", points: 7 },
      ],
    },
    {
      text: "Name a reason fans start booing their own team",
      answers: [
        { text: "Losing by a lot at home", points: 40 },
        { text: "Soft play and no intensity", points: 26 },
        { text: "A bad trade or signing", points: 18 },
        { text: "Goalie lets in a soft goal", points: 10 },
        { text: "Players not trying hard enough", points: 6 },
      ],
    },
  ],

  // Day 4
  [
    {
      text: "Name something that makes overtime hockey so intense",
      answers: [
        { text: "One goal ends it all", points: 42 },
        { text: "The crowd is deafening", points: 25 },
        { text: "Every rush feels like it could score", points: 18 },
        { text: "Players are exhausted but fighting through it", points: 10 },
        { text: "Goalies standing on their head", points: 5 },
      ],
    },
    {
      text: "Name something a hockey enforcer is known for",
      answers: [
        { text: "Fighting anyone who touches the star player", points: 40 },
        { text: "Throwing huge hits", points: 26 },
        { text: "Being feared by opponents", points: 18 },
        { text: "Protecting teammates", points: 12 },
        { text: "Going to the penalty box often", points: 4 },
      ],
    },
    {
      text: "Name a penalty that fans think is called too often",
      answers: [
        { text: "Hooking", points: 38 },
        { text: "Interference", points: 28 },
        { text: "Tripping", points: 18 },
        { text: "High-sticking", points: 10 },
        { text: "Delay of game", points: 6 },
      ],
    },
    {
      text: "Name something a goalie does during a shootout that looks superstitious",
      answers: [
        { text: "Stares down the shooter without blinking", points: 40 },
        { text: "Bounces side to side ritualistically", points: 26 },
        { text: "Talks to himself between shots", points: 16 },
        { text: "Taps posts before each shot", points: 12 },
        { text: "Has a specific glove movement routine", points: 6 },
      ],
    },
    {
      text: "Name something Canadian fans do differently than American fans at hockey games",
      answers: [
        { text: "Sing the national anthems louder", points: 38 },
        { text: "Know the game way better", points: 25 },
        { text: "Stay quieter in less heated moments", points: 18 },
        { text: "More passionate about the sport overall", points: 13 },
        { text: "Dress differently for cold arenas", points: 6 },
      ],
    },
  ],

  // Day 5
  [
    {
      text: "Name something about a rivalry game that feels different from a regular game",
      answers: [
        { text: "Way more physical play", points: 40 },
        { text: "Fans are way louder", points: 27 },
        { text: "Players are more emotional", points: 18 },
        { text: "More fights break out", points: 9 },
        { text: "Every penalty gets a huge reaction", points: 6 },
      ],
    },
    {
      text: "Name something fans are known for doing at a playoff hockey game",
      answers: [
        { text: "Wearing all white or all red", points: 38 },
        { text: "Playoff beard pride", points: 24 },
        { text: "Standing almost the whole game", points: 19 },
        { text: "Banging on the boards", points: 11 },
        { text: "Chanting the entire period", points: 8 },
      ],
    },
    {
      text: "Name a position that usually gets the most blame when a team loses",
      answers: [
        { text: "Goalie", points: 45 },
        { text: "Defense", points: 28 },
        { text: "Head coach", points: 16 },
        { text: "Power play unit", points: 7 },
        { text: "Star forward who went quiet", points: 4 },
      ],
    },
    {
      text: "Name something that happens when a team goes on a long winning streak",
      answers: [
        { text: "Ticket prices skyrocket", points: 38 },
        { text: "Everyone starts caring about hockey", points: 26 },
        { text: "Players get overconfident", points: 18 },
        { text: "Media covers them non-stop", points: 12 },
        { text: "Bandwagon fans come out", points: 6 },
      ],
    },
    {
      text: "Name something that makes a hockey trade deadline day exciting",
      answers: [
        { text: "Big-name players switching teams", points: 42 },
        { text: "Surprise moves nobody saw coming", points: 25 },
        { text: "Fans debating every move online", points: 18 },
        { text: "Teams going all-in for a championship run", points: 10 },
        { text: "Teams blowing it up and rebuilding", points: 5 },
      ],
    },
  ],

  // Day 6
  [
    {
      text: "Name something a hockey player grows during the playoffs",
      answers: [
        { text: "A beard", points: 55 },
        { text: "Confidence", points: 20 },
        { text: "A mustache", points: 13 },
        { text: "A chip on their shoulder", points: 8 },
        { text: "Longer hair", points: 4 },
      ],
    },
    {
      text: "Name a reason a goalie might get pulled mid-game",
      answers: [
        { text: "Gave up 3 or more soft goals", points: 42 },
        { text: "Team is down big and needs a spark", points: 28 },
        { text: "Injured on a play", points: 18 },
        { text: "Completely off rhythm", points: 8 },
        { text: "Equipment malfunction", points: 4 },
      ],
    },
    {
      text: "Name something that happens when a player gets a penalty in overtime",
      answers: [
        { text: "Crowd goes absolutely nuts", points: 42 },
        { text: "The team on the power play almost always scores", points: 28 },
        { text: "The penalized player gets destroyed on social media", points: 15 },
        { text: "Coach looks furious", points: 9 },
        { text: "It becomes a major talking point after the game", points: 6 },
      ],
    },
    {
      text: "Name a hockey moment that gives fans chills",
      answers: [
        { text: "A game 7 overtime goal", points: 40 },
        { text: "A player scoring after returning from a serious injury", points: 28 },
        { text: "Lifting the Stanley Cup for the first time", points: 18 },
        { text: "A hat trick in a playoff game", points: 8 },
        { text: "A perfect penalty kill to end the game", points: 6 },
      ],
    },
    {
      text: "Name something fans think about during a slow regular season game",
      answers: [
        { text: "When is this over", points: 38 },
        { text: "This team needs a trade", points: 27 },
        { text: "The nachos are better than this game", points: 18 },
        { text: "I hope the playoffs are better", points: 12 },
        { text: "At least the beer is cold", points: 5 },
      ],
    },
  ],

  // Day 7
  [
    {
      text: "Name something about hockey culture that outsiders find confusing",
      answers: [
        { text: "Fighting is allowed and respected", points: 42 },
        { text: "Players missing teeth is a badge of honor", points: 26 },
        { text: "Throwing things on the ice is a tradition", points: 16 },
        { text: "Playoff beards are a serious commitment", points: 10 },
        { text: "Players tap gloves after every game", points: 6 },
      ],
    },
    {
      text: "Name something that fires up a team more than anything else",
      answers: [
        { text: "A big hit on a star player", points: 40 },
        { text: "An opponent celebrating too much", points: 26 },
        { text: "A comeback from a big deficit", points: 18 },
        { text: "A coach's fiery intermission speech", points: 10 },
        { text: "Getting scored on off a bad turnover", points: 6 },
      ],
    },
    {
      text: "Name something a defenseman does that earns respect from teammates",
      answers: [
        { text: "Takes a hit to make a clean pass", points: 38 },
        { text: "Blocks a shot with their body", points: 30 },
        { text: "Stands up for a teammate after a cheap shot", points: 18 },
        { text: "Clears the crease with authority", points: 8 },
        { text: "Quarterbacks the power play perfectly", points: 6 },
      ],
    },
    {
      text: "Name something that makes a hockey arena atmosphere incredible",
      answers: [
        { text: "Packed crowd going wild", points: 40 },
        { text: "A goal horn that shakes the building", points: 26 },
        { text: "Playoff atmosphere energy", points: 18 },
        { text: "Fans doing a coordinated towel wave", points: 10 },
        { text: "A loud comeback in the third period", points: 6 },
      ],
    },
    {
      text: "Name a hockey rivalry that American fans know",
      answers: [
        { text: "Bruins vs Canadiens", points: 38 },
        { text: "Rangers vs Flyers", points: 28 },
        { text: "Blackhawks vs Red Wings", points: 18 },
        { text: "Penguins vs Capitals", points: 10 },
        { text: "Avalanche vs Red Wings", points: 6 },
      ],
    },
  ],

  // Day 8
  [
    {
      text: "Name something a team does when they know they've already made the playoffs",
      answers: [
        { text: "Rest star players", points: 42 },
        { text: "Experiment with line combinations", points: 26 },
        { text: "Give younger players more ice time", points: 18 },
        { text: "Coaches focus on systems rather than results", points: 8 },
        { text: "The team plays looser and more free", points: 6 },
      ],
    },
    {
      text: "Name something a hockey coach is always yelling about from the bench",
      answers: [
        { text: "Get back on defense", points: 40 },
        { text: "Move the puck faster", points: 28 },
        { text: "Get in front of the net", points: 18 },
        { text: "Stop taking penalties", points: 8 },
        { text: "Win your battles along the boards", points: 6 },
      ],
    },
    {
      text: "Name a trait fans expect their team's goalie to have",
      answers: [
        { text: "Ice-cold nerves under pressure", points: 42 },
        { text: "Great reflexes", points: 28 },
        { text: "Ability to steal games on their own", points: 18 },
        { text: "Strong communication with the defense", points: 8 },
        { text: "A big personality in the locker room", points: 4 },
      ],
    },
    {
      text: "Name something that makes a trade deadline deal feel like a heist",
      answers: [
        { text: "Getting a star for almost nothing", points: 42 },
        { text: "The other team regretting it immediately", points: 26 },
        { text: "Winning the Cup with the traded player", points: 18 },
        { text: "The player immediately starts producing", points: 10 },
        { text: "Fans being shocked it happened at all", points: 4 },
      ],
    },
    {
      text: "Name something fans in cold-weather hockey cities take pride in",
      answers: [
        { text: "Hockey being a way of life", points: 40 },
        { text: "Playing outdoor pond hockey growing up", points: 28 },
        { text: "The toughness of their fan base", points: 18 },
        { text: "Supporting the team through bad years", points: 10 },
        { text: "Their city's hockey history", points: 4 },
      ],
    },
  ],

  // Day 9
  [
    {
      text: "Name something that happens in a physical hockey game that fans love",
      answers: [
        { text: "Big open-ice hits", points: 40 },
        { text: "Two players dropping the gloves", points: 28 },
        { text: "Scrums in front of the net", points: 18 },
        { text: "Board battles every shift", points: 8 },
        { text: "A player finishing their check even after the puck is gone", points: 6 },
      ],
    },
    {
      text: "Name something that makes a goalie look like a legend",
      answers: [
        { text: "Robbing someone on a breakaway", points: 42 },
        { text: "A shutout in a playoff game", points: 28 },
        { text: "Making 50 saves in a loss", points: 16 },
        { text: "Glove save on a one-timer", points: 9 },
        { text: "Getting back up after taking a skate to the mask", points: 5 },
      ],
    },
    {
      text: "Name a reason a team's momentum totally shifts mid-game",
      answers: [
        { text: "A shorthanded goal", points: 40 },
        { text: "A big fight that wakes up the team", points: 28 },
        { text: "A clutch save to keep the score close", points: 18 },
        { text: "A questionable referee call", points: 9 },
        { text: "A star player coming out of nowhere", points: 5 },
      ],
    },
    {
      text: "Name something about a hockey penalty box that fans find entertaining",
      answers: [
        { text: "The player sitting there looking furious", points: 42 },
        { text: "The crowd taunting whoever's inside", points: 26 },
        { text: "A star player being in there during a crucial moment", points: 18 },
        { text: "The awkward two minutes of sitting right next to opposing fans", points: 9 },
        { text: "The penalty box timekeeper looking uncomfortable", points: 5 },
      ],
    },
    {
      text: "Name a hockey player quality that fans love more than goals",
      answers: [
        { text: "Heart and grit", points: 40 },
        { text: "Leadership in the locker room", points: 26 },
        { text: "Standing up for teammates", points: 18 },
        { text: "Blocking shots without hesitation", points: 10 },
        { text: "Always giving full effort even when losing", points: 6 },
      ],
    },
  ],

  // Day 10
  [
    {
      text: "Name something that makes a hat trick extra special",
      answers: [
        { text: "Scoring in three different ways", points: 38 },
        { text: "It happens in a playoff game", points: 28 },
        { text: "The third goal comes in the final minute", points: 18 },
        { text: "A natural hat trick — three in a row", points: 12 },
        { text: "The player had a quiet game before the goals", points: 4 },
      ],
    },
    {
      text: "Name something about hockey that makes it different from every other sport",
      answers: [
        { text: "The speed of the game", points: 40 },
        { text: "Fighting is allowed", points: 28 },
        { text: "Players play through unbelievable injuries", points: 18 },
        { text: "Skating makes everything more athletic", points: 8 },
        { text: "The ice changes the whole energy of the arena", points: 6 },
      ],
    },
    {
      text: "Name something fans say when their goalie gets scored on in a brutal way",
      answers: [
        { text: "How did he not have that", points: 40 },
        { text: "We need to trade him", points: 27 },
        { text: "That's going in the blooper reel", points: 18 },
        { text: "He looks shaky tonight", points: 9 },
        { text: "Pull him before it gets worse", points: 6 },
      ],
    },
    {
      text: "Name a reason a team goes on a losing streak",
      answers: [
        { text: "Key injuries piling up", points: 40 },
        { text: "Goalie stops performing", points: 26 },
        { text: "Team chemistry breaks down", points: 18 },
        { text: "A brutal stretch of the schedule", points: 10 },
        { text: "Turnovers leading to easy goals against", points: 6 },
      ],
    },
    {
      text: "Name something a team's fan base does to get fired up before a big game",
      answers: [
        { text: "Tailgating outside the arena", points: 38 },
        { text: "Bar crawl before puck drop", points: 26 },
        { text: "Wearing all team colors head to toe", points: 18 },
        { text: "Watching pregame warmups to scout the team", points: 12 },
        { text: "Buying a new jersey for good luck", points: 6 },
      ],
    },
  ],

  // Day 11
  [
    {
      text: "Name something a hockey player does after scoring a big goal",
      answers: [
        { text: "Arms raised and screaming", points: 42 },
        { text: "Points to the sky or the bench", points: 26 },
        { text: "Jumps into teammates' arms", points: 16 },
        { text: "Slides on the ice on their knees", points: 10 },
        { text: "Bangs the glass with their stick", points: 6 },
      ],
    },
    {
      text: "Name a reason a penalty kill unit is respected",
      answers: [
        { text: "Killing off a 5-on-3 disadvantage", points: 40 },
        { text: "Shorthanded goal while killing the penalty", points: 28 },
        { text: "Blocking multiple shots in a row", points: 18 },
        { text: "Forcing the power play to reset repeatedly", points: 9 },
        { text: "Great goaltending on power play shots", points: 5 },
      ],
    },
    {
      text: "Name something a hockey analyst says that sounds ridiculous to non-fans",
      answers: [
        { text: "He's good in the corners", points: 38 },
        { text: "They need to get pucks on net", points: 28 },
        { text: "That was a great line change", points: 18 },
        { text: "He plays a 200-foot game", points: 10 },
        { text: "He wins his battles along the wall", points: 6 },
      ],
    },
    {
      text: "Name something that gives a team home ice advantage energy",
      answers: [
        { text: "Crowd noise affecting the opposing team", points: 42 },
        { text: "Familiar ice and locker rooms", points: 24 },
        { text: "No long travel before the game", points: 18 },
        { text: "Family and friends in the stands", points: 10 },
        { text: "Last line change belongs to the home team", points: 6 },
      ],
    },
    {
      text: "Name something that makes a hockey fan believe their team can win the Cup this year",
      answers: [
        { text: "A hot goalie carrying the team", points: 40 },
        { text: "A star player at peak performance", points: 27 },
        { text: "A great trade deadline addition", points: 18 },
        { text: "A long winning streak going into playoffs", points: 10 },
        { text: "Team chemistry feels special this season", points: 5 },
      ],
    },
  ],

  // Day 12
  [
    {
      text: "Name something fans do at a game when the home team is losing badly",
      answers: [
        { text: "Boo loudly", points: 40 },
        { text: "Leave early", points: 28 },
        { text: "Chant for a trade or firing the coach", points: 18 },
        { text: "Check their phones and look disengaged", points: 9 },
        { text: "Ironically cheer a bad play", points: 5 },
      ],
    },
    {
      text: "Name something about a hockey mask that fans talk about",
      answers: [
        { text: "The crazy custom artwork on it", points: 42 },
        { text: "Scary or intimidating designs", points: 26 },
        { text: "The goalie's personality shown through the design", points: 18 },
        { text: "How much it costs", points: 8 },
        { text: "Tribute designs to hometown heroes", points: 6 },
      ],
    },
    {
      text: "Name a reason a player gets traded that fans find upsetting",
      answers: [
        { text: "He was a fan favorite and team leader", points: 42 },
        { text: "The return wasn't worth it at all", points: 26 },
        { text: "He wanted to stay but management moved him", points: 18 },
        { text: "He immediately excels with his new team", points: 10 },
        { text: "He was with the team for over a decade", points: 4 },
      ],
    },
    {
      text: "Name something every hockey team has in their locker room culture",
      answers: [
        { text: "A heavy fine system for rookie mistakes", points: 38 },
        { text: "A team playlist everyone argues about", points: 26 },
        { text: "Unwritten rules for vets vs rookies", points: 18 },
        { text: "A team meal tradition on the road", points: 12 },
        { text: "A running joke or nickname everyone uses", points: 6 },
      ],
    },
    {
      text: "Name something that makes watching hockey at home different from being there",
      answers: [
        { text: "You miss the speed and size of the players", points: 40 },
        { text: "You can hear the announcers not the crowd", points: 26 },
        { text: "You can rewatch goals immediately", points: 18 },
        { text: "No smell of fresh ice and arena food", points: 10 },
        { text: "You miss the crowd energy completely", points: 6 },
      ],
    },
  ],

  // Day 13
  [
    {
      text: "Name something a hockey team does to shake up a losing streak",
      answers: [
        { text: "Call up a player from the minors", points: 36 },
        { text: "Hold a players-only meeting", points: 28 },
        { text: "Shake up line combinations", points: 18 },
        { text: "Switch goalies", points: 12 },
        { text: "Change practice intensity", points: 6 },
      ],
    },
    {
      text: "Name something a hockey fan says after a tough playoff loss",
      answers: [
        { text: "We'll get them next year", points: 40 },
        { text: "The refs cost us this series", points: 28 },
        { text: "We had injuries or we would have won", points: 18 },
        { text: "Goalie was terrible when it mattered", points: 9 },
        { text: "We never should have traded away that player", points: 5 },
      ],
    },
    {
      text: "Name a famous hockey tradition fans participate in",
      answers: [
        { text: "Growing a playoff beard", points: 40 },
        { text: "Wearing all white for playoff whiteouts", points: 26 },
        { text: "Throwing octopuses on the ice in Detroit", points: 18 },
        { text: "Towel waving in the stands", points: 10 },
        { text: "Cowbells for the Florida Panthers", points: 6 },
      ],
    },
    {
      text: "Name something a star forward does to take over a game",
      answers: [
        { text: "Scores a highlight-reel goal", points: 40 },
        { text: "Picks up three points in one period", points: 27 },
        { text: "Creates plays out of nothing", points: 18 },
        { text: "Draws multiple penalties", points: 10 },
        { text: "Fights through multiple defenders to score", points: 5 },
      ],
    },
    {
      text: "Name something a hockey player does that shows pure toughness",
      answers: [
        { text: "Blocks a slap shot with their body", points: 42 },
        { text: "Gets stitches between periods and returns", points: 28 },
        { text: "Plays a full game on a broken hand", points: 18 },
        { text: "Takes a puck to the face and keeps going", points: 8 },
        { text: "Fights through a hit and still makes the pass", points: 4 },
      ],
    },
  ],

  // Day 14
  [
    {
      text: "Name something fans expect from a team with star power but no Cup wins",
      answers: [
        { text: "Heartbreaking early exits", points: 40 },
        { text: "Blaming the goalie or defense", points: 26 },
        { text: "A rebuild eventually", points: 18 },
        { text: "Trade rumors every deadline", points: 10 },
        { text: "Management shakeups every few years", points: 6 },
      ],
    },
    {
      text: "Name something that makes a playoff series go to 7 games",
      answers: [
        { text: "Two evenly matched teams", points: 40 },
        { text: "Both goalies absolutely standing on their heads", points: 28 },
        { text: "Home teams winning every game", points: 18 },
        { text: "Late-game comebacks erasing leads repeatedly", points: 10 },
        { text: "Neither team can score on the power play", points: 4 },
      ],
    },
    {
      text: "Name something that gets louder in a hockey arena in the third period",
      answers: [
        { text: "The goal horn and celebrations", points: 40 },
        { text: "Fan chanting when the team needs a goal", points: 28 },
        { text: "Boos when a ref makes a bad call", points: 18 },
        { text: "The building buzzing during an icing call", points: 8 },
        { text: "Cowbells and noisemakers", points: 6 },
      ],
    },
    {
      text: "Name something a team's general manager gets blamed for when they miss the playoffs",
      answers: [
        { text: "Not making the right trade at the deadline", points: 40 },
        { text: "Signing the wrong players to big contracts", points: 28 },
        { text: "Drafting poorly for years", points: 18 },
        { text: "Not firing the coach sooner", points: 10 },
        { text: "Keeping a bad goalie too long", points: 4 },
      ],
    },
    {
      text: "Name something about a game 7 that makes it feel like no other sporting event",
      answers: [
        { text: "One game decides everything", points: 42 },
        { text: "Players leave everything on the ice", points: 28 },
        { text: "The crowd is electric from puck drop", points: 16 },
        { text: "Coaching decisions feel magnified 10 times", points: 9 },
        { text: "A career can be defined by a single game", points: 5 },
      ],
    },
  ],

  // Day 15
  [
    {
      text: "Name a reason hockey in the southern United States surprises people",
      answers: [
        { text: "There are actually passionate fan bases there", points: 38 },
        { text: "Teams from Florida keep winning the Cup", points: 28 },
        { text: "Kids in warm states are now learning hockey", points: 18 },
        { text: "The arenas are always sold out for big games", points: 10 },
        { text: "Canadian fans move south and bring the culture", points: 6 },
      ],
    },
    {
      text: "Name something a team does in overtime to try to get the first goal",
      answers: [
        { text: "Send the best line out immediately", points: 40 },
        { text: "Play it conservative and wait for the right moment", points: 26 },
        { text: "Try to generate quick zone entries", points: 18 },
        { text: "Target the opposing goalie's weak side", points: 10 },
        { text: "Use the fourth line to grind them down first", points: 6 },
      ],
    },
    {
      text: "Name something a first-time hockey fan notices that surprises them",
      answers: [
        { text: "How fast the game actually is", points: 42 },
        { text: "How big and physical the players are", points: 26 },
        { text: "The sound the puck makes hitting the boards", points: 16 },
        { text: "How cold the arena is", points: 10 },
        { text: "How hard it is to follow the puck on TV", points: 6 },
      ],
    },
    {
      text: "Name something a team does to honor a legend who just retired",
      answers: [
        { text: "Retire their jersey number", points: 45 },
        { text: "Have a ceremony on the ice with fans present", points: 28 },
        { text: "Give them a role in the front office", points: 14 },
        { text: "Create a tribute video shown on the scoreboard", points: 9 },
        { text: "Rename part of the arena after them", points: 4 },
      ],
    },
    {
      text: "Name a type of hockey shot fans love to see",
      answers: [
        { text: "Slap shot from the point", points: 40 },
        { text: "Backhand roofed in tight", points: 26 },
        { text: "Saucer pass one-timer", points: 18 },
        { text: "Breakaway deke on the goalie", points: 12 },
        { text: "Tip-in from in front of the crease", points: 4 },
      ],
    },
  ],

  // Day 16
  [
    {
      text: "Name something a hockey player says in a post-game interview that sounds cliché",
      answers: [
        { text: "We take it one game at a time", points: 42 },
        { text: "Credit to my teammates", points: 26 },
        { text: "We just competed hard tonight", points: 18 },
        { text: "We got to get pucks to the net", points: 9 },
        { text: "It was a total team effort", points: 5 },
      ],
    },
    {
      text: "Name a reason a team's defense is considered elite",
      answers: [
        { text: "Almost never gives up odd-man rushes", points: 38 },
        { text: "Limits high-danger scoring chances", points: 28 },
        { text: "Quarterbacks the power play brilliantly", points: 18 },
        { text: "Physical enough to make forwards hate coming to the net", points: 10 },
        { text: "Shot-blocking numbers are league-leading", points: 6 },
      ],
    },
    {
      text: "Name something about the Stanley Cup that makes it more legendary than other trophies",
      answers: [
        { text: "Players get to take it home for a day", points: 42 },
        { text: "Every winner's name is engraved on it", points: 28 },
        { text: "It's been around since 1893", points: 16 },
        { text: "Players drink from it", points: 10 },
        { text: "It travels everywhere and has wild stories", points: 4 },
      ],
    },
    {
      text: "Name something that happens at a hockey game between periods",
      answers: [
        { text: "Ice resurfaces with the Zamboni", points: 45 },
        { text: "Fans rush to get food and drinks", points: 28 },
        { text: "T-shirt or prize toss to fans", points: 14 },
        { text: "On-ice entertainment like skating races", points: 9 },
        { text: "Stats and highlights shown on the scoreboard", points: 4 },
      ],
    },
    {
      text: "Name something a young hockey player does that gets them noticed",
      answers: [
        { text: "Scores a highlight goal on national TV", points: 40 },
        { text: "Outplays a veteran in a big game", points: 28 },
        { text: "Doesn't back down from a physical challenge", points: 18 },
        { text: "Puts up big numbers in their first season", points: 10 },
        { text: "Speaks confidently with veteran leadership", points: 4 },
      ],
    },
  ],

  // Day 17
  [
    {
      text: "Name something a hockey fan buys to show their team loyalty",
      answers: [
        { text: "A jersey with their favorite player's name", points: 42 },
        { text: "A team hat they wear everywhere", points: 26 },
        { text: "Car flags or bumper stickers", points: 18 },
        { text: "Season tickets or partial plans", points: 8 },
        { text: "Team scarf or beanie for playoff games", points: 6 },
      ],
    },
    {
      text: "Name something a big hockey rivalry has that a regular game doesn't",
      answers: [
        { text: "History and bad blood going back decades", points: 40 },
        { text: "Extra media hype for weeks beforehand", points: 26 },
        { text: "Both fanbases really despise each other", points: 18 },
        { text: "Players emotionally invested from the start", points: 10 },
        { text: "More fights and physical play from puck drop", points: 6 },
      ],
    },
    {
      text: "Name something coaches do when a player makes a costly mistake",
      answers: [
        { text: "Sit them on the bench", points: 42 },
        { text: "Reduce their ice time dramatically", points: 28 },
        { text: "Give them a look that says everything", points: 16 },
        { text: "Call them over and talk to them immediately", points: 10 },
        { text: "Use it as a teaching moment for the whole team", points: 4 },
      ],
    },
    {
      text: "Name something that defines a team's identity in the NHL",
      answers: [
        { text: "How physical they play", points: 38 },
        { text: "Their offensive or defensive style", points: 28 },
        { text: "The goalie who carries them", points: 18 },
        { text: "Their star player's personality", points: 10 },
        { text: "Their arena atmosphere", points: 6 },
      ],
    },
    {
      text: "Name something that always comes up in a hockey trade rumor",
      answers: [
        { text: "A disgruntled star player wanting out", points: 40 },
        { text: "A team needing a goalie upgrade", points: 26 },
        { text: "A massive contract that limits options", points: 18 },
        { text: "A team blowing it up before the deadline", points: 10 },
        { text: "Picking up a rental player for a Cup run", points: 6 },
      ],
    },
  ],

  // Day 18
  [
    {
      text: "Name something that separates a good hockey team from a great one",
      answers: [
        { text: "Elite goaltending when it matters most", points: 40 },
        { text: "Depth scoring beyond the top line", points: 28 },
        { text: "Ability to win in different styles of games", points: 18 },
        { text: "A coach who adjusts well between games", points: 9 },
        { text: "No panic when facing adversity", points: 5 },
      ],
    },
    {
      text: "Name something that changes when hockey moves from regular season to playoffs",
      answers: [
        { text: "Way more physical and intense play", points: 42 },
        { text: "Goalies suddenly become unstoppable", points: 26 },
        { text: "Refs let a lot more go", points: 18 },
        { text: "Every single game feels like a must-win", points: 10 },
        { text: "Line matchups and strategy become chess matches", points: 4 },
      ],
    },
    {
      text: "Name a thing hockey players do with the puck that non-fans think looks impossible",
      answers: [
        { text: "Dangle through three defenders", points: 40 },
        { text: "Pass tape-to-tape at full speed", points: 26 },
        { text: "Backhand one-timer into a small opening", points: 18 },
        { text: "Roof it top shelf from a sharp angle", points: 10 },
        { text: "Keep puck control while getting hit", points: 6 },
      ],
    },
    {
      text: "Name a reason fans hate when stars get suspended",
      answers: [
        { text: "The team is worse without them immediately", points: 42 },
        { text: "It always seems to happen at the worst time", points: 26 },
        { text: "The league's suspension logic makes no sense to fans", points: 18 },
        { text: "The other team gets an unfair advantage", points: 10 },
        { text: "Their merchandise sales tank that week", points: 4 },
      ],
    },
    {
      text: "Name something that happens after a team wins the Stanley Cup in their home city",
      answers: [
        { text: "A massive parade through downtown", points: 45 },
        { text: "The whole city shuts down to celebrate", points: 28 },
        { text: "Players are treated like gods for years", points: 14 },
        { text: "Season tickets sell out immediately for next year", points: 9 },
        { text: "Fans get the players' numbers or likenesses tattooed", points: 4 },
      ],
    },
  ],

  // Day 19
  [
    {
      text: "Name something fans think makes hockey the toughest sport",
      answers: [
        { text: "Playing on ice while getting hit", points: 40 },
        { text: "Fighting while skating at full speed", points: 26 },
        { text: "Playing through broken bones and cuts", points: 18 },
        { text: "The mental toughness required for goalies", points: 10 },
        { text: "Constant physical demands every shift", points: 6 },
      ],
    },
    {
      text: "Name a reason a coach gets fired mid-season in the NHL",
      answers: [
        { text: "Team not making playoffs despite talent", points: 40 },
        { text: "Lost the locker room completely", points: 28 },
        { text: "Bad losing streak with no signs of improvement", points: 18 },
        { text: "Conflict with the star player or GM", points: 10 },
        { text: "Strategic failures everyone can see", points: 4 },
      ],
    },
    {
      text: "Name something hockey fans do during a shootout",
      answers: [
        { text: "Hold their breath on every shot", points: 42 },
        { text: "Scream at the goalie to make the save", points: 26 },
        { text: "Jump up on a score", points: 18 },
        { text: "Debate who should shoot next", points: 10 },
        { text: "Grab the person next to them out of nerves", points: 4 },
      ],
    },
    {
      text: "Name a reason the NHL draft doesn't get as much attention as NBA or NFL drafts",
      answers: [
        { text: "Players take years to develop before impact", points: 40 },
        { text: "Less casual fan knowledge of junior hockey prospects", points: 26 },
        { text: "It's not as much of a spectacle event", points: 18 },
        { text: "Many top picks never pan out", points: 10 },
        { text: "Hockey doesn't have the same TV reach in the US", points: 6 },
      ],
    },
    {
      text: "Name something a power play goal gets attributed to",
      answers: [
        { text: "Great puck movement drawing the penalty killers out of position", points: 38 },
        { text: "A perfect one-timer setup", points: 28 },
        { text: "Screening the goalie perfectly", points: 18 },
        { text: "A deflection nobody could predict", points: 10 },
        { text: "The power play quarterback finding the open man", points: 6 },
      ],
    },
  ],

  // Day 20
  [
    {
      text: "Name something that makes an outdoor hockey game feel special",
      answers: [
        { text: "Snow falling on the ice mid-game", points: 40 },
        { text: "Playing in a baseball or football stadium", points: 28 },
        { text: "The nostalgia of pond hockey energy", points: 18 },
        { text: "Fans in winter gear creating a unique atmosphere", points: 10 },
        { text: "Hearing the sounds of real outdoor conditions", points: 4 },
      ],
    },
    {
      text: "Name something fans get excited about at the trade deadline",
      answers: [
        { text: "Their team getting a big rental player", points: 42 },
        { text: "A blockbuster deal nobody expected", points: 26 },
        { text: "A rival team making a terrible trade", points: 18 },
        { text: "Following every rumor on social media", points: 10 },
        { text: "A young player finally getting a chance elsewhere", points: 4 },
      ],
    },
    {
      text: "Name something that tells you a team is built for a Cup run",
      answers: [
        { text: "An elite hot goalie in the second half of the season", points: 40 },
        { text: "Great defensive structure limiting odd-man rushes", points: 26 },
        { text: "Top players producing when it counts", points: 18 },
        { text: "A depth lineup where even fourth liners contribute", points: 10 },
        { text: "A coach with playoff experience calling the shots", points: 6 },
      ],
    },
    {
      text: "Name something fans do in a game 7 that they wouldn't normally do",
      answers: [
        { text: "Wear the same lucky outfit from the last win", points: 38 },
        { text: "Watch standing up the whole game", points: 26 },
        { text: "Refuse to go to the bathroom so they don't jinx it", points: 20 },
        { text: "Call people to watch together at the last second", points: 10 },
        { text: "Stop eating their food because it felt like bad luck", points: 6 },
      ],
    },
    {
      text: "Name a hockey moment that breaks fans' hearts every time",
      answers: [
        { text: "Getting swept out of the playoffs", points: 40 },
        { text: "Losing game 7 at home", points: 28 },
        { text: "A star player announcing they're leaving as a free agent", points: 18 },
        { text: "A brutal overtime loss in the Stanley Cup Finals", points: 10 },
        { text: "Getting knocked out by a team you easily beat all year", points: 4 },
      ],
    },
  ],

  // Day 21
  [
    {
      text: "Name something hockey enforcers say in interviews that's surprisingly thoughtful",
      answers: [
        { text: "My job is to protect my teammates", points: 40 },
        { text: "I know what my role is and I embrace it", points: 28 },
        { text: "Fighting is part of the game's history and culture", points: 18 },
        { text: "It's an unwritten code that players respect", points: 9 },
        { text: "I'd rather fight than let my teammate get taken advantage of", points: 5 },
      ],
    },
    {
      text: "Name something fans chant at a rival player they hate",
      answers: [
        { text: "Their name with a mocking tone", points: 40 },
        { text: "Overrated, overrated", points: 28 },
        { text: "We don't want you, we don't want you", points: 16 },
        { text: "A specific insult related to their team or past", points: 10 },
        { text: "You're going home, you're going home", points: 6 },
      ],
    },
    {
      text: "Name something a top-line center does that separates them from everyone else",
      answers: [
        { text: "Wins face-offs in crucial situations", points: 38 },
        { text: "Makes passes nobody else sees", points: 28 },
        { text: "Plays equal time on power play and penalty kill", points: 18 },
        { text: "Creates offense but never takes a night off defensively", points: 10 },
        { text: "Controls the tempo of the entire line", points: 6 },
      ],
    },
    {
      text: "Name a reason fans think the NHL needs better marketing",
      answers: [
        { text: "Stars aren't household names like NBA or NFL players", points: 42 },
        { text: "Hard to follow on TV compared to other sports", points: 26 },
        { text: "Not enough coverage on mainstream sports shows", points: 18 },
        { text: "The game's biggest moments don't go as viral", points: 10 },
        { text: "Young fans aren't being reached early enough", points: 4 },
      ],
    },
    {
      text: "Name something a hockey player is expected to do that other athletes never have to",
      answers: [
        { text: "Get their own stitches and return immediately", points: 42 },
        { text: "Keep their emotions totally flat after big wins and losses", points: 24 },
        { text: "Accept being physically punished as part of the job", points: 18 },
        { text: "Skate thousands of miles over a season", points: 10 },
        { text: "Participate in a fight without being ejected", points: 6 },
      ],
    },
  ],

  // Day 22
  [
    {
      text: "Name something that makes a hockey rink feel different from other sports venues",
      answers: [
        { text: "The cold air hits you when you walk in", points: 42 },
        { text: "The smell of fresh ice", points: 26 },
        { text: "The sound of skates cutting into ice", points: 18 },
        { text: "The proximity of the action to the fans", points: 9 },
        { text: "The glass separating fans from the ice", points: 5 },
      ],
    },
    {
      text: "Name a reason a defenseman wins the Norris Trophy",
      answers: [
        { text: "Shuts down every top forward they face", points: 38 },
        { text: "Puts up huge offensive numbers from the blue line", points: 28 },
        { text: "Quarterbacks the best power play in the league", points: 18 },
        { text: "Leads the league in blocked shots", points: 10 },
        { text: "Controls the pace of the game from the back end", points: 6 },
      ],
    },
    {
      text: "Name something that makes a hockey comeback feel impossible until it happens",
      answers: [
        { text: "Being down three goals with 10 minutes left", points: 42 },
        { text: "The other goalie has been perfect all night", points: 26 },
        { text: "Your own power plays have been failing all game", points: 18 },
        { text: "The crowd has already started leaving", points: 9 },
        { text: "Your team's momentum was completely gone", points: 5 },
      ],
    },
    {
      text: "Name something a team's captain is expected to do in a rough patch",
      answers: [
        { text: "Lead by example with effort", points: 40 },
        { text: "Address the team in the locker room", points: 27 },
        { text: "Be the voice between players and coaches", points: 18 },
        { text: "Stay composed when younger players panic", points: 10 },
        { text: "Call out teammates when they're not giving enough", points: 5 },
      ],
    },
    {
      text: "Name something a hockey player does off the ice that surprises fans",
      answers: [
        { text: "Hunting and fishing trips in the offseason", points: 38 },
        { text: "Plays golf constantly", points: 26 },
        { text: "Deeply involved in charity work", points: 18 },
        { text: "Has a super normal suburban family life", points: 12 },
        { text: "Trains year-round even in summer", points: 6 },
      ],
    },
  ],

  // Day 23
  [
    {
      text: "Name something a team does to protect their goalie from getting run over",
      answers: [
        { text: "Their defensemen immediately retaliate", points: 42 },
        { text: "The enforcer steps in with a message", points: 26 },
        { text: "A line brawl breaks out", points: 18 },
        { text: "Coaches loudly protest to the refs", points: 9 },
        { text: "The team plays more aggressively next shift", points: 5 },
      ],
    },
    {
      text: "Name something fans notice when a team has bad chemistry",
      answers: [
        { text: "Players not backchecking for each other", points: 40 },
        { text: "No excitement after goals", points: 26 },
        { text: "Bench looks lifeless and disconnected", points: 18 },
        { text: "Stars blaming each other with body language", points: 10 },
        { text: "Line changes that feel random and desperate", points: 6 },
      ],
    },
    {
      text: "Name something the Florida Panthers introduced to NHL fan culture",
      answers: [
        { text: "Throwing rats on the ice in the 90s", points: 42 },
        { text: "Cowbells everywhere in the arena", points: 30 },
        { text: "A southern hockey fan base that gets wild", points: 16 },
        { text: "Making warm-weather hockey look serious", points: 8 },
        { text: "Multiple deep playoff runs nobody expected", points: 4 },
      ],
    },
    {
      text: "Name a reason a team goes all-in at the trade deadline",
      answers: [
        { text: "They think this might be their last chance with their core", points: 40 },
        { text: "Their star player is getting old and this is the window", points: 28 },
        { text: "They're already in a great playoff position", points: 18 },
        { text: "A rival team just made a big move", points: 9 },
        { text: "Ownership is demanding a Cup push this year", points: 5 },
      ],
    },
    {
      text: "Name something that gets louder in a hockey arena than anywhere else in sports",
      answers: [
        { text: "The goal horn and celebration", points: 42 },
        { text: "A playoff crowd when the home team scores in OT", points: 28 },
        { text: "Booing a referee's terrible call", points: 18 },
        { text: "Fans chanting in unison", points: 8 },
        { text: "The reaction when a fight breaks out", points: 4 },
      ],
    },
  ],

  // Day 24
  [
    {
      text: "Name something fans say makes hockey the best sport to watch live",
      answers: [
        { text: "The speed is unreal in person", points: 42 },
        { text: "You're so close to the action", points: 26 },
        { text: "The atmosphere is electric", points: 18 },
        { text: "Something happens every few seconds", points: 10 },
        { text: "Nothing beats a playoff game atmosphere in person", points: 4 },
      ],
    },
    {
      text: "Name something a team does when they want to send a message to a rival",
      answers: [
        { text: "Hit their best player on the first shift", points: 40 },
        { text: "Score in the first minute of the game", points: 27 },
        { text: "Start a fight after the opening face-off", points: 18 },
        { text: "Get in the goalie's head early", points: 10 },
        { text: "Dominate puck possession and make them chase it", points: 5 },
      ],
    },
    {
      text: "Name a reason a star player requests a trade in the NHL",
      answers: [
        { text: "Team isn't a contender and he wants to win", points: 42 },
        { text: "Conflict with the coach or GM", points: 26 },
        { text: "Wants to be closer to home", points: 16 },
        { text: "Contract disputes that dragged on too long", points: 10 },
        { text: "Younger players getting more attention and he feels disrespected", points: 6 },
      ],
    },
    {
      text: "Name something about a hockey player's appearance on the ice that fans notice",
      answers: [
        { text: "Their visor or no-visor choice", points: 38 },
        { text: "Missing teeth and proud of it", points: 26 },
        { text: "Tape job on their stick", points: 18 },
        { text: "Number of stitches visible on their face", points: 12 },
        { text: "Their skating stride and style", points: 6 },
      ],
    },
    {
      text: "Name something that's changed about hockey in the last 20 years",
      answers: [
        { text: "Way more skill and speed, less fighting", points: 40 },
        { text: "Analytics are now part of team strategy", points: 28 },
        { text: "More European and international players", points: 18 },
        { text: "Equipment has dramatically improved", points: 10 },
        { text: "Social media changed how players are perceived", points: 4 },
      ],
    },
  ],

  // Day 25
  [
    {
      text: "Name something a hockey goalie is superstitious about",
      answers: [
        { text: "Not letting anyone touch their equipment", points: 40 },
        { text: "A specific warm-up ritual they never skip", points: 27 },
        { text: "Tapping the posts before every period", points: 18 },
        { text: "Wearing the same undershirt all through a winning streak", points: 10 },
        { text: "A specific thing they eat or drink before games", points: 5 },
      ],
    },
    {
      text: "Name something fans love about a team built on defensive structure",
      answers: [
        { text: "Watching them suffocate talented offensive teams", points: 38 },
        { text: "Low-scoring games that feel tense every second", points: 26 },
        { text: "The goalie only needing to make 15 saves to win", points: 18 },
        { text: "Knowing they can always win a grinding game", points: 12 },
        { text: "The satisfaction of a 1-0 playoff win", points: 6 },
      ],
    },
    {
      text: "Name something about a hockey player's toughness that non-hockey fans find shocking",
      answers: [
        { text: "Getting 10 stitches between periods and playing again", points: 42 },
        { text: "Breaking a finger and playing the rest of the game", points: 28 },
        { text: "Playing with a fractured foot for weeks", points: 16 },
        { text: "Taking a puck to the face and refusing to come out", points: 10 },
        { text: "Returning to the ice after a high hit seconds later", points: 4 },
      ],
    },
    {
      text: "Name something a fan does to prepare for a playoff game at home",
      answers: [
        { text: "Puts on the lucky jersey they haven't washed", points: 40 },
        { text: "Invites everyone over for a watch party", points: 26 },
        { text: "Gets snacks and drinks set up before puck drop", points: 18 },
        { text: "Refuses to sit in a different seat than last time they won", points: 10 },
        { text: "Mutes all social media notifications so they don't get spoiled", points: 6 },
      ],
    },
    {
      text: "Name something that happens when a team scores five goals in one period",
      answers: [
        { text: "The opposing goalie gets pulled immediately", points: 42 },
        { text: "The crowd is completely electric", points: 25 },
        { text: "Bench is losing their minds celebrating", points: 18 },
        { text: "Fans start discussing a historic comeback against this team", points: 10 },
        { text: "Social media goes wild instantly", points: 5 },
      ],
    },
  ],

  // Day 26
  [
    {
      text: "Name a reason fans dislike a referee in the NHL",
      answers: [
        { text: "Missing an obvious penalty that led to a goal against", points: 42 },
        { text: "Calling a soft penalty in a crucial moment", points: 26 },
        { text: "Seeming to favor the other team all night", points: 18 },
        { text: "Terrible positioning and missing key plays", points: 9 },
        { text: "Inconsistent calling all game long", points: 5 },
      ],
    },
    {
      text: "Name something that makes a hockey playoff series feel personal between two teams",
      answers: [
        { text: "A dirty hit from a previous matchup", points: 40 },
        { text: "Two star players with a public beef", points: 28 },
        { text: "One team knocked the other out the year before", points: 18 },
        { text: "A controversial call that ended the previous series", points: 10 },
        { text: "Trash talk that got picked up on TV", points: 4 },
      ],
    },
    {
      text: "Name something fans expect from a rookie playing in the playoffs for the first time",
      answers: [
        { text: "Nerves affecting their early play", points: 38 },
        { text: "A big moment that announces their arrival", points: 28 },
        { text: "Being targeted by veteran opponents", points: 18 },
        { text: "Getting quieter ice time than they're used to", points: 10 },
        { text: "Learning what playoff hockey really is", points: 6 },
      ],
    },
    {
      text: "Name something about a hockey team's home ice crowd that intimidates visiting teams",
      answers: [
        { text: "The crowd is deafening on every big play", points: 42 },
        { text: "The building shakes when the home team scores", points: 26 },
        { text: "Every bad play gets loudly booed", points: 18 },
        { text: "The energy never drops even in a close game", points: 9 },
        { text: "Fan traditions that have existed for decades", points: 5 },
      ],
    },
    {
      text: "Name something a hockey player does to stay sharp in the offseason",
      answers: [
        { text: "Skating every day to maintain edge work", points: 40 },
        { text: "Playing pickup or summer league hockey", points: 27 },
        { text: "Working on specific weaknesses from last season", points: 18 },
        { text: "Staying in peak physical condition with gym work", points: 10 },
        { text: "Watching film on themselves and opponents", points: 5 },
      ],
    },
  ],

  // Day 27
  [
    {
      text: "Name something a team does to earn the reputation of a bully team",
      answers: [
        { text: "Hits everything that moves regardless of situation", points: 40 },
        { text: "Has multiple enforcers on the roster at once", points: 27 },
        { text: "Targets opponents' smaller skill players", points: 18 },
        { text: "Fights after every whistle when losing", points: 10 },
        { text: "Their fans are known for being hostile", points: 5 },
      ],
    },
    {
      text: "Name something that happens when a well-known hockey player retires",
      answers: [
        { text: "A tribute video and ceremony at every arena", points: 40 },
        { text: "Social media flooded with memories and thanks", points: 26 },
        { text: "Debates start about Hall of Fame worthiness", points: 18 },
        { text: "His jersey potentially getting retired by his team", points: 10 },
        { text: "Fans buy commemorative merchandise", points: 6 },
      ],
    },
    {
      text: "Name something a hockey player does in the face-off circle that looks strategic",
      answers: [
        { text: "Positions their stick to anticipate the drop", points: 40 },
        { text: "Talks or stares down the opponent to get in their head", points: 26 },
        { text: "Cheats slightly to see if the ref notices", points: 18 },
        { text: "Changes their technique based on who they're facing", points: 10 },
        { text: "Looks at where their teammates are before the puck drops", points: 6 },
      ],
    },
    {
      text: "Name something that makes a hockey arena feel legendary",
      answers: [
        { text: "Decades of championship banners hanging from the rafters", points: 42 },
        { text: "Retired jersey numbers of hall of famers", points: 28 },
        { text: "Historic sellout streaks for years on end", points: 16 },
        { text: "Iconic goal celebrations and moments that happened there", points: 9 },
        { text: "The noise level in playoff games", points: 5 },
      ],
    },
    {
      text: "Name a reason a hockey team's power play is the best in the league",
      answers: [
        { text: "A brilliant quarterback on the blue line who sees the whole ice", points: 40 },
        { text: "Multiple elite shooters to choose from", points: 27 },
        { text: "Great puck movement that gets the PK scrambling", points: 18 },
        { text: "A net-front player who always finds deflections", points: 10 },
        { text: "Practiced chemistry that makes every pass crisp", points: 5 },
      ],
    },
  ],

  // Day 28
  [
    {
      text: "Name something fans say defines the Montreal Canadiens fanbase",
      answers: [
        { text: "Most passionate hockey fans in the world", points: 40 },
        { text: "Never satisfied because of the Cup history", points: 26 },
        { text: "Bilingual culture makes it unique in all of sports", points: 18 },
        { text: "The Forum legacy and arena history", points: 10 },
        { text: "Expectations are always impossibly high", points: 6 },
      ],
    },
    {
      text: "Name something about hockey strategy that casual fans don't fully understand",
      answers: [
        { text: "Line matching and deployment against opponents", points: 38 },
        { text: "The neutral zone trap and defensive systems", points: 26 },
        { text: "Why specific players are on the ice late in a tie game", points: 18 },
        { text: "How the power play is structured beyond just shooting", points: 12 },
        { text: "The role of a defensive defenseman versus an offensive one", points: 6 },
      ],
    },
    {
      text: "Name something that indicates a player has true star quality in the NHL",
      answers: [
        { text: "They show up in the biggest games consistently", points: 42 },
        { text: "Teams build entire game plans around stopping them", points: 26 },
        { text: "They produce even when playing injured", points: 18 },
        { text: "Young fans buy their jersey everywhere", points: 10 },
        { text: "They carry the team in overtime situations", points: 4 },
      ],
    },
    {
      text: "Name something a hockey team does after clinching a playoff spot",
      answers: [
        { text: "Celebrate in the locker room with champagne", points: 40 },
        { text: "Start studying their likely first-round opponent", points: 26 },
        { text: "Start resting key players for the stretch run", points: 18 },
        { text: "Fans buy playoff tickets immediately", points: 10 },
        { text: "Media starts making Cup predictions", points: 6 },
      ],
    },
    {
      text: "Name something hockey players do after eliminating a team from the playoffs",
      answers: [
        { text: "Line up for handshakes with the opponents", points: 45 },
        { text: "Celebrate on the ice with the whole team", points: 28 },
        { text: "Hug their teammates and coaches immediately", points: 14 },
        { text: "Pour water or sports drinks on the coaching staff", points: 9 },
        { text: "Talk respectfully about the team they just beat", points: 4 },
      ],
    },
  ],

  // Day 29
  [
    {
      text: "Name something that happens when two goalies have an incredible game against each other",
      answers: [
        { text: "It goes to overtime or a shootout", points: 42 },
        { text: "Both get named stars of the game", points: 28 },
        { text: "Fans forget which team they're rooting for and just appreciate the saves", points: 16 },
        { text: "Analysts call it a classic duel for years after", points: 10 },
        { text: "The whole game is defined by goalie play not offense", points: 4 },
      ],
    },
    {
      text: "Name something a hockey team does when they're in a must-win game",
      answers: [
        { text: "Play with a desperate energy from the first shift", points: 40 },
        { text: "Give the star players extra ice time", points: 27 },
        { text: "Take more risks offensively than usual", points: 18 },
        { text: "Coach gets more animated and intense on the bench", points: 10 },
        { text: "Pull the goalie earlier than normal if behind", points: 5 },
      ],
    },
    {
      text: "Name a physical thing fans can buy that shows they follow the NHL",
      answers: [
        { text: "An authentic game jersey", points: 42 },
        { text: "A hockey stick signed by a player", points: 26 },
        { text: "A team puck or mini Stanley Cup replica", points: 18 },
        { text: "Season tickets or a partial ticket plan", points: 10 },
        { text: "A goalie mask replica with custom paint", points: 4 },
      ],
    },
    {
      text: "Name something a young player does to earn respect from veteran teammates",
      answers: [
        { text: "Doesn't talk too much or take up too much space", points: 40 },
        { text: "Plays with max effort every single shift", points: 28 },
        { text: "Sticks up for themselves when challenged by veterans", points: 18 },
        { text: "Does the small things right without being asked", points: 10 },
        { text: "Handles early failures without pouting", points: 4 },
      ],
    },
    {
      text: "Name a reason the Stanley Cup playoffs are considered the best in professional sports",
      answers: [
        { text: "Best of 7 series with no margin for error", points: 40 },
        { text: "Overtime sudden death produces unforgettable moments", points: 28 },
        { text: "Players visibly sacrifice their bodies every game", points: 18 },
        { text: "The history and tradition behind it is unmatched", points: 10 },
        { text: "Any team can beat any team on a given night", points: 4 },
      ],
    },
  ],

  // Day 30
  [
    {
      text: "Name something about hockey that makes it feel like a religion in Canada",
      answers: [
        { text: "Kids start skating before they can walk", points: 40 },
        { text: "Hockey games are appointment viewing for the whole family", points: 26 },
        { text: "Stanley Cup wins feel like national holidays", points: 18 },
        { text: "Debates about hockey happen everywhere you go", points: 10 },
        { text: "Players who make it are treated like legends forever", points: 6 },
      ],
    },
    {
      text: "Name something a dominant team does to opponents late in a series",
      answers: [
        { text: "Wears them down physically every game", points: 40 },
        { text: "Makes them doubt their own goalie", points: 26 },
        { text: "Scores first in every game and forces them to chase", points: 18 },
        { text: "Controls the pace so well opponents can never get comfortable", points: 10 },
        { text: "Stars get better as the series goes on while opponents fade", points: 6 },
      ],
    },
    {
      text: "Name something a hockey coach does between periods when his team is losing badly",
      answers: [
        { text: "Delivers an intense speech about effort and pride", points: 42 },
        { text: "Shakes up the line combinations completely", points: 26 },
        { text: "Calls out specific players for not doing their job", points: 16 },
        { text: "Pulls the goalie for the backup", points: 10 },
        { text: "Goes back to the whiteboard and adjusts the game plan", points: 6 },
      ],
    },
    {
      text: "Name something that makes the hockey playoffs unlike the regular season in every way",
      answers: [
        { text: "Every game feels like life or death", points: 42 },
        { text: "Players play hurt and don't tell anyone", points: 26 },
        { text: "Coaching adjustments happen every single period", points: 16 },
        { text: "The crowd noise is on another level entirely", points: 10 },
        { text: "Line matchups become obsessive chess moves", points: 6 },
      ],
    },
    {
      text: "We asked 100 sports fans: Name a word that describes playoff hockey",
      answers: [
        { text: "Intense", points: 38 },
        { text: "Brutal", points: 26 },
        { text: "Electric", points: 18 },
        { text: "Physical", points: 12 },
        { text: "Unpredictable", points: 6 },
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
