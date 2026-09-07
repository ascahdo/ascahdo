import React from 'react';
import { useTranslation } from '../locales/i18nContext';
import { ShieldCheck, Phone, Mail, MapPin, Heart, ArrowRight, Smartphone, Download } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenWPTheme?: () => void;
  onOpenApkModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenWPTheme, onOpenApkModal }) => {
  const { t, isBn, isAr } = useTranslation();

  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800">
      {/* Top Banner / Callout */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 py-10 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              {isBn ? 'আপনার এলাকার সমাজকল্যাণ কার্যক্রমকে ডিজিটালাইজড করতে চান?' : 'Want to digitize community programs in your district?'}
            </h3>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl">
              {isBn ? 'এসকাডো প্ল্যাটফর্মে নতুন এনজিও নিবন্ধন ও দেশব্যাপী উপজেলা শাখা অনুমোদনের আবেদন চলমান।' : 'Apply now for NGO affiliation or local branch establishment under ASCAHDO.'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 shrink-0"
          >
            <span>{isBn ? 'শাখা অনুমোদনের আবেদন' : 'Apply for Branch Affiliation'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Col 1: About & Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl">
              A
            </div>
            <div>
              <span className="text-xl font-bold text-white">{isBn ? 'এসকাডো' : 'ASCAHDO'}</span>
              <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                Multi-NGO Integrated Platform
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed pr-6">
            {isBn
              ? 'এসকাডো একটি বহুমুখী সমন্বিত সমাজসেবা ও ক্ষমতায়ন প্ল্যাটফর্ম। শিক্ষা, জরুরি স্বাস্থ্যসেবা, যুব প্রশিক্ষণ, মাইক্রোক্রেডিট সমিতি, বি২বি বাণিজ্য ও নৈতিক সমাজ বিনির্মাণে প্রযুক্তিগত উৎকর্ষ।'
              : 'ASCAHDO is an enterprise-grade integrated multi-NGO management platform fostering education, emergency blood care, youth training, microfinance, B2B trade, and community welfare.'}
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              {isBn ? 'হেড অফিস: বসুরহাট, কোম্পানীগঞ্জ, নোয়াখালী | স্বচ্ছতা ও অডিট পরীক্ষিত' : 'Head Office: Basurhat, Companiganj, Noakhali | Audited & Verified'}
            </span>
          </div>
        </div>

        {/* Col 2: Services & Programs */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 border-l-2 border-emerald-500 pl-2.5">
            {isBn ? 'সেবা ও মডিউল' : 'Services & Modules'}
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('blood-bank')} className="hover:text-emerald-400 transition">
                {t.nav.bloodBank}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('school')} className="hover:text-emerald-400 transition">
                {t.nav.school}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('charity')} className="hover:text-emerald-400 transition font-semibold text-emerald-300">
                {isBn ? 'সাজেদা ইয়ুথ ফাউন্ডেশন (দান ও যাকাত)' : 'Sajeda Youth Foundation (Charity)'}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('volunteer')} className="hover:text-emerald-400 transition">
                {t.nav.volunteer}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('training')} className="hover:text-emerald-400 transition">
                {t.nav.technicalTraining} & LMS
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Economy & Community */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 border-l-2 border-emerald-500 pl-2.5">
            {isBn ? 'অর্থনীতি ও সমাজ' : 'Finance & Social'}
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('somiti')} className="hover:text-emerald-400 transition">
                {t.nav.somiti}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('marketplace')} className="hover:text-emerald-400 transition">
                {t.nav.marketplace} & B2B
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('real-estate')} className="hover:text-emerald-400 transition">
                {t.nav.realEstate}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('marriage')} className="hover:text-emerald-400 transition">
                {t.nav.marriageMedia}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('news')} className="hover:text-emerald-400 transition">
                {t.nav.news} & {t.nav.events}
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Central Contacts */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 border-l-2 border-emerald-500 pl-2.5">
            {isBn ? 'হেড অফিস ও যোগাযোগ' : 'Head Office & Contacts'}
          </h4>
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{isBn ? 'বসুরহাট, কোম্পানীগঞ্জ, নোয়াখালী, বাংলাদেশ' : 'Basurhat, Companiganj, Noakhali, Bangladesh'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold text-slate-200">01813817167</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ascahdo@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} ASCAHDO Multi-NGO Integrated Platform. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <button onClick={() => onNavigate('constitution')} className="hover:text-white transition text-emerald-400 font-semibold">{isBn ? 'সাংগঠনিক আইন ও গঠনতন্ত্র' : 'Constitution & By-Laws'}</button>
            <a
              href="/api/download-apk"
              download="ascado-platform-v1.0.0.apk"
              onClick={(e) => {
                if (onOpenApkModal) {
                  e.preventDefault();
                  onOpenApkModal();
                }
              }}
              className="hover:text-emerald-300 transition text-emerald-400 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isBn ? 'অ্যান্ড্রয়েড APK (.apk)' : 'Android APK (.apk)'}</span>
            </a>
            {onOpenWPTheme && (
              <button onClick={onOpenWPTheme} className="hover:text-sky-300 transition text-sky-400 font-bold flex items-center gap-1 cursor-pointer">
                <span className="font-serif">W</span>
                <span>{isBn ? 'ওয়ার্ডপ্রেস থিম (WP Theme)' : isAr ? 'قالب ووردبريس' : 'WordPress Theme'}</span>
              </button>
            )}
            <button onClick={() => onNavigate('about')} className="hover:text-white transition">Privacy Policy</button>
            <button onClick={() => onNavigate('about')} className="hover:text-white transition">Terms of Service</button>
            <button onClick={() => onNavigate('about')} className="hover:text-white transition">Audit & Transparency</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
