import React, { useState } from 'react';
import { Award, Loader2, AlertCircle, Minus } from 'lucide-react';
import { useTopScorers, useTopAssists, POPULAR_LEAGUES } from '@/hooks/useFootballAPI';

const TopScorers: React.FC = () => {
  const [selectedLeague, setSelectedLeague] = useState(POPULAR_LEAGUES.PREMIER_LEAGUE);
  const [statType, setStatType] = useState<'goals' | 'assists'>('goals');

  const scorersQuery = useTopScorers(selectedLeague, undefined, 10);
  const assistsQuery = useTopAssists(selectedLeague, undefined, 10);

  const isLoading = statType === 'goals' ? scorersQuery.isLoading : assistsQuery.isLoading;
  const isError = statType === 'goals' ? scorersQuery.isError : assistsQuery.isError;
  const error = statType === 'goals' ? scorersQuery.error : assistsQuery.error;
  const players = statType === 'goals' ? scorersQuery.data : assistsQuery.data;

  const leagueNames: Record<number, string> = {
    [POPULAR_LEAGUES.PREMIER_LEAGUE]: 'Premier League',
    [POPULAR_LEAGUES.LA_LIGA]: 'La Liga',
    [POPULAR_LEAGUES.SERIE_A]: 'Serie A',
    [POPULAR_LEAGUES.BUNDESLIGA]: 'Bundesliga',
    [POPULAR_LEAGUES.LIGUE_1]: 'Ligue 1',
    [POPULAR_LEAGUES.CHAMPIONS_LEAGUE]: 'Champions League',
  };

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-8 bg-gradient-to-b from-red-400 to-rose-600 rounded-full" />
              Top Performers
            </h2>
            <p className="text-gray-500 text-sm mt-1">{statType === 'goals' ? 'Leading scorers' : 'Assist leaders'} in {leagueNames[selectedLeague]}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="flex gap-2">
              {Object.entries(leagueNames).map(([id, name]) => (
                <button
                  key={id}
                  onClick={() => setSelectedLeague(Number(id))}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    selectedLeague === Number(id)
                      ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30'
                      : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStatType('goals')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  statType === 'goals'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
                }`}
              >
                Goals
              </button>
              <button
                onClick={() => setStatType('assists')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  statType === 'assists'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
                }`}
              >
                Assists
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-white/5 rounded-2xl overflow-hidden">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-red-400 animate-spin" />
              <span className="ml-2 text-gray-400">Loading players...</span>
            </div>
          )}

          {isError && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg m-4">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-red-400 font-medium">Failed to load player stats</p>
                <p className="text-red-400/70 text-sm">{error?.message || 'Please check your API key configuration'}</p>
              </div>
            </div>
          )}

          {!isLoading && players && players.length > 0 && (
            <>
              {players.map((player, i) => (
                <div
                  key={`${player.id}-${i}`}
                  className={`flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors ${
                    i < players.length - 1 ? 'border-b border-white/5' : ''
                  }`}
                >
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${
                    i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    i === 1 ? 'bg-gray-400/20 text-gray-300' :
                    i === 2 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-white/5 text-gray-500'
                  }`}>
                    {i + 1}
                  </div>

                  {/* Player info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{player.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <img
                        src={player.teamLogo}
                        alt={player.team}
                        className="w-4 h-4 rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <span className="text-gray-500 text-xs">{player.team}</span>
                    </div>
                  </div>

                  {/* Games */}
                  <div className="hidden sm:block text-center">
                    <p className="text-gray-400 text-sm tabular-nums">{player.appearances}</p>
                    <p className="text-gray-600 text-[10px]">Apps</p>
                  </div>

                  {/* Stat */}
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-white font-black text-xl tabular-nums">
                        {statType === 'goals' ? player.goals : player.assists}
                      </span>
                    </div>
                    <p className="text-gray-500 text-[10px]">{statType === 'goals' ? 'Goals' : 'Assists'}</p>
                  </div>
                </div>
              ))}
            </>
          )}

          {!isLoading && (!players || players.length === 0) && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">No player data available</p>
              <p className="text-gray-600 text-sm mt-1">Try selecting a different league</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TopScorers;
