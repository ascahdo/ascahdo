export interface DistrictOption {
  id: string;
  nameBn: string;
  nameEn: string;
  divisionId: string;
}

export interface DivisionOption {
  id: string;
  nameBn: string;
  nameEn: string;
}

export const BANGLADESH_DIVISIONS: DivisionOption[] = [
  { id: 'dhaka', nameBn: 'ঢাকা', nameEn: 'Dhaka' },
  { id: 'chittagong', nameBn: 'চট্টগ্রাম', nameEn: 'Chittagong' },
  { id: 'rajshahi', nameBn: 'রাজশাহী', nameEn: 'Rajshahi' },
  { id: 'khulna', nameBn: 'খুলনা', nameEn: 'Khulna' },
  { id: 'sylhet', nameBn: 'সিলেট', nameEn: 'Sylhet' },
  { id: 'barisal', nameBn: 'বরিশাল', nameEn: 'Barisal' },
  { id: 'rangpur', nameBn: 'রংপুর', nameEn: 'Rangpur' },
  { id: 'mymensingh', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh' },
];

export const BANGLADESH_DISTRICTS: DistrictOption[] = [
  // Dhaka Division
  { id: 'dhaka_dist', nameBn: 'ঢাকা', nameEn: 'Dhaka', divisionId: 'dhaka' },
  { id: 'gazipur', nameBn: 'গাজীপুর', nameEn: 'Gazipur', divisionId: 'dhaka' },
  { id: 'narayanganj', nameBn: 'নারায়ণগঞ্জ', nameEn: 'Narayanganj', divisionId: 'dhaka' },
  { id: 'narsingdi', nameBn: 'নরসিংদী', nameEn: 'Narsingdi', divisionId: 'dhaka' },
  { id: 'tangail', nameBn: 'টাঙ্গাইল', nameEn: 'Tangail', divisionId: 'dhaka' },
  { id: 'kishoreganj', nameBn: 'কিশোরগঞ্জ', nameEn: 'Kishoreganj', divisionId: 'dhaka' },
  { id: 'manikganj', nameBn: 'মানিকগঞ্জ', nameEn: 'Manikganj', divisionId: 'dhaka' },
  { id: 'munshiganj', nameBn: 'মুন্সীগঞ্জ', nameEn: 'Munshiganj', divisionId: 'dhaka' },
  { id: 'faridpur', nameBn: 'ফরিদপুর', nameEn: 'Faridpur', divisionId: 'dhaka' },
  { id: 'gopalganj', nameBn: 'গোপালগঞ্জ', nameEn: 'Gopalganj', divisionId: 'dhaka' },
  { id: 'madaripur', nameBn: 'মাদারীপুর', nameEn: 'Madaripur', divisionId: 'dhaka' },
  { id: 'rajbari', nameBn: 'রাজবাড়ী', nameEn: 'Rajbari', divisionId: 'dhaka' },
  { id: 'shariatpur', nameBn: 'শরীয়তপুর', nameEn: 'Shariatpur', divisionId: 'dhaka' },
  // Chittagong Division
  { id: 'chittagong_dist', nameBn: 'চট্টগ্রাম', nameEn: 'Chittagong', divisionId: 'chittagong' },
  { id: 'coxsbazar', nameBn: 'কক্সবাজার', nameEn: "Cox's Bazar", divisionId: 'chittagong' },
  { id: 'comilla', nameBn: 'কুমিল্লা', nameEn: 'Cumilla', divisionId: 'chittagong' },
  { id: 'feni', nameBn: 'ফেনী', nameEn: 'Feni', divisionId: 'chittagong' },
  { id: 'brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া', nameEn: 'Brahmanbaria', divisionId: 'chittagong' },
  { id: 'chandpur', nameBn: 'চাঁদপুর', nameEn: 'Chandpur', divisionId: 'chittagong' },
  { id: 'noakhali', nameBn: 'নোয়াখালী', nameEn: 'Noakhali', divisionId: 'chittagong' },
  { id: 'lakshmipur', nameBn: 'লক্ষ্মীপুর', nameEn: 'Lakshmipur', divisionId: 'chittagong' },
  { id: 'rangamati', nameBn: 'রাঙ্গামাটি', nameEn: 'Rangamati', divisionId: 'chittagong' },
  { id: 'khagrachhari', nameBn: 'খাগড়াছড়ি', nameEn: 'Khagrachhari', divisionId: 'chittagong' },
  { id: 'bandarban', nameBn: 'বান্দরবান', nameEn: 'Bandarban', divisionId: 'chittagong' },
  // Sylhet Division
  { id: 'sylhet_dist', nameBn: 'সিলেট', nameEn: 'Sylhet', divisionId: 'sylhet' },
  { id: 'moulvibazar', nameBn: 'মৌলভীবাজার', nameEn: 'Moulvibazar', divisionId: 'sylhet' },
  { id: 'habiganj', nameBn: 'হবিগঞ্জ', nameEn: 'Habiganj', divisionId: 'sylhet' },
  { id: 'sunamganj', nameBn: 'সুনামগঞ্জ', nameEn: 'Sunamganj', divisionId: 'sylhet' },
  // Rajshahi Division
  { id: 'rajshahi_dist', nameBn: 'রাজশাহী', nameEn: 'Rajshahi', divisionId: 'rajshahi' },
  { id: 'bogura', nameBn: 'বগুড়া', nameEn: 'Bogura', divisionId: 'rajshahi' },
  { id: 'pabna', nameBn: 'পাবনা', nameEn: 'Pabna', divisionId: 'rajshahi' },
  { id: 'sirajganj', nameBn: 'সিরাজগঞ্জ', nameEn: 'Sirajganj', divisionId: 'rajshahi' },
  { id: 'naogaon', nameBn: 'নওগাঁ', nameEn: 'Naogaon', divisionId: 'rajshahi' },
  { id: 'natore', nameBn: 'নাটোর', nameEn: 'Natore', divisionId: 'rajshahi' },
  { id: 'chapainawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ', nameEn: 'Chapainawabganj', divisionId: 'rajshahi' },
  { id: 'joypurhat', nameBn: 'জয়পুরহাট', nameEn: 'Joypurhat', divisionId: 'rajshahi' },
  // Khulna Division
  { id: 'khulna_dist', nameBn: 'খুলনা', nameEn: 'Khulna', divisionId: 'khulna' },
  { id: 'jashore', nameBn: 'যশোর', nameEn: 'Jashore', divisionId: 'khulna' },
  { id: 'kushtia', nameBn: 'কুষ্টিয়া', nameEn: 'Kushtia', divisionId: 'khulna' },
  { id: 'satkhira', nameBn: 'সাতক্ষীরা', nameEn: 'Satkhira', divisionId: 'khulna' },
  { id: 'bagerhat', nameBn: 'বাগেরহাট', nameEn: 'Bagerhat', divisionId: 'khulna' },
  { id: 'chuadanga', nameBn: 'চুয়াডাঙ্গা', nameEn: 'Chuadanga', divisionId: 'khulna' },
  { id: 'jhenaidah', nameBn: 'ঝিনাইদহ', nameEn: 'Jhenaidah', divisionId: 'khulna' },
  { id: 'magura', nameBn: 'মাগুরা', nameEn: 'Magura', divisionId: 'khulna' },
  { id: 'meherpur', nameBn: 'মেহেরপুর', nameEn: 'Meherpur', divisionId: 'khulna' },
  { id: 'narail', nameBn: 'নড়াইল', nameEn: 'Narail', divisionId: 'khulna' },
  // Barisal Division
  { id: 'barisal_dist', nameBn: 'বরিশাল', nameEn: 'Barisal', divisionId: 'barisal' },
  { id: 'bhola', nameBn: 'ভোলা', nameEn: 'Bhola', divisionId: 'barisal' },
  { id: 'patuakhali', nameBn: 'পটুয়াখালী', nameEn: 'Patuakhali', divisionId: 'barisal' },
  { id: 'pirojpur', nameBn: 'পিরোজপুর', nameEn: 'Pirojpur', divisionId: 'barisal' },
  { id: 'barguna', nameBn: 'বরগুনা', nameEn: 'Barguna', divisionId: 'barisal' },
  { id: 'jhalokati', nameBn: 'ঝালকাঠি', nameEn: 'Jhalokati', divisionId: 'barisal' },
  // Rangpur Division
  { id: 'rangpur_dist', nameBn: 'রংপুর', nameEn: 'Rangpur', divisionId: 'rangpur' },
  { id: 'dinajpur', nameBn: 'দিনাজপুর', nameEn: 'Dinajpur', divisionId: 'rangpur' },
  { id: 'gaibandha', nameBn: 'গাইবান্ধা', nameEn: 'Gaibandha', divisionId: 'rangpur' },
  { id: 'kurigram', nameBn: 'কুড়িগ্রাম', nameEn: 'Kurigram', divisionId: 'rangpur' },
  { id: 'lalmonirhat', nameBn: 'লালমনিরহাট', nameEn: 'Lalmonirhat', divisionId: 'rangpur' },
  { id: 'nilphamari', nameBn: 'নীলফামারী', nameEn: 'Nilphamari', divisionId: 'rangpur' },
  { id: 'panchagarh', nameBn: 'পঞ্চগড়', nameEn: 'Panchagarh', divisionId: 'rangpur' },
  { id: 'thakurgaon', nameBn: 'ঠাকুরগাঁও', nameEn: 'Thakurgaon', divisionId: 'rangpur' },
  // Mymensingh Division
  { id: 'mymensingh_dist', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', divisionId: 'mymensingh' },
  { id: 'jamalpur', nameBn: 'জামালপুর', nameEn: 'Jamalpur', divisionId: 'mymensingh' },
  { id: 'netrokona', nameBn: 'নেত্রকোণা', nameEn: 'Netrokona', divisionId: 'mymensingh' },
  { id: 'sherpur', nameBn: 'শেরপুর', nameEn: 'Sherpur', divisionId: 'mymensingh' },
];

export const EDUCATION_LEVELS = [
  { id: 'Doctorate / PhD', nameBn: 'ডক্টরেট / পিএইচডি (PhD)', nameEn: 'Doctorate / PhD' },
  { id: 'Masters / Post-Graduation', nameBn: 'মাস্টার্স / স্নাতকোত্তর (Masters)', nameEn: 'Masters / Post-Graduation' },
  { id: 'Bachelors / Graduation', nameBn: 'স্নাতক / ডিগ্রি (Bachelors)', nameEn: 'Bachelors / Graduation' },
  { id: 'Medical (MBBS / BDS)', nameBn: 'মেডিকেল (MBBS / BDS / FCPS)', nameEn: 'Medical (MBBS / BDS / FCPS)' },
  { id: 'Engineering (B.Sc Engg)', nameBn: 'ইঞ্জিনিয়ারিং (B.Sc Engineering)', nameEn: 'Engineering (B.Sc Engg)' },
  { id: 'Fazil / Kamil (Madrasah)', nameBn: 'ফাজিল / কামিল (মাদ্রাসা শিক্ষা)', nameEn: 'Fazil / Kamil (Madrasah)' },
  { id: 'Diploma', nameBn: 'ডিপ্লোমা (Diploma)', nameEn: 'Diploma' },
  { id: 'HSC / Alim', nameBn: 'এইচএসসি / আলিম (HSC)', nameEn: 'HSC / Alim' },
];

export const PROFESSIONS_LIST = [
  { id: 'Doctor / Physician', nameBn: 'চিকিৎসক / ডাক্তার (Doctor)', nameEn: 'Doctor / Physician' },
  { id: 'Software Engineer / IT', nameBn: 'সফটওয়্যার ইঞ্জিনিয়ার / আইটি', nameEn: 'Software Engineer / IT' },
  { id: 'BCS Cadre / Govt Officer', nameBn: 'বিসিএস ক্যাডার / সরকারি কর্মকর্তা', nameEn: 'BCS Cadre / Govt Officer' },
  { id: 'Civil / Mechanical / Electrical Engineer', nameBn: 'প্রকৌশলী / ইঞ্জিনিয়ার (Engineer)', nameEn: 'Civil / Mech / Elect Engineer' },
  { id: 'Banker / Financial Sector', nameBn: 'ব্যাংকার / আর্থিক কর্মকর্তা', nameEn: 'Banker / Financial Sector' },
  { id: 'University / College Teacher', nameBn: 'বিশ্ববিদ্যালয় / কলেজ শিক্ষক', nameEn: 'University / College Teacher' },
  { id: 'Advocate / Lawyer / Legal', nameBn: 'আইনজীবী / অ্যাডভোকেট (Advocate)', nameEn: 'Advocate / Lawyer' },
  { id: 'Defense Officer (Army/Navy/Air Force)', nameBn: 'প্রতিরক্ষা কর্মকর্তা (সেনা/নৌ/বিমান)', nameEn: 'Defense Officer' },
  { id: 'Business / Entrepreneur', nameBn: 'ব্যবসায়ী / উদ্যোক্তা (Business)', nameEn: 'Business / Entrepreneur' },
  { id: 'Chartered Accountant (CA/ACCA)', nameBn: 'চার্টার্ড অ্যাকাউন্ট্যান্ট (CA / ACCA / CMA)', nameEn: 'Chartered Accountant' },
  { id: 'Multinational (MNC) Executive', nameBn: 'মাল্টিন্যাশনাল কর্পোরেট এক্সিকিউটিভ', nameEn: 'Multinational (MNC) Executive' },
  { id: 'Islamic Scholar / Khatib', nameBn: 'ইসলামিক স্কলার / খতিব / শিক্ষক', nameEn: 'Islamic Scholar / Khatib' },
  { id: 'NRB / Expatriate Professional', nameBn: 'প্রবাসী পেশাজীবী (UK/USA/Canada/Gulf)', nameEn: 'NRB / Expatriate Professional' },
  { id: 'Private Service / Executive', nameBn: 'বেসরকারি চাকরিজীবী (Private Service)', nameEn: 'Private Service / Executive' },
];

export const HEIGHT_OPTIONS = [
  "4' 8\"", "4' 9\"", "4' 10\"", "4' 11\"", "5' 0\"", "5' 1\"", "5' 2\"", "5' 3\"",
  "5' 4\"", "5' 5\"", "5' 6\"", "5' 7\"", "5' 8\"", "5' 9\"", "5' 10\"", "5' 11\"",
  "6' 0\"", "6' 1\"", "6' 2\"", "6' 3\"", "6' 4\""
];

export const INCOME_RANGES = [
  '৳ ২০,০০০ - ৪০,০০০ (20k - 40k)',
  '৳ ৪০,০০০ - ৭০,০০০ (40k - 70k)',
  '৳ ৭০,০০০ - ১,২০,০০০ (70k - 1.2L)',
  '৳ ১,২০,০০০ - ২,৫০,০০০ (1.2L - 2.5L)',
  '৳ ২,৫০,০০০ - ৫,০০,০০০ (2.5L - 5L)',
  '৳ ৫,০০,০০০+ (5L+ / High Income / Expat)',
];

export const WEIGHT_OPTIONS = [
  '40 kg', '42 kg', '45 kg', '48 kg', '50 kg', '52 kg', '55 kg', '58 kg',
  '60 kg', '62 kg', '65 kg', '68 kg', '70 kg', '72 kg', '75 kg', '78 kg',
  '80 kg', '85 kg', '90 kg', '95 kg', '100+ kg'
];

export const COMPLEXION_OPTIONS = [
  { id: 'very_fair', nameBn: 'অত্যন্ত ফর্সা (Very Fair)', nameEn: 'Very Fair' },
  { id: 'fair', nameBn: 'ফর্সা (Fair)', nameEn: 'Fair' },
  { id: 'wheatish_fair', nameBn: 'উজ্জ্বল শ্যামলা (Wheatish Fair)', nameEn: 'Wheatish Fair' },
  { id: 'wheatish', nameBn: 'শ্যামলা (Wheatish)', nameEn: 'Wheatish' },
  { id: 'dark', nameBn: 'কালো / শ্যামবর্ণ (Dark / Dusky)', nameEn: 'Dark' },
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
