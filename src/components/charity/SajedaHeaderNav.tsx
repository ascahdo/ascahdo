import React, { useState } from 'react';
import {
  Heart, ShieldCheck, Globe, Menu, X, PhoneCall,
  Search, Sparkles, User, LayoutDashboard, Calculator,
  Layers, Building2, HelpCircle, ArrowRight
} from 'lucide-react';
import { SYF_BRAND } from '../../data/sajedaCharityData';

interface SajedaHeaderNavProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  onOpenDonate?: (causeId?: string) => void;
  onOpenZakat?: () => void;
  onOpenVerify?: () => void;
  language?: 'bn' | 'en';
  onToggleLanguage?: () => void;
  onGlobalSearchClick?: () => void;
}

export const SajedaHeaderNav: React.FC<SajedaHeaderNavProps> = ({
  activeTab = 'home',
  onSelectTab,
  onOpenDonate,
  onOpenZakat,
  onOpenVerify,
  language = 'bn',
  onToggleLanguage,
  onGlobalSearchClick
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isBn = language === 'bn';

  const navLinks = [
    { id: 'home', labelBn: 'হোম', labelEn: 'Home' },
    { id: 'about', labelBn: 'আমাদের সম্পর্কে', labelEn: 'About' },
    { id: 'causes', labelBn: 'কজ / খাতসমূহ', labelEn: 'Causes' },
    { id: 'campaigns', labelBn: 'ক্যাম্পেইন', labelEn: 'Campaigns' },
    { id: 'impact', labelBn: 'প্রভাব ও পরিসংখ্যান', labelEn: 'Impact' },
    { id: 'stories', labelBn: 'সফলতার গল্প', labelEn: 'Stories' },
    { id: 'transparency', labelBn: 'আর্থিক স্বচ্ছতা', labelEn: 'Transparency' },
    { id: 'volunteer', labelBn: 'স্বেচ্ছাসেবক ফোরাম', labelEn: 'Volunteer' },
    { id: 'events', labelBn: 'কার্যক্রম', labelEn: 'Events' },
    { id: 'news', labelBn: 'সংবাদ', labelEn: 'News' },
    { id: 'gallery', labelBn: 'গ্যালারি', labelEn: 'Gallery' },
    { id: 'contact', labelBn: 'যোগাযোগ', labelEn: 'Contact' }
  ];

  const handleNavClick = (id: string) => {
    if (onSelectTab) onSelectTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs transition-all">
      {/* Top Micro Bar with accreditation & Helpline */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white text-[11px] py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-emerald-300 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isBn ? 'সাজেদা ইয়ুথ ফাউন্ডেশন • রেজি নং: ৮৮২১৯' : 'Sajeda Youth Foundation • Reg: 88219'}</span>
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300 text-[10px]">
              {isBn ? '“আপনার ছোট্ট সহযোগিতাই হতে পারে কারও জীবনের বড় পরিবর্তন”' : '“A small deed, a brighter future”'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href={`tel:${SYF_BRAND.helpline}`}
              className="flex items-center gap-1 text-emerald-300 hover:text-white font-mono font-bold transition"
            >
              <PhoneCall className="w-3 h-3" />
              <span>{SYF_BRAND.helpline}</span>
            </a>

            <button
              onClick={() => onOpenVerify && onOpenVerify()}
              className="hidden sm:flex items-center gap-1 text-amber-300 hover:text-amber-200 transition font-bold"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>{isBn ? 'রসিদ যাচাই' : 'Verify Receipt'}</span>
            </button>

            <button
              onClick={() => onToggleLanguage && onToggleLanguage()}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold transition"
            >
              <Globe className="w-3 h-3 text-emerald-400" />
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition">
            <Heart className="w-6 h-6 fill-amber-300 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base sm:text-lg text-slate-900 leading-none tracking-tight">
                {isBn ? SYF_BRAND.nameBn : SYF_BRAND.nameEn}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.2 rounded font-mono">
                {SYF_BRAND.shortName}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
              {isBn ? 'মানবতার পাশে, পরিবর্তনের পথে' : 'Beside Humanity, Leading Change'}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80'
                }`}
              >
                {isBn ? link.labelBn : link.labelEn}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Donate CTA */}
        <div className="flex items-center gap-2">
          {/* Search Trigger */}
          <button
            onClick={() => onGlobalSearchClick && onGlobalSearchClick()}
            className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition"
            title={isBn ? 'অনুসন্ধান করুন' : 'Global Search'}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Zakat Calculator button */}
          <button
            onClick={() => onOpenZakat && onOpenZakat()}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-700" />
            <span>{isBn ? 'যাকাত ক্যালকুলেটর' : 'Zakat Calc'}</span>
          </button>

          {/* Primary Donate Now Button */}
          <button
            onClick={() => onOpenDonate && onOpenDonate()}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white animate-pulse" />
            <span>{isBn ? 'অনুদান দিন' : 'Donate Now'}</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`p-2.5 rounded-xl text-left text-xs font-bold transition ${
                  activeTab === link.id
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-50 text-slate-700 hover:bg-emerald-50'
                }`}
              >
                {isBn ? link.labelBn : link.labelEn}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                if (onOpenZakat) onOpenZakat();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-700" />
              <span>যাকাত হিসাব করুন</span>
            </button>

            <button
              onClick={() => {
                if (onOpenVerify) onOpenVerify();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>রসিদ যাচাই</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
