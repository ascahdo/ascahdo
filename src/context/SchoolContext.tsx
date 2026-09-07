import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TenantInstitution,
  SubscriptionPlan,
  UserRole,
  Student,
  Teacher,
  Staff,
  ClassInfo,
  Subject,
  AttendanceRecord,
  ClassRoutine,
  Exam,
  StudentResult,
  FeeInvoice,
  AccountTransaction,
  PayrollRecord,
  LeaveApplication,
  Notice,
  NewsEvent,
  GalleryItem,
  LibraryBook,
  TransportVehicle,
  HostelRoom,
  InventoryItem,
  Homework,
  CertificateRequest,
  OnlineAdmission,
  AuditLog,
  SmsGatewayConfig
} from '../types/schoolTypes';

import {
  INITIAL_INSTITUTIONS,
  INITIAL_SUBSCRIPTION_PLANS,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_STAFF,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_ROUTINE,
  INITIAL_EXAMS,
  INITIAL_RESULTS,
  INITIAL_FEES,
  INITIAL_TRANSACTIONS,
  INITIAL_PAYROLL,
  INITIAL_LEAVES,
  INITIAL_NOTICES,
  INITIAL_NEWS_EVENTS,
  INITIAL_GALLERY,
  INITIAL_BOOKS,
  INITIAL_VEHICLES,
  INITIAL_HOSTEL,
  INITIAL_INVENTORY,
  INITIAL_HOMEWORK,
  INITIAL_ADMISSIONS,
  INITIAL_AUDIT_LOGS
} from '../data/schoolData';

export type SchoolAppViewMode =
  | 'public_website'
  | 'super_admin'
  | 'institution_admin'
  | 'teacher_portal'
  | 'student_portal'
  | 'guardian_portal';

interface SchoolContextType {
  // Multitenancy & Navigation
  institutions: TenantInstitution[];
  activeInstitutionId: string;
  activeInstitution: TenantInstitution;
  setActiveInstitutionId: (id: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  viewMode: SchoolAppViewMode;
  setViewMode: (mode: SchoolAppViewMode) => void;
  
  // Super Admin CRUD
  subscriptionPlans: SubscriptionPlan[];
  addInstitution: (inst: Partial<TenantInstitution>) => void;
  updateInstitution: (id: string, updates: Partial<TenantInstitution>) => void;
  deleteInstitution: (id: string) => void;
  toggleInstitutionStatus: (id: string, status: 'active' | 'pending' | 'suspended') => void;

  // Tenant-Scoped Data
  students: Student[];
  teachers: Teacher[];
  staff: Staff[];
  classes: ClassInfo[];
  subjects: Subject[];
  attendanceRecords: AttendanceRecord[];
  routines: ClassRoutine[];
  exams: Exam[];
  results: StudentResult[];
  fees: FeeInvoice[];
  transactions: AccountTransaction[];
  payroll: PayrollRecord[];
  leaves: LeaveApplication[];
  notices: Notice[];
  newsEvents: NewsEvent[];
  gallery: GalleryItem[];
  books: LibraryBook[];
  vehicles: TransportVehicle[];
  hostelRooms: HostelRoom[];
  inventory: InventoryItem[];
  homeworks: Homework[];
  certificates: CertificateRequest[];
  admissions: OnlineAdmission[];
  auditLogs: AuditLog[];
  smsConfig: SmsGatewayConfig;

  // Actions
  addStudent: (std: Omit<Student, 'id' | 'tenantId'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  addTeacher: (tch: Omit<Teacher, 'id' | 'tenantId'>) => void;
  updateTeacher: (id: string, updates: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  markAttendance: (records: Omit<AttendanceRecord, 'id' | 'tenantId'>[]) => void;
  addClass: (cls: Omit<ClassInfo, 'id' | 'tenantId'>) => void;
  addSubject: (sub: Omit<Subject, 'id' | 'tenantId'>) => void;
  addExam: (ex: Omit<Exam, 'id' | 'tenantId'>) => void;
  publishResult: (res: Omit<StudentResult, 'id' | 'tenantId'>) => void;

  createFeeInvoice: (inv: Omit<FeeInvoice, 'id' | 'tenantId' | 'invoiceNo'>) => void;
  payFeeInvoice: (invoiceId: string, method: 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Cash', trxId?: string) => void;

  addTransaction: (txn: Omit<AccountTransaction, 'id' | 'tenantId'>) => void;
  processPayroll: (record: Omit<PayrollRecord, 'id' | 'tenantId'>) => void;

  applyLeave: (leave: Omit<LeaveApplication, 'id' | 'tenantId'>) => void;
  updateLeaveStatus: (id: string, status: 'approved' | 'rejected') => void;

  addNotice: (notice: Omit<Notice, 'id' | 'tenantId'>) => void;
  addNewsEvent: (item: Omit<NewsEvent, 'id' | 'tenantId'>) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'tenantId'>) => void;
  addBook: (bk: Omit<LibraryBook, 'id' | 'tenantId'>) => void;
  addVehicle: (vh: Omit<TransportVehicle, 'id' | 'tenantId'>) => void;
  addHostelRoom: (rm: Omit<HostelRoom, 'id' | 'tenantId'>) => void;
  addInventoryItem: (inv: Omit<InventoryItem, 'id' | 'tenantId'>) => void;
  addHomework: (hw: Omit<Homework, 'id' | 'tenantId'>) => void;

  submitOnlineAdmission: (adm: Omit<OnlineAdmission, 'id' | 'tenantId' | 'applicationNo'>) => void;
  updateAdmissionStatus: (id: string, status: OnlineAdmission['status']) => void;

  updateWebsiteSettings: (themeUpdates: Partial<TenantInstitution['theme']>, navUpdates?: TenantInstitution['navMenus']) => void;
  sendBulkSms: (recipientType: string, message: string) => { success: boolean; count: number };
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [institutions, setInstitutions] = useState<TenantInstitution[]>(() => {
    const saved = localStorage.getItem('ascahdo_school_institutions');
    return saved ? JSON.parse(saved) : INITIAL_INSTITUTIONS;
  });

  const [activeInstitutionId, setActiveInstitutionId] = useState<string>(() => {
    return localStorage.getItem('ascahdo_active_institution') || INITIAL_INSTITUTIONS[0].id;
  });

  const [userRole, setUserRole] = useState<UserRole>('institution_admin');
  const [viewMode, setViewMode] = useState<SchoolAppViewMode>('institution_admin');

  const [subscriptionPlans] = useState<SubscriptionPlan[]>(INITIAL_SUBSCRIPTION_PLANS);
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('ascahdo_school_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('ascahdo_school_teachers');
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });
  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem('ascahdo_school_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });
  const [classes, setClasses] = useState<ClassInfo[]>(() => {
    const saved = localStorage.getItem('ascahdo_school_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('ascahdo_school_subjects');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [routines, setRoutines] = useState<ClassRoutine[]>(INITIAL_ROUTINE);
  const [exams, setExams] = useState<Exam[]>(INITIAL_EXAMS);
  const [results, setResults] = useState<StudentResult[]>(INITIAL_RESULTS);
  const [fees, setFees] = useState<FeeInvoice[]>(() => {
    const saved = localStorage.getItem('ascahdo_school_fees');
    return saved ? JSON.parse(saved) : INITIAL_FEES;
  });
  const [transactions, setTransactions] = useState<AccountTransaction[]>(INITIAL_TRANSACTIONS);
  const [payroll, setPayroll] = useState<PayrollRecord[]>(INITIAL_PAYROLL);
  const [leaves, setLeaves] = useState<LeaveApplication[]>(INITIAL_LEAVES);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>(INITIAL_NEWS_EVENTS);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [books, setBooks] = useState<LibraryBook[]>(INITIAL_BOOKS);
  const [vehicles, setVehicles] = useState<TransportVehicle[]>(INITIAL_VEHICLES);
  const [hostelRooms, setHostelRooms] = useState<HostelRoom[]>(INITIAL_HOSTEL);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [homeworks, setHomeworks] = useState<Homework[]>(INITIAL_HOMEWORK);
  const [certificates, setCertificates] = useState<CertificateRequest[]>([]);
  const [admissions, setAdmissions] = useState<OnlineAdmission[]>(INITIAL_ADMISSIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  const [smsConfig, setSmsConfig] = useState<SmsGatewayConfig>({
    provider: 'BulkSMSBD',
    senderId: 'ASCAHDO_EDU',
    apiKey: 'bk_live_secret_key_88992',
    balanceRemaining: 4850,
    autoSmsOnAttendance: true,
    autoSmsOnFeePayment: true,
    autoSmsOnResultPublish: true
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ascahdo_school_institutions', JSON.stringify(institutions));
  }, [institutions]);

  useEffect(() => {
    localStorage.setItem('ascahdo_active_institution', activeInstitutionId);
  }, [activeInstitutionId]);

  useEffect(() => {
    localStorage.setItem('ascahdo_school_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('ascahdo_school_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('ascahdo_school_fees', JSON.stringify(fees));
  }, [fees]);

  const activeInstitution =
    institutions.find(inst => inst.id === activeInstitutionId) || institutions[0] || INITIAL_INSTITUTIONS[0];

  // Helper audit logger
  const logAction = (action: string, target: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      tenantId: activeInstitutionId,
      institutionName: activeInstitution.name,
      actorName: userRole === 'super_admin' ? 'Super Admin' : activeInstitution.principalName || 'Institution Admin',
      role: userRole,
      action,
      target,
      timestamp: new Date().toLocaleString(),
      ipAddress: '103.230.104.55'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Institution Management
  const addInstitution = (inst: Partial<TenantInstitution>) => {
    const id = `tenant_${Date.now()}`;
    const newInst: TenantInstitution = {
      id,
      name: inst.name || 'New Academy',
      nameBn: inst.nameBn || 'নতুন শিক্ষাঙ্গন',
      code: inst.code || `EIIN: ${Math.floor(100000 + Math.random() * 900000)}`,
      type: inst.type || 'school',
      subdomain: inst.subdomain || `school-${Date.now()}`,
      logo: inst.logo || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80',
      establishedYear: inst.establishedYear || new Date().getFullYear(),
      phone: inst.phone || '01800000000',
      email: inst.email || 'info@school.edu.bd',
      address: inst.address || 'ঢাকা, বাংলাদেশ',
      division: inst.division || 'ঢাকা',
      district: inst.district || 'ঢাকা',
      upazila: inst.upazila || 'সদর',
      principalName: inst.principalName || 'প্রধান শিক্ষক',
      principalMessage: inst.principalMessage || 'আমাদের প্রতিষ্ঠানে স্বাগতম।',
      status: 'active',
      subscriptionPlanId: inst.subscriptionPlanId || 'plan_standard',
      subscriptionExpiry: '2027-12-31',
      theme: {
        themeId: 'modern-emerald',
        primaryColor: '#059669',
        accentColor: '#d97706',
        fontFamily: 'Hind Siliguri',
        headerStyle: 'standard',
        footerStyle: 'detailed',
        bannerSliderImages: ['https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&auto=format&fit=crop&q=80']
      },
      navMenus: [
        { id: 'm1', label: 'Home', labelBn: 'মূলপাতা', url: '#home', order: 1 },
        { id: 'm2', label: 'About', labelBn: 'পরিচিতি', url: '#about', order: 2 },
        { id: 'm3', label: 'Teachers', labelBn: 'শিক্ষক', url: '#teachers', order: 3 },
        { id: 'm4', label: 'Admission', labelBn: 'ভর্তি', url: '#admission', order: 4 },
        { id: 'm5', label: 'Results', labelBn: 'ফলাফল', url: '#results', order: 5 },
        { id: 'm6', label: 'Notice', labelBn: 'নোটিশ', url: '#notices', order: 6 }
      ],
      customPages: [],
      seo: {
        metaTitle: inst.name || 'New Academy',
        metaDescription: 'Modern digital educational institution',
        keywords: 'school, education, online result'
      },
      stats: {
        totalStudents: 0,
        totalTeachers: 0,
        totalStaff: 0,
        passingRate: 100
      }
    };
    setInstitutions(prev => [...prev, newInst]);
    logAction('Created New Institution', newInst.name);
  };

  const updateInstitution = (id: string, updates: Partial<TenantInstitution>) => {
    setInstitutions(prev => prev.map(inst => (inst.id === id ? { ...inst, ...updates } : inst)));
    logAction('Updated Institution Details', updates.name || id);
  };

  const deleteInstitution = (id: string) => {
    setInstitutions(prev => prev.filter(inst => inst.id !== id));
    logAction('Deleted Institution', id);
  };

  const toggleInstitutionStatus = (id: string, status: 'active' | 'pending' | 'suspended') => {
    setInstitutions(prev => prev.map(inst => (inst.id === id ? { ...inst, status } : inst)));
    logAction(`Updated Status to ${status}`, id);
  };

  // Student Actions
  const addStudent = (std: Omit<Student, 'id' | 'tenantId'>) => {
    const newStudent: Student = {
      ...std,
      id: `std_${Date.now()}`,
      tenantId: activeInstitutionId
    };
    setStudents(prev => [newStudent, ...prev]);
    logAction('Admitted New Student', `${newStudent.fullName} (Roll ${newStudent.studentId})`);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    logAction('Updated Student Record', id);
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    logAction('Removed Student', id);
  };

  // Teacher Actions
  const addTeacher = (tch: Omit<Teacher, 'id' | 'tenantId'>) => {
    const newTeacher: Teacher = {
      ...tch,
      id: `tch_${Date.now()}`,
      tenantId: activeInstitutionId
    };
    setTeachers(prev => [newTeacher, ...prev]);
    logAction('Added Faculty Member', newTeacher.fullName);
  };

  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
  };

  // Attendance
  const markAttendance = (records: Omit<AttendanceRecord, 'id' | 'tenantId'>[]) => {
    const newRecords: AttendanceRecord[] = records.map(r => ({
      ...r,
      id: `att_${Date.now()}_${Math.random()}`,
      tenantId: activeInstitutionId
    }));
    setAttendanceRecords(prev => [...newRecords, ...prev]);
    logAction('Marked Class Attendance', `${records.length} records processed`);
  };

  // Classes & Subjects
  const addClass = (cls: Omit<ClassInfo, 'id' | 'tenantId'>) => {
    setClasses(prev => [{ ...cls, id: `cls_${Date.now()}`, tenantId: activeInstitutionId }, ...prev]);
  };

  const addSubject = (sub: Omit<Subject, 'id' | 'tenantId'>) => {
    setSubjects(prev => [{ ...sub, id: `sub_${Date.now()}`, tenantId: activeInstitutionId }, ...prev]);
  };

  const addExam = (ex: Omit<Exam, 'id' | 'tenantId'>) => {
    setExams(prev => [{ ...ex, id: `ex_${Date.now()}`, tenantId: activeInstitutionId }, ...prev]);
  };

  const publishResult = (res: Omit<StudentResult, 'id' | 'tenantId'>) => {
    const newRes: StudentResult = {
      ...res,
      id: `res_${Date.now()}`,
      tenantId: activeInstitutionId
    };
    setResults(prev => [newRes, ...prev]);
    logAction('Published Academic Result', `${res.examName} - Roll ${res.studentRoll}`);
  };

  // Fees & Accounting
  const createFeeInvoice = (inv: Omit<FeeInvoice, 'id' | 'tenantId' | 'invoiceNo'>) => {
    const newInv: FeeInvoice = {
      ...inv,
      id: `inv_${Date.now()}`,
      tenantId: activeInstitutionId,
      invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setFees(prev => [newInv, ...prev]);
  };

  const payFeeInvoice = (invoiceId: string, method: 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Cash', trxId?: string) => {
    setFees(prev =>
      prev.map(f => {
        if (f.id === invoiceId) {
          const updated: FeeInvoice = {
            ...f,
            status: 'paid',
            paidAmount: f.netAmount,
            paymentMethod: method,
            paymentDate: new Date().toISOString().slice(0, 10),
            trxId: trxId || `TXN${Date.now().toString().slice(-8)}`
          };
          return updated;
        }
        return f;
      })
    );

    // Auto record into income transactions
    const inv = fees.find(f => f.id === invoiceId);
    if (inv) {
      addTransaction({
        type: 'income',
        category: 'Fee Collection',
        amount: inv.netAmount,
        date: new Date().toISOString().slice(0, 10),
        description: `Student ${inv.studentName} (Roll ${inv.studentRoll}) - ${inv.feeType} fee`,
        receiptVoucherNo: `VOU-${Date.now().toString().slice(-6)}`,
        paymentMethod: method === 'Rocket' ? 'Bank' : method
      });
    }
  };

  const addTransaction = (txn: Omit<AccountTransaction, 'id' | 'tenantId'>) => {
    setTransactions(prev => [{ ...txn, id: `txn_${Date.now()}`, tenantId: activeInstitutionId }, ...prev]);
  };

  const processPayroll = (record: Omit<PayrollRecord, 'id' | 'tenantId'>) => {
    setPayroll(prev => [{ ...record, id: `pay_${Date.now()}`, tenantId: activeInstitutionId }, ...prev]);
  };

  const applyLeave = (leave: Omit<LeaveApplication, 'id' | 'tenantId'>) => {
    setLeaves(prev => [{ ...leave, id: `lv_${Date.now()}`, tenantId: activeInstitutionId }, ...prev]);
  };

  const updateLeaveStatus = (id: string, status: 'approved' | 'rejected') => {
    setLeaves(prev => prev.map(l => (l.id === id ? { ...l, status } : l)));
  };

  const addNotice = (notice: Omit<Notice, 'id' | 'tenantId'>) => {
    setNotices(prev => [{ ...notice, id: `not_${Date.now()}`, tenantId: activeInstitutionId }, ...prev]);
  };

  const addNewsEvent = (item: Omit<NewsEvent, 'id' | 'tenantId'>) => {
    setNewsEvents(prev => [{ ...item, id: `ev_${Date.now()}`, tenantId: activeInstitutionId }, ...prev]);
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id' | 'tenantId'>) => {
    setGallery(prev => [{ ...item, id: `gal_${Date.now()}`, tenantId: activeInstitutionId }, ...prev]);
  };

  const addBook = (bk: Omit<LibraryBook, 'id' | 'tenantId'>) => {
    setBooks(prev => [{ ...bk, id: `bk_${Date.now()}`, tenantId: activeInstitutionId }, ...prev]);
  };

  const addVehicle = (vh: Omit<TransportVehicle, 'id' | 'tenantId'>) => {
    setVehicles(prev => [{ ...vh, id: `vh_${Date.now()}`, tenantId: activeInstitutionId }, ...prev]);
  };

  const addHostelRoom = (rm: Omit<HostelRoom, 'id' | 'tenantId'>) => {
    setHostelRooms(prev => [{ ...rm, id: `hst_${Date.now()}`, tenantId: activeInstitutionId }, ...prev]);
  };

  const addInventoryItem = (inv: Omit<InventoryItem, 'id' | 'tenantId'>) => {
    setInventory(prev => [{ ...inv, id: `inv_${Date.now()}`, tenantId: activeInstitutionId }, ...prev]);
  };

  const addHomework = (hw: Omit<Homework, 'id' | 'tenantId'>) => {
    setHomeworks(prev => [{ ...hw, id: `hw_${Date.now()}`, tenantId: activeInstitutionId }, ...prev]);
  };

  const submitOnlineAdmission = (adm: Omit<OnlineAdmission, 'id' | 'tenantId' | 'applicationNo'>) => {
    const newAdm: OnlineAdmission = {
      ...adm,
      id: `adm_${Date.now()}`,
      tenantId: activeInstitutionId,
      applicationNo: `ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setAdmissions(prev => [newAdm, ...prev]);
    logAction('Submitted Online Admission Application', newAdm.applicantName);
  };

  const updateAdmissionStatus = (id: string, status: OnlineAdmission['status']) => {
    setAdmissions(prev => prev.map(a => (a.id === id ? { ...a, status } : a)));
  };

  const updateWebsiteSettings = (themeUpdates: Partial<TenantInstitution['theme']>, navUpdates?: TenantInstitution['navMenus']) => {
    setInstitutions(prev =>
      prev.map(inst => {
        if (inst.id === activeInstitutionId) {
          return {
            ...inst,
            theme: { ...inst.theme, ...themeUpdates },
            navMenus: navUpdates || inst.navMenus
          };
        }
        return inst;
      })
    );
    logAction('Updated Website Theme & Navigation', activeInstitution.name);
  };

  const sendBulkSms = (recipientType: string, message: string) => {
    const targetStudents = students.filter(s => s.tenantId === activeInstitutionId);
    const count = targetStudents.length || 25;
    setSmsConfig(prev => ({
      ...prev,
      balanceRemaining: Math.max(0, prev.balanceRemaining - count)
    }));
    logAction(`Sent Bulk SMS (${recipientType})`, `${count} SMS dispatched: "${message.slice(0, 30)}..."`);
    return { success: true, count };
  };

  // Filtered by current active tenant_id
  const tenantStudents = students.filter(s => s.tenantId === activeInstitutionId);
  const tenantTeachers = teachers.filter(t => t.tenantId === activeInstitutionId);
  const tenantStaff = staff.filter(s => s.tenantId === activeInstitutionId);
  const tenantClasses = classes.filter(c => c.tenantId === activeInstitutionId);
  const tenantSubjects = subjects.filter(sub => sub.tenantId === activeInstitutionId);
  const tenantAttendance = attendanceRecords.filter(a => a.tenantId === activeInstitutionId);
  const tenantRoutines = routines.filter(r => r.tenantId === activeInstitutionId);
  const tenantExams = exams.filter(e => e.tenantId === activeInstitutionId);
  const tenantResults = results.filter(r => r.tenantId === activeInstitutionId);
  const tenantFees = fees.filter(f => f.tenantId === activeInstitutionId);
  const tenantTransactions = transactions.filter(t => t.tenantId === activeInstitutionId);
  const tenantPayroll = payroll.filter(p => p.tenantId === activeInstitutionId);
  const tenantLeaves = leaves.filter(l => l.tenantId === activeInstitutionId);
  const tenantNotices = notices.filter(n => n.tenantId === activeInstitutionId);
  const tenantNewsEvents = newsEvents.filter(ne => ne.tenantId === activeInstitutionId);
  const tenantGallery = gallery.filter(g => g.tenantId === activeInstitutionId);
  const tenantBooks = books.filter(b => b.tenantId === activeInstitutionId);
  const tenantVehicles = vehicles.filter(v => v.tenantId === activeInstitutionId);
  const tenantHostelRooms = hostelRooms.filter(h => h.tenantId === activeInstitutionId);
  const tenantInventory = inventory.filter(i => i.tenantId === activeInstitutionId);
  const tenantHomeworks = homeworks.filter(hw => hw.tenantId === activeInstitutionId);
  const tenantCertificates = certificates.filter(c => c.tenantId === activeInstitutionId);
  const tenantAdmissions = admissions.filter(a => a.tenantId === activeInstitutionId);
  const tenantAuditLogs = auditLogs.filter(al => !al.tenantId || al.tenantId === activeInstitutionId);

  return (
    <SchoolContext.Provider
      value={{
        institutions,
        activeInstitutionId,
        activeInstitution,
        setActiveInstitutionId,
        userRole,
        setUserRole,
        viewMode,
        setViewMode,
        subscriptionPlans,
        addInstitution,
        updateInstitution,
        deleteInstitution,
        toggleInstitutionStatus,
        students: tenantStudents,
        teachers: tenantTeachers,
        staff: tenantStaff,
        classes: tenantClasses,
        subjects: tenantSubjects,
        attendanceRecords: tenantAttendance,
        routines: tenantRoutines,
        exams: tenantExams,
        results: tenantResults,
        fees: tenantFees,
        transactions: tenantTransactions,
        payroll: tenantPayroll,
        leaves: tenantLeaves,
        notices: tenantNotices,
        newsEvents: tenantNewsEvents,
        gallery: tenantGallery,
        books: tenantBooks,
        vehicles: tenantVehicles,
        hostelRooms: tenantHostelRooms,
        inventory: tenantInventory,
        homeworks: tenantHomeworks,
        certificates: tenantCertificates,
        admissions: tenantAdmissions,
        auditLogs: tenantAuditLogs,
        smsConfig,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        markAttendance,
        addClass,
        addSubject,
        addExam,
        publishResult,
        createFeeInvoice,
        payFeeInvoice,
        addTransaction,
        processPayroll,
        applyLeave,
        updateLeaveStatus,
        addNotice,
        addNewsEvent,
        addGalleryItem,
        addBook,
        addVehicle,
        addHostelRoom,
        addInventoryItem,
        addHomework,
        submitOnlineAdmission,
        updateAdmissionStatus,
        updateWebsiteSettings,
        sendBulkSms
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
