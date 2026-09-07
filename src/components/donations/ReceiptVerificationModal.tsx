import React, { useState } from 'react';
import { OfficialDonationTransaction } from '../../types/donationTypes';
import { formatTakaBn } from '../../utils/donationUtils';
import {
  X, Search, ShieldCheck, CheckCircle2, AlertCircle,
  FileText, ExternalLink, Printer, QrCode, Lock
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ReceiptVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewReceipt: (transaction: OfficialDonationTransaction) => void;
  allTransactions?: OfficialDonationTransaction[];
}

export const ReceiptVerificationModal: React.FC<ReceiptVerificationModalProps> = ({
  isOpen,
  onClose,
  onViewReceipt,
  allTransactions = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<OfficialDonationTransaction | null | 'not_found'>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    const found = allTransactions.find((tx) => {
      return (
        tx.receiptNumber.toLowerCase().includes(query) ||
        tx.transactionId.toLowerCase().includes(query) ||
        (tx.donorPhone && tx.donorPhone.includes(query)) ||
        (tx.certificateNumber && tx.certificateNumber.toLowerCase().includes(query))
      );
    });

    setHasSearched(true);
    setSearchResult(found || 'not_found');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                সরকারি নিবন্ধিত ডিজিটাল অডিট ডেটাবেজ
              </span>
              <h3 className="font-extrabold text-lg text-white">
                অনলাইন দান রসিদ ও ট্রানজেকশন যাচাই
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2">
            আপনার দানের রসিদ নম্বর (Receipt No), TrxID অথবা মোবাইল নম্বর দিয়ে রসিদের সত্যতা যাচাই ও কপি ডাউনলোড করুন।
          </p>
        </div>

        {/* Search Input Box */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="উদা: ASC-REC-2026-10481 বা BK99482103 বা 01711..."
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-emerald-600 focus:bg-white rounded-2xl px-4 py-3.5 pl-11 text-xs sm:text-sm font-mono text-slate-900 focus:outline-none transition"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3.5 rounded-2xl shadow transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>রসিদের তথ্য যাচাই করুন</span>
            </button>
          </form>

          {/* Search Result Feedback */}
          {hasSearched && (
            <div>
              {searchResult === 'not_found' ? (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-rose-900">কোনো ভেরিফাইড রসিদ পাওয়া যায়নি</h4>
                  <p className="text-xs text-rose-700">
                    অনুগ্রহ করে রসিদ নম্বর বা TrxID সঠিকভাবে লিখুন অথবা আমাদের কেন্দ্রীয় সেন্ট্রাল হেল্পলাইনে যোগাযোগ করুন।
                  </p>
                </div>
              ) : searchResult ? (
                <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="font-extrabold text-sm text-emerald-950">
                        ১০০% আসল ও ভেরিফাইড অফিসিয়াল রসিদ
                      </span>
                    </div>
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      VERIFIED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">রসিদ নম্বর:</span>
                      <span className="font-mono font-bold text-slate-900">{searchResult.receiptNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">ট্রানজেকশন আইডি:</span>
                      <span className="font-mono font-bold text-slate-900">{searchResult.transactionId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">দাতার নাম:</span>
                      <span className="font-bold text-slate-800">
                        {searchResult.isAnonymous ? 'মহৎ বেনামী দাতা' : searchResult.donorName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">দানের খাত:</span>
                      <span className="font-semibold text-emerald-800">{searchResult.categoryNameBn || searchResult.category}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">দানের পরিমাণ:</span>
                      <span className="font-extrabold text-base text-emerald-700">{formatTakaBn(searchResult.amount)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">গ্রহণের তারিখ:</span>
                      <span className="font-medium text-slate-700">{searchResult.createdAt ? searchResult.createdAt.split('T')[0] : '2026-08-26'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-200 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onViewReceipt(searchResult);
                      }}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>রসিদ ও সার্টিফিকেট দেখুন / প্রিন্ট</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Fast Sample Queries for Easy Testing */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
            <span className="font-bold text-slate-700 block text-[11px]">
              নমুনা রসিদ দিয়ে ট্রাই করুন:
            </span>
            <div className="flex flex-wrap gap-2">
              {['ASC-REC-2026-10481', 'ASC-REC-2026-10482', 'BK99482103'].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => setSearchQuery(sample)}
                  className="bg-white hover:bg-emerald-50 border border-slate-200 text-emerald-800 font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
