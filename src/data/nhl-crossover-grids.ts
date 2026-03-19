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

const NHL_GRIDS: CrossoverGrid[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 1: Canadiens / Maple Leafs / Red Wings  x  Bruins / 40+ Goals / Stanley Cup
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Montreal Canadiens', value: 'canadiens' },
      { type: 'team', label: 'Toronto Maple Leafs', value: 'maple-leafs' },
      { type: 'team', label: 'Detroit Red Wings', value: 'red-wings' },
    ],
    cols: [
      { type: 'team', label: 'Boston Bruins', value: 'bruins' },
      { type: 'stat', label: '40+ Goals Season', value: '40goals' },
      { type: 'award', label: 'Stanley Cup Champion', value: 'stanley-cup' },
    ],
    cells: [
      // Canadiens x Bruins (played for both)
      { rowIndex: 0, colIndex: 0, validPlayers: ['Ken Dryden', 'Guy Lapointe', 'Jean Ratelle', 'Gerry Cheevers', 'Terry OReilly', 'Phil Esposito', 'Murph Chamberlain', 'Sprague Cleghorn', 'Dit Clapper'] },
      // Canadiens x 40+ Goals
      { rowIndex: 0, colIndex: 1, validPlayers: ['Guy Lafleur', 'Steve Shutt', 'Pierre Larouche', 'Stephane Richer', 'Mats Naslund', 'Bobby Smith', 'Jacques Lemaire'] },
      // Canadiens x Stanley Cup
      { rowIndex: 0, colIndex: 2, validPlayers: ['Jean Beliveau', 'Maurice Richard', 'Henri Richard', 'Guy Lafleur', 'Larry Robinson', 'Patrick Roy', 'Yvan Cournoyer', 'Jacques Lemaire', 'Bob Gainey'] },
      // Maple Leafs x Bruins
      { rowIndex: 1, colIndex: 0, validPlayers: ['Phil Kessel', 'Dave Andreychuk', 'Terry OReilly', 'Eddie Shack', 'Tom Fergus', 'Brian Bradley', 'Ken Linseman'] },
      // Maple Leafs x 40+ Goals
      { rowIndex: 1, colIndex: 1, validPlayers: ['Rick Vaive', 'Dave Andreychuk', 'Gary Leeman', 'Darryl Sittler', 'Lanny McDonald', 'Wendel Clark'] },
      // Maple Leafs x Stanley Cup
      { rowIndex: 1, colIndex: 2, validPlayers: ['Syl Apps', 'Ted Kennedy', 'Turk Broda', 'Max Bentley', 'Dave Keon', 'Johnny Bower', 'Frank Mahovlich', 'Red Kelly', 'George Armstrong'] },
      // Red Wings x Bruins
      { rowIndex: 2, colIndex: 0, validPlayers: ['Frank Mahovlich', 'Bill Ranford', 'Ken Hodge', 'Ab DeMarco', 'Reggie Leach', 'Adam Oates'] },
      // Red Wings x 40+ Goals
      { rowIndex: 2, colIndex: 1, validPlayers: ['Steve Yzerman', 'Sergei Fedorov', 'Brendan Shanahan', 'Dino Ciccarelli', 'Mickey Redmond', 'John Ogrodnick', 'Luc Robitaille'] },
      // Red Wings x Stanley Cup
      { rowIndex: 2, colIndex: 2, validPlayers: ['Steve Yzerman', 'Nicklas Lidstrom', 'Brendan Shanahan', 'Sergei Fedorov', 'Chris Chelios', 'Dominik Hasek', 'Chris Osgood', 'Igor Larionov', 'Henrik Zetterberg'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 2: Penguins / Blackhawks / Hart Trophy  x  Oilers / 80+ Points / Norris Trophy
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Pittsburgh Penguins', value: 'penguins' },
      { type: 'team', label: 'Chicago Blackhawks', value: 'blackhawks' },
      { type: 'award', label: 'Hart Trophy', value: 'hart' },
    ],
    cols: [
      { type: 'team', label: 'Edmonton Oilers', value: 'oilers' },
      { type: 'stat', label: '80+ Points Season', value: '80points' },
      { type: 'award', label: 'Norris Trophy', value: 'norris' },
    ],
    cells: [
      // Penguins x Oilers
      { rowIndex: 0, colIndex: 0, validPlayers: ['Mark Recchi', 'Kevin Stevens', 'Petr Nedved', 'Chris Joseph', 'Jeff Petry', 'Evgeni Malkin'] },
      // Penguins x 80+ Points
      { rowIndex: 0, colIndex: 1, validPlayers: ['Mario Lemieux', 'Sidney Crosby', 'Evgeni Malkin', 'Jaromir Jagr', 'Ron Francis', 'Kevin Stevens', 'Mark Recchi', 'Rick Kehoe'] },
      // Penguins x Norris Trophy
      { rowIndex: 0, colIndex: 2, validPlayers: ['Randy Carlyle', 'Paul Coffey', 'Kris Letang', 'Larry Murphy', 'Sergei Zubov'] },
      // Blackhawks x Oilers
      { rowIndex: 1, colIndex: 0, validPlayers: ['Brett Hull', 'Chris Chelios', 'Esa Tikkanen', 'Adam Larsson', 'Seth Jones', 'Duncan Keith'] },
      // Blackhawks x 80+ Points
      { rowIndex: 1, colIndex: 1, validPlayers: ['Bobby Hull', 'Stan Mikita', 'Denis Savard', 'Jeremy Roenick', 'Patrick Kane', 'Jonathan Toews', 'Steve Larmer'] },
      // Blackhawks x Norris Trophy
      { rowIndex: 1, colIndex: 2, validPlayers: ['Pierre Pilote', 'Doug Wilson', 'Chris Chelios', 'Duncan Keith', 'Bobby Orr'] },
      // Hart Trophy x Oilers
      { rowIndex: 2, colIndex: 0, validPlayers: ['Wayne Gretzky', 'Mark Messier', 'Connor McDavid', 'Leon Draisaitl', 'Hart Simpson'] },
      // Hart Trophy x 80+ Points
      { rowIndex: 2, colIndex: 1, validPlayers: ['Wayne Gretzky', 'Mario Lemieux', 'Sidney Crosby', 'Connor McDavid', 'Jaromir Jagr', 'Mark Messier', 'Bobby Orr', 'Joe Thornton', 'Nathan MacKinnon'] },
      // Hart Trophy x Norris Trophy
      { rowIndex: 2, colIndex: 2, validPlayers: ['Bobby Orr', 'Chris Pronger', 'Al MacInnis', 'Eddie Shore', 'Nicklas Lidstrom'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 3: Rangers / Bruins / Avalanche  x  Flyers / Calder Trophy / 50+ Assists
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'New York Rangers', value: 'rangers' },
      { type: 'team', label: 'Boston Bruins', value: 'bruins' },
      { type: 'team', label: 'Colorado Avalanche', value: 'avalanche' },
    ],
    cols: [
      { type: 'team', label: 'Philadelphia Flyers', value: 'flyers' },
      { type: 'award', label: 'Calder Trophy', value: 'calder' },
      { type: 'stat', label: '50+ Assists Season', value: '50assists' },
    ],
    cells: [
      // Rangers x Flyers
      { rowIndex: 0, colIndex: 0, validPlayers: ['John LeClair', 'Rick Tocchet', 'Mark Recchi', 'Eric Lindros', 'Wayne Simmonds', 'Ilya Kovalchuk', 'Jaromir Jagr'] },
      // Rangers x Calder Trophy
      { rowIndex: 0, colIndex: 1, validPlayers: ['Kilby MacDonald', 'Grant Warwick', 'Pentti Lund', 'Camille Henry', 'Steve Vickers'] },
      // Rangers x 50+ Assists
      { rowIndex: 0, colIndex: 2, validPlayers: ['Brian Leetch', 'Mark Messier', 'Wayne Gretzky', 'Mike Rogers', 'Jean Ratelle', 'Jaromir Jagr', 'Mika Zibanejad', 'Artemi Panarin'] },
      // Bruins x Flyers
      { rowIndex: 1, colIndex: 0, validPlayers: ['Reggie Leach', 'Rick Middleton', 'Dave Poulin', 'Terry OReilly', 'Ken Linseman', 'Mark Recchi', 'James van Riemsdyk'] },
      // Bruins x Calder Trophy
      { rowIndex: 1, colIndex: 1, validPlayers: ['Jack Gelineau', 'Larry Regan', 'Bobby Orr', 'Andrew Raycroft', 'Sergei Samsonov'] },
      // Bruins x 50+ Assists
      { rowIndex: 1, colIndex: 2, validPlayers: ['Bobby Orr', 'Phil Esposito', 'Barry Pederson', 'Adam Oates', 'Joe Juneau', 'Joe Thornton', 'David Pastrnak'] },
      // Avalanche x Flyers
      { rowIndex: 2, colIndex: 0, validPlayers: ['Peter Forsberg', 'Claude Lemieux', 'Eric Lacroix', 'Theo Fleury', 'Keith Tkachuk', 'Dale Hunter'] },
      // Avalanche x Calder Trophy
      { rowIndex: 2, colIndex: 1, validPlayers: ['Peter Stastny', 'Michel Goulet', 'Cale Makar', 'Chris Drury', 'Gabriel Landeskog'] },
      // Avalanche x 50+ Assists
      { rowIndex: 2, colIndex: 2, validPlayers: ['Peter Stastny', 'Joe Sakic', 'Peter Forsberg', 'Nathan MacKinnon', 'Michel Goulet', 'Mikko Rantanen', 'Cale Makar'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 4: Lightning / Devils / Blues  x  Kings / Conn Smythe / 100+ Points
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Tampa Bay Lightning', value: 'lightning' },
      { type: 'team', label: 'New Jersey Devils', value: 'devils' },
      { type: 'team', label: 'St. Louis Blues', value: 'blues' },
    ],
    cols: [
      { type: 'team', label: 'Los Angeles Kings', value: 'kings' },
      { type: 'award', label: 'Conn Smythe Trophy', value: 'conn-smythe' },
      { type: 'stat', label: '100+ Points Season', value: '100points' },
    ],
    cells: [
      // Lightning x Kings
      { rowIndex: 0, colIndex: 0, validPlayers: ['Dave Taylor', 'Rob Blake', 'Brad Richards', 'Ryan McDonagh', 'Brayden Point', 'Luc Robitaille'] },
      // Lightning x Conn Smythe
      { rowIndex: 0, colIndex: 1, validPlayers: ['Brad Richards', 'Andrei Vasilevskiy', 'Patrick Roy', 'Nikita Kucherov', 'Victor Hedman'] },
      // Lightning x 100+ Points
      { rowIndex: 0, colIndex: 2, validPlayers: ['Nikita Kucherov', 'Steven Stamkos', 'Martin St. Louis', 'Vincent Lecavalier', 'Phil Esposito'] },
      // Devils x Kings
      { rowIndex: 1, colIndex: 0, validPlayers: ['Rob Blake', 'Alexander Mogilny', 'Scott Stevens', 'Bernie Nicholls', 'Slava Fetisov', 'Bryce Salvador'] },
      // Devils x Conn Smythe
      { rowIndex: 1, colIndex: 1, validPlayers: ['Claude Lemieux', 'Scott Stevens', 'Scott Niedermayer', 'Jean-Sebastien Giguere', 'Martin Brodeur'] },
      // Devils x 100+ Points
      { rowIndex: 1, colIndex: 2, validPlayers: ['Pat Verbeek', 'Alexander Mogilny', 'Patrik Elias', 'Scott Stevens', 'Peter Stastny'] },
      // Blues x Kings
      { rowIndex: 2, colIndex: 0, validPlayers: ['Wayne Gretzky', 'Luc Robitaille', 'Rob Blake', 'Pavol Demitra', 'Bernie Federko', 'Larry Robinson'] },
      // Blues x Conn Smythe
      { rowIndex: 2, colIndex: 1, validPlayers: ['Glenn Hall', 'Brett Hull', 'Wayne Gretzky', 'Al MacInnis', 'Joe Mullen'] },
      // Blues x 100+ Points
      { rowIndex: 2, colIndex: 2, validPlayers: ['Brett Hull', 'Adam Oates', 'Bernie Federko', 'Wayne Gretzky', 'Pierre Turgeon', 'Red Berenson'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 5: Oilers / Canadiens / Ted Lindsay Award  x  Rangers / Stanley Cup / 40+ Goals
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Edmonton Oilers', value: 'oilers' },
      { type: 'team', label: 'Montreal Canadiens', value: 'canadiens' },
      { type: 'award', label: 'Ted Lindsay Award', value: 'ted-lindsay' },
    ],
    cols: [
      { type: 'team', label: 'New York Rangers', value: 'rangers' },
      { type: 'award', label: 'Stanley Cup Champion', value: 'stanley-cup' },
      { type: 'stat', label: '40+ Goals Season', value: '40goals' },
    ],
    cells: [
      // Oilers x Rangers
      { rowIndex: 0, colIndex: 0, validPlayers: ['Mark Messier', 'Glenn Anderson', 'Adam Graves', 'Jeff Beukeboom', 'Kevin Lowe', 'Esa Tikkanen', 'Reijo Ruotsalainen'] },
      // Oilers x Stanley Cup
      { rowIndex: 0, colIndex: 1, validPlayers: ['Wayne Gretzky', 'Mark Messier', 'Grant Fuhr', 'Paul Coffey', 'Jari Kurri', 'Glenn Anderson', 'Kevin Lowe', 'Connor McDavid'] },
      // Oilers x 40+ Goals
      { rowIndex: 0, colIndex: 2, validPlayers: ['Wayne Gretzky', 'Jari Kurri', 'Glenn Anderson', 'Mark Messier', 'Leon Draisaitl', 'Connor McDavid'] },
      // Canadiens x Rangers
      { rowIndex: 1, colIndex: 0, validPlayers: ['Jacques Plante', 'Frank Mahovlich', 'Guy Lafleur', 'Pete Stemkowski', 'Max Pacioretty', 'John Ferguson'] },
      // Canadiens x Stanley Cup
      { rowIndex: 1, colIndex: 1, validPlayers: ['Jean Beliveau', 'Maurice Richard', 'Henri Richard', 'Guy Lafleur', 'Patrick Roy', 'Larry Robinson', 'Yvan Cournoyer', 'Jacques Lemaire'] },
      // Canadiens x 40+ Goals
      { rowIndex: 1, colIndex: 2, validPlayers: ['Guy Lafleur', 'Steve Shutt', 'Pierre Larouche', 'Stephane Richer', 'Bobby Smith', 'Jacques Lemaire'] },
      // Ted Lindsay Award x Rangers
      { rowIndex: 2, colIndex: 0, validPlayers: ['Jaromir Jagr', 'Mark Messier', 'Wayne Gretzky', 'Guy Lafleur', 'Artemi Panarin'] },
      // Ted Lindsay Award x Stanley Cup
      { rowIndex: 2, colIndex: 1, validPlayers: ['Wayne Gretzky', 'Mario Lemieux', 'Sidney Crosby', 'Mark Messier', 'Guy Lafleur', 'Bobby Orr'] },
      // Ted Lindsay Award x 40+ Goals
      { rowIndex: 2, colIndex: 2, validPlayers: ['Wayne Gretzky', 'Mario Lemieux', 'Jaromir Jagr', 'Alexander Ovechkin', 'Guy Lafleur', 'Luc Robitaille'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 6: Ducks / Flyers / Kings  x  Penguins / Hart Trophy / 20+ Goals
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Anaheim Ducks', value: 'ducks' },
      { type: 'team', label: 'Philadelphia Flyers', value: 'flyers' },
      { type: 'team', label: 'Los Angeles Kings', value: 'kings' },
    ],
    cols: [
      { type: 'team', label: 'Pittsburgh Penguins', value: 'penguins' },
      { type: 'award', label: 'Hart Trophy', value: 'hart' },
      { type: 'stat', label: '20+ Goals Season', value: '20goals' },
    ],
    cells: [
      // Ducks x Penguins
      { rowIndex: 0, colIndex: 0, validPlayers: ['Teemu Selanne', 'Chris Kunitz', 'Rob Niedermayer', 'Petr Sykora', 'James Neal', 'Evgeni Malkin'] },
      // Ducks x Hart Trophy
      { rowIndex: 0, colIndex: 1, validPlayers: ['Teemu Selanne', 'Paul Kariya', 'Corey Perry', 'Ryan Getzlaf', 'Jean-Sebastien Giguere'] },
      // Ducks x 20+ Goals
      { rowIndex: 0, colIndex: 2, validPlayers: ['Teemu Selanne', 'Paul Kariya', 'Corey Perry', 'Ryan Getzlaf', 'Bobby Ryan', 'Rickard Rakell', 'Troy Terry', 'Jakob Silfverberg'] },
      // Flyers x Penguins
      { rowIndex: 1, colIndex: 0, validPlayers: ['Rick Tocchet', 'Mark Recchi', 'Jaromir Jagr', 'James van Riemsdyk', 'Larry Murphy', 'Ron Flockhart'] },
      // Flyers x Hart Trophy
      { rowIndex: 1, colIndex: 1, validPlayers: ['Bobby Clarke', 'Eric Lindros', 'Mark Messier', 'Bill Barber', 'Mark Howe'] },
      // Flyers x 20+ Goals
      { rowIndex: 1, colIndex: 2, validPlayers: ['Bobby Clarke', 'Bill Barber', 'Reggie Leach', 'Tim Kerr', 'Brian Propp', 'Eric Lindros', 'John LeClair', 'Rick MacLeish', 'Claude Giroux'] },
      // Kings x Penguins
      { rowIndex: 2, colIndex: 0, validPlayers: ['Larry Murphy', 'Rick Kehoe', 'Jeff Carter', 'Tanner Pearson', 'Rob Blake', 'Luc Robitaille'] },
      // Kings x Hart Trophy
      { rowIndex: 2, colIndex: 1, validPlayers: ['Wayne Gretzky', 'Marcel Dionne', 'Anze Kopitar', 'Luc Robitaille', 'Dave Taylor'] },
      // Kings x 20+ Goals
      { rowIndex: 2, colIndex: 2, validPlayers: ['Marcel Dionne', 'Wayne Gretzky', 'Luc Robitaille', 'Dave Taylor', 'Anze Kopitar', 'Jeff Carter', 'Dustin Brown', 'Bernie Nicholls'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 7: Blackhawks / Maple Leafs / Calder Trophy  x  Red Wings / Stanley Cup / 50+ Assists
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Chicago Blackhawks', value: 'blackhawks' },
      { type: 'team', label: 'Toronto Maple Leafs', value: 'maple-leafs' },
      { type: 'award', label: 'Calder Trophy', value: 'calder' },
    ],
    cols: [
      { type: 'team', label: 'Detroit Red Wings', value: 'red-wings' },
      { type: 'award', label: 'Stanley Cup Champion', value: 'stanley-cup' },
      { type: 'stat', label: '50+ Assists Season', value: '50assists' },
    ],
    cells: [
      // Blackhawks x Red Wings
      { rowIndex: 0, colIndex: 0, validPlayers: ['Chris Chelios', 'Dominik Hasek', 'Marian Hossa', 'Kris Versteeg', 'Patrick Sharp', 'Bob Probert', 'Phil Esposito'] },
      // Blackhawks x Stanley Cup
      { rowIndex: 0, colIndex: 1, validPlayers: ['Jonathan Toews', 'Patrick Kane', 'Duncan Keith', 'Marian Hossa', 'Brent Seabrook', 'Bobby Hull', 'Stan Mikita', 'Corey Crawford'] },
      // Blackhawks x 50+ Assists
      { rowIndex: 0, colIndex: 2, validPlayers: ['Stan Mikita', 'Denis Savard', 'Bobby Hull', 'Patrick Kane', 'Jeremy Roenick', 'Steve Larmer'] },
      // Maple Leafs x Red Wings
      { rowIndex: 1, colIndex: 0, validPlayers: ['Red Kelly', 'Larry Murphy', 'Frank Mahovlich', 'Borje Salming', 'Marcel Pronovost', 'Bob Baun'] },
      // Maple Leafs x Stanley Cup
      { rowIndex: 1, colIndex: 1, validPlayers: ['Dave Keon', 'Frank Mahovlich', 'Johnny Bower', 'Red Kelly', 'George Armstrong', 'Syl Apps', 'Ted Kennedy', 'Turk Broda'] },
      // Maple Leafs x 50+ Assists
      { rowIndex: 1, colIndex: 2, validPlayers: ['Darryl Sittler', 'Doug Gilmour', 'Mats Sundin', 'Borje Salming', 'Phil Kessel', 'Auston Matthews'] },
      // Calder Trophy x Red Wings
      { rowIndex: 2, colIndex: 0, validPlayers: ['Roger Crozier', 'Glenn Hall', 'Jim McFadden', 'Terry Sawchuk', 'Larry Aurie'] },
      // Calder Trophy x Stanley Cup
      { rowIndex: 2, colIndex: 1, validPlayers: ['Bobby Orr', 'Patrick Roy', 'Terry Sawchuk', 'Ken Dryden', 'Danny Grant', 'Cale Makar', 'Andrew Raycroft'] },
      // Calder Trophy x 50+ Assists
      { rowIndex: 2, colIndex: 2, validPlayers: ['Bobby Orr', 'Peter Stastny', 'Teemu Selanne', 'Joe Juneau', 'Bryan Trottier', 'Mario Lemieux'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 8: Bruins / Penguins / Avalanche  x  Canadiens / 30+ Wins / Conn Smythe
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Boston Bruins', value: 'bruins' },
      { type: 'team', label: 'Pittsburgh Penguins', value: 'penguins' },
      { type: 'team', label: 'Colorado Avalanche', value: 'avalanche' },
    ],
    cols: [
      { type: 'team', label: 'Montreal Canadiens', value: 'canadiens' },
      { type: 'stat', label: '30+ Wins Season', value: '30wins' },
      { type: 'award', label: 'Conn Smythe Trophy', value: 'conn-smythe' },
    ],
    cells: [
      // Bruins x Canadiens
      { rowIndex: 0, colIndex: 0, validPlayers: ['Phil Esposito', 'Ken Dryden', 'Guy Lapointe', 'Dit Clapper', 'Sprague Cleghorn', 'Jean Ratelle'] },
      // Bruins x 30+ Wins (goalies)
      { rowIndex: 0, colIndex: 1, validPlayers: ['Tim Thomas', 'Tuukka Rask', 'Pete Peeters', 'Andy Moog', 'Byron Dafoe', 'Linus Ullmark', 'Gerry Cheevers'] },
      // Bruins x Conn Smythe
      { rowIndex: 0, colIndex: 2, validPlayers: ['Bobby Orr', 'Tim Thomas', 'Brad Park', 'Phil Esposito', 'Cam Neely'] },
      // Penguins x Canadiens
      { rowIndex: 1, colIndex: 0, validPlayers: ['Ron Francis', 'Mario Lemieux', 'Lyle Odelein', 'Ulf Samuelsson', 'Rick Kehoe', 'Syl Apps Jr.'] },
      // Penguins x 30+ Wins (goalies)
      { rowIndex: 1, colIndex: 1, validPlayers: ['Tom Barrasso', 'Marc-Andre Fleury', 'Matt Murray', 'Johan Hedberg', 'Tristan Jarry'] },
      // Penguins x Conn Smythe
      { rowIndex: 1, colIndex: 2, validPlayers: ['Mario Lemieux', 'Sidney Crosby', 'Evgeni Malkin', 'Matt Murray', 'Ron Francis'] },
      // Avalanche x Canadiens
      { rowIndex: 2, colIndex: 0, validPlayers: ['Patrick Roy', 'Guy Lafleur', 'Eric Desjardins', 'John LeClair', 'Andrei Kovalenko', 'Mike Keane'] },
      // Avalanche x 30+ Wins (goalies)
      { rowIndex: 2, colIndex: 1, validPlayers: ['Patrick Roy', 'Semyon Varlamov', 'Philipp Grubauer', 'Craig Anderson', 'David Aebischer', 'Alexandar Georgiev'] },
      // Avalanche x Conn Smythe
      { rowIndex: 2, colIndex: 2, validPlayers: ['Patrick Roy', 'Joe Sakic', 'Cale Makar', 'Ray Bourque', 'Peter Forsberg'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 9: Oilers / Red Wings / Norris Trophy  x  Blackhawks / 80+ Points / Stanley Cup
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Edmonton Oilers', value: 'oilers' },
      { type: 'team', label: 'Detroit Red Wings', value: 'red-wings' },
      { type: 'award', label: 'Norris Trophy', value: 'norris' },
    ],
    cols: [
      { type: 'team', label: 'Chicago Blackhawks', value: 'blackhawks' },
      { type: 'stat', label: '80+ Points Season', value: '80points' },
      { type: 'award', label: 'Stanley Cup Champion', value: 'stanley-cup' },
    ],
    cells: [
      // Oilers x Blackhawks
      { rowIndex: 0, colIndex: 0, validPlayers: ['Brett Hull', 'Duncan Keith', 'Esa Tikkanen', 'Adam Larsson', 'Seth Jones', 'Chris Chelios'] },
      // Oilers x 80+ Points
      { rowIndex: 0, colIndex: 1, validPlayers: ['Wayne Gretzky', 'Mark Messier', 'Jari Kurri', 'Paul Coffey', 'Connor McDavid', 'Leon Draisaitl', 'Glenn Anderson'] },
      // Oilers x Stanley Cup
      { rowIndex: 0, colIndex: 2, validPlayers: ['Wayne Gretzky', 'Mark Messier', 'Grant Fuhr', 'Paul Coffey', 'Jari Kurri', 'Glenn Anderson', 'Kevin Lowe', 'Connor McDavid'] },
      // Red Wings x Blackhawks
      { rowIndex: 1, colIndex: 0, validPlayers: ['Chris Chelios', 'Dominik Hasek', 'Marian Hossa', 'Bob Probert', 'Phil Esposito', 'Pat Verbeek'] },
      // Red Wings x 80+ Points
      { rowIndex: 1, colIndex: 1, validPlayers: ['Steve Yzerman', 'Sergei Fedorov', 'Nicklas Lidstrom', 'Brendan Shanahan', 'Henrik Zetterberg', 'Pavel Datsyuk', 'Marcel Dionne'] },
      // Red Wings x Stanley Cup
      { rowIndex: 1, colIndex: 2, validPlayers: ['Steve Yzerman', 'Nicklas Lidstrom', 'Sergei Fedorov', 'Brendan Shanahan', 'Henrik Zetterberg', 'Chris Chelios', 'Dominik Hasek', 'Igor Larionov'] },
      // Norris Trophy x Blackhawks
      { rowIndex: 2, colIndex: 0, validPlayers: ['Pierre Pilote', 'Chris Chelios', 'Duncan Keith', 'Doug Wilson', 'Bobby Orr'] },
      // Norris Trophy x 80+ Points
      { rowIndex: 2, colIndex: 1, validPlayers: ['Bobby Orr', 'Paul Coffey', 'Brian Leetch', 'Al MacInnis', 'Denis Potvin', 'Nicklas Lidstrom', 'Cale Makar'] },
      // Norris Trophy x Stanley Cup
      { rowIndex: 2, colIndex: 2, validPlayers: ['Bobby Orr', 'Nicklas Lidstrom', 'Paul Coffey', 'Duncan Keith', 'Larry Robinson', 'Ray Bourque', 'Cale Makar', 'Scott Niedermayer'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 10: Lightning / Rangers / Hart Trophy  x  Devils / 40+ Goals / Vezina Trophy
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Tampa Bay Lightning', value: 'lightning' },
      { type: 'team', label: 'New York Rangers', value: 'rangers' },
      { type: 'award', label: 'Hart Trophy', value: 'hart' },
    ],
    cols: [
      { type: 'team', label: 'New Jersey Devils', value: 'devils' },
      { type: 'stat', label: '40+ Goals Season', value: '40goals' },
      { type: 'award', label: 'Vezina Trophy', value: 'vezina' },
    ],
    cells: [
      // Lightning x Devils
      { rowIndex: 0, colIndex: 0, validPlayers: ['Martin St. Louis', 'Brad Richards', 'Brian Rolston', 'Ben Bishop', 'Ondrej Palat', 'Curtis Leschyshyn'] },
      // Lightning x 40+ Goals
      { rowIndex: 0, colIndex: 1, validPlayers: ['Steven Stamkos', 'Vincent Lecavalier', 'Nikita Kucherov', 'Brian Bradley', 'Dave Andreychuk', 'Martin St. Louis'] },
      // Lightning x Vezina (goalies)
      { rowIndex: 0, colIndex: 2, validPlayers: ['Andrei Vasilevskiy', 'Ben Bishop', 'Nikolai Khabibulin', 'Mike Smith', 'Curtis Joseph'] },
      // Rangers x Devils
      { rowIndex: 1, colIndex: 0, validPlayers: ['Bobby Holik', 'John MacLean', 'Brendan Shanahan', 'Martin Brodeur', 'Scott Gomez', 'Petr Sykora'] },
      // Rangers x 40+ Goals
      { rowIndex: 1, colIndex: 1, validPlayers: ['Vic Hadfield', 'Rod Gilbert', 'Adam Graves', 'Jaromir Jagr', 'Mike Gartner', 'Pierre Larouche'] },
      // Rangers x Vezina (goalies)
      { rowIndex: 1, colIndex: 2, validPlayers: ['Henrik Lundqvist', 'Ed Giacomin', 'John Vanbiesbrouck', 'Gump Worsley', 'Mike Richter'] },
      // Hart Trophy x Devils
      { rowIndex: 2, colIndex: 0, validPlayers: ['Mark Messier', 'Wayne Gretzky', 'Eric Lindros', 'Dominik Hasek', 'Bobby Holik'] },
      // Hart Trophy x 40+ Goals
      { rowIndex: 2, colIndex: 1, validPlayers: ['Wayne Gretzky', 'Mario Lemieux', 'Alexander Ovechkin', 'Guy Lafleur', 'Bobby Hull', 'Phil Esposito', 'Gordie Howe'] },
      // Hart Trophy x Vezina
      { rowIndex: 2, colIndex: 2, validPlayers: ['Dominik Hasek', 'Jose Theodore', 'Carey Price', 'Jacques Plante', 'Al Rollins'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 11: Flyers / Blues / Ducks  x  Bruins / Conn Smythe / 80+ Points
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Philadelphia Flyers', value: 'flyers' },
      { type: 'team', label: 'St. Louis Blues', value: 'blues' },
      { type: 'team', label: 'Anaheim Ducks', value: 'ducks' },
    ],
    cols: [
      { type: 'team', label: 'Boston Bruins', value: 'bruins' },
      { type: 'award', label: 'Conn Smythe Trophy', value: 'conn-smythe' },
      { type: 'stat', label: '80+ Points Season', value: '80points' },
    ],
    cells: [
      // Flyers x Bruins
      { rowIndex: 0, colIndex: 0, validPlayers: ['Reggie Leach', 'Rick Middleton', 'Dave Poulin', 'Mark Recchi', 'Terry OReilly', 'Ken Linseman', 'James van Riemsdyk'] },
      // Flyers x Conn Smythe
      { rowIndex: 0, colIndex: 1, validPlayers: ['Bernie Parent', 'Reggie Leach', 'Bobby Clarke', 'Bill Barber', 'Ron Hextall'] },
      // Flyers x 80+ Points
      { rowIndex: 0, colIndex: 2, validPlayers: ['Bobby Clarke', 'Eric Lindros', 'Mark Recchi', 'Brian Propp', 'Tim Kerr', 'John LeClair', 'Bill Barber', 'Claude Giroux'] },
      // Blues x Bruins
      { rowIndex: 1, colIndex: 0, validPlayers: ['Phil Esposito', 'Joe Thornton', 'Adam Oates', 'Rick Middleton', 'Wayne Cashman', 'Glen Wesley'] },
      // Blues x Conn Smythe
      { rowIndex: 1, colIndex: 1, validPlayers: ['Glenn Hall', 'Wayne Gretzky', 'Brett Hull', 'Al MacInnis', 'Grant Fuhr'] },
      // Blues x 80+ Points
      { rowIndex: 1, colIndex: 2, validPlayers: ['Brett Hull', 'Adam Oates', 'Bernie Federko', 'Pierre Turgeon', 'Brendan Shanahan', 'Wayne Gretzky', 'Pavol Demitra'] },
      // Ducks x Bruins
      { rowIndex: 2, colIndex: 0, validPlayers: ['Andy Moog', 'David Backes', 'Adam Henrique', 'Nick Ritchie', 'Ondrej Kase', 'Sean Kuraly'] },
      // Ducks x Conn Smythe
      { rowIndex: 2, colIndex: 1, validPlayers: ['Jean-Sebastien Giguere', 'Scott Niedermayer', 'Teemu Selanne', 'Chris Pronger', 'Corey Perry'] },
      // Ducks x 80+ Points
      { rowIndex: 2, colIndex: 2, validPlayers: ['Teemu Selanne', 'Paul Kariya', 'Ryan Getzlaf', 'Corey Perry', 'Bobby Ryan', 'Rickard Rakell'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 12: Penguins / Canadiens / Kings  x  Red Wings / Norris Trophy / 100+ Points
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Pittsburgh Penguins', value: 'penguins' },
      { type: 'team', label: 'Montreal Canadiens', value: 'canadiens' },
      { type: 'team', label: 'Los Angeles Kings', value: 'kings' },
    ],
    cols: [
      { type: 'team', label: 'Detroit Red Wings', value: 'red-wings' },
      { type: 'award', label: 'Norris Trophy', value: 'norris' },
      { type: 'stat', label: '100+ Points Season', value: '100points' },
    ],
    cells: [
      // Penguins x Red Wings
      { rowIndex: 0, colIndex: 0, validPlayers: ['Larry Murphy', 'Sergei Fedorov', 'Dino Ciccarelli', 'Luc Robitaille', 'Jim Rutherford', 'Ulf Samuelsson'] },
      // Penguins x Norris Trophy
      { rowIndex: 0, colIndex: 1, validPlayers: ['Paul Coffey', 'Randy Carlyle', 'Kris Letang', 'Larry Murphy', 'Sergei Zubov'] },
      // Penguins x 100+ Points
      { rowIndex: 0, colIndex: 2, validPlayers: ['Mario Lemieux', 'Sidney Crosby', 'Jaromir Jagr', 'Kevin Stevens', 'Ron Francis', 'Evgeni Malkin', 'Mark Recchi'] },
      // Canadiens x Red Wings
      { rowIndex: 1, colIndex: 0, validPlayers: ['Frank Mahovlich', 'Marcel Pronovost', 'Igor Larionov', 'Shayne Corson', 'Kirk Maltby', 'Red Kelly'] },
      // Canadiens x Norris Trophy
      { rowIndex: 1, colIndex: 1, validPlayers: ['Larry Robinson', 'Serge Savard', 'Doug Harvey', 'Tom Johnson', 'P.K. Subban', 'Chris Chelios'] },
      // Canadiens x 100+ Points
      { rowIndex: 1, colIndex: 2, validPlayers: ['Guy Lafleur', 'Pete Mahovlich', 'Steve Shutt', 'Pierre Larouche', 'Mats Naslund'] },
      // Kings x Red Wings
      { rowIndex: 2, colIndex: 0, validPlayers: ['Marcel Dionne', 'Luc Robitaille', 'Larry Murphy', 'Rob Blake', 'Igor Larionov', 'Tomas Holmstrom'] },
      // Kings x Norris Trophy
      { rowIndex: 2, colIndex: 1, validPlayers: ['Rob Blake', 'Larry Robinson', 'Paul Coffey', 'Drew Doughty', 'Larry Murphy'] },
      // Kings x 100+ Points
      { rowIndex: 2, colIndex: 2, validPlayers: ['Wayne Gretzky', 'Marcel Dionne', 'Bernie Nicholls', 'Luc Robitaille', 'Dave Taylor'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 13: Maple Leafs / Bruins / 40+ Goals  x  Lightning / Calder Trophy / Stanley Cup
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Toronto Maple Leafs', value: 'maple-leafs' },
      { type: 'team', label: 'Boston Bruins', value: 'bruins' },
      { type: 'stat', label: '40+ Goals Season', value: '40goals' },
    ],
    cols: [
      { type: 'team', label: 'Tampa Bay Lightning', value: 'lightning' },
      { type: 'award', label: 'Calder Trophy', value: 'calder' },
      { type: 'award', label: 'Stanley Cup Champion', value: 'stanley-cup' },
    ],
    cells: [
      // Maple Leafs x Lightning
      { rowIndex: 0, colIndex: 0, validPlayers: ['Brian Bradley', 'Wendel Clark', 'Nikolai Borschevsky', 'Darcy Tucker', 'Alex Killorn', 'Alexander Mogilny'] },
      // Maple Leafs x Calder Trophy
      { rowIndex: 0, colIndex: 1, validPlayers: ['Syl Apps', 'Gaye Stewart', 'Howie Meeker', 'Frank McCool', 'Brit Selby', 'Auston Matthews'] },
      // Maple Leafs x Stanley Cup
      { rowIndex: 0, colIndex: 2, validPlayers: ['Syl Apps', 'Ted Kennedy', 'Dave Keon', 'Frank Mahovlich', 'Johnny Bower', 'Red Kelly', 'Turk Broda', 'Max Bentley'] },
      // Bruins x Lightning
      { rowIndex: 1, colIndex: 0, validPlayers: ['Nolan Foote', 'Brian Rolston', 'Dan Boyle', 'Zach Bogosian', 'Brandon Carlo', 'Mark Recchi'] },
      // Bruins x Calder Trophy
      { rowIndex: 1, colIndex: 1, validPlayers: ['Bobby Orr', 'Sergei Samsonov', 'Andrew Raycroft', 'Jack Gelineau', 'Larry Regan'] },
      // Bruins x Stanley Cup
      { rowIndex: 1, colIndex: 2, validPlayers: ['Bobby Orr', 'Phil Esposito', 'Ray Bourque', 'Cam Neely', 'Tim Thomas', 'Patrice Bergeron', 'Zdeno Chara', 'Brad Marchand'] },
      // 40+ Goals x Lightning
      { rowIndex: 2, colIndex: 0, validPlayers: ['Steven Stamkos', 'Vincent Lecavalier', 'Nikita Kucherov', 'Dave Andreychuk', 'Brian Bradley', 'Martin St. Louis'] },
      // 40+ Goals x Calder Trophy
      { rowIndex: 2, colIndex: 1, validPlayers: ['Teemu Selanne', 'Mike Bossy', 'Auston Matthews', 'Alexander Ovechkin', 'Luc Robitaille'] },
      // 40+ Goals x Stanley Cup
      { rowIndex: 2, colIndex: 2, validPlayers: ['Mike Bossy', 'Jari Kurri', 'Wayne Gretzky', 'Brett Hull', 'Cam Neely', 'Luc Robitaille', 'Steven Stamkos', 'Patrick Kane'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 14: Blackhawks / Rangers / Blues  x  Avalanche / Ted Lindsay Award / 50+ Assists
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Chicago Blackhawks', value: 'blackhawks' },
      { type: 'team', label: 'New York Rangers', value: 'rangers' },
      { type: 'team', label: 'St. Louis Blues', value: 'blues' },
    ],
    cols: [
      { type: 'team', label: 'Colorado Avalanche', value: 'avalanche' },
      { type: 'award', label: 'Ted Lindsay Award', value: 'ted-lindsay' },
      { type: 'stat', label: '50+ Assists Season', value: '50assists' },
    ],
    cells: [
      // Blackhawks x Avalanche
      { rowIndex: 0, colIndex: 0, validPlayers: ['Dale Hunter', 'Michel Goulet', 'Peter Forsberg', 'Chris Chelios', 'Marian Hossa', 'Phil Esposito'] },
      // Blackhawks x Ted Lindsay Award
      { rowIndex: 0, colIndex: 1, validPlayers: ['Bobby Hull', 'Stan Mikita', 'Patrick Kane', 'Jonathan Toews', 'Guy Lafleur'] },
      // Blackhawks x 50+ Assists
      { rowIndex: 0, colIndex: 2, validPlayers: ['Stan Mikita', 'Denis Savard', 'Bobby Hull', 'Patrick Kane', 'Jeremy Roenick', 'Steve Larmer'] },
      // Rangers x Avalanche
      { rowIndex: 1, colIndex: 0, validPlayers: ['Peter Forsberg', 'Joe Sakic', 'Theoren Fleury', 'Claude Lemieux', 'Brian Leetch', 'Eric Lacroix'] },
      // Rangers x Ted Lindsay Award
      { rowIndex: 1, colIndex: 1, validPlayers: ['Jaromir Jagr', 'Mark Messier', 'Wayne Gretzky', 'Artemi Panarin', 'Guy Lafleur'] },
      // Rangers x 50+ Assists
      { rowIndex: 1, colIndex: 2, validPlayers: ['Brian Leetch', 'Mark Messier', 'Wayne Gretzky', 'Jean Ratelle', 'Jaromir Jagr', 'Artemi Panarin', 'Mika Zibanejad'] },
      // Blues x Avalanche
      { rowIndex: 2, colIndex: 0, validPlayers: ['Joe Sakic', 'Peter Forsberg', 'Michel Goulet', 'Keith Tkachuk', 'Chris Pronger', 'Bret Hedican'] },
      // Blues x Ted Lindsay Award
      { rowIndex: 2, colIndex: 1, validPlayers: ['Wayne Gretzky', 'Brett Hull', 'Mark Messier', 'Guy Lafleur', 'Phil Esposito'] },
      // Blues x 50+ Assists
      { rowIndex: 2, colIndex: 2, validPlayers: ['Bernie Federko', 'Adam Oates', 'Brett Hull', 'Wayne Gretzky', 'Pierre Turgeon', 'Garry Unger'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 15: Oilers / Flyers / Ted Lindsay Award  x  Maple Leafs / 20+ Goals / Hart Trophy
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Edmonton Oilers', value: 'oilers' },
      { type: 'team', label: 'Philadelphia Flyers', value: 'flyers' },
      { type: 'award', label: 'Ted Lindsay Award', value: 'ted-lindsay' },
    ],
    cols: [
      { type: 'team', label: 'Toronto Maple Leafs', value: 'maple-leafs' },
      { type: 'stat', label: '20+ Goals Season', value: '20goals' },
      { type: 'award', label: 'Hart Trophy', value: 'hart' },
    ],
    cells: [
      // Oilers x Maple Leafs
      { rowIndex: 0, colIndex: 0, validPlayers: ['Grant Fuhr', 'Glenn Anderson', 'Cody Ceci', 'Tyson Barrie', 'Jason Arnott', 'Curtis Joseph'] },
      // Oilers x 20+ Goals
      { rowIndex: 0, colIndex: 1, validPlayers: ['Wayne Gretzky', 'Mark Messier', 'Jari Kurri', 'Glenn Anderson', 'Connor McDavid', 'Leon Draisaitl', 'Ryan Smyth', 'Ryan Nugent-Hopkins'] },
      // Oilers x Hart Trophy
      { rowIndex: 0, colIndex: 2, validPlayers: ['Wayne Gretzky', 'Mark Messier', 'Connor McDavid', 'Leon Draisaitl', 'Grant Fuhr'] },
      // Flyers x Maple Leafs
      { rowIndex: 1, colIndex: 0, validPlayers: ['Eric Lindros', 'Luke Richardson', 'Jeff Carter', 'Owen Nolan', 'Darcy Tucker', 'Dave Poulin'] },
      // Flyers x 20+ Goals
      { rowIndex: 1, colIndex: 1, validPlayers: ['Bobby Clarke', 'Bill Barber', 'Tim Kerr', 'Brian Propp', 'Rick Tocchet', 'Eric Lindros', 'John LeClair', 'Reggie Leach', 'Claude Giroux', 'Mark Recchi'] },
      // Flyers x Hart Trophy
      { rowIndex: 1, colIndex: 2, validPlayers: ['Bobby Clarke', 'Eric Lindros', 'Mark Messier', 'Bill Barber', 'Mark Howe'] },
      // Ted Lindsay Award x Maple Leafs
      { rowIndex: 2, colIndex: 0, validPlayers: ['Auston Matthews', 'Mats Sundin', 'Ted Kennedy', 'Darryl Sittler', 'Lanny McDonald'] },
      // Ted Lindsay Award x 20+ Goals
      { rowIndex: 2, colIndex: 1, validPlayers: ['Wayne Gretzky', 'Mario Lemieux', 'Jaromir Jagr', 'Alexander Ovechkin', 'Sidney Crosby', 'Guy Lafleur', 'Auston Matthews'] },
      // Ted Lindsay Award x Hart Trophy
      { rowIndex: 2, colIndex: 2, validPlayers: ['Wayne Gretzky', 'Mario Lemieux', 'Sidney Crosby', 'Alexander Ovechkin', 'Connor McDavid', 'Mark Messier'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 16: Red Wings / Penguins / Conn Smythe  x  Canadiens / 40+ Goals / Calder Trophy
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Detroit Red Wings', value: 'red-wings' },
      { type: 'team', label: 'Pittsburgh Penguins', value: 'penguins' },
      { type: 'award', label: 'Conn Smythe Trophy', value: 'conn-smythe' },
    ],
    cols: [
      { type: 'team', label: 'Montreal Canadiens', value: 'canadiens' },
      { type: 'stat', label: '40+ Goals Season', value: '40goals' },
      { type: 'award', label: 'Calder Trophy', value: 'calder' },
    ],
    cells: [
      // Red Wings x Canadiens
      { rowIndex: 0, colIndex: 0, validPlayers: ['Frank Mahovlich', 'Red Kelly', 'Igor Larionov', 'Marcel Pronovost', 'Kirk Maltby', 'Shayne Corson'] },
      // Red Wings x 40+ Goals
      { rowIndex: 0, colIndex: 1, validPlayers: ['Steve Yzerman', 'Sergei Fedorov', 'Brendan Shanahan', 'Dino Ciccarelli', 'Mickey Redmond', 'John Ogrodnick', 'Luc Robitaille'] },
      // Red Wings x Calder Trophy
      { rowIndex: 0, colIndex: 2, validPlayers: ['Glenn Hall', 'Terry Sawchuk', 'Roger Crozier', 'Jim McFadden', 'Larry Aurie'] },
      // Penguins x Canadiens
      { rowIndex: 1, colIndex: 0, validPlayers: ['Ron Francis', 'Mario Lemieux', 'Lyle Odelein', 'Ulf Samuelsson', 'Syl Apps Jr.', 'Rick Kehoe'] },
      // Penguins x 40+ Goals
      { rowIndex: 1, colIndex: 1, validPlayers: ['Mario Lemieux', 'Jaromir Jagr', 'Sidney Crosby', 'Kevin Stevens', 'Rick Kehoe', 'Jean Pronovost', 'Pierre Larouche'] },
      // Penguins x Calder Trophy
      { rowIndex: 1, colIndex: 2, validPlayers: ['Mario Lemieux', 'Sidney Crosby', 'Evgeni Malkin', 'Marc-Andre Fleury', 'Matt Murray'] },
      // Conn Smythe x Canadiens
      { rowIndex: 2, colIndex: 0, validPlayers: ['Patrick Roy', 'Jean Beliveau', 'Serge Savard', 'Larry Robinson', 'Bob Gainey', 'Ken Dryden', 'Yvan Cournoyer'] },
      // Conn Smythe x 40+ Goals
      { rowIndex: 2, colIndex: 1, validPlayers: ['Wayne Gretzky', 'Mario Lemieux', 'Mike Bossy', 'Bobby Orr', 'Brett Hull', 'Cam Neely'] },
      // Conn Smythe x Calder Trophy
      { rowIndex: 2, colIndex: 2, validPlayers: ['Patrick Roy', 'Bobby Orr', 'Ken Dryden', 'Cale Makar', 'Mario Lemieux'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 17: Bruins / Lightning / Norris Trophy  x  Kings / 50+ Assists / Stanley Cup
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Boston Bruins', value: 'bruins' },
      { type: 'team', label: 'Tampa Bay Lightning', value: 'lightning' },
      { type: 'award', label: 'Norris Trophy', value: 'norris' },
    ],
    cols: [
      { type: 'team', label: 'Los Angeles Kings', value: 'kings' },
      { type: 'stat', label: '50+ Assists Season', value: '50assists' },
      { type: 'award', label: 'Stanley Cup Champion', value: 'stanley-cup' },
    ],
    cells: [
      // Bruins x Kings
      { rowIndex: 0, colIndex: 0, validPlayers: ['Rick Middleton', 'Luc Robitaille', 'Milan Lucic', 'Adam Oates', 'Butch Goring', 'Charlie Simmer'] },
      // Bruins x 50+ Assists
      { rowIndex: 0, colIndex: 1, validPlayers: ['Bobby Orr', 'Phil Esposito', 'Adam Oates', 'Joe Juneau', 'Barry Pederson', 'Joe Thornton', 'David Pastrnak'] },
      // Bruins x Stanley Cup
      { rowIndex: 0, colIndex: 2, validPlayers: ['Bobby Orr', 'Phil Esposito', 'Tim Thomas', 'Patrice Bergeron', 'Zdeno Chara', 'Brad Marchand', 'Gerry Cheevers', 'Cam Neely'] },
      // Lightning x Kings
      { rowIndex: 1, colIndex: 0, validPlayers: ['Luc Robitaille', 'Rob Blake', 'Dave Taylor', 'Brad Richards', 'Ben Bishop', 'Brayden Point'] },
      // Lightning x 50+ Assists
      { rowIndex: 1, colIndex: 1, validPlayers: ['Martin St. Louis', 'Nikita Kucherov', 'Vincent Lecavalier', 'Brad Richards', 'Steven Stamkos', 'Phil Esposito'] },
      // Lightning x Stanley Cup
      { rowIndex: 1, colIndex: 2, validPlayers: ['Brad Richards', 'Nikita Kucherov', 'Victor Hedman', 'Andrei Vasilevskiy', 'Steven Stamkos', 'Brayden Point', 'Dave Andreychuk'] },
      // Norris Trophy x Kings
      { rowIndex: 2, colIndex: 0, validPlayers: ['Rob Blake', 'Drew Doughty', 'Larry Robinson', 'Paul Coffey', 'Larry Murphy'] },
      // Norris Trophy x 50+ Assists
      { rowIndex: 2, colIndex: 1, validPlayers: ['Bobby Orr', 'Paul Coffey', 'Brian Leetch', 'Al MacInnis', 'Denis Potvin', 'Ray Bourque', 'Cale Makar'] },
      // Norris Trophy x Stanley Cup
      { rowIndex: 2, colIndex: 2, validPlayers: ['Bobby Orr', 'Larry Robinson', 'Nicklas Lidstrom', 'Scott Niedermayer', 'Duncan Keith', 'Cale Makar', 'Paul Coffey', 'Ray Bourque'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 18: Blackhawks / Ducks / Devils  x  Oilers / 80+ Points / Conn Smythe
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Chicago Blackhawks', value: 'blackhawks' },
      { type: 'team', label: 'Anaheim Ducks', value: 'ducks' },
      { type: 'team', label: 'New Jersey Devils', value: 'devils' },
    ],
    cols: [
      { type: 'team', label: 'Edmonton Oilers', value: 'oilers' },
      { type: 'stat', label: '80+ Points Season', value: '80points' },
      { type: 'award', label: 'Conn Smythe Trophy', value: 'conn-smythe' },
    ],
    cells: [
      // Blackhawks x Oilers
      { rowIndex: 0, colIndex: 0, validPlayers: ['Duncan Keith', 'Brett Hull', 'Seth Jones', 'Chris Chelios', 'Esa Tikkanen', 'Adam Larsson'] },
      // Blackhawks x 80+ Points
      { rowIndex: 0, colIndex: 1, validPlayers: ['Bobby Hull', 'Stan Mikita', 'Denis Savard', 'Jeremy Roenick', 'Patrick Kane', 'Jonathan Toews', 'Steve Larmer'] },
      // Blackhawks x Conn Smythe
      { rowIndex: 0, colIndex: 2, validPlayers: ['Jonathan Toews', 'Patrick Kane', 'Duncan Keith', 'Bobby Hull', 'Stan Mikita'] },
      // Ducks x Oilers
      { rowIndex: 1, colIndex: 0, validPlayers: ['Chris Pronger', 'Ryan Smyth', 'Ales Hemsky', 'Andrew Cogliano', 'Patrick Maroon', 'Jason Chimera'] },
      // Ducks x 80+ Points
      { rowIndex: 1, colIndex: 1, validPlayers: ['Teemu Selanne', 'Paul Kariya', 'Ryan Getzlaf', 'Corey Perry', 'Bobby Ryan', 'Rickard Rakell'] },
      // Ducks x Conn Smythe
      { rowIndex: 1, colIndex: 2, validPlayers: ['Jean-Sebastien Giguere', 'Scott Niedermayer', 'Teemu Selanne', 'Chris Pronger', 'Corey Perry'] },
      // Devils x Oilers
      { rowIndex: 2, colIndex: 0, validPlayers: ['Jason Arnott', 'Bill Guerin', 'Petr Sykora', 'Dwayne Roloson', 'Curtis Joseph', 'Ales Hemsky'] },
      // Devils x 80+ Points
      { rowIndex: 2, colIndex: 1, validPlayers: ['Patrik Elias', 'Alexander Mogilny', 'Scott Stevens', 'Peter Stastny', 'Bobby Holik', 'Jack Hughes'] },
      // Devils x Conn Smythe
      { rowIndex: 2, colIndex: 2, validPlayers: ['Claude Lemieux', 'Scott Stevens', 'Scott Niedermayer', 'Martin Brodeur', 'Neal Broten'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 19: Canadiens / Flyers / Avalanche  x  Blackhawks / Hart Trophy / 30+ Wins
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Montreal Canadiens', value: 'canadiens' },
      { type: 'team', label: 'Philadelphia Flyers', value: 'flyers' },
      { type: 'team', label: 'Colorado Avalanche', value: 'avalanche' },
    ],
    cols: [
      { type: 'team', label: 'Chicago Blackhawks', value: 'blackhawks' },
      { type: 'award', label: 'Hart Trophy', value: 'hart' },
      { type: 'stat', label: '30+ Wins Season', value: '30wins' },
    ],
    cells: [
      // Canadiens x Blackhawks
      { rowIndex: 0, colIndex: 0, validPlayers: ['Phil Esposito', 'Chris Chelios', 'Denis Savard', 'Henri Richard', 'Jacques Lemaire', 'Pit Martin'] },
      // Canadiens x Hart Trophy
      { rowIndex: 0, colIndex: 1, validPlayers: ['Jean Beliveau', 'Guy Lafleur', 'Carey Price', 'Howie Morenz', 'Maurice Richard', 'Jose Theodore'] },
      // Canadiens x 30+ Wins (goalies)
      { rowIndex: 0, colIndex: 2, validPlayers: ['Patrick Roy', 'Ken Dryden', 'Jacques Plante', 'Carey Price', 'Jose Theodore', 'Gump Worsley'] },
      // Flyers x Blackhawks
      { rowIndex: 1, colIndex: 0, validPlayers: ['Bobby Hull', 'Jeremy Roenick', 'Mikael Renberg', 'Jeff Carter', 'Chris Chelios', 'Tony Amonte'] },
      // Flyers x Hart Trophy
      { rowIndex: 1, colIndex: 1, validPlayers: ['Bobby Clarke', 'Eric Lindros', 'Mark Messier', 'Bill Barber', 'Mark Howe'] },
      // Flyers x 30+ Wins (goalies)
      { rowIndex: 1, colIndex: 2, validPlayers: ['Bernie Parent', 'Ron Hextall', 'Pelle Lindbergh', 'Steve Mason', 'Robert Esche', 'Roman Cechmanek'] },
      // Avalanche x Blackhawks
      { rowIndex: 2, colIndex: 0, validPlayers: ['Michel Goulet', 'Peter Forsberg', 'Dale Hunter', 'Chris Chelios', 'Marian Hossa', 'Phil Esposito'] },
      // Avalanche x Hart Trophy
      { rowIndex: 2, colIndex: 1, validPlayers: ['Joe Sakic', 'Peter Forsberg', 'Nathan MacKinnon', 'Guy Lafleur', 'Wayne Gretzky'] },
      // Avalanche x 30+ Wins (goalies)
      { rowIndex: 2, colIndex: 2, validPlayers: ['Patrick Roy', 'Semyon Varlamov', 'Philipp Grubauer', 'Craig Anderson', 'David Aebischer', 'Alexandar Georgiev'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 20: Red Wings / Oilers / Blues  x  Penguins / 100+ Points / Norris Trophy
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Detroit Red Wings', value: 'red-wings' },
      { type: 'team', label: 'Edmonton Oilers', value: 'oilers' },
      { type: 'team', label: 'St. Louis Blues', value: 'blues' },
    ],
    cols: [
      { type: 'team', label: 'Pittsburgh Penguins', value: 'penguins' },
      { type: 'stat', label: '100+ Points Season', value: '100points' },
      { type: 'award', label: 'Norris Trophy', value: 'norris' },
    ],
    cells: [
      // Red Wings x Penguins
      { rowIndex: 0, colIndex: 0, validPlayers: ['Larry Murphy', 'Sergei Fedorov', 'Dino Ciccarelli', 'Luc Robitaille', 'Jim Rutherford', 'Petr Nedved'] },
      // Red Wings x 100+ Points
      { rowIndex: 0, colIndex: 1, validPlayers: ['Steve Yzerman', 'Sergei Fedorov', 'Marcel Dionne', 'Dino Ciccarelli', 'Brendan Shanahan', 'Henrik Zetterberg'] },
      // Red Wings x Norris Trophy
      { rowIndex: 0, colIndex: 2, validPlayers: ['Nicklas Lidstrom', 'Red Kelly', 'Paul Coffey', 'Chris Chelios', 'Marcel Pronovost'] },
      // Oilers x Penguins
      { rowIndex: 1, colIndex: 0, validPlayers: ['Mark Recchi', 'Kevin Stevens', 'Chris Joseph', 'Petr Nedved', 'Jeff Petry', 'Rob Brown'] },
      // Oilers x 100+ Points
      { rowIndex: 1, colIndex: 1, validPlayers: ['Wayne Gretzky', 'Mark Messier', 'Jari Kurri', 'Paul Coffey', 'Connor McDavid', 'Leon Draisaitl', 'Glenn Anderson'] },
      // Oilers x Norris Trophy
      { rowIndex: 1, colIndex: 2, validPlayers: ['Paul Coffey', 'Chris Pronger', 'Al MacInnis', 'Kevin Lowe', 'Charlie Huddy'] },
      // Blues x Penguins
      { rowIndex: 2, colIndex: 0, validPlayers: ['Larry Murphy', 'Jaromir Jagr', 'Doug Weight', 'Paul Stastny', 'Jordan Staal', 'Kevin Stevens'] },
      // Blues x 100+ Points
      { rowIndex: 2, colIndex: 1, validPlayers: ['Brett Hull', 'Adam Oates', 'Bernie Federko', 'Wayne Gretzky', 'Pierre Turgeon', 'Red Berenson'] },
      // Blues x Norris Trophy
      { rowIndex: 2, colIndex: 2, validPlayers: ['Chris Pronger', 'Al MacInnis', 'Scott Stevens', 'Rob Blake', 'Larry Robinson'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 21: Rangers / Maple Leafs / 50+ Assists  x  Flyers / Stanley Cup / Hart Trophy
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'New York Rangers', value: 'rangers' },
      { type: 'team', label: 'Toronto Maple Leafs', value: 'maple-leafs' },
      { type: 'stat', label: '50+ Assists Season', value: '50assists' },
    ],
    cols: [
      { type: 'team', label: 'Philadelphia Flyers', value: 'flyers' },
      { type: 'award', label: 'Stanley Cup Champion', value: 'stanley-cup' },
      { type: 'award', label: 'Hart Trophy', value: 'hart' },
    ],
    cells: [
      // Rangers x Flyers
      { rowIndex: 0, colIndex: 0, validPlayers: ['John LeClair', 'Rick Tocchet', 'Mark Recchi', 'Eric Lindros', 'Wayne Simmonds', 'Jaromir Jagr'] },
      // Rangers x Stanley Cup
      { rowIndex: 0, colIndex: 1, validPlayers: ['Mark Messier', 'Brian Leetch', 'Mike Richter', 'Adam Graves', 'Wayne Gretzky', 'Jeff Beukeboom', 'Esa Tikkanen'] },
      // Rangers x Hart Trophy
      { rowIndex: 0, colIndex: 2, validPlayers: ['Mark Messier', 'Wayne Gretzky', 'Andy Bathgate', 'Buddy OConnor', 'Chuck Rayner'] },
      // Maple Leafs x Flyers
      { rowIndex: 1, colIndex: 0, validPlayers: ['Eric Lindros', 'Owen Nolan', 'Jeff Carter', 'Darcy Tucker', 'Mike Richards', 'Luke Richardson'] },
      // Maple Leafs x Stanley Cup
      { rowIndex: 1, colIndex: 1, validPlayers: ['Dave Keon', 'Frank Mahovlich', 'Johnny Bower', 'Red Kelly', 'Syl Apps', 'Ted Kennedy', 'Turk Broda', 'George Armstrong'] },
      // Maple Leafs x Hart Trophy
      { rowIndex: 1, colIndex: 2, validPlayers: ['Ted Kennedy', 'Auston Matthews', 'Babe Pratt', 'Syl Apps', 'Max Bentley'] },
      // 50+ Assists x Flyers
      { rowIndex: 2, colIndex: 0, validPlayers: ['Bobby Clarke', 'Eric Lindros', 'Brian Propp', 'Mark Recchi', 'Bill Barber', 'Claude Giroux'] },
      // 50+ Assists x Stanley Cup
      { rowIndex: 2, colIndex: 1, validPlayers: ['Wayne Gretzky', 'Mark Messier', 'Paul Coffey', 'Mario Lemieux', 'Bobby Orr', 'Sidney Crosby', 'Bryan Trottier'] },
      // 50+ Assists x Hart Trophy
      { rowIndex: 2, colIndex: 2, validPlayers: ['Wayne Gretzky', 'Mario Lemieux', 'Bobby Orr', 'Connor McDavid', 'Jaromir Jagr', 'Mark Messier', 'Sidney Crosby'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 22: Penguins / Kings / Calder Trophy  x  Bruins / 40+ Goals / Ted Lindsay Award
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Pittsburgh Penguins', value: 'penguins' },
      { type: 'team', label: 'Los Angeles Kings', value: 'kings' },
      { type: 'award', label: 'Calder Trophy', value: 'calder' },
    ],
    cols: [
      { type: 'team', label: 'Boston Bruins', value: 'bruins' },
      { type: 'stat', label: '40+ Goals Season', value: '40goals' },
      { type: 'award', label: 'Ted Lindsay Award', value: 'ted-lindsay' },
    ],
    cells: [
      // Penguins x Bruins
      { rowIndex: 0, colIndex: 0, validPlayers: ['Phil Kessel', 'Frank Mahovlich', 'Rick Middleton', 'Ron Francis', 'Darius Kasparaitis', 'Glen Murray'] },
      // Penguins x 40+ Goals
      { rowIndex: 0, colIndex: 1, validPlayers: ['Mario Lemieux', 'Jaromir Jagr', 'Sidney Crosby', 'Kevin Stevens', 'Rick Kehoe', 'Jean Pronovost', 'Pierre Larouche'] },
      // Penguins x Ted Lindsay Award
      { rowIndex: 0, colIndex: 2, validPlayers: ['Mario Lemieux', 'Jaromir Jagr', 'Sidney Crosby', 'Evgeni Malkin', 'Mark Recchi'] },
      // Kings x Bruins
      { rowIndex: 1, colIndex: 0, validPlayers: ['Milan Lucic', 'Luc Robitaille', 'Rick Middleton', 'Adam Oates', 'Butch Goring', 'Charlie Simmer'] },
      // Kings x 40+ Goals
      { rowIndex: 1, colIndex: 1, validPlayers: ['Marcel Dionne', 'Luc Robitaille', 'Wayne Gretzky', 'Charlie Simmer', 'Bernie Nicholls', 'Dave Taylor'] },
      // Kings x Ted Lindsay Award
      { rowIndex: 1, colIndex: 2, validPlayers: ['Wayne Gretzky', 'Marcel Dionne', 'Luc Robitaille', 'Anze Kopitar', 'Dave Taylor'] },
      // Calder Trophy x Bruins
      { rowIndex: 2, colIndex: 0, validPlayers: ['Bobby Orr', 'Sergei Samsonov', 'Andrew Raycroft', 'Jack Gelineau', 'Larry Regan'] },
      // Calder Trophy x 40+ Goals
      { rowIndex: 2, colIndex: 1, validPlayers: ['Teemu Selanne', 'Mike Bossy', 'Auston Matthews', 'Alexander Ovechkin', 'Luc Robitaille'] },
      // Calder Trophy x Ted Lindsay Award
      { rowIndex: 2, colIndex: 2, validPlayers: ['Mario Lemieux', 'Alexander Ovechkin', 'Sidney Crosby', 'Teemu Selanne', 'Evgeni Malkin'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 23: Canadiens / Blackhawks / Lightning  x  Blues / 20+ Goals / Vezina Trophy
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Montreal Canadiens', value: 'canadiens' },
      { type: 'team', label: 'Chicago Blackhawks', value: 'blackhawks' },
      { type: 'team', label: 'Tampa Bay Lightning', value: 'lightning' },
    ],
    cols: [
      { type: 'team', label: 'St. Louis Blues', value: 'blues' },
      { type: 'stat', label: '20+ Goals Season', value: '20goals' },
      { type: 'award', label: 'Vezina Trophy', value: 'vezina' },
    ],
    cells: [
      // Canadiens x Blues
      { rowIndex: 0, colIndex: 0, validPlayers: ['Dickie Moore', 'Doug Harvey', 'Chris Chelios', 'Guy Carbonneau', 'Shayne Corson', 'Doug Gilmour'] },
      // Canadiens x 20+ Goals
      { rowIndex: 0, colIndex: 1, validPlayers: ['Guy Lafleur', 'Maurice Richard', 'Jean Beliveau', 'Steve Shutt', 'Yvan Cournoyer', 'Bobby Smith', 'Stephane Richer', 'Jacques Lemaire', 'Mats Naslund'] },
      // Canadiens x Vezina Trophy (goalies)
      { rowIndex: 0, colIndex: 2, validPlayers: ['Jacques Plante', 'Ken Dryden', 'Patrick Roy', 'Carey Price', 'Jose Theodore'] },
      // Blackhawks x Blues
      { rowIndex: 1, colIndex: 0, validPlayers: ['Brett Hull', 'Phil Esposito', 'Denis Savard', 'Doug Gilmour', 'Glenn Hall', 'Tyler Johnson'] },
      // Blackhawks x 20+ Goals
      { rowIndex: 1, colIndex: 1, validPlayers: ['Bobby Hull', 'Stan Mikita', 'Patrick Kane', 'Jonathan Toews', 'Jeremy Roenick', 'Denis Savard', 'Steve Larmer', 'Tony Amonte', 'Al Secord'] },
      // Blackhawks x Vezina Trophy (goalies)
      { rowIndex: 1, colIndex: 2, validPlayers: ['Glenn Hall', 'Tony Esposito', 'Ed Belfour', 'Charlie Gardiner', 'Lorne Chabot'] },
      // Lightning x Blues
      { rowIndex: 2, colIndex: 0, validPlayers: ['Phil Esposito', 'Ryan McDonagh', 'David Perron', 'Ryan Callahan', 'Brayden Point', 'Curtis Joseph'] },
      // Lightning x 20+ Goals
      { rowIndex: 2, colIndex: 1, validPlayers: ['Steven Stamkos', 'Vincent Lecavalier', 'Martin St. Louis', 'Nikita Kucherov', 'Brad Richards', 'Brian Bradley', 'Brayden Point'] },
      // Lightning x Vezina Trophy (goalies)
      { rowIndex: 2, colIndex: 2, validPlayers: ['Andrei Vasilevskiy', 'Ben Bishop', 'Nikolai Khabibulin', 'Curtis Joseph', 'Mike Smith'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 24: Oilers / Ducks / Hart Trophy  x  Red Wings / Stanley Cup / 80+ Points
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Edmonton Oilers', value: 'oilers' },
      { type: 'team', label: 'Anaheim Ducks', value: 'ducks' },
      { type: 'award', label: 'Hart Trophy', value: 'hart' },
    ],
    cols: [
      { type: 'team', label: 'Detroit Red Wings', value: 'red-wings' },
      { type: 'award', label: 'Stanley Cup Champion', value: 'stanley-cup' },
      { type: 'stat', label: '80+ Points Season', value: '80points' },
    ],
    cells: [
      // Oilers x Red Wings
      { rowIndex: 0, colIndex: 0, validPlayers: ['Adam Larsson', 'Ryan Smyth', 'Petr Klima', 'Mike Krushelnyski', 'Steve Staios', 'Chris Joseph'] },
      // Oilers x Stanley Cup
      { rowIndex: 0, colIndex: 1, validPlayers: ['Wayne Gretzky', 'Mark Messier', 'Paul Coffey', 'Jari Kurri', 'Grant Fuhr', 'Glenn Anderson', 'Kevin Lowe', 'Connor McDavid'] },
      // Oilers x 80+ Points
      { rowIndex: 0, colIndex: 2, validPlayers: ['Wayne Gretzky', 'Mark Messier', 'Jari Kurri', 'Paul Coffey', 'Connor McDavid', 'Leon Draisaitl', 'Glenn Anderson'] },
      // Ducks x Red Wings
      { rowIndex: 1, colIndex: 0, validPlayers: ['Brendan Shanahan', 'Chris Chelios', 'Igor Larionov', 'Jiri Fischer', 'Daniel Cleary', 'Andrew Cogliano'] },
      // Ducks x Stanley Cup
      { rowIndex: 1, colIndex: 1, validPlayers: ['Scott Niedermayer', 'Chris Pronger', 'Teemu Selanne', 'Jean-Sebastien Giguere', 'Corey Perry', 'Ryan Getzlaf', 'Andy McDonald'] },
      // Ducks x 80+ Points
      { rowIndex: 1, colIndex: 2, validPlayers: ['Teemu Selanne', 'Paul Kariya', 'Ryan Getzlaf', 'Corey Perry', 'Bobby Ryan', 'Rickard Rakell'] },
      // Hart Trophy x Red Wings
      { rowIndex: 2, colIndex: 0, validPlayers: ['Gordie Howe', 'Sergei Fedorov', 'Steve Yzerman', 'Dominik Hasek', 'Sid Abel'] },
      // Hart Trophy x Stanley Cup
      { rowIndex: 2, colIndex: 1, validPlayers: ['Wayne Gretzky', 'Mario Lemieux', 'Bobby Orr', 'Sidney Crosby', 'Mark Messier', 'Gordie Howe', 'Connor McDavid', 'Nathan MacKinnon'] },
      // Hart Trophy x 80+ Points
      { rowIndex: 2, colIndex: 2, validPlayers: ['Wayne Gretzky', 'Mario Lemieux', 'Sidney Crosby', 'Connor McDavid', 'Mark Messier', 'Bobby Orr', 'Nathan MacKinnon'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 25: Bruins / Red Wings / 40+ Goals  x  Rangers / Conn Smythe / Calder Trophy
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Boston Bruins', value: 'bruins' },
      { type: 'team', label: 'Detroit Red Wings', value: 'red-wings' },
      { type: 'stat', label: '40+ Goals Season', value: '40goals' },
    ],
    cols: [
      { type: 'team', label: 'New York Rangers', value: 'rangers' },
      { type: 'award', label: 'Conn Smythe Trophy', value: 'conn-smythe' },
      { type: 'award', label: 'Calder Trophy', value: 'calder' },
    ],
    cells: [
      // Bruins x Rangers
      { rowIndex: 0, colIndex: 0, validPlayers: ['Phil Esposito', 'Brad Park', 'Rick Middleton', 'Jean Ratelle', 'Carol Vadnais', 'Ken Hodge'] },
      // Bruins x Conn Smythe
      { rowIndex: 0, colIndex: 1, validPlayers: ['Bobby Orr', 'Tim Thomas', 'Phil Esposito', 'Cam Neely', 'Brad Park'] },
      // Bruins x Calder Trophy
      { rowIndex: 0, colIndex: 2, validPlayers: ['Bobby Orr', 'Sergei Samsonov', 'Andrew Raycroft', 'Jack Gelineau', 'Larry Regan'] },
      // Red Wings x Rangers
      { rowIndex: 1, colIndex: 0, validPlayers: ['Marcel Dionne', 'Adam Graves', 'Brendan Shanahan', 'Mike Gartner', 'Alex Delvecchio', 'Red Kelly'] },
      // Red Wings x Conn Smythe
      { rowIndex: 1, colIndex: 1, validPlayers: ['Henrik Zetterberg', 'Steve Yzerman', 'Mike Vernon', 'Nicklas Lidstrom', 'Gordie Howe'] },
      // Red Wings x Calder Trophy
      { rowIndex: 1, colIndex: 2, validPlayers: ['Glenn Hall', 'Terry Sawchuk', 'Roger Crozier', 'Jim McFadden', 'Larry Aurie'] },
      // 40+ Goals x Rangers
      { rowIndex: 2, colIndex: 0, validPlayers: ['Vic Hadfield', 'Adam Graves', 'Mike Gartner', 'Jaromir Jagr', 'Rod Gilbert', 'Pierre Larouche'] },
      // 40+ Goals x Conn Smythe
      { rowIndex: 2, colIndex: 1, validPlayers: ['Wayne Gretzky', 'Mario Lemieux', 'Mike Bossy', 'Bobby Orr', 'Brett Hull', 'Patrick Kane'] },
      // 40+ Goals x Calder Trophy
      { rowIndex: 2, colIndex: 2, validPlayers: ['Teemu Selanne', 'Mike Bossy', 'Alexander Ovechkin', 'Auston Matthews', 'Luc Robitaille'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 26: Maple Leafs / Avalanche / Kings  x  Canadiens / 50+ Assists / Ted Lindsay Award
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Toronto Maple Leafs', value: 'maple-leafs' },
      { type: 'team', label: 'Colorado Avalanche', value: 'avalanche' },
      { type: 'team', label: 'Los Angeles Kings', value: 'kings' },
    ],
    cols: [
      { type: 'team', label: 'Montreal Canadiens', value: 'canadiens' },
      { type: 'stat', label: '50+ Assists Season', value: '50assists' },
      { type: 'award', label: 'Ted Lindsay Award', value: 'ted-lindsay' },
    ],
    cells: [
      // Maple Leafs x Canadiens
      { rowIndex: 0, colIndex: 0, validPlayers: ['Frank Mahovlich', 'Dick Duff', 'Dickie Moore', 'Larry Robinson', 'Doug Gilmour', 'Red Kelly'] },
      // Maple Leafs x 50+ Assists
      { rowIndex: 0, colIndex: 1, validPlayers: ['Darryl Sittler', 'Doug Gilmour', 'Mats Sundin', 'Borje Salming', 'Phil Kessel', 'Auston Matthews'] },
      // Maple Leafs x Ted Lindsay Award
      { rowIndex: 0, colIndex: 2, validPlayers: ['Auston Matthews', 'Mats Sundin', 'Ted Kennedy', 'Darryl Sittler', 'Lanny McDonald'] },
      // Avalanche x Canadiens
      { rowIndex: 1, colIndex: 0, validPlayers: ['Patrick Roy', 'Guy Lafleur', 'John LeClair', 'Eric Desjardins', 'Mike Keane', 'Andrei Kovalenko'] },
      // Avalanche x 50+ Assists
      { rowIndex: 1, colIndex: 1, validPlayers: ['Peter Stastny', 'Joe Sakic', 'Peter Forsberg', 'Nathan MacKinnon', 'Michel Goulet', 'Mikko Rantanen', 'Cale Makar'] },
      // Avalanche x Ted Lindsay Award
      { rowIndex: 1, colIndex: 2, validPlayers: ['Peter Forsberg', 'Joe Sakic', 'Nathan MacKinnon', 'Peter Stastny', 'Michel Goulet'] },
      // Kings x Canadiens
      { rowIndex: 2, colIndex: 0, validPlayers: ['Larry Robinson', 'Luc Robitaille', 'Rogie Vachon', 'Marcel Dionne', 'Guy Lafleur', 'Jimmy Carson'] },
      // Kings x 50+ Assists
      { rowIndex: 2, colIndex: 1, validPlayers: ['Wayne Gretzky', 'Marcel Dionne', 'Bernie Nicholls', 'Luc Robitaille', 'Dave Taylor', 'Anze Kopitar'] },
      // Kings x Ted Lindsay Award
      { rowIndex: 2, colIndex: 2, validPlayers: ['Wayne Gretzky', 'Marcel Dionne', 'Luc Robitaille', 'Anze Kopitar', 'Dave Taylor'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 27: Flyers / Devils / 80+ Points  x  Oilers / Norris Trophy / Stanley Cup
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Philadelphia Flyers', value: 'flyers' },
      { type: 'team', label: 'New Jersey Devils', value: 'devils' },
      { type: 'stat', label: '80+ Points Season', value: '80points' },
    ],
    cols: [
      { type: 'team', label: 'Edmonton Oilers', value: 'oilers' },
      { type: 'award', label: 'Norris Trophy', value: 'norris' },
      { type: 'award', label: 'Stanley Cup Champion', value: 'stanley-cup' },
    ],
    cells: [
      // Flyers x Oilers
      { rowIndex: 0, colIndex: 0, validPlayers: ['Mark Recchi', 'Chris Pronger', 'Jari Kurri', 'Dave Brown', 'Craig MacTavish', 'Jeff Carter'] },
      // Flyers x Norris Trophy
      { rowIndex: 0, colIndex: 1, validPlayers: ['Mark Howe', 'Eric Desjardins', 'Chris Pronger', 'Bobby Orr', 'Tom Bladon'] },
      // Flyers x Stanley Cup
      { rowIndex: 0, colIndex: 2, validPlayers: ['Bobby Clarke', 'Bill Barber', 'Bernie Parent', 'Reggie Leach', 'Rick MacLeish', 'Gary Dornhoefer', 'Bob Kelly'] },
      // Devils x Oilers
      { rowIndex: 1, colIndex: 0, validPlayers: ['Jason Arnott', 'Bill Guerin', 'Petr Sykora', 'Dwayne Roloson', 'Curtis Joseph', 'Ales Hemsky'] },
      // Devils x Norris Trophy
      { rowIndex: 1, colIndex: 1, validPlayers: ['Scott Stevens', 'Scott Niedermayer', 'Rob Blake', 'Larry Robinson', 'Brian Rafalski'] },
      // Devils x Stanley Cup
      { rowIndex: 1, colIndex: 2, validPlayers: ['Martin Brodeur', 'Scott Stevens', 'Scott Niedermayer', 'Patrik Elias', 'Claude Lemieux', 'Jason Arnott', 'Neal Broten'] },
      // 80+ Points x Oilers
      { rowIndex: 2, colIndex: 0, validPlayers: ['Wayne Gretzky', 'Mark Messier', 'Jari Kurri', 'Paul Coffey', 'Connor McDavid', 'Leon Draisaitl', 'Glenn Anderson'] },
      // 80+ Points x Norris Trophy
      { rowIndex: 2, colIndex: 1, validPlayers: ['Bobby Orr', 'Paul Coffey', 'Brian Leetch', 'Al MacInnis', 'Denis Potvin', 'Nicklas Lidstrom', 'Cale Makar'] },
      // 80+ Points x Stanley Cup
      { rowIndex: 2, colIndex: 2, validPlayers: ['Wayne Gretzky', 'Mario Lemieux', 'Sidney Crosby', 'Mark Messier', 'Bryan Trottier', 'Steve Yzerman', 'Bobby Orr', 'Patrick Kane'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 28: Blackhawks / Penguins / Canadiens  x  Avalanche / 100+ Points / Conn Smythe
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Chicago Blackhawks', value: 'blackhawks' },
      { type: 'team', label: 'Pittsburgh Penguins', value: 'penguins' },
      { type: 'team', label: 'Montreal Canadiens', value: 'canadiens' },
    ],
    cols: [
      { type: 'team', label: 'Colorado Avalanche', value: 'avalanche' },
      { type: 'stat', label: '100+ Points Season', value: '100points' },
      { type: 'award', label: 'Conn Smythe Trophy', value: 'conn-smythe' },
    ],
    cells: [
      // Blackhawks x Avalanche
      { rowIndex: 0, colIndex: 0, validPlayers: ['Michel Goulet', 'Dale Hunter', 'Chris Chelios', 'Marian Hossa', 'Phil Esposito', 'Peter Forsberg'] },
      // Blackhawks x 100+ Points
      { rowIndex: 0, colIndex: 1, validPlayers: ['Bobby Hull', 'Stan Mikita', 'Denis Savard', 'Jeremy Roenick', 'Patrick Kane', 'Steve Larmer'] },
      // Blackhawks x Conn Smythe
      { rowIndex: 0, colIndex: 2, validPlayers: ['Jonathan Toews', 'Patrick Kane', 'Duncan Keith', 'Bobby Hull', 'Stan Mikita'] },
      // Penguins x Avalanche
      { rowIndex: 1, colIndex: 0, validPlayers: ['Joe Sakic', 'Peter Forsberg', 'Rick Kehoe', 'Michel Goulet', 'Luc Robitaille', 'Ville Nieminen'] },
      // Penguins x 100+ Points
      { rowIndex: 1, colIndex: 1, validPlayers: ['Mario Lemieux', 'Jaromir Jagr', 'Sidney Crosby', 'Evgeni Malkin', 'Kevin Stevens', 'Ron Francis', 'Mark Recchi'] },
      // Penguins x Conn Smythe
      { rowIndex: 1, colIndex: 2, validPlayers: ['Mario Lemieux', 'Sidney Crosby', 'Evgeni Malkin', 'Matt Murray', 'Ron Francis'] },
      // Canadiens x Avalanche
      { rowIndex: 2, colIndex: 0, validPlayers: ['Patrick Roy', 'Guy Lafleur', 'John LeClair', 'Eric Desjardins', 'Mike Keane', 'Andrei Kovalenko'] },
      // Canadiens x 100+ Points
      { rowIndex: 2, colIndex: 1, validPlayers: ['Guy Lafleur', 'Pete Mahovlich', 'Steve Shutt', 'Pierre Larouche', 'Mats Naslund'] },
      // Canadiens x Conn Smythe
      { rowIndex: 2, colIndex: 2, validPlayers: ['Patrick Roy', 'Jean Beliveau', 'Serge Savard', 'Larry Robinson', 'Bob Gainey', 'Ken Dryden', 'Yvan Cournoyer'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 29: Rangers / Blues / 20+ Goals  x  Blackhawks / Hart Trophy / Stanley Cup
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'New York Rangers', value: 'rangers' },
      { type: 'team', label: 'St. Louis Blues', value: 'blues' },
      { type: 'stat', label: '20+ Goals Season', value: '20goals' },
    ],
    cols: [
      { type: 'team', label: 'Chicago Blackhawks', value: 'blackhawks' },
      { type: 'award', label: 'Hart Trophy', value: 'hart' },
      { type: 'award', label: 'Stanley Cup Champion', value: 'stanley-cup' },
    ],
    cells: [
      // Rangers x Blackhawks
      { rowIndex: 0, colIndex: 0, validPlayers: ['Phil Esposito', 'Marcel Dionne', 'Pat Verbeek', 'Tony Amonte', 'Theoren Fleury', 'Brian Noonan'] },
      // Rangers x Hart Trophy
      { rowIndex: 0, colIndex: 1, validPlayers: ['Mark Messier', 'Wayne Gretzky', 'Andy Bathgate', 'Buddy OConnor', 'Chuck Rayner'] },
      // Rangers x Stanley Cup
      { rowIndex: 0, colIndex: 2, validPlayers: ['Mark Messier', 'Brian Leetch', 'Mike Richter', 'Adam Graves', 'Esa Tikkanen', 'Jeff Beukeboom', 'Kevin Lowe'] },
      // Blues x Blackhawks
      { rowIndex: 1, colIndex: 0, validPlayers: ['Brett Hull', 'Phil Esposito', 'Denis Savard', 'Doug Gilmour', 'Glenn Hall', 'Tyler Johnson'] },
      // Blues x Hart Trophy
      { rowIndex: 1, colIndex: 1, validPlayers: ['Wayne Gretzky', 'Brett Hull', 'Chris Pronger', 'Phil Esposito', 'Al MacInnis'] },
      // Blues x Stanley Cup
      { rowIndex: 1, colIndex: 2, validPlayers: ['Brett Hull', 'Grant Fuhr', 'Wayne Gretzky', 'Glenn Hall', 'Al MacInnis', 'Doug Harvey', 'Dickie Moore'] },
      // 20+ Goals x Blackhawks
      { rowIndex: 2, colIndex: 0, validPlayers: ['Bobby Hull', 'Stan Mikita', 'Patrick Kane', 'Jonathan Toews', 'Jeremy Roenick', 'Denis Savard', 'Steve Larmer', 'Tony Amonte'] },
      // 20+ Goals x Hart Trophy
      { rowIndex: 2, colIndex: 1, validPlayers: ['Wayne Gretzky', 'Mario Lemieux', 'Sidney Crosby', 'Connor McDavid', 'Alexander Ovechkin', 'Gordie Howe', 'Bobby Hull', 'Nathan MacKinnon'] },
      // 20+ Goals x Stanley Cup
      { rowIndex: 2, colIndex: 2, validPlayers: ['Wayne Gretzky', 'Mark Messier', 'Mario Lemieux', 'Sidney Crosby', 'Bobby Hull', 'Gordie Howe', 'Brett Hull', 'Patrick Kane', 'Steven Stamkos'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID 30: Lightning / Ducks / Maple Leafs  x  Devils / 30+ Wins / Ted Lindsay Award
  // ═══════════════════════════════════════════════════════════════════════════
  {
    league: 'NHL',
    rows: [
      { type: 'team', label: 'Tampa Bay Lightning', value: 'lightning' },
      { type: 'team', label: 'Anaheim Ducks', value: 'ducks' },
      { type: 'team', label: 'Toronto Maple Leafs', value: 'maple-leafs' },
    ],
    cols: [
      { type: 'team', label: 'New Jersey Devils', value: 'devils' },
      { type: 'stat', label: '30+ Wins Season', value: '30wins' },
      { type: 'award', label: 'Ted Lindsay Award', value: 'ted-lindsay' },
    ],
    cells: [
      // Lightning x Devils
      { rowIndex: 0, colIndex: 0, validPlayers: ['Martin St. Louis', 'Brad Richards', 'Ben Bishop', 'Brian Rolston', 'Ondrej Palat', 'Bryce Salvador'] },
      // Lightning x 30+ Wins (goalies)
      { rowIndex: 0, colIndex: 1, validPlayers: ['Andrei Vasilevskiy', 'Ben Bishop', 'Nikolai Khabibulin', 'Mike Smith', 'Curtis Joseph'] },
      // Lightning x Ted Lindsay Award
      { rowIndex: 0, colIndex: 2, validPlayers: ['Martin St. Louis', 'Nikita Kucherov', 'Steven Stamkos', 'Vincent Lecavalier', 'Brad Richards'] },
      // Ducks x Devils
      { rowIndex: 1, colIndex: 0, validPlayers: ['Petr Sykora', 'Scott Niedermayer', 'Ilya Bryzgalov', 'Bobby Ryan', 'Adam Henrique', 'Jason Arnott'] },
      // Ducks x 30+ Wins (goalies)
      { rowIndex: 1, colIndex: 1, validPlayers: ['Jean-Sebastien Giguere', 'Jonas Hiller', 'John Gibson', 'Ilya Bryzgalov', 'Guy Hebert'] },
      // Ducks x Ted Lindsay Award
      { rowIndex: 1, colIndex: 2, validPlayers: ['Teemu Selanne', 'Paul Kariya', 'Corey Perry', 'Ryan Getzlaf', 'Scott Niedermayer'] },
      // Maple Leafs x Devils
      { rowIndex: 2, colIndex: 0, validPlayers: ['Alexander Mogilny', 'Brian Rolston', 'Dave Andreychuk', 'Ed Belfour', 'Wendel Clark', 'Jason Arnott'] },
      // Maple Leafs x 30+ Wins (goalies)
      { rowIndex: 2, colIndex: 1, validPlayers: ['Ed Belfour', 'Curtis Joseph', 'Felix Potvin', 'Turk Broda', 'Terry Sawchuk', 'Johnny Bower'] },
      // Maple Leafs x Ted Lindsay Award
      { rowIndex: 2, colIndex: 2, validPlayers: ['Auston Matthews', 'Mats Sundin', 'Ted Kennedy', 'Darryl Sittler', 'Lanny McDonald'] },
    ],
  },
];

export default NHL_GRIDS;
