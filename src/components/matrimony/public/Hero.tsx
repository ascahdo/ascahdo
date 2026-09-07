import React from 'react';
import {
  Heart,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Users,
  Search,
  ArrowRight,
  PhoneCall,
  Lock,
  Globe
} from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { QuickSearchWidget } from './QuickSearchWidget';

interface HeroProps {
  onSearchSubmit: () => void;
  onOpenAdvancedSearch: () => void;
  onOpenRegister: () => void;
  onViewBrides: () => void;
  onViewGrooms: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSearchSubmit,
  onOpenAdvancedSearch,
  onOpenRegister,
  onViewBrides,
  onViewGrooms,
}) => {
  const { lang, t } = useMatrimonyLanguage();

  return (
    <section className="relative bg-gradient-to-b from-rose-50/70 via-white to-rose-50/30 pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-24 left-10 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Hero Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-rose-900 text-xs font-semibold shadow-2xs animate-in fade-in">
            <ShieldCheck className="w-4 h-4 text-rose-700" />
            <span>
              {lang === 'bn'
                ? 'বাংলাদেশের নির্ভরযোগ্য এনআইডি-যাচাইকৃত দ্বীনি ম্যারেজ মিডিয়া'
                : '100% NID Verified Matrimony Platform for Bangladesh'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-950 font-serif tracking-tight leading-[1.15]">
            {lang === 'bn' ? (
              <>
                পারিবারিক মর্যাদায় খুঁজুন আপনার <br />
                <span className="bg-gradient-to-r from-rose-700 via-rose-800 to-rose-950 bg-clip-text text-transparent">
                  উপযুক্ত দ্বীনি জীবনসঙ্গী
                </span>
              </>
            ) : (
              <>
                Find Your Right Life Partner <br />
                <span className="bg-gradient-to-r from-rose-700 via-rose-800 to-rose-950 bg-clip-text text-transparent">
                  With Dignity & Trust
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {lang === 'bn'
              ? 'ডাক্তার, ইঞ্জিনিয়ার, বিসিএস ক্যাডার, শিক্ষক, ব্যবসায়ী ও সম্মানিত প্রবাসী পরিবারের পাত্র-পাত্রীর শতভাগ গোপনীয় ও যাচাইকৃত বায়োডাটা সন্ধান।'
              : 'Browse verified biodatas of Doctors, Engineers, BCS Officers, Teachers, Business Owners, and Expatriate families with complete privacy control.'}
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenRegister}
              className="px-6 py-3 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-sm shadow-md shadow-rose-700/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{lang === 'bn' ? 'ফ্রি বায়োডাটা তৈরি করুন' : 'Create Free Biodata'}</span>
            </button>

            <button
              onClick={onViewBrides}
              className="px-5 py-3 rounded-2xl bg-white hover:bg-rose-50 text-rose-900 border border-rose-200 font-semibold text-sm shadow-xs transition flex items-center gap-1.5"
            >
              <span>🧕</span>
              <span>{lang === 'bn' ? 'পাত্রী খুঁজুন' : 'Find Bride'}</span>
            </button>

            <button
              onClick={onViewGrooms}
              className="px-5 py-3 rounded-2xl bg-white hover:bg-rose-50 text-rose-900 border border-rose-200 font-semibold text-sm shadow-xs transition flex items-center gap-1.5"
            >
              <span>👳</span>
              <span>{lang === 'bn' ? 'পাত্র খুঁজুন' : 'Find Groom'}</span>
            </button>
          </div>
        </div>

        {/* Embedded Quick Search Form */}
        <div className="max-w-4xl mx-auto mb-12">
          <QuickSearchWidget
            onSearchSubmit={onSearchSubmit}
            onOpenAdvancedSearch={onOpenAdvancedSearch}
          />
        </div>

        {/* Stats Metrics 4-Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-rose-100 shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 font-serif">১,৫০০+</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">
              {lang === 'bn' ? 'ভেরিফাইড পাত্র-পাত্রী' : 'Verified Profiles'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {lang === 'bn' ? 'এনআইডি ও পরিবার যাচাইকৃত' : 'Strict verification'}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-rose-100 shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 font-serif">৭৫০+</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">
              {lang === 'bn' ? 'সফল শুভ বিবাহ' : 'Successful Marriages'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {lang === 'bn' ? 'সুখী দাম্পত্য জীবন' : 'Happy couples'}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-rose-100 shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 font-serif">৬৪</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">
              {lang === 'bn' ? 'জেলায় সক্রিয় নেটওয়ার্ক' : 'Districts Covered'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {lang === 'bn' ? 'বাংলাদেশ ও আন্তর্জাতিক' : 'Local & diaspora'}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-rose-100 shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 font-serif">১০০%</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">
              {lang === 'bn' ? 'গোপনীয়তা সুরক্ষা' : 'Privacy Protection'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {lang === 'bn' ? 'অভিভাবক অনুমতি ছাড়া তথ্য নয়' : 'Direct guardian consent'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
