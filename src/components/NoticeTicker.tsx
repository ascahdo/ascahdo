import React, { useEffect, useState } from 'react';
import { useTranslation } from '../locales/i18nContext';
import { Bell, ChevronRight, Pause, Play, Sparkles, X, ExternalLink } from 'lucide-react';
import { api } from '../services/api';

interface NoticeTickerProps {
  onSelectNotice?: () => void;
}

export const NoticeTicker: React.FC<NoticeTickerProps> = ({ onSelectNotice }) => {
  const { t, isBn } = useTranslation();
  const [isPaused, setIsPaused] = useState(false);
  const [dynamicNotices, setDynamicNotices] = useState<any[]>([]);
  const [selectedNoticeModal, setSelectedNoticeModal] = useState<any | null>(null);

  // Fetch CMS notices dynamically
  useEffect(() => {
    let mounted = true;
    api.getNotices()
      .then((res) => {
        if (mounted && Array.isArray(res) && res.length > 0) {
          setDynamicNotices(res);
        }
      })
      .catch(() => {
        // Fallback gracefully
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Built-in default notices
  const fallbackNoticeItems = [
    {
      id: 'f1',
      titleBn: t.ticker.item1,
      titleEn: 'Escado is launching new district and upazila level branch licensing and somiti operations.',
      urgent: true,
      date: 'আজকের বিজ্ঞপ্তি'
    },
    {
      id: 'f2',
      titleBn: t.ticker.item2,
      titleEn: 'O- and B- negative urgent blood requests are being processed with high priority in the Blood Bank module.',
      urgent: true,
      date: 'জরুরি নোটিশ'
    },
    {
      id: 'f3',
      titleBn: t.ticker.item3,
      titleEn: 'Limited seats remaining for Free ICT Youth Development and Technical Training Courses.',
      urgent: false,
      date: 'ভর্তি বিজ্ঞপ্তি'
    },
    {
      id: 'f4',
      titleBn: 'সেন্ট্রাল মাল্টি-সমিতি ও এনজিও ইআরপিতে ডিজিটাল পাসবুক ও কিস্তি কালেকশন সিস্টেম যুক্ত হয়েছে।',
      titleEn: 'Digital Passbook & field POS installment collection is now live on Somiti ERP.',
      urgent: true,
      date: 'নতুন ফিচার'
    }
  ];

  const noticeList = dynamicNotices.length > 0
    ? dynamicNotices.map((n) => ({
        id: n.id,
        titleBn: n.titleBn || n.title,
        titleEn: n.titleEn || n.title,
        contentBn: n.contentBn || n.content,
        contentEn: n.contentEn || n.content,
        urgent: n.urgent ?? true,
        date: n.publishedAt ? new Date(n.publishedAt).toLocaleDateString(isBn ? 'bn-BD' : 'en-US') : ''
      }))
    : fallbackNoticeItems;

  return (
    <>
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-emerald-100 text-xs py-2 px-3 sm:px-4 border-b border-emerald-800/80 shadow-inner relative overflow-hidden select-none">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3">
          
          {/* Breaking Notice Label with Live Pulsing Indicator */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black px-2.5 sm:px-3 py-1 rounded-full text-[11px] uppercase tracking-wide shrink-0 shadow-sm border border-rose-500/40 transition">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <Bell className="w-3 h-3 text-white" />
            <span className="font-bold">{t.ticker.label}</span>
          </div>

          {/* Scrolling Marquee Container with edge fade masks */}
          <div
            className="overflow-hidden relative flex-1 mask-linear group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Left & Right Subtle Fade Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-emerald-950 to-transparent z-10 pointer-events-none hidden sm:block" />
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-emerald-950 to-transparent z-10 pointer-events-none hidden sm:block" />

            {/* Seamless Infinite Loop by repeating elements in a dual block */}
            <div className={`animate-marquee ${isPaused ? 'animate-marquee-paused' : ''} flex items-center gap-8 text-slate-100 font-medium cursor-pointer`}>
              
              {/* Set 1 */}
              <div className="flex items-center gap-8 shrink-0">
                {noticeList.map((item, idx) => (
                  <div
                    key={`n1-${item.id || idx}`}
                    onClick={() => setSelectedNoticeModal(item)}
                    className="inline-flex items-center gap-2 hover:text-emerald-300 transition duration-150 py-0.5 group/item"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 group-hover/item:scale-125 transition" />
                    {item.urgent && (
                      <span className="bg-rose-500/30 text-rose-200 border border-rose-400/40 text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                        {isBn ? 'জরুরি' : 'Urgent'}
                      </span>
                    )}
                    <span className="text-xs sm:text-[13px] font-medium tracking-normal hover:underline underline-offset-4">
                      {isBn ? item.titleBn : item.titleEn}
                    </span>
                  </div>
                ))}
              </div>

              {/* Set 2 (Identical Clone for continuous smooth marquee without gaps) */}
              <div className="flex items-center gap-8 shrink-0" aria-hidden="true">
                {noticeList.map((item, idx) => (
                  <div
                    key={`n2-${item.id || idx}`}
                    onClick={() => setSelectedNoticeModal(item)}
                    className="inline-flex items-center gap-2 hover:text-emerald-300 transition duration-150 py-0.5 group/item"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 group-hover/item:scale-125 transition" />
                    {item.urgent && (
                      <span className="bg-rose-500/30 text-rose-200 border border-rose-400/40 text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                        {isBn ? 'জরুরি' : 'Urgent'}
                      </span>
                    )}
                    <span className="text-xs sm:text-[13px] font-medium tracking-normal hover:underline underline-offset-4">
                      {isBn ? item.titleBn : item.titleEn}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Controls: Play/Pause Toggle & All Notices Button */}
          <div className="flex items-center gap-1.5 shrink-0 z-20">
            <button
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? (isBn ? 'চালু করুন' : 'Resume Scrolling') : (isBn ? 'থামান' : 'Pause Scrolling')}
              aria-label={isPaused ? 'Resume scrolling' : 'Pause scrolling'}
              className="p-1 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 hover:text-white transition cursor-pointer"
            >
              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            </button>

            <button
              onClick={onSelectNotice}
              className="flex items-center gap-0.5 bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 hover:text-white px-2 py-1 rounded-lg font-bold text-[11px] shrink-0 transition cursor-pointer border border-emerald-700/50"
            >
              <span>{isBn ? 'সকল নোটিশ' : 'All'}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>

      {/* Notice Popup Modal when a specific scrolling item is clicked */}
      {selectedNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative text-slate-900 space-y-4">
            
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 font-bold">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-black text-rose-600 uppercase tracking-wider block">
                    {isBn ? 'অফিসিয়াল বিজ্ঞপ্তি' : 'Official Notice'}
                  </span>
                  {selectedNoticeModal.date && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      {selectedNoticeModal.date}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedNoticeModal(null)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-black text-slate-900 leading-snug">
                {isBn ? selectedNoticeModal.titleBn : selectedNoticeModal.titleEn}
              </h3>
              {(selectedNoticeModal.contentBn || selectedNoticeModal.contentEn) && (
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {isBn ? selectedNoticeModal.contentBn : selectedNoticeModal.contentEn}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              {onSelectNotice && (
                <button
                  onClick={() => {
                    setSelectedNoticeModal(null);
                    onSelectNotice();
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isBn ? 'নোটিশ বোর্ড দেখুন' : 'View Notice Board'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setSelectedNoticeModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
