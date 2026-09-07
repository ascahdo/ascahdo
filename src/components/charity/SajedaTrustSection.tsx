import React from 'react';
import { TrendingUp, ShieldCheck, HeartHandshake, Lock, CheckCircle2 } from 'lucide-react';
import { SYF_TRUST_PILLARS } from '../../data/sajedaCharityData';

export const SajedaTrustSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-emerald-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-emerald-600" />;
      case 'Lock':
        return <Lock className="w-6 h-6 text-emerald-600" />;
      default:
        return <CheckCircle2 className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <section className="py-16 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>বিশ্বস্ততা ও দায়বদ্ধতা</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            আপনার আস্থা আমাদের সবচেয়ে বড় শক্তি
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            সাজেদা ইয়ুথ ফাউন্ডেশন প্রতিটি অনুদানের আমানত শতভাগ সততা ও শরীয়াহসম্মত নিয়মে ব্যয় করে।
          </p>
        </div>

        {/* Trust Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SYF_TRUST_PILLARS.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-slate-200/80 transition transform hover:-translate-y-1 text-left space-y-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition duration-300">
                {getIcon(card.icon)}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-800 transition">
                  {card.titleBn}
                </h3>
                <span className="text-[11px] font-mono font-bold text-slate-400 block">
                  {card.titleEn}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">
                  {card.descBn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
