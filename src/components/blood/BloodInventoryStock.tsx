import React, { useState } from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  Droplet,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  HeartPulse,
  PlusCircle,
  Share2,
  RefreshCw
} from 'lucide-react';

interface BloodInventoryStockProps {
  onDonateClick?: (bloodGroup: string) => void;
  onRequestSOS?: (bloodGroup: string) => void;
}

interface BloodStockItem {
  group: string;
  units: number;
  status: 'critical' | 'moderate' | 'adequate';
  urgentRequests: number;
  demandPercentage: number;
  lastDonatedHours: number;
}

const INITIAL_STOCK: BloodStockItem[] = [
  { group: 'A+', units: 42, status: 'adequate', urgentRequests: 2, demandPercentage: 75, lastDonatedHours: 2 },
  { group: 'A-', units: 6, status: 'critical', urgentRequests: 4, demandPercentage: 95, lastDonatedHours: 14 },
  { group: 'B+', units: 58, status: 'adequate', urgentRequests: 3, demandPercentage: 65, lastDonatedHours: 1 },
  { group: 'B-', units: 8, status: 'critical', urgentRequests: 3, demandPercentage: 90, lastDonatedHours: 18 },
  { group: 'O+', units: 35, status: 'moderate', urgentRequests: 6, demandPercentage: 88, lastDonatedHours: 3 },
  { group: 'O-', units: 4, status: 'critical', urgentRequests: 7, demandPercentage: 99, lastDonatedHours: 22 },
  { group: 'AB+', units: 28, status: 'moderate', urgentRequests: 1, demandPercentage: 60, lastDonatedHours: 5 },
  { group: 'AB-', units: 3, status: 'critical', urgentRequests: 5, demandPercentage: 98, lastDonatedHours: 26 },
];

export const BloodInventoryStock: React.FC<BloodInventoryStockProps> = ({
  onDonateClick,
  onRequestSOS
}) => {
  const { isBn } = useTranslation();
  const [stockList, setStockList] = useState<BloodStockItem[]>(INITIAL_STOCK);
  const [lastRefreshed, setLastRefreshed] = useState<string>('এইমাত্র');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed('এইমাত্র');
    }, 600);
  };

  const getStatusBadge = (status: 'critical' | 'moderate' | 'adequate') => {
    switch (status) {
      case 'critical':
        return {
          labelBn: '🚨 জরুরি ঘাটতি',
          labelEn: 'Critical Shortage',
          bg: 'bg-red-100 text-red-800 border-red-200 animate-pulse'
        };
      case 'moderate':
        return {
          labelBn: '⚠️ মধ্যম মজুদ',
          labelEn: 'Moderate Supply',
          bg: 'bg-amber-100 text-amber-800 border-amber-200'
        };
      case 'adequate':
        return {
          labelBn: '✓ পর্যাপ্ত মজুদ',
          labelEn: 'Adequate Stock',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
    }
  };

  return (
    <section id="blood-stock" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-rose-200">
              <Activity className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>{isBn ? 'লাইভ ব্লাড স্টক মনিটর • ৬৪ জেলা নেটওয়ার্ক' : 'Live Blood Inventory Status'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isBn ? 'রক্তের গ্রুপভিত্তিক লাইভ মজুদ ও জরুরি চাহিদা' : 'Real-time Blood Group Stock & Shortage Alerts'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {isBn
                ? 'হাসপাতাল ও সেন্ট্রাল ব্লাড ব্যাংক সমূহের সমন্বিত লাইভ স্টক। নেগেটিভ গ্রুপ এবং ও-পজিটিভের জরুরি চাহিদা থাকলে সরাসরি ডোনার হিসেবে সাড়া দিন।'
                : 'Centralized live inventory tracker across partner blood banks and emergency hospital stores.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">
              {isBn ? `হালনাগাদ: ${lastRefreshed}` : `Updated: ${lastRefreshed}`}
            </span>
            <button
              onClick={handleRefresh}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isBn ? 'রিফ্রেশ' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* 8 Blood Group Stock Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stockList.map((item) => {
            const badge = getStatusBadge(item.status);
            const isCrit = item.status === 'critical';

            return (
              <div
                key={item.group}
                className={`bg-white rounded-3xl p-5 border-2 transition-all flex flex-col justify-between space-y-4 hover:shadow-lg ${
                  isCrit
                    ? 'border-red-300 ring-1 ring-red-200/50 bg-gradient-to-b from-red-50/30 to-white'
                    : 'border-slate-200 hover:border-rose-300'
                }`}
              >
                {/* Top blood group badge and status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-rose-600/20">
                      {item.group}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        {isBn ? 'রক্তের গ্রুপ' : 'Group'}
                      </span>
                      <div className="text-lg font-black text-slate-900">
                        {item.units} <span className="text-xs font-bold text-slate-500">{isBn ? 'ব্যাগ প্রস্তুত' : 'Bags Ready'}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${badge.bg}`}>
                    {isBn ? badge.labelBn : badge.labelEn}
                  </span>
                </div>

                {/* Progress bar / Demand Meter */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-600">{isBn ? 'চাহিদা মাত্রা:' : 'Demand Level:'}</span>
                    <span className={isCrit ? 'text-red-600 font-black' : 'text-slate-700'}>
                      {item.demandPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCrit
                          ? 'bg-red-600'
                          : item.status === 'moderate'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${item.demandPercentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                    <span>{isBn ? `চলমান SOS: ${item.urgentRequests}টি` : `Live SOS: ${item.urgentRequests}`}</span>
                    <span>{isBn ? `${item.lastDonatedHours} ঘণ্টা আগে দান` : `${item.lastDonatedHours}h ago`}</span>
                  </div>
                </div>

                {/* Bottom Action CTA buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => onDonateClick?.(item.group)}
                    className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{isBn ? 'রক্ত দিন' : 'Donate'}</span>
                  </button>
                  <button
                    onClick={() => onRequestSOS?.(item.group)}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                    <span>{isBn ? 'প্রয়োজন' : 'Need'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Info Banner at bottom */}
        <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-rose-950 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300 font-bold shrink-0">
              <Droplet className="w-6 h-6 fill-rose-400 text-rose-400 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base sm:text-lg font-black">
                {isBn ? 'নেগেটিভ গ্রুপের রক্তের জন্য বিশেষ ডোনার স্কোয়াড' : 'Special Negative Blood Donor Emergency Squad'}
              </h4>
              <p className="text-xs text-slate-300 font-medium">
                {isBn
                  ? 'A-, B-, O- ও AB- গ্রুপের রক্ত দাতাদের জরুরি প্রয়োজনে দ্রুত হাসপাতালে পৌঁছে দিতে আমাদের ডেডিকেটেড ভলান্টিয়ার স্কোয়াড প্রস্তুত রয়েছে।'
                  : 'Emergency dedicated volunteer riders to transport rare negative blood groups instantly.'}
              </p>
            </div>
          </div>

          <a
            href="tel:01973817167"
            className="px-6 py-3 rounded-2xl bg-white text-rose-900 hover:bg-slate-100 font-black text-xs sm:text-sm whitespace-nowrap shadow-lg flex items-center gap-2 cursor-pointer transition shrink-0"
          >
            <span>📞 হটলাইন: 01973817167</span>
          </a>
        </div>

      </div>
    </section>
  );
};
