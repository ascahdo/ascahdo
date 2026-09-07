export type Language = 'bn' | 'en';
export type Gender = 'female' | 'male';
export type Religion = 'Islam' | 'Hinduism' | 'Christianity' | 'Buddhism' | 'Other';
export type MaritalStatus = 'never_married' | 'divorced' | 'widowed' | 'separated';
export type FamilyType = 'nuclear' | 'joint';
export type FamilyStatus = 'middle_class' | 'upper_middle_class' | 'rich' | 'affluent';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type UserStatus = 'active' | 'pending_approval' | 'suspended' | 'banned';
export type PhotoVisibility = 'everyone' | 'registered_only' | 'on_request' | 'hidden';
export type ContactVisibility = 'hidden' | 'on_approval' | 'premium_only';
export type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'verification_officer' | 'support_staff' | 'content_manager';

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'bank' | 'card' | string;

export interface Invoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  profileId: string;
  planId: string;
  planName: string;
  amountBdt: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  date: string;
  status: 'paid' | 'pending' | 'failed';
}

export interface LocationInfo {
  division: string;
  district: string;
  upazila?: string;
  presentAddress?: string;
  permanentAddress?: string;
  country: string;
  residentialStatus?: 'citizen' | 'permanent_resident' | 'work_permit' | 'student_visa';
}

export interface EducationInfo {
  level: string; // e.g., 'Masters', 'Bachelors', 'Doctorate', 'HSC', 'Dakhil/Alim'
  degree: string; // e.g., 'MBBS', 'B.Sc in CSE', 'BBA', 'LLB', 'Kamil'
  institution: string;
  passingYear?: number;
  additionalDegree?: string;
}

export interface ProfessionInfo {
  professionType: string;
  organization: string;
  designation: string;
  monthlyIncomeRange: string;
  employmentType: 'government' | 'private' | 'business' | 'freelance' | 'overseas';
}

export interface FamilyInfo {
  fatherName?: string;
  fatherOccupation: string;
  motherName?: string;
  motherOccupation: string;
  brothersCount: number;
  sistersCount: number;
  familyType?: FamilyType;
  familyStatus: FamilyStatus;
  familyValues?: 'traditional' | 'moderate' | 'religious' | 'modern';
  aboutFamily?: string;
}

export interface PartnerPreference {
  ageMin: number;
  ageMax: number;
  heightMin: string;
  heightMax: string;
  maritalStatus: MaritalStatus[];
  religion: Religion[] | string[];
  educationLevels: string[];
  professions: string[];
  preferredDistricts?: string[];
  preferredDivisions?: string[];
  locations?: string[];
  familyStatus?: FamilyStatus[];
  specialExpectations?: string;
}

export interface PrivacySettings {
  profileVisibility?: 'public' | 'registered_only' | 'hidden';
  photoVisibility?: PhotoVisibility | string;
  contactVisibility?: ContactVisibility | string;
  phoneVisibility?: string;
  hidePhone?: boolean;
  hideEmail?: boolean;
  hideIncome?: boolean;
  hideFamilyDetails?: boolean;
  hideExactAddress?: boolean;
  hideFromSearch?: boolean;
}

export interface VerificationBadges {
  mobileVerified: boolean;
  emailVerified: boolean;
  identityVerified: boolean; // NID / Passport
  photoVerified: boolean;
  adminVerified: boolean;
}

export interface MatrimonyProfile {
  id: string; // e.g. "MM-100101"
  userId: string;
  fullName: string;
  displayName: string;
  gender: Gender;
  dateOfBirth: string;
  age: number;
  height: string; // e.g. "5' 6\""
  weight?: string; // e.g. "62 kg"
  bloodGroup?: string;
  complexion?: string;
  maritalStatus: MaritalStatus;
  religion: Religion;
  sectReligiousSubtype?: string; // Sunni, Shia, etc.
  nationality: string;
  motherTongue: string;
  // Sections
  location: LocationInfo;
  education: EducationInfo;
  profession: ProfessionInfo;
  family: FamilyInfo;
  aboutMe: string;
  hobbies?: string[];
  dietHabits?: string;
  smokingHabit?: 'no' | 'occasionally' | 'yes';
  namazPrayerHabit?: 'regular_5_times' | 'regular' | 'occasional' | 'jummah_only';
  // Partner Preferences
  partnerPreference: PartnerPreference;
  // Media
  avatarUrl: string;
  additionalPhotos: string[];
  facebookUrl?: string;
  // Verification
  verification: VerificationBadges;
  verificationStatus: VerificationStatus;
  // Privacy
  privacy: PrivacySettings;
  // Guardian and Private Contacts
  guardianContact?: {
    guardianName?: string;
    guardianRelationship?: string;
    guardianContact?: string;
    revealedToUsers?: string[];
  };
  contactInfo?: {
    mobile?: string;
    email?: string;
    guardianContact?: string;
    facebookUrl?: string;
  };
  // System metrics
  status: UserStatus;
  membershipTier: 'free' | 'standard' | 'premium';
  membershipExpiresAt?: string;
  profileCompletionPercentage: number;
  viewsCount: number;
  shortlistedCount: number;
  createdAt: string;
  lastActive: string;
  featured?: boolean;
}

export interface UserAccount {
  id: string;
  email: string;
  mobile: string;
  role: 'user' | 'admin';
  profileId: string;
  createdAt: string;
  twoFactorEnabled?: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  lastLogin: string;
  status: 'active' | 'suspended';
  phone?: string;
}

export interface InterestItem {
  id: string;
  senderProfileId: string;
  receiverProfileId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  respondedAt?: string;
  message?: string;
}

export interface ContactRequestItem {
  id: string;
  senderProfileId: string;
  receiverProfileId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  respondedAt?: string;
  revealedInfo?: {
    mobile?: string;
    email?: string;
    guardianContact?: string;
    presentAddress?: string;
    facebookUrl?: string;
  };
}

export interface ShortlistItem {
  id: string;
  userId: string;
  profileId: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderProfileId: string;
  receiverProfileId: string;
  content?: string;
  text?: string;
  timestamp: string;
  createdAt?: string;
  isRead: boolean;
}

export interface SubscriptionPlan {
  id: string;
  nameBn: string;
  nameEn: string;
  badgeTextBn?: string;
  badgeTextEn?: string;
  priceBdt: number;
  durationMonths: number;
  validityDays?: number;
  featuresBn: string[];
  featuresEn: string[];
  contactViewLimit: number;
  directMessageEnabled: boolean;
  priorityListing: boolean;
  featuredBadge: boolean;
  dedicatedRelationshipManager: boolean;
  isActive: boolean;
}

export interface PaymentTransaction {
  id: string;
  invoiceNumber: string;
  userId: string;
  profileId: string;
  planId: string;
  planName: string;
  amountBdt: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer' | 'Bank Card / Visa / Master' | string;
  transactionId: string;
  senderMobileNumber?: string;
  senderBankName?: string;
  senderAccountName?: string;
  depositSlipRef?: string;
  status: 'successful' | 'pending' | 'processing' | 'failed' | 'refunded';
  createdAt: string;
  approvedByAdmin?: string;
}

export interface VerificationDocument {
  id: string;
  profileId: string;
  documentType: 'nid' | 'passport' | 'office_id' | 'educational_certificate' | string;
  documentNumber: string;
  documentImageUrl: string;
  status: VerificationStatus | string;
  submittedAt: string;
  verifiedAt?: string;
  adminNotes?: string;
}

export interface ReportItem {
  id: string;
  reporterProfileId: string;
  targetProfileId: string;
  reason: 'fake_profile' | 'fraud' | 'harassment' | 'inappropriate_content' | 'misleading_info' | 'unauthorized_contact' | 'already_married' | 'other';
  description: string;
  status: 'pending' | 'under_review' | 'resolved' | 'rejected';
  createdAt: string;
  adminActionTaken?: string;
}

export interface SuccessStory {
  id: string;
  groomName: string;
  brideName: string;
  marriageDate: string;
  location: string;
  imageUrl: string;
  storyBn: string;
  storyEn: string;
  isApproved: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  titleBn: string;
  titleEn: string;
  slug: string;
  summaryBn: string;
  summaryEn: string;
  contentBn: string;
  contentEn: string;
  category: 'advice' | 'islamic_guidelines' | 'wedding_tips' | 'safety' | 'success_tips' | string;
  author: string;
  readTime: string;
  imageUrl: string;
  publishedDate: string;
  isPublished: boolean;
}

export interface FAQItem {
  id: string;
  questionBn: string;
  questionEn: string;
  answerBn: string;
  answerEn: string;
  category: 'registration' | 'verification' | 'privacy' | 'membership' | 'matching';
}

export interface AppNotification {
  id: string;
  profileId: string;
  type: 'interest_received' | 'interest_accepted' | 'contact_approved' | 'message' | 'verification' | 'membership' | 'system';
  titleBn: string;
  titleEn: string;
  messageBn: string;
  messageEn: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface AdminActivityLog {
  id: string;
  adminName: string;
  adminRole: AdminRole;
  action: string;
  target: string;
  ipAddress: string;
  timestamp: string;
}

export interface SiteSettings {
  siteNameBn: string;
  siteNameEn: string;
  taglineBn: string;
  taglineEn: string;
  helplinePhone: string;
  whatsappNumber: string;
  supportEmail: string;
  dhakaOfficeAddress: string;
  chittagongOfficeAddress: string;
  requireNidForContact: boolean;
  autoApproveProfiles: boolean;
  maintenanceMode: boolean;
  smsGatewayEnabled: boolean;
  emailAlertsEnabled: boolean;
  currencySymbol: string;
  allowPublicGuestSearch: boolean;
  // Payment methods
  bkashNumber?: string;
  bkashType?: string;
  nagadNumber?: string;
  nagadType?: string;
  rocketNumber?: string;
  rocketType?: string;
  // Bank details
  bankName?: string;
  bankBranch?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  // Custom Payment notes & instructions
  paymentInstructionsBn?: string;
  paymentInstructionsEn?: string;
  customPaymentNote?: string;
}
