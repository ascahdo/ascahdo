import React, { useState } from 'react';
import {
  X, Key, ShieldCheck, Download, Search, CheckCircle2,
  Copy, FileText, Calendar, User, Smartphone, AlertCircle, Sparkles, ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';

interface DigitalVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  isBn: boolean;
  initialPhone?: string;
  initialOrderId?: string;
}

export const DigitalVaultModal: React.FC<DigitalVaultModalProps> = ({
  isOpen,
  onClose,
  isBn,
  initialPhone = '',
  initialOrderId = ''
}) => {
  if (!isOpen) return null;

  const [phone, setPhone] = useState(initialPhone);
  const [orderId, setOrderId] = useState(initialOrderId);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [digitalItems, setDigitalItems] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phone.trim() && !orderId.trim()) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে মোবাইল নম্বর অথবা অর্ডার আইডি লিখুন।' : 'Please enter your phone number or Order ID.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.lookupDigitalVault({
        phone: phone.trim() || undefined,
        orderId: orderId.trim() || undefined
      });

      if (res && res.digitalItems) {
        setDigitalItems(res.digitalItems);
      } else {
        setDigitalItems([]);
      }
      setSearched(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(isBn ? 'তথ্য খুঁজে পেতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' : 'Failed to search vault. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-indigo-200 my-6 space-y-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white flex items-center justify-center font-black shadow-md">
              <Key className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-lg sm:text-xl">
                  {isBn ? 'গ্রাহক ডিজিটাল ভল্ট ও লাইসেন্স পোর্টাল' : 'Customer Digital Vault & License Locker'}
                </h3>
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  {isBn ? 'আজীবন অ্যাক্সেস' : 'Lifetime Access'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isBn
                  ? 'আপনার পূর্বে কেনা ডিজিটাল ফাইল, ই-বুক বা সফটওয়্যারের লাইসেন্স কী ও ডাউনলোড লিংক পুনরায় খুঁজে নিন।'
                  : 'Retrieve your purchased digital files, cryptographic license keys, and direct downloads anytime.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="bg-indigo-50/50 p-4 sm:p-5 rounded-2xl border border-indigo-100 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isBn ? 'মোবাইল নম্বর' : 'Phone Number'}</span>
              </label>
              <input
                type="text"
                placeholder={isBn ? 'যেমন: 01711223344' : 'e.g. 01711223344'}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isBn ? 'অথবা অর্ডার আইডি (ঐচ্ছিক)' : 'Or Order ID (Optional)'}</span>
              </label>
              <input
                type="text"
                placeholder={isBn ? 'যেমন: ord_171...' : 'e.g. ord_171...'}
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-1.5 text-rose-600 text-xs font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">
              {isBn ? '✓ যেকোনো একটি ফিল্ড দিলেই আপনার লাইব্রেরির সব ডিজিটাল পণ্য পাওয়া যাবে' : '✓ Enter your phone or order ID to instantly fetch your files'}
            </span>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? (isBn ? 'অনুসন্ধান চলছে...' : 'Searching...') : (isBn ? 'ভল্ট অনুসন্ধান করুন' : 'Search Vault')}</span>
            </button>
          </div>
        </form>

        {/* Results Area */}
        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
          {searched && digitalItems.length === 0 && !loading && (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <Key className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">
                {isBn ? 'কোনো ডিজিটাল পণ্য পাওয়া যায়নি' : 'No digital assets found for this search'}
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {isBn
                  ? 'আপনার দেওয়া মোবাইল নম্বর অথবা অর্ডার আইডি পুনরায় যাচাই করুন। প্রয়োজনে আমাদের সাপোর্টে যোগাযোগ করুন।'
                  : 'Please double-check your phone number or Order ID.'}
              </p>
            </div>
          )}

          {digitalItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border-2 border-indigo-100 p-4 sm:p-5 shadow-xs hover:border-indigo-300 transition space-y-3"
            >
              {/* Product Info & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200">
                      {item.licenseType || 'Personal License'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.orderId}
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 text-sm sm:text-base mt-1">
                    {item.productName}
                  </h4>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs font-black text-emerald-600 flex items-center sm:justify-end gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isBn ? 'ভেরিফায়েড অ্যাক্টিভ লাইসেন্স' : 'Verified License'}</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isBn ? 'ক্রয় তারিখ:' : 'Purchased:'} {item.orderDate ? new Date(item.orderDate).toLocaleDateString('bn-BD') : 'আজ'}
                  </span>
                </div>
              </div>

              {/* License Key Certificate Display */}
              <div className="bg-slate-900 text-slate-100 rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{isBn ? 'অফিসিয়াল ডিজিটাল লাইসেন্স কোড (License Key)' : 'Official Digital License Key'}</span>
                  </span>
                  <div className="font-mono text-sm sm:text-base font-black text-amber-300 tracking-wide select-all">
                    {item.licenseKey}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(item.licenseKey, item.orderId + idx)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
                >
                  {copiedKey === item.orderId + idx ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">{isBn ? 'কপি হয়েছে' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isBn ? 'কোড কপি করুন' : 'Copy Key'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action and Download Links */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 text-xs">
                <div className="text-slate-500 text-center sm:text-left">
                  <span>{isBn ? 'ক্রেতা:' : 'Buyer:'} <strong>{item.buyerName || 'সম্মানিত গ্রাহক'}</strong></span>
                  {item.sellerName && (
                    <span className="ml-2 text-slate-400">| {item.sellerName}</span>
                  )}
                </div>

                <a
                  href={item.downloadUrl || 'https://ascado.org/downloads/digital-file.zip'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <Download className="w-4 h-4" />
                  <span>{isBn ? 'ইনস্ট্যান্ট ফাইল ডাউনলোড' : 'Download Files Now'}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>{isBn ? '🔒 ক্লাউড ভল্ট সুরক্ষিত এবং ডিজিটাল কপিরাইট সংরক্ষিত' : '🔒 256-bit encrypted digital vault.'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
