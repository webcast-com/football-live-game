import React, { useState } from 'react';
import { Search, Menu, X, Bell, User, TrendingUp } from 'lucide-react';
import { Sport } from '@/data/sportsData';
import ApiKeyManager from '@/components/settings/ApiKeyManager';

interface HeaderProps {
  activeSport: Sport;
  onSportChange: (sport: Sport) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const sports: { key: Sport; label: string }[] = [
  { key: 'all', label: 'All Sports' },
  { key: 'football', label: 'Football' },
  { key: 'basketball', label: 'Basketball' },
  { key: 'soccer', label: 'Soccer' },
  { key: 'baseball', label: 'Baseball' },
  { key: 'tennis', label: 'Tennis' },
];

const Header: React.FC<HeaderProps> = ({ activeSport, onSportChange, searchQuery, onSearchChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0d1117]/95 backdrop-blur-xl border-b border-white/5">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#0066ff] flex items-center justify-center shadow-lg shadow-[#00d4ff]/20">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#00ff88] rounded-full animate-pulse border-2 border-[#0d1117]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Score<span className="text-[#00d4ff]">Hub</span>
              </h1>
              <p className="text-[10px] text-gray-500 -mt-0.5 tracking-widest uppercase">Live Sports</p>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search teams, matches, leagues..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4ff]/50 focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <Search className="w-5 h-5" />
            </button>
            <button className="relative p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <User className="w-5 h-5" />
            </button>
            <ApiKeyManager />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search teams, matches, leagues..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4ff]/50 transition-all"
            />
          </div>
        </div>
      )}

      {/* Sport tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`${mobileMenuOpen ? 'flex flex-col gap-1 py-2' : 'hidden lg:flex'} items-start lg:items-center lg:flex-row gap-0 lg:gap-1`}>
          {sports.map((sport) => (
            <button
              key={sport.key}
              onClick={() => {
                onSportChange(sport.key);
                setMobileMenuOpen(false);
              }}
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap w-full lg:w-auto text-left ${
                activeSport === sport.key
                  ? 'text-[#00d4ff] bg-[#00d4ff]/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {sport.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
