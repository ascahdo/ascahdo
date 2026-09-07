import { pgTable, text, timestamp, boolean, integer, jsonb, decimal } from "drizzle-orm/pg-core";

// 1. Users & Roles
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique(),
  phone: text("phone").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").default("user").notNull(), // admin, branch_manager, somiti_member, student, donor, user
  branchId: text("branch_id"),
  nid: text("nid"),
  address: text("address"),
  bloodGroup: text("blood_group"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Branches & Management
export const branches = pgTable("branches", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameBn: text("name_bn").notNull(),
  code: text("code").notNull().unique(),
  division: text("division").notNull(),
  district: text("district").notNull(),
  upazila: text("upazila").notNull(),
  address: text("address").notNull(),
  addressBn: text("address_bn"),
  contactPerson: text("contact_person").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  status: text("status").default("pending").notNull(), // pending, approved, rejected
  committeeApproved: boolean("committee_approved").default(false),
  committeeMembers: jsonb("committee_members").default([]),
  activityCount: integer("activity_count").default(0),
  beneficiaryCount: integer("beneficiary_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Blood Bank Donors & Inventory
export const bloodDonors = pgTable("blood_donors", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameBn: text("name_bn"),
  bloodGroup: text("blood_group").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  district: text("district").notNull(),
  upazila: text("upazila").notNull(),
  branchId: text("branch_id"),
  lastDonationDate: text("last_donation_date"),
  isAvailable: boolean("is_available").default(true),
  donationCount: integer("donation_count").default(0),
  isCoordinator: boolean("is_coordinator").default(false),
  coordinatorRole: text("coordinator_role"),
  coordinatorRoleBn: text("coordinator_role_bn"),
  photoUrl: text("photo_url"),
  status: text("status").default("approved"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. Donations & Funding
export const donations = pgTable("donations", {
  id: text("id").primaryKey(),
  donorName: text("donor_name").notNull(),
  donorPhone: text("donor_phone").notNull(),
  donorEmail: text("donor_email"),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  category: text("category").notNull(), // general, zakat, sadakah, orphan, emergency, winter
  paymentMethod: text("payment_method").notNull(), // bkash, nagad, rocket, bank, manual
  trxId: text("trx_id").notNull(),
  status: text("status").default("pending").notNull(), // pending, verified, rejected
  note: text("note"),
  isAnonymous: boolean("is_anonymous").default(false),
  verifiedAt: timestamp("verified_at"),
  verifiedBy: text("verified_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 5. Digital Academy Courses & Admissions
export const courses = pgTable("courses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  titleBn: text("title_bn").notNull(),
  category: text("category").notNull(),
  fee: decimal("fee", { precision: 10, scale: 2 }).default("0"),
  duration: text("duration").notNull(),
  instructor: text("instructor").notNull(),
  description: text("description"),
  descriptionBn: text("description_bn"),
  imageUrl: text("image_url"),
  enrolledCount: integer("enrolled_count").default(0),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const courseEnrollments = pgTable("course_enrollments", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull(),
  studentName: text("student_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  branchId: text("branch_id"),
  paymentMethod: text("payment_method"),
  trxId: text("trx_id"),
  paymentStatus: text("payment_status").default("unpaid"),
  admissionStatus: text("admission_status").default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 6. Somiti & Micro-Finance
export const somitiAccounts = pgTable("somiti_accounts", {
  id: text("id").primaryKey(),
  accountNo: text("account_no").notNull().unique(),
  memberName: text("member_name").notNull(),
  memberNameBn: text("member_name_bn"),
  phone: text("phone").notNull(),
  nid: text("nid").notNull(),
  branchId: text("branch_id").notNull(),
  totalSavings: decimal("total_savings", { precision: 12, scale: 2 }).default("0"),
  activeLoanAmount: decimal("active_loan_amount", { precision: 12, scale: 2 }).default("0"),
  monthlyInstallment: decimal("monthly_installment", { precision: 10, scale: 2 }).default("0"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const somitiTransactions = pgTable("somiti_transactions", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  type: text("type").notNull(), // deposit, withdraw, loan_disbursement, loan_repayment
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  trxId: text("trx_id"),
  status: text("status").default("completed"),
  date: timestamp("date").defaultNow().notNull(),
});

// 7. Marketplace (Halal E-commerce)
export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameBn: text("name_bn").notNull(),
  category: text("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discountPrice: decimal("discount_price", { precision: 10, scale: 2 }),
  stock: integer("stock").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.0"),
  imageUrl: text("image_url"),
  description: text("description"),
  descriptionBn: text("description_bn"),
  status: text("status").default("available"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  items: jsonb("items").notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  trxId: text("trx_id"),
  orderStatus: text("order_status").default("pending"), // pending, confirmed, processing, shipped, delivered, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 8. Real Estate (Housing & Land)
export const properties = pgTable("properties", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  titleBn: text("title_bn").notNull(),
  type: text("type").notNull(), // land, flat, commercial
  location: text("location").notNull(),
  locationBn: text("location_bn"),
  price: decimal("price", { precision: 14, scale: 2 }).notNull(),
  size: text("size").notNull(),
  imageUrl: text("image_url"),
  features: jsonb("features").default([]),
  status: text("status").default("available"), // available, booked, sold
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 9. Marriage Media Profiles
export const marriageProfiles = pgTable("marriage_profiles", {
  id: text("id").primaryKey(),
  fullName: text("full_name").notNull(),
  fullNameBn: text("full_name_bn"),
  gender: text("gender").notNull(), // male, female
  age: integer("age").notNull(),
  height: text("height"),
  maritalStatus: text("marital_status").notNull(),
  education: text("education").notNull(),
  occupation: text("occupation").notNull(),
  district: text("district").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  guardianPhone: text("guardian_phone"),
  religiousPractices: text("religious_practices"),
  photoUrl: text("photo_url"),
  status: text("status").default("approved"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 10. Navigation Menus & App Settings
export const navigationMenus = pgTable("navigation_menus", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  titleBn: text("title_bn").notNull(),
  route: text("route").notNull(),
  category: text("category").notNull(), // header_main, programs, economic, footer_quick, footer_legal
  iconName: text("icon_name").default("Sparkles"),
  badge: text("badge"),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const systemSettings = pgTable("system_settings", {
  id: text("id").primaryKey(), // "global"
  siteName: text("site_name").default("ASCADO FOUNDATION"),
  siteNameBn: text("site_name_bn").default("আসকাদো ফাউন্ডেশন"),
  contactPhone: text("contact_phone").default("01973817167"),
  contactEmail: text("contact_email").default("info@ascado.org"),
  bkashNumber: text("bkash_number").default("01973817167"),
  nagadNumber: text("nagad_number").default("01973817167"),
  rocketNumber: text("rocket_number").default("01973817167"),
  maintenanceMode: boolean("maintenance_mode").default(false),
  bannerNotices: jsonb("banner_notices").default([]),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 11. Medical Courses (কোম্পানীগঞ্জ প্যারামেডিকেল ইনস্টিটিউট - CMSS)
export const medicalCourses = pgTable("medical_courses", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(), // DMA, DPT, DENTAL, DMLT, LMAF, REFRESHER, NURSING, MCSC
  title: text("title").notNull(),
  titleBn: text("title_bn").notNull(),
  duration: text("duration").notNull(),
  durationBn: text("duration_bn").notNull(),
  eligibility: text("eligibility").notNull(),
  eligibilityBn: text("eligibility_bn").notNull(),
  totalFee: decimal("total_fee", { precision: 10, scale: 2 }).default("0"),
  admissionFee: decimal("admission_fee", { precision: 10, scale: 2 }).default("0"),
  monthlyFee: decimal("monthly_fee", { precision: 10, scale: 2 }).default("0"),
  session: text("session").default("June - May (জুন - মে)"),
  description: text("description"),
  descriptionBn: text("description_bn"),
  subjects: jsonb("subjects").default([]),
  features: jsonb("features").default([]),
  imageUrl: text("image_url"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 12. Medical Admissions
export const medicalAdmissions = pgTable("medical_admissions", {
  id: text("id").primaryKey(),
  trackingNumber: text("tracking_number").notNull().unique(),
  courseId: text("course_id").notNull(),
  courseCode: text("course_code").notNull(),
  courseTitleBn: text("course_title_bn").notNull(),
  studentName: text("student_name").notNull(),
  studentNameBn: text("student_name_bn"),
  fatherName: text("father_name").notNull(),
  fatherNameBn: text("father_name_bn"),
  motherName: text("mother_name").notNull(),
  motherNameBn: text("mother_name_bn"),
  gender: text("gender").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  bloodGroup: text("blood_group").notNull(),
  nidOrBirthReg: text("nid_or_birth_reg").notNull(),
  academicQualification: text("academic_qualification").notNull(),
  gpaOrGrade: text("gpa_or_grade"),
  passingYear: text("passing_year"),
  boardOrInstitute: text("board_or_institute"),
  phone: text("phone").notNull(),
  guardianPhone: text("guardian_phone").notNull(),
  email: text("email"),
  presentAddress: text("present_address").notNull(),
  permanentAddress: text("permanent_address").notNull(),
  photoUrl: text("photo_url"),
  paymentMethod: text("payment_method").default("bkash"),
  paymentTrxId: text("payment_trx_id").notNull(),
  paymentAmount: decimal("payment_amount", { precision: 10, scale: 2 }).default("0"),
  status: text("status").default("pending"), // pending, approved, rejected
  assignedRoll: text("assigned_roll"),
  assignedRegNo: text("assigned_reg_no"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 13. Medical Students & Academic Profiles
export const medicalStudents = pgTable("medical_students", {
  id: text("id").primaryKey(),
  rollNumber: text("roll_number").notNull().unique(),
  registrationNumber: text("registration_number").notNull().unique(),
  fullName: text("full_name").notNull(),
  fullNameBn: text("full_name_bn").notNull(),
  fatherName: text("father_name").notNull(),
  fatherNameBn: text("father_name_bn"),
  motherName: text("mother_name").notNull(),
  motherNameBn: text("mother_name_bn"),
  courseCode: text("course_code").notNull(),
  courseTitleBn: text("course_title_bn").notNull(),
  durationBn: text("duration_bn").notNull(),
  session: text("session").notNull(),
  instituteName: text("institute_name").default("Companiganj Paramedical Institute"),
  instituteNameBn: text("institute_name_bn").default("কোম্পানীগঞ্জ প্যারামেডিকেল ইনস্টিটিউট"),
  registrationAuthority: text("registration_authority").default("CMSS Institute of Medical Technology (Reg: Dhaka S-3144(109) 2003)"),
  registrationAuthorityBn: text("registration_authority_bn").default("সিএমএসএস ইনস্টিটিউট অব মেডিকেল টেকনোলজি (রেজিঃ ঢাকা এস-৩১৪৪ (১০৯) ২০০৩)"),
  centerNameBn: text("center_name_bn").default("নোয়াখালী পরীক্ষা কেন্দ্র"),
  phone: text("phone").notNull(),
  guardianPhone: text("guardian_phone").notNull(),
  bloodGroup: text("blood_group").notNull(),
  address: text("address").notNull(),
  addressBn: text("address_bn"),
  photoUrl: text("photo_url"),
  qrCodeData: text("qr_code_data"),
  currentSemester: text("current_semester").default("1st Semester"),
  cgpa: decimal("cgpa", { precision: 3, scale: 2 }),
  status: text("status").default("active"), // active, completed, drop
  issueDate: text("issue_date").notNull(),
  expiryDate: text("expiry_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 14. Medical Certificates
export const medicalCertificates = pgTable("medical_certificates", {
  id: text("id").primaryKey(),
  certificateNo: text("certificate_no").notNull().unique(),
  studentId: text("student_id").notNull(),
  rollNumber: text("roll_number").notNull(),
  registrationNumber: text("registration_number").notNull(),
  studentName: text("student_name").notNull(),
  studentNameBn: text("student_name_bn").notNull(),
  fatherNameBn: text("father_name_bn").notNull(),
  motherNameBn: text("mother_name_bn").notNull(),
  courseTitleBn: text("course_title_bn").notNull(),
  durationBn: text("duration_bn").notNull(),
  session: text("session").notNull(),
  examYear: text("exam_year").notNull(),
  grade: text("grade").notNull(), // A+, A, A-
  gpa: decimal("gpa", { precision: 3, scale: 2 }).notNull(),
  issueDate: text("issue_date").notNull(),
  status: text("status").default("verified"),
  verificationUrl: text("verification_url"),
  qrCodeData: text("qr_code_data"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

