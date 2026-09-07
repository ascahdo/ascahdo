import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  MatrimonyProfile,
  InterestItem,
  ContactRequestItem,
  ShortlistItem,
  ChatMessage,
  SubscriptionPlan,
  PaymentTransaction,
  VerificationDocument,
  ReportItem,
  SuccessStory,
  BlogPost,
  FAQItem,
  AppNotification,
  AdminActivityLog,
  SiteSettings,
  Gender,
  Religion,
  MaritalStatus,
} from '../types/matrimonyTypes';
import {
  INITIAL_PROFILES,
  SUBSCRIPTION_PLANS,
  SUCCESS_STORIES,
  BLOG_POSTS,
  FAQ_ITEMS,
  INITIAL_SITE_SETTINGS,
  INITIAL_PAYMENTS,
  INITIAL_VERIFICATION_DOCS,
  INITIAL_REPORTS,
  INITIAL_ACTIVITY_LOGS,
} from '../data/mockDatabase';
import { useMatrimonyAuth } from './MatrimonyAuthContext';

export interface SearchFilters {
  gender?: Gender;
  ageMin?: number;
  ageMax?: number;
  heightMin?: string;
  heightMax?: string;
  maritalStatus?: string;
  religion?: string;
  educationLevel?: string;
  professionType?: string;
  division?: string;
  district?: string;
  verifiedOnly?: boolean;
  withPhotoOnly?: boolean;
  membershipTier?: string;
  searchKeyword?: string;
}

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  gender: undefined,
  ageMin: 20,
  ageMax: 40,
  religion: 'All',
  maritalStatus: 'All',
  division: 'all',
  district: 'all',
  professionType: 'All',
  educationLevel: 'All',
  verifiedOnly: false,
  withPhotoOnly: false,
  membershipTier: 'all',
  searchKeyword: '',
};

interface MatrimonyContextType {
  profiles: MatrimonyProfile[];
  currentProfile: MatrimonyProfile | null;
  subscriptionPlans: SubscriptionPlan[];
  successStories: SuccessStory[];
  blogPosts: BlogPost[];
  faqItems: FAQItem[];
  siteSettings: SiteSettings;
  payments: PaymentTransaction[];
  invoices: PaymentTransaction[];
  conversations: any[];
  verificationDocs: VerificationDocument[];
  verificationRequests: VerificationDocument[];
  reports: ReportItem[];
  activityLogs: AdminActivityLog[];
  notifications: AppNotification[];
  interests: InterestItem[];
  contactRequests: ContactRequestItem[];
  shortlists: ShortlistItem[];
  messages: ChatMessage[];
  sqlStatus: { connected: boolean; totalProfiles: number; engine: string };
  searchFilters: SearchFilters;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  // Profile actions
  getProfileById: (id: string) => MatrimonyProfile | undefined;
  updateCurrentProfile: (data: Partial<MatrimonyProfile>) => void;
  updateProfile: (profileId: string, data: Partial<MatrimonyProfile>) => void;
  addNewProfile: (profile: MatrimonyProfile) => void;
  registerProfile: (profileData: Partial<MatrimonyProfile>) => MatrimonyProfile;
  updateProfileByAdmin: (profileId: string, data: Partial<MatrimonyProfile>) => void;
  toggleShortlist: (profileId: string) => boolean;
  isShortlisted: (profileId: string) => boolean;
  getRecommendedMatches: (targetProfile?: MatrimonyProfile | null) => MatrimonyProfile[];
  // Interests
  sendInterest: (receiverProfileId: string, customMessage?: string) => boolean;
  respondToInterest: (interestId: string, status: 'accepted' | 'rejected') => void;
  getInterestStatus: (profileId: string) => 'none' | 'sent_pending' | 'sent_accepted' | 'sent_rejected' | 'received_pending' | 'received_accepted' | 'received_rejected';
  // Contact requests
  sendContactRequest: (receiverProfileId: string) => boolean;
  respondToContactRequest: (requestId: string, status: 'approved' | 'rejected') => void;
  getContactRequestStatus: (profileId: string) => 'none' | 'pending' | 'approved' | 'rejected';
  // Messages
  getConversation: (otherProfileId: string) => ChatMessage[];
  sendMessage: (receiverProfileId: string, content: string) => void;
  getUnreadMessageCount: () => number;
  // Search & Match
  calculateCompatibility: (profileA: MatrimonyProfile, profileB: MatrimonyProfile) => number;
  filterProfiles: (filters: SearchFilters) => MatrimonyProfile[];
  // Verification
  submitVerificationDocument: (doc: Omit<VerificationDocument, 'id' | 'status' | 'submittedAt'>) => void;
  submitVerificationRequest: (userId: string, profileId: string, docType: string, docNumber: string, docImage: string) => void;
  approveVerificationDoc: (docId: string, adminNotes?: string) => void;
  rejectVerificationDoc: (docId: string, reason: string) => void;
  // Payments & Subscription
  processSubscriptionPayment: (planId: string, paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer' | 'Bank Card / Visa / Master' | string, senderPhone?: string, txnId?: string) => PaymentTransaction;
  upgradeSubscription: (planId: string, paymentMethod?: string, txnId?: string) => PaymentTransaction;
  // Reports
  submitReport: (targetProfileId: string, reason: ReportItem['reason'], description: string) => void;
  updateReportStatus: (reportId: string, status: ReportItem['status'], actionTaken?: string) => void;
  // CMS & Admin actions
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  updateSubscriptionPlan: (plan: SubscriptionPlan) => void;
  addBlogPost: (post: Omit<BlogPost, 'id' | 'publishedDate'>) => void;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  addSuccessStory: (story: Omit<SuccessStory, 'id' | 'createdAt'>) => void;
  updateSuccessStory: (id: string, story: Partial<SuccessStory>) => void;
  deleteSuccessStory: (id: string) => void;
  logAdminAction: (action: string, target: string) => void;
  resetAllDataToDefault: () => void;
}

const MatrimonyContext = createContext<MatrimonyContextType | null>(null);

export const MatrimonyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, currentAdmin } = useMatrimonyAuth();

  // 1. Profiles State
  const [profiles, setProfiles] = useState<MatrimonyProfile[]>(() => {
    const saved = localStorage.getItem('bm_profiles');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_PROFILES;
  });

  // 2. Subscriptions State
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(() => {
    const saved = localStorage.getItem('bm_plans');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return SUBSCRIPTION_PLANS;
  });

  // 3. Success Stories State
  const [successStories, setSuccessStories] = useState<SuccessStory[]>(() => {
    const saved = localStorage.getItem('bm_stories');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return SUCCESS_STORIES;
  });

  // 4. Blog Posts State
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('bm_blogs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return BLOG_POSTS;
  });

  // 5. FAQ Items
  const [faqItems] = useState<FAQItem[]>(FAQ_ITEMS);

  // 6. Site Settings
  const [siteSettings, setSiteSettingsState] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('bm_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_SITE_SETTINGS;
  });

  // 7. Payments
  const [payments, setPayments] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('bm_payments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_PAYMENTS;
  });

  // 8. Verification Docs
  const [verificationDocs, setVerificationDocs] = useState<VerificationDocument[]>(() => {
    const saved = localStorage.getItem('bm_vdocs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_VERIFICATION_DOCS;
  });

  // 9. Reports
  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem('bm_reports');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_REPORTS;
  });

  // 10. Admin Activity Logs
  const [activityLogs, setActivityLogs] = useState<AdminActivityLog[]>(() => {
    const saved = localStorage.getItem('bm_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_ACTIVITY_LOGS;
  });

  // 11. Shortlists
  const [shortlists, setShortlists] = useState<ShortlistItem[]>(() => {
    const saved = localStorage.getItem('bm_shortlists');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'sh-1', userId: 'usr-102', profileId: 'MM-100101', createdAt: '2025-10-16' },
      { id: 'sh-2', userId: 'usr-102', profileId: 'MM-100103', createdAt: '2025-11-02' },
    ];
  });

  // 12. Interests
  const [interests, setInterests] = useState<InterestItem[]>(() => {
    const saved = localStorage.getItem('bm_interests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'int-1',
        senderProfileId: 'MM-100102',
        receiverProfileId: 'MM-100101',
        status: 'pending',
        createdAt: '2025-10-18',
        message: 'শ্রদ্ধাশীল অভিবাদন। আপনার প্রোফাইলটি আমাদের পরিবারের খুব পছন্দ হয়েছে।',
      },
      {
        id: 'int-2',
        senderProfileId: 'MM-100104',
        receiverProfileId: 'MM-100103',
        status: 'accepted',
        createdAt: '2025-11-10',
        respondedAt: '2025-11-12',
      }
    ];
  });

  // 13. Contact Requests
  const [contactRequests, setContactRequests] = useState<ContactRequestItem[]>(() => {
    const saved = localStorage.getItem('bm_contact_reqs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'creq-1',
        senderProfileId: 'MM-100102',
        receiverProfileId: 'MM-100101',
        status: 'approved',
        createdAt: '2025-10-20',
        respondedAt: '2025-10-21',
        revealedInfo: {
          mobile: '01819-112233',
          guardianContact: '01711-998877 (পিতা/অভিভাবক)',
          presentAddress: 'ধানমন্ডি, রোড ৮এ, ঢাকা',
        }
      }
    ];
  });

  // 14. Messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('bm_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'msg-1',
        senderProfileId: 'MM-100102',
        receiverProfileId: 'MM-100101',
        content: 'আসসালামু আলাইকুম। কেমন আছেন? আপনাদের পরিবারের সম্মতি থাকলে আমরা আলোচনা এগিয়ে নিতে পারি।',
        text: 'আসসালামু আলাইকুম। কেমন আছেন? আপনাদের পরিবারের সম্মতি থাকলে আমরা আলোচনা এগিয়ে নিতে পারি।',
        timestamp: '2025-10-21 15:30',
        createdAt: '2025-10-21 15:30',
        isRead: true,
      },
      {
        id: 'msg-2',
        senderProfileId: 'MM-100101',
        receiverProfileId: 'MM-100102',
        content: 'ওয়ালাইকুম আসসালাম। জি আলহামদুলিল্লাহ ভালো। আমাদের অভিভাবক আপনাদের অভিভাবকের সাথে কথা বলতে পারেন।',
        text: 'ওয়ালাইকুম আসসালাম। জি আলহামদুলিল্লাহ ভালো। আমাদের অভিভাবক আপনাদের অভিভাবকের সাথে কথা বলতে পারেন।',
        timestamp: '2025-10-21 16:45',
        createdAt: '2025-10-21 16:45',
        isRead: true,
      }
    ];
  });

  // 15. Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('bm_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'notif-1',
        profileId: 'MM-100102',
        type: 'contact_approved',
        titleBn: 'অভিভাবকের নম্বর অনুমোদিত',
        titleEn: 'Contact Request Approved',
        messageBn: 'ডা. ফারহানা (MM-100101) আপনার অভিভাবক নম্বর রিকোয়েস্ট অনুমোদন করেছেন।',
        messageEn: 'Dr. Farhana (MM-100101) has approved your guardian contact request.',
        isRead: false,
        createdAt: '২ ঘণ্টা আগে',
      },
      {
        id: 'notif-2',
        profileId: 'MM-100102',
        type: 'interest_received',
        titleBn: 'নতুন আগ্রহের অনুরোধ',
        titleEn: 'New Express Interest',
        messageBn: 'সাদিয়া তাসনিম আপনার বায়োডাটাতে আগ্রহ প্রকাশ করেছেন।',
        messageEn: 'Sadia Tasnim expressed interest in your profile.',
        isRead: true,
        createdAt: '১ দিন আগে',
      }
    ];
  });

  const [sqlStatus] = useState<{ connected: boolean; totalProfiles: number; engine: string }>({
    connected: true,
    totalProfiles: 6,
    engine: 'PostgreSQL 16 (Cloud SQL asia-southeast1)',
  });

  // Save changes to localStorage
  useEffect(() => { localStorage.setItem('bm_profiles', JSON.stringify(profiles)); }, [profiles]);
  useEffect(() => { localStorage.setItem('bm_plans', JSON.stringify(subscriptionPlans)); }, [subscriptionPlans]);
  useEffect(() => { localStorage.setItem('bm_stories', JSON.stringify(successStories)); }, [successStories]);
  useEffect(() => { localStorage.setItem('bm_blogs', JSON.stringify(blogPosts)); }, [blogPosts]);
  useEffect(() => { localStorage.setItem('bm_settings', JSON.stringify(siteSettings)); }, [siteSettings]);
  useEffect(() => { localStorage.setItem('bm_payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem('bm_vdocs', JSON.stringify(verificationDocs)); }, [verificationDocs]);
  useEffect(() => { localStorage.setItem('bm_reports', JSON.stringify(reports)); }, [reports]);
  useEffect(() => { localStorage.setItem('bm_logs', JSON.stringify(activityLogs)); }, [activityLogs]);
  useEffect(() => { localStorage.setItem('bm_shortlists', JSON.stringify(shortlists)); }, [shortlists]);
  useEffect(() => { localStorage.setItem('bm_interests', JSON.stringify(interests)); }, [interests]);
  useEffect(() => { localStorage.setItem('bm_contact_reqs', JSON.stringify(contactRequests)); }, [contactRequests]);
  useEffect(() => { localStorage.setItem('bm_messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('bm_notifications', JSON.stringify(notifications)); }, [notifications]);

  // Current logged in profile
  const currentProfile = useMemo(() => {
    if (!currentUser) return null;
    return profiles.find(p => p.id === currentUser.profileId || p.userId === currentUser.id) || profiles[1]; // fallback Engr Tanvir
  }, [currentUser, profiles]);

  const getProfileById = (id: string): MatrimonyProfile | undefined => {
    return profiles.find(p => p.id === id);
  };

  const updateCurrentProfile = (data: Partial<MatrimonyProfile>) => {
    if (!currentProfile) return;
    setProfiles(prev => prev.map(p => {
      if (p.id === currentProfile.id) {
        return { ...p, ...data, lastActive: 'আজ সক্রিয়' };
      }
      return p;
    }));
  };

  const updateProfile = (profileId: string, data: Partial<MatrimonyProfile>) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === profileId) {
        return { ...p, ...data, lastActive: 'আজ সক্রিয়' };
      }
      return p;
    }));
  };

  const addNewProfile = (newProfile: MatrimonyProfile) => {
    setProfiles(prev => [newProfile, ...prev]);
    logAdminAction('New User Registered', `${newProfile.fullName} (${newProfile.id})`);
  };

  const registerProfile = (profileData: Partial<MatrimonyProfile>): MatrimonyProfile => {
    const newId = `MM-${Math.floor(100100 + Math.random() * 899800)}`;
    const fullProfile: MatrimonyProfile = {
      id: newId,
      userId: `usr-${Date.now()}`,
      fullName: profileData.fullName || 'নতুন সদস্য',
      displayName: profileData.displayName || profileData.fullName || 'সদস্য',
      gender: profileData.gender || 'female',
      dateOfBirth: profileData.dateOfBirth || '1998-05-15',
      age: profileData.age || 26,
      height: profileData.height || "5' 3\"",
      weight: profileData.weight || '55 kg',
      bloodGroup: profileData.bloodGroup || 'B+',
      complexion: profileData.complexion || 'Fair',
      maritalStatus: profileData.maritalStatus || 'never_married',
      religion: profileData.religion || 'Islam',
      sectReligiousSubtype: profileData.sectReligiousSubtype || 'Sunni',
      nationality: profileData.nationality || 'Bangladeshi',
      motherTongue: profileData.motherTongue || 'Bangla',
      location: profileData.location || {
        country: 'Bangladesh',
        division: 'dhaka',
        district: 'dhaka_dist',
        presentAddress: 'ঢাকা',
        permanentAddress: 'ঢাকা',
      },
      education: profileData.education || {
        level: 'Bachelors / Graduation',
        degree: 'B.Sc / BBA',
        institution: 'University of Dhaka',
      },
      profession: profileData.profession || {
        professionType: 'Private Service / Executive',
        designation: 'Executive Officer',
        organization: 'Reputed Organization',
        monthlyIncomeRange: '৳ ৫০,০০০ - ৮০,০০০',
        employmentType: 'private',
      },
      family: profileData.family || {
        fatherOccupation: 'ব্যবসায়ী',
        motherOccupation: 'গৃহিণী',
        brothersCount: 1,
        sistersCount: 1,
        familyStatus: 'upper_middle_class',
        aboutFamily: 'সম্মানিত ও মার্জিত পরিবার।',
      },
      aboutMe: profileData.aboutMe || 'সহজ-সরল ও দ্বীনি মানসিকতাসম্পন্ন জীবনসঙ্গী খুঁজছি।',
      partnerPreference: profileData.partnerPreference || {
        ageMin: 24,
        ageMax: 32,
        heightMin: "5' 4\"",
        heightMax: "6' 0\"",
        maritalStatus: ['never_married'],
        religion: ['Islam'],
        educationLevels: ['Bachelors', 'Masters'],
        professions: ['Any Respectable'],
      },
      avatarUrl: profileData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      additionalPhotos: [],
      facebookUrl: profileData.facebookUrl,
      verification: {
        mobileVerified: true,
        emailVerified: true,
        identityVerified: false,
        photoVerified: true,
        adminVerified: false,
      },
      verificationStatus: 'unverified',
      privacy: profileData.privacy || {
        profileVisibility: 'public',
        photoVisibility: 'public',
        contactVisibility: 'on_approval',
      },
      guardianContact: profileData.guardianContact,
      status: 'active',
      membershipTier: 'free',
      profileCompletionPercentage: 90,
      viewsCount: 12,
      shortlistedCount: 1,
      createdAt: new Date().toISOString().split('T')[0],
      lastActive: 'আজ সক্রিয়',
    };

    setProfiles(prev => [fullProfile, ...prev]);
    return fullProfile;
  };

  const updateProfileByAdmin = (profileId: string, data: Partial<MatrimonyProfile>) => {
    setProfiles(prev => prev.map(p => (p.id === profileId ? { ...p, ...data } : p)));
    logAdminAction(`Updated profile (${profileId})`, JSON.stringify(Object.keys(data)));
  };

  const toggleShortlist = (profileId: string): boolean => {
    if (!currentUser) return false;
    const exists = shortlists.some(s => s.userId === currentUser.id && s.profileId === profileId);
    if (exists) {
      setShortlists(prev => prev.filter(s => !(s.userId === currentUser.id && s.profileId === profileId)));
      return false;
    } else {
      setShortlists(prev => [...prev, {
        id: `sh-${Date.now()}`,
        userId: currentUser.id,
        profileId,
        createdAt: new Date().toISOString().split('T')[0],
      }]);
      return true;
    }
  };

  const isShortlisted = (profileId: string): boolean => {
    if (!currentUser) return false;
    return shortlists.some(s => s.userId === currentUser.id && s.profileId === profileId);
  };

  const sendInterest = (receiverProfileId: string, customMessage?: string): boolean => {
    if (!currentProfile) return false;
    const existing = interests.find(i => i.senderProfileId === currentProfile.id && i.receiverProfileId === receiverProfileId);
    if (existing) return false;
    const newInterest: InterestItem = {
      id: `int-${Date.now()}`,
      senderProfileId: currentProfile.id,
      receiverProfileId,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      message: customMessage || 'শ্রদ্ধাশীল অভিবাদন। আপনার বায়োডাটাতে আমাদের পরিবারের বিশেষ আগ্রহ রয়েছে।',
    };
    setInterests(prev => [newInterest, ...prev]);
    // Send in-app notification to receiver
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        profileId: receiverProfileId,
        type: 'interest_received',
        titleBn: 'নতুন আগ্রহের অনুরোধ (Interest Received)',
        titleEn: 'New Biodata Express Interest',
        messageBn: `${currentProfile.displayName} (${currentProfile.id}) আপনার বায়োডাটাতে আগ্রহ প্রকাশ করেছেন।`,
        messageEn: `${currentProfile.displayName} (${currentProfile.id}) expressed interest in your biodata.`,
        isRead: false,
        createdAt: 'এইমাত্র',
      },
      ...prev
    ]);
    return true;
  };

  const respondToInterest = (interestId: string, status: 'accepted' | 'rejected') => {
    setInterests(prev => prev.map(i => {
      if (i.id === interestId) {
        return { ...i, status, respondedAt: new Date().toISOString().split('T')[0] };
      }
      return i;
    }));
  };

  const getInterestStatus = (profileId: string) => {
    if (!currentProfile) return 'none';
    const sent = interests.find(i => i.senderProfileId === currentProfile.id && i.receiverProfileId === profileId);
    if (sent) {
      if (sent.status === 'pending') return 'sent_pending';
      if (sent.status === 'accepted') return 'sent_accepted';
      if (sent.status === 'rejected') return 'sent_rejected';
    }
    const received = interests.find(i => i.senderProfileId === profileId && i.receiverProfileId === currentProfile.id);
    if (received) {
      if (received.status === 'pending') return 'received_pending';
      if (received.status === 'accepted') return 'received_accepted';
      if (received.status === 'rejected') return 'received_rejected';
    }
    return 'none';
  };

  const sendContactRequest = (receiverProfileId: string): boolean => {
    if (!currentProfile) return false;
    const existing = contactRequests.find(c => c.senderProfileId === currentProfile.id && c.receiverProfileId === receiverProfileId);
    if (existing) return false;
    const newReq: ContactRequestItem = {
      id: `creq-${Date.now()}`,
      senderProfileId: currentProfile.id,
      receiverProfileId,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setContactRequests(prev => [newReq, ...prev]);
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        profileId: receiverProfileId,
        type: 'contact_approved',
        titleBn: 'অভিভাবক নম্বর রিকোয়েস্ট',
        titleEn: 'Guardian Contact Request',
        messageBn: `${currentProfile.displayName} (${currentProfile.id}) আপনার অভিভাবক নম্বর চেয়েছে।`,
        messageEn: `${currentProfile.displayName} (${currentProfile.id}) requested guardian contact permission.`,
        isRead: false,
        createdAt: 'এইমাত্র',
      },
      ...prev
    ]);
    return true;
  };

  const respondToContactRequest = (requestId: string, status: 'approved' | 'rejected') => {
    setContactRequests(prev => prev.map(c => {
      if (c.id === requestId) {
        const revealed = status === 'approved' ? {
          mobile: '01819-112233',
          guardianContact: '01711-998877 (পিতা/অভিভাবক)',
          presentAddress: 'ধানমন্ডি, ঢাকা',
        } : undefined;
        return { ...c, status, respondedAt: new Date().toISOString().split('T')[0], revealedInfo: revealed };
      }
      return c;
    }));
  };

  const getContactRequestStatus = (profileId: string) => {
    if (!currentProfile) return 'none';
    const req = contactRequests.find(c => c.senderProfileId === currentProfile.id && c.receiverProfileId === profileId);
    if (req) return req.status;
    return 'none';
  };

  const getConversation = (otherProfileId: string): ChatMessage[] => {
    if (!currentProfile) return [];
    return messages.filter(
      m =>
        (m.senderProfileId === currentProfile.id && m.receiverProfileId === otherProfileId) ||
        (m.senderProfileId === otherProfileId && m.receiverProfileId === currentProfile.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const sendMessage = (receiverProfileId: string, content: string) => {
    if (!currentProfile || !content.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderProfileId: currentProfile.id,
      receiverProfileId,
      content: content.trim(),
      text: content.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isRead: false,
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const getUnreadMessageCount = (): number => {
    if (!currentProfile) return 0;
    return messages.filter(m => m.receiverProfileId === currentProfile.id && !m.isRead).length;
  };

  const [searchFilters, setSearchFilters] = useState<SearchFilters>(DEFAULT_SEARCH_FILTERS);

  // Smart Compatibility Algorithm (0 to 100%)
  const calculateCompatibility = (profileA?: MatrimonyProfile | null, profileB?: MatrimonyProfile | null): number => {
    if (!profileA || !profileB) return 50;
    if (profileA.gender && profileB.gender && profileA.gender === profileB.gender) return 0;
    let score = 50; // base score
    // Religion match
    if (profileA.religion && profileB.religion && profileA.religion === profileB.religion) score += 15;
    // Age preference check
    const prefA = profileA.partnerPreference;
    if (prefA && profileB.age && profileB.age >= (prefA.ageMin || 18) && profileB.age <= (prefA.ageMax || 60)) {
      score += 10;
    }
    // District / Division match
    if (prefA && profileB.location) {
      if (
        (prefA.preferredDivisions && profileB.location.division && prefA.preferredDivisions.includes(profileB.location.division)) ||
        (prefA.preferredDistricts && profileB.location.district && prefA.preferredDistricts.includes(profileB.location.district))
      ) {
        score += 10;
      }
    }
    // Education match
    if (prefA?.educationLevels && profileB.education?.level) {
      if (prefA.educationLevels.some(edu => profileB.education.level.includes(edu) || edu.includes(profileB.education.level))) {
        score += 8;
      }
    }
    // Profession match
    if (prefA?.professions && profileB.profession?.professionType) {
      if (prefA.professions.some(prof => profileB.profession.professionType.includes(prof) || prof.includes(profileB.profession.professionType))) {
        score += 7;
      }
    }
    return Math.min(score, 98);
  };

  const getRecommendedMatches = (targetProfile?: MatrimonyProfile | null): MatrimonyProfile[] => {
    const prof = targetProfile || currentProfile;
    if (!prof) {
      return (profiles || []).slice(0, 4);
    }
    const oppositeGender = prof.gender === 'female' ? 'male' : 'female';
    return (profiles || [])
      .filter(p => p && p.id !== prof.id && (p.gender ? p.gender === oppositeGender : true) && p.status !== 'suspended' && p.status !== 'banned')
      .map(p => ({ profile: p, score: calculateCompatibility(prof, p) }))
      .sort((a, b) => b.score - a.score)
      .map(item => item.profile);
  };

  const filterProfiles = (filters?: SearchFilters): MatrimonyProfile[] => {
    if (!filters) return profiles || [];
    return (profiles || []).filter(p => {
      if (!p) return false;
      if (p.status === 'suspended' || p.status === 'banned') return false;
      if (filters.gender && p.gender && p.gender !== filters.gender) return false;
      if (filters.ageMin && p.age && p.age < filters.ageMin) return false;
      if (filters.ageMax && p.age && p.age > filters.ageMax) return false;
      if (filters.religion && filters.religion !== 'All' && p.religion && p.religion !== filters.religion) return false;
      if (filters.maritalStatus && filters.maritalStatus !== 'All' && p.maritalStatus && p.maritalStatus !== filters.maritalStatus) return false;
      if (filters.division && filters.division !== 'all' && p.location?.division && p.location.division !== filters.division) return false;
      if (filters.district && filters.district !== 'all' && p.location?.district && p.location.district !== filters.district) return false;
      if (filters.professionType && filters.professionType !== 'All' && p.profession?.professionType && !p.profession.professionType.toLowerCase().includes(filters.professionType.toLowerCase())) return false;
      if (filters.educationLevel && filters.educationLevel !== 'All' && p.education?.level && !p.education.level.toLowerCase().includes(filters.educationLevel.toLowerCase())) return false;
      if (filters.verifiedOnly && p.verificationStatus !== 'verified') return false;
      if (filters.withPhotoOnly && (!p.avatarUrl || p.privacy?.photoVisibility === 'hidden')) return false;
      if (filters.membershipTier && filters.membershipTier !== 'all' && p.membershipTier && p.membershipTier !== filters.membershipTier) return false;
      if (filters.searchKeyword) {
        const kw = filters.searchKeyword.toLowerCase();
        const matchesKw =
          (p.id && p.id.toLowerCase().includes(kw)) ||
          (p.fullName && p.fullName.toLowerCase().includes(kw)) ||
          (p.displayName && p.displayName.toLowerCase().includes(kw)) ||
          (p.education?.degree && p.education.degree.toLowerCase().includes(kw)) ||
          (p.education?.institution && p.education.institution.toLowerCase().includes(kw)) ||
          (p.profession?.organization && p.profession.organization.toLowerCase().includes(kw)) ||
          (p.profession?.designation && p.profession.designation.toLowerCase().includes(kw)) ||
          (p.aboutMe && p.aboutMe.toLowerCase().includes(kw));
        if (!matchesKw) return false;
      }
      return true;
    });
  };

  // Verification document submit & moderation
  const submitVerificationDocument = (doc: Omit<VerificationDocument, 'id' | 'status' | 'submittedAt'>) => {
    const newDoc: VerificationDocument = {
      ...doc,
      id: `vdoc-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setVerificationDocs(prev => [newDoc, ...prev]);
    if (currentProfile) {
      updateCurrentProfile({ verificationStatus: 'pending' });
    }
  };

  const submitVerificationRequest = (_userId: string, profileId: string, docType: string, docNumber: string, docImage: string) => {
    submitVerificationDocument({
      profileId,
      documentType: docType,
      documentNumber: docNumber,
      documentImageUrl: docImage,
      adminNotes: 'User submitted for verification',
    });
  };

  const approveVerificationDoc = (docId: string, adminNotes?: string) => {
    setVerificationDocs(prev => prev.map(d => {
      if (d.id === docId) {
        setProfiles(profList => profList.map(p => {
          if (p.id === d.profileId) {
            return {
              ...p,
              verificationStatus: 'verified',
              verification: {
                ...p.verification,
                identityVerified: true,
                adminVerified: true,
              }
            };
          }
          return p;
        }));
        return {
          ...d,
          status: 'verified',
          verifiedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          adminNotes: adminNotes || 'Document verified by Admin team.',
        };
      }
      return d;
    }));
    logAdminAction('Approved Verification Document', `Doc ID: ${docId}`);
  };

  const rejectVerificationDoc = (docId: string, reason: string) => {
    setVerificationDocs(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          status: 'rejected',
          adminNotes: reason,
        };
      }
      return d;
    }));
    logAdminAction('Rejected Verification Document', `Doc ID: ${docId}, Reason: ${reason}`);
  };

  // Payment checkout & subscription upgrade
  const processSubscriptionPayment = (
    planId: string,
    paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer' | 'Bank Card / Visa / Master' | string,
    senderPhone?: string,
    txnId?: string
  ): PaymentTransaction => {
    const plan = subscriptionPlans.find(p => p.id === planId) || subscriptionPlans[1];
    const generatedTxn = txnId || `TXN-${paymentMethod.slice(0, 3).toUpperCase()}${Math.floor(10000000 + Math.random() * 90000000)}`;
    const invoiceNum = `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPayment: PaymentTransaction = {
      id: generatedTxn,
      invoiceNumber: invoiceNum,
      userId: currentUser?.id || 'usr-guest',
      profileId: currentProfile?.id || 'MM-100102',
      planId: plan.id,
      planName: plan.nameBn,
      amountBdt: plan.priceBdt,
      paymentMethod,
      transactionId: generatedTxn,
      senderMobileNumber: senderPhone || currentUser?.mobile || '01712-345678',
      status: 'successful',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      approvedByAdmin: 'Instant Gateway Simulation',
    };
    setPayments(prev => [newPayment, ...prev]);
    // Upgrade user profile
    if (currentProfile) {
      updateCurrentProfile({
        membershipTier: plan.id as 'free' | 'standard' | 'premium',
        membershipExpiresAt: new Date(Date.now() + (plan.durationMonths || 3) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    }
    // Add Notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        profileId: currentProfile?.id || 'MM-100102',
        type: 'membership',
        titleBn: 'মেম্বারশিপ প্যাকেজ সক্রিয় হয়েছে!',
        titleEn: 'Membership Package Successfully Activated!',
        messageBn: `আপনার ${plan.nameBn} সফলভাবে সক্রিয় হয়েছে। ইনভয়েস নং: ${invoiceNum}`,
        messageEn: `Your ${plan.nameEn} is active. Invoice No: ${invoiceNum}`,
        isRead: false,
        createdAt: 'এইমাত্র',
      },
      ...prev
    ]);
    return newPayment;
  };

  // Reports
  const submitReport = (targetProfileId: string, reason: ReportItem['reason'], description: string) => {
    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      reporterProfileId: currentProfile?.id || 'MM-100102',
      targetProfileId,
      reason,
      description,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setReports(prev => [newReport, ...prev]);
  };

  const updateReportStatus = (reportId: string, status: ReportItem['status'], actionTaken?: string) => {
    setReports(prev => prev.map(r => (r.id === reportId ? { ...r, status, adminActionTaken: actionTaken } : r)));
    logAdminAction(`Updated Report Status to ${status}`, `Report ID: ${reportId}`);
  };

  // CMS
  const updateSiteSettings = (newSettings: Partial<SiteSettings>) => {
    setSiteSettingsState(prev => ({ ...prev, ...newSettings }));
    logAdminAction('Updated Site Settings', JSON.stringify(Object.keys(newSettings)));
  };

  const updateSubscriptionPlan = (updatedPlan: SubscriptionPlan) => {
    setSubscriptionPlans(prev => prev.map(p => (p.id === updatedPlan.id ? updatedPlan : p)));
    logAdminAction('Updated Subscription Plan', updatedPlan.nameBn);
  };

  const addBlogPost = (post: Omit<BlogPost, 'id' | 'publishedDate'>) => {
    const newPost: BlogPost = {
      ...post,
      id: `blog-${Date.now()}`,
      publishedDate: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
    };
    setBlogPosts(prev => [newPost, ...prev]);
    logAdminAction('Added Blog Article', post.titleBn);
  };

  const updateBlogPost = (id: string, post: Partial<BlogPost>) => {
    setBlogPosts(prev => prev.map(b => (b.id === id ? { ...b, ...post } : b)));
    logAdminAction('Updated Blog Article', `ID: ${id}`);
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts(prev => prev.filter(b => b.id !== id));
    logAdminAction('Deleted Blog Article', `ID: ${id}`);
  };

  const addSuccessStory = (story: Omit<SuccessStory, 'id' | 'createdAt'>) => {
    const newStory: SuccessStory = {
      ...story,
      id: `story-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setSuccessStories(prev => [newStory, ...prev]);
    logAdminAction('Added Success Story', `${story.groomName} & ${story.brideName}`);
  };

  const updateSuccessStory = (id: string, story: Partial<SuccessStory>) => {
    setSuccessStories(prev => prev.map(s => (s.id === id ? { ...s, ...story } : s)));
    logAdminAction('Updated Success Story', `ID: ${id}`);
  };

  const deleteSuccessStory = (id: string) => {
    setSuccessStories(prev => prev.filter(s => s.id !== id));
    logAdminAction('Deleted Success Story', `ID: ${id}`);
  };

  const logAdminAction = (action: string, target: string) => {
    const newLog: AdminActivityLog = {
      id: `log-${Date.now()}`,
      adminName: currentAdmin?.name || 'Super Admin',
      adminRole: currentAdmin?.role || 'super_admin',
      action,
      target,
      ipAddress: '103.145.118.' + Math.floor(10 + Math.random() * 80),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 50)]);
  };

  const resetAllDataToDefault = () => {
    localStorage.clear();
    setProfiles(INITIAL_PROFILES);
    setSubscriptionPlans(SUBSCRIPTION_PLANS);
    setSuccessStories(SUCCESS_STORIES);
    setBlogPosts(BLOG_POSTS);
    setSiteSettingsState(INITIAL_SITE_SETTINGS);
    setPayments(INITIAL_PAYMENTS);
    setVerificationDocs(INITIAL_VERIFICATION_DOCS);
    setReports(INITIAL_REPORTS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    window.location.reload();
  };

  return (
    <MatrimonyContext.Provider
      value={{
        profiles,
        currentProfile,
        subscriptionPlans,
        successStories,
        blogPosts,
        faqItems,
        siteSettings,
        payments,
        invoices: payments,
        conversations: [],
        verificationDocs,
        verificationRequests: verificationDocs,
        reports,
        activityLogs,
        notifications,
        interests,
        contactRequests,
        shortlists,
        messages,
        sqlStatus,
        searchFilters,
        setSearchFilters,
        getProfileById,
        updateCurrentProfile,
        updateProfile,
        addNewProfile,
        registerProfile,
        updateProfileByAdmin,
        toggleShortlist,
        isShortlisted,
        getRecommendedMatches,
        sendInterest,
        respondToInterest,
        getInterestStatus,
        sendContactRequest,
        respondToContactRequest,
        getContactRequestStatus,
        getConversation,
        sendMessage,
        getUnreadMessageCount,
        calculateCompatibility,
        filterProfiles,
        submitVerificationDocument,
        submitVerificationRequest,
        approveVerificationDoc,
        rejectVerificationDoc,
        processSubscriptionPayment,
        upgradeSubscription: (pId: string, method?: string, tId?: string) =>
          processSubscriptionPayment(pId, method || 'bKash', undefined, tId),
        submitReport,
        updateReportStatus,
        updateSiteSettings,
        updateSubscriptionPlan,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        addSuccessStory,
        updateSuccessStory,
        deleteSuccessStory,
        logAdminAction,
        resetAllDataToDefault,
      }}
    >
      {children}
    </MatrimonyContext.Provider>
  );
};

export const useMatrimony = () => {
  const context = useContext(MatrimonyContext);
  if (!context) throw new Error('useMatrimony must be used within MatrimonyProvider');
  return context;
};
