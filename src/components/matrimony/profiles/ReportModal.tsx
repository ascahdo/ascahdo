import React, { useState } from 'react';
import { X, Flag, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimony } from '../../../context/MatrimonyContext';
import { ReportItem } from '../../../types/matrimonyTypes';

interface ReportModalProps {
  profileId: string | null;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ profileId, onClose }) => {
  const { lang } = useMatrimonyLanguage();
  const { submitReport } = useMatrimony();

  const [reason, setReason] = useState<ReportItem['reason']>('fake_profile');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!profileId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(profileId, reason, description);
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-base font-serif">
              {lang === 'bn' ? 'প্রোফাইল রিপোর্ট ও অভিযোগ' : 'Report Profile'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">
              {lang === 'bn' ? 'রিপোর্ট সফলভাবে জমা হয়েছে' : 'Report Submitted'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'bn'
                ? 'আমাদের মডারেশন ও ট্রাস্ট অ্যান্ড সেফটি টিম দ্রুত অভিযোগটি পর্যালোচনা করে প্রয়োজনীয় আইনি ও প্রাতিষ্ঠানিক ব্যবস্থা গ্রহণ করবে।'
                : 'Our Trust & Safety moderation team will thoroughly investigate the issue and take prompt administrative action.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 flex items-center gap-2 text-rose-900 text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                {lang === 'bn' ? 'টার্গেট বায়োডাটা আইডি:' : 'Target Biodata ID:'} <strong>{profileId}</strong>
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {lang === 'bn' ? 'অভিযোগের কারণ নির্বাচন করুন:' : 'Select Reason for Report:'}
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value as ReportItem['reason'])}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="fake_profile">ভুয়া প্রোফাইল বা মিথ্যা তথ্য (Fake Profile / False Details)</option>
                <option value="inappropriate_photo">অনুপযুক্ত বা বিভ্রান্তিকর ছবি (Inappropriate Photo)</option>
                <option value="misbehavior">অশালীন বা অনাকাঙ্ক্ষিত আচরণ (Misbehavior / Harassment)</option>
                <option value="already_married">ইতিমধ্যে বিবাহিত অথচ গোপন রাখা (Already Married / Fraud)</option>
                <option value="commercial_spam">বাণিজ্যিক স্প্যাম বা আর্থিক প্রতারণা (Financial Scam / Spam)</option>
                <option value="other">অন্যান্য কারণ (Other Concerns)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {lang === 'bn' ? 'বিস্তারিত বর্ণনা দিন:' : 'Detailed Description:'}
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={lang === 'bn' ? 'ঘটনাটির বিস্তারিত তথ্য এখানে লিখুন...' : 'Describe what happened in detail...'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition shadow-xs"
              >
                {lang === 'bn' ? 'রিপোর্ট জমা দিন' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
