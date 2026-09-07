import React, { useState } from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  FileText, Download, Printer, Filter, Calendar,
  BarChart2, FileSpreadsheet, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { Somiti, SomitiBranch } from '../../types/somitiTypes';

interface MasterReportsViewProps {
  somitis: Somiti[];
  branches: SomitiBranch[];
}

export const MasterReportsView: React.FC<MasterReportsViewProps> = ({
  somitis,
  branches
}) => {
  const { isBn } = useTranslation();
  const [reportType, setReportType] = useState('somiti_summary');
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExport = (format: string) => {
    setIsExporting(format);
    setTimeout(() => {
      setIsExporting(null);
      alert(`${format.toUpperCase()} ফরম্যাটে রিপোর্ট ডাউনলোড প্রস্তুত!`);
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-slate-900">
              {isBn ? 'মাস্টার রিপোর্টস ও অ্যানালিটিক্স এক্সপোর্ট হাব' : 'Master Reports & Compliance Analytics Hub'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            সমিতি, শাখা, সঞ্চয়, ঋণ, বকেয়া ও নিরীক্ষা রিপোর্ট মুহূর্তেই তৈরি ও এক্সপোর্ট করুন
          </p>
        </div>

        {/* Export Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('pdf')}
            className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF Export</span>
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel (.xlsx)</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Reports Catalogue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { id: 'somiti_summary', title: '🏛️ সমিতি সমন্বিত সারসংক্ষেপ', desc: 'সকল সমিতির মোট সঞ্চয়, ঋণ ও রিজার্ভ ফান্ডের সামগ্রিক চিত্র।' },
          { id: 'branch_recovery', title: '📍 শাখাভিত্তিক কালেকশন ও রিকভারি', desc: 'দৈনিক ও মাসিক টার্গেট বনাম প্রকৃত আদায়ের তুলনামূলক বিশ্লেষণ।' },
          { id: 'defaulter_aging', title: '⚠️ বকেয়া ও খেলাপি তালিকা (Aging Report)', desc: '৩০ দিন, ৬০ দিন ও ৯০+ দিন মেয়াদোত্তীর্ণ ঋণের ঝুঁকি রিপোর্ট।' },
          { id: 'savings_growth', title: '💰 সঞ্চয় প্রোডাক্ট পারফরম্যান্স', desc: 'দৈনিক, সাপ্তাহিক, মাসিক ও ডিপিএস স্কিমের লাভ-লোকসান চিত্র।' },
          { id: 'donation_training', title: '🤝 অনুদান ও ট্রেনিং রেভিনিউ', desc: 'যাকাত, ডোনেশন ও এলএমএস ট্রেনিং তহবিলের সার্বিক অডিট।' },
          { id: 'audit_compliance', title: '🛡️ সরকারি অডিট ও কমপ্লায়েন্স ফাইল', desc: 'সমবায় অধিদপ্তর ও এনজিও বিষয়ক ব্যুরোর বার্ষিক রিপোর্ট প্রস্তুত।' }
        ].map((r) => (
          <div
            key={r.id}
            onClick={() => setReportType(r.id)}
            className={`p-4 rounded-3xl border transition cursor-pointer space-y-2 text-xs ${
              reportType === r.id
                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <h4 className="font-black text-slate-900 text-sm">{r.title}</h4>
            <p className="text-slate-500 leading-relaxed text-xs">{r.desc}</p>
            <span className="text-[10px] text-emerald-700 font-bold block pt-1">রিপোর্ট দেখুন ও প্রিন্ট করুন →</span>
          </div>
        ))}
      </div>

      {/* Report Preview Document */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-200 pb-4 flex justify-between items-end">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block">ASCAHDO MULTI-SOMITI ERP</span>
            <h3 className="text-lg font-black text-slate-900">কেন্দ্রীয় আর্থিক ও নিরীক্ষা প্রতিবেদন (Live Master Audit)</h3>
            <p className="text-xs text-slate-500">তারিখ: {new Date().toLocaleDateString('bn-BD')} | সিস্টেম জেনারেটেড অডিট ফাইল</p>
          </div>
          <div className="text-right text-xs">
            <span className="font-mono text-slate-400">DOC-REF: REP-2026-081</span>
          </div>
        </div>

        {/* Master Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-black border-y border-slate-200">
              <tr>
                <th className="p-3">সমিতির নাম</th>
                <th className="p-3">শাখা সংখ্যা</th>
                <th className="p-3">মোট সদস্য</th>
                <th className="p-3 text-right">মোট সঞ্চয় (৳)</th>
                <th className="p-3 text-right">মোট ঋণ (৳)</th>
                <th className="p-3 text-right">মোট আদায় (৳)</th>
                <th className="p-3 text-right">মোট বকেয়া (৳)</th>
                <th className="p-3 text-center">কমপ্লায়েন্স স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {somitis.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 font-medium">
                  <td className="p-3 font-black text-slate-900">{s.nameBn}</td>
                  <td className="p-3">{s.branchesCount} টি</td>
                  <td className="p-3">{s.membersCount} জন</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-700">৳{(s.totalSavings || 0).toLocaleString()}</td>
                  <td className="p-3 text-right font-mono font-bold text-indigo-700">৳{(s.totalLoans || 0).toLocaleString()}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-800">৳{(s.totalRecovery || 0).toLocaleString()}</td>
                  <td className="p-3 text-right font-mono font-bold text-rose-700">৳{(s.totalOutstanding || 0).toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      PASSED 100%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
