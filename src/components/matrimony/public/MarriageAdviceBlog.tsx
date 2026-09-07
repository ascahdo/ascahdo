import React from 'react';
import { BookOpen, Calendar, ArrowRight, User } from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimony } from '../../../context/MatrimonyContext';

export const MarriageAdviceBlog: React.FC = () => {
  const { lang } = useMatrimonyLanguage();
  const { blogPosts = [] } = useMatrimony();

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/70" id="blog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5 text-rose-700" />
            <span>{lang === 'bn' ? 'বিবাহ পরামর্শ ও ব্লগ' : 'Marriage Advice'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            {lang === 'bn' ? 'সুখী দাম্পত্য ও পাত্র-পাত্রী নির্বাচনের সঠিক দিকনির্দেশনা' : 'Insights & Matrimonial Guidance'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {lang === 'bn'
              ? 'ইসলামিক দৃষ্টিভঙ্গি, আইনি দিক ও পারিবারিক মিল সংক্রান্ত বিশেষজ্ঞদের দরকারি পরামর্শ।'
              : 'Helpful articles on Islamic marriage, communication, and family harmony.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map(post => (
            <div
              key={post.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={post.featuredImageUrl}
                    alt={post.titleBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-rose-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {post.category}
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-2.5">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{post.publishedDate}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{post.author}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base sm:text-lg font-serif group-hover:text-rose-700 transition">
                    {lang === 'bn' ? post.titleBn : post.titleEn}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {lang === 'bn' ? post.summaryBn : post.summaryEn}
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6 pt-0">
                <button className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                  <span>{lang === 'bn' ? 'সম্পূর্ণ পড়ুন' : 'Read Article'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
