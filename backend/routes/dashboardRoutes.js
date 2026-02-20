const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getAdminStats } = require("../controllers/dashboardController");

// GET /api/dashboard/stats → Admin only
router.get("/stats", authMiddleware(["Admin"]), getAdminStats);

module.exports = router;
