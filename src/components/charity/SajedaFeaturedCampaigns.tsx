import React, { useState } from 'react';
import {
  Heart, Flame, Clock, Users, ArrowRight, ShieldCheck,
  Share2, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import { SYF_FEATURED_CAMPAIGNS } from '../../data/sajedaCharityData';
import { EmergencyAppeal } from '../../types/donationTypes';

interface SajedaFeaturedCampaignsProps {
  campaigns?: EmergencyAppeal[];
  onOpenDonate: (campaignId?: string) => void;
  onSelectCampaignDetails?: (campaign: EmergencyAppeal) => void;
}

export const SajedaFeaturedCampaigns: React.FC<SajedaFeaturedCampaignsProps> = ({
  campaigns = SYF_FEATURED_CAMPAIGNS,
  onOpenDonate,
  onSelectCampaignDetails
}) => {
  const [selectedDetails, setSelectedDetails] = useState<EmergencyAppeal | null>(null);
  const [shareToast, setShareToast] = useState<string | null>(null);

  const handleShare = (camp: EmergencyAppeal, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${camp.titleBn} - ${url}`);
      setShareToast(`লিংক কপি হয়েছে: ${camp.titleBn.slice(0, 20)}...`);
      setTimeout(() => setShareToast(null), 3000);
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-slate-50 text-slate-900 relative">
      {/* Toast Notification */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom duration-200 border border-emerald-500">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{shareToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
              <Flame className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>জরুরি মানবিক আবেদনসমূহ</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              আজই একটি জীবন বদলে দিতে পারেন
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              যেখানে প্রতিটি মুহূর্ত ও প্রতিটি টাকার অনুদান এক একটি নিষ্পাপ মানুষের জীবন রক্ষার লড়াই।
            </p>
          </div>

          <button
            onClick={() => onOpenDonate()}
            className="self-start md:self-auto inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-xl transition"
          >
            <span>সকল ক্যাম্পেইন দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Campaign Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((camp) => {
            const percent = Math.min(100, Math.round((camp.raisedAmount / camp.targetAmount) * 100));
            const remainingAmount = Math.max(0, camp.targetAmount - camp.raisedAmount);

            return (
              <div
                key={camp.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group text-left"
              >
                {/* Cover Image & Badges */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={camp.imageUrl}
                    alt={camp.titleBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Urgency Badge */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1 bg-rose-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md">
                    <Flame className="w-3.5 h-3.5 fill-white animate-pulse" />
                    <span>জরুরি অগ্রাধিকার</span>
                  </div>

                  {/* Share button */}
                  <button
                    onClick={(e) => handleShare(camp, e)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-xs transition shadow-md"
                    title="শেয়ার করুন"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Hospital/Location */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold">
                    <span className="truncate max-w-[200px]">{camp.patientOrCauseName}</span>
                    <span className="text-emerald-300 font-mono text-[11px] bg-slate-900/80 px-2 py-0.5 rounded">
                      {camp.locationBn || 'বাংলাদেশ'}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-emerald-800 transition">
                      {camp.titleBn}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                      {camp.storyBn}
                    </p>
                  </div>

                  {/* Financial Metrics */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <span className="block text-[10px] text-slate-500 font-semibold">লক্ষ্যমাত্রা</span>
                        <span className="text-xs sm:text-sm font-black text-slate-900 font-mono">
                          ৳{(camp?.targetAmount || 0).toLocaleString('bn-BD')}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-emerald-700 font-semibold">সংগৃহীত</span>
                        <span className="text-xs sm:text-sm font-black text-emerald-700 font-mono">
                          ৳{(camp?.raisedAmount || 0).toLocaleString('bn-BD')}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-rose-600 font-semibold">বাকি আছে</span>
                        <span className="text-xs sm:text-sm font-black text-rose-600 font-mono">
                          ৳{(remainingAmount || 0).toLocaleString('bn-BD')}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-600 flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-500" />
                          <span>{(camp?.donorCount || 0).toLocaleString('bn-BD')} জন দাতা</span>
                        </span>
                        <span className="text-emerald-700 font-mono font-black">{percent}% পূর্ণ</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-full transition-all duration-1000"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Deadline & CTA Buttons */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                      <span className="flex items-center gap-1 text-rose-600 font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>বাকি {camp.daysLeft ? (camp.daysLeft || 0).toLocaleString('bn-BD') : '১২'} দিন</span>
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>১০০% ভেরিফাইড</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedDetails(camp)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                      >
                        বিস্তারিত জানুন
                      </button>

                      <button
                        onClick={() => onOpenDonate(camp.id)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        <span>Help Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Campaign Full Story Modal */}
      {selectedDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-left animate-in zoom-in-95">
            <div className="relative h-56 rounded-2xl overflow-hidden">
              <img
                src={selectedDetails.imageUrl}
                alt={selectedDetails.titleBn}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-xs text-amber-300 font-bold">{selectedDetails.patientOrCauseName}</span>
                <h3 className="text-lg font-black">{selectedDetails.titleBn}</h3>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">ঘটনার বিস্তারিত বিবরণ:</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {selectedDetails.storyBn}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block">হাসপাতাল / অবস্থান:</span>
                <span className="font-bold text-slate-900">{selectedDetails.hospitalOrLocation || 'বাংলাদেশ'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">সংগ্রহ লক্ষ্য:</span>
                <span className="font-bold text-emerald-700">৳{(selectedDetails?.targetAmount || 0).toLocaleString('bn-BD')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedDetails(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                বন্ধ করুন
              </button>

              <button
                onClick={() => {
                  const cId = selectedDetails.id;
                  setSelectedDetails(null);
                  onOpenDonate(cId);
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-black hover:bg-emerald-800 flex items-center gap-2 shadow-md"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>এই ক্যাম্পেইনে অনুদান দিন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
