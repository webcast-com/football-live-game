import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Bell, BellOff } from 'lucide-react';
import { UpcomingMatch, Sport } from '@/data/sportsData';

interface UpcomingMatchesProps {
  matches: UpcomingMatch[];
  activeSport: Sport;
}

const UpcomingMatches: React.FC<UpcomingMatchesProps> = ({ matches, activeSport }) => {
  const [reminders, setReminders] = useState<Set<number>>(new Set());

  const toggleReminder = (id: number) => {
    setReminders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = activeSport === 'all' ? matches : matches.filter((m) => m.sport === activeSport);

  return (
    <section id="upcoming" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-8 bg-gradient-to-b from-[#00ff88] to-[#00cc66] rounded-full" />
              Upcoming Matches
            </h2>
            <p className="text-gray-500 text-sm mt-1">{filtered.length} scheduled games</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-400 text-sm">This Week</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((match) => (
            <div
              key={match.id}
              className="bg-[#161b22] border border-white/5 rounded-2xl p-5 hover:border-[#00ff88]/20 hover:bg-[#1c2333] transition-all group"
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{match.league}</span>
                  <span className="text-gray-700">|</span>
                  <span className="text-[10px] text-gray-500 capitalize">{match.sport}</span>
                </div>
                <button
                  onClick={() => toggleReminder(match.id)}
                  className={`p-1.5 rounded-lg transition-all ${
                    reminders.has(match.id)
                      ? 'bg-[#00ff88]/20 text-[#00ff88]'
                      : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'
                  }`}
                  title={reminders.has(match.id) ? 'Remove reminder' : 'Set reminder'}
                >
                  {reminders.has(match.id) ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                </button>
              </div>

              {/* Teams */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-[10px] font-black">
                      {match.homeAbbr}
                    </div>
                    <span className="text-white font-medium text-sm">{match.homeTeam}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-[10px] font-black">
                      {match.awayAbbr}
                    </div>
                    <span className="text-white font-medium text-sm">{match.awayTeam}</span>
                  </div>
                </div>

                {/* Date/Time */}
                <div className="text-right">
                  <p className="text-white font-bold text-sm">{match.date}</p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-400 text-xs">{match.time}</span>
                  </div>
                </div>
              </div>

              {/* Bottom row */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-gray-600" />
                  <span className="text-gray-500 text-xs">{match.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-gray-400 font-mono">
                    H {match.odds.home}
                  </span>
                  {match.odds.draw && (
                    <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-gray-400 font-mono">
                      D {match.odds.draw}
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-gray-400 font-mono">
                    A {match.odds.away}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingMatches;
