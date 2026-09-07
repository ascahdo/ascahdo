import React, { useState } from 'react';
import { useTranslation } from '../locales/i18nContext';
import {
  Landmark, Building2, Users, PiggyBank, CreditCard,
  Smartphone, FileSpreadsheet, BarChart2, ShieldCheck,
  Search, PlusCircle, Filter, CheckCircle2, ChevronRight,
  UserCheck, AlertCircle, ArrowUpRight, Scale, MapPin,
  Phone, Mail, Award, Sparkles, Image as ImageIcon, Home
} from 'lucide-react';

// Types & Mock Data
import {
  Somiti, SomitiBranch, SomitiMember, SomitiLoanApp,
  SavingsTransaction, LedgerEntry, BranchApplication,
  AuditLogEntry, ERPUserRole
} from '../types/somitiTypes';
import {
  INITIAL_SOMITIS, INITIAL_BRANCHES, INITIAL_MEMBERS,
  INITIAL_LOANS, INITIAL_TRANSACTIONS, INITIAL_LEDGER_ENTRIES,
  INITIAL_BRANCH_APPLICATIONS, INITIAL_AUDIT_LOGS
} from '../data/somitiMockData';

// Hub Architecture Components
import { HubHeader } from '../components/hub/HubHeader';
import { SomitiHubHomepage } from '../components/somiti/SomitiHubHomepage';

// Sub-views & Components
import { SomitiTopControlBar } from '../components/somiti/SomitiTopControlBar';
import { SuperAdminOverview } from '../components/somiti/SuperAdminOverview';
import { MultiSomitiView } from '../components/somiti/MultiSomitiView';
import { BranchManagementView } from '../components/somiti/BranchManagementView';
import { CentralAccountsView } from '../components/somiti/CentralAccountsView';
import { MasterReportsView } from '../components/somiti/MasterReportsView';
import { SecurityAuditView } from '../components/somiti/SecurityAuditView';
import { MobileCollectorPOS } from '../components/somiti/MobileCollectorPOS';

// Modals
import { Member360Modal } from '../components/somiti/Member360Modal';
import { DigitalReceiptModal } from '../components/somiti/DigitalReceiptModal';
import { BranchApprovalWorkflowModal } from '../components/somiti/BranchApprovalWorkflowModal';
import { SomitiCreateEditModal } from '../components/somiti/SomitiCreateEditModal';
import { DepositPaymentModal } from '../components/somiti/DepositPaymentModal';
import { LoanApplicationModal } from '../components/somiti/LoanApplicationModal';
import { SomitiGlobalSearchModal } from '../components/somiti/SomitiGlobalSearchModal';

type SomitiTabType =
  | 'hub_home'
  | 'overview'
  | 'multi_somiti'
  | 'branches'
  | 'members'
  | 'collector_pos'
  | 'accounts_ledger'
  | 'reports'
  | 'security_audit';

export const SomitiPage: React.FC<{ onNavigateHome?: () => void }> = ({ onNavigateHome }) => {
  const { isBn } = useTranslation();

  // Primary State - default to hub_home for the independent mini portal experience
  const [activeTab, setActiveTab] = useState<SomitiTabType>('hub_home');
  const [selectedSomitiId, setSelectedSomitiId] = useState<string>('ALL');
  const [currentRole, setCurrentRole] = useState<ERPUserRole>('SUPER_ADMIN');

  // ERP Datasets
  const [somitis, setSomitis] = useState<Somiti[]>(INITIAL_SOMITIS);
  const [branches, setBranches] = useState<SomitiBranch[]>(INITIAL_BRANCHES);
  const [members, setMembers] = useState<SomitiMember[]>(INITIAL_MEMBERS);
  const [loans, setLoans] = useState<SomitiLoanApp[]>(INITIAL_LOANS);
  const [transactions, setTransactions] = useState<SavingsTransaction[]>(INITIAL_TRANSACTIONS);
  const [ledgers, setLedgers] = useState<LedgerEntry[]>(INITIAL_LEDGER_ENTRIES);
  const [branchApplications, setBranchApplications] = useState<BranchApplication[]>(INITIAL_BRANCH_APPLICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Modals Visibility
  const [showMember360, setShowMember360] = useState(false);
  const [selectedMember, setSelectedMember] = useState<SomitiMember | null>(null);

  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<SavingsTransaction | null>(null);

  const [showBranchApprovalModal, setShowBranchApprovalModal] = useState(false);
  const [showCreateSomitiModal, setShowCreateSomitiModal] = useState(false);
  const [somitiToEdit, setSomitiToEdit] = useState<Somiti | null>(null);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  // Filtered dataset according to selected Somiti (or all)
  const currentSomiti = selectedSomitiId === 'ALL'
    ? null
    : somitis.find((s) => s.id === selectedSomitiId) || null;

  const displaySomitis = selectedSomitiId === 'ALL'
    ? (somitis || [])
    : (somitis || []).filter((s) => s.id === selectedSomitiId);

  const displayBranches = selectedSomitiId === 'ALL'
    ? (branches || [])
    : (branches || []).filter((b) => b.somitiId === selectedSomitiId);

  const displayMembers = selectedSomitiId === 'ALL'
    ? (members || [])
    : (members || []).filter((m) => m.somitiId === selectedSomitiId);

  // Handlers for CRUD & Workflows
  const handleOpenMember360 = (m: SomitiMember) => {
    setSelectedMember(m);
    setShowMember360(true);
  };

  const handleOpenReceipt = (txn: SavingsTransaction) => {
    setSelectedReceipt(txn);
    setShowReceiptModal(true);
  };

  const handleSaveSomiti = (somitiData: Partial<Somiti>) => {
    if (somitiToEdit) {
      setSomitis((prev) =>
        prev.map((s) => (s.id === somitiToEdit.id ? ({ ...s, ...somitiData } as Somiti) : s))
      );
    } else {
      const newSomiti = {
        ...somitiData,
        id: somitiData.id || `SOM-00${somitis.length + 1}`
      } as Somiti;
      setSomitis((prev) => [newSomiti, ...prev]);
    }
    setSomitiToEdit(null);
  };

  const handleToggleSomitiStatus = (somitiId: string) => {
    setSomitis((prev) =>
      prev.map((s) => (s.id === somitiId ? { ...s, status: s.status === 'active' ? 'suspended' : 'active' } : s))
    );
  };

  const handleApplyNewBranch = (newApp: Partial<BranchApplication>) => {
    const appRecord: BranchApplication = {
      id: `APP-BR-${Date.now()}`,
      proposedBranchName: newApp.proposedBranchName || 'নতুন শাখা',
      somitiId: newApp.somitiId || 'SOM-001',
      somitiName: newApp.somitiName || 'এসকাডো ইয়ুথ সমবায় সমিতি',
      district: newApp.district || 'ঢাকা',
      upazila: newApp.upazila || '',
      unionWard: newApp.unionWard || '',
      address: newApp.address || '',
      applicantName: newApp.applicantName || '',
      applicantNid: newApp.applicantNid || '',
      applicantMobile: newApp.applicantMobile || '',
      applicantEmail: newApp.applicantEmail || '',
      proposedManager: newApp.proposedManager || '',
      officeInfo: newApp.officeInfo || '',
      businessPlan: newApp.businessPlan || '',
      documentsAttached: newApp.documentsAttached || ['NID.pdf'],
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    setBranchApplications((prev) => [appRecord, ...prev]);
  };

  const handleUpdateBranchAppStatus = (appId: string, status: any, notes?: string) => {
    setBranchApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status, reviewNotes: notes } : a))
    );

    // If approved, dynamically generate a live branch in the system!
    if (status === 'approved') {
      const targetApp = branchApplications.find((a) => a.id === appId);
      if (targetApp) {
        const newBranch: SomitiBranch = {
          id: `BR-${targetApp.district.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 90 + 10)}`,
          somitiId: targetApp.somitiId,
          somitiName: targetApp.somitiName,
          branchCode: `B-${targetApp.district.substring(0, 2).toUpperCase()}`,
          code: `B-${targetApp.district.substring(0, 2).toUpperCase()}`,
          nameBn: targetApp.proposedBranchName,
          nameEn: `${targetApp.district} Model Branch`,
          district: targetApp.district,
          upazila: targetApp.upazila,
          address: targetApp.address || `${targetApp.district} সদর রোড`,
          status: 'active',
          managerName: targetApp.proposedManager,
          managerPhone: targetApp.applicantMobile,
          membersCount: 1,
          todayCollection: 0,
          monthlyCollection: 0,
          savingsBalance: 0,
          totalLoanDisbursed: 0,
          totalRecovery: 0,
          outstanding: 0,
          monthlyExpenses: 15000,
          staff: [
            { name: targetApp.proposedManager, role: 'Branch Manager', phone: targetApp.applicantMobile }
          ],
          collectionPoints: ['প্রধান ক্যাশ কাউন্টার']
        };
        setBranches((prev) => [newBranch, ...prev]);
      }
    }
  };

  const handlePaymentDepositSuccess = (newTxn: SavingsTransaction) => {
    setTransactions((prev) => [newTxn, ...prev]);

    // Update member savings balance
    setMembers((prev) =>
      prev.map((m) => (m.id === newTxn.memberId ? { ...m, savingsBalance: m.savingsBalance + newTxn.amount } : m))
    );

    // Add ledger entry
    const newLedger: LedgerEntry = {
      id: `LED-${Date.now()}`,
      voucherNo: `VCH-${Math.floor(Math.random() * 90000 + 10000)}`,
      somitiId: newTxn.somitiId,
      somitiName: newTxn.somitiName,
      branchId: newTxn.branchId,
      branchName: newTxn.branchName,
      date: newTxn.date,
      accountHead: 'সঞ্চয় আমানত হিসাব (Savings Deposit)',
      narration: `সদস্য ${newTxn.memberName} (${newTxn.memberId}) এর সঞ্চয় জমা via ${newTxn.paymentMethod}`,
      debit: newTxn.amount,
      credit: 0,
      balanceAfter: 2850000 + newTxn.amount
    };
    setLedgers((prev) => [newLedger, ...prev]);

    // Show Digital Receipt
    setSelectedReceipt(newTxn);
    setShowReceiptModal(true);
  };

  const handleApplyLoanSuccess = (newLoan: SomitiLoanApp) => {
    setLoans((prev) => [newLoan, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Hub Header Branding & Navigation */}
      <HubHeader
        hubId="somiti"
        activeMenuRoute={activeTab === 'hub_home' ? 'home' : activeTab}
        onSelectMenu={(route) => {
          if (route === 'home') {
            setActiveTab('hub_home');
          } else if (route === 'erp') {
            setActiveTab('overview');
          } else if (
            route === 'multi_somiti' ||
            route === 'branches' ||
            route === 'members' ||
            route === 'collector_pos' ||
            route === 'accounts_ledger' ||
            route === 'reports'
          ) {
            setActiveTab(route as SomitiTabType);
          } else {
            setActiveTab('overview');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPortalLogin={() => setActiveTab('overview')}
        onBackToMasterPortal={() => {
          if (onNavigateHome) {
            onNavigateHome();
          }
        }}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
        {/* SUB-VIEW 1: INDEPENDENT SOMITI HUB HOMEPAGE */}
        {activeTab === 'hub_home' ? (
          <SomitiHubHomepage
            somitis={somitis}
            onOpenERP={(tab) => {
              setActiveTab((tab as SomitiTabType) || 'overview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSomitiDetail={(sId) => {
              setSelectedSomitiId(sId);
              setActiveTab('members');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenBranchApply={() => setShowBranchApprovalModal(true)}
            onOpenDeposit={() => setShowDepositModal(true)}
            onOpenLoanApply={() => setShowLoanModal(true)}
            onOpenSearch={() => setShowGlobalSearch(true)}
          />
        ) : (
          /* SUB-VIEW 2: SOMITI ERP & MANAGEMENT DASHBOARDS */
          <div className="space-y-6 animate-fadeIn">
            {/* Breadcrumb & Return to Hub Home Action Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <button
                  onClick={() => setActiveTab('hub_home')}
                  className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>সমিতি হাব হোমপেজ</span>
                </button>
                <span>/</span>
                <span className="text-slate-900 font-extrabold">ইআরপি ড্যাশবোর্ড ও ম্যানেজমেন্ট</span>
              </div>

              <button
                onClick={() => setActiveTab('hub_home')}
                className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>← হাব হোমপেজে ফিরুন</span>
              </button>
            </div>

            {/* Top Banner & Control Bar */}
            <div className="space-y-4">
              {/* Dynamic Control Bar (Somiti Switcher, Role Simulator, Quick Actions) */}
              <SomitiTopControlBar
                somitis={somitis}
                selectedSomitiId={selectedSomitiId}
                onSelectSomiti={setSelectedSomitiId}
                currentRole={currentRole}
                onChangeRole={setCurrentRole}
                onOpenGlobalSearch={() => setShowGlobalSearch(true)}
                onOpenCreateSomiti={() => {
                  setSomitiToEdit(null);
                  setShowCreateSomitiModal(true);
                }}
                onOpenBranchApproval={() => setShowBranchApprovalModal(true)}
                onOpenDeposit={() => setShowDepositModal(true)}
                onOpenLoanApply={() => setShowLoanModal(true)}
                onOpenPOS={() => setActiveTab('collector_pos')}
              />
            </div>

            {/* Main ERP Navigation Tabs Bar */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-2 text-xs font-bold">
              {[
                { id: 'overview', label: '📊 ওভারভিউ (Overview)', icon: BarChart2 },
                { id: 'multi_somiti', label: '🏛️ মাল্টি-সমিতি হাব (Multi-Somiti)', icon: Landmark },
                { id: 'branches', label: '📍 শাখা নেটওয়ার্ক (Branches)', icon: Building2 },
                { id: 'members', label: '👥 সদস্য ৩৬০° ডিরেক্টরি (Members 360)', icon: Users },
                { id: 'collector_pos', label: '📱 ফিল্ড POS কালেকশন (Mobile POS)', icon: Smartphone },
                { id: 'accounts_ledger', label: '📒 সেন্ট্রাল অ্যাকাউন্টিং ও লেজার', icon: Scale },
                { id: 'reports', label: '📈 মাস্টার রিপোর্টস ও এক্সপোর্ট', icon: FileSpreadsheet },
                { id: 'security_audit', label: '🛡️ নিরাপত্তা ও অডিট ট্রেইল', icon: ShieldCheck }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SomitiTabType)}
                    className={`px-4 py-3 rounded-2xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-emerald-700 text-white shadow-md font-black'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-emerald-200' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* VIEW 1: SUPER ADMIN CENTRAL OVERVIEW */}
            {activeTab === 'overview' && (
              <SuperAdminOverview
                somitis={displaySomitis}
                branches={displayBranches}
                branchApplications={branchApplications}
                members={displayMembers}
                loans={loans}
                onSelectMember={handleOpenMember360}
                onOpenBranchApproval={() => setShowBranchApprovalModal(true)}
                onOpenDeposit={() => setShowDepositModal(true)}
                onOpenLoanApply={() => setShowLoanModal(true)}
              />
            )}

            {/* VIEW 2: MULTI-SOMITI MANAGEMENT */}
            {activeTab === 'multi_somiti' && (
              <MultiSomitiView
                somitis={somitis}
                onOpenCreateSomiti={() => {
                  setSomitiToEdit(null);
                  setShowCreateSomitiModal(true);
                }}
                onEditSomiti={(s) => {
                  setSomitiToEdit(s);
                  setShowCreateSomitiModal(true);
                }}
                onToggleStatus={handleToggleSomitiStatus}
              />
            )}

            {/* VIEW 3: BRANCHES & FIELD OPERATIONS */}
            {activeTab === 'branches' && (
              <BranchManagementView
                branches={displayBranches}
                somitis={somitis}
                onOpenBranchApproval={() => setShowBranchApprovalModal(true)}
              />
            )}

            {/* VIEW 4: MEMBERS 360° MASTER DIRECTORY */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-base font-black text-slate-900">
                        {isBn ? 'সদস্য ৩৬০° মাস্টার ডিরেক্টরি ও ডিজিটাল পাসবুক' : 'Member 360° Master Directory & Passbook'}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      সদস্যের সঞ্চয় হিসাব, ঋণ স্টেটমেন্ট, জামিনদার লিঙ্ক ও ডিজিটাল আইডি কার্ড
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowDepositModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <PiggyBank className="w-4 h-4" />
                      <span>+ সঞ্চয় জমা</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayMembers.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleOpenMember360(m)}
                      className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition cursor-pointer space-y-4 group hover:border-emerald-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={m.photoUrl}
                            alt={m.fullName}
                            className="w-13 h-13 rounded-2xl object-cover border-2 border-emerald-400 group-hover:scale-105 transition"
                          />
                          <div>
                            <h4 className="font-black text-slate-900 text-sm group-hover:text-emerald-800 transition">
                              {m.fullName}
                            </h4>
                            <p className="text-xs text-slate-500 font-mono">ID: {m.id}</p>
                            <span className="text-[10px] text-emerald-700 font-bold block">{m.somitiName}</span>
                          </div>
                        </div>

                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {m.memberStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold">সঞ্চয় স্থিতি</span>
                          <span className="font-black text-emerald-700 text-sm">৳ {(m?.savingsBalance || 0).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold">ঋণ বকেয়া</span>
                          <span className="font-black text-rose-700 text-sm">৳ {(m?.outstanding || 0).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold text-emerald-800 pt-1">
                        <span>সম্পূর্ণ ৩৬০° প্রোফাইল ও পাসবুক</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 5: MOBILE COLLECTOR POS */}
            {activeTab === 'collector_pos' && (
              <MobileCollectorPOS
                members={displayMembers}
                onCollectSuccess={handlePaymentDepositSuccess}
                onOpenReceipt={handleOpenReceipt}
              />
            )}

            {/* VIEW 6: CENTRAL ACCOUNTS & GENERAL LEDGER */}
            {activeTab === 'accounts_ledger' && (
              <CentralAccountsView
                ledgers={ledgers}
                somitis={somitis}
              />
            )}

            {/* VIEW 7: MASTER REPORTS */}
            {activeTab === 'reports' && (
              <MasterReportsView
                somitis={somitis}
                branches={branches}
              />
            )}

            {/* VIEW 8: SECURITY & AUDIT */}
            {activeTab === 'security_audit' && (
              <SecurityAuditView
                auditLogs={auditLogs}
              />
            )}
          </div>
        )}
      </main>

      {/* ================= MODALS REGISTRY ================= */}

      {/* Member 360° Modal */}
      {showMember360 && selectedMember && (
        <Member360Modal
          isOpen={showMember360}
          onClose={() => setShowMember360(false)}
          member={selectedMember}
          transactions={(transactions || []).filter((t) => t.memberId === selectedMember.id)}
          loans={(loans || []).filter((l) => l.memberId === selectedMember.id)}
          onOpenReceipt={(txn) => {
            setShowMember360(false);
            handleOpenReceipt(txn);
          }}
        />
      )}

      {/* Digital Receipt Modal */}
      {showReceiptModal && selectedReceipt && (
        <DigitalReceiptModal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          transaction={selectedReceipt}
        />
      )}

      {/* Branch Approval Workflow Modal */}
      {showBranchApprovalModal && (
        <BranchApprovalWorkflowModal
          isOpen={showBranchApprovalModal}
          onClose={() => setShowBranchApprovalModal(false)}
          applications={branchApplications}
          somitis={somitis}
          onApplyNewBranch={handleApplyNewBranch}
          onUpdateAppStatus={handleUpdateBranchAppStatus}
        />
      )}

      {/* Somiti Create/Edit Modal */}
      {showCreateSomitiModal && (
        <SomitiCreateEditModal
          isOpen={showCreateSomitiModal}
          onClose={() => setShowCreateSomitiModal(false)}
          somitiToEdit={somitiToEdit}
          onSaveSomiti={handleSaveSomiti}
        />
      )}

      {/* Deposit & Payment Gateway Modal */}
      {showDepositModal && (
        <DepositPaymentModal
          isOpen={showDepositModal}
          onClose={() => setShowDepositModal(false)}
          selectedMember={selectedMember}
          members={members}
          onPaymentSuccess={handlePaymentDepositSuccess}
        />
      )}

      {/* Loan Application Modal */}
      {showLoanModal && (
        <LoanApplicationModal
          isOpen={showLoanModal}
          onClose={() => setShowLoanModal(false)}
          selectedMember={selectedMember}
          members={members}
          onApplyLoanSuccess={handleApplyLoanSuccess}
        />
      )}

      {/* Global Smart Search Modal */}
      {showGlobalSearch && (
        <SomitiGlobalSearchModal
          isOpen={showGlobalSearch}
          onClose={() => setShowGlobalSearch(false)}
          members={members}
          somitis={somitis}
          branches={branches}
          transactions={transactions}
          loans={loans}
          onSelectMember={handleOpenMember360}
          onSelectReceipt={handleOpenReceipt}
        />
      )}

    </div>
  );
};
