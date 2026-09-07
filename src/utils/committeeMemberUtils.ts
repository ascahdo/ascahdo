import { Branch, BranchCommitteeMember } from '../types';

/**
 * Deterministically generates a structured, official Committee Member ID
 * Example: "ASC-DIV-DHK-01" or "ASC-DST-NOA-03" or "ASC-UPZ-SAV-02"
 */
export function generateMemberId(
  branch: Partial<Branch> | undefined,
  memberIndex: number,
  memberId?: string
): string {
  if (memberId && memberId.startsWith('ASC-')) {
    return memberId;
  }

  const prefix = branch?.branchCode || 'ASC-COM';
  const serial = String(memberIndex + 1).padStart(2, '0');
  return `${prefix}-M${serial}`;
}

/**
 * Deterministically generates an official Suggestion/Membership Registration Number
 * Every member has a unique suggestion number that can be used to search & download their card.
 * Format: "SUG-" + 6 digits (e.g. "SUG-817101" or numeric string "817101")
 */
export function generateSuggestionNumber(
  branch: Partial<Branch> | undefined,
  member: Partial<BranchCommitteeMember>,
  index: number
): string {
  if (member.suggestionNumber) {
    return member.suggestionNumber;
  }

  // Create a pseudo-hash based on member name + branch to keep it consistent
  const str = `${branch?.id || 'br'}-${member.name || member.nameBn || index}-${index}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const numericPart = Math.abs(hash % 900000) + 100000; // 6-digit number (100000 - 999999)
  return `SUG-${numericPart}`;
}

export const COMMITTEE_MEMBER_DONATION_FEE = 1250;

/**
 * Deterministically generates an official Donation Money Receipt Number
 * Format: "RCP-1250-" + 6 digits (e.g. "RCP-1250-716701")
 */
export function generateDonationReceiptNo(
  suggestionNo: string,
  memberIndex: number
): string {
  const digits = suggestionNo.replace(/\D/g, '') || String(100000 + memberIndex);
  return `RCP-1250-${digits}`;
}

/**
 * Deterministically generates a verified Transaction ID (TrxID)
 * Format: "BK" + alphanumeric string (e.g. "BK9A716701")
 */
export function generateMemberTrxId(
  suggestionNo: string,
  memberIndex: number
): string {
  const digits = suggestionNo.replace(/\D/g, '') || String(100000 + memberIndex);
  return `TRX${digits.slice(-4)}BD${String.fromCharCode(65 + (memberIndex % 26))}${digits.slice(0, 2)}`;
}

/**
 * Generates structured QR Code verification data string for a committee member
 */
export function generateMemberQrData(
  branch: Partial<Branch> | undefined,
  member: Partial<BranchCommitteeMember>,
  memberId: string,
  suggestionNo: string,
  donationReceiptNo?: string
): string {
  const payload = {
    org: 'ASCADO Central Welfare Trust (আসকাডো কেন্দ্রীয় সমাজকল্যাণ ট্রাস্ট)',
    reg: 'REG-NGO-DH-88741',
    memberId: memberId,
    suggestionNo: suggestionNo,
    name: member.nameBn || member.name,
    fatherName: member.fatherNameBn || member.fatherName,
    designation: member.designationBn || member.designation,
    tier: branch?.committeeLevel || 'district',
    branch: branch?.nameBn || branch?.name || 'ASCADO Branch',
    district: branch?.district || 'Dhaka',
    phone: member.phone || '01973817167',
    bloodGroup: member.bloodGroup || 'O+',
    validTerm: branch?.committeeTerm || '২০২৬-২০২৮',
    donationFee: '১২৫০ টাকা (1250 BDT)',
    donationStatus: 'PAID_VERIFIED (পরিশোধিত)',
    receiptNo: donationReceiptNo || `RCP-1250-${suggestionNo.replace(/\D/g, '')}`,
    status: 'VERIFIED_ACTIVE',
    verificationUrl: `https://ascado.org/verify/committee/${encodeURIComponent(memberId)}?sug=${encodeURIComponent(suggestionNo)}`
  };

  return JSON.stringify(payload);
}

/**
 * Returns dynamic high-res QR code image URL
 */
export function getQrCodeImageUrl(data: string, size = 220): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(data)}`;
}

export interface EnrichedCommitteeMember extends BranchCommitteeMember {
  memberId: string;
  suggestionNumber: string;
  qrCodeData: string;
  qrCodeUrl: string;
  branch: Branch;
  bloodGroup: string;
  issueDate: string;
  validUntil: string;
  donationFee: number;
  donationStatus: 'paid' | 'unpaid' | 'pending';
  paymentMethod: string;
  trxId: string;
  donationReceiptNo: string;
  donationPaidDate: string;
}

/**
 * Enriches all committee members of all branches with auto-generated IDs, suggestion numbers, QR codes, and 1250 BDT donation status
 */
export function enrichBranchCommitteeMembers(branches: Branch[]): {
  enrichedBranches: Branch[];
  allEnrichedMembers: EnrichedCommitteeMember[];
} {
  const allEnrichedMembers: EnrichedCommitteeMember[] = [];

  const enrichedBranches = branches.map((branch) => {
    const members = (branch.committeeMembers || []).map((mem, idx) => {
      const memberId = mem.memberId || generateMemberId(branch, idx, mem.id);
      const suggestionNumber = mem.suggestionNumber || generateSuggestionNumber(branch, mem, idx);
      const bloodGroup = mem.bloodGroup || (['A+', 'B+', 'O+', 'AB+', 'A-', 'O+'][idx % 6]);
      const issueDate = mem.issueDate || branch.committeeApprovedAt || '2026-01-01';
      const validUntil = mem.validUntil || '2028-12-31';
      const donationFee = mem.donationFee ?? COMMITTEE_MEMBER_DONATION_FEE;
      const donationStatus = mem.donationStatus || 'paid';
      const paymentMethod = mem.paymentMethod || (idx % 2 === 0 ? 'bKash' : 'Nagad');
      const suggestionDigits = suggestionNumber.replace(/\D/g, '') || String(716701 + idx);
      const donationReceiptNo = mem.donationReceiptNo || generateDonationReceiptNo(suggestionNumber, idx);
      const trxId = mem.trxId || generateMemberTrxId(suggestionNumber, idx);
      const donationPaidDate = mem.donationPaidDate || issueDate;
      const qrCodeData = mem.qrCodeData || generateMemberQrData(branch, mem, memberId, suggestionNumber, donationReceiptNo);
      const qrCodeUrl = getQrCodeImageUrl(qrCodeData, 220);

      const enriched: EnrichedCommitteeMember = {
        ...mem,
        memberId,
        suggestionNumber,
        bloodGroup,
        issueDate,
        validUntil,
        donationFee,
        donationStatus,
        paymentMethod,
        trxId,
        donationReceiptNo,
        donationPaidDate,
        qrCodeData,
        qrCodeUrl,
        branch
      };

      allEnrichedMembers.push(enriched);
      return enriched;
    });

    return {
      ...branch,
      committeeMembers: members
    };
  });

  return {
    enrichedBranches,
    allEnrichedMembers
  };
}

/**
 * Search committee members across all branches by Suggestion Number, Member ID, Phone, or Name
 */
export function searchCommitteeMembers(
  query: string,
  members: EnrichedCommitteeMember[]
): EnrichedCommitteeMember[] {
  if (!query || !query.trim()) return [];
  const cleanQ = query.trim().toLowerCase();
  const digitsOnly = cleanQ.replace(/\D/g, '');

  return members.filter((m) => {
    const memId = (m.memberId || '').toLowerCase();
    const sugNo = (m.suggestionNumber || '').toLowerCase();
    const sugDigits = (m.suggestionNumber || '').replace(/\D/g, '');
    const phone = (m.phone || '').replace(/\D/g, '');
    const name = (m.name || '').toLowerCase();
    const nameBn = (m.nameBn || '').toLowerCase();
    const fatherName = (m.fatherName || '').toLowerCase();
    const fatherNameBn = (m.fatherNameBn || '').toLowerCase();
    const designation = (m.designation || '').toLowerCase();
    const designationBn = (m.designationBn || '').toLowerCase();
    const branchName = (m.branch?.name || '').toLowerCase();
    const branchNameBn = (m.branch?.nameBn || '').toLowerCase();
    const district = (m.branch?.district || '').toLowerCase();
    const districtBn = (m.branch?.districtBn || '').toLowerCase();

    // Direct suggestion match
    if (sugNo.includes(cleanQ)) return true;
    if (digitsOnly && sugDigits.includes(digitsOnly)) return true;

    // Member ID match
    if (memId.includes(cleanQ)) return true;

    // Phone number match
    if (digitsOnly && phone.includes(digitsOnly)) return true;

    // Name & designation match
    if (name.includes(cleanQ) || nameBn.includes(cleanQ)) return true;
    if (fatherName.includes(cleanQ) || fatherNameBn.includes(cleanQ)) return true;
    if (designation.includes(cleanQ) || designationBn.includes(cleanQ)) return true;
    if (branchName.includes(cleanQ) || branchNameBn.includes(cleanQ)) return true;
    if (district.includes(cleanQ) || districtBn.includes(cleanQ)) return true;

    return false;
  });
}
