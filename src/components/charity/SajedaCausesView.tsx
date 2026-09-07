import React, { useState } from 'react';
import {
  GraduationCap, Stethoscope, Utensils, Droplets,
  Baby, Flame, Heart, ArrowRight, CheckCircle2,
  Sparkles, ShieldCheck
} from 'lucide-react';
import { SYF_6_CAUSES } from '../../data/sajedaCharityData';
import { CauseItem } from '../../types/donationTypes';

interface SajedaCausesViewProps {
  onOpenDonate?: (causeId?: string) => void;
}

export const SajedaCausesView: React.FC<SajedaCausesViewProps> = ({ onOpenDonate }) => {
  const [selectedCauseDetails, setSelectedCauseDetails] = useState<CauseItem | null>(null);

  return (
    <div className="py-12 lg:py-20 bg-slate-50 text-slate-900 space-y-16 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Core Causes & Action Pillars</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              আমাদের সেবামূলক খাতসমূহ
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              সাজেদা ইয়ুথ ফাউন্ডেশনের প্রতিটি সেবা কার্যক্রম দীর্ঘমেয়াদী টেকসই সমাজ বিনির্মাণের লক্ষ্যে পরিচালিত।
            </p>
          </div>
        </div>

        {/* 6 Causes Detailed Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SYF_6_CAUSES.map((cause) => {
            const percent = Math.min(100, Math.round((cause.raisedAmount / cause.targetAmount) * 100));
            return (
              <div
                key={cause.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={cause.imageUrl}
                    alt={cause.titleBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4 bg-white/95 text-slate-900 px-3 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                    <span>{cause.title}</span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white text-xs font-semibold flex items-center justify-between">
                    <span>{cause.subtitleBn}</span>
                    <span className="bg-emerald-600 text-white font-mono px-2 py-0.5 rounded text-[11px]">
                      {(cause?.beneficiariesCount || 0).toLocaleString('bn-BD')}+ উপকৃত
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-800 transition">
                      {cause.titleBn}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {cause.descriptionBn}
                    </p>
                  </div>

                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                    {(cause.keyPointsBn || []).map((kp, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{kp}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-600">
                      <span>সংগ্রহ: ৳{(cause?.raisedAmount || 0).toLocaleString('bn-BD')}</span>
                      <span className="text-emerald-700">{percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => onOpenDonate && onOpenDonate(cause.id)}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>এই খাতে অনুদান দিন</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
