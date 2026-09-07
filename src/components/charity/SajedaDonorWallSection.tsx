import React, { useState } from 'react';
import { Heart, ShieldCheck, UserCheck, Sparkles, Lock, Filter } from 'lucide-react';
import { SYF_DONOR_WALL } from '../../data/sajedaCharityData';

interface SajedaDonorWallSectionProps {
  onOpenDonate?: () => void;
}

export const SajedaDonorWallSection: React.FC<SajedaDonorWallSectionProps> = ({ onOpenDonate }) => {
  const [filterType, setFilterType] = useState<'all' | 'top_donor' | 'monthly_supporter'>('all');

  const donors = SYF_DONOR_WALL || [];

  const filteredDonors = donors.filter(d => {
    if (filterType === 'all') return true;
    return d.donorType === filterType;
  });

  return (
    <section className="py-16 lg:py-24 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Donor Wall of Honor</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              যারা পরিবর্তনের অংশ হয়েছেন
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              সম্মানিত দাতাবৃন্দের ভালোবাসা ও ত্যাগে পরিচালিত হচ্ছে সাজেদা ইয়ুথ ফাউন্ডেশনের মানবিক উদ্যোগগুলো।
            </p>
          </div>

          {/* Privacy Note & Filter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === 'all' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              সকল পৃষ্ঠপোষক
            </button>
            <button
              onClick={() => setFilterType('top_donor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === 'top_donor' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              শীর্ষ দাতা
            </button>
            <button
              onClick={() => setFilterType('monthly_supporter')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === 'monthly_supporter' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              মাসিক দাতা
            </button>
          </div>
        </div>

        {/* Donors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDonors.slice(0, 8).map((donor) => (
            <div
              key={donor.id}
              className="bg-slate-50 hover:bg-emerald-50/50 rounded-2xl p-4 border border-slate-200/80 transition transform hover:-translate-y-0.5 text-left space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-300">
                  {donor.isAnonymous ? (
                    <Lock className="w-4 h-4 text-emerald-700" />
                  ) : (
                    donor.donorName.slice(0, 2)
                  )}
                </div>

                <div className="overflow-hidden">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                    {donor.isAnonymous ? 'গোপন শুভাকাঙ্ক্ষী (Anonymous)' : donor.donorName}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    {donor.donorDistrict || 'বাংলাদেশ'} • {donor.donorTypeBn}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 font-mono">
                <span className="text-slate-500 text-[10px]">মোট অবদান:</span>
                <span className="font-bold text-emerald-700">
                  ৳{(donor?.totalDonationAmount || 0).toLocaleString('bn-BD')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Anonymous Privacy Assurance Bar */}
        <div className="mt-8 bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-2 text-xs text-emerald-900 font-semibold">
            <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              🔒 আপনি চাইলে আপনার নাম ও অনুদানের অঙ্ক সম্পূর্ণ গোপন রেখে (Anonymous Donor) অনুদান দিতে পারেন।
            </span>
          </div>

          <button
            onClick={onOpenDonate}
            className="shrink-0 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>আমিও অংশ হতে চাই</span>
          </button>
        </div>

      </div>
    </section>
  );
};
