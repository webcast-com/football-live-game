import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Bell, BellOff, Loader2, AlertCircle } from 'lucide-react';
import { useUpcomingFixtures, POPULAR_LEAGUES } from '@/hooks/useFootballAPI';
import { TransformedFixture } from '@/types/apiFootball';

interface UpcomingMatchesProps {
  matches?: TransformedFixture[];
  leagueId?: number;
}

const UpcomingMatches: React.FC<UpcomingMatchesProps> = ({ matches: mockMatches, leagueId = POPULAR_LEAGUES.PREMIER_LEAGUE }) => {
  const [reminders, setReminders] = useState<Set<number>>(new Set());

  // Fetch upcoming fixtures from API
  const { data: apiMatches, isLoading, isError, error } = useUpcomingFixtures(leagueId, 7);
  const matches = apiMatches || mockMatches || [];

  const toggleReminder = (id: number) => {
    setReminders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = matches;

  return (
    <section id="upcoming" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-8 bg-gradient-to-b from-[#00ff88] to-[#00cc66] rounded-full" />
              Upcoming Matches
            </h2>
            <p className="text-gray-500 text-sm mt-1">{isLoading ? 'Loading...' : `${filtered.length} scheduled games`}</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-400 text-sm">Next 7 Days</span>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-green-400 animate-spin" />
            <span className="ml-2 text-gray-400">Loading upcoming matches...</span>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-red-400 font-medium">Failed to load upcoming matches</p>
              <p className="text-red-400/70 text-sm">{error?.message || 'Please check your API key configuration'}</p>
            </div>
          </div>
        )}

        {/* Grid */}
        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((match) => (
              <div
                key={match.id}
                className="bg-[#161b22] border border-white/5 rounded-2xl p-5 hover:border-[#00ff88]/20 hover:bg-[#1c2333] transition-all group"
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{match.leagueName}</span>
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
                      <img src={match.homeTeamLogo} alt={match.homeTeam} className="w-6 h-6 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <span className="text-white font-medium text-sm">{match.homeTeam}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <img src={match.awayTeamLogo} alt={match.awayTeam} className="w-6 h-6 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <span className="text-white font-medium text-sm">{match.awayTeam}</span>
                    </div>
                  </div>

                  {/* Date/Time */}
                  <div className="text-right">
                    <p className="text-white font-bold text-sm">{new Date(match.date).toLocaleDateString()}</p>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-400 text-xs">{new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom row */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-gray-600" />
                    <span className="text-gray-500 text-xs">{match.venue || 'TBA'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No upcoming matches found</p>
            <p className="text-gray-600 text-sm mt-1">Check back soon for new matches</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingMatches;
