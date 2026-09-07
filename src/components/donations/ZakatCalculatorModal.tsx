import React, { useState } from 'react';
import { calculateZakat, formatTakaBn } from '../../utils/donationUtils';
import {
  X, Sparkles, Calculator, CheckCircle2, AlertCircle,
  HelpCircle, ArrowRight, ShieldCheck, Heart
} from 'lucide-react';

interface ZakatCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayZakat: (amount: number) => void;
}

export const ZakatCalculatorModal: React.FC<ZakatCalculatorModalProps> = ({
  isOpen,
  onClose,
  onPayZakat
}) => {
  const [cashInHand, setCashInHand] = useState<number | ''>('');
  const [bankBalance, setBankBalance] = useState<number | ''>('');
  const [goldValueInTaka, setGoldValueInTaka] = useState<number | ''>('');
  const [silverValueInTaka, setSilverValueInTaka] = useState<number | ''>('');
  const [businessGoodsValue, setBusinessGoodsValue] = useState<number | ''>('');
  const [receivables, setReceivables] = useState<number | ''>('');
  const [debtsAndLiabilities, setDebtsAndLiabilities] = useState<number | ''>('');

  if (!isOpen) return null;

  const zakatResult = calculateZakat({
    cashInHand: Number(cashInHand) || 0,
    bankBalance: Number(bankBalance) || 0,
    goldValueInTaka: Number(goldValueInTaka) || 0,
    silverValueInTaka: Number(silverValueInTaka) || 0,
    businessGoodsValue: Number(businessGoodsValue) || 0,
    receivables: Number(receivables) || 0,
    debtsAndLiabilities: Number(debtsAndLiabilities) || 0
  });

  const handleProceedPay = () => {
    if (zakatResult.zakatPayable > 0) {
      onPayZakat(zakatResult.zakatPayable);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-rose-600 text-amber-200 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                শরীয়াহসম্মত জাকাত হিসাব
              </span>
              <h3 className="font-extrabold text-xl text-white">
                যাকাত ক্যালকুলেটর (Zakat Calculator)
              </h3>
            </div>
          </div>
          <p className="text-xs text-amber-100 mt-2">
            আপনার স্বর্ণ, রৌপ্য, নগদ অর্থ, ব্যাংকে সঞ্চয় ও ব্যবসায়িক পণ্যের হিসাব দিয়ে সঠিক ২.৫% যাকাতের পরিমাণ বের করুন।
          </p>
        </div>

        {/* Calculator Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Nisab Benchmark Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-950">
            <Sparkles className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm">চলতি বছরের রূপার নিসাব বেঞ্চমার্ক: ৳ ৮৫,০০০</span>
              <p className="text-amber-800 text-[11px] mt-0.5">
                সব ধরণের খরচ ও ঋণ বাদে যদি আপনার কাছে নিসাব পরিমাণ সম্পদ (বা সমমূল্য) পূর্ণ ১ বছর থাকে, তবে নিট সম্পদের ২.৫% যাকাত আদায় করা ফরজ।
              </p>
            </div>
          </div>

          {/* Input Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 1. Cash in hand */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>১. নগদ টাকা (হাতে থাকা)</span>
                <span className="text-[10px] text-slate-400">টাকা</span>
              </label>
              <input
                type="number"
                min="0"
                value={cashInHand}
                onChange={(e) => setCashInHand(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="৳ ০.০০"
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none transition"
              />
            </div>

            {/* 2. Bank Balance & Savings */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>২. ব্যাংক ব্যালেন্স ও সঞ্চয়পত্র</span>
                <span className="text-[10px] text-slate-400">টাকা</span>
              </label>
              <input
                type="number"
                min="0"
                value={bankBalance}
                onChange={(e) => setBankBalance(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="৳ ০.০০"
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none transition"
              />
            </div>

            {/* 3. Gold Value */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>৩. মোট স্বর্ণের বর্তমান বাজারমূল্য</span>
                <span className="text-[10px] text-slate-400">টাকা</span>
              </label>
              <input
                type="number"
                min="0"
                value={goldValueInTaka}
                onChange={(e) => setGoldValueInTaka(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="৳ ০.০০"
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none transition"
              />
            </div>

            {/* 4. Silver Value */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>৪. মোট রূপার বর্তমান বাজারমূল্য</span>
                <span className="text-[10px] text-slate-400">টাকা</span>
              </label>
              <input
                type="number"
                min="0"
                value={silverValueInTaka}
                onChange={(e) => setSilverValueInTaka(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="৳ ০.০০"
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none transition"
              />
            </div>

            {/* 5. Business Inventory / Goods */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>৫. ব্যবসায়িক পণ্যের মজুদ মূল্য</span>
                <span className="text-[10px] text-slate-400">টাকা</span>
              </label>
              <input
                type="number"
                min="0"
                value={businessGoodsValue}
                onChange={(e) => setBusinessGoodsValue(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="৳ ০.০০"
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none transition"
              />
            </div>

            {/* 6. Receivables */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>৬. অন্যদের কাছে পাওনা অর্থ (যা ফেরতযোগ্য)</span>
                <span className="text-[10px] text-slate-400">টাকা</span>
              </label>
              <input
                type="number"
                min="0"
                value={receivables}
                onChange={(e) => setReceivables(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="৳ ০.০০"
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none transition"
              />
            </div>

            {/* 7. Debts & Liabilities (To Subtract) */}
            <div className="sm:col-span-2 space-y-1.5 bg-rose-50/70 border border-rose-200 p-3.5 rounded-2xl">
              <label className="text-xs font-bold text-rose-950 flex items-center justify-between">
                <span>৭. আপনার তাৎক্ষণিক প্রদেয় ঋণ ও দেনা (বাদ যাবে)</span>
                <span className="text-[10px] text-rose-600 font-mono">- মাইনাস</span>
              </label>
              <input
                type="number"
                min="0"
                value={debtsAndLiabilities}
                onChange={(e) => setDebtsAndLiabilities(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="৳ ০.০০"
                className="w-full bg-white border border-rose-200 focus:border-rose-600 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Real-time Calculation Result Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 shadow-md">
            <div className="grid grid-cols-2 gap-3 text-xs border-b border-slate-800 pb-3">
              <div>
                <span className="text-slate-400 block text-[11px]">মোট সম্পদ:</span>
                <span className="font-mono font-bold text-slate-200">{formatTakaBn(zakatResult.totalAssets)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">যাকাতযোগ্য নিট সম্পদ:</span>
                <span className="font-mono font-bold text-amber-300">{formatTakaBn(zakatResult.netZakatableWealth)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
                  আপনার প্রদেয় মোট যাকাত (২.৫%)
                </span>
                <div className="font-extrabold text-2xl sm:text-3xl text-white">
                  {formatTakaBn(zakatResult.zakatPayable)}
                </div>
              </div>

              <div>
                {zakatResult.nisabMet ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    নিসাব পূর্ণ হয়েছে (যাকাত ফরজ)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-800 text-slate-400 px-3 py-1.5 rounded-full">
                    <AlertCircle className="w-3.5 h-3.5" />
                    নিসাবের নিচে (যাকাত প্রযোজ্য নয়)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              setCashInHand('');
              setBankBalance('');
              setGoldValueInTaka('');
              setSilverValueInTaka('');
              setBusinessGoodsValue('');
              setReceivables('');
              setDebtsAndLiabilities('');
            }}
            className="text-xs text-slate-500 hover:text-slate-800 font-bold"
          >
            রিসেট করুন
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition"
            >
              বাতিল
            </button>
            <button
              disabled={zakatResult.zakatPayable <= 0}
              onClick={handleProceedPay}
              className={`font-bold text-xs px-5 py-2.5 rounded-xl shadow transition flex items-center gap-1.5 ${
                zakatResult.zakatPayable > 0
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>হিসাবকৃত যাকাত সরাসরি প্রদান করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
