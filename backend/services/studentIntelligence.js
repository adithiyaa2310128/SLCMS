const Student = require("../models/Student");

const updateStudentIntelligence = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student) {
    return;
  }

  /* 1️⃣ RISK STATUS (based on attendance + GPA) */
  let gpaPoints = 0;
  if (student.gpa < 6.0) gpaPoints = 3;
  else if (student.gpa < 7.0) gpaPoints = 2;
  else if (student.gpa <= 8.0) gpaPoints = 1;

  let attendancePoints = 0;
  if (student.attendancePercentage < 60) attendancePoints = 3;
  else if (student.attendancePercentage < 75) attendancePoints = 2;
  else if (student.attendancePercentage <= 85) attendancePoints = 1;

  let totalRiskScore = gpaPoints + attendancePoints;

  // Hard rules for severe deficiencies
  if (student.attendancePercentage < 50 || student.gpa < 4.0) {
    totalRiskScore = 6;
  }

  if (totalRiskScore >= 6) {
    student.riskStatus = "Critical";
  } else if (totalRiskScore >= 4) {
    student.riskStatus = "High";
  } else if (totalRiskScore >= 2) {
    student.riskStatus = "Medium";
  } else {
    student.riskStatus = "Low";
  }

  /* 2️⃣ PLACEMENT ELIGIBILITY */
  student.placementEligible =
    student.lifecycleStage === "Academic" &&
    student.attendancePercentage >= 75 &&
    student.gpa >= 6.5 &&
    (student.riskStatus === "Low" || student.riskStatus === "Medium");

  /* 3️⃣ LIFE CYCLE INDEX (0–100) */
  let index =
    (student.attendancePercentage * 0.4) +
    (student.gpa * 10 * 0.6);

  if (student.riskStatus === "High" || student.riskStatus === "Critical") {
    index -= 10;
  }

  student.lifeCycleIndex = Math.max(
    0,
    Math.min(100, Math.round(index))
  );

  await student.save();
};

module.exports = { updateStudentIntelligence };
