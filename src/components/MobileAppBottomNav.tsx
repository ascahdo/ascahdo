import React from 'react';
import { useTranslation } from '../locales/i18nContext';
import { useAuth } from '../context/AuthContext';
import {
  Home, HeartPulse, Heart, Grid, User,
  LayoutDashboard, ShieldCheck, Sparkles, LogIn
} from 'lucide-react';

interface MobileAppBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenDonationModal: () => void;
  onOpenBloodSOS: () => void;
  onOpenServicesDrawer: () => void;
}

export const MobileAppBottomNav: React.FC<MobileAppBottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenDonationModal,
  onOpenBloodSOS,
  onOpenServicesDrawer
}) => {
  const { isBn } = useTranslation();
  const { user, setShowAuthModal, setAuthModalMode } = useAuth();

  const handleVibrate = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch (e) {
        // ignore
      }
    }
  };

  const handleNavClick = (view: string) => {
    handleVibrate();
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProfileClick = () => {
    handleVibrate();
    if (user) {
      onNavigate(user.role === 'SUPER_ADMIN' ? 'admin' : 'dashboard');
    } else {
      setAuthModalMode('login');
      setShowAuthModal(true);
    }
  };

  const isHome = currentView === 'home';
  const isBlood = currentView === 'blood-bank';
  const isDashboard = currentView === 'dashboard' || currentView === 'admin';
  const isCharity = currentView === 'charity' || currentView === 'sajeda-charity' || currentView === 'donation' || currentView === 'donations';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 pt-1 pb-[max(0.4rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-around relative max-w-lg mx-auto">

        {/* 1. Home Tab */}
        <button
          onClick={() => handleNavClick('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all duration-200 active:scale-90 ${
            isHome ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 transition-transform ${isHome ? 'scale-110 stroke-[2.5]' : 'stroke-[1.75]'}`} />
            {isHome && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            )}
          </div>
          <span className={`text-[10px] mt-1 font-semibold tracking-tight ${isHome ? 'font-black text-emerald-800' : ''}`}>
            {isBn ? 'হোম' : 'Home'}
          </span>
        </button>

        {/* 2. Blood Bank & SOS Tab */}
        <button
          onClick={() => {
            handleVibrate();
            onOpenBloodSOS();
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all duration-200 active:scale-90 ${
            isBlood ? 'text-rose-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <div className="p-1 rounded-full bg-rose-50 text-rose-600">
              <HeartPulse className="w-5 h-5 stroke-[2.2] animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-rose-600 text-white text-[8px] font-black rounded-full shadow-xs">
              SOS
            </span>
          </div>
          <span className="text-[10px] mt-0.5 font-semibold text-rose-700 tracking-tight">
            {isBn ? 'রক্ত SOS' : 'Blood SOS'}
          </span>
        </button>

        {/* 3. Center Elevated FAB: DONATE NOW */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            onClick={() => {
              handleVibrate();
              onOpenDonationModal();
            }}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 text-white shadow-[0_6px_20px_rgba(5,150,105,0.45)] border-[3px] border-white flex flex-col items-center justify-center transition-transform active:scale-90 cursor-pointer group"
          >
            <Heart className="w-6 h-6 fill-white group-hover:scale-110 transition-transform animate-pulse" />
            <span className="text-[8px] font-black tracking-tighter uppercase -mt-0.5">
              {isBn ? 'দান' : 'DONATE'}
            </span>
          </button>
        </div>

        {/* 4. All Services App Drawer Launcher */}
        <button
          onClick={() => {
            handleVibrate();
            onOpenServicesDrawer();
          }}
          className="flex flex-col items-center justify-center flex-1 py-1 px-1 text-slate-500 hover:text-slate-800 transition-all duration-200 active:scale-90"
        >
          <div className="relative p-1 rounded-xl bg-slate-100 text-slate-700">
            <Grid className="w-4 h-4 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>
          <span className="text-[10px] mt-0.5 font-semibold tracking-tight text-slate-700">
            {isBn ? 'সকল সেবা' : 'Services'}
          </span>
        </button>

        {/* 5. Profile / Dashboard Tab */}
        <button
          onClick={handleProfileClick}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all duration-200 active:scale-90 ${
            isDashboard ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            {user ? (
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white text-[10px] font-black flex items-center justify-center border-2 border-emerald-300 shadow-xs">
                {(user.fullName || user.email || 'U').charAt(0).toUpperCase()}
              </div>
            ) : (
              <User className={`w-5 h-5 transition-transform ${isDashboard ? 'scale-110 stroke-[2.5]' : 'stroke-[1.75]'}`} />
            )}
            {isDashboard && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            )}
          </div>
          <span className={`text-[10px] mt-1 font-semibold tracking-tight ${isDashboard ? 'font-black text-emerald-800' : ''}`}>
            {user ? (isBn ? 'একাউন্ট' : 'Account') : (isBn ? 'লগইন' : 'Login')}
          </span>
        </button>

      </div>
    </div>
  );
};
