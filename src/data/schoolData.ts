import {
  TenantInstitution,
  SubscriptionPlan,
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
  AuditLog
} from '../types/schoolTypes';

export const INITIAL_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_starter',
    name: 'Starter Institution',
    nameBn: 'স্টার্টার প্যাক',
    priceMonthly: 1500,
    priceYearly: 15000,
    maxStudents: 300,
    maxTeachers: 20,
    storageGb: 10,
    smsCredits: 1000,
    customDomainAllowed: false,
    onlinePaymentIncluded: true,
    websiteBuilderIncluded: true,
    features: ['বেসিক ওয়েবসাইট বিল্ডার', 'ছাত্র হাজিরা ও ফলাফল', 'অনলাইন ফি কালেকশন', '১০০০ ফ্রি এসএমএস', 'মোবাইল ফ্রেন্ডলি ড্যাশবোর্ড']
  },
  {
    id: 'plan_standard',
    name: 'Standard Campus Pro',
    nameBn: 'স্ট্যান্ডার্ড ক্যাম্পাস প্রো',
    priceMonthly: 3500,
    priceYearly: 35000,
    maxStudents: 1200,
    maxTeachers: 60,
    storageGb: 50,
    smsCredits: 5000,
    customDomainAllowed: true,
    onlinePaymentIncluded: true,
    websiteBuilderIncluded: true,
    features: ['কাস্টম ডোমেইন (.edu.bd)', 'অ্যাডভান্সড রেজাল্ট ও গ্রেডিং কার্ড', 'লাইব্রেরি ও ট্রান্সপোর্ট ম্যানেজমেন্ট', 'অ্যাকাউন্টিং ও পে-রোল', '৫০০০ ফ্রি এসএমএস', 'অনলাইন অ্যাডমিশন পোর্টাল']
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise Multi-Branch',
    nameBn: 'এন্টারপ্রাইজ মাল্টি-ক্যাম্পাস',
    priceMonthly: 7500,
    priceYearly: 75000,
    maxStudents: 5000,
    maxTeachers: 200,
    storageGb: 200,
    smsCredits: 20000,
    customDomainAllowed: true,
    onlinePaymentIncluded: true,
    websiteBuilderIncluded: true,
    features: ['আনলিমিটেড স্টুডেন্ট ও টিচার্স', 'হস্টেল ও ইনভেন্টরি ম্যানেজমেন্ট', 'অটোমেটিক বায়োমেট্রিক ও এসএমএস গেটওয়ে', 'মাল্টিপল থিম কাস্টমাইজেশন', '২০,০০০ ফ্রি এসএমএস', '২৪/৭ ডেডিকেটেড সাপোর্ট']
  }
];

export const INITIAL_INSTITUTIONS: TenantInstitution[] = [
  {
    id: 'tenant_dhaka_ideal',
    name: 'Dhaka Ideal Model High School & College',
    nameBn: 'ঢাকা আইডিয়াল মডেল হাই স্কুল ও কলেজ',
    code: 'EIIN: 108452',
    type: 'school',
    subdomain: 'dhaka-ideal',
    customDomain: 'www.dhakaideal.edu.bd',
    logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80',
    establishedYear: 1994,
    phone: '01813817167',
    email: 'info@dhakaideal.edu.bd',
    address: 'সেকশন-৬, মিরপুর, ঢাকা-১২১৬',
    division: 'ঢাকা',
    district: 'ঢাকা',
    upazila: 'মিরপুর',
    principalName: 'প্রফেসর ড. মুহাম্মদ রফিকুল ইসলাম',
    principalPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    principalMessage: 'আমাদের লক্ষ্য সুশিক্ষার মাধ্যমে নৈতিকতা সম্পন্ন আদর্শ নাগরিক তৈরি করা। তথ্যপ্রযুক্তির যুগে আমরা আমাদের প্রতিষ্ঠানকে সম্পূর্ণ ডিজিটাল করেছি।',
    vicePrincipalName: 'সহকারী অধ্যাপক নাসরীন সুলতানা',
    vicePrincipalMessage: 'নিয়মিত পাঠদান ও সহশিক্ষা কার্যক্রমের মধ্য দিয়ে আমরা শিক্ষার্থীদের মেধা বিকাশে সচেষ্ট।',
    missionVision: 'আধুনিক বিজ্ঞানমনস্ক, নীতিবান ও দক্ষ ভবিষ্যৎ প্রজন্ম গড়ে তোলা আমাদের মূল অঙ্গীকার।',
    status: 'active',
    subscriptionPlanId: 'plan_enterprise',
    subscriptionExpiry: '2027-12-31',
    theme: {
      themeId: 'classic-navy',
      primaryColor: '#1e3a8a',
      accentColor: '#d97706',
      fontFamily: 'Hind Siliguri',
      headerStyle: 'standard',
      footerStyle: 'detailed',
      bannerSliderImages: [
        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80'
      ]
    },
    navMenus: [
      { id: 'm1', label: 'Home', labelBn: 'মূলপাতা', url: '#home', order: 1 },
      { id: 'm2', label: 'About Us', labelBn: 'আমাদের কথা', url: '#about', order: 2 },
      { id: 'm3', label: 'Teachers', labelBn: 'শিক্ষকমণ্ডলী', url: '#teachers', order: 3 },
      { id: 'm4', label: 'Admission', labelBn: 'ভর্তি তথ্য', url: '#admission', order: 4 },
      { id: 'm5', label: 'Results', labelBn: 'ফলাফল', url: '#results', order: 5 },
      { id: 'm6', label: 'Notices', labelBn: 'নোটিশ বোর্ড', url: '#notices', order: 6 },
      { id: 'm7', label: 'Gallery', labelBn: 'ফটো গ্যালারি', url: '#gallery', order: 7 },
      { id: 'm8', label: 'Contact', labelBn: 'যোগাযোগ', url: '#contact', order: 8 }
    ],
    customPages: [
      {
        id: 'p1',
        title: 'Academic Curriculum',
        titleBn: 'পাঠ্যক্রম ও সিলেবাস',
        slug: 'curriculum',
        content: 'National Curriculum & Textbook Board (NCTB) approved curriculum.',
        contentBn: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) অনুমোদিত আধুনিক পাঠ্যক্রম অনুসরণ করা হয়।',
        isPublished: true
      }
    ],
    seo: {
      metaTitle: 'ঢাকা আইডিয়াল মডেল হাই স্কুল ও কলেজ | শ্রেষ্ঠ বিদ্যাপীঠ',
      metaDescription: 'মিরপুরের শীর্ষস্থানীয় আধুনিক ডিজিটাল স্কুল ও কলেজ। অনলাইন ভর্তি ও রেজাল্ট।',
      keywords: 'school, college, dhaka ideal, mirpur, online admission, gpa 5'
    },
    stats: {
      totalStudents: 850,
      totalTeachers: 42,
      totalStaff: 18,
      passingRate: 99.4
    },
    socialLinks: {
      facebook: 'https://facebook.com',
      youtube: 'https://youtube.com',
      website: 'https://dhakaideal.edu.bd'
    }
  },
  {
    id: 'tenant_darul_uloom',
    name: 'Darul Uloom Islamic Model Madrasa',
    nameBn: 'দারুল উলুম ইসলামিক মডেল মাদ্রাসা ও এতিমখানা',
    code: 'EIIN: 134201',
    type: 'madrasa',
    subdomain: 'darul-uloom',
    customDomain: 'www.darululoom.edu.bd',
    logo: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=160&auto=format&fit=crop&q=80',
    establishedYear: 2005,
    phone: '01711223344',
    email: 'contact@darululoom.edu.bd',
    address: 'চকবাজার, লালবাগ, ঢাকা-১২১১',
    division: 'ঢাকা',
    district: 'ঢাকা',
    upazila: 'লালবাগ',
    principalName: 'মাওলানা মুফতি আব্দুল্লাহ আল মামুন',
    principalMessage: 'কুরআন ও সুন্নাহর আলোকে দ্বীনি ও আধুনিক যুগোপযোগী শিক্ষার অপূর্ব সমন্বয় আমাদের মাদ্রাসার মূল লক্ষ্য।',
    missionVision: 'হিফজুল কুরআন এবং আধুনিক সাধারণ শিক্ষার মাধ্যমে আলোকিত মানুষ গঠন।',
    status: 'active',
    subscriptionPlanId: 'plan_standard',
    subscriptionExpiry: '2026-11-30',
    theme: {
      themeId: 'islamic-green',
      primaryColor: '#047857',
      accentColor: '#b45309',
      fontFamily: 'Kalpurush',
      headerStyle: 'centered',
      footerStyle: 'detailed',
      bannerSliderImages: [
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80'
      ]
    },
    navMenus: [
      { id: 'dm1', label: 'Home', labelBn: 'নীড়পাতা', url: '#home', order: 1 },
      { id: 'dm2', label: 'Departments', labelBn: 'বিভাগসমূহ', url: '#about', order: 2 },
      { id: 'dm3', label: 'Hifz Section', labelBn: 'হিফজুল কুরআন', url: '#curriculum', order: 3 },
      { id: 'dm4', label: 'Admissions', labelBn: 'ভর্তি', url: '#admission', order: 4 },
      { id: 'dm5', label: 'Teachers', labelBn: 'উস্তাদবৃন্দ', url: '#teachers', order: 5 },
      { id: 'dm6', label: 'Donations', labelBn: 'লিল্লাহ ফান্ড ও অনুদান', url: '#contact', order: 6 }
    ],
    customPages: [],
    seo: {
      metaTitle: 'দারুল উলুম ইসলামিক মডেল মাদ্রাসা',
      metaDescription: 'কওমি ও আলিয়া সমন্বিত দ্বীনি শিক্ষা প্রতিষ্ঠান।',
      keywords: 'madrasa, quran, hifz, islamic school'
    },
    stats: {
      totalStudents: 420,
      totalTeachers: 24,
      totalStaff: 10,
      passingRate: 98.8
    }
  },
  {
    id: 'tenant_victoria_kids',
    name: 'Victoria Kids International Kindergarten',
    nameBn: 'ভিক্টোরিয়া কিডস ইন্টারন্যাশনাল কিন্ডারগার্টেন',
    code: 'REG: KG-8821',
    type: 'kindergarten',
    subdomain: 'victoria-kids',
    logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=160&auto=format&fit=crop&q=80',
    establishedYear: 2018,
    phone: '01911998877',
    email: 'hello@victoriakids.com',
    address: 'রোড-১১, বনানী, ঢাকা-১২১৩',
    division: 'ঢাকা',
    district: 'ঢাকা',
    upazila: 'গুলশান',
    principalName: 'মিস ফারজানা ইয়াসমিন',
    principalMessage: 'আনন্দ ও খেলার ছলে শিশুদের সৃজনশীল মেধা ও মানবিক মূল্যবোধের চমৎকার বিকাশ ঘটানোই আমাদের স্বপ্ন।',
    status: 'active',
    subscriptionPlanId: 'plan_starter',
    subscriptionExpiry: '2026-10-15',
    theme: {
      themeId: 'playful-kinder',
      primaryColor: '#e11d48',
      accentColor: '#0284c7',
      fontFamily: 'Poppins',
      headerStyle: 'minimal',
      footerStyle: 'simple',
      bannerSliderImages: [
        'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80'
      ]
    },
    navMenus: [
      { id: 'vk1', label: 'Home', labelBn: 'হোম', url: '#home', order: 1 },
      { id: 'vk2', label: 'Classes', labelBn: 'প্লে-গ্রুপ ও নার্সারি', url: '#about', order: 2 },
      { id: 'vk3', label: 'Admission', labelBn: 'ভর্তি ফরম', url: '#admission', order: 3 },
      { id: 'vk4', label: 'Activities', labelBn: 'বাচ্চাদের খেলাধুলা', url: '#gallery', order: 4 }
    ],
    customPages: [],
    seo: {
      metaTitle: 'Victoria Kids International Kindergarten',
      metaDescription: 'Top rated modern kindergarten and day care in Banani.',
      keywords: 'kindergarten, playgroup, nursery, kids school'
    },
    stats: {
      totalStudents: 180,
      totalTeachers: 14,
      totalStaff: 8,
      passingRate: 100
    }
  },
  {
    id: 'tenant_prime_coaching',
    name: 'Prime Academic & BCS Coaching Center',
    nameBn: 'প্রাইম একাডেমি ও বিসিএস কোচিং সেন্টার',
    code: 'REG: COACH-4412',
    type: 'coaching',
    subdomain: 'prime-coaching',
    logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=160&auto=format&fit=crop&q=80',
    establishedYear: 2015,
    phone: '01611334455',
    email: 'info@primecoaching.com',
    address: 'ফার্মগেট মোড়, ঢাকা-১২১৫',
    division: 'ঢাকা',
    district: 'ঢাকা',
    upazila: 'তেজগাঁও',
    principalName: 'ইঞ্জিনিয়ার রেজওয়ানুল হক',
    principalMessage: 'SSC, HSC এবং বিভিন্ন বিশ্ববিদ্যালয় ভর্তি পরীক্ষায় সর্বোচ্চ সাফল্যের বিশ্বস্ত ঠিকানা।',
    status: 'active',
    subscriptionPlanId: 'plan_standard',
    subscriptionExpiry: '2027-01-20',
    theme: {
      themeId: 'modern-emerald',
      primaryColor: '#0f766e',
      accentColor: '#eab308',
      fontFamily: 'Inter',
      headerStyle: 'standard',
      footerStyle: 'detailed',
      bannerSliderImages: [
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80'
      ]
    },
    navMenus: [
      { id: 'pc1', label: 'Home', labelBn: 'হোম', url: '#home', order: 1 },
      { id: 'pc2', label: 'Batches', labelBn: 'চলমান ব্যাচসমূহ', url: '#about', order: 2 },
      { id: 'pc3', label: 'Model Tests', labelBn: 'মডেল টেস্ট ও রুটিন', url: '#results', order: 3 },
      { id: 'pc4', label: 'Enrollment', labelBn: 'অনলাইন এনরোলমেন্ট', url: '#admission', order: 4 }
    ],
    customPages: [],
    seo: {
      metaTitle: 'Prime Coaching Center | SSC, HSC & Admission',
      metaDescription: 'ফার্মগেটের শ্রেষ্ঠ একাডেমিক ও ভর্তি কোচিং সেন্টার।',
      keywords: 'coaching, ssc, hsc, bcs, model test'
    },
    stats: {
      totalStudents: 650,
      totalTeachers: 28,
      totalStaff: 12,
      passingRate: 99.1
    }
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std_101',
    tenantId: 'tenant_dhaka_ideal',
    studentId: '101',
    fullName: 'Tahsin Al Mahmud',
    fullNameBn: 'তাহসিন আল মাহমুদ',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    gender: 'male',
    dob: '2009-04-12',
    bloodGroup: 'A+',
    religion: 'Islam',
    nationality: 'Bangladeshi',
    birthRegNo: '20092692518000101',
    classId: 'cls_8',
    className: 'Class 8',
    section: 'A',
    shift: 'Morning',
    group: 'General',
    guardianName: 'Mahmudul Hasan',
    guardianPhone: '01711223388',
    guardianRelation: 'Father',
    fatherName: 'Mahmudul Hasan',
    motherName: 'Tahmina Begum',
    address: 'House 14, Road 5, Block B, Mirpur-6, Dhaka',
    emergencyContact: '01711223388',
    attendanceRate: 97.5,
    feeStatus: 'paid',
    gpa: 5.00,
    status: 'active',
    admissionDate: '2022-01-05'
  },
  {
    id: 'std_102',
    tenantId: 'tenant_dhaka_ideal',
    studentId: '102',
    fullName: 'Sumaiya Akter',
    fullNameBn: 'সুমাইয়া আক্তার',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    gender: 'female',
    dob: '2009-08-20',
    bloodGroup: 'B+',
    religion: 'Islam',
    nationality: 'Bangladeshi',
    birthRegNo: '20092692518000102',
    classId: 'cls_8',
    className: 'Class 8',
    section: 'A',
    shift: 'Morning',
    group: 'General',
    guardianName: 'Kamal Hossain',
    guardianPhone: '01811223399',
    guardianRelation: 'Father',
    fatherName: 'Kamal Hossain',
    motherName: 'Shahnaz Parvin',
    address: 'House 22, Road 9, Mirpur-2, Dhaka',
    emergencyContact: '01811223399',
    attendanceRate: 98.2,
    feeStatus: 'paid',
    gpa: 4.95,
    status: 'active',
    admissionDate: '2022-01-05'
  },
  {
    id: 'std_103',
    tenantId: 'tenant_dhaka_ideal',
    studentId: '103',
    fullName: 'Riadul Islam',
    fullNameBn: 'রিয়াদুল ইসলাম',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    gender: 'male',
    dob: '2008-03-15',
    bloodGroup: 'O+',
    religion: 'Islam',
    nationality: 'Bangladeshi',
    birthRegNo: '20082692518000103',
    classId: 'cls_9',
    className: 'Class 9',
    section: 'Science-A',
    shift: 'Morning',
    group: 'Science',
    guardianName: 'Shafiqul Islam',
    guardianPhone: '01911223300',
    guardianRelation: 'Father',
    fatherName: 'Shafiqul Islam',
    motherName: 'Rokeya Khatun',
    address: 'House 8, Road 3, Mirpur-10, Dhaka',
    emergencyContact: '01911223300',
    attendanceRate: 92.0,
    feeStatus: 'due',
    gpa: 4.65,
    status: 'active',
    admissionDate: '2023-01-10'
  },
  {
    id: 'std_104',
    tenantId: 'tenant_dhaka_ideal',
    studentId: '104',
    fullName: 'Farzana Haque',
    fullNameBn: 'ফারজানা হক',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    gender: 'female',
    dob: '2008-11-25',
    bloodGroup: 'AB+',
    religion: 'Islam',
    nationality: 'Bangladeshi',
    birthRegNo: '20082692518000104',
    classId: 'cls_10',
    className: 'Class 10',
    section: 'Science-A',
    shift: 'Morning',
    group: 'Science',
    guardianName: 'Enamul Haque',
    guardianPhone: '01711556677',
    guardianRelation: 'Father',
    fatherName: 'Enamul Haque',
    motherName: 'Farida Yesmin',
    address: 'Pallabi, Mirpur-12, Dhaka',
    emergencyContact: '01711556677',
    attendanceRate: 96.0,
    feeStatus: 'paid',
    gpa: 5.00,
    status: 'active',
    admissionDate: '2024-01-08'
  },
  {
    id: 'std_201',
    tenantId: 'tenant_darul_uloom',
    studentId: 'H-201',
    fullName: 'Hafiz Md. Abdullah',
    fullNameBn: 'হাফেজ মোঃ আব্দুল্লাহ',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    gender: 'male',
    dob: '2010-06-18',
    bloodGroup: 'B+',
    religion: 'Islam',
    nationality: 'Bangladeshi',
    birthRegNo: '20102692518000201',
    classId: 'cls_hifz',
    className: 'Hifz Department',
    section: 'Qirat-A',
    shift: 'Morning',
    group: 'Hifz',
    guardianName: 'Mawlana Qari Yusuf',
    guardianPhone: '01711889900',
    guardianRelation: 'Father',
    fatherName: 'Mawlana Qari Yusuf',
    motherName: 'Amina Khatun',
    address: 'Lalbagh, Dhaka',
    emergencyContact: '01711889900',
    attendanceRate: 99.1,
    feeStatus: 'paid',
    gpa: 5.00,
    status: 'active',
    admissionDate: '2023-01-01'
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tch_1',
    tenantId: 'tenant_dhaka_ideal',
    employeeId: 'TCH-001',
    fullName: 'A. B. M. Shamsuddin',
    fullNameBn: 'এ. বি. এম. শামসুদ্দীন',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    designation: 'Senior Teacher (Mathematics)',
    designationBn: 'সিনিয়র শিক্ষক (গণিত)',
    department: 'Science',
    qualification: 'M.Sc (Mathematics), B.Ed',
    joiningDate: '2012-03-01',
    phone: '01712001122',
    email: 'shamsuddin@dhakaideal.edu.bd',
    address: 'Mirpur-6, Dhaka',
    salary: 45000,
    assignedClasses: ['Class 9', 'Class 10'],
    assignedSubjects: ['General Mathematics', 'Higher Mathematics'],
    attendanceRate: 98.5,
    status: 'active'
  },
  {
    id: 'tch_2',
    tenantId: 'tenant_dhaka_ideal',
    employeeId: 'TCH-002',
    fullName: 'Mahfuza Khatun',
    fullNameBn: 'মাহফুজা খাতুন',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    designation: 'Assistant Teacher (English)',
    designationBn: 'সহকারী শিক্ষক (ইংরেজি)',
    department: 'Languages',
    qualification: 'M.A (English), B.Ed',
    joiningDate: '2016-07-15',
    phone: '01812001133',
    email: 'mahfuza@dhakaideal.edu.bd',
    address: 'Kalyanpur, Dhaka',
    salary: 38000,
    assignedClasses: ['Class 8', 'Class 9'],
    assignedSubjects: ['English 1st Paper', 'English 2nd Paper'],
    attendanceRate: 97.0,
    status: 'active'
  },
  {
    id: 'tch_3',
    tenantId: 'tenant_dhaka_ideal',
    employeeId: 'TCH-003',
    fullName: 'Dr. Tariqul Islam',
    fullNameBn: 'ড. তরিকুল ইসলাম',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    designation: 'Lecturer (Physics)',
    designationBn: 'প্রভাষক (পদার্থবিজ্ঞান)',
    department: 'Science',
    qualification: 'Ph.D in Applied Physics, DU',
    joiningDate: '2019-01-10',
    phone: '01912001144',
    email: 'tariqul@dhakaideal.edu.bd',
    address: 'Uttara, Dhaka',
    salary: 52000,
    assignedClasses: ['Class 10', 'HSC 1st Year', 'HSC 2nd Year'],
    assignedSubjects: ['Physics'],
    attendanceRate: 99.0,
    status: 'active'
  }
];

export const INITIAL_STAFF: Staff[] = [
  {
    id: 'stf_1',
    tenantId: 'tenant_dhaka_ideal',
    employeeId: 'STF-01',
    fullName: 'Mohammad Zakir Hossain',
    fullNameBn: 'মোহাম্মদ জাকির হোসেন',
    role: 'Accountant',
    phone: '01715009988',
    salary: 32000,
    joiningDate: '2015-04-01',
    status: 'active'
  },
  {
    id: 'stf_2',
    tenantId: 'tenant_dhaka_ideal',
    employeeId: 'STF-02',
    fullName: 'Begum Rashida',
    fullNameBn: 'বেগম রাশিদা',
    role: 'Librarian',
    phone: '01815009977',
    salary: 28000,
    joiningDate: '2017-09-12',
    status: 'active'
  }
];

export const INITIAL_CLASSES: ClassInfo[] = [
  {
    id: 'cls_6',
    tenantId: 'tenant_dhaka_ideal',
    name: 'Class 6',
    nameBn: 'ষষ্ঠ শ্রেণি',
    sections: ['A', 'B'],
    shifts: ['Morning', 'Day'],
    groups: ['General'],
    classTeacher: 'এ. বি. এম. শামসুদ্দীন',
    roomNumber: 'Room 201',
    totalStudents: 120
  },
  {
    id: 'cls_7',
    tenantId: 'tenant_dhaka_ideal',
    name: 'Class 7',
    nameBn: 'সপ্তম শ্রেণি',
    sections: ['A', 'B'],
    shifts: ['Morning'],
    groups: ['General'],
    classTeacher: 'মাহফুজা খাতুন',
    roomNumber: 'Room 202',
    totalStudents: 115
  },
  {
    id: 'cls_8',
    tenantId: 'tenant_dhaka_ideal',
    name: 'Class 8',
    nameBn: 'অষ্টম শ্রেণি',
    sections: ['A', 'B', 'C'],
    shifts: ['Morning'],
    groups: ['General'],
    classTeacher: 'মাহফুজা খাতুন',
    roomNumber: 'Room 301',
    totalStudents: 140
  },
  {
    id: 'cls_9',
    tenantId: 'tenant_dhaka_ideal',
    name: 'Class 9',
    nameBn: 'নবম শ্রেণি',
    sections: ['Science-A', 'Business-A', 'Humanities-A'],
    shifts: ['Morning'],
    groups: ['Science', 'Humanities', 'Business Studies'],
    classTeacher: 'ড. তরিকুল ইসলাম',
    roomNumber: 'Room 401',
    totalStudents: 150
  },
  {
    id: 'cls_10',
    tenantId: 'tenant_dhaka_ideal',
    name: 'Class 10',
    nameBn: 'দশম শ্রেণি',
    sections: ['Science-A', 'Business-A'],
    shifts: ['Morning'],
    groups: ['Science', 'Business Studies'],
    classTeacher: 'ড. তরিকুল ইসলাম',
    roomNumber: 'Room 402',
    totalStudents: 135
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub_1',
    tenantId: 'tenant_dhaka_ideal',
    code: '101',
    name: 'Bangla 1st Paper',
    nameBn: 'বাংলা ১ম পত্র',
    classId: 'cls_8',
    className: 'Class 8',
    type: 'compulsory',
    fullMarks: 100,
    passMarks: 33,
    teacherName: 'মোঃ আনিসুর রহমান'
  },
  {
    id: 'sub_2',
    tenantId: 'tenant_dhaka_ideal',
    code: '107',
    name: 'English 1st Paper',
    nameBn: 'ইংরেজি ১ম পত্র',
    classId: 'cls_8',
    className: 'Class 8',
    type: 'compulsory',
    fullMarks: 100,
    passMarks: 33,
    teacherName: 'মাহফুজা খাতুন'
  },
  {
    id: 'sub_3',
    tenantId: 'tenant_dhaka_ideal',
    code: '109',
    name: 'General Mathematics',
    nameBn: 'সাধারণ গণিত',
    classId: 'cls_8',
    className: 'Class 8',
    type: 'compulsory',
    fullMarks: 100,
    passMarks: 33,
    teacherName: 'এ. বি. এম. শামসুদ্দীন'
  },
  {
    id: 'sub_4',
    tenantId: 'tenant_dhaka_ideal',
    code: '127',
    name: 'General Science',
    nameBn: 'সাধারণ বিজ্ঞান',
    classId: 'cls_8',
    className: 'Class 8',
    type: 'theory',
    fullMarks: 100,
    passMarks: 33,
    teacherName: 'ড. তরিকুল ইসলাম'
  }
];

export const INITIAL_ROUTINE: ClassRoutine[] = [
  {
    id: 'rt_cls8_a',
    tenantId: 'tenant_dhaka_ideal',
    classId: 'cls_8',
    className: 'Class 8',
    section: 'A',
    periods: [
      { id: 'p1', periodNo: 1, day: 'Sunday', timeSlot: '08:30 AM - 09:15 AM', subjectName: 'বাংলা ১ম পত্র', teacherName: 'মোঃ আনিসুর রহমান', roomNo: 'Room 301' },
      { id: 'p2', periodNo: 2, day: 'Sunday', timeSlot: '09:15 AM - 10:00 AM', subjectName: 'ইংরেজি ১ম পত্র', teacherName: 'মাহফুজা খাতুন', roomNo: 'Room 301' },
      { id: 'p3', periodNo: 3, day: 'Sunday', timeSlot: '10:00 AM - 10:45 AM', subjectName: 'সাধারণ গণিত', teacherName: 'এ. বি. এম. শামসুদ্দীন', roomNo: 'Room 301' },
      { id: 'p4', periodNo: 4, day: 'Sunday', timeSlot: '11:15 AM - 12:00 PM', subjectName: 'সাধারণ বিজ্ঞান', teacherName: 'ড. তরিকুল ইসলাম', roomNo: 'Room 301' }
    ]
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'ex_1',
    tenantId: 'tenant_dhaka_ideal',
    name: 'Half Yearly Examination 2026',
    nameBn: 'অর্ধবার্ষিক পরীক্ষা ২০২৬',
    examType: 'half_yearly',
    classId: 'cls_8',
    className: 'Class 8',
    academicYear: '2026',
    startDate: '2026-06-10',
    endDate: '2026-06-25',
    isPublished: true
  },
  {
    id: 'ex_2',
    tenantId: 'tenant_dhaka_ideal',
    name: 'Annual Model Test 2026',
    nameBn: 'বার্ষিক মডেল টেস্ট ২০২৬',
    examType: 'model_test',
    classId: 'cls_10',
    className: 'Class 10',
    academicYear: '2026',
    startDate: '2026-10-15',
    endDate: '2026-10-30',
    isPublished: false
  }
];

export const INITIAL_RESULTS: StudentResult[] = [
  {
    id: 'res_101',
    tenantId: 'tenant_dhaka_ideal',
    examId: 'ex_1',
    examName: 'Half Yearly Examination 2026',
    studentId: 'std_101',
    studentRoll: '101',
    studentName: 'Tahsin Al Mahmud',
    classId: 'cls_8',
    className: 'Class 8',
    section: 'A',
    subjects: [
      { subjectId: 'sub_1', subjectName: 'বাংলা ১ম পত্র', written: 88, total: 88, grade: 'A+', gradePoint: 5.0, isPassed: true },
      { subjectId: 'sub_2', subjectName: 'ইংরেজি ১ম পত্র', written: 92, total: 92, grade: 'A+', gradePoint: 5.0, isPassed: true },
      { subjectId: 'sub_3', subjectName: 'সাধারণ গণিত', written: 95, total: 95, grade: 'A+', gradePoint: 5.0, isPassed: true },
      { subjectId: 'sub_4', subjectName: 'সাধারণ বিজ্ঞান', written: 89, total: 89, grade: 'A+', gradePoint: 5.0, isPassed: true }
    ],
    totalMarks: 364,
    gpa: 5.00,
    grade: 'A+',
    positionInClass: 1,
    passed: true,
    publishedDate: '2026-07-05'
  },
  {
    id: 'res_102',
    tenantId: 'tenant_dhaka_ideal',
    examId: 'ex_1',
    examName: 'Half Yearly Examination 2026',
    studentId: 'std_102',
    studentRoll: '102',
    studentName: 'Sumaiya Akter',
    classId: 'cls_8',
    className: 'Class 8',
    section: 'A',
    subjects: [
      { subjectId: 'sub_1', subjectName: 'বাংলা ১ম পত্র', written: 85, total: 85, grade: 'A+', gradePoint: 5.0, isPassed: true },
      { subjectId: 'sub_2', subjectName: 'ইংরেজি ১ম পত্র', written: 94, total: 94, grade: 'A+', gradePoint: 5.0, isPassed: true },
      { subjectId: 'sub_3', subjectName: 'সাধারণ গণিত', written: 88, total: 88, grade: 'A+', gradePoint: 5.0, isPassed: true },
      { subjectId: 'sub_4', subjectName: 'সাধারণ বিজ্ঞান', written: 90, total: 90, grade: 'A+', gradePoint: 5.0, isPassed: true }
    ],
    totalMarks: 357,
    gpa: 4.95,
    grade: 'A',
    positionInClass: 2,
    passed: true,
    publishedDate: '2026-07-05'
  }
];

export const INITIAL_FEES: FeeInvoice[] = [
  {
    id: 'inv_1001',
    tenantId: 'tenant_dhaka_ideal',
    invoiceNo: 'INV-2026-0801',
    studentId: 'std_101',
    studentRoll: '101',
    studentName: 'Tahsin Al Mahmud',
    className: 'Class 8',
    feeType: 'tuition',
    monthYear: 'August 2026',
    amount: 1500,
    discount: 0,
    fine: 0,
    netAmount: 1500,
    paidAmount: 1500,
    status: 'paid',
    paymentMethod: 'bKash',
    paymentDate: '2026-08-05',
    trxId: 'BK88992211AA'
  },
  {
    id: 'inv_1002',
    tenantId: 'tenant_dhaka_ideal',
    invoiceNo: 'INV-2026-0802',
    studentId: 'std_103',
    studentRoll: '103',
    studentName: 'Riadul Islam',
    className: 'Class 9',
    feeType: 'tuition',
    monthYear: 'August 2026',
    amount: 1800,
    discount: 0,
    fine: 50,
    netAmount: 1850,
    paidAmount: 0,
    status: 'unpaid'
  }
];

export const INITIAL_TRANSACTIONS: AccountTransaction[] = [
  {
    id: 'txn_1',
    tenantId: 'tenant_dhaka_ideal',
    type: 'income',
    category: 'Tuition Fee Collection',
    amount: 450000,
    date: '2026-08-05',
    description: 'Student monthly tuition fee batch deposit',
    receiptVoucherNo: 'VOU-INC-801',
    paymentMethod: 'bKash'
  },
  {
    id: 'txn_2',
    tenantId: 'tenant_dhaka_ideal',
    type: 'expense',
    category: 'Electricity Bill',
    amount: 28500,
    date: '2026-08-10',
    description: 'DESCO Campus electricity bill for July',
    receiptVoucherNo: 'VOU-EXP-402',
    paymentMethod: 'Bank'
  }
];

export const INITIAL_PAYROLL: PayrollRecord[] = [
  {
    id: 'pay_1',
    tenantId: 'tenant_dhaka_ideal',
    employeeType: 'teacher',
    employeeId: 'TCH-001',
    employeeName: 'A. B. M. Shamsuddin',
    designation: 'Senior Teacher',
    month: 'July',
    year: 2026,
    basicSalary: 45000,
    allowances: 5000,
    bonus: 0,
    deductions: 1000,
    netSalary: 49000,
    status: 'paid',
    paymentDate: '2026-08-01'
  }
];

export const INITIAL_LEAVES: LeaveApplication[] = [
  {
    id: 'lv_1',
    tenantId: 'tenant_dhaka_ideal',
    applicantType: 'teacher',
    applicantId: 'TCH-002',
    applicantName: 'Mahfuza Khatun',
    leaveType: 'sick',
    startDate: '2026-08-20',
    endDate: '2026-08-22',
    totalDays: 3,
    reason: 'Severe seasonal fever and medical consultation',
    status: 'approved',
    appliedDate: '2026-08-19'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not_1',
    tenantId: 'tenant_dhaka_ideal',
    title: 'Upcoming Half Yearly Examination Schedule 2026',
    titleBn: 'অর্ধবার্ষিক পরীক্ষা ২০২৬ এর সময়সূচি ও নিয়মাবলী প্রকাশ',
    content: 'সকল শিক্ষার্থীদের জানানো যাচ্ছে যে আগামী ১০ জুন ২০২৬ হতে অর্ধবার্ষিক পরীক্ষা শুরু হবে। সকল বকেয়া ফি ৭ জুনের মধ্যে পরিশোধ করে প্রবেশপত্র সংগ্রহ করার নির্দেশ দেওয়া হলো।',
    category: 'exam',
    publishDate: '2026-05-25',
    isPublishedToWeb: true,
    attachmentName: 'exam_routine_2026.pdf'
  },
  {
    id: 'not_2',
    tenantId: 'tenant_dhaka_ideal',
    title: 'Online Admission Open for Academic Session 2027',
    titleBn: '২০২৭ শিক্ষাবর্ষে ৬ষ্ঠ থেকে ৯ম শ্রেণিতে অনলাইন ভর্তি আবেদন শুরু',
    content: 'আমাদের স্কুলে নতুন শিক্ষাবর্ষে সীমিত আসনে অনলাইনে ভর্তি আবেদন গ্রহণ চলছে। আগ্রহী অভিভাবকগণ ওয়েবসাইট থেকে ফরম পূরণ করতে পারবেন।',
    category: 'admission',
    publishDate: '2026-08-01',
    isPublishedToWeb: true,
    attachmentName: 'admission_guideline.pdf'
  }
];

export const INITIAL_NEWS_EVENTS: NewsEvent[] = [
  {
    id: 'ev_1',
    tenantId: 'tenant_dhaka_ideal',
    title: 'Annual Science Fair & Robot Exhibition 2026',
    titleBn: 'বার্ষিক বিজ্ঞান মেলা ও রোবটিক্স প্রদর্শনী ২০২৬ অনুষ্ঠিত',
    type: 'event',
    date: '2026-03-12',
    location: 'Campus Auditorium',
    description: 'শিক্ষার্থীদের উদ্ভাবিত ২০টি আধুনিক বিজ্ঞান প্রজেক্ট প্রদর্শিত হয়।',
    image: 'https://images.unsplash.com/photo-1511629091441-ee46146481b6?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal_1',
    tenantId: 'tenant_dhaka_ideal',
    title: 'Campus Main Academic Building & Garden',
    titleBn: 'প্রতিষ্ঠানের মূল অ্যাকাডেমিক ভবন ও মনোরম ক্যাম্পাস চত্বর',
    album: 'Campus Life',
    category: 'campus',
    description: 'আধুনিক স্থাপত্য ও সবুজ ছায়াঘেরা সুপরিসর ক্যাম্পাস প্রাঙ্গণ।',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1200&auto=format&fit=crop&q=80',
    date: '2026-02-15'
  },
  {
    id: 'gal_2',
    tenantId: 'tenant_dhaka_ideal',
    title: 'Computer Lab & Smart Multimedia Classroom',
    titleBn: 'আধুনিক কম্পিউটার ল্যাব ও ডিজিটাল মাল্টিমিডিয়া ক্লাসরুম',
    album: 'Academics',
    category: 'lab',
    description: 'উচ্চগতির ইন্টারনেট ও আধুনিক পিসিসহ ৬০ আসনের শীতাতপ নিয়ন্ত্রিত আইসিটি ল্যাব।',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80',
    date: '2026-03-01'
  },
  {
    id: 'gal_3',
    tenantId: 'tenant_dhaka_ideal',
    title: 'Modern Science & Chemistry Laboratory',
    titleBn: 'উন্নত বিজ্ঞানাগার ও রসায়ন-পদার্থ প্র্যাকটিক্যাল ল্যাব',
    album: 'Academics',
    category: 'lab',
    description: 'শিক্ষার্থীদের হাতেকলমে বিজ্ঞান পরীক্ষার জন্য আধুনিক যন্ত্রপাতি সমৃদ্ধ ল্যাবরেটরি।',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&auto=format&fit=crop&q=80',
    date: '2026-03-10'
  },
  {
    id: 'gal_4',
    tenantId: 'tenant_dhaka_ideal',
    title: 'Interactive High School Classroom Session',
    titleBn: 'আনন্দঘন ও অংশগ্রহণমূলক শ্রেণিকক্ষ পাঠদান অধিবেশন',
    album: 'Academics',
    category: 'classroom',
    description: 'অভিজ্ঞ শিক্ষকমণ্ডলীর নিবিড় তত্ত্বাবধানে শিক্ষার্থীদের শ্রেণি কার্যক্রম।',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80',
    date: '2026-02-28'
  },
  {
    id: 'gal_5',
    tenantId: 'tenant_dhaka_ideal',
    title: 'Annual Sports Competition & Football Tournament',
    titleBn: 'বার্ষিক ক্রীড়া প্রতিযোগিতা ও ফুটবল টুর্নামেন্ট ২০২৬',
    album: 'Sports',
    category: 'sports',
    description: 'প্রতিষ্ঠানের সুপরিসর খেলার মাঠে আয়োজিত বার্ষিক ক্রীড়া উৎসবের আনন্দঘন মুহূর্ত।',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1200&auto=format&fit=crop&q=80',
    date: '2026-01-20'
  },
  {
    id: 'gal_6',
    tenantId: 'tenant_dhaka_ideal',
    title: 'Cultural Festival & Annual Prize Giving Ceremony',
    titleBn: 'মনোজ্ঞ সাংস্কৃতিক অনুষ্ঠান ও বার্ষিক পুরস্কার বিতরণী পর্ব',
    album: 'Events',
    category: 'cultural',
    description: 'শিক্ষার্থীদের নৃত্য, নাটক, আবৃত্তি পরিবেশন ও মেধা পুরস্কার প্রদান।',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
    date: '2026-02-21'
  },
  {
    id: 'gal_7',
    tenantId: 'tenant_dhaka_ideal',
    title: 'Central Library & Reading Corner',
    titleBn: 'কেন্দ্রীয় লাইব্রেরি ও শিক্ষার্থীদের অধ্যয়ন কক্ষ',
    album: 'Facilities',
    category: 'campus',
    description: '১০,০০০+ গ্রন্থ ও জাতীয় দৈনিক সম্বলিত সমৃদ্ধ কেন্দ্রীয় পাঠাগার।',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&auto=format&fit=crop&q=80',
    date: '2026-03-05'
  },
  {
    id: 'gal_8',
    tenantId: 'tenant_dhaka_ideal',
    title: 'National Anthem & Morning Assembly',
    titleBn: 'জাতীয় পতাকা উত্তোলন ও প্রতিদিনের প্রাত্যহিক সমাবেশ',
    album: 'Events',
    category: 'cultural',
    description: 'সুশৃঙ্খল পরিবেশে শিক্ষক-শিক্ষার্থীদের জাতীয় সংগীত ও শপথ পাঠ।',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop&q=80',
    date: '2026-03-12'
  }
];

export const INITIAL_BOOKS: LibraryBook[] = [
  {
    id: 'bk_1',
    tenantId: 'tenant_dhaka_ideal',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Literature',
    isbn: '978-0062315007',
    totalCopies: 10,
    availableCopies: 8,
    rackNo: 'Rack A-3'
  },
  {
    id: 'bk_2',
    tenantId: 'tenant_dhaka_ideal',
    title: 'পদার্থবিজ্ঞানের আনন্দ',
    author: 'ড. মুহম্মদ জাফর ইকবাল',
    category: 'Science',
    isbn: '978-9848810234',
    totalCopies: 15,
    availableCopies: 12,
    rackNo: 'Rack S-1'
  }
];

export const INITIAL_VEHICLES: TransportVehicle[] = [
  {
    id: 'vh_1',
    tenantId: 'tenant_dhaka_ideal',
    vehicleNo: 'Dhaka Metro-Cha 11-4589',
    driverName: 'Mohammad Rafiq',
    driverPhone: '01719887766',
    routeName: 'Route 1: Uttara - Mirpur-10 - Campus',
    stops: ['Uttara House Building', 'Airport', 'Shewrapara', 'Mirpur-10', 'Campus'],
    capacity: 35,
    assignedStudentsCount: 28,
    monthlyFee: 1800
  }
];

export const INITIAL_HOSTEL: HostelRoom[] = [
  {
    id: 'hst_1',
    tenantId: 'tenant_dhaka_ideal',
    buildingName: 'Nazrul Hall',
    floor: '2nd Floor',
    roomNo: 'Room 204',
    totalBeds: 4,
    occupiedBeds: 3,
    feePerMonth: 3500
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv_item_1',
    tenantId: 'tenant_dhaka_ideal',
    itemName: 'Student High-Low Wooden Bench',
    category: 'furniture',
    totalQuantity: 250,
    inUseQuantity: 240,
    damagedQuantity: 10,
    supplier: 'Bengal Furniture Ltd',
    unitPrice: 3200
  },
  {
    id: 'inv_item_2',
    tenantId: 'tenant_dhaka_ideal',
    itemName: 'Desktop PC (Core i5 12th Gen)',
    category: 'computer',
    totalQuantity: 40,
    inUseQuantity: 38,
    damagedQuantity: 2,
    supplier: 'Star Tech & Engineering Ltd',
    unitPrice: 48000
  }
];

export const INITIAL_HOMEWORK: Homework[] = [
  {
    id: 'hw_1',
    tenantId: 'tenant_dhaka_ideal',
    classId: 'cls_8',
    className: 'Class 8',
    section: 'A',
    subjectName: 'সাধারণ গণিত',
    teacherName: 'এ. বি. এম. শামসুদ্দীন',
    title: 'অধ্যায় ৩: পরিমাপ সংক্রান্ত গাণিতিক সমস্যা ১-১০',
    description: 'পাঠ্যবইয়ের পৃষ্ঠা ৪২ এর অনুশীলনী ৩.১ এর সকল সমস্যা সমাধান করে খাতায় উপস্থাপন করবে।',
    assignedDate: '2026-08-24',
    dueDate: '2026-08-28'
  }
];

export const INITIAL_ADMISSIONS: OnlineAdmission[] = [
  {
    id: 'adm_1',
    tenantId: 'tenant_dhaka_ideal',
    applicationNo: 'ADM-2027-0091',
    applicantName: 'Nabil Hasan',
    applicantPhone: '01711002233',
    guardianName: 'Dr. Nazmul Hasan',
    appliedClass: 'Class 6',
    gender: 'male',
    dob: '2015-02-14',
    previousSchool: 'Mirpur Little Jewels School',
    examScore: 88,
    status: 'admitted',
    appliedDate: '2026-08-12',
    admissionFeeStatus: 'paid'
  },
  {
    id: 'adm_2',
    tenantId: 'tenant_dhaka_ideal',
    applicationNo: 'ADM-2027-0092',
    applicantName: 'Mariya Sultana',
    applicantPhone: '01811445566',
    guardianName: 'Advocate Sultan Ahmed',
    appliedClass: 'Class 6',
    gender: 'female',
    dob: '2015-05-19',
    previousSchool: 'Ideal Preparatory School',
    status: 'submitted',
    appliedDate: '2026-08-20',
    admissionFeeStatus: 'unpaid'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_1',
    tenantId: 'tenant_dhaka_ideal',
    institutionName: 'Dhaka Ideal Model High School & College',
    actorName: 'Super Admin',
    role: 'super_admin',
    action: 'Approved Subscription Upgrade',
    target: 'Enterprise Plan',
    timestamp: '2026-08-25 10:15 AM',
    ipAddress: '103.230.104.12'
  },
  {
    id: 'log_2',
    tenantId: 'tenant_dhaka_ideal',
    institutionName: 'Dhaka Ideal Model High School & College',
    actorName: 'Principal Dr. Rafiqul Islam',
    role: 'principal',
    action: 'Published Exam Results',
    target: 'Half Yearly Examination 2026',
    timestamp: '2026-08-24 04:30 PM',
    ipAddress: '118.179.223.45'
  }
];
