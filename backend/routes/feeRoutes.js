const express = require("express");
const router = express.Router();
const c = require("../controllers/feeController");

router.get("/", c.getAllFees);
router.get("/stats", c.getFeeStats);
router.post("/", c.createFee);
router.post("/:id/pay", c.recordPayment);
router.put("/:id", c.updateFee);
router.delete("/:id", c.deleteFee);

module.exports = router;
