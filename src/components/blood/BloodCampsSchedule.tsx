import React, { useState } from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Building2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Heart,
  Droplet
} from 'lucide-react';

interface BloodCampsScheduleProps {
  onJoinCamp?: (campTitle: string) => void;
}

const UPCOMING_CAMPS = [
  {
    id: 'camp_1',
    titleBn: 'ঢাকা সেন্ট্রাল গণরক্তদান ও থ্যালাসেমিয়া সহায়তা ক্যাম্প',
    titleEn: 'Dhaka Central Mass Blood Camp',
    dateBn: '১৫ সেপ্টেম্বর ২০২৬',
    timeBn: 'সকাল ৯:০০ - বিকাল ৫:০০',
    venueBn: 'কেন্দ্রীয় শহীদ মিনার প্রাঙ্গণ, ঢাকা বিশ্ববিদ্যালয়',
    district: 'Dhaka',
    targetBags: 300,
    collectedBags: 184,
    organizerBn: 'আসকাডো ঢাকা সেন্ট্রাল ব্লাড উইং ও রেড ক্রিসেন্ট',
    status: 'upcoming',
    badge: 'মেগা ক্যাম্পেইন'
  },
  {
    id: 'camp_2',
    titleBn: 'চট্টগ্রাম বিশ্ববিদ্যালয় ক্যাম্পাস স্বেচ্ছাসেবী রক্তদান মেলা',
    titleEn: 'Chittagong University Blood Donation Fair',
    dateBn: '২২ সেপ্টেম্বর ২০২৬',
    timeBn: 'সকাল ১০:০০ - বিকাল ৪:০০',
    venueBn: 'চাকসু ভবন চত্বর, চট্টগ্রাম বিশ্ববিদ্যালয়',
    district: 'Chittagong',
    targetBags: 200,
    collectedBags: 92,
    organizerBn: 'আসকাডো ইয়ুথ ভলান্টিয়ার্স চট্টগ্রাম',
    status: 'upcoming',
    badge: 'ক্যাম্পাস উইং'
  },
  {
    id: 'camp_3',
    titleBn: 'রাজশাহী জেলা ভ্রাম্যমাণ ব্লাড ভ্যান ও ফ্রি টাইপিং ক্যাম্প',
    titleEn: 'Rajshahi Mobile Blood Van Camp',
    dateBn: '২৮ সেপ্টেম্বর ২০২৬',
    timeBn: 'সকাল ৮:৩০ - দুপুর ২:০০',
    venueBn: 'সাহেব বাজার জিরো পয়েন্ট, রাজশাহী',
    district: 'Rajshahi',
    targetBags: 150,
    collectedBags: 65,
    organizerBn: 'আসকাডো রাজশাহী জোনাল কমিটি',
    status: 'upcoming',
    badge: 'ভ্রাম্যমাণ ভ্যান'
  },
  {
    id: 'camp_4',
    titleBn: 'সিলেট এমএজি ওসমানী সংলগ্ন জরুরি ব্লাড ক্যাম্পেইন',
    titleEn: 'Sylhet MAG Osmani Emergency Blood Drive',
    dateBn: '০৫ অক্টোবর ২০২৬',
    timeBn: 'সকাল ৯:৩০ - বিকাল ৪:৩০',
    venueBn: 'মেডিকেল রোড কমিউনিটি সেন্টার, সিলেট',
    district: 'Sylhet',
    targetBags: 180,
    collectedBags: 40,
    organizerBn: 'আসকাডো সিলেট জেলা ব্লাড হাব',
    status: 'upcoming',
    badge: 'জরুরি ক্যাম্প'
  }
];

export const BloodCampsSchedule: React.FC<BloodCampsScheduleProps> = ({ onJoinCamp }) => {
  const { isBn } = useTranslation();
  const [joinedCamps, setJoinedCamps] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState<string | null>(null);

  const handleJoin = (id: string, title: string) => {
    if (!joinedCamps.includes(id)) {
      setJoinedCamps([...joinedCamps, id]);
    }
    setShowSuccessModal(title);
    onJoinCamp?.(title);
  };

  return (
    <section id="blood-camps" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-rose-200">
              <Calendar className="w-3.5 h-3.5 text-rose-600" />
              <span>{isBn ? 'রক্তদান ক্যাম্প ও মোবাইল ভ্যান শিডিউল' : 'Blood Donation Camps Schedule'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isBn ? 'আসন্ন রক্তদান ক্যাম্প ও মোবাইল রক্ত সংগ্রহ অভিযান' : 'Upcoming Community Blood Camps & Drives'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {isBn
                ? 'নিকটস্থ গণরক্তদান ক্যাম্পে অংশগ্রহণ করুন অথবা আপনার শিক্ষাপ্রতিষ্ঠান/এলাকায় ক্যাম্প আয়োজনের জন্য আবেদন করুন।'
                : 'Join community blood donation drives or register to volunteer.'}
            </p>
          </div>
        </div>

        {/* Camp Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {UPCOMING_CAMPS.map((camp) => {
            const isJoined = joinedCamps.includes(camp.id);

            return (
              <div
                key={camp.id}
                className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-rose-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                      {camp.badge}
                    </span>
                    <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                      <Droplet className="w-3.5 h-3.5 fill-rose-600" />
                      {isBn ? `টার্গেট: ${camp.targetBags} ব্যাগ` : `Target: ${camp.targetBags} Bags`}
                    </span>
                  </div>

                  <h3 className="font-black text-base sm:text-lg text-slate-900 leading-snug">
                    {isBn ? camp.titleBn : camp.titleEn}
                  </h3>

                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="font-bold text-slate-800">{camp.dateBn}</span>
                      <span className="text-slate-400">•</span>
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{camp.timeBn}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{camp.venueBn}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-slate-500">{camp.organizerBn}</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600">
                    <span>{isBn ? 'পূর্ব-নিবন্ধিত রক্তদাতা:' : 'Pre-registered Donors:'}</span>
                    <span className="text-rose-600">{camp.collectedBags} জন</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-rose-600 to-red-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, (camp.collectedBags / camp.targetBags) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleJoin(camp.id, camp.titleBn)}
                    className={`w-full py-3 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                      isJoined
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>{isBn ? 'নিবন্ধন নিশ্চিত হয়েছে' : 'Registered as Donor'}</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 text-rose-400" />
                        <span>{isBn ? 'ক্যাম্পে রক্তদাতা হিসেবে অংশ নিন' : 'Join as Blood Donor'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Confirmation modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-rose-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-black text-xl text-slate-900">
              {isBn ? 'ক্যাম্পে অংশগ্রহণ নিশ্চিত হয়েছে!' : 'Camp Registration Confirmed!'}
            </h4>
            <p className="text-xs text-slate-600 font-medium">
              {isBn
                ? `"${showSuccessModal}" ক্যাম্পে আপনার নিবন্ধন সংরক্ষিত হয়েছে। ক্যাম্পের দিন এসএমএস রিমাইন্ডার পাঠানো হবে।`
                : 'Your registration is saved. You will receive an SMS reminder on the camp day.'}
            </p>
            <button
              onClick={() => setShowSuccessModal(null)}
              className="w-full py-3 rounded-2xl bg-rose-600 text-white font-bold text-xs cursor-pointer hover:bg-rose-700"
            >
              {isBn ? 'ধন্যবাদ' : 'Close'}
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
