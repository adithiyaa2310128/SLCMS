/**
 * SLCMS — Master Seed Script
 * Seeds all collections with realistic sample data.
 *
 * Usage:  node seedAll.js
 *
 * ⚠️  This will DROP and RECREATE all collection data.
 *     Run only once (or when you want a fresh reset).
 */

require("dotenv").config();
const mongoose = require("mongoose");

// ── Models ───────────────────────────────────────────────────────────
const Student     = require("./models/Student");
const Alumni      = require("./models/Alumni");
const Attendance  = require("./models/Attendance");
const Marks       = require("./models/Marks");
const Lead        = require("./models/Lead");
const Admission   = require("./models/Admission");
const Course      = require("./models/Course");
const Exam        = require("./models/Exam");
const Fee         = require("./models/Fee");
const Placement   = require("./models/Placement");
const Hostel      = require("./models/Hostel");
const Announcement = require("./models/Announcement");

// ── Helpers ──────────────────────────────────────────────────────────
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max) => Math.round((Math.random() * (max - min) + min) * 10) / 10;
const randDate = (daysBack) => new Date(Date.now() - rand(0, daysBack) * 86400000);
const futureDate = (daysAhead) => new Date(Date.now() + rand(1, daysAhead) * 86400000);

const DEPARTMENTS = ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical", "Information Technology"];
const STUDENTS_PER_DEPT = 8; // 8 × 6 departments = 48 students

// ════════════════════════════════════════════════════════════════════
async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // ── 1. CLEAR ALL ────────────────────────────────────────────────
  console.log("\n🗑️  Clearing existing data...");
  await Promise.all([
    Student.deleteMany({}),
    Alumni.deleteMany({}),
    Attendance.deleteMany({}),
    Marks.deleteMany({}),
    Lead.deleteMany({}),
    Admission.deleteMany({}),
    Course.deleteMany({}),
    Exam.deleteMany({}),
    Fee.deleteMany({}),
    Placement.deleteMany({}),
    Hostel.deleteMany({}),
    Announcement.deleteMany({}),
  ]);
  console.log("✅ All collections cleared");

  // ── 2. STUDENTS ─────────────────────────────────────────────────
  console.log("\n👨‍🎓 Seeding Students...");
  const firstNames = ["Arjun","Priya","Rahul","Sneha","Karthik","Divya","Arun","Meera","Vikram","Pooja","Santhosh","Lakshmi","Harish","Nithya","Suresh","Anu","Dhanush","Geetha","Naveen","Revathi","Manoj","Swathi","Ravi","Kavitha","Aditya","Saranya","Mithun","Thenmozhi","Prasanth","Nandini"];
  const lastNames  = ["Kumar","Sharma","Patel","Singh","Nair","Iyer","Pillai","Krishnan","Venkat","Rajan","Gopal","Murthy","Reddy","Naidu","Subramanian"];

  const lifecycleStages = ["ENROLLED","ACADEMICS","ACADEMICS","ACADEMICS","GRADUATION_ELIGIBLE"];
  const riskStatuses    = ["Low","Low","Low","Medium","High","Critical"];

  const students = [];
  let studentCounter = 1;
  for (const dept of DEPARTMENTS) {
    for (let i = 0; i < STUDENTS_PER_DEPT; i++) {
      const name = `${pick(firstNames)} ${pick(lastNames)}`;
      const sid  = `STU-${String(studentCounter).padStart(3,"0")}`;
      const sem  = rand(1, 8);
      const att  = rand(45, 98);
      const gpa  = randFloat(4.0, 10.0);
      const risk = att < 60 || gpa < 5.0 ? pick(["High","Critical"]) :
                   att < 75 || gpa < 6.5 ? "Medium" : "Low";

      students.push({
        _id: sid,
        studentId: sid,
        name,
        email: `${name.toLowerCase().replace(/\s/g,".")}${studentCounter}@college.edu`,
        department: dept,
        currentSemester: sem,
        lifecycleStage: pick(lifecycleStages),
        attendancePercentage: att,
        gpa,
        riskStatus: risk,
        lifeCycleIndex: Math.max(0, Math.min(100, Math.round(att * 0.4 + gpa * 10 * 0.6))),
        placementEligible: att >= 75 && gpa >= 6.5 && (risk === "Low" || risk === "Medium"),
      });
      studentCounter++;
    }
  }
  await Student.insertMany(students);
  console.log(`   ✅ ${students.length} students`);

  // ── 3 & 4. ATTENDANCE + MARKS (legacy) ──────────────────────────
  // Note: These legacy models use ObjectId ref — seeding skipped to
  // avoid cast conflicts with custom string _id. Use the app UI or
  // existing seedAdmin/seedAlumni scripts for those collections.
  console.log("\n⏭️  Skipping legacy Attendance & Marks (ObjectId schema conflict)");
  const attDocs = []; const marksDocs = [];
  const subjects = ["DS","OS","DBMS","CN","SE","ML","AI","Web","Math","Physics"];

  // ── 5. LEADS ────────────────────────────────────────────────────
  console.log("\n📋 Seeding Leads...");
  const leadNames = ["Aarav Shah","Ishaan Menon","Vihaan Nair","Ananya Reddy","Diya Kapoor","Myra Sharma","Riya Patel","Arnav Gupta","Kabir Joshi","Aditi Rao","Sai Charan","Bhavana Rao","Tejesh Kumar","Varsha Devi","Lokesh Iyer","Shruti Verma","Ashwin Pillai","Nimisha Nambiar","Ganesh Babu","Preethi Krishnan","Aakash Teja","Pavithra Sundaram","Ram Prasad","Keerthana Murugan","Vijay Anand"];
  const sources  = ["Website","Event","Campaign","Referral","Social Media","Walk-in"];
  const statuses = ["New","Contacted","Interested","Applied","Enrolled","Dropped"];
  const programs = ["B.Tech Computer Science","B.Tech Electronics","B.Tech Mechanical","B.Tech Civil","B.E. Electrical","MCA","MBA","M.Tech AI"];

  const leads = leadNames.map((name, i) => ({
    name,
    email: `${name.toLowerCase().replace(/\s/g,".")}${i+1}@gmail.com`,
    phone: `+91 ${rand(70,99)}${rand(10000000,99999999)}`,
    source: pick(sources),
    program: pick(programs),
    status: pick(statuses),
    campaign: pick(["Open Day 2026","National Science Fair","Instagram Ad","Google Ad",""]),
    followUpDate: Math.random() > 0.4 ? futureDate(30) : null,
    notes: [],
  }));
  await Lead.insertMany(leads);
  console.log(`   ✅ ${leads.length} leads`);

  // ── 6. ADMISSIONS ───────────────────────────────────────────────
  console.log("\n📝 Seeding Admissions...");
  const appNames = ["Surya Prakash","Harini Devi","Kiran Babu","Vinitha Raj","Subash Chandra","Amala Shree","Bharath Raj","Hema Malini","Gowtham S","Lekha Priya","Dinesh Kumar","Arun Raj","Swetha Nair","Vishal Kumar","Preeti Singh","Mohan Lal","Rishika Sharma","Ajay Prabhu","Soundarya M","Nithin G"];
  const appStatuses = ["Pending","Pending","Shortlisted","Shortlisted","Selected","Selected","Rejected","Enrolled","Enrolled","Enrolled"];

  const admissions = appNames.map((name, i) => ({
    applicationNumber: `APP-2026-${String(i+1).padStart(4,"0")}`,
    name,
    email: `${name.toLowerCase().replace(/\s/g,".")}@apply.edu`,
    phone: `+91 9${rand(100000000,999999999)}`,
    program: pick(["B.Tech","B.E.","M.Tech","MCA","MBA"]),
    department: pick(DEPARTMENTS),
    applicationStatus: pick(appStatuses),
    documents: [
      { name: "ID Proof", uploaded: Math.random() > 0.3 },
      { name: "10th Marksheet", uploaded: Math.random() > 0.3 },
      { name: "12th Marksheet", uploaded: Math.random() > 0.5 },
      { name: "Transfer Certificate", uploaded: Math.random() > 0.6 },
      { name: "Photo", uploaded: true },
    ],
    entranceScore: rand(45, 99),
    interviewDate: Math.random() > 0.4 ? randDate(30) : null,
    offerLetterSent: Math.random() > 0.6,
    feesPaid: Math.random() > 0.7,
    notes: "",
  }));
  await Admission.insertMany(admissions);
  console.log(`   ✅ ${admissions.length} applications`);

  // ── 7. COURSES ──────────────────────────────────────────────────
  console.log("\n📚 Seeding Courses...");
  const courseData = [
    // CS
    { courseCode:"CS301", title:"Data Structures & Algorithms", department:"Computer Science", credits:4, semester:3, facultyName:"Dr. Ramesh Kumar", facultyEmail:"ramesh@college.edu", maxStudents:60, enrolledCount:52 },
    { courseCode:"CS401", title:"Database Management Systems", department:"Computer Science", credits:3, semester:4, facultyName:"Prof. Lakshmi Devi", facultyEmail:"lakshmi@college.edu", maxStudents:60, enrolledCount:58 },
    { courseCode:"CS501", title:"Artificial Intelligence", department:"Computer Science", credits:4, semester:5, facultyName:"Dr. Anand Raj", facultyEmail:"anand@college.edu", maxStudents:50, enrolledCount:45 },
    { courseCode:"CS601", title:"Machine Learning", department:"Computer Science", credits:4, semester:6, facultyName:"Dr. Priya Menon", facultyEmail:"priya@college.edu", maxStudents:50, enrolledCount:48 },
    { courseCode:"CS201", title:"Object Oriented Programming", department:"Computer Science", credits:3, semester:2, facultyName:"Prof. Suresh Nair", facultyEmail:"suresh@college.edu", maxStudents:65, enrolledCount:62 },
    // Electronics
    { courseCode:"EC301", title:"Digital Electronics", department:"Electronics", credits:4, semester:3, facultyName:"Dr. Karthik Pillai", facultyEmail:"karthik@college.edu", maxStudents:55, enrolledCount:50 },
    { courseCode:"EC401", title:"Signal Processing", department:"Electronics", credits:3, semester:4, facultyName:"Prof. Meera Krishnan", facultyEmail:"meera@college.edu", maxStudents:55, enrolledCount:45 },
    { courseCode:"EC501", title:"VLSI Design", department:"Electronics", credits:4, semester:5, facultyName:"Dr. Santhosh Rao", facultyEmail:"santhosh@college.edu", maxStudents:40, enrolledCount:35 },
    // Mechanical
    { courseCode:"ME301", title:"Thermodynamics", department:"Mechanical", credits:4, semester:3, facultyName:"Dr. Venkat Subramanian", facultyEmail:"venkat@college.edu", maxStudents:60, enrolledCount:55 },
    { courseCode:"ME401", title:"Fluid Mechanics", department:"Mechanical", credits:3, semester:4, facultyName:"Prof. Geetha Naidu", facultyEmail:"geetha@college.edu", maxStudents:60, enrolledCount:50 },
    // Civil
    { courseCode:"CE301", title:"Structural Analysis", department:"Civil", credits:4, semester:3, facultyName:"Dr. Ravi Iyer", facultyEmail:"ravi@college.edu", maxStudents:55, enrolledCount:48 },
    { courseCode:"CE401", title:"Soil Mechanics", department:"Civil", credits:3, semester:4, facultyName:"Prof. Kavitha Murthy", facultyEmail:"kavitha@college.edu", maxStudents:55, enrolledCount:40 },
    // Electrical
    { courseCode:"EE301", title:"Electrical Machines", department:"Electrical", credits:4, semester:3, facultyName:"Dr. Naveen Reddy", facultyEmail:"naveen@college.edu", maxStudents:55, enrolledCount:52 },
    { courseCode:"EE401", title:"Power Systems", department:"Electrical", credits:3, semester:4, facultyName:"Prof. Swathi Sharma", facultyEmail:"swathi@college.edu", maxStudents:55, enrolledCount:44 },
    // IT
    { courseCode:"IT301", title:"Web Technologies", department:"Information Technology", credits:3, semester:3, facultyName:"Dr. Manoj Patel", facultyEmail:"manoj@college.edu", maxStudents:60, enrolledCount:57 },
    { courseCode:"IT401", title:"Cloud Computing", department:"Information Technology", credits:4, semester:5, facultyName:"Prof. Saranya Singh", facultyEmail:"saranya@college.edu", maxStudents:50, enrolledCount:48 },
  ];
  await Course.insertMany(courseData);
  console.log(`   ✅ ${courseData.length} courses`);

  // ── 8. EXAMS ────────────────────────────────────────────────────
  console.log("\n✏️  Seeding Exam Results...");
  const examTypes = ["Internal-1","Internal-2","Mid-Sem","End-Sem","Practical"];
  const examDocs  = [];
  for (const s of students.slice(0, 30)) {
    const numExams = rand(3, 6);
    for (let e = 0; e < numExams; e++) {
      const course = pick(courseData.filter(c => c.department === s.department));
      const maxM   = pick([25, 50, 100]);
      const obtM   = rand(Math.floor(maxM * 0.35), maxM);
      examDocs.push({
        studentId: s.studentId,
        studentName: s.name,
        courseCode: course.courseCode,
        courseName: course.title,
        department: s.department,
        semester: s.currentSemester,
        type: pick(examTypes),
        maxMarks: maxM,
        obtainedMarks: obtM,
        examDate: randDate(90),
      });
    }
  }
  await Exam.insertMany(examDocs);
  console.log(`   ✅ ${examDocs.length} exam records`);

  // ── 9. FEES ─────────────────────────────────────────────────────
  console.log("\n💰 Seeding Fee Records...");
  const feeTypes = ["Tuition","Hostel","Transport","Library","Lab","Exam"];
  const feeAmounts = { Tuition:75000, Hostel:30000, Transport:8000, Library:2000, Lab:5000, Exam:3000 };
  const feeStatuses = ["Paid","Paid","Paid","Pending","Overdue"];
  const payModes = ["Online","UPI","Cash","DD"];
  const feeDocs = [];

  for (const s of students.slice(0, 35)) {
    // Tuition fee for every student
    const tuitionStatus = pick(feeStatuses);
    feeDocs.push({
      studentId: s.studentId,
      studentName: s.name,
      department: s.department,
      feeType: "Tuition",
      amount: 75000,
      discount: rand(0,1) === 1 ? pick([5000, 10000, 0]) : 0,
      fine: tuitionStatus === "Overdue" ? 1500 : 0,
      netAmount: tuitionStatus === "Overdue" ? 76500 : 75000,
      dueDate: randDate(45),
      paidDate: tuitionStatus === "Paid" ? randDate(30) : null,
      status: tuitionStatus,
      paymentMode: tuitionStatus === "Paid" ? pick(payModes) : "",
      receiptNumber: tuitionStatus === "Paid" ? `RCP-${Date.now()}-${rand(1000,9999)}` : "",
      semester: s.currentSemester,
      academicYear: "2025-26",
    });
    // Optional hostel fee
    if (Math.random() > 0.5) {
      const hStatus = pick(feeStatuses);
      feeDocs.push({
        studentId: s.studentId,
        studentName: s.name,
        department: s.department,
        feeType: "Hostel",
        amount: 30000,
        discount: 0,
        fine: hStatus === "Overdue" ? 600 : 0,
        netAmount: hStatus === "Overdue" ? 30600 : 30000,
        dueDate: randDate(30),
        paidDate: hStatus === "Paid" ? randDate(20) : null,
        status: hStatus,
        paymentMode: hStatus === "Paid" ? pick(payModes) : "",
        receiptNumber: hStatus === "Paid" ? `RCP-${Date.now()}-${rand(1000,9999)}` : "",
        semester: s.currentSemester,
        academicYear: "2025-26",
      });
    }
  }
  await Fee.insertMany(feeDocs);
  console.log(`   ✅ ${feeDocs.length} fee records`);

  // ── 10. PLACEMENTS ──────────────────────────────────────────────
  console.log("\n🧑‍💼 Seeding Placements...");
  const companies = [
    { name:"Tata Consultancy Services", roles:["Software Engineer","Systems Analyst","QA Analyst"], ctcRange:[4,7] },
    { name:"Infosys", roles:["Systems Engineer","Developer","Associate"], ctcRange:[3.5,6] },
    { name:"Wipro Technologies", roles:["Software Developer","Tech Analyst"], ctcRange:[3.5,5.5] },
    { name:"Google India", roles:["Software Engineer L3","SWE Intern"], ctcRange:[20,35] },
    { name:"Microsoft India", roles:["SDE-1","Cloud Solutions Architect"], ctcRange:[18,30] },
    { name:"Amazon India", roles:["SDE-1","Solutions Architect"], ctcRange:[15,28] },
    { name:"HCL Technologies", roles:["Software Engineer","Technical Lead"], ctcRange:[4,8] },
    { name:"Zoho Corporation", roles:["Software Developer","QA Engineer"], ctcRange:[5,9] },
    { name:"Cognizant", roles:["Programmer Analyst","Associate"], ctcRange:[3.5,5] },
    { name:"L&T Technology Services", roles:["Engineer","Senior Engineer"], ctcRange:[5,10] },
    { name:"Tech Mahindra", roles:["Associate Software Engineer","Developer"], ctcRange:[3.5,6] },
    { name:"Freshworks", roles:["Software Engineer","Product Analyst"], ctcRange:[8,15] },
  ];
  const placementStatuses = ["Applied","Shortlisted","Interview","Selected","Rejected"];
  const placementDocs = [];

  // Eligible students in final semesters
  const eligibleStudents = students.filter(s => s.currentSemester >= 6 && s.attendancePercentage >= 70);
  for (const s of eligibleStudents.slice(0, 28)) {
    const numApps = rand(2, 4);
    for (let p = 0; p < numApps; p++) {
      const co = pick(companies);
      const role = pick(co.roles);
      const status = pick(placementStatuses);
      const isInternship = role.includes("Intern") || Math.random() > 0.85;
      placementDocs.push({
        studentId: s.studentId,
        studentName: s.name,
        department: s.department,
        companyName: co.name,
        role,
        type: isInternship ? "Internship" : "Full-Time",
        ctc: !isInternship && status === "Selected" ? randFloat(co.ctcRange[0], co.ctcRange[1]) : 0,
        stipend: isInternship && status === "Selected" ? pick([15000, 20000, 25000, 30000]) : 0,
        status,
        driveDate: randDate(60),
        offerLetterSent: status === "Selected" && Math.random() > 0.3,
        location: pick(["Bangalore","Chennai","Hyderabad","Mumbai","Pune","Delhi"]),
      });
    }
  }
  await Placement.insertMany(placementDocs);
  console.log(`   ✅ ${placementDocs.length} placement records`);

  // ── 11. HOSTEL ──────────────────────────────────────────────────
  console.log("\n🏠 Seeding Hostel Records...");
  const blocks = ["A","B","C","D","Girls-Block"];
  const messPlan = ["Full","Lunch-Dinner","Full","Full","None"];
  const hostelDocs = [];
  // Pick ~20 students for hostel
  const hostelStudents = students.filter((_,i) => i % 3 === 0).slice(0, 20);
  for (const [i, s] of hostelStudents.entries()) {
    const block = pick(blocks);
    hostelDocs.push({
      studentId: s.studentId,
      studentName: s.name,
      department: s.department,
      block,
      roomNumber: `${block}-${rand(101, 250)}`,
      bedNumber: rand(1, 3),
      joinDate: randDate(180),
      status: Math.random() > 0.1 ? "Active" : "Vacated",
      messPlan: pick(messPlan),
      emergencyContact: `+91 9${rand(100000000,999999999)}`,
    });
  }
  await Hostel.insertMany(hostelDocs);
  console.log(`   ✅ ${hostelDocs.length} hostel assignments`);

  // ── 12. ALUMNI ──────────────────────────────────────────────────
  console.log("\n🎓 Seeding Alumni...");
  const alumniData = [
    { name:"Sathish Raj Moorthy", email:"sathish.raj@tcs.com", company:"Tata Consultancy Services", jobRole:"Technical Lead", department:"Computer Science", batch:"2022", linkedin:"linkedin.com/in/sathish", skills:["Java","Spring Boot","Microservices","AWS"], yearsOfExperience:3 },
    { name:"Deepa Krishnan", email:"deepa.krishnan@google.com", company:"Google India", jobRole:"Software Engineer L4", department:"Computer Science", batch:"2020", linkedin:"linkedin.com/in/deepak", skills:["Python","Machine Learning","TensorFlow","GCP"], yearsOfExperience:5 },
    { name:"Vinod Balakrishnan", email:"vinod.bala@infosys.com", company:"Infosys", jobRole:"Senior Systems Engineer", department:"Electronics", batch:"2021", linkedin:"", skills:["Embedded C","FPGA","VLSI","AutoCAD"], yearsOfExperience:4 },
    { name:"Kavitha Suresh", email:"kavitha.s@microsoft.com", company:"Microsoft India", jobRole:"SDE-2", department:"Information Technology", batch:"2019", linkedin:"linkedin.com/in/kavitha", skills:["C#",".NET","Azure","TypeScript"], yearsOfExperience:6 },
    { name:"Murugesan Annamalai", email:"murugesh@zoho.com", company:"Zoho Corporation", jobRole:"Software Developer", department:"Computer Science", batch:"2023", linkedin:"", skills:["Python","Django","PostgreSQL","React"], yearsOfExperience:2 },
    { name:"Anitha Devi Saravanan", email:"anitha.saravanan@wipro.com", company:"Wipro Technologies", jobRole:"Tech Analyst", department:"Information Technology", batch:"2022", linkedin:"linkedin.com/in/anitha", skills:["Java","Selenium","JIRA","Agile"], yearsOfExperience:3 },
    { name:"Praveen Ravi Kumar", email:"praveen.rk@amazon.com", company:"Amazon India", jobRole:"SDE-1", department:"Computer Science", batch:"2021", linkedin:"linkedin.com/in/praveen", skills:["Java","AWS","DynamoDB","KDS"], yearsOfExperience:4 },
    { name:"Subashini Krishnamurthy", email:"subashini@freshworks.com", company:"Freshworks", jobRole:"Software Engineer", department:"Computer Science", batch:"2023", linkedin:"", skills:["Ruby on Rails","React","MySQL","Redis"], yearsOfExperience:2 },
    { name:"Gowtham Arumugam", email:"gowtham.a@ltts.com", company:"L&T Technology Services", jobRole:"Senior Engineer", department:"Mechanical", batch:"2020", linkedin:"linkedin.com/in/gowtham", skills:["AutoCAD","SolidWorks","FEM","MATLAB"], yearsOfExperience:5 },
    { name:"Sangeetha Murugan Pillai", email:"sangeetha@cognizant.com", company:"Cognizant", jobRole:"Programmer Analyst", department:"Electronics", batch:"2022", linkedin:"", skills:["Testing","Manual QA","JIRA","Agile"], yearsOfExperience:3 },
    { name:"Balaji Venkataraman", email:"balaji.v@hcl.com", company:"HCL Technologies", jobRole:"Technical Lead", department:"Electrical", batch:"2018", linkedin:"linkedin.com/in/balaji", skills:["Embedded Systems","PLC","SCADA","IoT"], yearsOfExperience:7 },
    { name:"Prithika Ramamoorthy", email:"prithika@techmahindra.com", company:"Tech Mahindra", jobRole:"Associate Software Engineer", department:"Civil", batch:"2023", linkedin:"", skills:["AutoCAD","Revit","Project Management","MS Project"], yearsOfExperience:2 },
  ];
  await Alumni.insertMany(alumniData);
  console.log(`   ✅ ${alumniData.length} alumni`);

  // ── 13. ANNOUNCEMENTS ───────────────────────────────────────────
  console.log("\n📢 Seeding Announcements...");
  const announcements = [
    { title:"Semester Exam Schedule Released", body:"The End Semester Examinations for all departments will commence from 15th April 2026. Students are advised to check the detailed timetable on the student portal. Hall tickets will be distributed one week before the exams.", type:"Urgent", targetAudience:"Students", isPinned:true, createdBy:"Controller of Examinations", expiresAt:new Date("2026-04-20") },
    { title:"Campus Placement Drive — Google India", body:"Google India will be conducting its placement drive on 10th April 2026. All BE/B.Tech final year students with CGPA ≥ 7.0 and no active backlogs are eligible to apply. Register on the placement portal by 5th April.", type:"Placement", targetAudience:"Students", isPinned:true, createdBy:"Placement Cell", expiresAt:new Date("2026-04-10") },
    { title:"Fee Payment Reminder — Last Date Extended", body:"The last date for payment of Semester-2 fees has been extended to 10th April 2026. Students who have not paid may do so through the student portal or at the accounts office. A late fine of ₹500/week will be charged post the deadline.", type:"Finance", targetAudience:"Students", isPinned:false, createdBy:"Finance Department", expiresAt:new Date("2026-04-10") },
    { title:"Annual Tech Fest — INNOVATE 2026", body:"INNOVATE 2026, our annual national-level technical festival, will be held on 25–27 April 2026. Events include hackathons, paper presentations, robotics, and coding contests. Registrations are now open. Visit the fest portal for details.", type:"Event", targetAudience:"All", isPinned:false, createdBy:"Student Activities Committee", expiresAt:new Date("2026-04-25") },
    { title:"New AI Lab Inauguration", body:"The state-of-the-art Artificial Intelligence & Machine Learning Lab (Lab Block C, Room 302) will be inaugurated by the Director on 5th April 2026. Faculty and students from CS and IT departments are invited to attend the ceremony.", type:"Academic", targetAudience:"All", isPinned:false, createdBy:"HOD Computer Science" },
    { title:"Holiday Notice — Tamil New Year", body:"The college will remain closed on 14th April 2026 on account of Tamil New Year (Puthandu). Regular classes will resume on 15th April 2026.", type:"General", targetAudience:"All", isPinned:false, createdBy:"Principal Office" },
    { title:"NPTEL Online Course Enrollment Open", body:"Enrollment for NPTEL online courses for the Jan–Apr 2026 semester is now open. Students can earn academic credits for completing these courses. Refer to your department coordinator for eligible courses.", type:"Academic", targetAudience:"Students", isPinned:false, createdBy:"Academic Dean" },
    { title:"Research Internship Opportunity — IIT Madras", body:"IIT Madras is offering summer research internships for outstanding B.Tech/BE students (CGPA ≥ 8.0). Duration: May–July 2026. Apply through the placement portal by 20th April. Stipend: ₹10,000/month.", type:"Placement", targetAudience:"Students", isPinned:false, createdBy:"Placement Cell" },
  ];
  await Announcement.insertMany(announcements);
  console.log(`   ✅ ${announcements.length} announcements`);

  // ── DONE ────────────────────────────────────────────────────────
  console.log("\n════════════════════════════════════════════════");
  console.log("🎉 Database seeded successfully!");
  console.log("════════════════════════════════════════════════");
  console.log(`  Students       : ${students.length}`);
  console.log(`  Attendance     : skipped (legacy schema)`);
  console.log(`  Leads          : ${leads.length}`);
  console.log(`  Admissions     : ${admissions.length}`);
  console.log(`  Courses        : ${courseData.length}`);
  console.log(`  Exam Results   : ${examDocs.length}`);
  console.log(`  Fee Records    : ${feeDocs.length}`);
  console.log(`  Placements     : ${placementDocs.length}`);
  console.log(`  Hostel         : ${hostelDocs.length}`);
  console.log(`  Alumni         : ${alumniData.length}`);
  console.log(`  Announcements  : ${announcements.length}`);
  console.log("════════════════════════════════════════════════\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
