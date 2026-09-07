import React, { useState } from 'react';
import { Sparkles, MoveHorizontal, CheckCircle2, Heart, ArrowRight } from 'lucide-react';
import { SYF_BEFORE_AFTER_PROJECTS } from '../../data/sajedaCharityData';
import { BeforeAfterItem } from '../../types/donationTypes';

interface SajedaBeforeAfterSliderProps {
  onOpenDonate?: () => void;
}

export const SajedaBeforeAfterSlider: React.FC<SajedaBeforeAfterSliderProps> = ({
  onOpenDonate
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(SYF_BEFORE_AFTER_PROJECTS[0].id);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 - 100 percentage
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const currentItem = SYF_BEFORE_AFTER_PROJECTS.find(p => p.id === selectedProjectId) || SYF_BEFORE_AFTER_PROJECTS[0];

  const handleSliderMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    handleSliderMove(e.touches[0].clientX, rect);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && e.buttons !== 1) return;
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    handleSliderMove(e.clientX, rect);
  };

  return (
    <section className="py-16 lg:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Interactive Before & After Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            চোখের সামনে পরিবর্তনের জীবন্ত রূপ
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-medium">
            নিচের স্লাইডারটি ডানে-বামে টেনে দেখুন কীভাবে আপনাদের প্রতিটি অনুদান একটি অঞ্চলের বাস্তব দৃশ্যপট বদলে দেয়।
          </p>
        </div>

        {/* Project Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {SYF_BEFORE_AFTER_PROJECTS.map((proj) => {
            const isSelected = proj.id === currentItem.id;
            return (
              <button
                key={proj.id}
                onClick={() => {
                  setSelectedProjectId(proj.id);
                  setSliderPosition(50);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {proj.categoryBn} • {proj.locationBn.split(',')[0]}
              </button>
            );
          })}
        </div>

        {/* Interactive Draggable Split Canvas Container */}
        <div className="max-w-4xl mx-auto bg-slate-800/80 rounded-3xl p-4 sm:p-6 border border-slate-700 shadow-2xl">
          
          <div
            className="relative h-72 sm:h-[420px] rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-inner"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            {/* After Image (Full width background layer) */}
            <img
              src={currentItem.afterImageUrl}
              alt="After Interventions"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* After Label Badge */}
            <div className="absolute top-4 right-4 bg-emerald-600/90 text-white text-xs font-black px-3 py-1 rounded-full shadow-md backdrop-blur-xs">
              ✨ {currentItem.afterLabelBn}
            </div>

            {/* Before Image (Clipped overlay layer) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={currentItem.beforeImageUrl}
                alt="Before Interventions"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%' }}
              />
              <div className="absolute inset-0 bg-slate-950/20" />

              {/* Before Label Badge */}
              <div className="absolute top-4 left-4 bg-rose-600/90 text-white text-xs font-black px-3 py-1 rounded-full shadow-md backdrop-blur-xs">
                ⚠️ {currentItem.beforeLabelBn}
              </div>
            </div>

            {/* Draggable Divider Line & Thumb */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20 flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-10 h-10 -ml-4.5 rounded-full bg-white text-slate-900 shadow-2xl flex items-center justify-center border-2 border-emerald-600">
                <MoveHorizontal className="w-5 h-5 text-emerald-700" />
              </div>
            </div>

            {/* Instruction tooltip at bottom */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-xs text-slate-200 text-[11px] font-semibold px-4 py-1.5 rounded-full pointer-events-none border border-white/10 flex items-center gap-1.5">
              <MoveHorizontal className="w-3.5 h-3.5 text-amber-300" />
              <span>মাউস বা আঙুল দিয়ে স্লাইডারটি ডানে-বামে ড্র্যাগ করুন</span>
            </div>
          </div>

          {/* Project Details below slider */}
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-white">
                {currentItem.titleBn}
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                {currentItem.descriptionBn}
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold pt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{currentItem.impactHighlightBn}</span>
              </div>
            </div>

            <button
              onClick={onOpenDonate}
              className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>অনুরূপ প্রকল্পে অনুদান</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
