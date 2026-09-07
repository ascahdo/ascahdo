import React, { useState } from 'react';
import { useTranslation } from '../locales/i18nContext';
import { ArrowRight, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';

interface HomeServiceMenuGridProps {
  onNavigate: (view: string) => void;
  onOpenDonationModal?: () => void;
  onOpenBloodSOS?: () => void;
}

interface ServiceMenuItem {
  id: string;
  route: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  badgeBn?: string;
  badgeEn?: string;
  badgeColor?: string;
  category: 'all' | 'essential' | 'educational' | 'welfare' | 'economic' | 'admin';
  iconType: string;
  highlight?: boolean;
}

export const HomeServiceMenuGrid: React.FC<HomeServiceMenuGridProps> = ({
  onNavigate,
  onOpenDonationModal,
  onOpenBloodSOS,
}) => {
  const { t, isBn } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const menuItems: ServiceMenuItem[] = [
    {
      id: 'school',
      route: 'school',
      titleBn: 'স্কুল ম্যানেজমেন্ট',
      titleEn: 'School Management',
      subtitleBn: 'ভর্তি, ক্লাস রুটিন, ফলাফল ও ফি',
      subtitleEn: 'Admission, Routine & Results',
      badgeBn: 'একাডেমি',
      badgeEn: 'Academy',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      category: 'educational',
      iconType: 'school',
    },
    {
      id: 'blood-bank',
      route: 'blood-bank',
      titleBn: 'ব্লাড ব্যাংক',
      titleEn: 'Blood Bank',
      subtitleBn: 'জরুরি রক্তদাতা ও ডোনার তালিকা',
      subtitleEn: 'Live Donors & Emergency SOS',
      badgeBn: 'জরুরি ২৪/৭',
      badgeEn: '24/7 Live',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      category: 'essential',
      iconType: 'blood',
      highlight: true,
    },
    {
      id: 'somiti',
      route: 'somiti',
      titleBn: 'মাল্টি-সমিতি ও NGO ERP',
      titleEn: 'Multi-Somiti & NGO ERP',
      subtitleBn: 'শাখা অনুমোদন, সদস্য ৩৬০°, সঞ্চয় ও ঋণ',
      subtitleEn: 'Multi-Branch, Member 360 & Loans',
      badgeBn: 'সেন্ট্রাল ERP',
      badgeEn: 'Central ERP',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
      category: 'economic',
      iconType: 'somiti',
      highlight: true,
    },
    {
      id: 'marriage',
      route: 'marriage',
      titleBn: 'ম্যারেজ মিডিয়া',
      titleEn: 'Marriage Media',
      subtitleBn: 'পাত্র-পাত্রী বায়োডাটা ও ম্যাচমেকিং',
      subtitleEn: 'Matrimonial & Biodatas',
      badgeBn: 'ভেরিফাইড',
      badgeEn: 'Verified',
      badgeColor: 'bg-pink-100 text-pink-800 border-pink-200',
      category: 'welfare',
      iconType: 'marriage',
    },
    {
      id: 'marketplace',
      route: 'marketplace',
      titleBn: 'মার্কেটপ্লেস',
      titleEn: 'Marketplace',
      subtitleBn: 'হালাল পণ্য ও পাইকারি কেনাবেচা',
      subtitleEn: 'Halal Products & E-Commerce',
      badgeBn: '১০% ছাড়',
      badgeEn: 'Shop',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      category: 'economic',
      iconType: 'marketplace',
    },
    {
      id: 'real-estate',
      route: 'real-estate',
      titleBn: 'রিয়েল এস্টেট',
      titleEn: 'Real Estate Point',
      subtitleBn: 'আইনিভাবে যাচাইকৃত জমি ও ফ্ল্যাট',
      subtitleEn: 'Verified Land & Properties',
      badgeBn: 'নিরাপদ জমি',
      badgeEn: 'Properties',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      category: 'economic',
      iconType: 'realestate',
    },
    {
      id: 'medical-courses',
      route: 'medical-courses',
      titleBn: 'মেডিকেল কোর্স',
      titleEn: 'Medical Courses',
      subtitleBn: 'নার্সিং, ফার্মাসি ও প্যারামেডিকেল',
      subtitleEn: 'Nursing & Paramedical Diploma',
      badgeBn: 'ভর্তি চলছে',
      badgeEn: 'Admissions',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      category: 'educational',
      iconType: 'medical',
    },
    {
      id: 'training',
      route: 'training',
      titleBn: 'কারিগরি ও আইসিটি ট্রেনিং হাব',
      titleEn: 'Skill Development',
      subtitleBn: 'এসকাডো কারিগরি ও কর্মমুখী কোর্স',
      subtitleEn: 'Vocational & IT Training LMS',
      badgeBn: 'অনলাইন LMS',
      badgeEn: 'Courses',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      category: 'educational',
      iconType: 'training',
    },
    {
      id: 'charity',
      route: 'charity',
      titleBn: 'সাজেদা ইয়ুথ ফাউন্ডেশন',
      titleEn: 'Sajeda Youth Foundation',
      subtitleBn: 'দান, যাকাত ও শতভাগ স্বচ্ছ মানবিক সেবা',
      subtitleEn: 'Donation, Zakat & Verified Charity',
      badgeBn: 'দান ও যাকাত',
      badgeEn: 'Charity & Zakat',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      category: 'welfare',
      iconType: 'donation',
      highlight: true,
    },
    {
      id: 'branches',
      route: 'branches',
      titleBn: 'শাখা ও কমিটি',
      titleEn: 'Branches & Committee',
      subtitleBn: 'সারাদেশের অনুমোদিত শাখা তালিকা',
      subtitleEn: 'Approved Executive Committees',
      badgeBn: '৬৪ জেলা',
      badgeEn: '64 Districts',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      category: 'admin',
      iconType: 'branches',
    },
    {
      id: 'volunteer',
      route: 'volunteer',
      titleBn: 'স্বেচ্ছাসেবক ফোরাম',
      titleEn: 'Volunteer Forum',
      subtitleBn: 'নিবন্ধন ও ডিজিটাল আইডি কার্ড',
      subtitleEn: 'Join Nationwide Volunteers',
      badgeBn: 'যোগ দিন',
      badgeEn: 'Join Us',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      category: 'welfare',
      iconType: 'volunteer',
    },
    {
      id: 'constitution',
      route: 'constitution',
      titleBn: 'সাংগঠনিক আইন',
      titleEn: 'Organizational Law',
      subtitleBn: 'কেন্দ্রীয় ট্রাস্টের গঠনতন্ত্র ও ধারা',
      subtitleEn: 'Constitution & Bylaws',
      badgeBn: 'গঠনতন্ত্র',
      badgeEn: 'Bylaws',
      badgeColor: 'bg-slate-200 text-slate-800 border-slate-300',
      category: 'admin',
      iconType: 'law',
    },
    {
      id: 'news',
      route: 'news',
      titleBn: 'সংবাদ ও নোটিশ',
      titleEn: 'News & Notices',
      subtitleBn: 'প্রেস বিজ্ঞপ্তি ও সার্কুলার',
      subtitleEn: 'Official Press & Events',
      badgeBn: 'সর্বশেষ',
      badgeEn: 'Latest',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      category: 'admin',
      iconType: 'news',
    },
    {
      id: 'contact',
      route: 'contact',
      titleBn: 'যোগাযোগ ও হেল্পডেস্ক',
      titleEn: 'Contact & Support',
      subtitleBn: 'ঢাকা প্রধান অফিস ও হটলাইন',
      subtitleEn: 'Central Office & 24/7 Hotline',
      badgeBn: '২৪/৭ সাপোর্ট',
      badgeEn: 'Support',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      category: 'essential',
      iconType: 'contact',
    },
  ];

  const filteredItems =
    selectedCategory === 'all'
      ? (menuItems || [])
      : (menuItems || []).filter((item) => item && item.category === selectedCategory);

  // Render Illustrated 3D Vector Icons to match uploaded photo aesthetics
  const renderCardIllustration = (type: string) => {
    switch (type) {
      case 'school':
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              {/* Ground shadow */}
              <ellipse cx="50" cy="88" rx="38" ry="6" fill="#e2e8f0" />
              
              {/* Main Building Base (Yellow/Beige Brick) */}
              <rect x="20" y="44" width="60" height="42" rx="4" fill="#fcd34d" stroke="#d97706" strokeWidth="2.5" />
              
              {/* Brick details */}
              <line x1="28" y1="56" x2="38" y2="56" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="62" y1="56" x2="72" y2="56" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="28" y1="72" x2="38" y2="72" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="62" y1="72" x2="72" y2="72" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />

              {/* Main Red Gabled Roof */}
              <polygon points="50,16 14,44 86,44" fill="#ef4444" stroke="#b91c1c" strokeWidth="2.5" strokeLinejoin="round" />
              
              {/* Roof Shingle Texture */}
              <path d="M 32 32 L 68 32 M 40 24 L 60 24" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" />

              {/* Clock Tower / Bell Attic Circle */}
              <circle cx="50" cy="32" r="7.5" fill="#ffffff" stroke="#b91c1c" strokeWidth="2" />
              <circle cx="50" cy="32" r="1.5" fill="#1e293b" />
              <line x1="50" y1="32" x2="50" y2="28" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="50" y1="32" x2="53" y2="32" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />

              {/* Flag on roof */}
              <line x1="50" y1="16" x2="50" y2="7" stroke="#78716c" strokeWidth="2" strokeLinecap="round" />
              <polygon points="50,7 62,11 50,15" fill="#dc2626" />

              {/* Windows (Left & Right) */}
              <rect x="25" y="48" width="12" height="13" rx="2" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.8" />
              <line x1="31" y1="48" x2="31" y2="61" stroke="#0284c7" strokeWidth="1.2" />
              <line x1="25" y1="54" x2="37" y2="54" stroke="#0284c7" strokeWidth="1.2" />

              <rect x="63" y="48" width="12" height="13" rx="2" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.8" />
              <line x1="69" y1="48" x2="69" y2="61" stroke="#0284c7" strokeWidth="1.2" />
              <line x1="63" y1="54" x2="75" y2="54" stroke="#0284c7" strokeWidth="1.2" />

              {/* Lower Windows */}
              <rect x="25" y="66" width="12" height="13" rx="2" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.8" />
              <rect x="63" y="66" width="12" height="13" rx="2" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.8" />

              {/* Center Entrance Double Door */}
              <path d="M 43 86 L 43 62 C 43 57 57 57 57 62 L 57 86 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
              <line x1="50" y1="60" x2="50" y2="86" stroke="#fde68a" strokeWidth="1.5" />
              <circle cx="47" cy="74" r="1.2" fill="#fbbf24" />
              <circle cx="53" cy="74" r="1.2" fill="#fbbf24" />

              {/* Entrance Steps */}
              <rect x="40" y="84" width="20" height="3" rx="1.5" fill="#cbd5e1" />
            </svg>
          </div>
        );

      case 'blood':
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              {/* Soft Drop Shadow */}
              <ellipse cx="50" cy="88" rx="26" ry="6" fill="#fecdd3" opacity="0.8" />
              
              {/* Glossy Red Blood Droplet */}
              <defs>
                <linearGradient id="bloodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="35%" stopColor="#ef4444" />
                  <stop offset="70%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
                <radialGradient id="highlightGrad" cx="35%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Main Droplet Path */}
              <path
                d="M 50 12 C 50 12 20 48 20 66 C 20 83 33.4 90 50 90 C 66.6 90 80 83 80 66 C 80 48 50 12 50 12 Z"
                fill="url(#bloodGrad)"
                stroke="#b91c1c"
                strokeWidth="2.5"
              />

              {/* Top Curved Highlight */}
              <path
                d="M 44 25 C 34 38 27 52 27 64 C 27 72 32 78 38 78 C 32 78 29 70 30 60 C 31 48 38 34 44 25 Z"
                fill="url(#highlightGrad)"
              />

              {/* Center Specular Sparkle */}
              <ellipse cx="36" cy="46" rx="5" ry="9" transform="rotate(-25 36 46)" fill="#ffffff" opacity="0.6" />
              <circle cx="42" cy="35" r="2.5" fill="#ffffff" opacity="0.8" />

              {/* Subtle Medical Plus inside drop */}
              <path
                d="M 47 60 H 53 M 50 57 V 63"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.9"
              />
            </svg>
          </div>
        );

      case 'somiti':
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              {/* Soft Shadow */}
              <ellipse cx="50" cy="85" rx="34" ry="5" fill="#e2e8f0" />

              {/* Left Cuff (Blue Suit Sleeve) */}
              <path d="M 12 40 L 32 30 L 38 42 L 18 52 Z" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" />
              <path d="M 32 30 L 36 28 L 42 40 L 38 42 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              
              {/* Right Cuff (Cyan Suit Sleeve) */}
              <path d="M 88 40 L 68 30 L 62 42 L 82 52 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
              <path d="M 68 30 L 64 28 L 58 40 L 62 42 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Left Hand & Fingers (Skin tone 1) */}
              <path
                d="M 36 39 C 40 37 46 41 50 45 L 62 52 C 64 54 62 58 58 60 L 48 57 L 42 63 C 38 65 34 60 36 54 Z"
                fill="#fbbd8b"
                stroke="#d97706"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Right Hand & Fingers (Skin tone 2) */}
              <path
                d="M 64 39 C 60 37 54 41 50 45 L 38 52 C 36 54 38 58 42 60 L 52 57 L 58 63 C 62 65 66 60 64 54 Z"
                fill="#f6ad55"
                stroke="#d97706"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Interlocking Handshake Fingers */}
              <path d="M 45 47 L 55 55 M 42 53 L 52 61 M 39 59 L 48 67" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />

              {/* Trust/Financial Sparkle atop */}
              <circle cx="50" cy="24" r="9" fill="#fef08a" stroke="#eab308" strokeWidth="1.5" />
              <text x="50" y="28" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#854d0e">৳</text>
            </svg>
          </div>
        );

      case 'marriage':
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              <ellipse cx="50" cy="85" rx="30" ry="5" fill="#fce7f3" />
              
              {/* Couple Rings Intertwined */}
              <circle cx="40" cy="48" r="19" fill="none" stroke="#f59e0b" strokeWidth="5.5" />
              <circle cx="40" cy="48" r="19" fill="none" stroke="#fbbf24" strokeWidth="3" />
              
              <circle cx="60" cy="48" r="19" fill="none" stroke="#e11d48" strokeWidth="5.5" />
              <circle cx="60" cy="48" r="19" fill="none" stroke="#f43f5e" strokeWidth="3" />

              {/* Diamond on Bride Ring */}
              <polygon points="60,24 67,31 60,38 53,31" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
              <polygon points="60,24 64,31 60,36 56,31" fill="#ffffff" />

              {/* Big Red Center Heart */}
              <path
                d="M 50 64 C 50 64 34 50 34 38 C 34 30 40 25 46 27 C 49 28 50 31 50 31 C 50 31 51 28 54 27 C 60 25 66 30 66 38 C 66 50 50 64 50 64 Z"
                fill="#e11d48"
                stroke="#9f1239"
                strokeWidth="1.5"
              />
              <path
                d="M 44 32 C 41 33 39 36 39 40"
                stroke="#fbcfe8"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        );

      case 'marketplace':
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              <ellipse cx="50" cy="86" rx="32" ry="5" fill="#e2e8f0" />
              
              {/* Store Awning (Green-White striped) */}
              <polygon points="20,38 80,38 86,52 14,52" fill="#059669" stroke="#047857" strokeWidth="2" />
              <polygon points="26,38 38,38 34,52 22,52" fill="#ffffff" />
              <polygon points="50,38 62,38 58,52 46,52" fill="#ffffff" />
              <polygon points="74,38 80,38 82,52 70,52" fill="#ffffff" />

              {/* Store Building Front */}
              <rect x="20" y="52" width="60" height="32" fill="#f8fafc" stroke="#047857" strokeWidth="2" />
              
              {/* Store Window & Products Display */}
              <rect x="25" y="58" width="22" height="18" rx="2" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
              <circle cx="31" cy="67" r="3" fill="#f59e0b" />
              <circle cx="41" cy="67" r="3" fill="#ef4444" />

              {/* Store Door */}
              <rect x="55" y="58" width="18" height="26" rx="2" fill="#065f46" stroke="#047857" strokeWidth="1.5" />
              <rect x="58" y="62" width="12" height="10" rx="1" fill="#a7f3d0" />
              <circle cx="58" cy="74" r="1.2" fill="#fbbf24" />

              {/* Shopping Bag Tag Over Awning */}
              <rect x="42" y="16" width="16" height="18" rx="3" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
              <path d="M 46 16 C 46 11 54 11 54 16" fill="none" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
              <text x="50" y="28" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#ffffff">%</text>
            </svg>
          </div>
        );

      case 'realestate':
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              <ellipse cx="50" cy="87" rx="36" ry="5" fill="#e2e8f0" />
              
              {/* Tall Modern Tower Building (Blue) */}
              <rect x="48" y="22" width="34" height="62" rx="3" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
              {/* Glass Windows on tower */}
              <rect x="53" y="28" width="6" height="8" rx="1" fill="#bae6fd" />
              <rect x="62" y="28" width="6" height="8" rx="1" fill="#bae6fd" />
              <rect x="71" y="28" width="6" height="8" rx="1" fill="#bae6fd" />
              <rect x="53" y="40" width="6" height="8" rx="1" fill="#bae6fd" />
              <rect x="62" y="40" width="6" height="8" rx="1" fill="#bae6fd" />
              <rect x="71" y="40" width="6" height="8" rx="1" fill="#bae6fd" />
              <rect x="53" y="52" width="6" height="8" rx="1" fill="#bae6fd" />
              <rect x="62" y="52" width="6" height="8" rx="1" fill="#bae6fd" />
              <rect x="71" y="52" width="6" height="8" rx="1" fill="#bae6fd" />

              {/* Front Cozy Suburban House (Orange/Warm) */}
              <polygon points="32,42 12,56 52,56" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
              <rect x="18" y="56" width="28" height="28" fill="#ffedd5" stroke="#ea580c" strokeWidth="2" />
              
              {/* House Door & Window */}
              <rect x="23" y="62" width="8" height="8" rx="1" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
              <rect x="33" y="66" width="9" height="18" rx="1" fill="#9a3412" />
              <circle cx="35" cy="75" r="0.8" fill="#fde047" />

              {/* Verified Location Pin badge */}
              <circle cx="50" cy="14" r="8" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
              <path d="M 47 14 L 49 16 L 54 11" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );

      case 'medical':
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              <ellipse cx="50" cy="86" rx="32" ry="5" fill="#ccfbf1" />

              {/* Stethoscope Tubing (Dark Blue/Teal) */}
              <path
                d="M 32 20 C 32 38 42 48 50 48 C 58 48 68 38 68 20"
                fill="none"
                stroke="#0f766e"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <circle cx="32" cy="18" r="3.5" fill="#115e59" />
              <circle cx="68" cy="18" r="3.5" fill="#115e59" />

              {/* Lower Stethoscope Extension & Chestpiece */}
              <path
                d="M 50 48 V 65 C 50 72 62 72 62 65"
                fill="none"
                stroke="#0f766e"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="62" cy="63" r="8" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
              <circle cx="62" cy="63" r="4.5" fill="#0d9488" />

              {/* Red Cross First-Aid Box in Center */}
              <rect x="24" y="52" width="28" height="24" rx="4" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
              <path d="M 32 52 C 32 46 44 46 44 52" fill="none" stroke="#7f1d1d" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* White Medical Cross */}
              <rect x="35" y="58" width="6" height="12" rx="1" fill="#ffffff" />
              <rect x="32" y="61" width="12" height="6" rx="1" fill="#ffffff" />
            </svg>
          </div>
        );

      case 'training':
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              <ellipse cx="50" cy="87" rx="34" ry="5" fill="#e0e7ff" />

              {/* Modern Laptop Base & Screen */}
              <rect x="22" y="36" width="56" height="38" rx="4" fill="#312e81" stroke="#1e1b4b" strokeWidth="2" />
              <rect x="26" y="40" width="48" height="30" rx="2" fill="#6366f1" />
              
              {/* Code lines on screen */}
              <line x1="30" y1="46" x2="44" y2="46" stroke="#c7d2fe" strokeWidth="2" strokeLinecap="round" />
              <line x1="30" y1="52" x2="56" y2="52" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" />
              <line x1="30" y1="58" x2="48" y2="58" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
              <line x1="30" y1="64" x2="40" y2="64" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />

              {/* Laptop Keyboard base */}
              <polygon points="12,78 88,78 80,74 20,74" fill="#4338ca" stroke="#312e81" strokeWidth="1.5" />
              <rect x="42" y="74" width="16" height="3" rx="1" fill="#818cf8" />

              {/* Graduation Cap atop laptop */}
              <polygon points="50,14 26,25 50,34 74,25" fill="#1e1b4b" stroke="#4338ca" strokeWidth="1.5" />
              <path d="M 36 29 L 36 38 C 36 43 64 43 64 38 L 64 29" fill="#1e1b4b" />
              <line x1="74" y1="25" x2="74" y2="38" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
              <circle cx="74" cy="39" r="2" fill="#f59e0b" />
            </svg>
          </div>
        );

      case 'donation':
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              <ellipse cx="50" cy="88" rx="34" ry="5" fill="#ecfdf5" />

              {/* Caring Hand Reaching (Palm up) */}
              <path
                d="M 16 68 L 34 60 C 38 58 44 60 48 64 L 62 70 C 66 72 64 78 58 80 L 38 82 C 30 83 22 76 16 68 Z"
                fill="#fbbd8b"
                stroke="#d97706"
                strokeWidth="2"
              />

              {/* Golden Coin with BDT symbol floating into hand */}
              <circle cx="50" cy="38" r="18" fill="#f59e0b" stroke="#b45309" strokeWidth="2.5" />
              <circle cx="50" cy="38" r="14" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
              <text x="50" y="44" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#78350f">৳</text>

              {/* Glowing Heart floating above coin */}
              <path
                d="M 64 22 C 64 22 56 14 56 8 C 56 4 60 1 63 2 C 65 3 66 5 66 5 C 66 5 67 3 69 2 C 72 1 76 4 76 8 C 76 14 64 22 64 22 Z"
                fill="#ef4444"
                stroke="#b91c1c"
                strokeWidth="1"
              />
            </svg>
          </div>
        );

      case 'branches':
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              <ellipse cx="50" cy="87" rx="36" ry="5" fill="#e2e8f0" />

              {/* Central HQ Dome / Pillar Building */}
              <rect x="22" y="38" width="56" height="46" rx="3" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" />
              
              {/* Pillars */}
              <rect x="28" y="46" width="6" height="32" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.2" />
              <rect x="40" y="46" width="6" height="32" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.2" />
              <rect x="54" y="46" width="6" height="32" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.2" />
              <rect x="66" y="46" width="6" height="32" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.2" />

              {/* Triangular Pediment atop building */}
              <polygon points="50,18 16,38 84,38" fill="#0f766e" stroke="#115e59" strokeWidth="2" />
              <circle cx="50" cy="30" r="4.5" fill="#fef08a" />

              {/* Organization Hierarchy Map network node badge */}
              <circle cx="78" cy="68" r="10" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
              <path d="M 74 68 H 82 M 78 64 V 72" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        );

      case 'volunteer':
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              <ellipse cx="50" cy="86" rx="32" ry="5" fill="#f3e8ff" />

              {/* 3 Active Volunteer Avatars with raised hands */}
              {/* Left Person (Cyan) */}
              <circle cx="32" cy="46" r="8" fill="#38bdf8" />
              <path d="M 22 74 C 22 62 42 62 42 74 Z" fill="#0284c7" />

              {/* Right Person (Amber) */}
              <circle cx="68" cy="46" r="8" fill="#fbbf24" />
              <path d="M 58 74 C 58 62 78 62 78 74 Z" fill="#d97706" />

              {/* Center Leader (Purple) */}
              <circle cx="50" cy="38" r="9.5" fill="#c084fc" stroke="#7e22ce" strokeWidth="1.5" />
              <path d="M 36 76 C 36 58 64 58 64 76 Z" fill="#7e22ce" />

              {/* Gold Star / Volunteer Badge atop */}
              <polygon
                points="50,12 53,20 62,20 55,25 58,34 50,29 42,34 45,25 38,20 47,20"
                fill="#eab308"
                stroke="#ca8a04"
                strokeWidth="1.2"
              />
            </svg>
          </div>
        );

      case 'law':
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              <ellipse cx="50" cy="88" rx="34" ry="5" fill="#e2e8f0" />

              {/* Scaled Balance of Justice (Golden Brass) */}
              {/* Center Pillar */}
              <rect x="48" y="24" width="4" height="56" rx="2" fill="#b45309" />
              <ellipse cx="50" cy="80" rx="16" ry="4" fill="#78350f" />
              <circle cx="50" cy="24" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />

              {/* Horizontal Balance Beam */}
              <line x1="20" y1="30" x2="80" y2="30" stroke="#d97706" strokeWidth="4" strokeLinecap="round" />
              
              {/* Left Pan */}
              <line x1="22" y1="30" x2="16" y2="52" stroke="#b45309" strokeWidth="1.5" />
              <line x1="22" y1="30" x2="28" y2="52" stroke="#b45309" strokeWidth="1.5" />
              <path d="M 12 52 C 12 60 32 60 32 52 Z" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />

              {/* Right Pan */}
              <line x1="78" y1="30" x2="72" y2="52" stroke="#b45309" strokeWidth="1.5" />
              <line x1="78" y1="30" x2="84" y2="52" stroke="#b45309" strokeWidth="1.5" />
              <path d="M 68 52 C 68 60 88 60 88 52 Z" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />

              {/* Constitution Book Icon */}
              <rect x="36" y="58" width="28" height="20" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
              <line x1="42" y1="64" x2="58" y2="64" stroke="#f8fafc" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="42" y1="70" x2="54" y2="70" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        );

      case 'news':
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              <ellipse cx="50" cy="87" rx="34" ry="5" fill="#e0f2fe" />

              {/* Newspaper Background */}
              <rect x="22" y="26" width="56" height="54" rx="4" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
              <rect x="28" y="32" width="20" height="14" rx="2" fill="#0284c7" />
              <line x1="52" y1="34" x2="72" y2="34" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="52" y1="40" x2="68" y2="40" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
              <line x1="28" y1="52" x2="72" y2="52" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              <line x1="28" y1="58" x2="72" y2="58" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              <line x1="28" y1="64" x2="60" y2="64" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

              {/* Red Megaphone Breaking Alert */}
              <polygon points="76,14 62,20 62,28 76,34" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
              <rect x="56" y="21" width="6" height="6" fill="#991b1b" />
              <path d="M 78 18 C 83 20 83 28 78 30" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        );

      case 'contact':
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              <ellipse cx="50" cy="87" rx="34" ry="5" fill="#ffe4e6" />

              {/* Customer Care Headset Character */}
              <circle cx="50" cy="40" r="16" fill="#fbcfe8" stroke="#db2777" strokeWidth="2" />
              <circle cx="44" cy="38" r="2" fill="#831843" />
              <circle cx="56" cy="38" r="2" fill="#831843" />
              <path d="M 46 47 C 48 50 52 50 54 47" stroke="#831843" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Body */}
              <path d="M 28 78 C 28 62 72 62 72 78 Z" fill="#e11d48" />

              {/* Over-ear Headset */}
              <path d="M 32 40 C 32 24 68 24 68 40" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
              <rect x="29" y="36" width="6" height="12" rx="3" fill="#0f172a" />
              <rect x="65" y="36" width="6" height="12" rx="3" fill="#0f172a" />

              {/* Microphone to mouth */}
              <path d="M 33 46 L 43 54" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="44" cy="55" r="2.5" fill="#f59e0b" />
            </svg>
          </div>
        );

      default:
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>
        );
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden mb-6 sm:mb-8 border border-emerald-800/40">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold uppercase tracking-wider mb-2 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isBn ? 'সকল মেনু ও ডিজিটাল সেবাসমূহ' : 'All Digital Menus & Services'}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white font-serif tracking-tight">
              {isBn ? 'এসকাডো কেন্দ্রীয় সেবা ও পরিচালনা পোর্টাল' : 'ASCAHDO Unified Service Directory'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              {isBn
                ? 'এক ক্লিকের মাধ্যমে শিক্ষা, স্বাস্থ্য, ব্লাড ব্যাংক, সমিতি, ম্যারেজ মিডিয়া, মার্কেটপ্লেস ও সকল সেবা গ্রহণ করুন।'
                : 'Instantly access education, blood bank, cooperative savings, matrimony, real estate & humanitarian portals.'}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-xs font-semibold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isBn ? 'মোট ১৪টি সক্রিয় মডিউল' : '14 Active Modules'}</span>
          </div>
        </div>

        {/* Filter Categories Tabs */}
        <div className="flex gap-2 overflow-x-auto pt-5 mt-4 border-t border-white/10 no-scrollbar text-xs font-bold">
          {[
            { id: 'all', labelBn: 'সকল মেনু (All)', labelEn: 'All Services' },
            { id: 'essential', labelBn: 'জরুরি সেবা', labelEn: 'Emergency SOS' },
            { id: 'educational', labelBn: 'শিক্ষা ও প্রশিক্ষণ', labelEn: 'Education & LMS' },
            { id: 'economic', labelBn: 'অর্থনৈতিক ও ব্যবসা', labelEn: 'Economic & Trade' },
            { id: 'welfare', labelBn: 'সমাজকল্যাণ ও দান', labelEn: 'Humanitarian & Welfare' },
            { id: 'admin', labelBn: 'সাংগঠনিক ও শাখা', labelEn: 'Constitution & Branches' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-extrabold'
                  : 'bg-white/10 hover:bg-white/20 text-white/90 border border-white/10'
              }`}
            >
              {isBn ? cat.labelBn : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Main Apps Grid (Styled like the uploaded photo reference) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 md:gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (item.route === 'blood-bank' && onOpenBloodSOS && item.highlight) {
                onNavigate('blood-bank');
              } else {
                onNavigate(item.route);
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group relative bg-white hover:bg-slate-50/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 md:p-5 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col items-center justify-between text-center cursor-pointer overflow-hidden"
          >
            {/* Top Badge (if any) */}
            {item.badgeBn && (
              <span
                className={`absolute top-2 right-2 text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full border shadow-2xs ${
                  item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {isBn ? item.badgeBn : item.badgeEn}
              </span>
            )}

            {/* Prominent Center Illustration (like uploaded photo) */}
            <div className="pt-2 pb-1 sm:py-2 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center">
              {renderCardIllustration(item.iconType)}
            </div>

            {/* Card Titles & Captions */}
            <div className="w-full space-y-1 mt-1">
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition font-sans line-clamp-1">
                {isBn ? item.titleBn : item.titleEn}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-1 font-normal group-hover:text-slate-700 transition">
                {isBn ? item.subtitleBn : item.subtitleEn}
              </p>
            </div>

            {/* Bottom active hover underline accent */}
            <div className="w-8 h-1 rounded-full bg-slate-200 group-hover:w-16 group-hover:bg-emerald-500 transition-all duration-300 mt-2" />
          </div>
        ))}
      </div>
    </section>
  );
};
