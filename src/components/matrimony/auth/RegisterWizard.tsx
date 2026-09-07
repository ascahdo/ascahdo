import React, { useState } from 'react';
import {
  X,
  User,
  Heart,
  CheckCircle2,
  Phone,
  Lock,
  MapPin,
  GraduationCap,
  Briefcase,
  Users,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimony } from '../../../context/MatrimonyContext';
import { useMatrimonyAuth } from '../../../context/MatrimonyAuthContext';
import { Gender, MaritalStatus, Religion } from '../../../types/matrimonyTypes';
import { BANGLADESH_DIVISIONS, BANGLADESH_DISTRICTS } from '../../../data/bangladeshData';

interface RegisterWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
  onSuccessRegister?: () => void;
}

export const RegisterWizard: React.FC<RegisterWizardProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
  onSuccessRegister,
}) => {
  const { lang, t } = useMatrimonyLanguage();
  const { registerProfile } = useMatrimony();
  const { registerUser } = useMatrimonyAuth();

  const [step, setStep] = useState(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState<Gender>('female');
  const [dateOfBirth, setDateOfBirth] = useState('1998-06-15');
  const [height, setHeight] = useState("5' 4\"");
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('never_married');
  const [religion, setReligion] = useState<Religion>('Islam');
  const [sect, setSect] = useState('Sunni');
  const [division, setDivision] = useState('dhaka');
  const [district, setDistrict] = useState('dhaka_dist');
  const [presentAddress, setPresentAddress] = useState('Dhanmondi, Dhaka');
  // Education
  const [eduLevel, setEduLevel] = useState('Bachelors / Graduation');
  const [degree, setDegree] = useState('B.Sc in CSE');
  const [institution, setInstitution] = useState('University of Dhaka');
  // Profession
  const [professionType, setProfessionType] = useState('Private Service / Executive');
  const [designation, setDesignation] = useState('Software Engineer');
  const [organization, setOrganization] = useState('Tech Solutions BD');
  const [monthlyIncome, setMonthlyIncome] = useState('৳ ৬০,০০০ - ৮০,০০০');
  // Family
  const [fatherOccupation, setFatherOccupation] = useState('Retired Govt Officer');
  const [motherOccupation, setMotherOccupation] = useState('Homemaker');
  const [brothersCount, setBrothersCount] = useState(1);
  const [sistersCount, setSistersCount] = useState(1);
  const [guardianContact, setGuardianContact] = useState('');
  // Photo & Bio
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80');
  const [aboutMe, setAboutMe] = useState('সহজ-সরল ও দ্বীনি মানসিকতাসম্পন্ন মার্জিত পাত্র/পাত্রী খুঁজছি।');
  const [termsAccepted, setTermsAccepted] = useState(true);

  if (!isOpen) return null;

  const availableDistricts = BANGLADESH_DISTRICTS.filter(d => d.divisionId === division);

  const calculateAge = (dob: string) => {
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)) || 25;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const age = calculateAge(dateOfBirth);

    const newProfile = registerProfile({
      fullName,
      displayName: fullName,
      gender,
      dateOfBirth,
      age,
      height,
      maritalStatus,
      religion,
      sectReligiousSubtype: sect,
      location: {
        country: 'Bangladesh',
        division,
        district,
        presentAddress,
        permanentAddress: presentAddress,
      },
      education: {
        level: eduLevel,
        degree,
        institution,
      },
      profession: {
        professionType,
        designation,
        organization,
        monthlyIncomeRange: monthlyIncome,
        employmentType: 'full_time',
      },
      family: {
        fatherOccupation,
        motherOccupation,
        brothersCount,
        sistersCount,
        familyStatus: 'upper_middle_class',
        aboutFamily: 'সম্মানিত ও মার্জিত পরিবার।',
      },
      guardianContact: guardianContact || mobile,
      avatarUrl,
      aboutMe,
    });

    registerUser({
      fullName,
      mobile,
      password,
      role: 'user',
      profileId: newProfile.id,
      membershipTier: 'free',
      isVerified: false,
    });

    onClose();
    onSuccessRegister?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-4 max-h-[94vh] flex flex-col animate-in zoom-in-95">
        {/* Wizard Header */}
        <div className="bg-slate-900 text-white p-6 pb-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-rose-400 uppercase">
              {lang === 'bn' ? `ধাপ ${step} এর ৪` : `Step ${step} of 4`}
            </span>
            <h3 className="text-xl font-bold font-serif text-white">
              {step === 1 && (lang === 'bn' ? 'ব্যক্তিগত ও প্রাথমিক তথ্য' : 'Personal & Basic Info')}
              {step === 2 && (lang === 'bn' ? 'শিক্ষা ও কর্মসংস্থান' : 'Education & Career')}
              {step === 3 && (lang === 'bn' ? 'পারিবারিক বিবরণ' : 'Family Details')}
              {step === 4 && (lang === 'bn' ? 'ছবি ও চূড়ান্ত প্রকাশ' : 'Photo & Final Publish')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Progress Bar */}
        <div className="h-1.5 bg-slate-100 w-full shrink-0">
          <div
            className="h-full bg-rose-700 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Wizard Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm">
          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'বায়োডাটা কার জন্য (Gender)' : 'Looking to marry (Gender)'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2.5 px-4 rounded-xl border font-semibold flex items-center justify-center gap-2 ${
                      gender === 'female'
                        ? 'bg-rose-700 text-white border-rose-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>🧕</span>
                    <span>{lang === 'bn' ? 'পাত্রী (Bride)' : 'Bride'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2.5 px-4 rounded-xl border font-semibold flex items-center justify-center gap-2 ${
                      gender === 'male'
                        ? 'bg-rose-700 text-white border-rose-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>👳</span>
                    <span>{lang === 'bn' ? 'পাত্র (Groom)' : 'Groom'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Sadia / Engr. Tanvir"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'মোবাইল নম্বর (লগইনের জন্য)' : 'Mobile Number (Login ID)'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'পাসওয়ার্ড তৈরি করুন' : 'Create Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 transition p-0.5 rounded"
                      title={showPassword ? (lang === 'bn' ? 'পাসওয়ার্ড লুকান' : 'Hide Password') : (lang === 'bn' ? 'পাসওয়ার্ড দেখুন' : 'Show Password')}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-rose-600" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'জন্ম তারিখ' : 'Date of Birth'}
                  </label>
                  <input
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={e => setDateOfBirth(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'উচ্চতা' : 'Height'}
                  </label>
                  <select
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {["4' 10\"", "5' 0\"", "5' 2\"", "5' 3\"", "5' 4\"", "5' 5\"", "5' 6\"", "5' 7\"", "5' 8\"", "5' 9\"", "5' 10\"", "5' 11\"", "6' 0\"", "6' 2\""].map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'বৈবাহিক অবস্থা' : 'Marital Status'}
                  </label>
                  <select
                    value={maritalStatus}
                    onChange={e => setMaritalStatus(e.target.value as MaritalStatus)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="never_married">অবিবাহিত (Never Married)</option>
                    <option value="divorced">ডিভোর্সড (Divorced)</option>
                    <option value="widowed">বিধবা/বিপত্নীক (Widowed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'বিভাগ' : 'Division'}
                  </label>
                  <select
                    value={division}
                    onChange={e => {
                      setDivision(e.target.value);
                      setDistrict('dhaka_dist');
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {BANGLADESH_DIVISIONS.map(div => (
                      <option key={div.id} value={div.id}>{lang === 'bn' ? div.nameBn : div.nameEn}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'জেলা' : 'District'}
                  </label>
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {availableDistricts.map(dist => (
                      <option key={dist.id} value={dist.id}>{lang === 'bn' ? dist.nameBn : dist.nameEn}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Education & Career */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'শিক্ষাগত স্তর' : 'Education Level'}
                  </label>
                  <select
                    value={eduLevel}
                    onChange={e => setEduLevel(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Medical">MBBS / BDS / Medical Specialist</option>
                    <option value="Bachelors / Graduation">Bachelors / Graduation (B.Sc / BBA / BA)</option>
                    <option value="Masters / Post-Graduation">Masters / Post-Graduation (M.Sc / MBA)</option>
                    <option value="Islamic">Fazil / Kamil / Dawra-e-Hadith</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'ডিগ্রির নাম' : 'Degree / Subject'}
                  </label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={e => setDegree(e.target.value)}
                    placeholder="e.g. MBBS / B.Sc in CSE"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'শিক্ষা প্রতিষ্ঠান / বিশ্ববিদ্যালয়' : 'Institution / University'}
                  </label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={e => setInstitution(e.target.value)}
                    placeholder="e.g. Dhaka Medical College / BUET / DU"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'পেশার ধরন' : 'Profession Type'}
                  </label>
                  <select
                    value={professionType}
                    onChange={e => setProfessionType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Doctor / Medical Specialist">Doctor / Medical Specialist</option>
                    <option value="Software Engineer / IT Lead">Software Engineer / IT Lead</option>
                    <option value="Govt. Official / BCS Cadre">Govt. Official / BCS Cadre</option>
                    <option value="Banker / Financial Officer">Banker / Financial Officer</option>
                    <option value="Lecturer / Teacher">Lecturer / Teacher</option>
                    <option value="Business Owner / Entrepreneur">Business Owner / Entrepreneur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'পদবি (Designation)' : 'Designation'}
                  </label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    placeholder="e.g. Assistant Director / Medical Officer"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'প্রতিষ্ঠানের নাম' : 'Organization Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={e => setOrganization(e.target.value)}
                    placeholder="e.g. Ministry of Health / Square Pharma"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'মাসিক আনুমানিক আয়' : 'Monthly Income Range'}
                  </label>
                  <input
                    type="text"
                    required
                    value={monthlyIncome}
                    onChange={e => setMonthlyIncome(e.target.value)}
                    placeholder="e.g. ৳ ৬০,০০০ - ৮০,০০০"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Family Details */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'পিতার পেশা' : 'Father’s Occupation'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fatherOccupation}
                    onChange={e => setFatherOccupation(e.target.value)}
                    placeholder="e.g. ব্যবসায়ী / সরকারি চাকরিজীবী"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'মাতার পেশা' : 'Mother’s Occupation'}
                  </label>
                  <input
                    type="text"
                    required
                    value={motherOccupation}
                    onChange={e => setMotherOccupation(e.target.value)}
                    placeholder="e.g. গৃহিণী / শিক্ষিকা"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'ভাইয়ের সংখ্যা' : 'Brothers Count'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={brothersCount}
                    onChange={e => setBrothersCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'বোনের সংখ্যা' : 'Sisters Count'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={sistersCount}
                    onChange={e => setSistersCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'অভিভাবকের যোগাযোগ নম্বর' : 'Guardian Contact Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={guardianContact}
                    onChange={e => setGuardianContact(e.target.value)}
                    placeholder="017XXXXXXXX (পিতা/মাতা/বড় ভাই)"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Photo & About Me */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'প্রোফাইল ছবি (Photo URL)' : 'Profile Photo URL'}
                </label>
                <div className="flex gap-3 items-center">
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-2xl object-cover border border-rose-200 shadow-xs"
                  />
                  <input
                    type="url"
                    required
                    value={avatarUrl}
                    onChange={e => setAvatarUrl(e.target.value)}
                    placeholder="Image URL"
                    className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'নিজের সম্পর্কে কিছু কথা ও পাত্র/পাত্রী পছন্দ' : 'About Myself & Partner Preference'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={aboutMe}
                  onChange={e => setAboutMe(e.target.value)}
                  placeholder="আপনার ব্যক্তিত্ব, ধর্মীয় মূল্যবোধ ও কাঙ্ক্ষিত জীবনসঙ্গীর বৈশিষ্ট্য লিখুন..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-700 focus:ring-rose-500 mt-0.5"
                />
                <label htmlFor="terms" className="text-xs text-slate-700 leading-relaxed cursor-pointer">
                  {lang === 'bn'
                    ? 'আমি শপথপূর্বক ঘোষণা করছি যে প্রদানকৃত সকল তথ্য সত্য ও নির্ভুল। আমি প্ল্যাটফর্মের নিরাপত্তা নীতিমালা মেনে চলতে বাধ্য থাকব।'
                    : 'I declare that all information provided is accurate and authentic.'}
                </label>
              </div>
            </div>
          )}

          {/* Wizard Action Controls */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-50 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{lang === 'bn' ? 'পূর্ববর্তী' : 'Back'}</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-700/20 transition"
              >
                <span>{lang === 'bn' ? 'পরবর্তী ধাপ' : 'Next Step'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!termsAccepted}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === 'bn' ? 'বায়োডাটা প্রকাশ করুন' : 'Publish Biodata'}</span>
              </button>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-600 shrink-0">
          <span>{lang === 'bn' ? 'ইতিমধ্যে একাউন্ট আছে?' : 'Already have an account?'} </span>
          <button
            onClick={() => {
              onClose();
              onOpenLogin();
            }}
            className="font-bold text-rose-700 hover:underline"
          >
            {lang === 'bn' ? 'লগইন করুন' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};
