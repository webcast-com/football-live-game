// API-Football (RapidAPI) Response Types

export interface APIFootballFixture {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
      first: number | null;
      second: number | null;
    };
    venue: {
      id: number | null;
      name: string | null;
      city: string | null;
    };
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
}

export interface APIFootballStanding {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    standings: Array<{
      rank: number;
      team: {
        id: number;
        name: string;
        logo: string;
      };
      points: number;
      goalsDiff: number;
      group: string | null;
      form: string | null;
      status: string | null;
      description: string | null;
      all: {
        played: number;
        win: number;
        draw: number;
        lose: number;
        goals: {
          for: number;
          against: number;
        };
      };
      home: {
        played: number;
        win: number;
        draw: number;
        lose: number;
        goals: {
          for: number;
          against: number;
        };
      };
      away: {
        played: number;
        win: number;
        draw: number;
        lose: number;
        goals: {
          for: number;
          against: number;
        };
      };
      update: string;
    }>;
  };
}

export interface APIFootballPlayer {
  player: {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    age: number | null;
    birth: {
      date: string | null;
      place: string | null;
      country: string | null;
    };
    nationality: string | null;
    height: string | null;
    weight: string | null;
    injured: boolean;
    photo: string | null;
  };
  statistics: Array<{
    team: {
      id: number;
      name: string;
      logo: string;
    };
    league: {
      id: number;
      name: string;
      country: string;
      logo: string;
      flag: string | null;
      season: number;
    };
    games: {
      appearences: number | null;
      lineups: number | null;
      minutes: number | null;
      number: number | null;
      position: string | null;
      rating: string | null;
      captain: boolean;
    };
    substitutes: {
      in: number | null;
      out: number | null;
      bench: number | null;
    };
    shots: {
      total: number | null;
      on: number | null;
    };
    goals: {
      total: number | null;
      conceded: number | null;
      assists: number | null;
      saves: number | null;
    };
    passes: {
      total: number | null;
      key: number | null;
      accuracy: string | null;
    };
    tackles: {
      total: number | null;
      blocks: number | null;
      interceptions: number | null;
    };
    duels: {
      total: number | null;
      won: number | null;
    };
    dribbles: {
      attempts: number | null;
      success: number | null;
      past: number | null;
    };
    fouls: {
      drawn: number | null;
      committed: number | null;
    };
    cards: {
      yellow: number | null;
      yellowred: number | null;
      red: number | null;
    };
    penalty: {
      won: number | null;
      commited: number | null;
      scored: number | null;
      missed: number | null;
    };
  }>;
}

export interface APIFootballTeam {
  team: {
    id: number;
    name: string;
    code: string;
    country: string;
    founded: number | null;
    national: boolean;
    logo: string;
  };
  venue: {
    id: number | null;
    name: string | null;
    address: string | null;
    city: string | null;
    capacity: number | null;
    surface: string | null;
    image: string | null;
  };
}

export interface APIFootballResponse<T> {
  get: string;
  parameters: Record<string, string | number>;
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: T[];
}

// Transformed types for app use
export interface TransformedFixture {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  time: string;
  date: string;
  leagueName: string;
  leagueId: number;
  homeTeamId: number;
  awayTeamId: number;
  homeTeamLogo: string;
  awayTeamLogo: string;
  venue: string | null;
  round: string;
}

export interface TransformedStanding {
  rank: number;
  team: string;
  teamId: number;
  teamLogo: string;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  played: number;
  form: string | null;
}

export interface TransformedPlayer {
  id: number;
  name: string;
  team: string;
  teamLogo: string;
  league: string;
  position: string | null;
  goals: number;
  assists: number;
  appearances: number;
  rating: string | null;
  photo: string | null;
}

export interface APIError {
  message: string;
  code: string;
}

export interface FetchOptions {
  forceRefresh?: boolean;
  cacheTime?: number;
}
