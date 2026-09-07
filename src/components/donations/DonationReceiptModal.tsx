import React, { useState } from 'react';
import { OfficialDonationTransaction } from '../../types/donationTypes';
import { formatTakaBn } from '../../utils/donationUtils';
import {
  X, Printer, Download, CheckCircle2, ShieldCheck,
  Heart, Sparkles, Award, QrCode, Copy, Check, FileText
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface DonationReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: OfficialDonationTransaction | null;
}

export const DonationReceiptModal: React.FC<DonationReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction
}) => {
  const [activeView, setActiveView] = useState<'receipt' | 'certificate'>('receipt');
  const [copiedTrx, setCopiedTrx] = useState(false);

  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyTrx = () => {
    if (transaction.transactionId) {
      navigator.clipboard.writeText(transaction.transactionId);
      setCopiedTrx(true);
      setTimeout(() => setCopiedTrx(false), 2000);
    }
  };

  const formattedDate = transaction.createdAt
    ? new Date(transaction.createdAt).toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : new Date().toLocaleDateString('bn-BD');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Top Control Bar (Hidden in Print) */}
        <div className="print:hidden bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight text-emerald-400">
                স্বয়ংক্রিয় ডিজিটাল দান রসিদ ও প্রত্যয়নপত্র
              </h3>
              <p className="text-[11px] text-slate-300 font-mono">
                রসিদ নং: <span className="text-white font-bold">{transaction.receiptNumber}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="bg-slate-800 p-0.5 rounded-xl flex items-center text-xs">
              <button
                onClick={() => setActiveView('receipt')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  activeView === 'receipt' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5 inline mr-1" />
                অফিসিয়াল রসিদ
              </button>
              <button
                onClick={() => setActiveView('certificate')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  activeView === 'certificate' ? 'bg-amber-600 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5 inline mr-1" />
                সম্মাননা সনদ
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              প্রিন্ট / PDF
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Content Area */}
        <div className="p-4 sm:p-8 bg-slate-50/50 print:bg-white print:p-0">
          {activeView === 'receipt' ? (
            /* ========================================================
               OFFICIAL DONATION RECEIPT (অফিসিয়াল দান রসিদ)
            ======================================================== */
            <div className="bg-white border-2 border-emerald-800/80 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden print:border-2 print:rounded-none">
              
              {/* Background Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
                <Heart className="w-96 h-96 text-emerald-900" />
              </div>

              {/* Decorative Corner Ornaments */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-emerald-700 pointer-events-none" />
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-emerald-700 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-emerald-700 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-emerald-700 pointer-events-none" />

              {/* Header */}
              <div className="text-center border-b-2 border-emerald-700 pb-4 mb-5 relative">
                <div className="inline-block bg-emerald-800 text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider mb-2">
                  গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত ও ভেরিফাইড সমাজকল্যাণ সংস্থা
                </div>
                <h2 className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                  আসকাডো কেন্দ্রীয় মানবকল্যাণ ট্রাস্ট ও ফাউন্ডেশন
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  ASCAHDO Central Social Welfare Trust • Reg No: NGO-DH-88741
                </p>
                <p className="text-[11px] text-slate-500">
                  কেন্দ্রীয় কার্যালয়: হাউজ-১২, রোড-০৫, ধানমন্ডি, ঢাকা-১২০৫ | হটলাইন: ০১৯৭৩৮১৭১৬৭ | www.ascado.org
                </p>
                <div className="mt-3 inline-block bg-emerald-50 border border-emerald-300 text-emerald-900 font-extrabold text-sm px-6 py-1 rounded-lg">
                  ★ অফিসিয়াল ডিজিটাল অর্থপ্রাপ্তি রসিদ (OFFICIAL MONEY RECEIPT) ★
                </div>
              </div>

              {/* Meta Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 text-xs mb-5">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">রসিদ নম্বর (Receipt No):</span>
                  <span className="font-mono font-extrabold text-emerald-900 text-sm">{transaction.receiptNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">ট্রানজেকশন আইডি (TrxID):</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold text-slate-800">{transaction.transactionId}</span>
                    <button
                      onClick={handleCopyTrx}
                      className="print:hidden text-slate-400 hover:text-emerald-700 p-0.5"
                      title="Copy TrxID"
                    >
                      {copiedTrx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">তারিখ ও সময় (Date):</span>
                  <span className="font-medium text-slate-800">{formattedDate}</span>
                </div>
              </div>

              {/* Main Receipt Body */}
              <div className="space-y-3.5 text-xs text-slate-800 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 border-b border-dashed border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold min-w-[140px]">শ্রদ্ধেয় দাতার নাম:</span>
                  <span className="font-extrabold text-sm text-slate-900 flex-1">
                    {transaction.isAnonymous ? 'মহৎ বেনামী শুভাকাঙ্ক্ষী (Anonymous Donor)' : transaction.donorName}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-dashed border-slate-200 pb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-slate-500 font-bold min-w-[140px]">মোবাইল নম্বর:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {transaction.isAnonymous ? 'গোপন রাখা হয়েছে' : (transaction.donorPhone || 'প্রযোজ্য নয়')}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-slate-500 font-bold min-w-[100px]">জেলা / ঠিকানা:</span>
                    <span className="font-semibold text-slate-800">{transaction.donorDistrict || 'বাংলাদেশ'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-dashed border-slate-200 pb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-slate-500 font-bold min-w-[140px]">দানের খাত / উদ্দেশ্য:</span>
                    <span className="font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                      {transaction.categoryNameBn || transaction.category}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-slate-500 font-bold min-w-[100px]">দানের ধরন:</span>
                    <span className="font-semibold text-slate-700">
                      {transaction.frequency === 'monthly' ? 'মাসিক নিয়মিত অনুদান' : 'এককালীন মহতী দান'}
                    </span>
                  </div>
                </div>

                {transaction.campaignTitle && (
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 border-b border-dashed border-slate-200 pb-2">
                    <span className="text-slate-500 font-bold min-w-[140px]">নির্দিষ্ট তহবিল/প্রকল্প:</span>
                    <span className="font-semibold text-slate-900 flex-1">{transaction.campaignTitle}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-dashed border-slate-200 pb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-slate-500 font-bold min-w-[140px]">পেমেন্ট মাধ্যম:</span>
                    <span className="font-bold uppercase text-slate-800">
                      {transaction.paymentMethod === 'bkash' ? 'বিকাশ (bKash Gateway)' :
                       transaction.paymentMethod === 'nagad' ? 'নগদ (Nagad Online)' :
                       transaction.paymentMethod === 'rocket' ? 'রকেট (Rocket Mobile)' :
                       transaction.paymentMethod === 'bank' ? 'ব্যাংক ট্রান্সফার (Bank Wire)' : transaction.paymentMethod}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-slate-500 font-bold min-w-[100px]">রসিদ স্ট্যাটাস:</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ভেরিফাইড ও গৃহীত (PAID)
                    </span>
                  </div>
                </div>

                {transaction.notesOrPrayer && (
                  <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-2.5 text-slate-700">
                    <span className="text-amber-900 font-bold block text-[11px]">দাতার বিশেষ দোয়া / মন্তব্য:</span>
                    <span className="italic">{transaction.notesOrPrayer}</span>
                  </div>
                )}
              </div>

              {/* Amount Highlight Box */}
              <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md mb-6">
                <div>
                  <span className="text-emerald-200 text-[11px] font-bold uppercase tracking-wider block">
                    প্রাপ্ত মোট অর্থের পরিমাণ (Received Amount)
                  </span>
                  <div className="font-extrabold text-2xl sm:text-3xl text-emerald-300">
                    {formatTakaBn(transaction.amount)}
                  </div>
                </div>
                <div className="text-right sm:border-l sm:border-emerald-700/60 sm:pl-4">
                  <span className="text-emerald-100 text-xs font-medium block">
                    কর অব্যাহতি সনদ নং: 884-NBR/NGO-EXEMPT
                  </span>
                  <span className="text-[11px] text-emerald-200 block">
                    ইনকাম ট্যাক্স আইন ২০২৩ অনুযায়ী সম্পূর্ণ করমুক্ত
                  </span>
                </div>
              </div>

              {/* Footer with QR Code, Verification and Signatures */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 pt-4 border-t-2 border-slate-200">
                {/* QR Code */}
                <div className="flex items-center gap-3">
                  <div className="bg-white p-1.5 border border-slate-300 rounded-lg shadow-2xs">
                    <QRCodeSVG
                      value={transaction.qrCodeData || `https://ascado.org/verify-receipt?rec=${transaction.receiptNumber}`}
                      size={68}
                      level="M"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">ডিজিটাল সত্যতা যাচাই</span>
                    <span className="text-[10px] text-emerald-700 font-bold block">QR কোড স্ক্যান করুন</span>
                    <span className="text-[9px] text-slate-400 font-mono">100% Verified Record</span>
                  </div>
                </div>

                {/* Organization Seal */}
                <div className="text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-rose-600/70 text-rose-700 flex flex-col items-center justify-center p-1 font-bold text-[8px] uppercase rotate-[-8deg] shadow-2xs bg-rose-50/40">
                    <span>★ আসকাডো ★</span>
                    <span className="text-[7px]">সিলমোহর</span>
                    <span className="text-[6px]">VERIFIED</span>
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1">অফিসিয়াল ডিজিটাল সিল</span>
                </div>

                {/* Authority Signatures */}
                <div className="text-right space-y-1">
                  <div className="font-serif italic font-bold text-slate-800 text-sm border-b border-slate-400 pb-0.5 inline-block">
                    M. Rahman & ED
                  </div>
                  <p className="text-[10px] font-bold text-slate-700">অর্থ সম্পাদক ও নির্বাহী পরিচালক</p>
                  <p className="text-[9px] text-slate-400">আসকাডো কেন্দ্রীয় মানবকল্যাণ ট্রাস্ট</p>
                </div>
              </div>

              {/* Bottom Notice */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400">
                এটি একটি কম্পিউটার জেনারেটেড ও ডিজিটালভাবে অনুমোদিত সরকারি নিবন্ধিত রসিদ। কোনো ম্যানুয়াল স্বাক্ষরের প্রয়োজন নেই।
              </div>
            </div>
          ) : (
            /* ========================================================
               DONOR APPRECIATION CERTIFICATE (সম্মাননা সনদ)
            ======================================================== */
            <div className="bg-amber-50/50 border-4 border-double border-amber-600 rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden print:border-4 print:rounded-none">
              {/* Certificate Border Pattern */}
              <div className="absolute inset-2 border-2 border-amber-400/60 pointer-events-none rounded-xl" />

              <div className="text-center space-y-3 relative z-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-400 text-amber-800 mb-1 shadow-xs">
                  <Award className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight">
                    কৃতজ্ঞতা ও মানবকল্যাণ সম্মাননা সনদ
                  </h3>
                  <p className="text-xs text-amber-800 font-bold uppercase tracking-widest mt-1">
                    CERTIFICATE OF APPRECIATION & PHILANTHROPY
                  </p>
                  <p className="font-mono text-xs text-slate-500 mt-0.5">
                    সনদ নং: <span className="font-bold text-amber-900">{transaction.certificateNumber || 'ASC-CERT-DON-2026-8801'}</span>
                  </p>
                </div>

                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed pt-2">
                  মানবতার সেবায় আত্মনিবেদন ও সুবিধাবঞ্চিত অসহায় মানুষের কল্যাণে অনন্য অবদান রাখার স্বীকৃতিস্বরূপ
                </p>

                <div className="py-2">
                  <span className="text-slate-500 block text-xs font-bold uppercase">অত্র মহতী সম্মাননা সনদ প্রদান করা হলো</span>
                  <div className="font-serif font-extrabold text-2xl sm:text-3xl text-emerald-900 border-b-2 border-amber-500 inline-block px-8 py-1 mt-1">
                    {transaction.isAnonymous ? 'শ্রদ্ধেয় মহৎ বেনামী দাতা' : transaction.donorName}
                  </div>
                </div>

                <p className="text-xs text-slate-700 max-w-xl mx-auto leading-relaxed">
                  আপনার প্রদত্ত অনুদান <span className="font-bold text-emerald-800">{formatTakaBn(transaction.amount)}</span> ({transaction.categoryNameBn || transaction.category}) অসহায় মানুষের মুখে হাসি ফোটাতে এবং জীবনমান উন্নয়নে সরাসরি ভূমিকা রাখবে। আপনার এই নিঃস্বার্থ মহৎ দানের জন্য আসকাডো কেন্দ্রীয় পরিষদ গভীর কৃতজ্ঞতা প্রকাশ করছে।
                </p>

                {/* Hadith / Quote */}
                <div className="bg-amber-100/60 border border-amber-300/80 rounded-xl p-3 max-w-md mx-auto text-amber-900 text-xs italic">
                  "দান কখনো সম্পদ কমায় না, বরং সম্পদে বরকত বৃদ্ধি করে।" — আল-হাদীস
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 pt-6 mt-4 border-t border-amber-300 text-xs">
                  <div className="text-left">
                    <p className="font-bold text-slate-800">তারিখ: {formattedDate.split(',')[0]}</p>
                    <p className="text-[11px] text-slate-500">ঢাকা, বাংলাদেশ</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-serif italic font-bold text-amber-900 text-sm">ড. মো. আসাদুজ্জামান</p>
                    <p className="text-[11px] font-bold text-slate-800">চেয়ারম্যান ও নির্বাহী পরিচালক</p>
                    <p className="text-[10px] text-slate-500">আসকাডো কেন্দ্রীয় ট্রাস্ট</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="print:hidden bg-white px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>ভেরিফিকেশন লিঙ্ক: <span className="font-mono text-[11px] text-slate-700">ascado.org/verify</span></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              রসিদ ডাউনলোড ও প্রিন্ট করুন
            </button>
            <button
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
