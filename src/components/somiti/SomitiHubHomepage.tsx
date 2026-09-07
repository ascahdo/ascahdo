import React, { useState } from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  Landmark,
  Building2,
  Users,
  PiggyBank,
  CreditCard,
  Smartphone,
  FileSpreadsheet,
  BarChart2,
  ShieldCheck,
  Search,
  PlusCircle,
  CheckCircle2,
  ArrowRight,
  Calculator,
  Percent,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { useHubBranding } from '../../context/HubBrandingContext';
import { HubBannerSlider } from '../hub/HubBannerSlider';
import { Somiti } from '../../types/somitiTypes';

interface SomitiHubHomepageProps {
  somitis: Somiti[];
  onOpenERP: (tab?: string) => void;
  onOpenSomitiDetail?: (somitiId: string) => void;
  onOpenBranchApply: () => void;
  onOpenDeposit: () => void;
  onOpenLoanApply: () => void;
  onOpenSearch: () => void;
}

export const SomitiHubHomepage: React.FC<SomitiHubHomepageProps> = ({
  somitis,
  onOpenERP,
  onOpenSomitiDetail,
  onOpenBranchApply,
  onOpenDeposit,
  onOpenLoanApply,
  onOpenSearch
}) => {
  const { isBn } = useTranslation();
  const { getHubBranding } = useHubBranding();
  const hub = getHubBranding('somiti');

  // Interactive Calculator State
  const [calcType, setCalcType] = useState<'dps' | 'loan'>('dps');
  const [dpsMonthly, setDpsMonthly] = useState<number>(1000);
  const [dpsYears, setDpsYears] = useState<number>(3);
  const [dpsInterestRate, setDpsInterestRate] = useState<number>(8.5);

  const [loanPrincipal, setLoanPrincipal] = useState<number>(50000);
  const [loanMonths, setLoanMonths] = useState<number>(12);
  const [loanInterestRate, setLoanInterestRate] = useState<number>(10);

  // DPS Calculation
  const totalDpsDeposit = dpsMonthly * (dpsYears * 12);
  const dpsProfit = (totalDpsDeposit * (dpsInterestRate / 100) * dpsYears) / 2;
  const dpsMaturityTotal = Math.round(totalDpsDeposit + dpsProfit);

  // Loan EMI Calculation
  const monthlyRate = loanInterestRate / 100 / 12;
  const emi =
    monthlyRate > 0
      ? (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, loanMonths)) /
        (Math.pow(1 + monthlyRate, loanMonths) - 1)
      : loanPrincipal / loanMonths;
  const totalLoanRepayment = Math.round(emi * loanMonths);
  const totalLoanInterest = Math.round(totalLoanRepayment - loanPrincipal);

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* 1. Dynamic Hero Banner Slider */}
      <section className="relative">
        <HubBannerSlider
          banners={hub.banners || []}
          primaryColor={hub.primaryColor || '#059669'}
          onCtaClick={(link) => {
            if (link === '#erp' || link.includes('erp')) {
              onOpenERP('overview');
            } else if (link === '#somiti_list') {
              onOpenERP('multi_somiti');
            } else if (link === '#apply_branch') {
              onOpenBranchApply();
            } else {
              onOpenERP('overview');
            }
          }}
        />
      </section>

      {/* 2. Top Quick Action Bar */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>ডিজিটাল সমবায় ও সমিতি কুইক অ্যাকশন</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              এক ক্লিকে সদস্য সেবা গ্রহণ করুন অথবা সরাসরি ম্যানেজমেন্ট প্যানেলে প্রবেশ করুন
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto justify-end">
            <button
              onClick={onOpenSearch}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Search className="w-4 h-4 text-emerald-600" />
              <span>স্মার্ট সার্চ</span>
            </button>

            <button
              onClick={onOpenDeposit}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition"
            >
              <PiggyBank className="w-4 h-4 text-emerald-600" />
              <span>সঞ্চয় জমা</span>
            </button>

            <button
              onClick={onOpenLoanApply}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-300 rounded-xl text-xs font-bold transition"
            >
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <span>ঋণ আবেদন</span>
            </button>

            <button
              onClick={onOpenBranchApply}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition"
            >
              <PlusCircle className="w-4 h-4 text-amber-700" />
              <span>নতুন শাখা অনুমোদন</span>
            </button>

            <button
              onClick={() => onOpenERP('overview')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>ম্যানেজমেন্ট ইআরপি</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Live 6 Metric Stats Grid */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {hub.stats?.map((st) => (
            <div
              key={st.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 line-clamp-1">
                  {st.labelBn}
                </span>
                <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <p className="text-lg sm:text-xl font-black text-slate-900 font-serif">
                {st.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Active Somitis Showcase Directory */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <Landmark className="w-5 h-5 text-emerald-600" />
              <span>নিবন্ধিত সক্রিয় সমিতিসমূহ ({somitis.length}টি)</span>
            </h3>
            <p className="text-xs text-slate-500">
              সেন্ট্রাল নেটওয়ার্কের আওতাধীন অনুমোদিত বহুমুখী সমবায় ও সঞ্চয় সমিতি
            </p>
          </div>

          <button
            onClick={() => onOpenERP('multi_somiti')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
          >
            <span>সকল সমিতি দেখুন</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {somitis.slice(0, 6).map((somiti) => (
            <div
              key={somiti.id}
              onClick={() => onOpenSomitiDetail && onOpenSomitiDetail(somiti.id)}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-lg hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {somiti.logo ? (
                      <img
                        src={somiti.logo}
                        alt={somiti.nameBn}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg">
                        {somiti.nameBn.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 font-serif group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {somiti.nameBn}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        কোড: {somiti.code}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                    {somiti.type}
                  </span>
                </div>

                {/* Info & Stats */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center">
                  <div>
                    <span className="block text-[10px] text-slate-400">শাখা</span>
                    <span className="font-bold text-xs text-slate-800">
                      {somiti.totalBranches}টি
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">সদস্য</span>
                    <span className="font-bold text-xs text-slate-800">
                      {somiti.totalMembers} জন
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">মোট সঞ্চয়</span>
                    <span className="font-bold text-xs text-emerald-600">
                      ৳ {(somiti.totalSavings / 100000).toFixed(1)}L
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-2.5 line-clamp-2">
                  {somiti.addressBn || somiti.address}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>পাসবুক ও ব্রাঞ্চ লেজার</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Interactive Financial Calculators (DPS & Loan) */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
              <Calculator className="w-3.5 h-3.5" />
              <span>ইন্টারঅ্যাক্টিভ আর্থিক ক্যালকুলেটর</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif">
              সঞ্চয় ডিপিএস ও ঋণ কিস্তি হিসাব করুন
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              স্বচ্ছ ও নির্ভুল গাণিতিক সূত্রে আপনার মাসিক কিস্তি ও মেয়াদী মুনাফা যাচাই করুন
            </p>
          </div>

          {/* Calc Selector Tabs */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setCalcType('dps')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                calcType === 'dps'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <PiggyBank className="w-4 h-4" />
              <span>ডিপিএস সঞ্চয় হিসাব</span>
            </button>

            <button
              onClick={() => setCalcType('loan')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                calcType === 'loan'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>ঋণ ও ইএমআই হিসাব</span>
            </button>
          </div>

          {/* Calculator Body */}
          {calcType === 'dps' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700">
              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>মাসিক সঞ্চয়ের পরিমাণ</span>
                    <span className="text-emerald-400">৳ {(dpsMonthly || 0).toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="20000"
                    step="500"
                    value={dpsMonthly}
                    onChange={(e) => setDpsMonthly(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>মেয়াদ (বছর)</span>
                    <span className="text-emerald-400">{dpsYears} বছর ({dpsYears * 12} মাস)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={dpsYears}
                    onChange={(e) => setDpsYears(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>বার্ষিক মুনাফার হার (%)</span>
                    <span className="text-emerald-400">{dpsInterestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="15"
                    step="0.5"
                    value={dpsInterestRate}
                    onChange={(e) => setDpsInterestRate(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Output Result Card */}
              <div className="bg-slate-900/90 rounded-xl p-5 border border-emerald-500/30 flex flex-col justify-between text-center">
                <span className="text-xs font-bold text-slate-400">মেয়াদপূর্তিতে সর্বমোট প্রাপ্য</span>
                <div className="my-2">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-serif">
                    ৳ {(dpsMaturityTotal || 0).toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800 pt-3">
                  <div>
                    <span className="text-slate-400 block">মোট মূলধন জমা</span>
                    <span className="font-bold text-white">৳ {(totalDpsDeposit || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">আনুমানিক মুনাফা</span>
                    <span className="font-bold text-emerald-300">৳ {(Math.round(dpsProfit) || 0).toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={onOpenDeposit}
                  className="mt-4 w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition"
                >
                  এখনই সঞ্চয় শুরু করুন
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700">
              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>ঋণের পরিমাণ</span>
                    <span className="text-emerald-400">৳ {(loanPrincipal || 0).toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="5000"
                    value={loanPrincipal}
                    onChange={(e) => setLoanPrincipal(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>পরিশোধ মেয়াদ (মাস)</span>
                    <span className="text-emerald-400">{loanMonths} মাস</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="36"
                    step="1"
                    value={loanMonths}
                    onChange={(e) => setLoanMonths(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>সার্ভিস চার্জ / সুদ হার (%)</span>
                    <span className="text-emerald-400">{loanInterestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="0.5"
                    value={loanInterestRate}
                    onChange={(e) => setLoanInterestRate(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Output Result Card */}
              <div className="bg-slate-900/90 rounded-xl p-5 border border-indigo-500/30 flex flex-col justify-between text-center">
                <span className="text-xs font-bold text-slate-400">মাসিক কিস্তির পরিমাণ (EMI)</span>
                <div className="my-2">
                  <span className="text-2xl sm:text-3xl font-black text-indigo-400 font-serif">
                    ৳ {(Math.round(emi) || 0).toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800 pt-3">
                  <div>
                    <span className="text-slate-400 block">মোট পরিশোধ</span>
                    <span className="font-bold text-white">৳ {(totalLoanRepayment || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">মোট সার্ভিস চার্জ</span>
                    <span className="font-bold text-amber-300">৳ {(totalLoanInterest || 0).toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={onOpenLoanApply}
                  className="mt-4 w-full py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl text-xs shadow-md transition"
                >
                  ঋণের জন্য আবেদন করুন
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. Somiti ERP Features Showcase */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">
            কেন আসকাডো মাল্টি-সমিতি ইআরপি সেরা?
          </h3>
          <p className="text-xs text-slate-500">
            মাঠপর্যায় থেকে সেন্ট্রাল হেড অফিস পর্যন্ত স্বয়ংক্রিয় স্বচ্ছ হিসাব
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">মাঠ কালেক্টর POS</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              কালেক্টররা মোবাইল থেকে তাৎক্ষণিক কিস্তি কালেকশন করে ব্লুটুথ থার্মাল রসিদ প্রিন্ট করতে পারবেন।
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">সদস্য ৩৬০° পাসবুক</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              সদস্যরা তাদের ফোন নম্বর দিয়ে লগইন করে জমার স্থিতি, কিস্তি তালিকা ও সার্টিফিকেট দেখতে পারবেন।
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">ডাবল এন্ট্রি লেজার</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              ক্যাশ বুক, ব্যাংক হিসাব, ট্রায়াল ব্যালেন্স ও প্রফিট-লস স্টেটমেন্ট স্বয়ংক্রিয়ভাবে আপডেট হয়।
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">অডিট ও নিরাপত্তা লগ</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              প্রতিটি লেনদেনের আইপি, টাইমস্ট্যাম্প ও ইউজার আইডি কেন্দ্রীয় অডিট ট্রেইলে সংরক্ষিত থাকে।
            </p>
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA Banner */}
      <section className="bg-emerald-700 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl sm:text-2xl font-bold font-serif">
            আপনার সমবায় সমিতিকে ডিজিটাল রূপান্তর করতে প্রস্তুত?
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100">
            নতুন শাখা রেজিস্ট্রেশন অথবা ফুল ইআরপি সফটওয়্যার ট্রায়াল শুরু করুন আজই।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBranchApply}
            className="px-5 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl font-bold text-xs sm:text-sm shadow-md transition"
          >
            নতুন শাখা আবেদন
          </button>

          <button
            onClick={() => onOpenERP('overview')}
            className="px-5 py-2.5 bg-emerald-900/80 hover:bg-emerald-950 text-white rounded-xl font-bold text-xs sm:text-sm border border-emerald-400/40 shadow-md transition"
          >
            ইআরপি ড্যাশবোর্ড
          </button>
        </div>
      </section>
    </div>
  );
};
