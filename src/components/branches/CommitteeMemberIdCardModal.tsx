import React, { useState, useRef } from 'react';
import {
  X, Printer, Download, Share2, Check, ShieldCheck,
  Building2, Phone, MapPin, Calendar, Award, QrCode,
  Sparkles, ExternalLink, RefreshCw, Copy, CheckCircle2, User,
  Receipt, DollarSign, FileText, CheckCircle
} from 'lucide-react';
import { EnrichedCommitteeMember } from '../../utils/committeeMemberUtils';
import { useTranslation } from '../../locales/i18nContext';

interface CommitteeMemberIdCardModalProps {
  member: EnrichedCommitteeMember | null;
  onClose: () => void;
}

export const CommitteeMemberIdCardModal: React.FC<CommitteeMemberIdCardModalProps> = ({
  member,
  onClose
}) => {
  const { isBn } = useTranslation();
  const [activeSide, setActiveSide] = useState<'both' | 'front' | 'back' | 'receipt'>('both');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const cardPrintRef = useRef<HTMLDivElement>(null);

  if (!member) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyVerification = () => {
    const text = `ASCADO Central Welfare Trust
কমিটি সদস্য ভেরিফিকেশন ও ডোনেশন তথ্য:
নাম: ${member.nameBn || member.name}
পদবি: ${member.designationBn || member.designation}
শাখা: ${member.branch?.nameBn || member.branch?.name}
মেম্বার আইডি: ${member.memberId}
সাজেশন নং: ${member.suggestionNumber}
বাধ্যতামূলক ডোনেশন ফি: ৳১,২৫০ (পরিশোধিত)
রসিদ নং: ${member.donationReceiptNo}
TrxID: ${member.trxId}
মোবাইল: ${member.phone || '01973-817167'}
মেয়াদ: ${member.branch?.committeeTerm || '২০২৬-২০২৮'}
যাচাইকরণ লিংক: https://ascado.org/verify/committee/${member.memberId}?sug=${member.suggestionNumber}`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Get committee tier label
  const getTierLabel = () => {
    const level = (member.branch?.committeeLevel || 'district').toLowerCase();
    switch (level) {
      case 'division':
        return { bn: 'বিভাগীয় পরিচালনা পরিষদ', en: 'Division Executive Committee', color: 'from-purple-900 to-indigo-950' };
      case 'district':
        return { bn: 'জেলা পরিচালনা পরিষদ', en: 'District Executive Committee', color: 'from-emerald-900 to-teal-950' };
      case 'upazila':
        return { bn: 'উপজেলা পরিচালনা পরিষদ', en: 'Upazila Executive Committee', color: 'from-blue-900 to-slate-950' };
      case 'union':
        return { bn: 'ইউনিয়ন পরিচালনা পরিষদ', en: 'Union Executive Committee', color: 'from-amber-900 to-orange-950' };
      default:
        return { bn: 'শাখা পরিচালনা পরিষদ', en: 'Branch Executive Committee', color: 'from-emerald-900 to-slate-950' };
    }
  };

  const tierInfo = getTierLabel();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[96vh] flex flex-col">
        
        {/* Modal Top Action Bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  {isBn ? 'অফিসিয়াল সদস্য পরিচয়পত্র ও ডোনেশন রসিদ' : 'Official Committee ID Card & Donation Receipt'}
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                  {member.memberId}
                </span>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-amber-400" />
                  <span>ফি: ৳১,২৫০ পেইড</span>
                </span>
              </div>
              <p className="text-xs text-emerald-200/90">
                {isBn ? `সাজেশন নম্বর: ${member.suggestionNumber} • রসিদ নং: ${member.donationReceiptNo}` : `Suggestion No: ${member.suggestionNumber} • Receipt: ${member.donationReceiptNo}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Print / Download Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-md transition active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{activeSide === 'receipt' ? (isBn ? 'রসিদ প্রিন্ট / PDF' : 'Print Receipt') : (isBn ? 'কার্ড প্রিন্ট / ডাউনলোড' : 'Print / Download Card')}</span>
            </button>

            <button
              onClick={handleCopyVerification}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              title="Copy details"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
              <span className="hidden sm:inline">{isCopied ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'তথ্য কপি' : 'Copy')}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode Controls (Front, Back, Both, Donation Receipt) */}
        <div className="bg-slate-100 px-4 sm:px-6 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
            <button
              onClick={() => setActiveSide('both')}
              className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                activeSide === 'both' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isBn ? 'উভয় পাশ (Side-by-Side)' : 'Both Sides'}
            </button>
            <button
              onClick={() => setActiveSide('front')}
              className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                activeSide === 'front' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isBn ? 'সম্মুখভাগ (Front)' : 'Front Side'}
            </button>
            <button
              onClick={() => setActiveSide('back')}
              className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                activeSide === 'back' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isBn ? 'পেছনের দিক (Back)' : 'Back Side'}
            </button>
            <button
              onClick={() => setActiveSide('receipt')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeSide === 'receipt' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-800 hover:bg-amber-50'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>{isBn ? '🧾 ৳১২৫০ অনুদান রসিদ' : '৳1250 Money Receipt'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-slate-600 font-mono text-[11px]">
            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              ডোনেশন ফি: ৳{member.donationFee || 1250} (পরিশোধিত)
            </span>
          </div>
        </div>

        {/* Printable & Scrollable Card / Receipt Preview Container */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-200/60 flex items-center justify-center" ref={cardPrintRef}>
          <div className="w-full max-w-3xl space-y-6">

            {/* =========================================================================
                A. ID CARDS VIEW (FRONT / BACK / BOTH)
            ========================================================================= */}
            {activeSide !== 'receipt' && (
              <div className={`grid gap-6 ${activeSide === 'both' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-md mx-auto'}`}>
                
                {/* 1. FRONT SIDE OF ID CARD */}
                {(activeSide === 'both' || activeSide === 'front') && (
                  <div className="id-card-front bg-white rounded-3xl shadow-xl border-2 border-emerald-700/80 overflow-hidden flex flex-col justify-between relative select-none min-h-[480px]">
                    {/* Top Decorative Gradient Header */}
                    <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 text-white p-4 relative overflow-hidden text-center border-b-2 border-amber-400">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />
                      
                      {/* Organization Banner */}
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-lg bg-white p-1 shadow-md flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-emerald-800" />
                        </div>
                        <div className="text-left">
                          <div className="text-[9px] tracking-widest text-amber-300 font-extrabold uppercase leading-none">
                            গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত
                          </div>
                          <div className="font-black text-xs sm:text-sm text-white tracking-wide leading-tight">
                            ASCADO CENTRAL WELFARE TRUST
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-emerald-200 font-bold tracking-tight">
                        আশকাডো কেন্দ্রীয় সমাজকল্যাণ ট্রাস্ট • রেজি: REG-NGO-DH-88741
                      </div>

                      {/* Committee Sub Header */}
                      <div className="mt-2 pt-1.5 border-t border-emerald-700/60 flex items-center justify-between text-[10px]">
                        <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded uppercase">
                          {tierInfo.bn}
                        </span>
                        <span className="text-emerald-100 font-bold font-mono">
                          {member.branch?.committeeTerm || '২০২৬-২০২৮'}
                        </span>
                      </div>
                    </div>

                    {/* Card Body with Photo and Personal Info */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50">
                      <div className="flex items-start gap-4">
                        {/* Member Photo with Golden Frame & Badge */}
                        <div className="relative shrink-0">
                          <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden border-2 border-emerald-600 shadow-md bg-slate-100 relative">
                            <img
                              src={
                                member.photoUrl ||
                                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'
                              }
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {/* Verified Hologram Tag */}
                          <div className="absolute -bottom-2 -right-1 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-md border border-amber-300 shadow-xs flex items-center gap-0.5">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            <span>ভেরিফাইড</span>
                          </div>
                        </div>

                        {/* Member Details */}
                        <div className="flex-1 space-y-1.5 min-w-0 text-xs">
                          <div className="space-y-0.5">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              সদস্যের নাম / Name
                            </div>
                            <h4 className="font-black text-sm sm:text-base text-slate-900 leading-tight">
                              {member.nameBn || member.name}
                            </h4>
                            {member.name && member.nameBn && (
                              <div className="text-[11px] font-semibold text-slate-500 font-mono">
                                {member.name}
                              </div>
                            )}
                          </div>

                          {/* Designation Badge */}
                          <div>
                            <span className="inline-block bg-emerald-700 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-lg shadow-xs">
                              {member.designationBn || member.designation}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-700 space-y-0.5 pt-1">
                            <div>
                              <span className="text-slate-500 font-medium">পিতার নাম: </span>
                              <span className="font-bold">{member.fatherNameBn || member.fatherName || '—'}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 font-medium">শাখা: </span>
                              <span className="font-bold text-emerald-900">{member.branch?.nameBn || member.branch?.name}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Metadata Grid (ID, Suggestion No, Blood, Fee) */}
                      <div className="grid grid-cols-2 gap-2 bg-white/90 p-3 rounded-2xl border border-emerald-200/80 shadow-2xs text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[9px] font-bold uppercase">অফিসিয়াল মেম্বার আইডি</span>
                          <span className="font-black font-mono text-emerald-800 text-xs">{member.memberId}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] font-bold uppercase">সাজেশন / রেফারেন্স নং</span>
                          <span className="font-black font-mono text-blue-800 text-xs">{member.suggestionNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] font-bold uppercase">রক্তের গ্রুপ (Blood)</span>
                          <span className="font-extrabold text-rose-700 text-xs font-mono">{member.bloodGroup || 'O+'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] font-bold uppercase">কমিটি অনুদান ফি</span>
                          <span className="font-bold text-emerald-700 font-mono text-xs">৳{member.donationFee || 1250} (পেইড ✓)</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Bottom Security Strip & Micro Hologram */}
                    <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 px-4 py-2 text-white text-[10px] flex items-center justify-between border-t border-amber-400/80">
                      <div className="flex items-center gap-1 text-amber-300 font-bold">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>SECURE EXECUTIVE CREDENTIAL</span>
                      </div>
                      <div className="text-emerald-300 font-mono text-[9px] font-bold">
                        ফি ৳১২৫০ পরিশোধিত • ASCADO
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. BACK SIDE OF ID CARD */}
                {(activeSide === 'both' || activeSide === 'back') && (
                  <div className="id-card-back bg-white rounded-3xl shadow-xl border-2 border-slate-700 overflow-hidden flex flex-col justify-between relative select-none min-h-[480px]">
                    {/* Top Header Strip */}
                    <div className="bg-slate-900 text-white p-3 text-center border-b-2 border-emerald-500">
                      <div className="font-black text-xs uppercase tracking-wide text-emerald-400">
                        আসকাডো কেন্দ্রীয় সমন্বয় কার্যালয়
                      </div>
                      <div className="text-[10px] text-slate-300">
                        জরুরি যোগাযোগ, ডোনেশন ভেরিফিকেশন ও সদস্যপদ যাচাই
                      </div>
                    </div>

                    {/* Back Card Body */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-gradient-to-b from-slate-50 via-white to-slate-100">
                      
                      {/* QR Code & Verification Block */}
                      <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                        {/* Scannable Dynamic QR Code */}
                        <div className="p-1 bg-white border border-slate-300 rounded-xl shadow-xs shrink-0">
                          <img
                            src={member.qrCodeUrl}
                            alt="QR Verification"
                            className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                          />
                        </div>

                        <div className="flex-1 space-y-1 text-xs">
                          <div className="flex items-center gap-1 font-bold text-slate-900 text-[11px]">
                            <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                            <span>কিউআর কোড স্ক্যান করে যাচাই</span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-tight">
                            যেকোনো স্মার্টফোন দিয়ে স্ক্যান করে কেন্দ্রীয় ডাটাবেজ ও ৳১,২৫০ অনুদান ফি জমার সঠিকতা নিশ্চিত করুন।
                          </p>
                          <div className="pt-1 text-[10px] font-mono text-slate-600 space-y-0.5">
                            <div>আইডি: <strong className="text-slate-900">{member.memberId}</strong></div>
                            <div>রসিদ: <strong className="text-emerald-700">{member.donationReceiptNo}</strong></div>
                            <div>TrxID: <strong className="text-blue-700">{member.trxId}</strong></div>
                          </div>
                        </div>
                      </div>

                      {/* Member Address & Emergency Contact */}
                      <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-[11px] text-slate-700 space-y-1">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3 h-3 text-emerald-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-900">স্থায়ী/শাখা ঠিকানা: </span>
                            <span>{member.addressBn || member.address || member.branch?.address}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 pt-1 border-t border-emerald-200/60 font-mono text-[10px] text-emerald-900 font-bold">
                          <Phone className="w-3 h-3 text-emerald-700" />
                          <span>জরুরি হেল্পলাইন: 01973-817167, 01813-817167</span>
                        </div>
                      </div>

                      {/* Instructions & Terms */}
                      <div className="text-[9px] text-slate-500 space-y-0.5 leading-tight bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <div>১. প্রতিটি কমিটির সদস্যের জন্য নির্ধারিত ৳১,২৫০ কেন্দ্রীয় কল্যাণ তহবিল ডোনেশন পরিশোধিত।</div>
                        <div>২. সাংগঠনিক দায়িত্ব পালনকালে পরিচয়পত্রটি সাথে রাখা বাধ্যতামূলক।</div>
                        <div>৩. কার্ডটি হারিয়ে গেলে অবিলম্বে কেন্দ্রীয় প্রশাসন ও হেল্পলাইনে অবহিত করুন।</div>
                      </div>

                      {/* Signatures & Seal Block */}
                      <div className="flex items-end justify-between pt-2 border-t border-slate-200 text-center text-[10px]">
                        {/* Left: General Secretary Signature */}
                        <div className="space-y-1">
                          <div className="font-serif italic font-bold text-slate-700 text-xs tracking-wider border-b border-slate-400 pb-0.5">
                            Tanvir Ahmed
                          </div>
                          <div className="font-bold text-slate-800 text-[9px]">
                            কেন্দ্রীয় সাধারণ সম্পাদক
                          </div>
                          <div className="text-slate-400 text-[8px]">Secretary General</div>
                        </div>

                        {/* Center: Official Seal Badge */}
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-600/60 flex flex-col items-center justify-center text-[7px] font-black text-emerald-800 leading-tight">
                          <span>ASCADO</span>
                          <span>SEAL</span>
                          <span>২০২৬</span>
                        </div>

                        {/* Right: Chairman / President Signature */}
                        <div className="space-y-1">
                          <div className="font-serif italic font-bold text-slate-700 text-xs tracking-wider border-b border-slate-400 pb-0.5">
                            Rafiqul Islam
                          </div>
                          <div className="font-bold text-slate-800 text-[9px]">
                            কেন্দ্রীয় সভাপতি / চেয়ারম্যান
                          </div>
                          <div className="text-slate-400 text-[8px]">President & Trustee</div>
                        </div>
                      </div>
                    </div>

                    {/* Back Footer */}
                    <div className="bg-slate-900 px-4 py-2 text-white text-[9px] flex items-center justify-between border-t border-slate-800 font-mono">
                      <span>PORTAL: WWW.ASCADO.ORG</span>
                      <span className="text-emerald-400 font-bold">DONATION VERIFIED ৳1250</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                B. OFFICIAL MONEY RECEIPT VIEW (৳১,২৫০ অনুদান রসিদ ভাউচার)
            ========================================================================= */}
            {activeSide === 'receipt' && (
              <div className="bg-white rounded-3xl shadow-xl border-2 border-amber-600/80 overflow-hidden max-w-2xl mx-auto p-6 sm:p-8 space-y-6 select-none bg-radial from-amber-50/30 via-white to-slate-50">
                
                {/* Receipt Top Header */}
                <div className="text-center pb-4 border-b-2 border-amber-600 relative">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <h2 className="font-black text-lg sm:text-xl text-slate-900 tracking-tight">
                      আশকাডো কেন্দ্রীয় সমাজকল্যাণ ট্রাস্ট
                    </h2>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold">
                    ASCADO CENTRAL WELFARE TRUST • রেজি নং: REG-NGO-DH-88741
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    কেন্দ্রীয় কার্যালয়: হাউজ-১২, রোড-০৫, ধানমন্ডি, ঢাকা-১২০৫ • ফোন: 01973-817167
                  </p>
                  
                  <div className="mt-3 inline-block bg-amber-500 text-slate-950 font-black text-xs px-4 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    কমিটি সদস্য অনুদান গ্রহণ রসিদ (Official Money Receipt)
                  </div>
                </div>

                {/* Receipt Meta (Sl, Date, Suggestion) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">রসিদ নম্বর (Receipt No)</span>
                    <strong className="font-mono text-emerald-800 text-sm">{member.donationReceiptNo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">জমার তারিখ (Paid Date)</span>
                    <strong className="font-mono text-slate-800">{member.donationPaidDate || '26/08/2026'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">সাজেশন / রেফারেন্স</span>
                    <strong className="font-mono text-blue-700">{member.suggestionNumber}</strong>
                  </div>
                </div>

                {/* Member & Donation Information Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <tbody className="divide-y divide-slate-200">
                      <tr className="bg-slate-50/70">
                        <td className="p-3 font-bold text-slate-600 w-1/3">সদস্যের নাম:</td>
                        <td className="p-3 font-extrabold text-slate-900 text-sm">{member.nameBn || member.name}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-600">পিতার নাম:</td>
                        <td className="p-3 text-slate-800">{member.fatherNameBn || member.fatherName || '—'}</td>
                      </tr>
                      <tr className="bg-slate-50/70">
                        <td className="p-3 font-bold text-slate-600">পদবি ও দায়িত্ব:</td>
                        <td className="p-3">
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md text-xs">
                            {member.designationBn || member.designation}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-600">শাখা ও স্তর:</td>
                        <td className="p-3 text-slate-800 font-medium">
                          {member.branch?.nameBn || member.branch?.name} ({tierInfo.bn})
                        </td>
                      </tr>
                      <tr className="bg-slate-50/70">
                        <td className="p-3 font-bold text-slate-600">মেম্বার আইডি:</td>
                        <td className="p-3 font-mono font-bold text-emerald-800">{member.memberId}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-600">অনুদানের খাত/উদ্দেশ্য:</td>
                        <td className="p-3 text-slate-700">
                          কেন্দ্রীয় কার্যনির্বাহী পরিষদ পরিচালনা ও সমাজকল্যাণ তহবিল সদস্যপদ ডোনেশন
                        </td>
                      </tr>
                      <tr className="bg-amber-50/80">
                        <td className="p-3 font-black text-amber-900">অনুদানের পরিমাণ:</td>
                        <td className="p-3">
                          <span className="text-base font-black text-emerald-800 font-mono">
                            ৳{member.donationFee || 1250}.00
                          </span>
                          <span className="block text-[11px] text-amber-950 font-bold mt-0.5">
                            (কথায়: এক হাজার দুই শত পঞ্চাশ টাকা মাত্র / One Thousand Two Hundred Fifty BDT Only)
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-600">পেমেন্ট মাধ্যম ও ট্রানজেকশন:</td>
                        <td className="p-3 font-mono text-slate-800 space-x-2">
                          <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                            {member.paymentMethod || 'bKash Merchant'}
                          </span>
                          <span>TrxID: <strong>{member.trxId}</strong></span>
                        </td>
                      </tr>
                      <tr className="bg-emerald-50/60">
                        <td className="p-3 font-bold text-emerald-900">পেমেন্ট স্ট্যাটাস:</td>
                        <td className="p-3 font-extrabold text-emerald-700 flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>পরিশোধিত ও ভেরিফাইড (PAID & VERIFIED)</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Signatures & Seal */}
                <div className="pt-6 border-t border-slate-200 flex items-end justify-between text-center text-xs">
                  <div className="space-y-1">
                    <div className="font-serif italic font-bold text-slate-700 text-xs border-b border-slate-400 pb-1">
                      Khorshed Alam
                    </div>
                    <div className="font-bold text-slate-800 text-[10px]">অর্থ ও হিসাব সম্পাদক</div>
                    <div className="text-[9px] text-slate-400">Finance & Accounts</div>
                  </div>

                  <div className="w-14 h-14 rounded-full border-2 border-dashed border-amber-600/70 flex flex-col items-center justify-center text-[8px] font-black text-amber-900 leading-tight">
                    <span>ASCADO</span>
                    <span>RECEIPT</span>
                    <span>৳১২৫০</span>
                  </div>

                  <div className="space-y-1">
                    <div className="font-serif italic font-bold text-slate-700 text-xs border-b border-slate-400 pb-1">
                      Tanvir Ahmed
                    </div>
                    <div className="font-bold text-slate-800 text-[10px]">সাধারণ সম্পাদক</div>
                    <div className="text-[9px] text-slate-400">General Secretary</div>
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-mono">
                  * এই রসিদটি কম্পিউটার জেনারেটেড এবং আসকাডো সেন্ট্রাল সার্ভার কর্তৃক সম্পূর্ণ ভেরিফাইড।
                </div>
              </div>
            )}

            {/* Quick Action Hints for User */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  প্রতিটি কমিটির সদস্যের জন্য নির্ধারিত <strong>৳১,২৫০ ডোনেশন ফি</strong> জমাকরণের সাথে সাথে কার্ড ও রসিদ সক্রিয় হয়।
                </span>
              </div>
              <button
                onClick={handlePrint}
                className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition text-xs shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{activeSide === 'receipt' ? 'মানি রসিদ ডাউনলোড (PDF)' : 'কার্ড ও রসিদ ডাউনলোড'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-white px-5 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{isBn ? 'আসকাডো কেন্দ্রীয় তহবিল • সদস্য ডোনেশন ফি: ৳১,২৫০' : 'ASCADO Central Fund • Committee Member Donation Fee: ৳1,250'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
