export type BloodGroupType = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export type BloodComponentType = 'whole_blood' | 'prbc' | 'ffp' | 'platelets' | 'cryo';

export interface BloodBankOrganization {
  id: string;
  name: string;
  nameBn: string;
  code: string;
  regNumber: string;
  division: string;
  district: string;
  upazila: string;
  address: string;
  phone: string;
  emergencyHotline: string;
  email: string;
  managerName: string;
  managerPhone: string;
  is24x7: boolean;
  hasComponentSeparation: boolean;
  hasApheresis: boolean;
  totalDonors: number;
  totalUnitsCollected: number;
  activeStockUnits: number;
  status: 'active' | 'under_review' | 'inactive';
  rating: number;
  branchesCount: number;
  licenseExpiry: string;
  logo?: string;
  coverImage?: string;
}

export interface BloodHubBranch {
  id: string;
  bloodBankId: string;
  name: string;
  nameBn: string;
  branchCode: string;
  district: string;
  upazila: string;
  address: string;
  contactPerson: string;
  phone: string;
  status: 'active' | 'inactive';
  storageCapacityBags: number;
  currentStockBags: number;
}

export interface BloodStockItem {
  id: string;
  bloodBankId: string;
  bloodBankName: string;
  bloodGroup: BloodGroupType;
  component: BloodComponentType;
  availableBags: number;
  reservedBags: number;
  criticalThreshold: number;
  temperatureCelsius: string;
  storageLocation: string;
  lastTestedAt: string;
  status: 'normal' | 'low' | 'critical' | 'excess';
}

export interface HubBloodDonor {
  id: string;
  donorCode: string;
  fullName: string;
  bloodGroup: BloodGroupType;
  phone: string;
  email?: string;
  nid?: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  weightKg: number;
  division: string;
  district: string;
  upazila: string;
  presentAddress: string;
  lastDonationDate?: string;
  totalDonations: number;
  isAvailable: boolean;
  isRegularDonor: boolean;
  associatedBloodBankId: string;
  membershipTier: 'general' | 'club_life_member' | 'honorary' | 'hero';
  membershipFeePaid: boolean;
  membershipFeeAmount: number; // e.g. 1250
  membershipPaymentTrxId?: string;
  membershipPaymentMethod?: string;
  membershipPaidDate?: string;
  donorCardIssued: boolean;
  avatarUrl?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  createdAt: string;
}

export interface EmergencyBloodRequisition {
  id: string;
  requisitionNo: string;
  patientName: string;
  patientAge: number;
  patientGender: 'male' | 'female';
  bloodGroup: BloodGroupType;
  componentNeeded: BloodComponentType;
  bagsNeeded: number;
  bagsFulfilled: number;
  hospitalName: string;
  hospitalBedWard?: string;
  district: string;
  upazila: string;
  doctorName?: string;
  contactPerson: string;
  contactPhone: string;
  urgency: 'critical_emergency' | 'high' | 'routine';
  reasonDisease: string; // e.g., Cesarean, Accident, Thalassaemia, Cancer Chemotherapy, Surgery
  requiredDate: string;
  requiredTime?: string;
  hemoglobinLevel?: string;
  crossMatchDone: boolean;
  status: 'pending' | 'donor_assigned' | 'collected' | 'fulfilled' | 'cancelled';
  assignedBloodBankId?: string;
  createdAt: string;
}

export interface BloodTransferOrder {
  id: string;
  transferCode: string;
  fromBloodBankId: string;
  fromBloodBankName: string;
  toBloodBankId: string;
  toBloodBankName: string;
  bloodGroup: BloodGroupType;
  component: BloodComponentType;
  unitsCount: number;
  courierName: string;
  courierPhone: string;
  coldBoxTemp: string;
  dispatchedAt: string;
  receivedAt?: string;
  status: 'in_transit' | 'delivered' | 'cancelled';
  purpose: string;
}

export interface BloodCampEvent {
  id: string;
  title: string;
  titleBn: string;
  organizerBloodBankId: string;
  organizerName: string;
  venue: string;
  venueBn: string;
  district: string;
  upazila: string;
  startDate: string;
  endDate: string;
  timeSlot: string;
  targetBags: number;
  registeredDonorsCount: number;
  collectedBagsCount: number;
  coordinatorName: string;
  coordinatorPhone: string;
  bannerImage: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  allowOnlinePreReg: boolean;
}

export interface ThalassaemiaPatient {
  id: string;
  regNo: string;
  name: string;
  age: number;
  bloodGroup: BloodGroupType;
  district: string;
  upazila: string;
  guardianName: string;
  contactPhone: string;
  requiredBagsPerMonth: number;
  lastTransfusionDate: string;
  nextTransfusionDue: string;
  assignedBloodBankId: string;
  status: 'active' | 'under_care';
}

// Aliases for compatibility
export type BloodInventoryStockItem = BloodStockItem;
export type BloodRequisition = EmergencyBloodRequisition;
export type BloodCamp = BloodCampEvent;
export type ThalassaemiaPatientRecord = ThalassaemiaPatient;

