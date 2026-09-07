import React, { useState } from 'react';
import {
  X, User, ShieldCheck, CheckCircle2, Phone, Mail, MapPin,
  Calendar, CreditCard, Heart, Award, FileText, Printer, Download,
  Sparkles, Check, QrCode, IdCard, ScrollText, ArrowRight
} from 'lucide-react';
import { MemberPhotoUpload } from './MemberPhotoUpload';
import { MembershipTermsAndOath } from './MembershipTermsAndOath';
import {
  BANGLADESH_DIVISIONS,
  BANGLADESH_DISTRICTS,
  getDistrictsByDivision,
  getUpazilasByDistrictKey,
  getUnionsByUpazilaName
} from '../../data/bangladeshLocations';
import { Branch } from '../../types';
import { COMMITTEE_MEMBER_DONATION_FEE } from '../../utils/committeeMemberUtils';

interface IndividualMemberApplicationModalProps {
  branches?: Branch[];
  branchList?: Branch[];
  isBn?: boolean;
  onClose: () => void;
  onSuccess: (newMemberData: any) => void;
}

const MEMBERSHIP_TYPES = [
  { id: 'executive', nameBn: 'কার্যনির্বাহী সদস্য (Executive Member)', fee: 1250, descBn: 'শাখা ও কেন্দ্রীয় কমিটির জন্য প্রাতিষ্ঠানিক ডিজিটাল আইডি ও ভোটাধিকার' },
  { id: 'general', nameBn: 'সাধারণ সদস্য (General Member)', fee: 500, descBn: 'বার্ষিক সদস্যপদ ও মানবিক কার্যক্রমে অংশগ্রহণ' },
  { id: 'lifetime', nameBn: 'আজীবন সদস্য (Life Member)', fee: 5000, descBn: 'আজীবন সদস্যপদ, বিশেষ সম্মাননা ও স্থায়ী সনদপত্র' },
  { id: 'donor', nameBn: 'দাতা সদস্য (Donor Member)', fee: 10000, descBn: 'পৃষ্ঠপোষক ও সমাজসেবায় অনন্য অবদানের বিশেষ মেম্বারশিপ' }
];

export const IndividualMemberApplicationModal: React.FC<IndividualMemberApplicationModalProps> = ({
  branches = [],
  branchList = [],
  isBn = true,
  onClose,
  onSuccess
}) => {
  const allBranches = branches?.length > 0 ? branches : branchList || [];
  // Step indicator: 1 = Details & Photo, 2 = Fee & Payment, 3 = Terms & Oath, 4 = Success Slip
  const [step, setStep] = useState<number>(1);

  // Personal Info
  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [fatherNameBn, setFatherNameBn] = useState('');
  const [motherNameBn, setMotherNameBn] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nid, setNid] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [dob, setDob] = useState('1995-01-01');
  const [occupation, setOccupation] = useState('সমাজসেবক / ব্যবসা');
  const [education, setEducation] = useState('স্নাতক / মাস্টার্স');

  // Photo
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80');

  // Location
  const [division, setDivision] = useState('dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('Savar');
  const [union, setUnion] = useState('');
  const [address, setAddress] = useState('');
  const [preferredBranchId, setPreferredBranchId] = useState(allBranches?.[0]?.id || '');

  // Membership & Payment
  const [membershipType, setMembershipType] = useState('executive');
  const [paymentMethod, setPaymentMethod] = useState('bKash / Nagad');
  const [senderPhone, setSenderPhone] = useState('');
  const [trxId, setTrxId] = useState('');

  // Terms & Oath Checkboxes
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedOath, setAgreedOath] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Submitted Data
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  // Location helpers
  const districtList = getDistrictsByDivision(division);
  const upazilaList = getUpazilasByDistrictKey(district);
  const unionList = getUnionsByUpazilaName(upazila);

  const selectedTypeObj = MEMBERSHIP_TYPES.find((t) => t.id === membershipType) || MEMBERSHIP_TYPES[0];

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (step === 1) {
      if (!nameBn.trim() || !phone.trim() || !fatherNameBn.trim()) {
        setErrorMsg(isBn ? 'অনুগ্রহ করে সকল তারকা (*) চিহ্নিত প্রয়োজনীয় তথ্য পূরণ করুন' : 'Please fill all required fields');
        return;
      }
      if (!photoUrl) {
        setErrorMsg(isBn ? 'সদস্যের পাসপোর্ট সাইজ ছবি আপলোড করুন' : 'Please upload member passport photo');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (!agreedTerms) {
        setErrorMsg(isBn ? 'আপনাকে অবশ্যই সংগঠনের গঠনতান্ত্রিক শর্তাবলী মেনে নিতে হবে' : 'You must accept the terms & conditions');
        return;
      }
      if (!agreedOath) {
        setErrorMsg(isBn ? 'আপনাকে অবশ্যই পবিত্র অঙ্গীকারনামা ও শপথপত্রে সম্মতি প্রদান করতে হবে' : 'You must affirm the solemn oath');
        return;
      }

      // Generate member record
      const randomSug = `SUG-${Math.floor(100000 + Math.random() * 900000)}`;
      const randomId = `ASC-${district.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const generatedTrx = trxId.trim() || `TRX${Math.floor(10000000 + Math.random() * 90000000)}`;
      const generatedReceipt = `MR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

      const newMemberRecord = {
        memberId: randomId,
        suggestionNumber: randomSug,
        name: nameEn || nameBn,
        nameBn: nameBn,
        fatherName: fatherNameBn,
        fatherNameBn: fatherNameBn,
        motherNameBn,
        designation: selectedTypeObj.nameBn,
        designationBn: selectedTypeObj.nameBn,
        phone,
        email,
        nid,
        bloodGroup,
        dob,
        occupation,
        education,
        photoUrl,
        division,
        district,
        upazila,
        union,
        address,
        addressBn: address,
        membershipType,
        donationFee: selectedTypeObj.fee,
        donationStatus: 'paid',
        paymentMethod,
        trxId: generatedTrx,
        donationReceiptNo: generatedReceipt,
        donationPaidDate: new Date().toISOString().split('T')[0],
        appliedAt: new Date().toISOString(),
        status: 'active',
        agreedTerms: true,
        agreedOath: true
      };

      setSubmittedData(newMemberRecord);
      setStep(4);
      onSuccess(newMemberRecord);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-auto overflow-hidden shadow-2xl border border-emerald-300 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-white text-base">
                🪪
              </span>
              <h3 className="font-black text-base sm:text-xl tracking-tight">
                {isBn ? 'সদস্য আবেদন ফরম ও অঙ্গীকারনামা' : 'Member Application & Oath Form'}
              </h3>
            </div>
            <p className="text-xs text-emerald-100 font-medium">
              {isBn
                ? 'এসকাডো কেন্দ্রীয় মানবকল্যাণ ট্রাস্টের অনলাইন সদস্যপদ অন্তর্ভুক্তি ও ডিজিটাল পরিচয়পত্র আবেদন'
                : 'Official Online Membership Enrollment & Digital Identity Application'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress bar */}
        {step < 4 && (
          <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
            <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-emerald-700 font-extrabold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>1</span>
              <span>{isBn ? 'ব্যক্তিগত তথ্য ও ফটো' : 'Personal & Photo'}</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-300"></div>
            <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-emerald-700 font-extrabold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>2</span>
              <span>{isBn ? 'সদস্যপদ ফি ও পেমেন্ট' : 'Fee & Payment'}</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-300"></div>
            <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-emerald-700 font-extrabold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>3</span>
              <span>{isBn ? 'শর্ত ও অঙ্গীকারনামা' : 'Terms & Oath'}</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-2">
              <span>⚠️ {errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Personal Details & Photo Upload */}
          {step === 1 && (
            <form id="step1-form" onSubmit={handleNextStep} className="space-y-5">
              {/* Photo Upload Section */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <MemberPhotoUpload
                  photoUrl={photoUrl}
                  onChange={setPhotoUrl}
                  label={isBn ? 'সদস্যের পাসপোর্ট সাইজ রঙিন ছবি * (Drag & Drop / Browse)' : 'Member Passport Photo *'}
                  isBn={isBn}
                  required
                />
              </div>

              {/* Personal Details */}
              <div className="space-y-3">
                <h4 className="font-black text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'সদস্যের ব্যক্তিগত পরিচিতি' : 'Personal Identification'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'সদস্যের নাম (বাংলা) *' : 'Name in Bangla *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: হাজী আব্দুল করিম"
                      value={nameBn}
                      onChange={(e) => setNameBn(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'সদস্যের নাম (English) *' : 'Name in English *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Haji Abdul Karim"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'পিতার নাম *' : "Father's Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="পিতার পূর্ণ নাম"
                      value={fatherNameBn}
                      onChange={(e) => setFatherNameBn(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'মাতার নাম' : "Mother's Name"}
                    </label>
                    <input
                      type="text"
                      placeholder="মাতার নাম"
                      value={motherNameBn}
                      onChange={(e) => setMotherNameBn(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'মোবাইল নম্বর *' : 'Mobile Phone *'}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      placeholder="member@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নং *' : 'NID / Birth Certificate *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="১০ বা ১৭ ডিজিটের NID"
                      value={nid}
                      onChange={(e) => setNid(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'রক্তের গ্রুপ *' : 'Blood Group *'}
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'পেশা' : 'Occupation'}
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: ব্যবসা / শিক্ষকতা / সমাজসেবা"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'শিক্ষাগত যোগ্যতা' : 'Education'}
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: স্নাতক / এইচএসসি"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Address & Branch selection */}
              <div className="space-y-3 pt-2">
                <h4 className="font-black text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'ঠিকানা ও শাখা অন্তর্ভুক্তি' : 'Address & Branch Allocation'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'বিভাগ *' : 'Division *'}</label>
                    <select
                      value={division}
                      onChange={(e) => {
                        setDivision(e.target.value);
                        const dists = getDistrictsByDivision(e.target.value);
                        if (dists.length > 0) {
                          setDistrict(dists[0].district.name);
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    >
                      {BANGLADESH_DIVISIONS.map((div) => (
                        <option key={div.id} value={div.id}>{isBn ? div.nameBn : div.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'জেলা *' : 'District *'}</label>
                    <select
                      value={district}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                        const upz = getUpazilasByDistrictKey(e.target.value);
                        if (upz.length > 0) setUpazila(upz[0]);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    >
                      {districtList.map(({ key, district: d }) => (
                        <option key={key} value={d.name}>{isBn ? d.nameBn : d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'উপজেলা / থানা *' : 'Upazila *'}</label>
                    <select
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    >
                      {upazilaList.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'পূর্ণাঙ্গ ঠিকানা (গ্রাম/রোড, পোস্ট কোড) *' : 'Full Address *'}</label>
                    <input
                      type="text"
                      required
                      placeholder="বাড়ি/হোল্ডিং নং, রোড, এলাকা"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* STEP 2: Membership Type & Payment */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-3">
                <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'সদস্যপদ ক্যাটাগরি নির্বাচন করুন' : 'Select Membership Category'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MEMBERSHIP_TYPES.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => setMembershipType(type.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                        membershipType === type.id
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                          : 'border-slate-200 hover:border-emerald-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-xs text-slate-900">{type.nameBn}</span>
                        <span className="text-sm font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg font-mono">
                          ৳{type.fee}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">{type.descBn}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-gradient-to-r from-amber-50 to-emerald-50 p-4 rounded-2xl border border-amber-200 space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-700" />
                    <div>
                      <h5 className="font-black text-xs sm:text-sm text-slate-900">
                        {isBn ? 'ডোনেশন ফি ও ট্রানজেকশন তথ্য' : 'Donation Fee & Payment Guide'}
                      </h5>
                      <p className="text-[10px] text-slate-600">
                        {isBn ? 'নির্ধারিত ফি পরিশোধ করে TrxID ও প্রেরক নম্বর নিচে লিখুন' : 'Send fee and enter TrxID below'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white px-3 py-1.5 rounded-xl border border-amber-300 text-right font-mono">
                    <span className="text-[9px] text-slate-500 block">প্রদেয় ফি:</span>
                    <span className="text-base font-black text-emerald-800">৳{selectedTypeObj.fee}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">বিকাশ / নগদ (Personal)</span>
                    <span className="text-xs font-black text-pink-600 font-mono">01973-817167</span>
                    <span className="text-[9px] text-slate-500 block">Send Money / Make Payment</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">রকেট (Rocket)</span>
                    <span className="text-xs font-black text-purple-700 font-mono">01973-817167-8</span>
                    <span className="text-[9px] text-slate-500 block">Personal Rocket</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">ব্যাংক একাউন্ট (Bank)</span>
                    <span className="text-xs font-bold text-slate-800">Islami Bank Bangladesh</span>
                    <span className="text-[9px] text-slate-500 block font-mono">A/C: 20501450200XXXX</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পেমেন্ট মাধ্যম</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                    >
                      <option value="bKash / Nagad">বিকাশ / নগদ (bKash/Nagad)</option>
                      <option value="Rocket">রকেট (Rocket)</option>
                      <option value="Bank Transfer">ব্যাংক ট্রান্সফার (Bank)</option>
                      <option value="Cash at Branch">শাখা কার্যালয়ে নগদ জমা</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">প্রেরক মোবাইল নম্বর (Sender Phone)</label>
                    <input
                      type="text"
                      placeholder="01XXXXXXXXX"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ট্রানজেকশন আইডি (TrxID)</label>
                    <input
                      type="text"
                      placeholder="যেমন: 9J3K8L2M"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Terms & Conditions and Sacred Oath */}
          {step === 3 && (
            <div className="space-y-4">
              <MembershipTermsAndOath
                isBn={isBn}
                agreedTerms={agreedTerms}
                onToggleTerms={setAgreedTerms}
                agreedOath={agreedOath}
                onToggleOath={setAgreedOath}
                applicantName={nameBn || nameEn}
                applicantDesignation={selectedTypeObj.nameBn}
              />
            </div>
          )}

          {/* STEP 4: Success Application Slip & Confirmation */}
          {step === 4 && submittedData && (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="font-black text-xl text-slate-900">
                  {isBn ? 'সদস্য আবেদন ও অঙ্গীকারনামা সফলভাবে গৃহীত হয়েছে!' : 'Membership Application & Oath Accepted!'}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {isBn
                    ? 'আপনার আবেদনপত্র কেন্দ্রীয় সিস্টেমে অন্তর্ভুক্ত হয়েছে এবং স্বয়ংক্রিয় ডিজিটাল আইডি প্রস্তুত করা হয়েছে।'
                    : 'Your membership is active and your digital badge ID is ready.'}
                </p>
              </div>

              {/* Application Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-left space-y-3 max-w-lg mx-auto text-xs">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                  <img
                    src={submittedData.photoUrl}
                    alt={submittedData.nameBn}
                    className="w-14 h-16 rounded-xl object-cover border-2 border-emerald-500 shadow-xs"
                  />
                  <div>
                    <h4 className="font-black text-sm text-slate-900">{submittedData.nameBn}</h4>
                    <p className="text-[11px] text-slate-500">{submittedData.name}</p>
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md mt-1">
                      {submittedData.designationBn}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">সদস্য আইডি (Member ID):</span>
                    <span className="font-mono font-bold text-emerald-700 text-xs">{submittedData.memberId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">সাজেশন নম্বর (Suggestion No):</span>
                    <span className="font-mono font-bold text-slate-800 text-xs">{submittedData.suggestionNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">রক্তের গ্রুপ:</span>
                    <span className="font-bold text-rose-700">{submittedData.bloodGroup}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">ডোনেশন ফি:</span>
                    <span className="font-bold text-emerald-800">৳{submittedData.donationFee} (পরিশোধিত ✓)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">TrxID:</span>
                    <span className="font-mono text-slate-700">{submittedData.trxId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">মানি রিসিট নং:</span>
                    <span className="font-mono text-slate-700">{submittedData.donationReceiptNo}</span>
                  </div>
                </div>

                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-[10px] text-emerald-900 font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>শর্তাবলী ও পবিত্র অঙ্গীকারনামা ডিজিটালভাবে স্বাক্ষরিত ও সংরক্ষিত হয়েছে।</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isBn ? 'আবেদনপত্র প্রিন্ট করুন' : 'Print Application'}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition"
                >
                  {isBn ? 'সম্পন্ন করুন' : 'Done'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls for Steps 1-3 */}
        {step < 4 && (
          <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition"
              >
                {isBn ? 'পূর্ববর্তী' : 'Back'}
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
            )}

            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md transition active:scale-95"
            >
              <span>{step === 3 ? (isBn ? 'শপথ নিশ্চিত করে আবেদন জমা দিন' : 'Affirm & Submit') : (isBn ? 'পরবর্তী ধাপ' : 'Next Step')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
