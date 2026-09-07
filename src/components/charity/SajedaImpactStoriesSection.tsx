import React, { useState } from 'react';
import {
  Quote, Heart, MapPin, CheckCircle2, ArrowRight,
  Sparkles, ShieldCheck, ChevronRight, User
} from 'lucide-react';
import { SYF_REAL_STORIES } from '../../data/sajedaCharityData';
import { RealImpactStory } from '../../types/donationTypes';

interface SajedaImpactStoriesSectionProps {
  onOpenDonate?: (category?: string) => void;
}

export const SajedaImpactStoriesSection: React.FC<SajedaImpactStoriesSectionProps> = ({
  onOpenDonate
}) => {
  const [selectedStoryModal, setSelectedStoryModal] = useState<RealImpactStory | null>(null);

  return (
    <section className="py-16 lg:py-24 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            <Quote className="w-4 h-4 text-amber-700" />
            <span>Human-Centered Storytelling</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            বাস্তব গল্প। বাস্তব পরিবর্তন।
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            যাঁদের জীবনে আপনারা আলো ফিরিয়ে দিয়েছেন—তাঁদের মনের গভীর থেকে আসা কিছু বাস্তব অনুভূতি।
          </p>
        </div>

        {/* Story Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {SYF_REAL_STORIES.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left group"
            >
              {/* Image & Header Profile */}
              <div className="relative">
                <div className="h-48 overflow-hidden bg-slate-100">
                  <img
                    src={story.avatarUrl}
                    alt={story.personNameBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[11px] text-amber-300 font-bold bg-slate-900/80 px-2 py-0.5 rounded">
                    {story.categoryNameBn}
                  </span>
                  <h3 className="text-base font-black text-white mt-1">
                    {story.personNameBn}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-300">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{story.locationBn}</span>
                  </div>
                </div>
              </div>

              {/* Quote & Content */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm font-bold text-slate-800 italic leading-relaxed bg-amber-50/70 p-3.5 rounded-2xl border border-amber-100 text-amber-950">
                    {story.quoteBn}
                  </p>

                  {/* Before / Support / After mini badges */}
                  <div className="space-y-2 text-xs">
                    <div className="bg-rose-50 p-2 rounded-xl border border-rose-100">
                      <span className="font-bold text-rose-800 block text-[11px]">পূর্বে:</span>
                      <span className="text-slate-600 line-clamp-1">{story.beforeStatusBn}</span>
                    </div>

                    <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                      <span className="font-bold text-emerald-800 block text-[11px]">সহায়তা পেয়ে বর্তমানে:</span>
                      <span className="text-slate-700 font-semibold line-clamp-1">{story.afterStatusBn}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={() => setSelectedStoryModal(story)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>পুরো গল্পটি পড়ুন</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenDonate(story.category)}
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition cursor-pointer"
                    title="অনুরূপ খparam"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Full Modal */}
      {selectedStoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-left animate-in zoom-in-95">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <img
                src={selectedStoryModal.avatarUrl}
                alt={selectedStoryModal.personNameBn}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500"
              />
              <div>
                <h3 className="text-base font-black text-slate-900">{selectedStoryModal.personNameBn}</h3>
                <p className="text-xs text-slate-500">{selectedStoryModal.locationBn} • {selectedStoryModal.categoryNameBn}</p>
              </div>
            </div>

            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-amber-950 font-bold text-xs italic">
              {selectedStoryModal.quoteBn}
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              <h4 className="font-black text-slate-900">সম্পূর্ণ ঘটনা ও প্রেক্ষাপট:</h4>
              <p>{selectedStoryModal.fullStoryBn}</p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="bg-rose-50 p-3 rounded-xl border border-rose-100 text-xs">
                <span className="font-black text-rose-800 block mb-0.5">১. অনুদানের পূর্বে অবস্থা:</span>
                <p className="text-slate-700">{selectedStoryModal.beforeStatusBn}</p>
              </div>

              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-xs">
                <span className="font-black text-blue-800 block mb-0.5">২. সাজেদা ফাউন্ডেশন প্রদত্ত সহায়তা:</span>
                <p className="text-slate-700">{selectedStoryModal.supportReceivedBn}</p>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-xs">
                <span className="font-black text-emerald-800 block mb-0.5">৩. বর্তমান টেকসই ফলাফল:</span>
                <p className="text-slate-800 font-bold">{selectedStoryModal.afterStatusBn}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedStoryModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                বন্ধ করুন
              </button>

              <button
                onClick={() => {
                  const cat = selectedStoryModal.category;
                  setSelectedStoryModal(null);
                  onOpenDonate(cat);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-black hover:bg-emerald-800 flex items-center gap-1.5 shadow-md"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>এমন মানুষদের পাশে দাঁড়ান</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
