import React, { useState } from 'react';
import { Store, ShieldCheck, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

interface VendorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newVendor: any) => void;
  isBn: boolean;
}

export const VendorRegistrationModal: React.FC<VendorRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isBn
}) => {
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('ঢাকা');
  const [type, setType] = useState<'physical' | 'digital' | 'both'>('both');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('bkash');
  const [payoutAccount, setPayoutAccount] = useState('');
  const [pledgeAccepted, setPledgeAccepted] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgeAccepted) {
      alert(isBn ? 'দয়া করে ১০০% হালাল ও বিশ্বস্ততার অঙ্গীকার গ্রহণ করুন' : 'Please accept the Halal compliance pledge');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        storeName: storeName || 'New Halal Store',
        storeNameBn: storeName,
        ownerName,
        phone,
        email,
        district,
        type,
        descriptionBn,
        payoutMethod,
        payoutAccount
      };
      const created = await api.createVendor(payload);
      onSuccess(created);
      onClose();
    } catch (err) {
      console.error(err);
      alert(isBn ? 'ভেন্ডর নিবন্ধন ব্যর্থ হয়েছে' : 'Vendor registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-amber-200 my-8 space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">
                {isBn ? 'ভেন্ডর অনবোর্ডিং' : 'VENDOR REGISTRATION'}
              </span>
              <h3 className="font-black text-lg text-slate-900">
                {isBn ? 'ভেন্ডর ও উৎপাদক হিসেবে যুক্ত হোন' : 'Join as Verified Halal Vendor'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 space-y-1.5">
          <div className="flex items-center gap-2 font-black text-amber-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{isBn ? 'স্বচ্ছ ব্যবসায়িক মডেল (১০% প্ল্যাটফর্ম কমিশন)' : 'Fair 10% Platform Commission'}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-950/80">
            {isBn
              ? 'বিক্রিত মূল্যের ৯০% সরাসরি আপনার বিকাশ/নগদ বা ব্যাংক একাউন্টে প্রতি সপ্তাহের রবিবারে প্রদান করা হবে। কোনো লুকানো চার্জ নেই।'
              : 'Keep 90% of every sale. Payouts sent directly to your bKash, Nagad, or Bank account every Sunday.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isBn ? 'দোকান / ব্রান্ডের নাম' : 'Store / Brand Name'} *
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder={isBn ? 'যেমন: নূর ডিজিটাল ক্রাফট' : 'e.g. Pure Agro Hub'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isBn ? 'স্বত্বাধিকারীর নাম' : 'Owner Full Name'} *
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder={isBn ? 'যেমন: মুফতি আব্দুর রহিম' : 'Full Name'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isBn ? 'মোবাইল নম্বর' : 'Phone Number'} *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vendor@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isBn ? 'জেলা / অঞ্চল' : 'District'} *
              </label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="যেমন: ঢাকা / সিলেট / রাজশাহী"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isBn ? 'পণ্যের ধরন' : 'Product Type'} *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-medium"
              >
                <option value="both">{isBn ? 'উভয়ই (ডিজিটাল ও ফিজিক্যাল)' : 'Both Digital & Physical'}</option>
                <option value="digital">{isBn ? 'শুধুমাত্র ডিজিটাল পণ্য (ই-বুক, সফটওয়্যার, আর্ট)' : 'Digital Products Only'}</option>
                <option value="physical">{isBn ? 'শুধুমাত্র ফিজিক্যাল পণ্য (মধু, ঘি, তেল, হস্তশিল্প)' : 'Physical Products Only'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {isBn ? 'পণ্য বা প্রতিষ্ঠানের সংক্ষিপ্ত বিবরণ' : 'Store Description'}
            </label>
            <textarea
              rows={2}
              value={descriptionBn}
              onChange={(e) => setDescriptionBn(e.target.value)}
              placeholder={isBn ? 'আপনার উৎপাদিত পণ্য ও কোয়ালিটি সম্পর্কে সংক্ষেপে লিখুন...' : 'Briefly describe your products and commitment to Halal quality...'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isBn ? 'পেআউট মাধ্যম (টাকা গ্রহণ)' : 'Payout Method'}
              </label>
              <select
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="bkash">bKash Personal / Merchant</option>
                <option value="nagad">Nagad</option>
                <option value="rocket">Rocket</option>
                <option value="bank">Bank Account</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isBn ? 'একাউন্ট নম্বর' : 'Account Number'} *
              </label>
              <input
                type="text"
                required
                value={payoutAccount}
                onChange={(e) => setPayoutAccount(e.target.value)}
                placeholder="01XXXXXXXXX / Bank Acc No"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-start gap-2.5 pt-2">
            <input
              type="checkbox"
              id="pledgeCheck"
              checked={pledgeAccepted}
              onChange={(e) => setPledgeAccepted(e.target.checked)}
              className="mt-1 rounded text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="pledgeCheck" className="text-[11px] text-slate-600 leading-relaxed cursor-pointer">
              {isBn
                ? 'আমি শপথ করছি যে আমার প্রস্তাবিত সকল পণ্য শতভাগ হালাল, কোনো সুদ, হারাম বা অনৈতিক উপাদান নেই এবং পণ্যের বিবরণ সম্পূর্ণ সত্য।'
                : 'I pledge that all listed products comply 100% with Halal principles and ethical standards.'}
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black shadow-md transition cursor-pointer"
            >
              {submitting
                ? (isBn ? 'নিবন্ধন হচ্ছে...' : 'Registering...')
                : (isBn ? 'ভেন্ডর হিসেবে যোগ দিন' : 'Register Vendor')}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
