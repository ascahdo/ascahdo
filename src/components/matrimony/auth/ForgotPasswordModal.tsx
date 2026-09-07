import React, { useState } from 'react';
import { X, KeyRound, Phone, CheckCircle2, ArrowRight } from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
}) => {
  const { lang } = useMatrimonyLanguage();
  const [mobile, setMobile] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
        <div className="bg-slate-900 text-white p-6 pb-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-rose-400" />
            <h3 className="text-lg font-bold font-serif">
              {lang === 'bn' ? 'পাসওয়ার্ড পুনরুদ্ধার' : 'Reset Password'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">
              {lang === 'bn' ? 'ওটিপি (OTP) পাঠানো হয়েছে' : 'OTP Code Sent'}
            </h4>
            <p className="text-xs text-slate-600">
              {lang === 'bn'
                ? `আপনার নম্বর ${mobile} এ ৪-সংখ্যার পাসওয়ার্ড রিসেট ওটিপি কোড পাঠানো হয়েছে।`
                : `A 4-digit verification code has been sent to ${mobile}.`}
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="w-full py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs"
            >
              {lang === 'bn' ? 'লগইনে ফিরে যান' : 'Back to Login'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
            <p className="text-xs text-slate-600">
              {lang === 'bn'
                ? 'আপনার রেজিস্ট্রিকৃত মোবাইল নম্বরটি দিন। আমরা এসএমএসের মাধ্যমে ওটিপি কোড পাঠিয়ে দেব।'
                : 'Enter your registered mobile number to receive a reset code.'}
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
            >
              <span>{lang === 'bn' ? 'ওটিপি কোড পাঠান' : 'Send OTP Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
