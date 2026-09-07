import React from 'react';
import { UserPlus, Search, HeartHandshake, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';

export const HowItWorks: React.FC = () => {
  const { lang } = useMatrimonyLanguage();

  const steps = [
    {
      icon: <UserPlus className="w-7 h-7 text-rose-700" />,
      stepBn: 'ধাপ ০১',
      stepEn: 'Step 01',
      titleBn: 'ফ্রি বায়োডাটা তৈরি করুন',
      titleEn: 'Create Free Biodata',
      descBn: 'ব্যক্তিগত, শিক্ষাগত, পারিবারিক ও দ্বীনি তথ্য দিয়ে মাত্র ৫ মিনিটে সম্পূর্ণ ফ্রি বায়োডাটা প্রকাশ করুন।',
      descEn: 'Register with personal, academic, family, and religious background in simple steps.',
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-emerald-600" />,
      stepBn: 'ধাপ ০২',
      stepEn: 'Step 02',
      titleBn: 'এনআইডি ও তথ্য যাচাই',
      titleEn: 'Verification & Screening',
      descBn: 'আমাদের মডারেশন টিম প্রতিটি তথ্য ও জাতীয় পরিচয়পত্র যাচাই করে ব্লু ভেরিফাইড সিল প্রদান করে।',
      descEn: 'Our background verification team screens NID and family credentials for authenticity.',
    },
    {
      icon: <Search className="w-7 h-7 text-blue-600" />,
      stepBn: 'ধাপ ০৩',
      stepEn: 'Step 03',
      titleBn: 'পছন্দের বায়োডাটা খুঁজুন',
      titleEn: 'Find Matching Profiles',
      descBn: 'বয়স, জেলা, পেশা, ধর্ম ও শিক্ষাগত যোগ্যতা অনুযায়ী ফিল্টার করে আপনার আদর্শ জীবনসঙ্গী খুঁজে নিন।',
      descEn: 'Use advanced filtering by district, profession, education, and values to find your match.',
    },
    {
      icon: <HeartHandshake className="w-7 h-7 text-pink-600" />,
      stepBn: 'ধাপ ০৪',
      stepEn: 'Step 04',
      titleBn: 'অভিভাবকের সরাসরি যোগাযোগ',
      titleEn: 'Direct Guardian Connect',
      descBn: 'উভয় পরিবারের সম্মতিক্রমে সরাসরি কথা বলুন এবং বরকতময় বিবাহের শুভ সূচনা করুন।',
      descEn: 'Exchange guardian contact numbers with mutual consent and arrange family meetings.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/80 text-rose-900 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-rose-700" />
            <span>{lang === 'bn' ? 'কার্যপদ্ধতি' : 'How It Works'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            {lang === 'bn' ? 'মাত্র ৪টি সহজ ধাপে জীবনসঙ্গী খুঁজুন' : 'Find Your Soulmate in 4 Simple Steps'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {lang === 'bn'
              ? 'নিরাপদ, মার্জিত এবং সুন্নাহভিত্তিক ইসলামিক নিয়মে উপযুক্ত পাত্র-পাত্রী খোঁজার ডিজিটাল প্ল্যাটফর্ম।'
              : 'Our streamlined matchmaking process ensures highest privacy, authenticity, and family dignity.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative bg-slate-50 hover:bg-rose-50/40 p-6 sm:p-7 rounded-3xl border border-slate-200/80 hover:border-rose-200 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <span className="font-mono text-xs font-bold text-rose-700 bg-rose-100/70 px-2.5 py-1 rounded-full">
                    {lang === 'bn' ? step.stepBn : step.stepEn}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-2 font-serif">
                    {lang === 'bn' ? step.titleBn : step.titleEn}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {lang === 'bn' ? step.descBn : step.descEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
