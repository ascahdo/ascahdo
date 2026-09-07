import { DonationCategoryItem, DonationCategoryType, OfficialDonationTransaction } from '../types/donationTypes';

export const DONATION_CATEGORIES: DonationCategoryItem[] = [
  {
    id: 'helpless_support',
    name: 'Helpless People Support',
    nameBn: 'অসহায় মানুষের সহায়তা',
    description: 'Direct cash, shelter and rehabilitation assistance for destitute families.',
    descriptionBn: 'দরিদ্র ও গৃহহীন অসহায় পরিবারের গৃহনির্মাণ, পুনর্বাসন ও নগদ সহায়তা।',
    iconName: 'HeartHandshake',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50 border-rose-200',
    targetAmount: 2500000,
    totalCollected: 1850000,
    totalSpent: 1620000,
    activeCampaignsCount: 4
  },
  {
    id: 'education_aid',
    name: 'Education & Student Aid',
    nameBn: 'শিক্ষা সহায়তা ও উপবৃত্তি',
    description: 'Scholarships, school fees, books and supplies for underprivileged students.',
    descriptionBn: 'মেধাবী ও দরিদ্র শিক্ষার্থীদের মাসিক উপবৃত্তি, বই-খাতা ও পরীক্ষার ফি অনুদান।',
    iconName: 'GraduationCap',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    targetAmount: 2000000,
    totalCollected: 1540000,
    totalSpent: 1380000,
    activeCampaignsCount: 3
  },
  {
    id: 'medical_aid',
    name: 'Medical & Healthcare Aid',
    nameBn: 'চিকিৎসা সহায়তা ও ডায়ালাইসিস',
    description: 'Critical surgery, kidney dialysis, cancer medicine, and hospital bills.',
    descriptionBn: 'জরুরি অপারেশন, কিডনি ডায়ালাইসিস, ক্যান্সার ওষুধ ও জটিল রোগীর চিকিৎসা সহায়তা।',
    iconName: 'HeartPulse',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
    targetAmount: 3500000,
    totalCollected: 2950000,
    totalSpent: 2780000,
    activeCampaignsCount: 5
  },
  {
    id: 'food_distribution',
    name: 'Food & Grocery Distribution',
    nameBn: 'খাদ্য বিতরণ ও পুষ্টি সহায়তা',
    description: 'Monthly grocery packs, dry rations, and hot meals for starving families.',
    descriptionBn: 'দুঃস্থদের জন্য নিত্যপ্রয়োজনীয় চাল-ডাল-তেল সম্বলিত মাসিক খাদ্য সামগ্রী উপহার।',
    iconName: 'ShoppingBag',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
    targetAmount: 1800000,
    totalCollected: 1420000,
    totalSpent: 1390000,
    activeCampaignsCount: 2
  },
  {
    id: 'orphan_care',
    name: 'Orphan Sponsorship & Care',
    nameBn: 'এতিম সহায়তা ও লালন-পালন',
    description: 'Complete monthly living, education, clothing and shelter sponsorship for orphans.',
    descriptionBn: 'পিতৃহীন এতিম শিশুদের নিরাপদ বাসস্থান, পুষ্টিকর খাবার ও মানসম্মত শিক্ষার সার্বিক ব্যয়ভার।',
    iconName: 'Users',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 border-indigo-200',
    targetAmount: 2200000,
    totalCollected: 1980000,
    totalSpent: 1750000,
    activeCampaignsCount: 3
  },
  {
    id: 'disaster_relief',
    name: 'Disaster & Crisis Relief',
    nameBn: 'দুর্যোগকালীন জরুরি সহায়তা',
    description: 'Emergency search, dry food, clean drinking water, and post-crisis rebuilding.',
    descriptionBn: 'ঘূর্ণিঝড়, নদীভাঙন ও অগ্নিকাণ্ডে ক্ষতিগ্রস্ত পরিবারকে তাৎক্ষণিক ত্রাণ ও গৃহসামগ্রী।',
    iconName: 'ShieldAlert',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 border-orange-200',
    targetAmount: 3000000,
    totalCollected: 2600000,
    totalSpent: 2450000,
    activeCampaignsCount: 2
  },
  {
    id: 'winter_clothes',
    name: 'Winter Clothes & Blankets',
    nameBn: 'শীতবস্ত্র ও কম্বল বিতরণ',
    description: 'Quality warm clothes and blankets for cold-wave hit northern & coastal districts.',
    descriptionBn: 'উত্তরাঞ্চল ও উপকূলীয় চরাঞ্চলের দরিদ্র শীতার্তদের মাঝে নতুন কম্বল ও গরম পোশাক বিতরণ।',
    iconName: 'CloudSnow',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50 border-cyan-200',
    targetAmount: 1500000,
    totalCollected: 1350000,
    totalSpent: 1280000,
    activeCampaignsCount: 1
  },
  {
    id: 'flood_relief',
    name: 'Flood Relief & Water Sanitization',
    nameBn: 'বন্যা পুনর্বাসন ও নিরাপদ পানি',
    description: 'Boat rescues, water purification tablets, tube-well installations, and crop seeds.',
    descriptionBn: 'বন্যাদুর্গত এলাকায় বিশুদ্ধ পানির গভীর নলকূপ স্থাপন, ওষুধ ও কৃষক পুনর্বাসন তহবিল।',
    iconName: 'Droplets',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50 border-teal-200',
    targetAmount: 4000000,
    totalCollected: 3820000,
    totalSpent: 3650000,
    activeCampaignsCount: 4
  },
  {
    id: 'mosque_madrasa',
    name: 'Mosque & Madrasa Support',
    nameBn: 'মসজিদ ও মাদ্রাসা সহায়তা',
    description: 'Development, Quran learning, solar power, wudu setups and student support.',
    descriptionBn: 'গ্রামাঞ্চলের মসজিদ সংস্কার, হিফজ শিক্ষার্থীদের খোরাকি ও সৌরবিদ্যুৎ সংযোগ সহায়তা।',
    iconName: 'Landmark',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50/80 border-emerald-200',
    targetAmount: 2000000,
    totalCollected: 1650000,
    totalSpent: 1480000,
    activeCampaignsCount: 2
  },
  {
    id: 'youth_development',
    name: 'Youth Skill & Self-Employment',
    nameBn: 'যুব উন্নয়ন ও স্বাবলম্বীকরণ',
    description: 'Sewing machines, auto-rickshaw vans, IT freelancing setups, and small business capital.',
    descriptionBn: 'বেকার যুবক ও মহিলাদের সেলাই মেশিন, ভ্যানগাড়ি প্রদান ও কর্মমুখী কারিগরি প্রশিক্ষণ।',
    iconName: 'Briefcase',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200',
    targetAmount: 1800000,
    totalCollected: 1410000,
    totalSpent: 1250000,
    activeCampaignsCount: 2
  },
  {
    id: 'zakat_fund',
    name: 'Zakat & Fitra Fund',
    nameBn: 'যাকাত ও ফিতরা তহবিল',
    description: 'Strict Shariah-compliant Zakat distribution to eligible Asnaf beneficiaries.',
    descriptionBn: 'সম্পূর্ণ শরীয়াহসম্মতভাবে সুনির্দিষ্ট ৮টি খাতে হকদার ও নিঃস্বদের সরাসরি স্থায়ী পুনর্বাসন।',
    iconName: 'Sparkles',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50/90 border-amber-300',
    targetAmount: 5000000,
    totalCollected: 4650000,
    totalSpent: 4280000,
    activeCampaignsCount: 6
  },
  {
    id: 'other_general',
    name: 'General Welfare & Sadaqah',
    nameBn: 'অন্যান্য / সাধারণ সদকা ও কল্যাণ',
    description: 'General charity for unexpected emergencies, dead body transport, and public utilities.',
    descriptionBn: 'সাধারণ দান ও সদকা তহবিল যা যেকোনো জরুরি গণকল্যাণে তাৎক্ষণিক ব্যবহার করা হয়।',
    iconName: 'Heart',
    color: 'text-slate-700',
    bgColor: 'bg-slate-50 border-slate-200',
    targetAmount: 1200000,
    totalCollected: 980000,
    totalSpent: 890000,
    activeCampaignsCount: 1
  }
];

export const getCategoryMeta = (catId: DonationCategoryType): DonationCategoryItem => {
  return (
    DONATION_CATEGORIES.find((c) => c.id === catId) || {
      id: 'other_general',
      name: 'General Welfare',
      nameBn: 'সাধারণ কল্যাণ তহবিল',
      description: 'General welfare fund.',
      descriptionBn: 'সাধারণ মানবকল্যাণ তহবিল।',
      iconName: 'Heart',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-200',
      totalCollected: 0,
      totalSpent: 0,
      activeCampaignsCount: 0
    }
  );
};

export const generateOfficialReceiptNo = (seq?: number): string => {
  const currentYear = new Date().getFullYear();
  const randomSeq = seq || Math.floor(10000 + Math.random() * 90000);
  return `ASC-REC-${currentYear}-${randomSeq}`;
};
export const generateReceiptNumber = generateOfficialReceiptNo;

export const generateDonationCertificateNo = (seq?: number): string => {
  const currentYear = new Date().getFullYear();
  const randomSeq = seq || Math.floor(1000 + Math.random() * 9000);
  return `ASC-CERT-DON-${currentYear}-${randomSeq}`;
};
export const generateCertificateNumber = generateDonationCertificateNo;

export const generateDonationTrxId = (method: string): string => {
  const prefix = (method || 'BK').substring(0, 2).toUpperCase();
  const digits = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}${digits}`;
};

export const formatTakaBn = (amount: number | string | undefined | null): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) || 0 : (Number(amount) || 0);
  return `৳ ${num.toLocaleString('en-IN')}`;
};

export const generateDonationVerificationUrl = (receiptNo: string, trxId: string): string => {
  return `${typeof window !== 'undefined' ? window.location.origin : 'https://ascado.org'}/donation?verify=${encodeURIComponent(receiptNo)}&trx=${encodeURIComponent(trxId)}`;
};

export const generateDonationQrString = (tx: Partial<OfficialDonationTransaction>): string => {
  return JSON.stringify({
    org: 'ASCAHDO Central Social Welfare Trust',
    reg: 'REG-NGO-DH-88741 / Gov Approved',
    receiptNo: tx.receiptNumber,
    trxId: tx.transactionId,
    donor: tx.isAnonymous ? 'Anonymous Donor (মহৎ দাতা)' : tx.donorName,
    amount: tx.amount,
    category: tx.categoryNameBn || tx.category,
    date: tx.createdAt ? tx.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
    status: 'VERIFIED_OFFICIAL_RECORD',
    verifyUrl: `https://ascado.org/verify-receipt?rec=${tx.receiptNumber}`
  });
};
export const generateQrCodePayload = (params: any): string => {
  return typeof params === 'string' ? params : JSON.stringify(params);
};

export const calculateZakat = (assets: {
  cashInHand: number;
  bankBalance: number;
  goldValueInTaka: number;
  silverValueInTaka: number;
  businessGoodsValue: number;
  receivables: number;
  debtsAndLiabilities: number;
}): {
  totalAssets: number;
  netZakatableWealth: number;
  nisabMet: boolean;
  nisabThresholdSilver: number;
  zakatPayable: number;
} => {
  const totalGross =
    (assets.cashInHand || 0) +
    (assets.bankBalance || 0) +
    (assets.goldValueInTaka || 0) +
    (assets.silverValueInTaka || 0) +
    (assets.businessGoodsValue || 0) +
    (assets.receivables || 0);

  const liabilities = assets.debtsAndLiabilities || 0;
  const netZakatableWealth = Math.max(0, totalGross - liabilities);

  // 52.5 Tola (approx 612.36g) of silver is standard Nisab (~85,000 BDT in Bangladesh current benchmark)
  const nisabThresholdSilver = 85000;
  const nisabMet = netZakatableWealth >= nisabThresholdSilver;
  const zakatPayable = nisabMet ? Math.round(netZakatableWealth * 0.025) : 0; // 2.5%

  return {
    totalAssets: totalGross,
    netZakatableWealth,
    nisabMet,
    nisabThresholdSilver,
    zakatPayable
  };
};
