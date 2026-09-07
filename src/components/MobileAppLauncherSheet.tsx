import React, { useState } from 'react';
import { useTranslation } from '../locales/i18nContext';
import { useAuth } from '../context/AuthContext';
import {
  X, Search, Home, HeartPulse, Heart, GraduationCap,
  BookOpen, Users, Landmark, ShoppingBag, Building2,
  HeartHandshake, Scale, FileText, PhoneCall, Stethoscope,
  ShieldCheck, LogIn, LogOut, ExternalLink, Phone, MessageSquare,
  Sparkles, Megaphone, Smartphone, CheckCircle, ChevronRight,
  ArrowUpRight, Share2, Layers, Download
} from 'lucide-react';

interface MobileAppLauncherSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenDonationModal: () => void;
  onOpenBloodSOS: () => void;
  onOpenAdManager?: () => void;
  onOpenWPTheme?: () => void;
  onOpenApkModal?: () => void;
}

export const MobileAppLauncherSheet: React.FC<MobileAppLauncherSheetProps> = ({
  isOpen,
  onClose,
  currentView,
  onNavigate,
  onOpenDonationModal,
  onOpenBloodSOS,
  onOpenAdManager,
  onOpenWPTheme,
  onOpenApkModal
}) => {
  const { isBn, language, setLanguage } = useTranslation();
  const { user, logout, setShowAuthModal, setAuthModalMode } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const appModules = [
    // 1. Emergency & Healthcare
    {
      id: 'blood-bank',
      titleBn: 'ব্লাড ব্যাংক ও SOS',
      titleEn: 'Blood Bank & SOS',
      categoryBn: 'জরুরি সেবা',
      categoryEn: 'Emergency',
      icon: HeartPulse,
      color: 'bg-rose-500 text-white',
      badge: 'জরুরি',
      route: 'blood-bank'
    },
    {
      id: 'charity',
      titleBn: 'সাজেদা ইয়ুথ ফাউন্ডেশন',
      titleEn: 'SYF Charity & Zakat',
      categoryBn: 'জরুরি সেবা',
      categoryEn: 'Emergency',
      icon: Heart,
      color: 'bg-emerald-600 text-white',
      badge: 'যাকাত ও দান',
      route: 'charity'
    },
    {
      id: 'donation',
      titleBn: 'অনুদান ক্যাম্পেইন',
      titleEn: 'Donation Campaigns',
      categoryBn: 'জরুরি সেবা',
      categoryEn: 'Emergency',
      icon: Sparkles,
      color: 'bg-teal-600 text-white',
      route: 'donation'
    },
    {
      id: 'medical-courses',
      titleBn: 'মেডিকেল কোর্স',
      titleEn: 'Medical Courses',
      categoryBn: 'জরুরি সেবা',
      categoryEn: 'Emergency',
      icon: Stethoscope,
      color: 'bg-cyan-600 text-white',
      badge: 'ভর্তি',
      route: 'medical-courses'
    },

    // 2. Education & Human Resource
    {
      id: 'school',
      titleBn: 'এসকাডো একাডেমি',
      titleEn: 'Ascahdo Academy',
      categoryBn: 'শিক্ষা ও প্রশিক্ষণ',
      categoryEn: 'Education',
      icon: GraduationCap,
      color: 'bg-indigo-600 text-white',
      route: 'school'
    },
    {
      id: 'training',
      titleBn: 'আইটি ও কারিগরি প্রশিক্ষণ',
      titleEn: 'Skill Training LMS',
      categoryBn: 'শিক্ষা ও প্রশিক্ষণ',
      categoryEn: 'Education',
      icon: BookOpen,
      color: 'bg-blue-600 text-white',
      route: 'training'
    },
    {
      id: 'volunteer',
      titleBn: 'স্বেচ্ছাসেবক ফোরাম',
      titleEn: 'Volunteer Network',
      categoryBn: 'শিক্ষা ও প্রশিক্ষণ',
      categoryEn: 'Education',
      icon: Users,
      color: 'bg-purple-600 text-white',
      route: 'volunteer'
    },

    // 3. Economy & Enterprise
    {
      id: 'somiti',
      titleBn: 'সমিতি ও ক্ষুদ্র সঞ্চয়',
      titleEn: 'Somiti Micro-finance',
      categoryBn: 'অর্থনীতি ও ব্যবসা',
      categoryEn: 'Enterprise',
      icon: Landmark,
      color: 'bg-emerald-700 text-white',
      route: 'somiti'
    },
    {
      id: 'marketplace',
      titleBn: 'হালাল মার্কেটপ্লেস',
      titleEn: 'Halal Marketplace',
      categoryBn: 'অর্থনীতি ও ব্যবসা',
      categoryEn: 'Enterprise',
      icon: ShoppingBag,
      color: 'bg-amber-600 text-white',
      route: 'marketplace'
    },
    {
      id: 'real-estate',
      titleBn: 'জমি ও আবাসন সেবা',
      titleEn: 'Real Estate Portal',
      categoryBn: 'অর্থনীতি ও ব্যবসা',
      categoryEn: 'Enterprise',
      icon: Building2,
      color: 'bg-orange-600 text-white',
      route: 'real-estate'
    },
    {
      id: 'marriage',
      titleBn: 'পাত্র-পাত্রী মিডিয়া',
      titleEn: 'Matrimonial Media',
      categoryBn: 'অর্থনীতি ও ব্যবসা',
      categoryEn: 'Enterprise',
      icon: HeartHandshake,
      color: 'bg-pink-600 text-white',
      route: 'marriage'
    },

    // 4. Governance & Network
    {
      id: 'branches',
      titleBn: 'শাখা ও পরিচালনা কমিটি',
      titleEn: 'Branches & Committee',
      categoryBn: 'সংগঠন ও অন্যান্য',
      categoryEn: 'Governance',
      icon: Building2,
      color: 'bg-slate-800 text-white',
      route: 'branches'
    },
    {
      id: 'constitution',
      titleBn: 'সাংগঠনিক আইন ও গঠনতন্ত্র',
      titleEn: 'Constitution & Laws',
      categoryBn: 'সংগঠন ও অন্যান্য',
      categoryEn: 'Governance',
      icon: Scale,
      color: 'bg-slate-700 text-white',
      route: 'constitution'
    },
    {
      id: 'news',
      titleBn: 'সংবাদ ও নোটিশ',
      titleEn: 'News & Notices',
      categoryBn: 'সংগঠন ও অন্যান্য',
      categoryEn: 'Governance',
      icon: FileText,
      color: 'bg-sky-700 text-white',
      route: 'news'
    },
    {
      id: 'contact',
      titleBn: 'যোগাযোগ ও হেল্পলাইন',
      titleEn: 'Helpline & Contact',
      categoryBn: 'সংগঠন ও অন্যান্য',
      categoryEn: 'Governance',
      icon: PhoneCall,
      color: 'bg-emerald-800 text-white',
      route: 'contact'
    }
  ];

  const filteredModules = appModules.filter(m => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return m.titleBn.toLowerCase().includes(q) ||
           m.titleEn.toLowerCase().includes(q) ||
           m.categoryBn.toLowerCase().includes(q) ||
           m.categoryEn.toLowerCase().includes(q);
  });

  const handleModuleClick = (route: string) => {
    onNavigate(route);
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ASCAHDO - এসকাডো মাল্টি-এনজিও প্ল্যাটফর্ম',
          text: 'শিক্ষা, রক্তদান, অনুদান ও সমাজকল্যাণ প্ল্যাটফর্ম এসকাডো ব্যবহার করুন।',
          url: window.location.href
        });
      } catch (e) {
        // ignore share cancellation
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end md:hidden animate-in fade-in duration-200">
      {/* Dark overlay */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-Up App Sheet */}
      <div className="relative bg-slate-50 rounded-t-[32px] border-t border-slate-200/80 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in slide-in-from-bottom duration-300">

        {/* Top Pull Bar & Close */}
        <div className="p-4 pb-2 flex items-center justify-between border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-800 flex items-center justify-center text-white font-black text-lg shadow-sm">
              A
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {isBn ? 'এসকাডো অ্যাপ পোর্টাল' : 'ASCAHDO App Hub'}
              </h3>
              <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>{isBn ? 'সমন্বিত সমাজসেবা প্ল্যাটফর্ম' : 'Integrated Welfare System'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switch */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                  language === 'bn' ? 'bg-emerald-700 text-white' : 'text-slate-600'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                  language === 'en' ? 'bg-emerald-700 text-white' : 'text-slate-600'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                  language === 'ar' ? 'bg-emerald-700 text-white' : 'text-slate-600'
                }`}
              >
                العربية
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-12">

          {/* User Account Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-md flex items-center justify-between">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-500 text-slate-950 font-black text-base flex items-center justify-center border-2 border-emerald-300">
                  {(user.fullName || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white">{user.fullName || user.email}</span>
                    <span className="px-1.5 py-0.2 bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-[9px] font-bold rounded-md">
                      {user.role === 'SUPER_ADMIN' ? 'Admin' : 'Member'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {user.role === 'SUPER_ADMIN' ? 'অ্যাডমিন কন্ট্রোল সেন্টার' : 'ব্যবহারকারী ড্যাশবোর্ড'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                  <LogIn className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">
                    {isBn ? 'আসসালামু আলাইকুম' : 'Welcome to ASCAHDO'}
                  </h4>
                  <p className="text-[10px] text-slate-300">
                    {isBn ? 'লগইন করে সব সুবিধা উপভোগ করুন' : 'Sign in to access all features'}
                  </p>
                </div>
              </div>
            )}

            <div>
              {user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onNavigate(user.role === 'SUPER_ADMIN' ? 'admin' : 'dashboard');
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition"
                  >
                    {isBn ? 'ড্যাশবোর্ড' : 'Dashboard'}
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    title="Logout"
                    className="p-1.5 rounded-xl bg-white/10 text-rose-300 hover:bg-white/20 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setShowAuthModal(true);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition shadow"
                >
                  {isBn ? 'লগইন' : 'Login'}
                </button>
              )}
            </div>
          </div>

          {/* Android APK Download Card */}
          <div className="p-3 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 border border-emerald-500/40 rounded-2xl flex items-center justify-between shadow-sm text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs">
                <Smartphone className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-black text-white">{isBn ? 'অ্যান্ড্রয়েড APK (.apk)' : 'Android APK (.apk)'}</p>
                  <span className="px-1.5 py-0.2 bg-emerald-400 text-slate-950 text-[9px] font-black rounded">v1.0.0</span>
                </div>
                <p className="text-[10px] text-emerald-200/80">{isBn ? 'সরাসরি মোবাইলে ইনস্টলযোগ্য প্যাকেজ' : 'Direct installable mobile package'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href="/api/download-apk"
                download="ascado-platform-v1.0.0.apk"
                className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1"
                title="Download APK"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isBn ? 'APK' : 'APK'}</span>
              </a>
              {onOpenApkModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenApkModal();
                  }}
                  className="px-2 py-1.5 bg-white/10 hover:bg-white/20 text-emerald-300 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  {isBn ? 'গাইড' : 'Guide'}
                </button>
              )}
            </div>
          </div>

          {/* WordPress Theme Quick Launcher Card */}
          {onOpenWPTheme && (
            <div className="p-3 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-serif font-black text-sm shadow-xs">
                  W
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">{isBn ? 'ওয়ার্ডপ্রেস থিম (WP Theme)' : 'WordPress Theme'}</p>
                  <p className="text-[10px] text-slate-600">{isBn ? '১-ক্লিকে অফিশিয়াল WP থিম জিপ ডাউনলোড' : 'Download official WP theme ZIP'}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenWPTheme();
                }}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer shrink-0"
              >
                {isBn ? 'ডাউনলোড' : 'Download'}
              </button>
            </div>
          )}

          {/* Quick Search App Field */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={isBn ? 'সেবা বা কার্যক্রম খুঁজুন (যেমন: রক্ত, স্কুল, যাকাত)...' : 'Search modules & services...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Emergency Quick Action Banners */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                onOpenBloodSOS();
                onClose();
              }}
              className="p-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 text-white flex items-center gap-2.5 shadow-sm active:scale-95 transition"
            >
              <div className="p-2 rounded-xl bg-white/20">
                <HeartPulse className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-rose-200 block uppercase">জরুরি সেবা</span>
                <span className="text-xs font-black block leading-tight">ব্লাড SOS পাঠান</span>
              </div>
            </button>

            <button
              onClick={() => {
                onOpenDonationModal();
                onClose();
              }}
              className="p-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 text-white flex items-center gap-2.5 shadow-sm active:scale-95 transition"
            >
              <div className="p-2 rounded-xl bg-white/20">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-emerald-200 block uppercase">মানবিক সহায়তা</span>
                <span className="text-xs font-black block leading-tight">দান / যাকাত দিন</span>
              </div>
            </button>
          </div>

          {/* Application Grid Launcher */}
          <div>
            <div className="flex items-center justify-between mb-2.5 px-1">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isBn ? 'সকল সেবা ও কার্যক্রম' : 'All Services & Portals'}</span>
              </h4>
              <span className="text-[10px] font-bold text-slate-500">
                {filteredModules.length} টি মডিউল
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {filteredModules.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentView === item.route;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleModuleClick(item.route)}
                    className={`flex flex-col items-center justify-start p-2.5 rounded-2xl border transition-all active:scale-90 text-center relative ${
                      isActive
                        ? 'bg-emerald-50 border-emerald-400 shadow-xs'
                        : 'bg-white border-slate-100 hover:border-slate-200 shadow-2xs'
                    }`}
                  >
                    {item.badge && (
                      <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[8px] font-black shadow-xs">
                        {item.badge}
                      </span>
                    )}

                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs mb-1.5 ${item.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <span className="text-[11px] font-bold text-slate-800 leading-tight line-clamp-2">
                      {isBn ? item.titleBn : item.titleEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Helplines & Direct Support */}
          <div className="p-3.5 rounded-2xl bg-slate-100/90 border border-slate-200 space-y-2.5">
            <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
              {isBn ? 'সরাসরি হেল্পলাইন ও সাহায্য' : 'Direct Helpline & Support'}
            </h5>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:+8809612000111"
                className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 text-slate-800 flex items-center gap-2 text-xs font-bold shadow-2xs"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="text-left leading-tight">
                  <span className="text-[10px] text-slate-500 block">২৪/৭ কল সেন্টার</span>
                  <span className="text-xs font-black text-emerald-800">কল করুন</span>
                </div>
              </a>

              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 text-slate-800 flex items-center gap-2 text-xs font-bold shadow-2xs"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div className="text-left leading-tight">
                  <span className="text-[10px] text-slate-500 block">লাইভ চ্যাট</span>
                  <span className="text-xs font-black text-teal-800">WhatsApp</span>
                </div>
              </a>
            </div>

            {/* Adsterra / Ads quick trigger & Share app */}
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
              {onOpenAdManager && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdManager();
                  }}
                  className="text-emerald-700 font-bold flex items-center gap-1 hover:underline"
                >
                  <Megaphone className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isBn ? 'বিজ্ঞাপন দিন / Adsterra' : 'Ads & Monetization'}</span>
                </button>
              )}

              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={handleShareApp}
                  className="text-slate-600 font-bold flex items-center gap-1 hover:text-slate-900"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isBn ? 'অ্যাপ শেয়ার করুন' : 'Share App'}</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
