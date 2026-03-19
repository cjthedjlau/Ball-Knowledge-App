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

const NFL_GRIDS: CrossoverGrid[] = [
  // ============================================================
  // GRID 1
  // Rows: Chiefs, Patriots, NFL MVP
  // Cols: 30+ TD Season, Cowboys, Super Bowl MVP
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Kansas City Chiefs', value: 'chiefs' },
      { type: 'team', label: 'New England Patriots', value: 'patriots' },
      { type: 'award', label: 'NFL MVP', value: 'nfl-mvp' },
    ],
    cols: [
      { type: 'stat', label: '30+ TD Season', value: '30td' },
      { type: 'team', label: 'Dallas Cowboys', value: 'cowboys' },
      { type: 'award', label: 'Super Bowl MVP', value: 'sb-mvp' },
    ],
    cells: [
      // Chiefs + 30+ TD Season
      { rowIndex: 0, colIndex: 0, validPlayers: ['Patrick Mahomes', 'Alex Smith', 'Trent Green', 'Len Dawson', 'Travis Kelce'] },
      // Chiefs + Cowboys (played for both)
      { rowIndex: 0, colIndex: 1, validPlayers: ['Emmitt Thomas', 'Jim Marsalis', 'Mike Livingston', 'Todd Blackledge', 'Curtis McClinton', 'Keyshawn Martin'] },
      // Chiefs + Super Bowl MVP
      { rowIndex: 0, colIndex: 2, validPlayers: ['Patrick Mahomes', 'Len Dawson'] },
      // Patriots + 30+ TD Season
      { rowIndex: 1, colIndex: 0, validPlayers: ['Tom Brady', 'Drew Bledsoe', 'Matt Cassel', 'Mac Jones', 'Cam Newton'] },
      // Patriots + Cowboys (played for both)
      { rowIndex: 1, colIndex: 1, validPlayers: ['Drew Bledsoe', 'Joey Galloway', 'Martellus Bennett', 'Bobby Carpenter', 'Patrick Chung'] },
      // Patriots + Super Bowl MVP
      { rowIndex: 1, colIndex: 2, validPlayers: ['Tom Brady', 'Deion Branch', 'Julian Edelman', 'James White', 'Malcolm Smith'] },
      // NFL MVP + 30+ TD Season
      { rowIndex: 2, colIndex: 0, validPlayers: ['Patrick Mahomes', 'Tom Brady', 'Peyton Manning', 'Aaron Rodgers', 'Matt Ryan', 'Lamar Jackson', 'Kurt Warner', 'Dan Marino', 'Brett Favre', 'Steve Young'] },
      // NFL MVP + Cowboys
      { rowIndex: 2, colIndex: 1, validPlayers: ['Emmitt Smith', 'Troy Aikman', 'Roger Staubach', 'Don Meredith', 'Dak Prescott'] },
      // NFL MVP + Super Bowl MVP
      { rowIndex: 2, colIndex: 2, validPlayers: ['Tom Brady', 'Patrick Mahomes', 'Joe Montana', 'Bart Starr', 'Terry Bradshaw', 'Kurt Warner', 'Peyton Manning', 'Aaron Rodgers', 'Steve Young', 'Emmitt Smith'] },
    ],
  },

  // ============================================================
  // GRID 2
  // Rows: Packers, 49ers, Steelers
  // Cols: Pro Bowl Selection, Super Bowl MVP, 4000+ Passing Yards Season
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Green Bay Packers', value: 'packers' },
      { type: 'team', label: 'San Francisco 49ers', value: '49ers' },
      { type: 'team', label: 'Pittsburgh Steelers', value: 'steelers' },
    ],
    cols: [
      { type: 'stat', label: 'Pro Bowl Selection', value: 'pro-bowl' },
      { type: 'award', label: 'Super Bowl MVP', value: 'sb-mvp' },
      { type: 'stat', label: '4000+ Passing Yards Season', value: '4000pass' },
    ],
    cells: [
      // Packers + Pro Bowl
      { rowIndex: 0, colIndex: 0, validPlayers: ['Aaron Rodgers', 'Brett Favre', 'Davante Adams', 'Sterling Sharpe', 'Reggie White', 'Charles Woodson', 'Jordy Nelson', 'Clay Matthews'] },
      // Packers + Super Bowl MVP
      { rowIndex: 0, colIndex: 1, validPlayers: ['Bart Starr', 'Aaron Rodgers', 'Desmond Howard'] },
      // Packers + 4000+ Passing Yards
      { rowIndex: 0, colIndex: 2, validPlayers: ['Aaron Rodgers', 'Brett Favre', 'Matt Flynn', 'Lynn Dickey', 'Don Majkowski'] },
      // 49ers + Pro Bowl
      { rowIndex: 1, colIndex: 0, validPlayers: ['Joe Montana', 'Jerry Rice', 'Steve Young', 'Ronnie Lott', 'Patrick Willis', 'Frank Gore', 'Deion Sanders', 'Roger Craig'] },
      // 49ers + Super Bowl MVP
      { rowIndex: 1, colIndex: 1, validPlayers: ['Joe Montana', 'Steve Young', 'Jerry Rice'] },
      // 49ers + 4000+ Passing Yards
      { rowIndex: 1, colIndex: 2, validPlayers: ['Jeff Garcia', 'Steve Young', 'Colin Kaepernick', 'Alex Smith', 'Jimmy Garoppolo'] },
      // Steelers + Pro Bowl
      { rowIndex: 2, colIndex: 0, validPlayers: ['Troy Polamalu', 'Ben Roethlisberger', 'Jerome Bettis', 'Hines Ward', 'Antonio Brown', 'Joe Greene', 'Jack Lambert', 'Terry Bradshaw', 'Rod Woodson'] },
      // Steelers + Super Bowl MVP
      { rowIndex: 2, colIndex: 1, validPlayers: ['Terry Bradshaw', 'Hines Ward', 'Santonio Holmes', 'Franco Harris', 'Lynn Swann'] },
      // Steelers + 4000+ Passing Yards
      { rowIndex: 2, colIndex: 2, validPlayers: ['Ben Roethlisberger', 'Terry Bradshaw', 'Neil ODonnell', 'Tommy Maddox', 'Kordell Stewart'] },
    ],
  },

  // ============================================================
  // GRID 3
  // Rows: Eagles, Ravens, Broncos
  // Cols: 1000+ Rushing Yards Season, Defensive Player of Year, Pro Bowl Selection
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Philadelphia Eagles', value: 'eagles' },
      { type: 'team', label: 'Baltimore Ravens', value: 'ravens' },
      { type: 'team', label: 'Denver Broncos', value: 'broncos' },
    ],
    cols: [
      { type: 'stat', label: '1000+ Rushing Yards Season', value: '1000rush' },
      { type: 'award', label: 'Defensive Player of Year', value: 'dpoy' },
      { type: 'stat', label: 'Pro Bowl Selection', value: 'pro-bowl' },
    ],
    cells: [
      // Eagles + 1000+ Rushing Yards
      { rowIndex: 0, colIndex: 0, validPlayers: ['LeSean McCoy', 'Wilbert Montgomery', 'Ricky Watters', 'Duce Staley', 'Brian Westbrook', 'Miles Sanders', 'Saquon Barkley'] },
      // Eagles + DPOY
      { rowIndex: 0, colIndex: 1, validPlayers: ['Reggie White', 'Seth Joyner', 'Fletcher Cox', 'Brian Dawkins', 'Jerome Brown'] },
      // Eagles + Pro Bowl
      { rowIndex: 0, colIndex: 2, validPlayers: ['Reggie White', 'Donovan McNabb', 'Brian Dawkins', 'LeSean McCoy', 'Randall Cunningham', 'Fletcher Cox', 'Jason Peters', 'Zach Ertz'] },
      // Ravens + 1000+ Rushing Yards
      { rowIndex: 1, colIndex: 0, validPlayers: ['Jamal Lewis', 'Ray Rice', 'Lamar Jackson', 'Willis McGahee', 'Derrick Henry', 'J.K. Dobbins'] },
      // Ravens + DPOY
      { rowIndex: 1, colIndex: 1, validPlayers: ['Ray Lewis', 'Ed Reed', 'Terrell Suggs', 'Peter Boulware', 'Haloti Ngata'] },
      // Ravens + Pro Bowl
      { rowIndex: 1, colIndex: 2, validPlayers: ['Ray Lewis', 'Ed Reed', 'Jonathan Ogden', 'Terrell Suggs', 'Jamal Lewis', 'Lamar Jackson', 'Justin Tucker', 'Marshal Yanda'] },
      // Broncos + 1000+ Rushing Yards
      { rowIndex: 2, colIndex: 0, validPlayers: ['Terrell Davis', 'Clinton Portis', 'Mike Anderson', 'Olandis Gary', 'Sammy Winder', 'Phillip Lindsay'] },
      // Broncos + DPOY
      { rowIndex: 2, colIndex: 1, validPlayers: ['Von Miller', 'Karl Mecklenburg', 'Steve Atwater', 'Tom Jackson', 'Champ Bailey'] },
      // Broncos + Pro Bowl
      { rowIndex: 2, colIndex: 2, validPlayers: ['John Elway', 'Terrell Davis', 'Von Miller', 'Champ Bailey', 'Shannon Sharpe', 'Rod Smith', 'Steve Atwater', 'Peyton Manning'] },
    ],
  },

  // ============================================================
  // GRID 4
  // Rows: Seahawks, Bears, Raiders
  // Cols: Super Bowl MVP, 10+ Sacks Season, 1000+ Rushing Yards Season
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Seattle Seahawks', value: 'seahawks' },
      { type: 'team', label: 'Chicago Bears', value: 'bears' },
      { type: 'team', label: 'Las Vegas Raiders', value: 'raiders' },
    ],
    cols: [
      { type: 'award', label: 'Super Bowl MVP', value: 'sb-mvp' },
      { type: 'stat', label: '10+ Sacks Season', value: '10sacks' },
      { type: 'stat', label: '1000+ Rushing Yards Season', value: '1000rush' },
    ],
    cells: [
      // Seahawks + Super Bowl MVP
      { rowIndex: 0, colIndex: 0, validPlayers: ['Malcolm Smith', 'Russell Wilson', 'Deion Branch', 'Steve Largent', 'Shaun Alexander'] },
      // Seahawks + 10+ Sacks
      { rowIndex: 0, colIndex: 1, validPlayers: ['Michael Bennett', 'Chris Clemons', 'Cliff Avril', 'Jacob Green', 'Frank Clark'] },
      // Seahawks + 1000+ Rushing Yards
      { rowIndex: 0, colIndex: 2, validPlayers: ['Shaun Alexander', 'Marshawn Lynch', 'Chris Carson', 'Curt Warner', 'Ricky Watters', 'Chris Warren'] },
      // Bears + Super Bowl MVP
      { rowIndex: 1, colIndex: 0, validPlayers: ['Richard Dent', 'Jim McMahon', 'Walter Payton', 'Mike Singletary', 'Devin Hester'] },
      // Bears + 10+ Sacks
      { rowIndex: 1, colIndex: 1, validPlayers: ['Richard Dent', 'Khalil Mack', 'Mark Anderson', 'Alex Brown', 'Trace Armstrong'] },
      // Bears + 1000+ Rushing Yards
      { rowIndex: 1, colIndex: 2, validPlayers: ['Walter Payton', 'Gale Sayers', 'Matt Forte', 'Thomas Jones', 'Neal Anderson', 'Jordan Howard'] },
      // Raiders + Super Bowl MVP
      { rowIndex: 2, colIndex: 0, validPlayers: ['Fred Biletnikoff', 'Jim Plunkett', 'Marcus Allen', 'Rich Gannon', 'Jerry Rice'] },
      // Raiders + 10+ Sacks
      { rowIndex: 2, colIndex: 1, validPlayers: ['Howie Long', 'Khalil Mack', 'Derrick Burgess', 'Greg Townsend', 'Maxx Crosby'] },
      // Raiders + 1000+ Rushing Yards
      { rowIndex: 2, colIndex: 2, validPlayers: ['Marcus Allen', 'Bo Jackson', 'Napoleon Kaufman', 'Tyrone Wheatley', 'Josh Jacobs', 'Clem Daniels'] },
    ],
  },

  // ============================================================
  // GRID 5
  // Rows: Dolphins, Rams, Giants
  // Cols: NFL MVP, 100+ Receptions Season, 30+ TD Season
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Miami Dolphins', value: 'dolphins' },
      { type: 'team', label: 'Los Angeles Rams', value: 'rams' },
      { type: 'team', label: 'New York Giants', value: 'giants' },
    ],
    cols: [
      { type: 'award', label: 'NFL MVP', value: 'nfl-mvp' },
      { type: 'stat', label: '100+ Receptions Season', value: '100rec' },
      { type: 'stat', label: '30+ TD Season', value: '30td' },
    ],
    cells: [
      // Dolphins + NFL MVP
      { rowIndex: 0, colIndex: 0, validPlayers: ['Dan Marino', 'Bob Griese', 'Larry Csonka', 'Don Shula', 'Tua Tagovailoa'] },
      // Dolphins + 100+ Receptions
      { rowIndex: 0, colIndex: 1, validPlayers: ['Jarvis Landry', 'Wes Welker', 'O.J. McDuffie', 'Brandon Marshall', 'Tyreek Hill', 'Jaylen Waddle'] },
      // Dolphins + 30+ TD Season
      { rowIndex: 0, colIndex: 2, validPlayers: ['Dan Marino', 'Tua Tagovailoa', 'Bob Griese', 'Ryan Tannehill', 'Jay Fiedler'] },
      // Rams + NFL MVP
      { rowIndex: 1, colIndex: 0, validPlayers: ['Kurt Warner', 'Marshall Faulk', 'Roman Gabriel', 'Norm Van Brocklin', 'Eric Dickerson'] },
      // Rams + 100+ Receptions
      { rowIndex: 1, colIndex: 1, validPlayers: ['Isaac Bruce', 'Torry Holt', 'Cooper Kupp', 'Puka Nacua', 'Robert Woods'] },
      // Rams + 30+ TD Season
      { rowIndex: 1, colIndex: 2, validPlayers: ['Kurt Warner', 'Marc Bulger', 'Jared Goff', 'Matthew Stafford', 'Roman Gabriel'] },
      // Giants + NFL MVP
      { rowIndex: 2, colIndex: 0, validPlayers: ['Lawrence Taylor', 'Y.A. Tittle', 'Frank Gifford', 'Phil Simms', 'Eli Manning'] },
      // Giants + 100+ Receptions
      { rowIndex: 2, colIndex: 1, validPlayers: ['Odell Beckham Jr.', 'Steve Smith', 'Amani Toomer', 'Tiki Barber', 'Jeremy Shockey'] },
      // Giants + 30+ TD Season
      { rowIndex: 2, colIndex: 2, validPlayers: ['Y.A. Tittle', 'Eli Manning', 'Phil Simms', 'Kerry Collins', 'Daniel Jones'] },
    ],
  },

  // ============================================================
  // GRID 6
  // Rows: Cowboys, Patriots, Offensive Rookie of Year
  // Cols: Packers, Pro Bowl Selection, 1500+ Receiving Yards Season
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Dallas Cowboys', value: 'cowboys' },
      { type: 'team', label: 'New England Patriots', value: 'patriots' },
      { type: 'award', label: 'Offensive Rookie of Year', value: 'oroy' },
    ],
    cols: [
      { type: 'team', label: 'Green Bay Packers', value: 'packers' },
      { type: 'stat', label: 'Pro Bowl Selection', value: 'pro-bowl' },
      { type: 'stat', label: '1500+ Receiving Yards Season', value: '1500rec' },
    ],
    cells: [
      // Cowboys + Packers (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Brett Favre', 'Ryan Longwell', 'Craig Hentrich', 'Jay Novacek', 'George Teague', 'Seth Joyner'] },
      // Cowboys + Pro Bowl
      { rowIndex: 0, colIndex: 1, validPlayers: ['Emmitt Smith', 'Troy Aikman', 'Michael Irvin', 'Jason Witten', 'DeMarcus Ware', 'Larry Allen', 'Deion Sanders', 'Tony Romo', 'Dez Bryant', 'Zack Martin'] },
      // Cowboys + 1500+ Receiving Yards
      { rowIndex: 0, colIndex: 2, validPlayers: ['Michael Irvin', 'Dez Bryant', 'Bob Hayes', 'CeeDee Lamb', 'Drew Pearson'] },
      // Patriots + Packers (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Ty Law', 'Mike Vrabel', 'Martellus Bennett', 'Bill Schroeder', 'Craig Hentrich'] },
      // Patriots + Pro Bowl
      { rowIndex: 1, colIndex: 1, validPlayers: ['Tom Brady', 'Rob Gronkowski', 'Ty Law', 'Andre Tippett', 'Vince Wilfork', 'Richard Seymour', 'Mike Haynes', 'Wes Welker', 'Logan Mankins'] },
      // Patriots + 1500+ Receiving Yards
      { rowIndex: 1, colIndex: 2, validPlayers: ['Wes Welker', 'Randy Moss', 'Rob Gronkowski', 'Stanley Morgan', 'Terry Glenn'] },
      // OROY + Packers
      { rowIndex: 2, colIndex: 0, validPlayers: ['Eddie Lacy', 'John Brockington', 'Billy Howton', 'Paul Hornung', 'Aaron Rodgers'] },
      // OROY + Pro Bowl
      { rowIndex: 2, colIndex: 1, validPlayers: ['Odell Beckham Jr.', 'Dak Prescott', 'Justin Herbert', 'Robert Griffin III', 'Cam Newton', 'Randy Moss', 'Eddie George', 'Earl Campbell', 'Mike Ditka'] },
      // OROY + 1500+ Receiving Yards
      { rowIndex: 2, colIndex: 2, validPlayers: ['Odell Beckham Jr.', 'Justin Jefferson', 'Randy Moss', 'Anquan Boldin', 'Puka Nacua'] },
    ],
  },

  // ============================================================
  // GRID 7
  // Rows: Chiefs, Steelers, Defensive Player of Year
  // Cols: Eagles, 4000+ Passing Yards Season, NFL MVP
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Kansas City Chiefs', value: 'chiefs' },
      { type: 'team', label: 'Pittsburgh Steelers', value: 'steelers' },
      { type: 'award', label: 'Defensive Player of Year', value: 'dpoy' },
    ],
    cols: [
      { type: 'team', label: 'Philadelphia Eagles', value: 'eagles' },
      { type: 'stat', label: '4000+ Passing Yards Season', value: '4000pass' },
      { type: 'award', label: 'NFL MVP', value: 'nfl-mvp' },
    ],
    cells: [
      // Chiefs + Eagles (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Andy Reid', 'Brian Westbrook', 'Jeremy Maclin', 'Duce Staley', 'Jeremiah Trotter'] },
      // Chiefs + 4000+ Passing Yards
      { rowIndex: 0, colIndex: 1, validPlayers: ['Patrick Mahomes', 'Trent Green', 'Alex Smith', 'Len Dawson', 'Matt Cassel'] },
      // Chiefs + NFL MVP
      { rowIndex: 0, colIndex: 2, validPlayers: ['Patrick Mahomes', 'Len Dawson', 'Marcus Allen', 'Joe Montana', 'Priest Holmes'] },
      // Steelers + Eagles (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['James Harrison', 'Kevin Curtis', 'Mike Wallace', 'DeAngelo Williams', 'Emmanuel Sanders'] },
      // Steelers + 4000+ Passing Yards
      { rowIndex: 1, colIndex: 1, validPlayers: ['Ben Roethlisberger', 'Tommy Maddox', 'Kordell Stewart', 'Neil ODonnell', 'Terry Bradshaw'] },
      // Steelers + NFL MVP
      { rowIndex: 1, colIndex: 2, validPlayers: ['Terry Bradshaw', 'Joe Greene', 'Ben Roethlisberger', 'Franco Harris', 'Hines Ward'] },
      // DPOY + Eagles
      { rowIndex: 2, colIndex: 0, validPlayers: ['Reggie White', 'Fletcher Cox', 'Brian Dawkins', 'Seth Joyner', 'Clyde Simmons'] },
      // DPOY + 4000+ Passing Yards
      { rowIndex: 2, colIndex: 1, validPlayers: ['Lawrence Taylor', 'J.J. Watt', 'Aaron Donald', 'Reggie White', 'Bruce Smith'] },
      // DPOY + NFL MVP
      { rowIndex: 2, colIndex: 2, validPlayers: ['Lawrence Taylor', 'Alan Page', 'Mark Moseley', 'Joe Greene', 'Aaron Donald'] },
    ],
  },

  // ============================================================
  // GRID 8
  // Rows: 49ers, Broncos, Bears
  // Cols: Cowboys, Super Bowl MVP, 10+ Sacks Season
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'San Francisco 49ers', value: '49ers' },
      { type: 'team', label: 'Denver Broncos', value: 'broncos' },
      { type: 'team', label: 'Chicago Bears', value: 'bears' },
    ],
    cols: [
      { type: 'team', label: 'Dallas Cowboys', value: 'cowboys' },
      { type: 'award', label: 'Super Bowl MVP', value: 'sb-mvp' },
      { type: 'stat', label: '10+ Sacks Season', value: '10sacks' },
    ],
    cells: [
      // 49ers + Cowboys (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Deion Sanders', 'Charles Haley', 'Terrell Owens', 'Ken Norton Jr.', 'Everson Walls'] },
      // 49ers + Super Bowl MVP
      { rowIndex: 0, colIndex: 1, validPlayers: ['Joe Montana', 'Steve Young', 'Jerry Rice'] },
      // 49ers + 10+ Sacks
      { rowIndex: 0, colIndex: 2, validPlayers: ['Charles Haley', 'Fred Dean', 'Chris Doleman', 'Nick Bosa', 'Dana Stubblefield', 'Aldon Smith'] },
      // Broncos + Cowboys (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Tony Dorsett', 'Champ Bailey', 'Eddie Kennison', 'Danny White', 'Brian Griese'] },
      // Broncos + Super Bowl MVP
      { rowIndex: 1, colIndex: 1, validPlayers: ['Terrell Davis', 'John Elway', 'Von Miller', 'Peyton Manning', 'DeMarcus Ware'] },
      // Broncos + 10+ Sacks
      { rowIndex: 1, colIndex: 2, validPlayers: ['Von Miller', 'Simon Fletcher', 'DeMarcus Ware', 'Elvis Dumervil', 'Karl Mecklenburg', 'Bradley Chubb'] },
      // Bears + Cowboys (played for both)
      { rowIndex: 2, colIndex: 0, validPlayers: ['Jay Cutler', 'Greg Olsen', 'Roy Williams', 'Mike Ditka', 'Devin Hester'] },
      // Bears + Super Bowl MVP
      { rowIndex: 2, colIndex: 1, validPlayers: ['Richard Dent', 'Jim McMahon', 'Walter Payton', 'Mike Singletary', 'William Perry'] },
      // Bears + 10+ Sacks
      { rowIndex: 2, colIndex: 2, validPlayers: ['Richard Dent', 'Khalil Mack', 'Trace Armstrong', 'Alex Brown', 'Mark Anderson', 'Montez Sweat'] },
    ],
  },

  // ============================================================
  // GRID 9
  // Rows: Seahawks, Rams, Offensive Player of Year
  // Cols: Raiders, 100+ Receptions Season, 1000+ Rushing Yards Season
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Seattle Seahawks', value: 'seahawks' },
      { type: 'team', label: 'Los Angeles Rams', value: 'rams' },
      { type: 'award', label: 'Offensive Player of Year', value: 'opoy' },
    ],
    cols: [
      { type: 'team', label: 'Las Vegas Raiders', value: 'raiders' },
      { type: 'stat', label: '100+ Receptions Season', value: '100rec' },
      { type: 'stat', label: '1000+ Rushing Yards Season', value: '1000rush' },
    ],
    cells: [
      // Seahawks + Raiders (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Bo Jackson', 'Jerry Rice', 'Randy Moss', 'Richard Sherman', 'Marshawn Lynch'] },
      // Seahawks + 100+ Receptions
      { rowIndex: 0, colIndex: 1, validPlayers: ['Bobby Engram', 'Darrell Jackson', 'Tyler Lockett', 'DK Metcalf', 'Steve Largent'] },
      // Seahawks + 1000+ Rushing Yards
      { rowIndex: 0, colIndex: 2, validPlayers: ['Shaun Alexander', 'Marshawn Lynch', 'Chris Carson', 'Curt Warner', 'Chris Warren', 'Ricky Watters'] },
      // Rams + Raiders (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Eric Dickerson', 'Jack Youngblood', 'Nolan Cromwell', 'Vince Ferragamo', 'Greg Bell'] },
      // Rams + 100+ Receptions
      { rowIndex: 1, colIndex: 1, validPlayers: ['Cooper Kupp', 'Isaac Bruce', 'Torry Holt', 'Puka Nacua', 'Robert Woods'] },
      // Rams + 1000+ Rushing Yards
      { rowIndex: 1, colIndex: 2, validPlayers: ['Eric Dickerson', 'Marshall Faulk', 'Steven Jackson', 'Todd Gurley', 'Lawrence McCutcheon'] },
      // OPOY + Raiders
      { rowIndex: 2, colIndex: 0, validPlayers: ['Marcus Allen', 'Rich Gannon', 'Tim Brown', 'Jerry Rice', 'Ken Stabler'] },
      // OPOY + 100+ Receptions
      { rowIndex: 2, colIndex: 1, validPlayers: ['Cooper Kupp', 'Jerry Rice', 'Michael Thomas', 'Marvin Harrison', 'Marshall Faulk'] },
      // OPOY + 1000+ Rushing Yards
      { rowIndex: 2, colIndex: 2, validPlayers: ['Eric Dickerson', 'Emmitt Smith', 'Marshall Faulk', 'LaDainian Tomlinson', 'Adrian Peterson', 'Terrell Davis', 'Derrick Henry'] },
    ],
  },

  // ============================================================
  // GRID 10
  // Rows: Giants, Dolphins, Walter Payton Man of Year
  // Cols: 30+ TD Season, Steelers, Pro Bowl Selection
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'New York Giants', value: 'giants' },
      { type: 'team', label: 'Miami Dolphins', value: 'dolphins' },
      { type: 'award', label: 'Walter Payton Man of Year', value: 'wpmoy' },
    ],
    cols: [
      { type: 'stat', label: '30+ TD Season', value: '30td' },
      { type: 'team', label: 'Pittsburgh Steelers', value: 'steelers' },
      { type: 'stat', label: 'Pro Bowl Selection', value: 'pro-bowl' },
    ],
    cells: [
      // Giants + 30+ TD Season
      { rowIndex: 0, colIndex: 0, validPlayers: ['Y.A. Tittle', 'Eli Manning', 'Phil Simms', 'Kerry Collins', 'Daniel Jones'] },
      // Giants + Steelers (played for both)
      { rowIndex: 0, colIndex: 1, validPlayers: ['Plaxico Burress', 'Will Allen', 'Jason Gildon', 'Kerry Collins', 'LaMarr Woodley'] },
      // Giants + Pro Bowl
      { rowIndex: 0, colIndex: 2, validPlayers: ['Lawrence Taylor', 'Michael Strahan', 'Eli Manning', 'Tiki Barber', 'Phil Simms', 'Harry Carson', 'Odell Beckham Jr.', 'Saquon Barkley'] },
      // Dolphins + 30+ TD Season
      { rowIndex: 1, colIndex: 0, validPlayers: ['Dan Marino', 'Tua Tagovailoa', 'Bob Griese', 'Ryan Tannehill', 'Jay Fiedler'] },
      // Dolphins + Steelers (played for both)
      { rowIndex: 1, colIndex: 1, validPlayers: ['Minkah Fitzpatrick', 'Ryan Shazier', 'Chris Chambers', 'Lamar Miller', 'Mike Wallace'] },
      // Dolphins + Pro Bowl
      { rowIndex: 1, colIndex: 2, validPlayers: ['Dan Marino', 'Jason Taylor', 'Zach Thomas', 'Dwight Stephenson', 'Larry Csonka', 'Bob Griese', 'Tyreek Hill'] },
      // WPMOY + 30+ TD Season
      { rowIndex: 2, colIndex: 0, validPlayers: ['Peyton Manning', 'Drew Brees', 'Russell Wilson', 'Matt Ryan', 'Eli Manning', 'Dan Marino'] },
      // WPMOY + Steelers
      { rowIndex: 2, colIndex: 1, validPlayers: ['Troy Polamalu', 'Joe Greene', 'Hines Ward', 'Jerome Bettis', 'Franco Harris', 'Cameron Heyward'] },
      // WPMOY + Pro Bowl
      { rowIndex: 2, colIndex: 2, validPlayers: ['Walter Payton', 'Peyton Manning', 'Drew Brees', 'Troy Polamalu', 'Russell Wilson', 'Calais Campbell', 'Jason Taylor', 'Larry Fitzgerald'] },
    ],
  },

  // ============================================================
  // GRID 11
  // Rows: Patriots, Cowboys, Ravens
  // Cols: Seahawks, 1500+ Receiving Yards Season, NFL MVP
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'New England Patriots', value: 'patriots' },
      { type: 'team', label: 'Dallas Cowboys', value: 'cowboys' },
      { type: 'team', label: 'Baltimore Ravens', value: 'ravens' },
    ],
    cols: [
      { type: 'team', label: 'Seattle Seahawks', value: 'seahawks' },
      { type: 'stat', label: '1500+ Receiving Yards Season', value: '1500rec' },
      { type: 'award', label: 'NFL MVP', value: 'nfl-mvp' },
    ],
    cells: [
      // Patriots + Seahawks (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Darrelle Revis', 'Brandon Browner', 'LeGarrette Blount', 'Brandin Cooks', 'Aqib Talib'] },
      // Patriots + 1500+ Receiving Yards
      { rowIndex: 0, colIndex: 1, validPlayers: ['Randy Moss', 'Wes Welker', 'Rob Gronkowski', 'Stanley Morgan', 'Terry Glenn'] },
      // Patriots + NFL MVP
      { rowIndex: 0, colIndex: 2, validPlayers: ['Tom Brady', 'Cam Newton', 'Jim Brown', 'Steve Grogan', 'Matt Cassel'] },
      // Cowboys + Seahawks (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Joey Galloway', 'Roy Williams', 'Bobby Engram', 'Terry Glenn', 'Ken Norton Jr.'] },
      // Cowboys + 1500+ Receiving Yards
      { rowIndex: 1, colIndex: 1, validPlayers: ['Michael Irvin', 'Dez Bryant', 'CeeDee Lamb', 'Bob Hayes', 'Drew Pearson'] },
      // Cowboys + NFL MVP
      { rowIndex: 1, colIndex: 2, validPlayers: ['Emmitt Smith', 'Troy Aikman', 'Roger Staubach', 'Don Meredith', 'Dak Prescott'] },
      // Ravens + Seahawks (played for both)
      { rowIndex: 2, colIndex: 0, validPlayers: ['Steve Hauschka', 'T.J. Houshmandzadeh', 'Lee Evans', 'Brandon Stokley', 'Derrick Mason'] },
      // Ravens + 1500+ Receiving Yards
      { rowIndex: 2, colIndex: 1, validPlayers: ['Michael Jackson', 'Derrick Mason', 'Steve Smith Sr.', 'Torrey Smith', 'Anquan Boldin'] },
      // Ravens + NFL MVP
      { rowIndex: 2, colIndex: 2, validPlayers: ['Lamar Jackson', 'Ray Lewis', 'Johnny Unitas', 'Earl Morrall', 'Ed Reed'] },
    ],
  },

  // ============================================================
  // GRID 12
  // Rows: Packers, 49ers, Super Bowl MVP
  // Cols: Bears, 30+ TD Season, Defensive Player of Year
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Green Bay Packers', value: 'packers' },
      { type: 'team', label: 'San Francisco 49ers', value: '49ers' },
      { type: 'award', label: 'Super Bowl MVP', value: 'sb-mvp' },
    ],
    cols: [
      { type: 'team', label: 'Chicago Bears', value: 'bears' },
      { type: 'stat', label: '30+ TD Season', value: '30td' },
      { type: 'award', label: 'Defensive Player of Year', value: 'dpoy' },
    ],
    cells: [
      // Packers + Bears (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Julius Peppers', 'Jim McMahon', 'Al Harris', 'Edgar Bennett', 'Desmond Howard'] },
      // Packers + 30+ TD Season
      { rowIndex: 0, colIndex: 1, validPlayers: ['Aaron Rodgers', 'Brett Favre', 'Lynn Dickey', 'Don Majkowski', 'Jordan Love'] },
      // Packers + DPOY
      { rowIndex: 0, colIndex: 2, validPlayers: ['Reggie White', 'Charles Woodson', 'Clay Matthews', 'LeRoy Butler', 'Dave Robinson'] },
      // 49ers + Bears (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Lance Briggs', 'Mike Singletary', 'Wendell Davis', 'Jim Miller', 'Bobby Engram'] },
      // 49ers + 30+ TD Season
      { rowIndex: 1, colIndex: 1, validPlayers: ['Steve Young', 'Jeff Garcia', 'Joe Montana', 'Colin Kaepernick', 'Jimmy Garoppolo'] },
      // 49ers + DPOY
      { rowIndex: 1, colIndex: 2, validPlayers: ['Charles Haley', 'Fred Dean', 'Ronnie Lott', 'Dana Stubblefield', 'Nick Bosa', 'Patrick Willis'] },
      // Super Bowl MVP + Bears
      { rowIndex: 2, colIndex: 0, validPlayers: ['Richard Dent', 'Desmond Howard', 'Jim McMahon', 'Walter Payton', 'Mike Singletary'] },
      // Super Bowl MVP + 30+ TD Season
      { rowIndex: 2, colIndex: 1, validPlayers: ['Tom Brady', 'Patrick Mahomes', 'Joe Montana', 'Steve Young', 'Kurt Warner', 'Peyton Manning', 'Aaron Rodgers', 'Eli Manning'] },
      // Super Bowl MVP + DPOY
      { rowIndex: 2, colIndex: 2, validPlayers: ['Harvey Martin', 'Ray Lewis', 'Charles Haley', 'Richard Dent', 'Von Miller'] },
    ],
  },

  // ============================================================
  // GRID 13
  // Rows: Chiefs, Eagles, Broncos
  // Cols: Dolphins, 4000+ Passing Yards Season, Super Bowl MVP
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Kansas City Chiefs', value: 'chiefs' },
      { type: 'team', label: 'Philadelphia Eagles', value: 'eagles' },
      { type: 'team', label: 'Denver Broncos', value: 'broncos' },
    ],
    cols: [
      { type: 'team', label: 'Miami Dolphins', value: 'dolphins' },
      { type: 'stat', label: '4000+ Passing Yards Season', value: '4000pass' },
      { type: 'award', label: 'Super Bowl MVP', value: 'sb-mvp' },
    ],
    cells: [
      // Chiefs + Dolphins (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Dante Hall', 'Tyreek Hill', 'Frank Clark', 'Trent Green', 'Chad Henne'] },
      // Chiefs + 4000+ Passing Yards
      { rowIndex: 0, colIndex: 1, validPlayers: ['Patrick Mahomes', 'Trent Green', 'Alex Smith', 'Matt Cassel', 'Len Dawson'] },
      // Chiefs + Super Bowl MVP
      { rowIndex: 0, colIndex: 2, validPlayers: ['Patrick Mahomes', 'Len Dawson'] },
      // Eagles + Dolphins (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Wes Welker', 'Byron Maxwell', 'DeMarco Murray', 'Sam Bradford', 'Jay Ajayi'] },
      // Eagles + 4000+ Passing Yards
      { rowIndex: 1, colIndex: 1, validPlayers: ['Donovan McNabb', 'Carson Wentz', 'Jalen Hurts', 'Randall Cunningham', 'Sam Bradford'] },
      // Eagles + Super Bowl MVP
      { rowIndex: 1, colIndex: 2, validPlayers: ['Nick Foles', 'Chuck Bednarik', 'Terrell Owens', 'Brian Dawkins', 'Norm Van Brocklin'] },
      // Broncos + Dolphins (played for both)
      { rowIndex: 2, colIndex: 0, validPlayers: ['Peyton Manning', 'Jay Cutler', 'Champ Bailey', 'Aqib Talib', 'Brandon Marshall'] },
      // Broncos + 4000+ Passing Yards
      { rowIndex: 2, colIndex: 1, validPlayers: ['John Elway', 'Peyton Manning', 'Jay Cutler', 'Jake Plummer', 'Drew Lock'] },
      // Broncos + Super Bowl MVP
      { rowIndex: 2, colIndex: 2, validPlayers: ['Terrell Davis', 'John Elway', 'Von Miller', 'Peyton Manning', 'DeMarcus Ware'] },
    ],
  },

  // ============================================================
  // GRID 14
  // Rows: Raiders, Seahawks, NFL MVP
  // Cols: Rams, 10+ Sacks Season, 100+ Receptions Season
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Las Vegas Raiders', value: 'raiders' },
      { type: 'team', label: 'Seattle Seahawks', value: 'seahawks' },
      { type: 'award', label: 'NFL MVP', value: 'nfl-mvp' },
    ],
    cols: [
      { type: 'team', label: 'Los Angeles Rams', value: 'rams' },
      { type: 'stat', label: '10+ Sacks Season', value: '10sacks' },
      { type: 'stat', label: '100+ Receptions Season', value: '100rec' },
    ],
    cells: [
      // Raiders + Rams (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Eric Dickerson', 'Jack Youngblood', 'Nolan Cromwell', 'Greg Bell', 'Vince Ferragamo'] },
      // Raiders + 10+ Sacks
      { rowIndex: 0, colIndex: 1, validPlayers: ['Howie Long', 'Khalil Mack', 'Derrick Burgess', 'Greg Townsend', 'Maxx Crosby'] },
      // Raiders + 100+ Receptions
      { rowIndex: 0, colIndex: 2, validPlayers: ['Tim Brown', 'Jerry Rice', 'Darren Waller', 'Amari Cooper', 'Andre Rison'] },
      // Seahawks + Rams (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Steven Jackson', 'Jeff Fisher', 'Sam Bradford', 'Robert Quinn', 'Curt Warner'] },
      // Seahawks + 10+ Sacks
      { rowIndex: 1, colIndex: 1, validPlayers: ['Michael Bennett', 'Cliff Avril', 'Chris Clemons', 'Jacob Green', 'Frank Clark'] },
      // Seahawks + 100+ Receptions
      { rowIndex: 1, colIndex: 2, validPlayers: ['Steve Largent', 'Tyler Lockett', 'Bobby Engram', 'Darrell Jackson', 'DK Metcalf'] },
      // NFL MVP + Rams
      { rowIndex: 2, colIndex: 0, validPlayers: ['Kurt Warner', 'Marshall Faulk', 'Roman Gabriel', 'Norm Van Brocklin', 'Eric Dickerson'] },
      // NFL MVP + 10+ Sacks
      { rowIndex: 2, colIndex: 1, validPlayers: ['Lawrence Taylor', 'Reggie White', 'J.J. Watt', 'Alan Page', 'Mark Gastineau'] },
      // NFL MVP + 100+ Receptions
      { rowIndex: 2, colIndex: 2, validPlayers: ['Marshall Faulk', 'Tom Brady', 'Peyton Manning', 'Kurt Warner', 'Aaron Rodgers'] },
    ],
  },

  // ============================================================
  // GRID 15
  // Rows: Steelers, Giants, Offensive Rookie of Year
  // Cols: 49ers, 1000+ Rushing Yards Season, Super Bowl MVP
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Pittsburgh Steelers', value: 'steelers' },
      { type: 'team', label: 'New York Giants', value: 'giants' },
      { type: 'award', label: 'Offensive Rookie of Year', value: 'oroy' },
    ],
    cols: [
      { type: 'team', label: 'San Francisco 49ers', value: '49ers' },
      { type: 'stat', label: '1000+ Rushing Yards Season', value: '1000rush' },
      { type: 'award', label: 'Super Bowl MVP', value: 'sb-mvp' },
    ],
    cells: [
      // Steelers + 49ers (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Joe Greene', 'Deion Sanders', 'Charles Haley', 'Jeff Garcia', 'Elvis Dumervil'] },
      // Steelers + 1000+ Rushing Yards
      { rowIndex: 0, colIndex: 1, validPlayers: ['Jerome Bettis', 'Franco Harris', 'Willie Parker', 'Le\'Veon Bell', 'Rashard Mendenhall', 'Barry Foster', 'Najee Harris'] },
      // Steelers + Super Bowl MVP
      { rowIndex: 0, colIndex: 2, validPlayers: ['Terry Bradshaw', 'Hines Ward', 'Santonio Holmes', 'Franco Harris', 'Lynn Swann'] },
      // Giants + 49ers (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Y.A. Tittle', 'Frank Gifford', 'Joe Montana', 'Eli Manning', 'Brandon Jacobs'] },
      // Giants + 1000+ Rushing Yards
      { rowIndex: 1, colIndex: 1, validPlayers: ['Tiki Barber', 'Saquon Barkley', 'Joe Morris', 'Ron Dayne', 'Rodney Hampton', 'Ottis Anderson', 'Brandon Jacobs'] },
      // Giants + Super Bowl MVP
      { rowIndex: 1, colIndex: 2, validPlayers: ['Eli Manning', 'Ottis Anderson', 'Phil Simms', 'Mark Bavaro', 'Michael Strahan'] },
      // OROY + 49ers
      { rowIndex: 2, colIndex: 0, validPlayers: ['Jerry Rice', 'Earl Cooper', 'Joe Montana', 'Aldon Smith', 'Frank Gore'] },
      // OROY + 1000+ Rushing Yards
      { rowIndex: 2, colIndex: 1, validPlayers: ['Eric Dickerson', 'Eddie George', 'Earl Campbell', 'Mike Anderson', 'Robert Griffin III', 'Saquon Barkley'] },
      // OROY + Super Bowl MVP
      { rowIndex: 2, colIndex: 2, validPlayers: ['Marcus Allen', 'Emmitt Smith', 'Desmond Howard', 'Ottis Anderson', 'Earl Campbell'] },
    ],
  },

  // ============================================================
  // GRID 16
  // Rows: Cowboys, Packers, 4000+ Passing Yards Season
  // Cols: Ravens, Defensive Player of Year, Pro Bowl Selection
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Dallas Cowboys', value: 'cowboys' },
      { type: 'team', label: 'Green Bay Packers', value: 'packers' },
      { type: 'stat', label: '4000+ Passing Yards Season', value: '4000pass' },
    ],
    cols: [
      { type: 'team', label: 'Baltimore Ravens', value: 'ravens' },
      { type: 'award', label: 'Defensive Player of Year', value: 'dpoy' },
      { type: 'stat', label: 'Pro Bowl Selection', value: 'pro-bowl' },
    ],
    cells: [
      // Cowboys + Ravens (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Deion Sanders', 'Willis McGahee', 'Terrell Owens', 'Robert Griffin III', 'Sam Koch'] },
      // Cowboys + DPOY
      { rowIndex: 0, colIndex: 1, validPlayers: ['Harvey Martin', 'DeMarcus Ware', 'Charles Haley', 'Randy White', 'Bob Lilly'] },
      // Cowboys + Pro Bowl
      { rowIndex: 0, colIndex: 2, validPlayers: ['Emmitt Smith', 'Troy Aikman', 'Michael Irvin', 'DeMarcus Ware', 'Jason Witten', 'Larry Allen', 'Deion Sanders', 'Zack Martin', 'Tony Romo'] },
      // Packers + Ravens (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Ted Hendricks', 'Ray Lewis', 'Ed Reed', 'Za\'Darius Smith', 'Elvis Grbac'] },
      // Packers + DPOY
      { rowIndex: 1, colIndex: 1, validPlayers: ['Reggie White', 'Charles Woodson', 'Clay Matthews', 'LeRoy Butler', 'Dave Robinson'] },
      // Packers + Pro Bowl
      { rowIndex: 1, colIndex: 2, validPlayers: ['Aaron Rodgers', 'Brett Favre', 'Reggie White', 'Charles Woodson', 'Davante Adams', 'Sterling Sharpe', 'Clay Matthews', 'Jordy Nelson'] },
      // 4000+ Pass Yards + Ravens
      { rowIndex: 2, colIndex: 0, validPlayers: ['Vinny Testaverde', 'Joe Flacco', 'Lamar Jackson', 'Kyle Boller', 'Steve McNair'] },
      // 4000+ Pass Yards + DPOY
      { rowIndex: 2, colIndex: 1, validPlayers: ['Lawrence Taylor', 'Aaron Donald', 'J.J. Watt', 'Reggie White', 'Bruce Smith'] },
      // 4000+ Pass Yards + Pro Bowl
      { rowIndex: 2, colIndex: 2, validPlayers: ['Tom Brady', 'Peyton Manning', 'Drew Brees', 'Patrick Mahomes', 'Dan Marino', 'Aaron Rodgers', 'Brett Favre', 'Matt Ryan', 'Russell Wilson'] },
    ],
  },

  // ============================================================
  // GRID 17
  // Rows: Patriots, Bears, Dolphins
  // Cols: Giants, 1000+ Rushing Yards Season, 30+ TD Season
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'New England Patriots', value: 'patriots' },
      { type: 'team', label: 'Chicago Bears', value: 'bears' },
      { type: 'team', label: 'Miami Dolphins', value: 'dolphins' },
    ],
    cols: [
      { type: 'team', label: 'New York Giants', value: 'giants' },
      { type: 'stat', label: '1000+ Rushing Yards Season', value: '1000rush' },
      { type: 'stat', label: '30+ TD Season', value: '30td' },
    ],
    cells: [
      // Patriots + Giants (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Phil Simms', 'Dave Meggett', 'Danny Kanell', 'Kerry Collins', 'Brandon LaFell'] },
      // Patriots + 1000+ Rushing Yards
      { rowIndex: 0, colIndex: 1, validPlayers: ['Corey Dillon', 'Curtis Martin', 'Robert Edwards', 'LeGarrette Blount', 'Stevan Ridley', 'Jim Nance', 'Sony Michel'] },
      // Patriots + 30+ TD Season
      { rowIndex: 0, colIndex: 2, validPlayers: ['Tom Brady', 'Drew Bledsoe', 'Cam Newton', 'Mac Jones', 'Matt Cassel'] },
      // Bears + Giants (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Kerry Collins', 'Mark Bavaro', 'Jason Pierre-Paul', 'Brandon Marshall', 'Alec Ogletree'] },
      // Bears + 1000+ Rushing Yards
      { rowIndex: 1, colIndex: 1, validPlayers: ['Walter Payton', 'Gale Sayers', 'Matt Forte', 'Thomas Jones', 'Jordan Howard', 'Neal Anderson', 'Khalil Herbert'] },
      // Bears + 30+ TD Season
      { rowIndex: 1, colIndex: 2, validPlayers: ['Jay Cutler', 'Erik Kramer', 'Jim McMahon', 'Sid Luckman', 'Mitchell Trubisky'] },
      // Dolphins + Giants (played for both)
      { rowIndex: 2, colIndex: 0, validPlayers: ['Jay Ajayi', 'Chad Pennington', 'Brandon Marshall', 'LaRon Landry', 'Plaxico Burress'] },
      // Dolphins + 1000+ Rushing Yards
      { rowIndex: 2, colIndex: 1, validPlayers: ['Larry Csonka', 'Ricky Williams', 'Lamar Miller', 'Ronnie Brown', 'Mercury Morris', 'Jay Ajayi'] },
      // Dolphins + 30+ TD Season
      { rowIndex: 2, colIndex: 2, validPlayers: ['Dan Marino', 'Tua Tagovailoa', 'Bob Griese', 'Ryan Tannehill', 'Jay Fiedler'] },
    ],
  },

  // ============================================================
  // GRID 18
  // Rows: 49ers, Eagles, Offensive Player of Year
  // Cols: Broncos, 10+ Sacks Season, 1500+ Receiving Yards Season
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'San Francisco 49ers', value: '49ers' },
      { type: 'team', label: 'Philadelphia Eagles', value: 'eagles' },
      { type: 'award', label: 'Offensive Player of Year', value: 'opoy' },
    ],
    cols: [
      { type: 'team', label: 'Denver Broncos', value: 'broncos' },
      { type: 'stat', label: '10+ Sacks Season', value: '10sacks' },
      { type: 'stat', label: '1500+ Receiving Yards Season', value: '1500rec' },
    ],
    cells: [
      // 49ers + Broncos (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Steve Young', 'John Elway', 'Joe Montana', 'Jerry Rice', 'Terrell Owens'] },
      // 49ers + 10+ Sacks
      { rowIndex: 0, colIndex: 1, validPlayers: ['Charles Haley', 'Fred Dean', 'Nick Bosa', 'Aldon Smith', 'Dana Stubblefield', 'Chris Doleman'] },
      // 49ers + 1500+ Receiving Yards
      { rowIndex: 0, colIndex: 2, validPlayers: ['Jerry Rice', 'Terrell Owens', 'Isaac Bruce', 'John Taylor', 'Deebo Samuel'] },
      // Eagles + Broncos (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Brian Dawkins', 'Darian Stewart', 'DeMarcus Ware', 'Emmanuel Sanders', 'Aqib Talib'] },
      // Eagles + 10+ Sacks
      { rowIndex: 1, colIndex: 1, validPlayers: ['Reggie White', 'Clyde Simmons', 'Hugh Douglas', 'Trent Cole', 'Greg Brown', 'Haason Reddick'] },
      // Eagles + 1500+ Receiving Yards
      { rowIndex: 1, colIndex: 2, validPlayers: ['Terrell Owens', 'Mike Quick', 'DeSean Jackson', 'A.J. Brown', 'DeVonta Smith'] },
      // OPOY + Broncos
      { rowIndex: 2, colIndex: 0, validPlayers: ['Terrell Davis', 'Peyton Manning', 'Shannon Sharpe', 'Rod Smith', 'Clinton Portis'] },
      // OPOY + 10+ Sacks
      { rowIndex: 2, colIndex: 1, validPlayers: ['Lawrence Taylor', 'Reggie White', 'Michael Strahan', 'J.J. Watt', 'Aaron Donald'] },
      // OPOY + 1500+ Receiving Yards
      { rowIndex: 2, colIndex: 2, validPlayers: ['Jerry Rice', 'Cooper Kupp', 'Michael Thomas', 'Marvin Harrison', 'Randy Moss'] },
    ],
  },

  // ============================================================
  // GRID 19
  // Rows: Rams, Raiders, Walter Payton Man of Year
  // Cols: Chiefs, NFL MVP, 100+ Receptions Season
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Los Angeles Rams', value: 'rams' },
      { type: 'team', label: 'Las Vegas Raiders', value: 'raiders' },
      { type: 'award', label: 'Walter Payton Man of Year', value: 'wpmoy' },
    ],
    cols: [
      { type: 'team', label: 'Kansas City Chiefs', value: 'chiefs' },
      { type: 'award', label: 'NFL MVP', value: 'nfl-mvp' },
      { type: 'stat', label: '100+ Receptions Season', value: '100rec' },
    ],
    cells: [
      // Rams + Chiefs (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Marcus Peters', 'Eric Berry', 'Dante Hall', 'Marshall Faulk', 'Trent Green'] },
      // Rams + NFL MVP
      { rowIndex: 0, colIndex: 1, validPlayers: ['Kurt Warner', 'Marshall Faulk', 'Roman Gabriel', 'Norm Van Brocklin', 'Eric Dickerson'] },
      // Rams + 100+ Receptions
      { rowIndex: 0, colIndex: 2, validPlayers: ['Cooper Kupp', 'Isaac Bruce', 'Torry Holt', 'Puka Nacua', 'Robert Woods'] },
      // Raiders + Chiefs (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Rich Gannon', 'Marcus Allen', 'Bo Jackson', 'Dave Casper', 'Amari Cooper'] },
      // Raiders + NFL MVP
      { rowIndex: 1, colIndex: 1, validPlayers: ['Rich Gannon', 'Marcus Allen', 'Ken Stabler', 'Jim Plunkett', 'Tim Brown'] },
      // Raiders + 100+ Receptions
      { rowIndex: 1, colIndex: 2, validPlayers: ['Tim Brown', 'Jerry Rice', 'Darren Waller', 'Amari Cooper', 'Andre Rison'] },
      // WPMOY + Chiefs
      { rowIndex: 2, colIndex: 0, validPlayers: ['Derrick Thomas', 'Will Shields', 'Brian Waters', 'Priest Holmes', 'Tony Gonzalez'] },
      // WPMOY + NFL MVP
      { rowIndex: 2, colIndex: 1, validPlayers: ['Peyton Manning', 'Walter Payton', 'Troy Aikman', 'Drew Brees', 'Russell Wilson', 'Eli Manning'] },
      // WPMOY + 100+ Receptions
      { rowIndex: 2, colIndex: 2, validPlayers: ['Larry Fitzgerald', 'Drew Brees', 'Peyton Manning', 'Troy Aikman', 'Calais Campbell'] },
    ],
  },

  // ============================================================
  // GRID 20
  // Rows: Steelers, Seahawks, 1000+ Rushing Yards Season
  // Cols: Packers, 30+ TD Season, Offensive Rookie of Year
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Pittsburgh Steelers', value: 'steelers' },
      { type: 'team', label: 'Seattle Seahawks', value: 'seahawks' },
      { type: 'stat', label: '1000+ Rushing Yards Season', value: '1000rush' },
    ],
    cols: [
      { type: 'team', label: 'Green Bay Packers', value: 'packers' },
      { type: 'stat', label: '30+ TD Season', value: '30td' },
      { type: 'award', label: 'Offensive Rookie of Year', value: 'oroy' },
    ],
    cells: [
      // Steelers + Packers (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Santonio Holmes', 'James Harrison', 'Ryan Clark', 'Willie Parker', 'Woodley'] },
      // Steelers + 30+ TD Season
      { rowIndex: 0, colIndex: 1, validPlayers: ['Ben Roethlisberger', 'Terry Bradshaw', 'Kordell Stewart', 'Neil ODonnell', 'Tommy Maddox'] },
      // Steelers + OROY
      { rowIndex: 0, colIndex: 2, validPlayers: ['Franco Harris', 'Ben Roethlisberger', 'Jerome Bettis', 'Le\'Veon Bell', 'Najee Harris'] },
      // Seahawks + Packers (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Matt Hasselbeck', 'Ahman Green', 'Jimmy Graham', 'Ricardo Lockette', 'Eddie Lacy'] },
      // Seahawks + 30+ TD Season
      { rowIndex: 1, colIndex: 1, validPlayers: ['Russell Wilson', 'Matt Hasselbeck', 'Dave Krieg', 'Jim Zorn', 'Shaun Alexander'] },
      // Seahawks + OROY
      { rowIndex: 1, colIndex: 2, validPlayers: ['Shaun Alexander', 'Curt Warner', 'Russell Wilson', 'Chris Warren', 'Kenneth Walker III'] },
      // 1000+ Rush Yards + Packers
      { rowIndex: 2, colIndex: 0, validPlayers: ['Ahman Green', 'Eddie Lacy', 'Ryan Grant', 'Dorsey Levens', 'Aaron Jones', 'Jim Taylor'] },
      // 1000+ Rush Yards + 30+ TD Season
      { rowIndex: 2, colIndex: 1, validPlayers: ['LaDainian Tomlinson', 'Shaun Alexander', 'Emmitt Smith', 'Marshall Faulk', 'Priest Holmes', 'Adrian Peterson'] },
      // 1000+ Rush Yards + OROY
      { rowIndex: 2, colIndex: 2, validPlayers: ['Eric Dickerson', 'Eddie George', 'Earl Campbell', 'Mike Anderson', 'Saquon Barkley', 'Robert Griffin III'] },
    ],
  },

  // ============================================================
  // GRID 21
  // Rows: Cowboys, Ravens, Defensive Player of Year
  // Cols: Patriots, 1500+ Receiving Yards Season, Pro Bowl Selection
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Dallas Cowboys', value: 'cowboys' },
      { type: 'team', label: 'Baltimore Ravens', value: 'ravens' },
      { type: 'award', label: 'Defensive Player of Year', value: 'dpoy' },
    ],
    cols: [
      { type: 'team', label: 'New England Patriots', value: 'patriots' },
      { type: 'stat', label: '1500+ Receiving Yards Season', value: '1500rec' },
      { type: 'stat', label: 'Pro Bowl Selection', value: 'pro-bowl' },
    ],
    cells: [
      // Cowboys + Patriots (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Drew Bledsoe', 'Joey Galloway', 'Martellus Bennett', 'Bobby Carpenter', 'Patrick Chung'] },
      // Cowboys + 1500+ Receiving Yards
      { rowIndex: 0, colIndex: 1, validPlayers: ['Michael Irvin', 'Dez Bryant', 'CeeDee Lamb', 'Bob Hayes', 'Drew Pearson'] },
      // Cowboys + Pro Bowl
      { rowIndex: 0, colIndex: 2, validPlayers: ['Emmitt Smith', 'Troy Aikman', 'Michael Irvin', 'DeMarcus Ware', 'Jason Witten', 'Larry Allen', 'Deion Sanders', 'Dez Bryant', 'Tony Romo'] },
      // Ravens + Patriots (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Anquan Boldin', 'Steve Smith Sr.', 'Lee Evans', 'Danny Woodhead', 'Brandon Stokley'] },
      // Ravens + 1500+ Receiving Yards
      { rowIndex: 1, colIndex: 1, validPlayers: ['Steve Smith Sr.', 'Derrick Mason', 'Torrey Smith', 'Anquan Boldin', 'Michael Jackson'] },
      // Ravens + Pro Bowl
      { rowIndex: 1, colIndex: 2, validPlayers: ['Ray Lewis', 'Ed Reed', 'Jonathan Ogden', 'Terrell Suggs', 'Lamar Jackson', 'Justin Tucker', 'Haloti Ngata', 'Marshal Yanda'] },
      // DPOY + Patriots
      { rowIndex: 2, colIndex: 0, validPlayers: ['Andre Tippett', 'Mike Haynes', 'Ty Law', 'Stephon Gilmore', 'Richard Seymour'] },
      // DPOY + 1500+ Receiving Yards
      { rowIndex: 2, colIndex: 1, validPlayers: ['Lawrence Taylor', 'Reggie White', 'J.J. Watt', 'Aaron Donald', 'Charles Woodson'] },
      // DPOY + Pro Bowl
      { rowIndex: 2, colIndex: 2, validPlayers: ['Lawrence Taylor', 'Reggie White', 'Ray Lewis', 'J.J. Watt', 'Aaron Donald', 'Von Miller', 'Charles Woodson', 'Ed Reed', 'Bruce Smith'] },
    ],
  },

  // ============================================================
  // GRID 22
  // Rows: Chiefs, 49ers, Broncos
  // Cols: Raiders, 100+ Receptions Season, Super Bowl MVP
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Kansas City Chiefs', value: 'chiefs' },
      { type: 'team', label: 'San Francisco 49ers', value: '49ers' },
      { type: 'team', label: 'Denver Broncos', value: 'broncos' },
    ],
    cols: [
      { type: 'team', label: 'Las Vegas Raiders', value: 'raiders' },
      { type: 'stat', label: '100+ Receptions Season', value: '100rec' },
      { type: 'award', label: 'Super Bowl MVP', value: 'sb-mvp' },
    ],
    cells: [
      // Chiefs + Raiders (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Marcus Allen', 'Rich Gannon', 'Bo Jackson', 'Dave Casper', 'Amari Cooper'] },
      // Chiefs + 100+ Receptions
      { rowIndex: 0, colIndex: 1, validPlayers: ['Travis Kelce', 'Tony Gonzalez', 'Tyreek Hill', 'Dwayne Bowe', 'Derrick Alexander'] },
      // Chiefs + Super Bowl MVP
      { rowIndex: 0, colIndex: 2, validPlayers: ['Patrick Mahomes', 'Len Dawson'] },
      // 49ers + Raiders (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Jerry Rice', 'Ronnie Lott', 'Tim Brown', 'Charles Woodson', 'Randy Moss'] },
      // 49ers + 100+ Receptions
      { rowIndex: 1, colIndex: 1, validPlayers: ['Jerry Rice', 'Terrell Owens', 'Roger Craig', 'Brandon Aiyuk', 'George Kittle'] },
      // 49ers + Super Bowl MVP
      { rowIndex: 1, colIndex: 2, validPlayers: ['Joe Montana', 'Steve Young', 'Jerry Rice'] },
      // Broncos + Raiders (played for both)
      { rowIndex: 2, colIndex: 0, validPlayers: ['Rod Smith', 'Marcus Allen', 'Mike Shanahan', 'Jerry Rice', 'Shannon Sharpe'] },
      // Broncos + 100+ Receptions
      { rowIndex: 2, colIndex: 1, validPlayers: ['Rod Smith', 'Demaryius Thomas', 'Brandon Marshall', 'Wes Welker', 'Ed McCaffrey', 'Shannon Sharpe'] },
      // Broncos + Super Bowl MVP
      { rowIndex: 2, colIndex: 2, validPlayers: ['Terrell Davis', 'John Elway', 'Von Miller', 'Peyton Manning', 'DeMarcus Ware'] },
    ],
  },

  // ============================================================
  // GRID 23
  // Rows: Eagles, Rams, 10+ Sacks Season
  // Cols: Dolphins, NFL MVP, 4000+ Passing Yards Season
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Philadelphia Eagles', value: 'eagles' },
      { type: 'team', label: 'Los Angeles Rams', value: 'rams' },
      { type: 'stat', label: '10+ Sacks Season', value: '10sacks' },
    ],
    cols: [
      { type: 'team', label: 'Miami Dolphins', value: 'dolphins' },
      { type: 'award', label: 'NFL MVP', value: 'nfl-mvp' },
      { type: 'stat', label: '4000+ Passing Yards Season', value: '4000pass' },
    ],
    cells: [
      // Eagles + Dolphins (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Wes Welker', 'Byron Maxwell', 'Jay Ajayi', 'Sam Bradford', 'DeMarco Murray'] },
      // Eagles + NFL MVP
      { rowIndex: 0, colIndex: 1, validPlayers: ['Randall Cunningham', 'Donovan McNabb', 'Steve Van Buren', 'Norm Van Brocklin', 'Jalen Hurts'] },
      // Eagles + 4000+ Passing Yards
      { rowIndex: 0, colIndex: 2, validPlayers: ['Donovan McNabb', 'Carson Wentz', 'Jalen Hurts', 'Randall Cunningham', 'Sam Bradford'] },
      // Rams + Dolphins (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Bob Griese', 'Larry Csonka', 'Vince Ferragamo', 'Jack Youngblood', 'Wes Chandler'] },
      // Rams + NFL MVP
      { rowIndex: 1, colIndex: 1, validPlayers: ['Kurt Warner', 'Marshall Faulk', 'Roman Gabriel', 'Norm Van Brocklin', 'Eric Dickerson'] },
      // Rams + 4000+ Passing Yards
      { rowIndex: 1, colIndex: 2, validPlayers: ['Kurt Warner', 'Marc Bulger', 'Jared Goff', 'Matthew Stafford', 'Sam Bradford'] },
      // 10+ Sacks + Dolphins
      { rowIndex: 2, colIndex: 0, validPlayers: ['Jason Taylor', 'Cameron Wake', 'Bill Stanfill', 'Trace Armstrong', 'Adewale Ogunleye'] },
      // 10+ Sacks + NFL MVP
      { rowIndex: 2, colIndex: 1, validPlayers: ['Lawrence Taylor', 'Reggie White', 'J.J. Watt', 'Alan Page', 'Mark Gastineau'] },
      // 10+ Sacks + 4000+ Passing Yards
      { rowIndex: 2, colIndex: 2, validPlayers: ['J.J. Watt', 'Julius Peppers', 'Dwight Freeney', 'Jason Taylor', 'Robert Quinn'] },
    ],
  },

  // ============================================================
  // GRID 24
  // Rows: Giants, Bears, Packers
  // Cols: Cowboys, 1000+ Rushing Yards Season, Offensive Player of Year
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'New York Giants', value: 'giants' },
      { type: 'team', label: 'Chicago Bears', value: 'bears' },
      { type: 'team', label: 'Green Bay Packers', value: 'packers' },
    ],
    cols: [
      { type: 'team', label: 'Dallas Cowboys', value: 'cowboys' },
      { type: 'stat', label: '1000+ Rushing Yards Season', value: '1000rush' },
      { type: 'award', label: 'Offensive Player of Year', value: 'opoy' },
    ],
    cells: [
      // Giants + Cowboys (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Jason Pierre-Paul', 'Brandon Jacobs', 'Plaxico Burress', 'Everson Walls', 'Kerry Collins'] },
      // Giants + 1000+ Rushing Yards
      { rowIndex: 0, colIndex: 1, validPlayers: ['Tiki Barber', 'Saquon Barkley', 'Joe Morris', 'Ron Dayne', 'Rodney Hampton', 'Ottis Anderson'] },
      // Giants + OPOY
      { rowIndex: 0, colIndex: 2, validPlayers: ['Lawrence Taylor', 'Eli Manning', 'Odell Beckham Jr.', 'Tiki Barber', 'Michael Strahan'] },
      // Bears + Cowboys (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Jay Cutler', 'Greg Olsen', 'Roy Williams', 'Mike Ditka', 'Devin Hester'] },
      // Bears + 1000+ Rushing Yards
      { rowIndex: 1, colIndex: 1, validPlayers: ['Walter Payton', 'Gale Sayers', 'Matt Forte', 'Thomas Jones', 'Jordan Howard', 'Neal Anderson'] },
      // Bears + OPOY
      { rowIndex: 1, colIndex: 2, validPlayers: ['Walter Payton', 'Gale Sayers', 'Dick Butkus', 'Mike Singletary', 'Devin Hester'] },
      // Packers + Cowboys (played for both)
      { rowIndex: 2, colIndex: 0, validPlayers: ['Brett Favre', 'Ryan Longwell', 'Craig Hentrich', 'Seth Joyner', 'George Teague'] },
      // Packers + 1000+ Rushing Yards
      { rowIndex: 2, colIndex: 1, validPlayers: ['Ahman Green', 'Eddie Lacy', 'Ryan Grant', 'Aaron Jones', 'Jim Taylor', 'Dorsey Levens'] },
      // Packers + OPOY
      { rowIndex: 2, colIndex: 2, validPlayers: ['Aaron Rodgers', 'Brett Favre', 'Davante Adams', 'Sterling Sharpe', 'Jim Taylor'] },
    ],
  },

  // ============================================================
  // GRID 25
  // Rows: Patriots, Steelers, Pro Bowl Selection
  // Cols: Eagles, Seahawks, 30+ TD Season
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'New England Patriots', value: 'patriots' },
      { type: 'team', label: 'Pittsburgh Steelers', value: 'steelers' },
      { type: 'stat', label: 'Pro Bowl Selection', value: 'pro-bowl' },
    ],
    cols: [
      { type: 'team', label: 'Philadelphia Eagles', value: 'eagles' },
      { type: 'team', label: 'Seattle Seahawks', value: 'seahawks' },
      { type: 'stat', label: '30+ TD Season', value: '30td' },
    ],
    cells: [
      // Patriots + Eagles (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Asante Samuel', 'Mike Vrabel', 'LeGarrette Blount', 'Chris Long', 'Malcolm Jenkins'] },
      // Patriots + Seahawks (played for both)
      { rowIndex: 0, colIndex: 1, validPlayers: ['Darrelle Revis', 'Brandon Browner', 'LeGarrette Blount', 'Brandin Cooks', 'Aqib Talib'] },
      // Patriots + 30+ TD Season
      { rowIndex: 0, colIndex: 2, validPlayers: ['Tom Brady', 'Drew Bledsoe', 'Cam Newton', 'Mac Jones', 'Matt Cassel'] },
      // Steelers + Eagles (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['James Harrison', 'Mike Wallace', 'DeAngelo Williams', 'Emmanuel Sanders', 'Kevin Curtis'] },
      // Steelers + Seahawks (played for both)
      { rowIndex: 1, colIndex: 1, validPlayers: ['Joey Porter', 'Jerramy Stevens', 'Ricardo Colclough', 'Larry Foote', 'Deshea Townsend'] },
      // Steelers + 30+ TD Season
      { rowIndex: 1, colIndex: 2, validPlayers: ['Ben Roethlisberger', 'Terry Bradshaw', 'Kordell Stewart', 'Tommy Maddox', 'Neil ODonnell'] },
      // Pro Bowl + Eagles
      { rowIndex: 2, colIndex: 0, validPlayers: ['Reggie White', 'Donovan McNabb', 'Brian Dawkins', 'LeSean McCoy', 'Fletcher Cox', 'Jason Peters', 'Randall Cunningham'] },
      // Pro Bowl + Seahawks
      { rowIndex: 2, colIndex: 1, validPlayers: ['Russell Wilson', 'Marshawn Lynch', 'Richard Sherman', 'Earl Thomas', 'Bobby Wagner', 'Steve Largent', 'Walter Jones', 'Cortez Kennedy'] },
      // Pro Bowl + 30+ TD Season
      { rowIndex: 2, colIndex: 2, validPlayers: ['Tom Brady', 'Peyton Manning', 'Patrick Mahomes', 'Aaron Rodgers', 'Drew Brees', 'Dan Marino', 'Brett Favre', 'Russell Wilson'] },
    ],
  },

  // ============================================================
  // GRID 26
  // Rows: Ravens, Broncos, Super Bowl MVP
  // Cols: Giants, 4000+ Passing Yards Season, Defensive Player of Year
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Baltimore Ravens', value: 'ravens' },
      { type: 'team', label: 'Denver Broncos', value: 'broncos' },
      { type: 'award', label: 'Super Bowl MVP', value: 'sb-mvp' },
    ],
    cols: [
      { type: 'team', label: 'New York Giants', value: 'giants' },
      { type: 'stat', label: '4000+ Passing Yards Season', value: '4000pass' },
      { type: 'award', label: 'Defensive Player of Year', value: 'dpoy' },
    ],
    cells: [
      // Ravens + Giants (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Tiki Barber', 'Michael Strahan', 'Brandon Stokley', 'Sam Koch', 'Kyle Boller'] },
      // Ravens + 4000+ Passing Yards
      { rowIndex: 0, colIndex: 1, validPlayers: ['Joe Flacco', 'Lamar Jackson', 'Vinny Testaverde', 'Steve McNair', 'Kyle Boller'] },
      // Ravens + DPOY
      { rowIndex: 0, colIndex: 2, validPlayers: ['Ray Lewis', 'Ed Reed', 'Terrell Suggs', 'Peter Boulware', 'Haloti Ngata'] },
      // Broncos + Giants (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Mark Jackson', 'Karl Mecklenburg', 'Brandon Marshall', 'Peyton Manning', 'John Elway'] },
      // Broncos + 4000+ Passing Yards
      { rowIndex: 1, colIndex: 1, validPlayers: ['John Elway', 'Peyton Manning', 'Jay Cutler', 'Jake Plummer', 'Drew Lock'] },
      // Broncos + DPOY
      { rowIndex: 1, colIndex: 2, validPlayers: ['Von Miller', 'Karl Mecklenburg', 'Steve Atwater', 'Champ Bailey', 'DeMarcus Ware'] },
      // Super Bowl MVP + Giants
      { rowIndex: 2, colIndex: 0, validPlayers: ['Eli Manning', 'Ottis Anderson', 'Phil Simms', 'Mark Bavaro', 'Michael Strahan'] },
      // Super Bowl MVP + 4000+ Passing Yards
      { rowIndex: 2, colIndex: 1, validPlayers: ['Tom Brady', 'Patrick Mahomes', 'Peyton Manning', 'Kurt Warner', 'Aaron Rodgers', 'Joe Montana', 'Eli Manning'] },
      // Super Bowl MVP + DPOY
      { rowIndex: 2, colIndex: 2, validPlayers: ['Harvey Martin', 'Ray Lewis', 'Von Miller', 'Richard Dent', 'Charles Haley'] },
    ],
  },

  // ============================================================
  // GRID 27
  // Rows: Dolphins, Cowboys, Offensive Rookie of Year
  // Cols: Bears, 10+ Sacks Season, 1000+ Rushing Yards Season
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Miami Dolphins', value: 'dolphins' },
      { type: 'team', label: 'Dallas Cowboys', value: 'cowboys' },
      { type: 'award', label: 'Offensive Rookie of Year', value: 'oroy' },
    ],
    cols: [
      { type: 'team', label: 'Chicago Bears', value: 'bears' },
      { type: 'stat', label: '10+ Sacks Season', value: '10sacks' },
      { type: 'stat', label: '1000+ Rushing Yards Season', value: '1000rush' },
    ],
    cells: [
      // Dolphins + Bears (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Jay Cutler', 'Brandon Marshall', 'Thomas Jones', 'Jared Allen', 'Ted Ginn Jr.'] },
      // Dolphins + 10+ Sacks
      { rowIndex: 0, colIndex: 1, validPlayers: ['Jason Taylor', 'Cameron Wake', 'Bill Stanfill', 'Trace Armstrong', 'Adewale Ogunleye'] },
      // Dolphins + 1000+ Rushing Yards
      { rowIndex: 0, colIndex: 2, validPlayers: ['Larry Csonka', 'Ricky Williams', 'Lamar Miller', 'Ronnie Brown', 'Mercury Morris', 'Jay Ajayi'] },
      // Cowboys + Bears (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Jay Cutler', 'Greg Olsen', 'Roy Williams', 'Mike Ditka', 'Devin Hester'] },
      // Cowboys + 10+ Sacks
      { rowIndex: 1, colIndex: 1, validPlayers: ['DeMarcus Ware', 'Charles Haley', 'Harvey Martin', 'Jim Jeffcoat', 'Micah Parsons', 'Greg Ellis'] },
      // Cowboys + 1000+ Rushing Yards
      { rowIndex: 1, colIndex: 2, validPlayers: ['Emmitt Smith', 'Tony Dorsett', 'DeMarco Murray', 'Ezekiel Elliott', 'Herschel Walker', 'Robert Newhouse'] },
      // OROY + Bears
      { rowIndex: 2, colIndex: 0, validPlayers: ['Gale Sayers', 'Walter Payton', 'Mike Ditka', 'Justin Fields', 'Khalil Herbert'] },
      // OROY + 10+ Sacks
      { rowIndex: 2, colIndex: 1, validPlayers: ['Aldon Smith', 'Jevon Kearse', 'Clay Matthews', 'Dwight Freeney', 'Julius Peppers'] },
      // OROY + 1000+ Rushing Yards
      { rowIndex: 2, colIndex: 2, validPlayers: ['Eric Dickerson', 'Eddie George', 'Earl Campbell', 'Mike Anderson', 'Saquon Barkley', 'Ezekiel Elliott'] },
    ],
  },

  // ============================================================
  // GRID 28
  // Rows: Packers, Raiders, 100+ Receptions Season
  // Cols: 49ers, Super Bowl MVP, NFL MVP
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Green Bay Packers', value: 'packers' },
      { type: 'team', label: 'Las Vegas Raiders', value: 'raiders' },
      { type: 'stat', label: '100+ Receptions Season', value: '100rec' },
    ],
    cols: [
      { type: 'team', label: 'San Francisco 49ers', value: '49ers' },
      { type: 'award', label: 'Super Bowl MVP', value: 'sb-mvp' },
      { type: 'award', label: 'NFL MVP', value: 'nfl-mvp' },
    ],
    cells: [
      // Packers + 49ers (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Charles Woodson', 'Reggie White', 'Brett Favre', 'Desmond Howard', 'Jim Taylor'] },
      // Packers + Super Bowl MVP
      { rowIndex: 0, colIndex: 1, validPlayers: ['Bart Starr', 'Aaron Rodgers', 'Desmond Howard'] },
      // Packers + NFL MVP
      { rowIndex: 0, colIndex: 2, validPlayers: ['Aaron Rodgers', 'Brett Favre', 'Bart Starr', 'Jim Taylor', 'Paul Hornung'] },
      // Raiders + 49ers (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Jerry Rice', 'Ronnie Lott', 'Tim Brown', 'Charles Woodson', 'Randy Moss'] },
      // Raiders + Super Bowl MVP
      { rowIndex: 1, colIndex: 1, validPlayers: ['Fred Biletnikoff', 'Jim Plunkett', 'Marcus Allen', 'Rich Gannon', 'Jerry Rice'] },
      // Raiders + NFL MVP
      { rowIndex: 1, colIndex: 2, validPlayers: ['Rich Gannon', 'Marcus Allen', 'Ken Stabler', 'Jim Plunkett', 'Tim Brown'] },
      // 100+ Receptions + 49ers
      { rowIndex: 2, colIndex: 0, validPlayers: ['Jerry Rice', 'Terrell Owens', 'George Kittle', 'Brandon Aiyuk', 'Roger Craig'] },
      // 100+ Receptions + Super Bowl MVP
      { rowIndex: 2, colIndex: 1, validPlayers: ['Jerry Rice', 'Julian Edelman', 'Hines Ward', 'Deion Branch', 'Lynn Swann'] },
      // 100+ Receptions + NFL MVP
      { rowIndex: 2, colIndex: 2, validPlayers: ['Marshall Faulk', 'Peyton Manning', 'Tom Brady', 'Kurt Warner', 'Aaron Rodgers'] },
    ],
  },

  // ============================================================
  // GRID 29
  // Rows: Seahawks, Steelers, Walter Payton Man of Year
  // Cols: Rams, 1500+ Receiving Yards Season, 30+ TD Season
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Seattle Seahawks', value: 'seahawks' },
      { type: 'team', label: 'Pittsburgh Steelers', value: 'steelers' },
      { type: 'award', label: 'Walter Payton Man of Year', value: 'wpmoy' },
    ],
    cols: [
      { type: 'team', label: 'Los Angeles Rams', value: 'rams' },
      { type: 'stat', label: '1500+ Receiving Yards Season', value: '1500rec' },
      { type: 'stat', label: '30+ TD Season', value: '30td' },
    ],
    cells: [
      // Seahawks + Rams (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Steven Jackson', 'Sam Bradford', 'Jeff Fisher', 'Robert Quinn', 'Curt Warner'] },
      // Seahawks + 1500+ Receiving Yards
      { rowIndex: 0, colIndex: 1, validPlayers: ['Steve Largent', 'DK Metcalf', 'Tyler Lockett', 'Brian Blades', 'Darrell Jackson'] },
      // Seahawks + 30+ TD Season
      { rowIndex: 0, colIndex: 2, validPlayers: ['Russell Wilson', 'Matt Hasselbeck', 'Dave Krieg', 'Shaun Alexander', 'Jim Zorn'] },
      // Steelers + Rams (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Eric Dickerson', 'Merril Hoge', 'Kevin Greene', 'Jack Lambert', 'Dermontti Dawson'] },
      // Steelers + 1500+ Receiving Yards
      { rowIndex: 1, colIndex: 1, validPlayers: ['Antonio Brown', 'Hines Ward', 'Lynn Swann', 'John Stallworth', 'JuJu Smith-Schuster'] },
      // Steelers + 30+ TD Season
      { rowIndex: 1, colIndex: 2, validPlayers: ['Ben Roethlisberger', 'Terry Bradshaw', 'Kordell Stewart', 'Neil ODonnell', 'Tommy Maddox'] },
      // WPMOY + Rams
      { rowIndex: 2, colIndex: 0, validPlayers: ['Kurt Warner', 'Marshall Faulk', 'Isaac Bruce', 'Steven Jackson', 'Andrew Whitworth'] },
      // WPMOY + 1500+ Receiving Yards
      { rowIndex: 2, colIndex: 1, validPlayers: ['Larry Fitzgerald', 'Drew Brees', 'Peyton Manning', 'Calais Campbell', 'Walter Payton'] },
      // WPMOY + 30+ TD Season
      { rowIndex: 2, colIndex: 2, validPlayers: ['Peyton Manning', 'Drew Brees', 'Russell Wilson', 'Matt Ryan', 'Eli Manning'] },
    ],
  },

  // ============================================================
  // GRID 30
  // Rows: Chiefs, Packers, Defensive Player of Year
  // Cols: Steelers, 1000+ Rushing Yards Season, 4000+ Passing Yards Season
  // ============================================================
  {
    league: 'NFL',
    rows: [
      { type: 'team', label: 'Kansas City Chiefs', value: 'chiefs' },
      { type: 'team', label: 'Green Bay Packers', value: 'packers' },
      { type: 'award', label: 'Defensive Player of Year', value: 'dpoy' },
    ],
    cols: [
      { type: 'team', label: 'Pittsburgh Steelers', value: 'steelers' },
      { type: 'stat', label: '1000+ Rushing Yards Season', value: '1000rush' },
      { type: 'stat', label: '4000+ Passing Yards Season', value: '4000pass' },
    ],
    cells: [
      // Chiefs + Steelers (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Le\'Veon Bell', 'Neil Smith', 'Joe Montana', 'Steve Bono', 'Larry Johnson'] },
      // Chiefs + 1000+ Rushing Yards
      { rowIndex: 0, colIndex: 1, validPlayers: ['Priest Holmes', 'Larry Johnson', 'Jamaal Charles', 'Christian Okoye', 'Joe Delaney', 'Kareem Hunt'] },
      // Chiefs + 4000+ Passing Yards
      { rowIndex: 0, colIndex: 2, validPlayers: ['Patrick Mahomes', 'Trent Green', 'Alex Smith', 'Matt Cassel', 'Len Dawson'] },
      // Packers + Steelers (played for both)
      { rowIndex: 1, colIndex: 0, validPlayers: ['Santonio Holmes', 'Kevin Greene', 'Ryan Clark', 'Willie Parker', 'James Harrison'] },
      // Packers + 1000+ Rushing Yards
      { rowIndex: 1, colIndex: 1, validPlayers: ['Ahman Green', 'Eddie Lacy', 'Ryan Grant', 'Aaron Jones', 'Jim Taylor', 'Dorsey Levens'] },
      // Packers + 4000+ Passing Yards
      { rowIndex: 1, colIndex: 2, validPlayers: ['Aaron Rodgers', 'Brett Favre', 'Lynn Dickey', 'Don Majkowski', 'Jordan Love'] },
      // DPOY + Steelers
      { rowIndex: 2, colIndex: 0, validPlayers: ['Joe Greene', 'Jack Lambert', 'James Harrison', 'Troy Polamalu', 'Rod Woodson'] },
      // DPOY + 1000+ Rushing Yards
      { rowIndex: 2, colIndex: 1, validPlayers: ['Lawrence Taylor', 'Ray Lewis', 'Alan Page', 'Charles Woodson', 'Luke Kuechly'] },
      // DPOY + 4000+ Passing Yards
      { rowIndex: 2, colIndex: 2, validPlayers: ['Lawrence Taylor', 'J.J. Watt', 'Aaron Donald', 'Reggie White', 'Bruce Smith'] },
    ],
  },
];

export default NFL_GRIDS;
export type { CrossoverGrid, GridHeader, GridCell };
