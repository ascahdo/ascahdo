import React, { useState } from 'react';
import {
  Heart, Play, Sparkles, ShieldCheck, Lock,
  ArrowRight, CheckCircle2, Users, Flame, Droplets,
  Stethoscope, GraduationCap, Utensils
} from 'lucide-react';
import { SYF_BRAND } from '../../data/sajedaCharityData';

interface SajedaHeroSectionProps {
  onOpenDonate?: (causeId?: string, initialAmount?: number) => void;
  onOpenDonateModal?: () => void;
  onOpenZakatModal?: () => void;
  onExploreCauses?: () => void;
  onWatchStory?: () => void;
}

export const SajedaHeroSection: React.FC<SajedaHeroSectionProps> = ({
  onOpenDonate,
  onOpenDonateModal,
  onOpenZakatModal,
  onExploreCauses,
  onWatchStory
}) => {
  // Quick Donation Card State
  const [donationFrequency, setDonationFrequency] = useState<'one_time' | 'monthly'>('one_time');
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedCause, setSelectedCause] = useState<string>('all_humanitarian');
  const [donorName, setDonorName] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'bank' | 'card'>('bkash');

  const presetAmounts = [500, 1000, 2500, 5000];

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    if (val) {
      setSelectedAmount(parseInt(val, 10));
    }
  };

  const handleQuickDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmt = customAmount ? parseInt(customAmount, 10) : selectedAmount;
    if (onOpenDonate) {
      onOpenDonate(selectedCause, finalAmt || 1000);
    } else if (onOpenDonateModal) {
      onOpenDonateModal();
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-950 via-slate-900 to-teal-900 text-white py-12 lg:py-20">
      {/* Background Subtle Patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Together, We Can Make a Difference</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
              একটি ছোট্ট উদ্যোগ, <br />
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 bg-clip-text text-transparent">
                একটি বড় পরিবর্তন
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-medium">
              আপনার ভালোবাসা, সহযোগিতা ও মানবিকতা একজন অসহায় মানুষের জীবনে ফিরিয়ে দিতে পারে আশা, শিক্ষা ও নতুন ভবিষ্যৎ।
            </p>

            {/* Key Trust Checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold bg-white/5 p-2 rounded-lg border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>১০০% শরীয়াহসম্মত ও অডিটেড</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold bg-white/5 p-2 rounded-lg border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>তাৎক্ষণিক ডিজিটাল রসিদ</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold bg-white/5 p-2 rounded-lg border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>সরাসরি ফিল্ডে অর্থ পৌঁছানো</span>
              </div>
            </div>

            {/* Primary Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={() => {
                  if (onOpenDonate) onOpenDonate();
                  else if (onOpenDonateModal) onOpenDonateModal();
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black px-6 sm:px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <Heart className="w-5 h-5 fill-white animate-pulse" />
                <span>Donate Now (অনুদান দিন)</span>
              </button>

              <button
                onClick={() => onExploreCauses && onExploreCauses()}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-5 sm:px-6 py-3.5 rounded-2xl transition flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <span>Explore Causes</span>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </button>

              <button
                onClick={() => onWatchStory && onWatchStory()}
                className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 font-bold text-sm px-4 py-3 rounded-xl transition cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-amber-300 text-amber-300 ml-0.5" />
                </div>
                <span>Watch Our Story</span>
              </button>
            </div>
          </div>

          {/* Right Column: Emotional Image & Floating Quick Donation Card */}
          <div className="lg:col-span-5 relative">
            {/* Visual Image Backdrop Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1000&auto=format&fit=crop&q=80"
                alt="Humanitarian Care Sajeda Youth Foundation"
                className="w-full h-72 lg:h-80 object-cover brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute top-4 right-4 bg-amber-500/90 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md">
                ⭐ Verified Impact
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <span className="text-[11px] text-emerald-300 font-mono font-bold tracking-widest uppercase">
                  Sajeda Youth Foundation
                </span>
                <h4 className="text-sm font-bold text-white leading-tight">
                  “একটি ভালো কাজ, একটি সুন্দর ভবিষ্যৎ।”
                </h4>
              </div>
            </div>

            {/* Floating Quick Donation Card */}
            <div className="mt-4 sm:-mt-10 relative z-20 bg-white text-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-emerald-100">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Heart className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 leading-tight">Make a Donation</h3>
                    <p className="text-[10px] text-slate-500 font-medium">সহজ ও নিরাপদ উপায়ে অনুদান দিন</p>
                  </div>
                </div>

                {/* Frequency Toggle */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setDonationFrequency('one_time')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      donationFrequency === 'one_time'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    এককালীন
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonationFrequency('monthly')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      donationFrequency === 'monthly'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    মাসিক
                  </button>
                </div>
              </div>

              <form onSubmit={handleQuickDonateSubmit} className="space-y-3.5 text-left">
                {/* Amount Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    অনুদানের পরিমাণ নির্বাচন করুন:
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 mb-2">
                    {presetAmounts.map((amt) => {
                      const isSelected = selectedAmount === amt && !customAmount;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleAmountClick(amt)}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-black transition cursor-pointer border ${
                            isSelected
                              ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                              : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300'
                          }`}
                        >
                          ৳{(amt || 0).toLocaleString('bn-BD')}
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">৳</span>
                    <input
                      type="text"
                      placeholder="কাস্টম পরিমাণ লিখুন (উদাঃ ৭৫০)"
                      value={customAmount}
                      onChange={handleCustomChange}
                      className="w-full pl-7 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Donor Quick Fields */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      placeholder="আপনার নাম"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="মোবাইল নম্বর"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Cause Selection */}
                <div>
                  <select
                    value={selectedCause}
                    onChange={(e) => setSelectedCause(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all_humanitarian">যেকোনো জরুরি মানবিক কল্যাণ ফান্ড</option>
                    <option value="education">শিক্ষা ও সুবিধাবঞ্চিত শিশু বিদ্যাপীঠ</option>
                    <option value="healthcare">চিকিৎসা ও মুমূর্ষু রোগীর সেবা</option>
                    <option value="food_relief">ক্ষুধা নিবারণ ও খাদ্য রেশন</option>
                    <option value="clean_water">নিরাপদ পানি ও গভীর নলকূপ</option>
                    <option value="disaster_relief">বন্যা ও দুর্যোগকালীন ত্রাণ তহবিল</option>
                    <option value="zakat_fund">শরীয়াহ যাকাত ও ফিতরা ফান্ড</option>
                  </select>
                </div>

                {/* Payment Method Quick Radios */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1">
                    <span>পেমেন্ট মাধ্যম:</span>
                    <span className="text-emerald-700">বিকাশ / নগদ / কার্ড / ব্যাংক</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'bkash', label: 'bKash' },
                      { id: 'nagad', label: 'Nagad' },
                      { id: 'rocket', label: 'Rocket' },
                      { id: 'bank', label: 'Bank' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`py-1.5 px-1 text-center rounded-lg text-[11px] font-bold transition border ${
                          paymentMethod === m.id
                            ? 'bg-teal-800 text-white border-teal-800'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Donate Now (৳{((customAmount ? parseInt(customAmount, 10) : selectedAmount) || 0).toLocaleString('bn-BD')})</span>
                </button>

                {/* 🔒 Secure Donation Footer */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium pt-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>🔒 Secure 256-Bit SSL Encrypted Donation</span>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
