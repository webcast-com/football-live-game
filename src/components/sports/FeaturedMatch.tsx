import React, { useState } from 'react';
import { X, Clock, Target, AlertTriangle } from 'lucide-react';
import { LiveMatch, featuredMatchStats } from '@/data/sportsData';

interface FeaturedMatchProps {
  match: LiveMatch | null;
  onClose: () => void;
}

const FeaturedMatch: React.FC<FeaturedMatchProps> = ({ match, onClose }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'timeline'>('stats');

  if (!match) return null;

  const stats = featuredMatchStats;

  const StatBar = ({ label, home, away }: { label: string; home: number; away: number }) => {
    const total = home + away || 1;
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white font-semibold tabular-nums">{home}</span>
          <span className="text-gray-400 text-xs uppercase tracking-wider">{label}</span>
          <span className="text-white font-semibold tabular-nums">{away}</span>
        </div>
        <div className="flex gap-1 h-1.5">
          <div
            className="rounded-full bg-gradient-to-r from-[#00d4ff] to-[#0066ff] transition-all"
            style={{ width: `${(home / total) * 100}%` }}
          />
          <div
            className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
            style={{ width: `${(away / total) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#161b22] border border-white/10 rounded-2xl shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{match.league}</span>
            {match.status === 'live' && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/20 rounded-full">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-400 text-[10px] font-bold">LIVE</span>
              </span>
            )}
          </div>

          {/* Score display */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex-1 text-center">
              <div
                className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white font-black text-lg mb-2 shadow-lg"
                style={{ backgroundColor: match.homeColor }}
              >
                {match.homeAbbr}
              </div>
              <p className="text-white font-bold text-sm">{match.homeTeam}</p>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-3">
                <span className="text-5xl font-black text-white tabular-nums">{match.homeScore}</span>
                <span className="text-3xl text-gray-600">-</span>
                <span className="text-5xl font-black text-white tabular-nums">{match.awayScore}</span>
              </div>
              <p className="text-[#00d4ff] text-sm font-mono font-bold mt-1">{match.time}</p>
            </div>

            <div className="flex-1 text-center">
              <div
                className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white font-black text-lg mb-2 shadow-lg"
                style={{ backgroundColor: match.awayColor }}
              >
                {match.awayAbbr}
              </div>
              <p className="text-white font-bold text-sm">{match.awayTeam}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 px-6">
          {(['stats', 'timeline'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-semibold capitalize transition-all border-b-2 ${
                activeTab === tab
                  ? 'text-[#00d4ff] border-[#00d4ff]'
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'stats' ? (
            <div className="space-y-5">
              <StatBar label="Possession %" home={stats.possession.home} away={stats.possession.away} />
              <StatBar label="Shots" home={stats.shots.home} away={stats.shots.away} />
              <StatBar label="Shots on Target" home={stats.shotsOnTarget.home} away={stats.shotsOnTarget.away} />
              <StatBar label="Corners" home={stats.corners.home} away={stats.corners.away} />
              <StatBar label="Fouls" home={stats.fouls.home} away={stats.fouls.away} />
              <StatBar label="Yellow Cards" home={stats.yellowCards.home} away={stats.yellowCards.away} />
              <StatBar label="Passes" home={stats.passes.home} away={stats.passes.away} />
              <StatBar label="Pass Accuracy %" home={stats.passAccuracy.home} away={stats.passAccuracy.away} />
            </div>
          ) : (
            <div className="space-y-0">
              {stats.timeline.map((event, i) => (
                <div key={i} className="flex items-start gap-4 py-3 border-b border-white/5 last:border-0">
                  <span className="text-[#00d4ff] text-xs font-mono font-bold w-10 flex-shrink-0 pt-0.5">{event.time}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {event.event === 'Goal' ? (
                        <Target className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      )}
                      <span className={`text-xs font-bold uppercase ${
                        event.event === 'Goal' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {event.event}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        event.team === 'home' ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {event.team === 'home' ? match.homeAbbr : match.awayAbbr}
                      </span>
                    </div>
                    <p className="text-white text-sm font-medium mt-0.5">{event.player}</p>
                    <p className="text-gray-500 text-xs">{event.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedMatch;
