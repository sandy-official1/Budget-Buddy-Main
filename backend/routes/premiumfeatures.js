const express = require("express");
const { getUserLeaderBoard } = require("../controllers/premiumfeatures.js");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

router.get("/showLeaderBoard", authenticateToken, getUserLeaderBoard);

module.exports = router;
