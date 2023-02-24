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

router.route("/all-jobs").get(verifyToken, getAllJobs);

router.get("/jobs-applied/:loginId", verifyToken, getJobsAppliedByLoginId);

router.delete(
  "/jobs-applied/:loginId/:jobId",
  verifyToken,
  removeJobApplication
);

router.get("/job-list", getJobList);

router.post("/post-job", createJob);

router.get("/job-single/:jobId", getJobByJobId);

module.exports = router;
