import React, { useState } from 'react';
import { Search, Filter, Sparkles, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimony } from '../../../context/MatrimonyContext';
import { Gender } from '../../../types/matrimonyTypes';
import { BANGLADESH_DIVISIONS, BANGLADESH_DISTRICTS } from '../../../data/bangladeshData';

interface QuickSearchWidgetProps {
  onSearchSubmit: () => void;
  onOpenAdvancedSearch: () => void;
}

export const QuickSearchWidget: React.FC<QuickSearchWidgetProps> = ({
  onSearchSubmit,
  onOpenAdvancedSearch,
}) => {
  const { lang, t } = useMatrimonyLanguage();
  const { searchFilters, setSearchFilters } = useMatrimony();

  const [gender, setGender] = useState<Gender>(searchFilters.gender || 'female');
  const [ageMin, setAgeMin] = useState<number>(searchFilters.ageMin || 20);
  const [ageMax, setAgeMax] = useState<number>(searchFilters.ageMax || 35);
  const [religion, setReligion] = useState<string>(searchFilters.religion || 'Islam');
  const [division, setDivision] = useState<string>(searchFilters.division || 'all');
  const [district, setDistrict] = useState<string>(searchFilters.district || 'all');
  const [profession, setProfession] = useState<string>(searchFilters.professionType || 'All');

  const availableDistricts = division === 'all'
    ? BANGLADESH_DISTRICTS
    : BANGLADESH_DISTRICTS.filter(d => d.divisionId === division);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilters(prev => ({
      ...prev,
      gender,
      ageMin,
      ageMax,
      religion,
      division,
      district,
      professionType: profession,
    }));
    onSearchSubmit();
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl border border-rose-100 p-5 sm:p-7 md:p-8">
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <Search className="w-5 h-5 text-rose-700" />
            <span>{lang === 'bn' ? 'দ্রুত পাত্র-পাত্রী অনুসন্ধান' : 'Find Your Ideal Life Partner'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'bn' ? 'বয়স, জেলা, পেশা ও ধর্ম অনুযায়ী নিখুঁত ম্যাচিং' : 'Filter by age, profession, district & faith'}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAdvancedSearch}
          className="text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition flex items-center gap-1.5 shrink-0"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'অ্যাডভান্সড ফিল্টার' : 'Advanced Search'}</span>
        </button>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        {/* Looking For Gender Tabs */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            {lang === 'bn' ? 'আমি খুঁজছি (Looking For):' : 'I am looking for:'}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition border flex items-center justify-center gap-2 ${
                gender === 'female'
                  ? 'bg-rose-700 text-white border-rose-700 shadow-md shadow-rose-700/20'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50/50'
              }`}
            >
              <span className="text-base">🧕</span>
              <span>{lang === 'bn' ? 'কনে / পাত্রী (Bride)' : 'Bride'}</span>
            </button>

            <button
              type="button"
              onClick={() => setGender('male')}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition border flex items-center justify-center gap-2 ${
                gender === 'male'
                  ? 'bg-rose-700 text-white border-rose-700 shadow-md shadow-rose-700/20'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50/50'
              }`}
            >
              <span className="text-base">👳</span>
              <span>{lang === 'bn' ? 'বর / পাত্র (Groom)' : 'Groom'}</span>
            </button>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Age Range */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {lang === 'bn' ? 'বয়স পরিসীমা (Age)' : 'Age Range'}
            </label>
            <div className="flex items-center gap-2">
              <select
                value={ageMin}
                onChange={e => setAgeMin(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {[18, 20, 22, 24, 26, 28, 30, 32, 35, 40].map(a => (
                  <option key={a} value={a}>{a} {lang === 'bn' ? 'বছর' : 'Yrs'}</option>
                ))}
              </select>
              <span className="text-xs text-slate-400 font-medium">to</span>
              <select
                value={ageMax}
                onChange={e => setAgeMax(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {[22, 25, 28, 30, 32, 35, 40, 45, 50, 60].map(a => (
                  <option key={a} value={a}>{a} {lang === 'bn' ? 'বছর' : 'Yrs'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Division */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === 'bn' ? 'বিভাগ (Division)' : 'Division'}</span>
            </label>
            <select
              value={division}
              onChange={e => {
                setDivision(e.target.value);
                setDistrict('all');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="all">{lang === 'bn' ? 'সকল বিভাগ' : 'All Divisions'}</option>
              {BANGLADESH_DIVISIONS.map(div => (
                <option key={div.id} value={div.id}>
                  {lang === 'bn' ? div.nameBn : div.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === 'bn' ? 'জেলা (District)' : 'District'}</span>
            </label>
            <select
              value={district}
              onChange={e => setDistrict(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="all">{lang === 'bn' ? 'সকল জেলা' : 'All Districts'}</option>
              {availableDistricts.map(dist => (
                <option key={dist.id} value={dist.id}>
                  {lang === 'bn' ? dist.nameBn : dist.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Profession */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === 'bn' ? 'পেশা (Profession)' : 'Profession'}</span>
            </label>
            <select
              value={profession}
              onChange={e => setProfession(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="All">{lang === 'bn' ? 'সকল পেশা' : 'All Professions'}</option>
              <option value="Doctor">Doctor / MBBS / Medical Specialist</option>
              <option value="Engineer">Software Engineer / IT Specialist</option>
              <option value="Govt">Govt. Official / BCS Cadre</option>
              <option value="Banker">Banker / Financial Officer</option>
              <option value="Teacher">Lecturer / Teacher / Academician</option>
              <option value="Business">Business Owner / Entrepreneur</option>
              <option value="Islamic">Islamic Scholar / Aalima / Daee</option>
              <option value="Expatriate">Expatriate / NRB (UK/USA/Canada)</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-rose-700 hover:bg-rose-800 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-700/25 transition flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{lang === 'bn' ? 'উপযুক্ত বায়োডাটা অনুসন্ধান করুন' : 'Search Matching Biodatas'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
