import React from 'react';
import { Home, Search, MessageSquare, User, UserPlus } from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimonyAuth } from '../../../context/MatrimonyAuthContext';
import { useMatrimony } from '../../../context/MatrimonyContext';

interface MobileBottomNavProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenSearch: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  setCurrentView,
  onOpenSearch,
  onOpenLogin,
  onOpenRegister,
}) => {
  const { lang, t } = useMatrimonyLanguage();
  const { isAuthenticated } = useMatrimonyAuth();
  const { getUnreadMessageCount } = useMatrimony();

  const unreadCount = getUnreadMessageCount ? getUnreadMessageCount() : 0;

  const handleNav = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1 px-2 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
    >
      <div className="grid grid-cols-5 items-center text-center">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-md transition ${
            currentView === 'home' ? 'text-rose-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight font-medium">{t('nav.home')}</span>
        </button>

        {/* 2. Search */}
        <button
          type="button"
          onClick={onOpenSearch}
          className={`flex flex-col items-center justify-center py-1 rounded-md transition ${
            currentView === 'search' || currentView === 'brides' || currentView === 'grooms'
              ? 'text-rose-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight font-medium">
            {lang === 'bn' ? 'অনুসন্ধান' : 'Search'}
          </span>
        </button>

        {/* 3. CENTER PROMINENT: Detailed Registration */}
        <div className="flex flex-col items-center justify-center relative -top-3">
          <button
            type="button"
            onClick={onOpenRegister}
            className="w-12 h-12 rounded-full bg-rose-700 hover:bg-rose-800 active:scale-95 text-white flex flex-col items-center justify-center shadow-lg shadow-rose-700/30 ring-4 ring-white transition"
            title={lang === 'bn' ? 'ফ্রি বায়োডাটা তৈরি করুন' : 'Register Biodata'}
          >
            <UserPlus className="w-5 h-5" />
          </button>
          <span className="text-[10px] tracking-tight font-bold text-rose-800 mt-0.5 whitespace-nowrap">
            {lang === 'bn' ? '+ বায়োডাটা' : '+ Register'}
          </span>
        </div>

        {/* 4. Messages */}
        <button
          type="button"
          onClick={() => {
            if (isAuthenticated) {
              handleNav('dashboard');
            } else {
              onOpenLogin();
            }
          }}
          className={`relative flex flex-col items-center justify-center py-1 rounded-md transition ${
            currentView === 'dashboard' ? 'text-rose-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 mb-0.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight font-medium">
            {lang === 'bn' ? 'মেসেজ' : 'Messages'}
          </span>
        </button>

        {/* 5. Profile / Account */}
        <button
          type="button"
          onClick={() => {
            if (isAuthenticated) {
              handleNav('dashboard');
            } else {
              onOpenLogin();
            }
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-md transition ${
            currentView === 'dashboard' ? 'text-rose-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight font-medium">
            {isAuthenticated
              ? (lang === 'bn' ? 'প্রোফাইল' : 'Profile')
              : (lang === 'bn' ? 'লগইন' : 'Login')}
          </span>
        </button>
      </div>
    </nav>
  );
};
