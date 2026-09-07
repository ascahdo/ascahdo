import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Briefcase,
  MapPin,
  Pause,
  Play,
  Eye,
  CheckCircle2,
  Bookmark,
  Send,
  Flame,
  ArrowRight,
  UserPlus
} from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimony } from '../../../context/MatrimonyContext';
import { useMatrimonyAuth } from '../../../context/MatrimonyAuthContext';
import { Gender, MatrimonyProfile } from '../../../types/matrimonyTypes';
import { BANGLADESH_DISTRICTS } from '../../../data/bangladeshData';
import { INITIAL_PROFILES } from '../../../data/mockDatabase';

interface HomePhotoSliderProps {
  onSelectGenderSearch: (gender: Gender) => void;
  onOpenRegister: () => void;
  onOpenAdvancedSearch: () => void;
  onViewProfile?: (profile: MatrimonyProfile) => void;
  onOpenLogin?: () => void;
}

export const HomePhotoSlider: React.FC<HomePhotoSliderProps> = ({
  onSelectGenderSearch,
  onOpenRegister,
  onViewProfile,
  onOpenLogin,
}) => {
  const { lang } = useMatrimonyLanguage();
  const { isAuthenticated } = useMatrimonyAuth();
  const {
    profiles: contextProfiles,
    currentProfile,
    toggleShortlist,
    isShortlisted,
    sendInterest,
    getInterestStatus,
    calculateCompatibility
  } = useMatrimony();

  const [selectedGenderTab, setSelectedGenderTab] = useState<'all' | 'female' | 'male'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const allAvailableProfiles = useMemo(() => {
    const list = contextProfiles && contextProfiles.length > 0 ? contextProfiles : INITIAL_PROFILES;
    return list.filter(p => p && p.status !== 'suspended' && p.status !== 'banned' && p.avatarUrl);
  }, [contextProfiles]);

  const filteredProfiles = useMemo(() => {
    if (selectedGenderTab === 'female') {
      return allAvailableProfiles.filter(p => p.gender === 'female');
    }
    if (selectedGenderTab === 'male') {
      return allAvailableProfiles.filter(p => p.gender === 'male');
    }
    const females = allAvailableProfiles.filter(p => p.gender === 'female');
    const males = allAvailableProfiles.filter(p => p.gender === 'male');
    const combined: MatrimonyProfile[] = [];
    const maxLen = Math.max(females.length, males.length);
    for (let i = 0; i < maxLen; i++) {
      if (females[i]) combined.push(females[i]);
      if (males[i]) combined.push(males[i]);
    }
    return combined.length > 0 ? combined : allAvailableProfiles;
  }, [allAvailableProfiles, selectedGenderTab]);

  const totalSlides = filteredProfiles.length;

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedGenderTab]);

  const nextSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex(prev => (prev >= totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex(prev => (prev <= 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    if (!isAutoPlay || totalSlides <= 1) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlay, nextSlide, totalSlides]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  const activeProfile = filteredProfiles[currentIndex] || filteredProfiles[0];

  const getDistrictName = (districtId?: string) => {
    if (!districtId) return '';
    const d = BANGLADESH_DISTRICTS.find(item => item.id === districtId);
    return d ? (lang === 'bn' ? d.nameBn : d.nameEn) : districtId;
  };

  const shortlisted = activeProfile ? isShortlisted(activeProfile.id) : false;
  const interestStatus = activeProfile ? getInterestStatus(activeProfile.id) : null;
  const matchScore = (currentProfile && activeProfile) ? calculateCompatibility(currentProfile, activeProfile) : null;

  const handleInterestClick = (profile: MatrimonyProfile) => {
    if (!isAuthenticated) {
      if (onOpenLogin) onOpenLogin();
      return;
    }
    sendInterest(profile.id);
  };

  const handleShortlistClick = (profile: MatrimonyProfile) => {
    if (!isAuthenticated) {
      if (onOpenLogin) onOpenLogin();
      return;
    }
    toggleShortlist(profile.id);
  };

  const handleViewProfileClick = (profile: MatrimonyProfile) => {
    if (onViewProfile) {
      onViewProfile(profile);
    }
  };

  if (!activeProfile) {
    return null;
  }

  return (
    <div
      className="relative w-full bg-slate-950 text-white select-none overflow-hidden"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Matrimonial Groom & Bride Photo Showcase"
    >
      {/* Top Bar inside Slider */}
      <div className="relative z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2 overflow-hidden">
          {/* Filter Tabs for Brides, Grooms, and All */}
          <div className="flex items-center gap-1 sm:gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => setSelectedGenderTab('all')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 shrink-0 ${
                selectedGenderTab === 'all'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">
                {lang === 'bn' ? 'সকল বায়োডাটা' : 'All'}
              </span>
            </button>

            <button
              onClick={() => setSelectedGenderTab('female')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 shrink-0 ${
                selectedGenderTab === 'female'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span className="text-sm">🧕</span>
              <span className="whitespace-nowrap">
                {lang === 'bn' ? 'পাত্রী সন্ধান' : 'Brides'}
              </span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-pink-950/80 text-pink-200 text-[10px]">
                {allAvailableProfiles.filter(p => p.gender === 'female').length}
              </span>
            </button>

            <button
              onClick={() => setSelectedGenderTab('male')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 shrink-0 ${
                selectedGenderTab === 'male'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span className="text-sm">👳</span>
              <span className="whitespace-nowrap">
                {lang === 'bn' ? 'পাত্র সন্ধান' : 'Grooms'}
              </span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-blue-950/80 text-blue-200 text-[10px]">
                {allAvailableProfiles.filter(p => p.gender === 'male').length}
              </span>
            </button>
          </div>

          {/* Quick Counter & Autoplay Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'bn' ? '১০০% ভেরিফাইড' : '100% Verified'}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900 border border-slate-800 px-2 sm:px-2.5 py-1 rounded-lg text-xs shrink-0">
              <span className="font-mono font-bold text-rose-400 text-[11px] sm:text-xs">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-slate-600">/</span>
              <span className="font-mono text-slate-400 text-[11px] sm:text-xs">
                {String(totalSlides).padStart(2, '0')}
              </span>
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="ml-1 p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
                title={isAutoPlay ? 'পজ করুন' : 'প্লে করুন'}
                aria-label="Toggle Autoplay"
              >
                {isAutoPlay ? <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Showcase Stage */}
      <div className="relative min-h-[500px] sm:min-h-[550px] lg:h-[600px] w-full overflow-hidden flex items-center">
        {/* Background Ambience */}
        <div className="absolute inset-0 z-0">
          <img
            src={activeProfile.avatarUrl}
            alt={activeProfile.displayName}
            className="w-full h-full object-cover object-center blur-2xl opacity-20 scale-110 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* LEFT: Featured Person's Photo Card (5 cols) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-[360px] sm:max-w-[400px] rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-700/60 group/card bg-slate-900">
                {/* Profile Photo Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
                  <img
                    key={activeProfile.id}
                    src={activeProfile.avatarUrl}
                    alt={activeProfile.displayName}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover/card:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-md ${
                        activeProfile.gender === 'female'
                          ? 'bg-pink-600/90 text-white border border-pink-400/40'
                          : 'bg-blue-600/90 text-white border border-blue-400/40'
                      }`}
                    >
                      <span>{activeProfile.gender === 'female' ? 'পাত্রী' : 'পাত্র'}</span>
                      <span className="opacity-75">|</span>
                      <span>{activeProfile.gender === 'female' ? 'Bride' : 'Groom'}</span>
                    </div>

                    {activeProfile.verificationStatus === 'verified' && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>এনআইডি ভেরিফাইড</span>
                      </div>
                    )}
                  </div>

                  {/* Membership Ribbon */}
                  {activeProfile.membershipTier && activeProfile.membershipTier !== 'free' && (
                    <div className="absolute top-14 left-3.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/90 text-slate-950 text-[11px] font-extrabold shadow">
                      <Sparkles className="w-3 h-3 text-slate-950" />
                      <span>{activeProfile.membershipTier === 'premium' ? 'গোল্ড ভিআইপি' : 'সিলভার সদস্য'}</span>
                    </div>
                  )}

                  {/* Compatibility Score badge */}
                  {matchScore !== null && (
                    <div className="absolute bottom-16 right-3.5 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-600/95 text-white text-xs font-bold shadow-lg border border-rose-400/40">
                      <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                      <span>{matchScore}% উপযুক্ত ম্যাচ</span>
                    </div>
                  )}

                  {/* Photo Bottom Info Strip */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-slate-200">
                    <span className="font-mono bg-slate-950/80 px-2 py-0.5 rounded border border-slate-700/60">
                      আইডি: {activeProfile.id}
                    </span>
                    <button
                      onClick={() => handleViewProfileClick(activeProfile)}
                      className="px-2.5 py-1 rounded-md bg-rose-600/90 hover:bg-rose-600 text-white font-semibold flex items-center gap-1 shadow transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>বিস্তারিত দেখুন</span>
                    </button>
                  </div>
                </div>

                {/* Card Quick Action Footer */}
                <div className="p-3 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleShortlistClick(activeProfile)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      shortlisted
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${shortlisted ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span>{shortlisted ? (lang === 'bn' ? 'সংরক্ষিত' : 'Shortlisted') : (lang === 'bn' ? 'শর্টলিস্ট' : 'Shortlist')}</span>
                  </button>
                  <button
                    onClick={() => handleInterestClick(activeProfile)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      interestStatus === 'sent_pending' || interestStatus === 'sent_accepted'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/40'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {interestStatus === 'sent_pending'
                        ? (lang === 'bn' ? 'আগ্রহ পাঠানো হয়েছে' : 'Sent')
                        : interestStatus === 'sent_accepted'
                        ? (lang === 'bn' ? 'গৃহীত' : 'Accepted')
                        : (lang === 'bn' ? 'আগ্রহ প্রকাশ' : 'Send Interest')}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: Biodata Highlights (7 cols) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
              {/* Category Subhead & Location Tag */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-slate-300 text-xs font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>
                    {getDistrictName(activeProfile.location?.district)}
                    {activeProfile.location?.division ? `, ${activeProfile.location.division.toUpperCase()}` : ''}
                  </span>
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-slate-300 text-xs font-medium">
                  {activeProfile.religion} {activeProfile.sectReligiousSubtype ? `(${activeProfile.sectReligiousSubtype})` : ''}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {activeProfile.maritalStatus === 'never_married'
                      ? (lang === 'bn' ? 'অবিবাহিত' : 'Never Married')
                      : activeProfile.maritalStatus === 'divorced'
                      ? (lang === 'bn' ? 'ডিভোর্সড' : 'Divorced')
                      : (lang === 'bn' ? 'বিধবা/বিপত্নীক' : 'Widowed')}
                  </span>
                </span>
              </div>

              {/* Full Name & Title */}
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-white leading-tight">
                  {activeProfile.displayName || activeProfile.fullName}
                </h2>
                <p className="text-sm sm:text-base text-rose-300 font-medium mt-1 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{activeProfile.profession?.designation || activeProfile.profession?.professionType}</span>
                  {activeProfile.profession?.organization && (
                    <span className="text-slate-400">@ {activeProfile.profession.organization}</span>
                  )}
                </p>
              </div>

              {/* Biodata Key Metrics 4-Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 py-1">
                <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
                  <div className="text-[11px] text-slate-400 font-medium">
                    {lang === 'bn' ? 'বয়স ও উচ্চতা' : 'Age & Height'}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                    {activeProfile.age} {lang === 'bn' ? 'বছর' : 'Yrs'}, {activeProfile.height}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
                  <div className="text-[11px] text-slate-400 font-medium">
                    {lang === 'bn' ? 'শিক্ষাগত যোগ্যতা' : 'Education'}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white mt-0.5 truncate" title={activeProfile.education?.degree}>
                    {activeProfile.education?.level || activeProfile.education?.degree || 'স্নাতকোত্তর'}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
                  <div className="text-[11px] text-slate-400 font-medium">
                    {lang === 'bn' ? 'পেশা ও কর্মক্ষেত্র' : 'Profession'}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white mt-0.5 truncate" title={activeProfile.profession?.professionType}>
                    {activeProfile.profession?.professionType || 'পেশাজীবী'}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
                  <div className="text-[11px] text-slate-400 font-medium">
                    {lang === 'bn' ? 'দ্বীনি অনুশাসন' : 'Religious Practice'}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-emerald-400 mt-0.5">
                    {activeProfile.namazPrayerHabit === 'regular_5_times'
                      ? (lang === 'bn' ? '৫ ওয়াক্ত নামাজি' : '5 Times Daily')
                      : (lang === 'bn' ? 'নিয়মিত নামাজ' : 'Regular Prayer')}
                  </div>
                </div>
              </div>

              {/* Bio Statement */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md text-xs sm:text-sm text-slate-300 leading-relaxed italic relative">
                <span className="text-rose-400 font-serif text-xl mr-1">“</span>
                {activeProfile.aboutMe || (lang === 'bn' ? 'পারিবারিক অনুশাসন ও ইসলামিক মূল্যবোধসম্পন্ন পাত্র-পাত্রী সন্ধান।' : 'Family-oriented individual seeking a compatible life partner.')}
                <span className="text-rose-400 font-serif text-xl ml-1">”</span>
              </div>

              {/* Primary Call-to-Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleViewProfileClick(activeProfile)}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-rose-950/60 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span className="whitespace-nowrap">
                    {lang === 'bn' ? 'সম্পূর্ণ বায়োডাটা ও ছবি দেখুন' : 'View Full Biodata & Photos'}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={() => onSelectGenderSearch(activeProfile.gender)}
                  className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-sm font-semibold border border-slate-700 transition flex items-center gap-2 cursor-pointer"
                >
                  <span>
                    {activeProfile.gender === 'female'
                      ? (lang === 'bn' ? 'সকল পাত্রী দেখুন' : 'Browse All Brides')
                      : (lang === 'bn' ? 'সকল পাত্র দেখুন' : 'Browse All Grooms')}
                  </span>
                </button>

                <button
                  onClick={onOpenRegister}
                  className="px-4 py-3.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  <span className="whitespace-nowrap">
                    {lang === 'bn' ? 'ফ্রি বায়োডাটা তৈরি' : 'Free Registration'}
                  </span>
                </button>
              </div>

              {/* Bottom Thumbnail Strip */}
              <div className="pt-3">
                <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
                  <span>{lang === 'bn' ? 'অন্যান্য নির্বাচিত বায়োডাটা:' : 'More Featured Profiles:'}</span>
                  <span className="text-[10px] text-rose-400">{filteredProfiles.length} টি বায়োডাটা</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
                  {filteredProfiles.slice(0, 8).map((p, idx) => {
                    const isSelected = idx === currentIndex;
                    return (
                      <button
                        key={p.id}
                        onClick={() => goToSlide(idx)}
                        className={`group relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-rose-500 ring-2 ring-rose-500/40 scale-105 shadow-md shadow-rose-950'
                            : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                        }`}
                        title={`${p.displayName} (${p.gender === 'female' ? 'পাত্রী' : 'পাত্র'})`}
                        aria-label={`Jump to profile ${p.displayName}`}
                      >
                        <img
                          src={p.avatarUrl}
                          alt={p.displayName}
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        <div
                          className={`absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full border border-slate-900 ${
                            p.gender === 'female' ? 'bg-pink-500' : 'bg-blue-500'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Chevron Left */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700/80 backdrop-blur-md flex items-center justify-center transition opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
          aria-label="Previous Profile"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Navigation Chevron Right */}
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700/80 backdrop-blur-md flex items-center justify-center transition opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
          aria-label="Next Profile"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
