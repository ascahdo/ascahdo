import React, { useState } from 'react';
import {
  Building2, MapPin, Phone, ShieldCheck, CheckCircle2,
  Plus, Search, ChevronRight, Activity, Droplet, Star, Clock, AlertCircle
} from 'lucide-react';
import { BloodBankOrganization } from '../../types/bloodHubTypes';
import { BANGLADESH_DISTRICTS } from '../../data/bangladeshLocations';

interface MultiBloodBankHubSwitcherProps {
  organizations: BloodBankOrganization[];
  selectedOrgId: string;
  onSelectOrg: (orgId: string) => void;
  onOpenRegisterOrgModal: () => void;
  isBn: boolean;
}

export const MultiBloodBankHubSwitcher: React.FC<MultiBloodBankHubSwitcherProps> = ({
  organizations,
  selectedOrgId,
  onSelectOrg,
  onOpenRegisterOrgModal,
  isBn
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('all');

  const selectedOrg = organizations.find((o) => o.id === selectedOrgId);

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDivision =
      selectedDivision === 'all' ||
      org.division.toLowerCase() === selectedDivision.toLowerCase();

    return matchesSearch && matchesDivision;
  });

  const totalStockAcrossAll = organizations.reduce(
    (sum, o) => sum + (o.activeStockUnits || 0),
    0
  );
  const totalDonorsAcrossAll = organizations.reduce(
    (sum, o) => sum + (o.totalDonors || 0),
    0
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {isBn ? 'মাল্টি-টেন্যান্ট ব্লাড ব্যাংক হাব' : 'Multi-Tenant Blood Hub'}
                </span>
                <span className="text-xs text-slate-400">
                  {isBn ? 'জাতীয় রক্ত সঞ্চালন ও সমন্বয় নেটওয়ার্ক' : 'National Blood Transfusion & Coordination Network'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                {selectedOrgId === 'all'
                  ? isBn
                    ? 'সর্বদলীয় জাতীয় ব্লাড ব্যাংক হাব (সারা বাংলাদেশ)'
                    : 'National Blood Bank Hub (All Bangladesh)'
                  : isBn
                  ? selectedOrg?.nameBn || selectedOrg?.name
                  : selectedOrg?.name}
              </h2>
            </div>
          </div>

          {/* Quick Hub Stats & Add Bank Button */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="hidden sm:flex items-center gap-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs">
              <div>
                <p className="text-slate-400">{isBn ? 'সংযুক্ত ব্যাংক' : 'Connected Banks'}</p>
                <p className="text-base font-bold text-white">{organizations.length} টি</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <p className="text-slate-400">{isBn ? 'মোট রক্ত স্টক' : 'Total Stock'}</p>
                <p className="text-base font-bold text-rose-400">{totalStockAcrossAll} ব্যাগ</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <p className="text-slate-400">{isBn ? 'নিবন্ধিত ডোনার' : 'Active Donors'}</p>
                <p className="text-base font-bold text-emerald-400">{(totalDonorsAcrossAll || 0).toLocaleString()}</p>
              </div>
            </div>

            <button
              onClick={onOpenRegisterOrgModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition shadow-md hover:shadow-rose-600/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? 'নতুন ব্লাড ব্যাংক যুক্ত করুন' : 'Register New Blood Bank'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Hub Switcher Bar */}
      <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* All Hubs Toggle Pill */}
          <button
            onClick={() => onSelectOrg('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 flex items-center gap-2 ${
              selectedOrgId === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Activity className="w-4 h-4 text-rose-500" />
            <span>{isBn ? 'সব ব্লাড ব্যাংক (সেন্ট্রাল ভিউ)' : 'All Blood Banks (Central)'}</span>
          </button>

          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={
                isBn
                  ? 'ব্লাড ব্যাংকের নাম, জেলা বা কোড দিয়ে খুঁজুন...'
                  : 'Search by blood bank name, district or code...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
            />
          </div>

          {/* Division Filter */}
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="w-full md:w-44 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          >
            <option value="all">{isBn ? 'সব বিভাগ (All Divisions)' : 'All Divisions'}</option>
            <option value="Dhaka">Dhaka (ঢাকা)</option>
            <option value="Chattogram">Chattogram (চট্টগ্রাম)</option>
            <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
            <option value="Sylhet">Sylhet (সিলেট)</option>
            <option value="Khulna">Khulna (খুলনা)</option>
            <option value="Barishal">Barishal (বরিশাল)</option>
            <option value="Rangpur">Rangpur (রংপুর)</option>
            <option value="Mymensingh">Mymensingh (ময়মনসিংহ)</option>
          </select>
        </div>
      </div>

      {/* Horizontal Scroller / Grid of Blood Banks */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredOrgs.map((org) => {
            const isSelected = selectedOrgId === org.id;
            return (
              <div
                key={org.id}
                onClick={() => onSelectOrg(org.id)}
                className={`group relative p-4 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-rose-50/60 border-rose-400 ring-2 ring-rose-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {org.code}
                      </span>
                      {org.is24x7 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> 24/7
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="hidden sm:inline">{isBn ? 'সক্রিয় ভিউ' : 'Active'}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-rose-600 transition leading-snug">
                    {isBn ? org.nameBn || org.name : org.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{org.address || `${org.upazila}, ${org.district}`}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-slate-400">{isBn ? 'স্টক: ' : 'Stock: '}</span>
                      <span className="font-bold text-rose-600">{org.activeStockUnits || 0} ব্যাগ</span>
                    </div>
                    <div>
                      <span className="text-slate-400">{isBn ? 'ডোনার: ' : 'Donors: '}</span>
                      <span className="font-semibold text-slate-700">{org.totalDonors || 0}</span>
                    </div>
                  </div>

                  <a
                    href={`tel:${org.emergencyHotline || org.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-rose-600 font-medium transition"
                  >
                    <Phone className="w-3 h-3 text-rose-500" />
                    <span>{org.emergencyHotline || org.phone}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
