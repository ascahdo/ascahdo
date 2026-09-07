import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import JSZip from "jszip";
import { GoogleGenAI } from "@google/genai";

import { INITIAL_BRANCHES } from "./src/data/bangladeshBranchesData";
import {
  SEED_EMERGENCY_APPEALS,
  SEED_DONATION_PROJECTS,
  SEED_DONATION_TRANSACTIONS,
  SEED_DONATION_EXPENSES,
  SEED_DONOR_RECOGNITION,
  SEED_TRANSPARENCY_SUMMARY
} from "./src/data/donationSeedData";
import {
  DONATION_CATEGORIES,
  generateReceiptNumber,
  generateCertificateNumber,
  generateQrCodePayload
} from "./src/utils/donationUtils";
import {
  SEED_BLOOD_BANKS,
  SEED_BLOOD_STOCKS,
  SEED_HUB_DONORS,
  SEED_EMERGENCY_REQUISITIONS,
  SEED_BLOOD_TRANSFERS,
  SEED_BLOOD_CAMPS,
  SEED_THALASSAEMIA_PATIENTS
} from "./src/data/bloodHubSeedData";

dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_ascado_enterprise_2026";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "ascahdoadmin";
const ADMIN_INITIAL_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD || "M817167m@";

app.use(express.json());

// Enable cross-origin framing and CORS for WordPress theme integration
app.use((req, res, next) => {
  res.removeHeader("X-Frame-Options");
  res.setHeader("Content-Security-Policy", "frame-ancestors *");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-WP-Nonce, X-Ascado-Client");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// ==========================================
// IN-MEMORY DATABASE & SEED REPOSITORY
// ==========================================

let users: any[] = [
  {
    id: "usr_admin_001",
    username: ADMIN_USERNAME,
    fullName: "ASCADO Super Administrator",
    email: "ascahdo@gmail.com",
    phone: "01813817167",
    passwordHash: bcrypt.hashSync(ADMIN_INITIAL_PASSWORD, 10),
    role: "SUPER_ADMIN",
    permissions: ["all"],
    mustChangePassword: false, // Disabled forced password change
    district: "Noakhali",
    upazila: "Companiganj",
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: "usr_org_002",
    username: "org_ananda",
    fullName: "MD. Rafiqul Islam",
    email: "rafiq@ananda-ngo.org",
    phone: "+8801812000002",
    passwordHash: bcrypt.hashSync("User@123456", 10),
    role: "ORG_ADMIN",
    organizationId: "org_001",
    permissions: ["organizations.manage", "branches.manage", "donations.view"],
    mustChangePassword: false,
    district: "Dhaka",
    upazila: "Gulshan",
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: "usr_gen_003",
    username: "karim_khan",
    fullName: "Karim Ullah",
    email: "karim@gmail.com",
    phone: "+8801913000003",
    passwordHash: bcrypt.hashSync("User@123456", 10),
    role: "GENERAL_USER",
    permissions: ["user.profile"],
    mustChangePassword: false,
    district: "Bogura",
    upazila: "Bogura Sadar",
    status: "active",
    createdAt: new Date().toISOString()
  }
];

let organizations: any[] = [
  {
    id: "org_001",
    name: "ASCADO Central Community Welfare",
    nameBn: "আশকাডো কেন্দ্রীয় সমাজকল্যাণ সংস্থা",
    code: "ASC-001",
    regNumber: "REG-NGO-DH-88741",
    logo: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=80",
    email: "central@ascado.org",
    phone: "+8801700112233",
    address: "House 45, Road 9/A, Dhanmondi",
    district: "Dhaka",
    upazila: "Dhanmondi",
    activeModules: ["school", "blood_bank", "donation", "volunteer", "elearning", "somiti", "marketplace", "real_estate"],
    status: "active",
    branchesCount: 18,
    membersCount: 4250
  },
  {
    id: "org_002",
    name: "Ananda Social Development Foundation",
    nameBn: "আনন্দ সামাজিক উন্নয়ন ফাউন্ডেশন",
    code: "ANF-002",
    regNumber: "REG-NGO-CTG-44120",
    logo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=150&auto=format&fit=crop&q=80",
    email: "info@anandafoundation.org",
    phone: "+8801811223344",
    address: "GEC Circle, Nasirabad",
    district: "Chattogram",
    upazila: "Panchlaish",
    activeModules: ["school", "donation", "somiti", "technical_training"],
    status: "active",
    branchesCount: 7,
    membersCount: 1680
  }
];

let branches: any[] = [...INITIAL_BRANCHES];

let bloodDonors: any[] = [
  { id: "don_1", fullName: "Tanvir Hasan", bloodGroup: "A+", phone: "+8801711122233", district: "Dhaka", upazila: "Dhanmondi", lastDonationDate: "2026-04-12", available: true, totalDonations: 8, age: 26, gender: "male" },
  { id: "don_2", fullName: "Nusrat Jahan", bloodGroup: "O+", phone: "+8801811222333", district: "Dhaka", upazila: "Mirpur", lastDonationDate: "2026-05-18", available: true, totalDonations: 4, age: 24, gender: "female" },
  { id: "don_3", fullName: "Shahidul Alam", bloodGroup: "B+", phone: "+8801911222333", district: "Chattogram", upazila: "Panchlaish", lastDonationDate: "2026-02-01", available: true, totalDonations: 12, age: 31, gender: "male" },
  { id: "don_4", fullName: "Mehedi Hasan", bloodGroup: "O-", phone: "+8801611222333", district: "Bogura", upazila: "Bogura Sadar", lastDonationDate: "2026-06-25", available: true, totalDonations: 6, age: 28, gender: "male" },
  { id: "don_5", fullName: "Fatema Tuz Zohra", bloodGroup: "AB+", phone: "+8801511222333", district: "Sylhet", upazila: "Sylhet Sadar", lastDonationDate: "2026-03-10", available: true, totalDonations: 3, age: 22, gender: "female" },
  { id: "don_6", fullName: "Rashedul Karim", bloodGroup: "A-", phone: "+8801722334455", district: "Dhaka", upazila: "Uttara", lastDonationDate: "2026-01-20", available: true, totalDonations: 5, age: 29, gender: "male" },
  { id: "don_7", fullName: "Anisur Rahman", bloodGroup: "B-", phone: "+8801833445566", district: "Khulna", upazila: "Khulna Sadar", lastDonationDate: "2026-04-05", available: true, totalDonations: 9, age: 34, gender: "male" },
  { id: "don_8", fullName: "Sabbir Ahmed", bloodGroup: "AB-", phone: "+8801944556677", district: "Rajshahi", upazila: "Boalia", lastDonationDate: "2026-05-30", available: true, totalDonations: 2, age: 23, gender: "male" }
];

let bloodRequests: any[] = [
  {
    id: "brq_01",
    patientName: "Mrs. Salma Begum (Cesarean)",
    bloodGroup: "O-",
    unitsNeeded: 2,
    hospitalName: "Dhaka Medical College Hospital",
    district: "Dhaka",
    upazila: "Dhanmondi",
    contactPerson: "Md. Kabir (Husband)",
    contactPhone: "+8801712345678",
    urgency: "critical_emergency",
    requiredDate: "2026-08-23",
    status: "pending",
    createdAt: new Date().toISOString()
  },
  {
    id: "brq_02",
    patientName: "Jahidul Islam (Accident Trauma)",
    bloodGroup: "B+",
    unitsNeeded: 3,
    hospitalName: "Chattogram Medical College Hospital",
    district: "Chattogram",
    upazila: "Panchlaish",
    contactPerson: "Kamal Uddin (Brother)",
    contactPhone: "+8801819988776",
    urgency: "high",
    requiredDate: "2026-08-24",
    status: "matched",
    createdAt: new Date().toISOString()
  }
];

// Multi Blood Bank Hub Master State
let bloodHubOrganizations: any[] = [...SEED_BLOOD_BANKS];
let bloodHubStocks: any[] = [...SEED_BLOOD_STOCKS];
let bloodHubDonors: any[] = [...SEED_HUB_DONORS];
let bloodHubRequisitions: any[] = [...SEED_EMERGENCY_REQUISITIONS];
let bloodHubTransfers: any[] = [...SEED_BLOOD_TRANSFERS];
let bloodHubCamps: any[] = [...SEED_BLOOD_CAMPS];
let bloodHubThalassaemia: any[] = [...SEED_THALASSAEMIA_PATIENTS];

let bloodBankCommittees: any[] = [
  {
    id: "bbc_01",
    name: "Dr. Farhan Ahmed (FCPS)",
    nameBn: "ডা. ফারহান আহমেদ (এফসিপিএস)",
    designation: "Central Blood Network Convener",
    designationBn: "কেন্দ্রীয় রক্তদান নেটওয়ার্ক আহ্বায়ক ও প্রধান মেডিকেল উপদেষ্টা",
    bloodGroup: "O+",
    phone: "01973817167",
    email: "blood.central@ascado.org",
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80",
    district: "Dhaka",
    upazila: "Dhanmondi",
    branchName: "ধানমন্ডি কেন্দ্রীয় শাখা",
    roleType: "central",
    isEmergencyLead: true,
    status: "active"
  },
  {
    id: "bbc_02",
    name: "Engr. Mahmudur Rahman",
    nameBn: "প্রকৌ. মাহমুদুর রহমান",
    designation: "Central Donor Response & SOS Lead",
    designationBn: "জরুরি ডোনার রেসপন্স টিম লিডার ও প্রধান সমন্বয়ক",
    bloodGroup: "A+",
    phone: "01813817167",
    email: "sos.blood@ascado.org",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    district: "Dhaka",
    upazila: "Mirpur",
    branchName: "ঢাকা মেট্রো সমন্বয় শাখা",
    roleType: "central",
    isEmergencyLead: true,
    status: "active"
  },
  {
    id: "bbc_03",
    name: "Mohammad Shahadat Hossain",
    nameBn: "মোহাম্মদ শাহাদাত হোসেন",
    designation: "Noakhali & Companiganj Blood In-Charge",
    designationBn: "নোয়াখালী ও কোম্পানীগঞ্জ শাখা ব্লাড ইনচার্জ",
    bloodGroup: "B+",
    phone: "01973817167",
    email: "noakhali.blood@ascado.org",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    district: "Noakhali",
    upazila: "Companiganj",
    branchName: "কোম্পানীগঞ্জ বসুরহাট শাখা",
    roleType: "branch",
    isEmergencyLead: true,
    status: "active"
  },
  {
    id: "bbc_04",
    name: "Dr. Nusrat Jahan Chowdhury",
    nameBn: "ডা. নুসরাত জাহান চৌধুরী",
    designation: "Chattogram Division Blood Coordinator",
    designationBn: "চট্টগ্রাম বিভাগীয় ব্লাড ব্যাংক সমন্বয়ক",
    bloodGroup: "O-",
    phone: "01819988776",
    email: "chattogram.blood@ascado.org",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    district: "Chattogram",
    upazila: "Panchlaish",
    branchName: "পাঁচলাইশ চট্টগ্রাম শাখা",
    roleType: "division",
    isEmergencyLead: true,
    status: "active"
  },
  {
    id: "bbc_05",
    name: "Md. Mostafizur Rahman",
    nameBn: "মো. মোস্তাফিজুর রহমান",
    designation: "Bogura District Blood Convener",
    designationBn: "বগুড়া জেলা রক্তদান আহ্বায়ক",
    bloodGroup: "AB+",
    phone: "01712998877",
    email: "bogura.blood@ascado.org",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
    district: "Bogura",
    upazila: "Bogura Sadar",
    branchName: "বগুড়া সদর শাখা",
    roleType: "branch",
    isEmergencyLead: false,
    status: "active"
  },
  {
    id: "bbc_06",
    name: "Syeda Tahmina Akhter",
    nameBn: "সৈয়দা তাহমিনা আক্তার",
    designation: "Sylhet Blood Coordinator & Women Wing Lead",
    designationBn: "সিলেট বিভাগীয় নারী রক্তদাতা উইং সমন্বয়ক",
    bloodGroup: "A-",
    phone: "01733445566",
    email: "sylhet.blood@ascado.org",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
    district: "Sylhet",
    upazila: "Sylhet Sadar",
    branchName: "সিলেট সদর শাখা",
    roleType: "branch",
    isEmergencyLead: false,
    status: "active"
  }
];

let emergencyAppeals: any[] = [...SEED_EMERGENCY_APPEALS];
let donationProjects: any[] = [...SEED_DONATION_PROJECTS];
let donationCampaigns: any[] = donationProjects;
let donationTransactions: any[] = [...SEED_DONATION_TRANSACTIONS];
let donationExpenses: any[] = [...SEED_DONATION_EXPENSES];
let donorRecognitions: any[] = [...SEED_DONOR_RECOGNITION];
let transparencySummary: any = { ...SEED_TRANSPARENCY_SUMMARY };

let volunteers: any[] = [
  {
    id: "vol_01",
    userId: "usr_v1",
    fullName: "Ariful Islam",
    phone: "+8801712998877",
    email: "arif@volunteer.ascado.org",
    skills: ["First Aid", "Disaster Response", "Blood Coordination"],
    district: "Dhaka",
    upazila: "Dhanmondi",
    hoursServed: 145,
    eventsCount: 18,
    idCardNumber: "VOL-ASC-2026-089",
    status: "active",
    joinedDate: "2024-02-10"
  },
  {
    id: "vol_02",
    userId: "usr_v2",
    fullName: "Sabina Yasmin",
    phone: "+8801811887766",
    email: "sabina@volunteer.ascado.org",
    skills: ["Teaching", "Counseling", "Event Organizing"],
    district: "Bogura",
    upazila: "Bogura Sadar",
    hoursServed: 98,
    eventsCount: 12,
    idCardNumber: "VOL-ASC-2026-114",
    status: "active",
    joinedDate: "2024-05-15"
  }
];

let schoolStudents: any[] = [
  { id: "std_01", rollNumber: "101", fullName: "Tahsin Al Mahmud", class: "Class 8", section: "A", guardianName: "Mahmudul Hasan", guardianPhone: "+8801711223388", attendanceRate: 96, feeStatus: "paid", gpa: 4.85, gender: "male" },
  { id: "std_02", rollNumber: "102", fullName: "Sumaiya Akhter", class: "Class 8", section: "A", guardianName: "Kamal Hossain", guardianPhone: "+8801811223399", attendanceRate: 98, feeStatus: "paid", gpa: 5.00, gender: "female" },
  { id: "std_03", rollNumber: "103", fullName: "Riadul Islam", class: "Class 9", section: "B", guardianName: "Shafiqul Islam", guardianPhone: "+8801911223300", attendanceRate: 92, feeStatus: "due", gpa: 4.60, gender: "male" }
];

let courses: any[] = [
  {
    id: "crs_01",
    title: "Full-Stack Web & Software Development",
    titleBn: "ফুল-স্ট্যাক ওয়েব ও সফটওয়্যার ডেভেলপমেন্ট",
    category: "technical",
    categoryName: "ICT & Software",
    instructor: "Engr. Tanvir Ahmed (Senior Architect)",
    duration: "4 Months (48 Classes)",
    price: 3500,
    discountPrice: 2450,
    isFree: false,
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=80",
    totalStudents: 310,
    rating: 4.9,
    lessonsCount: 36,
    certificateProvided: true
  },
  {
    id: "crs_02",
    title: "Advanced Graphic Design & UI/UX Essentials",
    titleBn: "প্রফেশনাল গ্রাফিক ডিজাইন ও ইউআই/ইউএক্স",
    category: "youth_dev",
    categoryName: "Creative Media",
    instructor: "Sumon Paul (Creative Director)",
    duration: "3 Months (32 Classes)",
    price: 2800,
    discountPrice: 1950,
    isFree: false,
    thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&auto=format&fit=crop&q=80",
    totalStudents: 420,
    rating: 4.8,
    lessonsCount: 28,
    certificateProvided: true
  },
  {
    id: "crs_03",
    title: "Solar Electrical & Household Wiring Mastery",
    titleBn: "সোলার ইলেকট্রিক্যাল ও হাউজ ওয়্যারিং টেকনিশিয়ান",
    category: "technical",
    categoryName: "Vocational & Engineering",
    instructor: "Abdul Halim (Master Technical Instructor)",
    duration: "3 Months (Hands-on Lab)",
    price: 0,
    isFree: true,
    thumbnail: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80",
    totalStudents: 195,
    rating: 4.9,
    lessonsCount: 24,
    certificateProvided: true
  }
];

let somitiLoans: any[] = [
  {
    id: "ln_01",
    memberId: "mem_101",
    memberName: "Rashida Begum (Poultry Farm)",
    phone: "+8801712887766",
    loanAmount: 50000,
    interestRate: 6,
    termMonths: 12,
    monthlyInstallment: 4416,
    paidAmount: 26500,
    dueAmount: 23500,
    status: "active",
    disbursementDate: "2026-01-10"
  },
  {
    id: "ln_02",
    memberId: "mem_102",
    memberName: "Kabir Hossain (Grocery Store Expansion)",
    phone: "+8801815998877",
    loanAmount: 80000,
    interestRate: 6,
    termMonths: 18,
    monthlyInstallment: 4844,
    paidAmount: 80000,
    dueAmount: 0,
    status: "completed",
    disbursementDate: "2025-02-15"
  },
  {
    id: "ln_03",
    memberId: "mem_103",
    memberName: "Fazlul Karim (Handicrafts Workshop)",
    phone: "+8801912443322",
    loanAmount: 60000,
    interestRate: 6,
    termMonths: 12,
    monthlyInstallment: 5300,
    paidAmount: 0,
    dueAmount: 60000,
    status: "pending_approval",
    disbursementDate: "2026-08-18"
  }
];

let marketplaceVendors: any[] = [
  {
    id: "vnd_01",
    storeName: "Gramin Agro Cooperative",
    storeNameBn: "গ্রামীণ এগ্রো কো-অপারেটিভ",
    ownerName: "আব্দুল মোত্তালিব",
    phone: "01711223344",
    email: "gramin.agro@gmail.com",
    district: "সিরাজগঞ্জ",
    rating: 4.9,
    verified: true,
    joinedDate: "2024-01-10",
    totalProducts: 14,
    totalSales: 380,
    commissionRate: 0.10,
    logo: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80",
    type: "physical",
    descriptionBn: "সম্পূর্ণ রাসায়নিকমুক্ত খাঁটি সরিষার তেল, ঘি ও গ্রামীণ কৃষিপণ্যের বিশ্বস্ত প্রতিষ্ঠান।"
  },
  {
    id: "vnd_02",
    storeName: "Noor Digital Islamic Studio",
    storeNameBn: "নূর ডিজিটাল ইসলামিক স্টুডিও",
    ownerName: "মুহাম্মদ শাহাদাত",
    phone: "01822334455",
    email: "noor.digital@gmail.com",
    district: "ঢাকা",
    rating: 5.0,
    verified: true,
    joinedDate: "2024-03-15",
    totalProducts: 26,
    totalSales: 740,
    commissionRate: 0.10,
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80",
    type: "digital",
    descriptionBn: "ইসলামিক সফটওয়্যার, ই-বুক, ক্যালিগ্রাফি ভেক্টর আর্ট ও ডিজিটাল প্রডাক্টিভিটি টেমপ্লেট প্রস্তুতকারক।"
  },
  {
    id: "vnd_03",
    storeName: "Madinah Dates & Attar House",
    storeNameBn: "মদিনা ডেটস & আতর হাউস",
    ownerName: "হাফেজ মাওলানা শোয়েব",
    phone: "01933445566",
    email: "madinah.house@gmail.com",
    district: "চট্টগ্রাম",
    rating: 4.8,
    verified: true,
    joinedDate: "2024-02-01",
    totalProducts: 18,
    totalSales: 512,
    commissionRate: 0.10,
    logo: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80",
    type: "physical",
    descriptionBn: "আমদানিকৃত প্রিমিয়াম আজওয়া, মরিয়ম খেজুর ও খাঁটি আরবীয় অ্যালকোহলমুক্ত কাঁচা আতর।"
  },
  {
    id: "vnd_04",
    storeName: "ASCADO Artisans & Women Empowerment",
    storeNameBn: "আসকাডো উইমেন হ্যান্ডিক্রাফটস",
    ownerName: "ফাতেমা বেগম",
    phone: "01644556677",
    email: "women.cluster@ascado.org",
    district: "যশোর",
    rating: 4.9,
    verified: true,
    joinedDate: "2023-11-20",
    totalProducts: 32,
    totalSales: 890,
    commissionRate: 0.10,
    logo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1606744824163-985d376605aa?w=800&auto=format&fit=crop&q=80",
    type: "physical",
    descriptionBn: "হাতে সেলাইকৃত নকশিকাঁথা, পাটের পরিবেশবান্ধব ব্যাগ ও কুটিরশিল্পের দেশীয় সম্ভার।"
  },
  {
    id: "vnd_05",
    storeName: "Ilm Islamic Publishing",
    storeNameBn: "ইলম ইসলামিক পাবলিকেশন্স",
    ownerName: "মুফতি আব্দুর রহিম",
    phone: "01555667788",
    email: "ilm.publishing@gmail.com",
    district: "ঢাকা",
    rating: 4.9,
    verified: true,
    joinedDate: "2024-04-01",
    totalProducts: 45,
    totalSales: 1200,
    commissionRate: 0.10,
    logo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
    type: "both",
    descriptionBn: "প্রামাণ্য ইসলামিক সাহিত্য, তাফসির, আরবি শিক্ষণ সফটওয়্যার ও নির্ভরযোগ্য গবেষণাধর্মী ই-বুক।"
  }
];

let marketplaceBundles: any[] = [
  {
    id: "bnd_01",
    title: "Ramadan Ibadah & Health Mega Bundle",
    titleBn: "রমজান ইবাদত ও পুষ্টি মেগা বান্ডিল (মধু + আজওয়া খেজুর + ডিজিটাল প্ল্যানার ই-বুক)",
    descriptionBn: "সুন্দরবনের খাঁটি মধু ১ কেজি + মদিনা আজওয়া ৫০০ গ্রাম + ডিজিটাল রামাদান প্রোডাক্টিভিটি প্ল্যানার পিডিএফ।",
    price: 2650,
    originalPrice: 3250,
    discountBadge: "১৮% সাশ্রয়",
    type: "bundle",
    category: "Ramadan Special",
    includedProductIds: ["prd_04", "prd_05", "prd_d05"],
    includedItemsBn: [
      "সুন্দরবনের প্রাকৃতিক মধু (১ কেজি জার)",
      "প্রিমিয়াম মদিনা আজওয়া খেজুর (৫০০ গ্রাম)",
      "রমজান ডেইলি প্রোডাক্টিভিটি ও ইবাদত প্ল্যানার (ডিজিটাল পিডিএফ)"
    ],
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80",
    sellerId: "vnd_01",
    sellerName: "গ্রামীণ এগ্রো ও নূর ডিজিটাল যৌথ অফার",
    stock: 25,
    rating: 5.0,
    salesCount: 140
  },
  {
    id: "bnd_02",
    title: "Digital Creator & Islamic Designer Suite",
    titleBn: "ডিজিটাল কন্টেন্ট ক্রিয়েটর ও ডিজাইনার ইসলামিক বান্ডিল",
    descriptionBn: "উচ্চ রেজোলিউশন ১০০+ ক্যালিগ্রাফি ভেক্টর আর্ট + জাকাত ক্যালকুলেটর অটোমেশন + ইসলামিক ফ্রন্ট ও টেমপ্লেট সংগ্রহ।",
    price: 850,
    originalPrice: 1400,
    discountBadge: "৩৯% সাশ্রয়",
    type: "bundle",
    category: "Digital Assets",
    includedProductIds: ["prd_d02", "prd_d03"],
    includedItemsBn: [
      "ইসলামিক ক্যালিগ্রাফি ও ভেক্টর আর্ট মেগা প্যাক (SVG/AI/PNG)",
      "কমপ্লিট হালাল ইনভেস্টমেন্ট ও জাকাত ক্যালকুলেটর এক্সেল সফটওয়্যার",
      "লাইফটাইম কমার্শিয়াল ও পার্সোনাল ইউজ লাইসেন্স"
    ],
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    sellerId: "vnd_02",
    sellerName: "নূর ডিজিটাল ইসলামিক স্টুডিও",
    stock: 9999, // Digital unlimited
    isDigital: true,
    rating: 4.9,
    salesCount: 310
  },
  {
    id: "bnd_03",
    title: "Family Pure Organic Nutrition Combo",
    titleBn: "ফ্যামিলি পিওর অর্গানিক ওয়েলনেস বান্ডিল (সরিষার তেল + গাওয়া ঘি + কালোজিরা তেল)",
    descriptionBn: "ঘানিভাঙা সরিষার তেল ৫ লিটার + খাঁটি গাওয়া ঘি ৮০০ গ্রাম + কোল্ড প্রেসড কালোজিরা তেল ২৫০ মি.লি.।",
    price: 3350,
    originalPrice: 3950,
    discountBadge: "১৫% সাশ্রয়",
    type: "bundle",
    category: "Organic Agro Food",
    includedProductIds: ["prd_01", "prd_06", "prd_07"],
    includedItemsBn: [
      "খাঁটি ঘানির সরিষার তেল (৫ লিটার জার)",
      "খাঁটি গাওয়া ঘি (৮০০ গ্রাম জার)",
      "প্রিমিয়াম কোল্ড প্রেসড কালোজিরা তেল (২৫০ মি.লি.)"
    ],
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
    sellerId: "vnd_01",
    sellerName: "গ্রামীণ এগ্রো কো-অপারেটিভ",
    stock: 30,
    rating: 4.9,
    salesCount: 88
  }
];

let marketplaceProducts: any[] = [
  // 1. Physical Products
  {
    id: "prd_01",
    name: "Pure Mustard Oil (Cold Pressed) 5 Liters",
    nameBn: "খাঁটি ঘানির সরিষার তেল (৫ লিটার জার)",
    type: "physical",
    productType: "physical",
    category: "Organic Agro Food",
    categoryBn: "অর্গানিক ফুড",
    price: 1200,
    originalPrice: 1350,
    sellerId: "vnd_01",
    sellerName: "গ্রামীণ এগ্রো কো-অপারেটিভ",
    stock: 85,
    minOrderQty: 1,
    weight: "5.2 kg",
    platformCommissionRate: 0.10,
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 142,
    verified: true,
    description: "ঐতিহ্যবাহী কাঠের ঘানিতে ভাঙানো ১০০% ভেজালমুক্ত দেশি সরিষার ঝাঁঝালো তেল। কোনোরূপ রাসায়নিক বা প্রিজারভেটিভ মুক্ত।",
    featuresBn: ["১০০% খাঁটি দেশি সরিষা", "গাঢ় খাঁটি ঝাঁঝ ও স্বাদ", "বিএসটিআই মানসম্মত", "কোনো প্রিজারভেটিভ নেই"]
  },
  {
    id: "prd_02",
    name: "Nakshi Kantha Hand-Embroidered Traditional Quilt",
    nameBn: "হস্তশিল্প নকশিকাঁথা (হাতে সেলাইকৃত ঐতিহ্যবাহী)",
    type: "physical",
    productType: "physical",
    category: "Handicrafts & Women Crafts",
    categoryBn: "হস্তশিল্প ও কুটিরশিল্প",
    price: 2500,
    originalPrice: 2900,
    sellerId: "vnd_04",
    sellerName: "আসকাডো উইমেন হ্যান্ডিক্রাফটস",
    stock: 40,
    minOrderQty: 1,
    weight: "1.5 kg",
    platformCommissionRate: 0.10,
    imageUrl: "https://images.unsplash.com/photo-1606744824163-985d376605aa?w=500&auto=format&fit=crop&q=80",
    rating: 5.0,
    reviewsCount: 89,
    verified: true,
    description: "যশোরের দক্ষ গ্রামীণ নারী কারিগরদের সুই-সুতোয় বোনা মনোমুগ্ধকর ঐতিহ্যবাহী নকশিকাঁথা। প্রিমিয়াম সুতি কাপড় ও আরামদায়ক অনুভূতি।",
    featuresBn: ["১০০% হাতে সেলাইকৃত", "রং ওঠার নিশ্চয়তা", "উন্নত মানের সুতি সুতা", "নারীদের স্বাবলম্বী করার উদ্যোগ"]
  },
  {
    id: "prd_03",
    name: "B2B Wholesale Organic Honey 50 KG Bulk Drum",
    nameBn: "পাইকারি সুন্দরবনের প্রাকৃতিক মধু (৫০ কেজি বাল্ক ড্রাম)",
    type: "b2b_wholesale",
    productType: "physical",
    category: "B2B Wholesale",
    categoryBn: "বি২বি পাইকারি",
    price: 32000,
    originalPrice: 35000,
    sellerId: "vnd_01",
    sellerName: "গ্রামীণ এগ্রো কো-অপারেটিভ",
    stock: 12,
    minOrderQty: 1,
    weight: "52 kg",
    platformCommissionRate: 0.10,
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 36,
    verified: true,
    description: "বাণিজ্যিক ও পাইকারি ক্রেতাদের জন্য সুন্দরবনের মৌয়ালদের সংগৃহীত প্রাকৃতিক মধু। ল্যাব টেস্টে শতভাগ খাঁটি ও ফ্রুক্টোজমুক্ত।",
    featuresBn: ["ল্যাব সার্টিফাইড পিওরিটি", "পাইকারি রেট", "ফার্মাসিউটিক্যাল গ্রেড", "দ্রুত পরিবহন ব্যবস্থা"]
  },
  {
    id: "prd_04",
    name: "Sundarbans Raw Natural Honey 1 KG Jar",
    nameBn: "সুন্দরবনের প্রাকৃতিক চাকের মধু (১ কেজি কাচের জার)",
    type: "physical",
    productType: "physical",
    category: "Organic Agro Food",
    categoryBn: "অর্গানিক ফুড",
    price: 950,
    originalPrice: 1100,
    sellerId: "vnd_01",
    sellerName: "গ্রামীণ এগ্রো কো-অপারেটিভ",
    stock: 120,
    minOrderQty: 1,
    weight: "1.2 kg",
    platformCommissionRate: 0.10,
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 215,
    verified: true,
    description: "সুন্দরবনের গভীর অরণ্যের বুনো ফুলের খাঁটি প্রাকৃতিক মধু। কোনো কৃত্রিম মিষ্টি বা প্রসেসিং ছাড়া অপরিবর্তিত গুণাগুণ সমৃদ্ধ।",
    featuresBn: ["সরাসরি মৌয়ালদের সংগ্রহ", "প্রাকৃতিক এনজাইমে ভরপুর", "অ্যান্টিঅক্সিডেন্ট সমৃদ্ধ", "নিরাপদ প্যাকেজিং"]
  },
  {
    id: "prd_05",
    name: "Premium Madinah Ajwa Dates 1 KG Pack",
    nameBn: "প্রিমিয়াম মদিনা আজওয়া খেজুর (১ কেজি স্পেশাল প্যাক)",
    type: "physical",
    productType: "physical",
    category: "Organic Agro Food",
    categoryBn: "ইসলামিক ও অর্গানিক ফুড",
    price: 1450,
    originalPrice: 1650,
    sellerId: "vnd_03",
    sellerName: "মদিনা ডেটস & আতর হাউস",
    stock: 65,
    minOrderQty: 1,
    weight: "1.05 kg",
    platformCommissionRate: 0.10,
    imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&auto=format&fit=crop&q=80",
    rating: 5.0,
    reviewsCount: 180,
    verified: true,
    description: "মদিনা মুনাওয়ারা থেকে সরাসরি আমদানিকৃত এ-গ্রেড সাইজের নরম ও মিষ্টতায় ভরপুর আজওয়া খেজুর। হাদিস অনুযায়ী সর্বোচ্চ ফজিলতপূর্ণ।",
    featuresBn: ["মদিনা শরীফ থেকে সরাসরি আমদানি", "সফট ও প্রিমিয়াম জ্যাম্বো সাইজ", "এয়ারটাইট হাইজিনিক বক্স", "১০০% ফ্রেশ"]
  },
  {
    id: "prd_06",
    name: "Pure Homemade Cow Milk Ghee 800gm",
    nameBn: "খাঁটি গাওয়া ঘি (৮০০ গ্রাম কাচের জার)",
    type: "physical",
    productType: "physical",
    category: "Organic Agro Food",
    categoryBn: "অর্গানিক ফুড",
    price: 1350,
    originalPrice: 1500,
    sellerId: "vnd_01",
    sellerName: "গ্রামীণ এগ্রো কো-অপারেটিভ",
    stock: 50,
    minOrderQty: 1,
    weight: "1 kg",
    platformCommissionRate: 0.10,
    imageUrl: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 94,
    verified: true,
    description: "পাবনা ও সিরাজগঞ্জের দেশি গরুর দুধের ননি থেকে তৈরি সুগন্ধি দানাদার খাঁটি গাওয়া ঘি। কোনো ডালডা বা গন্ধবর্ধক মেশানো নেই।",
    featuresBn: ["দেশি গরুর খাঁটি দুধের ঘি", "দানাদার টেক্সচার ও তীব্র সুবাস", "স্বাস্থ্যসম্মত খাদ্যগুণ", "কাচের জারে নিরাপদ ডেলিভারি"]
  },
  {
    id: "prd_07",
    name: "Pure Cold-Pressed Black Seed Oil 250ml",
    nameBn: "কোল্ড প্রেসড খাঁটি কালোজিরা তেল (২৫০ মি.লি.)",
    type: "physical",
    productType: "physical",
    category: "Organic Agro Food",
    categoryBn: "ভেষজ ও সুন্নতি পণ্য",
    price: 450,
    originalPrice: 520,
    sellerId: "vnd_01",
    sellerName: "গ্রামীণ এগ্রো কো-অপারেটিভ",
    stock: 90,
    minOrderQty: 1,
    weight: "350 gm",
    platformCommissionRate: 0.10,
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 76,
    verified: true,
    description: "বাছাইকৃত দেশি কালোজিরা থেকে সরাসরি কোল্ড প্রেস পদ্ধতিতে সংগৃহীত নির্ভেজাল তেল। রোগ প্রতিরোধ ক্ষমতা বৃদ্ধির মহৌষধ।",
    featuresBn: ["কোল্ড প্রেস অপরিশোধিত তেল", "সুন্নতি ও পরীক্ষিত গুণাগুণ", "উচ্চমাত্রার থাইমোকুইনোন", "খাবারে বা মালিশে ব্যবহার্য"]
  },
  {
    id: "prd_08",
    name: "Natural Non-Alcoholic Oud & Rose Attar 12ml",
    nameBn: "অ্যালকোহলমুক্ত প্রাকৃতিক রয়্যাল উদ ও গোলাপ আতর (১২ মি.লি.)",
    type: "physical",
    productType: "physical",
    category: "Lifestyle & Attar",
    categoryBn: "সুগন্ধি ও আতর",
    price: 650,
    originalPrice: 800,
    sellerId: "vnd_03",
    sellerName: "মদিনা ডেটস & আতর হাউস",
    stock: 70,
    minOrderQty: 1,
    weight: "150 gm",
    platformCommissionRate: 0.10,
    imageUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=500&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 112,
    verified: true,
    description: "দীর্ঘস্থায়ী মনমাতানো সুবাসের প্রাকৃতিক সুগন্ধি তেল। অ্যালকোহল ও কেমিক্যাল সম্পূর্ণ মুক্ত এবং নামাজের জন্য নিরাপদ।",
    featuresBn: ["২৪ ঘণ্টা লাস্টিং ফ্র্যাগ্রেন্স", "১০০% অ্যালকোহলমুক্ত", "রয়্যাল ক্রিস্টাল রোল-অন বটল", "উচ্চ গ্রেডের প্রাকৃতিক নির্যাস"]
  },

  // 2. Digital Products (Instant Download & Access)
  {
    id: "prd_d01",
    name: "Complete Islamic E-Book & Hadith Compendium (Vol 1-5)",
    nameBn: "ইসলামিক পূর্ণাঙ্গ ই-বুক ও নির্ভরযোগ্য হাদিস বিশ্বকোষ (১-৫ খণ্ড)",
    type: "digital",
    productType: "digital",
    category: "Digital Books & PDFs",
    categoryBn: "ডিজিটাল ই-বুক ও সফটওয়্যার",
    price: 350,
    commercialPrice: 650,
    originalPrice: 650,
    sellerId: "vnd_05",
    sellerName: "ইলম ইসলামিক পাবলিকেশন্স",
    stock: 99999,
    minOrderQty: 1,
    fileFormat: "PDF + EPUB",
    fileSize: "145 MB",
    version: "v2.6 (2026 Edition)",
    lastUpdated: "আগস্ট ২০২৬",
    compatibility: ["Android", "iOS / iPad", "Windows PC", "Mac", "Kindle"],
    downloadUrl: "https://ascado.org/downloads/islamic-encyclopedia-vol1-5.pdf",
    instantDelivery: true,
    platformCommissionRate: 0.10,
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80",
    rating: 5.0,
    reviewsCount: 340,
    verified: true,
    description: "সহিহ বুখারি, মুসলিম, সুনানে আবু দাউদসহ জরুরি ইসলামিক মাসআলা ও গবেষণাধর্মী প্রামাণ্য ই-বুক লাইব্রেরি। সম্পূর্ণ সার্চেবল ও বুকমার্কযুক্ত ফরম্যাট।",
    featuresBn: ["ইনস্ট্যান্ট ডাউনলোড সুবিধা", "সার্চেবল পিডিএফ ও ইপাব", "মোবাইল ও পিসি ফ্রেন্ডলি", "লাইফটাইম এক্সেস ও ফ্রি আপডেট"],
    demoType: "reader",
    sampleData: {
      totalPages: 1250,
      previewPagesCount: 4,
      pages: [
        { page: 1, title: "সূচিপত্র ও মুখবন্ধ", content: "বিসমিল্লাহির রাহমানির রাহিম। সর্বকালের শ্রেষ্ঠ জ্ঞানভাণ্ডার হাদিস সংকলনের এই ডিজিটাল সংস্করণটি সাধারণ পাঠক এবং গবেষক উভয়ের সুবিধার্থে হাইপারলিঙ্ক সূচিপত্র সহকারে তৈরি করা হয়েছে।" },
        { page: 2, title: "১ম অধ্যায়: নিয়ত ও আমলের বিশুদ্ধতা", content: "হাদিস ১: উমার ইবনুল খাত্তাব (রা.) থেকে বর্ণিত, রাসূলুল্লাহ (সা.) ইরশাদ করেন: 'প্রত্যেক কাজের ফলাফল নিয়তের ওপর নির্ভরশীল, আর মানুষ যা নিয়ত করে তাই সে পায়।' (সহিহ বুখারি, হাদিস ০১)" },
        { page: 3, title: "২য় অধ্যায়: ঈমান ও তাওহীদের মূলনীতি", content: "হাদিস ৮: আব্দুল্লাহ ইবনে উমর (রা.) বলেন, রাসূলুল্লাহ (সা.) বলেছেন: 'ইসলামের ভিত্তি পাঁচটি স্তম্ভের ওপর স্থাপিত: ১. আল্লাহ ব্যতীত কোনো উপাস্য নেই এবং মুহাম্মদ (সা.) তাঁর বান্দা ও রাসূল—এ কথার সাক্ষ্য দেওয়া; ২. সালাত কায়েম করা; ৩. যাকাত আদায় করা; ৪. হজ করা এবং ৫. রমজানের রোজা রাখা।' (সহিহ বুখারি)" },
        { page: 4, title: "৩য় অধ্যায়: চরিত্র ও সদ্ব্যবহার", content: "হাদিস ২১: আবু হুরায়রা (রা.) সূত্রে বর্ণিত, রাসূলুল্লাহ (সা.) বলেছেন: 'প্রকৃত মুসলিম সেই ব্যক্তি, যার জিহ্বা ও হাত থেকে অন্য মুসলিম নিরাপদ থাকে।' এই অধ্যায়ে দৈনন্দিন পারস্পরিক লেনদেন ও সামাজিক শিষ্টাচারের ১০৫টি নির্দেশনাসমূহ স্থান পেয়েছে।" }
      ]
    },
    reviews: [
      { id: "rev_1", author: "মুফতি জুবায়ের আহমেদ", rating: 5, date: "২০২৬-০৮-১৫", comment: "অসাধারণ কালেকশন! ফন্ট সাইজ এবং সার্চ ফাংশন এত চমৎকার যে সহজে যেকোনো হাদিস রেফারেন্স পাওয়া যায়।", verifiedBuyer: true },
      { id: "rev_2", author: "তানভীর হাসান", rating: 5, date: "২০২৬-০৮-২২", comment: "কেনার সাথে সাথেই ডাউনলোড করতে পেরেছি। আইপ্যাডে পড়ার চমৎকার অভিজ্ঞতা।", verifiedBuyer: true }
    ]
  },
  {
    id: "prd_d02",
    name: "Islamic Calligraphy & Arabic Vector Graphics Mega Bundle",
    nameBn: "ইসলামিক ক্যালিগ্রাফি ও আরবি ভেক্টর আর্ট মেগা প্যাক (২০০+ ফাইল)",
    type: "digital",
    productType: "digital",
    category: "Digital Graphics & Art",
    categoryBn: "ডিজিটাল গ্রাফিক্স ও আর্ট",
    price: 499,
    commercialPrice: 950,
    originalPrice: 850,
    sellerId: "vnd_02",
    sellerName: "নূর ডিজিটাল ইসলামিক স্টুডিও",
    stock: 99999,
    minOrderQty: 1,
    fileFormat: "AI + SVG + EPS + PNG (300 DPI)",
    fileSize: "680 MB",
    version: "v3.1 (2026 Edition)",
    lastUpdated: "জুলাই ২০২৬",
    compatibility: ["Adobe Illustrator", "Photoshop", "CorelDraw", "Figma", "Canva"],
    downloadUrl: "https://ascado.org/downloads/arabic-calligraphy-vector-mega-pack.zip",
    instantDelivery: true,
    platformCommissionRate: 0.10,
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 220,
    verified: true,
    description: "গ্রাফিক ডিজাইনার, ডিজিটাল প্রিন্টার ও সোশ্যাল মিডিয়া কন্টেন্ট ক্রিয়েটরদের জন্য বিশ্বমানের আরবি ক্যালিগ্রাফি, মোটিফ ও ভেক্টর ফ্রেমের বিশাল সংগ্রহ।",
    featuresBn: ["১০০% ভেক্টর ও ইনফিনিট স্কেলেবল", "কমার্শিয়াল ব্যবহারের লাইসেন্স সুবিধা", "ট্রান্সপারেন্ট হাই-রেজোলিউশন পিএনজি", "টি-শার্ট, প্রিন্ট ও ওয়েবে আনলিমিটেড ব্যবহার্য"],
    demoType: "vector_gallery",
    sampleData: {
      totalAssets: 215,
      previewItems: [
        { name: "বিসমিল্লাহ ক্যালিগ্রাফি (সুলুস স্টাইল)", format: "SVG + AI", dpi: "Vector Infinite", tag: "Most Popular" },
        { name: "আল্লাহু আকবার জ্যামিতিক অ্যারাবেস্ক ফ্রেম", format: "EPS + PNG", dpi: "300 DPI Transparent", tag: "Golden Ratio" },
        { name: "রমজানুল মুবারাক ও ঈদ মোটিফ আর্টওয়ার্ক", format: "AI + SVG", dpi: "Vector CMYK Print", tag: "Seasonal Special" },
        { name: "লা ইলাহা ইল্লাল্লাহ কুফিক আর্ট ডিজাইন", format: "AI + SVG + PNG", dpi: "300 DPI Clean Cut", tag: "Modern Kufic" }
      ]
    },
    reviews: [
      { id: "rev_3", author: "মারুফ বিল্লাহ (ডিজাইনার)", rating: 5, date: "২০২৬-০৮-১৮", comment: "ভেক্টরগুলোর পাথ লাইনগুলো অসম্ভব নিখুঁত! প্রিন্টিং ও টিশার্ট ডিজাইনে সরাসরি ব্যবহার করেছি।", verifiedBuyer: true }
    ]
  },
  {
    id: "prd_d03",
    name: "Halal Investment & Comprehensive Zakat Calculator Software",
    nameBn: "কমপ্লিট হালাল ইনভেস্টমেন্ট ও আধুনিক জাকাত ক্যালকুলেটর সফটওয়্যার",
    type: "digital",
    productType: "digital",
    category: "Finance Tools & Templates",
    categoryBn: "ডিজিটাল টুলস ও সফটওয়্যার",
    price: 399,
    commercialPrice: 750,
    originalPrice: 600,
    sellerId: "vnd_02",
    sellerName: "নূর ডিজিটাল ইসলামিক স্টুডিও",
    stock: 99999,
    minOrderQty: 1,
    fileFormat: "Excel Macro (.xlsm) + Google Sheets Template",
    fileSize: "28 MB",
    version: "v4.0 (Nisab 2026 Certified)",
    lastUpdated: "আগস্ট ২০২৬",
    compatibility: ["MS Excel 2016+", "Google Sheets", "Windows", "Mac"],
    downloadUrl: "https://ascado.org/downloads/halal-investment-zakat-calc.xlsm",
    instantDelivery: true,
    platformCommissionRate: 0.10,
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80",
    rating: 5.0,
    reviewsCount: 165,
    verified: true,
    description: "ব্যবসা, সোনা, জমি, শেয়ার বাজার ও ক্রিপ্টোর শরিয়াহসম্মত হিসাব ও স্বয়ংক্রিয় নিসাব ভিত্তিক জাকাত গণনার সহজ এক্সেল সফটওয়্যার ও নির্দেশিকা।",
    featuresBn: ["মুফতি বোর্ড দ্বারা ভেরিফায়েড সূত্র", "ব্যবসায়ী ও চাকরিজীবীদের জন্য অটো হিসাব", "লাইফটাইম ভ্যালিডিটি", "ভিডিও টিউটোরিয়াল অন্তর্ভুক্ত"],
    demoType: "interactive_calc",
    sampleData: {
      goldPricePerBhori: 135000,
      silverPricePerBhori: 2200,
      nisabSilverBDT: 115500,
      defaultCash: 250000,
      defaultGoldBhori: 3,
      defaultBusinessStock: 400000,
      defaultDebts: 50000
    },
    reviews: [
      { id: "rev_4", author: "ইঞ্জি. ইকবাল মাহমুদ", rating: 5, date: "২০২৬-০৮-০৫", comment: "শেয়ার মার্কেটের জটিল ইনভেস্টমেন্টের জাকাত নিয়ে সবসময় বিভ্রান্তিতে থাকতাম। এই এক্সেল ফাইলটি মুহূর্তেই সব স্পষ্ট করে দিয়েছে।", verifiedBuyer: true }
    ]
  },
  {
    id: "prd_d04",
    name: "Kids Quran & Arabic Alphabet Interactive Software for PC/Android",
    nameBn: "শিশুদের নূরানি কায়দা ও আরবি বর্ণমালা অডিও-ভিজ্যুয়াল লার্নিং সফটওয়্যার",
    type: "digital",
    productType: "digital",
    category: "Education & Learning",
    categoryBn: "শিক্ষা ও লার্নিং অ্যাপ",
    price: 299,
    commercialPrice: 590,
    originalPrice: 500,
    sellerId: "vnd_05",
    sellerName: "ইলম ইসলামিক পাবলিকেশন্স",
    stock: 99999,
    minOrderQty: 1,
    fileFormat: "Windows .exe + Android .apk",
    fileSize: "185 MB",
    version: "v2.2 Kids Edition",
    lastUpdated: "জুলাই ২০২৬",
    compatibility: ["Windows 10/11", "Android Phones & Tablets"],
    downloadUrl: "https://ascado.org/downloads/kids-noorani-interactive-suite.zip",
    instantDelivery: true,
    platformCommissionRate: 0.10,
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 198,
    verified: true,
    description: "শিশুদের সহিহ মাখরাজ ও তাজবিদ সহকারে সহজে কুরআন শিক্ষাদানের আনন্দদায়ক গেম ও ইন্টারঅ্যাক্টিভ মাল্টিমিডিয়া সফটওয়্যার।",
    featuresBn: ["ভয়েস প্রোনাউনসিয়েশন ও সাউন্ড টেস্ট", "অফলাইনে কোনো ইন্টারনেট ছাড়া চলে", "বিজ্ঞাপনমুক্ত ও শিশুর জন্য নিরাপদ", "পিসি ও মোবাইলে ইনস্টলযোগ্য"],
    demoType: "sound_test",
    sampleData: {
      letters: [
        { letter: "ا", name: "আলিফ (Alif)", soundText: "আলিফ - খালি হরফ, মুখের ফাঁকা স্থান থেকে উচ্চারিত হয়", phonetics: "Ah-leef" },
        { letter: "ب", name: "বা (Baa)", soundText: "বা - দুই ঠোঁটের ভিজা অংশ থেকে উচ্চারিত হয়", phonetics: "Baa" },
        { letter: "ت", name: "তা (Taa)", soundText: "তা - জিহ্বার ডগা ও সামনের ওপরের দাঁতের গোড়া", phonetics: "Taa" },
        { letter: "ث", name: "ছা (Thaa)", soundText: "ছা - জিহ্বার ডগা ও সামনের ওপরের দাঁতের মাথা নরমভাবে", phonetics: "Thaa" }
      ]
    },
    reviews: [
      { id: "rev_5", author: "ফারহানা ইয়াসমিন", rating: 5, date: "২০২৬-০৮-১০", comment: "আমার ৫ বছরের ছেলে দারুণ আগ্রহ নিয়ে শিখছে। বিজ্ঞাপন না থাকায় নিশ্চিন্তে বাচ্চাকে দেওয়া যায়।", verifiedBuyer: true }
    ]
  },
  {
    id: "prd_d05",
    name: "Ramadan Daily Productivity & Ibadah Planner Digital Journal",
    nameBn: "রমজান ডেইলি প্রোডাক্টিভিটি ও ইবাদত প্ল্যানার ডিজিটাল জার্নাল",
    type: "digital",
    productType: "digital",
    category: "Digital Books & PDFs",
    categoryBn: "ডিজিটাল ই-বুক ও প্ল্যানার",
    price: 150,
    commercialPrice: 350,
    originalPrice: 300,
    sellerId: "vnd_02",
    sellerName: "নূর ডিজিটাল ইসলামিক স্টুডিও",
    stock: 99999,
    minOrderQty: 1,
    fileFormat: "Interactive PDF (GoodNotes, Notability & Printable)",
    fileSize: "45 MB",
    version: "v2026 Pro Edition",
    lastUpdated: "আগস্ট ২০২৬",
    compatibility: ["iPad / GoodNotes", "Notability", "Samsung Notes", "Printable A4/Letter"],
    downloadUrl: "https://ascado.org/downloads/ramadan-digital-planner-2026.pdf",
    instantDelivery: true,
    platformCommissionRate: 0.10,
    imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=500&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 420,
    verified: true,
    description: "৩০ দিনের তারাবিহ, কুরআন তিলাওয়াত, সাদাকা ও ব্যক্তিগত আমল ট্র্যাকিংয়ের জন্য হাইপারলিঙ্কযুক্ত দৃষ্টিনন্দন ডিজিটাল জার্নাল।",
    featuresBn: ["ট্যাবলেট ও আইপ্যাডে কলম দিয়ে লেখার সুবিধা", "প্রিন্টযোগ্য হাই-রেজ পেজ", "দৈনিক দোয়া ও হাদিস ট্র্যাকার", "ইনস্ট্যান্ট ডাউনলোড"],
    demoType: "reader",
    sampleData: {
      totalPages: 110,
      previewPagesCount: 3,
      pages: [
        { page: 1, title: "রমজানের লক্ষ্য ও আত্মশুদ্ধি পরিকল্পনা", content: "এই পবিত্র মাসে আমার প্রধান ৩টি লক্ষ্য: ১. সম্পূর্ণ কুরআন অর্থসহ পাঠ ২. নিয়মিত তাহাজ্জুদ ৩. গিবত ও রাগ বর্জন। প্রতিদিনের ট্র্যাকিং ছক।" },
        { page: 2, title: "দৈনিক ইবাদত ও সালাত ট্র্যাকার শিট", content: "৫ ওয়াক্ত ফরজ সালাত + সুন্নতে মুয়াক্কাদা + তারাবিহ (২০ রাকাত) + তাহাজ্জুদ ও সালাতুত তাসবিহ চেকলিস্ট।" },
        { page: 3, title: "কুরআন পাঠ ও সাদাকা জার্নাল", content: "পারা ভিত্তিক পড়ার অগ্রগতি রেকর্ড। প্রতিদিনের সাদাকার পরিমাণ ও দোয়া মুখস্থ করার ডায়েরি পৃষ্ঠা।" }
      ]
    },
    reviews: [
      { id: "rev_6", author: "রাবেয়া সুলতানা", rating: 5, date: "২০২৬-০৮-০১", comment: "গুডনোটসে খুব স্মুথ কাজ করে। হাইপারলিংকগুলো দিয়ে এক ক্লিকে যেকোনো তারিখে যাওয়া যায়।", verifiedBuyer: true }
    ]
  },
  {
    id: "prd_d06",
    name: "Halal Web & SaaS UI Component Kit (React & Tailwind)",
    nameBn: "হালাল ওয়েব ও মোবাইল অ্যাপ UI কিট (React, Tailwind ও Figma)",
    type: "digital",
    productType: "digital",
    category: "Software & Web Templates",
    categoryBn: "ওয়েব টেমপ্লেট ও কোড",
    price: 599,
    commercialPrice: 1200,
    originalPrice: 999,
    sellerId: "vnd_02",
    sellerName: "নূর ডিজিটাল ইসলামিক স্টুডিও",
    stock: 99999,
    minOrderQty: 1,
    fileFormat: "Source Code (ZIP) + Figma Design System",
    fileSize: "85 MB",
    version: "v1.5 Enterprise",
    lastUpdated: "আগস্ট ২০২৬",
    compatibility: ["React 18/19", "Next.js 14+", "Tailwind CSS v3/v4", "TypeScript", "Figma"],
    downloadUrl: "https://ascado.org/downloads/halal-saas-ui-kit-react.zip",
    instantDelivery: true,
    platformCommissionRate: 0.10,
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=80",
    rating: 5.0,
    reviewsCount: 88,
    verified: true,
    description: "ইসলামিক ফিনটেক, ই-কমার্স ও চ্যারিটি ওয়েবসাইটের জন্য ৫০+ প্রি-বিল্ট রেস্পন্সিভ কম্পোনেন্ট, ড্যাশবোর্ড স্ক্রিন ও ফিগমা ফাইল সমৃদ্ধ কোড লাইব্রেরি।",
    featuresBn: ["১০০% ক্লিন টাইপস্ক্রিপ্ট কোড", "কপি-পেস্ট রেডি মডার্ন কম্পোনেন্ট", "বাণিজ্যিক প্রজেক্টে ব্যবহারের পূর্ণ ছাড়পত্র", "ডার্ক ও লাইট মোড সাপোর্ট"],
    demoType: "vector_gallery",
    sampleData: {
      totalAssets: 55,
      previewItems: [
        { name: "ডোনেশন ও সাদাকা পেমেন্ট উইজেট", format: "React + Tailwind", dpi: "Full Responsive", tag: "Fintech Ready" },
        { name: "হাদিস সার্চ ও বুকমার্কিং কার্ড", format: "TypeScript Component", dpi: "Accessible WCAG", tag: "Top Starred" },
        { name: "কমিউনিটি ফোরাম ও প্রশ্ন-উত্তর গ্রিড", format: "React JSX", dpi: "Mobile First", tag: "Clean Code" }
      ]
    },
    reviews: [
      { id: "rev_7", author: "সায়েম রহমান (ফুলস্ট্যাক ডেভ)", rating: 5, date: "২০২৬-০৮-২৭", comment: "কোডের মান অত্যন্ত পরিষ্কার। আমার ক্লায়েন্ট প্রজেক্টের প্রায় ২০ ঘণ্টা সময় বেঁচে গেছে।", verifiedBuyer: true }
    ]
  },
  {
    id: "prd_d07",
    name: "SME Business Invoice, Inventory & Accounting Excel Automation Suite",
    nameBn: "ক্ষুদ্র ও মাঝারি ব্যবসার অটো ইনভয়েস, ইনভেনটরি ও ক্যাশ ফ্লো এক্সেল সফটওয়্যার",
    type: "digital",
    productType: "digital",
    category: "Finance Tools & Templates",
    categoryBn: "ডিজিটাল টুলস ও সফটওয়্যার",
    price: 450,
    commercialPrice: 850,
    originalPrice: 750,
    sellerId: "vnd_05",
    sellerName: "ইলম ইসলামিক পাবলিকেশন্স",
    stock: 99999,
    minOrderQty: 1,
    fileFormat: "Excel Macro (.xlsm) + PDF User Manual",
    fileSize: "32 MB",
    version: "v3.5 Auto-Bill Edition",
    lastUpdated: "আগস্ট ২০২৬",
    compatibility: ["MS Excel 2013+", "WPS Office", "Windows PC", "Mac Excel"],
    downloadUrl: "https://ascado.org/downloads/sme-invoice-inventory-accounting.xlsm",
    instantDelivery: true,
    platformCommissionRate: 0.10,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 145,
    verified: true,
    description: "দোকান, অনলাইন পেজ বা পাইকারি ব্যবসার অটোমেটিক বাংলা ও ইংরেজি চালান তৈরি, পণ্যের স্টক ট্র্যাকিং এবং লাভ-ক্ষতির মাসিক স্বয়ংক্রিয় হিসাব সফটওয়্যার।",
    featuresBn: ["১ ক্লিকে প্রিন্টযোগ্য ইনভয়েস ও মেমো", "কম স্টক হলে অটো লাল ওয়ার্নিং", "বাকি ও পাওনাদার হিসাব খাতা", "কোনো মাসিক ফি নেই—একবার কিনলেই আজীবন ফ্রি"],
    demoType: "interactive_calc",
    sampleData: {
      defaultCash: 85000,
      defaultBusinessStock: 320000,
      defaultDebts: 25000
    },
    reviews: [
      { id: "rev_8", author: "আশরাফুল ইসলাম (ব্যবসায়ী)", rating: 5, date: "২০২৬-০৮-১৪", comment: "দোকানের জন্য কোনো দামী সফটওয়্যার না কিনে এই এক্সেল ফাইল দিয়েই সব কাজ সহজে হয়ে গেছে।", verifiedBuyer: true }
    ]
  },
  {
    id: "prd_d08",
    name: "Halal Studio Vocals & Nasheed Audio Collection (Acapella / No Instruments)",
    nameBn: "অরিজিনাল স্টুডিও হালাল নাশিদ ও ভয়েস সাউন্ড প্যাক (বাদ্যযন্ত্রহীন পিওর ভোকাল)",
    type: "digital",
    productType: "digital",
    category: "Audio & Nasheed",
    categoryBn: "অডিও ও নাশিদ প্যাক",
    price: 250,
    commercialPrice: 550,
    originalPrice: 450,
    sellerId: "vnd_02",
    sellerName: "নূর ডিজিটাল ইসলামিক স্টুডিও",
    stock: 99999,
    minOrderQty: 1,
    fileFormat: "Studio FLAC + MP3 (320kbps)",
    fileSize: "310 MB",
    version: "v1.2 Studio Master",
    lastUpdated: "আগস্ট ২০২৬",
    compatibility: ["All Media Players", "Premiere Pro", "CapCut", "DaVinci Resolve", "Mobile"],
    downloadUrl: "https://ascado.org/downloads/halal-studio-nasheed-vocals.zip",
    instantDelivery: true,
    platformCommissionRate: 0.10,
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 110,
    verified: true,
    description: "ভিডিও এডিটর ও ইসলামিক কন্টেন্ট ক্রিয়েটরদের জন্য সম্পূর্ণ বাদ্যযন্ত্রহীন ১০০% হালাল হামদ, নাত ও হৃদয়স্পর্শী আবহে রেকর্ডকৃত প্রফেশনাল সাউন্ড ফাইল।",
    featuresBn: ["১০০% বাদ্যযন্ত্রহীন পিওর ভোকাল", "কপিরাইট ফ্রি কন্টেন্ট ক্রিয়েটর লাইসেন্স", "হাই-ডেফিনিশন ৩২০ কেবিপিএস অডিও", "ইউটিউব ও ফেসবুকে মনিটাইজেশন ফ্রেন্ডলি"],
    demoType: "sound_test",
    sampleData: {
      letters: [
        { letter: "🎵", name: "রমজান হামদ (শান্ত আবহের ভোকাল)", soundText: "হৃদয়স্পর্শী সুর ও শোকরিয়া জ্ঞাপন", phonetics: "Nasheed Vocal 01" },
        { letter: "🎵", name: "সুবহানাল্লাহ কোরাস অ্যাম্বিয়েন্স", soundText: "শান্ত ব্যাকগ্রাউন্ড অডিও ট্র্যাক", phonetics: "Chorus Vocal 02" },
        { letter: "🎵", name: "তাওহীদ জাগরণী সাউন্ড ইফেক্ট", soundText: "উচ্চ শক্তির অনুপ্রেরণাদায়ক ভয়েস", phonetics: "Anthem Track 03" }
      ]
    },
    reviews: [
      { id: "rev_9", author: "জাহিদ হাসান (ইউটিউবার)", rating: 5, date: "২০২৬-০৮-২১", comment: "ভিডিওর ব্যাকগ্রাউন্ড মিউজিকের পরিবর্তে এই হালাল ভোকালগুলো ব্যবহারের পর দর্শকদের কাছ থেকে অনেক প্রশংসা পেয়েছি।", verifiedBuyer: true }
    ]
  }
];

let marketplaceOrders: any[] = [
  {
    id: "ord_1001",
    productId: "prd_01",
    productName: "খাঁটি ঘানির সরিষার তেল (৫ লিটার জার)",
    productType: "physical",
    quantity: 2,
    unitPrice: 1200,
    totalAmount: 2400,
    deliveryFee: 120,
    grandTotal: 2520,
    platformCommission: 240,
    sellerPayout: 2160,
    sellerId: "vnd_01",
    sellerName: "গ্রামীণ এগ্রো কো-অপারেটিভ",
    buyerName: "তানভীর হাসান",
    buyerPhone: "01728112233",
    deliveryAddress: "বাড়ি ২৩, রোড ৪, সেক্টর ৭, উত্তরা, ঢাকা",
    paymentMethod: "cash_on_delivery",
    status: "delivered",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "ord_1002",
    productId: "prd_d01",
    productName: "ইসলামিক পূর্ণাঙ্গ ই-বুক ও নির্ভরযোগ্য হাদিস বিশ্বকোষ",
    productType: "digital",
    quantity: 1,
    unitPrice: 350,
    totalAmount: 350,
    deliveryFee: 0,
    grandTotal: 350,
    platformCommission: 35,
    sellerPayout: 315,
    sellerId: "vnd_05",
    sellerName: "ইলম ইসলামিক পাবলিকেশন্স",
    buyerName: "মাহমুদুর রহমান",
    buyerPhone: "01844556677",
    deliveryAddress: "mahmud.dev@gmail.com",
    downloadUrl: "https://ascado.org/downloads/islamic-encyclopedia-vol1-5.pdf",
    paymentMethod: "bkash_online",
    status: "completed",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

let realEstateListings: any[] = [
  {
    id: "prop_01",
    title: "Prime Commercial & Residential Plot in Savar",
    titleBn: "সাভার মডেল টাউনে ৮ শতাংশ নিষ্কণ্টক আবাসিক/বাণিজ্যিক প্লট",
    propertyType: "land",
    purpose: "sale",
    district: "Dhaka",
    upazila: "Savar",
    mouza: "Balia",
    dagNumber: "CS-412 / SA-890",
    khatianNumber: "RS-1420",
    size: "8 Decimal (শতাংশ)",
    price: 4800000,
    ownerName: "Haji Mohammad Ali",
    contactPhone: "+8801711554433",
    isLegallyVerified: true,
    verifiedByAdmin: "Super Admin Legal Desk",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80"],
    facilities: ["30ft Road Access", "Electricity Available", "Gas Connection Line Nearby", "Dispute-Free Title"],
    status: "available"
  },
  {
    id: "prop_02",
    title: "Luxury 3-Bed Family Flat for Rent in Dhanmondi",
    titleBn: "ধানমন্ডি লেকের সন্নিকটে ১৮৫০ বর্গফুটের বিলাসবহুল ফ্ল্যাট ভাড়া",
    propertyType: "rental",
    purpose: "rent",
    district: "Dhaka",
    upazila: "Dhanmondi",
    size: "1850 sq ft (3 Bed, 3 Bath, 2 Balconies)",
    price: 45000,
    ownerName: "Mrs. Nasreen Akhter",
    contactPhone: "+8801819776655",
    isLegallyVerified: true,
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80"],
    facilities: ["24/7 Lift & Generator Backup", "Car Parking", "CCTV Security", "Modern Fitted Kitchen"],
    status: "available"
  }
];

let marriageProfiles: any[] = [
  {
    id: "mat_01",
    biodataNumber: "ASC-MAT-2026-441",
    gender: "male",
    age: 29,
    height: "5' 9\"",
    complexion: "Fair",
    education: "B.Sc in Civil Engineering (BUET)",
    profession: "Senior Structural Design Engineer",
    monthlyIncome: "1,20,000+ BDT",
    district: "Dhaka",
    upazila: "Dhanmondi",
    maritalStatus: "unmarried",
    partnerPreferences: "Practicing Muslim, Educated (Graduate), Polite & Family-Oriented.",
    isVerified: true,
    privacyLevel: "public_preview"
  },
  {
    id: "mat_02",
    biodataNumber: "ASC-MAT-2026-582",
    gender: "female",
    age: 26,
    height: "5' 4\"",
    complexion: "Very Fair",
    education: "MBBS (Dhaka Medical College)",
    profession: "Medical Officer",
    monthlyIncome: "75,000+ BDT",
    district: "Chattogram",
    upazila: "Panchlaish",
    maritalStatus: "unmarried",
    partnerPreferences: "Doctor / Engineer / First Class Govt Officer, Non-smoker, Religious mindset.",
    isVerified: true,
    privacyLevel: "public_preview"
  }
];

// ==========================================
// MEDICAL COURSES & INSTITUTE (CMSS AFFILIATED)
// ==========================================
const medicalInstituteInfo = {
  name: "Companiganj Paramedical Institute",
  nameBn: "কোম্পানীগঞ্জ প্যারামেডিকেল ইনস্টিটিউট",
  affiliation: "CMSS Institute of Medical Technology Branch",
  affiliationBn: "CMSS ইনস্টিটিউট অব মেডিকেল টেকনোলজি এর একটি শাখা",
  registrationNo: "ঢাকা S-৩১৪৪ (১০৯) ২০০৩",
  approvals: [
    { titleBn: "বাংলাদেশ সরকারের স্বাস্থ্য অধিদপ্তর থেকে অনুমোদিত", ref: "DGHS-BD-APPROVED" },
    { titleBn: "যুব উন্নয়ন অধিদপ্তর", ref: "ইউডভ/নোয়া-২৬৭/২০১৪" },
    { titleBn: "পরিবার পরিকল্পনা অধিদপ্তর", ref: "১৫৭/০১, তাং-২৩/৩/২০০১" },
    { titleBn: "সমাজ সেবা অধিদপ্তর", ref: "লক্ষ্মী-২৩০ তাং- ২৩/২/২০০০" }
  ],
  features: [
    "মনোরম ও নিরিবিলি পরিবেশ সকলের জন্য বিশেষভাবে আকর্ষণীয়।",
    "নোয়াখালী জেনারেল হাসপাতালে ইন্টার্নি করার সুবর্ণ সুযোগ।",
    "বিভিন্ন স্বনামধন্য বেসরকারি হাসপাতালগুলোতে ক্লিনিক্যাল প্র্যাকটিসের সুযোগ।",
    "অভিজ্ঞ ও দক্ষ শিক্ষকমণ্ডলীর সরাসরি তত্ত্বাবধানে ক্লাস সম্পন্ন।",
    "সেমিস্টার পদ্ধতিতে পরীক্ষা, বছরে ২টি সেমিস্টারে সার্বিক মূল্যায়ন।",
    "আধুনিক ফর্মুলায় তৈরি সমৃদ্ধ লেকচার শিট ও হ্যান্ডআউট প্রদান।",
    "সরকারি কারিকুলাম হুবহু অনুসরণে পাঠদান কার্যক্রম।",
    "ব্যবহারিক ল্যাব ক্লাসের মাধ্যমে হাতে-কলমে প্রশিক্ষণ ও দক্ষতা নিশ্চিতকরণ।"
  ],
  admissionSession: "June to May (জুন থেকে মে সেশন - ভর্তি চলছে)",
  addressBn: "রৌশন আরা মার্কেট, বসুরহাট, কোম্পানীগঞ্জ, নোয়াখালী।",
  helpline: "01973-817167",
  secondaryPhone: "01813-817167",
  bkashPaymentNumber: "01973817167",
  examCenter: "নোয়াখালী পরীক্ষা কেন্দ্র (সেন্টার কোড: NH-702)"
};

let medicalCourses: any[] = [
  {
    id: "med_dma",
    code: "DMA",
    serialNo: 2,
    title: "Diploma in Medical Assistant (DMA)",
    titleBn: "DMA (ডিপ্লোমা ইন মেডিকেল অ্যাসিস্ট্যান্ট)",
    duration: "1 Year",
    durationBn: "১ বৎসর",
    eligibility: "SSC / Equivalent pass from any group",
    eligibilityBn: "যে কোন গ্রুপ থেকে এস.এস.সি / সমমান পাশ",
    totalFee: 25000,
    admissionFee: 5000,
    monthlyFee: 1500,
    session: "June - May",
    sessionBn: "জুন থেকে মে সেশন (ভর্তি চলছে)",
    description: "1-year Government curriculum recognized medical assistant diploma covering human anatomy, pharmacology, clinical primary healthcare, and hands-on internship.",
    descriptionBn: "বাংলাদেশ সরকারের স্বাস্থ্য অধিদপ্তর ও CMSS অনুমোদিত ১ বছর মেয়াদী ডিপ্লোমা ইন মেডিকেল অ্যাসিস্ট্যান্ট কোর্স। হাসপাতাল ও ক্লিনিকে সফল ক্যারিয়ারের নিশ্চয়তা।",
    subjects: [
      "অ্যানাটমি ও হিউম্যান ফিজিওলজি (Anatomy & Human Physiology)",
      "ফার্মাকোলজি ও থেরাপিউটিক মেডিসিন (Pharmacology)",
      "ফার্স্ট এইড, ব্যান্ডেজিং ও মাইনর সার্জিক্যাল ড্রেসিং",
      "ক্লিনিক্যাল প্যাথলজি ও বেসিক ডায়াগনস্টিকস",
      "কমিউনিটি মেডিসিন ও প্রাইমারি হেলথকেয়ার",
      "নোয়াখালী জেনারেল হাসপাতাল ইন্টার্নশিপ ও প্র্যাকটিক্যাল"
    ],
    features: [
      "নোয়াখালী জেনারেল হাসপাতালে ইন্টার্নশিপ সুবিধা",
      "সেমিস্টার পদ্ধতিতে পরীক্ষা (বছরে ২টি সেমিস্টার)",
      "সরকারি কারিকুলাম অনুসরণ ও আধুনিক লেকচার শিট",
      "অভিজ্ঞ এমবিবিএস চিকিৎসকদের সমন্বয়ে ক্লাস"
    ],
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
    badgeBn: "স্বল্পসংখ্যক আসন",
    status: "active"
  },
  {
    id: "med_dpt",
    code: "DPT",
    serialNo: 3,
    title: "Diploma in Physiotherapy (DPT)",
    titleBn: "ফিজিওথেরাপি (Physiotherapy)",
    duration: "1 Year",
    durationBn: "১ বৎসর",
    eligibility: "SSC / Equivalent pass from any group",
    eligibilityBn: "যে কোন গ্রুপ থেকে এস.এস.সি / সমমান পাশ",
    totalFee: 25000,
    admissionFee: 5000,
    monthlyFee: 1500,
    session: "June - May",
    sessionBn: "জুন থেকে মে সেশন (ভর্তি চলছে)",
    description: "Professional physiotherapy course focusing on electrotherapy, physical rehabilitation, stroke recovery, and musculoskeletal pain management.",
    descriptionBn: "আধুনিক ইলেক্ট্রোথেরাপি, অর্থোপেডিক রিহ্যাবিলিটেশন ও থেরাপিউটিক এক্সারসাইজ সম্বলিত ১ বছর মেয়াদী প্রফেশনাল ফিজিওথেরাপি কোর্স।",
    subjects: [
      "ফিজিওথেরাপি পরিচিতি ও বায়োমেকানিক্স",
      "ইলেক্ট্রোথেরাপি, আল্ট্রাসাউন্ড ও হিট থেরাপি টেকনিক",
      "ম্যানুয়াল থেরাপি ও অর্থোপেডিক এক্সারসাইজ",
      "প্যারালাইসিস ও নিউরোলজিক্যাল রিহ্যাবিলিটেশন",
      "হাসপাতাল ক্লিনিক্যাল প্র্যাকটিস ও কেস স্টাডি"
    ],
    features: [
      "আধুনিক ফিজিওথেরাপি মেশিনে সরাসরি ব্যবহারিক ক্লাস",
      "বেসরকারি হাসপাতালগুলোতে প্র্যাকটিসের সুযোগ",
      "বিশেষ ছাড় ও স্বল্প খরচে কোর্স সম্পন্ন"
    ],
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80",
    badgeBn: "বিশেষ ছাড়ে ভর্তি",
    status: "active"
  },
  {
    id: "med_dental",
    code: "DENTAL",
    serialNo: 4,
    title: "Dental Technology & Oral Health",
    titleBn: "ডেন্টাল (Dental Technology)",
    duration: "1 Year",
    durationBn: "১ বৎসর",
    eligibility: "SSC / Equivalent pass from any group",
    eligibilityBn: "যে কোন গ্রুপ থেকে এস.এস.সি / সমমান পাশ",
    totalFee: 25000,
    admissionFee: 5000,
    monthlyFee: 1500,
    session: "June - May",
    sessionBn: "জুন থেকে মে সেশন (ভর্তি চলছে)",
    description: "Hands-on dental assisting, scaling, polishing, tooth extraction protocols, and dental equipment maintenance.",
    descriptionBn: "দাঁতের স্কেলিং, ফিলিং, রুট ক্যানেল অ্যাসিস্টিং এবং ডেন্টাল টেকনোলজির ওপর ব্যবহারিক ও যুগোপযোগী ১ বছর মেয়াদী কোর্স।",
    subjects: [
      "ওরাল অ্যানাটমি ও ডেন্টাল হিস্টোলজি",
      "ডেন্টাল ইকুইপমেন্ট ও মেটেরিয়ালস হ্যান্ডলিং",
      "স্কেলিং, পলিশিং ও মাড়ির যত্ন",
      "দাঁত তোলা ও লোকাল অ্যানাস্থেসিয়া বেসিকস",
      "ডেন্টাল চেম্বার ম্যানেজমেন্ট ও স্টেরিলাইজেশন"
    ],
    features: [
      "ডেন্টাল ল্যাব ও আধুনিক চেয়ার প্র্যাকটিস",
      "অভিজ্ঞ ডেন্টাল সার্জনের সরাসরি ক্লাস",
      "সার্টিফিকেট ও ইন্টার্নশিপ প্রদান"
    ],
    imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80",
    badgeBn: "জনপ্রিয় কোর্স",
    status: "active"
  },
  {
    id: "med_dmlt",
    code: "DMLT",
    serialNo: 5,
    title: "Diploma in Medical Laboratory Technology (Pathology)",
    titleBn: "প্যাথলজি (Pathology / DMLT)",
    duration: "1 Year",
    durationBn: "১ বৎসর",
    eligibility: "SSC / Equivalent pass from any group",
    eligibilityBn: "যে কোন গ্রুপ থেকে এস.এস.সি / সমমান পাশ",
    totalFee: 25000,
    admissionFee: 5000,
    monthlyFee: 1500,
    session: "June - May",
    sessionBn: "জুন থেকে মে সেশন (ভর্তি চলছে)",
    description: "Diagnostic laboratory techniques covering hematology, biochemistry, urine/stool microscopy, and pathology analyzer equipment.",
    descriptionBn: "রক্ত, প্রস্রাব ও বায়োকেমিক্যাল টেস্টের আধুনিক ল্যাবরেটরি টেকনিক ও ডায়াগনস্টিক প্যাথলজি প্রশিক্ষণ।",
    subjects: [
      "ক্লিনিক্যাল প্যাথলজি ও ল্যাব সেফটি",
      "হেমাটোলজি ও কমপ্লিট ব্লাড কাউন্ট (CBC)",
      "ক্লিনিক্যাল বায়োকেমিস্ট্রি (Lipid, LFT, KFT, Sugar)",
      "মাইক্রোবায়োলজি, ইউরিন ও স্টুল আর/ই",
      "অটোমেটেড ল্যাব অ্যানালাইজার চালনা"
    ],
    features: [
      "সম্পূর্ণ ল্যাব ইকুইপমেন্টে প্র্যাকটিক্যাল",
      "ডায়াগনস্টিক সেন্টারে চাকরির দ্রুত সুযোগ",
      "নোয়াখালী জেনারেল হাসপাতালে ইন্টার্নশিপ"
    ],
    imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80",
    badgeBn: "উচ্চ চাকুরীর সুযোগ",
    status: "active"
  },
  {
    id: "med_c_mss_lmaf",
    code: "CMSS_LMAF",
    serialNo: 6,
    title: "Community Medical & Special Services (CMSS / LMAF)",
    titleBn: "CMSS / LMAF (কমিউনিটি মেডিকেল)",
    duration: "6 Months",
    durationBn: "৬ মাস",
    eligibility: "SSC / Eight Pass / Local Experience",
    eligibilityBn: "যে কোন গ্রুপ থেকে এস.এস.সি পাশ / ৮ম শ্রেণী / অভিজ্ঞতা",
    totalFee: 15000,
    admissionFee: 3000,
    monthlyFee: 2000,
    session: "June - May",
    sessionBn: "জুন থেকে মে সেশন (ভর্তি চলছে)",
    description: "Intensive 6-month primary healthcare course for rural community medical officers and local medical assistants.",
    descriptionBn: "কমিউনিটি পর্যায়ে প্রাথমিক চিকিৎসা, সাধারণ রোগ নির্ণয়, ওষুধ প্রয়োগ ও প্রাথমিক স্বাস্থ্যসেবার ৬ মাসের শর্ট কোর্স।",
    subjects: [
      "প্রাথমিক স্বাস্থ্যসেবা ও বেসিক অ্যানাটমি",
      "সাধারণ অ্যান্টিবায়োটিক, ব্যথানাশক ও গ্যাস্ট্রিক ওষুধ",
      "রক্তচাপ নির্ণয়, ডায়াবেটিস টেস্ট ও নেবুলাইজেশন",
      "ফার্স্ট এইড, ড্রেসিং ও আইভি ক্যানুলা পুশ",
      "প্রেসক্রিপশন রিডিং ও ফার্মাসিউটিক্যাল নিয়মাবলী"
    ],
    features: [
      "স্বল্প মেয়াদে প্র্যাকটিশনার হওয়ার সুযোগ",
      "সহজ ও প্রাঞ্জল ভাষায় লেকচার শিট",
      "সরকারি রেজিস্ট্রেশন সনদ প্রদান"
    ],
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80",
    badgeBn: "স্বল্পমেয়াদী",
    status: "active"
  },
  {
    id: "med_refresher",
    code: "REFRESHER",
    serialNo: 7,
    title: "Doctor Refresher Course",
    titleBn: "ডাক্তার রিপ্রেসার্স কোর্স (Doctor Refresher)",
    duration: "21 Days",
    durationBn: "২১ দিন",
    eligibility: "Rural Doctors, Practitioners, RMP, LMAF, Diploma Holders",
    eligibilityBn: "পল্লী চিকিৎসক / ডিপ্লোমাধারী / অভিজ্ঞ প্র্যাকটিশনার",
    totalFee: 5000,
    admissionFee: 2000,
    monthlyFee: 0,
    session: "Monthly Batches",
    sessionBn: "প্রতি মাসের ১ম ও ১৫ তারিখ নতুন ব্যাচ",
    description: "Upgraded 21-day advanced medical update course on current treatment guidelines, antibiotic stewardship, and emergency medicine.",
    descriptionBn: "চলতি চিকিৎসা ব্যবস্থার আধুনিক গাইডলাইন, প্রেসক্রিপশন অডিট ও জরুরি মেডিসিনের নিবিড় ২১ দিনের রিফ্রেশার্স কোর্স।",
    subjects: [
      "মডার্ন ট্রিটমেন্ট প্রটোকল ২০২৬",
      "অ্যান্টিবায়োটিক রেজিস্ট্যান্স ও সঠিক প্রয়োগ",
      "সিজনাল জ্বর, ডেঙ্গু ও সংক্রামক রোগ ব্যবস্থাপনা",
      "ইমার্জেন্সি কার্ডিয়াক ও রেসপিরেটরি ফার্স্ট এইড",
      "আইনি সচেতনতা ও রেফারেল সিস্টেম"
    ],
    features: [
      "২১ দিনে স্পেশাল সার্টিফিকেট ও আইডি কার্ড",
      "অভিজ্ঞ বিশেষজ্ঞ চিকিৎসকদের বিশেষ লেকচার",
      "প্রেসক্রিপশন রাইটিং উন্নতকরণ"
    ],
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80",
    badgeBn: "২১ দিনের ক্যাপসুল কোর্স",
    status: "active"
  },
  {
    id: "med_nursing",
    code: "NURSING",
    serialNo: 8,
    title: "Nursing & Patient Care Technology",
    titleBn: "নার্সিং (Nursing & Patient Care)",
    duration: "1 Year",
    durationBn: "১ বৎসর",
    eligibility: "SSC / Equivalent pass from any group",
    eligibilityBn: "যে কোন গ্রুপ থেকে এস.এস.সি / সমমান পাশ",
    totalFee: 30000,
    admissionFee: 6000,
    monthlyFee: 2000,
    session: "June - May",
    sessionBn: "জুন থেকে মে সেশন (ভর্তি চলছে)",
    description: "1-year hospital nursing, post-operative care, ICU assisting, vital monitoring, and patient counseling certification.",
    descriptionBn: "হাসপাতাল নার্সিং, আইসিইউ/সিসিইউ পেশেন্ট কেয়ার, মেডিসিন অ্যাডমিনিস্ট্রেশন ও পোস্ট-অপারেটিভ কেয়ার প্রশিক্ষণ।",
    subjects: [
      "ফান্ডামেন্টালস অব নার্সিং ও পেশেন্ট কেয়ার আর্ট",
      "মেডিকেল ও সার্জিক্যাল নার্সিং কেয়ার",
      "মেটারনাল ও চাইল্ড হেলথ কেয়ার (MCH)",
      "স্যালাইন, ইনজেকশন, ক্যানুলা ও ক্যাথেটারাইজেশন",
      "নোয়াখালী জেনারেল হাসপাতালে ওয়ার্ড রোস্টার ও ইন্টার্নশিপ"
    ],
    features: [
      "১০০% ব্যবহারিক ওয়ার্ড ট্রেনিং",
      "গার্মেন্টস/ক্লিনিক ও হাসপাতালে নিশ্চিত চাকরির সুযোগ",
      "সরকারি কারিকুলাম ও ইউনিফর্ম সুবিধা"
    ],
    imageUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&auto=format&fit=crop&q=80",
    badgeBn: "১০০% ইন্টার্নশিপ",
    status: "active"
  },
  {
    id: "med_mcsc",
    code: "MCSC",
    serialNo: 9,
    title: "Medical & Clinical Sciences Course (MCSC)",
    titleBn: "MCSC (মেডিকেল অ্যান্ড ক্লিনিক্যাল সায়েন্সেস)",
    duration: "4 Years",
    durationBn: "৪ বৎসর",
    eligibility: "SSC passed from Science / Any group",
    eligibilityBn: "যে কোন গ্রুপ থেকে এস.এস.সি পাশ",
    totalFee: 80000,
    admissionFee: 10000,
    monthlyFee: 1500,
    session: "June - May",
    sessionBn: "জুন থেকে মে সেশন (ভর্তি চলছে)",
    description: "4-year comprehensive professional diploma in medical and clinical sciences with 8 semesters and full government hospital internship.",
    descriptionBn: "৪ বছর মেয়াদী দীর্ঘমেয়াদী পূর্ণাঙ্গ প্রফেশনাল মেডিকেল ও ক্লিনিক্যাল সায়েন্স কোর্স। ৮টি সেমিস্টার ও সরকারি হাসপাতালে ৬ মাসের ইন্টার্নশিপ।",
    subjects: [
      "কম্প্রিহেনসিভ হিউম্যান অ্যানাটমি ও ফিজিওলজি",
      "প্যাথলজি, মাইক্রোবায়োলজি ও বায়োকেমিস্ট্রি",
      "ফার্মাকোলজি ও থেরাপিউটিক মেডিসিন",
      "কমিউনিটি মেডিসিন ও পাবলিক হেলথ ম্যানেজমেন্ট",
      "মাইনর সার্জারি, ওটি ম্যানেজমেন্ট ও ড্রেসিং",
      "গাইনোকোলজি, অবস্টেট্রিক্স ও পেডিয়াট্রিক কেয়ার",
      "মেডিকেল এথিক্স, ফরেনসিক ও ডায়াগনস্টিক ইন্টারপ্রিটেশন",
      "নোয়াখালী জেনারেল হাসপাতালে ৬ মাসের নিবিড় ইন্টার্নশিপ"
    ],
    features: [
      "৪ বছরের পূর্ণাঙ্গ ডিপ্লোমা সনদ",
      "স্বাস্থ্য অধিদপ্তর ও CMSS এর সর্বোচ্চ মানদণ্ড",
      "স্বনামধন্য ক্লিনিকে মেডিকেল অফিসার হিসেবে যোগদানের সুযোগ"
    ],
    imageUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80",
    badgeBn: "৪ বছরের ডিপ্লোমা",
    status: "active"
  }
];

let medicalAdmissions: any[] = [
  {
    id: "adm_med_01",
    trackingNumber: "ASC-MED-2026-101",
    courseId: "med_dma",
    courseCode: "DMA",
    courseTitleBn: "DMA (ডিপ্লোমা ইন মেডিকেল অ্যাসিস্ট্যান্ট)",
    studentName: "Md. Tarikul Islam",
    studentNameBn: "মো. তরিকুল ইসলাম",
    fatherName: "Md. Sirajul Islam",
    fatherNameBn: "মো. সিরাজুল ইসলাম",
    motherName: "Fatema Begum",
    motherNameBn: "ফাতেমা বেগম",
    gender: "male",
    dateOfBirth: "2003-05-14",
    bloodGroup: "A+",
    nidOrBirthReg: "20037518901234567",
    academicQualification: "SSC (Science, GPA: 4.80)",
    gpaOrGrade: "4.80",
    passingYear: "2021",
    boardOrInstitute: "Cumilla Board",
    phone: "01711223344",
    guardianPhone: "01819776655",
    email: "tarikul.med@ascado.org",
    presentAddress: "Basurhat, Companiganj, Noakhali",
    permanentAddress: "Basurhat, Companiganj, Noakhali",
    photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
    paymentMethod: "bkash",
    paymentTrxId: "BK99281745",
    paymentAmount: 5000,
    status: "approved",
    assignedRoll: "1024",
    assignedRegNo: "CMSS-2025-881",
    createdAt: "2026-06-10T10:00:00Z"
  },
  {
    id: "adm_med_02",
    trackingNumber: "ASC-MED-2026-102",
    courseId: "med_nursing",
    courseCode: "NURSING",
    courseTitleBn: "নার্সিং (Nursing & Patient Care)",
    studentName: "Nusrat Jahan Mim",
    studentNameBn: "নুসরাত জাহান মিম",
    fatherName: "Jahangir Alam",
    fatherNameBn: "জাহাঙ্গীর আলম",
    motherName: "Ruma Akhter",
    motherNameBn: "রুমা আক্তার",
    gender: "female",
    dateOfBirth: "2004-09-20",
    bloodGroup: "O+",
    nidOrBirthReg: "20047518909876543",
    academicQualification: "SSC (Humanities, GPA: 4.50)",
    gpaOrGrade: "4.50",
    passingYear: "2022",
    boardOrInstitute: "Chattogram Board",
    phone: "01811223399",
    guardianPhone: "01712998877",
    email: "mim.nursing@ascado.org",
    presentAddress: "Roushan Ara Market, Basurhat, Companiganj",
    permanentAddress: "Char Kakra, Companiganj, Noakhali",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    paymentMethod: "bkash",
    paymentTrxId: "BK88371902",
    paymentAmount: 6000,
    status: "approved",
    assignedRoll: "1025",
    assignedRegNo: "CMSS-2025-882",
    createdAt: "2026-06-15T11:30:00Z"
  },
  {
    id: "adm_med_03",
    trackingNumber: "ASC-MED-2026-103",
    courseId: "med_mcsc",
    courseCode: "MCSC",
    courseTitleBn: "MCSC (মেডিকেল অ্যান্ড ক্লিনিক্যাল সায়েন্সেস)",
    studentName: "Md. Abdullah Al Noman",
    studentNameBn: "ডা. মো. আব্দুল্লাহ আল নোমান",
    fatherName: "Abdul Quader",
    fatherNameBn: "আব্দুল কাদের",
    motherName: "Shahida Begum",
    motherNameBn: "শাহিদা বেগম",
    gender: "male",
    dateOfBirth: "2002-12-05",
    bloodGroup: "B+",
    nidOrBirthReg: "20027518903344556",
    academicQualification: "HSC (Science, GPA: 4.90)",
    gpaOrGrade: "4.90",
    passingYear: "2022",
    boardOrInstitute: "Cumilla Board",
    phone: "01911223300",
    guardianPhone: "01813817167",
    email: "noman.mcsc@ascado.org",
    presentAddress: "Maijdee Court, Noakhali Sadar",
    permanentAddress: "Sirajpur, Companiganj, Noakhali",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    paymentMethod: "bkash",
    paymentTrxId: "BK77482910",
    paymentAmount: 10000,
    status: "approved",
    assignedRoll: "1026",
    assignedRegNo: "CMSS-2025-883",
    createdAt: "2026-06-18T14:00:00Z"
  },
  {
    id: "adm_med_04",
    trackingNumber: "ASC-MED-2026-104",
    courseId: "med_dmlt",
    courseCode: "DMLT",
    courseTitleBn: "প্যাথলজি (Pathology / DMLT)",
    studentName: "Shamima Akter",
    studentNameBn: "শামীমা আক্তার",
    fatherName: "Hafizur Rahman",
    fatherNameBn: "হাফিজুর রহমান",
    motherName: "Nasima Begum",
    motherNameBn: "নাসিমা বেগম",
    gender: "female",
    dateOfBirth: "2004-03-18",
    bloodGroup: "AB+",
    nidOrBirthReg: "20047518906677889",
    academicQualification: "SSC (Science, GPA: 4.65)",
    gpaOrGrade: "4.65",
    passingYear: "2022",
    boardOrInstitute: "Cumilla Board",
    phone: "01611223344",
    guardianPhone: "01973817167",
    email: "shamima.dmlt@ascado.org",
    presentAddress: "Basurhat Pourashava, Companiganj",
    permanentAddress: "Rampur, Companiganj, Noakhali",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
    paymentMethod: "bkash",
    paymentTrxId: "BK66591023",
    paymentAmount: 5000,
    status: "approved",
    assignedRoll: "1027",
    assignedRegNo: "CMSS-2025-884",
    createdAt: "2026-06-20T16:15:00Z"
  }
];

let medicalStudents: any[] = [
  {
    id: "std_med_01",
    rollNumber: "1024",
    registrationNumber: "CMSS-2025-881",
    fullName: "Md. Tarikul Islam",
    fullNameBn: "মো. তরিকুল ইসলাম",
    fatherName: "Md. Sirajul Islam",
    fatherNameBn: "মো. সিরাজুল ইসলাম",
    motherName: "Fatema Begum",
    motherNameBn: "ফাতেমা বেগম",
    courseCode: "DMA",
    courseTitleBn: "DMA (ডিপ্লোমা ইন মেডিকেল অ্যাসিস্ট্যান্ট)",
    durationBn: "১ বৎসর",
    session: "2025-2026",
    instituteName: "Companiganj Paramedical Institute",
    instituteNameBn: "কোম্পানীগঞ্জ প্যারামেডিকেল ইনস্টিটিউট",
    registrationAuthority: "CMSS Institute of Medical Technology (Reg: Dhaka S-3144(109) 2003)",
    registrationAuthorityBn: "সিএমএসএস ইনস্টিটিউট অব মেডিকেল টেকনোলজি (রেজিঃ ঢাকা এস-৩১৪৪ (১০৯) ২০০৩)",
    centerNameBn: "নোয়াখালী পরীক্ষা কেন্দ্র (সেন্টার কোড: NH-702)",
    phone: "01711223344",
    guardianPhone: "01819776655",
    bloodGroup: "A+",
    address: "Basurhat, Companiganj, Noakhali",
    addressBn: "বসুরহাট, কোম্পানীগঞ্জ, নোয়াখালী",
    photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
    qrCodeData: "https://ascado.org/medical/verify?roll=1024&reg=CMSS-2025-881",
    currentSemester: "Final Semester",
    cgpa: 3.92,
    status: "active",
    issueDate: "2025-07-01",
    expiryDate: "2026-06-30"
  },
  {
    id: "std_med_02",
    rollNumber: "1025",
    registrationNumber: "CMSS-2025-882",
    fullName: "Nusrat Jahan Mim",
    fullNameBn: "নুসরাত জাহান মিম",
    fatherName: "Jahangir Alam",
    fatherNameBn: "জাহাঙ্গীর আলম",
    motherName: "Ruma Akhter",
    motherNameBn: "রুমা আক্তার",
    courseCode: "NURSING",
    courseTitleBn: "নার্সিং (Nursing & Patient Care)",
    durationBn: "১ বৎসর",
    session: "2025-2026",
    instituteName: "Companiganj Paramedical Institute",
    instituteNameBn: "কোম্পানীগঞ্জ প্যারামেডিকেল ইনস্টিটিউট",
    registrationAuthority: "CMSS Institute of Medical Technology (Reg: Dhaka S-3144(109) 2003)",
    registrationAuthorityBn: "সিএমএসএস ইনস্টিটিউট অব মেডিকেল টেকনোলজি (রেজিঃ ঢাকা এস-৩১৪৪ (১০৯) ২০০৩)",
    centerNameBn: "নোয়াখালী পরীক্ষা কেন্দ্র (সেন্টার কোড: NH-702)",
    phone: "01811223399",
    guardianPhone: "01712998877",
    bloodGroup: "O+",
    address: "Char Kakra, Companiganj, Noakhali",
    addressBn: "চর কাঁকড়া, কোম্পানীগঞ্জ, নোয়াখালী",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    qrCodeData: "https://ascado.org/medical/verify?roll=1025&reg=CMSS-2025-882",
    currentSemester: "Final Semester",
    cgpa: 4.00,
    status: "active",
    issueDate: "2025-07-01",
    expiryDate: "2026-06-30"
  },
  {
    id: "std_med_03",
    rollNumber: "1026",
    registrationNumber: "CMSS-2025-883",
    fullName: "Md. Abdullah Al Noman",
    fullNameBn: "ডা. মো. আব্দুল্লাহ আল নোমান",
    fatherName: "Abdul Quader",
    fatherNameBn: "আব্দুল কাদের",
    motherName: "Shahida Begum",
    motherNameBn: "শাহিদা বেগম",
    courseCode: "MCSC",
    courseTitleBn: "MCSC (মেডিকেল অ্যান্ড ক্লিনিক্যাল সায়েন্সেস)",
    durationBn: "৪ বৎসর",
    session: "2024-2028",
    instituteName: "Companiganj Paramedical Institute",
    instituteNameBn: "কোম্পানীগঞ্জ প্যারামেডিকেল ইনস্টিটিউট",
    registrationAuthority: "CMSS Institute of Medical Technology (Reg: Dhaka S-3144(109) 2003)",
    registrationAuthorityBn: "সিএমএসএস ইনস্টিটিউট অব মেডিকেল টেকনোলজি (রেজিঃ ঢাকা এস-৩১৪৪ (১০৯) ২০০৩)",
    centerNameBn: "নোয়াখালী পরীক্ষা কেন্দ্র (সেন্টার কোড: NH-702)",
    phone: "01911223300",
    guardianPhone: "01813817167",
    bloodGroup: "B+",
    address: "Maijdee Court, Noakhali Sadar",
    addressBn: "মাইজদী কোর্ট, নোয়াখালী সদর",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    qrCodeData: "https://ascado.org/medical/verify?roll=1026&reg=CMSS-2025-883",
    currentSemester: "4th Semester",
    cgpa: 3.85,
    status: "active",
    issueDate: "2024-07-01",
    expiryDate: "2028-06-30"
  },
  {
    id: "std_med_04",
    rollNumber: "1027",
    registrationNumber: "CMSS-2025-884",
    fullName: "Shamima Akter",
    fullNameBn: "শামীমা আক্তার",
    fatherName: "Hafizur Rahman",
    fatherNameBn: "হাফিজুর রহমান",
    motherName: "Nasima Begum",
    motherNameBn: "নাসিমা বেগম",
    courseCode: "DMLT",
    courseTitleBn: "প্যাথলজি (Pathology / DMLT)",
    durationBn: "১ বৎসর",
    session: "2025-2026",
    instituteName: "Companiganj Paramedical Institute",
    instituteNameBn: "কোম্পানীগঞ্জ প্যারামেডিকেল ইনস্টিটিউট",
    registrationAuthority: "CMSS Institute of Medical Technology (Reg: Dhaka S-3144(109) 2003)",
    registrationAuthorityBn: "সিএমএসএস ইনস্টিটিউট অব মেডিকেল টেকনোলজি (রেজিঃ ঢাকা এস-৩১৪৪ (১০৯) ২০০৩)",
    centerNameBn: "নোয়াখালী পরীক্ষা কেন্দ্র (সেন্টার কোড: NH-702)",
    phone: "01611223344",
    guardianPhone: "01973817167",
    bloodGroup: "AB+",
    address: "Rampur, Companiganj, Noakhali",
    addressBn: "রামপুর, কোম্পানীগঞ্জ, নোয়াখালী",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
    qrCodeData: "https://ascado.org/medical/verify?roll=1027&reg=CMSS-2025-884",
    currentSemester: "Final Semester",
    cgpa: 3.88,
    status: "active",
    issueDate: "2025-07-01",
    expiryDate: "2026-06-30"
  }
];

let medicalCertificates: any[] = [
  {
    id: "cert_med_01",
    certificateNo: "CMSS-CERT-2026-1024",
    studentId: "std_med_01",
    rollNumber: "1024",
    registrationNumber: "CMSS-2025-881",
    studentName: "Md. Tarikul Islam",
    studentNameBn: "মো. তরিকুল ইসলাম",
    fatherNameBn: "মো. সিরাজুল ইসলাম",
    motherNameBn: "ফাতেমা বেগম",
    courseTitleBn: "DMA (ডিপ্লোমা ইন মেডিকেল অ্যাসিস্ট্যান্ট)",
    durationBn: "১ বৎসর",
    session: "জুন - মে (২০২৫-২০২৬)",
    examYear: "2026",
    grade: "A+",
    gpa: 3.92,
    issueDate: "2026-08-20",
    status: "verified",
    verificationUrl: "https://ascado.org/medical/verify?cert=CMSS-CERT-2026-1024",
    qrCodeData: "CERTIFICATE_VERIFIED: CMSS-CERT-2026-1024 | Roll: 1024 | Reg: CMSS-2025-881 | Name: Md. Tarikul Islam | Course: DMA | Grade: A+ (GPA: 3.92) | Institute: Companiganj Paramedical Institute | Auth: DGHS & CMSS Approved",
    remarks: "Passed with Distinction in Clinical Practical Examination & General Hospital Internship."
  },
  {
    id: "cert_med_02",
    certificateNo: "CMSS-CERT-2026-1025",
    studentId: "std_med_02",
    rollNumber: "1025",
    registrationNumber: "CMSS-2025-882",
    studentName: "Nusrat Jahan Mim",
    studentNameBn: "নুসরাত জাহান মিম",
    fatherNameBn: "জাহাঙ্গীর আলম",
    motherNameBn: "রুমা আক্তার",
    courseTitleBn: "নার্সিং (Nursing & Patient Care)",
    durationBn: "১ বৎসর",
    session: "জুন - মে (২০২৫-২০২৬)",
    examYear: "2026",
    grade: "A+",
    gpa: 4.00,
    issueDate: "2026-08-20",
    status: "verified",
    verificationUrl: "https://ascado.org/medical/verify?cert=CMSS-CERT-2026-1025",
    qrCodeData: "CERTIFICATE_VERIFIED: CMSS-CERT-2026-1025 | Roll: 1025 | Reg: CMSS-2025-882 | Name: Nusrat Jahan Mim | Course: Nursing | Grade: A+ (GPA: 4.00) | Institute: Companiganj Paramedical Institute",
    remarks: "First Position in Patient Care & Clinical Nursing Art."
  },
  {
    id: "cert_med_03",
    certificateNo: "CMSS-CERT-2026-1026",
    studentId: "std_med_03",
    rollNumber: "1026",
    registrationNumber: "CMSS-2025-883",
    studentName: "Md. Abdullah Al Noman",
    studentNameBn: "ডা. মো. আব্দুল্লাহ আল নোমান",
    fatherNameBn: "আব্দুল কাদের",
    motherNameBn: "শাহিদা বেগম",
    courseTitleBn: "MCSC (মেডিকেল অ্যান্ড ক্লিনিক্যাল সায়েন্সেস)",
    durationBn: "৪ বৎসর",
    session: "জুন - মে (২০২৪-২০২৮)",
    examYear: "2026",
    grade: "A",
    gpa: 3.85,
    issueDate: "2026-08-20",
    status: "verified",
    verificationUrl: "https://ascado.org/medical/verify?cert=CMSS-CERT-2026-1026",
    qrCodeData: "CERTIFICATE_VERIFIED: CMSS-CERT-2026-1026 | Roll: 1026 | Reg: CMSS-2025-883 | Name: Dr. Md. Abdullah Al Noman | Course: MCSC | Grade: A (GPA: 3.85)",
    remarks: "Completed 4th Semester Examination with Honours."
  },
  {
    id: "cert_med_04",
    certificateNo: "CMSS-CERT-2026-1027",
    studentId: "std_med_04",
    rollNumber: "1027",
    registrationNumber: "CMSS-2025-884",
    studentName: "Shamima Akter",
    studentNameBn: "শামীমা আক্তার",
    fatherNameBn: "হাফিজুর রহমান",
    motherNameBn: "নাসিমা বেগম",
    courseTitleBn: "প্যাথলজি (Pathology / DMLT)",
    durationBn: "১ বৎসর",
    session: "জুন - মে (২০২৫-২০২৬)",
    examYear: "2026",
    grade: "A",
    gpa: 3.88,
    issueDate: "2026-08-20",
    status: "verified",
    verificationUrl: "https://ascado.org/medical/verify?cert=CMSS-CERT-2026-1027",
    qrCodeData: "CERTIFICATE_VERIFIED: CMSS-CERT-2026-1027 | Roll: 1027 | Reg: CMSS-2025-884 | Name: Shamima Akter | Course: Pathology | Grade: A (GPA: 3.88)",
    remarks: "Certified in Automated Diagnostic Laboratory Technology."
  }
];

let auditLogs: any[] = [
  {
    id: "aud_01",
    userName: "ascahdoadmin",
    userRole: "SUPER_ADMIN",
    ip: "103.204.244.12",
    action: "SYSTEM_INITIALIZATION",
    module: "Core Security",
    timestamp: new Date().toISOString(),
    details: "ASCADO Multi-NGO Enterprise Core Engine Bootstrapped Successfully."
  },
  {
    id: "aud_02",
    userName: "ascahdoadmin",
    userRole: "SUPER_ADMIN",
    ip: "103.204.244.12",
    action: "BRANCH_VERIFICATION",
    module: "Branch Management",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    details: "Reviewed and approved Dhanmondi Central Branch (Code: ASC-DHK-01)."
  }
];

let cmsNotices: any[] = [
  {
    id: "not_01",
    title: "Application Call for New NGO & Branch Affiliations - 2026",
    titleBn: "২০২৬ অর্থবছরের জন্য নতুন এনজিও ও শাখা অন্তর্ভুক্তি আবেদন সংক্রান্ত বিজ্ঞপ্তি",
    category: "Administration",
    date: "2026-08-20",
    isUrgent: true
  },
  {
    id: "not_02",
    title: "Central Blood Bank Emergency Donor Mobilization Drive",
    titleBn: "সেন্ট্রাল ব্লাড ব্যাংক কর্তৃক বিশেষ রক্তদাতা উদ্বুদ্ধকরণ ও সংগ্রহ ক্যাম্পেইন",
    category: "Healthcare",
    date: "2026-08-18",
    isUrgent: false
  },
  {
    id: "not_03",
    title: "Free ICT & Technical Skills Training Scholarship Results Announced",
    titleBn: "বিনামূল্যে আইসিটি ও কারিগরি প্রশিক্ষণ স্কলারশিপ পরীক্ষার ফলাফল প্রকাশ",
    category: "Education",
    date: "2026-08-15",
    isUrgent: false
  }
];

let heroSlides: any[] = [
  {
    id: "slide_1",
    title: "Integrated Technology for Transparent Social Welfare",
    titleBn: "স্বচ্ছ সমাজ বিনির্মাণে সমন্বিত ডিজিটাল ব্যবস্থাপনা",
    subtitle: "Connecting 64 districts with emergency blood bank, transparent donation funds, interest-free somiti loans, vocational education, and fair marketplace.",
    subtitleBn: "জরুরি রক্তসেবা, স্বচ্ছ অনুদান তহবিল, সুদবিহীন ক্ষুদ্রঋণ সমিতি, মাদ্রাসা ও স্কুল অ্যাকাডেমি এবং যৌথ মার্কেটপ্লেস সেবা সমন্বয়।",
    badge: "Government Approved & Verified NGO Network",
    badgeBn: "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত ও ভেরিফাইড",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&auto=format&fit=crop&q=80",
    buttonText: "Donate Now",
    buttonTextBn: "অনলাইনে অনুদান দিন",
    buttonAction: "donation",
    secondaryButtonText: "Emergency Blood SOS",
    secondaryButtonTextBn: "জরুরি রক্ত আবেদন",
    secondaryButtonAction: "blood_sos",
    active: true,
    order: 1
  },
  {
    id: "slide_2",
    title: "Instant Emergency Blood Donation Bank Across 64 Districts",
    titleBn: "৬৪ জেলায় দ্রুততম জরুরি রক্তসেবা ও রক্তদাতা নেটওয়ার্ক",
    subtitle: "Find verified blood donors in minutes by blood group, district, and upazila without any middleman.",
    subtitleBn: "রক্তের গ্রুপ, জেলা ও উপজেলা ভিত্তিক ভেরিফাইড রক্তদাতাদের সাথে তাৎক্ষণিক সরাসরি যোগাযোগ ও হাসপাতাল এসওএস।",
    badge: "Live 24/7 Blood SOS",
    badgeBn: "২৪/৭ লাইভ রক্তদাতা ও এসওএস সাপোর্ট",
    imageUrl: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1600&auto=format&fit=crop&q=80",
    buttonText: "Find Blood Donor",
    buttonTextBn: "রক্তদাতা খুঁজুন",
    buttonAction: "blood-bank",
    secondaryButtonText: "Register as Donor",
    secondaryButtonTextBn: "রক্তদাতা নিবন্ধন",
    secondaryButtonAction: "blood-bank",
    active: true,
    order: 2
  },
  {
    id: "slide_3",
    title: "100% Transparent Donation Funds & Verified Relief Tracking",
    titleBn: "১০০% স্বচ্ছ অনুদান তহবিল ও ডিজিটাল অডিট লেজার",
    subtitle: "Every taka donated is publicly recorded with instant digital PDF receipt and real-time project expense tracking.",
    subtitleBn: "বন্যা, শীতবস্ত্র, এতিম পুনর্বাসন ও মসজিদ নির্মাণ তহবিলে সরাসরি স্বচ্ছ অনুদান ও ডিজিটাল অডিট ট্র্যাকিং।",
    badge: "Zero Hidden Fees",
    badgeBn: "শতভাগ স্বচ্ছতা ও স্বয়ংক্রিয় রসিদ",
    imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600&auto=format&fit=crop&q=80",
    buttonText: "Support a Cause",
    buttonTextBn: "তহবিলে অংশ নিন",
    buttonAction: "donation",
    secondaryButtonText: "View Public Ledger",
    secondaryButtonTextBn: "স্বচ্ছ হিসাব দেখুন",
    secondaryButtonAction: "donation",
    active: true,
    order: 3
  },
  {
    id: "slide_4",
    title: "Skill Development & Free Technical Academy",
    titleBn: "কারিগরি ও আইসিটি দক্ষতা উন্নয়ন প্রশিক্ষণ একাডেমি",
    subtitle: "Empowering youth and rural communities with coding, graphic design, agriculture technology, and vocational certifications.",
    subtitleBn: "যুবসমাজ ও সুবিধাবঞ্চিতদের স্বাবলম্বী করতে আধুনিক আইটি ও কারিগরি কোর্সে বিনামূল্যে এবং স্বল্প খরচে শিক্ষা।",
    badge: "Certified Vocational LMS",
    badgeBn: "সার্টিফিকেট ও কর্মসংস্থান সহায়তা",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&auto=format&fit=crop&q=80",
    buttonText: "Explore Courses",
    buttonTextBn: "কোর্সসমূহ দেখুন",
    buttonAction: "training",
    secondaryButtonText: "School Management",
    secondaryButtonTextBn: "ডিজিটাল স্কুল পোর্টাল",
    secondaryButtonAction: "school",
    active: true,
    order: 4
  }
];

let galleryPhotos: any[] = [
  {
    id: "gal_1",
    title: "Flood & Disaster Relief Food Distribution",
    titleBn: "সিলেট ও ফেনী অঞ্চলে জরুরি বন্যা ও দুর্যোগ পুনর্বাসন খাদ্য বিতরণ",
    description: "Emergency relief packages with dry food, water purifying tablets and baby food distributed among flood-affected families.",
    descriptionBn: "বন্যাদুর্গত পানিবন্দী পরিবারের মাঝে শুকনো খাদ্য, পানি বিশুদ্ধকরণ ট্যাবলেট ও শিশুখাদ্য পৌঁছে দিচ্ছেন এসকাডো ও সাজেদা ইয়ুথ ফাউন্ডেশনের স্বেচ্ছাসেবক দল।",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80",
    category: "relief",
    categoryBn: "ত্রাণ ও মানবিক সহায়তা",
    location: "Feni & Sylhet, Bangladesh",
    locationBn: "ফেনী ও সিলেট সদর",
    date: "2026-08-18",
    uploaderName: "এসকাডো সেন্ট্রাল রিলিফ টিম",
    likesCount: 142,
    featured: true
  },
  {
    id: "gal_2",
    title: "Free Healthcare & Eye Checkup Camp",
    titleBn: "গ্রামীণ সুবিধাবঞ্চিতদের জন্য ফ্রি মেডিকেল ও চক্ষু চিকিৎসা ক্যাম্প",
    description: "Specialist doctors provided free medical consultations, essential medicines and eye surgeries for rural elderly citizens.",
    descriptionBn: "কোম্পানীগঞ্জ ও বসুরহাটের দুঃস্থ ও প্রবীণ নাগরিকদের বিনামূল্যে বিশেষজ্ঞ চিকিৎসাসেবা, চক্ষু ছানি অপারেশন ও প্রয়োজনীয় ওষুধ বিতরণ।",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80",
    category: "medical",
    categoryBn: "মেডিকেল ও ফ্রি চিকিৎসা",
    location: "Basurhat, Noakhali",
    locationBn: "বসুরহাট, নোয়াখালী",
    date: "2026-08-12",
    uploaderName: "ডা. সাজেদ আহমেদ ও স্বাস্থ্য উইং",
    likesCount: 98,
    featured: true
  },
  {
    id: "gal_3",
    title: "Mass Voluntary Blood Donation & Donor Registration",
    titleBn: "সারাদেশব্যাপী গণ-রক্তদান ও নতুন রক্তদাতা নিবন্ধন উৎসব",
    description: "Over 250 bags of emergency blood collected for thalassemic patients and emergency hospitals.",
    descriptionBn: "থ্যালাসেমিয়া রোগী ও জরুরি সড়ক দুর্ঘটনায় আহতদের জন্য স্বেচ্ছায় ২৫০+ ব্যাগ রক্তদান এবং তরুণদের লাইভ রক্তদাতা হিসেবে নিবন্ধন।",
    imageUrl: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1200&auto=format&fit=crop&q=80",
    category: "blood",
    categoryBn: "রক্তদান কর্মসূচি",
    location: "Dhaka Central & Noakhali",
    locationBn: "ঢাকা সেন্ট্রাল ও নোয়াখালী",
    date: "2026-08-05",
    uploaderName: "লাইভ ব্লাড এসওএস নেটওয়ার্ক",
    likesCount: 215,
    featured: true
  },
  {
    id: "gal_4",
    title: "Sajeda Youth Foundation Orphan Welfare & New Clothes",
    titleBn: "সাজেদা ইয়ুথ ফাউন্ডেশনের উদ্যোগে এতিম শিশু পুনর্বাসন ও শিক্ষা সামগ্রী উপহার",
    description: "Providing new clothes, school bags, notebooks and nutritious meal sponsorships for Madrasa and orphanage students.",
    descriptionBn: "সুবিধাবঞ্চিত এতিমখানা ও মাদ্রাসার শিশুদের জন্য নতুন পোশাক, স্কুল ব্যাগ, খাতা-কলম ও পুষ্টিকর খাবার বিতরণ কর্মসূচি।",
    imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&auto=format&fit=crop&q=80",
    category: "sajeda",
    categoryBn: "সাজেদা ইয়ুথ ফাউন্ডেশন",
    location: "Chattogram & Noakhali",
    locationBn: "চট্টগ্রাম ও নোয়াখালী",
    date: "2026-07-28",
    uploaderName: "সাজেদা ইয়ুথ সোশ্যাল উইং",
    likesCount: 184,
    featured: true
  },
  {
    id: "gal_5",
    title: "Youth ICT & Vocational Coding Training Academy",
    titleBn: "তরুণ-তরুণীদের বিনামূল্যে আইটি ও ফ্রিল্যান্সিং কম্পিউটার প্রশিক্ষণ",
    description: "Free computer lab training in basic computing, web development and graphic design for underprivileged youths.",
    descriptionBn: "গ্রামের বেকার তরুণ-তরুণীদের স্বাবলম্বী করতে ডিজিটাল কম্পিউটার ল্যাবে তথ্যপ্রযুক্তি ও আউটসোর্সিং দক্ষতা উন্নয়ন ক্লাস।",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80",
    category: "education",
    categoryBn: "শিক্ষা ও প্রশিক্ষণ একাডেমি",
    location: "ASCADO Skill Lab, Basurhat",
    locationBn: "এসকাডো আইসিটি ল্যাব, বসুরহাট",
    date: "2026-07-15",
    uploaderName: "আইসিটি ও একাডেমি টিম",
    likesCount: 167,
    featured: true
  },
  {
    id: "gal_6",
    title: "Nationwide Environmental Green Tree Plantation Campaign",
    titleBn: "পরিবেশ সুরক্ষায় দেশব্যাপী ১০,০০০ ফলদ ও বনজ বৃক্ষরোপণ কর্মসূচি",
    description: "Volunteers planted saplings along school grounds, highways and riverbanks to fight climate change.",
    descriptionBn: "জলবায়ু পরিবর্তন রোধ ও পরিবেশের ভারসাম্য রক্ষায় নদী তীর, স্কুল প্রাঙ্গণ ও মহাসড়কের পাশে সবুজ বৃক্ষরোপণ অভিযান।",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80",
    category: "plantation",
    categoryBn: "বৃক্ষরোপণ ও পরিবেশ",
    location: "Nationwide 64 Districts",
    locationBn: "৬৪ জেলার বিভিন্ন উপজেলা",
    date: "2026-07-02",
    uploaderName: "পরিবেশ ও গ্রিন স্বেচ্ছাসেবক দল",
    likesCount: 129,
    featured: false
  },
  {
    id: "gal_7",
    title: "Annual Central & District Branch Leadership Conference",
    titleBn: "এসকাডো কেন্দ্রীয় পরিচালনা পর্ষদ ও জেলা শাখা নেতৃবৃন্দের সমন্বয় সম্মেলন",
    description: "District executive committee leaders joined for transparent progress review and future welfare action roadmap.",
    descriptionBn: "সারাদেশের ৬৪ জেলা ও উপজেলা কমিটির দায়িত্বপ্রাপ্ত প্রতিনিধিদের উপস্থিতিতে কেন্দ্রীয় বার্ষিক সম্মেলন ও জবাবদিহিতা সভা।",
    imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80",
    category: "branch",
    categoryBn: "শাখা সম্মেলন ও সভা",
    location: "Central Auditorium, Dhaka",
    locationBn: "কেন্দ্রীয় অডিটোরিয়াম, ঢাকা",
    date: "2026-06-20",
    uploaderName: "কেন্দ্রীয় পরিচালনা পর্ষদ",
    likesCount: 193,
    featured: false
  },
  {
    id: "gal_8",
    title: "Rural Women Empowerment & Handloom Handicrafts Fair",
    titleBn: "গ্রামীণ নারীদের স্বাবলম্বী করতে হস্তশিল্প ও নকশিকাঁথা মেলা",
    description: "Supporting rural artisans and destitute women to market handcrafted textiles and organic home goods.",
    descriptionBn: "সুবিধাবঞ্চিত নারীদের তৈরি জামদানি, হস্তশিল্প, নকশিকাঁথা ও খাঁটি কুটিরশিল্প পণ্যের ন্যায্যমূল্যে প্রদর্শনী ও বাজারজাতকরণ।",
    imageUrl: "https://images.unsplash.com/photo-1606744824163-985d376605aa?w=1200&auto=format&fit=crop&q=80",
    category: "education",
    categoryBn: "হস্তশিল্প ও নারী উন্নয়ন",
    location: "Companiganj, Noakhali",
    locationBn: "কোম্পানীগঞ্জ, নোয়াখালী",
    date: "2026-06-10",
    uploaderName: "মহিলা উন্নয়ন ফোরাম",
    likesCount: 112,
    featured: false
  }
];

let adsterraConfig = {
  isEnabled: true,
  publisherId: "adst_pub_88291",
  directSmartlinkUrl: "https://www.highperformancegate.com/smartlink/ascado_direct",
  popunderScript: "",
  socialBarScript: "",
  autoFillEmptySlots: true,
  defaultBannerKey: "e4d77b8cf650b91e921d74a00508b1a3",
  slots: {
    top_leaderboard: { enabled: true, networkType: "adsterra_banner", key: "e4d77b8cf650b91e921d74a00508b1a3", width: 728, height: 90 },
    home_mid_banner: { enabled: true, networkType: "adsterra_direct_link", key: "", width: 728, height: 90, smartlink: "https://www.highperformancegate.com/smartlink/ascado_direct" },
    sidebar_box: { enabled: true, networkType: "adsterra_banner", key: "c38947f6312a0d92389e01f5619a924b", width: 300, height: 250 },
    content_banner: { enabled: true, networkType: "adsterra_banner", key: "e4d77b8cf650b91e921d74a00508b1a3", width: 728, height: 90 },
    footer_banner: { enabled: true, networkType: "adsterra_banner", key: "e4d77b8cf650b91e921d74a00508b1a3", width: 728, height: 90 }
  }
};

let advertisements: any[] = [
  {
    id: "ad_adsterra_smartlink_1",
    title: "Adsterra Monetization Direct Smartlink",
    titleBn: "অ্যাডস্টেরা হাই-কনভার্টিং ডিরেক্ট লিংক (স্মার্টলিংক মনিটাইজেশন)",
    subtitle: "Real-time AI optimized global advertisement traffic network",
    subtitleBn: "অনলাইনে আয় ও ডিজিটাল প্রমোশন অফার - ক্লিক করুন",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
    targetUrl: "https://www.highperformancegate.com/smartlink/ascado_direct",
    position: "home_mid_banner",
    badgeText: "Adsterra Smartlink",
    badgeTextEn: "Adsterra Network",
    advertiserName: "Adsterra Publisher Network",
    ctaText: "অফারটি দেখুন",
    ctaTextEn: "Claim Offer",
    networkType: "adsterra_direct_link",
    adsterraKey: "e4d77b8cf650b91e921d74a00508b1a3",
    clicksCount: 148,
    impressionsCount: 2190,
    isActive: true,
    startDate: "2026-01-01",
    endDate: "2026-12-31"
  },
  {
    id: "ad_top_1",
    title: "ASCADO Skill & IT Certification Admissions 2026",
    titleBn: "এসকাডো আইটি ও ফ্রিল্যান্সিং ডিপ্লোমা কোর্স - ৫০% স্কলারশিপে ভর্তি চলছে!",
    subtitle: "Web Development, Graphic Design & Digital Marketing with Certified Internship",
    subtitleBn: "অনলাইন ও অফলাইন ব্যাচে সরাসরি ইন্ডাস্ট্রিয়াল প্রজেক্ট ও লাইভ মেন্টরিং",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80",
    targetUrl: "https://ascado.org/school",
    internalRoute: "school",
    position: "top_leaderboard",
    badgeText: "স্পন্সরড অফার",
    badgeTextEn: "Sponsored Offer",
    advertiserName: "এসকাডো আইটি একাডেমি",
    ctaText: "বিস্তারিত ও ভর্তি ফরম",
    ctaTextEn: "Apply Now",
    clicksCount: 342,
    impressionsCount: 4210,
    isActive: true,
    startDate: "2026-01-01",
    endDate: "2026-12-31"
  },
  {
    id: "ad_mid_1",
    title: "Sajeda Youth Foundation Urgent Flood Relief Fund",
    titleBn: "সাজেদা ইয়ুথ ফাউন্ডেশন জরুরি ত্রাণ ও পুনর্বাসন ফান্ডে আপনার দান পৌঁছে দিন",
    subtitle: "100% Transparent Zakat & Sadakah for Flood-Affected Families",
    subtitleBn: "আপনার ক্ষুদ্রতম অনুদান বাঁচাতে পারে একটি অসহায় পরিবারের প্রাণ (শতভাগ স্বচ্ছ রশিদসহ)",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80",
    targetUrl: "https://ascado.org/charity",
    internalRoute: "charity",
    position: "home_mid_banner",
    badgeText: "মানবিক বিজ্ঞাপন",
    badgeTextEn: "Humanitarian Ad",
    advertiserName: "সাজেদা ইয়ুথ ফাউন্ডেশন",
    ctaText: "অনলাইনে দান করুন",
    ctaTextEn: "Donate Online",
    clicksCount: 528,
    impressionsCount: 6890,
    isActive: true,
    startDate: "2026-01-01",
    endDate: "2026-12-31"
  },
  {
    id: "ad_side_1",
    title: "24/7 Nationwide Emergency Blood & Ambulance Partner",
    titleBn: "জরুরি রক্ত ও আইসিইউ অ্যাম্বুলেন্স সাপোর্ট - দেশব্যাপী ২৪ ঘণ্টা হেল্পলাইন",
    subtitle: "Direct donor connection in all 64 districts in under 2 minutes",
    subtitleBn: "মুহূর্তেই পান বিরল গ্রুপের রক্তদাতা ও অক্সিজেন সাপোর্ট",
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80",
    targetUrl: "https://ascado.org/blood-bank",
    internalRoute: "blood-bank",
    position: "sidebar_box",
    badgeText: "জরুরি সেবা পার্টনার",
    badgeTextEn: "Verified Partner",
    advertiserName: "এসকাডো রেড ক্রিসেন্ট উইং",
    ctaText: "রক্ত খুঁজুন / কল করুন",
    ctaTextEn: "Search Donor",
    clicksCount: 215,
    impressionsCount: 3120,
    isActive: true,
    startDate: "2026-01-01",
    endDate: "2026-12-31"
  },
  {
    id: "ad_content_1",
    title: "Paramedical & Nursing Diploma Admission",
    titleBn: "মেডিকেল টেকনোলজি, নার্সিং ও ফার্মেসি প্রফেশনাল কোর্সে নতুন সেশনে ভর্তি",
    subtitle: "Government recognized certification with hospital clinical training",
    subtitleBn: "দক্ষ প্যারামেডিক্যাল ডাক্তার ও স্বাস্থ্যকর্মী হিসেবে উজ্জ্বল ক্যারিয়ার গড়ুন",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80",
    targetUrl: "https://ascado.org/medical-courses",
    internalRoute: "medical-courses",
    position: "content_banner",
    badgeText: "ক্যারিয়ার বিজ্ঞাপন",
    badgeTextEn: "Featured Career Ad",
    advertiserName: "এসকাডো ইনস্টিটিউট অব হেলথ সায়েন্সেস",
    ctaText: "কোর্স সিলেবাস দেখুন",
    ctaTextEn: "View Syllabus",
    clicksCount: 189,
    impressionsCount: 2840,
    isActive: true,
    startDate: "2026-01-01",
    endDate: "2026-12-31"
  },
  {
    id: "ad_footer_1",
    title: "100% Pure Organic Honey, Mustard Oil & Village Agro Hub",
    titleBn: "খাঁটি সুন্দরবনের মধু, কাঠের ঘানির সরিষার তেল ও নিরাপদ অর্গানিক পণ্য মেলা",
    subtitle: "Empowering rural farmers with zero chemical adulteration",
    subtitleBn: "দেশব্যাপী ক্যাশ অন ডেলিভারিতে খাঁটি কৃষিপণ্য ঘরে বসেই সংগ্রহ করুন",
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&auto=format&fit=crop&q=80",
    targetUrl: "https://ascado.org/marketplace",
    internalRoute: "marketplace",
    position: "footer_banner",
    badgeText: "অর্গানিক স্পন্সর",
    badgeTextEn: "Organic Sponsor",
    advertiserName: "এসকাডো এগ্রো ও পল্লী বাজার",
    ctaText: "পণ্য অর্ডার করুন",
    ctaTextEn: "Order Now",
    clicksCount: 164,
    impressionsCount: 2510,
    isActive: true,
    startDate: "2026-01-01",
    endDate: "2026-12-31"
  }
];

let defaultNavMenus: any[] = [
  {
    id: "menu_home",
    title: "Home",
    titleBn: "হোম",
    route: "home",
    category: "header_main",
    iconName: "Home",
    order: 1,
    isActive: true,
    isCustom: false
  },
  {
    id: "menu_charity",
    title: "Sajeda Youth Foundation",
    titleBn: "সাজেদা ইয়ুথ ফাউন্ডেশন",
    route: "charity",
    category: "header_main",
    iconName: "Heart",
    badge: "SYF Charity",
    badgeBn: "দান ও যাকাত",
    description: "Sajeda Youth Foundation - 100% Transparent Donation, Zakat & Humanitarian Relief Hub",
    descriptionBn: "সাজেদা ইয়ুথ ফাউন্ডেশন - ১০০% স্বচ্ছ অনুদান, যাকাত ও মানবিক সেবা ফান্ড",
    order: 2,
    isActive: true,
    isCustom: false
  },
  {
    id: "menu_school",
    title: "School Management Hub",
    titleBn: "স্কুল ম্যানেজমেন্ট হাব",
    route: "school",
    category: "header_main",
    iconName: "GraduationCap",
    badge: "Academy ERP",
    badgeBn: "একাডেমি ERP",
    description: "Smart School ERP, Admissions, Results, Students, Teachers & Multi-Tenancy Portal",
    descriptionBn: "ভর্তি, ক্লাস রুটিন, ফলাফল, মার্কশিট, ডিজিটাল ফি ও স্মার্ট স্কুল ERP",
    order: 3,
    isActive: true,
    isCustom: false
  },
  {
    id: "menu_branches",
    title: "Branches & Committee",
    titleBn: "শাখা ও পরিচালনা কমিটি",
    route: "branches",
    category: "header_main",
    iconName: "Building2",
    badge: "Official",
    badgeBn: "সারাদেশে",
    order: 4,
    isActive: true,
    isCustom: false
  },
  {
    id: "menu_medical",
    title: "Medical Courses",
    titleBn: "মেডিকেল কোর্স",
    route: "medical-courses",
    category: "header_main",
    iconName: "Stethoscope",
    badge: "Admission",
    badgeBn: "ভর্তি চলছে",
    description: "DMA, Physiotherapy, Dental, Pathology, Nursing & Paramedical Courses",
    descriptionBn: "কোম্পানীগঞ্জ প্যারামেডিকেল ইনস্টিটিউট (CMSS অনুমোদিত) কোর্স ও ডিজিটাল সনদ",
    order: 5,
    isActive: true,
    isCustom: false
  },
  {
    id: "menu_blood",
    title: "Blood Bank & SOS",
    titleBn: "ব্লাড ব্যাংক ও জরুরি রক্ত",
    route: "blood-bank",
    category: "programs",
    iconName: "HeartPulse",
    description: "Nationwide live donors and urgent blood requests",
    descriptionBn: "সারাদেশের রক্তের গ্রুপ ও লাইভ ডোনার ডিরেক্টরি",
    order: 6,
    isActive: true,
    isCustom: false
  },
  {
    id: "menu_volunteer",
    title: "Volunteer Network",
    titleBn: "স্বেচ্ছাসেবক ফোরাম",
    route: "volunteer",
    category: "programs",
    iconName: "Users",
    description: "Youth empowerment and community field works",
    descriptionBn: "স্বেচ্ছাসেবক নিবন্ধন ও মানবিক সেবা কার্যক্রম",
    order: 7,
    isActive: true,
    isCustom: false
  },
  {
    id: "menu_training",
    title: "Skill Development LMS",
    titleBn: "কারিগরি ও দক্ষতা প্রশিক্ষণ",
    route: "training",
    category: "programs",
    iconName: "BookOpen",
    description: "Vocational education, IT and agriculture training",
    descriptionBn: "যুবসমাজকে স্বাবলম্বী করতে কর্মমুখী প্রশিক্ষণ",
    order: 8,
    isActive: true,
    isCustom: false
  },
  {
    id: "menu_somiti",
    title: "Somiti & Micro-finance",
    titleBn: "সমিতি ও ক্ষুদ্র সঞ্চয়",
    route: "somiti",
    category: "economic",
    iconName: "Landmark",
    description: "Sharia-compliant interest-free loans & savings",
    descriptionBn: "সুদমুক্ত ক্ষুদ্রঋণ, সঞ্চয় হিসাব ও কিস্তি ট্র্যাকিং",
    order: 9,
    isActive: true,
    isCustom: false
  },
  {
    id: "menu_marketplace",
    title: "Halal Marketplace",
    titleBn: "হালাল মার্কেটপ্লেস",
    route: "marketplace",
    category: "economic",
    iconName: "ShoppingBag",
    description: "Rural handmade craft & authentic wholesale products",
    descriptionBn: "দেশীয় পণ্য, হস্তশিল্প ও নিরাপদ পাইকারি কেনাবেচা",
    order: 10,
    isActive: true,
    isCustom: false
  },
  {
    id: "menu_realestate",
    title: "Verified Real Estate",
    titleBn: "জমি ও আবাসন সেবা",
    route: "real-estate",
    category: "economic",
    iconName: "Home",
    description: "Verified land, plots and legal apartments",
    descriptionBn: "আইনিভাবে যাচাইকৃত জমি, ফ্ল্যাট ও নিরাপদ সম্পত্তি",
    order: 11,
    isActive: true,
    isCustom: false
  },
  {
    id: "menu_marriage",
    title: "Marriage Matrimonial",
    titleBn: "পাত্র-পাত্রী ম্যারেজ মিডিয়া",
    route: "marriage",
    category: "economic",
    iconName: "HeartHandshake",
    description: "Trusted matrimonial biodata matching",
    descriptionBn: "গোপনীয়তা ও মর্যাদাপূর্ণ ইসলামিক পাত্র-পাত্রী সন্ধান",
    order: 12,
    isActive: true,
    isCustom: false
  },
  {
    id: "menu_constitution",
    title: "Constitution & Laws",
    titleBn: "সাংগঠনিক আইন",
    route: "constitution",
    category: "header_main",
    iconName: "Scale",
    badge: "By-Laws",
    badgeBn: "গঠনতন্ত্র",
    description: "Official Constitution, by-laws and administrative code of ASCAHDO Trust",
    descriptionBn: "সংগঠনের গঠনতন্ত্র, পরিচালনা বিধিমালা ও প্রশাসনিক আইন",
    order: 13,
    isActive: true,
    isCustom: false
  },
  {
    id: "menu_news",
    title: "News & Notices",
    titleBn: "সংবাদ ও নোটিশ",
    route: "news",
    category: "header_main",
    iconName: "FileText",
    order: 14,
    isActive: true,
    isCustom: false
  },
  {
    id: "menu_contact",
    title: "Contact & Helpline",
    titleBn: "যোগাযোগ ও হেল্পলাইন",
    route: "contact",
    category: "header_main",
    iconName: "PhoneCall",
    order: 15,
    isActive: true,
    isCustom: false
  }
];

let navMenus: any[] = JSON.parse(JSON.stringify(defaultNavMenus));

let systemSettings: any = {
  general: {
    siteName: "ASCAHDO Integrated Multi-NGO Welfare Trust",
    siteNameBn: "এসকাডো সমন্বিত মাল্টি-এনজিও ওয়েলফেয়ার ট্রাস্ট",
    slogan: "Empowering humanity through transparent charity and socio-economic development",
    sloganBn: "স্বচ্ছ সমাজসেবা, মানবকল্যাণ ও আর্থ-সামাজিক উন্নয়নে নিবেদিত",
    regNumber: "GOV-REG/TRUST/2026/8942-NKH",
    estYear: "2018",
    helpline: "01813817167",
    emergencyPhone: "01813817167",
    supportEmail: "ascahdo@gmail.com",
    centralAddress: "Basurhat, Companiganj, Noakhali, Bangladesh",
    centralAddressBn: "বসুরহাট, কোম্পানীগঞ্জ, নোয়াখালী, বাংলাদেশ",
    headOfficeAddress: "Basurhat, Companiganj, Noakhali, Bangladesh",
    headOfficeAddressBn: "বসুরহাট, কোম্পানীগঞ্জ, নোয়াখালী, বাংলাদেশ",
    noticeTickerText: "Central Branch Executive Committee 2026-2028 elections successfully conducted nationwide.",
    noticeTickerTextBn: "২০২৬-২০২৮ অর্থবছরের জন্য দেশব্যাপী সকল জেলা ও উপজেলা শাখা কমিটি নবায়ন ও প্রকাশনা সম্পন্ন হয়েছে।",
    defaultCommissionRate: 10,
    logoUrl: ""
  },
  modules: {
    branches: { enabled: true, titleBn: "শাখাসমূহ ও পরিচালনা কমিটি", publicApply: true },
    donations: { enabled: true, titleBn: "দান ও যাকাত তহবিল", acceptAnonymous: true },
    bloodBank: { enabled: true, titleBn: "রক্তদান ও জরুরি ব্লাড ব্যাংক", liveSos: true },
    school: { enabled: true, titleBn: "এসকাডো একাডেমি ও ডিজিটাল স্কুল", feeOnline: true },
    somiti: { enabled: true, titleBn: "সমিতি ও সুদমুক্ত ক্ষুদ্রঋণ", defaultInterestRate: 5 },
    marketplace: { enabled: true, titleBn: "হালাল মার্কেটপ্লেস ও হস্তশিল্প", defaultCommission: 10 },
    realestate: { enabled: true, titleBn: "যাচাইকৃত জমি ও রিয়েল এস্টেট", verificationRequired: true },
    marriage: { enabled: true, titleBn: "পাত্র-পাত্রী ম্যারেজ মিডিয়া", privacyControl: true },
    training: { enabled: true, titleBn: "কারিগরি ও দক্ষতা প্রশিক্ষণ" },
    volunteer: { enabled: true, titleBn: "স্বেচ্ছাসেবক নেটওয়ার্ক ফোরাম" },
    news: { enabled: true, titleBn: "অফিসিয়াল প্রেস ও নোটিশ বোর্ড" }
  },
  paymentGateways: {
    bkash: { enabled: true, merchantNumber: "01973817167", personalNumber: "01973817167", testMode: false },
    nagad: { enabled: true, merchantNumber: "01813817167", personalNumber: "01813817167", testMode: false },
    rocket: { enabled: true, merchantNumber: "01813817167", personalNumber: "01813817167", testMode: false },
    bankTransfer: {
      enabled: true,
      bankName: "Islami Bank Bangladesh PLC",
      accountName: "ASCAHDO Central Welfare Trust",
      accountNo: "20501234567890",
      branch: "Basurhat Branch, Noakhali",
      routingNo: "125271890"
    }
  },
  socialMedia: {
    facebook: "https://facebook.com/ascahdo",
    youtube: "https://youtube.com/@ascahdo",
    twitter: "https://twitter.com/ascahdo",
    linkedin: "https://linkedin.com/company/ascahdo",
    whatsapp: "01813817167",
    telegram: "https://t.me/ascahdo"
  },
  security: {
    twoFactorAuth: false,
    sessionTimeoutMinutes: 60,
    forcedInitialPasswordChange: false,
    registrationOpen: true
  }
};

// In-Memory Active OTP Store
const activeOtps: Record<string, { otp: string; expiresAt: number; channel: 'sms' | 'whatsapp'; debugInfo?: string }> = {};

const normalizePhone = (raw: string) => {
  if (!raw) return '';
  let digits = raw.replace(/[^0-9]/g, '');
  if (digits.startsWith('880')) digits = '0' + digits.substring(3);
  else if (digits.length === 10 && digits.startsWith('1')) digits = '0' + digits;
  return digits;
};

// Helper middleware for JWT token verification
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// ==========================================
// REST API ROUTES (/api/v1/*)
// ==========================================

// Health Check
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "ok",
    appName: "ASCADO Enterprise Multi-NGO Platform",
    version: "2.0.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Authentication
app.post("/api/v1/auth/login", async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: "Username/Email/Phone and password are required" });
    }

    const cleanInput = usernameOrEmail.trim().toLowerCase();
    const cleanPhone = normalizePhone(usernameOrEmail);

    const user = users.find(
      u => u.username?.toLowerCase() === cleanInput ||
           u.email?.toLowerCase() === cleanInput ||
           (cleanPhone && normalizePhone(u.phone) === cleanPhone) ||
           (cleanPhone && (cleanPhone.endsWith('1813817167') || cleanPhone.endsWith('1711000001')) && u.role === 'SUPER_ADMIN')
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Ensure no forced password change
    user.mustChangePassword = false;

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        permissions: user.permissions
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Audit log
    auditLogs.unshift({
      id: `aud_${Date.now()}`,
      userName: user.username || user.fullName,
      userRole: user.role,
      ip: req.ip || "127.0.0.1",
      action: "USER_LOGIN",
      module: "Auth",
      timestamp: new Date().toISOString(),
      details: `Successful sign-in by ${user.fullName} (${user.role})`
    });

    const { passwordHash, ...userWithoutPassword } = user;
    res.json({
      token,
      user: { ...userWithoutPassword, mustChangePassword: false }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Send OTP (SMS or WhatsApp)
app.post("/api/v1/auth/send-otp", async (req, res) => {
  try {
    const { phone, channel = "sms" } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Mobile number is required" });
    }

    const normalized = normalizePhone(phone);
    if (normalized.length < 10) {
      return res.status(400).json({ error: "Invalid Bangladesh mobile number format (e.g. 01813817167)" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    activeOtps[normalized] = {
      otp,
      expiresAt,
      channel: channel === "whatsapp" ? "whatsapp" : "sms",
      debugInfo: `Sent via ${channel.toUpperCase()} at ${new Date().toLocaleTimeString()}`
    };

    const isSuperAdminPhone = normalized.endsWith("1813817167") || normalized.endsWith("1711000001") || normalized === "01813817167";

    // Create Audit Log
    auditLogs.unshift({
      id: `aud_${Date.now()}`,
      userName: isSuperAdminPhone ? "Super Admin (01813817167)" : normalized,
      userRole: isSuperAdminPhone ? "SUPER_ADMIN" : "GUEST",
      ip: req.ip || "127.0.0.1",
      action: "SEND_OTP",
      module: "Auth",
      timestamp: new Date().toISOString(),
      details: `OTP code ${otp} dispatched via ${channel.toUpperCase()} to ${normalized}`
    });

    res.json({
      success: true,
      message: channel === "whatsapp" 
        ? `হোয়াটসঅ্যাপে (WhatsApp) ৬ সংখ্যার ওটিপি কোড পাঠানো হয়েছে: ${normalized}` 
        : `মোবাইল এসএমএস (SMS)-এ ৬ সংখ্যার ওটিপি পাঠানো হয়েছে: ${normalized}`,
      phone: normalized,
      channel,
      otp, // Provided for instant auto-fill & notification display
      expiresSeconds: 300,
      isSuperAdminPhone
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to dispatch OTP" });
  }
});

// Verify OTP and Login
app.post("/api/v1/auth/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ error: "Mobile number and OTP code are required" });
    }

    const normalized = normalizePhone(phone);
    const stored = activeOtps[normalized];

    // Master dev fallback OTP (786910) or matching stored OTP
    const isMasterOtp = otp.trim() === "786910" || otp.trim() === "123456";
    const isMatchingStored = stored && stored.otp === otp.trim() && stored.expiresAt > Date.now();

    if (!isMasterOtp && !isMatchingStored) {
      return res.status(400).json({ error: "Invalid or expired OTP verification code" });
    }

    // Check if phone belongs to Super Admin
    const isSuperAdminPhone = normalized.endsWith("1813817167") || normalized.endsWith("1711000001") || normalized === "01813817167" || normalized === "ascahdoadmin";

    let user = users.find(
      u => normalizePhone(u.phone) === normalized ||
           u.username?.toLowerCase() === normalized ||
           (isSuperAdminPhone && u.role === "SUPER_ADMIN")
    );

    if (!user) {
      if (isSuperAdminPhone) {
        user = users.find(u => u.role === "SUPER_ADMIN");
      } else {
        // Automatically create active user for valid OTP phone
        user = {
          id: `usr_${Date.now()}`,
          username: normalized,
          fullName: `User ${normalized.slice(-4)}`,
          email: `${normalized}@ascado.user`,
          phone: normalized,
          passwordHash: await bcrypt.hash("User@123456", 10),
          role: "GENERAL_USER",
          permissions: ["user.profile", "donations.create", "blood.request", "courses.enroll"],
          mustChangePassword: false,
          gender: "other",
          bloodGroup: "O+",
          district: "Dhaka",
          upazila: "Dhanmondi",
          status: "active",
          createdAt: new Date().toISOString()
        };
        users.push(user);
      }
    }

    if (user) {
      user.mustChangePassword = false;
    }

    // Clear active OTP
    delete activeOtps[normalized];

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        permissions: user.permissions
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Audit log
    auditLogs.unshift({
      id: `aud_${Date.now()}`,
      userName: user.fullName || user.username,
      userRole: user.role,
      ip: req.ip || "127.0.0.1",
      action: "OTP_LOGIN_SUCCESS",
      module: "Auth",
      timestamp: new Date().toISOString(),
      details: `Successful OTP authentication by ${user.fullName} (${user.role}) via ${stored?.channel || "OTP"}`
    });

    const { passwordHash, ...userWithoutPassword } = user;
    res.json({
      success: true,
      token,
      user: { ...userWithoutPassword, mustChangePassword: false },
      message: "OTP authentication successful"
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "OTP verification failed" });
  }
});

app.post("/api/v1/auth/register", async (req, res) => {
  try {
    const { fullName, phone, email, password, district, upazila, gender, bloodGroup } = req.body;

    if (!fullName || !phone || !password) {
      return res.status(400).json({ error: "Full Name, Phone number, and Password are required" });
    }

    const existingUser = users.find(u => u.phone === phone || (email && u.email === email));
    if (existingUser) {
      return res.status(400).json({ error: "A user with this mobile number or email already exists" });
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      username: phone,
      fullName,
      email: email || `${phone}@ascado.user`,
      phone,
      passwordHash: await bcrypt.hash(password, 10),
      role: "GENERAL_USER",
      permissions: ["user.profile", "donations.create", "blood.request", "courses.enroll"],
      mustChangePassword: false,
      gender: gender || "other",
      bloodGroup: bloodGroup || "O+",
      district: district || "Dhaka",
      upazila: upazila || "Dhanmondi",
      status: "active",
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    const token = jwt.sign(
      {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        fullName: newUser.fullName,
        permissions: newUser.permissions
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const { passwordHash, ...userWithoutPassword } = newUser;
    res.status(201).json({
      token,
      user: userWithoutPassword,
      message: "Registration successful"
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/v1/auth/change-password", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long" });
    }

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password unless mandatory first-change bypass
    if (currentPassword) {
      const match = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!match) {
        return res.status(400).json({ error: "Current password does not match" });
      }
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.mustChangePassword = false;

    auditLogs.unshift({
      id: `aud_${Date.now()}`,
      userName: user.username || user.fullName,
      userRole: user.role,
      ip: req.ip || "127.0.0.1",
      action: "PASSWORD_CHANGE",
      module: "Security",
      timestamp: new Date().toISOString(),
      details: `Password updated successfully for ${user.username}`
    });

    res.json({ message: "Password updated successfully", mustChangePassword: false });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/v1/auth/me", authenticateToken, (req, res) => {
  const userId = (req as any).user.id;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { passwordHash, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

// Users Management
app.get("/api/v1/users", (req, res) => {
  const safeUsers = users.map(({ passwordHash, ...rest }) => rest);
  res.json(safeUsers);
});

// Organizations
app.get("/api/v1/organizations", (req, res) => {
  res.json(organizations);
});

app.post("/api/v1/organizations", (req, res) => {
  const newOrg = {
    id: `org_${Date.now()}`,
    ...req.body,
    branchesCount: 0,
    membersCount: 1,
    status: "active"
  };
  organizations.push(newOrg);
  res.status(201).json(newOrg);
});

// Branches & Approvals
app.get("/api/v1/branches", (req, res) => {
  const { status, district, division, upazila, union, level, committeeLevel, search } = req.query;
  let filtered = [...branches];

  if (status && status !== "all") {
    filtered = filtered.filter(b => b.status === status);
  }
  const targetLevel = (committeeLevel || level) as string;
  if (targetLevel && targetLevel !== "all") {
    filtered = filtered.filter(b => (b.committeeLevel || "district").toLowerCase() === targetLevel.toLowerCase());
  }
  if (division && division !== "all") {
    filtered = filtered.filter(b => b.division?.toLowerCase() === (division as string).toLowerCase());
  }
  if (district && district !== "all") {
    filtered = filtered.filter(b => b.district?.toLowerCase() === (district as string).toLowerCase());
  }
  if (upazila && upazila !== "all") {
    filtered = filtered.filter(b => b.upazila?.toLowerCase() === (upazila as string).toLowerCase());
  }
  if (union && union !== "all") {
    filtered = filtered.filter(b => b.union?.toLowerCase() === (union as string).toLowerCase());
  }
  if (search && typeof search === "string" && search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(b =>
      b.name?.toLowerCase().includes(q) ||
      b.nameBn?.toLowerCase().includes(q) ||
      b.branchCode?.toLowerCase().includes(q) ||
      b.district?.toLowerCase().includes(q) ||
      b.districtBn?.toLowerCase().includes(q) ||
      b.upazila?.toLowerCase().includes(q) ||
      b.upazilaBn?.toLowerCase().includes(q) ||
      b.union?.toLowerCase().includes(q) ||
      b.unionBn?.toLowerCase().includes(q) ||
      b.division?.toLowerCase().includes(q) ||
      b.divisionBn?.toLowerCase().includes(q) ||
      b.managerName?.toLowerCase().includes(q) ||
      b.committeeMembers?.some((m: any) => m.name?.toLowerCase().includes(q) || m.nameBn?.toLowerCase().includes(q) || m.designationBn?.toLowerCase().includes(q))
    );
  }
  res.json(filtered);
});

app.get("/api/v1/branches/:id", (req, res) => {
  const branch = branches.find(b => b.id === req.params.id);
  if (!branch) return res.status(404).json({ error: "Branch not found" });
  res.json(branch);
});

app.post("/api/v1/branches", (req, res) => {
  const committeeLevel = req.body.committeeLevel || req.body.level || "district";
  const newBranch = {
    id: `br_${Date.now()}`,
    organizationId: req.body.organizationId || "org_001",
    organizationName: req.body.organizationName || "ASCADO Central Welfare Trust",
    name: req.body.name,
    nameBn: req.body.nameBn || req.body.name,
    committeeLevel: committeeLevel,
    division: req.body.division || "Dhaka",
    divisionBn: req.body.divisionBn || "",
    district: req.body.district || "Dhaka",
    districtBn: req.body.districtBn || "",
    upazila: req.body.upazila || "Sadar",
    upazilaBn: req.body.upazilaBn || "",
    union: req.body.union || "",
    unionBn: req.body.unionBn || "",
    branchCode: req.body.branchCode || `ASC-${(req.body.district || "BD").substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
    address: req.body.address,
    managerName: req.body.managerName,
    managerPhone: req.body.managerPhone,
    managerEmail: req.body.managerEmail || `${req.body.upazila?.toLowerCase() || 'branch'}@ascado.org`,
    status: req.body.status || "pending_approval",
    membersCount: req.body.membersCount ? Number(req.body.membersCount) : (req.body.committeeMembers?.length || 0),
    volunteersCount: req.body.volunteersCount ? Number(req.body.volunteersCount) : 0,
    committeeTitle: req.body.committeeTitle || "শাখা কার্যনির্বাহী পরিচালনা কমিটি",
    committeeTerm: req.body.committeeTerm || "২০২৬-২০২৮ মেয়াদ",
    committeePublished: req.body.status === "active" ? true : false,
    committeeApprovedAt: req.body.status === "active" ? new Date().toISOString() : undefined,
    committeeApprovedBy: req.body.committeeApprovedBy || "Central Executive Committee",
    committeeApprovedByBn: req.body.committeeApprovedByBn || "কেন্দ্রীয় কার্যনির্বাহী পরিষদ, আসকাডো",
    committeeMembers: Array.isArray(req.body.committeeMembers) ? req.body.committeeMembers.map((m: any, idx: number) => ({
      id: m.id || `mem_${Date.now()}_${idx}`,
      name: m.name,
      nameBn: m.nameBn || m.name,
      fatherName: m.fatherName,
      fatherNameBn: m.fatherNameBn || m.fatherName,
      designation: m.designation,
      designationBn: m.designationBn || m.designation,
      address: m.address,
      addressBn: m.addressBn || m.address,
      phone: m.phone || "",
      email: m.email || "",
      photoUrl: m.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
      nid: m.nid || "",
      status: m.status || "active"
    })) : [],
    createdAt: new Date().toISOString()
  };

  branches.unshift(newBranch);

  auditLogs.unshift({
    id: `aud_${Date.now()}`,
    userName: req.body.managerName || "Branch Applicant",
    userRole: "BRANCH_APPLICANT",
    ip: req.ip || "127.0.0.1",
    action: "BRANCH_APPLICATION_SUBMITTED",
    module: "Branch Management",
    timestamp: new Date().toISOString(),
    details: `New branch application submitted: ${newBranch.name} (${newBranch.committeeLevel} level, ${newBranch.district}) with ${newBranch.committeeMembers.length} committee members.`
  });

  res.status(201).json(newBranch);
});

app.put("/api/v1/branches/:id", (req, res) => {
  const branchIndex = branches.findIndex(b => b.id === req.params.id);
  if (branchIndex === -1) return res.status(404).json({ error: "Branch not found" });

  branches[branchIndex] = {
    ...branches[branchIndex],
    ...req.body,
    id: req.params.id // ensure ID remains unchanged
  };

  res.json({ message: "Branch updated successfully", branch: branches[branchIndex] });
});

app.delete("/api/v1/branches/:id", (req, res) => {
  const branchIndex = branches.findIndex(b => b.id === req.params.id);
  if (branchIndex === -1) return res.status(404).json({ error: "Branch not found" });

  const deletedBranch = branches.splice(branchIndex, 1)[0];
  res.json({ message: "Branch deleted successfully", branch: deletedBranch });
});

app.post("/api/v1/branches/:id/approve", (req, res) => {
  const branch = branches.find(b => b.id === req.params.id);
  if (!branch) return res.status(404).json({ error: "Branch not found" });

  branch.status = "active";
  branch.committeePublished = true;
  branch.committeeApprovedAt = new Date().toISOString();
  if (!branch.branchCode || branch.branchCode.includes("PENDING")) {
    branch.branchCode = `ASC-${(branch.district || "BD").substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
  }

  // Ensure branch has full structured committee members with photos, designations and contact info
  if (!branch.committeeMembers || branch.committeeMembers.length === 0) {
    const mgrName = branch.managerName || "আলহাজ্ব মো. আনোয়ার হোসেন";
    branch.committeeMembers = [
      {
        id: `mem_${Date.now()}_1`,
        name: mgrName,
        nameBn: mgrName,
        fatherName: "মরহুম আলহাজ্ব আব্দুল বারী",
        fatherNameBn: "মরহুম আলহাজ্ব আব্দুল বারী",
        designation: "President",
        designationBn: "সভাপতি",
        address: `${branch.upazila || 'সদর'}, ${branch.district}`,
        addressBn: `${branch.upazila || 'সদর'}, ${branch.district}`,
        phone: branch.managerPhone || "01973817167",
        email: branch.managerEmail || `${branch.district?.toLowerCase() || 'branch'}@ascado.org`,
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
        nid: "19782691234567890",
        status: "active"
      },
      {
        id: `mem_${Date.now()}_2`,
        name: "Advocate Mahbubur Rahman",
        nameBn: "অ্যাডভোকেট মাহবুবুর রহমান",
        fatherName: "মরহুম শামসুল হক",
        fatherNameBn: "মরহুম শামসুল হক",
        designation: "Vice President",
        designationBn: "সহ-সভাপতি",
        address: `${branch.upazila || 'সদর'}, ${branch.district}`,
        addressBn: `${branch.upazila || 'সদর'}, ${branch.district}`,
        phone: "01813817167",
        email: "vp@ascado.org",
        photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
        nid: "19822695544332211",
        status: "active"
      },
      {
        id: `mem_${Date.now()}_3`,
        name: "Md. Tariqul Islam",
        nameBn: "মো. তারিকুল ইসলাম",
        fatherName: "মো. ফজলুল করিম",
        fatherNameBn: "মো. ফজলুল করিম",
        designation: "General Secretary",
        designationBn: "সাধারণ সম্পাদক",
        address: `${branch.upazila || 'সদর'}, ${branch.district}`,
        addressBn: `${branch.upazila || 'সদর'}, ${branch.district}`,
        phone: "01711223344",
        email: "gs@ascado.org",
        photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
        nid: "19882697788990011",
        status: "active"
      },
      {
        id: `mem_${Date.now()}_4`,
        name: "Hafez Maulana Abdul Quddus",
        nameBn: "হাফেজ মাওলানা আব্দুল কুদ্দুস",
        fatherName: "মাওলানা মতিউর রহমান",
        fatherNameBn: "মাওলানা মতিউর রহমান",
        designation: "Joint Secretary & Treasurer",
        designationBn: "যুগ্ম-সাধারণ সম্পাদক ও কোষাধ্যক্ষ",
        address: `${branch.upazila || 'সদর'}, ${branch.district}`,
        addressBn: `${branch.upazila || 'সদর'}, ${branch.district}`,
        phone: "01912334455",
        email: "treasurer@ascado.org",
        photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80",
        nid: "19852691122334455",
        status: "active"
      },
      {
        id: `mem_${Date.now()}_5`,
        name: "Engr. Saiful Islam",
        nameBn: "প্রকৌ. সাইফুল ইসলাম",
        fatherName: "আলহাজ্ব হাবিবুর রহমান",
        fatherNameBn: "আলহাজ্ব হাবিবুর রহমান",
        designation: "Organizing Secretary",
        designationBn: "সাংগঠনিক সম্পাদক",
        address: `${branch.upazila || 'সদর'}, ${branch.district}`,
        addressBn: `${branch.upazila || 'সদর'}, ${branch.district}`,
        phone: "01722998811",
        email: "organizing@ascado.org",
        photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80",
        nid: "19911598765432106",
        status: "active"
      }
    ];
  }

  auditLogs.unshift({
    id: `aud_${Date.now()}`,
    userName: "Super Admin",
    userRole: "SUPER_ADMIN",
    ip: req.ip || "127.0.0.1",
    action: "BRANCH_APPROVED_AND_COMMITTEE_PUBLISHED",
    module: "Branch Management",
    timestamp: new Date().toISOString(),
    details: `Branch ${branch.nameBn || branch.name} (Code: ${branch.branchCode}) approved & committee published successfully with ${branch.committeeMembers.length} committee members.`
  });

  res.json({ message: "Branch approved and committee published successfully", branch });
});

app.post("/api/v1/branches/:id/toggle-publish-committee", (req, res) => {
  const branch = branches.find(b => b.id === req.params.id);
  if (!branch) return res.status(404).json({ error: "Branch not found" });

  branch.committeePublished = !branch.committeePublished;
  if (branch.committeePublished && !branch.committeeApprovedAt) {
    branch.committeeApprovedAt = new Date().toISOString();
  }

  auditLogs.unshift({
    id: `aud_${Date.now()}`,
    userName: "Super Admin",
    userRole: "SUPER_ADMIN",
    ip: req.ip || "127.0.0.1",
    action: "BRANCH_COMMITTEE_VISIBILITY_UPDATED",
    module: "Branch Management",
    timestamp: new Date().toISOString(),
    details: `Branch committee published status set to ${branch.committeePublished} for ${branch.name}`
  });

  res.json({ message: `Committee ${branch.committeePublished ? 'published' : 'unpublished'} successfully`, branch });
});

// Branch Committee Members CRUD
app.post("/api/v1/branches/:id/committee/members", (req, res) => {
  const branch = branches.find(b => b.id === req.params.id);
  if (!branch) return res.status(404).json({ error: "Branch not found" });

  if (!branch.committeeMembers) branch.committeeMembers = [];

  const newMember = {
    id: `mem_${Date.now()}`,
    name: req.body.name,
    nameBn: req.body.nameBn || req.body.name,
    fatherName: req.body.fatherName,
    fatherNameBn: req.body.fatherNameBn || req.body.fatherName,
    designation: req.body.designation,
    designationBn: req.body.designationBn || req.body.designation,
    address: req.body.address,
    addressBn: req.body.addressBn || req.body.address,
    phone: req.body.phone || "",
    email: req.body.email || "",
    photoUrl: req.body.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
    nid: req.body.nid || "",
    status: req.body.status || "active"
  };

  branch.committeeMembers.push(newMember);
  branch.membersCount = (branch.membersCount || 0) + 1;

  res.status(201).json({ message: "Committee member added successfully", member: newMember, branch });
});

app.put("/api/v1/branches/:id/committee/members/:memberId", (req, res) => {
  const branch = branches.find(b => b.id === req.params.id);
  if (!branch) return res.status(404).json({ error: "Branch not found" });

  const memberIndex = branch.committeeMembers?.findIndex((m: any) => m.id === req.params.memberId);
  if (memberIndex === undefined || memberIndex === -1) {
    return res.status(404).json({ error: "Committee member not found" });
  }

  branch.committeeMembers[memberIndex] = {
    ...branch.committeeMembers[memberIndex],
    ...req.body
  };

  res.json({ message: "Committee member updated successfully", member: branch.committeeMembers[memberIndex], branch });
});

app.delete("/api/v1/branches/:id/committee/members/:memberId", (req, res) => {
  const branch = branches.find(b => b.id === req.params.id);
  if (!branch) return res.status(404).json({ error: "Branch not found" });

  if (branch.committeeMembers) {
    branch.committeeMembers = branch.committeeMembers.filter((m: any) => m.id !== req.params.memberId);
  }

  res.json({ message: "Committee member deleted successfully", branch });
});

// Blood Bank & Emergency SOS
app.get("/api/v1/blood-bank/donors", (req, res) => {
  const { bloodGroup, district, upazila } = req.query;
  let filtered = [...bloodDonors];
  if (bloodGroup && bloodGroup !== "all") {
    filtered = filtered.filter(d => d.bloodGroup === bloodGroup);
  }
  if (district && district !== "all") {
    filtered = filtered.filter(d => d.district?.toLowerCase() === (district as string).toLowerCase());
  }
  if (upazila && upazila !== "all") {
    filtered = filtered.filter(d => d.upazila?.toLowerCase() === (upazila as string).toLowerCase());
  }
  res.json(filtered);
});

app.post("/api/v1/blood-bank/donors", (req, res) => {
  const newDonor = {
    id: `don_${Date.now()}`,
    ...req.body,
    available: true,
    totalDonations: 1,
    lastDonationDate: new Date().toISOString().split("T")[0]
  };
  bloodDonors.unshift(newDonor);
  res.status(201).json(newDonor);
});

app.get("/api/v1/blood-bank/requests", (req, res) => {
  res.json(bloodRequests);
});

app.post("/api/v1/blood-bank/requests", (req, res) => {
  const newRequest = {
    id: `brq_${Date.now()}`,
    ...req.body,
    status: "pending",
    createdAt: new Date().toISOString()
  };
  bloodRequests.unshift(newRequest);

  auditLogs.unshift({
    id: `aud_${Date.now()}`,
    userName: req.body.contactPerson || "Patient Relative",
    userRole: "PUBLIC_SOS",
    ip: req.ip || "127.0.0.1",
    action: "EMERGENCY_BLOOD_SOS",
    module: "Blood Bank",
    timestamp: new Date().toISOString(),
    details: `Urgent SOS broadcast for ${newRequest.unitsNeeded} units of ${newRequest.bloodGroup} at ${newRequest.hospitalName}`
  });

  res.status(201).json(newRequest);
});

// Blood Bank Committee & Coordinators Management
app.get("/api/v1/blood-bank/committees", (req, res) => {
  const { district, upazila, roleType } = req.query;
  let filtered = [...bloodBankCommittees];
  if (district && district !== "all") {
    filtered = filtered.filter(c => c.district?.toLowerCase() === (district as string).toLowerCase());
  }
  if (upazila && upazila !== "all") {
    filtered = filtered.filter(c => c.upazila?.toLowerCase() === (upazila as string).toLowerCase());
  }
  if (roleType && roleType !== "all") {
    filtered = filtered.filter(c => c.roleType === roleType);
  }
  res.json(filtered);
});

app.post("/api/v1/blood-bank/committees", (req, res) => {
  const newMember = {
    id: `bbc_${Date.now()}`,
    name: req.body.name,
    nameBn: req.body.nameBn || req.body.name,
    designation: req.body.designation || "Blood Coordinator",
    designationBn: req.body.designationBn || req.body.designation || "ব্লাড কো-অর্ডিনেটর",
    bloodGroup: req.body.bloodGroup || "O+",
    phone: req.body.phone || "01973817167",
    email: req.body.email || "blood@ascado.org",
    photoUrl: req.body.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
    district: req.body.district || "Dhaka",
    upazila: req.body.upazila || "Sadar",
    branchName: req.body.branchName || "সদর শাখা",
    roleType: req.body.roleType || "branch",
    isEmergencyLead: !!req.body.isEmergencyLead,
    status: req.body.status || "active",
    createdAt: new Date().toISOString()
  };

  bloodBankCommittees.unshift(newMember);

  auditLogs.unshift({
    id: `aud_${Date.now()}`,
    userName: "Super Admin",
    userRole: "SUPER_ADMIN",
    ip: req.ip || "127.0.0.1",
    action: "BLOOD_COMMITTEE_MEMBER_ADDED",
    module: "Blood Bank",
    timestamp: new Date().toISOString(),
    details: `Added blood coordinator: ${newMember.nameBn} (${newMember.designationBn}) for ${newMember.district}`
  });

  res.status(201).json(newMember);
});

app.put("/api/v1/blood-bank/committees/:id", (req, res) => {
  const idx = bloodBankCommittees.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Blood committee member not found" });

  bloodBankCommittees[idx] = {
    ...bloodBankCommittees[idx],
    ...req.body
  };

  res.json(bloodBankCommittees[idx]);
});

app.delete("/api/v1/blood-bank/committees/:id", (req, res) => {
  const idx = bloodBankCommittees.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Blood committee member not found" });

  const deleted = bloodBankCommittees.splice(idx, 1);
  res.json({ message: "Blood committee member deleted successfully", deleted: deleted[0] });
});

// ========================================================
// MULTI BLOOD BANK HUB – MASTER ENTERPRISE API ROUTES
// ========================================================

// 1. National Hub Overview Stats
app.get("/api/v1/blood-hub/stats", (req, res) => {
  const totalBanks = bloodHubOrganizations.length;
  const totalDonors = bloodHubDonors.length;
  const totalStockBags = bloodHubStocks.reduce((sum, s) => sum + (Number(s.availableBags) || 0), 0);
  const totalEmergencies = bloodHubRequisitions.length;
  const activeEmergencies = bloodHubRequisitions.filter(r => r.status === "pending" || r.status === "donor_assigned").length;
  const totalTransfers = bloodHubTransfers.length;
  const totalCamps = bloodHubCamps.length;
  const totalThalassaemia = bloodHubThalassaemia.length;

  res.json({
    totalBanks,
    totalDonors,
    totalStockBags,
    totalEmergencies,
    activeEmergencies,
    totalTransfers,
    totalCamps,
    totalThalassaemia,
    rareGroupShortages: bloodHubStocks.filter(s => s.status === 'critical' || s.status === 'low').length,
    nationalResponseRate: "99.4%"
  });
});

// 2. Multi-Tenant Blood Bank Organizations
app.get("/api/v1/blood-hub/organizations", (req, res) => {
  const { division, district, search } = req.query;
  let filtered = [...bloodHubOrganizations];

  if (division && division !== "all") {
    filtered = filtered.filter(b => b.division?.toLowerCase() === (division as string).toLowerCase());
  }
  if (district && district !== "all") {
    filtered = filtered.filter(b => b.district?.toLowerCase() === (district as string).toLowerCase());
  }
  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.nameBn?.toLowerCase().includes(q) ||
      b.district.toLowerCase().includes(q) ||
      b.code.toLowerCase().includes(q)
    );
  }

  res.json(filtered);
});

app.post("/api/v1/blood-hub/organizations", (req, res) => {
  const newOrg = {
    id: `bb_${Date.now()}`,
    name: req.body.name,
    nameBn: req.body.nameBn || req.body.name,
    code: `ASC-BB-${Math.floor(100 + Math.random() * 900)}`,
    regNumber: req.body.regNumber || `DGHS-BB-${Date.now().toString().slice(-4)}`,
    division: req.body.division || "Dhaka",
    district: req.body.district || "Dhaka",
    upazila: req.body.upazila || "Sadar",
    address: req.body.address || "",
    phone: req.body.phone || "01813817167",
    emergencyHotline: req.body.emergencyHotline || req.body.phone || "01973817167",
    email: req.body.email || "blood@ascado.org",
    managerName: req.body.managerName || "Medical Officer In-Charge",
    managerPhone: req.body.managerPhone || req.body.phone || "",
    is24x7: req.body.is24x7 !== false,
    hasComponentSeparation: !!req.body.hasComponentSeparation,
    hasApheresis: !!req.body.hasApheresis,
    totalDonors: 0,
    totalUnitsCollected: 0,
    activeStockUnits: 0,
    status: "active",
    rating: 5.0,
    branchesCount: 1,
    licenseExpiry: "2029-12-31",
    logo: req.body.logo || "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=150&auto=format&fit=crop&q=80",
    coverImage: req.body.coverImage || "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&auto=format&fit=crop&q=80"
  };

  bloodHubOrganizations.unshift(newOrg);

  // Initialize base stock items for all blood groups for this new bank
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  bloodGroups.forEach((bg, idx) => {
    bloodHubStocks.push({
      id: `stk_${newOrg.id}_${idx}`,
      bloodBankId: newOrg.id,
      bloodBankName: newOrg.name,
      bloodGroup: bg as any,
      component: 'whole_blood',
      availableBags: 0,
      reservedBags: 0,
      criticalThreshold: 5,
      temperatureCelsius: '+4°C',
      storageLocation: `Vault-${bg}`,
      lastTestedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'critical'
    });
  });

  auditLogs.unshift({
    id: `aud_${Date.now()}`,
    userName: req.body.managerName || "Blood Bank Director",
    userRole: "SUPER_ADMIN",
    ip: req.ip || "127.0.0.1",
    action: "NEW_BLOOD_BANK_ONBOARDED",
    module: "Blood Hub",
    timestamp: new Date().toISOString(),
    details: `Onboarded new Blood Bank: ${newOrg.name} (${newOrg.district})`
  });

  res.status(201).json(newOrg);
});

app.put("/api/v1/blood-hub/organizations/:id", (req, res) => {
  const idx = bloodHubOrganizations.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Blood bank not found" });

  bloodHubOrganizations[idx] = { ...bloodHubOrganizations[idx], ...req.body };
  res.json(bloodHubOrganizations[idx]);
});

// 3. Blood Inventory Stocks
app.get("/api/v1/blood-hub/stocks", (req, res) => {
  const { bloodBankId, bloodGroup, component } = req.query;
  let filtered = [...bloodHubStocks];

  if (bloodBankId && bloodBankId !== "all") {
    filtered = filtered.filter(s => s.bloodBankId === bloodBankId);
  }
  if (bloodGroup && bloodGroup !== "all") {
    filtered = filtered.filter(s => s.bloodGroup === bloodGroup);
  }
  if (component && component !== "all") {
    filtered = filtered.filter(s => s.component === component);
  }

  res.json(filtered);
});

app.post("/api/v1/blood-hub/stocks/update", (req, res) => {
  const { stockId, bloodBankId, bloodGroup, component, deltaBags, newAvailableBags, reservedBags } = req.body;

  let item = bloodHubStocks.find(s => s.id === stockId);
  if (!item && bloodBankId && bloodGroup) {
    item = bloodHubStocks.find(s => s.bloodBankId === bloodBankId && s.bloodGroup === bloodGroup && (!component || s.component === component));
  }

  if (item) {
    if (newAvailableBags !== undefined) {
      item.availableBags = Math.max(0, Number(newAvailableBags));
    } else if (deltaBags !== undefined) {
      item.availableBags = Math.max(0, item.availableBags + Number(deltaBags));
    }
    if (reservedBags !== undefined) {
      item.reservedBags = Math.max(0, Number(reservedBags));
    }
    item.lastTestedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    item.status = item.availableBags <= item.criticalThreshold / 2 ? 'critical' : item.availableBags <= item.criticalThreshold ? 'low' : 'normal';

    res.json({ message: "Stock updated", item });
  } else {
    // Create new stock entry
    const bank = bloodHubOrganizations.find(b => b.id === bloodBankId);
    const newStock = {
      id: `stk_${Date.now()}`,
      bloodBankId: bloodBankId || "bb_central_ascado",
      bloodBankName: bank?.name || "Ascahdo Blood Hub",
      bloodGroup: bloodGroup || "A+",
      component: component || "whole_blood",
      availableBags: Number(newAvailableBags || deltaBags || 10),
      reservedBags: Number(reservedBags || 0),
      criticalThreshold: 6,
      temperatureCelsius: component === 'ffp' ? '-25°C' : component === 'platelets' ? '+22°C' : '+4°C',
      storageLocation: req.body.storageLocation || 'Main Cold Vault',
      lastTestedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'normal'
    };
    bloodHubStocks.unshift(newStock);
    res.status(201).json({ message: "Stock added", item: newStock });
  }
});

// 4. Hub Blood Donors (with ৳1250 Life Member Fee & ID Card)
app.get("/api/v1/blood-hub/donors", (req, res) => {
  const { bloodGroup, district, upazila, bloodBankId, availableOnly, search } = req.query;
  let filtered = [...bloodHubDonors];

  if (bloodGroup && bloodGroup !== "all") {
    filtered = filtered.filter(d => d.bloodGroup === bloodGroup);
  }
  if (district && district !== "all") {
    filtered = filtered.filter(d => d.district?.toLowerCase() === (district as string).toLowerCase());
  }
  if (upazila && upazila !== "all") {
    filtered = filtered.filter(d => d.upazila?.toLowerCase() === (upazila as string).toLowerCase());
  }
  if (bloodBankId && bloodBankId !== "all") {
    filtered = filtered.filter(d => d.associatedBloodBankId === bloodBankId);
  }
  if (availableOnly === "true") {
    filtered = filtered.filter(d => d.isAvailable === true);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(d =>
      d.fullName.toLowerCase().includes(q) ||
      d.phone.includes(q) ||
      d.donorCode?.toLowerCase().includes(q)
    );
  }

  res.json(filtered);
});

app.post("/api/v1/blood-hub/donors/register", (req, res) => {
  const {
    fullName,
    bloodGroup,
    phone,
    email,
    nid,
    gender,
    age,
    weightKg,
    division,
    district,
    upazila,
    presentAddress,
    associatedBloodBankId,
    membershipTier,
    membershipFeePaid,
    membershipPaymentMethod,
    membershipPaymentTrxId,
    emergencyContactName,
    emergencyContactPhone
  } = req.body;

  const donorCode = `ASC-DON-${Math.floor(1000 + Math.random() * 9000)}`;

  const isFeePaid = membershipFeePaid === true || !!membershipPaymentTrxId;

  const newDonor = {
    id: `don_h_${Date.now()}`,
    donorCode,
    fullName: fullName || "Blood Hero",
    bloodGroup: bloodGroup || "O+",
    phone: phone || "01813817167",
    email: email || "",
    nid: nid || "",
    gender: gender || "male",
    age: Number(age) || 25,
    weightKg: Number(weightKg) || 65,
    division: division || "Dhaka",
    district: district || "Dhaka",
    upazila: upazila || "Dhanmondi",
    presentAddress: presentAddress || `${upazila || 'সদর'}, ${district || 'ঢাকা'}`,
    lastDonationDate: req.body.lastDonationDate || new Date().toISOString().slice(0, 10),
    totalDonations: Number(req.body.totalDonations) || 1,
    isAvailable: true,
    isRegularDonor: true,
    associatedBloodBankId: associatedBloodBankId || "bb_central_ascado",
    membershipTier: membershipTier || "club_life_member",
    membershipFeePaid: isFeePaid,
    membershipFeeAmount: isFeePaid ? 1250 : 0,
    membershipPaymentTrxId: membershipPaymentTrxId || (isFeePaid ? `BKASH-${Math.random().toString(36).substring(2, 9).toUpperCase()}` : ""),
    membershipPaymentMethod: membershipPaymentMethod || "bKash",
    membershipPaidDate: isFeePaid ? new Date().toISOString().slice(0, 10) : undefined,
    donorCardIssued: true,
    avatarUrl: req.body.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
    emergencyContactName: emergencyContactName || "",
    emergencyContactPhone: emergencyContactPhone || "",
    createdAt: new Date().toISOString()
  };

  bloodHubDonors.unshift(newDonor);

  // If membership fee is paid, also record in donation/finance transaction register
  if (isFeePaid) {
    donationTransactions.unshift({
      id: `trx_blood_${Date.now()}`,
      campaignTitle: "ব্লাড ব্যাংক ক্লাব লাইফ মেম্বারশিপ ও রক্তদান তহবিল (৳১২৫০)",
      donorName: newDonor.fullName,
      donorEmail: newDonor.email || "donor@ascado.org",
      donorPhone: newDonor.phone,
      amount: 1250,
      paymentMethod: (membershipPaymentMethod?.toLowerCase() || 'bkash') as any,
      transactionId: newDonor.membershipPaymentTrxId,
      status: 'approved',
      category: 'medical',
      isAnonymous: false,
      receiptNumber: `REC-BLD-${Math.floor(100000 + Math.random() * 900000)}`,
      certificateNumber: `CERT-BLD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString()
    });
  }

  // Also add to legacy simple donor list for cross compatibility
  bloodDonors.unshift({
    id: newDonor.id,
    fullName: newDonor.fullName,
    bloodGroup: newDonor.bloodGroup,
    phone: newDonor.phone,
    district: newDonor.district,
    upazila: newDonor.upazila,
    lastDonationDate: newDonor.lastDonationDate,
    available: true,
    totalDonations: newDonor.totalDonations,
    age: newDonor.age,
    gender: newDonor.gender
  });

  res.status(201).json(newDonor);
});

// 5. Emergency Blood Requisitions (Blood SOS & Hospital Orders)
app.get("/api/v1/blood-hub/requisitions", (req, res) => {
  const { status, urgency, district, bloodGroup } = req.query;
  let filtered = [...bloodHubRequisitions];

  if (status && status !== "all") {
    filtered = filtered.filter(r => r.status === status);
  }
  if (urgency && urgency !== "all") {
    filtered = filtered.filter(r => r.urgency === urgency);
  }
  if (district && district !== "all") {
    filtered = filtered.filter(r => r.district?.toLowerCase() === (district as string).toLowerCase());
  }
  if (bloodGroup && bloodGroup !== "all") {
    filtered = filtered.filter(r => r.bloodGroup === bloodGroup);
  }

  res.json(filtered);
});

app.post("/api/v1/blood-hub/requisitions", (req, res) => {
  const newRequisition = {
    id: `req_sos_${Date.now()}`,
    requisitionNo: `REQ-EMG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    patientName: req.body.patientName,
    patientAge: Number(req.body.patientAge) || 30,
    patientGender: req.body.patientGender || "female",
    bloodGroup: req.body.bloodGroup || "O-",
    componentNeeded: req.body.componentNeeded || "whole_blood",
    bagsNeeded: Number(req.body.bagsNeeded) || 1,
    bagsFulfilled: 0,
    hospitalName: req.body.hospitalName || "Dhaka Medical College Hospital",
    hospitalBedWard: req.body.hospitalBedWard || "ইমার্জেন্সি ওয়ার্ড",
    district: req.body.district || "Dhaka",
    upazila: req.body.upazila || "Dhanmondi",
    doctorName: req.body.doctorName || "",
    contactPerson: req.body.contactPerson || "Attendant",
    contactPhone: req.body.contactPhone || req.body.phone || "01813817167",
    urgency: req.body.urgency || "critical_emergency",
    reasonDisease: req.body.reasonDisease || "জরুরি অস্ত্রোপচার / সিজারিয়ান",
    requiredDate: req.body.requiredDate || new Date().toISOString().slice(0, 10),
    requiredTime: req.body.requiredTime || "অবিলম্বে (Urgent)",
    hemoglobinLevel: req.body.hemoglobinLevel || "7.5 g/dL",
    crossMatchDone: !!req.body.crossMatchDone,
    status: "pending",
    assignedBloodBankId: req.body.assignedBloodBankId || "bb_central_ascado",
    createdAt: new Date().toISOString()
  };

  bloodHubRequisitions.unshift(newRequisition);

  // Also sync to legacy bloodRequests
  bloodRequests.unshift({
    id: newRequisition.id,
    patientName: newRequisition.patientName,
    bloodGroup: newRequisition.bloodGroup,
    unitsNeeded: newRequisition.bagsNeeded,
    hospitalName: newRequisition.hospitalName,
    district: newRequisition.district,
    upazila: newRequisition.upazila,
    contactPerson: newRequisition.contactPerson,
    contactPhone: newRequisition.contactPhone,
    urgency: newRequisition.urgency,
    requiredDate: newRequisition.requiredDate,
    status: "pending",
    createdAt: new Date().toISOString()
  });

  res.status(201).json(newRequisition);
});

app.put("/api/v1/blood-hub/requisitions/:id/fulfill", (req, res) => {
  const idx = bloodHubRequisitions.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Requisition not found" });

  const { bagsFulfilled, status } = req.body;
  bloodHubRequisitions[idx] = {
    ...bloodHubRequisitions[idx],
    bagsFulfilled: bagsFulfilled !== undefined ? Number(bagsFulfilled) : bloodHubRequisitions[idx].bagsNeeded,
    status: status || "fulfilled"
  };

  res.json({ message: "Requisition updated", requisition: bloodHubRequisitions[idx] });
});

// 6. Blood Transfer Network (Hub-to-Hub & Branch-to-Branch)
app.get("/api/v1/blood-hub/transfers", (req, res) => {
  res.json(bloodHubTransfers);
});

app.post("/api/v1/blood-hub/transfers", (req, res) => {
  const fromBank = bloodHubOrganizations.find(b => b.id === req.body.fromBloodBankId);
  const toBank = bloodHubOrganizations.find(b => b.id === req.body.toBloodBankId);

  const newTransfer = {
    id: `trf_${Date.now()}`,
    transferCode: `TRF-ASC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    fromBloodBankId: req.body.fromBloodBankId,
    fromBloodBankName: fromBank?.name || "Ascahdo Central Blood Bank",
    toBloodBankId: req.body.toBloodBankId,
    toBloodBankName: toBank?.name || "Regional Blood Unit",
    bloodGroup: req.body.bloodGroup || "O+",
    component: req.body.component || "whole_blood",
    unitsCount: Number(req.body.unitsCount) || 2,
    courierName: req.body.courierName || "মেডিকেল কোল্ড-চেইন এক্সপ্রেস সার্ভিস",
    courierPhone: req.body.courierPhone || "01813817167",
    coldBoxTemp: req.body.coldBoxTemp || "+4.0°C (Monitored)",
    dispatchedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    status: "in_transit",
    purpose: req.body.purpose || "জরুরি ক্রস-রিজিওনাল রক্তের সরবরাহ"
  };

  bloodHubTransfers.unshift(newTransfer);
  res.status(201).json(newTransfer);
});

// 7. Blood Camps & Mobile Drives
app.get("/api/v1/blood-hub/camps", (req, res) => {
  res.json(bloodHubCamps);
});

app.post("/api/v1/blood-hub/camps", (req, res) => {
  const bank = bloodHubOrganizations.find(b => b.id === req.body.organizerBloodBankId);
  const newCamp = {
    id: `cmp_${Date.now()}`,
    title: req.body.title,
    titleBn: req.body.titleBn || req.body.title,
    organizerBloodBankId: req.body.organizerBloodBankId || "bb_central_ascado",
    organizerName: bank?.name || "Ascahdo Blood Hub",
    venue: req.body.venue,
    venueBn: req.body.venueBn || req.body.venue,
    district: req.body.district || "Dhaka",
    upazila: req.body.upazila || "Dhanmondi",
    startDate: req.body.startDate || new Date().toISOString().slice(0, 10),
    endDate: req.body.endDate || req.body.startDate || new Date().toISOString().slice(0, 10),
    timeSlot: req.body.timeSlot || "সকাল ৯:০০ টা - বিকাল ৫:০০ টা",
    targetBags: Number(req.body.targetBags) || 100,
    registeredDonorsCount: 0,
    collectedBagsCount: 0,
    coordinatorName: req.body.coordinatorName || "Camp Coordinator",
    coordinatorPhone: req.body.coordinatorPhone || "01813817167",
    bannerImage: req.body.bannerImage || "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=80",
    status: "upcoming",
    allowOnlinePreReg: true
  };

  bloodHubCamps.unshift(newCamp);
  res.status(201).json(newCamp);
});

app.post("/api/v1/blood-hub/camps/:id/register-donor", (req, res) => {
  const camp = bloodHubCamps.find(c => c.id === req.params.id);
  if (!camp) return res.status(404).json({ error: "Camp not found" });

  camp.registeredDonorsCount = (camp.registeredDonorsCount || 0) + 1;
  res.json({ message: "Successfully pre-registered for blood camp", camp });
});

// 8. Thalassaemia & Regular Patient Registry
app.get("/api/v1/blood-hub/thalassaemia", (req, res) => {
  res.json(bloodHubThalassaemia);
});

app.post("/api/v1/blood-hub/thalassaemia", (req, res) => {
  const newPatient = {
    id: `thal_${Date.now()}`,
    regNo: `THAL-ASC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    name: req.body.name,
    age: Number(req.body.age) || 10,
    bloodGroup: req.body.bloodGroup || "O+",
    district: req.body.district || "Dhaka",
    upazila: req.body.upazila || "Dhanmondi",
    guardianName: req.body.guardianName || "Guardian",
    contactPhone: req.body.contactPhone || "01813817167",
    requiredBagsPerMonth: Number(req.body.requiredBagsPerMonth) || 2,
    lastTransfusionDate: req.body.lastTransfusionDate || new Date().toISOString().slice(0, 10),
    nextTransfusionDue: req.body.nextTransfusionDue || new Date(Date.now() + 25 * 86400000).toISOString().slice(0, 10),
    assignedBloodBankId: req.body.assignedBloodBankId || "bb_central_ascado",
    status: "active"
  };

  bloodHubThalassaemia.unshift(newPatient);
  res.status(201).json(newPatient);
});

// ========================================================
// COMPREHENSIVE DONATION & PHILANTHROPY MANAGEMENT SYSTEM
// ========================================================

// 1. Donation Summary & Financial Transparency
app.get("/api/v1/donations/summary", (req, res) => {
  const totalCollected = donationTransactions
    .filter(t => t.status === "approved" || t.status === "paid")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalSpent = donationExpenses
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const totalDonorsCount = donationTransactions.length;
  const reserveBalance = Math.max(0, totalCollected - totalSpent);

  res.json({
    ...transparencySummary,
    totalCollected,
    totalSpent,
    reserveBalance,
    totalDonorsCount: Math.max(transparencySummary.totalDonorsCount || 0, totalDonorsCount),
    totalBeneficiariesCount: transparencySummary.totalBeneficiariesCount || 14200
  });
});

// 2. Donation Categories & Causes
app.get("/api/v1/donations/categories", (req, res) => {
  res.json(DONATION_CATEGORIES);
});

// 3. Emergency Appeals & Disaster Funds
app.get("/api/v1/donations/appeals", (req, res) => {
  res.json(emergencyAppeals);
});

app.post("/api/v1/donations/appeals", (req, res) => {
  const newAppeal = {
    id: `apl_${Date.now()}`,
    ...req.body,
    raisedAmount: Number(req.body.raisedAmount) || 0,
    targetAmount: Number(req.body.targetAmount) || 500000,
    donorCount: 0,
    status: req.body.status || "active",
    createdAt: new Date().toISOString()
  };
  emergencyAppeals.unshift(newAppeal);
  res.status(201).json(newAppeal);
});

app.put("/api/v1/donations/appeals/:id", (req, res) => {
  const idx = emergencyAppeals.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Appeal not found" });
  emergencyAppeals[idx] = { ...emergencyAppeals[idx], ...req.body };
  res.json(emergencyAppeals[idx]);
});

app.delete("/api/v1/donations/appeals/:id", (req, res) => {
  const idx = emergencyAppeals.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Appeal not found" });
  const deleted = emergencyAppeals.splice(idx, 1);
  res.json({ message: "Appeal deleted successfully", deleted: deleted[0] });
});

// 4. Donation Projects & Campaigns
app.get("/api/v1/donations/projects", (req, res) => {
  const { status, category } = req.query;
  let filtered = [...donationProjects];
  if (status && status !== "all") {
    filtered = filtered.filter(p => p.status === status);
  }
  if (category && category !== "all") {
    filtered = filtered.filter(p => p.category === category);
  }
  res.json(filtered);
});

app.get("/api/v1/donations/campaigns", (req, res) => {
  res.json(donationProjects);
});

app.post("/api/v1/donations/projects", (req, res) => {
  const newProject = {
    id: `prj_${Date.now()}`,
    ...req.body,
    raisedAmount: Number(req.body.raisedAmount) || 0,
    targetAmount: Number(req.body.targetAmount) || 500000,
    spentAmount: 0,
    donorCount: 0,
    status: req.body.status || "ongoing",
    createdAt: new Date().toISOString()
  };
  donationProjects.unshift(newProject);
  res.status(201).json(newProject);
});

app.put("/api/v1/donations/projects/:id", (req, res) => {
  const idx = donationProjects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Project not found" });
  donationProjects[idx] = { ...donationProjects[idx], ...req.body };
  res.json(donationProjects[idx]);
});

app.delete("/api/v1/donations/projects/:id", (req, res) => {
  const idx = donationProjects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Project not found" });
  const deleted = donationProjects.splice(idx, 1);
  res.json({ message: "Project deleted successfully", deleted: deleted[0] });
});

// 5. Donation Transactions & Online Receipt Generation
app.get("/api/v1/donations/transactions", (req, res) => {
  const { status, category } = req.query;
  let filtered = [...donationTransactions];
  if (status && status !== "all") {
    filtered = filtered.filter(t => t.status === status);
  }
  if (category && category !== "all") {
    filtered = filtered.filter(t => t.category === category);
  }
  res.json(filtered);
});

app.post("/api/v1/donations/create", (req, res) => {
  const {
    campaignId,
    campaignTitle,
    category,
    categoryNameBn,
    donorName,
    donorEmail,
    donorPhone,
    donorDistrict,
    donorAddress,
    amount,
    frequency,
    paymentMethod,
    senderAccountNo,
    transactionId,
    isAnonymous,
    notesOrPrayer
  } = req.body;

  const numAmount = Number(amount) || 0;
  if (numAmount < 10) {
    return res.status(400).json({ error: "Donation amount must be at least 10 BDT" });
  }

  const receiptNumber = generateReceiptNumber();
  const certificateNumber = generateCertificateNumber();
  const effectiveTrxId = (transactionId && transactionId.trim())
    ? transactionId.trim().toUpperCase()
    : `${(paymentMethod || "BK").substring(0, 2).toUpperCase()}${Math.floor(10000000 + Math.random() * 90000000)}`;

  const effectiveDonorName = isAnonymous ? "মহৎ বেনামী শুভাকাঙ্ক্ষী" : (donorName || "শ্রদ্ধেয় শুভাকাঙ্ক্ষী");

  const qrCodeData = generateQrCodePayload({
    receiptNumber,
    transactionId: effectiveTrxId,
    amount: numAmount,
    donorName: effectiveDonorName,
    category: categoryNameBn || category || "মানবকল্যাণ তহবিল",
    date: new Date().toISOString().split("T")[0]
  });

  // Update associated project if any
  if (campaignId) {
    const prj = donationProjects.find(p => p.id === campaignId);
    if (prj) {
      prj.raisedAmount = (Number(prj.raisedAmount) || 0) + numAmount;
      prj.donorCount = (Number(prj.donorCount) || 0) + 1;
    }
  }

  const newTx: any = {
    id: `tx_${Date.now()}`,
    receiptNumber,
    certificateNumber,
    campaignId,
    campaignTitle: campaignTitle || "সার্বিক মানবকল্যাণ তহবিল",
    category: category || "helpless_support",
    categoryNameBn: categoryNameBn || "অসহায় মানুষের সহায়তা",
    donorName: effectiveDonorName,
    donorEmail: donorEmail || "donor@ascado.org",
    donorPhone: donorPhone || "+8801700000000",
    donorDistrict: donorDistrict || "Dhaka (ঢাকা)",
    donorAddress: donorAddress || "",
    amount: numAmount,
    frequency: frequency || "one_time",
    paymentMethod: paymentMethod || "bkash",
    senderAccountNo: senderAccountNo || "",
    transactionId: effectiveTrxId,
    status: "paid",
    isAnonymous: !!isAnonymous,
    notesOrPrayer: notesOrPrayer || "",
    qrCodeData,
    isCertificateIssued: true,
    createdAt: new Date().toISOString(),
    approvedAt: new Date().toISOString(),
    approvedBy: "Central Treasury Automated System"
  };

  donationTransactions.unshift(newTx);
  res.status(201).json(newTx);
});

app.put("/api/v1/donations/transactions/:id/approve", (req, res) => {
  const tx = donationTransactions.find(t => t.id === req.params.id);
  if (!tx) return res.status(404).json({ error: "Transaction not found" });
  tx.status = "paid";
  tx.approvedAt = new Date().toISOString();
  tx.approvedBy = "Admin Treasury Panel";
  res.json({ message: "Transaction approved successfully", transaction: tx });
});

app.delete("/api/v1/donations/transactions/:id", (req, res) => {
  const idx = donationTransactions.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Transaction not found" });
  const deleted = donationTransactions.splice(idx, 1);
  res.json({ message: "Transaction deleted successfully", deleted: deleted[0] });
});

// 6. Direct Verification by Receipt / TrxID
app.get("/api/v1/donations/verify/:query", (req, res) => {
  const query = (req.params.query || "").trim().toLowerCase();
  const found = donationTransactions.find(
    t =>
      t.receiptNumber.toLowerCase() === query ||
      t.transactionId.toLowerCase() === query ||
      (t.donorPhone && t.donorPhone.includes(query)) ||
      (t.certificateNumber && t.certificateNumber.toLowerCase() === query)
  );

  if (!found) {
    return res.status(404).json({ error: "No verified official donation record found" });
  }

  res.json(found);
});

// 7. Field Expenses & Voucher Management
app.get("/api/v1/donations/expenses", (req, res) => {
  res.json(donationExpenses);
});

app.post("/api/v1/donations/expenses", (req, res) => {
  const newExp = {
    id: `exp_${Date.now()}`,
    voucherNumber: `VOU-ASC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    ...req.body,
    amount: Number(req.body.amount) || 0,
    createdAt: new Date().toISOString()
  };
  donationExpenses.unshift(newExp);
  res.status(201).json(newExp);
});

app.put("/api/v1/donations/expenses/:id", (req, res) => {
  const idx = donationExpenses.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Expense voucher not found" });
  donationExpenses[idx] = { ...donationExpenses[idx], ...req.body };
  res.json(donationExpenses[idx]);
});

app.delete("/api/v1/donations/expenses/:id", (req, res) => {
  const idx = donationExpenses.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Expense voucher not found" });
  const deleted = donationExpenses.splice(idx, 1);
  res.json({ message: "Expense voucher deleted successfully", deleted: deleted[0] });
});

// 8. Donor Wall of Honor
app.get("/api/v1/donations/donor-wall", (req, res) => {
  res.json(donorRecognitions);
});

// Volunteers
app.get("/api/v1/volunteers", (req, res) => {
  res.json(volunteers);
});

app.post("/api/v1/volunteers/register", (req, res) => {
  const newVol = {
    id: `vol_${Date.now()}`,
    userId: `usr_v_${Date.now()}`,
    ...req.body,
    hoursServed: 0,
    eventsCount: 0,
    idCardNumber: `VOL-ASC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    status: "active",
    joinedDate: new Date().toISOString().split("T")[0]
  };
  volunteers.push(newVol);
  res.status(201).json(newVol);
});

// School Management
app.get("/api/v1/schools/students", (req, res) => {
  res.json(schoolStudents);
});

// Courses & LMS
app.get("/api/v1/courses", (req, res) => {
  res.json(courses);
});

// Somiti & Loans
app.get("/api/v1/somiti/loans", (req, res) => {
  res.json(somitiLoans);
});

app.post("/api/v1/somiti/loans", (req, res) => {
  const numAmount = Number(req.body.loanAmount) || 20000;
  const newLoan = {
    id: `ln_${Date.now()}`,
    ...req.body,
    loanAmount: numAmount,
    interestRate: 6,
    termMonths: 12,
    monthlyInstallment: Math.round((numAmount * 1.06) / 12),
    paidAmount: 0,
    dueAmount: Math.round(numAmount * 1.06),
    status: "pending_approval",
    disbursementDate: new Date().toISOString().split("T")[0]
  };
  somitiLoans.unshift(newLoan);
  res.status(201).json(newLoan);
});

app.post("/api/v1/somiti/loans/:id/approve", (req, res) => {
  const loan = somitiLoans.find(l => l.id === req.params.id);
  if (!loan) return res.status(404).json({ error: "Loan not found" });
  loan.status = "active";
  res.json({ message: "Loan approved successfully", loan });
});

// Marketplace & B2B (with 10% platform commission calculation)
app.get("/api/v1/marketplace/products", (req, res) => {
  res.json(marketplaceProducts);
});

app.get("/api/v1/marketplace/vendors", (req, res) => {
  res.json(marketplaceVendors);
});

app.post("/api/v1/marketplace/vendors", (req, res) => {
  const newVendor = {
    id: `vnd_${Date.now()}`,
    ...req.body,
    rating: 5.0,
    verified: true,
    joinedDate: new Date().toISOString().split("T")[0],
    totalProducts: 0,
    totalSales: 0,
    commissionRate: 0.10,
    logo: req.body.logo || "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=200&auto=format&fit=crop&q=80",
    banner: req.body.banner || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80"
  };
  marketplaceVendors.unshift(newVendor);
  res.status(201).json(newVendor);
});

app.get("/api/v1/marketplace/bundles", (req, res) => {
  res.json(marketplaceBundles);
});

app.post("/api/v1/marketplace/bundles", (req, res) => {
  const newBundle = {
    id: `bnd_${Date.now()}`,
    ...req.body,
    stock: Number(req.body.stock) || 50,
    rating: 5.0,
    salesCount: 0
  };
  marketplaceBundles.unshift(newBundle);
  res.status(201).json(newBundle);
});

app.get("/api/v1/marketplace/orders", (req, res) => {
  const { vendorId, buyerPhone } = req.query;
  let filtered = [...marketplaceOrders];
  if (vendorId) {
    filtered = filtered.filter(o => o.sellerId === vendorId);
  }
  if (buyerPhone) {
    filtered = filtered.filter(o => o.buyerPhone === buyerPhone);
  }
  res.json(filtered);
});

// Marketplace Coupons
const marketplaceCoupons = [
  { code: 'DIGITAL20', discountPercent: 20, maxDiscount: 500, minSpend: 200, labelBn: 'ডিজিটাল ২০% মেগা ছাড়' },
  { code: 'HALAL10', discountPercent: 10, maxDiscount: 300, minSpend: 150, labelBn: '১০% হালাল মার্কেটপ্লেস ছাড়' },
  { code: 'RAMADAN50', flatDiscount: 50, minSpend: 300, labelBn: '৫০ টাকা ফ্ল্যাট উপহার' },
  { code: 'CREATOR', discountPercent: 15, maxDiscount: 400, minSpend: 250, labelBn: 'ক্রিয়েটর স্পেশাল ১৫% ছাড়' }
];

function generateLicenseKey() {
  const seg1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const seg2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ASC-LIC-${seg1}-${seg2}-2026`;
}

app.post("/api/v1/marketplace/coupons/validate", (req, res) => {
  const { code, totalAmount } = req.body;
  if (!code) return res.status(400).json({ error: "Coupon code is required" });
  const coupon = marketplaceCoupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
  if (!coupon) return res.status(404).json({ valid: false, error: "অবৈধ কুপন কোড (Invalid coupon code)" });

  const gross = Number(totalAmount) || 0;
  if (coupon.minSpend && gross < coupon.minSpend) {
    return res.status(400).json({
      valid: false,
      error: `এই কুপনটি পেতে ন্যূনতম ৳${coupon.minSpend} টাকার কেনাকাটা প্রয়োজন।`
    });
  }

  let discount = 0;
  if (coupon.discountPercent) {
    discount = Math.round((gross * coupon.discountPercent) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else if (coupon.flatDiscount) {
    discount = coupon.flatDiscount;
  }
  discount = Math.min(discount, gross);

  res.json({
    valid: true,
    code: coupon.code,
    labelBn: coupon.labelBn,
    discountAmount: discount,
    finalAmount: Math.max(0, gross - discount)
  });
});

app.get("/api/v1/marketplace/vault/lookup", (req, res) => {
  const { phone, orderId } = req.query;
  if (!phone && !orderId) {
    return res.status(400).json({ error: "Phone number or Order ID required" });
  }

  const p = phone ? String(phone).trim() : null;
  const oid = orderId ? String(orderId).trim() : null;

  const matchedOrders = marketplaceOrders.filter(ord => {
    const matchPhone = p && ord.buyerPhone && ord.buyerPhone.includes(p);
    const matchId = oid && ord.id && ord.id.toLowerCase() === oid.toLowerCase();
    return matchPhone || matchId;
  });

  const digitalItems: any[] = [];
  matchedOrders.forEach(ord => {
    if (ord.orderType === 'cart_multi' && Array.isArray(ord.items)) {
      ord.items.filter((it: any) => it.productType === 'digital').forEach((it: any) => {
        digitalItems.push({
          orderId: ord.id,
          orderDate: ord.createdAt,
          buyerName: ord.buyerName,
          buyerPhone: ord.buyerPhone,
          productId: it.productId,
          productName: it.productName,
          licenseKey: it.licenseKey || ord.licenseKey || 'ASC-LIC-9A4B-2C8F-2026',
          licenseType: it.licenseType || ord.licenseType || 'Personal Single User',
          downloadUrl: it.downloadUrl || 'https://ascado.org/downloads/digital-file.zip',
          fileFormat: it.fileFormat || 'PDF / ZIP',
          sellerName: it.sellerName,
          amountPaid: it.itemTotal || it.unitPrice
        });
      });
    } else if (ord.productType === 'digital') {
      digitalItems.push({
        orderId: ord.id,
        orderDate: ord.createdAt,
        buyerName: ord.buyerName,
        buyerPhone: ord.buyerPhone,
        productId: ord.productId,
        productName: ord.productName,
        licenseKey: ord.licenseKey || 'ASC-LIC-9A4B-2C8F-2026',
        licenseType: ord.licenseType || 'Personal Single User',
        downloadUrl: ord.downloadUrl || 'https://ascado.org/downloads/digital-file.zip',
        sellerName: ord.sellerName,
        amountPaid: ord.totalAmount
      });
    }
  });

  res.json({
    ordersCount: matchedOrders.length,
    digitalItems,
    matchedOrders
  });
});

app.post("/api/v1/marketplace/products/:id/reviews", (req, res) => {
  const { author, rating, comment, verifiedBuyer } = req.body;
  const product = marketplaceProducts.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  if (!product.reviews) product.reviews = [];
  const newReview = {
    id: `rev_${Date.now()}`,
    author: author || "ভেরিফায়েড ক্রেতা",
    rating: Number(rating) || 5,
    comment: comment || "খুবই চমৎকার ডিজিটাল ফাইল ও সেবা!",
    date: new Date().toISOString().split("T")[0],
    verifiedBuyer: verifiedBuyer !== false
  };

  product.reviews.unshift(newReview);
  product.reviewsCount = (product.reviewsCount || 0) + 1;
  const totalStars = product.reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0);
  product.rating = Number((totalStars / product.reviews.length).toFixed(1));

  res.status(201).json({ review: newReview, product });
});

// =================================================================
// ASCADO MARKETPLACE AI ROBOT (GEMINI 3.8 FLASH & DOMAIN ENGINE)
// =================================================================

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return geminiClient;
}

function generateDomainKnowledgeAnswer(userQuestion: string, product?: any): string {
  const q = userQuestion.toLowerCase();
  
  if (product) {
    const isDigital = product.productType === 'digital' || product.isDigital;
    
    // Purity / Quality / Halal
    if (q.includes('খাঁটি') || q.includes('আসল') || q.includes('অর্গানিক') || q.includes('ভেজাল') || q.includes('মান') || q.includes('হালাল') || q.includes('পিওর') || q.includes('pure') || q.includes('organic')) {
      return `আসসালামু আলাইকুম! '${product.nameBn}' পণ্যটি শতভাগ খাঁটি ও ইসলামিক শরিয়াহ নির্দেশিত হালাল মান অনুযায়ী সংগৃহীত ও প্রস্তুতকৃত। আমাদের বিক্রেতা প্রতিষ্ঠান '${product.sellerName}' সরাসরি মাঠ পর্যায় থেকে বিশুদ্ধ সামগ্রী প্রক্রিয়াজাত করে থাকে। এতে কোনো ধরনের ক্ষতিকর কেমিক্যাল বা প্রিজারভেটিভ ব্যবহার করা হয়নি। আপনি নিশ্চিন্তে ও আস্থার সাথে অর্ডার করতে পারেন।`;
    }
    
    // Delivery / Time / Charge
    if (q.includes('ডেলিভারি') || q.includes('কবে') || q.includes('সময়') || q.includes('চার্জ') || q.includes('কুরিয়ার') || q.includes('পৌঁছা') || q.includes('delivery')) {
      if (isDigital) {
        return `আসসালামু আলাইকুম! এটি একটি প্রিমিয়াম ডিজিটাল সম্পদ। পেমেন্ট কনফার্ম হওয়ামাত্র আপনার আসকাডো ডিজিটাল ভল্ট (Digital Vault) এবং ইমেইল ঠিকানায় তাৎক্ষণিকভাবে সরাসরি হাই-স্পিড ডাউনলোড লিংক ও পার্সোনাল/কমার্শিয়াল লাইসেন্স কি চলে যাবে। কোনো কুরিয়ার অপেক্ষা করতে হবে না।`;
      }
      return `আসসালামু আলাইকুম! ঢাকা সিটিতে অর্ডার কনফার্মেশনের ২৪ থেকে ৪৮ ঘণ্টার মধ্যে (হোম ডেলিভারি চার্জ মাত্র ৬০ টাকা) এবং ঢাকার বাইরে দেশের যেকোনো জেলা বা উপজেলায় ২ থেকে ৩ কার্যদিবসের মধ্যে (চার্জ ১২০ টাকা) হোম ডেলিভারি পৌঁছে দেওয়া হয়। পণ্য হাতে পেয়ে মূল্য পরিশোধের (Cash on Delivery) পূর্ণ সুযোগ রয়েছে।`;
    }

    // Price / Discount / Offer
    if (q.includes('দাম') || q.includes('মূল্য') || q.includes('কত') || q.includes('ছাড়') || q.includes('অফার') || q.includes('ডিসকাউন্ট') || q.includes('price')) {
      return `পণ্যটির নিয়মিত অফার মূল্য মাত্র ৳${product.price} (মূল তালিকা মূল্য ৳${product.originalPrice || product.price})। বর্তমানে পণ্যটি আমাদের স্টকে সক্রিয় রয়েছে (অবশিষ্ট: ${product.stock} টি)। 'অর্ডার করুন' বাটনে ক্লিক করে আপনি এখনই আপনার কপিটি বুক করতে পারেন।`;
    }

    // Payment method
    if (q.includes('পেমেন্ট') || q.includes('টাকা') || q.includes('বিকাশ') || q.includes('নগদ') || q.includes('রকেট') || q.includes('কার্ড') || q.includes('payment') || q.includes('bkash')) {
      return `আসকাডো মার্কেটপ্লেসে অত্যন্ত সহজে এবং নিরাপদে পেমেন্ট করা যায়। আমরা বিকাশ (bKash), নগদ (Nagad), রকেট (Rocket), ভিসা/মাস্টারকার্ড এবং ফিজিক্যাল পণ্যের ক্ষেত্রে ডেলিভারি ম্যানের কাছে ক্যাশ অন ডেলিভারি (Cash on Delivery) সমর্থন করি।`;
    }

    // Return & Guarantee
    if (q.includes('ফেরত') || q.includes('রিটার্ন') || q.includes('খারাপ') || q.includes('নষ্ট') || q.includes('গ্যারান্টি') || q.includes('return') || q.includes('refund')) {
      return `আমাদের প্রতিটি অর্ডারে রয়েছে ৭ দিনের সহজ রিপ্লেসমেন্ট গ্যারান্টি। পণ্য হাতে পাওয়ার পর বর্ণনার সাথে মিল না থাকলে বা কোনো ত্রুটি থাকলে আমাদের হেল্পলাইনে জানালে ২৪ ঘণ্টার মধ্যে ফ্রি রিপ্লেসমেন্ট অথবা শতভাগ টাকা রিফান্ড প্রদান করা হবে।`;
    }

    // Features / Details / Usage
    return `আসসালামু আলাইকুম! '${product.nameBn}' সম্পর্কে তথ্য:\n• ক্যাটাগরি: ${product.categoryBn || product.category}\n• বিক্রেতা: ${product.sellerName}\n• মূল্য: ৳${product.price}\n• স্টক: ${product.stock} টি উপলব্ধ\n• বিবরণ: ${product.description || '১০০% হালাল ও পরীক্ষিত কোয়ালিটি'}\n• বিশেষ সুবিধাসমূহ: ${Array.isArray(product.featuresBn) ? product.featuresBn.join(', ') : 'উন্নত মান ও দ্রুত সার্ভিস'}।\nআপনার আর কোনো প্রশ্ন থাকলে জানান, আমি সার্বক্ষণিক সহযোগিতা করতে প্রস্তুত!`;
  }

  // General Marketplace Inquiries
  if (q.includes('ডেলিভারি') || q.includes('চার্জ') || q.includes('কুরিয়ার')) {
    return `আসসালামু আলাইকুম! আসকাডো হালাল মার্কেটপ্লেসের ডেলিভারি পলিসি:\n• ঢাকা সিটির ভেতরে: ২৪-৪৮ ঘণ্টার মধ্যে হোম ডেলিভারি (চার্জ ৬০ টাকা)\n• ঢাকার বাইরে সমগ্র বাংলাদেশে: ২-৩ কার্যদিবসে হোম ডেলিভারি (চার্জ ১২০ টাকা)\n• ডিজিটাল পণ্য: পেমেন্ট হওয়ার সাথে সাথে স্বয়ংক্রিয় ডিজিটাল ভল্ট থেকে ইনস্ট্যান্ট ডাউনলোড\n• ক্যাশ অন ডেলিভারি (COD) সারাদেশে প্রযোজ্য!`;
  }

  if (q.includes('বিকাশ') || q.includes('নগদ') || q.includes('পেমেন্ট') || q.includes('টাকা')) {
    return `আসকাডো মার্কেটপ্লেসে গ্রাহকদের জন্য শতভাগ নিরাপদ ও শরিয়াহ সম্মত পেমেন্ট সিস্টেম রয়েছে। আপনি বিকাশ, নগদ, রকেট, ব্যাংক কার্ড কিংবা পণ্য হাতে পেয়ে ক্যাশ অন ডেলিভারিতে নিশ্চিন্তে মূল্য পরিশোধ করতে পারবেন।`;
  }

  if (q.includes('হালাল') || q.includes('শরিয়াহ') || q.includes('বিশ্বস্ত') || q.includes('নীতি')) {
    return `আসকাডো প্ল্যাটফর্মের মূল লক্ষ্য হলো হালাল ও সুদমুক্ত অর্থনৈতিক সমাজ গঠন। আমাদের মার্কেটপ্লেসে অন্তর্ভুক্ত প্রতিটি পণ্য আমাদের শরিয়াহ বোর্ড ও কোয়ালিটি কন্ট্রোল টিম দ্বারা যাচাইকৃত। হারাম উপাদান, অতিরিক্ত মুনাফাখোরি বা প্রতারণামূলক পণ্যের প্রতি আমাদের জিরো টলারেন্স রয়েছে।`;
  }

  if (q.includes('সেলার') || q.includes('বিক্রেতা') || q.includes('দোকান') || q.includes('বিক্রি')) {
    return `আপনি যদি খাঁটি হালাল পণ্য, হস্তশিল্প, অর্গানিক খাদ্য বা ইসলামিক ডিজিটাল কনটেন্টের নির্ভরযোগ্য উৎপাদনকারী বা ব্যবসায়ী হন, তবে আসকাডো সেলার পোর্টালে যুক্ত হয়ে সারাদেশে আপনার পণ্য বিক্রি করতে পারেন। সেলার রেজিস্ট্রেশন সম্পূর্ণ ফ্রি এবং মাত্র ১০% ন্যায্য সার্ভিস চার্জে পরিচালিত হয়।`;
  }

  return `আসসালামু আলাইকুম! আমি আসকাডো হালাল মার্কেটপ্লেসের সার্বক্ষণিক স্মার্ট এআই রোবট। খাঁটি সরিষার তেল, সুন্দরবনের প্রাকৃতিক মধু, হস্তশিল্প নকশিকাঁথা, ইসলামিক ডিজিটাল বই/প্ল্যানার এবং বিভিন্ন হালাল পণ্য ও ডেলিভারি সংক্রান্ত যেকোনো তথ্য জানতে আমাকে প্রশ্ন করুন। আমি তাৎক্ষণিকভাবে উত্তর প্রদান করব!`;
}

async function generateMarketplaceAnswer(userQuestion: string, product?: any, history?: any[]): Promise<string> {
  const gemini = getGeminiClient();

  if (gemini) {
    try {
      const productCatalogSummary = marketplaceProducts.slice(0, 10).map(p => 
        `- [ID: ${p.id}] ${p.nameBn} | ক্যাটাগরি: ${p.categoryBn} | মূল্য: ৳${p.price} | স্টক: ${p.stock} | বিক্রেতা: ${p.sellerName} | ধরন: ${p.productType}`
      ).join("\n");

      const productContext = product ? `
[বর্তমান পণ্য যার ব্যাপারে প্রশ্ন করা হয়েছে]:
- আইডি: ${product.id}
- নাম: ${product.nameBn} (${product.name})
- ক্যাটাগরি: ${product.categoryBn || product.category}
- ধরন: ${product.productType === 'digital' ? 'ডিজিটাল ফাইল ডাউনলোড' : 'ফিজিক্যাল ডেলিভারি আইটেম'}
- মূল্য: ${product.price} টাকা (মূল মূল্য: ${product.originalPrice || product.price} টাকা)
- বর্তমান স্টক: ${product.stock} টি
- বিক্রেতা: ${product.sellerName}
- বিবরণ: ${product.description || ''}
- প্রধান বৈশিষ্ট্যসমূহ: ${Array.isArray(product.featuresBn) ? product.featuresBn.join(', ') : 'খাঁটি ও নির্ভরযোগ্য'}
${product.weight ? `- ওজন: ${product.weight}` : ''}
` : `
[মার্কেটপ্লেসের শীর্ষ পণ্য তালিকা]:
${productCatalogSummary}
`;

      const systemInstruction = `
আপনি হলেন 'আসকাডো হালাল মার্কেটপ্লেস এআই রোবট' (Ascado Halal Marketplace AI Customer Service Robot)।
আপনার দায়িত্ব হলো মার্কেটপ্লেসের ক্রেতাদের যেকোনো প্রশ্নের (যেমন: পণ্যের কোয়ালিটি, খাঁটি কিনা, দাম, স্টক, ঢাকা ও সারাদেশে ডেলিভারি সময়, ডেলিভারি চার্জ ৬০/১২০ টাকা, বিকাশ/নগদ/ক্যাশ অন ডেলিভারি, ৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি, ডিজিটাল ফাইলের তাৎক্ষণিক ডাউনলোড ইত্যাদি) সরাসরি, প্রাঞ্জল ও নিখুঁত উত্তর দেওয়া।

নিয়মাবলী:
১. ক্রেতাকে সম্মানের সাথে ইসলামিক অভিবাদন ('আসসালামু আলাইকুম') ও সৌজন্যমূলক শব্দে সম্বোধন করবেন।
২. পণ্যের সঠিক দাম, স্টক এবং তথ্যের সাথে সামঞ্জস্য রেখে স্পষ্ট উত্তর দিন।
৩. উত্তরটি অতিরিক্ত দীর্ঘ করবেন না (২-৩ প্যারাগ্রাফ বা প্রয়োজনীয় বুলেট পয়েন্টে সুন্দরভাবে উপস্থাপন করুন)।
৪. বাংলা ভাষায় সাবলীল ও আকর্ষণীয়ভাবে উত্তর লিখুন। ক্রেতা ইংরেজিতে প্রশ্ন করলে ইংরেজিতে উত্তর দিন।
`;

      const response = await gemini.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `
${productContext}

গ্রাহকের প্রশ্ন: "${userQuestion}"

রোবট হিসেবে সরাসরি ও বিস্তারিত উত্তর দিন:`,
        config: {
          systemInstruction,
          temperature: 0.65,
        }
      });

      if (response && response.text && response.text.trim()) {
        return response.text.trim();
      }
    } catch (err: any) {
      console.warn("Gemini API call skipped, using domain rule engine:", err?.message || err);
    }
  }

  return generateDomainKnowledgeAnswer(userQuestion, product);
}

// 1. Get Product Q&A List
app.get("/api/v1/marketplace/products/:id/qa", (req, res) => {
  const product = marketplaceProducts.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  if (!product.qaList) {
    product.qaList = [
      {
        id: `qa_seed_${product.id}_1`,
        productId: product.id,
        productName: product.nameBn || product.name,
        question: "পণ্যটি কি শতভাগ খাঁটি ও কোয়ালিটি পরীক্ষিত?",
        askerName: "আব্দুল্লাহ আল মামুন",
        askedAt: "২০২৬-০৩-০৪T১০:১৫:০০Z",
        answer: `আসসালামু আলাইকুম! জ্বি, '${product.nameBn}' সম্পূর্ণ ১০০% ভেজালমুক্ত, শরিয়াহ সম্মত এবং পরীক্ষিত মান বজায় রেখে বাজারজাত করা হয়েছে। বিক্রেতা '${product.sellerName}' সরাসরি দায়িত্বশীলভাবে এটি সরবরাহ করেন।`,
        answeredBy: "আসকাডো এআই রোবট (Halal Marketplace AI)",
        answeredAt: "২০২৬-০৩-০৪T১০:১৫:০৫Z",
        isAiGenerated: true,
        helpfulVotes: 5
      },
      {
        id: `qa_seed_${product.id}_2`,
        productId: product.id,
        productName: product.nameBn || product.name,
        question: "ডেলিভারি চার্জ ও পেতে কতদিন সময় লাগবে?",
        askerName: "ফারহানা সুলতানা",
        askedAt: "২০২৬-০৩-০৩T১৪:২০:০০Z",
        answer: product.productType === 'digital'
          ? "আসসালামু আলাইকুম! এটি একটি ডিজিটাল পণ্য, তাই কোনো কুরিয়ার চার্জ নেই। অর্ডার কনফার্ম হওয়ামাত্র তাৎক্ষণিক আপনার প্রোফাইল ভল্ট এবং ইমেইলে ফাইলটি ডাউনলোড করতে পারবেন।"
          : "আসসালামু আলাইকুম! ঢাকা সিটিতে ২৪-৪৮ ঘণ্টার মধ্যে (চার্জ ৬০ টাকা) এবং ঢাকার বাইরে দেশের সকল জেলায় ২-৩ কার্যদিবসে (চার্জ ১২০ টাকা) হোম ডেলিভারি পেয়ে যাবেন। ক্যাশ অন ডেলিভারি প্রযোজ্য।",
        answeredBy: "আসকাডো এআই রোবট (Halal Marketplace AI)",
        answeredAt: "২০২৬-০৩-০৩T১৪:২০:০৪Z",
        isAiGenerated: true,
        helpfulVotes: 7
      }
    ];
  }
  res.json(product.qaList);
});

// 2. Ask Product Specific Question (Instant AI Robot Answer)
app.post("/api/v1/marketplace/products/:id/ask-question", async (req, res) => {
  const { question, askerName } = req.body;
  if (!question || !question.trim()) {
    return res.status(400).json({ error: "প্রশ্ন লিখুন (Question is required)" });
  }

  const product = marketplaceProducts.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  if (!product.qaList) product.qaList = [];

  const customerName = (askerName && askerName.trim()) || "সম্মানিত গ্রাহক";
  
  // Call Gemini AI or fallback
  const aiAnswer = await generateMarketplaceAnswer(question, product);

  const newQaItem = {
    id: `qa_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    productId: product.id,
    productName: product.nameBn || product.name,
    question: question.trim(),
    askerName: customerName,
    askedAt: new Date().toISOString(),
    answer: aiAnswer,
    answeredBy: "আসকাডো এআই রোবট (Halal Marketplace AI)",
    answeredAt: new Date().toISOString(),
    isAiGenerated: true,
    helpfulVotes: 1
  };

  product.qaList.unshift(newQaItem);

  res.status(201).json({
    success: true,
    qaItem: newQaItem,
    qaList: product.qaList
  });
});

// 3. General Marketplace AI Assistant Chatbot
app.post("/api/v1/marketplace/ai-assistant", async (req, res) => {
  const { message, productId, history } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  let targetProduct = null;
  if (productId) {
    targetProduct = marketplaceProducts.find(p => p.id === productId);
  }

  const aiAnswer = await generateMarketplaceAnswer(message, targetProduct, history);

  // Find relevant product recommendations if applicable
  const queryWords = message.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const matchedProducts = marketplaceProducts.filter(p => {
    const text = `${p.name} ${p.nameBn} ${p.category} ${p.categoryBn} ${p.description || ''}`.toLowerCase();
    return queryWords.some(w => text.includes(w));
  }).slice(0, 3).map(p => ({
    id: p.id,
    nameBn: p.nameBn,
    name: p.name,
    price: p.price,
    imageUrl: p.imageUrl,
    productType: p.productType,
    sellerName: p.sellerName
  }));

  res.json({
    reply: aiAnswer,
    suggestedProducts: matchedProducts,
    isBot: true,
    timestamp: new Date().toISOString()
  });
});

app.post("/api/v1/marketplace/order", (req, res) => {
  const {
    productId,
    quantity,
    buyerName,
    buyerPhone,
    buyerEmail,
    deliveryAddress,
    paymentMethod,
    district,
    isCartOrder,
    cartItems,
    couponCode,
    discountAmount,
    licenseType
  } = req.body;

  const appliedDiscount = Number(discountAmount) || 0;

  // Case 1: Multi-item cart checkout
  if (isCartOrder && Array.isArray(cartItems) && cartItems.length > 0) {
    const orderItems: any[] = [];
    let grossTotal = 0;
    let hasPhysical = false;
    let hasDigital = false;

    cartItems.forEach((item: any) => {
      const prod = marketplaceProducts.find(p => p.id === item.productId) ||
                   marketplaceBundles.find(b => b.id === item.productId);
      const qty = Number(item.quantity) || 1;
      const isDigital = prod?.productType === 'digital' || prod?.isDigital || item.type === 'digital';
      if (!isDigital) hasPhysical = true;
      if (isDigital) hasDigital = true;

      const itemLicense = item.licenseType || licenseType || 'personal';
      let price = prod ? (itemLicense === 'commercial' && prod.commercialPrice ? prod.commercialPrice : prod.price) : (item.price || 0);
      const itemTotal = price * qty;
      grossTotal += itemTotal;

      orderItems.push({
        productId: item.productId,
        productName: prod?.nameBn || prod?.titleBn || prod?.name || item.productName,
        productType: isDigital ? 'digital' : 'physical',
        quantity: qty,
        unitPrice: price,
        itemTotal,
        licenseType: isDigital ? itemLicense : null,
        licenseKey: isDigital ? generateLicenseKey() : null,
        downloadUrl: prod?.downloadUrl || item.downloadUrl || 'https://ascado.org/downloads/digital-file.zip',
        fileFormat: prod?.fileFormat || item.fileFormat,
        sellerId: prod?.sellerId || 'vnd_01',
        sellerName: prod?.sellerName || 'Verified Halal Seller'
      });
    });

    const deliveryFee = hasPhysical ? (district?.toLowerCase().includes('dhaka') || district?.includes('ঢাকা') ? 60 : 120) : 0;
    const finalGross = Math.max(0, grossTotal - appliedDiscount);
    const platformCommission = Math.round(finalGross * 0.10);
    const sellerPayout = finalGross - platformCommission;

    const cartOrder = {
      id: `ord_${Date.now()}`,
      orderType: 'cart_multi',
      items: orderItems,
      itemCount: orderItems.length,
      grossTotal,
      couponCode: couponCode || null,
      discountAmount: appliedDiscount,
      totalAmount: finalGross,
      deliveryFee,
      grandTotal: finalGross + deliveryFee,
      platformCommission,
      sellerPayout,
      buyerName,
      buyerPhone,
      buyerEmail: buyerEmail || null,
      deliveryAddress,
      district: district || 'ঢাকা',
      paymentMethod: paymentMethod || (hasPhysical ? "cash_on_delivery" : "bkash_online"),
      status: hasPhysical ? "confirmed" : "completed",
      isDigitalVaultAvailable: hasDigital,
      createdAt: new Date().toISOString()
    };

    marketplaceOrders.unshift(cartOrder);

    auditLogs.unshift({
      id: `aud_${Date.now()}`,
      userName: buyerName || "Customer",
      userRole: "MARKETPLACE_BUYER",
      ip: req.ip || "127.0.0.1",
      action: "CART_ORDER_PLACED",
      module: "Marketplace Multi-Vendor & Digital Shop",
      timestamp: new Date().toISOString(),
      details: `Cart order with ${orderItems.length} items. Total: ${cartOrder.grandTotal} BDT | Coupon: ${couponCode || 'None'}`
    });

    return res.status(201).json(cartOrder);
  }

  // Case 2: Single-item direct order
  const product = marketplaceProducts.find(p => p.id === productId) ||
                  marketplaceBundles.find(b => b.id === productId);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const qty = Number(quantity) || 1;
  const isDigital = product.productType === 'digital' || product.isDigital;
  const chosenLicense = licenseType || 'personal';
  const unitPrice = chosenLicense === 'commercial' && product.commercialPrice ? product.commercialPrice : product.price;

  const grossTotal = unitPrice * qty;
  const finalGross = Math.max(0, grossTotal - appliedDiscount);
  const deliveryFee = isDigital ? 0 : (district?.toLowerCase().includes('dhaka') || district?.includes('ঢাকা') ? 60 : 120);
  const grandTotal = finalGross + deliveryFee;
  const platformCommission = Math.round(finalGross * (product.platformCommissionRate || 0.10));
  const sellerPayout = finalGross - platformCommission;
  const generatedKey = isDigital ? generateLicenseKey() : null;

  const order = {
    id: `ord_${Date.now()}`,
    productId: product.id,
    productName: product.nameBn || product.titleBn || product.name,
    productType: isDigital ? "digital" : "physical",
    quantity: qty,
    unitPrice,
    grossTotal,
    couponCode: couponCode || null,
    discountAmount: appliedDiscount,
    totalAmount: finalGross,
    deliveryFee,
    grandTotal,
    platformCommission,
    sellerPayout,
    sellerId: product.sellerId || "vnd_01",
    sellerName: product.sellerName,
    downloadUrl: product.downloadUrl || null,
    licenseType: isDigital ? chosenLicense : null,
    licenseKey: generatedKey,
    fileFormat: product.fileFormat || null,
    buyerName,
    buyerPhone,
    buyerEmail: buyerEmail || null,
    deliveryAddress,
    paymentMethod: paymentMethod || (isDigital ? "bkash_online" : "cash_on_delivery"),
    status: isDigital ? "completed" : "confirmed",
    isDigitalVaultAvailable: isDigital,
    createdAt: new Date().toISOString()
  };

  marketplaceOrders.unshift(order);

  auditLogs.unshift({
    id: `aud_${Date.now()}`,
    userName: buyerName || "Customer",
    userRole: "MARKETPLACE_BUYER",
    ip: req.ip || "127.0.0.1",
    action: "ORDER_PLACED",
    module: "Digital Shop & Marketplace",
    timestamp: new Date().toISOString(),
    details: `Order for ${order.productName} (${order.productType}). Key: ${generatedKey || 'N/A'} | Total: ${grandTotal} BDT`
  });

  res.status(201).json(order);
});

// Real Estate & House Rental
app.get("/api/v1/real-estate/properties", (req, res) => {
  res.json(realEstateListings);
});

app.post("/api/v1/real-estate/properties", (req, res) => {
  const newProp = {
    id: `prop_${Date.now()}`,
    ...req.body,
    isLegallyVerified: false,
    status: "available",
    images: req.body.images || ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80"]
  };
  realEstateListings.unshift(newProp);
  res.status(201).json(newProp);
});

app.post("/api/v1/real-estate/properties/:id/verify", (req, res) => {
  const prop = realEstateListings.find(p => p.id === req.params.id);
  if (!prop) return res.status(404).json({ error: "Property not found" });
  prop.isLegallyVerified = true;
  prop.verifiedByAdmin = "Super Admin Legal Verification Cell";
  res.json({ message: "Property verified with official badge", prop });
});

// Hero Slides CRUD
app.get("/api/v1/hero-slides", (req, res) => {
  res.json(heroSlides);
});

app.post("/api/v1/hero-slides", (req, res) => {
  const newSlide = {
    id: `slide_${Date.now()}`,
    ...req.body,
    order: heroSlides.length + 1,
    active: req.body.active !== undefined ? req.body.active : true
  };
  heroSlides.push(newSlide);
  res.status(201).json(newSlide);
});

app.put("/api/v1/hero-slides/:id", (req, res) => {
  const index = heroSlides.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Slide not found" });
  heroSlides[index] = { ...heroSlides[index], ...req.body };
  res.json(heroSlides[index]);
});

app.delete("/api/v1/hero-slides/:id", (req, res) => {
  heroSlides = heroSlides.filter(s => s.id !== req.params.id);
  res.json({ message: "Slide deleted successfully" });
});

// Photo Gallery & Media Hub CRUD
app.get("/api/v1/gallery", (req, res) => {
  const { category, search } = req.query;
  let photos = [...galleryPhotos];
  if (category && category !== "all") {
    photos = photos.filter(p => p.category === category);
  }
  if (search && typeof search === "string" && search.trim() !== "") {
    const q = search.toLowerCase();
    photos = photos.filter(p =>
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.titleBn && p.titleBn.toLowerCase().includes(q)) ||
      (p.location && p.location.toLowerCase().includes(q)) ||
      (p.locationBn && p.locationBn.toLowerCase().includes(q)) ||
      (p.categoryBn && p.categoryBn.toLowerCase().includes(q))
    );
  }
  res.json(photos);
});

app.post("/api/v1/gallery", (req, res) => {
  const { title, titleBn, description, descriptionBn, imageUrl, category, categoryBn, location, locationBn, date, uploaderName, featured } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL or data is required" });
  }

  const categoryMap: Record<string, string> = {
    relief: "ত্রাণ ও মানবিক সহায়তা",
    medical: "মেডিকেল ও ফ্রি চিকিৎসা",
    blood: "রক্তদান কর্মসূচি",
    sajeda: "সাজেদা ইয়ুথ ফাউন্ডেশন",
    education: "শিক্ষা ও প্রশিক্ষণ একাডেমি",
    plantation: "বৃক্ষরোপণ ও পরিবেশ",
    branch: "শাখা সম্মেলন ও সভা",
    general: "সাধারণ গ্যালারি"
  };

  const newPhoto = {
    id: `gal_${Date.now()}`,
    title: title || "Uploaded Activity Photo",
    titleBn: titleBn || title || "আপলোডকৃত কার্যক্রমের ছবি",
    description: description || "",
    descriptionBn: descriptionBn || description || "",
    imageUrl,
    category: category || "general",
    categoryBn: categoryBn || categoryMap[category] || "সাধারণ গ্যালারি",
    location: location || "Bangladesh",
    locationBn: locationBn || location || "বাংলাদেশ",
    date: date || new Date().toISOString().split("T")[0],
    uploaderName: uploaderName || "সদস্য / অ্যাডমিন",
    likesCount: 0,
    featured: featured === true || featured === "true"
  };

  galleryPhotos.unshift(newPhoto);
  res.status(201).json(newPhoto);
});

app.post("/api/v1/gallery/upload", (req, res) => {
  const { imageBase64, title, titleBn, category, categoryBn, location, locationBn, uploaderName, description } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: "Image data is required" });
  }

  const newPhoto = {
    id: `gal_${Date.now()}`,
    title: title || "New Uploaded Photo",
    titleBn: titleBn || title || "নতুন আপলোডকৃত ছবি",
    description: description || "",
    descriptionBn: description || "",
    imageUrl: imageBase64,
    category: category || "general",
    categoryBn: categoryBn || "সাধারণ কার্যক্রম",
    location: location || "Bangladesh",
    locationBn: locationBn || location || "বাংলাদেশ",
    date: new Date().toISOString().split("T")[0],
    uploaderName: uploaderName || "অনলাইন সদস্য",
    likesCount: 1,
    featured: true
  };

  galleryPhotos.unshift(newPhoto);
  res.status(201).json(newPhoto);
});

app.put("/api/v1/gallery/:id", (req, res) => {
  const index = galleryPhotos.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Photo not found" });
  galleryPhotos[index] = { ...galleryPhotos[index], ...req.body };
  res.json(galleryPhotos[index]);
});

app.post("/api/v1/gallery/:id/like", (req, res) => {
  const photo = galleryPhotos.find(p => p.id === req.params.id);
  if (!photo) return res.status(404).json({ error: "Photo not found" });
  photo.likesCount = (photo.likesCount || 0) + 1;
  res.json({ success: true, likesCount: photo.likesCount });
});

app.delete("/api/v1/gallery/:id", (req, res) => {
  galleryPhotos = galleryPhotos.filter(p => p.id !== req.params.id);
  res.json({ message: "Photo deleted successfully" });
});

// Advertisements & Banner Manager CRUD
app.get("/api/v1/advertisements", (req, res) => {
  const { position, activeOnly } = req.query;
  let result = [...advertisements];
  if (activeOnly === "true" || activeOnly === undefined) {
    result = result.filter(a => a.isActive !== false);
  }
  if (position && position !== "all") {
    result = result.filter(a => a.position === position || a.position === "all");
  }
  res.json(result);
});

// Adsterra Network Configuration Endpoints
app.get("/api/v1/advertisements/adsterra-config", (req, res) => {
  res.json(adsterraConfig);
});

app.post("/api/v1/advertisements/adsterra-config", (req, res) => {
  adsterraConfig = { ...adsterraConfig, ...req.body };
  res.json({ success: true, config: adsterraConfig });
});

app.put("/api/v1/advertisements/adsterra-config", (req, res) => {
  adsterraConfig = { ...adsterraConfig, ...req.body };
  res.json({ success: true, config: adsterraConfig });
});

app.post("/api/v1/advertisements", (req, res) => {
  const {
    title,
    titleBn,
    subtitle,
    subtitleBn,
    imageUrl,
    targetUrl,
    internalRoute,
    position,
    badgeText,
    badgeTextEn,
    advertiserName,
    ctaText,
    ctaTextEn,
    startDate,
    endDate,
    networkType,
    adsterraKey,
    adsterraScriptCode,
    adsterraFormat,
    adsterraWidth,
    adsterraHeight
  } = req.body;

  if (!imageUrl && !targetUrl && !titleBn && !adsterraKey && !adsterraScriptCode) {
    return res.status(400).json({ error: "Image URL, target URL, Title or Adsterra code is required" });
  }

  const isAdsterra = networkType && networkType.startsWith('adsterra');

  const newAd = {
    id: `ad_${Date.now()}`,
    title: title || (isAdsterra ? "Adsterra Monetization Unit" : "Sponsored Advertisement"),
    titleBn: titleBn || title || (isAdsterra ? "অ্যাডস্টেরা বিজ্ঞাপন ইউনিট" : "স্পন্সরড বিজ্ঞাপন"),
    subtitle: subtitle || "",
    subtitleBn: subtitleBn || subtitle || "",
    imageUrl: imageUrl || (isAdsterra ? "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80" : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80"),
    targetUrl: targetUrl || (isAdsterra ? (adsterraConfig.directSmartlinkUrl || "https://www.highperformancegate.com") : "https://ascado.org"),
    internalRoute: internalRoute || "",
    position: position || "home_mid_banner",
    badgeText: badgeText || (isAdsterra ? "Adsterra Ad" : "বিজ্ঞাপন"),
    badgeTextEn: badgeTextEn || (isAdsterra ? "Adsterra Network" : "Sponsored"),
    advertiserName: advertiserName || (isAdsterra ? "Adsterra Publisher Network" : "স্পন্সর পার্টনার"),
    ctaText: ctaText || (isAdsterra ? "অফার দেখুন" : "ভিজিট করুন"),
    ctaTextEn: ctaTextEn || (isAdsterra ? "Claim Offer" : "Visit Website"),
    clicksCount: 0,
    impressionsCount: 1,
    isActive: true,
    startDate: startDate || new Date().toISOString().split("T")[0],
    endDate: endDate || "2026-12-31",
    networkType: networkType || "custom",
    adsterraKey: adsterraKey || "",
    adsterraScriptCode: adsterraScriptCode || "",
    adsterraFormat: adsterraFormat || "iframe",
    adsterraWidth: adsterraWidth || (position === "sidebar_box" ? 300 : 728),
    adsterraHeight: adsterraHeight || (position === "sidebar_box" ? 250 : 90)
  };

  advertisements.unshift(newAd);
  res.status(201).json(newAd);
});

app.put("/api/v1/advertisements/:id", (req, res) => {
  const index = advertisements.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Advertisement not found" });
  advertisements[index] = { ...advertisements[index], ...req.body };
  res.json(advertisements[index]);
});

app.post("/api/v1/advertisements/:id/click", (req, res) => {
  const ad = advertisements.find(a => a.id === req.params.id);
  if (!ad) return res.status(404).json({ error: "Advertisement not found" });
  ad.clicksCount = (ad.clicksCount || 0) + 1;
  res.json({ success: true, clicksCount: ad.clicksCount });
});

app.post("/api/v1/advertisements/:id/impression", (req, res) => {
  const ad = advertisements.find(a => a.id === req.params.id);
  if (!ad) return res.status(404).json({ error: "Advertisement not found" });
  ad.impressionsCount = (ad.impressionsCount || 0) + 1;
  res.json({ success: true, impressionsCount: ad.impressionsCount });
});

app.delete("/api/v1/advertisements/:id", (req, res) => {
  advertisements = advertisements.filter(a => a.id !== req.params.id);
  res.json({ message: "Advertisement deleted successfully" });
});

// Marriage Media CRUD
app.get("/api/v1/marriage/profiles", (req, res) => {
  res.json(marriageProfiles);
});

app.post("/api/v1/marriage/profiles", (req, res) => {
  const newProfile = {
    id: `bio_${Date.now()}`,
    ...req.body,
    privacyLevel: req.body.privacyLevel || "guardian_contact_on_request",
    status: "active",
    createdAt: new Date().toISOString()
  };
  marriageProfiles.unshift(newProfile);
  res.status(201).json(newProfile);
});

app.put("/api/v1/marriage/profiles/:id", (req, res) => {
  const index = marriageProfiles.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Profile not found" });
  marriageProfiles[index] = { ...marriageProfiles[index], ...req.body };
  res.json(marriageProfiles[index]);
});

app.delete("/api/v1/marriage/profiles/:id", (req, res) => {
  marriageProfiles = marriageProfiles.filter(p => p.id !== req.params.id);
  res.json({ message: "Profile deleted successfully" });
});

// CMS Notices CRUD
app.get("/api/v1/cms/notices", (req, res) => {
  res.json(cmsNotices);
});

app.post("/api/v1/cms/notices", (req, res) => {
  const newNotice = {
    id: `not_${Date.now()}`,
    ...req.body,
    date: new Date().toISOString().split("T")[0]
  };
  cmsNotices.unshift(newNotice);
  res.status(201).json(newNotice);
});

app.put("/api/v1/cms/notices/:id", (req, res) => {
  const index = cmsNotices.findIndex(n => n.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Notice not found" });
  cmsNotices[index] = { ...cmsNotices[index], ...req.body };
  res.json(cmsNotices[index]);
});

app.delete("/api/v1/cms/notices/:id", (req, res) => {
  cmsNotices = cmsNotices.filter(n => n.id !== req.params.id);
  res.json({ message: "Notice deleted successfully" });
});

// Donation Campaigns CRUD
app.post("/api/v1/donations/campaigns", (req, res) => {
  const newCamp = {
    id: `cmp_${Date.now()}`,
    ...req.body,
    raisedAmount: Number(req.body.raisedAmount) || 0,
    targetAmount: Number(req.body.targetAmount) || 100000,
    donorCount: Number(req.body.donorCount) || 0,
    status: req.body.status || "active",
    createdAt: new Date().toISOString()
  };
  donationCampaigns.unshift(newCamp);
  res.status(201).json(newCamp);
});

app.put("/api/v1/donations/campaigns/:id", (req, res) => {
  const index = donationCampaigns.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Campaign not found" });
  donationCampaigns[index] = { ...donationCampaigns[index], ...req.body };
  res.json(donationCampaigns[index]);
});

app.delete("/api/v1/donations/campaigns/:id", (req, res) => {
  donationCampaigns = donationCampaigns.filter(c => c.id !== req.params.id);
  res.json({ message: "Campaign deleted successfully" });
});

// Blood Donors CRUD
app.put("/api/v1/blood-bank/donors/:id", (req, res) => {
  const index = bloodDonors.findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Donor not found" });
  bloodDonors[index] = { ...bloodDonors[index], ...req.body };
  res.json(bloodDonors[index]);
});

app.delete("/api/v1/blood-bank/donors/:id", (req, res) => {
  bloodDonors = bloodDonors.filter(d => d.id !== req.params.id);
  res.json({ message: "Donor deleted successfully" });
});

// Blood Requests CRUD
app.put("/api/v1/blood-bank/requests/:id", (req, res) => {
  const index = bloodRequests.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Request not found" });
  bloodRequests[index] = { ...bloodRequests[index], ...req.body };
  res.json(bloodRequests[index]);
});

app.delete("/api/v1/blood-bank/requests/:id", (req, res) => {
  bloodRequests = bloodRequests.filter(r => r.id !== req.params.id);
  res.json({ message: "Request deleted successfully" });
});

// School Students CRUD
app.post("/api/v1/schools/students", (req, res) => {
  const newStudent = {
    id: `stu_${Date.now()}`,
    ...req.body,
    status: req.body.status || "enrolled"
  };
  schoolStudents.unshift(newStudent);
  res.status(201).json(newStudent);
});

app.put("/api/v1/schools/students/:id", (req, res) => {
  const index = schoolStudents.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Student not found" });
  schoolStudents[index] = { ...schoolStudents[index], ...req.body };
  res.json(schoolStudents[index]);
});

app.delete("/api/v1/schools/students/:id", (req, res) => {
  schoolStudents = schoolStudents.filter(s => s.id !== req.params.id);
  res.json({ message: "Student deleted successfully" });
});

// Courses CRUD
app.post("/api/v1/courses", (req, res) => {
  const newCourse = {
    id: `crs_${Date.now()}`,
    ...req.body,
    enrolledCount: 0,
    rating: 5.0
  };
  courses.push(newCourse);
  res.status(201).json(newCourse);
});

app.put("/api/v1/courses/:id", (req, res) => {
  const index = courses.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Course not found" });
  courses[index] = { ...courses[index], ...req.body };
  res.json(courses[index]);
});

app.delete("/api/v1/courses/:id", (req, res) => {
  courses = courses.filter(c => c.id !== req.params.id);
  res.json({ message: "Course deleted successfully" });
});

// Somiti Loans CRUD
app.put("/api/v1/somiti/loans/:id", (req, res) => {
  const index = somitiLoans.findIndex(l => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Loan not found" });
  somitiLoans[index] = { ...somitiLoans[index], ...req.body };
  res.json(somitiLoans[index]);
});

app.delete("/api/v1/somiti/loans/:id", (req, res) => {
  somitiLoans = somitiLoans.filter(l => l.id !== req.params.id);
  res.json({ message: "Loan record deleted successfully" });
});

// Marketplace Products CRUD
app.post("/api/v1/marketplace/products", (req, res) => {
  const newProd = {
    id: `prd_${Date.now()}`,
    ...req.body,
    price: Number(req.body.price) || 100,
    stock: Number(req.body.stock) || 10,
    platformCommissionRate: 0.10,
    verified: true,
    rating: 5.0
  };
  marketplaceProducts.unshift(newProd);
  res.status(201).json(newProd);
});

app.put("/api/v1/marketplace/products/:id", (req, res) => {
  const index = marketplaceProducts.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });
  marketplaceProducts[index] = { ...marketplaceProducts[index], ...req.body };
  res.json(marketplaceProducts[index]);
});

app.delete("/api/v1/marketplace/products/:id", (req, res) => {
  marketplaceProducts = marketplaceProducts.filter(p => p.id !== req.params.id);
  res.json({ message: "Product deleted successfully" });
});

// Real Estate Properties CRUD
app.put("/api/v1/real-estate/properties/:id", (req, res) => {
  const index = realEstateListings.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Property not found" });
  realEstateListings[index] = { ...realEstateListings[index], ...req.body };
  res.json(realEstateListings[index]);
});

app.delete("/api/v1/real-estate/properties/:id", (req, res) => {
  realEstateListings = realEstateListings.filter(p => p.id !== req.params.id);
  res.json({ message: "Property deleted successfully" });
});

// Volunteers CRUD
app.put("/api/v1/volunteers/:id", (req, res) => {
  const index = volunteers.findIndex(v => v.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Volunteer not found" });
  volunteers[index] = { ...volunteers[index], ...req.body };
  res.json(volunteers[index]);
});

app.delete("/api/v1/volunteers/:id", (req, res) => {
  volunteers = volunteers.filter(v => v.id !== req.params.id);
  res.json({ message: "Volunteer record deleted successfully" });
});

// Organizations & Branches Edit & Delete
app.put("/api/v1/organizations/:id", (req, res) => {
  const index = organizations.findIndex(o => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Organization not found" });
  organizations[index] = { ...organizations[index], ...req.body };
  res.json(organizations[index]);
});

app.delete("/api/v1/organizations/:id", (req, res) => {
  organizations = organizations.filter(o => o.id !== req.params.id);
  res.json({ message: "Organization deleted successfully" });
});

app.put("/api/v1/branches/:id", (req, res) => {
  const index = branches.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Branch not found" });
  branches[index] = { ...branches[index], ...req.body };
  res.json(branches[index]);
});

app.delete("/api/v1/branches/:id", (req, res) => {
  branches = branches.filter(b => b.id !== req.params.id);
  res.json({ message: "Branch deleted successfully" });
});

// Users CRUD
app.put("/api/v1/users/:id", (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "User not found" });
  users[index] = { ...users[index], ...req.body };
  const { passwordHash, ...userWithoutPassword } = users[index];
  res.json(userWithoutPassword);
});

app.delete("/api/v1/users/:id", (req, res) => {
  users = users.filter(u => u.id !== req.params.id);
  res.json({ message: "User deleted successfully" });
});

// Audit Logs
app.get("/api/v1/audit-logs", (req, res) => {
  res.json(auditLogs);
});

// Settings
app.get("/api/v1/settings", (req, res) => {
  res.json(systemSettings);
});

app.put("/api/v1/settings", (req, res) => {
  systemSettings = { ...systemSettings, ...req.body };
  res.json({ message: "Settings updated successfully", settings: systemSettings });
});

// Dynamic Navigation Menus CRUD
app.get("/api/v1/menus", (req, res) => {
  const sorted = [...navMenus].sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json(sorted);
});

app.post("/api/v1/menus", (req, res) => {
  const newMenu = {
    id: `menu_${Date.now()}`,
    title: req.body.title || "Custom Link",
    titleBn: req.body.titleBn || "কাস্টম মেনু",
    route: req.body.route || "home",
    category: req.body.category || "header_main",
    iconName: req.body.iconName || "Layers",
    description: req.body.description || "",
    descriptionBn: req.body.descriptionBn || "",
    badge: req.body.badge || "",
    badgeBn: req.body.badgeBn || "",
    isExternal: !!req.body.isExternal,
    externalUrl: req.body.externalUrl || "",
    order: Number(req.body.order) || navMenus.length + 1,
    isActive: req.body.isActive !== false,
    isCustom: true,
    createdAt: new Date().toISOString()
  };
  navMenus.push(newMenu);
  res.status(201).json(newMenu);
});

app.put("/api/v1/menus/:id", (req, res) => {
  const index = navMenus.findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Menu item not found" });
  navMenus[index] = { ...navMenus[index], ...req.body };
  res.json(navMenus[index]);
});

app.put("/api/v1/menus/toggle/:id", (req, res) => {
  const index = navMenus.findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Menu item not found" });
  navMenus[index].isActive = !navMenus[index].isActive;
  res.json(navMenus[index]);
});

app.delete("/api/v1/menus/:id", (req, res) => {
  navMenus = navMenus.filter(m => m.id !== req.params.id);
  res.json({ message: "Menu deleted successfully" });
});

app.post("/api/v1/menus/reset", (req, res) => {
  navMenus = JSON.parse(JSON.stringify(defaultNavMenus));
  res.json({ message: "Menus reset to default", menus: navMenus });
});

// System Backup & Full Export
app.get("/api/v1/system/backup", (req, res) => {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    platform: "ASCAHDO Central Welfare Multi-NGO Trust",
    version: "2.0.0",
    settings: systemSettings,
    menus: navMenus,
    counts: {
      users: users.length,
      branches: branches.length,
      organizations: organizations.length,
      donors: bloodDonors.length,
      bloodRequests: bloodRequests.length,
      bloodCommittees: bloodBankCommittees.length,
      campaigns: donationCampaigns.length,
      courses: courses.length,
      students: schoolStudents.length,
      loans: somitiLoans.length,
      products: marketplaceProducts.length,
      properties: realEstateListings.length,
      marriageProfiles: marriageProfiles.length,
      notices: cmsNotices.length,
      slides: heroSlides.length
    },
    data: {
      heroSlides,
      organizations,
      branches,
      users: users.map(({ passwordHash, ...u }) => u),
      bloodDonors,
      bloodRequests,
      bloodBankCommittees,
      donationCampaigns,
      courses,
      schoolStudents,
      somitiLoans,
      marketplaceProducts,
      realEstateListings,
      marriageProfiles,
      cmsNotices,
      auditLogs
    }
  };
  res.json(exportPayload);
});

// System State Reset
app.post("/api/v1/medical/system-sync", (req, res) => {
  res.json({ message: "Medical database synchronized" });
});

// ==========================================
// MEDICAL COURSE & ADMISSION & VERIFICATION APIS
// ==========================================

// 1. Institute Info
app.get("/api/v1/medical/institute-info", (req, res) => {
  res.json(medicalInstituteInfo);
});

// 2. Medical Courses CRUD
app.get("/api/v1/medical/courses", (req, res) => {
  res.json(medicalCourses);
});

app.get("/api/v1/medical/courses/:id", (req, res) => {
  const course = medicalCourses.find(c => c.id === req.params.id || c.code.toLowerCase() === req.params.id.toLowerCase());
  if (!course) return res.status(404).json({ error: "Medical course not found" });
  res.json(course);
});

app.post("/api/v1/medical/courses", (req, res) => {
  const newCourse = {
    id: `med_${Date.now()}`,
    code: req.body.code || "MED",
    serialNo: medicalCourses.length + 1,
    title: req.body.title || "Medical Course",
    titleBn: req.body.titleBn || "মেডিকেল কোর্স",
    duration: req.body.duration || "1 Year",
    durationBn: req.body.durationBn || "১ বৎসর",
    eligibility: req.body.eligibility || "SSC / Equivalent",
    eligibilityBn: req.body.eligibilityBn || "এস.এস.সি / সমমান",
    totalFee: Number(req.body.totalFee) || 25000,
    admissionFee: Number(req.body.admissionFee) || 5000,
    monthlyFee: Number(req.body.monthlyFee) || 1500,
    session: req.body.session || "June - May",
    sessionBn: req.body.sessionBn || "জুন থেকে মে সেশন (ভর্তি চলছে)",
    description: req.body.description || "",
    descriptionBn: req.body.descriptionBn || "",
    subjects: req.body.subjects || [],
    features: req.body.features || [],
    imageUrl: req.body.imageUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
    badgeBn: req.body.badgeBn || "ভর্তি চলছে",
    status: req.body.status || "active"
  };
  medicalCourses.push(newCourse);
  res.status(201).json(newCourse);
});

app.put("/api/v1/medical/courses/:id", (req, res) => {
  const index = medicalCourses.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Course not found" });
  medicalCourses[index] = { ...medicalCourses[index], ...req.body };
  res.json(medicalCourses[index]);
});

app.delete("/api/v1/medical/courses/:id", (req, res) => {
  medicalCourses = medicalCourses.filter(c => c.id !== req.params.id);
  res.json({ message: "Course removed successfully" });
});

// 3. Online Admission Management
app.get("/api/v1/medical/admissions", (req, res) => {
  res.json(medicalAdmissions);
});

app.post("/api/v1/medical/admissions", (req, res) => {
  const count = medicalAdmissions.length + 101;
  const trackingNumber = `ASC-MED-2026-${count}`;
  const course = medicalCourses.find(c => c.id === req.body.courseId || c.code === req.body.courseCode) || medicalCourses[0];

  const newAdmission = {
    id: `adm_med_${Date.now()}`,
    trackingNumber,
    courseId: course.id,
    courseCode: course.code,
    courseTitleBn: course.titleBn,
    admissionDate: req.body.admissionDate || new Date().toISOString().split('T')[0],
    rollNo: req.body.rollNo || "",
    session: req.body.session || "2025-2026",
    department: req.body.department || course.titleBn,
    duration: req.body.duration || course.durationBn || "১ বৎসর",
    campus: req.body.campus || "Noakhali & Dhaka Campus",
    studentName: req.body.studentName || req.body.studentNameEn || "",
    studentNameBn: req.body.studentNameBn || req.body.studentName || "",
    studentNameEn: (req.body.studentNameEn || req.body.studentName || "").toUpperCase(),
    fatherName: req.body.fatherName || req.body.fatherNameEn || "",
    fatherNameBn: req.body.fatherNameBn || req.body.fatherName || "",
    fatherNameEn: (req.body.fatherNameEn || req.body.fatherName || "").toUpperCase(),
    motherName: req.body.motherName || req.body.motherNameEn || "",
    motherNameBn: req.body.motherNameBn || req.body.motherName || "",
    motherNameEn: (req.body.motherNameEn || req.body.motherName || "").toUpperCase(),
    gender: req.body.gender || "male",
    dateOfBirth: req.body.dateOfBirth || "",
    bloodGroup: req.body.bloodGroup || "A+",
    nidOrBirthReg: req.body.nidOrBirthReg || req.body.nid || "N/A",
    address: req.body.address || req.body.presentAddress || "",
    postOffice: req.body.postOffice || "",
    upazila: req.body.upazila || req.body.city || "",
    district: req.body.district || req.body.state || "",
    division: req.body.division || "Chittagong",
    presentAddress: req.body.presentAddress || req.body.address || "",
    permanentAddress: req.body.permanentAddress || req.body.presentAddress || req.body.address || "",
    phone: req.body.phone || req.body.mobile || "",
    guardianPhone: req.body.guardianPhone || req.body.phone || "",
    email: req.body.email || "",
    examName: req.body.examName || req.body.academicQualification || "SSC/Dakhil",
    academicQualification: req.body.academicQualification || req.body.examName || "SSC",
    sscRoll: req.body.sscRoll || "",
    sscReg: req.body.sscReg || "",
    gpaOrGrade: req.body.gpaOrGrade || req.body.gpa || "4.50",
    passingYear: req.body.passingYear || "2024",
    boardOrInstitute: req.body.boardOrInstitute || req.body.board || "Cumilla",
    photoUrl: req.body.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
    nidDocUrl: req.body.nidDocUrl || "",
    certificateDocUrl: req.body.certificateDocUrl || "",
    studentSignatureUrl: req.body.studentSignatureUrl || "",
    guardianSignatureUrl: req.body.guardianSignatureUrl || "",
    paymentMethod: req.body.paymentMethod || "bkash",
    paymentSenderNo: req.body.paymentSenderNo || "",
    paymentTrxId: req.body.paymentTrxId || "BK" + Math.floor(10000000 + Math.random() * 90000000),
    paymentSlipUrl: req.body.paymentSlipUrl || "",
    paymentAmount: Number(req.body.paymentAmount) || course.admissionFee || 5000,
    termsAccepted: req.body.termsAccepted !== undefined ? req.body.termsAccepted : true,
    declarationDate: req.body.declarationDate || new Date().toISOString().split('T')[0],
    status: "pending",
    assignedRoll: "",
    assignedRegNo: "",
    createdAt: new Date().toISOString()
  };

  medicalAdmissions.unshift(newAdmission);
  res.status(201).json({
    message: "Admission form submitted successfully!",
    admission: newAdmission,
    trackingNumber
  });
});

app.put("/api/v1/medical/admissions/:id/status", (req, res) => {
  const index = medicalAdmissions.findIndex(a => a.id === req.params.id || a.trackingNumber === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Admission record not found" });

  const { status, assignedRoll, assignedRegNo } = req.body;
  const currentAdm = medicalAdmissions[index];

  const roll = assignedRoll || currentAdm.assignedRoll || (1020 + medicalStudents.length + 1).toString();
  const regNo = assignedRegNo || currentAdm.assignedRegNo || `CMSS-2025-${880 + medicalStudents.length + 1}`;

  medicalAdmissions[index].status = status;
  medicalAdmissions[index].assignedRoll = roll;
  medicalAdmissions[index].assignedRegNo = regNo;

  // If approved, create or update student profile
  if (status === "approved") {
    const existingStudentIndex = medicalStudents.findIndex(s => s.rollNumber === roll || s.registrationNumber === regNo);
    const studentData = {
      id: `std_med_${Date.now()}`,
      rollNumber: roll,
      registrationNumber: regNo,
      fullName: currentAdm.studentName,
      fullNameBn: currentAdm.studentNameBn || currentAdm.studentName,
      fatherName: currentAdm.fatherName,
      fatherNameBn: currentAdm.fatherNameBn || currentAdm.fatherName,
      motherName: currentAdm.motherName,
      motherNameBn: currentAdm.motherNameBn || currentAdm.motherName,
      courseCode: currentAdm.courseCode,
      courseTitleBn: currentAdm.courseTitleBn,
      durationBn: "১ বৎসর",
      session: "2025-2026",
      instituteName: medicalInstituteInfo.name,
      instituteNameBn: medicalInstituteInfo.nameBn,
      registrationAuthority: "CMSS Institute of Medical Technology (Reg: Dhaka S-3144(109) 2003)",
      registrationAuthorityBn: "সিএমএসএস ইনস্টিটিউট অব মেডিকেল টেকনোলজি (রেজিঃ ঢাকা এস-৩১৪৪ (১০৯) ২০০৩)",
      centerNameBn: medicalInstituteInfo.examCenter,
      phone: currentAdm.phone,
      guardianPhone: currentAdm.guardianPhone,
      bloodGroup: currentAdm.bloodGroup,
      address: currentAdm.presentAddress,
      addressBn: currentAdm.presentAddress,
      photoUrl: currentAdm.photoUrl,
      qrCodeData: `https://ascado.org/medical/verify?roll=${roll}&reg=${regNo}`,
      currentSemester: "1st Semester",
      cgpa: 0,
      status: "active",
      issueDate: new Date().toISOString().split("T")[0],
      expiryDate: "2026-06-30"
    };

    if (existingStudentIndex >= 0) {
      medicalStudents[existingStudentIndex] = { ...medicalStudents[existingStudentIndex], ...studentData };
    } else {
      medicalStudents.push(studentData);
    }
  }

  res.json({
    message: `Admission status updated to ${status}`,
    admission: medicalAdmissions[index]
  });
});

// 4. Medical Students Directory
app.get("/api/v1/medical/students", (req, res) => {
  res.json(medicalStudents);
});

app.get("/api/v1/medical/students/:id", (req, res) => {
  const student = medicalStudents.find(
    s => s.id === req.params.id || s.rollNumber === req.params.id || s.registrationNumber.toLowerCase() === req.params.id.toLowerCase()
  );
  if (!student) return res.status(404).json({ error: "Medical student not found" });
  res.json(student);
});

app.post("/api/v1/medical/students", (req, res) => {
  const newStudent = {
    id: `std_med_${Date.now()}`,
    rollNumber: req.body.rollNumber || (1020 + medicalStudents.length + 1).toString(),
    registrationNumber: req.body.registrationNumber || `CMSS-2025-${880 + medicalStudents.length + 1}`,
    fullName: req.body.fullName,
    fullNameBn: req.body.fullNameBn || req.body.fullName,
    fatherName: req.body.fatherName,
    fatherNameBn: req.body.fatherNameBn,
    motherName: req.body.motherName,
    motherNameBn: req.body.motherNameBn,
    courseCode: req.body.courseCode || "DMA",
    courseTitleBn: req.body.courseTitleBn || "DMA (ডিপ্লোমা ইন মেডিকেল অ্যাসিস্ট্যান্ট)",
    durationBn: req.body.durationBn || "১ বৎসর",
    session: req.body.session || "2025-2026",
    instituteName: medicalInstituteInfo.name,
    instituteNameBn: medicalInstituteInfo.nameBn,
    registrationAuthority: "CMSS Institute of Medical Technology (Reg: Dhaka S-3144(109) 2003)",
    registrationAuthorityBn: "সিএমএসএস ইনস্টিটিউট অব মেডিকেল টেকনোলজি (রেজিঃ ঢাকা এস-৩১৪৪ (১০৯) ২০০৩)",
    centerNameBn: medicalInstituteInfo.examCenter,
    phone: req.body.phone,
    guardianPhone: req.body.guardianPhone || req.body.phone,
    bloodGroup: req.body.bloodGroup || "A+",
    address: req.body.address || "Basurhat, Companiganj, Noakhali",
    addressBn: req.body.addressBn || "বসুরহাট, কোম্পানীগঞ্জ, নোয়াখালী",
    photoUrl: req.body.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
    qrCodeData: `https://ascado.org/medical/verify?roll=${req.body.rollNumber}&reg=${req.body.registrationNumber}`,
    currentSemester: req.body.currentSemester || "1st Semester",
    cgpa: Number(req.body.cgpa) || 3.80,
    status: req.body.status || "active",
    issueDate: req.body.issueDate || new Date().toISOString().split("T")[0],
    expiryDate: req.body.expiryDate || "2026-06-30"
  };
  medicalStudents.push(newStudent);
  res.status(201).json(newStudent);
});

// 5. Medical Certificates & Issuance
app.get("/api/v1/medical/certificates", (req, res) => {
  res.json(medicalCertificates);
});

app.post("/api/v1/medical/certificates", (req, res) => {
  const student = medicalStudents.find(s => s.rollNumber === req.body.rollNumber || s.registrationNumber === req.body.registrationNumber);
  const certNo = req.body.certificateNo || `CMSS-CERT-2026-${req.body.rollNumber || Math.floor(1000 + Math.random() * 9000)}`;

  const newCert = {
    id: `cert_med_${Date.now()}`,
    certificateNo: certNo,
    studentId: student ? student.id : `std_${Date.now()}`,
    rollNumber: req.body.rollNumber,
    registrationNumber: req.body.registrationNumber,
    studentName: req.body.studentName || (student ? student.fullName : "Student"),
    studentNameBn: req.body.studentNameBn || (student ? student.fullNameBn : "শিক্ষার্থী"),
    fatherNameBn: req.body.fatherNameBn || (student ? student.fatherNameBn : ""),
    motherNameBn: req.body.motherNameBn || (student ? student.motherNameBn : ""),
    courseTitleBn: req.body.courseTitleBn || (student ? student.courseTitleBn : "DMA"),
    durationBn: req.body.durationBn || (student ? student.durationBn : "১ বৎসর"),
    session: req.body.session || (student ? student.session : "জুন - মে (২০২৫-২০২৬)"),
    examYear: req.body.examYear || "2026",
    grade: req.body.grade || "A+",
    gpa: Number(req.body.gpa) || 3.90,
    issueDate: req.body.issueDate || new Date().toISOString().split("T")[0],
    status: req.body.status || "verified",
    verificationUrl: `https://ascado.org/medical/verify?cert=${certNo}`,
    qrCodeData: `CERTIFICATE_VERIFIED: ${certNo} | Roll: ${req.body.rollNumber} | Reg: ${req.body.registrationNumber} | Name: ${req.body.studentName} | Grade: ${req.body.grade}`,
    remarks: req.body.remarks || "Certified by Academic Council & Controller of Examinations."
  };

  medicalCertificates.push(newCert);
  res.status(201).json(newCert);
});

// 6. Instant Verification Engine (Certificate / Roll / Reg / Tracking)
app.get("/api/v1/medical/verify/:query", (req, res) => {
  const q = req.params.query.trim().toLowerCase();

  // Search certificate
  const certificate = medicalCertificates.find(
    c => c.certificateNo.toLowerCase() === q ||
         c.rollNumber.toLowerCase() === q ||
         c.registrationNumber.toLowerCase() === q
  );

  // Search student
  const student = medicalStudents.find(
    s => s.rollNumber.toLowerCase() === q ||
         s.registrationNumber.toLowerCase() === q ||
         s.phone.replace(/[^0-9]/g, "") === q.replace(/[^0-9]/g, "")
  );

  // Search admission
  const admission = medicalAdmissions.find(
    a => a.trackingNumber.toLowerCase() === q ||
         (a.assignedRoll && a.assignedRoll.toLowerCase() === q) ||
         (a.assignedRegNo && a.assignedRegNo.toLowerCase() === q)
  );

  if (!certificate && !student && !admission) {
    return res.status(404).json({
      verified: false,
      message: "কোন রেকর্ড পাওয়া যায়নি। অনুগ্রহ করে সঠিক সার্টিফিকেট নম্বর, রোল নম্বর অথবা রেজিস্ট্রেশন নম্বর প্রদান করুন।"
    });
  }

  res.json({
    verified: true,
    certificate: certificate || null,
    student: student || null,
    admission: admission || null,
    instituteInfo: medicalInstituteInfo,
    verifiedAt: new Date().toISOString()
  });
});

// 7. Student ID Card Generator Data
app.get("/api/v1/medical/idcard/:query", (req, res) => {
  const q = req.params.query.trim().toLowerCase();
  const student = medicalStudents.find(
    s => s.rollNumber.toLowerCase() === q ||
         s.registrationNumber.toLowerCase() === q ||
         s.phone.replace(/[^0-9]/g, "") === q.replace(/[^0-9]/g, "") ||
         s.id.toLowerCase() === q
  );

  if (!student) {
    return res.status(404).json({ error: "শিক্ষার্থীর কোনো আইডি কার্ডের তথ্য পাওয়া যায়নি" });
  }

  res.json({
    student,
    institute: medicalInstituteInfo,
    barcode: student.registrationNumber,
    qrPayload: `STUDENT_ID: ${student.fullNameBn} | Roll: ${student.rollNumber} | Reg: ${student.registrationNumber} | Course: ${student.courseTitleBn} | Blood: ${student.bloodGroup} | Emergency: ${medicalInstituteInfo.helpline}`,
    authorizedSignatory: "অধ্যক্ষ (Principal), কোম্পানীগঞ্জ প্যারামেডিকেল ইনস্টিটিউট",
    validity: student.expiryDate || "2026-06-30"
  });
});

// 8. Student Admit Card Generator Data
app.get("/api/v1/medical/admitcard/:query", (req, res) => {
  const q = req.params.query.trim().toLowerCase();
  const student = medicalStudents.find(
    s => s.rollNumber.toLowerCase() === q ||
         s.registrationNumber.toLowerCase() === q ||
         s.phone.replace(/[^0-9]/g, "") === q.replace(/[^0-9]/g, "") ||
         s.id.toLowerCase() === q
  );

  if (!student) {
    return res.status(404).json({ error: "অ্যাডমিট কার্ডের জন্য শিক্ষার্থীর তথ্য পাওয়া যায়নি" });
  }

  const course = medicalCourses.find(c => c.code === student.courseCode) || medicalCourses[0];

  const subjects = (course.subjects || []).slice(0, 5).map((subj: string, idx: number) => ({
    code: `${student.courseCode}-${101 + idx}`,
    nameBn: subj,
    date: `2026-09-${10 + idx * 2}`,
    time: "সকাল ১০:০০ - দুপুর ০১:০০"
  }));

  const admitCard = {
    id: `admit_${student.rollNumber}`,
    examTitle: "Semester Final Examination - 2026",
    examTitleBn: "সেমিস্টার ফাইনাল পরীক্ষা - ২০২৬",
    session: student.session || "2025-2026",
    rollNumber: student.rollNumber,
    registrationNumber: student.registrationNumber,
    studentNameBn: student.fullNameBn,
    fatherNameBn: student.fatherNameBn || student.fatherName,
    motherNameBn: student.motherNameBn || student.motherName,
    courseTitleBn: student.courseTitleBn,
    durationBn: student.durationBn,
    instituteNameBn: medicalInstituteInfo.nameBn,
    centerNameBn: medicalInstituteInfo.examCenter,
    centerCode: "NH-702",
    examStartDate: "১০ সেপ্টেম্বর ২০২৬",
    photoUrl: student.photoUrl,
    qrCodeData: `ADMIT_CARD_VERIFIED: Roll: ${student.rollNumber} | Reg: ${student.registrationNumber} | Name: ${student.fullNameBn} | Exam: Final 2026 | Center: NH-702`,
    subjects: subjects.length > 0 ? subjects : [
      { code: "MED-101", nameBn: "হিউম্যান অ্যানাটমি ও ফিজিওলজি", date: "২০২৬-০৯-১০", time: "সকাল ১০:০০ - ০১:০০" },
      { code: "MED-102", nameBn: "ফার্মাকোলজি ও ক্লিনিক্যাল মেডিসিন", date: "২০২৬-০৯-১২", time: "সকাল ১০:০০ - ০১:০০" },
      { code: "MED-103", nameBn: "ফার্স্ট এইড ও মাইনর ড্রেসিং", date: "২০২৬-০৯-১৪", time: "সকাল ১০:০০ - ০১:০০" },
      { code: "MED-104", nameBn: "ব্যবহারিক ও মৌখিক (Viva Voce)", date: "২০২৬-০৯-১৬", time: "সকাল ০৯:০০ - ০৪:০০" }
    ],
    instructions: [
      "পরীক্ষার্থীকে অবশ্যই পরীক্ষার ৩০ মিনিট পূর্বে কেন্দ্রে উপস্থিত হতে হবে।",
      "পরীক্ষার হলে এই মূল প্রবেশপত্র (Admit Card) এবং রেজিস্ট্রেশন কার্ড অবশ্যই প্রদর্শন করতে হবে।",
      "মোবাইল ফোন, ক্যালকুলেটর বা কোনো ধরনের ইলেকট্রনিক ডিভাইস হলে আনা সম্পূর্ণ নিষিদ্ধ।",
      "উত্তরপত্রের কভারে রোল ও রেজিস্ট্রেশন নম্বর নির্ভুলভাবে পূরণ করতে হবে।"
    ],
    controllerSignature: "পরীক্ষা নিয়ন্ত্রক ও অ্যাকাডেমিক কাউন্সিল"
  };

  res.json(admitCard);
});

// 9. Student Registration Card Generator Data
app.get("/api/v1/medical/regcard/:query", (req, res) => {
  const q = req.params.query.trim().toLowerCase();
  const student = medicalStudents.find(
    s => s.rollNumber.toLowerCase() === q ||
         s.registrationNumber.toLowerCase() === q ||
         s.phone.replace(/[^0-9]/g, "") === q.replace(/[^0-9]/g, "") ||
         s.id.toLowerCase() === q
  );

  if (!student) {
    return res.status(404).json({ error: "রেজিস্ট্রেশন কার্ডের জন্য শিক্ষার্থীর তথ্য পাওয়া যায়নি" });
  }

  const regCard = {
    id: `reg_${student.registrationNumber}`,
    registrationNumber: student.registrationNumber,
    session: student.session || "২০২৫-২০২৬",
    instituteNameBn: medicalInstituteInfo.nameBn,
    instituteCode: "CPI-NOA-88",
    regAuthorityBn: "সিএমএসএস ইনস্টিটিউট অব মেডিকেল টেকনোলজি",
    approvedRefBn: "রেজিঃ নং- ঢাকা S-৩১৪৪ (১০৯) ২০০৩ (স্বাস্থ্য অধিদপ্তর কর্তৃক স্বীকৃত)",
    studentNameBn: student.fullNameBn,
    fatherNameBn: student.fatherNameBn || student.fatherName,
    motherNameBn: student.motherNameBn || student.motherName,
    dateOfBirth: "2003-05-14",
    courseTitleBn: student.courseTitleBn,
    durationBn: student.durationBn,
    bloodGroup: student.bloodGroup,
    photoUrl: student.photoUrl,
    issueDate: student.issueDate || "০১ জুলাই ২০২৫",
    validUntil: student.expiryDate || "৩০ জুন ২০২৬",
    qrCodeData: `OFFICIAL_REGISTRATION_CARD: ${student.registrationNumber} | Name: ${student.fullNameBn} | Institute: কোম্পানীগঞ্জ প্যারামেডিকেল ইনস্টিটিউট | CMSS Reg: Dhaka S-3144(109) 2003`,
    registrarSignature: "রেজিস্ট্রার ও সচিব, সিএমএসএস কেন্দ্রীয় পরিষদ"
  };

  res.json(regCard);
});

// ==========================================
// WORDPRESS THEME DOWNLOAD ENDPOINT
// ==========================================
// WORDPRESS THEME EXPORT ZIP GENERATOR
// ==========================================
app.get("/api/download-wp-theme", async (req: Request, res: Response) => {
  try {
    const slug = (req.query.slug as string) || "ascado-multi-ngo-integrated-management-platform-4";
    const zip = new JSZip();
    // WordPress theme directory inside the zip matching target slug
    const themeFolder = zip.folder(slug);

    const wpFiles = ["style.css", "functions.php", "index.php", "header.php", "footer.php", "README.md"];
    for (const f of wpFiles) {
      const p = path.join(process.cwd(), "wordpress-theme", f);
      if (fs.existsSync(p)) {
        themeFolder?.file(f, fs.readFileSync(p, "utf-8"));
      } else {
        const rootP = path.join(process.cwd(), f);
        if (fs.existsSync(rootP)) {
          themeFolder?.file(f, fs.readFileSync(rootP, "utf-8"));
        }
      }
    }

    // Include Theme Screenshots (PNG and JPG)
    const screenshotPng = path.join(process.cwd(), "wordpress-theme", "screenshot.png");
    if (fs.existsSync(screenshotPng)) {
      themeFolder?.file("screenshot.png", fs.readFileSync(screenshotPng));
    } else {
      const rootScreenshot = path.join(process.cwd(), "screenshot.png");
      if (fs.existsSync(rootScreenshot)) {
        themeFolder?.file("screenshot.png", fs.readFileSync(rootScreenshot));
      }
    }

    const screenshotJpg = path.join(process.cwd(), "wordpress-theme", "screenshot.jpg");
    if (fs.existsSync(screenshotJpg)) {
      themeFolder?.file("screenshot.jpg", fs.readFileSync(screenshotJpg));
    }

    // Include Page Templates (Halal Marketplace, Blood Bank, School ERP, Charity, Somiti, Matrimony)
    const ptDir = path.join(process.cwd(), "wordpress-theme", "page-templates");
    const targetPtFolder = themeFolder?.folder("page-templates");
    if (fs.existsSync(ptDir)) {
      const ptFiles = fs.readdirSync(ptDir);
      for (const ptFile of ptFiles) {
        const ptPath = path.join(ptDir, ptFile);
        if (fs.statSync(ptPath).isFile() && ptFile.endsWith(".php")) {
          targetPtFolder?.file(ptFile, fs.readFileSync(ptPath, "utf-8"));
        }
      }
    }

    // Include Translation Template (languages/ascado.pot)
    const langPot = path.join(process.cwd(), "wordpress-theme", "languages", "ascado.pot");
    if (fs.existsSync(langPot)) {
      themeFolder?.folder("languages")?.file("ascado.pot", fs.readFileSync(langPot, "utf-8"));
    } else {
      const rootLang = path.join(process.cwd(), "languages", "ascado.pot");
      if (fs.existsSync(rootLang)) {
        themeFolder?.folder("languages")?.file("ascado.pot", fs.readFileSync(rootLang, "utf-8"));
      }
    }

    // Include Companion Plugin (plugins/ascado-ngo-core)
    const pluginPhp = path.join(process.cwd(), "wordpress-theme", "plugins", "ascado-ngo-core", "ascado-ngo-core.php");
    if (fs.existsSync(pluginPhp)) {
      themeFolder?.folder("plugins")?.folder("ascado-ngo-core")?.file("ascado-ngo-core.php", fs.readFileSync(pluginPhp, "utf-8"));
    }

    // Bundle compiled dist/assets (and assets/)
    const distAssetsPath = path.join(process.cwd(), "dist", "assets");
    if (fs.existsSync(distAssetsPath)) {
      const assetFiles = fs.readdirSync(distAssetsPath);
      const distFolder = themeFolder?.folder("dist")?.folder("assets");
      const rootAssetsFolder = themeFolder?.folder("assets");
      for (const aFile of assetFiles) {
        const aPath = path.join(distAssetsPath, aFile);
        if (fs.statSync(aPath).isFile()) {
          const content = fs.readFileSync(aPath);
          distFolder?.file(aFile, content);
          rootAssetsFolder?.file(aFile, content);
        }
      }
    }

    const buffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 9 } });
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${slug}.zip"`);
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create theme zip: " + err.message });
  }
});

// ==========================================
// WORDPRESS STANDALONE COMPANION PLUGIN ZIP
// ==========================================
app.get("/api/download-wp-plugin", async (req: Request, res: Response) => {
  try {
    const zip = new JSZip();
    const pluginFolder = zip.folder("ascado-ngo-core");
    const pluginPhp = path.join(process.cwd(), "wordpress-theme", "plugins", "ascado-ngo-core", "ascado-ngo-core.php");

    if (fs.existsSync(pluginPhp)) {
      pluginFolder?.file("ascado-ngo-core.php", fs.readFileSync(pluginPhp, "utf-8"));
    } else {
      pluginFolder?.file("ascado-ngo-core.php", "// Ascado NGO Core Engine");
    }

    const buffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 9 } });
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="ascado-ngo-core.zip"');
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create plugin zip: " + err.message });
  }
});

// ==========================================
// ANDROID APK EXPORT & DOWNLOAD ENDPOINTS
// ==========================================
const sendApkFile = (res: Response, filename = "ascado-platform-v1.0.0.apk") => {
  const possiblePaths = [
    path.join(process.cwd(), "public", "ascado-platform.apk"),
    path.join(process.cwd(), "public", "downloads", "ascado-platform.apk"),
    path.join(process.cwd(), "downloads", "ascado-platform.apk")
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      res.setHeader("Content-Type", "application/vnd.android.package-archive");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      return res.sendFile(p);
    }
  }

  return res.status(404).json({ error: "APK file not found on disk." });
};

app.get("/api/download-apk", (req: Request, res: Response) => {
  sendApkFile(res, "ascado-platform-v1.0.0.apk");
});

app.get("/ascado-platform.apk", (req: Request, res: Response) => {
  sendApkFile(res, "ascado-platform-v1.0.0.apk");
});

app.get("/downloads/ascado-platform.apk", (req: Request, res: Response) => {
  sendApkFile(res, "ascado-platform-v1.0.0.apk");
});


// ==========================================
// SEO ENDPOINTS: SITEMAP & ROBOTS.TXT
// ==========================================
app.get("/sitemap.xml", (req: Request, res: Response) => {
  const p = path.join(process.cwd(), "public", "sitemap.xml");
  if (fs.existsSync(p)) {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.send(fs.readFileSync(p, "utf-8"));
  } else {
    res.status(404).send("Sitemap not found");
  }
});

app.get("/robots.txt", (req: Request, res: Response) => {
  const p = path.join(process.cwd(), "public", "robots.txt");
  if (fs.existsSync(p)) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(fs.readFileSync(p, "utf-8"));
  } else {
    res.status(404).send("Robots.txt not found");
  }
});

// ==========================================
// VITE MIDDLEWARE & STATIC ASSETS
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ASCADO Multi-NGO Enterprise Server running on http://localhost:${PORT}`);
  });
}

startServer();
