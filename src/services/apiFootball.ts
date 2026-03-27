import {
  APIFootballFixture,
  APIFootballResponse,
  APIFootballStanding,
  APIFootballPlayer,
  TransformedFixture,
  TransformedStanding,
  TransformedPlayer,
  APIError,
} from '@/types/apiFootball';

// API Configuration
const API_BASE_URL = 'https://api-football-v1.p.rapidapi.com';
const API_KEY = import.meta.env.68df00745cmshda30132b2d1198fp112b29jsn8272b3d2309e;

const API_HEADERS = {
  'x-rapidapi-key': API_KEY,
  'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
};

// Cache management
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache: Map<string, CacheEntry<any>> = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes default cache

// Helper to get cached data
function getCachedData<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

// Helper to set cached data
function setCachedData<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

// Generic fetch function
async function fetchFromAPI<T>(
  endpoint: string,
  params: Record<string, string | number> = {},
  cacheDuration = CACHE_DURATION
): Promise<T> {
  if (!API_KEY) {
    throw new Error('API_FOOTBALL_KEY environment variable is not set. Please configure your Rapid API key in .env.local');
  }

  const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
  const cached = getCachedData<T>(cacheKey);
  if (cached) {
    return cached;
  }

  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, String(value));
  });

  const url = `${API_BASE_URL}${endpoint}?${queryParams}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: API_HEADERS,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors && data.errors.length > 0) {
      throw new Error(`API Error: ${data.errors.join(', ')}`);
    }

    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`[API Football] Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// Transform functions
function transformFixture(fixture: APIFootballFixture): TransformedFixture {
  const status = fixture.fixture.status.short;
  const elapsed = fixture.fixture.status.elapsed || 0;
  
  let displayTime = '';
  if (status === 'NS') {
    displayTime = 'Not Started';
  } else if (status === 'FT') {
    displayTime = 'Final';
  } else if (status === 'HT') {
    displayTime = 'Half Time';
  } else if (status === 'ET') {
    displayTime = 'Extra Time';
  } else if (status === 'P') {
    displayTime = 'Penalty';
  } else if (status === 'LIVE' || status === '1H' || status === '2H') {
    displayTime = `${elapsed}'`;
  } else {
    displayTime = fixture.fixture.status.long;
  }

  return {
    id: fixture.fixture.id,
    homeTeam: fixture.teams.home.name,
    awayTeam: fixture.teams.away.name,
    homeScore: fixture.goals.home,
    awayScore: fixture.goals.away,
    status: status,
    time: displayTime,
    date: fixture.fixture.date,
    leagueName: fixture.league.name,
    leagueId: fixture.league.id,
    homeTeamId: fixture.teams.home.id,
    awayTeamId: fixture.teams.away.id,
    homeTeamLogo: fixture.teams.home.logo,
    awayTeamLogo: fixture.teams.away.logo,
    venue: fixture.fixture.venue.name,
    round: fixture.league.round,
  };
}

function transformStanding(standing: any): TransformedStanding {
  return {
    rank: standing.rank,
    team: standing.team.name,
    teamId: standing.team.id,
    teamLogo: standing.team.logo,
    wins: standing.all.win,
    draws: standing.all.draw,
    losses: standing.all.lose,
    points: standing.points,
    goalsFor: standing.all.goals.for,
    goalsAgainst: standing.all.goals.against,
    goalDiff: standing.goalsDiff,
    played: standing.all.played,
    form: standing.form,
  };
}

function transformPlayer(player: any, stats: any): TransformedPlayer {
  const league = stats.league || {};
  const goals = stats.goals || {};
  const games = stats.games || {};

  return {
    id: player.id,
    name: player.name,
    team: (stats.team || {}).name || '',
    teamLogo: (stats.team || {}).logo || '',
    league: league.name || '',
    position: games.position || null,
    goals: goals.total || 0,
    assists: goals.assists || 0,
    appearances: games.appearences || 0,
    rating: games.rating || null,
    photo: player.photo || null,
  };
}

// API Methods
export const apiFootball = {
  // Get live fixtures
  async getLiveFixtures(leagueId?: number): Promise<TransformedFixture[]> {
    try {
      const params: Record<string, any> = {
        status: 'LIVE',
        season: new Date().getFullYear(),
      };

      if (leagueId) {
        params.league = leagueId;
      }

      const response = await fetchFromAPI<APIFootballResponse<APIFootballFixture>>(
        '/fixtures',
        params,
        1 * 60 * 1000 // 1 minute cache for live data
      );

      return response.response.map(transformFixture);
    } catch (error) {
      console.error('[API Football] Error fetching live fixtures:', error);
      return [];
    }
  },

  // Get upcoming fixtures
  async getUpcomingFixtures(leagueId?: number, days: number = 7): Promise<TransformedFixture[]> {
    try {
      const now = new Date();
      const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      const params: Record<string, any> = {
        from: now.toISOString().split('T')[0],
        to: futureDate.toISOString().split('T')[0],
        status: 'NS', // Not started
        season: now.getFullYear(),
      };

      if (leagueId) {
        params.league = leagueId;
      }

      const response = await fetchFromAPI<APIFootballResponse<APIFootballFixture>>(
        '/fixtures',
        params,
        5 * 60 * 1000 // 5 minute cache for upcoming
      );

      return response.response.map(transformFixture);
    } catch (error) {
      console.error('[API Football] Error fetching upcoming fixtures:', error);
      return [];
    }
  },

  // Get league standings
  async getStandings(leagueId: number, season?: number): Promise<TransformedStanding[]> {
    try {
      const params: Record<string, any> = {
        league: leagueId,
        season: season || new Date().getFullYear(),
      };

      const response = await fetchFromAPI<APIFootballResponse<APIFootballStanding>>(
        '/standings',
        params,
        10 * 60 * 1000 // 10 minute cache for standings
      );

      if (response.response.length === 0) {
        return [];
      }

      // standings is nested within league object
      return response.response[0].league.standings[0].map(transformStanding);
    } catch (error) {
      console.error('[API Football] Error fetching standings:', error);
      return [];
    }
  },

  // Get top scorers for a league
  async getTopScorers(leagueId: number, season?: number, limit: number = 10): Promise<TransformedPlayer[]> {
    try {
      const params: Record<string, any> = {
        league: leagueId,
        season: season || new Date().getFullYear(),
      };

      const response = await fetchFromAPI<APIFootballResponse<APIFootballPlayer>>(
        '/players/topscorers',
        params,
        15 * 60 * 1000 // 15 minute cache for player stats
      );

      return response.response
        .slice(0, limit)
        .map(player => transformPlayer(player.player, player.statistics[0]));
    } catch (error) {
      console.error('[API Football] Error fetching top scorers:', error);
      return [];
    }
  },

  // Get top assists for a league
  async getTopAssists(leagueId: number, season?: number, limit: number = 10): Promise<TransformedPlayer[]> {
    try {
      const params: Record<string, any> = {
        league: leagueId,
        season: season || new Date().getFullYear(),
      };

      const response = await fetchFromAPI<APIFootballResponse<APIFootballPlayer>>(
        '/players/topassists',
        params,
        15 * 60 * 1000 // 15 minute cache
      );

      return response.response
        .slice(0, limit)
        .map(player => transformPlayer(player.player, player.statistics[0]));
    } catch (error) {
      console.error('[API Football] Error fetching top assists:', error);
      return [];
    }
  },

  // Clear cache
  clearCache(): void {
    cache.clear();
  },

  // Get cache size for debugging
  getCacheSize(): number {
    return cache.size;
  },
};

// Predefined leagues
export const POPULAR_LEAGUES = {
  PREMIER_LEAGUE: 39,
  LA_LIGA: 140,
  SERIE_A: 135,
  BUNDESLIGA: 78,
  LIGUE_1: 61,
  CHAMPIONS_LEAGUE: 2,
  EUROPA_LEAGUE: 3,
};

export default apiFootball;
