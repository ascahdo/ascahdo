import React, { createContext, useContext, useState } from 'react';
import { Language } from '../types/matrimonyTypes';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  bn: {
    // Brand & Header
    'brand.name': 'এসকাডো ম্যারেজ মিডিয়া',
    'brand.subname': 'ascahdo marriage media',
    'brand.tagline': 'শতভাগ বিশ্বস্ত ও সম্মানিত বাংলাদেশ অনলাইন পাত্র-পাত্রী সন্ধান',
    'nav.home': 'হোম পেজ',
    'nav.brides': 'পাত্রী খুঁজুন',
    'nav.grooms': 'পাত্র খুঁজুন',
    'nav.search': 'অনুসন্ধান',
    'nav.stories': 'সফল দম্পতি',
    'nav.packages': 'প্যাকেজসমূহ',
    'nav.blog': 'পরামর্শ ও ব্লগ',
    'nav.safety': 'নিরাপত্তা বিধিমালা',
    'nav.contact': 'যোগাযোগ ও হেল্পলাইন',
    'btn.login': 'লগইন করুন',
    'btn.register': 'ফ্রি বায়োডাটা তৈরি করুন',
    'btn.dashboard': 'আমার ড্যাশবোর্ড',
    'btn.admin_portal': 'অ্যাডমিন পোর্টাল',
    'btn.logout': 'লগআউট',

    // Hero
    'hero.badge': '১০০% এনআইডি ও পারিবারিক যাচাইকৃত নিরাপদ পাত্র-পাত্রী প্লাটফর্ম',
    'hero.title': 'আপনার আদর্শ ও উপযুক্ত জীবনসঙ্গী খুঁজুন, মর্যাদাপূর্ণ পরিবেশে',
    'hero.sub': 'সারা বাংলাদেশ ও প্রবাসী উচ্চশিক্ষিত, ডাক্তার, ইঞ্জিনিয়ার, বিসিএস কর্মকর্তা ও সম্ভ্রান্ত পরিবারের যাচাইকৃত বায়োডাটা।',
    'hero.btn_bride': 'পাত্রী অনুসন্ধান',
    'hero.btn_groom': 'পাত্র অনুসন্ধান',
    'hero.btn_create': 'ফ্রি বায়োডাটা তৈরি করুন',
    'hero.stat_users': '৫০,০০০+ সক্রিয় সদস্য',
    'hero.stat_success': '৪,২০০+ সফল বিবাহ',
    'hero.stat_verified': '১০০% এনআইডি ভেরিফিকেশন',
    'hero.stat_privacy': 'কঠোর পারিবারিক গোপনীয়তা',

    // Search Widget
    'search.title': 'দ্রুত পাত্র-পাত্রী অনুসন্ধান',
    'search.iam': 'আমি খুঁজছি',
    'search.bride': 'পাত্রীর সন্ধান (Bride)',
    'search.groom': 'পাত্রের সন্ধান (Groom)',
    'search.age': 'বয়সের সীমা',
    'search.religion': 'ধর্ম',
    'search.division': 'বিভাগ',
    'search.district': 'জেলা',
    'search.profession': 'পেশা / কর্মক্ষেত্র',
    'search.education': 'শিক্ষাগত যোগ্যতা',
    'search.marital_status': 'বৈবাহিক অবস্থা',
    'search.btn': 'বায়োডাটা খুঁজুন',
    'search.advanced': 'উন্নত ফিল্টার (Advanced Search)',
    'search.reset': 'ফিল্টার রিসেট',

    // Sections
    'sec.featured_title': 'নির্বাচিত পাত্র-পাত্রী প্রোফাইল',
    'sec.featured_sub': 'উচ্চশিক্ষিত ও পরিবার-যাচাইকৃত বিশিষ্ট পাত্র-পাত্রীর বায়োডাটা',
    'sec.how_title': 'এসকাডো ম্যারেজ মিডিয়া যেভাবে কাজ করে',
    'sec.how_sub': 'মাত্র ৪টি সহজ ও মর্যাদাপূর্ণ ধাপে আপনার কাঙ্ক্ষিত জীবনসঙ্গী খুঁজে নিন',
    'sec.how_1_title': '১. ফ্রি বায়োডাটা তৈরি',
    'sec.how_1_desc': 'আপনার শিক্ষা, পেশা, পারিবারিক পরিচয় ও কাঙ্ক্ষিত সঙ্গীর প্রত্যাশা দিয়ে বায়োডাটা নিবন্ধন করুন।',
    'sec.how_2_title': '২. এনআইডি ভেরিফিকেশন',
    'sec.how_2_desc': 'আমাদের ভেরিফিকেশন টিম জাতীয় পরিচয়পত্র ও শিক্ষাগত সনদ যাচাই করে বিশ্বস্ত ব্লু ব্যাজ প্রদান করে।',
    'sec.how_3_title': '৩. আগ্রহ ও পছন্দ প্রকাশ',
    'sec.how_3_desc': 'মনঃপূত প্রোফাইল শর্টলিস্ট করুন এবং অত্যন্ত সম্মানজনকভাবে বায়োডাটাতে আগ্রহ (Interest) পাঠান।',
    'sec.how_4_title': '৪. অভিভাবক পর্যায়ে যোগাযোগ ও শুভ বিবাহ',
    'sec.how_4_desc': 'পারস্পরিক সম্মতির ভিত্তিতে সরাসরি অভিভাবকের নম্বর আদান-প্রদান করে শুভ পরিণয়ের দিকে এগিয়ে যান।',
    'sec.why_title': 'কেন এসকাডো ম্যারেজ মিডিয়া সেরা?',
    'sec.stories_title': 'সফল দম্পতি ও সুখের গল্প',
    'sec.stories_sub': 'যাদের হাত ধরে তৈরি হয়েছে সুখের সংসার ও আজীবন বন্ধন',
    'sec.plans_title': 'সাশ্রয়ী মেম্বারশিপ প্যাকেজ',
    'sec.plans_sub': 'বিকাশ, নগদ, রকেট অথবা সরাসরি ব্যাংক ট্রান্সফারের সহজ সুবিধা',
    'sec.faq_title': 'সাধারণ জিজ্ঞাসাসমূহ (FAQ)',

    // Profile card
    'profile.id': 'প্রোফাইল আইডি',
    'profile.age': 'বয়স',
    'profile.height': 'উচ্চতা',
    'profile.education': 'শিক্ষা',
    'profile.profession': 'পেশা',
    'profile.district': 'জেলা',
    'profile.religion': 'ধর্ম',
    'profile.marital_status': 'বৈবাহিক অবস্থা',
    'profile.view_biodata': 'সম্পূর্ণ বায়োডাটা দেখুন',
    'profile.send_interest': 'আগ্রহ প্রকাশ করুন',
    'profile.interest_sent': 'আগ্রহ পাঠানো হয়েছে',
    'profile.shortlist': 'শর্টলিস্ট',
    'profile.shortlisted': 'শর্টলিস্টেড',
    'profile.request_contact': 'অভিভাবকের নম্বর চাই',
    'profile.match_score': 'ম্যাচ স্কোর',
    'profile.verified': 'ভেরিফাইড',
    'profile.locked_photo': 'গোপনীয়তার কারণে ছবি সংরক্ষিত',

    // Dashboard
    'dash.title': 'ইউজার ড্যাশবোর্ড',
    'dash.tab_overview': 'ড্যাশবোর্ড ওভারভিউ',
    'dash.tab_profile': 'আমার বায়োডাটা',
    'dash.tab_matches': 'স্মার্ট ম্যাচসমূহ',
    'dash.tab_shortlist': 'সংরক্ষিত তালিকা',
    'dash.tab_interests': 'আগ্রহের অনুরোধ',
    'dash.tab_contacts': 'অভিভাবক নম্বর রিকোয়েস্ট',
    'dash.tab_messages': 'মেসেজ ও চ্যাট',
    'dash.tab_upgrade': 'প্যাকেজ ও বিলিং',
    'dash.tab_verification': 'ভেরিফিকেশন সেন্টার',
    'dash.tab_privacy': 'গোপনীয়তা সেটিংস',
    'dash.tab_security': 'নিরাপত্তা',

    // Common
    'common.all': 'সকল',
    'common.save': 'সংরক্ষণ করুন',
    'common.cancel': 'বাতিল',
    'common.loading': 'লোড হচ্ছে...',
    'common.empty': 'কোনো তথ্য পাওয়া যায়নি',
    'common.success': 'কার্যক্রম সফল হয়েছে',
    'common.error': 'একটি ত্রুটি ঘটেছে',
    'common.close': 'বন্ধ করুন',
    'common.back': 'ফিরে যান',
    'common.next': 'পরবর্তী ধাপ',
    'common.submit': 'জমা দিন',
    'common.bdt': 'টাকা',
  },
  en: {
    // Brand & Header
    'brand.name': 'Ascahdo Marriage Media',
    'brand.subname': 'ascahdo marriage media',
    'brand.tagline': 'Trusted & Dignified Bangladeshi Matrimonial Matchmaking',
    'nav.home': 'Home',
    'nav.brides': 'Find Bride',
    'nav.grooms': 'Find Groom',
    'nav.search': 'Search',
    'nav.stories': 'Success Stories',
    'nav.packages': 'Membership Plans',
    'nav.blog': 'Advice & Blog',
    'nav.safety': 'Safety Guidelines',
    'nav.contact': 'Contact Us',
    'btn.login': 'Sign In',
    'btn.register': 'Create Free Biodata',
    'btn.dashboard': 'My Dashboard',
    'btn.admin_portal': 'Admin Portal',
    'btn.logout': 'Sign Out',

    // Hero
    'hero.badge': '100% Verified Biodata & Safe Matrimonial Platform',
    'hero.title': 'Find Your Ideal Life Partner, Respectfully & Securely',
    'hero.sub': 'Discover verified brides and grooms from top educational, professional, and cultural backgrounds across Bangladesh and overseas.',
    'hero.btn_bride': 'Search Brides',
    'hero.btn_groom': 'Search Grooms',
    'hero.btn_create': 'Create Biodata',
    'hero.stat_users': '50,000+ Active Profiles',
    'hero.stat_success': '4,200+ Happy Marriages',
    'hero.stat_verified': '100% NID Verification System',
    'hero.stat_privacy': 'Complete Privacy Control',

    // Search Widget
    'search.title': 'Quick Partner Search',
    'search.iam': 'Looking for',
    'search.bride': 'Bride (Female)',
    'search.groom': 'Groom (Male)',
    'search.age': 'Age Range',
    'search.religion': 'Religion',
    'search.division': 'Division',
    'search.district': 'District',
    'search.profession': 'Profession',
    'search.education': 'Education',
    'search.marital_status': 'Marital Status',
    'search.btn': 'Search Now',
    'search.advanced': 'Advanced Filters',
    'search.reset': 'Reset Filters',

    // Sections
    'sec.featured_title': 'Featured Matrimonial Profiles',
    'sec.featured_sub': 'Highly educated & family-verified brides and grooms',
    'sec.how_title': 'How Ascahdo Marriage Media Works',
    'sec.how_sub': 'Find your life companion in 4 simple and dignified steps',
    'sec.how_1_title': '1. Create Biodata',
    'sec.how_1_desc': 'Register your detailed education, career, family details and expectations.',
    'sec.how_2_title': '2. Get Verified',
    'sec.how_2_desc': 'Our moderation team verifies national ID credentials to grant verified badges.',
    'sec.how_3_title': '3. Express Interest',
    'sec.how_3_desc': 'Shortlist and express dignified interest to suitable profiles with complete ease.',
    'sec.how_4_title': '4. Family Contact & Wedding',
    'sec.how_4_desc': 'Exchange guardian contact information upon mutual consent and proceed to marriage.',
    'sec.why_title': 'Why Choose Us?',
    'sec.stories_title': 'Happy Couples & Success Stories',
    'sec.stories_sub': 'Couples who found lifelong companionship through our platform',
    'sec.plans_title': 'Affordable Membership Plans',
    'sec.plans_sub': 'Convenient payments via bKash, Nagad, Rocket or Bank Card',
    'sec.faq_title': 'Frequently Asked Questions (FAQ)',

    // Profile card
    'profile.id': 'Profile ID',
    'profile.age': 'Age',
    'profile.height': 'Height',
    'profile.education': 'Education',
    'profile.profession': 'Profession',
    'profile.district': 'District',
    'profile.religion': 'Religion',
    'profile.marital_status': 'Marital Status',
    'profile.view_biodata': 'View Full Biodata',
    'profile.send_interest': 'Send Interest',
    'profile.interest_sent': 'Interest Sent',
    'profile.shortlist': 'Shortlist',
    'profile.shortlisted': 'Shortlisted',
    'profile.request_contact': 'Request Guardian Contact',
    'profile.match_score': 'Match Score',
    'profile.verified': 'Verified',
    'profile.locked_photo': 'Photo protected by privacy settings',

    // Dashboard
    'dash.title': 'User Dashboard',
    'dash.tab_overview': 'Dashboard',
    'dash.tab_profile': 'My Biodata',
    'dash.tab_matches': 'Smart Matches',
    'dash.tab_shortlist': 'My Shortlist',
    'dash.tab_interests': 'Interests',
    'dash.tab_contacts': 'Contact Requests',
    'dash.tab_messages': 'Messages',
    'dash.tab_upgrade': 'Plans & Billing',
    'dash.tab_verification': 'Verification Center',
    'dash.tab_privacy': 'Privacy Settings',
    'dash.tab_security': 'Security',

    // Common
    'common.all': 'All',
    'common.save': 'Save Changes',
    'common.cancel': 'Cancel',
    'common.loading': 'Loading...',
    'common.empty': 'No records found',
    'common.success': 'Action completed successfully',
    'common.error': 'An error occurred',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.submit': 'Submit',
    'common.bdt': 'BDT ',
  }
};

const MatrimonyLanguageContext = createContext<LanguageContextType>({
  lang: 'bn',
  setLang: () => {},
  t: (key) => key,
});

export const MatrimonyLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('bm_lang');
    return (saved === 'en' || saved === 'bn') ? saved : 'bn';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('bm_lang', newLang);
  };

  const t = (key: string, defaultText?: string): string => {
    return translations[lang]?.[key] || translations['en']?.[key] || defaultText || key;
  };

  return (
    <MatrimonyLanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </MatrimonyLanguageContext.Provider>
  );
};

export const useMatrimonyLanguage = () => useContext(MatrimonyLanguageContext);
