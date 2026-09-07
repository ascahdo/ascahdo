import React from 'react';
import {
  Heart, Users, CheckCircle2, Building2, Flame,
  Trophy, Sparkles, UserCheck, ShieldCheck
} from 'lucide-react';

export const SajedaImpactCounter: React.FC = () => {
  const liveStats = [
    { labelBn: 'মোট সংগৃহীত অনুদান', labelEn: 'Total Donations', value: '৳ ৪৮,৫০,০০০+', icon: 'Heart', color: 'text-emerald-400' },
    { labelBn: 'সম্মানিত দাতা সদস্য', labelEn: 'Total Donors', value: '৩,৮৪০+ জন', icon: 'Users', color: 'text-amber-300' },
    { labelBn: 'প্রত্যক্ষ সুবিধাভোগী মানুষ', labelEn: 'People Helped', value: '১৪,২০০+ জন', icon: 'UserCheck', color: 'text-teal-300' },
    { labelBn: 'সহায়তাপ্রাপ্ত পরিবার', labelEn: 'Families Supported', value: '২,৫০০+ টি', icon: 'Building2', color: 'text-blue-300' },
    { labelBn: 'চলমান মানবিক ক্যাম্পেইন', labelEn: 'Active Campaigns', value: '৪ টি', icon: 'Flame', color: 'text-rose-400' },
    { labelBn: 'সফলভাবে সম্পন্ন প্রকল্প', labelEn: 'Completed Projects', value: '২৮ টি', icon: 'CheckCircle2', color: 'text-emerald-300' },
    { labelBn: 'নিবেদিত তরুণ ভলান্টিয়ার', labelEn: 'Active Volunteers', value: '১৮০+ জন', icon: 'Trophy', color: 'text-purple-300' }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-teal-950 via-slate-900 to-teal-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>আমাদের সম্মিলিত প্রভাব</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            আমরা একসঙ্গে যা করেছি
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-medium">
            আপনার প্রতিটি ক্ষুদ্র দান একতাবদ্ধ হয়ে হাজারো অন্ধকার জীবনে আশার আলো জ্বালিয়েছে।
          </p>
        </div>

        {/* Counters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {liveStats.slice(0, 4).map((item, idx) => (
            <div
              key={idx}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 text-center space-y-2 transition transform hover:-translate-y-1"
            >
              <div className="text-2xl sm:text-4xl font-black text-white font-mono tracking-tight">
                <span className={item.color}>{item.value}</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-200">
                {item.labelBn}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {item.labelEn}
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Row (3 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
          {liveStats.slice(4).map((item, idx) => (
            <div
              key={idx}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10 flex items-center justify-between gap-4 transition"
            >
              <div className="text-left space-y-0.5">
                <div className="text-xs sm:text-sm font-bold text-slate-200">{item.labelBn}</div>
                <div className="text-[10px] text-slate-400 font-mono">{item.labelEn}</div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* 4 Big Highlights below counters */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-800/30">
            <span className="text-2xl font-black text-emerald-400 font-mono block">২,৫০০+</span>
            <span className="text-xs text-slate-300 font-semibold">পরিবার খাদ্য সহায়তা পেয়েছে</span>
          </div>
          <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-800/30">
            <span className="text-2xl font-black text-teal-300 font-mono block">৮৫০+</span>
            <span className="text-xs text-slate-300 font-semibold">শিক্ষার্থী শিক্ষা সহায়তা পেয়েছে</span>
          </div>
          <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-800/30">
            <span className="text-2xl font-black text-amber-300 font-mono block">১,২০০+</span>
            <span className="text-xs text-slate-300 font-semibold">মানুষ চিকিৎসা সহায়তা পেয়েছে</span>
          </div>
          <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-800/30">
            <span className="text-2xl font-black text-rose-400 font-mono block">৩০+</span>
            <span className="text-xs text-slate-300 font-semibold">জরুরি দুর্যোগকালীন উদ্যোগ সম্পন্ন</span>
          </div>
        </div>

      </div>
    </section>
  );
};
