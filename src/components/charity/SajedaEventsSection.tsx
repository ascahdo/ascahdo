import React, { useState } from 'react';
import {
  Calendar, MapPin, Clock, Users, ArrowRight,
  CheckCircle2, Sparkles, HeartHandshake
} from 'lucide-react';
import { SYF_UPCOMING_EVENTS } from '../../data/sajedaCharityData';
import { CharityEvent } from '../../types/donationTypes';

interface SajedaEventsSectionProps {
  onJoinEvent?: (event: CharityEvent) => void;
}

export const SajedaEventsSection: React.FC<SajedaEventsSectionProps> = ({ onJoinEvent }) => {
  const [joinedToast, setJoinedToast] = useState<string | null>(null);

  const handleJoin = (event: CharityEvent) => {
    if (onJoinEvent) {
      onJoinEvent(event);
    } else {
      setJoinedToast(`আপনি "${event.titleBn}" কার্যক্রমে অংশগ্রহণের আগ্রহ প্রকাশ করেছেন!`);
      setTimeout(() => setJoinedToast(null), 3500);
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-slate-50 text-slate-900 relative">
      {joinedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-500">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{joinedToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>Field Campaigns & Drives</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            আসন্ন মানবিক কার্যক্রম
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            মাঠপর্যায়ে সরাসরি উপস্থিত থেকে কিংবা স্বেচ্ছাসেবক হিসেবে যুক্ত হয়ে পরিবর্তনের সারথি হোন।
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SYF_UPCOMING_EVENTS.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left group"
            >
              {/* Event Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.titleBn}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Date Badge */}
                <div className="absolute top-4 left-4 bg-emerald-700 text-white px-3 py-1 rounded-xl text-xs font-black shadow-md flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{event.dateBn}</span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white text-xs font-bold">
                  <span className="bg-slate-900/80 text-amber-300 px-2 py-0.5 rounded text-[11px]">
                    {event.categoryBn}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-black text-slate-900 leading-snug group-hover:text-emerald-800 transition">
                    {event.titleBn}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                    {event.descriptionBn}
                  </p>
                </div>

                {/* Location & Volunteer Count */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{event.locationBn}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-500 font-semibold">{event.organizerBn}</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {event.registeredVolunteersCount} জন ভলান্টিয়ার যুক্ত
                    </span>
                  </div>
                </div>

                {/* Join CTA */}
                <button
                  onClick={() => handleJoin(event)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-emerald-700 hover:text-white text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>Join Event (যুক্ত হোন)</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
