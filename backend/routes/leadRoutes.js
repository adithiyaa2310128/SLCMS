const express = require("express");
const router = express.Router();
const c = require("../controllers/leadController");

router.get("/", c.getAllLeads);
router.get("/stats", c.getLeadStats);
router.get("/:id", c.getLeadById);
router.post("/", c.createLead);
router.put("/:id", c.updateLead);
router.delete("/:id", c.deleteLead);

module.exports = router;
