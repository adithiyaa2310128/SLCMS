const express = require("express");
const router = express.Router();
const c = require("../controllers/hostelController");

router.get("/", c.getAllHostel);
router.get("/stats", c.getHostelStats);
router.post("/", c.assignRoom);
router.put("/:id", c.updateHostel);
router.delete("/:id", c.deleteHostel);

module.exports = router;
