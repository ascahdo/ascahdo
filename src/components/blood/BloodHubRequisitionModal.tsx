import React, { useState } from 'react';
import {
  X, AlertTriangle, Droplet, Hospital, MapPin, Phone,
  User, Check, AlertCircle, Clock, ShieldAlert, Sparkles
} from 'lucide-react';
import { BloodBankOrganization } from '../../types/bloodHubTypes';
import { BANGLADESH_DISTRICTS } from '../../data/bangladeshLocations';

interface BloodHubRequisitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (req: any) => void;
  organizations: BloodBankOrganization[];
  selectedBloodBankId?: string;
  isBn: boolean;
}

export const BloodHubRequisitionModal: React.FC<BloodHubRequisitionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  organizations,
  selectedBloodBankId,
  isBn
}) => {
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number>(32);
  const [patientGender, setPatientGender] = useState<'male' | 'female' | 'other'>('female');
  const [bloodGroup, setBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-'>('O+');
  const [componentNeeded, setComponentNeeded] = useState<'whole_blood' | 'prbc' | 'ffp' | 'platelets' | 'cryo'>('whole_blood');
  const [bagsNeeded, setBagsNeeded] = useState<number>(1);
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalBedWard, setHospitalBedWard] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('Dhanmondi');
  const [doctorName, setDoctorName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [urgency, setUrgency] = useState<'critical_emergency' | 'urgent_today' | 'routine_scheduled'>('critical_emergency');
  const [reasonDisease, setReasonDisease] = useState('');
  const [requiredDate, setRequiredDate] = useState(new Date().toISOString().slice(0, 10));
  const [requiredTime, setRequiredTime] = useState('অবিলম্বে (Immediate SOS)');
  const [hemoglobinLevel, setHemoglobinLevel] = useState('7.0 g/dL');
  const [crossMatchDone, setCrossMatchDone] = useState(false);
  const [assignedBloodBankId, setAssignedBloodBankId] = useState(selectedBloodBankId || 'bb_central_ascado');

  // ৳1,250 per bag donation state
  const donationFeePerBag = 1250;
  const totalDonationAmount = Number(bagsNeeded || 1) * donationFeePerBag;
  const [donationPaymentMethod, setDonationPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Cash'>('bKash');
  const [donationTrxId, setDonationTrxId] = useState('');
  const [donationOption, setDonationOption] = useState<'pay_online' | 'pay_at_counter' | 'hardship_waiver'>('pay_online');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDistrictInfo = Object.values(BANGLADESH_DISTRICTS).find(
    (d) => d.name.toLowerCase() === district.toLowerCase()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !hospitalName.trim() || !contactPhone.trim()) {
      setError(isBn ? 'রোগীর নাম, হাসপাতালের নাম এবং যোগাযোগ নম্বর আবশ্যক।' : 'Patient name, hospital, and contact phone are required.');
      return;
    }

    if (donationOption === 'pay_online' && !donationTrxId.trim() && donationPaymentMethod !== 'Cash') {
      setError(isBn ? 'অনুগ্রহ করে অনুদানের ট্রানজেকশন আইডি (TrxID) লিখুন।' : 'Please enter the donation payment Transaction ID (TrxID).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        patientName,
        patientAge: Number(patientAge),
        patientGender,
        bloodGroup,
        componentNeeded,
        bagsNeeded: Number(bagsNeeded),
        hospitalName,
        hospitalBedWard,
        district,
        upazila,
        doctorName,
        contactPerson: contactPerson || 'রোগীর স্বজন',
        contactPhone,
        urgency,
        reasonDisease: reasonDisease || 'জরুরি রক্তের প্রয়োজন',
        requiredDate,
        requiredTime,
        hemoglobinLevel,
        crossMatchDone,
        assignedBloodBankId,
        donationPerBag: donationFeePerBag,
        totalDonationAmount: donationOption === 'hardship_waiver' ? 0 : totalDonationAmount,
        donationPaymentMethod: donationOption === 'hardship_waiver' ? 'WAIVED' : donationPaymentMethod,
        donationTrxId: donationOption === 'pay_online' ? donationTrxId : (donationOption === 'pay_at_counter' ? 'PAY_AT_COUNTER' : 'WAIVER_REQUESTED'),
        donationStatus: donationOption === 'pay_online' ? 'paid' : (donationOption === 'pay_at_counter' ? 'pledged_counter' : 'waived_hardship')
      };

      const res = await fetch('/api/v1/blood-hub/requisitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to create blood requisition');
      }

      const created = await res.json();
      onSuccess(created);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Request submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/20 text-white">
                  {isBn ? 'জরুরি রক্ত রিকুইজিশন' : 'Emergency Blood Requisition'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-400 text-slate-900">
                  {isBn ? '🩸 প্রতি ব্যাগ অনুদান: ৳১,২৫০' : '🩸 1,250 BDT Donation/Bag'}
                </span>
                <span className="text-xs text-rose-100">
                  {isBn ? 'এসকাডো ব্লাড ব্যাংক | ASCAHDO BLOOD BANK' : 'ASCAHDO BLOOD BANK'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight mt-0.5">
                {isBn ? 'জরুরি রক্তের আবেদন ও হসপিটাল রিকুইজিশন ফর্ম' : 'Emergency Blood Request & Hospital Requisition'}
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Blood Bank & Urgency Header Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {isBn ? 'নিকটস্থ ব্লাড ব্যাংক হাব নির্বাচন:' : 'Assign to Blood Bank Hub:'}
              </label>
              <select
                value={assignedBloodBankId}
                onChange={(e) => setAssignedBloodBankId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.district})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-800 mb-1">
                {isBn ? 'জরুরিতা / প্রয়োজনীয়তার মাত্রা *' : 'Urgency Level *'}
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full px-3 py-2 bg-red-50 border border-red-300 font-bold text-red-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="critical_emergency">🚨 {isBn ? 'চরম জরুরি (১-২ ঘণ্টার মধ্যে)' : 'Critical SOS (1-2 Hours)'}</option>
                <option value="urgent_today">⚡ {isBn ? 'জরুরি (আজকের মধ্যে)' : 'Urgent (Within Today)'}</option>
                <option value="routine_scheduled">📅 {isBn ? 'নির্ধারিত অস্ত্রোপচার / থ্যালাসেমিয়া' : 'Scheduled / Routine'}</option>
              </select>
            </div>
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'রোগীর সম্পূর্ণ নাম *' : 'Patient Full Name *'}
              </label>
              <input
                type="text"
                required
                placeholder={isBn ? 'যেমন: সাহিদা বেগম' : 'e.g. Shahida Begum'}
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-red-600 mb-1">
                {isBn ? 'প্রয়োজনীয় রক্তের গ্রুপ *' : 'Required Blood Group *'}
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as any)}
                className="w-full px-3 py-2 bg-rose-50 border border-rose-300 font-black text-rose-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="A+">A+ (A Positive)</option>
                <option value="A-">A- (A Negative)</option>
                <option value="B+">B+ (B Positive)</option>
                <option value="B-">B- (B Negative)</option>
                <option value="O+">O+ (O Positive)</option>
                <option value="O-">O- (O Negative)</option>
                <option value="AB+">AB+ (AB Positive)</option>
                <option value="AB-">AB- (AB Negative)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'রক্তের কম্পোনেন্ট *' : 'Component Type *'}
              </label>
              <select
                value={componentNeeded}
                onChange={(e) => setComponentNeeded(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="whole_blood">{isBn ? 'হোল ব্লাড (Whole Blood)' : 'Whole Blood'}</option>
                <option value="prbc">{isBn ? 'পিআরবিসি (Packed RBC)' : 'Packed RBC (PRBC)'}</option>
                <option value="platelets">{isBn ? 'প্লাটিলেট (Platelets / SDP)' : 'Platelets'}</option>
                <option value="ffp">{isBn ? 'এফএফপি (Fresh Frozen Plasma)' : 'FFP Plasma'}</option>
                <option value="cryo">{isBn ? 'ক্রায়োপ্রেসিপিটেট' : 'Cryoprecipitate'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'প্রয়োজনীয় ব্যাগের সংখ্যা *' : 'Quantity (Bags) *'}
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={bagsNeeded}
                onChange={(e) => setBagsNeeded(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'রোগীর বয়স ও লিঙ্গ' : 'Patient Age & Gender'}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Age"
                  value={patientAge}
                  onChange={(e) => setPatientAge(Number(e.target.value))}
                  className="w-1/2 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value as any)}
                  className="w-1/2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="female">{isBn ? 'মহিলা' : 'Female'}</option>
                  <option value="male">{isBn ? 'পুরুষ' : 'Male'}</option>
                  <option value="other">{isBn ? 'অন্যান্য' : 'Other'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Hospital and Ward Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'হাসপাতালের নাম *' : 'Hospital Name *'}
              </label>
              <input
                type="text"
                required
                placeholder={isBn ? 'যেমন: ঢাকা মেডিকেল কলেজ হাসপাতাল' : 'e.g. DMCH'}
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'ওয়ার্ড / কেবিন / বেড নম্বর' : 'Ward / Cabin / Bed No'}
              </label>
              <input
                type="text"
                placeholder={isBn ? 'যেমন: গাইনি ওয়ার্ড, বেড-১২' : 'e.g. Ward-4, Bed-12'}
                value={hospitalBedWard}
                onChange={(e) => setHospitalBedWard(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* District & Upazila */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'হাসপাতালের জেলা *' : 'Hospital District *'}
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
                {isBn ? 'উপজেলা / এলাকা' : 'Upazila / Area'}
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

          {/* Contact Person Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'যোগাযোগকারীর নাম (স্বজন)' : 'Attendant / Contact Name'}
              </label>
              <input
                type="text"
                placeholder={isBn ? 'যেমন: মো. কামরুল ইসলাম' : 'e.g. Kamrul Islam'}
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-700 mb-1">
                {isBn ? 'যোগাযোগের মোবাইল নম্বর *' : 'Contact Mobile No *'}
              </label>
              <input
                type="tel"
                required
                placeholder="017XXXXXXXX"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>
          </div>

          {/* Clinical Reason & Timing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'কারণ / রোগের বিবরণ' : 'Clinical Reason / Disease'}
              </label>
              <input
                type="text"
                placeholder={isBn ? 'যেমন: সিজারিয়ান / অ্যাকসিডেন্ট' : 'e.g. Cesarean / Surgery'}
                value={reasonDisease}
                onChange={(e) => setReasonDisease(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'রক্তদানের সম্ভাব্য সময়' : 'Required Time Window'}
              </label>
              <input
                type="text"
                value={requiredTime}
                onChange={(e) => setRequiredTime(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'হিমোগ্লোবিন মাত্রা' : 'Hemoglobin Level'}
              </label>
              <input
                type="text"
                value={hemoglobinLevel}
                onChange={(e) => setHemoglobinLevel(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* ======================================================== */}
          {/* BLOOD PROCESSING DONATION FUND (৳1,250 PER BAG)          */}
          {/* ======================================================== */}
          <div className="p-4 bg-gradient-to-br from-amber-50/90 via-rose-50/50 to-white border-2 border-amber-300 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0 font-black text-sm">
                  ৳
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {isBn
                      ? 'ব্লাড রিকুইজিশন ডোনেশন ফান্ড (প্রতি ব্যাগ ১২৫০ টাকা)'
                      : 'Blood Requisition Processing Donation (1,250 BDT / Bag)'}
                  </h4>
                  <p className="text-xs text-slate-600">
                    {isBn
                      ? 'রক্তদান সম্পূর্ণ অমূল্য ও নিঃস্বার্থ, তবে সংগৃহীত রক্তের ৫টি স্ক্রিনিং টেস্ট, ব্লাড ব্যাগ ও কোল্ড-চেইন সংরক্ষণ তহবিল পরিচালনা করতে প্রতি ব্যাগে ১২৫০ টাকা অনুদান প্রযোজ্য।'
                      : 'Blood is priceless. 1,250 BDT donation per bag covers 5 mandatory viral screening tests, sterile bags, lab cross-matching and cold-chain operations.'}
                  </p>
                </div>
              </div>

              {/* Total Calculation Tag */}
              <div className="bg-white px-3.5 py-1.5 rounded-xl border border-amber-300 text-right shrink-0 shadow-xs">
                <span className="text-[10px] text-slate-500 block">
                  {isBn ? `${bagsNeeded} ব্যাগ × ৳১,২৫০` : `${bagsNeeded} Bag(s) × ৳1,250`}
                </span>
                <span className="text-sm font-black text-rose-600">
                  {donationOption === 'hardship_waiver'
                    ? (isBn ? 'মওকুফ (৳০)' : 'Waived (৳0)')
                    : `৳ ${(totalDonationAmount || 0).toLocaleString()}`}
                </span>
              </div>
            </div>

            {/* Donation Payment Option Radios */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {[
                {
                  id: 'pay_online',
                  labelBn: 'অনলাইনে অনুদান প্রদান',
                  labelEn: 'Pay Online Now',
                  descBn: 'বিকাশ / নগদ / কার্ড'
                },
                {
                  id: 'pay_at_counter',
                  labelBn: 'কাউন্টারে নগদ পরিশোধ',
                  labelEn: 'Pay at Counter/Bank',
                  descBn: 'ব্লাড ব্যাংক / হসপিটাল'
                },
                {
                  id: 'hardship_waiver',
                  labelBn: 'অসচ্ছল রোগী (মওকুফ)',
                  labelEn: 'Hardship Waiver',
                  descBn: 'বিনামূল্যে সহায়তা'
                }
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setDonationOption(opt.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition text-xs ${
                    donationOption === opt.id
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{isBn ? opt.labelBn : opt.labelEn}</span>
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        donationOption === opt.id ? 'border-white bg-white' : 'border-slate-300'
                      }`}
                    >
                      {donationOption === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-rose-600" />}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] block mt-0.5 ${
                      donationOption === opt.id ? 'text-rose-100' : 'text-slate-400'
                    }`}
                  >
                    {opt.descBn}
                  </span>
                </button>
              ))}
            </div>

            {/* Online Payment Details & TrxID */}
            {donationOption === 'pay_online' && (
              <div className="pt-2 border-t border-amber-200/80 space-y-2.5 animate-in fade-in duration-150">
                <label className="block text-xs font-bold text-slate-700">
                  {isBn ? 'পেমেন্ট মেথড নির্বাচন করুন:' : 'Select Payment Gateway:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'bKash', label: 'bKash (বিকাশ)', num: '01813817167 (Merchant)' },
                    { id: 'Nagad', label: 'Nagad (নগদ)', num: '01973817167 (Merchant)' },
                    { id: 'Rocket', label: 'Rocket (রকেট)', num: '01813817167-8' },
                    { id: 'Bank', label: 'Bank / Card', num: 'Islami Bank BD' },
                    { id: 'Cash', label: 'Cash Receipt', num: 'Counter Voucher' }
                  ].map((method) => (
                    <button
                      type="button"
                      key={method.id}
                      onClick={() => setDonationPaymentMethod(method.id as any)}
                      className={`p-2 rounded-xl border text-left transition text-xs flex flex-col justify-between ${
                        donationPaymentMethod === method.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-bold text-[11px]">{method.label}</span>
                      <span
                        className={`text-[9px] truncate mt-0.5 ${
                          donationPaymentMethod === method.id ? 'text-slate-300' : 'text-slate-400'
                        }`}
                      >
                        {method.num}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-amber-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {isBn ? 'পেমেন্ট ট্রানজেকশন আইডি (TrxID) *' : 'Payment Transaction ID (TrxID) *'}
                    </label>
                    <input
                      type="text"
                      placeholder={donationPaymentMethod === 'Cash' ? 'e.g. COUNTER-RECEIPT-01' : 'e.g. BKASH-9A8B7C6D'}
                      value={donationTrxId}
                      onChange={(e) => setDonationTrxId(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    />
                  </div>

                  <div className="flex flex-col justify-center">
                    <p className="text-[11px] text-slate-500">
                      {isBn
                        ? 'বিকাশ/নগদ মার্চেন্ট নম্বর: 01813817167 (Make Payment / Send Money)'
                        : 'Merchant Account: 01813817167 (Select Payment / Send Money)'}
                    </p>
                    <p className="text-xs font-bold text-emerald-600 mt-0.5">
                      {isBn
                        ? `মোট প্রদেয় ডোনেশন ফান্ড: ৳ ${(totalDonationAmount || 0).toLocaleString()}`
                        : `Total Donation Amount: ৳ ${(totalDonationAmount || 0).toLocaleString()}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {donationOption === 'pay_at_counter' && (
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">
                  {isBn
                    ? `✓ ব্লাড ব্যাংক শাখা বা হাসপাতাল কাউন্টারে রক্ত গ্রহণের সময় ৳ ${(totalDonationAmount || 0).toLocaleString()} ডোনেশন রশিদ প্রদান করতে পারবেন।`
                    : `✓ You can donate ৳ ${(totalDonationAmount || 0).toLocaleString()} directly at the blood bank or hospital reception desk.`}
                </p>
              </div>
            )}

            {donationOption === 'hardship_waiver' && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                <p className="font-semibold">
                  {isBn
                    ? '✓ এসকাডো ব্লাড ব্যাংক দরিদ্র ও অসচ্ছল রোগীদের জন্য ফ্রি ডোনেশন সহায়তা ফান্ড সরবরাহ করে।'
                    : '✓ ASCAHDO Blood Bank provides full waiver subsidies for economically distressed patients.'}
                </p>
              </div>
            )}
          </div>

          {/* Cross Match Confirmation */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={crossMatchDone}
                onChange={(e) => setCrossMatchDone(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
              />
              <span>{isBn ? 'হাসপাতালে রক্তের ক্রস-ম্যাচিং ও স্ক্রিনিং টেস্টের প্রস্তুতি সম্পন্ন হয়েছে' : 'Cross-matching sample prepared at hospital lab'}</span>
            </label>
          </div>

          {/* Footer Controls */}
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold text-sm transition shadow-lg hover:shadow-red-600/30 disabled:opacity-50 flex items-center gap-2 active:scale-95"
            >
              {loading ? (
                <span>{isBn ? 'পাঠানো হচ্ছে...' : 'Submitting...'}</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isBn ? 'জরুরি রিকুইজিশন সাবমিট করুন' : 'Submit SOS Blood Request'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
