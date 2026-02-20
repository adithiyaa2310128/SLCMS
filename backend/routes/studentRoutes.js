const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require("../controllers/studentController");

router.post("/", authMiddleware(), createStudent);
router.get("/", authMiddleware(), getAllStudents);
router.get("/:id", authMiddleware(), getStudentById);
router.put("/:id", authMiddleware(), updateStudent);
router.delete("/:id", authMiddleware(), deleteStudent);

module.exports = router;
