import React, { useState } from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  X, CheckCircle, ShieldCheck, CreditCard, DollarSign,
  ArrowRight, Landmark, Lock, CheckCircle2, QrCode, AlertCircle
} from 'lucide-react';
import { SomitiMember, SavingsProductType, SavingsTransaction } from '../../types/somitiTypes';

interface DepositPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMember: SomitiMember | null;
  members: SomitiMember[];
  onPaymentSuccess: (txn: SavingsTransaction) => void;
}

export const DepositPaymentModal: React.FC<DepositPaymentModalProps> = ({
  isOpen,
  onClose,
  selectedMember,
  members,
  onPaymentSuccess
}) => {
  const { isBn } = useTranslation();

  const [memberId, setMemberId] = useState(selectedMember?.id || members[0]?.id || 'AS-000125');
  const [productType, setProductType] = useState<SavingsProductType>('monthly');
  const [amount, setAmount] = useState(500);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer' | 'Card' | 'Cash'>('bKash');
  const [trxId, setTrxId] = useState('');
  const [collectorName, setCollectorName] = useState('মো. সুমন রানা (Collector)');
  const [paymentStep, setPaymentStep] = useState<'form' | 'gateway_verifying' | 'success'>('form');

  if (!isOpen) return null;

  const currentMember = members.find((m) => m.id === memberId) || selectedMember || members[0];

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    setPaymentStep('gateway_verifying');

    const generatedTrx = trxId.trim() || `TRX-${paymentMethod.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 900000 + 100000)}`;
    const generatedReceipt = `REC-2026-${Math.floor(Math.random() * 9000 + 1000)}`;

    setTimeout(() => {
      const newBalance = (currentMember?.savingsBalance || 0) + Number(amount);
      const newTxn: SavingsTransaction = {
        id: `TXN-${Date.now()}`,
        receiptNo: generatedReceipt,
        trxId: generatedTrx,
        memberId: currentMember?.id || 'AS-000125',
        memberName: currentMember?.fullName || 'সদস্য',
        somitiId: currentMember?.somitiId || 'SOM-001',
        somitiName: currentMember?.somitiName || 'এসকাডো ইয়ুথ সমিতি',
        branchId: currentMember?.branchId || 'BR-DHK-01',
        branchName: currentMember?.branchName || 'ধানমন্ডি প্রধান শাখা',
        productType,
        amount: Number(amount),
        transactionType: 'deposit',
        paymentMethod,
        collectorName,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'SUCCESS',
        balanceAfter: newBalance,
        qrCodeToken: `ASC-${generatedReceipt}-${currentMember?.id}`
      };

      setPaymentStep('success');
      setTimeout(() => {
        onPaymentSuccess(newTxn);
        onClose();
        setPaymentStep('form');
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200">

        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight">
                {isBn ? 'সঞ্চয় জমা ও পেমেন্ট গেটওয়ে' : 'Savings Deposit & Payment Gateway'}
              </h3>
              <p className="text-[10px] text-emerald-300">
                Safe Multi-Channel Transaction Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {paymentStep === 'gateway_verifying' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center animate-in fade-in">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin flex items-center justify-center">
                <Lock className="w-6 h-6 text-emerald-700 animate-pulse" />
              </div>
              <h4 className="text-sm font-black text-slate-900">গেটওয়ে লেনদেন ও লেজার যাচাইকরণ চলছে...</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Transaction Verification & Ledger Lock in Progress...
              </p>
            </div>
          )}

          {paymentStep === 'success' && (
            <div className="py-10 flex flex-col items-center justify-center space-y-3 text-center animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h4 className="text-base font-black text-emerald-950">পেমেন্ট সফল ও ডিজিটাল রসিদ জেনারেট সম্পন্ন!</h4>
              <p className="text-xs text-slate-500">
                ব্যালেন্স ও কেন্দ্রীয় লেজার আপডেট করা হয়েছে।
              </p>
            </div>
          )}

          {paymentStep === 'form' && (
            <form onSubmit={handleStartPayment} className="space-y-4 text-xs">
              
              {/* Member Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">সদস্য নির্বাচন করুন *</label>
                <select
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-xs"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.id}) — বর্তমান স্থিতি: ৳{(m?.savingsBalance || 0).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Savings Product */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">সঞ্চয় স্কিম *</label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value as SavingsProductType)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                  >
                    <option value="daily">দৈনিক ক্ষুদ্র সঞ্চয় (Daily)</option>
                    <option value="weekly">সাপ্তাহিক সঞ্চয় (Weekly)</option>
                    <option value="monthly">মাসিক জেনারেল সঞ্চয় (Monthly)</option>
                    <option value="dps">ডিপিএস পেনশন (DPS)</option>
                    <option value="special">স্পেশাল স্কিম (Special)</option>
                    <option value="share">শেয়ার ক্যাপিটাল (Share)</option>
                    <option value="emergency">আপদকালীন সঞ্চয় (Emergency)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">জমার পরিমাণ (BDT) *</label>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-black text-emerald-800 text-sm"
                  />
                </div>
              </div>

              {/* Payment Methods Grid */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">পেমেন্ট মেথড নির্বাচন করুন *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'bKash', label: 'bKash বিকাশ', color: 'border-pink-300 bg-pink-50 text-pink-900' },
                    { id: 'Nagad', label: 'Nagad নগদ', color: 'border-orange-300 bg-orange-50 text-orange-900' },
                    { id: 'Rocket', label: 'Rocket রকেট', color: 'border-purple-300 bg-purple-50 text-purple-900' },
                    { id: 'Bank Transfer', label: 'ব্যাংক ট্রান্সফার', color: 'border-blue-300 bg-blue-50 text-blue-900' },
                    { id: 'Card', label: 'ভিসা/মাস্টারকার্ড', color: 'border-indigo-300 bg-indigo-50 text-indigo-900' },
                    { id: 'Cash', label: 'নগদ / ক্যাশ', color: 'border-emerald-300 bg-emerald-50 text-emerald-900' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-2 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                        paymentMethod === method.id
                          ? 'ring-2 ring-emerald-600 font-black ' + method.color
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transaction ID / Cash Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {paymentMethod === 'Cash' ? 'কালেক্টর নাম' : 'ট্রানজেকশন আইডি (TrxID)'}
                  </label>
                  <input
                    type="text"
                    placeholder={paymentMethod === 'Cash' ? 'কালেক্টর নাম' : 'যেমন: TRX-BK-918231'}
                    value={paymentMethod === 'Cash' ? collectorName : trxId}
                    onChange={(e) => paymentMethod === 'Cash' ? setCollectorName(e.target.value) : setTrxId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 inline text-emerald-600 mr-1" />
                    পেমেন্ট ভেরিফিকেশনের সাথে সাথে স্বয়ংক্রিয় লেজার এন্ট্রি ও ডিজিটাল রসিদ ইস্যু হবে।
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>জমা সম্পন্ন করুন (৳{(amount || 0).toLocaleString()})</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
