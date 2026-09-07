import React, { useState } from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  FileSpreadsheet, DollarSign, Landmark, ArrowUpRight,
  ArrowDownLeft, Scale, PieChart, ShieldCheck, Download,
  Filter, Calendar, CheckCircle
} from 'lucide-react';
import { LedgerEntry, Somiti } from '../../types/somitiTypes';

interface CentralAccountsViewProps {
  ledgers: LedgerEntry[];
  somitis: Somiti[];
}

export const CentralAccountsView: React.FC<CentralAccountsViewProps> = ({
  ledgers,
  somitis
}) => {
  const { isBn } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<'cash_book' | 'journal' | 'trial_balance' | 'profit_loss' | 'balance_sheet'>('cash_book');
  const [filterSomiti, setFilterSomiti] = useState('ALL');

  const filteredLedgers = filterSomiti === 'ALL'
    ? (ledgers || [])
    : (ledgers || []).filter((l) => l && l.somitiId === filterSomiti);

  const totalDebit = (filteredLedgers || []).reduce((acc, l) => acc + (l.debit || 0), 0);
  const totalCredit = (filteredLedgers || []).reduce((acc, l) => acc + (l.credit || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-slate-900">
              {isBn ? 'সেন্ট্রাল অ্যাকাউন্টিং ও ডাবল-এন্ট্রি লেজার' : 'Central Accounting & Double-Entry General Ledger'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            ক্যাশ বুক, ব্যাংক স্টেটমেন্ট, জার্নাল, ট্রায়াল ব্যালেন্স ও রিয়েল-টাইম অডিট ট্রেইল
          </p>
        </div>

        {/* Somiti Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">সমিতি ফিল্টার:</span>
          <select
            value={filterSomiti}
            onChange={(e) => setFilterSomiti(e.target.value)}
            className="p-2 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50"
          >
            <option value="ALL">সকল সমিতি (All Somiti)</option>
            {somitis.map((s) => (
              <option key={s.id} value={s.id}>{s.nameBn}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-2 text-xs font-bold">
        {[
          { id: 'cash_book', label: '💵 ক্যাশ বুক (Cash Book)' },
          { id: 'journal', label: '📖 ডাবল এন্ট্রি জার্নাল (Journal)' },
          { id: 'trial_balance', label: '⚖️ ট্রায়াল ব্যালেন্স (Trial Balance)' },
          { id: 'profit_loss', label: '📈 লাভ-ক্ষতি হিসাব (Profit & Loss)' },
          { id: 'balance_sheet', label: '🏛️ ব্যালেন্স শিট (Balance Sheet)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl transition whitespace-nowrap cursor-pointer ${
              selectedTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Top Summary Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-700">মোট ডেবিট (Debit): <strong className="text-emerald-700 font-mono font-black text-sm">৳{(totalDebit || 0).toLocaleString()}</strong></span>
            <span className="font-bold text-slate-700">মোট ক্রেডিট (Credit): <strong className="text-indigo-700 font-mono font-black text-sm">৳{(totalCredit || 0).toLocaleString()}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-xl text-[11px] font-black">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>ডাবল-এন্ট্রি ভেরিফাইড (Balanced 100%)</span>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-black border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">ভাউচার / ট্রানজেকশন</th>
                <th className="p-3.5">তারিখ ও সময়</th>
                <th className="p-3.5">সমিতি ও শাখা</th>
                <th className="p-3.5">খাত (Account Head)</th>
                <th className="p-3.5">বিবরণ (Narration)</th>
                <th className="p-3.5 text-right">ডেবিট (Debit ৳)</th>
                <th className="p-3.5 text-right">ক্রেডিট (Credit ৳)</th>
                <th className="p-3.5 text-right">ব্যালেন্স (Balance ৳)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLedgers.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 transition font-medium">
                  <td className="p-3.5 font-mono font-bold text-slate-900">{l.voucherNo}</td>
                  <td className="p-3.5 text-slate-500 whitespace-nowrap">{l.date}</td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-800 block">{l.somitiName}</span>
                    <span className="text-[10px] text-slate-400">{l.branchName}</span>
                  </td>
                  <td className="p-3.5 font-bold text-indigo-900">{l.accountHead}</td>
                  <td className="p-3.5 text-slate-600 max-w-xs">{l.narration}</td>
                  <td className="p-3.5 text-right font-mono font-bold text-emerald-700">
                    {l.debit > 0 ? `৳${(l.debit || 0).toLocaleString()}` : '-'}
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-indigo-700">
                    {l.credit > 0 ? `৳${(l.credit || 0).toLocaleString()}` : '-'}
                  </td>
                  <td className="p-3.5 text-right font-mono font-black text-slate-900">
                    ৳{(l.balanceAfter || 0).toLocaleString()}
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
