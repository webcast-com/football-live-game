import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Trophy } from 'lucide-react';
import { Standing } from '@/data/sportsData';

interface StandingsProps {
  standings: Standing[];
}

type SortKey = 'rank' | 'team' | 'wins' | 'losses' | 'points' | 'gf' | 'ga';

const Standings: React.FC<StandingsProps> = ({ standings: initialStandings }) => {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === 'rank' || key === 'team');
    }
  };

  const sorted = useMemo(() => {
    const data = [...initialStandings];
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
  }, [initialStandings, sortKey, sortAsc]);

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

  return (
    <section id="standings" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full" />
              Premier League Standings
            </h2>
            <p className="text-gray-500 text-sm mt-1">2025-26 Season</p>
          </div>
          <Trophy className="w-6 h-6 text-yellow-500" />
        </div>

        <div className="bg-[#161b22] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <HeaderCell column="rank" label="#" className="w-12 text-center" />
                  <HeaderCell column="team" label="Team" className="text-left" />
                  <HeaderCell column="wins" label="W" />
                  <th className="px-3 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">D</th>
                  <HeaderCell column="losses" label="L" />
                  <HeaderCell column="gf" label="GF" />
                  <HeaderCell column="ga" label="GA" />
                  <th className="px-3 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">GD</th>
                  <HeaderCell column="points" label="Pts" />
                  <th className="px-3 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Form</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((team, i) => (
                  <tr
                    key={team.abbr}
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
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[9px] font-black flex-shrink-0"
                          style={{ backgroundColor: team.color }}
                        >
                          {team.abbr}
                        </div>
                        <span className="text-white font-medium text-sm whitespace-nowrap">{team.team}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-sm text-white font-semibold tabular-nums">{team.wins}</td>
                    <td className="px-3 py-3.5 text-sm text-gray-400 tabular-nums">{team.draws ?? 0}</td>
                    <td className="px-3 py-3.5 text-sm text-gray-400 tabular-nums">{team.losses}</td>
                    <td className="px-3 py-3.5 text-sm text-gray-400 tabular-nums">{team.gf}</td>
                    <td className="px-3 py-3.5 text-sm text-gray-400 tabular-nums">{team.ga}</td>
                    <td className="px-3 py-3.5 text-sm tabular-nums">
                      <span className={team.gf - team.ga > 0 ? 'text-green-400' : team.gf - team.ga < 0 ? 'text-red-400' : 'text-gray-400'}>
                        {team.gf - team.ga > 0 ? '+' : ''}{team.gf - team.ga}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="text-white font-black text-sm tabular-nums">{team.points}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex gap-1">
                        {team.streak.split('').map((char, ci) => {
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
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
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
        </div>
      </div>
    </section>
  );
};

export default Standings;
