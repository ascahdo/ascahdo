import { HubBranding, HubId } from '../types/hubTypes';

export const DEFAULT_HUBS_DATA: Record<HubId, HubBranding> = {
  // 1. MULTI SOMITI HUB
  somiti: {
    hubId: 'somiti',
    name: 'ASCADO Multi Somiti Management Hub',
    nameBn: 'আসকাডো মাল্টি-সমিতি ম্যানেজমেন্ট হাব',
    tagline: 'Transparent Accounts • Safe Savings • Modern Digital Somiti Management',
    taglineBn: 'স্বচ্ছ হিসাব • নিরাপদ সঞ্চয় • আধুনিক ডিজিটাল সমিতি পরিচালনা',
    description: 'A comprehensive multi-tenant cooperative society ERP system covering member passbooks, micro-savings, daily & monthly loans, automated installment receipts, branch accounting, and multi-tier auditing.',
    descriptionBn: 'ডিজিটাল ব্যবস্থাপনায় বহু-সমিতি ও বহুমুখী সমবায় সমিতির সঞ্চয়, ঋণ, দৈনিক ও মাসিক কিস্তি আদায়, শাখা ব্যবস্থাপনা এবং স্বচ্ছ অডিট লেজার।',
    logoUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200&auto=format&fit=crop&q=80',
    coverBannerUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1600&auto=format&fit=crop&q=80',
    primaryColor: '#059669', // Emerald
    secondaryColor: '#064e3b',
    accentColor: '#10b981',
    badgeText: 'Cooperative ERP',
    badgeTextBn: 'মাল্টি-সমিতি ইআরপি',
    contactNumber: '+880 1711-987654',
    email: 'somiti@ascado-ngo.org',
    address: 'Central Somiti Bhaban, Level 4, Motijheel, Dhaka-1000',
    addressBn: 'সেন্ট্রাল সমিতি ভবন, লেভেল-৪, মতিঝিল বাণিজ্যিক এলাকা, ঢাকা-১০০০',
    socialLinks: {
      facebook: 'https://facebook.com',
      youtube: 'https://youtube.com',
      whatsapp: '+8801711987654'
    },
    footerText: 'Empowering local community financial cooperatives with real-time digital passbooks, smart POS collection, and audited financial statements.',
    footerTextBn: 'সারাদেশের সমবায় ও ক্ষুদ্র ঋণ সমিতিসমূহকে ডিজিটাল প্রযুক্তির মাধ্যমে শতভাগ স্বচ্ছ, জবাবদিহিতামূলক ও টেকসই করার সেন্ট্রাল প্ল্যাটফর্ম।',
    copyright: '© 2026 ASCADO Multi Somiti Management Hub. All rights reserved.',
    seoTitle: 'ASCADO Multi Somiti Hub - Digital Cooperative Society Management ERP',
    seoDescription: 'Manage savings, microloans, daily installments, member passbooks, and branch networks with ASCADO Multi Somiti Management Hub.',
    stats: [
      { id: 's1', label: 'Total Somitis', labelBn: 'মোট সমিতি', value: '২৪টি', iconName: 'Landmark', color: 'emerald' },
      { id: 's2', label: 'Active Branches', labelBn: 'মোট শাখা', value: '৫৮টি', iconName: 'Building2', color: 'blue' },
      { id: 's3', label: 'Total Members', labelBn: 'মোট সদস্য', value: '১২,৫০০+', iconName: 'Users', color: 'indigo' },
      { id: 's4', label: 'Total Savings', labelBn: 'মোট সঞ্চয়', value: '৳ ৪.৮ কোটি', iconName: 'PiggyBank', color: 'amber' },
      { id: 's5', label: 'Total Disbursed Loans', labelBn: 'মোট ঋণ বিতরণ', value: '৳ ৩.২ কোটি', iconName: 'CreditCard', color: 'rose' },
      { id: 's6', label: 'Total Collected', labelBn: 'মোট আদায়', value: '৳ ২.৯ কোটি', iconName: 'BarChart2', color: 'teal' }
    ],
    banners: [
      {
        id: 'banner_somiti_1',
        imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1400&auto=format&fit=crop&q=80',
        title: 'ASCADO Multi Somiti Management Hub',
        titleBn: 'আসকাডো মাল্টি-সমিতি ম্যানেজমেন্ট হাব',
        subtitle: 'Complete Digital ERP for Cooperative Societies, Savings Schemes & Microloans',
        subtitleBn: 'ডিজিটাল ব্যবস্থাপনায় স্বচ্ছ, নির্ভুল ও আধুনিক সমিতি পরিচালনা ও শতভাগ জবাবদিহিতা',
        buttonText: 'Member Login',
        buttonTextBn: 'সদস্য ড্যাশবোর্ড',
        buttonLink: '#erp',
        badge: 'Enterprise Somiti ERP',
        badgeBn: 'স্বচ্ছ সমবায় অর্থনীতি',
        isActive: true,
        order: 1
      },
      {
        id: 'banner_somiti_2',
        imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1400&auto=format&fit=crop&q=80',
        title: 'Micro-Savings & Daily Installment Collection',
        titleBn: 'নিরাপদ সঞ্চয়, ডিপিএস ও সহজ শর্তে জামানতবিহীন ঋণ',
        subtitle: 'Instant SMS confirmation, Digital Passbook & POS field collection system',
        subtitleBn: 'মাঠপর্যায়ে মোবাইল কালেক্টর পিওএস, তাৎক্ষণিক এসএমএস রসিদ ও অটোমেটিক হিসাব',
        buttonText: 'Find Somiti',
        buttonTextBn: 'সমিতি খুঁজুন',
        buttonLink: '#somiti_list',
        badge: 'Smart DPS & Loan',
        badgeBn: 'ডিজিটাল সঞ্চয় ও ঋণ',
        isActive: true,
        order: 2
      },
      {
        id: 'banner_somiti_3',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1400&auto=format&fit=crop&q=80',
        title: 'Branch Expansion & Cooperative Membership',
        titleBn: 'আপনার এলাকায় নতুন শাখা অনুমোদন ও সদস্য নিবন্ধন',
        subtitle: 'Register your local committee branch with full software automation and training',
        subtitleBn: 'অনলাইনে মাত্র ৩ মিনিটে নতুন শাখা বা সদস্যপদের জন্য সরাসরি আবেদন করুন',
        buttonText: 'Apply for Branch',
        buttonTextBn: 'শাখা আবেদন করুন',
        buttonLink: '#apply_branch',
        badge: 'Branch Network',
        badgeBn: 'শাখা নেটওয়ার্ক',
        isActive: true,
        order: 3
      }
    ],
    menuItems: [
      { id: 'm1', title: 'Home', titleBn: 'হোম পেজ', route: 'home', iconName: 'Home' },
      { id: 'm2', title: 'Somiti Directory', titleBn: 'সমিতি তালিকা', route: 'multi_somiti', iconName: 'Landmark' },
      { id: 'm3', title: 'Branch Network', titleBn: 'শাখা সমূহ', route: 'branches', iconName: 'Building2' },
      { id: 'm4', title: 'Member Passbook', titleBn: 'সদস্য পাসবুক', route: 'members', iconName: 'Users' },
      { id: 'm5', title: 'Collector POS', titleBn: 'মাঠ কালেক্টর POS', route: 'collector_pos', iconName: 'Smartphone' },
      { id: 'm6', title: 'Central Accounts', titleBn: 'হিসাব ও লেজার', route: 'accounts_ledger', iconName: 'FileSpreadsheet' },
      { id: 'm7', title: 'Reports & Audit', titleBn: 'অডিট ও রিপোর্ট', route: 'reports', iconName: 'BarChart2' },
      { id: 'm8', title: 'ERP Dashboard', titleBn: 'ইআরপি ড্যাশবোর্ড', route: 'erp', iconName: 'ShieldCheck' }
    ]
  },

  // 2. TRAINING & SKILLS HUB
  training: {
    hubId: 'training',
    name: 'ASCAHDO Technical & ICT Training Hub',
    nameBn: 'এসকাডো কারিগরি ও আইসিটি ট্রেনিং হাব',
    tagline: 'Skill Acquisition • Employment • Self-Reliance',
    taglineBn: 'কারিগরি ও আইসিটি দক্ষতা • কর্মসংস্থান • আত্মনির্ভরতা',
    description: 'Government standard certified technical training courses, online learning management system (LMS), freelancing bootcamps, and career placements.',
    descriptionBn: 'জাতীয় ও আন্তর্জাতিক মানের আইসিটি, প্রফেশনাল গ্রাফিক্স, সফটওয়্যার, ড্রাইভিং, ইলেকট্রিক্যাল ও ভোকেশনাল প্রশিক্ষণ।',
    logoUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200&auto=format&fit=crop&q=80',
    coverBannerUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&auto=format&fit=crop&q=80',
    primaryColor: '#047857', // Emerald
    secondaryColor: '#064e3b',
    accentColor: '#10b981',
    badgeText: 'Technical & ICT Training',
    badgeTextBn: 'কারিগরি ও আইসিটি প্রশিক্ষণ একাডেমি',
    contactNumber: '+880 1973-817167',
    email: 'training@ascahdo.org',
    address: 'ICT Innovation Bhaban, Basurhat & Maijdee, Noakhali',
    addressBn: 'আইসিটি ইনোভেশন ভবন, প্রধান সড়ক, বসুরহাট ও মাইজদী, নোয়াখালী',
    socialLinks: {
      facebook: 'https://facebook.com',
      youtube: 'https://youtube.com',
      whatsapp: '+8801973817167'
    },
    footerText: 'Providing market-driven hands-on skills, internship opportunities, and verified certifications for young jobseekers and entrepreneurs.',
    footerTextBn: 'তরুণ-তরুণীদের আধুনিক কারিগরি ও আইসিটি শিক্ষায় দক্ষ ও স্বাবলম্বী করে তোলার জন্য এসকাডো স্কিল ডেভেলপমেন্ট একাডেমি।',
    copyright: '© 2026 ASCAHDO Technical & ICT Training Hub. All rights reserved.',
    seoTitle: 'ASCAHDO Technical & ICT Training Hub - Vocational & IT Skill Academy',
    seoDescription: 'Enroll in professional IT and technical courses with certificates and job placement support.',
    stats: [
      { id: 't1', label: 'Active Courses', labelBn: 'কোর্স সংখ্যা', value: '৫০+ টি', iconName: 'BookOpen', color: 'emerald' },
      { id: 't2', label: 'Enrolled Students', labelBn: 'মোট শিক্ষার্থী', value: '৩,৪০০+', iconName: 'GraduationCap', color: 'blue' },
      { id: 't3', label: 'Job Placement', labelBn: 'কর্মসংস্থান হার', value: '৮৫%', iconName: 'Award', color: 'teal' },
      { id: 't4', label: 'Certified Alumni', labelBn: 'সার্টিফাইড গ্র্যাজুয়েট', value: '২,৮০০+', iconName: 'ShieldCheck', color: 'amber' }
    ],
    banners: [
      {
        id: 'banner_tr_1',
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1400&auto=format&fit=crop&q=80',
        title: 'ASCAHDO Technical & ICT Training Hub',
        titleBn: 'এসকাডো কারিগরি ও আইসিটি ট্রেনিং একাডেমি',
        subtitle: 'Learn IT, Graphic Design, Web Development & Vocational Skills from Industry Experts',
        subtitleBn: 'দক্ষতা অর্জন করে দেশ ও বিদেশের ফ্রিল্যান্সিং এবং কর্পোরেট সেক্টরে ক্যারিয়ার গড়ুন',
        buttonText: 'Explore Courses',
        buttonTextBn: 'কোর্সসমূহ দেখুন',
        buttonLink: '#courses',
        badge: 'Admission Open',
        badgeBn: 'ভর্তি চলছে ২০২৬',
        isActive: true,
        order: 1
      },
      {
        id: 'banner_tr_2',
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&auto=format&fit=crop&q=80',
        title: 'Interactive Lab & Live Project Training',
        titleBn: 'উন্নত আইসিটি ল্যাব ও লাইভ প্রজেক্ট ভিত্তিক শিখন',
        subtitle: 'Modern computer lab with high-speed internet and one-to-one mentorship',
        subtitleBn: 'হাতেকলমে বাস্তবমুখী প্রশিক্ষণ এবং প্রতিটি শিক্ষার্থীর জন্য আলাদা কম্পিউটার সুবিধা',
        buttonText: 'Apply Now',
        buttonTextBn: 'অনলাইন রেজিস্ট্রেশন',
        buttonLink: '#register',
        badge: 'Practical Lab',
        badgeBn: 'ব্যবহারিক ল্যাব',
        isActive: true,
        order: 2
      }
    ],
    menuItems: [
      { id: 'tm1', title: 'All Courses', titleBn: 'কোর্সসমূহ', route: 'programs', iconName: 'BookOpen' },
      { id: 'tm2', title: 'Categories', titleBn: 'স্কিল ক্যাটাগরি', route: 'categories', iconName: 'Layers' },
      { id: 'tm3', title: 'Admission', titleBn: 'ভর্তি আবেদন', route: 'admission', iconName: 'GraduationCap' },
      { id: 'tm4', title: 'Centers', titleBn: 'ট্রেনিং সেন্টার', route: 'centers', iconName: 'Building2' },
      { id: 'tm5', title: 'Verify Certificate', titleBn: 'সার্টিফিকেট যাচাই', route: 'verification', iconName: 'Award' },
      { id: 'tm6', title: 'Job Placement', titleBn: 'জব প্লেসমেন্ট', route: 'jobs', iconName: 'Briefcase' },
      { id: 'tm7', title: 'Trainers', titleBn: 'প্রশিক্ষক প্যানেল', route: 'trainers', iconName: 'Users' },
      { id: 'tm8', title: 'Student LMS', titleBn: 'স্টুডেন্ট এলএমএস', route: 'portal_preview', iconName: 'ShieldCheck' }
    ]
  },

  // 3. DONATION & CHARITY HUB
  donation: {
    hubId: 'donation',
    name: 'ASCADO Sajeda Humanitarian & Relief Hub',
    nameBn: 'আসকাডো সাজেদা চ্যারিটি ও ত্রাণ সহায়তা হাব',
    tagline: 'For Humanity • 100% Transparent Relief & Zakat Fund',
    taglineBn: 'মানবতার কল্যাণে • শতভাগ স্বচ্ছ অনুদান ও যাকাত তহবিল',
    description: 'Direct disaster response, flood relief, orphan sponsorship, winter clothes, free medical camps, and audited community development projects.',
    descriptionBn: 'অসহায়, বিধবা, এতিম ও দরিদ্র পরিবারের জরুরি খাদ্য, চিকিৎসা ও পুনর্বাসন সহায়তায় একটি সমন্বিত স্বচ্ছ চ্যারিটি প্ল্যাটফর্ম।',
    logoUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?w=200&auto=format&fit=crop&q=80',
    coverBannerUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&auto=format&fit=crop&q=80',
    primaryColor: '#dc2626', // Red/Rose
    secondaryColor: '#7f1d1d',
    accentColor: '#ef4444',
    badgeText: '100% Transparent Charity',
    badgeTextBn: 'স্বচ্ছ অনুদান তহবিল',
    contactNumber: '+880 1799-556677',
    email: 'charity@ascado-ngo.org',
    address: 'Sajeda Welfare Complex, Mirpur-10, Dhaka-1216',
    addressBn: 'সাজেদা সমাজকল্যাণ ভবন, মিরপুর-১০, ঢাকা-১২১৬',
    socialLinks: {
      facebook: 'https://facebook.com',
      youtube: 'https://youtube.com',
      whatsapp: '+8801799556677'
    },
    footerText: 'Every penny donated reaches the beneficiaries directly. Instant digital receipts and video progress reports provided for all donors.',
    footerTextBn: 'আপনার প্রতিটি দান সরাসরি দুর্গত মানুষের কাছে পৌঁছে দেওয়া হয় এবং ডিজিটাল অডিট রসিদ প্রদান করা হয়।',
    copyright: '© 2026 ASCADO Sajeda Humanitarian & Relief Hub. All rights reserved.',
    seoTitle: 'ASCADO Donation Hub - Transparent Humanitarian Relief & Zakat Funds',
    seoDescription: 'Donate to flood relief, orphan care, winter clothes, and healthcare campaigns with instant bKash, Nagad, and Card payments.',
    stats: [
      { id: 'd1', label: 'Total Raised', labelBn: 'মোট সংগ্রহ', value: '৳ ১.২৮ কোটি', iconName: 'Heart', color: 'rose' },
      { id: 'd2', label: 'Beneficiary Families', labelBn: 'সহায়তাপ্রাপ্ত পরিবার', value: '২৮,০০০+', iconName: 'Users', color: 'blue' },
      { id: 'd3', label: 'Active Campaigns', labelBn: 'চলমান প্রজেক্ট', value: '১৪টি', iconName: 'Sparkles', color: 'amber' },
      { id: 'd4', label: 'Audit Score', labelBn: 'স্বচ্ছতা স্কোর', value: '১০০%', iconName: 'ShieldCheck', color: 'emerald' }
    ],
    banners: [
      {
        id: 'banner_dn_1',
        imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&auto=format&fit=crop&q=80',
        title: 'Emergency Flood Relief & Food Aid 2026',
        titleBn: 'জরুরি বন্যা ও প্রাকৃতিক দুর্যোগে দুর্গতদের পাশে দাঁড়ান',
        subtitle: 'Join hands to deliver essential food packs, medicines, and drinking water',
        subtitleBn: 'আপনার ক্ষুদ্র অনুদান একজন অনাহারী মানুষের মুখে হাসি ফোটাতে পারে',
        buttonText: 'Donate Now',
        buttonTextBn: 'এখনই অনুদান দিন',
        buttonLink: '#donate',
        badge: 'Urgent Campaign',
        badgeBn: 'জরুরি ত্রাণ সহায়তা',
        isActive: true,
        order: 1
      },
      {
        id: 'banner_dn_2',
        imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1400&auto=format&fit=crop&q=80',
        title: 'Orphan Child Sponsorship & Education Fund',
        titleBn: 'এতিম ও পথশিশুদের শিক্ষা এবং পুষ্টিকর খাবার তহবিল',
        subtitle: 'Sponsor a child monthly and secure their bright future and safe shelter',
        subtitleBn: 'মাসিক মাত্র ১৫০০ টাকায় একটি এতিম শিশুর পড়াশোনা ও খাবারের দায়িত্ব নিন',
        buttonText: 'Sponsor a Child',
        buttonTextBn: 'এতিম স্পন্সর করুন',
        buttonLink: '#sponsor',
        badge: 'Orphan Support',
        badgeBn: 'এতিম সহায়তা',
        isActive: true,
        order: 2
      }
    ],
    menuItems: [
      { id: 'dm1', title: 'Donation Home', titleBn: 'অনুদান হোম', route: 'home', iconName: 'Home' },
      { id: 'dm2', title: 'Live Campaigns', titleBn: 'চলমান তহবিল', route: 'campaigns', iconName: 'Heart' },
      { id: 'dm3', title: 'Zakat Calculator', titleBn: 'যাকাত ক্যালকুলেটর', route: 'zakat', iconName: 'DollarSign' },
      { id: 'dm4', title: 'Audit Reports', titleBn: 'অডিট ও হিসাব', route: 'audit', iconName: 'FileSpreadsheet' },
      { id: 'dm5', title: 'Top Donors', titleBn: 'দাতা তালিকা', route: 'donors', iconName: 'Users' }
    ]
  },

  // 4. VOLUNTEER HUB
  volunteer: {
    hubId: 'volunteer',
    name: 'ASCADO Volunteer & Youth Action Hub',
    nameBn: 'আসকাডো ইয়ুথ ভলান্টিয়ার ও স্বেচ্ছাসেবক হাব',
    tagline: 'Selfless Service • Building the Nation • Youth Leadership',
    taglineBn: 'নিঃস্বার্থ সেবা • দেশ গড়ার প্রত্যয় • যুব নেতৃত্ব',
    description: 'A nationwide active youth volunteer network engaged in disaster response, tree plantation, blood donation, awareness drives, and social welfare.',
    descriptionBn: 'সারাদেশের তরুণ সমাজের সমন্বয়ে গঠিত শক্তিশালী স্বেচ্ছাসেবী প্লাটফর্ম যা সমাজ পরিবর্তনে নেতৃত্ব দেয়।',
    logoUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&auto=format&fit=crop&q=80',
    coverBannerUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1600&auto=format&fit=crop&q=80',
    primaryColor: '#0284c7', // Sky/Blue
    secondaryColor: '#0c4a6e',
    accentColor: '#38bdf8',
    badgeText: 'Youth Action',
    badgeTextBn: 'স্বেচ্ছাসেবী নেটওয়ার্ক',
    contactNumber: '+880 1611-334455',
    email: 'volunteer@ascado-ngo.org',
    address: 'Youth Action Bhaban, Dhanmondi 27, Dhaka-1209',
    addressBn: 'যুব কল্যাণ ভবন, ধানমন্ডি ২৭, ঢাকা-১২০৯',
    socialLinks: {
      facebook: 'https://facebook.com',
      whatsapp: '+8801611334455'
    },
    footerText: 'Join thousands of dedicated change-makers across 64 districts.',
    footerTextBn: 'দেশ ও মানুষের কল্যাণে আপনার মেধা ও শ্রম উৎসর্গ করতে আজই যুক্ত হোন আসকাডো স্বেচ্ছাসেবী পরিবারে।',
    copyright: '© 2026 ASCADO Volunteer & Youth Action Hub. All rights reserved.',
    seoTitle: 'ASCADO Volunteer Hub - Nationwide Youth Volunteer Platform',
    seoDescription: 'Join as a registered volunteer in Bangladesh for community relief, medical support, and environmental conservation.',
    stats: [
      { id: 'v1', label: 'Registered Volunteers', labelBn: 'নিবন্ধিত ভলান্টিয়ার', value: '৮,৫০০+', iconName: 'Users', color: 'blue' },
      { id: 'v2', label: 'District Teams', labelBn: 'জেলা টিম', value: '৬৪টি', iconName: 'Building2', color: 'indigo' },
      { id: 'v3', label: 'Completed Events', labelBn: 'সফল ইভেন্ট', value: '৩৪০+', iconName: 'Award', color: 'emerald' },
      { id: 'v4', label: 'Tree Planted', labelBn: 'বৃক্ষরোপণ কর্মসূচি', value: '১,২০,০০০+', iconName: 'Sparkles', color: 'teal' }
    ],
    banners: [
      {
        id: 'banner_vl_1',
        imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1400&auto=format&fit=crop&q=80',
        title: 'Join the Nationwide Youth Volunteer Brigade',
        titleBn: 'আসকাডো ইয়ুথ ভলান্টিয়ার ব্রিগেডে আজই যুক্ত হোন',
        subtitle: 'Develop your leadership skills and serve humanity during national crises',
        subtitleBn: 'দেশের ৬৪ জেলায় দুর্যোগ মোকাবিলা, মানবিক ত্রাণ ও সমাজকল্যাণে নেতৃত্ব দিন',
        buttonText: 'Register as Volunteer',
        buttonTextBn: 'ভলান্টিয়ার রেজিস্ট্রেশন',
        buttonLink: '#register',
        badge: 'Join Movement',
        badgeBn: 'স্বেচ্ছাসেবক হোন',
        isActive: true,
        order: 1
      }
    ],
    menuItems: [
      { id: 'vm1', title: 'Volunteer Home', titleBn: 'ভলান্টিয়ার হোম', route: 'home', iconName: 'Home' },
      { id: 'vm2', title: 'Registration', titleBn: 'নতুন সদস্য ফরম', route: 'register', iconName: 'Users' },
      { id: 'vm3', title: 'Active Missions', titleBn: 'চলমান কার্যক্রম', route: 'missions', iconName: 'Sparkles' },
      { id: 'vm4', title: 'Badges & Rewards', titleBn: 'পদক ও সম্মাননা', route: 'badges', iconName: 'Award' }
    ]
  },

  // 5. BLOOD BANK HUB
  'blood-bank': {
    hubId: 'blood-bank',
    name: 'ASCADO 24/7 Central Blood SOS & Donor Network',
    nameBn: 'আসকাডো সেন্ট্রাল ব্লাড ব্যাংক ও ২৪/৭ লাইভ ডোনার হাব',
    tagline: 'One Bag of Blood • Saves a Life • 24/7 Free Live Donor Finder',
    taglineBn: 'এক ব্যাগ রক্ত • একটি জীবন • ২৪/৭ জরুরি রক্ত সেবা ও ডোনার ফাইন্ডার',
    description: 'Instant blood donor search across 64 districts, urgent hospital SOS alerts, automated SMS matching, and district blood committee monitoring.',
    descriptionBn: 'জরুরি প্রয়োজনে হাসপাতাল ও রোগীর জন্য কয়েক সেকেন্ডে রক্তদাতা খুঁজে পাওয়ার ডিজিটাল উন্মুক্ত ব্লাড নেটওয়ার্ক।',
    logoUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=200&auto=format&fit=crop&q=80',
    coverBannerUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1600&auto=format&fit=crop&q=80',
    primaryColor: '#e11d48', // Rose / Red
    secondaryColor: '#881337',
    accentColor: '#f43f5e',
    badgeText: '24/7 Blood SOS',
    badgeTextBn: '২৪/৭ ব্লাড এসওএস',
    contactNumber: '+880 1700-112233',
    email: 'blood@ascado-ngo.org',
    address: 'Central Health Hub, Green Road, Dhaka-1205',
    addressBn: 'সেন্ট্রাল হেলথ হাব, গ্রিন রোড, ঢাকা-১২০৫',
    socialLinks: {
      facebook: 'https://facebook.com',
      whatsapp: '+8801700112233'
    },
    footerText: 'Never pay for blood. Voluntary blood donation is the greatest gift of life.',
    footerTextBn: 'রক্ত কেনাবেচা দণ্ডনীয় অপরাধ। স্বেচ্ছায় রক্তদান করুন, জীবন বাঁচান।',
    copyright: '© 2026 ASCADO 24/7 Central Blood SOS & Donor Network. All rights reserved.',
    seoTitle: 'ASCADO Blood Bank Hub - 24/7 Live Blood Donors Search Bangladesh',
    seoDescription: 'Find A+, B+, O+, AB+, and negative group blood donors in any district of Bangladesh instantly.',
    stats: [
      { id: 'b1', label: 'Registered Donors', labelBn: 'সক্রিয় রক্তদাতা', value: '৪,৮৫০+', iconName: 'Users', color: 'rose' },
      { id: 'b2', label: 'Lives Saved', labelBn: 'জরুরি সহায়তা প্রদান', value: '১২,২০০+', iconName: 'Heart', color: 'red' },
      { id: 'b3', label: 'Districts Covered', labelBn: 'কভারেজ এলাকা', value: '৬৪ জেলা', iconName: 'Building2', color: 'indigo' },
      { id: 'b4', label: 'Avg Response Time', labelBn: 'গড় রেসপন্স টাইম', value: '< ১০ মিনিট', iconName: 'Sparkles', color: 'amber' }
    ],
    banners: [
      {
        id: 'banner_bb_1',
        imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1400&auto=format&fit=crop&q=80',
        title: 'Emergency 24/7 Live Blood Donor Finder',
        titleBn: 'জরুরি প্রয়োজনে রক্তদাতা খুঁজুন মাত্র কয়েক সেকেন্ডে',
        subtitle: 'Search verified donors by blood group, division, district, and upazila instantly',
        subtitleBn: 'ব্লাড গ্রুপ ও আপনার জেলা নির্বাচন করে সরাসরি রক্তদাতার সাথে যোগাযোগ করুন',
        buttonText: 'Search Donors',
        buttonTextBn: 'রক্তদাতা খুঁজুন',
        buttonLink: '#find_donor',
        badge: '24/7 SOS',
        badgeBn: 'জরুরি এসওএস',
        isActive: true,
        order: 1
      }
    ],
    menuItems: [
      { id: 'bm1', title: 'Blood Hub Home', titleBn: 'ব্লাড ব্যাংক হোম', route: 'home', iconName: 'Home' },
      { id: 'bm2', title: 'Find Donors', titleBn: 'রক্তদাতা খুঁজুন', route: 'search', iconName: 'Users' },
      { id: 'bm3', title: 'Emergency SOS Post', titleBn: 'জরুরি রক্তের আবেদন', route: 'sos_post', iconName: 'Heart' },
      { id: 'bm4', title: 'Become a Donor', titleBn: 'রক্তদাতা নিবন্ধন', route: 'register_donor', iconName: 'Sparkles' },
      { id: 'bm5', title: 'District Committees', titleBn: 'জেলা ব্লাড কমিটি', route: 'committees', iconName: 'Building2' }
    ]
  },

  // 6. SCHOOL & EDUCATION HUB
  school: {
    hubId: 'school',
    name: 'ASCADO Academy & School Education Network',
    nameBn: 'আসকাডো একাডেমি ও ডিজিটাল স্কুল নেটওয়ার্ক',
    tagline: 'Quality Education • Digital Classroom • Moral Values',
    taglineBn: 'গুণগত শিক্ষা • আধুনিক প্রযুক্তি • মানবিক মূল্যবোধ',
    description: 'Multi-institution school management ERP, public website portal, interactive photo sliders, digital admissions, and student-parent gradebook portals.',
    descriptionBn: 'আধুনিক মাল্টিমিডিয়া পাঠদান, কম্পিউটার ও বিজ্ঞান ল্যাব, অভিজ্ঞ শিক্ষক এবং ডিজিটাল ফলাফল সম্বলিত মডেল শিক্ষাপ্রতিষ্ঠান।',
    logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80',
    coverBannerUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1600&auto=format&fit=crop&q=80',
    primaryColor: '#0275d8', // Academic Blue
    secondaryColor: '#014c8c',
    accentColor: '#38bdf8',
    badgeText: 'Smart Academy ERP',
    badgeTextBn: 'ডিজিটাল স্কুল পোর্টাল',
    contactNumber: '+880 1711-223344',
    email: 'school@ascado-ngo.org',
    address: 'Academic Campus 1, Uttara Sector 4, Dhaka-1230',
    addressBn: 'অ্যাকাডেমিক ক্যাম্পাস, উত্তরা সেক্টর-৪, ঢাকা-১২৩০',
    socialLinks: {
      facebook: 'https://facebook.com',
      youtube: 'https://youtube.com'
    },
    footerText: 'Nurturing the future leaders with holistic education, sports, and science innovation.',
    footerTextBn: 'আগামীর দক্ষ ও আলোকিত প্রজন্ম গড়ে তুলতে প্রতিশ্রুতিবদ্ধ আসকাডো একাডেমি।',
    copyright: '© 2026 ASCADO Academy & School Education Network. All rights reserved.',
    seoTitle: 'ASCADO School Hub - Smart School Management Portal & Public Website',
    seoDescription: 'Explore digital classrooms, admission forms, exam results, and dynamic campus photo galleries.',
    stats: [
      { id: 'sc1', label: 'Institutions', labelBn: 'অধিভুক্ত প্রতিষ্ঠান', value: '১২টি', iconName: 'Landmark', color: 'blue' },
      { id: 'sc2', label: 'Total Students', labelBn: 'মোট শিক্ষার্থী', value: '৪,৫০০+', iconName: 'Users', color: 'indigo' },
      { id: 'sc3', label: 'Faculty Members', labelBn: 'শিক্ষক-শিক্ষিকা', value: '১৮০+', iconName: 'Award', color: 'emerald' },
      { id: 'sc4', label: 'GPA 5.00 Success', labelBn: 'বোর্ড পরীক্ষায় জিপিএ-৫', value: '৯৮%', iconName: 'Sparkles', color: 'amber' }
    ],
    banners: [
      {
        id: 'banner_sc_1',
        imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1400&auto=format&fit=crop&q=80',
        title: 'ASCADO Digital School & College Campus',
        titleBn: 'আসকাডো মডেল স্কুল ও কলেজ ক্যাম্পাস',
        subtitle: 'Nurturing creative minds with smart multimedia classrooms and science laboratories',
        subtitleBn: 'আধুনিক প্রযুক্তিনির্ভর পাঠদান ও সুশৃঙ্খল শিক্ষাবান্ধব পরিবেশ',
        buttonText: 'Apply Online',
        buttonTextBn: 'অনলাইন ভর্তি আবেদন',
        buttonLink: '#admission',
        badge: 'Admission 2026',
        badgeBn: 'ভর্তি চলছে ২০২৬',
        isActive: true,
        order: 1
      }
    ],
    menuItems: [
      { id: 'sm1', title: 'School Home', titleBn: 'স্কুল হোম', route: 'home', iconName: 'Home' },
      { id: 'sm2', title: 'Public Website', titleBn: 'প্রতিষ্ঠান ওয়েবসাইট', route: 'public_web', iconName: 'Globe' },
      { id: 'sm3', title: 'Online Admission', titleBn: 'ভর্তি আবেদন', route: 'admission', iconName: 'GraduationCap' },
      { id: 'sm4', title: 'Results & Marks', titleBn: 'ফলাফল ও মার্কশিট', route: 'results', iconName: 'BarChart2' },
      { id: 'sm5', title: 'Campus Photo Slider', titleBn: 'ফটো গ্যালারি স্লাইডার', route: 'gallery', iconName: 'ImageIcon' },
      { id: 'sm6', title: 'Admin & Teacher ERP', titleBn: 'টিচার্স ইআরপি', route: 'erp', iconName: 'ShieldCheck' }
    ]
  },

  // 7. MEDICAL & HEALTH HUB
  'medical-courses': {
    hubId: 'medical-courses',
    name: 'ASCADO Medical & Paramedical Institute Hub',
    nameBn: 'আসকাডো প্যারামেডিকেল ও হেলথকেয়ার ইনস্টিটিউট',
    tagline: 'Healthcare for All • Medical Diploma & Telemedicine Services',
    taglineBn: 'সুস্বাস্থ্য সবার অধিকার • মেডিকেল ডিপ্লোমা ও টেলিমেডিসিন সেবা',
    description: 'Medical assistant training, dental diploma, nursing care, pharmacy technician courses, and community telemedicine hubs.',
    descriptionBn: 'স্বাস্থ্য খাতে দক্ষ জনবল তৈরিতে সরকার স্বীকৃত ৪ বছর ও ১-২ বছর মেয়াদী ডিপ্লোমা ইন মেডিকেল টেকনোলজি ও প্যারামেডিকেল কোর্স।',
    logoUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200&auto=format&fit=crop&q=80',
    coverBannerUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&auto=format&fit=crop&q=80',
    primaryColor: '#0d9488', // Teal
    secondaryColor: '#115e59',
    accentColor: '#14b8a6',
    badgeText: 'Medical Institute',
    badgeTextBn: 'মেডিকেল ইনস্টিটিউট',
    contactNumber: '+880 1819-445566',
    email: 'medical@ascado-ngo.org',
    address: 'Medical Institute Campus, Farmgate, Dhaka-1215',
    addressBn: 'মেডিকেল ইনস্টিটিউট ভবন, ফার্মগেট, ঢাকা-১২১৫',
    socialLinks: {
      facebook: 'https://facebook.com'
    },
    footerText: 'Building certified healthcare providers for rural and urban medical facilities.',
    footerTextBn: 'দেশের স্বাস্থ্যসেবায় মানবকল্যাণে নিবেদিত দক্ষ স্বাস্থ্যকর্মী ও প্যারামেডিক গড়ে তোলা।',
    copyright: '© 2026 ASCADO Medical & Paramedical Institute Hub. All rights reserved.',
    seoTitle: 'ASCADO Medical Hub - Medical Diploma, Nursing & Paramedical Institute',
    seoDescription: 'Study DMA, Pharmacy, Dental, and Nursing diploma courses with clinical hospital training.',
    stats: [
      { id: 'md1', label: 'Diploma Courses', labelBn: 'ডিপ্লোমা কোর্স', value: '৮টি', iconName: 'BookOpen', color: 'teal' },
      { id: 'md2', label: 'Medical Students', labelBn: 'মেডিকেল শিক্ষার্থী', value: '১,২০০+', iconName: 'Users', color: 'blue' },
      { id: 'md3', label: 'Hospital Internship', labelBn: 'হাসপাতাল ইন্টার্নশিপ', value: '১০০%', iconName: 'Heart', color: 'rose' },
      { id: 'md4', label: 'Govt Recognition', labelBn: 'বোর্ড স্বীকৃতি', value: 'অনুমোদিত', iconName: 'ShieldCheck', color: 'emerald' }
    ],
    banners: [
      {
        id: 'banner_med_1',
        imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1400&auto=format&fit=crop&q=80',
        title: 'Diploma in Medical Technology & Paramedics',
        titleBn: 'মেডিকেল ও প্যারামেডিকেল ডিপ্লোমা কোর্সে ভর্তি',
        subtitle: 'Direct hospital practical classes, clinical lab training and job placement',
        subtitleBn: 'হাসপাতালে সরাসরি প্র্যাকটিক্যাল ক্লাস ও শতভাগ ইন্টার্নশিপ সুবিধা',
        buttonText: 'View Medical Courses',
        buttonTextBn: 'সকল কোর্স দেখুন',
        buttonLink: '#medical_courses',
        badge: 'Health Education',
        badgeBn: 'মেডিকেল শিক্ষা',
        isActive: true,
        order: 1
      }
    ],
    menuItems: [
      { id: 'mm1', title: 'Medical Home', titleBn: 'মেডিকেল হোম', route: 'home', iconName: 'Home' },
      { id: 'mm2', title: 'Diploma Courses', titleBn: 'ডিপ্লোমা কোর্সসমূহ', route: 'courses', iconName: 'BookOpen' },
      { id: 'mm3', title: 'Admission Form', titleBn: 'ভর্তি আবেদন', route: 'admission', iconName: 'GraduationCap' },
      { id: 'mm4', title: 'Hospital Internship', titleBn: 'হাসপাতাল ইন্টার্নশিপ', route: 'internship', iconName: 'Heart' }
    ]
  },

  // 8. MATRIMONY HUB
  marriage: {
    hubId: 'marriage',
    name: 'ASCADO Shariah Matrimony & Matchmaking Hub',
    nameBn: 'আসকাডো শরিয়াহ ম্যারেজ মিডিয়া ও পাত্র-পাত্রী সন্ধান',
    tagline: 'Sacred Bond • Verified Biodatas • 100% Privacy & Shariah Matchmaking',
    taglineBn: 'পবিত্র বন্ধন • যাচাইকৃত বায়োডাটা • শতভাগ গোপনীয়তা ও শরিয়াহভিত্তিক পাত্র-পাত্রী সন্ধান',
    description: 'Verified matrimonial profiles, guardian communication, privacy-first matchmaking, and community pre-marital counseling.',
    descriptionBn: 'অভিভাবকের তত্ত্বাবধানে সৎ ও দ্বীনদার পাত্র-পাত্রীর নির্ভুল এবং নিরাপদ বায়োডাটা ম্যাচমেকিং প্ল্যাটফর্ম।',
    logoUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=200&auto=format&fit=crop&q=80',
    coverBannerUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&auto=format&fit=crop&q=80',
    primaryColor: '#db2777', // Pink/Rose
    secondaryColor: '#831843',
    accentColor: '#f472b6',
    badgeText: 'Shariah Matrimony',
    badgeTextBn: 'শরিয়াহ পাত্র-পাত্রী সন্ধান',
    contactNumber: '+880 1911-778899',
    email: 'matrimony@ascado-ngo.org',
    address: 'Family Welfare Bhaban, Bijoynagar, Dhaka-1000',
    addressBn: 'পারিবারিক কল্যাণ ভবন, বিজয়নগর, ঢাকা-১০০০',
    socialLinks: {
      facebook: 'https://facebook.com'
    },
    footerText: 'Strict verification of all prospective brides and grooms to guarantee authentic connections.',
    footerTextBn: 'সম্পূর্ণ নিরাপদ ও নির্ভরযোগ্য শরিয়াহ ম্যারেজ মিডিয়া পোর্টাল।',
    copyright: '© 2026 ASCADO Shariah Matrimony Hub. All rights reserved.',
    seoTitle: 'ASCADO Matrimony Hub - Trusted Shariah Matrimonial Biodata Portal',
    seoDescription: 'Find suitable brides and grooms with verified profiles, guardian consent, and privacy.',
    stats: [
      { id: 'mr1', label: 'Verified Biodatas', labelBn: 'যাচাইকৃত বায়োডাটা', value: '৩,২০০+', iconName: 'Users', color: 'pink' },
      { id: 'mr2', label: 'Successful Marriages', labelBn: 'সফল বিবাহ সম্পন্ন', value: '৬৫০+', iconName: 'Heart', color: 'rose' },
      { id: 'mr3', label: 'Active Matchmakers', labelBn: 'অভিজ্ঞ ম্যাচমেকার', value: '২৪ জন', iconName: 'Award', color: 'purple' },
      { id: 'mr4', label: 'Privacy Score', labelBn: 'নিরাপত্তা ও প্রাইভেসি', value: '১০০%', iconName: 'ShieldCheck', color: 'emerald' }
    ],
    banners: [
      {
        id: 'banner_mat_1',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&auto=format&fit=crop&q=80',
        title: 'ASCADO Shariah Matrimony & Matchmaking',
        titleBn: 'আসকাডো শরিয়াহ ম্যারেজ মিডিয়া প্ল্যাটফর্ম',
        subtitle: 'Find your suitable life partner with complete privacy and verified parental guardianship',
        subtitleBn: 'পবিত্র বিবাহ বন্ধনে বিশ্বস্ত পাত্র-পাত্রীর সন্ধানে বিনামূল্যে বায়োডাটা তৈরি করুন',
        buttonText: 'Submit Biodata',
        buttonTextBn: 'বায়োডাটা তৈরি করুন',
        buttonLink: '#create_biodata',
        badge: 'Sacred Match',
        badgeBn: 'পবিত্র বন্ধন',
        isActive: true,
        order: 1
      }
    ],
    menuItems: [
      { id: 'mrm1', title: 'Matrimony Home', titleBn: 'ম্যারেজ মিডিয়া হোম', route: 'home', iconName: 'Home' },
      { id: 'mrm2', title: 'Browse Biodatas', titleBn: 'পাত্র-পাত্রী বায়োডাটা', route: 'biodatas', iconName: 'Users' },
      { id: 'mrm3', title: 'Create Biodata', titleBn: 'বায়োডাটা তৈরি', route: 'create', iconName: 'PlusCircle' },
      { id: 'mrm4', title: 'Shortlisted Profiles', titleBn: 'পছন্দের তালিকা', route: 'shortlist', iconName: 'Heart' }
    ]
  },

  // 9. MARKETPLACE HUB
  marketplace: {
    hubId: 'marketplace',
    name: 'ASCADO Halal & Organic Community Marketplace',
    nameBn: 'আসকাডো হালাল ও অর্গানিক কমিউনিটি মার্কেটপ্লেস',
    tagline: 'Pure Products • Fair Price • Empowering Local Artisans & Agro-Farms',
    taglineBn: 'খাঁটি পণ্য • ন্যায্য মূল্য • স্থানীয় উদ্যোক্তা ও কৃষক সহায়তা',
    description: 'Direct agricultural market, organic honey, mustard oil, handloom clothes, cottage crafts, and wholesale NGO community products.',
    descriptionBn: 'কৃষক ও ক্ষুদ্র উদ্যোক্তাদের উৎপাদিত খাঁটি খাদ্যদ্রব্য ও হস্তশিল্পের বিশ্বস্ত ই-কমার্স প্ল্যাটফর্ম।',
    logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80',
    coverBannerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80',
    primaryColor: '#16a34a', // Green
    secondaryColor: '#14532d',
    accentColor: '#22c55e',
    badgeText: 'Halal Marketplace',
    badgeTextBn: 'হালাল ই-কমার্স',
    contactNumber: '+880 1811-990011',
    email: 'bazar@ascado-ngo.org',
    address: 'Agro Trade Center, Kawran Bazar, Dhaka-1215',
    addressBn: 'কৃষি বাণিজ্য কেন্দ্র, কারওয়ান বাজার, ঢাকা-১২১৫',
    socialLinks: {
      facebook: 'https://facebook.com'
    },
    footerText: 'Direct from rural farm producers to urban doorsteps without middleman exploitation.',
    footerTextBn: 'মাঠ থেকে সরাসরি গ্রাহকের ঘরে ভেজালমুক্ত খাদ্য ও দেশি হস্তশিল্প পৌঁছে দেয় আসকাডো মার্কেটপ্লেস।',
    copyright: '© 2026 ASCADO Halal Community Marketplace. All rights reserved.',
    seoTitle: 'ASCADO Marketplace - Organic Food, Agro Products & Artisan Crafts',
    seoDescription: 'Shop pure mustard oil, Sundarban honey, organic ghee, rice, and handmade crafts.',
    stats: [
      { id: 'mk1', label: 'Verified Products', labelBn: 'মোট পণ্য', value: '৪৫০+ টি', iconName: 'ShoppingBag', color: 'green' },
      { id: 'mk2', label: 'Organic Farmers', labelBn: 'যুক্ত কৃষক ও উদ্যোক্তা', value: '৩২০ জন', iconName: 'Users', color: 'emerald' },
      { id: 'mk3', label: 'Monthly Orders', labelBn: 'মাসিক অর্ডার সম্পন্ন', value: '১,৮০০+', iconName: 'Sparkles', color: 'amber' },
      { id: 'mk4', label: 'Purity Tested', labelBn: 'ল্যাব পরীক্ষিত মান', value: '১০০%', iconName: 'ShieldCheck', color: 'teal' }
    ],
    banners: [
      {
        id: 'banner_mp_1',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&auto=format&fit=crop&q=80',
        title: '100% Pure Organic Agro Products & Honey',
        titleBn: 'শতভাগ খাঁটি অর্গানিক মধু, খাঁটি সরিষার তেল ও কৃষিজ পণ্য',
        subtitle: 'Delivered directly from rural cooperative farming to your kitchen table',
        subtitleBn: 'কোনো প্রকার ভেজাল বা প্রিজারভেটিভ ছাড়া সরাসরি কৃষকের ঘর থেকে সংগ্রহ করা হয়',
        buttonText: 'Shop Products',
        buttonTextBn: 'পণ্য অর্ডার করুন',
        buttonLink: '#shop',
        badge: 'Organic Farm',
        badgeBn: 'ভেজালমুক্ত পণ্য',
        isActive: true,
        order: 1
      }
    ],
    menuItems: [
      { id: 'mpm1', title: 'Market Home', titleBn: 'মার্কেট হোম', route: 'home', iconName: 'Home' },
      { id: 'mpm2', title: 'Agro & Food', titleBn: 'খাদ্য ও অর্গানিক', route: 'food', iconName: 'ShoppingBag' },
      { id: 'mpm3', title: 'Handicrafts', titleBn: 'হস্তশিল্প ও পোশাক', route: 'crafts', iconName: 'Sparkles' },
      { id: 'mpm4', title: 'Farmer Registration', titleBn: 'উদ্যোক্তা সেলার নিবন্ধন', route: 'seller', iconName: 'PlusCircle' }
    ]
  },

  // 10. REAL ESTATE HUB
  'real-estate': {
    hubId: 'real-estate',
    name: 'ASCADO Verified Lands & Community Housing Hub',
    nameBn: 'আসকাডো রিয়েল এস্টেট, প্লট ও নিরাপদ আবাসন হাব',
    tagline: 'Verified Land Titles • Safe Community Housing • Transparent Plotting',
    taglineBn: 'নিষ্ভেজাল জমি • নিরাপদ আবাসন • সহজ কিস্তিতে প্লট ও ফ্ল্যাট বুকিং',
    description: 'Legal title deed verified plots, green residential projects, commercial shop allotments, and easy installment housing cooperatives.',
    descriptionBn: 'আইনগত কাগজপত্র যাচাইকৃত নিষ্ভেজাল জমি, প্লটিং ও সহজ কিস্তিতে ফ্ল্যাট-জমি ক্রয়ের বিশ্বস্ত মাধ্যম।',
    logoUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&auto=format&fit=crop&q=80',
    coverBannerUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&auto=format&fit=crop&q=80',
    primaryColor: '#d97706', // Amber
    secondaryColor: '#78350f',
    accentColor: '#f59e0b',
    badgeText: 'Verified Real Estate',
    badgeTextBn: 'নিষ্ভেজাল আবাসন',
    contactNumber: '+880 1712-889900',
    email: 'property@ascado-ngo.org',
    address: 'Property Plaza, Level 8, Gulshan-1, Dhaka-1212',
    addressBn: 'প্রপার্টি প্লাজা, লেভেল-৮, গুলশান-১, ঢাকা-১২১২',
    socialLinks: {
      facebook: 'https://facebook.com'
    },
    footerText: 'Legal due diligence performed on every land listing.',
    footerTextBn: 'প্রতিটি প্লটের মালিকানা ও সিএস/এসএ/আরএস পর্চা আইন উপদেষ্টাদের মাধ্যমে যাচাইকৃত।',
    copyright: '© 2026 ASCADO Verified Real Estate Hub. All rights reserved.',
    seoTitle: 'ASCADO Real Estate Hub - Verified Residential Plots & Apartments',
    seoDescription: 'Buy legal verified plots and flats in Dhaka, Purbachal, and major divisional zones.',
    stats: [
      { id: 're1', label: 'Active Projects', labelBn: 'চলমান প্রজেক্ট', value: '১৪টি', iconName: 'Home', color: 'amber' },
      { id: 're2', label: 'Plots Booked', labelBn: 'বুকিংকৃত প্লট', value: '৬৮০+', iconName: 'CheckCircle', color: 'emerald' },
      { id: 're3', label: 'Land Area (Acres)', labelBn: 'মোট জমির পরিমাণ', value: '১২০ একর', iconName: 'Building2', color: 'blue' },
      { id: 're4', label: 'Legal Safety', labelBn: 'আইনি বৈধতা', value: '১০০%', iconName: 'ShieldCheck', color: 'teal' }
    ],
    banners: [
      {
        id: 'banner_re_1',
        imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&auto=format&fit=crop&q=80',
        title: '100% Legal & Approved Residential Land Plots',
        titleBn: 'পূর্বাচল ও সাভারে সহজ কিস্তিতে নিষ্ভেজাল আবাসিক প্লট',
        subtitle: 'Modern utility facilities with wide road layout and immediate registry support',
        subtitleBn: 'বিদ্যুৎ, গ্যাস ও সুপ্রশস্ত রাস্তাসহ নাগরিক সুযোগ-সুবিধা সমৃদ্ধ নিশ্চিত আবাসন',
        buttonText: 'View Plot Listings',
        buttonTextBn: 'প্লটসমূহ দেখুন',
        buttonLink: '#plots',
        badge: 'Pre-Booking Open',
        badgeBn: 'বুকিং চলছে',
        isActive: true,
        order: 1
      }
    ],
    menuItems: [
      { id: 'rem1', title: 'Real Estate Home', titleBn: 'প্রপার্টি হোম', route: 'home', iconName: 'Home' },
      { id: 'rem2', title: 'Residential Plots', titleBn: 'আবাসিক প্লট', route: 'plots', iconName: 'Home' },
      { id: 'rem3', title: 'Flats & Apartments', titleBn: 'ফ্ল্যাট ও অ্যাপার্টমেন্ট', route: 'flats', iconName: 'Building2' },
      { id: 'rem4', title: 'Book a Visit', titleBn: 'প্রজেক্ট ভিজিট বুকিং', route: 'visit', iconName: 'Sparkles' }
    ]
  },

  // 11. CONSTITUTION & LEGAL HUB
  constitution: {
    hubId: 'constitution',
    name: 'ASCADO Institutional Constitution & Governance Hub',
    nameBn: 'আসকাডো সাংগঠনিক গঠনতন্ত্র ও আইন হাব',
    tagline: 'Legal Framework • Institutional Governance • Bylaws & Circulars',
    taglineBn: 'আইনসম্মত কাঠামো • প্রাতিষ্ঠানিক সুশাসন • গঠনতন্ত্র ও নির্বাহী নীতিমালা',
    description: 'Official organization constitution, general bylaws, code of conduct for committee members, operational guidelines, and legal compliance archive.',
    descriptionBn: 'প্রতিষ্ঠানের অনুমোদিত মূল গঠনতন্ত্র, কমিটি কাঠামো, নির্বাচন বিধিমালা ও প্রশাসনিক নীতিমালা।',
    logoUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&auto=format&fit=crop&q=80',
    coverBannerUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&auto=format&fit=crop&q=80',
    primaryColor: '#475569', // Slate
    secondaryColor: '#1e293b',
    accentColor: '#64748b',
    badgeText: 'Constitution & Bylaws',
    badgeTextBn: 'গঠনতন্ত্র ও আইন',
    contactNumber: '+880 1713-001122',
    email: 'legal@ascado-ngo.org',
    address: 'Central Legal Secretariat, Kakrail, Dhaka-1000',
    addressBn: 'সেন্ট্রাল লিগ্যাল সচিবালয়, কাকরাইল, ঢাকা-১০০০',
    socialLinks: {},
    footerText: 'Official legal constitution governing all centralized wings and local branches.',
    footerTextBn: 'সংগঠনের সকল শাখা ও অঙ্গসংগঠনের জন্য প্রযোজ্য কেন্দ্রীয় গঠনতন্ত্র ও আইন বিধিমালা।',
    copyright: '© 2026 ASCADO Constitution & Governance Hub. All rights reserved.',
    seoTitle: 'ASCADO Constitution - Official Bylaws & Organizational Regulations',
    seoDescription: 'Read the articles, chapters, election rules, and committee regulations of ASCADO.',
    stats: [
      { id: 'cn1', label: 'Constitutional Articles', labelBn: 'মোট ধারা ও উপধারা', value: '৪৮টি', iconName: 'FileText', color: 'slate' },
      { id: 'cn2', label: 'Committee Levels', labelBn: 'সাংগঠনিক স্তর', value: '৫ স্তর', iconName: 'Building2', color: 'indigo' },
      { id: 'cn3', label: 'Last Amended', labelBn: 'সর্বশেষ সংশোধনী', value: 'জানুয়ারি ২০২৬', iconName: 'Award', color: 'emerald' },
      { id: 'cn4', label: 'Legal Audit', labelBn: 'আইনি সম্মতি', value: '১০০% বৈধ', iconName: 'ShieldCheck', color: 'blue' }
    ],
    banners: [
      {
        id: 'banner_cn_1',
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1400&auto=format&fit=crop&q=80',
        title: 'Official Constitution & Institutional Guidelines',
        titleBn: 'আসকাডো প্রাতিষ্ঠানিক গঠনতন্ত্র ও কার্যপ্রণালী বিধিমালা',
        subtitle: 'Read all articles, organizational hierarchy, election bylaws and ethical guidelines',
        subtitleBn: 'গণতান্ত্রিক ও স্বচ্ছ প্রক্রিয়ায় সংগঠন পরিচালনার মূল ভিত্তি ও সুশাসন নির্দেশিকা',
        buttonText: 'Read Constitution',
        buttonTextBn: 'গঠনতন্ত্র পড়ুন',
        buttonLink: '#articles',
        badge: 'Legal Document',
        badgeBn: 'অফিসিয়াল গঠনতন্ত্র',
        isActive: true,
        order: 1
      }
    ],
    menuItems: [
      { id: 'cnm1', title: 'Constitution Home', titleBn: 'গঠনতন্ত্র হোম', route: 'home', iconName: 'Home' },
      { id: 'cnm2', title: 'Articles & Chapters', titleBn: 'ধারা ও অধ্যায়সমূহ', route: 'articles', iconName: 'FileText' },
      { id: 'cnm3', title: 'Committee Hierarchy', titleBn: 'কমিটি কাঠামো', route: 'hierarchy', iconName: 'Building2' },
      { id: 'cnm4', title: 'Download PDF', titleBn: 'পিডিএফ ডাউনলোড', route: 'download', iconName: 'Download' }
    ]
  },

  // 12. BRANCHES HUB
  branches: {
    hubId: 'branches',
    name: 'ASCADO 64 Districts Central Branch Network',
    nameBn: 'আসকাডো ৬৪ জেলা সেন্ট্রাল শাখা নেটওয়ার্ক হাব',
    tagline: 'Nationwide Network • Divisional Secretariats • Grassroots Empowerment',
    taglineBn: 'দেশব্যাপী সমন্বিত নেটওয়ার্ক • বিভাগীয় সচিবালয় • তৃণমূল ক্ষমতায়ন',
    description: 'Real-time interactive directory of 8 divisional, 64 district, 495 upazila, and thousands of union level branch offices, committees, and coordinators.',
    descriptionBn: 'সমগ্র বাংলাদেশে বিস্তৃত ৮ বিভাগ, ৬৪ জেলা ও উপজেলা পর্যায়ের সকল শাখা অফিস ও দায়িত্বশীলদের যোগাযোগের বিস্তারিত ডিরেক্টরি।',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&auto=format&fit=crop&q=80',
    coverBannerUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80',
    primaryColor: '#2563eb', // Royal Blue
    secondaryColor: '#1e40af',
    accentColor: '#3b82f6',
    badgeText: 'National Network',
    badgeTextBn: '৬৪ জেলা নেটওয়ার্ক',
    contactNumber: '+880 1714-332211',
    email: 'branches@ascado-ngo.org',
    address: 'National Coordination Center, Purana Paltan, Dhaka-1000',
    addressBn: 'জাতীয় সমন্বয় কেন্দ্র, পুরানা পল্টন, ঢাকা-১০০০',
    socialLinks: {
      facebook: 'https://facebook.com'
    },
    footerText: 'Connected across every division, district, and upazila in Bangladesh.',
    footerTextBn: 'সারাদেশের সকল জেলা ও উপজেলা শাখাসমূহ সরাসরি কেন্দ্রীয় ডিজিটাল সিস্টেমের সাথে সংযুক্ত।',
    copyright: '© 2026 ASCADO 64 Districts Central Branch Network. All rights reserved.',
    seoTitle: 'ASCADO Branch Network - 64 Districts Offices & Committees Bangladesh',
    seoDescription: 'Find contact details, addresses, and committee leaders of all ASCADO branches.',
    stats: [
      { id: 'br1', label: 'Divisional Hubs', labelBn: 'বিভাগীয় শাখা', value: '৮টি', iconName: 'Building2', color: 'blue' },
      { id: 'br2', label: 'District Branches', labelBn: 'জেলা শাখা', value: '৬৪টি', iconName: 'Landmark', color: 'indigo' },
      { id: 'br3', label: 'Upazila Units', labelBn: 'উপজেলা শাখা', value: '৪৯৫টি', iconName: 'Home', color: 'emerald' },
      { id: 'br4', label: 'Branch Coordinators', labelBn: 'শাখা সমন্বয়ক', value: '১,৫৫০+ জন', iconName: 'Users', color: 'amber' }
    ],
    banners: [
      {
        id: 'banner_br_1',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&auto=format&fit=crop&q=80',
        title: 'ASCADO Nationwide 64 Districts Branch Network',
        titleBn: 'সারাদেশের ৬৪ জেলায় আসকাডো শাখা নেটওয়ার্ক',
        subtitle: 'Explore active branch secretariats, find local coordinators and join regional meetings',
        subtitleBn: 'আপনার বিভাগ, জেলা ও উপজেলা শাখা অফিসের ঠিকানা ও দায়িত্বশীলদের সাথে সরাসরি যোগাযোগ করুন',
        buttonText: 'Find Your Branch',
        buttonTextBn: 'নিকটস্থ শাখা খুঁজুন',
        buttonLink: '#search_branch',
        badge: 'Nationwide Network',
        badgeBn: 'সমন্বিত নেটওয়ার্ক',
        isActive: true,
        order: 1
      }
    ],
    menuItems: [
      { id: 'brm1', title: 'Branch Home', titleBn: 'শাখা হোম', route: 'home', iconName: 'Home' },
      { id: 'brm2', title: '64 Districts List', titleBn: 'জেলা ভিত্তিক তালিকা', route: 'districts', iconName: 'Building2' },
      { id: 'brm3', title: 'Branch Application', titleBn: 'নতুন শাখা অনুমোদন', route: 'apply', iconName: 'PlusCircle' },
      { id: 'brm4', title: 'Coordinators', titleBn: 'সমন্বয়ক কমিটি', route: 'coordinators', iconName: 'Users' }
    ]
  }
};
