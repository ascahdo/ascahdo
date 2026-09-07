import React, { useState } from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  X, CreditCard, ShieldCheck, Calculator, UserCheck,
  CheckCircle, ArrowRight, DollarSign, Send, AlertTriangle
} from 'lucide-react';
import { SomitiMember, LoanProductType, SomitiLoanApp, LoanProduct } from '../../types/somitiTypes';
import { LOAN_PRODUCTS } from '../../data/somitiMockData';

interface LoanApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMember: SomitiMember | null;
  members: SomitiMember[];
  onApplyLoanSuccess: (loan: SomitiLoanApp) => void;
}

export const LoanApplicationModal: React.FC<LoanApplicationModalProps> = ({
  isOpen,
  onClose,
  selectedMember,
  members,
  onApplyLoanSuccess
}) => {
  const { isBn } = useTranslation();

  const [memberId, setMemberId] = useState(selectedMember?.id || members[0]?.id || 'AS-000125');
  const [productType, setProductType] = useState<LoanProductType>('agriculture');
  const [loanAmount, setLoanAmount] = useState(50000);
  const [termMonths, setTermMonths] = useState(12);
  const [purpose, setPurpose] = useState('পোল্ট্রি ও ক্ষুদ্র ডেইরি খামার সম্প্রসারণ');
  
  // Guarantor Info
  const [guarantorName, setGuarantorName] = useState('মো. তারেক মাহমুদ');
  const [guarantorNid, setGuarantorNid] = useState('1991269334455');
  const [guarantorMobile, setGuarantorMobile] = useState('+880 1715 123456');
  const [guarantorRelation, setGuarantorRelation] = useState('সমিতি সদস্য ও ব্যবসায়িক সহকর্মী');

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentMember = members.find((m) => m.id === memberId) || selectedMember || members[0];
  const selectedProduct = LOAN_PRODUCTS.find((p) => p.type === productType) || LOAN_PRODUCTS[0];

  const interestRate = selectedProduct.interestRate;
  const totalInterest = Math.round((loanAmount * (interestRate / 100) * (termMonths / 12)));
  const totalPayable = loanAmount + totalInterest;
  const monthlyInstallment = Math.round(totalPayable / termMonths);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newLoan: SomitiLoanApp = {
      id: `LN-2026-${Math.floor(Math.random() * 900 + 100)}`,
      applicationNo: `APP-LN-${Math.floor(Math.random() * 90000 + 10000)}`,
      memberId: currentMember?.id || 'AS-000125',
      memberName: currentMember?.fullName || 'সদস্য',
      memberNid: currentMember?.nid || '',
      memberMobile: currentMember?.mobile || '',
      somitiId: currentMember?.somitiId || 'SOM-001',
      somitiName: currentMember?.somitiName || 'এসকাডো ইয়ুথ সমিতি',
      branchId: currentMember?.branchId || 'BR-DHK-01',
      branchName: currentMember?.branchName || 'ধানমন্ডি প্রধান শাখা',
      productType,
      loanAmount: Number(loanAmount),
      purpose,
      termMonths: Number(termMonths),
      interestRate,
      totalInterest,
      totalPayable,
      monthlyInstallment,
      guarantors: [
        {
          id: `GUA-${Date.now()}`,
          name: guarantorName,
          nid: guarantorNid,
          mobile: guarantorMobile,
          address: 'ধানমন্ডি, ঢাকা',
          relation: guarantorRelation,
          occupation: 'ব্যবসায়ী',
          activeGuaranteesCount: 1,
          totalGuaranteedAmount: Number(loanAmount),
          maxGuaranteeLimit: 250000
        }
      ],
      workflowStep: 'APPLICATION',
      appliedDate: new Date().toISOString().split('T')[0],
      totalPaid: 0,
      totalDue: totalPayable,
      defaulterStatus: false,
      installments: []
    };

    setSubmitted(true);
    setTimeout(() => {
      onApplyLoanSuccess(newLoan);
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-md">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight">
                {isBn ? 'ক্ষুদ্র ঋণ আবেদন ও স্মার্ট কিস্তি অনুমোদন' : 'Micro-Loan Application & Guarantor Check'}
              </h3>
              <p className="text-[10px] text-indigo-300">
                End-to-End Multi-Tier Microfinance Workflow
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {submitted ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h4 className="text-base font-black text-slate-900">ঋণের আবেদন সফলভাবে দাখিল হয়েছে!</h4>
              <p className="text-xs text-slate-500 max-w-sm">
                আবেদনটি এখন শাখা ব্যবস্থাপক ও ফিল্ড ভেরিফিকেশন প্যানেলে পাঠানো হয়েছে।
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Member Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">আবেদনকারী সদস্য নির্বাচন করুন *</label>
                <select
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-xs"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.id}) — সঞ্চয় স্থিতি: ৳{(m?.savingsBalance || 0).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Loan Scheme & Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ঋণ স্কিম / প্রোডাক্ট *</label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value as LoanProductType)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                  >
                    {LOAN_PRODUCTS.map((p) => (
                      <option key={p.id} value={p.type}>
                        {p.nameBn} (সুদ: {p.interestRate}%)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">ঋণের পরিমাণ (BDT) *</label>
                  <input
                    type="number"
                    min="10000"
                    max="500000"
                    step="5000"
                    required
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-black text-indigo-700 text-sm"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">পরিশোধের মেয়াদ *</label>
                  <select
                    value={termMonths}
                    onChange={(e) => setTermMonths(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                  >
                    <option value={6}>৬ মাস (Half Yearly)</option>
                    <option value={12}>১২ মাস (১ বছর)</option>
                    <option value={18}>১৮ মাস (১.৫ বছর)</option>
                    <option value={24}>২৪ মাস (২ বছর)</option>
                    <option value={36}>৩৬ মাস (৩ বছর)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">ঋণের উদ্দেশ্য ও কর্মপরিকল্পনা *</label>
                  <input
                    type="text"
                    required
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Calculated EMI Matrix */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[10px] text-indigo-700 block font-bold">মোট মুনাফা/সার্ভিস চার্জ</span>
                  <span className="font-black text-indigo-950 text-sm">৳ {(totalInterest || 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-indigo-700 block font-bold">মোট পরিশোধযোগ্য</span>
                  <span className="font-black text-indigo-950 text-sm">৳ {(totalPayable || 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-indigo-700 block font-bold">মাসিক কিস্তি (EMI)</span>
                  <span className="font-black text-indigo-800 text-sm">৳ {(monthlyInstallment || 0).toLocaleString()} / মাস</span>
                </div>
              </div>

              {/* Section 2: Guarantor Info */}
              <div className="space-y-2.5 pt-2 border-t border-slate-200">
                <h4 className="font-black text-slate-900 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>জামিনদার বিবরণ ও ঝুঁকি যাচাই (Guarantor Verification)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">জামিনদারের নাম *</label>
                    <input
                      type="text"
                      required
                      value={guarantorName}
                      onChange={(e) => setGuarantorName(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">জামিনদারের NID *</label>
                    <input
                      type="text"
                      required
                      value={guarantorNid}
                      onChange={(e) => setGuarantorNid(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">মোবাইল নম্বর *</label>
                    <input
                      type="text"
                      required
                      value={guarantorMobile}
                      onChange={(e) => setGuarantorMobile(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">সদস্যের সাথে সম্পর্ক</label>
                    <input
                      type="text"
                      value={guarantorRelation}
                      onChange={(e) => setGuarantorRelation(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>ঋণ আবেদন দাখিল করুন</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
