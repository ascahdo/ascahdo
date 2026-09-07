import React from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  Landmark, PlusCircle, Edit3, ShieldCheck, Phone,
  Mail, MapPin, Building2, CheckCircle, AlertCircle,
  PiggyBank, CreditCard, Users, ExternalLink, Archive
} from 'lucide-react';
import { Somiti } from '../../types/somitiTypes';

interface MultiSomitiViewProps {
  somitis: Somiti[];
  onOpenCreateSomiti: () => void;
  onEditSomiti: (somiti: Somiti) => void;
  onToggleStatus: (somitiId: string) => void;
}

export const MultiSomitiView: React.FC<MultiSomitiViewProps> = ({
  somitis,
  onOpenCreateSomiti,
  onEditSomiti,
  onToggleStatus
}) => {
  const { isBn } = useTranslation();

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-slate-900">
              {isBn ? 'মাল্টি-সমিতি রেজিস্ট্রি ও ব্যবস্থাপনা' : 'Multi-Somiti Registry & Governance'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            প্রতিটি সমিতির পৃথক ডেটাবেজ, পরিচালনা পর্ষদ, ব্যাংক হিসাব ও স্বায়ত্তশাসিত অডিট
          </p>
        </div>

        <button
          onClick={onOpenCreateSomiti}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ {isBn ? 'নতুন সমিতি যুক্ত করুন' : 'Create New Somiti'}</span>
        </button>
      </div>

      {/* Somitis Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {somitis.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5 flex flex-col justify-between hover:shadow-md transition"
          >
            {/* Top Identity Row */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {s.logo ? (
                    <div className="w-12 h-12 rounded-2xl bg-white p-0.5 shadow-md shrink-0 border border-slate-200 overflow-hidden">
                      <img
                        src={s.logo}
                        alt={s.nameBn}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-black flex items-center justify-center text-base shadow-md">
                      {s.code}
                    </div>
                  )}
                  <div>
                    <h4 className="text-base font-black text-slate-900 leading-tight">{s.nameBn}</h4>
                    <p className="text-xs font-semibold text-slate-500">{s.nameEn}</p>
                    <span className="text-[10px] text-emerald-700 font-mono font-bold">
                      রেজিস্ট্রেশন নং: {s.regNumber}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-black ${
                    s.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {s.status === 'active' ? '🟢 সক্রিয় (Active)' : '🔴 স্থগিত (Suspended)'}
                </span>
              </div>

              {/* Financial Summary Strip */}
              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">মোট সঞ্চয়</span>
                  <span className="font-black text-emerald-700 text-sm">৳ {(s?.totalSavings || 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">মোট ঋণ</span>
                  <span className="font-black text-indigo-700 text-sm">৳ {(s?.totalLoans || 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">সদস্য ও শাখা</span>
                  <span className="font-black text-slate-800 text-sm">{s.membersCount} জন • {s.branchesCount}টি</span>
                </div>
              </div>

              {/* Committee Members Table */}
              <div className="space-y-1.5 text-xs">
                <span className="font-black text-slate-700 uppercase tracking-wider text-[10px] block">
                  পরিচালনা পর্ষদ ও এক্সিকিউটিভ বডি:
                </span>
                
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                    <span className="text-slate-400 block text-[9px] font-bold">সভাপতি (President):</span>
                    <span className="font-bold text-slate-900">{s.president.name}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                    <span className="text-slate-400 block text-[9px] font-bold">সাধারণ সম্পাদক (Secretary):</span>
                    <span className="font-bold text-slate-900">{s.secretary.name}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                    <span className="text-slate-400 block text-[9px] font-bold">কোষাধ্যক্ষ (Treasurer):</span>
                    <span className="font-bold text-slate-900">{s.treasurer.name}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                    <span className="text-slate-400 block text-[9px] font-bold">শাখা ব্যবস্থাপক (Manager):</span>
                    <span className="font-bold text-slate-900">{s.manager.name}</span>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-xs flex justify-between items-center">
                <div>
                  <span className="text-slate-500 text-[10px] block">কেন্দ্রীয় ব্যাংক অ্যাকাউন্ট:</span>
                  <span className="font-black text-emerald-950 font-mono">{s.bankName} • A/C: {s.bankAccount}</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold font-mono">Routing: {s.routingNumber}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-400 text-[10px]">প্রতিষ্ঠাকাল: {s.establishedYear}</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleStatus(s.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  {s.status === 'active' ? 'স্থগিত করুন' : 'সক্রিয় করুন'}
                </button>

                <button
                  onClick={() => onEditSomiti(s)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>সম্পাদনা</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
