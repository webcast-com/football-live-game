import { useQuery, UseQueryResult } from '@tanstack/react-query';
import apiFootball, { POPULAR_LEAGUES } from '@/services/apiFootball';
import { TransformedFixture, TransformedStanding, TransformedPlayer } from '@/types/apiFootball';

// Query keys for React Query
export const footballQueryKeys = {
  all: ['football'] as const,
  live: () => [...footballQueryKeys.all, 'live'] as const,
  liveByLeague: (leagueId: number) => [...footballQueryKeys.live(), leagueId] as const,
  upcoming: () => [...footballQueryKeys.all, 'upcoming'] as const,
  upcomingByLeague: (leagueId: number, days: number) => [...footballQueryKeys.upcoming(), leagueId, days] as const,
  standings: () => [...footballQueryKeys.all, 'standings'] as const,
  standingsByLeague: (leagueId: number, season?: number) => [...footballQueryKeys.standings(), leagueId, season] as const,
  topScorers: () => [...footballQueryKeys.all, 'topScorers'] as const,
  topScorersByLeague: (leagueId: number, season?: number, limit?: number) => 
    [...footballQueryKeys.topScorers(), leagueId, season, limit] as const,
  topAssists: () => [...footballQueryKeys.all, 'topAssists'] as const,
  topAssistsByLeague: (leagueId: number, season?: number, limit?: number) => 
    [...footballQueryKeys.topAssists(), leagueId, season, limit] as const,
};

// Hook for live matches
export const useLiveFixtures = (leagueId?: number, enabled: boolean = true): UseQueryResult<TransformedFixture[], Error> => {
  return useQuery({
    queryKey: leagueId ? footballQueryKeys.liveByLeague(leagueId) : footballQueryKeys.live(),
    queryFn: () => apiFootball.getLiveFixtures(leagueId),
    refetchInterval: 30000, // Refetch every 30 seconds for live data
    refetchIntervalInBackground: true,
    staleTime: 10000, // Data is fresh for 10 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    enabled,
  });
};

// Hook for upcoming matches
export const useUpcomingFixtures = (
  leagueId?: number,
  days: number = 7,
  enabled: boolean = true
): UseQueryResult<TransformedFixture[], Error> => {
  return useQuery({
    queryKey: leagueId ? footballQueryKeys.upcomingByLeague(leagueId, days) : footballQueryKeys.upcoming(),
    queryFn: () => apiFootball.getUpcomingFixtures(leagueId, days),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    refetchIntervalInBackground: true,
    staleTime: 2 * 60 * 1000, // Data is fresh for 2 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    enabled,
  });
};

// Hook for league standings
export const useStandings = (
  leagueId: number,
  season?: number,
  enabled: boolean = true
): UseQueryResult<TransformedStanding[], Error> => {
  return useQuery({
    queryKey: footballQueryKeys.standingsByLeague(leagueId, season),
    queryFn: () => apiFootball.getStandings(leagueId, season),
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    refetchIntervalInBackground: true,
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    enabled,
  });
};

// Hook for top scorers
export const useTopScorers = (
  leagueId: number,
  season?: number,
  limit: number = 10,
  enabled: boolean = true
): UseQueryResult<TransformedPlayer[], Error> => {
  return useQuery({
    queryKey: footballQueryKeys.topScorersByLeague(leagueId, season, limit),
    queryFn: () => apiFootball.getTopScorers(leagueId, season, limit),
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
    refetchIntervalInBackground: true,
    staleTime: 10 * 60 * 1000, // Data is fresh for 10 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    enabled,
  });
};

// Hook for top assists
export const useTopAssists = (
  leagueId: number,
  season?: number,
  limit: number = 10,
  enabled: boolean = true
): UseQueryResult<TransformedPlayer[], Error> => {
  return useQuery({
    queryKey: footballQueryKeys.topAssistsByLeague(leagueId, season, limit),
    queryFn: () => apiFootball.getTopAssists(leagueId, season, limit),
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
    refetchIntervalInBackground: true,
    staleTime: 10 * 60 * 1000, // Data is fresh for 10 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    enabled,
  });
};

// Convenience hook for multiple API calls
export const useFootballLeagueData = (
  leagueId: number,
  season?: number,
  enabled: boolean = true
) => {
  const standings = useStandings(leagueId, season, enabled);
  const topScorers = useTopScorers(leagueId, season, 10, enabled);
  const topAssists = useTopAssists(leagueId, season, 10, enabled);
  const liveMatches = useLiveFixtures(leagueId, enabled);
  const upcomingMatches = useUpcomingFixtures(leagueId, 7, enabled);

  return {
    standings,
    topScorers,
    topAssists,
    liveMatches,
    upcomingMatches,
    isLoading: standings.isLoading || topScorers.isLoading || topAssists.isLoading,
    isError: standings.isError || topScorers.isError || topAssists.isError,
  };
};

// Export popular league IDs for easy access
export { POPULAR_LEAGUES };
