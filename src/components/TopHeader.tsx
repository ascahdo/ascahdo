import React from 'react';
import { useTranslation } from '../locales/i18nContext';
import { useAuth } from '../context/AuthContext';
import { Phone, HeartPulse, Globe, UserCheck, Shield, LogOut, LayoutDashboard, Smartphone, Download } from 'lucide-react';

interface TopHeaderProps {
  onOpenBloodSOS: () => void;
  onNavigate?: (view: string) => void;
  onOpenAdManager?: () => void;
  onOpenWPTheme?: () => void;
  onOpenApkModal?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenBloodSOS, onNavigate, onOpenAdManager, onOpenWPTheme, onOpenApkModal }) => {
  const { language, setLanguage, isBn, isAr } = useTranslation();
  const { user, logout, setShowAuthModal, setAuthModalMode } = useAuth();

  const handleNavigate = (view: string) => {
    if (typeof onNavigate === 'function') {
      onNavigate(view);
    }
  };

  return (
    <header className="bg-slate-900 text-slate-200 text-xs py-1.5 px-3 sm:px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Emergency SOS & Helpline */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <button
            onClick={onOpenBloodSOS}
            className="flex items-center gap-1 sm:gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full animate-pulse transition cursor-pointer text-[11px] sm:text-xs"
          >
            <HeartPulse className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{isBn ? 'জরুরি রক্ত SOS' : 'Blood SOS'}</span>
          </button>

          <a
            href="tel:+8809612000111"
            className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 text-[11px] sm:text-xs"
          >
            <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{isBn ? 'জাতীয় হেল্পলাইন:' : 'Helpline:'}</span>
            <span className="font-semibold text-white tracking-wider">+880 9612 000111</span>
          </a>

          <span className="hidden xl:inline-block text-slate-600">|</span>

          <span className="hidden xl:inline-block text-slate-400 truncate max-w-[320px]">
            {isBn ? 'গণপ্রজাতন্ত্রী বাংলাদেশ অনুমোদিত সমন্বিত সমাজকল্যাণ প্ল্যাটফর্ম' : 'Govt. Approved Integrated Social Welfare Platform'}
          </span>
        </div>

        {/* Right: Language Switcher, User state, Admin quick link */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Language Switcher: BN | EN | AR */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 shrink-0">
            <button
              onClick={() => setLanguage('bn')}
              className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium transition ${
                language === 'bn' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium transition ${
                language === 'en' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium transition ${
                language === 'ar' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              العربية
            </button>
          </div>

          {/* Android APK Download Button */}
          <a
            href="/api/download-apk"
            download="ascado-platform-v1.0.0.apk"
            onClick={(e) => {
              if (onOpenApkModal) {
                e.preventDefault();
                onOpenApkModal();
              }
            }}
            className="hidden sm:flex items-center gap-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-emerald-100 border border-emerald-500/40 px-2 py-0.5 sm:py-1 rounded text-[11px] sm:text-xs font-bold transition cursor-pointer shadow-xs shrink-0"
            title={isBn ? 'অ্যান্ড্রয়েড APK সরাসরি ডাউনলোড (.apk)' : 'Download Android APK'}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{isBn ? 'Android APK' : 'Android APK'}</span>
            <span className="hidden md:inline px-1 py-0.2 text-[8px] bg-emerald-600 text-white rounded font-bold">.apk</span>
          </a>

          {/* WordPress Theme Export / Integration Button */}
          {onOpenWPTheme && (
            <button
              onClick={onOpenWPTheme}
              className="hidden md:flex items-center gap-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 hover:text-sky-200 border border-sky-500/40 px-2 py-0.5 sm:py-1 rounded text-[11px] sm:text-xs font-bold transition cursor-pointer shadow-xs shrink-0"
              title={isBn ? 'ওয়ার্ডপ্রেস থিম হিসেবে ডাউনলোড ও কনফিগারেশন' : isAr ? 'تصدير قالب ووردبريس' : 'WordPress Theme Exporter & Sync'}
            >
              <span className="font-serif font-black text-sky-400 shrink-0">W</span>
              <span>{isBn ? 'ওয়ার্ডপ্রেস থিম' : isAr ? 'قالب ووردبريس' : 'WP Theme'}</span>
            </button>
          )}

          {/* Quick Ad Management Button */}
          {onOpenAdManager && (
            <button
              onClick={onOpenAdManager}
              className="hidden lg:flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/40 px-2 py-0.5 sm:py-1 rounded text-[11px] sm:text-xs font-bold transition cursor-pointer shrink-0"
              title={isBn ? 'বিজ্ঞাপন দিন / পরিচালনা করুন' : 'Place Ad / Manage'}
            >
              <span className="shrink-0">📢</span>
              <span>{isBn ? 'বিজ্ঞাপন দিন' : 'Ads'}</span>
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={() => handleNavigate(user.role === 'SUPER_ADMIN' ? 'admin' : 'dashboard')}
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold px-2.5 py-0.5 sm:py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-emerald-500/30 transition text-[11px] sm:text-xs shrink-0 cursor-pointer"
                title={user.role === 'SUPER_ADMIN' ? (isBn ? 'সুপার অ্যাডমিন প্যানেল' : 'Super Admin Panel') : 'Dashboard'}
              >
                {user.role === 'SUPER_ADMIN' ? (
                  <>
                    <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-emerald-300 whitespace-nowrap">{isBn ? 'সুপার অ্যাডমিন' : 'Super Admin'}</span>
                  </>
                ) : (
                  <>
                    <LayoutDashboard className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span className="truncate max-w-[80px] whitespace-nowrap">{(user.fullName || user.email || 'User').split(' ')[0]}</span>
                  </>
                )}
              </button>

              <button
                onClick={logout}
                title="Logout"
                className="text-slate-400 hover:text-rose-400 p-1 transition shrink-0 cursor-pointer"
              >
                <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setShowAuthModal(true);
                }}
                className="text-slate-300 hover:text-white font-medium px-1.5 sm:px-2 py-0.5 transition text-[11px] sm:text-xs"
              >
                {isBn ? 'লগইন' : 'Login'}
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setShowAuthModal(true);
                }}
                className="hidden sm:inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded transition text-[11px] sm:text-xs"
              >
                {isBn ? 'রেজিস্ট্রেশন' : 'Register'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
