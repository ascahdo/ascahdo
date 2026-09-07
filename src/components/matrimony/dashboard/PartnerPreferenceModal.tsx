import React, { useState } from 'react';
import { X, Heart, Save, CheckCircle2 } from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimony } from '../../../context/MatrimonyContext';

interface PartnerPreferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerPreferenceModal: React.FC<PartnerPreferenceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang } = useMatrimonyLanguage();
  const { currentProfile, updateProfile } = useMatrimony();

  const [ageMin, setAgeMin] = useState(currentProfile?.partnerPreference?.ageMin || 22);
  const [ageMax, setAgeMax] = useState(currentProfile?.partnerPreference?.ageMax || 32);
  const [heightMin, setHeightMin] = useState(currentProfile?.partnerPreference?.heightMin || "5' 2\"");
  const [heightMax, setHeightMax] = useState(currentProfile?.partnerPreference?.heightMax || "6' 0\"");
  const [saved, setSaved] = useState(false);

  if (!isOpen || !currentProfile) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(currentProfile.id, {
      partnerPreference: {
        ...currentProfile.partnerPreference,
        ageMin,
        ageMax,
        heightMin,
        heightMax,
      },
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
        <div className="bg-slate-900 text-white p-6 pb-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-bold font-serif">
              {lang === 'bn' ? 'কাঙ্ক্ষিত পাত্র/পাত্রী পছন্দ' : 'Partner Preferences'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs sm:text-sm">
          {saved && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>পছন্দসমূহ আপডেট করা হয়েছে!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">বয়স পরিসীমা (Age)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={ageMin}
                onChange={e => setAgeMin(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
              <span className="text-slate-400">থেকে</span>
              <input
                type="number"
                value={ageMax}
                onChange={e => setAgeMax(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">উচ্চতা পরিসীমা (Height)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={heightMin}
                onChange={e => setHeightMin(e.target.value)}
                placeholder="Min Height"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
              <input
                type="text"
                value={heightMax}
                onChange={e => setHeightMax(e.target.value)}
                placeholder="Max Height"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
