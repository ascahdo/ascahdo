import React, { useState } from 'react';
import { X, Save, CheckCircle2, User, GraduationCap, Briefcase, Users } from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimony } from '../../../context/MatrimonyContext';
import { MatrimonyProfile } from '../../../types/matrimonyTypes';

interface EditBiodataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditBiodataModal: React.FC<EditBiodataModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useMatrimonyLanguage();
  const { currentProfile, updateProfile } = useMatrimony();

  const [formData, setFormData] = useState<Partial<MatrimonyProfile>>(currentProfile || {});
  const [saved, setSaved] = useState(false);

  if (!isOpen || !currentProfile) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(currentProfile.id, formData);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-4 max-h-[92vh] flex flex-col animate-in zoom-in-95">
        <div className="bg-slate-900 text-white p-6 pb-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <h3 className="text-lg font-bold font-serif">
            {lang === 'bn' ? 'বায়োডাটা তথ্য সম্পাদনা' : 'Edit Biodata Information'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm">
          {saved && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'bn' ? 'বায়োডাটা সফলভাবে আপডেট হয়েছে!' : 'Biodata updated successfully!'}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">পূর্ণ নাম</label>
              <input
                type="text"
                value={formData.fullName || ''}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">পেশার পদবি</label>
              <input
                type="text"
                value={formData.profession?.designation || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    profession: { ...formData.profession!, designation: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">প্রতিষ্ঠানের নাম</label>
              <input
                type="text"
                value={formData.profession?.organization || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    profession: { ...formData.profession!, organization: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">অভিভাবকের ফোন নম্বর</label>
              <input
                type="tel"
                value={formData.guardianContact || ''}
                onChange={e => setFormData({ ...formData, guardianContact: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">নিজের সম্পর্কে সংক্ষিপ্ত বিবরণ</label>
            <textarea
              rows={3}
              value={formData.aboutMe || ''}
              onChange={e => setFormData({ ...formData, aboutMe: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl resize-none"
            />
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
