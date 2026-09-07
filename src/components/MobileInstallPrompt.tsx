import React, { useState, useEffect } from 'react';
import { useTranslation } from '../locales/i18nContext';
import { Download, Smartphone, X, CheckCircle, Sparkles, Share2 } from 'lucide-react';

export const MobileInstallPrompt: React.FC = () => {
  const { isBn } = useTranslation();
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if user already dismissed recently
    const dismissed = localStorage.getItem('ascado_pwa_dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 86400000 * 3) {
      return;
    }

    // Check if already in standalone / PWA mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // If mobile device, show after 3 seconds anyway with instructions
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    let timer: any;
    if (isMobile) {
      timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3500);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const [showInstructions, setShowInstructions] = useState(false);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('ascado_pwa_dismissed', Date.now().toString());
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <>
      <div className="md:hidden mx-3 my-2 p-3 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-lg border border-emerald-500/40 flex items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-5 h-5 animate-bounce" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-white truncate">
                {isBn ? 'এসকাডো মোবাইল অ্যাপ' : 'ASCAHDO Mobile App'}
              </span>
              <span className="px-1.5 py-0.2 bg-emerald-400 text-slate-950 font-black text-[9px] rounded-full">
                অফিশিয়াল
              </span>
            </div>
            <p className="text-[10px] text-emerald-200 line-clamp-1">
              {isBn ? '১ ক্লিকে ফোনে অ্যাপ হিসেবে সেভ করুন' : 'Add to Home Screen for instant access'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 text-xs font-black shadow transition active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{isBn ? 'ইনস্টল করুন' : 'Install App'}</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* In-App Installation Guide Modal when native prompt is delayed */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-in fade-in">
          <div className="bg-slate-900 text-white rounded-3xl border border-emerald-500/40 p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in slide-in-from-bottom-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">
                    {isBn ? 'অ্যান্ড্রয়েড ফোনে অ্যাপ ইনস্টল করার নিয়ম' : 'How to Install on Mobile'}
                  </h4>
                  <p className="text-[10px] text-emerald-300 font-bold">
                    {isBn ? '১০০% নিশ্চিত • কোনো এরর আসবে না' : 'Official Google PWA • 0 Errors'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-200">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  ১
                </span>
                <div>
                  <p className="font-bold text-white">
                    {isBn ? 'ব্রাউজারের ৩ ডট মেনু (⋮) এ চাপ দিন' : 'Tap Chrome 3-dots menu (⋮)'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isBn ? 'আপনার মোবাইল স্ক্রিনের উপরে ডান কোণায় তিনটি ডট (⋮) চিহ্ন পাবেন।' : 'Look at the top-right corner of Chrome.'}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  ২
                </span>
                <div>
                  <p className="font-bold text-emerald-300">
                    {isBn ? '"Install app" বা "Add to Home screen" এ চাপ দিন' : 'Tap "Install app" or "Add to Home Screen"'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isBn ? 'মেনুতে "হোম স্ক্রিনে যোগ করুন" বা "অ্যাপ ইনস্টল করুন" অপশনটিতে ট্যাপ করুন।' : 'Select Add to Home screen to create native app icon.'}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  ৩
                </span>
                <div>
                  <p className="font-bold text-white">
                    {isBn ? 'অ্যাপ চালু করুন' : 'Launch from Home Screen'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isBn ? 'সাথে সাথে আপনার ফোনের হোম স্ক্রিনে ASCAHDO অ্যাপ আইকন যুক্ত হয়ে যাবে। এক ক্লিকে ফুল স্ক্রিনে অ্যাপের মতো চলবে!' : 'The app icon appears on your phone home screen.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-[11px] leading-relaxed">
              <span className="font-bold text-amber-300 block mb-0.5">
                💡 {isBn ? '"Problem parsing package" এরর সমাধান:' : 'Fix for Parse Error:'}
              </span>
              {isBn
                ? 'ব্রাউজার থেকে সরাসরি APK নামালে ফোনের অ্যান্ড্রয়েড ভার্সন বা সিকিউরিটির কারণে "Problem parsing" দেখা দিতে পারে। এই ৩-ধাপের PWA ইনস্টলেশনে কোনো এরর আসবে না এবং ১০০% নিখুঁতভাবে চলবে।'
                : 'Direct raw APK downloads may trigger Android OS parse errors. The 3-step PWA install above is 100% error-free and supported natively on all Android devices.'}
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition"
            >
              {isBn ? 'বুঝেছি, ইনস্টল করছি' : 'Got it, let me install'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
