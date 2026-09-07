import React from 'react';
import {
  Heart, ShieldCheck, Mail, Phone, MapPin,
  Facebook, Youtube, Instagram, Linkedin, MessageSquare, ArrowUp
} from 'lucide-react';
import { SYF_BRAND } from '../../data/sajedaCharityData';

interface SajedaFooterProps {
  onNavigate?: (tab: string) => void;
  onOpenDonate?: () => void;
}

export const SajedaFooter: React.FC<SajedaFooterProps> = ({
  onNavigate,
  onOpenDonate
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800 text-left">
          
          {/* Column 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
                <Heart className="w-6 h-6 fill-white text-emerald-100" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">{SYF_BRAND.nameBn}</h3>
                <span className="text-xs font-mono font-bold text-emerald-400 block">{SYF_BRAND.nameEn}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium max-w-sm">
              “{SYF_BRAND.sloganBn}” — সুবিধাবঞ্চিত, অসহায় ও দুর্যোগকবলিত মানুষের জীবনে ইতিবাচক ও টেকসই পরিবর্তন আনতে নিবেদিত একটি আন্তর্জাতিক মানের মানবিক অলাভজনক প্রতিষ্ঠান।
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{SYF_BRAND.addressBn}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>হটলাইন: {SYF_BRAND.helpline}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>ইমেইল: {SYF_BRAND.email}</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              <a href={SYF_BRAND.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-emerald-600 text-slate-300 hover:text-white transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={SYF_BRAND.youtube} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-rose-600 text-slate-300 hover:text-white transition">
                <Youtube className="w-4 h-4" />
              </a>
              <a href={SYF_BRAND.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-pink-600 text-slate-300 hover:text-white transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={`https://wa.me/${SYF_BRAND.whatsapp}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-emerald-500 text-slate-300 hover:text-white transition">
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">প্রয়োজনীয় লিঙ্ক</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-300">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-emerald-400 transition cursor-pointer">
                  হোম পেজ (Home)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-emerald-400 transition cursor-pointer">
                  আমাদের সম্পর্কে (About Us)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('causes')} className="hover:text-emerald-400 transition cursor-pointer">
                  সেবামূলক খাতসমূহ (Causes)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('campaigns')} className="hover:text-emerald-400 transition cursor-pointer">
                  চলমান ক্যাম্পেইন (Campaigns)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('impact')} className="hover:text-emerald-400 transition cursor-pointer">
                  প্রভাব ও বাস্তব গল্প (Real Stories)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('events')} className="hover:text-emerald-400 transition cursor-pointer">
                  আসন্ন ইভেন্ট (Events)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-emerald-400 transition cursor-pointer">
                  যোগাযোগ (Contact Desk)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Get Involved */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">অংশগ্রহণ করুন</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-300">
              <li>
                <button onClick={() => onOpenDonate && onOpenDonate()} className="hover:text-amber-400 transition cursor-pointer font-bold text-amber-300">
                  ❤️ এককালীন অনুদান দিন
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('volunteer')} className="hover:text-emerald-400 transition cursor-pointer">
                  স্বেচ্ছাসেবক নিবন্ধন (Volunteer)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('causes')} className="hover:text-emerald-400 transition cursor-pointer">
                  যাকাত তহবিল (Zakat Fund)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-emerald-400 transition cursor-pointer">
                  কর্পোরেট অংশীদারিত্ব (Partnership)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('impact')} className="hover:text-emerald-400 transition cursor-pointer">
                  আর্থিক স্বচ্ছতা খতিয়ান (Audit)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Legal & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-teal-400">আইনি ও নীতিমা</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li className="hover:text-slate-200 transition cursor-pointer">প্রাইভেসি পলিসি (Privacy Policy)</li>
              <li className="hover:text-slate-200 transition cursor-pointer">ব্যবহারের শর্তাবলী (Terms & Conditions)</li>
              <li className="hover:text-slate-200 transition cursor-pointer">ডোনেশন ও রিফান্ড নীতিমালা</li>
              <li className="hover:text-slate-200 transition cursor-pointer">শরীয়াহ বোর্ড সার্টিফিকেশন</li>
              <li className="hover:text-slate-200 transition cursor-pointer">ট্যাক্স সুবিধা সনদ (Tax Exemption)</li>
            </ul>

            <div className="pt-2">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 text-[10px] text-slate-400">
                🔒 এনবিআর ও সমাজসেবা অধিদপ্তর নিবন্ধিত মানবিক সংস্থা।
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <div>
            © ২০২৬ <strong className="text-white font-bold">{SYF_BRAND.nameBn}</strong> ({SYF_BRAND.nameEn})। সর্বস্বত্ব সংরক্ষিত।
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-500">Made with love for humanity</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white/10 hover:bg-emerald-600 text-white transition flex items-center gap-1 text-[11px] font-bold"
            >
              <span>শীর্ষে যান</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
