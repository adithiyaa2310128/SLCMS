const express = require("express");
const router = express.Router();
const c = require("../controllers/examController");

router.get("/", c.getAllExams);
router.get("/cgpa/:studentId", c.getStudentCGPA);
router.post("/", c.addExamResult);
router.put("/:id", c.updateExamResult);
router.delete("/:id", c.deleteExamResult);

module.exports = router;
