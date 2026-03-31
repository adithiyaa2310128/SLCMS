const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Exam = require("../models/Exam");
const Fee = require("../models/Fee");
const Placement = require("../models/Placement");
const Lead = require("../models/Lead");
const Admission = require("../models/Admission");
const Alumni = require("../models/Alumni");

exports.getAnalytics = async (req, res) => {
  try {
    // ── Student Overview ──────────────────────────────────────────────
    const totalStudents = await Student.countDocuments();
    const byDepartment = await Student.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } }
    ]);
    const byLifecycle = await Student.aggregate([
      { $group: { _id: "$lifecycleStage", count: { $sum: 1 } } }
    ]);
    const byRisk = await Student.aggregate([
      { $group: { _id: "$riskStatus", count: { $sum: 1 } } }
    ]);

    // ── Attendance ────────────────────────────────────────────────────
    const allAttendance = await Attendance.find();
    const presentCount = allAttendance.filter(a => a.status === "Present").length;
    const avgAttendance = allAttendance.length > 0
      ? Math.round((presentCount / allAttendance.length) * 100) : 0;

    // ── Leads & Admissions Funnel ─────────────────────────────────────
    const totalLeads = await Lead.countDocuments();
    const enrolledLeads = await Lead.countDocuments({ status: "Enrolled" });
    const totalApps = await Admission.countDocuments();
    const selectedApps = await Admission.countDocuments({ applicationStatus: "Selected" });
    const enrolledApps = await Admission.countDocuments({ applicationStatus: "Enrolled" });

    // ── Finance ───────────────────────────────────────────────────────
    const feeAgg = await Fee.aggregate([
      {
        $group: {
          _id: "$status",
          total: { $sum: "$netAmount" },
          count: { $sum: 1 }
        }
      }
    ]);

    // ── Placement ────────────────────────────────────────────────────
    const placedStudents = await Placement.distinct("studentId", { status: "Selected" });
    const totalApplied = await Placement.distinct("studentId");
    const avgCTC = await Placement.aggregate([
      { $match: { status: "Selected", type: "Full-Time", ctc: { $gt: 0 } } },
      { $group: { _id: null, avg: { $avg: "$ctc" } } }
    ]);

    // ── Alumni ───────────────────────────────────────────────────────
    const totalAlumni = await Alumni.countDocuments();

    // ── At-Risk breakdown ────────────────────────────────────────────
    const criticalStudents = await Student.find({ riskStatus: { $in: ["High", "Critical"] } })
      .select("name department riskStatus attendancePercentage gpa")
      .sort({ riskStatus: -1 })
      .limit(10);

    res.json({
      overview: { totalStudents, totalAlumni },
      byDepartment,
      byLifecycle,
      byRisk,
      attendance: { avgAttendance, total: allAttendance.length, present: presentCount },
      admissionFunnel: {
        leads: totalLeads,
        applied: totalApps,
        selected: selectedApps,
        enrolled: enrolledApps,
        leadConversion: totalLeads > 0 ? Math.round((enrolledLeads / totalLeads) * 100) : 0,
        admissionConversion: totalApps > 0 ? Math.round((enrolledApps / totalApps) * 100) : 0
      },
      finance: feeAgg,
      placement: {
        studentsApplied: totalApplied.length,
        studentsPlaced: placedStudents.length,
        placementRate: totalApplied.length > 0
          ? Math.round((placedStudents.length / totalApplied.length) * 100) : 0,
        avgCTC: Math.round((avgCTC[0]?.avg || 0) * 10) / 10
      },
      atRiskStudents: criticalStudents
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
