export type InstitutionType = 'school' | 'college' | 'madrasa' | 'kindergarten' | 'coaching' | 'technical';

export type UserRole =
  | 'super_admin'
  | 'institution_admin'
  | 'principal'
  | 'vice_principal'
  | 'teacher'
  | 'accountant'
  | 'staff'
  | 'student'
  | 'guardian';

export interface WebsiteNavMenu {
  id: string;
  label: string;
  labelBn: string;
  url: string;
  isExternal?: boolean;
  order: number;
  submenus?: { id: string; label: string; labelBn: string; url: string }[];
}

export interface WebsiteCustomPage {
  id: string;
  title: string;
  titleBn: string;
  slug: string;
  content: string;
  contentBn: string;
  bannerImage?: string;
  isPublished: boolean;
}

export interface WebsiteThemeSettings {
  themeId: 'modern-emerald' | 'classic-navy' | 'islamic-green' | 'playful-kinder' | 'tech-slate';
  primaryColor: string;
  accentColor: string;
  fontFamily: 'Inter' | 'Hind Siliguri' | 'Kalpurush' | 'Poppins';
  headerStyle: 'standard' | 'centered' | 'minimal';
  footerStyle: 'detailed' | 'simple';
  bannerSliderImages: string[];
}

export interface TenantInstitution {
  id: string; // tenant_id
  name: string;
  nameBn: string;
  code: string; // EIIN or Reg No
  type: InstitutionType;
  subdomain: string;
  customDomain?: string;
  logo: string;
  favicon?: string;
  establishedYear: number;
  phone: string;
  email: string;
  address: string;
  division: string;
  district: string;
  upazila: string;
  principalName: string;
  principalPhoto?: string;
  principalMessage?: string;
  vicePrincipalName?: string;
  vicePrincipalMessage?: string;
  missionVision?: string;
  status: 'active' | 'pending' | 'suspended';
  subscriptionPlanId: string;
  subscriptionExpiry: string;
  theme: WebsiteThemeSettings;
  navMenus: WebsiteNavMenu[];
  customPages: WebsiteCustomPage[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage?: string;
  };
  stats: {
    totalStudents: number;
    totalTeachers: number;
    totalStaff: number;
    passingRate: number;
  };
  socialLinks?: {
    facebook?: string;
    youtube?: string;
    website?: string;
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  nameBn: string;
  priceMonthly: number;
  priceYearly: number;
  maxStudents: number;
  maxTeachers: number;
  storageGb: number;
  smsCredits: number;
  customDomainAllowed: boolean;
  onlinePaymentIncluded: boolean;
  websiteBuilderIncluded: boolean;
  features: string[];
}

export interface Student {
  id: string;
  tenantId: string;
  studentId: string; // Roll/ID
  fullName: string;
  fullNameBn: string;
  photo: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  religion: 'Islam' | 'Hinduism' | 'Buddhism' | 'Christianity' | 'Other';
  nationality: string;
  birthRegNo: string;
  nidNo?: string;
  classId: string;
  className: string;
  section: string;
  shift: 'Morning' | 'Day';
  group?: 'General' | 'Science' | 'Humanities' | 'Business Studies' | 'Hifz' | 'Qirat';
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  fatherName: string;
  motherName: string;
  address: string;
  emergencyContact: string;
  previousInstitution?: string;
  attendanceRate: number;
  feeStatus: 'paid' | 'due' | 'partial';
  gpa: number;
  status: 'active' | 'graduated' | 'transferred' | 'suspended';
  admissionDate: string;
}

export interface Teacher {
  id: string;
  tenantId: string;
  employeeId: string;
  fullName: string;
  fullNameBn: string;
  photo: string;
  designation: string;
  designationBn: string;
  department: string;
  qualification: string;
  joiningDate: string;
  phone: string;
  email: string;
  address: string;
  salary: number;
  assignedClasses: string[];
  assignedSubjects: string[];
  attendanceRate: number;
  status: 'active' | 'on_leave' | 'resigned';
}

export interface Staff {
  id: string;
  tenantId: string;
  employeeId: string;
  fullName: string;
  fullNameBn: string;
  role: 'Accountant' | 'Librarian' | 'Office Assistant' | 'Lab Assistant' | 'Security Guard' | 'Support Staff';
  phone: string;
  salary: number;
  joiningDate: string;
  status: 'active' | 'inactive';
}

export interface ClassInfo {
  id: string;
  tenantId: string;
  name: string;
  nameBn: string;
  sections: string[];
  shifts: ('Morning' | 'Day')[];
  groups: string[];
  classTeacher?: string;
  roomNumber?: string;
  totalStudents: number;
}

export interface Subject {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  nameBn: string;
  classId: string;
  className: string;
  type: 'compulsory' | 'optional' | 'theory' | 'practical';
  fullMarks: number;
  passMarks: number;
  teacherId?: string;
  teacherName?: string;
}

export interface AttendanceRecord {
  id: string;
  tenantId: string;
  date: string;
  targetType: 'student' | 'teacher' | 'staff';
  targetId: string;
  targetName: string;
  classId?: string;
  section?: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  inTime?: string;
  remarks?: string;
}

export interface RoutinePeriod {
  id: string;
  periodNo: number;
  day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Saturday';
  timeSlot: string;
  subjectName: string;
  teacherName: string;
  roomNo: string;
}

export interface ClassRoutine {
  id: string;
  tenantId: string;
  classId: string;
  className: string;
  section: string;
  periods: RoutinePeriod[];
}

export interface Exam {
  id: string;
  tenantId: string;
  name: string;
  nameBn: string;
  examType: 'monthly' | 'half_yearly' | 'annual' | 'model_test' | 'pre_test' | 'admission_test';
  classId: string;
  className: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
}

export interface SubjectMarks {
  subjectId: string;
  subjectName: string;
  written: number;
  practical?: number;
  viva?: number;
  total: number;
  grade: string;
  gradePoint: number;
  isPassed: boolean;
}

export interface StudentResult {
  id: string;
  tenantId: string;
  examId: string;
  examName: string;
  studentId: string;
  studentRoll: string;
  studentName: string;
  classId: string;
  className: string;
  section: string;
  subjects: SubjectMarks[];
  totalMarks: number;
  gpa: number;
  grade: string;
  positionInClass: number;
  passed: boolean;
  publishedDate: string;
}

export interface FeeInvoice {
  id: string;
  tenantId: string;
  invoiceNo: string;
  studentId: string;
  studentRoll: string;
  studentName: string;
  className: string;
  feeType: 'tuition' | 'admission' | 'exam' | 'session' | 'transport' | 'hostel' | 'other';
  monthYear: string;
  amount: number;
  discount: number;
  fine: number;
  netAmount: number;
  paidAmount: number;
  status: 'paid' | 'partial' | 'unpaid';
  paymentMethod?: 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Cash';
  paymentDate?: string;
  trxId?: string;
}

export interface AccountTransaction {
  id: string;
  tenantId: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  receiptVoucherNo: string;
  paymentMethod: 'Cash' | 'bKash' | 'Nagad' | 'Rocket' | 'Bank';
}

export interface PayrollRecord {
  id: string;
  tenantId: string;
  employeeType: 'teacher' | 'staff';
  employeeId: string;
  employeeName: string;
  designation: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: 'paid' | 'unpaid';
  paymentDate?: string;
}

export interface LeaveApplication {
  id: string;
  tenantId: string;
  applicantType: 'teacher' | 'staff' | 'student';
  applicantId: string;
  applicantName: string;
  leaveType: 'casual' | 'sick' | 'maternity' | 'emergency';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
}

export interface Notice {
  id: string;
  tenantId: string;
  title: string;
  titleBn: string;
  content: string;
  category: 'academic' | 'exam' | 'admission' | 'holiday' | 'fees' | 'general';
  publishDate: string;
  expiryDate?: string;
  isPublishedToWeb: boolean;
  attachmentName?: string;
}

export interface NewsEvent {
  id: string;
  tenantId: string;
  title: string;
  titleBn: string;
  type: 'news' | 'event' | 'seminar' | 'sports' | 'cultural';
  date: string;
  location?: string;
  description: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  tenantId: string;
  title: string;
  titleBn?: string;
  album: string;
  category?: string;
  description?: string;
  type: 'photo' | 'video';
  url: string;
  date: string;
}

export interface LibraryBook {
  id: string;
  tenantId: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
  rackNo: string;
}

export interface BookIssue {
  id: string;
  tenantId: string;
  bookId: string;
  bookTitle: string;
  memberType: 'student' | 'teacher';
  memberId: string;
  memberName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'issued' | 'returned' | 'overdue';
  fine: number;
}

export interface TransportVehicle {
  id: string;
  tenantId: string;
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
  routeName: string;
  stops: string[];
  capacity: number;
  assignedStudentsCount: number;
  monthlyFee: number;
}

export interface HostelRoom {
  id: string;
  tenantId: string;
  buildingName: string;
  floor: string;
  roomNo: string;
  totalBeds: number;
  occupiedBeds: number;
  feePerMonth: number;
}

export interface InventoryItem {
  id: string;
  tenantId: string;
  itemName: string;
  category: 'furniture' | 'computer' | 'lab_equipment' | 'stationery' | 'sports';
  totalQuantity: number;
  inUseQuantity: number;
  damagedQuantity: number;
  supplier: string;
  unitPrice: number;
}

export interface Homework {
  id: string;
  tenantId: string;
  classId: string;
  className: string;
  section: string;
  subjectName: string;
  teacherName: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
}

export interface CertificateRequest {
  id: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  certificateType: 'transfer' | 'character' | 'testimonial' | 'bonafide' | 'completion';
  certificateNo: string;
  issueDate: string;
  status: 'issued' | 'pending';
}

export interface OnlineAdmission {
  id: string;
  tenantId: string;
  applicationNo: string;
  applicantName: string;
  applicantPhone: string;
  guardianName: string;
  appliedClass: string;
  gender: 'male' | 'female';
  dob: string;
  previousSchool?: string;
  examScore?: number;
  status: 'submitted' | 'admitted' | 'rejected' | 'waiting';
  appliedDate: string;
  admissionFeeStatus: 'paid' | 'unpaid' | 'free' | 'waiver';
  feeType?: 'free' | 'online' | 'cash';
  paymentMethod?: 'free' | 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Cash';
  feeAmount?: number;
  trxId?: string;
  senderPhone?: string;
}

export interface SmsGatewayConfig {
  provider: 'BulkSMSBD' | 'Teletalk' | 'GreenWeb' | 'Twilio' | 'MockGateway';
  senderId: string;
  apiKey: string;
  balanceRemaining: number;
  autoSmsOnAttendance: boolean;
  autoSmsOnFeePayment: boolean;
  autoSmsOnResultPublish: boolean;
}

export interface AuditLog {
  id: string;
  tenantId?: string;
  institutionName?: string;
  actorName: string;
  role: string;
  action: string;
  target: string;
  timestamp: string;
  ipAddress: string;
}
