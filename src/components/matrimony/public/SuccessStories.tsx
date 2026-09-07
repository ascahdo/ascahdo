import React, { useState } from 'react';
import { Heart, Sparkles, Quote, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimony } from '../../../context/MatrimonyContext';

export const SuccessStories: React.FC = () => {
  const { lang } = useMatrimonyLanguage();
  const { successStories = [] } = useMatrimony();

  return (
    <section className="py-16 sm:py-20 bg-rose-50/40 border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold">
            <Heart className="w-3.5 h-3.5 fill-rose-700 text-rose-700" />
            <span>{lang === 'bn' ? 'সফল দাম্পত্য কাহিনী' : 'Happy Stories'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            {lang === 'bn' ? 'এসকাডোর মাধ্যমে শুরু হওয়া সুখের গল্প' : 'Real Stories of Blessed Unions'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {lang === 'bn'
              ? 'আমাদের সহায়তায় বিবাহবন্ধনে আবদ্ধ হওয়া সম্মানিত দম্পতিদের শুভানুভুতি।'
              : 'Couples who found their true compatibility and started their blessed journey together.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {successStories.map(story => (
            <div
              key={story.id}
              className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={story.coupleImageUrl}
                    alt={`${story.groomName} & ${story.brideName}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold">{story.location}</span>
                    <span className="font-mono text-[10px] text-rose-200">{story.marriageDate}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg font-serif">
                    {story.groomName} &amp; {story.brideName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-rose-700 font-medium mt-0.5">
                    <span>{story.groomProfession}</span>
                    <span>•</span>
                    <span>{story.brideProfession}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  "{lang === 'bn' ? story.storyBn : story.storyEn}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'যাচাইকৃত বিবাহ' : 'Verified Marriage'}</span>
                </span>
                <span>{lang === 'bn' ? 'শুভ বিবাহ' : 'Blessed Union'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
