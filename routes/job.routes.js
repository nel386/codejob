const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  getAllJobs,
  getJobsAppliedByLoginId,
  removeJobApplication,
  getJobList,
  createJob,
  getJobByJobId,
} = require("../controllers/job.controller");
const { verify } = require("jsonwebtoken");

router.route("/all-jobs").get(verifyToken, getAllJobs);

router.get("/jobs-applied/:loginId", verifyToken, getJobsAppliedByLoginId);

router.delete(
  "/jobs-applied/:loginId/:jobId",
  verifyToken,
  removeJobApplication
);

router.get("/job-list",verifyToken, getJobList);

router.post("/post-job",verifyToken, createJob);

router.get("/job-single/:jobId",verifyToken, getJobByJobId);

module.exports = router;
