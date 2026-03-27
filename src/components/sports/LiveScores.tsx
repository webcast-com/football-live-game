import React, { useState, useMemo } from 'react';
import { Filter, ArrowUpDown, Loader2, AlertCircle } from 'lucide-react';
import { useLiveFixtures, POPULAR_LEAGUES } from '@/hooks/useFootballAPI';
import { TransformedFixture } from '@/types/apiFootball';
import LiveScoreCard from './LiveScoreCard';

interface LiveScoresProps {
  matches?: TransformedFixture[];
  leagueId?: number;
  searchQuery: string;
}

type SortOption = 'default' | 'league' | 'time';
type StatusFilter = 'all' | 'LIVE' | 'HT' | 'FT';

const LiveScores: React.FC<LiveScoresProps> = ({ matches: mockMatches, leagueId, searchQuery }) => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Fetch live matches from API
  const { data: apiMatches, isLoading, isError, error } = useLiveFixtures(leagueId);
  const matches = apiMatches || mockMatches || [];

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredMatches = useMemo(() => {
    let result = [...matches];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.homeTeam.toLowerCase().includes(q) ||
          m.awayTeam.toLowerCase().includes(q) ||
          m.leagueName.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((m) => m.status === statusFilter);
    }

    // Favorites filter
    if (showFavoritesOnly) {
      result = result.filter((m) => favorites.has(m.id));
    }

    // Sort
    if (sortBy === 'league') {
      result.sort((a, b) => a.leagueName.localeCompare(b.leagueName));
    } else if (sortBy === 'time') {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return result;
  }, [matches, searchQuery, statusFilter, showFavoritesOnly, sortBy, favorites]);

  return (
    <section id="live-scores" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-8 bg-gradient-to-b from-[#00d4ff] to-[#0066ff] rounded-full" />
              Live Scores
            </h2>
            <p className="text-gray-500 text-sm mt-1">{isLoading ? 'Loading...' : `${filteredMatches.length} matches found`}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status filters */}
            {(['all', 'LIVE', 'HT', 'FT'] as StatusFilter[]).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize ${
                  statusFilter === status
                    ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30'
                    : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
                }`}
              >
                {status === 'all' ? 'All' : status === 'HT' ? 'HT' : status}
              </button>
            ))}

            <div className="w-px h-6 bg-white/10 mx-1" />

            {/* Favorites toggle */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                showFavoritesOnly
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
              }`}
            >
              <Filter className="w-3 h-3" />
              Favorites
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#161b22] text-gray-400 border border-white/10 focus:outline-none focus:border-[#00d4ff]/30 cursor-pointer"
              style={{ colorScheme: 'dark' }}
            >
              <option value="default">Default</option>
              <option value="league">By League</option>
              <option value="time">By Time</option>
            </select>

          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-[#00d4ff] animate-spin" />
            <span className="ml-2 text-gray-400">Loading live matches...</span>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-red-400 font-medium">Failed to load live matches</p>
              <p className="text-red-400/70 text-sm">{error?.message || 'Please check your API key configuration'}</p>
            </div>
          </div>
        )}

        {/* Grid */}
        {!isLoading && !isError && filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMatches.map((match) => (
              <div key={match.id} className="bg-[#161b22] border border-white/5 rounded-2xl p-5 hover:border-[#00d4ff]/20 hover:bg-[#1c2333] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase">{match.leagueName}</span>
                  <button
                    onClick={() => toggleFavorite(match.id)}
                    className={`transition-all ${favorites.has(match.id) ? 'text-yellow-400' : 'text-gray-500 hover:text-white'}`}
                  >
                    ★
                  </button>
                </div>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex-1 text-center">
                    <p className="text-white font-semibold text-sm">{match.homeTeam}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#00d4ff]">{match.homeScore ?? '-'}</p>
                    <p className="text-xs text-gray-500">{match.time}</p>
                    <p className="text-2xl font-bold text-[#00d4ff]">{match.awayScore ?? '-'}</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-white font-semibold text-sm">{match.awayTeam}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center border-t border-white/5 pt-2">
                  {match.venue || 'TBA'}
                </div>
              </div>
            ))}
          </div>
        ) : !isLoading && !isError && filteredMatches.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <ArrowUpDown className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium">No matches found</p>
            <p className="text-gray-600 text-sm mt-1">Try adjusting your filters or search query</p>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default LiveScores;
