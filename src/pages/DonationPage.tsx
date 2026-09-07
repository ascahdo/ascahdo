import React, { useState, useEffect } from 'react';
import {
  EmergencyAppeal,
  DonationProject,
  OfficialDonationTransaction,
  DonationExpense,
  DonorRecognitionItem,
  TransparencySummary,
  DonationCategoryType
} from '../types/donationTypes';
import { DONATION_CATEGORIES, formatTakaBn } from '../utils/donationUtils';
import { api } from '../services/api';
import {
  Heart, ShieldCheck, Sparkles, Calculator, Search,
  QrCode, TrendingUp, Users, CheckCircle2, ArrowRight,
  AlertCircle, Building2, Smartphone, Download, Award,
  Calendar, Check, Filter, Layers, Clock, MapPin, Eye,
  BookOpen, HelpCircle, PhoneCall, Mail, ChevronRight,
  Share2, Globe, ExternalLink, ThumbsUp, Landmark, Star,
  Compass, FileCheck, DollarSign
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// Subcomponents & Modals
import { DonationModal } from '../components/donations/DonationModal';
import { DonationReceiptModal } from '../components/donations/DonationReceiptModal';
import { ZakatCalculatorModal } from '../components/donations/ZakatCalculatorModal';
import { ReceiptVerificationModal } from '../components/donations/ReceiptVerificationModal';
import { DonationTransparencySection } from '../components/donations/DonationTransparencySection';
import { DonorWallSection } from '../components/donations/DonorWallSection';
import { ProjectCaseStudyModal } from '../components/donations/ProjectCaseStudyModal';

interface DonationPageProps {
  onOpenDonationModal?: (campaign?: any) => void;
  onNavigate?: (view: string) => void;
}

export const DonationPage: React.FC<DonationPageProps> = ({ onNavigate }) => {
  // Data States
  const [appeals, setAppeals] = useState<EmergencyAppeal[]>([]);
  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [transactions, setTransactions] = useState<OfficialDonationTransaction[]>([]);
  const [expenses, setExpenses] = useState<DonationExpense[]>([]);
  const [donorWall, setDonorWall] = useState<DonorRecognitionItem[]>([]);
  const [summary, setSummary] = useState<TransparencySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Tabs
  const [activePortfolioView, setActivePortfolioView] = useState<'all' | 'projects' | 'appeals' | 'sectors' | 'transparency' | 'zakat' | 'bank'>('all');
  const [projectTab, setProjectTab] = useState<'ongoing' | 'completed' | 'upcoming'>('ongoing');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals States
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isZakatModalOpen, setIsZakatModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isCaseStudyModalOpen, setIsCaseStudyModalOpen] = useState(false);

  // Active Context for Modals
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<DonationProject | null>(null);
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState<DonationCategoryType>('helpless_support');
  const [selectedAmountForModal, setSelectedAmountForModal] = useState<number>(1000);
  const [selectedCampaignTitle, setSelectedCampaignTitle] = useState<string>('');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | undefined>(undefined);
  const [activeTransactionForReceipt, setActiveTransactionForReceipt] = useState<OfficialDonationTransaction | null>(null);

  // Load All Donation Data
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        const [
          appealsRes,
          projectsRes,
          txRes,
          expRes,
          wallRes,
          summaryRes
        ] = await Promise.all([
          api.getEmergencyAppeals().catch(() => []),
          api.getDonationProjects().catch(() => []),
          api.getDonationTransactions().catch(() => []),
          api.getDonationExpenses().catch(() => []),
          api.getDonorWall().catch(() => []),
          api.getDonationSummary().catch(() => null)
        ]);

        setAppeals(appealsRes || []);
        setProjects(projectsRes || []);
        setTransactions(txRes || []);
        setExpenses(expRes || []);
        setDonorWall(wallRes || []);
        setSummary(summaryRes);
      } catch (err) {
        console.error('Failed to load donation data', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Handlers
  const handleOpenDonateModal = (params?: {
    category?: DonationCategoryType;
    amount?: number;
    title?: string;
    id?: string;
  }) => {
    setSelectedCategoryForModal(params?.category || 'helpless_support');
    setSelectedAmountForModal(params?.amount || 1000);
    setSelectedCampaignTitle(params?.title || '');
    setSelectedCampaignId(params?.id);
    setIsDonationModalOpen(true);
  };

  const handleDonationSuccess = (tx: OfficialDonationTransaction) => {
    // Add to local state
    setTransactions((prev) => [tx, ...prev]);
    setActiveTransactionForReceipt(tx);
    setIsReceiptModalOpen(true);

    // Refresh summary & projects
    api.getDonationSummary().then(setSummary).catch(() => {});
    api.getDonationProjects().then(setProjects).catch(() => {});
  };

  const handleOpenCaseStudy = (project: DonationProject) => {
    setSelectedProjectForModal(project);
    setIsCaseStudyModalOpen(true);
  };

  const handleOpenCertificateFromWall = (donor: DonorRecognitionItem) => {
    const sampleTx: OfficialDonationTransaction = {
      id: `cert_${donor.id}`,
      receiptNumber: `ASC-REC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      certificateNumber: donor.certificateNumber,
      donorName: donor.donorName,
      donorPhone: donor.donorPhone || '+8801700000000',
      donorDistrict: donor.donorDistrict,
      amount: donor.totalDonationAmount,
      frequency: donor.donorType === 'monthly_supporter' ? 'monthly' : 'one_time',
      category: 'helpless_support',
      categoryNameBn: 'সার্বিক মানবকল্যাণ ও দুর্যোগ ফান্ড',
      campaignTitle: 'সার্বিক মানবকল্যাণ তহবিল',
      paymentMethod: 'bkash',
      transactionId: 'BK99482103',
      status: 'approved',
      isAnonymous: donor.isAnonymous,
      isCertificateIssued: true,
      qrCodeData: `VERIFIED|${donor.certificateNumber}|${donor.donorName}|${donor.totalDonationAmount}`,
      createdAt: donor.joinedDate || new Date().toISOString()
    };
    setActiveTransactionForReceipt(sampleTx);
    setIsReceiptModalOpen(true);
  };

  // Filter projects by status, category & search
  const filteredProjects = (projects || []).filter((p) => {
    if (!p) return false;
    const matchStatus = p.status === projectTab;
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch = searchQuery.trim() === '' || 
      (p.titleBn && p.titleBn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.locationBn && p.locationBn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.descriptionBn && p.descriptionBn.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchCategory && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 sm:space-y-16">
      
      {/* ========================================================
          1. INSTITUTIONAL SHOWCASE & HERO PORTFOLIO BANNER
      ======================================================== */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 text-white shadow-2xl border border-emerald-900/60 p-6 sm:p-10 lg:p-14">
        {/* Ambient Atmosphere Accents */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[480px] h-[480px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-[400px] h-[400px] bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
          
          {/* Main Showcase Hero Text */}
          <div className="space-y-5 max-w-3xl">
            {/* Accreditation Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] sm:text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>আসকাডো মানবকল্যাণ ট্রাস্ট ও সেন্ট্রাল ট্রেজারি</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>শতভাগ শরীয়াহসম্মত ও সরকারি অডিটেড</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.15]">
              মানবকল্যাণে নিবেদিত <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300">
                স্বচ্ছ ও নির্ভরযোগ্য দান ও যাকাত পোর্টফোলিও
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl">
              অসহায় মানুষের চিকিৎসা, এতিম প্রতিপালন, নিরাপদ সুপেয় পানি, দুর্যোগকালীন জরুরি ত্রাণ এবং স্বাবলম্বীকরণ উদ্যোগের সার্বিক পোর্টফোলিও। আপনার প্রতিটি পয়সা সরাসরি মাঠপর্যায়ে ব্যয়ের ডিজিটাল প্রমাণপত্র, তাৎক্ষণিক <strong className="text-white">Official Money Receipt</strong> ও <strong className="text-white">Donor Appreciation Certificate</strong> সহ নিশ্চিত করুন।
            </p>

            {/* Main Interactive CTA Ribbon */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  if (onNavigate) onNavigate('charity');
                }}
                className="bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl shadow-xl shadow-emerald-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>সাজেদা ইয়ুথ ফাউন্ডেশন প্ল্যাটফর্ম</span>
              </button>

              <button
                onClick={() => handleOpenDonateModal()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-5 py-3.5 sm:py-4 rounded-2xl shadow-md transition flex items-center gap-2 border border-emerald-400/40 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>সরাসরি অনুদান দিন (Donate)</span>
              </button>

              <button
                onClick={() => setIsZakatModalOpen(true)}
                className="bg-amber-600/90 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm px-5 py-3.5 sm:py-4 rounded-2xl shadow-md transition flex items-center gap-2 border border-amber-400/40 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-amber-200" />
                <span>শরীয়াহ যাকাত ক্যালকুলেটর</span>
              </button>

              <button
                onClick={() => setIsVerifyModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3.5 sm:py-4 rounded-2xl transition flex items-center gap-2 border border-white/20 cursor-pointer"
              >
                <Search className="w-4 h-4 text-emerald-300" />
                <span>রসিদ ও সার্টিফিকেট যাচাই</span>
              </button>
            </div>
          </div>

          {/* Right Live Treasury Card */}
          <div className="w-full lg:w-88 bg-white/5 backdrop-blur-xl border border-white/15 rounded-3xl p-6 space-y-5 shrink-0 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">কেন্দ্রীয় তহবিল খতিয়ান</span>
              </div>
              <span className="text-[10px] text-emerald-300 font-mono font-bold bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                LIVE AUDIT
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">সর্বমোট সংগৃহীত অনুদান ও সদকা:</span>
                <span className="font-mono font-black text-2xl sm:text-3xl text-emerald-300">
                  {summary ? formatTakaBn(summary.totalCollected) : '৳ ৩৮,৯০,০০০'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-400 block">সম্মানিত দাতা:</span>
                  <span className="font-mono font-black text-white text-base">
                    {summary?.totalDonorsCount != null ? Number(summary.totalDonorsCount).toLocaleString() : '৩,৮৪০'} জন
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-400 block">প্রত্যক্ষ উপকৃত মানুষ:</span>
                  <span className="font-mono font-black text-teal-300 text-base">
                    {summary?.totalBeneficiariesCount != null ? Number(summary.totalBeneficiariesCount).toLocaleString() : '১৪,২০০+'} জন
                  </span>
                </div>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-500/20 p-3 rounded-2xl flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">তহবিল রিজার্ভ ব্যালেন্স:</span>
                <span className="font-black text-emerald-300">
                  {summary ? formatTakaBn(summary.reserveBalance) : '৳ ২৪,৫০,০০০'}
                </span>
              </div>
            </div>

            <div className="pt-1 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>১০০% ক্যাশলেস, নো-অ্যাডমিন কস্ট পলিসি</span>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================
          2. INSTITUTIONAL PORTFOLIO NAVIGATION TABS
      ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 sm:p-3 shadow-xs sticky top-16 z-30 flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'all', label: 'সকল পোর্টফোলিও (All Hub)', icon: Layers },
          { id: 'projects', label: 'প্রকল্প ও কেস স্টাডি (Projects)', icon: Building2 },
          { id: 'appeals', label: 'জরুরি মানবিক তহবিল (Appeals)', icon: AlertCircle },
          { id: 'sectors', label: 'নির্দিষ্ট দানের খাতসমূহ (Sectors)', icon: Compass },
          { id: 'transparency', label: 'আর্থিক স্বচ্ছতা ও অডিট (Audit)', icon: TrendingUp },
          { id: 'zakat', label: 'শরীয়াহ যাকাত সেন্টার (Zakat)', icon: Calculator },
          { id: 'bank', label: 'ব্যাংক হিসাব ও পেমেন্ট চ্যানেল', icon: Smartphone }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activePortfolioView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActivePortfolioView(tab.id as any);
                const el = document.getElementById(`section_${tab.id}`);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          3. KEY IMPACT PILLARS & STATISTICAL SHOWCASE
      ======================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-3xl p-5 sm:p-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-3xl text-emerald-950">২৮+ টি</div>
          <p className="text-xs sm:text-sm font-bold text-emerald-800">সফল মানবিক প্রকল্প</p>
          <span className="text-[11px] text-slate-500 block">সারাদেশে মাঠপর্যায়ে সম্পন্ন</span>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80 rounded-3xl p-5 sm:p-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <Users className="w-6 h-6" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-3xl text-blue-950">১৪,২০০+</div>
          <p className="text-xs sm:text-sm font-bold text-blue-800">প্রত্যক্ষ উপকারভোগী</p>
          <span className="text-[11px] text-slate-500 block">দরিদ্র ও নিঃস্ব পরিবার</span>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/80 rounded-3xl p-5 sm:p-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-3xl text-purple-950">৫৪+ টি</div>
          <p className="text-xs sm:text-sm font-bold text-purple-800">দুর্গম উপজেলা কাভারেজ</p>
          <span className="text-[11px] text-slate-500 block">চর, পাহাড় ও উপকূলীয় অঞ্চল</span>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-5 sm:p-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-3xl text-amber-950">১০০%</div>
          <p className="text-xs sm:text-sm font-bold text-amber-800">স্বচ্ছ ডিজিটাল অডিট</p>
          <span className="text-[11px] text-slate-500 block">ডিজিটাল মানি রসিদ ও ভাউচার</span>
        </div>
      </div>

      {/* ========================================================
          4. EMERGENCY APPEALS & URGENT RELIEF (জরুরি আপদকালীন তহবিল)
      ======================================================== */}
      <div id="section_appeals" className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>জরুরি মানবিক আবেদন (Urgent Philanthropy Appeals)</span>
            </div>
            <h2 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              তাৎক্ষণিক জীবনরক্ষাকারী ও আপদকালীন তহবিল
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md sm:text-right">
            গুরুতর রোগীর চিকিৎসা ও আকস্মিক দুর্যোগে ক্ষতিগ্রস্থদের জন্য সরাসরি ত্রাণ সহায়তা।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {appeals.map((appeal) => {
            const percentage = Math.min(100, Math.round((appeal.raisedAmount / appeal.targetAmount) * 100));
            const neededAmount = Math.max(0, appeal.targetAmount - appeal.raisedAmount);

            return (
              <div
                key={appeal.id}
                className="bg-white rounded-3xl border-2 border-rose-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-rose-300 transition duration-300 group"
              >
                <div className="relative h-60 overflow-hidden bg-slate-900">
                  <img
                    src={appeal.imageUrl}
                    alt={appeal.titleBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                  
                  <div className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>জরুরি অগ্রাধিকার (High Urgency)</span>
                  </div>

                  {appeal.daysLeft && (
                    <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 border border-amber-400/20">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>আর মাত্র {appeal.daysLeft} দিন বাকি</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{appeal.locationBn || 'সারা বাংলাদেশ'}</span>
                      {appeal.isVerified && (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.2 rounded-full text-[10px]">
                          ✓ ভেরিফাইড কেস
                        </span>
                      )}
                    </div>
                    <h3 className="font-black text-lg sm:text-xl text-white leading-snug drop-shadow-md mt-1">
                      {appeal.titleBn}
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {appeal.storyBn || appeal.descriptionBn}
                  </p>

                  {/* Progress Breakdown */}
                  <div className="space-y-3 bg-slate-50 border border-slate-200/90 rounded-2xl p-4">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="text-slate-600 font-bold">সংগৃহীত: <strong className="font-mono text-emerald-700 text-sm sm:text-base">{formatTakaBn(appeal.raisedAmount)}</strong></span>
                      <span className="text-slate-600 font-bold">লক্ষ্যমাত্রা: <strong className="font-mono text-slate-900 text-sm sm:text-base">{formatTakaBn(appeal.targetAmount)}</strong></span>
                    </div>

                    <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 h-full rounded-full transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-600">
                      <span className="font-black text-rose-700">{percentage}% সংগ্রহ সম্পন্ন ({appeal.donorCount} জন দাতা)</span>
                      <span className="font-black text-slate-800">বাকি প্রয়োজন: {formatTakaBn(neededAmount)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleOpenDonateModal({
                        category: 'emergency_relief',
                        title: appeal.titleBn,
                        id: appeal.id,
                        amount: 2500
                      })
                    }
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm py-4 rounded-2xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>এই জরুরি তহবিলে এখনই সহায়তা দিন</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          5. COMPLETE PROJECT PORTFOLIO & CASE STUDIES SHOWCASE
      ======================================================== */}
      <div id="section_projects" className="space-y-8">
        
        {/* Section Header with Search & Filter Hub */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-5 border-b border-slate-200 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>মানবকল্যাণ প্রকল্প পোর্টফোলিও (Project Portfolio Showcase)</span>
            </div>
            <h2 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              আসকাডো মানবিক উন্নয়ন উদ্যোগ ও বাস্তবায়ন খতিয়ান
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
              শিক্ষা, স্বাস্থ্য, এতিম পুনর্বাসন ও স্বাবলম্বীকরণ প্রকল্পের মাঠপর্যায়ের বিবরণ ও প্রভাব বিশ্লেষণ।
            </p>
          </div>

          {/* Status Lifecycle Switcher */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {[
              { id: 'ongoing', label: 'চলমান প্রকল্প (Ongoing)', count: (projects || []).filter(p => p && p.status === 'ongoing').length },
              { id: 'completed', label: 'সম্পন্ন প্রকল্প (Completed)', count: (projects || []).filter(p => p && p.status === 'completed').length },
              { id: 'upcoming', label: 'আসন্ন প্রকল্প (Upcoming)', count: (projects || []).filter(p => p && p.status === 'upcoming').length }
            ].map((stTab) => (
              <button
                key={stTab.id}
                onClick={() => setProjectTab(stTab.id as any)}
                className={`text-xs font-black px-4 py-2.5 rounded-2xl border transition flex items-center gap-2 ${
                  projectTab === stTab.id
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{stTab.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  projectTab === stTab.id ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {stTab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Sector Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
            <span className="text-xs font-bold text-slate-500 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              খাত:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition shrink-0 ${
                selectedCategory === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              সকল প্রকল্প ({projects.length})
            </button>
            {DONATION_CATEGORIES.slice(0, 6).map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition shrink-0 ${
                  selectedCategory === c.id ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.nameBn}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="প্রকল্প বা জেলা খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>
        </div>

        {/* Portfolio Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-14 text-center text-slate-500 space-y-3">
            <Layers className="w-10 h-10 mx-auto text-slate-400" />
            <p className="font-bold text-base text-slate-700">এই ক্যাটাগরিতে বর্তমানে কোনো প্রকল্প পাওয়া যায়নি।</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              সকল ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((prj) => {
              const prjPercentage = Math.min(100, Math.round((prj.raisedAmount / prj.targetAmount) * 100));
              const needed = Math.max(0, prj.targetAmount - prj.raisedAmount);

              return (
                <div
                  key={prj.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-emerald-300 transition duration-300 group"
                >
                  {/* Card Image Banner */}
                  <div className="relative h-52 overflow-hidden bg-slate-900">
                    <img
                      src={prj.imageUrl}
                      alt={prj.titleBn}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-xl border border-white/10">
                      {prj.categoryNameBn || prj.category}
                    </div>

                    <div className="absolute top-3 right-3">
                      {prj.status === 'completed' ? (
                        <span className="bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          সম্পন্ন প্রকল্প
                        </span>
                      ) : prj.status === 'upcoming' ? (
                        <span className="bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
                          আসন্ন উদ্যোগ
                        </span>
                      ) : (
                        <span className="bg-amber-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
                          চলমান প্রকল্প
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2 left-3 right-3 bg-slate-950/75 backdrop-blur-md text-white p-2.5 rounded-xl text-xs flex justify-between">
                      <span className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <strong className="text-emerald-300">{prj.locationBn || 'সারা দেশ'}</strong>
                      </span>
                      <span className="text-[11px]">
                        উপকারভোগী: <strong className="text-teal-300 font-mono">{prj.beneficiariesCount ? `${(prj.beneficiariesCount || 0).toLocaleString()} জন` : '১,২০০+'}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Card Content & Progress */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-black text-base sm:text-lg text-slate-900 leading-snug group-hover:text-emerald-800 transition">
                        {prj.titleBn}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-3">
                        {prj.descriptionBn}
                      </p>
                    </div>

                    {/* Progress Stats Box */}
                    <div className="space-y-2.5 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs">
                      <div className="flex justify-between items-baseline">
                        <span className="text-slate-600 font-bold">সংগৃহীত: <strong className="font-mono text-emerald-700 text-sm">{formatTakaBn(prj.raisedAmount)}</strong></span>
                        <span className="text-slate-600 font-bold">লক্ষ্য: <strong className="font-mono text-slate-800">{formatTakaBn(prj.targetAmount)}</strong></span>
                      </div>

                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${prjPercentage}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span className="font-bold text-emerald-800">{prjPercentage}% অর্জিত ({prj.donorCount} দাতা)</span>
                        <span className="font-bold text-slate-700">বাকি: {formatTakaBn(needed)}</span>
                      </div>
                    </div>

                    {/* Dual Action Buttons (Case Study & Donate) */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleOpenCaseStudy(prj)}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 rounded-2xl transition flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>কেস স্টাডি</span>
                      </button>

                      {prj.status !== 'completed' ? (
                        <button
                          onClick={() =>
                            handleOpenDonateModal({
                              category: prj.category,
                              title: prj.titleBn,
                              id: prj.id,
                              amount: 1500
                            })
                          }
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 rounded-2xl shadow-xs transition flex items-center justify-center gap-1.5"
                        >
                          <Heart className="w-3.5 h-3.5 fill-current" />
                          <span>অর্থায়ন করুন</span>
                        </button>
                      ) : (
                        <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold py-3 rounded-2xl text-center flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>সম্পন্ন</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================
          6. 11+ DEDICATED CHARITABLE GIVING SECTORS
      ======================================================== */}
      <div id="section_sectors" className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>সুনির্দিষ্ট দানের ১১টি খাত (11+ Specific Charity Sectors)</span>
            </div>
            <h2 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              আপনার পছন্দসই নির্দিষ্ট কল্যাণ খাতে সরাসরি অনুদান দিন
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md sm:text-right">
            প্রতিটি খাতের অর্থ কেবলমাত্র সেই সুনির্দিষ্ট উদ্দেশ্যে ১০০% ক্যাশলেসভাবে ব্যয় করা হয়।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {DONATION_CATEGORIES.map((cat) => {
            const target = cat.targetAmount || 2000000;
            const collected = cat.totalCollected || 0;
            const catProgress = Math.min(100, Math.round((collected / target) * 100));
            return (
              <div
                key={cat.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 hover:border-emerald-500 hover:shadow-lg transition flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition shadow-xs">
                      <Heart className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                      {catProgress}% সম্পন্ন
                    </span>
                  </div>

                  <h3 className="font-black text-base text-slate-900 leading-snug group-hover:text-emerald-800 transition">
                    {cat.nameBn}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {cat.descriptionBn}
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-500">সংগ্রহ:</span>
                    <span className="font-black text-emerald-700">{formatTakaBn(collected)}</span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${catProgress}%` }}
                    />
                  </div>

                  <button
                    onClick={() =>
                      handleOpenDonateModal({
                        category: cat.id,
                        title: cat.nameBn,
                        amount: 1000
                      })
                    }
                    className="w-full bg-slate-50 hover:bg-emerald-600 text-slate-800 hover:text-white font-black text-xs py-2.5 rounded-xl border border-slate-200 hover:border-transparent transition flex items-center justify-center gap-1.5"
                  >
                    <span>এই খাতে দান করুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          7. SHARIAH ZAKAT CENTER & 8 QURANIC ASNAF EXPLAINER
      ======================================================== */}
      <div id="section_zakat" className="bg-gradient-to-br from-amber-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-amber-500/30 space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-amber-500/20 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" />
              <span>শরীয়াহসম্মত যাকাত ও ফিতরা ব্যবস্থাপনা (Shariah Zakat Hub)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              পবিত্র কুরআন নির্দেশিত ৮টি খাতে যাকাত বন্টন
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              আসকাডো সেন্ট্রাল যাকাত ফান্ড দেশের বিজ্ঞ ইসলামিক স্কলারদের সমন্বয়ে গঠিত শরীয়াহ বোর্ডের কঠোর তত্ত্বাবধানে পরিচালিত হয়। আপনার হিসাবকৃত যাকাতের অর্থ সরাসরি কোরআনিক ৮টি খাতের প্রকৃত হকদারদের নিকট হস্তান্তর করা হয়।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setIsZakatModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4 fill-slate-950" />
              <span>যাকাত হিসাব করুন ও প্রদান করুন</span>
            </button>
          </div>
        </div>

        {/* 8 Quranic Asnaf Grid */}
        <div className="space-y-4">
          <h3 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider">
            যাকাতের ৮টি নির্ধারিত খাত (সূরা আত-তাওবাহ: ৬০)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {[
              { title: '১. ফকির (দরিদ্র)', desc: 'যাদের মৌলিক জীবিকার কোনো সম্বল নেই' },
              { title: '২. মিসকিন (অসহায়)', desc: 'যাদের আয় ন্যূনতম প্রয়োজনের চেয়ে কম' },
              { title: '৩. যাকাত সংগ্রাহক', desc: 'শরীয়াহ নির্ধারিত ফিল্ড কর্মকর্তা' },
              { title: '৪. নও-মুসলিম', desc: 'ইসলামের প্রতি আকৃষ্ট ও মন জয় করতে' },
              { title: '৫. দাসমুক্তি / বন্দী', desc: 'ঋণগ্রস্ত বা নিষ্পেষিতদের পুনর্বাসন' },
              { title: '৬. ঋণগ্রস্ত ব্যক্তি', desc: 'জরুরি চিকিৎসায় ঋণগ্রস্ত নিঃস্ব মানুষ' },
              { title: '৭. ফি-সাবিলিল্লাহ', desc: 'দ্বীনি শিক্ষা ও মানবকল্যাণ কর্মে' },
              { title: '৮. মুসাফির (প্রবাসী)', desc: 'পথে সম্বলহীন হয়ে পড়া অসহায় ব্যক্তি' }
            ].map((asnaf, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-2xl space-y-1">
                <span className="font-bold text-amber-200 block text-xs">{asnaf.title}</span>
                <span className="text-[11px] text-slate-400 leading-snug block">{asnaf.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          8. FINANCIAL TRANSPARENCY & AUDIT LEDGER (আর্থিক স্বচ্ছতা)
      ======================================================== */}
      <div id="section_transparency">
        {summary && (
          <DonationTransparencySection summary={summary} expenses={expenses} />
        )}
      </div>

      {/* ========================================================
          9. DONOR WALL OF HONOR (সম্মানিত দাতা স্বীকৃতি ও সনদ)
      ======================================================== */}
      {donorWall.length > 0 && (
        <DonorWallSection
          donors={donorWall}
          onOpenCertificateSample={handleOpenCertificateFromWall}
        />
      )}

      {/* ========================================================
          10. DIRECT PAYMENT GATEWAYS & CENTRAL BANK ACCOUNTS
      ======================================================== */}
      <div id="section_bank" className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-slate-700 space-y-8">
        <div className="border-b border-slate-700 pb-5">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
            <Smartphone className="w-3.5 h-3.5" />
            <span>সরাসরি পেমেন্ট ও কেন্দ্রীয় ব্যাংক চ্যানেল</span>
          </div>
          <h3 className="font-black text-2xl sm:text-3xl text-white">
            অফিসিয়াল ব্যাংক অ্যাকাউন্ট ও মোবাইল ব্যাংকিং নির্দেশিকা
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            যেকোনো মোবাইল অ্যাপ বা ব্যাংক শাখা থেকে সরাসরি অর্থ স্থানান্তর করে ট্রানজেকশন আইডি (TrxID) দিয়ে তাৎক্ষণিক ডিজিটাল মানি রসিদ সংগ্রহ করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Mobile Financial Services */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-5">
            <h4 className="font-black text-base text-emerald-300 flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              <span>মোবাইল ফাইন্যান্সিয়াল সার্ভিস (MFS)</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-pink-400 block text-sm">বিকাশ মার্চেন্ট (bKash Merchant)</span>
                  <span className="font-mono text-base sm:text-lg font-black text-white">01973817167</span>
                </div>
                <span className="text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2.5 py-1 rounded-lg">
                  Make Payment
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-orange-400 block text-sm">নগদ মার্চেন্ট (Nagad Merchant)</span>
                  <span className="font-mono text-base sm:text-lg font-black text-white">01973817167</span>
                </div>
                <span className="text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2.5 py-1 rounded-lg">
                  Merchant Pay
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-purple-400 block text-sm">রকেট পার্সোনাল (Rocket Personal)</span>
                  <span className="font-mono text-base sm:text-lg font-black text-white">01973817167-8</span>
                </div>
                <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-lg">
                  Send Money
                </span>
              </div>
            </div>
          </div>

          {/* Central Bank Account Wire */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-5">
            <h4 className="font-black text-base text-emerald-300 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <span>কেন্দ্রীয় ব্যাংক হিসাব (Official Bank Account)</span>
            </h4>

            <div className="bg-white/5 border border-white/10 p-4.5 rounded-2xl space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">ব্যাংকের নাম:</span>
                <span className="font-bold text-white">Islami Bank Bangladesh PLC</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">হিসাবের নাম:</span>
                <span className="font-bold text-white">ASCAHDO CENTRAL TRUST</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">হিসাব নম্বর (AC No):</span>
                <span className="font-mono font-black text-emerald-400 text-sm sm:text-base">20501450201887412</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">শাখা:</span>
                <span className="font-semibold text-white">Dhanmondi Branch, Dhaka</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">রাউটিং নম্বর (Routing):</span>
                <span className="font-mono text-slate-200">125271882</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 leading-relaxed">
              * সরাসরি EFTN, BEFTN, NPSB বা অনলাইন ট্রান্সফারের পর ডিপোজিট স্লিপ ও বিবরণী আপলোড করে রসিদ সংগ্রহ করতে পারেন।
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================
          11. INSTITUTIONAL ACCREDITATION & TRUST SEALS
      ======================================================== */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-6 text-center">
        <div className="max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">সরকারি নিবন্ধন ও অনুমোদন</span>
          <h3 className="font-black text-xl sm:text-2xl text-slate-900">
            জাতীয় ও আন্তর্জাতিক মানসম্পন্ন স্বচ্ছতা নীতিমালা
          </h3>
          <p className="text-xs text-slate-500">
            আসকাডো মানবকল্যাণ ট্রাস্ট যথাযথ আইনি ও প্রাতিষ্ঠানিক কাঠামোর অধীনে পরিচালিত।
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <Landmark className="w-6 h-6 text-emerald-600 mx-auto" />
            <span className="font-bold text-xs text-slate-900 block">RJSC ট্রাস্ট নিবন্ধন</span>
            <span className="text-[11px] text-slate-500 font-mono">Reg: TR-884192/2024</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <ShieldCheck className="w-6 h-6 text-blue-600 mx-auto" />
            <span className="font-bold text-xs text-slate-900 block">এনবিআর কর অব্যাহতি</span>
            <span className="text-[11px] text-slate-500">NBR 80G Tax Exemption</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <FileCheck className="w-6 h-6 text-indigo-600 mx-auto" />
            <span className="font-bold text-xs text-slate-900 block">বার্ষিক সিএ অডিট</span>
            <span className="text-[11px] text-slate-500 font-mono">FY 2025-2026 Cleared</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <Award className="w-6 h-6 text-amber-600 mx-auto" />
            <span className="font-bold text-xs text-slate-900 block">শরীয়াহ বোর্ড সনদ</span>
            <span className="text-[11px] text-slate-500">Central Fatwa Certified</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          12. PHILANTHROPY HELPLINE & FREQUENTLY ASKED QUESTIONS
      ======================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">সচরাচর জিজ্ঞাসা</span>
          <h3 className="font-black text-2xl text-slate-900">
            দান ও যাকাত সংক্রান্ত প্রয়োজনীয় প্রশ্নোত্তর
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-5 rounded-2xl space-y-2 border border-slate-200/80">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>অনুদানের অর্থ কি করমুক্ত (Tax Exempted)?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              হ্যাঁ, আসকাডো মানবকল্যাণ ট্রাস্টের অনুদানের অফিসিয়াল রসিদ জাতীয় রাজস্ব বোর্ডের (NBR) আয়কর অধ্যাদেশ অনুসারে কর রেয়াত বা কর অব্যাহতির জন্য গণ্য হয়।
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl space-y-2 border border-slate-200/80">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>বেনামী বা গোপনীয় অনুদান প্রদান করা যায় কি?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              অবশ্যই। অনুদান ফর্মের 'পরিচয় গোপন রাখুন (Anonymous)' অপশনটি সিলেক্ট করলে আপনার নাম জনসমক্ষে বা দাতা তালিকায় প্রকাশ পাবে না।
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl space-y-2 border border-slate-200/80">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>অনুদানের ডিজিটাল রসিদ কীভাবে পাওয়া যাবে?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              পেমেন্ট সফল হওয়ার সাথে সাথে অন-স্ক্রিন ডিজিটাল মানি রসিদ ও সম্মাননা সনদ জেনারেট হয়, যা এক ক্লিকে ডাউনলোড ও প্রিন্ট করা যায়। পরবর্তীতে রসিদ নম্বর দিয়ে যেকোনো সময় ভেরিফাই করা সম্ভব।
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl space-y-2 border border-slate-200/80">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>যাকাতের অর্থ কীভাবে আলাদা রাখা হয়?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              যাকাত ও ফিতরার জন্য আলাদা শরীয়াহ ব্যাংক লেজার মেইনটেইন করা হয় এবং তা কোনো প্রশাসনিক খরচ ছাড়া শতভাগ হকদারদের মাঝে সরাসরি হস্তান্তর করা হয়।
            </p>
          </div>
        </div>

        {/* 24/7 Philanthropy Desk */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-sm text-white block">২৪/৭ দান ও যাকাত পরামর্শ সহায়তা ডেস্ক</span>
              <span className="text-xs text-slate-400">সরাসরি কথা বলুন: 01973817167 | support@ascado.org</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:01973817167"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>কল করুন</span>
            </a>
            <button
              onClick={() => handleOpenDonateModal()}
              className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 text-emerald-600" />
              <span>অনুদান দিন</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          13. ALL MODALS INTEGRATION (Preserved 100%)
      ======================================================== */}
      {/* 1. Main Donation Wizard Modal */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        onDonationSuccess={handleDonationSuccess}
        initialCategory={selectedCategoryForModal}
        initialAmount={selectedAmountForModal}
        initialCampaignTitle={selectedCampaignTitle}
        initialCampaignId={selectedCampaignId}
      />

      {/* 2. Official Money Receipt & Certificate Modal */}
      <DonationReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        transaction={activeTransactionForReceipt}
      />

      {/* 3. Shariah Zakat Calculator Modal */}
      <ZakatCalculatorModal
        isOpen={isZakatModalOpen}
        onClose={() => setIsZakatModalOpen(false)}
        onPayZakat={(zakatAmount) => {
          handleOpenDonateModal({
            category: 'zakat_fund',
            title: 'যাকাত ও সদকা ফান্ড',
            amount: zakatAmount
          });
        }}
      />

      {/* 4. Receipt & Transaction Verification Modal */}
      <ReceiptVerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        allTransactions={transactions}
        onViewReceipt={(tx) => {
          setActiveTransactionForReceipt(tx);
          setIsReceiptModalOpen(true);
        }}
      />

      {/* 5. Project Impact Case Study Modal */}
      <ProjectCaseStudyModal
        isOpen={isCaseStudyModalOpen}
        onClose={() => setIsCaseStudyModalOpen(false)}
        project={selectedProjectForModal}
        onDonate={(prj) => {
          handleOpenDonateModal({
            category: prj.category,
            title: prj.titleBn,
            id: prj.id,
            amount: 1500
          });
        }}
      />

    </div>
  );
};
