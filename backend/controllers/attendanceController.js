const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const { updateStudentIntelligence } = require("../services/studentIntelligence");

// ➕ Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, subject } = req.body;

    // 1️⃣ Save attendance record
    await Attendance.create({
      studentId,
      date,
      status,
      subject
    });

    // 2️⃣ Recalculate attendance percentage
    const totalClasses = await Attendance.countDocuments({ studentId });
    const presentCount = await Attendance.countDocuments({
      studentId,
      status: "Present"
    });

    const attendancePercentage =
      totalClasses === 0 ? 0 : (presentCount / totalClasses) * 100;

    // 3️⃣ Update student attendance
    await Student.findByIdAndUpdate(studentId, {
      attendancePercentage
    });

    // 4️⃣ Update intelligence (risk, lifecycle, placement, index)
    await updateStudentIntelligence(studentId);

    res.status(201).json({
      message: "Attendance marked successfully",
      attendancePercentage
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to mark attendance",
      error: error.message
    });
  }
};

// 📥 Get attendance by student
exports.getAttendanceByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const records = await Attendance.find({ studentId });

    // Calculate percentage
    const totalClasses = records.length;
    const presentCount = records.filter(r => r.status === "Present").length;
    const attendancePercentage =
      totalClasses === 0 ? 0 : Math.round((presentCount / totalClasses) * 100);

    res.status(200).json({
      attendance: records,
      attendancePercentage
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch attendance",
      error: error.message
    });
  }
};
