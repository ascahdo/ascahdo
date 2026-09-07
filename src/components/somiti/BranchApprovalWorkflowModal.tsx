import React, { useState } from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  X, Building2, ShieldCheck, CheckCircle2, Clock, AlertTriangle,
  FileText, Send, UserCheck, MapPin, Phone, Mail, Award, CheckCircle
} from 'lucide-react';
import { BranchApplication, Somiti, BranchAppStatus } from '../../types/somitiTypes';

interface BranchApprovalWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: BranchApplication[];
  somitis: Somiti[];
  onApplyNewBranch: (app: Partial<BranchApplication>) => void;
  onUpdateAppStatus: (appId: string, status: BranchAppStatus, notes?: string) => void;
}

export const BranchApprovalWorkflowModal: React.FC<BranchApprovalWorkflowModalProps> = ({
  isOpen,
  onClose,
  applications,
  somitis,
  onApplyNewBranch,
  onUpdateAppStatus
}) => {
  const { isBn } = useTranslation();
  const [viewMode, setViewMode] = useState<'list' | 'apply'>('list');
  const [selectedApp, setSelectedApp] = useState<BranchApplication | null>(applications[0] || null);

  // New Application Form State
  const [formData, setFormData] = useState({
    proposedBranchName: '',
    somitiId: somitis[0]?.id || 'SOM-001',
    district: 'ঢাকা',
    upazila: '',
    unionWard: '',
    address: '',
    applicantName: '',
    applicantNid: '',
    applicantMobile: '',
    applicantEmail: '',
    proposedManager: '',
    officeInfo: '',
    businessPlan: ''
  });
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmitApply = (e: React.FormEvent) => {
    e.preventDefault();
    const somiti = somitis.find((s) => s.id === formData.somitiId);
    onApplyNewBranch({
      ...formData,
      somitiName: somiti ? somiti.nameBn : 'এসকাডো ইয়ুথ সমিতি',
      documentsAttached: ['NID_Applicant.pdf', 'Rent_Deed.pdf', 'Business_Proposal.pdf'],
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    });
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setViewMode('list');
    }, 1500);
  };

  const getStatusBadge = (status: BranchAppStatus) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">🟡 অপেক্ষমাণ (Pending)</span>;
      case 'under_review':
        return <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">🔵 কাগজ যাচাই (Under Review)</span>;
      case 'verification':
        return <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold">🟠 ফিল্ড ভেরিফিকেশন (Verification)</span>;
      case 'approved':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">🟢 অনুমোদিত (Approved)</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">🔴 বাতিল (Rejected)</span>;
      case 'suspended':
        return <span className="px-2.5 py-1 rounded-full bg-slate-800 text-white text-[11px] font-bold">⚫ স্থগিত (Suspended)</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-50 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200">

        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">
                {isBn ? '🏛️ শাখা অনুমোদন ব্যবস্থা ও ওয়ার্কফ্লো' : 'Branch Application & Approval System'}
              </h3>
              <p className="text-xs text-indigo-300">
                Multi-Somiti Central Branch Accreditation Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'apply' : 'list')}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              {viewMode === 'list' ? '+ নতুন শাখা আবেদন' : 'আবেদন তালিকা দেখুন'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workflow Visualizer Strip */}
        <div className="bg-white border-b border-slate-200 p-3 sm:p-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[650px] text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-[10px]">1</div>
              <span className="font-bold text-slate-800">আবেদন (Apply)</span>
            </div>
            <div className="h-0.5 w-8 bg-slate-300"></div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white font-black flex items-center justify-center text-[10px]">2</div>
              <span className="font-bold text-slate-800">ডকুমেন্ট চেক</span>
            </div>
            <div className="h-0.5 w-8 bg-slate-300"></div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-orange-500 text-white font-black flex items-center justify-center text-[10px]">3</div>
              <span className="font-bold text-slate-800">ফিল্ড ভেরিফিকেশন</span>
            </div>
            <div className="h-0.5 w-8 bg-slate-300"></div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-500 text-white font-black flex items-center justify-center text-[10px]">4</div>
              <span className="font-bold text-slate-800">অ্যাডমিন রিভিউ</span>
            </div>
            <div className="h-0.5 w-8 bg-slate-300"></div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-[10px]">5</div>
              <span className="font-bold text-emerald-800">অনুমোদন ও আইডি</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {viewMode === 'apply' ? (
            /* NEW BRANCH APPLICATION FORM */
            <form onSubmit={handleSubmitApply} className="space-y-4 max-w-2xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-black text-slate-900 text-base">নতুন শাখা অনুমোদনের আবেদন ফর্ম</h4>
                <p className="text-xs text-slate-500">সঠিক তথ্য ও প্রস্তাবিত ব্যবস্থাপক বিবরণ পূরণ করুন</p>
              </div>

              {submittedSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>শাখার আবেদন সফলভাবে জমা হয়েছে! অ্যাডমিন পর্যালোচনা করবেন।</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">সমিতি নির্বাচন করুন *</label>
                  <select
                    value={formData.somitiId}
                    onChange={(e) => setFormData({ ...formData, somitiId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                  >
                    {somitis.map((s) => (
                      <option key={s.id} value={s.id}>{s.nameBn} ({s.nameEn})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">প্রস্তাবিত শাখার নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: কুমিল্লা সদর মডেল শাখা"
                    value={formData.proposedBranchName}
                    onChange={(e) => setFormData({ ...formData, proposedBranchName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">জেলা *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: কুমিল্লা / গাজীপুর"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">উপজেলা / থানা *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: কুমিল্লা সদর"
                    value={formData.upazila}
                    onChange={(e) => setFormData({ ...formData, upazila: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">ইউনিয়ন / ওয়ার্ড *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ওয়ার্ড নং ৩"
                    value={formData.unionWard}
                    onChange={(e) => setFormData({ ...formData, unionWard: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">আবেদনকারীর পূর্ণ নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="আবেদনকারীর নাম"
                    value={formData.applicantName}
                    onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">আবেদনকারীর NID নম্বর *</label>
                  <input
                    type="text"
                    required
                    placeholder="NID নম্বর"
                    value={formData.applicantNid}
                    onChange={(e) => setFormData({ ...formData, applicantNid: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="text"
                    required
                    placeholder="+880 17XXXXXXXX"
                    value={formData.applicantMobile}
                    onChange={(e) => setFormData({ ...formData, applicantMobile: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">প্রস্তাবিত শাখা ব্যবস্থাপক *</label>
                  <input
                    type="text"
                    required
                    placeholder="ম্যানেজারের নাম"
                    value={formData.proposedManager}
                    onChange={(e) => setFormData({ ...formData, proposedManager: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">অফিসের অবস্থান ও পরিকাঠামো বিবরণ *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ১০০০ বর্গফুট শীতাতপ নিয়ন্ত্রিত ২য় তলা অফিস"
                    value={formData.officeInfo}
                    onChange={(e) => setFormData({ ...formData, officeInfo: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">ব্যবসায়িক কর্মপরিকল্পনা ও সঞ্চয় লক্ষ্যমাত্রা</label>
                  <textarea
                    rows={3}
                    placeholder="শাখার আগামী ১ বছরের লক্ষ্যমাত্রা ও সমাজসেবামূলক পরিকল্পনা..."
                    value={formData.businessPlan}
                    onChange={(e) => setFormData({ ...formData, businessPlan: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>আবেদন জমা দিন</span>
                </button>
              </div>
            </form>
          ) : (
            /* APPLICATION LIST & REVIEW DASHBOARD */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Applications List */}
              <div className="md:col-span-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
                  <span>শাখা আবেদনের তালিকা ({applications.length})</span>
                </div>

                <div className="space-y-2.5">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer text-xs ${
                        selectedApp?.id === app.id
                          ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-mono text-[10px] font-bold text-slate-400">{app.id}</span>
                        {getStatusBadge(app.status)}
                      </div>
                      <h4 className="font-black text-slate-900 text-sm">{app.proposedBranchName}</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">{app.somitiName}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {app.district}, {app.upazila} • আবেদনকারী: {app.applicantName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Selected Application Review Card */}
              <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
                {selectedApp ? (
                  <>
                    <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-black text-slate-900">{selectedApp.proposedBranchName}</h4>
                        </div>
                        <p className="text-xs text-indigo-700 font-bold mt-0.5">{selectedApp.somitiName}</p>
                      </div>
                      {getStatusBadge(selectedApp.status)}
                    </div>

                    {/* Details Table */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">আবেদনকারী:</span>
                        <span className="font-bold text-slate-800">{selectedApp.applicantName} (NID: {selectedApp.applicantNid})</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">মোবাইল:</span>
                        <span className="font-bold text-emerald-700">{selectedApp.applicantMobile}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">লোকেশন:</span>
                        <span className="font-bold text-slate-800">{selectedApp.district}, {selectedApp.upazila}, {selectedApp.unionWard}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">প্রস্তাবিত ম্যানেজার:</span>
                        <span className="font-bold text-slate-800">{selectedApp.proposedManager}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">অফিস তথ্য:</span>
                        <span className="font-bold text-slate-800 text-right">{selectedApp.officeInfo}</span>
                      </div>
                      <div className="py-1">
                        <span className="text-slate-500 block mb-1">বিজনেস ও কর্মপরিকল্পনা:</span>
                        <p className="bg-slate-50 p-2.5 rounded-xl text-slate-700 leading-relaxed font-medium">
                          {selectedApp.businessPlan}
                        </p>
                      </div>
                    </div>

                    {/* Admin Workflow Action Controls */}
                    <div className="pt-3 border-t border-slate-100 space-y-2.5">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                        সুপার অ্যাডমিন অনুমোদন অ্যাকশন:
                      </span>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => onUpdateAppStatus(selectedApp.id, 'under_review', 'কাগজপত্র যাচাই চলছে')}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold border border-blue-200 transition"
                        >
                          কাগজপত্র যাচাই
                        </button>
                        <button
                          onClick={() => onUpdateAppStatus(selectedApp.id, 'verification', 'ফিল্ড ভেরিফিকেশন অফিসার নিয়োজিত')}
                          className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs font-bold border border-orange-200 transition"
                        >
                          ফিল্ড ভেরিফিকেশন
                        </button>
                        <button
                          onClick={() => onUpdateAppStatus(selectedApp.id, 'approved', 'শাখা অনুমোদন সম্পন্ন ও শাখা কোড জেনারেট')}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow transition flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>অনুমোদন ও শাখা আইডি তৈরি</span>
                        </button>
                        <button
                          onClick={() => onUpdateAppStatus(selectedApp.id, 'rejected', 'নীতিমালা অনুযায়ী আবেদন বাতিল')}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold border border-rose-200 transition"
                        >
                          বাতিল (Reject)
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    কোনো আবেদন নির্বাচন করা হয়নি।
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition cursor-pointer"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
