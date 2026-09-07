export interface DivisionItem {
  id: string;
  name: string;
  nameBn: string;
}

export interface DistrictInfo {
  name: string;
  nameBn: string;
  division: string;
  divisionBn: string;
  upazilas: string[];
}

export const BANGLADESH_DIVISIONS: DivisionItem[] = [
  { id: 'dhaka', name: 'Dhaka', nameBn: 'ঢাকা' },
  { id: 'chattogram', name: 'Chattogram', nameBn: 'চট্টগ্রাম' },
  { id: 'rajshahi', name: 'Rajshahi', nameBn: 'রাজশাহী' },
  { id: 'khulna', name: 'Khulna', nameBn: 'খুলনা' },
  { id: 'barishal', name: 'Barishal', nameBn: 'বরিশাল' },
  { id: 'sylhet', name: 'Sylhet', nameBn: 'সিলেট' },
  { id: 'rangpur', name: 'Rangpur', nameBn: 'রংপুর' },
  { id: 'mymensingh', name: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
];

export const COMMITTEE_LEVELS = [
  { id: 'all', name: 'All Levels', nameBn: 'সকল কমিটি', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300' },
  { id: 'division', name: 'Division Committee', nameBn: 'বিভাগীয় কমিটি', badgeColor: 'bg-purple-100 text-purple-900 border-purple-300', icon: '🏛️' },
  { id: 'district', name: 'District Committee', nameBn: 'জেলা কমিটি', badgeColor: 'bg-blue-100 text-blue-900 border-blue-300', icon: '🏢' },
  { id: 'upazila', name: 'Upazila Committee', nameBn: 'উপজেলা / থানা কমিটি', badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300', icon: '🏬' },
  { id: 'union', name: 'Union Committee', nameBn: 'ইউনিয়ন / ওয়ার্ড কমিটি', badgeColor: 'bg-amber-100 text-amber-900 border-amber-300', icon: '🏘️' },
];

export const STANDARD_COMMITTEE_DESIGNATIONS = [
  { value: 'সভাপতি', labelBn: 'সভাপতি', labelEn: 'President', rank: 1 },
  { value: 'সিনিয়র সহ-সভাপতি', labelBn: 'সিনিয়র সহ-সভাপতি', labelEn: 'Senior Vice President', rank: 2 },
  { value: 'সহ-সভাপতি', labelBn: 'সহ-সভাপতি', labelEn: 'Vice President', rank: 3 },
  { value: 'সাধারণ সম্পাদক', labelBn: 'সাধারণ সম্পাদক', labelEn: 'General Secretary', rank: 4 },
  { value: 'যুগ্ম সাধারণ সম্পাদক', labelBn: 'যুগ্ম সাধারণ সম্পাদক', labelEn: 'Joint General Secretary', rank: 5 },
  { value: 'সাংগঠনিক সম্পাদক', labelBn: 'সাংগঠনিক সম্পাদক', labelEn: 'Organizing Secretary', rank: 6 },
  { value: 'সহ-সাংগঠনিক সম্পাদক', labelBn: 'সহ-সাংগঠনিক সম্পাদক', labelEn: 'Asst. Organizing Secretary', rank: 7 },
  { value: 'কোষাধ্যক্ষ / অর্থ সম্পাদক', labelBn: 'কোষাধ্যক্ষ / অর্থ সম্পাদক', labelEn: 'Treasurer / Finance Secretary', rank: 8 },
  { value: 'দপ্তর সম্পাদক', labelBn: 'দপ্তর সম্পাদক', labelEn: 'Office Secretary', rank: 9 },
  { value: 'সহ-দপ্তর সম্পাদক', labelBn: 'সহ-দপ্তর সম্পাদক', labelEn: 'Asst. Office Secretary', rank: 10 },
  { value: 'প্রচার ও প্রকাশনা সম্পাদক', labelBn: 'প্রচার ও প্রকাশনা সম্পাদক', labelEn: 'Publicity & Publication Secretary', rank: 11 },
  { value: 'সমাজকল্যাণ ও ত্রাণ সম্পাদক', labelBn: 'সমাজকল্যাণ ও ত্রাণ সম্পাদক', labelEn: 'Social Welfare & Relief Secretary', rank: 12 },
  { value: 'স্বাস্থ্য ও রক্তদান বিষয়ক সম্পাদক', labelBn: 'স্বাস্থ্য ও রক্তদান বিষয়ক সম্পাদক', labelEn: 'Health & Blood Donation Secretary', rank: 13 },
  { value: 'যুব ও ক্রীড়া সম্পাদক', labelBn: 'যুব ও ক্রীড়া সম্পাদক', labelEn: 'Youth & Sports Secretary', rank: 14 },
  { value: 'মহিলা বিষয়ক সম্পাদিকা', labelBn: 'মহিলা বিষয়ক সম্পাদিকা', labelEn: 'Women Affairs Secretary', rank: 15 },
  { value: 'আইন ও মানবাধিকার সম্পাদক', labelBn: 'আইন ও মানবাধিকার সম্পাদক', labelEn: 'Law & Human Rights Secretary', rank: 16 },
  { value: 'তথ্য ও প্রযুক্তি সম্পাদক', labelBn: 'তথ্য ও প্রযুক্তি সম্পাদক', labelEn: 'ICT & Technology Secretary', rank: 17 },
  { value: 'ধর্ম বিষয়ক সম্পাদক', labelBn: 'ধর্ম বিষয়ক সম্পাদক', labelEn: 'Religious Affairs Secretary', rank: 18 },
  { value: 'কার্যনির্বাহী সদস্য', labelBn: 'কার্যনির্বাহী সদস্য', labelEn: 'Executive Member', rank: 19 },
  { value: 'প্রধান উপদেষ্টা', labelBn: 'প্রধান উপদেষ্টা', labelEn: 'Chief Advisor', rank: 20 },
  { value: 'উপদেষ্টা', labelBn: 'উপদেষ্টা', labelEn: 'Advisor', rank: 21 },
];

export const BANGLADESH_DISTRICTS: Record<string, DistrictInfo> = {
  // DHAKA DIVISION (১৩টি জেলা)
  dhaka: {
    name: 'Dhaka',
    nameBn: 'ঢাকা',
    division: 'dhaka',
    divisionBn: 'ঢাকা',
    upazilas: ['Dhanmondi', 'Mirpur', 'Gulshan', 'Uttara', 'Savar', 'Dhamrai', 'Keraniganj', 'Mohammadpur', 'Badda', 'Tejgaon', 'Motijheel', 'Demra', 'Jatrabari', 'Shahbagh', 'Khilgaon', 'Nawabganj', 'Dohar']
  },
  gazipur: {
    name: 'Gazipur',
    nameBn: 'গাজীপুর',
    division: 'dhaka',
    divisionBn: 'ঢাকা',
    upazilas: ['Gazipur Sadar', 'Kaliakair', 'Kapasia', 'Sreepur', 'Kaliganj', 'Tongi']
  },
  narayanganj: {
    name: 'Narayanganj',
    nameBn: 'নারায়ণগঞ্জ',
    division: 'dhaka',
    divisionBn: 'ঢাকা',
    upazilas: ['Narayanganj Sadar', 'Araihazar', 'Bandar', 'Rupganj', 'Sonargaon', 'Siddhirganj', 'Fatullah']
  },
  narsingdi: {
    name: 'Narsingdi',
    nameBn: 'নরসিংদী',
    division: 'dhaka',
    divisionBn: 'ঢাকা',
    upazilas: ['Narsingdi Sadar', 'Belabo', 'Monohardi', 'Palash', 'Raipura', 'Shibpur']
  },
  tangail: {
    name: 'Tangail',
    nameBn: 'টাঙ্গাইল',
    division: 'dhaka',
    divisionBn: 'ঢাকা',
    upazilas: ['Tangail Sadar', 'Basail', 'Bhuapur', 'Delduar', 'Ghatail', 'Gopalpur', 'Kalihati', 'Madhupur', 'Mirzapur', 'Nagarpur', 'Sakhipur', 'Dhanbari']
  },
  kishoreganj: {
    name: 'Kishoreganj',
    nameBn: 'কিশোরগঞ্জ',
    division: 'dhaka',
    divisionBn: 'ঢাকা',
    upazilas: ['Kishoreganj Sadar', 'Austagram', 'Bajitpur', 'Bhairab', 'Hossainpur', 'Itna', 'Karimganj', 'Katiadi', 'Kuliarchar', 'Mithamain', 'Nikli', 'Pakundia', 'Tarail']
  },
  manikganj: {
    name: 'Manikganj',
    nameBn: 'মানিকগঞ্জ',
    division: 'dhaka',
    divisionBn: 'ঢাকা',
    upazilas: ['Manikganj Sadar', 'Daulatpur', 'Ghior', 'Harirampur', 'Saturia', 'Shivalaya', 'Singair']
  },
  munshiganj: {
    name: 'Munshiganj',
    nameBn: 'মুন্সীগঞ্জ',
    division: 'dhaka',
    divisionBn: 'ঢাকা',
    upazilas: ['Munshiganj Sadar', 'Gazaria', 'Lohajang', 'Sirajdikhan', 'Sreenagar', 'Tongibari']
  },
  faridpur: {
    name: 'Faridpur',
    nameBn: 'ফরিদপুর',
    division: 'dhaka',
    divisionBn: 'ঢাকা',
    upazilas: ['Faridpur Sadar', 'Alfadanga', 'Bhanga', 'Boalmari', 'Charbhadrasan', 'Madhukhali', 'Nagarkanda', 'Sadarpur', 'Saltha']
  },
  gopalganj: {
    name: 'Gopalganj',
    nameBn: 'গোপালগঞ্জ',
    division: 'dhaka',
    divisionBn: 'ঢাকা',
    upazilas: ['Gopalganj Sadar', 'Kashiani', 'Kotalipara', 'Muksudpur', 'Tungipara']
  },
  madaripur: {
    name: 'Madaripur',
    nameBn: 'মাদারীপুর',
    division: 'dhaka',
    divisionBn: 'ঢাকা',
    upazilas: ['Madaripur Sadar', 'Kalkini', 'Rajoir', 'Shibchar', 'Dasar']
  },
  rajbari: {
    name: 'Rajbari',
    nameBn: 'রাজবাড়ী',
    division: 'dhaka',
    divisionBn: 'ঢাকা',
    upazilas: ['Rajbari Sadar', 'Baliakandi', 'Goalandaghat', 'Pangsha', 'Kalukhali']
  },
  shariatpur: {
    name: 'Shariatpur',
    nameBn: 'শরীয়তপুর',
    division: 'dhaka',
    divisionBn: 'ঢাকা',
    upazilas: ['Shariatpur Sadar', 'Bhedarganj', 'Damudya', 'Gosairhat', 'Naria', 'Zajira']
  },

  // CHATTOGRAM DIVISION (১১টি জেলা)
  chattogram: {
    name: 'Chattogram',
    nameBn: 'চট্টগ্রাম',
    division: 'chattogram',
    divisionBn: 'চট্টগ্রাম',
    upazilas: ['Panchlaish', 'Kotwali', 'Halishahar', 'Sitakunda', 'Mirsharai', 'Patiya', 'Hathazari', 'Raozan', 'Fatikchhari', 'Anwara', 'Boalkhali', 'Chandanaish', 'Lohagara', 'Sandwip', 'Satkania', 'Karnafuli']
  },
  noakhali: {
    name: 'Noakhali',
    nameBn: 'নোয়াখালী',
    division: 'chattogram',
    divisionBn: 'চট্টগ্রাম',
    upazilas: ['Companiganj', 'Noakhali Sadar', 'Begumganj', 'Senbagh', 'Chatkhil', 'Sonaimuri', 'Subarnachar', 'Hatiya', 'Kabirhat']
  },
  cumilla: {
    name: 'Cumilla',
    nameBn: 'কুমিল্লা',
    division: 'chattogram',
    divisionBn: 'চট্টগ্রাম',
    upazilas: ['Cumilla Adarsha Sadar', 'Cumilla Sadar Dakshin', 'Barura', 'Brahmanpara', 'Burichang', 'Chandina', 'Chauddagram', 'Daudkandi', 'Debidwar', 'Homna', 'Laksam', 'Muradnagar', 'Nangalkot', 'Meghna', 'Titas', 'Monohargonj', 'Lalmai']
  },
  coxsbazar: {
    name: "Cox's Bazar",
    nameBn: 'কক্সবাজার',
    division: 'chattogram',
    divisionBn: 'চট্টগ্রাম',
    upazilas: ["Cox's Bazar Sadar", 'Teknaf', 'Ukhia', 'Chakaria', 'Ramu', 'Maheshkhali', 'Kutubdia', 'Pekua', 'Eidgaon']
  },
  feni: {
    name: 'Feni',
    nameBn: 'ফেনী',
    division: 'chattogram',
    divisionBn: 'চট্টগ্রাম',
    upazilas: ['Feni Sadar', 'Chhagalnaiya', 'Daganbhuiyan', 'Parshuram', 'Fulgazi', 'Sonagazi']
  },
  brahmanbaria: {
    name: 'Brahmanbaria',
    nameBn: 'ব্রাহ্মণবাড়িয়া',
    division: 'chattogram',
    divisionBn: 'চট্টগ্রাম',
    upazilas: ['Brahmanbaria Sadar', 'Ashuganj', 'Bancharampur', 'Kasba', 'Nabinagar', 'Nasirnagar', 'Sarail', 'Akhaura', 'Bijoynagar']
  },
  chandpur: {
    name: 'Chandpur',
    nameBn: 'চাঁদপুর',
    division: 'chattogram',
    divisionBn: 'চট্টগ্রাম',
    upazilas: ['Chandpur Sadar', 'Faridganj', 'Haimchar', 'Haziganj', 'Kachua', 'Matlab Dakshin', 'Matlab Uttar', 'Shahrasti']
  },
  lakshmipur: {
    name: 'Lakshmipur',
    nameBn: 'লক্ষ্মীপুর',
    division: 'chattogram',
    divisionBn: 'চট্টগ্রাম',
    upazilas: ['Lakshmipur Sadar', 'Raipur', 'Ramganj', 'Ramgati', 'Kamalnagar']
  },
  khagrachhari: {
    name: 'Khagrachhari',
    nameBn: 'খাগড়াছড়ি',
    division: 'chattogram',
    divisionBn: 'চট্টগ্রাম',
    upazilas: ['Khagrachhari Sadar', 'Dighinala', 'Lakshmichhari', 'Mahalchhari', 'Manikchhari', 'Matiranga', 'Panchhari', 'Ramgarh', 'Guimara']
  },
  rangamati: {
    name: 'Rangamati',
    nameBn: 'রাঙ্গামাটি',
    division: 'chattogram',
    divisionBn: 'চট্টগ্রাম',
    upazilas: ['Rangamati Sadar', 'Bagaichhari', 'Barkal', 'Belaichhari', 'Juraichhari', 'Kaptai', 'Kawkhali', 'Langadu', 'Naniarchar', 'Rajasthali']
  },
  bandarban: {
    name: 'Bandarban',
    nameBn: 'বান্দরবান',
    division: 'chattogram',
    divisionBn: 'চট্টগ্রাম',
    upazilas: ['Bandarban Sadar', 'Ali Kadam', 'Lama', 'Naikhongchhari', 'Rowangchhari', 'Ruma', 'Thanchi']
  },

  // RAJSHAHI DIVISION (৮টি জেলা)
  rajshahi: {
    name: 'Rajshahi',
    nameBn: 'রাজশাহী',
    division: 'rajshahi',
    divisionBn: 'রাজশাহী',
    upazilas: ['Boalia', 'Motihar', 'Rajpara', 'Godagari', 'Tanore', 'Bagmara', 'Paba', 'Durgapur', 'Puthia', 'Charghat', 'Bagha']
  },
  bogra: {
    name: 'Bogura',
    nameBn: 'বগুড়া',
    division: 'rajshahi',
    divisionBn: 'রাজশাহী',
    upazilas: ['Bogura Sadar', 'Shibganj', 'Sherpur', 'Gabtali', 'Dhunat', 'Kahaloo', 'Nandigram', 'Sonatala', 'Sariakandi', 'Shajahanpur', 'Dupchanchia', 'Adamdighi']
  },
  pabna: {
    name: 'Pabna',
    nameBn: 'পাবনা',
    division: 'rajshahi',
    divisionBn: 'রাজশাহী',
    upazilas: ['Pabna Sadar', 'Atgharia', 'Bera', 'Bhangura', 'Chatmohar', 'Faridpur', 'Ishwardi', 'Santhia', 'Sujanagar']
  },
  sirajganj: {
    name: 'Sirajganj',
    nameBn: 'সিরাজগঞ্জ',
    division: 'rajshahi',
    divisionBn: 'রাজশাহী',
    upazilas: ['Sirajganj Sadar', 'Belkuchi', 'Chauhali', 'Kamarkhanda', 'Kazipur', 'Raiganj', 'Shahjadpur', 'Tarash', 'Ullahpara']
  },
  naogaon: {
    name: 'Naogaon',
    nameBn: 'নওগাঁ',
    division: 'rajshahi',
    divisionBn: 'রাজশাহী',
    upazilas: ['Naogaon Sadar', 'Atrai', 'Badalgachhi', 'Dhamoirhat', 'Manda', 'Mohadevpur', 'Niamatpur', 'Patnitala', 'Porsha', 'Raninagar', 'Sapahar']
  },
  natore: {
    name: 'Natore',
    nameBn: 'নাটোর',
    division: 'rajshahi',
    divisionBn: 'রাজশাহী',
    upazilas: ['Natore Sadar', 'Bagatipara', 'Baraigram', 'Gurudaspur', 'Lalpur', 'Singra', 'Naldanga']
  },
  chapainawabganj: {
    name: 'Chapainawabganj',
    nameBn: 'চাঁপাইনবাবগঞ্জ',
    division: 'rajshahi',
    divisionBn: 'রাজশাহী',
    upazilas: ['Chapainawabganj Sadar', 'Gomastapur', 'Nachole', 'Bholahat', 'Shibganj']
  },
  joypurhat: {
    name: 'Joypurhat',
    nameBn: 'জয়পুরহাট',
    division: 'rajshahi',
    divisionBn: 'রাজশাহী',
    upazilas: ['Joypurhat Sadar', 'Akkelpur', 'Kalai', 'Khetlal', 'Panchbibi']
  },

  // KHULNA DIVISION (১০টি জেলা)
  khulna: {
    name: 'Khulna',
    nameBn: 'খুলনা',
    division: 'khulna',
    divisionBn: 'খুলনা',
    upazilas: ['Khulna Sadar', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Rupsha', 'Dumuria', 'Batiaghata', 'Paikgachha', 'Dacope', 'Koyra', 'Phultala', 'Terokhada', 'Dighalia']
  },
  jessore: {
    name: 'Jashore',
    nameBn: 'যশোর',
    division: 'khulna',
    divisionBn: 'খুলনা',
    upazilas: ['Jashore Sadar', 'Jhikargachha', 'Keshabpur', 'Manirampur', 'Abhaynagar', 'Bagherpara', 'Chaugachha', 'Sharsha']
  },
  kushtia: {
    name: 'Kushtia',
    nameBn: 'কুষ্টিয়া',
    division: 'khulna',
    divisionBn: 'খুলনা',
    upazilas: ['Kushtia Sadar', 'Bheramara', 'Daulatpur', 'Khoksa', 'Kumarkhali', 'Mirpur']
  },
  satkhira: {
    name: 'Satkhira',
    nameBn: 'সাতক্ষীরা',
    division: 'khulna',
    divisionBn: 'খুলনা',
    upazilas: ['Satkhira Sadar', 'Assasuni', 'Debhata', 'Kalaroa', 'Kaliganj', 'Shyamnagar', 'Tala']
  },
  bagerhat: {
    name: 'Bagerhat',
    nameBn: 'বাগেরহাট',
    division: 'khulna',
    divisionBn: 'খুলনা',
    upazilas: ['Bagerhat Sadar', 'Chitalmari', 'Fakirhat', 'Kachua', 'Mollahat', 'Mongla', 'Morrelganj', 'Rampal', 'Sarankhola']
  },
  chuadanga: {
    name: 'Chuadanga',
    nameBn: 'চুয়াডাঙ্গা',
    division: 'khulna',
    divisionBn: 'খুলনা',
    upazilas: ['Chuadanga Sadar', 'Alamdanga', 'Damurhuda', 'Jibannagar']
  },
  jhenaidah: {
    name: 'Jhenaidah',
    nameBn: 'ঝিনাইদহ',
    division: 'khulna',
    divisionBn: 'খুলনা',
    upazilas: ['Jhenaidah Sadar', 'Harinakunda', 'Kaliganj', 'Kotchandpur', 'Maheshpur', 'Shailkupa']
  },
  magura: {
    name: 'Magura',
    nameBn: 'মাগুরা',
    division: 'khulna',
    divisionBn: 'খুলনা',
    upazilas: ['Magura Sadar', 'Mohammadpur', 'Shalikha', 'Sreepur']
  },
  meherpur: {
    name: 'Meherpur',
    nameBn: 'মেহেরপুর',
    division: 'khulna',
    divisionBn: 'খুলনা',
    upazilas: ['Meherpur Sadar', 'Gangni', 'Mujibnagar']
  },
  narail: {
    name: 'Narail',
    nameBn: 'নড়াইল',
    division: 'khulna',
    divisionBn: 'খুলনা',
    upazilas: ['Narail Sadar', 'Kalia', 'Lohagara']
  },

  // BARISHAL DIVISION (৬টি জেলা)
  barishal: {
    name: 'Barishal',
    nameBn: 'বরিশাল',
    division: 'barishal',
    divisionBn: 'বরিশাল',
    upazilas: ['Barishal Sadar', 'Bakerganj', 'Babuganj', 'Wazirpur', 'Banaripara', 'Gournadi', 'Agailjhara', 'Mehendiganj', 'Muladi', 'Hizla']
  },
  patuakhali: {
    name: 'Patuakhali',
    nameBn: 'পটুয়াখালী',
    division: 'barishal',
    divisionBn: 'বরিশাল',
    upazilas: ['Patuakhali Sadar', 'Bauphal', 'Dashmina', 'Galachipa', 'Kalapara', 'Mirzaganj', 'Rangabali', 'Dumki']
  },
  bhola: {
    name: 'Bhola',
    nameBn: 'ভোলা',
    division: 'barishal',
    divisionBn: 'বরিশাল',
    upazilas: ['Bhola Sadar', 'Burhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan', 'Manpura', 'Tazumuddin']
  },
  pirojpur: {
    name: 'Pirojpur',
    nameBn: 'পিরোজপুর',
    division: 'barishal',
    divisionBn: 'বরিশাল',
    upazilas: ['Pirojpur Sadar', 'Bhandaria', 'Kawkhali', 'Mathbaria', 'Nazirpur', 'Nesarabad', 'Zianagar']
  },
  barguna: {
    name: 'Barguna',
    nameBn: 'বরগুনা',
    division: 'barishal',
    divisionBn: 'বরিশাল',
    upazilas: ['Barguna Sadar', 'Amtali', 'Bamna', 'Betagi', 'Patharghata', 'Taltali']
  },
  jhalokathi: {
    name: 'Jhalokathi',
    nameBn: 'ঝালকাঠি',
    division: 'barishal',
    divisionBn: 'বরিশাল',
    upazilas: ['Jhalokathi Sadar', 'Kathalia', 'Nalchity', 'Rajapur']
  },

  // SYLHET DIVISION (৪টি জেলা)
  sylhet: {
    name: 'Sylhet',
    nameBn: 'সিলেট',
    division: 'sylhet',
    divisionBn: 'সিলেট',
    upazilas: ['Sylhet Sadar', 'Beanibazar', 'Golapganj', 'Zakiganj', 'Kanaighat', 'Fenchuganj', 'Balaganj', 'Biswanath', 'Companiganj', 'Gowainghat', 'Jaintiapur', 'Dakshin Surma', 'Osmani Nagar']
  },
  moulvibazar: {
    name: 'Moulvibazar',
    nameBn: 'মৌলভীবাজার',
    division: 'sylhet',
    divisionBn: 'সিলেট',
    upazilas: ['Moulvibazar Sadar', 'Barlekha', 'Juri', 'Kamalganj', 'Kulaura', 'Rajnagar', 'Sreemangal']
  },
  habiganj: {
    name: 'Habiganj',
    nameBn: 'হবিগঞ্জ',
    division: 'sylhet',
    divisionBn: 'সিলেট',
    upazilas: ['Habiganj Sadar', 'Ajmiriganj', 'Bahubal', 'Baniyachong', 'Chunarughat', 'Lakhai', 'Madhabpur', 'Nabiganj', 'Sayestaganj']
  },
  sunamganj: {
    name: 'Sunamganj',
    nameBn: 'সুনামগঞ্জ',
    division: 'sylhet',
    divisionBn: 'সিলেট',
    upazilas: ['Sunamganj Sadar', 'Bishwamvarpur', 'Chhatak', 'Derai', 'Dharampasha', 'Dowarabazar', 'Jagannathpur', 'Jamalganj', 'Sullah', 'Tahirpur', 'Dakshin Sunamganj', 'Madhyanagar']
  },

  // RANGPUR DIVISION (৮টি জেলা)
  rangpur: {
    name: 'Rangpur',
    nameBn: 'রংপুর',
    division: 'rangpur',
    divisionBn: 'রংপুর',
    upazilas: ['Rangpur Sadar', 'Badarganj', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj']
  },
  dinajpur: {
    name: 'Dinajpur',
    nameBn: 'দিনাজপুর',
    division: 'rangpur',
    divisionBn: 'রংপুর',
    upazilas: ['Dinajpur Sadar', 'Birampur', 'Birganj', 'Biral', 'Bochaganj', 'Chirirbandar', 'Fulbari', 'Ghoraghat', 'Hakimpur', 'Kaharole', 'Khansama', 'Nawabganj', 'Parbatipur']
  },
  gaibandha: {
    name: 'Gaibandha',
    nameBn: 'গাইবান্ধা',
    division: 'rangpur',
    divisionBn: 'রংপুর',
    upazilas: ['Gaibandha Sadar', 'Fulchhari', 'Gobindaganj', 'Palashbari', 'Sadullapur', 'Saghata', 'Sundarganj']
  },
  kurigram: {
    name: 'Kurigram',
    nameBn: 'কুড়িগ্রাম',
    division: 'rangpur',
    divisionBn: 'রংপুর',
    upazilas: ['Kurigram Sadar', 'Bhurungamari', 'Char Rajibpur', 'Chilmari', 'Phulbari', 'Nageshwari', 'Rajarhat', 'Raomari', 'Ulipur']
  },
  nilphamari: {
    name: 'Nilphamari',
    nameBn: 'নীলফামারী',
    division: 'rangpur',
    divisionBn: 'রংপুর',
    upazilas: ['Nilphamari Sadar', 'Dimla', 'Domar', 'Jaldhaka', 'Kishoreganj', 'Saidpur']
  },
  panchagarh: {
    name: 'Panchagarh',
    nameBn: 'পঞ্চগড়',
    division: 'rangpur',
    divisionBn: 'রংপুর',
    upazilas: ['Panchagarh Sadar', 'Atwari', 'Boda', 'Debiganj', 'Tetulia']
  },
  thakurgaon: {
    name: 'Thakurgaon',
    nameBn: 'ঠাকুরগাঁও',
    division: 'rangpur',
    divisionBn: 'রংপুর',
    upazilas: ['Thakurgaon Sadar', 'Baliadangi', 'Haripur', 'Pirganj', 'Ranisankail']
  },
  lalmonirhat: {
    name: 'Lalmonirhat',
    nameBn: 'লালমনিরহাট',
    division: 'rangpur',
    divisionBn: 'রংপুর',
    upazilas: ['Lalmonirhat Sadar', 'Aditmari', 'Hatibandha', 'Kaliganj', 'Patgram']
  },

  // MYMENSINGH DIVISION (৪টি জেলা)
  mymensingh: {
    name: 'Mymensingh',
    nameBn: 'ময়মনসিংহ',
    division: 'mymensingh',
    divisionBn: 'ময়মনসিংহ',
    upazilas: ['Mymensingh Sadar', 'Muktagachha', 'Trishal', 'Bhaluka', 'Fulbaria', 'Gafargaon', 'Gauripur', 'Ishwarganj', 'Haluaghat', 'Dhobaura', 'Nandail', 'Phulpur', 'Tara Khanda']
  },
  jamalpur: {
    name: 'Jamalpur',
    nameBn: 'জামালপুর',
    division: 'mymensingh',
    divisionBn: 'ময়মনসিংহ',
    upazilas: ['Jamalpur Sadar', 'Bakshiganj', 'Dewanganj', 'Islampur', 'Madarganj', 'Melandaha', 'Sarishabari']
  },
  netrokona: {
    name: 'Netrokona',
    nameBn: 'নেত্রকোণা',
    division: 'mymensingh',
    divisionBn: 'ময়মনসিংহ',
    upazilas: ['Netrokona Sadar', 'Atpara', 'Barhatta', 'Durgapur', 'Kalmakanda', 'Kendua', 'Madan', 'Mohanganj', 'Purbadhala', 'Khaliajuri']
  },
  sherpur: {
    name: 'Sherpur',
    nameBn: 'শেরপুর',
    division: 'mymensingh',
    divisionBn: 'ময়মনসিংহ',
    upazilas: ['Sherpur Sadar', 'Jhenaigati', 'Nakla', 'Nalitabari', 'Sreebardi']
  }
};

// Sample Unions/Wards mapping for key Upazilas
export const SAMPLE_UNIONS: Record<string, string[]> = {
  'Companiganj': [
    'Char Elahi Union (চরএলাহী ইউনিয়ন)',
    'Muchapur Union (মুছাপুর ইউনিয়ন)',
    'Sirajpur Union (সিরাজপুর ইউনিয়ন)',
    'Char Fakira Union (চরফকিরা ইউনিয়ন)',
    'Char Kakra Union (চরকাঁকড়া ইউনিয়ন)',
    'Rampur Union (রামপুর ইউনিয়ন)',
    'Char Parvati Union (চরপার্বতী ইউনিয়ন)',
    'Basurhat Pourashava Ward 1 (বসুরহাট পৌরসভা ১নং ওয়ার্ড)',
    'Basurhat Pourashava Ward 2 (বসুরহাট পৌরসভা ২নং ওয়ার্ড)',
    'Basurhat Pourashava Ward 3 (বসুরহাট পৌরসভা ৩নং ওয়ার্ড)'
  ],
  'Dhanmondi': [
    'Ward 15 (ধানমন্ডি ১৫নং ওয়ার্ড)',
    'Ward 32 (ধানমন্ডি ৩২নং ওয়ার্ড)',
    'Ward 14 (ধানমন্ডি ১৪নং ওয়ার্ড)',
    'Kalabagan Ward (কলাবাগান ওয়ার্ড)',
    'Rayerbazar Ward (রায়েরবাজার ওয়ার্ড)'
  ],
  'Bogura Sadar': [
    'Fapore Union (ফাপোড় ইউনিয়ন)',
    'Nungola Union (নুংগোলা ইউনিয়ন)',
    'Shabgram Union (সাবগ্রাম ইউনিয়ন)',
    'Gokul Union (গোকুল ইউনিয়ন)',
    'Erulia Union (এরুলিয়া ইউনিয়ন)',
    'Shekherkola Union (শেখেরকোলা ইউনিয়ন)',
    'Pourashava Ward 4 (পৌরসভা ৪নং ওয়ার্ড)',
    'Pourashava Ward 8 (পৌরসভা ৮নং ওয়ার্ড)'
  ],
  'Mirpur': [
    'Ward 08 (মিরপুর ৮নং ওয়ার্ড)',
    'Ward 11 (মিরপুর ১১নং ওয়ার্ড)',
    'Ward 12 (মিরপুর ১২নং ওয়ার্ড)',
    'Ward 13 (মিরপুর ১৩নং ওয়ার্ড)',
    'Ward 14 (মিরপুর ১৪নং ওয়ার্ড)'
  ],
  'Savar': [
    'Savar Union (সাভার সদর ইউনিয়ন)',
    'Ashulia Union (আশুলিয়া ইউনিয়ন)',
    'Birulia Union (বিরুলিয়া ইউনিয়ন)',
    'Dhamsona Union (ধামসোনা ইউনিয়ন)',
    'Kaundia Union (কাউন্দিয়া ইউনিয়ন)',
    'Pathalia Union (পাথালিয়া ইউনিয়ন)',
    'Tetuljhora Union (তেঁতুলঝোড়া ইউনিয়ন)'
  ],
  'Patiya': [
    'Kasiais Union (কাটৈশ ইউনিয়ন)',
    'Bhatikhari Union (ভাটিখাইন ইউনিয়ন)',
    'Kachuai Union (কচুয়াই ইউনিয়ন)',
    'Chhanhara Union (ছনহরা ইউনিয়ন)',
    'Jiri Union (জিরি ইউনিয়ন)',
    'Kolatoli Union (কোলাগাঁও ইউনিয়ন)'
  ]
};

// Helper Functions
export const getDistrictsByDivision = (divisionId: string): { key: string; district: DistrictInfo }[] => {
  if (!divisionId || divisionId === 'all') {
    return Object.entries(BANGLADESH_DISTRICTS).map(([key, district]) => ({ key, district }));
  }
  return Object.entries(BANGLADESH_DISTRICTS)
    .filter(([_, dist]) => dist.division.toLowerCase() === divisionId.toLowerCase())
    .map(([key, district]) => ({ key, district }));
};

export const getUpazilasByDistrictKey = (districtKey: string): string[] => {
  if (!districtKey || districtKey === 'all') return [];
  const dist = BANGLADESH_DISTRICTS[districtKey.toLowerCase()];
  return dist ? dist.upazilas : [];
};

export const getUnionsByUpazilaName = (upazilaName: string): string[] => {
  if (!upazilaName) return [];
  // Return matched sample unions or generic union suggestions
  if (SAMPLE_UNIONS[upazilaName]) {
    return SAMPLE_UNIONS[upazilaName];
  }
  return [
    '১নং সদর ইউনিয়ন পরিষদ (Union 1)',
    '২নং উত্তর ইউনিয়ন পরিষদ (Union 2)',
    '৩নং দক্ষিণ ইউনিয়ন পরিষদ (Union 3)',
    '৪নং পূর্ব ইউনিয়ন পরিষদ (Union 4)',
    '৫নং পশ্চিম ইউনিয়ন পরিষদ (Union 5)',
    'পৌরসভা ১নং ওয়ার্ড (Pourashava Ward 1)',
    'পৌরসভা ২নং ওয়ার্ড (Pourashava Ward 2)'
  ];
};
