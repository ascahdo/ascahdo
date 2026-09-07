import React, { useState } from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  X, User, ShieldCheck, Landmark, PiggyBank, CreditCard,
  History, FileText, QrCode, Phone, Mail, MapPin, Calendar,
  CheckCircle, AlertCircle, ArrowUpRight, ArrowDownRight,
  Download, Printer, Bell, Shield, ExternalLink
} from 'lucide-react';
import { SomitiMember, SavingsTransaction, SomitiLoanApp } from '../../types/somitiTypes';

interface Member360ModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: SomitiMember | null;
  passbookTransactions: SavingsTransaction[];
  memberLoans: SomitiLoanApp[];
  onOpenDeposit: (member: SomitiMember) => void;
  onOpenLoanApply: (member: SomitiMember) => void;
}

export const Member360Modal: React.FC<Member360ModalProps> = ({
  isOpen,
  onClose,
  member,
  passbookTransactions,
  memberLoans,
  onOpenDeposit,
  onOpenLoanApply
}) => {
  const { isBn } = useTranslation();
  const [activeTab, setActiveTab] = useState<'profile' | 'savings' | 'loans' | 'guarantors' | 'card' | 'audit'>('profile');

  if (!isOpen || !member) return null;

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-50 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">

        {/* Modal Top Hero Bar */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-500/30">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={member.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'}
                alt={member.fullName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-emerald-500 text-slate-950 text-[9px] font-black rounded-md">
                {member.memberStatus}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">{member.fullName}</h2>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-mono font-black">
                  ID: {member.id}
                </span>
              </div>
              <p className="text-xs text-emerald-200 flex items-center gap-1 mt-0.5">
                <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                <span>{member.somitiName}</span>
                <span>•</span>
                <span>{member.branchName}</span>
              </p>
            </div>
          </div>

          {/* Quick Financial Summary Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onOpenDeposit(member)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <PiggyBank className="w-4 h-4" />
              <span>{isBn ? 'সঞ্চয় জমা' : 'Deposit'}</span>
            </button>

            <button
              onClick={() => onOpenLoanApply(member)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>{isBn ? 'নতুন ঋণ আবেদন' : 'Apply Loan'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="bg-white border-b border-slate-200 px-4 flex items-center gap-2 overflow-x-auto no-scrollbar py-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{isBn ? '১. ব্যক্তিগত ও সদস্য প্রোফাইল' : 'Profile & KYC'}</span>
          </button>

          <button
            onClick={() => setActiveTab('savings')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'savings'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PiggyBank className="w-3.5 h-3.5" />
            <span>{isBn ? '২. সঞ্চয় খতিয়ান ও পাসবই' : 'Savings Passbook'}</span>
          </button>

          <button
            onClick={() => setActiveTab('loans')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'loans'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{isBn ? '৩. ঋণ ও কিস্তি শিডিউল' : 'Loans & Installments'}</span>
          </button>

          <button
            onClick={() => setActiveTab('guarantors')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'guarantors'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isBn ? '৪. জামিনদার রেকর্ড' : 'Guarantor Records'}</span>
          </button>

          <button
            onClick={() => setActiveTab('card')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'card'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{isBn ? '৫. ডিজিটাল সদস্য কার্ড' : 'Digital ID Card'}</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{isBn ? '৬. অডিট ও নিরাপত্তা লগ' : 'Audit History'}</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB 1: PROFILE & KYC */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Financial Status Matrix Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 block">বর্তমান সঞ্চয় স্থিতি</span>
                  <div className="text-lg font-black text-emerald-950 mt-0.5">৳ {(member?.savingsBalance || 0).toLocaleString()}</div>
                  <span className="text-[10px] text-emerald-600">মোট জমা: ৳{(member?.totalDeposit || 0).toLocaleString()}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200">
                  <span className="text-[10px] font-bold uppercase text-indigo-700 block">সক্রিয় ঋণ পোর্টফোলিও</span>
                  <div className="text-lg font-black text-indigo-950 mt-0.5">৳ {(member?.activeLoan || 0).toLocaleString()}</div>
                  <span className="text-[10px] text-indigo-600">অবশিষ্ট বকেয়া: ৳{(member?.outstanding || 0).toLocaleString()}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
                  <span className="text-[10px] font-bold uppercase text-rose-700 block">আগামী কিস্তির পরিমাণ</span>
                  <div className="text-lg font-black text-rose-950 mt-0.5">৳ {(member?.nextInstallmentAmount || 0).toLocaleString()}</div>
                  <span className="text-[10px] text-rose-600 font-bold">তারিখ: {member.nextInstallmentDate}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-bold uppercase text-amber-700 block">সদস্যতার স্থিতি ও মেয়াদ</span>
                  <div className="text-base font-black text-amber-950 mt-0.5 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{member.memberStatus}</span>
                  </div>
                  <span className="text-[10px] text-amber-700">ভর্তির তারিখ: {member.membershipDate}</span>
                </div>
              </div>

              {/* KYC Information Grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>সদস্যের প্রাথমিক তথ্য (Personal Details)</span>
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">পিতার নাম:</span>
                      <span className="font-bold text-slate-800">{member.fatherName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">মাতার নাম:</span>
                      <span className="font-bold text-slate-800">{member.motherName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">জন্ম তারিখ:</span>
                      <span className="font-bold text-slate-800">{member.dob}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">জাতীয় পরিচয়পত্র (NID):</span>
                      <span className="font-mono font-bold text-slate-900">{member.nid}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">মোবাইল নম্বর:</span>
                      <span className="font-bold text-emerald-700">{member.mobile}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">পেশা ও জীবিকা:</span>
                      <span className="font-bold text-slate-800">{member.occupation}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">বর্তমান ও স্থায়ী ঠিকানা:</span>
                      <span className="font-bold text-slate-800 text-right max-w-[200px]">{member.address}</span>
                    </div>
                  </div>
                </div>

                {/* Nominee & Emergency Contact */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>নমিনী ও জরুরি যোগাযোগ (Nominee & Emergency)</span>
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">নমিনীর নাম:</span>
                      <span className="font-bold text-slate-800">{member.nomineeName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">সম্পর্ক:</span>
                      <span className="font-bold text-slate-800">{member.nomineeRelation}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">নমিনীর NID:</span>
                      <span className="font-mono font-bold text-slate-800">{member.nomineeNid}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">নমিনীর মোবাইল:</span>
                      <span className="font-bold text-emerald-700">{member.nomineeMobile}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">জরুরি যোগাযোগ:</span>
                      <span className="font-bold text-rose-700">{member.emergencyContact}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">অধিভুক্ত শাখা:</span>
                      <span className="font-bold text-slate-800">{member.branchName}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SAVINGS PASSBOOK */}
          {activeTab === 'savings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900">ডিজিটাল সঞ্চয় পাসবই (Digital Passbook)</h4>
                  <p className="text-xs text-slate-500">সকল দৈনিক, সাপ্তাহিক ও মাসিক সঞ্চয় জমার পূর্ণাঙ্গ খতিয়ান</p>
                </div>

                <button
                  onClick={() => onOpenDeposit(member)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow hover:bg-emerald-500 transition"
                >
                  + নতুন সঞ্চয় জমা
                </button>
              </div>

              {/* Passbook Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">তারিখ</th>
                      <th className="p-3">বিবরণ / রসিদ নং</th>
                      <th className="p-3">পেমেন্ট মেথড</th>
                      <th className="p-3 text-right">জমা (Deposit)</th>
                      <th className="p-3 text-right">উত্তোলন</th>
                      <th className="p-3 text-right">ব্যালেন্স</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {passbookTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-semibold text-slate-700">{tx.date}</td>
                        <td className="p-3">
                          <span className="font-bold text-slate-900 block">{tx.productType.toUpperCase()} Savings</span>
                          <span className="text-[10px] text-slate-400 font-mono">{tx.receiptNo}</span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-[11px] text-slate-700">
                            {tx.paymentMethod}
                          </span>
                        </td>
                        <td className="p-3 text-right font-black text-emerald-700">
                          {tx.transactionType === 'deposit' ? `+ ৳${(tx.amount || 0).toLocaleString()}` : '—'}
                        </td>
                        <td className="p-3 text-right font-black text-rose-700">
                          {tx.transactionType === 'withdrawal' ? `- ৳${(tx.amount || 0).toLocaleString()}` : '—'}
                        </td>
                        <td className="p-3 text-right font-black text-slate-900">
                          ৳ {(tx.balanceAfter || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: LOANS & INSTALLMENTS */}
          {activeTab === 'loans' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900">সক্রিয় ঋণ ও কিস্তি পোর্টফোলিও</h4>
                  <p className="text-xs text-slate-500">অনুমোদিত ঋণ, কিস্তি শিডিউল ও পেমেন্ট হিস্ট্রি</p>
                </div>
                <button
                  onClick={() => onOpenLoanApply(member)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow hover:bg-indigo-500 transition"
                >
                  + ঋণ আবেদন করুন
                </button>
              </div>

              {memberLoans.length > 0 ? (
                memberLoans.map((loan) => (
                  <div key={loan.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-2xs">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900 uppercase">{loan.productType} Loan</span>
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold">
                            {loan.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">উদ্দেশ্য: {loan.purpose}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                          {loan.workflowStep}
                        </span>
                      </div>
                    </div>

                    {/* Loan Metric Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50">
                        <span className="text-slate-500 block text-[10px]">মোট অনুমোদিত ঋণ:</span>
                        <span className="font-black text-slate-900">৳ {(loan?.loanAmount || 0).toLocaleString()}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50">
                        <span className="text-slate-500 block text-[10px]">মোট পরিশোধিত:</span>
                        <span className="font-black text-emerald-700">৳ {(loan?.totalPaid || 0).toLocaleString()}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50">
                        <span className="text-slate-500 block text-[10px]">অবশিষ্ট বকেয়া:</span>
                        <span className="font-black text-rose-700">৳ {(loan?.totalDue || 0).toLocaleString()}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50">
                        <span className="text-slate-500 block text-[10px]">মাসিক কিস্তির হার:</span>
                        <span className="font-black text-indigo-700">৳ {(loan?.monthlyInstallment || 0).toLocaleString()} / মাস</span>
                      </div>
                    </div>

                    {/* Installments Breakdown */}
                    {loan.installments.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-slate-700">কিস্তি তালিকা ও স্ট্যাটাস:</h5>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {loan.installments.slice(0, 8).map((inst) => (
                            <div
                              key={inst.installmentNo}
                              className={`p-2 rounded-xl border text-xs ${
                                inst.paymentStatus === 'PAID'
                                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                  : 'bg-rose-50/70 border-rose-200 text-rose-900'
                              }`}
                            >
                              <div className="flex justify-between font-bold text-[10px]">
                                <span>কিস্তি #{inst.installmentNo}</span>
                                <span>{inst.paymentStatus}</span>
                              </div>
                              <div className="font-black mt-1">৳ {(inst?.amount || 0).toLocaleString()}</div>
                              <div className="text-[9px] opacity-80">তারিখ: {inst.dueDate}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                  কোনো সক্রিয় ঋণ রেকর্ড পাওয়া যায়নি।
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GUARANTOR RECORDS */}
          {activeTab === 'guarantors' && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-slate-900">জামিনদার বিস্তারিত ও সিকিউরিটি লিমিট</h4>
              
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <p className="font-bold">স্মার্ট রিস্ক ম্যানেজমেন্ট সতর্কতা:</p>
                  <p className="text-[11px] mt-0.5">
                    সদস্য আব্দুল করিম বর্তমানে ১ জন সদস্যের ঋণে ৳৮০,০০০ টাকার জামিনদার রয়েছেন। অনুমোদিত সর্বোচ্চ জামিনদার সীমা: ৳২,৫০,০০০।
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <h5 className="text-xs font-black text-slate-800 uppercase">আব্দুল করিম যার জন্য জামিনদার হয়েছেন:</h5>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">মো. তারেক মাহমুদ (ID: AS-000142)</span>
                    <span className="text-[11px] text-slate-500">ঋণের পরিমাণ: ৳৬০,০০০ • সম্পর্ক: সমিতি সহকর্মী</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    সক্রিয় জামিন
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DIGITAL MEMBER ID CARD */}
          {activeTab === 'card' && (
            <div className="space-y-4 flex flex-col items-center">
              <div className="max-w-md w-full bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 shadow-2xl border-2 border-emerald-400/40 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/20 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center">
                      A
                    </div>
                    <div>
                      <h4 className="text-xs font-black tracking-tight">{member.somitiName}</h4>
                      <p className="text-[9px] text-emerald-300">ASCAHDO Multi-NGO Hub Verified</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px]">
                    DIGITAL ID
                  </span>
                </div>

                <div className="flex items-center gap-4 my-4">
                  <img
                    src={member.photoUrl}
                    alt={member.fullName}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
                  />
                  <div className="space-y-1 text-xs">
                    <h3 className="text-sm font-black text-white">{member.fullName}</h3>
                    <p className="text-[11px] text-emerald-300 font-mono font-bold">ID: {member.id}</p>
                    <p className="text-[10px] text-slate-300">মোবাইল: {member.mobile}</p>
                    <p className="text-[10px] text-slate-300">শাখা: {member.branchName}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/20 flex items-center justify-between text-[9px] text-slate-300">
                  <div>
                    <p>সদস্যতার তারিখ: {member.membershipDate}</p>
                    <p className="text-emerald-300 font-mono font-bold">NID: {member.nid}</p>
                  </div>
                  <div className="w-12 h-12 bg-white p-1 rounded-lg text-slate-950 flex items-center justify-center">
                    <QrCode className="w-10 h-10 text-slate-950" />
                  </div>
                </div>
              </div>

              <button
                onClick={handlePrintCard}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black shadow transition flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>ডিজিটাল কার্ড প্রিন্ট করুন</span>
              </button>
            </div>
          )}

          {/* TAB 6: AUDIT LOG */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-900">অডিট হিস্ট্রি ও অ্যাক্টিভিটি ট্রেল</h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>সঞ্চয় জমা রসিদ জেনারেট (REC-2026-8803)</span>
                    <span className="text-[10px] text-slate-400">2026-08-15 04:00 PM</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">কালেক্টর মো. সুমন রানা দ্বারা ৳৫০০ নগদ গ্রহণ ও ব্যালেন্স আপডেট।</p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>ঋণের কিস্তি #৯ পরিশোধ সফল (৳৩,৬৬৭)</span>
                    <span className="text-[10px] text-slate-400">2026-05-24 11:20 AM</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">ইসলামী ব্যাংক গেটওয়ে মাধ্যমে লেনদেন ট্র্যাকিং সম্পন্ন।</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-bold">
            সদস্যের সম্পূর্ণ ডিজিটাল ফাইল (Member 360° Core ERP)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 transition"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
