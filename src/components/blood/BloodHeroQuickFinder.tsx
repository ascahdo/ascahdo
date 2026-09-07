import React, { useState } from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  Search, Droplet, MapPin, AlertTriangle, Phone, ShieldCheck,
  CheckCircle, Heart, Users, Sparkles, ArrowRight, Activity
} from 'lucide-react';
import { BANGLADESH_DISTRICTS } from '../../data/bangladeshLocations';

interface BloodHeroQuickFinderProps {
  onSearch: (bloodGroup: string, district: string) => void;
  onOpenSOS: () => void;
  onOpenRegisterDonor: () => void;
  totalDonorsCount: number;
  totalBagsCount: number;
  totalPendingSOS: number;
}

export const BloodHeroQuickFinder: React.FC<BloodHeroQuickFinderProps> = ({
  onSearch,
  onOpenSOS,
  onOpenRegisterDonor,
  totalDonorsCount,
  totalBagsCount,
  totalPendingSOS
}) => {
  const { isBn } = useTranslation();
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(selectedGroup, selectedDistrict);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-rose-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-rose-900/30">
      
      {/* Background Decorative Graphic Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-red-700/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8">
        
        {/* Top Headline & Emergency Hotlines */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                <span>{isBn ? 'সেন্ট্রাল ব্লাড ট্রান্সফিউশন হাব' : 'Central Blood Transfusion Hub'}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <span>{isBn ? '✓ রক্তদাতা আবেদন ১০০% ফ্রি' : '✓ 100% Free Donor Registration'}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <span>{isBn ? '🩸 রক্ত রিকুইজিশন: প্রতি ব্যাগ ৳১,২৫০ অনুদান' : '🩸 Blood Request: ৳1,250 Donation/Bag'}</span>
              </div>
            </div>

            {/* Official Blood Bank Name */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {isBn ? 'এসকাডো ব্লাড ব্যাংক' : 'ASCAHDO BLOOD BANK'}
              </h1>
              <h2 className="text-lg sm:text-xl font-bold tracking-wider text-rose-400 font-mono uppercase">
                {isBn ? 'ASCAHDO BLOOD BANK' : 'এসকাডো ব্লাড ব্যাংক'}
              </h2>
            </div>

            <p className="text-xs sm:text-base text-slate-300 font-medium leading-relaxed">
              {isBn
                ? 'মানবধর্মের শ্রেষ্ঠ সেবায় রক্তদাতা হিসেবে বিনামূল্যে আবেদন করুন অথবা মুমূর্ষু রোগীর জন্য তাৎক্ষণিক সংরক্ষিত রক্তের রিকুইজিশন দিন (প্রতি ব্যাগ ১২৫০ টাকা স্ক্রিনিং ও ল্যাব প্রসেসিং অনুদান)।'
                : 'Register completely free as a life-saving blood donor, or request verified cold-chain blood units for hospital patients (1,250 BDT lab processing donation per bag).'}
            </p>
          </div>

          {/* Emergency SOS & 24/7 Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={onOpenSOS}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm shadow-xl shadow-red-900/50 flex items-center justify-center gap-2.5 transition active:scale-98 animate-pulse"
            >
              <AlertTriangle className="w-5 h-5 text-white" />
              <span>{isBn ? 'জরুরি রক্তের আবেদন (SOS)' : 'Emergency Blood Request (SOS)'}</span>
            </button>

            <button
              onClick={onOpenRegisterDonor}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition active:scale-98"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{isBn ? 'ফ্রি রক্তদাতা আবেদন (১০০% ফ্রি)' : 'Free Donor Registration (100% Free)'}</span>
            </button>

            <a
              href="tel:01813817167"
              className="px-6 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/15 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>{isBn ? '২৪/৭ সেন্ট্রাল হটলাইন: ০১৮১৩-৮১৭১৬৭' : '24/7 Hotline: 01813-817167'}</span>
            </a>
          </div>
        </div>

        {/* ======================================================== */}
        {/* QUICK BLOOD FINDER BOX                                   */}
        {/* ======================================================== */}
        <form
          onSubmit={handleQuickSubmit}
          className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 sm:p-6 space-y-5 text-left"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-rose-400" />
              <span>{isBn ? 'তাৎক্ষণিক রক্তদাতা ও রক্তের গ্রুপ অনুসন্ধান' : 'Find Blood Donors & Available Units'}</span>
            </h3>
            <span className="text-xs text-rose-300 font-medium">
              {isBn ? 'গ্রুপ ও জেলা নির্বাচন করে খুঁজুন' : 'Select group and location'}
            </span>
          </div>

          {/* Blood Group Selectors */}
          <div className="space-y-2">
            <span className="text-xs text-slate-300 font-semibold block">
              {isBn ? 'রক্তের গ্রুপ পছন্দ করুন:' : 'Select Blood Group:'}
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {bloodGroups.map((group) => {
                const isSelected = selectedGroup === group;
                return (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setSelectedGroup(group)}
                    className={`py-2.5 rounded-xl font-black text-sm sm:text-base transition text-center shadow-xs ${
                      isSelected
                        ? 'bg-rose-600 text-white ring-2 ring-white scale-105'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {group}
                  </button>
                );
              })}
            </div>
          </div>

          {/* District & Location Search Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">
                {isBn ? 'জেলা (District):' : 'District:'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-rose-500"
                >
                  <option value="all" className="bg-slate-900">{isBn ? 'সকল জেলা (All 64 Districts)' : 'All Districts'}</option>
                  {Object.values(BANGLADESH_DISTRICTS).map((d) => (
                    <option key={d.name} value={d.name} className="bg-slate-900">
                      {d.name} ({d.nameBn})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">
                {isBn ? 'নির্বাচন রিসেট:' : 'Reset Group:'}
              </label>
              <button
                type="button"
                onClick={() => {
                  setSelectedGroup('all');
                  setSelectedDistrict('all');
                }}
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 rounded-xl text-xs sm:text-sm font-semibold transition"
              >
                {isBn ? 'সকল গ্রুপ দেখান' : 'Show All Groups'}
              </button>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-900/50 transition active:scale-98"
              >
                <Search className="w-4 h-4" />
                <span>{isBn ? 'রক্তের সন্ধান করুন' : 'Search Blood Now'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Live Metrics Quick Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
            <span className="text-2xl sm:text-3xl font-black text-rose-400 font-mono block">
              {totalBagsCount || '1,480+'}
            </span>
            <span className="text-[11px] text-slate-300 font-medium">
              {isBn ? 'ব্যাগ লাইভ স্টক' : 'Live Bags Available'}
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono block">
              {totalDonorsCount || '3,240+'}
            </span>
            <span className="text-[11px] text-slate-300 font-medium">
              {isBn ? 'নিবন্ধিত লাইফ ডোনার' : 'Verified Hero Donors'}
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono block">
              {totalPendingSOS}
            </span>
            <span className="text-[11px] text-slate-300 font-medium">
              {isBn ? 'চলমান জরুরি রিকুইজিশন' : 'Pending Emergency SOS'}
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
            <span className="text-2xl sm:text-3xl font-black text-sky-400 font-mono block">
              ৬৪
            </span>
            <span className="text-[11px] text-slate-300 font-medium">
              {isBn ? 'জেলায় সেন্ট্রাল হাব' : 'District Hubs'}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
