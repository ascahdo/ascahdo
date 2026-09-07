import React from 'react';
import {
  Heart,
  ShieldCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Eye,
  CheckCircle2,
  Bookmark,
  Send,
  Lock,
  Phone
} from 'lucide-react';
import { MatrimonyProfile } from '../../../types/matrimonyTypes';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimony } from '../../../context/MatrimonyContext';
import { useMatrimonyAuth } from '../../../context/MatrimonyAuthContext';
import { BANGLADESH_DISTRICTS } from '../../../data/bangladeshData';

interface ProfileCardProps {
  profile: MatrimonyProfile;
  onViewDetails: (profile: MatrimonyProfile) => void;
  onOpenLogin?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onViewDetails,
  onOpenLogin,
}) => {
  const { lang, t } = useMatrimonyLanguage();
  const { isAuthenticated } = useMatrimonyAuth();
  const {
    isShortlisted,
    toggleShortlist,
    sendInterest,
    getInterestStatus,
    currentProfile,
    calculateCompatibility
  } = useMatrimony();

  const district = BANGLADESH_DISTRICTS.find(d => d.id === profile.location?.district);
  const districtName = district ? (lang === 'bn' ? district.nameBn : district.nameEn) : profile.location?.district;

  const shortlisted = isShortlisted(profile.id);
  const interestStatus = getInterestStatus(profile.id);
  const matchScore = currentProfile ? calculateCompatibility(currentProfile, profile) : null;

  const handleInterest = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      onOpenLogin?.();
      return;
    }
    sendInterest(profile.id);
  };

  const handleShortlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      onOpenLogin?.();
      return;
    }
    toggleShortlist(profile.id);
  };

  return (
    <div
      onClick={() => onViewDetails(profile)}
      className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-rose-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Photo Stage */}
      <div className="relative aspect-[4/3] sm:aspect-[1/1] w-full overflow-hidden bg-slate-100">
        <img
          src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'}
          alt={profile.displayName}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs ${
                profile.gender === 'female'
                  ? 'bg-pink-600/90 text-white'
                  : 'bg-blue-600/90 text-white'
              }`}
            >
              {profile.gender === 'female' ? (lang === 'bn' ? 'পাত্রী' : 'Bride') : (lang === 'bn' ? 'পাত্র' : 'Groom')}
            </span>

            {profile.membershipTier === 'premium' && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold shadow-xs">
                VIP
              </span>
            )}
          </div>

          <button
            onClick={handleShortlist}
            className={`p-1.5 rounded-full backdrop-blur-md transition ${
              shortlisted
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-900/60 text-white hover:bg-rose-600'
            }`}
            title={shortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${shortlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Overlay Info on Photo */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <h3 className="font-bold text-sm sm:text-base font-serif truncate drop-shadow-sm">
              {profile.displayName || profile.fullName}
            </h3>
            {matchScore !== null && (
              <span className="text-[10px] bg-rose-600/90 text-white font-bold px-1.5 py-0.5 rounded shrink-0">
                {matchScore}% Match
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-200">
            <span className="font-mono text-[10px] text-slate-300">#{profile.id}</span>
            <span className="font-medium">
              {profile.age} {lang === 'bn' ? 'বছর' : 'Yrs'}, {profile.height}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Details Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2 text-xs text-slate-700">
          {/* Profession */}
          <div className="flex items-start gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" />
            <span className="truncate font-semibold text-slate-900">
              {profile.profession?.designation || profile.profession?.professionType}
              {profile.profession?.organization && ` (${profile.profession.organization})`}
            </span>
          </div>

          {/* Education */}
          <div className="flex items-start gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" />
            <span className="truncate text-slate-600">
              {profile.education?.level} {profile.education?.degree ? `- ${profile.education.degree}` : ''}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-700 shrink-0" />
            <span className="truncate text-slate-600">
              {districtName}{profile.location?.division ? `, ${profile.location.division.toUpperCase()}` : ''}
            </span>
          </div>
        </div>

        {/* Verification Status Strip */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          {profile.verificationStatus === 'verified' ? (
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'bn' ? 'এনআইডি ভেরিফাইড' : 'Verified'}</span>
            </span>
          ) : (
            <span className="text-slate-400 font-medium">
              {lang === 'bn' ? 'যাচাই প্রক্রিয়াধীন' : 'Pending Verification'}
            </span>
          )}

          <span className="text-slate-500 font-medium">
            {profile.maritalStatus === 'never_married'
              ? (lang === 'bn' ? 'অবিবাহিত' : 'Never Married')
              : profile.maritalStatus === 'divorced'
              ? (lang === 'bn' ? 'ডিভোর্সড' : 'Divorced')
              : (lang === 'bn' ? 'বিধবা/বিপত্নীক' : 'Widowed')}
          </span>
        </div>

        {/* Actions Button Row */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={e => {
              e.stopPropagation();
              onViewDetails(profile);
            }}
            className="py-2 px-3 rounded-xl border border-slate-200 hover:border-rose-300 bg-slate-50 hover:bg-rose-50/50 text-slate-800 text-xs font-semibold transition flex items-center justify-center gap-1"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600" />
            <span>{lang === 'bn' ? 'বায়োডাটা' : 'View'}</span>
          </button>

          <button
            onClick={handleInterest}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
              interestStatus === 'sent_pending' || interestStatus === 'sent_accepted'
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-700 hover:bg-rose-800 text-white shadow-xs'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {interestStatus === 'sent_pending'
                ? (lang === 'bn' ? 'আগ্রহ পাঠানো' : 'Sent')
                : interestStatus === 'sent_accepted'
                ? (lang === 'bn' ? 'গৃহীত' : 'Accepted')
                : (lang === 'bn' ? 'আগ্রহ প্রকাশ' : 'Send Interest')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
