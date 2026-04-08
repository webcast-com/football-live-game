/**
 * Widgets API Service
 * Fetches all games data from https://widgets.api-sports.io/3.1.0/config
 * This is a free alternative endpoint that provides comprehensive game data
 */

export interface Game {
  id: number;
  league: string;
  leagueId: number;
  season: number;
  date: string;
  timestamp: number;
  timezone: string;
  home: {
    id: number;
    name: string;
    logo: string;
  };
  away: {
    id: number;
    name: string;
    logo: string;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  status: string;
  statusShort: string;
  elapsed: number | null;
  venue: string;
  referee: string | null;
  coverage: string[];
}

export interface WidgetsApiResponse {
  success: boolean;
  result: {
    leagues: Record<string, any>;
    games: Game[];
  };
}

const WIDGETS_API_BASE = 'https://widgets.api-sports.io/3.1.0/widgets.j';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache: Map<string, CacheEntry<any>> = new Map();

function getCachedData<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * Fetch all games data from the widgets API
 * This endpoint requires no API key and provides comprehensive game information
 */
export async function fetchAllGames(): Promise<Game[]> {
  try {
    const cacheKey = 'widgets:all-games';
    const cached = getCachedData<Game[]>(cacheKey);
    if (cached) {
      console.log('[Widgets API] Returning cached games data');
      return cached;
    }

    console.log('[Widgets API] Fetching all games from', `${WIDGETS_API_BASE}/config`);
    
    const response = await fetch(`${WIDGETS_API_BASE}/config`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data: WidgetsApiResponse = await response.json();

    if (!data.success || !data.result || !data.result.games) {
      throw new Error('Invalid response format from widgets API');
    }

    const games = data.result.games;
    setCachedData(cacheKey, games);

    console.log('[Widgets API] Successfully fetched', games.length, 'games');
    return games;
  } catch (error) {
    console.error('[Widgets API] Error fetching games:', error);
    throw error;
  }
}

/**
 * Fetch live games (games currently in progress)
 */
export async function fetchLiveGames(): Promise<Game[]> {
  try {
    const allGames = await fetchAllGames();
    const liveGames = allGames.filter(
      (game) => game.statusShort === 'LIVE' || game.statusShort === '1H' || game.statusShort === '2H' || game.statusShort === 'HT'
    );
    return liveGames;
  } catch (error) {
    console.error('[Widgets API] Error fetching live games:', error);
    throw error;
  }
}

/**
 * Fetch games by league
 */
export async function fetchGamesByLeague(leagueName: string): Promise<Game[]> {
  try {
    const allGames = await fetchAllGames();
    return allGames.filter(
      (game) => game.league.toLowerCase().includes(leagueName.toLowerCase())
    );
  } catch (error) {
    console.error('[Widgets API] Error fetching games by league:', error);
    throw error;
  }
}

/**
 * Fetch games by date
 */
export async function fetchGamesByDate(date: string): Promise<Game[]> {
  try {
    const allGames = await fetchAllGames();
    return allGames.filter((game) => game.date.startsWith(date));
  } catch (error) {
    console.error('[Widgets API] Error fetching games by date:', error);
    throw error;
  }
}

/**
 * Get game details
 */
export async function fetchGameById(gameId: number): Promise<Game | null> {
  try {
    const allGames = await fetchAllGames();
    return allGames.find((game) => game.id === gameId) || null;
  } catch (error) {
    console.error('[Widgets API] Error fetching game by id:', error);
    throw error;
  }
}

/**
 * Get all unique leagues from games data
 */
export async function fetchAllLeagues(): Promise<string[]> {
  try {
    const allGames = await fetchAllGames();
    const leagues = Array.from(new Set(allGames.map((game) => game.league)));
    return leagues.sort();
  } catch (error) {
    console.error('[Widgets API] Error fetching leagues:', error);
    throw error;
  }
}

/**
 * Clear the cache (useful for debugging or manual refresh)
 */
export function clearCache(): void {
  cache.clear();
  console.log('[Widgets API] Cache cleared');
}
