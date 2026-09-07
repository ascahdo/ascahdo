import React, { useState } from 'react';
import {
  X, UserPlus, Heart, Droplet, ShieldCheck, CheckCircle2,
  AlertCircle, DollarSign, CreditCard, Sparkles, QrCode, Phone,
  MapPin, Calendar, Award, Copy, Check
} from 'lucide-react';
import { BloodBankOrganization } from '../../types/bloodHubTypes';
import { BANGLADESH_DISTRICTS } from '../../data/bangladeshLocations';

interface BloodHubDonorRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (donor: any) => void;
  organizations: BloodBankOrganization[];
  selectedBloodBankId?: string;
  isBn: boolean;
}

export const BloodHubDonorRegisterModal: React.FC<BloodHubDonorRegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  organizations,
  selectedBloodBankId,
  isBn
}) => {
  const [fullName, setFullName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-'>('A+');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nid, setNid] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [age, setAge] = useState<number>(24);
  const [weightKg, setWeightKg] = useState<number>(65);
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('Dhanmondi');
  const [presentAddress, setPresentAddress] = useState('');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [totalDonations, setTotalDonations] = useState<number>(1);
  const [associatedBloodBankId, setAssociatedBloodBankId] = useState(selectedBloodBankId || 'bb_central_ascado');
  
  // Donor Membership & Free Registration State
  const [membershipTier, setMembershipTier] = useState<'club_life_member' | 'general' | 'hero'>('hero');
  const [voluntaryDonation, setVoluntaryDonation] = useState(false);
  const [voluntaryAmount, setVoluntaryAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Cash'>('bKash');
  const [trxId, setTrxId] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDistrictInfo = Object.values(BANGLADESH_DISTRICTS).find(
    (d) => d.name.toLowerCase() === district.toLowerCase()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setError(isBn ? 'নাম এবং মোবাইল নম্বর দেওয়া আবশ্যক।' : 'Name and phone number are required.');
      return;
    }

    if (voluntaryDonation && voluntaryAmount > 0 && !trxId.trim() && paymentMethod !== 'Cash') {
      setError(isBn ? 'ঐচ্ছিক অনুদানের জন্য পেমেন্ট TrxID লিখুন।' : 'Please enter payment Transaction ID (TrxID) for voluntary donation.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        fullName,
        bloodGroup,
        phone,
        email,
        nid,
        gender,
        age: Number(age),
        weightKg: Number(weightKg),
        division,
        district,
        upazila,
        presentAddress,
        lastDonationDate: lastDonationDate || new Date().toISOString().slice(0, 10),
        totalDonations: Number(totalDonations),
        associatedBloodBankId,
        membershipTier: 'hero',
        membershipFeePaid: false,
        membershipFeeAmount: voluntaryDonation ? voluntaryAmount : 0,
        membershipPaymentMethod: voluntaryDonation ? paymentMethod : undefined,
        membershipPaymentTrxId: voluntaryDonation ? (trxId || `FREE-REG-${Date.now()}`) : undefined,
        emergencyContactName,
        emergencyContactPhone,
        donorCardIssued: true
      };

      const res = await fetch('/api/v1/blood-hub/donors/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to register donor');
      }

      const created = await res.json();
      onSuccess(created);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
              <Heart className="w-6 h-6 fill-rose-500 text-rose-400 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isBn ? '✓ ১০০% ফ্রি ডোনার আবেদন' : '✓ 100% Free Donor Registration'}
                </span>
                <span className="text-xs text-rose-200">
                  {isBn ? 'এসকাডো ব্লাড ব্যাংক | ASCAHDO BLOOD BANK' : 'ASCAHDO BLOOD BANK'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight mt-0.5">
                {isBn ? 'রক্তদাতা হিসেবে বিনামূল্যে আবেদন ও ডিজিটাল স্মার্ট কার্ড' : 'Free Blood Donor Registration & Smart ID Card'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Associated Blood Bank Selection */}
          <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl">
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-rose-600" />
              <span>{isBn ? 'সংযুক্ত ব্লাড ব্যাংক হাব নির্বাচন করুন:' : 'Select Associated Blood Bank Hub:'}</span>
            </label>
            <select
              value={associatedBloodBankId}
              onChange={(e) => setAssociatedBloodBankId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-rose-200 rounded-lg text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.district})
                </option>
              ))}
            </select>
          </div>

          {/* Personal Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'রক্তদাতার সম্পূর্ণ নাম *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                placeholder={isBn ? 'যেমন: মো. তানভীর হাসান' : 'e.g. Tanvir Hasan'}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-700 mb-1">
                {isBn ? 'রক্তের গ্রুপ (Blood Group) *' : 'Blood Group *'}
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as any)}
                className="w-full px-3 py-2 bg-rose-50/80 border border-rose-300 font-bold text-rose-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="A+">A+ (A Positive)</option>
                <option value="A-">A- (A Negative)</option>
                <option value="B+">B+ (B Positive)</option>
                <option value="B-">B- (B Negative)</option>
                <option value="O+">O+ (O Positive)</option>
                <option value="O-">O- (O Negative - Universal)</option>
                <option value="AB+">AB+ (AB Positive)</option>
                <option value="AB-">AB- (AB Negative)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'মোবাইল নম্বর *' : 'Phone Number *'}
              </label>
              <input
                type="tel"
                required
                placeholder="017XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
              </label>
              <input
                type="email"
                placeholder="donor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'জাতীয় পরিচয়পত্র (NID)' : 'National ID (NID)'}
              </label>
              <input
                type="text"
                placeholder="NID / Smart Card No"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'লিঙ্গ *' : 'Gender *'}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="male">{isBn ? 'পুরুষ (Male)' : 'Male'}</option>
                <option value="female">{isBn ? 'মহিলা (Female)' : 'Female'}</option>
                <option value="other">{isBn ? 'অন্যান্য (Other)' : 'Other'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'বয়স (বছর) *' : 'Age (Years) *'}
              </label>
              <input
                type="number"
                min={18}
                max={65}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'ওজন (কেজি) *' : 'Weight (Kg) *'}
              </label>
              <input
                type="number"
                min={45}
                max={150}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>

          {/* Location Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'বিভাগ' : 'Division'}
              </label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="Dhaka">Dhaka</option>
                <option value="Chattogram">Chattogram</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Khulna">Khulna</option>
                <option value="Barishal">Barishal</option>
                <option value="Rangpur">Rangpur</option>
                <option value="Mymensingh">Mymensingh</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'জেলা *' : 'District *'}
              </label>
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  const dObj = Object.values(BANGLADESH_DISTRICTS).find(
                    (d) => d.name.toLowerCase() === e.target.value.toLowerCase()
                  );
                  if (dObj && dObj.upazilas && dObj.upazilas.length > 0) {
                    setUpazila(dObj.upazilas[0]);
                  }
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                {Object.values(BANGLADESH_DISTRICTS).map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name} ({d.nameBn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'উপজেলা / থানা *' : 'Upazila / Thana *'}
              </label>
              {currentDistrictInfo && currentDistrictInfo.upazilas && currentDistrictInfo.upazilas.length > 0 ? (
                <select
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  {(currentDistrictInfo?.upazilas || []).map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              )}
            </div>
          </div>

          {/* Donation History Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'সর্বশেষ রক্তদানের তারিখ' : 'Last Donation Date'}
              </label>
              <input
                type="date"
                value={lastDonationDate}
                onChange={(e) => setLastDonationDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'মোট কতবার রক্ত দিয়েছেন?' : 'Total Donations Count'}
              </label>
              <input
                type="number"
                min={0}
                value={totalDonations}
                onChange={(e) => setTotalDonations(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>
          </div>

          {/* ======================================================== */}
          {/* 100% FREE DONOR REGISTRATION GUARANTEE & DIGITAL CARD    */}
          {/* ======================================================== */}
          <div className="p-4 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border-2 border-emerald-300 rounded-2xl shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-600 text-white">
                      {isBn ? '১০০% ফ্রি আবেদন' : '100% Free'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {isBn
                        ? 'রক্তদাতাদের জন্য আজীবন সম্পূর্ণ ফ্রি রেজিস্ট্রেশন'
                        : 'Free Lifetime Donor Registration & Digital Smart Card'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {isBn
                      ? 'রক্তদাতাদের কোনো নিবন্ধন ফি দিতে হবে না। সফল নিবন্ধনের সাথে সাথেই আপনার ভেরিফাইড ডিজিটাল স্মার্ট ডোনার আইডি কার্ড ও সার্টিফিকেট জেনারেট হবে।'
                      : 'Zero registration fee for blood donors. Instantly get your verified Digital Smart ID Card & Certificate upon registration.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-emerald-200/60 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-emerald-900">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isBn ? '০ টাকা আবেদন ফি' : 'Zero Application Fee'}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isBn ? 'ফ্রি স্মার্ট ডোনার আইডি কার্ড' : 'Free Smart Donor ID'}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isBn ? '২৪/৭ জরুরি রোগীর অ্যালার্ট' : '24/7 Urgent Blood Alerts'}</span>
              </div>
            </div>

            {/* Optional Voluntary Blood Welfare Fund Pledge */}
            <div className="mt-3 pt-2.5 border-t border-emerald-100 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={voluntaryDonation}
                  onChange={(e) => {
                    setVoluntaryDonation(e.target.checked);
                    if (e.target.checked && voluntaryAmount === 0) setVoluntaryAmount(500);
                  }}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span>
                  {isBn
                    ? 'ঐচ্ছিক: ব্লাড ব্যাংক কল্যাণ ফান্ডে স্বেচ্ছায় অনুদান দিতে চাই (ঐচ্ছিক)'
                    : 'Optional: Support Blood Welfare Fund with a voluntary gift'}
                </span>
              </label>
            </div>

            {voluntaryDonation && (
              <div className="mt-3 pt-3 border-t border-emerald-200/80 space-y-3 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-emerald-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {isBn ? 'স্বেচ্ছায় অনুদানের পরিমাণ (টাকা):' : 'Voluntary Gift Amount (BDT):'}
                    </label>
                    <input
                      type="number"
                      min={100}
                      value={voluntaryAmount}
                      onChange={(e) => setVoluntaryAmount(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {isBn ? 'পেমেন্ট ট্রানজেকশন আইডি (TrxID):' : 'Payment Transaction ID (TrxID):'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BKASH-XXXXX"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Emergency Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'জরুরি অভিভাবক / আত্মীয়ের নাম' : 'Emergency Contact Person'}
              </label>
              <input
                type="text"
                placeholder={isBn ? 'যেমন: পিতা / ভাই / বন্ধু' : 'e.g. Father / Brother'}
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'জরুরি যোগাযোগের ফোন' : 'Emergency Contact Phone'}
              </label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm transition shadow-lg hover:shadow-emerald-600/30 disabled:opacity-50 flex items-center gap-2 active:scale-95"
            >
              {loading ? (
                <span>{isBn ? 'নিবন্ধন সম্পন্ন হচ্ছে...' : 'Processing...'}</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isBn
                      ? 'ফ্রি রক্তদাতা আবেদন সাবমিট করুন (১০০% ফ্রি)'
                      : 'Submit Free Donor Application (100% Free)'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
