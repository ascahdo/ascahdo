import React, { useState } from 'react';
import { useTranslation } from '../locales/i18nContext';
import { X, HeartPulse, AlertTriangle, Send } from 'lucide-react';
import { BANGLADESH_DISTRICTS } from '../data/bangladeshLocations';
import { api } from '../services/api';

interface BloodRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BloodRequestModal: React.FC<BloodRequestModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { isBn } = useTranslation();
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [unitsNeeded, setUnitsNeeded] = useState(1);
  const [hospitalName, setHospitalName] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('Dhanmondi');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [urgency, setUrgency] = useState<'critical_emergency' | 'high' | 'normal'>('critical_emergency');
  const [requiredDate, setRequiredDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentDistrictInfo = Object.values(BANGLADESH_DISTRICTS).find(
    (d) => d.name.toLowerCase() === district.toLowerCase()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createBloodRequest({
        patientName,
        bloodGroup,
        unitsNeeded: Number(unitsNeeded),
        hospitalName,
        district,
        upazila,
        contactPerson,
        contactPhone,
        urgency,
        requiredDate
      });
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-rose-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 to-rose-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white text-rose-700 flex items-center justify-center">
              <HeartPulse className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isBn ? 'জরুরি রক্তের আবেদন (SOS)' : 'Emergency Blood Request (SOS)'}
              </h3>
              <p className="text-xs text-rose-200">
                {isBn ? 'নিকটস্থ নিবন্ধিত রক্তদাতাদের কাছে তাৎক্ষণিক নোটিফিকেশন যাবে' : 'Direct broadcast to nearby matching blood donors'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-rose-200 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Send className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">
              {isBn ? 'জরুরি রক্তের আবেদন সফলভাবে প্রচারিত হয়েছে!' : 'SOS Broadcasted Successfully!'}
            </h4>
            <p className="text-xs text-slate-600">
              {isBn
                ? `${district} ও ${upazila} এলাকার ${bloodGroup} রক্তদাতাদের কাছে তথ্য পাঠানো হয়েছে। শীঘ্রই তারা যোগাযোগ করবেন।`
                : `Notified ${bloodGroup} donors in ${district} / ${upazila}. Matching volunteers will reach out promptly.`}
            </p>
            <button
              onClick={onClose}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-3 rounded-xl transition"
            >
              {isBn ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-3.5 max-h-[80vh] overflow-y-auto">
            <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-medium">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{isBn ? 'শুধুমাত্র প্রকৃত জরুরি প্রয়োজনে সঠিক তথ্য দিয়ে ফরম পূরণ করুন।' : 'Please submit genuine hospital & patient information.'}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'রক্তের গ্রুপ' : 'Blood Group'}
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-bold text-rose-700 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'প্রয়োজনীয় ব্যাগ/ইউনিট' : 'Bags/Units Needed'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={unitsNeeded}
                  onChange={(e) => setUnitsNeeded(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {isBn ? 'রোগীর নাম ও সমস্যা' : 'Patient Name & Condition'}
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder={isBn ? 'যেমন: সালমা বেগম (সিজারিয়ান অপারেশন)' : 'e.g. Salma Begum (Surgery)'}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {isBn ? 'হাসপাতাল/ক্লিনিকের নাম' : 'Hospital Name & Ward'}
              </label>
              <input
                type="text"
                required
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder={isBn ? 'যেমন: ঢাকা মেডিকেল কলেজ হাসপাতাল' : 'e.g. Dhaka Medical College Hospital'}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {isBn ? 'জেলা' : 'District'}
                </label>
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    const found = Object.values(BANGLADESH_DISTRICTS).find(d => d.name === e.target.value);
                    if (found && found.upazilas.length > 0) setUpazila(found.upazilas[0]);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  {Object.values(BANGLADESH_DISTRICTS).map((d) => (
                    <option key={d.name} value={d.name}>
                      {isBn ? d.nameBn : d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {isBn ? 'উপজেলা/থানা' : 'Upazila/Thana'}
                </label>
                <select
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  {(currentDistrictInfo?.upazilas || []).map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {isBn ? 'যোগাযোগকারীর নাম' : 'Contact Person'}
                </label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder={isBn ? 'যেমন: মোহাম্মদ কবির (রোগীর ভাই)' : 'Contact name'}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {isBn ? 'জরুরি ফোন নম্বর' : 'Emergency Contact Phone'}
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl shadow-lg transition active:scale-98 disabled:opacity-50"
            >
              <HeartPulse className="w-4 h-4 animate-pulse" />
              <span>{loading ? (isBn ? 'প্রচারিত হচ্ছে...' : 'Broadcasting...') : (isBn ? 'জরুরি রক্তের আবেদন প্রচার করুন' : 'Broadcast Blood SOS')}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
