const express = require("express");
const router = express.Router();
const {
  createNewUser,
  login,
  updateUser,
  refresh,
} = require("../controllers/auth.controller");

const loginLimiter = require("../middleware/loginLimiter");
const verifyToken = require("../middleware/verifyToken");

router.route("/signup").post(createNewUser);

router.route("/login").post(loginLimiter, login);

router.route("/refresh").get(refresh);

router.route("/login/:id").patch(verifyToken,updateUser);

module.exports = router;