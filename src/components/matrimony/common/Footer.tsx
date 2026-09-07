import React from 'react';
import {
  Heart,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Lock,
  Award,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';

interface FooterProps {
  setCurrentView: (view: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView, onOpenAdmin }) => {
  const { lang } = useMatrimonyLanguage();

  const handleNav = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800 text-center sm:text-left">
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-11 h-11 rounded-lg bg-rose-900/40 text-rose-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                {lang === 'bn' ? '১০০% এনআইডি ভেরিফাইড' : '100% NID Verified'}
              </h4>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'ভুয়া একাউন্ট মুক্ত নিরাপদ পরিবেশ' : 'Strict fake-profile defense'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-11 h-11 rounded-lg bg-amber-900/40 text-amber-400 flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                {lang === 'bn' ? 'কঠোর পারিবারিক গোপনীয়তা' : 'Family Privacy Guard'}
              </h4>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'অনুমতি ব্যতীত নম্বর গোপন থাকে' : 'Direct guardian approval required'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-11 h-11 rounded-lg bg-emerald-900/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                {lang === 'bn' ? 'মর্যাদাপূর্ণ ইসলামিক পরিবেশ' : 'Cultural Dignity'}
              </h4>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'সুন্নাহ ও পারিবারিক মূল্যবোধ' : 'Serious matrimonial focus only'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-11 h-11 rounded-lg bg-blue-900/40 text-blue-400 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                {lang === 'bn' ? '২৪/৭ সাপোর্ট হেল্পলাইন' : '24/7 Helpline Support'}
              </h4>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? '+৮৮০ ১৮১৩-৮১৭১৬৭' : '+880 1813-817167'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-slate-800 text-sm">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-700 flex items-center justify-center text-white shrink-0 shadow-md">
                <Heart className="w-5 h-5 fill-rose-100 text-rose-100" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white font-serif leading-tight">
                  {lang === 'bn' ? 'এসকাডো ম্যারেজ মিডিয়া' : 'Ascahdo Matrimony'}
                </span>
                <span className="text-xs font-medium tracking-wider text-rose-400 font-sans leading-tight">
                  ascahdo marriage media
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed pr-4">
              {lang === 'bn'
                ? 'এসকাডো ম্যারেজ মিডিয়া হলো বাংলাদেশ ও প্রবাসী পরিবারের জন্য শতভাগ বিশ্বস্ত, মর্যাদাপূর্ণ ও ইসলামিক নিয়মনীতি রক্ষা করে উপযুক্ত পাত্র-পাত্রী খোঁজার আধুনিক প্ল্যাটফর্ম।'
                : 'Ascahdo Marriage Media is the premier online matrimonial platform in Bangladesh for finding verified brides and grooms with complete privacy, family dignity, and ease.'}
            </p>

            {/* Offices */}
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  <strong>{lang === 'bn' ? 'ঢাকা অফিস:' : 'Dhaka Office:'}</strong> বাড়ি # ৪২, রোড # ১১, বনানী, ঢাকা - ১২১৩
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  <strong>{lang === 'bn' ? 'শাখা কার্যালয়:' : 'Branch Office:'}</strong> বসুরহাট, কোম্পানীগঞ্জ, নোয়াখালী
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                <a href="tel:+8801813817167" className="hover:text-white transition font-mono">+880 1813-817167</a>
                <span className="text-slate-600">/</span>
                <a
                  href="https://wa.me/8801813817167"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition flex items-center gap-1"
                >
                  <span>(WhatsApp)</span>
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                <a href="mailto:ascahdo@gmail.com" className="hover:text-white transition">ascahdo@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider text-rose-400">
              {lang === 'bn' ? 'গুরুত্বপূর্ণ লিংক' : 'Quick Navigation'}
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('brides')} className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-rose-400" />
                  {lang === 'bn' ? 'পাত্রী অনুসন্ধান' : 'Search Brides'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('grooms')} className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-rose-400" />
                  {lang === 'bn' ? 'পাত্র অনুসন্ধান' : 'Search Grooms'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('stories')} className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-rose-400" />
                  {lang === 'bn' ? 'সফল বিবাহের গল্প' : 'Happy Couples'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('packages')} className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-rose-400" />
                  {lang === 'bn' ? 'মেম্বারশিপ প্যাকেজ' : 'Subscription Plans'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('blog')} className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-rose-400" />
                  {lang === 'bn' ? 'পরামর্শ ও ব্লগ' : 'Advice & Blog'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories & Professions */}
          <div className="space-y-3">
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider text-rose-400">
              {lang === 'bn' ? 'জনপ্রিয় পেশাভিত্তিক বায়োডাটা' : 'Top Categories'}
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('brides')} className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  {lang === 'bn' ? 'ডাক্তার পাত্র-পাত্রী (MBBS/BDS)' : 'Doctor Biodatas (MBBS/BDS)'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('grooms')} className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  {lang === 'bn' ? 'বিসিএস ও সরকারি কর্মকর্তা' : 'BCS & Govt Officers'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('grooms')} className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  {lang === 'bn' ? 'ইঞ্জিনিয়ার ও সফটওয়্যার লিড' : 'Engineers & Tech Leads'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('brides')} className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  {lang === 'bn' ? 'প্রবাসী পাত্র-পাত্রী (UK/USA/Canada)' : 'NRB Expatriate Matches'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('grooms')} className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  {lang === 'bn' ? 'ব্যাংকার ও চার্টার্ড অ্যাকাউন্ট্যান্ট' : 'Bankers & Accountants'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust, Safety & Admin */}
          <div className="space-y-3">
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider text-rose-400">
              {lang === 'bn' ? 'নিরাপত্তা ও আইনি সহায়তা' : 'Safety & Legal'}
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('safety')} className="hover:text-white transition flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {lang === 'bn' ? 'নিরাপত্তা নীতিমালা' : 'Safety Guidelines'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faq')} className="hover:text-white transition flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {lang === 'bn' ? 'সাধারণ প্রশ্ন ও উত্তর (FAQ)' : 'Frequently Asked Questions'}
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => onOpenAdmin?.()}
                  className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-rose-700 text-[11px] text-rose-300 font-medium flex items-center gap-1.5 transition"
                >
                  <Lock className="w-3 h-3 text-rose-400" />
                  <span>{lang === 'bn' ? 'মডারেটর ও অ্যাডমিন পোর্টাল' : 'Admin & Moderator Portal'}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Payment Logos & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} এসকাডো ম্যারেজ মিডিয়া (Ascahdo Marriage Media). All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">
              {lang === 'bn' ? 'নিরাপদ পেমেন্ট চ্যানেল:' : 'Secure Payment Methods:'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-pink-950/80 text-pink-300 border border-pink-800 text-[10px] font-bold">bKash</span>
              <span className="px-2 py-0.5 rounded bg-orange-950/80 text-orange-300 border border-orange-800 text-[10px] font-bold">Nagad</span>
              <span className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800 text-[10px] font-bold">Rocket</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[10px] font-bold">Pubali Bank</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
