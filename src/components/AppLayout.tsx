import React, { useState } from 'react';
import { LiveMatch, upcomingMatches, standings, newsArticles, Sport } from '@/data/sportsData';
import Header from './sports/Header';
import HeroSection from './sports/HeroSection';
import StatsBar from './sports/StatsBar';
import QuickLinks from './sports/QuickLinks';
import LiveScores from './sports/LiveScores';
import FeaturedMatch from './sports/FeaturedMatch';
import UpcomingMatches from './sports/UpcomingMatches';
import TopScorers from './sports/TopScorers';
import Standings from './sports/Standings';
import NewsFeed from './sports/NewsFeed';
import Footer from './sports/Footer';
import BackToTop from './sports/BackToTop';
import { useScoreSimulator } from './sports/ScoreSimulator';
import { Wifi, WifiOff, Loader2, Database, Radio } from 'lucide-react';

const AppLayout: React.FC = () => {
  const [activeSport, setActiveSport] = useState<Sport>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<LiveMatch | null>(null);

  const { matches: simulatedMatches, source, loading, error } = useScoreSimulator();

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <Header
        activeSport={activeSport}
        onSportChange={setActiveSport}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Data source indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3">
        <div className="flex items-center gap-2 text-xs">
          {loading ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              Fetching live data...
            </span>
          ) : source === 'api-football' ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400">
              <Wifi className="w-3 h-3" />
              Live API Data
            </span>
          ) : source.includes('simulated') ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-full text-[#00d4ff]">
              <Radio className="w-3 h-3" />
              Simulated Live Data
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400">
              <Database className="w-3 h-3" />
              Edge Function: {source}
            </span>
          )}
          {error && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400">
              <WifiOff className="w-3 h-3" />
              API unavailable - using fallback
            </span>
          )}
          <span className="text-gray-600 ml-auto">Auto-refreshes every 30s</span>
        </div>
      </div>

      <HeroSection
        featuredMatches={simulatedMatches}
        onMatchClick={setSelectedMatch}
      />

      <StatsBar />

      <QuickLinks onSportChange={setActiveSport} />

      <LiveScores
        matches={simulatedMatches}
        activeSport={activeSport}
        searchQuery={searchQuery}
        onMatchClick={setSelectedMatch}
      />

      <UpcomingMatches
        matches={upcomingMatches}
        activeSport={activeSport}
      />

      <TopScorers />

      <Standings standings={standings} />

      <NewsFeed articles={newsArticles} />

      <Footer />

      <BackToTop />

      <FeaturedMatch
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
      />
    </div>
  );
};

export default AppLayout;
