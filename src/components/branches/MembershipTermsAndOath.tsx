import React from 'react';
import { ShieldCheck, ScrollText, CheckSquare, Square, AlertCircle, FileCheck, CheckCircle2 } from 'lucide-react';

interface MembershipTermsAndOathProps {
  isBn?: boolean;
  agreedTerms: boolean;
  onToggleTerms: (val: boolean) => void;
  agreedOath: boolean;
  onToggleOath: (val: boolean) => void;
  applicantName?: string;
  applicantDesignation?: string;
}

export const MembershipTermsAndOath: React.FC<MembershipTermsAndOathProps> = ({
  isBn = true,
  agreedTerms,
  onToggleTerms,
  agreedOath,
  onToggleOath,
  applicantName = '',
  applicantDesignation = ''
}) => {
  const currentDate = new Date().toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-4">
      {/* 1. Organizational Terms & Code of Conduct */}
      <div className="bg-gradient-to-br from-slate-50 to-emerald-50/40 rounded-2xl border border-emerald-200/80 p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2 text-emerald-900 border-b border-emerald-200/60 pb-2.5">
          <ScrollText className="w-5 h-5 text-emerald-700 shrink-0" />
          <div>
            <h4 className="font-black text-sm sm:text-base">
              {isBn ? 'সাংগঠনিক নিয়মাবলী ও সদস্যপদের শর্তসমূহ' : 'Organizational Rules & Membership Terms'}
            </h4>
            <p className="text-[11px] text-slate-600 font-medium">
              {isBn
                ? 'এসকাডো কেন্দ্রীয় মানবকল্যাণ ট্রাস্টের গঠনতন্ত্র অনুযায়ী সদস্যপদের আবশ্যিক অনুশাসন'
                : 'Mandatory code of conduct according to the ASCAHDO Constitution'}
            </p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed pr-1 max-h-48 overflow-y-auto custom-scrollbar">
          <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-200/70">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
              ১
            </span>
            <div>
              <strong className="text-slate-900 font-bold block mb-0.5">
                {isBn ? 'গঠনতন্ত্র ও সাংগঠনিক শৃঙ্খলার প্রতি আনুগত্য:' : 'Constitutional Allegiance:'}
              </strong>
              {isBn
                ? 'সংগঠনের মূল গঠনতন্ত্র, নীতি-আদর্শ ও কেন্দ্রীয় কার্যনির্বাহী পর্ষদের সকল দিকনির্দেশনা ও সিদ্ধান্ত নিষ্ঠার সাথে মানিয়া চলিতে হইবে।'
                : 'Must strictly adhere to the constitution, values, and central executive committee directives.'}
            </div>
          </div>

          <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-200/70">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
              ২
            </span>
            <div>
              <strong className="text-slate-900 font-bold block mb-0.5">
                {isBn ? 'নিঃস্বার্থ মানবসেবা ও সামাজিক দায়বদ্ধতা:' : 'Humanitarian Dedication:'}
              </strong>
              {isBn
                ? 'আর্তপীড়িত মানুষের কল্যাণ, দুর্যোগ ব্যবস্থাপনা, রক্তদান, দারিদ্র্য বিমোচন ও সমাজকল্যাণমূলক কার্যক্রমে নিঃস্বার্থভাবে সক্রিয় ভূমিকা পালন করিতে হইবে।'
                : 'Must actively and selflessly participate in humanitarian relief, poverty alleviation, and welfare activities.'}
            </div>
          </div>

          <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-200/70">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
              ৩
            </span>
            <div>
              <strong className="text-slate-900 font-bold block mb-0.5">
                {isBn ? 'আর্থিক স্বচ্ছতা ও চাঁদা/ডোনেশন নিয়মিতকরণ:' : 'Financial Transparency:'}
              </strong>
              {isBn
                ? 'সংগঠনের নির্ধারিত সদস্য ভর্তি ফি/ডোনেশন ও নিয়মিত চাঁদা সময়মত পরিশোধ করিতে হইবে। সংগঠনের কোনো সম্পদ বা নামের ব্যক্তিগত অপব্যবহার সম্পূর্ণ নিষিদ্ধ।'
                : 'Must fulfill membership donation fees promptly. Personal misuse of organization name or assets is strictly forbidden.'}
            </div>
          </div>

          <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-200/70">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
              ৪
            </span>
            <div>
              <strong className="text-slate-900 font-bold block mb-0.5">
                {isBn ? 'অরাজনৈতিক ও আইনসম্মত আচরণ:' : 'Non-Political & Legal Integrity:'}
              </strong>
              {isBn
                ? 'ধর্ম, বর্ণ ও রাজনৈতিক মতাদর্শের ঊর্ধ্বে উঠিয়া সার্বজনীন মানবকল্যাণে কাজ করিতে হইবে। কোনো রাষ্ট্রবিরোধী বা সমাজবিরোধী কার্যকলাপে যুক্ত থাকা যাইবে না।'
                : 'Must operate non-politically for universal humanitarian service and strictly refrain from unlawful activities.'}
            </div>
          </div>

          <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-200/70">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
              ৫
            </span>
            <div>
              <strong className="text-slate-900 font-bold block mb-0.5">
                {isBn ? 'তথ্য ও দলিলের সত্যতা:' : 'Authenticity of Information:'}
              </strong>
              {isBn
                ? 'আবেদনপত্রে প্রদত্ত যাবতীয় ব্যক্তিগত তথ্য, জাতীয় পরিচয়পত্র (NID) ও ছবি সত্য এবং সঠিক বলিয়া গণ্য হইবে। অসত্য তথ্য প্রমাণিত হইলে সদস্যপদ তাৎক্ষণিক বাতিলযোগ্য।'
                : 'All provided personal details and NID documents must be authentic. False information will cause immediate cancellation.'}
            </div>
          </div>
        </div>

        {/* Terms Agreement Checkbox */}
        <label
          onClick={() => onToggleTerms(!agreedTerms)}
          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${
            agreedTerms
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
              : 'bg-white text-slate-800 border-slate-300 hover:border-emerald-500'
          }`}
        >
          <div className="shrink-0">
            {agreedTerms ? (
              <CheckSquare className="w-5 h-5 text-white" />
            ) : (
              <Square className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <span className="text-xs font-bold leading-tight">
            {isBn
              ? 'আমি এসকাডো-র গঠনতান্ত্রিক শর্তাবলী ও সাংগঠনিক নিয়মাবলী সম্পূর্ণ মনোযোগ দিয়ে পড়েছি এবং তা অক্ষরে অক্ষরে মেনে চলতে একমত।'
              : 'I have read the constitution & organizational code of conduct and agree to abide by them.'}
          </span>
        </label>
      </div>

      {/* 2. Sacred Oath / Solemn Declaration */}
      <div className="bg-gradient-to-br from-amber-50/70 via-white to-emerald-50/50 rounded-2xl border border-amber-300/80 p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-950 border-b border-amber-200/70 pb-2.5">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
          <div>
            <h4 className="font-black text-sm sm:text-base">
              {isBn ? 'পবিত্র অঙ্গীকারনামা ও নিষ্ঠার শপথপত্র' : 'Solemn Declaration & Oath of Loyalty'}
            </h4>
            <p className="text-[11px] text-amber-800 font-medium">
              {isBn ? 'সদস্যের ব্যক্তিগত আত্মশুদ্ধি ও অঙ্গীকারমূলক বিবৃতি' : 'Personal declaration and solemn pledge'}
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 text-xs sm:text-sm text-slate-800 leading-relaxed italic relative">
          <span className="text-3xl text-amber-300 font-serif absolute top-1 left-2 select-none">“</span>
          <p className="pl-4 pr-2 font-serif text-slate-800">
            {isBn
              ? '“আমি শপথ করিতেছি যে, পরম করুণাময় মহান সৃষ্টিকর্তার নামে এসকাডো কেন্দ্রীয় মানবকল্যাণ ট্রাস্টের সদস্য হিসেবে সততা, ন্যায়পরায়ণতা ও সর্বোচ্চ নিষ্ঠার সাথে আমার উপর অর্পিত সকল সাংগঠনিক ও মানবিক দায়িত্ব পালন করিব। আমি সর্বদা অসহায় মানুষের পাশে থাকিব এবং সংগঠনের গৌরব ও সুনাম রক্ষায় আত্মনিয়োগ করিব।”'
              : '“I solemnly pledge in the name of the Almighty to faithfully, honestly, and diligently perform all duties as a member of ASCAHDO Welfare Trust, dedicated to human welfare and organizational integrity.”'}
          </p>
        </div>

        {/* Digital Signature & Oath Acceptance */}
        <div className="space-y-2 pt-1">
          <label
            onClick={() => onToggleOath(!agreedOath)}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${
              agreedOath
                ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                : 'bg-white text-slate-800 border-amber-300 hover:border-amber-500'
            }`}
          >
            <div className="shrink-0">
              {agreedOath ? (
                <CheckSquare className="w-5 h-5 text-white" />
              ) : (
                <Square className="w-5 h-5 text-amber-500" />
              )}
            </div>
            <span className="text-xs font-bold leading-tight">
              {isBn
                ? 'আমি সজ্ঞানে, সুস্থ মস্তিষ্কে এবং স্বেচ্ছায় এই পবিত্র অঙ্গীকারনামায় সম্মতি জ্ঞাপন ও ডিজিটাল স্বাক্ষর প্রদান করছি।'
                : 'I solemnly take this pledge and affirm my digital signature.'}
            </span>
          </label>

          {/* Digital Signature Footer Stamp */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] bg-slate-100/80 px-3 py-2 rounded-xl text-slate-600 border border-slate-200">
            <div>
              <span className="font-semibold text-slate-500">{isBn ? 'আবেদনকারী: ' : 'Applicant: '}</span>
              <span className="font-bold text-slate-900">{applicantName || (isBn ? 'আবেদনকারী সদস্য' : 'Applicant Member')}</span>
              {applicantDesignation && (
                <span className="text-emerald-700 font-bold ml-1.5">({applicantDesignation})</span>
              )}
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-1 sm:mt-0 flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isBn ? `ডিজিটাল ভেরিফিকেশন তারিখ: ${currentDate}` : `Verified: ${currentDate}`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
