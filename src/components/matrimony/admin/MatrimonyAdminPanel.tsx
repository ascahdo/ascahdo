import React, { useState } from 'react';
import {
  X,
  Users,
  ShieldCheck,
  Flag,
  DollarSign,
  Settings,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Eye,
  Trash2,
  Filter,
  Save,
  Lock,
  Phone,
  Layers,
  BookOpen,
  Calendar,
  CreditCard
} from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimony } from '../../../context/MatrimonyContext';
import { MatrimonyProfile, ReportItem, Invoice } from '../../../types/matrimonyTypes';

interface MatrimonyAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProfile: (profile: MatrimonyProfile) => void;
}

export const MatrimonyAdminPanel: React.FC<MatrimonyAdminPanelProps> = ({
  isOpen,
  onClose,
  onViewProfile,
}) => {
  const { lang } = useMatrimonyLanguage();
  const {
    profiles,
    reports,
    invoices,
    siteSettings,
    updateSiteSettings,
    adminVerifyProfile,
    adminChangeProfileStatus,
    adminToggleFeatured,
    resolveReport,
    deleteProfile
  } = useMatrimony();

  const [activeTab, setActiveTab] = useState<'overview' | 'profiles' | 'reports' | 'invoices' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState<'all' | 'female' | 'male'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(siteSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  if (!isOpen) return null;

  // Filtered Profiles
  const filteredProfiles = profiles.filter(p => {
    const matchesSearch =
      p.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.profession?.designation || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGender = filterGender === 'all' || p.gender === filterGender;
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;

    return matchesSearch && matchesGender && matchesStatus;
  });

  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amountBdt, 0);

  const pendingReports = reports.filter(r => r.status === 'pending');
  const verifiedCount = profiles.filter(p => p.verificationStatus === 'verified').length;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-6xl w-full shadow-2xl overflow-hidden border border-slate-200 my-4 max-h-[94vh] flex flex-col animate-in zoom-in-95">
        {/* Admin Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-700 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg font-serif">
                  {lang === 'bn' ? 'ম্যারেজ মিডিয়া অ্যাডমিন ও মডারেশন কন্ট্রোল' : 'Matrimony Admin & Trust Control'}
                </h3>
                <span className="text-[10px] bg-rose-950 text-rose-300 font-bold px-2 py-0.5 rounded border border-rose-800">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'প্রোফাইল অনুমোদন, নিরাপত্তা যাচাই ও রাজস্ব ব্যবস্থাপনা' : 'Manage profiles, verification, and revenue'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 flex gap-3 sm:gap-6 overflow-x-auto text-xs sm:text-sm font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'overview' ? 'border-rose-700 text-rose-700' : 'border-transparent text-slate-600'
            }`}
          >
            {lang === 'bn' ? 'সামগ্রিক পরিসংখ্যান' : 'Overview & Analytics'}
          </button>
          <button
            onClick={() => setActiveTab('profiles')}
            className={`py-3.5 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'profiles' ? 'border-rose-700 text-rose-700' : 'border-transparent text-slate-600'
            }`}
          >
            <span>{lang === 'bn' ? 'সকল বায়োডাটা' : 'All Biodatas'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold">
              {profiles.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3.5 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'reports' ? 'border-rose-700 text-rose-700' : 'border-transparent text-slate-600'
            }`}
          >
            <span>{lang === 'bn' ? 'অভিযোগ ও রিপোর্ট' : 'Reports & Abuse'}</span>
            {pendingReports.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                {pendingReports.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-3.5 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'invoices' ? 'border-rose-700 text-rose-700' : 'border-transparent text-slate-600'
            }`}
          >
            <span>{lang === 'bn' ? 'পেমেন্ট ও রাজস্ব' : 'Revenue & Invoices'}</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3.5 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'settings' ? 'border-rose-700 text-rose-700' : 'border-transparent text-slate-600'
            }`}
          >
            <span>{lang === 'bn' ? 'সাইট কনফিগ' : 'Site Settings'}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800">
          {/* 1. OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100">
                  <span className="text-xs font-semibold text-rose-800">{lang === 'bn' ? 'মোট বায়োডাটা' : 'Total Profiles'}</span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mt-1">{profiles.length}</p>
                </div>
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="text-xs font-semibold text-emerald-800">{lang === 'bn' ? 'যাচাইকৃত প্রোফাইল' : 'NID Verified'}</span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mt-1">{verifiedCount}</p>
                </div>
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
                  <span className="text-xs font-semibold text-amber-800">{lang === 'bn' ? 'বিচারাধীন অভিযোগ' : 'Pending Reports'}</span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mt-1">{pendingReports.length}</p>
                </div>
                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                  <span className="text-xs font-semibold text-blue-800">{lang === 'bn' ? 'মোট সংগৃহীত আয়' : 'Total Revenue'}</span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mt-1">৳ {(totalRevenue || 0).toLocaleString()}</p>
                </div>
              </div>

              {/* Quick Actions & Recent Profiles */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm font-serif">
                  {lang === 'bn' ? 'সর্বশেষ নিবন্ধিত প্রোফাইল পর্যালোচনা' : 'Latest Profiles for Quick Review'}
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                      <tr>
                        <th className="p-3">ID / Name</th>
                        <th className="p-3">Profession & Age</th>
                        <th className="p-3">District</th>
                        <th className="p-3">Verification</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {profiles.slice(0, 5).map(p => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold text-slate-900">
                            <div className="flex items-center gap-2">
                              <img src={p.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <span>{p.displayName}</span>
                                <span className="block font-mono text-[10px] text-slate-400">#{p.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-slate-600">
                            {p.profession?.designation || 'N/A'} • {p.age} Yrs
                          </td>
                          <td className="p-3 text-slate-600">{p.location?.district}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                p.verificationStatus === 'verified'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {p.verificationStatus}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold capitalize">
                              {p.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1">
                            <button
                              onClick={() => onViewProfile(p)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 text-slate-800 hover:text-rose-700 rounded-lg text-xs font-semibold"
                            >
                              View
                            </button>
                            <button
                              onClick={() =>
                                adminVerifyProfile(
                                  p.id,
                                  p.verificationStatus === 'verified' ? 'unverified' : 'verified'
                                )
                              }
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                                p.verificationStatus === 'verified'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-emerald-600 text-white'
                              }`}
                            >
                              {p.verificationStatus === 'verified' ? 'Revoke' : 'Verify NID'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. PROFILES */}
          {activeTab === 'profiles' && (
            <div className="space-y-4">
              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by ID, name, profession..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <select
                    value={filterGender}
                    onChange={e => setFilterGender(e.target.value as any)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="all">All Genders</option>
                    <option value="female">Brides (পাত্রী)</option>
                    <option value="male">Grooms (পাত্র)</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value as any)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                    <tr>
                      <th className="p-3">Biodata</th>
                      <th className="p-3">Gender / Age</th>
                      <th className="p-3">Education / Job</th>
                      <th className="p-3">Guardian Mobile</th>
                      <th className="p-3">NID Verification</th>
                      <th className="p-3">Tier</th>
                      <th className="p-3 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProfiles.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <img src={p.avatarUrl} alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
                            <div>
                              <span className="font-bold text-slate-900">{p.displayName}</span>
                              <span className="block font-mono text-[10px] text-slate-400">ID: {p.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-slate-800 capitalize">
                          {p.gender} ({p.age} Yrs)
                        </td>
                        <td className="p-3 text-slate-600">
                          <span className="font-semibold block">{p.profession?.designation}</span>
                          <span className="text-[11px] text-slate-400">{p.education?.degree}</span>
                        </td>
                        <td className="p-3 font-mono text-slate-700 font-semibold">{p.guardianContact || 'N/A'}</td>
                        <td className="p-3">
                          <button
                            onClick={() =>
                              adminVerifyProfile(
                                p.id,
                                p.verificationStatus === 'verified' ? 'unverified' : 'verified'
                              )
                            }
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.verificationStatus === 'verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {p.verificationStatus === 'verified' ? '✓ Verified' : 'Pending'}
                          </button>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              p.membershipTier === 'premium'
                                ? 'bg-amber-100 text-amber-900'
                                : p.membershipTier === 'standard'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {p.membershipTier}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1.5">
                          <button
                            onClick={() => onViewProfile(p)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
                            title="View Biodata"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => adminToggleFeatured(p.id)}
                            className={`p-1.5 rounded-lg ${
                              p.isFeatured ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-400'
                            }`}
                            title="Toggle VIP Showcase"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              adminChangeProfileStatus(
                                p.id,
                                p.status === 'active' ? 'suspended' : 'active'
                              )
                            }
                            className={`p-1.5 rounded-lg ${
                              p.status === 'active'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                            title={p.status === 'active' ? 'Suspend' : 'Activate'}
                          >
                            {p.status === 'active' ? (
                              <XCircle className="w-3.5 h-3.5" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteProfile(p.id)}
                            className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg"
                            title="Delete Biodata"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm font-serif">
                {lang === 'bn' ? 'ব্যবহারকারীদের দাখিলকৃত অভিযোগ তালিকা' : 'Abuse & Violation Reports'}
              </h4>
              {reports.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                  কোনো অভিযোগ রেকর্ড নেই।
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map(rep => (
                    <div
                      key={rep.id}
                      className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-rose-700 text-xs font-mono uppercase bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            {rep.reason}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">Target: #{rep.targetProfileId}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              rep.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {rep.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 italic">"{rep.description}"</p>
                        <span className="text-[10px] text-slate-400 font-mono block">{rep.createdAt}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {rep.status === 'pending' && (
                          <>
                            <button
                              onClick={() => resolveReport(rep.id, 'resolved')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                            >
                              Action Taken
                            </button>
                            <button
                              onClick={() => resolveReport(rep.id, 'dismissed')}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                            >
                              Dismiss
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. INVOICES */}
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm font-serif">
                  {lang === 'bn' ? 'সকল সফল সাবস্ক্রিপশন ও লেনদেন' : 'All Successful Transactions'}
                </h4>
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl font-bold text-emerald-900 text-xs">
                  মোট রাজস্ব: ৳ {(totalRevenue || 0).toLocaleString()}
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                    <tr>
                      <th className="p-3">Invoice #</th>
                      <th className="p-3">Member ID</th>
                      <th className="p-3">Plan</th>
                      <th className="p-3">Method / TrxID</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                        <td className="p-3 font-mono text-slate-600">{inv.profileId}</td>
                        <td className="p-3 font-semibold text-rose-700">{inv.planName}</td>
                        <td className="p-3 font-mono text-slate-600">
                          {inv.paymentMethod.toUpperCase()} • {inv.transactionId}
                        </td>
                        <td className="p-3 font-bold font-serif text-slate-900">৳ {inv.amountBdt}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. SITE SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl text-xs sm:text-sm">
              {settingsSaved && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>সাইট কনফিগারেশন সফলভাবে আপডেট হয়েছে!</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">প্ল্যাটফর্ম নাম (বাংলা)</label>
                <input
                  type="text"
                  value={settingsForm.siteNameBn}
                  onChange={e => setSettingsForm({ ...settingsForm, siteNameBn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">হেল্পলাইন নম্বর</label>
                <input
                  type="text"
                  value={settingsForm.helplinePhone}
                  onChange={e => setSettingsForm({ ...settingsForm, helplinePhone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ঢাকা প্রধান কার্যালয়ের ঠিকানা</label>
                <input
                  type="text"
                  value={settingsForm.dhakaOfficeAddress}
                  onChange={e => setSettingsForm({ ...settingsForm, dhakaOfficeAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                >
                  <Save className="w-4 h-4" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
