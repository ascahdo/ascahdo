import React, { useState } from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  Phone,
  Truck,
  Wind,
  HeartPulse,
  ShieldCheck,
  MapPin,
  Clock,
  Activity,
  AlertCircle
} from 'lucide-react';
import { BANGLADESH_DISTRICTS } from '../../data/bangladeshLocations';

interface AmbulanceItem {
  id: string;
  nameBn: string;
  typeBn: string;
  district: string;
  phone: string;
  serviceType: 'icu' | 'ac_non_ac' | 'free_patient_van';
  available: boolean;
  rateBn: string;
}

const AMBULANCES_DATA: AmbulanceItem[] = [
  {
    id: 'amb_1',
    nameBn: 'আসকাডো সেন্ট্রাল লাইফ-সাপোর্ট আইসিইউ অ্যাম্বুলেন্স',
    typeBn: 'ICU / CCU ভেন্টিলেটর যুক্ত ফ্রিজিং অ্যাম্বুলেন্স',
    district: 'Dhaka',
    phone: '01973817167',
    serviceType: 'icu',
    available: true,
    rateBn: 'জরুরি রুগী সহায়তা ও ভর্তুকি মূল্যে'
  },
  {
    id: 'amb_2',
    nameBn: 'রেড ক্রিসেন্ট ফ্রি ইমার্জেন্সি পেশেন্ট ভ্যান',
    typeBn: 'হতদরিদ্র মুমূর্ষু রোগীর সম্পূর্ণ ফ্রি সার্ভিস',
    district: 'Dhaka',
    phone: '01813817167',
    serviceType: 'free_patient_van',
    available: true,
    rateBn: '১০০% ফ্রি সার্ভিস'
  },
  {
    id: 'amb_3',
    nameBn: 'চট্টগ্রাম মেট্রো ২৪/৭ এসি ইমার্জেন্সি অ্যাম্বুলেন্স',
    typeBn: 'স্ট্রেচার ও অক্সিজেন সাপোর্ট সজ্জিত',
    district: 'Chittagong',
    phone: '01700112233',
    serviceType: 'ac_non_ac',
    available: true,
    rateBn: 'স্বল্প খরচে'
  },
  {
    id: 'amb_4',
    nameBn: 'রাজশাহী জেলা হাই-স্পিড মেডিকেল ভ্যান',
    typeBn: 'ভ্রাম্যমাণ অক্সিজেন ও ইমার্জেন্সি কিট সহ',
    district: 'Rajshahi',
    phone: '01973817167',
    serviceType: 'ac_non_ac',
    available: true,
    rateBn: 'জরুরি রেসপন্স'
  },
  {
    id: 'amb_5',
    nameBn: 'সিলেট এমএজি ওসমানী পেশেন্ট ট্রান্সপোর্ট স্কোয়াড',
    typeBn: 'আইসিইউ ও কার্ডিয়াক মনিটর সজ্জিত',
    district: 'Sylhet',
    phone: '01813817167',
    serviceType: 'icu',
    available: true,
    rateBn: 'জরুরি কল'
  }
];

export const EmergencyAmbulanceSection: React.FC = () => {
  const { isBn } = useTranslation();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredAmbulances = AMBULANCES_DATA.filter((amb) => {
    const matchDist = selectedDistrict === 'all' || amb.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchType = selectedType === 'all' || amb.serviceType === selectedType;
    return matchDist && matchType;
  });

  return (
    <section id="emergency-ambulance" className="py-12 bg-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5 text-rose-600" />
              <span>{isBn ? 'জরুরি অ্যাম্বুলেন্স ও অক্সিজেন ব্যাংক' : 'Emergency Ambulance & Oxygen Bank'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isBn ? '২৪ ঘণ্টা আইসিইউ অ্যাম্বুলেন্স ও অক্সিজেন সিলিন্ডার ডিরেক্টরি' : '24/7 Rapid Ambulance & Oxygen Support'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {isBn
                ? 'মুমূর্ষু রোগীর দ্রুত হাসপাতাল স্থানান্তর ও জরুরি অক্সিজেন সিলিন্ডার সরবরাহের জন্য সরাসরি কল করুন।'
                : 'Rapid ICU ambulances and medical oxygen cylinder network across Bangladesh.'}
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">{isBn ? 'জেলা নির্বাচন' : 'District'}</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800"
            >
              <option value="all">{isBn ? 'সারাদেশ (সকল জেলা)' : 'All Districts'}</option>
              {Object.values(BANGLADESH_DISTRICTS).map((d) => (
                <option key={d.name} value={d.name}>{isBn ? d.nameBn : d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">{isBn ? 'অ্যাম্বুলেন্সের ধরন' : 'Service Type'}</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800"
            >
              <option value="all">{isBn ? 'সকল ধরন' : 'All Types'}</option>
              <option value="icu">{isBn ? 'আইসিইউ / ভেন্টিলেটর অ্যাম্বুলেন্স' : 'ICU / Ventilator'}</option>
              <option value="ac_non_ac">{isBn ? 'সাধারণ এসি / নন-এসি' : 'Standard AC / Non-AC'}</option>
              <option value="free_patient_van">{isBn ? 'ফ্রি পেশেন্ট ভ্যান' : 'Free Patient Van'}</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="w-full py-2 px-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 font-bold flex items-center justify-between">
              <span>{isBn ? 'জরুরি অক্সিজেন হেল্পলাইন:' : 'Oxygen Helpline:'}</span>
              <a href="tel:01973817167" className="font-mono font-black text-rose-700">01973817167</a>
            </div>
          </div>
        </div>

        {/* Ambulance Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAmbulances.map((amb) => (
            <div
              key={amb.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-rose-300 hover:shadow-lg transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <Truck className="w-6 h-6" />
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {isBn ? '২৪ ঘণ্টা সক্রিয়' : '24/7 Ready'}
                  </span>
                </div>

                <div>
                  <h4 className="font-black text-sm text-slate-900 leading-snug">{amb.nameBn}</h4>
                  <p className="text-xs text-rose-600 font-bold mt-0.5">{amb.typeBn}</p>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{amb.district} জেলা ও পার্শ্ববর্তী এলাকা</span>
                </div>

                <div className="text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                  💳 {amb.rateBn}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-slate-700">{amb.phone}</span>
                <a
                  href={`tel:${amb.phone}`}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{isBn ? 'সরাসরি কল করুন' : 'Call Now'}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
