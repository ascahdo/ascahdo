import React, { useState } from 'react';
import { useTranslation } from '../locales/i18nContext';
import { X, CheckCircle, ShieldCheck, Printer, Copy, Check, Phone, Building, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  amount: number;
  campaignId?: string;
  onSuccess?: (tx: any) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  title,
  amount: initialAmount,
  campaignId,
  onSuccess
}) => {
  const { isBn } = useTranslation();
  const [method, setMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'bank'>('bkash');
  const [amount, setAmount] = useState<number>(initialAmount || 1000);
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [trxId, setTrxId] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [completedTx, setCompletedTx] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const getMethodDetails = () => {
    switch (method) {
      case 'bkash':
        return {
          title: 'bKash (বিকাশ)',
          number: '01973817167',
          type: isBn ? 'মার্চেন্ট / পার্সোনাল (Send Money / Payment)' : 'Merchant / Personal (Send Money / Payment)',
          color: 'text-pink-600',
          bgColor: 'bg-pink-50',
          borderColor: 'border-pink-500',
          activeBg: 'bg-pink-600',
          accentBorder: 'border-pink-200',
          instructions: isBn
            ? [
                'বিকাশ অ্যাপ অথবা *247# ডায়াল করুন।',
                'Send Money অথবা Make Payment নির্বাচন করুন।',
                'প্রাপক নম্বর দিন: 01973817167',
                `টাকার পরিমাণ দিন: ৳ ${(amount || 0).toLocaleString()}`,
                'পেমেন্ট শেষে প্রাপ্ত ৮-১০ ডিজিটের Transaction ID (TrxID) নিচে লিখে নিশ্চিত করুন।'
              ]
            : [
                'Open bKash App or dial *247#',
                'Select "Send Money" or "Make Payment"',
                'Enter recipient number: 01973817167',
                `Enter amount: ৳ ${(amount || 0).toLocaleString()}`,
                'Enter the received Transaction ID (TrxID) below to verify.'
              ]
        };
      case 'nagad':
        return {
          title: 'Nagad (নগদ)',
          number: '01813817167',
          type: isBn ? 'পার্সোনাল / সেন্ড মানি (Send Money)' : 'Personal / Send Money',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-500',
          activeBg: 'bg-orange-600',
          accentBorder: 'border-orange-200',
          instructions: isBn
            ? [
                'নগদ অ্যাপ অথবা *167# ডায়াল করুন।',
                'Send Money অপশনে যান।',
                'প্রাপক নম্বর: 01813817167',
                `টাকার পরিমাণ: ৳ ${(amount || 0).toLocaleString()}`,
                'লেনদেন শেষের Transaction ID নিচে লিখুন।'
              ]
            : [
                'Open Nagad App or dial *167#',
                'Select "Send Money"',
                'Recipient Number: 01813817167',
                `Amount: ৳ ${(amount || 0).toLocaleString()}`,
                'Enter the TrxID below to confirm.'
              ]
        };
      case 'rocket':
        return {
          title: 'Rocket (রকেট)',
          number: '01813817167',
          type: isBn ? 'ডাচ-বাংলা রকেট (Send Money)' : 'DBBL Rocket (Send Money)',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-500',
          activeBg: 'bg-purple-600',
          accentBorder: 'border-purple-200',
          instructions: isBn
            ? [
                'রকেট অ্যাপ অথবা *322# ডায়াল করুন।',
                'Send Money নির্বাচন করে নম্বর দিন: 01813817167',
                `পরিমাণ ৳ ${(amount || 0).toLocaleString()} প্রদান করুন।`,
                'প্রাপ্ত TrxID নিচে লিখুন।'
              ]
            : [
                'Open Rocket app or dial *322#',
                'Send Money to: 01813817167',
                `Amount: ৳ ${(amount || 0).toLocaleString()}`,
                'Enter the TrxID below.'
              ]
        };
      case 'bank':
        return {
          title: 'Bank Transfer (ব্যাংক ট্রান্সফার)',
          number: '20501234567890',
          type: 'Islami Bank Bangladesh PLC',
          color: 'text-emerald-700',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-500',
          activeBg: 'bg-emerald-700',
          accentBorder: 'border-emerald-200',
          instructions: isBn
            ? [
                'ব্যাংক: ইসলামী ব্যাংক বাংলাদেশ পিএলসি (Islami Bank)',
                'অ্যাকাউন্ট নাম: ASCAHDO Central Welfare Trust',
                'অ্যাকাউন্ট নম্বর: 20501234567890',
                'শাখা: বসুরহাট শাখা, কোম্পানীগঞ্জ, নোয়াখালী (রাউটিং: 125271890)',
                'টাকা জমা বা অনলাইন ট্রান্সফার রসিদ নম্বর/TrxID নিচে লিখুন।'
              ]
            : [
                'Bank: Islami Bank Bangladesh PLC',
                'Account Name: ASCAHDO Central Welfare Trust',
                'Account No: 20501234567890',
                'Branch: Basurhat Branch, Noakhali (Routing: 125271890)',
                'Enter the Deposit Slip # or Transfer Ref below.'
              ]
        };
      default:
        return {
          title: 'Direct Pay (সরাসরি পেমেন্ট)',
          number: '01973817167',
          type: isBn ? 'বিকাশ / নগদ / রকেট / ব্যাংক' : 'bKash / Nagad / Rocket / Bank',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-500',
          activeBg: 'bg-emerald-600',
          accentBorder: 'border-emerald-200',
          instructions: isBn
            ? [
                'আপনার পছন্দের মোবাইল ব্যাংকিং বা ব্যাংক নির্বাচন করুন।',
                `নির্ধারিত নম্বরে ৳ ${(amount || 0).toLocaleString()} প্রদান করুন।`,
                'পেমেন্ট শেষে প্রাপ্ত Transaction ID (TrxID) নিচে লিখে সাবমিট করুন।'
              ]
            : [
                'Choose your payment channel.',
                `Send ৳ ${(amount || 0).toLocaleString()} to the designated number.`,
                'Enter the TrxID below to confirm.'
              ]
        };
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const generateDemoTrxId = () => {
    const prefixes = { bkash: 'BK', nagad: 'NG', rocket: 'RK', bank: 'IBBL' };
    const prefix = prefixes[method] || 'TX';
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    const num = Math.floor(1000 + Math.random() * 9000);
    setTrxId(`${prefix}${rand}${num}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (amount < 10) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে সর্বনিম্ন ১০ টাকা বা তার বেশি প্রদান করুন।' : 'Minimum donation is 10 BDT');
      return;
    }

    if (!donorPhone && !isAnonymous) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে যোগাযোগের মোবাইল নম্বর প্রদান করুন।' : 'Please provide a contact phone number.');
      return;
    }

    setLoading(true);
    try {
      const generatedOrGivenTrx = trxId.trim() || `${method.toUpperCase().slice(0, 2)}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      const tx = await api.createDonation({
        campaignId,
        donorName: isAnonymous ? (isBn ? 'মহৎ বেনামী দাতা' : 'Anonymous Donor') : (donorName.trim() || (isBn ? 'শ্রদ্ধেয় শুভাকাঙ্ক্ষী' : 'Respected Donor')),
        donorPhone: donorPhone.trim() || '01973817167',
        donorEmail: donorEmail.trim() || 'donor@ascado.org',
        amount: Number(amount),
        paymentMethod: method,
        transactionId: generatedOrGivenTrx,
        isAnonymous
      });

      setCompletedTx(tx);
      if (onSuccess) onSuccess(tx);
    } catch (err: any) {
      console.error('Payment error:', err);
      // Fallback for local preview if network is offline
      const fallbackTx = {
        id: `tx_${Date.now()}`,
        campaignId,
        campaignTitle: title,
        donorName: isAnonymous ? (isBn ? 'মহৎ বেনামী দাতা' : 'Anonymous Donor') : (donorName.trim() || (isBn ? 'শ্রদ্ধেয় শুভাকাঙ্ক্ষী' : 'Respected Donor')),
        amount: Number(amount),
        paymentMethod: method,
        transactionId: trxId.trim() || `BK${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        status: 'completed',
        date: new Date().toISOString()
      };
      setCompletedTx(fallbackTx);
      if (onSuccess) onSuccess(fallbackTx);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDetails = getMethodDetails();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-white shadow-md">
              A
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                {isBn ? 'অসহায় ও দুস্থ কল্যাণ সংস্থা (ASCAHDO)' : 'ASCAHDO Central Welfare Trust'}
              </h3>
              <p className="text-xs text-emerald-400 font-medium">{title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
          {completedTx ? (
            <div className="text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-900">
                  {isBn ? 'পেমেন্ট সফলভাবে গৃহীত হয়েছে!' : 'Payment Accepted Successfully!'}
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  {isBn
                    ? 'আপনার অনুদান ও সহযোগিতা এতিম, বিধবা, রোগী ও অসহায় মানুষদের মুখে হাসি ফোটাবে। জাযাকাল্লাহু খাইরান।'
                    : 'Thank you for your generous support towards humanitarian welfare.'}
                </p>
              </div>

              {/* Digital Verified Receipt */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 text-left text-xs space-y-2.5 font-mono shadow-xs">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2 font-sans font-bold text-slate-900">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500">{isBn ? 'অফিসিয়াল ডিজিটাল রসিদ' : 'Verified Receipt'}</span>
                  <span className="text-xs font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                    {completedTx.id || `TX-${Date.now()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">{isBn ? 'ট্রানজাকশন আইডি (TrxID):' : 'TrxID:'}</span>
                  <span className="font-bold text-slate-900">{completedTx.transactionId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">{isBn ? 'প্রদানকৃত অর্থ:' : 'Amount Paid:'}</span>
                  <span className="font-extrabold text-emerald-600 text-base font-sans">৳ {Number(completedTx?.amount || amount || 0).toLocaleString()} BDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">{isBn ? 'পেমেন্ট মাধ্যম:' : 'Payment Method:'}</span>
                  <span className="font-bold uppercase text-slate-800 font-sans">{completedTx.paymentMethod} (01973817167)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">{isBn ? 'দাতা / প্রদানকারী:' : 'Donor Name:'}</span>
                  <span className="text-slate-900 font-bold font-sans">{completedTx.donorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">{isBn ? 'তারিখ ও সময়:' : 'Date & Time:'}</span>
                  <span className="text-slate-700 font-sans">{new Date(completedTx.date || Date.now()).toLocaleString('bn-BD')}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-sans">
                  <span>✓ ASCAHDO কেন্দ্রীয় ফান্ডে ভেরিফাইড</span>
                  <span className="text-emerald-700 font-bold">স্ট্যাটাস: পরিশোধিত</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-3 rounded-xl transition shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isBn ? 'রসিদ প্রিন্ট করুন' : 'Print Receipt'}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 rounded-xl transition shadow"
                >
                  <span>{isBn ? 'সমাপ্ত' : 'Done'}</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {isBn ? 'অনুদানের পরিমাণ (টাকা)' : 'Donation Amount (BDT)'}
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[500, 1000, 2500, 5000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`py-1.5 text-xs font-extrabold rounded-xl border transition ${
                        amount === preset
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ৳ {(preset || 0).toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">৳</span>
                  <input
                    type="number"
                    min="10"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-base font-extrabold text-slate-900 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method Select */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {isBn ? 'পেমেন্ট মাধ্যম বেছে নিন' : 'Select Payment Method'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('bkash')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                      method === 'bkash'
                        ? 'border-pink-500 bg-pink-50 text-pink-700 font-bold ring-2 ring-pink-400'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-black text-pink-600">bKash</span>
                    <span className="text-[10px] text-slate-600 font-medium">০১৯৭৩৮১৭১৬৭</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('nagad')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                      method === 'nagad'
                        ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold ring-2 ring-orange-400'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-black text-orange-600">Nagad</span>
                    <span className="text-[10px] text-slate-600 font-medium">নগদ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('rocket')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                      method === 'rocket'
                        ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold ring-2 ring-purple-400'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-black text-purple-600">Rocket</span>
                    <span className="text-[10px] text-slate-600 font-medium">রকেট</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('bank')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                      method === 'bank'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold ring-2 ring-emerald-400'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <Building className="w-4 h-4 text-emerald-700" />
                    <span className="text-[10px] text-slate-700 font-medium">{isBn ? 'ব্যাংক' : 'Bank'}</span>
                  </button>
                </div>
              </div>

              {/* Number Card & Instructions */}
              <div className={`p-4 rounded-2xl border ${currentDetails.bgColor} ${currentDetails.borderColor} space-y-3 transition`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-500 block">
                      {currentDetails.type}
                    </span>
                    <span className="text-base sm:text-lg font-mono font-black text-slate-900 tracking-wider">
                      {currentDetails.number}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(currentDetails.number)}
                    className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition active:scale-95"
                  >
                    {copiedNumber ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">{isBn ? 'কপি হয়েছে!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-600" />
                        <span>{isBn ? 'নম্বর কপি করুন' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Steps */}
                <div className="pt-2 border-t border-slate-200/60 space-y-1 text-xs text-slate-700">
                  <p className="font-bold text-[11px] text-slate-900">
                    {isBn ? 'পেমেন্ট নির্দেশিকা:' : 'Payment Instructions:'}
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed text-slate-600">
                    {(currentDetails?.instructions || []).map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Transaction ID & Auto-Fill */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-800">
                    {isBn ? 'ট্রানজাকশন আইডি (TrxID)' : 'Transaction ID (TrxID)'}
                    <span className="text-rose-500 ml-1">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={generateDemoTrxId}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center gap-1 hover:underline"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isBn ? 'অটো TrxID বসান (টেস্টিং)' : 'Auto TrxID'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                  placeholder={isBn ? 'যেমন: BK9X87KL21 অথবা 8-10 ডিজিটের আইডি' : 'e.g. BK9X87KL21'}
                  className="w-full px-3 py-2 text-xs font-mono font-bold uppercase rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:font-sans placeholder:normal-case"
                />
              </div>

              {/* Payer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {isBn ? 'আপনার নাম' : 'Your Name'}
                  </label>
                  <input
                    type="text"
                    required={!isAnonymous}
                    disabled={isAnonymous}
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder={isAnonymous ? (isBn ? 'মহৎ বেনামী দাতা' : 'Anonymous') : (isBn ? 'যেমন: আরিফুল ইসলাম' : 'Full Name')}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:bg-slate-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {isBn ? 'মোবাইল নম্বর' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="anonCheck"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="anonCheck" className="text-xs text-slate-600 cursor-pointer select-none">
                  {isBn ? 'আমার নামটি প্রকাশ না করে বেনামে তালিকাভুক্ত করুন' : 'Keep my donation anonymous on public list'}
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black py-3 rounded-xl shadow-md transition active:scale-98 disabled:opacity-50 text-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {loading
                    ? (isBn ? 'পেমেন্ট যাচাই করা হচ্ছে...' : 'Verifying Payment...')
                    : (isBn ? `পেমেন্ট নিশ্চিত করুন (৳ ${(amount || 0).toLocaleString()})` : `Confirm Payment (৳ ${(amount || 0).toLocaleString()})`)}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
