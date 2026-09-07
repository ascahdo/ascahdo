import React, { useState } from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  CheckCircle2, AlertCircle, HelpCircle, Heart, Activity,
  Scale, Calendar, ShieldCheck, ArrowRight, RotateCcw
} from 'lucide-react';

interface BloodEligibilityQuizProps {
  onEligible: () => void;
}

export const BloodEligibilityQuiz: React.FC<BloodEligibilityQuizProps> = ({ onEligible }) => {
  const { isBn } = useTranslation();

  const [age, setAge] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [monthsSinceLast, setMonthsSinceLast] = useState<string>('never');
  const [hasFeverCold, setHasFeverCold] = useState<string>('no');
  const [hasChronicDisease, setHasChronicDisease] = useState<string>('no');
  const [hasTattooSurgery, setHasTattooSurgery] = useState<string>('no');
  const [isCalculated, setIsCalculated] = useState(false);

  const checkEligibility = () => {
    setIsCalculated(true);
  };

  const handleReset = () => {
    setAge('');
    setWeight('');
    setMonthsSinceLast('never');
    setHasFeverCold('no');
    setHasChronicDisease('no');
    setHasTattooSurgery('no');
    setIsCalculated(false);
  };

  const numAge = Number(age);
  const numWeight = Number(weight);

  const isAgeValid = numAge >= 18 && numAge <= 60;
  const isWeightValid = numWeight >= 45;
  const isIntervalValid = monthsSinceLast === 'never' || monthsSinceLast === 'more_than_3';
  const isHealthy = hasFeverCold === 'no' && hasChronicDisease === 'no' && hasTattooSurgery === 'no';

  const isFullyEligible = isAgeValid && isWeightValid && isIntervalValid && isHealthy;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-900/40 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Heart className="w-3 h-3 fill-rose-400" />
                <span>{isBn ? '১ মিনিটে যোগ্যতা যাচাই' : '1-Min Eligibility Check'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {isBn ? 'আমি কি রক্তদান করতে পারব?' : 'Am I Eligible to Donate Blood?'}
              </h3>
            </div>
          </div>

          {isCalculated && (
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isBn ? 'পুনরায় যাচাই করুন' : 'Reset Check'}</span>
            </button>
          )}
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
          
          {/* Age */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-400" />
              <span>{isBn ? '১. আপনার বয়স (বছর)' : '1. Your Age (Years)'}</span>
            </label>
            <input
              type="number"
              min="10"
              max="100"
              placeholder={isBn ? 'যেমন: ২৪' : 'e.g. 24'}
              value={age}
              onChange={(e) => {
                setAge(e.target.value ? Number(e.target.value) : '');
                setIsCalculated(false);
              }}
              className="w-full px-3.5 py-2 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500"
            />
            <p className="text-[10px] text-slate-400">{isBn ? '১৮ থেকে ৬০ বছরের মধ্যে হতে হবে' : 'Must be 18 to 60 years'}</p>
          </div>

          {/* Weight */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>{isBn ? '২. আপনার ওজন (কেজি)' : '2. Your Weight (Kg)'}</span>
            </label>
            <input
              type="number"
              min="20"
              max="200"
              placeholder={isBn ? 'যেমন: ৫৫' : 'e.g. 55'}
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value ? Number(e.target.value) : '');
                setIsCalculated(false);
              }}
              className="w-full px-3.5 py-2 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500"
            />
            <p className="text-[10px] text-slate-400">{isBn ? 'কমপক্ষে ৪৫ কেজি হতে হবে' : 'Minimum 45 kg required'}</p>
          </div>

          {/* Last Donation */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>{isBn ? '৩. সর্বশেষ রক্তদান করেছেন কবে?' : '3. Last Blood Donation?'}</span>
            </label>
            <select
              value={monthsSinceLast}
              onChange={(e) => {
                setMonthsSinceLast(e.target.value);
                setIsCalculated(false);
              }}
              className="w-full px-3.5 py-2 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500"
            >
              <option value="never" className="bg-slate-900">{isBn ? 'কখনও দিইনি (First Time)' : 'Never Donated'}</option>
              <option value="more_than_3" className="bg-slate-900">{isBn ? '৩ মাসের বেশি আগে (> 90 Days)' : 'More than 3 months ago'}</option>
              <option value="less_than_3" className="bg-slate-900">{isBn ? '৩ মাসের মধ্যে (< 90 Days)' : 'Less than 3 months ago'}</option>
            </select>
            <p className="text-[10px] text-slate-400">{isBn ? 'পুরুষ ৩ মাস ও নারী ৪ মাস ব্যবধানে রক্ত দিতে পারেন' : '3-4 months safe interval'}</p>
          </div>

          {/* Fever / Cold / Meds */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBn ? '৪. বর্তমান জ্বর, সর্দি বা অ্যান্টিবায়োটিক?' : '4. Current Fever or Antibiotics?'}</span>
            </label>
            <select
              value={hasFeverCold}
              onChange={(e) => {
                setHasFeverCold(e.target.value);
                setIsCalculated(false);
              }}
              className="w-full px-3.5 py-2 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500"
            >
              <option value="no" className="bg-slate-900">{isBn ? 'না, সম্পূর্ণ সুস্থ' : 'No, perfectly healthy'}</option>
              <option value="yes" className="bg-slate-900">{isBn ? 'হ্যাঁ, সামান্য অসুস্থ' : 'Yes, feeling unwell'}</option>
            </select>
          </div>

          {/* Chronic Disease */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>{isBn ? '৫. হেপাটাইটিস, হৃদরোগ বা ডায়াবেটিস?' : '5. Chronic Heart/Hep Condition?'}</span>
            </label>
            <select
              value={hasChronicDisease}
              onChange={(e) => {
                setHasChronicDisease(e.target.value);
                setIsCalculated(false);
              }}
              className="w-full px-3.5 py-2 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500"
            >
              <option value="no" className="bg-slate-900">{isBn ? 'না, কোনো দীর্ঘমেয়াদি রোগ নেই' : 'No chronic conditions'}</option>
              <option value="yes" className="bg-slate-900">{isBn ? 'হ্যাঁ, ডায়াবেটিস/হৃদরোগ আছে' : 'Yes, taking insulin/cardiac meds'}</option>
            </select>
          </div>

          {/* Recent Tattoo / Major Surgery */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>{isBn ? '৬. বিগত ৬ মাসে বড় সার্জারি বা ট্যাটু?' : '6. Surgery or Tattoo in 6 Mos?'}</span>
            </label>
            <select
              value={hasTattooSurgery}
              onChange={(e) => {
                setHasTattooSurgery(e.target.value);
                setIsCalculated(false);
              }}
              className="w-full px-3.5 py-2 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500"
            >
              <option value="no" className="bg-slate-900">{isBn ? 'না' : 'No'}</option>
              <option value="yes" className="bg-slate-900">{isBn ? 'হ্যাঁ' : 'Yes'}</option>
            </select>
          </div>

        </div>

        {/* Calculate Action */}
        {!isCalculated ? (
          <div className="text-center pt-2">
            <button
              onClick={checkEligibility}
              disabled={!age || !weight}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm shadow-lg shadow-rose-900/40 hover:shadow-rose-700/50 transition-all transform active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              <span>{isBn ? 'ফলাফল দেখুন' : 'Check My Eligibility Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className={`p-5 rounded-2xl border transition-all ${
            isFullyEligible
              ? 'bg-emerald-950/60 border-emerald-500/40'
              : 'bg-amber-950/60 border-amber-500/40'
          }`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                {isFullyEligible ? (
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-7 h-7" />
                  </div>
                )}
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {isFullyEligible
                      ? isBn
                        ? 'অভিনন্দন! আপনি আজই রক্তদান করতে পারবেন।'
                        : 'Congratulations! You are eligible to donate blood today.'
                      : isBn
                      ? 'আপাতত আপনি রক্তদানের জন্য প্রস্তুত নন।'
                      : 'You are currently not eligible to donate.'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {isFullyEligible
                      ? isBn
                        ? 'আপনার একটি ব্যাগ রক্ত বাঁচাতে পারে একটি মুমূর্ষু রোগীর প্রাণ। আজই এসকাডো ব্লাড ব্যাংকে নিবন্ধিত হোন।'
                        : 'Your single donation can save up to 3 lives. Register now as a verified donor hero.'
                      : isBn
                      ? (!isAgeValid ? 'বয়স ১৮-৬০ এর মধ্যে হতে হবে। ' : '') +
                        (!isWeightValid ? 'ওজন কমপক্ষে ৪৫ কেজি হতে হবে। ' : '') +
                        (!isIntervalValid ? 'পূর্ববর্তী রক্তদানের পর ৩ মাস পূর্ণ হতে হবে। ' : '') +
                        (!isHealthy ? 'সুস্থ হয়ে ওঠার পর অনুগ্রহ করে পুনরায় চেষ্টা করুন।' : '')
                      : 'Please check the medical guidelines or retry once criteria are met.'}
                  </p>
                </div>
              </div>

              {isFullyEligible && (
                <button
                  onClick={onEligible}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition shrink-0 shadow-md inline-flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-slate-950" />
                  <span>{isBn ? 'ডোনার হিসেবে নিবন্ধন করুন' : 'Register as Donor'}</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
