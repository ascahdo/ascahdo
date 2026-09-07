import React, { useState } from 'react';
import { X, Upload, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimony } from '../../../context/MatrimonyContext';

interface VerificationUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationUploadModal: React.FC<VerificationUploadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang } = useMatrimonyLanguage();
  const { submitVerificationDoc } = useMatrimony();

  const [docType, setDocType] = useState('nid');
  const [docNumber, setDocNumber] = useState('19985612345678901');
  const [docUrl, setDocUrl] = useState('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitVerificationDoc(docType, docNumber, docUrl);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
        <div className="bg-slate-900 text-white p-6 pb-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold font-serif">
              {lang === 'bn' ? 'এনআইডি / পরিচয়পত্র ভেরিফিকেশন' : 'NID / ID Verification'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">
              {lang === 'bn' ? 'ডকুমেন্ট জমা সম্পন্ন হয়েছে' : 'Document Submitted'}
            </h4>
            <p className="text-xs text-slate-600">
              {lang === 'bn'
                ? 'আমাদের ভেরিফিকেশন টিম ২৪ ঘণ্টার মধ্যে যাচাই করে আপনার প্রোফাইলে ব্লু ভেরিফাইড ব্যাজ যুক্ত করবে।'
                : 'Our verification team will review and approve within 24 hours.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'ডকুমেন্টের ধরন' : 'Document Type'}
              </label>
              <select
                value={docType}
                onChange={e => setDocType(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="nid">জাতীয় পরিচয়পত্র (Smart NID / Old NID)</option>
                <option value="passport">আন্তর্জাতিক পাসপোর্ট (Passport)</option>
                <option value="birth_cert">জন্ম নিবন্ধন সনদ (Digital Birth Certificate)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'পরিচয়পত্র নম্বর' : 'Document Number'}
              </label>
              <input
                type="text"
                required
                value={docNumber}
                onChange={e => setDocNumber(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'পরিচয়পত্রের ছবি বা স্ক্যান কপি' : 'Front Photo / Scan Copy URL'}
              </label>
              <input
                type="url"
                required
                value={docUrl}
                onChange={e => setDocUrl(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-800">
              🔒 আপনার জাতীয় পরিচয়পত্র অত্যন্ত গোপনীয়ভাবে এনক্রিপ্টেড থাকবে এবং কাউকে দেখানো হবে না।
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>জমা দিন</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
