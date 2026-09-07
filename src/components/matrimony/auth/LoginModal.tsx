import React, { useState } from 'react';
import { X, Lock, Phone, ArrowRight, UserCheck, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimonyAuth } from '../../../context/MatrimonyAuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
  onOpenForgot: () => void;
  onSuccessLogin?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onOpenRegister,
  onOpenForgot,
  onSuccessLogin,
}) => {
  const { lang, t } = useMatrimonyLanguage();
  const { loginUser, loginAsDemoUser } = useMatrimonyAuth();

  const [identifier, setIdentifier] = useState('01712-345678');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      const res = loginUser(identifier, password);
      setLoading(false);
      if (res.success) {
        onClose();
        onSuccessLogin?.();
      } else {
        setErrorMsg(lang === 'bn' ? (res.messageBn || 'লগইন ব্যর্থ হয়েছে') : (res.messageEn || 'Login failed'));
      }
    }, 600);
  };

  const handleDemoSelect = (profileId: string) => {
    loginAsDemoUser(profileId);
    onClose();
    onSuccessLogin?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 pb-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-rose-400 uppercase">
              {lang === 'bn' ? 'সদস্য লগইন' : 'Member Login'}
            </span>
            <h3 className="text-xl font-bold font-serif text-white">
              {lang === 'bn' ? 'আপনার অ্যাকাউন্টে প্রবেশ করুন' : 'Welcome Back'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Roles Instant Login Strip */}
        <div className="p-4 bg-rose-50/70 border-b border-rose-100 space-y-2">
          <div className="text-[11px] font-bold text-rose-950 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-rose-700" />
            <span>{lang === 'bn' ? 'এক ক্লিকে ডেমো লগইন:' : 'Instant Demo Login:'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoSelect('MM-100101')}
              className="p-2 rounded-xl bg-white hover:bg-rose-100/60 border border-rose-200 text-left transition flex items-center gap-2 text-xs"
            >
              <div className="w-6 h-6 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center justify-center text-[10px]">
                ♀
              </div>
              <div className="truncate">
                <p className="font-bold text-slate-900 truncate">ডা. ফারহানা</p>
                <p className="text-[10px] text-slate-500">পাত্রী (MBBS)</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSelect('MM-100102')}
              className="p-2 rounded-xl bg-white hover:bg-rose-100/60 border border-rose-200 text-left transition flex items-center gap-2 text-xs"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                ♂
              </div>
              <div className="truncate">
                <p className="font-bold text-slate-900 truncate">ইঞ্জি. তানভীর</p>
                <p className="text-[10px] text-slate-500">পাত্র (CSE/Lead)</p>
              </div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {lang === 'bn' ? 'মোবাইল নম্বর / ইমেইল' : 'Mobile Number or Email'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="017XXXXXXXX or email"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenForgot();
                }}
                className="text-xs text-rose-700 hover:underline font-medium"
              >
                {lang === 'bn' ? 'ভুলে গেছেন?' : 'Forgot Password?'}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 transition p-0.5 rounded"
                title={showPassword ? (lang === 'bn' ? 'পাসওয়ার্ড লুকান' : 'Hide Password') : (lang === 'bn' ? 'পাসওয়ার্ড দেখুন' : 'Show Password')}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-rose-600" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-rose-700 hover:bg-rose-800 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-700/20 transition flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <>
                <span>{t('btn.login')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-600">
          <span>{lang === 'bn' ? 'অ্যাকাউন্ট নেই?' : "Don't have an account?"} </span>
          <button
            onClick={() => {
              onClose();
              onOpenRegister();
            }}
            className="font-bold text-rose-700 hover:underline"
          >
            {lang === 'bn' ? 'ফ্রি বায়োডাটা তৈরি করুন' : 'Create Free Biodata'}
          </button>
        </div>
      </div>
    </div>
  );
};
