const Student = require("../models/Student");

const updateStudentIntelligence = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student) return;

  /* 1️⃣ RISK STATUS (based on attendance + GPA) */
  if (
    student.attendancePercentage < 75 ||
    student.gpa < 6
  ) {
    student.riskStatus = "At Risk";
  } else {
    student.riskStatus = "Normal";
  }

  /* 2️⃣ PLACEMENT ELIGIBILITY */
  student.placementEligible =
    student.lifecycleStage === "Academic" &&
    student.attendancePercentage >= 75 &&
    student.gpa >= 6.5 &&
    student.riskStatus === "Normal";

  /* 3️⃣ LIFE CYCLE INDEX (0–100) */
  let index =
    (student.attendancePercentage * 0.4) +
    (student.gpa * 10 * 0.6);

  if (student.riskStatus === "At Risk") {
    index -= 10;
  }

  student.lifeCycleIndex = Math.max(
    0,
    Math.round(index)
  );

  await student.save();
};

module.exports = { updateStudentIntelligence };
