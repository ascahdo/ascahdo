import React, { useState } from 'react';
import { Sparkles, ArrowRight, Filter } from 'lucide-react';
import { MatrimonyProfile, Gender } from '../../../types/matrimonyTypes';
import { ProfileCard } from '../profiles/ProfileCard';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimony } from '../../../context/MatrimonyContext';

interface FeaturedProfilesProps {
  onViewProfile: (profile: MatrimonyProfile) => void;
  onOpenAdvancedSearch: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const FeaturedProfiles: React.FC<FeaturedProfilesProps> = ({
  onViewProfile,
  onOpenAdvancedSearch,
  onOpenLogin,
  onOpenRegister,
}) => {
  const { lang, t } = useMatrimonyLanguage();
  const { profiles } = useMatrimony();
  const [filterGender, setFilterGender] = useState<'all' | 'female' | 'male'>('all');

  const filtered = (profiles || []).filter(p => {
    if (p.status === 'suspended' || p.status === 'banned') return false;
    if (filterGender === 'female') return p.gender === 'female';
    if (filterGender === 'male') return p.gender === 'male';
    return true;
  });

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/80 text-rose-900 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-rose-700" />
              <span>{lang === 'bn' ? 'বাছাইকৃত পাত্র-পাত্রী' : 'Featured Biodatas'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
              {lang === 'bn' ? 'সর্বশেষ যাচাইকৃত পাত্র-পাত্রীর বায়োডাটা' : 'Latest Verified Matrimonial Profiles'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              {lang === 'bn'
                ? 'পারিবারিক মর্যাদা, উচ্চশিক্ষা ও ধর্মীয় মূল্যবোধসম্পন্ন পাত্র-পাত্রীর শতভাগ তথ্য যাচাইকৃত বায়োডাটা।'
                : 'Browse through our thoroughly vetted profiles of accomplished, dignified brides and grooms.'}
            </p>
          </div>

          {/* Gender Filter Buttons */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs self-start md:self-auto">
            <button
              onClick={() => setFilterGender('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterGender === 'all'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'bn' ? 'সকল' : 'All'}
            </button>
            <button
              onClick={() => setFilterGender('female')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterGender === 'female'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🧕 {lang === 'bn' ? 'পাত্রী' : 'Brides'}
            </button>
            <button
              onClick={() => setFilterGender('male')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterGender === 'male'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👳 {lang === 'bn' ? 'পাত্র' : 'Grooms'}
            </button>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.slice(0, 6).map(profile => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onViewDetails={onViewProfile}
              onOpenLogin={onOpenLogin}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenAdvancedSearch}
            className="px-6 py-3 rounded-2xl bg-white hover:bg-rose-50 text-rose-900 border border-rose-200 font-bold text-xs sm:text-sm shadow-sm transition flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <span>{lang === 'bn' ? 'আরও অনুসন্ধান করুন' : 'Search All Profiles'}</span>
          </button>
          <button
            onClick={onOpenRegister}
            className="px-6 py-3 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-700/20 transition flex items-center gap-2"
          >
            <span>{lang === 'bn' ? 'আপনার বায়োডাটা যুক্ত করুন' : 'Create Your Biodata'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
