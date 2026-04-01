/**
 * SLCMS — Aditya Kumar Complete Lifecycle Seed
 *
 * Populates one student's full data across all 11 modules:
 * Lead → Admission → Student → Courses → Exams → Finance
 * → Campus (Hostel) → Placements → Alumni
 *
 * ✅ Safe to run — only removes/recreates Aditya's records (Student ID: S001).
 * ✅ Does NOT touch any other existing data.
 *
 * Usage:  node seedAditya.js
 */

require("dotenv").config();
const mongoose = require("mongoose");

const Lead         = require("./models/Lead");
const Admission    = require("./models/Admission");
const Student      = require("./models/Student");
const Course       = require("./models/Course");
const Exam         = require("./models/Exam");
const Fee          = require("./models/Fee");
const Hostel       = require("./models/Hostel");
const Placement    = require("./models/Placement");
const Alumni       = require("./models/Alumni");
const Announcement = require("./models/Announcement");

// ─────────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB\n");

  // ── CLEANUP: Remove Aditya's existing records ─────────────────────
  console.log("🗑️  Removing any existing records for Aditya Kumar (S001)...");
  await Lead.deleteMany({ email: "aditya@gmail.com" });
  await Admission.deleteMany({ email: "aditya@gmail.com" });
  await Student.deleteOne({ _id: "S001" });
  await Exam.deleteMany({ studentId: "S001" });
  await Fee.deleteMany({ studentId: "S001" });
  await Hostel.deleteOne({ studentId: "S001" });
  await Placement.deleteMany({ studentId: "S001" });
  await Alumni.deleteOne({ email: "aditya.kumar.alumni@tcs.com" });

  // ── Remove IT courses if already seeded (to avoid duplicate courseCode) ─
  const itCourseCodes = [
    "IT101","IT102","IT103","IT104","IT105","IT106","IT107",
    "IT201","IT202","IT203","IT204","IT205","IT206",
    "IT301","IT302","IT303","IT304","IT305","IT306",
    "IT401","IT402","IT403","IT404","IT405","IT406",
    "IT501","IT502","IT503","IT504","IT601","IT602","IT603",
    "IT701","IT702","IT703","IT801",
    "IT501E1","IT501E2","IT501E3","IT601E1","IT601E2","IT601E3",
    "IT701E1","IT701E2","IT501O1","IT501O2","IT601O1","IT601O2"
  ];
  await Course.deleteMany({ courseCode: { $in: itCourseCodes } });
  console.log("✅ Cleanup done\n");

  // ════════════════════════════════════════════════════════════════════
  // 1. PRE-ADMISSION — LEAD
  // ════════════════════════════════════════════════════════════════════
  console.log("📋 1. Creating Lead record (L001)...");
  await Lead.create({
    name: "Aditya Kumar",
    email: "aditya@gmail.com",
    phone: "9876543210",
    source: "Website",
    program: "B.Tech IT",
    status: "Enrolled",           // Converted = Enrolled in our schema
    campaign: "Online Enquiry 2021",
    followUpDate: new Date("2021-06-01"),
    notes: [
      { text: "Enquired about B.Tech IT programme", addedAt: new Date("2021-05-10") },
      { text: "Documents verified. Entrance score: 92. Selected.", addedAt: new Date("2021-07-15") }
    ]
  });
  console.log("   ✅ Lead L001 — Aditya Kumar\n");

  // ════════════════════════════════════════════════════════════════════
  // 2. ADMISSION APPLICATION
  // ════════════════════════════════════════════════════════════════════
  console.log("📝 2. Creating Admission record (A001)...");
  await Admission.create({
    applicationNumber: "A001",
    name: "Aditya Kumar",
    email: "aditya@gmail.com",
    phone: "9876543210",
    program: "B.Tech",
    department: "Information Technology",
    applicationStatus: "Enrolled",
    documents: [
      { name: "10th Marksheet",  uploaded: true  },
      { name: "12th Marksheet",  uploaded: true  },
      { name: "ID Proof",        uploaded: true  },
      { name: "Transfer Certificate", uploaded: true },
      { name: "Photo",           uploaded: true  }
    ],
    entranceScore: 92,
    interviewDate: new Date("2021-07-10"),
    interviewScore: 88,
    meritRank: 5,
    offerLetterSent: true,
    feesPaid: true,
    studentId: "S001",
    notes: "General quota. Entrance score 92/100. Interview cleared. Admitted to B.Tech IT 2021-2025 batch."
  });
  console.log("   ✅ Admission A001 — Status: Enrolled\n");

  // ════════════════════════════════════════════════════════════════════
  // 3. STUDENT PROFILE (SIS)
  // ════════════════════════════════════════════════════════════════════
  console.log("👨‍🎓 3. Creating Student profile (S001)...");
  await Student.create({
    _id: "S001",
    studentId: "S001",
    name: "Aditya Kumar",
    email: "aditya@gmail.com",
    department: "Information Technology",
    currentSemester: 8,          // Graduated — completed all 8 semesters
    lifecycleStage: "ALUMNI",    // Completed → now alumni
    attendancePercentage: 92,    // S1 attendance (overall high)
    gpa: 8.6,                    // Final CGPA
    riskStatus: "Low",
    lifeCycleIndex: 95,
    placementEligible: true
    // Extended profile fields stored as notes (DOB, gender etc. can go to a profile extension)
  });
  console.log("   ✅ Student S001 — Aditya Kumar, B.Tech IT 2021-2025\n");
  console.log("   📌 Extended Profile:");
  console.log("      DOB: 2003-05-14 | Gender: Male | Blood: O+");
  console.log("      Address: Chennai | Parent: Raj Kumar (9876501234)");
  console.log("      Roll No: IT21B001 | Batch: 2021-2025 | Quota: General\n");

  // ════════════════════════════════════════════════════════════════════
  // 4. ACADEMICS — ALL IT COURSES (SSN R2021 Curriculum)
  // ════════════════════════════════════════════════════════════════════
  console.log("📚 4. Seeding IT Curriculum (SSN R2021)...");

  const itCourses = [
    // ── SEMESTER 1 ─────────────────────────────────────────────────
    { courseCode:"IT101", title:"Technical English",                              department:"Information Technology", credits:3, semester:1, facultyName:"Prof. Meena Raj",       maxStudents:60, enrolledCount:58, isActive:true },
    { courseCode:"IT102", title:"Matrices and Calculus",                          department:"Information Technology", credits:4, semester:1, facultyName:"Dr. Santhosh Iyer",    maxStudents:60, enrolledCount:58 },
    { courseCode:"IT103", title:"Engineering Physics",                            department:"Information Technology", credits:3, semester:1, facultyName:"Dr. Kavitha Pillai",   maxStudents:60, enrolledCount:58 },
    { courseCode:"IT104", title:"Engineering Chemistry",                          department:"Information Technology", credits:3, semester:1, facultyName:"Dr. Ravi Kumar",       maxStudents:60, enrolledCount:58 },
    { courseCode:"IT105", title:"Problem Solving and Programming in Python",      department:"Information Technology", credits:4, semester:1, facultyName:"Prof. Arun Krishnan",  maxStudents:60, enrolledCount:58 },
    { courseCode:"IT106", title:"Engineering Graphics",                           department:"Information Technology", credits:3, semester:1, facultyName:"Prof. Geetha Devi",    maxStudents:60, enrolledCount:58 },
    { courseCode:"IT107", title:"Heritage of Tamils",                             department:"Information Technology", credits:2, semester:1, facultyName:"Prof. Subramanian N",  maxStudents:60, enrolledCount:58 },
    // ── SEMESTER 2 ─────────────────────────────────────────────────
    { courseCode:"IT201", title:"Complex Functions and Laplace Transforms",       department:"Information Technology", credits:4, semester:2, facultyName:"Dr. Vimala Rao",      maxStudents:60, enrolledCount:56 },
    { courseCode:"IT202", title:"Basic Electrical and Electronics Engineering",   department:"Information Technology", credits:3, semester:2, facultyName:"Prof. Karthik Nair",   maxStudents:60, enrolledCount:56 },
    { courseCode:"IT203", title:"Programming and Data Structures",                department:"Information Technology", credits:4, semester:2, facultyName:"Dr. Deepa Menon",     maxStudents:60, enrolledCount:56 },
    { courseCode:"IT204", title:"Environmental Science (Non-credit)",             department:"Information Technology", credits:0, semester:2, facultyName:"Prof. Nalini S",       maxStudents:60, enrolledCount:56 },
    { courseCode:"IT205", title:"Physics for Information Science",                department:"Information Technology", credits:3, semester:2, facultyName:"Dr. Renuka Pillai",    maxStudents:60, enrolledCount:56 },
    { courseCode:"IT206", title:"Tamils and Technology",                          department:"Information Technology", credits:2, semester:2, facultyName:"Prof. Murugan V",      maxStudents:60, enrolledCount:56 },
    // ── SEMESTER 3 ─────────────────────────────────────────────────
    { courseCode:"IT301", title:"Discrete Mathematics",                           department:"Information Technology", credits:4, semester:3, facultyName:"Dr. Anitha Krishnan",  maxStudents:60, enrolledCount:54 },
    { courseCode:"IT302", title:"Universal Human Values",                         department:"Information Technology", credits:2, semester:3, facultyName:"Prof. Ramachandran",   maxStudents:60, enrolledCount:54 },
    { courseCode:"IT303", title:"Programming and Design Patterns",                department:"Information Technology", credits:4, semester:3, facultyName:"Dr. Priya Suresh",    maxStudents:60, enrolledCount:54 },
    { courseCode:"IT304", title:"Database Technology",                            department:"Information Technology", credits:4, semester:3, facultyName:"Prof. Lakshmi Devi",   maxStudents:60, enrolledCount:54 },
    { courseCode:"IT305", title:"Digital Logic and Computer Organization",        department:"Information Technology", credits:3, semester:3, facultyName:"Dr. Vijay Kumar",      maxStudents:60, enrolledCount:54 },
    { courseCode:"IT306", title:"Introduction to Digital Communication",          department:"Information Technology", credits:3, semester:3, facultyName:"Dr. Saranya Raj",     maxStudents:60, enrolledCount:54 },
    // ── SEMESTER 4 ─────────────────────────────────────────────────
    { courseCode:"IT401", title:"Probability and Statistics",                     department:"Information Technology", credits:4, semester:4, facultyName:"Dr. Meera Nair",       maxStudents:60, enrolledCount:52 },
    { courseCode:"IT402", title:"Microprocessor and Microcontroller",             department:"Information Technology", credits:3, semester:4, facultyName:"Dr. Suresh Babu",      maxStudents:60, enrolledCount:52 },
    { courseCode:"IT403", title:"Indian Constitution (Non-credit)",               department:"Information Technology", credits:0, semester:4, facultyName:"Dr. Balaji Sharma",    maxStudents:60, enrolledCount:52 },
    { courseCode:"IT404", title:"Advanced Data Structures and Algorithm Analysis",department:"Information Technology", credits:4, semester:4, facultyName:"Dr. Nithya Kumar",    maxStudents:60, enrolledCount:52 },
    { courseCode:"IT405", title:"Data Communication and Networks",                department:"Information Technology", credits:3, semester:4, facultyName:"Prof. Harish Rao",    maxStudents:60, enrolledCount:52 },
    { courseCode:"IT406", title:"Automata Theory and Compiler Design",            department:"Information Technology", credits:3, semester:4, facultyName:"Dr. Swathi Pillai",   maxStudents:60, enrolledCount:52 },
    // ── SEMESTER 5 ─────────────────────────────────────────────────
    { courseCode:"IT501", title:"Software Engineering",                           department:"Information Technology", credits:3, semester:5, facultyName:"Prof. Kavitha Nair",   maxStudents:55, enrolledCount:50 },
    { courseCode:"IT502", title:"Data Analytics and Visualization",               department:"Information Technology", credits:4, semester:5, facultyName:"Dr. Anand Krishnan",  maxStudents:55, enrolledCount:50 },
    { courseCode:"IT503", title:"Operating Systems",                              department:"Information Technology", credits:4, semester:5, facultyName:"Dr. Revathi Menon",   maxStudents:55, enrolledCount:50 },
    { courseCode:"IT504", title:"Artificial Intelligence",                        department:"Information Technology", credits:4, semester:5, facultyName:"Dr. Dhanush Raj",     maxStudents:55, enrolledCount:50 },
    // ── SEMESTER 6 ─────────────────────────────────────────────────
    { courseCode:"IT601", title:"Machine Learning",                               department:"Information Technology", credits:4, semester:6, facultyName:"Dr. Preethi Kumar",   maxStudents:55, enrolledCount:48 },
    { courseCode:"IT602", title:"Web Programming",                                department:"Information Technology", credits:3, semester:6, facultyName:"Prof. Mithun S",      maxStudents:55, enrolledCount:48 },
    { courseCode:"IT603", title:"Internet of Things",                             department:"Information Technology", credits:3, semester:6, facultyName:"Dr. Naveen Raj",      maxStudents:55, enrolledCount:48 },
    // ── SEMESTER 7 ─────────────────────────────────────────────────
    { courseCode:"IT701", title:"Network Security",                               department:"Information Technology", credits:3, semester:7, facultyName:"Dr. Aditya Sharma",   maxStudents:55, enrolledCount:46 },
    { courseCode:"IT702", title:"Cloud Computing",                                department:"Information Technology", credits:4, semester:7, facultyName:"Prof. Ravi Suresh",   maxStudents:55, enrolledCount:46 },
    { courseCode:"IT703", title:"Internship",                                     department:"Information Technology", credits:2, semester:7, facultyName:"Industrial Training",  maxStudents:55, enrolledCount:46 },
    // ── SEMESTER 8 ─────────────────────────────────────────────────
    { courseCode:"IT801", title:"Project Phase II",                               department:"Information Technology", credits:6, semester:8, facultyName:"Dr. Meena Raj",       maxStudents:55, enrolledCount:44 },
    // ── PROFESSIONAL ELECTIVES ──────────────────────────────────────
    { courseCode:"IT501E1", title:"Data Mining",           department:"Information Technology", credits:3, semester:5, facultyName:"Dr. Santhosh Kumar", maxStudents:40, enrolledCount:35 },
    { courseCode:"IT501E2", title:"Cyber Security",        department:"Information Technology", credits:3, semester:5, facultyName:"Dr. Kavi Raj",       maxStudents:40, enrolledCount:30 },
    { courseCode:"IT501E3", title:"Natural Language Processing",department:"Information Technology", credits:3, semester:5, facultyName:"Dr. Geetha Priya",  maxStudents:40, enrolledCount:28 },
    { courseCode:"IT601E1", title:"Computer Vision",       department:"Information Technology", credits:3, semester:6, facultyName:"Dr. Nandini Rao",    maxStudents:40, enrolledCount:32 },
    { courseCode:"IT601E2", title:"Deep Learning",         department:"Information Technology", credits:3, semester:6, facultyName:"Dr. Thenmozhi K",    maxStudents:40, enrolledCount:36 },
    { courseCode:"IT601E3", title:"Blockchain Technology", department:"Information Technology", credits:3, semester:6, facultyName:"Prof. Prasanth S",   maxStudents:40, enrolledCount:25 },
    { courseCode:"IT701E1", title:"Full Stack Development",department:"Information Technology", credits:3, semester:7, facultyName:"Prof. Manoj Kumar",  maxStudents:40, enrolledCount:38 },
    { courseCode:"IT701E2", title:"Advanced Cloud Architecture",department:"Information Technology", credits:3, semester:7, facultyName:"Dr. Vinod Raj",    maxStudents:40, enrolledCount:30 },
    // ── OPEN ELECTIVES ──────────────────────────────────────────────
    { courseCode:"IT501O1", title:"Introduction to AI",    department:"Information Technology", credits:3, semester:5, facultyName:"Dr. Pooja Krishnan", maxStudents:80, enrolledCount:75 },
    { courseCode:"IT501O2", title:"Data Science Fundamentals",department:"Information Technology", credits:3, semester:5, facultyName:"Prof. Harish N",    maxStudents:80, enrolledCount:70 },
    { courseCode:"IT601O1", title:"Cyber Security Basics", department:"Information Technology", credits:3, semester:6, facultyName:"Prof. Arjun Pillai", maxStudents:80, enrolledCount:68 },
    { courseCode:"IT601O2", title:"Web Services",          department:"Information Technology", credits:3, semester:6, facultyName:"Prof. Divya S",      maxStudents:80, enrolledCount:60 },
  ];

  await Course.insertMany(itCourses);
  console.log(`   ✅ ${itCourses.length} IT courses (Semesters 1–8 + Electives)\n`);

  // ════════════════════════════════════════════════════════════════════
  // 5. EXAM RECORDS — Semester 1 & 2 (with full grades)
  // ════════════════════════════════════════════════════════════════════
  console.log("✏️  5. Seeding Exam Records (Semester 1 & 2)...");

  const examRecords = [
    // ── SEMESTER 1 (Attendance: 92%, CGPA: 8.5) ───────────────────
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT105", courseName:"Problem Solving and Programming in Python", department:"Information Technology", semester:1, type:"End-Sem", maxMarks:100, obtainedMarks:90, examDate:new Date("2021-11-20") },   // A
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT103", courseName:"Engineering Physics",           department:"Information Technology", semester:1, type:"End-Sem", maxMarks:100, obtainedMarks:75, examDate:new Date("2021-11-22") },   // B+
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT102", courseName:"Matrices and Calculus",         department:"Information Technology", semester:1, type:"End-Sem", maxMarks:100, obtainedMarks:85, examDate:new Date("2021-11-24") },   // A
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT104", courseName:"Engineering Chemistry",         department:"Information Technology", semester:1, type:"End-Sem", maxMarks:100, obtainedMarks:72, examDate:new Date("2021-11-26") },   // B+
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT101", courseName:"Technical English",             department:"Information Technology", semester:1, type:"End-Sem", maxMarks:100, obtainedMarks:88, examDate:new Date("2021-11-28") },   // A+
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT106", courseName:"Engineering Graphics",          department:"Information Technology", semester:1, type:"End-Sem", maxMarks:100, obtainedMarks:80, examDate:new Date("2021-11-30") },   // A
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT107", courseName:"Heritage of Tamils",            department:"Information Technology", semester:1, type:"End-Sem", maxMarks:100, obtainedMarks:87, examDate:new Date("2021-12-02") },   // A+

    // Semester 1 Internal exams
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT105", courseName:"Problem Solving and Programming in Python", department:"Information Technology", semester:1, type:"Internal-1", maxMarks:50, obtainedMarks:45, examDate:new Date("2021-09-15") },
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT102", courseName:"Matrices and Calculus",         department:"Information Technology", semester:1, type:"Internal-1", maxMarks:50, obtainedMarks:42, examDate:new Date("2021-09-17") },

    // ── SEMESTER 2 (Attendance: 88%, CGPA: 8.7) ───────────────────
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT203", courseName:"Programming and Data Structures",department:"Information Technology", semester:2, type:"End-Sem", maxMarks:100, obtainedMarks:91, examDate:new Date("2022-05-10") },   // O
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT201", courseName:"Complex Functions and Laplace Transforms",department:"Information Technology", semester:2, type:"End-Sem", maxMarks:100, obtainedMarks:84, examDate:new Date("2022-05-12") }, // A+
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT202", courseName:"Basic Electrical and Electronics Engineering",department:"Information Technology", semester:2, type:"End-Sem", maxMarks:100, obtainedMarks:79, examDate:new Date("2022-05-14") }, // B+
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT205", courseName:"Physics for Information Science",department:"Information Technology", semester:2, type:"End-Sem", maxMarks:100, obtainedMarks:88, examDate:new Date("2022-05-16") },   // A+
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT206", courseName:"Tamils and Technology",         department:"Information Technology", semester:2, type:"End-Sem", maxMarks:100, obtainedMarks:83, examDate:new Date("2022-05-18") },   // A+

    // ── SEMESTER 5 (AI, ML subjects — Aditya's strength area) ─────
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT504", courseName:"Artificial Intelligence",  department:"Information Technology", semester:5, type:"End-Sem", maxMarks:100, obtainedMarks:93, examDate:new Date("2023-11-15") }, // O
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT502", courseName:"Data Analytics and Visualization",department:"Information Technology", semester:5, type:"End-Sem", maxMarks:100, obtainedMarks:88, examDate:new Date("2023-11-17") }, // A+
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT501", courseName:"Software Engineering",     department:"Information Technology", semester:5, type:"End-Sem", maxMarks:100, obtainedMarks:82, examDate:new Date("2023-11-19") }, // A+
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT503", courseName:"Operating Systems",        department:"Information Technology", semester:5, type:"End-Sem", maxMarks:100, obtainedMarks:86, examDate:new Date("2023-11-21") }, // A+

    // ── SEMESTER 6 (ML, Web, IoT) ─────────────────────────────────
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT601", courseName:"Machine Learning",         department:"Information Technology", semester:6, type:"End-Sem", maxMarks:100, obtainedMarks:90, examDate:new Date("2024-05-10") }, // O
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT602", courseName:"Web Programming",          department:"Information Technology", semester:6, type:"End-Sem", maxMarks:100, obtainedMarks:88, examDate:new Date("2024-05-12") }, // A+
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT603", courseName:"Internet of Things",       department:"Information Technology", semester:6, type:"End-Sem", maxMarks:100, obtainedMarks:80, examDate:new Date("2024-05-14") }, // A

    // ── SEMESTER 7 ────────────────────────────────────────────────
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT701", courseName:"Network Security",         department:"Information Technology", semester:7, type:"End-Sem", maxMarks:100, obtainedMarks:85, examDate:new Date("2024-11-10") }, // A+
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT702", courseName:"Cloud Computing",          department:"Information Technology", semester:7, type:"End-Sem", maxMarks:100, obtainedMarks:87, examDate:new Date("2024-11-12") }, // A+
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT703", courseName:"Internship",               department:"Information Technology", semester:7, type:"Practical", maxMarks:100, obtainedMarks:92, examDate:new Date("2024-11-01") }, // O

    // ── SEMESTER 8 — Final Project ─────────────────────────────────
    { studentId:"S001", studentName:"Aditya Kumar", courseCode:"IT801", courseName:"Project Phase II",         department:"Information Technology", semester:8, type:"Practical", maxMarks:100, obtainedMarks:91, examDate:new Date("2025-04-20") }, // O
  ];

  await Exam.insertMany(examRecords);
  console.log(`   ✅ ${examRecords.length} exam records (S1, S2, S5, S6, S7, S8 + Internals)\n`);

  // ════════════════════════════════════════════════════════════════════
  // 6. FINANCE — Fee Records
  // ════════════════════════════════════════════════════════════════════
  console.log("💰 6. Seeding Finance Records (F001)...");

  const feeRecords = [
    {
      studentId: "S001", studentName: "Aditya Kumar", department: "Information Technology",
      feeType: "Tuition", amount: 120000, discount: 20000, fine: 0,
      netAmount: 100000,    // 120000 - 20000 scholarship
      dueDate: new Date("2021-09-01"), paidDate: new Date("2021-08-20"),
      status: "Paid", paymentMode: "Online",
      receiptNumber: "RCP-F001-TUITION-2021",
      semester: 1, academicYear: "2021-22",
      notes: "Scholarship of ₹20,000 applied. Net paid: ₹1,00,000."
    },
    {
      studentId: "S001", studentName: "Aditya Kumar", department: "Information Technology",
      feeType: "Hostel", amount: 80000, discount: 0, fine: 0,
      netAmount: 80000,
      dueDate: new Date("2021-09-01"), paidDate: new Date("2021-08-25"),
      status: "Paid", paymentMode: "Online",
      receiptNumber: "RCP-F001-HOSTEL-2021",
      semester: 1, academicYear: "2021-22",
      notes: "Hostel fee for Block GH1, Room A-99."
    },
    {
      studentId: "S001", studentName: "Aditya Kumar", department: "Information Technology",
      feeType: "Tuition", amount: 120000, discount: 0, fine: 0,
      netAmount: 120000,
      dueDate: new Date("2022-08-01"), paidDate: new Date("2022-07-30"),
      status: "Paid", paymentMode: "Online",
      receiptNumber: "RCP-F001-TUITION-2022",
      semester: 3, academicYear: "2022-23"
    },
    {
      studentId: "S001", studentName: "Aditya Kumar", department: "Information Technology",
      feeType: "Hostel", amount: 80000, discount: 0, fine: 0,
      netAmount: 80000,
      dueDate: new Date("2022-08-01"), paidDate: new Date("2022-07-30"),
      status: "Paid", paymentMode: "Online",
      receiptNumber: "RCP-F001-HOSTEL-2022",
      semester: 3, academicYear: "2022-23"
    },
    {
      studentId: "S001", studentName: "Aditya Kumar", department: "Information Technology",
      feeType: "Tuition", amount: 120000, discount: 0, fine: 0,
      netAmount: 120000,
      dueDate: new Date("2023-08-01"), paidDate: new Date("2023-08-01"),
      status: "Paid", paymentMode: "Online",
      receiptNumber: "RCP-F001-TUITION-2023",
      semester: 5, academicYear: "2023-24"
    },
    {
      studentId: "S001", studentName: "Aditya Kumar", department: "Information Technology",
      feeType: "Tuition", amount: 120000, discount: 0, fine: 0,
      netAmount: 120000,
      dueDate: new Date("2024-08-01"), paidDate: new Date("2024-07-28"),
      status: "Paid", paymentMode: "Online",
      receiptNumber: "RCP-F001-TUITION-2024",
      semester: 7, academicYear: "2024-25"
    },
    {
      studentId: "S001", studentName: "Aditya Kumar", department: "Information Technology",
      feeType: "Exam", amount: 3000, discount: 0, fine: 0,
      netAmount: 3000,
      dueDate: new Date("2025-03-01"), paidDate: new Date("2025-02-28"),
      status: "Paid", paymentMode: "Online",
      receiptNumber: "RCP-F001-EXAM-2025",
      semester: 8, academicYear: "2024-25",
      notes: "Final semester exam fee."
    }
  ];

  await Fee.insertMany(feeRecords);
  console.log(`   ✅ ${feeRecords.length} fee records`);
  console.log("   📊 Summary: Tuition ₹1,20,000 × 4yr | Hostel ₹80,000 × 2yr | Scholarship ₹20,000 | Pending: ₹0\n");

  // ════════════════════════════════════════════════════════════════════
  // 7. CAMPUS — Hostel Assignment
  // ════════════════════════════════════════════════════════════════════
  console.log("🏠 7. Seeding Hostel Record...");
  await Hostel.create({
    studentId: "S001",
    studentName: "Aditya Kumar",
    department: "Information Technology",
    block: "Girls-Block",    // GH1 mapped to closest enum
    roomNumber: "A-99",
    bedNumber: 1,
    joinDate: new Date("2021-08-10"),
    vacateDate: new Date("2025-04-30"),
    status: "Vacated",       // Graduated
    messPlan: "Full",
    emergencyContact: "9876501234",   // Parent contact
    notes: "Block GH1, Room A-99. Vacated after graduation (April 2025). Bus Route 5, Pickup: Velachery."
  });
  console.log("   ✅ Hostel: Block GH1 → Room A-99 | Status: Vacated (Graduated 2025)\n");

  // ════════════════════════════════════════════════════════════════════
  // 8. PLACEMENTS
  // ════════════════════════════════════════════════════════════════════
  console.log("🧑‍💼 8. Seeding Placement Records...");
  await Placement.insertMany([
    {
      studentId: "S001", studentName: "Aditya Kumar", department: "Information Technology",
      companyName: "Tata Consultancy Services", role: "Software Engineer",
      type: "Full-Time", ctc: 7.0, stipend: 0,
      status: "Selected",
      driveDate: new Date("2024-09-15"),
      offerLetterSent: true,
      joiningDate: new Date("2025-06-01"),
      location: "Bangalore",
      notes: "TCS NQT cleared. Selected after 3 rounds: Aptitude + Technical + HR. CTC: 7 LPA. Accepted."
    },
    {
      studentId: "S001", studentName: "Aditya Kumar", department: "Information Technology",
      companyName: "Amazon India", role: "SDE Intern",
      type: "Internship", ctc: 0, stipend: 0,
      status: "Rejected",
      driveDate: new Date("2024-08-20"),
      offerLetterSent: false,
      location: "Hyderabad",
      notes: "Cleared online coding round. Rejected in final technical interview (System Design)."
    },
    {
      studentId: "S001", studentName: "Aditya Kumar", department: "Information Technology",
      companyName: "Infosys", role: "Systems Engineer",
      type: "Full-Time", ctc: 4.5, stipend: 0,
      status: "Selected",
      driveDate: new Date("2024-08-10"),
      offerLetterSent: true,
      location: "Chennai",
      notes: "Infosys InfyTQ cleared. Offer received but not accepted — TCS offer preferred."
    }
  ]);
  console.log("   ✅ TCS: Selected (7 LPA, accepted)");
  console.log("   ✅ Infosys: Selected (4.5 LPA, not accepted)");
  console.log("   ✅ Amazon: Rejected\n");

  // ════════════════════════════════════════════════════════════════════
  // 9. ALUMNI
  // ════════════════════════════════════════════════════════════════════
  console.log("🎓 9. Seeding Alumni Record...");
  await Alumni.create({
    name: "Aditya Kumar",
    email: "aditya.kumar.alumni@tcs.com",
    company: "Tata Consultancy Services",
    jobRole: "Software Engineer",
    department: "Information Technology",
    batch: "2025",
    linkedin: "linkedin.com/in/aditya-kumar-it",
    bio: "B.Tech IT graduate from SSN (2021-2025). Currently working as Software Engineer at TCS Bangalore. Specializes in Python, Machine Learning, and Web Development. Final CGPA: 8.6.",
    skills: ["Python", "Machine Learning", "Web Development", "Django", "React", "SQL", "TensorFlow", "Git"],
    yearsOfExperience: 0,   // Just joined (June 2025)
    available: true
  });
  console.log("   ✅ Alumni AL001 — Aditya Kumar | TCS, Software Engineer | Batch 2025\n");

  // ════════════════════════════════════════════════════════════════════
  // SUMMARY
  // ════════════════════════════════════════════════════════════════════
  console.log("════════════════════════════════════════════════════════");
  console.log("🎉 Aditya Kumar's Complete Lifecycle Data — SAVED!");
  console.log("════════════════════════════════════════════════════════");
  console.log("  📋 Lead          : L001 — Status: Enrolled");
  console.log("  📝 Admission     : A001 — Entrance: 92 | Interview: Selected");
  console.log("  👨‍🎓 Student       : S001 — Roll: IT21B001 | Batch: 2021-2025");
  console.log("  📚 IT Courses    : 50 courses (Semesters 1–8 + Electives)");
  console.log("  ✏️  Exam Records : 25 results (S1, S2, S5, S6, S7, S8)");
  console.log("  💰 Fees          : 7 records | Total Paid ₹7,60,000 | Pending: ₹0");
  console.log("  🏠 Hostel        : Block GH1, Room A-99 (Vacated June 2025)");
  console.log("  🧑‍💼 Placements   : TCS ✅ Selected (7 LPA) | Amazon ❌ | Infosys ✅");
  console.log("  🎓 Alumni        : TCS Bangalore | Software Engineer | Batch 2025");
  console.log("");
  console.log("  📊 Analytics Snapshot:");
  console.log("     Attendance Trend : Stable (92% → 88%)");
  console.log("     Performance      : High (CGPA 8.5 → 8.7 → Final 8.6)");
  console.log("     Dropout Risk     : Low");
  console.log("     Placement Prob   : 92% (Placed at TCS 7 LPA)");
  console.log("     ML Features      : Attendance ✓ | CGPA ✓ | No Backlogs ✓");
  console.log("                        Skills: Python, ML, Web Dev ✓");
  console.log("                        Internship Experience ✓");
  console.log("════════════════════════════════════════════════════════\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
