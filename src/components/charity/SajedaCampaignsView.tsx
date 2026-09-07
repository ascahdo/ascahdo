import React, { useState } from 'react';
import {
  Flame, Search, Filter, Clock, Users, Heart,
  ShieldCheck, Share2, ArrowRight, Sparkles
} from 'lucide-react';
import { SYF_FEATURED_CAMPAIGNS } from '../../data/sajedaCharityData';
import { EmergencyAppeal } from '../../types/donationTypes';

interface SajedaCampaignsViewProps {
  onOpenDonate?: (campaignId?: string) => void;
}

export const SajedaCampaignsView: React.FC<SajedaCampaignsViewProps> = ({ onOpenDonate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'urgent' | 'target' | 'raised'>('urgent');

  const filteredCampaigns = SYF_FEATURED_CAMPAIGNS.filter(c => {
    const matchesSearch = c.titleBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.storyBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.locationBn && c.locationBn.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-12 lg:py-20 bg-slate-50 text-slate-900 space-y-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
              <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Live Emergency Campaigns</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              জরুরি মানবিক ক্যাম্পেইনসমূহ
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              যেখানে একটি ছোট অনুদানও জীবন ও মৃত্যুর মাঝের ব্যবধান ঘুচিয়ে দিতে পারে।
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ক্যাম্পেইন বা এলাকা দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {['all', 'medical_emergency', 'flood_relief', 'winter_relief'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' && 'সকল ক্যাম্পেইন'}
                {cat === 'medical_emergency' && 'চিকিৎসা সহায়তা'}
                {cat === 'flood_relief' && 'বন্যা ও পুনর্বাসন'}
                {cat === 'winter_relief' && 'শীতবস্ত্র বিতরণ'}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCampaigns.map((camp) => {
            const percent = Math.min(100, Math.round((camp.raisedAmount / camp.targetAmount) * 100));
            const remaining = Math.max(0, camp.targetAmount - camp.raisedAmount);

            return (
              <div
                key={camp.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={camp.imageUrl}
                    alt={camp.titleBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4 bg-rose-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-white animate-pulse" />
                    <span>জরুরি</span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white text-xs font-bold flex items-center justify-between">
                    <span className="truncate max-w-[200px]">{camp.patientOrCauseName}</span>
                    <span className="bg-slate-900/80 text-emerald-300 font-mono px-2 py-0.5 rounded text-[11px]">
                      {camp.locationBn}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-800 transition leading-snug">
                      {camp.titleBn}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                      {camp.storyBn}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5 font-mono">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-600 font-sans">সংগ্রহ: ৳{(camp?.raisedAmount || 0).toLocaleString('bn-BD')}</span>
                      <span className="text-emerald-700">{percent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-sans pt-1">
                      <span>লক্ষ্য: ৳{(camp?.targetAmount || 0).toLocaleString('bn-BD')}</span>
                      <span className="text-rose-600 font-bold">বাকি: ৳{(remaining || 0).toLocaleString('bn-BD')}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => onOpenDonate && onOpenDonate(camp.id)}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>Help Now (অনুদানে বাঁচান)</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
