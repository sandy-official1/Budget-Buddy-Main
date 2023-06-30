const express = require("express");
const {
  PostForgotPassword,
  getForgotPassword,
  postResetPassword,
} = require("../controllers/forgotPassWordRequest");
const router = express.Router();

router.post("/password/forgotpassword", PostForgotPassword);
router.get("/password/resetpassword/:id", getForgotPassword);
router.post("/password/resetpassword/:id", postResetPassword);

module.exports = router;
