import React, { useState } from 'react';
import { X, Search, Filter, RotateCcw, MapPin, Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimony, SearchFilters, DEFAULT_SEARCH_FILTERS } from '../../../context/MatrimonyContext';
import { BANGLADESH_DIVISIONS, BANGLADESH_DISTRICTS } from '../../../data/bangladeshData';
import { Gender, MaritalStatus, Religion } from '../../../types/matrimonyTypes';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySearch: () => void;
}

export const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  isOpen,
  onClose,
  onApplySearch,
}) => {
  const { lang } = useMatrimonyLanguage();
  const { searchFilters, setSearchFilters } = useMatrimony();

  const [localFilters, setLocalFilters] = useState<SearchFilters>(searchFilters);

  if (!isOpen) return null;

  const availableDistricts = localFilters.division && localFilters.division !== 'all'
    ? BANGLADESH_DISTRICTS.filter(d => d.divisionId === localFilters.division)
    : BANGLADESH_DISTRICTS;

  const handleReset = () => {
    setLocalFilters(DEFAULT_SEARCH_FILTERS);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilters(localFilters);
    onApplySearch();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 my-4 max-h-[92vh] flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-base sm:text-lg font-serif">
              {lang === 'bn' ? 'উন্নত পাত্র-পাত্রী অনুসন্ধান (Advanced Filter)' : 'Advanced Biodata Search'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleApply} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm">
          {/* Keyword Search */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {lang === 'bn' ? 'বায়োডাটা আইডি বা কিওয়ার্ড অনুসন্ধান:' : 'Keyword or Profile ID:'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={localFilters.searchKeyword || ''}
                onChange={e => setLocalFilters({ ...localFilters, searchKeyword: e.target.value })}
                placeholder={lang === 'bn' ? 'যেমন: MM-100101, Doctor, Engineer, ঢাকা ইত্যাদি' : 'e.g. MM-100101, Doctor, Engineer, Dhaka...'}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Gender Tab */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {lang === 'bn' ? 'কাঙ্ক্ষিত পাত্র/পাত্রী (Looking For):' : 'Looking For:'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setLocalFilters({ ...localFilters, gender: undefined })}
                className={`py-2 px-3 rounded-xl border font-semibold transition ${
                  !localFilters.gender
                    ? 'bg-rose-700 text-white border-rose-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50/50'
                }`}
              >
                {lang === 'bn' ? 'সকল (উভয়)' : 'All'}
              </button>
              <button
                type="button"
                onClick={() => setLocalFilters({ ...localFilters, gender: 'female' })}
                className={`py-2 px-3 rounded-xl border font-semibold transition ${
                  localFilters.gender === 'female'
                    ? 'bg-rose-700 text-white border-rose-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50/50'
                }`}
              >
                🧕 {lang === 'bn' ? 'কনে / পাত্রী' : 'Bride'}
              </button>
              <button
                type="button"
                onClick={() => setLocalFilters({ ...localFilters, gender: 'male' })}
                className={`py-2 px-3 rounded-xl border font-semibold transition ${
                  localFilters.gender === 'male'
                    ? 'bg-rose-700 text-white border-rose-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50/50'
                }`}
              >
                👳 {lang === 'bn' ? 'বর / পাত্র' : 'Groom'}
              </button>
            </div>
          </div>

          {/* 4-Col Grid for Key Demographics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Age Range */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'বয়স সীমা (Age Range):' : 'Age Range:'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={18}
                  max={60}
                  value={localFilters.ageMin || 20}
                  onChange={e => setLocalFilters({ ...localFilters, ageMin: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="number"
                  min={18}
                  max={65}
                  value={localFilters.ageMax || 40}
                  onChange={e => setLocalFilters({ ...localFilters, ageMax: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'বৈবাহিক অবস্থা (Marital Status):' : 'Marital Status:'}
              </label>
              <select
                value={localFilters.maritalStatus || 'All'}
                onChange={e => setLocalFilters({ ...localFilters, maritalStatus: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="All">{lang === 'bn' ? 'সকল বৈবাহিক অবস্থা' : 'All Statuses'}</option>
                <option value="never_married">{lang === 'bn' ? 'অবিবাহিত (Never Married)' : 'Never Married'}</option>
                <option value="divorced">{lang === 'bn' ? 'ডিভোর্সড (Divorced)' : 'Divorced'}</option>
                <option value="widowed">{lang === 'bn' ? 'বিধবা/বিপত্নীক (Widowed)' : 'Widowed'}</option>
              </select>
            </div>

            {/* Division */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'বিভাগ (Division):' : 'Division:'}
              </label>
              <select
                value={localFilters.division || 'all'}
                onChange={e => setLocalFilters({ ...localFilters, division: e.target.value, district: 'all' })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="all">{lang === 'bn' ? 'সকল বিভাগ' : 'All Divisions'}</option>
                {BANGLADESH_DIVISIONS.map(div => (
                  <option key={div.id} value={div.id}>{lang === 'bn' ? div.nameBn : div.nameEn}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'জেলা (District):' : 'District:'}
              </label>
              <select
                value={localFilters.district || 'all'}
                onChange={e => setLocalFilters({ ...localFilters, district: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="all">{lang === 'bn' ? 'সকল জেলা' : 'All Districts'}</option>
                {availableDistricts.map(dist => (
                  <option key={dist.id} value={dist.id}>{lang === 'bn' ? dist.nameBn : dist.nameEn}</option>
                ))}
              </select>
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'শিক্ষাগত স্তর (Education Level):' : 'Education Level:'}
              </label>
              <select
                value={localFilters.educationLevel || 'All'}
                onChange={e => setLocalFilters({ ...localFilters, educationLevel: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="All">{lang === 'bn' ? 'যেকোনো যোগ্যতা' : 'Any Education Level'}</option>
                <option value="Medical">MBBS / BDS / Medical Specialist</option>
                <option value="Engineering">Engineering / B.Sc in CSE / EEE</option>
                <option value="Masters">Masters / Post-Graduation</option>
                <option value="Bachelors">Bachelors / Graduation</option>
                <option value="Islamic">Madrasa / Fazil / Kamil / Dawra-e-Hadith</option>
              </select>
            </div>

            {/* Profession */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'পেশার ধরন (Profession):' : 'Profession Type:'}
              </label>
              <select
                value={localFilters.professionType || 'All'}
                onChange={e => setLocalFilters({ ...localFilters, professionType: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="All">{lang === 'bn' ? 'সকল পেশা' : 'All Professions'}</option>
                <option value="Doctor">Doctor / Medical Officer</option>
                <option value="Software">Software Engineer / IT</option>
                <option value="Govt">Govt. Official / BCS Cadre</option>
                <option value="Bank">Banker / Financial Officer</option>
                <option value="Teacher">Teacher / Lecturer</option>
                <option value="Business">Business / Entrepreneur</option>
                <option value="NRB">Expatriate / NRB</option>
              </select>
            </div>
          </div>

          {/* Checkbox Toggles for Verification & Photos */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.verifiedOnly || false}
                onChange={e => setLocalFilters({ ...localFilters, verifiedOnly: e.target.checked })}
                className="w-4 h-4 rounded text-rose-700 focus:ring-rose-500"
              />
              <span className="font-semibold text-slate-800">
                {lang === 'bn' ? 'কেবলমাত্র এনআইডি-যাচাইকৃত প্রোফাইল' : 'Verified Profiles Only'}
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.withPhotoOnly || false}
                onChange={e => setLocalFilters({ ...localFilters, withPhotoOnly: e.target.checked })}
                className="w-4 h-4 rounded text-rose-700 focus:ring-rose-500"
              />
              <span className="font-semibold text-slate-800">
                {lang === 'bn' ? 'ছবিযুক্ত প্রোফাইল' : 'Profiles with Photo Only'}
              </span>
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'রিসেট করুন' : 'Reset Filters'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
            >
              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>{lang === 'bn' ? 'ফিল্টার প্রয়োগ করুন' : 'Apply Search'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
