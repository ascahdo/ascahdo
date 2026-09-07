import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../locales/i18nContext';
import { useAuth } from '../context/AuthContext';
import {
  Building2, Users, MapPin, Phone, Mail, CheckCircle2,
  Search, Filter, PlusCircle, ShieldCheck, Calendar,
  Award, FileText, ChevronRight, User, AlertCircle, X,
  ExternalLink, Sparkles, Printer, ArrowRight, Grid, List,
  Share2, Check, Download, Layers, Shield, QrCode, IdCard,
  CreditCard, SearchCheck, CheckCheck
} from 'lucide-react';
import { api } from '../services/api';
import { Branch, BranchCommitteeMember, CommitteeLevel } from '../types';
import {
  BANGLADESH_DIVISIONS,
  BANGLADESH_DISTRICTS,
  COMMITTEE_LEVELS,
  STANDARD_COMMITTEE_DESIGNATIONS,
  getDistrictsByDivision,
  getUpazilasByDistrictKey,
  getUnionsByUpazilaName
} from '../data/bangladeshLocations';
import {
  enrichBranchCommitteeMembers,
  searchCommitteeMembers,
  EnrichedCommitteeMember,
  generateMemberId,
  generateSuggestionNumber,
  COMMITTEE_MEMBER_DONATION_FEE,
  generateDonationReceiptNo,
  generateMemberTrxId
} from '../utils/committeeMemberUtils';
import { CommitteeMemberIdCardModal } from '../components/branches/CommitteeMemberIdCardModal';
import { MemberPhotoUpload } from '../components/branches/MemberPhotoUpload';
import { MembershipTermsAndOath } from '../components/branches/MembershipTermsAndOath';
import { IndividualMemberApplicationModal } from '../components/branches/IndividualMemberApplicationModal';

interface BranchesPageProps {
  onNavigate?: (view: string) => void;
}

export const BranchesPage: React.FC<BranchesPageProps> = ({ onNavigate }) => {
  const { t, isBn } = useTranslation();
  const { user } = useAuth();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [isMemberApplyModalOpen, setIsMemberApplyModalOpen] = useState<boolean>(false);
  const [branchAgreedTerms, setBranchAgreedTerms] = useState<boolean>(true);
  const [branchAgreedOath, setBranchAgreedOath] = useState<boolean>(true);
  const [memberSearchTerm, setMemberSearchTerm] = useState<string>('');
  const [submittedSuccessData, setSubmittedSuccessData] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  // Suggestion Number Search & Member ID Card State
  const [suggestionSearchInput, setSuggestionSearchInput] = useState<string>('');
  const [selectedCardMember, setSelectedCardMember] = useState<EnrichedCommitteeMember | null>(null);
  const [isCardSearchFocused, setIsCardSearchFocused] = useState<boolean>(false);

  // Application Form State
  const [applicationData, setApplicationData] = useState<{
    name: string;
    nameBn: string;
    organizationName: string;
    committeeLevel: CommitteeLevel;
    division: string;
    divisionBn: string;
    district: string;
    districtBn: string;
    upazila: string;
    upazilaBn: string;
    union: string;
    unionBn: string;
    address: string;
    managerName: string;
    managerPhone: string;
    managerEmail: string;
    committeeTitle: string;
    committeeTerm: string;
    committeeMembers: {
      memberId?: string;
      suggestionNumber?: string;
      name: string;
      nameBn: string;
      fatherName: string;
      fatherNameBn: string;
      designation: string;
      designationBn: string;
      address: string;
      addressBn: string;
      phone: string;
      photoUrl: string;
      nid: string;
      bloodGroup?: string;
    }[];
  }>({
    name: '',
    nameBn: '',
    organizationName: 'ASCADO Central Welfare Trust',
    committeeLevel: 'district',
    division: 'dhaka',
    divisionBn: 'ঢাকা',
    district: 'Dhaka',
    districtBn: 'ঢাকা',
    upazila: 'Savar',
    upazilaBn: 'সাভার',
    union: 'Savar Union',
    unionBn: 'সাভার সদর ইউনিয়ন',
    address: '',
    managerName: '',
    managerPhone: '',
    managerEmail: '',
    committeeTitle: 'শাখা দ্বি-বার্ষিক কার্যনির্বাহী পরিচালনা পরিষদ',
    committeeTerm: '২০২৬-২০২৮ মেয়াদ',
    committeeMembers: [
      {
        memberId: 'ASC-DIST-DHK-01',
        suggestionNumber: 'SUG-716701',
        name: '',
        nameBn: '',
        fatherName: '',
        fatherNameBn: '',
        designation: 'President',
        designationBn: 'সভাপতি',
        address: '',
        addressBn: '',
        phone: '',
        bloodGroup: 'A+',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        nid: ''
      },
      {
        memberId: 'ASC-DIST-DHK-02',
        suggestionNumber: 'SUG-716702',
        name: '',
        nameBn: '',
        fatherName: '',
        fatherNameBn: '',
        designation: 'General Secretary',
        designationBn: 'সাধারণ সম্পাদক',
        address: '',
        addressBn: '',
        phone: '',
        bloodGroup: 'B+',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
        nid: ''
      },
      {
        memberId: 'ASC-DIST-DHK-03',
        suggestionNumber: 'SUG-716703',
        name: '',
        nameBn: '',
        fatherName: '',
        fatherNameBn: '',
        designation: 'Treasurer',
        designationBn: 'কোষাধ্যক্ষ / অর্থ সম্পাদক',
        address: '',
        addressBn: '',
        phone: '',
        bloodGroup: 'O+',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
        nid: ''
      }
    ]
  });

  const [newMemberInput, setNewMemberInput] = useState({
    name: '',
    nameBn: '',
    fatherName: '',
    fatherNameBn: '',
    designation: 'Executive Member',
    designationBn: 'কার্যনির্বাহী সদস্য',
    address: '',
    addressBn: '',
    phone: '',
    bloodGroup: 'O+',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
    nid: ''
  });

  const loadBranches = async () => {
    setIsLoading(true);
    try {
      const data = await api.getBranches();
      if (Array.isArray(data)) {
        // Enrich branches with auto Member ID, Suggestion Number & QR data
        const { enrichedBranches } = enrichBranchCommitteeMembers(data);
        setBranches(enrichedBranches);
        if (enrichedBranches.length > 0 && !selectedBranchId) {
          const activeFirst = enrichedBranches.find((b: Branch) => b.status === 'active') || enrichedBranches[0];
          setSelectedBranchId(activeFirst.id);
        }
      }
    } catch (err) {
      console.error('Failed to load branches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  // Compute all enriched members across all branches for global suggestion searching
  const { allEnrichedMembers, enrichedBranches } = useMemo(() => {
    return enrichBranchCommitteeMembers(branches);
  }, [branches]);

  // Live Suggestion / Member ID search results
  const suggestionSearchResults = useMemo(() => {
    if (!suggestionSearchInput.trim()) return [];
    return searchCommitteeMembers(suggestionSearchInput, allEnrichedMembers);
  }, [suggestionSearchInput, allEnrichedMembers]);

  // When division changes, reset district & upazila filters
  const handleDivisionChange = (divId: string) => {
    setSelectedDivision(divId);
    setSelectedDistrict('all');
    setSelectedUpazila('all');
  };

  // When district changes, reset upazila filter
  const handleDistrictChange = (distName: string) => {
    setSelectedDistrict(distName);
    setSelectedUpazila('all');
  };

  // Derived filtered branches based on level, division, district, upazila, and search query
  const filteredBranches = (branches || []).filter((branch) => {
    if (!branch) return false;
    // 1. Level Filter
    if (selectedLevel !== 'all') {
      const branchLevel = branch.committeeLevel || 'district';
      if (branchLevel.toLowerCase() !== selectedLevel.toLowerCase()) {
        return false;
      }
    }

    // 2. Division Filter
    if (selectedDivision !== 'all') {
      const divMatch = (branch.division || '').toLowerCase() === selectedDivision.toLowerCase();
      if (!divMatch) return false;
    }

    // 3. District Filter
    if (selectedDistrict !== 'all') {
      const distMatch = (branch.district || '').toLowerCase() === selectedDistrict.toLowerCase();
      if (!distMatch) return false;
    }

    // 4. Upazila Filter
    if (selectedUpazila !== 'all') {
      const upzMatch = (branch.upazila || '').toLowerCase() === selectedUpazila.toLowerCase();
      if (!upzMatch) return false;
    }

    // 5. Search Query Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matches =
        (branch.name || '').toLowerCase().includes(q) ||
        (branch.nameBn || '').toLowerCase().includes(q) ||
        (branch.branchCode || '').toLowerCase().includes(q) ||
        (branch.district || '').toLowerCase().includes(q) ||
        (branch.districtBn || '').toLowerCase().includes(q) ||
        (branch.upazila || '').toLowerCase().includes(q) ||
        (branch.upazilaBn || '').toLowerCase().includes(q) ||
        (branch.union || '').toLowerCase().includes(q) ||
        (branch.unionBn || '').toLowerCase().includes(q) ||
        (branch.division || '').toLowerCase().includes(q) ||
        (branch.managerName || '').toLowerCase().includes(q) ||
        (branch.committeeMembers || []).some(
          (m) =>
            (m.name || '').toLowerCase().includes(q) ||
            (m.nameBn || '').toLowerCase().includes(q) ||
            (m.designationBn || '').toLowerCase().includes(q) ||
            (m.fatherNameBn || '').toLowerCase().includes(q) ||
            (m.memberId || '').toLowerCase().includes(q) ||
            (m.suggestionNumber || '').toLowerCase().includes(q) ||
            (m.phone || '').includes(q)
        );
      if (!matches) return false;
    }

    return true;
  });

  const selectedBranch = branches.find((b) => b.id === selectedBranchId) || filteredBranches[0] || branches[0];

  // Filter committee members within selected branch
  const filteredMembers = (selectedBranch?.committeeMembers || []).filter((mem) => {
    if (!memberSearchTerm) return true;
    const q = memberSearchTerm.toLowerCase();
    return (
      (mem.name || '').toLowerCase().includes(q) ||
      (mem.nameBn || '').toLowerCase().includes(q) ||
      (mem.fatherName || '').toLowerCase().includes(q) ||
      (mem.fatherNameBn || '').toLowerCase().includes(q) ||
      (mem.designation || '').toLowerCase().includes(q) ||
      (mem.designationBn || '').toLowerCase().includes(q) ||
      (mem.memberId || '').toLowerCase().includes(q) ||
      (mem.suggestionNumber || '').toLowerCase().includes(q) ||
      (mem.address || '').toLowerCase().includes(q) ||
      (mem.addressBn || '').toLowerCase().includes(q) ||
      (mem.phone || '').toLowerCase().includes(q)
    );
  });

  // Badge coloring for Committee Level
  const getLevelBadge = (lvl?: CommitteeLevel | string) => {
    const l = (lvl || 'district').toLowerCase();
    switch (l) {
      case 'division':
        return {
          label: isBn ? 'বিভাগীয় কমিটি' : 'Division Committee',
          badge: 'bg-purple-100 text-purple-900 border-purple-300 font-black',
          icon: '🏛️'
        };
      case 'district':
        return {
          label: isBn ? 'জেলা কমিটি' : 'District Committee',
          badge: 'bg-blue-100 text-blue-900 border-blue-300 font-bold',
          icon: '🏢'
        };
      case 'upazila':
        return {
          label: isBn ? 'উপজেলা / থানা কমিটি' : 'Upazila Committee',
          badge: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
          icon: '🏬'
        };
      case 'union':
        return {
          label: isBn ? 'ইউনিয়ন / ওয়ার্ড কমিটি' : 'Union Committee',
          badge: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
          icon: '🏘️'
        };
      default:
        return {
          label: isBn ? 'শাখা কমিটি' : 'Branch Committee',
          badge: 'bg-slate-100 text-slate-900 border-slate-300 font-medium',
          icon: '📍'
        };
    }
  };

  // Badge coloring for designations
  const getDesignationBadgeClass = (desig: string = '') => {
    const lower = (desig || '').toLowerCase();
    if (lower.includes('president') || lower.includes('সভাপতি') || lower.includes('আহ্বায়ক') || lower.includes('প্রধান')) {
      return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold';
    }
    if (lower.includes('secretary') || lower.includes('সাধারণ সম্পাদক') || lower.includes('সদস্য সচিব')) {
      return 'bg-blue-100 text-blue-900 border-blue-300 font-bold';
    }
    if (lower.includes('treasurer') || lower.includes('অর্থ') || lower.includes('কোষাধ্যক্ষ') || lower.includes('ক্যাশিয়ার')) {
      return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
    }
    if (lower.includes('vice') || lower.includes('সহ-সভাপতি') || lower.includes('যুগ্ম')) {
      return 'bg-teal-100 text-teal-900 border-teal-300 font-semibold';
    }
    if (lower.includes('সাংগঠনিক') || lower.includes('দপ্তর') || lower.includes('প্রচার')) {
      return 'bg-indigo-100 text-indigo-900 border-indigo-300 font-semibold';
    }
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const handleAddMemberToApplication = () => {
    if (!newMemberInput.name && !newMemberInput.nameBn) {
      alert(isBn ? 'সদস্যের নাম প্রদান করুন।' : 'Please enter member name.');
      return;
    }
    if (!newMemberInput.fatherName && !newMemberInput.fatherNameBn) {
      alert(isBn ? 'সদস্যের পিতার নাম প্রদান করুন।' : "Please enter father's name.");
      return;
    }

    setApplicationData({
      ...applicationData,
      committeeMembers: [
        ...applicationData.committeeMembers,
        {
          ...newMemberInput,
          name: newMemberInput.name || newMemberInput.nameBn,
          nameBn: newMemberInput.nameBn || newMemberInput.name,
          fatherName: newMemberInput.fatherName || newMemberInput.fatherNameBn,
          fatherNameBn: newMemberInput.fatherNameBn || newMemberInput.fatherName,
          address: newMemberInput.address || newMemberInput.addressBn,
          addressBn: newMemberInput.addressBn || newMemberInput.address
        }
      ]
    });

    setNewMemberInput({
      name: '',
      nameBn: '',
      fatherName: '',
      fatherNameBn: '',
      designation: 'Executive Member',
      designationBn: 'কার্যনির্বাহী সদস্য',
      address: '',
      addressBn: '',
      phone: '',
      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
      nid: ''
    });
  };

  const handleRemoveMemberFromApplication = (index: number) => {
    setApplicationData({
      ...applicationData,
      committeeMembers: applicationData.committeeMembers.filter((_, i) => i !== index)
    });
  };

  const handleSubmitBranchApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!applicationData.name && !applicationData.nameBn) {
      alert(isBn ? 'শাখার নাম প্রদান করুন।' : 'Branch name is required.');
      return;
    }

    if (applicationData.committeeMembers.length === 0) {
      alert(isBn ? 'অন্তত ১ জন কার্যনির্বাহী কমিটির সদস্য যুক্ত করুন।' : 'Please add at least 1 committee member.');
      return;
    }

    if (!branchAgreedTerms) {
      alert(isBn ? 'অনুগ্রহ করে সংগঠনের গঠনতান্ত্রিক শর্তাবলীতে সম্মতি প্রদান করুন।' : 'Please agree to the organizational terms.');
      return;
    }

    if (!branchAgreedOath) {
      alert(isBn ? 'অনুগ্রহ করে পবিত্র অঙ্গীকারনামা ও শপথপত্রে সম্মতি প্রদান করুন।' : 'Please agree to the solemn oath.');
      return;
    }

    try {
      const payload = {
        ...applicationData,
        name: applicationData.name || applicationData.nameBn,
        nameBn: applicationData.nameBn || applicationData.name,
        status: 'pending_approval',
        committeePublished: false,
        committeeApprovedBy: 'Central Executive Committee, ASCADO',
        committeeApprovedByBn: 'কেন্দ্রীয় কার্যনির্বাহী পরিষদ, আসকাডো'
      };

      const result = await api.createBranch(payload);
      setSubmittedSuccessData(result);
      setIsApplyModalOpen(false);
      loadBranches();
    } catch (err: any) {
      alert(err.message || 'Submission failed. Please try again.');
    }
  };

  const handleIndividualMemberSuccess = (newMember: any) => {
    // Add to current selected branch if available
    if (selectedBranchId && branches.length > 0) {
      setBranches((prev) =>
        prev.map((b) => {
          if (b.id === selectedBranchId) {
            return {
              ...b,
              committeeMembers: [
                ...(b.committeeMembers || []),
                {
                  ...newMember,
                  id: newMember.memberId,
                  branchId: b.id,
                  branchName: b.nameBn || b.name
                }
              ]
            };
          }
          return b;
        })
      );
    }
  };

  // Helper to trigger print dialog
  const handlePrintCommittee = () => {
    window.print();
  };

  // Dynamic lists for cascading select in apply form
  const applyDistricts = getDistrictsByDivision(applicationData.division);
  const selectedDistrictKey = Object.keys(BANGLADESH_DISTRICTS).find(
    (k) => BANGLADESH_DISTRICTS[k].name.toLowerCase() === applicationData.district.toLowerCase()
  ) || 'dhaka';
  const applyUpazilas = getUpazilasByDistrictKey(selectedDistrictKey);
  const applyUnions = getUnionsByUpazilaName(applicationData.upazila);

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* 1. Header Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white py-10 sm:py-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isBn ? 'সারাদেশের অনুমোদিত প্রশাসনিক শাখা ও কমিটি নেটওয়ার্ক' : 'Nationwide Branch & Committee Hierarchy'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                {isBn ? 'বিভাগ, জেলা, উপজেলা ও ইউনিয়ন কার্যনির্বাহী পরিচালনা কমিটি' : 'Division, District, Upazila & Union Committees'}
              </h1>
              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
                {isBn
                  ? 'পুরো বাংলাদেশের ৮টি বিভাগ, ৬৪টি জেলা, ৪৯৫টি উপজেলা এবং ইউনিয়ন স্তরের প্রতিটি অনুমোদিত শাখার সম্পূর্ণ কার্যনির্বাহী কমিটি, কর্মকর্তাদের ছবি, পিতার নাম, পদবি ও অফিসিয়াল অনুমোদন বিবরণ।'
                  : 'Official hierarchical registry for Division, District, Upazila, and Union committees across all 64 districts of Bangladesh with published member directories.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsMemberApplyModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-5 py-3.5 rounded-xl shadow-lg transition transform active:scale-95 text-xs sm:text-sm"
              >
                <span>🪪</span>
                <span>{isBn ? 'সদস্য আবেদন ফরম ও শপথপত্র' : 'Member Application & Oath'}</span>
              </button>

              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-3.5 rounded-xl shadow-lg hover:shadow-emerald-500/20 transition transform active:scale-95 text-xs sm:text-sm"
              >
                <PlusCircle className="w-5 h-5" />
                <span>{isBn ? 'নতুন শাখা ও কমিটি আবেদন' : 'Apply for Branch / Committee'}</span>
              </button>

              {user?.role === 'SUPER_ADMIN' && (
                <button
                  onClick={() => onNavigate && onNavigate('admin')}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-3.5 rounded-xl border border-white/20 transition text-xs sm:text-sm"
                >
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>{isBn ? 'অ্যাডমিন অনুমোদন প্যানেল' : 'Admin Approval Panel'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar - 5 Hierarchy Levels */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4 border-t border-white/10 text-xs">
            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <div className="text-emerald-300 font-bold flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>{isBn ? 'মোট সক্রিয় শাখা' : 'Total Branches'}</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">
                {(branches || []).filter((b) => b && b.status === 'active').length} {isBn ? 'টি' : ''}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <div className="text-purple-300 font-bold flex items-center gap-1">
                <span>🏛️</span>
                <span>{isBn ? 'বিভাগীয় কমিটি' : 'Divisional Tiers'}</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-purple-200 mt-1">
                {(branches || []).filter((b) => b && (b.committeeLevel || '').toLowerCase() === 'division').length} {isBn ? 'টি' : ''}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <div className="text-blue-300 font-bold flex items-center gap-1">
                <span>🏢</span>
                <span>{isBn ? 'জেলা কমিটি' : 'District Tiers'}</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-blue-200 mt-1">
                {(branches || []).filter((b) => b && (b.committeeLevel || '').toLowerCase() === 'district').length} {isBn ? 'টি' : ''}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <div className="text-emerald-300 font-bold flex items-center gap-1">
                <span>🏬</span>
                <span>{isBn ? 'উপজেলা কমিটি' : 'Upazila Tiers'}</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-200 mt-1">
                {(branches || []).filter((b) => b && (b.committeeLevel || '').toLowerCase() === 'upazila').length} {isBn ? 'টি' : ''}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <div className="text-amber-300 font-bold flex items-center gap-1">
                <span>🏘️</span>
                <span>{isBn ? 'ইউনিয়ন কমিটি' : 'Union Tiers'}</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-200 mt-1">
                {(branches || []).filter((b) => b && (b.committeeLevel || '').toLowerCase() === 'union').length} {isBn ? 'টি' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

        {/* ========================================================
            FEATURED: COMMITTEE MEMBER ID CARD DOWNLOAD & SUGGESTION SEARCH
        ======================================================== */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-emerald-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {isBn ? 'স্বয়ংক্রিয় আইডি ও কিউআর সিস্টেম' : 'Auto ID & QR Verification'}
                    </span>
                    <span className="bg-amber-400/20 text-amber-300 border border-amber-300/40 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      {isBn ? 'সাজেশন নম্বর' : 'Suggestion No.'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-xl font-black text-white mt-1">
                    {isBn ? 'কমিটি সদস্য ডিজিটাল পরিচয়পত্র (ID Card) ডাউনলোড' : 'Download Committee Member Official ID Card'}
                  </h3>
                </div>
              </div>

              <div className="text-xs text-emerald-200/90 font-medium">
                {isBn ? 'যেকোনো সদস্যের সাজেশন নং বা মোবাইল দিয়ে সার্চ করুন' : 'Search by Suggestion No, Member ID, or Phone'}
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-emerald-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder={
                    isBn
                      ? 'আপনার সাজেশন নম্বর (যেমন: SUG-716701 বা 716701), মেম্বার আইডি বা মোবাইল নম্বর লিখুন...'
                      : 'Enter Suggestion Number (e.g., SUG-716701 or 716701), Member ID or Phone...'
                  }
                  value={suggestionSearchInput}
                  onChange={(e) => setSuggestionSearchInput(e.target.value)}
                  onFocus={() => setIsCardSearchFocused(true)}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-950/70 border-2 border-emerald-500/60 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition shadow-inner font-mono"
                />
                {suggestionSearchInput && (
                  <button
                    onClick={() => setSuggestionSearchInput('')}
                    className="absolute right-4 text-slate-400 hover:text-white p-1 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sample Quick Searches */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-emerald-200">
                <span className="font-bold">{isBn ? 'নমুনা সাজেশন নং:' : 'Sample suggestions:'}</span>
                {allEnrichedMembers.slice(0, 4).map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSuggestionSearchInput(m.suggestionNumber || '');
                      setSelectedCardMember(m);
                    }}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1 rounded-lg font-mono text-amber-300 font-bold transition flex items-center gap-1"
                  >
                    <span>{m.suggestionNumber}</span>
                    <span className="text-[9px] text-emerald-200">({m.nameBn || m.name})</span>
                  </button>
                ))}
              </div>

              {/* Live Search Results Dropdown/Box */}
              {suggestionSearchInput.trim() !== '' && (
                <div className="mt-3 bg-white text-slate-900 rounded-2xl p-3 sm:p-4 border-2 border-emerald-500 shadow-2xl space-y-2 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 pb-2 px-1">
                    <span>
                      {isBn
                        ? `অনুসন্ধানের ফলাফল (${suggestionSearchResults.length} জন সদস্য পাওয়া গেছে)`
                        : `Search Results (${suggestionSearchResults.length} members found)`}
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-mono">
                      {suggestionSearchInput}
                    </span>
                  </div>

                  {suggestionSearchResults.length === 0 ? (
                    <div className="py-6 text-center text-slate-500 space-y-1">
                      <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                      <p className="font-bold text-xs">
                        {isBn ? 'কোনো সদস্য খুঁজে পাওয়া যায়নি' : 'No matching member found'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {isBn ? 'সাজেশন নম্বর (যেমন: SUG-716701), মেম্বার আইডি বা মোবাইল সঠিক কিনা যাচাই করুন।' : 'Please verify the Suggestion Number, Member ID or phone number.'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1">
                      {suggestionSearchResults.map((m, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 hover:bg-emerald-50/60 p-3 rounded-xl border border-slate-200 hover:border-emerald-400 flex items-center justify-between gap-3 transition group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={
                                m.photoUrl ||
                                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'
                              }
                              alt={m.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0 text-xs">
                              <h4 className="font-extrabold text-slate-900 truncate">
                                {m.nameBn || m.name}
                              </h4>
                              <div className="text-[11px] text-emerald-800 font-bold">
                                {m.designationBn || m.designation}
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                                <span>আইডি: <strong className="text-slate-800">{m.memberId}</strong></span>
                                <span>•</span>
                                <span>সাজেশন: <strong className="text-blue-700">{m.suggestionNumber}</strong></span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => setSelectedCardMember(m)}
                            className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{isBn ? 'কার্ড ডাউনলোড' : 'Get Card'}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tier / Level Tabs (সকল স্তর, বিভাগীয়, জেলা, উপজেলা, ইউনিয়ন) */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex flex-wrap gap-2 items-center">
          {COMMITTEE_LEVELS.map((lvl) => {
            const isSelected = selectedLevel === lvl.id;
            const count =
              lvl.id === 'all'
                ? (branches || []).length
                : (branches || []).filter((b) => b && (b.committeeLevel || 'district').toLowerCase() === lvl.id.toLowerCase()).length;

            return (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id)}
                className={`flex-1 min-w-[140px] py-2.5 px-3.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-emerald-800'
                }`}
              >
                {lvl.icon && <span>{lvl.icon}</span>}
                <span>{isBn ? lvl.nameBn : lvl.name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-emerald-700 text-white font-mono' : 'bg-slate-200 text-slate-700 font-mono'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Cascading Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isBn ? 'শাখার নাম, কোড, জেলা, উপজেলা, ইউনিয়ন বা কর্মকর্তা খুঁজুন...' : 'Search by branch, code, district, member name...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full lg:w-auto">
            {/* Division Filter */}
            <select
              value={selectedDivision}
              onChange={(e) => handleDivisionChange(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">{isBn ? 'সকল বিভাগ (All Divisions)' : 'All Divisions'}</option>
              {BANGLADESH_DIVISIONS.map((div) => (
                <option key={div.id} value={div.id}>
                  {isBn ? `${div.nameBn} বিভাগ` : `${div.name} Division`}
                </option>
              ))}
            </select>

            {/* District Filter (filtered by division) */}
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">{isBn ? 'সকল জেলা (All Districts)' : 'All Districts'}</option>
              {getDistrictsByDivision(selectedDivision).map(({ key, district }) => (
                <option key={key} value={district.name}>
                  {isBn ? `${district.nameBn} (${district.name})` : district.name}
                </option>
              ))}
            </select>

            {/* Upazila Filter (filtered by selected district) */}
            <select
              value={selectedUpazila}
              onChange={(e) => setSelectedUpazila(e.target.value)}
              disabled={selectedDistrict === 'all'}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer disabled:opacity-50"
            >
              <option value="all">{isBn ? 'সকল উপজেলা (All Upazilas)' : 'All Upazilas'}</option>
              {selectedDistrict !== 'all' &&
                getUpazilasByDistrictKey(
                  Object.keys(BANGLADESH_DISTRICTS).find(
                    (k) => BANGLADESH_DISTRICTS[k].name.toLowerCase() === selectedDistrict.toLowerCase()
                  ) || ''
                ).map((upz) => (
                  <option key={upz} value={upz}>
                    {upz}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* 3. Two-Column Layout: Branch Selector Sidebar + Committee Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Branch Cards List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>{isBn ? 'শাখা ও কমিটি তালিকা' : 'Branch Directory'}</span>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-mono">
                  {filteredBranches.length}
                </span>
              </h2>

              {(selectedDivision !== 'all' || selectedDistrict !== 'all' || selectedLevel !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedLevel('all');
                    setSelectedDivision('all');
                    setSelectedDistrict('all');
                    setSelectedUpazila('all');
                    setSearchQuery('');
                  }}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-bold"
                >
                  {isBn ? 'রিসেট' : 'Reset'}
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
                {isBn ? 'শাখা ও কমিটি তথ্য লোড হচ্ছে...' : 'Loading branches & committees...'}
              </div>
            ) : filteredBranches.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="font-bold text-slate-700">{isBn ? 'কোনো শাখা পাওয়া যায়নি।' : 'No branches found.'}</p>
                <p className="text-xs text-slate-500">
                  {isBn ? 'অন্যান্য ফিল্টার বা অনুসন্ধান শব্দ ব্যবহার করে দেখুন।' : 'Try changing your filter criteria.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[820px] overflow-y-auto pr-1">
                {filteredBranches.map((branch) => {
                  const isSelected = branch.id === selectedBranch?.id;
                  const isApproved = branch.status === 'active';
                  const levelInfo = getLevelBadge(branch.committeeLevel);

                  return (
                    <div
                      key={branch.id}
                      onClick={() => setSelectedBranchId(branch.id)}
                      className={`p-4 rounded-2xl border transition cursor-pointer text-left relative overflow-hidden ${
                        isSelected
                          ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Active Indicator Bar */}
                      {isSelected && (
                        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-emerald-600 rounded-l-2xl" />
                      )}

                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                              {branch.branchCode}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-md border flex items-center gap-1 ${levelInfo.badge}`}>
                              <span>{levelInfo.icon}</span>
                              <span>{levelInfo.label}</span>
                            </span>
                          </div>

                          <h3 className="font-black text-sm text-slate-900 pt-1">
                            {isBn ? branch.nameBn || branch.name : branch.name}
                          </h3>
                        </div>

                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                            isApproved
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isApproved ? (isBn ? '✓ অনুমোদিত' : 'Approved') : (isBn ? '⏳ আবেদনাধীন' : 'Pending')}
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="line-clamp-1">
                            {branch.divisionBn || branch.division ? `${branch.divisionBn || branch.division} > ` : ''}
                            {branch.districtBn || branch.district}
                            {branch.upazila ? ` > ${branch.upazilaBn || branch.upazila}` : ''}
                            {branch.union ? ` > ${branch.unionBn || branch.union}` : ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500 pt-1">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>
                              {branch.committeeMembers?.length || 0} {isBn ? 'জন কার্যনির্বাহী সদস্য' : 'Committee Members'}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-0.5">
                            <span>{isBn ? 'তালিকা দেখুন' : 'View'}</span>
                            <ChevronRight className={`w-3.5 h-3.5 transition ${isSelected ? 'translate-x-1' : ''}`} />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Selected Branch Header & Committee Members Table */}
          <div className="lg:col-span-8 space-y-6">
            {selectedBranch ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6" id="printable-committee-section">
                {/* Branch Info Header Card */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 relative overflow-hidden space-y-4">
                  <div className="absolute right-0 top-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-emerald-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-md font-mono">
                          {selectedBranch.branchCode}
                        </span>
                        <span className="text-xs text-emerald-300 font-medium">
                          {selectedBranch.organizationName || 'ASCADO Central Welfare Trust'}
                        </span>
                        {(() => {
                          const lvl = getLevelBadge(selectedBranch.committeeLevel);
                          return (
                            <span className={`text-[11px] px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${lvl.badge}`}>
                              <span>{lvl.icon}</span>
                              <span>{lvl.label}</span>
                            </span>
                          );
                        })()}
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
                        {isBn ? selectedBranch.nameBn || selectedBranch.name : selectedBranch.name}
                      </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handlePrintCommittee}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isBn ? 'কমিটি প্রিন্ট / কপি' : 'Print / Download'}</span>
                      </button>

                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                          selectedBranch.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                        }`}
                      >
                        {selectedBranch.status === 'active'
                          ? (isBn ? '✓ অনুমোদিত ও প্রকাশিত শাখা' : '✓ Active & Published')
                          : (isBn ? '⏳ পর্যালোচনার অপেক্ষায়' : '⏳ Pending Review')}
                      </span>
                    </div>
                  </div>

                  {/* Administrative Path Badge Bar */}
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-xs flex flex-wrap items-center gap-3 text-slate-200">
                    <div>
                      <span className="text-slate-400">{isBn ? 'বিভাগ: ' : 'Division: '}</span>
                      <span className="font-bold text-white">{selectedBranch.divisionBn || selectedBranch.division || 'ঢাকা'}</span>
                    </div>
                    <span>•</span>
                    <div>
                      <span className="text-slate-400">{isBn ? 'জেলা: ' : 'District: '}</span>
                      <span className="font-bold text-white">{selectedBranch.districtBn || selectedBranch.district}</span>
                    </div>
                    {selectedBranch.upazila && (
                      <>
                        <span>•</span>
                        <div>
                          <span className="text-slate-400">{isBn ? 'উপজেলা/থানা: ' : 'Upazila: '}</span>
                          <span className="font-bold text-white">{selectedBranch.upazilaBn || selectedBranch.upazila}</span>
                        </div>
                      </>
                    )}
                    {selectedBranch.union && (
                      <>
                        <span>•</span>
                        <div>
                          <span className="text-slate-400">{isBn ? 'ইউনিয়ন/ওয়ার্ড: ' : 'Union: '}</span>
                          <span className="font-bold text-white">{selectedBranch.unionBn || selectedBranch.union}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Branch Meta Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-white/10">
                    <div>
                      <span className="text-slate-400 block">{isBn ? 'কার্যালয়ের ঠিকানা:' : 'Office Address:'}</span>
                      <span className="font-semibold text-slate-100">{selectedBranch.address}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isBn ? 'শাখা আহ্বায়ক / প্রধান:' : 'Branch Head / Manager:'}</span>
                      <span className="font-semibold text-slate-100">{selectedBranch.managerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isBn ? 'অনুমোদনকারী কর্তৃপক্ষ:' : 'Approved Authority:'}</span>
                      <span className="font-semibold text-emerald-300">
                        {selectedBranch.committeeApprovedByBn || selectedBranch.committeeApprovedBy || 'কেন্দ্রীয় কার্যনির্বাহী পরিষদ'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Committee Title & Switcher Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 border-t border-slate-100">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-lg text-slate-900">
                        {isBn ? (selectedBranch.committeeTitle || 'শাখা কার্যনির্বাহী পরিচালনা কমিটি') : 'Executive Managing Committee'}
                      </h3>
                      <span className="text-xs font-extrabold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full font-mono">
                        {selectedBranch.committeeTerm || '২০২৬-২০২৮'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {isBn
                        ? `মোট ${selectedBranch.committeeMembers?.length || 0} জন দায়িত্বপ্রাপ্ত কর্মকর্তা ও কার্যনির্বাহী সদস্যের সম্পূর্ণ তথ্য`
                        : `Official roster of ${selectedBranch.committeeMembers?.length || 0} executive officers and members`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* View Switcher: Table vs Cards */}
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => setViewMode('table')}
                        className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                          viewMode === 'table' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                        }`}
                        title="Table View"
                      >
                        <List className="w-4 h-4" />
                        <span className="hidden sm:inline">{isBn ? 'তালিকা' : 'Table'}</span>
                      </button>
                      <button
                        onClick={() => setViewMode('cards')}
                        className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                          viewMode === 'cards' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                        }`}
                        title="Cards View"
                      >
                        <Grid className="w-4 h-4" />
                        <span className="hidden sm:inline">{isBn ? 'কার্ড' : 'Cards'}</span>
                      </button>
                    </div>

                    {/* Search inside members table */}
                    <div className="w-full sm:w-56">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder={isBn ? 'নাম, পদবি বা পিতার নাম...' : 'Search member...'}
                          value={memberSearchTerm}
                          onChange={(e) => setMemberSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ========================================================
                    COMMITTEE MEMBERS: TABLE VIEW vs CARDS VIEW
                ======================================================== */}
                {viewMode === 'table' ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider">
                            <th className="py-3.5 px-4 text-center w-12">{isBn ? 'নং' : 'SL'}</th>
                            <th className="py-3.5 px-4 w-16">{isBn ? 'ছবি' : 'Photo'}</th>
                            <th className="py-3.5 px-4 min-w-[150px]">{isBn ? 'সদস্যের নাম ও পিতা' : 'Member & Father'}</th>
                            <th className="py-3.5 px-4 min-w-[150px]">{isBn ? 'পদবি ও দায়িত্ব' : 'Designation'}</th>
                            <th className="py-3.5 px-4 min-w-[150px]">{isBn ? 'অটো মেম্বার আইডি ও সাজেশন' : 'Auto ID & Suggestion'}</th>
                            <th className="py-3.5 px-4 min-w-[150px]">{isBn ? 'ঠিকানা ও মোবাইল' : 'Address & Phone'}</th>
                            <th className="py-3.5 px-4 text-center min-w-[130px]">{isBn ? 'আইডি কার্ড ও কিউআর' : 'ID Card & QR'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium bg-white">
                          {filteredMembers.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-10 text-center text-slate-500">
                                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                <p>{isBn ? 'কোনো কমিটি সদস্যের তথ্য পাওয়া যায়নি।' : 'No committee members found.'}</p>
                              </td>
                            </tr>
                          ) : (
                            filteredMembers.map((member: any, index: number) => {
                              const sugNo = member.suggestionNumber || generateSuggestionNumber(selectedBranch, member, index);
                              const enrichedMem: EnrichedCommitteeMember = {
                                ...member,
                                memberId: member.memberId || generateMemberId(selectedBranch, index),
                                suggestionNumber: sugNo,
                                bloodGroup: member.bloodGroup || 'O+',
                                issueDate: member.issueDate || selectedBranch?.committeeApprovedAt || '2026-01-01',
                                validUntil: member.validUntil || '2028-12-31',
                                qrCodeData: member.qrCodeData || '',
                                qrCodeUrl: member.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(member.memberId || '')}`,
                                donationFee: member.donationFee || COMMITTEE_MEMBER_DONATION_FEE,
                                donationStatus: member.donationStatus || 'paid',
                                paymentMethod: member.paymentMethod || 'bKash / Nagad',
                                trxId: member.trxId || generateMemberTrxId(sugNo, index),
                                donationReceiptNo: member.donationReceiptNo || generateDonationReceiptNo(sugNo, index),
                                donationPaidDate: member.donationPaidDate || member.issueDate || selectedBranch?.committeeApprovedAt || '2026-01-01',
                                branch: selectedBranch
                              };

                              return (
                                <tr
                                  key={member.id || index}
                                  className="hover:bg-emerald-50/40 transition duration-100 group"
                                >
                                  {/* Serial # */}
                                  <td className="py-3.5 px-4 text-center font-bold text-slate-400 font-mono">
                                    {index + 1}
                                  </td>

                                  {/* Member Photo */}
                                  <td className="py-3.5 px-4">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs relative group-hover:border-emerald-500 transition">
                                      <img
                                        src={
                                          member.photoUrl ||
                                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'
                                        }
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                      />
                                    </div>
                                  </td>

                                  {/* Member Name & Father's Name */}
                                  <td className="py-3.5 px-4">
                                    <div className="font-bold text-slate-900 text-sm">
                                      {isBn ? member.nameBn || member.name : member.name}
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                      <span className="text-slate-400 font-medium">{isBn ? 'পিতা: ' : "Father: "}</span>
                                      {isBn ? member.fatherNameBn || member.fatherName : member.fatherName}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      {member.nid && (
                                        <span className="text-[9px] font-mono text-slate-400">
                                          NID: {member.nid}
                                        </span>
                                      )}
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                                        <span>৳{enrichedMem.donationFee} অনুদান</span>
                                        <Check className="w-2.5 h-2.5 text-emerald-700" />
                                      </span>
                                    </div>
                                  </td>

                                  {/* Designation */}
                                  <td className="py-3.5 px-4">
                                    <span
                                      className={`inline-block px-2.5 py-1 rounded-lg text-xs border ${getDesignationBadgeClass(
                                        member.designationBn || member.designation
                                      )}`}
                                    >
                                      {isBn ? member.designationBn || member.designation : member.designation}
                                    </span>
                                  </td>

                                  {/* Auto Member ID & Suggestion No */}
                                  <td className="py-3.5 px-4 font-mono space-y-1">
                                    <div className="flex items-center gap-1">
                                      <span className="text-[9px] text-slate-400 font-bold uppercase">আইডি:</span>
                                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                        {enrichedMem.memberId}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-[9px] text-slate-400 font-bold uppercase">সাজেশন:</span>
                                      <span className="bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                        {enrichedMem.suggestionNumber}
                                      </span>
                                    </div>
                                  </td>

                                  {/* Address & Phone */}
                                  <td className="py-3.5 px-4 text-xs space-y-1">
                                    <div className="text-slate-600 line-clamp-1">
                                      {isBn ? member.addressBn || member.address : member.address}
                                    </div>
                                    {member.phone ? (
                                      <a
                                        href={`tel:${member.phone}`}
                                        className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 transition"
                                      >
                                        <Phone className="w-3 h-3 text-emerald-600" />
                                        <span>{member.phone}</span>
                                      </a>
                                    ) : (
                                      <span className="text-slate-400">—</span>
                                    )}
                                  </td>

                                  {/* ID Card Download & QR Action */}
                                  <td className="py-3.5 px-4 text-center">
                                    <button
                                      onClick={() => setSelectedCardMember(enrichedMem)}
                                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs shadow-xs transition"
                                      title="ডিজিটাল আইডি কার্ড ও ৳১২৫০ অনুদান রসিদ"
                                    >
                                      <QrCode className="w-3.5 h-3.5" />
                                      <span>{isBn ? '🪪 কার্ড ও রসিদ' : 'Card & Receipt'}</span>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  /* Cards View */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMembers.map((member: any, index: number) => {
                      const sugNo = member.suggestionNumber || generateSuggestionNumber(selectedBranch, member, index);
                      const enrichedMem: EnrichedCommitteeMember = {
                        ...member,
                        memberId: member.memberId || generateMemberId(selectedBranch, index),
                        suggestionNumber: sugNo,
                        bloodGroup: member.bloodGroup || 'O+',
                        issueDate: member.issueDate || selectedBranch?.committeeApprovedAt || '2026-01-01',
                        validUntil: member.validUntil || '2028-12-31',
                        qrCodeData: member.qrCodeData || '',
                        qrCodeUrl: member.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(member.memberId || '')}`,
                        donationFee: member.donationFee || COMMITTEE_MEMBER_DONATION_FEE,
                        donationStatus: member.donationStatus || 'paid',
                        paymentMethod: member.paymentMethod || 'bKash / Nagad',
                        trxId: member.trxId || generateMemberTrxId(sugNo, index),
                        donationReceiptNo: member.donationReceiptNo || generateDonationReceiptNo(sugNo, index),
                        donationPaidDate: member.donationPaidDate || member.issueDate || selectedBranch?.committeeApprovedAt || '2026-01-01',
                        branch: selectedBranch
                      };

                      return (
                        <div
                          key={member.id || index}
                          className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-400 hover:shadow-md transition group"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="relative shrink-0">
                                <img
                                  src={
                                    member.photoUrl ||
                                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'
                                  }
                                  alt={member.name}
                                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
                                />
                                <span className="absolute -bottom-1.5 -right-1 bg-emerald-600 text-white text-[9px] font-mono px-1 rounded">
                                  #{index + 1}
                                </span>
                              </div>
                              
                              <div className="space-y-1 min-w-0 flex-1">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-md text-[10px] border ${getDesignationBadgeClass(
                                    member.designationBn || member.designation
                                  )}`}
                                >
                                  {isBn ? member.designationBn || member.designation : member.designation}
                                </span>
                                <h4 className="font-extrabold text-sm text-slate-900 truncate">
                                  {isBn ? member.nameBn || member.name : member.name}
                                </h4>
                                <p className="text-xs text-slate-500 truncate">
                                  <span className="font-semibold">{isBn ? 'পিতা: ' : "Father: "}</span>
                                  {isBn ? member.fatherNameBn || member.fatherName : member.fatherName}
                                </p>
                              </div>
                            </div>

                            {/* ID and Suggestion Badge */}
                            <div className="grid grid-cols-2 gap-1.5 bg-white p-2 rounded-xl border border-slate-200 font-mono text-[10px]">
                              <div>
                                <span className="text-slate-400 block text-[8px] uppercase font-sans">মেম্বার আইডি</span>
                                <span className="font-bold text-emerald-800">{enrichedMem.memberId}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[8px] uppercase font-sans">সাজেশন নং</span>
                                <span className="font-bold text-blue-800">{enrichedMem.suggestionNumber}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[11px] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              <span className="text-emerald-900 font-bold">ডোনেশন ফি:</span>
                              <span className="font-black text-emerald-700">৳{enrichedMem.donationFee} (পরিশোধিত ✓)</span>
                            </div>

                            <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-200">
                              <div className="flex items-start gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{isBn ? member.addressBn || member.address : member.address}</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 mt-3 border-t border-slate-200 flex justify-between items-center gap-2">
                            {member.phone ? (
                              <a
                                href={`tel:${member.phone}`}
                                className="flex items-center gap-1 text-emerald-700 font-bold hover:underline font-mono text-xs"
                              >
                                <Phone className="w-3 h-3" />
                                <span>{member.phone}</span>
                              </a>
                            ) : (
                              <span className="text-slate-400 text-xs">—</span>
                            )}

                            <button
                              onClick={() => setSelectedCardMember(enrichedMem)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-xs transition active:scale-95"
                              title="কার্ড ও ৳১২৫০ অনুদান রসিদ"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>{isBn ? '🪪 কার্ড ও রসিদ' : 'Card & Receipt'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                {isBn ? 'তালিকা থেকে কোনো শাখা নির্বাচন করুন।' : 'Select a branch to view its committee roster.'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Branch Application Modal with Full Hierarchical Dropdowns */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-5 flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-white shadow-md">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg">
                    {isBn ? 'নতুন শাখা ও কার্যনির্বাহী পরিচালনা কমিটি গঠন আবেদন' : 'Apply for New Branch & Executive Committee'}
                  </h3>
                  <p className="text-xs text-emerald-200">
                    {isBn
                      ? 'বিভাগ, জেলা, উপজেলা বা ইউনিয়ন স্তরের শাখা অনুমোদন ও কমিটি প্রণয়ন ফরম'
                      : 'Propose a branch and executive committee roster across administrative tiers'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmitBranchApplication} className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Section 1: Committee Level & Hierarchy Placement */}
              <div className="space-y-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200">
                <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">1</span>
                  <span>{isBn ? 'কমিটির স্তর ও প্রশাসনিক অবস্থান নির্বাচন' : 'Committee Tier & Location Selection'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Committee Level */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'কমিটির স্তর *' : 'Committee Tier *'}
                    </label>
                    <select
                      value={applicationData.committeeLevel}
                      onChange={(e) =>
                        setApplicationData({
                          ...applicationData,
                          committeeLevel: e.target.value as CommitteeLevel
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      <option value="division">🏛️ বিভাগীয় কমিটি (Division)</option>
                      <option value="district">🏢 জেলা কমিটি (District)</option>
                      <option value="upazila">🏬 উপজেলা / থানা কমিটি (Upazila)</option>
                      <option value="union">🏘️ ইউনিয়ন / ওয়ার্ড কমিটি (Union)</option>
                    </select>
                  </div>

                  {/* Division Select */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'বিভাগ *' : 'Division *'}
                    </label>
                    <select
                      value={applicationData.division}
                      onChange={(e) => {
                        const divObj = BANGLADESH_DIVISIONS.find((d) => d.id === e.target.value);
                        setApplicationData({
                          ...applicationData,
                          division: e.target.value,
                          divisionBn: divObj ? divObj.nameBn : ''
                        });
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      {BANGLADESH_DIVISIONS.map((div) => (
                        <option key={div.id} value={div.id}>
                          {isBn ? `${div.nameBn} বিভাগ` : `${div.name} Division`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District Select */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'জেলা *' : 'District *'}
                    </label>
                    <select
                      value={applicationData.district}
                      onChange={(e) => {
                        const distObj = Object.values(BANGLADESH_DISTRICTS).find((d) => d.name === e.target.value);
                        setApplicationData({
                          ...applicationData,
                          district: e.target.value,
                          districtBn: distObj ? distObj.nameBn : e.target.value
                        });
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      {applyDistricts.map(({ key, district }) => (
                        <option key={key} value={district.name}>
                          {isBn ? `${district.nameBn} (${district.name})` : district.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Upazila Select */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'উপজেলা / থানা *' : 'Upazila / Thana *'}
                    </label>
                    <select
                      value={applicationData.upazila}
                      onChange={(e) =>
                        setApplicationData({
                          ...applicationData,
                          upazila: e.target.value,
                          upazilaBn: e.target.value
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      {applyUpazilas.map((upz) => (
                        <option key={upz} value={upz}>
                          {upz}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Union / Ward if applicable */}
                {applicationData.committeeLevel === 'union' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {isBn ? 'ইউনিয়ন / পৌর ওয়ার্ড নির্বাচন *' : 'Union / Ward Select *'}
                      </label>
                      <select
                        value={applicationData.union}
                        onChange={(e) =>
                          setApplicationData({
                            ...applicationData,
                            union: e.target.value,
                            unionBn: e.target.value
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      >
                        {applyUnions.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {isBn ? 'ইউনিয়ন / ওয়ার্ডের কাস্টম নাম (প্রয়োজনে)' : 'Custom Union / Ward Name (Optional)'}
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: বিরুলিয়া ইউনিয়ন পরিষদ"
                        value={applicationData.unionBn}
                        onChange={(e) =>
                          setApplicationData({
                            ...applicationData,
                            unionBn: e.target.value,
                            union: e.target.value
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Branch Information */}
              <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">2</span>
                  <span>{isBn ? 'শাখার নাম ও কার্যালয়ের ঠিকানা' : 'Branch Title & Office Details'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'শাখার নাম (বাংলা) *' : 'Branch Name (Bangla) *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: চট্টগ্রাম বিভাগীয় শাখা / সাভার মডেল শাখা"
                      value={applicationData.nameBn}
                      onChange={(e) => setApplicationData({ ...applicationData, nameBn: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'শাখার নাম (English) *' : 'Branch Name (English) *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chattogram Divisional Branch / Savar Model Branch"
                      value={applicationData.name}
                      onChange={(e) => setApplicationData({ ...applicationData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'শাখার কার্যালয়ের পূর্ণাঙ্গ ঠিকানা *' : 'Branch Office Full Address *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="বাড়ি নং, রোড নং, এলাকা/বাজার, পোস্ট কোড, জেলা"
                      value={applicationData.address}
                      onChange={(e) => setApplicationData({ ...applicationData, address: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Branch Convener / Manager */}
              <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">3</span>
                  <span>{isBn ? 'শাখা আহ্বায়ক / পরিচালকের তথ্য' : 'Branch Convener / Manager'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'আহ্বায়ক / প্রধানের নাম *' : 'Convener Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="পূর্ণ নাম"
                      value={applicationData.managerName}
                      onChange={(e) => setApplicationData({ ...applicationData, managerName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="017XXXXXXXX"
                      value={applicationData.managerPhone}
                      onChange={(e) => setApplicationData({ ...applicationData, managerPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      placeholder="branch@ascado.org"
                      value={applicationData.managerEmail}
                      onChange={(e) => setApplicationData({ ...applicationData, managerEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Proposed Committee Members */}
              <div className="space-y-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">4</span>
                    <span>{isBn ? 'প্রস্তাবিত কার্যনির্বাহী কমিটির সদস্য তালিকা' : 'Proposed Committee Members'}</span>
                  </h4>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-mono">
                    {applicationData.committeeMembers.length} {isBn ? 'জন সদস্য যুক্ত' : 'members'}
                  </span>
                </div>

                  {/* Sub-form to Add New Committee Member with Drag-Drop Photo Upload */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                    <p className="font-black text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-emerald-600" />
                      <span>{isBn ? '+ নতুন কমিটির সদস্যের তথ্য ও ছবি যুক্ত করুন:' : '+ Add Member to Committee:'}</span>
                    </p>

                    {/* Member Photo Upload */}
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
                      <MemberPhotoUpload
                        photoUrl={newMemberInput.photoUrl}
                        onChange={(url) => setNewMemberInput({ ...newMemberInput, photoUrl: url })}
                        label={isBn ? 'সদস্যের পাসপোর্ট সাইজ রঙিন ছবি * (Drag & Drop / ফোল্ডার থেকে বাছুন)' : 'Member Passport Photo *'}
                        isBn={isBn}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          {isBn ? 'সদস্যের নাম (বাংলা) *' : 'Member Name (Bangla) *'}
                        </label>
                        <input
                          type="text"
                          placeholder="যেমন: হাজী আব্দুল করিম"
                          value={newMemberInput.nameBn}
                          onChange={(e) => setNewMemberInput({ ...newMemberInput, nameBn: e.target.value, name: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          {isBn ? 'পিতার নাম *' : "Father's Name *"}
                        </label>
                        <input
                          type="text"
                          placeholder="যেমন: মরহুম সামসুল হক"
                          value={newMemberInput.fatherNameBn}
                          onChange={(e) => setNewMemberInput({ ...newMemberInput, fatherNameBn: e.target.value, fatherName: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          {isBn ? 'পদবি *' : 'Designation *'}
                        </label>
                        <select
                          value={newMemberInput.designationBn}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewMemberInput({
                              ...newMemberInput,
                              designationBn: val,
                              designation: val
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white font-bold text-emerald-800"
                        >
                          {STANDARD_COMMITTEE_DESIGNATIONS.map((d) => (
                            <option key={d.value} value={d.labelBn}>
                              {d.labelBn} ({d.labelEn})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          {isBn ? 'ঠিকানা *' : 'Address *'}
                        </label>
                        <input
                          type="text"
                          placeholder="গ্রাম/রোড, উপজেলা, জেলা"
                          value={newMemberInput.addressBn}
                          onChange={(e) => setNewMemberInput({ ...newMemberInput, addressBn: e.target.value, address: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          {isBn ? 'মোবাইল নম্বর' : 'Phone'}
                        </label>
                        <input
                          type="text"
                          placeholder="01XXXXXXXXX"
                          value={newMemberInput.phone}
                          onChange={(e) => setNewMemberInput({ ...newMemberInput, phone: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          {isBn ? 'জাতীয় পরিচয়পত্র / NID' : 'NID Number'}
                        </label>
                        <input
                          type="text"
                          placeholder="১০ বা ১৭ ডিজিট"
                          value={newMemberInput.nid}
                          onChange={(e) => setNewMemberInput({ ...newMemberInput, nid: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <div className="text-[11px] text-emerald-800 font-bold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isBn ? `সদস্য ফি: ৳${COMMITTEE_MEMBER_DONATION_FEE} (ডিজিটাল আইডি ও রসিদ প্রস্তুত হবে)` : `Fee: BDT ${COMMITTEE_MEMBER_DONATION_FEE}`}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddMemberToApplication}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>{isBn ? 'কমিটি তালিকায় সদস্য যুক্ত করুন' : 'Add to Committee'}</span>
                      </button>
                    </div>
                  </div>

                {/* Table Preview of Added Members */}
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                        <th className="py-2.5 px-3">ছবি</th>
                        <th className="py-2.5 px-3">নাম</th>
                        <th className="py-2.5 px-3">পিতার নাম</th>
                        <th className="py-2.5 px-3">পদবি</th>
                        <th className="py-2.5 px-3">ডোনেশন ফি</th>
                        <th className="py-2.5 px-3">ঠিকানা</th>
                        <th className="py-2.5 px-3">মোবাইল</th>
                        <th className="py-2.5 px-3 text-right">মুছুন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(applicationData.committeeMembers?.length || 0) === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-6 text-center text-slate-400">
                            {isBn ? 'এখনো কোনো কমিটির সদস্য যুক্ত করা হয়নি।' : 'No committee members added yet.'}
                          </td>
                        </tr>
                      ) : (
                        (applicationData.committeeMembers || []).map((m, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2 px-3">
                              <img
                                src={m.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'}
                                alt={m.name}
                                className="w-8 h-8 rounded-full object-cover border"
                              />
                            </td>
                            <td className="py-2 px-3 font-bold text-slate-900">{m.nameBn || m.name}</td>
                            <td className="py-2 px-3 text-slate-600">{m.fatherNameBn || m.fatherName}</td>
                            <td className="py-2 px-3">
                              <span className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                                {m.designationBn || m.designation}
                              </span>
                            </td>
                            <td className="py-2 px-3 font-bold text-emerald-700 font-mono">
                              ৳{COMMITTEE_MEMBER_DONATION_FEE}
                            </td>
                            <td className="py-2 px-3 text-slate-500">{m.addressBn || m.address}</td>
                            <td className="py-2 px-3 font-mono">{m.phone || '—'}</td>
                            <td className="py-2 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveMemberFromApplication(idx)}
                                className="text-rose-600 hover:text-rose-700 p-1 font-bold"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Section 5: Committee Donation Fee Calculation & Payment Guide */}
                <div className="bg-gradient-to-r from-amber-50 to-emerald-50 p-4 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-amber-700" />
                      <div>
                        <h5 className="font-black text-xs sm:text-sm text-slate-900">
                          {isBn ? 'কমিটি সদস্য ডোনেশন ফি ও পেমেন্ট বিবরণী' : 'Committee Member Donation & Payment Summary'}
                        </h5>
                        <p className="text-[11px] text-slate-600">
                          {isBn
                            ? `প্রতিটি কমিটির সদস্যের জন্য এককালীন অনুদান ফি ৳${COMMITTEE_MEMBER_DONATION_FEE} নির্ধারিত`
                            : `Donation fee is BDT ${COMMITTEE_MEMBER_DONATION_FEE} per committee member`}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white px-3.5 py-1.5 rounded-xl border border-amber-300 shadow-xs font-mono text-right">
                      <span className="text-[10px] text-slate-500 block">মোট প্রদেয় ডোনেশন:</span>
                      <span className="text-base font-black text-emerald-800">
                        ৳{applicationData.committeeMembers.length * COMMITTEE_MEMBER_DONATION_FEE}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">সদস্য সংখ্যা</span>
                      <span className="text-sm font-black text-slate-800">{applicationData.committeeMembers.length} জন</span>
                      <p className="text-[10px] text-slate-500">প্রস্তাবিত কমিটিতে তালিকাভুক্ত</p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">প্রতি সদস্য ফি</span>
                      <span className="text-sm font-black text-emerald-700">৳{COMMITTEE_MEMBER_DONATION_FEE}</span>
                      <p className="text-[10px] text-slate-500">ডিজিটাল আইডি ও রসিদ সহ</p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">অফিসিয়াল পেমেন্ট মাধ্যম</span>
                      <span className="text-xs font-black text-pink-600">বিকাশ / নগদ / রকেট: 01973-817167</span>
                      <p className="text-[10px] text-slate-500">Merchant / Personal Trx</p>
                    </div>
                  </div>
                </div>

                {/* Section 6: Terms and Solemn Oath for Branch Application */}
                <div className="space-y-3">
                  <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">5</span>
                    <span>{isBn ? 'সাংগঠনিক শর্তাবলী ও পবিত্র অঙ্গীকারনামা' : 'Organizational Terms & Solemn Oath'}</span>
                  </h4>
                  <MembershipTermsAndOath
                    isBn={isBn}
                    agreedTerms={branchAgreedTerms}
                    onToggleTerms={setBranchAgreedTerms}
                    agreedOath={branchAgreedOath}
                    onToggleOath={setBranchAgreedOath}
                    applicantName={applicationData.managerName || (isBn ? 'শাখা আহ্বায়ক' : 'Branch Convener')}
                    applicantDesignation={isBn ? 'শাখা আহ্বায়ক ও প্রস্তাবিত পরিচালনা পর্ষদ' : 'Branch Convener & Executive Body'}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition text-xs"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md transition text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isBn ? 'শাখা ও কমিটি আবেদনপত্র জমা দিন' : 'Submit Application'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Individual Member Application Modal with Photo Upload, Terms & Solemn Oath */}
      {isMemberApplyModalOpen && (
        <IndividualMemberApplicationModal
          onClose={() => setIsMemberApplyModalOpen(false)}
          onSuccess={handleIndividualMemberSuccess}
          branches={branches}
          isBn={isBn}
        />
      )}

      {/* 6. Success Application Notification Modal */}
      {submittedSuccessData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 border border-emerald-200 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="font-black text-xl text-slate-900">
              {isBn ? 'শাখা আবেদন সফলভাবে জমা হয়েছে!' : 'Branch Application Submitted!'}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isBn
                ? `আপনার শাখা "${submittedSuccessData.nameBn || submittedSuccessData.name}" এবং প্রস্তাবিত ${submittedSuccessData.committeeMembers?.length || 0} সদস্যের কার্যনির্বাহী কমিটি সফলভাবে যাচাইয়ের জন্য সংরক্ষিত হয়েছে। কেন্দ্রীয় অ্যাডমিন অনুমোদনের সাথে সাথে কমিটি স্বয়ংক্রিয়ভাবে পাবলিশ হবে।`
                : `Your branch "${submittedSuccessData.name}" and proposed committee have been submitted for review. Upon admin approval, the committee will be automatically published.`}
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-700">
              আবেদন ট্র্যাকিং কোড: <span className="font-bold text-emerald-700">{submittedSuccessData.branchCode}</span>
            </div>

            <button
              onClick={() => setSubmittedSuccessData(null)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition text-xs"
            >
              {isBn ? 'ঠিক আছে' : 'Got it'}
            </button>
          </div>
        </div>
      )}

      {/* 7. Official Committee Member ID Card Modal with Auto ID, Suggestion No & QR */}
      {selectedCardMember && (
        <CommitteeMemberIdCardModal
          member={selectedCardMember}
          onClose={() => setSelectedCardMember(null)}
        />
      )}
    </div>
  );
};
