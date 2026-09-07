import React, { useState } from 'react';
import {
  User,
  Heart,
  ShieldCheck,
  Zap,
  Bookmark,
  Send,
  Lock,
  Phone,
  Eye,
  MessageSquare,
  Edit3,
  Upload,
  Settings,
  Sparkles,
  Award,
  Calendar,
  AlertTriangle,
  Receipt,
  LogOut,
  X
} from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimony } from '../../../context/MatrimonyContext';
import { useMatrimonyAuth } from '../../../context/MatrimonyAuthContext';
import { ProfileCard } from '../profiles/ProfileCard';
import { MatrimonyProfile } from '../../../types/matrimonyTypes';

interface UserDashboardProps {
  onClose: () => void;
  onViewProfile: (profile: MatrimonyProfile) => void;
  onOpenUpgrade: () => void;
  onOpenEditBiodata: () => void;
  onOpenVerification: () => void;
  onOpenPreferences: () => void;
  onOpenInvoice: (invoiceId: string) => void;
  onOpenConversations: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onClose,
  onViewProfile,
  onOpenUpgrade,
  onOpenEditBiodata,
  onOpenVerification,
  onOpenPreferences,
  onOpenInvoice,
  onOpenConversations,
}) => {
  const { lang } = useMatrimonyLanguage();
  const { currentUser, logoutUser } = useMatrimonyAuth();
  const {
    currentProfile,
    shortlists = [],
    interests = [],
    contactRequests = [],
    profiles = [],
    payments = [],
    respondToInterest,
    respondToContactRequest
  } = useMatrimony();

  const [activeTab, setActiveTab] = useState<'overview' | 'interests' | 'contacts' | 'shortlist' | 'invoices'>('overview');

  if (!currentUser || !currentProfile) return null;

  const shortlistedIds = (shortlists || []).map(s => typeof s === 'string' ? s : s?.profileId).filter(Boolean);
  const shortlistedProfiles = (profiles || []).filter(p => shortlistedIds.includes(p.id));
  
  const receivedInterests = (interests || []).filter(i => (i.receiverProfileId || (i as any).toProfileId) === currentProfile.id);
  const sentInterests = (interests || []).filter(i => (i.senderProfileId || (i as any).fromProfileId) === currentProfile.id);
  
  const receivedContacts = (contactRequests || []).filter(c => (c.receiverProfileId || (c as any).toProfileId) === currentProfile.id);
  const sentContacts = (contactRequests || []).filter(c => (c.senderProfileId || (c as any).fromProfileId) === currentProfile.id);

  const userPayments = (payments || []).filter(p => p.userId === currentUser.id || p.profileId === currentProfile.id);

  const isPremium = currentProfile.membershipTier === 'premium' || currentProfile.membershipTier === 'standard';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden border border-slate-200 my-4 max-h-[94vh] flex flex-col animate-in zoom-in-95">
        {/* Dashboard Top Navigation */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-700 text-white flex items-center justify-center font-bold text-base overflow-hidden border border-rose-500">
              {currentProfile.avatarUrl ? (
                <img src={currentProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                currentProfile.fullName.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base font-serif text-white">{currentProfile.displayName}</h3>
                <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-rose-300 border border-slate-700">
                  ID: {currentProfile.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {currentProfile.profession?.designation || 'Member'} •{' '}
                <span className="text-amber-400 font-semibold uppercase">{currentProfile.membershipTier} Member</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenUpgrade}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-extrabold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isPremium ? (lang === 'bn' ? 'প্যাকেজ রিনিউ' : 'Extend') : (lang === 'bn' ? 'আপগ্রেড করুন' : 'Upgrade')}</span>
            </button>
            <button
              onClick={() => {
                logoutUser();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 flex gap-3 sm:gap-6 overflow-x-auto text-xs sm:text-sm font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'overview' ? 'border-rose-700 text-rose-700' : 'border-transparent text-slate-600'
            }`}
          >
            {lang === 'bn' ? 'ড্যাশবোর্ড ওভারভিউ' : 'Overview'}
          </button>
          <button
            onClick={() => setActiveTab('interests')}
            className={`py-3.5 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'interests' ? 'border-rose-700 text-rose-700' : 'border-transparent text-slate-600'
            }`}
          >
            <span>{lang === 'bn' ? 'আগ্রহ তালিকা' : 'Interests'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
              {receivedInterests.length + sentInterests.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-3.5 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'contacts' ? 'border-rose-700 text-rose-700' : 'border-transparent text-slate-600'
            }`}
          >
            <span>{lang === 'bn' ? 'অভিভাবক নম্বর অনুরোধ' : 'Contact Requests'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {receivedContacts.length + sentContacts.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('shortlist')}
            className={`py-3.5 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'shortlist' ? 'border-rose-700 text-rose-700' : 'border-transparent text-slate-600'
            }`}
          >
            <span>{lang === 'bn' ? 'শর্টলিস্ট' : 'Shortlisted'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
              {shortlistedProfiles.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-3.5 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'invoices' ? 'border-rose-700 text-rose-700' : 'border-transparent text-slate-600'
            }`}
          >
            <span>{lang === 'bn' ? 'পেমেন্ট ও রশিদ' : 'Billing & Invoices'}</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Profile Completeness & Quick Actions Banner */}
              <div className="bg-gradient-to-r from-rose-900 to-slate-900 text-white rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-700 text-white text-xs font-bold">
                      {currentProfile.profileCompleteness || 85}% {lang === 'bn' ? 'সম্পূর্ণ' : 'Complete'}
                    </span>
                    {currentProfile.verificationStatus === 'verified' ? (
                      <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>{lang === 'bn' ? 'এনআইডি ভেরিফাইড' : 'NID Verified'}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-300 text-xs font-semibold">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{lang === 'bn' ? 'যাচাই বাকি রয়েছে' : 'Pending Verification'}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold font-serif">
                    {lang === 'bn' ? 'আপনার বায়োডাটার দৃশ্যমানতা ও কার্যকারিতা বাড়ান' : 'Boost Your Matrimonial Visibility'}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-xl">
                    {lang === 'bn'
                      ? 'সম্পূর্ণ তথ্য ও জাতীয় পরিচয়পত্র আপলোড থাকলে অভিভাবকগণ ৫ গুণ বেশি আগ্রহী হন।'
                      : 'Verified biodatas receive 5x higher response rates from potential matches.'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={onOpenEditBiodata}
                    className="px-4 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-rose-50 transition flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'বায়োডাটা এডিট' : 'Edit Biodata'}</span>
                  </button>
                  <button
                    onClick={onOpenVerification}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'এনআইডি আপলোড' : 'Verify NID'}</span>
                  </button>
                  <button
                    onClick={onOpenPreferences}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'সঙ্গী পছন্দ' : 'Preferences'}</span>
                  </button>
                </div>
              </div>

              {/* 4 Analytics Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1">
                  <span className="text-xs font-semibold text-rose-800">{lang === 'bn' ? 'আগ্রহ প্রকাশ' : 'Sent Interests'}</span>
                  <p className="text-2xl font-extrabold text-slate-900 font-serif">{sentInterests.length}</p>
                </div>
                <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100 space-y-1">
                  <span className="text-xs font-semibold text-pink-800">{lang === 'bn' ? 'প্রাপ্ত আগ্রহ' : 'Received'}</span>
                  <p className="text-2xl font-extrabold text-slate-900 font-serif">{receivedInterests.length}</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
                  <span className="text-xs font-semibold text-amber-800">{lang === 'bn' ? 'শর্টলিস্ট সংরক্ষিত' : 'Shortlisted'}</span>
                  <p className="text-2xl font-extrabold text-slate-900 font-serif">{shortlists.length}</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                  <span className="text-xs font-semibold text-emerald-800">{lang === 'bn' ? 'যোগাযোগ নম্বর' : 'Unlocked Contacts'}</span>
                  <p className="text-2xl font-extrabold text-slate-900 font-serif">
                    {currentProfile.contactViewsLeft || 10} {lang === 'bn' ? 'টি বাকি' : 'Left'}
                  </p>
                </div>
              </div>

              {/* Recommended Matches */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-base font-serif">
                    {lang === 'bn' ? 'আপনার জন্য উপযুক্ত প্রস্তাব (Recommended Matches)' : 'Recommended For You'}
                  </h4>
                  <span className="text-xs text-rose-700 font-bold">
                    {lang === 'bn' ? 'পছন্দের ভিত্তিতে মিল' : 'Based on preferences'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profiles
                    .filter(p => p.id !== currentProfile.id && p.gender !== currentProfile.gender)
                    .slice(0, 3)
                    .map(p => (
                      <ProfileCard key={p.id} profile={p} onViewDetails={onViewProfile} />
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: INTERESTS */}
          {activeTab === 'interests' && (
            <div className="space-y-6">
              {/* Received Interests */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm font-serif flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-700" />
                  <span>{lang === 'bn' ? 'আপনাকে পাঠানো আগ্রহ (Received Interests)' : 'Received Interests'}</span>
                </h4>
                {receivedInterests.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                    {lang === 'bn' ? 'এখনো কোনো আগ্রহ আসেনি।' : 'No received interests yet.'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {receivedInterests.map(item => {
                      const fromProf = profiles.find(p => p.id === item.fromProfileId);
                      return (
                        <div
                          key={item.id}
                          className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={fromProf?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                              alt="Sender"
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                            <div>
                              <h5 className="font-bold text-slate-900 text-sm">
                                {fromProf?.displayName || item.fromProfileId}
                              </h5>
                              <p className="text-xs text-slate-500">
                                {fromProf?.age} Yrs • {fromProf?.profession?.designation || 'Professional'} • {fromProf?.location?.district}
                              </p>
                              <span className="text-[11px] font-mono text-slate-400">{item.createdAt}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {fromProf && (
                              <button
                                onClick={() => onViewProfile(fromProf)}
                                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                              >
                                {lang === 'bn' ? 'বায়োডাটা দেখুন' : 'View Biodata'}
                              </button>
                            )}
                            {item.status === 'pending' ? (
                              <>
                                <button
                                  onClick={() => respondToInterest(item.id, 'accepted')}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                                >
                                  {lang === 'bn' ? 'সম্মত' : 'Accept'}
                                </button>
                                <button
                                  onClick={() => respondToInterest(item.id, 'declined')}
                                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-semibold"
                                >
                                  {lang === 'bn' ? 'প্রত্যাখ্যান' : 'Decline'}
                                </button>
                              </>
                            ) : (
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                  item.status === 'accepted'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {item.status}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sent Interests */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm font-serif flex items-center gap-2">
                  <Send className="w-4 h-4 text-rose-700" />
                  <span>{lang === 'bn' ? 'আপনার পাঠানো আগ্রহ (Sent Interests)' : 'Sent Interests'}</span>
                </h4>
                {sentInterests.length === 0 ? (
                  <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                    {lang === 'bn' ? 'আপনি এখনো কোনো বায়োডাটায় আগ্রহ প্রকাশ করেননি।' : 'No sent interests yet.'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sentInterests.map(item => {
                      const toProf = profiles.find(p => p.id === item.toProfileId);
                      return (
                        <div
                          key={item.id}
                          className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={toProf?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                              alt="Recipient"
                              className="w-10 h-10 rounded-xl object-cover"
                            />
                            <div>
                              <h5 className="font-bold text-slate-900 text-sm">{toProf?.displayName || item.toProfileId}</h5>
                              <span className="text-[11px] font-mono text-slate-400">{item.createdAt}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                item.status === 'accepted'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {item.status}
                            </span>
                            {toProf && (
                              <button
                                onClick={() => onViewProfile(toProf)}
                                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50"
                              >
                                {lang === 'bn' ? 'দেখুন' : 'View'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: CONTACTS */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm font-serif flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'bn' ? 'অভিভাবকের নম্বর ও যোগাযোগ তালিকা' : 'Direct Guardian Contact Requests'}</span>
              </h4>

              {receivedContacts.length === 0 && sentContacts.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                  {lang === 'bn' ? 'কোনো নম্বর অনুরোধের রেকর্ড নেই।' : 'No contact requests recorded.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {sentContacts.map(req => {
                    const prof = profiles.find(p => p.id === req.toProfileId);
                    return (
                      <div
                        key={req.id}
                        className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{prof?.displayName || req.toProfileId}</span>
                            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase">
                              {req.status}
                            </span>
                          </div>
                          {req.status === 'approved' && (
                            <p className="text-xs font-mono text-emerald-900 font-bold mt-1">
                              📞 {lang === 'bn' ? 'অভিভাবকের ফোন:' : 'Guardian Phone:'} {prof?.guardianContact || '01711-223344'}
                            </p>
                          )}
                        </div>

                        {prof && (
                          <button
                            onClick={() => onViewProfile(prof)}
                            className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold hover:bg-emerald-100"
                          >
                            {lang === 'bn' ? 'বায়োডাটা দেখুন' : 'View Profile'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: SHORTLIST */}
          {activeTab === 'shortlist' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm font-serif">
                {lang === 'bn' ? 'আপনার সংরক্ষিত বায়োডাটা তালিকা' : 'Your Shortlisted Biodatas'}
              </h4>
              {shortlistedProfiles.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                  {lang === 'bn' ? 'কোনো বায়োডাটা শর্টলিস্ট করা হয়নি।' : 'No profiles shortlisted yet.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shortlistedProfiles.map(p => (
                    <ProfileCard key={p.id} profile={p} onViewDetails={onViewProfile} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: INVOICES */}
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm font-serif flex items-center gap-2">
                <Receipt className="w-4 h-4 text-rose-700" />
                <span>{lang === 'bn' ? 'পেমেন্ট হিস্ট্রি ও অফিসিয়াল ইনভয়েস' : 'Payment History & Receipts'}</span>
              </h4>

              {userPayments.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                  {lang === 'bn' ? 'কোনো পেমেন্ট ইনভয়েস পাওয়া যায়নি।' : 'No invoice history found.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {userPayments.map(inv => (
                    <div
                      key={inv.id}
                      className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">{inv.invoiceNumber || `INV-${inv.id.slice(-6)}`}</span>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                            {inv.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {inv.planName || 'Membership'} • {inv.date || inv.createdAt?.slice(0, 10)} • {(inv.paymentMethod || inv.method || 'bKash').toUpperCase()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 text-sm font-serif">৳ {inv.amountBdt || inv.amount || 0}</span>
                        <button
                          onClick={() => onOpenInvoice(inv.id)}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 text-rose-900 rounded-xl text-xs font-bold transition"
                        >
                          {lang === 'bn' ? 'রশিদ দেখুন' : 'View Receipt'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
