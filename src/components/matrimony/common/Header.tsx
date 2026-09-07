import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  Search,
  User,
  ShieldCheck,
  Menu,
  X,
  Bell,
  Globe,
  Lock,
  ChevronDown,
  Sparkles,
  Award,
  Layers,
  MoreVertical,
  PhoneCall,
  Share2,
  FileText,
  HelpCircle,
  CheckCircle2,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimonyAuth } from '../../../context/MatrimonyAuthContext';
import { useMatrimony } from '../../../context/MatrimonyContext';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenAdmin?: () => void;
  onOpenAdminPortal?: () => void;
  onOpenNotifications: () => void;
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenLogin,
  onOpenRegister,
  onOpenAdmin,
  onOpenAdminPortal,
  onOpenNotifications,
  currentView,
  setCurrentView,
}) => {
  const handleOpenAdmin = onOpenAdmin || onOpenAdminPortal || (() => {});
  const { lang, setLang, t } = useMatrimonyLanguage();
  const { currentUser, isAuthenticated, logoutUser, loginAsDemoUser } = useMatrimonyAuth();
  const { currentProfile, notifications = [], getUnreadMessageCount } = useMatrimony();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close more menu when clicked outside
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    if (moreMenuOpen) {
      document.addEventListener('click', handleDocumentClick);
    }
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [moreMenuOpen]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const unreadNotifs = (notifications || []).filter(n => n && !n.isRead).length;
  const unreadMsgs = getUnreadMessageCount ? getUnreadMessageCount() : 0;

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      {/* Top micro bar for helpline & quick switcher */}
      <div className="bg-rose-950 text-rose-100 text-xs py-1.5 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
          <span className="flex items-center gap-1.5 font-medium truncate text-[11px] sm:text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="truncate">{lang === 'bn' ? 'জরুরি হেল্পলাইন: +৮৮০ ১৮১৩-৮১৭১৬৭' : 'Helpline: +880 1813-817167'}</span>
          </span>
          <span className="hidden md:inline text-rose-300/60">|</span>
          <span className="hidden lg:inline text-rose-200 text-xs truncate">
            {lang === 'bn' ? '১০০% এনআইডি ও পরিবার-যাচাইকৃত দ্বীনি ও মার্জিত পাত্র-পাত্রী সন্ধান' : '100% NID & Family Verified Biodata'}
          </span>
        </div>

        {/* Super Admin badge */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOpenAdmin}
            className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs bg-rose-900/90 hover:bg-rose-800 text-rose-100 px-2.5 sm:px-3 py-1 rounded-md border border-rose-700/80 transition font-semibold"
            title="Super Admin Control Panel"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="hidden sm:inline">{lang === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</span>
            <span className="sm:hidden">{lang === 'bn' ? 'অ্যাডমিন' : 'Admin'}</span>
          </button>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4 max-w-full">
        {/* Brand Title */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left focus-visible:outline-rose-600 rounded-sm group flex items-center gap-2 sm:gap-2.5 shrink-0 min-w-0 py-0.5"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center text-white shadow-xs shrink-0">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-rose-100 text-rose-100 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col min-w-0 justify-center">
            <span className="text-sm sm:text-lg font-bold tracking-tight text-rose-950 font-serif truncate leading-tight">
              {lang === 'bn' ? 'এসকাডো ম্যারেজ মিডিয়া' : 'Ascahdo Matrimony'}
            </span>
            <span className="text-[9px] sm:text-[10.5px] font-medium tracking-wider text-rose-700 font-sans leading-tight truncate">
              ascahdo marriage media
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition whitespace-nowrap ${
              currentView === 'home' ? 'text-rose-700 bg-rose-50/80' : 'text-slate-700 hover:text-rose-700 hover:bg-rose-50/40'
            }`}
          >
            {t('nav.home')}
          </button>
          <button
            onClick={() => handleNavClick('brides')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition whitespace-nowrap ${
              currentView === 'brides' ? 'text-rose-700 bg-rose-50/80' : 'text-slate-700 hover:text-rose-700 hover:bg-rose-50/40'
            }`}
          >
            {t('nav.brides')}
          </button>
          <button
            onClick={() => handleNavClick('grooms')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition whitespace-nowrap ${
              currentView === 'grooms' ? 'text-rose-700 bg-rose-50/80' : 'text-slate-700 hover:text-rose-700 hover:bg-rose-50/40'
            }`}
          >
            {t('nav.grooms')}
          </button>
          <button
            onClick={() => handleNavClick('stories')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition whitespace-nowrap ${
              currentView === 'stories' ? 'text-rose-700 bg-rose-50/80' : 'text-slate-700 hover:text-rose-700 hover:bg-rose-50/40'
            }`}
          >
            {t('nav.stories')}
          </button>
          <button
            onClick={() => handleNavClick('packages')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition whitespace-nowrap ${
              currentView === 'packages' ? 'text-rose-700 bg-rose-50/80' : 'text-slate-700 hover:text-rose-700 hover:bg-rose-50/40'
            }`}
          >
            {t('nav.packages')}
          </button>
          <button
            onClick={() => handleNavClick('blog')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition whitespace-nowrap ${
              currentView === 'blog' ? 'text-rose-700 bg-rose-50/80' : 'text-slate-700 hover:text-rose-700 hover:bg-rose-50/40'
            }`}
          >
            {t('nav.blog')}
          </button>
        </nav>

        {/* Primary Actions & Utilities */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition shrink-0"
            title="Switch language"
          >
            <Globe className="w-3.5 h-3.5 text-rose-600" />
            <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-1.5 sm:p-2 rounded-full text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
            title="Search Profiles"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Notifications Trigger */}
          {isAuthenticated && (
            <button
              onClick={onOpenNotifications}
              className="relative p-1.5 sm:p-2 rounded-full text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
              title="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadNotifs > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-rose-600 text-white rounded-full text-[9px] sm:text-[10px] font-bold flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </button>
          )}

          {/* User Auth Buttons or Profile Trigger */}
          {isAuthenticated ? (
            <div className="flex items-center shrink-0">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`flex items-center gap-1.5 py-1 px-1.5 sm:px-3 rounded-lg border transition ${
                  currentView === 'dashboard'
                    ? 'border-rose-600 bg-rose-50 text-rose-900'
                    : 'border-slate-200 hover:border-rose-300 text-slate-800'
                }`}
              >
                <img
                  src={currentProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                  alt="Profile"
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-rose-200"
                />
                <span className="text-xs font-semibold hidden md:inline truncate max-w-[110px]">
                  {currentProfile?.displayName || 'My Profile'}
                </span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                onClick={onOpenLogin}
                className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-rose-700 py-1.5 px-2 sm:px-3 rounded-md transition whitespace-nowrap"
              >
                {t('btn.login')}
              </button>
              <button
                onClick={onOpenRegister}
                className="hidden sm:inline-flex text-xs sm:text-sm font-semibold bg-rose-700 hover:bg-rose-800 text-white py-1.5 px-3 sm:px-4 rounded-lg shadow-xs transition whitespace-nowrap"
              >
                {t('btn.register')}
              </button>
            </div>
          )}

          {/* Three-Dot Menu (More Options) Dropdown */}
          <div className="relative shrink-0" ref={moreMenuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMoreMenuOpen(prev => !prev);
              }}
              className={`p-1.5 sm:p-2 rounded-full cursor-pointer transition ${
                moreMenuOpen
                  ? 'bg-rose-100 text-rose-800 ring-2 ring-rose-300'
                  : 'text-slate-700 hover:text-rose-700 hover:bg-rose-50'
              }`}
              title={lang === 'bn' ? 'আরও অপশন' : 'More options'}
              aria-label="More options"
              aria-expanded={moreMenuOpen}
            >
              <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
            </button>

            {/* Dropdown Menu Modal/Card */}
            {moreMenuOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-2 w-[calc(100vw-32px)] max-w-72 sm:max-w-80 bg-white rounded-2xl shadow-2xl border border-rose-100 py-3 px-2 z-50 text-xs text-slate-800 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 border-b border-slate-100 mb-2 flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {lang === 'bn' ? 'কুইক মেনু ও অপশন' : 'Quick Menu & Options'}
                  </span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 font-semibold px-2 py-0.5 rounded-full">
                    {lang === 'bn' ? 'শর্টকাট' : 'Shortcuts'}
                  </span>
                </div>

                {/* Quick Demo Role Switcher */}
                <div className="mb-2 p-2 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 px-1">
                    <UserCheck className="w-3.5 h-3.5 text-rose-600" />
                    <span>{lang === 'bn' ? 'ডেমো অ্যাকাউন্ট পরিবর্তন:' : 'Switch Demo Account:'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        loginAsDemoUser('MM-100101');
                        setMoreMenuOpen(false);
                      }}
                      className="p-1.5 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 text-left flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0"></span>
                      <span className="truncate text-[11px]">{lang === 'bn' ? 'ডা. ফারহানা (পাত্রী)' : 'Dr. Farhana (Bride)'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        loginAsDemoUser('MM-100102');
                        setMoreMenuOpen(false);
                      }}
                      className="p-1.5 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 text-left flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                      <span className="truncate text-[11px]">{lang === 'bn' ? 'ইঞ্জি. তানভীর (পাত্র)' : 'Tanvir (Groom)'}</span>
                    </button>
                  </div>
                </div>

                {/* Action Items List */}
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      handleOpenAdmin();
                      setMoreMenuOpen(false);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-rose-50 text-slate-800 hover:text-rose-900 font-semibold flex items-center justify-between transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700 group-hover:bg-rose-200">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-xs">{lang === 'bn' ? 'সুপার অ্যাডমিন প্যানেল' : 'Super Admin Panel'}</p>
                        <p className="text-[10px] text-slate-500 font-normal">{lang === 'bn' ? 'বায়োডাটা ভেরিফিকেশন ও পরিসংখ্যান' : 'Verify biodata & stats'}</p>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 -rotate-90 text-slate-400 group-hover:text-rose-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLang(lang === 'bn' ? 'en' : 'bn');
                      setMoreMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center justify-between transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                        <Globe className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{lang === 'bn' ? 'ভাষা পরিবর্তন (Language)' : 'Switch Language'}</span>
                    </div>
                    <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                      {lang === 'bn' ? 'English' : 'বাংলা'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center justify-between transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                        <Share2 className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{lang === 'bn' ? 'লিংক শেয়ার করুন' : 'Share Website Link'}</span>
                    </div>
                    {copiedLink ? (
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {lang === 'bn' ? 'কপি হয়েছে' : 'Copied'}
                      </span>
                    ) : null}
                  </button>

                  <a
                    href="tel:+8801813817167"
                    onClick={() => setMoreMenuOpen(false)}
                    className="w-full px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 transition"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">{lang === 'bn' ? '২৪/৭ সাপোর্ট হেল্পলাইন' : '24/7 Helpline'}</p>
                      <p className="text-[10px] text-slate-500 font-mono">+৮৮০ ১৮১৩-৮১৭১৬৭</p>
                    </div>
                  </a>

                  {isAuthenticated && (
                    <button
                      type="button"
                      onClick={() => {
                        logoutUser();
                        setMoreMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-700 flex items-center gap-2.5 transition pt-2 border-t border-slate-100 cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <span className="font-bold">{lang === 'bn' ? 'লগআউট করুন' : 'Log Out'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 sm:p-2 lg:hidden text-slate-700 hover:text-rose-700 rounded-lg hover:bg-rose-50 shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-rose-100 px-4 pt-2 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`p-2.5 rounded-lg text-sm font-medium text-left ${currentView === 'home' ? 'bg-rose-50 text-rose-700 font-semibold' : 'text-slate-700'}`}
            >
              {t('nav.home')}
            </button>
            <button
              onClick={() => handleNavClick('brides')}
              className={`p-2.5 rounded-lg text-sm font-medium text-left ${currentView === 'brides' ? 'bg-rose-50 text-rose-700 font-semibold' : 'text-slate-700'}`}
            >
              {t('nav.brides')}
            </button>
            <button
              onClick={() => handleNavClick('grooms')}
              className={`p-2.5 rounded-lg text-sm font-medium text-left ${currentView === 'grooms' ? 'bg-rose-50 text-rose-700 font-semibold' : 'text-slate-700'}`}
            >
              {t('nav.grooms')}
            </button>
            <button
              onClick={() => handleNavClick('stories')}
              className={`p-2.5 rounded-lg text-sm font-medium text-left ${currentView === 'stories' ? 'bg-rose-50 text-rose-700 font-semibold' : 'text-slate-700'}`}
            >
              {t('nav.stories')}
            </button>
            <button
              onClick={() => handleNavClick('packages')}
              className={`p-2.5 rounded-lg text-sm font-medium text-left ${currentView === 'packages' ? 'bg-rose-50 text-rose-700 font-semibold' : 'text-slate-700'}`}
            >
              {t('nav.packages')}
            </button>
            <button
              onClick={() => handleNavClick('blog')}
              className={`p-2.5 rounded-lg text-sm font-medium text-left ${currentView === 'blog' ? 'bg-rose-50 text-rose-700 font-semibold' : 'text-slate-700'}`}
            >
              {t('nav.blog')}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full py-2.5 px-4 bg-rose-700 text-white rounded-lg font-medium text-sm text-center"
                >
                  {t('btn.dashboard')}
                </button>
                <button
                  onClick={logoutUser}
                  className="w-full py-2 px-4 text-slate-600 hover:text-rose-700 text-sm font-medium text-center"
                >
                  {t('btn.logout')}
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
                  className="flex-1 py-2.5 px-4 border border-slate-300 rounded-lg text-slate-800 text-sm font-medium text-center"
                >
                  {t('btn.login')}
                </button>
                <button
                  onClick={() => { onOpenRegister(); setMobileMenuOpen(false); }}
                  className="flex-1 py-2.5 px-4 bg-rose-700 text-white rounded-lg text-sm font-medium text-center"
                >
                  {t('btn.register')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
