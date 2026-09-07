import React, { useState } from 'react';
import {
  GraduationCap, Stethoscope, Utensils, Droplets,
  Baby, Flame, ArrowRight, Heart, Users, CheckCircle2,
  ChevronRight, Sparkles
} from 'lucide-react';
import { SYF_6_CAUSES } from '../../data/sajedaCharityData';
import { CauseItem } from '../../types/donationTypes';

interface SajedaCausesSectionProps {
  onOpenDonate: (causeId?: string) => void;
  onSelectCauseDetails?: (cause: CauseItem) => void;
}

export const SajedaCausesSection: React.FC<SajedaCausesSectionProps> = ({
  onOpenDonate,
  onSelectCauseDetails
}) => {
  const [selectedCauseForModal, setSelectedCauseForModal] = useState<CauseItem | null>(null);

  const getCauseIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5" />;
      case 'Stethoscope':
        return <Stethoscope className="w-5 h-5" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5" />;
      case 'Baby':
        return <Baby className="w-5 h-5" />;
      case 'Flame':
        return <Flame className="w-5 h-5" />;
      default:
        return <Heart className="w-5 h-5" />;
    }
  };

  const handleCardDetails = (cause: CauseItem) => {
    if (onSelectCauseDetails) {
      onSelectCauseDetails(cause);
    } else {
      setSelectedCauseForModal(cause);
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-teal-700" />
              <span>Where Your Support Goes</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              আপনার সহযোগিতা যেখানে পৌঁছে যায়
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              আপনার প্রতিটি অনুদান মানুষের প্রয়োজন অনুযায়ী বাস্তব ও টেকসই মানবিক কাজে ব্যবহার করা হয়।
            </p>
          </div>

          <button
            onClick={() => onOpenDonate()}
            className="self-start md:self-auto inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-xl transition"
          >
            <span>সব খাতে এককালীন অনুদান</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Causes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SYF_6_CAUSES.map((cause) => {
            const percent = Math.min(100, Math.round((cause.raisedAmount / cause.targetAmount) * 100));
            return (
              <div
                key={cause.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Cause Cover Image & Badge */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={cause.imageUrl}
                    alt={cause.titleBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs text-slate-900 px-3 py-1 rounded-full text-xs font-black shadow-xs">
                    <span className="text-emerald-700">{getCauseIcon(cause.iconName)}</span>
                    <span>{cause.title}</span>
                  </div>

                  {/* Beneficiary counter badge */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold text-slate-200">{cause.subtitleBn}</span>
                    <span className="bg-emerald-600/90 text-white font-mono font-bold px-2 py-0.5 rounded-md text-[11px]">
                      {(cause?.beneficiariesCount || 0).toLocaleString('bn-BD')}+ উপকৃত
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-800 transition leading-snug">
                      {cause.titleBn}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 font-medium">
                      {cause.descriptionBn}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    {(cause.keyPointsBn || []).map((point, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{point}</span>
                      </div>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-600">
                      <span>সংগ্রহ: ৳{(cause?.raisedAmount || 0).toLocaleString('bn-BD')}</span>
                      <span className="text-emerald-700">{percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-1000"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleCardDetails(cause)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onOpenDonate(cause.id)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>Donate</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cause Details Modal */}
      {selectedCauseForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 text-left">
            <div className="relative h-44 rounded-2xl overflow-hidden">
              <img
                src={selectedCauseForModal.imageUrl}
                alt={selectedCauseForModal.titleBn}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <span className="text-xs text-amber-300 font-bold">{selectedCauseForModal.subtitleBn}</span>
                <h3 className="text-lg font-black">{selectedCauseForModal.titleBn}</h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {selectedCauseForModal.descriptionBn}
            </p>

            <div className="space-y-2 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100">
              <h4 className="text-xs font-black text-emerald-900">এই খাতের প্রধান লক্ষ্য ও প্রভাব:</h4>
              <ul className="space-y-1.5">
                {(selectedCauseForModal?.keyPointsBn || []).map((kp, kIdx) => (
                  <li key={kIdx} className="flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{kp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedCauseForModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                বন্ধ করুন
              </button>

              <button
                onClick={() => {
                  const cId = selectedCauseForModal.id;
                  setSelectedCauseForModal(null);
                  onOpenDonate(cId);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-black hover:bg-emerald-800 flex items-center gap-1.5 shadow-md"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>এই খাতে অনুদান দিন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
