const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getChatHistory } = require("../controllers/chatController");

router.get("/:room", authMiddleware(), getChatHistory);

module.exports = router;
