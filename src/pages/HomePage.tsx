import React, { useState, useEffect } from 'react';
import { useTranslation } from '../locales/i18nContext';
import { useAuth } from '../context/AuthContext';
import {
  Heart, HeartPulse, Sparkles, Droplet, Users, ShieldCheck,
  Building2, ArrowRight, CheckCircle2, ChevronRight, BookOpen,
  ShoppingBag, PhoneCall, Award, Globe, HelpCircle
} from 'lucide-react';
import { api } from '../services/api';
import { HeroSlider } from '../components/HeroSlider';
import { HomeServiceMenuGrid } from '../components/HomeServiceMenuGrid';
import { HomePhotoGallerySlider } from '../components/HomePhotoGallerySlider';
import { AdBannerBox } from '../components/AdBannerBox';

interface HomePageProps {
  onNavigate: (view: string) => void;
  onOpenDonationModal: (campaign?: any) => void;
  onOpenBloodSOS: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenDonationModal,
  onOpenBloodSOS
}) => {
  const { isBn } = useTranslation();
  const { user } = useAuth();

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [urgentBloodRequests, setUrgentBloodRequests] = useState<any[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [cRes, summaryRes, donorsRes] = await Promise.all([
          api.getCampaigns().catch(() => []),
          api.getDonationSummary().catch(() => null),
          api.getDonors().catch(() => [])
        ]);

        setCampaigns(cRes || []);
        if (summaryRes) {
          setStats({
            totalDonations: summaryRes.totalRaised || summaryRes.totalDonations || 1285000,
            activeDonors: (donorsRes && donorsRes.length) ? `${donorsRes.length}+` : '৪,৮৫০+',
            totalMembers: '১৫,২০০+'
          });
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      }
    };
    loadHomeData();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSubscribed(false), 5000);
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-sans selection:bg-[#0D5C5A] selection:text-white space-y-8 sm:space-y-12 pb-12">
      
      {/* 1. MAIN DYNAMIC HERO SLIDER */}
      <section className="relative">
        <HeroSlider
          onNavigate={onNavigate}
          onOpenDonationModal={onOpenDonationModal}
          onOpenBloodSOS={onOpenBloodSOS}
        />
      </section>

      {/* 2. REAL-TIME IMPACT STATS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-center">
            
            <div className="space-y-1 pt-3 md:pt-0">
              <div className="w-11 h-11 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-2">
                <Heart className="w-6 h-6 fill-emerald-100" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {stats?.totalDonations ? `৳${(stats.totalDonations || 0).toLocaleString()}` : '৳১২,৮৫,০০০+'}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {isBn ? 'সংগৃহীত স্বচ্ছ অনুদান' : 'Total Donations Raised'}
              </div>
            </div>

            <div className="space-y-1 pt-3 md:pt-0">
              <div className="w-11 h-11 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-2">
                <HeartPulse className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {stats?.activeDonors || '৪,৮৫০+'}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {isBn ? 'নিবন্ধিত রক্তদাতা' : 'Verified Blood Donors'}
              </div>
            </div>

            <div className="space-y-1 pt-3 md:pt-0">
              <div className="w-11 h-11 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-2">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {stats?.totalMembers || '১৫,২০০+'}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {isBn ? 'সদস্য ও উপকারভোগী' : 'Members & Beneficiaries'}
              </div>
            </div>

            <div className="space-y-1 pt-3 md:pt-0">
              <div className="w-11 h-11 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-2">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                ৬৪
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {isBn ? 'জেলাজুড়ে সক্রিয় কার্যক্রম' : 'Districts & Branches'}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. TOP SPONSORED BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBannerBox zoneId="home_top_banner" />
      </section>

      {/* 4. MAIN SERVICE MENU GRID (ALL PREVIOUS CATEGORIES & ALL MODULES) */}
      <section id="services-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomeServiceMenuGrid
          onNavigate={onNavigate}
          onOpenDonationModal={onOpenDonationModal}
          onOpenBloodSOS={onOpenBloodSOS}
        />
      </section>

      {/* 5. URGENT BLOOD SOS HIGHLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-red-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-rose-500/30 text-rose-200 border border-rose-400/40 px-3 py-1 rounded-full text-xs font-bold">
                <HeartPulse className="w-4 h-4 animate-ping text-rose-300" />
                <span>{isBn ? 'জরুরি রক্তসেবা ২৪/৭' : 'Emergency Blood SOS 24/7'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {isBn ? 'মুহূর্তেই রক্তদাতা খুঁজে পান অথবা রক্ত দিন' : 'Find Blood Donors Instantly or Donate Blood'}
              </h3>
              <p className="text-xs sm:text-sm text-rose-100 max-w-2xl leading-relaxed">
                {isBn
                  ? 'আপনার এক ব্যাগ রক্ত বাঁচাতে পারে একটি মুমূর্ষু রোগীর প্রাণ। সরাসরি রোগীর স্বজনের সাথে যোগাযোগ করুন কোনো মধ্যস্থতাকারী ছাড়া।'
                  : 'Your single bag of blood can save a precious life. Connect directly with patients and verified donors.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onOpenBloodSOS}
                className="bg-white hover:bg-rose-50 text-rose-800 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <HeartPulse className="w-4 h-4 text-rose-600" />
                <span>{isBn ? 'জরুরি রক্ত রিকুয়েস্ট (SOS)' : 'Post Emergency Request'}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('blood-bank')}
                className="bg-rose-950/40 hover:bg-rose-950/60 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl border border-rose-300/30 transition cursor-pointer"
              >
                {isBn ? 'রক্তদাতা তালিকা দেখুন' : 'Search Donors'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURED CAMPAIGNS & HUMANITARIAN CAUSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D5C5A] uppercase tracking-wider mb-1">
              <Heart className="w-3.5 h-3.5 fill-[#0D5C5A]" />
              <span>{isBn ? 'স্বচ্ছ তহবিল ও অনুদান' : 'Transparent Campaigns'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isBn ? 'চলমান মানবিক সহায়তা কার্যক্রম' : 'Ongoing Relief & Support Causes'}
            </h2>
          </div>

          <button
            onClick={() => onNavigate('donation')}
            className="text-xs font-bold text-[#0D5C5A] hover:text-[#072829] flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>{isBn ? 'সকল তহবিল দেখুন' : 'View All Campaigns'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.slice(0, 3).map((camp, idx) => {
            const target = camp.targetAmount || 500000;
            const raised = camp.raisedAmount || 150000;
            const progress = Math.min(Math.round((raised / target) * 100), 100);

            return (
              <div
                key={camp.id || idx}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={camp.imageUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80'}
                    alt={camp.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black text-emerald-800 shadow-xs">
                    {progress}% {isBn ? 'সংগৃহীত' : 'Raised'}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-black text-base text-slate-900 group-hover:text-[#0D5C5A] transition line-clamp-1">
                      {isBn && camp.titleBn ? camp.titleBn : camp.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {isBn && camp.descriptionBn ? camp.descriptionBn : camp.description || 'সহায়তায় এগিয়ে আসুন এবং অসহায় মানুষের পাশে দাঁড়ান।'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#0D5C5A] h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-600">৳{(raised || 0).toLocaleString()}</span>
                      <span className="text-slate-400 font-medium">{isBn ? 'লক্ষ্যমাত্রা' : 'Target'}: ৳{(target || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenDonationModal(camp)}
                    className="w-full py-3 bg-[#0B3B3C] hover:bg-[#072829] text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{isBn ? 'এখনই দান করুন' : 'Donate Now'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. MIDDLE AD BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBannerBox zoneId="home_middle_banner" />
      </section>

      {/* 8. OFFICIAL PHOTO & ACTIVITY GALLERY SLIDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomePhotoGallerySlider onNavigate={onNavigate} />
      </section>

      {/* 9. MISSION, VISION & COMMUNITY IMPACT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0A3334] to-[#0D5C5A] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/10 text-emerald-300 border border-white/20 px-3.5 py-1 rounded-full text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>{isBn ? 'স্বচ্ছতা ও জবাবদিহিতা' : 'Transparency & Accountability'}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                {isBn
                  ? 'সকল সেবামূলক কার্যক্রম ও অনুদানের ডিজিটাল হিসাব'
                  : 'Digital Accountability in Social Welfare'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
                {isBn
                  ? 'এসকাডো ও সাজেদা ইয়ুথ ফাউন্ডেশন কোনো সাধারণ প্ল্যাটফর্ম নয়; এটি তৃণমূল পর্যায়ে সেবা নিশ্চিত করার একটি স্বয়ংসম্পূর্ণ নেটওয়ার্ক। ব্লাড ব্যাংক, শিক্ষা, ক্ষুদ্রঋণ সমিতি ও ত্রাণ তহবিলের প্রতিটি হিসাব সংরক্ষিত ও ভেরিফাইড।'
                  : 'ASCAHDO and Sajeda Youth Foundation connect communities with verified welfare, medical, education, and financial management tools.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                  <div className="text-lg font-black text-amber-300 mb-1">১০০% স্বচ্ছতা</div>
                  <div className="text-xs text-slate-300">{isBn ? 'পাবলিক অডিট লেজার ও রসিদ' : 'Public audit receipts'}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                  <div className="text-lg font-black text-amber-300 mb-1">২৪/৭ সহায়তা</div>
                  <div className="text-xs text-slate-300">{isBn ? 'জরুরি রক্তের চাহিদা সমাধান' : 'Emergency Blood Support'}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                  <div className="text-lg font-black text-amber-300 mb-1">৬৪ জেলা</div>
                  <div className="text-xs text-slate-300">{isBn ? 'দেশব্যাপী সক্রিয় স্বেচ্ছাসেবী' : 'Nationwide Volunteers'}</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('volunteer')}
                className="w-full py-4 bg-[#EBB82D] hover:bg-[#d8a520] text-slate-950 font-black rounded-2xl text-sm shadow-xl transition transform hover:-translate-y-0.5 cursor-pointer text-center"
              >
                {isBn ? 'স্বেচ্ছাসেবক হিসেবে যোগ দিন' : 'Register as Volunteer'}
              </button>
              <button
                onClick={() => onNavigate('constitution')}
                className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs border border-white/20 transition cursor-pointer text-center"
              >
                {isBn ? 'সাংগঠনিক গঠনতন্ত্র ও বিধিমালা' : 'View Constitution & Law'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. NEWSLETTER SUBSCRIPTION & COMMUNITY UPDATES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-black text-slate-900">
              {isBn ? 'নিয়মিত আপডেট পেতে সাবস্ক্রাইব করুন' : 'Subscribe for Regular Updates'}
            </h4>
            <p className="text-xs text-slate-500">
              {isBn ? 'নতুন ক্যাম্পেইন, রক্তদান কর্মসূচি ও সেবামূলক ইভেন্টের নোটিফিকেশন পান।' : 'Get notifications for new relief campaigns, blood drives, and community events.'}
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex w-full md:w-auto gap-2 max-w-md">
            <input
              type="email"
              required
              placeholder={isBn ? 'আপনার ইমেইল ঠিকানা লিখুন...' : 'Enter your email...'}
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#0D5C5A]/20 focus:border-[#0D5C5A] outline-hidden font-medium"
            />
            <button
              type="submit"
              className="bg-[#0B3B3C] hover:bg-[#072829] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer shrink-0"
            >
              {newsletterSubscribed ? (isBn ? 'ধন্যবাদ!' : 'Subscribed!') : (isBn ? 'সাবস্ক্রাইব' : 'Subscribe')}
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};
