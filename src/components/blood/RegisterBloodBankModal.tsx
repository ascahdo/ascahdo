import React, { useState } from 'react';
import {
  X, Building2, MapPin, Phone, Mail, ShieldCheck,
  CheckCircle2, AlertCircle, Sparkles, Clock, Check
} from 'lucide-react';
import { BANGLADESH_DISTRICTS } from '../../data/bangladeshLocations';

interface RegisterBloodBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newOrg: any) => void;
  isBn: boolean;
}

export const RegisterBloodBankModal: React.FC<RegisterBloodBankModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isBn
}) => {
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('Dhanmondi');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyHotline, setEmergencyHotline] = useState('');
  const [email, setEmail] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [is24x7, setIs24x7] = useState(true);
  const [hasComponentSeparation, setHasComponentSeparation] = useState(true);
  const [hasApheresis, setHasApheresis] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDistrictInfo = Object.values(BANGLADESH_DISTRICTS).find(
    (d) => d.name.toLowerCase() === district.toLowerCase()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !district) {
      setError(isBn ? 'অনুগ্রহ করে আবশ্যক তথ্য পূরণ করুন।' : 'Please fill all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        name,
        nameBn: nameBn || name,
        division,
        district,
        upazila,
        address,
        phone,
        emergencyHotline: emergencyHotline || phone,
        email,
        regNumber,
        managerName,
        managerPhone: managerPhone || phone,
        is24x7,
        hasComponentSeparation,
        hasApheresis
      };

      const res = await fetch('/api/v1/blood-hub/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to register blood bank organization');
      }

      const created = await res.json();
      onSuccess(created);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-rose-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {isBn ? 'নতুন ব্লাড ব্যাংক / ট্রান্সফিউশন সেন্টার নিবন্ধন' : 'Register New Blood Bank / Transfusion Center'}
              </h3>
              <p className="text-xs text-rose-200">
                {isBn ? 'জাতীয় মাল্টি-টেন্যান্ট ব্লাড ব্যাংকিং নেটওয়ার্কে অন্তর্ভুক্তি' : 'Onboard into National Multi-Tenant Blood Hub'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'ব্লাড ব্যাংকের নাম (ইংরেজি) *' : 'Blood Bank Name (English) *'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bogura Central Blood Bank"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'ব্লাড ব্যাংকের নাম (বাংলা)' : 'Blood Bank Name (Bangla)'}
              </label>
              <input
                type="text"
                placeholder="যেমন: বগুড়া সেন্ট্রাল ব্লাড ব্যাংক"
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'বিভাগ *' : 'Division *'}
              </label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
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
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
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
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
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
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'সম্পূর্ণ ঠিকানা *' : 'Full Address *'}
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Hospital Road, Sadar, Bogura"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'অফিসিয়াল ফোন নম্বর *' : 'Official Phone *'}
              </label>
              <input
                type="tel"
                required
                placeholder="017XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? '২৪/৭ জরুরি হটলাইন' : '24/7 Hotline'}
              </label>
              <input
                type="tel"
                placeholder="019XXXXXXXX"
                value={emergencyHotline}
                onChange={(e) => setEmergencyHotline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'ডিজিএইচএস লাইসেন্স নং' : 'DGHS License No'}
              </label>
              <input
                type="text"
                placeholder="DGHS-BB-2026-XXXX"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'ইন-চার্জ বা পরিচালকের নাম' : 'Director / In-Charge Name'}
              </label>
              <input
                type="text"
                placeholder="ডা. মো. আনিসুল হক"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'পরিচালকের মোবাইল' : 'Director Mobile'}
              </label>
              <input
                type="tel"
                placeholder="018XXXXXXXX"
                value={managerPhone}
                onChange={(e) => setManagerPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>

          {/* Capabilities Checkboxes */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <p className="text-xs font-bold text-slate-700">
              {isBn ? 'সুযোগ-সুবিধা ও সেবা সক্ষমতা:' : 'Facilities & Equipment Capabilities:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={is24x7}
                  onChange={(e) => setIs24x7(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>{isBn ? '২৪ ঘণ্টা জরুরি সেবা' : '24/7 Emergency Service'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={hasComponentSeparation}
                  onChange={(e) => setHasComponentSeparation(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>{isBn ? 'কম্পোনেন্ট সেপারেশন (PRBC, FFP, প্লাটিলেট)' : 'Component Separation'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={hasApheresis}
                  onChange={(e) => setHasApheresis(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>{isBn ? 'এফারেসিস মেশিন (SDP প্লাটিলেট)' : 'Apheresis Equipment'}</span>
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
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
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition shadow-md hover:shadow-rose-600/20 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <span>{isBn ? 'সংরক্ষণ করা হচ্ছে...' : 'Registering...'}</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isBn ? 'ব্লাড ব্যাংক যুক্ত করুন' : 'Complete Registration'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
