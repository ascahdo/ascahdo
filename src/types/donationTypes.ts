export type DonationFrequency = 'one_time' | 'monthly' | 'yearly';

export type DonationCategoryType =
  | 'helpless_support'       // অসহায় মানুষের সহায়তা
  | 'education_aid'          // শিক্ষা সহায়তা
  | 'medical_aid'            // চিকিৎসা সহায়তা
  | 'food_distribution'      // খাদ্য বিতরণ
  | 'orphan_care'            // এতিম সহায়তা
  | 'disaster_relief'        // দুর্যোগকালীন সহায়তা
  | 'emergency_relief'       // জরুরি ত্রাণ সহায়তা
  | 'winter_clothes'         // শীতবস্ত্র বিতরণ
  | 'flood_relief'           // বন্যা/দুর্যোগ তহবিল
  | 'clean_water'            // বিশুদ্ধ খাবার পানি
  | 'mosque_madrasa'         // মসজিদ/মাদ্রাসা সহায়তা
  | 'youth_development'      // যুব উন্নয়ন ও কর্মসংস্থান
  | 'zakat_fund'             // যাকাত ও ফিতরা তহবিল
  | 'other_general';         // অন্যান্য / সাধারণ কল্যাণ

export type ProjectStatus = 'ongoing' | 'completed' | 'upcoming';

export interface DonationCategoryItem {
  id: DonationCategoryType;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  iconName: string;
  color: string;
  bgColor: string;
  targetAmount?: number;
  targetGoal?: number;
  totalCollected: number;
  totalRaised?: number;
  totalSpent: number;
  activeCampaignsCount: number;
}

export interface EmergencyAppeal {
  id: string;
  title?: string;
  titleBn: string;
  subtitleBn?: string;
  category: any;
  categoryBn?: string;
  urgencyLevel?: 'critical' | 'high' | 'moderate';
  patientOrCauseName?: string;
  hospitalOrLocation?: string;
  locationBn?: string;
  descriptionBn?: string;
  daysLeft?: number;
  targetAmount: number;
  raisedAmount: number;
  donorCount: number;
  imageUrl: string;
  deadline?: string;
  storyBn?: string;
  isEmergency?: boolean;
  isVerified?: boolean;
  status?: 'active' | 'fulfilled' | 'closed';
  createdAt?: string;
}

export interface DonationTier {
  id: string;
  amount: number;
  labelBn: string;
  impactBn: string;
}

export interface DonationRecord {
  id: string;
  receiptNumber: string;
  donorName: string;
  donorPhone: string;
  donorEmail?: string;
  donorDistrict: string;
  isAnonymous: boolean;
  amount: number;
  currency: string;
  donationFrequency: string;
  donationType: string;
  causeId?: string;
  campaignId?: string;
  paymentMethod: string;
  transactionId: string;
  paymentStatus: string;
  donatedAt: string;
  donatedAtBn: string;
  inMemoryOf?: string;
  notes?: string;
  taxExemptionEligible?: boolean;
}

export interface DonationProject {
  id: string;
  title?: string;
  titleBn: string;
  category: DonationCategoryType;
  categoryNameBn?: string;
  status: ProjectStatus;
  targetAmount: number;
  raisedAmount: number;
  spentAmount?: number;
  donorCount: number;
  beneficiariesCount?: number;
  location?: string;
  locationBn?: string;
  imageUrl: string;
  galleryImages?: string[];
  startDate?: string;
  endDate?: string;
  description?: string;
  descriptionBn: string;
  keyObjectives?: string[];
  keyObjectivesBn?: string[];
  isFeatured?: boolean;
}

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'bank' | 'card' | 'qr_code' | 'cash';

export type DonationStatus = 'approved' | 'paid' | 'pending' | 'failed' | 'refunded';

export interface OfficialDonationTransaction {
  id: string;
  receiptNumber: string;         // e.g. ASC-REC-2026-00481
  transactionId: string;         // e.g. BK88419281 or TRX-884192
  donorName: string;
  donorEmail?: string;
  donorPhone: string;
  donorAddress?: string;
  donorDistrict?: string;
  isAnonymous: boolean;
  frequency: DonationFrequency;
  category: DonationCategoryType;
  categoryNameBn: string;
  campaignId?: string;
  campaignTitle?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentAccountNo?: string;
  senderAccountNo?: string;
  status: DonationStatus;
  notesOrPrayer?: string;
  qrCodeData: string;
  verificationUrl?: string;
  certificateNumber?: string;
  isCertificateIssued?: boolean;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface DonationExpense {
  id: string;
  voucherNumber: string;        // e.g. VCH-2026-108
  category: DonationCategoryType;
  categoryNameBn?: string;
  projectId?: string;
  projectTitleBn?: string;
  purpose?: string;
  purposeBn: string;
  amount: number;
  spentDate?: string;
  date?: string;
  recipientOrVendor: string;
  recipientOrVendorBn?: string;
  approvedBy: string;
  proofDocumentUrl?: string;
  locationBn?: string;
  notes?: string;
}

export interface DonorRecognitionItem {
  id: string;
  donorName: string;
  donorDistrict: string;
  donorPhone?: string;
  certificateNumber?: string;
  totalDonationAmount: number;
  donationsCount: number;
  donorType: 'top_donor' | 'monthly_supporter' | 'special_patron' | 'distinguished_donor';
  donorTypeBn: string;
  badgeColor: string;
  joinedDate: string;
  avatarUrl?: string;
  isAnonymous: boolean;
}

export interface CauseItem {
  id: string;
  title: string;
  titleBn: string;
  subtitleBn: string;
  descriptionBn: string;
  iconName: string;
  imageUrl: string;
  targetAmount: number;
  raisedAmount: number;
  beneficiariesCount: number;
  keyPointsBn: string[];
}

export interface RealImpactStory {
  id: string;
  personName: string;
  personNameBn: string;
  location: string;
  locationBn: string;
  avatarUrl: string;
  category: DonationCategoryType;
  categoryNameBn: string;
  quoteBn: string;
  fullStoryBn: string;
  beforeStatusBn: string;
  supportReceivedBn: string;
  afterStatusBn: string;
  impactMetricsBn: string;
  date: string;
}

export interface BeforeAfterItem {
  id: string;
  titleBn: string;
  locationBn: string;
  categoryBn: string;
  descriptionBn: string;
  beforeImageUrl: string;
  beforeLabelBn: string;
  afterImageUrl: string;
  afterLabelBn: string;
  impactHighlightBn: string;
}

export interface VolunteerRegistration {
  id: string;
  volunteerId: string; // e.g. SYF-VOL-2026-084
  fullName: string;
  photoUrl?: string;
  mobile: string;
  email: string;
  address: string;
  district: string;
  occupation: string;
  skills: string[];
  preferredActivity: string;
  preferredActivityBn: string;
  availability: 'weekends' | 'weekdays' | 'emergency_only' | 'full_time';
  emergencyContact: string;
  status: 'pending' | 'approved' | 'active';
  joinedAt: string;
  certificateNumber?: string;
  hoursContributed?: number;
  activitiesCount?: number;
}

export interface CharityEvent {
  id: string;
  title: string;
  titleBn: string;
  dateBn: string;
  rawDate: string;
  timeBn: string;
  locationBn: string;
  categoryBn: string;
  imageUrl: string;
  descriptionBn: string;
  organizerBn: string;
  targetBeneficiariesCount: number;
  registeredVolunteersCount: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface CharityNewsItem {
  id: string;
  title: string;
  titleBn: string;
  categoryBn: string;
  dateBn: string;
  publishedAt: string;
  imageUrl: string;
  shortDescriptionBn: string;
  contentBn: string;
  authorBn: string;
  isFeatured?: boolean;
}

export interface GalleryMediaItem {
  id: string;
  titleBn: string;
  category: 'all' | 'charity' | 'education' | 'healthcare' | 'food' | 'disaster' | 'events' | 'volunteers';
  categoryBn: string;
  mediaType: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  captionBn: string;
  dateBn: string;
}

export interface PartnerItem {
  id: string;
  name: string;
  nameBn: string;
  type: 'corporate' | 'community' | 'supporter' | 'sponsor';
  typeBn: string;
  logoUrl: string;
  websiteUrl?: string;
  contributionHighlightBn: string;
}

export interface TransparencySummary {
  totalCollected: number;
  totalSpent: number;
  reserveBalance: number;
  adminOverheadAmount: number;
  adminOverheadPercentage: number;
  thisMonthReceived: number;
  thisMonthDistributed: number;
  thisMonthAdminCost: number;
  thisMonthRemaining: number;
  totalDonorsCount: number;
  totalBeneficiariesCount?: number;
  totalProjectsCount: number;
  activeAppealsCount: number;
  sectorBreakdown: {
    category: DonationCategoryType;
    categoryNameBn: string;
    collected: number;
    spent: number;
    percentageOfTotal: number;
  }[];
  monthlyReports: {
    month: string;
    monthBn: string;
    collected: number;
    spent: number;
    adminCost?: number;
    distributed?: number;
  }[];
}
