import React from 'react';
import {
  X, Award, ShieldCheck, QrCode, Download, Printer,
  Heart, Calendar, MapPin, CheckCircle2, Droplet, User
} from 'lucide-react';
import { HubBloodDonor } from '../../types/bloodHubTypes';

interface BloodHubCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  donor: HubBloodDonor | null;
  isBn: boolean;
}

export const BloodHubCertificateModal: React.FC<BloodHubCertificateModalProps> = ({
  isOpen,
  onClose,
  donor,
  isBn
}) => {
  if (!isOpen || !donor) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none">
        
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold">
              {isBn ? 'ডিজিটাল ব্লাড ডোনার সার্টিফিকেট ও লাইফ মেম্বার আইডি' : 'Digital Donor Certificate & Smart ID'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" />
              <span>{isBn ? 'প্রিন্ট / ডাউনলোড' : 'Print / Download'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PRINTABLE OFFICIAL CERTIFICATE / SMART ID CARD CANVAS    */}
        {/* ======================================================== */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-amber-50/40 via-white to-rose-50/30">
          
          {/* Certificate Frame */}
          <div className="border-4 border-double border-amber-600/40 rounded-2xl p-6 sm:p-8 bg-white shadow-inner relative overflow-hidden">
            
            {/* Watermark Background Droplet */}
            <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
              <Droplet className="w-64 h-64 text-rose-600 fill-rose-600" />
            </div>

            {/* Top Logo & Authority Header */}
            <div className="text-center pb-4 border-b border-amber-200">
              <div className="inline-flex items-center justify-center gap-2 mb-1.5">
                <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-xs">
                  <Heart className="w-4 h-4 fill-white" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-base sm:text-lg uppercase tracking-wider">
                  Ascahdo National Blood Bank Hub
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {isBn
                  ? 'এসকাডো ফাউন্ডেশন রক্তদান ও ট্রান্সফিউশন নেটওয়ার্ক | গণপ্রজাতন্ত্রী বাংলাদেশ'
                  : 'Ascahdo Foundation Blood Transfusion Network | Govt. Approved DGHS Hub'}
              </p>
              <div className="inline-block mt-2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-400/40">
                <span className="text-xs sm:text-sm font-serif font-black uppercase text-amber-900 tracking-widest">
                  {isBn ? 'সম্মাননা ও লাইফ মেম্বার সনদ' : 'Certificate of Life Donor Honor'}
                </span>
              </div>
            </div>

            {/* Certificate Body Text */}
            <div className="text-center my-6 space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 italic">
                {isBn
                  ? 'মানবধর্মের শ্রেষ্ঠ সেবায় নিবেদিত হয়ে বিনামূল্যে রক্তদান ও মানুষের জীবন রক্ষায় অগ্রণী ভূমিকা রাখার স্বীকৃতিস্বরূপ'
                  : 'In proud recognition of selfless dedication to saving human lives through regular blood donation'}
              </p>

              <div className="py-2">
                <p className="text-xs text-slate-400 uppercase tracking-widest">{isBn ? 'মহৎ রক্তদাতা' : 'Honored Hero Donor'}</p>
                <h2 className="text-xl sm:text-2xl font-black text-rose-900 font-serif mt-0.5">
                  {donor.fullName}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 max-w-md mx-auto leading-relaxed">
                {isBn ? (
                  <>
                    তাঁকে এসকাডো সেন্ট্রাল ব্লাড ব্যাংক হাবের{' '}
                    <strong className="text-rose-700">ক্লাব লাইফ মেম্বার</strong> হিসেবে এই সম্মাননা ও ডিজিটাল
                    স্মার্ট ডোনার আইডি কার্ড প্রদান করা হলো।
                  </>
                ) : (
                  <>
                    is hereby officially recognized as an active{' '}
                    <strong className="text-rose-700">Club Life Member</strong> of the Ascahdo Multi Blood Bank Hub.
                  </>
                )}
              </p>
            </div>

            {/* Smart Credentials Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs">
              <div className="border-r border-slate-200 last:border-none">
                <span className="text-[10px] text-slate-400 block">{isBn ? 'রক্তের গ্রুপ' : 'Blood Group'}</span>
                <span className="text-base font-black text-rose-600">{donor.bloodGroup}</span>
              </div>
              <div className="border-r border-slate-200 last:border-none">
                <span className="text-[10px] text-slate-400 block">{isBn ? 'স্মার্ট কোড' : 'Donor Code'}</span>
                <span className="text-xs font-mono font-bold text-slate-800">{donor.donorCode}</span>
              </div>
              <div className="border-r border-slate-200 last:border-none">
                <span className="text-[10px] text-slate-400 block">{isBn ? 'মোট রক্তদান' : 'Total Given'}</span>
                <span className="text-xs font-bold text-slate-800">{donor.totalDonations} বার</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{isBn ? 'জেলা' : 'District'}</span>
                <span className="text-xs font-semibold text-slate-800">{donor.district}</span>
              </div>
            </div>

            {/* Signatures & Security Validation */}
            <div className="mt-8 pt-6 border-t border-dashed border-slate-300 flex items-end justify-between gap-4">
              
              {/* QR Verification */}
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-white border border-slate-300 rounded-lg shadow-2xs">
                  <QrCode className="w-12 h-12 text-slate-800" />
                </div>
                <div className="text-[10px] text-slate-500 text-left">
                  <span className="font-bold block text-slate-800">DGHS & Hub Verified</span>
                  <span>ID: {donor.donorCode}</span>
                  <span className="block text-emerald-600 font-semibold">Active Life Member</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="w-24 border-b border-slate-400 pb-1 text-[11px] font-serif italic text-slate-700">
                    Dr. M. A. Rahman
                  </div>
                  <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider block mt-0.5">
                    {isBn ? 'মেডিকেল ডিরেক্টর' : 'Medical Director'}
                  </span>
                </div>

                <div className="text-center">
                  <div className="w-24 border-b border-slate-400 pb-1 text-[11px] font-serif italic text-slate-700">
                    Chairman
                  </div>
                  <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider block mt-0.5">
                    {isBn ? 'কেন্দ্রীয় চেয়ারম্যান' : 'Hub Chairman'}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
