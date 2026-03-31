const express = require("express");
const router = express.Router();
const c = require("../controllers/placementController");

router.get("/", c.getAllPlacements);
router.get("/stats", c.getPlacementStats);
router.post("/", c.createPlacement);
router.put("/:id", c.updatePlacement);
router.delete("/:id", c.deletePlacement);

module.exports = router;
