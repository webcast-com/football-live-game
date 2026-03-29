import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  fetchAllGames,
  fetchLiveGames,
  fetchGamesByLeague,
  fetchGamesByDate,
  fetchAllLeagues,
  type Game,
} from '@/services/widgetsApi';

/**
 * Hook to fetch all games
 */
export function useAllGames(): UseQueryResult<Game[], Error> {
  return useQuery({
    queryKey: ['widgets', 'all-games'],
    queryFn: fetchAllGames,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

/**
 * Hook to fetch live games
 */
export function useLiveGames(): UseQueryResult<Game[], Error> {
  return useQuery({
    queryKey: ['widgets', 'live-games'],
    queryFn: fetchLiveGames,
    staleTime: 1 * 60 * 1000, // 1 minute (live games update frequently)
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch games by league
 */
export function useGamesByLeague(league: string): UseQueryResult<Game[], Error> {
  return useQuery({
    queryKey: ['widgets', 'games-by-league', league],
    queryFn: () => fetchGamesByLeague(league),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!league, // Only run if league is provided
  });
}

/**
 * Hook to fetch games by date
 */
export function useGamesByDate(date: string): UseQueryResult<Game[], Error> {
  return useQuery({
    queryKey: ['widgets', 'games-by-date', date],
    queryFn: () => fetchGamesByDate(date),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!date, // Only run if date is provided
  });
}

/**
 * Hook to fetch all leagues
 */
export function useAllLeagues(): UseQueryResult<string[], Error> {
  return useQuery({
    queryKey: ['widgets', 'all-leagues'],
    queryFn: fetchAllLeagues,
    staleTime: 30 * 60 * 1000, // 30 minutes (leagues don't change often)
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}
