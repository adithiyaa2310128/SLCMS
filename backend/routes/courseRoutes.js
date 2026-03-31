const express = require("express");
const router = express.Router();
const c = require("../controllers/courseController");

router.get("/", c.getAllCourses);
router.get("/:id", c.getCourseById);
router.post("/", c.createCourse);
router.put("/:id", c.updateCourse);
router.delete("/:id", c.deleteCourse);

module.exports = router;
