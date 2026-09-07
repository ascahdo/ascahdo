import React, { useState } from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  Smartphone, QrCode, Search, CheckCircle, DollarSign,
  User, ShieldCheck, Printer, ArrowRight, MessageSquare,
  Landmark, AlertCircle, RefreshCw
} from 'lucide-react';
import { SomitiMember, SavingsTransaction } from '../../types/somitiTypes';

interface MobileCollectorPOSProps {
  members: SomitiMember[];
  onCollectSuccess: (txn: SavingsTransaction) => void;
  onOpenReceipt: (txn: SavingsTransaction) => void;
}

export const MobileCollectorPOS: React.FC<MobileCollectorPOSProps> = ({
  members,
  onCollectSuccess,
  onOpenReceipt
}) => {
  const { isBn } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<SomitiMember>(members[0]);
  const [depositAmount, setDepositAmount] = useState(500);
  const [installmentAmount, setInstallmentAmount] = useState(0);
  const [collectionMethod, setCollectionMethod] = useState<'Cash' | 'bKash' | 'Nagad'>('Cash');
  const [lastReceipt, setLastReceipt] = useState<SavingsTransaction | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [smsSentNotice, setSmsSentNotice] = useState(false);

  const filteredMembers = (members || []).filter(
    (m) =>
      m && (
        (m.fullName && m.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.id && m.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.mobile && m.mobile.includes(searchQuery)) ||
        (m.nid && m.nid.includes(searchQuery))
      )
  );

  const totalPayableNow = Number(depositAmount) + Number(installmentAmount);

  const handleInstantCollect = () => {
    if (totalPayableNow <= 0) return;

    setIsCollecting(true);
    const receiptNo = `REC-POS-${Math.floor(Math.random() * 90000 + 10000)}`;
    const trxId = `POS-${collectionMethod.substring(0, 2).toUpperCase()}-${Date.now().toString().slice(-6)}`;

    setTimeout(() => {
      const newTxn: SavingsTransaction = {
        id: `TXN-POS-${Date.now()}`,
        receiptNo,
        trxId,
        memberId: selectedMember.id,
        memberName: selectedMember.fullName,
        somitiId: selectedMember.somitiId,
        somitiName: selectedMember.somitiName,
        branchId: selectedMember.branchId,
        branchName: selectedMember.branchName,
        productType: 'monthly',
        amount: totalPayableNow,
        transactionType: 'deposit',
        paymentMethod: collectionMethod,
        collectorName: 'মো. সুমন রানা (Field Collector)',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'SUCCESS',
        balanceAfter: selectedMember.savingsBalance + Number(depositAmount),
        qrCodeToken: `ASC-${receiptNo}-${selectedMember.id}`
      };

      onCollectSuccess(newTxn);
      setLastReceipt(newTxn);
      setIsCollecting(false);
      setSmsSentNotice(true);
      setTimeout(() => setSmsSentNotice(false), 4000);
    }, 800);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      
      {/* POS Top Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center shadow-md">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black tracking-tight">
                {isBn ? 'ফিল্ড কালেক্টর মোবাইল POS ড্যাশবোর্ড' : 'Field Collector Mobile POS Terminal'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold">
                LIVE POS
              </span>
            </div>
            <p className="text-xs text-emerald-200">
              দ্রুত কালেকশন • ইনস্ট্যান্ট রসিদ • অটো এসএমএস অ্যালার্ট
            </p>
          </div>
        </div>

        {/* Collector Profile Badge */}
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl text-xs">
          <User className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold">কালেক্টর: মো. সুমন রানা</span>
          <span className="text-emerald-400">• অনলাইন</span>
        </div>
      </div>

      {/* POS Content Grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Member Search & Select (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
              ১. সদস্য খুঁজুন (নাম / সদস্য ID / মোবাইল / NID)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="সদস্যের নাম বা আইডি (যেমন: AS-000125)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {filteredMembers.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedMember(m)}
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between text-xs ${
                  selectedMember.id === m.id
                    ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={m.photoUrl}
                    alt={m.fullName}
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-300"
                  />
                  <div>
                    <h4 className="font-black text-slate-900">{m.fullName}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">ID: {m.id} • {m.mobile}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">সঞ্চয় স্থিতি</span>
                  <span className="font-black text-emerald-700">৳ {(m?.savingsBalance || 0).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Collection Entry & Quick POS Punch (7 cols) */}
        <div className="lg:col-span-7 bg-slate-50 rounded-3xl border border-slate-200 p-5 space-y-5">
          
          {/* Selected Member Dossier Strip */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-sm">
                AS
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm">{selectedMember.fullName}</h4>
                <p className="text-xs text-slate-500">
                  {selectedMember.branchName} • ঋণ বকেয়া: <span className="text-rose-600 font-bold">৳{(selectedMember?.outstanding || 0).toLocaleString()}</span>
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
              {selectedMember.memberStatus}
            </span>
          </div>

          {/* Amount Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
              <label className="font-black text-slate-800 block">দৈনিক / মাসিক সঞ্চয় জমা (BDT)</label>
              <input
                type="number"
                min="0"
                step="50"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-black text-emerald-700 text-base"
              />
              <div className="flex gap-1.5 pt-1">
                {[100, 200, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt)}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px]"
                  >
                    +৳{amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
              <label className="font-black text-slate-800 block">ঋণের কিস্তি আদায় (BDT)</label>
              <input
                type="number"
                min="0"
                step="500"
                value={installmentAmount}
                onChange={(e) => setInstallmentAmount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-black text-indigo-700 text-base"
              />
              <div className="flex gap-1.5 pt-1">
                {[1000, 2000, 3500, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setInstallmentAmount(amt)}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px]"
                  >
                    +৳{amt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800 uppercase block">
              পদ্ধতি (Payment Method):
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['Cash', 'bKash', 'Nagad'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setCollectionMethod(method)}
                  className={`p-2.5 rounded-xl border font-bold text-center transition cursor-pointer ${
                    collectionMethod === method
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md font-black'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {method === 'Cash' ? '💵 নগদ / ক্যাশ' : method === 'bKash' ? '📱 বিকাশ' : '📱 নগদ'}
                </button>
              ))}
            </div>
          </div>

          {/* POS Total Action Button */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 font-bold">মোট আদায়কৃত অর্থ:</span>
              <span className="text-2xl font-black text-emerald-800">
                ৳ {(totalPayableNow || 0).toLocaleString()} <span className="text-xs font-bold text-slate-500">BDT</span>
              </span>
            </div>

            <button
              onClick={handleInstantCollect}
              disabled={isCollecting || totalPayableNow <= 0}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-black text-sm shadow-lg transition transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isCollecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>আদায় এন্ট্রি হচ্ছে...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>১-ট্যাপে আদায় সম্পন্ন করুন ও রসিদ ইস্যু</span>
                </>
              )}
            </button>
          </div>

          {/* SMS Notification Banner Alert */}
          {smsSentNotice && lastReceipt && (
            <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between animate-in zoom-in-95">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>এসএমএস প্রেরিত:</strong> {selectedMember.mobile} নম্বরে ৳{lastReceipt.amount} আদায়ের নিশ্চিতকরণ মেসেজ ও রসিদ পাঠানো হয়েছে।
                </span>
              </div>
              <button
                onClick={() => onOpenReceipt(lastReceipt)}
                className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-bold text-[11px] shrink-0"
              >
                রসিদ দেখুন
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
