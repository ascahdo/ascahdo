import React, { useState } from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  Building2, MapPin, Users, PiggyBank, CreditCard,
  DollarSign, TrendingUp, UserCheck, ShieldCheck,
  PlusCircle, Phone, Mail, Award, CheckCircle, Search
} from 'lucide-react';
import { SomitiBranch, Somiti } from '../../types/somitiTypes';

interface BranchManagementViewProps {
  branches: SomitiBranch[];
  somitis: Somiti[];
  onOpenBranchApproval: () => void;
}

export const BranchManagementView: React.FC<BranchManagementViewProps> = ({
  branches,
  somitis,
  onOpenBranchApproval
}) => {
  const { isBn } = useTranslation();
  const [selectedBranch, setSelectedBranch] = useState<SomitiBranch>(branches[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBranches = (branches || []).filter(
    (b) =>
      b && (
        (b.nameBn && b.nameBn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.nameEn && b.nameEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.district && b.district.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.id && b.id.toLowerCase().includes(searchQuery.toLowerCase()))
      )
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-black text-slate-900">
              {isBn ? 'শাখা নেটওয়ার্ক ও ব্রাঞ্চ ম্যানেজার ড্যাশবোর্ড' : 'Branch Network & Operations Management'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            সারাদেশের ২৬টি অনুমোদিত শাখা, ফিল্ড কালেকশন পয়েন্ট ও কর্মকর্তা-কর্মচারী রোস্টার
          </p>
        </div>

        <button
          onClick={onOpenBranchApproval}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ {isBn ? 'নতুন শাখা আবেদন ও অনুমোদন' : 'Branch Application & Approval'}</span>
        </button>
      </div>

      {/* Main Grid: Branches List (4 cols) & Branch 360 Dashboard (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Branches Directory */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="শাখা খুঁজুন (নাম/জেলা/আইডি)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
            />
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredBranches.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedBranch(b)}
                className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 text-xs ${
                  selectedBranch.id === b.id
                    ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-500/20'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{b.nameBn}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">{b.id} • {b.district}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {b.status}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                  <span>সদস্য: <strong className="text-slate-900">{b.membersCount} জন</strong></span>
                  <span>সঞ্চয়: <strong className="text-emerald-700">৳{(b.savingsBalance / 100000).toFixed(1)}L</strong></span>
                  <span>ঋণ: <strong className="text-indigo-700">৳{(b.totalLoanDisbursed / 100000).toFixed(1)}L</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Branch 360 Ops Matrix */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Branch Top Hero Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">{selectedBranch.nameBn}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black font-mono">
                    {selectedBranch.code}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  অধিভুক্ত: <strong className="text-slate-800">{selectedBranch.somitiName}</strong> • {selectedBranch.address}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-bold">পারফরম্যান্স গ্রেড</span>
                <span className="text-base font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 inline-block">
                  ⭐ Grade A+ (98.4%)
                </span>
              </div>
            </div>

            {/* Branch 8 KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 block text-[10px] font-bold">শাখা সদস্য</span>
                <span className="text-base font-black text-slate-900">{selectedBranch.membersCount} জন</span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                <span className="text-emerald-800 block text-[10px] font-bold">আজকের কালেকশন</span>
                <span className="text-base font-black text-emerald-950">৳ {(selectedBranch?.todayCollection || 0).toLocaleString()}</span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1">
                <span className="text-slate-500 block text-[10px] font-bold">চলতি মাসের কালেকশন</span>
                <span className="text-base font-black text-slate-900">৳ {(selectedBranch?.monthlyCollection || 0).toLocaleString()}</span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                <span className="text-emerald-800 block text-[10px] font-bold">মোট সঞ্চয় ব্যালেন্স</span>
                <span className="text-base font-black text-emerald-900">৳ {(selectedBranch?.savingsBalance || 0).toLocaleString()}</span>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-1">
                <span className="text-indigo-800 block text-[10px] font-bold">মোট ঋণ বিতরণ</span>
                <span className="text-base font-black text-indigo-900">৳ {(selectedBranch?.totalLoanDisbursed || 0).toLocaleString()}</span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1">
                <span className="text-slate-500 block text-[10px] font-bold">মোট কিস্তি আদায়</span>
                <span className="text-base font-black text-emerald-700">৳ {(selectedBranch?.totalRecovery || 0).toLocaleString()}</span>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 space-y-1">
                <span className="text-rose-800 block text-[10px] font-bold">মোট বকেয়া (Outstanding)</span>
                <span className="text-base font-black text-rose-900">৳ {(selectedBranch?.outstanding || 0).toLocaleString()}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-500 block text-[10px] font-bold">শাখা মাসিক ব্যয়</span>
                <span className="text-base font-black text-slate-800">৳ {(selectedBranch?.monthlyExpenses || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Branch Staff Roster & Hierarchy */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>শাখা কর্মকর্তা-কর্মচারী রোস্টার (Staff Hierarchy)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {(selectedBranch?.staff || []).map((s, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                      {s.role}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">সক্রিয়</span>
                  </div>
                  <h5 className="font-black text-slate-900 text-sm">{s.name}</h5>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{s.phone}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
