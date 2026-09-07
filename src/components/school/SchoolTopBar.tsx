import React from 'react';
import {
  Building2,
  Globe,
  ShieldCheck,
  GraduationCap,
  Users,
  UserCheck,
  BookOpen,
  PlusCircle,
  ExternalLink,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useSchool, SchoolAppViewMode } from '../../context/SchoolContext';
import { UserRole } from '../../types/schoolTypes';

export const SchoolTopBar: React.FC<{
  onOpenNewSchoolModal: () => void;
}> = ({ onOpenNewSchoolModal }) => {
  const {
    institutions,
    activeInstitutionId,
    activeInstitution,
    setActiveInstitutionId,
    userRole,
    setUserRole,
    viewMode,
    setViewMode
  } = useSchool();

  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    if (newRole === 'super_admin') {
      setViewMode('super_admin');
    } else if (newRole === 'teacher') {
      setViewMode('teacher_portal');
    } else if (newRole === 'student') {
      setViewMode('student_portal');
    } else if (newRole === 'guardian') {
      setViewMode('guardian_portal');
    } else {
      setViewMode('institution_admin');
    }
  };

  const getInstitutionTypeBadge = (type: string) => {
    switch (type) {
      case 'school':
        return 'স্কুল ও কলেজ';
      case 'madrasa':
        return 'মাদ্রাসা ও এতিমখানা';
      case 'kindergarten':
        return 'কিন্ডারগার্টেন';
      case 'coaching':
        return 'একাডেমিক কোচিং';
      case 'technical':
        return 'পলিটেকনিক ও টেকনিক্যাল';
      default:
        return 'শিক্ষা প্রতিষ্ঠান';
    }
  };

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Active Institution Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white shadow">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                <span>মাল্টি-টেন্যান্ট প্রতিষ্ঠান</span>
                <span className="bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-800">
                  {getInstitutionTypeBadge(activeInstitution.type)}
                </span>
              </div>
              <div className="relative inline-block">
                <select
                  value={activeInstitutionId}
                  onChange={(e) => setActiveInstitutionId(e.target.value)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm py-1 pl-2 pr-7 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none"
                >
                  {institutions.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.nameBn} ({inst.code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
              </div>
            </div>
          </div>

          <button
            onClick={onOpenNewSchoolModal}
            className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-lg font-bold transition shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>নতুন প্রতিষ্ঠান যুক্ত করুন</span>
          </button>
        </div>

        {/* Right: View Mode & Persona Switcher */}
        <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
          {/* View Modes */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('public_website')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition ${
                viewMode === 'public_website'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>পাবলিক ওয়েবসাইট</span>
            </button>

            <button
              onClick={() => {
                setUserRole('institution_admin');
                setViewMode('institution_admin');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition ${
                viewMode === 'institution_admin'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>স্কুল ERP ড্যাশবোর্ড</span>
            </button>

            <button
              onClick={() => {
                setUserRole('super_admin');
                setViewMode('super_admin');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition ${
                viewMode === 'super_admin'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-200" />
              <span>সুপার অ্যাডমিন</span>
            </button>
          </div>

          {/* Quick Role Switcher */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
            <span className="text-slate-400 text-[11px] hidden sm:inline">লগইন রোল:</span>
            <select
              value={userRole}
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
              className="bg-transparent text-emerald-400 font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="super_admin" className="bg-slate-800 text-white">
                👑 Super Admin
              </option>
              <option value="institution_admin" className="bg-slate-800 text-white">
                🏫 School Admin / Principal
              </option>
              <option value="teacher" className="bg-slate-800 text-white">
                👨‍🏫 Teacher Portal
              </option>
              <option value="student" className="bg-slate-800 text-white">
                🎓 Student Portal
              </option>
              <option value="guardian" className="bg-slate-800 text-white">
                👨‍👩‍👦 Guardian Portal
              </option>
              <option value="accountant" className="bg-slate-800 text-white">
                💼 Accountant
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
