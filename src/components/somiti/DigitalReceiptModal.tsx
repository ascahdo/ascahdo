import React from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  X, Printer, Download, CheckCircle, ShieldCheck,
  Building2, QrCode, Share2, FileText, ArrowDownRight
} from 'lucide-react';
import { SavingsTransaction } from '../../types/somitiTypes';

interface DigitalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: SavingsTransaction | null;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction
}) => {
  const { isBn } = useTranslation();

  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200">
        
        {/* Top Header Controls */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight">
                {isBn ? 'ডিজিটাল ই-রসিদ ও মানি রিসিট' : 'Official Digital Money Receipt'}
              </h3>
              <p className="text-[10px] text-emerald-400 font-bold">
                ASCAHDO ERP Verified Transaction
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isBn ? 'প্রিন্ট' : 'Print'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 overflow-y-auto space-y-5 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50 print:p-0">
          
          {/* Org & Somiti Heading */}
          <div className="text-center border-b border-dashed border-slate-300 pb-4">
            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black mb-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত মাল্টি-সমিতি নেটওয়ার্ক</span>
            </div>
            <h2 className="text-lg font-black text-slate-900 leading-tight">
              {transaction.somitiName}
            </h2>
            <p className="text-xs font-semibold text-slate-600">
              {transaction.branchName} • শাখা কোড: {transaction.branchId}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              কেন্দ্রীয় কন্ট্রোল হাব: এসকাডো মাল্টি-এনজিও সমন্বিত ব্যবস্থাপনা
            </p>
          </div>

          {/* Amount Showcase Badge */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white text-center shadow-md relative overflow-hidden">
            <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">
              {transaction.transactionType === 'deposit' ? 'গৃহীত মোট সঞ্চয় জমা' : 'উত্তোলিত অর্থ'}
            </div>
            <div className="text-3xl font-black mt-0.5 tracking-tight text-white">
              ৳ {(transaction?.amount || 0).toLocaleString()} <span className="text-xs font-bold text-emerald-300">BDT</span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-emerald-200">
              <span className="px-2 py-0.5 rounded-md bg-white/10 font-bold">
                পেমেন্ট মেথড: {transaction.paymentMethod}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/30 font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>যাচাইকৃত (Verified)</span>
              </span>
            </div>
          </div>

          {/* Receipt Key-Value Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5 text-xs shadow-2xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">{isBn ? 'রসিদ নম্বর:' : 'Receipt No:'}</span>
              <span className="font-black text-slate-900 font-mono">{transaction.receiptNo}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">{isBn ? 'লেনদেন আইডি (TrxID):' : 'Transaction ID:'}</span>
              <span className="font-bold text-emerald-700 font-mono">{transaction.trxId}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">{isBn ? 'সদস্যের নাম ও আইডি:' : 'Member Name & ID:'}</span>
              <span className="font-black text-slate-900">{transaction.memberName} ({transaction.memberId})</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">{isBn ? 'স্কিম / প্রোডাক্ট:' : 'Product:'}</span>
              <span className="font-bold text-indigo-700 uppercase">{transaction.productType} Savings</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">{isBn ? 'তারিখ ও সময়:' : 'Date & Time:'}</span>
              <span className="font-semibold text-slate-700">{transaction.date} • {transaction.time}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">{isBn ? 'আদায়কারী / কালেক্টর:' : 'Collector:'}</span>
              <span className="font-bold text-slate-800">{transaction.collectorName}</span>
            </div>

            <div className="flex justify-between py-1 pt-2 bg-emerald-50/70 px-2 rounded-lg">
              <span className="text-emerald-900 font-bold">{isBn ? 'লেনদেন পরবর্তী বর্তমান স্থিতি:' : 'Updated Balance:'}</span>
              <span className="font-black text-emerald-800 text-sm">৳ {(transaction?.balanceAfter || 0).toLocaleString()} BDT</span>
            </div>
          </div>

          {/* QR Code & Signatures */}
          <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-16 h-16 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center p-1 shadow-sm">
                <QrCode className="w-10 h-10 text-emerald-400" />
                <span className="text-[7px] font-mono tracking-tighter text-slate-300">SCAN VERIFY</span>
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                <p className="font-bold text-slate-800">ডিজিটাল ভেরিফিকেশন কোড</p>
                <p className="font-mono text-[9px] text-slate-400 truncate max-w-[130px]">{transaction.qrCodeToken || 'ASC-REC-VERIFIED'}</p>
                <p className="text-emerald-600 font-bold mt-0.5">স্বয়ংক্রিয় লেজার এন্ট্রি সম্পন্ন</p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block border-b border-slate-400 pb-1 w-28 text-center">
                <span className="text-[11px] font-black text-emerald-800 font-serif italic">ASCAHDO ERP</span>
              </div>
              <p className="text-[9px] font-bold text-slate-500 mt-1">অনুমোদিত স্বাক্ষর ও সিল</p>
            </div>
          </div>

          <div className="text-center text-[9px] text-slate-400 font-medium">
            “স্বচ্ছ ব্যবস্থাপনা • নিরাপদ সঞ্চয় • ডিজিটাল সেবা” — এটি একটি কম্পিউটার জেনারেটেড ডিজিটাল রসিদ।
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 transition cursor-pointer"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black shadow transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isBn ? 'রসিদ ডাউনলোড / প্রিন্ট' : 'Download Receipt'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
