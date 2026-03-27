import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Trophy, AlertCircle, Loader2 } from 'lucide-react';
import { useStandings, POPULAR_LEAGUES } from '@/hooks/useFootballAPI';
import { TransformedStanding } from '@/types/apiFootball';

interface StandingsProps {
  standings?: TransformedStanding[];
  leagueId?: number;
}

type SortKey = 'rank' | 'team' | 'wins' | 'losses' | 'points' | 'goalsFor' | 'goalsAgainst';

const Standings: React.FC<StandingsProps> = ({ standings: mockStandings, leagueId = POPULAR_LEAGUES.PREMIER_LEAGUE }) => {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState(leagueId);

  // Fetch data from API if leagueId is provided
  const { data: apiStandings, isLoading, isError, error } = useStandings(selectedLeague);
  const standings = apiStandings || mockStandings || [];

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === 'rank' || key === 'team');
    }
  };

  const sorted = useMemo(() => {
    const data = [...standings];
    data.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'team') {
        cmp = a.team.localeCompare(b.team);
      } else {
        cmp = (a[sortKey] as number) - (b[sortKey] as number);
      }
      return sortAsc ? cmp : -cmp;
    });
    return data;
  }, [standings, sortKey, sortAsc]);

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ChevronDown className="w-3 h-3 text-gray-600" />;
    return sortAsc ? <ChevronUp className="w-3 h-3 text-[#00d4ff]" /> : <ChevronDown className="w-3 h-3 text-[#00d4ff]" />;
  };

  const HeaderCell = ({ column, label, className = '' }: { column: SortKey; label: string; className?: string }) => (
    <th
      className={`px-3 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-300 transition-colors select-none ${className}`}
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-1">
        {label}
        <SortIcon column={column} />
      </div>
    </th>
  );

  const leagueNames: Record<number, string> = {
    [POPULAR_LEAGUES.PREMIER_LEAGUE]: 'Premier League',
    [POPULAR_LEAGUES.LA_LIGA]: 'La Liga',
    [POPULAR_LEAGUES.SERIE_A]: 'Serie A',
    [POPULAR_LEAGUES.BUNDESLIGA]: 'Bundesliga',
    [POPULAR_LEAGUES.LIGUE_1]: 'Ligue 1',
    [POPULAR_LEAGUES.CHAMPIONS_LEAGUE]: 'Champions League',
  };

  return (
    <section id="standings" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full" />
              League Standings
            </h2>
            <p className="text-gray-500 text-sm mt-1">{leagueNames[selectedLeague]} - 2025-26 Season</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(Number(e.target.value))}
              className="px-3 py-2 text-sm bg-[#161b22] text-white border border-white/10 rounded-lg focus:outline-none focus:border-yellow-400/30"
              style={{ colorScheme: 'dark' }}
            >
              {Object.entries(leagueNames).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
            <Trophy className="w-6 h-6 text-yellow-500" />
          </div>
        </div>

        <div className="bg-[#161b22] border border-white/5 rounded-2xl overflow-hidden">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
              <span className="ml-2 text-gray-400">Loading standings...</span>
            </div>
          )}
          
          {isError && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg m-4">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-red-400 font-medium">Failed to load standings</p>
                <p className="text-red-400/70 text-sm">{error?.message || 'Please check your API key configuration'}</p>
              </div>
            </div>
          )}

          {!isLoading && standings.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <HeaderCell column="rank" label="#" className="w-12 text-center" />
                    <HeaderCell column="team" label="Team" className="text-left" />
                    <HeaderCell column="wins" label="W" />
                    <th className="px-3 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">D</th>
                    <HeaderCell column="losses" label="L" />
                    <HeaderCell column="goalsFor" label="GF" />
                    <HeaderCell column="goalsAgainst" label="GA" />
                    <th className="px-3 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">GD</th>
                    <HeaderCell column="points" label="Pts" />
                    <th className="px-3 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Form</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((team, i) => (
                    <tr
                      key={`${team.teamId}-${i}`}
                      className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${
                        i < 4 ? '' : ''
                      }`}
                    >
                      <td className="px-3 py-3.5 text-center">
                        <span className={`text-sm font-bold ${
                          team.rank <= 4 ? 'text-[#00d4ff]' : team.rank <= 6 ? 'text-orange-400' : 'text-gray-500'
                        }`}>
                          {team.rank}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={team.teamLogo}
                            alt={team.team}
                            className="w-7 h-7 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <span className="text-white font-medium text-sm whitespace-nowrap">{team.team}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-sm text-white font-semibold tabular-nums">{team.wins}</td>
                      <td className="px-3 py-3.5 text-sm text-gray-400 tabular-nums">{team.draws}</td>
                      <td className="px-3 py-3.5 text-sm text-gray-400 tabular-nums">{team.losses}</td>
                      <td className="px-3 py-3.5 text-sm text-gray-400 tabular-nums">{team.goalsFor}</td>
                      <td className="px-3 py-3.5 text-sm text-gray-400 tabular-nums">{team.goalsAgainst}</td>
                      <td className="px-3 py-3.5 text-sm tabular-nums">
                        <span className={team.goalDiff > 0 ? 'text-green-400' : team.goalDiff < 0 ? 'text-red-400' : 'text-gray-400'}>
                          {team.goalDiff > 0 ? '+' : ''}{team.goalDiff}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="text-white font-black text-sm tabular-nums">{team.points}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex gap-1">
                          {team.form ? team.form.split('').map((char, ci) => {
                            if (char === 'W' || char === 'D' || char === 'L') {
                              return (
                                <span
                                  key={ci}
                                  className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center ${
                                    char === 'W' ? 'bg-green-500/20 text-green-400' :
                                    char === 'D' ? 'bg-gray-500/20 text-gray-400' :
                                    'bg-red-500/20 text-red-400'
                                  }`}
                                >
                                  {char}
                                </span>
                              );
                            }
                            return null;
                          }) : <span className="text-gray-500 text-xs">-</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && standings.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">No standings data available</p>
              <p className="text-gray-600 text-sm mt-1">Try selecting a different league</p>
            </div>
          )}

          {/* Legend */}
          {!isLoading && standings.length > 0 && (
            <div className="px-4 py-3 border-t border-white/5 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00d4ff]" />
                <span className="text-gray-500 text-[10px]">Champions League</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="text-gray-500 text-[10px]">Europa League</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Standings;
