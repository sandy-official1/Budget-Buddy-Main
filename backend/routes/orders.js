const express = require("express");
const {
  postPremiumMembership,
  preMembership,
} = require("../controllers/orders");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

router.post("/purchase-premium", authenticateToken, postPremiumMembership);
router.post("/razorpay-webhook", authenticateToken, preMembership);

module.exports = router;
