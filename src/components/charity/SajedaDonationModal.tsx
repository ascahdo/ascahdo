import React, { useState, useEffect } from 'react';
import {
  Heart, X, CheckCircle2, ShieldCheck, Lock,
  CreditCard, Smartphone, Building2, User, Phone,
  Mail, MessageSquare, Download, Share2, Printer, Sparkles, AlertCircle
} from 'lucide-react';
import { SYF_6_CAUSES, SYF_FEATURED_CAMPAIGNS, SYF_BANK_ACCOUNTS, SYF_BRAND } from '../../data/sajedaCharityData';
import { DonationRecord, DonationTier } from '../../types/donationTypes';

interface SajedaDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCauseId?: string;
  initialCampaignId?: string;
  onDonationComplete?: (record: DonationRecord) => void;
}

export const SajedaDonationModal: React.FC<SajedaDonationModalProps> = ({
  isOpen,
  onClose,
  initialCauseId,
  initialCampaignId,
  onDonationComplete
}) => {
  const [donationFrequency, setDonationFrequency] = useState<'one_time' | 'monthly' | 'yearly'>('one_time');
  const [donationType, setDonationType] = useState<'general' | 'zakat' | 'sadaqah' | 'emergency'>('general');
  const [selectedCause, setSelectedCause] = useState<string>(initialCauseId || 'food');
  const [selectedCampaign, setSelectedCampaign] = useState<string>(initialCampaignId || '');
  const [amount, setAmount] = useState<number>(1000);
  const [customAmountStr, setCustomAmountStr] = useState<string>('1000');

  // Donor Profile
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorDistrict, setDonorDistrict] = useState('ঢাকা');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [inMemoryOf, setInMemoryOf] = useState('');
  const [specialPrayerNotes, setSpecialPrayerNotes] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'upay' | 'card' | 'bank_transfer'>('bkash');
  const [trxId, setTrxId] = useState('');
  const [senderAccountNo, setSenderAccountNo] = useState('');

  // Flow State
  const [currentStep, setCurrentStep] = useState<'form' | 'payment_process' | 'receipt'>('form');
  const [createdReceipt, setCreatedReceipt] = useState<DonationRecord | null>(null);

  const presetAmounts = [500, 1000, 2000, 5000, 10000, 25000];

  useEffect(() => {
    if (initialCauseId) setSelectedCause(initialCauseId);
    if (initialCampaignId) setSelectedCampaign(initialCampaignId);
  }, [initialCauseId, initialCampaignId]);

  if (!isOpen) return null;

  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setCustomAmountStr(val.toString());
  };

  const handleCustomAmountChange = (valStr: string) => {
    setCustomAmountStr(valStr);
    const num = parseInt(valStr.replace(/\D/g, ''), 10);
    if (!isNaN(num) && num > 0) {
      setAmount(num);
    } else {
      setAmount(0);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('অনুগ্রহ করে সঠিক অনুদানের পরিমাণ লিখুন।');
      return;
    }
    if (!donorPhone && !isAnonymous) {
      alert('অনুগ্রহ করে মোবাইল নম্বর প্রদান করুন।');
      return;
    }
    setCurrentStep('payment_process');
  };

  const handleCompletePayment = () => {
    const randomReceiptNum = `SYF-DON-${Date.now().toString().slice(-6)}`;
    const randomTxn = trxId || `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const record: DonationRecord = {
      id: `rec_${Date.now()}`,
      receiptNumber: randomReceiptNum,
      donorName: isAnonymous ? 'গোপন শুভাকাঙ্ক্ষী' : (donorName || 'শুভাকাঙ্ক্ষী দাতা'),
      donorPhone: donorPhone || '০১৭XXXXXXXX',
      donorEmail: donorEmail || '',
      donorDistrict: donorDistrict,
      isAnonymous,
      amount: amount,
      currency: 'BDT',
      donationFrequency,
      donationType,
      causeId: selectedCause,
      campaignId: selectedCampaign,
      paymentMethod,
      transactionId: randomTxn,
      paymentStatus: 'completed',
      donatedAt: new Date().toISOString(),
      donatedAtBn: '২৭ আগস্ট ২০২৬',
      inMemoryOf: inMemoryOf || undefined,
      notes: specialPrayerNotes || undefined,
      taxExemptionEligible: true
    };

    setCreatedReceipt(record);
    setCurrentStep('receipt');
    if (onDonationComplete) {
      onDonationComplete(record);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 my-auto max-h-[95vh] flex flex-col text-left">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>১০০% নিরাপদ ও শরীয়াহসম্মত অনুদান চ্যানেল</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {currentStep === 'receipt' ? 'দান প্রাপ্তি রসিদ (Official Receipt)' : 'সাজেদা ইয়ুথ ফাউন্ডেশনে অনুদান দিন'}
          </h2>
          <p className="text-xs text-emerald-100 mt-0.5">
            {currentStep === 'receipt'
              ? 'আপনার অনুদান সফলভাবে সংরক্ষিত ও নিবন্ধিত হয়েছে।'
              : 'আপনার ক্ষুদ্র সাহায্য একজন বিপন্ন মানুষের বাঁচার শেষ ভরসা।'}
          </p>
        </div>

        {/* Modal Body Container */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: Main Donation Form */}
          {currentStep === 'form' && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              
              {/* Frequency Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                  দানের ধরন (Frequency):
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setDonationFrequency('one_time')}
                    className={`py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer ${
                      donationFrequency === 'one_time'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    এককালীন দান (One-Time)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonationFrequency('monthly')}
                    className={`py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer ${
                      donationFrequency === 'monthly'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    মাসিক নিয়মিত দান (Monthly)
                  </button>
                </div>
              </div>

              {/* Fund Category Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    অনুদানের খাত (Cause Category) *
                  </label>
                  <select
                    value={selectedCause}
                    onChange={(e) => setSelectedCause(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  >
                    {SYF_6_CAUSES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.titleBn} ({c.title})
                      </option>
                    ))}
                    <option value="zakat">যাকাত তহবিল (১০০% হকদার বণ্টন)</option>
                    <option value="sadaqah">সাধারণ সদকা ও আপৎকালীন তহবিল</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ক্যাম্পেইন নির্বাচন (ঐচ্ছিক)
                  </label>
                  <select
                    value={selectedCampaign}
                    onChange={(e) => setSelectedCampaign(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">সাধারণ সেন্ট্রাল ফান্ড</option>
                    {SYF_FEATURED_CAMPAIGNS.map((camp) => (
                      <option key={camp.id} value={camp.id}>
                        {camp.titleBn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Amount Selection */}
              <div className="space-y-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                <label className="block text-xs font-black text-slate-900">
                  অনুদানের পরিমাণ (Amount in BDT):
                </label>

                {/* Preset Chips */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {presetAmounts.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className={`py-2 px-2 rounded-xl text-xs font-black font-mono transition cursor-pointer border ${
                        amount === p
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-500'
                      }`}
                    >
                      ৳{(p || 0).toLocaleString('bn-BD')}
                    </button>
                  ))}
                </div>

                {/* Custom Input */}
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-500 font-bold text-sm">৳</span>
                  <input
                    type="text"
                    value={customAmountStr}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    placeholder="নিজের ইচ্ছামতো পরিমাণ লিখুন..."
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Donor Details Card */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    দাতার তথ্য ও আমানত
                  </span>
                  
                  {/* Anonymous Toggle */}
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-emerald-800">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-emerald-700 w-4 h-4"
                    />
                    <Lock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>নাম গোপন রাখুন (Anonymous)</span>
                  </label>
                </div>

                {!isAnonymous && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">পূর্ণ নাম *</label>
                      <input
                        type="text"
                        placeholder="আপনার শুভ নাম"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর * (রসিদ এসএমএস যাবে)</label>
                      <input
                        type="tel"
                        placeholder="০১৭১১-XXXXXX"
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">ইমেইল (ডিজিটাল রসিদের জন্য)</label>
                      <input
                        type="email"
                        placeholder="example@mail.com"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">জেলা / শহর</label>
                      <input
                        type="text"
                        placeholder="ঢাকা / চট্টগ্রাম ইত্যাদি"
                        value={donorDistrict}
                        onChange={(e) => setDonorDistrict(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* Dedication / In Memory Of */}
                <div className="pt-2 text-xs">
                  <label className="block font-bold text-slate-700 mb-1">কারও স্মরণে / দোয়া ও মন্তব্য (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    placeholder="মরহুম পিতা/মাতার মাগফিরাত কামনায় বা বিশেষ দোয়ার আবেদন..."
                    value={inMemoryOf}
                    onChange={(e) => setInMemoryOf(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Submit to Next Step */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm sm:text-base shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>৳{(amount || 0).toLocaleString('bn-BD')} প্রদান করতে এগিয়ে যান</span>
              </button>

            </form>
          )}

          {/* STEP 2: Payment Gateway Simulation & Instructions */}
          {currentStep === 'payment_process' && (
            <div className="space-y-6">
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-800 font-bold block">অনুদানের মোট পরিমাণ:</span>
                  <span className="text-2xl font-black text-emerald-950 font-mono">৳{(amount || 0).toLocaleString('bn-BD')} BDT</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep('form')}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  পরিবর্তন করুন
                </button>
              </div>

              {/* Payment Methods Tabs */}
              <div className="space-y-2 text-xs">
                <label className="block font-black text-slate-900 uppercase">পেমেন্ট মেথড নির্বাচন করুন:</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                      paymentMethod === 'bkash' ? 'bg-pink-50 border-pink-500 text-pink-700 shadow-xs' : 'bg-white border-slate-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-pink-600" />
                    <span>bKash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nagad')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                      paymentMethod === 'nagad' ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-xs' : 'bg-white border-slate-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-orange-600" />
                    <span>Nagad</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('rocket')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                      paymentMethod === 'rocket' ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-xs' : 'bg-white border-slate-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-purple-600" />
                    <span>Rocket</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upay')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                      paymentMethod === 'upay' ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-xs' : 'bg-white border-slate-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-amber-600" />
                    <span>Upay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                      paymentMethod === 'card' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs' : 'bg-white border-slate-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                      paymentMethod === 'bank_transfer' ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-xs' : 'bg-white border-slate-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-teal-600" />
                    <span>Bank</span>
                  </button>
                </div>
              </div>

              {/* Payment Details / Account Guide */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                {(paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket' || paymentMethod === 'upay') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">
                        {paymentMethod.toUpperCase()} মার্চেন্ট / ডোনেশন নম্বর:
                      </span>
                      <span className="font-mono font-black text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-300">
                        ০১৭১১-৮৮৯৯০০ (Make Payment)
                      </span>
                    </div>

                    <p className="text-slate-600 leading-relaxed font-medium">
                      ১. আপনার {paymentMethod.toUpperCase()} অ্যাপে যান অথবা ডায়াল করুন।<br />
                      ২. <strong>Make Payment / Send Money</strong> অপশন নির্বাচন করে উপরে উল্লেখিত নম্বরে <strong>৳{(amount || 0).toLocaleString('bn-BD')}</strong> পাঠান।<br />
                      ৩. সফল লেনদেন শেষে প্রাপ্ত Transaction ID (TrxID) নিচে লিখে নিশ্চিত করুন।
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Transaction ID (TrxID) *</label>
                        <input
                          type="text"
                          required
                          placeholder="উদাঃ 9H8X7Y2Z"
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono uppercase"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">প্রেরক নম্বর (Sender No)</label>
                        <input
                          type="tel"
                          placeholder="০১XXXXXXXXX"
                          value={senderAccountNo}
                          onChange={(e) => setSenderAccountNo(e.target.value)}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank_transfer' && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900">অফিসিয়াল ব্যাংক অ্যাকাউন্ট তথ্য:</h4>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 font-mono text-xs">
                      <div className="font-sans font-bold text-sm text-emerald-800">{SYF_BANK_ACCOUNTS.bank.bankNameBn} ({SYF_BANK_ACCOUNTS.bank.bankName})</div>
                      <div>অ্যাকাউন্ট নাম: <strong>{SYF_BANK_ACCOUNTS.bank.accountNameBn}</strong></div>
                      <div>অ্যাকাউন্ট নম্বর: <strong className="text-emerald-700 text-sm font-black">{SYF_BANK_ACCOUNTS.bank.accountNumber}</strong></div>
                      <div>শাখা: <strong>{SYF_BANK_ACCOUNTS.bank.branchBn}</strong></div>
                      <div>রাউটিং নম্বর: <strong>{SYF_BANK_ACCOUNTS.bank.routingNumber}</strong> | সুইফট কোড: <strong>{SYF_BANK_ACCOUNTS.bank.swiftCode}</strong></div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-2">
                    <p className="text-slate-600 font-medium">
                      SSLCommerz সিকিউর পেমেন্ট গেটওয়ের মাধ্যমে সরাসরি ভিসা, মাস্টারকার্ড ও অ্যামেক্স কার্ড গ্রহণ করা হচ্ছে।
                    </p>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="font-bold text-slate-800">নিরাপদ গেটওয়ে এনক্রিপশন:</span>
                      <span className="text-emerald-700 font-mono font-bold text-xs">256-bit SSL Verified</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm CTA */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep('form')}
                  className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
                >
                  পিছনে যান
                </button>

                <button
                  type="button"
                  onClick={handleCompletePayment}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>পেমেন্ট নিশ্চিত করুন ও রসিদ ডাউনলোড করুন</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Live Digital Invoice / Receipt */}
          {currentStep === 'receipt' && createdReceipt && (
            <div className="space-y-6">
              
              {/* Receipt Visual Card */}
              <div className="bg-slate-50 p-6 rounded-3xl border-2 border-emerald-600 space-y-4 text-xs font-medium text-slate-800 relative">
                
                {/* Stamp / Watermark */}
                <div className="absolute top-6 right-6 border-2 border-emerald-600 text-emerald-800 px-3 py-1 rounded-xl text-xs font-mono font-black uppercase rotate-6 bg-emerald-50/90">
                  ✓ PAID & VERIFIED
                </div>

                {/* Receipt Header */}
                <div className="pb-3 border-b border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-800 font-black text-base">
                    <Heart className="w-5 h-5 fill-emerald-600" />
                    <span>{SYF_BRAND.nameBn}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{SYF_BRAND.addressBn} • ফোন: {SYF_BRAND.helpline}</p>
                </div>

                {/* Receipt Details Grid */}
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div>
                    <span className="text-slate-500 font-sans text-[11px] block">রসিদ নম্বর:</span>
                    <span className="font-bold text-slate-900">{createdReceipt.receiptNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-sans text-[11px] block">তারিখ ও সময়:</span>
                    <span className="font-bold text-slate-900">{createdReceipt.donatedAtBn}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-sans text-[11px] block">দাতার নাম:</span>
                    <span className="font-bold text-slate-900 font-sans">{createdReceipt.donorName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-sans text-[11px] block">অনুদানের খাত:</span>
                    <span className="font-bold text-emerald-800 font-sans">
                      {createdReceipt.causeId === 'zakat' ? 'যাকাত তহবিল' : 'মানবিক সহায়তা তহবিল'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-sans text-[11px] block">পেমেন্ট মেথড:</span>
                    <span className="font-bold text-slate-900 uppercase">{createdReceipt.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-sans text-[11px] block">Transaction ID:</span>
                    <span className="font-bold text-slate-900">{createdReceipt.transactionId}</span>
                  </div>
                </div>

                {/* Total Paid Highlight */}
                <div className="bg-emerald-100/70 p-4 rounded-2xl border border-emerald-300 flex items-center justify-between font-mono">
                  <span className="font-sans font-bold text-emerald-950 text-xs">মোট অনুদানের পরিমাণ:</span>
                  <span className="text-xl font-black text-emerald-950">৳{(createdReceipt?.amount || 0).toLocaleString('bn-BD')} BDT</span>
                </div>

                <div className="text-[10px] text-slate-500 leading-tight pt-1">
                  * আয়কর আইন অনুযায়ী সাজেদা ইয়ুথ ফাউন্ডেশনে প্রদত্ত সকল অনুদান আয়কর রেয়াত ও ট্যাক্স সুবিধা প্রাপ্তির যোগ্য।
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>রসিদ প্রিন্ট / PDF</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-black hover:bg-emerald-800 flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ধন্যবাদ (সম্পন্ন করুন)</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
