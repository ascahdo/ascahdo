import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { PaymentTransaction, SiteSettings } from '../../../types/matrimonyTypes';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';

interface InvoiceModalProps {
  payment: PaymentTransaction | null;
  siteSettings: SiteSettings;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ payment, siteSettings, onClose }) => {
  const { lang } = useMatrimonyLanguage();

  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
        {/* Modal Controls Bar */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
              {lang === 'bn' ? 'অফিসিয়াল পেমেন্ট ইনভয়েস ও রসিদ' : 'Official Payment Invoice'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 text-xs bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg transition font-medium"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'প্রিন্ট / পিডিএফ ডাউনলোড' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-8 sm:p-10 space-y-6 text-slate-800" id="printable-invoice">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-rose-700 flex items-center justify-center text-white">
                  <Heart className="w-4 h-4 fill-white text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 font-serif">
                  {lang === 'bn' ? siteSettings.siteNameBn : siteSettings.siteNameEn}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? siteSettings.taglineBn : siteSettings.taglineEn}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {siteSettings.dhakaOfficeAddress} | {siteSettings.helplinePhone}
              </p>
            </div>
            <div className="sm:text-right">
              <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 mb-2">
                PAID &amp; VERIFIED
              </div>
              <div className="text-xs text-slate-500">{lang === 'bn' ? 'ইনভয়েস নং:' : 'Invoice No:'}</div>
              <div className="font-mono text-sm font-bold text-slate-900">{payment.invoiceNumber}</div>
              <div className="text-xs text-slate-500 mt-1">{lang === 'bn' ? 'তারিখ:' : 'Date:'} {payment.createdAt}</div>
            </div>
          </div>

          {/* Customer & Transaction Info */}
          <div className="grid grid-cols-2 gap-6 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 font-medium uppercase tracking-wider block mb-1">
                {lang === 'bn' ? 'গ্রাহকের বিবরণ' : 'Billed To'}
              </span>
              <div className="font-semibold text-slate-900 text-sm">{payment.profileId}</div>
              <div className="text-slate-600 mt-0.5">{lang === 'bn' ? 'ইউজার আইডি:' : 'User ID:'} {payment.userId}</div>
              <div className="text-slate-600">{lang === 'bn' ? 'মোবাইল নম্বর:' : 'Phone:'} {payment.senderMobileNumber || 'N/A'}</div>
            </div>
            <div>
              <span className="text-slate-400 font-medium uppercase tracking-wider block mb-1">
                {lang === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Payment Details'}
              </span>
              <div className="font-semibold text-slate-900">{payment.paymentMethod}</div>
              <div className="font-mono text-slate-600 mt-0.5 text-[11px] truncate">
                TxnID: {payment.transactionId}
              </div>
              <div className="text-emerald-600 flex items-center gap-1 mt-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'লেনদেন সফলভাবে সম্পন্ন' : 'Transaction Successful'}</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">{lang === 'bn' ? 'প্যাকেজের নাম ও বিবরণ' : 'Description'}</th>
                <th className="p-3 text-center">{lang === 'bn' ? 'মেয়াদ' : 'Validity'}</th>
                <th className="p-3 text-right">{lang === 'bn' ? 'টাকার পরিমাণ' : 'Amount'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              <tr>
                <td className="p-3">
                  <div className="font-semibold text-slate-900">{payment.planName}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {lang === 'bn'
                      ? 'যাচাইকৃত অভিভাবক নম্বর অ্যাক্সেস, স্মার্ট ম্যাচিং ও আনলিমিটেড মেসেজিং'
                      : 'Verified guardian phone access, smart matching, and direct messaging'}
                  </div>
                </td>
                <td className="p-3 text-center">
                  {payment.planId === 'premium' ? (lang === 'bn' ? '৬ মাস' : '6 Months') : (lang === 'bn' ? '৩ মাস' : '3 Months')}
                </td>
                <td className="p-3 text-right font-semibold text-slate-900">
                  ৳ {(payment.amountBdt || 0).toLocaleString()}
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-200 font-semibold text-slate-900">
              <tr>
                <td colSpan={2} className="p-3 text-right">{lang === 'bn' ? 'মোট পরিশোধিত:' : 'Total Paid:'}</td>
                <td className="p-3 text-right text-sm text-rose-700">
                  ৳ {(payment.amountBdt || 0).toLocaleString()} BDT
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Footer Note & Official Seal */}
          <div className="flex items-end justify-between pt-4 border-t border-slate-200 text-[11px] text-slate-500">
            <div className="max-w-xs space-y-1">
              <p className="font-semibold text-slate-700">
                {lang === 'bn' ? 'বিশেষ দ্রষ্টব্য:' : 'Important Note:'}
              </p>
              <p>
                {lang === 'bn'
                  ? 'এটি কম্পিউটার জেনারেটেড আনুষ্ঠানিক পেমেন্ট ইনভয়েস। যেকোনো সহায়তায় ইনভয়েস নম্বরটি সাথে রাখুন।'
                  : 'This is a computer-generated invoice. Quote this invoice number for any customer support assistance.'}
              </p>
            </div>
            <div className="text-right">
              <div className="w-20 h-20 border-2 border-dashed border-rose-300 rounded-full flex flex-col items-center justify-center mx-auto text-rose-700 mb-1 opacity-80 rotate-[-12deg]">
                <ShieldCheck className="w-5 h-5 mb-0.5" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-center">ASCAHDO<br />Verified</span>
              </div>
              <span className="text-[10px] text-slate-400">{lang === 'bn' ? 'অনুমোদিত স্বাক্ষর' : 'Authorized Signatory'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
