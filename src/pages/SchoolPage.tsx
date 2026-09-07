import React, { useState } from 'react';
import { SchoolProvider, useSchool } from '../context/SchoolContext';
import { SchoolTopBar } from '../components/school/SchoolTopBar';
import { InstitutionPublicWebsite } from '../components/school/InstitutionPublicWebsite';
import { SuperAdminDashboard } from '../components/school/SuperAdminDashboard';
import { InstitutionAdminERP } from '../components/school/InstitutionAdminERP';
import { RolePortals } from '../components/school/RolePortals';
import { PlusCircle, Building2, CheckCircle, ShieldCheck } from 'lucide-react';
import { InstitutionType } from '../types/schoolTypes';

// Inner Component with Context Access
const SchoolPageContent: React.FC = () => {
  const { viewMode, setViewMode, createInstitution, institutions, setActiveInstitutionId } = useSchool();

  // New Institution Modal State
  const [isNewSchoolModalOpen, setIsNewSchoolModalOpen] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolNameBn, setNewSchoolNameBn] = useState('');
  const [newSchoolCode, setNewSchoolCode] = useState('');
  const [newSchoolType, setNewSchoolType] = useState<InstitutionType>('school');
  const [newSchoolSubdomain, setNewSchoolSubdomain] = useState('');
  const [newSchoolPhone, setNewSchoolPhone] = useState('');
  const [newSchoolEmail, setNewSchoolEmail] = useState('');
  const [newSchoolAddress, setNewSchoolAddress] = useState('');
  const [newSchoolDistrict, setNewSchoolDistrict] = useState('ঢাকা');
  const [newSchoolPrincipal, setNewSchoolPrincipal] = useState('');

  const handleCreateNewSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName || !newSchoolNameBn) return;

    const sub = newSchoolSubdomain || newSchoolName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15);
    const code = newSchoolCode || `EIIN-${Math.floor(100000 + Math.random() * 900000)}`;

    const newInst = createInstitution({
      name: newSchoolName,
      nameBn: newSchoolNameBn,
      code,
      type: newSchoolType,
      logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&auto=format&fit=crop&q=80',
      subdomain: sub,
      address: newSchoolAddress || 'ঢাকা, বাংলাদেশ',
      district: newSchoolDistrict,
      division: 'Dhaka',
      phone: newSchoolPhone || '01700000000',
      email: newSchoolEmail || `info@${sub}.edu.bd`,
      establishedYear: 2005,
      principalName: newSchoolPrincipal || 'অধ্যক্ষ মহোদয়',
      principalPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      principalMessage: 'জ্ঞান, চরিত্র ও শৃঙ্খলাই আমাদের প্রতিষ্ঠানের মূল ভিত্তি।',
      subscriptionPlanId: 'plan_standard',
      subscriptionExpiry: '2027-12-31',
      status: 'active',
      theme: {
        primaryColor: newSchoolType === 'madrasa' ? '#059669' : '#1e3a8a',
        secondaryColor: '#f59e0b',
        fontFamily: 'Hind Siliguri',
        bannerSliderImages: [
          'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&auto=format&fit=crop&q=80'
        ]
      },
      stats: {
        totalStudents: 120,
        totalTeachers: 12,
        totalStaff: 4,
        totalClasses: 6,
        passingRate: 99.0
      },
      createdAt: new Date().toISOString()
    });

    setActiveInstitutionId(newInst.id);
    setIsNewSchoolModalOpen(false);
    setViewMode('institution_admin');

    // Reset Form
    setNewSchoolName('');
    setNewSchoolNameBn('');
    setNewSchoolCode('');
    setNewSchoolSubdomain('');
    setNewSchoolPhone('');
    setNewSchoolEmail('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Persistent Bar with Institution & Role Persona Selector */}
      <SchoolTopBar onOpenNewSchoolModal={() => setIsNewSchoolModalOpen(true)} />

      {/* Main View Router */}
      <div className="flex-1 w-full">
        {viewMode === 'public_website' && (
          <InstitutionPublicWebsite onOpenERP={() => setViewMode('institution_admin')} />
        )}

        {viewMode === 'super_admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <SuperAdminDashboard onOpenNewSchoolModal={() => setIsNewSchoolModalOpen(true)} />
          </div>
        )}

        {viewMode === 'institution_admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <InstitutionAdminERP onOpenNewSchoolModal={() => setIsNewSchoolModalOpen(true)} />
          </div>
        )}

        {(viewMode === 'teacher_portal' || viewMode === 'student_portal' || viewMode === 'guardian_portal') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <RolePortals />
          </div>
        )}
      </div>

      {/* MODAL: ADD NEW INSTITUTION (ONBOARDING) */}
      {isNewSchoolModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl space-y-5 my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">নতুন প্রতিষ্ঠান অনবোর্ডিং</h3>
                  <p className="text-xs text-slate-500">স্কুল, কলেজ, মাদ্রাসা বা কোচিং সেন্টারের তথ্য পূরণ করুন</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewSchoolModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewSchool} className="space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">প্রতিষ্ঠানের নাম (বাংলায়) *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ঢাকা আইডিয়াল স্কুল ও কলেজ"
                    value={newSchoolNameBn}
                    onChange={(e) => setNewSchoolNameBn(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Name (in English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dhaka Ideal School & College"
                    value={newSchoolName}
                    onChange={(e) => setNewSchoolName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">প্রতিষ্ঠানের ধরন *</label>
                  <select
                    value={newSchoolType}
                    onChange={(e) => setNewSchoolType(e.target.value as InstitutionType)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500 font-semibold"
                  >
                    <option value="school">স্কুল ও কলেজ (School & College)</option>
                    <option value="madrasa">মাদ্রাসা ও এতিমখানা (Madrasa)</option>
                    <option value="kindergarten">কিন্ডারগার্টেন (Kindergarten)</option>
                    <option value="coaching">একাডেমিক কোচিং (Coaching Center)</option>
                    <option value="technical">টেকনিক্যাল ও পলিটেকনিক</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">EIIN বা প্রতিষ্ঠান কোড</label>
                  <input
                    type="text"
                    placeholder="যেমন: EIIN-108291"
                    value={newSchoolCode}
                    onChange={(e) => setNewSchoolCode(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">সাবডোমেইন (Unique Web URL)</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="dhaka-ideal"
                      value={newSchoolSubdomain}
                      onChange={(e) => setNewSchoolSubdomain(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-l-xl focus:bg-white focus:outline-none font-mono"
                    />
                    <span className="bg-slate-200 text-slate-700 font-bold px-2 py-2.5 rounded-r-xl border-y border-r border-slate-300 text-[11px]">
                      .platform.com
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">অধ্যক্ষ / প্রধান শিক্ষকের নাম</label>
                  <input
                    type="text"
                    placeholder="উদা: ড. আতিকুর রহমান"
                    value={newSchoolPrincipal}
                    onChange={(e) => setNewSchoolPrincipal(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">যোগাযোগ ফোন নম্বর *</label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={newSchoolPhone}
                    onChange={(e) => setNewSchoolPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ইমেইল অ্যাড্রেস</label>
                  <input
                    type="email"
                    placeholder="info@school.edu.bd"
                    value={newSchoolEmail}
                    onChange={(e) => setNewSchoolEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ঠিকানা ও জেলা</label>
                <input
                  type="text"
                  placeholder="উদা: বাড়ি #১২, রোড #০৪, মিরপুর-১০, ঢাকা-১২১৬"
                  value={newSchoolAddress}
                  onChange={(e) => setNewSchoolAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-0.5">
                <div className="font-bold">✨ স্বয়ংক্রিয়ভাবে সক্রিয় হবে:</div>
                <div className="text-[11px] text-emerald-700">
                  লাইভ পাবলিক ওয়েবসাইট, অ্যাডমিন ERP ড্যাশবোর্ড, রেজাল্ট শীট এবং ডিজিটাল ফি কালেকশন।
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg transition text-sm flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>প্রতিষ্ঠান নিবন্ধন ও সেটআপ সম্পন্ন করুন</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Export Default School Page with Provider Wrapper
export const SchoolPage: React.FC = () => {
  return (
    <SchoolProvider>
      <SchoolPageContent />
    </SchoolProvider>
  );
};
