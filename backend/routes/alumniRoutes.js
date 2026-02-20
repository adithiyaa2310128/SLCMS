const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    getAlumni,
    getAlumniById,
    createAlumni,
    updateAlumni,
    deleteAlumni
} = require("../controllers/alumniController");

router.get("/", authMiddleware(), getAlumni);
router.get("/:id", authMiddleware(), getAlumniById);
router.post("/", authMiddleware(), createAlumni);
router.put("/:id", authMiddleware(), updateAlumni);
router.delete("/:id", authMiddleware(), deleteAlumni);

module.exports = router;
