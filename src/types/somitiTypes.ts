export type SomitiStatus = 'active' | 'suspended' | 'archived';

export interface SomitiExecutive {
  name: string;
  phone: string;
  email?: string;
  nid?: string;
  photoUrl?: string;
}

export interface Somiti {
  id: string; // e.g. SOM-001
  code: string;
  nameBn: string;
  nameEn: string;
  regNumber: string;
  logo: string;
  bannerUrl?: string;
  sloganBn?: string;
  sloganEn?: string;
  district: string;
  upazila: string;
  address: string;
  phone: string;
  email: string;
  establishedYear: number;
  president: SomitiExecutive;
  secretary: SomitiExecutive;
  treasurer: SomitiExecutive;
  manager: SomitiExecutive;
  bankName: string;
  bankAccount: string;
  routingNumber: string;
  status: SomitiStatus;
  totalSavings: number;
  totalLoans: number;
  totalRecovery: number;
  totalOutstanding: number;
  membersCount: number;
  branchesCount: number;
  rulesDocUrl?: string;
  createdAt: string;
}

export type BranchAppStatus = 'pending' | 'under_review' | 'verification' | 'approved' | 'rejected' | 'suspended';

export interface BranchApplication {
  id: string; // e.g. APP-BR-102
  proposedBranchName: string;
  somitiId: string;
  somitiName: string;
  district: string;
  upazila: string;
  unionWard: string;
  address: string;
  applicantName: string;
  applicantNid: string;
  applicantMobile: string;
  applicantEmail: string;
  proposedManager: string;
  officeInfo: string;
  businessPlan: string;
  documentsAttached: string[];
  status: BranchAppStatus;
  appliedDate: string;
  reviewedBy?: string;
  reviewNotes?: string;
  approvedBranchId?: string;
  verificationOfficer?: string;
}

export interface BranchStaff {
  id: string;
  name: string;
  role: 'Branch Manager' | 'Assistant Manager' | 'Accounts Officer' | 'Loan Officer' | 'Field Officer' | 'Collector' | 'Data Entry Operator';
  phone: string;
  email: string;
  joinedDate: string;
  active: boolean;
  photoUrl?: string;
}

export interface SomitiBranch {
  id: string; // e.g. BR-DHK-01
  somitiId: string;
  somitiName: string;
  branchCode: string;
  code?: string;
  nameBn: string;
  nameEn: string;
  district: string;
  upazila: string;
  address: string;
  managerName: string;
  managerPhone: string;
  managerEmail?: string;
  staffList?: BranchStaff[];
  staff?: Array<{ name: string; role: string; phone: string }>;
  collectionPoints?: string[];
  membersCount: number;
  todayCollection: number;
  monthlyCollection: number;
  totalSavings?: number;
  savingsBalance?: number;
  totalLoans?: number;
  totalLoanDisbursed?: number;
  recoveryRate?: number; // in %
  totalRecovery?: number;
  outstanding: number;
  expenses?: number;
  monthlyExpenses?: number;
  status: 'active' | 'suspended' | 'pending';
  performanceRating?: number; // 1-5
  createdAt?: string;
}

export type MemberStatusType = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface SomitiMember {
  id: string; // e.g. AS-000125
  somitiId: string;
  somitiName: string;
  branchId: string;
  branchName: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  nid: string;
  mobile: string;
  email?: string;
  address: string;
  district: string;
  upazila: string;
  occupation: string;
  photoUrl: string;
  nomineeName: string;
  nomineeRelation: string;
  nomineeNid: string;
  nomineeMobile: string;
  emergencyContact: string;
  membershipDate: string;
  memberStatus: MemberStatusType;
  savingsBalance: number;
  totalDeposit: number;
  activeLoan: number;
  outstanding: number;
  nextInstallmentAmount: number;
  nextInstallmentDate: string;
  guarantorForMemberIds: string[];
}

export type SavingsProductType = 
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'general'
  | 'dps'
  | 'special'
  | 'share'
  | 'fixed'
  | 'emergency';

export interface SavingsProduct {
  id: string;
  code: string;
  nameBn: string;
  nameEn: string;
  type: SavingsProductType;
  interestRate: number; // e.g. 6.5
  minDeposit: number;
  durationMonths: number;
  descriptionBn: string;
  descriptionEn: string;
}

export interface SavingsTransaction {
  id: string;
  receiptNo: string;
  trxId: string;
  memberId: string;
  memberName: string;
  somitiId: string;
  somitiName: string;
  branchId: string;
  branchName: string;
  productType: SavingsProductType;
  amount: number;
  transactionType: 'deposit' | 'withdrawal';
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer' | 'Card' | 'Cash' | 'Online Gateway';
  collectorName: string;
  date: string;
  time: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  balanceAfter: number;
  verifiedBy?: string;
  qrCodeToken?: string;
}

export type LoanProductType =
  | 'general'
  | 'business'
  | 'emergency'
  | 'education'
  | 'agriculture'
  | 'youth'
  | 'women_entrepreneur';

export interface LoanProduct {
  id: string;
  code: string;
  nameBn: string;
  nameEn: string;
  type: LoanProductType;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  maxTermMonths: number;
  descriptionBn: string;
}

export interface LoanGuarantor {
  id: string;
  name: string;
  nid: string;
  mobile: string;
  address: string;
  relation: string;
  occupation: string;
  activeGuaranteesCount: number;
  totalGuaranteedAmount: number;
  maxGuaranteeLimit: number;
  photoUrl?: string;
}

export type LoanWorkflowStep = 
  | 'APPLICATION'
  | 'DOCUMENT_VERIFICATION'
  | 'FIELD_VERIFICATION'
  | 'GUARANTOR_CHECK'
  | 'LOAN_OFFICER'
  | 'MANAGER_RECOMMENDATION'
  | 'APPROVAL'
  | 'DISBURSEMENT'
  | 'INSTALLMENT'
  | 'CLOSED'
  | 'REJECTED';

export interface InstallmentSchedule {
  installmentNo: number;
  dueDate: string;
  amount: number;
  paidAmount: number;
  lateFee: number;
  paymentStatus: 'PAID' | 'DUE' | 'OVERDUE' | 'PARTIAL';
  paidDate?: string;
  trxId?: string;
  receiptNo?: string;
}

export interface SomitiLoanApp {
  id: string; // e.g. LN-2026-004
  applicationNo: string;
  memberId: string;
  memberName: string;
  memberNid: string;
  memberMobile: string;
  somitiId: string;
  somitiName: string;
  branchId: string;
  branchName: string;
  productType: LoanProductType;
  loanAmount: number;
  purpose: string;
  termMonths: number;
  interestRate: number;
  totalInterest: number;
  totalPayable: number;
  monthlyInstallment: number;
  guarantors: LoanGuarantor[];
  workflowStep: LoanWorkflowStep;
  appliedDate: string;
  approvedDate?: string;
  disbursedDate?: string;
  disbursedMethod?: string;
  totalPaid: number;
  totalDue: number;
  installments: InstallmentSchedule[];
  defaulterStatus: boolean;
  remarks?: string;
}

export interface CentralLedgerEntry {
  id: string;
  somitiId: string;
  somitiName: string;
  branchId: string;
  branchName: string;
  date: string;
  category?: 'CASH_BOOK' | 'BANK_BOOK' | 'INCOME' | 'EXPENSE' | 'JOURNAL' | 'RECEIVABLE' | 'PAYABLE';
  accountHead: string;
  description?: string;
  narration?: string;
  debit: number;
  credit: number;
  balance?: number;
  balanceAfter?: number;
  paymentMethod?: string;
  referenceTrxId?: string;
  voucherNo: string;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  somitiName: string;
  action: 'CREATE' | 'EDIT' | 'APPROVE' | 'REJECT' | 'DELETE' | 'DISBURSE' | 'DEPOSIT' | 'LOGIN';
  entityType: 'SOMITI' | 'BRANCH' | 'MEMBER' | 'SAVINGS' | 'LOAN' | 'ACCOUNT' | 'SECURITY';
  targetId: string;
  details: string;
  ipAddress: string;
  device: string;
}

export type LedgerEntry = CentralLedgerEntry;
export type AuditLogEntry = AuditLogRecord;

export type ERPUserRole =
  | 'SUPER_ADMIN'
  | 'NGO_ADMIN'
  | 'SOMITI_ADMIN'
  | 'BRANCH_MANAGER'
  | 'ACCOUNTS_OFFICER'
  | 'LOAN_OFFICER'
  | 'COLLECTOR'
  | 'MEMBER';
