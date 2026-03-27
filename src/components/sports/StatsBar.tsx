import React, { useState, useEffect } from 'react';
import { Activity, Users, Tv, Globe } from 'lucide-react';

const StatsBar: React.FC = () => {
  const [viewers, setViewers] = useState(1247832);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((prev) => prev + Math.floor(Math.random() * 200 - 80));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: Activity, label: 'Live Matches', value: '15', color: 'text-red-400' },
    { icon: Users, label: 'Active Viewers', value: viewers.toLocaleString(), color: 'text-[#00d4ff]' },
    { icon: Tv, label: 'Leagues Covered', value: '42', color: 'text-[#00ff88]' },
    { icon: Globe, label: 'Countries', value: '180+', color: 'text-purple-400' },
  ];

  return (
    <section className="py-6 border-y border-white/5 bg-[#0d1117]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-white font-bold text-lg tabular-nums">{stat.value}</p>
                <p className="text-gray-500 text-xs">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
