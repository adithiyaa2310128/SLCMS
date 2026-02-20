const Student = require("../models/Student");
const Alumni = require("../models/Alumni");
const Attendance = require("../models/Attendance");
const Chat = require("../models/Chat");

exports.getAdminStats = async (req, res) => {
    try {
        // 1. Total Student Count
        const totalStudents = await Student.countDocuments();

        // 2. Total Alumni Count
        const totalAlumni = await Alumni.countDocuments();

        // 3. Average Attendance
        const allAttendance = await Attendance.find();
        let averageAttendance = 0;
        if (allAttendance.length > 0) {
            const presentCount = allAttendance.filter(a => a.status === "Present").length;
            averageAttendance = Math.round((presentCount / allAttendance.length) * 100);
        }

        // 4. At-Risk Students (Simple logic: students with less than 75% attendance or poor marks)
        // For now, we'll reuse the logic from riskController if possible or just provide a count
        // Based on DashboardComponent, it fetch from /api/risk/at-risk
        // We can just return the count for now, and let the frontend keep its existing call if needed,
        // but better to aggregate it here.

        // 5. Recent Chat Messages
        const recentChats = await Chat.find()
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            totalStudents,
            totalAlumni,
            averageAttendance,
            recentChats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
