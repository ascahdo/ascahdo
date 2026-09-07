import React from 'react';
import { Building2, Sparkles, HeartHandshake, ShieldCheck } from 'lucide-react';
import { SYF_PARTNERS } from '../../data/sajedaCharityData';

export const SajedaPartnersSection: React.FC = () => {
  return (
    <section className="py-16 bg-white text-slate-900 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span>Strategic Alliances</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            আমাদের পাশে যারা
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            মানবতার সেবায় সম্মিলিত শক্তিতে এগিয়ে চলা বিভিন্ন ব্যাংক, প্রতিষ্ঠান ও আন্তর্জাতিক মানবিক সহযোগীরা।
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {SYF_PARTNERS.map((partner) => (
            <div
              key={partner.id}
              className="bg-slate-50 hover:bg-emerald-50/50 p-6 rounded-3xl border border-slate-200/80 transition transform hover:-translate-y-1 text-center space-y-3 flex flex-col items-center justify-between"
            >
              <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-xs border border-slate-200 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-emerald-700" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                  {partner.nameBn}
                </h4>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                  {partner.typeBn}
                </span>
                <p className="text-[11px] text-slate-500 font-medium pt-1">
                  {partner.contributionHighlightBn}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
