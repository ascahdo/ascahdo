import React, { useEffect } from 'react';
import { useTranslation } from '../locales/i18nContext';

interface SEOHeadProps {
  currentView: string;
}

interface SEOData {
  titleBn: string;
  titleEn: string;
  titleAr: string;
  descBn: string;
  descEn: string;
  descAr: string;
  keywords: string;
}

const VIEW_SEO_MAP: Record<string, SEOData> = {
  home: {
    titleBn: 'এসকাডো - সমন্বিত এনজিও ও হালাল মার্কেটপ্লেস প্ল্যাটফর্ম',
    titleEn: 'ASCAHDO - Integrated Multi-NGO & Halal Marketplace Platform',
    titleAr: 'اسكادو - منصة المنظمات غير الحكومية المتكاملة والسوق الحلال',
    descBn: 'এসকাডো সমন্বিত প্ল্যাটফর্মে রক্তদান, শিক্ষা প্রতিষ্ঠান ERP, সমিতি ও ক্ষুদ্রঋণ, অনুদান ও পূর্ণাঙ্গ হালাল মার্কেটপ্লেস।',
    descEn: 'ASCAHDO integrated multi-organization platform featuring Halal Marketplace, Emergency Blood SOS, School ERP, and Charity.',
    descAr: 'منصة اسكادو الموحدة للرعاية الاجتماعية، بنك الدم للطوارئ، السوق الحلال، وإدارة المدارس والجمعيات الخيرية.',
    keywords: 'ASCAHDO, এসকাডো, হালাল মার্কেটপ্লেস, রক্তদান SOS, স্কুল সফটওয়্যার, যাকাত'
  },
  marketplace: {
    titleBn: 'হালাল মার্কেটপ্লেস ও ডিজিটাল পণ্য ভল্ট | এসকাডো',
    titleEn: 'Halal Marketplace & Digital Asset Vault | ASCAHDO',
    titleAr: 'السوق الحلال وخزينة المنتجات الرقمية | اسكادو',
    descBn: '১০০% হালাল ডিজিটাল ও ফিজিক্যাল পণ্য, বান্ডিল অফার, লাইসেন্স কী এবং সিকিউর ইনস্ট্যান্ট ডাউনলোড ভল্ট।',
    descEn: '100% Halal certified physical and digital products, bundle discounts, license vault and instant secure downloads.',
    descAr: 'منتجات مادية ورقمية حلال معتمدة، باقات وعروض حصرية، وخزينة آمنة لتراخيص المنتجات الرقمية.',
    keywords: 'হালাল পণ্য, ডিজিটাল শপ, হালাল মার্কেটপ্লেস, halal e-commerce, digital products, software license, bundle sale'
  },
  'blood-bank': {
    titleBn: 'জরুরি লাইভ ব্লাড ব্যাংক ও SOS ডোনার নেটওয়ার্ক | এসকাডো',
    titleEn: 'Emergency Live Blood Bank & SOS Donor Network | ASCAHDO',
    titleAr: 'بنك الدم الحي وشبكة المتبرعين للطوارئ | اسكادو',
    descBn: 'সারাদেশে জরুরি রক্তের জন্য লাইভ ডোনার খুঁজুন এবং বিনামূল্যে রক্তদাতা হিসেবে নিবন্ধন করুন।',
    descEn: 'Find live blood donors nationwide for emergency transfusions and register as a voluntary blood donor.',
    descAr: 'ابحث عن متبرعي الدم في حالات الطوارئ في جميع أنحاء البلاد وسجل كمتبرع طوعي بالدم.',
    keywords: 'রক্তদান, ব্লাড ব্যাংক বাংলাদেশ, blood donor, emergency blood sos, thalassaemia blood'
  },
  school: {
    titleBn: 'স্মার্ট স্কুল, মাদ্রাসা ও কলেজ ম্যানেজমেন্ট ERP | এসকাডো',
    titleEn: 'Smart School, Madrasa & College Management ERP | ASCAHDO',
    titleAr: 'نظام إدارة المدارس والجامعات الذكي ERP | اسكادو',
    descBn: 'মাল্টি-ব্রাঞ্চ শিক্ষা প্রতিষ্ঠান, ডিজিটাল হাজিরা, অনলাইন ফি কালেকশন, রেজাল্ট শিট ও এডমিট কার্ড সফটওয়্যার।',
    descEn: 'Comprehensive multi-tenant school, madrasa & college management ERP with fees, results, and digital attendance.',
    descAr: 'نظام إلكتروني شامل لإدارة المدارس والكتاتيب والجامعات، التحصيل المالي، النتائج والحضور الرقمي.',
    keywords: 'স্কুল ম্যানেজমেন্ট সফটওয়্যার, মাদ্রাসা ইআরপি, school management software, student attendance, fees collection'
  },
  donation: {
    titleBn: 'যাকাত, সদকা ও মানবিক অনুদান তহবিল | এসকাডো চ্যারিটি',
    titleEn: 'Zakat, Sadaqah & Humanitarian Relief Funds | ASCAHDO',
    titleAr: 'صناديق الزكاة والصدقات والإغاثة الإنسانية | اسكادو',
    descBn: 'স্বচ্ছতার সাথে দুর্যোগ পুনর্বাসন, এতিম প্রতিপালন ও যাকাত তহবিলে ডিজিটাল অনুদান ও সার্টিফিকেট লাভ।',
    descEn: 'Transparent digital donations for disaster relief, orphan sponsorship, and Zakat with instant receipt & certificate.',
    descAr: 'تبرعات رقمية موثوقة وشفافة لإغاثة المتضررين، كفالة الأيتام، وحساب وتوزيع الزكاة الشرعية.',
    keywords: 'অনলাইন অনুদান, যাকাত ক্যালকুলেটর, zakat donation bangladesh, charity relief fund'
  },
  somiti: {
    titleBn: 'সমিতি ও ক্ষুদ্রঋণ ডিজিটাল ম্যানেজমেন্ট পোর্টাল | এসকাডো',
    titleEn: 'Somiti & Microcredit Management Portal | ASCAHDO',
    titleAr: 'بوابة إدارة الجمعيات والتمويل الأصغر | اسكادو',
    descBn: 'দৈনিক ও মাসিক কিস্তি আদায়, সঞ্চয় হিসাব, শেয়ার ও লাভ-লোকসান হিসাবের পূর্ণাঙ্গ সমবায় সফটওয়্যার।',
    descEn: 'End-to-end somiti, cooperative society, savings and installment loan management system.',
    descAr: 'إدارة متكاملة للجمعيات التعاونية، حسابات الادخار والتمويل الأصغر بنظام إسلامي شفاف.',
    keywords: 'সমিতি সফটওয়্যার, ক্ষুদ্রঋণ, somiti software, microcredit loan management, samity savings'
  },
  'real-estate': {
    titleBn: 'হালাল রিয়েল এস্টেট ও জমি খতিয়ান (CS) পোর্টাল | এসকাডো',
    titleEn: 'Halal Real Estate & Land Record (CS) Portal | ASCAHDO',
    titleAr: 'العقارات الحلال وسجلات الأراضي | اسكادو',
    descBn: 'নিরাপদ জমি ক্রয়-বিক্রয়, সিএস খতিয়ান যাচাই ও শরীয়াহ সম্মত আবাসন প্রকল্প।',
    descEn: 'Verified halal real estate properties, land record CS khatian validation, and residential plots.',
    descAr: 'عقارات حلال موثقة، فحص ملكيات الأراضي والسجلات الرسمية، ومشاريع سكنية موثوقة.',
    keywords: 'জমি কেনাবেচা, সিএস খতিয়ান, halal property, land record bangladesh, real estate'
  },
  marriage: {
    titleBn: 'ইসলামিক নিকাহ ও দ্বীনি পাত্র-পাত্রী মিডিয়া | এসকাডো',
    titleEn: 'Islamic Matrimony & Verified Nikah Media | ASCAHDO',
    titleAr: 'منصة الزواج الإسلامي الشرعي | اسكادو',
    descBn: 'সম্পূর্ণ পর্দা ও শরীয়াহ মেনে দ্বীনি পাত্র-পাত্রীর সন্ধান এবং পারিবারিক অভিভাবকত্ব ভিত্তিক ম্যাচমেকিং।',
    descEn: 'Shariah-compliant Islamic matrimony portal with verified pious brides and grooms under guardian supervision.',
    descAr: 'خدمة التوفيق للزواج الشرعي الملتزم بضوابط الشريعة وبإشراف أولياء الأمور.',
    keywords: 'দ্বীনি পাত্র পাত্রী, ইসলামিক নিকাহ, halal matrimony, islamic marriage media'
  },
  'medical-courses': {
    titleBn: 'প্যারামেডিকেল, নার্সিং ও মেডিকেল টেকনোলজি কোর্স | সিএমএসএস',
    titleEn: 'Paramedical, Nursing & Medical Technology Courses | CMSS',
    titleAr: 'الدورات شبه الطبية والتمريض والتكنولوجيا الطبية',
    descBn: 'স্বাস্থ্য অধিদপ্তর স্বীকৃত ডিএমএলটি, ডেন্টাল, ফার্মেসি ও নার্সিং ডিপ্লোমা কোর্স ভর্তি ও রেজিস্ট্রেশন।',
    descEn: 'Government recognized Paramedical, Pharmacy, Dental, and Nursing diploma courses admissions and verification.',
    descAr: 'دورات ودبلومات معتمدة في التحاليل الطبية والتمريض وطب الأسنان والصيدلة.',
    keywords: 'প্যারামেডিকেল ভর্তি, নার্সিং কোর্স, paramedical courses, nursing admission, DMLT diploma'
  }
};

export const SEOHead: React.FC<SEOHeadProps> = ({ currentView }) => {
  const { language } = useTranslation();

  useEffect(() => {
    const seoData = VIEW_SEO_MAP[currentView] || VIEW_SEO_MAP['home'];

    // Select title & description based on active language
    const pageTitle = language === 'bn' 
      ? seoData.titleBn 
      : language === 'ar' 
      ? seoData.titleAr 
      : seoData.titleEn;

    const pageDesc = language === 'bn'
      ? seoData.descBn
      : language === 'ar'
      ? seoData.descAr
      : seoData.descEn;

    // 1. Update Document Title
    document.title = `${pageTitle} - ASCAHDO`;

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', pageDesc);

    // 3. Update Open Graph Meta
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', pageDesc);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      const hash = currentView === 'home' ? '' : `#${currentView}`;
      ogUrl.setAttribute('content', `https://ascado.org/${hash}`);
    }

    // 4. Update Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      const hash = currentView === 'home' ? '' : `#${currentView}`;
      canonical.setAttribute('href', `https://ascado.org/${hash}`);
    }

    // 5. Update Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && seoData.keywords) {
      metaKeywords.setAttribute('content', `${seoData.keywords}, ASCAHDO`);
    }

  }, [currentView, language]);

  return null; // Side-effect only component
};
