import React, { useState, useEffect } from 'react';
import { useTranslation } from '../locales/i18nContext';
import { useAuth } from '../context/AuthContext';
import {
  Menu, X, ChevronDown, Search, Heart, GraduationCap,
  Building2, Users, ShoppingBag, Home, HeartHandshake,
  Layers, Landmark, BookOpen, ShieldCheck, PhoneCall,
  HeartPulse, FileText, Globe, Sparkles, ExternalLink,
  Stethoscope, Scale
} from 'lucide-react';
import { api } from '../services/api';
import { NavigationMenuItem } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenDonation?: () => void;
  onOpenDonationModal?: () => void;
  onOpenBloodSOS?: () => void;
}

const DEFAULT_MENUS: NavigationMenuItem[] = [
  { id: 'm_home', title: 'Home', titleBn: 'হোম', route: 'home', category: 'header_main', iconName: 'Home', order: 1, isActive: true },
  { id: 'm_charity_syf', title: 'Sajeda Youth Foundation', titleBn: 'সাজেদা ইয়ুথ ফাউন্ডেশন', route: 'charity', category: 'header_main', iconName: 'Heart', badgeBn: 'দান ও যাকাত', badge: 'SYF Charity', order: 2, isActive: true },
  { id: 'm_branches', title: 'Branches & Committee', titleBn: 'শাখা ও পরিচালনা কমিটি', route: 'branches', category: 'header_main', iconName: 'Building2', badgeBn: 'সারাদেশে', order: 3, isActive: true },
  { id: 'm_medical', title: 'Medical Courses', titleBn: 'মেডিকেল কোর্স', route: 'medical-courses', category: 'header_main', iconName: 'Stethoscope', badgeBn: 'ভর্তি চলছে', order: 4, isActive: true },
  { id: 'm_blood', title: 'Blood Bank & SOS', titleBn: 'ব্লাড ব্যাংক ও জরুরি রক্ত', route: 'blood-bank', category: 'programs', iconName: 'HeartPulse', descriptionBn: 'সারাদেশের রক্তের গ্রুপ ও লাইভ ডোনার ডিরেক্টরি', order: 5, isActive: true },
  { id: 'm_school', title: 'Academy & School', titleBn: 'এসকাডো একাডেমি', route: 'school', category: 'programs', iconName: 'GraduationCap', descriptionBn: 'ভর্তি, ক্লাস রুটিন, ফলাফল ও ডিজিটাল ফি', order: 6, isActive: true },
  { id: 'm_volunteer', title: 'Volunteer Network', titleBn: 'স্বেচ্ছাসেবক ফোরাম', route: 'volunteer', category: 'programs', iconName: 'Users', descriptionBn: 'স্বেচ্ছাসেবক নিবন্ধন ও মানবিক সেবা কার্যক্রম', order: 7, isActive: true },
  { id: 'm_training', title: 'Skill Development LMS', titleBn: 'কারিগরি ও দক্ষতা প্রশিক্ষণ', route: 'training', category: 'programs', iconName: 'BookOpen', descriptionBn: 'যুবসমাজকে স্বাবলম্বী করতে কর্মমুখী প্রশিক্ষণ', order: 8, isActive: true },
  { id: 'm_somiti', title: 'Somiti & Micro-finance', titleBn: 'সমিতি ও ক্ষুদ্র সঞ্চয়', route: 'somiti', category: 'economic', iconName: 'Landmark', descriptionBn: 'সুদমুক্ত ক্ষুদ্রঋণ, সঞ্চয় হিসাব ও কিস্তি ট্র্যাকিং', order: 9, isActive: true },
  { id: 'm_marketplace', title: 'Halal Marketplace', titleBn: 'হালাল মার্কেটপ্লেস', route: 'marketplace', category: 'economic', iconName: 'ShoppingBag', descriptionBn: 'দেশীয় পণ্য, হস্তশিল্প ও নিরাপদ পাইকারি কেনাবেচা', order: 10, isActive: true },
  { id: 'm_realestate', title: 'Verified Real Estate', titleBn: 'জমি ও আবাসন সেবা', route: 'real-estate', category: 'economic', iconName: 'Home', descriptionBn: 'আইনিভাবে যাচাইকৃত জমি, ফ্ল্যাট ও নিরাপদ সম্পত্তি', order: 11, isActive: true },
  { id: 'm_marriage', title: 'Marriage Matrimonial', titleBn: 'পাত্র-পাত্রী ম্যারেজ মিডিয়া', route: 'marriage', category: 'economic', iconName: 'HeartHandshake', descriptionBn: 'গোপনীয়তা ও মর্যাদাপূর্ণ ইসলামিক পাত্র-পাত্রী সন্ধান', order: 12, isActive: true },
  { id: 'm_constitution', title: 'Constitution & Laws', titleBn: 'সাংগঠনিক আইন', route: 'constitution', category: 'header_main', iconName: 'Scale', badgeBn: 'গঠনতন্ত্র', order: 13, isActive: true },
  { id: 'm_news', title: 'News & Notices', titleBn: 'সংবাদ ও নোটিশ', route: 'news', category: 'header_main', iconName: 'FileText', order: 14, isActive: true },
  { id: 'm_contact', title: 'Contact & Helpline', titleBn: 'যোগাযোগ ও হেল্পলাইন', route: 'contact', category: 'header_main', iconName: 'PhoneCall', order: 15, isActive: true }
];

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenDonation,
  onOpenDonationModal,
  onOpenBloodSOS
}) => {
  const { t, isBn } = useTranslation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<NavigationMenuItem[]>(DEFAULT_MENUS);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await api.getMenus();
        if (Array.isArray(data) && data.length > 0) {
          setMenuItems(data);
        }
      } catch (e) {
        // Fallback to default menus
      }
    };

    fetchMenus();

    // Listen for custom menu update event from admin dashboard
    const handleMenuUpdate = () => {
      fetchMenus();
    };
    window.addEventListener('ascado_menus_updated', handleMenuUpdate);
    return () => {
      window.removeEventListener('ascado_menus_updated', handleMenuUpdate);
    };
  }, []);

  const handleOpenDonate = () => {
    if (typeof onOpenDonationModal === 'function') {
      onOpenDonationModal();
    } else if (typeof onOpenDonation === 'function') {
      onOpenDonation();
    }
  };

  const handleMenuItemClick = (item: NavigationMenuItem) => {
    if (item.isExternal && item.externalUrl) {
      window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (item.route === 'donations' || item.route === 'donation' || item.route === 'charity' || item.route === 'sajeda-charity') {
      onNavigate('charity');
    } else {
      onNavigate(item.route);
    }
    setMegaMenuOpen(null);
    setMobileMenuOpen(false);
  };

  const getMenuIcon = (iconName?: string, className: string = "w-4 h-4") => {
    switch (iconName?.toLowerCase()) {
      case 'home': return <Home className={className} />;
      case 'building2': case 'building': return <Building2 className={className} />;
      case 'heart': return <Heart className={className} />;
      case 'heartpulse': return <HeartPulse className={className} />;
      case 'graduationcap': return <GraduationCap className={className} />;
      case 'users': return <Users className={className} />;
      case 'bookopen': case 'book': return <BookOpen className={className} />;
      case 'landmark': return <Landmark className={className} />;
      case 'shoppingbag': case 'shopping': return <ShoppingBag className={className} />;
      case 'hearthandshake': return <HeartHandshake className={className} />;
      case 'filetext': case 'file': return <FileText className={className} />;
      case 'phonecall': case 'phone': return <PhoneCall className={className} />;
      case 'stethoscope': return <Stethoscope className={className} />;
      case 'scale': case 'gavel': case 'law': return <Scale className={className} />;
      case 'globe': return <Globe className={className} />;
      case 'sparkles': return <Sparkles className={className} />;
      default: return <Layers className={className} />;
    }
  };

  const activeMenus = (menuItems || []).filter(m => m && m.isActive !== false);
  const mainHeaderMenus = activeMenus.filter(m => m.category === 'header_main').sort((a, b) => (a.order || 0) - (b.order || 0));
  const programsMenus = activeMenus.filter(m => m.category === 'programs').sort((a, b) => (a.order || 0) - (b.order || 0));
  const economicMenus = activeMenus.filter(m => m.category === 'economic').sort((a, b) => (a.order || 0) - (b.order || 0));

  const navItemClass = (route: string) =>
    `px-3 py-2 text-sm font-medium rounded-md transition flex items-center gap-1.5 cursor-pointer ${
      currentView === route ||
      ((route === 'charity' || route === 'donations' || route === 'donation') &&
        (currentView === 'charity' || currentView === 'sajeda-charity' || currentView === 'donations' || currentView === 'donation'))
        ? 'text-emerald-700 bg-emerald-50 font-bold'
        : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
    }`;

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Platform Name */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0 min-w-0"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition shrink-0">
              <span className="font-black text-2xl tracking-tighter">A</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-lg sm:text-2xl text-slate-900 tracking-tight whitespace-nowrap">
                  {isBn ? 'এসকাডো' : 'ASCAHDO'}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase whitespace-nowrap">
                  Multi-NGO
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-1 hidden sm:block">
                {isBn ? 'সমন্বিত সমাজসেবা ও মানবকল্যাণ ট্রাস্ট' : 'Integrated NGO Management Platform'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {/* 1. Home / First Main Menus */}
            {mainHeaderMenus.slice(0, 2).map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item)}
                className={navItemClass(item.route)}
              >
                {getMenuIcon(item.iconName, "w-4 h-4 text-emerald-600 shrink-0")}
                <span className="whitespace-nowrap">{isBn ? item.titleBn || item.title : item.title}</span>
                {item.badgeBn && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-sm ml-0.5 whitespace-nowrap">
                    {isBn ? item.badgeBn : (item.badge || item.badgeBn)}
                  </span>
                )}
              </button>
            ))}

            {/* 2. Programs & Services Dropdown */}
            {programsMenus.length > 0 && (
              <div
                className="relative"
                onMouseEnter={() => setMegaMenuOpen('services')}
                onMouseLeave={() => setMegaMenuOpen(null)}
              >
                <button className="px-2.5 xl:px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 flex items-center gap-1.5 whitespace-nowrap">
                  <HeartPulse className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{isBn ? 'সমাজসেবা ও কার্যক্রম' : 'Programs & Services'}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {megaMenuOpen === 'services' && (
                  <div className="absolute left-0 w-84 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 grid gap-1.5 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    {programsMenus.map((prog) => (
                      <button
                        key={prog.id}
                        onClick={() => {
                          handleMenuItemClick(prog);
                          setMegaMenuOpen(null);
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-left transition group border border-transparent hover:border-slate-100"
                      >
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition shrink-0">
                          {getMenuIcon(prog.iconName, "w-4 h-4")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition flex items-center gap-1.5">
                            <span>{isBn ? prog.titleBn || prog.title : prog.title}</span>
                            {prog.isExternal && <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />}
                          </div>
                          {(prog.descriptionBn || prog.description) && (
                            <div className="text-[11px] text-slate-500 line-clamp-1">
                              {isBn ? prog.descriptionBn || prog.description : prog.description || prog.descriptionBn}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. Economy & Enterprise Dropdown */}
            {economicMenus.length > 0 && (
              <div
                className="relative"
                onMouseEnter={() => setMegaMenuOpen('economy')}
                onMouseLeave={() => setMegaMenuOpen(null)}
              >
                <button className="px-2.5 xl:px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 flex items-center gap-1.5 whitespace-nowrap">
                  <Landmark className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{isBn ? 'বাণিজ্য ও অর্থনীতি' : 'Trade & Finance'}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {megaMenuOpen === 'economy' && (
                  <div className="absolute left-0 w-84 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 grid gap-1.5 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    {economicMenus.map((econ) => (
                      <button
                        key={econ.id}
                        onClick={() => {
                          handleMenuItemClick(econ);
                          setMegaMenuOpen(null);
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-left transition group border border-transparent hover:border-slate-100"
                      >
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition shrink-0">
                          {getMenuIcon(econ.iconName, "w-4 h-4")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition flex items-center gap-1.5">
                            <span>{isBn ? econ.titleBn || econ.title : econ.title}</span>
                            {econ.isExternal && <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />}
                          </div>
                          {(econ.descriptionBn || econ.description) && (
                            <div className="text-[11px] text-slate-500 line-clamp-1">
                              {isBn ? econ.descriptionBn || econ.description : econ.description || econ.descriptionBn}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. More Menus Dropdown (Branches, Medical, Constitution, News, Contact etc.) */}
            {mainHeaderMenus.slice(2).length > 0 && (
              <div
                className="relative"
                onMouseEnter={() => setMegaMenuOpen('more')}
                onMouseLeave={() => setMegaMenuOpen(null)}
              >
                <button className="px-2.5 xl:px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 flex items-center gap-1.5 whitespace-nowrap">
                  <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isBn ? 'অন্যান্য সেবা ও শাখা' : 'More'}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {megaMenuOpen === 'more' && (
                  <div className="absolute right-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-2.5 grid gap-1 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    {mainHeaderMenus.slice(2).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          handleMenuItemClick(item);
                          setMegaMenuOpen(null);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left transition group border border-transparent hover:border-slate-100"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition shrink-0">
                            {getMenuIcon(item.iconName, "w-4 h-4")}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition truncate">
                              {isBn ? item.titleBn || item.title : item.title}
                            </div>
                            {(item.descriptionBn || item.description) && (
                              <div className="text-[10px] text-slate-500 line-clamp-1">
                                {isBn ? item.descriptionBn || item.description : item.description}
                              </div>
                            )}
                          </div>
                        </div>
                        {item.badgeBn && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm shrink-0 ml-2">
                            {isBn ? item.badgeBn : (item.badge || item.badgeBn)}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action: Quick Donation & Portal */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-3 shrink-0">
            <button
              onClick={handleOpenDonate}
              className="flex items-center gap-1.5 bg-[#EBB82D] hover:bg-[#d8a520] text-slate-950 text-xs font-black px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow-xs hover:shadow transition transform active:scale-95 cursor-pointer shrink-0"
            >
              <Heart className="w-4 h-4 fill-slate-950 text-slate-950 shrink-0" />
              <span className="whitespace-nowrap">{isBn ? 'অনুদানে অংশ নিন' : 'Donate Now'}</span>
            </button>

            {user?.role === 'SUPER_ADMIN' ? (
              <button
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-emerald-400 text-xs font-black px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-emerald-500/50 shadow-md transition transform active:scale-95 cursor-pointer shrink-0"
                title="Super Admin Central Control Panel"
              >
                <div className="w-5 h-5 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="whitespace-nowrap">{t.nav.adminPanel}</span>
                <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded-sm uppercase shrink-0">SUPER</span>
              </button>
            ) : user ? (
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-slate-200 transition cursor-pointer shrink-0"
              >
                <span className="whitespace-nowrap">{t.nav.dashboard}</span>
              </button>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={handleOpenDonate}
              className="bg-emerald-600 text-white text-xs font-bold p-2.5 rounded-xl"
            >
              <Heart className="w-4 h-4 fill-white" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1.5 shadow-lg max-h-[80vh] overflow-y-auto">
          {activeMenus.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuItemClick(item)}
              className={`w-full text-left py-2 px-3 text-sm font-semibold rounded-xl flex items-center justify-between transition ${
                currentView === item.route
                  ? 'bg-emerald-50 text-emerald-800 font-bold'
                  : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {getMenuIcon(item.iconName, "w-4 h-4 text-emerald-600")}
                <span>{isBn ? item.titleBn || item.title : item.title}</span>
              </div>
              {item.badgeBn && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                  {isBn ? item.badgeBn : (item.badge || item.badgeBn)}
                </span>
              )}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {user?.role === 'SUPER_ADMIN' ? (
              <button
                onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 bg-slate-900 text-emerald-400 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.nav.adminPanel}</span>
              </button>
            ) : user ? (
              <button
                onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl text-center"
              >
                {t.nav.dashboard}
              </button>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
};
