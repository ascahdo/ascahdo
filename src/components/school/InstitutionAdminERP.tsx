import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  GraduationCap,
  BookOpen,
  Calendar,
  Award,
  DollarSign,
  CreditCard,
  FileText,
  Clock,
  Send,
  Library,
  Bus,
  Home,
  Package,
  FileCheck,
  CheckCircle,
  XCircle,
  PlusCircle,
  Search,
  Printer,
  Download,
  QrCode,
  Globe,
  Settings,
  Bell,
  MessageSquare,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Image,
  AlertCircle
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { Student, Teacher, FeeInvoice, Exam, StudentResult } from '../../types/schoolTypes';

export const InstitutionAdminERP: React.FC<{
  onOpenNewSchoolModal: () => void;
}> = ({ onOpenNewSchoolModal }) => {
  const {
    activeInstitution,
    students,
    teachers,
    staff,
    classes,
    subjects,
    routines,
    exams,
    results,
    fees,
    transactions,
    payroll,
    leaves,
    notices,
    newsEvents,
    gallery,
    books,
    vehicles,
    hostelRooms,
    inventory,
    homeworks,
    admissions,
    addStudent,
    updateStudent,
    deleteStudent,
    addTeacher,
    markAttendance,
    publishResult,
    createFeeInvoice,
    payFeeInvoice,
    addTransaction,
    updateLeaveStatus,
    addNotice,
    addHomework,
    updateAdmissionStatus,
    updateWebsiteSettings,
    sendBulkSms,
    smsConfig
  } = useSchool();

  // Active ERP Tab
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'students'
    | 'admissions'
    | 'teachers'
    | 'classes'
    | 'attendance'
    | 'routine'
    | 'exams'
    | 'results'
    | 'fees'
    | 'accounting'
    | 'payroll'
    | 'leave'
    | 'library'
    | 'transport'
    | 'hostel'
    | 'inventory'
    | 'homework'
    | 'certificates'
    | 'idcards'
    | 'notices'
    | 'webbuilder'
    | 'sms'
    | 'settings'
  >('dashboard');

  // Search & Filter States
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');

  // Modal / Form States
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [isAddFeeInvoiceOpen, setIsAddFeeInvoiceOpen] = useState(false);
  const [isMarksEntryOpen, setIsMarksEntryOpen] = useState(false);
  const [isAddNoticeOpen, setIsAddNoticeOpen] = useState(false);
  const [isAddHomeworkOpen, setIsAddHomeworkOpen] = useState(false);
  const [isCollectFeeModalOpen, setIsCollectFeeModalOpen] = useState(false);
  const [selectedFeeForPayment, setSelectedFeeForPayment] = useState<FeeInvoice | null>(null);

  // Print Preview Modals
  const [idCardPreviewStudent, setIdCardPreviewStudent] = useState<Student | null>(null);
  const [certificateStudent, setCertificateStudent] = useState<{ student: Student; type: string } | null>(null);
  const [receiptInvoice, setReceiptInvoice] = useState<FeeInvoice | null>(null);

  // New Student Form State
  const [newStdId, setNewStdId] = useState('');
  const [newStdName, setNewStdName] = useState('');
  const [newStdNameBn, setNewStdNameBn] = useState('');
  const [newStdClass, setNewStdClass] = useState('Class 8');
  const [newStdSection, setNewStdSection] = useState('A');
  const [newStdGender, setNewStdGender] = useState<'male' | 'female'>('male');
  const [newStdBlood, setNewStdBlood] = useState<'A+' | 'B+' | 'O+' | 'AB+'>('A+');
  const [newStdGuardian, setNewStdGuardian] = useState('');
  const [newStdPhone, setNewStdPhone] = useState('');
  const [newStdAddress, setNewStdAddress] = useState('');

  // New Teacher Form State
  const [newTchId, setNewTchId] = useState('');
  const [newTchName, setNewTchName] = useState('');
  const [newTchNameBn, setNewTchNameBn] = useState('');
  const [newTchDesig, setNewTchDesig] = useState('Assistant Teacher');
  const [newTchDesigBn, setNewTchDesigBn] = useState('সহকারী শিক্ষক');
  const [newTchDept, setNewTchDept] = useState('Science');
  const [newTchPhone, setNewTchPhone] = useState('');
  const [newTchSalary, setNewTchSalary] = useState(35000);

  // Attendance Taking State
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [attClassId, setAttClassId] = useState('cls_8');
  const [attendanceSuccess, setAttendanceSuccess] = useState(false);

  // Bulk SMS State
  const [smsTarget, setSmsTarget] = useState('all_students');
  const [smsMessage, setSmsMessage] = useState('সম্মানিত অভিভাবক, আগামী রবিবার থেকে বার্ষিক পরীক্ষার প্রবেশপত্র বিতরণ শুরু হবে।');
  const [smsAlertSuccess, setSmsAlertSuccess] = useState<string | null>(null);

  // Handle Add Student
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStdName || !newStdId) return;

    addStudent({
      studentId: newStdId,
      fullName: newStdName,
      fullNameBn: newStdNameBn || newStdName,
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      gender: newStdGender,
      dob: '2010-01-01',
      bloodGroup: newStdBlood,
      religion: 'Islam',
      nationality: 'Bangladeshi',
      birthRegNo: `2010${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      classId: `cls_${newStdClass}`,
      className: newStdClass,
      section: newStdSection,
      shift: 'Morning',
      group: 'General',
      guardianName: newStdGuardian || 'অভিভাবক',
      guardianPhone: newStdPhone || '01700000000',
      guardianRelation: 'Father',
      fatherName: newStdGuardian || 'পিতা',
      motherName: 'মাতা',
      address: newStdAddress || activeInstitution.address,
      emergencyContact: newStdPhone || '01700000000',
      attendanceRate: 98.0,
      feeStatus: 'paid',
      gpa: 5.0,
      status: 'active',
      admissionDate: new Date().toISOString().slice(0, 10)
    });

    setIsAddStudentOpen(false);
    setNewStdName('');
    setNewStdId('');
  };

  // Handle Add Teacher
  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTchName) return;

    addTeacher({
      employeeId: newTchId || `TCH-${Math.floor(100 + Math.random() * 900)}`,
      fullName: newTchName,
      fullNameBn: newTchNameBn || newTchName,
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      designation: newTchDesig,
      designationBn: newTchDesigBn,
      department: newTchDept,
      qualification: 'M.Sc / M.A, B.Ed',
      joiningDate: new Date().toISOString().slice(0, 10),
      phone: newTchPhone || '01700000000',
      email: 'teacher@school.edu.bd',
      address: activeInstitution.address,
      salary: Number(newTchSalary) || 35000,
      assignedClasses: ['Class 8', 'Class 9'],
      assignedSubjects: ['Mathematics', 'Science'],
      attendanceRate: 99.0,
      status: 'active'
    });

    setIsAddTeacherOpen(false);
    setNewTchName('');
  };

  // Handle Mark Daily Attendance
  const handleSaveAttendance = () => {
    const records = students.map((s) => ({
      date: attendanceDate,
      targetType: 'student' as const,
      targetId: s.id,
      targetName: s.fullName,
      classId: s.classId,
      section: s.section,
      status: 'present' as const,
      inTime: '08:30 AM'
    }));
    markAttendance(records);
    setAttendanceSuccess(true);
    setTimeout(() => setAttendanceSuccess(false), 3000);
  };

  // Handle Bulk SMS Send
  const handleSendBulkSms = () => {
    const res = sendBulkSms(smsTarget, smsMessage);
    setSmsAlertSuccess(`সফলভাবে ${res.count} টি অভিভাবক ও শিক্ষার্থীর নম্বরে SMS প্রেরণ করা হয়েছে।`);
    setTimeout(() => setSmsAlertSuccess(null), 4000);
  };

  const filteredStudents = (students || []).filter((s) => {
    if (!s) return false;
    const matchesSearch =
      (s.fullName && s.fullName.toLowerCase().includes(studentSearch.toLowerCase())) ||
      (s.fullNameBn && s.fullNameBn.includes(studentSearch)) ||
      (s.studentId && s.studentId.includes(studentSearch));
    const matchesClass = selectedClassFilter === 'all' || s.className === selectedClassFilter;
    return matchesSearch && matchesClass;
  });

  const totalFeeCollected = (fees || [])
    .filter((f) => f && f.status === 'paid')
    .reduce((acc, f) => acc + (f.paidAmount || f.netAmount || 0), 0);

  const totalFeeDue = (fees || [])
    .filter((f) => f && f.status !== 'paid')
    .reduce((acc, f) => acc + ((f.netAmount || 0) - (f.paidAmount || 0)), 0);

  return (
    <div className="space-y-6">
      {/* Institution Header Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={activeInstitution.logo}
            alt="Logo"
            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {activeInstitution.type.toUpperCase()}
              </span>
              <span className="text-xs text-slate-500 font-mono font-bold">{activeInstitution.code}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {activeInstitution.nameBn}
            </h2>
            <p className="text-xs text-slate-500">{activeInstitution.address}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('students')}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>নতুন শিক্ষার্থী ভর্তি</span>
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>ফি কালেকশন</span>
          </button>
        </div>
      </div>

      {/* Navigation Pills Carousel */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
        {[
          { id: 'dashboard', label: '📊 ড্যাশবোর্ড' },
          { id: 'students', label: '🎓 শিক্ষার্থী' },
          { id: 'admissions', label: '📝 ভর্তি আবেদন' },
          { id: 'teachers', label: '👨‍🏫 শিক্ষকমণ্ডলী' },
          { id: 'classes', label: '🏫 শ্রেণি ও বিষয়' },
          { id: 'attendance', label: '📅 দৈনিক হাজিরা' },
          { id: 'routine', label: '⏰ ক্লাস রুটিন' },
          { id: 'exams', label: '📑 পরীক্ষা' },
          { id: 'results', label: '🏆 রেজাল্ট ও গ্রেডিং' },
          { id: 'fees', label: '💳 ফি ও ইনভয়েস' },
          { id: 'accounting', label: '💰 আয়-ব্যয় হিসাব' },
          { id: 'payroll', label: '💵 বেতন ও পে-রোল' },
          { id: 'leave', label: '🏖️ ছুটি আবেদন' },
          { id: 'library', label: '📚 লাইব্রেরি' },
          { id: 'transport', label: '🚌 পরিবহন' },
          { id: 'hostel', label: '🏢 হোস্টেল' },
          { id: 'inventory', label: '📦 ইনভেন্টরি' },
          { id: 'homework', label: '📖 হোমওয়ার্ক' },
          { id: 'certificates', label: '📜 সার্টিফিকেট' },
          { id: 'idcards', label: '🪪 আইডি কার্ড' },
          { id: 'notices', label: '📢 নোটিশ' },
          { id: 'webbuilder', label: '🌐 ওয়েবসাইট বিল্ডার' },
          { id: 'sms', label: '✉️ বাল্ক SMS' },
          { id: 'settings', label: '⚙️ সেটিংস' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. TAB: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{students.length} জন</div>
                <div className="text-xs text-slate-500 font-semibold">মোট ছাত্র-ছাত্রী</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{teachers.length} জন</div>
                <div className="text-xs text-slate-500 font-semibold">শিক্ষক ও উস্তাদ</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">৳ {(totalFeeCollected || 0).toLocaleString()}</div>
                <div className="text-xs text-slate-500 font-semibold">আদায়কৃত মোট ফি</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">৳ {(totalFeeDue || 0).toLocaleString()}</div>
                <div className="text-xs text-slate-500 font-semibold">বকেয়া ফি</div>
              </div>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setActiveTab('attendance')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 cursor-pointer transition shadow-sm space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">দৈনিক ডিজিটাল হাজিরা</h3>
              <p className="text-xs text-slate-500">
                শ্রেণি নির্বাচন করে এক ক্লিকে ছাত্র-ছাত্রীদের হাজিরা শিট তৈরি ও এসএমএস অ্যালার্ট পাঠান।
              </p>
            </div>

            <div
              onClick={() => setActiveTab('results')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-500 cursor-pointer transition shadow-sm space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">পরীক্ষার নম্বর ও জিপিএ কার্ড</h3>
              <p className="text-xs text-slate-500">
                নম্বর এন্ট্রি করে অটোমেটিক মেধা তালিকা ও অফিসিয়াল গ্রেড মার্কশিট প্রিন্ট করুন।
              </p>
            </div>

            <div
              onClick={() => setActiveTab('sms')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-500 cursor-pointer transition shadow-sm space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">অভিভাবকদের বাল্ক SMS</h3>
              <p className="text-xs text-slate-500">
                ছুটি, ফি বকেয়া বা জরুরি নোটিশ তাৎক্ষণিক সকল অভিভাবকের ফোনে সরাসরি পাঠান।
              </p>
            </div>
          </div>

          {/* Recent Student Admissions & Fees */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-900 text-sm">সাম্প্রতিক ভর্তি আবেদন</h4>
                <button
                  onClick={() => setActiveTab('admissions')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  সবগুলো ({admissions.length})
                </button>
              </div>

              <div className="space-y-2.5">
                {admissions.slice(0, 3).map((adm) => (
                  <div
                    key={adm.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{adm.applicantName}</div>
                      <div className="text-slate-500 font-mono">{adm.applicationNo} • {adm.appliedClass}</div>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {adm.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-900 text-sm">সর্বশেষ ফি আদায় ভাউচার</h4>
                <button
                  onClick={() => setActiveTab('fees')}
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  সবগুলো
                </button>
              </div>

              <div className="space-y-2.5">
                {fees.slice(0, 3).map((f) => (
                  <div
                    key={f.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{f.studentName} (রোল {f.studentRoll})</div>
                      <div className="text-slate-500 font-mono">৳ {f.netAmount} • {f.feeType}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        f.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {f.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB: STUDENTS */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="নাম বা রোল দিয়ে খুঁজুন..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
              >
                <option value="all">সকল শ্রেণি</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.nameBn}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsAddStudentOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>নতুন শিক্ষার্থী</span>
              </button>
            </div>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-y border-slate-200">
                <tr>
                  <th className="p-3">শিক্ষার্থী তথ্য</th>
                  <th className="p-3">রোল ও শ্রেণি</th>
                  <th className="p-3">রক্তের গ্রুপ</th>
                  <th className="p-3">অভিভাবক ও ফোন</th>
                  <th className="p-3">উপস্থিতি ও ফি</th>
                  <th className="p-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={std.photo}
                          alt={std.fullName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{std.fullNameBn}</div>
                          <div className="text-[11px] text-slate-500">{std.fullName}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 font-semibold text-slate-800">
                      <div className="font-mono font-bold text-blue-700 text-sm">রোল: {std.studentId}</div>
                      <div className="text-[11px] text-slate-500">{std.className} ({std.section})</div>
                    </td>

                    <td className="p-3 font-bold text-rose-700 font-mono">
                      {std.bloodGroup}
                    </td>

                    <td className="p-3 text-slate-600">
                      <div>{std.guardianName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{std.guardianPhone}</div>
                    </td>

                    <td className="p-3">
                      <div className="text-emerald-700 font-bold">{std.attendanceRate}% উপস্থিতি</div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.2 rounded uppercase ${
                          std.feeStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {std.feeStatus}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setIdCardPreviewStudent(std)}
                          className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[11px] font-bold"
                          title="আইডি কার্ড"
                        >
                          আইডি কার্ড
                        </button>
                        <button
                          onClick={() => setCertificateStudent({ student: std, type: 'প্রশংসাপত্র' })}
                          className="p-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-[11px] font-bold"
                          title="সার্টিফিকেট"
                        >
                          সার্টিফিকেট
                        </button>
                        <button
                          onClick={() => deleteStudent(std.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-[11px] font-bold"
                          title="মুছুন"
                        >
                          মুছুন
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. TAB: ADMISSIONS */}
      {activeTab === 'admissions' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">অনলাইন ভর্তি আবেদন তালিকা</h3>
              <p className="text-xs text-slate-500">ওয়েবসাইট থেকে প্রাপ্ত নতুন আবেদনসমূহ যাচাই ও এনরোলমেন্ট</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-y border-slate-200">
                <tr>
                  <th className="p-3">আবেদন নম্বর</th>
                  <th className="p-3">আবেদনকারী</th>
                  <th className="p-3">শ্রেণি</th>
                  <th className="p-3">অভিভাবক ও ফোন</th>
                  <th className="p-3">তারিখ</th>
                  <th className="p-3">ফি ও পেমেন্ট মেথড</th>
                  <th className="p-3">স্ট্যাটাস</th>
                  <th className="p-3 text-right">সিদ্ধান্ত</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admissions.map((adm) => (
                  <tr key={adm.id}>
                    <td className="p-3 font-mono font-bold text-blue-700">{adm.applicationNo}</td>
                    <td className="p-3 font-bold text-slate-900">{adm.applicantName}</td>
                    <td className="p-3 text-slate-700 font-semibold">{adm.appliedClass}</td>
                    <td className="p-3 text-slate-600">
                      <div>{adm.guardianName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{adm.applicantPhone}</div>
                    </td>
                    <td className="p-3 text-slate-500 font-mono">{adm.appliedDate}</td>
                    <td className="p-3">
                      {adm.admissionFeeStatus === 'free' || adm.paymentMethod === 'free' ? (
                        <div>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                            ১০০% ফ্রি
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5">আবেদন ফি: ৳০</div>
                        </div>
                      ) : (
                        <div>
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            {adm.paymentMethod || 'bKash'} (৳{adm.feeAmount || 300})
                          </span>
                          {adm.trxId && (
                            <div className="text-[10px] text-slate-500 font-mono font-bold mt-0.5">
                              TrxID: {adm.trxId}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          adm.status === 'admitted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : adm.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {adm.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => updateAdmissionStatus(adm.id, 'admitted')}
                          className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded font-bold text-[11px]"
                        >
                          অনুমোদন
                        </button>
                        <button
                          onClick={() => updateAdmissionStatus(adm.id, 'rejected')}
                          className="px-2 py-1 bg-rose-100 text-rose-800 rounded font-bold text-[11px]"
                        >
                          বাতিল
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TAB: TEACHERS */}
      {activeTab === 'teachers' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">শিক্ষক ও স্টাফ ডিরেক্টরি</h3>
              <p className="text-xs text-slate-500">অনুষদ সদস্য, পদবি ও দায়িত্ব বণ্টন</p>
            </div>
            <button
              onClick={() => setIsAddTeacherOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>নতুন শিক্ষক যুক্ত করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {teachers.map((tch) => (
              <div key={tch.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                <img
                  src={tch.photo}
                  alt={tch.fullName}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-slate-900 truncate">{tch.fullNameBn}</div>
                  <div className="text-xs text-emerald-700 font-semibold">{tch.designationBn}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{tch.phone}</div>
                  <div className="text-[10px] text-slate-400">বেতন: ৳ {(tch.salary || 0).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 max-w-3xl">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base">দৈনিক হাজিরা গ্রহণ ও SMS প্রেরণ</h3>
            <p className="text-xs text-slate-500">তারিখ ও শ্রেণি নির্বাচন করে তাৎক্ষণিক হাজিরা সংরক্ষণ করুন</p>
          </div>

          {attendanceSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>আজকের হাজিরা সফলভাবে সংরক্ষিত হয়েছে এবং অনুপস্থিত অভিভাবকদের এসএমএস পাঠানো হয়েছে।</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">তারিখ</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">শ্রেণি নির্বাচন</label>
              <select
                value={attClassId}
                onChange={(e) => setAttClassId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameBn} ({c.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-y border-slate-200">
                <tr>
                  <th className="p-2.5">রোল</th>
                  <th className="p-2.5">শিক্ষার্থীর নাম</th>
                  <th className="p-2.5">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="p-2.5 font-mono font-bold text-slate-900">{s.studentId}</td>
                    <td className="p-2.5 font-bold text-slate-800">{s.fullNameBn}</td>
                    <td className="p-2.5">
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">উপস্থিত</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">অনুপস্থিত</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">ছুটি</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleSaveAttendance}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-md"
          >
            <CheckCircle className="w-4 h-4" />
            <span>আজকের হাজিরা সংরক্ষণ করুন</span>
          </button>
        </div>
      )}

      {/* 6. TAB: ROUTINE */}
      {activeTab === 'routine' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">সাপ্তাহিক ক্লাস রুটিন ২০২৬</h3>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>রুটিন প্রিন্ট</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">পিরিয়ড</th>
                  <th className="p-3">সময়</th>
                  <th className="p-3">বিষয়</th>
                  <th className="p-3">শিক্ষক</th>
                  <th className="p-3">রুম নং</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(routines[0]?.periods || []).map((p) => (
                  <tr key={p.id}>
                    <td className="p-3 font-bold font-mono text-blue-700">পিরিয়ড #{p.periodNo}</td>
                    <td className="p-3 text-slate-600 font-mono">{p.timeSlot}</td>
                    <td className="p-3 font-bold text-slate-900">{p.subjectName}</td>
                    <td className="p-3 text-slate-700">{p.teacherName}</td>
                    <td className="p-3 font-mono font-bold text-slate-600">{p.roomNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. TAB: RESULTS & GPA */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">পরীক্ষার ফলাফল ও গ্রেডিং শিট</h3>
              <p className="text-xs text-slate-500">নম্বর এন্ট্রি ও স্বয়ংক্রিয় জিপিএ মার্কশিট</p>
            </div>
            <button
              onClick={() => alert('নম্বর এন্ট্রি শিট ওপেন করা হয়েছে।')}
              className="bg-blue-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl"
            >
              + নতুন নম্বর এন্ট্রি
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-y border-slate-200">
                <tr>
                  <th className="p-3">রোল</th>
                  <th className="p-3">শিক্ষার্থীর নাম</th>
                  <th className="p-3">পরীক্ষা</th>
                  <th className="p-3">মোট নম্বর</th>
                  <th className="p-3">জিপিএ ও গ্রেড</th>
                  <th className="p-3">মেধাক্রম</th>
                  <th className="p-3 text-right">মার্কশিট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((res) => (
                  <tr key={res.id}>
                    <td className="p-3 font-mono font-bold text-blue-700">{res.studentRoll}</td>
                    <td className="p-3 font-bold text-slate-900">{res.studentName}</td>
                    <td className="p-3 text-slate-600">{res.examName}</td>
                    <td className="p-3 font-mono font-bold text-slate-800">{res.totalMarks}</td>
                    <td className="p-3 font-mono font-black text-emerald-700">
                      GPA: {res.gpa.toFixed(2)} ({res.grade})
                    </td>
                    <td className="p-3 font-bold text-purple-700">{res.positionInClass}ম</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => window.print()}
                        className="px-2.5 py-1 bg-slate-900 text-white rounded text-[10px] font-bold"
                      >
                        প্রিন্ট মার্কশিট
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. TAB: FEES */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">ফি কালেকশন ও ইনভয়েস</h3>
              <p className="text-xs text-slate-500">মাসিক বেতন, ভর্তি ও পরীক্ষার ফি ট্র্যাকার</p>
            </div>
            <button
              onClick={() => {
                createFeeInvoice({
                  studentId: students[0]?.id || 'std_101',
                  studentRoll: '101',
                  studentName: 'তাহসিন আল মাহমুদ',
                  className: 'Class 8',
                  feeType: 'tuition',
                  monthYear: 'September 2026',
                  amount: 1500,
                  discount: 0,
                  fine: 0,
                  netAmount: 1500,
                  paidAmount: 0,
                  status: 'unpaid'
                });
              }}
              className="bg-emerald-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl"
            >
              + নতুন ইনভয়েস তৈরি
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-y border-slate-200">
                <tr>
                  <th className="p-3">ইনভয়েস নং</th>
                  <th className="p-3">শিক্ষার্থী ও রোল</th>
                  <th className="p-3">ফি বিবরণ</th>
                  <th className="p-3">মোট টাকা</th>
                  <th className="p-3">স্ট্যাটাস ও মেথড</th>
                  <th className="p-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fees.map((inv) => (
                  <tr key={inv.id}>
                    <td className="p-3 font-mono font-bold text-slate-900">{inv.invoiceNo}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{inv.studentName}</div>
                      <div className="text-[11px] text-slate-500">রোল: {inv.studentRoll}</div>
                    </td>
                    <td className="p-3 text-slate-600">{inv.feeType} ({inv.monthYear})</td>
                    <td className="p-3 font-mono font-bold text-slate-900">৳ {inv.netAmount}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                      {inv.paymentMethod && (
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{inv.paymentMethod}</div>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {inv.status !== 'paid' ? (
                        <button
                          onClick={() => {
                            setSelectedFeeForPayment(inv);
                            setIsCollectFeeModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold"
                        >
                          ফি গ্রহণ
                        </button>
                      ) : (
                        <button
                          onClick={() => setReceiptInvoice(inv)}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-[11px] font-bold"
                        >
                          রসিদ প্রিন্ট
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 9. TAB: ACCOUNTING */}
      {activeTab === 'accounting' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">প্রতিষ্ঠানের আয় ও ব্যয় হিসাব</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-y border-slate-200">
                <tr>
                  <th className="p-3">ভাউচার নং</th>
                  <th className="p-3">ধরন</th>
                  <th className="p-3">খাত / বিবরণ</th>
                  <th className="p-3">পরিমাণ (BDT)</th>
                  <th className="p-3">তারিখ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td className="p-3 font-mono font-bold text-slate-700">{t.receiptVoucherNo}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          t.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-800 font-semibold">{t.category} - {t.description}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">৳ {(t.amount || 0).toLocaleString()}</td>
                    <td className="p-3 text-slate-500 font-mono">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 10. TAB: SMS GATEWAY */}
      {activeTab === 'sms' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 max-w-2xl">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base">বাল্ক SMS নোটিফিকেশন সেন্টার</h3>
            <p className="text-xs text-slate-500">অভিভাবক ও শিক্ষকদের মোবাইলে সরাসরি বাংলা এসএমএস পাঠান</p>
          </div>

          {smsAlertSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-300 text-xs font-bold">
              {smsAlertSuccess}
            </div>
          )}

          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">প্রাপক নির্বাচন করুন</label>
              <select
                value={smsTarget}
                onChange={(e) => setSmsTarget(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
              >
                <option value="all_students">সকল শিক্ষার্থীর অভিভাবক ({students.length} জন)</option>
                <option value="due_students">বকেয়া ফি রয়েছে এমন অভিভাবক</option>
                <option value="teachers">সকল সম্মানিত শিক্ষকবৃন্দ ({teachers.length} জন)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">এসএমএস বার্তা (বাংলা / ইংরেজি)</label>
              <textarea
                rows={4}
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>দৈর্ঘ্য: {smsMessage.length} অক্ষর (১ SMS)</span>
                <span>অবশিষ্ট ব্যালেন্স: {smsConfig.balanceRemaining} SMS</span>
              </div>
            </div>

            <button
              onClick={handleSendBulkSms}
              className="w-full bg-purple-700 hover:bg-purple-600 text-white font-bold py-3 rounded-xl shadow-lg transition text-sm flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>তাৎক্ষণিক SMS প্রেরণ করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* 11. TAB: WEBSITE BUILDER */}
      {activeTab === 'webbuilder' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 max-w-3xl">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base">ড্র্যাগ অ্যান্ড ড্রপ ওয়েবসাইট বিল্ডার ও থিম</h3>
            <p className="text-xs text-slate-500">আপনার স্কুলের পাবলিক ওয়েবসাইটের কালার, ফন্ট ও স্লাইডার পরিবর্তন করুন</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">প্রাইমারি থিম কালার</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={activeInstitution.theme?.primaryColor || '#1e3a8a'}
                  onChange={(e) => updateWebsiteSettings({ primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
                />
                <span className="font-mono font-bold text-slate-800">
                  {activeInstitution.theme?.primaryColor || '#1e3a8a'}
                </span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ফন্ট স্টাইল</label>
              <select
                value={activeInstitution.theme?.fontFamily || 'Hind Siliguri'}
                onChange={(e) => updateWebsiteSettings({ fontFamily: e.target.value as any })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              >
                <option value="Hind Siliguri">Hind Siliguri (বাংলা স্ট্যান্ডার্ড)</option>
                <option value="Kalpurush">Kalpurush (মাদ্রাসার জন্য উপযুক্ত)</option>
                <option value="Poppins">Poppins (আধুনিক)</option>
                <option value="Inter">Inter (ক্লিন)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">অধ্যক্ষের বাণী</label>
              <textarea
                rows={3}
                value={activeInstitution.principalMessage}
                onChange={(e) => updateWebsiteSettings({}, undefined)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD STUDENT */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl space-y-4 my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">নতুন শিক্ষার্থী ভর্তি ফরম</h3>
              <button onClick={() => setIsAddStudentOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">রোল নম্বর *</label>
                  <input
                    type="text"
                    required
                    placeholder="উদা: 105"
                    value={newStdId}
                    onChange={(e) => setNewStdId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">শ্রেণি *</label>
                  <select
                    value={newStdClass}
                    onChange={(e) => setNewStdClass(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.nameBn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">শিক্ষার্থীর নাম (বাংলায়) *</label>
                <input
                  type="text"
                  required
                  placeholder="উদা: তানভীর হাসান"
                  value={newStdNameBn}
                  onChange={(e) => setNewStdNameBn(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Name (in English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Hasan"
                  value={newStdName}
                  onChange={(e) => setNewStdName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">অভিভাবকের নাম</label>
                  <input
                    type="text"
                    placeholder="পিতার নাম"
                    value={newStdGuardian}
                    onChange={(e) => setNewStdGuardian(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">অভিভাবকের মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={newStdPhone}
                    onChange={(e) => setNewStdPhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl shadow transition"
              >
                শিক্ষার্থী সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TEACHER */}
      {isAddTeacherOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">নতুন শিক্ষক যুক্ত করুন</h3>
              <button onClick={() => setIsAddTeacherOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">শিক্ষকের নাম (বাংলায়) *</label>
                <input
                  type="text"
                  required
                  placeholder="উদা: ড. মাহবুবুর রহমান"
                  value={newTchNameBn}
                  onChange={(e) => setNewTchNameBn(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Name (English)</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Mahbubur Rahman"
                  value={newTchName}
                  onChange={(e) => setNewTchName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">পদবি</label>
                  <input
                    type="text"
                    value={newTchDesigBn}
                    onChange={(e) => setNewTchDesigBn(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">মাসিক বেতন</label>
                  <input
                    type="number"
                    value={newTchSalary}
                    onChange={(e) => setNewTchSalary(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl transition"
              >
                শিক্ষক ডাটাবেজে সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ID CARD PREVIEW */}
      {idCardPreviewStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 text-center">
            <div className="border-4 border-blue-900 rounded-2xl p-5 bg-gradient-to-b from-blue-50 via-white to-slate-50 space-y-3 shadow-inner">
              <div className="text-xs font-black text-blue-950 uppercase">{activeInstitution.nameBn}</div>
              <div className="text-[10px] text-slate-500 font-bold">STUDENT IDENTITY CARD</div>

              <img
                src={idCardPreviewStudent.photo}
                alt="Student"
                className="w-20 h-20 rounded-xl object-cover mx-auto border-2 border-blue-900 shadow"
              />

              <div className="space-y-0.5">
                <div className="font-black text-sm text-slate-900">{idCardPreviewStudent.fullNameBn}</div>
                <div className="text-xs font-bold text-blue-700">রোল: {idCardPreviewStudent.studentId}</div>
                <div className="text-[11px] text-slate-600">{idCardPreviewStudent.className} ({idCardPreviewStudent.section})</div>
                <div className="text-[10px] text-rose-700 font-bold">Blood Group: {idCardPreviewStudent.bloodGroup}</div>
              </div>

              <div className="pt-2 flex justify-center">
                <div className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center rounded-lg">
                  <QrCode className="w-12 h-12" />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-slate-900 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" /> প্রিন্ট আইডি কার্ড
              </button>
              <button
                onClick={() => setIdCardPreviewStudent(null)}
                className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs"
              >
                বন্ধ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FEE PAYMENT COLLECTION */}
      {isCollectFeeModalOpen && selectedFeeForPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">ফি আদায় রসিদ গ্রহণ</h3>
            <div className="p-3 bg-slate-50 rounded-xl border text-xs space-y-1">
              <div>শিক্ষার্থী: <b>{selectedFeeForPayment.studentName}</b></div>
              <div>রোল: <b>{selectedFeeForPayment.studentRoll}</b></div>
              <div className="text-emerald-700 font-bold text-sm">পরিমাণ: ৳ {selectedFeeForPayment.netAmount}</div>
            </div>

            <button
              onClick={() => {
                payFeeInvoice(selectedFeeForPayment.id, 'Cash');
                setIsCollectFeeModalOpen(false);
              }}
              className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs"
            >
              ক্যাশ পেমেন্ট নিশ্চিত করুন
            </button>
            <button
              onClick={() => setIsCollectFeeModalOpen(false)}
              className="w-full bg-slate-100 text-slate-600 font-bold py-2 rounded-xl text-xs"
            >
              বাতিল
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
