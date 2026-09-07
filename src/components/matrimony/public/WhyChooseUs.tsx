import React from 'react';
import { ShieldCheck, Lock, Users, Sparkles, Award, Heart, CheckCircle2 } from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';

export const WhyChooseUs: React.FC = () => {
  const { lang } = useMatrimonyLanguage();

  const reasons = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      titleBn: '১০০% এনআইডি ও ব্যাকগ্রাউন্ড ভেরিফিকেশন',
      titleEn: '100% NID & Background Screening',
      descBn: 'ভুয়া তথ্য ও স্প্যাম ঠেকাতে জাতীয় পরিচয়পত্র বা পাসপোর্ট যাচাই ছাড়া কোনো প্রোফাইল অনুমোদন দেওয়া হয় না।',
      descEn: 'Every profile undergoes manual NID screening to ensure a safe, fraud-free matrimonial network.',
    },
    {
      icon: <Lock className="w-6 h-6 text-rose-600" />,
      titleBn: 'কঠোর পারিবারিক গোপনীয়তা রক্ষা',
      titleEn: 'Strict Family Privacy Controls',
      descBn: 'পাত্র-পাত্রীর অনুমতি ছাড়া অভিভাবকের মোবাইল নম্বর বা সংবেদনশীল ঠিকানা কাউকে প্রকাশ করা হয় না।',
      descEn: 'Guardian contact information and photos remain protected until mutual consent is granted.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-600" />,
      titleBn: 'স্মার্ট অ্যালগরিদম ও পার্টনার ম্যাচিং',
      titleEn: 'Smart Compatibility Matchmaking',
      descBn: 'শিক্ষা, পেশা, ধর্মীয় মূল্যবোধ ও জেলাগত পছন্দের ওপর ভিত্তি করে শতাংশ হিসেবে সামঞ্জস্য ফলাফল প্রদর্শন।',
      descEn: 'Our matching algorithm calculates compatibility based on education, values, and lifestyle preferences.',
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      titleBn: 'মর্যাদাপূর্ণ ও ইসলামিক পরিবেশ',
      titleEn: 'Islamic & Cultural Values',
      descBn: 'সুন্নাহ ও পারিবারিক শালীনতা বজায় রেখে খাঁটি দ্বীনি ও মার্জিত জীবনসঙ্গী খোঁজার নির্ভরযোগ্য মাধ্যম।',
      descEn: 'Committed to upholding Islamic values, dignity, and sincere marriage intent.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-900 via-rose-950 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-900/60 border border-rose-700/60 text-rose-300 text-xs font-bold">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'bn' ? 'কেন আমরা সেরা' : 'Why Choose Us'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-serif tracking-tight">
            {lang === 'bn' ? 'কেন এসকাডো ম্যারেজ মিডিয়া সম্পূর্ণ আলাদা?' : 'Why Thousands Trust Ascahdo Matrimony'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {lang === 'bn'
              ? 'নিরাপত্তা, গোপনীয়তা ও পারিবারিক আস্থার ক্ষেত্রে আমরা কোনো আপস করি না।'
              : 'Built with uncompromising standards for security, verification, and family dignity.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reasons.map((r, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800 p-6 sm:p-7 rounded-3xl backdrop-blur-md flex items-start gap-4 hover:border-rose-700/60 transition"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800">
                {r.icon}
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-base sm:text-lg text-white font-serif">
                  {lang === 'bn' ? r.titleBn : r.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {lang === 'bn' ? r.descBn : r.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
