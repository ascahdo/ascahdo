import React, { useState } from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  Heart,
  Droplet,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Info
} from 'lucide-react';

const COMPATIBILITY_DATA: Record<string, { giveTo: string[]; receiveFrom: string[]; rareFactBn: string }> = {
  'O-': {
    giveTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    receiveFrom: ['O-'],
    rareFactBn: 'সার্বজনীন দাতা (Universal Donor) — আপনার রক্ত পৃথিবীর যে কোনো মানুষকে দেওয়া সম্ভব!'
  },
  'O+': {
    giveTo: ['O+', 'A+', 'B+', 'AB+'],
    receiveFrom: ['O+', 'O-'],
    rareFactBn: 'সবচেয়ে বেশি চাহিদাসম্পন্ন গ্রুপ — প্রায় ৩৮% মানুষের রক্তের গ্রুপ O+'
  },
  'A-': {
    giveTo: ['A-', 'A+', 'AB-', 'AB+'],
    receiveFrom: ['A-', 'O-'],
    rareFactBn: 'বিরল নেগেটিভ গ্রুপ — বাংলাদেশে শতকরা প্রায় ১.৫% মানুষের রক্তের গ্রুপ A-'
  },
  'A+': {
    giveTo: ['A+', 'AB+'],
    receiveFrom: ['A+', 'A-', 'O+', 'O-'],
    rareFactBn: 'বাংলাদেশে দ্বিতীয় সর্বাধিক প্রচলিত ব্লাড গ্রুপ (প্রায় ২৭%)'
  },
  'B-': {
    giveTo: ['B-', 'B+', 'AB-', 'AB+'],
    receiveFrom: ['B-', 'O-'],
    rareFactBn: 'অত্যন্ত গুরুত্বপূর্ণ জরুরি গ্রুপ — নিয়মিত রক্তদানে জীবন বাঁচান'
  },
  'B+': {
    giveTo: ['B+', 'AB+'],
    receiveFrom: ['B+', 'B-', 'O+', 'O-'],
    rareFactBn: 'বাংলাদেশে অন্যতম জনপ্রিয় রক্তের গ্রুপ (প্রায় ৩৩%)'
  },
  'AB-': {
    giveTo: ['AB-', 'AB+'],
    receiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    rareFactBn: 'সবচেয়ে বিরল রক্তের গ্রুপগুলোর একটি (১% এর কম)'
  },
  'AB+': {
    giveTo: ['AB+'],
    receiveFrom: ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
    rareFactBn: 'সার্বজনীন গ্রহীতা (Universal Recipient) — আপনি যে কোনো গ্রুপের রক্ত গ্রহণ করতে পারবেন'
  }
};

export const BloodCompatibilityMatrix: React.FC = () => {
  const { isBn } = useTranslation();
  const [selectedGroup, setSelectedGroup] = useState<string>('O+');
  const [lastDonationDate, setLastDonationDate] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const currentComp = COMPATIBILITY_DATA[selectedGroup] || COMPATIBILITY_DATA['O+'];

  // Calculate Next Eligibility
  let eligibilityResult = null;
  if (lastDonationDate) {
    const lastDate = new Date(lastDonationDate);
    const requiredDays = gender === 'male' ? 90 : 120; // 3 months for men, 4 months for women
    const nextEligibleDate = new Date(lastDate);
    nextEligibleDate.setDate(nextEligibleDate.getDate() + requiredDays);

    const today = new Date();
    const diffTime = nextEligibleDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    eligibilityResult = {
      nextDate: nextEligibleDate.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
      isEligible: diffDays <= 0,
      daysRemaining: diffDays > 0 ? diffDays : 0
    };
  }

  return (
    <section id="compatibility-matrix" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-800 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>{isBn ? 'রক্তের সামঞ্জস্য ও ক্যালকুলেটর' : 'Compatibility & Health Calculator'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isBn ? 'রক্তদাতা ও গ্রহীতার সামঞ্জস্য ও পরবর্তী রক্তদানের তারিখ' : 'Blood Compatibility & Eligibility Tools'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {isBn
              ? 'আপনার রক্তের গ্রুপ সিলেক্ট করে জেনে নিন আপনি কাদের রক্ত দিতে ও কাদের থেকে রক্ত নিতে পারবেন এবং পরবর্তী রক্তদানের যোগ্যতা যাচাই করুন।'
              : 'Select your blood type to see who you can donate to and receive from, plus calculate your next donation date.'}
          </p>
        </div>

        {/* 2-Column Grid: Left (Interactive Matrix) + Right (Next Date Calculator) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Compatibility Matrix Tool (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                {isBn ? 'আপনার রক্তের গ্রুপ নির্বাচন করুন:' : 'Select Your Blood Group:'}
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {Object.keys(COMPATIBILITY_DATA).map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setSelectedGroup(bg)}
                    className={`py-3 rounded-2xl font-black text-sm transition cursor-pointer flex flex-col items-center justify-center ${
                      selectedGroup === bg
                        ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-400'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200'
                    }`}
                  >
                    <span>{bg}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fact ribbon */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-rose-900 font-bold">
              <Info className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{currentComp.rareFactBn}</span>
            </div>

            {/* Give & Receive Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Can Give Blood To */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? `${selectedGroup} রক্ত দিতে পারবে:` : 'Can Give Blood To:'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(currentComp?.giveTo || []).map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-black text-xs border border-emerald-300 shadow-2xs"
                    >
                      {g}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 font-medium pt-1">
                  {isBn ? `মোট ${currentComp?.giveTo?.length || 0}টি গ্রুপের রোগীদের দেওয়া যাবে` : `Compatible with ${currentComp?.giveTo?.length || 0} groups`}
                </p>
              </div>

              {/* Can Receive Blood From */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-indigo-800">
                  <Droplet className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                  <span>{isBn ? `${selectedGroup} রক্ত নিতে পারবে:` : 'Can Receive Blood From:'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(currentComp?.receiveFrom || []).map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1.5 rounded-xl bg-indigo-100 text-indigo-900 font-black text-xs border border-indigo-300 shadow-2xs"
                    >
                      {g}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 font-medium pt-1">
                  {isBn ? `মোট ${currentComp.receiveFrom.length}টি গ্রুপ থেকে গ্রহণ করা যাবে` : `Accepts from ${currentComp.receiveFrom.length} groups`}
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT: Next Donation Date & Health Calculator (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
            
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-black">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  {isBn ? 'পরবর্তী রক্তদানের যোগ্যতা ক্যালকুলেটর' : 'Eligibility Date Calculator'}
                </h3>
                <p className="text-[11px] text-slate-500 font-bold">
                  {isBn ? 'আপনার শেষ রক্তদানের তারিখ দিন' : 'Enter Last Donation Date'}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBn ? 'লিঙ্গ' : 'Gender'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2 rounded-xl font-bold border transition ${
                      gender === 'male' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isBn ? 'পুরুষ (প্রতি ৩ মাস পর)' : 'Male (Every 3 Mo)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2 rounded-xl font-bold border transition ${
                      gender === 'female' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isBn ? 'নারী (প্রতি ৪ মাস পর)' : 'Female (Every 4 Mo)'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBn ? 'সর্বশেষ রক্তদানের তারিখ' : 'Last Donation Date'} *
                </label>
                <input
                  type="date"
                  value={lastDonationDate}
                  onChange={(e) => setLastDonationDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>
            </div>

            {/* Calculated Result Card */}
            {eligibilityResult ? (
              <div
                className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in ${
                  eligibilityResult.isEligible
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-sm">
                  {eligibilityResult.isEligible ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>{isBn ? 'অভিনন্দন! আপনি এখন রক্তদানের জন্য প্রস্তুত।' : 'Eligible to donate today!'}</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-5 h-5 text-amber-600" />
                      <span>
                        {isBn
                          ? `রক্তদানের জন্য আরও ${eligibilityResult.daysRemaining} দিন অপেক্ষা করতে হবে`
                          : `${eligibilityResult.daysRemaining} days remaining`}
                      </span>
                    </>
                  )}
                </div>

                <p className="text-[11px] font-medium leading-relaxed">
                  {isBn
                    ? `আপনার পরবর্তী নিরাপদ রক্তদানের সম্ভাব্য তারিখ: ${eligibilityResult.nextDate}`
                    : `Next eligible date: ${eligibilityResult.nextDate}`}
                </p>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                {isBn ? 'তারিখ নির্বাচন করলে স্বয়ংক্রিয়ভাবে হিসাব দেখতে পাবেন।' : 'Select date to view calculated eligibility status.'}
              </div>
            )}

            {/* Medical Checklist mini bullet */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
              <strong className="text-slate-700 block font-bold">{isBn ? 'প্রাথমিক স্বাস্থ্য শর্তাবলী:' : 'Health Checklist:'}</strong>
              <p>✓ ওজন ন্যূনতম ৫০ কেজি হতে হবে</p>
              <p>✓ রক্তচাপ ও পালস স্বাভাবিক থাকতে হবে</p>
              <p>✓ গত ৪৮ ঘণ্টায় কোনো অ্যান্টিবায়োটিক গ্রহণ করেননি</p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
