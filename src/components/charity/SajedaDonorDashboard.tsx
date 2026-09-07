import React, { useState } from 'react';
import {
  Heart, Download, Printer, ShieldCheck, User,
  Calendar, CheckCircle2, DollarSign, Award, Clock, ArrowRight
} from 'lucide-react';
import { DonationRecord } from '../../types/donationTypes';

interface SajedaDonorDashboardProps {
  onOpenDonate?: () => void;
}

export const SajedaDonorDashboard: React.FC<SajedaDonorDashboardProps> = ({ onOpenDonate }) => {
  const [donorPhoneQuery, setDonorPhoneQuery] = useState('01711223344');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Demo user records
  const myDonations: DonationRecord[] = [
    {
      id: 'rec_101',
      receiptNumber: 'SYF-DON-882910',
      donorName: 'মো. রফিকুল ইসলাম',
      donorPhone: '01711223344',
      donorEmail: 'rafiqul@example.com',
      donorDistrict: 'ঢাকা',
      isAnonymous: false,
      amount: 5000,
      currency: 'BDT',
      donationFrequency: 'one_time',
      donationType: 'zakat',
      causeId: 'food',
      campaignId: 'camp_flood_2026',
      paymentMethod: 'bkash',
      transactionId: '9K8J7H6G5F',
      paymentStatus: 'completed',
      donatedAt: '2026-08-15T10:30:00Z',
      donatedAtBn: '১৫ আগস্ট ২০২৬',
      taxExemptionEligible: true
    },
    {
      id: 'rec_102',
      receiptNumber: 'SYF-DON-771822',
      donorName: 'মো. রফিকুল ইসলাম',
      donorPhone: '01711223344',
      donorEmail: 'rafiqul@example.com',
      donorDistrict: 'ঢাকা',
      isAnonymous: false,
      amount: 2500,
      currency: 'BDT',
      donationFrequency: 'monthly',
      donationType: 'general',
      causeId: 'education',
      paymentMethod: 'card',
      transactionId: 'TXN-99881122',
      paymentStatus: 'completed',
      donatedAt: '2026-07-20T14:15:00Z',
      donatedAtBn: '২০ জুলাই ২০২৬',
      taxExemptionEligible: true
    }
  ];

  const totalDonated = myDonations.reduce((acc, d) => acc + d.amount, 0);

  return (
    <div className="py-12 lg:py-20 bg-slate-50 text-slate-900 space-y-10 text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl border-2 border-white/20">
              র
            </div>
            <div className="space-y-1">
              <span className="text-xs text-amber-300 font-mono font-bold">DONOR PORTAL & TAX LEDGER</span>
              <h1 className="text-xl sm:text-2xl font-black">মো. রফিকুল ইসলাম</h1>
              <p className="text-xs text-slate-300 font-mono">মোবাইল: 01711223344 • সদস্য আইডি: SYF-D-9982</p>
            </div>
          </div>

          <button
            onClick={() => onOpenDonate && onOpenDonate()}
            className="self-start md:self-auto px-5 py-3 rounded-2xl bg-white text-emerald-900 font-black text-xs hover:bg-emerald-50 transition shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-emerald-700 text-emerald-700" />
            <span>নতুন অনুদান দিন</span>
          </button>
        </div>

        {/* Metric Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-bold">মোট অনুদানের পরিমাণ</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
              ৳{(totalDonated || 0).toLocaleString('bn-BD')} BDT
            </div>
            <span className="text-[11px] text-slate-400 block pt-1">২ টি সফল অনুদান সম্পন্ন</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-bold">অ্যাক্টিভ মাসিক সদস্যপদ</span>
            <div className="text-2xl sm:text-3xl font-black text-blue-700 font-mono">
              ৳২,৫০০ / মাস
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold block pt-1">✓ শিক্ষা সহায়তা ফান্ডে যুক্ত</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-bold">ট্যাক্স রেয়াত সার্টিফিকেট</span>
            <div className="text-base font-black text-slate-900 pt-1">
              ২০২৫-২৬ অর্থবছরের সনদ প্রস্তুত
            </div>
            <button
              onClick={() => window.print()}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 pt-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>সার্টিফিকেট ডাউনলোড করুন</span>
            </button>
          </div>
        </div>

        {/* Donation History Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-slate-900">আপনার অনুদানের পূর্ণাঙ্গ বিবরণী</h3>
            <span className="text-xs text-slate-500 font-mono font-bold">Total Records: {myDonations.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50">
                  <th className="p-3">রসিদ নং</th>
                  <th className="p-3">তারিখ</th>
                  <th className="p-3">খাত / ক্যাম্পেইন</th>
                  <th className="p-3">পরিমাণ (BDT)</th>
                  <th className="p-3">পেমেন্ট মেথড</th>
                  <th className="p-3">স্ট্যাটাস</th>
                  <th className="p-3 text-right">রসিদ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {myDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{d.receiptNumber}</td>
                    <td className="p-3 text-slate-600">{d.donatedAtBn}</td>
                    <td className="p-3 font-bold text-emerald-800">
                      {d.causeId === 'food' ? 'খাদ্য বিতরণ ও জরুরি ত্রাণ' : 'সুবিধাবঞ্চিত শিশুদের শিক্ষা'}
                    </td>
                    <td className="p-3 font-mono font-black text-slate-900">৳{(d?.amount || 0).toLocaleString('bn-BD')}</td>
                    <td className="p-3 font-mono uppercase text-slate-600">{d.paymentMethod}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ✓ সম্পন্ন
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => window.print()}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-700 hover:text-white transition text-slate-700 inline-flex items-center gap-1 cursor-pointer"
                        title="রসিদ ডাউনলোড"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>প্রিন্ট</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
