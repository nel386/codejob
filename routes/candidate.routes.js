const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  getCandidateByLoginId,
  getAllCandidates,
} = require("../controllers/candidate.controller");

router.route("/all-candidates").get(verifyToken, getAllCandidates);

router.route("/:loginId").get(verifyToken, getCandidateByLoginId);

module.exports = router;
