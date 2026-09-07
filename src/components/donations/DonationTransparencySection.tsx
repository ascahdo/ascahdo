import React, { useState } from 'react';
import { TransparencySummary, DonationExpense } from '../../types/donationTypes';
import { formatTakaBn } from '../../utils/donationUtils';
import {
  ShieldCheck, TrendingUp, TrendingDown, DollarSign,
  FileSpreadsheet, Download, PieChart, CheckCircle2,
  Calendar, Building, ArrowUpRight, Award, Layers
} from 'lucide-react';

interface DonationTransparencySectionProps {
  summary: TransparencySummary;
  expenses?: DonationExpense[];
}

export const DonationTransparencySection: React.FC<DonationTransparencySectionProps> = ({
  summary,
  expenses = []
}) => {
  const [activeTab, setActiveTab] = useState<'sectors' | 'monthly' | 'expenses'>('sectors');

  const handleDownloadReport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Sector,Collected (BDT),Spent (BDT),Percentage\n" +
      (summary?.sectorBreakdown || [])
        .map((s) => `"${s.categoryNameBn}",${s.collected},${s.spent},"${s.percentageOfTotal}%"`)
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ASCAHDO_Financial_Audit_Report_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const spentPercentage = Math.round((summary.totalSpent / summary.totalCollected) * 100);
  const reservePercentage = 100 - spentPercentage;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            ১০০% স্বচ্ছ ডিজিটাল অডিট লেজার ও ট্র্যাকিং
          </div>
          <h2 className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
            আর্থিক স্বচ্ছতা ও কেন্দ্রীয় আয়-ব্যয় খতিয়ান
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            আপনার প্রতিটি টাকার আমানত সম্পূর্ণ স্বচ্ছতার সাথে অডিট করা হয়। সরকারি ও আন্তর্জাতিক মানদণ্ড মেনে প্রতিটি খাতের সরাসরি ব্যয় তালিকা উন্মুক্ত রাখা হয়েছে।
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>অডিট স্টেটমেন্ট ডাউনলোড (CSV)</span>
        </button>
      </div>

      {/* 3 Big Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Collected */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-bold">
            <span>সর্বমোট অনুদান সংগ্রহ</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-mono font-extrabold text-2xl text-emerald-950">
            {formatTakaBn(summary.totalCollected)}
          </div>
          <p className="text-[11px] text-emerald-700">
            {Number(summary?.totalDonorsCount || 0).toLocaleString()} জন সম্মানিত দাতার অংশগ্রগণ
          </p>
        </div>

        {/* Total Spent */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-blue-700 font-bold">
            <span>মানবিক ত্রাণ ও প্রকল্পে ব্যয়</span>
            <TrendingDown className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-mono font-extrabold text-2xl text-blue-950">
            {formatTakaBn(summary.totalSpent)}
          </div>
          <p className="text-[11px] text-blue-700">
            মোট সংগৃহীত অর্থের {spentPercentage}% সরাসরি মাঠপর্যায়ে বিতরণ
          </p>
        </div>

        {/* Reserve Balance */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-amber-700 font-bold">
            <span>তহবিল স্থিতি (Emergency Reserve)</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-mono font-extrabold text-2xl text-amber-950">
            {formatTakaBn(summary.reserveBalance)}
          </div>
          <p className="text-[11px] text-amber-700">
            চলমান ও আসন্ন দুর্যোগ মোকাবেলায় জমা সংরক্ষিত
          </p>
        </div>
      </div>

      {/* Sub-tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'sectors', title: 'খাতভিত্তিক আয় ও ব্যয় (Sector Breakdown)', icon: PieChart },
          { id: 'monthly', title: 'মাসভিত্তিক আর্থিক গতিবিধি (Monthly Trends)', icon: Calendar },
          { id: 'expenses', title: 'সাম্প্রতিক ফিল্ড ব্যয় ভাউচার (Field Expenses)', icon: FileSpreadsheet }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.title}</span>
          </button>
        ))}
      </div>

      {/* 1. SECTOR BREAKDOWN VIEW */}
      {activeTab === 'sectors' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(summary?.sectorBreakdown || []).map((sec, idx) => {
              const utilPercentage = Math.round((sec.spent / sec.collected) * 100);
              return (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-xs text-slate-900">{sec.categoryNameBn}</h4>
                    <span className="text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {sec.percentageOfTotal}% তহবিল
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">সংগৃহীত অনুদান:</span>
                      <span className="font-mono font-bold text-slate-800">{formatTakaBn(sec.collected)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">মাঠপর্যায়ে ব্যয়:</span>
                      <span className="font-mono font-bold text-emerald-700">{formatTakaBn(sec.spent)}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, utilPercentage)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                      <span>ব্যয়ের হার: {utilPercentage}%</span>
                      <span>অবশিষ্ট: {formatTakaBn(sec.collected - sec.spent)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. MONTHLY TRENDS VIEW */}
      {activeTab === 'monthly' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                <th className="py-3 px-4">মাস ও অর্থবছর</th>
                <th className="py-3 px-4">মোট সংগ্রহ</th>
                <th className="py-3 px-4">প্রকল্পে ব্যয়</th>
                <th className="py-3 px-4">মাসিক নেট ব্যালেন্স</th>
                <th className="py-3 px-4 text-right">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {(summary?.monthlyReports || []).map((rep, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{rep.monthBn}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">{formatTakaBn(rep.collected)}</td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{formatTakaBn(rep.spent)}</td>
                  <td className="py-3 px-4 font-mono text-slate-800">{formatTakaBn(rep.collected - rep.spent)}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      অডিট সম্পন্ন
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. FIELD EXPENSES VIEW */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {expenses.map((exp) => (
              <div key={exp.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                      {exp.voucherNumber}
                    </span>
                    <h4 className="font-bold text-slate-900 mt-1">{exp.purposeBn}</h4>
                  </div>
                  <span className="font-mono font-extrabold text-sm text-rose-700">
                    -{formatTakaBn(exp.amount)}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 space-y-0.5 pt-1 border-t border-slate-200">
                  <p>খাত: <span className="font-semibold text-emerald-800">{exp.categoryNameBn}</span></p>
                  <p>ভেন্ডর / গ্রহণকারী: <span className="font-semibold text-slate-800">{exp.recipientOrVendorBn}</span></p>
                  <p>তারিখ: <span className="text-slate-500">{exp.spentDate}</span> | অনুমোদক: <span className="text-slate-700">{exp.approvedBy}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
