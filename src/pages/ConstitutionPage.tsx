import React from 'react';
import { useTranslation } from '../locales/i18nContext';
import { 
  Scale, Shield, FileText, BookOpen, CheckCircle2, 
  Clock, Download, ArrowLeft, Landmark, Award, 
  HelpCircle, ChevronRight, AlertCircle, Building2,
  Users, Layers, Sparkles
} from 'lucide-react';

interface ConstitutionPageProps {
  onNavigate?: (view: string) => void;
}

export const ConstitutionPage: React.FC<ConstitutionPageProps> = ({ onNavigate }) => {
  const { isBn } = useTranslation();

  const futureSections = [
    {
      id: "sec_1",
      number: "অধ্যায় ১",
      title: "সংগঠনের নাম, পরিচিতি ও মূল দর্শন",
      desc: "ট্রাস্টের আনুষ্ঠানিক নাম, কার্যক্ষেত্র, প্রতীক, প্রত্যয়ন ও প্রতিষ্ঠাকালীন মূল লক্ষ্য।"
    },
    {
      id: "sec_2",
      number: "অধ্যায় ২",
      title: "সদস্যপদ, অধিকার ও সাংগঠনিক শৃঙ্খলা",
      desc: "সাধারণ সদস্য, আজীবন সদস্য, দাতা ও স্বেচ্ছাসেবকদের যোগ্যতা, অধিকার ও আচরণবিধি।"
    },
    {
      id: "sec_3",
      number: "অধ্যায় ৩",
      title: "পরিচালনা পর্ষদ ও শাখা কমিটি গঠন",
      desc: "কেন্দ্রীয় নির্বাহী পরিষদ, উপদেষ্টা কমিটি এবং জেলা-উপজেলা শাখা পরিচালনা কাঠামো।"
    },
    {
      id: "sec_4",
      number: "অধ্যায় ৪",
      title: "আর্থিক তহবিল ব্যবস্থাপনা ও অডিট নীতি",
      desc: "দান, যাকাত, সমবায় সঞ্চয় ও প্রকল্প তহবিলের হিসাব সংরক্ষণ, ব্যাংকিং এবং বার্ষিক অডিট।"
    },
    {
      id: "sec_5",
      number: "অধ্যায় ৫",
      title: "গঠনতন্ত্র সংশোধন ও জরুরি বিধানাবলী",
      desc: "সাংগঠনিক আইনের ধারা সংযোজন, বিয়োজন ও ট্রাস্টের বিশেষ সভার নীতিমালা।"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Breadcrumb & Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <button 
            onClick={() => onNavigate?.('home')} 
            className="hover:text-emerald-700 transition flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isBn ? 'হোম পেজে ফিরুন' : 'Back to Home'}</span>
          </button>
          <span>/</span>
          <span className="text-slate-800 font-bold">{isBn ? 'সাংগঠনিক আইন' : 'Organizational Law'}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            {isBn ? 'অফিসিয়াল পলিসি' : 'Official Policy'}
          </span>
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-700/60">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-8 translate-y-8">
          <Scale className="w-72 h-72 text-emerald-300" />
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black px-3.5 py-1 rounded-full">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>{isBn ? 'এসকাডো ট্রাস্ট গঠনতন্ত্র ও বিধিমালিকা' : 'ASCAHDO Constitution & By-Laws'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {isBn ? 'সাংগঠনিক আইন ও পরিচালনা বিধিমালা' : 'Organizational Law & Constitution'}
          </h1>
          
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {isBn 
              ? 'এসকাডো সমন্বিত মাল্টি-এনজিও ওয়েলফেয়ার ট্রাস্টের সার্বিক কার্যক্রম, সুশাসন ও সাংগঠনিক শৃঙ্খলার নীতিমালা।' 
              : 'Official guidelines, code of conduct, and legal framework governing ASCAHDO Trust.'}
          </p>
        </div>
      </div>

      {/* Primary 2-Line Notice Card (As Requested) */}
      <div className="bg-white rounded-3xl border-2 border-emerald-500/30 shadow-md p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs">
            <FileText className="w-6 h-6 text-emerald-700" />
          </div>
          
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                {isBn ? 'শীঘ্রই বিস্তারিত প্রকাশ করা হবে' : 'Full Details Publishing Soon'}
              </span>
              <span className="text-slate-400 text-xs font-semibold">
                আইনি খসড়া সংস্করণ ১.০
              </span>
            </div>

            {/* Exactly 2 lines of prominent text as requested */}
            <div className="space-y-3 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 text-slate-800 leading-relaxed">
              <p className="text-sm sm:text-base font-bold text-slate-900">
                {isBn 
                  ? '১. এসকাডো সমন্বিত মাল্টি-এনজিও ওয়েলফেয়ার ট্রাস্টের সার্বিক পরিচালনা, শৃঙ্খলারক্ষা ও মানবিক কার্যবিধি পরিচালনার জন্য প্রণীত আনুষ্ঠানিক গঠনতন্ত্র ও সাংগঠনিক আইনের বিস্তারিত ধারা খুব শীঘ্রই এখানে সংযোজিত করা হবে।' 
                  : '1. The full articles of the official constitution and organizational laws governing the administration and community programs of ASCAHDO Multi-NGO Welfare Trust will be published here very soon.'}
              </p>
              <p className="text-sm sm:text-base font-bold text-slate-700">
                {isBn 
                  ? '২. বর্তমানে ট্রাস্টের কার্যনির্বাহী পরিষদ ও লিগ্যাল অ্যাডভাইজরি কমিটির তত্ত্বাবধানে সাংগঠনিক বিধিমালার চূড়ান্ত নথিপত্র প্রস্তুত ও প্রশাসনিক পর্যালোচনায় রয়েছে।' 
                  : '2. The comprehensive by-laws and constitutional clauses are currently undergoing final administrative review by the Executive Committee and Legal Advisory Board.'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Trust Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold block text-[10px]">প্রতিষ্ঠানের ধরন:</span>
            <strong className="text-slate-800 flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-emerald-600 shrink-0" />
              সমন্বিত মাল্টি-এনজিও ট্রাস্ট
            </strong>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold block text-[10px]">নিবন্ধন রেফারেন্স:</span>
            <strong className="text-slate-800 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              GOV-REG/TRUST/2026/8942-NKH
            </strong>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold block text-[10px]">কার্যপরিধি ও অধিক্ষেত্র:</span>
            <strong className="text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
              সমগ্র বাংলাদেশ ও সকল জেলা
            </strong>
          </div>
        </div>
      </div>

      {/* Structure Preview for Future Content Expansion */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="font-black text-slate-900 text-sm sm:text-base">
              {isBn ? 'গঠনতন্ত্রের ভবিষ্যৎ সূচিপত্র ও ধারা রূপরেখা' : 'Constitution Outline & Chapters Preview'}
            </h3>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-lg">
            ৫টি মূল অধ্যায়
          </span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          {isBn 
            ? 'পরবর্তীতে এই পাতায় নিম্নলিখিত অধ্যায়গুলোর অধীনে পূর্ণাঙ্গ আইনি ধারা, উপধারা ও নীতিমালা সরাসরি পড়া ও পিডিএফ ফরম্যাটে সংগ্রহ করা যাবে:'
            : 'Upon final approval, full legal clauses and regulations will be published and available for download under the following chapters:'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {futureSections.map((sec) => (
            <div 
              key={sec.id} 
              className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/40 border border-slate-200/70 hover:border-emerald-200 transition space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider bg-emerald-100/80 px-2 py-0.5 rounded-md">
                  {sec.number}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">খসড়া পর্যায়</span>
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                {sec.title}
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {sec.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Help & Contact Banner */}
      <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-slate-700">
            {isBn 
              ? 'গঠনতন্ত্র ও সাংগঠনিক আইন সংক্রান্ত যেকোনো তথ্যের জন্য আমাদের কেন্দ্রীয় হেল্পলাইন বা ইমেইলে যোগাযোগ করতে পারেন।'
              : 'For inquiries regarding constitutional rules or by-laws, please contact our central helpline.'}
          </span>
        </div>
        <button 
          onClick={() => onNavigate?.('contact')}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl shrink-0 transition"
        >
          {isBn ? 'যোগাযোগ করুন' : 'Contact Support'}
        </button>
      </div>

    </div>
  );
};
