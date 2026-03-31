const express = require("express");
const router = express.Router();
const c = require("../controllers/admissionController");

router.get("/", c.getAllAdmissions);
router.get("/stats", c.getAdmissionStats);
router.post("/", c.createAdmission);
router.put("/:id", c.updateAdmission);
router.post("/:id/enroll", c.enrollApplicant);
router.delete("/:id", c.deleteAdmission);

module.exports = router;
