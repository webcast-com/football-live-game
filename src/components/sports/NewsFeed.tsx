import React, { useState } from 'react';
import { Clock, User, ArrowRight, X, BookOpen } from 'lucide-react';
import { NewsArticle } from '@/data/sportsData';

interface NewsFeedProps {
  articles: NewsArticle[];
}

const NewsFeed: React.FC<NewsFeedProps> = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [visibleCount, setVisibleCount] = useState(4);

  const featured = articles[0];
  const rest = articles.slice(1, visibleCount);

  return (
    <section id="news" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-8 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full" />
              Latest News
            </h2>
            <p className="text-gray-500 text-sm mt-1">Breaking stories and analysis</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Featured article */}
          {featured && (
            <div
              className="group cursor-pointer"
              onClick={() => setSelectedArticle(featured)}
            >
              <div className="relative overflow-hidden rounded-2xl mb-4">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="px-2.5 py-1 bg-[#00d4ff]/20 text-[#00d4ff] text-xs font-bold rounded-lg mb-3 inline-block">
                    {featured.category}
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#00d4ff] transition-colors">
                    {featured.title}
                  </h3>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <User className="w-3 h-3" />
                  {featured.author}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {featured.time}
                </div>
                <span>{featured.readTime}</span>
              </div>
            </div>
          )}

          {/* Other articles */}
          <div className="space-y-4">
            {rest.map((article) => (
              <div
                key={article.id}
                className="flex gap-4 bg-[#161b22] border border-white/5 rounded-xl p-3 hover:border-white/10 hover:bg-[#1c2333] transition-all cursor-pointer group"
                onClick={() => setSelectedArticle(article)}
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-28 h-20 sm:w-32 sm:h-24 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-[#00d4ff] uppercase">{article.category}</span>
                    <span className="text-gray-700 text-[10px]">|</span>
                    <span className="text-gray-500 text-[10px]">{article.time}</span>
                  </div>
                  <h4 className="text-white font-semibold text-sm leading-snug group-hover:text-[#00d4ff] transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-1 hidden sm:block">{article.excerpt}</p>
                </div>
              </div>
            ))}

            {visibleCount < articles.length && (
              <button
                onClick={() => setVisibleCount(articles.length)}
                className="w-full py-3 text-sm font-semibold text-[#00d4ff] bg-[#00d4ff]/5 border border-[#00d4ff]/20 rounded-xl hover:bg-[#00d4ff]/10 transition-all flex items-center justify-center gap-2"
              >
                Load More Articles
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Article modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedArticle(null)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#161b22] border border-white/10 rounded-2xl shadow-2xl">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-black/50 text-gray-400 hover:text-white hover:bg-black/70 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="w-full h-56 object-cover rounded-t-2xl"
            />

            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 bg-[#00d4ff]/20 text-[#00d4ff] text-xs font-bold rounded-lg">
                  {selectedArticle.category}
                </span>
                <span className="text-gray-500 text-xs">{selectedArticle.time}</span>
                <span className="flex items-center gap-1 text-gray-500 text-xs">
                  <BookOpen className="w-3 h-3" />
                  {selectedArticle.readTime}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-4">{selectedArticle.title}</h2>

              <div className="flex items-center gap-2 mb-6 pb-6 border-b border-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#0066ff] flex items-center justify-center text-white text-xs font-bold">
                  {selectedArticle.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{selectedArticle.author}</p>
                  <p className="text-gray-500 text-xs">Sports Correspondent</p>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed mb-4">{selectedArticle.excerpt}</p>
                <p className="text-gray-400 leading-relaxed mb-4">
                  The match showcased incredible athleticism and determination from both sides. Fans were treated to a spectacle that will be remembered for years to come, with momentum swinging back and forth throughout the contest.
                </p>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Key performances from star players elevated the competition to new heights. The tactical battle between the coaching staffs added another layer of intrigue, with both teams adjusting their strategies as the game progressed.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Looking ahead, both teams will need to regroup and prepare for their next fixtures. The implications of this result could have far-reaching consequences for the remainder of the season, with playoff positioning and championship aspirations hanging in the balance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsFeed;
