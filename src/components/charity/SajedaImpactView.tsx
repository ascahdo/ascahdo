import React from 'react';
import { SajedaImpactCounter } from './SajedaImpactCounter';
import { SajedaBeforeAfterSlider } from './SajedaBeforeAfterSlider';
import { SajedaImpactStoriesSection } from './SajedaImpactStoriesSection';
import { SajedaTransparencyDashboard } from './SajedaTransparencyDashboard';
import { Sparkles, Heart } from 'lucide-react';

interface SajedaImpactViewProps {
  onOpenDonate?: () => void;
}

export const SajedaImpactView: React.FC<SajedaImpactViewProps> = ({ onOpenDonate }) => {
  return (
    <div className="space-y-0 text-left">
      {/* Banner */}
      <div className="py-12 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Measurable Impact Hub</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              বাস্তব পরিবর্তন ও জবাবদিহিতা
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              আপনার প্রতিটি অনুদান কীভাবে মানুষের জীবন বদলে দিচ্ছে—তার বিস্তারিত খতিয়ান, অডিট ও গল্প।
            </p>
          </div>
        </div>
      </div>

      <SajedaImpactCounter />
      <SajedaBeforeAfterSlider onOpenDonate={onOpenDonate} />
      <SajedaImpactStoriesSection onOpenDonate={onOpenDonate} />
      <SajedaTransparencyDashboard />
    </div>
  );
};
