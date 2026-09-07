import React, { useState, useEffect } from 'react';
import {
  DonationCategoryType,
  DonationFrequency,
  PaymentMethod,
  OfficialDonationTransaction
} from '../../types/donationTypes';
import { DONATION_CATEGORIES, formatTakaBn } from '../../utils/donationUtils';
import { api } from '../../services/api';
import {
  X, Heart, ShieldCheck, CheckCircle2, ChevronRight,
  ArrowLeft, CreditCard, Smartphone, Building2, QrCode,
  Sparkles, Users, Lock, Copy, Check, Info
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonationSuccess: (transaction: OfficialDonationTransaction) => void;
  initialCategory?: DonationCategoryType;
  initialAmount?: number;
  initialCampaignTitle?: string;
  initialCampaignId?: string;
}

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000, 25000];

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  onDonationSuccess,
  initialCategory = 'helpless_support',
  initialAmount = 1000,
  initialCampaignTitle,
  initialCampaignId
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [frequency, setFrequency] = useState<DonationFrequency>('one_time');
  const [amount, setAmount] = useState<number>(initialAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [category, setCategory] = useState<DonationCategoryType>(initialCategory);
  
  // Donor details
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorDistrict, setDonorDistrict] = useState('Dhaka (ঢাকা)');
  const [donorAddress, setDonorAddress] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [notesOrPrayer, setNotesOrPrayer] = useState('');

  // Payment details
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [senderAccountNo, setSenderAccountNo] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialCategory) setCategory(initialCategory);
    if (initialAmount) {
      setAmount(initialAmount);
      setCustomAmount(initialAmount.toString());
    }
  }, [initialCategory, initialAmount]);

  if (!isOpen) return null;

  const currentAmount = customAmount ? Number(customAmount) || 0 : amount;

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleNextStep = () => {
    setErrorMsg(null);
    if (step === 1) {
      if (currentAmount < 50) {
        setErrorMsg('অনুগ্রহ করে ন্যূনতম ৫০ টাকা বা তার বেশি নির্বাচন করুন।');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (!isAnonymous && !donorName.trim()) {
        setErrorMsg('অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন অথবা বেনামী দান চেক করুন।');
        return;
      }
      if (!donorPhone.trim()) {
        setErrorMsg('রসিদ নিশ্চিতকরণ ও এসএমএসের জন্য মোবাইল নম্বর দিন।');
        return;
      }
      setStep(4);
    }
  };

  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!transactionId.trim()) {
      setErrorMsg('অনুগ্রহ করে পেমেন্ট করার পর প্রাপ্ত ট্রানজেকশন আইডি (TrxID) প্রদান করুন।');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCatObj = DONATION_CATEGORIES.find((c) => c.id === category);

      const payload = {
        amount: currentAmount,
        frequency,
        category,
        categoryNameBn: selectedCatObj ? selectedCatObj.nameBn : 'সাধারণ অনুদান',
        campaignId: initialCampaignId,
        campaignTitle: initialCampaignTitle || selectedCatObj?.nameBn || 'সার্বিক কল্যাণ তহবিল',
        donorName: isAnonymous ? 'মহৎ বেনামী দাতা' : donorName,
        donorEmail,
        donorPhone,
        donorDistrict,
        donorAddress,
        isAnonymous,
        notesOrPrayer,
        paymentMethod,
        senderAccountNo,
        transactionId: transactionId.trim().toUpperCase()
      };

      const res = await api.createDonation(payload);
      setIsSubmitting(false);
      onClose();
      onDonationSuccess(res);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'অনুদানের তথ্য সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-rose-600 text-emerald-200 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                ১০০% স্বচ্ছ ও সরকারি নিবন্ধিত তহবিল
              </span>
              <h3 className="font-extrabold text-xl text-white">
                অনলাইনে মানবকল্যাণে দান করুন
              </h3>
            </div>
          </div>

          {/* Stepper Wizard Bar */}
          <div className="grid grid-cols-4 gap-2 mt-5 text-[11px] font-bold">
            {[
              { num: 1, title: 'পরিমাণ' },
              { num: 2, title: 'খাত নির্বাচন' },
              { num: 3, title: 'দাতার তথ্য' },
              { num: 4, title: 'পেমেন্ট' }
            ].map((st) => (
              <div
                key={st.num}
                onClick={() => {
                  if (st.num < step) setStep(st.num as any);
                }}
                className={`flex items-center gap-1.5 p-2 rounded-xl border cursor-pointer transition ${
                  step === st.num
                    ? 'bg-white/20 border-white text-white'
                    : step > st.num
                    ? 'bg-emerald-800/80 border-emerald-600 text-emerald-200'
                    : 'bg-black/20 border-white/10 text-slate-400'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === st.num ? 'bg-white text-emerald-950 font-bold' : 'bg-white/20 text-white'
                }`}>
                  {st.num}
                </span>
                <span className="truncate">{st.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="m-5 mb-0 bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
            <Info className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Wizard Steps */}
        <div className="p-6">
          
          {/* ========================================================
              STEP 1: FREQUENCY & AMOUNT
          ======================================================== */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Frequency Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  দানের পুনরাবৃত্তি নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFrequency('one_time')}
                    className={`py-3 px-4 rounded-2xl text-xs font-bold border-2 transition ${
                      frequency === 'one_time'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-sm">এককালীন অনুদান</span>
                    <span className="text-[10px] text-slate-500 font-normal">একবার নগদ বা গেটওয়ে প্রদান</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFrequency('monthly')}
                    className={`py-3 px-4 rounded-2xl text-xs font-bold border-2 transition ${
                      frequency === 'monthly'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-sm flex items-center justify-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      মাসিক নিয়মিত দান
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">ধারাবাহিক সাদকায়ে জারিয়া</span>
                  </button>
                </div>
              </div>

              {/* Amount Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  নির্দিষ্ট দানের পরিমাণ (টাকা):
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {PRESET_AMOUNTS.map((pAmount) => (
                    <button
                      key={pAmount}
                      type="button"
                      onClick={() => {
                        setAmount(pAmount);
                        setCustomAmount(pAmount.toString());
                      }}
                      className={`py-3 rounded-xl font-mono text-sm font-extrabold border-2 transition ${
                        currentAmount === pAmount
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow-md'
                          : 'border-slate-200 bg-white text-slate-800 hover:border-emerald-400'
                      }`}
                    >
                      {formatTakaBn(pAmount)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>অথবা নিজের পছন্দের পরিমাণ লিখুন:</span>
                  <span className="text-emerald-700 font-mono font-bold">নির্বাচিত: {formatTakaBn(currentAmount)}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-500 font-bold font-mono">৳</span>
                  <input
                    type="number"
                    min="50"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="উদা: ৫০০০"
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-emerald-600 focus:bg-white rounded-2xl pl-10 pr-4 py-3 text-sm font-mono font-bold text-slate-900 focus:outline-none transition"
                  />
                </div>
              </div>

              {initialCampaignTitle && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>আপনি সরাসরি <span className="font-bold">"{initialCampaignTitle}"</span> তহবিলে দান করছেন।</span>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              STEP 2: CATEGORY & CAUSE SELECTION
          ======================================================== */}
          {step === 2 && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                যে খাতে আপনার দান ব্যয় হবে (খাত নির্বাচন করুন):
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DONATION_CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-emerald-300'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <Heart className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-xs leading-snug ${isSelected ? 'text-emerald-950' : 'text-slate-900'}`}>
                          {cat.nameBn}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                          {cat.descriptionBn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 3: DONOR DETAILS
          ======================================================== */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Anonymous Toggle */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>গোপনীয় / বেনামী দান করতে চান?</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    টিক দিলে পাবলিক ড্যাশবোর্ড ও লিডারবোর্ডে আপনার নাম গোপন রাখা হবে।
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              {!isAnonymous && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    দাতার পূর্ণ নাম (রসিদে ছাপা হবে) *
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="উদা: ইঞ্জিনিয়ার মো. আরিফুল ইসলাম"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none transition"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    মোবাইল নম্বর (এসএমএস নিশ্চিতকরণে) *
                  </label>
                  <input
                    type="tel"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="০১৭xxxxxxxx"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    ই-মেইল (ডিজিটাল কপি পাঠাতে)
                  </label>
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="donor@example.com"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">জেলা</label>
                  <select
                    value={donorDistrict}
                    onChange={(e) => setDonorDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none transition"
                  >
                    {['Dhaka (ঢাকা)', 'Chittagong (চট্টগ্রাম)', 'Sylhet (সিলেট)', 'Rajshahi (রাজশাহী)', 'Khulna (খুলনা)', 'Barishal (বরিশাল)', 'Rangpur (রংপুর)', 'Mymensingh (ময়মনসিংহ)', 'প্রবাসী শুভাকাঙ্ক্ষী (Overseas)'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">ঠিকানা (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={donorAddress}
                    onChange={(e) => setDonorAddress(e.target.value)}
                    placeholder="বাড়ি, রাস্তা, থানা"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  বিশেষ দোয়া / মনের ইচ্ছা বা মন্তব্য (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  value={notesOrPrayer}
                  onChange={(e) => setNotesOrPrayer(e.target.value)}
                  placeholder="উদা: পিতা-মাতার মাগফিরাত ও পরিবারে বরকত কামনা..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none transition resize-none"
                />
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 4: PAYMENT & TRXID VERIFICATION
          ======================================================== */}
          {step === 4 && (
            <form onSubmit={handleSubmitDonation} className="space-y-5">
              {/* Payment Methods Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  পেমেন্ট গেটওয়ে নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'bkash', name: 'বিকাশ', sub: 'Merchant', icon: Smartphone, color: 'border-pink-500 bg-pink-50 text-pink-900' },
                    { id: 'nagad', name: 'নগদ', sub: 'Merchant', icon: Smartphone, color: 'border-orange-500 bg-orange-50 text-orange-900' },
                    { id: 'rocket', name: 'রকেট', sub: 'Personal', icon: Smartphone, color: 'border-purple-500 bg-purple-50 text-purple-900' },
                    { id: 'bank', name: 'ব্যাংক', sub: 'AC Wire', icon: Building2, color: 'border-blue-500 bg-blue-50 text-blue-900' }
                  ].map((pm) => {
                    const isSelected = paymentMethod === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id as any)}
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center transition ${
                          isSelected ? `${pm.color} shadow-sm ring-2 ring-emerald-600/30` : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <pm.icon className="w-5 h-5 mb-1 text-slate-700" />
                        <span className="font-extrabold text-xs">{pm.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{pm.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Instructions & QR Codes */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      {paymentMethod === 'bank' ? 'অফিসিয়াল ব্যাংক অ্যাকাউন্ট' : 'মার্চেন্ট পেমেন্ট নম্বর'}
                    </span>
                    
                    {paymentMethod === 'bank' ? (
                      <div className="space-y-1 text-xs">
                        <p className="font-bold text-white text-sm">Islami Bank Bangladesh PLC</p>
                        <p className="text-slate-300">Account Name: <span className="font-bold text-white">ASCAHDO CENTRAL TRUST</span></p>
                        <p className="text-slate-300 font-mono">Account No: <span className="font-bold text-emerald-400">20501450201887412</span></p>
                        <p className="text-slate-300">Branch: <span className="text-white">Dhanmondi Branch, Dhaka (Routing: 125271882)</span></p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-lg text-emerald-300">01973817167</span>
                          <button
                            type="button"
                            onClick={() => handleCopyNumber('01973817167')}
                            className="bg-white/10 hover:bg-white/20 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold text-slate-200 transition"
                          >
                            {copiedNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedNumber ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          {paymentMethod === 'bkash' ? 'বিকাশ অ্যাপ থেকে "Make Payment" অপশনে গিয়ে পেমেন্ট করুন।' :
                           paymentMethod === 'nagad' ? 'নগদ অ্যাপ থেকে "Merchant Pay" অপশনে যান।' :
                           'রকেট থেকে Send Money অপশনে গিয়ে পাঠিয়ে দিন।'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* QR Code */}
                  <div className="bg-white p-2 rounded-xl text-center shrink-0">
                    <QRCodeSVG
                      value={`01973817167|ASCAHDO|${currentAmount}|${paymentMethod}`}
                      size={76}
                    />
                    <span className="text-[9px] text-slate-600 font-bold block mt-1">সরাসরি স্ক্যান</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">অনুদানের পরিমাণ:</span>
                  <span className="font-mono font-extrabold text-base text-emerald-300">{formatTakaBn(currentAmount)}</span>
                </div>
              </div>

              {/* TrxID Input */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>পেমেন্ট শেষে পাওয়া ট্রানজেকশন আইডি (TrxID) দিন *</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">যেমন: BK99482103 বা Trx Code</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="উদা: BK88492019"
                    className="w-full bg-slate-50 border-2 border-emerald-600 focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm font-mono font-extrabold text-slate-900 focus:outline-none transition uppercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    যে নম্বর/অ্যাকাউন্ট থেকে টাকা পাঠিয়েছেন (Sender No)
                  </label>
                  <input
                    type="text"
                    value={senderAccountNo}
                    onChange={(e) => setSenderAccountNo(e.target.value)}
                    placeholder="উদা: ০১৭xxxxxxxx"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-extrabold text-xs sm:text-sm py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>রসিদ প্রস্তুত হচ্ছে...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>দান নিশ্চিত করুন ও তাৎক্ষণিক রসিদ গ্রহণ করুন</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

        {/* Wizard Footer Controls */}
        {step < 4 && (
          <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>পূর্ববর্তী</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNextStep}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow transition flex items-center gap-1.5"
            >
              <span>পরবর্তী ধাপ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
