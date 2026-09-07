import React, { useState } from 'react';
import { FileText, Calendar, ArrowRight, Sparkles, ChevronRight, User } from 'lucide-react';
import { SYF_NEWS_ARTICLES } from '../../data/sajedaCharityData';
import { CharityNewsItem } from '../../types/donationTypes';

export const SajedaNewsSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<CharityNewsItem | null>(null);

  const featured = SYF_NEWS_ARTICLES.find(n => n.isFeatured) || SYF_NEWS_ARTICLES[0];
  const others = SYF_NEWS_ARTICLES.filter(n => n.id !== featured.id);

  return (
    <section className="py-16 lg:py-24 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
              <FileText className="w-4 h-4 text-teal-700" />
              <span>Field Reports & News</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              সাম্প্রতিক সংবাদ ও মাঠপর্যায়ের প্রতিবেদন
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              সাজেদা ইয়ুথ ফাউন্ডেশনের চলমান কর্মকাণ্ড, ত্রাণ বিতরণ ও প্রকল্পের সাম্প্রতিক হালনাগাদ।
            </p>
          </div>
        </div>

        {/* News Grid (Split Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Featured News (Left, 7 columns) */}
          <div
            onClick={() => setSelectedArticle(featured)}
            className="lg:col-span-7 bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div className="relative h-72 sm:h-80 overflow-hidden">
              <img
                src={featured.imageUrl}
                alt={featured.titleBn}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              <div className="absolute top-4 left-4 bg-emerald-700 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                ⭐ Featured Story
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs text-amber-300 font-bold block mb-1">{featured.categoryBn}</span>
                <h3 className="text-lg sm:text-2xl font-black leading-snug">
                  {featured.titleBn}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {featured.shortDescriptionBn}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{featured.dateBn}</span>
                </span>

                <span className="text-emerald-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition">
                  <span>সম্পূর্ণ পড়ুন</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>

          {/* Secondary News List (Right, 5 columns) */}
          <div className="lg:col-span-5 space-y-4">
            {others.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedArticle(item)}
                className="bg-slate-50 hover:bg-emerald-50/50 p-4 rounded-3xl border border-slate-200 transition duration-300 cursor-pointer flex gap-4 items-center group"
              >
                <img
                  src={item.imageUrl}
                  alt={item.titleBn}
                  className="w-24 h-24 rounded-2xl object-cover shrink-0 group-hover:scale-105 transition"
                />

                <div className="space-y-1.5 overflow-hidden">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {item.categoryBn}
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-800 transition">
                    {item.titleBn}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{item.dateBn}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* News Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-left animate-in zoom-in-95">
            <div className="relative h-60 rounded-2xl overflow-hidden">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.titleBn}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-xs text-amber-300 font-bold">{selectedArticle.categoryBn}</span>
                <h3 className="text-lg font-black">{selectedArticle.titleBn}</h3>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
              <span>প্রকাশিত: {selectedArticle.dateBn}</span>
              <span>লেখক: {selectedArticle.authorBn}</span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              <p className="font-bold text-slate-900">{selectedArticle.shortDescriptionBn}</p>
              <p>{selectedArticle.contentBn}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
