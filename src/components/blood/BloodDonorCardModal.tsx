import React, { useRef } from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  X,
  Printer,
  Download,
  Droplet,
  ShieldCheck,
  Award,
  QrCode,
  Heart,
  MapPin,
  Phone,
  Calendar,
  Sparkles
} from 'lucide-react';

interface BloodDonorCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  donor: {
    fullName: string;
    bloodGroup: string;
    phone: string;
    district: string;
    upazila: string;
    id?: string;
    totalDonations?: number;
    lastDonationDate?: string;
    gender?: string;
    age?: number;
  } | null;
}

export const BloodDonorCardModal: React.FC<BloodDonorCardModalProps> = ({
  isOpen,
  onClose,
  donor
}) => {
  const { isBn } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !donor) return null;

  const donorId = donor.id || `BD-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-rose-200 overflow-hidden my-8">
        
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center text-white">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base">
                {isBn ? 'ডিজিটাল ব্লাড ডোনার আইডি কার্ড' : 'Digital Blood Donor ID Card'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isBn ? 'স্বেচ্ছাসেবী রক্তদাতার ডিজিটাল লাইফসেভার ব্যাজ' : 'Verified Lifesaver Digital Badge'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-6">
          
          {/* THE DIGITAL CARD UI */}
          <div
            ref={cardRef}
            className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-rose-400/50 bg-gradient-to-br from-slate-950 via-rose-950 to-slate-900 text-white p-6 space-y-5"
          >
            {/* Background watermark icon */}
            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
              <Droplet className="w-56 h-56 text-rose-500 fill-rose-500" />
            </div>

            {/* Top Brand & Type */}
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black shadow-md">
                  <Droplet className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-wider uppercase text-rose-300">
                    ASCADO BLOOD NETWORK
                  </h4>
                  <span className="text-[10px] text-slate-300 font-bold">
                    {isBn ? 'স্বীকৃত স্বেচ্ছাসেবী রক্তদাতা' : 'Verified Lifesaver Volunteer'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  VERIFIED
                </span>
                <div className="text-[10px] font-mono text-slate-400 mt-1">ID: {donorId}</div>
              </div>
            </div>

            {/* Center Blood Group & Name */}
            <div className="flex items-center justify-between gap-4 py-2 relative z-10">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">DONOR NAME</span>
                <h3 className="text-lg sm:text-xl font-black text-white">{donor.fullName}</h3>
                <div className="flex items-center gap-2 text-xs text-rose-200 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{donor.upazila}, {donor.district}</span>
                </div>
              </div>

              <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-rose-600 to-red-500 text-white flex flex-col items-center justify-center font-black shadow-xl shadow-rose-900/60 border border-rose-300/30 shrink-0">
                <span className="text-2xl sm:text-3xl leading-none">{donor.bloodGroup}</span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-rose-200 mt-0.5">GROUP</span>
              </div>
            </div>

            {/* Bottom Meta & QR */}
            <div className="flex items-end justify-between pt-3 border-t border-white/10 text-xs relative z-10">
              <div className="space-y-1">
                <div className="text-[11px] text-slate-300 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-rose-400" />
                  <span className="font-mono font-bold">{donor.phone}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  মোট রক্তদান: <strong className="text-white">{donor.totalDonations || 1} বার</strong>
                </div>
              </div>

              <div className="bg-white p-1.5 rounded-xl shadow-md flex flex-col items-center">
                <QrCode className="w-10 h-10 text-slate-900" />
                <span className="text-[8px] font-black text-slate-800 tracking-tight mt-0.5">SCAN SOS</span>
              </div>
            </div>

          </div>

          {/* Action CTAs */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition"
            >
              <Printer className="w-4 h-4" />
              <span>{isBn ? 'কার্ড প্রিন্ট করুন' : 'Print ID Card'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
            >
              {isBn ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
