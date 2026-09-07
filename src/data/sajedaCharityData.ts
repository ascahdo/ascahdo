import {
  CauseItem,
  EmergencyAppeal,
  DonationProject,
  RealImpactStory,
  BeforeAfterItem,
  VolunteerRegistration,
  CharityEvent,
  CharityNewsItem,
  GalleryMediaItem,
  PartnerItem,
  TransparencySummary,
  DonorRecognitionItem
} from '../types/donationTypes';

export const SYF_BRAND = {
  nameBn: 'সাজেদা ইয়ুথ ফাউন্ডেশন',
  nameEn: 'Sajeda Youth Foundation',
  shortName: 'SYF',
  taglineBn: 'আপনার ছোট্ট সহযোগিতাই হতে পারে কারও জীবনের বড় পরিবর্তন।',
  heroTaglineBn: 'একটি ভালো কাজ, একটি সুন্দর ভবিষ্যৎ।',
  sloganBn: 'মানবতার পাশে, পরিবর্তনের পথে।',
  altSloganBn: 'আপনার সহযোগিতায় বদলে যাক একটি জীবন।',
  foundedYear: '২০১৮',
  registrationNo: 'GOVT-REG-DH-88219/2019',
  addressBn: 'সাজেদা ভবন, হাউজ #৪২, রোড #০৭, ধানমন্ডি, ঢাকা-১২০৫',
  phone: '+880 1711-223344',
  helpline: '+880 9612 000111',
  email: 'info@sajedayouth.org',
  donationEmail: 'donate@sajedayouth.org',
  whatsapp: '+8801711223344',
  facebook: 'https://facebook.com/sajedayouthfoundation',
  youtube: 'https://youtube.com/@sajedayouth',
  instagram: 'https://instagram.com/sajedayouth',
  linkedin: 'https://linkedin.com/company/sajeda-youth-foundation'
};

export const SYF_HERO_STATS = [
  { labelBn: 'উপকারভোগী জীবন', labelEn: 'Lives Supported', value: '১০,০০০+', numericValue: 10450, icon: 'Users' },
  { labelBn: 'আওতাভুক্ত জনপদ', labelEn: 'Communities', value: '৫০+ টি', numericValue: 54, icon: 'MapPin' },
  { labelBn: 'বাস্তবায়িত প্রকল্প', labelEn: 'Projects Completed', value: '১০০+ টি', numericValue: 108, icon: 'Building2' },
  { labelBn: 'আর্থিক স্বচ্ছতা', labelEn: 'Transparency Rate', value: '৯৮%', numericValue: 98, icon: 'ShieldCheck' }
];

export const SYF_TRUST_PILLARS = [
  {
    id: 'transparent',
    titleBn: '১০০% স্বচ্ছ অনুদান ব্যবস্থাপনা',
    titleEn: 'Transparent Donations',
    descBn: 'প্রতিটি টাকার হিসাব ডিজিটাল লেজারে উন্মুক্ত এবং অডিটেড ভাউচার সহ প্রকাশিত।',
    icon: 'TrendingUp'
  },
  {
    id: 'verified',
    titleBn: 'সরেজমিন ভেরিফাইড ক্যাম্পেইন',
    titleEn: 'Verified Campaigns',
    descBn: 'আমাদের ফিল্ড টিম সরাসরি গিয়ে পরিবার ও রোগীর তথ্য নিখুঁতভাবে যাচাই করে।',
    icon: 'ShieldCheck'
  },
  {
    id: 'real_impact',
    titleBn: 'টেকসই বাস্তব পরিবর্তন',
    titleEn: 'Real Impact',
    descBn: 'সাময়িক ত্রাণের পাশাপাশি স্থায়ী স্বাবলম্বীকরণ ও কর্মসংস্থান নিশ্চিতকরণ।',
    icon: 'HeartHandshake'
  },
  {
    id: 'secure_pay',
    titleBn: 'নিরাপদ পেমেন্ট ও ডিজিটাল রসিদ',
    titleEn: 'Secure Payments & Receipts',
    descBn: 'বিকাশ, নগদ, ব্যাংক বা কার্ডে অনুদানের সাথে সাথেই QR ভেরিফাইড মানি রসিদ।',
    icon: 'Lock'
  }
];

export const SYF_6_CAUSES: CauseItem[] = [
  {
    id: 'education',
    title: 'Education',
    titleBn: 'শিক্ষা সহায়তা ও শিশু বিদ্যাপীঠ',
    subtitleBn: 'শিক্ষার সুযোগ থেকে বঞ্চিত শিশুদের পাশে দাঁড়ানো',
    descriptionBn: 'দরিদ্র ও পথশিশুদের স্কুল ফি, বই-খাতা, স্কুল ড্রেস এবং সান্ধ্যকালীন মৌলিক সাক্ষরতা ক্লাস পরিচালনা।',
    iconName: 'GraduationCap',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    targetAmount: 1200000,
    raisedAmount: 850000,
    beneficiariesCount: 850,
    keyPointsBn: ['৮৫০+ সুবিধাবঞ্চিত শিক্ষার্থীর দায়িত্ব', 'বিনামূল্যে বই ও স্টেশনারি বিতরণ', 'সান্ধ্যকালীন গণশিক্ষা কেন্দ্র']
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    titleBn: 'স্বাস্থ্যসেবা ও মুমূর্ষু চিকিৎসা',
    subtitleBn: 'অসহায় ও দরিদ্র মানুষের চিকিৎসা সহায়তা',
    descriptionBn: 'দরিদ্র রোগীদের জীবনরক্ষাকারী ওষুধ, কিডনি ডায়ালাইসিস, হার্ট সার্জারি ও বিনামূল্যে ভ্রাম্যমাণ হেলথ ক্যাম্প।',
    iconName: 'Stethoscope',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    targetAmount: 2000000,
    raisedAmount: 1450000,
    beneficiariesCount: 1200,
    keyPointsBn: ['বিনামূল্যে জরুরি ওষুধ ও ডায়ালাইসিস', 'বিশেষায়িত সার্জারি অনুদান', 'ফ্রি মেডিকেল ও চক্ষু ক্যাম্প']
  },
  {
    id: 'food_relief',
    title: 'Food Relief',
    titleBn: 'ক্ষুধা নিবারণ ও খাদ্য সহায়তা',
    subtitleBn: 'ক্ষুধার্ত পরিবার ও মানুষের জন্য খাদ্য সহায়তা',
    descriptionBn: 'দুঃস্থ পরিবারে ১ মাসের পুষ্টিকর চাল-ডাল-তেল সম্বলিত ফুড প্যাক বিতরণ এবং অনাহারী মানুষের মাঝে তৈরি খাবার পরিবেশন।',
    iconName: 'Utensils',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
    targetAmount: 1500000,
    raisedAmount: 1120000,
    beneficiariesCount: 2500,
    keyPointsBn: ['মাসিক পারিবারিক খাদ্য রেশন বিতরণ', 'জরুরি গরম খাবার বিতরণ ভ্যান', 'পুষ্টিহীন শিশুদের বিশেষ খাদ্য']
  },
  {
    id: 'clean_water',
    title: 'Clean Water',
    titleBn: 'নিরাপদ পানি ও স্যানিটেশন',
    subtitleBn: 'নিরাপদ পানি ও স্যানিটেশন নিশ্চিত করতে সহায়তা',
    descriptionBn: 'উপকূলীয় ও লবণাক্ত অঞ্চলে গভীর নলকূপ, ওয়াটার ফিল্ট্রেশন প্ল্যান্ট এবং স্বাস্থ্যসম্মত স্যানিটারি ল্যাট্রিন স্থাপন।',
    iconName: 'Droplets',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80',
    targetAmount: 1800000,
    raisedAmount: 1350000,
    beneficiariesCount: 4200,
    keyPointsBn: ['গভীর সৌরচালিত নলকূপ স্থাপন', 'আর্সেনিক ও লবণাক্ততামুক্ত পানি', 'স্বাস্থ্যসম্মত টয়লেট নির্মাণ']
  },
  {
    id: 'child_protection',
    title: 'Child Protection',
    titleBn: 'শিশু সুরক্ষা ও এতিম প্রতিপালন',
    subtitleBn: 'শিশুদের নিরাপত্তা, শিক্ষা ও অধিকার নিয়ে কাজ করা',
    descriptionBn: 'পিতৃহীন ও ঝুঁকিপূর্ণ শিশুদের নিরাপদ আশ্রয়, মনস্তাত্ত্বিক পরিচর্যা, কারিগরি শিক্ষা ও পুনর্বাসন উদ্যোগ।',
    iconName: 'Baby',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    targetAmount: 1000000,
    raisedAmount: 780000,
    beneficiariesCount: 350,
    keyPointsBn: ['এতিম শিশুদের পূর্ণকালীন স্পন্সরশিপ', 'শিশুশ্রম নিরসন ও পুনর্বাসন', 'মানসিক স্বাস্থ্য ও সুরক্ষাসেবা']
  },
  {
    id: 'disaster_relief',
    title: 'Disaster Relief',
    titleBn: 'দুর্যোগকালীন জরুরি ত্রাণ ও পুনর্বাসন',
    subtitleBn: 'বন্যা, ঘূর্ণিঝড় ও অন্যান্য দুর্যোগে জরুরি সহায়তা',
    descriptionBn: 'আকস্মিক বন্যা, পাহাড়ি ধস, অগ্নিকাণ্ড ও শীতের প্রকোপে ক্ষতিগ্রস্ত মানুষের দ্রুত উদ্ধার ও ঘরবাড়ি পুনর্নির্মাণ।',
    iconName: 'Flame',
    imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80',
    targetAmount: 2500000,
    raisedAmount: 1980000,
    beneficiariesCount: 5000,
    keyPointsBn: ['বন্যা ও ঘূর্ণিঝড়ে স্পিডবোট রেসকিউ', 'টিন ও গৃহনির্মাণ সামগ্রী বিতরণ', 'শীতবস্ত্র ও কম্বল বিতরণ ক্যাম্প']
  }
];

export const SYF_FEATURED_CAMPAIGNS: EmergencyAppeal[] = [
  {
    id: 'syf_camp_01',
    title: 'Urgent Heart Surgery for 6-Year-Old Orphan Ariana',
    titleBn: '৬ বছর বয়সী পিতৃহীন আরিয়ানার জরুরি ওপেন হার্ট সার্জারি',
    subtitleBn: 'জরুরি অপারেশনের ব্যবস্থা না হলে শিশুটির বেঁচে থাকা অসম্ভব।',
    category: 'medical_aid',
    urgencyLevel: 'critical',
    patientOrCauseName: 'Ariana Khatun (আরিয়ানা খাতুন)',
    hospitalOrLocation: 'জাতীয় হৃদরোগ ইনস্টিটিউট, ঢাকা',
    locationBn: 'ঢাকা ও নোয়াখালী',
    targetAmount: 500000,
    raisedAmount: 325000,
    donorCount: 184,
    daysLeft: 12,
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
    deadline: '2026-09-18',
    storyBn: 'আরিয়ানার বাবা সড়ক দুর্ঘটনায় মারা যান। মা পরের বাড়িতে গৃহকর্মীর কাজ করে কোনোমতে একবেলা ভাত জোগাড় করেন। আরিয়ানার হার্টে দুটি ছিদ্র ধরা পড়েছে। চিকিৎসকরা জানিয়েছেন আর কয়েক সপ্তাহের মধ্যে সার্জারি না করলে তাকে বাঁচানো যাবে না।',
    isVerified: true,
    status: 'active',
    createdAt: '2026-08-15T09:00:00Z'
  },
  {
    id: 'syf_camp_02',
    title: 'Emergency Flood Relief & Food Assistance for Feni & Noakhali',
    titleBn: 'বন্যার্ত পরিবারের জন্য জরুরি খাদ্য ও নিরাপদ পানি সহায়তা',
    subtitleBn: 'পানিবন্দী মানুষের দ্বারে দ্বারে বোটের মাধ্যমে খাবার পৌঁছে দেওয়া হচ্ছে।',
    category: 'flood_relief',
    urgencyLevel: 'critical',
    patientOrCauseName: 'বন্যাদুর্গত ৫০০০+ পরিবার',
    hospitalOrLocation: 'ফেনী, পরশুরাম ও নোয়াখালী সদর',
    locationBn: 'ফেনী ও নোয়াখালী',
    targetAmount: 1500000,
    raisedAmount: 1080000,
    donorCount: 420,
    daysLeft: 8,
    imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80',
    deadline: '2026-09-10',
    storyBn: 'উজানের পাহাড়ি ঢল ও আকস্মিক বন্যায় তলিয়ে গেছে হাজার হাজার ঘরবাড়ি। বিশুদ্ধ পানি ও খাবারের তীব্র সংকট তৈরি হয়েছে। সাজেদা ইয়ুথ ফাউন্ডেশনের তরুণ স্বেচ্ছাসেবক টিম দিন-রাত নৌকা দিয়ে খাবার, স্যালাইন ও ওষুধ পৌঁছে দিচ্ছে।',
    isVerified: true,
    status: 'active',
    createdAt: '2026-08-18T11:00:00Z'
  },
  {
    id: 'syf_camp_03',
    title: 'Educational Sponsorship for 100 Underprivileged Street Children',
    titleBn: 'অসহায় ১০০ শিক্ষার্থীর বাৎসরিক শিক্ষা ও স্কুল ভর্তি সহায়তা',
    subtitleBn: 'টাকার অভাবে যাদের বই কেনা ও স্কুলে যাওয়া বন্ধ হয়ে যাচ্ছিল।',
    category: 'education_aid',
    urgencyLevel: 'high',
    patientOrCauseName: '১০০ জন সুবিধাবঞ্চিত শিক্ষার্থী',
    hospitalOrLocation: 'কুড়িগ্রাম ও রায়েরবাজার বস্তি',
    locationBn: 'কুড়িগ্রাম ও ঢাকা',
    targetAmount: 600000,
    raisedAmount: 430000,
    donorCount: 215,
    daysLeft: 22,
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    deadline: '2026-09-30',
    storyBn: 'দারিদ্র্যের কারণে অনেক মেধাবী শিশু ড্রপআউট হয়ে শিশুশ্রমে বাধ্য হচ্ছে। এই ক্যাম্পেইনের মাধ্যমে তাদের পুরো বছরের বেতন, ইউনিফর্ম, বই-খাতা এবং প্রতিদিনের পুষ্টিকর টিফিন নিশ্চিত করা হচ্ছে।',
    isVerified: true,
    status: 'active',
    createdAt: '2026-08-20T10:00:00Z'
  }
];

export const SYF_REAL_STORIES: RealImpactStory[] = [
  {
    id: 'story_01',
    personName: 'Amena Begum',
    personNameBn: 'আমেনা বেগম (৩৮)',
    location: 'Kurigram Char Area',
    locationBn: 'কুড়িগ্রাম চরাঞ্চল',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    category: 'youth_development',
    categoryNameBn: 'স্বাবলম্বীকরণ ও সেলাই প্রশিক্ষণ',
    quoteBn: '“স্বামীর মৃত্যুর পর দুই সন্তান নিয়ে না খেয়ে দিন কেটেছে। সাজেদা ইয়ুথ ফাউন্ডেশনের সেলাই মেশিন পেয়ে আজ আমি নিজের পায়ে দাঁড়িয়েছি।”',
    fullStoryBn: 'আমেনা বেগমের স্বামী নদীভাঙনে ভিটেমাটি হারানোর পর হঠাৎ মারা যান। কোনো আয় না থাকায় সন্তানদের স্কুলে পাঠানো বন্ধ হয়ে যায়। সাজেদা ইয়ুথ ফাউন্ডেশন তাকে ১ মাসের ফ্রি ট্রেইনিং করিয়ে একটি ব্র্যান্ড নিউ সেলাই মেশিন এবং কাপড় তৈরির প্রাথমিক পুঁজি উপহার দেয়। বর্তমানে তিনি গ্রামের কাপড়ের অর্ডার নিয়ে মাসে ৮-১০ হাজার টাকা আয় করছেন।',
    beforeStatusBn: 'দৈনিক আয়ের কোনো উৎস ছিল না, দুই সন্তান স্কুল থেকে ড্রপআউট হয়ে অনাহারে দিনাতিপাত করছিল।',
    supportReceivedBn: 'টেইলারিং কারিগরি প্রশিক্ষণ, বিনামূল্যে সেলাই মেশিন ও ৫,০০০ টাকার কাপড় কেনার প্রারম্ভিক পুঁজি।',
    afterStatusBn: 'মাসে ৮,৫০০+ টাকা নিয়মিত আয়, সন্তানদের স্কুলে পুনঃভর্তি এবং নিজস্ব ব্যাংক সঞ্চয়।',
    impactMetricsBn: '১টি সম্পূর্ণ পরিবার টেকসইভাবে দারিদ্র্যমুক্ত',
    date: '২০২৬-০৫-১২'
  },
  {
    id: 'story_02',
    personName: 'Rashedul Islam',
    personNameBn: 'রাশেদুল ইসলাম (১২)',
    location: 'Rayerbazar Slum, Dhaka',
    locationBn: 'রায়েরবাজার বেড়িবাঁধ, ঢাকা',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    category: 'education_aid',
    categoryNameBn: 'শিক্ষা উপবৃত্তি ও স্কুলিং',
    quoteBn: '“আমি রাস্তায় বোতল কুড়াতাম। এখন আমি প্রতিদিন স্কুলে যাই, ক্লাসে প্রথম হয়েছি।”',
    fullStoryBn: 'রাশেদের বাবা রিকশাচালক ছিলেন এবং পঙ্গু হয়ে শয্যাশায়ী হন। ফলে রাশেদকে স্কুলের বদলে প্লাস্টিকের বোতল টোকাতে হতো। সাজেদা ইয়ুথ ফাউন্ডেশনের স্বেচ্ছাসেবী টিম তাকে খুঁজে পায় এবং আমাদের "আলোর পাঠশালা" প্রকল্পে অন্তর্ভুক্ত করে। তার সম্পূর্ণ পড়ালেখা, দুপুরের পুষ্টিকর খাবার ও বাবার চিকিৎসার ব্যবস্থা করা হয়।',
    beforeStatusBn: 'রাস্তায় বোতল কুড়িয়ে দৈনিক ৫০-৬০ টাকা আয় করত, বর্ণমালাও চিনত না।',
    supportReceivedBn: 'সম্পূর্ণ ফ্রি শিক্ষা, স্কুল ব্যাগ, বই, ইউনিফর্ম ও প্রতিদিনের মিড-ডে মিল।',
    afterStatusBn: '৫ম শ্রেণিতে এ-প্লাস পেয়ে উত্তীর্ণ, ভবিষ্যতে শিক্ষক হওয়ার স্বপ্ন দেখছে।',
    impactMetricsBn: 'শিশুশ্রম মুক্ত হয়ে আনুষ্ঠানিক প্রাতিষ্ঠানিক শিক্ষায় সফল প্রত্যাবর্তন',
    date: '২০২৬-০৬-২০'
  },
  {
    id: 'story_03',
    personName: 'Motaleb Mia',
    personNameBn: 'মোতালেব মিয়া (৪৫)',
    location: 'Companiganj, Noakhali',
    locationBn: 'কোম্পানীগঞ্জ, নোয়াখালী',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    category: 'medical_aid',
    categoryNameBn: 'জরুরি ডায়ালাইসিস ও জীবনরক্ষা',
    quoteBn: '“ডাক্তার যখন বলল সপ্তাহে দুইটা ডায়ালাইসিস না দিলে বাঁচব না, তখন মৃত্যুর প্রহর গুনছিলাম। আপনাদের অনুদান আমাকে নতুন জীবন দিয়েছে।”',
    fullStoryBn: 'মোতালেব মিয়া দিনমজুরি করে ৫ সদস্যের পরিবার চালাতেন। হঠাৎ দুই কিডনি অকেজো হয়ে গেলে চিকিৎসা করাতে গিয়ে শেষ সহায়-সম্বলও বিক্রি করে দেন। সাজেদা ইয়ুথ ফাউন্ডেশনের জরুরি চিকিৎসা ফান্ডের মাধ্যমে তার ৬ মাসের ডায়ালাইসিস ফি এবং প্রয়োজনীয় ওষুধ স্পন্সর করা হয়। এখন তিনি সুস্থ হয়ে ছোট একটি মুদির দোকান পরিচালনা করছেন।',
    beforeStatusBn: 'অর্থের অভাবে ডায়ালিসিস বন্ধের মুখে, জীবন-মৃত্যুর সন্ধিক্ষণে শয্যাশায়ী।',
    supportReceivedBn: '১,৮০,০০০ টাকার সম্পূর্ণ ডায়ালিসিস প্যাকেজ, ইনজেকশন ও পুনর্বাসন সহায়তা।',
    afterStatusBn: 'শারীরিক উন্নতি এবং পরিবারের জন্য ছোট আয়ের দোকান চালু।',
    impactMetricsBn: 'একটি পরিবারের একমাত্র অভিভাবকের নিশ্চিত জীবনরক্ষা',
    date: '২০২৬-০৭-১০'
  }
];

export const SYF_BEFORE_AFTER_PROJECTS: BeforeAfterItem[] = [
  {
    id: 'ba_01',
    titleBn: 'কুড়িগ্রামের চর যাত্রাপুরে সৌরচালিত গভীর নলকূপ ও ওয়াটার পয়েন্ট',
    locationBn: 'যাত্রাপুর ইউনিয়ন, কুড়িগ্রাম',
    categoryBn: 'বিশুদ্ধ খাবার পানি',
    descriptionBn: 'আগে নদী ও অগভীর ডোবার নোংরা পানি খেয়ে চরের মানুষ প্রতিনিয়ত কলেরা ও ডায়রিয়ায় আক্রান্ত হতো। এখন ৮০০ ফুট গভীর ফিল্টার করা সুপেয় পানি পুরো গ্রামের মানুষের হাতের নাগালে।',
    beforeImageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80',
    beforeLabelBn: 'পূর্বে: নদী ও পুকুরের দূষিত পানির তীব্র সংকট',
    afterImageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80',
    afterLabelBn: 'বর্তমানে: নিরাপদ সৌরচালিত সুপেয় পানির ট্যাংক ও ট্যাপ',
    impactHighlightBn: '৩৫০টি পরিবারের পানিবাহিত রোগ ৯৫% কমেছে'
  },
  {
    id: 'ba_02',
    titleBn: 'রায়েরবাজার ভাসমান শিশুদের আলোর পাঠশালা ও লার্নিং সেন্টার',
    locationBn: 'রায়েরবাজার, ঢাকা',
    categoryBn: 'শিক্ষা ও শিশু সুরক্ষা',
    descriptionBn: 'আবর্জনার স্তূপের পাশের জরাজীর্ণ বস্তি থেকে শিশুদের উদ্ধার করে একটি রঙিন, ফ্যানযুক্ত ও ডিজিটালি সুসজ্জিত পাঠশালা গড়ে তোলা হয়েছে।',
    beforeImageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80',
    beforeLabelBn: 'পূর্বে: খোলা আকাশের নিচে অবহেলিত শৈশব',
    afterImageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    afterLabelBn: 'বর্তমানে: সুসজ্জিত আধুনিক বিদ্যাপীঠ ও লাইব্রেরি',
    impactHighlightBn: '১২০ জন পথশিশু এখন নিয়মিত আনন্দের সাথে পড়ালেখা করছে'
  },
  {
    id: 'ba_03',
    titleBn: 'ফেনী ছাগলনাইয়ায় অগ্নিকাণ্ডে ক্ষতিগ্রস্ত রফিকের নতুন পাকা টিনের বাড়ি',
    locationBn: 'ছাগলনাইয়া, ফেনী',
    categoryBn: 'দুর্যোগ পুনর্বাসন',
    descriptionBn: 'ভয়াবহ আগুনে ঘরবাড়ি পুড়ে ছাই হয়ে যাওয়ার পর সাজেদা ইয়ুথ ফাউন্ডেশনের সহায়তায় মজবুত সিমেন্টের খুঁটি ও ঢেউ টিন দিয়ে নতুন নিরাপদ ঘর নির্মাণ করে দেওয়া হয়।',
    beforeImageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&auto=format&fit=crop&q=80',
    beforeLabelBn: 'পূর্বে: অগ্নিকাণ্ডে ভস্মীভূত ধ্বংসস্তূপ',
    afterImageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop&q=80',
    afterLabelBn: 'বর্তমানে: মজবুত টিনশেড পাকা ভিটার নতুন ঘর',
    impactHighlightBn: '৬ সদস্যের পরিবার ফিরে পেয়েছে নতুন নিরাপদ ঠিকানা'
  }
];

export const SYF_HOW_WE_HELP_STEPS = [
  {
    step: '01',
    titleBn: 'Identify (চিহ্নিতকরণ)',
    descBn: 'আমাদের ফিল্ড টিম ও স্থানীয় স্বেচ্ছাসেবকদের মাধ্যমে প্রকৃত অসহায় মানুষ ও সংকটগ্রস্ত অঞ্চল শনাক্ত করি।',
    icon: 'Search'
  },
  {
    step: '02',
    titleBn: 'Verify (তথ্য যাচাই)',
    descBn: 'মেডিকেল প্রেসক্রিপশন, ইউনিয়ন পরিষদ প্রত্যয়ন ও সরজমিন তদন্ত করে ১০০% নির্ভুলতা নিশ্চিত করি।',
    icon: 'ShieldCheck'
  },
  {
    step: '03',
    titleBn: 'Support (সহায়তা প্রদান)',
    descBn: 'মধ্যস্বত্বভোগী ছাড়া সরাসরি নগদ অর্থ, খাদ্য বা সরঞ্জাম হস্তান্তর করি এবং তাৎক্ষণিক রসিদ তৈরি করি।',
    icon: 'HeartHandshake'
  },
  {
    step: '04',
    titleBn: 'Report (হিসাব প্রকাশ)',
    descBn: 'ব্যয়ের ভাউচার, ফিল্ড ছবি ও অডিট রিপোর্ট পোর্টালে সবার জন্য উন্মুক্ত করে স্বচ্ছতা বজায় রাখি।',
    icon: 'FileCheck'
  }
];

export const SYF_TRANSPARENCY_DATA: TransparencySummary = {
  totalCollected: 4850000,
  totalSpent: 4120000,
  reserveBalance: 730000,
  adminOverheadAmount: 240000,
  adminOverheadPercentage: 4.9, // Only 4.9% admin overhead
  thisMonthReceived: 850000,
  thisMonthDistributed: 720000,
  thisMonthAdminCost: 50000,
  thisMonthRemaining: 80000,
  totalDonorsCount: 3840,
  totalBeneficiariesCount: 14200,
  totalProjectsCount: 28,
  activeAppealsCount: 4,
  sectorBreakdown: [
    { category: 'healthcare' as any, categoryNameBn: 'স্বাস্থ্য ও চিকিৎসা', collected: 1650000, spent: 1450000, percentageOfTotal: 34 },
    { category: 'food_relief' as any, categoryNameBn: 'খাদ্য ও পুষ্টি সহায়তা', collected: 1200000, spent: 1050000, percentageOfTotal: 25 },
    { category: 'education' as any, categoryNameBn: 'শিক্ষা ও এতিম স্পন্সর', collected: 950000, spent: 820000, percentageOfTotal: 20 },
    { category: 'clean_water' as any, categoryNameBn: 'নিরাপদ পানি ও ওয়াশ', collected: 600000, spent: 510000, percentageOfTotal: 12 },
    { category: 'youth_development' as any, categoryNameBn: 'স্বাবলম্বীকরণ উদ্যোগ', collected: 450000, spent: 290000, percentageOfTotal: 9 }
  ],
  monthlyReports: [
    { month: '2026-03', monthBn: 'মার্চ ২০২৬', collected: 680000, spent: 590000, adminCost: 35000, distributed: 555000 },
    { month: '2026-04', monthBn: 'এপ্রিল ২০২৬', collected: 920000, spent: 810000, adminCost: 45000, distributed: 765000 },
    { month: '2026-05', monthBn: 'মে ২০২৬', collected: 740000, spent: 630000, adminCost: 38000, distributed: 592000 },
    { month: '2026-06', monthBn: 'জুন ২০২৬', collected: 810000, spent: 690000, adminCost: 42000, distributed: 648000 },
    { month: '2026-07', monthBn: 'জুলাই ২০২৬', collected: 850000, spent: 720000, adminCost: 50000, distributed: 670000 },
    { month: '2026-08', monthBn: 'আগস্ট ২০২৬ (চলতি)', collected: 850000, spent: 720000, adminCost: 50000, distributed: 670000 }
  ]
};

export const SYF_DONOR_WALL: DonorRecognitionItem[] = [
  {
    id: 'syf_dnr_01',
    donorName: 'আলহাজ্ব মো. কামরুল হাসান',
    donorDistrict: 'ঢাকা',
    totalDonationAmount: 250000,
    donationsCount: 12,
    donorType: 'top_donor',
    donorTypeBn: 'প্লাটিনাম আজীবন পৃষ্ঠপোষক',
    badgeColor: 'from-amber-500 to-amber-700 text-white',
    joinedDate: '২০২৪-০১-১০',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    isAnonymous: false
  },
  {
    id: 'syf_dnr_02',
    donorName: 'শ্রদ্ধেয় বেনামী শুভাকাঙ্ক্ষী (Anonymous Patron)',
    donorDistrict: 'সিলেট',
    totalDonationAmount: 180000,
    donationsCount: 8,
    donorType: 'top_donor',
    donorTypeBn: 'বিশেষ বেনামী দাতা',
    badgeColor: 'from-slate-600 to-slate-800 text-white',
    joinedDate: '২০২৪-০৩-১২',
    avatarUrl: '',
    isAnonymous: true
  },
  {
    id: 'syf_dnr_03',
    donorName: 'ডা. নাজনীন ফেরদৌসী ও পরিবার',
    donorDistrict: 'চট্টগ্রাম',
    totalDonationAmount: 120000,
    donationsCount: 15,
    donorType: 'monthly_supporter',
    donorTypeBn: 'ধারাবাহিক মাসিক চিকিৎসা দাতা',
    badgeColor: 'from-emerald-500 to-teal-700 text-white',
    joinedDate: '২০২৪-০৮-২০',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    isAnonymous: false
  },
  {
    id: 'syf_dnr_04',
    donorName: 'ইঞ্জিনিয়ার তানভীর চৌধুরী',
    donorDistrict: 'রাজশাহী',
    totalDonationAmount: 75000,
    donationsCount: 10,
    donorType: 'monthly_supporter',
    donorTypeBn: 'মাসিক শিক্ষা স্পন্সর',
    badgeColor: 'from-blue-500 to-indigo-700 text-white',
    joinedDate: '২০২৫-০২-০১',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    isAnonymous: false
  }
];

export const SYF_UPCOMING_EVENTS: CharityEvent[] = [
  {
    id: 'event_01',
    title: 'Free Mega Medical Camp & Eye Cataract Surgery Drive 2026',
    titleBn: 'ফ্রি মেগা মেডিকেল ক্যাম্প ও ছানি পড়া রোগীদের বিনামূল্যে লেন্স স্থাপন',
    dateBn: '১২ সেপ্টেম্বর, ২০২৬',
    rawDate: '2026-09-12',
    timeBn: 'সকাল ৯:০০ - বিকাল ৫:০০',
    locationBn: 'যাত্রাপুর মডেল হাইস্কুল মাঠ, কুড়িগ্রাম',
    categoryBn: 'স্বাস্থ্যসেবা ক্যাম্প',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    descriptionBn: 'বিশেষজ্ঞ চিকিৎসকদের তত্ত্বাবধানে ১০০০+ রোগীর বিনামূল্যে প্রেসক্রিপশন, ডায়াবেটিস টেস্ট, ইসিজি এবং ১০০ জন বয়োবৃদ্ধ রোগীর চোখের ছানি অপারেশন।',
    organizerBn: 'সাজেদা ইয়ুথ ফাউন্ডেশন হেলথ উইং',
    targetBeneficiariesCount: 1000,
    registeredVolunteersCount: 35,
    status: 'upcoming'
  },
  {
    id: 'event_02',
    title: 'Winter Warmth Clothes & Blanket Distribution Drive',
    titleBn: 'উত্তরাঞ্চলের শীতার্তদের মাঝে ৫০০০ কম্বল ও গরম কাপড় বিতরণ অভিযান',
    dateBn: '২০ অক্টোবর, ২০২৬',
    rawDate: '2026-10-20',
    timeBn: 'সকাল ১০:০০ টা থেকে শুরু',
    locationBn: 'রংপুর, নীলফামারী ও পঞ্চগড় জেলা',
    categoryBn: 'শীতবস্ত্র বিতরণ',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
    descriptionBn: 'তীব্র শৈত্যপ্রবাহের আগেই দুর্গম চরের অসহায় শিশু ও বৃদ্ধদের মাঝে মানসম্মত ভারি কম্বল ও সোয়েটার উপহার পৌঁছে দেওয়ার সার্বিক কর্মসূচি।',
    organizerBn: 'সাজেদা ইয়ুথ ইমার্জেন্সি রেসপন্স টিম',
    targetBeneficiariesCount: 5000,
    registeredVolunteersCount: 60,
    status: 'upcoming'
  },
  {
    id: 'event_03',
    title: 'Youth Green Revolution & 10,000 Tree Plantation Campaign',
    titleBn: 'সবুজ বাংলাদেশ গড়তে উপকূলীয় বাঁধ এলাকায় ১০,০০০ বৃক্ষরোপণ উৎসব',
    dateBn: '০৫ অক্টোবর, ২০২৬',
    rawDate: '2026-10-05',
    timeBn: 'সকাল ৮:০০ টা',
    locationBn: 'শ্যামনগর ও আশাশুনি বেড়িবাঁধ, সাতক্ষীরা',
    categoryBn: 'পরিবেশ ও জলবায়ু',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    descriptionBn: 'ঘূর্ণিঝড় ও জলোচ্ছ্বাস থেকে উপকূলীয় এলাকা রক্ষায় ফলদ, বনজ ও ম্যানগ্রোভ চারা রোপণ কার্যক্রম।',
    organizerBn: 'সাজেদা ইয়ুথ গ্রিন ব্রিগেড',
    targetBeneficiariesCount: 15000,
    registeredVolunteersCount: 80,
    status: 'upcoming'
  }
];

export const SYF_NEWS_ARTICLES: CharityNewsItem[] = [
  {
    id: 'news_01',
    title: 'Sajeda Youth Foundation Dispatches 20 Speedboats with Flood Food Packs in Feni',
    titleBn: 'ফেনীর প্রত্যন্ত অঞ্চলে ২০টি স্পিডবোটযোগে সাজেদা ফাউন্ডেশনের জরুরি খাদ্য বিতরণ',
    categoryBn: 'মাঠপর্যায়ের আপডেট',
    dateBn: '২৬ আগস্ট, ২০২৬',
    publishedAt: '2026-08-26',
    imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80',
    shortDescriptionBn: 'উজানের ঢলে বিচ্ছিন্ন হয়ে পড়া ছাগলনাইয়া ও পরশুরামের ৩,৫০০ পরিবারের কাছে জরুরি শুকনো খাবার ও স্যালাইন পৌঁছে দেওয়া হয়েছে।',
    contentBn: 'গত ৪৮ ঘণ্টায় টানা বর্ষণে প্লাবিত অঞ্চলে সাজেদা ইয়ুথ ফাউন্ডেশনের ৫০ জন নিবেদিত তরুণ স্বেচ্ছাসেবক দিন-রাত উদ্ধার তৎপরতা চালিয়েছেন। নৌকার মাধ্যমে পানিবন্দী গর্ভবতী মা ও শিশুদের নিরাপদ সাইক্লোন সেন্টারে স্থানান্তর করা হয়েছে।',
    authorBn: 'মিডিয়া সেল, এসওয়াইএফ',
    isFeatured: true
  },
  {
    id: 'news_02',
    title: '50 Underprivileged Women Receive Sewing Machines and Grants in Rangpur',
    titleBn: 'রংপুরে ৫০ জন বিধবা ও নিঃস্ব নারীকে সেলাই মেশিন এবং নগদ পুঁজি প্রদান',
    categoryBn: 'স্বাবলম্বীকরণ কর্মসূচি',
    dateBn: '১৮ আগস্ট, ২০২৬',
    publishedAt: '2026-08-18',
    imageUrl: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&auto=format&fit=crop&q=80',
    shortDescriptionBn: '১ মাসের নিবিড় টেইলারিং প্রশিক্ষণ শেষে স্থানীয় গণ্যমান্য ব্যক্তিবর্গের উপস্থিতিতে মেশিন হস্তান্তর করা হয়।',
    contentBn: 'সাজেদা ইয়ুথ ফাউন্ডেশনের নারী স্বাবলম্বীকরণ প্রকল্পের আওতায় এই ৫০ জন নারী এখন ঘরে বসেই নিয়মিত আয় করতে পারবেন। ফাউন্ডেশন থেকে উৎপাদিত পণ্যের বাজারজাতকরণেও সহায়তা দেওয়া হচ্ছে।',
    authorBn: 'ফিল্ড কোঅর্ডিনেটর',
    isFeatured: false
  },
  {
    id: 'news_03',
    title: 'Annual Shariah Audit 2026 Completed with 100% Fund Compliance',
    titleBn: '২০২৬ সালের বার্ষিক শরীয়াহ ও ফিন্যান্সিয়াল অডিট সফলভাবে সম্পন্ন',
    categoryBn: 'স্বচ্ছতা ও অডিট রিপোর্ট',
    dateBn: '১০ আগস্ট, ২০২৬',
    publishedAt: '2026-08-10',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    shortDescriptionBn: 'স্বনামধন্য চার্টার্ড অ্যাকাউন্ট্যান্টস ফার্ম ও শরীয়াহ বোর্ডের যৌথ নিরীক্ষায় শতভাগ নির্ভুল তহবিল ব্যবস্থাপনার স্বীকৃতি।',
    contentBn: 'আসকাডো ও সাজেদা ইয়ুথ ফাউন্ডেশনের সেন্ট্রাল ট্রেজারি নিরীক্ষা প্রতিবেদন অনুযায়ী প্রতিটি অনুদানের অর্থ ব্যাংক ও মোবাইল অ্যাকাউন্টের মাধ্যমে ডিজিটাল ট্র্যাক রেখে ফিল্ডে হস্তান্তর করা হয়েছে।',
    authorBn: 'অডিট বোর্ড সচিব',
    isFeatured: false
  }
];

export const SYF_GALLERY_ITEMS: GalleryMediaItem[] = [
  {
    id: 'gal_01',
    titleBn: 'বন্যাদুর্গত এলাকায় খাবার ও সুপেয় পানি বিতরণ',
    category: 'disaster',
    categoryBn: 'দুর্যোগ ত্রাণ',
    mediaType: 'image',
    url: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=1000&auto=format&fit=crop&q=80',
    captionBn: 'ফেনী ছাগলনাইয়া উপজেলায় পানিবন্দী পরিবারের হাতে ফুডপ্যাক পৌঁছানোর দৃশ্য।',
    dateBn: 'আগস্ট ২০২৬'
  },
  {
    id: 'gal_02',
    titleBn: 'আলোর পাঠশালায় শিশুদের আনন্দমুখর পড়াশোনা',
    category: 'education',
    categoryBn: 'শিক্ষা সহায়তা',
    mediaType: 'image',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1000&auto=format&fit=crop&q=80',
    captionBn: 'রায়েরবাজার সুবিধাবঞ্চিত শিশুদের নতুন বই ও স্কুল ড্রেস উপহার।',
    dateBn: 'জুলাই ২০২৬'
  },
  {
    id: 'gal_03',
    titleBn: 'ফ্রি হেলথ ও চক্ষু চিকিৎসা ক্যাম্প',
    category: 'healthcare',
    categoryBn: 'স্বাস্থ্যসেবা',
    mediaType: 'image',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1000&auto=format&fit=crop&q=80',
    captionBn: 'কুড়িগ্রামে দিনমজুর ও বয়োবৃদ্ধ মা-বোনদের বিনামূল্যে স্বাস্থ্য পরীক্ষা ও ওষুধ প্রদান।',
    dateBn: 'জুন ২০২৬'
  },
  {
    id: 'gal_04',
    titleBn: 'স্বাবলম্বী নারীদের সেলাই মেশিন উপহার',
    category: 'charity',
    categoryBn: 'মানবকল্যাণ',
    mediaType: 'image',
    url: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1000&auto=format&fit=crop&q=80',
    captionBn: 'রংপুর সদরে বিধবা ও অসহায় মায়েদের হাতে সেলাই মেশিন হস্তান্তর।',
    dateBn: 'মে ২০২৬'
  },
  {
    id: 'gal_05',
    titleBn: 'সৌরচালিত বিশুদ্ধ পানির গভীর নলকূপ উদ্বোধন',
    category: 'charity',
    categoryBn: 'নিরাপদ পানি',
    mediaType: 'image',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=1000&auto=format&fit=crop&q=80',
    captionBn: 'চর যাত্রাপুরে আর্সেনিকমুক্ত গভীর নলকূপ থেকে পানি নিচ্ছেন গ্রামবাসী।',
    dateBn: 'এপ্রিল ২০২৬'
  },
  {
    id: 'gal_06',
    titleBn: 'আমাদের নিবেদিত তরুণ স্বেচ্ছাসেবক দল',
    category: 'volunteers',
    categoryBn: 'স্বেচ্ছাসেবক',
    mediaType: 'image',
    url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1000&auto=format&fit=crop&q=80',
    captionBn: 'ত্রাণ অভিযান শেষে সাজেদা ফাউন্ডেশন যুব স্বেচ্ছাসেবকদের টিম মেম্বাররা।',
    dateBn: 'মার্চ ২০২৬'
  }
];

export const SYF_PARTNERS: PartnerItem[] = [
  {
    id: 'part_01',
    name: 'Islami Bank Bangladesh PLC',
    nameBn: 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি',
    type: 'corporate',
    typeBn: 'কর্পোরেট পার্টনার',
    logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=80',
    contributionHighlightBn: 'ক্যাশলেস ডোনেশন চ্যানেল ও সিএসআর পার্টনারশিপ'
  },
  {
    id: 'part_02',
    name: 'bKash Limited',
    nameBn: 'বিকাশ লিমিটেড',
    type: 'corporate',
    typeBn: 'ডিজিটাল পেমেন্ট পার্টনার',
    logoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&auto=format&fit=crop&q=80',
    contributionHighlightBn: '১-ট্যাপ কিউআর অনুদান ও ইনস্ট্যান্ট ডিজিটাল রসিদ'
  },
  {
    id: 'part_03',
    name: 'Bangladesh Red Crescent Society',
    nameBn: 'বাংলাদেশ রেড ক্রিসেন্ট সোসাইটি',
    type: 'community',
    typeBn: 'দুর্যোগ ব্যবস্থাপনা পার্টনার',
    logoUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=200&auto=format&fit=crop&q=80',
    contributionHighlightBn: 'বন্যা ও জরুরি দুর্যোগে যৌথ মাঠপর্যায়ের উদ্ধার অভিযান'
  },
  {
    id: 'part_04',
    name: 'Dhaka Community Medical Hospital',
    nameBn: 'ঢাকা কমিউনিটি মেডিকেল কলেজ হাসপাতাল',
    type: 'supporter',
    typeBn: 'চিকিৎসা সহায়তা পার্টনার',
    logoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&auto=format&fit=crop&q=80',
    contributionHighlightBn: 'দরিদ্র রোগীদের বিশেষ ছাড়ে জটিল সার্জারি ও ডায়ালাইসিস'
  }
];

export const SYF_BANK_ACCOUNTS = {
  bank: {
    bankName: 'Islami Bank Bangladesh PLC',
    bankNameBn: 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি',
    branch: 'Dhanmondi Branch, Dhaka',
    branchBn: 'ধানমন্ডি শাখা, ঢাকা',
    accountName: 'Sajeda Youth Foundation',
    accountNameBn: 'সাজেদা ইয়ুথ ফাউন্ডেশন',
    accountNumber: '2050 1840 2008 8129',
    routingNumber: '125271840',
    swiftCode: 'IBBLBDDH'
  },
  bkash: {
    merchantNumber: '01711-223344',
    type: 'Merchant (মার্চেন্ট অ্যাকাউন্ট)',
    counter: '1'
  },
  nagad: {
    merchantNumber: '01711-223344',
    type: 'Merchant (মার্চেন্ট অ্যাকাউন্ট)'
  },
  rocket: {
    billerId: '88219',
    number: '01711-223344-8'
  }
};
