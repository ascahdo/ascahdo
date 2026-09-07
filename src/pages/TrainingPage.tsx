import React, { useState } from 'react';
import { useTranslation } from '../locales/i18nContext';
import {
  BookOpen, Award, CheckCircle, Video, Star, Clock, Users, ArrowRight,
  Search, Filter, Building2, Briefcase, GraduationCap, FileCheck, QrCode,
  Download, Printer, Sparkles, Phone, Mail, MapPin, Calendar, Check,
  ChevronRight, Shield, Globe, Layers, UserCheck, PlayCircle, FileText,
  DollarSign, Share2, HelpCircle, X
} from 'lucide-react';
import {
  SKILL_CATEGORIES_DATA,
  MOCK_TRAINING_PROGRAMS,
  MOCK_TRAINING_CENTERS,
  MOCK_JOB_CIRCULARS,
  MOCK_TRAINERS
} from '../data/skillDevelopmentData';
import { TrainingProgram, SkillCategory } from '../types';
import { HubHeader } from '../components/hub/HubHeader';
import { HubBannerSlider } from '../components/hub/HubBannerSlider';

export const TrainingPage: React.FC<{ onNavigateHome?: () => void }> = ({ onNavigateHome }) => {
  const { isBn } = useTranslation();
  
  // Navigation tabs within Skill Hub
  const [activeTab, setActiveTab] = useState<'programs' | 'categories' | 'admission' | 'centers' | 'verification' | 'jobs' | 'trainers' | 'portal_preview'>('programs');
  
  // Interactive sub-tabs for portal preview
  const [portalRoleTab, setPortalRoleTab] = useState<'student' | 'trainer' | 'manager'>('student');
  const [jobApplicationModal, setJobApplicationModal] = useState<{ job: any; trackingId: string } | null>(null);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  // Selected item modal / action
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [enrollingProgram, setEnrollingProgram] = useState<TrainingProgram | null>(null);
  
  // Certificate verification state
  const [verifySearchId, setVerifySearchId] = useState('');
  const [verificationResult, setVerificationResult] = useState<any | null>(null);

  // Admission Form State
  const [admissionFormData, setAdmissionFormData] = useState({
    studentNameBn: '',
    studentNameEn: '',
    fatherName: '',
    motherName: '',
    phone: '',
    guardianPhone: '',
    email: '',
    nidOrBirth: '',
    dateOfBirth: '',
    gender: 'male',
    bloodGroup: 'A+',
    address: '',
    centerId: 'tc_noakhali_01',
    courseId: 'tp_01',
    paymentMethod: 'bkash',
    paymentTrxId: '',
    paymentAmount: 4000,
    educationLevel: 'HSC / Equivalent'
  });

  const [submittedAdmission, setSubmittedAdmission] = useState<any | null>(null);

  // Filter courses
  const filteredPrograms = MOCK_TRAINING_PROGRAMS.filter((prog) => {
    const matchesCategory = selectedCategory === 'all' || prog.category === selectedCategory;
    const matchesType = selectedType === 'all' || 
      (selectedType === 'free' && prog.isFree) || 
      (selectedType === 'paid' && !prog.isFree) ||
      (selectedType === prog.courseType);
    const matchesSearch = 
      prog.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.trainerNameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.categoryNameBn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  // Handle Admission submission
  const handleAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const course = MOCK_TRAINING_PROGRAMS.find(p => p.id === admissionFormData.courseId) || MOCK_TRAINING_PROGRAMS[0];
    const center = MOCK_TRAINING_CENTERS.find(c => c.id === admissionFormData.centerId) || MOCK_TRAINING_CENTERS[0];
    
    const randomRoll = 'SKL-' + Math.floor(100000 + Math.random() * 900000);
    const trackingId = 'TRK-' + Date.now().toString().slice(-6);

    const submission = {
      ...admissionFormData,
      id: trackingId,
      trackingNumber: trackingId,
      studentId: randomRoll,
      rollNo: randomRoll,
      courseTitleBn: course.titleBn,
      courseDurationBn: course.durationBn,
      centerNameBn: center.nameBn,
      paymentTrxId: admissionFormData.paymentAmount === 0 ? 'FREE-SCHOLARSHIP' : (admissionFormData.paymentTrxId || 'PENDING'),
      submissionDate: new Date().toLocaleDateString('bn-BD'),
      status: 'pending_verification'
    };

    setSubmittedAdmission(submission);
    setEnrollingProgram(null);
  };

  // Predefined verified certificates database
  const CERTIFICATE_DATABASE: Record<string, any> = {
    'SKL-2025-0891': {
      isValid: true,
      certificateNo: 'SKL-2025-0891',
      studentName: 'Md. Tarikul Islam',
      studentNameBn: 'মো. তরিকুল ইসলাম',
      studentId: 'SKL-2025-0891',
      courseTitleBn: 'প্রফেশনাল গ্রাফিক ডিজাইন ও ফ্রিল্যান্সিং',
      categoryBn: 'কম্পিউটার ও তথ্যপ্রযুক্তি',
      duration: '৩ মাস (৩৬টি ক্লাস)',
      centerNameBn: 'এসকাডো কেন্দ্রীয় দক্ষতা ও আইসিটি ল্যাব, নোয়াখালী',
      grade: 'A+ (GPA 5.00)',
      issueDate: '১৫ জানুয়ারি, ২০২৬',
      status: 'সক্রিয় ও বোর্ড কর্তৃক অনুমোদিত (Verified Certificate)'
    },
    'DMA-2025-0142': {
      isValid: true,
      certificateNo: 'DMA-2025-0142',
      studentName: 'Farjana Akter',
      studentNameBn: 'ফারজানা আক্তার',
      studentId: 'MED-2025-0142',
      courseTitleBn: 'ডিপ্লোমা ইন মেডিকেল অ্যাসিস্ট্যান্ট (DMA)',
      categoryBn: 'স্বাস্থ্য ও মেডিকেল টেকনোলজি',
      duration: '৩ বছর (হাসপাতাল ইন্টার্নশিপসহ)',
      centerNameBn: 'সিএমএসএস মেডিকেল টেকনোলজি ইনস্টিটিউট, নোয়াখালী',
      grade: 'Distinction (GPA 4.95)',
      issueDate: '২০ ডিসেম্বর, ২০২৫',
      status: 'স্বাস্থ্য অধিদপ্তর ও বাংলাদেশ মেডিকেল টেকনোলজি বোর্ড অনুমোদিত'
    },
    'BTEB-2025-449': {
      isValid: true,
      certificateNo: 'BTEB-2025-449',
      studentName: 'Md. Rafiqul Hasan',
      studentNameBn: 'মো. রফিকুল হাসান',
      studentId: 'BTEB-2025-449',
      courseTitleBn: 'ইন্ডাস্ট্রিয়াল ইলেকট্রিক্যাল ওয়্যারিং ও সোলার টেকনোলজি',
      categoryBn: 'কারিগরি ও মেকানিক্যাল',
      duration: '৩ মাস (৩৬টি প্র্যাকটিক্যাল ল্যাব)',
      centerNameBn: 'কারিগরি প্রশিক্ষণ কেন্দ্র (TTC) পার্টনার ক্যাম্পাস, ফেনী',
      grade: 'A (GPA 4.80)',
      issueDate: '১০ নভেম্বর, ২০২৫',
      status: 'কারিগরি শিক্ষা বোর্ড (BTEB) অ্যাক্রেডিটেড ও ভেরিফাইড'
    },
    'KOR-2025-771': {
      isValid: true,
      certificateNo: 'KOR-2025-771',
      studentName: 'Md. Shakil Mahmud',
      studentNameBn: 'মো. শাকিল মাহমুদ',
      studentId: 'KOR-2025-771',
      courseTitleBn: 'কোরিয়ান ভাষা দক্ষতা (EPS-TOPIK)',
      categoryBn: 'ভাষা শিক্ষা ও আন্তর্জাতিক ক্যারিয়ার',
      duration: '৪ মাস (৪৮টি ক্লাস ও মক টেস্ট)',
      centerNameBn: 'এসকাডো আইটি ও গ্লোবাল ক্যারিয়ার ক্যাম্পাস ঢাকা',
      grade: 'Level 4 Passed (EPS Qualified)',
      issueDate: '১৮ ফেব্রুয়ারি, ২০২৬',
      status: 'HRD Korea EPS সিলেবাস অনুমোদিত'
    },
    'DRV-2025-330': {
      isValid: true,
      certificateNo: 'DRV-2025-330',
      studentName: 'Md. Kamrul Islam',
      studentNameBn: 'মো. কামরুল ইসলাম',
      studentId: 'DRV-2025-330',
      courseTitleBn: 'প্রফেশনাল মোটর ড্রাইভিং ও অটোমোবাইল মেকানিক্স',
      categoryBn: 'ড্রাইভিং ও ট্রাফিক নিরাপত্তা',
      duration: '২ মাস (বিআরটিএ প্রস্তুতি)',
      centerNameBn: 'এসকাডো মোটর ড্রাইভিং ও অটোমোবাইল ট্রেনিং ট্র্যাক',
      grade: 'Professional Passed (Grade A)',
      issueDate: '০৫ জানুয়ারি, ২০২৬',
      status: 'BRTA অনুমোদিত ড্রাইভিং প্রশিক্ষণ সনদ'
    }
  };

  // Handle Certificate Verification
  const handleVerifyCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const query = verifySearchId.trim().toUpperCase();
    if (!query) return;

    // 1. Check if user searches for their freshly submitted admission
    if (submittedAdmission && (
      query === submittedAdmission.trackingNumber.toUpperCase() ||
      query === submittedAdmission.studentId.toUpperCase() ||
      query.includes(submittedAdmission.trackingNumber.toUpperCase()) ||
      query.includes(submittedAdmission.studentId.toUpperCase())
    )) {
      setVerificationResult({
        isValid: true,
        certificateNo: submittedAdmission.trackingNumber,
        studentName: submittedAdmission.studentNameEn,
        studentNameBn: submittedAdmission.studentNameBn,
        studentId: submittedAdmission.studentId,
        courseTitleBn: submittedAdmission.courseTitleBn,
        categoryBn: 'অনলাইন নতুন ভর্তি',
        duration: submittedAdmission.courseDurationBn,
        centerNameBn: submittedAdmission.centerNameBn,
        grade: 'ভর্তি পরীক্ষাধীন / অনুমোদিত (Admitted)',
        issueDate: submittedAdmission.submissionDate,
        status: 'সক্রিয় শিক্ষার্থী নিবন্ধন — যাচাইকৃত ও ডাটাবেজে অন্তর্ভুক্ত'
      });
      return;
    }

    // 2. Exact or partial match in preloaded records
    const matchedKey = Object.keys(CERTIFICATE_DATABASE).find(k => 
      query === k || query.includes(k) || k.includes(query)
    );

    if (matchedKey) {
      setVerificationResult(CERTIFICATE_DATABASE[matchedKey]);
      return;
    }

    // 3. Smart match if contains common keywords or ID structures
    if (query.includes('SKL') || query.includes('CERT') || query.includes('BTEB') || query.includes('MED') || query.includes('101')) {
      setVerificationResult({
        isValid: true,
        certificateNo: query,
        studentName: 'Md. Tarikul Islam',
        studentNameBn: 'মো. তরিকুল ইসলাম',
        studentId: query.startsWith('SKL-') ? query : 'SKL-2025-0891',
        courseTitleBn: 'প্রফেশনাল গ্রাফিক ডিজাইন ও ফ্রিল্যান্সিং',
        categoryBn: 'কম্পিউটার ও তথ্যপ্রযুক্তি',
        duration: '৩ মাস (৩৬টি ক্লাস)',
        centerNameBn: 'এসকাডো কেন্দ্রীয় দক্ষতা ও আইসিটি প্রশিক্ষণ কেন্দ্র',
        grade: 'A+ (GPA 5.00)',
        issueDate: '১৫ জানুয়ারি, ২০২৬',
        status: 'সক্রিয় ও বোর্ড কর্তৃক অনুমোদিত (Verified Record)'
      });
    } else {
      setVerificationResult({
        isValid: false,
        message: 'প্রদত্ত আইডি বা সার্টিফিকেট নম্বরের কোনো রেকর্ড পাওয়া যায়নি। অনুগ্রহ করে সঠিক আইডি বা নিচের ডেমো নম্বরগুলো দিয়ে চেষ্টা করুন।'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 0. Hub Header & Navigation for Independent Mini Portal */}
      <HubHeader
        hubId="training"
        activeMenuRoute={activeTab}
        onSelectMenu={(route) => {
          const routeMap: Record<string, typeof activeTab> = {
            home: 'programs',
            courses: 'programs',
            programs: 'programs',
            categories: 'categories',
            admission: 'admission',
            centers: 'centers',
            verify: 'verification',
            verification: 'verification',
            jobs: 'jobs',
            trainers: 'trainers',
            lms: 'portal_preview',
            portal: 'portal_preview',
            portal_preview: 'portal_preview'
          };
          if (routeMap[route]) {
            setActiveTab(routeMap[route]);
          }
        }}
        onOpenPortalLogin={() => setActiveTab('portal_preview')}
        onBackToMasterPortal={() => {
          if (onNavigateHome) onNavigateHome();
          else window.location.hash = '';
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Hub Banner Slider */}
        <HubBannerSlider hubId="training" onActionClick={(link) => setActiveTab('admission')} />

        {/* 1. Hero Master Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-teal-950 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-emerald-900/40">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-black px-3.5 py-1 rounded-full uppercase border border-emerald-400/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>জাতীয় দক্ষতা উন্নয়ন ও যুব প্রশিক্ষণ প্লাটফর্ম</span>
            </span>
            <span className="bg-white/10 text-slate-200 text-xs font-bold px-3 py-1 rounded-full">
              গভর্নমেন্ট ও কারিগরি মানসম্পন্ন
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            দক্ষতা অর্জন করুন, <span className="text-emerald-400">আন্তর্জাতিক ক্যারিয়ার</span> গড়ুন
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            কম্পিউটার ও আইসিটি, মেডিকেল ও স্বাস্থ্য প্রযুক্তি, ইলেকট্রিক্যাল ও মেকানিক্যাল, আধুনিক কৃষি, ড্রাইভিং, ফ্যাশন ডিজাইন ও উদ্যোক্তা উন্নয়নসহ ৯টি প্রধান সেক্টরে সরকারি সনদ ও কর্মসংস্থান সুবিধা।
          </p>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-emerald-800/40">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">৯+</p>
              <p className="text-xs text-slate-300">স্কিল ক্যাটাগরি</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-amber-400">৫০+</p>
              <p className="text-xs text-slate-300">সার্টিফাইড কোর্স</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-teal-300">১০০%</p>
              <p className="text-xs text-slate-300">QR ভেরিফাইড সনদ</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-rose-300">চাকরি ও ফ্রিল্যান্সিং</p>
              <p className="text-xs text-slate-300">প্লেসমেন্ট সুবিধা</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 text-xs font-bold">
        {[
          { id: 'programs', label: 'কোর্স ও ট্রেনিং প্রোগ্রাম', icon: BookOpen },
          { id: 'categories', label: 'স্কিল ক্যাটাগরি (৯টি সেক্টর)', icon: Layers },
          { id: 'admission', label: 'অনলাইন ভর্তি ও আবেদন', icon: GraduationCap },
          { id: 'centers', label: 'ট্রেনিং সেন্টার নেটওয়ার্ক', icon: Building2 },
          { id: 'verification', label: 'সার্টিফিকেট ভেরিফিকেশন', icon: FileCheck },
          { id: 'jobs', label: 'জব প্লেসমেন্ট ও ক্যারিয়ার', icon: Briefcase },
          { id: 'trainers', label: 'প্রশিক্ষক প্যানেল', icon: Users },
          { id: 'portal_preview', label: 'স্টুডেন্ট ও ট্রেনার পোর্টাল', icon: UserCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 rounded-2xl flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: PROGRAMS / COURSES LIST WITH ADVANCED SEARCH & FILTERS
      ========================================================================= */}
      {activeTab === 'programs' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Box */}
              <div className="relative md:col-span-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="আপনি কী শিখতে চান? (যেমন: গ্রাফিক, মেডিকেল, ওয়েল্ডিং...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="all">সকল স্কিল ক্যাটাগরি</option>
                  {SKILL_CATEGORIES_DATA.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.nameBn}</option>
                  ))}
                </select>
              </div>

              {/* Course Type Filter */}
              <div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="all">সকল কোর্সের ধরন (ফ্রি ও পেইড)</option>
                  <option value="free">ফ্রি স্কলারশিপ কোর্স</option>
                  <option value="paid">পেইড ও প্রিমিয়াম কোর্স</option>
                  <option value="diploma">ডিপ্লোমা কোর্স</option>
                  <option value="certificate">সার্টিফিকেট কোর্স</option>
                  <option value="government_approved">সরকারি অনুমোদিত কোর্স</option>
                </select>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((prog) => (
              <div
                key={prog.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail & Badges */}
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={prog.thumbnail}
                      alt={prog.titleBn}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                    
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-black px-3 py-1 rounded-full uppercase border border-white/20">
                      {prog.categoryNameBn}
                    </div>

                    <div className="absolute top-3 right-3">
                      {prog.isFree ? (
                        <span className="bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                          ১০০% ফ্রি
                        </span>
                      ) : (
                        <span className="bg-amber-400 text-amber-950 text-xs font-black px-3 py-1 rounded-full shadow-md">
                          ৳{prog.discountFee || prog.courseFee}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        {prog.durationBn}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        {prog.enrolledCount}/{prog.seatCapacity} সিট পূর্ণ
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="font-black text-base text-slate-900 group-hover:text-emerald-700 transition line-clamp-2">
                      {prog.titleBn}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {prog.title}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">প্রশিক্ষক:</span>
                        <span className="font-bold text-slate-800">{prog.trainerNameBn}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">ট্রেনিং সেন্টার:</span>
                        <span className="font-semibold text-slate-700 truncate max-w-[180px]">{prog.trainingCenterBn}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">ক্লাস শিডিউল:</span>
                        <span className="font-medium text-slate-700">{prog.classScheduleBn}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-6 pt-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedProgram(prog)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs transition text-center"
                    >
                      বিস্তারিত দেখুন
                    </button>
                    <button
                      onClick={() => {
                        setAdmissionFormData(prev => ({
                          ...prev,
                          courseId: prog.id,
                          centerId: prog.centerId,
                          paymentAmount: prog.isFree ? 0 : (prog.discountFee ?? prog.courseFee ?? 0)
                        }));
                        setActiveTab('admission');
                      }}
                      className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1 shadow-xs"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>ভর্তি আবেদন</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: SKILL CATEGORIES (9 MASTER CATEGORIES)
      ========================================================================= */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              ৯টি প্রধান স্কিল ও ভোকেশনাল সেক্টর
            </h2>
            <p className="text-xs text-slate-500">
              আধুনিক শ্রমবাজার ও আন্তর্জাতিক চাহিদা অনুযায়ী সাজানো প্র্যাকটিক্যাল দক্ষতা উন্নয়ন কারিকুলাম।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SKILL_CATEGORIES_DATA.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl shadow-xs">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">{cat.nameBn}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">{cat.name}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-500 uppercase">উপলব্ধ কোর্স ও ট্রেড:</p>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {(cat.subcategories || []).map(sub => (
                      <li key={sub.id} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{sub.nameBn}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setActiveTab('programs');
                  }}
                  className="w-full bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1 border border-slate-200"
                >
                  <span>কোর্সসমূহ দেখুন</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: ONLINE ADMISSION & REGISTRATION FORM
      ========================================================================= */}
      {activeTab === 'admission' && (
        <div>
          {submittedAdmission ? (
            /* Admission Confirmation & Money Receipt */
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg space-y-6 max-w-3xl mx-auto">
              <div className="text-center space-y-2 border-b border-slate-100 pb-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full">
                  অনলাইন ভর্তি আবেদন সফলভাবে গৃহীত হয়েছে
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  এসকাডো কারিগরি ও আইসিটি ট্রেনিং একাডেমি
                </h2>
                <p className="text-xs text-slate-500">অনলাইন ভর্তি প্রাপ্তিস্বীকার ও স্টুডেন্ট এনরোলমেন্ট স্লিপ</p>
                <p className="text-sm font-mono font-black text-emerald-700 bg-emerald-50 inline-block px-4 py-1.5 rounded-xl border border-emerald-200">
                  ট্র্যাকিং আইডি: {submittedAdmission.trackingNumber} | স্টুডেন্ট আইডি: {submittedAdmission.studentId}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-2">
                  <p><span className="text-slate-400">শিক্ষার্থীর নাম:</span> <strong className="text-slate-900 block text-sm">{submittedAdmission.studentNameBn} ({submittedAdmission.studentNameEn})</strong></p>
                  <p><span className="text-slate-400">পিতার নাম:</span> <strong className="text-slate-800">{submittedAdmission.fatherName}</strong></p>
                  <p><span className="text-slate-400">মোবাইল নম্বর:</span> <strong className="text-slate-800 font-mono">{submittedAdmission.phone}</strong></p>
                  <p><span className="text-slate-400">ঠিকানা:</span> <strong className="text-slate-800">{submittedAdmission.address}</strong></p>
                </div>
                <div className="space-y-2">
                  <p><span className="text-slate-400">কোর্স:</span> <strong className="text-emerald-900 block text-sm">{submittedAdmission.courseTitleBn}</strong></p>
                  <p><span className="text-slate-400">ট্রেনিং সেন্টার:</span> <strong className="text-slate-800">{submittedAdmission.centerNameBn}</strong></p>
                  <p><span className="text-slate-400">পেমেন্ট TrxID:</span> <strong className="text-emerald-700 font-mono font-bold">{submittedAdmission.paymentTrxId}</strong></p>
                  <p><span className="text-slate-400">প্রদত্ত ফি:</span> <strong className="text-emerald-700 font-bold">{submittedAdmission.paymentAmount === 0 ? 'ফ্রি স্কলারশিপ (৳0)' : `৳${submittedAdmission.paymentAmount}`}</strong></p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>রিসিট প্রিন্ট বা PDF ডাউনলোড</span>
                </button>
                <button
                  onClick={() => {
                    setVerifySearchId(submittedAdmission.trackingNumber);
                    setActiveTab('verification');
                  }}
                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold px-5 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>ট্র্যাকিং স্ট্যাটাস যাচাই</span>
                </button>
                <button
                  onClick={() => setSubmittedAdmission(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-3.5 rounded-2xl text-xs transition"
                >
                  নতুন আবেদন ফরম
                </button>
              </div>
            </div>
          ) : (
            /* Main Admission Form */
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm max-w-4xl mx-auto space-y-6 text-xs">
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <span className="bg-emerald-100 text-emerald-800 font-black text-xs px-3 py-1 rounded-full uppercase">
                  সেশন: সেপ্টেম্বর - নভেম্বর ২০২৬
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  এসকাডো কারিগরি ও আইসিটি প্রশিক্ষণ ভর্তি ফরম
                </h2>
                <p className="text-slate-500">
                  সঠিক ও নির্ভুল তথ্য প্রদান করে অনলাইনে ভর্তি নিশ্চিত করুন।
                </p>
              </div>

              <form onSubmit={handleAdmissionSubmit} className="space-y-6">
                {/* 1. Course & Center Choice */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm border-b pb-2">১. কোর্স ও ট্রেনিং সেন্টার নির্বাচন</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">কাঙ্ক্ষিত কোর্স <span className="text-rose-500">*</span></label>
                      <select
                        value={admissionFormData.courseId}
                        onChange={(e) => {
                          const prog = MOCK_TRAINING_PROGRAMS.find(p => p.id === e.target.value);
                          setAdmissionFormData({
                            ...admissionFormData,
                            courseId: e.target.value,
                            paymentAmount: prog ? (prog.isFree ? 0 : (prog.discountFee ?? prog.courseFee ?? 0)) : 0
                          });
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        {MOCK_TRAINING_PROGRAMS.map(prog => (
                          <option key={prog.id} value={prog.id}>
                            {prog.titleBn} — {prog.isFree ? '১০০% ফ্রি স্কলারশিপ' : `ফি: ৳${prog.discountFee || prog.courseFee}`} ({prog.durationBn})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">ট্রেনিং সেন্টার / শাখা <span className="text-rose-500">*</span></label>
                      <select
                        value={admissionFormData.centerId}
                        onChange={(e) => setAdmissionFormData({ ...admissionFormData, centerId: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        {MOCK_TRAINING_CENTERS.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.nameBn} ({c.district})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Personal Information */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm border-b pb-2">২. শিক্ষার্থীর ব্যক্তিগত তথ্য</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">শিক্ষার্থীর নাম (বাংলায়) <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="মো. তরিকুল ইসলাম"
                        value={admissionFormData.studentNameBn}
                        onChange={(e) => setAdmissionFormData({ ...admissionFormData, studentNameBn: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Name (English Block Letters) <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="MD. TARIKUL ISLAM"
                        value={admissionFormData.studentNameEn}
                        onChange={(e) => setAdmissionFormData({ ...admissionFormData, studentNameEn: e.target.value.toUpperCase() })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none uppercase font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">পিতার নাম <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="মো. সিরাজুল ইসলাম"
                        value={admissionFormData.fatherName}
                        onChange={(e) => setAdmissionFormData({ ...admissionFormData, fatherName: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">মাতার নাম <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="ফাতেমা বেগম"
                        value={admissionFormData.motherName}
                        onChange={(e) => setAdmissionFormData({ ...admissionFormData, motherName: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">মোবাইল নম্বর <span className="text-rose-500">*</span></label>
                      <input
                        type="tel"
                        required
                        placeholder="017XXXXXXXX"
                        value={admissionFormData.phone}
                        onChange={(e) => setAdmissionFormData({ ...admissionFormData, phone: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">রক্তের গ্রুপ</label>
                      <select
                        value={admissionFormData.bloodGroup}
                        onChange={(e) => setAdmissionFormData({ ...admissionFormData, bloodGroup: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="A+">A+ (পজেটিভ)</option>
                        <option value="A-">A- (নেগেটিভ)</option>
                        <option value="B+">B+ (পজেটিভ)</option>
                        <option value="B-">B- (নেগেটিভ)</option>
                        <option value="O+">O+ (পজেটিভ)</option>
                        <option value="O-">O- (নেগেটিভ)</option>
                        <option value="AB+">AB+ (পজেটিভ)</option>
                        <option value="AB-">AB- (নেগেটিভ)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">শিক্ষাগত যোগ্যতা</label>
                      <select
                        value={admissionFormData.educationLevel}
                        onChange={(e) => setAdmissionFormData({ ...admissionFormData, educationLevel: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="SSC / Dakhil">SSC / দাখিল</option>
                        <option value="HSC / Alim">HSC / আলিম</option>
                        <option value="Diploma / Polytechnic">ডিপ্লোমা / পলিটেকনিক</option>
                        <option value="Graduation / Honours">স্নাতক / ডিগ্রি</option>
                        <option value="Class 8 / JSC">৮ম শ্রেণি / জেএসসি</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">বর্তমান ঠিকানা <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="গ্রাম/রোড, ডাকঘর, উপজেলা, জেলা"
                      value={admissionFormData.address}
                      onChange={(e) => setAdmissionFormData({ ...admissionFormData, address: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3. Payment Verification */}
                {admissionFormData.paymentAmount === 0 ? (
                  <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span>১০০% ফ্রি স্কলারশিপ কোর্স (কোনো ফি নেই)</span>
                    </div>
                    <p className="text-xs text-emerald-700">
                      এই নির্বাচিত কোর্সটি এসকাডো কারিগরি ও আইসিটি স্কলারশিপ প্রকল্পের আওতায় সম্পূর্ণ বিনামূল্যে প্রদান করা হচ্ছে। কোনো ভর্তি ফি বা বিকাশ ট্রানজেকশনের প্রয়োজন নেই। সরাসরি নিচের বাটনে ক্লিক করে আবেদন সম্পন্ন করুন।
                    </p>
                  </div>
                ) : (
                  <div className="bg-pink-50/50 p-5 rounded-2xl border border-pink-200 space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm border-b border-pink-200 pb-2">৩. ভর্তি ফি ও বিকাশ ট্রানজেকশন</h3>
                    
                    <div className="bg-white p-4 rounded-xl border border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-pink-700 text-xs uppercase">বিকাশ মার্চেন্ট / পার্সোনাল নম্বর</p>
                        <p className="text-lg font-black text-slate-900 font-mono">01973-817167</p>
                        <p className="text-[11px] text-slate-500">ভর্তি ফি বাবদ ৳{admissionFormData.paymentAmount} প্রদান করে TrxID লিখুন।</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500">মোট প্রদেয় ফি:</span>
                        <p className="text-xl font-black text-pink-700">৳{admissionFormData.paymentAmount}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">পেমেন্ট মেথড</label>
                        <select
                          value={admissionFormData.paymentMethod}
                          onChange={(e) => setAdmissionFormData({ ...admissionFormData, paymentMethod: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="bkash">bKash (বিকাশ)</option>
                          <option value="nagad">Nagad (নগদ)</option>
                          <option value="rocket">Rocket (রকেট)</option>
                          <option value="bank">Bank Deposit</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">ট্রানজেকশন আইডি (TrxID) <span className="text-rose-500">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="যেমন: BK99281745"
                          value={admissionFormData.paymentTrxId}
                          onChange={(e) => setAdmissionFormData({ ...admissionFormData, paymentTrxId: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono uppercase font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-2xl text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>ভর্তি আবেদন সম্পন্ন করুন</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 4: TRAINING CENTER NETWORK
      ========================================================================= */}
      {activeTab === 'centers' && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              অনুমোদিত ট্রেনিং সেন্টার ও ক্যাম্পাস
            </h2>
            <p className="text-xs text-slate-500">
              সারাদেশের বিভিন্ন জেলা ও উপজেলায় আধুনিক কম্পিউটার ল্যাব ও ভোকেশনাল ওয়ার্কশপ সুবিধা।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_TRAINING_CENTERS.map((center) => (
              <div
                key={center.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                      {center.centerCode}
                    </span>
                    <span className="bg-blue-100 text-blue-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                      {center.district}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 text-base">{center.nameBn}</h3>
                  <p className="text-xs text-slate-500 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{center.addressBn}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <p className="text-[10px] text-slate-400">ট্রেনার প্যানেল</p>
                      <p className="font-bold text-slate-800">{center.trainersCount} জন</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <p className="text-[10px] text-slate-400">মোট শিক্ষার্থী</p>
                      <p className="font-bold text-slate-800">{center.studentsCount}+ জন</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="text-[11px] font-bold text-slate-400">ক্যাম্পাস সুবিধাসমূহ:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(center?.facilities || []).map((fac, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-md font-medium">
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400">ম্যানেজার / পরিচালক:</p>
                    <p className="font-bold text-slate-800">{center.managerName}</p>
                    <p className="text-slate-500 font-mono text-[11px]">{center.managerPhone}</p>
                  </div>
                  <button
                    onClick={() => {
                      setAdmissionFormData(prev => ({ ...prev, centerId: center.id }));
                      setActiveTab('admission');
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-2 rounded-xl text-xs transition shadow-xs"
                  >
                    ভর্তি ফরম
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: CERTIFICATE VERIFICATION (PUBLIC QR & ID SEARCH)
      ========================================================================= */}
      {activeTab === 'verification' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <QrCode className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              ডিজিটাল সার্টিফিকেট ভেরিফিকেশন পোর্টাল
            </h2>
            <p className="text-xs text-slate-500">
              সার্টিফিকেট নম্বর, রোল নম্বর অথবা QR কোড সার্চ করে সনদের সত্যতা ও গ্রেডশিট যাচাই করুন।
            </p>
          </div>

          <form onSubmit={handleVerifyCertificate} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="সার্টিফিকেট নম্বর বা স্টুডেন্ট আইডি লিখুন (যেমন: SKL-2025-0891 বা CERT-991)"
                value={verifySearchId}
                onChange={(e) => setVerifySearchId(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs transition"
              >
                <Search className="w-4 h-4" />
                <span>যাচাই করুন</span>
              </button>
            </div>

            {/* Quick Demo Search Chips */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium">নমুনা সনদ পরীক্ষা করুন:</span>
              {[
                { id: 'SKL-2025-0891', label: 'গ্রাফিক ডিজাইন' },
                { id: 'DMA-2025-0142', label: 'মেডিকেল টেক' },
                { id: 'BTEB-2025-449', label: 'ইলেকট্রিক্যাল' },
                { id: 'KOR-2025-771', label: 'কোরিয়ান ভাষা' },
                { id: 'DRV-2025-330', label: 'ড্রাইভিং' }
              ].map(chip => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    setVerifySearchId(chip.id);
                    // trigger direct match
                    if (CERTIFICATE_DATABASE[chip.id]) {
                      setVerificationResult(CERTIFICATE_DATABASE[chip.id]);
                    }
                  }}
                  className="bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 font-mono text-[11px] px-2.5 py-1 rounded-lg transition"
                >
                  {chip.id} ({chip.label})
                </button>
              ))}
            </div>
          </form>

          {/* Verification Result Card */}
          {verificationResult && (
            <div className="animate-in fade-in zoom-in duration-300">
              {verificationResult.isValid ? (
                <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                          Officially Verified Record
                        </span>
                        <h3 className="text-xl font-black text-white">{verificationResult.studentNameBn}</h3>
                        <p className="text-xs text-slate-300 font-mono">{verificationResult.studentName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400">সনদ নম্বর:</p>
                      <p className="font-mono font-bold text-emerald-400 text-sm">{verificationResult.certificateNo}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                      <p><span className="text-slate-400">কোর্স ট্রেড:</span> <strong className="text-white block">{verificationResult.courseTitleBn}</strong></p>
                      <p><span className="text-slate-400">ক্যাটাগরি:</span> <strong className="text-emerald-300">{verificationResult.categoryBn}</strong></p>
                      <p><span className="text-slate-400">কোর্সের মেয়াদ:</span> <strong className="text-white">{verificationResult.duration}</strong></p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                      <p><span className="text-slate-400">অর্জিত গ্রেড / ফলাফল:</span> <strong className="text-amber-400 font-bold block">{verificationResult.grade}</strong></p>
                      <p><span className="text-slate-400">ট্রেনিং ইনস্টিটিউট:</span> <strong className="text-white">{verificationResult.centerNameBn}</strong></p>
                      <p><span className="text-slate-400">সনদ প্রদানের তারিখ:</span> <strong className="text-white">{verificationResult.issueDate}</strong></p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      <span>{verificationResult.status}</span>
                    </span>
                    <button
                      onClick={() => window.print()}
                      className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>সনদ প্রিন্ট / PDF</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl text-center space-y-2">
                  <p className="font-bold text-rose-800">{verificationResult.message}</p>
                  <p className="text-xs text-rose-600">হেল্পলাইন 01973-817167 এ যোগাযোগ করুন।</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 6: JOB PLACEMENT & CAREERS
      ========================================================================= */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              জব প্লেসমেন্ট ও ক্যারিয়ার সার্কুলার
            </h2>
            <p className="text-xs text-slate-500">
              আমাদের সফল প্রশিক্ষণপ্রাপ্ত শিক্ষার্থীদের জন্য দেশীয় ও আন্তর্জাতিক করপোরেট চাকরির সুযোগ।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_JOB_CIRCULARS.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                      {job.jobType.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-rose-600 font-bold">
                      ডেডলাইন: {job.deadline}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 text-base">{job.titleBn}</h3>
                  <p className="text-xs font-semibold text-slate-700">{job.companyNameBn}</p>
                  
                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <p><span className="text-slate-400">লোকেশন:</span> <strong className="text-slate-800">{job.locationBn}</strong></p>
                    <p><span className="text-slate-400">বেতন:</span> <strong className="text-emerald-700 font-bold">{job.salaryBn}</strong></p>
                    <p><span className="text-slate-400">অভিজ্ঞতা:</span> <strong className="text-slate-800">{job.experienceRequired}</strong></p>
                  </div>

                  <div className="space-y-1 pt-2">
                    <p className="text-[10px] font-bold text-slate-400">প্রয়োজনীয় দক্ষতা:</p>
                    <div className="flex flex-wrap gap-1">
                      {(job?.skillsRequired || []).map((skl, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-md font-medium">
                          {skl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setJobApplicationModal({
                        job,
                        trackingId: 'JOB-APP-' + Math.floor(10000 + Math.random() * 90000)
                      });
                    }}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>চাকরির জন্য আবেদন করুন</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: TRAINERS PANEL
      ========================================================================= */}
      {activeTab === 'trainers' && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              অভিজ্ঞ প্রশিক্ষক ও মেন্টর প্যানেল
            </h2>
            <p className="text-xs text-slate-500">
              ইন্ডাস্ট্রি এক্সপার্ট, প্রকৌশলী ও চিকিৎসকদের নিবিড় তত্ত্বাবধানে প্র্যাকটিক্যাল প্রশিক্ষণ।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {MOCK_TRAINERS.map((tr) => (
              <div
                key={tr.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex items-center gap-5"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border-2 border-emerald-600 shrink-0">
                  <img src={tr.photoUrl} alt={tr.nameBn} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1 text-xs">
                  <h3 className="font-black text-slate-900 text-base">{tr.nameBn}</h3>
                  <p className="text-emerald-700 font-bold text-[11px]">{tr.designationBn}</p>
                  <p className="text-slate-500">{tr.specialization}</p>
                  <div className="flex items-center gap-3 pt-1 text-slate-600 font-medium">
                    <span>অভিজ্ঞতা: <strong>{tr.experienceYears} বছর</strong></span>
                    <span>শিক্ষার্থী: <strong>{tr.totalStudentsTrained}+</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 8: STUDENT, TRAINER & CENTER MANAGER LMS PORTAL PREVIEW
      ========================================================================= */}
      {activeTab === 'portal_preview' && (
        <div className="space-y-8 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              এসকাডো সমন্বিত ট্রেনিং LMS পোর্টাল
            </h2>
            <p className="text-xs text-slate-500">
              শিক্ষার্থী, প্রশিক্ষক এবং ট্রেনিং সেন্টার পরিচালকদের জন্য ইন্টারেক্টিভ ডিজিটাল ম্যানেজমেন্ট ড্যাশবোর্ড।
            </p>
          </div>

          {/* Role Switcher */}
          <div className="flex justify-center">
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1">
              {[
                { id: 'student', label: 'স্টুডেন্ট পোর্টাল', icon: GraduationCap },
                { id: 'trainer', label: 'ট্রেনার ড্যাশবোর্ড', icon: Users },
                { id: 'manager', label: 'সেন্টার ম্যানেজার', icon: Building2 }
              ].map(role => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => setPortalRoleTab(role.id as any)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
                      portalRoleTab === role.id
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{role.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Role Previews */}
          {portalRoleTab === 'student' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">মো. তরিকুল ইসলাম (স্টুডেন্ট আইডি: SKL-2025-0891)</h3>
                    <p className="text-xs text-emerald-700 font-bold">কোর্স: প্রফেশনাল গ্রাফিক ডিজাইন ও ফ্রিল্যান্সিং (ব্যাচ-০৪)</p>
                  </div>
                </div>
                <div className="bg-emerald-50 text-emerald-800 text-xs px-3 py-1.5 rounded-xl border border-emerald-200 font-bold">
                  হাজিরা হার: ৯২% (উপস্থিত)
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-400">পরবর্তী লাইভ ক্লাস:</span>
                  <p className="font-black text-slate-800 text-sm">আজ রাত ৮:০০ টা</p>
                  <p className="text-emerald-700 font-medium">বিষয়: Adobe Illustrator ভেক্টর প্রজেক্ট</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-400">কোর্স অগ্রগতি:</span>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1.5">
                    <div className="bg-emerald-600 h-full w-3/4"></div>
                  </div>
                  <p className="text-slate-600 pt-1 font-bold">৭৫% সম্পূর্ণ (২৪/৩২ ক্লাস সম্পন্ন)</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-400">অ্যাসাইনমেন্ট ও কুইজ:</span>
                  <p className="font-black text-slate-800 text-sm">৯/১০ সাবমিটেড</p>
                  <p className="text-amber-700 font-medium">১টি অ্যাসাইনমেন্ট পেন্ডিং আছে</p>
                </div>
              </div>

              {/* Digital Student ID Preview */}
              <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] text-emerald-300 font-black tracking-widest uppercase">Official Student Card</span>
                  <h4 className="text-base font-black">এসকাডো ডিজিটাল স্টুডেন্ট আইডি কার্ড</h4>
                  <p className="text-xs text-slate-300 font-mono">আইডি: SKL-2025-0891 | সেশন: ২০২৫-২৬</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
                  >
                    আইডি কার্ড প্রিন্ট
                  </button>
                  <button
                    onClick={() => {
                      setVerifySearchId('SKL-2025-0891');
                      setActiveTab('verification');
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                  >
                    QR ভেরিফিকেশন লিংক
                  </button>
                </div>
              </div>
            </div>
          )}

          {portalRoleTab === 'trainer' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <Users className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">প্রশিক্ষক ড্যাশবোর্ড — ইঞ্জি. আসিফ মাহমুদ</h3>
                    <p className="text-xs text-slate-500">সিনিয়র সফটওয়্যার ও আইটি ট্রেনার | সক্রিয় ব্যাচ: ৩টি</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('আজকের ব্যাচের ডিজিটাল হাজিরা শিট সংরক্ষিত হয়েছে!')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs"
                >
                  ডিজিটাল হাজিরা নিন
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-400">চলতি ব্যাচসমূহ:</span>
                  <p className="font-bold text-slate-800">Batch-04 (Graphic), Batch-02 (Web)</p>
                  <p className="text-emerald-700">মোট শিক্ষার্থী: ৭৮ জন</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-400">পরীক্ষার ফলাফল প্রসেসিং:</span>
                  <p className="font-bold text-slate-800">Mid-term Exam মূল্যায়ন সম্পন্ন</p>
                  <p className="text-slate-600">গড় গ্রেড: 84.5%</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-400">লেকচার শিট ও রিসোর্স:</span>
                  <p className="font-bold text-slate-800">১৪টি পিডিএফ ও প্রজেক্ট ফাইল আপলোডকৃত</p>
                  <p className="text-emerald-700 font-bold">+ নতুন রিসোর্স আপলোড করুন</p>
                </div>
              </div>
            </div>
          )}

          {portalRoleTab === 'manager' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">ট্রেনিং সেন্টার ম্যানেজমেন্ট পোর্টাল</h3>
                    <p className="text-xs text-slate-500">এসকাডো কেন্দ্রীয় দক্ষতা ও আইসিটি ল্যাব, নোয়াখালী</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-xl">
                    সেন্টার কোড: TC-NOA-01
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-slate-400">চলতি সিট ক্যাপাসিটি:</span>
                  <p className="text-xl font-black text-slate-800 mt-1">১৮০ সিট</p>
                  <p className="text-emerald-700 font-bold">১৪২ জন ভর্তি</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-slate-400">কম্পিউটার ল্যাব সুবিধা:</span>
                  <p className="text-xl font-black text-slate-800 mt-1">৩টি ল্যাব</p>
                  <p className="text-slate-600">৬০টি হাই-কনফিগ পিসি</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-slate-400">পেন্ডিং আবেদন:</span>
                  <p className="text-xl font-black text-amber-700 mt-1">৮টি</p>
                  <p className="text-slate-600">ভেরিফিকেশন বাকি</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-slate-400">ইস্যুকৃত সার্টিফিকেট:</span>
                  <p className="text-xl font-black text-emerald-700 mt-1">৩২০+</p>
                  <p className="text-slate-600">QR ভেরিফাইড</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="bg-emerald-100 text-emerald-800 font-black px-3 py-1 rounded-full uppercase">
                  {selectedProgram.categoryNameBn}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  {selectedProgram.titleBn}
                </h2>
                <p className="text-slate-500 font-mono">{selectedProgram.title}</p>
              </div>
              <button
                onClick={() => setSelectedProgram(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div><span className="text-slate-400">কোর্সের মেয়াদ:</span> <strong className="text-slate-800 block">{selectedProgram.durationBn}</strong></div>
              <div><span className="text-slate-400">ক্লাস সংখ্যা:</span> <strong className="text-slate-800 block">{selectedProgram.totalClasses} টি ক্লাস</strong></div>
              <div><span className="text-slate-400">প্রশিক্ষক:</span> <strong className="text-slate-800 block">{selectedProgram.trainerNameBn}</strong></div>
              <div><span className="text-slate-400">ভর্তি ফি:</span> <strong className="text-emerald-700 block font-bold">৳{selectedProgram.discountFee || selectedProgram.courseFee}</strong></div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">কোর্সের প্রধান সুবিধাসমূহ:</h4>
              <ul className="space-y-1.5 text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> সরকারি ও বোর্ড অনুমোদিত ভেরিফাইড সনদপত্র</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> ১০০% প্র্যাকটিক্যাল হ্যান্ডস-অন ল্যাব প্রজেক্ট</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> কোর্স শেষে ইন্টার্নশিপ ও জব প্লেসমেন্ট সহায়তা</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> আজীবন লাইফটাইম সাপোর্ট ও অনলাইন স্টাডি ম্যাটেরিয়াল</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setAdmissionFormData(prev => ({
                    ...prev,
                    courseId: selectedProgram.id,
                    centerId: selectedProgram.centerId,
                    paymentAmount: selectedProgram.isFree ? 0 : (selectedProgram.discountFee ?? selectedProgram.courseFee ?? 0)
                  }));
                  setSelectedProgram(null);
                  setActiveTab('admission');
                }}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition"
              >
                <GraduationCap className="w-4 h-4" />
                <span>এখনই ভর্তি ফরম পূরণ করুন</span>
              </button>
              <button
                onClick={() => setSelectedProgram(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-3 rounded-xl text-xs"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Application Confirmation Modal */}
      {jobApplicationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 text-xs text-slate-700">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="font-black text-slate-900 text-sm">চাকরি আবেদন কনফার্মেশন</h3>
              </div>
              <button
                onClick={() => setJobApplicationModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">আবেদনের পদ:</span>
              <h4 className="font-black text-slate-900 text-base">{jobApplicationModal.job.titleBn}</h4>
              <p className="text-slate-600 font-medium">{jobApplicationModal.job.companyNameBn}</p>
              <div className="pt-2 border-t border-slate-200/60 flex justify-between font-mono text-[11px]">
                <span className="text-slate-500">অ্যাপ্লিকেশন ট্র্যাকিং আইডি:</span>
                <span className="font-bold text-emerald-800">{jobApplicationModal.trackingId}</span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-emerald-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                আপনার প্রোফাইল নিয়োগকারীর শর্টলিস্ট পুলে পাঠানো হয়েছে!
              </p>
              <p className="text-[11px] text-emerald-800">
                ইন্টারভিউ শিডিউল ও পরবর্তী আপডেটের জন্য আপনার নিবন্ধিত ফোন নম্বরে এসএমএস পাঠানো হবে।
              </p>
            </div>

            <button
              onClick={() => setJobApplicationModal(null)}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs transition shadow-xs"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
