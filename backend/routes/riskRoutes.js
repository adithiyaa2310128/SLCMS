const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { getAtRiskStudents } = require("../controllers/riskController");

router.get("/at-risk", authMiddleware, getAtRiskStudents);

module.exports = router;
