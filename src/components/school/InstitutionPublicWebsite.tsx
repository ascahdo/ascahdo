import React, { useState } from 'react';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Download,
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Search,
  CheckCircle,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
  CreditCard,
  ChevronRight,
  ExternalLink,
  Home,
  UserCheck,
  Image as ImageIcon,
  Video,
  Info,
  Layers,
  ChevronLeft,
  X,
  Share2,
  ThumbsUp,
  Globe,
  BellRing
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { StudentResult } from '../../types/schoolTypes';
import {
  SchoolHeroPhotoSlider,
  SchoolPhotoGallerySlider,
  SchoolSlideItem
} from './SchoolPhotoSlider';

export const InstitutionPublicWebsite: React.FC<{
  onOpenERP: () => void;
}> = ({ onOpenERP }) => {
  const {
    activeInstitution,
    notices,
    teachers,
    results,
    exams,
    classes,
    gallery,
    newsEvents,
    submitOnlineAdmission,
    payFeeInvoice,
    fees
  } = useSchool();

  // Active section or tab
  const [activeTab, setActiveTab] = useState<
    'home' | 'about' | 'admission' | 'results' | 'teachers' | 'fees' | 'notices' | 'gallery' | 'contact' | 'committee' | 'students'
  >('home');

  // Modals for deep content
  const [modalContent, setModalContent] = useState<{
    title: string;
    category?: string;
    content: React.ReactNode;
  } | null>(null);

  // Online Admission State
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [appliedClass, setAppliedClass] = useState('Class 6');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [dob, setDob] = useState('2014-05-15');
  const [prevSchool, setPrevSchool] = useState('');
  const [admissionSuccessCode, setAdmissionSuccessCode] = useState<string | null>(null);
  
  // Admission Payment Method State (Free vs Digital vs Cash)
  const [admissionPaymentType, setAdmissionPaymentType] = useState<'free' | 'online' | 'cash'>('free');
  const [admissionPaymentMethod, setAdmissionPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('bKash');
  const [admissionTrxId, setAdmissionTrxId] = useState('');
  const [admissionSenderPhone, setAdmissionSenderPhone] = useState('');

  // Result Search State
  const [searchExamId, setSearchExamId] = useState(exams[0]?.id || '');
  const [searchRoll, setSearchRoll] = useState('101');
  const [searchedResult, setSearchedResult] = useState<StudentResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Online Fee Pay State
  const [feeStudentRoll, setFeeStudentRoll] = useState('103');
  const [feePaymentMethod, setFeePaymentMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [feeTrxId, setFeeTrxId] = useState('');
  const [feePaidSuccess, setFeePaidSuccess] = useState(false);

  const heroSchoolSlides: SchoolSlideItem[] = [
    {
      id: 'slide_1',
      url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1400&auto=format&fit=crop&q=80',
      title: 'Main Academic Campus & Green Playground',
      titleBn: 'আধুনিক অ্যাকাডেমিক ভবন ও সবুজ শ্যামল ক্যাম্পাস চত্বর',
      badge: 'ক্যাম্পাস পরিচিতি',
      caption: 'শিক্ষাবান্ধব মনোরম ও সুশৃঙ্খল পরিবেশে পাঠদানের শ্রেষ্ঠ প্রতিষ্ঠান'
    },
    {
      id: 'slide_2',
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1400&auto=format&fit=crop&q=80',
      title: 'High-Tech Computer & Multimedia ICT Lab',
      titleBn: 'উচ্চপ্রযুক্তির কম্পিউটার ল্যাব ও স্মার্ট মাল্টিমিডিয়া ক্লাসরুম',
      badge: 'ডিজিটাল ল্যাব',
      caption: 'শিক্ষার্থীদের আধুনিক তথ্যপ্রযুক্তি ও কোডিংয়ে দক্ষ করে তোলার জন্য ৬০ আসনের শীতাতপ নিয়ন্ত্রিত ল্যাব'
    },
    {
      id: 'slide_3',
      url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1400&auto=format&fit=crop&q=80',
      title: 'Modern Science & Chemistry Practical Lab',
      titleBn: 'উন্নত বিজ্ঞানাগার ও রসায়ন-পদার্থ ব্যবহারিক ল্যাব সেশন',
      badge: 'বিজ্ঞান গবেষণা',
      caption: 'হাতেকলমে বিজ্ঞান ও রোবটিক্স আবিষ্কারের আধুনিক যন্ত্রপাতি ও নিরাপত্তা সুবিধা'
    },
    {
      id: 'slide_4',
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1400&auto=format&fit=crop&q=80',
      title: 'Interactive High School Classroom Session',
      titleBn: 'আনন্দঘন ও অংশগ্রহণমূলক শ্রেণিকক্ষ পাঠদান অধিবেশন',
      badge: 'পাঠদান',
      caption: 'অভিজ্ঞ শিক্ষকমণ্ডলীর নিবিড় তত্ত্বাবধান ও নৈতিক মূল্যবোধ ভিত্তিক পাঠদান'
    },
    {
      id: 'slide_5',
      url: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1400&auto=format&fit=crop&q=80',
      title: 'Annual Sports Day & Football Tournament',
      titleBn: 'বার্ষিক ক্রীড়া প্রতিযোগিতা ও আন্তঃস্কুল ফুটবল টুর্নামেন্ট ২০২৬',
      badge: 'ক্রীড়া উৎসব',
      caption: 'শারীরিক ও মানসিক বিকাশে নিয়মিত খেলাধুলা ও বার্ষিক ক্রীড়া প্রতিযোগিতা'
    },
    {
      id: 'slide_6',
      url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1400&auto=format&fit=crop&q=80',
      title: 'Cultural Festival & Annual Prize Giving Ceremony',
      titleBn: 'মনোজ্ঞ সাংস্কৃতিক অনুষ্ঠান ও বার্ষিক মেধা পুরস্কার বিতরণী',
      badge: 'সাংস্কৃতিক সন্ধ্যা',
      caption: 'শিক্ষার্থীদের সুপ্ত প্রতিভার বিকাশ ও জাতীয় পর্যায়ের পুরস্কার অর্জন'
    }
  ];

  const handleAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone || !guardianName) return;

    if (admissionPaymentType === 'online' && !admissionTrxId.trim()) {
      alert('অনুগ্রহ করে পেমেন্ট সম্পন্ন করে TrxID (ট্রানজেকশন আইডি) প্রদান করুন। অথবা "সম্পূর্ণ বিনামূল্যে (Free)" অপশনটি বেছে নিন।');
      return;
    }

    const isFree = admissionPaymentType === 'free';
    const isCash = admissionPaymentType === 'cash';

    submitOnlineAdmission({
      applicantName,
      applicantPhone,
      guardianName,
      appliedClass,
      gender,
      dob,
      previousSchool: prevSchool,
      status: 'submitted',
      appliedDate: new Date().toISOString().slice(0, 10),
      admissionFeeStatus: isFree ? 'free' : (isCash ? 'unpaid' : 'paid'),
      feeType: admissionPaymentType,
      paymentMethod: isFree ? 'free' : (isCash ? 'Cash' : admissionPaymentMethod),
      feeAmount: isFree ? 0 : 300,
      trxId: isFree ? 'FREE-WAIVER' : (isCash ? 'PAY-AT-OFFICE' : admissionTrxId),
      senderPhone: admissionSenderPhone || applicantPhone
    });

    const code = `ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setAdmissionSuccessCode(code);
    setApplicantName('');
    setApplicantPhone('');
    setGuardianName('');
    setAdmissionTrxId('');
    setAdmissionSenderPhone('');
  };

  const handleResultSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const found = results.find(
      (r) => r.studentRoll.trim() === searchRoll.trim() && (!searchExamId || r.examId === searchExamId)
    );
    setSearchedResult(found || null);
  };

  const handleFeePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invoice = fees.find((f) => f.studentRoll === feeStudentRoll && f.status !== 'paid') || fees[0];
    if (invoice) {
      payFeeInvoice(invoice.id, feePaymentMethod, feeTrxId || `TXN${Date.now().toString().slice(-8)}`);
      setFeePaidSuccess(true);
    }
  };

  // Vice Principal info default
  const vicePrincipal = {
    name: 'প্রকৌশলী মাহমুদুল হাসান',
    designation: 'সহকারী প্রধান শিক্ষক / উপ-অধ্যক্ষ',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    message:
      'জ্ঞান, শৃঙ্খলা ও নৈতিকতার সমন্বয়ে প্রতিটি শিক্ষার্থীকে আগামীর প্রযুক্তিভিত্তিক স্মার্ট বাংলাদেশের যোগ্য নাগরিক হিসেবে গড়ে তোলা আমাদের অঙ্গীকার। আমরা নিবেদিতপ্রাণ শিক্ষক ও আধুনিক পাঠদানের মাধ্যমে শিক্ষার্থীদের সুপ্ত মেধা বিকাশে সচেষ্ট।'
  };

  // Open Details Modal Helper
  const openInfoModal = (title: string, content: React.ReactNode) => {
    setModalContent({ title, content });
  };

  return (
    <div className="bg-[#eef2f6] text-slate-800 min-h-screen flex flex-col font-sans">
      {/* 1. TOP HEADER (Classic Bangladeshi School & College Portal Blue Banner) */}
      <div className="bg-[#0275d8] text-white border-b-2 border-[#01549b] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Bangladesh Emblem / School Monogram Seal & Title */}
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            {/* National Crest / Circular Emblem */}
            <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full p-1 border-2 border-amber-300 shadow-lg flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#006a4e] flex items-center justify-center p-1 border border-red-500 relative overflow-hidden">
                <div className="w-6 h-6 rounded-full bg-[#f42a41] absolute"></div>
                <div className="text-[9px] font-black text-amber-300 z-10 text-center uppercase tracking-tighter leading-none">
                  গণপ্রজাতন্ত্রী<br />বাংলাদেশ<br />সরকার
                </div>
              </div>
            </div>

            {/* School Name & Location Subtitle */}
            <div className="space-y-1">
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-wide drop-shadow-sm font-serif">
                {activeInstitution.nameBn}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm font-semibold text-sky-100">
                <span>উপজেলা: সদর, জেলা: {activeInstitution.district || 'ঢাকা'}।</span>
                <span className="hidden sm:inline">•</span>
                <span className="bg-sky-900/60 px-2 py-0.5 rounded text-[11px] text-amber-300 font-mono">
                  {activeInstitution.code}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="text-[11px] text-sky-200">স্থাপিত: {activeInstitution.establishedYear} খ্রি.</span>
              </div>
            </div>
          </div>

          {/* Right: Quick Action Buttons & ERP Access */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('admission')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm px-3.5 py-2 rounded shadow transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>অনলাইন ভর্তি</span>
            </button>
            <button
              onClick={onOpenERP}
              className="bg-[#004d80] hover:bg-[#00385d] text-white border border-sky-300 font-bold text-xs sm:text-sm px-3.5 py-2 rounded shadow transition flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>ERP লগইন</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. HORIZONTAL NAVIGATION MENU BAR (Classic Blue/Slate Horizontal Menu with Icons) */}
      <nav className="bg-[#005cbf] border-y border-[#00438a] text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex items-center overflow-x-auto text-xs sm:text-sm font-bold scrollbar-none divide-x divide-[#004b99]">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2.5 flex items-center gap-1.5 hover:bg-[#00438a] transition whitespace-nowrap ${
                activeTab === 'home' ? 'bg-[#00438a] text-amber-300' : 'text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>হোম</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`px-3 py-2.5 hover:bg-[#00438a] transition whitespace-nowrap ${
                activeTab === 'about' ? 'bg-[#00438a] text-amber-300' : 'text-white'
              }`}
            >
              সাধারণ পেজ
            </button>

            <button
              onClick={() =>
                openInfoModal(
                  'অধ্যক্ষের বাণী - বিস্তারিত',
                  <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                    <div className="flex items-center gap-4 bg-sky-50 p-4 rounded-xl border border-sky-200">
                      <img
                        src={activeInstitution.principalPhoto}
                        alt="Principal"
                        className="w-24 h-24 rounded-lg object-cover border border-slate-300"
                      />
                      <div>
                        <h4 className="font-bold text-base text-slate-900">{activeInstitution.principalName}</h4>
                        <p className="text-xs text-sky-700 font-semibold">অধ্যক্ষ / প্রধান শিক্ষক</p>
                        <p className="text-xs text-slate-500">{activeInstitution.nameBn}</p>
                      </div>
                    </div>
                    <p>
                      বিসমিল্লাহির রাহমানির রাহিম। ঐতিহ্যবাহী {activeInstitution.nameBn} এর পক্ষ থেকে সবাইকে জানাচ্ছি আন্তরিক অভিনন্দন ও শুভেচ্ছা।
                    </p>
                    <p>
                      {activeInstitution.principalMessage ||
                        'আমাদের প্রতিষ্ঠানের প্রতিটি শিক্ষার্থীকে আমরা জ্ঞান ও নৈতিকতার সমন্বয়ে একজন আলোকিত মানুষ হিসেবে গড়ে তুলতে প্রতিশ্রুতিবদ্ধ। শিক্ষা কোনো বাণিজ্যিক পণ্য নয়, এটি একটি পবিত্র আমানত। আধুনিক তথ্যপ্রযুক্তি, বিজ্ঞানসম্মত কারিকুলাম এবং সহশিক্ষা কার্যক্রমের মাধ্যমে আমরা শিক্ষার্থীদের আন্তর্জাতিক মানে উন্নীত করতে নিরলস কাজ করছি।'}
                    </p>
                    <p>
                      অভিভাবক ও সুধীসমাজের সার্বিক সহযোগিতা কামনা করছি যাতে আমাদের প্রিয় সন্তানরা মেধা ও মননে দেশের শ্রেষ্ঠ সম্পদে পরিণত হতে পারে। ধন্যবাদান্তে।
                    </p>
                  </div>
                )
              }
              className="px-3 py-2.5 hover:bg-[#00438a] transition whitespace-nowrap text-white"
            >
              অধ্যক্ষের বাণী
            </button>

            <button
              onClick={() => setActiveTab('teachers')}
              className={`px-3 py-2.5 hover:bg-[#00438a] transition whitespace-nowrap ${
                activeTab === 'teachers' ? 'bg-[#00438a] text-amber-300' : 'text-white'
              }`}
            >
              শিক্ষকবৃন্দ
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`px-3 py-2.5 hover:bg-[#00438a] transition whitespace-nowrap ${
                activeTab === 'students' ? 'bg-[#00438a] text-amber-300' : 'text-white'
              }`}
            >
              কৃতি ছাত্র ছাত্রী
            </button>

            <button
              onClick={() => setActiveTab('committee')}
              className={`px-3 py-2.5 hover:bg-[#00438a] transition whitespace-nowrap ${
                activeTab === 'committee' ? 'bg-[#00438a] text-amber-300' : 'text-white'
              }`}
            >
              পরিচালনা পরিষদ
            </button>

            <button
              onClick={() => setActiveTab('admission')}
              className={`px-3 py-2.5 hover:bg-[#00438a] transition whitespace-nowrap ${
                activeTab === 'admission' ? 'bg-[#00438a] text-amber-300' : 'text-white'
              }`}
            >
              অনলাইন ভর্তি
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`px-3 py-2.5 hover:bg-[#00438a] transition whitespace-nowrap ${
                activeTab === 'results' ? 'bg-[#00438a] text-amber-300' : 'text-white'
              }`}
            >
              রেজাল্ট অনুসন্ধান
            </button>

            <button
              onClick={() => setActiveTab('fees')}
              className={`px-3 py-2.5 hover:bg-[#00438a] transition whitespace-nowrap ${
                activeTab === 'fees' ? 'bg-[#00438a] text-amber-300' : 'text-white'
              }`}
            >
              অনলাইন ফি
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-3 py-2.5 hover:bg-[#00438a] transition whitespace-nowrap ${
                activeTab === 'gallery' ? 'bg-[#00438a] text-amber-300' : 'text-white'
              }`}
            >
              ফটো গ্যালারী
            </button>

            <button
              onClick={() =>
                openInfoModal(
                  'ভিডিও গ্যালারী ও লাইভ ক্লাস',
                  <div className="space-y-4 text-center py-4">
                    <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden shadow flex items-center justify-center relative">
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="Campus Video"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">বার্ষিক ক্রীড়া ও সাংস্কৃতিক অনুষ্ঠান ২০২৬</h4>
                    <p className="text-xs text-slate-500">প্রতিষ্ঠান প্রাঙ্গণে অনুষ্ঠিত মনোজ্ঞ সাংস্কৃতিক পর্ব</p>
                  </div>
                )
              }
              className="px-3 py-2.5 hover:bg-[#00438a] transition whitespace-nowrap text-white"
            >
              ভিডিও গ্যালারী
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`px-3 py-2.5 hover:bg-[#00438a] transition whitespace-nowrap ${
                activeTab === 'contact' ? 'bg-[#00438a] text-amber-300' : 'text-white'
              }`}
            >
              যোগাযোগ
            </button>
          </div>
        </div>
      </nav>

      {/* 3. MAIN CONTAINER: 2-COLUMN PORTAL LAYOUT (Matching Screenshot) */}
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-4 py-4 flex-1">
        {/* If Active Tab is 'home', render the classic 2-Column Home Layout */}
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* ================= LEFT MAIN CONTENT (8 COLUMNS / ~70%) ================= */}
            <div className="lg:col-span-8 space-y-4">
              {/* DYNAMIC SCHOOL PHOTO SLIDER & MARQUEE STRIP */}
              <div className="space-y-2">
                <SchoolHeroPhotoSlider
                  slides={heroSchoolSlides}
                  institutionName={activeInstitution.nameBn}
                  onOpenAdmission={() => setActiveTab('admission')}
                  onOpenGallery={() => setActiveTab('gallery')}
                />

                {/* Slider Caption Strip / Blue Marquee Bar */}
                <div className="bg-[#0275d8] text-white py-2 px-3 rounded-lg shadow-xs flex items-center justify-between text-xs sm:text-sm font-bold border border-[#01549b]">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-amber-300 animate-pulse">✪</span>
                    <span className="truncate">আগামী শনিবার সরকারি ছুটির কারণে সকল শ্রেণি কার্যক্রম বন্ধ থাকবে।</span>
                  </div>
                  <span className="text-[11px] text-sky-200 shrink-0 font-mono bg-[#01549b] px-2 py-0.5 rounded">২০২৬</span>
                </div>
              </div>

              {/* NOTICE BOARD WIDGET (Classic Blue Box with "নোটিশ" header) */}
              <div className="bg-white border border-slate-300 shadow-sm rounded-lg overflow-hidden">
                <div className="bg-[#0275d8] text-white px-3.5 py-2 flex items-center justify-between">
                  <h3 className="font-bold text-sm sm:text-base flex items-center gap-1.5 font-serif">
                    <FileText className="w-4 h-4 text-amber-300" />
                    <span>নোটিশ</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('notices')}
                    className="text-xs bg-[#01549b] hover:bg-[#003d73] text-white px-2.5 py-1 rounded font-semibold transition"
                  >
                    বিস্তারিত..
                  </button>
                </div>

                <div className="p-3 divide-y divide-slate-100 text-xs sm:text-sm">
                  {notices.map((n, idx) => (
                    <div
                      key={n.id}
                      onClick={() =>
                        openInfoModal(
                          n.titleBn,
                          <div className="space-y-3">
                            <div className="text-xs text-slate-500">প্রকাশকাল: {n.publishDate} | ক্যাটাগরি: {n.category}</div>
                            <p className="text-sm text-slate-700 leading-relaxed">{n.content}</p>
                            <button
                              onClick={() => window.print()}
                              className="mt-4 bg-[#0275d8] text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-1"
                            >
                              <Download className="w-3.5 h-3.5" /> প্রিন্ট / ডাউনলোড
                            </button>
                          </div>
                        )
                      }
                      className="py-2.5 px-2 hover:bg-sky-50 transition cursor-pointer flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 text-slate-800 font-semibold truncate">
                        <span className="text-[#0275d8]">📄</span>
                        <span className="truncate">{n.titleBn}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono shrink-0">{n.publishDate}</span>
                    </div>
                  ))}
                  {notices.length === 0 && (
                    <div className="py-3 text-center text-slate-400 text-xs">কোনো নোটিশ পাওয়া যায়নি।</div>
                  )}
                </div>
              </div>

              {/* "বিস্তারিত" INSTITUTIONAL INFO 2-COLUMN GRID (Matching the screenshot's 8 info boxes) */}
              <div className="bg-white border border-slate-300 shadow-sm rounded-lg overflow-hidden">
                <div className="bg-[#0275d8] text-white px-3.5 py-2 flex items-center justify-between">
                  <h3 className="font-bold text-sm sm:text-base font-serif">বিস্তারিত</h3>
                </div>

                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Item 1: প্রতিষ্ঠান */}
                  <div className="border border-slate-200 rounded p-3 bg-slate-50 hover:bg-white hover:border-[#0275d8] transition flex gap-3 items-start">
                    <div className="w-12 h-12 rounded bg-[#0275d8] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <h4 className="font-bold text-slate-900 text-sm">প্রতিষ্ঠান</h4>
                      <ul className="space-y-0.5 text-slate-600">
                        <li
                          onClick={() => setActiveTab('about')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> প্রতিষ্ঠানের ইতিহাস
                        </li>
                        <li
                          onClick={() => setActiveTab('about')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> লক্ষ্য ও উদ্দেশ্য
                        </li>
                        <li
                          onClick={() => setActiveTab('teachers')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> শিক্ষক ও কর্মচারীবৃন্দ
                        </li>
                        <li
                          onClick={() => setActiveTab('about')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> ভৌত অবকাঠামো
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Item 2: পরিচালনা পরিষদ */}
                  <div className="border border-slate-200 rounded p-3 bg-slate-50 hover:bg-white hover:border-[#0275d8] transition flex gap-3 items-start">
                    <div className="w-12 h-12 rounded bg-[#0275d8] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <h4 className="font-bold text-slate-900 text-sm">পরিচালনা পরিষদ</h4>
                      <ul className="space-y-0.5 text-slate-600">
                        <li
                          onClick={() => setActiveTab('committee')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> গভর্নিং বডি ও কমিটি
                        </li>
                        <li
                          onClick={() => setActiveTab('committee')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> সভাপতির বক্তব্য
                        </li>
                        <li
                          onClick={() => setActiveTab('committee')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> প্রতিষ্ঠাতা সদস্যবৃন্দ
                        </li>
                        <li
                          onClick={() => setActiveTab('committee')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> বর্তমান পরিচালনা পর্ষদ
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Item 3: শিক্ষার্থী কর্নার */}
                  <div className="border border-slate-200 rounded p-3 bg-slate-50 hover:bg-white hover:border-[#0275d8] transition flex gap-3 items-start">
                    <div className="w-12 h-12 rounded bg-[#0275d8] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <h4 className="font-bold text-slate-900 text-sm">শিক্ষার্থী কর্নার</h4>
                      <ul className="space-y-0.5 text-slate-600">
                        <li
                          onClick={() => setActiveTab('students')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> কৃতি ছাত্র-ছাত্রী তালিকা
                        </li>
                        <li
                          onClick={() =>
                            openInfoModal(
                              'পোশাকের নিয়মাবলি (Dress Code)',
                              <div className="space-y-2 text-sm text-slate-700">
                                <p>১. ছাত্রদের জন্য: সাদা শার্ট, নেভি ব্লু প্যান্ট ও কালো জুতো।</p>
                                <p>২. ছাত্রীদের জন্য: নেভি ব্লু ফ্রক/কুর্তি, সাদা সালোয়ার ও সাদা স্কার্ফ/ওড়না।</p>
                                <p>৩. প্রতিটি শিক্ষার্থীর জন্য নির্ধারিত আইডি কার্ড পরিধান বাধ্যতামূলক।</p>
                              </div>
                            )
                          }
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> পোশাকের নিয়মাবলি
                        </li>
                        <li
                          onClick={() =>
                            openInfoModal(
                              'শিক্ষার্থীদের আচরণবিধি',
                              <div className="space-y-2 text-sm text-slate-700">
                                <p>• সকাল ৯:০০ টার পূর্বে অবশ্যই শ্রেণিকক্ষে উপস্থিত হতে হবে।</p>
                                <p>• প্রতিষ্ঠানের সম্পদ রক্ষা ও পরিচ্ছন্নতা বজায় রাখা সকলের দায়িত্ব।</p>
                                <p>• মোবাইল ফোন বা কোনো ধরনের ইলেকট্রনিক ডিভাইস আনা সম্পূর্ণ নিষিদ্ধ।</p>
                              </div>
                            )
                          }
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> আচরণবিধি ও শৃঙ্খলা
                        </li>
                        <li
                          onClick={() => setActiveTab('students')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> শ্রেণিভিত্তিক পরিসংখ্যান
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Item 4: অ্যাকাডেমিক তথ্য */}
                  <div className="border border-slate-200 rounded p-3 bg-slate-50 hover:bg-white hover:border-[#0275d8] transition flex gap-3 items-start">
                    <div className="w-12 h-12 rounded bg-[#0275d8] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <h4 className="font-bold text-slate-900 text-sm">অ্যাকাডেমিক তথ্য</h4>
                      <ul className="space-y-0.5 text-slate-600">
                        <li
                          onClick={() =>
                            openInfoModal(
                              'সাপ্তাহিক ক্লাস রুটিন ২০২৬',
                              <div className="space-y-3">
                                <p className="text-xs text-slate-500">সকল শ্রেণির সমন্বিত ক্লাস রুটিন</p>
                                <div className="border border-slate-200 rounded-lg overflow-hidden">
                                  <table className="w-full text-xs text-left">
                                    <thead className="bg-[#0275d8] text-white">
                                      <tr>
                                        <th className="p-2">পিরিয়ড</th>
                                        <th className="p-2">সময়</th>
                                        <th className="p-2">৬ষ্ঠ শ্রেণি</th>
                                        <th className="p-2">৭ম শ্রেণি</th>
                                        <th className="p-2">১০ম শ্রেণি</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                      <tr>
                                        <td className="p-2 font-bold">১ম</td>
                                        <td className="p-2">০৯:০০ - ০৯:৪৫</td>
                                        <td className="p-2">বাংলা</td>
                                        <td className="p-2">গণিত</td>
                                        <td className="p-2">ইংরেজি</td>
                                      </tr>
                                      <tr>
                                        <td className="p-2 font-bold">২য়</td>
                                        <td className="p-2">০৯:৪৫ - ১০:৩০</td>
                                        <td className="p-2">ইংরেজি</td>
                                        <td className="p-2">বিজ্ঞান</td>
                                        <td className="p-2">উচ্চতর গণিত</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )
                          }
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> ক্লাস রুটিন
                        </li>
                        <li
                          onClick={() => setActiveTab('results')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> পরীক্ষার সময়সূচি
                        </li>
                        <li
                          onClick={() =>
                            openInfoModal(
                              'সিলেবাস ও পাঠপরিকল্পনা',
                              <div className="space-y-2 text-sm text-slate-700">
                                <p>জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) প্রণীত নতুন কারিকুলাম অনুসারে পাঠপরিকল্পনা প্রস্তুত করা হয়েছে।</p>
                                <button className="bg-[#0275d8] text-white px-3 py-1.5 rounded text-xs flex items-center gap-1">
                                  <Download className="w-3.5 h-3.5" /> সিলেবাস ডাউনলোড করুন
                                </button>
                              </div>
                            )
                          }
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> সিলেবাস ও পাঠপরিকল্পনা
                        </li>
                        <li
                          onClick={() =>
                            openInfoModal(
                              'বাৎসরিক ছুটির তালিকা ২০২৬',
                              <div className="space-y-2 text-sm text-slate-700">
                                <p>• একুশে ফেব্রুয়ারি ও আন্তর্জাতিক মাতৃভাষা দিবস: ১ দিন</p>
                                <p>• পবিত্র ঈদুল ফিতর ও রমজান ছুটি: ২১ দিন</p>
                                <p>• গ্রীষ্মকালীন অবকাশ ও ঈদুল আযহা: ১২ দিন</p>
                                <p>• দুর্গাপূজা ছুটি: ৭ দিন</p>
                              </div>
                            )
                          }
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> বাৎসরিক ছুটির তালিকা
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Item 5: ফলাফল ও মূল্যায়ন */}
                  <div className="border border-slate-200 rounded p-3 bg-slate-50 hover:bg-white hover:border-[#0275d8] transition flex gap-3 items-start">
                    <div className="w-12 h-12 rounded bg-[#0275d8] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Award className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <h4 className="font-bold text-slate-900 text-sm">ফলাফল ও মূল্যায়ন</h4>
                      <ul className="space-y-0.5 text-slate-600">
                        <li
                          onClick={() => setActiveTab('results')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> এস এস সি ও এইচ এস সি রেজাল্ট
                        </li>
                        <li
                          onClick={() => setActiveTab('results')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> সাময়িক ও বার্ষিক পরীক্ষার রেজাল্ট
                        </li>
                        <li
                          onClick={() => setActiveTab('results')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> গ্রেড ও মেধা তালিকা
                        </li>
                        <li
                          onClick={() => setActiveTab('results')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> ডিজিটাল মার্কশিট প্রিন্ট
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Item 6: ভর্তি ও ফি */}
                  <div className="border border-slate-200 rounded p-3 bg-slate-50 hover:bg-white hover:border-[#0275d8] transition flex gap-3 items-start">
                    <div className="w-12 h-12 rounded bg-[#0275d8] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <h4 className="font-bold text-slate-900 text-sm">ভর্তি ও ফি</h4>
                      <ul className="space-y-0.5 text-slate-600">
                        <li
                          onClick={() => setActiveTab('admission')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> অনলাইন ভর্তি আবেদন
                        </li>
                        <li
                          onClick={() => setActiveTab('fees')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> বিকাশ/নগদে মাসিক ফি পরিশোধ
                        </li>
                        <li
                          onClick={() => setActiveTab('admission')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> ভর্তি ফি ও আসন সংখ্যা
                        </li>
                        <li
                          onClick={() => setActiveTab('fees')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> ডিজিটাল মানি রসিদ সংগ্রহ
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Item 7: সহ-শিক্ষা কার্যক্রম */}
                  <div className="border border-slate-200 rounded p-3 bg-slate-50 hover:bg-white hover:border-[#0275d8] transition flex gap-3 items-start">
                    <div className="w-12 h-12 rounded bg-[#0275d8] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <h4 className="font-bold text-slate-900 text-sm">সহ-শিক্ষা কার্যক্রম</h4>
                      <ul className="space-y-0.5 text-slate-600">
                        <li
                          onClick={() =>
                            openInfoModal(
                              'বাংলাদেশ স্কাউটস ও গার্লস গাইড ইউনিট',
                              <div className="text-sm text-slate-700">
                                আমাদের প্রতিষ্ঠানে রয়েছে সক্রিয় স্কাউট ও গার্লস গাইড দল, যারা জেলা ও জাতীয় পর্যায়ের সমাবেশ ও সেবায় অংশ নিয়ে থাকে।
                              </div>
                            )
                          }
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> স্কাউটস ও গার্লস গাইড
                        </li>
                        <li
                          onClick={() =>
                            openInfoModal(
                              'বিজ্ঞান ক্লাব ও বিতর্ক পরিষদ',
                              <div className="text-sm text-slate-700">
                                শিক্ষার্থীদের উদ্ভাবনী চিন্তা ও যুক্তিবোধ চর্চায় প্রতি সপ্তাহে বিতর্ক ও বিজ্ঞান ওয়ার্কশপ অনুষ্ঠিত হয়।
                              </div>
                            )
                          }
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> বিজ্ঞান ক্লাব ও বিতর্ক পরিষদ
                        </li>
                        <li
                          onClick={() => setActiveTab('gallery')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> বার্ষিক ক্রীড়া প্রতিযোগিতা
                        </li>
                        <li
                          onClick={() => setActiveTab('gallery')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> বার্ষিক ম্যাগাজিন ও স্মরণিকা
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Item 8: ডাউনলোড কর্নার */}
                  <div className="border border-slate-200 rounded p-3 bg-slate-50 hover:bg-white hover:border-[#0275d8] transition flex gap-3 items-start">
                    <div className="w-12 h-12 rounded bg-[#0275d8] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Download className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <h4 className="font-bold text-slate-900 text-sm">ডাউনলোড কর্নার</h4>
                      <ul className="space-y-0.5 text-slate-600">
                        <li
                          onClick={() =>
                            openInfoModal(
                              'প্রশংসাপত্র (Testimonial) আবেদন ফরম',
                              <div className="space-y-3 text-sm text-slate-700">
                                <p>উত্তীর্ণ শিক্ষার্থীদের প্রশংসাপত্র ও প্রত্যয়ন পত্র সংগ্রহের ফরম ডাউনলোড করুন।</p>
                                <button className="bg-[#0275d8] text-white px-3 py-1.5 rounded text-xs flex items-center gap-1">
                                  <Download className="w-3.5 h-3.5" /> ফরম ডাউনলোড
                                </button>
                              </div>
                            )
                          }
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> প্রশংসাপত্র আবেদন ফরম
                        </li>
                        <li
                          onClick={() => setActiveTab('admission')}
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> ভর্তি ফরম ও প্রসপেক্টাস
                        </li>
                        <li
                          onClick={() =>
                            openInfoModal(
                              'ছুটির আবেদন ফরম',
                              <div className="space-y-3 text-sm text-slate-700">
                                <p>অসুস্থতা বা জরুরি কারণে ছুটির জন্য আবেদন পত্রের নমুনা ফরম।</p>
                                <button className="bg-[#0275d8] text-white px-3 py-1.5 rounded text-xs flex items-center gap-1">
                                  <Download className="w-3.5 h-3.5" /> ছুটির ফরম ডাউনলোড
                                </button>
                              </div>
                            )
                          }
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> ছুটির আবেদন ফরম
                        </li>
                        <li
                          onClick={() =>
                            openInfoModal(
                              'ছাড়পত্র (TC) আবেদন ফরম',
                              <div className="space-y-3 text-sm text-slate-700">
                                <p>স্থানান্তর বা ছাড়পত্র গ্রহণের আবেদন ফরম।</p>
                                <button className="bg-[#0275d8] text-white px-3 py-1.5 rounded text-xs flex items-center gap-1">
                                  <Download className="w-3.5 h-3.5" /> টিসি ফরম ডাউনলোড
                                </button>
                              </div>
                            )
                          }
                          className="hover:text-[#0275d8] cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[#0275d8] font-bold">✪</span> ছাড়পত্র (TC) আবেদন
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* NEWS FEED SECTION (Matching the screenshot's News Feed Cards with Photos) */}
              <div className="bg-white border border-slate-300 shadow-sm rounded-lg overflow-hidden">
                <div className="bg-[#0275d8] text-white px-3.5 py-2 flex items-center justify-between">
                  <h3 className="font-bold text-sm sm:text-base font-serif">নিউজ ফিড</h3>
                </div>

                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* News Card 1 */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs flex flex-col">
                    <img
                      src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80"
                      alt="News 1"
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                          এটি চতুর্থ ব্লগ - বিজ্ঞান ও প্রযুক্তি মেলায় শিক্ষার্থীদের চমকপ্রদ উদ্ভাবন
                        </h4>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">
                          আমি কোনো ভাষাবিজ্ঞানী নই। তাই ভাষাগত, শব্দবিন্যাসগত শুদ্ধতা, তারল্য এসব বিষয়ে আমার জ্ঞান খুবই প্রাথমিক। তাই এই লেখায় এসব ভাষাবিজ্ঞানগত...
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          openInfoModal(
                            'বিজ্ঞান ও প্রযুক্তি মেলায় শিক্ষার্থীদের চমকপ্রদ উদ্ভাবন',
                            <div className="space-y-3 text-sm text-slate-700">
                              <img
                                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80"
                                alt="News"
                                className="w-full h-56 object-cover rounded-xl"
                              />
                              <p>
                                বিজ্ঞান ও প্রযুক্তি উদ্ভাবনে আমাদের শিক্ষার্থীরা একাধিক প্রোজেক্ট প্রদর্শন করেছে। অনুষ্ঠানে প্রধান অতিথি হিসেবে উপস্থিত থেকে কৃতী শিক্ষার্থীদের মাঝে পুরস্কার বিতরণ করেন উপজেলা নির্বাহী কর্মকর্তা।
                              </p>
                            </div>
                          )
                        }
                        className="text-[#0275d8] hover:underline font-bold text-xs self-start pt-1"
                      >
                        আরও পড়ুন...
                      </button>
                    </div>
                  </div>

                  {/* News Card 2 */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs flex flex-col">
                    <img
                      src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80"
                      alt="News 2"
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                          এটি তৃতীয় ব্লগ - বার্ষিক পুরস্কার বিতরণ ও অভিভাবক সমাবেশ
                        </h4>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">
                          আমি কোনো ভাষাবিজ্ঞানী নই। তাই ভাষাগত, শব্দবিন্যাসগত শুদ্ধতা, তারল্য এসব বিষয়ে আমার জ্ঞান খুবই প্রাথমিক। তাই এই লেখায় এসব ভাষাবিজ্ঞানগত...
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          openInfoModal(
                            'বার্ষিক পুরস্কার বিতরণ ও অভিভাবক সমাবেশ',
                            <div className="space-y-3 text-sm text-slate-700">
                              <img
                                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80"
                                alt="News"
                                className="w-full h-56 object-cover rounded-xl"
                              />
                              <p>
                                প্রতিষ্ঠানের অডিটোরিয়ামে অভিভাবক ও শিক্ষকদের উপস্থিতিতে বার্ষিক ফলাফল ও পুরস্কার বিতরণী অনুষ্ঠান উদযাপিত হয়েছে।
                              </p>
                            </div>
                          )
                        }
                        className="text-[#0275d8] hover:underline font-bold text-xs self-start pt-1"
                      >
                        আরও পড়ুন...
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* INTERACTIVE SCHOOL PHOTO GALLERY SLIDER ON HOMEPAGE */}
              <SchoolPhotoGallerySlider
                items={gallery}
                title="ক্যাম্পাস ফটো গ্যালারি স্লাইডার"
                subtitle="প্রতিষ্ঠান প্রাঙ্গণ, কম্পিউটার ও বিজ্ঞান ল্যাব, শ্রেণিকক্ষ, বার্ষিক ক্রীড়া ও সাংস্কৃতিক অনুষ্ঠানের আলোকচিত্র"
                onViewAll={() => setActiveTab('gallery')}
              />
            </div>

            {/* ================= RIGHT SIDEBAR (4 COLUMNS / ~30%) ================= */}
            <div className="lg:col-span-4 space-y-4">
              {/* WIDGET 1: অধ্যক্ষের বাণী */}
              <div className="bg-white border border-slate-300 shadow-sm rounded-lg overflow-hidden">
                <div className="bg-[#0275d8] text-white px-3.5 py-1.5 font-bold text-sm font-serif">
                  অধ্যক্ষের বাণী
                </div>
                <div className="p-3 space-y-2 text-center sm:text-left">
                  <div className="flex justify-center">
                    <img
                      src={
                        activeInstitution.principalPhoto ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
                      }
                      alt="Principal"
                      className="w-28 h-32 object-cover border border-slate-300 shadow-sm rounded"
                    />
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed text-justify">
                    {activeInstitution.principalMessage ? (
                      activeInstitution.principalMessage.slice(0, 140) + '...'
                    ) : (
                      'আমার বাংলা নিয়ে প্রথম কাজ করার সুযোগ তৈরি হয়েছিল অব্র নামক এক যুগান্তকারী বাংলা সফটওয়্যার হাতে পাবার মধ্য দিয়ে। এর পর একে একে বাংলা উইকিপিডিয়া, ওয়ার্ডপ্রেস বাংলা...'
                    )}
                  </div>
                  <button
                    onClick={() =>
                      openInfoModal(
                        'অধ্যক্ষের বাণী - বিস্তারিত',
                        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                          <div className="flex items-center gap-4 bg-sky-50 p-4 rounded-xl border border-sky-200">
                            <img
                              src={activeInstitution.principalPhoto}
                              alt="Principal"
                              className="w-24 h-24 rounded-lg object-cover border border-slate-300"
                            />
                            <div>
                              <h4 className="font-bold text-base text-slate-900">{activeInstitution.principalName}</h4>
                              <p className="text-xs text-sky-700 font-semibold">অধ্যক্ষ / প্রধান শিক্ষক</p>
                              <p className="text-xs text-slate-500">{activeInstitution.nameBn}</p>
                            </div>
                          </div>
                          <p>
                            {activeInstitution.principalMessage ||
                              'আমাদের প্রতিষ্ঠানের প্রতিটি শিক্ষার্থীকে আমরা জ্ঞান ও নৈতিকতার সমন্বয়ে একজন আলোকিত মানুষ হিসেবে গড়ে তুলতে প্রতিশ্রুতিবদ্ধ।'}
                          </p>
                        </div>
                      )
                    }
                    className="bg-[#0275d8] hover:bg-[#01549b] text-white text-xs font-bold px-3 py-1 rounded transition block"
                  >
                    বিস্তারিত..
                  </button>
                </div>
              </div>

              {/* WIDGET 2: উপ-অধ্যক্ষের বাণী */}
              <div className="bg-white border border-slate-300 shadow-sm rounded-lg overflow-hidden">
                <div className="bg-[#0275d8] text-white px-3.5 py-1.5 font-bold text-sm font-serif">
                  উপ-অধ্যক্ষের বাণী
                </div>
                <div className="p-3 space-y-2 text-center sm:text-left">
                  <div className="flex justify-center">
                    <img
                      src={vicePrincipal.photo}
                      alt="Vice Principal"
                      className="w-28 h-32 object-cover border border-slate-300 shadow-sm rounded"
                    />
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed text-justify">
                    {vicePrincipal.message.slice(0, 140)}...
                  </div>
                  <button
                    onClick={() =>
                      openInfoModal(
                        'উপ-অধ্যক্ষের বাণী - বিস্তারিত',
                        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                          <div className="flex items-center gap-4 bg-sky-50 p-4 rounded-xl border border-sky-200">
                            <img
                              src={vicePrincipal.photo}
                              alt="Vice Principal"
                              className="w-24 h-24 rounded-lg object-cover border border-slate-300"
                            />
                            <div>
                              <h4 className="font-bold text-base text-slate-900">{vicePrincipal.name}</h4>
                              <p className="text-xs text-sky-700 font-semibold">{vicePrincipal.designation}</p>
                              <p className="text-xs text-slate-500">{activeInstitution.nameBn}</p>
                            </div>
                          </div>
                          <p>{vicePrincipal.message}</p>
                        </div>
                      )
                    }
                    className="bg-[#0275d8] hover:bg-[#01549b] text-white text-xs font-bold px-3 py-1 rounded transition block"
                  >
                    বিস্তারিত..
                  </button>
                </div>
              </div>

              {/* WIDGET 3: ফেসবুকে আমরা (Facebook Page Fan Box Widget - Exact from Screenshot) */}
              <div className="bg-white border border-slate-300 shadow-sm rounded-lg overflow-hidden">
                <div className="bg-[#0275d8] text-white px-3.5 py-1.5 font-bold text-sm font-serif">
                  ফেসবুকে আমরা
                </div>
                <div className="p-2.5">
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    {/* Facebook Cover & Profile Mock */}
                    <div className="relative h-20 bg-gradient-to-r from-blue-700 to-indigo-800 p-2 text-white flex items-end">
                      <div className="flex items-center gap-2 z-10">
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-white flex items-center justify-center text-blue-700 font-black text-sm">
                          f
                        </div>
                        <div>
                          <div className="font-bold text-xs leading-tight drop-shadow truncate max-w-[150px]">
                            {activeInstitution.nameBn}
                          </div>
                          <div className="text-[10px] text-blue-100 flex items-center gap-1">
                            <ThumbsUp className="w-2.5 h-2.5" /> 14K+ Likes
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Facebook Action Button */}
                    <div className="p-2 bg-white flex items-center justify-between border-t border-slate-200 text-xs">
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded text-xs flex items-center gap-1 transition"
                      >
                        <ThumbsUp className="w-3 h-3" /> পেজ লাইক করুন
                      </a>
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline text-xs font-semibold flex items-center gap-0.5"
                      >
                        শেয়ার <Share2 className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* WIDGET 4: গুরুত্বপূর্ণ লিংক (Important Links - Matching Screenshot) */}
              <div className="bg-white border border-slate-300 shadow-sm rounded-lg overflow-hidden">
                <div className="bg-[#0275d8] text-white px-3.5 py-1.5 font-bold text-sm font-serif">
                  গুরুত্বপূর্ণ লিংক
                </div>
                <div className="p-3 divide-y divide-slate-100 text-xs">
                  <a
                    href="http://www.educationboardresults.gov.bd/"
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-1 hover:text-[#0275d8] hover:bg-sky-50 transition flex items-center gap-2 font-semibold text-slate-700"
                  >
                    <span className="text-[#0275d8]">✪</span> এস এস সি রেজাল্ট
                  </a>
                  <a
                    href="http://www.educationboardresults.gov.bd/"
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-1 hover:text-[#0275d8] hover:bg-sky-50 transition flex items-center gap-2 font-semibold text-slate-700"
                  >
                    <span className="text-[#0275d8]">✪</span> এইচ এস সি রেজাল্ট
                  </a>
                  <a
                    href="https://moedu.gov.bd/"
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-1 hover:text-[#0275d8] hover:bg-sky-50 transition flex items-center gap-2 font-semibold text-slate-700"
                  >
                    <span className="text-[#0275d8]">✪</span> শিক্ষা মন্ত্রণালয়
                  </a>
                  <a
                    href="https://dshe.gov.bd/"
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-1 hover:text-[#0275d8] hover:bg-sky-50 transition flex items-center gap-2 font-semibold text-slate-700"
                  >
                    <span className="text-[#0275d8]">✪</span> মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর (DSHE)
                  </a>
                  <a
                    href="https://dhakaeducationboard.gov.bd/"
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-1 hover:text-[#0275d8] hover:bg-sky-50 transition flex items-center gap-2 font-semibold text-slate-700"
                  >
                    <span className="text-[#0275d8]">✪</span> ঢাকা শিক্ষা বোর্ড
                  </a>
                  <a
                    href="http://nctb.gov.bd/"
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-1 hover:text-[#0275d8] hover:bg-sky-50 transition flex items-center gap-2 font-semibold text-slate-700"
                  >
                    <span className="text-[#0275d8]">✪</span> জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)
                  </a>
                  <a
                    href="https://www.teachers.gov.bd/"
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-1 hover:text-[#0275d8] hover:bg-sky-50 transition flex items-center gap-2 font-semibold text-slate-700"
                  >
                    <span className="text-[#0275d8]">✪</span> শিক্ষক বাতায়ন
                  </a>
                  <a
                    href="http://banbeis.gov.bd/"
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-1 hover:text-[#0275d8] hover:bg-sky-50 transition flex items-center gap-2 font-semibold text-slate-700"
                  >
                    <span className="text-[#0275d8]">✪</span> ব্যানবেইস (BANBEIS)
                  </a>
                </div>
              </div>

              {/* WIDGET 5: ভর্তি চলছে (Admissions Running Animated Box - Matching Screenshot) */}
              <div className="bg-white border border-slate-300 shadow-sm rounded-lg overflow-hidden">
                <div className="bg-[#0275d8] text-white px-3.5 py-1.5 font-bold text-sm font-serif">
                  ভর্তি চলছে
                </div>
                <div className="p-3 text-center space-y-2.5 bg-gradient-to-b from-amber-50 to-white">
                  <div className="w-12 h-12 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center mx-auto font-black shadow animate-pulse">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-slate-900 text-sm leading-snug">
                    ২০২৬ শিক্ষাবর্ষে ডিজিটাল পদ্ধতিতে সকল শ্রেণিতে ভর্তি আবেদন চলছে
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    আসন সংখ্যা সীমিত। অনলাইনেই আবেদন ফরম পূরণ করে আবেদন সম্পন্ন করুন।
                  </p>
                  <button
                    onClick={() => setActiveTab('admission')}
                    className="w-full bg-[#0275d8] hover:bg-[#01549b] text-white font-bold py-2 rounded text-xs shadow transition"
                  >
                    অনলাইন আবেদন করুন
                  </button>
                </div>
              </div>

              {/* WIDGET 6: জরুরি যোগাযোগ ও ঠিকানা */}
              <div className="bg-white border border-slate-300 shadow-sm rounded-lg overflow-hidden">
                <div className="bg-[#0275d8] text-white px-3.5 py-1.5 font-bold text-sm font-serif">
                  জরুরি যোগাযোগ
                </div>
                <div className="p-3 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#0275d8]" />
                    <span className="font-bold">{activeInstitution.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#0275d8]" />
                    <span>{activeInstitution.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#0275d8] shrink-0 mt-0.5" />
                    <span>{activeInstitution.address}, {activeInstitution.district}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION: ONLINE ADMISSION FORM ================= */}
        {activeTab === 'admission' && (
          <div className="bg-white rounded-lg border border-slate-300 shadow-sm max-w-3xl mx-auto overflow-hidden">
            <div className="bg-[#0275d8] text-white p-4 text-center">
              <h2 className="text-xl sm:text-2xl font-black font-serif">অনলাইন ভর্তি আবেদন ফরম ২০২৬-২০২৭</h2>
              <p className="text-xs text-sky-100 mt-1">{activeInstitution.nameBn}</p>
            </div>

            <div className="p-6">
              {admissionSuccessCode ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-6 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-900">ভর্তি আবেদন সফলভাবে সম্পন্ন হয়েছে!</h3>
                  <p className="text-xs text-emerald-700">আপনার অনলাইন আবেদন ট্র্যাকিং নম্বর:</p>
                  <div className="text-2xl font-black font-mono text-emerald-900 bg-white py-2 px-4 rounded-lg border border-emerald-300 inline-block">
                    {admissionSuccessCode}
                  </div>
                  <p className="text-xs text-slate-600">
                    অভিভাবকের মোবাইল নম্বরে পরবর্তীতে পরীক্ষার তারিখ ও প্রবেশপত্র সংক্রান্ত এসএমএস পাঠানো হবে।
                  </p>
                  <button
                    onClick={() => setAdmissionSuccessCode(null)}
                    className="bg-[#0275d8] text-white font-bold text-xs px-5 py-2.5 rounded hover:bg-[#01549b] transition"
                  >
                    আরেকটি আবেদন করুন
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAdmissionSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">শিক্ষার্থীর পূর্ণ নাম *</label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: তাহসিন আল মাহমুদ"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-[#0275d8] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">আবেদনকৃত শ্রেণি *</label>
                      <select
                        value={appliedClass}
                        onChange={(e) => setAppliedClass(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-[#0275d8] focus:outline-none"
                      >
                        {classes.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.nameBn} ({c.name})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">পিতা / মাতার নাম *</label>
                      <input
                        type="text"
                        required
                        placeholder="অভিভাবকের নাম"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-[#0275d8] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">অভিভাবকের মোবাইল নম্বর *</label>
                      <input
                        type="tel"
                        required
                        placeholder="017XXXXXXXX"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-[#0275d8] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">লিঙ্গ *</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-[#0275d8] focus:outline-none"
                      >
                        <option value="male">ছাত্র (Male)</option>
                        <option value="female">ছাত্রী (Female)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">জন্ম তারিখ *</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-[#0275d8] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পূর্ববর্তী প্রতিষ্ঠানের নাম (যদি থাকে)</label>
                    <input
                      type="text"
                      placeholder="স্কুল বা মাদ্রাসার নাম"
                      value={prevSchool}
                      onChange={(e) => setPrevSchool(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-[#0275d8] focus:outline-none"
                    />
                  </div>

                  {/* Payment Method / Admission Fee Selection */}
                  <div className="bg-slate-50 border border-slate-300 rounded-lg p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-2">
                      <label className="block font-bold text-slate-800 text-sm">
                        ভর্তি আবেদন ফি ও পেমেন্ট মেথড *
                      </label>
                      <span className="text-xs text-slate-500">
                        আপনার সুবিধাজনক মাধ্যমটি বেছে নিন
                      </span>
                    </div>

                    {/* Radio Group for Payment Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {/* Option 1: Free Application */}
                      <label
                        className={`border rounded-lg p-3 cursor-pointer transition flex items-start gap-2.5 ${
                          admissionPaymentType === 'free'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="admissionPaymentType"
                          checked={admissionPaymentType === 'free'}
                          onChange={() => setAdmissionPaymentType('free')}
                          className="mt-1 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                            <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded font-black">১০০% ফ্রি</span>
                            <span>বিনা মূল্যে আবেদন</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            কোনো ফি প্রদান করতে হবে না (আবেদন ফি ৳০)
                          </p>
                        </div>
                      </label>

                      {/* Option 2: Online MFS (bKash/Nagad/Rocket) */}
                      <label
                        className={`border rounded-lg p-3 cursor-pointer transition flex items-start gap-2.5 ${
                          admissionPaymentType === 'online'
                            ? 'border-blue-600 bg-blue-50 text-blue-950 ring-2 ring-blue-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="admissionPaymentType"
                          checked={admissionPaymentType === 'online'}
                          onChange={() => setAdmissionPaymentType('online')}
                          className="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                            <span>অনলাইন পেমেন্ট</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            বিকাশ, নগদ, রকেট বা ব্যাংক (৳৩০০)
                          </p>
                        </div>
                      </label>

                      {/* Option 3: Pay at School Office Counter */}
                      <label
                        className={`border rounded-lg p-3 cursor-pointer transition flex items-start gap-2.5 ${
                          admissionPaymentType === 'cash'
                            ? 'border-amber-600 bg-amber-50 text-amber-950 ring-2 ring-amber-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="admissionPaymentType"
                          checked={admissionPaymentType === 'cash'}
                          onChange={() => setAdmissionPaymentType('cash')}
                          className="mt-1 text-amber-600 focus:ring-amber-500"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                            <span>অফিস কাউন্টারে জমা</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            আবেদন শেষে স্কুলে এসে ফি জমা দিন
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Conditional Display: Free Note */}
                    {admissionPaymentType === 'free' && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <strong>বিনামূল্যে আবেদন সুবিধা:</strong> আপনার আবেদনপত্রের জন্য কোনো ফি প্রযোজ্য নয়। সরাসরি আবেদন সম্পন্ন করুন।
                        </div>
                      </div>
                    )}

                    {/* Conditional Display: Online MFS Details & Transaction ID */}
                    {admissionPaymentType === 'online' && (
                      <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-lg space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-200 pb-2">
                          <span className="font-bold text-blue-900 text-xs">
                            প্রতিষ্ঠানের মার্চেন্ট / পার্সোনাল নম্বর: <strong className="font-mono text-sm text-blue-950">01973-817167</strong>
                          </span>
                          <span className="bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                            নির্ধারিত ফি: ৳ ৩০০
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1 text-xs">মাধ্যম নির্বাচন করুন *</label>
                            <select
                              value={admissionPaymentMethod}
                              onChange={(e) => setAdmissionPaymentMethod(e.target.value as any)}
                              className="w-full p-2 bg-white border border-slate-300 rounded font-semibold text-xs focus:outline-none focus:border-blue-500"
                            >
                              <option value="bKash">bKash (বিকাশ)</option>
                              <option value="Nagad">Nagad (নগদ)</option>
                              <option value="Rocket">Rocket (রকেট)</option>
                              <option value="Bank">ব্যাংক ডিপোজিট</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1 text-xs">প্রেরক নম্বর (Sender No) *</label>
                            <input
                              type="text"
                              placeholder="01XXXXXXXXX"
                              value={admissionSenderPhone}
                              onChange={(e) => setAdmissionSenderPhone(e.target.value)}
                              className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-mono focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1 text-xs">TrxID (ট্রানজেকশন আইডি) *</label>
                            <input
                              type="text"
                              required={admissionPaymentType === 'online'}
                              placeholder="যেমন: BK9182374"
                              value={admissionTrxId}
                              onChange={(e) => setAdmissionTrxId(e.target.value)}
                              className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-mono uppercase font-bold focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Conditional Display: School Counter Notice */}
                    {admissionPaymentType === 'cash' && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-center gap-2">
                        <Info className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <strong>স্কুল কাউন্টারে ফি প্রদান:</strong> অনলাইন ফরম জমা দেওয়ার পর প্রদর্শিত আবেদন নম্বর নিয়ে স্কুল অফিস কাউন্টারে এসে আবেদন ফি (৳৩০০) পরিশোধ করতে পারবেন।
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0275d8] hover:bg-[#01549b] text-white font-bold py-3 rounded shadow transition text-sm flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {admissionPaymentType === 'free' ? 'বিনামূল্যে ভর্তি আবেদন সম্পন্ন করুন' : 'ভর্তি আবেদন সম্পন্ন করুন'}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ================= SECTION: RESULTS SEARCH & MARKSHEET ================= */}
        {activeTab === 'results' && (
          <div className="bg-white rounded-lg border border-slate-300 shadow-sm max-w-3xl mx-auto overflow-hidden">
            <div className="bg-[#0275d8] text-white p-4 text-center">
              <h2 className="text-xl sm:text-2xl font-black font-serif">অনলাইন ফলাফল ও গ্রেড মার্কশিট</h2>
              <p className="text-xs text-sky-100 mt-1">পরীক্ষার ফলাফল অনুসন্ধান ও সার্টিফিকেট মার্কশিট ডাউনলোড</p>
            </div>

            <div className="p-6 space-y-6">
              <form onSubmit={handleResultSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <select
                    value={searchExamId}
                    onChange={(e) => setSearchExamId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#0275d8]"
                  >
                    {exams.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.nameBn} ({ex.academicYear})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <input
                    type="text"
                    required
                    placeholder="রোল নম্বর (যেমন: 101, 102)"
                    value={searchRoll}
                    onChange={(e) => setSearchRoll(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#0275d8]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#0275d8] hover:bg-[#01549b] text-white font-bold px-6 py-2.5 rounded transition shadow text-xs sm:text-sm shrink-0 flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>ফলাফল দেখুন</span>
                </button>
              </form>

              {hasSearched && (
                searchedResult ? (
                  <div className="bg-slate-50 rounded-lg border-2 border-[#0275d8] p-5 space-y-4">
                    {/* Marksheet Header */}
                    <div className="text-center border-b border-slate-200 pb-3 space-y-1">
                      <h4 className="text-base sm:text-lg font-black text-slate-900">{activeInstitution.nameBn}</h4>
                      <p className="text-xs text-slate-600 font-semibold">{searchedResult.examName}</p>
                      <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-0.5 rounded-full mt-1">
                        স্ট্যাটাস: {searchedResult.passed ? 'উত্তীর্ণ (PASSED)' : 'অনুত্তীর্ণ'}
                      </span>
                    </div>

                    {/* Student Info */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white p-3 rounded border border-slate-200">
                      <div>
                        <span className="text-slate-400 block">নাম:</span>
                        <span className="font-bold text-slate-800">{searchedResult.studentName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">শ্রেণি:</span>
                        <span className="font-bold text-slate-800">{searchedResult.className}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">রোল:</span>
                        <span className="font-bold font-mono text-slate-800">{searchedResult.studentRoll}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">মেধা স্থান:</span>
                        <span className="font-bold text-emerald-700">{searchedResult.positionInClass}ম</span>
                      </div>
                    </div>

                    {/* Marks Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left bg-white rounded border border-slate-200">
                        <thead className="bg-[#0275d8] text-white">
                          <tr>
                            <th className="p-2">বিষয়</th>
                            <th className="p-2 text-center">প্রাপ্ত নম্বর</th>
                            <th className="p-2 text-center">লেটার গ্রেড</th>
                            <th className="p-2 text-center">গ্রেড পয়েন্ট (GP)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(searchedResult.subjects || []).map((sub, idx) => (
                            <tr key={idx}>
                              <td className="p-2 font-semibold text-slate-800">{sub.subjectName}</td>
                              <td className="p-2 text-center font-mono font-bold text-slate-900">{sub.total}</td>
                              <td className="p-2 text-center font-bold text-emerald-600">{sub.grade}</td>
                              <td className="p-2 text-center font-mono font-bold text-slate-700">{sub.gradePoint.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-sky-50 font-bold text-slate-900 border-t border-sky-200">
                          <tr>
                            <td className="p-2.5">সর্বমোট নম্বর ও জিপিএ</td>
                            <td className="p-2.5 text-center font-mono">{searchedResult.totalMarks}</td>
                            <td className="p-2.5 text-center text-[#0275d8] font-extrabold">{searchedResult.grade}</td>
                            <td className="p-2.5 text-center font-mono text-[#0275d8] text-sm font-black">
                              GPA: {searchedResult.gpa.toFixed(2)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => window.print()}
                        className="bg-[#0275d8] hover:bg-[#01549b] text-white font-bold text-xs px-4 py-2 rounded transition flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>মার্কশিট প্রিন্ট / ডাউনলোড</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center bg-slate-50 rounded border border-slate-200 text-slate-500 text-xs sm:text-sm">
                    🔍 রোল নম্বর "{searchRoll}" এর কোনো ফলাফল পাওয়া যায়নি। সঠিক রোল নম্বর প্রদান করুন।
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* ================= SECTION: ONLINE FEES PAYMENT ================= */}
        {activeTab === 'fees' && (
          <div className="bg-white rounded-lg border border-slate-300 shadow-sm max-w-2xl mx-auto overflow-hidden">
            <div className="bg-[#0275d8] text-white p-4 text-center">
              <h2 className="text-xl sm:text-2xl font-black font-serif">ডিজিটাল ফি পেমেন্ট পোর্টাল</h2>
              <p className="text-xs text-sky-100 mt-1">বিকাশ ও নগদ এর মাধ্যমে মাসিক বেতন ও পরীক্ষার ফি পরিশোধ</p>
            </div>

            <div className="p-6">
              {feePaidSuccess ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-6 text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-emerald-900">ফি সফলভাবে পরিশোধিত হয়েছে!</h3>
                  <p className="text-xs text-slate-600">ডিজিটাল রসিদ সংরক্ষিত হয়েছে।</p>
                  <button
                    onClick={() => setFeePaidSuccess(false)}
                    className="bg-[#0275d8] text-white font-bold text-xs px-4 py-2 rounded"
                  >
                    নতুন পেমেন্ট করুন
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFeePaymentSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">শিক্ষার্থীর রোল নম্বর *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: 101, 103"
                      value={feeStudentRoll}
                      onChange={(e) => setFeeStudentRoll(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-[#0275d8] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পেমেন্ট মেথড নির্বাচন করুন</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFeePaymentMethod('bKash')}
                        className={`p-3 rounded border font-bold text-xs flex items-center justify-center gap-2 transition ${
                          feePaymentMethod === 'bKash'
                            ? 'bg-pink-50 border-pink-500 text-pink-700 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>bKash (বিকাশ)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFeePaymentMethod('Nagad')}
                        className={`p-3 rounded border font-bold text-xs flex items-center justify-center gap-2 transition ${
                          feePaymentMethod === 'Nagad'
                            ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Nagad (নগদ)</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ট্রানজেকশন আইডি (TrxID) *</label>
                    <input
                      type="text"
                      placeholder="যেমন: BK88992211AA"
                      value={feeTrxId}
                      onChange={(e) => setFeeTrxId(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-[#0275d8] focus:outline-none font-mono"
                    />
                  </div>

                  <div className="bg-sky-50 p-3 rounded border border-sky-200 text-xs text-sky-900 space-y-0.5">
                    <div className="font-bold">মার্চেন্ট বিকাশ/নগদ নম্বর: ০১৮১৩৮১৭১৬৭</div>
                    <div className="text-[11px] text-sky-700">বিকাশ বা নগদ অ্যাপের 'Make Payment' অপশন ব্যবহার করুন।</div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0275d8] hover:bg-[#01549b] text-white font-bold py-3 rounded shadow transition text-sm flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>ফি পরিশোধ সম্পন্ন করুন</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ================= SECTION: TEACHERS DIRECTORY ================= */}
        {activeTab === 'teachers' && (
          <div className="bg-white rounded-lg border border-slate-300 shadow-sm p-5 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-slate-900 font-serif">সম্মানিত শিক্ষক ও কর্মচারীবৃন্দ</h2>
              <p className="text-xs text-slate-500">আমাদের অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষক মণ্ডলী</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {teachers.map((tch) => (
                <div
                  key={tch.id}
                  className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 flex items-center gap-3 hover:border-[#0275d8] transition"
                >
                  <img
                    src={tch.photo}
                    alt={tch.fullName}
                    className="w-16 h-16 rounded object-cover border border-slate-300 shrink-0"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">{tch.fullNameBn}</h4>
                    <p className="text-xs text-[#0275d8] font-semibold">{tch.designationBn}</p>
                    <p className="text-[11px] text-slate-500">{tch.qualification}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{tch.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION: MANAGING COMMITTEE ================= */}
        {activeTab === 'committee' && (
          <div className="bg-white rounded-lg border border-slate-300 shadow-sm p-5 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-slate-900 font-serif">পরিচালনা পরিষদ (Managing Committee)</h2>
              <p className="text-xs text-slate-500">প্রতিষ্ঠানের গভর্নিং বডির সম্মানিত সদস্যবৃন্দ</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-center space-y-2">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80"
                  alt="President"
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#0275d8]"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">জনাব আলহাজ্ব রফিকুল ইসলাম</h4>
                  <p className="text-xs text-[#0275d8] font-semibold">সভাপতি, গভর্নিং বডি</p>
                  <p className="text-[11px] text-slate-500 mt-1">বিশিষ্ট শিক্ষানুরাগী ও সমাজসেবক</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-center space-y-2">
                <img
                  src={activeInstitution.principalPhoto}
                  alt="Secretary"
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#0275d8]"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{activeInstitution.principalName}</h4>
                  <p className="text-xs text-[#0275d8] font-semibold">সদস্য সচিব (অধ্যক্ষ)</p>
                  <p className="text-[11px] text-slate-500 mt-1">{activeInstitution.nameBn}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-center space-y-2">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80"
                  alt="Member"
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#0275d8]"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">জনাব মশিউর রহমান</h4>
                  <p className="text-xs text-[#0275d8] font-semibold">অভিভাবক প্রতিনিধি</p>
                  <p className="text-[11px] text-slate-500 mt-1">নির্বাচিত সদস্য</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION: STUDENTS / ACHIEVERS ================= */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-lg border border-slate-300 shadow-sm p-5 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-slate-900 font-serif">কৃতি ছাত্র-ছাত্রী ও মেধা তালিকা</h2>
              <p className="text-xs text-slate-500">বোর্ড পরীক্ষায় জিপিএ-৫ ও জাতীয় পর্যায়ে পুরস্কৃত শিক্ষার্থী</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">তাহসিন আল মাহমুদ</h4>
                  <p className="text-xs text-emerald-700 font-bold">GPA 5.00 (Golden)</p>
                  <p className="text-[11px] text-slate-500">এসএসসি ২০২৫ - বিজ্ঞান বিভাগ</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">ফারিহা আক্তার</h4>
                  <p className="text-xs text-emerald-700 font-bold">GPA 5.00</p>
                  <p className="text-[11px] text-slate-500">এসএসসি ২০২৫ - বিজ্ঞান বিভাগ</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">তানভীর আহমেদ</h4>
                  <p className="text-xs text-emerald-700 font-bold">GPA 4.89</p>
                  <p className="text-[11px] text-slate-500">এসএসসি ২০২৫ - ব্যবসায় শিক্ষা</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION: PHOTO GALLERY ================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            {/* Top Interactive Carousel & Filter Slider */}
            <SchoolPhotoGallerySlider
              items={gallery}
              title="ক্যাম্পাস ফটো গ্যালারি স্লাইডার ও আর্কাইভ"
              subtitle="প্রতিষ্ঠানের অ্যাকাডেমিক ভবন, বিজ্ঞান ও কম্পিউটার ল্যাব, শ্রেণিকক্ষ ও বার্ষিক অনুষ্ঠানের স্লাইডার"
            />

            {/* Additional Grid View */}
            <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-5 space-y-4">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif">সকল আলোকচিত্র সম্ভার</h3>
                  <p className="text-xs text-slate-500">যেকোনো ছবিতে ক্লিক করে ফুলস্ক্রিন প্রিভিউ ও জুম দেখুন</p>
                </div>
                <span className="bg-sky-100 text-[#0275d8] text-xs font-bold px-3 py-1 rounded-full">
                  মোট {gallery.length}টি ফটো
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      openInfoModal(
                        item.titleBn || item.title,
                        <div className="space-y-3 text-center">
                          <img
                            src={item.url || (item as any).imageUrl}
                            alt={item.titleBn || item.title}
                            className="w-full rounded-lg max-h-[70vh] object-cover shadow"
                          />
                          <div className="text-left bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <h4 className="font-bold text-sm text-slate-800">{item.titleBn || item.title}</h4>
                            {item.description && <p className="text-xs text-slate-600 mt-1">{item.description}</p>}
                            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-200">
                              <span>অ্যালবাম: {item.album}</span>
                              <span>তারিখ: {item.date}</span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    className="group relative rounded-xl overflow-hidden border border-slate-200 cursor-pointer aspect-4/3 bg-slate-900 shadow-xs"
                  >
                    <img
                      src={item.url || (item as any).imageUrl}
                      alt={item.titleBn || item.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent flex items-end p-2.5 opacity-90 group-hover:opacity-100 transition">
                      <span className="text-white text-[11px] font-bold truncate group-hover:text-amber-300 transition-colors">
                        {item.titleBn || item.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION: ALL NOTICES ================= */}
        {activeTab === 'notices' && (
          <div className="bg-white rounded-lg border border-slate-300 shadow-sm p-5 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-slate-900 font-serif">সকল নোটিশ ও প্রজ্ঞাপন</h2>
              <p className="text-xs text-slate-500">প্রাতিষ্ঠানিক ও পরীক্ষার যাবতীয় নোটিশ তালিকা</p>
            </div>

            <div className="divide-y divide-slate-200">
              {notices.map((n) => (
                <div key={n.id} className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 transition">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {n.category}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{n.titleBn}</h4>
                    <p className="text-xs text-slate-600">{n.content}</p>
                    <p className="text-[10px] text-slate-400 font-mono">তারিখ: {n.publishDate}</p>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="bg-[#0275d8] text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" /> ডাউনলোড
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION: ABOUT US ================= */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-lg border border-slate-300 shadow-sm p-6 space-y-6 max-w-4xl mx-auto">
            <div className="border-b border-slate-200 pb-4 text-center">
              <h2 className="text-2xl font-black text-slate-900 font-serif">{activeInstitution.nameBn}</h2>
              <p className="text-xs text-slate-500 mt-1">
                স্থাপিত: {activeInstitution.establishedYear} খ্রি. | কোড: {activeInstitution.code}
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              <h3 className="font-bold text-base text-[#0275d8]">প্রতিষ্ঠানের ইতিহাস ও পটভূমি</h3>
              <p>
                {activeInstitution.nameBn} অত্র এলাকার শিক্ষা প্রসারে একটি সুপরিচিত ও ঐতিহ্যবাহী বিদ্যাপীঠ।
                {activeInstitution.establishedYear} সালে স্থানীয় শিক্ষানুরাগী ব্যক্তিত্বদের আন্তরিক প্রচেষ্টায় এটি প্রতিষ্ঠিত হয়। শুরু থেকেই নৈতিক মূল্যবোধ, শৃঙ্খলা এবং বিজ্ঞানভিত্তিক আধুনিক শিক্ষার ওপর জোর দিয়ে প্রতিষ্ঠানটি পরিচালিত হয়ে আসছে।
              </p>

              <h3 className="font-bold text-base text-[#0275d8] pt-2">লক্ষ্য ও উদ্দেশ্য</h3>
              <p>
                {activeInstitution.missionVision ||
                  'সুশিক্ষার আলো ছড়িয়ে প্রতিটি শিক্ষার্থীকে নৈতিক গুণসম্পন্ন ও আধুনিক তথ্যপ্রযুক্তিতে দক্ষ নাগরিক হিসেবে গড়ে তোলা আমাদের মূল লক্ষ্য।'}
              </p>
            </div>
          </div>
        )}

        {/* ================= SECTION: CONTACT US ================= */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-lg border border-slate-300 shadow-sm p-6 space-y-4 max-w-2xl mx-auto">
            <div className="border-b border-slate-200 pb-3 text-center">
              <h2 className="text-xl font-bold text-slate-900 font-serif">যোগাযোগ ও অবস্থান</h2>
              <p className="text-xs text-slate-500">যেকোনো তথ্যের জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন</p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded border border-slate-200">
                <MapPin className="w-5 h-5 text-[#0275d8] shrink-0" />
                <span>{activeInstitution.address}, {activeInstitution.district}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded border border-slate-200">
                <Phone className="w-5 h-5 text-[#0275d8] shrink-0" />
                <span>ফোন: {activeInstitution.phone}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded border border-slate-200">
                <Mail className="w-5 h-5 text-[#0275d8] shrink-0" />
                <span>ইমেইল: {activeInstitution.email}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. MODAL DIALOG FOR DETAILS (Principal Message, Dress code, routine, etc.) */}
      {modalContent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-300 shadow-2xl overflow-hidden animate-in fade-in my-8">
            <div className="bg-[#0275d8] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base">{modalContent.title}</h3>
              <button
                onClick={() => setModalContent(null)}
                className="text-white hover:text-amber-300 transition text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-5 max-h-[75vh] overflow-y-auto">{modalContent.content}</div>
            <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setModalContent(null)}
                className="bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs px-4 py-1.5 rounded transition"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. FOOTER (Classic Bangladeshi Education Web Portal Footer) */}
      <footer className="bg-[#004080] text-slate-200 text-xs py-6 border-t-2 border-[#002b57] mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="font-bold text-white text-sm">{activeInstitution.nameBn}</div>
            <div className="text-[11px] text-sky-200 mt-0.5">
              কপিরাইট © {new Date().getFullYear()} {activeInstitution.name} | সর্বস্বত্ব সংরক্ষিত।
            </div>
            <div className="text-[10px] text-sky-300 mt-0.5">
              কারিগরি সহায়তায়: ASCAHDO Multi-Tenant School ERP & Website Platform
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold flex-wrap justify-center">
            <button onClick={() => setActiveTab('home')} className="hover:text-amber-300">হোম</button>
            <span>•</span>
            <button onClick={() => setActiveTab('admission')} className="hover:text-amber-300">ভর্তি</button>
            <span>•</span>
            <button onClick={() => setActiveTab('results')} className="hover:text-amber-300">রেজাল্ট</button>
            <span>•</span>
            <button onClick={() => setActiveTab('teachers')} className="hover:text-amber-300">শিক্ষকবৃন্দ</button>
            <span>•</span>
            <button onClick={onOpenERP} className="text-amber-300 font-bold hover:underline">ERP ড্যাশবোর্ড</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
