import React, { useState } from 'react';
import {
  X,
  Heart,
  ShieldCheck,
  Phone,
  Lock,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Send,
  Flag,
  Share2,
  Users,
  Eye,
  Calendar,
  Layers,
  ArrowRight,
  Printer
} from 'lucide-react';
import { MatrimonyProfile } from '../../../types/matrimonyTypes';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimony } from '../../../context/MatrimonyContext';
import { useMatrimonyAuth } from '../../../context/MatrimonyAuthContext';
import { BANGLADESH_DISTRICTS } from '../../../data/bangladeshData';

interface ProfileDetailModalProps {
  profile: MatrimonyProfile | null;
  onClose: () => void;
  onOpenLogin: () => void;
  onOpenUpgrade: () => void;
  onOpenReport: (profileId: string) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  onClose,
  onOpenLogin,
  onOpenUpgrade,
  onOpenReport,
}) => {
  const { lang, t } = useMatrimonyLanguage();
  const { isAuthenticated, currentUser } = useMatrimonyAuth();
  const {
    isShortlisted,
    toggleShortlist,
    sendInterest,
    getInterestStatus,
    sendContactRequest,
    getContactRequestStatus,
    currentProfile,
    calculateCompatibility
  } = useMatrimony();

  const [activeTab, setActiveTab] = useState<'general' | 'family' | 'religious' | 'preference'>('general');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!profile) return null;

  const district = BANGLADESH_DISTRICTS.find(d => d.id === profile.location?.district);
  const districtName = district ? (lang === 'bn' ? district.nameBn : district.nameEn) : profile.location?.district;

  const shortlisted = isShortlisted(profile.id);
  const interestStatus = getInterestStatus(profile.id);
  const contactStatus = getContactRequestStatus(profile.id);
  const matchScore = currentProfile ? calculateCompatibility(currentProfile, profile) : null;

  const isUserPremium = currentProfile?.membershipTier === 'premium' || currentProfile?.membershipTier === 'standard';

  const allPhotos = [
    profile.avatarUrl,
    ...(profile.additionalPhotos || [])
  ].filter(Boolean);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleInterest = () => {
    if (!isAuthenticated) {
      onOpenLogin();
      return;
    }
    sendInterest(profile.id);
  };

  const handleContactRequest = () => {
    if (!isAuthenticated) {
      onOpenLogin();
      return;
    }
    if (!isUserPremium) {
      onOpenUpgrade();
      return;
    }
    sendContactRequest(profile.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 my-4 max-h-[92vh] flex flex-col animate-in zoom-in-95">
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
              BIO-ID: {profile.id}
            </span>
            {profile.verificationStatus === 'verified' && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'যাচাইকৃত প্রোফাইল' : 'Verified'}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Print Biodata"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenReport(profile.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              title="Report Profile"
            >
              <Flag className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 text-slate-800">
          {/* Main Top Banner Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-6 border-b border-slate-100">
            {/* Photos Showcase (4 cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                <img
                  src={allPhotos[selectedPhotoIndex] || profile.avatarUrl}
                  alt={profile.displayName}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-xs font-semibold">
                    {profile.gender === 'female' ? (lang === 'bn' ? 'পাত্রী' : 'Bride') : (lang === 'bn' ? 'পাত্র' : 'Groom')}
                  </span>
                  {matchScore !== null && (
                    <span className="bg-rose-600 px-2.5 py-0.5 rounded font-bold shadow-xs">
                      {matchScore}% Match
                    </span>
                  )}
                </div>
              </div>

              {/* Photo Thumbnails */}
              {allPhotos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allPhotos.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                        selectedPhotoIndex === idx
                          ? 'border-rose-600 ring-2 ring-rose-300'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Core Info & Title (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                    {profile.displayName || profile.fullName}
                  </h2>
                </div>
                <p className="text-sm font-semibold text-rose-700">
                  {profile.profession?.designation || profile.profession?.professionType}
                  {profile.profession?.organization && ` @ ${profile.profession.organization}`}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {districtName}{profile.location?.division ? `, ${profile.location.division.toUpperCase()}` : ''}
                  </span>
                </p>
              </div>

              {/* Key Quick Facts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">{lang === 'bn' ? 'বয়স ও উচ্চতা' : 'Age & Height'}</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{profile.age} Yrs, {profile.height}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">{lang === 'bn' ? 'বৈবাহিক অবস্থা' : 'Marital Status'}</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">
                    {profile.maritalStatus === 'never_married' ? 'Never Married' : profile.maritalStatus}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">{lang === 'bn' ? 'ধর্ম / সম্প্রদায়' : 'Religion'}</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{profile.religion} ({profile.sectReligiousSubtype || 'Sunni'})</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">{lang === 'bn' ? 'রক্তের গ্রুপ' : 'Blood Group'}</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{profile.bloodGroup || 'O+'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">{lang === 'bn' ? 'গায়ের রঙ' : 'Complexion'}</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{profile.complexion || 'Fair'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">{lang === 'bn' ? 'মাসিক আয়' : 'Monthly Income'}</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{profile.profession?.monthlyIncomeRange || '৳ ৫০,০০০+'}</span>
                </div>
              </div>

              {/* Action Buttons Box */}
              <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-100 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleInterest}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-xs ${
                      interestStatus === 'sent_pending' || interestStatus === 'sent_accepted'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-700 hover:bg-rose-800 text-white'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {interestStatus === 'sent_pending'
                        ? (lang === 'bn' ? 'আগ্রহ পাঠানো হয়েছে' : 'Interest Sent')
                        : interestStatus === 'sent_accepted'
                        ? (lang === 'bn' ? 'আগ্রহ গৃহীত হয়েছে' : 'Interest Accepted')
                        : (lang === 'bn' ? 'আগ্রহ প্রকাশ করুন' : 'Express Interest')}
                    </span>
                  </button>

                  <button
                    onClick={() => toggleShortlist(profile.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
                      shortlisted
                        ? 'bg-amber-100 border-amber-300 text-amber-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${shortlisted ? 'fill-amber-600 text-amber-600' : ''}`} />
                    <span className="hidden sm:inline">
                      {shortlisted ? (lang === 'bn' ? 'সংরক্ষিত' : 'Saved') : (lang === 'bn' ? 'শর্টলিস্ট' : 'Shortlist')}
                    </span>
                  </button>
                </div>

                {/* Guardian Phone Access Card */}
                <div className="p-3 bg-white rounded-xl border border-rose-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {lang === 'bn' ? 'অভিভাবকের সরাসরি যোগাযোগ নম্বর' : 'Guardian Contact Number'}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {isUserPremium
                          ? (lang === 'bn' ? 'প্যাকেজের মাধ্যমে উন্মুক্ত নম্বর' : 'Available with your package')
                          : (lang === 'bn' ? 'সরাসরি কথা বলতে মেম্বারশিপ প্রয়োজন' : 'Upgrade to view verified number')}
                      </p>
                    </div>
                  </div>

                  {isUserPremium ? (
                    <button
                      onClick={handleContactRequest}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition whitespace-nowrap"
                    >
                      {contactStatus === 'approved'
                        ? (lang === 'bn' ? 'নম্বর উন্মুক্ত' : 'Unlocked')
                        : contactStatus === 'pending'
                        ? (lang === 'bn' ? 'অনুরোধ পাঠানো' : 'Requested')
                        : (lang === 'bn' ? 'নম্বর অনুরোধ' : 'Request Number')}
                    </button>
                  ) : (
                    <button
                      onClick={onOpenUpgrade}
                      className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold transition whitespace-nowrap shadow-xs flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'আনলক করুন' : 'Unlock'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Section Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setActiveTab('general')}
              className={`pb-3 transition border-b-2 whitespace-nowrap ${
                activeTab === 'general'
                  ? 'border-rose-700 text-rose-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {lang === 'bn' ? 'ব্যক্তিগত ও শিক্ষা' : 'General & Education'}
            </button>
            <button
              onClick={() => setActiveTab('family')}
              className={`pb-3 transition border-b-2 whitespace-nowrap ${
                activeTab === 'family'
                  ? 'border-rose-700 text-rose-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {lang === 'bn' ? 'পারিবারিক বিবরণ' : 'Family Details'}
            </button>
            <button
              onClick={() => setActiveTab('religious')}
              className={`pb-3 transition border-b-2 whitespace-nowrap ${
                activeTab === 'religious'
                  ? 'border-rose-700 text-rose-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {lang === 'bn' ? 'দ্বীনি ও জীবনধারা' : 'Religious & Lifestyle'}
            </button>
            <button
              onClick={() => setActiveTab('preference')}
              className={`pb-3 transition border-b-2 whitespace-nowrap ${
                activeTab === 'preference'
                  ? 'border-rose-700 text-rose-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {lang === 'bn' ? 'কাঙ্ক্ষিত পাত্র/পাত্রী পছন্দ' : 'Partner Preference'}
            </button>
          </div>

          {/* Tab 1: General & Education */}
          {activeTab === 'general' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-rose-700" />
                  <span>{lang === 'bn' ? 'শিক্ষাগত যোগ্যতা' : 'Educational Background'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 text-xs block">{lang === 'bn' ? 'সর্বোচ্চ শিক্ষাগত ডিগ্রি' : 'Highest Degree'}</span>
                    <span className="font-semibold text-slate-900">{profile.education?.degree || 'MBBS'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">{lang === 'bn' ? 'শিক্ষা প্রতিষ্ঠান' : 'Institution'}</span>
                    <span className="font-semibold text-slate-900">{profile.education?.institution || 'Dhaka Medical College'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">{lang === 'bn' ? 'শিক্ষা বিভাগ / স্তর' : 'Education Level'}</span>
                    <span className="font-semibold text-slate-900">{profile.education?.level || 'Masters / Post-Graduation'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-rose-700" />
                  <span>{lang === 'bn' ? 'পেশাগত বিবরণ' : 'Professional Information'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 text-xs block">{lang === 'bn' ? 'পদবি ও দায়িত্ব' : 'Designation'}</span>
                    <span className="font-semibold text-slate-900">{profile.profession?.designation || 'Medical Officer'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">{lang === 'bn' ? 'প্রতিষ্ঠানের নাম' : 'Organization'}</span>
                    <span className="font-semibold text-slate-900">{profile.profession?.organization || 'Evercare Hospital Dhaka'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">{lang === 'bn' ? 'কর্মসংস্থানের ধরন' : 'Employment Type'}</span>
                    <span className="font-semibold text-slate-900">{profile.profession?.employmentType || 'Permanent / Full-Time'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">{lang === 'bn' ? 'মাসিক আনুমানিক আয়' : 'Monthly Income'}</span>
                    <span className="font-semibold text-slate-900">{profile.profession?.monthlyIncomeRange || '৳ ৭০,০০০ - ১,০০,০০০'}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">
                  {lang === 'bn' ? 'নিজের সম্পর্কে সংক্ষিপ্ত বিবরণ' : 'About Myself'}
                </h4>
                <p className="text-slate-700 leading-relaxed italic">
                  "{profile.aboutMe || 'সহজ-সরল ও দ্বীনি মানসিকতাসম্পন্ন মার্জিত পাত্র/পাত্রী সন্ধান করছি।'}"
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Family Details */}
          {activeTab === 'family' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-rose-700" />
                  <span>{lang === 'bn' ? 'পারিবারিক অবস্থা ও পরিচিতি' : 'Family Status & Values'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 text-xs block">{lang === 'bn' ? 'পিতার পেশা' : 'Father’s Occupation'}</span>
                    <span className="font-semibold text-slate-900">{profile.family?.fatherOccupation || 'অবসরপ্রাপ্ত সরকারি কর্মকর্তা'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">{lang === 'bn' ? 'মাতার পেশা' : 'Mother’s Occupation'}</span>
                    <span className="font-semibold text-slate-900">{profile.family?.motherOccupation || 'গৃহিণী'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">{lang === 'bn' ? 'ভাইয়ের সংখ্যা' : 'Brothers'}</span>
                    <span className="font-semibold text-slate-900">{profile.family?.brothersCount ?? 1} {lang === 'bn' ? 'জন' : ''}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">{lang === 'bn' ? 'বোনের সংখ্যা' : 'Sisters'}</span>
                    <span className="font-semibold text-slate-900">{profile.family?.sistersCount ?? 1} {lang === 'bn' ? 'জন' : ''}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">{lang === 'bn' ? 'পারিবারিক মর্যাদা' : 'Family Status'}</span>
                    <span className="font-semibold text-slate-900">
                      {profile.family?.familyStatus === 'upper_middle_class' ? 'Upper Middle Class' : 'Middle Class'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">
                  {lang === 'bn' ? 'পরিবার সম্পর্কে অতিরিক্ত বিবরণ' : 'About Family'}
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  {profile.family?.aboutFamily || 'আমরা একটি মার্জিত, শিক্ষিত এবং পারিবারিক মূল্যবোধে বিশ্বাসী পরিবার।'}
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Religious & Lifestyle */}
          {activeTab === 'religious' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'bn' ? 'দ্বীনি ও জীবনধারা তথ্য' : 'Religious Beliefs & Daily Life'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 text-xs block">{lang === 'bn' ? 'নামাজ / প্রার্থনা' : 'Namaz / Prayer Habit'}</span>
                    <span className="font-semibold text-slate-900">
                      {profile.namazPrayerHabit === 'regular_5_times' ? 'নিয়মিত ৫ ওয়াক্ত নামাজি' : 'নিয়মিত নামাজ পড়েন'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">{lang === 'bn' ? 'পর্দা / পোশাকের ধরন' : 'Hijab / Beard'}</span>
                    <span className="font-semibold text-slate-900">
                      {profile.gender === 'female' ? 'হিজাব ও বোরকা পরেন' : 'সুন্নাহ মোতাবেক দাড়ি রয়েছে'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">{lang === 'bn' ? 'কোরআন তিলাওয়াত' : 'Quran Recitation'}</span>
                    <span className="font-semibold text-slate-900">শুদ্ধভাবে তিলাওয়াত করতে পারেন</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">{lang === 'bn' ? 'ধূমপান করেন কি না' : 'Smoking Habit'}</span>
                    <span className="font-semibold text-emerald-700">সম্পূর্ণ অধূমপায়ী (Non-Smoker)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Partner Preference */}
          {activeTab === 'preference' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-700" />
                  <span>{lang === 'bn' ? 'কাঙ্ক্ষিত জীবনসঙ্গীর বৈশিষ্ট্য' : 'Expected Life Partner Profile'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 text-xs block">{lang === 'bn' ? 'বয়স সীমা' : 'Age Range'}</span>
                    <span className="font-semibold text-slate-900">
                      {profile.partnerPreference?.ageMin || 22} - {profile.partnerPreference?.ageMax || 32} {lang === 'bn' ? 'বছর' : 'Years'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">{lang === 'bn' ? 'উচ্চতা পরিসীমা' : 'Height Range'}</span>
                    <span className="font-semibold text-slate-900">
                      {profile.partnerPreference?.heightMin || "5' 2\""} - {profile.partnerPreference?.heightMax || "6' 0\""}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">{lang === 'bn' ? 'শিক্ষাগত যোগ্যতা' : 'Expected Education'}</span>
                    <span className="font-semibold text-slate-900">গ্র্যাজুয়েশন / পোস্ট গ্র্যাজুয়েশন / ডাক্তার / ইঞ্জিনিয়ার</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">{lang === 'bn' ? 'পেশা' : 'Preferred Profession'}</span>
                    <span className="font-semibold text-slate-900">সরকারি চাকরি / বিসিএস / কর্পোরেট / শিক্ষকতা / সম্মানিত ব্যবসা</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Sticky Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            {lang === 'bn'
              ? 'নিরাপত্তা নিশ্চিত করতে কোনো ব্যক্তিগত তথ্য যাচাই ছাড়া কাউকে প্রদান করবেন না।'
              : 'Always verify identity before exchanging sensitive personal details.'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
            >
              {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>
            <button
              onClick={handleInterest}
              className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'আগ্রহ প্রকাশ' : 'Express Interest'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
