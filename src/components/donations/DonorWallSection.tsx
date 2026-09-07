import React, { useState } from 'react';
import { DonorRecognitionItem } from '../../types/donationTypes';
import { formatTakaBn } from '../../utils/donationUtils';
import {
  Award, Sparkles, Heart, ShieldCheck, Download,
  UserCheck, Users, Star, Gift, CheckCircle2
} from 'lucide-react';

interface DonorWallSectionProps {
  donors: DonorRecognitionItem[];
  onOpenCertificateSample: (donor: DonorRecognitionItem) => void;
}

export const DonorWallSection: React.FC<DonorWallSectionProps> = ({
  donors,
  onOpenCertificateSample
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredDonors = (donors || []).filter((d) => {
    if (!d) return false;
    if (filterType === 'all') return true;
    return d.donorType === filterType;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-amber-700" />
            দাতা স্বীকৃতি ও সম্মাননা প্রাচীর (Donor Wall of Honor)
          </div>
          <h2 className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
            সম্মানিত দাতা ও নিয়মিত পৃষ্ঠপোষক ফোরাম
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            যাঁদের নিঃস্বার্থ দানে হাজারো দুঃস্থ পরিবারের মুখে হাসি ফুটছে এবং সামাজিক রূপান্তর ঘটছে। আসকাডো পরিবার প্রতিটি শুভাকাঙ্ক্ষী দাতার প্রতি চিরকৃতজ্ঞ।
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
          {[
            { id: 'all', title: 'সকল দাতা' },
            { id: 'top_donor', title: 'শীর্ষ দাতা (Platinum)' },
            { id: 'monthly_supporter', title: 'মাসিক পৃষ্ঠপোষক' },
            { id: 'distinguished_donor', title: 'প্রবাসী দাতা' }
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setFilterType(flt.id)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                filterType === flt.id
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {flt.title}
            </button>
          ))}
        </div>
      </div>

      {/* Donors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredDonors.map((donor) => (
          <div
            key={donor.id}
            className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 hover:shadow-md transition group"
          >
            <div className="flex items-start gap-3">
              {donor.isAnonymous ? (
                <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-lg shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
              ) : (
                <img
                  src={donor.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
                  alt={donor.donorName}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-300 shrink-0"
                />
              )}

              <div className="flex-1 min-w-0">
                <span className="inline-block text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md mb-1 truncate max-w-full">
                  {donor.donorTypeBn}
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 truncate">
                  {donor.donorName}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  {donor.donorDistrict}
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">মোট অনুদান:</span>
                <span className="font-mono font-extrabold text-emerald-800 text-sm">{formatTakaBn(donor.totalDonationAmount)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">দানের সংখ্যা:</span>
                <span className="font-bold text-slate-800">{donor.donationsCount} বার</span>
              </div>
            </div>

            <button
              onClick={() => onOpenCertificateSample(donor)}
              className="w-full bg-white hover:bg-emerald-50 border border-slate-200 text-emerald-800 font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1.5 group-hover:border-emerald-300"
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>সম্মাননা প্রত্যয়নপত্র দেখুন</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
