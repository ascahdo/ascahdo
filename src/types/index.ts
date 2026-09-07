export type Language = 'bn' | 'en' | 'ar';

export type UserRole = 
  | 'SUPER_ADMIN'
  | 'ORG_ADMIN'
  | 'BRANCH_MANAGER'
  | 'TEACHER'
  | 'STUDENT'
  | 'DONOR'
  | 'VOLUNTEER'
  | 'DOCTOR_BLOOD_BANK'
  | 'SELLER'
  | 'BUYER'
  | 'GENERAL_USER';

export interface User {
  id: string;
  username?: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  permissions: string[];
  organizationId?: string;
  branchId?: string;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  dateOfBirth?: string;
  address?: string;
  district?: string;
  upazila?: string;
  nid?: string;
  profession?: string;
  avatarUrl?: string;
  mustChangePassword?: boolean;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  nameBn: string;
  code: string;
  regNumber: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  upazila: string;
  activeModules: string[];
  status: 'active' | 'inactive';
  branchesCount: number;
  membersCount: number;
}

export type CommitteeLevel = 'division' | 'district' | 'upazila' | 'union' | 'central';

export interface BranchCommitteeMember {
  id: string;
  memberId?: string; // অটো-জেনারেটেড মেম্বার আইডি (e.g., ASC-COM-DH-01)
  suggestionNumber?: string; // অটো-জেনারেটেড সাজেশন/রেজিস্ট্রেশন নম্বর (e.g., SUG-88219 বা 88219)
  name: string; // নাম
  nameBn?: string;
  fatherName: string; // পিতার নাম
  fatherNameBn?: string;
  motherName?: string;
  motherNameBn?: string;
  designation: string; // পদবি
  designationBn?: string;
  address: string; // ঠিকানা
  addressBn?: string;
  phone?: string; // মোবাইল
  email?: string;
  bloodGroup?: string; // রক্তের গ্রুপ
  photoUrl?: string; // ছবি
  nid?: string;
  joinedDate?: string;
  issueDate?: string;
  validUntil?: string;
  qrCodeData?: string;
  donationFee?: number; // বাধ্যতামূলক কমিটি অনুদান ফি (ডিফল্ট ৳১২৫০)
  donationStatus?: 'paid' | 'unpaid' | 'pending';
  paymentMethod?: 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | string;
  trxId?: string;
  donationReceiptNo?: string;
  donationPaidDate?: string;
  status?: 'active' | 'inactive';
}

export interface Branch {
  id: string;
  organizationId: string;
  organizationName?: string;
  name: string;
  nameBn: string;
  branchCode: string;
  committeeLevel?: CommitteeLevel;
  division?: string;
  divisionBn?: string;
  district: string;
  districtBn?: string;
  upazila: string;
  upazilaBn?: string;
  union?: string;
  unionBn?: string;
  address: string;
  addressBn?: string;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  status: 'active' | 'pending_approval' | 'rejected';
  membersCount: number;
  volunteersCount: number;
  committeeTitle?: string;
  committeeTerm?: string;
  committeePublished?: boolean;
  committeeApprovedAt?: string;
  committeeApprovedBy?: string;
  committeeApprovedByBn?: string;
  committeeMembers?: BranchCommitteeMember[];
  createdAt: string;
}

export interface BloodDonor {
  id: string;
  fullName: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
  phone: string;
  district: string;
  upazila: string;
  lastDonationDate: string;
  available: boolean;
  totalDonations: number;
  age: number;
  gender: 'male' | 'female';
}

export interface BloodInventoryItem {
  id: string;
  bloodGroup: string;
  unitsAvailable: number;
  branchName: string;
  lastUpdated: string;
  criticalThreshold: number;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: string;
  unitsNeeded: number;
  hospitalName: string;
  district: string;
  upazila: string;
  contactPerson: string;
  contactPhone: string;
  urgency: 'critical_emergency' | 'high' | 'normal';
  requiredDate: string;
  status: 'pending' | 'matched' | 'fulfilled' | 'cancelled';
  createdAt: string;
}

export interface DonationCampaign {
  id: string;
  title: string;
  titleBn: string;
  category: 'cash' | 'medical' | 'education' | 'winter_clothes' | 'food_aid' | 'orphan_support' | 'emergency_relief';
  description: string;
  descriptionBn: string;
  targetAmount: number;
  raisedAmount: number;
  donorCount: number;
  imageUrl: string;
  organizationId: string;
  status: 'active' | 'completed';
  deadline: string;
}

export interface DonationTransaction {
  id: string;
  campaignId?: string;
  campaignTitle: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: number;
  paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'bank' | 'card' | 'cash';
  transactionId: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  isAnonymous: boolean;
  certificateUrl?: string;
  date: string;
}

export interface Volunteer {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  skills: string[];
  district: string;
  upazila: string;
  hoursServed: number;
  eventsCount: number;
  idCardNumber: string;
  status: 'active' | 'pending' | 'on_leave';
  joinedDate: string;
}

export interface SchoolStudent {
  id: string;
  rollNumber: string;
  fullName: string;
  class: string;
  section: string;
  guardianName: string;
  guardianPhone: string;
  attendanceRate: number;
  feeStatus: 'paid' | 'due' | 'partial';
  gpa?: number;
  gender: 'male' | 'female';
}

export interface Course {
  id: string;
  title: string;
  titleBn: string;
  category: 'e_learning' | 'youth_dev' | 'technical';
  categoryName: string;
  instructor: string;
  duration: string;
  price: number;
  discountPrice?: number;
  isFree: boolean;
  thumbnail: string;
  totalStudents: number;
  rating: number;
  lessonsCount: number;
  certificateProvided: boolean;
}

export interface SomitiLoan {
  id: string;
  memberId: string;
  memberName: string;
  phone: string;
  loanAmount: number;
  interestRate: number;
  termMonths: number;
  monthlyInstallment: number;
  paidAmount: number;
  dueAmount: number;
  status: 'active' | 'pending_approval' | 'completed' | 'defaulter';
  disbursementDate: string;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  nameBn: string;
  type: 'physical' | 'digital' | 'b2b_wholesale';
  category: string;
  price: number;
  sellerId: string;
  sellerName: string;
  stock: number;
  minOrderQty: number;
  platformCommissionRate: number; // e.g., 0.10 for 10%
  imageUrl: string;
  rating: number;
  verified: boolean;
}

export interface RealEstateProperty {
  id: string;
  title: string;
  titleBn: string;
  propertyType: 'land' | 'flat' | 'house' | 'commercial' | 'rental';
  purpose: 'sale' | 'rent';
  district: string;
  upazila: string;
  mouza?: string;
  dagNumber?: string;
  khatianNumber?: string;
  size: string; // e.g. 5 Decimal or 1500 sq ft
  price: number;
  ownerName: string;
  contactPhone: string;
  isLegallyVerified: boolean;
  verifiedByAdmin?: string;
  images: string[];
  facilities: string[];
  status: 'available' | 'booked' | 'sold';
}

export interface MarriageProfile {
  id: string;
  biodataNumber: string;
  gender: 'male' | 'female';
  age: number;
  height: string;
  complexion: string;
  education: string;
  profession: string;
  monthlyIncome?: string;
  district: string;
  upazila: string;
  maritalStatus: 'unmarried' | 'divorced' | 'widowed';
  partnerPreferences: string;
  photoUrl?: string;
  isVerified: boolean;
  privacyLevel: 'public_preview' | 'verified_only';
}

export interface AuditLog {
  id: string;
  userName: string;
  userRole: string;
  ip: string;
  action: string;
  module: string;
  recordId?: string;
  timestamp: string;
  details: string;
}

export interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
  placement: 'header' | 'hero' | 'sidebar' | 'footer' | 'popup';
  clicks: number;
  impressions: number;
  status: 'active' | 'expired';
}

export interface CMSNotice {
  id: string;
  title: string;
  titleBn: string;
  category: string;
  date: string;
  pdfUrl?: string;
  isUrgent?: boolean;
}

export interface NavigationMenuItem {
  id: string;
  title: string;
  titleBn: string;
  route: string;
  category: 'header_main' | 'programs' | 'economic' | 'footer_quick' | 'footer_legal';
  iconName?: string;
  description?: string;
  descriptionBn?: string;
  badge?: string;
  badgeBn?: string;
  isExternal?: boolean;
  externalUrl?: string;
  order: number;
  isActive: boolean;
  isCustom?: boolean;
  createdAt?: string;
}

export interface SystemSettings {
  general: {
    siteName: string;
    siteNameBn: string;
    slogan?: string;
    sloganBn?: string;
    regNumber?: string;
    estYear?: string;
    helpline: string;
    emergencyPhone?: string;
    supportEmail: string;
    centralAddress?: string;
    centralAddressBn?: string;
    noticeTickerText?: string;
    noticeTickerTextBn?: string;
    defaultCommissionRate: number;
    logoUrl?: string;
  };
  modules: {
    branches: { enabled: boolean; titleBn: string; publicApply: boolean };
    donations: { enabled: boolean; titleBn: string; acceptAnonymous: boolean };
    bloodBank: { enabled: boolean; titleBn: string; liveSos: boolean };
    school: { enabled: boolean; titleBn: string; feeOnline: boolean };
    somiti: { enabled: boolean; titleBn: string; defaultInterestRate: number };
    marketplace: { enabled: boolean; titleBn: string; defaultCommission: number };
    realestate: { enabled: boolean; titleBn: string; verificationRequired: boolean };
    marriage: { enabled: boolean; titleBn: string; privacyControl: boolean };
    training: { enabled: boolean; titleBn: string };
    volunteer: { enabled: boolean; titleBn: string };
    news: { enabled: boolean; titleBn: string };
  };
  paymentGateways: {
    bkash: { enabled: boolean; merchantNumber: string; testMode?: boolean };
    nagad: { enabled: boolean; merchantNumber: string; testMode?: boolean };
    rocket: { enabled: boolean; merchantNumber: string; testMode?: boolean };
    bankTransfer: {
      enabled: boolean;
      bankName: string;
      accountName?: string;
      accountNo: string;
      branch?: string;
      routingNo?: string;
    };
  };
  socialMedia: {
    facebook?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
    whatsapp?: string;
    telegram?: string;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeoutMinutes: number;
    forcedInitialPasswordChange: boolean;
    registrationOpen: boolean;
  };
}

export interface MedicalCourse {
  id: string;
  code: string; // DMA, DPT, DENTAL, DMLT, LMAF, REFRESHER, NURSING, MCSC
  serialNo?: number;
  title: string;
  titleBn: string;
  duration: string;
  durationBn: string;
  eligibility: string;
  eligibilityBn: string;
  totalFee: number;
  admissionFee: number;
  monthlyFee?: number;
  session: string;
  sessionBn: string;
  description: string;
  descriptionBn: string;
  subjects: string[];
  features: string[];
  imageUrl: string;
  badge?: string;
  badgeBn?: string;
  status: 'active' | 'upcoming';
}

export interface MedicalAdmission {
  id: string;
  trackingNumber: string;
  courseId: string;
  courseCode: string;
  courseTitleBn: string;
  admissionDate?: string;
  rollNo?: string;
  session?: string;
  department?: string;
  duration?: string;
  campus?: string;
  
  studentName: string;
  studentNameBn?: string;
  studentNameEn?: string;
  fatherName: string;
  fatherNameBn?: string;
  fatherNameEn?: string;
  motherName: string;
  motherNameBn?: string;
  motherNameEn?: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  bloodGroup: string;
  nidOrBirthReg: string;
  
  address?: string;
  postOffice?: string;
  upazila?: string;
  district?: string;
  division?: string;
  presentAddress: string;
  permanentAddress?: string;
  phone: string;
  guardianPhone: string;
  email?: string;
  
  examName?: string;
  academicQualification?: string;
  sscRoll?: string;
  sscReg?: string;
  gpaOrGrade?: string;
  boardOrInstitute?: string;
  passingYear?: string;
  
  photoUrl?: string;
  nidDocUrl?: string;
  certificateDocUrl?: string;
  studentSignatureUrl?: string;
  guardianSignatureUrl?: string;
  
  paymentMethod: string;
  paymentSenderNo?: string;
  paymentTrxId: string;
  paymentSlipUrl?: string;
  paymentAmount: number;
  
  termsAccepted?: boolean;
  declarationDate?: string;
  status: 'pending' | 'approved' | 'rejected';
  assignedRoll?: string;
  assignedRegNo?: string;
  createdAt: string;
}

export interface MedicalStudent {
  id: string;
  rollNumber: string;
  registrationNumber: string;
  fullName: string;
  fullNameBn: string;
  fatherName: string;
  fatherNameBn?: string;
  motherName: string;
  motherNameBn?: string;
  courseCode: string;
  courseTitleBn: string;
  durationBn: string;
  session: string;
  instituteName: string;
  instituteNameBn: string;
  registrationAuthority: string;
  registrationAuthorityBn: string;
  centerNameBn: string;
  phone: string;
  guardianPhone: string;
  bloodGroup: string;
  address: string;
  addressBn?: string;
  photoUrl: string;
  qrCodeData?: string;
  currentSemester: string;
  cgpa?: number;
  status: 'active' | 'completed' | 'drop';
  issueDate: string;
  expiryDate?: string;
}

export interface MedicalCertificate {
  id: string;
  certificateNo: string;
  studentId: string;
  rollNumber: string;
  registrationNumber: string;
  studentName: string;
  studentNameBn: string;
  fatherNameBn: string;
  motherNameBn: string;
  courseTitleBn: string;
  durationBn: string;
  session: string;
  examYear: string;
  grade: string;
  gpa: number;
  issueDate: string;
  status: 'verified' | 'provisional' | 'revoked';
  verificationUrl?: string;
  qrCodeData?: string;
  remarks?: string;
}

export interface MedicalAdmitCard {
  id: string;
  examTitle: string;
  examTitleBn: string;
  session: string;
  rollNumber: string;
  registrationNumber: string;
  studentNameBn: string;
  fatherNameBn: string;
  courseTitleBn: string;
  centerNameBn: string;
  centerCode: string;
  examStartDate: string;
  photoUrl: string;
  qrCodeData: string;
  subjects: Array<{ code: string; nameBn: string; date: string; time: string }>;
  instructions: string[];
}

export interface MedicalRegistrationCard {
  id: string;
  registrationNumber: string;
  session: string;
  instituteNameBn: string;
  instituteCode: string;
  regAuthorityBn: string;
  approvedRefBn: string;
  studentNameBn: string;
  fatherNameBn: string;
  motherNameBn: string;
  dateOfBirth: string;
  courseTitleBn: string;
  durationBn: string;
  bloodGroup: string;
  photoUrl: string;
  issueDate: string;
  validUntil: string;
  qrCodeData: string;
}

// ==========================================
// SKILL DEVELOPMENT & YOUTH TRAINING PORTAL TYPES
// ==========================================

export type SkillCategory = 
  | 'computer_ict'
  | 'medical_health'
  | 'technical'
  | 'agriculture'
  | 'driving_transport'
  | 'fashion_tailoring'
  | 'beauty_lifestyle'
  | 'business_entrepreneurship'
  | 'language';

export type CourseType = 'online' | 'offline' | 'free' | 'paid' | 'certificate' | 'diploma' | 'short_course' | 'government_approved' | 'international';

export interface TrainingProgram {
  id: string;
  title: string;
  titleBn: string;
  category: SkillCategory;
  categoryName: string;
  categoryNameBn: string;
  courseType: CourseType;
  duration: string;
  durationBn: string;
  totalClasses: number;
  classSchedule: string;
  classScheduleBn: string;
  trainerName: string;
  trainerNameBn: string;
  trainerDesignation: string;
  trainingCenter: string;
  trainingCenterBn: string;
  centerId: string;
  seatCapacity: number;
  enrolledCount: number;
  admissionFee: number;
  courseFee: number;
  discountFee?: number;
  isFree?: boolean;
  startDate: string;
  endDate: string;
  admissionDeadline: string;
  status: 'upcoming' | 'running' | 'completed' | 'admission_open' | 'admission_closed';
  thumbnail: string;
  coverImage?: string;
  curriculum?: Array<{ module: string; topics: string[] }>;
  requirements?: string[];
  certificateType: string;
}

export interface TrainingCenter {
  id: string;
  centerCode: string;
  name: string;
  nameBn: string;
  division: string;
  district: string;
  upazila: string;
  address: string;
  addressBn: string;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  trainersCount: number;
  studentsCount: number;
  coursesCount: number;
  batchesCount: number;
  labCapacity: number;
  accreditationNo?: string;
  status: 'approved' | 'pending' | 'rejected' | 'suspended';
  rating: number;
  establishedYear: string;
  facilities: string[];
}

export interface TrainingBatch {
  id: string;
  batchCode: string;
  batchName: string;
  batchNameBn: string;
  courseId: string;
  courseTitleBn: string;
  trainerId: string;
  trainerName: string;
  centerId: string;
  centerNameBn: string;
  startDate: string;
  endDate: string;
  classTime: string;
  classDays: string[];
  seatCapacity: number;
  enrolledStudentsCount: number;
  status: 'upcoming' | 'running' | 'completed';
}

export interface SkillExam {
  id: string;
  examCode: string;
  title: string;
  titleBn: string;
  courseId: string;
  courseTitleBn: string;
  examType: 'mcq' | 'written' | 'practical' | 'online' | 'offline';
  examDate: string;
  durationMinutes: number;
  totalMarks: number;
  passMarks: number;
  batchCode: string;
  status: 'scheduled' | 'running' | 'completed' | 'published';
}

export interface SkillResult {
  id: string;
  studentId: string;
  studentName: string;
  studentNameBn: string;
  rollNumber: string;
  regNumber: string;
  examId: string;
  courseTitleBn: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  cgpa: number;
  status: 'passed' | 'failed';
  publishedDate: string;
}

export interface SkillJobCircular {
  id: string;
  title: string;
  titleBn: string;
  companyName: string;
  companyNameBn: string;
  category: SkillCategory;
  jobType: 'full_time' | 'part_time' | 'internship' | 'remote' | 'freelance' | 'govt';
  location: string;
  locationBn: string;
  salary: string;
  salaryBn: string;
  vacancy: number;
  deadline: string;
  experienceRequired: string;
  skillsRequired: string[];
  applyLink?: string;
  status: 'open' | 'closed';
  postedAt: string;
}

export interface SkillTrainer {
  id: string;
  name: string;
  nameBn: string;
  email: string;
  phone: string;
  photoUrl: string;
  designation: string;
  designationBn: string;
  specialization: string;
  experienceYears: number;
  centerNameBn: string;
  rating: number;
  totalStudentsTrained: number;
}


