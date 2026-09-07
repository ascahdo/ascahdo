import React, { useState } from 'react';
import {
  Building2,
  Users,
  CreditCard,
  Globe,
  ShieldCheck,
  PlusCircle,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  Settings,
  MessageSquare,
  Sparkles,
  Layers,
  Lock
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { TenantInstitution, SubscriptionPlan } from '../../types/schoolTypes';

export const SuperAdminDashboard: React.FC<{
  onOpenNewSchoolModal: () => void;
}> = ({ onOpenNewSchoolModal }) => {
  const {
    institutions,
    subscriptionPlans,
    toggleInstitutionStatus,
    deleteInstitution,
    auditLogs,
    smsConfig,
    students,
    teachers
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'institutions' | 'plans' | 'payments' | 'domains' | 'sms' | 'audit'>('institutions');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const totalStudentsCount = (institutions || []).reduce((acc, inst) => acc + (inst?.stats?.totalStudents || 0), 0);
  const totalTeachersCount = (institutions || []).reduce((acc, inst) => acc + (inst?.stats?.totalTeachers || 0), 0);
  const totalMonthlyRevenue = (institutions || []).length * 3500;

  const filteredInstitutions = (institutions || []).filter((inst) => {
    if (!inst) return false;
    const matchesSearch =
      (inst.name && inst.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inst.nameBn && inst.nameBn.includes(searchTerm)) ||
      (inst.code && inst.code.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || inst.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-purple-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-purple-500/20 text-purple-300 border border-purple-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>সেন্ট্রাল সুপার অ্যাডমিন কন্ট্রোল প্যানেল</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            মাল্টি-টেন্যান্ট স্কুল ও একাডেমি SaaS প্লাটফর্ম
          </h2>
          <p className="text-xs sm:text-sm text-purple-200">
            সমগ্র বাংলাদেশের স্কুল, কলেজ, মাদ্রাসা ও কোচিং সেন্টারের কেন্দ্রীয় ব্যবস্থাপনা, সাবস্ক্রিপশন ও বিলিং।
          </p>
        </div>

        <button
          onClick={onOpenNewSchoolModal}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-2xl transition shadow-lg text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>নতুন প্রতিষ্ঠান অনবোর্ডিং</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{institutions.length} টি</div>
            <div className="text-xs text-slate-500 font-semibold">নিবন্ধিত প্রতিষ্ঠান</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalStudentsCount}+</div>
            <div className="text-xs text-slate-500 font-semibold">মোট সক্রিয় শিক্ষার্থী</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">৳ {(totalMonthlyRevenue || 0).toLocaleString()}</div>
            <div className="text-xs text-slate-500 font-semibold">মাসিক SaaS রেভিনিউ</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{smsConfig.balanceRemaining}</div>
            <div className="text-xs text-slate-500 font-semibold">সেন্ট্রাল SMS ক্রেডিট ব্যালেন্স</div>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 text-xs sm:text-sm font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('institutions')}
          className={`pb-3 transition whitespace-nowrap ${
            activeTab === 'institutions' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          প্রতিষ্ঠানসমূহ ({institutions.length})
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`pb-3 transition whitespace-nowrap ${
            activeTab === 'plans' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          সাবস্ক্রিপশন প্যাকেজ
        </button>
        <button
          onClick={() => setActiveTab('domains')}
          className={`pb-3 transition whitespace-nowrap ${
            activeTab === 'domains' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          কাস্টম ডোমেইন (.edu.bd)
        </button>
        <button
          onClick={() => setActiveTab('sms')}
          className={`pb-3 transition whitespace-nowrap ${
            activeTab === 'sms' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          SMS গেটওয়ে
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 transition whitespace-nowrap ${
            activeTab === 'audit' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          অডিট লগ
        </button>
      </div>

      {/* TAB 1: INSTITUTIONS MANAGEMENT */}
      {activeTab === 'institutions' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="প্রতিষ্ঠান নাম, EIIN বা কোড দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-purple-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
              >
                <option value="all">সকল ধরন</option>
                <option value="school">স্কুল ও কলেজ</option>
                <option value="madrasa">মাদ্রাসা</option>
                <option value="kindergarten">কিন্ডারগার্টেন</option>
                <option value="coaching">কোচিং সেন্টার</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-y border-slate-200">
                <tr>
                  <th className="p-3">প্রতিষ্ঠান বিবরণ</th>
                  <th className="p-3">ধরন ও EIIN</th>
                  <th className="p-3">ঠিকানা ও ফোন</th>
                  <th className="p-3">শিক্ষার্থী / শিক্ষক</th>
                  <th className="p-3">সাবস্ক্রিপশন</th>
                  <th className="p-3">স্ট্যাটাস</th>
                  <th className="p-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInstitutions.map((inst) => (
                  <tr key={inst.id} className="hover:bg-slate-50 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={inst.logo}
                          alt="Logo"
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{inst.nameBn}</div>
                          <div className="text-[11px] text-slate-500">{inst.name}</div>
                          <div className="text-[10px] text-purple-700 font-mono">{inst.subdomain}.platform.com</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase block w-max mb-1">
                        {inst.type}
                      </span>
                      <span className="font-mono font-bold text-slate-700">{inst.code}</span>
                    </td>

                    <td className="p-3 text-slate-600">
                      <div>{inst.address}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{inst.phone}</div>
                    </td>

                    <td className="p-3 font-semibold text-slate-800">
                      <div>🎓 {inst.stats.totalStudents || 0} ছাত্র-ছাত্রী</div>
                      <div className="text-[11px] text-slate-500">👨‍🏫 {inst.stats.totalTeachers || 0} শিক্ষক</div>
                    </td>

                    <td className="p-3">
                      <span className="font-bold text-slate-800 block">{inst.subscriptionPlanId.replace('plan_', '').toUpperCase()}</span>
                      <span className="text-[10px] text-slate-400">মেয়াদ: {inst.subscriptionExpiry}</span>
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          inst.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inst.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {inst.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {inst.status === 'active' ? (
                          <button
                            onClick={() => toggleInstitutionStatus(inst.id, 'suspended')}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg text-[11px] font-bold"
                            title="স্থগিত করুন"
                          >
                            স্থগিত
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleInstitutionStatus(inst.id, 'active')}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg text-[11px] font-bold"
                            title="সক্রিয় করুন"
                          >
                            সক্রিয়
                          </button>
                        )}
                        <button
                          onClick={() => deleteInstitution(inst.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-[11px] font-bold"
                          title="মুছুন"
                        >
                          মুছুন
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SUBSCRIPTION PLANS */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-purple-500 transition shadow-sm space-y-5"
            >
              <div className="space-y-1">
                <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {plan.nameBn}
                </span>
                <h3 className="text-xl font-black text-slate-900">{plan.name}</h3>
                <div className="text-2xl font-black text-purple-700 font-serif pt-1">
                  ৳ {(plan.priceMonthly || 0).toLocaleString()} <span className="text-xs text-slate-400 font-sans font-normal">/প্রতি মাস</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <div className="flex justify-between">
                  <span>সর্বোচ্চ শিক্ষার্থী:</span>
                  <span className="font-bold text-slate-900">{plan.maxStudents} জন</span>
                </div>
                <div className="flex justify-between">
                  <span>সর্বোচ্চ শিক্ষক:</span>
                  <span className="font-bold text-slate-900">{plan.maxTeachers} জন</span>
                </div>
                <div className="flex justify-between">
                  <span>ক্লাউড স্টোরেজ:</span>
                  <span className="font-bold text-slate-900">{plan.storageGb} GB</span>
                </div>
                <div className="flex justify-between">
                  <span>ফ্রি SMS ক্রেডিট:</span>
                  <span className="font-bold text-slate-900">{plan.smsCredits} টি</span>
                </div>
                <div className="flex justify-between">
                  <span>কাস্টম ডোমেইন (.edu.bd):</span>
                  <span className="font-bold text-slate-900">{plan.customDomainAllowed ? '✅ হ্যাঁ' : '❌ না'}</span>
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <div className="text-[11px] font-bold text-slate-700 mb-1">প্যাকেজের প্রধান সুবিধাসমূহ:</div>
                {(plan.features || []).map((f, i) => (
                  <div key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: CUSTOM DOMAINS */}
      {activeTab === 'domains' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">কাস্টম ডোমেইন ও DNS ট্র্যাকার</h3>
          <p className="text-xs text-slate-500">প্রতিষ্ঠানগুলোর নিজস্ব .edu.bd ডোমেইন এবং SSL সার্টিফিকেট স্ট্যাটাস।</p>

          <div className="space-y-3">
            {institutions.map((inst) => (
              <div
                key={inst.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{inst.nameBn}</h4>
                  <div className="text-xs text-purple-700 font-mono mt-0.5">
                    {inst.customDomain || `${inst.subdomain}.ascahdo-school.com`}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                    <Lock className="w-3 h-3" /> SSL সক্রিয়
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    DNS ভেরিফাইড
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SMS GATEWAY */}
      {activeTab === 'sms' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 max-w-2xl">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">সেন্ট্রাল SMS গেটওয়ে কনফিগারেশন</h3>
            <p className="text-xs text-slate-500">হাজিরা, ফি কালেকশন ও নোটিশ স্বয়ংক্রিয় এসএমএস কনফিগারেশন</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">SMS গেটওয়ে প্রোভাইডার</label>
              <input
                type="text"
                readOnly
                value={smsConfig.provider}
                className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-xl font-mono font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">সেন্ডার আইডি (Sender Masking)</label>
              <input
                type="text"
                readOnly
                value={smsConfig.senderId}
                className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-xl font-mono font-bold text-slate-800"
              />
            </div>

            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-purple-900">অবশিষ্ট সেন্ট্রাল ক্রেডিট:</span>
                <span className="text-xl font-black text-purple-700 font-mono">{smsConfig.balanceRemaining} SMS</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">সিস্টেম অডিট ও অ্যাক্টিভিটি লগ</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-y border-slate-200">
                <tr>
                  <th className="p-2.5">ইউজার ও রোল</th>
                  <th className="p-2.5">প্রতিষ্ঠান</th>
                  <th className="p-2.5">অ্যাকশন</th>
                  <th className="p-2.5">টার্গেট অবজেক্ট</th>
                  <th className="p-2.5">সময়</th>
                  <th className="p-2.5">আইপি</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="p-2.5 font-bold text-slate-900">{log.actorName} ({log.role})</td>
                    <td className="p-2.5 text-slate-600">{log.institutionName || 'সেন্ট্রাল'}</td>
                    <td className="p-2.5 font-semibold text-purple-700">{log.action}</td>
                    <td className="p-2.5 text-slate-700">{log.target}</td>
                    <td className="p-2.5 text-slate-500 font-mono">{log.timestamp}</td>
                    <td className="p-2.5 text-slate-400 font-mono">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
