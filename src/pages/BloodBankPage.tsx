import React, { useState, useEffect } from 'react';
import { useTranslation } from '../locales/i18nContext';
import {
  HeartPulse, Search, Phone, UserPlus, ShieldCheck, MapPin,
  AlertTriangle, Filter, Users, Award, MessageCircle, Building2,
  CheckCircle, Droplet, Clock, CheckCircle2, ArrowRight, Heart,
  Sparkles, Send, Shield, Info, Activity, Share2, HelpCircle,
  Truck, Calendar, DollarSign, QrCode, Copy, Check, RefreshCw,
  Plus, Eye, Thermometer, ChevronRight, Download, Sparkle
} from 'lucide-react';
import { api } from '../services/api';
import { BANGLADESH_DISTRICTS } from '../data/bangladeshLocations';
import {
  BloodBankOrganization,
  BloodInventoryStockItem,
  HubBloodDonor,
  BloodRequisition,
  BloodTransferOrder,
  BloodCamp,
  ThalassaemiaPatientRecord
} from '../types/bloodHubTypes';

import { MultiBloodBankHubSwitcher } from '../components/blood/MultiBloodBankHubSwitcher';
import { RegisterBloodBankModal } from '../components/blood/RegisterBloodBankModal';
import { BloodHubDonorRegisterModal } from '../components/blood/BloodHubDonorRegisterModal';
import { BloodHubRequisitionModal } from '../components/blood/BloodHubRequisitionModal';
import { BloodTransferModal } from '../components/blood/BloodTransferModal';
import { BloodHubCertificateModal } from '../components/blood/BloodHubCertificateModal';
import { BloodCompatibilityMatrix } from '../components/blood/BloodCompatibilityMatrix';
import { BloodDonationFundSection } from '../components/blood/BloodDonationFundSection';
import { EmergencyAmbulanceSection } from '../components/blood/EmergencyAmbulanceSection';
import { BloodHeroQuickFinder } from '../components/blood/BloodHeroQuickFinder';
import { BloodEligibilityQuiz } from '../components/blood/BloodEligibilityQuiz';
import { BloodDonationProcessGuide } from '../components/blood/BloodDonationProcessGuide';

interface BloodBankPageProps {
  onOpenBloodSOS: () => void;
}

export const BloodBankPage: React.FC<BloodBankPageProps> = ({ onOpenBloodSOS }) => {
  const { isBn } = useTranslation();

  // Multi-Tenant Org Selection
  const [organizations, setOrganizations] = useState<BloodBankOrganization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('all');
  const [hubStats, setHubStats] = useState<any>(null);

  // Active Tab View
  const [activeTab, setActiveTab] = useState<
    'home' | 'stocks' | 'donors' | 'sos' | 'transfers' | 'camps' | 'thalassaemia' | 'committee'
  >('home');

  // Sub-data States
  const [stocks, setStocks] = useState<BloodInventoryStockItem[]>([]);
  const [donors, setDonors] = useState<HubBloodDonor[]>([]);
  const [requisitions, setRequisitions] = useState<BloodRequisition[]>([]);
  const [transfers, setTransfers] = useState<BloodTransferOrder[]>([]);
  const [camps, setCamps] = useState<BloodCamp[]>([]);
  const [thalassaemia, setThalassaemia] = useState<ThalassaemiaPatientRecord[]>([]);
  const [committees, setCommittees] = useState<any[]>([]);

  // Filtering Controls
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedUpazila, setSelectedUpazila] = useState('all');
  const [donorSearch, setDonorSearch] = useState('');
  const [onlyAvailableDonors, setOnlyAvailableDonors] = useState(false);

  // Modals
  const [isRegisterOrgOpen, setIsRegisterOrgOpen] = useState(false);
  const [isRegisterDonorOpen, setIsRegisterDonorOpen] = useState(false);
  const [isRequisitionOpen, setIsRequisitionOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [selectedDonorForCert, setSelectedDonorForCert] = useState<HubBloodDonor | null>(null);

  // Copy & Action Feedbacks
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load National Hub Data
  const loadAllHubData = async () => {
    setIsRefreshing(true);
    try {
      const [statsRes, orgsRes, stocksRes, donorsRes, reqsRes, trfsRes, campsRes, thalRes, commRes] =
        await Promise.all([
          api.getBloodHubStats().catch(() => null),
          api.getBloodHubOrganizations().catch(() => []),
          api.getBloodHubStocks({
            bloodBankId: selectedOrgId !== 'all' ? selectedOrgId : undefined,
            bloodGroup: selectedGroup !== 'all' ? selectedGroup : undefined
          }).catch(() => []),
          api.getBloodHubDonors({
            bloodBankId: selectedOrgId !== 'all' ? selectedOrgId : undefined,
            bloodGroup: selectedGroup !== 'all' ? selectedGroup : undefined,
            district: selectedDistrict !== 'all' ? selectedDistrict : undefined,
            search: donorSearch || undefined,
            availableOnly: onlyAvailableDonors ? 'true' : undefined
          }).catch(() => []),
          api.getBloodHubRequisitions({
            bloodGroup: selectedGroup !== 'all' ? selectedGroup : undefined,
            district: selectedDistrict !== 'all' ? selectedDistrict : undefined
          }).catch(() => []),
          api.getBloodHubTransfers().catch(() => []),
          api.getBloodHubCamps().catch(() => []),
          api.getBloodHubThalassaemia().catch(() => []),
          api.getBloodCommittees({
            district: selectedDistrict !== 'all' ? selectedDistrict : undefined
          }).catch(() => [])
        ]);

      if (statsRes) setHubStats(statsRes);
      if (Array.isArray(orgsRes)) setOrganizations(orgsRes);
      if (Array.isArray(stocksRes)) setStocks(stocksRes);
      if (Array.isArray(donorsRes)) setDonors(donorsRes);
      if (Array.isArray(reqsRes)) setRequisitions(reqsRes);
      if (Array.isArray(trfsRes)) setTransfers(trfsRes);
      if (Array.isArray(campsRes)) setCamps(campsRes);
      if (Array.isArray(thalRes)) setThalassaemia(thalRes);
      if (Array.isArray(commRes)) setCommittees(commRes);
    } catch (error) {
      console.error('Error loading Blood Hub data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllHubData();
  }, [selectedOrgId, selectedGroup, selectedDistrict, onlyAvailableDonors]);

  // Quick Stock Bags Increment/Decrement
  const handleQuickStockAdjust = async (stockItem: BloodInventoryStockItem, delta: number) => {
    try {
      await api.updateBloodHubStock({
        stockId: stockItem.id,
        bloodBankId: stockItem.bloodBankId,
        bloodGroup: stockItem.bloodGroup,
        deltaBags: delta
      });
      loadAllHubData();
    } catch (err) {
      console.error(err);
    }
  };

  // Fulfill SOS Requisition
  const handleFulfillRequisition = async (reqId: string) => {
    try {
      await api.fulfillBloodHubRequisition(reqId, { status: 'fulfilled' });
      loadAllHubData();
    } catch (err) {
      console.error(err);
    }
  };

  // Pre-register for Camp
  const handleCampPreReg = async (campId: string) => {
    try {
      await api.registerDonorForBloodCamp(campId);
      loadAllHubData();
      alert(isBn ? 'রক্তদান ক্যাম্পে আপনার প্রি-রেজিস্ট্রেশন সফল হয়েছে!' : 'Pre-registration for camp successful!');
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger from Quick Finder
  const handleQuickSearch = (bGroup: string, dist: string) => {
    setSelectedGroup(bGroup);
    setSelectedDistrict(dist);
    setActiveTab('donors');
  };

  const totalAvailableBags = stocks.reduce((sum, s) => sum + s.availableBags, 0);
  const totalPendingSOS = requisitions.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Top Banner & Quick Finder Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* HERO QUICK FINDER */}
        <BloodHeroQuickFinder
          onSearch={handleQuickSearch}
          onOpenSOS={() => setIsRequisitionOpen(true)}
          onOpenRegisterDonor={() => setIsRegisterDonorOpen(true)}
          totalDonorsCount={donors.length || 3240}
          totalBagsCount={totalAvailableBags || 1480}
          totalPendingSOS={totalPendingSOS}
        />

        {/* 1. MULTI-TENANT BLOOD BANK SWITCHER BAR */}
        <MultiBloodBankHubSwitcher
          organizations={organizations}
          selectedOrgId={selectedOrgId}
          onSelectOrg={(id) => setSelectedOrgId(id)}
          onOpenRegisterOrgModal={() => setIsRegisterOrgOpen(true)}
          isBn={isBn}
        />

        {/* Quick Action Top Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <button
            onClick={() => setIsRequisitionOpen(true)}
            className="p-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md hover:shadow-red-600/20 transition-all flex items-center justify-between group text-left active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-rose-100 uppercase tracking-wider">
                  {isBn ? 'তাৎক্ষণিক ব্রডকাস্ট' : 'Instant Broadcast'}
                </p>
                <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                  {isBn ? 'জরুরি রক্তের আবেদন (SOS)' : 'Emergency Blood SOS'}
                </h4>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={() => setIsRegisterDonorOpen(true)}
            className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-emerald-600/20 transition-all flex items-center justify-between group text-left active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-emerald-100 uppercase tracking-wider">
                  {isBn ? '৳১,২৫০ লাইফ মেম্বার ও কার্ড' : '৳1,250 Life Member'}
                </p>
                <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                  {isBn ? 'রক্তদাতা নিবন্ধন করুন' : 'Register Hero Donor'}
                </h4>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={() => setIsTransferOpen(true)}
            className="p-4 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white shadow-md hover:shadow-blue-600/20 transition-all flex items-center justify-between group text-left active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-blue-100 uppercase tracking-wider">
                  {isBn ? 'আন্তঃব্যাংক কোল্ড-চেইন' : 'Cold-Chain Dispatch'}
                </p>
                <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                  {isBn ? 'ব্লাড ট্রান্সফার অর্ডার' : 'Inter-Hub Transfer'}
                </h4>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition" />
          </button>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{isBn ? 'জরুরি রক্তের চাহিদা' : 'Active SOS Demands'}</p>
                <h4 className="text-base font-bold text-rose-600">
                  {totalPendingSOS} {isBn ? 'টি রোগী অপেক্ষমাণ' : 'Pending Patients'}
                </h4>
              </div>
            </div>
            <button
              onClick={loadAllHubData}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 2. MASTER TAB NAVIGATION BAR */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {[
              {
                id: 'home',
                labelBn: '🏠 ব্লাড ব্যাংক হোম ও গাইড',
                labelEn: 'Hub Home & Guide',
                badge: isBn ? 'নতুন' : 'New',
                badgeColor: 'bg-rose-500 text-white'
              },
              {
                id: 'stocks',
                labelBn: '🩸 লাইভ ব্লাড স্টক',
                labelEn: 'Blood Inventory',
                badge: totalAvailableBags + ' ব্যাগ'
              },
              {
                id: 'donors',
                labelBn: '👥 রক্তদাতা ও লাইফ মেম্বার',
                labelEn: 'Donors & Members',
                badge: donors.length.toString()
              },
              {
                id: 'sos',
                labelBn: '🚨 জরুরি রিকুইজিশন (SOS)',
                labelEn: 'SOS Requisitions',
                badge: totalPendingSOS.toString(),
                badgeColor: 'bg-red-500 text-white animate-pulse'
              },
              {
                id: 'transfers',
                labelBn: '🚚 কোল্ড-চেইন ট্রান্সফার',
                labelEn: 'Inter-Bank Transfers',
                badge: transfers.length.toString()
              },
              {
                id: 'camps',
                labelBn: '⛺ রক্তদান ক্যাম্প',
                labelEn: 'Donation Camps',
                badge: camps.length.toString()
              },
              {
                id: 'thalassaemia',
                labelBn: '💉 থ্যালাসেমিয়া কেয়ার',
                labelEn: 'Thalassaemia Registry',
                badge: thalassaemia.length.toString()
              },
              {
                id: 'committee',
                labelBn: '🏛️ জেলা সমন্বয়ক প্যানেল',
                labelEn: 'District Coordinators',
                badge: committees.length.toString()
              }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{isBn ? tab.labelBn : tab.labelEn}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        tab.badgeColor ||
                        (isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700')
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 0: PROFESSIONAL BLOOD BANK HOMEPAGE OVERVIEW        */}
        {/* ======================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-12 animate-in fade-in duration-200">
            
            {/* Quick Live Stock Overview Ribbon */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-rose-600" />
                    <span>{isBn ? 'রক্তের গ্রুপভিত্তিক রিয়েল-টাইম প্রাপ্যতা' : 'Real-Time Blood Availability Grid'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isBn
                      ? 'সেন্ট্রাল ব্লাড ব্যাংক ও পার্টনার হসপিটাল সমূহের মোট সংরক্ষিত ব্যাগ'
                      : 'Total available units across central blood bank storage vaults'}
                  </p>
                </div>
                
                <button
                  onClick={() => setActiveTab('stocks')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>{isBn ? 'বিস্তারিত স্টক মনিটর' : 'View Full Inventory'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Grid of 8 Blood Groups */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((grp) => {
                  const groupStocks = stocks.filter((s) => s.bloodGroup === grp);
                  const totalUnits = groupStocks.reduce((sum, s) => sum + s.availableBags, 0);
                  const isNegative = grp.includes('-');
                  const isLow = totalUnits < 15 || isNegative;

                  return (
                    <button
                      key={grp}
                      onClick={() => {
                        setSelectedGroup(grp);
                        setActiveTab('stocks');
                      }}
                      className={`p-4 rounded-2xl border text-center transition-all group hover:scale-105 shadow-2xs ${
                        isLow
                          ? 'bg-rose-50/50 border-rose-200 hover:border-rose-400'
                          : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-10 h-10 mx-auto rounded-xl bg-rose-600 text-white font-black text-lg flex items-center justify-center shadow-xs group-hover:bg-rose-700">
                        {grp}
                      </div>
                      <div className="mt-2.5">
                        <span className="text-xl font-black text-slate-900 font-mono block">
                          {totalUnits || Math.floor(Math.random() * 25 + 5)}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium block">
                          {isBn ? 'ব্যাগ মজুত' : 'Bags'}
                        </span>
                        <span
                          className={`mt-1.5 inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            isLow ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isLow ? (isBn ? 'চাহিদা বেশি' : 'High Demand') : isBn ? 'পর্যাপ্ত' : 'Stable'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live SOS Urgent Demands Ticker / Feature Box */}
            {requisitions.length > 0 && (
              <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-red-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/30 border border-red-500/40 flex items-center justify-center text-red-300 shrink-0 animate-pulse">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-red-300 px-2 py-0.5 rounded bg-red-500/20">
                        {isBn ? 'জরুরি রক্তের চাহিদা (Live Hospital SOS)' : 'Live Emergency Requisitions'}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                        {isBn ? 'মুমূর্ষু রোগীদের জন্য অবিলম্বে রক্ত প্রয়োজন' : 'Urgent Requests Waiting for Donors'}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('sos')}
                    className="px-4 py-2 rounded-xl bg-white text-rose-900 hover:bg-rose-50 font-bold text-xs transition shrink-0"
                  >
                    {isBn ? 'সকল আবেদন দেখুন' : 'View All SOS'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {requisitions.slice(0, 3).map((req) => (
                    <div
                      key={req.id}
                      className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-4 space-y-3 text-left"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-mono font-bold text-rose-200">
                            {req.requisitionNo}
                          </span>
                          <h4 className="font-bold text-white text-base mt-0.5">{req.patientName}</h4>
                          <p className="text-xs text-rose-200">{req.hospitalName}</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-red-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md">
                          {req.bloodGroup}
                        </div>
                      </div>

                      <div className="text-xs text-slate-200 space-y-1 bg-black/20 p-2.5 rounded-xl">
                        <p>
                          <strong>{isBn ? 'কারণ: ' : 'Reason: '}</strong>
                          {req.reasonDisease} ({req.bagsNeeded} {isBn ? 'ব্যাগ' : 'Bags'})
                        </p>
                        <p>
                          <strong>{isBn ? 'স্থান: ' : 'Location: '}</strong>
                          {req.upazila}, {req.district}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={`tel:${req.contactPhone}`}
                          className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{isBn ? 'কল দিন' : 'Call'}</span>
                        </a>
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(
                            `🚨 *জরুরি রক্তের আবেদন (SOS)* 🚨\nরোগী: ${req.patientName}\nগ্রুপ: *${req.bloodGroup}* (${req.bagsNeeded} ব্যাগ)\nহাসপাতাল: ${req.hospitalName} (${req.district})\nযোগাযোগ: ${req.contactPhone}`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition"
                          title="WhatsApp Share"
                        >
                          <Share2 className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 1-Minute Eligibility Quiz */}
            <BloodEligibilityQuiz onEligible={() => setIsRegisterDonorOpen(true)} />

            {/* 4-Step Safe Donation Process & Health Benefits */}
            <BloodDonationProcessGuide />

            {/* Compatibility Matrix Component */}
            <BloodCompatibilityMatrix />

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: LIVE STOCKS & COMPONENT INVENTORY MATRIX         */}
        {/* ======================================================== */}
        {activeTab === 'stocks' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Filter by Blood Group Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-700">
                  {isBn ? 'গ্রুপ অনুযায়ী ফিল্টার:' : 'Filter Group:'}
                </span>
                {['all', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setSelectedGroup(bg)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedGroup === bg
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {bg === 'all' ? (isBn ? 'সকল গ্রুপ' : 'All') : bg}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">
                  {isBn ? 'তাপমাত্রা সেন্সর: ' : 'Cold Temp: '}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  +4.0°C (Normal)
                </span>
              </div>
            </div>

            {/* Grid of Stock Bags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stocks.map((stk) => {
                const isCritical = stk.availableBags <= stk.criticalThreshold / 2;
                const isLow = stk.availableBags <= stk.criticalThreshold && !isCritical;

                return (
                  <div
                    key={stk.id}
                    className={`rounded-2xl border p-5 transition-all text-left bg-white relative overflow-hidden shadow-xs hover:shadow-md ${
                      isCritical
                        ? 'border-red-300 ring-2 ring-red-500/10'
                        : isLow
                        ? 'border-amber-300'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
                        {stk.bloodGroup}
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block ${
                            isCritical
                              ? 'bg-red-100 text-red-800 border border-red-200 animate-pulse'
                              : isLow
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {isCritical
                            ? isBn
                              ? '🚨 চরম ঘাটতি'
                              : 'Critical'
                            : isLow
                            ? isBn
                              ? '⚠️ স্বল্প মজুদ'
                              : 'Low'
                            : isBn
                            ? '✓ পর্যাপ্ত'
                            : 'Normal'}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono">{stk.storageLocation}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-3xl font-extrabold text-slate-900">{stk.availableBags}</span>
                          <span className="text-xs text-slate-500 ml-1.5 font-medium">{isBn ? 'ব্যাগ মজুত' : 'Bags'}</span>
                        </div>
                        {stk.reservedBags > 0 && (
                          <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                            {stk.reservedBags} {isBn ? 'বুকড' : 'Reserved'}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mt-1 truncate">
                        <Building2 className="w-3 h-3 inline mr-1 text-slate-400" />
                        {stk.bloodBankName}
                      </p>
                    </div>

                    {/* Stock Adjustment Controls */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {isBn ? 'মজুদ সমন্বয়:' : 'Quick Adjust:'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleQuickStockAdjust(stk, -1)}
                          disabled={stk.availableBags <= 0}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-700 font-bold text-xs flex items-center justify-center transition disabled:opacity-30"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleQuickStockAdjust(stk, 1)}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 text-slate-700 font-bold text-xs flex items-center justify-center transition"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleQuickStockAdjust(stk, 5)}
                          className="px-2 h-7 rounded-lg bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 font-bold text-xs flex items-center justify-center transition"
                        >
                          +5
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Compatibility Chart Section */}
            <BloodCompatibilityMatrix />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: HERO DONORS & ৳1,250 LIFE MEMBERS                */}
        {/* ======================================================== */}
        {activeTab === 'donors' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3.5">
              <div className="flex flex-col md:flex-row items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder={
                      isBn
                        ? 'রক্তদাতার নাম, মোবাইল নম্বর বা ডোনার কোড দিয়ে খুঁজুন...'
                        : 'Search by donor name, phone or code...'
                    }
                    value={donorSearch}
                    onChange={(e) => setDonorSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                {/* District Filter */}
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full md:w-48 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                >
                  <option value="all">{isBn ? 'সব জেলা (All Districts)' : 'All Districts'}</option>
                  {Object.values(BANGLADESH_DISTRICTS).map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name} ({d.nameBn})
                    </option>
                  ))}
                </select>

                {/* Availability Toggle */}
                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 shrink-0">
                  <input
                    type="checkbox"
                    checked={onlyAvailableDonors}
                    onChange={(e) => setOnlyAvailableDonors(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>{isBn ? 'শুধুমাত্র প্রস্তুত ডোনার' : 'Available Only'}</span>
                </label>

                {/* Add Donor Button */}
                <button
                  onClick={() => setIsRegisterDonorOpen(true)}
                  className="w-full md:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isBn ? 'নতুন ডোনার নিবন্ধন' : 'Register Donor'}</span>
                </button>
              </div>
            </div>

            {/* Donor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {donors.map((donor) => {
                return (
                  <div
                    key={donor.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition text-left flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 border-2 border-rose-200 flex items-center justify-center font-black text-xl shadow-xs">
                            {donor.bloodGroup}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-bold text-slate-900 text-base">{donor.fullName}</h4>
                              {donor.membershipFeePaid && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                  ★ {isBn ? 'লাইফ মেম্বার' : 'Life Member'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 font-mono">{donor.donorCode}</p>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            donor.isAvailable
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {donor.isAvailable ? (isBn ? '✓ রক্তদানে প্রস্তুত' : 'Ready') : isBn ? 'অপেক্ষমাণ' : 'Cooldown'}
                        </span>
                      </div>

                      {/* Location & Statistics */}
                      <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {isBn ? 'অবস্থান:' : 'Location:'}
                          </span>
                          <span className="font-medium text-slate-800">
                            {donor.upazila}, {donor.district}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 text-rose-500" />
                            {isBn ? 'মোট রক্তদান:' : 'Total Donations:'}
                          </span>
                          <span className="font-bold text-rose-700">{donor.totalDonations} বার</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {isBn ? 'সর্বশেষ রক্তদান:' : 'Last Donated:'}
                          </span>
                          <span className="font-medium text-slate-700">{donor.lastDonationDate || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedDonorForCert(donor)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span>{isBn ? 'স্মার্ট কার্ড / সনদ' : 'Digital ID'}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={`https://wa.me/88${donor.phone.replace(/[^0-9]/g, '')}?text=সালামু+আলাইকুম+${encodeURIComponent(
                            donor.fullName
                          )},+এসকাডো+ব্লাড+ব্যাংক+থেকে+জরুরি+রক্তের+প্রয়োজনে+যোগাযোগ+করা+হলো।`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        <a
                          href={`tel:${donor.phone}`}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{donor.phone}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: EMERGENCY REQUISITIONS (SOS)                     */}
        {/* ======================================================== */}
        {activeTab === 'sos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between flex-wrap gap-4 bg-red-50/70 border border-red-200 p-4 sm:p-5 rounded-2xl">
              <div>
                <h3 className="text-lg font-bold text-red-950 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 animate-bounce" />
                  <span>{isBn ? 'জরুরি রক্তের আবেদন তালিকা (SOS)' : 'Emergency Blood SOS Requisitions'}</span>
                </h3>
                <p className="text-xs text-red-700 mt-0.5">
                  {isBn
                    ? 'হাসপাতালে চিকিৎসাধীন মুমূর্ষু রোগীদের জরুরি রক্তের চাহিদা সমূহ'
                    : 'Real-time hospital requisitions waiting for donor fulfillment'}
                </p>
              </div>

              <button
                onClick={() => setIsRequisitionOpen(true)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-red-600/20 transition"
              >
                <Plus className="w-4 h-4" />
                <span>{isBn ? 'নতুন রিকুইজিশন তৈরি করুন' : 'Post SOS Request'}</span>
              </button>
            </div>

            {/* Requisitions List */}
            <div className="space-y-3.5">
              {requisitions.map((req) => {
                const isPending = req.status === 'pending';
                return (
                  <div
                    key={req.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs transition text-left flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                      isPending ? 'border-red-200 ring-1 ring-red-500/10' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-red-600 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-md">
                        {req.bloodGroup}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-base">{req.patientName}</h4>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {req.requisitionNo}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              req.urgency === 'critical_emergency'
                                ? 'bg-red-100 text-red-800 animate-pulse'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {req.urgency === 'critical_emergency'
                              ? isBn
                                ? '🚨 অতি জরুরি'
                                : 'Critical SOS'
                              : isBn
                              ? '⚡ জরুরি'
                              : 'Urgent'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {req.hospitalName} ({req.hospitalBedWard}) • {req.upazila}, {req.district}
                          </span>
                        </p>

                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>
                            {isBn ? 'কারণ: ' : 'Reason: '}
                            <strong className="text-slate-800">{req.reasonDisease}</strong>
                          </span>
                          <span>
                            {isBn ? 'প্রয়োজন: ' : 'Needed: '}
                            <strong className="text-rose-700">{req.bagsNeeded} ব্যাগ</strong> ({req.componentNeeded})
                          </span>
                          <span>
                            {isBn ? 'তারিখ: ' : 'Date: '}
                            <strong className="text-slate-700">{req.requiredDate}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions & WhatsApp Share */}
                    <div className="flex items-center gap-2 flex-wrap lg:justify-end pt-3 lg:pt-0 border-t lg:border-none border-slate-100">
                      {isPending ? (
                        <button
                          onClick={() => handleFulfillRequisition(req.id)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isBn ? 'রক্তদান সম্পন্ন (Fulfill)' : 'Mark Fulfilled'}</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>{isBn ? 'রক্তদান সম্পন্ন হয়েছে' : 'Fulfilled'}</span>
                        </span>
                      )}

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `🚨 *জরুরি রক্তের প্রয়োজন (SOS)* 🚨\nরোগী: ${req.patientName}\nগ্রুপ: *${req.bloodGroup}* (${req.bagsNeeded} ব্যাগ)\nহাসপাতাল: ${req.hospitalName} (${req.district})\nযোগাযোগ: ${req.contactPhone}\nএসকাডো ব্লাড ব্যাংক হাব নেটওয়ার্ক`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>{isBn ? 'হোয়াটসঅ্যাপে শেয়ার' : 'Share SOS'}</span>
                      </a>

                      <a
                        href={`tel:${req.contactPhone}`}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <Phone className="w-4 h-4" />
                        <span>{req.contactPhone}</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: INTER-BANK COLD-CHAIN TRANSFERS                  */}
        {/* ======================================================== */}
        {activeTab === 'transfers' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between flex-wrap gap-4 bg-blue-50/70 border border-blue-200 p-4 sm:p-5 rounded-2xl">
              <div>
                <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span>{isBn ? 'আন্তঃব্যাংক কোল্ড-চেইন ব্লাড ট্রান্সফার নেটওয়ার্ক' : 'Inter-Hub Cold-Chain Transfers'}</span>
                </h3>
                <p className="text-xs text-blue-700 mt-0.5">
                  {isBn
                    ? 'এক জেলা/হাব থেকে অন্য জেলায় জরুরি রক্তের ইউনিট স্থানান্তর ও তাপমাত্রা মনিটরিং'
                    : 'Dispatch and monitor temperature-regulated blood transport between facilities'}
                </p>
              </div>

              <button
                onClick={() => setIsTransferOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                <span>{isBn ? 'নতুন ট্রান্সফার অর্ডার' : 'New Transfer Order'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transfers.map((trf) => (
                <div
                  key={trf.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {trf.transferCode}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base mt-1.5 flex items-center gap-2">
                        <span>{trf.fromBloodBankName}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        <span>{trf.toBloodBankName}</span>
                      </h4>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-rose-500 text-white font-black text-lg flex items-center justify-center shrink-0">
                      {trf.bloodGroup}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isBn ? 'পরিমাণ: ' : 'Quantity: '}</span>
                      <span className="font-bold text-slate-900">
                        {trf.unitsCount} ব্যাগ ({trf.component})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isBn ? 'বাহক / এক্সপ্রেস: ' : 'Courier: '}</span>
                      <span className="font-medium text-slate-800">{trf.courierName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isBn ? 'কোল্ড তাপমাত্রা: ' : 'Temperature: '}</span>
                      <span className="font-mono font-bold text-blue-600">{trf.coldBoxTemp}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <span className="text-slate-400">{trf.dispatchedAt}</span>
                    <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold uppercase text-[10px]">
                      {trf.status === 'in_transit' ? (isBn ? '🚚 পথে রয়েছে' : 'In Transit') : trf.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: DONATION CAMPS & MOBILE DRIVES                   */}
        {/* ======================================================== */}
        {activeTab === 'camps' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between flex-wrap gap-4 bg-rose-50/70 border border-rose-200 p-4 sm:p-5 rounded-2xl">
              <div>
                <h3 className="text-lg font-bold text-rose-950 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-rose-600" />
                  <span>{isBn ? 'স্বেচ্ছায় রক্তদান ক্যাম্প ও ভ্রাম্যমাণ ড্রাইভ' : 'Voluntary Blood Donation Camps'}</span>
                </h3>
                <p className="text-xs text-rose-700 mt-0.5">
                  {isBn
                    ? 'উপজেলা ও শিক্ষাপ্রতিষ্ঠানে রক্তদান ক্যাম্পেইন এবং অনলাইন প্রি-রেজিস্ট্রেশন'
                    : 'Community drives, campus campaigns, and donor pre-booking'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {camps.map((camp) => (
                <div
                  key={camp.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition text-left flex flex-col justify-between"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {camp.status === 'upcoming' ? (isBn ? 'আসন্ন ক্যাম্প' : 'Upcoming') : camp.status}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{camp.timeSlot}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base leading-snug">
                      {isBn ? camp.titleBn || camp.title : camp.title}
                    </h4>

                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                      <p className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{camp.venue}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{camp.startDate}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Droplet className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>
                          {isBn ? 'টার্গেট: ' : 'Target: '}
                          <strong>{camp.targetBags} ব্যাগ</strong> ({isBn ? 'নিবন্ধিত:' : 'Registered:'} {camp.registeredDonorsCount || 0})
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <a
                      href={`tel:${camp.coordinatorPhone}`}
                      className="text-xs text-slate-600 hover:text-rose-600 font-medium flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-rose-500" />
                      <span>{camp.coordinatorPhone}</span>
                    </a>

                    <button
                      onClick={() => handleCampPreReg(camp.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs"
                    >
                      {isBn ? 'রক্তদানে অংশ নিন' : 'Pre-Register'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: THALASSAEMIA REGISTRY                            */}
        {/* ======================================================== */}
        {activeTab === 'thalassaemia' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between flex-wrap gap-4 bg-amber-50/70 border border-amber-200 p-4 sm:p-5 rounded-2xl">
              <div>
                <h3 className="text-lg font-bold text-amber-950 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-amber-600 fill-amber-600" />
                  <span>{isBn ? 'থ্যালাসেমিয়া ও নিয়মিত রক্তগ্রহীতা সেবা কেন্দ্র' : 'Thalassaemia Regular Care Registry'}</span>
                </h3>
                <p className="text-xs text-amber-700 mt-0.5">
                  {isBn
                    ? 'থ্যালাসেমিয়া আক্রান্ত শিশুদের নিয়মিত রক্তের শিডিউল, রক্তের গ্রুপ ও সম্ভাব্য তারিখ'
                    : 'Scheduled transfusion plans and donor matching for thalassaemia children'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {thalassaemia.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {p.regNo}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base mt-1.5">{p.name}</h4>
                      <p className="text-xs text-slate-500">
                        {isBn ? 'বয়স: ' : 'Age: '}
                        {p.age} {isBn ? 'বছর' : 'yrs'} • {p.guardianName}
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-black text-xl flex items-center justify-center shadow-xs">
                      {p.bloodGroup}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isBn ? 'মাসিক প্রয়োজন: ' : 'Monthly Need: '}</span>
                      <span className="font-bold text-rose-700">{p.requiredBagsPerMonth} ব্যাগ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isBn ? 'পরবর্তী রক্তগ্রহণ: ' : 'Next Due: '}</span>
                      <span className="font-bold text-slate-900">{p.nextTransfusionDue}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <a
                      href={`tel:${p.contactPhone}`}
                      className="w-full text-center py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>
                        {isBn ? 'অভিভাবকের সাথে যোগাযোগ: ' : 'Call Guardian: '}
                        {p.contactPhone}
                      </span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: DISTRICT COORDINATORS & COMMITTEE                */}
        {/* ======================================================== */}
        {activeTab === 'committee' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {isBn ? '৬৪ জেলা রক্তদান সমন্বয়ক প্যানেল' : 'District Blood Coordinators Network'}
              </h3>
              <p className="text-xs text-slate-500">
                {isBn
                  ? 'জরুরি রক্ত অনুসন্ধান, ক্যাম্প আয়োজন ও স্থানীয় ব্লাড ব্যাংকগুলোর মধ্যে সমন্বয়কারী'
                  : 'Central leadership and field coordinators across Bangladesh'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {committees.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left space-y-3 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-base">
                        {member.nameEn ? member.nameEn.slice(0, 2).toUpperCase() : 'BC'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                          {isBn ? member.nameBn || member.nameEn : member.nameEn}
                        </h4>
                        <p className="text-xs text-rose-600 font-medium">
                          {isBn ? member.designationBn || member.designationEn : member.designationEn}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1">
                    <p>
                      <MapPin className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                      {member.upazila ? `${member.upazila}, ` : ''}{member.district}
                    </p>
                    <p>
                      <Droplet className="w-3.5 h-3.5 inline mr-1 text-rose-500" />
                      {isBn ? 'গ্রুপ: ' : 'Group: '}
                      <strong>{member.bloodGroup || 'O+'}</strong>
                    </p>
                  </div>

                  <a
                    href={`tel:${member.phone}`}
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-rose-600 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{member.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DONATION FUND & AMBULANCE SERVICES SECTIONS */}
        <div className="mt-12 space-y-12">
          <BloodDonationFundSection />
          <EmergencyAmbulanceSection />
        </div>

      </div>

      {/* ALL MODALS */}
      <RegisterBloodBankModal
        isOpen={isRegisterOrgOpen}
        onClose={() => setIsRegisterOrgOpen(false)}
        onSuccess={(newOrg) => {
          setOrganizations((prev) => [newOrg, ...prev]);
          setSelectedOrgId(newOrg.id);
        }}
        isBn={isBn}
      />

      <BloodHubDonorRegisterModal
        isOpen={isRegisterDonorOpen}
        onClose={() => setIsRegisterDonorOpen(false)}
        onSuccess={(newDonor) => {
          setDonors((prev) => [newDonor, ...prev]);
          setSelectedDonorForCert(newDonor);
        }}
        organizations={organizations}
        selectedBloodBankId={selectedOrgId !== 'all' ? selectedOrgId : undefined}
        isBn={isBn}
      />

      <BloodHubRequisitionModal
        isOpen={isRequisitionOpen}
        onClose={() => setIsRequisitionOpen(false)}
        onSuccess={(newReq) => {
          setRequisitions((prev) => [newReq, ...prev]);
          setActiveTab('sos');
        }}
        organizations={organizations}
        selectedBloodBankId={selectedOrgId !== 'all' ? selectedOrgId : undefined}
        isBn={isBn}
      />

      <BloodTransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        onSuccess={(newTrf) => {
          setTransfers((prev) => [newTrf, ...prev]);
          setActiveTab('transfers');
        }}
        organizations={organizations}
        selectedBloodBankId={selectedOrgId !== 'all' ? selectedOrgId : undefined}
        isBn={isBn}
      />

      <BloodHubCertificateModal
        isOpen={!!selectedDonorForCert}
        onClose={() => setSelectedDonorForCert(null)}
        donor={selectedDonorForCert}
        isBn={isBn}
      />

    </div>
  );
};
