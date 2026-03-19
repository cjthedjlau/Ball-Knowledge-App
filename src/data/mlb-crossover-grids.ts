// MLB Crossover Grid seed data — 30 grids

interface GridHeader {
  type: 'team' | 'award' | 'stat';
  label: string;
  value: string;
}
interface GridCell {
  rowIndex: number;
  colIndex: number;
  validPlayers: string[];
}
interface CrossoverGrid {
  league: string;
  rows: [GridHeader, GridHeader, GridHeader];
  cols: [GridHeader, GridHeader, GridHeader];
  cells: GridCell[];
}

const MLB_GRIDS: CrossoverGrid[] = [
  // ─── Grid 1 ──────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'New York Yankees', value: 'yankees' },
      { type: 'team', label: 'Boston Red Sox', value: 'red-sox' },
      { type: 'award', label: 'MLB MVP', value: 'mlb-mvp' },
    ],
    cols: [
      { type: 'team', label: 'Los Angeles Dodgers', value: 'dodgers' },
      { type: 'stat', label: '40+ HR Season', value: '40hr' },
      { type: 'award', label: 'World Series Champion', value: 'ws-champ' },
    ],
    cells: [
      // Yankees + Dodgers (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Rickey Henderson', 'Kevin Brown', 'Darryl Strawberry', 'Jeff Weaver', 'Brian Dorsett'] },
      // Yankees + 40+ HR Season
      { rowIndex: 0, colIndex: 1, validPlayers: ['Babe Ruth', 'Mickey Mantle', 'Roger Maris', 'Alex Rodriguez', 'Aaron Judge'] },
      // Yankees + World Series Champion
      { rowIndex: 0, colIndex: 2, validPlayers: ['Derek Jeter', 'Mariano Rivera', 'Babe Ruth', 'Lou Gehrig', 'Yogi Berra'] },
      // Red Sox + Dodgers (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Manny Ramirez', 'Nomar Garciaparra', 'Adrian Gonzalez', 'Derek Lowe', 'Dave Roberts'] },
      // Red Sox + 40+ HR Season
      { rowIndex: 1, colIndex: 1, validPlayers: ['David Ortiz', 'Manny Ramirez', 'Jimmie Foxx', 'Ted Williams', 'Carl Yastrzemski'] },
      // Red Sox + World Series Champion
      { rowIndex: 1, colIndex: 2, validPlayers: ['David Ortiz', 'Manny Ramirez', 'Pedro Martinez', 'Curt Schilling', 'Dustin Pedroia'] },
      // MVP + Dodgers
      { rowIndex: 2, colIndex: 0, validPlayers: ['Clayton Kershaw', 'Sandy Koufax', 'Kirk Gibson', 'Steve Garvey', 'Cody Bellinger'] },
      // MVP + 40+ HR Season
      { rowIndex: 2, colIndex: 1, validPlayers: ['Babe Ruth', 'Mickey Mantle', 'Alex Rodriguez', 'Barry Bonds', 'Hank Aaron'] },
      // MVP + World Series Champion
      { rowIndex: 2, colIndex: 2, validPlayers: ['Babe Ruth', 'Mickey Mantle', 'Derek Jeter', 'Frank Robinson', 'Willie Stargell'] },
    ],
  },

  // ─── Grid 2 ──────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'Chicago Cubs', value: 'cubs' },
      { type: 'team', label: 'St. Louis Cardinals', value: 'cardinals' },
      { type: 'award', label: 'Cy Young Award', value: 'cy-young' },
    ],
    cols: [
      { type: 'team', label: 'Houston Astros', value: 'astros' },
      { type: 'stat', label: '.300+ Season Average', value: '300avg' },
      { type: 'award', label: 'Gold Glove', value: 'gold-glove' },
    ],
    cells: [
      // Cubs + Astros
      { rowIndex: 0, colIndex: 0, validPlayers: ['Greg Maddux', 'Carlos Zambrano', 'Carlos Lee', 'Bill Madlock', 'Jon Lester'] },
      // Cubs + .300+ Season Average
      { rowIndex: 0, colIndex: 1, validPlayers: ['Ernie Banks', 'Billy Williams', 'Ryne Sandberg', 'Aramis Ramirez', 'Kris Bryant'] },
      // Cubs + Gold Glove
      { rowIndex: 0, colIndex: 2, validPlayers: ['Ryne Sandberg', 'Andre Dawson', 'Greg Maddux', 'Mark Grace', 'Javier Baez'] },
      // Cardinals + Astros
      { rowIndex: 1, colIndex: 0, validPlayers: ['Lance Berkman', 'Carlos Beltran', 'Gerrit Cole', 'Jeff Bagwell', 'Mark McGwire'] },
      // Cardinals + .300+ Season Average
      { rowIndex: 1, colIndex: 1, validPlayers: ['Stan Musial', 'Albert Pujols', 'Rogers Hornsby', 'Joe Medwick', 'Yadier Molina'] },
      // Cardinals + Gold Glove
      { rowIndex: 1, colIndex: 2, validPlayers: ['Ozzie Smith', 'Yadier Molina', 'Jim Edmonds', 'Bob Gibson', 'Keith Hernandez'] },
      // Cy Young + Astros
      { rowIndex: 2, colIndex: 0, validPlayers: ['Roger Clemens', 'Mike Scott', 'Dallas Keuchel', 'Justin Verlander', 'Gerrit Cole'] },
      // Cy Young + .300+ Season Average
      { rowIndex: 2, colIndex: 1, validPlayers: ['Bob Gibson', 'Don Newcombe', 'Dennis Eckersley', 'Denny McLain', 'Sandy Koufax'] },
      // Cy Young + Gold Glove
      { rowIndex: 2, colIndex: 2, validPlayers: ['Greg Maddux', 'Bob Gibson', 'Jim Palmer', 'Ron Guidry', 'Dallas Keuchel'] },
    ],
  },

  // ─── Grid 3 ──────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'San Francisco Giants', value: 'giants' },
      { type: 'team', label: 'Atlanta Braves', value: 'braves' },
      { type: 'stat', label: '200+ Hits Season', value: '200hits' },
    ],
    cols: [
      { type: 'team', label: 'New York Mets', value: 'mets' },
      { type: 'award', label: 'Silver Slugger', value: 'silver-slugger' },
      { type: 'stat', label: '100+ RBI Season', value: '100rbi' },
    ],
    cells: [
      // Giants + Mets
      { rowIndex: 0, colIndex: 0, validPlayers: ['Willie Mays', 'Carlos Beltran', 'Darryl Strawberry', 'Joe Panik', 'Armando Benitez'] },
      // Giants + Silver Slugger
      { rowIndex: 0, colIndex: 1, validPlayers: ['Barry Bonds', 'Will Clark', 'Buster Posey', 'Jeff Kent', 'Matt Williams'] },
      // Giants + 100+ RBI Season
      { rowIndex: 0, colIndex: 2, validPlayers: ['Barry Bonds', 'Willie Mays', 'Willie McCovey', 'Jeff Kent', 'Matt Williams'] },
      // Braves + Mets
      { rowIndex: 1, colIndex: 0, validPlayers: ['Tom Glavine', 'John Smoltz', 'Gary Sheffield', 'Jason Bay', 'Bartolo Colon'] },
      // Braves + Silver Slugger
      { rowIndex: 1, colIndex: 1, validPlayers: ['Chipper Jones', 'Hank Aaron', 'Dale Murphy', 'Freddie Freeman', 'Ronald Acuna Jr'] },
      // Braves + 100+ RBI Season
      { rowIndex: 1, colIndex: 2, validPlayers: ['Hank Aaron', 'Chipper Jones', 'Dale Murphy', 'Freddie Freeman', 'Andruw Jones'] },
      // 200+ Hits + Mets
      { rowIndex: 2, colIndex: 0, validPlayers: ['Jose Reyes', 'Lance Johnson', 'Edgardo Alfonzo', 'John Olerud', 'Steve Henderson'] },
      // 200+ Hits + Silver Slugger
      { rowIndex: 2, colIndex: 1, validPlayers: ['Ichiro Suzuki', 'Wade Boggs', 'Derek Jeter', 'Tony Gwynn', 'Albert Pujols'] },
      // 200+ Hits + 100+ RBI Season
      { rowIndex: 2, colIndex: 2, validPlayers: ['Albert Pujols', 'Derek Jeter', 'Alex Rodriguez', 'Lou Gehrig', 'Jimmie Foxx'] },
    ],
  },

  // ─── Grid 4 ──────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'Philadelphia Phillies', value: 'phillies' },
      { type: 'team', label: 'Cincinnati Reds', value: 'reds' },
      { type: 'stat', label: '30+ SB Season', value: '30sb' },
    ],
    cols: [
      { type: 'team', label: 'Oakland Athletics', value: 'athletics' },
      { type: 'award', label: 'Rookie of the Year', value: 'roy' },
      { type: 'stat', label: '40+ HR Season', value: '40hr' },
    ],
    cells: [
      // Phillies + Athletics
      { rowIndex: 0, colIndex: 0, validPlayers: ['Jimmie Foxx', 'Lefty Grove', 'Dick Allen', 'Bobby Shantz', 'Pete Alexander'] },
      // Phillies + Rookie of the Year
      { rowIndex: 0, colIndex: 1, validPlayers: ['Dick Allen', 'Jack Sanford', 'Ryan Howard', 'Scott Rolen', 'Bryce Harper'] },
      // Phillies + 40+ HR Season
      { rowIndex: 0, colIndex: 2, validPlayers: ['Ryan Howard', 'Mike Schmidt', 'Jim Thome', 'Dick Allen', 'Chuck Klein'] },
      // Reds + Athletics
      { rowIndex: 1, colIndex: 0, validPlayers: ['Jose Canseco', 'Dave Parker', 'Dave Concepcion', 'Eric Davis', 'Danny Tartabull'] },
      // Reds + Rookie of the Year
      { rowIndex: 1, colIndex: 1, validPlayers: ['Frank Robinson', 'Pete Rose', 'Pat Zachry', 'Chris Sabo', 'Jonathan India'] },
      // Reds + 40+ HR Season
      { rowIndex: 1, colIndex: 2, validPlayers: ['George Foster', 'Greg Vaughn', 'Adam Dunn', 'Ted Kluszewski', 'Frank Robinson'] },
      // 30+ SB + Athletics
      { rowIndex: 2, colIndex: 0, validPlayers: ['Rickey Henderson', 'Bert Campaneris', 'Billy North', 'Jose Canseco', 'Miguel Tejada'] },
      // 30+ SB + Rookie of the Year
      { rowIndex: 2, colIndex: 1, validPlayers: ['Pete Rose', 'Ichiro Suzuki', 'Fernando Valenzuela', 'Vince Coleman', 'Tim Raines'] },
      // 30+ SB + 40+ HR Season
      { rowIndex: 2, colIndex: 2, validPlayers: ['Barry Bonds', 'Alex Rodriguez', 'Jose Canseco', 'Alfonso Soriano', 'Shohei Ohtani'] },
    ],
  },

  // ─── Grid 5 ──────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'Detroit Tigers', value: 'tigers' },
      { type: 'team', label: 'Baltimore Orioles', value: 'orioles' },
      { type: 'award', label: 'All-Star Selection', value: 'all-star' },
    ],
    cols: [
      { type: 'team', label: 'New York Yankees', value: 'yankees' },
      { type: 'stat', label: '300+ K Season', value: '300k' },
      { type: 'award', label: 'MLB MVP', value: 'mlb-mvp' },
    ],
    cells: [
      // Tigers + Yankees
      { rowIndex: 0, colIndex: 0, validPlayers: ['Cecil Fielder', 'David Wells', 'Gary Sheffield', 'Pudge Rodriguez', 'Willie Horton'] },
      // Tigers + 300+ K Season
      { rowIndex: 0, colIndex: 1, validPlayers: ['Justin Verlander', 'Denny McLain', 'Mickey Lolich', 'Mark Fidrych', 'Jack Morris'] },
      // Tigers + MVP
      { rowIndex: 0, colIndex: 2, validPlayers: ['Miguel Cabrera', 'Hank Greenberg', 'Hal Newhouser', 'Denny McLain', 'Willie Hernandez'] },
      // Orioles + Yankees
      { rowIndex: 1, colIndex: 0, validPlayers: ['David Wells', 'Mike Mussina', 'Nelson Cruz', 'Scott McGregor', 'Don Baylor'] },
      // Orioles + 300+ K Season
      { rowIndex: 1, colIndex: 1, validPlayers: ['Mike Mussina', 'Jim Palmer', 'Steve Stone', 'Erik Bedard', 'Corbin Burnes'] },
      // Orioles + MVP
      { rowIndex: 1, colIndex: 2, validPlayers: ['Frank Robinson', 'Cal Ripken Jr', 'Boog Powell', 'Brooks Robinson', 'Miguel Tejada'] },
      // All-Star + Yankees
      { rowIndex: 2, colIndex: 0, validPlayers: ['Derek Jeter', 'Babe Ruth', 'Mickey Mantle', 'Joe DiMaggio', 'Mariano Rivera'] },
      // All-Star + 300+ K Season
      { rowIndex: 2, colIndex: 1, validPlayers: ['Nolan Ryan', 'Randy Johnson', 'Pedro Martinez', 'Roger Clemens', 'Justin Verlander'] },
      // All-Star + MVP
      { rowIndex: 2, colIndex: 2, validPlayers: ['Mike Trout', 'Barry Bonds', 'Hank Aaron', 'Willie Mays', 'Mickey Mantle'] },
    ],
  },

  // ─── Grid 6 ──────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'Los Angeles Dodgers', value: 'dodgers' },
      { type: 'team', label: 'Pittsburgh Pirates', value: 'pirates' },
      { type: 'stat', label: '15+ Wins Season', value: '15wins' },
    ],
    cols: [
      { type: 'team', label: 'San Francisco Giants', value: 'giants' },
      { type: 'award', label: 'Cy Young Award', value: 'cy-young' },
      { type: 'stat', label: '200+ Hits Season', value: '200hits' },
    ],
    cells: [
      // Dodgers + Giants (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Juan Marichal', 'Dusty Baker', 'Brett Butler', 'Jeff Kent', 'Shea Hillenbrand'] },
      // Dodgers + Cy Young
      { rowIndex: 0, colIndex: 1, validPlayers: ['Sandy Koufax', 'Don Drysdale', 'Clayton Kershaw', 'Fernando Valenzuela', 'Orel Hershiser'] },
      // Dodgers + 200+ Hits Season
      { rowIndex: 0, colIndex: 2, validPlayers: ['Steve Garvey', 'Maury Wills', 'Tommy Davis', 'Willie Davis', 'Dee Gordon'] },
      // Pirates + Giants
      { rowIndex: 1, colIndex: 0, validPlayers: ['Barry Bonds', 'Bobby Bonilla', 'Jason Bay', 'Aramis Ramirez', 'Jason Schmidt'] },
      // Pirates + Cy Young
      { rowIndex: 1, colIndex: 1, validPlayers: ['Vernon Law', 'Doug Drabek', 'John Candelaria', 'Rick Reuschel', 'Mark Melancon'] },
      // Pirates + 200+ Hits Season
      { rowIndex: 1, colIndex: 2, validPlayers: ['Roberto Clemente', 'Paul Waner', 'Lloyd Waner', 'Matty Alou', 'Dave Parker'] },
      // 15+ Wins + Giants
      { rowIndex: 2, colIndex: 0, validPlayers: ['Juan Marichal', 'Gaylord Perry', 'Christy Mathewson', 'Carl Hubbell', 'Tim Lincecum'] },
      // 15+ Wins + Cy Young
      { rowIndex: 2, colIndex: 1, validPlayers: ['Greg Maddux', 'Roger Clemens', 'Tom Seaver', 'Steve Carlton', 'Randy Johnson'] },
      // 15+ Wins + 200+ Hits Season
      { rowIndex: 2, colIndex: 2, validPlayers: ['Bob Gibson', 'Don Drysdale', 'Denny McLain', 'Robin Roberts', 'Wes Ferrell'] },
    ],
  },

  // ─── Grid 7 ──────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'Houston Astros', value: 'astros' },
      { type: 'team', label: 'New York Yankees', value: 'yankees' },
      { type: 'award', label: 'Gold Glove', value: 'gold-glove' },
    ],
    cols: [
      { type: 'team', label: 'Atlanta Braves', value: 'braves' },
      { type: 'stat', label: '100+ RBI Season', value: '100rbi' },
      { type: 'award', label: 'All-Star Selection', value: 'all-star' },
    ],
    cells: [
      // Astros + Braves
      { rowIndex: 0, colIndex: 0, validPlayers: ['Carlos Beltran', 'Jeff Bagwell', 'Evan Gattis', 'Greg Maddux', 'Terry Pendleton'] },
      // Astros + 100+ RBI Season
      { rowIndex: 0, colIndex: 1, validPlayers: ['Jeff Bagwell', 'Lance Berkman', 'Carlos Lee', 'Moises Alou', 'Craig Biggio'] },
      // Astros + All-Star
      { rowIndex: 0, colIndex: 2, validPlayers: ['Craig Biggio', 'Jeff Bagwell', 'Nolan Ryan', 'Jose Altuve', 'Lance Berkman'] },
      // Yankees + Braves
      { rowIndex: 1, colIndex: 0, validPlayers: ['Gary Sheffield', 'Andruw Jones', 'David Justice', 'Dion James', 'Kenny Lofton'] },
      // Yankees + 100+ RBI Season
      { rowIndex: 1, colIndex: 1, validPlayers: ['Babe Ruth', 'Lou Gehrig', 'Joe DiMaggio', 'Mickey Mantle', 'Alex Rodriguez'] },
      // Yankees + All-Star
      { rowIndex: 1, colIndex: 2, validPlayers: ['Derek Jeter', 'Mariano Rivera', 'Babe Ruth', 'Mickey Mantle', 'Joe DiMaggio'] },
      // Gold Glove + Braves
      { rowIndex: 2, colIndex: 0, validPlayers: ['Andruw Jones', 'Dale Murphy', 'Greg Maddux', 'Tom Glavine', 'Hank Aaron'] },
      // Gold Glove + 100+ RBI Season
      { rowIndex: 2, colIndex: 1, validPlayers: ['Ken Griffey Jr', 'Roberto Clemente', 'Keith Hernandez', 'Ichiro Suzuki', 'Nolan Arenado'] },
      // Gold Glove + All-Star
      { rowIndex: 2, colIndex: 2, validPlayers: ['Roberto Clemente', 'Ozzie Smith', 'Brooks Robinson', 'Ken Griffey Jr', 'Willie Mays'] },
    ],
  },

  // ─── Grid 8 ──────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'Boston Red Sox', value: 'red-sox' },
      { type: 'team', label: 'Chicago Cubs', value: 'cubs' },
      { type: 'stat', label: '300+ K Season', value: '300k' },
    ],
    cols: [
      { type: 'team', label: 'Philadelphia Phillies', value: 'phillies' },
      { type: 'award', label: 'World Series Champion', value: 'ws-champ' },
      { type: 'stat', label: '30+ SB Season', value: '30sb' },
    ],
    cells: [
      // Red Sox + Phillies
      { rowIndex: 0, colIndex: 0, validPlayers: ['Schilling Curt', 'Jim Lonborg', 'Kyle Schwarber', 'Dave Hollins', 'Pete Alexander'] },
      // Red Sox + World Series Champion
      { rowIndex: 0, colIndex: 1, validPlayers: ['David Ortiz', 'Pedro Martinez', 'Manny Ramirez', 'Curt Schilling', 'Jason Varitek'] },
      // Red Sox + 30+ SB Season
      { rowIndex: 0, colIndex: 2, validPlayers: ['Tris Speaker', 'Jacoby Ellsbury', 'Tommy Harper', 'Johnny Damon', 'Ellis Burks'] },
      // Cubs + Phillies
      { rowIndex: 1, colIndex: 0, validPlayers: ['Ryne Sandberg', 'Chuck Klein', 'Grover Alexander', 'Ferguson Jenkins', 'Larry Bowa'] },
      // Cubs + World Series Champion
      { rowIndex: 1, colIndex: 1, validPlayers: ['Kris Bryant', 'Anthony Rizzo', 'Ben Zobrist', 'Javier Baez', 'Jon Lester'] },
      // Cubs + 30+ SB Season
      { rowIndex: 1, colIndex: 2, validPlayers: ['Ryne Sandberg', 'Davey Lopes', 'Bob Dernier', 'Shawon Dunston', 'Eric Young'] },
      // 300+ K + Phillies
      { rowIndex: 2, colIndex: 0, validPlayers: ['Steve Carlton', 'Curt Schilling', 'J.R. Richard', 'Grover Alexander', 'Robin Roberts'] },
      // 300+ K + World Series Champion
      { rowIndex: 2, colIndex: 1, validPlayers: ['Randy Johnson', 'Curt Schilling', 'Roger Clemens', 'Pedro Martinez', 'Sandy Koufax'] },
      // 300+ K + 30+ SB Season
      { rowIndex: 2, colIndex: 2, validPlayers: ['Nolan Ryan', 'Sam McDowell', 'Bob Gibson', 'J.R. Richard', 'Tom Seaver'] },
    ],
  },

  // ─── Grid 9 ──────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'St. Louis Cardinals', value: 'cardinals' },
      { type: 'team', label: 'New York Mets', value: 'mets' },
      { type: 'award', label: 'Silver Slugger', value: 'silver-slugger' },
    ],
    cols: [
      { type: 'team', label: 'Cincinnati Reds', value: 'reds' },
      { type: 'stat', label: '.300+ Season Average', value: '300avg' },
      { type: 'award', label: 'Rookie of the Year', value: 'roy' },
    ],
    cells: [
      // Cardinals + Reds
      { rowIndex: 0, colIndex: 0, validPlayers: ['Deion Sanders', 'Orlando Cepeda', 'Joe Torre', 'Drew Stubbs', 'Pete Rose'] },
      // Cardinals + .300+ Season Average
      { rowIndex: 0, colIndex: 1, validPlayers: ['Stan Musial', 'Rogers Hornsby', 'Albert Pujols', 'Joe Medwick', 'Yadier Molina'] },
      // Cardinals + Rookie of the Year
      { rowIndex: 0, colIndex: 2, validPlayers: ['Wally Moon', 'Bill Virdon', 'Bake McBride', 'Vince Coleman', 'Albert Pujols'] },
      // Mets + Reds
      { rowIndex: 1, colIndex: 0, validPlayers: ['Tom Seaver', 'Pete Rose', 'George Foster', 'Tony Perez', 'Lee May'] },
      // Mets + .300+ Season Average
      { rowIndex: 1, colIndex: 1, validPlayers: ['Keith Hernandez', 'John Olerud', 'Jose Reyes', 'Edgardo Alfonzo', 'Cleon Jones'] },
      // Mets + Rookie of the Year
      { rowIndex: 1, colIndex: 2, validPlayers: ['Tom Seaver', 'Dwight Gooden', 'Darryl Strawberry', 'Jon Matlack', 'Jacob deGrom'] },
      // Silver Slugger + Reds
      { rowIndex: 2, colIndex: 0, validPlayers: ['Joey Votto', 'Barry Larkin', 'Dave Parker', 'Eric Davis', 'George Foster'] },
      // Silver Slugger + .300+ Season Average
      { rowIndex: 2, colIndex: 1, validPlayers: ['Tony Gwynn', 'Albert Pujols', 'Miguel Cabrera', 'Ichiro Suzuki', 'Wade Boggs'] },
      // Silver Slugger + Rookie of the Year
      { rowIndex: 2, colIndex: 2, validPlayers: ['Albert Pujols', 'Mike Trout', 'Cody Bellinger', 'Freddie Freeman', 'Bryce Harper'] },
    ],
  },

  // ─── Grid 10 ─────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'Los Angeles Dodgers', value: 'dodgers' },
      { type: 'team', label: 'Houston Astros', value: 'astros' },
      { type: 'award', label: 'World Series Champion', value: 'ws-champ' },
    ],
    cols: [
      { type: 'team', label: 'Chicago Cubs', value: 'cubs' },
      { type: 'award', label: 'MLB MVP', value: 'mlb-mvp' },
      { type: 'stat', label: '15+ Wins Season', value: '15wins' },
    ],
    cells: [
      // Dodgers + Cubs
      { rowIndex: 0, colIndex: 0, validPlayers: ['Greg Maddux', 'Rick Monday', 'Ted Lilly', 'Bill Buckner', 'Kenny Lofton'] },
      // Dodgers + MVP
      { rowIndex: 0, colIndex: 1, validPlayers: ['Clayton Kershaw', 'Kirk Gibson', 'Cody Bellinger', 'Sandy Koufax', 'Steve Garvey'] },
      // Dodgers + 15+ Wins Season
      { rowIndex: 0, colIndex: 2, validPlayers: ['Sandy Koufax', 'Don Drysdale', 'Fernando Valenzuela', 'Orel Hershiser', 'Don Sutton'] },
      // Astros + Cubs
      { rowIndex: 1, colIndex: 0, validPlayers: ['Greg Maddux', 'Carlos Zambrano', 'Carlos Lee', 'Bill Madlock', 'Jon Lester'] },
      // Astros + MVP
      { rowIndex: 1, colIndex: 1, validPlayers: ['Jeff Bagwell', 'Jose Altuve', 'Yordan Alvarez', 'George Springer', 'Carlos Correa'] },
      // Astros + 15+ Wins Season
      { rowIndex: 1, colIndex: 2, validPlayers: ['Nolan Ryan', 'Mike Scott', 'Roy Oswalt', 'Justin Verlander', 'Roger Clemens'] },
      // World Series Champion + Cubs
      { rowIndex: 2, colIndex: 0, validPlayers: ['Kris Bryant', 'Anthony Rizzo', 'Jon Lester', 'Ben Zobrist', 'David Ross'] },
      // World Series Champion + MVP
      { rowIndex: 2, colIndex: 1, validPlayers: ['Babe Ruth', 'Joe DiMaggio', 'Mickey Mantle', 'Frank Robinson', 'Brooks Robinson'] },
      // World Series Champion + 15+ Wins Season
      { rowIndex: 2, colIndex: 2, validPlayers: ['Bob Gibson', 'Sandy Koufax', 'Jack Morris', 'John Smoltz', 'Madison Bumgarner'] },
    ],
  },

  // ─── Grid 11 ─────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'New York Yankees', value: 'yankees' },
      { type: 'team', label: 'San Francisco Giants', value: 'giants' },
      { type: 'stat', label: '40+ HR Season', value: '40hr' },
    ],
    cols: [
      { type: 'team', label: 'Detroit Tigers', value: 'tigers' },
      { type: 'award', label: 'Gold Glove', value: 'gold-glove' },
      { type: 'stat', label: '.300+ Season Average', value: '300avg' },
    ],
    cells: [
      // Yankees + Tigers
      { rowIndex: 0, colIndex: 0, validPlayers: ['Cecil Fielder', 'David Wells', 'Gary Sheffield', 'Ivan Rodriguez', 'Willie Horton'] },
      // Yankees + Gold Glove
      { rowIndex: 0, colIndex: 1, validPlayers: ['Don Mattingly', 'Dave Winfield', 'Thurman Munson', 'Bobby Richardson', 'Graig Nettles'] },
      // Yankees + .300+ Season Average
      { rowIndex: 0, colIndex: 2, validPlayers: ['Babe Ruth', 'Lou Gehrig', 'Joe DiMaggio', 'Derek Jeter', 'Don Mattingly'] },
      // Giants + Tigers
      { rowIndex: 1, colIndex: 0, validPlayers: ['Miguel Cabrera', 'Ivan Rodriguez', 'Jack Morris', 'Tim Lincecum', 'Kevin Pillar'] },
      // Giants + Gold Glove
      { rowIndex: 1, colIndex: 1, validPlayers: ['Willie Mays', 'Bobby Bonds', 'Willie McCovey', 'Barry Bonds', 'Brandon Crawford'] },
      // Giants + .300+ Season Average
      { rowIndex: 1, colIndex: 2, validPlayers: ['Willie Mays', 'Barry Bonds', 'Buster Posey', 'Bill Terry', 'Mel Ott'] },
      // 40+ HR + Tigers
      { rowIndex: 2, colIndex: 0, validPlayers: ['Hank Greenberg', 'Cecil Fielder', 'Miguel Cabrera', 'Rocky Colavito', 'Norm Cash'] },
      // 40+ HR + Gold Glove
      { rowIndex: 2, colIndex: 1, validPlayers: ['Ken Griffey Jr', 'Mike Schmidt', 'Jim Rice', 'Dave Winfield', 'Nolan Arenado'] },
      // 40+ HR + .300+ Season Average
      { rowIndex: 2, colIndex: 2, validPlayers: ['Babe Ruth', 'Hank Aaron', 'Albert Pujols', 'Manny Ramirez', 'Jimmie Foxx'] },
    ],
  },

  // ─── Grid 12 ─────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'Atlanta Braves', value: 'braves' },
      { type: 'team', label: 'Oakland Athletics', value: 'athletics' },
      { type: 'award', label: 'Cy Young Award', value: 'cy-young' },
    ],
    cols: [
      { type: 'team', label: 'Boston Red Sox', value: 'red-sox' },
      { type: 'stat', label: '40+ HR Season', value: '40hr' },
      { type: 'award', label: 'Silver Slugger', value: 'silver-slugger' },
    ],
    cells: [
      // Braves + Red Sox
      { rowIndex: 0, colIndex: 0, validPlayers: ['Tom Glavine', 'John Smoltz', 'David Justice', 'Javy Lopez', 'Chris Sale'] },
      // Braves + 40+ HR Season
      { rowIndex: 0, colIndex: 1, validPlayers: ['Hank Aaron', 'Eddie Mathews', 'Dale Murphy', 'Andruw Jones', 'Adam Dunn'] },
      // Braves + Silver Slugger
      { rowIndex: 0, colIndex: 2, validPlayers: ['Chipper Jones', 'Dale Murphy', 'Freddie Freeman', 'Ronald Acuna Jr', 'Hank Aaron'] },
      // Athletics + Red Sox
      { rowIndex: 1, colIndex: 0, validPlayers: ['Jimmie Foxx', 'Lefty Grove', 'Dennis Eckersley', 'Orlando Cepeda', 'Rickey Henderson'] },
      // Athletics + 40+ HR Season
      { rowIndex: 1, colIndex: 1, validPlayers: ['Mark McGwire', 'Jose Canseco', 'Reggie Jackson', 'Jason Giambi', 'Jimmie Foxx'] },
      // Athletics + Silver Slugger
      { rowIndex: 1, colIndex: 2, validPlayers: ['Rickey Henderson', 'Jose Canseco', 'Jason Giambi', 'Mark McGwire', 'Miguel Tejada'] },
      // Cy Young + Red Sox
      { rowIndex: 2, colIndex: 0, validPlayers: ['Pedro Martinez', 'Roger Clemens', 'Jim Lonborg', 'Rick Porcello', 'Cy Young'] },
      // Cy Young + 40+ HR Season
      { rowIndex: 2, colIndex: 1, validPlayers: ['Don Newcombe', 'Denny McLain', 'Bob Gibson', 'Vida Blue', 'Orel Hershiser'] },
      // Cy Young + Silver Slugger
      { rowIndex: 2, colIndex: 2, validPlayers: ['Mike Hampton', 'Greg Maddux', 'Tom Glavine', 'Orel Hershiser', 'Zack Greinke'] },
    ],
  },

  // ─── Grid 13 ─────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'Pittsburgh Pirates', value: 'pirates' },
      { type: 'team', label: 'Philadelphia Phillies', value: 'phillies' },
      { type: 'stat', label: '100+ RBI Season', value: '100rbi' },
    ],
    cols: [
      { type: 'team', label: 'St. Louis Cardinals', value: 'cardinals' },
      { type: 'award', label: 'All-Star Selection', value: 'all-star' },
      { type: 'stat', label: '200+ Hits Season', value: '200hits' },
    ],
    cells: [
      // Pirates + Cardinals
      { rowIndex: 0, colIndex: 0, validPlayers: ['Aramis Ramirez', 'Jason Bay', 'Bobby Bonilla', 'Bill Mazeroski', 'Steve Blass'] },
      // Pirates + All-Star
      { rowIndex: 0, colIndex: 1, validPlayers: ['Roberto Clemente', 'Willie Stargell', 'Barry Bonds', 'Dave Parker', 'Bill Mazeroski'] },
      // Pirates + 200+ Hits Season
      { rowIndex: 0, colIndex: 2, validPlayers: ['Roberto Clemente', 'Paul Waner', 'Lloyd Waner', 'Matty Alou', 'Dave Parker'] },
      // Phillies + Cardinals
      { rowIndex: 1, colIndex: 0, validPlayers: ['Dick Allen', 'Jim Thome', 'Scott Rolen', 'Pete Alexander', 'Steve Carlton'] },
      // Phillies + All-Star
      { rowIndex: 1, colIndex: 1, validPlayers: ['Mike Schmidt', 'Steve Carlton', 'Richie Ashburn', 'Ryan Howard', 'Chase Utley'] },
      // Phillies + 200+ Hits Season
      { rowIndex: 1, colIndex: 2, validPlayers: ['Chuck Klein', 'Richie Ashburn', 'Pete Rose', 'Jimmy Rollins', 'Chase Utley'] },
      // 100+ RBI + Cardinals
      { rowIndex: 2, colIndex: 0, validPlayers: ['Albert Pujols', 'Stan Musial', 'Rogers Hornsby', 'Joe Medwick', 'Jim Bottomley'] },
      // 100+ RBI + All-Star
      { rowIndex: 2, colIndex: 1, validPlayers: ['Hank Aaron', 'Babe Ruth', 'Lou Gehrig', 'Albert Pujols', 'Alex Rodriguez'] },
      // 100+ RBI + 200+ Hits Season
      { rowIndex: 2, colIndex: 2, validPlayers: ['Lou Gehrig', 'Albert Pujols', 'Alex Rodriguez', 'Jimmie Foxx', 'Joe DiMaggio'] },
    ],
  },

  // ─── Grid 14 ─────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'Cincinnati Reds', value: 'reds' },
      { type: 'team', label: 'Baltimore Orioles', value: 'orioles' },
      { type: 'award', label: 'Rookie of the Year', value: 'roy' },
    ],
    cols: [
      { type: 'team', label: 'Los Angeles Dodgers', value: 'dodgers' },
      { type: 'stat', label: '15+ Wins Season', value: '15wins' },
      { type: 'award', label: 'World Series Champion', value: 'ws-champ' },
    ],
    cells: [
      // Reds + Dodgers
      { rowIndex: 0, colIndex: 0, validPlayers: ['Frank Robinson', 'Tom Seaver', 'Eric Davis', 'Pedro Guerrero', 'Deion Sanders'] },
      // Reds + 15+ Wins Season
      { rowIndex: 0, colIndex: 1, validPlayers: ['Don Gullett', 'Jack Billingham', 'Gary Nolan', 'Tom Browning', 'Jose Rijo'] },
      // Reds + World Series Champion
      { rowIndex: 0, colIndex: 2, validPlayers: ['Johnny Bench', 'Pete Rose', 'Joe Morgan', 'Tony Perez', 'Barry Larkin'] },
      // Orioles + Dodgers
      { rowIndex: 1, colIndex: 0, validPlayers: ['Frank Robinson', 'Manny Machado', 'Steve Barber', 'Don Stanhouse', 'Mike Devereaux'] },
      // Orioles + 15+ Wins Season
      { rowIndex: 1, colIndex: 1, validPlayers: ['Jim Palmer', 'Mike Cuellar', 'Dave McNally', 'Mike Mussina', 'Steve Stone'] },
      // Orioles + World Series Champion
      { rowIndex: 1, colIndex: 2, validPlayers: ['Brooks Robinson', 'Frank Robinson', 'Jim Palmer', 'Cal Ripken Jr', 'Eddie Murray'] },
      // Rookie of the Year + Dodgers
      { rowIndex: 2, colIndex: 0, validPlayers: ['Jackie Robinson', 'Don Newcombe', 'Hideo Nomo', 'Eric Karros', 'Steve Howe'] },
      // Rookie of the Year + 15+ Wins Season
      { rowIndex: 2, colIndex: 1, validPlayers: ['Don Newcombe', 'Tom Seaver', 'Fernando Valenzuela', 'Dwight Gooden', 'Mark Fidrych'] },
      // Rookie of the Year + World Series Champion
      { rowIndex: 2, colIndex: 2, validPlayers: ['Jackie Robinson', 'Derek Jeter', 'Dustin Pedroia', 'Buster Posey', 'Corey Seager'] },
    ],
  },

  // ─── Grid 15 ─────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'New York Mets', value: 'mets' },
      { type: 'team', label: 'Detroit Tigers', value: 'tigers' },
      { type: 'award', label: 'MLB MVP', value: 'mlb-mvp' },
    ],
    cols: [
      { type: 'team', label: 'Pittsburgh Pirates', value: 'pirates' },
      { type: 'stat', label: '30+ SB Season', value: '30sb' },
      { type: 'award', label: 'Gold Glove', value: 'gold-glove' },
    ],
    cells: [
      // Mets + Pirates
      { rowIndex: 0, colIndex: 0, validPlayers: ['Roberto Alomar', 'Jason Bay', 'Jose Bautista', 'Al Oliver', 'John Milner'] },
      // Mets + 30+ SB Season
      { rowIndex: 0, colIndex: 1, validPlayers: ['Jose Reyes', 'Mookie Wilson', 'Lenny Dykstra', 'Vince Coleman', 'Roger Cedeno'] },
      // Mets + Gold Glove
      { rowIndex: 0, colIndex: 2, validPlayers: ['Keith Hernandez', 'Tom Seaver', 'Bud Harrelson', 'Rey Ordonez', 'Robin Ventura'] },
      // Tigers + Pirates
      { rowIndex: 1, colIndex: 0, validPlayers: ['Dave Parker', 'Jack Morris', 'Willie Horton', 'Bill Madlock', 'Jim Bunning'] },
      // Tigers + 30+ SB Season
      { rowIndex: 1, colIndex: 1, validPlayers: ['Ty Cobb', 'Ron LeFlore', 'Kirk Gibson', 'Alan Trammell', 'Brian Hunter'] },
      // Tigers + Gold Glove
      { rowIndex: 1, colIndex: 2, validPlayers: ['Al Kaline', 'Alan Trammell', 'Ivan Rodriguez', 'Mickey Stanley', 'Jim Northrup'] },
      // MVP + Pirates
      { rowIndex: 2, colIndex: 0, validPlayers: ['Roberto Clemente', 'Willie Stargell', 'Barry Bonds', 'Dick Groat', 'Dave Parker'] },
      // MVP + 30+ SB Season
      { rowIndex: 2, colIndex: 1, validPlayers: ['Rickey Henderson', 'Joe Morgan', 'Barry Bonds', 'Jackie Robinson', 'Shohei Ohtani'] },
      // MVP + Gold Glove
      { rowIndex: 2, colIndex: 2, validPlayers: ['Willie Mays', 'Roberto Clemente', 'Mike Schmidt', 'Brooks Robinson', 'Ken Griffey Jr'] },
    ],
  },

  // ─── Grid 16 ─────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'New York Yankees', value: 'yankees' },
      { type: 'team', label: 'St. Louis Cardinals', value: 'cardinals' },
      { type: 'stat', label: '.300+ Season Average', value: '300avg' },
    ],
    cols: [
      { type: 'team', label: 'Oakland Athletics', value: 'athletics' },
      { type: 'award', label: 'Cy Young Award', value: 'cy-young' },
      { type: 'stat', label: '300+ K Season', value: '300k' },
    ],
    cells: [
      // Yankees + Athletics (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Reggie Jackson', 'Catfish Hunter', 'Rickey Henderson', 'Roger Maris', 'Lefty Gomez'] },
      // Yankees + Cy Young
      { rowIndex: 0, colIndex: 1, validPlayers: ['Roger Clemens', 'Ron Guidry', 'Whitey Ford', 'Sparky Lyle', 'Bob Turley'] },
      // Yankees + 300+ K Season
      { rowIndex: 0, colIndex: 2, validPlayers: ['Ron Guidry', 'Jack Chesbro', 'David Cone', 'Al Downing', 'Gerrit Cole'] },
      // Cardinals + Athletics
      { rowIndex: 1, colIndex: 0, validPlayers: ['Mark McGwire', 'Dennis Eckersley', 'Orlando Cepeda', 'Rickey Henderson', 'Jason Giambi'] },
      // Cardinals + Cy Young
      { rowIndex: 1, colIndex: 1, validPlayers: ['Bob Gibson', 'Chris Carpenter', 'Dizzy Dean', 'John Tudor', 'Adam Wainwright'] },
      // Cardinals + 300+ K Season
      { rowIndex: 1, colIndex: 2, validPlayers: ['Bob Gibson', 'Dizzy Dean', 'Steve Carlton', 'Chris Carpenter', 'Adam Wainwright'] },
      // .300 avg + Athletics
      { rowIndex: 2, colIndex: 0, validPlayers: ['Rickey Henderson', 'Al Simmons', 'Jimmie Foxx', 'Mickey Cochrane', 'Jason Giambi'] },
      // .300 avg + Cy Young
      { rowIndex: 2, colIndex: 1, validPlayers: ['Bob Gibson', 'Don Newcombe', 'Denny McLain', 'Sandy Koufax', 'Dennis Eckersley'] },
      // .300 avg + 300+ K Season
      { rowIndex: 2, colIndex: 2, validPlayers: ['Bob Gibson', 'Sandy Koufax', 'Denny McLain', 'Walter Johnson', 'Christy Mathewson'] },
    ],
  },

  // ─── Grid 17 ─────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'Chicago Cubs', value: 'cubs' },
      { type: 'team', label: 'Los Angeles Dodgers', value: 'dodgers' },
      { type: 'award', label: 'All-Star Selection', value: 'all-star' },
    ],
    cols: [
      { type: 'team', label: 'Baltimore Orioles', value: 'orioles' },
      { type: 'stat', label: '100+ RBI Season', value: '100rbi' },
      { type: 'award', label: 'Rookie of the Year', value: 'roy' },
    ],
    cells: [
      // Cubs + Orioles
      { rowIndex: 0, colIndex: 0, validPlayers: ['Sammy Sosa', 'Lee Smith', 'Steve Stone', 'Eddie Murray', 'Rafael Palmeiro'] },
      // Cubs + 100+ RBI Season
      { rowIndex: 0, colIndex: 1, validPlayers: ['Ernie Banks', 'Sammy Sosa', 'Billy Williams', 'Hack Wilson', 'Aramis Ramirez'] },
      // Cubs + Rookie of the Year
      { rowIndex: 0, colIndex: 2, validPlayers: ['Billy Williams', 'Ken Hubbs', 'Jerome Walton', 'Kerry Wood', 'Geovany Soto'] },
      // Dodgers + Orioles
      { rowIndex: 1, colIndex: 0, validPlayers: ['Manny Machado', 'Frank Robinson', 'Don Stanhouse', 'Rodrigo Lopez', 'Mike Devereaux'] },
      // Dodgers + 100+ RBI Season
      { rowIndex: 1, colIndex: 1, validPlayers: ['Shohei Ohtani', 'Steve Garvey', 'Duke Snider', 'Roy Campanella', 'Gil Hodges'] },
      // Dodgers + Rookie of the Year
      { rowIndex: 1, colIndex: 2, validPlayers: ['Jackie Robinson', 'Don Newcombe', 'Eric Karros', 'Hideo Nomo', 'Corey Seager'] },
      // All-Star + Orioles
      { rowIndex: 2, colIndex: 0, validPlayers: ['Cal Ripken Jr', 'Brooks Robinson', 'Jim Palmer', 'Frank Robinson', 'Eddie Murray'] },
      // All-Star + 100+ RBI Season
      { rowIndex: 2, colIndex: 1, validPlayers: ['Babe Ruth', 'Hank Aaron', 'Mickey Mantle', 'Albert Pujols', 'Mike Trout'] },
      // All-Star + Rookie of the Year
      { rowIndex: 2, colIndex: 2, validPlayers: ['Jackie Robinson', 'Derek Jeter', 'Mike Trout', 'Albert Pujols', 'Cal Ripken Jr'] },
    ],
  },

  // ─── Grid 18 ─────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'Houston Astros', value: 'astros' },
      { type: 'team', label: 'Atlanta Braves', value: 'braves' },
      { type: 'stat', label: '200+ Hits Season', value: '200hits' },
    ],
    cols: [
      { type: 'team', label: 'New York Yankees', value: 'yankees' },
      { type: 'award', label: 'World Series Champion', value: 'ws-champ' },
      { type: 'stat', label: '40+ HR Season', value: '40hr' },
    ],
    cells: [
      // Astros + Yankees
      { rowIndex: 0, colIndex: 0, validPlayers: ['Roger Clemens', 'Andy Pettitte', 'Carlos Beltran', 'Robinson Cano', 'Brian McCann'] },
      // Astros + World Series Champion
      { rowIndex: 0, colIndex: 1, validPlayers: ['Jose Altuve', 'George Springer', 'Carlos Correa', 'Justin Verlander', 'Alex Bregman'] },
      // Astros + 40+ HR Season
      { rowIndex: 0, colIndex: 2, validPlayers: ['Jeff Bagwell', 'Lance Berkman', 'Carlos Lee', 'Richard Hidalgo', 'Glenn Davis'] },
      // Braves + Yankees
      { rowIndex: 1, colIndex: 0, validPlayers: ['Gary Sheffield', 'Andruw Jones', 'David Justice', 'Kenny Lofton', 'Mark Teixeira'] },
      // Braves + World Series Champion
      { rowIndex: 1, colIndex: 1, validPlayers: ['Tom Glavine', 'John Smoltz', 'Greg Maddux', 'Chipper Jones', 'Freddie Freeman'] },
      // Braves + 40+ HR Season
      { rowIndex: 1, colIndex: 2, validPlayers: ['Hank Aaron', 'Eddie Mathews', 'Dale Murphy', 'Andruw Jones', 'Adam Dunn'] },
      // 200+ Hits + Yankees
      { rowIndex: 2, colIndex: 0, validPlayers: ['Derek Jeter', 'Don Mattingly', 'Lou Gehrig', 'Joe DiMaggio', 'Earle Combs'] },
      // 200+ Hits + World Series Champion
      { rowIndex: 2, colIndex: 1, validPlayers: ['Derek Jeter', 'Lou Gehrig', 'Pete Rose', 'Roberto Clemente', 'Paul Molitor'] },
      // 200+ Hits + 40+ HR Season
      { rowIndex: 2, colIndex: 2, validPlayers: ['Lou Gehrig', 'Jimmie Foxx', 'Chuck Klein', 'Al Simmons', 'Joe DiMaggio'] },
    ],
  },

  // ─── Grid 19 ─────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'Boston Red Sox', value: 'red-sox' },
      { type: 'team', label: 'Cincinnati Reds', value: 'reds' },
      { type: 'award', label: 'Silver Slugger', value: 'silver-slugger' },
    ],
    cols: [
      { type: 'team', label: 'New York Mets', value: 'mets' },
      { type: 'stat', label: '15+ Wins Season', value: '15wins' },
      { type: 'award', label: 'MLB MVP', value: 'mlb-mvp' },
    ],
    cells: [
      // Red Sox + Mets
      { rowIndex: 0, colIndex: 0, validPlayers: ['Pedro Martinez', 'Keith Foulke', 'Billy Wagner', 'Rick Reed', 'Bob Ojeda'] },
      // Red Sox + 15+ Wins Season
      { rowIndex: 0, colIndex: 1, validPlayers: ['Roger Clemens', 'Pedro Martinez', 'Cy Young', 'Curt Schilling', 'Luis Tiant'] },
      // Red Sox + MVP
      { rowIndex: 0, colIndex: 2, validPlayers: ['Ted Williams', 'Jimmie Foxx', 'Carl Yastrzemski', 'Mookie Betts', 'David Ortiz'] },
      // Reds + Mets
      { rowIndex: 1, colIndex: 0, validPlayers: ['Tom Seaver', 'Pete Rose', 'Tony Perez', 'George Foster', 'Lee May'] },
      // Reds + 15+ Wins Season
      { rowIndex: 1, colIndex: 1, validPlayers: ['Don Gullett', 'Tom Browning', 'Jose Rijo', 'Gary Nolan', 'Jack Billingham'] },
      // Reds + MVP
      { rowIndex: 1, colIndex: 2, validPlayers: ['Johnny Bench', 'Joe Morgan', 'Pete Rose', 'Frank Robinson', 'Barry Larkin'] },
      // Silver Slugger + Mets
      { rowIndex: 2, colIndex: 0, validPlayers: ['Darryl Strawberry', 'Howard Johnson', 'Mike Piazza', 'David Wright', 'Carlos Beltran'] },
      // Silver Slugger + 15+ Wins Season
      { rowIndex: 2, colIndex: 1, validPlayers: ['Greg Maddux', 'Tom Glavine', 'Mike Hampton', 'Orel Hershiser', 'Don Newcombe'] },
      // Silver Slugger + MVP
      { rowIndex: 2, colIndex: 2, validPlayers: ['Barry Bonds', 'Albert Pujols', 'Mike Trout', 'Bryce Harper', 'Miguel Cabrera'] },
    ],
  },

  // ─── Grid 20 ─────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'San Francisco Giants', value: 'giants' },
      { type: 'team', label: 'Philadelphia Phillies', value: 'phillies' },
      { type: 'award', label: 'World Series Champion', value: 'ws-champ' },
    ],
    cols: [
      { type: 'team', label: 'Cincinnati Reds', value: 'reds' },
      { type: 'stat', label: '30+ SB Season', value: '30sb' },
      { type: 'award', label: 'Cy Young Award', value: 'cy-young' },
    ],
    cells: [
      // Giants + Reds
      { rowIndex: 0, colIndex: 0, validPlayers: ['Joe Morgan', 'Deion Sanders', 'Orlando Cepeda', 'Reggie Sanders', 'Jeff Brantley'] },
      // Giants + 30+ SB Season
      { rowIndex: 0, colIndex: 1, validPlayers: ['Barry Bonds', 'Bobby Bonds', 'Willie Mays', 'Brett Butler', 'Bill North'] },
      // Giants + Cy Young
      { rowIndex: 0, colIndex: 2, validPlayers: ['Tim Lincecum', 'Mike McCormick', 'Gaylord Perry', 'Vida Blue', 'Christy Mathewson'] },
      // Phillies + Reds
      { rowIndex: 1, colIndex: 0, validPlayers: ['Pete Rose', 'Joe Morgan', 'Tony Perez', 'George Foster', 'Dave Parker'] },
      // Phillies + 30+ SB Season
      { rowIndex: 1, colIndex: 1, validPlayers: ['Jimmy Rollins', 'Juan Samuel', 'Bobby Abreu', 'Larry Bowa', 'Von Hayes'] },
      // Phillies + Cy Young
      { rowIndex: 1, colIndex: 2, validPlayers: ['Steve Carlton', 'Steve Bedrosian', 'John Denny', 'Roy Halladay', 'Cliff Lee'] },
      // World Series Champ + Reds
      { rowIndex: 2, colIndex: 0, validPlayers: ['Johnny Bench', 'Pete Rose', 'Joe Morgan', 'Tony Perez', 'Barry Larkin'] },
      // World Series Champ + 30+ SB Season
      { rowIndex: 2, colIndex: 1, validPlayers: ['Rickey Henderson', 'Joe Morgan', 'Jackie Robinson', 'Kenny Lofton', 'Johnny Damon'] },
      // World Series Champ + Cy Young
      { rowIndex: 2, colIndex: 2, validPlayers: ['Sandy Koufax', 'Bob Gibson', 'Randy Johnson', 'Roger Clemens', 'Madison Bumgarner'] },
    ],
  },

  // ─── Grid 21 ─────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'New York Yankees', value: 'yankees' },
      { type: 'team', label: 'Chicago Cubs', value: 'cubs' },
      { type: 'award', label: 'Gold Glove', value: 'gold-glove' },
    ],
    cols: [
      { type: 'team', label: 'Houston Astros', value: 'astros' },
      { type: 'award', label: 'Silver Slugger', value: 'silver-slugger' },
      { type: 'stat', label: '300+ K Season', value: '300k' },
    ],
    cells: [
      // Yankees + Astros
      { rowIndex: 0, colIndex: 0, validPlayers: ['Roger Clemens', 'Andy Pettitte', 'Carlos Beltran', 'Robinson Cano', 'Brian McCann'] },
      // Yankees + Silver Slugger
      { rowIndex: 0, colIndex: 1, validPlayers: ['Don Mattingly', 'Alex Rodriguez', 'Derek Jeter', 'Bernie Williams', 'Aaron Judge'] },
      // Yankees + 300+ K Season
      { rowIndex: 0, colIndex: 2, validPlayers: ['Ron Guidry', 'David Cone', 'Jack Chesbro', 'Al Downing', 'Gerrit Cole'] },
      // Cubs + Astros
      { rowIndex: 1, colIndex: 0, validPlayers: ['Greg Maddux', 'Carlos Zambrano', 'Carlos Lee', 'Bill Madlock', 'Jon Lester'] },
      // Cubs + Silver Slugger
      { rowIndex: 1, colIndex: 1, validPlayers: ['Sammy Sosa', 'Ryne Sandberg', 'Andre Dawson', 'Aramis Ramirez', 'Kris Bryant'] },
      // Cubs + 300+ K Season
      { rowIndex: 1, colIndex: 2, validPlayers: ['Kerry Wood', 'Ferguson Jenkins', 'Carlos Zambrano', 'Mark Prior', 'Jake Arrieta'] },
      // Gold Glove + Astros
      { rowIndex: 2, colIndex: 0, validPlayers: ['Cesar Cedeno', 'Jose Altuve', 'Doug Rader', 'Terry Puhl', 'Adam Everett'] },
      // Gold Glove + Silver Slugger
      { rowIndex: 2, colIndex: 1, validPlayers: ['Barry Bonds', 'Ken Griffey Jr', 'Mike Schmidt', 'Alex Rodriguez', 'Nolan Arenado'] },
      // Gold Glove + 300+ K Season
      { rowIndex: 2, colIndex: 2, validPlayers: ['Greg Maddux', 'Bob Gibson', 'Jim Palmer', 'Jim Kaat', 'Ron Guidry'] },
    ],
  },

  // ─── Grid 22 ─────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'Los Angeles Dodgers', value: 'dodgers' },
      { type: 'team', label: 'Oakland Athletics', value: 'athletics' },
      { type: 'stat', label: '100+ RBI Season', value: '100rbi' },
    ],
    cols: [
      { type: 'team', label: 'Detroit Tigers', value: 'tigers' },
      { type: 'award', label: 'Rookie of the Year', value: 'roy' },
      { type: 'stat', label: '.300+ Season Average', value: '300avg' },
    ],
    cells: [
      // Dodgers + Tigers
      { rowIndex: 0, colIndex: 0, validPlayers: ['Kirk Gibson', 'Willie Horton', 'Fred Norman', 'Gary Sheffield', 'Juan Encarnacion'] },
      // Dodgers + Rookie of the Year
      { rowIndex: 0, colIndex: 1, validPlayers: ['Jackie Robinson', 'Don Newcombe', 'Eric Karros', 'Hideo Nomo', 'Corey Seager'] },
      // Dodgers + .300+ Season Average
      { rowIndex: 0, colIndex: 2, validPlayers: ['Jackie Robinson', 'Duke Snider', 'Steve Garvey', 'Tommy Davis', 'Manny Ramirez'] },
      // Athletics + Tigers
      { rowIndex: 1, colIndex: 0, validPlayers: ['Willie Horton', 'Denny McLain', 'Bill Freehan', 'Norm Cash', 'Enos Cabell'] },
      // Athletics + Rookie of the Year
      { rowIndex: 1, colIndex: 1, validPlayers: ['Jose Canseco', 'Walt Weiss', 'Harry Byrd', 'Bob Hamelin', 'Ben Grieve'] },
      // Athletics + .300+ Season Average
      { rowIndex: 1, colIndex: 2, validPlayers: ['Rickey Henderson', 'Al Simmons', 'Jimmie Foxx', 'Mickey Cochrane', 'Jason Giambi'] },
      // 100+ RBI + Tigers
      { rowIndex: 2, colIndex: 0, validPlayers: ['Hank Greenberg', 'Miguel Cabrera', 'Cecil Fielder', 'Al Kaline', 'Rudy York'] },
      // 100+ RBI + Rookie of the Year
      { rowIndex: 2, colIndex: 1, validPlayers: ['Albert Pujols', 'Mike Piazza', 'Ryan Howard', 'Cody Bellinger', 'Walt Dropo'] },
      // 100+ RBI + .300+ Season Average
      { rowIndex: 2, colIndex: 2, validPlayers: ['Babe Ruth', 'Lou Gehrig', 'Hank Aaron', 'Albert Pujols', 'Ted Williams'] },
    ],
  },

  // ─── Grid 23 ─────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'Atlanta Braves', value: 'braves' },
      { type: 'team', label: 'Pittsburgh Pirates', value: 'pirates' },
      { type: 'award', label: 'Cy Young Award', value: 'cy-young' },
    ],
    cols: [
      { type: 'team', label: 'Philadelphia Phillies', value: 'phillies' },
      { type: 'stat', label: '200+ Hits Season', value: '200hits' },
      { type: 'award', label: 'All-Star Selection', value: 'all-star' },
    ],
    cells: [
      // Braves + Phillies
      { rowIndex: 0, colIndex: 0, validPlayers: ['Dale Murphy', 'Pete Alexander', 'Garry Maddox', 'Lance Parrish', 'Marlon Byrd'] },
      // Braves + 200+ Hits Season
      { rowIndex: 0, colIndex: 1, validPlayers: ['Hank Aaron', 'Ralph Garr', 'Felipe Alou', 'Marquis Grissom', 'Ronald Acuna Jr'] },
      // Braves + All-Star
      { rowIndex: 0, colIndex: 2, validPlayers: ['Hank Aaron', 'Chipper Jones', 'Greg Maddux', 'Tom Glavine', 'Freddie Freeman'] },
      // Pirates + Phillies
      { rowIndex: 1, colIndex: 0, validPlayers: ['Bobby Bonilla', 'Steve Blass', 'Ralph Kiner', 'Dick Groat', 'Jim Bunning'] },
      // Pirates + 200+ Hits Season
      { rowIndex: 1, colIndex: 1, validPlayers: ['Roberto Clemente', 'Paul Waner', 'Lloyd Waner', 'Matty Alou', 'Dave Parker'] },
      // Pirates + All-Star
      { rowIndex: 1, colIndex: 2, validPlayers: ['Roberto Clemente', 'Willie Stargell', 'Ralph Kiner', 'Barry Bonds', 'Dave Parker'] },
      // Cy Young + Phillies
      { rowIndex: 2, colIndex: 0, validPlayers: ['Steve Carlton', 'Roy Halladay', 'John Denny', 'Steve Bedrosian', 'Cliff Lee'] },
      // Cy Young + 200+ Hits Season
      { rowIndex: 2, colIndex: 1, validPlayers: ['Denny McLain', 'Don Newcombe', 'Bob Gibson', 'Dean Chance', 'Sandy Koufax'] },
      // Cy Young + All-Star
      { rowIndex: 2, colIndex: 2, validPlayers: ['Greg Maddux', 'Roger Clemens', 'Pedro Martinez', 'Tom Seaver', 'Randy Johnson'] },
    ],
  },

  // ─── Grid 24 ─────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'New York Mets', value: 'mets' },
      { type: 'team', label: 'San Francisco Giants', value: 'giants' },
      { type: 'stat', label: '40+ HR Season', value: '40hr' },
    ],
    cols: [
      { type: 'team', label: 'St. Louis Cardinals', value: 'cardinals' },
      { type: 'stat', label: '30+ SB Season', value: '30sb' },
      { type: 'award', label: 'World Series Champion', value: 'ws-champ' },
    ],
    cells: [
      // Mets + Cardinals
      { rowIndex: 0, colIndex: 0, validPlayers: ['Keith Hernandez', 'Tom Seaver', 'Lee Mazzilli', 'Willie McGee', 'Darryl Strawberry'] },
      // Mets + 30+ SB Season
      { rowIndex: 0, colIndex: 1, validPlayers: ['Jose Reyes', 'Mookie Wilson', 'Lenny Dykstra', 'Vince Coleman', 'Roger Cedeno'] },
      // Mets + World Series Champion
      { rowIndex: 0, colIndex: 2, validPlayers: ['Tom Seaver', 'Jerry Koosman', 'Gary Carter', 'Keith Hernandez', 'Darryl Strawberry'] },
      // Giants + Cardinals
      { rowIndex: 1, colIndex: 0, validPlayers: ['Orlando Cepeda', 'Ray Sadecki', 'Jose Uribe', 'Benito Santiago', 'Ken Boyer'] },
      // Giants + 30+ SB Season
      { rowIndex: 1, colIndex: 1, validPlayers: ['Barry Bonds', 'Bobby Bonds', 'Willie Mays', 'Brett Butler', 'Bill North'] },
      // Giants + World Series Champion
      { rowIndex: 1, colIndex: 2, validPlayers: ['Buster Posey', 'Madison Bumgarner', 'Tim Lincecum', 'Pablo Sandoval', 'Brandon Crawford'] },
      // 40+ HR + Cardinals
      { rowIndex: 2, colIndex: 0, validPlayers: ['Mark McGwire', 'Albert Pujols', 'Jim Edmonds', 'Johnny Mize', 'Rogers Hornsby'] },
      // 40+ HR + 30+ SB Season
      { rowIndex: 2, colIndex: 1, validPlayers: ['Barry Bonds', 'Alex Rodriguez', 'Jose Canseco', 'Alfonso Soriano', 'Shohei Ohtani'] },
      // 40+ HR + World Series Champion
      { rowIndex: 2, colIndex: 2, validPlayers: ['Babe Ruth', 'Mickey Mantle', 'Reggie Jackson', 'David Ortiz', 'Albert Pujols'] },
    ],
  },

  // ─── Grid 25 ─────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'Baltimore Orioles', value: 'orioles' },
      { type: 'team', label: 'Houston Astros', value: 'astros' },
      { type: 'award', label: 'MLB MVP', value: 'mlb-mvp' },
    ],
    cols: [
      { type: 'team', label: 'San Francisco Giants', value: 'giants' },
      { type: 'stat', label: '200+ Hits Season', value: '200hits' },
      { type: 'award', label: 'Gold Glove', value: 'gold-glove' },
    ],
    cells: [
      // Orioles + Giants
      { rowIndex: 0, colIndex: 0, validPlayers: ['Frank Robinson', 'Bobby Bonds', 'Reggie Jackson', 'Mike McCormick', 'Chris Davis'] },
      // Orioles + 200+ Hits Season
      { rowIndex: 0, colIndex: 1, validPlayers: ['Cal Ripken Jr', 'Al Bumbry', 'Brady Anderson', 'Bobby Grich', 'B.J. Surhoff'] },
      // Orioles + Gold Glove
      { rowIndex: 0, colIndex: 2, validPlayers: ['Brooks Robinson', 'Jim Palmer', 'Cal Ripken Jr', 'Paul Blair', 'Roberto Alomar'] },
      // Astros + Giants
      { rowIndex: 1, colIndex: 0, validPlayers: ['Jeff Kent', 'Aubrey Huff', 'Hunter Pence', 'Kevin Bass', 'Darren Lewis'] },
      // Astros + 200+ Hits Season
      { rowIndex: 1, colIndex: 1, validPlayers: ['Jose Altuve', 'Craig Biggio', 'Michael Bourn', 'Derek Bell', 'Lance Berkman'] },
      // Astros + Gold Glove
      { rowIndex: 1, colIndex: 2, validPlayers: ['Cesar Cedeno', 'Jose Altuve', 'Doug Rader', 'Terry Puhl', 'Adam Everett'] },
      // MVP + Giants
      { rowIndex: 2, colIndex: 0, validPlayers: ['Willie Mays', 'Barry Bonds', 'Willie McCovey', 'Buster Posey', 'Kevin Mitchell'] },
      // MVP + 200+ Hits Season
      { rowIndex: 2, colIndex: 1, validPlayers: ['Ichiro Suzuki', 'Pete Rose', 'Joe DiMaggio', 'Cal Ripken Jr', 'George Brett'] },
      // MVP + Gold Glove
      { rowIndex: 2, colIndex: 2, validPlayers: ['Willie Mays', 'Roberto Clemente', 'Ken Griffey Jr', 'Mike Schmidt', 'Brooks Robinson'] },
    ],
  },

  // ─── Grid 26 ─────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'Detroit Tigers', value: 'tigers' },
      { type: 'team', label: 'Boston Red Sox', value: 'red-sox' },
      { type: 'stat', label: '15+ Wins Season', value: '15wins' },
    ],
    cols: [
      { type: 'team', label: 'New York Mets', value: 'mets' },
      { type: 'award', label: 'Cy Young Award', value: 'cy-young' },
      { type: 'stat', label: '100+ RBI Season', value: '100rbi' },
    ],
    cells: [
      // Tigers + Mets
      { rowIndex: 0, colIndex: 0, validPlayers: ['Justin Verlander', 'Al Leiter', 'Jose Valverde', 'Jack Morris', 'Gary Sheffield'] },
      // Tigers + Cy Young
      { rowIndex: 0, colIndex: 1, validPlayers: ['Denny McLain', 'Justin Verlander', 'Max Scherzer', 'Hal Newhouser', 'Willie Hernandez'] },
      // Tigers + 100+ RBI Season
      { rowIndex: 0, colIndex: 2, validPlayers: ['Hank Greenberg', 'Miguel Cabrera', 'Al Kaline', 'Cecil Fielder', 'Rudy York'] },
      // Red Sox + Mets
      { rowIndex: 1, colIndex: 0, validPlayers: ['Pedro Martinez', 'Bob Ojeda', 'Billy Wagner', 'Rick Reed', 'Keith Foulke'] },
      // Red Sox + Cy Young
      { rowIndex: 1, colIndex: 1, validPlayers: ['Roger Clemens', 'Pedro Martinez', 'Jim Lonborg', 'Cy Young', 'Rick Porcello'] },
      // Red Sox + 100+ RBI Season
      { rowIndex: 1, colIndex: 2, validPlayers: ['Ted Williams', 'Jimmie Foxx', 'David Ortiz', 'Manny Ramirez', 'Carl Yastrzemski'] },
      // 15+ Wins + Mets
      { rowIndex: 2, colIndex: 0, validPlayers: ['Tom Seaver', 'Dwight Gooden', 'Jerry Koosman', 'David Cone', 'Bobby Jones'] },
      // 15+ Wins + Cy Young
      { rowIndex: 2, colIndex: 1, validPlayers: ['Greg Maddux', 'Roger Clemens', 'Steve Carlton', 'Tom Seaver', 'Sandy Koufax'] },
      // 15+ Wins + 100+ RBI Season
      { rowIndex: 2, colIndex: 2, validPlayers: ['Wes Ferrell', 'Bob Gibson', 'Denny McLain', 'Don Drysdale', 'Robin Roberts'] },
    ],
  },

  // ─── Grid 27 ─────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'New York Yankees', value: 'yankees' },
      { type: 'team', label: 'Los Angeles Dodgers', value: 'dodgers' },
      { type: 'award', label: 'Rookie of the Year', value: 'roy' },
    ],
    cols: [
      { type: 'team', label: 'Atlanta Braves', value: 'braves' },
      { type: 'award', label: 'World Series Champion', value: 'ws-champ' },
      { type: 'stat', label: '.300+ Season Average', value: '300avg' },
    ],
    cells: [
      // Yankees + Braves
      { rowIndex: 0, colIndex: 0, validPlayers: ['Gary Sheffield', 'Andruw Jones', 'David Justice', 'Kenny Lofton', 'Mark Teixeira'] },
      // Yankees + World Series Champion
      { rowIndex: 0, colIndex: 1, validPlayers: ['Derek Jeter', 'Mariano Rivera', 'Babe Ruth', 'Lou Gehrig', 'Joe DiMaggio'] },
      // Yankees + .300+ Season Average
      { rowIndex: 0, colIndex: 2, validPlayers: ['Babe Ruth', 'Lou Gehrig', 'Joe DiMaggio', 'Derek Jeter', 'Don Mattingly'] },
      // Dodgers + Braves
      { rowIndex: 1, colIndex: 0, validPlayers: ['Javy Lopez', 'Gary Sheffield', 'Andruw Jones', 'Fred McGriff', 'Deion Sanders'] },
      // Dodgers + World Series Champion
      { rowIndex: 1, colIndex: 1, validPlayers: ['Sandy Koufax', 'Jackie Robinson', 'Roy Campanella', 'Duke Snider', 'Clayton Kershaw'] },
      // Dodgers + .300+ Season Average
      { rowIndex: 1, colIndex: 2, validPlayers: ['Jackie Robinson', 'Duke Snider', 'Steve Garvey', 'Tommy Davis', 'Manny Ramirez'] },
      // Rookie of Year + Braves
      { rowIndex: 2, colIndex: 0, validPlayers: ['Bob Horner', 'Alvin Dark', 'Earl Williams', 'David Justice', 'Rafael Furcal'] },
      // Rookie of Year + World Series Champion
      { rowIndex: 2, colIndex: 1, validPlayers: ['Jackie Robinson', 'Derek Jeter', 'Buster Posey', 'Dustin Pedroia', 'Corey Seager'] },
      // Rookie of Year + .300+ Season Average
      { rowIndex: 2, colIndex: 2, validPlayers: ['Ichiro Suzuki', 'Pete Rose', 'Albert Pujols', 'Fred Lynn', 'Jackie Robinson'] },
    ],
  },

  // ─── Grid 28 ─────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'Cincinnati Reds', value: 'reds' },
      { type: 'team', label: 'Oakland Athletics', value: 'athletics' },
      { type: 'stat', label: '200+ Hits Season', value: '200hits' },
    ],
    cols: [
      { type: 'team', label: 'Chicago Cubs', value: 'cubs' },
      { type: 'award', label: 'MLB MVP', value: 'mlb-mvp' },
      { type: 'stat', label: '40+ HR Season', value: '40hr' },
    ],
    cells: [
      // Reds + Cubs
      { rowIndex: 0, colIndex: 0, validPlayers: ['Pete Rose', 'Ken Griffey Jr', 'Sean Casey', 'Eric Davis', 'Lee May'] },
      // Reds + MVP
      { rowIndex: 0, colIndex: 1, validPlayers: ['Johnny Bench', 'Joe Morgan', 'Pete Rose', 'Frank Robinson', 'Barry Larkin'] },
      // Reds + 40+ HR Season
      { rowIndex: 0, colIndex: 2, validPlayers: ['George Foster', 'Greg Vaughn', 'Adam Dunn', 'Ted Kluszewski', 'Frank Robinson'] },
      // Athletics + Cubs
      { rowIndex: 1, colIndex: 0, validPlayers: ['Dennis Eckersley', 'Ryne Sandberg', 'Billy Williams', 'Bill Madlock', 'Lee Smith'] },
      // Athletics + MVP
      { rowIndex: 1, colIndex: 1, validPlayers: ['Reggie Jackson', 'Jimmie Foxx', 'Vida Blue', 'Dennis Eckersley', 'Jose Canseco'] },
      // Athletics + 40+ HR Season
      { rowIndex: 1, colIndex: 2, validPlayers: ['Mark McGwire', 'Jose Canseco', 'Reggie Jackson', 'Jimmie Foxx', 'Jason Giambi'] },
      // 200+ Hits + Cubs
      { rowIndex: 2, colIndex: 0, validPlayers: ['Billy Williams', 'Ryne Sandberg', 'Starlin Castro', 'Mark Grace', 'Kiki Cuyler'] },
      // 200+ Hits + MVP
      { rowIndex: 2, colIndex: 1, validPlayers: ['Ichiro Suzuki', 'Pete Rose', 'George Brett', 'Joe DiMaggio', 'Cal Ripken Jr'] },
      // 200+ Hits + 40+ HR Season
      { rowIndex: 2, colIndex: 2, validPlayers: ['Lou Gehrig', 'Jimmie Foxx', 'Chuck Klein', 'Al Simmons', 'Joe DiMaggio'] },
    ],
  },

  // ─── Grid 29 ─────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'St. Louis Cardinals', value: 'cardinals' },
      { type: 'team', label: 'Baltimore Orioles', value: 'orioles' },
      { type: 'award', label: 'All-Star Selection', value: 'all-star' },
    ],
    cols: [
      { type: 'team', label: 'Los Angeles Dodgers', value: 'dodgers' },
      { type: 'stat', label: '15+ Wins Season', value: '15wins' },
      { type: 'award', label: 'Silver Slugger', value: 'silver-slugger' },
    ],
    cells: [
      // Cardinals + Dodgers
      { rowIndex: 0, colIndex: 0, validPlayers: ['Joe Torre', 'Lonnie Smith', 'Matt Holliday', 'Lance Berkman', 'Ted Simmons'] },
      // Cardinals + 15+ Wins Season
      { rowIndex: 0, colIndex: 1, validPlayers: ['Bob Gibson', 'Dizzy Dean', 'Chris Carpenter', 'Adam Wainwright', 'Mort Cooper'] },
      // Cardinals + Silver Slugger
      { rowIndex: 0, colIndex: 2, validPlayers: ['Albert Pujols', 'Matt Holliday', 'Jim Edmonds', 'Mark McGwire', 'Yadier Molina'] },
      // Orioles + Dodgers
      { rowIndex: 1, colIndex: 0, validPlayers: ['Frank Robinson', 'Manny Machado', 'Don Stanhouse', 'Mike Devereaux', 'Sid Fernandez'] },
      // Orioles + 15+ Wins Season
      { rowIndex: 1, colIndex: 1, validPlayers: ['Jim Palmer', 'Mike Cuellar', 'Dave McNally', 'Mike Mussina', 'Steve Stone'] },
      // Orioles + Silver Slugger
      { rowIndex: 1, colIndex: 2, validPlayers: ['Eddie Murray', 'Cal Ripken Jr', 'Ken Singleton', 'Rafael Palmeiro', 'Chris Davis'] },
      // All-Star + Dodgers
      { rowIndex: 2, colIndex: 0, validPlayers: ['Sandy Koufax', 'Clayton Kershaw', 'Jackie Robinson', 'Duke Snider', 'Don Drysdale'] },
      // All-Star + 15+ Wins Season
      { rowIndex: 2, colIndex: 1, validPlayers: ['Tom Seaver', 'Greg Maddux', 'Roger Clemens', 'Bob Gibson', 'Sandy Koufax'] },
      // All-Star + Silver Slugger
      { rowIndex: 2, colIndex: 2, validPlayers: ['Mike Trout', 'Albert Pujols', 'Barry Bonds', 'Hank Aaron', 'Ken Griffey Jr'] },
    ],
  },

  // ─── Grid 30 ─────────────────────────────────────────────────────────────────
  {
    league: 'MLB',
    rows: [
      { type: 'team', label: 'New York Yankees', value: 'yankees' },
      { type: 'team', label: 'Philadelphia Phillies', value: 'phillies' },
      { type: 'award', label: 'World Series Champion', value: 'ws-champ' },
    ],
    cols: [
      { type: 'team', label: 'Pittsburgh Pirates', value: 'pirates' },
      { type: 'stat', label: '300+ K Season', value: '300k' },
      { type: 'award', label: 'Gold Glove', value: 'gold-glove' },
    ],
    cells: [
      // Yankees + Pirates
      { rowIndex: 0, colIndex: 0, validPlayers: ['Doc Ellis', 'Denny Neagle', 'Jerry Reuss', 'Bill Virdon', 'Brian Giles'] },
      // Yankees + 300+ K Season
      { rowIndex: 0, colIndex: 1, validPlayers: ['Ron Guidry', 'David Cone', 'Jack Chesbro', 'Al Downing', 'Gerrit Cole'] },
      // Yankees + Gold Glove
      { rowIndex: 0, colIndex: 2, validPlayers: ['Don Mattingly', 'Dave Winfield', 'Bobby Richardson', 'Thurman Munson', 'Graig Nettles'] },
      // Phillies + Pirates
      { rowIndex: 1, colIndex: 0, validPlayers: ['Bobby Bonilla', 'Jim Bunning', 'Dick Groat', 'Ralph Kiner', 'Larry Bowa'] },
      // Phillies + 300+ K Season
      { rowIndex: 1, colIndex: 1, validPlayers: ['Steve Carlton', 'Curt Schilling', 'Robin Roberts', 'Grover Alexander', 'Jim Bunning'] },
      // Phillies + Gold Glove
      { rowIndex: 1, colIndex: 2, validPlayers: ['Mike Schmidt', 'Garry Maddox', 'Jim Piersall', 'Bobby Shantz', 'Jimmy Rollins'] },
      // WS Champion + Pirates
      { rowIndex: 2, colIndex: 0, validPlayers: ['Roberto Clemente', 'Willie Stargell', 'Bill Mazeroski', 'Dave Parker', 'Phil Garner'] },
      // WS Champion + 300+ K Season
      { rowIndex: 2, colIndex: 1, validPlayers: ['Sandy Koufax', 'Bob Gibson', 'Randy Johnson', 'Curt Schilling', 'Roger Clemens'] },
      // WS Champion + Gold Glove
      { rowIndex: 2, colIndex: 2, validPlayers: ['Brooks Robinson', 'Roberto Clemente', 'Willie Mays', 'Ozzie Smith', 'Keith Hernandez'] },
    ],
  },
];

export default MLB_GRIDS;
