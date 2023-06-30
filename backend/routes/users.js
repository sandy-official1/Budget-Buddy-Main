const express = require("express");
const { postSigninUser, postSignupUser } = require("../Controllers/users");

const router = express.Router();

//users
router.post("/signup", postSignupUser);
router.post("/signin", postSigninUser);

module.exports = router;
