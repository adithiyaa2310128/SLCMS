const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  markAttendance,
  getAttendanceByStudent
} = require("../controllers/attendanceController");

// POST → mark attendance
router.post("/", authMiddleware(), markAttendance);

// GET → attendance of one student
router.get("/:studentId", authMiddleware(), getAttendanceByStudent);

module.exports = router;
