import React, { useState } from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  X, Landmark, ShieldCheck, CheckCircle, Save,
  Building2, User, Phone, Mail, FileText
} from 'lucide-react';
import { Somiti } from '../../types/somitiTypes';

interface SomitiCreateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  somitiToEdit?: Somiti | null;
  onSaveSomiti: (somitiData: Partial<Somiti>) => void;
}

export const SomitiCreateEditModal: React.FC<SomitiCreateEditModalProps> = ({
  isOpen,
  onClose,
  somitiToEdit,
  onSaveSomiti
}) => {
  const { isBn } = useTranslation();

  const [formData, setFormData] = useState<Partial<Somiti>>(
    somitiToEdit || {
      id: `SOM-00${Math.floor(Math.random() * 90 + 10)}`,
      code: 'NEW',
      nameBn: '',
      nameEn: '',
      regNumber: 'REG-DHK-2026-0000',
      logo: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&q=80&w=200',
      district: 'ঢাকা',
      upazila: 'ধানমন্ডি',
      address: '',
      phone: '+880 1700 000000',
      email: 'info@ascahdo.org',
      establishedYear: 2026,
      president: { name: '', phone: '' },
      secretary: { name: '', phone: '' },
      treasurer: { name: '', phone: '' },
      manager: { name: '', phone: '' },
      bankName: 'Islami Bank Bangladesh Ltd',
      bankAccount: '',
      routingNumber: '125271890',
      status: 'active',
      totalSavings: 0,
      totalLoans: 0,
      totalRecovery: 0,
      totalOutstanding: 0,
      membersCount: 0,
      branchesCount: 1,
      createdAt: new Date().toISOString().split('T')[0]
    }
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSomiti(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200">

        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-md">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">
                {somitiToEdit ? (isBn ? 'সমিতির তথ্য সম্পাদনা' : 'Edit Somiti Profile') : (isBn ? 'নতুন সমিতি রেজিস্ট্রেশন ও তৈরি' : 'Create New Somiti')}
              </h3>
              <p className="text-xs text-teal-300">
                Multi-Somiti Central Governance Registry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Section 1: Basic Identity */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>১. সমিতির মৌলিক ও আইনি পরিচয়</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">সমিতির বাংলা নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: এসকাডো ইয়ুথ সমবায় সমিতি"
                  value={formData.nameBn || ''}
                  onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">English Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ASCADO Youth Somiti"
                  value={formData.nameEn || ''}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">রেজিস্ট্রেশন নম্বর (Govt Reg No) *</label>
                <input
                  type="text"
                  required
                  placeholder="REG-DHK-2026-XXXX"
                  value={formData.regNumber || ''}
                  onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">শর্ট কোড (Code)</label>
                <input
                  type="text"
                  placeholder="AYS"
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono uppercase"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">জেলা *</label>
                <input
                  type="text"
                  required
                  value={formData.district || ''}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">উপজেলা *</label>
                <input
                  type="text"
                  required
                  value={formData.upazila || ''}
                  onChange={(e) => setFormData({ ...formData, upazila: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">প্রধান কার্যালয়ের ঠিকানা</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">সমিতির লোগো ইমেজ URL (Logo)</label>
                <input
                  type="url"
                  placeholder="https://.../logo.png"
                  value={formData.logo || ''}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">সমিতির ব্যানার ইমেজ URL (Header Banner)</label>
                <input
                  type="url"
                  placeholder="https://.../banner.jpg"
                  value={formData.bannerUrl || ''}
                  onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">সমিতির স্লোগান / প্রতিপাদ্য (বাংলা)</label>
                <input
                  type="text"
                  placeholder="যেমন: স্বাবলম্বী জাতি ও সমৃদ্ধ সমবায় গড়ার বিশ্বস্ত অংশীদার"
                  value={formData.sloganBn || ''}
                  onChange={(e) => setFormData({ ...formData, sloganBn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Executive Board */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
              <User className="w-4 h-4 text-indigo-600" />
              <span>২. পরিচালনা পর্ষদ ও এক্সিকিউটিভ কমিটি</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">সভাপতি (President) নাম</label>
                <input
                  type="text"
                  placeholder="সভাপতির নাম"
                  value={formData.president?.name || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    president: { ...formData.president, name: e.target.value, phone: formData.president?.phone || '' }
                  })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">সাধারণ সম্পাদক (Secretary) নাম</label>
                <input
                  type="text"
                  placeholder="সম্পাদকের নাম"
                  value={formData.secretary?.name || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    secretary: { ...formData.secretary, name: e.target.value, phone: formData.secretary?.phone || '' }
                  })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">কোষাধ্যক্ষ (Treasurer) নাম</label>
                <input
                  type="text"
                  placeholder="কোষাধ্যক্ষের নাম"
                  value={formData.treasurer?.name || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    treasurer: { ...formData.treasurer, name: e.target.value, phone: formData.treasurer?.phone || '' }
                  })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">প্রধান ব্যবস্থাপক (Manager) নাম</label>
                <input
                  type="text"
                  placeholder="ব্যবস্থাপকের নাম"
                  value={formData.manager?.name || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    manager: { ...formData.manager, name: e.target.value, phone: formData.manager?.phone || '' }
                  })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Bank Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>৩. কেন্দ্রীয় ব্যাংক অ্যাকাউন্ট তথ্য</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">ব্যাংকের নাম</label>
                <input
                  type="text"
                  value={formData.bankName || ''}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">অ্যাকাউন্ট নম্বর</label>
                <input
                  type="text"
                  value={formData.bankAccount || ''}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">রাউটিং নম্বর</label>
                <input
                  type="text"
                  value={formData.routingNumber || ''}
                  onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isBn ? 'সমিতি সংরক্ষণ করুন' : 'Save Somiti'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
