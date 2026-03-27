import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Zap } from 'lucide-react';
import { LiveMatch } from '@/data/sportsData';

interface HeroProps {
  featuredMatches: LiveMatch[];
  onMatchClick: (match: LiveMatch) => void;
}

const HeroSection: React.FC<HeroProps> = ({ featuredMatches, onMatchClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const liveMatches = featuredMatches.filter(m => m.status === 'live');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.max(liveMatches.length, 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [liveMatches.length]);

  const currentMatch = liveMatches[currentSlide] || featuredMatches[0];

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://d64gsuwffb70l.cloudfront.net/69a9d92741a5bbac0cda4aca_1772738952946_74c79b62.png"
          alt="Sports action"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1117] via-[#0d1117]/90 to-[#0d1117]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full mb-6">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 text-xs font-semibold tracking-wider uppercase">Live Now</span>
              <span className="text-gray-400 text-xs">{liveMatches.length} matches</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Every Score.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#00ff88]">
                Every Moment.
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg">
              Real-time scores, stats, and highlights from every major league. Never miss a play.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  document.getElementById('live-scores')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#00d4ff] to-[#0066ff] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#00d4ff]/25 transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Live Scores
              </button>
              <button
                onClick={() => {
                  document.getElementById('upcoming')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-white/10 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Upcoming
              </button>
            </div>
          </div>

          {/* Right - Featured match card */}
          {currentMatch && (
            <div
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-[#00d4ff]/30 transition-all group"
              onClick={() => onMatchClick(currentMatch)}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{currentMatch.league}</span>
                <div className="flex items-center gap-2">
                  {currentMatch.status === 'live' && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/20 rounded-full">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-red-400 text-xs font-bold">LIVE</span>
                    </span>
                  )}
                  <span className="text-[#00d4ff] text-sm font-mono font-bold">{currentMatch.time}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                {/* Home team */}
                <div className="flex-1 text-center">
                  <div
                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white font-black text-xl mb-3 shadow-lg"
                    style={{ backgroundColor: currentMatch.homeColor }}
                  >
                    {currentMatch.homeAbbr}
                  </div>
                  <p className="text-white font-semibold text-sm">{currentMatch.homeTeam}</p>
                </div>

                {/* Score */}
                <div className="text-center px-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl sm:text-5xl font-black text-white tabular-nums">{currentMatch.homeScore}</span>
                    <span className="text-2xl text-gray-600 font-light">-</span>
                    <span className="text-4xl sm:text-5xl font-black text-white tabular-nums">{currentMatch.awayScore}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-2 uppercase tracking-wider">{currentMatch.sport}</p>
                </div>

                {/* Away team */}
                <div className="flex-1 text-center">
                  <div
                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white font-black text-xl mb-3 shadow-lg"
                    style={{ backgroundColor: currentMatch.awayColor }}
                  >
                    {currentMatch.awayAbbr}
                  </div>
                  <p className="text-white font-semibold text-sm">{currentMatch.awayTeam}</p>
                </div>
              </div>

              {/* Slide indicators */}
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide((prev) => (prev - 1 + liveMatches.length) % liveMatches.length);
                  }}
                  className="p-1 text-gray-500 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {liveMatches.slice(0, 5).map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(i);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentSlide ? 'w-6 bg-[#00d4ff]' : 'w-1.5 bg-gray-600 hover:bg-gray-400'
                    }`}
                  />
                ))}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide((prev) => (prev + 1) % liveMatches.length);
                  }}
                  className="p-1 text-gray-500 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live ticker strip */}
        <div className="mt-10 overflow-hidden">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {liveMatches.map((match) => (
              <button
                key={match.id}
                onClick={() => onMatchClick(match)}
                className={`flex-shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
                  match.id === currentMatch?.id
                    ? 'bg-[#00d4ff]/10 border-[#00d4ff]/30'
                    : 'bg-white/5 border-white/5 hover:border-white/20'
                }`}
              >
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                <span className="text-xs text-gray-400 font-medium">{match.homeAbbr}</span>
                <span className="text-sm font-bold text-white tabular-nums">{match.homeScore} - {match.awayScore}</span>
                <span className="text-xs text-gray-400 font-medium">{match.awayAbbr}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
