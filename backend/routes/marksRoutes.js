const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  addMarks,
  getMarksByStudent
} = require("../controllers/marksController");

// POST marks
router.post("/", authMiddleware(), addMarks);

// GET marks by student
router.get("/:studentId", authMiddleware(), getMarksByStudent);

module.exports = router;
