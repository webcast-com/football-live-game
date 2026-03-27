import React, { useState } from 'react';
import { Award, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Player {
  rank: number;
  name: string;
  team: string;
  teamAbbr: string;
  teamColor: string;
  stat: number;
  statLabel: string;
  trend: 'up' | 'down' | 'same';
  gamesPlayed: number;
}

const playersByLeague: Record<string, Player[]> = {
  'Premier League': [
    { rank: 1, name: 'Erling Haaland', team: 'Manchester City', teamAbbr: 'MCI', teamColor: '#6CABDD', stat: 24, statLabel: 'Goals', trend: 'up', gamesPlayed: 26 },
    { rank: 2, name: 'Mohamed Salah', team: 'Liverpool', teamAbbr: 'LIV', teamColor: '#C8102E', stat: 19, statLabel: 'Goals', trend: 'up', gamesPlayed: 28 },
    { rank: 3, name: 'Alexander Isak', team: 'Newcastle', teamAbbr: 'NEW', teamColor: '#241F20', stat: 17, statLabel: 'Goals', trend: 'same', gamesPlayed: 25 },
    { rank: 4, name: 'Cole Palmer', team: 'Chelsea', teamAbbr: 'CHE', teamColor: '#034694', stat: 16, statLabel: 'Goals', trend: 'up', gamesPlayed: 27 },
    { rank: 5, name: 'Ollie Watkins', team: 'Aston Villa', teamAbbr: 'AVL', teamColor: '#670E36', stat: 14, statLabel: 'Goals', trend: 'down', gamesPlayed: 28 },
  ],
  'NBA': [
    { rank: 1, name: 'Luka Doncic', team: 'Dallas Mavericks', teamAbbr: 'DAL', teamColor: '#003594', stat: 34, statLabel: 'PPG', trend: 'up', gamesPlayed: 58 },
    { rank: 2, name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', teamAbbr: 'MIL', teamColor: '#00471B', stat: 32, statLabel: 'PPG', trend: 'same', gamesPlayed: 55 },
    { rank: 3, name: 'Shai Gilgeous-Alexander', team: 'OKC Thunder', teamAbbr: 'OKC', teamColor: '#007AC1', stat: 31, statLabel: 'PPG', trend: 'up', gamesPlayed: 60 },
    { rank: 4, name: 'Kevin Durant', team: 'Phoenix Suns', teamAbbr: 'PHX', teamColor: '#E56020', stat: 28, statLabel: 'PPG', trend: 'down', gamesPlayed: 52 },
    { rank: 5, name: 'Jayson Tatum', team: 'Boston Celtics', teamAbbr: 'BOS', teamColor: '#007A33', stat: 27, statLabel: 'PPG', trend: 'same', gamesPlayed: 59 },
  ],
};

const TopScorers: React.FC = () => {
  const [activeLeague, setActiveLeague] = useState('Premier League');
  const players = playersByLeague[activeLeague] || [];

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-8 bg-gradient-to-b from-red-400 to-rose-600 rounded-full" />
              Top Performers
            </h2>
            <p className="text-gray-500 text-sm mt-1">Leading scorers across leagues</p>
          </div>
          <div className="flex gap-2">
            {Object.keys(playersByLeague).map((league) => (
              <button
                key={league}
                onClick={() => setActiveLeague(league)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeLeague === league
                    ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30'
                    : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
                }`}
              >
                {league}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#161b22] border border-white/5 rounded-2xl overflow-hidden">
          {players.map((player, i) => (
            <div
              key={player.name}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors ${
                i < players.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              {/* Rank */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${
                player.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                player.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                player.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                'bg-white/5 text-gray-500'
              }`}>
                {player.rank}
              </div>

              {/* Player info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{player.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center text-white text-[6px] font-black"
                    style={{ backgroundColor: player.teamColor }}
                  >
                    {player.teamAbbr.slice(0, 2)}
                  </div>
                  <span className="text-gray-500 text-xs">{player.team}</span>
                </div>
              </div>

              {/* Games */}
              <div className="hidden sm:block text-center">
                <p className="text-gray-400 text-sm tabular-nums">{player.gamesPlayed}</p>
                <p className="text-gray-600 text-[10px]">Games</p>
              </div>

              {/* Stat */}
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-white font-black text-xl tabular-nums">{player.stat}</span>
                  {player.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : player.trend === 'down' ? (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  ) : (
                    <Minus className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <p className="text-gray-500 text-[10px]">{player.statLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopScorers;
