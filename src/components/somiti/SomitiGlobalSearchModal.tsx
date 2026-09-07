import React, { useState } from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  Search, X, User, DollarSign, CreditCard, Building2,
  Landmark, ArrowRight, ShieldCheck, FileText
} from 'lucide-react';
import {
  SomitiMember, Somiti, SomitiBranch, SavingsTransaction, SomitiLoanApp
} from '../../types/somitiTypes';

interface SomitiGlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: SomitiMember[];
  somitis: Somiti[];
  branches: SomitiBranch[];
  transactions: SavingsTransaction[];
  loans: SomitiLoanApp[];
  onSelectMember: (member: SomitiMember) => void;
  onSelectReceipt: (txn: SavingsTransaction) => void;
}

export const SomitiGlobalSearchModal: React.FC<SomitiGlobalSearchModalProps> = ({
  isOpen,
  onClose,
  members,
  somitis,
  branches,
  transactions,
  loans,
  onSelectMember,
  onSelectReceipt
}) => {
  const { isBn } = useTranslation();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedMembers = q
    ? (members || []).filter(
        (m) =>
          m && (
            (m.fullName && m.fullName.toLowerCase().includes(q)) ||
            (m.id && m.id.toLowerCase().includes(q)) ||
            (m.mobile && m.mobile.includes(q)) ||
            (m.nid && m.nid.includes(q))
          )
      )
    : [];

  const matchedTxns = q
    ? (transactions || []).filter(
        (t) =>
          t && (
            (t.receiptNo && t.receiptNo.toLowerCase().includes(q)) ||
            (t.trxId && t.trxId.toLowerCase().includes(q)) ||
            (t.memberName && t.memberName.toLowerCase().includes(q)) ||
            (t.memberId && t.memberId.toLowerCase().includes(q))
          )
      )
    : [];

  const matchedLoans = q
    ? (loans || []).filter(
        (l) =>
          l && (
            (l.id && l.id.toLowerCase().includes(q)) ||
            (l.applicationNo && l.applicationNo.toLowerCase().includes(q)) ||
            (l.memberName && l.memberName.toLowerCase().includes(q)) ||
            (l.memberId && l.memberId.toLowerCase().includes(q))
          )
      )
    : [];

  const matchedBranches = q
    ? (branches || []).filter(
        (b) =>
          b && (
            (b.nameBn && b.nameBn.toLowerCase().includes(q)) ||
            (b.nameEn && b.nameEn.toLowerCase().includes(q)) ||
            (b.district && b.district.toLowerCase().includes(q)) ||
            (b.id && b.id.toLowerCase().includes(q))
          )
      )
    : [];

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-20 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder={isBn ? 'সদস্য ID, NID, মোবাইল, রসিদ নং, TrxID, লোন বা শাখা দিয়ে খুঁজুন...' : 'Search Member ID, NID, Phone, Receipt, TrxID, Loan, Branch...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none placeholder-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold"
          >
            Esc
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-4 max-h-[60vh]">
          {!q ? (
            <div className="text-center py-10 text-xs text-slate-400 space-y-2">
              <Search className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-600">স্মার্ট গ্লোবাল সার্চ ইঞ্জিন (Multi-Somiti ERP)</p>
              <p>যেকোনো সদস্য কোড (যেমন: AS-000125), মোবাইল বা রসিদ টাইপ করুন</p>
            </div>
          ) : (
            <>
              {/* Members Result */}
              {matchedMembers.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    সদস্য রেকর্ডসমূহ ({matchedMembers.length})
                  </h4>
                  {matchedMembers.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        onSelectMember(m);
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={m.photoUrl}
                          alt={m.fullName}
                          className="w-9 h-9 rounded-xl object-cover"
                        />
                        <div>
                          <h5 className="font-black text-slate-900">{m.fullName}</h5>
                          <p className="text-[10px] text-slate-500 font-mono">
                            ID: {m.id} • NID: {m.nid} • {m.mobile}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-emerald-700 block">৳ {(m?.savingsBalance || 0).toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400">সঞ্চয় স্থিতি</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Transactions Result */}
              {matchedTxns.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    লেনদেন ও রসিদ ({matchedTxns.length})
                  </h4>
                  {matchedTxns.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        onSelectReceipt(t);
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 transition cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-5 h-5 text-teal-600" />
                        <div>
                          <span className="font-bold text-slate-900 block font-mono">{t.receiptNo}</span>
                          <span className="text-[10px] text-slate-500">
                            {t.memberName} • {t.paymentMethod} • TrxID: {t.trxId}
                          </span>
                        </div>
                      </div>
                      <span className="font-black text-teal-800">৳ {(t?.amount || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Loans Result */}
              {matchedLoans.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    ঋণ রেকর্ডসমূহ ({matchedLoans.length})
                  </h4>
                  {matchedLoans.map((l) => (
                    <div
                      key={l.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{l.id} — {l.purpose}</span>
                        <span className="text-[10px] text-slate-500">{l.memberName} ({l.memberId}) • {l.workflowStep}</span>
                      </div>
                      <span className="font-black text-indigo-700">৳ {(l?.loanAmount || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* No results */}
              {matchedMembers.length === 0 && matchedTxns.length === 0 && matchedLoans.length === 0 && matchedBranches.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">
                  “{query}” দিয়ে কোনো ফলাফল পাওয়া যায়নি।
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
