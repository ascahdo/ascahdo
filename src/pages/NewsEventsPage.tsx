import React, { useState, useEffect } from 'react';
import { useTranslation } from '../locales/i18nContext';
import { Calendar, Bell, FileText, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { api } from '../services/api';
import { AdBannerBox } from '../components/AdBannerBox';

export const NewsEventsPage: React.FC = () => {
  const { isBn } = useTranslation();
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.getNotices();
        setNotices(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotices();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-3">
        <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase">
          {isBn ? 'সংবাদ, নোটিশ ও প্রেস বিজ্ঞপ্তি' : 'News, Events & Circulars'}
        </span>
        <h1 className="text-2xl sm:text-4xl font-black">
          {isBn ? 'প্ল্যাটফর্মের সাম্প্রতিক কার্যক্রম ও অফিসিয়াল প্রজ্ঞাপন' : 'Official Circulars & Community Happenings'}
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
          {isBn
            ? 'এসকাডো প্ল্যাটফর্ম ও সহযোগী এনজিও সমূহের সকল নোটিশ, চাকরির সার্কুলার, ইভেন্ট ও ফটো গ্যালারি।'
            : 'Stay updated with official bulletins, CSR press releases, job openings, and photo coverage.'}
        </p>
      </div>

      {/* In-Content Ad Banner */}
      <AdBannerBox
        position="content_banner"
        titleOverride={isBn ? 'জাতীয় পত্রিকা ও মিডিয়া পার্টনার স্পনসরশিপ' : 'National Media & Publishing Partner'}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Notices Grid (2 cols on large) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {notices.map((n) => (
            <div
              key={n.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {n.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{n.publishedDate}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 mt-3 group-hover:text-emerald-600 transition line-clamp-2">
                  {isBn ? n.titleBn : n.title}
                </h3>

                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {isBn ? n.contentBn : n.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">{isBn ? 'কর্তৃপক্ষ: এসকাডো' : 'Publisher: ASCAHDO'}</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition">
                  <span>{isBn ? 'বিস্তারিত' : 'Read'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Column with Sidebar Ad Box */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between">
            <span className="text-xs font-black uppercase text-amber-400">
              {isBn ? 'বিজ্ঞাপন কর্নার' : 'Ad Corner'}
            </span>
            <span className="text-[10px] text-slate-400">
              {isBn ? 'স্পন্সরড লিঙ্ক' : 'Sponsored Links'}
            </span>
          </div>

          <AdBannerBox position="sidebar_box" />
          <AdBannerBox position="sidebar_box" />
        </div>
      </div>
    </div>
  );
};
