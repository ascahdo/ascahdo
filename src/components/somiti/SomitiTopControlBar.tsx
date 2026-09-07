import React from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  Landmark, UserCheck, Search, PlusCircle, Building2,
  PiggyBank, CreditCard, Shield, Smartphone, Bell,
  ChevronDown, Check, Layers
} from 'lucide-react';
import { Somiti, ERPUserRole } from '../../types/somitiTypes';

interface SomitiTopControlBarProps {
  somitis: Somiti[];
  selectedSomitiId: string; // 'ALL' or Somiti ID
  onSelectSomiti: (id: string) => void;
  currentRole: ERPUserRole;
  onChangeRole: (role: ERPUserRole) => void;
  onOpenGlobalSearch: () => void;
  onOpenCreateSomiti: () => void;
  onOpenBranchApproval: () => void;
  onOpenDeposit: () => void;
  onOpenLoanApply: () => void;
  onOpenPOS: () => void;
}

export const SomitiTopControlBar: React.FC<SomitiTopControlBarProps> = ({
  somitis,
  selectedSomitiId,
  onSelectSomiti,
  currentRole,
  onChangeRole,
  onOpenGlobalSearch,
  onOpenCreateSomiti,
  onOpenBranchApproval,
  onOpenDeposit,
  onOpenLoanApply,
  onOpenPOS
}) => {
  const { isBn } = useTranslation();

  const selectedSomiti = somitis.find((s) => s.id === selectedSomitiId);

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-800 space-y-4">
      
      {/* Top Row: Somiti Switcher & Role Selector & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Left: Somiti Switcher */}
        <div className="flex items-center gap-3">
          {selectedSomiti?.logo ? (
            <div className="w-11 h-11 rounded-2xl bg-white p-0.5 shadow-md shrink-0 border border-emerald-500/40 overflow-hidden">
              <img
                src={selectedSomiti.logo}
                alt={selectedSomiti.nameBn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-slate-950 shadow-md shrink-0">
              <Landmark className="w-6 h-6 text-white" />
            </div>
          )}

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest font-black text-emerald-400">
                {isBn ? 'বর্তমান সমিতি নির্বাচন' : 'CURRENT SOMITI'}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono">
                {selectedSomitiId === 'ALL' ? 'CENTRAL ERP' : selectedSomiti?.code}
              </span>
            </div>

            <div className="relative inline-block">
              <select
                value={selectedSomitiId}
                onChange={(e) => onSelectSomiti(e.target.value)}
                className="appearance-none bg-slate-800 hover:bg-slate-750 text-white font-black text-sm sm:text-base pl-3 pr-8 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="ALL">🏢 {isBn ? 'সকল সমিতি একনজরে (All Somiti)' : 'All Somiti'}</option>
                {somitis.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nameBn} ({s.nameEn})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right: Role Switcher & Search Bar Trigger */}
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* Role Simulator Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 text-[10px] font-bold">রোল:</span>
            <select
              value={currentRole}
              onChange={(e) => onChangeRole(e.target.value as ERPUserRole)}
              className="bg-transparent text-emerald-300 font-black focus:outline-none cursor-pointer text-xs"
            >
              <option value="SUPER_ADMIN" className="bg-slate-900 text-white">👑 Super Admin (সবকিছু)</option>
              <option value="NGO_ADMIN" className="bg-slate-900 text-white">🏢 NGO Admin (অর্গানাইজেশন)</option>
              <option value="SOMITI_ADMIN" className="bg-slate-900 text-white">🏛️ Somiti Admin (সমিতি)</option>
              <option value="BRANCH_MANAGER" className="bg-slate-900 text-white">📍 Branch Manager (শাখা)</option>
              <option value="ACCOUNTS_OFFICER" className="bg-slate-900 text-white">📒 Accounts Officer (হিসাব)</option>
              <option value="LOAN_OFFICER" className="bg-slate-900 text-white">💳 Loan Officer (ঋণ)</option>
              <option value="COLLECTOR" className="bg-slate-900 text-white">📱 Collector (কালেকশন)</option>
              <option value="MEMBER" className="bg-slate-900 text-white">👤 Member (সদস্য পোর্টাল)</option>
            </select>
          </div>

          {/* Global Search Trigger */}
          <button
            onClick={onOpenGlobalSearch}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">স্মার্ট সার্চ...</span>
            <kbd className="hidden sm:inline text-[9px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 font-mono">⌘K</kbd>
          </button>
        </div>

      </div>

      {/* Bottom Row: Quick Action Toolbar */}
      <div className="pt-3 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
          {isBn ? 'কুইক অ্যাকশন:' : 'Quick Actions:'}
        </span>

        <button
          onClick={onOpenCreateSomiti}
          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>+ {isBn ? 'নতুন সমিতি' : 'Create Somiti'}</span>
        </button>

        <button
          onClick={onOpenBranchApproval}
          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>+ {isBn ? 'শাখা অনুমোদন' : 'Approve Branch'}</span>
        </button>

        <button
          onClick={onOpenDeposit}
          className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
        >
          <PiggyBank className="w-3.5 h-3.5" />
          <span>+ {isBn ? 'সঞ্চয় জমা' : 'Savings Deposit'}</span>
        </button>

        <button
          onClick={onOpenLoanApply}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>+ {isBn ? 'ঋণ আবেদন' : 'Loan Application'}</span>
        </button>

        <button
          onClick={onOpenPOS}
          className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>📱 {isBn ? 'মোবাইল POS কালেকশন' : 'Mobile POS'}</span>
        </button>
      </div>

    </div>
  );
};
