import React, { useState } from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  Heart,
  CreditCard,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Printer,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Droplet,
  HeartPulse,
  DollarSign,
  AlertCircle,
  FileText,
  User,
  Phone,
  Building2,
  Clock,
  X
} from 'lucide-react';

interface BloodDonationFundProps {
  onOpenSOS?: () => void;
}

const PRESET_AMOUNTS = [
  { amount: 500, labelBn: '৳৫০০', descBn: '১ জন রোগীর জরুরি ব্লাড গ্রুপিং ও ক্রস-ম্যাচিং টেস্ট', descEn: 'Blood grouping & cross-matching test' },
  { amount: 1250, labelBn: '৳১,২৫০', descBn: '১ ব্যাগ জরুরি রক্ত সংগ্রহ, স্ক্রিনিং ও পরিবহন কিট (প্রস্তাবিত)', descEn: '1 Bag Emergency Blood Kit, Screening & Transport (Recommended)', isPopular: true },
  { amount: 2500, labelBn: '৳২,৫০০', descBn: '২ জন মুমূর্ষু রোগীর সম্পূর্ণ রক্তদান ও থ্যালাসেমিয়া সাপোর্ট', descEn: 'Full blood & Thalassemia care for 2 patients' },
  { amount: 5000, labelBn: '৳৫,০০০', descBn: 'একটি উপজেলা ব্লাড ক্যাম্পেইন ও মোবাইল ডোনার সাপোর্ট', descEn: 'Upazila Blood Camp & Mobile Donor Outreach' }
];

const PAYMENT_METHODS = [
  {
    id: 'bkash',
    name: 'bKash (বিকাশ)',
    type: 'Merchant / Personal Send Money',
    number: '01973817167',
    accountType: 'মার্চেন্ট / পার্সোনাল',
    iconBg: 'bg-pink-600',
    color: '#D12053',
    logoText: 'bKash',
    instructionsBn: 'বিকাশ অ্যাপের "Send Money" বা "Make Payment" অপশনে গিয়ে নিচের নম্বরে ১২৫০ টাকা পাঠান এবং ট্রানজেকশন আইডি (TrxID) নিচে দিন।'
  },
  {
    id: 'nagad',
    name: 'Nagad (নগদ)',
    type: 'Send Money',
    number: '01973817167',
    accountType: 'পার্সোনাল',
    iconBg: 'bg-orange-600',
    color: '#F7931E',
    logoText: 'Nagad',
    instructionsBn: 'নগদ অ্যাপ বা *167# ডায়াল করে "Send Money" অপশনে গিয়ে নিচের নম্বরে পাঠান এবং TrxID দিন।'
  },
  {
    id: 'rocket',
    name: 'Rocket (রকেট)',
    type: 'Personal Account',
    number: '01973817167-7',
    accountType: 'পার্সোনাল',
    iconBg: 'bg-purple-700',
    color: '#8C3494',
    logoText: 'Rocket',
    instructionsBn: 'রকেট অ্যাকাউন্টে Send Money করুন এবং ফিরতি এসএমএসের TxnID টি এখানে লিখুন।'
  },
  {
    id: 'upay',
    name: 'Upay (উপায়)',
    type: 'Personal Wallet',
    number: '01973817167',
    accountType: 'পার্সোনাল',
    iconBg: 'bg-blue-600',
    color: '#005BAA',
    logoText: 'Upay',
    instructionsBn: 'উপায় অ্যাপ থেকে Send Money করে TrxID সংগ্রহ করুন।'
  },
  {
    id: 'bank',
    name: 'Islami Bank Bangladesh PLC',
    type: 'Direct Bank Transfer / BEFTN / NPSB',
    number: 'Account: 20503810200123456',
    accountType: 'A/C Name: ASCADO Blood & Health Welfare Fund',
    branch: 'Green Road Branch, Dhaka (Routing: 125273391)',
    iconBg: 'bg-emerald-700',
    color: '#008751',
    logoText: 'IBBL',
    instructionsBn: 'যেকোনো ব্যাংক থেকে অনলাইন ট্রান্সফার (BEFTN/NPSB/iBanking) করে রেফারেন্স বা ট্রানজেকশন নম্বর দিন।'
  }
];

export const BloodDonationFundSection: React.FC<BloodDonationFundProps> = () => {
  const { isBn } = useTranslation();
  const [selectedAmount, setSelectedAmount] = useState<number>(1250);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>('bkash');
  const [donorName, setDonorName] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [trxId, setTrxId] = useState<string>('');
  const [donationPurpose, setDonationPurpose] = useState<string>('emergency_blood_kit');
  const [copied, setCopied] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<any | null>(null);

  // Recent blood fund supporters
  const [recentSupporters, setRecentSupporters] = useState([
    { name: 'ডা. মাহমুদুল হাসান', amount: 1250, location: 'ঢাকা', time: '১০ মিনিট আগে', purpose: 'জরুরি স্ক্রিনিং কিট' },
    { name: 'তানভীর আহমেদ', amount: 1250, location: 'চট্টগ্রাম', time: '২৫ মিনিট আগে', purpose: 'থ্যালাসেমিয়া রক্ত সহায়তা' },
    { name: 'আফরিন জাহান', amount: 2500, location: 'রাজশাহী', time: '১ ঘণ্টা আগে', purpose: 'আইসিইউ পেশেন্ট ফান্ড' },
    { name: 'মেসার্স আল-মদিনা এন্টারপ্রাইজ', amount: 5000, location: 'সিলেট', time: '৩ ঘণ্টা আগে', purpose: 'উপজেলা রক্ত ক্যাম্প' },
    { name: 'শহীদুল ইসলাম', amount: 1250, location: 'বগুড়া', time: '৪ ঘণ্টা আগে', purpose: 'জরুরি রক্তদাতা যাতায়াত' }
  ]);

  const activeAmount = customAmount ? Number(customAmount) : selectedAmount;
  const currentMethodObj = PAYMENT_METHODS.find((m) => m.id === selectedMethod) || PAYMENT_METHODS[0];

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num.replace(/[^0-9-]/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenDonate = () => {
    setShowPaymentModal(true);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !donorPhone.trim() || !trxId.trim()) {
      alert(isBn ? 'অনুগ্রহ করে নাম, মোবাইল নম্বর এবং ট্রানজেকশন আইডি প্রদান করুন।' : 'Please provide Name, Phone, and Transaction ID.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const receiptNo = `ASC-BLD-${Math.floor(100000 + Math.random() * 900000)}`;
      const newReceipt = {
        receiptNo,
        donorName,
        donorPhone,
        donorEmail: donorEmail || 'N/A',
        amount: activeAmount,
        paymentMethod: currentMethodObj.name,
        trxId,
        purpose: donationPurpose === 'emergency_blood_kit' 
          ? 'জরুরি রক্ত কিট, স্ক্রিনিং ও যাতায়াত অনুদান (৳১২৫০)' 
          : donationPurpose === 'thalassemia' 
          ? 'থ্যালাসেমিয়া ও ডায়ালাইসিস রোগীর রক্ত সহায়তা'
          : 'সাধারণ সেন্ট্রাল ব্লাড ব্যাংক ফান্ড',
        date: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      };

      setReceiptData(newReceipt);
      setRecentSupporters([
        { name: donorName, amount: activeAmount, location: 'বাংলাদেশ', time: 'এইমাত্র', purpose: 'জরুরি রক্ত সহায়তা' },
        ...recentSupporters.slice(0, 4)
      ]);
      setIsProcessing(false);
    }, 900);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <section id="blood-donation-fund" className="py-12 bg-gradient-to-b from-rose-50/60 via-white to-slate-50 border-y border-rose-100/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title with Badge */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-800 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
            <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
            <span>{isBn ? 'জরুরি রক্ত সহায়তা ফান্ড • অনুদান ১২৫০ টাকা' : 'Emergency Blood Support Fund • ৳1,250'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            {isBn ? 'আপনার ১২৫০ টাকার অনুদানে বাঁচবে' : 'Your ৳1,250 Donation Saves'}{' '}
            <span className="text-rose-600">{isBn ? '১টি অমূল্য জীবন' : 'A Precious Life'}</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {isBn
              ? 'মুমূর্ষু ও হতদরিদ্র রোগীর জরুরি রক্তের প্রয়োজনে ক্রস-ম্যাচিং, হেপাটাইটিস/এইচআইভি স্ক্রিনিং কিট ও স্বেচ্ছাসেবী রক্তদাতার দ্রুত যাতায়াত খরচের জন্য ১২৫০ টাকার বিশেষ ফান্ড। বিকাশ, নগদ ও ব্যাংকের মাধ্যমে সহজে অনুদান দিন।'
              : 'Support life-saving blood cross-matching, 5-mandatory viral screening tests, and rapid donor emergency transport kit for critically ill patients.'}
          </p>
        </div>

        {/* Main Grid: Left Donation Box + Right Impact & Method Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Interactive Donation Box (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-rose-200/90 relative overflow-hidden space-y-6">
            
            {/* Top highlight ribbon */}
            <div className="flex items-center justify-between pb-4 border-b border-rose-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md">
                  <Droplet className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base sm:text-lg">
                    {isBn ? 'ব্লাড ব্যাংক অনুদান ও ফান্ডিং কিট' : 'Blood Bank Emergency Aid'}
                  </h3>
                  <p className="text-[11px] text-rose-700 font-bold">
                    {isBn ? '১২৫০ টাকা জরুরি রক্তদান কিট ও রোগী সহায়তা' : '1,250 BDT Emergency Patient Package'}
                  </p>
                </div>
              </div>

              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {isBn ? '১০০% স্বচ্ছ ও যাচাইকৃত' : '100% Verified'}
              </span>
            </div>

            {/* Purpose Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                {isBn ? '১. অনুদানের খাত নির্বাচন করুন' : '1. Select Donation Purpose'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'emergency_blood_kit', title: isBn ? 'জরুরি রক্ত কিট (১২৫০৳)' : 'Emergency Blood Kit (৳1250)', icon: Droplet },
                  { id: 'thalassemia', title: isBn ? 'থ্যালাসেমিয়া সাপোর্ট' : 'Thalassemia Support', icon: HeartPulse },
                  { id: 'general_blood', title: isBn ? 'সেন্ট্রাল ব্লাড ব্যাংক' : 'Central Blood Fund', icon: Sparkles }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDonationPurpose(item.id)}
                    className={`p-3 rounded-2xl border text-left font-bold transition flex items-center gap-2 cursor-pointer ${
                      donationPurpose === item.id
                        ? 'border-rose-600 bg-rose-50 text-rose-900 ring-2 ring-rose-400'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="text-[11px] font-black">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Selection Grid */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  {isBn ? '২. অনুদানের পরিমাণ নির্বাচন করুন' : '2. Select Donation Amount'}
                </label>
                <span className="text-[11px] text-rose-600 font-bold">
                  {isBn ? 'ডিফল্ট: ১২৫০ টাকা' : 'Default: 1250 BDT'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESET_AMOUNTS.map((item) => {
                  const isSelected = selectedAmount === item.amount && !customAmount;
                  return (
                    <button
                      key={item.amount}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(item.amount);
                        setCustomAmount('');
                      }}
                      className={`relative p-3.5 rounded-2xl border text-center transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-rose-600 bg-gradient-to-b from-rose-600 to-red-600 text-white shadow-lg ring-2 ring-rose-400'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900'
                      }`}
                    >
                      {item.isPopular && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-tighter">
                          {isBn ? 'প্রস্তাবিত' : 'Suggested'}
                        </span>
                      )}
                      <div className="text-base sm:text-lg font-black">{item.labelBn}</div>
                      <div className={`text-[10px] mt-1 font-medium line-clamp-2 leading-tight ${isSelected ? 'text-rose-100' : 'text-slate-500'}`}>
                        {isBn ? item.descBn : item.descEn}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount Input */}
              <div className="pt-2">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">৳</span>
                  <input
                    type="number"
                    min="50"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder={isBn ? 'অথবা আপনার ইচ্ছামতো অন্য যেকোনো পরিমাণ লিখুন (যেমন: ১২৫০)' : 'Or enter custom amount in BDT'}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-xs font-bold text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Quick Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                {isBn ? '৩. পেমেন্ট মাধ্যম নির্বাচন করুন' : '3. Choose Payment Method'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethod(m.id)}
                    className={`p-2.5 rounded-2xl border text-center font-bold text-xs transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      selectedMethod === m.id
                        ? 'border-rose-600 bg-rose-50/80 text-rose-900 ring-2 ring-rose-400 font-black'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${m.iconBg}`} />
                    <span className="text-[11px] leading-tight">{m.logoText}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Method Account Detail Box */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">{currentMethodObj.name} ({currentMethodObj.accountType})</span>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                  সক্রিয় একাউন্ট
                </span>
              </div>

              <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 font-black text-sm">
                <span>{currentMethodObj.number}</span>
                <button
                  type="button"
                  onClick={() => handleCopyNumber(currentMethodObj.number)}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'কপি করুন' : 'Copy')}</span>
                </button>
              </div>

              {currentMethodObj.branch && (
                <p className="text-[11px] text-slate-500 font-sans">{currentMethodObj.branch}</p>
              )}

              <p className="text-[11px] text-slate-600 leading-normal">
                💡 {currentMethodObj.instructionsBn}
              </p>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handleOpenDonate}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-black text-sm sm:text-base shadow-lg shadow-rose-600/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>
                {isBn ? `৳${activeAmount} টাকা অনুদান সম্পন্ন করুন` : `Proceed to Donate ৳${activeAmount}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

          {/* RIGHT: Breakdown of ৳1,250 & Real-time Contributor Roster (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* ৳1,250 Cost Breakdown Card */}
            <div className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-4 border border-rose-800/40">
              <div className="flex items-center gap-2 text-rose-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isBn ? '১২৫০ টাকায় কী কী সেবা পায় রোগী?' : 'Where Does ৳1,250 Go?'}</span>
              </div>

              <h4 className="text-lg sm:text-xl font-black leading-snug">
                {isBn ? 'আপনার ১২৫০ টাকা অনুদানের সম্পূর্ণ ব্যয় বিবরণী' : 'Transparent Cost Breakdown Per Life Saved'}
              </h4>

              <div className="space-y-2.5 text-xs text-slate-200">
                <div className="flex items-start gap-2.5 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="w-5 h-5 rounded-full bg-rose-500/30 text-rose-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">১</span>
                  <div>
                    <strong className="text-white block font-bold">ক্রস-ম্যাচিং ও স্ক্রিনিং টেস্ট (৳৫০০)</strong>
                    <span className="text-[11px] text-slate-400">HIV, HBV, HCV, Syphilis ও Malaria মুক্ত নিরাপদ রক্ত নিশ্চিতকরণ।</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="w-5 h-5 rounded-full bg-rose-500/30 text-rose-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">২</span>
                  <div>
                    <strong className="text-white block font-bold">জরুরি রক্ত স্থানান্তর ও পরিবহন কিট (৳৪৫০)</strong>
                    <span className="text-[11px] text-slate-400">দূরবর্তী জেলা/উপজেলা থেকে রক্তদাতার যাতায়াত ও আইস-বক্স স্টোরেজ কিট।</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="w-5 h-5 rounded-full bg-rose-500/30 text-rose-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">৩</span>
                  <div>
                    <strong className="text-white block font-bold">ডোনার নিউট্রিশন ও পোস্ট-ডোনেশন কেয়ার (৳৩০০)</strong>
                    <span className="text-[11px] text-slate-400">রক্তদান পরবর্তী হাইড্রেটিং জুস, পুষ্টি প্যাক ও ডিজিটাল ডোনার আইডি সনদ।</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-rose-200 font-bold">
                <span>সর্বমোট এককালীন ফান্ড:</span>
                <span className="text-lg font-black text-amber-300">৳১,২৫০ টাকা</span>
              </div>
            </div>

            {/* Live Supporters Roster */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                  <h4 className="font-black text-sm text-slate-900">{isBn ? 'সাম্প্রতিক রক্ত সহায়তা দানকারী' : 'Recent Supporters'}</h4>
                </div>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  লাইভ আপডেট
                </span>
              </div>

              <div className="space-y-2.5">
                {recentSupporters.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-rose-50/50 transition border border-slate-100 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-[11px]">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="text-[10px] text-slate-500">{s.location} • {s.purpose}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-rose-600">৳{s.amount}</div>
                      <div className="text-[9px] text-slate-400">{s.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* PAYMENT & VERIFICATION MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-rose-200 overflow-hidden my-8">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-white text-rose-700 flex items-center justify-center font-black">
                  <Heart className="w-5 h-5 fill-rose-700" />
                </div>
                <div>
                  <h3 className="font-black text-base">
                    {isBn ? '১২৫০ টাকা ব্লাড ব্যাংক অনুদান নিশ্চিতকরণ' : 'Confirm ৳1,250 Blood Fund Donation'}
                  </h3>
                  <p className="text-xs text-rose-200 font-medium">
                    {isBn ? 'পেমেন্ট ভেরিফিকেশন ও ডিজিটাল রসিদ' : 'Transaction ID Verification & Receipt'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setShowPaymentModal(false); setReceiptData(null); }}
                className="text-rose-200 hover:text-white p-1 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {receiptData ? (
              /* Receipt View */
              <div className="p-6 space-y-5 print:p-0">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-emerald-900 text-base">
                    {isBn ? 'অনুদান সফলভাবে গৃহীত হয়েছে!' : 'Donation Verified Successfully!'}
                  </h4>
                  <p className="text-xs text-emerald-700 font-medium">
                    {isBn ? 'মানবতার সেবায় আপনার এ অবদান রোগীর অমূল্য জীবন রক্ষায় ব্যয় হবে।' : 'Thank you for your generous contribution.'}
                  </p>
                </div>

                {/* Printable Certificate / Voucher */}
                <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-5 space-y-3 font-sans text-xs">
                  <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[10px] font-black text-rose-600 uppercase">ASCADO CENTRAL BLOOD BANK</span>
                      <h5 className="font-black text-slate-900 text-sm">অফিসিয়াল অনুদান রসিদ</h5>
                    </div>
                    <span className="font-mono font-bold text-slate-600 text-[11px]">#{receiptData.receiptNo}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10px]">দাতা:</span>
                      <strong className="text-slate-900">{receiptData.donorName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">মোবাইল:</span>
                      <strong className="text-slate-900 font-mono">{receiptData.donorPhone}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">অনুদানের পরিমাণ:</span>
                      <strong className="text-rose-600 text-sm font-black">৳{receiptData.amount} টাকা</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">পেমেন্ট মেথড:</span>
                      <strong className="text-slate-900">{receiptData.paymentMethod}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block text-[10px]">ট্রানজেকশন আইডি:</span>
                      <strong className="text-slate-900 font-mono">{receiptData.trxId}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block text-[10px]">খাত:</span>
                      <span className="text-slate-800 font-medium">{receiptData.purpose}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between">
                    <span>তারিখ: {receiptData.date}</span>
                    <span className="text-emerald-700 font-bold">✓ ভেরিফাইড সিল</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handlePrintReceipt}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-xs text-slate-700 flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{isBn ? 'রসিদ প্রিন্ট' : 'Print Receipt'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowPaymentModal(false); setReceiptData(null); }}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                  >
                    {isBn ? 'সম্পন্ন' : 'Done'}
                  </button>
                </div>
              </div>
            ) : (
              /* Payment Submission Form */
              <form onSubmit={handleSubmitPayment} className="p-6 space-y-4 text-xs">
                
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-slate-800 space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>অনুদানের পরিমাণ:</span>
                    <span className="text-rose-700 text-sm font-black">৳{activeAmount} টাকা</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    মেথড: <strong>{currentMethodObj.name}</strong> • নম্বর: <strong className="font-mono">{currentMethodObj.number}</strong>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'আপনার পূর্ণ নাম' : 'Donor Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="যেমন: মো. কামরুল হাসান"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'মোবাইল নম্বর' : 'Phone Number'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                    </label>
                    <input
                      type="email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'ট্রানজেকশন আইডি (TrxID / Ref No)' : 'Transaction ID (TrxID)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="যেমন: 9J3K8L2M1Q"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 font-mono text-slate-900 font-bold uppercase"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {isBn ? 'বিকাশ/নগদ/রকেটে টাকা পাঠানোর পর ফিরতি এসএমএসের TrxID এখানে লিখুন।' : 'Enter the TrxID received in SMS after payment.'}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isProcessing ? (
                      <span>{isBn ? 'যাচাই করা হচ্ছে...' : 'Verifying...'}</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isBn ? 'অনুদানের তথ্য সাবমিট করুন' : 'Submit & Get Receipt'}</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
