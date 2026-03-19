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

const NBA_GRIDS: CrossoverGrid[] = [
  // ============================================================
  // GRID 1
  // Rows: Bulls, Lakers, MVP
  // Cols: Heat, 25+ PPG Season, Finals MVP
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Chicago Bulls', value: 'bulls' },
      { type: 'team', label: 'Los Angeles Lakers', value: 'lakers' },
      { type: 'award', label: 'NBA MVP', value: 'mvp' },
    ],
    cols: [
      { type: 'team', label: 'Miami Heat', value: 'heat' },
      { type: 'stat', label: '25+ PPG Season', value: '25ppg' },
      { type: 'award', label: 'Finals MVP', value: 'finals-mvp' },
    ],
    cells: [
      // Bulls + Heat
      { rowIndex: 0, colIndex: 0, validPlayers: ['Jimmy Butler', 'Luol Deng', 'Scottie Pippen', 'Dennis Rodman', 'Ron Harper'] },
      // Bulls + 25+ PPG
      { rowIndex: 0, colIndex: 1, validPlayers: ['Michael Jordan', 'Scottie Pippen', 'Bob Love', 'Jimmy Butler', 'DeMar DeRozan'] },
      // Bulls + Finals MVP
      { rowIndex: 0, colIndex: 2, validPlayers: ['Michael Jordan', 'Kawhi Leonard', 'Andre Iguodala', 'Scottie Pippen', 'Dennis Rodman'] },
      // Lakers + Heat
      { rowIndex: 1, colIndex: 0, validPlayers: ['Shaquille O\'Neal', 'LeBron James', 'Lamar Odom', 'Gary Payton', 'Eddie Jones'] },
      // Lakers + 25+ PPG
      { rowIndex: 1, colIndex: 1, validPlayers: ['Kobe Bryant', 'LeBron James', 'Shaquille O\'Neal', 'Kareem Abdul-Jabbar', 'Jerry West'] },
      // Lakers + Finals MVP
      { rowIndex: 1, colIndex: 2, validPlayers: ['Kobe Bryant', 'Shaquille O\'Neal', 'LeBron James', 'Magic Johnson', 'Kareem Abdul-Jabbar'] },
      // MVP + Heat
      { rowIndex: 2, colIndex: 0, validPlayers: ['LeBron James', 'Shaquille O\'Neal', 'Tim Hardaway', 'Steve Nash', 'Alonzo Mourning'] },
      // MVP + 25+ PPG
      { rowIndex: 2, colIndex: 1, validPlayers: ['Michael Jordan', 'LeBron James', 'Kobe Bryant', 'Stephen Curry', 'Kevin Durant'] },
      // MVP + Finals MVP
      { rowIndex: 2, colIndex: 2, validPlayers: ['Michael Jordan', 'LeBron James', 'Shaquille O\'Neal', 'Kareem Abdul-Jabbar', 'Magic Johnson'] },
    ],
  },

  // ============================================================
  // GRID 2
  // Rows: Celtics, Warriors, DPOY
  // Cols: Lakers, 10+ RPG Season, All-Star
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Boston Celtics', value: 'celtics' },
      { type: 'team', label: 'Golden State Warriors', value: 'warriors' },
      { type: 'award', label: 'Defensive Player of Year', value: 'dpoy' },
    ],
    cols: [
      { type: 'team', label: 'Los Angeles Lakers', value: 'lakers' },
      { type: 'stat', label: '10+ RPG Season', value: '10rpg' },
      { type: 'award', label: 'All-Star Selection', value: 'allstar' },
    ],
    cells: [
      // Celtics + Lakers
      { rowIndex: 0, colIndex: 0, validPlayers: ['Shaquille O\'Neal', 'Rajon Rondo', 'Gary Payton', 'Rick Fox', 'Sam Jones'] },
      // Celtics + 10+ RPG
      { rowIndex: 0, colIndex: 1, validPlayers: ['Bill Russell', 'Kevin Garnett', 'Robert Parish', 'Dave Cowens', 'Larry Bird'] },
      // Celtics + All-Star
      { rowIndex: 0, colIndex: 2, validPlayers: ['Larry Bird', 'Paul Pierce', 'Kevin Garnett', 'Bob Cousy', 'John Havlicek'] },
      // Warriors + Lakers
      { rowIndex: 1, colIndex: 0, validPlayers: ['Wilt Chamberlain', 'Rick Barry', 'Chris Webber', 'D\'Angelo Russell', 'Kent Bazemore'] },
      // Warriors + 10+ RPG
      { rowIndex: 1, colIndex: 1, validPlayers: ['Wilt Chamberlain', 'Nate Thurmond', 'Chris Webber', 'Draymond Green', 'Andrew Bogut'] },
      // Warriors + All-Star
      { rowIndex: 1, colIndex: 2, validPlayers: ['Stephen Curry', 'Klay Thompson', 'Wilt Chamberlain', 'Rick Barry', 'Chris Mullin'] },
      // DPOY + Lakers
      { rowIndex: 2, colIndex: 0, validPlayers: ['Dwight Howard', 'Dikembe Mutombo', 'Marc Gasol', 'Tyson Chandler', 'Dennis Rodman'] },
      // DPOY + 10+ RPG
      { rowIndex: 2, colIndex: 1, validPlayers: ['Dwight Howard', 'Dennis Rodman', 'Ben Wallace', 'Dikembe Mutombo', 'Hakeem Olajuwon'] },
      // DPOY + All-Star
      { rowIndex: 2, colIndex: 2, validPlayers: ['Hakeem Olajuwon', 'Dwight Howard', 'Kevin Garnett', 'Dikembe Mutombo', 'Alonzo Mourning'] },
    ],
  },

  // ============================================================
  // GRID 3
  // Rows: Spurs, Heat, Rookie of Year
  // Cols: Celtics, 3x Champion, 25+ PPG Season
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'San Antonio Spurs', value: 'spurs' },
      { type: 'team', label: 'Miami Heat', value: 'heat' },
      { type: 'award', label: 'Rookie of the Year', value: 'roy' },
    ],
    cols: [
      { type: 'team', label: 'Boston Celtics', value: 'celtics' },
      { type: 'stat', label: '3x Champion', value: '3xchamp' },
      { type: 'stat', label: '25+ PPG Season', value: '25ppg' },
    ],
    cells: [
      // Spurs + Celtics
      { rowIndex: 0, colIndex: 0, validPlayers: ['Danny Green', 'Dennis Johnson', 'Dominique Wilkins', 'Artis Gilmore', 'DeMar DeRozan'] },
      // Spurs + 3x Champion
      { rowIndex: 0, colIndex: 1, validPlayers: ['Tim Duncan', 'Manu Ginobili', 'Tony Parker', 'Robert Horry', 'Danny Green'] },
      // Spurs + 25+ PPG
      { rowIndex: 0, colIndex: 2, validPlayers: ['George Gervin', 'David Robinson', 'Tim Duncan', 'DeMar DeRozan', 'Tracy McGrady'] },
      // Heat + Celtics
      { rowIndex: 1, colIndex: 0, validPlayers: ['Shaquille O\'Neal', 'Ray Allen', 'Alonzo Mourning', 'Gary Payton', 'P.J. Brown'] },
      // Heat + 3x Champion
      { rowIndex: 1, colIndex: 1, validPlayers: ['LeBron James', 'Dwyane Wade', 'Shaquille O\'Neal', 'Ray Allen', 'Gary Payton'] },
      // Heat + 25+ PPG
      { rowIndex: 1, colIndex: 2, validPlayers: ['LeBron James', 'Dwyane Wade', 'Shaquille O\'Neal', 'Jimmy Butler', 'Glen Rice'] },
      // ROY + Celtics
      { rowIndex: 2, colIndex: 0, validPlayers: ['Larry Bird', 'Dave Cowens', 'Tom Heinsohn', 'Malcolm Brogdon', 'Wes Unseld'] },
      // ROY + 3x Champion
      { rowIndex: 2, colIndex: 1, validPlayers: ['Larry Bird', 'Magic Johnson', 'Tim Duncan', 'Kareem Abdul-Jabbar', 'LeBron James'] },
      // ROY + 25+ PPG
      { rowIndex: 2, colIndex: 2, validPlayers: ['Allen Iverson', 'LeBron James', 'Michael Jordan', 'David Robinson', 'Wilt Chamberlain'] },
    ],
  },

  // ============================================================
  // GRID 4
  // Rows: Knicks, Nets, Sixth Man of Year
  // Cols: Bulls, All-Star, 10+ APG Season
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'New York Knicks', value: 'knicks' },
      { type: 'team', label: 'Brooklyn Nets', value: 'nets' },
      { type: 'award', label: 'Sixth Man of the Year', value: 'sixman' },
    ],
    cols: [
      { type: 'team', label: 'Chicago Bulls', value: 'bulls' },
      { type: 'award', label: 'All-Star Selection', value: 'allstar' },
      { type: 'stat', label: '10+ APG Season', value: '10apg' },
    ],
    cells: [
      // Knicks + Bulls
      { rowIndex: 0, colIndex: 0, validPlayers: ['Charles Oakley', 'Marcus Camby', 'Tyson Chandler', 'Derrick Rose', 'Eddy Curry'] },
      // Knicks + All-Star
      { rowIndex: 0, colIndex: 1, validPlayers: ['Patrick Ewing', 'Carmelo Anthony', 'Walt Frazier', 'Willis Reed', 'Bernard King'] },
      // Knicks + 10+ APG
      { rowIndex: 0, colIndex: 2, validPlayers: ['Walt Frazier', 'Mark Jackson', 'Stephon Marbury', 'Jalen Brunson', 'Chris Paul'] },
      // Nets + Bulls
      { rowIndex: 1, colIndex: 0, validPlayers: ['Vince Carter', 'Kerry Kittles', 'Jay Williams', 'Carlos Boozer', 'Derrick Rose'] },
      // Nets + All-Star
      { rowIndex: 1, colIndex: 1, validPlayers: ['Jason Kidd', 'Vince Carter', 'Kevin Durant', 'James Harden', 'Kyrie Irving'] },
      // Nets + 10+ APG
      { rowIndex: 1, colIndex: 2, validPlayers: ['Jason Kidd', 'James Harden', 'Deron Williams', 'Kevin Johnson', 'Stephon Marbury'] },
      // Sixth Man + Bulls
      { rowIndex: 2, colIndex: 0, validPlayers: ['Toni Kukoc', 'Ben Gordon', 'Jamal Crawford', 'Bobby Jackson', 'Ricky Pierce'] },
      // Sixth Man + All-Star
      { rowIndex: 2, colIndex: 1, validPlayers: ['James Harden', 'Kevin McHale', 'Manu Ginobili', 'Ricky Pierce', 'Detlef Schrempf'] },
      // Sixth Man + 10+ APG
      { rowIndex: 2, colIndex: 2, validPlayers: ['James Harden', 'Ricky Rubio', 'Jamal Crawford', 'Nate Robinson', 'Bobby Jackson'] },
    ],
  },

  // ============================================================
  // GRID 5
  // Rows: Bucks, Suns, Most Improved Player
  // Cols: Warriors, 2000+ Points Season, Finals MVP
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Milwaukee Bucks', value: 'bucks' },
      { type: 'team', label: 'Phoenix Suns', value: 'suns' },
      { type: 'award', label: 'Most Improved Player', value: 'mip' },
    ],
    cols: [
      { type: 'team', label: 'Golden State Warriors', value: 'warriors' },
      { type: 'stat', label: '2000+ Points Season', value: '2000pts' },
      { type: 'award', label: 'Finals MVP', value: 'finals-mvp' },
    ],
    cells: [
      // Bucks + Warriors
      { rowIndex: 0, colIndex: 0, validPlayers: ['Wilt Chamberlain', 'Bob Dandridge', 'Sidney Moncrief', 'Glenn Robinson', 'Tim Thomas'] },
      // Bucks + 2000+ Points Season
      { rowIndex: 0, colIndex: 1, validPlayers: ['Kareem Abdul-Jabbar', 'Giannis Antetokounmpo', 'Michael Redd', 'Glenn Robinson', 'Sidney Moncrief'] },
      // Bucks + Finals MVP
      { rowIndex: 0, colIndex: 2, validPlayers: ['Kareem Abdul-Jabbar', 'Giannis Antetokounmpo', 'Bob Dandridge', 'Oscar Robertson', 'Khris Middleton'] },
      // Suns + Warriors
      { rowIndex: 1, colIndex: 0, validPlayers: ['Kevin Durant', 'Chris Paul', 'Alvin Robertson', 'Jason Richardson', 'Leandro Barbosa'] },
      // Suns + 2000+ Points Season
      { rowIndex: 1, colIndex: 1, validPlayers: ['Charles Barkley', 'Amar\'e Stoudemire', 'Devin Booker', 'Tom Chambers', 'Walter Davis'] },
      // Suns + Finals MVP
      { rowIndex: 1, colIndex: 2, validPlayers: ['Kevin Durant', 'Charles Barkley', 'Shaquille O\'Neal', 'Kawhi Leonard', 'Paul Westphal'] },
      // MIP + Warriors
      { rowIndex: 2, colIndex: 0, validPlayers: ['Gilbert Arenas', 'Monta Ellis', 'Kevin Johnson', 'Chris Gatling', 'Bobby Simmons'] },
      // MIP + 2000+ Points Season
      { rowIndex: 2, colIndex: 1, validPlayers: ['Giannis Antetokounmpo', 'Tracy McGrady', 'Jimmy Butler', 'Pascal Siakam', 'Julius Randle'] },
      // MIP + Finals MVP
      { rowIndex: 2, colIndex: 2, validPlayers: ['Giannis Antetokounmpo', 'Kawhi Leonard', 'Chauncey Billups', 'Boris Diaw', 'Pascal Siakam'] },
    ],
  },

  // ============================================================
  // GRID 6
  // Rows: Pistons, Jazz, 50-40-90 Club
  // Cols: Spurs, NBA MVP, 10+ RPG Season
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Detroit Pistons', value: 'pistons' },
      { type: 'team', label: 'Utah Jazz', value: 'jazz' },
      { type: 'stat', label: '50-40-90 Club', value: '504090' },
    ],
    cols: [
      { type: 'team', label: 'San Antonio Spurs', value: 'spurs' },
      { type: 'award', label: 'NBA MVP', value: 'mvp' },
      { type: 'stat', label: '10+ RPG Season', value: '10rpg' },
    ],
    cells: [
      // Pistons + Spurs
      { rowIndex: 0, colIndex: 0, validPlayers: ['Dennis Rodman', 'Richard Jefferson', 'Rasheed Wallace', 'Adrian Dantley', 'Dave Bing'] },
      // Pistons + MVP
      { rowIndex: 0, colIndex: 1, validPlayers: ['Bob McAdoo', 'Allen Iverson', 'Dave Bing', 'Grant Hill', 'Derrick Rose'] },
      // Pistons + 10+ RPG
      { rowIndex: 0, colIndex: 2, validPlayers: ['Ben Wallace', 'Dennis Rodman', 'Andre Drummond', 'Bill Laimbeer', 'Bob Lanier'] },
      // Jazz + Spurs
      { rowIndex: 1, colIndex: 0, validPlayers: ['Matt Harpring', 'Richard Jefferson', 'Boris Diaw', 'Rudy Gay', 'Jeff Hornacek'] },
      // Jazz + MVP
      { rowIndex: 1, colIndex: 1, validPlayers: ['Karl Malone', 'Moses Malone', 'Adrian Dantley', 'Pete Maravich', 'Gail Goodrich'] },
      // Jazz + 10+ RPG
      { rowIndex: 1, colIndex: 2, validPlayers: ['Karl Malone', 'Derrick Favors', 'Carlos Boozer', 'Mehmet Okur', 'Paul Millsap'] },
      // 50-40-90 + Spurs
      { rowIndex: 2, colIndex: 0, validPlayers: ['Steve Nash', 'Brent Barry', 'Kevin Durant', 'Dirk Nowitzki', 'Mark Price'] },
      // 50-40-90 + MVP
      { rowIndex: 2, colIndex: 1, validPlayers: ['Stephen Curry', 'Steve Nash', 'Kevin Durant', 'Larry Bird', 'Dirk Nowitzki'] },
      // 50-40-90 + 10+ RPG
      { rowIndex: 2, colIndex: 2, validPlayers: ['Larry Bird', 'Kevin Durant', 'Dirk Nowitzki', 'Kevin McHale', 'Reggie Miller'] },
    ],
  },

  // ============================================================
  // GRID 7
  // Rows: Nuggets, Blazers, Rockets
  // Cols: All-Star, 25+ PPG Season, DPOY
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Denver Nuggets', value: 'nuggets' },
      { type: 'team', label: 'Portland Trail Blazers', value: 'blazers' },
      { type: 'team', label: 'Houston Rockets', value: 'rockets' },
    ],
    cols: [
      { type: 'award', label: 'All-Star Selection', value: 'allstar' },
      { type: 'stat', label: '25+ PPG Season', value: '25ppg' },
      { type: 'award', label: 'Defensive Player of Year', value: 'dpoy' },
    ],
    cells: [
      // Nuggets + All-Star
      { rowIndex: 0, colIndex: 0, validPlayers: ['Nikola Jokic', 'Alex English', 'Carmelo Anthony', 'David Thompson', 'Dan Issel'] },
      // Nuggets + 25+ PPG
      { rowIndex: 0, colIndex: 1, validPlayers: ['Carmelo Anthony', 'Alex English', 'Nikola Jokic', 'David Thompson', 'Allen Iverson'] },
      // Nuggets + DPOY
      { rowIndex: 0, colIndex: 2, validPlayers: ['Dikembe Mutombo', 'Marcus Camby', 'Ben Wallace', 'Dwight Howard', 'Alonzo Mourning'] },
      // Blazers + All-Star
      { rowIndex: 1, colIndex: 0, validPlayers: ['Clyde Drexler', 'Damian Lillard', 'Bill Walton', 'LaMarcus Aldridge', 'Brandon Roy'] },
      // Blazers + 25+ PPG
      { rowIndex: 1, colIndex: 1, validPlayers: ['Damian Lillard', 'Clyde Drexler', 'Geoff Petrie', 'Brandon Roy', 'Anfernee Simons'] },
      // Blazers + DPOY
      { rowIndex: 1, colIndex: 2, validPlayers: ['Bill Walton', 'Scottie Pippen', 'Rasheed Wallace', 'Marcus Camby', 'Tyson Chandler'] },
      // Rockets + All-Star
      { rowIndex: 2, colIndex: 0, validPlayers: ['Hakeem Olajuwon', 'James Harden', 'Yao Ming', 'Moses Malone', 'Elvin Hayes'] },
      // Rockets + 25+ PPG
      { rowIndex: 2, colIndex: 1, validPlayers: ['James Harden', 'Hakeem Olajuwon', 'Tracy McGrady', 'Moses Malone', 'Elvin Hayes'] },
      // Rockets + DPOY
      { rowIndex: 2, colIndex: 2, validPlayers: ['Hakeem Olajuwon', 'Dikembe Mutombo', 'Dwight Howard', 'Marcus Camby', 'Ron Artest'] },
    ],
  },

  // ============================================================
  // GRID 8
  // Rows: Lakers, Celtics, Heat
  // Cols: 3x Champion, 10+ APG Season, Rookie of Year
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Los Angeles Lakers', value: 'lakers' },
      { type: 'team', label: 'Boston Celtics', value: 'celtics' },
      { type: 'team', label: 'Miami Heat', value: 'heat' },
    ],
    cols: [
      { type: 'stat', label: '3x Champion', value: '3xchamp' },
      { type: 'stat', label: '10+ APG Season', value: '10apg' },
      { type: 'award', label: 'Rookie of the Year', value: 'roy' },
    ],
    cells: [
      // Lakers + 3x Champion
      { rowIndex: 0, colIndex: 0, validPlayers: ['Kobe Bryant', 'Shaquille O\'Neal', 'Magic Johnson', 'Kareem Abdul-Jabbar', 'LeBron James'] },
      // Lakers + 10+ APG
      { rowIndex: 0, colIndex: 1, validPlayers: ['Magic Johnson', 'Steve Nash', 'LeBron James', 'Jerry West', 'Norm Nixon'] },
      // Lakers + ROY
      { rowIndex: 0, colIndex: 2, validPlayers: ['Magic Johnson', 'Elgin Baylor', 'Pau Gasol', 'Lamar Odom', 'Eddie Jones'] },
      // Celtics + 3x Champion
      { rowIndex: 1, colIndex: 0, validPlayers: ['Bill Russell', 'Larry Bird', 'Bob Cousy', 'John Havlicek', 'Sam Jones'] },
      // Celtics + 10+ APG
      { rowIndex: 1, colIndex: 1, validPlayers: ['Bob Cousy', 'Rajon Rondo', 'Dennis Johnson', 'Kyrie Irving', 'Tiny Archibald'] },
      // Celtics + ROY
      { rowIndex: 1, colIndex: 2, validPlayers: ['Larry Bird', 'Dave Cowens', 'Tom Heinsohn', 'Malcolm Brogdon', 'Wes Unseld'] },
      // Heat + 3x Champion
      { rowIndex: 2, colIndex: 0, validPlayers: ['LeBron James', 'Dwyane Wade', 'Shaquille O\'Neal', 'Ray Allen', 'Gary Payton'] },
      // Heat + 10+ APG
      { rowIndex: 2, colIndex: 1, validPlayers: ['Tim Hardaway', 'LeBron James', 'Rajon Rondo', 'Jason Williams', 'Goran Dragic'] },
      // Heat + ROY
      { rowIndex: 2, colIndex: 2, validPlayers: ['Dwyane Wade', 'LeBron James', 'Chris Bosh', 'Vince Carter', 'Grant Hill'] },
    ],
  },

  // ============================================================
  // GRID 9
  // Rows: Warriors, Bulls, 50-40-90 Club
  // Cols: Knicks, Finals MVP, 2000+ Points Season
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Golden State Warriors', value: 'warriors' },
      { type: 'team', label: 'Chicago Bulls', value: 'bulls' },
      { type: 'stat', label: '50-40-90 Club', value: '504090' },
    ],
    cols: [
      { type: 'team', label: 'New York Knicks', value: 'knicks' },
      { type: 'award', label: 'Finals MVP', value: 'finals-mvp' },
      { type: 'stat', label: '2000+ Points Season', value: '2000pts' },
    ],
    cells: [
      // Warriors + Knicks
      { rowIndex: 0, colIndex: 0, validPlayers: ['Latrell Sprewell', 'Tim Hardaway', 'Chris Webber', 'Nate Robinson', 'Alec Burks'] },
      // Warriors + Finals MVP
      { rowIndex: 0, colIndex: 1, validPlayers: ['Stephen Curry', 'Andre Iguodala', 'Kevin Durant', 'Rick Barry', 'Wilt Chamberlain'] },
      // Warriors + 2000+ Points
      { rowIndex: 0, colIndex: 2, validPlayers: ['Stephen Curry', 'Wilt Chamberlain', 'Rick Barry', 'Chris Mullin', 'Kevin Durant'] },
      // Bulls + Knicks
      { rowIndex: 1, colIndex: 0, validPlayers: ['Carmelo Anthony', 'Tyson Chandler', 'Eddy Curry', 'Charles Oakley', 'Marcus Camby'] },
      // Bulls + Finals MVP
      { rowIndex: 1, colIndex: 1, validPlayers: ['Michael Jordan', 'Kawhi Leonard', 'Andre Iguodala', 'Scottie Pippen', 'Dennis Rodman'] },
      // Bulls + 2000+ Points
      { rowIndex: 1, colIndex: 2, validPlayers: ['Michael Jordan', 'Bob Love', 'Jimmy Butler', 'DeMar DeRozan', 'Scottie Pippen'] },
      // 50-40-90 + Knicks
      { rowIndex: 2, colIndex: 0, validPlayers: ['Steve Nash', 'Mark Price', 'Reggie Miller', 'Larry Bird', 'Dirk Nowitzki'] },
      // 50-40-90 + Finals MVP
      { rowIndex: 2, colIndex: 1, validPlayers: ['Kevin Durant', 'Stephen Curry', 'Larry Bird', 'Dirk Nowitzki', 'Kawhi Leonard'] },
      // 50-40-90 + 2000+ Points
      { rowIndex: 2, colIndex: 2, validPlayers: ['Stephen Curry', 'Kevin Durant', 'Larry Bird', 'Dirk Nowitzki', 'Reggie Miller'] },
    ],
  },

  // ============================================================
  // GRID 10
  // Rows: Spurs, Rockets, NBA MVP
  // Cols: Heat, 10+ RPG Season, Sixth Man of Year
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'San Antonio Spurs', value: 'spurs' },
      { type: 'team', label: 'Houston Rockets', value: 'rockets' },
      { type: 'award', label: 'NBA MVP', value: 'mvp' },
    ],
    cols: [
      { type: 'team', label: 'Miami Heat', value: 'heat' },
      { type: 'stat', label: '10+ RPG Season', value: '10rpg' },
      { type: 'award', label: 'Sixth Man of the Year', value: 'sixman' },
    ],
    cells: [
      // Spurs + Heat
      { rowIndex: 0, colIndex: 0, validPlayers: ['LaMarcus Aldridge', 'Danny Green', 'Rashard Lewis', 'Gary Neal', 'Boris Diaw'] },
      // Spurs + 10+ RPG
      { rowIndex: 0, colIndex: 1, validPlayers: ['Tim Duncan', 'David Robinson', 'Dennis Rodman', 'Artis Gilmore', 'George Gervin'] },
      // Spurs + Sixth Man
      { rowIndex: 0, colIndex: 2, validPlayers: ['Manu Ginobili', 'Leandro Barbosa', 'Kevin McHale', 'Eddie Johnson', 'Bobby Jackson'] },
      // Rockets + Heat
      { rowIndex: 1, colIndex: 0, validPlayers: ['Chris Bosh', 'Steve Francis', 'Caron Butler', 'Victor Oladipo', 'P.J. Tucker'] },
      // Rockets + 10+ RPG
      { rowIndex: 1, colIndex: 1, validPlayers: ['Moses Malone', 'Hakeem Olajuwon', 'Elvin Hayes', 'Dwight Howard', 'Yao Ming'] },
      // Rockets + Sixth Man
      { rowIndex: 1, colIndex: 2, validPlayers: ['Eric Gordon', 'Kevin McHale', 'Eddie Johnson', 'John Lucas', 'Lou Williams'] },
      // MVP + Heat
      { rowIndex: 2, colIndex: 0, validPlayers: ['LeBron James', 'Shaquille O\'Neal', 'Steve Nash', 'Tim Hardaway', 'Alonzo Mourning'] },
      // MVP + 10+ RPG
      { rowIndex: 2, colIndex: 1, validPlayers: ['Giannis Antetokounmpo', 'Wilt Chamberlain', 'Moses Malone', 'Tim Duncan', 'Karl Malone'] },
      // MVP + Sixth Man
      { rowIndex: 2, colIndex: 2, validPlayers: ['James Harden', 'Bill Walton', 'Kevin McHale', 'Bob McAdoo', 'Giannis Antetokounmpo'] },
    ],
  },

  // ============================================================
  // GRID 11
  // Rows: Pistons, Bucks, Blazers
  // Cols: Lakers, 25+ PPG Season, 3x Champion
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Detroit Pistons', value: 'pistons' },
      { type: 'team', label: 'Milwaukee Bucks', value: 'bucks' },
      { type: 'team', label: 'Portland Trail Blazers', value: 'blazers' },
    ],
    cols: [
      { type: 'team', label: 'Los Angeles Lakers', value: 'lakers' },
      { type: 'stat', label: '25+ PPG Season', value: '25ppg' },
      { type: 'stat', label: '3x Champion', value: '3xchamp' },
    ],
    cells: [
      // Pistons + Lakers
      { rowIndex: 0, colIndex: 0, validPlayers: ['Dennis Rodman', 'Bob McAdoo', 'Horace Grant', 'Rick Mahorn', 'Adrian Dantley'] },
      // Pistons + 25+ PPG
      { rowIndex: 0, colIndex: 1, validPlayers: ['Allen Iverson', 'Bob McAdoo', 'Jerry Stackhouse', 'Grant Hill', 'Dave Bing'] },
      // Pistons + 3x Champion
      { rowIndex: 0, colIndex: 2, validPlayers: ['Robert Horry', 'Horace Grant', 'Rasheed Wallace', 'Dennis Rodman', 'Isiah Thomas'] },
      // Bucks + Lakers
      { rowIndex: 1, colIndex: 0, validPlayers: ['Kareem Abdul-Jabbar', 'Bob Dandridge', 'Norm Nixon', 'Gary Payton', 'Shaquille O\'Neal'] },
      // Bucks + 25+ PPG
      { rowIndex: 1, colIndex: 1, validPlayers: ['Kareem Abdul-Jabbar', 'Giannis Antetokounmpo', 'Michael Redd', 'Glenn Robinson', 'Bob Dandridge'] },
      // Bucks + 3x Champion
      { rowIndex: 1, colIndex: 2, validPlayers: ['Kareem Abdul-Jabbar', 'Bob Dandridge', 'Robert Horry', 'Gary Payton', 'Ray Allen'] },
      // Blazers + Lakers
      { rowIndex: 2, colIndex: 0, validPlayers: ['Scottie Pippen', 'Rasheed Wallace', 'Shaquille O\'Neal', 'Robert Horry', 'Pau Gasol'] },
      // Blazers + 25+ PPG
      { rowIndex: 2, colIndex: 1, validPlayers: ['Damian Lillard', 'Clyde Drexler', 'Brandon Roy', 'Geoff Petrie', 'Anfernee Simons'] },
      // Blazers + 3x Champion
      { rowIndex: 2, colIndex: 2, validPlayers: ['Scottie Pippen', 'Robert Horry', 'Bill Walton', 'Shaquille O\'Neal', 'Rasheed Wallace'] },
    ],
  },

  // ============================================================
  // GRID 12
  // Rows: Suns, Jazz, Nuggets
  // Cols: Celtics, NBA MVP, DPOY
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Phoenix Suns', value: 'suns' },
      { type: 'team', label: 'Utah Jazz', value: 'jazz' },
      { type: 'team', label: 'Denver Nuggets', value: 'nuggets' },
    ],
    cols: [
      { type: 'team', label: 'Boston Celtics', value: 'celtics' },
      { type: 'award', label: 'NBA MVP', value: 'mvp' },
      { type: 'award', label: 'Defensive Player of Year', value: 'dpoy' },
    ],
    cells: [
      // Suns + Celtics
      { rowIndex: 0, colIndex: 0, validPlayers: ['Shaquille O\'Neal', 'Steve Nash', 'Isaiah Thomas', 'Walter Davis', 'Paul Westphal'] },
      // Suns + MVP
      { rowIndex: 0, colIndex: 1, validPlayers: ['Steve Nash', 'Charles Barkley', 'Kevin Durant', 'Shaquille O\'Neal', 'LeBron James'] },
      // Suns + DPOY
      { rowIndex: 0, colIndex: 2, validPlayers: ['Marcus Camby', 'Tyson Chandler', 'Dennis Rodman', 'Shaquille O\'Neal', 'Dwight Howard'] },
      // Jazz + Celtics
      { rowIndex: 1, colIndex: 0, validPlayers: ['Carlos Boozer', 'Adrian Dantley', 'Danny Ainge', 'Jeff Hornacek', 'Dominique Wilkins'] },
      // Jazz + MVP
      { rowIndex: 1, colIndex: 1, validPlayers: ['Karl Malone', 'Moses Malone', 'Pete Maravich', 'Adrian Dantley', 'Gail Goodrich'] },
      // Jazz + DPOY
      { rowIndex: 1, colIndex: 2, validPlayers: ['Mark Eaton', 'Rudy Gobert', 'Dennis Rodman', 'Dikembe Mutombo', 'Andrei Kirilenko'] },
      // Nuggets + Celtics
      { rowIndex: 2, colIndex: 0, validPlayers: ['Allen Iverson', 'Chauncey Billups', 'Nene', 'Jeff Green', 'Evan Fournier'] },
      // Nuggets + MVP
      { rowIndex: 2, colIndex: 1, validPlayers: ['Nikola Jokic', 'Allen Iverson', 'Carmelo Anthony', 'Alex English', 'David Thompson'] },
      // Nuggets + DPOY
      { rowIndex: 2, colIndex: 2, validPlayers: ['Dikembe Mutombo', 'Marcus Camby', 'Ben Wallace', 'Dwight Howard', 'Alonzo Mourning'] },
    ],
  },

  // ============================================================
  // GRID 13
  // Rows: Lakers, Warriors, All-Star
  // Cols: Nets, Most Improved Player, 10+ APG Season
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Los Angeles Lakers', value: 'lakers' },
      { type: 'team', label: 'Golden State Warriors', value: 'warriors' },
      { type: 'award', label: 'All-Star Selection', value: 'allstar' },
    ],
    cols: [
      { type: 'team', label: 'Brooklyn Nets', value: 'nets' },
      { type: 'award', label: 'Most Improved Player', value: 'mip' },
      { type: 'stat', label: '10+ APG Season', value: '10apg' },
    ],
    cells: [
      // Lakers + Nets
      { rowIndex: 0, colIndex: 0, validPlayers: ['Dwight Howard', 'D\'Angelo Russell', 'Brook Lopez', 'Carlos Boozer', 'Julius Randle'] },
      // Lakers + MIP
      { rowIndex: 0, colIndex: 1, validPlayers: ['Julius Randle', 'Lamar Odom', 'Tracy McGrady', 'Dale Ellis', 'Danny Manning'] },
      // Lakers + 10+ APG
      { rowIndex: 0, colIndex: 2, validPlayers: ['Magic Johnson', 'Steve Nash', 'LeBron James', 'Jerry West', 'Norm Nixon'] },
      // Warriors + Nets
      { rowIndex: 1, colIndex: 0, validPlayers: ['Kevin Durant', 'D\'Angelo Russell', 'Jason Kidd', 'Vince Carter', 'Keith Van Horn'] },
      // Warriors + MIP
      { rowIndex: 1, colIndex: 1, validPlayers: ['Monta Ellis', 'Gilbert Arenas', 'Chris Gatling', 'Kevin Johnson', 'Bobby Simmons'] },
      // Warriors + 10+ APG
      { rowIndex: 1, colIndex: 2, validPlayers: ['Tim Hardaway', 'Guy Rodgers', 'Stephen Curry', 'Chris Paul', 'Draymond Green'] },
      // All-Star + Nets
      { rowIndex: 2, colIndex: 0, validPlayers: ['Jason Kidd', 'Vince Carter', 'Kevin Durant', 'James Harden', 'Kyrie Irving'] },
      // All-Star + MIP
      { rowIndex: 2, colIndex: 1, validPlayers: ['Giannis Antetokounmpo', 'Jimmy Butler', 'Tracy McGrady', 'Pascal Siakam', 'Paul George'] },
      // All-Star + 10+ APG
      { rowIndex: 2, colIndex: 2, validPlayers: ['Magic Johnson', 'John Stockton', 'Steve Nash', 'Chris Paul', 'Isiah Thomas'] },
    ],
  },

  // ============================================================
  // GRID 14
  // Rows: Bulls, Spurs, Knicks
  // Cols: Rockets, Finals MVP, 10+ RPG Season
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Chicago Bulls', value: 'bulls' },
      { type: 'team', label: 'San Antonio Spurs', value: 'spurs' },
      { type: 'team', label: 'New York Knicks', value: 'knicks' },
    ],
    cols: [
      { type: 'team', label: 'Houston Rockets', value: 'rockets' },
      { type: 'award', label: 'Finals MVP', value: 'finals-mvp' },
      { type: 'stat', label: '10+ RPG Season', value: '10rpg' },
    ],
    cells: [
      // Bulls + Rockets
      { rowIndex: 0, colIndex: 0, validPlayers: ['Scottie Pippen', 'Carlos Boozer', 'Nate Robinson', 'Ben Wallace', 'P.J. Tucker'] },
      // Bulls + Finals MVP
      { rowIndex: 0, colIndex: 1, validPlayers: ['Michael Jordan', 'Kawhi Leonard', 'Andre Iguodala', 'LeBron James', 'Dennis Rodman'] },
      // Bulls + 10+ RPG
      { rowIndex: 0, colIndex: 2, validPlayers: ['Dennis Rodman', 'Charles Oakley', 'Horace Grant', 'Tyson Chandler', 'Ben Wallace'] },
      // Spurs + Rockets
      { rowIndex: 1, colIndex: 0, validPlayers: ['Robert Horry', 'Steve Smith', 'Artis Gilmore', 'T.J. Ford', 'Tracy McGrady'] },
      // Spurs + Finals MVP
      { rowIndex: 1, colIndex: 1, validPlayers: ['Tim Duncan', 'Tony Parker', 'Kawhi Leonard', 'LeBron James', 'Shaquille O\'Neal'] },
      // Spurs + 10+ RPG
      { rowIndex: 1, colIndex: 2, validPlayers: ['Tim Duncan', 'David Robinson', 'Dennis Rodman', 'Artis Gilmore', 'LaMarcus Aldridge'] },
      // Knicks + Rockets
      { rowIndex: 2, colIndex: 0, validPlayers: ['Charles Oakley', 'Tracy McGrady', 'Dikembe Mutombo', 'Patrick Ewing', 'Jeremy Lin'] },
      // Knicks + Finals MVP
      { rowIndex: 2, colIndex: 1, validPlayers: ['Willis Reed', 'Walt Frazier', 'Carmelo Anthony', 'Chauncey Billups', 'Paul Pierce'] },
      // Knicks + 10+ RPG
      { rowIndex: 2, colIndex: 2, validPlayers: ['Patrick Ewing', 'Willis Reed', 'Charles Oakley', 'Marcus Camby', 'Tyson Chandler'] },
    ],
  },

  // ============================================================
  // GRID 15
  // Rows: Heat, Bucks, Rookie of Year
  // Cols: Pistons, 25+ PPG Season, All-Star
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Miami Heat', value: 'heat' },
      { type: 'team', label: 'Milwaukee Bucks', value: 'bucks' },
      { type: 'award', label: 'Rookie of the Year', value: 'roy' },
    ],
    cols: [
      { type: 'team', label: 'Detroit Pistons', value: 'pistons' },
      { type: 'stat', label: '25+ PPG Season', value: '25ppg' },
      { type: 'award', label: 'All-Star Selection', value: 'allstar' },
    ],
    cells: [
      // Heat + Pistons
      { rowIndex: 0, colIndex: 0, validPlayers: ['Shaquille O\'Neal', 'Grant Hill', 'Alonzo Mourning', 'Rip Hamilton', 'Chauncey Billups'] },
      // Heat + 25+ PPG
      { rowIndex: 0, colIndex: 1, validPlayers: ['LeBron James', 'Dwyane Wade', 'Shaquille O\'Neal', 'Jimmy Butler', 'Glen Rice'] },
      // Heat + All-Star
      { rowIndex: 0, colIndex: 2, validPlayers: ['Dwyane Wade', 'LeBron James', 'Chris Bosh', 'Alonzo Mourning', 'Tim Hardaway'] },
      // Bucks + Pistons
      { rowIndex: 1, colIndex: 0, validPlayers: ['Glenn Robinson', 'Bob Lanier', 'Terry Cummings', 'Sidney Moncrief', 'Michael Redd'] },
      // Bucks + 25+ PPG
      { rowIndex: 1, colIndex: 1, validPlayers: ['Kareem Abdul-Jabbar', 'Giannis Antetokounmpo', 'Glenn Robinson', 'Michael Redd', 'Bob Dandridge'] },
      // Bucks + All-Star
      { rowIndex: 1, colIndex: 2, validPlayers: ['Giannis Antetokounmpo', 'Kareem Abdul-Jabbar', 'Sidney Moncrief', 'Bob Lanier', 'Ray Allen'] },
      // ROY + Pistons
      { rowIndex: 2, colIndex: 0, validPlayers: ['Grant Hill', 'Dave Bing', 'Bob McAdoo', 'Ben Gordon', 'Derrick Rose'] },
      // ROY + 25+ PPG
      { rowIndex: 2, colIndex: 1, validPlayers: ['Allen Iverson', 'LeBron James', 'Michael Jordan', 'Wilt Chamberlain', 'David Robinson'] },
      // ROY + All-Star
      { rowIndex: 2, colIndex: 2, validPlayers: ['LeBron James', 'Michael Jordan', 'Larry Bird', 'Tim Duncan', 'Allen Iverson'] },
    ],
  },

  // ============================================================
  // GRID 16
  // Rows: Celtics, Blazers, DPOY
  // Cols: Suns, 3x Champion, Most Improved Player
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Boston Celtics', value: 'celtics' },
      { type: 'team', label: 'Portland Trail Blazers', value: 'blazers' },
      { type: 'award', label: 'Defensive Player of Year', value: 'dpoy' },
    ],
    cols: [
      { type: 'team', label: 'Phoenix Suns', value: 'suns' },
      { type: 'stat', label: '3x Champion', value: '3xchamp' },
      { type: 'award', label: 'Most Improved Player', value: 'mip' },
    ],
    cells: [
      // Celtics + Suns
      { rowIndex: 0, colIndex: 0, validPlayers: ['Shaquille O\'Neal', 'Steve Nash', 'Paul Westphal', 'Isaiah Thomas', 'Walter Davis'] },
      // Celtics + 3x Champion
      { rowIndex: 0, colIndex: 1, validPlayers: ['Bill Russell', 'Larry Bird', 'Bob Cousy', 'John Havlicek', 'Sam Jones'] },
      // Celtics + MIP
      { rowIndex: 0, colIndex: 2, validPlayers: ['Rajon Rondo', 'Jaylen Brown', 'Kevin Johnson', 'Dana Barros', 'Don Nelson'] },
      // Blazers + Suns
      { rowIndex: 1, colIndex: 0, validPlayers: ['Charles Barkley', 'Shawn Marion', 'Steve Nash', 'Cliff Robinson', 'Rasheed Wallace'] },
      // Blazers + 3x Champion
      { rowIndex: 1, colIndex: 1, validPlayers: ['Scottie Pippen', 'Bill Walton', 'Robert Horry', 'Shaquille O\'Neal', 'Rasheed Wallace'] },
      // Blazers + MIP
      { rowIndex: 1, colIndex: 2, validPlayers: ['Brandon Roy', 'CJ McCollum', 'Kevin Duckworth', 'Anfernee Simons', 'Zach Randolph'] },
      // DPOY + Suns
      { rowIndex: 2, colIndex: 0, validPlayers: ['Marcus Camby', 'Tyson Chandler', 'Dennis Rodman', 'Shaquille O\'Neal', 'Dwight Howard'] },
      // DPOY + 3x Champion
      { rowIndex: 2, colIndex: 1, validPlayers: ['Dennis Rodman', 'Bill Russell', 'Dwight Howard', 'Kevin Garnett', 'Hakeem Olajuwon'] },
      // DPOY + MIP
      { rowIndex: 2, colIndex: 2, validPlayers: ['Kawhi Leonard', 'Paul George', 'Giannis Antetokounmpo', 'Jimmy Butler', 'Pascal Siakam'] },
    ],
  },

  // ============================================================
  // GRID 17
  // Rows: Nets, Nuggets, Jazz
  // Cols: Warriors, 2000+ Points Season, Sixth Man of Year
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Brooklyn Nets', value: 'nets' },
      { type: 'team', label: 'Denver Nuggets', value: 'nuggets' },
      { type: 'team', label: 'Utah Jazz', value: 'jazz' },
    ],
    cols: [
      { type: 'team', label: 'Golden State Warriors', value: 'warriors' },
      { type: 'stat', label: '2000+ Points Season', value: '2000pts' },
      { type: 'award', label: 'Sixth Man of the Year', value: 'sixman' },
    ],
    cells: [
      // Nets + Warriors
      { rowIndex: 0, colIndex: 0, validPlayers: ['Kevin Durant', 'D\'Angelo Russell', 'Jason Kidd', 'Vince Carter', 'Jason Collins'] },
      // Nets + 2000+ Points
      { rowIndex: 0, colIndex: 1, validPlayers: ['Vince Carter', 'Kevin Durant', 'James Harden', 'Kyrie Irving', 'Brook Lopez'] },
      // Nets + Sixth Man
      { rowIndex: 0, colIndex: 2, validPlayers: ['Jamal Crawford', 'Detlef Schrempf', 'Eddie Johnson', 'Jason Terry', 'Ricky Pierce'] },
      // Nuggets + Warriors
      { rowIndex: 1, colIndex: 0, validPlayers: ['Andre Iguodala', 'Nick Young', 'Chauncey Billups', 'Allen Iverson', 'J.R. Smith'] },
      // Nuggets + 2000+ Points
      { rowIndex: 1, colIndex: 1, validPlayers: ['Alex English', 'Carmelo Anthony', 'Nikola Jokic', 'David Thompson', 'Allen Iverson'] },
      // Nuggets + Sixth Man
      { rowIndex: 1, colIndex: 2, validPlayers: ['J.R. Smith', 'Andre Miller', 'Bobby Jackson', 'Ricky Pierce', 'Eddie Johnson'] },
      // Jazz + Warriors
      { rowIndex: 2, colIndex: 0, validPlayers: ['Chris Mullin', 'Andris Biedrins', 'Donyell Marshall', 'Matt Barnes', 'Mehmet Okur'] },
      // Jazz + 2000+ Points
      { rowIndex: 2, colIndex: 1, validPlayers: ['Karl Malone', 'Adrian Dantley', 'Pete Maravich', 'Donovan Mitchell', 'Darrell Griffith'] },
      // Jazz + Sixth Man
      { rowIndex: 2, colIndex: 2, validPlayers: ['Bobby Jackson', 'Thurl Bailey', 'Jordan Clarkson', 'Detlef Schrempf', 'Eddie Johnson'] },
    ],
  },

  // ============================================================
  // GRID 18
  // Rows: Lakers, Rockets, Finals MVP
  // Cols: Bulls, 50-40-90 Club, DPOY
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Los Angeles Lakers', value: 'lakers' },
      { type: 'team', label: 'Houston Rockets', value: 'rockets' },
      { type: 'award', label: 'Finals MVP', value: 'finals-mvp' },
    ],
    cols: [
      { type: 'team', label: 'Chicago Bulls', value: 'bulls' },
      { type: 'stat', label: '50-40-90 Club', value: '504090' },
      { type: 'award', label: 'Defensive Player of Year', value: 'dpoy' },
    ],
    cells: [
      // Lakers + Bulls
      { rowIndex: 0, colIndex: 0, validPlayers: ['Horace Grant', 'Dennis Rodman', 'Pau Gasol', 'Lamar Odom', 'Ron Harper'] },
      // Lakers + 50-40-90
      { rowIndex: 0, colIndex: 1, validPlayers: ['Steve Nash', 'Kevin Durant', 'Larry Bird', 'Kyrie Irving', 'Reggie Miller'] },
      // Lakers + DPOY
      { rowIndex: 0, colIndex: 2, validPlayers: ['Dwight Howard', 'Dikembe Mutombo', 'Dennis Rodman', 'Marc Gasol', 'Tyson Chandler'] },
      // Rockets + Bulls
      { rowIndex: 1, colIndex: 0, validPlayers: ['Scottie Pippen', 'Carlos Boozer', 'Ben Wallace', 'P.J. Tucker', 'Nate Robinson'] },
      // Rockets + 50-40-90
      { rowIndex: 1, colIndex: 1, validPlayers: ['Steve Nash', 'Kevin Durant', 'Reggie Miller', 'Mark Price', 'Brent Barry'] },
      // Rockets + DPOY
      { rowIndex: 1, colIndex: 2, validPlayers: ['Hakeem Olajuwon', 'Dikembe Mutombo', 'Dwight Howard', 'Ron Artest', 'Marcus Camby'] },
      // Finals MVP + Bulls
      { rowIndex: 2, colIndex: 0, validPlayers: ['Michael Jordan', 'Kawhi Leonard', 'Andre Iguodala', 'LeBron James', 'Dennis Rodman'] },
      // Finals MVP + 50-40-90
      { rowIndex: 2, colIndex: 1, validPlayers: ['Kevin Durant', 'Stephen Curry', 'Larry Bird', 'Dirk Nowitzki', 'Kawhi Leonard'] },
      // Finals MVP + DPOY
      { rowIndex: 2, colIndex: 2, validPlayers: ['Hakeem Olajuwon', 'Kawhi Leonard', 'Kevin Garnett', 'Bill Russell', 'Tim Duncan'] },
    ],
  },

  // ============================================================
  // GRID 19
  // Rows: Celtics, Spurs, Suns
  // Cols: Bucks, 10+ APG Season, NBA MVP
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Boston Celtics', value: 'celtics' },
      { type: 'team', label: 'San Antonio Spurs', value: 'spurs' },
      { type: 'team', label: 'Phoenix Suns', value: 'suns' },
    ],
    cols: [
      { type: 'team', label: 'Milwaukee Bucks', value: 'bucks' },
      { type: 'stat', label: '10+ APG Season', value: '10apg' },
      { type: 'award', label: 'NBA MVP', value: 'mvp' },
    ],
    cells: [
      // Celtics + Bucks
      { rowIndex: 0, colIndex: 0, validPlayers: ['Ray Allen', 'Gary Payton', 'Sam Cassell', 'Jrue Holiday', 'Terry Rozier'] },
      // Celtics + 10+ APG
      { rowIndex: 0, colIndex: 1, validPlayers: ['Bob Cousy', 'Rajon Rondo', 'Tiny Archibald', 'Dennis Johnson', 'Kyrie Irving'] },
      // Celtics + MVP
      { rowIndex: 0, colIndex: 2, validPlayers: ['Larry Bird', 'Bill Russell', 'Bob Cousy', 'Dave Cowens', 'Bob McAdoo'] },
      // Spurs + Bucks
      { rowIndex: 1, colIndex: 0, validPlayers: ['Oscar Robertson', 'Sidney Moncrief', 'Bob Dandridge', 'Terry Cummings', 'Artis Gilmore'] },
      // Spurs + 10+ APG
      { rowIndex: 1, colIndex: 1, validPlayers: ['Tony Parker', 'Avery Johnson', 'Johnny Moore', 'Rod Strickland', 'Tre Jones'] },
      // Spurs + MVP
      { rowIndex: 1, colIndex: 2, validPlayers: ['Tim Duncan', 'David Robinson', 'LaMarcus Aldridge', 'Moses Malone', 'Shaquille O\'Neal'] },
      // Suns + Bucks
      { rowIndex: 2, colIndex: 0, validPlayers: ['Giannis Antetokounmpo', 'Michael Redd', 'Eric Bledsoe', 'Vin Baker', 'Danny Manning'] },
      // Suns + 10+ APG
      { rowIndex: 2, colIndex: 1, validPlayers: ['Steve Nash', 'Kevin Johnson', 'Jason Kidd', 'Chris Paul', 'Stephon Marbury'] },
      // Suns + MVP
      { rowIndex: 2, colIndex: 2, validPlayers: ['Steve Nash', 'Charles Barkley', 'Kevin Durant', 'Shaquille O\'Neal', 'LeBron James'] },
    ],
  },

  // ============================================================
  // GRID 20
  // Rows: Warriors, Knicks, Pistons
  // Cols: Heat, Rookie of Year, 2000+ Points Season
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Golden State Warriors', value: 'warriors' },
      { type: 'team', label: 'New York Knicks', value: 'knicks' },
      { type: 'team', label: 'Detroit Pistons', value: 'pistons' },
    ],
    cols: [
      { type: 'team', label: 'Miami Heat', value: 'heat' },
      { type: 'award', label: 'Rookie of the Year', value: 'roy' },
      { type: 'stat', label: '2000+ Points Season', value: '2000pts' },
    ],
    cells: [
      // Warriors + Heat
      { rowIndex: 0, colIndex: 0, validPlayers: ['Chris Bosh', 'Tim Hardaway', 'Andre Iguodala', 'Shaun Livingston', 'Gary Payton'] },
      // Warriors + ROY
      { rowIndex: 0, colIndex: 1, validPlayers: ['Rick Barry', 'Chris Webber', 'Jamaal Wilkes', 'Mitch Richmond', 'Phil Smith'] },
      // Warriors + 2000+ Points
      { rowIndex: 0, colIndex: 2, validPlayers: ['Stephen Curry', 'Wilt Chamberlain', 'Rick Barry', 'Kevin Durant', 'Chris Mullin'] },
      // Knicks + Heat
      { rowIndex: 1, colIndex: 0, validPlayers: ['Alonzo Mourning', 'Pat Riley', 'Marcus Camby', 'Jamal Mashburn', 'Allan Houston'] },
      // Knicks + ROY
      { rowIndex: 1, colIndex: 1, validPlayers: ['Patrick Ewing', 'Willis Reed', 'Mark Jackson', 'Walt Bellamy', 'Phil Jackson'] },
      // Knicks + 2000+ Points
      { rowIndex: 1, colIndex: 2, validPlayers: ['Carmelo Anthony', 'Patrick Ewing', 'Bernard King', 'Walt Frazier', 'Willis Reed'] },
      // Pistons + Heat
      { rowIndex: 2, colIndex: 0, validPlayers: ['Shaquille O\'Neal', 'Grant Hill', 'Rip Hamilton', 'Chauncey Billups', 'Alonzo Mourning'] },
      // Pistons + ROY
      { rowIndex: 2, colIndex: 1, validPlayers: ['Grant Hill', 'Dave Bing', 'Don Meineke', 'Bailey Howell', 'Cade Cunningham'] },
      // Pistons + 2000+ Points
      { rowIndex: 2, colIndex: 2, validPlayers: ['Allen Iverson', 'Bob McAdoo', 'Jerry Stackhouse', 'Grant Hill', 'Dave Bing'] },
    ],
  },

  // ============================================================
  // GRID 21
  // Rows: Bulls, Blazers, 3x Champion
  // Cols: Spurs, DPOY, 25+ PPG Season
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Chicago Bulls', value: 'bulls' },
      { type: 'team', label: 'Portland Trail Blazers', value: 'blazers' },
      { type: 'stat', label: '3x Champion', value: '3xchamp' },
    ],
    cols: [
      { type: 'team', label: 'San Antonio Spurs', value: 'spurs' },
      { type: 'award', label: 'Defensive Player of Year', value: 'dpoy' },
      { type: 'stat', label: '25+ PPG Season', value: '25ppg' },
    ],
    cells: [
      // Bulls + Spurs
      { rowIndex: 0, colIndex: 0, validPlayers: ['Dennis Rodman', 'DeMar DeRozan', 'Pau Gasol', 'Artis Gilmore', 'Coby White'] },
      // Bulls + DPOY
      { rowIndex: 0, colIndex: 1, validPlayers: ['Dennis Rodman', 'Michael Jordan', 'Ben Wallace', 'Scottie Pippen', 'Tyson Chandler'] },
      // Bulls + 25+ PPG
      { rowIndex: 0, colIndex: 2, validPlayers: ['Michael Jordan', 'Scottie Pippen', 'Bob Love', 'Jimmy Butler', 'DeMar DeRozan'] },
      // Blazers + Spurs
      { rowIndex: 1, colIndex: 0, validPlayers: ['LaMarcus Aldridge', 'Terry Porter', 'Patty Mills', 'Steve Smith', 'Rudy Fernandez'] },
      // Blazers + DPOY
      { rowIndex: 1, colIndex: 1, validPlayers: ['Bill Walton', 'Scottie Pippen', 'Rasheed Wallace', 'Marcus Camby', 'Tyson Chandler'] },
      // Blazers + 25+ PPG
      { rowIndex: 1, colIndex: 2, validPlayers: ['Damian Lillard', 'Clyde Drexler', 'Brandon Roy', 'Geoff Petrie', 'Anfernee Simons'] },
      // 3x Champion + Spurs
      { rowIndex: 2, colIndex: 0, validPlayers: ['Tim Duncan', 'Manu Ginobili', 'Tony Parker', 'Robert Horry', 'Danny Green'] },
      // 3x Champion + DPOY
      { rowIndex: 2, colIndex: 1, validPlayers: ['Dennis Rodman', 'Bill Russell', 'Hakeem Olajuwon', 'Dwight Howard', 'Kevin Garnett'] },
      // 3x Champion + 25+ PPG
      { rowIndex: 2, colIndex: 2, validPlayers: ['Michael Jordan', 'LeBron James', 'Kobe Bryant', 'Shaquille O\'Neal', 'Kareem Abdul-Jabbar'] },
    ],
  },

  // ============================================================
  // GRID 22
  // Rows: Heat, Nuggets, Sixth Man of Year
  // Cols: Celtics, 10+ RPG Season, Finals MVP
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Miami Heat', value: 'heat' },
      { type: 'team', label: 'Denver Nuggets', value: 'nuggets' },
      { type: 'award', label: 'Sixth Man of the Year', value: 'sixman' },
    ],
    cols: [
      { type: 'team', label: 'Boston Celtics', value: 'celtics' },
      { type: 'stat', label: '10+ RPG Season', value: '10rpg' },
      { type: 'award', label: 'Finals MVP', value: 'finals-mvp' },
    ],
    cells: [
      // Heat + Celtics
      { rowIndex: 0, colIndex: 0, validPlayers: ['Shaquille O\'Neal', 'Ray Allen', 'Alonzo Mourning', 'Gary Payton', 'Jae Crowder'] },
      // Heat + 10+ RPG
      { rowIndex: 0, colIndex: 1, validPlayers: ['Shaquille O\'Neal', 'Chris Bosh', 'LeBron James', 'Alonzo Mourning', 'Rony Seikaly'] },
      // Heat + Finals MVP
      { rowIndex: 0, colIndex: 2, validPlayers: ['LeBron James', 'Dwyane Wade', 'Shaquille O\'Neal', 'Gary Payton', 'Ray Allen'] },
      // Nuggets + Celtics
      { rowIndex: 1, colIndex: 0, validPlayers: ['Allen Iverson', 'Chauncey Billups', 'Jeff Green', 'Evan Fournier', 'Nene'] },
      // Nuggets + 10+ RPG
      { rowIndex: 1, colIndex: 1, validPlayers: ['Nikola Jokic', 'Carmelo Anthony', 'Dikembe Mutombo', 'Marcus Camby', 'Kenneth Faried'] },
      // Nuggets + Finals MVP
      { rowIndex: 1, colIndex: 2, validPlayers: ['Nikola Jokic', 'Andre Iguodala', 'Chauncey Billups', 'Allen Iverson', 'Carmelo Anthony'] },
      // Sixth Man + Celtics
      { rowIndex: 2, colIndex: 0, validPlayers: ['Kevin McHale', 'Bill Walton', 'Detlef Schrempf', 'Jason Terry', 'Eddie Johnson'] },
      // Sixth Man + 10+ RPG
      { rowIndex: 2, colIndex: 1, validPlayers: ['Kevin McHale', 'Bill Walton', 'Lamar Odom', 'Bobby Jones', 'Montrezl Harrell'] },
      // Sixth Man + Finals MVP
      { rowIndex: 2, colIndex: 2, validPlayers: ['Andre Iguodala', 'James Harden', 'Kevin McHale', 'Bill Walton', 'Manu Ginobili'] },
    ],
  },

  // ============================================================
  // GRID 23
  // Rows: Lakers, Jazz, Most Improved Player
  // Cols: Knicks, All-Star, 3x Champion
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Los Angeles Lakers', value: 'lakers' },
      { type: 'team', label: 'Utah Jazz', value: 'jazz' },
      { type: 'award', label: 'Most Improved Player', value: 'mip' },
    ],
    cols: [
      { type: 'team', label: 'New York Knicks', value: 'knicks' },
      { type: 'award', label: 'All-Star Selection', value: 'allstar' },
      { type: 'stat', label: '3x Champion', value: '3xchamp' },
    ],
    cells: [
      // Lakers + Knicks
      { rowIndex: 0, colIndex: 0, validPlayers: ['Carmelo Anthony', 'Tyson Chandler', 'Lamar Odom', 'Steve Nash', 'Jeremy Lin'] },
      // Lakers + All-Star
      { rowIndex: 0, colIndex: 1, validPlayers: ['Kobe Bryant', 'LeBron James', 'Magic Johnson', 'Shaquille O\'Neal', 'Kareem Abdul-Jabbar'] },
      // Lakers + 3x Champion
      { rowIndex: 0, colIndex: 2, validPlayers: ['Kobe Bryant', 'Shaquille O\'Neal', 'Magic Johnson', 'Kareem Abdul-Jabbar', 'LeBron James'] },
      // Jazz + Knicks
      { rowIndex: 1, colIndex: 0, validPlayers: ['Patrick Ewing', 'Carlos Boozer', 'Shandon Anderson', 'Kyle Korver', 'Enes Kanter'] },
      // Jazz + All-Star
      { rowIndex: 1, colIndex: 1, validPlayers: ['Karl Malone', 'John Stockton', 'Adrian Dantley', 'Pete Maravich', 'Donovan Mitchell'] },
      // Jazz + 3x Champion
      { rowIndex: 1, colIndex: 2, validPlayers: ['Robert Horry', 'Bryon Russell', 'Derek Fisher', 'Danny Green', 'Karl Malone'] },
      // MIP + Knicks
      { rowIndex: 2, colIndex: 0, validPlayers: ['Julius Randle', 'Jamal Mashburn', 'Rip Hamilton', 'Kevin Johnson', 'Bobby Simmons'] },
      // MIP + All-Star
      { rowIndex: 2, colIndex: 1, validPlayers: ['Giannis Antetokounmpo', 'Jimmy Butler', 'Tracy McGrady', 'Paul George', 'Pascal Siakam'] },
      // MIP + 3x Champion
      { rowIndex: 2, colIndex: 2, validPlayers: ['Giannis Antetokounmpo', 'Kawhi Leonard', 'Boris Diaw', 'Danny Green', 'Darrell Armstrong'] },
    ],
  },

  // ============================================================
  // GRID 24
  // Rows: Warriors, Bucks, Rockets
  // Cols: Blazers, NBA MVP, 10+ RPG Season
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Golden State Warriors', value: 'warriors' },
      { type: 'team', label: 'Milwaukee Bucks', value: 'bucks' },
      { type: 'team', label: 'Houston Rockets', value: 'rockets' },
    ],
    cols: [
      { type: 'team', label: 'Portland Trail Blazers', value: 'blazers' },
      { type: 'award', label: 'NBA MVP', value: 'mvp' },
      { type: 'stat', label: '10+ RPG Season', value: '10rpg' },
    ],
    cells: [
      // Warriors + Blazers
      { rowIndex: 0, colIndex: 0, validPlayers: ['Andre Iguodala', 'Rasheed Wallace', 'Chris Webber', 'Baron Davis', 'Gary Payton'] },
      // Warriors + MVP
      { rowIndex: 0, colIndex: 1, validPlayers: ['Stephen Curry', 'Wilt Chamberlain', 'Kevin Durant', 'Rick Barry', 'Bob McAdoo'] },
      // Warriors + 10+ RPG
      { rowIndex: 0, colIndex: 2, validPlayers: ['Wilt Chamberlain', 'Nate Thurmond', 'Chris Webber', 'Draymond Green', 'Andrew Bogut'] },
      // Bucks + Blazers
      { rowIndex: 1, colIndex: 0, validPlayers: ['Terry Porter', 'Rasheed Wallace', 'Greg Smith', 'Gary Trent', 'Bob Dandridge'] },
      // Bucks + MVP
      { rowIndex: 1, colIndex: 1, validPlayers: ['Kareem Abdul-Jabbar', 'Giannis Antetokounmpo', 'Bob McAdoo', 'Moses Malone', 'Oscar Robertson'] },
      // Bucks + 10+ RPG
      { rowIndex: 1, colIndex: 2, validPlayers: ['Kareem Abdul-Jabbar', 'Giannis Antetokounmpo', 'Bob Dandridge', 'Bob Lanier', 'Jack Sikma'] },
      // Rockets + Blazers
      { rowIndex: 2, colIndex: 0, validPlayers: ['Clyde Drexler', 'Robert Horry', 'Kenny Smith', 'Terry Porter', 'Sam Cassell'] },
      // Rockets + MVP
      { rowIndex: 2, colIndex: 1, validPlayers: ['Hakeem Olajuwon', 'James Harden', 'Moses Malone', 'Charles Barkley', 'Steve Francis'] },
      // Rockets + 10+ RPG
      { rowIndex: 2, colIndex: 2, validPlayers: ['Moses Malone', 'Hakeem Olajuwon', 'Elvin Hayes', 'Dwight Howard', 'Yao Ming'] },
    ],
  },

  // ============================================================
  // GRID 25
  // Rows: Celtics, Pistons, Suns
  // Cols: Nuggets, 25+ PPG Season, Sixth Man of Year
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Boston Celtics', value: 'celtics' },
      { type: 'team', label: 'Detroit Pistons', value: 'pistons' },
      { type: 'team', label: 'Phoenix Suns', value: 'suns' },
    ],
    cols: [
      { type: 'team', label: 'Denver Nuggets', value: 'nuggets' },
      { type: 'stat', label: '25+ PPG Season', value: '25ppg' },
      { type: 'award', label: 'Sixth Man of the Year', value: 'sixman' },
    ],
    cells: [
      // Celtics + Nuggets
      { rowIndex: 0, colIndex: 0, validPlayers: ['Allen Iverson', 'Chauncey Billups', 'Jeff Green', 'Evan Fournier', 'Nene'] },
      // Celtics + 25+ PPG
      { rowIndex: 0, colIndex: 1, validPlayers: ['Larry Bird', 'Paul Pierce', 'John Havlicek', 'Jayson Tatum', 'Kevin McHale'] },
      // Celtics + Sixth Man
      { rowIndex: 0, colIndex: 2, validPlayers: ['Kevin McHale', 'Bill Walton', 'Jason Terry', 'Detlef Schrempf', 'Eddie Johnson'] },
      // Pistons + Nuggets
      { rowIndex: 1, colIndex: 0, validPlayers: ['Allen Iverson', 'Chauncey Billups', 'Marcus Camby', 'Aaron Afflalo', 'Andre Miller'] },
      // Pistons + 25+ PPG
      { rowIndex: 1, colIndex: 1, validPlayers: ['Allen Iverson', 'Bob McAdoo', 'Jerry Stackhouse', 'Grant Hill', 'Dave Bing'] },
      // Pistons + Sixth Man
      { rowIndex: 1, colIndex: 2, validPlayers: ['Vinnie Johnson', 'Corliss Williamson', 'Ricky Pierce', 'Rodney Stuckey', 'Ben Gordon'] },
      // Suns + Nuggets
      { rowIndex: 2, colIndex: 0, validPlayers: ['Carmelo Anthony', 'Allen Iverson', 'Aaron Gordon', 'Chauncey Billups', 'Marcus Camby'] },
      // Suns + 25+ PPG
      { rowIndex: 2, colIndex: 1, validPlayers: ['Charles Barkley', 'Amar\'e Stoudemire', 'Devin Booker', 'Tom Chambers', 'Kevin Durant'] },
      // Suns + Sixth Man
      { rowIndex: 2, colIndex: 2, validPlayers: ['Leandro Barbosa', 'Eddie Johnson', 'Cliff Robinson', 'Danny Manning', 'Jason Terry'] },
    ],
  },

  // ============================================================
  // GRID 26
  // Rows: Nets, Heat, Spurs
  // Cols: Jazz, 10+ APG Season, Rookie of Year
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Brooklyn Nets', value: 'nets' },
      { type: 'team', label: 'Miami Heat', value: 'heat' },
      { type: 'team', label: 'San Antonio Spurs', value: 'spurs' },
    ],
    cols: [
      { type: 'team', label: 'Utah Jazz', value: 'jazz' },
      { type: 'stat', label: '10+ APG Season', value: '10apg' },
      { type: 'award', label: 'Rookie of the Year', value: 'roy' },
    ],
    cells: [
      // Nets + Jazz
      { rowIndex: 0, colIndex: 0, validPlayers: ['Carlos Boozer', 'Deron Williams', 'Andrei Kirilenko', 'Joe Johnson', 'Gerald Wallace'] },
      // Nets + 10+ APG
      { rowIndex: 0, colIndex: 1, validPlayers: ['Jason Kidd', 'James Harden', 'Deron Williams', 'Stephon Marbury', 'Kevin Johnson'] },
      // Nets + ROY
      { rowIndex: 0, colIndex: 2, validPlayers: ['Vince Carter', 'Jason Kidd', 'Derrick Coleman', 'Buck Williams', 'Keith Van Horn'] },
      // Heat + Jazz
      { rowIndex: 1, colIndex: 0, validPlayers: ['Carlos Boozer', 'Kyle Korver', 'Deron Williams', 'Jae Crowder', 'Devin Harris'] },
      // Heat + 10+ APG
      { rowIndex: 1, colIndex: 1, validPlayers: ['Tim Hardaway', 'LeBron James', 'Rajon Rondo', 'Jason Williams', 'Goran Dragic'] },
      // Heat + ROY
      { rowIndex: 1, colIndex: 2, validPlayers: ['Dwyane Wade', 'LeBron James', 'Chris Bosh', 'Vince Carter', 'Grant Hill'] },
      // Spurs + Jazz
      { rowIndex: 2, colIndex: 0, validPlayers: ['Boris Diaw', 'Richard Jefferson', 'Matt Harpring', 'Rudy Gay', 'Kyle Anderson'] },
      // Spurs + 10+ APG
      { rowIndex: 2, colIndex: 1, validPlayers: ['Tony Parker', 'Avery Johnson', 'Johnny Moore', 'Rod Strickland', 'Tre Jones'] },
      // Spurs + ROY
      { rowIndex: 2, colIndex: 2, validPlayers: ['Tim Duncan', 'David Robinson', 'Alvin Robertson', 'Manu Ginobili', 'Derrick Rose'] },
    ],
  },

  // ============================================================
  // GRID 27
  // Rows: Lakers, Knicks, All-Star
  // Cols: Warriors, DPOY, 2000+ Points Season
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Los Angeles Lakers', value: 'lakers' },
      { type: 'team', label: 'New York Knicks', value: 'knicks' },
      { type: 'award', label: 'All-Star Selection', value: 'allstar' },
    ],
    cols: [
      { type: 'team', label: 'Golden State Warriors', value: 'warriors' },
      { type: 'award', label: 'Defensive Player of Year', value: 'dpoy' },
      { type: 'stat', label: '2000+ Points Season', value: '2000pts' },
    ],
    cells: [
      // Lakers + Warriors
      { rowIndex: 0, colIndex: 0, validPlayers: ['Wilt Chamberlain', 'Rick Barry', 'D\'Angelo Russell', 'Kent Bazemore', 'Chris Webber'] },
      // Lakers + DPOY
      { rowIndex: 0, colIndex: 1, validPlayers: ['Dwight Howard', 'Dikembe Mutombo', 'Dennis Rodman', 'Marc Gasol', 'Tyson Chandler'] },
      // Lakers + 2000+ Points
      { rowIndex: 0, colIndex: 2, validPlayers: ['Kobe Bryant', 'LeBron James', 'Shaquille O\'Neal', 'Kareem Abdul-Jabbar', 'Jerry West'] },
      // Knicks + Warriors
      { rowIndex: 1, colIndex: 0, validPlayers: ['Latrell Sprewell', 'Tim Hardaway', 'Chris Webber', 'Nate Robinson', 'Alec Burks'] },
      // Knicks + DPOY
      { rowIndex: 1, colIndex: 1, validPlayers: ['Tyson Chandler', 'Marcus Camby', 'Dikembe Mutombo', 'Ben Wallace', 'Dennis Rodman'] },
      // Knicks + 2000+ Points
      { rowIndex: 1, colIndex: 2, validPlayers: ['Carmelo Anthony', 'Patrick Ewing', 'Bernard King', 'Walt Frazier', 'Willis Reed'] },
      // All-Star + Warriors
      { rowIndex: 2, colIndex: 0, validPlayers: ['Stephen Curry', 'Klay Thompson', 'Kevin Durant', 'Wilt Chamberlain', 'Rick Barry'] },
      // All-Star + DPOY
      { rowIndex: 2, colIndex: 1, validPlayers: ['Hakeem Olajuwon', 'Dwight Howard', 'Kevin Garnett', 'Dikembe Mutombo', 'Alonzo Mourning'] },
      // All-Star + 2000+ Points
      { rowIndex: 2, colIndex: 2, validPlayers: ['Michael Jordan', 'LeBron James', 'Kobe Bryant', 'Kevin Durant', 'Kareem Abdul-Jabbar'] },
    ],
  },

  // ============================================================
  // GRID 28
  // Rows: Bulls, Celtics, Rockets
  // Cols: Nets, 50-40-90 Club, Most Improved Player
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Chicago Bulls', value: 'bulls' },
      { type: 'team', label: 'Boston Celtics', value: 'celtics' },
      { type: 'team', label: 'Houston Rockets', value: 'rockets' },
    ],
    cols: [
      { type: 'team', label: 'Brooklyn Nets', value: 'nets' },
      { type: 'stat', label: '50-40-90 Club', value: '504090' },
      { type: 'award', label: 'Most Improved Player', value: 'mip' },
    ],
    cells: [
      // Bulls + Nets
      { rowIndex: 0, colIndex: 0, validPlayers: ['Vince Carter', 'Carlos Boozer', 'Jay Williams', 'Derrick Rose', 'Ben Wallace'] },
      // Bulls + 50-40-90
      { rowIndex: 0, colIndex: 1, validPlayers: ['Steve Kerr', 'Kevin Durant', 'Reggie Miller', 'Mark Price', 'Larry Bird'] },
      // Bulls + MIP
      { rowIndex: 0, colIndex: 2, validPlayers: ['Jimmy Butler', 'Derrick Rose', 'Bobby Simmons', 'Jamal Crawford', 'Coby White'] },
      // Celtics + Nets
      { rowIndex: 1, colIndex: 0, validPlayers: ['Kevin Garnett', 'Paul Pierce', 'Jason Terry', 'Gerald Wallace', 'Joe Johnson'] },
      // Celtics + 50-40-90
      { rowIndex: 1, colIndex: 1, validPlayers: ['Larry Bird', 'Kevin Durant', 'Reggie Miller', 'Mark Price', 'Kyrie Irving'] },
      // Celtics + MIP
      { rowIndex: 1, colIndex: 2, validPlayers: ['Rajon Rondo', 'Jaylen Brown', 'Kevin Johnson', 'Dana Barros', 'Don Nelson'] },
      // Rockets + Nets
      { rowIndex: 2, colIndex: 0, validPlayers: ['James Harden', 'Kevin Durant', 'Kyrie Irving', 'P.J. Tucker', 'Kenyon Martin'] },
      // Rockets + 50-40-90
      { rowIndex: 2, colIndex: 1, validPlayers: ['Steve Nash', 'Kevin Durant', 'Reggie Miller', 'Mark Price', 'Brent Barry'] },
      // Rockets + MIP
      { rowIndex: 2, colIndex: 2, validPlayers: ['Kevin Johnson', 'Tracy McGrady', 'Aaron Brooks', 'Victor Oladipo', 'Christian Wood'] },
    ],
  },

  // ============================================================
  // GRID 29
  // Rows: Spurs, Blazers, NBA MVP
  // Cols: Pistons, 10+ APG Season, Rookie of Year
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'San Antonio Spurs', value: 'spurs' },
      { type: 'team', label: 'Portland Trail Blazers', value: 'blazers' },
      { type: 'award', label: 'NBA MVP', value: 'mvp' },
    ],
    cols: [
      { type: 'team', label: 'Detroit Pistons', value: 'pistons' },
      { type: 'stat', label: '10+ APG Season', value: '10apg' },
      { type: 'award', label: 'Rookie of the Year', value: 'roy' },
    ],
    cells: [
      // Spurs + Pistons
      { rowIndex: 0, colIndex: 0, validPlayers: ['Dennis Rodman', 'Richard Jefferson', 'Rasheed Wallace', 'Adrian Dantley', 'Artis Gilmore'] },
      // Spurs + 10+ APG
      { rowIndex: 0, colIndex: 1, validPlayers: ['Tony Parker', 'Avery Johnson', 'Johnny Moore', 'Rod Strickland', 'Tre Jones'] },
      // Spurs + ROY
      { rowIndex: 0, colIndex: 2, validPlayers: ['Tim Duncan', 'David Robinson', 'Alvin Robertson', 'Manu Ginobili', 'Derrick Rose'] },
      // Blazers + Pistons
      { rowIndex: 1, colIndex: 0, validPlayers: ['Rasheed Wallace', 'Grant Hill', 'Ben Wallace', 'Chauncey Billups', 'Rip Hamilton'] },
      // Blazers + 10+ APG
      { rowIndex: 1, colIndex: 1, validPlayers: ['Terry Porter', 'Damian Lillard', 'Rod Strickland', 'Damon Stoudamire', 'Andre Miller'] },
      // Blazers + ROY
      { rowIndex: 1, colIndex: 2, validPlayers: ['Brandon Roy', 'Geoff Petrie', 'Sidney Wicks', 'Bill Walton', 'Damian Lillard'] },
      // MVP + Pistons
      { rowIndex: 2, colIndex: 0, validPlayers: ['Allen Iverson', 'Bob McAdoo', 'Dave Bing', 'Grant Hill', 'Derrick Rose'] },
      // MVP + 10+ APG
      { rowIndex: 2, colIndex: 1, validPlayers: ['Magic Johnson', 'Steve Nash', 'Oscar Robertson', 'Russell Westbrook', 'Bob Cousy'] },
      // MVP + ROY
      { rowIndex: 2, colIndex: 2, validPlayers: ['LeBron James', 'Michael Jordan', 'Tim Duncan', 'Kareem Abdul-Jabbar', 'Wilt Chamberlain'] },
    ],
  },

  // ============================================================
  // GRID 30
  // Rows: Heat, Warriors, Bucks
  // Cols: Rockets, Finals MVP, 50-40-90 Club
  // ============================================================
  {
    league: 'NBA',
    rows: [
      { type: 'team', label: 'Miami Heat', value: 'heat' },
      { type: 'team', label: 'Golden State Warriors', value: 'warriors' },
      { type: 'team', label: 'Milwaukee Bucks', value: 'bucks' },
    ],
    cols: [
      { type: 'team', label: 'Houston Rockets', value: 'rockets' },
      { type: 'award', label: 'Finals MVP', value: 'finals-mvp' },
      { type: 'stat', label: '50-40-90 Club', value: '504090' },
    ],
    cells: [
      // Heat + Rockets
      { rowIndex: 0, colIndex: 0, validPlayers: ['Chris Bosh', 'Steve Francis', 'Victor Oladipo', 'P.J. Tucker', 'Caron Butler'] },
      // Heat + Finals MVP
      { rowIndex: 0, colIndex: 1, validPlayers: ['LeBron James', 'Dwyane Wade', 'Shaquille O\'Neal', 'Gary Payton', 'Ray Allen'] },
      // Heat + 50-40-90
      { rowIndex: 0, colIndex: 2, validPlayers: ['Steve Nash', 'Ray Allen', 'LeBron James', 'Kevin Durant', 'Mark Price'] },
      // Warriors + Rockets
      { rowIndex: 1, colIndex: 0, validPlayers: ['Chris Paul', 'Robert Horry', 'Kevin Durant', 'Hakeem Olajuwon', 'Eric Gordon'] },
      // Warriors + Finals MVP
      { rowIndex: 1, colIndex: 1, validPlayers: ['Stephen Curry', 'Andre Iguodala', 'Kevin Durant', 'Rick Barry', 'Wilt Chamberlain'] },
      // Warriors + 50-40-90
      { rowIndex: 1, colIndex: 2, validPlayers: ['Stephen Curry', 'Kevin Durant', 'Steve Nash', 'Mark Price', 'Steve Kerr'] },
      // Bucks + Rockets
      { rowIndex: 2, colIndex: 0, validPlayers: ['Robert Horry', 'Sam Cassell', 'Gary Payton', 'T.J. Ford', 'Jon McGlocklin'] },
      // Bucks + Finals MVP
      { rowIndex: 2, colIndex: 1, validPlayers: ['Kareem Abdul-Jabbar', 'Giannis Antetokounmpo', 'Bob Dandridge', 'Oscar Robertson', 'Shaquille O\'Neal'] },
      // Bucks + 50-40-90
      { rowIndex: 2, colIndex: 2, validPlayers: ['Ray Allen', 'Kevin Durant', 'Steve Nash', 'Reggie Miller', 'Kyle Korver'] },
    ],
  },
];

export default NBA_GRIDS;
