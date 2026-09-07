import React, { useState, useEffect } from 'react';
import {
  OfficialDonationTransaction,
  DonationProject,
  EmergencyAppeal,
  DonationExpense,
  TransparencySummary,
  DonationCategoryType
} from '../../types/donationTypes';
import { DONATION_CATEGORIES, formatTakaBn } from '../../utils/donationUtils';
import { api } from '../../services/api';
import {
  Heart, PlusCircle, Search, Trash2, Edit3, Eye, Download,
  CheckCircle, Filter, FileText, Building2, AlertCircle,
  Receipt, ArrowUpRight, DollarSign, RefreshCw, X, ShieldCheck
} from 'lucide-react';
import { DonationReceiptModal } from './DonationReceiptModal';

export const AdminDonationManager: React.FC = () => {
  type SubTab = 'transactions' | 'projects' | 'appeals' | 'expenses' | 'transparency';
  const [subTab, setSubTab] = useState<SubTab>('transactions');

  // Data States
  const [transactions, setTransactions] = useState<OfficialDonationTransaction[]>([]);
  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [appeals, setAppeals] = useState<EmergencyAppeal[]>([]);
  const [expenses, setExpenses] = useState<DonationExpense[]>([]);
  const [summary, setSummary] = useState<TransparencySummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Receipt Modal for Admin Viewing
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<OfficialDonationTransaction | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Project Modal State
  const [projectModal, setProjectModal] = useState<{
    isOpen: boolean;
    isNew: boolean;
    data: Partial<DonationProject>;
  }>({
    isOpen: false,
    isNew: true,
    data: {}
  });

  // Appeal Modal State
  const [appealModal, setAppealModal] = useState<{
    isOpen: boolean;
    isNew: boolean;
    data: Partial<EmergencyAppeal>;
  }>({
    isOpen: false,
    isNew: true,
    data: {}
  });

  // Expense Modal State
  const [expenseModal, setExpenseModal] = useState<{
    isOpen: boolean;
    isNew: boolean;
    data: Partial<DonationExpense>;
  }>({
    isOpen: false,
    isNew: true,
    data: {}
  });

  // Notification Banner
  const [bannerMsg, setBannerMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showBanner = (text: string, type: 'success' | 'error' = 'success') => {
    setBannerMsg({ type, text });
    setTimeout(() => setBannerMsg(null), 4000);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [txRes, prjRes, aplRes, expRes, sumRes] = await Promise.all([
        api.getDonationTransactions(),
        api.getDonationProjects(),
        api.getEmergencyAppeals(),
        api.getDonationExpenses(),
        api.getDonationSummary()
      ]);
      setTransactions(txRes || []);
      setProjects(prjRes || []);
      setAppeals(aplRes || []);
      setExpenses(expRes || []);
      setSummary(sumRes || null);
    } catch (err: any) {
      showBanner(err.message || 'ডাটা লোড করতে সমস্যা হয়েছে', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Transactions
  const filteredTransactions = (transactions || []).filter((t) => {
    if (!t) return false;
    const matchSearch =
      searchTerm === '' ||
      (t.receiptNumber && t.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.transactionId && t.transactionId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.donorName && t.donorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.donorPhone && t.donorPhone.includes(searchTerm));

    const matchCategory = categoryFilter === 'all' || t.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;

    return matchSearch && matchCategory && matchStatus;
  });

  // Handlers
  const handleApproveTransaction = async (id: string) => {
    try {
      await api.approveDonationTransaction(id);
      showBanner('অনলাইন ট্রানজেকশন সফলভাবে অনুমোদিত হয়েছে!');
      loadData();
    } catch (err: any) {
      showBanner(err.message || 'অনুমোদন ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleDeleteTransaction = async (id: string, receiptNo: string) => {
    if (!window.confirm(`আপনি কি নিশ্চিত যে রসিদ নম্বর ${receiptNo} মুছে ফেলতে চান?`)) return;
    try {
      await api.deleteDonationTransaction(id);
      showBanner('ট্রানজেকশন রেকর্ড মুছে ফেলা হয়েছে!');
      loadData();
    } catch (err: any) {
      showBanner(err.message || 'মুছে ফেলতে সমস্যা হয়েছে', 'error');
    }
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ['রসিদ নং,ট্রানজেকশন আইডি,দাতার নাম,মোবাইল,জেলা,খাত,পরিমাণ (টাকা),মেথড,স্ট্যাটাস,তারিখ'];
    const rows = transactions.map((t) =>
      `"${t.receiptNumber}","${t.transactionId}","${t.donorName}","${t.donorPhone}","${t.donorDistrict || ''}","${t.categoryNameBn || t.category}","${t.amount}","${t.paymentMethod}","${t.status}","${t.createdAt}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Donation_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save Project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (projectModal.isNew) {
        await api.createDonationProject(projectModal.data);
        showBanner('নতুন অনুদান প্রকল্প সফলভাবে তৈরি হয়েছে!');
      } else {
        await api.updateDonationProject(projectModal.data.id!, projectModal.data);
        showBanner('প্রকল্পের বিবরণ সফলভাবে আপডেট হয়েছে!');
      }
      setProjectModal({ isOpen: false, isNew: true, data: {} });
      loadData();
    } catch (err: any) {
      showBanner(err.message || 'প্রকল্প সংরক্ষণ ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!window.confirm(`আপনি কি "${title}" প্রকল্পটি মুছে ফেলতে চান?`)) return;
    try {
      await api.deleteDonationProject(id);
      showBanner('প্রকল্প সফলভাবে মুছে ফেলা হয়েছে!');
      loadData();
    } catch (err: any) {
      showBanner(err.message || 'মুছতে ব্যর্থ হয়েছে', 'error');
    }
  };

  // Save Expense
  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (expenseModal.isNew) {
        await api.createDonationExpense(expenseModal.data);
        showBanner('নতুন ব্যয় ভাউচার সফলভাবে লিপিবদ্ধ হয়েছে!');
      } else {
        await api.updateDonationExpense(expenseModal.data.id!, expenseModal.data);
        showBanner('ব্যয় ভাউচার আপডেট হয়েছে!');
      }
      setExpenseModal({ isOpen: false, isNew: true, data: {} });
      loadData();
    } catch (err: any) {
      showBanner(err.message || 'ব্যয় ভাউচার সংরক্ষণ ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleDeleteExpense = async (id: string, voucherNo: string) => {
    if (!window.confirm(`ভাউচার নম্বর ${voucherNo} মুছে ফেলতে চান?`)) return;
    try {
      await api.deleteDonationExpense(id);
      showBanner('ব্যয় ভাউচার সফলভাবে মুছে ফেলা হয়েছে!');
      loadData();
    } catch (err: any) {
      showBanner(err.message || 'মুছতে ব্যর্থ হয়েছে', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Notification */}
      {bannerMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in ${
            bannerMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{bannerMsg.text}</span>
          <button onClick={() => setBannerMsg(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Admin Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <span>সেন্ট্রাল ডোনেশন ও তহবিল ব্যবস্থাপনা হাব</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold uppercase">
                  Central Treasury
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                সকল অনলাইন অনুদান, ব্যাংক জমার রসিদ, মানবিক প্রকল্প ও মাঠপর্যায়ের ভাউচার সম্পূর্ণ অডিটসহ নিয়ন্ত্রণ করুন।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>রিপোর্ট এক্সপোর্ট (CSV)</span>
            </button>
            <button
              onClick={loadData}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2.5 rounded-xl transition flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              <span>রিফ্রেশ</span>
            </button>
          </div>
        </div>

        {/* Live Treasury Stat Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 block">মোট সংগৃহীত অনুদান</span>
            <span className="text-lg sm:text-xl font-mono font-black text-emerald-700">
              {summary ? formatTakaBn(summary.totalCollected) : '৳ ৩৮,৯০,০০০'}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 block">মাঠপর্যায়ে মোট ব্যয়</span>
            <span className="text-lg sm:text-xl font-mono font-black text-rose-700">
              {summary ? formatTakaBn(summary.totalSpent) : '৳ ৩২,১০,০০০'}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 block">তহবিল বর্তমান উদ্বৃত্ত</span>
            <span className="text-lg sm:text-xl font-mono font-black text-slate-900">
              {summary ? formatTakaBn(summary.reserveBalance) : '৳ ৬,৮০,০০০'}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 block">মোট ট্রানজেকশন রেকর্ড</span>
            <span className="text-lg sm:text-xl font-mono font-black text-blue-700">
              {transactions.length} টি
            </span>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-2">
          {[
            { id: 'transactions', label: `💳 অনুদান তালিকা ও রসিদ (${transactions.length})` },
            { id: 'projects', label: `📁 প্রকল্প পরিচালনা (${projects.length})` },
            { id: 'appeals', label: `🚨 জরুরি আবেদন (${appeals.length})` },
            { id: 'expenses', label: `🧾 ব্যয় ভাউচার (${expenses.length})` },
            { id: 'transparency', label: '📊 অডিট ও স্বচ্ছতা রিপোর্ট' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as SubTab)}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl transition ${
                subTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          SUB-TAB 1: TRANSACTIONS & RECEIPT RECORDS
      ======================================================== */}
      {subTab === 'transactions' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="রসিদ নং, TrxID, দাতার নাম বা মোবাইল দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="all">সকল খাতের দান</option>
                {DONATION_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameBn}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="all">সকল স্ট্যাটাস</option>
                <option value="paid">অনুমোদিত (Paid)</option>
                <option value="pending">অপেক্ষমান (Pending)</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">রসিদ ও TrxID</th>
                  <th className="py-3 px-4">দাতার নাম ও যোগাযোগ</th>
                  <th className="py-3 px-4">দানের খাত</th>
                  <th className="py-3 px-4">পরিমাণ</th>
                  <th className="py-3 px-4">মেথড</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                  <th className="py-3 px-4">তারিখ</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-500 font-bold">
                      কোনো ট্রানজেকশন রেকর্ড পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-slate-900 block">{tx.receiptNumber}</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                          {tx.transactionId}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">
                          {tx.donorName} {tx.isAnonymous && <span className="text-[10px] text-amber-600 bg-amber-50 px-1 rounded">(বেনামী)</span>}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">{tx.donorPhone}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">{tx.categoryNameBn || tx.category}</span>
                        {tx.campaignTitle && (
                          <span className="text-[10px] text-slate-500 block truncate max-w-xs">{tx.campaignTitle}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 text-sm">
                        {formatTakaBn(tx.amount)}
                      </td>

                      <td className="py-3.5 px-4 uppercase font-bold text-[11px] text-slate-700">
                        <span className="px-2 py-0.5 rounded bg-slate-100">{tx.paymentMethod}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {tx.status === 'paid' ? 'পরিশোধিত' : tx.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(tx.createdAt).toLocaleDateString('bn-BD')}
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedTxForReceipt(tx);
                            setIsReceiptModalOpen(true);
                          }}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg text-xs font-bold transition inline-flex items-center gap-1"
                          title="রসিদ ও সার্টিফিকেট দেখুন"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>রসিদ</span>
                        </button>

                        <button
                          onClick={() => handleDeleteTransaction(tx.id, tx.receiptNumber)}
                          className="text-rose-600 hover:bg-rose-50 p-1 rounded-lg transition"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: PROJECTS & CAMPAIGNS MANAGER
      ======================================================== */}
      {subTab === 'projects' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h4 className="font-bold text-base text-slate-900">কল্যাণ প্রকল্প ও ক্যাম্পেইন ব্যবস্থাপনা</h4>
              <p className="text-xs text-slate-500">চলমান ও সম্পন্ন প্রকল্পের লক্ষ্যমাত্রা, অর্জন ও অগ্রগতি আপডেট করুন।</p>
            </div>

            <button
              onClick={() =>
                setProjectModal({
                  isOpen: true,
                  isNew: true,
                  data: {
                    title: 'Clean Water Tube-well Installation 2026',
                    titleBn: '২০২৬ চরাঞ্চলে আর্সেনিকমুক্ত গভীর নলকূপ স্থাপন প্রকল্প',
                    category: 'clean_water',
                    categoryNameBn: 'বিশুদ্ধ খাবার পানি প্রকল্প',
                    descriptionBn: 'উপকূলীয় লবণাক্ত ও খরাপ্রবণ এলাকায় সুবিধাবঞ্চিত মানুষের জন্য বিশুদ্ধ খাবার পানির সংস্থান।',
                    targetAmount: 600000,
                    raisedAmount: 150000,
                    status: 'ongoing',
                    locationBn: 'সাতক্ষীরা ও বাগেরহাট',
                    beneficiariesCount: 4500,
                    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f0?w=600&auto=format&fit=crop&q=80'
                  }
                })
              }
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>নতুন প্রকল্প যোগ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p) => (
              <div key={p.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                      {p.categoryNameBn || p.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {p.status}
                    </span>
                  </div>

                  <h5 className="font-bold text-sm text-slate-900 leading-snug">{p.titleBn}</h5>
                  <p className="text-xs text-slate-600 line-clamp-2">{p.descriptionBn}</p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-200 text-xs">
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">লক্ষ্যমাত্রা:</span>
                    <span className="font-bold">{formatTakaBn(p.targetAmount)}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">সংগৃহীত:</span>
                    <span className="font-bold text-emerald-700">{formatTakaBn(p.raisedAmount)}</span>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() =>
                        setProjectModal({
                          isOpen: true,
                          isNew: false,
                          data: { ...p }
                        })
                      }
                      className="text-emerald-700 hover:text-emerald-800 font-bold text-xs flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>এডিট</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(p.id, p.titleBn)}
                      className="text-rose-600 hover:text-rose-700 font-bold text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>মুছুন</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 3: EMERGENCY APPEALS
      ======================================================== */}
      {subTab === 'appeals' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-base text-slate-900">জরুরি মানবিক ও দুর্যোগ ত্রাণ আবেদন</h4>
              <p className="text-xs text-slate-500">জরুরি চিকিৎসা ও আকস্মিক বন্যা/দুর্যোগের ফান্ড পরিচালনা করুন।</p>
            </div>

            <button
              onClick={() =>
                setAppealModal({
                  isOpen: true,
                  isNew: true,
                  data: {
                    titleBn: 'জরুরি অ্যাম্বুলেন্স ও অক্সিজেন সহায়তা ফান্ড',
                    category: 'medical_aid',
                    descriptionBn: 'হতদরিদ্র রোগীদের জন্য ২৪ ঘণ্টা ফ্রি অ্যাম্বুলেন্স সেবা চালু রাখার জরুরি সহায়তা।',
                    targetAmount: 500000,
                    raisedAmount: 120000,
                    locationBn: 'সদর হাসপাতাল চত্বর',
                    daysLeft: 15,
                    imageUrl: 'https://images.unsplash.com/photo-1587745416684-47b883828119?w=600&auto=format&fit=crop&q=80'
                  }
                })
              }
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>নতুন জরুরি আবেদন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appeals.map((apl) => (
              <div key={apl.id} className="bg-rose-50/50 border border-rose-200 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded">
                    জরুরি ত্রাণ
                  </span>
                  <span className="text-xs text-slate-500 font-bold">আর {apl.daysLeft || 10} দিন বাকি</span>
                </div>

                <h5 className="font-bold text-sm text-slate-900">{apl.titleBn}</h5>
                <p className="text-xs text-slate-600">{apl.descriptionBn}</p>

                <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-rose-200">
                  <span>সংগৃহীত: <strong className="text-emerald-800">{formatTakaBn(apl.raisedAmount)}</strong></span>
                  <span>লক্ষ্য: <strong className="text-slate-800">{formatTakaBn(apl.targetAmount)}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 4: EXPENSES & VOUCHER LEDGER
      ======================================================== */}
      {subTab === 'expenses' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h4 className="font-bold text-base text-slate-900">মাঠপর্যায়ের ফিল্ড ব্যয় ভাউচার খতিয়ান</h4>
              <p className="text-xs text-slate-500">সকল ত্রাণের মালামাল ক্রয়, পরিবহন ও বিতরণের বিল-ভাউচার ডিজিটাল সংরক্ষণ।</p>
            </div>

            <button
              onClick={() =>
                setExpenseModal({
                  isOpen: true,
                  isNew: true,
                  data: {
                    voucherNumber: `VOU-ASC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                    purposeBn: 'বন্যাদুর্গতদের মাঝে ৫০০ পরিবারের শুকনা খাবার ও স্যালাইন প্যাকেট ক্রয়',
                    category: 'emergency_relief',
                    amount: 85000,
                    recipientOrVendor: 'মেসার্স ভাই ভাই জেনারেল স্টোর, ফেনী',
                    locationBn: 'ফুলগাজী, ফেনী',
                    approvedBy: 'কেন্দ্রীয় ট্রেজারি অডিট কমিটি',
                    date: new Date().toISOString().split('T')[0]
                  }
                })
              }
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>নতুন ব্যয় ভাউচার যুক্ত করুন</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">ভাউচার নম্বর</th>
                  <th className="py-3 px-4">ব্যয়ের উদ্দেশ্য ও বিবরণ</th>
                  <th className="py-3 px-4">ভেন্ডর / প্রাপক</th>
                  <th className="py-3 px-4">পরিমাণ (টাকা)</th>
                  <th className="py-3 px-4">অনুমোদনকারী</th>
                  <th className="py-3 px-4">তারিখ</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {exp.voucherNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs">
                      {exp.purposeBn}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {exp.recipientOrVendor}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-rose-700 text-sm">
                      {formatTakaBn(exp.amount)}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-500">
                      {exp.approvedBy}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {exp.date}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteExpense(exp.id, exp.voucherNumber)}
                        className="text-rose-600 hover:bg-rose-50 p-1 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 5: TRANSPARENCY & FINANCIAL AUDIT
      ======================================================== */}
      {subTab === 'transparency' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h4 className="font-bold text-base text-slate-900">কেন্দ্রীয় আর্থিক স্বচ্ছতা ও অডিট খতিয়ান</h4>
            <p className="text-xs text-slate-500">প্রতিটি অনুদানের ১০০% নিখুঁত হিসাব ও জনসমক্ষে উন্মুক্ত অডিট বিবরণী।</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-1">
              <span className="text-xs font-bold text-emerald-900">মোট সংগৃহীত অর্থ</span>
              <p className="text-2xl font-mono font-black text-emerald-800">
                {summary ? formatTakaBn(summary.totalCollected) : '৳ ৩৮,৯০,০০০'}
              </p>
              <p className="text-[11px] text-emerald-700">ডিজিটাল ও ব্যাংক চ্যানেলে প্রাপ্ত</p>
            </div>

            <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl space-y-1">
              <span className="text-xs font-bold text-rose-900">মাঠপর্যায়ে মোট ব্যয়</span>
              <p className="text-2xl font-mono font-black text-rose-800">
                {summary ? formatTakaBn(summary.totalSpent) : '৳ ৩২,১০,০০০'}
              </p>
              <p className="text-[11px] text-rose-700">ভাউচার ও অডিট দ্বারা সমর্থিত</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl space-y-1">
              <span className="text-xs font-bold text-blue-900">তহবিল বর্তমান ব্যালেন্স</span>
              <p className="text-2xl font-mono font-black text-blue-800">
                {summary ? formatTakaBn(summary.reserveBalance) : '৳ ৬,৮০,০০০'}
              </p>
              <p className="text-[11px] text-blue-700">ব্যাংক হিসেবে সংরক্ষিত</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                আসকাডো কেন্দ্রীয় তহবিল প্রতি অর্থবছরে চার্টার্ড অ্যাকাউন্টেন্ট ফার্ম দ্বারা অডিটকৃত এবং জাতীয় রাজস্ব বোর্ডের নীতিমালার আলোকে পরিচালিত।
              </span>
            </div>
            <button
              onClick={handleExportCSV}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl shrink-0"
            >
              সম্পূর্ণ অডিট ফাইল ডাউনলোড
            </button>
          </div>
        </div>
      )}

      {/* Project Creation/Edit Modal */}
      {projectModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-bold text-sm text-slate-900">
                {projectModal.isNew ? 'নতুন প্রকল্প তৈরি করুন' : 'প্রকল্প এডিট করুন'}
              </h4>
              <button onClick={() => setProjectModal(prev => ({ ...prev, isOpen: false }))}>
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">প্রকল্পের নাম (বাংলায়)</label>
                <input
                  type="text"
                  required
                  value={projectModal.data.titleBn || ''}
                  onChange={(e) => setProjectModal(p => ({ ...p, data: { ...p.data, titleBn: e.target.value } }))}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">খাত</label>
                  <select
                    value={projectModal.data.category || 'helpless_support'}
                    onChange={(e) => setProjectModal(p => ({ ...p, data: { ...p.data, category: e.target.value as any } }))}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    {DONATION_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.nameBn}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">লক্ষ্যমাত্রা (টাকা)</label>
                  <input
                    type="number"
                    required
                    value={projectModal.data.targetAmount || 0}
                    onChange={(e) => setProjectModal(p => ({ ...p, data: { ...p.data, targetAmount: Number(e.target.value) } }))}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">এলাকা / জেলা</label>
                  <input
                    type="text"
                    value={projectModal.data.locationBn || ''}
                    onChange={(e) => setProjectModal(p => ({ ...p, data: { ...p.data, locationBn: e.target.value } }))}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">স্ট্যাটাস</label>
                  <select
                    value={projectModal.data.status || 'ongoing'}
                    onChange={(e) => setProjectModal(p => ({ ...p, data: { ...p.data, status: e.target.value as any } }))}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="ongoing">চলমান (Ongoing)</option>
                    <option value="completed">সম্পন্ন (Completed)</option>
                    <option value="upcoming">আসন্ন (Upcoming)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ছবির লিঙ্ক (Image URL)</label>
                <input
                  type="url"
                  value={projectModal.data.imageUrl || ''}
                  onChange={(e) => setProjectModal(p => ({ ...p, data: { ...p.data, imageUrl: e.target.value } }))}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">বিস্তারিত বিবরণ</label>
                <textarea
                  rows={3}
                  value={projectModal.data.descriptionBn || ''}
                  onChange={(e) => setProjectModal(p => ({ ...p, data: { ...p.data, descriptionBn: e.target.value } }))}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProjectModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Creation Modal */}
      {expenseModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-bold text-sm text-slate-900">মাঠপর্যায়ের ফিল্ড ব্যয় ভাউচার লিপিবদ্ধকরণ</h4>
              <button onClick={() => setExpenseModal(prev => ({ ...prev, isOpen: false }))}>
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">ব্যয়ের উদ্দেশ্য ও বিবরণ</label>
                <input
                  type="text"
                  required
                  value={expenseModal.data.purposeBn || ''}
                  onChange={(e) => setExpenseModal(p => ({ ...p, data: { ...p.data, purposeBn: e.target.value } }))}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">পরিমাণ (টাকা)</label>
                  <input
                    type="number"
                    required
                    value={expenseModal.data.amount || 0}
                    onChange={(e) => setExpenseModal(p => ({ ...p, data: { ...p.data, amount: Number(e.target.value) } }))}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">ভাউচার নম্বর</label>
                  <input
                    type="text"
                    required
                    value={expenseModal.data.voucherNumber || ''}
                    onChange={(e) => setExpenseModal(p => ({ ...p, data: { ...p.data, voucherNumber: e.target.value } }))}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ভেন্ডর / রিসিভারের নাম</label>
                  <input
                    type="text"
                    required
                    value={expenseModal.data.recipientOrVendor || ''}
                    onChange={(e) => setExpenseModal(p => ({ ...p, data: { ...p.data, recipientOrVendor: e.target.value } }))}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">অনুমোদনকারী</label>
                  <input
                    type="text"
                    required
                    value={expenseModal.data.approvedBy || ''}
                    onChange={(e) => setExpenseModal(p => ({ ...p, data: { ...p.data, approvedBy: e.target.value } }))}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setExpenseModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold"
                >
                  ভাউচার সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt & Certificate Modal */}
      <DonationReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        transaction={selectedTxForReceipt}
      />
    </div>
  );
};
