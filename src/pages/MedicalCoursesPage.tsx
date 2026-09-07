import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../locales/i18nContext';
import { 
  Stethoscope, GraduationCap, ShieldCheck, Award, QrCode, 
  CheckCircle2, Search, FileText, Download, Printer, User, 
  MapPin, Phone, Calendar, Clock, CreditCard, ChevronRight,
  BookOpen, Sparkles, Building2, AlertCircle, Eye, RefreshCw,
  PlusCircle, Check, X, ArrowRight, Activity, HelpCircle,
  Upload, Camera, PenTool, CheckSquare, FileSpreadsheet, ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';
import { MedicalCourse, MedicalAdmission, MedicalStudent, MedicalCertificate } from '../types';

export const MedicalCoursesPage: React.FC = () => {
  const { isBn } = useTranslation();
  const [activeTab, setActiveTab] = useState<'courses' | 'admission' | 'verify' | 'credentials' | 'admin'>('courses');
  
  // Data states
  const [courses, setCourses] = useState<MedicalCourse[]>([]);
  const [instituteInfo, setInstituteInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<MedicalCourse | null>(null);

  // Admission state
  const [admissionForm, setAdmissionForm] = useState({
    courseId: '',
    courseCode: '',
    admissionDate: new Date().toISOString().split('T')[0],
    rollNo: '',
    session: '2025-2026',
    department: 'Diploma in Medical Assistant (DMA)',
    duration: '1 Year',
    campus: 'Noakhali & Dhaka',
    studentName: '',
    studentNameBn: '',
    studentNameEn: '',
    fatherName: '',
    fatherNameBn: '',
    fatherNameEn: '',
    motherName: '',
    motherNameBn: '',
    motherNameEn: '',
    gender: 'male' as 'male' | 'female' | 'other',
    dateOfBirth: '',
    bloodGroup: 'A+',
    nidOrBirthReg: '',
    nid: '',
    address: '',
    postOffice: '',
    city: '',
    state: '',
    upazila: '',
    district: '',
    division: 'Chittagong',
    presentAddress: '',
    permanentAddress: '',
    phone: '',
    mobile: '',
    guardianPhone: '',
    email: '',
    examName: 'SSC/Dakhil',
    academicQualification: 'SSC',
    sscRoll: '',
    sscReg: '',
    gpa: '4.50',
    gpaOrGrade: '4.50',
    passingYear: '2024',
    board: 'Cumilla',
    boardOrInstitute: 'Cumilla',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
    nidDocUrl: '',
    certificateDocUrl: '',
    studentSignatureUrl: '',
    guardianSignatureUrl: '',
    paymentMethod: 'bkash',
    paymentSenderNo: '',
    paymentTrxId: '',
    paymentSlipUrl: '',
    paymentAmount: 5000,
    termsAccepted: true,
    declarationDate: new Date().toISOString().split('T')[0]
  });
  const [submittedAdmission, setSubmittedAdmission] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File Upload Handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAdmissionForm(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStudentSigUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAdmissionForm(prev => ({ ...prev, studentSignatureUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGuardianSigUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAdmissionForm(prev => ({ ...prev, guardianSignatureUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNidDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAdmissionForm(prev => ({ ...prev, nidDocUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCertDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAdmissionForm(prev => ({ ...prev, certificateDocUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAdmissionForm(prev => ({ ...prev, paymentSlipUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Verification state
  const [verifyQuery, setVerifyQuery] = useState('');
  const [verifyResult, setVerifyResult] = useState<any | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  // Credentials Portal State
  const [credQuery, setCredQuery] = useState('1024');
  const [credType, setCredType] = useState<'idcard' | 'admitcard' | 'regcard'>('idcard');
  const [credData, setCredData] = useState<any | null>(null);
  const [credLoading, setCredLoading] = useState(false);
  const [credError, setCredError] = useState('');

  // Admin states
  const [admissionsList, setAdmissionsList] = useState<any[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [certificatesList, setCertificatesList] = useState<any[]>([]);
  const [adminActionLoading, setAdminActionLoading] = useState(false);
  const [showIssueCertModal, setShowIssueCertModal] = useState(false);
  const [newCertForm, setNewCertForm] = useState({
    rollNumber: '',
    registrationNumber: '',
    studentName: '',
    studentNameBn: '',
    fatherNameBn: '',
    motherNameBn: '',
    courseTitleBn: 'DMA (ডিপ্লোমা ইন মেডিকেল অ্যাসিস্ট্যান্ট)',
    durationBn: '১ বৎসর',
    session: 'জুন - মে (২০২৫-২০২৬)',
    examYear: '2026',
    grade: 'A+',
    gpa: '3.95',
    remarks: 'Passed with Distinction in Clinical Practical Examination'
  });

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [infoRes, coursesRes] = await Promise.all([
        api.getMedicalInstituteInfo(),
        api.getMedicalCourses()
      ]);
      setInstituteInfo(infoRes);
      setCourses(coursesRes);
      if (coursesRes && coursesRes.length > 0) {
        setAdmissionForm(prev => ({
          ...prev,
          courseId: coursesRes[0].id,
          courseCode: coursesRes[0].code,
          paymentAmount: coursesRes[0].admissionFee || 5000
        }));
      }
    } catch (err) {
      console.error("Failed to load medical data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchAdminData = async () => {
    setAdminActionLoading(true);
    try {
      const [adms, stds, certs] = await Promise.all([
        api.getMedicalAdmissions(),
        api.getMedicalStudents(),
        api.getMedicalCertificates()
      ]);
      setAdmissionsList(adms);
      setStudentsList(stds);
      setCertificatesList(certs);
    } catch (err) {
      console.error(err);
    } finally {
      setAdminActionLoading(false);
    }
  };

  const handleCourseSelectForAdmission = (course: MedicalCourse) => {
    setAdmissionForm(prev => ({
      ...prev,
      courseId: course.id,
      courseCode: course.code,
      paymentAmount: course.admissionFee || 5000
    }));
    setActiveTab('admission');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleAdmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = admissionForm.studentNameEn || admissionForm.studentName || admissionForm.studentNameBn;
    const finalPhone = admissionForm.phone || admissionForm.mobile;
    if (!finalName || !finalPhone) {
      alert(isBn ? 'দয়া করে শিক্ষার্থীর নাম (ইংরেজি বা বাংলায়) এবং মোবাইল নম্বর প্রদান করুন।' : 'Please enter student name and phone number.');
      return;
    }
    if (!admissionForm.termsAccepted) {
      alert(isBn ? 'ভর্তির নিয়ম ও শর্তাবলীতে সম্মতি প্রদান করা বাধ্যতামূলক।' : 'You must accept the admission terms and conditions.');
      return;
    }
    if (!admissionForm.paymentTrxId) {
      alert(isBn ? 'দয়া করে ফি প্রদানের TrxID বা রশিদ নম্বর লিখুন।' : 'Please provide payment Transaction ID (TrxID).');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        ...admissionForm,
        studentName: finalName,
        phone: finalPhone,
        mobile: finalPhone
      };
      const res = await api.submitMedicalAdmission(payload);
      setSubmittedAdmission(res.admission);
    } catch (err) {
      console.error(err);
      alert('Failed to submit admission application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!verifyQuery.trim()) return;
    setVerifyLoading(true);
    setVerifyError('');
    setVerifyResult(null);
    try {
      const res = await api.verifyMedicalRecord(verifyQuery);
      setVerifyResult(res);
    } catch (err: any) {
      setVerifyError(isBn ? 'কোনো রেকর্ড খুঁজে পাওয়া যায়নি। রোল, রেজিস্ট্রেশন বা সার্টিফিকেট নম্বর সঠিকভাবে লিখুন।' : 'No verified record found.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleFetchCredentials = async (type: 'idcard' | 'admitcard' | 'regcard', q: string) => {
    setCredLoading(true);
    setCredError('');
    setCredData(null);
    setCredType(type);
    try {
      let res;
      if (type === 'idcard') res = await api.getMedicalIdCard(q);
      else if (type === 'admitcard') res = await api.getMedicalAdmitCard(q);
      else if (type === 'regcard') res = await api.getMedicalRegCard(q);
      setCredData(res);
    } catch (err) {
      setCredError(isBn ? 'শিক্ষার্থীর তথ্য পাওয়া যায়নি। সঠিক রোল (যেমন: 1024, 1025) বা রেজিস্ট্রেশন নম্বর দিয়ে চেষ্টা করুন।' : 'Student record not found. Try Roll: 1024 or 1025.');
    } finally {
      setCredLoading(false);
    }
  };

  const handleApproveAdmission = async (admId: string) => {
    try {
      await api.updateMedicalAdmissionStatus(admId, { status: 'approved' });
      alert(isBn ? 'ভর্তি সফলভাবে অনুমোদন করা হয়েছে এবং শিক্ষার্থী প্রোফাইল ও রোল নম্বর জেনারেট হয়েছে।' : 'Admission approved!');
      handleFetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Official Accreditation Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-emerald-800/40">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Stethoscope className="w-80 h-80 text-emerald-300" />
        </div>

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {isBn ? 'বাংলাদেশ সরকার ও স্বাস্থ্য অধিদপ্তর অনুমোদিত' : 'DGHS & Bangladesh Gov. Approved'}
            </span>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full">
              {isBn ? 'রেজিঃ নং- ঢাকা S-৩১৪৪ (১০৯) ২০০৩' : 'Reg: Dhaka S-3144(109) 2003'}
            </span>
            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold px-3 py-1 rounded-full">
              {isBn ? 'জুন - মে সেশনে ভর্তি চলছে' : 'June-May Session Open'}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              {isBn ? 'কোম্পানীগঞ্জ প্যারামেডিকেল ইনস্টিটিউট' : 'Companiganj Paramedical Institute'}
            </h1>
            <p className="text-emerald-300 font-bold text-sm sm:text-base">
              {isBn 
                ? 'সিএমএসএস ইনস্টিটিউট অব মেডিকেল টেকনোলজি এর একটি বিশ্বস্ত অনুমোদিত শাখা' 
                : 'Branch of CMSS Institute of Medical Technology'}
            </p>
            <p className="text-emerald-100/90 text-xs sm:text-sm max-w-3xl leading-relaxed pt-1">
              {isBn
                ? 'নোয়াখালী জেনারেল হাসপাতালে ইন্টার্নি ও স্বনামধন্য বেসরকারি হাসপাতালগুলোতে ক্লিনিক্যাল প্র্যাকটিসের সুবর্ণ সুযোগ। অভিজ্ঞ এমবিবিএস ডাক্তার ও নার্সিং প্রভাষকদের তত্ত্বাবধানে আধুনিক প্যারামেডিকেল ও ডিপ্লোমা কোর্স।'
                : 'Hands-on clinical internship at Noakhali General Hospital with modern healthcare curriculum recognized nationwide.'}
            </p>
          </div>

          {/* Key Accreditation Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10 text-xs space-y-1">
              <p className="text-emerald-300 font-semibold">{isBn ? 'সরকারি অনুমোদন' : 'Accreditation'}</p>
              <p className="font-bold text-white text-[13px]">{isBn ? 'স্বাস্থ্য অধিদপ্তর (DGHS)' : 'DGHS Approved'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10 text-xs space-y-1">
              <p className="text-emerald-300 font-semibold">{isBn ? 'ইন্টার্নশিপ সুবিধা' : 'Hospital Internship'}</p>
              <p className="font-bold text-white text-[13px]">{isBn ? 'নোয়াখালী জেনারেল হাসপাতাল' : 'Noakhali Gen. Hospital'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10 text-xs space-y-1">
              <p className="text-emerald-300 font-semibold">{isBn ? 'পরীক্ষা কেন্দ্র' : 'Exam Center'}</p>
              <p className="font-bold text-white text-[13px]">{isBn ? 'নোয়াখালী কেন্দ্র (NH-702)' : 'Center Code NH-702'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10 text-xs space-y-1">
              <p className="text-emerald-300 font-semibold">{isBn ? 'জরুরি হেল্পলাইন' : 'Helpline'}</p>
              <p className="font-bold text-white text-[13px]">01973-817167</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'courses'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>{isBn ? 'সকল মেডিকেল কোর্স সমূহ' : 'All Medical Courses'}</span>
        </button>

        <button
          onClick={() => setActiveTab('admission')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'admission'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{isBn ? 'অনলাইন ভর্তি ফরম' : 'Online Admission'}</span>
          <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-md">LIVE</span>
        </button>

        <button
          onClick={() => setActiveTab('verify')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'verify'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>{isBn ? 'ডিজিটাল সার্টিফিকেট যাচাই' : 'Certificate Verification'}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('credentials');
            handleFetchCredentials('idcard', credQuery);
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'credentials'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{isBn ? 'আইডি কার্ড ও এডমিট পোর্টাল' : 'ID / Admit Card Portal'}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('admin');
            handleFetchAdminData();
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black ml-auto transition-all ${
            activeTab === 'admin'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-500" />
          <span>{isBn ? 'ইনস্টিটিউট কন্ট্রোল প্যানেল' : 'Admin Management'}</span>
        </button>
      </div>

      {/* ==========================================
          TAB 1: MEDICAL COURSES SHOWCASE
      ========================================== */}
      {activeTab === 'courses' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Institute Highlights Box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-emerald-900 font-black text-sm mb-3">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>{isBn ? 'ইনস্টিটিউটের বিশেষ বৈশিষ্ট্য ও সুবিধাসমূহ:' : 'Special Features & Hospital Training:'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-emerald-950 font-medium">
              <div className="flex items-start gap-2 bg-white/80 p-3 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>মনোরম ও নিরিবিলি পরিবেশ সকলের জন্য বিশেষভাবে আকর্ষণীয়।</span>
              </div>
              <div className="flex items-start gap-2 bg-white/80 p-3 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>নোয়াখালী জেনারেল হাসপাতালে ইন্টার্নি করার সুবর্ণ সুযোগ।</span>
              </div>
              <div className="flex items-start gap-2 bg-white/80 p-3 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>স্বনামধন্য বেসরকারি হাসপাতালগুলোতে ক্লিনিক্যাল প্র্যাকটিসের সুযোগ।</span>
              </div>
              <div className="flex items-start gap-2 bg-white/80 p-3 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>সেমিস্টার পদ্ধতিতে পরীক্ষা (বছরে ২টি সেমিস্টারে সার্বিক মূল্যায়ন)।</span>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Image & Badge */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={course.imageUrl}
                      alt={course.titleBn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
                        {course.code}
                      </span>
                      {course.badgeBn && (
                        <span className="bg-amber-500 text-slate-950 font-black text-[11px] px-2.5 py-0.5 rounded-full shadow-md">
                          {course.badgeBn}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-md inline-block mb-1">
                        {course.durationBn}
                      </span>
                      <h3 className="font-black text-base leading-tight drop-shadow-sm">
                        {course.titleBn}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4 text-xs">
                    <p className="text-slate-600 line-clamp-2 leading-relaxed">
                      {course.descriptionBn}
                    </p>

                    <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div className="flex justify-between items-center text-slate-700">
                        <span className="text-slate-500 font-medium">ভর্তির যোগ্যতা:</span>
                        <span className="font-bold text-slate-900">{course.eligibilityBn}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-700">
                        <span className="text-slate-500 font-medium">কোর্স মেয়াদ:</span>
                        <span className="font-bold text-emerald-700">{course.durationBn}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-700">
                        <span className="text-slate-500 font-medium">ভর্তি ফি:</span>
                        <span className="font-bold text-slate-900">৳{(course?.admissionFee || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-700">
                        <span className="text-slate-500 font-medium">মোট কোর্স ফি:</span>
                        <span className="font-black text-emerald-800 text-sm">৳{(course?.totalFee || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Key Subjects preview */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">প্রধান বিষয়সমূহ:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(course?.subjects || []).slice(0, 3).map((sub, idx) => (
                          <span key={idx} className="bg-emerald-50 text-emerald-800 text-[11px] font-medium px-2 py-0.5 rounded-md border border-emerald-100">
                            {sub.split('(')[0]}
                          </span>
                        ))}
                        {(course?.subjects?.length || 0) > 3 && (
                          <span className="text-[10px] text-slate-400 font-bold self-center">
                            +{(course?.subjects?.length || 0) - 3} আরও
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>বিস্তারিত দেখুন</span>
                  </button>
                  <button
                    onClick={() => handleCourseSelectForAdmission(course)}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>ভর্তি আবেদন</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Contact & Admission Notice */}
          <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-black px-3 py-1 rounded-full uppercase">
                সরাসরি অফিসে যোগাযোগ
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                ভর্তি তথ্য ও ফর্ম সংক্রান্ত কোনো প্রশ্ন আছে?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                ঠিকানা: রৌশন আরা মার্কেট, বসুরহাট, কোম্পানীগঞ্জ, নোয়াখালী।<br />
                বিকাশ/হোয়াটসঅ্যাপ হেল্পলাইন: <span className="font-bold text-amber-300">01973-817167</span>, <span className="font-bold text-amber-300">01813-817167</span>
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => setActiveTab('admission')}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-lg transition"
              >
                অনলাইনে আবেদন করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          COURSE DETAILS MODAL
      ========================================== */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-md">
                  কোর্স কোড: {selectedCourse.code}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  {selectedCourse.titleBn}
                </h2>
                <p className="text-xs text-slate-500">{selectedCourse.title}</p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl">
                <div>
                  <span className="text-slate-400">মেয়াদ:</span>
                  <p className="font-bold text-slate-800 text-sm">{selectedCourse.durationBn}</p>
                </div>
                <div>
                  <span className="text-slate-400">যোগ্যতা:</span>
                  <p className="font-bold text-slate-800 text-sm">{selectedCourse.eligibilityBn}</p>
                </div>
                <div>
                  <span className="text-slate-400">ভর্তি ফি:</span>
                  <p className="font-bold text-emerald-700 text-sm">৳{(selectedCourse?.admissionFee || 0).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-slate-400">মোট কোর্স ফি:</span>
                  <p className="font-bold text-emerald-800 text-sm">৳{(selectedCourse?.totalFee || 0).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h4 className="font-black text-slate-900 text-sm mb-2">কোর্সের বিবরণ:</h4>
                <p className="text-slate-700 leading-relaxed bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                  {selectedCourse.descriptionBn}
                </p>
              </div>

              <div>
                <h4 className="font-black text-slate-900 text-sm mb-2">কারিকুলাম ও বিষয়ভিত্তিক সিলেবাস:</h4>
                <div className="space-y-1.5">
                  {(selectedCourse?.subjects || []).map((sub, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="font-bold text-slate-800">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-black text-slate-900 text-sm mb-2">বিশেষ সুবিধা ও প্রশিক্ষণ:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(selectedCourse?.features || []).map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 bg-emerald-50/60 p-2.5 rounded-xl text-emerald-950">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setSelectedCourse(null)}
                className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-2xl text-xs transition"
              >
                বন্ধ করুন
              </button>
              <button
                onClick={() => {
                  const c = selectedCourse;
                  setSelectedCourse(null);
                  handleCourseSelectForAdmission(c);
                }}
                className="w-2/3 bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition"
              >
                <FileText className="w-4 h-4" />
                <span>এই কোর্সে অনলাইনে ভর্তি হন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 2: ONLINE ADMISSION FORM & SLIP
      ========================================== */}
      {activeTab === 'admission' && (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
          
          {submittedAdmission ? (
            /* Successful Submission Slip */
            <div className="bg-white rounded-3xl border-2 border-emerald-500 p-6 sm:p-10 shadow-2xl space-y-6">
              <div className="text-center space-y-2 border-b border-slate-100 pb-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full">
                  ভর্তি আবেদন সফলভাবে গৃহীত হয়েছে
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  CMSS Institute of Medical Technology
                </h2>
                <p className="text-xs text-slate-500 font-medium">কেন্দ্রীয় মেডিকেল অ্যান্ড হেলথ টেকনোলজি ইনস্টিটিউট — নোয়াখালী ও ঢাকা</p>
                <p className="text-sm font-mono font-black text-emerald-700 bg-emerald-50 inline-block px-4 py-1.5 rounded-xl border border-emerald-200">
                  ট্র্যাকিং আইডি: {submittedAdmission.trackingNumber || submittedAdmission.id}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Photo & Basic */}
                <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 border border-slate-200">
                  <div className="w-28 h-36 bg-slate-200 border-2 border-emerald-600 rounded-xl overflow-hidden shadow-xs flex items-center justify-center">
                    {submittedAdmission.photoUrl ? (
                      <img src={submittedAdmission.photoUrl} alt="Student" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{submittedAdmission.studentNameBn || submittedAdmission.studentName}</h4>
                    <p className="text-slate-500 font-mono text-[11px]">{submittedAdmission.studentNameEn || submittedAdmission.studentName}</p>
                    <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                      রক্তের গ্রুপ: {submittedAdmission.bloodGroup || 'A+'}
                    </span>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-200">
                  <h4 className="font-bold text-slate-900 border-b pb-1 text-xs">ব্যক্তিগত ও ঠিকানা বিবরণ</h4>
                  <p><span className="text-slate-400">পিতার নাম:</span> <strong className="text-slate-800">{submittedAdmission.fatherNameBn || submittedAdmission.fatherName}</strong></p>
                  <p><span className="text-slate-400">মাতার নাম:</span> <strong className="text-slate-800">{submittedAdmission.motherNameBn || submittedAdmission.motherName}</strong></p>
                  <p><span className="text-slate-400">মোবাইল:</span> <strong className="text-slate-900 font-mono">{submittedAdmission.phone || submittedAdmission.mobile}</strong></p>
                  <p><span className="text-slate-400">অভিভাবক মোবাইল:</span> <strong className="text-slate-800 font-mono">{submittedAdmission.guardianPhone || 'N/A'}</strong></p>
                  <p><span className="text-slate-400">NID / জন্ম নিবন্ধন:</span> <strong className="text-slate-800 font-mono">{submittedAdmission.nidOrBirthReg || submittedAdmission.nid || 'N/A'}</strong></p>
                  <p><span className="text-slate-400">ঠিকানা:</span> <strong className="text-slate-800">{submittedAdmission.presentAddress || submittedAdmission.address}</strong></p>
                </div>

                {/* Course & Payment */}
                <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-200">
                  <h4 className="font-bold text-slate-900 border-b pb-1 text-xs">কোর্স ও পেমেন্ট বিবরণ</h4>
                  <p><span className="text-slate-400">আবেদনকৃত কোর্স:</span> <strong className="text-emerald-900 font-bold block">{submittedAdmission.courseTitleBn || submittedAdmission.department}</strong></p>
                  <p><span className="text-slate-400">কোর্স কোড:</span> <strong className="text-slate-800 font-mono">{submittedAdmission.courseCode || 'DMA-01'}</strong></p>
                  <p><span className="text-slate-400">পেমেন্ট মাধ্যম:</span> <strong className="text-slate-800 uppercase">{submittedAdmission.paymentMethod}</strong></p>
                  <p><span className="text-slate-400">TrxID:</span> <strong className="text-emerald-800 font-mono font-bold">{submittedAdmission.paymentTrxId}</strong></p>
                  <p><span className="text-slate-400">প্রদত্ত ভর্তি ফি:</span> <strong className="text-emerald-700 font-black text-sm">৳{submittedAdmission.paymentAmount}</strong></p>
                  <p><span className="text-slate-400">আবেদনের তারিখ:</span> <strong className="text-slate-800">{submittedAdmission.admissionDate || new Date().toLocaleDateString('bn-BD')}</strong></p>
                </div>
              </div>

              {/* Signatures & Office Seal Row in Slip */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                  <div className="h-12 flex items-center justify-center">
                    {submittedAdmission.studentSignatureUrl ? (
                      <img src={submittedAdmission.studentSignatureUrl} alt="Signature" className="max-h-10 max-w-full object-contain" />
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">স্বাক্ষর আপলোডকৃত</span>
                    )}
                  </div>
                  <div className="border-t border-slate-300 pt-1 text-[11px] font-bold text-slate-700">শিক্ষার্থীর ডিজিটাল স্বাক্ষর</div>
                </div>
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                  <div className="h-12 flex items-center justify-center">
                    {submittedAdmission.guardianSignatureUrl ? (
                      <img src={submittedAdmission.guardianSignatureUrl} alt="Guardian Signature" className="max-h-10 max-w-full object-contain" />
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">স্বাক্ষর আপলোডকৃত</span>
                    )}
                  </div>
                  <div className="border-t border-slate-300 pt-1 text-[11px] font-bold text-slate-700">অভিভাবকের ডিজিটাল স্বাক্ষর</div>
                </div>
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                  <div className="h-12 flex items-center justify-center">
                    <span className="text-slate-300 text-2xl font-serif">Verified</span>
                  </div>
                  <div className="border-t border-slate-300 pt-1 text-[11px] font-bold text-slate-700">ভর্তি শাখা / অফিসার</div>
                </div>
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                  <div className="h-12 flex items-center justify-center">
                    <span className="text-emerald-700 font-black text-xs">SEAL APPROVED</span>
                  </div>
                  <div className="border-t border-slate-300 pt-1 text-[11px] font-bold text-slate-700">অধ্যক্ষ / পরিচালক</div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  গুরুত্বপূর্ণ নির্দেশনা:
                </p>
                <p>
                  আপনার আবেদনটি সফলভাবে সিস্টেমে নিবন্ধিত হয়েছে। অনুমোদনের পর আপনি আপনার রোল নম্বর ব্যবহার করে আইডি কার্ড ও রেজিস্ট্রেশন কার্ড ডাউনলোড করতে পারবেন। কোনো প্রয়োজনে হেল্পলাইন <strong className="text-amber-950 font-bold">01973-817167</strong> এ ট্র্যাকিং আইডিটি উল্লেখ করুন।
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>ভর্তি আবেদন ও মানি রিসিট প্রিন্ট করুন</span>
                </button>
                <button
                  onClick={() => setSubmittedAdmission(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3.5 rounded-2xl text-xs transition"
                >
                  নতুন আবেদন ফরম
                </button>
              </div>
            </div>
          ) : (
            /* =========================================================
               MAIN REGISTRATION FORM (MATCHING REQUESTED DESIGN)
            ========================================================= */
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-xs">
              
              {/* Form Header */}
              <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Institute Title & Badges */}
                  <div className="space-y-2 text-center md:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <span className="bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-full text-[11px] border border-emerald-400/30">
                        গভ. রেজি: ১২৩৪৫/হেলথ
                      </span>
                      <span className="bg-white/10 text-white font-bold px-3 py-1 rounded-full text-[11px]">
                        ক্যাম্পাস: নোয়াখালী ও ঢাকা
                      </span>
                      <span className="bg-amber-400 text-amber-950 font-black px-3 py-1 rounded-full text-[11px]">
                        সেশন: ২০২৫-২০২৬
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                      CMSS Institute of Medical Technology
                    </h2>
                    <p className="text-xs text-emerald-200 font-medium">
                      কেন্দ্রীয় মেডিকেল অ্যান্ড হেলথ টেকনোলজি ইনস্টিটিউট • বাংলাদেশ কারিগরি ও প্যারামেডিকেল অনুমোদিত
                    </p>
                    <div className="pt-2">
                      <span className="inline-block bg-white text-slate-900 font-black px-4 py-1.5 rounded-xl shadow-xs text-xs uppercase tracking-wider">
                        Online Admission & Registration Form / অনলাইন ভর্তি ফরম
                      </span>
                    </div>
                  </div>

                  {/* Student Passport Photo Box (140x170 px) */}
                  <div className="shrink-0 flex flex-col items-center space-y-2 bg-white/10 p-3.5 rounded-2xl border border-white/20 backdrop-blur-xs">
                    <div className="w-[140px] h-[170px] bg-slate-100 border-2 border-dashed border-emerald-400 rounded-xl overflow-hidden flex flex-col items-center justify-center text-center relative group">
                      {admissionForm.photoUrl ? (
                        <img
                          src={admissionForm.photoUrl}
                          alt="Student Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="p-3 text-slate-500 space-y-1">
                          <Camera className="w-8 h-8 mx-auto text-emerald-600" />
                          <p className="text-[10px] font-bold">পাসপোর্ট সাইজ ছবি</p>
                          <p className="text-[9px] text-slate-400">140 × 170 px</p>
                        </div>
                      )}
                      {/* Hover Overlay */}
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition p-2 text-center text-[10px] font-bold">
                        <Upload className="w-5 h-5 mb-1" />
                        <span>ছবি পরিবর্তন করুন</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <label className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] cursor-pointer flex items-center gap-1.5 transition shadow-xs">
                      <Camera className="w-3.5 h-3.5" />
                      <span>ছবি আপলোড করুন</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleAdmissionSubmit} className="p-6 sm:p-8 space-y-8">
                
                {/* -------------------------------------------------------------
                    CARD 1: OFFICIAL INFORMATION (অফিসিয়াল তথ্য)
                ------------------------------------------------------------- */}
                <div className="border border-blue-200 rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-4 py-2.5 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>১. অফিসিয়াল তথ্য (Official Information)</span>
                    </span>
                    <span className="text-[10px] font-normal bg-white/20 px-2 py-0.5 rounded">Institute Data</span>
                  </div>
                  <div className="p-4 sm:p-5 bg-blue-50/20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">ভর্তির তারিখ (Date of Admission)</label>
                      <input
                        type="date"
                        value={admissionForm.admissionDate}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, admissionDate: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">রোল নং (Roll No - অফিস কর্তৃক পূরণযোগ্য)</label>
                      <input
                        type="text"
                        placeholder="অফিস পূরণ করবে (Auto)"
                        value={admissionForm.rollNo}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, rollNo: e.target.value })}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">শিক্ষাবর্ষ / সেশন (Session)</label>
                      <select
                        value={admissionForm.session}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, session: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="2025-2026">২০২৫-২০২৬ (জুন-মে)</option>
                        <option value="2024-2025">২০২৪-২০২৫ (ডিসেম্বর-নভেম্বর)</option>
                        <option value="2026-2027">২০২৬-২০২৭ (আগাম ভর্তি)</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">
                        টেকনোলজি / বিভাগ (Technology / Department) <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={admissionForm.courseId}
                        onChange={(e) => {
                          const c = courses.find(item => item.id === e.target.value);
                          if (c) {
                            setAdmissionForm(prev => ({
                              ...prev,
                              courseId: c.id,
                              courseCode: c.code,
                              department: c.titleBn,
                              paymentAmount: c.admissionFee || 5000
                            }));
                          }
                        }}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.titleBn} ({c.titleEn}) — মেয়াদ: {c.durationBn} — ভর্তি ফি: ৳{c.admissionFee}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">কোর্সের মেয়াদ (Duration)</label>
                      <input
                        type="text"
                        readOnly
                        value={courses.find(c => c.id === admissionForm.courseId)?.durationBn || '১ বৎসর'}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    CARD 2: PERSONAL INFORMATION (ব্যক্তিগত ও পারিবারিক তথ্য)
                ------------------------------------------------------------- */}
                <div className="border border-purple-200 rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white px-4 py-2.5 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>২. ব্যক্তিগত ও পারিবারিক তথ্য (Personal & Family Information)</span>
                    </span>
                    <span className="text-[10px] font-normal bg-white/20 px-2 py-0.5 rounded">Student Info</span>
                  </div>
                  <div className="p-4 sm:p-5 bg-purple-50/20 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          শিক্ষার্থীর নাম (বাংলায়) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="মো. তরিকুল ইসলাম"
                          value={admissionForm.studentNameBn}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, studentNameBn: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Name (English Block Letters) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="MD. TARIKUL ISLAM"
                          value={admissionForm.studentNameEn}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, studentNameEn: e.target.value.toUpperCase(), studentName: e.target.value.toUpperCase() })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none uppercase font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          পিতা / স্বামীর নাম (বাংলায়) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="মো. সিরাজুল ইসলাম"
                          value={admissionForm.fatherNameBn}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, fatherNameBn: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Father's / Husband's Name (English)
                        </label>
                        <input
                          type="text"
                          placeholder="MD. SIRAJUL ISLAM"
                          value={admissionForm.fatherNameEn}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, fatherNameEn: e.target.value, fatherName: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none uppercase"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          মাতার নাম (বাংলায়) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="ফাতেমা বেগম"
                          value={admissionForm.motherNameBn}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, motherNameBn: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Mother's Name (English)
                        </label>
                        <input
                          type="text"
                          placeholder="FATEMA BEGUM"
                          value={admissionForm.motherNameEn}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, motherNameEn: e.target.value, motherName: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none uppercase"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">লিঙ্গ (Gender) <span className="text-rose-500">*</span></label>
                        <select
                          value={admissionForm.gender}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, gender: e.target.value as any })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        >
                          <option value="male">পুরুষ (Male)</option>
                          <option value="female">মহিলা (Female)</option>
                          <option value="other">অন্যান্য (Other)</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">জন্ম তারিখ (Date of Birth) <span className="text-rose-500">*</span></label>
                        <input
                          type="date"
                          required
                          value={admissionForm.dateOfBirth}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, dateOfBirth: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">রক্তের গ্রুপ (Blood Group) <span className="text-rose-500">*</span></label>
                        <select
                          value={admissionForm.bloodGroup}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, bloodGroup: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold text-emerald-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
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
                    </div>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    CARD 3: ADDRESS & CONTACT (ঠিকানা ও যোগাযোগ)
                ------------------------------------------------------------- */}
                <div className="border border-purple-200 rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white px-4 py-2.5 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>৩. ঠিকানা ও যোগাযোগ (Address & Contact Details)</span>
                    </span>
                    <span className="text-[10px] font-normal bg-white/20 px-2 py-0.5 rounded">Contact</span>
                  </div>
                  <div className="p-4 sm:p-5 bg-purple-50/20 space-y-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        পূর্ণাঙ্গ ঠিকানা (গ্রাম / রোড / বাড়ি নং) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="গ্রাম: চরকাঁকড়া, ওয়ার্ড নং-৩, বসুরহাট পৌরসভা"
                        value={admissionForm.address || admissionForm.presentAddress}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, address: e.target.value, presentAddress: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">ডাকঘর (Post Office)</label>
                        <input
                          type="text"
                          placeholder="বসুরহাট"
                          value={admissionForm.postOffice}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, postOffice: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">থানা / উপজেলা (Upazila / City)</label>
                        <input
                          type="text"
                          placeholder="কোম্পানীগঞ্জ"
                          value={admissionForm.upazila || admissionForm.city}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, upazila: e.target.value, city: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">জেলা (District / State)</label>
                        <input
                          type="text"
                          placeholder="নোয়াখালী"
                          value={admissionForm.district || admissionForm.state}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, district: e.target.value, state: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">বিভাগ (Division)</label>
                        <select
                          value={admissionForm.division}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, division: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        >
                          <option value="Chittagong">চট্টগ্রাম (Chittagong)</option>
                          <option value="Dhaka">ঢাকা (Dhaka)</option>
                          <option value="Rajshahi">রাজশাহী (Rajshahi)</option>
                          <option value="Khulna">খুলনা (Khulna)</option>
                          <option value="Barisal">বরিশাল (Barisal)</option>
                          <option value="Sylhet">সিলেট (Sylhet)</option>
                          <option value="Rangpur">রংপুর (Rangpur)</option>
                          <option value="Mymensingh">ময়মনসিংহ (Mymensingh)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          শিক্ষার্থীর মোবাইল (হোয়াটসঅ্যাপ) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="017XXXXXXXX"
                          value={admissionForm.mobile || admissionForm.phone}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, mobile: e.target.value, phone: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          অভিভাবকের মোবাইল <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="018XXXXXXXX"
                          value={admissionForm.guardianPhone}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, guardianPhone: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          NID / জন্ম নিবন্ধন নং <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="জাতীয় পরিচয়পত্র নং"
                          value={admissionForm.nid || admissionForm.nidOrBirthReg}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, nid: e.target.value, nidOrBirthReg: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">ইমেইল ঠিকানা (Email)</label>
                        <input
                          type="email"
                          placeholder="student@example.com"
                          value={admissionForm.email}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, email: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    CARD 4: ACADEMIC DETAILS (শিক্ষাগত যোগ্যতা)
                ------------------------------------------------------------- */}
                <div className="border border-blue-200 rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-4 py-2.5 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>৪. শিক্ষাগত যোগ্যতা (Academic Qualifications)</span>
                    </span>
                    <span className="text-[10px] font-normal bg-white/20 px-2 py-0.5 rounded">SSC / Equivalent</span>
                  </div>
                  <div className="p-4 sm:p-5 bg-blue-50/20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">পরীক্ষার নাম (Exam)</label>
                      <select
                        value={admissionForm.examName}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, examName: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="SSC/Dakhil">SSC / দাখিল</option>
                        <option value="HSC/Alim">HSC / আলিম</option>
                        <option value="Diploma">ডিপ্লোমা (Diploma)</option>
                        <option value="Degree/BSc">ডিগ্রি / বিএসসি</option>
                        <option value="Other">অন্যান্য (Other)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">রোল নং (Roll No)</label>
                      <input
                        type="text"
                        placeholder="যেমন: 452109"
                        value={admissionForm.sscRoll}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, sscRoll: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">রেজিস্ট্রেশন নং (Reg No)</label>
                      <input
                        type="text"
                        placeholder="যেমন: 1814729014"
                        value={admissionForm.sscReg}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, sscReg: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">জিপিএ / গ্রেড (GPA)</label>
                      <input
                        type="text"
                        placeholder="4.50 / A"
                        value={admissionForm.gpa || admissionForm.gpaOrGrade}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, gpa: e.target.value, gpaOrGrade: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">বোর্ড / বিশ্ববিদ্যালয় (Board)</label>
                      <select
                        value={admissionForm.board || admissionForm.boardOrInstitute}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, board: e.target.value, boardOrInstitute: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="Cumilla">কুমিল্লা (Cumilla)</option>
                        <option value="Dhaka">ঢাকা (Dhaka)</option>
                        <option value="Chittagong">চট্টগ্রাম (Chittagong)</option>
                        <option value="Rajshahi">রাজশাহী (Rajshahi)</option>
                        <option value="Barisal">বরিশাল (Barisal)</option>
                        <option value="Sylhet">সিলেট (Sylhet)</option>
                        <option value="Madrasah">মাদ্রাসা বোর্ড</option>
                        <option value="Technical">কারিগরি বোর্ড (BTEB)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">পাসের সন (Year)</label>
                      <input
                        type="text"
                        placeholder="2024"
                        value={admissionForm.passingYear}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, passingYear: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    CARD 5: DOCUMENT UPLOADS (প্রয়োজনীয় কাগজপত্র)
                ------------------------------------------------------------- */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="bg-slate-800 text-white px-4 py-2.5 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>৫. প্রয়োজনীয় কাগজপত্র সংযুক্তকরণ (Document Uploads)</span>
                    </span>
                    <span className="text-[10px] font-normal bg-white/20 px-2 py-0.5 rounded">Digital Scan</span>
                  </div>
                  <div className="p-4 sm:p-5 bg-slate-50 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Photo */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-800 block text-xs">১. পাসপোর্ট সাইজ ছবি *</span>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 bg-slate-100 rounded border overflow-hidden shrink-0">
                          {admissionForm.photoUrl ? (
                            <img src={admissionForm.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                          ) : (
                            <Camera className="w-6 h-6 m-auto text-slate-400" />
                          )}
                        </div>
                        <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-3 py-2 rounded-lg cursor-pointer transition flex items-center gap-1 border border-slate-300">
                          <Upload className="w-3.5 h-3.5" />
                          <span>ছবি বেছে নিন</span>
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                        </label>
                      </div>
                    </div>

                    {/* NID Document */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-800 block text-xs">২. NID / জন্ম নিবন্ধন স্ক্যান *</span>
                      <div className="flex items-center gap-2">
                        <label className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold p-2.5 rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5 border border-slate-300">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{admissionForm.nidDocUrl ? 'ডকুমেন্ট আপলোড সম্পন্ন ✓' : 'NID ফাইল আপলোড করুন'}</span>
                          <input type="file" accept="image/*,application/pdf" onChange={handleNidDocUpload} className="hidden" />
                        </label>
                      </div>
                    </div>

                    {/* Academic Certificate / Marksheet */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-800 block text-xs">৩. এসএসসি সনদ / মার্কশিট *</span>
                      <div className="flex items-center gap-2">
                        <label className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold p-2.5 rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5 border border-slate-300">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{admissionForm.certificateDocUrl ? 'সনদ আপলোড সম্পন্ন ✓' : 'সনদ/মার্কশিট আপলোড'}</span>
                          <input type="file" accept="image/*,application/pdf" onChange={handleCertDocUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    CARD 6: PAYMENT METHOD (ভর্তি ফি ও পেমেন্ট বিবরণ)
                ------------------------------------------------------------- */}
                <div className="border border-pink-200 rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-700 to-rose-800 text-white px-4 py-2.5 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>৬. ভর্তি ফি ও পেমেন্ট মাধ্যম (Payment Details)</span>
                    </span>
                    <span className="text-[10px] font-normal bg-white/20 px-2 py-0.5 rounded">bKash / Nagad / Rocket</span>
                  </div>
                  <div className="p-4 sm:p-5 bg-pink-50/20 space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <span className="bg-pink-100 text-pink-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                          অফিসিয়াল পেমেন্ট নম্বর (Send Money / Payment)
                        </span>
                        <p className="text-lg font-black text-slate-900 font-mono mt-1">
                          01973-817167 <span className="text-xs font-normal text-slate-600">(বিকাশ / নগদ / রকেট)</span>
                        </p>
                        <p className="text-[11px] text-slate-500">
                          ভর্তি ফি <strong>৳{admissionForm.paymentAmount}</strong> উল্লিখিত নম্বরে সেন্ড মানি বা ক্যাশ প্রদান করে TrxID নিচে লিখুন।
                        </p>
                      </div>
                      <div className="bg-pink-50 border border-pink-300 rounded-xl px-4 py-2 text-center shrink-0">
                        <span className="text-[10px] font-bold text-slate-500 block">মোট ভর্তি ফি</span>
                        <span className="text-xl font-black text-pink-700">৳{admissionForm.paymentAmount}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">পেমেন্ট মাধ্যম (Method)</label>
                        <select
                          value={admissionForm.paymentMethod}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, paymentMethod: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-pink-500 focus:outline-none"
                        >
                          <option value="bkash">bKash (বিকাশ)</option>
                          <option value="nagad">Nagad (নগদ)</option>
                          <option value="rocket">Rocket (রকেট)</option>
                          <option value="bank">ব্যাংক একাউন্ট ডিপোজিট</option>
                          <option value="cash_office">অফিসে সরাসরি জমা (Cash)</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">প্রেরক মোবাইল নম্বর (Sender Number)</label>
                        <input
                          type="tel"
                          placeholder="যে নম্বর থেকে টাকা পাঠিয়েছেন"
                          value={admissionForm.paymentSenderNo}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, paymentSenderNo: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-pink-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          ট্রানজেকশন আইডি (TrxID) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. BK9281749"
                          value={admissionForm.paymentTrxId}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, paymentTrxId: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-mono uppercase font-bold text-slate-900 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    CARD 7: ADMISSION TERMS & CONDITIONS (ভর্তির শর্তাবলী)
                ------------------------------------------------------------- */}
                <div className="border-2 border-rose-300 rounded-2xl overflow-hidden bg-rose-50/40">
                  <div className="bg-gradient-to-r from-rose-700 to-red-800 text-white px-4 py-2.5 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" />
                      <span>৭. ভর্তির শর্তাবলী (Terms and Conditions)</span>
                    </span>
                    <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded">বাধ্যতামূলক</span>
                  </div>
                  <div className="p-4 sm:p-5 space-y-3 text-xs text-rose-950 font-medium">
                    <ul className="list-decimal pl-5 space-y-1.5 leading-relaxed">
                      <li>প্রতিষ্ঠানের যাবতীয় নিয়ম-কানুন, শৃঙ্খলা ও শিক্ষকদের নির্দেশনা সবসময় মেনে চলতে হবে।</li>
                      <li>
                        ভর্তির পর নিয়মিত ক্লাস ও প্র্যাকটিক্যাল সেশনে উপস্থিত থাকা বাধ্যতামূলক। তবে কোনো শিক্ষার্থী ক্লাসে অনুপস্থিত থাকলেও বা ক্লাস না করলেও কোর্সের নির্ধারিত যাবতীয় ফি (মাসিক বেতন/সেমিস্টার ফি) সম্পূর্ণ পরিশোধ করতে বাধ্য থাকিবে।
                      </li>
                      <li>বকেয়া ফি পরিশোধ না করলে সেমিস্টার বা চূড়ান্ত পরীক্ষায় অংশগ্রহণের অনুমতি দেওয়া হবে না।</li>
                      <li>ভর্তি ফরম বা কোর্সের যাবতীয় ফি অফেরতযোগ্য (Non-refundable)।</li>
                    </ul>

                    <div className="pt-2 border-t border-rose-200">
                      <label className="flex items-center gap-2 font-black text-rose-900 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={admissionForm.termsAccepted}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, termsAccepted: e.target.checked })}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span>আমি উপরোক্ত সকল শর্তাবলী মনোযোগ সহকারে পড়েছি এবং স্বজ্ঞানে মেনে নিলাম।</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    CARD 8: STUDENT & GUARDIAN DECLARATION (অঙ্গীকারনামা)
                ------------------------------------------------------------- */}
                <div className="border border-purple-200 rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-900 to-slate-900 text-white px-4 py-2.5 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <PenTool className="w-4 h-4" />
                      <span>৮. শিক্ষার্থী ও অভিভাবকের অঙ্গীকারনামা ও ডিজিটাল স্বাক্ষর</span>
                    </span>
                    <span className="text-[10px] font-normal bg-white/20 px-2 py-0.5 rounded">Digital Signatures</span>
                  </div>
                  <div className="p-4 sm:p-5 bg-purple-50/20 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Student Signature Box */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                      <h4 className="font-bold text-slate-800 text-xs border-b pb-1">শিক্ষার্থীর অঙ্গীকারনামা</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed italic">
                        "আমি অঙ্গীকার করছি যে, ফরমে প্রদত্ত সকল তথ্য সঠিক ও সত্য। কোনো তথ্য অসত্য প্রমাণিত হলে আমার ভর্তি বাতিলযোগ্য হবে।"
                      </p>
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-2 h-20 flex items-center justify-center bg-slate-50">
                        {admissionForm.studentSignatureUrl ? (
                          <img src={admissionForm.studentSignatureUrl} alt="Student Signature" className="max-h-16 max-w-full object-contain" />
                        ) : (
                          <span className="text-slate-400 text-[11px]">শিক্ষার্থীর স্বাক্ষর আপলোড করুন</span>
                        )}
                      </div>
                      <label className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-lg text-center cursor-pointer block border border-slate-300 text-[11px] transition">
                        <Upload className="w-3.5 h-3.5 inline mr-1" />
                        <span>শিক্ষার্থীর স্বাক্ষর ফাইল যোগ করুন</span>
                        <input type="file" accept="image/*" onChange={handleStudentSigUpload} className="hidden" />
                      </label>
                    </div>

                    {/* Guardian Signature Box */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                      <h4 className="font-bold text-slate-800 text-xs border-b pb-1">অভিভাবকের অঙ্গীকারনামা</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed italic">
                        "আমি আমার সন্তানের ভর্তি ও যাবতীয় ফি নিয়মিত পরিশোধের দায়ভার গ্রহণ করছি এবং প্রতিষ্ঠানের সকল বিধিনিষেধ মান্য করব।"
                      </p>
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-2 h-20 flex items-center justify-center bg-slate-50">
                        {admissionForm.guardianSignatureUrl ? (
                          <img src={admissionForm.guardianSignatureUrl} alt="Guardian Signature" className="max-h-16 max-w-full object-contain" />
                        ) : (
                          <span className="text-slate-400 text-[11px]">অভিভাবকের স্বাক্ষর আপলোড করুন</span>
                        )}
                      </div>
                      <label className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-lg text-center cursor-pointer block border border-slate-300 text-[11px] transition">
                        <Upload className="w-3.5 h-3.5 inline mr-1" />
                        <span>অভিভাবকের স্বাক্ষর ফাইল যোগ করুন</span>
                        <input type="file" accept="image/*" onChange={handleGuardianSigUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    CARD 9: OFFICE USE ONLY (শুধুমাত্র অফিস ব্যবহারের জন্য)
                ------------------------------------------------------------- */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3 text-slate-600">
                  <span className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                    ৯. শুধুমাত্র অফিস ব্যবহারের জন্য (For Office Use Only)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="h-10"></div>
                      <div className="border-t border-slate-300 pt-1 text-[10px] font-bold text-slate-700">ভর্তি গ্রহণকারী কর্মকর্তার স্বাক্ষর</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="h-10"></div>
                      <div className="border-t border-slate-300 pt-1 text-[10px] font-bold text-slate-700">যাচাইকারী / শাখা প্রধান</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="h-10"></div>
                      <div className="border-t border-slate-300 pt-1 text-[10px] font-bold text-slate-700">অধ্যক্ষ / পরিচালক (সিল ও স্বাক্ষর)</div>
                    </div>
                  </div>
                </div>

                {/* Submit & Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-black py-4 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-700/20 transition duration-200 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>আবেদন যাচাই ও সংরক্ষণ হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>অনলাইন ভর্তি আবেদনপত্র জমা দিন (Submit Form)</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="bg-slate-900 hover:bg-black text-white font-bold px-8 py-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <Printer className="w-4 h-4" />
                    <span>ফরম প্রিন্ট বা PDF</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          TAB 3: DIGITAL CERTIFICATE VERIFICATION
      ========================================== */}
      {activeTab === 'verify' && (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
          
          {/* Verification Search Bar */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6 text-center">
            <div className="max-w-xl mx-auto space-y-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase">
                কেন্দ্রীয় ভেরিফিকেশন সার্ভার
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                ডিজিটাল সার্টিফিকেট ও শিক্ষার্থী যাচাইকরণ
              </h2>
              <p className="text-xs text-slate-500">
                সার্টিফিকেট নম্বর, রোল নম্বর অথবা রেজিস্ট্রেশন নম্বর প্রদান করে তাৎক্ষণিক অফিসিয়াল ডাটাবেজ যাচাই করুন।
              </p>
            </div>

            <form onSubmit={handleVerify} className="max-w-xl mx-auto flex gap-2">
              <input
                type="text"
                value={verifyQuery}
                onChange={(e) => setVerifyQuery(e.target.value)}
                placeholder="রোল নম্বর (1024), রেজিঃ (CMSS-2025-881) বা Cert No..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={verifyLoading}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition disabled:opacity-50"
              >
                {verifyLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>যাচাই করুন</span>
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500">
              <span>ডেমো ট্রাই করুন:</span>
              <button
                type="button"
                onClick={() => { setVerifyQuery('1024'); }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md font-mono font-bold"
              >
                Roll: 1024
              </button>
              <button
                type="button"
                onClick={() => { setVerifyQuery('1025'); }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md font-mono font-bold"
              >
                Roll: 1025
              </button>
              <button
                type="button"
                onClick={() => { setVerifyQuery('CMSS-CERT-2026-1024'); }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md font-mono font-bold"
              >
                Cert: 1024
              </button>
            </div>
          </div>

          {verifyError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-5 rounded-2xl text-xs text-center space-y-1">
              <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
              <p className="font-bold text-sm">{verifyError}</p>
              <p>দয়া করে সঠিক তথ্য প্রদান করুন অথবা অফিসিয়াল হেল্পলাইনে যোগাযোগ করুন।</p>
            </div>
          )}

          {/* Verified Certificate Display */}
          {verifyResult && verifyResult.certificate && (
            <div className="bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 rounded-3xl border-4 border-amber-600/60 p-6 sm:p-12 shadow-2xl space-y-8 relative overflow-hidden">
              
              {/* Watermark Seal Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <Award className="w-96 h-96 text-amber-900" />
              </div>

              {/* Certificate Header */}
              <div className="text-center space-y-3 relative z-10 border-b-2 border-amber-200 pb-6">
                <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-xs bg-emerald-100 px-3 py-1 rounded-full w-max mx-auto">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>সরকারি ও CMSS অনুমোদিত ডিজিটাল রেকর্ড যাচাইকৃত</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                  কোম্পানীগঞ্জ প্যারামেডিকেল ইনস্টিটিউট
                </h1>
                <p className="text-xs sm:text-sm font-bold text-emerald-900">
                  CMSS ইনস্টিটিউট অব মেডিকেল টেকনোলজি শাখা (রেজিঃ ঢাকা S-৩১৪৪ (১০৯) ২০০৩)
                </p>
                <p className="text-[11px] text-slate-500">
                  রৌশন আরা মার্কেট, বসুরহাট, কোম্পানীগঞ্জ, নোয়াখালী। পরীক্ষা কেন্দ্র: নোয়াখালী (NH-702)
                </p>
                <div className="inline-block bg-amber-700 text-white font-black text-xs px-6 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                  অ্যাকাডেমিক সার্টিফিকেট ও গ্রেড রিপোর্ট
                </div>
              </div>

              {/* Certificate Body */}
              <div className="relative z-10 space-y-6 text-center text-xs sm:text-sm text-slate-800 leading-loose">
                <p className="text-slate-600">
                  প্রত্যয়ন করা যাচ্ছে যে,
                </p>
                <h3 className="text-xl sm:text-2xl font-black text-emerald-950 underline decoration-amber-500 underline-offset-8">
                  {verifyResult.certificate.studentNameBn} ({verifyResult.certificate.studentName})
                </h3>
                <p className="text-slate-700">
                  পিতা: <strong>{verifyResult.certificate.fatherNameBn}</strong>, মাতা: <strong>{verifyResult.certificate.motherNameBn}</strong><br />
                  রোল নম্বর: <strong className="font-mono text-emerald-800 font-bold text-base px-2 py-0.5 bg-emerald-50 rounded">{verifyResult.certificate.rollNumber}</strong> &nbsp;|&nbsp; 
                  রেজিস্ট্রেশন নম্বর: <strong className="font-mono text-emerald-800 font-bold text-base px-2 py-0.5 bg-emerald-50 rounded">{verifyResult.certificate.registrationNumber}</strong>
                </p>
                <p className="text-slate-700 max-w-2xl mx-auto">
                  তিনি কোম্পানীগঞ্জ প্যারামেডিকেল ইনস্টিটিউট হতে <strong className="text-emerald-950 font-black">{verifyResult.certificate.courseTitleBn}</strong> কোর্সে (<strong className="text-slate-900">{verifyResult.certificate.durationBn}</strong> মেয়াদী) পরীক্ষায় অংশগ্রহণ করে কৃতিত্বের সাথে গ্রেড: <strong className="text-amber-800 font-black text-base bg-amber-100 px-2 py-0.5 rounded">{verifyResult.certificate.grade} (GPA: {verifyResult.certificate.gpa})</strong> পেয়ে উত্তীর্ণ হয়েছেন।
                </p>
              </div>

              {/* Footer Badges & Signatures */}
              <div className="relative z-10 pt-8 border-t border-amber-200 grid grid-cols-1 sm:grid-cols-3 items-center gap-6 text-center text-xs">
                <div className="space-y-1">
                  <div className="w-24 h-24 bg-white p-2 border-2 border-slate-300 rounded-xl shadow-xs mx-auto flex items-center justify-center">
                    <QrCode className="w-full h-full text-slate-800" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">CERT ID: {verifyResult.certificate.certificateNo}</span>
                </div>

                <div className="space-y-1 text-slate-600">
                  <span className="font-bold text-emerald-900 block">ইস্যুর তারিখ: {verifyResult.certificate.issueDate}</span>
                  <span className="text-[11px] text-slate-500 block">পরীক্ষার বছর: {verifyResult.certificate.examYear}</span>
                  <span className="text-[11px] text-slate-500 block">{verifyResult.certificate.remarks}</span>
                </div>

                <div className="space-y-2">
                  <div className="border-b-2 border-slate-400 w-36 mx-auto pt-8"></div>
                  <p className="font-bold text-slate-900 text-xs">অধ্যক্ষ / পরীক্ষা নিয়ন্ত্রক</p>
                  <p className="text-[10px] text-slate-500">কোম্পানীগঞ্জ প্যারামেডিকেল ইনস্টিটিউট</p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handlePrint}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>সার্টিফিকেট প্রিন্ট / ডাউনলোড করুন</span>
                </button>
              </div>
            </div>
          )}

          {/* If Student Record found but not final cert yet */}
          {verifyResult && !verifyResult.certificate && verifyResult.student && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b pb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                    অ্যাক্টিভ শিক্ষার্থী প্রোফাইল
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    {verifyResult.student.fullNameBn} ({verifyResult.student.fullName})
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl">
                  <p><span className="text-slate-400">রোল নম্বর:</span> <strong className="font-mono text-emerald-800 text-sm">{verifyResult.student.rollNumber}</strong></p>
                  <p><span className="text-slate-400">রেজিস্ট্রেশন নম্বর:</span> <strong className="font-mono text-emerald-800 text-sm">{verifyResult.student.registrationNumber}</strong></p>
                  <p><span className="text-slate-400">কোর্স:</span> <strong className="text-slate-900">{verifyResult.student.courseTitleBn}</strong></p>
                  <p><span className="text-slate-400">সেশন:</span> <strong className="text-slate-800">{verifyResult.student.session}</strong></p>
                </div>
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl">
                  <p><span className="text-slate-400">পিতার নাম:</span> <strong className="text-slate-800">{verifyResult.student.fatherNameBn || verifyResult.student.fatherName}</strong></p>
                  <p><span className="text-slate-400">রক্তের গ্রুপ:</span> <strong className="text-emerald-700 font-bold">{verifyResult.student.bloodGroup}</strong></p>
                  <p><span className="text-slate-400">ইনস্টিটিউট:</span> <strong className="text-slate-800">{verifyResult.student.instituteNameBn}</strong></p>
                  <p><span className="text-slate-400">স্ট্যাটাস:</span> <strong className="text-emerald-600 font-bold uppercase">{verifyResult.student.status}</strong></p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          TAB 4: STUDENT CREDENTIALS PORTAL
      ========================================== */}
      {activeTab === 'credentials' && (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
          
          {/* Query Bar */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  ডিজিটাল আইডি, এডমিট ও রেজিস্ট্রেশন কার্ড পোর্টাল
                </h2>
                <p className="text-xs text-slate-500">
                  রোল বা রেজিস্ট্রেশন নম্বর দিয়ে ডিজিটাল কার্ড জেনারেট ও প্রিন্ট করুন।
                </p>
              </div>

              {/* Credential Switcher */}
              <div className="flex gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
                <button
                  onClick={() => { setCredType('idcard'); handleFetchCredentials('idcard', credQuery); }}
                  className={`px-3 py-1.5 rounded-xl transition ${credType === 'idcard' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  আইডি কার্ড
                </button>
                <button
                  onClick={() => { setCredType('admitcard'); handleFetchCredentials('admitcard', credQuery); }}
                  className={`px-3 py-1.5 rounded-xl transition ${credType === 'admitcard' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  প্রবেশপত্র (Admit)
                </button>
                <button
                  onClick={() => { setCredType('regcard'); handleFetchCredentials('regcard', credQuery); }}
                  className={`px-3 py-1.5 rounded-xl transition ${credType === 'regcard' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  রেজিস্ট্রেশন কার্ড
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={credQuery}
                onChange={(e) => setCredQuery(e.target.value)}
                placeholder="রোল নম্বর (e.g. 1024, 1025) বা রেজিস্ট্রেশন নম্বর..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                onClick={() => handleFetchCredentials(credType, credQuery)}
                disabled={credLoading}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                {credLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>কার্ড লোড করুন</span>
              </button>
            </div>
          </div>

          {credError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs text-center">
              {credError}
            </div>
          )}

          {/* 1. STUDENT ID CARD TEMPLATE (Front & Back) */}
          {credType === 'idcard' && credData && credData.student && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-slate-900 text-sm">
                  অফিসিয়াল স্টুডেন্ট আইডি কার্ড (Student ID Card)
                </h3>
                <button
                  onClick={handlePrint}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>আইডি কার্ড প্রিন্ট করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                
                {/* ID Card Front */}
                <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 text-white rounded-3xl p-6 shadow-2xl border-2 border-emerald-500/40 relative overflow-hidden flex flex-col justify-between h-[420px]">
                  <div className="text-center space-y-1 border-b border-white/20 pb-3">
                    <h4 className="font-black text-sm text-emerald-300 uppercase tracking-tight">
                      Companiganj Paramedical Institute
                    </h4>
                    <p className="text-[10px] text-white/80">কোম্পানীগঞ্জ প্যারামেডিকেল ইনস্টিটিউট</p>
                    <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                      STUDENT IDENTITY CARD
                    </span>
                  </div>

                  <div className="flex flex-col items-center text-center space-y-2 py-2">
                    <div className="w-24 h-24 rounded-2xl border-2 border-amber-400 overflow-hidden shadow-lg bg-white">
                      <img
                        src={credData.student.photoUrl}
                        alt={credData.student.fullNameBn}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-black text-base text-white">{credData.student.fullNameBn}</h3>
                      <p className="text-xs text-emerald-300 font-bold">{credData.student.fullName}</p>
                    </div>
                    <span className="bg-emerald-800/80 text-emerald-200 text-[11px] font-bold px-3 py-0.5 rounded-full border border-emerald-600">
                      {credData.student.courseTitleBn}
                    </span>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl grid grid-cols-2 gap-2 text-[11px] border border-white/10">
                    <div>
                      <span className="text-white/60 block text-[9px]">ROLL NO:</span>
                      <strong className="text-amber-300 font-mono text-xs">{credData.student.rollNumber}</strong>
                    </div>
                    <div>
                      <span className="text-white/60 block text-[9px]">REG NO:</span>
                      <strong className="text-amber-300 font-mono text-xs">{credData.student.registrationNumber}</strong>
                    </div>
                    <div>
                      <span className="text-white/60 block text-[9px]">BLOOD GROUP:</span>
                      <strong className="text-rose-400 font-bold">{credData.student.bloodGroup}</strong>
                    </div>
                    <div>
                      <span className="text-white/60 block text-[9px]">SESSION:</span>
                      <strong className="text-white">{credData.student.session}</strong>
                    </div>
                  </div>
                </div>

                {/* ID Card Back */}
                <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border-2 border-slate-200 flex flex-col justify-between h-[420px] text-xs">
                  <div className="space-y-3">
                    <div className="text-center border-b pb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        CMSS Institute of Medical Technology Branch
                      </span>
                      <p className="font-bold text-slate-800 text-[11px]">
                        রৌশন আরা মার্কেট, বসুরহাট, কোম্পানীগঞ্জ, নোয়াখালী।
                      </p>
                    </div>

                    <div className="space-y-2 text-[11px] text-slate-700 bg-slate-50 p-3 rounded-2xl">
                      <p><span className="text-slate-400">পিতার নাম:</span> <strong>{credData.student.fatherNameBn || credData.student.fatherName}</strong></p>
                      <p><span className="text-slate-400">জরুরি যোগাযোগ:</span> <strong className="font-bold text-emerald-800">{credData.student.phone}</strong></p>
                      <p><span className="text-slate-400">ইনস্টিটিউট হেল্পলাইন:</span> <strong>{credData.institute.helpline}</strong></p>
                      <p><span className="text-slate-400">কার্ড মেয়াদ:</span> <strong>{credData.validity}</strong></p>
                    </div>

                    <div className="text-center py-1">
                      <div className="w-16 h-16 mx-auto bg-slate-100 p-1 rounded-lg flex items-center justify-center">
                        <QrCode className="w-full h-full text-slate-800" />
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">Scan QR for instant validation</span>
                    </div>
                  </div>

                  <div className="border-t pt-2 text-center">
                    <div className="border-b border-slate-400 w-28 mx-auto mb-1"></div>
                    <p className="font-bold text-slate-800 text-[10px]">অধ্যক্ষ (Principal)</p>
                    <p className="text-[8px] text-slate-500">কোম্পানীগঞ্জ প্যারামেডিকেল ইনস্টিটিউট</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 2. EXAM ADMIT CARD TEMPLATE */}
          {credType === 'admitcard' && credData && credData.rollNumber && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-slate-900 text-sm">
                  সেমিস্টার ফাইনাল পরীক্ষা প্রবেশপত্র (Exam Admit Card)
                </h3>
                <button
                  onClick={handlePrint}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রবেশপত্র প্রিন্ট করুন</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-8 shadow-xl space-y-6 max-w-3xl mx-auto text-xs">
                <div className="text-center space-y-1 border-b-2 border-slate-200 pb-4">
                  <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                    CMSS Institute of Medical Technology
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    কোম্পানীগঞ্জ প্যারামেডিকেল ইনস্টিটিউট
                  </h2>
                  <p className="text-xs font-bold text-emerald-800">{credData.examTitleBn}</p>
                  <div className="inline-block bg-slate-900 text-white font-bold text-xs px-4 py-1 rounded-md uppercase tracking-wider mt-1">
                    ADMIT CARD / প্রবেশপত্র
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                  <div className="sm:col-span-3 space-y-2 bg-slate-50 p-4 rounded-2xl">
                    <div className="grid grid-cols-2 gap-2">
                      <p><span className="text-slate-400">পরীক্ষার্থীর নাম:</span> <strong className="text-slate-900 text-sm block">{credData.studentNameBn}</strong></p>
                      <p><span className="text-slate-400">কোর্স:</span> <strong className="text-emerald-900 block">{credData.courseTitleBn}</strong></p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <p><span className="text-slate-400">রোল নম্বর:</span> <strong className="font-mono text-emerald-800 text-sm block font-bold">{credData.rollNumber}</strong></p>
                      <p><span className="text-slate-400">রেজিস্ট্রেশন নং:</span> <strong className="font-mono text-emerald-800 text-sm block font-bold">{credData.registrationNumber}</strong></p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <p><span className="text-slate-400">পরীক্ষা কেন্দ্র:</span> <strong className="text-slate-800 block">{credData.centerNameBn}</strong></p>
                      <p><span className="text-slate-400">সেন্টার কোড:</span> <strong className="font-mono text-slate-800 block">{credData.centerCode}</strong></p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="w-24 h-28 border-2 border-slate-300 rounded-xl overflow-hidden bg-slate-100 shadow-sm">
                      <img src={credData.photoUrl} alt={credData.studentNameBn} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Exam Schedule Table */}
                <div className="space-y-2">
                  <h4 className="font-black text-slate-900 text-xs">পরীক্ষার রুটিন ও বিষয়সমূহ:</h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">বিষয় কোড</th>
                          <th className="p-2.5">বিষয়ের নাম</th>
                          <th className="p-2.5">তারিখ</th>
                          <th className="p-2.5">সময়</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(credData?.subjects || []).map((s: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2.5 font-mono font-bold text-emerald-700">{s.code}</td>
                            <td className="p-2.5 font-bold text-slate-800">{s.nameBn}</td>
                            <td className="p-2.5 text-slate-600">{s.date}</td>
                            <td className="p-2.5 text-slate-600">{s.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Rules */}
                <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl space-y-1 text-[10px] text-amber-950">
                  <p className="font-bold">পরীক্ষার্থীদের জন্য নিয়মাবলী:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                    {(credData?.instructions || []).map((ins: string, i: number) => (
                      <li key={i}>{ins}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-slate-200 flex justify-between items-end">
                  <div className="w-14 h-14 bg-slate-50 border p-1 rounded-md flex items-center justify-center">
                    <QrCode className="w-full h-full text-slate-800" />
                  </div>
                  <div className="text-center">
                    <div className="border-b border-slate-400 w-36 mx-auto mb-1"></div>
                    <p className="font-bold text-slate-800 text-[11px]">পরীক্ষা নিয়ন্ত্রক ও সচিব</p>
                    <p className="text-[9px] text-slate-500">সিএমএসএস কেন্দ্রীয় পরিষদ</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. OFFICIAL REGISTRATION CARD TEMPLATE */}
          {credType === 'regcard' && credData && credData.registrationNumber && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-slate-900 text-sm">
                  অফিসিয়াল রেজিস্ট্রেশন কার্ড (Student Registration Card)
                </h3>
                <button
                  onClick={handlePrint}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>রেজিস্ট্রেশন কার্ড প্রিন্ট করুন</span>
                </button>
              </div>

              <div className="bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/20 rounded-3xl border-2 border-emerald-600/40 p-6 sm:p-10 shadow-xl space-y-6 max-w-3xl mx-auto text-xs relative overflow-hidden">
                <div className="text-center space-y-1 border-b-2 border-emerald-200 pb-4">
                  <h2 className="text-xl sm:text-2xl font-black text-emerald-950">
                    {credData.regAuthorityBn}
                  </h2>
                  <p className="text-[11px] text-slate-600 font-bold">{credData.approvedRefBn}</p>
                  <p className="text-xs font-bold text-emerald-900">শাখা: {credData.instituteNameBn}</p>
                  <div className="inline-block bg-emerald-700 text-white font-black text-xs px-5 py-1 rounded-full uppercase tracking-wider mt-1">
                    STUDENT REGISTRATION CARD / রেজিস্ট্রেশন কার্ড
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 items-center">
                  <div className="sm:col-span-3 space-y-3 bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <p><span className="text-slate-400">রেজিস্ট্রেশন নং:</span> <strong className="font-mono text-emerald-900 text-sm font-black block">{credData.registrationNumber}</strong></p>
                      <p><span className="text-slate-400">সেশন:</span> <strong className="text-slate-900 block font-bold">{credData.session}</strong></p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <p><span className="text-slate-400">শিক্ষার্থীর নাম:</span> <strong className="text-slate-900 text-sm block font-bold">{credData.studentNameBn}</strong></p>
                      <p><span className="text-slate-400">কোর্স:</span> <strong className="text-emerald-900 block font-bold">{credData.courseTitleBn}</strong></p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <p><span className="text-slate-400">পিতার নাম:</span> <strong className="text-slate-800 block">{credData.fatherNameBn}</strong></p>
                      <p><span className="text-slate-400">মাতার নাম:</span> <strong className="text-slate-800 block">{credData.motherNameBn}</strong></p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <p><span className="text-slate-400">রক্তের গ্রুপ:</span> <strong className="text-rose-600 block font-bold">{credData.bloodGroup}</strong></p>
                      <p><span className="text-slate-400">কার্ডের মেয়াদ:</span> <strong className="text-slate-800 block">{credData.validUntil}</strong></p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-24 h-28 border-2 border-emerald-600 rounded-xl overflow-hidden bg-white shadow-md">
                      <img src={credData.photoUrl} alt={credData.studentNameBn} className="w-full h-full object-cover" />
                    </div>
                    <div className="w-14 h-14 bg-white border p-1 rounded-md flex items-center justify-center">
                      <QrCode className="w-full h-full text-slate-800" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-emerald-200 flex justify-between items-end text-center">
                  <div>
                    <div className="border-b border-slate-400 w-32 mb-1"></div>
                    <p className="font-bold text-slate-800 text-[10px]">অধ্যক্ষ</p>
                    <p className="text-[8px] text-slate-500">কোম্পানীগঞ্জ প্যারামেডিকেল</p>
                  </div>
                  <div>
                    <div className="border-b border-slate-400 w-36 mb-1"></div>
                    <p className="font-bold text-slate-800 text-[10px]">রেজিস্ট্রার ও সচিব</p>
                    <p className="text-[8px] text-slate-500">সিএমএসএস কেন্দ্রীয় পরিষদ</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ==========================================
          TAB 5: INSTITUTE ADMIN CONTROL PANEL
      ========================================== */}
      {activeTab === 'admin' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-black px-3 py-1 rounded-full uppercase">
                অ্যাডমিন ও পরীক্ষা নিয়ন্ত্রক প্যানেল
              </span>
              <h2 className="text-xl sm:text-2xl font-black">
                মেডিকেল কোর্স ভর্তি ও সনদ ম্যানেজমেন্ট
              </h2>
              <p className="text-xs text-slate-400">
                ভর্তি আবেদন পর্যালোচনা, রোল/রেজিস্ট্রেশন প্রদান এবং ডিজিটাল সার্টিফিকেট ইস্যু করুন।
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowIssueCertModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>নতুন সনদ ইস্যু</span>
              </button>
              <button
                onClick={handleFetchAdminData}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold p-2.5 rounded-xl text-xs transition"
              >
                <RefreshCw className={`w-4 h-4 ${adminActionLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Pending Admissions Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>ভর্তি আবেদন ও ট্র্যাকিং তালিকা ({admissionsList.length})</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">ট্র্যাকিং নম্বর</th>
                    <th className="p-3">শিক্ষার্থী</th>
                    <th className="p-3">কোর্স</th>
                    <th className="p-3">মোবাইল</th>
                    <th className="p-3">বিকাশ TrxID</th>
                    <th className="p-3">স্ট্যাটাস</th>
                    <th className="p-3 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {admissionsList.map((adm) => (
                    <tr key={adm.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-emerald-700">{adm.trackingNumber}</td>
                      <td className="p-3">
                        <strong className="text-slate-900 block">{adm.studentNameBn || adm.studentName}</strong>
                        <span className="text-[10px] text-slate-400">{adm.studentName}</span>
                      </td>
                      <td className="p-3 font-bold text-slate-800">{adm.courseTitleBn}</td>
                      <td className="p-3 font-mono">{adm.phone}</td>
                      <td className="p-3 font-mono uppercase bg-slate-50 text-slate-700">{adm.paymentTrxId} (৳{adm.paymentAmount})</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          adm.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {adm.status === 'approved' ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {adm.status !== 'approved' ? (
                          <button
                            onClick={() => handleApproveAdmission(adm.id)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-xs transition"
                          >
                            অনুমোদন করুন
                          </button>
                        ) : (
                          <span className="text-[11px] font-mono text-emerald-700 font-bold">
                            Roll: {adm.assignedRoll}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Enrolled Students & Certificates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Students List */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2 border-b pb-3">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>নিবন্ধিত শিক্ষার্থী তালিকা ({studentsList.length})</span>
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {studentsList.map((std) => (
                  <div key={std.id} className="bg-slate-50 p-3.5 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-slate-900 text-sm block">{std.fullNameBn}</strong>
                      <span className="text-[11px] text-slate-500">{std.courseTitleBn}</span>
                      <div className="flex gap-2 text-[10px] font-mono text-emerald-800 pt-1">
                        <span>Roll: {std.rollNumber}</span>
                        <span>Reg: {std.registrationNumber}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCredQuery(std.rollNumber);
                        setActiveTab('credentials');
                        handleFetchCredentials('idcard', std.rollNumber);
                      }}
                      className="bg-white hover:bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] transition"
                    >
                      কার্ড দেখুন
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Issued Certificates */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2 border-b pb-3">
                <Award className="w-4 h-4 text-amber-600" />
                <span>ইস্যুকৃত সার্টিফিকেট ({certificatesList.length})</span>
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {certificatesList.map((cert) => (
                  <div key={cert.id} className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100 flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-slate-900 text-sm block">{cert.studentNameBn}</strong>
                      <span className="text-[11px] text-emerald-800 font-bold">{cert.courseTitleBn}</span>
                      <div className="flex gap-2 text-[10px] font-mono text-slate-600 pt-1">
                        <span>Cert: {cert.certificateNo}</span>
                        <span className="font-bold text-amber-800">Grade: {cert.grade} (GPA: {cert.gpa})</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setVerifyQuery(cert.certificateNo);
                        setActiveTab('verify');
                        handleVerify();
                      }}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] transition"
                    >
                      সনদ দেখুন
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modal: Issue Certificate */}
      {showIssueCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-slate-900 text-base">
                নতুন অফিসিয়াল সনদপত্র ইস্যু করুন
              </h3>
              <button onClick={() => setShowIssueCertModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await api.issueMedicalCertificate(newCertForm);
                  alert('Certificate issued successfully!');
                  setShowIssueCertModal(false);
                  handleFetchAdminData();
                } catch (err) {
                  console.error(err);
                }
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">রোল নম্বর *</label>
                  <input
                    type="text"
                    required
                    placeholder="1024"
                    value={newCertForm.rollNumber}
                    onChange={(e) => setNewCertForm({ ...newCertForm, rollNumber: e.target.value })}
                    className="w-full bg-slate-50 border p-2.5 rounded-xl font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">রেজিস্ট্রেশন নম্বর *</label>
                  <input
                    type="text"
                    required
                    placeholder="CMSS-2025-881"
                    value={newCertForm.registrationNumber}
                    onChange={(e) => setNewCertForm({ ...newCertForm, registrationNumber: e.target.value })}
                    className="w-full bg-slate-50 border p-2.5 rounded-xl font-bold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">শিক্ষার্থীর নাম (বাংলায়) *</label>
                <input
                  type="text"
                  required
                  placeholder="মো. তরিকুল ইসলাম"
                  value={newCertForm.studentNameBn}
                  onChange={(e) => setNewCertForm({ ...newCertForm, studentNameBn: e.target.value, studentName: e.target.value })}
                  className="w-full bg-slate-50 border p-2.5 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">পিতার নাম (বাংলায়)</label>
                  <input
                    type="text"
                    placeholder="মো. সিরাজুল ইসলাম"
                    value={newCertForm.fatherNameBn}
                    onChange={(e) => setNewCertForm({ ...newCertForm, fatherNameBn: e.target.value })}
                    className="w-full bg-slate-50 border p-2.5 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">মাতার নাম (বাংলায়)</label>
                  <input
                    type="text"
                    placeholder="ফাতেমা বেগম"
                    value={newCertForm.motherNameBn}
                    onChange={(e) => setNewCertForm({ ...newCertForm, motherNameBn: e.target.value })}
                    className="w-full bg-slate-50 border p-2.5 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">প্রাপ্ত গ্রেড *</label>
                  <select
                    value={newCertForm.grade}
                    onChange={(e) => setNewCertForm({ ...newCertForm, grade: e.target.value })}
                    className="w-full bg-slate-50 border p-2.5 rounded-xl font-bold"
                  >
                    <option value="A+">A+ (First Class)</option>
                    <option value="A">A (Excellent)</option>
                    <option value="A-">A- (Very Good)</option>
                    <option value="B">B (Good)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">GPA *</label>
                  <input
                    type="text"
                    required
                    value={newCertForm.gpa}
                    onChange={(e) => setNewCertForm({ ...newCertForm, gpa: e.target.value })}
                    className="w-full bg-slate-50 border p-2.5 rounded-xl font-bold font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowIssueCertModal(false)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl shadow-md"
                >
                  সনদ ইস্যু সম্পন্ন করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
