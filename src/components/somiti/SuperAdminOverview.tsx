import React from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  Building2, Landmark, Users, PiggyBank, CreditCard,
  DollarSign, TrendingUp, AlertTriangle, ArrowUpRight,
  ShieldCheck, Heart, GraduationCap, Wallet, CheckCircle,
  FileText, Clock, ArrowRight, BarChart3
} from 'lucide-react';
import { Somiti, SomitiBranch, BranchApplication, SomitiMember, SomitiLoanApp } from '../../types/somitiTypes';

interface SuperAdminOverviewProps {
  somitis: Somiti[];
  branches: SomitiBranch[];
  branchApplications: BranchApplication[];
  members: SomitiMember[];
  loans: SomitiLoanApp[];
  onSelectMember: (m: SomitiMember) => void;
  onOpenBranchApproval: () => void;
  onOpenDeposit: () => void;
  onOpenLoanApply: () => void;
}

export const SuperAdminOverview: React.FC<SuperAdminOverviewProps> = ({
  somitis,
  branches,
  branchApplications,
  members,
  loans,
  onSelectMember,
  onOpenBranchApproval,
  onOpenDeposit,
  onOpenLoanApply
}) => {
  const { isBn } = useTranslation();

  const totalSavings = (somitis || []).reduce((acc, s) => acc + (s?.totalSavings || 0), 0);
  const totalLoans = (somitis || []).reduce((acc, s) => acc + (s?.totalLoans || 0), 0);
  const totalRecovery = (somitis || []).reduce((acc, s) => acc + (s?.totalRecovery || 0), 0);
  const totalOutstanding = (somitis || []).reduce((acc, s) => acc + (s?.totalOutstanding || 0), 0);
  const totalMembers = (somitis || []).reduce((acc, s) => acc + (s?.membersCount || 0), 0);
  const pendingApps = (branchApplications || []).filter((a) => a && (a.status === 'pending' || a.status === 'under_review')).length;

  return (
    <div className="space-y-8">
      
      {/* 16 KPI DASHBOARD CARDS GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>{isBn ? 'সুপার অ্যাডমিন সেন্ট্রাল কন্ট্রোল সেন্টার' : 'Super Admin Central Control Matrix'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              সারাদেশের মাল্টি-সমিতি, শাখা ও আর্থিক কার্যক্রমের সামগ্রিক লাইভ পোর্টফোলিও
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>লাইভ ডেটাবেজ সিঙ্কড</span>
          </span>
        </div>

        {/* 16 Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          
          {/* Card 1: Total Org */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
              <span>মোট NGO/Organization</span>
              <Building2 className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-xl font-black text-slate-900">১ টি (Central)</div>
            <span className="text-[10px] text-indigo-600 font-semibold">ASCAHDO Integrated</span>
          </div>

          {/* Card 2: Total Somiti */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
              <span>মোট সমিতি (Somiti)</span>
              <Landmark className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-xl font-black text-slate-900">{somitis.length} টি</div>
            <span className="text-[10px] text-teal-600 font-semibold">স্বতন্ত্র নিয়ন্ত্রিত সমিতি</span>
          </div>

          {/* Card 3: Total Branch */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
              <span>মোট অনুমোদিত Branch</span>
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl font-black text-slate-900">২৬ টি</div>
            <span className="text-[10px] text-blue-600 font-semibold">সারাদেশে সক্রিয়</span>
          </div>

          {/* Card 4: Pending Branch */}
          <div
            onClick={onOpenBranchApproval}
            className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 shadow-2xs space-y-1 cursor-pointer hover:bg-amber-100 transition"
          >
            <div className="flex justify-between items-center text-amber-800 text-xs font-bold">
              <span>Pending Branch Approval</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl font-black text-amber-950">{pendingApps} টি আবেদন</div>
            <span className="text-[10px] text-amber-700 font-bold underline">যাচাই ও অনুমোদন করুন →</span>
          </div>

          {/* Card 5: Total Members */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
              <span>মোট নিবন্ধিত সদস্য</span>
              <Users className="w-4 h-4 text-slate-700" />
            </div>
            <div className="text-xl font-black text-slate-900">১,৬০০ জন</div>
            <span className="text-[10px] text-emerald-600 font-semibold">+৪৫ জন চলতি মাসে</span>
          </div>

          {/* Card 6: Active Members */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
              <span>সক্রিয় সদস্য (Active)</span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-emerald-900">১,৫৪০ জন</div>
            <span className="text-[10px] text-emerald-600 font-semibold">৯৬.২% অ্যাক্টিভ রেশিও</span>
          </div>

          {/* Card 7: Total Savings */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-2xs space-y-1">
            <div className="flex justify-between items-center text-emerald-800 text-xs font-bold">
              <span>মোট সঞ্চয় স্থিতি</span>
              <PiggyBank className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-emerald-950">৳ {(totalSavings || 0).toLocaleString()}</div>
            <span className="text-[10px] text-emerald-700 font-semibold">দৈনিক/মাসিক/DPS</span>
          </div>

          {/* Card 8: Total Loans */}
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 shadow-2xs space-y-1">
            <div className="flex justify-between items-center text-indigo-800 text-xs font-bold">
              <span>মোট ঋণ বিতরণ</span>
              <CreditCard className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-xl font-black text-indigo-950">৳ {(totalLoans || 0).toLocaleString()}</div>
            <span className="text-[10px] text-indigo-700 font-semibold">ক্ষুদ্র ব্যবসা ও কৃষি</span>
          </div>

          {/* Card 9: Total Recovery */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
              <span>মোট কিস্তি আদায়</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-emerald-700">৳ {(totalRecovery || 0).toLocaleString()}</div>
            <span className="text-[10px] text-emerald-600 font-semibold">রিকভারি রেট ৯৭.৮%</span>
          </div>

          {/* Card 10: Total Outstanding */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
              <span>মোট বকেয়া (Outstanding)</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xl font-black text-rose-700">৳ {(totalOutstanding || 0).toLocaleString()}</div>
            <span className="text-[10px] text-slate-400">শিডিউল কিস্তি চলমান</span>
          </div>

          {/* Card 11: Donation Fund */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
              <span>Donation / যাকাত ফান্ড</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-xl font-black text-slate-900">৳ ৪৫,৬০,০০০</div>
            <span className="text-[10px] text-rose-600 font-semibold">সাজেদা ইয়ুথ অনুদান</span>
          </div>

          {/* Card 12: Training Revenue */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
              <span>Training LMS Revenue</span>
              <GraduationCap className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl font-black text-slate-900">৳ ১৮,২০,০০০</div>
            <span className="text-[10px] text-blue-600 font-semibold">কোর্স ও ভর্তি ফি</span>
          </div>

          {/* Card 13: Total Income */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
              <span>Total Gross Income</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-emerald-900">৳ ২,৩২,৬০,০০০</div>
            <span className="text-[10px] text-emerald-600 font-semibold">সকল খাত সমন্বিত</span>
          </div>

          {/* Card 14: Total Expense */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
              <span>Total Expenses</span>
              <FileText className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-xl font-black text-slate-800">৳ ৪২,৩০,০০০</div>
            <span className="text-[10px] text-slate-500">শাখা ও প্রশাসনিক ব্যয়</span>
          </div>

          {/* Card 15: Cash Balance */}
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 shadow-2xs space-y-1">
            <div className="flex justify-between items-center text-teal-800 text-xs font-bold">
              <span>Cash Balance (ক্যাশ ইন হ্যান্ড)</span>
              <Wallet className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-xl font-black text-teal-950">৳ ৩৪,২০,০০০</div>
            <span className="text-[10px] text-teal-700 font-semibold">শাখা ভল্ট ও কালেকশন</span>
          </div>

          {/* Card 16: Bank Balance */}
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 shadow-2xs space-y-1">
            <div className="flex justify-between items-center text-sky-800 text-xs font-bold">
              <span>Bank Balance (ব্যাংক স্থিতি)</span>
              <Landmark className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-xl font-black text-sky-950">৳ ১,৫৬,১০,০০০</div>
            <span className="text-[10px] text-sky-700 font-semibold">ইসলামী ব্যাংক ও ব্র্যাক ব্যাংক</span>
          </div>

        </div>
      </div>

      {/* Somiti-Wise Portfolio Performance Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Landmark className="w-4 h-4 text-emerald-600" />
          <span>সমিতিভিত্তিক সঞ্চয় ও ঋণ পোর্টফোলিও পারফরম্যান্স</span>
        </h4>

        <div className="space-y-3">
          {somitis.map((s) => (
            <div key={s.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                <div>
                  <span className="font-black text-slate-900 text-sm">{s.nameBn}</span>
                  <span className="text-xs text-slate-500 font-medium ml-2">({s.nameEn}) • শাখা: {s.branchesCount}টি</span>
                </div>
                <div className="text-xs font-bold text-slate-700">
                  সঞ্চয়: <span className="text-emerald-700 font-black">৳{(s.totalSavings || 0).toLocaleString()}</span> | 
                  ঋণ: <span className="text-indigo-700 font-black ml-1">৳{(s.totalLoans || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
                <div
                  className="bg-emerald-600 h-2"
                  style={{ width: `${(s.totalSavings / 5000000) * 100}%` }}
                ></div>
                <div
                  className="bg-indigo-600 h-2"
                  style={{ width: `${(s.totalLoans / 5000000) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Members Showcase */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-black text-slate-900">সাম্প্রতিক সক্রিয় সদস্য প্রোফাইল ও Member 360°</h4>
            <p className="text-xs text-slate-500">যেকোনো সদস্যের সম্পূর্ণ ফাইল দেখতে ক্লিক করুন</p>
          </div>
          <button
            onClick={onOpenDeposit}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
          >
            + দ্রুত সঞ্চয় জমা
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {members.map((m) => (
            <div
              key={m.id}
              onClick={() => onSelectMember(m)}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 transition cursor-pointer space-y-3 group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={m.photoUrl}
                  alt={m.fullName}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-400 group-hover:scale-105 transition"
                />
                <div>
                  <h5 className="font-black text-slate-900 text-sm group-hover:text-emerald-800 transition">{m.fullName}</h5>
                  <p className="text-xs text-slate-500 font-mono">ID: {m.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-slate-500 block text-[10px]">সঞ্চয় স্থিতি</span>
                  <span className="font-black text-emerald-700">৳ {(m?.savingsBalance || 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">সক্রিয় ঋণ বকেয়া</span>
                  <span className="font-black text-rose-700">৳ {(m?.outstanding || 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 pt-1">
                <span>Member 360° ফাইল দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
